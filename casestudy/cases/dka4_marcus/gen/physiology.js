/* DKA patient 4 (Marcus Reyes): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Thu 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40504) and the students chart them. */
const { at, slug, hOfStamp, H } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
const F = c => Math.round((c * 9 / 5 + 32) * 10) / 10;   // Celsius to Fahrenheit (design lists Celsius)
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  [T('Thu', '02:00'), F(37.8), 118, 104, 62, 28, 98, RA, 4, 'ED triage (deep respirations, awake and oriented)', 'Cardiac monitor'],
  [T('Thu', '03:00'), F(37.7), 110, 112, 68, 26, 98, RA, 3, 'ED, after two small saline boluses', 'Cardiac monitor'],
  [T('Thu', '05:00'), F(37.5), 102, 116, 70, 24, 98, RA, 2, 'ED, nausea improving', 'Cardiac monitor'],
  // ---- simulation starts Thu 07:00 (arrival to step-down/telemetry). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Thu', '07:00'), F(37.3), 96, 118, 72, 22, 97, RA, 2, 'Step-down / telemetry arrival', 'Cardiac monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 55 ? 'Low' : ''); mk('HRSRC', 'HR Source', hsrc); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 140 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Left arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 20 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2); mk('PAIN', 'Pain', `${pain}/10`);
  });
  return out;
}

// entries: [collected, value, availableAt (optional result time)]
function lab(category, label, units, reference, lo, hi, entries, o = {}) {
  const dec = o.dec || 0, crit = o.crit || [];
  return entries.map(([t, value, avail]) => {
    const v = typeof value === 'number' ? value : NaN; let flag = '';
    if (!isNaN(v)) { if (hi !== null && v > hi) flag = 'High'; if (lo !== null && v < lo) flag = 'Low'; if (crit[0] !== undefined && v < crit[0]) flag = 'Critical Low'; if (crit[1] !== undefined && v > crit[1]) flag = 'Critical High'; }
    if (o.abn && isNaN(v) && o.abn.test(String(value))) flag = 'Abnormal';
    const r = { id: `lab_${slug(label)}_${t.replace(/[- :]/g, '_')}`, type: 'lab', category, code: label, label, value: isNaN(v) ? String(value) : v.toFixed(dec), units, flag, reference, specimen: o.specimen || 'Blood', status: o.status || 'Final', collected: t };
    if (avail) r.availableAt = avail;
    return r;
  });
}
// eGFR, CKD-EPI 2021 (race-free), 31-year-old man. The design's printed values equal this equation to the whole number. NOT a measured GFR and unreliable while
// creatinine is changing (stated in the chart reference column and in the pharmacy and nephrology notes).
const AGE = 31;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.9, 1), -0.302) * Math.pow(Math.max(cr / 0.9, 1), -1.2) * Math.pow(0.9938, AGE));
// Chemistry panels from the design (Section 3). t = collected, r = result available (the design's own times: gas/BMP/BHB released 20-40 minutes after collection).
// Serum total CO2 (BMP) is the HCO3 used for every anion gap. ALL gases are venous. Ca in mg/dL.
const R = (d, t) => T(d, t);
const PANELS = [
  { k: 'ED', t: R('Thu', '02:00'), r: R('Thu', '02:20'), Na: 130, K: 5.8, Cl: 95, CO2: 10, BUN: 64, Cr: 3.4, Glu: 620, AGdesign: 25, pH: 7.22, pCO2: 25, BHB: 7.2, Phos: 5.6, Mg: 2.1, Ca: 9.0 },
  { k: 'P1', t: R('Thu', '04:00'), r: R('Thu', '04:20'), Na: 132, K: 5.0, Cl: 99, CO2: 12, BUN: 62, Cr: 3.3, Glu: 540, AGdesign: 21, pH: 7.25, pCO2: 28, BHB: 6.4, Phos: 4.8, Mg: 2.0, Ca: 8.8 },
  { k: 'P2', t: R('Thu', '06:40'), r: R('Thu', '07:00'), Na: 135, K: 4.2, Cl: 103, CO2: 14, BUN: 59, Cr: 3.2, Glu: 380, AGdesign: 18, pH: 7.29, pCO2: 30, BHB: 4.8, Phos: 3.8, Mg: 1.9, Ca: 8.6 },
  { k: 'P3', t: R('Thu', '08:40'), r: R('Thu', '09:00'), Na: 136, K: 3.6, Cl: 105, CO2: 15, BUN: 58, Cr: 3.3, Glu: 250, AGdesign: 16, pH: 7.29, pCO2: 32, BHB: 3.6, Phos: 3.0, Mg: 1.8, Ca: 8.5 },
  { k: 'P4', t: R('Thu', '10:40'), r: R('Thu', '11:00'), Na: 137, K: 3.4, Cl: 106, CO2: 16, BUN: 58, Cr: 3.4, Glu: 195, AGdesign: 15, pH: 7.32, pCO2: 32, BHB: 2.4, Phos: 2.2, Mg: 1.8, Ca: 8.4 },
  { k: 'P5', t: R('Thu', '12:40'), r: R('Thu', '13:00'), Na: 138, K: 3.8, Cl: 107, CO2: 17, BUN: 59, Cr: 3.5, Glu: 215, AGdesign: 14, pH: 7.33, pCO2: 33, BHB: 1.8, Phos: 1.8, Mg: 1.8, Ca: 8.4 },
  { k: 'P6', t: R('Thu', '14:40'), r: R('Thu', '15:00'), Na: 138, K: 4.3, Cl: 108, CO2: 18, BUN: 58, Cr: 3.5, Glu: 203, AGdesign: 12, pH: 7.35, pCO2: 34, BHB: 1.0, Phos: 1.7, Mg: 1.8, Ca: 8.4 },
  { k: 'P7', t: R('Thu', '18:40'), r: R('Thu', '19:00'), Na: 138, K: 4.6, Cl: 108, CO2: 21, BUN: 56, Cr: 3.3, Glu: 180, AGdesign: 9, pH: 7.38, pCO2: 37, BHB: 0.4, Phos: 1.9, Mg: 1.9, Ca: 8.5 },
  { k: 'P8', t: R('Fri', '06:40'), r: R('Fri', '07:00'), Na: 139, K: 4.8, Cl: 109, CO2: 22, BUN: 50, Cr: 3.0, Glu: 62, AGdesign: 8, BHB: 0.3, Phos: 2.2, Mg: 1.9, Ca: 8.6 },
  { k: 'P9', t: R('Fri', '18:40'), r: R('Fri', '19:00'), Na: 138, K: 5.2, Cl: 108, CO2: 23, BUN: 44, Cr: 2.8, Glu: 168, AGdesign: 7, Phos: 2.5, Mg: 1.9, Ca: 8.7 },
  { k: 'P10', t: R('Sat', '06:40'), r: R('Sat', '07:00'), Na: 139, K: 4.8, Cl: 108, CO2: 23, BUN: 39, Cr: 2.5, Glu: 134, AGdesign: 8, Phos: 2.8, Mg: 2.0, Ca: 8.8 },
  { k: 'P11', t: R('Sat', '18:40'), r: R('Sat', '19:00'), Na: 139, K: 4.6, Cl: 107, CO2: 24, BUN: 34, Cr: 2.3, Glu: 158, AGdesign: 8, Phos: 3.1, Mg: 2.0, Ca: 8.9 },
  { k: 'P12', t: R('Sun', '06:40'), r: R('Sun', '07:00'), Na: 139, K: 4.5, Cl: 107, CO2: 24, BUN: 30, Cr: 2.2, Glu: 128, AGdesign: 8, Phos: 3.2, Mg: 2.0, Ca: 9.0 }
];
// potassium-only specimens (design Section 3)
const KONLY = [{ t: R('Thu', '05:00'), r: R('Thu', '05:10'), K: 4.7 }, { t: R('Thu', '11:50'), r: R('Thu', '12:00'), K: 3.5 }, { t: R('Fri', '19:50'), r: R('Fri', '20:00'), K: 5.1 }];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 100) / 100;   // ADA factor 1.6 per 100 mg/dL over 100
const effOsm = p => Math.round((2 * p.Na + p.Glu / 18) * 10) / 10;
const calcOsm = p => Math.round((2 * p.Na + p.Glu / 18 + p.BUN / 2.8) * 10) / 10;
const hh = p => 6.1 + Math.log10(p.CO2 / (0.03 * p.pCO2));   // Henderson-Hasselbalch with serum total CO2

// point-of-care glucose (meter docks to the chart). [day, time, value]
const POC = [
  ['Thu', '02:00', 620], ['Thu', '03:00', 600], ['Thu', '04:00', 540], ['Thu', '05:00', 480], ['Thu', '06:00', 420],
  ['Thu', '07:00', 360], ['Thu', '08:00', 300], ['Thu', '09:00', 240], ['Thu', '10:00', 205], ['Thu', '11:00', 190], ['Thu', '12:00', 210], ['Thu', '13:00', 220], ['Thu', '14:00', 210],
  ['Thu', '15:00', 200], ['Thu', '16:00', 190], ['Thu', '17:00', 185], ['Thu', '18:00', 180], ['Thu', '19:00', 178], ['Thu', '20:00', 190], ['Thu', '21:00', 214],
  ['Fri', '02:00', 108], ['Fri', '06:45', 58], ['Fri', '07:00', 92], ['Fri', '07:30', 106], ['Fri', '08:00', 112], ['Fri', '12:00', 174], ['Fri', '18:00', 188], ['Fri', '21:00', 154],
  ['Sat', '02:00', 118], ['Sat', '08:00', 132], ['Sat', '12:00', 166], ['Sat', '18:00', 158], ['Sat', '21:00', 146], ['Sun', '02:00', 122], ['Sun', '07:00', 128]
].map(([d, t, v]) => [T(d, t), v]);

// ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology (gen/ecg/make_ecgs.py has the same text)
const ECG_LINES = [
  [T('Thu', '02:10'), T('Thu', '02:20'), 'Sinus tachycardia 116 bpm, PR 152 ms, QRS 90 ms, QTc 426 ms (Fridericia). No tall narrow peaked T waves, no loss of P waves, no QRS widening. A normal-looking tracing does not exclude hyperkalemia (potassium 5.8 at 0200).'],
  [T('Thu', '11:05'), T('Thu', '11:10'), 'Sinus rhythm 92 bpm, PR 156 ms, QRS 88 ms, QTc 438 ms (Fridericia). Mild nonspecific T-wave flattening; no prominent U waves, no ectopy (potassium 3.4 at 1040).'],
  [T('Thu', '18:55'), T('Thu', '19:00'), 'Sinus rhythm 88 bpm, PR 158 ms, QRS 88 ms, QTc 424 ms (Fridericia). Normal T-wave contour; no ischemic or conduction change (potassium 4.6 at 1840).'],
  [T('Fri', '19:10'), T('Fri', '19:20'), 'Sinus rhythm 80 bpm, PR 160 ms, QRS 90 ms, QTc 422 ms (Fridericia). No peaked T waves or QRS widening despite mild hyperkalemia (potassium 5.2 at 1840); continue laboratory surveillance.']
];

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const withK = key => key === 'K' ? PANELS.map(p => [p.t, p.K, p.r]).concat(KONLY.map(k => [k.t, k.K, k.r])).sort((a, b) => a[0].localeCompare(b[0])) : has(key).map(p => [p.t, p[key], p.r]);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, withK(key), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0', 3.5, 5.0, 1, { crit: [3.0, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-99 fasting (acute illness targets differ)', 70, 99, 0, { crit: [50, 500] });
  pn('Calcium', 'Ca', 'mg/dL', '8.6-10.2', 8.6, 10.2, 1);
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.4', 1.7, 2.4, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2, no potassium)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', '90 or higher (automatic estimate: NOT a measured GFR, unreliable while creatinine is changing; do not use alone for dosing)', 90, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.r]), { dec: 1, crit: [undefined, 3.0] }));
  const g = has('pH');
  const gas = (label, units, ref, lo, hi, key, dec, o) => add(lab('Blood Gas', label, units, ref, lo, hi, g.map(p => [p.t, p[key], p.r]), Object.assign({ dec, specimen: 'Venous blood' }, o || {})));
  gas('pH, blood gas', '', '7.31-7.41 venous', 7.31, 7.41, 'pH', 2, { crit: [7.25] });
  gas('pCO2, blood gas', 'mmHg', '41-51 venous', 41, 51, 'pCO2', 0);
  // first-draw extras (ED 0200, result 0220): albumin, lactate, CBC, HbA1c (released 0700 from the 0200 specimen); urinalysis (collected 0250, result 0320); respiratory PCR (collected 0200, result 0400)
  const ED = T('Thu', '02:00'), EDR = T('Thu', '02:20');
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[ED, 4.0, EDR]], { dec: 1 }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[ED, 1.5, EDR]], { dec: 1, specimen: 'Venous blood' }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 without diabetes (individualized goal with diabetes)', null, 5.6, [[ED, 8.9, T('Thu', '07:00')]], { dec: 1 }));
  const CB = [[ED, EDR], [T('Fri', '06:40'), T('Fri', '07:00')], [T('Sun', '06:40'), T('Sun', '07:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'x10^3/uL', '4-11', 4, 11, [14.2, 9.8, 7.6], 1); cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [14.4, 12.4, 12.3], 1, { crit: [7.0] }); cb('Platelets', 'x10^3/uL', '150-400', 150, 400, [268, 240, 244], 0);
  const UT = T('Thu', '02:50'), UR = T('Thu', '03:20');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch)', abn: /\+|Large|Trace|Positive|>|Over/ }));
  ua('UA glucose', 'Negative', '4+'); ua('UA ketones', 'Negative', '3+'); ua('UA protein', 'Negative', '1+'); ua('UA nitrite', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA WBC', '0-5 /hpf', '0-2 /hpf'); ua('UA RBC', '0-3 /hpf', '0-2 /hpf');
  add(lab('Microbiology', 'Influenza A/B and SARS-CoV-2 PCR', '', 'Not detected', null, null, [[ED, 'Not detected', T('Thu', '04:00')]], { specimen: 'Nasopharyngeal swab', abn: /Detected$/ }));
  add(lab('Bedside Testing', 'Bladder scan volume', 'mL', 'Under 150 (no significant retention)', null, 150, [[T('Thu', '13:10'), 70, T('Thu', '13:10')]], { dec: 0, specimen: 'Bladder scanner' }));
  ECG_LINES.forEach(([when, avail, v]) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /flatten|tachy|prominent/i })));
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-200 on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  return out;
}

// Intake and output in 4-hour blocks (each 12-hour shift = three blocks that add up to the design's shift totals); each block shows when it ends (collected) with periodEnd: true.
// iv = IV fluid; ivmed = insulin carrier + KCl riders + ondansetron + saline flushes (all IV med). Volumes from gen/infusions.js; flush times/volumes are listed in FLUSH.
const I = require('./infusions');
const vB = [0, 4, 8, 12, 16, 20].map(h => I.vol(h * 60, h * 60 + 240)), vED = I.vol(I.M('Thu', '02:00'), 0);
const FLUSH = [['Thu', '10:00', 10], ['Thu', '16:00', 10], ['Thu', '21:05', 20], ['Fri', '09:00', 10], ['Fri', '15:30', 10], ['Fri', '21:00', 10], ['Sat', '05:00', 10], ['Sat', '10:00', 10], ['Sat', '22:00', 10]];   // [day, time, mL]
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Thu', '07:00'), 'ED 0200-0700', { po: 0, iv: vED.fluid, ivmed: vED.insulin + 2 + 20, urine: 250, emesis: 100 }, `ED (before the 12-hour shifts; handoff totals are NOT added again to shift 1). IV fluid: NS 250 mL 0200-0230 + NS 250 mL 0230-0300 + NS 100 mL/h 0300-0700 (400 mL) = ${vED.fluid} mL. IV med: regular insulin 8 mL/h from 0300 (${vED.insulin} mL) + ondansetron 2 mL + NS flushes 20 mL = ${vED.insulin + 22} mL. NPO. Emesis 100 mL (about 0220). Voids 0250 100 mL (urine specimen), 0500 150 mL. Intake 954, output 350, net +604. Weight 80.0 kg at 0200, 80.5 kg standing at 0700.`],
  [T('Thu', '11:00'), '0700-1100', { po: 100, iv: vB[0].fluid, ivmed: vB[0].insulin + 10, urine: 200, emesis: 0 }, `Day 1 day shift, block 1. IV fluid: NS 100 mL/h 0700-0900 (200 mL) + D5NS 100 mL/h 0900-1100 (200 mL) = ${vB[0].fluid} mL. IV med: insulin 8 mL/h 0700-0900 + 4 mL/h 0900-1100 (${vB[0].insulin} mL) + NS flush 1000 10 mL. Water sips and ice chips 100 mL. Hourly voids 50 mL x 4 (0745, 0845, 0945, 1045).`],
  [T('Thu', '15:00'), '1100-1500', { po: 50, iv: vB[1].fluid, ivmed: vB[1].insulin + vB[1].kcl, urine: 125, emesis: 0 }, `IV fluid: D5NS 100 mL/h 1100-1300 (200 mL) + D10W 50 mL/h 1300-1500 (100 mL) = ${vB[1].fluid} mL. IV med: insulin HELD 1100-1300, then 4 mL/h 1300-1500 (${vB[1].insulin} mL) + KCl 10 mEq/100 mL riders 1100-1200 and 1200-1300 (${vB[1].kcl} mL). Sips 50 mL. Hourly voids 1145 50 mL, 1245 25, 1345 25, 1445 25 (125 mL). Bladder scan 1310: 70 mL.`],
  [T('Thu', '19:00'), '1500-1900', { po: 50, iv: vB[2].fluid, ivmed: vB[2].insulin + 10, urine: 125, emesis: 0 }, `IV fluid: D10W 50 mL/h (${vB[2].fluid} mL). IV med: insulin 4 mL/h (${vB[2].insulin} mL) + NS flush 1600 10 mL. Sips 50 mL. Hourly voids 1545 25 mL, 1645 25, 1745 25, 1845 50 (125 mL). Shift 1 total: intake 1,368 (IV fluid 900 + IV med 268 + PO 200), output 450.`],
  [T('Thu', '23:00'), '1900-2300', { po: 400, iv: vB[3].fluid, ivmed: vB[3].insulin + 20, urine: 400, emesis: 0 }, `Day 1 night shift, block 1. IV fluid: D10W 50 mL/h 1900-2100 (${vB[3].fluid} mL). IV med: insulin 4 mL/h to 2100 (${vB[3].insulin} mL) + NS flush 2105 10 mL per IV (20 mL). Late dinner at 1900 with water and milk 400 mL. Voids 1930 150 mL, 2200 250 mL.`],
  [T('Fri', '03:00'), '2300-0300', { po: 100, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 100 mL. Voids 0030 150 mL, 0215 150 mL (0200 safety glucose 108).'],
  [T('Fri', '07:00'), '0300-0700', { po: 200, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 80 mL at 0630 and 120 mL apple juice at 0645 (15 g carbohydrate for the glucose of 58). The 0700 solid snack adds no measured liquid. Voids 0430 150 mL, 0630 150 mL. Standing weight 0700: 81.0 kg. Shift 2 total: intake 828, output 1,000.'],
  [T('Fri', '11:00'), '0700-1100', { po: 400, iv: 0, ivmed: 10, urine: 450, emesis: 0 }, 'Day 2 day shift, block 1. Breakfast 0800 and fluids 400 mL (carbohydrate and protein snack at 0700 adds no measured liquid). NS flush 0900 10 mL. Voids 0745 250 mL, 0945 200 mL.'],
  [T('Fri', '15:00'), '1100-1500', { po: 600, iv: 0, ivmed: 0, urine: 550, emesis: 0 }, 'Lunch at 1200 and divided drinks 600 mL. Voids 1130 250 mL, 1330 300 mL.'],
  [T('Fri', '19:00'), '1500-1900', { po: 600, iv: 0, ivmed: 10, urine: 450, emesis: 0 }, 'Divided drinks 600 mL; dinner at 1800 is counted in the same block. NS flush 1530 10 mL. Voids 1630 250 mL, 1815 200 mL. Shift 3 total: intake 1,620, output 1,450.'],
  [T('Fri', '23:00'), '1900-2300', { po: 350, iv: 0, ivmed: 10, urine: 350, emesis: 0 }, 'Day 2 night shift, block 1. Evening fluids 350 mL. NS flush 2100 10 mL. Voids 1945 150 mL, 2200 200 mL.'],
  [T('Sat', '03:00'), '2300-0300', { po: 100, iv: 0, ivmed: 0, urine: 250, emesis: 0 }, 'Water 100 mL. Voids 0030 100 mL, 0215 150 mL (0200 safety glucose 118).'],
  [T('Sat', '07:00'), '0300-0700', { po: 150, iv: 0, ivmed: 10, urine: 250, emesis: 0 }, 'Water 150 mL. NS flush 0500 10 mL. Voids 0430 100 mL, 0630 150 mL. Standing weight 0700: 80.6 kg. Shift 4 total: intake 620, output 850.'],
  [T('Sat', '11:00'), '0700-1100', { po: 500, iv: 0, ivmed: 10, urine: 500, emesis: 0 }, 'Day 3 day shift, block 1. Breakfast 0800 and fluids 500 mL. NS flush 1000 10 mL. Voids 0800 250 mL, 0945 250 mL.'],
  [T('Sat', '15:00'), '1100-1500', { po: 800, iv: 0, ivmed: 0, urine: 700, emesis: 0 }, 'Lunch at 1200 and divided drinks 800 mL. Voids 1130 250 mL, 1300 250 mL, 1430 200 mL.'],
  [T('Sat', '19:00'), '1500-1900', { po: 500, iv: 0, ivmed: 0, urine: 500, emesis: 0 }, 'Divided drinks 500 mL; dinner at 1800 counted in the same block. Voids 1600 250 mL, 1745 250 mL. Shift 5 total: intake 1,810, output 1,700.'],
  [T('Sat', '23:00'), '1900-2300', { po: 300, iv: 0, ivmed: 10, urine: 300, emesis: 0 }, 'Day 3 night shift, block 1. Evening fluids 300 mL. NS flush 2200 10 mL (last scheduled flush). Voids 2000 150 mL, 2215 150 mL.'],
  [T('Sun', '03:00'), '2300-0300', { po: 100, iv: 0, ivmed: 0, urine: 250, emesis: 0 }, 'Water 100 mL. Voids 0030 100 mL, 0215 150 mL (0200 safety glucose 122).'],
  [T('Sun', '07:00'), '0300-0700', { po: 100, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 100 mL. Voids 0430 150 mL, 0630 150 mL. Standing weight 0700: 80.1 kg. Shift 6 total: intake 510, output 850.']
];
function buildIO() {
  return BLOCKS.map(([t2, time, d, note]) => {
    const intake = d.po + d.iv + d.ivmed, output = d.urine + d.emesis;
    const detail = { po: d.po, iv: d.iv, urine: d.urine };
    if (d.ivmed) { detail.intakeOther = d.ivmed; detail.intakeOtherLabel = 'IV med'; }
    detail.other = d.emesis; detail.otherLabel = d.emesis ? 'Emesis' : '';
    return { id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time, collected: t2, periodEnd: true, intake, output, detail, note };
  });
}
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, KONLY, POC, BLOCKS, FLUSH, ag, corrNa, effOsm, calcOsm, egfr, hh, F, ECG_LINES };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), p.AGdesign === ag(p) ? 'ok' : `MISMATCH design ${p.AGdesign}`, 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), 'eGFR', egfr(p.Cr), p.pH ? `HH pH ${hh(p).toFixed(2)} (charted ${p.pH}) Winter ${(1.5 * p.CO2 + 8).toFixed(1)}+-2 (arterial) vs venous pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev) { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && hOfStamp(t) < 8) console.log(t.slice(5), v, 'fall/h', ((prev[1] - v) / dh).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to, '(ED + simulation)');
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED', '2026-11-05 00:00', T('Thu', '07:00')], ['D1 day', T('Thu', '07:00'), T('Thu', '19:00')], ['D1 night', T('Thu', '19:00'), T('Fri', '07:00')], ['D2 day', T('Fri', '07:00'), T('Fri', '19:00')], ['D2 night', T('Fri', '19:00'), T('Sat', '07:00')],
   ['D3 day', T('Sat', '07:00'), T('Sat', '19:00')], ['D3 night', T('Sat', '19:00'), T('Sun', '07:00')], ['Simulation', T('Thu', '07:00'), T('Sun', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n.padEnd(11), 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
  const fl = {}; FLUSH.forEach(([d, t, v]) => { const k = hOfStamp(T(d, t)); const sh = Math.floor(k / 12); fl[sh] = (fl[sh] || 0) + v; }); console.log('flush mL per 12-h shift (0=shift 1):', JSON.stringify(fl));
}

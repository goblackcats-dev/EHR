/* DKA patient 5 (Ruth Nakamura): vital signs (ED and the 0700 arrival set ONLY), labs and cultures (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Thu 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40505) and the students chart them. */
const { at, slug, hOfStamp, H } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
const F = c => Math.round((c * 9 / 5 + 32) * 10) / 10;   // Celsius to Fahrenheit (design lists Celsius)
// [datetime, temp C, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  [T('Thu', '01:00'), 39.1, 118, 92, 54, 28, 97, RA, 4, 'ED arrival (deep respirations, confused)', 'Cardiac monitor'],
  [T('Thu', '02:00'), 38.8, 112, 102, 58, 26, 98, RA, 4, 'ED, during the third LR bolus', 'Cardiac monitor'],
  [T('Thu', '04:00'), 38.3, 106, 112, 62, 24, 98, RA, 3, 'ED, after the crystalloid resuscitation', 'Cardiac monitor'],
  [T('Thu', '06:55'), 38.0, 104, 116, 64, 24, 98, RA, 3, 'ED, before transfer', 'Cardiac monitor'],
  // ---- simulation starts Thu 07:00 (arrival to the ICU). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Thu', '07:00'), 38.0, 104, 116, 64, 24, 98, RA, 3, 'ICU arrival', 'Cardiac monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tc, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const tf = F(tc);
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
// Chemistry panels from the design (Section 3). t = collected, r = result available (the design's own times). Serum total CO2 (BMP) is the HCO3 used for every anion gap.
// Gases: the first two are ARTERIAL (single radial punctures), every later gas is VENOUS.
const R = (d, t) => T(d, t);
const PANELS = [
  { k: 'ED', t: R('Thu', '01:10'), r: R('Thu', '01:30'), Na: 134, K: 4.8, Cl: 101, CO2: 9, BUN: 36, Cr: 1.2, Glu: 210, AGdesign: 24, pH: 7.12, pCO2: 29, art: true, BHB: 6.8, Lac: 3.2, Phos: 3.8, Mg: 1.8 },
  { k: 'P1', t: R('Thu', '03:20'), r: R('Thu', '03:30'), Na: 136, K: 4.0, Cl: 105, CO2: 10, BUN: 33, Cr: 1.1, Glu: 192, AGdesign: 21, pH: 7.25, pCO2: 24, art: true, BHB: 5.7, Lac: 2.2, Phos: 2.8, Mg: 1.7 },
  { k: 'P2', t: R('Thu', '06:50'), r: R('Thu', '07:00'), Na: 137, K: 3.3, Cl: 108, CO2: 12, BUN: 29, Cr: 1.0, Glu: 168, AGdesign: 17, pH: 7.28, pCO2: 26, BHB: 4.1, Lac: 1.6, Phos: 2.0, Mg: 1.6 },
  { k: 'P3', t: R('Thu', '11:00'), r: R('Thu', '11:10'), Na: 138, K: 4.0, Cl: 109, CO2: 14, BUN: 26, Cr: 0.9, Glu: 172, AGdesign: 15, pH: 7.30, pCO2: 29, BHB: 2.8, Phos: 1.8, Mg: 1.6 },
  { k: 'P4', t: R('Thu', '14:50'), r: R('Thu', '15:00'), Na: 138, K: 3.8, Cl: 110, CO2: 17, BUN: 23, Cr: 0.9, Glu: 186, AGdesign: 11, pH: 7.33, pCO2: 33, BHB: 1.2, Phos: 1.7, Mg: 1.9 },
  { k: 'P5', t: R('Thu', '18:50'), r: R('Thu', '19:00'), Na: 139, K: 4.1, Cl: 110, CO2: 18, BUN: 22, Cr: 0.9, Glu: 176, AGdesign: 11, pH: 7.35, pCO2: 34, BHB: 0.7, Phos: 1.9, Mg: 1.9 },
  { k: 'P6', t: R('Thu', '22:50'), r: R('Thu', '23:00'), Na: 139, K: 4.0, Cl: 110, CO2: 19, BUN: 21, Cr: 0.9, Glu: 170, AGdesign: 10, pH: 7.36, pCO2: 35, BHB: 0.4, Phos: 2.1, Mg: 1.9 },
  { k: 'P7', t: R('Fri', '06:50'), r: R('Fri', '07:00'), Na: 139, K: 4.0, Cl: 108, CO2: 21, BUN: 19, Cr: 0.8, Glu: 164, AGdesign: 10, pH: 7.38, pCO2: 36, BHB: 0.3, Phos: 2.4, Mg: 2.0 },
  { k: 'P8', t: R('Fri', '18:50'), r: R('Fri', '19:00'), Na: 139, K: 4.0, Cl: 106, CO2: 23, BUN: 18, Cr: 0.8, Glu: 192, AGdesign: 10 },
  { k: 'P9', t: R('Sat', '06:50'), r: R('Sat', '07:00'), Na: 140, K: 4.1, Cl: 107, CO2: 24, BUN: 15, Cr: 0.8, Glu: 154, AGdesign: 9, Phos: 2.9, Mg: 1.9 },
  { k: 'P10', t: R('Sat', '18:50'), r: R('Sat', '19:00'), Na: 139, K: 4.0, Cl: 106, CO2: 24, BUN: 14, Cr: 0.8, Glu: 118, AGdesign: 9 },
  { k: 'P11', t: R('Sun', '06:50'), r: R('Sun', '07:00'), Na: 140, K: 4.1, Cl: 107, CO2: 24, BUN: 14, Cr: 0.8, Glu: 145, AGdesign: 9, Phos: 3.2, Mg: 2.0 }
];
// potassium-only specimen (design Section 3): 0900 -> 0910, after the first 20 mEq of unit potassium
const KONLY = [{ t: R('Thu', '09:00'), r: R('Thu', '09:10'), K: 3.7 }];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 100) / 100;   // factor 1.6 per 100 mg/dL over 100
const effOsm = p => Math.round((2 * p.Na + p.Glu / 18) * 10) / 10;
const calcOsm = p => Math.round((2 * p.Na + p.Glu / 18 + p.BUN / 2.8) * 10) / 10;
const hh = p => 6.1 + Math.log10(p.CO2 / (0.03 * p.pCO2));   // Henderson-Hasselbalch with serum total CO2
const winters = p => 1.5 * p.CO2 + 8;                          // expected ARTERIAL pCO2 +/- 2
const cg = (age, kg, cr, female) => Math.round((140 - age) * kg / (72 * cr) * (female ? 0.85 : 1));   // Cockcroft-Gault creatinine clearance (mL/min), used in the pharmacy note only

// point-of-care glucose (meter docks to the chart): hourly on the insulin infusion (including the hold), then AC/HS and the extra checks of the design (Section 3)
const POC = [
  ['Thu', '02:00', 203], ['Thu', '03:00', 194], ['Thu', '04:00', 186], ['Thu', '05:00', 174], ['Thu', '06:00', 168], ['Thu', '07:00', 168],
  ['Thu', '08:00', 156], ['Thu', '09:00', 154], ['Thu', '10:00', 164], ['Thu', '11:00', 172], ['Thu', '12:00', 164], ['Thu', '13:00', 148],
  ['Thu', '14:00', 166], ['Thu', '15:00', 186], ['Thu', '16:00', 190], ['Thu', '17:00', 182], ['Thu', '18:00', 178], ['Thu', '19:00', 176],
  ['Thu', '20:00', 172], ['Thu', '21:00', 168], ['Thu', '22:00', 166], ['Thu', '23:00', 170], ['Fri', '00:00', 174], ['Fri', '01:00', 178], ['Fri', '02:00', 182],
  ['Fri', '07:30', 164], ['Fri', '11:30', 188], ['Fri', '17:30', 204], ['Fri', '20:15', 186], ['Fri', '21:00', 182],
  ['Sat', '07:30', 154], ['Sat', '11:30', 176], ['Sat', '17:30', 142], ['Sat', '21:00', 63], ['Sat', '21:15', 88], ['Sat', '21:30', 107], ['Sat', '22:00', 126],
  ['Sun', '03:00', 132], ['Sun', '07:00', 145]
].map(([d, t, v]) => [T(d, t), v]);

// ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology (gen/ecg/make_ecgs.py has the same text)
// [acquired, result available, text]
const ECG_LINES = [
  [T('Thu', '01:15'), T('Thu', '01:30'), 'Sinus tachycardia 118 bpm, PR 156 ms, QRS 86 ms, QTc 445 ms (Fridericia). Normal T-wave contour without peaking, no ischemic ST pattern (potassium 4.8 on the first specimen).'],
  [T('Thu', '07:05'), T('Thu', '07:15'), 'Sinus tachycardia 104 bpm, PR 164 ms, QRS 88 ms, QTc 462 ms (Fridericia, U wave excluded). Mild diffuse T-wave flattening with small U waves; no QRS widening or ventricular ectopy (potassium 3.3).'],
  [T('Thu', '11:15'), T('Thu', '11:25'), 'Sinus rhythm 96 bpm, PR 160 ms, QRS 86 ms, QTc 446 ms (Fridericia). T waves have recovered, no distinct U waves, no ectopy (potassium 4.0 at 1100, after 40 mEq of unit potassium).'],
  [T('Fri', '19:00'), T('Fri', '19:10'), 'Sinus rhythm 80 bpm, PR 166 ms, QRS 86 ms, QTc 438 ms (Fridericia). Normal T-wave amplitude, U waves no longer apparent, narrow QRS (potassium 4.0 on the 1850 specimen).']
];

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const withK = key => key === 'K' ? PANELS.map(p => [p.t, p.K, p.r]).concat(KONLY.map(k => [k.t, k.K, k.r])).sort((a, b) => a[0].localeCompare(b[0])) : has(key).map(p => [p.t, p[key], p.r]);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, withK(key), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0', 3.5, 5.0, 1, { crit: [3.0, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.6-1.1 (baseline 0.7)', 0.6, 1.1, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', 'fasting 70-99 (acute illness targets differ)', 70, 99, 0, { crit: [50, 500] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.4', 1.7, 2.4, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2, no potassium; albumin near normal, no correction)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.r]), { dec: 1, crit: [undefined, 3.0] }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, has('Lac').map(p => [p.t, p.Lac, p.r]), { dec: 1, specimen: 'Arterial / venous blood' }));
  const g = has('pH'), ga = g.filter(p => p.art), gv = g.filter(p => !p.art);
  const gas = (label, units, ref, lo, hi, key, dec, set, specimen, o) => add(lab('Blood Gas', label, units, ref, lo, hi, set.map(p => [p.t, p[key], p.r]), Object.assign({ dec, specimen }, o || {})));
  gas('pH, blood gas', '', 'arterial 7.35-7.45; venous 7.31-7.41', 7.35, 7.45, 'pH', 2, ga, 'Arterial blood (radial puncture)', { crit: [7.25] });
  gas('pH, blood gas', '', 'arterial 7.35-7.45; venous 7.31-7.41', 7.31, 7.41, 'pH', 2, gv, 'Venous blood', { crit: [7.25] });
  gas('pCO2, blood gas', 'mmHg', 'arterial 35-45; venous 41-51', 35, 45, 'pCO2', 0, ga, 'Arterial blood (radial puncture)');
  gas('pCO2, blood gas', 'mmHg', 'arterial 35-45; venous 41-51', 41, 51, 'pCO2', 0, gv, 'Venous blood');
  // first-draw extras (ED 0110, result 0130): albumin, hemoglobin, platelets, HbA1c; CBC series (WBC from the design; the Hb and platelet values at 0650, D2 and D3 are filled in to complete each CBC, a smooth fall to the design's D4 value)
  const ED = T('Thu', '01:10'), EDR = T('Thu', '01:30');
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[ED, 3.8, EDR]], { dec: 1 }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 without diabetes (individualized goal with diabetes)', null, 5.6, [[ED, 8.1, EDR]], { dec: 1 }));
  const CB = [[ED, EDR], [T('Thu', '06:50'), T('Thu', '07:00')], [T('Fri', '06:50'), T('Fri', '07:00')], [T('Sat', '06:50'), T('Sat', '07:00')], [T('Sun', '06:50'), T('Sun', '07:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'x10^3/uL', '4.0-11.0', 4, 11, [18.6, 17.0, 12.8, 9.8, 8.2], 1); cb('Hemoglobin', 'g/dL', '12-16', 12, 16, [13.0, 12.4, 12.2, 12.0, 11.8], 1, { crit: [7.0] }); cb('Platelets', 'x10^3/uL', '150-400', 150, 400, [240, 232, 230, 229, 228], 0);
  // urinalysis (collected 0118, result 0130)
  const UT = T('Thu', '01:18'), UR = T('Thu', '01:30');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (assisted clean catch)', abn: /\+|Large|Positive|>|Many/ }));
  ua('UA glucose', 'Negative', '1,000 mg/dL or more'); ua('UA ketones', 'Negative', '3+'); ua('UA nitrite', 'Negative', 'Positive'); ua('UA leukocyte esterase', 'Negative', 'Large'); ua('UA WBC', '0-5 /hpf', 'Over 100 /hpf'); ua('UA bacteria', 'None to few', 'Many');
  // microbiology: each release time is its own result (collected = release time, as in the other chart cases); the specimen text keeps the collection time
  const micro = (label, specimen, rows, o = {}) => add(rows.map(([t, value, status, abn]) => lab('Microbiology', label, '', '', null, null, [[t, value, t]], { specimen, status, abn: abn ? /./ : undefined })[0]));
  micro('Blood cultures x2 sets (separate sites)', 'Blood, two peripheral venipunctures, aerobic and anaerobic bottles (collected 0112 and 0115, before antibiotics)', [
    [T('Thu', '01:15'), 'Collected, in process', 'In process', false],
    [T('Fri', '01:20'), 'No growth at approximately 24 hours.', 'Preliminary', false],
    [T('Sat', '01:20'), 'No growth at approximately 48 hours.', 'Preliminary', false],
    [T('Sun', '01:20'), 'No growth at approximately 72 hours. The final five-day result is not yet available.', 'Preliminary', false]]);
  micro('Urine culture', 'Urine, assisted clean catch, no catheter (collected 0118, before antibiotics)', [
    [T('Thu', '01:30'), 'Collected, in process', 'In process', false],
    [T('Thu', '18:00'), 'More than 100,000 CFU/mL gram-negative rods. Identification and susceptibilities pending.', 'Preliminary', true],
    [T('Fri', '08:00'), 'Escherichia coli identified. Susceptibilities pending.', 'Preliminary', true],
    [T('Fri', '10:45'), 'FINAL: Escherichia coli, more than 100,000 CFU/mL. No ESBL phenotype. Ampicillin: susceptible (MIC 2 mcg/mL). Amoxicillin-clavulanate: susceptible. Ceftriaxone: susceptible. Cefazolin: susceptible. Cefepime: susceptible. Trimethoprim-sulfamethoxazole: susceptible. Ciprofloxacin: RESISTANT.', 'Final', true]]);
  ECG_LINES.forEach(([when, avail, v]) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /flatten|tachy|prominent/i })));
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal about 150-200 on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  return out;
}

// Intake and output in 4-hour blocks (each 12-hour shift = three blocks that add up to the design's shift totals); each block shows when it ends (collected) with periodEnd: true.
// iv = IV fluid (LR, NS, D10W); ivmed = insulin carrier + KCl riders + magnesium + ceftriaxone + ondansetron + saline flushes (all IV med). Volumes from gen/infusions.js.
const I = require('./infusions');
const vED = I.vol(I.M('Thu', '01:00'), 0), vB = [0, 4, 8, 12, 16, 20].map(h => I.vol(h * 60, h * 60 + 240));
const ceil = Math.ceil, flr = Math.floor;
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Thu', '07:00'), 'ED 0100-0700', { po: 0, iv: Math.round(vED.fluid), ivmed: Math.round(vED.ivmed), urine: 700, emesis: 150 }, 'ED (before the 12-hour shifts; the handoff totals are NOT added again to shift 1). IV fluid: LR 500 mL 0100-0130 + LR 500 mL 0130-0200 + LR 800 mL 0200-0300 (1,800 mL = 30 mL/kg) + LR 100 mL/h 0300-0330 (50 mL) and 0530-0700 (150 mL) + NS (potassium-free) 100 mL/h 0330-0530 (200 mL) + D10W 100 mL/h 0200-0700 (500 mL) = 2,700 mL. IV med: regular insulin 6 mL/h x 5 h (30 mL) + KCl 10 mEq/100 mL x 2 (200 mL) + ceftriaxone 100 mL + ondansetron 2 mL + NS flushes 0125, 0210, 0530 (30 mL) = 362 mL. NPO. Emesis 150 mL (once, about 0112, before the ondansetron). Voids: 0118 150 mL (clean-catch specimen), 0245 200, 0430 200, 0600 150 = 700 mL. Intake 3,062, output 850, net +2,212. Priming volume is discarded and not counted.'],
  [T('Thu', '11:00'), '0700-1100', { po: 0, iv: ceil(vB[0].fluid), ivmed: flr(vB[0].ivmed), urine: 520, emesis: 0 }, 'Day 1 day shift, block 1. IV fluid: NS (potassium-free) 100 mL/h 0700-1100 (400 mL) + D10W 50 mL/h 0700-0915 (112.5 mL) + 100 mL/h 0915-1100 (175 mL) = 687.5 mL (charted 688). IV med: insulin held 0700-0915, then 6 mL/h 0915-1100 (10.5 mL) + KCl riders 0700, 0800, 0900, 1000 (400 mL) = 410.5 mL (charted 410). NPO. Voids 0745 130 mL, 0845 120, 0945 135, 1045 135 = 520 mL (assisted, measured in the collection hat).'],
  [T('Thu', '15:00'), '1100-1500', { po: 150, iv: Math.round(vB[1].fluid), ivmed: Math.round(vB[1].ivmed), urine: 480, emesis: 0 }, 'IV fluid: D10W 100 mL/h 1100-1300 (200 mL) + 150 mL/h 1300-1500 (300 mL) = 500 mL. IV med: insulin 6 mL/h (24 mL) + magnesium sulfate 2 g in 50 mL 1130-1230 (50 mL) + NS flushes 1105 and 1230 (20 mL) = 94 mL. Supervised clear liquids from 1100: 150 mL. Voids 1145 120 mL, 1245 120, 1345 120, 1445 120 = 480 mL.'],
  [T('Thu', '19:00'), '1500-1900', { po: 150, iv: Math.round(vB[2].fluid), ivmed: Math.round(vB[2].ivmed), urine: 500, emesis: 0 }, 'IV fluid: D10W 150 mL/h (600 mL). IV med: insulin 6 mL/h (24 mL) + KCl 10 mEq/100 mL at 1500 and 1600 (200 mL) + NS flushes 1700 and 1830 (20 mL) = 244 mL. Clear liquids 150 mL. Voids 1545 125 mL, 1645 125, 1745 125, 1845 125 = 500 mL. Shift 1 total: intake 2,836 (IV fluid 1,788 + IV med 748 + PO 300), output 1,500, net +1,336.'],
  [T('Thu', '23:00'), '1900-2300', { po: 250, iv: Math.round(vB[3].fluid), ivmed: Math.round(vB[3].ivmed), urine: 520, emesis: 0 }, 'Day 1 night shift, block 1. IV fluid: D10W 150 mL/h (600 mL). IV med: insulin 6 mL/h (24 mL) + NS flush 2100 (10 mL) = 34 mL. Supervised fluids 250 mL. Voids 1945 130 mL, 2045 130, 2145 130 (commode, assisted), 2245 130 = 520 mL.'],
  [T('Fri', '03:00'), '2300-0300', { po: 150, iv: Math.round(vB[4].fluid), ivmed: Math.round(vB[4].ivmed), urine: 500, emesis: 0 }, 'IV fluid: D10W 150 mL/h until it stops at 0100 (300 mL). IV med: insulin 6 mL/h until 0100 (12 mL) + ceftriaxone 2 g in 100 mL 0140-0210 (100 mL) + NS flushes 0110 and 0210 (20 mL) = 132 mL. Fluids and a small snack drink after the transition 150 mL. Voids 2345 130 mL, 0045 120, 0145 130, 0230 120 = 500 mL.'],
  [T('Fri', '07:00'), '0300-0700', { po: 50, iv: 0, ivmed: Math.round(vB[5].ivmed), urine: 480, emesis: 0 }, 'No IV fluid. IV med: NS flush 0630 (10 mL). Sips 50 mL. Voids 0345 160 mL, 0530 160, 0645 160 = 480 mL. Shift 2 total: intake 1,526 (IV fluid 900 + IV med 176 + PO 450), output 1,500, net +26.'],
  [T('Fri', '11:00'), '0700-1100', { po: 450, iv: 0, ivmed: 10, urine: 450, emesis: 0 }, 'Day 2 day shift, block 1. Breakfast 0800 (about 45 g carbohydrate) and fluids 450 mL. NS flush 0800 (10 mL). Voids 0730 230 mL, 0930 220 mL.'],
  [T('Fri', '15:00'), '1100-1500', { po: 500, iv: 0, ivmed: 10, urine: 500, emesis: 0 }, 'Lunch 1200 and fluids 500 mL (first amoxicillin tablet with water at 1400 is included). NS flush 1200 (10 mL). Voids 1130 250 mL, 1330 250 mL.'],
  [T('Fri', '19:00'), '1500-1900', { po: 450, iv: 0, ivmed: 20, urine: 450, emesis: 0 }, 'Fluids 450 mL; dinner 1800 counted in the same block. NS flushes 1600 and 1830 (20 mL). Voids 1630 230 mL, 1815 220 mL. Shift 3 total: intake 1,440 (PO 1,400 + IV med 40), output 1,400, net +40.'],
  [T('Fri', '23:00'), '1900-2300', { po: 250, iv: 0, ivmed: 10, urine: 300, emesis: 0 }, 'Day 2 night shift, block 1. Evening fluids 250 mL. NS flush 2100 (10 mL). Voids 1945 150 mL, 2230 150 mL (assisted).'],
  [T('Sat', '03:00'), '2300-0300', { po: 200, iv: 0, ivmed: 0, urine: 250, emesis: 0 }, 'Water and a small bedtime snack drink 200 mL (with the 2300 glargine). Voids 0045 125 mL, 0230 125 mL.'],
  [T('Sat', '07:00'), '0300-0700', { po: 150, iv: 0, ivmed: 10, urine: 250, emesis: 0 }, 'Water 150 mL (with the 0600 amoxicillin). NS flush 0630 (10 mL). Voids 0430 125 mL, 0630 125 mL. Shift 4 total: intake 620 (PO 600 + IV med 20), output 800, net -180.'],
  [T('Sat', '11:00'), '0700-1100', { po: 550, iv: 0, ivmed: 10, urine: 500, emesis: 0 }, 'Day 3 day shift, block 1. Breakfast 0800 and fluids 550 mL. NS flush 0800 (10 mL). Voids 0745 250 mL, 0945 250 mL.'],
  [T('Sat', '15:00'), '1100-1500', { po: 600, iv: 0, ivmed: 10, urine: 550, emesis: 0 }, 'Lunch 1200 and fluids 600 mL. NS flush 1200 (10 mL). Voids 1130 275 mL, 1400 275 mL (transfer to the ward was at 1000).'],
  [T('Sat', '19:00'), '1500-1900', { po: 450, iv: 0, ivmed: 20, urine: 450, emesis: 0 }, 'Fluids 450 mL; dinner 1800 counted in the same block (30 g carbohydrate eaten). NS flushes 1600 and 1830 (20 mL). Voids 1600 225 mL, 1800 225 mL. Shift 5 total: intake 1,640 (PO 1,600 + IV med 40), output 1,500, net +140.'],
  [T('Sat', '23:00'), '1900-2300', { po: 400, iv: 0, ivmed: 10, urine: 350, emesis: 0 }, 'Day 3 night shift, block 1. Evening fluids 280 mL plus juice 120 mL (15 g carbohydrate) for the glucose of 63 at 2100 = 400 mL. NS flush 2100 (10 mL). Voids 2000 175 mL, 2215 175 mL.'],
  [T('Sun', '03:00'), '2300-0300', { po: 150, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 150 mL (cracker snack at 2115 adds no measured liquid). Voids 0030 150 mL, 0245 150 mL.'],
  [T('Sun', '07:00'), '0300-0700', { po: 100, iv: 0, ivmed: 10, urine: 250, emesis: 0 }, 'Water 100 mL. NS flush 0630 (10 mL). Voids 0445 125 mL, 0645 125 mL. Shift 6 total: intake 670 (PO 650 including the 120 mL juice + IV med 20), output 900, net -230.']
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, KONLY, POC, BLOCKS, ag, corrNa, effOsm, calcOsm, hh, winters, cg, F, ECG_LINES };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), p.AGdesign === ag(p) ? 'ok' : `MISMATCH design ${p.AGdesign}`, 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), 'CG', cg(67, 60, p.Cr, true), p.pH ? `HH pH ${hh(p).toFixed(2)} (charted ${p.pH}) Winter ${winters(p).toFixed(1)}+-2 (arterial) vs ${p.art ? 'ARTERIAL' : 'venous'} pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev) { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && dh <= 1.1) console.log(t.slice(5), v, 'change/h', (v - prev[1]).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to, '(ED + simulation)');
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED', '2026-11-05 00:00', T('Thu', '07:00')], ['D1 day', T('Thu', '07:00'), T('Thu', '19:00')], ['D1 night', T('Thu', '19:00'), T('Fri', '07:00')], ['D2 day', T('Fri', '07:00'), T('Fri', '19:00')], ['D2 night', T('Fri', '19:00'), T('Sat', '07:00')],
   ['D3 day', T('Sat', '07:00'), T('Sat', '19:00')], ['D3 night', T('Sat', '19:00'), T('Sun', '07:00')], ['Simulation', T('Thu', '07:00'), T('Sun', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n.padEnd(11), 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
}

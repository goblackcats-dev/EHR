/* In-class DKA patient (Caleb Mercer): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated with result times), ED point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). After Mon 0700 vital signs come from the bedside monitor (monitor.html rows for MRN SIM-40601) and the
   instructor says the bedside glucoses aloud; none of them are charted here. */
const { at, slug, hOfStamp } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text]
const SETS = [
  [T('Mon', '01:35'), 100.6, 124, 102, 60, 28, 97, RA, 6, 'ED triage (deep, fast breathing)'],
  [T('Mon', '03:00'), 100.0, 118, 106, 62, 26, 97, RA, 5, 'ED, after the first liter of saline'],
  [T('Mon', '05:00'), 99.6, 114, 108, 64, 24, 98, RA, 5, 'ED, 2 hours after the insulin infusion started'],
  [T('Mon', '06:15'), 99.4, 112, 108, 64, 24, 98, RA, 4, 'ED, before transfer'],
  // ---- Mon 07:00 arrival in SD-3. Later vital signs are on the bedside monitor and are charted by the unit RN.
  [T('Mon', '07:00'), 99.4, 112, 108, 64, 24, 98, RA, 4, 'Step-down unit arrival (SD-3)']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 55 ? 'Low' : ''); mk('HRSRC', 'HR Source', 'Cardiac monitor'); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 140 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Left arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 20 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2); mk('PAIN', 'Pain', `${pain}/10`);
  });
  return out;
}

// entries: [collected, value, availableAt (result time)]
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
// eGFR, CKD-EPI 2021 (race-free), 28-year-old man
const AGE = 28;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.9, 1), -0.302) * Math.pow(Math.max(cr / 0.9, 1), -1.2) * Math.pow(0.9938, AGE));
// Chemistry sets (DESIGN.md section 6). t = collected, g = gas result, r = BMP (with Mg, phos) result, b = beta-hydroxybutyrate result.
const PANELS = [
  { k: '1', t: T('Mon', '01:45'), g: T('Mon', '02:00'), r: T('Mon', '02:30'), b: T('Mon', '02:40'), Na: 131, K: 5.6, Cl: 95, CO2: 8, BUN: 26, Cr: 1.5, Glu: 538, Ca: 9.5, Mg: 2.2, Phos: 5.6, BHB: 6.4, pH: 7.18, pCO2: 19, HCO3: 6.8 },
  { k: '2', t: T('Mon', '05:00'), g: T('Mon', '05:15'), r: T('Mon', '05:45'), b: T('Mon', '05:55'), Na: 134, K: 4.6, Cl: 101, CO2: 10, BUN: 23, Cr: 1.3, Glu: 348, Ca: 9.0, Mg: 2.0, Phos: 3.8, BHB: 5.5, pH: 7.23, pCO2: 22, HCO3: 9.0 },
  { k: '3', t: T('Mon', '09:30'), g: T('Mon', '09:45'), r: T('Mon', '10:15'), b: T('Mon', '10:25'), Na: 136, K: 3.9, Cl: 104, CO2: 12, BUN: 19, Cr: 1.1, Glu: 200, Ca: 8.8, Mg: 1.8, Phos: 2.4, BHB: 4.1, pH: 7.27, pCO2: 25, HCO3: 11.0 },
  { k: '4', t: T('Mon', '14:00'), g: T('Mon', '14:15'), r: T('Mon', '14:45'), b: T('Mon', '14:55'), Na: 137, K: 3.2, Cl: 106, CO2: 13, BUN: 16, Cr: 1.0, Glu: 198, Ca: 8.6, Mg: 1.6, Phos: 1.9, BHB: 2.6, pH: 7.29, pCO2: 27, HCO3: 12.6 },
  { k: '5', t: T('Mon', '17:20'), g: T('Mon', '17:30'), r: T('Mon', '17:45'), b: T('Mon', '17:55'), stat: true, Na: 137, K: 3.6, Cl: 106, CO2: 13, BUN: 15, Cr: 0.9, Glu: 270, Ca: 8.6, Mg: 2.0, Phos: 2.0, BHB: 3.1, pH: 7.27, pCO2: 28, HCO3: 12.4 },
  { k: '6', t: T('Mon', '21:30'), g: T('Mon', '21:45'), r: T('Mon', '22:15'), b: T('Mon', '22:25'), Na: 139, K: 3.7, Cl: 108, CO2: 15, BUN: 12, Cr: 0.9, Glu: 196, Ca: 8.7, Mg: 1.9, Phos: 2.1, BHB: 2.0, pH: 7.31, pCO2: 30, HCO3: 14.6 },
  { k: '7', t: T('Tue', '01:30'), g: T('Tue', '01:45'), r: T('Tue', '02:15'), b: T('Tue', '02:25'), Na: 139, K: 4.0, Cl: 109, CO2: 16, BUN: 11, Cr: 0.9, Glu: 140, Ca: 8.7, Mg: 1.9, Phos: 2.3, BHB: 1.1, pH: 7.32, pCO2: 31, HCO3: 15.6 },
  { k: '8', t: T('Tue', '05:30'), g: T('Tue', '05:45'), r: T('Tue', '06:15'), b: T('Tue', '06:25'), Na: 139, K: 4.2, Cl: 108, CO2: 18, BUN: 10, Cr: 0.8, Glu: 160, Ca: 8.8, Mg: 1.9, Phos: 2.6, BHB: 0.4, pH: 7.34, pCO2: 34, HCO3: 17.6 },
  { k: '9', t: T('Tue', '09:45'), r: T('Tue', '10:30'), b: T('Tue', '10:40'), Na: 138, K: 3.6, Cl: 106, CO2: 20, BUN: 10, Cr: 0.8, Glu: 182, Ca: 8.9, Mg: 1.8, Phos: 2.4, BHB: 0.3 },
  { k: '10', t: T('Tue', '13:30'), r: T('Tue', '14:15'), b: T('Tue', '14:25'), Na: 138, K: 3.9, Cl: 105, CO2: 22, BUN: 9, Cr: 0.8, Glu: 214, Ca: 9.0, Mg: 1.9, Phos: 2.9, BHB: 0.2 },
  { k: '11', t: T('Tue', '17:30'), r: T('Tue', '18:15'), b: T('Tue', '18:25'), Na: 139, K: 4.1, Cl: 104, CO2: 23, BUN: 9, Cr: 0.8, Glu: 138, Ca: 9.1, Mg: 1.9, Phos: 3.2, BHB: 0.2 }
];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 10) / 10;   // ADA factor 1.6
const effOsm = p => Math.round(2 * p.Na + p.Glu / 18);
const calcOsm = p => Math.round(2 * p.Na + p.Glu / 18 + p.BUN / 2.8);
// ED point-of-care glucose (charted up to the 0700 arrival only; later values are said aloud by the instructor)
const POC = [['Mon', '01:38', 524], ['Mon', '03:00', 468], ['Mon', '04:00', 412], ['Mon', '05:00', 354], ['Mon', '06:00', 302], ['Mon', '07:00', 248]].map(([d, t, v]) => [T(d, t), v]);

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, has(key).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '136-145', 136, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.1', 3.5, 5.1, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-99 (fasting)', 70, 99, 0, { crit: [50, 500] }); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.3', 8.6, 10.3, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.8-2.4', 1.8, 2.4, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', 'Over 60 (an estimate only while creatinine is changing)', 60, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.b]), { dec: 1, crit: [undefined, 3.0] }));
  const g = has('pH');
  add(lab('Blood Gas', 'pH, venous', '', '7.31-7.41', 7.31, 7.41, g.map(p => [p.t, p.pH, p.g]), { dec: 2, crit: [7.2], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'pCO2, venous', 'mmHg', '41-51', 41, 51, g.map(p => [p.t, p.pCO2, p.g]), { dec: 0, specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'HCO3, venous (calculated)', 'mmol/L', '22-28', 22, 28, g.map(p => [p.t, p.HCO3, p.g]), { dec: 1, crit: [10], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Mon', '01:45'), 2.4, T('Mon', '02:00')], [T('Mon', '05:00'), 1.5, T('Mon', '05:15')]], { dec: 1, specimen: 'Venous blood' }));
  // first-draw extras (ED 0145)
  const ED = T('Mon', '01:45'), EDR = T('Mon', '02:30');
  add(lab('Chemistry', 'Serum osmolality (measured)', 'mOsm/kg', '275-295', 275, 295, [[ED, 304, T('Mon', '03:00')]], { dec: 0 }));
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[ED, 92, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'AST', 'U/L', '10-40', 10, 40, [[ED, 32, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'ALT', 'U/L', '7-56', 7, 56, [[ED, 28, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Alkaline phosphatase', 'U/L', '40-129', 40, 129, [[ED, 88, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Bilirubin, total', 'mg/dL', '0.1-1.2', 0.1, 1.2, [[ED, 0.8, EDR]], { dec: 1 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[ED, 4.7, EDR]], { dec: 1 }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 (his goal under 7.0)', null, 5.6, [[ED, 8.3, T('Mon', '10:00')]], { dec: 1 }));
  // respiratory viral panel (swab 0150, result 0950)
  const RV = T('Mon', '01:50'), RVR = T('Mon', '09:50');
  ['Influenza A', 'Influenza B', 'SARS-CoV-2 (COVID-19)', 'RSV (respiratory syncytial virus)'].forEach(v => add(lab('Microbiology', `Respiratory viral panel PCR: ${v}`, '', 'Not detected', null, null, [[RV, 'Not detected', RVR]], { specimen: 'Nasopharyngeal swab' })));
  // CBC: ED and Tuesday 0945
  const CB = [[ED, T('Mon', '02:15')], [T('Tue', '09:45'), T('Tue', '10:15')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]).filter(e => e[1] !== null), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.5-11.0', 4.5, 11.0, [17.8, 9.6], 1); cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [16.4, 13.8], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '41-53', 41, 53, [49.0, 41.2], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [302, 241], 0);
  cb('Neutrophils', '%', '40-70', 40, 70, [84, 64], 0); cb('Lymphocytes', '%', '20-45', 20, 45, [9, 26], 0); cb('Bands', '%', '0-5', 0, 5, [0, null], 0);
  // urine (ED void 0215, result 0300)
  const UT = T('Mon', '02:15'), UR = T('Mon', '03:00');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch in the ED)', abn: /\+|Large|Trace|Positive|Over/ }));
  ua('UA appearance', 'Clear/yellow', 'Pale yellow, clear'); ua('UA specific gravity', '1.005-1.030', '1.030'); ua('UA glucose', 'Negative', 'Over 1,000 mg/dL (4+)'); ua('UA ketones', 'Negative', 'Large (80 mg/dL)');
  ua('UA protein', 'Negative', 'Trace'); ua('UA blood', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA nitrite', 'Negative', 'Negative'); ua('UA WBC', '0-5 /hpf', '0-2 /hpf');
  // ECG interpretations (Cardiac); the tracing with its image is in Chart Review > Cardiology
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /peaked|tachy|U wave|flat|PVC/i }));
  ecg(T('Mon', '02:00'), T('Mon', '02:15'), 'Sinus tachycardia 122 bpm, PR 146 ms, QRS 90 ms, QT/QTc 300/428 ms. Peaked, narrow T waves V2-V4. No ST changes.');
  ecg(T('Mon', '15:05'), T('Mon', '15:15'), 'Sinus rhythm 98 bpm, PR 150 ms, QRS 88 ms, QT/QTc 360/460 ms. Flattened T waves with U waves V2-V3. 2 premature ventricular complexes.');
  // chest x-ray result is a Radiology note; ED point-of-care glucose (meter docks to the chart)
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-250 while on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  return out;
}

// Intake and output: one ED block, then 4-hour blocks (collected = block end, periodEnd: true). Numbers are DESIGN.md section 9; gen/infusions.js recomputes the IV parts and assemble.js checks them.
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Mon', '07:00'), 'ED 0130-0700', { po: 0, iv: 2500, ivmed: 130, urine: 1250, emesis: 350 }, 'ED. IV fluid: 0.9% sodium chloride 1,000 mL bolus 0155-0255, 500 mL/h 0300-0500 (1,000 mL), 250 mL/h 0500-0700 (500 mL) = 2,500 mL. IV med: insulin 7.6 mL/h from 0305 (30 mL) + acetaminophen IV 100 mL (0230). Voids 0215 400 mL (urine sample), 0430 450 mL, 0630 400 mL. Emesis 0205 200 mL, 0350 150 mL.'],
  [T('Mon', '11:00'), '0700-1100', { po: 60, iv: 1000, ivmed: 180, urine: 900, emesis: 120 }, '0.9% sodium chloride 250 mL/h to 0705, then 150 mL/h (608 mL); D10W 100 mL/h from 0705 (392 mL). IV med: insulin 30 mL + KCl riders 0715 (100 mL) and 1030 (50 mL in this block). Ice chips and sips 60 mL. Voids 0750 350 mL, 0920 300 mL, 1045 250 mL. Emesis 0830 120 mL.'],
  [T('Mon', '15:00'), '1100-1500', { po: 480, iv: 1000, ivmed: 280, urine: 750, emesis: 0 }, '0.9% sodium chloride 150 mL/h (600 mL); D10W 100 mL/h (400 mL). IV med: insulin 30 mL + KCl riders 1030 (50 mL in this block), 1130, 1230 (250 mL). Sugar-free clear liquids 480 mL. Voids 1150 250 mL, 1320 250 mL, 1440 250 mL.'],
  [T('Mon', '19:00'), '1500-1900', { po: 480, iv: 600, ivmed: 451, urine: 600, emesis: 0 }, '0.9% sodium chloride 150 mL/h (600 mL). D10W off 1500-1900. IV med: insulin held 1500-1750, 7.6 mL/h from 1750 (9 mL) + KCl riders 1505, 1605, 1705 (300 mL) + 1805 rider stopped at 1900 with 92 mL in + magnesium sulfate 2 g in 50 mL (1515-1715). Sugar-free clear liquids 480 mL. Voids 1600 300 mL, 1810 300 mL.'],
  [T('Mon', '23:00'), '1900-2300', { po: 360, iv: 800, ivmed: 80, urine: 550, emesis: 0 }, '0.9% sodium chloride 100 mL/h (400 mL); D10W 100 mL/h from 1900 (400 mL). IV med: insulin 30 mL + KCl rider 2230 (50 mL in this block). Sugar-free clear liquids 360 mL. Voids 2000 250 mL, 2210 300 mL.'],
  [T('Tue', '03:00'), '2300-0300', { po: 120, iv: 618, ivmed: 280, urine: 550, emesis: 0 }, '0.9% sodium chloride 100 mL/h (400 mL). D10W 100 mL/h 2300-0111 (218 mL). From about 0111 the D10W tubing was apart at the Y-site connector: the pump ran (raised to 150 mL/h at 0210) but the dextrose went into the bed, about 223 mL, NOT counted as intake. IV med: insulin 30 mL + KCl riders 2230 (50 mL in this block), 2330, 0030 (250 mL). Sugar-free clear liquids 120 mL. Voids 0005 250 mL, 0100 300 mL.'],
  [T('Tue', '07:00'), '0300-0700', { po: 240, iv: 975, ivmed: 241, urine: 500, emesis: 0 }, '0.9% sodium chloride 100 mL/h (400 mL). D10W 150 mL/h on new tubing from 0310 (575 mL). IV med: insulin 7.6 mL/h to 0305, then 3.8 mL/h (16 mL) + KCl riders 0330, 0430 (200 mL) + dextrose 50% 25 mL (0305). Sugar-free clear liquids 240 mL. Voids 0315 200 mL, 0530 300 mL. Daily weight 0600 (standing scale): 79.3 kg (ED bed scale 76.0 kg on arrival).'],
  [T('Tue', '11:00'), '0700-1100', { po: 600, iv: 625, ivmed: 210, urine: 650, emesis: 0 }, '0.9% sodium chloride 100 mL/h to 0930 (250 mL); D10W 150 mL/h to 0930 (375 mL); then saline lock. IV med: insulin 3.8 mL/h to 0930 (10 mL) + KCl riders 0730, 0830 (200 mL). Breakfast and drinks 600 mL. Voids 0740 300 mL, 1010 350 mL.'],
  [T('Tue', '15:00'), '1100-1500', { po: 840, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'No IV fluid (saline locks). Lunch and drinks 840 mL. Voids 1130 300 mL, 1400 350 mL.'],
  [T('Tue', '19:00'), '1500-1900', { po: 720, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'No IV fluid. Dinner and drinks 720 mL. Voids 1600 300 mL, 1830 300 mL.']
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, POC, BLOCKS, ag, corrNa, effOsm, calcOsm, egfr };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), 'eGFR', egfr(p.Cr), p.pH ? `HH pH ${(6.1 + Math.log10(p.HCO3 / (0.03 * p.pCO2))).toFixed(2)} (charted ${p.pH}) Winter ${(1.5 * p.HCO3 + 8).toFixed(1)}+-2 vs pCO2 ${p.pCO2}` : ''));
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; console.log(b.collected, b.time, 'in', b.intake, 'out', b.output); });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to);
}

/* DKA patient 2 (Jordan Ellis): vital signs (history and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose and ketones, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Mon 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40502) and the students chart them. */
const { at, slug, hOfStamp } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  ['2026-10-06 10:15', 98.2, 70, 122, 76, 14, 99, RA, 0, 'Endocrinology clinic visit (weight 74.5 kg)', 'Pulse oximeter'],
  [T('Mon', '00:35'), 99.0, 122, 104, 62, 28, 98, RA, 5, 'ED triage (deep, fast breathing)', 'Cardiac monitor'],
  [T('Mon', '01:55'), 98.9, 114, 110, 66, 26, 98, RA, 5, 'ED, after the first liter of saline', 'Cardiac monitor'],
  [T('Mon', '04:00'), 98.8, 108, 114, 68, 24, 98, RA, 4, 'ED, 2 hours after the insulin infusion started', 'Cardiac monitor'],
  [T('Mon', '06:15'), 98.8, 106, 112, 68, 24, 98, RA, 3, 'ED, before transfer', 'Cardiac monitor'],
  // ---- simulation starts Mon 07:00 (arrival to the intermediate care unit). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Mon', '07:00'), 98.8, 108, 112, 68, 24, 98, RA, 3, 'Intermediate care unit (IMCU) arrival', 'Cardiac monitor']
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
// eGFR, CKD-EPI 2021 (race-free), 24-year-old man
const AGE = 24;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.9, 1), -0.302) * Math.pow(Math.max(cr / 0.9, 1), -1.2) * Math.pow(0.9938, AGE));
// Chemistry panels. t = collected, r = BMP result time, g = blood gas result time, b = beta-hydroxybutyrate result time.
// VBG: pH, pCO2 (mmHg), HCO3 (calculated by the analyzer, Henderson-Hasselbalch). Serum CO2 (BMP) runs about 1 higher than the gas HCO3.
const PANELS = [
  { k: 'ED1', t: T('Mon', '00:45'), g: T('Mon', '01:00'), r: T('Mon', '01:30'), b: T('Mon', '01:40'), Na: 133, K: 5.4, Cl: 97, CO2: 10, BUN: 24, Cr: 1.4, Glu: 572, Ca: 9.4, Mg: 1.9, Phos: 5.2, BHB: 6.2, pH: 7.22, pCO2: 24, HCO3: 9.4 },
  { k: 'ED2', t: T('Mon', '03:00'), g: T('Mon', '03:15'), r: T('Mon', '03:45'), b: T('Mon', '03:55'), Na: 136, K: 4.6, Cl: 102, CO2: 11, BUN: 22, Cr: 1.3, Glu: 470, Ca: 9.0, Mg: 1.8, Phos: 4.4, BHB: 5.6, pH: 7.25, pCO2: 24, HCO3: 10.2 },
  { k: 'P0', t: T('Mon', '06:30'), g: T('Mon', '06:45'), r: T('Mon', '07:15'), b: T('Mon', '07:25'), Na: 137, K: 4.1, Cl: 104, CO2: 12, BUN: 20, Cr: 1.2, Glu: 292, Ca: 8.9, Mg: 1.5, Phos: 3.0, BHB: 4.6, pH: 7.25, pCO2: 26, HCO3: 11.0 },
  { k: 'P1', t: T('Mon', '10:30'), g: T('Mon', '10:45'), r: T('Mon', '11:15'), b: T('Mon', '11:25'), Na: 138, K: 3.8, Cl: 106, CO2: 14, BUN: 17, Cr: 1.1, Glu: 192, Ca: 8.7, Mg: 1.9, Phos: 2.2, BHB: 3.1, pH: 7.27, pCO2: 29, HCO3: 13.0 },
  { k: 'P2', t: T('Mon', '14:30'), g: T('Mon', '14:45'), r: T('Mon', '15:15'), b: T('Mon', '15:25'), Na: 138, K: 3.6, Cl: 107, CO2: 15, BUN: 15, Cr: 1.0, Glu: 240, Ca: 8.6, Mg: 1.8, Phos: 1.9, BHB: 2.4, pH: 7.29, pCO2: 30, HCO3: 14.0 },
  { k: 'P3', t: T('Mon', '18:30'), g: T('Mon', '18:45'), r: T('Mon', '19:15'), b: T('Mon', '19:25'), Na: 139, K: 3.3, Cl: 108, CO2: 16, BUN: 13, Cr: 0.9, Glu: 200, Ca: 8.6, Mg: 1.7, Phos: 1.8, BHB: 1.8, pH: 7.31, pCO2: 31, HCO3: 15.2 },
  { k: 'STAT', t: T('Mon', '21:30'), g: T('Mon', '21:40'), r: T('Mon', '21:55'), b: T('Mon', '22:05'), Na: 139, K: 3.7, Cl: 108, CO2: 15, BUN: 12, Cr: 0.9, Glu: 246, Ca: 8.6, Mg: 2.1, Phos: 1.9, BHB: 2.0, pH: 7.30, pCO2: 30, HCO3: 14.4 },
  { k: 'P4', t: T('Tue', '01:30'), g: T('Tue', '01:45'), r: T('Tue', '02:15'), b: T('Tue', '02:25'), Na: 140, K: 4.0, Cl: 109, CO2: 18, BUN: 11, Cr: 0.9, Glu: 174, Ca: 8.7, Mg: 2.0, Phos: 2.1, BHB: 0.9, pH: 7.34, pCO2: 33, HCO3: 17.2 },
  { k: 'P5', t: T('Tue', '05:30'), g: T('Tue', '05:45'), r: T('Tue', '06:15'), b: T('Tue', '06:25'), Na: 139, K: 4.1, Cl: 108, CO2: 20, BUN: 10, Cr: 0.9, Glu: 160, Ca: 8.8, Mg: 1.9, Phos: 2.6, BHB: 0.4, pH: 7.36, pCO2: 35, HCO3: 19.0 },
  { k: 'P6', t: T('Tue', '11:30'), r: T('Tue', '12:15'), b: T('Tue', '12:25'), Na: 138, K: 3.9, Cl: 105, CO2: 22, BUN: 10, Cr: 0.9, Glu: 246, Ca: 9.0, Mg: 1.9, Phos: 2.8, BHB: 0.3 },
  { k: 'P7', t: T('Wed', '05:00'), r: T('Wed', '05:45'), Na: 139, K: 4.1, Cl: 104, CO2: 24, BUN: 11, Cr: 0.9, Glu: 132, Ca: 9.2, Mg: 1.9, Phos: 3.4 },
  { k: 'P8', t: T('Thu', '05:00'), r: T('Thu', '05:45'), Na: 140, K: 4.3, Cl: 104, CO2: 26, BUN: 12, Cr: 0.9, Glu: 118, Ca: 9.3, Mg: 2.0, Phos: 3.6 }
];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 10) / 10;   // ADA factor 1.6
const effOsm = p => Math.round(2 * p.Na + p.Glu / 18);
const calcOsm = p => Math.round(2 * p.Na + p.Glu / 18 + p.BUN / 2.8);

// point-of-care glucose (meter docks to the chart). [day, time, value]
const POC = [
  ['Mon', '00:40', 556], ['Mon', '02:00', 518], ['Mon', '03:00', 476], ['Mon', '04:00', 422], ['Mon', '05:00', 368], ['Mon', '06:00', 316], ['Mon', '07:00', 266],
  ['Mon', '08:00', 214], ['Mon', '09:00', 198], ['Mon', '10:00', 186], ['Mon', '11:00', 190], ['Mon', '12:00', 182], ['Mon', '13:00', 176], ['Mon', '14:00', 248],
  ['Mon', '15:00', 232], ['Mon', '16:00', 214], ['Mon', '17:00', 204], ['Mon', '18:00', 196], ['Mon', '19:00', 192], ['Mon', '20:00', 206], ['Mon', '21:00', 236],
  ['Mon', '22:00', 248], ['Mon', '23:00', 226], ['Tue', '00:00', 204], ['Tue', '01:00', 182], ['Tue', '02:00', 166], ['Tue', '03:00', 148], ['Tue', '04:00', 158],
  ['Tue', '05:00', 162], ['Tue', '06:00', 166], ['Tue', '07:00', 164], ['Tue', '07:30', 162], ['Tue', '08:30', 174], ['Tue', '09:30', 182], ['Tue', '10:30', 188],
  ['Tue', '11:30', 246], ['Tue', '17:30', 188], ['Tue', '20:10', 64], ['Tue', '20:25', 92], ['Tue', '21:00', 118], ['Wed', '03:00', 132], ['Wed', '07:30', 138],
  ['Wed', '10:30', 164], ['Wed', '11:30', 176], ['Wed', '17:30', 204], ['Wed', '21:00', 212], ['Wed', '23:00', 276], ['Thu', '00:10', 298], ['Thu', '01:30', 236],
  ['Thu', '03:00', 168], ['Thu', '06:00', 142]
].map(([d, t, v]) => [T(d, t), v]);
// bedside blood ketone meter (beta-hydroxybutyrate), Wednesday night unexplained high
const POC_BHB = [[T('Thu', '00:10'), 0.6], [T('Thu', '03:00'), 0.2]];

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, has(key).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0', 3.5, 5.0, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-110', 70, 110, 0, { crit: [50, 500] }); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.3', 8.6, 10.3, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.3', 1.7, 2.3, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', '>60', 60, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.b]), { dec: 1, crit: [undefined, 3.0] }));
  const g = has('pH');
  add(lab('Blood Gas', 'pH, venous', '', '7.32-7.42', 7.32, 7.42, g.map(p => [p.t, p.pH, p.g]), { dec: 2, crit: [7.2], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'pCO2, venous', 'mmHg', '41-51', 41, 51, g.map(p => [p.t, p.pCO2, p.g]), { dec: 0, specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'HCO3, venous (calculated)', 'mmol/L', '22-28', 22, 28, g.map(p => [p.t, p.HCO3, p.g]), { dec: 1, crit: [10], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Mon', '00:45'), 2.6, T('Mon', '01:00')], [T('Mon', '06:30'), 1.4, T('Mon', '06:45')]], { dec: 1, specimen: 'Venous blood' }));
  // first-draw screen (ED 0045): alcohol and toxicology, liver, pancreas, osmolality
  const ED = T('Mon', '00:45'), EDR = T('Mon', '01:30');
  add(lab('Chemistry', 'Serum osmolality (measured)', 'mOsm/kg', '275-295', 275, 295, [[ED, 309, EDR]], { dec: 0 }));
  add(lab('Toxicology', 'Ethanol, serum', 'mg/dL', 'Under 10 (none detected)', null, null, [[ED, 'Under 10 (none detected)', EDR]]));
  add(lab('Toxicology', 'Acetaminophen level', 'mcg/mL', 'Under 10', null, null, [[ED, 'Under 10 (none detected)', EDR]]));
  add(lab('Toxicology', 'Salicylate level', 'mg/dL', 'Under 3', null, null, [[ED, 'Under 3 (none detected)', EDR]]));
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[ED, 48, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'AST', 'U/L', '10-40', 10, 40, [[ED, 46, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'ALT', 'U/L', '7-56', 7, 56, [[ED, 39, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Alkaline phosphatase', 'U/L', '40-129', 40, 129, [[ED, 82, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Bilirubin, total', 'mg/dL', '0.1-1.2', 0.1, 1.2, [[ED, 0.9, EDR]], { dec: 1 }));
  add(lab('Chemistry', 'GGT (gamma-glutamyl transferase)', 'U/L', '8-61', 8, 61, [[ED, 68, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[ED, 4.6, EDR]], { dec: 1 }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 (his goal under 7.0)', null, 5.6, [[ED, 7.6, T('Mon', '09:00')]], { dec: 1 }));
  add(lab('Microbiology', 'Respiratory pathogen PCR (influenza A/B, COVID-19, RSV)', '', 'Not detected', null, null, [[T('Mon', '00:50'), 'Not detected', T('Mon', '02:30')]], { specimen: 'Nasopharyngeal swab' }));
  // CBC: ED and Tuesday morning
  const CB = [[ED, T('Mon', '01:15')], [T('Tue', '05:30'), T('Tue', '06:15')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.5-11.0', 4.5, 11.0, [15.8, 8.4], 1); cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [16.2, 13.9], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '41-53', 41, 53, [48.1, 41.0], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [286, 224], 0);
  cb('Neutrophils', '%', '40-70', 40, 70, [82, 62], 0); cb('Lymphocytes', '%', '20-45', 20, 45, [11, 28], 0);
  // urine (first void in the ED)
  const UT = T('Mon', '01:15'), UR = T('Mon', '02:00');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch in the ED)', abn: /\+|Large|Trace|Positive|>|Over/ }));
  ua('UA appearance', 'Clear/yellow', 'Pale yellow, clear'); ua('UA specific gravity', '1.005-1.030', '1.028'); ua('UA glucose', 'Negative', 'Over 1,000 mg/dL (4+)'); ua('UA ketones', 'Negative', 'Large (80 mg/dL)');
  ua('UA protein', 'Negative', 'Trace'); ua('UA blood', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA nitrite', 'Negative', 'Negative');
  const uds = (label, v) => add(lab('Toxicology', label, '', 'Negative', null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch in the ED)', abn: /Positive/ }));
  uds('Urine drug screen: amphetamines', 'Negative'); uds('Urine drug screen: benzodiazepines', 'Negative'); uds('Urine drug screen: cannabinoids', 'Negative'); uds('Urine drug screen: cocaine', 'Negative'); uds('Urine drug screen: opiates', 'Negative');
  // ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /peaked|tachy|U wave|flat/i }));
  ecg(T('Mon', '01:15'), T('Mon', '01:35'), 'Sinus tachycardia 118 bpm, PR 148 ms, QRS 88 ms, QT/QTc 320/448 ms. Tall, narrow T waves V2-V4 (potassium 5.4 at 0045). No ST changes.');
  ecg(T('Mon', '19:35'), T('Mon', '19:45'), 'Sinus rhythm 92 bpm, PR 152 ms, QRS 88 ms, QT/QTc 378/468 ms (measured to the end of the T wave). Flattened T waves with prominent U waves V2-V3 (potassium 3.3 at 1830). No ST changes.');
  // point-of-care glucose and ketones
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-250 while on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  add(lab('Bedside Testing', 'Beta-hydroxybutyrate (point of care ketone meter)', 'mmol/L', 'Under 0.6', null, 0.5, POC_BHB.map(([t, v]) => [t, v]), { dec: 1, specimen: 'Capillary blood (fingerstick)' }));
  return out;
}

// Intake and output in 4-hour blocks; each block shows when it ends (collected) with periodEnd: true.
// iv = IV fluid (lactated Ringer's line + D10 line + saline); ivmed = insulin infusion + IV push/piggyback volumes (potassium riders, magnesium, thiamine).
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Mon', '07:00'), 'ED 0030-0700', { po: 0, iv: 2750, ivmed: 86, urine: 1350, emesis: 200 }, 'ED. Normal saline 1,000 mL over 1 hour (0055-0155) + lactated Ringer\'s 500 mL/h 0200-0400 (1,000 mL) + lactated Ringer\'s with KCl 20 mEq/L 250 mL/h 0400-0700 (750 mL). IV med: insulin 7.2 mL/h from 0215 (34 mL) + ondansetron 2 mL + thiamine 50 mL. Emesis 200 mL (0130). Voids 0115 450 mL (urine sample), 0330 500, 0545 400 mL.'],
  [T('Mon', '11:00'), '0700-1100', { po: 60, iv: 855, ivmed: 79, urine: 900, emesis: 0 }, 'LR + KCl 20 at 250 mL/h to 0805 (271 mL), then 100 mL/h (292 mL); D10 100 mL/h from 0805 (292 mL). Insulin 7.2 mL/h (29 mL). Magnesium sulfate 2 g in 50 mL (0800). Ice chips/sips 60 mL. Voids 0800 350, 0945 300, 1045 250 mL.'],
  [T('Mon', '15:00'), '1100-1500', { po: 640, iv: 800, ivmed: 29, urine: 950, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL) + D10 100 mL/h (400 mL). Insulin 29 mL. Water 240 mL; regular (sugar) soda about 400 mL at 1310 (brought by his roommate). Voids 1200 350, 1330 300, 1450 300 mL.'],
  [T('Mon', '19:00'), '1500-1900', { po: 360, iv: 800, ivmed: 229, urine: 900, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL); D10 100 mL/h (400 mL). IV med: insulin 29 + potassium chloride 10 mEq/100 mL riders x2 (1600-1800, 200 mL). Sugar-free fluids 360 mL. Voids 1600 300, 1730 350, 1850 250 mL.'],
  [T('Mon', '23:00'), '1900-2300', { po: 240, iv: 533, ivmed: 410, urine: 550, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL). D10 100 mL/h to 1920 (33 mL), OFF while the insulin was held (1920-2200), 100 mL/h again from 2200 (100 mL). IV med: insulin to 1920 and from 2200 (10 mL) + KCl 10 mEq riders 1930-2300 (350 mL) + magnesium sulfate 2 g in 50 mL (1930). Water 240 mL. Voids 2000 300, 2200 250 mL.'],
  [T('Tue', '03:00'), '2300-0300', { po: 120, iv: 800, ivmed: 79, urine: 550, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL) + D10 100 mL/h (400 mL). IV med: insulin 29 + the end of the 4th KCl rider (50 mL, done 2330). Water 120 mL. Voids 0030 300, 0230 250 mL.'],
  [T('Tue', '07:00'), '0300-0700', { po: 120, iv: 1000, ivmed: 29, urine: 600, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL) + D10 150 mL/h from 0300 (600 mL; glucose 148). Insulin 29 mL. Water 120 mL. Voids 0430 300, 0650 300 mL. Weight 0600: 74.2 kg.'],
  [T('Tue', '11:00'), '0700-1100', { po: 480, iv: 775, ivmed: 18, urine: 650, emesis: 0 }, 'LR + KCl 20 at 100 mL/h (400 mL); D10 150 mL/h to 0930 (375 mL). Insulin 7.2 mL/h to 0930 (18 mL). Breakfast 0800: milk 240, coffee 240. Voids 0800 350, 1000 300 mL.'],
  [T('Tue', '15:00'), '1100-1500', { po: 720, iv: 300, ivmed: 0, urine: 750, emesis: 0 }, 'LR + KCl 20 at 100 mL/h until 1400 (300 mL), then saline lock. Lunch and water 720 mL. Voids 1200 400, 1400 350 mL. Transferred to 4 East at 1400.'],
  [T('Tue', '19:00'), '1500-1900', { po: 840, iv: 0, ivmed: 0, urine: 750, emesis: 0 }, 'Water and dinner 1730 (ate about half the tray). Voids 1600 350, 1830 400 mL.'],
  [T('Tue', '23:00'), '1900-2300', { po: 480, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'Low glucose 2010: juice 120 mL (15 g); milk 240 mL with crackers 2030; water 120. Voids 2030 300, 2230 300 mL.'],
  [T('Wed', '03:00'), '2300-0300', { po: 120, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 120 mL. Void 0200 300 mL.'],
  [T('Wed', '07:00'), '0300-0700', { po: 120, iv: 0, ivmed: 0, urine: 400, emesis: 0 }, 'Water 120 mL. Void 0630 400 mL. Weight 0600: 74.0 kg.'],
  [T('Wed', '11:00'), '0700-1100', { po: 840, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'Breakfast and drinks. Voids 0900 350, 1050 300 mL.'],
  [T('Wed', '15:00'), '1100-1500', { po: 960, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'Lunch and drinks. Voids 1230 350, 1430 300 mL.'],
  [T('Wed', '19:00'), '1500-1900', { po: 840, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'Dinner 1730 and drinks. Voids 1630 300, 1830 350 mL.'],
  [T('Wed', '23:00'), '1900-2300', { po: 720, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'Pizza and diet soda (roommate visit, 1930). Voids 2030 350, 2230 300 mL.'],
  [T('Thu', '03:00'), '2300-0300', { po: 240, iv: 0, ivmed: 0, urine: 700, emesis: 0 }, 'Glucose high (298 at 0010): water 240 mL. Voids 0015 400, 0200 300 mL.'],
  [T('Thu', '07:00'), '0300-0700', { po: 240, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'Water 240 mL. Voids 0500 300, 0650 300 mL. Weight 0600: 73.9 kg.']
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, POC, POC_BHB, BLOCKS, ag, corrNa, effOsm, calcOsm, egfr };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), 'eGFR', egfr(p.Cr), p.pH ? `HH pH ${(6.1 + Math.log10(p.HCO3 / (0.03 * p.pCO2))).toFixed(2)} (charted ${p.pH}) Winter ${(1.5 * p.HCO3 + 8).toFixed(1)}+-2 vs pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev) { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && hOfStamp(t) < 1.5) console.log(t.slice(5), v, 'rate/h', ((v - prev[1]) / dh).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; console.log(b.collected, b.time, 'in', b.intake, 'out', b.output); });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to);
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED to Tue 0700', '2026-12-14 00:00', T('Tue', '07:00')], ['Tue 0700-Wed 0700', T('Tue', '07:00'), T('Wed', '07:00')], ['Wed 0700-Thu 0700', T('Wed', '07:00'), T('Thu', '07:00')],
   ['Mon day', T('Mon', '07:00'), T('Mon', '19:00')], ['Mon night', T('Mon', '19:00'), T('Tue', '07:00')], ['Tue day', T('Tue', '07:00'), T('Tue', '19:00')], ['Tue night', T('Tue', '19:00'), T('Wed', '07:00')], ['Wed day', T('Wed', '07:00'), T('Wed', '19:00')], ['Wed night', T('Wed', '19:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n, 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
}

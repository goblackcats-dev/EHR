/* DKA patient 1 (Maya Thompson): vital signs (history and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Mon 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40501) and the students chart them. */
const { at, slug, hOfStamp } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  ['2026-08-10 15:30', 98.4, 68, 108, 66, 16, 99, RA, 0, 'Clinic: sports physical (weight 54.2 kg)', 'Pulse oximeter'],
  [T('Mon', '02:10'), 99.1, 134, 108, 64, 32, 99, RA, 6, 'ED triage (deep, fast breathing)', 'Cardiac monitor'],
  [T('Mon', '03:15'), 98.9, 126, 112, 66, 30, 99, RA, 5, 'ED, after the 10 mL/kg saline bolus', 'Cardiac monitor'],
  [T('Mon', '05:00'), 98.8, 122, 114, 68, 28, 99, RA, 5, 'ED, 1 hour after the insulin infusion started', 'Cardiac monitor'],
  [T('Mon', '06:15'), 98.8, 120, 112, 70, 28, 99, RA, 4, 'ED, before transfer', 'Cardiac monitor'],
  // ---- simulation starts Mon 07:00 (arrival to the PICU). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Mon', '07:00'), 98.9, 118, 114, 70, 26, 99, RA, 4, 'PICU arrival', 'Cardiac monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 110 ? 'High' : hr < 55 ? 'Low' : ''); mk('HRSRC', 'HR Source', hsrc); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 135 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Right arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 22 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
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
// bedside Schwartz eGFR (children and teens): 0.413 x height (cm) / creatinine; height 163 cm
const HEIGHT = 163;
const egfr = cr => Math.round(0.413 * HEIGHT / cr);
// Chemistry panels. t = collected, r = BMP result time, g = blood gas result time, b = beta-hydroxybutyrate result time.
// VBG: pH, pCO2 (mmHg), HCO3 (calculated by the analyzer, Henderson-Hasselbalch). Serum CO2 (BMP) runs about 1 higher than the gas HCO3.
const PANELS = [
  { k: 'ED1', t: T('Mon', '02:20'), g: T('Mon', '02:35'), r: T('Mon', '03:00'), b: T('Mon', '03:15'), Na: 131, K: 5.6, Cl: 98, CO2: 5, BUN: 28, Cr: 1.3, Glu: 612, Ca: 9.6, Mg: 2.4, Phos: 6.8, BHB: 7.8, pH: 7.04, pCO2: 16, HCO3: 4.2 },
  { k: 'ED2', t: T('Mon', '04:30'), g: T('Mon', '04:45'), r: T('Mon', '05:15'), b: T('Mon', '05:25'), Na: 132, K: 4.7, Cl: 101, CO2: 6, BUN: 26, Cr: 1.2, Glu: 520, Ca: 9.2, Mg: 2.2, Phos: 5.1, BHB: 7.1, pH: 7.07, pCO2: 17, HCO3: 4.8 },
  { k: 'P1', t: T('Mon', '08:30'), g: T('Mon', '08:45'), r: T('Mon', '09:15'), b: T('Mon', '09:25'), Na: 135, K: 3.9, Cl: 105, CO2: 7, BUN: 22, Cr: 1.0, Glu: 318, Ca: 8.9, Mg: 2.0, Phos: 2.6, BHB: 5.2, pH: 7.14, pCO2: 19, HCO3: 6.2 },
  { k: 'STAT', t: T('Mon', '11:40'), g: T('Mon', '11:50'), r: T('Mon', '12:05'), b: T('Mon', '12:15'), Na: 134, K: 3.5, Cl: 106, CO2: 9, BUN: 20, Cr: 0.9, Glu: 248, Ca: 8.7, Mg: 1.9, Phos: 2.0, BHB: 4.1, pH: 7.18, pCO2: 21, HCO3: 7.6 },
  { k: 'P2', t: T('Mon', '16:30'), g: T('Mon', '16:45'), r: T('Mon', '17:15'), b: T('Mon', '17:25'), Na: 137, K: 3.3, Cl: 109, CO2: 11, BUN: 17, Cr: 0.8, Glu: 196, Ca: 8.6, Mg: 1.8, Phos: 1.8, BHB: 2.6, pH: 7.23, pCO2: 24, HCO3: 9.7 },
  { k: 'P3', t: T('Mon', '20:30'), g: T('Mon', '20:45'), r: T('Mon', '21:15'), b: T('Mon', '21:25'), Na: 139, K: 3.6, Cl: 111, CO2: 13, BUN: 14, Cr: 0.7, Glu: 174, Ca: 8.6, Mg: 1.8, Phos: 1.6, BHB: 1.6, pH: 7.27, pCO2: 27, HCO3: 12.0 },
  { k: 'P4', t: T('Tue', '00:30'), g: T('Tue', '00:45'), r: T('Tue', '01:15'), b: T('Tue', '01:25'), Na: 140, K: 3.8, Cl: 112, CO2: 15, BUN: 12, Cr: 0.7, Glu: 160, Ca: 8.7, Mg: 1.8, Phos: 1.9, BHB: 0.9, pH: 7.29, pCO2: 29, HCO3: 13.5 },
  { k: 'P5', t: T('Tue', '04:30'), g: T('Tue', '04:45'), r: T('Tue', '05:15'), b: T('Tue', '05:25'), Na: 140, K: 3.9, Cl: 112, CO2: 18, BUN: 10, Cr: 0.6, Glu: 148, Ca: 8.8, Mg: 1.8, Phos: 2.4, BHB: 0.4, pH: 7.33, pCO2: 33, HCO3: 16.8 },
  { k: 'P6', t: T('Tue', '13:00'), r: T('Tue', '13:45'), b: T('Tue', '13:55'), Na: 139, K: 3.7, Cl: 108, CO2: 21, BUN: 8, Cr: 0.6, Glu: 212, Ca: 9.0, Mg: 1.8, Phos: 2.6, BHB: 0.3 },
  { k: 'P7', t: T('Wed', '05:00'), r: T('Wed', '05:45'), Na: 138, K: 4.0, Cl: 105, CO2: 23, BUN: 9, Cr: 0.6, Glu: 118, Ca: 9.2, Mg: 1.9, Phos: 3.2 },
  { k: 'P8', t: T('Thu', '05:00'), r: T('Thu', '05:45'), Na: 139, K: 4.2, Cl: 104, CO2: 25, BUN: 10, Cr: 0.6, Glu: 126, Ca: 9.4, Mg: 2.0, Phos: 3.8 }
];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 10) / 10;   // ADA factor 1.6 (ISPAD uses 2)
const effOsm = p => Math.round(2 * p.Na + p.Glu / 18);

// point-of-care glucose (meter docks to the chart). [time, value]. 'HI' = above the meter's range (over 600).
const POC = [
  ['Mon', '02:25', 'HI'], ['Mon', '03:30', 574], ['Mon', '04:00', 552], ['Mon', '05:00', 497], ['Mon', '06:00', 441], ['Mon', '07:00', 386],
  ['Mon', '08:00', 334], ['Mon', '09:00', 287], ['Mon', '10:00', 262], ['Mon', '11:00', 241], ['Mon', '11:30', 236], ['Mon', '12:00', 229],
  ['Mon', '13:00', 214], ['Mon', '14:00', 206], ['Mon', '15:00', 198], ['Mon', '16:00', 192], ['Mon', '17:00', 194], ['Mon', '18:00', 186],
  ['Mon', '19:00', 181], ['Mon', '20:00', 176], ['Mon', '21:00', 172], ['Mon', '22:00', 175], ['Mon', '23:00', 168], ['Tue', '00:00', 164],
  ['Tue', '01:00', 158], ['Tue', '02:00', 154], ['Tue', '03:00', 147], ['Tue', '04:00', 152], ['Tue', '05:00', 156], ['Tue', '06:00', 161],
  ['Tue', '07:00', 158], ['Tue', '07:45', 154], ['Tue', '09:00', 172], ['Tue', '10:00', 196], ['Tue', '11:30', 268], ['Tue', '17:30', 214],
  ['Tue', '21:00', 248], ['Wed', '02:30', 64], ['Wed', '02:45', 92], ['Wed', '03:15', 118], ['Wed', '07:30', 142], ['Wed', '11:30', 176],
  ['Wed', '16:00', 104], ['Wed', '17:30', 188], ['Wed', '21:00', 206], ['Thu', '02:15', 132], ['Thu', '03:00', 126], ['Thu', '06:45', 124]
].map(([d, t, v]) => [T(d, t), v]);

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, has(key).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0', 3.5, 5.0, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '20-28', 20, 28, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.5-1.0', 0.5, 1.0, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-110', 70, 110, 0, { crit: [50, 500] }); pn('Calcium', 'Ca', 'mg/dL', '8.8-10.4', 8.8, 10.4, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.3', 1.7, 2.3, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.9-5.0 (age 13-17)', 2.9, 5.0, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (bedside Schwartz, under 18 years)', 'mL/min/1.73m2', '>90', 90, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.b]), { dec: 1, crit: [undefined, 3.0] }));
  // venous blood gas (pH has no units; flags by hand)
  const g = has('pH');
  add(lab('Blood Gas', 'pH, venous', '', '7.32-7.42', 7.32, 7.42, g.map(p => [p.t, p.pH, p.g]), { dec: 2, crit: [7.2], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'pCO2, venous', 'mmHg', '41-51', 41, 51, g.map(p => [p.t, p.pCO2, p.g]), { dec: 0, specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'HCO3, venous (calculated)', 'mmol/L', '22-28', 22, 28, g.map(p => [p.t, p.HCO3, p.g]), { dec: 1, crit: [10], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Mon', '02:20'), 2.4, T('Mon', '02:35')]], { dec: 1, specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'Ionized calcium', 'mmol/L', '1.12-1.32', 1.12, 1.32, [[T('Mon', '16:30'), 1.16, T('Mon', '16:45')], [T('Tue', '04:30'), 1.18, T('Tue', '04:45')]], { dec: 2, specimen: 'Venous blood' }));
  add(lab('Chemistry', 'Serum osmolality (measured)', 'mOsm/kg', '275-295', 275, 295, [[T('Mon', '02:20'), 309, T('Mon', '03:00')], [T('Mon', '11:40'), 292, T('Mon', '12:05')]], { dec: 0 }));
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[T('Mon', '02:20'), 41, T('Mon', '03:00')]], { dec: 0 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[T('Mon', '02:20'), 4.9, T('Mon', '03:00')], [T('Wed', '05:00'), 3.9, T('Wed', '05:45')]], { dec: 1 }));
  // diabetes and screening labs drawn in the ED at 0220, BEFORE insulin (insulin autoantibody must be drawn before insulin is given)
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7', null, 5.6, [[T('Mon', '02:20'), 12.8, T('Mon', '09:00')]], { dec: 1 }));
  add(lab('Endocrine', 'C-peptide (drawn with glucose 612)', 'ng/mL', '0.8-3.5', 0.8, 3.5, [[T('Mon', '02:20'), 0.2, T('Tue', '10:00')]], { dec: 1 }));
  add(lab('Endocrine', 'TSH', 'mIU/L', '0.5-4.3', 0.5, 4.3, [[T('Mon', '02:20'), 2.1, T('Mon', '09:00')]], { dec: 1 }));
  add(lab('Endocrine', 'Free T4', 'ng/dL', '0.8-1.6', 0.8, 1.6, [[T('Mon', '02:20'), 1.0, T('Mon', '09:00')]], { dec: 1 }));
  add(lab('Endocrine', 'GAD65 antibody', 'IU/mL', 'Under 5.0 (negative)', null, 5.0, [[T('Mon', '02:20'), 186, T('Wed', '14:00')]], { dec: 0 }));
  add(lab('Endocrine', 'IA-2 antibody', 'U/mL', 'Under 7.5 (negative)', null, 7.5, [[T('Mon', '02:20'), 42, T('Wed', '14:00')]], { dec: 0 }));
  add(lab('Endocrine', 'Insulin autoantibody (drawn before insulin)', 'U/mL', 'Under 0.4 (negative)', null, 0.4, [[T('Mon', '02:20'), 0.9, T('Wed', '14:00')]], { dec: 1 }));
  add(lab('Endocrine', 'Zinc transporter 8 (ZnT8) antibody', '', 'Negative', null, null, [[T('Mon', '02:20'), 'Pending (send-out laboratory, 5-7 days)', T('Wed', '14:00')]], { status: 'Pending' }));
  add(lab('Immunology', 'Tissue transglutaminase IgA (celiac screen)', 'U/mL', 'Under 4.0 (negative)', null, 4.0, [[T('Mon', '02:20'), 1.0, T('Wed', '14:00')]], { dec: 1 }));
  add(lab('Immunology', 'Immunoglobulin A, total', 'mg/dL', '70-400', 70, 400, [[T('Mon', '02:20'), 168, T('Wed', '14:00')]], { dec: 0 }));
  // CBC: ED and Tuesday morning
  const CB = [[T('Mon', '02:20'), T('Mon', '03:00')], [T('Tue', '04:30'), T('Tue', '05:15')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.5-13.0', 4.5, 13.0, [18.4, 9.8], 1); cb('Hemoglobin', 'g/dL', '12.0-16.0', 12.0, 16.0, [15.1, 12.6], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '36-46', 36, 46, [45.2, 37.4], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [342, 248], 0);
  cb('Neutrophils', '%', '40-70', 40, 70, [84, 58], 0); cb('Lymphocytes', '%', '20-45', 20, 45, [10, 31], 0);
  // urine (first void in the ED)
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[T('Mon', '03:30'), v, T('Mon', '04:00')]], { specimen: 'Urine (clean catch in the ED)', abn: /\+|Large|Trace|Positive|>|Over/ }));
  ua('UA appearance', 'Clear/yellow', 'Pale yellow, clear'); ua('UA specific gravity', '1.005-1.030', '1.030'); ua('UA glucose', 'Negative', 'Over 1,000 mg/dL (4+)'); ua('UA ketones', 'Negative', 'Large (80 mg/dL)');
  ua('UA protein', 'Negative', 'Trace'); ua('UA blood', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA nitrite', 'Negative', 'Negative'); ua('Urine hCG (pregnancy)', 'Negative', 'Negative');
  // ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /peaked|tachy|U wave|flat/i }));
  ecg(T('Mon', '03:00'), T('Mon', '03:10'), 'Sinus tachycardia 128 bpm, PR 136 ms, QRS 82 ms, QTc 452 ms. Tall, narrow, peaked T waves V2-V4 (potassium 5.6 at 0220). No ST changes.');
  ecg(T('Mon', '17:30'), T('Mon', '17:45'), 'Sinus rhythm 98 bpm, PR 140 ms, QRS 82 ms, QT/QTc 360/460 ms (measured to the end of the T wave). Flattened T waves with prominent U waves V2-V3 (potassium 3.3 at 1630). No ST changes.');
  // point-of-care glucose
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-250 while on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500], abn: /HI/ }));
  return out;
}

// Intake and output in 4-hour blocks; each block shows when it ends (collected) with periodEnd: true (see addison and flowsheet-charting.js).
// Standard labels: 'IV fluid', 'Urine', 'Emesis', 'IV med', 'PO'. iv = IV fluid; ivmed = insulin infusion + IV push/piggyback volumes.
// IV fluid and rider volumes come from gen/infusions.js (two-bag rate, potassium riders, insulin): one place for the arithmetic.
const INF = require('./infusions');
const V = (d1, t1, d2, t2) => INF.vol(INF.M(d1, t1), INF.M(d2, t2));
const rl = v => v.list.map(r => `${r.kind === 'KCl' ? 'KCl 10 mEq' : 'K phos 5 mmol'} ${r.from.replace(':', '')}-${r.to.replace(':', '')}`).join(', ');
const vED = V('Mon', '02:05', 'Mon', '07:00'), vB = [['Mon', '07:00', 'Mon', '11:00'], ['Mon', '11:00', 'Mon', '15:00'], ['Mon', '15:00', 'Mon', '19:00'], ['Mon', '19:00', 'Mon', '23:00'], ['Mon', '23:00', 'Tue', '03:00'], ['Tue', '03:00', 'Tue', '07:00'], ['Tue', '07:00', 'Tue', '11:00']].map(x => V(...x));
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Mon', '07:00'), 'ED 0205-0700', { po: 0, iv: 500 + 375 + vED.twoBag, ivmed: vED.insulin + 2 + vED.riders, urine: 750, emesis: 150 }, `ED. IV fluid: normal saline bolus 500 mL (10 mL/kg, 0240-0310) + normal saline 150 mL/h 0315-0545 (375 mL) + two-bag fluids (no potassium) from 0545 (${vED.twoBag} mL). IV med: insulin infusion 4.9 mL/h from 0400 (${vED.insulin} mL) + ondansetron 2 mL + potassium rider ${rl(vED)} (${vED.riders} mL). Emesis 150 mL (0230). Voids 0330 350 mL (urine sample), 0610 400 mL.`],
  [T('Mon', '11:00'), '0700-1100', { po: 0, iv: vB[0].twoBag, ivmed: vB[0].insulin + vB[0].riders, urine: 560, emesis: 0 }, `Two-bag fluids 125 mL/h (75 while a KCl rider runs, 100 while a potassium phosphate rider runs; D0 to 0905, then D5): ${vB[0].twoBag} mL. IV med: insulin ${vB[0].insulin} mL + riders ${rl(vB[0])} (${vB[0].riders} mL). NPO except ice chips. Voids 0800 220, 0930 180, 1050 160 mL (urinal hat).`],
  [T('Mon', '15:00'), '1100-1500', { po: 0, iv: vB[1].twoBag, ivmed: vB[1].insulin + 120 + 2 + vB[1].riders, urine: 570, emesis: 100 }, `Two-bag 125 mL/h base to 1145, then 70 mL/h base after the cerebral edema signs (lower while a rider runs): ${vB[1].twoBag} mL. IV med: insulin ${vB[1].insulin} + mannitol 20% 120 mL (1140) + ondansetron 2 + riders ${rl(vB[1])} (${vB[1].riders} mL). Emesis 100 mL (1130). Voids 1210 140, 1300 260 (after mannitol), 1430 170 mL.`],
  [T('Mon', '19:00'), '1500-1900', { po: 0, iv: vB[2].twoBag, ivmed: vB[2].insulin + vB[2].riders, urine: 240, emesis: 0 }, `Two-bag 70 mL/h base, 40 mL/h while a KCl rider runs (D10 from 1505): ${vB[2].twoBag} mL. IV med: insulin ${vB[2].insulin} + riders ${rl(vB[2])} (${vB[2].riders} mL). Voids 1600 130, 1800 110 mL.`],
  [T('Mon', '23:00'), '1900-2300', { po: 120, iv: vB[3].twoBag, ivmed: vB[3].insulin + vB[3].riders, urine: 230, emesis: 0 }, `Two-bag 40-70 mL/h (D10): ${vB[3].twoBag} mL. IV med: insulin ${vB[3].insulin} + riders ${rl(vB[3])} (${vB[3].riders} mL). Sips of water from 2000 (120 mL). Voids 2030 120, 2245 110 mL.`],
  [T('Tue', '03:00'), '2300-0300', { po: 120, iv: vB[4].twoBag, ivmed: vB[4].insulin + vB[4].riders, urine: 220, emesis: 0 }, `Two-bag 40-70 mL/h (D10): ${vB[4].twoBag} mL. IV med: insulin ${vB[4].insulin} + riders ${rl(vB[4])} (${vB[4].riders} mL). Water 120 mL. Voids 0130 120, 0250 100 mL.`],
  [T('Tue', '07:00'), '0300-0700', { po: 60, iv: vB[5].twoBag, ivmed: vB[5].insulin + vB[5].riders, urine: 230, emesis: 0 }, `Two-bag 40-70 mL/h (D10): ${vB[5].twoBag} mL. IV med: insulin 4.9 then 3.6 mL/h from 0310 (${vB[5].insulin} mL) + riders ${rl(vB[5])} (${vB[5].riders} mL). Water 60 mL. Voids 0500 120, 0650 110 mL. Weight 0600: 49.1 kg.`],
  [T('Tue', '11:00'), '0700-1100', { po: 360, iv: vB[6].twoBag + 105, ivmed: vB[6].insulin + vB[6].riders, urine: 380, emesis: 0 }, `Two-bag to 0915 (${vB[6].twoBag} mL), then D5 0.45% NaCl + KCl 20 mEq/L 60 mL/h (105 mL). IV med: insulin 3.6 mL/h to 0915 (${vB[6].insulin} mL) + riders ${rl(vB[6])} (${vB[6].riders} mL). Breakfast 0800: milk 240 + water 120. Voids 0830 200, 1030 180 mL.`],
  [T('Tue', '15:00'), '1100-1500', { po: 600, iv: 240, ivmed: 0, urine: 420, emesis: 0 }, 'Maintenance IV 60 mL/h. Lunch 1200 (milk 240, water 360). Voids 1200 220, 1400 200 mL. Transferred to 5 North at 1500.'],
  [T('Tue', '19:00'), '1500-1900', { po: 600, iv: 120, ivmed: 0, urine: 450, emesis: 0 }, 'Maintenance IV 60 mL/h until 1700, then saline lock. Water and dinner 1730. Voids 1600 200, 1830 250 mL.'],
  [T('Tue', '23:00'), '1900-2300', { po: 480, iv: 0, ivmed: 0, urine: 450, emesis: 0 }, 'Bedtime snack 2100 (milk). Voids 2030 250, 2230 200 mL.'],
  [T('Wed', '03:00'), '2300-0300', { po: 240, iv: 0, ivmed: 0, urine: 220, emesis: 0 }, 'Low glucose 0230: juice 120 mL (15 g), then milk 120 mL with crackers 0250. Void 0235 220 mL.'],
  [T('Wed', '07:00'), '0300-0700', { po: 0, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Void 0640 300 mL. Weight 0600: 49.4 kg.'],
  [T('Wed', '11:00'), '0700-1100', { po: 480, iv: 0, ivmed: 0, urine: 450, emesis: 0 }, 'Breakfast. Voids 0900 250, 1045 200 mL.'],
  [T('Wed', '15:00'), '1100-1500', { po: 600, iv: 0, ivmed: 0, urine: 450, emesis: 0 }, 'Lunch. Voids 1230 250, 1430 200 mL.'],
  [T('Wed', '19:00'), '1500-1900', { po: 600, iv: 0, ivmed: 0, urine: 450, emesis: 0 }, 'Dinner 1730. Voids 1630 250, 1830 200 mL.'],
  [T('Wed', '23:00'), '1900-2300', { po: 480, iv: 0, ivmed: 0, urine: 450, emesis: 0 }, 'Bedtime snack 2100. Voids 2030 200, 2245 250 mL.'],
  [T('Thu', '03:00'), '2300-0300', { po: 0, iv: 0, ivmed: 0, urine: 200, emesis: 0 }, 'Woke at 0210 (CGM alarm); void 0215 200 mL.'],
  [T('Thu', '07:00'), '0300-0700', { po: 120, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 120 mL. Void 0645 300 mL. Weight 0600: 49.6 kg.']
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, POC, BLOCKS, ag, corrNa, effOsm, egfr };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'eGFR', egfr(p.Cr), p.pH ? `HH pH ${(6.1 + Math.log10(p.HCO3 / (0.03 * p.pCO2))).toFixed(2)} Winter ${(1.5 * p.HCO3 + 8).toFixed(1)}+-2 vs pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev && typeof v === 'number' && typeof prev[1] === 'number') { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && hOfStamp(t) < 26) console.log(t.slice(5), v, 'rate/h', ((v - prev[1]) / dh).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0; const days = {};
  io.forEach(b => { ti += b.intake; to += b.output; console.log(b.collected, b.time, 'in', b.intake, 'out', b.output); });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to);
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['Mon 0700-Tue 0700', T('Mon', '07:00'), T('Tue', '07:00')], ['Tue 0700-Wed 0700', T('Tue', '07:00'), T('Wed', '07:00')], ['Wed 0700-Thu 0700', T('Wed', '07:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n, 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
  [['Mon day', T('Mon', '07:00'), T('Mon', '19:00')], ['Mon night', T('Mon', '19:00'), T('Tue', '07:00')], ['Tue day', T('Tue', '07:00'), T('Tue', '19:00')], ['Tue night', T('Tue', '19:00'), T('Wed', '07:00')], ['Wed day', T('Wed', '07:00'), T('Wed', '19:00')], ['Wed night', T('Wed', '19:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n, 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
}

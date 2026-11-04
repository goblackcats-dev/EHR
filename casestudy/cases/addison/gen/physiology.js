/* Adrenal crisis patient: vital signs (history and the 0700 arrival set ONLY), labs (time-gated), intake and output.  See ../DESIGN.md.
   Vital signs after 0700 are NOT in the chart: the instructor sets them on the bedside monitor and the students chart them. */
const { at, slug } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  ['2026-09-22 09:00', 98.2, 72, 112, 70, 14, 99, RA, 0, 'Clinic (PCP) visit', 'Pulse oximeter'],
  [T('Mon', '03:40'), 99.6, 126, 74, 40, 22, 96, RA, 6, 'EMS (at home)', 'Cardiac monitor (EMS)'],
  [T('Mon', '04:05'), 99.8, 124, 78, 44, 22, 97, RA, 6, 'ED triage', 'Telemetry/ECG monitor'],
  [T('Mon', '04:45'), 99.6, 116, 86, 50, 20, 97, RA, 5, 'ED, after hydrocortisone, dextrose and the first liter of saline', 'Telemetry/ECG monitor'],
  [T('Mon', '05:30'), 99.5, 108, 92, 54, 20, 98, RA, 5, 'ED, after the second liter of saline', 'Telemetry/ECG monitor'],
  [T('Mon', '06:20'), 99.4, 104, 96, 58, 18, 98, RA, 4, 'ED, before transfer', 'Telemetry/ECG monitor'],
  // ---- simulation starts Mon 07:00 (arrival to the unit). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Mon', '07:00'), 99.4, 104, 98, 60, 18, 98, RA, 4, 'Unit arrival (lying)', 'Telemetry/ECG monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 50 ? 'Low' : ''); mk('HRSRC', 'HR Source', hsrc); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 180 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Right arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 22 ? 'High' : rr < 10 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
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
// CKD-EPI 2021, female, age 46
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.7, 1), -0.241) * Math.pow(Math.max(cr / 0.7, 1), -1.2) * Math.pow(0.9938, 46) * 1.012);
// Chemistry panels. t = collected, r = result time (the lab result appears in the chart at r).
const PANELS = [
  { t: '2026-09-22 09:00', r: '2026-09-22 11:30', Na: 137, K: 4.6, Cl: 102, CO2: 26, BUN: 14, Cr: 0.8, Glu: 88, Ca: 9.4, Mg: 2.0, Phos: 3.4 },
  { t: T('Mon', '04:06'), r: T('Mon', '05:10'), Na: 126, K: 6.0, Cl: 94, CO2: 18, BUN: 38, Cr: 1.6, Glu: 49, Ca: 10.6, Mg: 2.3, Phos: 4.8 },
  { t: T('Mon', '09:00'), r: T('Mon', '09:50'), Na: 128, K: 5.5, Cl: 98, CO2: 19, BUN: 34, Cr: 1.4, Glu: 74, Ca: 9.9 },
  { t: T('Mon', '13:00'), r: T('Mon', '13:50'), Na: 132, K: 4.9, Cl: 102, CO2: 20, BUN: 28, Cr: 1.2, Glu: 96, Ca: 9.4 },
  { t: T('Mon', '17:00'), r: T('Mon', '17:50'), Na: 133, K: 4.4, Cl: 104, CO2: 20, BUN: 22, Cr: 1.0, Glu: 112, Ca: 9.2 },
  { t: T('Mon', '21:00'), r: T('Mon', '21:50'), Na: 133, K: 4.0, Cl: 104, CO2: 21, BUN: 18, Cr: 0.9, Glu: 128, Ca: 9.0 },
  { t: T('Tue', '01:00'), r: T('Tue', '01:50'), Na: 133, K: 3.7, Cl: 103, CO2: 22, BUN: 15, Cr: 0.9, Glu: 136, Ca: 8.9, Mg: 1.9, Phos: 2.9 },
  { t: T('Tue', '05:00'), r: T('Tue', '05:50'), Na: 134, K: 3.5, Cl: 103, CO2: 23, BUN: 13, Cr: 0.8, Glu: 118, Ca: 8.9, Mg: 1.8, Phos: 3.1 }
];
function buildLabs() {
  const out = [], add = a => out.push(...a);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, PANELS.filter(p => p[key] !== null && p[key] !== undefined).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '136-145', 136, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.1', 3.5, 5.1, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0);
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.5-1.1', 0.5, 1.1, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-110', 70, 110, 0, { crit: [50, 450] }); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.2', 8.6, 10.2, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.2', 1.7, 2.2, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1);
  add(lab('Chemistry', 'eGFR', 'mL/min/1.73m2', '>60', 60, null, PANELS.filter(p => p.Cr).map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-16', 8, 16, PANELS.slice(1).map(p => [p.t, p.Na - p.Cl - p.CO2, p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[T('Mon', '04:06'), 4.6, T('Mon', '05:10')], [T('Tue', '05:00'), 3.6, T('Tue', '05:50')]], { dec: 1 }));
  add(lab('Chemistry', 'Serum osmolality', 'mOsm/kg', '275-295', 275, 295, [[T('Mon', '04:06'), 264, T('Mon', '05:10')]], { dec: 0 }));
  add(lab('Chemistry', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Mon', '04:06'), 3.1, T('Mon', '04:40')], [T('Mon', '09:00'), 1.4, T('Mon', '09:50')]], { dec: 1 }));
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[T('Mon', '04:06'), 34, T('Mon', '05:10')]], { dec: 0 }));
  add(lab('Chemistry', 'AST', 'U/L', '10-40', 10, 40, [[T('Mon', '04:06'), 28, T('Mon', '05:10')]], { dec: 0 }));
  add(lab('Chemistry', 'ALT', 'U/L', '7-35', 7, 35, [[T('Mon', '04:06'), 22, T('Mon', '05:10')]], { dec: 0 }));
  add(lab('Chemistry', 'Bilirubin, total', 'mg/dL', '0.2-1.2', 0.2, 1.2, [[T('Mon', '04:06'), 0.6, T('Mon', '05:10')]], { dec: 1 }));
  add(lab('Endocrine', 'TSH', 'mIU/L', '0.4-4.5', 0.4, 4.5, [['2026-09-22 09:00', 2.8, '2026-09-22 11:30'], [T('Mon', '04:06'), 4.6, T('Mon', '06:15')]], { dec: 1 }));
  add(lab('Endocrine', 'Free T4', 'ng/dL', '0.8-1.8', 0.8, 1.8, [[T('Mon', '04:06'), 1.1, T('Mon', '06:15')]], { dec: 1 }));
  // drawn in the ED at 0406, BEFORE the hydrocortisone (0420). Results return during the day shift.
  add(lab('Endocrine', 'Cortisol, random (drawn before hydrocortisone)', 'mcg/dL', 'Morning 5-23; in severe illness expected over 18', 5, 23, [[T('Mon', '04:06'), 1.8, T('Mon', '13:10')]], { dec: 1, crit: [3] }));
  add(lab('Endocrine', 'ACTH (drawn before hydrocortisone)', 'pg/mL', '7.2-63', 7.2, 63, [[T('Mon', '04:06'), 1240, T('Mon', '14:40')]], { dec: 0 }));
  add(lab('Endocrine', 'Plasma renin activity (add-on to the 0406 ED sample)', 'ng/mL/h', '0.6-4.3 (upright)', null, null, [[T('Mon', '04:06'), 'Pending (send-out laboratory, 3-5 days)', T('Mon', '13:50')]], { status: 'Pending' }));
  add(lab('Endocrine', 'Aldosterone (add-on to the 0406 ED sample)', 'ng/dL', '4-31 (upright)', null, null, [[T('Mon', '04:06'), 'Pending (send-out laboratory, 3-5 days)', T('Mon', '13:50')]], { status: 'Pending' }));
  add(lab('Cardiac', 'Troponin I', 'ng/mL', '<0.04', null, 0.04, [[T('Mon', '04:06'), 0.01, T('Mon', '05:10')]], { dec: 2 }));
  // CBC with differential: ED and Tuesday morning
  const CB = [[T('Mon', '04:06'), T('Mon', '04:50')], [T('Tue', '05:00'), T('Tue', '05:45')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.0-11.0', 4.0, 11.0, [10.8, 12.6], 1); cb('Hemoglobin', 'g/dL', '12.0-15.5', 12.0, 15.5, [14.6, 11.9], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '36-46', 36, 46, [43.8, 35.6], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [268, 231], 0);
  cb('Neutrophils', '%', '40-70', 40, 70, [50, 82], 0); cb('Lymphocytes', '%', '20-40', 20, 40, [38, 12], 0);
  cb('Eosinophils', '%', '0-5', 0, 5, [7.0, 0.4], 1); cb('Eosinophils, absolute', 'K/uL', '0.0-0.5', 0.0, 0.5, [0.76, 0.05], 2);
  // urine studies (ED)
  const ua = (label, units, ref, v, o) => add(lab('Urinalysis', label, units, ref, null, null, [[T('Mon', '04:50'), v, T('Mon', '05:30')]], Object.assign({ specimen: 'Urine (clean catch in the ED)', abn: /1\+|2\+|Trace|Positive|Dark/ }, o || {})));
  ua('UA appearance', '', 'Clear/yellow', 'Dark yellow, clear'); ua('UA specific gravity', '', '1.005-1.030', '1.026'); ua('UA protein', '', 'Negative', 'Trace'); ua('UA glucose', '', 'Negative', 'Negative'); ua('UA ketones', '', 'Negative', '2+');
  ua('UA blood', '', 'Negative', 'Negative'); ua('UA leukocyte esterase', '', 'Negative', 'Negative'); ua('UA nitrite', '', 'Negative', 'Negative'); ua('Urine hCG (pregnancy)', '', 'Negative', 'Negative');
  add(lab('Urinalysis', 'Urine sodium', 'mmol/L', 'Under 20 expected when a person is dehydrated', null, null, [[T('Mon', '04:50'), 48, T('Mon', '05:40')]], { specimen: 'Urine (clean catch in the ED)' }));
  add(lab('Urinalysis', 'Urine osmolality', 'mOsm/kg', '50-1200', null, null, [[T('Mon', '04:50'), 420, T('Mon', '05:40')]], { specimen: 'Urine (clean catch in the ED)' }));
  // microbiology
  add(lab('Microbiology', 'Blood culture x2 (0430, before any antibiotic)', '', 'No growth', null, null, [[T('Mon', '04:30'), 'No growth at 24 hours (preliminary; final at 5 days)', T('Tue', '05:30')]], { specimen: 'Blood (two sites)', status: 'Preliminary' }));
  add(lab('Microbiology', 'Clostridioides difficile toxin gene PCR', '', 'Negative', null, null, [[T('Mon', '09:45'), 'Negative', T('Mon', '12:40')]], { specimen: 'Stool (liquid)' }));
  add(lab('Microbiology', 'GI pathogen PCR panel (stool)', '', 'Not detected', null, null, [[T('Mon', '09:45'), 'Norovirus GI/GII DETECTED. Salmonella, Shigella, Campylobacter, E. coli STEC, rotavirus and others not detected.', T('Mon', '18:20')]], { specimen: 'Stool (liquid)', abn: /DETECTED/ }));
  // ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /peaked|tachy/i }));
  ecg(T('Mon', '04:25'), T('Mon', '04:35'), 'Sinus tachycardia 118 bpm, PR 148 ms, QRS 88 ms, QTc 428 ms. Tall, narrow, peaked T waves V2-V4 (correlate with potassium). No ST elevation.');
  ecg(T('Mon', '13:30'), T('Mon', '13:40'), 'Sinus rhythm 94 bpm, PR 152 ms, QRS 86 ms, QTc 432 ms. T waves normal; peaked T waves seen at 0425 have resolved.');
  // point-of-care glucose: EMS, ED and arrival only (the rest are done by the students at the bedside)
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-110', 70, 110, [[T('Mon', '03:40'), 58], [T('Mon', '04:05'), 52], [T('Mon', '04:25'), 132], [T('Mon', '05:30'), 96], [T('Mon', '06:45'), 88]], { specimen: 'Capillary blood', crit: [50, 400] }));
  return out;
}

// intake and output in blocks; each block shows when it ends (collected). Voids and stools: see DESIGN.md.
function buildIO() {
  const B = [
    [T('Mon', '03:35'), '48 h home est.', 800, 2400, { po: 800, iv: 0, urine: 500, other: 1900, otherLabel: 'Emesis about 900 mL + diarrhea about 1,000 mL (husband estimate, Sat-Mon)' }, 'Home estimate before EMS arrived'],
    [T('Mon', '07:00'), '0335-0700 EMS + ED', 2700, 500, { po: 0, iv: 2700, urine: 150, other: 350, otherLabel: 'Emesis 150 mL (0440) + liquid stool 200 mL (0515)' }, 'IV: EMS saline 500, saline boluses 2 x 1,000, D50 50, D5NS 150 (0600-0700). Voided 150 mL dark yellow 0450.'],
    [T('Mon', '11:00'), '0700-1100', 660, 630, { po: 60, iv: 600, urine: 380, other: 250, otherLabel: 'Liquid stool (0945, sample sent)' }, 'D5NS 150 mL/h; sips 60 mL. Voids 0800 120, 0930 140, 1050 120 mL (hat).'],
    [T('Mon', '15:00'), '1100-1500', 770, 1050, { po: 120, iv: 650, urine: 1050, other: 0, otherLabel: '' }, 'D5NS 600 + dextrose 50% 50 mL (1105). Voids 1150 250, 1300 300, 1400 280, 1450 220 mL: brisk water diuresis (about 260 mL/h).'],
    [T('Mon', '19:00'), '1500-1900', 905, 1100, { po: 480, iv: 425, urine: 900, other: 200, otherLabel: 'Loose stool (1640)' }, 'D5NS 150 mL/h to 1530, then D5 0.45% NaCl 100 mL/h. Clear liquids. Voids 1600 300, 1730 320, 1850 280 mL.'],
    [T('Mon', '23:00'), '1900-2300', 1120, 700, { po: 720, iv: 400, urine: 700, other: 0, otherLabel: '' }, 'Regular dinner 2000 (ate 75%). Voids 2000 250, 2130 250, 2250 200 mL.'],
    [T('Tue', '03:00'), '2300-0300', 640, 600, { po: 240, iv: 400, urine: 450, other: 150, otherLabel: 'Soft loose stool (0240)' }, 'Voids 0030 250, 0245 200 mL.'],
    [T('Tue', '07:00'), '0300-0700', 760, 500, { po: 360, iv: 400, urine: 500, other: 0, otherLabel: '' }, 'Voids 0430 250, 0640 250 mL. Weight 0600: 59.8 kg (58.2 on arrival).']
  ];
  return B.map(([t2, time, i, o, detail, note]) => ({ id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time, collected: t2, intake: i, output: o, detail, note }));
}
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, egfr };
if (require.main === module) { console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length, 'eGFR', PANELS.map(p => egfr(p.Cr)).join(',')); }

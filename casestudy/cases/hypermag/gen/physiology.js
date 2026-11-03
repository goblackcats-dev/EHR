/* Hypermagnesemia patient: vital signs (history and the 0700 arrival set ONLY), labs (time-gated), intake and output.  See ../DESIGN.md.
   Vital signs after 0700 are NOT in the chart: the instructor sets them on the bedside monitor and the students chart them. */
const { H, at, slug } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  ['2026-10-20 08:30', 98.1, 72, 138, 76, 16, 96, RA, 3, 'Clinic (PCP) visit', 'Pulse oximeter'],
  [T('Tue', '04:25'), 97.2, 46, 82, 46, 14, 95, RA, 2, 'ED triage', 'Telemetry/ECG monitor'],
  [T('Tue', '05:00'), 97.3, 48, 86, 48, 14, 95, RA, 2, 'ED', 'Telemetry/ECG monitor'],
  [T('Tue', '05:55'), 97.4, 46, 88, 50, 14, 95, RA, 2, 'ED, before calcium gluconate', 'Telemetry/ECG monitor'],
  [T('Tue', '06:20'), 97.6, 50, 94, 54, 14, 95, RA, 2, 'ED, after calcium gluconate and 500 mL saline', 'Telemetry/ECG monitor'],
  // ---- simulation starts Tue 07:00 (arrival to the unit). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Tue', '07:00'), 97.6, 52, 96, 56, 14, 94, RA, 2, 'Unit arrival', 'Telemetry/ECG monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 50 ? 'Low' : ''); mk('HRSRC', 'HR Source', hsrc); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 180 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Left arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
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
// CKD-EPI 2021, male, age 74
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.9, 1), -0.302) * Math.pow(Math.max(cr / 0.9, 1), -1.2) * Math.pow(0.9938, 74));
// Chemistry panels. t = collected, r = result time (the lab result appears in the chart at r).
const PANELS = [
  { t: '2026-10-20 08:30', r: '2026-10-20 10:15', Na: 138, K: 4.8, Cl: 104, CO2: 21, BUN: 58, Cr: 2.6, Glu: 156, Ca: 9.0, Mg: 2.4, Phos: 4.6 },
  { t: T('Tue', '04:40'), r: T('Tue', '05:35'), Na: 134, K: 5.4, Cl: 99, CO2: 17, BUN: 84, Cr: 4.9, Glu: 148, Ca: 8.1, Mg: 7.8, Phos: 6.2 },
  { t: T('Tue', '09:00'), r: T('Tue', '09:50'), Na: 135, K: 5.3, Cl: 100, CO2: 18, BUN: 82, Cr: 4.8, Glu: 122, Ca: 8.7, Mg: 8.7, Phos: 6.3 },
  { t: T('Tue', '11:15'), r: T('Tue', '12:00'), Na: 135, K: 5.6, Cl: 100, CO2: 17, BUN: 84, Cr: 5.0, Glu: 108, Ca: 8.5, Mg: 9.5, Phos: 6.4, stat: true },
  { t: T('Tue', '13:15'), r: T('Tue', '14:00'), Na: 136, K: 5.8, Cl: 101, CO2: 16, BUN: 88, Cr: 5.3, Glu: 96, Ca: 8.3, Mg: 10.9, Phos: 6.5, stat: true },
  { t: T('Tue', '17:00'), r: T('Tue', '17:45'), Na: 137, K: 4.4, Cl: 101, CO2: 21, BUN: 52, Cr: 3.9, Glu: 71, Ca: 8.0, Mg: 7.2, Phos: 4.6, circuit: true },
  { t: T('Tue', '18:00'), r: T('Tue', '18:50'), Na: 138, K: 3.9, Cl: 102, CO2: 23, BUN: 38, Cr: 3.0, Glu: null, Ca: 7.7, Mg: 4.6, Phos: 3.3, post: true },
  { t: T('Tue', '21:00'), r: T('Tue', '21:45'), Na: 138, K: 4.3, Cl: 102, CO2: 22, BUN: 40, Cr: 3.4, Glu: 118, Ca: 7.9, Mg: 5.6, Phos: 4.0 },
  { t: T('Wed', '01:00'), r: T('Wed', '01:45'), Na: 137, K: 4.5, Cl: 101, CO2: 22, BUN: 44, Cr: 3.5, Glu: 132, Ca: 8.1, Mg: 6.4, Phos: 4.2 },
  { t: T('Wed', '05:00'), r: T('Wed', '05:45'), Na: 138, K: 4.3, Cl: 102, CO2: 23, BUN: 42, Cr: 3.3, Glu: 128, Ca: 8.4, Mg: 5.3, Phos: 4.3 }
];
function buildLabs() {
  const out = [], add = a => out.push(...a);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, PANELS.filter(p => p[key] !== null && p[key] !== undefined).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '136-145', 136, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.1', 3.5, 5.1, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0);
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-110', 70, 110, 0, { crit: [50, 450] }); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.2', 8.6, 10.2, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.2', 1.7, 2.2, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1);
  add(lab('Chemistry', 'eGFR', 'mL/min/1.73m2', '>60', 60, null, PANELS.filter(p => p.Cr).map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[T('Tue', '04:40'), 3.3, T('Tue', '05:35')], [T('Wed', '05:00'), 3.1, T('Wed', '05:45')]], { dec: 1 }));
  add(lab('Chemistry', 'Ionized calcium', 'mmol/L', '1.12-1.32', 1.12, 1.32, [[T('Tue', '18:00'), 1.02, T('Tue', '18:50')], [T('Tue', '21:00'), 1.06, T('Tue', '21:45')], [T('Wed', '01:00'), 1.08, T('Wed', '01:45')]], { dec: 2, crit: [0.9] }));
  add(lab('Chemistry', 'Hemoglobin A1c', '%', '<5.7', null, 5.7, [['2026-10-20 08:30', 7.8, '2026-10-20 10:15']], { dec: 1 }));
  add(lab('Chemistry', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Tue', '04:40'), 1.8, T('Tue', '05:35')], [T('Tue', '11:15'), 2.0, T('Tue', '12:00')]], { dec: 1 }));
  add(lab('Cardiac', 'Troponin I', 'ng/mL', '<0.04', null, 0.04, [[T('Tue', '04:40'), 0.03, T('Tue', '05:35')]], { dec: 2 }));
  add(lab('Cardiac', 'BNP', 'pg/mL', '<100', null, 100, [[T('Tue', '04:40'), 452, T('Tue', '05:35')]], { dec: 0 }));
  add(lab('Coagulation', 'INR', '', '0.9-1.1', 0.9, 1.1, [[T('Tue', '04:40'), 1.1, T('Tue', '05:35')]], { dec: 1 }));
  const CB = [[T('Tue', '04:40'), T('Tue', '05:35')], [T('Tue', '09:00'), T('Tue', '09:50')], [T('Wed', '05:00'), T('Wed', '05:45')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.0-11.0', 4.0, 11.0, [11.8, 10.6, 9.0], 1); cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [10.4, 10.0, 9.6], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '41-53', 41, 53, [31.2, 30.0, 28.8], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [214, 206, 192], 0);
  // arterial blood gases
  const abg = (when, avail, ph, co2, o2, hco3, sat, dev) => {
    const mk = (label, units, ref, lo, hi, v, dec) => add(lab('Blood Gas', label, units, ref, lo, hi, [[when, v, avail]], { dec, specimen: `Arterial blood (${dev})` }));
    mk('ABG pH', '', '7.35-7.45', 7.35, 7.45, ph, 2); mk('ABG PaCO2', 'mmHg', '35-45', 35, 45, co2, 0); mk('ABG PaO2', 'mmHg', '80-100', 80, 100, o2, 0); mk('ABG HCO3', 'mmol/L', '22-26', 22, 26, hco3, 0); mk('ABG O2 saturation', '%', '95-100', 95, 100, sat, 0);
  };
  abg(T('Tue', '11:30'), T('Tue', '11:45'), 7.24, 46, 72, 19, 94, 'on 3 L/min nasal cannula'); abg(T('Tue', '14:15'), T('Tue', '14:30'), 7.20, 52, 68, 20, 91, 'on 4 L/min nasal cannula');
  // urinalysis and urine chemistry
  const ua = (label, units, ref, v, o) => add(lab('Urinalysis', label, units, ref, null, null, [[T('Tue', '04:50'), v, T('Tue', '05:40')]], Object.assign({ specimen: 'Urine (clean catch in the ED)', abn: /1\+|Trace|Cloudy|Dark/ }, o || {})));
  ua('UA appearance', '', 'Clear/yellow', 'Dark amber, clear'); ua('UA specific gravity', '', '1.005-1.030', '1.021'); ua('UA protein', '', 'Negative', '1+'); ua('UA glucose', '', 'Negative', 'Negative'); ua('UA ketones', '', 'Negative', 'Negative');
  ua('UA blood', '', 'Negative', 'Negative'); ua('UA leukocyte esterase', '', 'Negative', 'Negative'); ua('UA nitrite', '', 'Negative', 'Negative');
  add(lab('Urinalysis', 'Urine sodium', 'mmol/L', '', null, null, [[T('Tue', '08:45'), 14, T('Tue', '10:00')]], { specimen: 'Urine (Foley)' }));
  add(lab('Urinalysis', 'Urine creatinine', 'mg/dL', '', null, null, [[T('Tue', '08:45'), 80, T('Tue', '10:00')]], { specimen: 'Urine (Foley)' }));
  add(lab('Urinalysis', 'FENa (fractional excretion of sodium)', '%', '<1% suggests a prerenal cause', null, null, [[T('Tue', '08:45'), '0.6% (prerenal pattern)', T('Tue', '10:00')]], { specimen: 'Urine (Foley)', abn: /prerenal/ }));
  // ECG interpretations (filed under Cardiac)
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /./ }));
  ecg(T('Tue', '04:30'), T('Tue', '04:40'), 'Sinus bradycardia 46 bpm, first-degree AV block (PR 248 ms), QRS 124 ms (wide), QTc 468 ms. No peaked T waves.');
  ecg(T('Tue', '11:30'), T('Tue', '11:40'), 'Sinus bradycardia 40 bpm, first-degree AV block (PR 300 ms), QRS 136 ms (wide), QTc 480 ms. No dropped beats.');
  ecg(T('Tue', '13:30'), T('Tue', '13:35'), 'Sinus bradycardia 38 bpm, first-degree AV block (PR 320 ms), QRS 148 ms (wide), QTc 492 ms, tall peaked T waves (correlate with potassium).');
  ecg(T('Tue', '18:30'), T('Tue', '18:35'), 'Sinus rhythm 66 bpm, PR 204 ms, QRS 108 ms, QTc 486 ms (prolonged; correlate with calcium).');
  ecg(T('Wed', '02:30'), T('Wed', '02:40'), 'Sinus bradycardia 54 bpm, first-degree AV block (PR 236 ms), QRS 114 ms, QTc 478 ms.');
  ecg(T('Wed', '06:00'), T('Wed', '06:10'), 'Sinus rhythm 66 bpm, PR 212 ms, QRS 102 ms, QTc 462 ms.');
  // point-of-care glucose: ED and arrival only (the rest are done by the students at the bedside)
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-110', 70, 110, [[T('Tue', '04:25'), 148], [T('Tue', '06:45'), 132]], { specimen: 'Capillary blood', crit: [50, 400] }));
  return out;
}

// intake and output in blocks; each block shows when it ends (collected). Hourly urine for the blocks: see DESIGN.md.
function buildIO() {
  const B = [
    ['2026-11-17 04:30', '24 h home est.', 600, 900, { po: 600, iv: 0, urine: 300, other: 600, otherLabel: 'Emesis (wife estimate, 4 days of vomiting)' }, 'Home estimate before arrival'],
    [T('Tue', '07:00'), '0430-0700', 500, 230, { po: 0, iv: 500, urine: 130, other: 100, otherLabel: 'Emesis (ED)' }, 'Foley placed 0610'],
    [T('Tue', '11:00'), '0700-1100', 800, 160, { po: 0, iv: 800, urine: 160, other: 0, otherLabel: '' }, 'Foley, hourly 35 / 30 / 55 / 40 mL'],
    [T('Tue', '15:00'), '1100-1500', 845, 70, { po: 0, iv: 845, urine: 70, other: 0, otherLabel: '' }, 'Foley, hourly 20 / 25 / 15 / 10 mL (oliguria)'],
    [T('Tue', '19:00'), '1500-1900', 450, 575, { po: 0, iv: 450, urine: 75, other: 500, otherLabel: 'Hemodialysis ultrafiltration' }, 'Foley 15 / 20 / 20 / 20 mL; HD 1500-1800'],
    [T('Tue', '23:00'), '1900-2300', 500, 210, { po: 360, iv: 140, urine: 210, other: 0, otherLabel: '' }, 'Foley, hourly 45 / 50 / 55 / 60 mL'],
    [T('Wed', '03:00'), '2300-0300', 300, 190, { po: 200, iv: 100, urine: 190, other: 0, otherLabel: '' }, 'Foley, hourly 55 / 50 / 45 / 40 mL'],
    [T('Wed', '07:00'), '0300-0700', 360, 280, { po: 360, iv: 0, urine: 280, other: 0, otherLabel: '' }, 'Foley, hourly 55 / 65 / 75 / 85 mL; large stool x1 0345 (not measured)']
  ];
  return B.map(([t2, time, i, o, detail, note]) => ({ id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time, collected: t2, intake: i, output: o, detail, note }));
}
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, egfr };
if (require.main === module) { console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length, PANELS.map(p => egfr(p.Cr)).join(',')); }

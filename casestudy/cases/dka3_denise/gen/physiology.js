/* DKA patient 3 (Denise Carter): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Mon 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40503) and the students chart them. */
const { at, slug, hOfStamp, H } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
const F = c => Math.round((c * 9 / 5 + 32) * 10) / 10;   // Celsius to Fahrenheit (design lists Celsius)
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  [T('Mon', '02:00'), F(36.8), 124, 96, 58, 30, 98, RA, 4, 'ED triage (deep regular breathing, drowsy but arousable)', 'Cardiac monitor'],
  [T('Mon', '03:30'), F(36.9), 114, 106, 64, 26, 99, RA, 3, 'ED, after the first liter of saline', 'Cardiac monitor'],
  [T('Mon', '06:00'), F(36.9), 102, 112, 68, 24, 99, RA, 2, 'ED, before transfer', 'Cardiac monitor'],
  // ---- simulation starts Mon 07:00 (arrival to step-down/telemetry). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Mon', '07:00'), F(36.8), 100, 114, 70, 22, 99, RA, 2, 'Step-down / telemetry arrival', 'Cardiac monitor']
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
// eGFR, CKD-EPI 2021 (race-free), 38-year-old woman (not valid while creatinine is changing: teaching point)
const AGE = 38;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.7, 1), -0.241) * Math.pow(Math.max(cr / 0.7, 1), -1.2) * Math.pow(0.9938, AGE) * 1.012);
// Chemistry panels from the design (Section 3). t = collected, r = result time (all chemistry, BHB and gas results release 15 minutes after collection;
// the design lists them as expedited reporting). Serum total CO2 (BMP) is the HCO3 used for every anion gap. ED gas = ARTERIAL, all later gases = VENOUS.
const R = (d, t) => T(d, t);
const PANELS = [
  { k: 'ED', t: R('Mon', '02:00'), r: R('Mon', '02:15'), Na: 130, K: 5.3, Cl: 94, CO2: 9, BUN: 32, Cr: 1.5, Glu: 684, AGdesign: 27, pH: 7.23, pCO2: 22, art: true, BHB: 7.2, Phos: 4.8, Mg: 1.9 },
  { k: 'P1', t: R('Mon', '04:45'), r: R('Mon', '05:00'), Na: 133, K: 4.0, Cl: 100, CO2: 12, BUN: 29, Cr: 1.2, Glu: 544, AGdesign: 21, pH: 7.27, pCO2: 27, BHB: 5.0, Phos: 2.7, Mg: 1.7 },
  { k: 'P2', t: R('Mon', '06:45'), r: R('Mon', '07:00'), Na: 135, K: 3.6, Cl: 103, CO2: 13, BUN: 25, Cr: 1.0, Glu: 424, AGdesign: 19, pH: 7.29, pCO2: 28, BHB: 4.1, Phos: 2.0, Mg: 1.6 },
  { k: 'P3', t: R('Mon', '07:45'), r: R('Mon', '08:00'), Na: 136, K: 3.2, Cl: 105, CO2: 14, BUN: 23, Cr: 0.9, Glu: 360, AGdesign: 17, pH: 7.30, pCO2: 29, BHB: 3.5, Phos: 1.8, Mg: 1.6 },
  { k: 'P4', t: R('Mon', '09:45'), r: R('Mon', '10:00'), Na: 137, K: 3.6, Cl: 107, CO2: 14, BUN: 21, Cr: 0.9, Glu: 332, AGdesign: 16, pH: 7.31, pCO2: 29, BHB: 3.0, Phos: 1.6, Mg: 1.6 },
  { k: 'P5', t: R('Mon', '11:45'), r: R('Mon', '12:00'), Na: 137, K: 4.0, Cl: 108, CO2: 16, BUN: 18, Cr: 0.8, Glu: 230, AGdesign: 13, pH: 7.33, pCO2: 31, BHB: 1.6, Phos: 1.5, Mg: 1.9 },
  { k: 'P6', t: R('Mon', '15:45'), r: R('Mon', '16:00'), Na: 138, K: 4.0, Cl: 108, CO2: 20, BUN: 15, Cr: 0.8, Glu: 184, AGdesign: 10, pH: 7.37, pCO2: 36, BHB: 0.4, Phos: 1.8, Mg: 1.9 },
  { k: 'P7', t: R('Mon', '18:45'), r: R('Mon', '19:00'), Na: 138, K: 3.9, Cl: 107, CO2: 22, BUN: 13, Cr: 0.8, Glu: 188, AGdesign: 9, pH: 7.38, pCO2: 38, BHB: 0.3, Phos: 2.0, Mg: 1.9 },
  { k: 'P8', t: R('Tue', '06:45'), r: R('Tue', '07:00'), Na: 138, K: 3.7, Cl: 105, CO2: 24, BUN: 10, Cr: 0.7, Glu: 142, AGdesign: 9, Phos: 2.3, Mg: 1.8 },
  { k: 'P9', t: R('Tue', '18:45'), r: R('Tue', '19:00'), Na: 139, K: 4.0, Cl: 105, CO2: 25, BUN: 9, Cr: 0.7, Glu: 171, AGdesign: 9, Phos: 2.6, Mg: 1.9 },
  { k: 'P10', t: R('Wed', '06:45'), r: R('Wed', '07:00'), Na: 139, K: 4.1, Cl: 105, CO2: 25, BUN: 9, Cr: 0.7, Glu: 126, AGdesign: 9, Phos: 2.9, Mg: 1.9 },
  { k: 'P11', t: R('Wed', '18:45'), r: R('Wed', '19:00'), Na: 139, K: 4.1, Cl: 104, CO2: 26, BUN: 10, Cr: 0.7, Glu: 151, AGdesign: 9, Phos: 3.1, Mg: 1.9 },
  { k: 'P12', t: R('Thu', '06:45'), r: R('Thu', '07:00'), Na: 139, K: 4.2, Cl: 104, CO2: 26, BUN: 10, Cr: 0.7, Glu: 132, AGdesign: 9, Phos: 3.2, Mg: 2.0 }
];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 100) / 100;   // ADA factor 1.6 per 100 mg/dL over 100
const effOsm = p => Math.round(2 * p.Na + p.Glu / 18);
const calcOsm = p => Math.round(2 * p.Na + p.Glu / 18 + p.BUN / 2.8);
const hh = p => 6.1 + Math.log10(p.CO2 / (0.03 * p.pCO2));   // Henderson-Hasselbalch with serum total CO2

// point-of-care glucose (meter docks to the chart). [day, time, value]
const POC = [
  ['Mon', '02:00', 690], ['Mon', '03:00', 650], ['Mon', '04:00', 590], ['Mon', '05:00', 530], ['Mon', '06:00', 470], ['Mon', '07:00', 410], ['Mon', '08:00', 350], ['Mon', '09:00', 340],
  ['Mon', '10:00', 330], ['Mon', '11:00', 270], ['Mon', '12:00', 220], ['Mon', '13:00', 190], ['Mon', '14:00', 175], ['Mon', '15:00', 180], ['Mon', '16:00', 185], ['Mon', '17:00', 190],
  ['Mon', '18:00', 185], ['Mon', '18:30', 188], ['Mon', '18:55', 190], ['Mon', '21:00', 178], ['Tue', '02:00', 156], ['Tue', '07:00', 148], ['Tue', '11:30', 136],
  ['Tue', '14:00', 62], ['Tue', '14:15', 78], ['Tue', '14:30', 104], ['Tue', '15:00', 121], ['Tue', '18:55', 174], ['Tue', '21:00', 162], ['Wed', '02:00', 140], ['Wed', '07:00', 134],
  ['Wed', '11:30', 158], ['Wed', '18:55', 156], ['Wed', '21:00', 144], ['Thu', '07:00', 134]
].map(([d, t, v]) => [T(d, t), v]);

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, has(key).map(p => [p.t, p[key], p.r]), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0', 3.5, 5.0, 1, { crit: [3.3, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.6-1.1', 0.6, 1.1, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-99 fasting (acute illness targets differ)', 70, 99, 0, { crit: [50, 500] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.4', 1.7, 2.4, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2, no potassium)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', '>60 (not reliable while creatinine is changing)', 60, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.r]), { dec: 1, crit: [undefined, 3.0] }));
  const g = has('pH');
  const gas = (label, units, ref, lo, hi, key, dec, artRef, artLo, artHi, o) => {
    const rows = lab('Blood Gas', label, units, ref, lo, hi, g.map(p => [p.t, p[key], p.r]), Object.assign({ dec, specimen: 'Venous blood' }, o || {}));
    rows.forEach((r, i) => { if (g[i].art) { r.specimen = 'Arterial blood'; r.reference = artRef; r.flag = g[i][key] < artLo ? 'Low' : g[i][key] > artHi ? 'High' : ''; if (key === 'pH' && g[i][key] < 7.25) r.flag = 'Critical Low'; } });
    add(rows);
  };
  gas('pH, blood gas', '', '7.31-7.41 venous (arterial 7.35-7.45)', 7.31, 7.41, 'pH', 2, '7.35-7.45 (arterial)', 7.35, 7.45, { crit: [7.25] });
  gas('pCO2, blood gas', 'mmHg', '41-51 venous (arterial 35-45)', 41, 51, 'pCO2', 0, '35-45 (arterial)', 35, 45);
  // first-draw extras (ED 0200): lactate, lipase, hCG, CBC (all result 0215); urinalysis (collected 0200, result 0230)
  const ED = T('Mon', '02:00'), EDR = T('Mon', '02:15');
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[ED, 1.7, EDR]], { dec: 1, specimen: 'Arterial blood' }));
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[ED, 30, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'hCG pregnancy screen (qualitative)', '', 'Negative', null, null, [[ED, 'Negative', EDR]], { abn: /Positive/ }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 without diabetes (individualized goal with diabetes)', null, 5.6, [[T('Mon', '06:45'), 11.8, T('Mon', '08:00')]], { dec: 1 }));
  const CB = [[ED, EDR], [T('Tue', '06:45'), T('Tue', '07:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'x10^3/uL', '4-11', 4, 11, [15.2, 9.0], 1); cb('Hemoglobin', 'g/dL', '12-16', 12, 16, [15.7, 12.8], 1, { crit: [7.0] }); cb('Platelets', 'x10^3/uL', '150-400', 150, 400, [326, 260], 0);
  const UT = ED, UR = T('Mon', '02:30');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch)', abn: /\+|Large|Trace|Positive|>|Over/ }));
  ua('UA glucose', 'Negative', '4+'); ua('UA ketones', 'Negative', '3+'); ua('UA nitrite', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA WBC', '0-5 /hpf', '0-2 /hpf');
  // ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology
  const ecg = (when, avail, v) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /prominent|tachy|U wave|flat/i }));
  ecg(T('Mon', '02:05'), T('Mon', '02:15'), 'Sinus tachycardia 122 bpm, PR 150 ms, QRS 86 ms, QTc 432 ms (Fridericia). Mildly prominent symmetric T waves, narrow QRS, no ischemic changes (potassium 5.3 at 0200).');
  ecg(T('Mon', '08:05'), T('Mon', '08:15'), 'Sinus rhythm 96 bpm, PR 158 ms, QRS 86 ms, QTc 460 ms (Fridericia). Flattened T waves with small distinct U waves, no ventricular ectopy (potassium 3.2 and magnesium 1.6 at 0745).');
  ecg(T('Mon', '18:55'), T('Mon', '19:00'), 'Normal sinus rhythm 88 bpm, PR 160 ms, QRS 84 ms, QTc 438 ms (Fridericia). Normal T-wave contour, no distinct U waves, no conduction abnormality (potassium 3.9 and magnesium 1.9 at 1845).');
  // point-of-care glucose
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-200 on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  return out;
}

// Intake and output in 4-hour blocks (each 12-hour shift = three blocks that add up to the design's shift totals); each block shows when it ends (collected) with periodEnd: true.
// iv = IV fluid (saline, saline + KCl, D5NS); ivmed = insulin carrier + KCl and magnesium piggybacks + ondansetron + flushes. Volumes from gen/infusions.js.
const I = require('./infusions');
const vB = [0, 4, 8, 12, 16, 20].map(h => I.vol(h * 60, h * 60 + 240)), vED = I.vol(I.M('Mon', '02:00'), 0);
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Mon', '07:00'), 'ED 0200-0700', { po: 0, iv: vED.fluid, ivmed: vED.insulin + 2 + 20, urine: 500, emesis: 250 }, `ED (before the 12-hour shifts). IV fluid: NS 1,000 mL 0200-0300 + NS 500 mL/h 0300-0500 (1,000 mL) + NS with KCl 20 mEq/L 250 mL/h 0500-0700 (500 mL; 10 mEq K) = ${vED.fluid} mL. IV med: regular insulin 6 mL/h from 0300 (${vED.insulin} mL) + ondansetron 2 mL + NS flushes 20 mL = ${vED.insulin + 22} mL. NPO. Emesis 250 mL at 0215. Voids 0200 100 mL (urine sample), 0415 250, 0610 150 (500 mL, no catheter). Weight 60.0 kg.`],
  [T('Mon', '11:00'), '0700-1100', { po: 150, iv: vB[0].fluid, ivmed: vB[0].insulin + vB[0].kcl + vB[0].mg + 10, urine: 600, emesis: 150 }, `Day 1 day shift, block 1. IV fluid: NS with KCl 20 mEq/L 250 mL/h to 0800 (250 mL), then NS without potassium 250 mL/h 0800-1100 (750 mL) = ${vB[0].fluid} mL. IV med: insulin 6 mL/h 0700-0800 and 1000-1100, HELD 0800-1000 (${vB[0].insulin} mL) + KCl piggybacks 0800, 0900, 1000 (${vB[0].kcl} mL) + magnesium sulfate 2 g in 100 mL 0800-1000 (${vB[0].mg} mL) + NS flush 1000 10 mL. Ice chips and sips 150 mL. Emesis 150 mL at 0730 after sips (the last vomiting episode). Voids 0745 250, 0900 200, 1030 150 mL.`],
  [T('Mon', '15:00'), '1100-1500', { po: 200, iv: vB[1].fluid, ivmed: vB[1].insulin + vB[1].kcl + 10, urine: 650, emesis: 0 }, `IV fluid: NS 250 mL/h 1100-1200 (250 mL) + D5NS with KCl 20 mEq/L 200 mL/h from 1200 (600 mL) = ${vB[1].fluid} mL. IV med: insulin 6 mL/h 1100-1200 then 3 mL/h (${vB[1].insulin} mL) + the fourth KCl piggyback 1100-1200 (${vB[1].kcl} mL) + NS flush 1200 10 mL. Ice chips and sips 200 mL. Voids 1130 250, 1300 200, 1430 200 mL.`],
  [T('Mon', '19:00'), '1500-1900', { po: 250, iv: vB[2].fluid, ivmed: vB[2].insulin + 20, urine: 550, emesis: 0 }, `IV fluid: D5NS with KCl 20 mEq/L 200 mL/h to 1830 (700 mL) + NS 100 mL/h 1830-1900 (50 mL) = ${vB[2].fluid} mL. IV med: insulin 3 mL/h to 1830 (${vB[2].insulin} mL) + NS flushes 1830 10 mL per IV (20 mL). Water and sips 250 mL (diet advanced 1615). Voids 1600 200, 1730 200, 1850 150 mL. Dinner arrives 1900 (counted in the night shift).`],
  [T('Mon', '23:00'), '1900-2300', { po: 500, iv: vB[3].fluid, ivmed: 20, urine: 600, emesis: 0 }, `Day 1 night shift, block 1. NS 100 mL/h (${vB[3].fluid} mL). IV med: NS flush 1900 10 mL per IV (20 mL). Dinner 1900 (45 g carbohydrate eaten) with milk and water 500 mL. Voids 1930 250, 2130 350 mL.`],
  [T('Tue', '03:00'), '2300-0300', { po: 200, iv: vB[4].fluid, ivmed: 0, urine: 500, emesis: 0 }, `NS 100 mL/h (${vB[4].fluid} mL). Water 200 mL. Voids 0030 250, 0215 250 mL.`],
  [T('Tue', '07:00'), '0300-0700', { po: 300, iv: vB[5].fluid, ivmed: 0, urine: 500, emesis: 0 }, `NS 100 mL/h to 0700 (${vB[5].fluid} mL); fluids stop at 0700 (eating and drinking). Water 300 mL. Voids 0430 250, 0630 250 mL. Weight 0600: 62.8 kg.`],
  [T('Tue', '11:00'), '0700-1100', { po: 600, iv: 0, ivmed: 10, urine: 600, emesis: 0 }, 'Day 2 day shift, block 1. No IV fluid; left IV removed 0700, right IV saline lock flushed 10 mL. Breakfast 0725 and drinks 600 mL. Voids 0745 250, 0930 200, 1045 150 mL.'],
  [T('Tue', '15:00'), '1100-1500', { po: 750, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'Lunch 1145 (only 15 g carbohydrate eaten) and water 330 mL; juice 120 mL at 1400 for the low (15 g); snack milk 150 mL with crackers at 1415. Voids 1200 250, 1330 200, 1445 150 mL.'],
  [T('Tue', '19:00'), '1500-1900', { po: 550, iv: 0, ivmed: 0, urine: 500, emesis: 0 }, 'Water and drinks 550 mL. Voids 1600 200, 1730 150, 1840 150 mL.'],
  [T('Tue', '23:00'), '1900-2300', { po: 500, iv: 0, ivmed: 10, urine: 400, emesis: 0 }, 'Day 2 night shift, block 1. Saline lock flush 1900 10 mL. Dinner 1900 (45 g eaten), milk and water 500 mL. Voids 1930 200, 2200 200 mL.'],
  [T('Wed', '03:00'), '2300-0300', { po: 200, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 200 mL. Voids 0030 150, 0200 150 mL (0200 safety glucose 140).'],
  [T('Wed', '07:00'), '0300-0700', { po: 200, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 200 mL. Voids 0430 150, 0630 150 mL. Weight 0600: 63.3 kg.'],
  [T('Wed', '11:00'), '0700-1100', { po: 650, iv: 0, ivmed: 10, urine: 600, emesis: 0 }, 'Day 3 day shift, block 1. Saline lock flush 0700 10 mL. Breakfast 0750 (45 g) and drinks 650 mL. Voids 0800 250, 0930 200, 1045 150 mL.'],
  [T('Wed', '15:00'), '1100-1500', { po: 800, iv: 0, ivmed: 0, urine: 650, emesis: 0 }, 'Lunch 1220 (60 g carbohydrate eaten) and drinks 800 mL. Voids 1200 250, 1330 200, 1445 200 mL.'],
  [T('Wed', '19:00'), '1500-1900', { po: 550, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'Water and drinks 550 mL. Voids 1600 200, 1730 200, 1840 200 mL.'],
  [T('Wed', '23:00'), '1900-2300', { po: 500, iv: 0, ivmed: 10, urine: 450, emesis: 0 }, 'Day 3 night shift, block 1. Saline lock flush 1900 10 mL (last scheduled flush). Dinner 1920 (45 g) and drinks 500 mL. Voids 2000 250, 2200 200 mL.'],
  [T('Thu', '03:00'), '2300-0300', { po: 200, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 200 mL. Voids 0030 150, 0200 150 mL.'],
  [T('Thu', '07:00'), '0300-0700', { po: 200, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'Water 200 mL. Voids 0430 150, 0630 150 mL. Weight 0600: 63.4 kg.']
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, POC, BLOCKS, ag, corrNa, effOsm, calcOsm, egfr, hh, F };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), p.AGdesign === ag(p) ? 'ok' : `MISMATCH design ${p.AGdesign}`, 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), 'eGFR', egfr(p.Cr), p.pH ? `HH pH ${hh(p).toFixed(2)} (charted ${p.pH}) Winter ${(1.5 * p.CO2 + 8).toFixed(1)}+-2 ${p.art ? 'ARTERIAL vs pCO2 ' : 'venous pCO2 '}${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev) { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && hOfStamp(t) < 8) console.log(t.slice(5), v, 'fall/h', ((prev[1] - v) / dh).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to);
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED', '2026-11-09 00:00', T('Mon', '07:00')], ['D1 day', T('Mon', '07:00'), T('Mon', '19:00')], ['D1 night', T('Mon', '19:00'), T('Tue', '07:00')], ['D2 day', T('Tue', '07:00'), T('Tue', '19:00')], ['D2 night', T('Tue', '19:00'), T('Wed', '07:00')],
   ['D3 day', T('Wed', '07:00'), T('Wed', '19:00')], ['D3 night', T('Wed', '19:00'), T('Thu', '07:00')], ['Simulation', T('Mon', '07:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n.padEnd(11), 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
}

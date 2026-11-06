/* DKA patient 7 (Priya Desai): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Mon 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html rows for MRN SIM-40507) and the students chart them. Fetal tracing findings for the ED sets are attached as flowsheet comments on the heart-rate values. */
const { at, slug, hOfStamp, H } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
const F = c => Math.round((c * 9 / 5 + 32) * 10) / 10;
// [datetime, temp C, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source, fetal comment]
const SETS = [
  [T('Mon', '01:30'), 37.1, 118, 104, 62, 26, 99, RA, 3, 'OB triage / ED arrival (deep Kussmaul respirations, left lateral tilt with a 30-degree wedge)', 'Cardiac monitor', 'Fetal heart rate tracing at 0135 (external monitor): baseline 165 bpm, minimal variability (under 5 bpm), no accelerations, recurrent late decelerations (nadir 140 bpm, about 40 seconds) after mild contractions every 3-4 minutes. NICHD Category II.'],
  [T('Mon', '02:50'), 37.0, 110, 108, 66, 24, 99, RA, 3, 'OB triage / ED, 1,000 mL bolus finishing, insulin infusion running', 'Cardiac monitor', 'Fetal heart rate tracing at 0250: baseline 160 bpm, minimal variability, intermittent late decelerations with contractions every 4-5 minutes. Category II.'],
  [T('Mon', '05:30'), 36.9, 102, 112, 68, 22, 99, RA, 2, 'OB triage / ED, nausea improved', 'Cardiac monitor', 'Fetal heart rate tracing at 0530: baseline 155 bpm, minimal-to-moderate variability, fewer late decelerations (only with the stronger contractions every 5 minutes). Category II.'],
  [T('Mon', '07:00'), 36.8, 98, 110, 68, 20, 99, RA, 1, 'High-risk antepartum unit arrival (left lateral tilt, fetal monitor and telemetry connected)', 'Cardiac monitor', 'Fetal heart rate tracing at 0700: baseline 155 bpm, minimal-to-moderate variability (5-6 bpm), no accelerations, intermittent late decelerations (nadir 138 bpm) with mild contractions every 4-5 minutes lasting 40 seconds. Category II.']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tc, hr, sb, db, rr, sp, o2, pain, where, hsrc, fetal]) => {
    const tf = F(tc);
    const mk = (code, label, value, units, flag, comment) => { const o = { id: `vital_${code.toLowerCase()}_${t.replace(/[- :]/g, '_')}`, type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t }; if (comment) o.comment = comment; out.push(o); };
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 55 ? 'Low' : '', fetal); mk('HRSRC', 'HR Source', hsrc); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 140 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Left arm (left lateral position)'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 20 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2); mk('PAIN', 'Pain', `${pain}/10`);
  });
  return out;
}

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
// Panels: t = collected, r = released. Serum total CO2 (BMP) = the bicarbonate in every anion gap and every Henderson-Hasselbalch pH.
// Gases are VENOUS draws; pH and pCO2 are reported as arterial-equivalent values (pregnancy reference pH 7.40-7.45, pCO2 27-32). The pH is COMPUTED from bicarbonate and pCO2 (see hh()).
const R = (d, t) => T(d, t);
const PANELS = [
  { k: 'ED', t: R('Mon', '01:45'), r: R('Mon', '02:10'), Na: 134, K: 4.1, Cl: 98, CO2: 10, BUN: 16, Cr: 0.78, Glu: 242, AGdesign: 26, pCO2: 24, BHB: 5.4, Phos: 3.8, Mg: 1.9 },
  { k: 'P1', t: R('Mon', '04:00'), r: R('Mon', '04:15'), Na: 135, K: 3.6, Cl: 101, CO2: 12, BUN: 14, Cr: 0.70, Glu: 178, AGdesign: 22, pCO2: 25, BHB: 4.1, Phos: 3.1, Mg: 1.8 },
  { k: 'P2', t: R('Mon', '06:55'), r: R('Mon', '07:05'), Na: 136, K: 3.2, Cl: 104, CO2: 14, BUN: 12, Cr: 0.64, Glu: 152, AGdesign: 18, pCO2: 27, BHB: 2.8, Phos: 2.4, Mg: 1.5 },
  { k: 'P3', t: R('Mon', '09:15'), r: R('Mon', '09:30'), Na: 136, K: 3.6, Cl: 104, CO2: 14, BUN: 11, Cr: 0.62, Glu: 186, AGdesign: 18, pCO2: 27, BHB: 2.6, Phos: 2.3, Mg: 1.7 },
  { k: 'P4', t: R('Mon', '11:00'), r: R('Mon', '11:15'), Na: 136, K: 3.8, Cl: 105, CO2: 15, BUN: 10, Cr: 0.58, Glu: 148, AGdesign: 16, pCO2: 28, BHB: 1.9, Phos: 2.4, Mg: 2.0 },
  { k: 'P5', t: R('Mon', '15:00'), r: R('Mon', '15:15'), Na: 137, K: 3.9, Cl: 106, CO2: 17, BUN: 9, Cr: 0.56, Glu: 138, AGdesign: 14, pCO2: 29, BHB: 1.1, Phos: 2.7, Mg: 2.0 },
  { k: 'P6', t: R('Mon', '18:50'), r: R('Mon', '19:05'), Na: 137, K: 4.1, Cl: 106, CO2: 19, BUN: 8, Cr: 0.55, Glu: 132, AGdesign: 12, pCO2: 30, BHB: 0.5, Phos: 2.9, Mg: 2.0 },
  { k: 'P7', t: R('Tue', '01:00'), r: R('Tue', '01:15'), Na: 137, K: 4.0, Cl: 105, CO2: 20, BUN: 8, Cr: 0.54, Glu: 118, AGdesign: 12, pCO2: 31, BHB: 0.3, Phos: 3.1, Mg: 1.9 },
  { k: 'P8', t: R('Tue', '06:55'), r: R('Tue', '07:10'), Na: 136, K: 4.1, Cl: 105, CO2: 20, BUN: 7, Cr: 0.53, Glu: 62, AGdesign: 11, BHB: 0.2, Phos: 3.2, Mg: 1.9 },
  { k: 'P9', t: R('Tue', '18:30'), r: R('Tue', '19:00'), Na: 136, K: 4.2, Cl: 104, CO2: 21, BUN: 7, Cr: 0.52, Glu: 124, AGdesign: 11, BHB: 0.2, Phos: 3.4, Mg: 2.0 },
  { k: 'P10', t: R('Wed', '06:45'), r: R('Wed', '07:00'), Na: 136, K: 4.1, Cl: 104, CO2: 21, BUN: 8, Cr: 0.52, Glu: 92, AGdesign: 11, BHB: 0.1, Phos: 3.5, Mg: 2.0 },
  { k: 'P11', t: R('Thu', '06:45'), r: R('Thu', '07:00'), Na: 136, K: 4.2, Cl: 104, CO2: 21, BUN: 8, Cr: 0.52, Glu: 88, AGdesign: 11, BHB: 0.1, Phos: 3.6, Mg: 2.0 }
];
// pH by Henderson-Hasselbalch with the bicarbonate and pCO2, to 2 decimals (the source's pH values did not match its own HCO3 and pCO2)
const hhRaw = p => 6.1 + Math.log10(p.CO2 / (0.03 * p.pCO2));
PANELS.forEach(p => { if (p.pCO2) p.pH = Math.round(hhRaw(p) * 100) / 100; });
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 100) / 100;
const effOsm = p => Math.round((2 * p.Na + p.Glu / 18) * 10) / 10;
const calcOsm = p => Math.round((2 * p.Na + p.Glu / 18 + p.BUN / 2.8) * 10) / 10;
const hh = hhRaw;
const winters = p => 1.5 * p.CO2 + 8;
// pregnancy-adjusted expectation: baseline pCO2 30 at HCO3 20, falling 1.2 mmHg per 1 mmol/L fall in bicarbonate
const pregExp = p => 30 - 1.2 * (20 - p.CO2);

const POC = [
  ['Mon', '01:45', 242], ['Mon', '02:00', 236], ['Mon', '03:00', 192], ['Mon', '04:00', 178], ['Mon', '05:00', 168], ['Mon', '06:00', 159], ['Mon', '07:00', 152],
  ['Mon', '08:00', 166], ['Mon', '09:00', 182], ['Mon', '09:30', 188], ['Mon', '10:00', 172], ['Mon', '11:00', 148], ['Mon', '12:00', 142], ['Mon', '13:00', 139], ['Mon', '14:00', 140],
  ['Mon', '15:00', 138], ['Mon', '16:00', 135], ['Mon', '17:00', 136], ['Mon', '18:00', 134], ['Mon', '19:00', 132], ['Mon', '20:00', 128], ['Mon', '21:00', 134], ['Mon', '21:30', 129], ['Mon', '22:00', 124],
  ['Tue', '02:00', 96], ['Tue', '07:00', 62], ['Tue', '07:20', 84], ['Tue', '08:30', 128], ['Tue', '12:00', 94], ['Tue', '13:30', 132], ['Tue', '17:30', 98], ['Tue', '19:00', 124], ['Tue', '22:00', 112],
  ['Wed', '03:00', 91], ['Wed', '07:00', 92], ['Wed', '08:30', 134], ['Wed', '12:00', 89], ['Wed', '13:30', 129], ['Wed', '17:30', 93], ['Wed', '19:00', 131], ['Wed', '22:00', 108],
  ['Thu', '07:00', 88]
].map(([d, t, v]) => [T(d, t), v]);

// ECG lines (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology (gen/ecg/make_ecgs.py has the same text). [acquired, available, text]
const ECG_LINES = [
  [T('Mon', '01:45'), T('Mon', '01:55'), 'Sinus tachycardia 118 bpm, PR 142 ms, QRS 82 ms, QTc 432 ms (Bazett). Normal upright T waves, no U waves, no ST depression (rate-related tachycardia from dehydration and ketoacidosis).'],
  [T('Mon', '07:10'), T('Mon', '07:20'), 'Sinus rhythm 98 bpm, PR 164 ms, QRS 88 ms, QTc 478 ms (Bazett; T-U fusion). Diffusely flattened T waves (I, II, aVL, V3-V6), 0.5 mm ST depression V4-V6 and prominent U waves (1.5 mm V2-V4). Hypokalemia pattern (potassium 3.2, magnesium 1.5); no ectopy.'],
  [T('Mon', '09:35'), T('Mon', '09:45'), 'Sinus rhythm 90 bpm, PR 156 ms, QRS 86 ms, QTc 452 ms (Bazett). T waves improving (low but upright in V3-V6), ST segments isoelectric, U waves smaller (0.5 mm). Potassium 3.6 after 20 mEq replacement.'],
  [T('Mon', '19:15'), T('Mon', '19:25'), 'Normal sinus rhythm 84 bpm, PR 148 ms, QRS 82 ms, QTc 424 ms (Bazett). Normal upright T waves in all leads, no U waves, normal ST segments. Hypokalemic changes resolved (potassium 4.1).']
];
function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const entries = key => has(key).map(p => [p.t, p[key], p.r]);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, entries(key), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '130-140 (third trimester)', 130, 140, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.3-5.0 (third trimester); goal 4.0 or higher on insulin', 3.3, 5.0, 1, { crit: [3.3, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '97-109', 97, 109, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '18-22 (third trimester)', 18, 22, 0, { crit: [8] });
  pn('BUN', 'BUN', 'mg/dL', '3-11 (third trimester)', 3, 11, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.40-0.80 (pregnancy; baseline 0.55)', 0.4, 0.8, 2);
  pn('Glucose (serum)', 'Glu', 'mg/dL', 'fasting under 95 (pregnancy target)', 70, 94, 0, { crit: [50, 500] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.6-2.2', 1.6, 2.2, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '6-12 (Na - Cl - CO2, no potassium)', 6, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, entries('BHB'), { dec: 1, crit: [undefined, 3.0] }));
  const gv = has('pH');
  const gas = (label, units, ref, lo, hi, key, dec, o) => add(lab('Blood Gas', label, units, ref, lo, hi, gv.map(p => [p.t, p[key], p.r]), Object.assign({ dec, specimen: 'Venous blood (reported as arterial-equivalent)' }, o || {})));
  gas('pH, blood gas', '', '7.40-7.45 (pregnancy, arterial-equivalent)', 7.40, 7.45, 'pH', 2, { crit: [7.25] });
  gas('pCO2, blood gas', 'mmHg', '27-32 (pregnancy, arterial-equivalent)', 27, 32, 'pCO2', 0);
  const ED = T('Mon', '01:45'), EDR = T('Mon', '02:10');
  add(lab('Chemistry', 'Lactate', 'mmol/L', 'Under 2.0', null, 1.9, [[ED, 1.8, EDR]], { dec: 1 }));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Goal under 6.0-6.5 in pregnancy', null, 6.0, [[ED, 6.2, EDR]], { dec: 1 }));
  const CB = [[ED, EDR], [T('Tue', '06:55'), T('Tue', '07:10')], [T('Wed', '06:45'), T('Wed', '07:00')], [T('Thu', '06:45'), T('Thu', '07:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'x10^3/uL', '5.6-16.9 (third trimester; mild leukocytosis is normal in pregnancy)', 5.6, 16.9, [14.8, 11.2, 9.8, 9.2], 1);
  cb('Hemoglobin', 'g/dL', '10.5-14.0 (third trimester)', 10.5, 14.0, [12.1, 10.9, 10.8, 10.8], 1, { crit: [7.0] });
  cb('Platelets', 'x10^3/uL', '150-400', 150, 400, [245, 228, 224, 226], 0);
  add(lab('Chemistry', 'AST', 'U/L', '10-35', 10, 35, [[ED, 24, EDR]], { dec: 0 })); add(lab('Chemistry', 'ALT', 'U/L', '7-35', 7, 35, [[ED, 19, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Lipase', 'U/L', '10-140', 10, 140, [[ED, 42, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Uric acid', 'mg/dL', '2.0-5.5 (third trimester)', 2.0, 5.5, [[ED, 4.2, EDR]], { dec: 1 }));
  const UT = T('Mon', '01:50'), UR = T('Mon', '02:15');
  const ua = (label, ref, v, abn) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (Foley)', abn: abn ? /\+|Large|Positive|>|Many|1\.030/ : undefined }));
  ua('UA glucose', 'Negative', '3+', true); ua('UA ketones', 'Negative', '4+', true); ua('UA specific gravity', '1.005-1.025', '1.030', true); ua('UA protein', 'Negative', 'Negative', false); ua('UA nitrite', 'Negative', 'Negative', false); ua('UA leukocyte esterase', 'Negative', 'Negative', false);
  ECG_LINES.forEach(([when, avail, v]) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /depression|flatten|tachy|prominent/i })));
  add(lab('Obstetric', 'Fetal fibronectin (rapid, cervicovaginal swab)', '', 'Negative (valid 24-34 weeks, intact membranes, swab before any digital exam)', null, null, [[T('Tue', '18:45'), 'Negative', T('Tue', '19:00')]], { specimen: 'Cervicovaginal swab', abn: /Positive/ }));
  add(lab('Obstetric', 'Cervical length (transvaginal ultrasound)', 'cm', '3.0 or longer is reassuring', 3.0, null, [[T('Tue', '18:50'), 3.8, T('Tue', '19:00')]], { dec: 1, specimen: 'Ultrasound' }));
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', 'pregnancy: fasting under 95, 1 hour after a meal under 140; on the insulin infusion about 110-160', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  add(lab('Bedside Testing', 'Urine ketones (dipstick)', '', 'Negative', null, null, [[T('Wed', '06:50'), 'Negative'], [T('Thu', '06:50'), 'Negative']], { specimen: 'Urine', abn: /\+/ }));
  add(lab('Bedside Testing', 'Blood ketone (point of care meter)', 'mmol/L', 'Under 0.6', null, 0.5, [[T('Wed', '13:30'), 0.1]], { dec: 1, specimen: 'Capillary blood (fingerstick)' }));
  return out;
}

const I = require('./infusions');
const r1 = x => Math.round(x * 10) / 10;
function wholeSplit(exact) { const tgt = Math.round(exact.reduce((s, x) => s + x, 0)); const fl = exact.map(Math.floor); let rem = tgt - fl.reduce((s, x) => s + x, 0); exact.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (rem > 0) { fl[i]++; rem--; } }); return fl; }
// [end, label, shiftId, po, urine, emesis, note text]
const SPEC = [
  [T('Mon', '07:00'), 'ED 0130-0700', 'ED', 0, 720, 150, 'OB triage / ED (before the 12-hour shifts; these totals are NOT added again to shift 1). Nothing by mouth except ice chips (not measured). Emesis 150 mL clear at 0140, before the ondansetron. Foley urometer: 0145 120 mL dark amber, 0300 150, 0400 120, 0500 110, 0600 110, 0700 110 = 720 mL. Priming volume is discarded and not counted.'],
  [T('Mon', '11:00'), '0700-1100', 'S1', 30, 550, 0, 'Day 1 day shift, block 1. Sips with the 0800 medicines 30 mL. Foley hourly: 0800 140 mL, 0900 135, 1000 140, 1100 135 = 550 mL.'],
  [T('Mon', '15:00'), '1100-1500', 'S1', 80, 550, 0, 'Clear liquids (water, broth) 80 mL from 1130. Foley hourly: 1200 140 mL, 1300 135, 1400 140, 1500 135 = 550 mL.'],
  [T('Mon', '19:00'), '1500-1900', 'S1', 130, 550, 0, 'Clear liquids 130 mL. Foley hourly: 1600 140 mL, 1700 135, 1800 140, 1900 135 = 550 mL.'],
  [T('Mon', '23:00'), '1900-2300', 'S2', 360, 320, 0, 'Day 1 night shift, block 1. Light transition dinner tray 1930 (32 g carbohydrate) with fluids 360 mL. Foley emptied at 2200 (320 mL), catheter removed 2200.'],
  [T('Tue', '03:00'), '2300-0300', 'S2', 300, 600, 0, 'Water 300 mL and the bedtime snack. Voids into the commode hat: 2340 300 mL, 0210 300 mL = 600 mL.'],
  [T('Tue', '07:00'), '0300-0700', 'S2', 300, 300, 0, 'Water 300 mL. Void 0520 300 mL = 300 mL. Shift 2 total at the end of this block (overnight voids 900 mL plus the 320 mL Foley).'],
  [T('Tue', '11:00'), '0700-1100', 'S3', 600, 480, 0, 'Day 2 day shift, block 1. Apple juice 120 mL at 0705 for the low glucose plus breakfast and fluids 480 mL. Voids 0800 250 mL, 1000 230 = 480 mL.'],
  [T('Tue', '15:00'), '1100-1500', 'S3', 600, 520, 0, 'Lunch and fluids 600 mL. Voids 1200 260 mL, 1400 260 = 520 mL.'],
  [T('Tue', '19:00'), '1500-1900', 'S3', 720, 550, 0, 'Oral hydration 720 mL (water 500 mL over 1 hour from 1715 for the contractions, afternoon snack, dinner beverage). Voids 1600 280 mL, 1830 270 = 550 mL.'],
  [T('Tue', '23:00'), '1900-2300', 'S4', 480, 380, 0, 'Day 2 night shift, block 1. Dinner beverages, bedtime snack 2130 and fluids 480 mL. Voids 2000 190 mL, 2230 190 = 380 mL.'],
  [T('Wed', '03:00'), '2300-0300', 'S4', 300, 300, 0, 'Water 300 mL. Voids 0030 150 mL, 0230 150 = 300 mL.'],
  [T('Wed', '07:00'), '0300-0700', 'S4', 300, 300, 0, 'Water 300 mL. Voids 0450 150 mL, 0640 150 = 300 mL.'],
  [T('Wed', '11:00'), '0700-1100', 'S5', 600, 500, 0, 'Day 3 day shift, block 1. Breakfast and fluids 600 mL. Voids 0800 250 mL, 1000 250 = 500 mL.'],
  [T('Wed', '15:00'), '1100-1500', 'S5', 600, 550, 0, 'Lunch and fluids 600 mL. Voids 1200 280 mL, 1400 270 = 550 mL.'],
  [T('Wed', '19:00'), '1500-1900', 'S5', 600, 550, 0, 'Afternoon snack, dinner and fluids 600 mL. Voids 1600 280 mL, 1800 270 = 550 mL.'],
  [T('Wed', '23:00'), '1900-2300', 'S6', 360, 300, 0, 'Day 3 night shift, block 1. Evening fluids and the bedtime snack 360 mL. Voids 2000 150 mL, 2230 150 = 300 mL.'],
  [T('Thu', '03:00'), '2300-0300', 'S6', 300, 300, 0, 'Water 300 mL. Voids 0030 150 mL, 0230 150 = 300 mL.'],
  [T('Thu', '07:00'), '0300-0700', 'S6', 300, 300, 0, 'Water 300 mL. Voids 0500 150 mL, 0640 150 = 300 mL. Shift 6 total at the end of this block.']
];
let prevEnd = I.M('Mon', '01:30');
const blocks0 = SPEC.map(s => { const endM = Math.round(hOfStamp(s[0]) * 60), v = I.vol(prevEnd, endM); const a = prevEnd; prevEnd = endM; return { s, a, b: endM, v }; });
['iv', 'ivmed'].forEach(key => { const byShift = {}; blocks0.forEach((b, i) => { (byShift[b.s[2]] = byShift[b.s[2]] || []).push(i); }); Object.values(byShift).forEach(idx => { const ex = idx.map(i => key === 'iv' ? blocks0[i].v.fluid : blocks0[i].v.ivmed); wholeSplit(ex).forEach((w, j) => { blocks0[idx[j]][key] = w; }); }); });
const fluidParts = (a, b) => I.FLUIDS.map(f => { const lo = Math.max(a, f[0]), hi = Math.min(b, f[1]); return hi > lo ? [f[4], (hi - lo) * f[2] / 60] : null; }).filter(Boolean);
function ivNote(bk) {
  const fp = fluidParts(bk.a, bk.b).map(([n, ml]) => `${n} ${r1(ml)} mL`), v = bk.v;
  const iv = fp.length ? `IV fluid: ${fp.join(' + ')} = ${r1(v.fluid)} mL (charted ${bk.iv}).` : 'No IV fluid.';
  const med = []; if (v.insulin) med.push(`regular insulin ${r1(v.insulin)} mL`); if (v.kcl) med.push(`KCl 10 mEq/100 mL riders ${r1(v.kcl)} mL`); if (v.mg) med.push(`magnesium sulfate 2 g/100 mL ${r1(v.mg)} mL`); if (v.ond) med.push('ondansetron 2 mL'); if (v.flush) med.push(`saline flushes ${v.flush} mL`);
  return `${iv} ${med.length ? 'IV med: ' + med.join(' + ') + ` = ${r1(v.ivmed)} mL (charted ${bk.ivmed}).` : 'No IV medicine volume.'}`;
}
const BLOCKS = blocks0.map(bk => [bk.s[0], bk.s[1], bk.s[2], { po: bk.s[3], iv: bk.iv, ivmed: bk.ivmed, urine: bk.s[4], emesis: bk.s[5] }, ivNote(bk) + ' ' + bk.s[6]]);
function buildIO() {
  return BLOCKS.map(([t2, time, , d, note]) => {
    const intake = d.po + d.iv + d.ivmed, output = d.urine + d.emesis;
    const detail = { po: d.po, iv: d.iv, urine: d.urine };
    if (d.ivmed) { detail.intakeOther = d.ivmed; detail.intakeOtherLabel = 'IV med'; }
    detail.other = d.emesis; detail.otherLabel = d.emesis ? 'Emesis' : '';
    return { id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time, collected: t2, periodEnd: true, intake, output, detail, note };
  });
}
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, POC, BLOCKS, ag, corrNa, effOsm, calcOsm, hh, winters, pregExp, F, ECG_LINES };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), p.AGdesign === ag(p) ? 'ok' : `MISMATCH design ${p.AGdesign}`, 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), p.pH ? `HH ${hh(p).toFixed(3)} pH ${p.pH} Winter ${winters(p).toFixed(1)}+-2 pregExp ${pregExp(p).toFixed(1)} vs pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev) { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && dh <= 1.1) console.log(t.slice(5), v, 'change/h', (v - prev[1]).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0; io.forEach(b => { ti += b.intake; to += b.output; });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to, '(ED + simulation)');
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED', '2026-12-28 00:00', T('Mon', '07:00')], ['D1 day', T('Mon', '07:00'), T('Mon', '19:00')], ['D1 night', T('Mon', '19:00'), T('Tue', '07:00')], ['D2 day', T('Tue', '07:00'), T('Tue', '19:00')], ['D2 night', T('Tue', '19:00'), T('Wed', '07:00')],
   ['D3 day', T('Wed', '07:00'), T('Wed', '19:00')], ['D3 night', T('Wed', '19:00'), T('Thu', '07:00')], ['Simulation', T('Mon', '07:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n.padEnd(11), 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
  BLOCKS.forEach(b => console.log(b[0], b[1], JSON.stringify(b[3])));
}

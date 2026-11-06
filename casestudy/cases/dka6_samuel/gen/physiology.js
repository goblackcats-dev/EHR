/* DKA patient 6 (Samuel Okafor): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated), point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). Vital signs after Mon 0700 are NOT in the chart: the instructor sets them on the bedside monitor
   (monitor.html, built-in rows for MRN SIM-40506) and the students chart them. */
const { at, slug, hOfStamp, H } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
const F = c => Math.round((c * 9 / 5 + 32) * 10) / 10;   // Celsius to Fahrenheit (design lists Celsius)
// [datetime, temp C, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10, location text, HR source]
const SETS = [
  [T('Mon', '01:30'), 36.8, 114, 148, 92, 26, 97, RA, 4, 'ED arrival (Kussmaul respirations, clutching his upper abdomen)', 'Cardiac monitor'],
  [T('Mon', '02:30'), 36.9, 108, 142, 88, 24, 98, RA, 3, 'ED, insulin infusion running at 8 units/h, nausea improving', 'Cardiac monitor'],
  [T('Mon', '04:00'), 36.8, 102, 136, 84, 22, 98, RA, 2, 'ED, 1.0 mm ST depression V4-V6 on the monitor', 'Cardiac monitor'],
  [T('Mon', '05:30'), 36.7, 98, 132, 80, 20, 99, RA, 2, 'ED, heparin and potassium-containing fluid running', 'Cardiac monitor'],
  // ---- simulation starts Mon 07:00 (arrival to the step-down unit). Later vitals are set on the instructor's monitor and charted by the students.
  [T('Mon', '07:00'), 36.8, 96, 134, 82, 20, 98, RA, 1, 'Step-down arrival (frequent PVCs, 6-8 per minute, on the monitor)', 'Cardiac monitor']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tc, hr, sb, db, rr, sp, o2, pain, where, hsrc]) => {
    const tf = F(tc);
    const mk = (code, label, value, units, flag) => out.push({ id: `vital_${code.toLowerCase()}_${t.replace(/[- :]/g, '_')}`, type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
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
// Chemistry panels from the design (Section 3). t = collected, r = chemistry/gas/BHB release, rT = troponin release, rX = anti-Xa release.
// Serum total CO2 (BMP) is the HCO3 used for every anion gap. Every gas is a VENOUS blood gas (design).
// The design's pCO2 values are arterial-equivalent (Winter's formula is applied to them for the teaching trail; see DESIGN.md).
const R = (d, t) => T(d, t);
const PANELS = [
  { k: 'ED', t: R('Mon', '01:40'), r: R('Mon', '02:10'), rT: R('Mon', '02:10'), Na: 131, K: 5.2, Cl: 95, CO2: 12, BUN: 28, Cr: 1.35, Glu: 540, AGdesign: 24, pH: 7.21, pCO2: 27, BHB: 5.8, Tn: 185, Phos: 4.2, Mg: 2.1 },
  { k: 'P1', t: R('Mon', '04:30'), r: R('Mon', '04:50'), rT: R('Mon', '04:55'), Na: 134, K: 4.3, Cl: 98, CO2: 14, BUN: 25, Cr: 1.25, Glu: 380, AGdesign: 22, pH: 7.25, pCO2: 30, BHB: 4.2, Tn: 640, Phos: 3.4, Mg: 1.9 },
  { k: 'P2', t: R('Mon', '06:55'), r: R('Mon', '07:10'), Na: 136, K: 3.3, Cl: 103, CO2: 16, BUN: 21, Cr: 1.15, Glu: 235, AGdesign: 17, pH: 7.29, pCO2: 33, BHB: 2.6, Phos: 2.6, Mg: 1.8 },
  { k: 'P3', t: R('Mon', '11:15'), r: R('Mon', '11:30'), rT: R('Mon', '11:40'), rX: R('Mon', '11:40'), Na: 137, K: 4.1, Cl: 104, CO2: 17, BUN: 19, Cr: 1.10, Glu: 242, AGdesign: 16, pH: 7.31, pCO2: 35, BHB: 1.9, Tn: 1420, Xa: 0.48, Phos: 2.5, Mg: 2.0 },
  { k: 'P4', t: R('Mon', '15:30'), r: R('Mon', '15:45'), Na: 138, K: 4.0, Cl: 104, CO2: 19, BUN: 17, Cr: 1.02, Glu: 195, AGdesign: 15, pH: 7.34, pCO2: 37, BHB: 1.1, Phos: 2.7, Mg: 2.0 },
  { k: 'P5', t: R('Mon', '18:50'), r: R('Mon', '19:05'), rT: R('Mon', '19:15'), rX: R('Mon', '19:15'), Na: 139, K: 4.2, Cl: 105, CO2: 22, BUN: 15, Cr: 0.95, Glu: 165, AGdesign: 12, pH: 7.38, pCO2: 40, BHB: 0.4, Tn: 1280, Xa: 0.52, Phos: 3.0, Mg: 2.1 },
  { k: 'P6', t: R('Tue', '06:45'), r: R('Tue', '07:00'), rT: R('Tue', '07:15'), rX: R('Tue', '07:15'), Na: 139, K: 4.3, Cl: 104, CO2: 24, BUN: 14, Cr: 0.92, Glu: 142, AGdesign: 11, BHB: 0.2, Tn: 890, Xa: 0.54, Phos: 3.3, Mg: 2.1 },
  { k: 'P7', t: R('Tue', '18:45'), r: R('Tue', '19:00'), rT: R('Tue', '19:15'), Na: 140, K: 4.2, Cl: 105, CO2: 25, BUN: 13, Cr: 0.90, Glu: 158, AGdesign: 10, Tn: 520, Mg: 2.0 },
  { k: 'P8', t: R('Wed', '06:45'), r: R('Wed', '07:00'), rT: R('Wed', '07:15'), Na: 139, K: 4.4, Cl: 104, CO2: 25, BUN: 14, Cr: 0.94, Glu: 128, AGdesign: 10, Tn: 310, Phos: 3.5, Mg: 2.1 },
  { k: 'P9', t: R('Thu', '06:45'), r: R('Thu', '07:00'), rT: R('Thu', '07:00'), Na: 140, K: 4.3, Cl: 104, CO2: 26, BUN: 13, Cr: 0.91, Glu: 118, AGdesign: 10, Tn: 140, Phos: 3.6, Mg: 2.1 }
];
// anti-Xa only (design: D2 0100)
const XAONLY = [{ t: R('Tue', '01:00'), r: R('Tue', '01:20'), Xa: 0.55 }];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 100) / 100;   // factor 1.6 per 100 mg/dL over 100
const effOsm = p => Math.round((2 * p.Na + p.Glu / 18) * 10) / 10;
const calcOsm = p => Math.round((2 * p.Na + p.Glu / 18 + p.BUN / 2.8) * 10) / 10;
const hh = p => 6.1 + Math.log10(p.CO2 / (0.03 * p.pCO2));   // Henderson-Hasselbalch with serum total CO2
const winters = p => 1.5 * p.CO2 + 8;                          // expected pCO2 +/- 2

// point-of-care glucose (meter docks to the chart): the design's hourly log, then AC/HS (design Section 3). Values marked (added) are not in the design.
const POC = [
  ['Mon', '01:30', 'HIGH (over 500)'], ['Mon', '02:00', 505], ['Mon', '03:00', 450], ['Mon', '04:00', 395], ['Mon', '05:00', 340], ['Mon', '06:00', 285], ['Mon', '07:00', 235],
  ['Mon', '08:00', 240], ['Mon', '09:00', 245], ['Mon', '10:00', 248], ['Mon', '11:00', 244], ['Mon', '11:30', 242], ['Mon', '12:00', 230], ['Mon', '13:00', 218], ['Mon', '14:00', 208],
  ['Mon', '15:00', 198], ['Mon', '16:00', 188], ['Mon', '17:00', 178], ['Mon', '18:00', 170], ['Mon', '19:00', 165], ['Mon', '20:00', 172], ['Mon', '21:00', 162], ['Mon', '21:30', 156],
  ['Tue', '03:00', 146], /* (added) night check */ ['Tue', '07:30', 142], ['Tue', '10:30', 136], ['Tue', '13:00', 148], ['Tue', '17:30', 164], ['Tue', '21:00', 152],
  ['Wed', '07:30', 128], ['Wed', '12:00', 144], ['Wed', '13:45', 152], ['Wed', '17:30', 156], ['Wed', '21:00', 138],
  ['Thu', '07:30', 118]
].map(([d, t, v]) => [T(d, t), v]);

// ECG interpretations (filed under Cardiac); the full ECG with its picture is in Chart Review > Cardiology (gen/ecg/make_ecgs.py has the same text)
// [acquired, result available, text]
const ECG_LINES = [
  [T('Mon', '01:40'), T('Mon', '01:50'), 'Sinus tachycardia 114 bpm, PR 148 ms, QRS 88 ms, QTc 432 ms (Bazett), axis +35. Horizontal ST depression 1.5 mm in V4-V6 (0.5 mm in I and aVL, 0.5 mm downsloping in V3) with symmetric T-wave inversion in V5-V6; no ST elevation (0.5 mm reciprocal change in aVR). Lateral subendocardial ischemia (first obtuse marginal territory); no pathological Q waves.'],
  [T('Mon', '07:15'), T('Mon', '07:25'), 'Sinus rhythm 96 bpm with frequent unifocal ventricular premature beats (left ventricular origin, right bundle branch block pattern, QRS 136 ms; about 7 per minute with couplets and trigeminal runs) falling near the end of the T-U wave. PR 164 ms, QRS 92 ms, QTc 492 ms (T-U fusion). Diffuse T-wave flattening with prominent U waves (over 1.5 mm in V2-V3, taller than the T wave); persistent 1.0 mm horizontal ST depression V4-V6. Hypokalemia pattern on top of lateral ischemia (potassium 3.3).'],
  [T('Mon', '14:05'), T('Mon', '14:15'), 'Sinus rhythm 94 bpm, PR 156 ms, QRS 90 ms, QTc 438 ms (Bazett). Horizontal ST depression 1.5 mm in V4-V6 (deeper than 1.0 mm at 0715), T-wave inversion V5-V6; no ventricular ectopy and no U waves (potassium 4.1 at 1115). Recurrent lateral ischemia with chest pressure.'],
  [T('Tue', '13:00'), T('Tue', '13:10'), 'Sinus rhythm 68 bpm, PR 160 ms, QRS 86 ms, QTc 418 ms (Bazett), axis +32. Complete resolution of the lateral ST depression in V4-V6 (isoelectric ST, upright T in V4-V5, trace flattening in V6); U waves gone; no premature beats. Compatible with reperfusion of the first obtuse marginal after stenting.']
];

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const rel = (p, key) => (key === 'Tn' ? (p.rT || p.r) : key === 'Xa' ? (p.rX || p.r) : p.r);
  const entries = key => has(key).map(p => [p.t, p[key], rel(p, key)]);
  const pn = (label, key, units, ref, lo, hi, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, entries(key), Object.assign({ dec }, o || {})));
  pn('Sodium', 'Na', 'mmol/L', '135-145', 135, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.0 (goal 4.0-5.0 with acute coronary syndrome)', 3.5, 5.0, 1, { crit: [3.4, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-106', 98, 106, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 2);
  pn('Glucose (serum)', 'Glu', 'mg/dL', 'fasting 70-99 (acute illness targets differ)', 70, 99, 0, { crit: [50, 500] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.7-2.2', 1.7, 2.2, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2, no potassium)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, entries('BHB'), { dec: 1, crit: [undefined, 3.0] }));
  add(lab('Cardiac', 'hs-Troponin I', 'ng/L', 'Under 14', null, 14, entries('Tn'), { dec: 0 }));
  add(lab('Coagulation', 'Heparin anti-Xa', 'IU/mL', 'Therapeutic on unfractionated heparin 0.30-0.70', 0.30, 0.70, has('Xa').map(p => [p.t, p.Xa, rel(p, 'Xa')]).concat(XAONLY.map(x => [x.t, x.Xa, x.r])).sort((a, b) => a[0].localeCompare(b[0])), { dec: 2 }));
  const gv = has('pH');
  const gas = (label, units, ref, lo, hi, key, dec, set, specimen, o) => add(lab('Blood Gas', label, units, ref, lo, hi, set.map(p => [p.t, p[key], p.r]), Object.assign({ dec, specimen }, o || {})));
  gas('pH, blood gas', '', 'venous 7.31-7.41', 7.31, 7.41, 'pH', 2, gv, 'Venous blood', { crit: [7.25] });
  gas('pCO2, blood gas', 'mmHg', '35-45 (reported as arterial-equivalent); venous 41-51', 35, 45, 'pCO2', 0, gv, 'Venous blood (pCO2 reported as arterial-equivalent)');
  // first-draw extras (ED 0140, result 0210): HbA1c, CBC, hepatic panel, lipid panel
  const ED = T('Mon', '01:40'), EDR = T('Mon', '02:10');
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 without diabetes (individualized goal with diabetes)', null, 5.6, [[ED, 8.9, EDR]], { dec: 1 }));
  const CB = [[ED, EDR], [T('Tue', '06:45'), T('Tue', '07:00')], [T('Wed', '06:45'), T('Wed', '07:00')], [T('Thu', '06:45'), T('Thu', '07:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'x10^3/uL', '4.0-11.0', 4, 11, [13.8, 9.9, 8.7, 8.2], 1); cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [15.6, 14.4, 14.1, 14.0], 1, { crit: [7.0] }); cb('Platelets', 'x10^3/uL', '150-400', 150, 400, [265, 252, 246, 244], 0);
  add(lab('Chemistry', 'AST', 'U/L', '10-40', 10, 40, [[ED, 28, EDR]], { dec: 0 })); add(lab('Chemistry', 'ALT', 'U/L', '7-56', 7, 56, [[ED, 34, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'Alkaline phosphatase', 'U/L', '40-130', 40, 130, [[ED, 82, EDR]], { dec: 0 })); add(lab('Chemistry', 'Bilirubin, total', 'mg/dL', '0.2-1.2', 0.2, 1.2, [[ED, 0.7, EDR]], { dec: 1 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[ED, 4.3, EDR]], { dec: 1 }));
  add(lab('Lipids', 'Total cholesterol', 'mg/dL', 'Under 200', null, 199, [[ED, 248, EDR]], { dec: 0 })); add(lab('Lipids', 'LDL cholesterol', 'mg/dL', 'Under 100 (goal under 70 after a coronary event)', null, 99, [[ED, 162, EDR]], { dec: 0 }));
  add(lab('Lipids', 'HDL cholesterol', 'mg/dL', 'Over 40', 40, null, [[ED, 34, EDR]], { dec: 0 })); add(lab('Lipids', 'Triglycerides', 'mg/dL', 'Under 150', null, 149, [[ED, 260, EDR]], { dec: 0 }));
  // urinalysis (voided 0200, result 0220)
  const UT = T('Mon', '02:00'), UR = T('Mon', '02:20');
  const ua = (label, ref, v, abn) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch)', abn: abn ? /\+|Large|Positive|>|Many/ : undefined }));
  ua('UA glucose', 'Negative', '4+ (1,000 mg/dL or more)', true); ua('UA ketones', 'Negative', '3+', true); ua('UA nitrite', 'Negative', 'Negative', false); ua('UA leukocyte esterase', 'Negative', 'Negative', false);
  ECG_LINES.forEach(([when, avail, v]) => add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[when, v, avail]], { specimen: 'ECG', abn: /depression|flatten|tachy|prominent|premature/i })));
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal about 150-200 on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500], abn: /HIGH/ }));
  return out;
}

// Intake and output in 4-hour blocks (each 12-hour shift = three blocks that add up to the shift total); each block shows when it ends (collected) with periodEnd: true.
// iv = IV fluid; ivmed = insulin carrier + heparin + KCl riders + ondansetron + cath-lab IV medicines and contrast + saline flushes (all IV med). Volumes from gen/infusions.js.
const I = require('./infusions');
const r1 = x => Math.round(x * 10) / 10;
// split a shift's exact total across its blocks as whole mL that add up to the rounded shift total (largest remainder)
function wholeSplit(exact) { const tgt = Math.round(exact.reduce((s, x) => s + x, 0)); const fl = exact.map(Math.floor); let rem = tgt - fl.reduce((s, x) => s + x, 0); exact.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (rem > 0) { fl[i]++; rem--; } }); return fl; }
// [end, label, shiftId, po, urine, emesis, note text (voids and oral intake)]
const SPEC = [
  [T('Mon', '07:00'), 'ED 0130-0700', 'ED', 50, 1350, 150, 'ED (before the 12-hour shifts; the handoff totals are NOT added again to shift 1). Oral: ice chips 50 mL. Emesis 150 mL (0135, bilious, before the ondansetron). Voids: 0200 350 mL, 0330 300, 0445 300, 0600 400 = 1,350 mL (osmotic diuresis, 3.2 mL/kg/h). Priming volume is discarded and not counted.'],
  [T('Mon', '11:00'), '0700-1100', 'S1', 100, 550, 0, 'Day 1 day shift, block 1. Clear liquids 100 mL. Voids 0745 150 mL, 0845 130, 0945 140, 1045 130 = 550 mL.'],
  [T('Mon', '15:00'), '1100-1500', 'S1', 150, 550, 0, 'Clear liquids 150 mL. Voids 1145 140 mL, 1245 140, 1345 135, 1445 135 = 550 mL.'],
  [T('Mon', '19:00'), '1500-1900', 'S1', 100, 550, 0, 'Clear liquids 100 mL. Voids 1545 140 mL, 1645 140, 1745 135, 1845 135 = 550 mL.'],
  [T('Mon', '23:00'), '1900-2300', 'S2', 500, 400, 0, 'Day 1 night shift, block 1. Consistent-carbohydrate dinner tray 1930 and fluids 500 mL. Voids 1945 200 mL, 2200 200 = 400 mL.'],
  [T('Tue', '03:00'), '2300-0300', 'S2', 250, 350, 0, 'Water 250 mL before midnight, then NPO except medicines. Voids 2330 175 mL, 0200 175 = 350 mL.'],
  [T('Tue', '07:00'), '0300-0700', 'S2', 0, 300, 0, 'NPO (cardiac catheterization at 1100). Voids 0500 150 mL, 0645 150 = 300 mL.'],
  [T('Tue', '11:00'), '0700-1100', 'S3', 60, 500, 0, 'Day 2 day shift, block 1. NPO except sips with the 0800 medicines (60 mL). Voids 0730 250 mL, 1020 250 = 500 mL (before transport to the cath lab at 1040).'],
  [T('Tue', '15:00'), '1100-1500', 'S3', 400, 600, 0, 'Back from the cath lab at 1300; lunch tray and fluids 400 mL. Voids 1330 350 mL, 1445 250 = 600 mL.'],
  [T('Tue', '19:00'), '1500-1900', 'S3', 500, 650, 0, 'Fluids encouraged for contrast clearance, 500 mL (dinner 1730 counted in the same block). Voids 1600 250 mL, 1730 200, 1845 200 = 650 mL.'],
  [T('Tue', '23:00'), '1900-2300', 'S4', 450, 350, 0, 'Day 2 night shift, block 1. Dinner beverages and evening fluids 450 mL. Voids 1945 175 mL, 2215 175 = 350 mL.'],
  [T('Wed', '03:00'), '2300-0300', 'S4', 250, 250, 0, 'Water 250 mL. Voids 0030 125 mL, 0230 125 = 250 mL.'],
  [T('Wed', '07:00'), '0300-0700', 'S4', 200, 250, 0, 'Water 200 mL. Voids 0445 125 mL, 0640 125 = 250 mL.'],
  [T('Wed', '11:00'), '0700-1100', 'S5', 500, 500, 0, 'Day 3 day shift, block 1. Breakfast 0730 and fluids 500 mL. Voids 0800 250 mL, 1000 250 = 500 mL.'],
  [T('Wed', '15:00'), '1100-1500', 'S5', 600, 500, 0, 'Lunch 1200 and fluids 600 mL (lozenge 1400 with water included). Voids 1130 250 mL, 1330 250 = 500 mL.'],
  [T('Wed', '19:00'), '1500-1900', 'S5', 500, 450, 0, 'Fluids 500 mL; dinner 1730 counted in the same block. Voids 1600 225 mL, 1800 225 = 450 mL.'],
  [T('Wed', '23:00'), '1900-2300', 'S6', 350, 300, 0, 'Day 3 night shift, block 1. Evening fluids 350 mL. Voids 2000 150 mL, 2215 150 = 300 mL.'],
  [T('Thu', '03:00'), '2300-0300', 'S6', 250, 250, 0, 'Water 250 mL. Voids 0030 125 mL, 0230 125 = 250 mL.'],
  [T('Thu', '07:00'), '0300-0700', 'S6', 200, 200, 0, 'Water 200 mL. Void 0500 200 mL = 200 mL. Shift 6 total at the end of this block.']
];
// exact volumes per block, then whole-mL split per shift
const SH_START = { ED: I.M('Mon', '01:30') }; let prevEnd = I.M('Mon', '01:30');
const blocks0 = SPEC.map(s => { const endM = Math.round((hOfStamp(s[0])) * 60), v = I.vol(prevEnd, endM); const a = prevEnd; prevEnd = endM; return { s, a, b: endM, v }; });
['iv', 'ivmed'].forEach(key => { const byShift = {}; blocks0.forEach((b, i) => { (byShift[b.s[2]] = byShift[b.s[2]] || []).push(i); }); Object.values(byShift).forEach(idx => { const ex = idx.map(i => key === 'iv' ? blocks0[i].v.fluid : blocks0[i].v.ivmed); wholeSplit(ex).forEach((w, j) => { blocks0[idx[j]][key] = w; }); }); });
// component text for the notes (names, exact mL)
const fluidParts = (a, b) => I.FLUIDS.map(f => { const lo = Math.max(a, f[0]), hi = Math.min(b, f[1]); return hi > lo ? [f[4], (hi - lo) * f[2] / 60] : null; }).filter(Boolean);
function ivNote(bk) {
  const fp = fluidParts(bk.a, bk.b).map(([n, ml]) => `${n} ${r1(ml)} mL`), v = bk.v;
  const iv = fp.length ? `IV fluid: ${fp.join(' + ')} = ${r1(v.fluid)} mL (charted ${bk.iv}).` : 'No IV fluid.';
  const med = []; if (v.insulin) med.push(`regular insulin ${r1(v.insulin)} mL`); if (v.hep) med.push(`heparin ${r1(v.hep)} mL${bk.a <= I.HEP.bolus.t && bk.b > I.HEP.bolus.t ? ' (includes the 4 mL bolus)' : ''}`); if (v.kcl) med.push(`KCl 10 mEq/100 mL riders ${r1(v.kcl)} mL`); if (v.ond) med.push('ondansetron 2 mL');
  I.CATH.forEach(c => { if (c.t >= bk.a && c.t < bk.b) med.push(c.what + ' ' + c.ml + ' mL'); }); if (v.flush) med.push(`saline flushes ${v.flush} mL`);
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
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, XAONLY, POC, BLOCKS, ag, corrNa, effOsm, calcOsm, hh, winters, F, ECG_LINES };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), p.AGdesign === ag(p) ? 'ok' : `MISMATCH design ${p.AGdesign}`, 'corrNa', corrNa(p), 'effOsm', effOsm(p), 'calcOsm', calcOsm(p), p.pH ? `HH pH ${hh(p).toFixed(2)} (charted ${p.pH}) Winter ${winters(p).toFixed(1)}+-2 vs pCO2 ${p.pCO2}` : ''));
  let prev = null; POC.forEach(([t, v]) => { if (prev && typeof v === 'number' && typeof prev[1] === 'number') { const dh = hOfStamp(t) - hOfStamp(prev[0]); if (dh >= 0.9 && dh <= 1.1) console.log(t.slice(5), v, 'change/h', (v - prev[1]).toFixed(0)); } prev = [t, v]; });
  const io = buildIO(); let ti = 0, to = 0;
  io.forEach(b => { ti += b.intake; to += b.output; });
  console.log('TOTAL in', ti, 'out', to, 'net', ti - to, '(ED + simulation)');
  const sum = (from, to2) => io.filter(b => b.collected > from && b.collected <= to2).reduce((a, b) => [a[0] + b.intake, a[1] + b.output], [0, 0]);
  [['ED', '2026-11-16 00:00', T('Mon', '07:00')], ['D1 day', T('Mon', '07:00'), T('Mon', '19:00')], ['D1 night', T('Mon', '19:00'), T('Tue', '07:00')], ['D2 day', T('Tue', '07:00'), T('Tue', '19:00')], ['D2 night', T('Tue', '19:00'), T('Wed', '07:00')],
   ['D3 day', T('Wed', '07:00'), T('Wed', '19:00')], ['D3 night', T('Wed', '19:00'), T('Thu', '07:00')], ['Simulation', T('Mon', '07:00'), T('Thu', '07:00')]].forEach(([n, a, b]) => { const s = sum(a, b); console.log(n.padEnd(11), 'in', s[0], 'out', s[1], 'net', s[0] - s[1]); });
  BLOCKS.forEach(b => console.log(b[0], b[1], JSON.stringify(b[3]), b[4].slice(0, 160)));
}

/* In-class new-onset DKA patient (Nora Whitcombe): vital signs (ED and the 0700 arrival set ONLY), labs (time-gated with result times), ED point-of-care glucose, intake and output.
   See ../DESIGN.md (single source of truth). After Mon 0700 vital signs come from the bedside monitor (monitor.html rows for MRN SIM-40602) and the
   instructor says the bedside glucoses aloud; none of them are charted here. Weights are not vital signs: 55.0 kg is the ED dosing weight (patient record),
   56.2 kg (Tue 0600) is on the I&O daily-weight record. */
const { at, slug } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10 (null = not scored), location text]
const SETS = [
  [T('Mon', '01:45'), 98.9, 126, 98, 58, 30, 99, RA, 6, 'ED triage (deep, fast, regular breathing)'],
  [T('Mon', '03:00'), 98.8, 118, 104, 62, 28, 99, RA, null, 'ED, after the first liter of saline'],
  [T('Mon', '05:00'), 98.6, 112, 106, 64, 26, 99, RA, null, 'ED, 2 hours after the insulin infusion started'],
  [T('Mon', '06:15'), 98.6, 108, 108, 66, 24, 99, RA, null, 'ED, before transfer'],
  // ---- Mon 07:00 arrival in SD-6. Later vital signs are on the bedside monitor and are charted by the unit RN.
  [T('Mon', '07:00'), 98.6, 106, 110, 66, 24, 99, RA, 4, 'Step-down unit arrival (SD-6)']
];
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 55 ? 'Low' : ''); mk('HRSRC', 'HR Source', 'Cardiac monitor'); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 100 ? 'Low' : sb > 140 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Right upper arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 20 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted manually (deep, regular)');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2);
    if (pain !== null) mk('PAIN', 'Pain', `${pain}/10`);
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
// eGFR, CKD-EPI 2021 (race-free), 22-year-old woman
const AGE = 22;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.7, 1), -0.241) * Math.pow(Math.max(cr / 0.7, 1), -1.2) * Math.pow(0.9938, AGE) * 1.012);
// Chemistry sets (DESIGN.md section 6). t = collected, g = gas result, r = BMP (with Mg, phos) result, b = beta-hydroxybutyrate result.
const PANELS = [
  { k: '1', t: T('Mon', '01:50'), g: T('Mon', '02:05'), r: T('Mon', '02:35'), b: T('Mon', '02:45'), Na: 130, K: 5.8, Cl: 93, CO2: 7, BUN: 24, Cr: 1.3, Glu: 562, Ca: 9.6, Mg: 2.3, Phos: 5.9, BHB: 6.8, pH: 7.14, pCO2: 19, HCO3: 6.2 },
  { k: '2', t: T('Mon', '05:30'), g: T('Mon', '05:45'), r: T('Mon', '06:15'), b: T('Mon', '06:25'), Na: 133, K: 4.7, Cl: 100, CO2: 10, BUN: 21, Cr: 1.1, Glu: 352, Ca: 9.0, Mg: 2.1, Phos: 3.9, BHB: 5.4, pH: 7.24, pCO2: 22, HCO3: 9.2 },
  { k: '3', t: T('Mon', '09:30'), g: T('Mon', '09:45'), r: T('Mon', '10:15'), b: T('Mon', '10:25'), Na: 136, K: 4.1, Cl: 104, CO2: 13, BUN: 17, Cr: 0.9, Glu: 198, Ca: 8.8, Mg: 1.9, Phos: 2.6, BHB: 3.3, pH: 7.29, pCO2: 26, HCO3: 12.2 },
  { k: '4', t: T('Mon', '13:30'), g: T('Mon', '13:45'), r: T('Mon', '14:15'), b: T('Mon', '14:25'), Na: 137, K: 3.6, Cl: 106, CO2: 14, BUN: 13, Cr: 0.8, Glu: 172, Ca: 8.7, Mg: 1.7, Phos: 1.8, BHB: 1.3, pH: 7.32, pCO2: 27, HCO3: 13.4 },
  { k: '5', t: T('Mon', '17:30'), g: T('Mon', '17:45'), r: T('Mon', '18:15'), b: T('Mon', '18:25'), Na: 138, K: 3.9, Cl: 106, CO2: 18, BUN: 11, Cr: 0.8, Glu: 170, Ca: 8.8, Mg: 2.1, Phos: 2.0, BHB: 0.5, pH: 7.34, pCO2: 33, HCO3: 17.2, spec: 'Blood (venipuncture, right hand below the right forearm IV; rider paused 2 minutes)' },
  { k: '6', t: T('Mon', '22:00'), r: T('Mon', '22:45'), b: T('Mon', '22:55'), Na: 139, K: 4.0, Cl: 106, CO2: 20, BUN: 10, Cr: 0.7, Glu: 152, Ca: 8.9, Mg: 2.0, Phos: 2.2, BHB: 0.3 },
  { k: '7', t: T('Tue', '02:00'), r: T('Tue', '02:45'), b: T('Tue', '02:55'), Na: 139, K: 4.1, Cl: 105, CO2: 22, BUN: 10, Cr: 0.7, Glu: 84, Ca: 9.0, Mg: 2.0, Phos: 2.6, BHB: 0.3 },
  { k: '8', t: T('Tue', '05:30'), r: T('Tue', '06:15'), b: T('Tue', '06:25'), Na: 140, K: 4.2, Cl: 104, CO2: 24, BUN: 11, Cr: 0.7, Glu: 124, Ca: 9.1, Mg: 2.0, Phos: 3.0, BHB: 0.2 }
];
const ag = p => p.Na - p.Cl - p.CO2;
const corrNa = p => Math.round((p.Na + 1.6 * Math.max(0, p.Glu - 100) / 100) * 10) / 10;   // ADA factor 1.6
const effOsm = p => Math.round(2 * p.Na + p.Glu / 18);
const calcOsm = p => Math.round(2 * p.Na + p.Glu / 18 + p.BUN / 2.8);
// ED point-of-care glucose (charted up to the 0700 arrival only; later values are said aloud by the instructor)
const POC = [['Mon', '01:46', 548], ['Mon', '03:00', 498], ['Mon', '04:00', 442], ['Mon', '05:00', 384], ['Mon', '06:00', 330], ['Mon', '07:00', 274]].map(([d, t, v]) => [T(d, t), v]);

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const has = key => PANELS.filter(p => p[key] !== null && p[key] !== undefined);
  const pn = (label, key, units, ref, lo, hi, dec, o) => has(key).forEach(p => add(lab('Chemistry', label, units, ref, lo, hi, [[p.t, p[key], p.r]], Object.assign({ dec, specimen: p.spec }, o || {}))));
  pn('Sodium', 'Na', 'mmol/L', '136-145', 136, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.1', 3.5, 5.1, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0, { crit: [10] });
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.6-1.1', 0.6, 1.1, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-99 (fasting)', 70, 99, 0, { crit: [50, 500] }); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.3', 8.6, 10.3, 1, { crit: [6.5, 13] });
  pn('Magnesium', 'Mg', 'mg/dL', '1.8-2.4', 1.8, 2.4, 1, { crit: [1.0, 5.0] }); pn('Phosphorus', 'Phos', 'mg/dL', '2.5-4.5', 2.5, 4.5, 1, { crit: [1.0] });
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', 'Over 60 (estimate)', 60, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Beta-hydroxybutyrate (serum ketone)', 'mmol/L', 'Under 0.6', null, 0.5, has('BHB').map(p => [p.t, p.BHB, p.b]), { dec: 1, crit: [undefined, 3.0] }));
  const g = has('pH');
  add(lab('Blood Gas', 'pH, venous', '', '7.31-7.41', 7.31, 7.41, g.map(p => [p.t, p.pH, p.g]), { dec: 2, crit: [7.2], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'pCO2, venous', 'mmHg', '41-51', 41, 51, g.map(p => [p.t, p.pCO2, p.g]), { dec: 0, specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'HCO3, venous (calculated)', 'mmol/L', '22-28', 22, 28, g.map(p => [p.t, p.HCO3, p.g]), { dec: 1, crit: [10], specimen: 'Venous blood' }));
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[T('Mon', '01:50'), 2.1, T('Mon', '02:05')], [T('Mon', '05:30'), 1.2, T('Mon', '05:45')]], { dec: 1, specimen: 'Venous blood' }));
  // first-draw extras (ED 0150)
  const ED = T('Mon', '01:50'), EDR = T('Mon', '02:35');
  add(lab('Chemistry', 'Lipase', 'U/L', '13-60', 13, 60, [[ED, 48, EDR]], { dec: 0 }));
  add(lab('Chemistry', 'hCG, serum (quantitative)', 'mIU/mL', 'Under 5 (negative)', null, null, [[ED, 'Negative (under 2)', EDR]]));
  add(lab('Endocrine', 'Hemoglobin A1c', '%', 'Under 5.7 (5.7-6.4 prediabetes; 6.5 or more diabetes)', null, 5.6, [[ED, 11.6, T('Mon', '10:00')]], { dec: 1 }));
  // new-diagnosis labs (ordered 0500 by D. Rasmussen, MD; drawn with the 0530 set)
  const ND = T('Mon', '05:30');
  add(lab('Endocrine', 'TSH', 'mIU/L', '0.4-4.0', 0.4, 4.0, [[ND, 1.8, T('Mon', '11:30')]], { dec: 1 }));
  add(lab('Immunology', 'Tissue transglutaminase IgA (tTG-IgA)', 'U/mL', 'Under 4 (negative)', null, 3.9, [[ND, 'Under 1.0 (negative)', T('Tue', '05:00')]], { status: 'Final (reference lab)' }));
  add(lab('Immunology', 'Immunoglobulin A, total (IgA)', 'mg/dL', '70-400', 70, 400, [[ND, 165, T('Tue', '05:00')]], { dec: 0, status: 'Final (reference lab)' }));
  add(lab('Endocrine', 'C-peptide', 'ng/mL', '0.8-3.1', 0.8, 3.1, [[ND, 0.3, T('Tue', '06:00')]], { dec: 1, status: 'Final (reference lab; serum glucose 352 at the draw)' }));
  ['GAD65 antibody', 'IA-2 antibody', 'Zinc transporter 8 (ZnT8) antibody'].forEach(a => add(lab('Immunology', a, '', 'Negative', null, null, [[ND, 'Pending (send-out to the reference lab)', null]], { status: 'Pending' })));
  // CBC: ED and Tuesday 0530
  const CB = [[ED, T('Mon', '02:15')], [T('Tue', '05:30'), T('Tue', '06:00')]];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w[0], vals[i], w[1]]).filter(e => e[1] !== null), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.5-11.0', 4.5, 11.0, [16.4, 8.2], 1); cb('Hemoglobin', 'g/dL', '12.0-15.5', 12.0, 15.5, [15.8, 12.6], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '36-46', 36, 46, [47.5, 37.8], 1); cb('Platelets', 'K/uL', '150-400', 150, 400, [318, 246], 0);
  cb('Neutrophils', '%', '40-70', 40, 70, [86, 62], 0); cb('Lymphocytes', '%', '20-45', 20, 45, [9, 29], 0); cb('Bands', '%', '0-5', 0, 5, [0, null], 0);
  // urine (ED void 0230, result 0300)
  const UT = T('Mon', '02:30'), UR = T('Mon', '03:00');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[UT, v, UR]], { specimen: 'Urine (clean catch in the ED)', abn: /\+|Large|Trace|Positive|Over|1\.032/ }));
  ua('UA appearance', 'Clear/yellow', 'Pale yellow, clear'); ua('UA specific gravity', '1.005-1.030', '1.032'); ua('UA glucose', 'Negative', 'Over 1,000 mg/dL (4+)'); ua('UA ketones', 'Negative', 'Large (80 mg/dL or more)');
  ua('UA protein', 'Negative', 'Trace'); ua('UA blood', 'Negative', 'Negative'); ua('UA leukocyte esterase', 'Negative', 'Negative'); ua('UA nitrite', 'Negative', 'Negative'); ua('UA WBC', '0-5 /hpf', '0-2 /hpf'); ua('UA bacteria', 'None', 'None seen');
  // ECG interpretation (Cardiac); the tracing with its image is in Chart Review > Cardiology
  add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[T('Mon', '02:05'), 'Sinus tachycardia 124 bpm, PR 138 ms, QRS 84 ms, QT/QTc 296/426 ms. Peaked, narrow, symmetric T waves V2-V4. No other changes.', T('Mon', '02:15')]], { specimen: 'ECG', abn: /peaked|tachy/i }));
  // ED point-of-care glucose (meter docks to the chart)
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-180 (goal 150-249 while on the insulin infusion)', 70, 180, POC.map(([t, v]) => [t, v]), { specimen: 'Capillary blood (fingerstick)', crit: [54, 500] }));
  return out;
}

// Intake and output: two ED blocks, then 4-hour blocks (collected = block end, periodEnd: true). Numbers are DESIGN.md section 9; gen/infusions.js recomputes the IV parts and assemble.js checks them.
const BLOCKS = [
  // [end, label, { po, iv, ivmed, urine, emesis }, note]
  [T('Mon', '03:00'), 'ED 0140-0300', { po: 0, iv: 1000, ivmed: 0, urine: 450, emesis: 150 }, 'ED. IV fluid: 0.9% sodium chloride 1,000 mL bolus 0200-0300. NPO. Void 0230 450 mL (urine sample). Emesis 0215 150 mL.'],
  [T('Mon', '07:00'), 'ED 0300-0700', { po: 0, iv: 1500, ivmed: 22, urine: 900, emesis: 0 }, 'ED. IV fluid: 0.9% sodium chloride 500 mL/h 0300-0500 (1,000 mL), 250 mL/h 0500-0700 (500 mL) = 1,500 mL. IV med: insulin 5.5 mL/h from 0305 (22 mL). NPO except ice chips. Voids 0420 500 mL, 0610 400 mL.'],
  [T('Mon', '11:00'), '0700-1100', { po: 60, iv: 709, ivmed: 172, urine: 900, emesis: 0 }, '0.45% sodium chloride 250 mL/h 0700-0805 (271 mL); D5W/0.45% sodium chloride 150 mL/h from 0805 (438 mL). IV med: insulin 5.5 mL/h (22 mL) + KCl riders 0715 (100 mL) and 1030 (50 mL in this block). Ice chips 120 mL (counted as 60 mL). Voids 0800 350 mL, 0945 300 mL, 1050 250 mL.'],
  [T('Mon', '15:00'), '1100-1500', { po: 540, iv: 600, ivmed: 172, urine: 850, emesis: 0 }, 'D5W/0.45% sodium chloride 150 mL/h (600 mL). IV med: insulin 22 mL + KCl riders 1030 (50 mL in this block) and 1130 (100 mL). Sugar-free clear liquids 540 mL. Voids 1150 300 mL, 1330 300 mL, 1450 250 mL.'],
  [T('Mon', '19:00'), '1500-1900', { po: 480, iv: 600, ivmed: 464, urine: 700, emesis: 0 }, 'D5W/0.45% sodium chloride 150 mL/h (600 mL). IV med: insulin 22 mL + KCl riders 1505, 1605, 1705 (300 mL) and 1805 (92 mL in this block) + magnesium sulfate 2 g in 50 mL (1505-1705). Sugar-free clear liquids 480 mL. Voids 1600 250 mL, 1730 250 mL, 1850 200 mL.'],
  [T('Mon', '23:00'), '1900-2300', { po: 360, iv: 300, ivmed: 19, urine: 550, emesis: 0 }, 'D5W/0.45% sodium chloride 150 mL/h 1900-2100 (300 mL); insulin infusion and D5W/0.45% sodium chloride off at 2100, both IVs saline-locked. IV med: insulin 11 mL + KCl rider 1805 (last 8 mL, finished 1905). Dinner fluids and water 360 mL. Voids 2030 300 mL, 2240 250 mL.'],
  [T('Tue', '03:00'), '2300-0300', { po: 120, iv: 0, ivmed: 0, urine: 300, emesis: 0 }, 'No IV fluid (saline locks). Water 120 mL (0100). Void 0130 300 mL.'],
  [T('Tue', '07:00'), '0300-0700', { po: 480, iv: 0, ivmed: 0, urine: 600, emesis: 0 }, 'No IV fluid. Apple juice 120 mL (0318), milk 120 mL with crackers and peanut butter (0335), water 240 mL. Glucose tablets carry no volume. Voids 0420 300 mL, 0640 300 mL. Daily weight 0600 (standing scale): 56.2 kg (ED bed scale 55.0 kg on arrival).']
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

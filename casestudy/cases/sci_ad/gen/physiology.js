/* In-class SCI patient (Wesley Harcourt): vital signs (ED and the 0700 arrival set ONLY), labs and microbiology (time-gated with result times), intake and output.
   See ../DESIGN.md (single source of truth). After Mon 0700 vital signs come from the bedside monitor (monitor.html rows for MRN SIM-40603) and the
   instructor says aloud the values that are not on the monitor (orthostatic set, AD-event checks between rows, bladder volumes). None of them are charted here.
   72.0 kg (ED bed scale) is the dosing weight on the patient record, not a vital sign. */
const { at, slug } = require('./lib');
const T = (d, t) => at(d, t);
const RA = 'Room air';
// [datetime, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10 (null = not scored), location text]
const SETS = [
  [T('Sun', '21:40'), 101.8, 98, 92, 56, 18, 96, RA, 2, 'ED triage'],
  [T('Sun', '23:00'), 101.2, 92, 98, 60, 18, 96, RA, null, 'ED, after the 1 L bolus'],
  [T('Mon', '01:00'), 100.4, 84, 96, 58, 16, 97, RA, null, 'ED (boarding)'],
  [T('Mon', '04:00'), 99.8, 74, 94, 58, 16, 97, RA, null, 'ED (boarding)'],
  // ---- Mon 07:00 on 4 West (4W-14). Later vital signs are on the bedside monitor and are charted by the unit RN.
  [T('Mon', '07:00'), 99.4, 70, 96, 58, 16, 97, RA, 2, '4 West arrival (4W-14)']
];
const ctoF = f => ((f - 32) * 5 / 9).toFixed(1);
function buildVitals() {
  const out = [];
  SETS.forEach(([t, tf, hr, sb, db, rr, sp, o2, pain]) => {
    const k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F (${ctoF(tf)} °C)`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : hr < 50 ? 'Low' : ''); mk('HRSRC', 'HR Source', 'Pulse oximeter / monitor'); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 140 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Right upper arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 20 ? 'High' : rr < 12 ? 'Low' : ''); mk('RRSRC', 'RR Source', 'Counted');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2);
    if (pain !== null) mk('PAIN', 'Pain', `${pain}/10 (shoulders)`);
  });
  return out;
}

// entries: [collected, value, availableAt (result time)]
function lab(category, label, units, reference, lo, hi, entries, o = {}) {
  const dec = o.dec || 0, crit = o.crit || [];
  return entries.map(([t, value, avail], i) => {
    const v = typeof value === 'number' ? value : NaN; let flag = '';
    if (!isNaN(v)) { if (hi !== null && v > hi) flag = 'High'; if (lo !== null && v < lo) flag = 'Low'; if (crit[0] !== undefined && v < crit[0]) flag = 'Critical Low'; if (crit[1] !== undefined && v > crit[1]) flag = 'Critical High'; }
    if (o.abn && isNaN(v) && o.abn.test(String(value))) flag = 'Abnormal';
    const r = { id: `lab_${slug(label)}_${t.replace(/[- :]/g, '_')}${o.idSuffix ? '_' + o.idSuffix[i] : ''}`, type: 'lab', category, code: label, label, value: isNaN(v) ? String(value) : v.toFixed(dec), units, flag, reference, specimen: o.specimen || 'Blood', status: (o.statuses && o.statuses[i]) || o.status || 'Final', collected: t };
    if (avail) r.availableAt = avail;
    return r;
  });
}
// eGFR, CKD-EPI 2021 (race-free), 34-year-old man. Creatinine is low from low muscle mass after SCI, so this OVERESTIMATES kidney function.
const AGE = 34;
const egfr = cr => Math.round(142 * Math.pow(Math.min(cr / 0.9, 1), -0.302) * Math.pow(Math.max(cr / 0.9, 1), -1.2) * Math.pow(0.9938, AGE));
// Chemistry sets (DESIGN.md section 10). t = collected, r = result.
const PANELS = [
  { k: 'ED', t: T('Sun', '22:00'), r: T('Sun', '22:45'), Na: 136, K: 4.2, Cl: 102, CO2: 23, BUN: 22, Cr: 0.7, Glu: 118, Ca: 9.0, Mg: 2.0 },
  { k: 'D1', t: T('Mon', '05:00'), r: T('Mon', '06:00'), Na: 137, K: 3.9, Cl: 105, CO2: 22, BUN: 16, Cr: 0.6, Glu: 104, Ca: 8.7, Mg: 1.9 },
  { k: 'D2', t: T('Tue', '05:00'), r: T('Tue', '06:00'), Na: 138, K: 4.1, Cl: 104, CO2: 25, BUN: 12, Cr: 0.6, Glu: 96, Ca: 8.9, Mg: 2.0 }
];
// CBC sets [collected, result, WBC, neut %, bands % or null, Hgb, Hct, Plt]
const CBCS = [
  [T('Sun', '22:00'), T('Sun', '22:35'), 14.6, 84, 4, 13.4, 40.1, 262],
  [T('Mon', '05:00'), T('Mon', '06:00'), 13.1, 81, null, 12.6, 37.9, 248],
  [T('Mon', '17:00'), T('Mon', '17:45'), 11.0, 76, null, 12.7, 38.1, 251],
  [T('Tue', '05:00'), T('Tue', '06:00'), 8.9, 68, null, 12.8, 38.4, 255]
];
const ag = p => p.Na - p.Cl - p.CO2;
const ED = T('Sun', '22:00'), D1 = T('Mon', '05:00'), PM = T('Mon', '17:00'), D2 = T('Tue', '05:00');
// microbiology updates: each update is its own result row (collected = result time), the way the other case files chart cultures
const UCX = [
  [ED, 'Collected from the NEW catheter (placed 2200), in process', 'In process'],
  [T('Mon', '14:00'), 'Preliminary: greater than 100,000 CFU/mL gram-negative rods. Identification to follow.', 'Preliminary'],
  [T('Mon', '22:00'), 'Escherichia coli, greater than 100,000 CFU/mL. Susceptibilities to follow.', 'Preliminary'],
  [T('Tue', '02:30'), 'FINAL: Escherichia coli, greater than 100,000 CFU/mL. Susceptibilities: ampicillin RESISTANT; ampicillin-sulbactam intermediate; cefazolin susceptible (urine breakpoint; predicts oral cephalosporins); ceftriaxone susceptible; ciprofloxacin susceptible; trimethoprim-sulfamethoxazole RESISTANT; nitrofurantoin susceptible; gentamicin susceptible.', 'Final']
];
const BCX = [
  [ED, 'Collected 2205 (left arm) and 2210 (right arm), before the first antibiotic; in process', 'In process'],
  [T('Mon', '10:00'), 'No growth at 12 hours (preliminary; final at 5 days)', 'Preliminary'],
  [T('Mon', '22:00'), 'No growth at 24 hours (preliminary; final at 5 days)', 'Preliminary']
];
const SUSC = [['Ampicillin', 'Resistant'], ['Ampicillin-sulbactam', 'Intermediate'], ['Cefazolin (urine breakpoint)', 'Susceptible'], ['Ceftriaxone', 'Susceptible'], ['Ciprofloxacin', 'Susceptible'], ['Trimethoprim-sulfamethoxazole', 'Resistant'], ['Nitrofurantoin', 'Susceptible'], ['Gentamicin', 'Susceptible']];

function buildLabs() {
  const out = [], add = a => out.push(...a);
  const pn = (label, key, units, ref, lo, hi, dec, o) => PANELS.forEach(p => add(lab('Chemistry', label, units, ref, lo, hi, [[p.t, p[key], p.r]], Object.assign({ dec }, o || {}))));
  pn('Sodium', 'Na', 'mmol/L', '136-145', 136, 145, 0, { crit: [120, 160] }); pn('Potassium', 'K', 'mmol/L', '3.5-5.1', 3.5, 5.1, 1, { crit: [2.8, 6.0] });
  pn('Chloride', 'Cl', 'mmol/L', '98-107', 98, 107, 0); pn('CO2 (bicarbonate)', 'CO2', 'mmol/L', '22-29', 22, 29, 0);
  pn('BUN', 'BUN', 'mg/dL', '7-20', 7, 20, 0); pn('Creatinine', 'Cr', 'mg/dL', '0.7-1.3', 0.7, 1.3, 1);
  pn('Glucose (serum)', 'Glu', 'mg/dL', '70-99 (fasting)', 70, 99, 0); pn('Calcium', 'Ca', 'mg/dL', '8.6-10.3', 8.6, 10.3, 1);
  pn('Magnesium', 'Mg', 'mg/dL', '1.8-2.4', 1.8, 2.4, 1);
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '8-12 (Na - Cl - CO2)', 8, 12, PANELS.map(p => [p.t, ag(p), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m2', 'Over 60 (estimate; overestimates kidney function when muscle mass is low)', 60, null, PANELS.map(p => [p.t, egfr(p.Cr), p.r]), { dec: 0 }));
  add(lab('Chemistry', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[ED, 1.6, T('Sun', '22:45')]], { dec: 1 }));
  add(lab('Chemistry', 'Procalcitonin', 'ng/mL', 'Under 0.1 (0.25-0.5 bacterial infection possible)', null, 0.09, [[ED, 0.42, T('Sun', '23:30')]], { dec: 2 }));
  add(lab('Chemistry', 'C-reactive protein (CRP)', 'mg/L', 'Under 8', null, 7.9, [[ED, 98, T('Sun', '23:00')], [D1, 112, T('Mon', '06:00')], [PM, 86, T('Mon', '18:00')], [D2, 54, T('Tue', '06:00')]], { dec: 0 }));
  add(lab('Hematology', 'Erythrocyte sedimentation rate (ESR)', 'mm/h', '0-15', 0, 15, [[ED, 48, T('Sun', '23:00')], [D1, 52, T('Mon', '06:30')], [D2, 46, T('Tue', '06:30')]], { dec: 0 }));
  add(lab('Chemistry', 'Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [[D1, 3.2, T('Mon', '06:00')]], { dec: 1 }));
  add(lab('Chemistry', 'Prealbumin', 'mg/dL', '18-38', 18, 38, [[D1, 14, T('Mon', '10:30')]], { dec: 0 }));
  add(lab('Chemistry', '25-hydroxy vitamin D', 'ng/mL', '30-100 (20-29 insufficient; under 20 deficient)', 30, 100, [[D1, 22, T('Mon', '14:00')]], { dec: 0 }));
  // CBC
  const cb = (label, units, ref, lo, hi, idx, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CBCS.filter(c => c[idx] !== null).map(c => [c[0], c[idx], c[1]]), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.5-11.0', 4.5, 11.0, 2, 1); cb('Neutrophils', '%', '40-70', 40, 70, 3, 0); cb('Bands', '%', '0-5', 0, 5, 4, 0);
  cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, 5, 1, { crit: [7.0] }); cb('Hematocrit', '%', '41-53', 41, 53, 6, 1); cb('Platelets', 'K/uL', '150-400', 150, 400, 7, 0);
  // urinalysis (new catheter, 2200; result 2240)
  const UR = T('Sun', '22:40');
  const ua = (label, ref, v) => add(lab('Urinalysis', label, '', ref, null, null, [[ED, v, UR]], { specimen: 'Urine (from the new indwelling catheter, placed 2200)', abn: /\+|Positive|Over|Many|Small|Cloudy|5-10|clumps|1\.024/ }));
  ua('UA appearance', 'Clear/yellow', 'Cloudy, amber'); ua('UA specific gravity', '1.005-1.030', '1.024'); ua('UA pH', '5.0-8.0', '6.5'); ua('UA protein', 'Negative', '1+');
  ua('UA blood', 'Negative', 'Small'); ua('UA leukocyte esterase', 'Negative', '3+'); ua('UA nitrite', 'Negative', 'Positive'); ua('UA WBC', '0-5 /hpf', 'Over 50 /hpf with WBC clumps');
  ua('UA RBC', '0-2 /hpf', '5-10 /hpf'); ua('UA bacteria', 'None', 'Many'); ua('UA squamous epithelial cells', '0-5 /hpf', '0-2 /hpf');
  // microbiology
  const micro = (label, rows, spec, sfx) => rows.forEach(([t, v, st], i) => out.push({ id: `lab_${slug(label)}_${t.replace(/[- :]/g, '_')}_${i}`, type: 'lab', category: 'Microbiology', code: label, label, value: v, units: '', flag: /gram-negative|coli|RESISTANT/.test(v) ? 'Abnormal' : '', reference: 'No growth', specimen: spec, status: st, collected: t, availableAt: t }));
  micro('Urine culture (new catheter)', UCX, 'Urine (new indwelling catheter, sampling port)');
  micro('Blood cultures x2 (peripheral)', BCX, 'Blood (two sets, two sites)');
  const ST = T('Tue', '02:30');
  SUSC.forEach(([drug, r]) => out.push({ id: `lab_susc_${slug(drug)}`, type: 'lab', category: 'Microbiology', code: `E. coli susceptibility: ${drug}`, label: `E. coli susceptibility: ${drug}`, value: r, units: '', flag: r === 'Susceptible' ? '' : 'Abnormal', reference: 'Susceptible', specimen: 'Urine culture isolate (Escherichia coli)', status: 'Final', collected: ST, availableAt: ST }));
  // ECG interpretation line (Cardiac); the tracing with its image is in Chart Review > Cardiology
  add(lab('Cardiac', 'ECG 12-lead interpretation', '', '', null, null, [[T('Mon', '09:23'), 'Sinus bradycardia 50 bpm, PR 180 ms, QRS 80 ms, QTc 410 ms, normal axis. No ST or T-wave changes. (Over-read by Cardiology to follow.)', T('Mon', '09:30')]], { specimen: 'ECG', abn: /brady/i }));
  return out;
}

// Intake and output: ED block from arrival, then 4-hour blocks (collected = block end, periodEnd: true). Numbers are DESIGN.md section 14; gen/infusions.js recomputes the IV parts and assemble.js checks them.
const BLOCKS = [
  // [end, label, { po, iv, urine }, note]
  [T('Sun', '23:00'), 'ED 2130-2300', { po: 240, iv: 1000, urine: 600 }, 'ED. IV fluid: 0.9% sodium chloride 1,000 mL bolus 2200-2300. Water 240 mL. Urine: 450 mL cloudy, foul-smelling at catheter insertion (2200) + 150 mL.'],
  [T('Mon', '03:00'), '2300-0300', { po: 480, iv: 400, urine: 900 }, 'ED (boarding). 0.9% sodium chloride 100 mL/h (400 mL). Water 480 mL. Indwelling catheter drainage 900 mL.'],
  [T('Mon', '07:00'), '0300-0700', { po: 600, iv: 400, urine: 760 }, 'ED, then 4 West at 0650. 0.9% sodium chloride 100 mL/h (400 mL). Water and juice 600 mL. Catheter drainage 760 mL (bag emptied 0645).'],
  [T('Mon', '11:00'), '0700-1100', { po: 1000, iv: 400, urine: 1010 }, '0.9% sodium chloride 100 mL/h (400 mL), saline-locked 1100. Water, juice and coffee 1,000 mL ("I always drink a lot when I have a UTI"). Urine: 150 mL (bag emptied 0730) + 600 mL drained 0920-0926 when the kinked tubing was straightened + 260 mL 0930-1100.'],
  [T('Mon', '15:00'), '1100-1500', { po: 960, iv: 20, urine: 700 }, 'Saline lock flushes 20 mL. Oral fluids 960 mL. Catheter drainage 700 mL; tubing checked with each turn.'],
  [T('Mon', '19:00'), '1500-1900', { po: 720, iv: 0, urine: 600 }, 'Oral fluids and protein supplement 720 mL. Catheter drainage 600 mL.'],
  [T('Mon', '23:00'), '1900-2300', { po: 600, iv: 0, urine: 440 }, 'Oral fluids 600 mL (less after 2000). Urine: 60 mL in the bag when the indwelling catheter came out + intermittent catheterization 2200 380 mL, clear yellow. Stool: 1 large soft-formed (bowel program, 2050).'],
  [T('Tue', '03:00'), '2300-0300', { po: 120, iv: 0, urine: 420 }, 'Water 120 mL. Intermittent catheterization 0200: 420 mL.'],
  [T('Tue', '07:00'), '0300-0700', { po: 240, iv: 0, urine: 460 }, 'Water 240 mL. Intermittent catheterization 0600: 460 mL (close to the 500 mL limit).']
];
function buildIO() {
  return BLOCKS.map(([t2, time, d, note]) => ({ id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time, collected: t2, periodEnd: true, intake: d.po + d.iv, output: d.urine, detail: { po: d.po, iv: d.iv, urine: d.urine, other: 0, otherLabel: '' }, note }));
}
module.exports = { buildVitals, buildLabs, buildIO, SETS, PANELS, CBCS, BLOCKS, ag, egfr };
if (require.main === module) {
  console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length);
  PANELS.forEach(p => console.log(p.k, p.t, 'AG', ag(p), 'BUN/Cr', (p.BUN / p.Cr).toFixed(0), 'eGFR', egfr(p.Cr)));
  let ti = 0, to = 0; buildIO().slice(3).forEach(b => { ti += b.intake; to += b.output; }); console.log('D1 0700-D2 0700 in', ti, 'out', to, 'net', ti - to);
}

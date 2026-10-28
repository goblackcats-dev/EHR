/* Burn ICU patient: physiology (vitals, labs, intake and output, ventilator, drips).  See ../DESIGN.md.
   state(h) is the noise-free "truth" at h hours after Mon 04:00; the vital sets add small deterministic jitter. */
const { H, hOf, at, hhmm, slug, rng, interp, step, dayName } = require('./lib');
const R = rng(20261102);
const jit = a => (R() - 0.5) * 2 * a;
const round = (v, d = 0) => { const m = Math.pow(10, d); return Math.round(v * m) / m; };

const KG = 82;
const T_EXTUBATE = hOf('Wed', '10:45'), T_FOLEY_OUT = hOf('Thu', '05:00'), T_ALINE_OUT = hOf('Thu', '05:00'), T_NOREPI_ON = hOf('Tue', '17:30'), T_NOREPI_OFF = hOf('Wed', '04:30');
const T_SAT1 = hOf('Tue', '08:00'), T_PROP_OFF = hOf('Wed', '08:00');

// ---- continuous curves (hour, value)
const C = {
  hr: [[-1.5, 110], [0, 108], [4, 112], [8, 104], [16, 98], [24, 94], [28, 94], [30, 96], [33, 98], [34, 104], [35.5, 112], [37, 120], [38, 126], [39.5, 132], [41, 126], [42, 120], [46, 108], [52, 96], [58, 90], [64, 88], [72, 82], [75, 80]],
  map: [[-1.5, 78], [0, 72], [3, 70], [6, 76], [12, 78], [24, 80], [30, 78], [33, 76], [34.5, 72], [36, 69], [37.25, 64], [37.5, 64], [38, 68], [40, 70], [42, 72], [44, 74], [48, 76], [50, 76], [60, 80], [75, 82]],
  pp: [[-1.5, 44], [24, 46], [34, 50], [38, 58], [42, 56], [48, 50], [75, 48]],
  temp: [[-1.5, 96.8], [0, 97.4], [3, 98.2], [8, 99.0], [16, 99.2], [24, 99.4], [30, 99.5], [33, 99.8], [34, 100.4], [35.5, 101.0], [37, 101.6], [38.5, 102.1], [39.5, 102.4], [41, 102.0], [42, 101.6], [44, 101.0], [46, 100.6], [50, 100.2], [52, 99.8], [58, 99.4], [64, 99.0], [72, 98.7], [75, 98.6]],
  rr: [[-1.5, 24], [0, 18], [12, 17], [24, 16], [33, 18], [35, 22], [38, 28], [39.5, 30], [42, 26], [46, 22], [50, 18], [54.5, 18], [55, 22], [60, 21], [75, 18]],
  spo2: [[-1.5, 100], [0, 100], [8, 99], [24, 98], [34, 98], [38, 95], [39.5, 93], [42, 95], [46, 97], [54.5, 98], [55, 96], [75, 96]],
  pip: [[0, 28], [12, 27], [24, 24], [36, 25], [39.5, 31], [44, 28], [50, 24], [54, 22]],
  uop: [[0, 28], [1, 24], [2, 30], [3, 36], [4, 42], [5, 44], [6, 40], [7, 33], [8, 29], [9, 28], [10, 34], [11, 38], [12, 41], [13, 44], [14, 46], [15, 43], [16, 40], [17, 38], [18, 36], [19, 37], [20, 40], [21, 43], [22, 42], [23, 41], [24, 43], [28, 48], [32, 46], [33, 42], [34, 38], [35, 33], [36, 22], [37, 24], [38, 18], [39, 24], [40, 31], [41, 38], [42, 44], [44, 52], [48, 64], [52, 70], [56, 72], [60, 68], [66, 60], [72, 52], [75, 48]],
  glu: [[-1.5, 142], [2, 156], [8, 172], [14, 188], [20, 196], [28, 170], [33, 176], [36, 215], [39, 248], [42, 262], [46, 200], [49, 176], [56, 150], [75, 138]]
};
const FIO2 = [[-2, 1.0], [2, 0.6], [10, 0.5], [24, 0.4], [38, 0.5], [50, 0.4], [53, 0.35]];
const PEEP = [[-2, 5], [38, 8], [46, 6], [50, 5]];
const RRSET = [[-2, 16], [38, 18], [46, 16]];
const RASS = [[-2, -3], [24, -2], [38, -3], [48, -2], [52, 0], [55, 0]];
// infusions: [startH, value] step functions (value 0 = off)
const PROPOFOL = [[-2, 30], [12, 35], [24, 30], [38, 40], [48, 30], [52, 0]];            // mcg/kg/min
const FENTANYL = [[-2, 100], [38, 150], [48, 100], [54.75, 0]];                            // mcg/h
const NOREPI = [[0, 0], [37.5, 0.05], [38, 0.08], [38.5, 0.10], [39.5, 0.12], [40.5, 0.14], [44, 0.12], [46, 0.08], [48, 0.04], [48.5, 0]];   // mcg/kg/min
const DEXMED = [[0, 0], [hOf('Wed', '11:00'), 0.4], [hOf('Thu', '03:00'), 0]];            // mcg/kg/h
const INSULIN = [[0, 0], [hOf('Tue', '00:30'), 1], [hOf('Tue', '06:00'), 1.5], [hOf('Tue', '12:00'), 1], [hOf('Tue', '15:00'), 1.5], [hOf('Tue', '18:00'), 4], [hOf('Tue', '21:00'), 5], [hOf('Wed', '00:00'), 3], [hOf('Wed', '03:00'), 1.5], [hOf('Wed', '08:00'), 1], [hOf('Wed', '12:00'), 0]];  // units/h
const FEEDS = [[0, 0], [hOf('Mon', '10:00'), 20], [hOf('Mon', '14:00'), 30], [hOf('Mon', '18:00'), 40], [hOf('Mon', '22:00'), 50], [hOf('Tue', '02:00'), 60], [hOf('Tue', '06:00'), 70], [hOf('Wed', '10:30'), 0]];   // mL/h Osmolite 1.5 via OG
// crystalloid and albumin (mL/h)
const LR = [[-4, 0], [hOf('Mon', '02:30'), 450], [hOf('Mon', '06:00'), 540], [hOf('Mon', '09:30'), 225], [hOf('Mon', '14:00'), 270], [hOf('Tue', '01:30'), 125], [hOf('Tue', '06:00'), 75], [hOf('Tue', '10:00'), 100], [hOf('Wed', '02:00'), 75], [hOf('Wed', '12:00'), 50], [hOf('Wed', '18:00'), 0]];
const ALB = [[0, 0], [hOf('Tue', '06:00'), 125], [hOf('Tue', '10:00'), 0], [hOf('Tue', '22:00'), 125], [hOf('Wed', '02:00'), 0]];
const KVO = [[0, 0], [hOf('Wed', '18:00'), 20]];   // NS carrier through the central line once LR stops

const rassAt = h => step(RASS, h);
function state(h) {
  const map = interp(C.map, h), pp = interp(C.pp, h);
  const extub = h >= T_EXTUBATE;
  const pip = interp(C.pip, h);
  const atDress = (Math.abs(h - hOf('Mon', '14:00')) < 0.5) || (Math.abs(h - hOf('Tue', '14:00')) < 0.5);
  let cpot = h < hOf('Tue', '13:00') ? 1 : h < hOf('Tue', '19:30') ? 2 : h < hOf('Wed', '08:00') ? 1 : 0;
  if (atDress) cpot = Math.abs(h - hOf('Tue', '14:00')) < 0.5 ? 5 : 4;
  if (h >= hOf('Tue', '13:45') && h < hOf('Tue', '16:30')) cpot = Math.max(cpot, 4);
  return {
    h, hr: interp(C.hr, h), map, pp, sbp: map + 2 * pp / 3, dbp: map - pp / 3, temp: interp(C.temp, h), rr: interp(C.rr, h), spo2: interp(C.spo2, h),
    fio2: extub ? null : step(FIO2, h), peep: step(PEEP, h), rrSet: step(RRSET, h), vt: 450, pip, plat: pip - 7, rass: step(RASS, h), cpot,
    propofol: step(PROPOFOL, h), fentanyl: step(FENTANYL, h), norepi: step(NOREPI, h), dexmed: step(DEXMED, h), insulin: step(INSULIN, h), feeds: step(FEEDS, h),
    extub, lr: step(LR, h), alb: step(ALB, h), kvo: step(KVO, h), uop: interp(C.uop, h)
  };
}

// ------------------------------------------------------------------ vitals
const abn = {
  TEMP: v => v >= 100.4 || v <= 96.8, HR: v => v > 100 || v < 55, RR: v => v > 22 || v < 10, SPO2: v => v < 92, SBP: v => v > 180 || v < 90, MAP: v => v < 65
};
function vitalSet(h, opts = {}) {
  const s = state(h), t = H(h), id = k => `vital_${k.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
  const hr = Math.round(s.hr + jit(2)), mapv = Math.round(s.map + jit(1.6)), pp = s.pp + jit(2);
  const sbp = Math.round(mapv + 2 * pp / 3), dbp = Math.round(mapv - pp / 3);
  const temp = round(s.temp + jit(0.1), 1);
  const rr = Math.round(s.rr + jit(1)), spo2 = Math.min(100, Math.round(s.spo2 + jit(0.7)));
  const arterial = h < T_ALINE_OUT;
  const o2 = s.extub ? (h < hOf('Wed', '16:00') ? 'Nasal cannula 4 L/min' : h < hOf('Thu', '03:00') ? 'Nasal cannula 2 L/min' : 'Room air') : 'Ventilator';
  let pain;
  if (!s.extub) pain = `CPOT ${s.cpot}/8`; else { const dress = Math.abs(h - hOf('Wed', '14:00')) < 0.6; pain = `${dress ? 6 : h < hOf('Wed', '20:00') ? 4 : 3}/10`; }
  const v = (code, label, value, units, flag) => ({ id: id(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
  const fl = (name, val) => (abn[name] && abn[name](val) ? (name === 'TEMP' ? (val >= 100.4 ? 'High' : 'Low') : name === 'SPO2' || name === 'MAP' ? 'Low' : val > (name === 'HR' ? 100 : name === 'RR' ? 22 : 180) ? 'High' : 'Low') : '');
  const out = [
    v('TEMP', 'Temperature', `${temp.toFixed(1)} °F`, '', fl('TEMP', temp)),
    v('TEMPSRC', 'Temp Source', h < T_FOLEY_OUT ? 'Bladder/core' : 'Oral'),
    v('HR', 'Heart Rate', hr, 'bpm', fl('HR', hr)),
    v('HRSRC', 'HR Source', 'Telemetry/ECG monitor'),
    v('SPO2HR', 'Pulse Rate from SpO2', hr + (R() < 0.3 ? 1 : 0), 'bpm'),
    v('BP', 'Blood Pressure', `${sbp}/${dbp}`, '', fl('SBP', sbp)),
    v('BPLOC', 'BP Location', arterial ? 'Left radial arterial line' : 'Left arm'),
    v('BPMETH', 'BP Method', arterial ? 'Arterial line' : 'Automatic cuff'),
    v('RR', 'Respiratory Rate', rr, '/min', fl('RR', rr)),
    v('RRSRC', 'RR Source', s.extub ? 'Monitor/capnography' : 'Ventilator'),
    v('SPO2', 'SpO2', spo2, '%', fl('SPO2', spo2)),
    v('O2DEV', 'O2 Device', o2),
    v('PAIN', 'Pain', pain)
  ];
  out.meta = { hr, sbp, dbp, map: mapv, temp, rr, spo2 };
  return out;
}
function buildVitals() {
  const obs = [];
  // ED vitals before the ICU arrival (pre-resuscitation, intubated 02:50)
  const ed = [['02:35', 118, '138/84', 101, 24, 99, 96.8, 'Non-rebreather mask 15 L/min', '8/10'], ['02:50', 122, '128/78', 98, 18, 100, 96.8, 'Ventilator', 'CPOT 5/8'], ['03:05', 116, '116/72', 92, 18, 100, 97.0, 'Ventilator', 'CPOT 6/8'], ['03:20', 114, '110/68', 88, 18, 100, 97.0, 'Ventilator', 'CPOT 5/8'], ['03:40', 112, '106/64', 85, 18, 100, 97.2, 'Ventilator', 'CPOT 3/8'], ['03:55', 110, '104/62', 84, 18, 100, 97.2, 'Ventilator', 'CPOT 2/8']];
  ed.forEach(([tm, hr, bp, m, rr, sp, tf, o2, pain]) => {
    const t = `2026-11-02 ${tm}`, k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`, ext = tm >= '02:50', cuff = tm < '03:55';
    const [sb] = bp.split('/').map(Number);
    const mk = (code, label, value, units, flag) => obs.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf <= 96.8 ? 'Low' : ''); mk('TEMPSRC', 'Temp Source', tm < '02:50' ? 'Temporal' : 'Bladder/core');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : ''); mk('HRSRC', 'HR Source', 'Telemetry/ECG monitor'); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', bp); mk('BPLOC', 'BP Location', 'Left arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 22 ? 'High' : ''); mk('RRSRC', 'RR Source', ext ? 'Ventilator' : 'Monitor/capnography');
    mk('SPO2', 'SpO2', sp, '%'); mk('O2DEV', 'O2 Device', o2); mk('PAIN', 'Pain', pain);
  });
  // hourly through Wed 18:00 (h62), then every 2 h; extra half-hour sets while norepinephrine is being titrated
  const hours = new Set();
  for (let h = 0; h <= 75; h++) if (h <= 62 || h % 2 === 1 || h === 75) hours.add(h);
  for (let h = 35.5; h <= 41; h += 0.5) hours.add(h);
  hours.add(37.25); hours.add(35.5); hours.add(hOf('Wed', '04:30')); hours.add(hOf('Wed', '10:50')); hours.add(hOf('Wed', '11:15'));
  [...hours].sort((a, b) => a - b).forEach(h => obs.push(...vitalSet(h)));
  return obs;
}

// ------------------------------------------------------------------ labs
function lab(category, label, units, reference, lo, hi, entries, o = {}) {
  const dec = o.dec === undefined ? 0 : o.dec, crit = o.crit || [];
  return entries.map(([when, value, extra]) => {
    const t = Array.isArray(when) ? at(when[0], when[1]) : when;
    const v = typeof value === 'number' ? value : parseFloat(value);
    let flag = '';
    if (typeof value === 'number') {
      if (hi !== null && v > hi) flag = 'High'; if (lo !== null && v < lo) flag = 'Low';
      if (crit[0] !== undefined && v < crit[0]) flag = 'Critical Low'; if (crit[1] !== undefined && v > crit[1]) flag = 'Critical High';
    }
    return Object.assign({ id: `lab_${slug(label)}_${t.replace(/[- :]/g, '_')}`, type: 'lab', category, code: o.code || label, label, value: typeof value === 'number' ? v.toFixed(dec) : String(value), units, flag, reference, specimen: o.specimen || 'Blood', status: o.status || 'Final', collected: t }, extra || {});
  });
}
const D = (day, tm) => [day, tm];
function buildLabs() {
  const out = [];
  const add = (...a) => out.push(...a);
  // ---- chemistry (BMP-type draw times)
  const BMP = [['Mon', '02:40'], ['Mon', '06:00'], ['Mon', '12:00'], ['Mon', '18:00'], ['Tue', '00:00'], ['Tue', '06:00'], ['Tue', '12:00'], ['Tue', '17:00'], ['Tue', '23:00'], ['Wed', '05:00'], ['Wed', '17:00'], ['Thu', '04:30']];
  const NA = [[-1.5, 138], [6, 137], [12, 135], [24, 134], [30, 135], [40, 136], [56, 138], [75, 139]], K = [[-1.5, 4.3], [6, 4.8], [12, 5.2], [18, 4.7], [24, 4.0], [30, 3.6], [34, 3.5], [36, 3.8], [48, 4.1], [75, 4.3]],
    CL = [[-1.5, 104], [12, 106], [24, 108], [48, 106], [75, 104]], CO2 = [[-1.5, 19], [4, 21], [12, 22], [24, 24], [36, 23], [40, 20], [48, 22], [75, 26]],
    BUN = [[-1.5, 14], [12, 18], [24, 22], [40, 28], [48, 30], [60, 24], [75, 19]], CR = [[-1.5, 0.9], [12, 1.0], [24, 1.1], [36, 1.1], [40, 1.2], [48, 1.4], [60, 1.2], [75, 1.0]],
    CA = [[-1.5, 8.6], [12, 7.9], [30, 7.6], [48, 7.7], [75, 8.2]], MG = [[-1.5, 2.0], [12, 1.8], [30, 1.6], [36, 1.9], [60, 1.9], [75, 2.0]], PHOS = [[-1.5, 3.4], [12, 2.9], [24, 2.2], [30, 1.9], [36, 2.6], [48, 2.7], [75, 3.1]];
  const at2 = (c, h, d = 0) => round(interp(c, h) + (d ? jit(0.0) : 0), d);
  const mk = (label, units, ref, lo, hi, curve, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, BMP.map(([d, t]) => [D(d, t), at2(curve, hOf(d, t), dec)]), Object.assign({ dec }, o || {})));
  mk('Sodium', 'mmol/L', '136-145', 136, 145, NA, 0, { crit: [120, 160] });
  mk('Potassium', 'mmol/L', '3.5-5.1', 3.5, 5.1, K, 1, { crit: [2.8, 6.2] });
  mk('Chloride', 'mmol/L', '98-107', 98, 107, CL, 0);
  mk('CO2 (bicarbonate)', 'mmol/L', '22-29', 22, 29, CO2, 0);
  add(lab('Chemistry', 'Anion gap', 'mmol/L', '6-16', 6, 16, BMP.map(([d, t]) => { const h = hOf(d, t); return [D(d, t), Math.round(interp(NA, h)) - Math.round(interp(CL, h)) - Math.round(interp(CO2, h))]; })));
  mk('BUN', 'mg/dL', '7-20', 7, 20, BUN, 0);
  mk('Creatinine', 'mg/dL', '0.7-1.3', 0.7, 1.3, CR, 1);
  add(lab('Chemistry', 'Glucose (serum)', 'mg/dL', '70-110', 70, 110, BMP.map(([d, t]) => [D(d, t), Math.round(interp(C.glu, hOf(d, t)))]), { crit: [50, 450] }));
  mk('Calcium', 'mg/dL', '8.6-10.2', 8.6, 10.2, CA, 1);
  mk('Magnesium', 'mg/dL', '1.7-2.4', 1.7, 2.4, MG, 1);
  mk('Phosphorus', 'mg/dL', '2.5-4.5', 2.5, 4.5, PHOS, 1);
  add(lab('Chemistry', 'Ionized calcium', 'mmol/L', '1.12-1.32', 1.12, 1.32, [['Mon', '02:50', 1.12], ['Mon', '12:00', 1.05], ['Tue', '00:00', 1.03], ['Tue', '06:00', 1.02], ['Tue', '17:00', 1.04], ['Wed', '05:00', 1.06], ['Thu', '04:30', 1.12]].map(([d, t, v]) => [D(d, t), v]), { dec: 2 }));
  // liver panel / albumin daily
  const LFT = [['Mon', '02:40'], ['Tue', '05:00'], ['Wed', '05:00'], ['Thu', '04:30']];
  const lf = (label, units, ref, lo, hi, vals, dec) => add(lab('Chemistry', label, units, ref, lo, hi, LFT.map(([d, t], i) => [D(d, t), vals[i]]), { dec }));
  lf('Albumin', 'g/dL', '3.5-5.0', 3.5, 5.0, [3.8, 2.6, 2.0, 2.0], 1); lf('AST', 'U/L', '10-40', 10, 40, [38, 72, 96, 78], 0); lf('ALT', 'U/L', '7-56', 7, 56, [32, 58, 84, 66], 0);
  lf('Alkaline phosphatase', 'U/L', '44-147', 44, 147, [74, 70, 82, 88], 0); lf('Total bilirubin', 'mg/dL', '0.1-1.2', 0.1, 1.2, [0.6, 0.8, 1.3, 1.1], 1);
  lf('Total protein', 'g/dL', '6.0-8.3', 6.0, 8.3, [6.8, 5.1, 4.6, 4.7], 1);
  // ---- CBC
  const CBC = [['Mon', '02:40'], ['Mon', '12:00'], ['Tue', '00:00'], ['Tue', '12:00'], ['Tue', '15:55'], ['Tue', '21:00'], ['Wed', '05:00'], ['Wed', '17:00'], ['Thu', '04:30']];
  const cb = (label, units, ref, lo, hi, vals, dec) => add(lab('CBC', label, units, ref, lo, hi, CBC.map(([d, t], i) => [D(d, t), vals[i]]), { dec, crit: label === 'Platelets' ? [50, 1000] : [] }));
  cb('WBC', 'K/uL', '4.0-11.0', 4.0, 11.0, [12.8, 16.1, 15.2, 15.4, 18.4, 21.8, 19.2, 15.6, 11.2], 1);
  cb('Hemoglobin', 'g/dL', '13.5-17.5', 13.5, 17.5, [17.2, 13.6, 12.4, 11.8, 11.6, 10.9, 10.4, 10.1, 10.0], 1);
  cb('Hematocrit', '%', '41-53', 41, 53, [51.0, 40.9, 37.2, 35.4, 34.8, 32.7, 31.2, 30.3, 30.0], 1);
  cb('Platelets', 'K/uL', '150-400', 150, 400, [288, 246, 214, 196, 171, 142, 128, 154, 186], 0);
  add(lab('CBC', 'Neutrophils (segs)', '%', '40-70', 40, 70, [['Mon', '02:40', 74], ['Tue', '21:00', 68], ['Wed', '05:00', 72]].map(([d, t, v]) => [D(d, t), v])));
  add(lab('CBC', 'Bands', '%', '0-5', 0, 5, [['Mon', '02:40', 3], ['Tue', '21:00', 14], ['Wed', '05:00', 9], ['Wed', '17:00', 4]].map(([d, t, v]) => [D(d, t), v])));
  // ---- coagulation
  const CO = [['Mon', '02:40'], ['Tue', '05:00'], ['Tue', '15:55'], ['Wed', '05:00'], ['Thu', '04:30']];
  const co = (label, units, ref, lo, hi, vals, dec) => add(lab('Coagulation', label, units, ref, lo, hi, CO.map(([d, t], i) => [D(d, t), vals[i]]), { dec }));
  co('PT', 'sec', '11-13.5', 11, 13.5, [12.8, 13.4, 15.2, 14.6, 13.2], 1); co('INR', '', '0.9-1.1', 0.9, 1.1, [1.1, 1.2, 1.4, 1.3, 1.1], 1);
  co('aPTT', 'sec', '25-36', 25, 36, [29, 31, 38, 36, 32], 0); co('Fibrinogen', 'mg/dL', '200-400', 200, 400, [310, 420, 380, 350, 390], 0);
  // ---- blood gases (arterial)
  const ABG = [
    ['Mon', '02:50', 7.29, 38, 412, 18, -7, 86, 14.2], ['Mon', '04:15', 7.34, 40, 288, 21, -4, 94, 6.4], ['Mon', '08:00', 7.38, 40, 172, 23, -1, 97, 3.1], ['Mon', '12:00', 7.39, 39, 134, 24, 0, 98, 3.0],
    ['Mon', '16:00', 7.40, 38, 128, 24, 0, 98, null], ['Mon', '20:00', 7.40, 39, 121, 24, 0, 98, null], ['Tue', '00:00', 7.41, 40, 118, 25, 1, 98, null], ['Tue', '06:00', 7.41, 40, 124, 25, 1, 98, null],
    ['Tue', '14:00', 7.40, 41, 118, 25, 1, 98, null], ['Tue', '18:45', 7.31, 36, 92, 18, -8, 94, null], ['Tue', '22:30', 7.35, 38, 98, 20, -5, 95, null], ['Wed', '04:00', 7.38, 39, 104, 22, -2, 97, null],
    ['Wed', '09:00', 7.40, 40, 96, 24, 0, 97, null], ['Wed', '12:00', 7.39, 41, 88, 24, 0, 96, null]];
  ABG.forEach(([d, t, ph, pc, po, hc, be, sa, coh]) => {
    const e = (label, units, ref, lo, hi, v, dec, crit) => add(lab('Blood Gas', label, units, ref, lo, hi, [[D(d, t), v]], { dec, specimen: 'Arterial blood', crit: crit || [] }));
    e('pH (arterial)', '', '7.35-7.45', 7.35, 7.45, ph, 2, [7.2, 7.6]); e('PaCO2', 'mmHg', '35-45', 35, 45, pc, 0); e('PaO2', 'mmHg', '80-100', 80, 100, po, 0, [55]);
    e('HCO3 (arterial)', 'mmol/L', '22-26', 22, 26, hc, 0); e('Base excess', 'mmol/L', '-2 to +2', -2, 2, be, 0);
    e('O2 saturation (blood gas)', '%', '95-100', 95, 100, sa, 0);
    if (coh !== null) e('Carboxyhemoglobin', '%', '0-3 (nonsmoker); smokers up to 5-10', null, 3, coh, 1, [undefined, 25]);
  });
  // ---- lactate
  const LAC = [['Mon', '02:50', 5.8], ['Mon', '04:15', 3.4], ['Mon', '08:00', 2.2], ['Mon', '12:00', 1.8], ['Mon', '16:00', 1.6], ['Tue', '06:00', 1.4], ['Tue', '15:55', 2.9], ['Tue', '17:00', 3.8], ['Tue', '19:00', 4.1], ['Tue', '22:30', 2.6], ['Wed', '02:00', 1.8], ['Wed', '05:00', 1.5]];
  add(lab('Blood Gas', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, LAC.map(([d, t, v]) => [D(d, t), v]), { dec: 1, specimen: 'Arterial blood', crit: [undefined, 4.0] }));
  // ---- cardiac, muscle, other
  add(lab('Cardiac', 'Troponin I', 'ng/mL', '<0.04', null, 0.04, [['Mon', '02:50', 0.02], ['Mon', '08:50', 0.02]].map(([d, t, v]) => [D(d, t), v]), { dec: 2 }));
  add(lab('Chemistry', 'CK (total)', 'U/L', '39-308', 39, 308, [['Mon', '02:50', 480], ['Mon', '12:00', 1120], ['Tue', '00:00', 840], ['Tue', '12:00', 410]].map(([d, t, v]) => [D(d, t), v])));
  add(lab('Toxicology', 'Ethanol', 'mg/dL', '<10', null, 10, [[D('Mon', '02:40'), 42]]));
  add(lab('Toxicology', 'Urine drug screen', '', 'Negative', null, null, [[D('Mon', '02:55'), 'Negative']], { specimen: 'Urine' }));
  add(lab('Chemistry', 'Prealbumin', 'mg/dL', '18-38', 18, 38, [[D('Tue', '06:00'), 7.1]], { dec: 1 }));
  add(lab('Chemistry', 'Triglycerides', 'mg/dL', '<150', null, 150, [[D('Tue', '06:00'), 168]]));
  add(lab('Inflammatory', 'Procalcitonin', 'ng/mL', '<0.10', null, 0.10, [['Tue', '15:55', 4.8], ['Wed', '04:00', 9.6], ['Wed', '16:00', 6.1], ['Thu', '04:30', 2.1]].map(([d, t, v]) => [D(d, t), v]), { dec: 1 }));
  add(lab('Chemistry', 'Vancomycin level (pre-dose)', 'mcg/mL', 'Goal AUC 400-600', null, null, [[D('Wed', '04:15'), 11.6]], { dec: 1 }));
  add(lab('Transfusion', 'Type and screen', '', '', null, null, [[D('Mon', '02:40'), 'O positive, antibody screen negative']]));
  // ---- urinalysis
  add(lab('Urinalysis', 'UA appearance', '', 'Clear/yellow', null, null, [[D('Mon', '02:55'), 'Dark amber, clear']], { specimen: 'Urine' }));
  add(lab('Urinalysis', 'UA specific gravity', '', '1.005-1.030', 1.005, 1.030, [[D('Mon', '02:55'), 1.031]], { specimen: 'Urine', dec: 3 }));
  add(lab('Urinalysis', 'UA blood', '', 'Negative', null, null, [[D('Mon', '02:55'), 'Trace']], { specimen: 'Urine' }));
  add(lab('Urinalysis', 'UA protein', 'mg/dL', 'Negative', null, null, [[D('Mon', '02:55'), '30']], { specimen: 'Urine' }));
  add(lab('Urinalysis', 'UA myoglobin', '', 'Negative', null, null, [[D('Mon', '02:55'), 'Negative']], { specimen: 'Urine' }));
  // ---- point-of-care glucose: q6h, hourly while on the insulin infusion (Tue 00:30 - Wed 12:00)
  const poc = [], pt = [];
  [['Mon', '04:00'], ['Mon', '10:00'], ['Mon', '16:00'], ['Mon', '22:00']].forEach(x => pt.push(x));
  for (let h = hOf('Tue', '00:30'); h <= hOf('Wed', '12:00'); h += 1) { const t = H(h); pt.push([L2day(t), t.slice(11, 16)]); }
  [['Wed', '18:00'], ['Thu', '00:00'], ['Thu', '06:00']].forEach(x => pt.push(x));
  pt.forEach(([d, t]) => { const h = hOf(d, t); poc.push([D(d, t), Math.round(interp(C.glu, h) + jit(6))]); });
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-110', 70, 110, poc, { specimen: 'Capillary/arterial blood', crit: [50, 400] }));
  // ---- microbiology (collected Tue 15:50; results released later with availableAt)
  const micro = (label, collected, value, status, availableAt, specimen) => ({ id: `lab_${slug(label)}_${slug(value).slice(0, 18)}_${(availableAt || collected).replace(/[- :]/g, '_')}`, type: 'lab', category: 'Microbiology', code: label, label, value, units: '', flag: /pending|in process/i.test(status) ? '' : (/no growth|normal flora|negative/i.test(value) ? '' : 'Abnormal'), reference: '', specimen, status, collected, availableAt });
  const T0 = at('Tue', '15:50');
  add([
    micro('Wound culture (right arm and chest)', T0, 'Collected, in process', 'In process', T0, 'Wound swab, right arm and chest eschar edge'),
    micro('Wound Gram stain', T0, 'Many WBC. Moderate Gram-positive cocci in clusters.', 'Preliminary', at('Tue', '21:30'), 'Wound swab'),
    micro('Wound culture (right arm and chest)', T0, 'Heavy growth Staphylococcus aureus (MSSA). Susceptible: cefazolin, nafcillin, clindamycin, TMP-SMX. Resistant: penicillin.', 'Final', at('Thu', '06:00'), 'Wound swab, right arm and chest eschar edge'),
    micro('Blood culture set 1 (peripheral)', T0, 'Collected, in process', 'In process', T0, 'Blood, peripheral venipuncture (left hand)'),
    micro('Blood culture set 2 (central line)', T0, 'Collected, in process', 'In process', T0, 'Blood, left IJ central line'),
    micro('Blood culture set 2 (central line)', T0, 'Bottle 1 of 4 positive at 10 hours: Gram-positive cocci in clusters. CRITICAL RESULT called to RN.', 'Critical, preliminary', at('Wed', '02:40'), 'Blood, left IJ central line'),
    micro('Blood cultures (4 bottles)', T0, 'Staphylococcus aureus (MSSA) in 2 of 4 bottles (one peripheral, one central line).', 'Preliminary', at('Wed', '15:00'), 'Blood'),
    micro('Tracheal aspirate culture', T0, 'Collected, in process', 'In process', T0, 'Tracheal aspirate'),
    micro('Tracheal aspirate culture', T0, 'Normal respiratory flora. Few WBC.', 'Final', at('Wed', '15:00'), 'Tracheal aspirate'),
    micro('Urine culture (Foley)', T0, 'Collected, in process', 'In process', T0, 'Urine from Foley sampling port'),
    micro('Urine culture (Foley)', T0, 'No growth at 24 hours.', 'Preliminary', at('Wed', '16:00'), 'Urine'),
    micro('Repeat blood cultures', at('Wed', '16:00'), 'Collected, no growth to date', 'In process', at('Wed', '16:00'), 'Blood, peripheral + central line'),
    micro('Repeat blood cultures', at('Wed', '16:00'), 'No growth at 24 hours.', 'Preliminary', at('Thu', '04:30'), 'Blood')
  ]);
  // lab entries in 'out' that are arrays
  return out.flat();
}
function L2day(t) { const d = Number(t.slice(8, 10)); return { 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu' }[d - 0] || 'Mon'; }

// ------------------------------------------------------------------ intake and output (hourly blocks ending on the hour)
function lerpRate(pts, a, b) {    // mL given between hours a and b for a step-function rate
  let tot = 0, n = 60;
  for (let i = 0; i < n; i++) { const t = a + (b - a) * (i + 0.5) / n; tot += step(pts, t) * (b - a) / n; }
  return tot;
}
const IVPB = [   // [startH, durationH, mL total]
  [hOf('Mon', '04:30'), 1, 100],                // cefazolin? no: ED tetanus etc. placeholder small bags handled via carrier
  [hOf('Tue', '16:30'), 4, 100], [hOf('Tue', '16:45'), 2, 500], [hOf('Wed', '04:30'), 2, 250], [hOf('Wed', '13:00'), 4, 100], [hOf('Wed', '12:30'), 2, 250], [hOf('Wed', '21:00'), 4, 100], [hOf('Thu', '04:30'), 4, 100]
];
function ivpbIn(a, b) {
  let tot = 0;
  IVPB.forEach(([s, d, ml]) => { const lo = Math.max(a, s), hi = Math.min(b, s + d); if (hi > lo) tot += ml * (hi - lo) / d; });
  return tot;
}
function boluses(a, b) {      // LR 500 mL boluses at Tue 17:00 (over 30 min) and 17:45 (over 30 min)
  let tot = 0;
  [[hOf('Tue', '17:00'), 0.5, 500], [hOf('Tue', '17:45'), 0.5, 500]].forEach(([s, d, ml]) => { const lo = Math.max(a, s), hi = Math.min(b, s + d); if (hi > lo) tot += ml * (hi - lo) / d; });
  return tot;
}
function buildIO() {
  const out = [];
  // before the ICU: EMS 500 mL LR and ED crystalloid 675 mL (02:30-04:00 at 450 mL/h) plus ED IV meds
  out.push({ id: 'io_2026_11_02_0359', date: '2026-11-02', time: '0230-0400', collected: '2026-11-02 03:59', intake: 1275, output: 195, detail: { po: 0, iv: 1275, urine: 45, other: 150, otherLabel: 'Blood loss (escharotomy)' }, ioType: 'ED / EMS' });
  const last = 73;                 // Foley out Thu 05:00 (h73); the last block is 05:00-07:00
  for (let h = 0; h < 75; h += (h >= last ? 2 : 1)) {
    const a = h, b = h >= last ? 75 : h + 1;
    const s = state(h + 0.5);
    const mid = (a + b) / 2;
    const lr = lerpRate(LR, a, b), alb = lerpRate(ALB, a, b), kvo = lerpRate(KVO, a, b);
    const bol = boluses(a, b), pb = ivpbIn(a, b);
    const prop = lerpRate(PROPOFOL.map(([t, v]) => [t, v * KG * 60 / 10000]), a, b), fent = lerpRate(FENTANYL.map(([t, v]) => [t, v / 10]), a, b);
    const nor = lerpRate(NOREPI.map(([t, v]) => [t, v * KG * 60 / 16]), a, b), dex = lerpRate(DEXMED.map(([t, v]) => [t, v * KG / 4]), a, b), ins = lerpRate(INSULIN, a, b);
    const feed = lerpRate(FEEDS, a, b), flush = (Math.floor(b / 4) - Math.floor(a / 4) > 0 && h < hOf('Wed', '11:15') ? 30 : 0);
    const iv = Math.round(lr + alb + kvo + bol + pb + prop + fent + nor + dex + ins + 12);   // 12 mL/h carrier and flushes
    const feedMl = Math.round(feed + flush);
    const po = h >= hOf('Wed', '18:00') ? (b <= hOf('Wed', '20:00') ? 240 : (b > hOf('Wed', '20:00') && a < hOf('Thu', '06:00') && (a % 6 === 0) ? 120 : 0)) : 0;
    let urine = Math.round((h >= last ? 2 : 1) * interp(C.uop, mid) + jit(1.5));
    if (a === 9) urine = 28;      // Mon 13:00-14:00: second hour in a row under 30 mL/h, so the 14:00 rate increase follows the order
    const stool = (a <= hOf('Wed', '02:00') && b > hOf('Wed', '02:00')) ? 220 : 0;
    const intake = iv + feedMl + po, output = urine + stool;
    const t1 = H(a), t2 = H(b);
    out.push({ id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time: `${t1.slice(11, 13)}${t1.slice(14, 16)}-${t2.slice(11, 13)}${t2.slice(14, 16)}`, collected: t2, intake, output,
      detail: { po, iv, urine, other: stool, otherLabel: 'Stool', intakeOther: feedMl, intakeOtherLabel: 'Tube feeding' }, lr: Math.round(lr + bol), uopMlKgHr: round(urine / (b - a) / KG, 2) });
  }
  return out;
}

module.exports = { KG, state, buildVitals, buildLabs, buildIO, vitalSet, C, FIO2, PEEP, RRSET, RASS, PROPOFOL, FENTANYL, NOREPI, DEXMED, INSULIN, FEEDS, LR, ALB, rassAt, T_EXTUBATE, T_FOLEY_OUT, T_ALINE_OUT, T_NOREPI_ON, T_NOREPI_OFF, T_SAT1, T_PROP_OFF };

if (require.main === module) {
  const v = buildVitals(), l = buildLabs(), io = buildIO();
  console.log('vital obs', v.length, 'labs', l.length, 'io', io.length);
  const sumTo = hEnd => io.filter(e => hOf(e.date.slice(0, 0) || 'Mon', '00:00') !== null).length;
  let cum = 500 + 675; io.slice(1).forEach(e => { const hh = (Date.parse(e.collected.replace(' ', 'T') + ':00Z') - Date.UTC(2026, 10, 2, 4, 0)) / 3600000; if (hh <= 5.5 + 0) cum += e.lr; });
  const first8 = 500 + 675 + io.slice(1).filter(e => e.collected <= '2026-11-02 09:00').reduce((s, e) => s + e.lr, 0) + lerpRate(LR, 5, 5.5);
  const upTo = io.slice(1).filter(e => e.collected <= '2026-11-03 01:00').reduce((s, e) => s + e.lr, 0) + lerpRate(LR, 21, 21.5);
  console.log('LR first 8h from injury ~', Math.round(first8), '(goal 3608); LR to 01:30 Tue ~', Math.round(500 + 675 + upTo), '(Parkland 7216)');
  console.log('sample hr', [0, 12, 24, 36, 39.5, 48, 60, 75].map(h => `${H(h).slice(5)} HR ${state(h).hr | 0} MAP ${state(h).map | 0} T ${state(h).temp.toFixed(1)}`).join(' | '));
  const uo = io.slice(1, 6).map(e => `${e.time}: in ${e.intake} out ${e.output} (LR ${e.lr})`); console.log(uo.join('\n'));
  const tot = io.reduce((a, e) => [a[0] + e.intake, a[1] + e.output], [0, 0]); console.log('total in/out', tot);
}

/* Hip fracture patient: vital signs, labs, intake and output.  See ../DESIGN.md. */
const { H, at, slug } = require('./lib');
const T = (d, t) => at(d, t);

// [day, time, temp F, HR, SBP, DBP, RR, SpO2, O2 device, pain 0-10]
const RA = 'Room air', NC2 = 'Nasal cannula 2 L/min';
const SETS = [
  ['Sat', '22:15', 98.4, 98, 158, 88, 18, 95, RA, 8], ['Sat', '23:30', 98.4, 96, 150, 84, 18, 96, RA, 7],
  ['Sun', '03:00', 98.2, 82, 142, 80, 16, 96, RA, 5], ['Sun', '07:00', 98.3, 80, 138, 78, 16, 96, RA, 4], ['Sun', '11:00', 98.4, 78, 142, 80, 16, 96, RA, 4], ['Sun', '13:45', 98.4, 80, 140, 78, 16, 96, RA, 5],
  ['Sun', '16:30', 97.6, 112, 86, 48, 20, 92, 'Nasal cannula 4 L/min', 3], ['Sun', '17:00', 97.8, 108, 92, 52, 20, 93, 'Nasal cannula 3 L/min', 3], ['Sun', '17:45', 97.9, 104, 98, 56, 20, 94, 'Nasal cannula 3 L/min', 4],
  ['Sun', '18:30', 97.8, 102, 100, 58, 20, 93, NC2, 5], ['Sun', '19:30', 97.9, 100, 102, 60, 20, 94, NC2, 5], ['Sun', '19:45', 98.0, 99, 104, 60, 20, 94, NC2, 5], ['Sun', '21:00', 98.2, 96, 108, 62, 19, 94, NC2, 5], ['Sun', '23:00', 98.4, 92, 112, 64, 18, 94, NC2, 4],
  ['Mon', '03:00', 98.2, 90, 114, 64, 18, 94, NC2, 4], ['Mon', '07:00', 98.4, 88, 116, 66, 18, 95, NC2, 4], ['Mon', '11:00', 98.6, 90, 118, 68, 18, 94, NC2, 5], ['Mon', '15:00', 98.7, 88, 120, 68, 17, 95, NC2, 4], ['Mon', '19:00', 98.6, 86, 122, 68, 17, 95, NC2, 4], ['Mon', '23:00', 98.4, 84, 120, 66, 17, 95, NC2, 4],
  ['Tue', '03:00', 98.4, 86, 118, 66, 17, 95, NC2, 4],
  // ---- simulation starts Tue 07:00
  ['Tue', '07:00', 98.6, 88, 118, 66, 17, 95, NC2, 4], ['Tue', '09:00', 98.6, 86, 120, 68, 17, 95, NC2, 6], ['Tue', '11:00', 98.7, 84, 122, 68, 17, 95, NC2, 4], ['Tue', '13:00', 98.8, 84, 122, 70, 17, 95, NC2, 4],
  ['Tue', '14:00', 98.9, 86, 124, 68, 17, 94, RA, 3], ['Tue', '15:00', 99.3, 88, 122, 68, 18, 94, RA, 4], ['Tue', '17:00', 99.4, 90, 120, 68, 18, 94, RA, 4], ['Tue', '18:00', 99.6, 92, 118, 66, 18, 94, RA, 4],
  ['Tue', '19:00', 99.8, 92, 118, 66, 18, 94, RA, 4], ['Tue', '20:00', 100.1, 94, 116, 64, 19, 94, RA, 5], ['Tue', '21:00', 100.8, 102, 112, 62, 20, 93, RA, 5], ['Tue', '21:30', 100.9, 104, 112, 60, 20, 93, RA, 5],
  ['Tue', '22:00', 100.9, 106, 110, 60, 21, 93, RA, 5], ['Tue', '22:30', 100.6, 102, 112, 62, 20, 94, RA, 4], ['Tue', '23:00', 100.4, 100, 114, 62, 20, 94, RA, 4],
  ['Wed', '00:00', 100.2, 98, 116, 64, 19, 94, RA, 4], ['Wed', '01:00', 99.9, 94, 118, 64, 18, 95, RA, 3], ['Wed', '02:00', 99.6, 92, 120, 66, 18, 95, RA, 3], ['Wed', '03:00', 99.4, 90, 122, 66, 18, 95, RA, 3],
  ['Wed', '05:00', 99.1, 86, 126, 68, 18, 96, RA, 3], ['Wed', '06:00', 98.9, 82, 128, 70, 17, 96, RA, 3], ['Wed', '07:00', 98.8, 82, 128, 70, 17, 96, RA, 3],
  ['Wed', '09:00', 98.7, 80, 134, 74, 17, 96, RA, 4], ['Wed', '11:00', 98.6, 78, 132, 72, 16, 96, RA, 3], ['Wed', '13:00', 98.6, 78, 130, 72, 16, 96, RA, 3], ['Wed', '14:00', 98.6, 76, 130, 70, 16, 96, RA, 3]
];
function buildVitals() {
  const out = [];
  SETS.forEach(([d, tm, tf, hr, sb, db, rr, sp, o2, pain]) => {
    const t = T(d, tm), k = c => `vital_${c.toLowerCase()}_${t.replace(/[- :]/g, '_')}`;
    const mk = (code, label, value, units, flag) => out.push({ id: k(code), type: 'vital', code, label, value: String(value), units: units || '', flag: flag || '', collected: t });
    const tele = !(d === 'Wed' && tm >= '07:00');
    mk('TEMP', 'Temperature', `${tf.toFixed(1)} °F`, '', tf >= 100.4 ? 'High' : ''); mk('TEMPSRC', 'Temp Source', 'Oral');
    mk('HR', 'Heart Rate', hr, 'bpm', hr > 100 ? 'High' : ''); mk('HRSRC', 'HR Source', tele ? 'Telemetry/ECG monitor' : 'Pulse oximeter'); mk('SPO2HR', 'Pulse Rate from SpO2', hr, 'bpm');
    mk('BP', 'Blood Pressure', `${sb}/${db}`, '', sb < 90 ? 'Low' : sb > 180 ? 'High' : ''); mk('BPLOC', 'BP Location', 'Left arm'); mk('BPMETH', 'BP Method', 'Automatic cuff');
    mk('RR', 'Respiratory Rate', rr, '/min', rr > 22 ? 'High' : ''); mk('RRSRC', 'RR Source', 'Counted manually');
    mk('SPO2', 'SpO2', sp, '%', sp < 92 ? 'Low' : ''); mk('O2DEV', 'O2 Device', o2); mk('PAIN', 'Pain', `${pain}/10`);
  });
  return out;
}

function lab(category, label, units, reference, lo, hi, entries, o = {}) {
  const dec = o.dec || 0, crit = o.crit || [];
  return entries.map(([when, value]) => {
    const t = Array.isArray(when) ? at(when[0], when[1]) : when;
    const v = typeof value === 'number' ? value : NaN; let flag = '';
    if (!isNaN(v)) { if (hi !== null && v > hi) flag = 'High'; if (lo !== null && v < lo) flag = 'Low'; if (crit[0] !== undefined && v < crit[0]) flag = 'Critical Low'; if (crit[1] !== undefined && v > crit[1]) flag = 'Critical High'; }
    return { id: `lab_${slug(label)}_${t.replace(/[- :]/g, '_')}`, type: 'lab', category, code: label, label, value: isNaN(v) ? String(value) : v.toFixed(dec), units, flag, reference, specimen: o.specimen || 'Blood', status: o.status || 'Final', collected: t };
  });
}
const D = (d, t) => [d, t];
function buildLabs() {
  const out = [], add = a => out.push(...a);
  const CB = [['Sat', '22:30'], ['Sun', '06:00'], ['Sun', '16:30'], ['Sun', '23:30'], ['Mon', '05:30'], ['Tue', '05:00'], ['Tue', '21:45'], ['Wed', '05:00']];
  const cb = (label, units, ref, lo, hi, vals, dec, o) => add(lab('CBC', label, units, ref, lo, hi, CB.map((w, i) => [w, vals[i]]).filter(x => x[1] !== null), Object.assign({ dec }, o || {})));
  cb('WBC', 'K/uL', '4.0-11.0', 4.0, 11.0, [8.4, 8.8, 11.0, 10.6, 10.2, 11.2, 14.6, 12.1], 1);
  cb('Hemoglobin', 'g/dL', '12.0-16.0', 12.0, 16.0, [11.8, 11.4, 7.9, 9.4, 9.2, 9.0, 9.0, 9.3], 1, { crit: [7.0] });
  cb('Hematocrit', '%', '36-46', 36, 46, [35.4, 34.2, 23.7, 28.2, 27.6, 27.0, 27.0, 27.9], 1);
  cb('Platelets', 'K/uL', '150-400', 150, 400, [232, 220, 190, 188, 182, 176, 172, 181], 0);
  const BM = [['Sat', '22:30'], ['Sun', '06:00'], ['Mon', '05:30'], ['Tue', '05:00'], ['Tue', '21:45'], ['Wed', '05:00']];
  const bm = (label, units, ref, lo, hi, vals, dec, o) => add(lab('Chemistry', label, units, ref, lo, hi, BM.map((w, i) => [w, vals[i]]), Object.assign({ dec }, o || {})));
  bm('Sodium', 'mmol/L', '136-145', 136, 145, [138, 139, 136, 137, 137, 138], 0); bm('Potassium', 'mmol/L', '3.5-5.1', 3.5, 5.1, [4.2, 4.0, 4.2, 4.1, 4.0, 4.1], 1);
  bm('Chloride', 'mmol/L', '98-107', 98, 107, [103, 104, 102, 102, 101, 102], 0); bm('CO2 (bicarbonate)', 'mmol/L', '22-29', 22, 29, [25, 26, 24, 25, 24, 25], 0);
  bm('BUN', 'mg/dL', '7-20', 7, 20, [22, 20, 24, 26, 27, 25], 0); bm('Creatinine', 'mg/dL', '0.6-1.1', 0.6, 1.1, [1.2, 1.1, 1.3, 1.3, 1.3, 1.2], 1);
  bm('Glucose (serum)', 'mg/dL', '70-110', 70, 110, [168, 142, 160, 154, 188, 163], 0, { crit: [50, 450] }); bm('Calcium', 'mg/dL', '8.6-10.2', 8.6, 10.2, [9.0, 8.8, 8.3, 8.4, 8.4, 8.5], 1);
  add(lab('Chemistry', 'Magnesium', 'mg/dL', '1.7-2.4', 1.7, 2.4, [[D('Mon', '05:30'), 1.8], [D('Tue', '05:00'), 1.9]], { dec: 1 }));
  add(lab('Chemistry', 'eGFR', 'mL/min/1.73m2', '>60', 60, null, [[D('Sat', '22:30'), 46], [D('Mon', '05:30'), 40], [D('Tue', '05:00'), 40], [D('Wed', '05:00'), 44]]));
  add(lab('Coagulation', 'INR', '', '0.9-1.1', 0.9, 1.1, [[D('Sat', '22:30'), 1.0], [D('Sun', '06:00'), 1.0]], { dec: 1 }));
  add(lab('Cardiac', 'Troponin I', 'ng/mL', '<0.04', null, 0.04, [[D('Sat', '22:30'), 0.01]], { dec: 2 }));
  add(lab('Chemistry', 'Hemoglobin A1c', '%', '<5.7', null, 5.7, [[D('Sun', '06:00'), 7.2]], { dec: 1 }));
  add(lab('Chemistry', 'Vitamin D, 25-hydroxy', 'ng/mL', '30-100', 30, 100, [[D('Sun', '06:00'), 22]]));
  add(lab('Chemistry', 'TSH', 'mIU/L', '0.4-4.0', 0.4, 4.0, [[D('Sun', '06:00'), 2.1]], { dec: 1 }));
  add(lab('Chemistry', 'Lactate', 'mmol/L', '0.5-2.0', 0.5, 2.0, [[D('Tue', '21:45'), 1.5]], { dec: 1 }));
  add(lab('Transfusion', 'Type and screen', '', '', null, null, [[D('Sat', '22:30'), 'A positive, antibody screen negative']]));
  // POC glucose before meals and at bedtime
  const poc = [['Mon', '07:30', 156], ['Mon', '11:30', 172], ['Mon', '16:30', 148], ['Mon', '21:00', 176], ['Tue', '07:30', 142], ['Tue', '11:30', 138], ['Tue', '16:30', 154], ['Tue', '21:00', 188], ['Wed', '07:30', 168], ['Wed', '11:30', 152]];
  add(lab('Bedside Testing', 'Glucose (point of care)', 'mg/dL', '70-110', 70, 110, poc.map(([d, t, v]) => [D(d, t), v]), { specimen: 'Capillary blood', crit: [50, 400] }));
  // urinalysis: negative baseline from the new catheter on arrival, positive on Tuesday night (the result is filed when it came back)
  const ua = (label, units, ref, lo, hi, base, late) => { add(lab('Urinalysis', label, units, ref, lo, hi, [[D('Sat', '23:40'), base]], { specimen: 'Urine (catheter)', dec: label === 'UA specific gravity' ? 3 : 0 })); add(lab('Urinalysis', label, units, ref, lo, hi, [[D('Tue', '22:30'), late]], { specimen: 'Urine (catheter sampling port; collected 2145)', dec: label === 'UA specific gravity' ? 3 : 0 })); };
  ua('UA appearance', '', 'Clear/yellow', null, null, 'Clear, yellow', 'Cloudy, dark yellow');
  ua('UA specific gravity', '', '1.005-1.030', 1.005, 1.030, 1.016, 1.018);
  ua('UA leukocyte esterase', '', 'Negative', null, null, 'Negative', 'Large');
  ua('UA nitrite', '', 'Negative', null, null, 'Negative', 'Positive');
  ua('UA blood', '', 'Negative', null, null, 'Trace', 'Small');
  ua('UA WBC', '/hpf', '0-5', null, null, '0-2', 'Greater than 50');
  ua('UA RBC', '/hpf', '0-2', null, null, '0-2', '5-10');
  ua('UA bacteria', '', 'None', null, null, 'None', 'Many');
  out.filter(l => l.category === 'Urinalysis' && l.collected === at('Tue', '22:30')).forEach(l => { l.flag = /Large|Positive|Many|Cloudy|Greater|5-10|Small/.test(l.value) ? 'Abnormal' : ''; });
  // microbiology: filed under the time each result was available
  const micro = (label, collected, value, status, t, specimen) => ({ id: `lab_${slug(label)}_${slug(value).slice(0, 18)}_${t.replace(/[- :]/g, '_')}`, type: 'lab', category: 'Microbiology', code: label, label, value, units: '', flag: /Gram-negative/.test(value) ? 'Abnormal' : '', reference: '', specimen: `${specimen} (collected ${collected.slice(11)})`, status, collected: t, availableAt: t });
  const C0 = T('Tue', '21:45');
  out.push(micro('Urine culture (catheter sampling port)', C0, 'Collected, in process', 'In process', C0, 'Urine'),
    micro('Urine culture (catheter sampling port)', C0, 'Gram-negative rods, more than 100,000 CFU/mL. Identification and susceptibilities to follow.', 'Preliminary', T('Wed', '09:30'), 'Urine'),
    micro('Blood cultures x2 (peripheral)', T('Tue', '21:50'), 'Collected, in process', 'In process', T('Tue', '21:50'), 'Blood'),
    micro('Blood cultures x2 (peripheral)', T('Tue', '21:50'), 'No growth to date (about 10 hours).', 'Preliminary', T('Wed', '08:00'), 'Blood'));
  return out;
}

// intake and output in 4-hour blocks ending 0300/0700/1100/1500/1900/2300 (history blocks are visible from the start)
function buildIO() {
  const B = [
    ['Mon', '07:00', 520, 320, { po: 520, iv: 0 }], ['Mon', '11:00', 580, 300, { po: 480, iv: 100 }], ['Mon', '15:00', 640, 260, { po: 440, iv: 200 }], ['Mon', '19:00', 600, 280, { po: 400, iv: 200 }], ['Mon', '23:00', 500, 240, { po: 200, iv: 300 }],
    ['Tue', '03:00', 380, 230, { po: 80, iv: 300 }], ['Tue', '07:00', 380, 260, { po: 80, iv: 300 }],
    ['Tue', '11:00', 640, 250, { po: 490, iv: 150 }], ['Tue', '15:00', 560, 240, { po: 560, iv: 0 }], ['Tue', '19:00', 480, 220, { po: 480, iv: 0 }], ['Tue', '23:00', 520, 200, { po: 520, iv: 0 }],
    ['Wed', '03:00', 450, 220, { po: 450, iv: 0 }], ['Wed', '07:00', 380, 260, { po: 380, iv: 0 }], ['Wed', '11:00', 520, 300, { po: 520, iv: 0 }], ['Wed', '14:30', 380, 250, { po: 380, iv: 0 }]
  ];
  return B.map(([d, t, i, o, det]) => {
    const t2 = at(d, t), h2 = +t.slice(0, 2), s = d === 'Wed' && t === '14:30' ? '1100' : String((h2 + 20) % 24).padStart(2, '0') + '00';
    const foley = !(d === 'Wed') && !(d === 'Tue' && t === '23:00');
    const detail = { po: det.po, iv: det.iv, urine: o, other: 0, otherLabel: '' };
    return { id: `io_${t2.replace(/[- :]/g, '_')}`, date: t2.slice(0, 10), time: `${s}-${t.replace(':', '')}`, collected: t2, intake: i, output: o, detail, note: foley ? 'Foley' : 'Voided' };
  });
}
module.exports = { buildVitals, buildLabs, buildIO, SETS };
if (require.main === module) { console.log('vital obs', buildVitals().length, 'labs', buildLabs().length, 'io', buildIO().length); }

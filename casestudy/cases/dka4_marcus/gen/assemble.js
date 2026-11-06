/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at, HOURS, hOfStamp } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess'), I = require('./infusions');
const dir = path.join(__dirname, '..');
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed:', f, e.message); process.exitCode = 1; } });
// notes may list `imageFiles: [{file, caption, alt}]` (paths relative to gen/); they are embedded here as data URLs in `images` (see gen/ecg/make_ecgs.py)
notes.forEach(n => { if (n.imageFiles) { n.images = (n.images || []).concat(n.imageFiles.map(f => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f.file)).toString('base64'), caption: f.caption, alt: f.alt }))); delete n.imageFiles; } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) { console.error('duplicate or missing note id', n.id); process.exitCode = 1; return false; } seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Thu', '07:00'), END = at('Sun', '07:00');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_dka4_reyes', title: 'Step-down / telemetry: type 1 diabetes in DKA with acute kidney injury on CKD G3b (repaired posterior urethral valves): cautious fluids, potassium that falls on insulin and is replaced one small bag at a time, crackles with low urine output, a low glucose after transition, mild rebound hyperkalemia (3 days, checkpoints at every 0700 and 1900)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Manage an adult DKA protocol (2024 consensus) in a patient with AKI on CKD: small reassessed saline boluses, fixed-rate insulin 0.1 unit/kg/h with no bolus, dextrose and 0.05 unit/kg/h once glucose is under 250, hourly glucose, and the resolution criteria (BHB under 0.6 plus venous pH 7.3 or higher or bicarbonate 18 or higher).',
      'Apply the renal-modified peripheral potassium rule: never more than 10 mEq per hour from all sources, no potassium in the maintenance fluid, hold the insulin for K under 3.5 and replace by individually authorized one-bag riders only when the previous hour of urine is at least 40 mL (0.5 mL/kg/h), restart insulin only at K 3.5 or higher with prescriber confirmation; recognize why phosphate is monitored, not replaced.',
      'Recognize fluid overload and low urine output early (fine crackles, 25 mL/h), count every IV volume, and respond without an automatic bolus or diuretic (D10W 50 mL/h, bladder scan, non-contrast ultrasound).',
      'Carry out the transition with renal insulin-clearance caution (basal 2 hours before the drip stops), prevent and treat the low glucose that follows, recognize mild hyperkalemia with a normal-looking ECG, and teach sick-day insulin, kidney protection (held losartan, no NSAIDs, contrast caution, renal dosing) and teach-back to the patient and partner.'] },
  patient: { id: 'patient_sim_40504', mrn: 'SIM-40504', name: 'Marcus Reyes', preferredName: 'Marcus', dob: '1995-04-18', age: 31, sex: 'Male', pronouns: 'he/him', heightCm: 178, weightKg: 80.0, bmi: 25.2, allergies: [{ substance: 'NKDA', reaction: '', severity: '' }] },
  encounter: { id: 'encounter_sim_40504_2026-11-05', location: 'Step-down / Telemetry', room: 'SD-5', attending: 'I. Morgan, MD (Hospital Medicine, days); R. Voss, MD (nights); D. Lin, MD (Nephrology); G. Tran, MD (Endocrinology)', admitDate: '2026-11-05 02:00', diagnosis: 'Diabetic ketoacidosis (glucose 620, venous pH 7.22, bicarbonate 10, anion gap 25, beta-hydroxybutyrate 7.2) in type 1 diabetes after insulin omission during a presumed viral illness; acute kidney injury (creatinine 3.4, stage 1) on CKD G3b from repaired congenital posterior urethral valves (baseline creatinine about 2.1); potassium 5.8 on arrival', chiefComplaint: 'Three days of sore throat, nausea and vomiting; stopped his insulin when he stopped eating', codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'NPO except medications and measured small water sips / ice chips on arrival (see Orders for changes)', ambulationOrder: 'Assisted bathroom and chair activity on arrival (see Orders)', fallRisk: 'Moderate', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Diabetic ketoacidosis after insulin omission during a presumed viral illness (moderate by pH, severe by bicarbonate and ketones)', status: 'Active', details: 'Glucose 620, venous pH 7.22, bicarbonate 10, anion gap 25, BHB 7.2, creatinine 3.4. Fixed-rate insulin 0.1 unit/kg/h (8 units/h) from 0300, no bolus; small reassessed saline boluses; renal-modified peripheral potassium protocol (10 mEq/h maximum, no potassium in maintenance fluid).' },
    { id: 'problem_t1d', name: 'Type 1 diabetes since age 9; glargine 24 units at 2100 and carbohydrate-based lispro; skipped glargine 11/03 and 11/04 and stopped meal insulin', status: 'Active', details: 'Believed "no food means no insulin". One prior DKA at age 22. Pens and CGM (sensor expired), no pump. HbA1c 8.9%.' },
    { id: 'problem_aki', name: 'Acute kidney injury (stage 1) on CKD G3b from repaired congenital posterior urethral valves (baseline creatinine 2.0-2.2)', status: 'Active', details: 'Creatinine 3.2-3.4 so far. Reduced perfusion from vomiting and osmotic losses. Strict measured I&O; creatinine reviewed before potassium; the automatic eGFR is an estimate, not a measured GFR. Losartan held; no NSAIDs; avoid contrast.' },
    { id: 'problem_htn', name: 'Hypertension with albuminuria (UACR 180 mg/g, A2): losartan 25 mg held', status: 'Active', details: 'Losartan held for AKI and hyperkalemia risk; nephrology decides on restart after the post-discharge BMP.' },
    { id: 'problem_hypok', name: 'Potassium falling on insulin: K 3.4 at 1040 (from 5.8); insulin held, one KCl bag at a time', status: 'Active', details: 'K 5.8, 5.0, 4.7, 4.2, 3.6, 3.4. Mild T-wave flattening on the 1105 ECG. Replacement only by individually authorized KCl 10 mEq/100 mL bags (10 mEq/h maximum) while urine is at least 40 mL/h. Phosphate 2.2 monitored, not replaced.', availableAt: at('Thu', '11:00') },
    { id: 'problem_congestion', name: 'Fine basal crackles and low urine output (25 mL/h from 1200)', status: 'Active', details: 'D5NS changed to D10W 50 mL/h (same dextrose, half the volume); no automatic bolus or diuretic. Bladder scan and non-contrast renal and bladder ultrasound ordered. Hourly urine, lungs and sodium watched.', availableAt: at('Thu', '13:00') },
    { id: 'problem_hypo', name: 'Hypoglycemia 58 at 0645 on Day 2 after transition (reduced renal insulin clearance)', status: 'Active', details: 'Treated with 15 g apple juice (92 at 0700). Glargine reduced to 14 units, meal lispro 2 units after meals, bedtime correction stopped.', availableAt: at('Fri', '07:15') },
    { id: 'problem_hyperk', name: 'Mild hyperkalemia on Day 2 evening: K 5.2 (repeat 5.1), no ECG change, no potassium given since Day 1', status: 'Active', details: 'Limited renal reserve. No potassium products, losartan held, dietary review, telemetry, repeat K.', availableAt: at('Fri', '20:00') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Thursday, November 5, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'DKA series patient 4, generated by casestudy/cases/dka4_marcus/gen/assemble.js', inputs: { name: 'Marcus Reyes', age: 31, sex: 'Male', primary: 'dka', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Marcus Reyes, step-down: DKA with AKI on CKD G3b', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
// guard rails: nothing after the start may be a vital sign; orders never ordered after they start; notes inside the timeline
const late = c.observations.filter(o => o.type === 'vital' && o.collected > START); if (late.length) { console.error('VITALS AFTER 0700:', late.length); process.exitCode = 1; }
const badOrd = c.orders.filter(o => o.orderedAt > o.start); if (badOrd.length) { console.error('orderedAt after start:', badOrd.map(o => o.name)); process.exitCode = 1; }
const badNote = c.notes.filter(n => n.datetime > END); if (badNote.length) { console.error('notes after the end:', badNote.map(n => n.id)); process.exitCode = 1; }
// potassium: no minute with more than 10 mEq/h from all sources
let kmax = 0; for (let m = I.M('Thu', '02:00'); m < I.M('Fri', '07:00'); m++) kmax = Math.max(kmax, I.kPerHour(m)); if (kmax > 10) { console.error('POTASSIUM OVER 10 mEq/h:', kmax); process.exitCode = 1; }
// I&O: shift totals must equal the design (Section 6)
const DESIGN = { 'D1 day': [1368, 450], 'D1 night': [828, 1000], 'D2 day': [1620, 1450], 'D2 night': [620, 850], 'D3 day': [1810, 1700], 'D3 night': [510, 850] };
const shifts = { 'D1 day': ['Thu', '07:00', 'Thu', '19:00'], 'D1 night': ['Thu', '19:00', 'Fri', '07:00'], 'D2 day': ['Fri', '07:00', 'Fri', '19:00'], 'D2 night': ['Fri', '19:00', 'Sat', '07:00'], 'D3 day': ['Sat', '07:00', 'Sat', '19:00'], 'D3 night': ['Sat', '19:00', 'Sun', '07:00'] };
Object.entries(shifts).forEach(([n, [d1, t1, d2, t2]]) => { const a = at(d1, t1), b = at(d2, t2); const s = c.ioEvents.filter(x => x.collected > a && x.collected <= b).reduce((r, x) => [r[0] + x.intake, r[1] + x.output], [0, 0]); if (s[0] !== DESIGN[n][0] || s[1] !== DESIGN[n][1]) { console.error('I&O shift total mismatch', n, s, DESIGN[n]); process.exitCode = 1; } });
const ed = c.ioEvents.find(x => x.collected === START); if (!ed || ed.intake !== 954 || ed.output !== 350) { console.error('ED I&O mismatch', ed && [ed.intake, ed.output]); process.exitCode = 1; }
// anion gap, design gap
P.PANELS.forEach(p => { if (P.ag(p) !== p.AGdesign) { console.error('anion gap mismatch', p.k); process.exitCode = 1; } });
// no subcutaneous heparin or other prophylaxis anywhere (clot-prophylaxis rule: no documented risk factor)
if (c.orders.some(o => /heparin|enoxaparin/i.test(o.name + ' ' + (o.instructions || ''))) || c.administrations.some(a => /heparin|enoxaparin/i.test(a.label || ''))) { console.error('VTE PROPHYLAXIS ORDER FOUND'); process.exitCode = 1; }
// banned out-of-universe words in the chart text
const bad = /faculty|simulation|supplemental|requested|reconciliation for|KDIGO|NIDDK|http|www\.|\.org|\.gov|\.com/i;
[].concat(c.notes.map(n => [n.id, n.title + ' ' + n.summary + ' ' + n.body]), c.orders.map(o => [o.name, o.name + ' ' + o.instructions + ' ' + o.rationale]), c.stickyNotes.map(s => [s.title, s.body])).forEach(([k, t]) => { const m = t.match(bad); if (m) { console.error('BANNED WORD', k, m[0]); process.exitCode = 1; } });
// time-gating check for notes: no clock time later than the note itself (except planned times listed in allowTimes), no lab result quoted before it resulted
c.notes.forEach(n => {
  const own = n.datetime.slice(11, 16).replace(':', '');
  (n.body + ' ' + (n.summary || '')).replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, (m) => { if (m > own && (n.allowTimes || []).indexOf(m) < 0 && !n.anyTimes) console.warn('LATER TIME?', n.id, m); return m; });
});

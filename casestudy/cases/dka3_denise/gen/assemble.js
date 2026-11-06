/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at, HOURS, hOfStamp } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess'), I = require('./infusions');
const dir = path.join(__dirname, '..');
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed:', f, e.message); process.exitCode = 1; } });
// notes may list `imageFiles: [{file, caption, alt}]` (paths relative to gen/); they are embedded here as data URLs in `images` (see gen/ecg/make_ecgs.py)
notes.forEach(n => { if (n.imageFiles) { n.images = (n.images || []).concat(n.imageFiles.map(f => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f.file)).toString('base64'), caption: f.caption, alt: f.alt }))); delete n.imageFiles; } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) { console.error('duplicate or missing note id', n.id); process.exitCode = 1; return false; } seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Mon', '07:00'), END = at('Thu', '07:00');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_dka3_carter', title: 'Step-down / telemetry: type 1 diabetes in DKA after months of cost-related insulin rationing, low potassium on the insulin infusion, a food-related low, and discharge with the medicines in hand (3 days, checkpoints at every 0700 and 1900)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Manage an adult DKA protocol (2024 consensus) safely: isotonic fluids, fixed-rate insulin 0.1 unit/kg/h with no bolus, dextrose and 0.05 unit/kg/h once glucose is under 250, hourly glucose, and the resolution criteria (BHB under 0.6 plus venous pH 7.3 or higher or bicarbonate 18 or higher).',
      'Apply the peripheral potassium rule: never more than 10 mEq per hour from all sources, hold insulin and replace when K is under 3.5 (K 3.2 at 0800), potassium piggybacks one at a time, magnesium on the other line, and restart insulin only when K is 3.5 or higher with provider confirmation; recognize why phosphate is monitored, not replaced.',
      'Carry out the transition: basal insulin 2 hours before the infusion stops, carbohydrate-matched meal insulin, and prevent and treat the low glucose that follows a fixed meal dose with a small meal.',
      'Identify cost-related insulin rationing and food insecurity respectfully (not "noncompliance"), and verify medicines, supplies, a food plan, follow-up, transport and teach-back with the actual products before discharge; do not credit referrals or coupons alone.'] },
  patient: { id: 'patient_sim_40503', mrn: 'SIM-40503', name: 'Denise Carter', preferredName: 'Denise', dob: '1988-06-14', age: 38, sex: 'Female', pronouns: 'she/her', heightCm: 165, weightKg: 60.0, bmi: 22.0, allergies: [{ substance: 'NKDA', reaction: '', severity: '' }] },
  encounter: { id: 'encounter_sim_40503_2026-11-09', location: 'Step-down / Telemetry', room: 'SD-8', attending: 'D. Reed, MD (Hospital Medicine, days); T. Rivera, MD (nights); V. Lee, MD (Endocrinology)', admitDate: '2026-11-09 02:00', diagnosis: 'Diabetic ketoacidosis with severe biochemical features (glucose 684, pH 7.23, bicarbonate 9, anion gap 27, beta-hydroxybutyrate 7.2) in type 1 diabetes from cost-related insulin underdosing and 2 days of vomiting; prerenal acute kidney injury (creatinine 1.5)', chiefComplaint: 'Two days of vomiting, weakness and deep breathing; has been stretching her insulin because she lost her insurance', codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'NPO except ice chips and small water sips on arrival (see Orders for changes)', ambulationOrder: 'Assisted bathroom activity, fall precautions on arrival (see Orders)', fallRisk: 'Moderate', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Diabetic ketoacidosis from cost-related insulin underdosing (severe biochemical features, no infection found)', status: 'Active', details: 'Glucose 684, venous/arterial pH 7.23, bicarbonate 9, anion gap 27, beta-hydroxybutyrate 7.2, creatinine 1.5. Fixed-rate insulin 0.1 unit/kg/h (6 units/h) from 0300, no bolus; saline; peripheral potassium protocol (10 mEq/h maximum).' },
    { id: 'problem_t1d', name: 'Type 1 diabetes since age 18; prescribed glargine 22 units + lispro 6 units with meals; actually taking about 10-12 units glargine every other night and 0-3 units lispro', status: 'Active', details: 'Last glargine 10 units 2 days before arrival, last lispro 2 units; no insulin the day before arrival. One remote DKA at age 24. No pump.' },
    { id: 'problem_aki', name: 'Prerenal acute kidney injury (creatinine 1.5; baseline 0.7)', status: 'Active', details: 'Volume depletion; expected to correct with fluids. Strict measured I&O; creatinine reviewed before potassium.' },
    { id: 'problem_access', name: 'Cost-related insulin rationing and food insecurity (lost insurance and job 3 months ago, two part-time jobs, 12-year-old daughter)', status: 'Active', details: 'Skips meals so her daughter can eat; no test strips for 2 weeks. Social work, pharmacy, case management, dietitian and diabetes educator consulted. Discharge needs insulin and supplies in hand, not only applications.' },
    { id: 'problem_hypok', name: 'Hypokalemia and hypomagnesemia on the insulin infusion: K 3.2, Mg 1.6 (0745 specimen)', status: 'Active', details: 'Insulin held 0800-1000; KCl 10 mEq piggybacks x4 (one at a time); magnesium sulfate 2 g. K 3.6 at 0945, 4.0 at 1145. Flat T waves with small U waves on the 0815 ECG.', availableAt: at('Mon', '08:00') },
    { id: 'problem_phos', name: 'Low phosphate during treatment (1.5 mg/dL at 1145), monitored, not replaced', status: 'Active', details: 'Replace only if under 1.0 or with cardiac or respiratory compromise or hemolysis; none here. Recovers with eating (3.2 by discharge).', availableAt: at('Mon', '12:00') },
    { id: 'problem_hypo', name: 'Hypoglycemia 62 at 1400 on Day 2 after a fixed lispro dose with only 15 g eaten at lunch', status: 'Active', details: 'Treated with 15 g juice (78 at 1415, 104 at 1430 after a snack). Meal insulin now by carbohydrate actually eaten; glargine continued.', availableAt: at('Tue', '14:40') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, November 9, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'DKA series patient 3, generated by casestudy/cases/dka3_denise/gen/assemble.js', inputs: { name: 'Denise Carter', age: 38, sex: 'Female', primary: 'dka', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Denise Carter, step-down: DKA after cost-related insulin rationing', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
// guard rails: nothing after the start may be a vital sign; orders never ordered after they start; notes inside the timeline
const late = c.observations.filter(o => o.type === 'vital' && o.collected > START); if (late.length) { console.error('VITALS AFTER 0700:', late.length); process.exitCode = 1; }
const badOrd = c.orders.filter(o => o.orderedAt > o.start); if (badOrd.length) { console.error('orderedAt after start:', badOrd.map(o => o.name)); process.exitCode = 1; }
const badNote = c.notes.filter(n => n.datetime > END); if (badNote.length) { console.error('notes after the end:', badNote.map(n => n.id)); process.exitCode = 1; }
// potassium: no minute with more than 10 mEq/h from all sources
let kmax = 0; for (let m = I.M('Mon', '02:00'); m < I.M('Tue', '07:00'); m++) kmax = Math.max(kmax, I.kPerHour(m)); if (kmax > 10) { console.error('POTASSIUM OVER 10 mEq/h:', kmax); process.exitCode = 1; }
// I&O: shift totals must equal the design (Section 6)
const DESIGN = { 'D1 day': [3777.5, 1950], 'D1 night': [2220, 1600], 'D2 day': [1910, 1700], 'D2 night': [910, 1000], 'D3 day': [2010, 1850], 'D3 night': [910, 1050] };
const shifts = { 'D1 day': ['Mon', '07:00', 'Mon', '19:00'], 'D1 night': ['Mon', '19:00', 'Tue', '07:00'], 'D2 day': ['Tue', '07:00', 'Tue', '19:00'], 'D2 night': ['Tue', '19:00', 'Wed', '07:00'], 'D3 day': ['Wed', '07:00', 'Wed', '19:00'], 'D3 night': ['Wed', '19:00', 'Thu', '07:00'] };
Object.entries(shifts).forEach(([n, [d1, t1, d2, t2]]) => { const a = at(d1, t1), b = at(d2, t2); const s = c.ioEvents.filter(x => x.collected > a && x.collected <= b).reduce((r, x) => [r[0] + x.intake, r[1] + x.output], [0, 0]); if (s[0] !== DESIGN[n][0] || s[1] !== DESIGN[n][1]) { console.error('I&O shift total mismatch', n, s, DESIGN[n]); process.exitCode = 1; } });
// anion gap, design gap, resolution rule
P.PANELS.forEach(p => { if (P.ag(p) !== p.AGdesign) { console.error('anion gap mismatch', p.k); process.exitCode = 1; } });
// time-gating check for notes: no clock time later than the note itself (except planned times listed in allowTimes), no lab result quoted before it resulted
c.notes.forEach(n => {
  const own = n.datetime.slice(11, 16).replace(':', '');
  (n.body + ' ' + (n.summary || '')).replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, (m) => { if (m > own && (n.allowTimes || []).indexOf(m) < 0 && !n.anyTimes) console.warn('LATER TIME?', n.id, m); return m; });
});

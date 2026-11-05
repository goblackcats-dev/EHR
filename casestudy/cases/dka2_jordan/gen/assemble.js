/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at, HOURS } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');
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
  caseMeta: { caseId: 'case_dka2_ellis', title: 'Intermediate care to medical floor: insulin pump failure after a weekend of drinking, moderate DKA in a young adult with type 1 diabetes (3 days, checkpoints at every 0700 and 1900)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Explain why an insulin pump user (rapid-acting insulin only, no long-acting depot) can go into DKA within hours of an infusion set failure, and recognize DKA hidden behind "a hangover" (vomiting, belly pain, deep fast breathing).',
      'Manage an adult DKA protocol (2024 consensus) safely: isotonic/balanced fluids, fixed-rate insulin 0.1 unit/kg/h, a dextrose line when glucose is under 250, potassium rules with peripheral limits (hold insulin when K is under 3.5), magnesium, and the resolution criteria.',
      'Carry out the transition with basal insulin 1-2 hours before stopping the drip, and the pump restart only after endocrinology and the diabetes educator review; prevent and treat hypoglycemia after the transition.',
      'Teach pump troubleshooting (site checks, the unexplained-high rule: ketones, pen injection, set change), sick-day rules for pump users, backup pens and long-acting insulin, CGM alarms, and safer drinking with type 1 diabetes; screen for alcohol withdrawal and give a brief alcohol intervention.'] },
  patient: { id: 'patient_sim_40502', mrn: 'SIM-40502', name: 'Jordan Ellis', preferredName: 'Jordan', dob: '2002-03-22', age: 24, sex: 'Male', pronouns: 'he/him', heightCm: 180, weightKg: 72.0, bmi: 22.2, allergies: [{ substance: 'Penicillin', reaction: 'Hives (childhood)', severity: 'Moderate' }] },
  encounter: { id: 'encounter_sim_40502_2026-12-14', location: 'Medical Intermediate Care Unit (IMCU)', room: 'IMC-6', attending: 'A. Lindqvist, MD (Hospital Medicine); M. Feld, MD (Endocrinology)', admitDate: '2026-12-14 00:30', diagnosis: 'Moderate diabetic ketoacidosis (pH 7.22, bicarbonate 10, beta-hydroxybutyrate 6.2, anion gap 26) in type 1 diabetes after insulin pump infusion set failure; binge alcohol use; acute kidney injury (creatinine 1.4)', chiefComplaint: 'Vomiting all day, belly pain and fast breathing; insulin pump set pulled out overnight', codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'NPO except ice chips and sips on arrival (see Orders for changes)', ambulationOrder: 'Up to the bathroom with standby assist on arrival (see Orders)', fallRisk: 'Moderate', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Moderate diabetic ketoacidosis after insulin pump infusion set failure', status: 'Active', details: 'pH 7.22, pCO2 24, bicarbonate 10, anion gap 26, beta-hydroxybutyrate 6.2, glucose 572 (0045). Fixed-rate insulin 0.1 unit/kg/h from 0215 (no bolus); lactated Ringer\'s with KCl 20 mEq/L.' },
    { id: 'problem_t1d', name: 'Type 1 diabetes since age 11 on an insulin pump with CGM (HbA1c 7.6%)', status: 'Active', details: 'Pump basal 21.6 units/day, carbohydrate ratio 1:10, correction 1:45 (target 120). No long-acting insulin or working backup pens at home. Pump suspended in the ED.' },
    { id: 'problem_alcohol', name: 'Binge alcohol use (about 10-12 drinks Saturday night); withdrawal screening', status: 'Active', details: 'Ethanol level none detected (last drink about 22 hours before arrival). CIWA-Ar every 4 hours; thiamine given. Alcoholic ketoacidosis overlap considered (glucose 572 and a failed pump make DKA the main cause).' },
    { id: 'problem_aki', name: 'Acute kidney injury from volume loss (creatinine 1.4; baseline 0.9)', status: 'Active', details: 'Expected to correct with fluids. Strict I&O, daily weight.' },
    { id: 'problem_lytes', name: 'Potassium and magnesium shifts on insulin (K 5.4 on arrival; Mg 1.5 at 0630)', status: 'Active', details: 'Peripheral IVs only: KCl 20 mEq/L in fluids, 10 mEq/h riders if K under 3.5 (insulin held). Magnesium sulfate 2 g 0800.', availableAt: at('Mon', '07:40') },
    { id: 'problem_hypok', name: 'Hypokalemia K 3.3 at 1830 Monday: insulin held 1920-2200, KCl riders 40 mEq, ECG flat T waves with U waves', status: 'Active', details: 'K 3.7 at 2130; insulin restarted 2200.', availableAt: at('Mon', '22:30') },
    { id: 'problem_hypo', name: 'Hypoglycemia 64 at 2010 Tuesday after a full dinner dose with half the meal eaten', status: 'Active', details: 'Treated with 15 g juice (92 at 2025). Meal insulin after eating when intake is uncertain.', availableAt: at('Tue', '20:45') },
    { id: 'problem_pump_kink', name: 'Unexplained high glucose on the restarted pump (298, ketones 0.6) from a kinked cannula, Thursday 0010', status: 'Active', details: 'Pen correction, set change by Jordan at a new site; 168 and ketones 0.2 at 0300.', availableAt: at('Thu', '01:15') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, December 14, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'DKA series patient 2, generated by casestudy/cases/dka2_jordan/gen/assemble.js', inputs: { name: 'Jordan Ellis', age: 24, sex: 'Male', primary: 'dka', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Jordan Ellis, IMCU: insulin pump failure and moderate DKA', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
// guard rails: nothing after the start may be a vital sign; orders never ordered after they start; notes inside the timeline
const late = c.observations.filter(o => o.type === 'vital' && o.collected > START); if (late.length) { console.error('VITALS AFTER 0700:', late.length); process.exitCode = 1; }
const badOrd = c.orders.filter(o => o.orderedAt > o.start); if (badOrd.length) { console.error('orderedAt after start:', badOrd.map(o => o.name)); process.exitCode = 1; }
const badNote = c.notes.filter(n => n.datetime > END); if (badNote.length) { console.error('notes after the end:', badNote.map(n => n.id)); process.exitCode = 1; }
// time-gating check for notes: no clock time later than the note itself (except planned times listed in ALLOW), no lab result quoted before it resulted
const labs = c.observations.filter(o => o.type === 'lab');
c.notes.forEach(n => {
  const day = n.datetime.slice(0, 10), own = n.datetime.slice(11, 16).replace(':', '');
  (n.body + ' ' + (n.summary || '')).replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, (m) => { if (m > own && (n.allowTimes || []).indexOf(m) < 0 && !n.anyTimes) console.warn('LATER TIME?', n.id, m); return m; });
});

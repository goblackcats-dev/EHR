/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');
const dir = path.join(__dirname, '..');
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed:', f, e.message); } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) return false; seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Tue', '07:00'), END = at('Wed', '07:00');
const slots = []; for (let i = 0; i < 25; i++) slots.push(H(i).slice(11, 13) + '00');
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_hypermag_kessler', title: 'Telemetry Step-Down: Hypermagnesemia from over-the-counter magnesium with acute kidney injury on CKD 4, emergent hemodialysis (24 hours, seven 4-hour checkpoints)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: ['Recognize the signs of hypermagnesemia by level (nausea, flushing, lethargy, weak then absent reflexes, hypotension, bradycardia, ECG changes, respiratory depression) and who is at risk (kidney failure plus magnesium laxatives, antacids and supplements).', 'Prioritize and act: stop all magnesium sources, protect the airway and the heart, give IV calcium gluconate safely on a cardiac monitor, support urine output, and call the rapid response team and nephrology with SBAR.', 'Explain why emergent hemodialysis is needed when magnesium keeps rising in kidney failure and care for a patient during and after dialysis (hypotension, hypoglycemia, rebound).', 'Take a complete medication history including over-the-counter products and teach safe alternatives for heartburn, constipation, leg cramps and pain in kidney disease.'] },
  patient: { id: 'patient_sim_40318', mrn: 'SIM-40318', name: 'Raymond Kessler', preferredName: 'Ray', dob: '1952-04-22', age: 74, sex: 'Male', pronouns: 'he/him', heightCm: 175, weightKg: 88, bmi: 28.7, allergies: [{ substance: 'Penicillin', reaction: 'Rash (childhood)', severity: 'Mild' }] },
  encounter: { id: 'encounter_sim_40318_2026-11-17', location: 'Telemetry Step-Down Unit 5 East', room: '5E-14', attending: 'D. Okafor, MD (Hospitalist); P. Raman, MD (Nephrology)', admitDate: '2026-11-17 04:15', diagnosis: 'Hypermagnesemia (Mg 7.8 mg/dL) after over-the-counter magnesium products, acute kidney injury on chronic kidney disease stage 4, bradycardia with first-degree AV block, hypotension, dehydration', chiefComplaint: 'Weakness, sleepiness and vomiting for 4 days; hard to wake this morning', codeStatus: 'Full Code', isolation: 'None', dietOrder: 'NPO except ice chips until bedside swallow screen is passed', ambulationOrder: 'Bed rest, up with 2 assist only', fallRisk: 'High', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_hypermag', name: 'Hypermagnesemia (Mg 7.8 mg/dL on arrival; normal 1.7-2.2) from over-the-counter magnesium products', status: 'Active', details: 'Weeks of milk of magnesia, Mg/Al hydroxide antacid and magnesium oxide with poor kidney clearance. Bradycardia, first-degree AV block (PR 248 ms), wide QRS, low BP, weak reflexes.' },
    { id: 'problem_aki_ckd', name: 'Acute kidney injury on chronic kidney disease stage 4 (creatinine 4.9, baseline 2.6)', status: 'Active', details: 'Vomiting and poor intake for 4 days plus lisinopril, furosemide and ibuprofen. Foley for hourly output. Nephrology consulted.' },
    { id: 'problem_brady', name: 'Bradycardia with first-degree AV block, hypotension', status: 'Active', details: 'HR 46-52, BP 82/46 to 96/56 on arrival. Metoprolol and lisinopril held. Pacing pads and atropine are the back-up.' },
    { id: 'problem_dm_hf', name: 'Type 2 diabetes on insulin (A1c 7.8%), heart failure with preserved EF, hypertension, hyperlipidemia', status: 'Active', details: 'Glargine held, renal-sensitive correction scale. Fluid boluses need lung checks (HFpEF).' },
    { id: 'problem_constipation', name: 'Chronic opioid-related constipation (last stool Friday 11/13)', status: 'Active', details: 'Taking magnesium laxatives; unabsorbed magnesium in the bowel can keep the level rising. Bowel regimen without magnesium or phosphate.' },
    { id: 'problem_resp', name: 'Respiratory depression from magnesium toxicity', status: 'Active', details: 'RR 10 with SpO2 91% on room air at 1100, ABG pH 7.24 / PaCO2 46 on 3 L; worse at 1415 (7.20 / 52). Rapid response 1115.', availableAt: at('Tue', '11:15') },
    { id: 'problem_hd', name: 'Emergent hemodialysis for Mg 10.9 with oliguria, HR 38, QRS 148 ms', status: 'Active', details: 'Right IJ temporary dialysis catheter 1440; hemodialysis 1500-1800; Mg 4.6 post dialysis.', availableAt: at('Tue', '13:50') },
    { id: 'problem_hypoglycemia', name: 'Hypoglycemia after dialysis (glucose 71 at 1700, 54 at 1905)', status: 'Active', details: 'Basal insulin from home plus reduced insulin clearance, poor intake and dialysis. Dextrose 10% started 1930.', availableAt: at('Tue', '19:20') },
    { id: 'problem_rebound', name: 'Magnesium rebound after dialysis (4.6 to 6.4 mg/dL) with delirium and constipation', status: 'Active', details: 'Rebound from tissue stores and gut; CAM positive at night; KUB stool burden.', availableAt: at('Tue', '23:10') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Tuesday, November 17, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'Telemetry step-down hypermagnesemia case study patient, generated by casestudy/cases/hypermag/gen/assemble.js', inputs: { name: 'Raymond Kessler', age: 74, sex: 'Male', primary: 'hypermag', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Raymond Kessler, Step-Down: hypermagnesemia, AKI on CKD 4, emergent hemodialysis', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes`);

/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');
const dir = path.join(__dirname, '..');
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed:', f, e.message); } });
// notes may list `imageFiles: [{file, caption, alt}]` (paths relative to gen/); they are embedded here as data URLs in `images` (see gen/ecg/make_ecgs.py)
notes.forEach(n => { if (n.imageFiles) { n.images = (n.images || []).concat(n.imageFiles.map(f => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f.file)).toString('base64'), caption: f.caption, alt: f.alt }))); delete n.imageFiles; } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) return false; seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Mon', '07:00'), END = at('Tue', '07:00');
const slots = []; for (let i = 0; i < 25; i++) slots.push(H(i).slice(11, 13) + '00');
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_addison_mitchell', title: 'Medical-Surgical Telemetry: Adrenal (Addisonian) crisis in known Addison disease after viral gastroenteritis (24 hours, seven 4-hour checkpoints)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'moderate',
    learningObjectives: ['Recognize adrenal crisis in a person with known adrenal insufficiency: hypotension and shock, hypoglycemia, hyponatremia, hyperkalemia, vomiting, abdominal pain, confusion, hyperpigmentation, and the trigger (illness without extra steroid).', 'Give stress-dose IV hydrocortisone on time and explain why it also covers the missing aldosterone, why fludrocortisone is held at high doses and when it restarts.', 'Monitor and evaluate the response to treatment: blood pressure and orthostatic vitals, heart rate and rhythm, glucose, mental status, urine output, sodium (safe correction no more than 8 mmol/L in 24 hours) and potassium.', 'Teach adrenal insufficiency self-management with teach-back: sick-day rules, the emergency 100 mg IM hydrocortisone injection, medical alert ID and when to call 911.'] },
  patient: { id: 'patient_sim_40422', mrn: 'SIM-40422', name: 'Lauren Mitchell', preferredName: 'Lauren', dob: '1980-05-14', age: 46, sex: 'Female', pronouns: 'she/her', heightCm: 165, weightKg: 58.2, bmi: 21.4, allergies: [{ substance: 'Sulfamethoxazole-trimethoprim (BACTRIM)', reaction: 'Hives', severity: 'Moderate' }] },
  encounter: { id: 'encounter_sim_40422_2026-12-07', location: 'Medical-Surgical Telemetry Unit 4 West', room: '4W-22', attending: 'R. Delacroix, MD (Hospitalist); M. Harrington, MD (Endocrinology)', admitDate: '2026-12-07 04:00', diagnosis: 'Adrenal crisis (primary adrenal insufficiency, autoimmune Addison disease) after viral gastroenteritis with loss of oral steroid: hypovolemic shock, hypoglycemia, hyponatremia 126, hyperkalemia 6.0, prerenal acute kidney injury', chiefComplaint: 'Confusion, weakness, vomiting and diarrhea for 2 days; could not keep her hydrocortisone down', codeStatus: 'Full Code', isolation: 'Contact (enteric) precautions: soap-and-water hand hygiene', dietOrder: 'NPO except ice chips and sips of water (advance when nausea settles)', ambulationOrder: 'Bed rest with bedside commode, 1 assist', fallRisk: 'High', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_adrenal_crisis', name: 'Adrenal crisis in primary adrenal insufficiency (autoimmune Addison disease, diagnosed 2021)', status: 'Active', details: 'Triggered by 2 days of vomiting and diarrhea with no steroid absorbed since Saturday morning; no emergency injection at home. Hydrocortisone 100 mg IV at 0420 (ED), then 50 mg IV every 6 hours.' },
    { id: 'problem_shock', name: 'Hypovolemic shock (BP 74/40 at home), responding to fluid and hydrocortisone', status: 'Active', details: 'EMS saline 500 mL + 2 L saline + D5NS 150 mL/h. BP 98/60 lying, HR 104 at 0700. Orthostatic vitals when safe.' },
    { id: 'problem_hypoglycemia', name: 'Hypoglycemia (glucose 52 in the ED, 49 serum)', status: 'Active', details: 'Cortisol deficiency: no glucose production between meals. Dextrose 50% 0408; D5NS; POC glucose every 2 hours.' },
    { id: 'problem_hyponatremia', name: 'Hyponatremia 126 mmol/L (hypovolemic, 2-3 days)', status: 'Active', details: 'Salt loss from aldosterone deficiency, vomiting and diarrhea, plus ADH release. Correction LIMIT 8 mmol/L in 24 hours.' },
    { id: 'problem_hyperkalemia', name: 'Hyperkalemia 6.0 mmol/L with peaked T waves', status: 'Active', details: 'Aldosterone deficiency and acute kidney injury. Normal PR and QRS. Telemetry; expected to fall with fluid and hydrocortisone.' },
    { id: 'problem_aki', name: 'Acute kidney injury, prerenal (creatinine 1.6, baseline 0.8)', status: 'Active', details: 'Volume depletion. Strict I&O.' },
    { id: 'problem_gastroenteritis', name: 'Acute gastroenteritis (son had the same illness)', status: 'Active', details: 'Vomiting and 6-8 watery stools a day since Saturday. Contact (enteric) precautions; stool C. difficile PCR and GI panel.' },
    { id: 'problem_hypothyroid', name: 'Hashimoto hypothyroidism on levothyroxine 88 mcg', status: 'Active', details: 'TSH 4.6 (mildly high, common in untreated adrenal insufficiency). Dose unchanged; held Monday only.' },
    { id: 'problem_sodium_fast', name: 'Sodium correcting too fast (126 to 132 in 9 hours) with a water diuresis', status: 'Active', details: 'Fluid changed to D5 0.45% NaCl 100 mL/h at 1530. Limit: 134 until 0400 Tuesday.', availableAt: at('Mon', '15:30') },
    { id: 'problem_norovirus', name: 'Norovirus gastroenteritis (GI panel 1820); C. difficile negative', status: 'Active', details: 'Contact (enteric) precautions until 48 hours after the diarrhea stops.', availableAt: at('Mon', '18:20') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, December 7, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'Telemetry adrenal crisis case study patient, generated by casestudy/cases/addison/gen/assemble.js', inputs: { name: 'Lauren Mitchell', age: 46, sex: 'Female', primary: 'addison', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Lauren Mitchell, Telemetry: adrenal crisis (Addison disease) after viral gastroenteritis', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);

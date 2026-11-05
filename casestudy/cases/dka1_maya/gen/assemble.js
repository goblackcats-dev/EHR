/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json) */
const fs = require('fs'), path = require('path');
const { H, at, HOURS } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');
const dir = path.join(__dirname, '..');
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed:', f, e.message); process.exitCode = 1; } });
// notes may list `imageFiles: [{file, caption, alt}]` (paths relative to gen/); they are embedded here as data URLs in `images` (see gen/ecg/make_ecgs.py)
notes.forEach(n => { if (n.imageFiles) { n.images = (n.images || []).concat(n.imageFiles.map(f => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f.file)).toString('base64'), caption: f.caption, alt: f.alt }))); delete n.imageFiles; } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) { console.error('duplicate or missing note id', n.id); return false; } seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Mon', '07:00'), END = at('Thu', '07:00');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_dka1_thompson', title: 'Pediatric ICU to adolescent unit: new-onset type 1 diabetes in severe diabetic ketoacidosis (3 days, checkpoints at every 0700 and 1900)', studentLevel: 'BSN / ADN pediatrics or medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Recognize severe DKA in a teen with new-onset type 1 diabetes (polyuria, polydipsia, weight loss, vomiting, Kussmaul breathing, fruity breath, drowsiness) and interpret the glucose, pH, bicarbonate, anion gap, beta-hydroxybutyrate and corrected sodium.',
      'Manage a pediatric DKA protocol safely: weight-based fluids without repeated boluses, insulin infusion 0.1 unit/kg/h with no bolus, the two-bag dextrose system, potassium and phosphate rules, hourly glucose and neuro checks.',
      'Recognize and act on the warning signs of cerebral edema (headache, falling heart rate, rising blood pressure, vomiting, change in alertness) and give mannitol by order.',
      'Carry out the transition to basal-bolus subcutaneous insulin with overlap, prevent and treat hypoglycemia, and teach a new diagnosis to a teen and her parents (carbohydrate counting, insulin pens, glucagon, sick-day and ketone rules, CGM, school plan).'] },
  patient: { id: 'patient_sim_40501', mrn: 'SIM-40501', name: 'Maya Thompson', preferredName: 'Maya', dob: '2010-08-19', age: 16, sex: 'Female', pronouns: 'she/her', heightCm: 163, weightKg: 48.6, bmi: 18.3, allergies: [{ substance: 'NKDA', reaction: '', severity: '' }] },
  encounter: { id: 'encounter_sim_40501_2026-12-07', location: 'Pediatric Intensive Care Unit (PICU)', room: 'PICU-4', attending: 'E. Whitford, MD (PICU); R. Banerjee, MD (Pediatric Endocrinology)', admitDate: '2026-12-07 02:05', diagnosis: 'Severe diabetic ketoacidosis (pH 7.04, bicarbonate 5, beta-hydroxybutyrate 7.8, anion gap 28) at diagnosis of type 1 diabetes; about 8% dehydration with acute kidney injury (creatinine 1.3)', chiefComplaint: 'Vomiting, belly pain and fast breathing; 5 weeks of thirst, peeing a lot and weight loss', codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'NPO except ice chips on arrival (see Orders for changes)', ambulationOrder: 'Bed rest, head of bed 30 degrees, bathroom with 1 assist on arrival (see Orders)', fallRisk: 'Moderate', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Severe diabetic ketoacidosis at diagnosis of type 1 diabetes', status: 'Active', details: 'pH 7.04, pCO2 16, bicarbonate 5, anion gap 28, beta-hydroxybutyrate 7.8, glucose 612 (0220). Insulin infusion 0.1 unit/kg/h from 0400 (no bolus); two-bag fluids with potassium and phosphate.' },
    { id: 'problem_t1d', name: 'New-onset type 1 diabetes (HbA1c 12.8%)', status: 'Active', details: '5 weeks of polyuria, polydipsia, nocturia and 5.6 kg (10%) weight loss. Autoantibodies, C-peptide, thyroid and celiac screens sent before insulin.' },
    { id: 'problem_dehydration', name: 'Dehydration (about 8%) with acute kidney injury (creatinine 1.3; expected baseline 0.6)', status: 'Active', details: 'One 10 mL/kg saline bolus, then deficit + maintenance over 48 hours (about 150 mL/h overall: two-bag 125 mL/h + potassium riders). Strict I&O, daily weight.' },
    { id: 'problem_cerebral_edema_risk', name: 'High risk of cerebral edema (new onset, pH 7.04, pCO2 16, BUN 28)', status: 'Active', details: 'Neuro checks every hour, no repeated boluses, insulin started 1 hour after fluids, mannitol and 3% saline ordered PRN.' },
    { id: 'problem_potassium', name: 'Potassium shifts on insulin (5.6 on arrival; total body potassium low)', status: 'Active', details: 'Peripheral IVs only: no potassium in the bags; KCl 10 mEq/100 mL riders over 1 hour (maximum 10 mEq/h) by the 4-hour potassium, first rider 0545 (K 4.7, voiding). Labs every 4 hours; cardiac monitor.' },
    { id: 'problem_weight', name: 'Weight loss 10% (54.2 kg in August to 48.6 kg)', status: 'Active', details: 'Catabolism from insulin deficiency. Dietitian consult.' },
    { id: 'problem_family', name: 'New chronic diagnosis: teen and family adjustment, teaching needs, school plan', status: 'Active', details: 'Mother at the bedside, father traveling home. Social work, child life, diabetes education.' },
    { id: 'problem_cerebral_edema', name: 'Possible cerebral edema at 1130 Monday (headache, vomiting, GCS 13, HR 110 to 72, BP 134/92): mannitol 24 g, fluids cut by one-third', status: 'Active', details: 'Improved within 45 minutes. CT head 1255: no acute findings. Hourly neuro checks continue.', availableAt: at('Mon', '13:25') },
    { id: 'problem_hypophos', name: 'Low potassium and phosphorus during treatment (K 3.3, phos 1.8 at 1630)', status: 'Active', details: 'KCl 10 mEq riders x4 back to back 1730-2130 (40 mEq), then potassium phosphate 5 mmol over 2 h; ECG 1730 flat T waves with U waves.', availableAt: at('Mon', '17:50') },
    { id: 'problem_hypoglycemia', name: 'Night hypoglycemia (64 at 0230 Wednesday) after a bedtime correction dose', status: 'Active', details: 'Treated with 15 g juice. Glargine lowered to 18 units; bedtime correction only over 250, half dose.', availableAt: at('Wed', '06:50') },
    { id: 'problem_eating', name: 'Risk of disordered eating / insulin restriction (said she "liked losing the weight"; DEPS-R 16)', status: 'Active', details: 'Below the screening cut-off of 20 but flagged; dietitian recommends outpatient diabetes psychology follow-up.', availableAt: at('Wed', '13:30') },
    { id: 'problem_autoimmune', name: 'Autoimmune type 1 diabetes confirmed: GAD65 186, IA-2 42, insulin autoantibody positive; celiac screen and thyroid normal', status: 'Active', details: 'ZnT8 pending.', availableAt: at('Wed', '14:00') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, December 7, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'DKA series patient 1, generated by casestudy/cases/dka1_maya/gen/assemble.js', inputs: { name: 'Maya Thompson', age: 16, sex: 'Female', primary: 'dka', hospitalDay: 1 } }
};
fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Maya Thompson, PICU: new-onset type 1 diabetes in severe DKA', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
// guard rails: nothing after the start may be a vital sign; orders never ordered after they start; notes inside the timeline
const late = c.observations.filter(o => o.type === 'vital' && o.collected > START); if (late.length) { console.error('VITALS AFTER 0700:', late.length); process.exitCode = 1; }
const badOrd = c.orders.filter(o => o.orderedAt > o.start); if (badOrd.length) { console.error('orderedAt after start:', badOrd.map(o => o.name)); process.exitCode = 1; }
const badNote = c.notes.filter(n => n.datetime > END); if (badNote.length) { console.error('notes after the end:', badNote.map(n => n.id)); process.exitCode = 1; }

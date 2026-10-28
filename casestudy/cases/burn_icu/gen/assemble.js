/* Assembles the canonical case file:   node gen/assemble.js   ->  ../patient.json
   Pulls vitals/labs/I&O (physiology.js), orders/MAR/devices (treatments.js), assessments (assess.js) and notes (../notes/*.json). */
const fs = require('fs'), path = require('path');
const { H, at, hOf } = require('./lib');
const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess');

const dir = path.join(__dirname, '..');
const noteFiles = fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort();
let notes = [];
noteFiles.forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { console.error('note file failed to parse:', f, e.message); } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) return false; seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));

const START = at('Mon', '07:00'), END = at('Thu', '07:00');   // the student takes over at the 0700 shift change; Marcus arrived in the ICU at 0400
const slots = []; for (let i = 0; i < 72; i++) slots.push(H(3 + i).slice(11, 13) + '00');

const canonical = {
  schemaVersion: '2.0',
  caseMeta: {
    caseId: 'case_burn_icu_delaney', title: 'Burn ICU: Thermal burn 22% TBSA with smoke inhalation, burn wound sepsis (3-day ICU stay to Med-Surg transfer)', studentLevel: 'Advanced ADN / BSN critical care', complexity: 'complex',
    learningObjectives: [
      'Calculate and implement burn fluid resuscitation with the Parkland formula (4 mL x kg x %TBSA), titrating lactated Ringer\'s hourly to a urine output goal of 0.5 mL/kg/h.',
      'Recognize and respond to inhalation injury and carbon monoxide poisoning, and explain why a pulse oximeter reads falsely normal with carboxyhemoglobin.',
      'Provide safe care for an intubated, sedated patient: ventilator bundle, RASS and CPOT, daily sedation interruption, spontaneous breathing trial and extubation readiness.',
      'Perform and document hourly neurovascular and compartment checks after an escharotomy and recognize loss of perfusion.',
      'Manage lines and tubes in a burn ICU: arterial line, central line, OG tube feeding, Foley, restraint safety, and infection prevention.',
      'Recognize early burn wound infection and sepsis from vital sign trends and wound changes; communicate with SBAR; carry out the sepsis bundle and vasopressor titration.',
      'Interpret trends in labs (lactate, WBC, platelets, creatinine, procalcitonin), cultures, ABG and I&O across a 3-day stay.',
      'Plan nutrition, glucose control, pain and delirium prevention for a hypermetabolic burn patient.',
      'Prepare a safe SBAR handoff for transfer from the ICU to a medical-surgical unit.'
    ]
  },
  patient: { id: 'patient_sim_40101', mrn: 'SIM-40101', name: 'Marcus Delaney', preferredName: 'Marcus', dob: '1992-03-14', age: 34, sex: 'Male', pronouns: 'he/him', heightCm: 180, weightKg: 82, bmi: 25.3, allergies: [{ substance: 'NKDA', reaction: '', severity: '' }] },
  encounter: {
    id: 'encounter_sim_40101_2026-11-02', location: 'Burn Intensive Care Unit', room: 'BICU-6', attending: 'R. Okafor, MD (Burn Surgery); L. Brandt, MD (Critical Care)', admitDate: '2026-11-02 02:30',
    diagnosis: 'Thermal burns 22% TBSA (flame) with smoke inhalation injury and carbon monoxide poisoning; acute respiratory failure on mechanical ventilation',
    chiefComplaint: 'House fire victim with burns to the right arm, chest and face', codeStatus: 'Full Code', isolation: 'Contact precautions (burn unit)', dietOrder: 'NPO (tube feeding via OG tube)', ambulationOrder: 'Bed rest, HOB 30 degrees or higher',
    fallRisk: 'High (sedated, intubated)', lastUpdated: START, hospitalDay: 1
  },
  problems: [
    { id: 'problem_burn_22', name: 'Thermal burn, 22% TBSA (flame): full-thickness right forearm/hand, deep partial anterior chest and right upper arm, partial face/neck', status: 'Active', details: 'Injury 01:30 Mon 11-02. Circumferential right arm burn, escharotomy 03:15. About 8% TBSA full thickness. Parkland resuscitation 7,216 mL goal in 24 h from injury. OR for excision and grafting tentatively Fri 11-06.' },
    { id: 'problem_inhalation', name: 'Smoke inhalation injury with carbon monoxide poisoning', status: 'Active', details: 'COHb 14.2% at 02:50. Bronchoscopy 04:20: grade 2 inhalation injury. Inhalation injury protocol: albuterol, nebulized heparin and acetylcysteine.' },
    { id: 'problem_resp_failure', name: 'Acute respiratory failure, intubated (ETT 02:50)', status: 'Active', details: 'AC/VC, VT 450 mL (6 mL/kg IBW). Sedation with propofol and fentanyl; daily sedation interruption and spontaneous breathing trial.' },
    { id: 'problem_pain', name: 'Acute severe burn pain', status: 'Active', details: 'CPOT while intubated; multimodal analgesia.' },
    { id: 'problem_nutrition', name: 'Hypermetabolic state, nutrition risk', status: 'Active', details: 'Early enteral feeding via OG tube; prealbumin low; electrolyte shifts.' },
    { id: 'problem_etoh', name: 'Alcohol use (4-6 beers on weekends); tobacco use 1 ppd', status: 'Active', details: 'Ethanol 42 mg/dL at 02:40. Thiamine and folate; monitor for withdrawal and delirium.' },
    { id: 'problem_sepsis', name: 'Burn wound infection with sepsis (MSSA)', status: 'Active', details: 'Recognized Tue 11-03 about 15:30: purulent right arm/chest wound, fever, tachycardia, hypotension needing norepinephrine. MSSA in wound and 2 of 4 blood culture bottles. Cefazolin from Thu 06:10.', availableAt: at('Tue', '15:30') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(),
  stickyNotes: Tx.stickyNotes.concat([
    { title: 'Burn wound infection / sepsis', body: 'Right arm and chest wound infection with sepsis (MSSA): fever 102.4 F, HR to 132, norepinephrine up to 0.14 mcg/kg/min, lactate peak 4.1. Mafenide soaks q8h. Cultures drawn 15:50 Tue. Watch MAP, UOP, glucose and wound margin.', availableAt: at('Tue', '15:30') }
  ]),
  notes,
  timeline: { marDate: 'Monday, November 2, 2026', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'Burn ICU case study patient, generated by casestudy/cases/burn_icu/gen/assemble.js', inputs: { name: 'Marcus Delaney', age: 34, sex: 'Male', primary: 'burn_icu', hospitalDay: 1 } }
};

fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Marcus Delaney, Burn ICU (22% TBSA, inhalation injury, burn sepsis)', source: 'casestudy', canonical }));
const c = canonical;
console.log(`patient.json written: ${c.observations.length} observations (${c.observations.filter(o => o.type === 'vital').length} vital, ${c.observations.filter(o => o.type === 'lab').length} lab, ${c.observations.filter(o => o.type === 'assessment').length} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes`);

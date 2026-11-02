/* Builds the Pre-Built patient library:   node tools/make-prebuilt.js
   - LPN Med Pass patients are built from the Case Builder (case-builder/*.js) into prebuilt/lpn_*.json
   - Case Study patients point at casestudy/cases/<name>/patient.json
   - Writes prebuilt/index.json (the list the "Pre-Built Patients" menu reads). Re-run after changing a profile. */
const fs = require('fs'), vm = require('vm'), path = require('path');
global.window = global;
const root = path.join(__dirname, '..'), dir = path.join(root, 'case-builder') + '/';
const html = fs.readFileSync(dir + 'index.html', 'utf8');
[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1].split('?')[0]).filter(f => !f.startsWith('../') && f !== 'app.js' && fs.existsSync(dir + f))
  .forEach(f => vm.runInThisContext(fs.readFileSync(dir + f, 'utf8'), { filename: f }));
const arch = path.join(dir, 'primary-archive');
if (fs.existsSync(arch)) fs.readdirSync(arch).filter(f => /^primary_.*\.js$/.test(f)).sort((a, b) => (a === 'primary_ortho_gi.js' ? -1 : b === 'primary_ortho_gi.js' ? 1 : 0)).forEach(f => vm.runInThisContext(fs.readFileSync(path.join(arch, f), 'utf8'), { filename: f }));
const base = o => Object.assign({ name: 'Patient', age: 60, sex: 'Female', mrn: 'SIM-0', unit: 'Medical-Surgical 2 East', room: '', heightCm: 170, weightKg: 80, primary: 'lpn_htn', hospitalDay: 1, simDate: '2026-10-20', startTime: '08:45', hx: [], surg: [], surgText: '', allergies: [], codeStatus: 'Full Code',
  social: { tobacco: 'Never', alcohol: 'None', drugs: 'None', living: 'Lives with spouse/partner', function: 'Independent', other: '' }, studentLevel: 'First-semester LPN', complexity: 'simple', facultyNotes: '' }, o);
const LPN = [
  { id: 'lpn_htn', name: 'Harold Bennett', age: 62, sex: 'Male', mrn: 'SIM-30411', room: '204-1', weightKg: 92, heightCm: 178, primary: 'lpn_htn', desc: 'PO lisinopril, SubQ insulin lispro (low scale, glucose 177 = 2 units), IM vitamin B12 1,000 mcg' },
  { id: 'lpn_cellulitis', name: 'Maria Santos', age: 55, sex: 'Female', mrn: 'SIM-30412', room: '206-2', weightKg: 78, heightCm: 160, primary: 'lpn_cellulitis', desc: 'PO acetaminophen, SubQ insulin lispro (high scale, glucose 261 = 12 units), IM ceftriaxone 1.5 g = 3 mL' },
  { id: 'lpn_fall', name: 'Dorothy Hughes', age: 78, sex: 'Female', mrn: 'SIM-30413', room: '208-1', weightKg: 64, heightCm: 158, primary: 'lpn_fall', desc: 'PO acetaminophen, SubQ insulin lispro (low scale, glucose 216 = 4 units), IM ceftriaxone 1.5 g = 3 mL' },
  { id: 'lpn_diabetes', name: 'Calvin Reed', age: 58, sex: 'Male', mrn: 'SIM-30414', room: '210-2', weightKg: 101, heightCm: 180, primary: 'lpn_diabetes', desc: 'PO lisinopril, SubQ insulin lispro (high scale, glucose 341 = 16 units), IM vitamin B12 500 mcg' },
  { id: 'lpn_lasix', name: 'Frank Delgado', age: 69, sex: 'Male', mrn: 'SIM-30416', room: '214-1', weightKg: 88, heightCm: 175, primary: 'lpn_lasix', desc: 'PO furosemide (Lasix) 20 mg, SubQ insulin lispro (sensitive scale, glucose 229 = 2 units), IM ceftriaxone 1.5 g = 3 mL (ventrogluteal or vastus lateralis)' },
  { id: 'lpn_iron', name: 'Patricia Nguyen', age: 58, sex: 'Female', mrn: 'SIM-30417', room: '216-2', weightKg: 66, heightCm: 162, primary: 'lpn_iron', desc: 'PO ferrous sulfate (iron) 325 mg, SubQ insulin lispro (low scale, glucose 194 = 2 units), IM vitamin B12 1,000 mcg' },
  { id: 'lpn_cephalexin', name: 'Raymond Cho', age: 63, sex: 'Male', mrn: 'SIM-30418', room: '218-1', weightKg: 84, heightCm: 172, primary: 'lpn_cephalexin', desc: 'PO cephalexin 250 mg, SubQ insulin lispro (moderate scale, glucose 280 = 9 units), IM promethazine (Phenergan) 12.5 mg = 0.5 mL' },
  { id: 'lpn_potassium', name: 'Beverly Hayes', age: 74, sex: 'Female', mrn: 'SIM-30419', room: '220-2', weightKg: 63, heightCm: 160, primary: 'lpn_potassium', desc: 'PO potassium chloride ER 20 mEq (very large tablet), SubQ insulin lispro (high scale, glucose 316 = 16 units), IM ceftriaxone 1.5 g = 3 mL (bruised right hip: choose another site)' },
  { id: 'lpn_b12', name: 'Linda Park', age: 66, sex: 'Female', mrn: 'SIM-30415', room: '212-1', weightKg: 62, heightCm: 163, primary: 'lpn_b12', desc: 'PO acetaminophen, SubQ insulin lispro (low scale, glucose 166 = 2 units), IM vitamin B12 1,000 mcg' }
];
// Check-off patients carry NO "Important Nursing Information" (it would give away the technique), only the practice patient keeps it.
const PRACTICE = { id: 'lpn_practice', name: 'Sam Practice', age: 60, sex: 'Male', mrn: 'SIM-30400', room: '200-1', weightKg: 85, heightCm: 175, primary: 'lpn_htn', keepInfo: true, desc: 'PRACTICE patient with the nursing information shown (lisinopril PO, insulin lispro SubQ low scale, vitamin B12 IM). Use it to learn before the check-off.' };
const groups = [{ id: 'lpn', title: 'LPN Med Pass', note: 'First-semester LPN medication pass: scan the patient and each medication. One PO (lisinopril, acetaminophen, Lasix, iron, cephalexin or potassium), one SubQ (insulin lispro, a different sliding scale for each patient) and one IM (ceftriaxone, vitamin B12 or Phenergan) each.', patients: [] },
  { id: 'casestudy', title: 'Case Study Patients', note: 'Patients with a built care-plan case study (see Case Studies).', patients: [] }];
LPN.unshift(PRACTICE);
LPN.forEach(d => {
  const r = NS.buildCase(base(d));
  if (!d.keepInfo) r.canonical.orders.forEach(o => { if (o.medication) o.medication.importantInfo = ''; });
  // yesterday's dose of each injection, with its site, so the student can rotate sites (shown under "Last admin" in the give window)
  const LAST_SQ = { htn: 'Left upper abdomen', cellulitis: 'Right upper abdomen', fall: 'Left upper arm (back)', diabetes: 'Right thigh (front)', b12: 'Left upper abdomen', practice: 'Right upper abdomen', lasix: 'Left upper abdomen', iron: 'Right upper arm (back)', cephalexin: 'Right upper abdomen', potassium: 'Left thigh (front)' };
  const LAST_IM = { htn: 'Right ventrogluteal', cellulitis: 'Left vastus lateralis', fall: 'Right ventrogluteal', diabetes: 'Left deltoid', b12: 'Right deltoid', practice: 'Left deltoid', lasix: 'Right vastus lateralis', iron: 'Left ventrogluteal', cephalexin: 'Right ventrogluteal', potassium: 'Left ventrogluteal' };
  const short = d.id.replace(/^lpn_/, ''), prevDay = '2026-10-19';
  r.canonical.orders.filter(o => o.category === 'Medication' && o.medication).forEach(o => {
    const rt = String(o.medication.route || ''), sq = /^sub/i.test(rt), im = /^intramus/i.test(rt); if (!sq && !im) return;
    const at = sq ? prevDay + ' 21:00' : prevDay + ' 09:00', hhmm = at.slice(11, 13) + at.slice(14, 16), us = `${at.slice(5, 7)}/${at.slice(8, 10)}/${at.slice(2, 4)} ${hhmm}`;
    const dose = sq ? '4 units' : (o.mar && o.mar.adminDose) || o.medication.dose;
    (r.canonical.administrations = r.canonical.administrations || []).push({ id: `admin_${o.id}_prev`, orderId: o.id, slotIndex: -1, time: hhmm, state: 'given', label: `${hhmm} Given ${dose}`, dose, route: rt, administeredTime: us, administeredAt: at, administeredBy: 'Night shift RN', site: (sq ? LAST_SQ : LAST_IM)[short] });
    if (o.mar) o.mar.lastAdmin = `${us} (Given)`;
  }); const file = `lpn_${d.id.replace(/^lpn_/, '')}.json`;
  fs.writeFileSync(path.join(root, 'prebuilt', file), JSON.stringify({ format: 'nursingsim-case', version: 1, name: `${d.name}, ${NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', '')}`, source: 'prebuilt', canonical: r.canonical }));
  groups[0].patients.push({ id: d.id, name: d.name, title: NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', ''), desc: d.desc, file: 'prebuilt/' + file, age: d.age, sex: d.sex });
});
// Case study patients: every casestudy/cases/<id>/ folder with a patient.json. A meta.json (id, caseCode, title, patient, age, sex, diagnosis, desc) describes it for the list.
const csDir = path.join(root, 'casestudy', 'cases');
if (fs.existsSync(csDir)) fs.readdirSync(csDir).sort().forEach(id => {
  const pf = path.join(csDir, id, 'patient.json'), mf = path.join(csDir, id, 'meta.json');
  if (!fs.existsSync(pf)) return;
  const m = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
  groups[1].patients.push({ id, name: m.patient || id, title: m.title || id, desc: m.desc || `${m.caseCode || ''} ${m.diagnosis || ''}`.trim(), file: `casestudy/cases/${id}/patient.json`, age: m.age, sex: m.sex });
});
fs.writeFileSync(path.join(root, 'prebuilt', 'index.json'), JSON.stringify({ groups }, null, 1));
console.log('pre-built library:', groups.map(g => `${g.title} ${g.patients.length}`).join(', '));

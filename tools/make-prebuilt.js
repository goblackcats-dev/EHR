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
  { id: 'lpn_b12', name: 'Linda Park', age: 66, sex: 'Female', mrn: 'SIM-30415', room: '212-1', weightKg: 62, heightCm: 163, primary: 'lpn_b12', desc: 'PO acetaminophen, SubQ insulin lispro (low scale, glucose 166 = 2 units), IM vitamin B12 1,000 mcg' }
];
// Check-off patients carry NO "Important Nursing Information" (it would give away the technique), only the practice patient keeps it.
const PRACTICE = { id: 'lpn_practice', name: 'Sam Practice', age: 60, sex: 'Male', mrn: 'SIM-30400', room: '200-1', weightKg: 85, heightCm: 175, primary: 'lpn_htn', keepInfo: true, desc: 'PRACTICE patient with the nursing information shown (lisinopril PO, insulin lispro SubQ low scale, vitamin B12 IM). Use it to learn before the check-off.' };
const groups = [{ id: 'lpn', title: 'LPN Med Pass', note: 'First-semester LPN medication pass: scan the patient and each medication. One PO (lisinopril or acetaminophen), one SubQ (insulin lispro sliding scale) and one IM (ceftriaxone or vitamin B12) each.', patients: [] },
  { id: 'casestudy', title: 'Case Study Patients', note: 'Patients with a built care-plan case study (see Case Studies).', patients: [] }];
LPN.unshift(PRACTICE);
LPN.forEach(d => {
  const r = NS.buildCase(base(d));
  if (!d.keepInfo) r.canonical.orders.forEach(o => { if (o.medication) o.medication.importantInfo = ''; }); const file = `lpn_${d.id.replace(/^lpn_/, '')}.json`;
  fs.writeFileSync(path.join(root, 'prebuilt', file), JSON.stringify({ format: 'nursingsim-case', version: 1, name: `${d.name}, ${NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', '')}`, source: 'prebuilt', canonical: r.canonical }));
  groups[0].patients.push({ id: d.id, name: d.name, title: NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', ''), desc: d.desc, file: 'prebuilt/' + file, age: d.age, sex: d.sex });
});
const cs = JSON.parse(fs.readFileSync(path.join(root, 'casestudy', 'index.json'), 'utf8')).cases;
cs.forEach(c => groups[1].patients.push({ id: c.id, name: c.patient, title: c.title, desc: `${c.caseCode} · ${c.diagnosis}`, file: `casestudy/cases/${c.id}/patient.json`, age: c.age, sex: c.sex }));
fs.writeFileSync(path.join(root, 'prebuilt', 'index.json'), JSON.stringify({ groups }, null, 1));
console.log('pre-built library:', groups.map(g => `${g.title} ${g.patients.length}`).join(', '));

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
  { id: 'lpn_htn', name: 'Harold Bennett', age: 62, sex: 'Male', mrn: 'SIM-30411', room: '204-1', weightKg: 92, heightCm: 178, primary: 'lpn_htn', desc: 'PO lisinopril, SubQ enoxaparin, IM influenza vaccine' },
  { id: 'lpn_cellulitis', name: 'Maria Santos', age: 55, sex: 'Female', mrn: 'SIM-30412', room: '206-2', weightKg: 78, heightCm: 160, primary: 'lpn_cellulitis', desc: 'PO acetaminophen, SubQ enoxaparin, IM ceftriaxone' },
  { id: 'lpn_fall', name: 'Dorothy Hughes', age: 78, sex: 'Female', mrn: 'SIM-30413', room: '208-1', weightKg: 64, heightCm: 158, primary: 'lpn_fall', desc: 'PO acetaminophen, SubQ enoxaparin, IM Tdap vaccine' },
  { id: 'lpn_diabetes', name: 'Calvin Reed', age: 58, sex: 'Male', mrn: 'SIM-30414', room: '210-2', weightKg: 101, heightCm: 180, primary: 'lpn_diabetes', desc: 'PO metformin, SubQ insulin lispro, IM pneumococcal vaccine' },
  { id: 'lpn_b12', name: 'Linda Park', age: 66, sex: 'Female', mrn: 'SIM-30415', room: '212-1', weightKg: 62, heightCm: 163, primary: 'lpn_b12', desc: 'PO folic acid, SubQ heparin, IM vitamin B12' }
];
const groups = [{ id: 'lpn', title: 'LPN Med Pass', note: 'First-semester LPN medication pass: scan the patient and each medication. One PO, one SubQ and one IM medication each.', patients: [] },
  { id: 'casestudy', title: 'Case Study Patients', note: 'Patients with a built care-plan case study (see Case Studies).', patients: [] }];
LPN.forEach(d => {
  const r = NS.buildCase(base(d)); const file = `lpn_${d.id.replace(/^lpn_/, '')}.json`;
  fs.writeFileSync(path.join(root, 'prebuilt', file), JSON.stringify({ format: 'nursingsim-case', version: 1, name: `${d.name}, ${NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', '')}`, source: 'prebuilt', canonical: r.canonical }));
  groups[0].patients.push({ id: d.id, name: d.name, title: NS.PRIMARY[d.primary].label.replace('LPN Med Pass: ', ''), desc: d.desc, file: 'prebuilt/' + file, age: d.age, sex: d.sex });
});
const cs = JSON.parse(fs.readFileSync(path.join(root, 'casestudy', 'index.json'), 'utf8')).cases;
cs.forEach(c => groups[1].patients.push({ id: c.id, name: c.patient, title: c.title, desc: `${c.caseCode} · ${c.diagnosis}`, file: `casestudy/cases/${c.id}/patient.json`, age: c.age, sex: c.sex }));
fs.writeFileSync(path.join(root, 'prebuilt', 'index.json'), JSON.stringify({ groups }, null, 1));
console.log('pre-built library:', groups.map(g => `${g.title} ${g.patients.length}`).join(', '));

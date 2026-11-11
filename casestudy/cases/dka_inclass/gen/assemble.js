/* Assembles the canonical case file:  node gen/assemble.js  ->  ../patient.json  (notes come from ../notes/*.json; run gen/ecg/make_ecgs.py first)
   Built-in checks FAIL the build (exit code 1) when a chart rule is broken. See ../DESIGN.md and .claude/skills/patient-course/SKILL.md. */
const fs = require('fs'), path = require('path');
const { H, at, HOURS, STOPS } = require('./lib'); const P = require('./physiology'), Tx = require('./treatments'), A = require('./assess'), I = require('./infusions');
const dir = path.join(__dirname, '..');
const errors = [], warn = [];
const fail = m => errors.push(m);
let notes = [];
fs.readdirSync(path.join(dir, 'notes')).filter(f => f.endsWith('.json')).sort().forEach(f => { try { notes = notes.concat(JSON.parse(fs.readFileSync(path.join(dir, 'notes', f), 'utf8'))); } catch (e) { fail(`note file failed: ${f} ${e.message}`); } });
notes.forEach(n => { if (n.imageFiles) { n.images = (n.images || []).concat(n.imageFiles.map(f => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, f.file)).toString('base64'), caption: f.caption, alt: f.alt }))); delete n.imageFiles; } });
const seen = new Set(); notes = notes.filter(n => { if (!n.id || seen.has(n.id)) { fail(`duplicate or missing note id ${n.id}`); return false; } seen.add(n.id); return true; }).sort((a, b) => a.datetime.localeCompare(b.datetime));
const START = at('Mon', '07:00'), END = at('Tue', '19:00');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const AV = (d, t) => at(d, t);
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_dka_inclass_mercer', title: 'In-class DKA: sick-day basal insulin omission during a viral illness, moderate-to-severe DKA in a young adult with type 1 diabetes (36 hours, checkpoints every 4 hours)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Recognize DKA triggered by stopping basal insulin during an illness ("no food, no insulin"), and confirm the diagnosis and severity with glucose, beta-hydroxybutyrate, pH, bicarbonate and the anion gap.',
      'Manage an adult DKA protocol (2024 consensus) safely: isotonic fluids, fixed-rate insulin 0.1 unit/kg/h, a separate dextrose line when glucose is under 250, peripheral potassium limits (riders, 10 mEq/h, 20 mEq/L), holding insulin for K under 3.5, magnesium, and the resolution criteria.',
      'Check every handoff, line, site and order against the newest results and the protocol: potassium limits, the dextrose line, IV sites and the transition rules.',
      'Carry out the transition with basal insulin at least 2 hours before stopping the drip, discontinue droplet precautions when the viral panel is negative, and teach sick-day rules with teach-back and complete discharge supplies.'] },
  patient: { id: 'patient_sim_40601', mrn: 'SIM-40601', name: 'Caleb Mercer', preferredName: 'Caleb', dob: '1998-07-22', age: 28, sex: 'Male', pronouns: 'he/him', heightCm: 180, weightKg: 76.0, bmi: 23.5, allergies: [{ substance: 'Codeine', reaction: 'Hives', severity: 'Moderate' }] },
  encounter: { id: 'encounter_sim_40601_2027-01-11', location: 'Medical-Surgical Step-Down Unit (telemetry)', room: 'SD-3', attending: 'H. Ashworth, MD (Hospital Medicine, days); G. Varga, MD (nights); P. Beaumont, MD (Endocrinology)', admitDate: '2027-01-11 01:30',
    diagnosis: 'Moderate-to-severe diabetic ketoacidosis (pH 7.18, bicarbonate 8, beta-hydroxybutyrate 6.4, anion gap 28) in type 1 diabetes after stopping basal insulin during a viral illness; prerenal acute kidney injury (creatinine 1.5)', chiefComplaint: 'Vomiting, belly ache and fast deep breathing after 5 days of a flu-like illness; skipped his long-acting insulin 2 nights',
    codeStatus: 'Full Code', isolation: 'Droplet precautions (see Orders)', dietOrder: 'NPO except ice chips and sips on arrival (see Orders for changes)', ambulationOrder: 'Up with assist (see Orders)', fallRisk: 'High', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Moderate-to-severe diabetic ketoacidosis', status: 'Active', details: 'pH 7.18, bicarbonate 8, anion gap 28, beta-hydroxybutyrate 6.4, glucose 538 (0145). Fixed-rate insulin 7.6 units/h from 0305 (no bolus); 0.9% saline (no potassium in the bags); potassium by peripheral riders.' },
    { id: 'problem_t1d', name: 'Type 1 diabetes since 2014 on injections; stopped basal insulin while ill (no written sick-day plan)', status: 'Active', details: 'Glargine 24 units at 2100 (last Fri 2100), lispro 1 unit/10 g + 1 unit/50 above 150. HbA1c 8.1% (10/2026).' },
    { id: 'problem_uri', name: 'Influenza-like illness (fever, cough, sore throat, body aches)', status: 'Active', details: 'Respiratory viral panel PCR sent 0150. Chest x-ray clear.' },
    { id: 'problem_aki', name: 'Acute kidney injury, prerenal (creatinine 1.5; baseline 0.9)', status: 'Active', details: 'Volume loss. Strict I&O.' },
    { id: 'problem_hypok', name: 'Hypokalemia on treatment (K 3.2 at 1400) and hypomagnesemia (Mg 1.6)', status: 'Active', details: 'Insulin and D10W held 1500-1750; KCl riders x4; magnesium sulfate 2 g. K 3.6 at 1720.', availableAt: AV('Mon', '15:30') },
    { id: 'problem_infiltration', name: 'IV infiltration, right antecubital, INS grade 2 (KCl rider), Monday 1900', status: 'Active', details: 'IV removed, arm elevated, edges marked. New IV right forearm 1915.', availableAt: AV('Mon', '20:30') },
    { id: 'problem_hypo', name: 'Hypoglycemia on the insulin infusion (glucose 62 at 0300) from a disconnected D10W line', status: 'Active', details: 'Dextrose 50% 12.5 g; insulin 3.8 units/h; new D10W tubing.', availableAt: AV('Tue', '03:30') },
    { id: 'problem_dka_resolved', name: 'DKA resolved Tuesday 0530 (BHB 0.4, pH 7.34, CO2 18)', status: 'Active', details: 'Transition to subcutaneous insulin.', availableAt: AV('Tue', '06:30') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, January 11, 2027', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'In-class DKA patient, generated by casestudy/cases/dka_inclass/gen/assemble.js', inputs: { name: 'Caleb Mercer', age: 28, sex: 'Male', primary: 'dka', hospitalDay: 1 } }
};
const c = canonical;
const obs = t => c.observations.filter(o => o.type === t);
const labs = obs('lab');

// ---------- checks ----------
// 1. no vital sign and no bedside glucose after the 0700 arrival
obs('vital').filter(o => o.collected > START).forEach(o => fail(`vital sign after D1 0700: ${o.id}`));
labs.filter(o => /point of care/i.test(o.label) && o.collected > START).forEach(o => fail(`POC glucose charted after D1 0700: ${o.id}`));
// 2. potassium: riders from the MAR, never over 10 mEq/h, never two at once, at most 4 in a row; no peripheral bag over 20 mEq/L unless it is never given
const riderOrd = c.orders.find(o => o.medication && o.medication.medKey === 'kcl_rider_prn');
const riderTimes = c.administrations.filter(a => a.orderId === riderOrd.id).map(a => a.slotIndex * 60 + Number(a.time.slice(2)) - (a.time.slice(0, 2) !== slots[a.slotIndex].slice(0, 2) ? 60 : 0)).sort((a, b) => a - b);
if (riderTimes.length !== I.RIDERS.length || riderTimes.some((m, i) => m !== I.RIDERS[i].s)) fail(`MAR rider times do not match gen/infusions.js (${riderTimes.join(',')})`);
const kBags = c.orders.filter(o => o.kclMeqPerL);
kBags.forEach(o => {
  const given = c.administrations.filter(a => a.orderId === o.id && a.state === 'given');
  if (o.kclMeqPerL > 20 && o.medication.medKey !== 'nacl_kcl40') fail(`peripheral bag over 20 mEq/L: ${o.name}`);
  if (given.length) fail(`potassium-containing bag charted as given/running: ${o.name}`);
  if (o.medication.medKey === 'nacl_kcl40' && !(o.stoppedEarly && o.end <= at('Mon', '23:20'))) fail('the 2245 KCl 40 mEq/L order must be stopped early at 2320');
});
let maxK = 0; for (let m = -400; m < HOURS * 60 + 60; m++) maxK = Math.max(maxK, I.kPerHour(m)); if (maxK > 10) fail(`peripheral potassium ${maxK} mEq/h (limit 10)`);
let run = 1; for (let i = 1; i < I.RIDERS.length; i++) { run = I.RIDERS[i].s - I.RIDERS[i - 1].e <= 5 ? run + 1 : 1; if (run > 4) fail(`more than 4 riders in a row at ${I.RIDERS[i].from}`); if (I.RIDERS[i].s < I.RIDERS[i - 1].e) fail(`two riders at once at ${I.RIDERS[i].from}`); }
// 3. orders: orderedAt <= start; inside the timeline
c.orders.forEach(o => {
  if (o.orderedAt > o.start) fail(`orderedAt after start: ${o.name}`);
  if (o.orderedAt > END) fail(`order placed after the end: ${o.name}`);
  if (o.start > END && !o.afterEnd) fail(`order starts after the end: ${o.name}`);
  if (o.end && o.end < o.start) fail(`order ends before it starts: ${o.name}`);
  delete o.afterEnd;
});
// 4. every dose after 0700 is due (never pre-charted as given)
c.administrations.filter(a => a.state === 'given' && a.administeredAt > START).forEach(a => fail(`dose charted given after 0700: ${a.label}`));
c.administrations.filter(a => a.slotIndex > HOURS).forEach(a => fail(`MAR entry past the last column: ${a.label}`));
// 5. results and notes inside the timeline
labs.forEach(o => { if ((o.availableAt || o.collected) > END) fail(`result after the end: ${o.id}`); if (o.availableAt && o.availableAt < o.collected) fail(`result before collection: ${o.id}`); });
c.notes.forEach(n => { if (n.datetime > END) fail(`note after the end: ${n.id}`); });
c.ioEvents.forEach(e => { if (e.collected > END) fail(`I&O after the end: ${e.id}`); });
// 6. notes never quote a result before it is available, and no clock time later than the note (except listed planned times)
const avail = o => o.availableAt || o.collected;
const QUOTES = [[/\bK (\d\.\d)\b/g, ['Potassium']], [/\bBHB (\d\.\d)\b/g, ['Beta-hydroxybutyrate (serum ketone)']], [/\bpH (7\.\d\d)\b/g, ['pH, venous']], [/\bMg (\d\.\d)\b/g, ['Magnesium']],
  [/(?<!osmolal )\b(?:anion )?gap (\d+)\b(?!\s*(?:or|-|\+))/g, ['Anion gap']], [/\b(?:HCO3|CO2|bicarbonate) (\d+(?:\.\d)?)\b(?!\s*(?:or|-|\+|mEq))/g, ['CO2 (bicarbonate)', 'HCO3, venous (calculated)']], [/\bWBC (\d+\.\d)\b/g, ['WBC']], [/\bHbA1c (\d\.\d)%/g, ['Hemoglobin A1c']], [/\bcreatinine (\d\.\d)\b/gi, ['Creatinine']]];
c.notes.forEach(n => {
  const text = `${n.summary || ''} ${n.body || ''} ${n.impression || ''}`;
  QUOTES.forEach(([re, labels]) => { for (const m of text.matchAll(re)) {
    const v = Number(m[1]); const hits = labs.filter(o => labels.includes(o.label) && Math.abs(Number(o.value) - v) < 1e-6);
    if (!hits.length) { if (!/clinic|baseline|10\/2026|under|over/i.test(text.slice(Math.max(0, m.index - 30), m.index + 30))) warn.push(`${n.id}: "${m[0]}" matches no charted result`); continue; }
    if (!hits.some(o => avail(o) <= n.datetime)) fail(`note ${n.id} (${n.datetime}) quotes "${m[0]}" before it resulted (${hits.map(avail).join(', ')})`);
  } });
  const own = n.datetime.slice(11, 16).replace(':', '');
  text.replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, mm => { if (/^20[12]\d$/.test(mm)) return mm; if (mm > own && (n.allowTimes || []).indexOf(mm) < 0) warn.push(`${n.id}: later clock time ${mm}`); return mm; });
  delete n.allowTimes;
});
// 7. a new lab set resulted before each stop, and a full assessment at each stop
const kLabs = labs.filter(o => o.label === 'Potassium');
STOPS.forEach((s, i) => {
  const prev = i ? STOPS[i - 1] : '0000';
  if (!kLabs.some(o => avail(o) > prev && avail(o) <= s)) fail(`no new lab set resulted before the ${s} stop`);
  const a = obs('assessment').filter(o => o.collected === s); if (a.length < A.ROWS.length) fail(`assessment set missing at ${s} (${a.length} rows)`);
  if (!a.some(o => o.code === 'IV_SITE')) fail(`no IV site row at ${s}`);
});
// 8. no vital sign numbers inside assessment text
obs('assessment').forEach(o => { if (/\b\d{2,3}\/\d{2,3}\b|\bbpm\b|\/min\b|°|SpO2|\bmmHg\b|\b(?:9\d|100)% (?:on|room)/.test(o.value)) fail(`vital-sign number in assessment ${o.id}: ${o.value}`); });
// 9. I&O blocks match the IV arithmetic in gen/infusions.js
const rd = x => Math.round(x + 1e-6);
const ioBlocks = [[I.M('Mon', '01:30'), 0], ...[0, 4, 8, 12, 16, 20, 24, 28, 32].map(h => [h * 60, h * 60 + 240])];
c.ioEvents.forEach((e, i) => { const v = I.vol(...ioBlocks[i]); const iv = rd(v.saline) + rd(v.d10), ivmed = rd(v.insulin) + rd(v.riders) + rd(v.mg) + rd(v.apap) + v.d50;
  if (iv !== e.detail.iv) fail(`I&O ${e.time}: IV fluid ${e.detail.iv} but the infusions give ${iv}`); if (ivmed !== (e.detail.intakeOther || 0)) fail(`I&O ${e.time}: IV med ${e.detail.intakeOther} but the infusions give ${ivmed}`); });
// 10. banned words and real brand/company names in chart text (generic (BRAND) drug names are allowed)
const chartText = JSON.stringify({ o: c.observations, or: c.orders, a: c.administrations, d: c.devices, io: c.ioEvents, s: c.stickyNotes, p: c.problems, e: c.encounter, pt: c.patient, n: c.notes.map(n => Object.assign({}, n, { images: (n.images || []).map(im => ({ caption: im.caption, alt: im.alt })) })) });
[/\bstudents?\b/i, /scenario/i, /simulation/i, /\bunsafe\b/i, /planted/i, /safety catch/i, /teaching point/i, /\bthis is a test\b/i].forEach(re => { const m = chartText.match(re); if (m) fail(`banned word in chart text: "${m[0]}" ...${chartText.slice(Math.max(0, m.index - 60), m.index + 40)}`); });
const BRANDS = ['Lantus', 'Humalog', 'Humulin', 'Novolog', 'Basaglar', 'Tresiba', 'Zofran', 'Tylenol', 'Ofirmev', 'Claritin', 'K-Dur', 'Baqsimi', 'Gvoke', 'GlucaGen', 'SoloStar', 'KwikPen', 'FlexPen', 'Dexcom', 'Libre', 'FreeStyle', 'Omnipod', 'Medtronic', 'Tandem', 'Abbott', 'Lilly', 'Novo Nordisk', 'Sanofi', 'Accu-Chek', 'OneTouch', 'Walgreens', 'CVS', 'Walmart', 'Gatorade', 'Pedialyte', 'Jell-O', 'Popsicle', 'Coca-Cola', 'Coke', 'Pepsi', 'Sprite', 'Alaris', 'Pyxis', 'Omnicell', 'Cerner', 'Tegaderm', 'Saf-T'];
const noGeneric = chartText.replace(/\([A-Z][A-Z0-9 \-]+\)/g, '');
BRANDS.forEach(b => { const m = noGeneric.match(new RegExp(`\\b${b.replace(/[-]/g, '\\-')}\\b`, 'i')); if (m) fail(`brand or company name outside a generic (BRAND) drug name: ${b} ...${noGeneric.slice(Math.max(0, m.index - 50), m.index + 30)}`); });
// 11. the bedside monitor rows exist for each stop and the pain score matches the assessment pain row
try {
  const html = fs.readFileSync(path.join(dir, '..', '..', '..', 'monitor.html'), 'utf8');
  const mm = html.match(/const CALEB = (\[[\s\S]*?\n  \]);/); if (!mm) throw new Error('const CALEB not found in monitor.html');
  const rows = eval(mm[1]);
  if (!/'SIM-40601'/.test(html)) fail('monitor.html: SIM-40601 not registered');
  STOPS.forEach(s => { const r = rows.find(x => x.t === s); if (!r) { fail(`monitor.html: no CALEB row at ${s}`); return; }
    const pm = /pain (\d+)/.exec(r.note || ''); const pa = obs('assessment').find(o => o.collected === s && o.code === 'PAIN_SCORE');
    if (!pm || !pa || !new RegExp(`\\b${pm[1]}/10`).test(pa.value)) fail(`pain at ${s}: monitor "${pm && pm[1]}" vs assessment "${pa && pa.value}"`); });
} catch (e) { fail('monitor check: ' + e.message); }

fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Caleb Mercer, Step-Down: DKA after stopping basal insulin during a viral illness (in class)', source: 'casestudy', canonical }));
const cnt = t => obs(t).length;
console.log(`patient.json written: ${c.observations.length} observations (${cnt('vital')} vital, ${cnt('lab')} lab, ${cnt('assessment')} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes (${c.notes.filter(n => n.type === 'cardiology').length} ECG), ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
warn.forEach(w => console.warn('warning:', w));
if (errors.length) { errors.forEach(e => console.error('CHECK FAILED:', e)); console.error(`${errors.length} check(s) failed.`); process.exit(1); }
console.log('All checks passed: no vitals or bedside glucoses after D1 0700; peripheral potassium max', maxK, 'mEq/h, riders one at a time and at most 4 in a row, the 40 mEq/L bag never given; orderedAt <= start; everything inside the timeline; notes quote only resulted values; a new lab set and a full assessment (with IV site row) at all 10 stops; I&O matches the infusions; no banned words; monitor rows and pain scores match.');

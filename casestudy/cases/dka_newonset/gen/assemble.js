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
const START = at('Mon', '07:00'), END = at('Tue', '07:00');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const AV = (d, t) => at(d, t);
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_dka_newonset_whitcombe', title: 'In-class DKA: new-onset type 1 diabetes presenting in moderate-to-severe DKA in a young woman (24 hours, checkpoints every 4 hours)', studentLevel: 'BSN / ADN medical-surgical (upper level)', complexity: 'high',
    learningObjectives: [
      'Recognize the cues of new-onset type 1 diabetes in DKA (polyuria, polydipsia, polyphagia, weight loss, Kussmaul breathing, fruity breath, dehydration) and confirm the diagnosis and severity with glucose, beta-hydroxybutyrate, pH, bicarbonate and the anion gap.',
      'Manage an adult fixed-rate DKA protocol (2024 consensus) safely: fluids first, insulin 0.1 unit/kg/h only with the potassium known, the dextrose step when glucose is under 250, peripheral potassium limits (riders, 10 mEq/h, 20 mEq/L), magnesium, and the resolution criteria.',
      'Check every order against the newest results and the protocol, and advance the diet when the protocol criteria are met.',
      'Carry out the transition with basal insulin at least 2 hours before stopping the drip, treat hypoglycemia on subcutaneous insulin, support coping with a new chronic diagnosis, and teach survival skills with teach-back.'] },
  patient: { id: 'patient_sim_40602', mrn: 'SIM-40602', name: 'Nora Whitcombe', preferredName: 'Nora', dob: '2004-09-14', age: 22, sex: 'Female', pronouns: 'she/her', heightCm: 165, weightKg: 55.0, bmi: 20.2, allergies: [{ substance: 'Amoxicillin', reaction: 'Rash (as a child)', severity: 'Mild' }] },
  encounter: { id: 'encounter_sim_40602_2027-02-08', location: 'Medical-Surgical Step-Down Unit (telemetry)', room: 'SD-6', attending: 'A. Petrakis, MD (Hospital Medicine, days); D. Rasmussen, MD (nights); C. Navarro, MD (Endocrinology)', admitDate: '2027-02-08 01:40',
    diagnosis: 'Moderate-to-severe diabetic ketoacidosis (pH 7.14, bicarbonate 7, beta-hydroxybutyrate 6.8, anion gap 30), new-onset diabetes (type 1 likely); prerenal acute kidney injury (creatinine 1.3)', chiefComplaint: 'Vomiting, belly pain and fast, deep breathing after 6 weeks of thirst, urinating and weight loss',
    codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'NPO except ice chips on arrival (see Orders for changes)', ambulationOrder: 'Up with assist (see Orders)', fallRisk: 'High', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_dka', name: 'Diabetic ketoacidosis, moderate-to-severe', status: 'Active', details: 'pH 7.14, bicarbonate 7, anion gap 30, beta-hydroxybutyrate 6.8, glucose 562 (0150). Fixed-rate insulin 5.5 units/h from 0305 (no bolus); sodium chloride without potassium; potassium by peripheral riders.' },
    { id: 'problem_t1d', name: 'Diabetes, new onset (type 1 likely)', status: 'Active', details: 'Diagnosed in the ED 02/08. C-peptide, GAD65 / IA-2 / ZnT8 antibodies, TSH and celiac screen sent 0530.' },
    { id: 'problem_hypovolemia', name: 'Hypovolemia / dehydration from osmotic diuresis and vomiting', status: 'Active', details: 'About 6% of body weight (3.5 L). Strict I&O.' },
    { id: 'problem_aki', name: 'Acute kidney injury, prerenal (creatinine 1.3; estimated baseline 0.7)', status: 'Active', details: 'Volume loss (BUN/creatinine 18). Hold ibuprofen.' },
    { id: 'problem_hyperk', name: 'Hyperkalemia at arrival (K 5.8, shift from acidosis and no insulin; peaked T waves)', status: 'Active', details: 'Total body potassium is low; expect the potassium to fall on insulin.' },
    { id: 'problem_weightloss', name: 'Unintended weight loss (6.0 kg, 9.8% since 09/2026)', status: 'Active', details: 'Usual weight 61.0 kg; 55.0 kg on arrival.' },
    { id: 'problem_knowledge', name: 'Knowledge deficit: new diagnosis of diabetes (survival skills)', status: 'Active', details: 'Diabetes educator and dietitian consulted. Include her mother.' },
    { id: 'problem_lowk', name: 'Low-normal potassium on insulin (K 3.6 at 1330)', status: 'Active', details: 'Insulin continues (3.5 or more). Replace potassium per the peripheral potassium protocol; recheck with the 1730 labs.', availableAt: AV('Mon', '14:15') },
    { id: 'problem_hypomg', name: 'Hypomagnesemia, mild (Mg 1.7 at 1330)', status: 'Active', details: 'Magnesium sulfate 2 g IV.', availableAt: AV('Mon', '14:15') },
    { id: 'problem_hypophos', name: 'Hypophosphatemia, mild (phosphorus 1.8 at 1330)', status: 'Active', details: 'From insulin shifting phosphate into the cells. Monitored, not replaced (only under 1.0).', availableAt: AV('Mon', '14:15') },
    { id: 'problem_coping', name: 'Anxiety and grief with a new chronic illness', status: 'Active', details: 'Diagnosis discussed with Nora and her mother at 1700. Social work and diabetes educator involved.', availableAt: AV('Mon', '17:45') },
    { id: 'problem_dka_resolved', name: 'DKA resolved Monday 1730 (BHB 0.5, pH 7.34, CO2 18)', status: 'Active', details: 'Transition to subcutaneous basal-bolus insulin: glargine 1900, drip off 2100.', availableAt: AV('Mon', '18:40') },
    { id: 'problem_aki_resolved', name: 'Acute kidney injury resolved (creatinine 0.7 at 2200)', status: 'Active', details: 'Creatinine 1.3, 1.1, 0.9, 0.8, 0.8, 0.7.', availableAt: AV('Mon', '22:45') },
    { id: 'problem_hypo', name: 'Hypoglycemia on subcutaneous insulin (glucose 58 at 0300)', status: 'Active', details: 'Treated by mouth with two rounds of 15 g; after exercise on the first night of basal insulin.', availableAt: AV('Tue', '03:05') },
    { id: 'problem_t1d_cpep', name: 'Type 1 diabetes supported by a low C-peptide (0.3 ng/mL); islet antibodies pending', status: 'Active', details: 'Celiac screen negative; TSH normal.', availableAt: AV('Tue', '06:00') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, February 8, 2027', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'In-class new-onset DKA patient, generated by casestudy/cases/dka_newonset/gen/assemble.js', inputs: { name: 'Nora Whitcombe', age: 22, sex: 'Female', primary: 'dka', hospitalDay: 1 } }
};
const c = canonical;
const obs = t => c.observations.filter(o => o.type === t);
const labs = obs('lab');
const byKey = k => c.orders.find(o => o.medication && o.medication.medKey === k);

// ---------- checks ----------
// 1. no vital sign and no bedside glucose after the 0700 arrival
obs('vital').filter(o => o.collected > START).forEach(o => fail(`vital sign after D1 0700: ${o.id}`));
labs.filter(o => /point of care/i.test(o.label) && o.collected > START).forEach(o => fail(`POC glucose charted after D1 0700: ${o.id}`));
obs('vital').filter(o => /weight/i.test(o.label)).forEach(o => fail(`weight charted as a vital sign: ${o.id}`));
// 2. potassium: riders from the MAR, never over 10 mEq/h, never two at once, at most 4 in a row; no peripheral bag over 20 mEq/L charted as given
const riderOrd = byKey('kcl_rider_prn');
const adminMin = a => a.slotIndex * 60 + Number(a.time.slice(2)) - (a.time.slice(0, 2) !== slots[a.slotIndex].slice(0, 2) ? 60 : 0);
const riderTimes = c.administrations.filter(a => a.orderId === riderOrd.id).map(adminMin).sort((a, b) => a - b);
if (riderTimes.length !== I.RIDERS.length || riderTimes.some((m, i) => m !== I.RIDERS[i].s)) fail(`MAR rider times do not match gen/infusions.js (${riderTimes.join(',')})`);
const kOrders = c.orders.filter(o => o.medication && /potassium chloride/i.test(o.name) && /^IV/i.test(o.medication.route));
kOrders.filter(o => o !== riderOrd).forEach(o => c.administrations.filter(a => a.orderId === o.id && a.state === 'given').forEach(a => fail(`IV potassium other than a protocol rider charted as given: ${o.name} ${a.time}`)));
c.orders.filter(o => o.kclMeqPerL).forEach(o => {
  if (o.kclMeqPerL > 20 && c.administrations.some(a => a.orderId === o.id && a.state === 'given')) fail(`peripheral potassium bag over 20 mEq/L charted as given: ${o.name}`);
  delete o.kclMeqPerL;
});
let maxK = 0, maxAt = 0; for (let m = -400; m < HOURS * 60 + 60; m++) { const k = I.kPerHour(m); if (k > maxK) { maxK = k; maxAt = m; } } if (maxK > 10) fail(`peripheral potassium ${maxK} mEq/h at minute ${maxAt} (limit 10)`);
let run = 1; for (let i = 1; i < I.RIDERS.length; i++) { run = I.RIDERS[i].s - I.RIDERS[i - 1].e <= 5 ? run + 1 : 1; if (run > 4) fail(`more than 4 riders in a row at ${I.RIDERS[i].from}`); if (I.RIDERS[i].s < I.RIDERS[i - 1].e) fail(`two riders at once at ${I.RIDERS[i].from}`); }
// 2b. the two orders that must be questioned are ordered, due, never charted as given, and stopped early at the right time
[['sodium_bicarbonate', at('Mon', '07:15')], ['kcl_20_iv', at('Mon', '15:10')]].forEach(([k, stop]) => {
  const o = byKey(k); if (!o) { fail(`order ${k} missing`); return; }
  const ad = c.administrations.filter(a => a.orderId === o.id);
  if (ad.some(a => a.state === 'given')) fail(`${o.name} charted as given/running`);
  if (!ad.some(a => a.state === 'due')) fail(`${o.name} has no Due box`);
  if (!(o.stoppedEarly && o.end === stop)) fail(`${o.name} must be stopped early at ${stop}`);
});
// 2c. the order the RN discontinues (NPO) is Active at the 1100 stop; only one diet order is active at any minute
const npo = c.orders.find(o => o.category === 'Diet' && /^NPO except ice chips/.test(o.name));
const S2 = STOPS[1];
if (!npo || !(npo.start <= S2 && (!npo.end || npo.end > S2) && npo.status === 'Active')) fail('the NPO order must be Active at the 1100 stop');
const diets = c.orders.filter(o => o.category === 'Diet');
for (let h = 0; h <= HOURS * 60; h += 1) { const t = H(h / 60); const act = diets.filter(o => o.start <= t && (!o.end || o.end > t)); if (act.length !== 1) { fail(`${act.length} diet orders active at ${t}`); break; } }
// 2d. continuous infusions are 'continuous' on the MAR; the infusions running at 0700 show "0700 Running"
['nacl09_main', 'insulin_regular_infusion', 'nacl045_main', 'd5_045_dka'].forEach(k => { const o = byKey(k); if (!o || o.mar.category !== 'continuous') fail(`${k}: mar.category must be continuous`); });
['nacl09_main', 'insulin_regular_infusion'].forEach(k => { const o = byKey(k); if (!c.administrations.some(a => a.orderId === o.id && /^0700 Running/.test(a.label))) fail(`${k}: no "0700 Running" entry`); });
// 3. orders: orderedAt <= start; inside the timeline
c.orders.forEach(o => {
  if (o.orderedAt > o.start) fail(`orderedAt after start: ${o.name}`);
  if (o.orderedAt > END) fail(`order placed after the end: ${o.name}`);
  if (o.start > END) fail(`order starts after the end: ${o.name}`);
  if (o.end && o.end < o.start) fail(`order ends before it starts: ${o.name}`);
});
// 4. every dose after 0700 is due (never pre-charted as given); every MAR entry inside the timeline
c.administrations.filter(a => a.state === 'given' && a.administeredAt > START).forEach(a => fail(`dose charted given after 0700: ${a.label}`));
c.administrations.filter(a => a.slotIndex > HOURS || (a.availableAt && a.availableAt > END)).forEach(a => fail(`MAR entry past the end: ${a.label}`));
// 5. results, notes, I&O, sticky notes, problems and devices inside the timeline
c.observations.forEach(o => { if ((o.availableAt || o.collected) > END) fail(`result after the end: ${o.id}`); if (o.availableAt && o.availableAt < o.collected) fail(`result before collection: ${o.id}`); });
c.notes.forEach(n => { if (n.datetime > END) fail(`note after the end: ${n.id}`); });
c.ioEvents.forEach(e => { if (e.collected > END) fail(`I&O after the end: ${e.id}`); if (!e.periodEnd) fail(`I&O block without periodEnd: ${e.id}`); });
c.stickyNotes.forEach(s => { if (s.availableAt > END) fail(`sticky note after the end: ${s.title}`); });
c.problems.forEach(p => { if (p.availableAt && p.availableAt > END) fail(`problem after the end: ${p.id}`); });
c.devices.forEach(d => { if (d.placementDate > END || (d.removedAt && d.removedAt > END)) fail(`device time after the end: ${d.id}`); });
// 6. notes never quote a result before it is available, and no clock time later than the note (except listed planned times)
const avail = o => o.availableAt || o.collected;
const QUOTES = [[/\bK (\d\.\d)\b/g, ['Potassium']], [/\bBHB (\d\.\d)\b/g, ['Beta-hydroxybutyrate (serum ketone)']], [/\bpH (7\.\d\d)\b/g, ['pH, venous']], [/\bMg (\d\.\d)\b/g, ['Magnesium']],
  [/(?<!osmolal )\b(?:anion )?gap (\d+)\b(?!\s*(?:or|-|\+))/g, ['Anion gap']], [/\b(?:HCO3|CO2|bicarbonate) (\d+(?:\.\d)?)\b(?!\s*(?:or|-|\+|mEq))/g, ['CO2 (bicarbonate)', 'HCO3, venous (calculated)']], [/\bWBC (\d+\.\d)\b/g, ['WBC']],
  [/\b(?:Hb)?A1c (\d+\.\d)%/g, ['Hemoglobin A1c']], [/\bcreatinine (\d\.\d)\b/gi, ['Creatinine']], [/\bC-peptide (\d\.\d)\b/g, ['C-peptide']], [/\bTSH (\d\.\d)\b/g, ['TSH']], [/\b(?:phos|phosphorus) (\d\.\d)\b/gi, ['Phosphorus']], [/\blactate (\d\.\d)\b/gi, ['Lactate']], [/\btotal IgA (\d+)\b|\(165\)/g, ['Immunoglobulin A, total (IgA)']], [/\bTissue transglutaminase IgA (?=under)/gi, null]];
c.notes.forEach(n => {
  const text = `${n.summary || ''} ${n.body || ''} ${n.impression || ''}`;
  QUOTES.forEach(([re, labels]) => { if (!labels) return; for (const m of text.matchAll(re)) {
    const v = Number(m[1] || 165); const hits = labs.filter(o => labels.includes(o.label) && Math.abs(Number(o.value) - v) < 1e-6);
    if (!hits.length) { if (!/clinic|baseline|09\/2026|under|over/i.test(text.slice(Math.max(0, m.index - 30), m.index + 30))) warn.push(`${n.id}: "${m[0]}" matches no charted result`); continue; }
    if (!hits.some(o => avail(o) <= n.datetime)) fail(`note ${n.id} (${n.datetime}) quotes "${m[0]}" before it resulted (${hits.map(avail).join(', ')})`);
  } });
  // results named in words (tests that come back late)
  [[/celiac screen negative|tTG-IgA under|transglutaminase IgA under/i, 'Tissue transglutaminase IgA (tTG-IgA)'], [/hCG negative/i, 'hCG, serum (quantitative)'], [/Lipase 48/i, 'Lipase']].forEach(([re, label]) => {
    if (re.test(text)) { const o = labs.find(x => x.label === label); if (!o || avail(o) > n.datetime) fail(`note ${n.id} (${n.datetime}) quotes the ${label} result before it resulted`); } });
  if (/GAD65[^.]*positive|antibod[^.]*positive/i.test(text)) fail(`note ${n.id} gives a positive antibody result (the antibodies stay pending in the chart)`);
  const own = n.datetime.slice(11, 16).replace(':', '');
  text.replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, mm => { if (/^20[12]\d$/.test(mm)) return mm; if (mm > own && (n.allowTimes || []).indexOf(mm) < 0) warn.push(`${n.id}: later clock time ${mm}`); return mm; });
  delete n.allowTimes;
});
labs.filter(o => /GAD65|IA-2|ZnT8/.test(o.label)).forEach(o => { if (!/^Pending/.test(o.value)) fail(`antibody result must stay pending: ${o.label} = ${o.value}`); });
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
const ioBlocks = [[I.M('Mon', '01:40'), I.M('Mon', '03:00')], [I.M('Mon', '03:00'), 0], ...[0, 4, 8, 12, 16, 20].map(h => [h * 60, h * 60 + 240])];
if (c.ioEvents.length !== ioBlocks.length) fail(`I&O: ${c.ioEvents.length} blocks, expected ${ioBlocks.length}`);
c.ioEvents.forEach((e, i) => { const v = I.vol(...ioBlocks[i]); const iv = rd(v.saline) + rd(v.d5), ivmed = rd(v.insulin) + rd(v.riders) + rd(v.mg);
  if (iv !== e.detail.iv) fail(`I&O ${e.time}: IV fluid ${e.detail.iv} but the infusions give ${iv}`); if (ivmed !== (e.detail.intakeOther || 0)) fail(`I&O ${e.time}: IV med ${e.detail.intakeOther} but the infusions give ${ivmed}`); });
// 10. banned words and real brand/company names in chart text (generic (BRAND) drug names are allowed)
const chartText = JSON.stringify({ o: c.observations, or: c.orders, a: c.administrations, d: c.devices, io: c.ioEvents, s: c.stickyNotes, p: c.problems, e: c.encounter, pt: c.patient, cm: c.caseMeta, n: c.notes.map(n => Object.assign({}, n, { images: (n.images || []).map(im => ({ caption: im.caption, alt: im.alt })) })) });
[/\bstudents?\b/i, /scenario/i, /simulat/i, /\bunsafe\b/i, /planted/i, /safety catch/i, /quick check/i, /teaching point/i, /big idea/i, /\bthis is a test\b/i, /\berror\b/i].forEach(re => { const m = chartText.match(re); if (m) fail(`banned word in chart text: "${m[0]}" ...${chartText.slice(Math.max(0, m.index - 60), m.index + 40)}`); });
const BRANDS = ['Lantus', 'Humalog', 'Humulin', 'Novolog', 'Basaglar', 'Tresiba', 'Admelog', 'Zofran', 'Tylenol', 'Advil', 'Motrin', 'Mirena', 'Kyleena', 'Skyla', 'Liletta', 'K-Dur', 'Klor-Con', 'Baqsimi', 'Gvoke', 'GlucaGen', 'SoloStar', 'KwikPen', 'FlexPen', 'Dexcom', 'Libre', 'FreeStyle', 'Omnipod', 'Medtronic', 'Tandem', 'Abbott', 'Lilly', 'Novo Nordisk', 'Sanofi', 'Accu-Chek', 'OneTouch', 'Contour', 'Walgreens', 'CVS', 'Walmart', 'Gatorade', 'Powerade', 'BodyArmor', 'Pedialyte', 'Jell-O', 'Popsicle', 'Coca-Cola', 'Coke', 'Pepsi', 'Sprite', 'Canada Dry', 'Ritz', 'Jif', 'Skippy', 'Monistat', 'Alaris', 'Pyxis', 'Omnicell', 'Cerner', 'Epic', 'Tegaderm', 'Saf-T', 'Starbucks', 'Google', 'MedicAlert'];
const noGeneric = chartText.replace(/\([A-Z][A-Z0-9 \-]+\)/g, '');
BRANDS.forEach(b => { const m = noGeneric.match(new RegExp(`\\b${b.replace(/[-]/g, '\\-')}\\b`, 'i')); if (m) fail(`brand or company name outside a generic (BRAND) drug name: ${b} ...${noGeneric.slice(Math.max(0, m.index - 50), m.index + 30)}`); });
// 11. the bedside monitor rows exist for each stop, the MRN and banner are registered, and the pain score matches the assessment pain row
try {
  const html = fs.readFileSync(path.join(dir, '..', '..', '..', 'monitor.html'), 'utf8');
  const mm = html.match(/const NORA = (\[[\s\S]*?\n  \]);/); if (!mm) throw new Error('const NORA not found in monitor.html');
  const rows = eval(mm[1]);
  if (!/'SIM-40602': NORA\b/.test(html)) fail('monitor.html: SIM-40602 not registered in BUILTIN');
  if (!/'SIM-40602': 'SD-6   WHITCOMBE, NORA   22 F'/.test(html)) fail('monitor.html: SIM-40602 banner missing');
  const need = ['hr', 'spo2', 'sys', 'dia', 'rr', 'temp', 'rhythm', 'pr', 'qrs', 'tAmp', 'o2', 'note'];
  rows.forEach(r => need.forEach(k => { if (r[k] === undefined) fail(`monitor.html: NORA row ${r.t} has no ${k}`); }));
  if (!rows.some(r => r.t === at('Tue', '03:35'))) fail('monitor.html: no NORA mid row at Tue 0335');
  STOPS.forEach(s => { const r = rows.find(x => x.t === s); if (!r) { fail(`monitor.html: no NORA row at ${s}`); return; }
    const pm = /pain (\d+)/.exec(r.note || ''); const pa = obs('assessment').find(o => o.collected === s && o.code === 'PAIN_SCORE');
    if (!pm || !pa || !new RegExp(`\\b${pm[1]}/10`).test(pa.value)) fail(`pain at ${s}: monitor "${pm && pm[1]}" vs assessment "${pa && pa.value}"`); });
} catch (e) { fail('monitor check: ' + e.message); }

fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Nora Whitcombe, Step-Down: new-onset type 1 diabetes in DKA (in class)', source: 'casestudy', canonical }));
const cnt = t => obs(t).length;
console.log(`patient.json written: ${c.observations.length} observations (${cnt('vital')} vital, ${cnt('lab')} lab, ${cnt('assessment')} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events, ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes (${c.notes.filter(n => n.type === 'cardiology').length} ECG), ${c.problems.length} problems, ${c.stickyNotes.length} sticky notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
warn.forEach(w => console.warn('warning:', w));
if (errors.length) { errors.forEach(e => console.error('CHECK FAILED:', e)); console.error(`${errors.length} check(s) failed.`); process.exit(1); }
console.log('All checks passed: no vitals or bedside glucoses after D1 0700; peripheral potassium max', maxK, 'mEq/h, riders one at a time and at most 4 in a row; the bicarbonate and KCl 20 mEq orders never given and stopped early; NPO Active at 1100 and one diet order at a time; orderedAt <= start; everything inside the timeline; notes quote only resulted values; a new lab set and a full assessment (with IV site row) at all 7 stops; I&O matches the infusions; no banned words; monitor rows, banner and pain scores match.');

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
const START = at('Mon', '07:00'), END = at('Tue', '07:00'), HIST = at('Sun', '21:30');
const slots = []; for (let i = 0; i <= HOURS; i++) slots.push(H(i).slice(11, 13) + '00');
const AV = (d, t) => at(d, t);
const canonical = {
  schemaVersion: '2.0',
  caseMeta: { caseId: 'case_sci_ad_harcourt', title: 'In-class SCI (draft): febrile UTI and autonomic dysreflexia in a man with a chronic complete T4 spinal cord injury (24 hours, checkpoints every 4 hours)', studentLevel: 'BSN / ADN medical-surgical', complexity: 'moderate',
    learningObjectives: [
      'Read vital signs against the baseline of a person with a high spinal cord injury (low resting BP, poor temperature control) and recognize how infection presents without sensation below the injury.',
      'Recognize autonomic dysreflexia and carry out the nursing actions in order: sit up and lower the legs, loosen tight items, check BP every 2-5 minutes, find and remove the cause (bladder first, then bowel, then skin), notify the provider, give an antihypertensive only if SBP stays 150 or more, and monitor for 2 hours.',
      'Question order-set call parameters that do not fit the patient, and remove an indwelling catheter by its nurse-driven criteria.',
      'Prevent and manage the complications of SCI: pressure injury, orthostatic hypotension, neurogenic bowel and bladder, weak cough, VTE; follow a culture-guided antibiotic change and teach prevention.'] },
  patient: { id: 'patient_sim_40603', mrn: 'SIM-40603', name: 'Wesley Harcourt', preferredName: 'Wes', dob: '1992-10-19', age: 34, sex: 'Male', pronouns: 'he/him', heightCm: 180, weightKg: 72.0, bmi: 22.2, allergies: [{ substance: 'Penicillin', reaction: 'Rash (as a child; no hives or swelling)', severity: 'Mild' }] },
  encounter: { id: 'encounter_sim_40603_2027-03-08', location: '4 West Medical-Surgical', room: '4W-14', attending: 'M. Kincaid, MD (Hospital Medicine, days); N. Haverty, MD (nights); J. Okerlund, DO (Physiatry)', admitDate: '2027-03-07 21:30',
    diagnosis: 'Complicated UTI (febrile) in neurogenic bladder, chronic T4 AIS A spinal cord injury; stage 2 sacral pressure injury (present on admission)', chiefComplaint: 'Fever, chills and cloudy, foul-smelling urine with leaking between catheterizations',
    codeStatus: 'Full Code', isolation: 'Standard precautions', dietOrder: 'Regular, high protein (see Orders)', ambulationOrder: 'Slide-board transfers with assist; binder and stockings on before sitting up', fallRisk: 'Moderate', lastUpdated: START, hospitalDay: 1 },
  problems: [
    { id: 'problem_uti', name: 'Complicated urinary tract infection (febrile), neurogenic bladder', status: 'Active', details: 'UA nitrite positive, leukocyte esterase 3+ (03/07 2240). Urine and blood cultures pending. Ceftriaxone 1 g IV every 24 h.' },
    { id: 'problem_sacral_pi', name: 'Stage 2 sacral pressure injury, present on admission', status: 'Active', details: '2.0 x 1.5 x 0.1 cm (03/07 2210). Low-air-loss mattress, turn every 2 h, silicone foam dressing every 3 days. Braden 13.' },
    { id: 'problem_sci', name: 'Chronic T4 AIS A spinal cord injury (02/2025); spasticity; neurogenic bowel and bladder', status: 'Active', details: 'Baseline BP 90-100/56-62, HR 60s-70s. Baclofen (do not stop). Bowel program 2000.' },
    { id: 'problem_ad_risk', name: 'Autonomic dysreflexia risk (3 prior episodes)', status: 'Active', details: 'Nurse-driven AD protocol; nitroglycerin 2% ointment PRN; sildenafil held.' },
    { id: 'problem_vte', name: 'VTE risk (SCI with immobility, acute infection)', status: 'Active', details: 'Enoxaparin 40 mg SubQ daily.' },
    { id: 'problem_cough', name: 'Ineffective cough (T4 injury)', status: 'Active', details: 'Incentive spirometer; assisted cough.' },
    { id: 'problem_ad_event', name: 'Autonomic dysreflexia 03/08 0912, catheter tubing kink; resolved 0950 without medicine', status: 'Active', details: 'Peak BP 204/112, HR 46. 600 mL drained. Catheter secured to the thigh.', availableAt: AV('Mon', '09:50') },
    { id: 'problem_orthostatic', name: 'Orthostatic hypotension', status: 'Active', details: '98/60 to 76/46 sitting without the binder (1348); 90/56 with binder and stockings.', availableAt: AV('Mon', '14:15') },
    { id: 'problem_vitd', name: 'Vitamin D insufficiency (25-OH vitamin D 22)', status: 'Active', details: 'Continue 2,000 units daily; recheck in 3 months.', availableAt: AV('Mon', '14:00') },
    { id: 'problem_ecoli', name: 'E. coli UTI, resistant to trimethoprim-sulfamethoxazole and ampicillin', status: 'Active', details: 'Ceftriaxone and ciprofloxacin susceptible. Ciprofloxacin 500 mg PO every 12 h from Tue 0900 (7 days total).', availableAt: AV('Tue', '05:45') }
  ],
  observations: [].concat(P.buildVitals(), P.buildLabs(), A.build()),
  orders: Tx.orders, administrations: Tx.admins, devices: Tx.devices, ioEvents: P.buildIO(), stickyNotes: Tx.stickyNotes, notes,
  timeline: { marDate: 'Monday, March 8, 2027', marTimeSlots: slots, simulationStart: START, simulationEnd: END },
  simulationTasks: [], triggers: [],
  facultyBuilder: { builderVersion: 2, custom: true, handBuilt: 'In-class SCI / autonomic dysreflexia patient (draft shell), generated by casestudy/cases/sci_ad/gen/assemble.js', inputs: { name: 'Wesley Harcourt', age: 34, sex: 'Male', primary: 'sci_ad', hospitalDay: 1 } }
};
const c = canonical;
const obs = t => c.observations.filter(o => o.type === t);
const labs = obs('lab');
const byKey = k => c.orders.find(o => o.medication && o.medication.medKey === k);
const activeAt = (o, t) => o && o.start <= t && (!o.end || o.end > t) && o.status === 'Active';

// ---------- checks ----------
// 1. no vital sign after the 0700 arrival
obs('vital').filter(o => o.collected > START).forEach(o => fail(`vital sign after D1 0700: ${o.id}`));
obs('vital').filter(o => /weight/i.test(o.label)).forEach(o => fail(`weight charted as a vital sign: ${o.id}`));
// 2. orders: orderedAt <= start; inside the timeline
c.orders.forEach(o => {
  if (!o.orderedAt || o.orderedAt > o.start) fail(`orderedAt after start: ${o.name}`);
  if (o.orderedAt > END || o.orderedAt < HIST) fail(`order placed outside the timeline: ${o.name}`);
  if (o.start > END) fail(`order starts after the end: ${o.name}`);
  if (o.end && o.end < o.start) fail(`order ends before it starts: ${o.name}`);
  if (o.end && o.end > END && o.stoppedEarly) fail(`stoppedEarly order ends after the timeline: ${o.name}`);
});
// 2b. the call-parameter order (order-set values) is Active at the 0700 stop and stopped early at 1005; the corrected order starts 1005
const callOld = c.orders.find(o => /^Vital signs every 4 hours\. Call provider for SBP greater than 160 or less than 90/.test(o.name));
if (!callOld || !activeAt(callOld, STOPS[0]) || !(callOld.stoppedEarly && callOld.end === at('Mon', '10:05'))) fail('the 0115 call-parameter order must be Active at 0700 and stopped early at 1005');
const callNew = c.orders.find(o => /^Call parameters \(replaces/.test(o.name));
if (!callNew || callNew.start !== at('Mon', '10:05') || callNew.orderedAt !== at('Mon', '10:05')) fail('the corrected call-parameter order must start at 1005');
// 2c. the indwelling catheter order is Active at the 1900 stop (the RN discontinues it); the device is not pre-charted as removed
const cath = c.orders.find(o => /^Indwelling urinary catheter: maintain/.test(o.name));
if (!cath || !activeAt(cath, STOPS[3]) || !cath.stoppedEarly || !/RN MAY REMOVE/.test(cath.instructions)) fail('the indwelling catheter order must be Active at the 1900 stop, stoppedEarly, with nurse removal criteria');
const cathDev = c.devices.find(d => /Indwelling urinary catheter/.test(d.type));
if (!cathDev) fail('indwelling catheter device missing'); else if (cathDev.removedAt) fail('the catheter removal is charted by the RN: no removedAt in the file');
if (!c.orders.some(o => /^AUTONOMIC|Autonomic dysreflexia protocol/.test(o.name) && /EVERY 2-5 MINUTES/.test(o.instructions))) fail('AD protocol order missing');
const ntg = byKey('ntg_oint_prn'); if (!ntg || !/sildenafil/i.test(ntg.instructions) || c.administrations.some(a => a.orderId === ntg.id)) fail('nitroglycerin PRN must carry the sildenafil check and have no MAR entries');
const cef = byKey('ceftriaxone_q24'), cip = byKey('ciprofloxacin');
if (!cef || !(cef.stoppedEarly && cef.end === at('Tue', '05:45'))) fail('ceftriaxone every 24 h must stop early at Tue 0545');
if (!cip || cip.orderedAt !== at('Tue', '05:45')) fail('ciprofloxacin must be ordered Tue 0545');
const sus = labs.find(o => /trimethoprim/i.test(o.label)); if (!sus || sus.availableAt > cip.orderedAt) fail('susceptibilities must be back before the antibiotic change');
// 2d. VTE prophylaxis only with a documented clot-risk factor
const enox = byKey('enoxaparin'); if (!enox || !/risk factor/i.test(enox.rationale)) fail('enoxaparin needs a documented clot-risk factor');
// 2e. NS continuous with "0700 Running" and a Due box at the current hour
const ns = byKey('nacl09_main');
if (!ns || ns.mar.category !== 'continuous') fail('NS: mar.category must be continuous');
else { if (!c.administrations.some(a => a.orderId === ns.id && /^0700 Running/.test(a.label))) fail('NS: no "0700 Running" entry'); if (!c.administrations.some(a => a.orderId === ns.id && a.state === 'due' && a.slotIndex === 0)) fail('NS: no Due box at 0700'); }
// 3. every dose after 0700 is due (never pre-charted as given); every MAR entry inside the timeline
c.administrations.filter(a => a.state === 'given' && a.administeredAt > START).forEach(a => fail(`dose charted given after 0700: ${a.label}`));
c.administrations.filter(a => a.slotIndex > HOURS || (a.availableAt && a.availableAt > END)).forEach(a => fail(`MAR entry past the end: ${a.label}`));
c.administrations.filter(a => a.state === 'due').forEach(a => { const o = c.orders.find(x => x.id === a.orderId); if (o.start > H(a.slotIndex + 1)) fail(`due box before the order starts: ${o.name} ${a.time}`); });
// 4. results, notes, I&O, sticky notes, problems and devices inside the timeline
c.observations.forEach(o => { const t = o.availableAt || o.collected; if (t > END || o.collected < HIST) fail(`result outside the timeline: ${o.id}`); if (o.availableAt && o.availableAt < o.collected) fail(`result before collection: ${o.id}`); });
c.notes.forEach(n => { if (n.datetime > END || n.datetime < HIST) fail(`note outside the timeline: ${n.id}`); });
c.ioEvents.forEach(e => { if (e.collected > END) fail(`I&O after the end: ${e.id}`); if (!e.periodEnd) fail(`I&O block without periodEnd: ${e.id}`); });
c.stickyNotes.forEach(s => { if (s.availableAt > END) fail(`sticky note after the end: ${s.title}`); });
c.problems.forEach(p => { if (p.availableAt && p.availableAt > END) fail(`problem after the end: ${p.id}`); });
c.devices.forEach(d => { if (d.placementDate > END || (d.removedAt && d.removedAt > END)) fail(`device time after the end: ${d.id}`); });
// 5. notes never quote a result before it is available
const avail = o => o.availableAt || o.collected;
const QUOTES = [[/\bWBC (\d+\.\d)\b/g, ['WBC']], [/\bCRP (\d+)\b/g, ['C-reactive protein (CRP)']], [/\bESR (\d+)\b/g, ['Erythrocyte sedimentation rate (ESR)']], [/\bprocalcitonin (\d\.\d\d)\b/gi, ['Procalcitonin']],
  [/\blactate (\d\.\d)\b/gi, ['Lactate']], [/\bprealbumin (\d+)\b/gi, ['Prealbumin']], [/\balbumin (\d\.\d)\b/gi, ['Albumin']], [/\bvitamin D (\d+)\b/gi, ['25-hydroxy vitamin D']], [/\bcreatinine (\d\.\d)\b/gi, ['Creatinine']],
  [/\bMg (\d\.\d)\b/g, ['Magnesium']], [/\beGFR (\d+)\b/g, ['eGFR (CKD-EPI 2021)']], [/\bHgb (\d+\.\d)\b/g, ['Hemoglobin']], [/\bBUN (\d+)\b(?!\/)/g, ['BUN']], [/\bK (\d\.\d)\b/g, ['Potassium']]];
const WORDS = [[/gram-negative rods/i, 'Urine culture (new catheter)', at('Mon', '14:00')], [/Escherichia coli|E\. coli/, 'Urine culture (new catheter)', at('Mon', '22:00')], [/trimethoprim-sulfamethoxazole \*?\*?R\b|RESISTANT to trimethoprim|susceptib[a-z]* \(0230\)/i, 'Urine culture (new catheter)', at('Tue', '02:30')],
  [/no growth at 12 hours/i, 'Blood cultures x2 (peripheral)', at('Mon', '10:00')], [/no growth at 24 hours/i, 'Blood cultures x2 (peripheral)', at('Mon', '22:00')], [/nitrite positive/i, 'UA nitrite', at('Sun', '22:40')], [/sinus bradycardia,? 50/i, 'ECG 12-lead interpretation', at('Mon', '09:30')]];
c.notes.forEach(n => {
  const text = `${n.summary || ''} ${n.body || ''} ${n.impression || ''}`;
  QUOTES.forEach(([re, labels]) => { for (const m of text.matchAll(re)) {
    const v = Number(m[1]); const hits = labs.filter(o => labels.includes(o.label) && Math.abs(Number(o.value) - v) < 1e-6);
    if (!hits.length) { warn.push(`${n.id}: "${m[0]}" matches no charted result`); continue; }
    if (!hits.some(o => avail(o) <= n.datetime)) fail(`note ${n.id} (${n.datetime}) quotes "${m[0]}" before it resulted (${hits.map(avail).join(', ')})`);
  } });
  WORDS.forEach(([re, label, t]) => { if (re.test(text)) { const o = labs.find(x => x.label === label && avail(x) === t); if (!o) fail(`WORDS check: no ${label} result at ${t}`); else if (t > n.datetime) fail(`note ${n.id} (${n.datetime}) quotes the ${label} result of ${t} before it resulted`); } });
  if (/vitamin D (?:level|\d)|25-hydroxy/i.test(text) && n.datetime < at('Mon', '14:00') && !/pending/i.test(text)) fail(`note ${n.id} mentions vitamin D before 1400 without "pending"`);
  const own = n.datetime.slice(11, 16).replace(':', '');
  if (n.datetime >= START) text.replace(/\b([01]\d|2[0-3])([0-5]\d)\b/g, mm => { if (/^20[12]\d$/.test(mm)) return mm; if (mm > own && (n.allowTimes || []).indexOf(mm) < 0) warn.push(`${n.id}: later clock time ${mm}`); return mm; });
  delete n.allowTimes;
});
// 6. a new result before each stop, and a full assessment (with IV site, neuro, skin, GU, GI, respiratory, psychosocial rows) at each stop
STOPS.forEach((s, i) => {
  const prev = i ? STOPS[i - 1] : at('Mon', '00:00');
  if (!labs.some(o => avail(o) > prev && avail(o) <= s && o.category !== 'Cardiac')) fail(`no new lab result before the ${s} stop`);
  const a = obs('assessment').filter(o => o.collected === s); if (a.length < A.ROWS.length) fail(`assessment set missing at ${s} (${a.length} rows)`);
  ['IV_SITE', 'NEURO', 'SKIN', 'GU', 'GI', 'RESPIRATORY', 'PSYCHOSOCIAL'].forEach(k => { if (!a.some(o => o.code === k)) fail(`no ${k} row at ${s}`); });
  if (i > 0) { const before = obs('assessment').filter(o => o.collected === STOPS[i - 1]); if (!a.some(o => before.find(b => b.code === o.code).value !== o.value)) fail(`assessment at ${s} is unchanged from the stop before`); }
});
if (!/T4/.test((obs('assessment').find(o => o.collected === START && o.code === 'NEURO') || {}).value || '')) fail('0700 neuro row must give the T4 sensory level');
if (!/stage 2/i.test((obs('assessment').find(o => o.collected === START && o.code === 'SKIN') || {}).value || '')) fail('0700 skin row must describe the stage 2 sacral area');
// 7. no vital sign numbers inside assessment text
obs('assessment').forEach(o => { if (/(?<![\/\d])(?:[6-9]\d|[12]\d\d)\/(?:[3-9]\d|1\d\d)\b(?!\/)|\bbpm\b|\/min\b|°|SpO2|\bmmHg\b|\b\d{2,3}(\.\d)? ?F\b|\b(?:9\d|100)% (?:on|room)/.test(o.value)) fail(`vital-sign number in assessment ${o.id}: ${o.value}`); });
// 8. I&O blocks match the IV arithmetic in gen/infusions.js; 24-hour totals match DESIGN.md section 14
const rd = x => Math.round(x + 1e-6);
const ioBlocks = [[I.M('Sun', '21:30'), I.M('Sun', '23:00')], ...[-8, -4, 0, 4, 8, 12, 16, 20].map(h => [h * 60, h * 60 + 240])];
if (c.ioEvents.length !== ioBlocks.length) fail(`I&O: ${c.ioEvents.length} blocks, expected ${ioBlocks.length}`);
c.ioEvents.forEach((e, i) => { const v = I.vol(...ioBlocks[i]); const iv = rd(v.saline) + v.flush; if (iv !== e.detail.iv) fail(`I&O ${e.time}: IV ${e.detail.iv} but the infusions give ${iv}`); });
const day = c.ioEvents.filter(e => e.collected > START); const tin = day.reduce((s, e) => s + e.intake, 0), tout = day.reduce((s, e) => s + e.output, 0);
if (tin !== 4060 || tout !== 3630) fail(`24-h I&O ${tin}/${tout}, DESIGN.md says 4060/3630`);
// 9. ECG record with an image
if (!c.notes.some(n => n.type === 'cardiology' && (n.images || []).length && /bradycardia/i.test(n.summary))) fail('no Cardiology ECG record with an image');
// 10. banned words and real brand/company names in chart text (generic (BRAND) drug names are allowed)
const chartText = JSON.stringify({ o: c.observations, or: c.orders, a: c.administrations, d: c.devices, io: c.ioEvents, s: c.stickyNotes, p: c.problems, e: c.encounter, pt: c.patient, cm: c.caseMeta, n: c.notes.map(n => Object.assign({}, n, { images: (n.images || []).map(im => ({ caption: im.caption, alt: im.alt })) })) });
[/\bstudents?\b/i, /scenario/i, /simulat/i, /\bunsafe\b/i, /planted/i, /safety catch/i, /quick check/i, /teaching point/i, /big idea/i, /\bthis is a test\b/i, /\berror\b/i, /live-event/i].forEach(re => { const m = chartText.match(re); if (m) fail(`banned word in chart text: "${m[0]}" ...${chartText.slice(Math.max(0, m.index - 60), m.index + 40)}`); });
const BRANDS = ['Foley', 'Tylenol', 'Lioresal', 'Gablofen', 'Ditropan', 'Senokot', 'Colace', 'Dulcolax', 'Lovenox', 'Viagra', 'Revatio', 'Cialis', 'Nitro-Bid', 'Nitrostat', 'Procardia', 'Rocephin', 'Cipro', 'Bactrim', 'Septra', 'Macrobid', 'Keflex', 'Xylocaine', 'Ensure', 'Boost', 'Juven', 'Jobst', 'TED', 'ROHO', 'Hollister', 'Coloplast', 'SpeediCath', 'LoFric', 'Bard', 'StatLock', 'Mepilex', 'Allevyn', 'Tegaderm', 'Medline', 'Hoyer', 'Epic', 'Pyxis', 'Alaris', 'Omnicell', 'Cerner', 'Walmart', 'CVS', 'Walgreens', 'Gatorade', 'Coke', 'Google', 'MedicAlert', 'Uber', 'Lyft', 'Paralyzed Veterans', 'Craig Hospital', 'Bair Hugger', 'Arctic Sun'];
const noGeneric = chartText.replace(/\([A-Z][A-Z0-9 \-]+\)/g, '');
BRANDS.forEach(b => { const m = noGeneric.match(new RegExp(`\\b${b.replace(/[-]/g, '\\-')}\\b`, b === 'TED' ? '' : 'i')); if (m) fail(`brand or company name outside a generic (BRAND) drug name: ${b} ...${noGeneric.slice(Math.max(0, m.index - 50), m.index + 30)}`); });
// 11. the bedside monitor rows exist for each stop and the AD event, the MRN and banner are registered, and the pain score matches the assessment pain row
try {
  const html = fs.readFileSync(path.join(dir, '..', '..', '..', 'monitor.html'), 'utf8');
  const mm = html.match(/const WES = (\[[\s\S]*?\n  \]);/); if (!mm) throw new Error('const WES not found in monitor.html');
  const rows = eval(mm[1]);
  if (!/'SIM-40603': WES\b/.test(html)) fail('monitor.html: SIM-40603 not registered in BUILTIN');
  if (!/'SIM-40603': '4W-14   HARCOURT, WES   34 M'/.test(html)) fail('monitor.html: SIM-40603 banner missing');
  const need = ['hr', 'spo2', 'sys', 'dia', 'rr', 'temp', 'rhythm', 'pr', 'qrs', 'tAmp', 'uAmp', 'o2', 'note'];
  rows.forEach(r => need.forEach(k => { if (r[k] === undefined) fail(`monitor.html: WES row ${r.t} has no ${k}`); }));
  rows.forEach((r, i) => { if (i && r.t <= rows[i - 1].t) fail(`monitor.html: WES rows out of order at ${r.t}`); if (r.t < START || r.t > END) fail(`monitor.html: WES row outside the timeline ${r.t}`); });
  STOPS.forEach(s => { const r = rows.find(x => x.t === s); if (!r) { fail(`monitor.html: no WES row at ${s}`); return; }
    const pm = /pain (\d+)/.exec(r.note || ''); const pa = obs('assessment').find(o => o.collected === s && o.code === 'PAIN_SCORE');
    if (!pm || !pa || !new RegExp(`\\b${pm[1]}/10`).test(pa.value)) fail(`pain at ${s}: monitor "${pm && pm[1]}" vs assessment "${pa && pa.value}"`); });
  // the AD event: BP climbs to a peak of about 200/110 with HR in the 40s (sinus bradycardia), then recovers to baseline by the 1100 stop
  const ev = rows.filter(r => r.t > START && r.t < STOPS[1]);
  const peak = ev.reduce((m, r) => (r.sys > m.sys ? r : m), { sys: 0 });
  if (peak.sys < 200 || peak.dia < 110 || peak.hr >= 50 || peak.rhythm !== 'brady') fail(`monitor.html: AD peak row wrong (${peak.t} ${peak.sys}/${peak.dia} HR ${peak.hr} ${peak.rhythm})`);
  const up = ev.filter(r => r.t <= peak.t); if (up.length < 3 || up.some((r, i) => i && (r.sys <= up[i - 1].sys || r.hr >= up[i - 1].hr))) fail('monitor.html: BP must climb and HR fall row by row up to the AD peak');
  const s2 = rows.find(r => r.t === STOPS[1]); if (!s2 || s2.sys > 110 || s2.hr < 60) fail('monitor.html: the 1100 row must be back near his baseline');
  if (!rows.some(r => r.t === at('Mon', '20:20') && r.sys >= 120)) fail('monitor.html: no 2020 bowel-care row');
} catch (e) { fail('monitor check: ' + e.message); }

fs.writeFileSync(path.join(dir, 'patient.json'), JSON.stringify({ format: 'nursingsim-case', version: 1, name: 'Wesley Harcourt, Med-Surg: UTI and autonomic dysreflexia in chronic T4 spinal cord injury (in class) (draft)', source: 'casestudy', canonical }));
const cnt = t => obs(t).length;
console.log(`patient.json written: ${c.observations.length} observations (${cnt('vital')} vital, ${cnt('lab')} lab, ${cnt('assessment')} assessment), ${c.orders.length} orders, ${c.administrations.length} MAR events (${c.administrations.filter(a => a.state === 'due').length} due), ${c.devices.length} devices, ${c.ioEvents.length} I&O blocks, ${c.notes.length} notes (${c.notes.filter(n => n.type === 'cardiology').length} ECG), ${c.problems.length} problems, ${c.stickyNotes.length} sticky notes, ${(fs.statSync(path.join(dir, 'patient.json')).size / 1024).toFixed(0)} KB`);
warn.forEach(w => console.warn('warning:', w));
if (errors.length) { errors.forEach(e => console.error('CHECK FAILED:', e)); console.error(`${errors.length} check(s) failed.`); process.exit(1); }
console.log('All checks passed: no vitals after D1 0700; orderedAt <= start; everything inside the timeline; call-parameter order Active at 0700 and replaced 1005; catheter order Active at 1900 with nurse removal criteria; every dose after 0700 due; notes quote only resulted values; a new result and a full assessment at all 7 stops; I&O matches the IV timeline and the 24-h totals; ECG with image; no banned words; monitor rows (stops, AD climb, peak, recovery), banner and pain scores match.');

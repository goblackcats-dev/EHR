/* NursingSim - handoff report practice with a rubric built from the patient (v26).
   The rubric is generated from the chart as it stands at the current simulation time: every part of the patient
   (identity, allergies, code status, diagnosis, history, vital signs, assessments, labs, lines, medications, orders,
   events this shift) creates rubric items. The student gives report in five boxes (typed or dictated), and the report is
   scored against the rubric, with feedback and the missed items.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, parseSimDate, safe, escapeHtml, epicDate, persistCase. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9.%\/+& ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const reEsc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const uniq = a => Array.from(new Set(a));

  const BOXES = [
    { id: 'id', title: '1. Patient and illness severity', hint: 'Name, age, room, code status, allergies, isolation, and how sick the patient is (stable, watcher, unstable).' },
    { id: 'sb', title: '2. Situation and background', hint: 'Why they are here, hospital day, surgery or procedures, important history, what has happened so far.' },
    { id: 'as', title: '3. Assessment', hint: 'Vital signs, findings by system, pain, labs, lines and drains, intake and output, diet, activity and fall risk, events this shift.' },
    { id: 'ac', title: '4. Medications, orders and to-do', hint: 'Medications given, due soon and high-alert drugs, tests and consults pending, what the next nurse needs to do.' },
    { id: 'co', title: '5. If-then plans and questions', hint: 'What to watch for and what to do if it happens (who to call), and ask the receiving nurse for questions.' }
  ];

  // I-PASS format: Illness severity, Patient summary, Action list, Situation awareness and contingency, Synthesis by receiver.
  // It reuses the same rubric: the Patient summary box covers both the background and the assessment items.
  const IPASS = [
    { id: 'id', title: 'I: Illness severity', hint: 'Name, age, room, code status, allergies, isolation, and how sick the patient is (stable, watcher, unstable).' },
    { id: 'sb', title: 'P: Patient summary', hint: 'Why they are here, hospital day, history, events so far, vital signs, findings by system, labs, lines, intake and output, diet, activity.' },
    { id: 'ac', title: 'A: Action list', hint: 'Medications given, due soon and high-alert drugs, tests and consults pending, what the next nurse needs to do.' },
    { id: 'co', title: 'S: Situation awareness and contingency plans', hint: 'What to watch for and what to do if it happens (who to call, with numbers).' },
    { id: 'sy', title: 'S: Synthesis by receiver', hint: 'The receiving nurse repeats back the plan and asks questions. Write what you would say to invite that (for example: "Can you read that back to me? What questions do you have?").' }
  ];
  let fmt = 'five';
  const boxes = () => (fmt === 'ipass' ? IPASS : BOXES);
  const toRubricTexts = t => (fmt === 'ipass' ? { id: t.id, sb: t.sb, as: t.sb, ac: t.ac, co: `${t.co || ''} . ${t.sy || ''}` } : t);

  // ------------------------------------------------------------------ small matching tools
  const STOP = new Set('with without that this have from were been will after before patient noted right left sound sounds normal status level present chart given each every per and the for are not when then also into over under about than only some more most very daily'.split(' '));
  const sigWords = (text, max = 8) => {
    const acro = (String(text).match(/\b[A-Z]{2,5}\b/g) || []).map(a => a.toLowerCase());
    const extra = /x-?ray/i.test(text) ? ['xray'] : [];
    return uniq(norm(text).split(' ').filter(w => w.length >= 4 && !STOP.has(w) && !/^\d/.test(w)).concat(acro, extra)).slice(0, max);
  };
  const stem = w => w.slice(0, 5);
  const hits = (text, words) => words.filter(w => text.includes(stem(w))).length;
  const numsNear = (text, kw, span = 42) => {
    const out = []; const re = new RegExp(kw.source, 'gi'); let m;
    while ((m = re.exec(text))) { const seg = text.slice(Math.max(0, m.index - 14), m.index + m[0].length + span); (seg.match(/\d+(?:\.\d+)?/g) || []).forEach(n => out.push(parseFloat(n))); }
    return out;
  };
  const hasKw = (text, kw) => new RegExp(kw.source, 'i').test(text);

  const LAB_KW = { Potassium: /potassium|\bk\b|\bk\+/, Sodium: /sodium|\bna\b/, Creatinine: /creatinine|\bcr\b|\bscr\b/, BUN: /\bbun\b|urea/, Glucose: /glucose|sugar|\bbg\b|accu ?check/, Hemoglobin: /hemoglobin|hgb|\bhb\b|h&h/, WBC: /wbc|white (blood )?(cell|count)/, Platelets: /platelet|\bplt/, 'Troponin I': /troponin/, Lactate: /lactate|lactic/, INR: /\binr\b/, pH: /\bph\b/, PaO2: /pao2|po2|\bo2 level/, PaCO2: /paco2|pco2|\bco2\b/, BNP: /\bbnp\b/, 'D-dimer': /d.?dimer/, Magnesium: /magnesium|\bmg\b/, Calcium: /calcium|\bca\b/, HCO3: /bicarb|hco3/, CO2: /bicarb|\bco2\b|hco3/, aPTT: /\bptt\b|aptt/, Chloride: /chloride|\bcl\b/ };
  const SECTION_KW = { Neurologic: /neuro|alert|orient|\bloc\b|mental|confus|aox|lethargic|drows/, Respiratory: /lung|breath|respir|oxygen|cough|\bo2\b|nasal|sat\b|wheez|crackle/, Cardiac: /heart|cardiac|rhythm|edema|pulse|telemetry|tele\b|sinus|murmur/, GI: /abdom|bowel|nausea|vomit|belly|diet|\bgi\b|npo/, GU: /urine|void|foley|urinary|bladder|\bgu\b|catheter/, Skin: /skin|wound|incision|pressure|braden|dressing|rash/, Pain: /pain|comfort/, Safety: /fall|precaution|safety|alarm/, 'Musculoskeletal / Mobility': /mobil|ambul|walk|weight.?bear|assist|activity|bed ?rest|walker|transfer/ };
  const NORMAL_RE = /\b(normal|wnl|within normal|clear|unremarkable|no (issues|concerns|problems|changes|complaints)|fine|intact|unchanged|stable)\b/;

  // ------------------------------------------------------------------ build the rubric from the chart
  function buildRubric() {
    const cc = currentCanonicalCase; if (!cc) return null;
    const vis = getVisibleCanonicalCase(cc), obs = vis.observations || [], enc = cc.encounter || {}, pt = cc.patient || {};
    const now = String(simulationTime), start = String((cc.timeline || {}).simulationStart || now);
    const items = [];
    const add = it => { items.push(Object.assign({ points: 1, critical: false, box: 'as' }, it)); };
    const latestBy = (list, keyFn) => { const m = new Map(); list.slice().sort((a, b) => String(a.collected).localeCompare(String(b.collected))).forEach(o => m.set(keyFn(o), o)); return [...m.values()]; };

    // ---- who
    const parts = safe(pt.name).split(/\s+/).filter(Boolean);
    add({ box: 'id', label: 'Patient name', expected: safe(pt.name), type: 'any', any: parts.map(p => new RegExp('\\b' + reEsc(p.toLowerCase()) + '\\b')), points: 1, source: 'Patient' });
    add({ box: 'id', label: 'Age and sex', expected: `${safe(pt.age)}-year-old ${safe(pt.sex).toLowerCase()}`, type: 'all', all: [new RegExp('\\b' + reEsc(safe(pt.age)) + '\\b'), /\bmale\b|\bfemale\b|\bman\b|\bwoman\b|\bgentleman\b|\blady\b|\bm\b|\bf\b|y\/?o|year/], points: 1, source: 'Patient' });
    if (enc.room) add({ box: 'id', label: 'Room / unit', expected: `${safe(enc.location)} ${safe(enc.room)}`.trim(), type: 'any', any: [new RegExp('\\b' + reEsc(String(enc.room).toLowerCase()) + '\\b'), ...sigWords(enc.location, 3).map(w => new RegExp(stem(w)))], points: 1, source: 'Encounter' });
    const code = safe(enc.codeStatus, 'Full Code'), isFull = /full/i.test(code);
    add({ box: 'id', label: 'Code status', expected: code, type: 'any', any: [isFull ? /full code|full/ : /dnr|do not resus|dni|no code|comfort|dnar/], points: 2, critical: true, source: 'Encounter',
      error: { re: isFull ? /\bdnr\b|do not resus|no code/ : /full code/, text: `You said the wrong code status. The chart says ${code}.` } });
    const allergies = (pt.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
    if (allergies.length) add({ box: 'id', label: 'Allergies and reactions', expected: allergies.map(a => `${a.substance}${a.reaction ? ' (' + a.reaction + ')' : ''}`).join('; '), type: 'tokens', words: uniq(allergies.flatMap(a => sigWords(a.substance, 2))), need: Math.min(allergies.length, 2), points: 2, critical: true, source: 'Allergies',
      error: { re: /nkda|no known (drug )?allergies|no allergies/, text: 'You said there are no allergies, but the patient has documented allergies.' } });
    else add({ box: 'id', label: 'Allergies (none known)', expected: 'No known drug allergies', type: 'any', any: [/nkda|no known|no allergies|allerg/], points: 1, critical: true, source: 'Allergies' });
    if (enc.isolation && !/^none$/i.test(enc.isolation)) add({ box: 'id', label: 'Isolation precautions', expected: enc.isolation, type: 'tokens', words: sigWords(enc.isolation, 3).concat(['isolation']), need: 1, points: 1, critical: true, source: 'Encounter' });

    // ---- illness severity
    const flagged = obs.filter(o => o.type === 'vital' && o.flag && o.collected >= start);
    const crit = obs.filter(o => o.type === 'lab' && /critical/i.test(safe(o.flag)) && o.collected >= start);
    const trig = (cc.triggers || [])[0], trigOn = trig && String(trig.onset) <= now;
    const severity = (trigOn || crit.length || flagged.some(o => o.code === 'SPO2' || o.code === 'BP')) ? 'unstable' : flagged.length ? 'watcher' : 'stable';
    add({ box: 'id', label: 'Illness severity (stable, watcher or unstable)', expected: `${severity} (${severity === 'stable' ? 'no abnormal vital signs this shift' : severity === 'watcher' ? 'some abnormal vital signs this shift' : 'a significant change this shift'})`, type: 'any', any: [/stable|unstable|watcher|watch|critical|sick|improving|worsening|declining|deteriorat|concern/], points: 2, source: 'Vital signs and results',
      error: severity === 'unstable' ? { re: /\b(stable|doing well|doing fine|no concerns)\b(?!.{0,15}(until|before))/, text: 'You described the patient as stable, but something significant changed this shift (unstable / needs close watching).' } : null });

    // ---- situation / background
    const dx = safe(enc.diagnosis || (cc.caseMeta || {}).title);
    add({ box: 'sb', label: 'Primary diagnosis / reason for admission', expected: dx, type: 'tokens', words: sigWords(dx, 5), need: Math.min(2, Math.max(1, sigWords(dx, 5).length)), points: 2, critical: true, source: 'Encounter' });
    if (enc.chiefComplaint) add({ box: 'sb', label: 'How the patient presented', expected: safe(enc.chiefComplaint), type: 'tokens', words: sigWords(enc.chiefComplaint, 5), need: 1, points: 1, source: 'Encounter' });
    const hd = enc.hospitalDay;
    if (hd) add({ box: 'sb', label: 'Hospital day (or post-op day)', expected: `Hospital day ${hd}`, type: 'any', any: [new RegExp('(day|hd)\\s*#?\\s*' + hd + '\\b'), /pod\s*\d|post.?op(erative)? day|day (one|two|three|four|five|six|seven)|admitted/], points: 1, source: 'Encounter' });
    const chronic = (vis.problems || cc.problems || []).filter(p => /chronic/i.test(safe(p.status))).slice(0, 5);
    chronic.forEach(p => add({ box: 'sb', label: `History: ${safe(p.name)}`, expected: safe(p.name), type: 'tokens', words: sigWords(p.name, 4), need: 1, points: 1, source: 'Problem list' }));
    const surg = (vis.orders || []).filter(o => /surgery|procedure/i.test(safe(o.category)) && /completed/i.test(safe(o.status)));
    surg.slice(0, 2).forEach(o => add({ box: 'sb', label: `Procedure this admission: ${safe(o.name)}`, expected: safe(o.name), type: 'tokens', words: sigWords(o.name, 4), need: 1, points: 2, critical: true, source: 'Orders' }));

    // ---- vital signs (latest set)
    const vitals = latestBy(obs.filter(o => o.type === 'vital'), o => o.code);
    const V = c => vitals.find(o => o.code === c);
    const addNum = (code, label, kw, tol, extra) => {
      const o = V(code); if (!o) return; const v = parseFloat(String(o.value)); if (isNaN(v)) return;
      add(Object.assign({ box: 'as', label, expected: `${safe(o.value)}${o.units ? ' ' + o.units : ''}`, type: 'num', kw, value: v, tol, points: o.flag ? 2 : 1, critical: !!o.flag, source: 'Vital signs ' + safe(o.collected).slice(11) }, extra || {}));
    };
    addNum('HR', 'Heart rate', /heart rate|\bhr\b|pulse|\bbpm\b/, 6);
    const bp = V('BP');
    if (bp) { const [s, d] = String(bp.value).split('/').map(Number); add({ box: 'as', label: 'Blood pressure', expected: safe(bp.value), type: 'bp', sys: s, dia: d, points: bp.flag ? 2 : 1, critical: !!bp.flag, source: 'Vital signs ' + safe(bp.collected).slice(11) }); }
    addNum('RR', 'Respiratory rate', /resp(?:iratory)? rate|\brr\b|respirations?|breathing|breaths/, 3);
    addNum('SPO2', 'Oxygen saturation', /sp?o2|sat\b|sats|saturation|pulse ox|oxygen/, 3);
    addNum('TEMP', 'Temperature', /temp(?:erature)?|\bt\b|febrile|fever/, 0.6);
    addNum('PAIN', 'Pain score', /pain/, 1);
    add({ box: 'as', label: 'Oxygen delivery (room air or device and flow)', expected: (() => { const a = obs.filter(o => o.type === 'assessment' && /oxygen device/i.test(o.label)).sort((x, y) => String(x.collected).localeCompare(String(y.collected))).pop(); return a ? safe(a.value) : 'Room air'; })(), type: 'any', any: [/room air|\bra\b|nasal|cannula|\bnc\b|mask|non.?rebreather|\bl\/min|liters?|\d+ ?l\b|venturi|bipap|cpap|oxygen/], points: 1, source: 'Flowsheet' });

    // ---- findings by system (latest per label)
    const assess = latestBy(obs.filter(o => o.type === 'assessment'), o => `${o.section}|${o.label}`);
    const bySection = {};
    assess.forEach(a => { (bySection[a.section] = bySection[a.section] || []).push(a); });
    const FP = window.FlowsheetPractice;
    Object.keys(bySection).forEach(sec => {
      const list = bySection[sec], text = list.map(a => safe(a.value)).join('; ');
      const abn = list.some(a => a.abnormal || (FP && FP.isAbn && FP.isAbn(FP.tagsOf(safe(a.value)))));
      if (/braden|safety/i.test(sec) && !abn) return;
      const words = sigWords(text, 10);
      add({ box: 'as', label: `${sec} findings`, expected: list.map(a => `${safe(a.label)}: ${safe(a.value)}`).join('; '), type: 'section', sec, words, need: Math.max(1, Math.ceil(words.length * 0.35)), abnormal: abn, points: abn ? 2 : 1, critical: abn, source: 'Flowsheet' });
    });

    // ---- labs: abnormal and critical (latest of each)
    const labs = latestBy(obs.filter(o => o.type === 'lab' && /^-?\d/.test(safe(o.value))), o => o.code).filter(o => o.flag);
    const SKIP_LABS = new Set(['Hematocrit', 'Hemoglobin A1c', '25-OH Vitamin D', 'eGFR', 'Albumin', 'Prealbumin', 'Total protein', 'MCV']);
    labs.splice(0, labs.length, ...labs.filter(o => !SKIP_LABS.has(o.code)));
    labs.sort((a, b) => (/critical/i.test(safe(b.flag)) ? 1 : 0) - (/critical/i.test(safe(a.flag)) ? 1 : 0));
    labs.slice(0, 5).forEach(o => {
      const v = parseFloat(o.value), kw = LAB_KW[o.code] || new RegExp(reEsc(safe(o.code).toLowerCase()));
      add({ box: 'as', label: `Lab: ${safe(o.label)} (${safe(o.flag)})`, expected: `${safe(o.value)} ${safe(o.units)}`.trim(), type: 'num', kw, value: v, tol: Math.max(Math.abs(v) * 0.06, 0.15), points: /critical/i.test(safe(o.flag)) ? 2 : 1, critical: /critical/i.test(safe(o.flag)), source: 'Lab ' + safe(o.collected).slice(5, 16) });
    });
    if (!labs.length) add({ box: 'as', label: 'Labs (reviewed; nothing abnormal)', expected: 'No abnormal results', type: 'any', any: [/\blabs?\b|results?|bloodwork|blood work/], points: 1, source: 'Labs' });

    // ---- lines, drains, I&O, diet, activity
    (vis.devices || cc.devices || []).filter(d => !/removed/i.test(safe(d.status))).slice(0, 5).forEach(d => {
      const w = sigWords(`${safe(d.type)} ${safe(d.deviceType)}`, 4);
      add({ box: 'as', label: `Line / device: ${safe(d.type)}${d.location ? ' (' + safe(d.location) + ')' : ''}`, expected: `${safe(d.type)} ${safe(d.location)} - ${safe(d.status)}`.trim(), type: 'tokens', words: w.concat(/peripheral iv|iv/i.test(safe(d.type)) ? ['iv', 'line'] : []), need: 1, points: 1, source: 'Devices' });
    });
    if ((vis.ioEvents || []).length) add({ box: 'as', label: 'Intake and output / urine output', expected: 'Intake, output and voiding status', type: 'any', any: [/intake|output|\bi&o\b|\bi and o\b|urine|void|foley|ins and outs/], points: 1, source: 'I&O' });
    if (enc.dietOrder) add({ box: 'as', label: 'Diet', expected: safe(enc.dietOrder), type: 'tokens', words: sigWords(enc.dietOrder, 4).concat(/npo/i.test(safe(enc.dietOrder)) ? ['npo'] : []), need: 1, points: 1, source: 'Encounter' });
    if (enc.ambulationOrder || enc.fallRisk) add({ box: 'as', label: 'Activity and fall risk', expected: `${safe(enc.ambulationOrder)}; fall risk ${safe(enc.fallRisk)}`, type: 'any', any: [/fall|ambulat|walk|bed ?rest|assist|activity|mobil|up with|bedside commode|walker/], points: 1, critical: /high/i.test(safe(enc.fallRisk)), source: 'Encounter' });

    // ---- what happened this shift
    if (trigOn) {
      const kw = sigWords(trig.label, 6).concat(/embol/i.test(trig.label) ? ['clot', 'pe'] : []);
      add({ box: 'as', label: `Event this shift: ${safe(trig.label)}`, expected: `${safe(trig.label)} starting ${safe(trig.onset).slice(11)}`, type: 'tokens', words: kw, need: 1, points: 3, critical: true, source: 'Scenario' });
      add({ box: 'as', label: 'What you did about it (called the provider / rapid response, oxygen, monitoring)', expected: 'Provider or rapid response notified; oxygen and monitoring started; orders carried out', type: 'any', any: [/rapid|called|notified|paged|provider|doctor|\bmd\b|hospitalist|escalat/], points: 2, critical: true, source: 'Scenario' });
    }
    const given = (vis.administrations || []).filter(a => /given|held|refused|not given/i.test(safe(a.state)) && safe(a.administeredAt) > start);
    const orderOf = id => (vis.orders || []).find(o => o.id === id) || {};
    const baseName = o => safe(o.name).toLowerCase().replace(/\(.*?\)/g, ' ').split(/\s+/).filter(w => w.length > 3 && !/tablet|injection|capsule|solution|infusion|ivpb|nebulizer/.test(w))[0] || safe(o.name).toLowerCase().split(' ')[0];
    if (given.length) add({ box: 'ac', label: 'Medications given or held this shift', expected: uniq(given.map(a => baseName(orderOf(a.orderId)))).join(', '), type: 'tokens', words: uniq(given.map(a => baseName(orderOf(a.orderId)))).slice(0, 6), need: 1, points: 2, source: 'MAR' });

    const nowMs = (parseSimDate(simulationTime) || new Date()).getTime();
    const dueSoon = (vis.administrations || []).filter(a => /due/i.test(safe(a.state))).sort((x, y) => ((orderOf(y.orderId).medication || {}).highAlert ? 1 : 0) - ((orderOf(x.orderId).medication || {}).highAlert ? 1 : 0)).map(a => ({ a, d: parseSimDate(combineSimDateAndClock(a.time)) })).filter(x => x.d && x.d.getTime() >= nowMs - 30 * 60000 && x.d.getTime() <= nowMs + 4 * 3600000);
    const seen = new Set(); let routine = 0;
    dueSoon.forEach(x => {
      const o = orderOf(x.a.orderId), nm = baseName(o); if (!o.id || seen.has(nm) || seen.size >= 4) return;
      if (!(o.medication && o.medication.highAlert) && routine >= 2) return; if (!(o.medication && o.medication.highAlert)) routine++; seen.add(nm);
      const hi = !!(o.medication && o.medication.highAlert);
      add({ box: 'ac', label: `Due soon: ${safe(o.name)} ${safe(x.a.time)}${hi ? ' (high-alert)' : ''}`, expected: `${safe(o.name)} due ${safe(x.a.time)}`, type: 'tokens', words: [nm], need: 1, points: hi ? 2 : 1, critical: hi, source: 'MAR' });
    });
    (vis.orders || []).filter(o => safe(o.category) === 'Medication' && /continuous/i.test(safe((o.mar || {}).category)) && /active|pending/i.test(safe(o.status)) && (vis.administrations || []).some(a => a.orderId === o.id && /given|due/i.test(safe(a.state)))).slice(0, 3).forEach(o => {
      add({ box: 'ac', label: `Infusion: ${safe(o.name)}`, expected: `${safe(o.name)} ${safe(o.medication && o.medication.dose)}`, type: 'tokens', words: [baseName(o)], need: 1, points: 2, critical: true, source: 'MAR' });
    });
    const pending = (vis.orders || []).filter(o => /imaging|laborator|cardiac|consult|surgery/i.test(safe(o.category)) && /pending|active/i.test(safe(o.status)) && String(o.start) >= start).slice(0, 4);
    pending.forEach(o => add({ box: 'ac', label: `Pending / new: ${safe(o.name)}`, expected: safe(o.name), type: 'tokens', words: sigWords(o.name, 4), need: 1, points: 1, source: 'Orders' }));
    const results = (vis.notes || []).filter(n => n.study && String(n.datetime) >= start).slice(0, 3);
    results.forEach(n => add({ box: 'ac', label: `Result back: ${safe(n.study)}`, expected: `${safe(n.study)}: ${safe(n.impression || n.summary).slice(0, 110)}`, type: 'tokens', words: sigWords(n.study, 4), need: 1, points: 1, source: 'Results' }));

    // ---- contingency and synthesis
    add({ box: 'co', label: 'At least one if-then plan (what to watch and who to call)', expected: 'For example: if SpO2 drops below 90% or SBP falls below 90, call the provider / rapid response', type: 'any', any: [/\bif\b[^.]{0,90}\b(call|notify|escalat|rapid|page|increase|drop|worsen|change|below|above|goes|gets)/, /watch for|keep an eye|look out for|call (me|the|if)/], points: 2, critical: true, source: 'Contingency' });
    add({ box: 'co', label: 'Specific watch parameter with a number (for example SpO2 below 90, SBP below 90, glucose below 70)', expected: 'A concrete threshold the next nurse should act on', type: 'any', any: [/(below|under|less than|above|over|greater than|>|<)\s*\d/, /\d+\s*(or )?(below|under|less|above|over|higher|lower)/], points: 1, source: 'Contingency' });
    add({ box: 'co', label: 'Invites questions or reads back (closed-loop communication)', expected: 'Ask "any questions?" or have the receiving nurse repeat the plan', type: 'any', any: [/question|clarif|read.?back|repeat (that|back)|anything else|any concerns|does that make sense|understand/], points: 1, source: 'Communication' });

    items.forEach((it, i) => { it.id = 'h' + i; });
    return { items, total: items.reduce((s, i) => s + i.points, 0), severity, at: now };
  }

  // ------------------------------------------------------------------ score a report
  function scoreItem(it, boxText, allText) {
    const test = text => {
      if (it.type === 'any') return it.any.some(r => r.test(text)) ? 1 : 0;
      if (it.type === 'all') return it.all.every(r => r.test(text)) ? 1 : 0;
      if (it.type === 'tokens') return it.words.length && hits(text, it.words) >= Math.min(it.need, it.words.length) ? 1 : 0;
      if (it.type === 'section') {
        const k = SECTION_KW[it.sec]; const n = hits(text, it.words);
        if (n >= it.need) return 1;
        if (!it.abnormal && k && k.test(text) && NORMAL_RE.test(text)) return 1;
        return k && k.test(text) && n >= 1 ? 0.5 : 0;
      }
      if (it.type === 'num') {
        if (!hasKw(text, it.kw)) return 0;
        const nums = numsNear(text, it.kw);
        if (nums.some(n => Math.abs(n - it.value) <= it.tol)) return 1;
        if (nums.length) return { wrong: nums[0] };
        return 0.4;
      }
      if (it.type === 'bp') {
        const m = [...text.matchAll(/(\d{2,3})\s*(?:\/|over)\s*(\d{2,3})/g)];
        if (m.some(x => Math.abs(+x[1] - it.sys) <= 8 && Math.abs(+x[2] - it.dia) <= 8)) return 1;
        if (m.length) return { wrong: `${m[0][1]}/${m[0][2]}` };
        return /blood pressure|\bbp\b|hypotens|hypertens/.test(text) ? 0.4 : 0;
      }
      return 0;
    };
    const a = test(boxText);
    if (a === 1) return { got: it.points, status: 'full' };
    const b = test(allText);
    if (b === 1) return { got: it.points * 0.6, status: 'other', note: 'Mentioned, but in a different part of your report.' };
    const wrong = [a, b].find(x => x && typeof x === 'object');
    if (wrong) return { got: 0, status: 'wrong', note: `You said ${wrong.wrong}; the chart shows ${it.expected}.` };
    const m = Math.max(+a || 0, +b || 0);
    if (m > 0) return { got: it.points * m, status: 'partial', note: it.type === 'num' ? 'You mentioned it but gave no number close to the chart.' : 'Partly covered.' };
    return { got: 0, status: 'miss' };
  }

  function score(texts) {
    const rub = buildRubric(); if (!rub) return null;
    const boxOf = id => norm(texts[id] || ''), all = norm(Object.values(texts).join(' . '));
    const errors = [];
    const res = rub.items.map(it => {
      const s = scoreItem(it, boxOf(it.box), all);
      if (it.error && it.error.re.test(all)) { errors.push(it.error.text); s.error = it.error.text; }
      return Object.assign({ item: it }, s);
    });
    const earned = Math.max(0, res.reduce((n, r) => n + r.got, 0) - errors.length * 2);
    return { rubric: rub, results: res, errors, earned: Math.round(earned * 10) / 10, total: rub.total, pct: rub.total ? Math.round(100 * earned / rub.total) : 0 };
  }

  // ------------------------------------------------------------------ dialog
  let recog = null;
  function ensureDialog() {
    let dlg = $('handoffDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'handoffDialog'; dlg.className = 'handoff-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Give handoff report</h2><p>Give report to the next nurse about this patient <b>as the chart stands now</b>. Type it, or tap the microphone and speak. Your report is scored against a rubric built from this patient's chart.</p></div><button id="hoClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="ho-actions"><button id="hoFmtFive" class="primary-button">Five-part report</button> <button id="hoFmtIpass" class="secondary-button">I-PASS</button></div><div id="hoForm"></div>
        <div class="ho-actions"><button id="hoScore" class="primary-button">Score my report</button> <button id="hoClear" class="secondary-button">Clear</button> <button id="hoRubric" class="secondary-button">Faculty: view rubric</button></div>
        <div id="hoResult"></div><div id="hoHistory"></div></div>`;
    document.body.appendChild(dlg);
    buildForm();
    $('hoClose').addEventListener('click', () => { stopMic(); dlg.close(); });
    $('hoScore').addEventListener('click', doScore);
    $('hoClear').addEventListener('click', () => { boxes().forEach(b => { $('ho_' + b.id).value = ''; }); $('hoResult').innerHTML = ''; });
    $('hoRubric').addEventListener('click', showRubric);
    $('hoFmtFive').addEventListener('click', () => { fmt = 'five'; buildForm(); });
    $('hoFmtIpass').addEventListener('click', () => { fmt = 'ipass'; buildForm(); });
    return dlg;
  }
  function buildForm() {
    stopMic();
    $('hoFmtFive').className = fmt === 'five' ? 'primary-button' : 'secondary-button'; $('hoFmtIpass').className = fmt === 'ipass' ? 'primary-button' : 'secondary-button';
    $('hoForm').innerHTML = boxes().map(b => `<div class="ho-box"><div class="ho-box-head"><b>${esc(b.title)}</b><button type="button" class="small-tool-button ho-mic" data-mic="${b.id}" title="Dictate">🎤 Speak</button></div><div class="ho-hint">${esc(b.hint)}</div><textarea id="ho_${b.id}" rows="4" placeholder="Say or type your report for this section..."></textarea></div>`).join('');
    $('hoResult').innerHTML = '';
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    $('handoffDialog').querySelectorAll('.ho-mic').forEach(btn => { if (!SR) btn.classList.add('hidden'); btn.addEventListener('click', () => toggleMic(btn, SR)); });
  }
  function stopMic() { if (recog) { try { recog.stop(); } catch (e) { /* ignore */ } recog = null; } document.querySelectorAll('.ho-mic').forEach(b => { b.classList.remove('rec'); b.textContent = '🎤 Speak'; }); }
  function toggleMic(btn, SR) {
    if (btn.classList.contains('rec')) { stopMic(); return; }
    stopMic();
    const ta = $('ho_' + btn.dataset.mic); recog = new SR(); recog.lang = 'en-US'; recog.continuous = true; recog.interimResults = false;
    recog.onresult = e => { let t = ''; for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript + ' '; if (t) ta.value = (ta.value ? ta.value.trim() + ' ' : '') + t.trim(); };
    recog.onerror = () => stopMic(); recog.onend = () => { btn.classList.remove('rec'); btn.textContent = '🎤 Speak'; };
    btn.classList.add('rec'); btn.textContent = '■ Stop'; try { recog.start(); } catch (e) { stopMic(); }
  }

  const sectionOf = id => BOXES.find(b => b.id === id);
  function doScore() {
    const texts = {}; boxes().forEach(b => { texts[b.id] = $('ho_' + b.id).value; });
    if (!Object.values(texts).join('').trim()) { $('hoResult').innerHTML = '<div class="lib-message error">Type or speak your report first.</div>'; return; }
    const s = score(toRubricTexts(texts)); if (!s) return;
    const mark = r => r.status === 'full' ? '<span class="ho-m ok">✔</span>' : r.status === 'miss' ? '<span class="ho-m bad">✖</span>' : r.status === 'wrong' ? '<span class="ho-m bad">✖</span>' : '<span class="ho-m part">◐</span>';
    let html = `<div class="ho-score"><div class="ho-pct ${s.pct >= 80 ? 'ok' : s.pct >= 60 ? 'part' : 'bad'}">${s.pct}%</div><div><b>${s.earned} of ${s.total} points</b><br><span class="fs-muted">Rubric built from the chart at ${esc(epicDate(s.rubric.at))}. Patient status: <b>${esc(s.rubric.severity)}</b>.</span></div></div>`;
    if (s.errors.length) html += `<div class="ho-errors"><b>Safety errors (−2 points each):</b><ul>${s.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`;
    const missedCrit = s.results.filter(r => r.item.critical && r.status !== 'full' && r.status !== 'other');
    if (missedCrit.length) html += `<div class="ho-errors warn"><b>Critical items to fix:</b><ul>${missedCrit.map(r => `<li>${esc(r.item.label)}: <span class="fs-muted">${esc(r.item.expected)}</span></li>`).join('')}</ul></div>`;
    BOXES.forEach(b => {
      const rs = s.results.filter(r => r.item.box === b.id); if (!rs.length) return;
      const got = rs.reduce((n, r) => n + r.got, 0), tot = rs.reduce((n, r) => n + r.item.points, 0);
      html += `<h3 class="ho-sec">${esc(b.title)} <span class="fs-muted">${Math.round(got * 10) / 10}/${tot}</span></h3><table class="fs-table ho-table"><tbody>${rs.map(r => `<tr class="${r.item.critical ? 'crit' : ''}"><td>${mark(r)}</td><td><b>${esc(r.item.label)}</b>${r.item.critical ? ' <span class="ho-crit">critical</span>' : ''}${r.status !== 'full' ? `<div class="fs-why">Chart: ${esc(r.item.expected)}${r.note ? ' — ' + esc(r.note) : ''}</div>` : ''}</td><td class="ho-pts">${Math.round(r.got * 10) / 10}/${r.item.points}</td></tr>`).join('')}</tbody></table>`;
    });
    $('hoResult').innerHTML = html;
    const hist = (currentCanonicalCase.handoff = currentCanonicalCase.handoff || { attempts: [] });
    hist.attempts.push({ at: simulationTime, format: fmt, pct: s.pct, earned: s.earned, total: s.total, errors: s.errors.length, texts, missed: s.results.filter(r => r.status === 'miss' || r.status === 'wrong').map(r => r.item.label) });
    try { persistCase(); } catch (e) { /* best effort */ }
    renderHistory();
    $('hoResult').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function renderHistory() {
    const h = currentCanonicalCase && currentCanonicalCase.handoff;
    $('hoHistory').innerHTML = h && h.attempts.length ? `<h3 class="ho-sec">Your attempts on this patient</h3><table class="fs-table"><tbody>${h.attempts.map((a, i) => `<tr><td>#${i + 1}</td><td>${esc(epicDate(a.at))}</td><td><b>${a.pct}%</b> (${a.earned}/${a.total})</td><td>${a.errors ? a.errors + ' safety error(s)' : 'no safety errors'}</td></tr>`).join('')}</tbody></table>` : '';
  }

  function showRubric() {
    const r = buildRubric(); if (!r) return;
    let html = `<p>Patient status: <b>${esc(r.severity)}</b>. Total <b>${r.total}</b> points. Items are built from the chart at ${esc(epicDate(r.at))}; advance the simulation clock to the end of the shift to build the end-of-shift rubric. A fact earns full credit in its own section, 60% if said in another section; a wrong number or a safety error scores zero (safety errors cost 2 points).</p>`;
    BOXES.forEach(b => {
      const rs = r.items.filter(i => i.box === b.id); if (!rs.length) return;
      html += `<h3>${esc(b.title)}</h3><table class="data-table"><thead><tr><th>Student should say</th><th>From the chart</th><th>Points</th></tr></thead><tbody>${rs.map(i => `<tr><td>${esc(i.label)}${i.critical ? ' <b>(critical)</b>' : ''}</td><td>${esc(i.expected)}<br><small>${esc(i.source)}</small></td><td>${i.points}</td></tr>`).join('')}</tbody></table>`;
    });
    NSWristband.showDialog('Handoff rubric', 'Print this for the grader. It is regenerated from the chart each time.', html);
  }

  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); $('hoResult').innerHTML = ''; renderHistory(); if (!dlg.open) dlg.showModal();
  }

  const btn = document.createElement('button'); btn.id = 'openHandoffBtn'; btn.className = 'top-link top-button'; btn.textContent = 'Handoff';
  const lib = $('openLibraryBtn'); if (lib && lib.parentNode) lib.parentNode.insertBefore(btn, lib);
  btn.addEventListener('click', open);

  window.Handoff = { buildRubric, score, open };
})();

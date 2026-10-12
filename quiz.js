/* NursingSim - chart quiz (v28). No AI and no internet needed.
   Questions are written by rules from the chart as it stands at the current simulation time: the patient's medications
   (purpose, class, hold reasons, high-alert, dose math, labs to check), allergies, labs, vital signs, lines, diagnosis,
   history, precautions, diet, code status, what is due next, and the event this shift.
   Each time the quiz is started it picks different questions (and shuffles the answers). Scores and wrong answers are saved with the patient.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, parseSimDate, combineSimDateAndClock, safe, escapeHtml, epicDate, persistCase,
   and on DrugGuide (druginfo.js) when it is loaded. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const uniq = a => Array.from(new Set(a));

  // ------------------------------------------------------------------ random tools (seeded, so a quiz can be rebuilt for printing)
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let R = rng(1);
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = a => a[Math.floor(R() * a.length)];
  const norm = s => String(s || '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

  // ------------------------------------------------------------------ general pools for wrong answers
  const DX_POOL = ['Community-acquired pneumonia', 'Acute decompensated heart failure', 'COPD exacerbation', 'Sepsis due to urinary tract infection', 'Diabetic ketoacidosis', 'Acute ischemic stroke', 'Small bowel obstruction', 'Acute pancreatitis', 'Cellulitis of the lower leg', 'Upper GI bleed', 'Hip fracture', 'Pulmonary embolism', 'Atrial fibrillation with rapid ventricular response', 'Acute kidney injury', 'Alcohol withdrawal', 'Acute appendicitis', 'NSTEMI', 'Hyponatremia', 'Seizure', 'Syncope'];
  const PROB_POOL = ['Hypertension', 'Type 2 diabetes mellitus', 'Hypothyroidism', 'Chronic kidney disease stage 3', 'Asthma', 'GERD', 'Atrial fibrillation', 'Osteoarthritis', 'Hyperlipidemia', 'Coronary artery disease', 'COPD', 'Heart failure with reduced ejection fraction', 'Obstructive sleep apnea', 'Depression', 'Osteoporosis', 'Gout', 'Migraine', 'Peripheral artery disease', 'Anemia of chronic disease', 'Seizure disorder', 'Benign prostatic hyperplasia', 'Hypothyroidism'];
  const DEVICE_POOL = ['Foley catheter', 'Central venous catheter (PICC)', 'Nasogastric tube', 'Chest tube', 'Surgical drain (Jackson-Pratt)', 'Peripheral IV', 'Tracheostomy', 'Midline catheter', 'Gastrostomy tube'];
  const DIET_POOL = ['NPO', 'Clear liquid diet', 'Cardiac diet (2 g sodium)', 'Consistent carbohydrate diet', 'Regular diet', 'Renal diet', 'Pureed diet with thickened liquids', 'Full liquid diet'];
  const REACTION_POOL = ['Hives', 'Anaphylaxis', 'Rash', 'Angioedema', 'Nausea and vomiting', 'Itching', 'Shortness of breath', 'Diarrhea'];
  const ISO_POOL = ['None (standard precautions)', 'Contact precautions', 'Droplet precautions', 'Airborne precautions', 'Contact plus droplet precautions', 'Neutropenic (protective) precautions'];
  const CODE_POOL = ['Full Code', 'DNR (do not resuscitate)', 'DNR / DNI (do not intubate)', 'Comfort measures only'];
  const SCENARIO_RIGHT = 'Stay with the patient, assess airway, breathing and circulation, and call the provider or rapid response using SBAR';
  const SCENARIO_WRONG = ['Chart the finding and recheck at the next scheduled vital signs', 'Give a PRN medication first without assessing the patient', 'Wait and tell the oncoming nurse at the end of the shift', 'Ask the patient\'s family to watch and call back if it gets worse', 'Lower the head of the bed flat and leave the room to look for the charge nurse'];

  // ------------------------------------------------------------------ question builders
  // q = { id, cat, type: 'mc' | 'multi' | 'num', text, choices: [], answer: index | [indexes] | number, tol, units, why }
  function mc(cat, text, right, wrongs, why) {
    const w = uniq(wrongs.filter(x => x && norm(x) !== norm(right))); if (w.length < 2) return null;
    const choices = shuffle([right].concat(shuffle(w).slice(0, 3)));
    return { cat, type: 'mc', text, choices, answer: choices.indexOf(right), why };
  }
  function multi(cat, text, rights, wrongs, why) {
    const w = uniq(wrongs.filter(x => x && !rights.some(r => norm(r) === norm(x)))); if (rights.length < 1 || w.length < 2) return null;
    const choices = shuffle(rights.concat(shuffle(w).slice(0, Math.max(2, 5 - rights.length))));
    return { cat, type: 'multi', text, choices, answer: rights.map(r => choices.indexOf(r)).sort((a, b) => a - b), why };
  }
  const num = (cat, text, answer, units, tol, why) => ({ cat, type: 'num', text, answer, units: units || '', tol: tol || 0, why });

  function chartFacts() {
    const cc = currentCanonicalCase; if (!cc) return null;
    const vis = getVisibleCanonicalCase(cc), obs = vis.observations || [], enc = cc.encounter || {}, pt = cc.patient || {};
    const now = String(simulationTime), start = String((cc.timeline || {}).simulationStart || now);
    const latest = (list, key) => { const m = new Map(); list.slice().sort((a, b) => String(a.collected).localeCompare(String(b.collected))).forEach(o => m.set(key(o), o)); return [...m.values()]; };
    const meds = (vis.orders || []).filter(o => safe(o.category) === 'Medication' && o.medication && /active|pending|completed/i.test(safe(o.status)));
    const guideOf = o => (window.DrugGuide ? DrugGuide.lookup(o.name) : null);
    return { cc, vis, obs, enc, pt, now, start, meds, guideOf,
      vitals: latest(obs.filter(o => o.type === 'vital'), o => o.code),
      labs: latest(obs.filter(o => o.type === 'lab' && /^-?\d/.test(safe(o.value))), o => o.code) };
  }
  const shortName = o => safe(o.name).replace(/\s*(tablet|capsule|injection|solution|infusion|ivpb|nebulizer|suspension|patch|cream|ointment|\bER\b|\bXR\b)\b.*$/i, '').replace(/\s+/g, ' ').trim();
  const unitOf = o => (o.units && o.units !== '—') ? String(o.units) : '';
  const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/[,;:\s]+\S*$/, '') + '…' : s; };

  const GENERATORS = [
    // ---- medications
    F => { // what is it for
      const o = pick(shuffle(F.meds).filter(m => F.guideOf(m) && F.guideOf(m).use)); if (!o) return null; const g = F.guideOf(o);
      const wrongs = Object.values(DrugGuide.db).filter(d => d !== g && d.use && norm(d.use) !== norm(g.use)).map(d => clip(d.use, 90));
      return mc('Medications', `Your patient has an order for ${shortName(o)}. What is it mainly used for?`, clip(g.use, 90), wrongs, `${shortName(o)}: ${g.use}${o.rationale ? ' (Reason on this chart: ' + o.rationale + ')' : ''}`);
    },
    F => { // class
      const o = pick(shuffle(F.meds).filter(m => (m.medication.drugClass || (F.guideOf(m) || {}).cls))); if (!o) return null;
      const cls = clip(o.medication.drugClass || F.guideOf(o).cls, 60);
      const wrongs = F.meds.map(m => clip(m.medication.drugClass || '', 60)).concat(window.DrugGuide ? Object.values(DrugGuide.db).map(d => clip(d.cls, 60)) : []);
      return mc('Medications', `Which drug class does ${shortName(o)} belong to?`, cls, wrongs, `${shortName(o)} is a ${cls}.`);
    },
    F => { // hold reasons
      const o = pick(shuffle(F.meds).filter(m => { const g = F.guideOf(m); return g && g.hold && g.hold.length; })); if (!o) return null; const g = F.guideOf(o);
      const wrongs = Object.values(DrugGuide.db).filter(d => d !== g && d.hold && d.hold.length).map(d => clip(d.hold[0], 90));
      return mc('Medications', `Which of these is a reason to hold ${shortName(o)} and call the provider?`, clip(g.hold[0], 90), wrongs, `Hold ${shortName(o)} and call the provider: ${g.hold.join('; ')}.`);
    },
    F => { // high alert
      const hi = F.meds.filter(m => m.medication.highAlert), lo = F.meds.filter(m => !m.medication.highAlert);
      if (!hi.length || lo.length < 2) return null; const o = pick(hi);
      return mc('Medication safety', 'Which of this patient\'s medications is a HIGH-ALERT medication that needs an independent double check?', shortName(o), lo.map(shortName), `${shortName(o)} is a high-alert medication (${o.medication.drugClass || 'high risk of harm if given wrong'}). Use an independent double check per policy.`);
    },
    F => { // what to check first
      const o = pick(shuffle(F.meds).filter(m => (m.medication.monitoringRules || []).length)); if (!o) return null;
      const rules = uniq(o.medication.monitoringRules.map(r => r.label)); const right = pick(rules);
      const others = uniq(F.labs.map(l => safe(l.label)).concat(['Magnesium', 'Lactate', 'TSH', 'Troponin', 'Hemoglobin A1c', 'Ammonia', 'Uric acid', 'Lipase']).filter(l => !rules.some(r => norm(r) === norm(l))));
      return mc('Medications', `Before giving ${shortName(o)}, what should you check or review?`, right, others, `For ${shortName(o)} this chart lists: ${rules.join(', ')}.`);
    },
    F => { // oral dose math
      const o = pick(shuffle(F.meds).filter(m => /oral|po\b/i.test(safe(m.medication.route)) && /^\d+(\.\d+)?\s*mg$/i.test(safe(m.medication.dose)) && !(m.medication.prn && false))); if (!o) return null;
      const dose = parseFloat(o.medication.dose), ks = [2, 3, 4].filter(k => Number.isInteger(dose / k) && dose / k >= 1); if (!ks.length) return null; const k = pick(ks);
      return num('Dose math', `The order is ${shortName(o)} ${o.medication.dose} by mouth. The pharmacy supplied ${dose / k} mg tablets. How many tablets do you give?`, k, 'tablets', 0, `${dose} mg ÷ ${dose / k} mg per tablet = ${k} tablets.`);
    },
    F => { // injectable dose math
      const o = pick(shuffle(F.meds).filter(m => /iv|im|sub|inj/i.test(safe(m.medication.route)) && /^\d+(\.\d+)?\s*mg$/i.test(safe(m.medication.dose)))); if (!o) return null;
      const dose = parseFloat(o.medication.dose), cs = [2, 4, 5, 10, 20, 25, 40, 50].filter(c => { const v = dose / c; return v >= 0.5 && v <= 10 && Math.abs(v * 2 - Math.round(v * 2)) < 1e-9; }); if (!cs.length) return null; const c = pick(cs);
      return num('Dose math', `The order is ${shortName(o)} ${o.medication.dose} ${safe(o.medication.route)}. The vial is labeled ${c} mg/mL. How many mL do you draw up?`, dose / c, 'mL', 0.01, `${dose} mg ÷ ${c} mg/mL = ${dose / c} mL.`);
    },
    F => { // next due
      const due = (F.vis.administrations || []).filter(a => /due/i.test(safe(a.state))).map(a => ({ a, d: parseSimDate(combineSimDateAndClock(a.time)), o: (F.vis.orders || []).find(o => o.id === a.orderId) })).filter(x => x.d && x.o && x.o.medication).sort((x, y) => x.d - y.d);
      if (!due.length) return null; const first = due[0], rightName = shortName(first.o);
      const others = due.filter(x => shortName(x.o) !== rightName && x.d - first.d >= 3600000).map(x => shortName(x.o)).concat(F.meds.map(shortName));
      return mc('Medication safety', `Based on the MAR at ${safe(F.now).slice(11)}, which medication is due NEXT?`, rightName, others, `${rightName} is due at ${first.a.time}. Always check the MAR and the time window (usually 1 hour before to 1 hour after) before giving.`);
    },
    // ---- allergies, precautions, status
    F => {
      const al = (F.pt.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
      if (!al.length) return mc('Safety', 'What is this patient\'s allergy status?', 'No known drug allergies', ['Penicillin allergy (hives)', 'Sulfa allergy (rash)', 'Latex allergy', 'Iodine contrast allergy'], 'The allergy list says NKDA (no known drug allergies). Always confirm with the patient and the wristband.');
      const a = pick(al); if (a.reaction && R() < 0.6) return mc('Safety', `What reaction is documented for the patient's ${a.substance} allergy?`, a.reaction, REACTION_POOL, `The chart documents ${a.substance}: ${a.reaction}${a.severity ? ' (' + a.severity + ')' : ''}.`);
      return multi('Safety', 'Which of these allergies are documented for this patient? Select all that apply.', al.slice(0, 2).map(x => x.substance), ['Penicillin', 'Sulfa drugs', 'Latex', 'Iodine contrast', 'Codeine', 'Shellfish', 'Aspirin', 'Eggs'], `Documented allergies: ${al.map(x => x.substance + (x.reaction ? ' (' + x.reaction + ')' : '')).join('; ')}.`);
    },
    F => { const iso = safe(F.enc.isolation, 'None'); const right = /^none$/i.test(iso) ? 'None (standard precautions)' : iso;
      return mc('Safety', 'What isolation precautions does this patient need?', right, ISO_POOL, `Encounter isolation status: ${iso}.`); },
    F => { const code = safe(F.enc.codeStatus, 'Full Code'); const right = /^full/i.test(code) ? 'Full Code' : code;
      return mc('Safety', 'What is this patient\'s code status?', right, CODE_POOL, `The chart lists code status as ${code}.`); },
    F => { if (!F.enc.fallRisk) return null; return mc('Safety', 'What is this patient\'s fall risk level on the chart?', safe(F.enc.fallRisk), ['Low', 'Moderate', 'High', 'Not assessed'], `Fall risk: ${F.enc.fallRisk}${F.enc.ambulationOrder ? '. Activity order: ' + F.enc.ambulationOrder : ''}.`); },
    F => { if (!F.enc.dietOrder) return null; return mc('Orders', 'What is this patient\'s current diet order?', clip(F.enc.dietOrder, 70), DIET_POOL, `Diet order: ${F.enc.dietOrder}.`); },
    // ---- diagnosis and history
    F => { const dx = safe(F.enc.diagnosis); if (dx === '—') return null; return mc('Patient', 'What is the primary reason this patient was admitted?', dx, DX_POOL, `Primary diagnosis: ${dx}${F.enc.chiefComplaint ? '. Chief complaint: ' + F.enc.chiefComplaint : ''}.`); },
    F => { if (!F.enc.chiefComplaint) return null; return mc('Patient', `This patient has ${safe(F.enc.diagnosis)}. What was the chief complaint on arrival?`, safe(F.enc.chiefComplaint), ['Fever and chills', 'Chest pain', 'Severe headache', 'Abdominal pain and vomiting', 'Shortness of breath', 'Fall with leg pain', 'Dizziness and weakness'], `Chief complaint: ${F.enc.chiefComplaint}.`); },
    F => {
      const probs = (F.vis.problems || F.cc.problems || []).filter(p => /chronic/i.test(safe(p.status))); if (!probs.length) return null;
      const rights = shuffle(probs).slice(0, 2).map(p => safe(p.name)); const have = probs.map(p => norm(p.name).slice(0, 8));
      const wrongs = PROB_POOL.filter(x => !have.some(h => norm(x).startsWith(h) || h.startsWith(norm(x).slice(0, 8))));
      return multi('Patient', 'Which of these are part of this patient\'s medical history (problem list)? Select all that apply.', rights, wrongs, `Chronic problems on the chart: ${probs.map(p => p.name).join('; ')}.`);
    },
    F => {
      const dv = (F.vis.devices || F.cc.devices || []).filter(d => !/removed/i.test(safe(d.status))); if (!dv.length) return null; const d = pick(dv);
      const right = `${safe(d.type)}${d.location ? ' (' + safe(d.location) + ')' : ''}`;
      const have = dv.map(x => norm(x.type));
      return mc('Lines and devices', 'Which of these lines or devices does this patient currently have?', right, DEVICE_POOL.filter(x => !have.some(h => norm(x).includes(h) || h.includes(norm(x)))), `Active devices: ${dv.map(x => x.type + (x.location ? ' (' + x.location + ')' : '')).join('; ')}.`);
    },
    // ---- vital signs and labs
    F => {
      const abn = F.vitals.filter(v => v.flag), nor = F.vitals.filter(v => !v.flag && v.code !== 'PAIN'); if (!abn.length || nor.length < 2) return null;
      const f = v => `${safe(v.label)} ${safe(v.value)}${v.units && !String(v.value).includes(v.units) ? ' ' + v.units : ''}`;
      const right = f(pick(abn));
      return mc('Vital signs', 'Which of the patient\'s most recent vital signs is OUTSIDE the normal range?', right, nor.map(f), `The flagged vital sign(s) at the latest check: ${abn.map(f).join('; ')}. Recheck, assess the patient and report as needed.`);
    },
    F => { const v = F.vitals.find(x => x.code === 'HR') || null; if (!v || isNaN(parseFloat(v.value))) return null; return num('Vital signs', `What is the patient's most recent heart rate (as of ${safe(F.now).slice(11)})? Enter the number.`, parseFloat(v.value), 'bpm', 0, `Latest heart rate: ${v.value} bpm at ${safe(v.collected).slice(11)}.`); },
    F => { const v = F.vitals.find(x => x.code === 'SPO2'); if (!v || isNaN(parseFloat(v.value))) return null; return num('Vital signs', 'What is the patient\'s most recent oxygen saturation (SpO2)? Enter the number.', parseFloat(v.value), '%', 0, `Latest SpO2: ${v.value}% at ${safe(v.collected).slice(11)}.`); },
    F => {
      const abn = F.labs.filter(l => l.flag); if (!abn.length) return null; const l = pick(abn), crit = /critical/i.test(safe(l.flag)), hi = /high|elev|\bh\b/i.test(safe(l.flag)), low = /low|\bl\b/i.test(safe(l.flag));
      const right = crit ? 'Critical value: call the provider right away' : hi ? 'Abnormal: above the normal range' : low ? 'Abnormal: below the normal range' : 'Abnormal: outside the normal range';
      return mc('Labs', `The latest ${safe(l.label)} is ${safe(l.value)} ${unitOf(l)} (normal ${safe(l.reference, 'see lab')}). What does this mean?`, right,
        ['Normal: no action needed', 'Critical value: call the provider right away', 'Abnormal: above the normal range', 'Abnormal: below the normal range', 'Cannot be interpreted without a repeat test'], `${safe(l.label)} ${safe(l.value)} ${unitOf(l)}; reference ${safe(l.reference)}; flagged ${safe(l.flag)}.`);
    },
    F => {
      const abn = F.labs.filter(l => l.flag && !/hemoglobin a1c|egfr|vitamin d/i.test(safe(l.label))), nor = F.labs.filter(l => !l.flag); if (!abn.length || nor.length < 2) return null;
      const f = l => `${safe(l.label)} ${safe(l.value)} ${unitOf(l)}`.trim(); const l = pick(abn);
      return mc('Labs', 'Which of the patient\'s most recent lab results is ABNORMAL?', f(l), nor.map(f), `${f(l)} is flagged ${safe(l.flag)} (reference ${safe(l.reference)}).`);
    },
    F => { const l = F.labs.find(x => /critical/i.test(safe(x.flag))); if (!l) return null; const f = x => safe(x.label);
      return mc('Labs', 'Which of the patient\'s latest labs is flagged as a CRITICAL value?', f(l), F.labs.filter(x => !/critical/i.test(safe(x.flag))).map(f), `${f(l)} ${safe(l.value)} ${unitOf(l)} is critical. Critical values are reported to the provider right away and documented with read-back.`); },
    // ---- the event this shift
    F => { const t = (F.cc.triggers || [])[0]; if (!t || String(t.onset) > F.now) return null; return mc('Priorities', `At ${safe(t.onset).slice(11)} the patient develops a change: ${safe(t.label)}. What is the BEST first action?`, SCENARIO_RIGHT, SCENARIO_WRONG, 'When a patient changes, assess first (airway, breathing, circulation), stay with the patient, get help, and communicate with SBAR. Never delay reporting a significant change.'); }
  ];

  // each generator may run more than once (different random pick); try to reach n questions with variety
  function generate(n, seed) {
    R = rng(seed || (Date.now() & 0xffffff)); const F = chartFacts(); if (!F) return [];
    const out = [], seen = new Set(), counts = GENERATORS.map(() => 0);
    const order = shuffle(GENERATORS.map((g, i) => i));
    let guard = 0;
    while (out.length < n && guard++ < n * 12) {
      const gi = order[guard % order.length]; if (counts[gi] >= 2) continue;
      let q = null; try { q = GENERATORS[gi](F); } catch (e) { q = null; }
      if (!q) { counts[gi] += 1; continue; }
      const key = q.text; if (seen.has(key)) continue;
      seen.add(key); counts[gi] += 1; q.id = 'q' + out.length; out.push(q);
    }
    return out;
  }

  // ------------------------------------------------------------------ grading
  function grade(q, ans) {
    if (q.type === 'mc') return ans === q.answer ? 1 : 0;
    if (q.type === 'num') { const v = parseFloat(String(ans).replace(/[^0-9.\-]/g, '')); return !isNaN(v) && Math.abs(v - q.answer) <= (q.tol || 0) + 1e-9 ? 1 : 0; }
    if (q.type === 'multi') { const a = (ans || []).slice().sort((x, y) => x - y); const right = q.answer.filter(i => a.includes(i)).length, wrong = a.filter(i => !q.answer.includes(i)).length; return Math.max(0, (right - wrong) / q.answer.length); }
    return 0;
  }
  const answerText = q => q.type === 'num' ? `${Math.round(q.answer * 100) / 100} ${q.units}`.trim() : q.type === 'mc' ? q.choices[q.answer] : q.answer.map(i => q.choices[i]).join('; ');
  const givenText = (q, ans) => q.type === 'num' ? (ans === '' || ans == null ? '(no answer)' : `${ans} ${q.units}`.trim()) : q.type === 'mc' ? (ans == null ? '(no answer)' : q.choices[ans]) : ((ans || []).length ? ans.map(i => q.choices[i]).join('; ') : '(no answer)');

  // ------------------------------------------------------------------ dialog
  let current = null; // { questions, answers: {}, at, graded }
  function ensureDialog() {
    let dlg = $('quizDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'quizDialog'; dlg.className = 'quiz-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Chart quiz</h2><p>Questions are written from <b>this patient's chart as it stands now</b>. No internet needed. Move the simulation clock and start again to get questions about newer results.</p></div><button id="qzClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="qz-setup"><label>Number of questions <select id="qzCount"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></label>
        <button id="qzStart" class="primary-button">Start new quiz</button> <button id="qzPrint" class="secondary-button hidden">Print quiz and answer key</button></div>
        <div id="qzBody"></div><div id="qzHistory"></div></div>`;
    document.body.appendChild(dlg);
    $('qzClose').addEventListener('click', () => dlg.close());
    $('qzStart').addEventListener('click', start);
    $('qzPrint').addEventListener('click', printQuiz);
    return dlg;
  }

  function start() {
    const n = parseInt($('qzCount').value, 10) || 10, seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
    const qs = generate(n, seed);
    if (!qs.length) { $('qzBody').innerHTML = '<div class="lib-message error">Not enough chart information to write questions yet.</div>'; return; }
    current = { questions: qs, answers: {}, at: String(simulationTime), graded: false, seed };
    render(); $('qzPrint').classList.remove('hidden');
  }

  function render() {
    const c = current; if (!c) return;
    const body = c.questions.map((q, i) => {
      const name = 'qz_' + i;
      let inner = '';
      if (q.type === 'mc') inner = q.choices.map((ch, j) => `<label class="qz-choice"><input type="radio" name="${name}" value="${j}"${c.answers[q.id] === j ? ' checked' : ''}${c.graded ? ' disabled' : ''}> <span>${esc(ch)}</span></label>`).join('');
      else if (q.type === 'multi') inner = q.choices.map((ch, j) => `<label class="qz-choice"><input type="checkbox" name="${name}" value="${j}"${(c.answers[q.id] || []).includes(j) ? ' checked' : ''}${c.graded ? ' disabled' : ''}> <span>${esc(ch)}</span></label>`).join('');
      else inner = `<input type="text" inputmode="decimal" class="qz-num" name="${name}" value="${esc(c.answers[q.id] == null ? '' : c.answers[q.id])}" placeholder="Type a number"${c.graded ? ' disabled' : ''}> <span class="fs-muted">${esc(q.units)}</span>`;
      let fb = '';
      if (c.graded) { const g = grade(q, c.answers[q.id]); fb = `<div class="qz-fb ${g >= 1 ? 'ok' : g > 0 ? 'part' : 'bad'}"><b>${g >= 1 ? '✔ Correct' : g > 0 ? '◐ Partly correct' : '✖ Not quite'}</b>${g < 1 ? ` You answered: ${esc(givenText(q, c.answers[q.id]))}. Correct answer: <b>${esc(answerText(q))}</b>.` : ''}<div class="fs-why">${esc(q.why)}</div></div>`; }
      return `<div class="qz-q" data-i="${i}"><div class="qz-cat">${esc(q.cat)} · question ${i + 1} of ${c.questions.length}${q.type === 'multi' ? ' · select all that apply' : ''}</div><div class="qz-text">${esc(q.text)}</div><div class="qz-choices">${inner}</div>${fb}</div>`;
    }).join('');
    $('qzBody').innerHTML = body + (c.graded ? `<div class="ho-actions"><button id="qzAgain" class="primary-button">New quiz</button></div>` : `<div class="ho-actions"><button id="qzSubmit" class="primary-button">Submit answers</button></div>`);
    $('qzBody').querySelectorAll('input').forEach(inp => inp.addEventListener('input', collect));
    const sub = $('qzSubmit'); if (sub) sub.addEventListener('click', submit);
    const again = $('qzAgain'); if (again) again.addEventListener('click', start);
  }
  function collect() {
    const c = current; if (!c || c.graded) return;
    c.questions.forEach((q, i) => {
      const els = $('qzBody').querySelectorAll(`[name="qz_${i}"]`);
      if (q.type === 'mc') { const ch = Array.from(els).find(e => e.checked); c.answers[q.id] = ch ? parseInt(ch.value, 10) : null; }
      else if (q.type === 'multi') c.answers[q.id] = Array.from(els).filter(e => e.checked).map(e => parseInt(e.value, 10));
      else c.answers[q.id] = els[0] ? els[0].value : '';
    });
  }
  function submit() {
    collect(); const c = current; if (!c) return;
    const unanswered = c.questions.filter(q => { const a = c.answers[q.id]; return a == null || a === '' || (Array.isArray(a) && !a.length); }).length;
    if (unanswered && !confirm(`${unanswered} question(s) are not answered. Submit anyway?`)) return;
    c.graded = true;
    const results = c.questions.map(q => ({ q, got: grade(q, c.answers[q.id]) }));
    const earned = results.reduce((s, r) => s + r.got, 0), pct = Math.round(earned / results.length * 100);
    const byCat = {}; results.forEach(r => { const b = (byCat[r.q.cat] = byCat[r.q.cat] || { got: 0, n: 0 }); b.got += r.got; b.n += 1; });
    render();
    const cats = Object.keys(byCat).map(k => `<span class="qz-chip">${esc(k)} ${Math.round(byCat[k].got * 10) / 10}/${byCat[k].n}</span>`).join(' ');
    $('qzBody').insertAdjacentHTML('afterbegin', `<div class="ho-score"><div class="ho-pct ${pct >= 80 ? 'ok' : pct >= 60 ? 'part' : 'bad'}">${pct}%</div><div><b>${Math.round(earned * 10) / 10} of ${results.length} correct</b><br>${cats}<br><span class="fs-muted">Questions came from the chart at ${esc(epicDate(c.at))}.</span></div></div>`);
    const hist = (currentCanonicalCase.quiz = currentCanonicalCase.quiz || { attempts: [] });
    hist.attempts.push({ at: c.at, pct, earned: Math.round(earned * 10) / 10, total: results.length, missed: results.filter(r => r.got < 1).map(r => r.q.text) });
    try { persistCase(); } catch (e) { /* best effort */ }
    renderHistory(); $('qzBody').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function renderHistory() {
    const h = currentCanonicalCase && currentCanonicalCase.quiz;
    $('qzHistory').innerHTML = h && h.attempts.length ? `<h3 class="ho-sec">Your quiz attempts on this patient</h3><table class="fs-table"><tbody>${h.attempts.map((a, i) => `<tr><td>#${i + 1}</td><td>${esc(epicDate(a.at))}</td><td><b>${a.pct}%</b> (${a.earned}/${a.total})</td></tr>`).join('')}</tbody></table>` : '';
  }

  function printQuiz() {
    const c = current; if (!c) return;
    const qs = c.questions.map((q, i) => `<div class="qz-print-q"><b>${i + 1}.</b> ${esc(q.text)}${q.type === 'multi' ? ' <i>(select all that apply)</i>' : ''}${q.type === 'num' ? `<div>Answer: ________ ${esc(q.units)}</div>` : `<ol type="A">${q.choices.map(ch => `<li>${esc(ch)}</li>`).join('')}</ol>`}</div>`).join('');
    const keyHtml = c.questions.map((q, i) => { const letters = q.type === 'num' ? '' : (q.type === 'mc' ? [q.answer] : q.answer).map(j => 'ABCDEFG'[j]).join(', '); return `<tr><td>${i + 1}</td><td>${letters ? letters + ': ' : ''}${esc(answerText(q))}</td><td>${esc(q.why)}</td></tr>`; }).join('');
    NSWristband.showDialog('Chart quiz', `${esc(safe(currentCanonicalCase.patient.name))} · chart at ${esc(epicDate(c.at))}. Page 2 is the answer key for faculty.`,
      `<div class="qz-print">${qs}<div style="page-break-before:always"></div><h3>Answer key</h3><table class="data-table"><thead><tr><th>#</th><th>Answer</th><th>Why</th></tr></thead><tbody>${keyHtml}</tbody></table></div>`);
  }

  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); $('qzBody').innerHTML = ''; current = null; $('qzPrint').classList.add('hidden'); renderHistory(); if (!dlg.open) dlg.showModal();
  }

  const btn = document.createElement('button'); btn.id = 'openQuizBtn'; btn.className = 'top-link top-button'; btn.textContent = 'Quiz';
  const lib = $('openLibraryBtn'); if (lib && lib.parentNode) lib.parentNode.insertBefore(btn, lib);
  btn.addEventListener('click', open);

  window.Quiz = { generate, grade, open };
})();

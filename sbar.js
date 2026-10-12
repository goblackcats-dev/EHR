/* NursingSim - SBAR provider call practice and prioritization practice (v29). No AI and no internet needed.
   SBAR: the student writes (or dictates) the call to the provider about this patient's most important problem. The problem is chosen by rules
   from the chart (an active trigger event, a critical lab, an abnormal vital sign, then the worst assessment). The call is scored against the chart facts.
   Prioritize: the student puts 6 things from the chart in the order they would do them. Scored by urgency tiers (airway/breathing/circulation and critical results first).
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, parseSimDate, combineSimDateAndClock, safe, escapeHtml, epicDate, persistCase, NSWristband. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9.%\/+ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const reEsc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const uniq = a => Array.from(new Set(a));
  const unit = o => (o.units && o.units !== '—') ? String(o.units) : '';

  function facts() {
    const cc = currentCanonicalCase; if (!cc) return null;
    const vis = getVisibleCanonicalCase(cc), obs = vis.observations || [], enc = cc.encounter || {}, pt = cc.patient || {};
    const now = String(simulationTime), start = String((cc.timeline || {}).simulationStart || now);
    const latest = (list, key) => { const m = new Map(); list.slice().sort((a, b) => String(a.collected).localeCompare(String(b.collected))).forEach(o => m.set(key(o), o)); return [...m.values()]; };
    return { cc, vis, obs, enc, pt, now, start,
      vitals: latest(obs.filter(o => o.type === 'vital'), o => o.code),
      labs: latest(obs.filter(o => o.type === 'lab' && /^-?\d/.test(safe(o.value))), o => o.code),
      assess: latest(obs.filter(o => o.type === 'assessment'), o => `${o.section}|${o.label}`) };
  }
  const BAD_VITAL = { SPO2: v => v < 92, BP: v => v < 90, HR: v => v > 120 || v < 50, RR: v => v > 24 || v < 10, TEMP: v => v >= 100.9 };
  const sysOf = o => parseFloat(String(o.value).split('/')[0]);
  const vnum = o => o.code === 'BP' ? sysOf(o) : parseFloat(String(o.value));
  const vtext = o => `${safe(o.label)} ${safe(o.value)}${unit(o) && !String(o.value).includes(unit(o)) ? ' ' + unit(o) : ''}`;

  // ------------------------------------------------------------------ the concern the nurse is calling about
  function concern(F) {
    const trig = (F.cc.triggers || [])[0];
    const badV = F.vitals.filter(o => o.flag && BAD_VITAL[o.code] && BAD_VITAL[o.code](vnum(o)));
    const crit = F.labs.filter(o => /critical/i.test(safe(o.flag)));
    const nums = [];
    badV.forEach(o => nums.push(String(o.value).split('/')[0].replace(/[^0-9.]/g, '')));
    const vitalsLine = F.vitals.filter(o => o.code !== 'PAIN').map(vtext).join(', ');
    if (trig && String(trig.onset) <= F.now) {
      return { kind: 'event', label: safe(trig.label), summary: `${safe(trig.label)} starting at ${safe(trig.onset).slice(11)}`, kw: sigKw(trig.label), evidence: badV.map(vtext).concat(crit.map(l => `${safe(l.label)} ${safe(l.value)}`)), nums: nums.concat(crit.map(l => String(parseFloat(l.value)))), vitalsLine, urgent: true, ask: 'Come to the bedside now or send the rapid response team; ask for orders (oxygen, fluids, labs, ECG or imaging as appropriate).' };
    }
    if (crit.length) { const l = crit[0]; return { kind: 'lab', label: `critical ${safe(l.label)}`, summary: `critical ${safe(l.label)} of ${safe(l.value)} ${unit(l)}`.trim(), kw: sigKw(l.label), evidence: [`${safe(l.label)} ${safe(l.value)} ${unit(l)}`.trim()], nums: [String(parseFloat(l.value))], vitalsLine, urgent: true, ask: 'Ask what to do about the critical value: orders to treat it and repeat the lab; give a read-back of the critical value.' }; }
    if (badV.length) { const o = badV[0]; return { kind: 'vital', label: `abnormal ${safe(o.label).toLowerCase()}`, summary: badV.map(vtext).join(', '), kw: sigKw(o.label).concat(o.code === 'SPO2' ? ['oxygen', 'sat', 'spo2'] : o.code === 'BP' ? ['pressure', 'bp', 'hypotens'] : o.code === 'HR' ? ['heart', 'pulse', 'tachy', 'brady'] : o.code === 'TEMP' ? ['temp', 'fever'] : ['resp', 'breath', 'rr']), evidence: badV.map(vtext), nums, vitalsLine, urgent: true, ask: 'Ask the provider to see the patient and for orders to correct it (fluids, oxygen, medication change, labs).' }; }
    const abn = F.assess.filter(a => a.abnormal);
    if (abn.length) { const a = abn[0]; return { kind: 'assess', label: `${safe(a.section)}: ${safe(a.label)}`, summary: `${safe(a.label)}: ${safe(a.value)}`, kw: sigKw(`${a.section} ${a.label} ${a.value}`).slice(0, 5), evidence: [`${safe(a.label)}: ${safe(a.value)}`], nums: [], vitalsLine, urgent: false, ask: 'Ask for an evaluation or an order to address the finding (medication, consult or test).' }; }
    const anyV = F.vitals.filter(o => o.flag && o.code !== 'PAIN');
    if (anyV.length) return { kind: 'vital', label: `abnormal ${safe(anyV[0].label).toLowerCase()}`, summary: anyV.map(vtext).join(', '), kw: sigKw(anyV[0].label).concat(['pressure', 'heart', 'pulse', 'resp', 'temp', 'oxygen', 'sat']).slice(0, 5), evidence: anyV.map(vtext), nums: anyV.map(o => String(o.value).split('/')[0].replace(/[^0-9.]/g, '')), vitalsLine, urgent: false, ask: 'Ask the provider to review the trend and for an order if needed (recheck, medication change, labs).' };
    const anyL = F.labs.filter(o => o.flag && !/a1c|egfr|vitamin|albumin|mcv|hematocrit/i.test(safe(o.label)));
    if (anyL.length) { const l = anyL[0]; return { kind: 'lab', label: `abnormal ${safe(l.label)}`, summary: `abnormal ${safe(l.label)} ${safe(l.value)} ${unit(l)}`.trim(), kw: sigKw(l.label), evidence: [`${safe(l.label)} ${safe(l.value)} ${unit(l)}`.trim()], nums: [String(parseFloat(l.value))], vitalsLine, urgent: false, ask: 'Ask whether to treat it or repeat the lab, and for the order.' }; }
    const pain = F.vitals.find(o => o.code === 'PAIN' && parseFloat(o.value) >= 5);
    if (pain) return { kind: 'pain', label: 'uncontrolled pain', summary: `pain ${String(pain.value).replace(/\/10$/, '')}/10`, kw: ['pain'], evidence: [`Pain ${String(pain.value).replace(/\/10$/, '')}/10`], nums: [String(parseFloat(pain.value))], vitalsLine, urgent: false, ask: 'Ask for a change in the pain plan (a different or stronger medication, a dose change).' };
    return { kind: 'general', label: 'no urgent problem right now', summary: 'No urgent problem on the chart. Practice with a routine request: a PRN order or clarification.', kw: [], evidence: [], nums: [], vitalsLine, urgent: false, ask: 'Ask for a specific order or clarification.' };
  }
  const STOP = new Set('with without that this have from were been will after before patient noted right left sound normal status level present chart given each every per and the for are not'.split(' '));
  function sigKw(text) { return uniq(norm(text).split(' ').filter(w => w.length >= 4 && !STOP.has(w)).map(w => w.slice(0, 5))).slice(0, 5); }

  // ------------------------------------------------------------------ SBAR rubric and scoring
  const BOXES = [
    { id: 's', title: 'S: Situation', hint: 'Who you are, which patient and room, what is wrong right now, and the numbers.' },
    { id: 'b', title: 'B: Background', hint: 'Why they are here, code status, allergies, pertinent history or medications.' },
    { id: 'a', title: 'A: Assessment', hint: 'What you think is going on and how urgent it is; what changed and when.' },
    { id: 'r', title: 'R: Recommendation / request', hint: 'Exactly what you want (come see the patient, an order, a test) and how soon; read back orders.' }
  ];
  function buildRubric(F, C) {
    const items = [], enc = F.enc, pt = F.pt;
    const add = it => items.push(Object.assign({ points: 1 }, it));
    const parts = safe(pt.name).split(/\s+/).filter(w => w.length > 1).map(w => w.toLowerCase());
    add({ box: 's', label: 'Introduce yourself (name and unit)', expected: `"This is [your name], RN on ${safe(enc.location)}"`, test: t => /\b(this is|my name|calling from|rn here|nurse)\b/.test(t) || /\b(rn|nurse)\b/.test(t), points: 1 });
    add({ box: 's', label: 'Patient name and room', expected: `${safe(pt.name)}, room ${safe(enc.room)}`, test: t => parts.some(p => t.includes(p)) && (!enc.room || t.includes(String(enc.room).toLowerCase())), partial: t => parts.some(p => t.includes(p)) || (enc.room && t.includes(String(enc.room).toLowerCase())), points: 2 });
    add({ box: 's', label: 'State the problem', expected: C.summary, test: t => C.kw.length ? C.kw.filter(k => t.includes(k)).length >= Math.min(2, C.kw.length) : /concern|calling|problem/.test(t), partial: t => C.kw.some(k => t.includes(k)), points: 2 });
    if (C.nums.length) add({ box: 's', label: 'Give the actual numbers', expected: C.evidence.join('; '), test: t => C.nums.filter(n => n && new RegExp('(^|[^0-9.])' + reEsc(n) + '([^0-9]|$)').test(t)).length >= Math.min(2, C.nums.length), partial: t => C.nums.some(n => n && new RegExp('(^|[^0-9.])' + reEsc(n) + '([^0-9]|$)').test(t)), points: 2 });
    const dx = safe(enc.diagnosis), dxk = sigKw(dx);
    add({ box: 'b', label: 'Why the patient is here (diagnosis or procedure) and hospital day', expected: `${dx}${enc.hospitalDay ? ', hospital day ' + enc.hospitalDay : ''}`, test: t => dxk.filter(k => t.includes(k)).length >= Math.min(2, dxk.length), partial: t => dxk.some(k => t.includes(k)), points: 2 });
    const code = safe(enc.codeStatus, 'Full Code');
    add({ box: 'b', label: 'Code status', expected: code, test: t => /full code|\bdnr\b|do not resus|\bdni\b|code status|full/.test(t), points: 1 });
    const al = (pt.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
    add({ box: 'b', label: 'Allergies', expected: al.length ? al.map(a => a.substance).join(', ') : 'No known drug allergies', test: t => al.length ? al.some(a => t.includes(norm(a.substance).split(' ')[0].slice(0, 6))) : /nkda|no known|no allergies|allerg/.test(t), points: 1 });
    add({ box: 'b', label: 'Related medications, history or recent vital sign trend', expected: C.vitalsLine || 'Relevant medications or history', test: t => /\b(medic|on \w+ mg|history|last (dose|vitals?)|received|given|baseline|earlier|started|trend|vitals? (were|are)|bp was|was \d+)/.test(t) || /\b(heparin|insulin|lisinopril|metoprolol|diltiazem|antibiotic|opioid|morphine|oxycodone|oxygen)\b/.test(t), points: 1 });
    add({ box: 'a', label: 'Your impression: what you think the problem is, and that you are concerned', expected: 'For example: "I think he may be bleeding / developing sepsis / having a PE. I\'m worried he is getting worse."', test: t => /\b(i think|i suspect|i\'?m (worried|concerned)|concern|worried|worse|worsening|deteriorat|unstable|getting worse|looks like|may be|might be|appears)\b/.test(t), points: 2 });
    add({ box: 'a', label: 'When it started or how it changed', expected: 'The time it began or the change from baseline', test: t => /\b(since|started|began|over the (last|past)|within|ago|at \d{1,2}[: ]?\d{0,2}|this (morning|afternoon)|just|suddenly|baseline|was \d+ and now|from \d+)\b/.test(t), points: 1 });
    add({ box: 'a', label: 'What you have already done (assessed, rechecked, oxygen, held a drug, etc.)', expected: 'Nursing actions already taken', test: t => /\b(rechecked|repeated|re-?assess|put (him|her|them) on|applied|started|held|i (gave|placed|raised|elevated|stopped|turned off)|on \d+ ?l|nasal cannula|oxygen on|monitor)\b/.test(t), points: 1 });
    add({ box: 'r', label: 'A clear request (come see the patient, or a specific order or test)', expected: C.ask, test: t => /\b(i (need|would like|\'d like|am requesting|request|recommend)|can you|could you|please|would you|do you want|requesting|come (see|to)|see the patient|evaluate|bedside|rapid response|orders?)\b/.test(t), points: 2 });
    add({ box: 'r', label: C.urgent ? 'How soon (this is urgent)' : 'How soon', expected: C.urgent ? 'Now / within minutes' : 'A timeframe', test: t => /\b(now|stat|right away|immediately|urgent|within \d+|in \d+ min|minutes|asap|today|this hour)\b/.test(t), points: 1 });
    add({ box: 'r', label: 'Read back the orders (closed-loop communication) and say you will recheck', expected: '"Let me read that back..." and "I will recheck in 15 minutes and call with changes."', test: t => /\b(read (that )?back|repeat (that )?back|to confirm|confirm|let me repeat|i will recheck|recheck|call (you )?back|will call)\b/.test(t), points: 1 });
    items.forEach((it, i) => { it.id = 's' + i; });
    return items;
  }
  function scoreCall(texts, F, C) {
    const items = buildRubric(F, C), all = norm(Object.values(texts).join(' '));
    const results = items.map(it => {
      const own = norm(texts[it.box] || ''); let got = 0, status = 'miss';
      if (it.test(own)) { got = it.points; status = 'full'; }
      else if (it.test(all)) { got = Math.round(it.points * 0.6 * 10) / 10; status = 'other'; }
      else if (it.partial && it.partial(all)) { got = Math.round(it.points * 0.5 * 10) / 10; status = 'part'; }
      return { item: it, got, status };
    });
    const errors = [];
    const code = safe(F.enc.codeStatus, 'Full Code'), full = /full/i.test(code), allT = all;
    if (full && /\bdnr\b|do not resus|no code/.test(allT)) errors.push(`You gave the wrong code status. The chart says ${code}.`);
    if (!full && /\bfull code\b/.test(allT)) errors.push(`You gave the wrong code status. The chart says ${code}.`);
    const al = (F.pt.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
    if (al.length && /nkda|no known (drug )?allergies|no allergies/.test(allT)) errors.push('You said no allergies, but the patient has documented allergies.');
    const earned = Math.max(0, results.reduce((s, r) => s + r.got, 0) - 2 * errors.length), total = items.reduce((s, i) => s + i.points, 0);
    return { results, errors, earned: Math.round(earned * 10) / 10, total, pct: Math.round(earned / total * 100) };
  }

  // ------------------------------------------------------------------ prioritization items
  function priorityItems(F) {
    const out = [], add = (tier, text, why) => out.push({ tier, text, why });
    const trig = (F.cc.triggers || [])[0];
    if (trig && String(trig.onset) <= F.now) add(1, `Patient has a sudden change: ${safe(trig.label)}. Assess and call for help.`, 'A new, sudden change in airway, breathing, circulation or mental status is the highest priority (assess, stay, get help).');
    F.vitals.filter(o => o.flag && BAD_VITAL[o.code] && BAD_VITAL[o.code](vnum(o))).slice(0, 2).forEach(o => {
      const aBC = o.code === 'SPO2' || o.code === 'RR' || o.code === 'BP' || o.code === 'HR';
      add(aBC ? 1 : 2, `Recheck and respond to ${vtext(o)}`, aBC ? 'Airway, breathing and circulation problems come before everything else.' : 'An abnormal vital sign needs a quick recheck and report, but it is less urgent than airway, breathing or circulation problems.');
    });
    F.labs.filter(l => /critical/i.test(safe(l.flag))).slice(0, 2).forEach(l => add(1, `Critical lab: ${safe(l.label)} ${safe(l.value)} ${unit(l)}. Report to the provider.`, 'Critical results are life-threatening and must be reported right away.'));
    F.labs.filter(l => l.flag && !/critical/i.test(safe(l.flag)) && !/a1c|egfr|vitamin|albumin|mcv|hematocrit/i.test(safe(l.label))).slice(0, 1).forEach(l => add(2, `Review abnormal result: ${safe(l.label)} ${safe(l.value)} ${unit(l)} and tell the provider`, 'Abnormal but not critical results need follow-up soon, after any unstable patient problem.'));
    const pain = F.vitals.find(o => o.code === 'PAIN' && parseFloat(o.value) >= 7); if (pain) add(2, `Patient reports pain ${pain.value}/10; give PRN medication`, 'Severe pain needs treatment soon, but not before airway, breathing or circulation.');
    const orderOf = id => (F.vis.orders || []).find(o => o.id === id) || {}, nowMs = (parseSimDate(F.now) || new Date()).getTime();
    const due = (F.vis.administrations || []).filter(a => /due/i.test(safe(a.state))).map(a => ({ a, d: parseSimDate(combineSimDateAndClock(a.time)), o: orderOf(a.orderId) })).filter(x => x.d && x.o.medication && Math.abs(x.d - nowMs) <= 3600000 * 1.5);
    due.filter(x => x.o.medication.highAlert).slice(0, 1).forEach(x => add(2, `High-alert medication due at ${x.a.time}: ${safe(x.o.name)}`, 'Time-critical and high-alert medications are given on time with an independent double check.'));
    due.filter(x => !x.o.medication.highAlert).slice(0, 1).forEach(x => add(3, `Routine scheduled medication due at ${x.a.time}: ${safe(x.o.name)}`, 'Routine scheduled medications are given within the time window, after urgent problems.'));
    // fill with routine tasks
    const filler = [[3, 'Help the patient with morning hygiene and a linen change', 'Routine comfort care can wait for urgent problems.'], [3, 'Chart the intake and output from the last 4 hours', 'Documentation is important but can be done after patient care needs.'], [3, 'Answer a family member\'s call about visiting hours', 'A non-urgent request that can wait.'], [3, 'Teach the patient about the discharge diet', 'Routine teaching can wait until the patient is stable.'], [2, 'Reassess pain 1 hour after a PRN dose that was given', 'Reassessment is due soon, but it is not as urgent as an unstable patient.'], [3, 'Walk the patient in the hall as ordered', 'Planned activity is done when the patient is stable.']];
    let k = 0; while (out.length < 6 && k < filler.length) { const f = filler[k++]; add(f[0], f[1], f[2]); }
    const t1 = out.filter(x => x.tier === 1).slice(0, 2), rest = out.filter(x => x.tier !== 1).sort((x, y) => x.tier - y.tier);
    const chosen = t1.concat(rest).slice(0, 6);
    if (!chosen.some(x => x.tier === 3)) { const f = filler.find(x => x[0] === 3); if (f) chosen[chosen.length - 1] = { tier: 3, text: f[1], why: f[2] }; }
    return chosen;
  }
  function scoreOrder(order) { // order = items in the student's order
    let pairs = 0, ok = 0; const wrong = [];
    for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) { if (order[i].tier === order[j].tier) continue; pairs++; if (order[i].tier < order[j].tier) ok++; else wrong.push([order[i], order[j]]); }
    return { pairs, ok, pct: pairs ? Math.round(ok / pairs * 100) : 100, wrong };
  }

  // ------------------------------------------------------------------ dialogs
  let recog = null;
  function stopMic() { if (recog) { try { recog.stop(); } catch (e) { /* ignore */ } recog = null; } document.querySelectorAll('.sb-mic').forEach(b => { b.classList.remove('rec'); b.textContent = '🎤 Speak'; }); }
  function toggleMic(btn, SR) {
    if (btn.classList.contains('rec')) { stopMic(); return; }
    stopMic(); const ta = $('sb_' + btn.dataset.mic); recog = new SR(); recog.lang = 'en-US'; recog.continuous = true; recog.interimResults = false;
    recog.onresult = e => { let t = ''; for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript + ' '; if (t) ta.value = (ta.value ? ta.value.trim() + ' ' : '') + t.trim(); };
    recog.onerror = () => stopMic(); recog.onend = () => { btn.classList.remove('rec'); btn.textContent = '🎤 Speak'; };
    btn.classList.add('rec'); btn.textContent = '■ Stop'; try { recog.start(); } catch (e) { stopMic(); }
  }

  function ensureDialog() {
    let dlg = $('sbarDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'sbarDialog'; dlg.className = 'handoff-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Practice: provider call and priorities</h2><p>Two skills practiced on this patient as the chart stands now. Rule-based; no internet needed.</p></div><button id="sbClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="ho-actions"><button id="sbTabCall" class="primary-button">SBAR call to the provider</button> <button id="sbTabPri" class="secondary-button">Prioritize your tasks</button></div><div id="sbBody"></div><div id="sbHistory"></div></div>`;
    document.body.appendChild(dlg);
    $('sbClose').addEventListener('click', () => { stopMic(); dlg.close(); });
    $('sbTabCall').addEventListener('click', showCall); $('sbTabPri').addEventListener('click', showPriority);
    return dlg;
  }
  const setTab = which => { $('sbTabCall').className = which === 'call' ? 'primary-button' : 'secondary-button'; $('sbTabPri').className = which === 'pri' ? 'primary-button' : 'secondary-button'; };

  let curC = null;
  function showCall() {
    setTab('call'); stopMic(); const F = facts(); curC = concern(F);
    $('sbBody').innerHTML = `<div class="tc-card"><b>Situation for your call:</b> ${esc(F.pt.name)} (room ${esc(safe(F.enc.room))}) as of ${esc(epicDate(F.now))}.<br><b>Reason to call:</b> ${esc(curC.summary)}<br><span class="fs-muted">Latest vital signs: ${esc(curC.vitalsLine)}</span></div>
      <p class="fs-muted">Call the provider about this problem. Write or speak the call in the four boxes. You are the nurse calling.</p>` +
      BOXES.map(b => `<div class="ho-box"><div class="ho-box-head"><b>${esc(b.title)}</b><button type="button" class="small-tool-button sb-mic" data-mic="${b.id}">🎤 Speak</button></div><div class="ho-hint">${esc(b.hint)}</div><textarea id="sb_${b.id}" rows="3" placeholder="Say or type this part of the call..."></textarea></div>`).join('') +
      `<div class="ho-actions"><button id="sbScore" class="primary-button">Score my call</button> <button id="sbRubric" class="secondary-button">Faculty: view rubric</button></div><div id="sbResult"></div>`;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    $('sbBody').querySelectorAll('.sb-mic').forEach(btn => { if (!SR) btn.classList.add('hidden'); btn.addEventListener('click', () => toggleMic(btn, SR)); });
    $('sbScore').addEventListener('click', doScore); $('sbRubric').addEventListener('click', facultyRubric);
  }
  function doScore() {
    const texts = {}; BOXES.forEach(b => { texts[b.id] = $('sb_' + b.id).value; });
    if (!Object.values(texts).join('').trim()) { $('sbResult').innerHTML = '<div class="lib-message error">Type or speak your call first.</div>'; return; }
    const F = facts(), s = scoreCall(texts, F, curC);
    const mark = r => r.status === 'full' ? '<span class="ho-m ok">✔</span>' : r.status === 'miss' ? '<span class="ho-m bad">✖</span>' : '<span class="ho-m part">◐</span>';
    let html = `<div class="ho-score"><div class="ho-pct ${s.pct >= 80 ? 'ok' : s.pct >= 60 ? 'part' : 'bad'}">${s.pct}%</div><div><b>${s.earned} of ${s.total} points</b><br><span class="fs-muted">Scored against the chart at ${esc(epicDate(F.now))}.</span></div></div>`;
    if (s.errors.length) html += `<div class="ho-errors"><b>Safety errors (−2 points each):</b><ul>${s.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`;
    BOXES.forEach(b => {
      const rs = s.results.filter(r => r.item.box === b.id); if (!rs.length) return;
      html += `<h3 class="ho-sec">${esc(b.title)} <span class="fs-muted">${Math.round(rs.reduce((n, r) => n + r.got, 0) * 10) / 10}/${rs.reduce((n, r) => n + r.item.points, 0)}</span></h3><table class="fs-table ho-table"><tbody>${rs.map(r => `<tr><td>${mark(r)}</td><td><b>${esc(r.item.label)}</b>${r.status !== 'full' ? `<div class="fs-why">Chart / example: ${esc(r.item.expected)}${r.status === 'other' ? ' (you said it, but in the wrong box: 60%)' : ''}</div>` : ''}</td><td class="ho-pts">${Math.round(r.got * 10) / 10}/${r.item.points}</td></tr>`).join('')}</tbody></table>`;
    });
    $('sbResult').innerHTML = html;
    const h = (currentCanonicalCase.sbar = currentCanonicalCase.sbar || { attempts: [] });
    h.attempts.push({ at: String(simulationTime), concern: curC.label, pct: s.pct, earned: s.earned, total: s.total, errors: s.errors.length, texts });
    try { persistCase(); } catch (e) { /* best effort */ }
    renderHistory(); $('sbResult').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function facultyRubric() {
    const F = facts(), C = curC || concern(F), items = buildRubric(F, C);
    const html = `<p>Reason for the call: <b>${esc(C.summary)}</b>. A fact earns full credit in its own box, 60% in another box. Wrong code status or "no allergies" when the patient has allergies costs 2 points.</p>` + BOXES.map(b => `<h3>${esc(b.title)}</h3><table class="data-table"><thead><tr><th>Student should say</th><th>From the chart / example</th><th>Points</th></tr></thead><tbody>${items.filter(i => i.box === b.id).map(i => `<tr><td>${esc(i.label)}</td><td>${esc(i.expected)}</td><td>${i.points}</td></tr>`).join('')}</tbody></table>`).join('');
    NSWristband.showDialog('SBAR call rubric', 'Built from the chart at the current simulation time.', html);
  }

  // ---- prioritization
  let pri = null;
  function showPriority() {
    setTab('pri'); stopMic(); const F = facts(); pri = { items: priorityItems(F), scored: false };
    // start in a shuffled (not the answer) order
    const key = String(simulationTime).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    pri.items = pri.items.map((x, i) => ({ x, k: ((key >>> (i * 3)) + i * 2654435761) >>> 0 })).sort((a, b) => a.k - b.k).map(o => o.x);
    renderPriority();
  }
  function renderPriority() {
    const sc = pri.scored ? scoreOrder(pri.items) : null;
    $('sbBody').innerHTML = `<p class="fs-muted">It is ${esc(epicDate(simulationTime))} and you have all of these things to do for this patient. Put them in the order you would do them: <b>first at the top</b>. Use the arrows to move an item.</p>
      <div class="pri-list">${pri.items.map((it, i) => `<div class="pri-row${pri.scored ? ' t' + it.tier : ''}"><div class="pri-n">${i + 1}</div><div class="pri-text">${esc(it.text)}${pri.scored ? `<div class="fs-why">${it.tier === 1 ? 'Do first (life-threatening)' : it.tier === 2 ? 'Do soon (urgent but stable)' : 'Routine (can wait)'}: ${esc(it.why)}</div>` : ''}</div>${pri.scored ? '' : `<div class="pri-btns"><button class="small-tool-button" data-up="${i}" aria-label="Move up"${i === 0 ? ' disabled' : ''}>▲</button><button class="small-tool-button" data-down="${i}" aria-label="Move down"${i === pri.items.length - 1 ? ' disabled' : ''}>▼</button></div>`}</div>`).join('')}</div>
      ${pri.scored ? `<div class="ho-score"><div class="ho-pct ${sc.pct >= 80 ? 'ok' : sc.pct >= 60 ? 'part' : 'bad'}">${sc.pct}%</div><div><b>${sc.ok} of ${sc.pairs} priority pairs in the right order</b>${sc.wrong.length ? `<ul>${sc.wrong.slice(0, 4).map(w => `<li>"${esc(clip(w[1].text, 80))}" should come before "${esc(clip(w[0].text, 80))}".</li>`).join('')}</ul>` : '<br>Your order matches the priority tiers.'}<span class="fs-muted">Items in the same tier can be done in either order.</span></div></div><div class="ho-actions"><button id="priAgain" class="primary-button">Try again with a new chart time</button></div>` : `<div class="ho-actions"><button id="priDone" class="primary-button">Check my order</button></div>`}`;
    $('sbBody').querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.up; [pri.items[i - 1], pri.items[i]] = [pri.items[i], pri.items[i - 1]]; renderPriority(); }));
    $('sbBody').querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.down; [pri.items[i + 1], pri.items[i]] = [pri.items[i], pri.items[i + 1]]; renderPriority(); }));
    const done = $('priDone'); if (done) done.addEventListener('click', () => {
      pri.scored = true; const s = scoreOrder(pri.items), ordered = pri.items.slice();
      const h = (currentCanonicalCase.priority = currentCanonicalCase.priority || { attempts: [] }); h.attempts.push({ at: String(simulationTime), pct: s.pct, ok: s.ok, pairs: s.pairs, order: ordered.map(x => x.text) });
      try { persistCase(); } catch (e) { /* best effort */ }
      renderPriority(); renderHistory();
    });
    const again = $('priAgain'); if (again) again.addEventListener('click', showPriority);
  }
  const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function renderHistory() {
    const a = (currentCanonicalCase.sbar || {}).attempts || [], p = (currentCanonicalCase.priority || {}).attempts || [];
    $('sbHistory').innerHTML = (a.length ? `<h3 class="ho-sec">SBAR call attempts</h3><table class="fs-table"><tbody>${a.map((x, i) => `<tr><td>#${i + 1}</td><td>${esc(epicDate(x.at))}</td><td>${esc(x.concern)}</td><td><b>${x.pct}%</b></td></tr>`).join('')}</tbody></table>` : '') + (p.length ? `<h3 class="ho-sec">Prioritization attempts</h3><table class="fs-table"><tbody>${p.map((x, i) => `<tr><td>#${i + 1}</td><td>${esc(epicDate(x.at))}</td><td><b>${x.pct}%</b> (${x.ok}/${x.pairs} pairs)</td></tr>`).join('')}</tbody></table>` : '');
  }

  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); showCall(); renderHistory(); if (!dlg.open) dlg.showModal();
  }
  const btn = document.createElement('button'); btn.id = 'openSbarBtn'; btn.className = 'top-link top-button'; btn.textContent = 'SBAR';
  const lib = $('openLibraryBtn'); if (lib && lib.parentNode) lib.parentNode.insertBefore(btn, lib);
  btn.addEventListener('click', open);

  window.SBARPractice = { facts, concern, buildRubric, scoreCall, priorityItems, scoreOrder, open };
})();

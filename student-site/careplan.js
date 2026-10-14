/* NursingSim - nursing care plan activity (v38). No AI and no internet needed.
   "Care plan" in the left menu. The program finds the nursing problems that fit this patient's chart (low oxygen, pain, fall risk, infection, bleeding risk, blood sugar, and so on)
   and the student 1) puts them in priority order, 2) for the top three picks the right nursing interventions (some choices are wrong or unsafe),
   writes a measurable goal and how they will evaluate it. Scored against urgency tiers (airway, breathing, circulation first) and the intervention lists. Saved with the patient.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, safe, escapeHtml, epicDate, persistCase. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  let seed = 11; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const num = s => { const m = String(s).match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };

  // each problem: id, title, tier (1 first, 2 soon, 3 routine), why(F) evidence text or null when it does not apply, right: interventions, wrong: unsafe or irrelevant choices, goal hint, eval hint
  const LIB = [
    { id: 'gas', title: 'Impaired gas exchange', tier: 1, test: F => F.low('SPO2', 92) || F.high('RR', 24) || /pneumon|copd|asthma|embol|respiratory|\bpe\b/i.test(F.dx), why: F => F.vs('SPO2', 'RR'),
      right: ['Monitor oxygen saturation, respiratory rate and work of breathing at least every 1 to 2 hours', 'Raise the head of the bed (semi-Fowler) and encourage deep breathing or the incentive spirometer', 'Give oxygen as ordered and titrate to the ordered saturation goal', 'Assess lung sounds and report worsening to the provider'],
      wrong: ['Keep the patient lying flat for comfort', 'Stop oxygen as soon as the patient says they feel fine', 'Give a sedative to calm breathing without an order'], goal: 'For example: SpO2 stays at or above 92% on the ordered oxygen through the end of the shift.', eval: 'Recheck SpO2 and respiratory rate 15 to 30 minutes after each change.' },
    { id: 'perf', title: 'Decreased cardiac output / unstable hemodynamics', tier: 1, test: F => F.high('HR', 120) || F.low('BP', 90) || /heart failure|fibrillation|flutter|myocard|nstemi|stemi|shock|sepsis/i.test(F.dx), why: F => F.vs('HR', 'BP'),
      right: ['Monitor heart rate, rhythm and blood pressure continuously or every 1 to 2 hours', 'Review medication parameters (hold and call for the ordered limits)', 'Assess perfusion: skin, capillary refill, mental status and urine output', 'Report new chest pain, dizziness or hypotension right away'],
      wrong: ['Give scheduled antihypertensives without checking the blood pressure first', 'Let the patient walk alone to the bathroom while dizzy', 'Check vital signs only once a shift'], goal: 'For example: heart rate stays below 110 and systolic BP stays above 100 for the shift.', eval: 'Compare vital signs with the goals every hour and after each medication.' },
    { id: 'bleed', title: 'Risk for bleeding', tier: 1, test: F => F.hasMed(/apixaban|rivaroxaban|heparin|enoxaparin|warfarin|clopidogrel|ticagrelor|aspirin/i) || F.low('Hemoglobin', 8, true) || /bleed|hemorrh/i.test(F.dx), why: F => F.hasMed(/apixaban|rivaroxaban|heparin|enoxaparin|warfarin/i) ? 'On an anticoagulant' : 'Low hemoglobin or bleeding diagnosis',
      right: ['Watch for bleeding: stool, urine, emesis, gums, skin and incision sites', 'Follow bleeding precautions (soft toothbrush, electric razor, avoid IM injections)', 'Check hemoglobin, platelets and clotting labs and report abnormal values', 'Hold the anticoagulant and call the provider if bleeding or a critical lab appears'],
      wrong: ['Give aspirin or ibuprofen for mild pain without an order', 'Rub an injection site firmly after a heparin injection', 'Wait until the next shift to report black stools'], goal: 'For example: no new bleeding and hemoglobin stays above 8 g/dL through the shift.', eval: 'Review labs when resulted and reassess for bleeding every 4 hours.' },
    { id: 'infect', title: 'Infection / sepsis risk', tier: 1, test: F => F.high('TEMP', 100.9) || /sepsis|pneumon|cellulitis|infect|abscess|\buti\b/i.test(F.dx), why: F => F.vs('TEMP') || safeDx(F),
      right: ['Monitor temperature, heart rate, blood pressure, mental status and urine output closely', 'Give antibiotics on time and confirm cultures were drawn before the first dose', 'Use hand hygiene and the isolation precautions that are ordered', 'Report fever above the ordered limit, new confusion or low urine output'],
      wrong: ['Hold antibiotics until the fever comes down', 'Skip hand hygiene for a patient who is alert', 'Give extra acetaminophen to bring down the fever without an order'], goal: 'For example: temperature stays below 100.4 F and mental status stays at baseline.', eval: 'Trend temperature, WBC and lactate; reassess every 2 hours.' },
    { id: 'glucose', title: 'Risk for unstable blood glucose', tier: 2, test: F => /diabet|dka|hhs|insulin/i.test(F.dx + ' ' + F.hist) || F.abnLab('Glucose'), why: F => F.lab('Glucose') || 'Diabetes or insulin therapy',
      right: ['Check blood glucose as ordered, before meals and at bedtime', 'Treat low glucose with 15 grams of fast sugar per protocol and recheck in 15 minutes', 'Give insulin as ordered with the right timing for meals and independent double check when required', 'Teach the signs of low and high glucose'],
      wrong: ['Skip insulin because the patient is not hungry without calling', 'Treat low glucose with a large meal only', 'Give insulin without checking the glucose'], goal: 'For example: glucose stays between 100 and 180 mg/dL with no value below 70.', eval: 'Review each glucose check and adjust per protocol; call for 2 values out of range.' },
    { id: 'pain', title: 'Acute pain', tier: 2, test: F => F.vsVal('PAIN') >= 4, why: F => `Pain ${F.vsVal('PAIN')}/10`,
      right: ['Ask for a pain score and description with each vital sign set and before and after interventions', 'Give pain medication as ordered before activity and reassess within 30 to 60 minutes', 'Add non-drug comfort measures (position, ice or heat, relaxation)', 'Watch for opioid side effects: sedation, slowed breathing, constipation'],
      wrong: ['Wait until the patient asks and the pain is severe', 'Give two pain medications at the same time without checking the orders', 'Tell the patient not to move at all'], goal: 'For example: patient reports pain at or below 3/10 within one hour of each dose.', eval: 'Reassess pain 30 to 60 minutes after each dose and document the score.' },
    { id: 'delirium', title: 'Acute confusion / risk for delirium', tier: 2, test: F => /confus|delirium|dementia|lethargic|withdrawal|alcohol/i.test(F.dx + ' ' + F.hist + ' ' + F.assess), why: F => 'Confusion, dementia or withdrawal risk on the chart',
      right: ['Reorient frequently and keep glasses, hearing aids and a clock in reach', 'Assess for causes: pain, infection, low oxygen, low glucose, urinary retention, medications', 'Keep a quiet, lit room by day and dark at night and avoid restraints', 'Use ordered withdrawal scoring (such as CIWA) and report increasing scores'],
      wrong: ['Use restraints first for a restless patient', 'Give a sedative without finding the cause', 'Leave the patient alone in a dark room with the bed rails down'], goal: 'For example: patient stays oriented to person and place and has no falls this shift.', eval: 'Do a mental-status check every 4 hours and with any change.' },
    { id: 'fall', title: 'Risk for falls', tier: 2, test: F => /moderate|high/i.test(safe(F.enc.fallRisk)), why: F => `Fall risk: ${safe(F.enc.fallRisk)}`,
      right: ['Keep the bed low with the alarm on and the call light within reach', 'Use non-skid footwear and assist with every transfer', 'Review medications that cause dizziness, and toilet the patient on a schedule', 'Teach the patient to call before getting up'],
      wrong: ['Raise all four side rails to keep the patient in bed', 'Let the patient get up alone because they said they are steady', 'Leave the floor cluttered to keep supplies close'], goal: 'For example: no falls this shift and patient calls for help every time before standing.', eval: 'Check the alarm and call light on every visit; rounds every hour.' },
    { id: 'fluid', title: 'Fluid volume imbalance', tier: 2, test: F => /heart failure|kidney|renal|dialysis|ckd|dehydrat|pancreat|sepsis|bleed/i.test(F.dx + ' ' + F.hist), why: F => 'Conditions that change fluid balance on the chart',
      right: ['Record accurate intake and output and weigh at the same time each day', 'Follow fluid and sodium restrictions or replacement orders', 'Assess edema, lung sounds, mucous membranes and urine output', 'Report urine output below 30 mL/hour or weight change above the ordered limit'],
      wrong: ['Encourage unlimited water to a patient on a fluid restriction', 'Estimate intake and output without measuring', 'Ignore a drop in urine output if the patient feels fine'], goal: 'For example: net intake and output stays within the ordered range and daily weight changes less than 2 pounds.', eval: 'Total intake and output at the end of each 4-hour block.' },
    { id: 'skin', title: 'Risk for impaired skin integrity', tier: 3, test: F => F.bradenLow() || /bed rest|incision|surgery|immobil/i.test(F.enc.ambulationOrder + ' ' + F.dx), why: F => 'Low mobility, incision or low Braden score',
      right: ['Reposition at least every 2 hours and keep skin clean and dry', 'Inspect the skin and bony areas every shift and check the incision', 'Use pressure-relieving surfaces and keep heels off the bed', 'Encourage protein and fluids as allowed'],
      wrong: ['Massage reddened bony areas firmly', 'Leave the patient in the same position until morning', 'Use a donut cushion over a pressure area'], goal: 'For example: skin stays intact with no new redness over bony areas.', eval: 'Skin check every shift and with each turn.' },
    { id: 'mobility', title: 'Impaired physical mobility / risk of complications from bed rest', tier: 3, test: F => /bed rest|assist|walker|fracture|stroke|surgery/i.test(F.enc.ambulationOrder + ' ' + F.dx), why: F => `Activity order: ${safe(F.enc.ambulationOrder)}`,
      right: ['Mobilize as ordered with help and the right device', 'Do range of motion and ankle pumps; use compression devices when ordered', 'Coordinate with physical therapy', 'Check for leg swelling, pain or warmth and report it'],
      wrong: ['Keep the patient in bed all day to avoid falls', 'Walk the patient before checking blood pressure and pain control', 'Ignore a swollen painful calf'], goal: 'For example: patient walks 100 feet with the walker twice this shift.', eval: 'Document distance and tolerance after each walk.' },
    { id: 'knowledge', title: 'Knowledge deficit about the new diagnosis and medicines', tier: 3, test: F => true, why: F => 'New diagnosis and new medicines this admission',
      right: ['Assess what the patient already knows and how they learn best', 'Teach in short plain-language steps and use teach-back', 'Give written materials at the patient\'s reading level', 'Involve family members when the patient agrees'],
      wrong: ['Give a long handout and leave without checking understanding', 'Use medical words so the patient sounds informed', 'Teach only when the patient is in severe pain'], goal: 'For example: patient states two warning signs and the purpose of each new medicine by discharge.', eval: 'Use teach-back and document the patient\'s own words.' }
  ];
  const safeDx = F => F.dx;

  function facts() {
    const cc = currentCanonicalCase, vis = getVisibleCanonicalCase(cc), obs = vis.observations || [], enc = cc.encounter || {};
    const latest = new Map(); obs.slice().sort((a, b) => String(a.collected).localeCompare(String(b.collected))).forEach(o => latest.set(`${o.type}|${o.code || o.label}`, o));
    const V = c => latest.get('vital|' + c), L = c => latest.get('lab|' + c);
    const meds = (vis.orders || []).filter(o => safe(o.category) === 'Medication' && /active|pending/i.test(safe(o.status)));
    const F = { cc, vis, enc, dx: `${safe(enc.diagnosis)} ${safe(enc.chiefComplaint)}`, hist: (vis.problems || cc.problems || []).map(p => safe(p.name)).join(' '), assess: obs.filter(o => o.type === 'assessment').map(o => safe(o.value)).join(' '),
      vsVal: c => { const o = V(c); return o ? num(o.value) : NaN; },
      low: (c, n, lab) => { const o = lab ? L(c) : V(c); const v = o ? (c === 'BP' ? parseFloat(String(o.value).split('/')[0]) : num(o.value)) : NaN; return isFinite(v) && v < n; },
      high: (c, n) => { const o = V(c); const v = o ? num(o.value) : NaN; return isFinite(v) && v > n; },
      abnLab: c => { const o = L(c); return !!(o && o.flag); }, lab: c => { const o = L(c); return o ? `${c} ${o.value} ${o.units || ''}`.trim() : ''; },
      hasMed: re => meds.some(o => re.test(safe(o.name))),
      bradenLow: () => obs.some(o => o.type === 'assessment' && /braden/i.test(safe(o.label) + safe(o.section)) && num(o.value) <= 18),
      vs: (...codes) => codes.map(c => V(c)).filter(Boolean).map(o => `${safe(o.label)} ${safe(o.value)}${o.flag ? ' (abnormal)' : ''}`).join('; ') };
    return F;
  }
  const problems = () => { const F = facts(); return LIB.filter(p => { try { return p.test(F); } catch (e) { return false; } }).map(p => Object.assign({}, p, { tier: p.id === 'glucose' && (/dka|hhs|ketoacid|hyperosmolar/i.test(F.dx) || F.low('Glucose', 70, true)) ? 1 : p.tier, evidence: (p.why(F) || '').toString() })); };

  // ------------------------------------------------------------------ dialog
  let S = null; // { list, step: 'rank'|'plan'|'done', picks: [{p, chosen:Set, goal, eval}] }
  function ensureDialog() {
    let dlg = $('cpDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'cpDialog'; dlg.className = 'quiz-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Care plan</h2><p>Choose and rank this patient's nursing problems, then plan care for the top three. Scored by priority (airway, breathing and circulation first) and by the interventions you choose.</p></div><button id="cpClose" class="icon-button" aria-label="Close">×</button></div><div class="dialog-body"><div id="cpBody"></div><div id="cpHistory"></div></div>`;
    document.body.appendChild(dlg); $('cpClose').addEventListener('click', () => dlg.close()); return dlg;
  }
  function start() {
    seed = (Date.now() & 0xffff) + 1;
    const list = shuffle(problems()).slice(0, 7);
    S = { list, step: 'rank', picks: [] }; renderRank();
  }
  function renderRank() {
    $('cpBody').innerHTML = `<p>These problems fit the chart as of <b>${esc(epicDate(simulationTime))}</b>. Put them in the order you would address them: <b>most urgent first</b>. The top three go into your plan.</p>
      <div class="pri-list">${S.list.map((p, i) => `<div class="pri-row"><div class="pri-n">${i + 1}</div><div class="pri-text"><b>${esc(p.title)}</b>${p.evidence ? `<div class="fs-muted">Chart: ${esc(p.evidence)}</div>` : ''}</div><div class="pri-btns"><button class="small-tool-button" data-up="${i}"${i === 0 ? ' disabled' : ''} aria-label="Move up">▲</button><button class="small-tool-button" data-down="${i}"${i === S.list.length - 1 ? ' disabled' : ''} aria-label="Move down">▼</button></div></div>`).join('')}</div>
      <div class="ho-actions"><button id="cpNext" class="primary-button">Plan care for my top 3</button></div>`;
    $('cpBody').querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.up; [S.list[i - 1], S.list[i]] = [S.list[i], S.list[i - 1]]; renderRank(); }));
    $('cpBody').querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.down; [S.list[i + 1], S.list[i]] = [S.list[i], S.list[i + 1]]; renderRank(); }));
    $('cpNext').addEventListener('click', () => { S.picks = S.list.slice(0, 3).map(p => ({ p, choices: shuffle(p.right.map(t => ({ t, ok: true })).concat(shuffle(p.wrong.map(t => ({ t, ok: false }))).slice(0, 2))), chosen: new Set(), goal: '', eval: '' })); S.step = 'plan'; renderPlan(); });
  }
  function renderPlan() {
    $('cpBody').innerHTML = `<p class="fs-muted">For each priority, select the interventions you would do (some choices are wrong or unsafe), then write a measurable goal and how you will evaluate it.</p>` +
      S.picks.map((k, i) => `<div class="qz-q"><div class="qz-cat">Priority ${i + 1}</div><div class="qz-text">${esc(k.p.title)}</div>
        ${k.choices.map((c, j) => `<label class="qz-choice"><input type="checkbox" data-pick="${i}" data-c="${j}"${k.chosen.has(j) ? ' checked' : ''}> <span>${esc(c.t)}</span></label>`).join('')}
        <label class="dc-l">Measurable goal<br><textarea data-goal="${i}" rows="2" style="width:100%;box-sizing:border-box;font-size:15px" placeholder="${esc(k.p.goal)}">${esc(k.goal)}</textarea></label>
        <label class="dc-l">How I will evaluate it<br><textarea data-eval="${i}" rows="2" style="width:100%;box-sizing:border-box;font-size:15px" placeholder="${esc(k.p.eval)}">${esc(k.eval)}</textarea></label></div>`).join('') +
      `<div class="ho-actions"><button id="cpScore" class="primary-button">Sign and score my care plan</button></div>`;
    $('cpBody').querySelectorAll('[data-pick]').forEach(e => e.addEventListener('change', () => { const k = S.picks[+e.dataset.pick], j = +e.dataset.c; if (e.checked) k.chosen.add(j); else k.chosen.delete(j); }));
    $('cpBody').querySelectorAll('[data-goal]').forEach(e => e.addEventListener('input', () => { S.picks[+e.dataset.goal].goal = e.value; }));
    $('cpBody').querySelectorAll('[data-eval]').forEach(e => e.addEventListener('input', () => { S.picks[+e.dataset.eval].eval = e.value; }));
    $('cpScore').addEventListener('click', score);
  }
  function score() {
    // priority: pairs across tiers among all ranked problems
    let pairs = 0, ok = 0; const wrong = [];
    for (let i = 0; i < S.list.length; i++) for (let j = i + 1; j < S.list.length; j++) { if (S.list[i].tier === S.list[j].tier) continue; pairs++; if (S.list[i].tier < S.list[j].tier) ok++; else wrong.push([S.list[i], S.list[j]]); }
    const prio = pairs ? ok / pairs : 1;
    let intEarned = 0, intTotal = 0, goalPts = 0, goalTotal = 0; const rows = [];
    S.picks.forEach(k => {
      const rights = k.choices.filter(c => c.ok), got = k.choices.filter((c, j) => k.chosen.has(j) && c.ok).length, bad = k.choices.filter((c, j) => k.chosen.has(j) && !c.ok).length;
      const pts = Math.max(0, got - bad); intEarned += pts; intTotal += rights.length;
      const g = k.goal.trim(), measurable = /\d|%|within|by (the )?end|no (new|falls)|stays|remain|at or (above|below)|below|above/i.test(g), ev = /\b(recheck|reassess|every|monitor|review|document|compare|trend|after)\b/i.test(k.eval);
      const gp = (g.length > 12 && measurable ? 1 : 0) + (k.eval.trim().length > 12 && ev ? 1 : 0); goalPts += gp; goalTotal += 2;
      rows.push({ k, got, bad, rights: rights.length, gp, missed: k.choices.filter((c, j) => c.ok && !k.chosen.has(j)).map(c => c.t), unsafe: k.choices.filter((c, j) => !c.ok && k.chosen.has(j)).map(c => c.t), measurable, ev, g });
    });
    const total = 10 + intTotal + goalTotal, earned = prio * 10 + intEarned + goalPts, pct = Math.round(100 * earned / total);
    S.step = 'done';
    $('cpBody').innerHTML = `<div class="ho-score"><div class="ho-pct ${pct >= 80 ? 'ok' : pct >= 60 ? 'part' : 'bad'}">${pct}%</div><div><b>${Math.round(earned * 10) / 10} of ${total} points</b><br><span class="fs-muted">Priority order ${Math.round(prio * 10)}/10 · interventions ${intEarned}/${intTotal} · goals and evaluation ${goalPts}/${goalTotal}</span></div></div>
      <h3 class="ho-sec">Priority order</h3>${wrong.length ? `<ul>${wrong.slice(0, 4).map(w => `<li>"${esc(w[1].title)}" should come before "${esc(w[0].title)}".</li>`).join('')}</ul>` : '<p>Your order matches the priority tiers.</p>'}
      <p class="fs-muted">Best order by urgency: ${esc(problems().sort((a, b) => a.tier - b.tier).map(p => p.title).join(' → '))}. Problems in the same tier can go in either order.</p>
      ${rows.map(r => `<h3 class="ho-sec">${esc(r.k.p.title)}</h3><table class="fs-table ho-table"><tbody>
        <tr><td><b>Interventions</b>${r.unsafe.length ? `<div class="fs-why" style="color:#b3261e">Wrong or unsafe choices: ${esc(r.unsafe.join('; '))}</div>` : ''}${r.missed.length ? `<div class="fs-why">Also needed: ${esc(r.missed.join('; '))}</div>` : '<div class="fs-why">You chose every correct intervention.</div>'}</td><td class="ho-pts">${Math.max(0, r.got - r.bad)}/${r.rights}</td></tr>
        <tr><td><b>Goal and evaluation</b><div class="fs-why">${r.measurable ? 'Your goal is measurable.' : 'Make the goal measurable with a number or a time (' + esc(r.k.p.goal) + ').'} ${r.ev ? 'You said how you will evaluate it.' : 'Say how and when you will reassess (' + esc(r.k.p.eval) + ').'}</div></td><td class="ho-pts">${r.gp}/2</td></tr></tbody></table>`).join('')}
      <div class="ho-actions"><button id="cpAgain" class="primary-button">Plan again with a new set</button></div>`;
    $('cpAgain').addEventListener('click', start);
    const h = (currentCanonicalCase.carePlan = currentCanonicalCase.carePlan || { attempts: [] });
    h.attempts.push({ at: String(simulationTime), pct, earned: Math.round(earned * 10) / 10, total, order: S.list.map(p => p.title), picks: S.picks.map(k => ({ problem: k.p.title, goal: k.goal, eval: k.eval })) });
    try { persistCase(); } catch (e) { /* best effort */ }
    renderHistory();
  }
  function renderHistory() {
    const a = (currentCanonicalCase.carePlan || {}).attempts || [];
    $('cpHistory').innerHTML = a.length ? `<h3 class="ho-sec">Your care plan attempts</h3><table class="fs-table"><tbody>${a.map((x, i) => `<tr><td>#${i + 1}</td><td>${esc(epicDate(x.at))}</td><td><b>${x.pct}%</b> (${x.earned}/${x.total})</td></tr>`).join('')}</tbody></table>` : '';
  }
  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); start(); renderHistory(); if (!dlg.open) dlg.showModal();
  }
  const side = document.querySelector('.sidebar');
  if (side) { const b = document.createElement('button'); b.className = 'nav-item'; b.id = 'openCarePlanBtn'; b.innerHTML = '<span>Care Plan</span>'; b.addEventListener('click', open); const d = $('openDischargeBtn'); if (d && d.nextSibling) side.insertBefore(b, d.nextSibling); else side.appendChild(b); }
  window.CarePlan = { problems, LIB, open };
})();

/* NursingSim - Discharge teaching documentation and After-Visit Summary (v37). No AI and no internet needed.
   "Discharge" in the left menu opens two tabs:
   1. Teaching documentation: the nurse records what was taught (topic, who, methods, key points covered, how the learner responded, barriers).
      "File education note" adds a Patient Education note to Chart Review > Notes and to the education log saved with the patient.
   2. After-Visit Summary: a printable, plain-language summary built from the chart (reason for the stay, what was done, medicines with what each is for,
      allergies, diet, activity, warning signs, follow-up, and the education already documented).
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, safe, escapeHtml, epicDate, persistCase, refreshSimulationView, NSWristband,
   and on Teaching (teaching.js) and DrugGuide (druginfo.js) when loaded. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const uniq = a => Array.from(new Set(a));
  const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const cleanName = n => String(n || '').replace(/\s*\(.*?\)/g, '').replace(/\s*(tablet|capsule|injection|solution|infusion|ivpb|nebulizer|suspension|patch|cream|ointment)\b.*$/i, '').replace(/\s+/g, ' ').trim();
  const FREQ = { daily: 'once a day', qd: 'once a day', bid: 'twice a day', tid: 'three times a day', qid: 'four times a day', q4h: 'every 4 hours', q6h: 'every 6 hours', q8h: 'every 8 hours', q12h: 'every 12 hours', qhs: 'at bedtime', hs: 'at bedtime', weekly: 'once a week', prn: 'only when needed' };
  const freqText = (f, prn) => prn ? 'only when needed' : (FREQ[String(f || '').toLowerCase().replace(/\s+/g, '')] || safe(f, '').toLowerCase());
  const topics = () => (window.Teaching ? Teaching.topicsFor() : []);

  // ------------------------------------------------------------------ dialog shell
  let tab = 'doc';
  function ensureDialog() {
    let dlg = $('dcDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'dcDialog'; dlg.className = 'quiz-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Discharge teaching</h2><p>Document the teaching you gave, then prepare the After-Visit Summary for the patient.</p></div><button id="dcClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="ho-actions"><button id="dcTabDoc" class="primary-button">Teaching documentation</button> <button id="dcTabAvs" class="secondary-button">After-Visit Summary</button></div><div id="dcBody"></div></div>`;
    document.body.appendChild(dlg);
    $('dcClose').addEventListener('click', () => dlg.close());
    $('dcTabDoc').addEventListener('click', () => { tab = 'doc'; render(); });
    $('dcTabAvs').addEventListener('click', () => { tab = 'avs'; render(); });
    return dlg;
  }
  function render() {
    $('dcTabDoc').className = tab === 'doc' ? 'primary-button' : 'secondary-button'; $('dcTabAvs').className = tab === 'avs' ? 'primary-button' : 'secondary-button';
    if (tab === 'doc') renderDoc(); else renderAvs();
  }

  // ------------------------------------------------------------------ 1. teaching documentation
  const METHODS = ['Verbal explanation', 'Written handout', 'Demonstration', 'Teach-back', 'Interpreter used'];
  const RESPONSES = ['Verbalized understanding', 'Return demonstration correct', 'Teach-back correct', 'Needs reinforcement', 'Declined teaching'];
  const BARRIERS = ['None', 'Language', 'Hearing', 'Vision', 'Low health literacy', 'Anxiety', 'Pain', 'Fatigue', 'Cognition'];
  function renderDoc() {
    const cc = currentCanonicalCase, tps = topics(), log = cc.educationLog || [];
    $('dcBody').innerHTML = `<h3 class="ho-sec">New education entry</h3>
      <label class="dc-l">Topic <select id="dcTopic">${tps.map((t, i) => `<option value="${i}">${esc(t.title)}</option>`).join('')}<option value="other">Other (type below)</option></select></label>
      <label class="dc-l">Taught to <select id="dcWho"><option>Patient</option><option>Patient and family</option><option>Family member</option></select></label>
      <div class="dc-l"><b>Methods used</b><div class="dc-checks">${METHODS.map(m => `<label class="qz-choice"><input type="checkbox" name="dcM" value="${esc(m)}"> <span>${esc(m)}</span></label>`).join('')}</div></div>
      <div class="dc-l"><b>Key points covered</b><div id="dcPoints" class="dc-checks"></div></div>
      <div class="dc-l"><b>Learner response</b><div class="dc-checks">${RESPONSES.map(m => `<label class="qz-choice"><input type="radio" name="dcR" value="${esc(m)}"> <span>${esc(m)}</span></label>`).join('')}</div></div>
      <div class="dc-l"><b>Barriers to learning</b><div class="dc-checks">${BARRIERS.map(m => `<label class="qz-choice"><input type="checkbox" name="dcB" value="${esc(m)}"> <span>${esc(m)}</span></label>`).join('')}</div></div>
      <label class="dc-l">Comments <textarea id="dcNote" rows="3" style="width:100%;box-sizing:border-box;font-size:15px" placeholder="Anything else: questions the patient asked, follow-up needed, materials given..."></textarea></label>
      <div id="dcMsg"></div><div class="ho-actions"><button id="dcFile" class="primary-button">File education note</button></div>
      <h3 class="ho-sec">Education documented for this patient</h3>${log.length ? `<table class="fs-table"><tbody>${log.map(l => `<tr><td>${esc(epicDate(l.at))}</td><td><b>${esc(l.topic)}</b><div class="fs-muted">${esc(l.who)} · ${esc(l.methods.join(', ') || 'no method recorded')} · ${esc(l.response || 'no response recorded')}</div></td></tr>`).join('')}</tbody></table>` : '<div class="fs-muted">Nothing documented yet.</div>'}`;
    const fillPoints = () => { const v = $('dcTopic').value, t = v === 'other' ? null : tps[+v]; $('dcPoints').innerHTML = t ? t.points.map((p, i) => `<label class="qz-choice"><input type="checkbox" name="dcP" value="${i}"> <span>${esc(p[0])}</span></label>`).join('') : '<div class="fs-muted">Describe the points in the comments.</div>'; };
    $('dcTopic').addEventListener('change', fillPoints); fillPoints();
    $('dcFile').addEventListener('click', () => {
      const v = $('dcTopic').value, t = v === 'other' ? null : tps[+v], val = n => Array.from($('dcBody').querySelectorAll(`input[name="${n}"]:checked`)).map(e => e.value);
      const methods = val('dcM'), response = (val('dcR')[0] || ''), barriers = val('dcB'), points = val('dcP').map(i => t.points[+i][0]), comment = $('dcNote').value.trim();
      const topic = t ? t.title : (comment ? 'Other teaching' : '');
      if (!topic) { $('dcMsg').innerHTML = '<div class="lib-message error">Choose a topic (or type what you taught in Comments).</div>'; return; }
      if (!response) { $('dcMsg').innerHTML = '<div class="lib-message error">Choose how the learner responded.</div>'; return; }
      const who = $('dcWho').value, notes = [];
      if (!methods.includes('Teach-back')) notes.push('No teach-back documented. Teach-back is the best way to show the learner understood.');
      if (t && !points.length) notes.push('No key points were checked. List what you covered.');
      const entry = { id: 'edu_' + Date.now(), at: String(simulationTime), topic, who, methods, points, response, barriers, comment };
      cc.educationLog = (cc.educationLog || []).concat([entry]);
      const body = [`**Topic:** ${topic}`, `**Taught to:** ${who}`, `**Methods:** ${methods.join(', ') || 'not recorded'}`, points.length ? '**Key points covered:**\n' + points.map(p => '- ' + p).join('\n') : '', `**Learner response:** ${response}`, `**Barriers:** ${barriers.length ? barriers.join(', ') : 'none recorded'}`, comment ? `**Comments:** ${comment}` : ''].filter(Boolean).join('\n');
      cc.notes = (cc.notes || []).concat([{ id: 'note_' + entry.id, type: 'progressNotes', title: 'Patient Education Note', author: 'Student RN', datetime: String(simulationTime), category: 'Nursing Education', summary: `${topic}: ${response}`, body }]);
      try { persistCase(); refreshSimulationView(false); } catch (e) { /* best effort */ }
      renderDoc();
      $('dcMsg').innerHTML = `<div class="lib-message success">Education note filed in Chart Review &gt; Notes.${notes.length ? '<br>Tip: ' + esc(notes.join(' ')) : ''}</div>`;
    });
  }

  // ------------------------------------------------------------------ 2. After-Visit Summary
  function avsData() {
    const cc = currentCanonicalCase, vis = getVisibleCanonicalCase(cc), e = cc.encounter || {}, p = cc.patient || {};
    const tps = topics(), main = tps.find(t => !t.med && !t.always) || tps.find(t => !t.med) || null;
    const meds = (vis.orders || []).filter(o => safe(o.category) === 'Medication' && o.medication && /active|pending/i.test(safe(o.status)) && !/continuous|bolus/i.test(safe((o.mar || {}).category)) && !/bolus|infusion|fluid|ringer|saline|sodium chloride|dextrose/i.test(safe(o.name)) && !/^iv|intraven/i.test(safe(o.medication.route)));
    const seen = new Set(), rows = [];
    meds.forEach(o => {
      const key = cleanName(o.name).toLowerCase(); if (seen.has(key)) return; seen.add(key);
      const g = window.DrugGuide ? DrugGuide.lookup(o.name) : null, m = o.medication, prn = /prn/i.test(safe((o.mar || {}).category)) || m.prn;
      rows.push({ name: cleanName(o.name), dose: `${safe(m.dose)}${m.route ? ', ' + safe(m.route).toLowerCase() : ''}`, how: freqText(o.frequency, prn), why: g && g.use ? lc(g.use.replace(/\.$/, '')) : lc(safe(o.rationale, 'as ordered')), home: /\bhome\b/i.test(safe(o.rationale)), alert: !!(g && g.alert) });
    });
    const proc = (vis.orders || []).filter(o => /surgery|procedure|imaging|cardiac/i.test(safe(o.category)) && /completed/i.test(safe(o.status))).map(o => safe(o.name)).slice(0, 8);
    const consults = (vis.orders || []).filter(o => /consult/i.test(safe(o.category))).map(o => safe(o.name).replace(/^consult( to)?\s*/i, '')).slice(0, 5);
    const pts = main ? main.points.map(x => x[0]) : [];
    const warn = pts.filter(x => /call|report|911|tell|bleed|fever|worse|swell|gain|short/i.test(x));
    return { cc, e, p, main, rows, proc, consults, warn: warn.length ? warn : pts.slice(0, 4), edu: cc.educationLog || [], allergies: (p.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance)) };
  }
  function avsHtml(d) {
    const { e, p } = d;
    return `<div class="avs">
      <h2 class="avs-h">After-Visit Summary</h2>
      <p><b>${esc(safe(p.name))}</b> · Date of birth ${esc(NSWristband.dobText(p.dob))} · MRN ${esc(safe(p.mrn))}<br>Admitted ${esc(epicDate(e.admitDate))} · Going home ${esc(epicDate(simulationTime))} · Provider ${esc(safe(e.attending))}</p>
      <h3>Why you were in the hospital</h3><p>You came in with ${esc(safe(e.chiefComplaint, 'a health problem').toLowerCase())}. Your care team found <b>${esc(safe(e.diagnosis))}</b>.${d.main ? ' ' + esc(d.main.plain) : ''}</p>
      ${d.proc.length ? `<h3>What was done</h3><ul>${d.proc.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <h3>Your medicines</h3>${d.rows.length ? `<table class="data-table"><thead><tr><th>Medicine</th><th>How much</th><th>How often</th><th>What it is for</th><th></th></tr></thead><tbody>${d.rows.map(r => `<tr><td><b>${esc(r.name)}</b></td><td>${esc(r.dose)}</td><td>${esc(r.how)}</td><td>${esc(r.why)}</td><td>${r.home ? 'Keep taking' : 'New or changed'}${r.alert ? ' <b>(high-risk medicine: ask your nurse how to take it safely)</b>' : ''}</td></tr>`).join('')}</tbody></table><p class="avs-small">Your provider will confirm this list before you leave. Do not stop or change a medicine on your own.</p>` : '<p>No medicines on this list.</p>'}
      <h3>Allergies</h3><p>${d.allergies.length ? esc(d.allergies.map(a => a.substance + (a.reaction ? ' (' + a.reaction + ')' : '')).join('; ')) : 'No known drug allergies.'}</p>
      <h3>Eating and activity</h3><p><b>Diet:</b> ${esc(safe(e.dietOrder))}<br><b>Activity:</b> ${esc(safe(e.ambulationOrder))}</p>
      <h3>Call your provider or 911 if</h3><ul>${d.warn.map(x => `<li>${esc(x)}</li>`).join('')}<li>Call <b>911</b> for chest pain, trouble breathing, a stroke sign, or heavy bleeding.</li></ul>
      <h3>Follow-up</h3><ul><li>See your primary care provider within 7 days.</li>${d.consults.map(c => `<li>Follow up with ${esc(c)} as arranged by the hospital team.</li>`).join('')}<li>Bring this paper and all your medicines to every visit.</li></ul>
      ${d.edu.length ? `<h3>Teaching you received</h3><ul>${d.edu.map(x => `<li>${esc(x.topic)} (${esc(x.response)})</li>`).join('')}</ul>` : ''}
      <p class="avs-small" style="margin-top:18px">Nurse signature: ______________________ &nbsp;&nbsp; Patient signature: ______________________<br>SIMULATION: fictional patient, for nursing education only.</p></div>`;
  }
  function renderAvs() {
    const d = avsData();
    $('dcBody').innerHTML = `<div class="ho-actions"><button id="dcPrint" class="primary-button">Print / save as PDF</button></div>` + avsHtml(d) + (d.edu.length ? '' : '<div class="lib-message">Tip: document the teaching you gave first (first tab) so it appears on this summary.</div>');
    $('dcPrint').addEventListener('click', () => NSWristband.showDialog('After-Visit Summary', esc(safe(d.p.name)), avsHtml(avsData())));
  }

  function open() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    const dlg = ensureDialog(); render(); if (!dlg.open) dlg.showModal();
  }
  const side = document.querySelector('.sidebar');
  if (side) { const b = document.createElement('button'); b.className = 'nav-item'; b.id = 'openDischargeBtn'; b.innerHTML = '<span>Discharge</span>'; b.addEventListener('click', open); const rep = $('openReportBtn'); if (rep && rep.nextSibling) side.insertBefore(b, rep.nextSibling); else side.appendChild(b); }
  window.Discharge = { avsData, avsHtml, open };
})();

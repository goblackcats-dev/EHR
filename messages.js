/* NursingSim - Secure Chat and phone calls (v40). No AI and no internet needed.
   "Secure Chat" in the left menu (with an unread badge). Messages arrive as the simulation clock passes their time, and a pop-up announces each new one.
   Generated from the chart: laboratory CRITICAL VALUE calls (the student must read the patient name, test and value back, and record who was notified),
   pharmacy notes about high-alert medications, a charge-nurse check-in, and a charge-nurse message when the patient's condition changes (scenario event).
   Instructors can add their own messages (sender, time, text) from the chat window; they are saved with the patient and travel in the student file.
   Student replies and call scores are saved with the patient. Depends on app.js globals: currentCanonicalCase, simulationTime, refreshSimulationView, getVisibleCanonicalCase,
   parseSimDate, safe, escapeHtml, epicDate, persistCase. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const p2 = n => String(n).padStart(2, '0');
  const stamp = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  const addMin = (t, m) => { const d = parseSimDate(t); if (!d) return t; d.setMinutes(d.getMinutes() + m); return stamp(d); };
  const st = () => { const cc = currentCanonicalCase; if (!cc) return { read: [], replied: {}, calls: {}, toasted: [] }; if (!cc.messageState) cc.messageState = { read: [], replied: {}, calls: {}, toasted: [] }; return cc.messageState; };
  const persist = () => { try { persistCase(); } catch (e) { /* best effort */ } };

  // ------------------------------------------------------------------ building the message list
  function generated(cc) {
    const out = [], e = cc.encounter || {}, tl = cc.timeline || {}, start = String(tl.simulationStart || '');
    const crit = (cc.observations || []).filter(o => o.type === 'lab' && /critical/i.test(safe(o.flag)) && /^-?\d/.test(safe(o.value)) && String(o.collected) >= start);
    const seen = new Set();
    crit.forEach(o => { const k = o.code; if (seen.has(k)) return; seen.add(k); out.push({ id: 'gen_crit_' + o.id, at: addMin(o.collected, 15), from: 'Laboratory', role: 'Lab', kind: 'critical', text: `Critical value call for ${safe((cc.patient || {}).name)}: ${safe(o.label)} is ${safe(o.value)} ${o.units && o.units !== '—' ? o.units : ''}. Please read back.`, lab: { label: safe(o.label), value: safe(o.value), units: safe(o.units, '') } }); });
    const hi = (cc.orders || []).filter(o => safe(o.category) === 'Medication' && o.medication && o.medication.highAlert && String(o.start) >= start).slice(0, 2);
    hi.forEach(o => out.push({ id: 'gen_rx_' + o.id, at: addMin(o.start, -20), from: 'Pharmacy', role: 'Pharmacy', kind: 'chat', text: `FYI: ${safe(o.name)} (${safe((o.medication || {}).dose)}) is a high-alert medication. Please do an independent double check with a second nurse before you give it, and use the pump library.`, replies: ['Thanks, I will get a second nurse', 'Please call me with the pump settings'] }));
    out.push({ id: 'gen_charge_1', at: addMin(start, 90), from: 'Charge RN', role: 'Charge', kind: 'chat', text: `How is ${safe(e.room)} going? Any problems, or do you need help with anything for your next med pass?`, replies: ['All stable, thanks', 'I need help with a task', 'My patient is changing; can you come?'] });
    const trig = (cc.triggers || [])[0];
    if (trig && trig.onset) out.push({ id: 'gen_charge_trig', at: addMin(trig.onset, 12), from: 'Charge RN', role: 'Charge', kind: 'chat', text: `I heard something is going on in ${safe(e.room)}: ${safe(trig.label)}. Do you need a rapid response or an extra set of hands?`, replies: ['Yes, please call a rapid response', 'Provider is on the way; I need help at the bedside', 'No, I am fine'] });
    return out;
  }
  function all() { const cc = currentCanonicalCase; if (!cc) return []; return generated(cc).concat(cc.customMessages || []).sort((a, b) => String(a.at).localeCompare(String(b.at))); }
  const visible = () => all().filter(m => String(m.at) <= String(simulationTime));
  const unread = () => visible().filter(m => !st().read.includes(m.id) || (m.kind === 'critical' && !st().calls[m.id]));

  // ------------------------------------------------------------------ badge + toast
  function badge() {
    const b = $('openChatBtn'); if (!b || !currentCanonicalCase) return;
    const n = unread().length; let el = b.querySelector('.nav-badge'); if (!el) { el = document.createElement('span'); el.className = 'nav-badge'; b.appendChild(el); }
    const t = n ? String(n) : ''; if (el.textContent !== t) el.textContent = t; el.classList.toggle('hidden', !n);
  }
  function toast(m) {
    let t = $('chatToast'); if (!t) { t = document.createElement('button'); t.id = 'chatToast'; t.className = 'chat-toast hidden'; document.body.appendChild(t); t.addEventListener('click', () => { t.classList.add('hidden'); open(); }); }
    t.textContent = m.kind === 'critical' ? `☎ ${m.from} is calling: critical value` : `💬 ${m.from}: ${String(m.text).slice(0, 60)}`; t.classList.toggle('critical', m.kind === 'critical'); t.classList.remove('hidden');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 9000);
  }
  function announce() {
    if (!currentCanonicalCase) return;
    const s = st(); const fresh = visible().filter(m => !s.toasted.includes(m.id));
    if (!fresh.length) return;
    fresh.forEach(m => s.toasted.push(m.id));
    // do not pop up for messages that were already there when the patient was opened
    if (s._init) toast(fresh[fresh.length - 1]); else s._init = true;
    persist();
  }
  if (typeof refreshSimulationView === 'function') { const orig = refreshSimulationView; refreshSimulationView = function () { const r = orig.apply(this, arguments); try { announce(); badge(); } catch (e) { /* optional */ } return r; }; }
  if (typeof renderPatient === 'function') { const o2 = renderPatient; renderPatient = function () { const r = o2.apply(this, arguments); try { if (currentCanonicalCase) { const s = st(); visible().forEach(m => { if (!s.toasted.includes(m.id)) s.toasted.push(m.id); }); s._init = true; } badge(); } catch (e) { /* optional */ } return r; }; }

  // ------------------------------------------------------------------ dialog
  const instructor = !window.NS_STUDENT;
  function ensure() { let d = $('chatDialog'); if (!d) { d = document.createElement('dialog'); d.id = 'chatDialog'; d.className = 'quiz-dialog'; document.body.appendChild(d); } return d; }
  function render(selectedId) {
    const d = ensure(), msgs = visible(), s = st();
    if (selectedId) { if (!s.read.includes(selectedId)) s.read.push(selectedId); persist(); badge(); }
    const sel = msgs.find(m => m.id === selectedId) || null;
    const left = msgs.length ? msgs.slice().reverse().map(m => `<button class="chat-row${m.id === selectedId ? ' active' : ''}${!s.read.includes(m.id) ? ' unread' : ''}" data-id="${esc(m.id)}"><b>${m.kind === 'critical' ? '☎ ' : ''}${esc(m.from)}</b><span class="fs-muted">${esc(String(m.at).slice(11))}</span><div class="chat-snip">${esc(String(m.text).slice(0, 70))}</div></button>`).join('') : '<div class="fs-muted" style="padding:10px">No messages yet. Messages arrive as the clock moves.</div>';
    d.innerHTML = `<div class="dialog-header"><div><h2>Secure Chat</h2><p>Messages and calls for this patient. Time is ${esc(epicDate(simulationTime))}.</p></div><button id="chatClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="chat-layout"><div class="chat-list">${left}</div><div class="chat-main" id="chatMain">${sel ? detail(sel) : '<div class="fs-muted">Select a message.</div>'}</div></div>${instructor ? '<div class="ho-actions"><button id="chatAdd" class="secondary-button">Faculty: add a message</button></div>' : ''}</div>`;
    $('chatClose').addEventListener('click', () => d.close());
    d.querySelectorAll('.chat-row').forEach(b => b.addEventListener('click', () => render(b.dataset.id)));
    if (sel) wire(sel);
    const add = $('chatAdd'); if (add) add.addEventListener('click', addForm);
  }
  function detail(m) {
    const s = st(), rep = s.replied[m.id], call = s.calls[m.id];
    let h = `<div class="chat-b"><span class="tc-who">${esc(m.from)} · ${esc(epicDate(m.at))}</span>${esc(m.text)}</div>`;
    if (m.kind === 'critical') {
      if (call) return h + `<div class="lib-message ${call.pct >= 80 ? 'success' : 'error'}"><b>Call documented: ${call.pct}%</b><br>${esc(call.feedback)}</div><div class="fs-muted">Your read-back: ${esc(call.readback)}<br>Notified: ${esc(call.who)} at ${esc(call.time)}</div>`;
      const team = uniqTeam();
      return h + `<h3 class="ho-sec">Take the call: read it back and document</h3><label class="dc-l">Read-back (patient name, test and value, as you would say it)<br><textarea id="cvRead" rows="3" style="width:100%;box-sizing:border-box;font-size:15px"></textarea></label>
        <label class="dc-l">Who did you notify? <select id="cvWho">${team.map(t => `<option>${esc(t)}</option>`).join('')}<option>Nobody yet</option></select></label>
        <label class="dc-l">Time notified <input id="cvTime" type="text" value="${esc(String(simulationTime).slice(11))}" style="width:90px"></label>
        <div id="cvMsg"></div><div class="ho-actions"><button id="cvDone" class="primary-button">Document the call</button></div>`;
    }
    if (rep) return h + `<div class="chat-b me"><span class="tc-who">You · ${esc(epicDate(rep.at))}</span>${esc(rep.text)}</div>${rep.feedback ? `<div class="fs-muted">${esc(rep.feedback)}</div>` : ''}`;
    if (m.replies) return h + `<div class="chat-replies">${m.replies.map((r, i) => `<button class="secondary-button" data-reply="${i}">${esc(r)}</button>`).join('')}</div>`;
    return h;
  }
  const uniqTeam = () => { const cc = currentCanonicalCase, e = cc.encounter || {}; return Array.from(new Set([e.attending].concat((cc.orders || []).map(o => o.provider)).filter(Boolean))).slice(0, 4); };

  function wire(m) {
    const s = st();
    document.querySelectorAll('#chatMain [data-reply]').forEach(b => b.addEventListener('click', () => {
      const text = m.replies[+b.dataset.reply];
      let fb = ''; if (m.id === 'gen_charge_trig') fb = /no, i am fine/i.test(text) ? 'A significant change in the patient: accept help and call for a rapid response early.' : 'Good: asking for help early is appropriate when the patient changes.';
      if (m.id === 'gen_charge_1' && /changing/i.test(text)) fb = 'Good: if the patient is getting worse, say so and ask for help right away.';
      s.replied[m.id] = { text, at: String(simulationTime), feedback: fb }; persist(); render(m.id);
    }));
    const done = $('cvDone'); if (done) done.addEventListener('click', () => {
      const rb = $('cvRead').value.trim(), who = $('cvWho').value, time = $('cvTime').value.trim(), cc = currentCanonicalCase, pt = safe((cc.patient || {}).name), lab = m.lab;
      if (!rb) { $('cvMsg').innerHTML = '<div class="lib-message error">Type your read-back first.</div>'; return; }
      const n = rb.toLowerCase(), parts = pt.toLowerCase().split(/\s+/).filter(x => x.length > 1);
      const items = [[parts.some(p => n.includes(p)), 'patient name'], [n.includes(lab.label.toLowerCase().split(' ')[0].slice(0, 5)), 'test name'], [new RegExp('(^|[^0-9.])' + String(parseFloat(lab.value)).replace('.', '\\.') + '([^0-9]|$)').test(rb), 'the value'], [who !== 'Nobody yet', 'who was notified'], [/^\d{1,2}:?\d{2}$/.test(time.replace(':', '')) || /\d{3,4}/.test(time), 'time notified']];
      const w = [1, 1, 2, 1, 1], got = items.reduce((t, it, i) => t + (it[0] ? w[i] : 0), 0), pct = Math.round(100 * got / 6), missing = items.filter(it => !it[0]).map(it => it[1]);
      s.calls[m.id] = { pct, readback: rb, who, time, at: String(simulationTime), feedback: missing.length ? `Missing: ${missing.join(', ')}. A good read-back repeats the patient name, the test and the exact value, then you notify the provider and document who and when.` : 'Complete: patient, test, value, who was notified and when.' };
      if (!s.read.includes(m.id)) s.read.push(m.id); persist(); badge(); render(m.id);
    });
  }

  function addForm() {
    const main = $('chatMain'); const t = String(simulationTime);
    main.innerHTML = `<h3 class="ho-sec">New message (appears at the time you set)</h3><label class="dc-l">From <input id="cmFrom" value="Hospitalist" style="width:200px"></label> <label class="dc-l">Time <input id="cmAt" value="${esc(t)}" style="width:170px"></label>
      <label class="dc-l">Message<br><textarea id="cmText" rows="3" style="width:100%;box-sizing:border-box;font-size:15px"></textarea></label><label class="dc-l">Reply choices (one per line, optional)<br><textarea id="cmReplies" rows="3" style="width:100%;box-sizing:border-box;font-size:15px"></textarea></label>
      <div class="ho-actions"><button id="cmSave" class="primary-button">Add message</button></div>`;
    $('cmSave').addEventListener('click', () => {
      const text = $('cmText').value.trim(), at = $('cmAt').value.trim(); if (!text || !parseSimDate(at)) { alert('Enter the message and a time like 2026-09-02 09:30.'); return; }
      const reps = $('cmReplies').value.split('\n').map(x => x.trim()).filter(Boolean);
      const cc = currentCanonicalCase; cc.customMessages = (cc.customMessages || []).concat([{ id: 'custom_' + Date.now(), at, from: $('cmFrom').value.trim() || 'Provider', role: 'Custom', kind: 'chat', text, replies: reps.length ? reps : null }]);
      persist(); render(); badge();
    });
  }

  function open() { if (!currentCanonicalCase) { alert('Load a patient first.'); return; } const d = ensure(); render(); if (!d.open) d.showModal(); }
  const side = document.querySelector('.sidebar');
  if (side) { const b = document.createElement('button'); b.className = 'nav-item'; b.id = 'openChatBtn'; b.innerHTML = '<span>Secure Chat</span>'; b.addEventListener('click', open); const c = $('openCarePlanBtn') || $('openDischargeBtn'); if (c && c.nextSibling) side.insertBefore(b, c.nextSibling); else side.appendChild(b); }
  window.SecureChat = { all, visible, generated, open };
})();

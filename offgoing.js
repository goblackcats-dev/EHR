/* NursingSim - report from the off-going nurse (v31). No AI and no internet needed.
   Writes the bedside report the night nurse would give at the start of the shift, from the chart as it stands at the shift start time
   (nothing that happens later in the shift is included). It uses the same five parts as the handoff practice: who and how sick, why they are here,
   assessment, medications and orders, and what to watch for with if-then plans. Instructors can edit the text and it is saved with the patient;
   anyone can have it read aloud. A "Shift report" button is added to the left menu.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, parseSimDate, combineSimDateAndClock, safe, escapeHtml, epicDate, persistCase. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const uniq = a => Array.from(new Set(a));
  const unit = o => (o.units && o.units !== '—') ? String(o.units) : '';
  const hhmm = s => String(s || '').slice(11, 16);
  const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const cleanName = n => String(n || '').replace(/\s*\(.*?\)/g, '').replace(/\s*(tablet|capsule|injection|solution|infusion|ivpb|nebulizer|suspension|patch|cream|ointment)\b.*$/i, '').replace(/\s+/g, ' ').trim();
  const list = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const BAD_VITAL = { SPO2: v => v < 92, BP: v => v < 90, HR: v => v > 120 || v < 50, RR: v => v > 24 || v < 10, TEMP: v => v >= 100.9 };

  // ------------------------------------------------------------------ build the report
  function build(cc) {
    cc = cc || currentCanonicalCase; if (!cc) return null;
    const start = String((cc.timeline || {}).simulationStart || simulationTime);
    const saved = simulationTime; let vis;
    try { simulationTime = start; vis = getVisibleCanonicalCase(cc); } finally { simulationTime = saved; }
    const obs = vis.observations || [], enc = cc.encounter || {}, pt = cc.patient || {};
    const by = (arr, key) => { const m = new Map(); arr.slice().sort((a, b) => String(a.collected).localeCompare(String(b.collected))).forEach(o => { if (!m.has(key(o))) m.set(key(o), []); m.get(key(o)).push(o); }); return m; };
    const vitalsBy = by(obs.filter(o => o.type === 'vital'), o => o.code), labsBy = by(obs.filter(o => o.type === 'lab' && /^-?\d/.test(safe(o.value))), o => o.code);
    const lastOf = m => k => { const a = m.get(k); return a ? a[a.length - 1] : null; };
    const V = lastOf(vitalsBy), L = lastOf(labsBy);
    const S = {}; // sections: title -> lines
    const add = (sec, line) => { if (line) (S[sec] = S[sec] || []).push(line); };

    // ---- 1. who and how sick
    const code = safe(enc.codeStatus, 'Full Code'), allergies = (pt.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
    const badV = ['SPO2', 'BP', 'HR', 'RR', 'TEMP'].map(V).filter(o => o && o.flag && BAD_VITAL[o.code]((o.code === 'BP' ? parseFloat(String(o.value).split('/')[0]) : parseFloat(o.value))));
    const flagged = Array.from(vitalsBy.values()).map(a => a[a.length - 1]).filter(o => o.flag && o.code !== 'PAIN');
    const crit = Array.from(labsBy.values()).map(a => a[a.length - 1]).filter(o => /critical/i.test(safe(o.flag)));
    const severity = (badV.length || crit.length) ? 'a watcher: I am keeping a close eye on them' : flagged.length ? 'a watcher, a little off baseline' : 'stable';
    add('1. Patient and how sick they are', `This is ${safe(pt.name)}, a ${safe(pt.age)}-year-old ${safe(pt.sex).toLowerCase()} in ${safe(enc.location)} room ${safe(enc.room)}. ${code}.`);
    add('1. Patient and how sick they are', allergies.length ? `Allergies: ${allergies.map(a => a.substance + (a.reaction ? ' (' + a.reaction + ')' : '')).join('; ')}.` : 'No known drug allergies.');
    if (enc.isolation && !/^none$/i.test(enc.isolation)) add('1. Patient and how sick they are', `Isolation: ${enc.isolation}.`);
    add('1. Patient and how sick they are', `Overall I would call them ${severity}.`);

    // ---- 2. situation and background
    const surg = (vis.orders || []).filter(o => /surgery|procedure/i.test(safe(o.category)) && /completed/i.test(safe(o.status)));
    add('2. Situation and background', `Admitted ${epicDate(enc.admitDate)} with ${safe(enc.chiefComplaint, 'a medical problem').toLowerCase()}; the diagnosis is ${safe(enc.diagnosis)}. Today is hospital day ${safe(enc.hospitalDay)}.`);
    if (surg.length) add('2. Situation and background', `Procedure this admission: ${list(surg.slice(0, 2).map(o => safe(o.name)))}.`);
    const chronic = (vis.problems || cc.problems || []).filter(p => /chronic/i.test(safe(p.status))).slice(0, 5).map(p => safe(p.name));
    if (chronic.length) add('2. Situation and background', `History: ${list(chronic)}.`);
    const events = (vis.notes || []).filter(n => /nursing/i.test(safe(n.type || n.noteType || n.title)) && String(n.datetime) <= start).slice(-1)[0];
    void events;

    // ---- 3. assessment
    const trend = (code, label, fmt) => { const a = vitalsBy.get(code); if (!a) return null; const cur = a[a.length - 1], prev = a.length > 1 ? a[0] : null; let t = `${label} ${fmt ? fmt(cur) : safe(cur.value)}${cur.flag ? ' (abnormal)' : ''}`; if (prev && prev !== cur && String(prev.value) !== String(cur.value)) t += `, was ${fmt ? fmt(prev) : safe(prev.value)} on arrival`; return t; };
    const vparts = [trend('HR', 'heart rate'), trend('BP', 'blood pressure'), trend('RR', 'respiratory rate'), trend('SPO2', 'oxygen saturation', o => safe(o.value) + '%'), trend('TEMP', 'temperature')].filter(Boolean);
    const lastV = V('HR') || V('BP');
    add('3. Assessment', `Last vital signs${lastV ? ' at ' + hhmm(lastV.collected) : ''}: ${vparts.join('; ')}.`);
    const pain = V('PAIN'); if (pain) add('3. Assessment', `Pain ${safe(pain.value).replace(/\/10$/, '')} out of 10.`);
    const assess = by(obs.filter(o => o.type === 'assessment'), o => `${o.section}|${o.label}`), bySec = {};
    assess.forEach(a => { const o = a[a.length - 1]; (bySec[o.section] = bySec[o.section] || []).push(o); });
    Object.keys(bySec).filter(s => !/braden|safety/i.test(s)).forEach(sec => add('3. Assessment', `${sec}: ${bySec[sec].map(o => { const v = safe(o.value); return (v.length < 18 || /^\d/.test(v)) ? `${safe(o.label).toLowerCase()} ${v}` : v; }).join('; ')}.`));
    const brad = (bySec.Braden || bySec['Braden Scale'] || []).map(o => safe(o.value)); if (brad.length) add('3. Assessment', `Skin and Braden: ${brad.join('; ')}.`);
    const labsAbn = Array.from(labsBy.values()).map(a => a[a.length - 1]).filter(o => o.flag && !/a1c|egfr|vitamin|albumin|prealbumin|total protein|mcv|hematocrit/i.test(safe(o.label)));
    labsAbn.sort((a, b) => (/critical/i.test(safe(b.flag)) ? 1 : 0) - (/critical/i.test(safe(a.flag)) ? 1 : 0));
    if (labsAbn.length) add('3. Assessment', `Labs I want you to know about: ${labsAbn.slice(0, 5).map(o => { const a = labsBy.get(o.code), prev = a.length > 1 ? a[a.length - 2] : null; return `${safe(o.label)} ${safe(o.value)} ${unit(o)}${/critical/i.test(safe(o.flag)) ? ' (critical, the provider knows)' : ''}${prev ? ' (was ' + safe(prev.value) + ')' : ''}`.replace(/\s+/g, ' '); }).join('; ')}.`);
    else add('3. Assessment', 'Labs have no major abnormal results right now.');
    const dev = (vis.devices || cc.devices || []).filter(d => !/removed/i.test(safe(d.status)));
    if (dev.length) add('3. Assessment', `Lines and tubes: ${dev.map(d => `${safe(d.type)}${d.location ? ' ' + safe(d.location) : ''}${d.gauge ? ' ' + d.gauge : ''}${d.placementDate ? ', placed ' + String(d.placementDate).slice(5, 10) : ''}, ${safe(d.status).toLowerCase()}`).join('; ')}.`);
    const io = (vis.ioEvents || []).slice(-2), tin = io.reduce((s, e) => s + (+e.intake || 0), 0), tout = io.reduce((s, e) => s + (+e.output || 0), 0);
    if (io.length) add('3. Assessment', `Intake and output over the last ${io.length * 4} hours: ${tin} mL in and ${tout} mL out${tout && tout / (io.length * 4) < 30 ? ', so urine output is low and needs watching' : ''}.`);
    add('3. Assessment', `Diet: ${safe(enc.dietOrder)}. Activity: ${safe(enc.ambulationOrder)}. Fall risk: ${safe(enc.fallRisk)}.`);

    // ---- 4. medications and orders
    const orderOf = id => (vis.orders || []).find(o => o.id === id) || {};
    const given = (vis.administrations || []).filter(a => /given/i.test(safe(a.state)) && String(a.administeredAt) < start && String(a.administeredAt) >= shiftBack(start));
    const prn = given.filter(a => (orderOf(a.orderId).medication || {}).prn), hi = given.filter(a => (orderOf(a.orderId).medication || {}).highAlert);
    if (prn.length) add('4. Medications and orders', `PRN medications I gave: ${prn.slice(-4).map(a => `${cleanName(orderOf(a.orderId).name)} at ${hhmm(a.administeredAt)}`).join('; ')}.`);
    if (hi.length) add('4. Medications and orders', `High-alert medications given overnight: ${uniq(hi.map(a => cleanName(orderOf(a.orderId).name))).slice(0, 4).join(', ')}.`);
    const nowMs = (parseSimDate(start) || new Date()).getTime();
    const dueSoon = (vis.administrations || []).filter(a => /due/i.test(safe(a.state))).map(a => ({ a, d: parseSimDate(combineSimDateAndClock(a.time)), o: orderOf(a.orderId) })).filter(x => x.d && x.o.medication && x.d - nowMs >= -3600000 && x.d - nowMs <= 7200000).sort((x, y) => x.d - y.d);
    if (dueSoon.length) add('4. Medications and orders', `Due in the first two hours: ${uniq(dueSoon.map(x => `${cleanName(x.o.name)} at ${x.a.time}${x.o.medication.highAlert ? ' (high-alert)' : ''}`)).slice(0, 6).join('; ')}.`);
    const inf = (vis.orders || []).filter(o => safe(o.category) === 'Medication' && /continuous/i.test(safe((o.mar || {}).category)) && /active/i.test(safe(o.status)));
    if (inf.length) add('4. Medications and orders', `Running infusions: ${inf.slice(0, 4).map(o => `${cleanName(o.name)} at ${safe((o.mar || {}).adminDose || (o.medication || {}).dose)}`).join('; ')}.`);
    const held = (vis.administrations || []).filter(a => /held|refused|not given/i.test(safe(a.state)));
    if (held.length) add('4. Medications and orders', `Held or refused: ${uniq(held.map(a => cleanName(orderOf(a.orderId).name))).slice(0, 3).join(', ')}.`);
    const pend = (vis.orders || []).filter(o => /imaging|laborator|cardiac|consult|surgery/i.test(safe(o.category)) && /pending|active/i.test(safe(o.status)) && String(o.start) >= start).slice(0, 5);
    if (pend.length) add('4. Medications and orders', `Coming up today: ${pend.map(o => `${safe(o.name)} at ${hhmm(o.start)}`).join('; ')}.`);

    // ---- 5. to do and if-then plans
    const todo = [];
    if (/npo/i.test(safe(enc.dietOrder))) todo.push('keep them NPO until the provider says otherwise');
    if (/high/i.test(safe(enc.fallRisk))) todo.push('use the bed alarm and call-light teaching because they are a high fall risk');
    if (dev.some(d => /foley|urinary/i.test(safe(d.type)))) todo.push('review whether the Foley is still needed');
    if (dev.some(d => /peripheral iv/i.test(safe(d.type)))) todo.push('check IV site and flushes');
    if (pain && parseFloat(pain.value) >= 5) todo.push('reassess pain after each pain medication');
    if (todo.length) add('5. To do and if-then plans', `To do: ${list(todo)}.`);
    const dx = `${safe(enc.diagnosis)} ${chronic.join(' ')}`.toLowerCase();
    const ifs = [];
    ifs.push('If oxygen saturation drops below 90%, raise the head of the bed, increase oxygen and call the provider.');
    ifs.push('If systolic blood pressure falls below 90 or the heart rate goes above 120, recheck and call the provider.');
    if (/diabet|dka|hhs|insulin/.test(dx)) ifs.push('If glucose is below 70 treat per protocol and call; if above 300 call for orders.');
    if (/anticoag|fibrillation|embol|dvt|heparin|enoxaparin|apixaban/.test(dx)) ifs.push('If you see bleeding, black stools, or a sudden headache, call the provider right away.');
    if (/sepsis|infection|pneumonia|uti|cellulitis/.test(dx)) ifs.push('If temperature goes above 102 F, or new confusion or low urine output, call the provider; they may need a sepsis re-evaluation.');
    if (/heart failure|chf/.test(dx)) ifs.push('If weight is up more than 2 pounds or lungs sound wet, call the provider about diuretics.');
    if (/surg|ectomy|plasty|appendic|cholecyst|fracture|post/.test(dx)) ifs.push('If incision drainage increases, pain is not controlled, or the patient is short of breath, call the provider.');
    ifs.slice(0, 4).forEach(t => add('5. To do and if-then plans', t));
    add('5. To do and if-then plans', 'Do you have any questions? I will be here for a few more minutes.');
    const sections = Object.keys(S).map(k => ({ title: k, lines: S[k] }));
    return { at: start, sections, text: sections.map(s => s.title + '\n' + s.lines.join(' ')).join('\n\n') };
  }
  function shiftBack(start) { const d = parseSimDate(start); if (!d) return ''; d.setHours(d.getHours() - 12); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }

  // ------------------------------------------------------------------ dialog
  const isInstructor = !window.NS_STUDENT;
  function ensureDialog() {
    let dlg = $('ogDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'ogDialog'; dlg.className = 'quiz-dialog';
    document.body.appendChild(dlg); return dlg;
  }
  function render() {
    const cc = currentCanonicalCase, r = build(cc), dlg = ensureDialog(), custom = cc.offgoingReport && cc.offgoingReport.text;
    const body = custom ? `<div class="og-text">${esc(custom).replace(/\n/g, '<br>')}</div>` : r.sections.map(s => `<h3 class="ho-sec">${esc(s.title)}</h3><p class="og-p">${s.lines.map(esc).join(' ')}</p>`).join('');
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Report from the night nurse</h2><p>As it was given at ${esc(epicDate(r.at))}${custom ? ' (edited by your instructor)' : ''}. Take notes: you will give report at the end of your shift.</p></div><button id="ogClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="ho-actions"><button id="ogSpeak" class="primary-button">▶ Read aloud</button> <button id="ogPrint" class="secondary-button">Print</button>${isInstructor ? ' <button id="ogEdit" class="secondary-button">Edit text</button>' + (custom ? ' <button id="ogReset" class="secondary-button">Back to generated report</button>' : '') : ''}</div>
      <div id="ogBody">${body}</div></div>`;
    $('ogClose').addEventListener('click', () => { stopSpeak(); dlg.close(); });
    $('ogSpeak').addEventListener('click', toggleSpeak);
    $('ogPrint').addEventListener('click', () => NSWristband.showDialog('Report from the night nurse', esc(safe(cc.patient.name)), `<div class="og-text">${esc(custom || r.text).replace(/\n/g, '<br>')}</div>`));
    if (isInstructor) {
      $('ogEdit').addEventListener('click', () => {
        $('ogBody').innerHTML = `<textarea id="ogTa" rows="16" style="width:100%;box-sizing:border-box;font-size:15px">${esc(custom || r.text)}</textarea><div class="ho-actions"><button id="ogSave" class="primary-button">Save text with this patient</button></div>`;
        $('ogSave').addEventListener('click', () => { cc.offgoingReport = { text: $('ogTa').value, edited: true }; try { persistCase(); } catch (e) { /* best effort */ } render(); });
      });
      const rs = $('ogReset'); if (rs) rs.addEventListener('click', () => { delete cc.offgoingReport; try { persistCase(); } catch (e) { /* best effort */ } render(); });
    }
  }
  function stopSpeak() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* ignore */ } const b = $('ogSpeak'); if (b) b.textContent = '▶ Read aloud'; }
  function toggleSpeak() {
    if (!window.speechSynthesis) { alert('This device cannot read aloud.'); return; }
    if (speechSynthesis.speaking) { stopSpeak(); return; }
    const cc = currentCanonicalCase, text = (cc.offgoingReport && cc.offgoingReport.text) || build(cc).text;
    const u = new SpeechSynthesisUtterance(text.replace(/\n+/g, '. ').replace(/\b(\d+)\/10\b/g, '$1 out of 10')); u.rate = 0.95; u.onend = () => stopSpeak();
    $('ogSpeak').textContent = '■ Stop'; speechSynthesis.speak(u);
  }

  function open() { if (!currentCanonicalCase) { alert('Load a patient first.'); return; } const dlg = ensureDialog(); render(); if (!dlg.open) dlg.showModal(); }

  const side = document.querySelector('.sidebar');
  if (side) { const b = document.createElement('button'); b.className = 'nav-item'; b.id = 'openReportBtn'; b.innerHTML = '<span>Shift Report</span>'; b.addEventListener('click', open); side.appendChild(b); }
  window.OffgoingReport = { build, open };
})();

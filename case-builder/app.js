/* NursingSim Case Builder v2 - screen logic. */
(() => {
  const U = NS.util;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const STORE_INPUT = 'nursingsim.builder.inputs.v2', STORE_CASE = 'nursingsim.case.v1', STORE_KEY = 'nursingsim.builder.apikey', STORE_AI = 'nursingsim.builder.ai';
  const safeGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  const safeDel = k => { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } };

  const today = () => { const d = new Date(); return `${d.getFullYear()}-${U.pad(d.getMonth() + 1)}-${U.pad(d.getDate())}`; };
  const DEFAULTS = () => ({
    name: 'Taylor Morgan', age: 54, sex: 'Male', mrn: 'SIM-001001', unit: '4 Medical-Surgical', room: '414A', heightCm: '', weightKg: '', codeStatus: 'Full Code',
    studentLevel: 'ADN second year', complexity: 'moderate', primary: 'appendicitis', hospitalDay: 2, simDate: today(), startTime: '07:00',
    hx: ['htn', 'dm2'], surg: [], surgText: '', allergies: [], facultyNotes: '',
    social: { tobacco: 'Never', alcohol: 'None', drugs: 'None', living: 'Lives with spouse/partner', function: 'Independent', other: '' }
  });

  let input = DEFAULTS();
  let result = null;
  let noteIdx = 0, editing = false;
  let originalBodies = null;

  // ------------------------------------------------------------------ form <-> input
  function readInput() {
    const v = id => $(id).value;
    input = {
      name: v('name').trim() || 'Simulated Patient', age: parseInt(v('age'), 10) || 60, sex: input.sex, mrn: v('mrn').trim() || 'SIM-001001', unit: v('unit').trim(), room: v('room').trim(),
      heightCm: v('heightCm').trim(), weightKg: v('weightKg').trim(), codeStatus: v('codeStatus'), studentLevel: v('studentLevel'), complexity: v('complexity'),
      primary: v('primary'), hospitalDay: U.clamp(parseInt(v('hospitalDay'), 10) || 1, 1, 21), simDate: v('simDate') || today(), startTime: v('startTime') || '07:00',
      hx: input.hx.slice(), surg: input.surg.slice(), surgText: v('surgText'), allergies: input.allergies.slice(), facultyNotes: v('facultyNotes'),
      social: { tobacco: v('tobacco'), alcohol: v('alcohol'), drugs: v('drugs'), living: v('living'), function: v('fn'), other: v('socialOther') }
    };
    const other = v('allergyOther').trim();
    if (other) input.allergies = input.allergies.filter(a => !a.custom).concat([{ substance: other, reaction: v('allergyReaction').trim() || 'Reaction not documented', severity: 'Moderate', custom: true }]);
    return input;
  }

  function writeForm() {
    const set = (id, val) => { $(id).value = val ?? ''; };
    ['name', 'age', 'mrn', 'unit', 'room', 'heightCm', 'weightKg', 'codeStatus', 'studentLevel', 'complexity', 'primary', 'hospitalDay', 'simDate', 'startTime', 'surgText', 'facultyNotes'].forEach(id => set(id, input[id]));
    set('tobacco', input.social.tobacco); set('alcohol', input.social.alcohol); set('drugs', input.social.drugs); set('living', input.social.living); set('fn', input.social.function); set('socialOther', input.social.other);
    const custom = input.allergies.find(a => a.custom);
    set('allergyOther', custom ? custom.substance : ''); set('allergyReaction', custom ? custom.reaction : '');
    document.querySelectorAll('#sexSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === input.sex));
  }

  // ------------------------------------------------------------------ chips
  function chip(label, on, onClick, title) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip' + (on ? ' on' : ''); b.textContent = label; if (title) b.title = title;
    b.addEventListener('click', onClick);
    return b;
  }
  function renderChips() {
    const hx = $('hxChips'); hx.innerHTML = '';
    Object.keys(NS.HX.M).forEach(k => hx.appendChild(chip(NS.HX.M[k].label, input.hx.includes(k), () => {
      toggle(input.hx, k);
      if (k === 'esrd' && input.hx.includes('esrd')) input.hx = input.hx.filter(x => x !== 'ckd3');
      if (k === 'ckd3' && input.hx.includes('ckd3')) input.hx = input.hx.filter(x => x !== 'esrd');
      renderChips(); changed();
    }, NS.HX.M[k].desc)));
    const effects = input.hx.map(k => `<div><b>${esc(NS.HX.M[k].label)}:</b> ${esc(NS.HX.M[k].desc)}</div>`).join('');
    $('hxEffects').innerHTML = effects || '<div>No medical history selected.</div>';

    const sg = $('surgChips'); sg.innerHTML = '';
    NS.HX.SURGERIES.forEach(([k, label]) => sg.appendChild(chip(label, input.surg.includes(k), () => { toggle(input.surg, k); renderChips(); changed(); })));

    const al = $('allergyChips'); al.innerHTML = '';
    al.appendChild(chip('No known allergies', !input.allergies.some(a => !a.custom), () => { input.allergies = input.allergies.filter(a => a.custom); renderChips(); changed(); }));
    NS.HX.ALLERGIES.forEach(a => al.appendChild(chip(a.substance, input.allergies.some(x => x.substance === a.substance), () => {
      if (input.allergies.some(x => x.substance === a.substance)) input.allergies = input.allergies.filter(x => x.substance !== a.substance);
      else input.allergies.push({ substance: a.substance, reaction: a.reaction, severity: a.severity });
      renderChips(); changed();
    })));
  }
  const toggle = (arr, k) => { const i = arr.indexOf(k); if (i >= 0) arr.splice(i, 1); else arr.push(k); };

  // ------------------------------------------------------------------ preview strip
  let previewTimer = null;
  function changed() { clearTimeout(previewTimer); previewTimer = setTimeout(updatePreview, 250); safeSet(STORE_INPUT, JSON.stringify(readInput())); }

  function updatePreview() {
    const p = NS.PRIMARY[$('primary').value];
    $('primaryDesc').textContent = p ? p.desc : '';
    readInput();
    try {
      const r = NS.buildCase(JSON.parse(JSON.stringify(input)));
      const upcoming = r.report.timeline.filter(t => t.future && ['surgery', 'procedure', 'consult', 'imaging', 'transfer'].includes(t.type)).slice(0, 4).map(t => `${U.hhmm(t.ts)} ${esc(t.text)}`);
      const typical = p && p.typicalLOS ? `Typical stay ${p.typicalLOS[0]}-${p.typicalLOS[1]} days.` : '';
      const errs = r.report.warnings.filter(w => w.level === 'error' || w.level === 'warning').map(w => `<div style="color:${w.level === 'error' ? '#9b1c1c' : '#7a5900'}">⚠ ${esc(w.text)}</div>`).join('');
      $('stagePreview').innerHTML = `<b>Hospital day ${input.hospitalDay}:</b> ${esc(r.report.stage || '')}. ${typical}${upcoming.length ? `<div><b>Coming up this shift:</b> ${upcoming.join('; ')}.</div>` : ''}${errs}`;
    } catch (e) {
      $('stagePreview').innerHTML = `<span style="color:#9b1c1c">Could not preview: ${esc(e.message)}</span>`;
    }
  }

  // ------------------------------------------------------------------ build + render
  function build() {
    readInput();
    safeSet(STORE_INPUT, JSON.stringify(input));
    try {
      result = NS.buildCase(JSON.parse(JSON.stringify(input)));
    } catch (e) {
      console.error(e);
      $('alerts').innerHTML = `<div class="alert error">The patient could not be built: ${esc(e.message)}</div>`;
      showPane('result');
      return;
    }
    originalBodies = null; editing = false;
    noteIdx = Math.max(0, result.canonical.notes.findIndex(n => n.datetime <= result.canonical.timeline.simulationStart));
    renderResult();
    showPane('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderResult() {
    const c = result.canonical, r = result.report;
    const pod = result.state.postopDay(result.ctx.nowH);
    $('summaryLine').innerHTML = `${esc(c.patient.name)}, ${c.patient.age} ${c.patient.sex === 'Female' ? 'F' : 'M'}: ${esc(c.encounter.diagnosis)}<div class="summary-sub">Hospital day ${r.hospitalDay}${pod !== null && !/post-op/i.test(r.stage) ? ` · post-operative day ${pod}` : ''} · ${esc(r.stage)} · admitted ${U.epic(r.admit)} · simulation starts ${U.epic(c.timeline.simulationStart)}</div>`;
    const bad = r.warnings.filter(w => w.level === 'error' || w.level === 'warning').length;
    $('countStrip').innerHTML = [['Problems', r.counts.problems], ['Orders', r.counts.orders], ['Medications', r.counts.medications], ['Lab results', r.counts.labs], ['Notes', r.counts.notes], ['Needs attention', bad]].map(([l, n]) => `<div class="count"><b>${n}</b>${l}</div>`).join('');
    const shown = r.warnings.filter(w => w.level !== 'info' && w.level !== 'pass');
    const infos = r.warnings.filter(w => w.level === 'info' || w.level === 'pass');
    const adj = (r.applied || []).concat((result.spec.directives && result.spec.directives.matched || []).map(m => `Faculty direction applied: ${m}`));
    $('alerts').innerHTML = shown.map(w => `<div class="alert ${w.level}">${esc(w.text)}</div>`).join('') + infos.map(w => `<div class="alert ${w.level}">${esc(w.text)}</div>`).join('') +
      (adj.length ? `<details class="alert-more"><summary>What the builder adjusted for this patient (${adj.length})</summary>${adj.map(a => `<div class="alert info">${esc(a)}</div>`).join('')}</details>` : '');
    renderCourse(); renderNotes(); renderMeds(); renderOrders(); renderLabs(); renderVitals(); updateCost();
    $('jsonOut').value = '';
    activateTab(document.querySelector('.tab.active').dataset.tab);
  }

  function renderCourse() {
    const r = result.report, ctx = result.ctx;
    const byDay = new Map();
    const startTs = ctx.start;
    const day0 = U.parse(U.dateOnly(ctx.admit) + ' 00:00');
    const items = r.timeline.slice();
    items.push({ ts: startTs, h: ctx.nowH, type: 'now', text: 'SIMULATION STARTS HERE', future: false });
    items.sort((a, b) => a.ts.localeCompare(b.ts) || (a.type === 'now' ? 1 : 0));
    items.forEach(t => { const d = U.dateOnly(t.ts); if (!byDay.has(d)) byDay.set(d, []); byDay.get(d).push(t); });
    let html = '';
    byDay.forEach((list, d) => {
      const n = Math.round((U.parse(d + ' 00:00') - day0) / 86400000) + 1;
      html += `<div class="day"><h3>Hospital day ${n} · ${U.weekday(d + ' 00:00')} ${U.mdy(d + ' 00:00')}</h3>${list.map(t => `<div class="ev ${t.type === 'now' ? 'now' : ''} ${t.future ? 'future' : ''}"><span class="t">${U.hhmm(t.ts)}</span><span class="k">${esc(t.type === 'now' ? '▶' : t.type)}</span><span class="x">${esc(t.text)}${t.future ? ' (upcoming)' : ''}</span></div>`).join('')}</div>`;
    });
    $('tab-course').innerHTML = html;
  }

  const kindOf = n => (n.category === 'Nursing Note' ? 'nursing' : n.type === 'therapyNotes' || n.type === 'caseManagement' ? 'therapy' : n.type === 'erVisitSummary' ? 'ed' : (n.type === 'hp' || /MD/.test(n.author)) && n.type !== 'imaging' && n.type !== 'cardiology' ? 'physician' : 'other');
  window.NSApp = { kindOf, getNotes: () => (result ? result.canonical.notes : []), refreshNotes: () => { renderNotes(); } };

  function renderNotes() {
    const notes = result.canonical.notes;
    if (noteIdx >= notes.length) noteIdx = 0;
    $('noteList').innerHTML = notes.map((n, i) => `<button class="note-item ${i === noteIdx ? 'active' : ''} ${n.datetime > result.canonical.timeline.simulationStart ? 'future' : ''}" data-i="${i}"><div class="nt">${esc(n.title)}${n.enhanced ? ' <span class="ai-tag">AI</span>' : ''}</div><div class="nm">${esc(n.author)} · ${U.epic(n.datetime)}</div></button>`).join('');
    $('noteList').querySelectorAll('.note-item').forEach(b => b.addEventListener('click', () => { noteIdx = +b.dataset.i; editing = false; renderNotes(); }));
    showNote();
  }
  function fmtBody(text) {
    let html = '', inList = false;
    String(text || '').split('\n').forEach(line => {
      const t = line.trim();
      if (!t) { if (inList) { html += '</ul>'; inList = false; } html += '<br>'; return; }
      const bold = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (t.startsWith('- ')) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${bold(t.slice(2))}</li>`; return; }
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div>${bold(t)}</div>`;
    });
    return html + (inList ? '</ul>' : '');
  }
  function showNote() {
    const n = result.canonical.notes[noteIdx];
    if (!n) { $('noteBody').innerHTML = ''; return; }
    $('noteMeta').innerHTML = `<div class="nt">${esc(n.title)}</div><div class="nm">${esc(n.author)} · ${U.epic(n.datetime)} · ${esc(n.category)}${n.enhanced ? ' · enhanced with Claude' : ''}</div>`;
    $('noteBody').classList.toggle('hidden', editing); $('noteEdit').classList.toggle('hidden', !editing);
    $('noteBody').innerHTML = fmtBody(n.body);
    $('noteEdit').value = n.body;
    $('noteEditBtn').textContent = editing ? 'Done' : 'Edit text';
  }

  function renderMeds() {
    const c = result.canonical;
    const meds = c.orders.filter(o => o.category === 'Medication');
    const due = id => c.administrations.filter(a => a.orderId === id && a.state === 'due').map(a => a.time).sort()[0] || '';
    $('tab-meds').innerHTML = `<table class="data"><thead><tr><th>Medication</th><th>Dose / route</th><th>Frequency</th><th>Status</th><th>Next due</th><th>Class</th><th>Started</th></tr></thead><tbody>${meds.map(o => `<tr><td><b>${esc(o.name)}</b><div class="hint">${esc(o.rationale)}</div></td><td>${esc(o.medication.dose)} ${esc(o.medication.route)}</td><td>${esc(o.frequency)}</td><td><span class="badge ${o.status}">${o.status}</span></td><td>${due(o.id)}</td><td>${esc(o.medication.drugClass)}</td><td>${U.epic(o.start)}${o.end ? '<br>→ ' + U.epic(o.end) : ''}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderOrders() {
    const orders = result.canonical.orders.filter(o => o.category !== 'Medication').sort((a, b) => a.start.localeCompare(b.start));
    $('tab-orders').innerHTML = `<table class="data"><thead><tr><th>Order</th><th>Category</th><th>Frequency</th><th>Status</th><th>Start → end</th><th>Provider</th></tr></thead><tbody>${orders.map(o => `<tr><td><b>${esc(o.name)}</b><div class="hint">${esc(o.instructions)}</div></td><td>${esc(o.category)}</td><td>${esc(o.frequency)}</td><td><span class="badge ${o.status}">${o.status}</span></td><td>${U.epic(o.start)}${o.end ? '<br>→ ' + U.epic(o.end) : ''}</td><td>${esc(o.provider)}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderLabs() {
    const c = result.canonical, now = c.timeline.simulationStart;
    const labs = c.observations.filter(o => o.type === 'lab');
    const times = U.uniq(labs.map(l => l.collected)).sort().slice(-8);
    const codes = []; labs.forEach(l => { if (!codes.includes(l.code)) codes.push(l.code); });
    const head = `<tr><th>Result</th>${times.map(t => `<th class="${t > now ? 'future' : ''}">${U.epic(t)}${t > now ? '<br>(upcoming)' : ''}</th>`).join('')}<th>Reference</th></tr>`;
    const rows = codes.map(code => {
      const cells = times.map(t => { const l = labs.find(x => x.code === code && x.collected === t); if (!l) return '<td></td>'; const cls = /high/i.test(l.flag) ? 'flag-high' : /low/i.test(l.flag) ? 'flag-low' : /abnormal/i.test(l.flag) ? 'flag-high' : ''; return `<td class="${cls} ${t > now ? 'future' : ''}">${esc(l.value)}${l.units && l.units.length < 6 ? ' ' + esc(l.units) : ''}</td>`; }).join('');
      const ref = labs.find(x => x.code === code);
      return `<tr><td><b>${esc(code)}</b></td>${cells}<td class="hint">${esc(ref.reference)} ${esc(ref.units)}</td></tr>`;
    }).join('');
    $('tab-labs').innerHTML = `<table class="data"><thead>${head}</thead><tbody>${rows}</tbody></table>`;
  }
  function renderVitals() {
    const sets = result.state.vitalSets.slice(-14).reverse();
    $('tab-vitals').innerHTML = `<table class="data"><thead><tr><th>Time</th><th>Temp</th><th>HR</th><th>BP</th><th>RR</th><th>SpO₂</th><th>O₂ device</th><th>Pain</th></tr></thead><tbody>${sets.map(s => `<tr><td>${U.epic(s.collected)}</td><td class="${s.temp >= 100.4 ? 'flag-high' : ''}">${s.temp.toFixed(1)} °F</td><td class="${s.hr > 100 ? 'flag-high' : ''}">${s.hr}</td><td>${s.sbp}/${s.dbp}</td><td class="${s.rr > 22 ? 'flag-high' : ''}">${s.rr}</td><td class="${s.spo2 < 92 ? 'flag-high' : ''}">${s.spo2}%</td><td>${esc(s.o2)}</td><td>${s.pain}/10</td></tr>`).join('')}</tbody></table>`;
  }

  // ------------------------------------------------------------------ tabs / panes
  function activateTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'tab-' + name));
    if (name === 'json' && result && !$('jsonOut').value) $('jsonOut').value = JSON.stringify(result.canonical, null, 2);
  }
  function showPane(name) {
    document.querySelectorAll('.switch-btn').forEach(b => b.classList.toggle('active', b.dataset.pane === name));
    $('setupPane').classList.toggle('hidden-pane', name !== 'setup');
    $('resultPane').classList.toggle('hidden-pane', name !== 'result');
  }

  // ------------------------------------------------------------------ outputs
  function currentJson() { return JSON.stringify(result.canonical, null, 2); }
  function openInEhr() {
    if (!result) return;
    const ok = safeSet(STORE_CASE, JSON.stringify({ canonical: result.canonical, simulationTime: result.canonical.timeline.simulationStart }));
    if (!ok) { alert('This browser would not let the builder pass the patient to the EHR (private browsing?). Use Download JSON, then Import Patient in the EHR.'); return; }
    window.location.href = '../index.html';
  }
  function download() {
    const blob = new Blob([currentJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${U.slug(result.canonical.caseMeta.title)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);          // Safari needs the URL to stay valid briefly
  }
  async function copyJson() {
    try { await navigator.clipboard.writeText(currentJson()); $('copyBtn').textContent = 'Copied'; }
    catch (e) { $('tab-json').classList.remove('hidden'); activateTab('json'); $('jsonOut').focus(); $('jsonOut').setSelectionRange(0, $('jsonOut').value.length); $('copyBtn').textContent = 'Select all, then copy'; }
    setTimeout(() => { $('copyBtn').textContent = 'Copy JSON'; }, 2000);
  }

  // ------------------------------------------------------------------ AI panel glue (ai.js does the API work)
  const SCOPES = [['physician', 'Physician notes (H&P, progress, op, consults)'], ['nursing', 'Nursing notes'], ['therapy', 'PT / OT / SLP / RD / RT / case management'], ['ed', 'ED note']];
  let aiScope = { physician: true, nursing: true, therapy: false, ed: false };
  let aiAbort = null;
  function renderScope() {
    const box = $('aiScope'); box.innerHTML = '';
    SCOPES.forEach(([k, label]) => box.appendChild(chip(label, aiScope[k], () => { aiScope[k] = !aiScope[k]; renderScope(); updateCost(); })));
    updateCost();
  }
  function selectedNotes() { return result ? result.canonical.notes.filter(n => aiScope[kindOf(n)]) : []; }
  function updateCost() {
    if (!result) { $('aiCost').textContent = ''; return; }
    const n = selectedNotes().length;
    const rate = { 'claude-opus-5-5': [4, 20], 'claude-sonnet-5-5': [2, 10], 'claude-haiku-5-5': [0.1, 0.5] }[$('aiModel').value] || [4, 20];
    const inTok = n * 3500, outTok = n * 1500;
    $('aiCost').textContent = `${n} note(s) selected. Estimated cost about $${((inTok * rate[0] + outTok * rate[1]) / 1e6).toFixed(2)} on this model (a rough estimate; Anthropic bills your account).`;
  }
  async function runAi() {
    if (!window.NSAI) { $('aiStatus').innerHTML = '<span class="bad">The AI module did not load (is the device offline?). Try again.</span>'; return; }
    const key = $('apiKey').value.trim();
    if (!key) { $('aiStatus').innerHTML = '<span class="bad">Paste your Anthropic API key first.</span>'; return; }
    if ($('rememberKey').checked) safeSet(STORE_KEY, key); else safeDel(STORE_KEY);
    safeSet(STORE_AI, JSON.stringify({ model: $('aiModel').value, scope: aiScope, remember: $('rememberKey').checked }));
    const notes = selectedNotes();
    if (!notes.length) { $('aiStatus').innerHTML = '<span class="bad">Choose at least one kind of note.</span>'; return; }
    if (!originalBodies) originalBodies = new Map(result.canonical.notes.map(n => [n.id, n.body]));
    $('aiRunBtn').disabled = true; $('aiStopBtn').disabled = false;
    $('aiStatus').innerHTML = `<progress id="aiProg" max="${notes.length}" value="0"></progress><div id="aiLog"></div>`;
    aiAbort = new AbortController();
    let done = 0;
    await window.NSAI.enhanceNotes({
      apiKey: key, model: $('aiModel').value, notes, caseDigest: window.NSAI.digest(result), signal: aiAbort.signal,
      onNote: (n, ok, msg) => { done++; $('aiProg').value = done; $('aiLog').insertAdjacentHTML('beforeend', `<div class="${ok ? 'ok' : 'bad'}">${ok ? '✓' : '✗'} ${esc(n.title)}${msg ? ': ' + esc(msg) : ''}</div>`); if (ok) renderNotes(); }
    });
    $('aiRunBtn').disabled = false; $('aiStopBtn').disabled = true; aiAbort = null;
    renderNotes();
  }
  function restoreOriginal() {
    if (!originalBodies) return;
    result.canonical.notes.forEach(n => { if (originalBodies.has(n.id)) { n.body = originalBodies.get(n.id); delete n.enhanced; } });
    originalBodies = null; renderNotes();
    $('aiStatus').innerHTML = '<span class="ok">Original text restored.</span>';
  }


  // ------------------------------------------------------------------ saved patient library (../library.js)
  let libraryId = null, libraryName = '';
  const lmsg = (t, k = '') => { $('libMessage').textContent = t || ''; $('libMessage').className = 'lib-message ' + k; };
  const lwhen = iso => { try { const d = new Date(iso); return `${U.pad(d.getMonth() + 1)}/${U.pad(d.getDate())}/${String(d.getFullYear()).slice(2)} ${U.pad(d.getHours())}${U.pad(d.getMinutes())}`; } catch (e) { return ''; } };

  async function refreshLibrary() {
    try {
      const rows = await NSLib.list();
      $('libList').innerHTML = rows.length ? rows.map(r => `<div class="lib-row ${r.id === libraryId ? 'current' : ''}" data-id="${esc(r.id)}">
        <div class="lib-info"><div class="lib-name">${esc(r.name)}${r.id === libraryId ? ' <span class="lib-badge">open now</span>' : ''}</div>
        <div class="lib-meta">${esc((r.meta && r.meta.patientName) || '')}${r.meta && r.meta.age ? ', ' + r.meta.age + ' y.o.' : ''} · ${esc((r.meta && r.meta.diagnosis) || '')}${r.meta && r.meta.hospitalDay ? ' · hospital day ' + r.meta.hospitalDay : ''} · saved ${lwhen(r.updatedAt)} · ${r.source === 'ehr' ? 'saved from the EHR' : 'from the builder'}</div></div>
        <div class="lib-actions">${r.source === 'builder' ? '<button data-act="load" class="primary-button">Edit in builder</button>' : ''}<button data-act="ehr" class="secondary-button">Open in EHR</button><button data-act="rename" class="secondary-button">Rename</button><button data-act="copy" class="secondary-button">Duplicate</button><button data-act="export" class="secondary-button">Export</button><button data-act="delete" class="secondary-button danger">Delete</button></div></div>`).join('')
        : '<div class="hint">Nothing saved yet. Build a patient, then press Save to library.</div>';
    } catch (e) { $('libList').innerHTML = ''; lmsg(e.message, 'error'); }
  }

  async function saveCurrent() {
    if (!result) { lmsg('Build a patient first.', 'error'); return; }
    try {
      const name = $('libSaveName').value.trim() || `${result.canonical.patient.name}: ${result.canonical.encounter.diagnosis}, hospital day ${result.ctx.L}`;
      const row = await NSLib.save({ id: libraryId, name, canonical: result.canonical, simulationTime: result.canonical.timeline.simulationStart, source: 'builder' });
      libraryId = row.id; libraryName = row.name; $('libSaveName').value = row.name;
      lmsg(`Saved "${row.name}".`, 'success'); await refreshLibrary();
    } catch (e) { lmsg(e.message, 'error'); }
  }

  // Rebuild from the saved inputs (the same inputs always give the same patient), then put back any edited or enhanced notes.
  async function editInBuilder(id) {
    const row = await NSLib.get(id);
    const saved = row.canonical.facultyBuilder && row.canonical.facultyBuilder.inputs;
    if (!saved || !NS.PRIMARY[saved.primary]) { lmsg('This patient was not made by the builder, so it cannot be edited here. Use Open in EHR.', 'error'); return; }
    input = Object.assign(DEFAULTS(), saved, { social: Object.assign(DEFAULTS().social, saved.social || {}) });
    writeForm(); renderChips(); build();
    const byId = new Map(row.canonical.notes.map(n => [n.id, n]));
    result.canonical.notes.forEach(n => { const s = byId.get(n.id); if (s) { n.body = s.body; if (s.enhanced) n.enhanced = true; } });
    renderNotes();
    libraryId = row.id; libraryName = row.name; $('libSaveName').value = row.name;
    $('libraryDialog').close();
  }
  async function openInEhrFrom(id) {
    const row = await NSLib.get(id);
    if (safeSet(STORE_CASE, JSON.stringify({ canonical: row.canonical, simulationTime: row.simulationTime || row.canonical.timeline.simulationStart }))) window.location.href = '../index.html';
    else lmsg('This browser would not let the builder pass the patient to the EHR.', 'error');
  }

  // ------------------------------------------------------------------ boot
  function init() {
    // primary diagnosis list
    const sel = $('primary');
    ['Surgical', 'Medical'].forEach(group => {
      const og = document.createElement('optgroup'); og.label = group;
      Object.values(NS.PRIMARY).filter(p => p.group === group).forEach(p => { const o = document.createElement('option'); o.value = p.key; o.textContent = p.label; og.appendChild(o); });
      sel.appendChild(og);
    });
    try { const saved = JSON.parse(safeGet(STORE_INPUT) || 'null'); if (saved && saved.primary && NS.PRIMARY[saved.primary]) input = Object.assign(DEFAULTS(), saved, { social: Object.assign(DEFAULTS().social, saved.social || {}) }); } catch (e) { /* use defaults */ }
    writeForm(); renderChips();

    document.querySelectorAll('#sexSeg button').forEach(b => b.addEventListener('click', () => { input.sex = b.dataset.v; writeForm(); changed(); }));
    document.querySelectorAll('.card input:not(#apiKey):not(#rememberKey), .card select:not(#aiModel), .card textarea:not(#noteEdit):not(#jsonOut)').forEach(el => { el.addEventListener('input', changed); el.addEventListener('change', changed); });
    $('dayMinus').addEventListener('click', () => { $('hospitalDay').value = Math.max(1, (parseInt($('hospitalDay').value, 10) || 1) - 1); changed(); });
    $('dayPlus').addEventListener('click', () => { $('hospitalDay').value = Math.min(21, (parseInt($('hospitalDay').value, 10) || 1) + 1); changed(); });
    $('clearHx').addEventListener('click', () => { input.hx = []; renderChips(); changed(); });
    $('buildBtn').addEventListener('click', build);
    $('resetBtn').addEventListener('click', () => { if (confirm('Reset every field to the starting example?')) { input = DEFAULTS(); writeForm(); renderChips(); changed(); build(); } });
    $('openEhrBtn').addEventListener('click', openInEhr);
    $('downloadBtn').addEventListener('click', download);
    $('copyBtn').addEventListener('click', copyJson);
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => activateTab(t.dataset.tab)));
    document.querySelectorAll('.switch-btn').forEach(b => b.addEventListener('click', () => showPane(b.dataset.pane)));
    $('noteEditBtn').addEventListener('click', () => { editing = !editing; showNote(); });
    $('noteEdit').addEventListener('input', () => { const n = result.canonical.notes[noteIdx]; n.body = $('noteEdit').value; $('jsonOut').value = ''; });
    $('jsonOut').addEventListener('change', () => { try { const parsed = JSON.parse($('jsonOut').value); result.canonical = parsed; renderNotes(); } catch (e) { alert('That JSON could not be read: ' + e.message); } });


    $('saveLibBtn').addEventListener('click', () => { $('libSaveName').value = libraryName || ''; $('libraryDialog').showModal(); lmsg(''); refreshLibrary(); saveCurrent(); });
    $('openLibraryBtn').addEventListener('click', () => { $('libSaveName').value = libraryName || ''; lmsg(''); $('libraryDialog').showModal(); refreshLibrary(); });
    $('closeLibraryBtn').addEventListener('click', () => $('libraryDialog').close());
    $('libSaveBtn').addEventListener('click', saveCurrent);
    $('libImportFile').addEventListener('change', async ev => { const f = ev.target.files[0]; if (!f) return; try { const row = await NSLib.importFile(f); lmsg(`Imported "${row.name}".`, 'success'); await refreshLibrary(); } catch (e) { lmsg(e.message, 'error'); } ev.target.value = ''; });
    $('libList').addEventListener('click', async ev => {
      const b = ev.target.closest('button[data-act]'); if (!b) return;
      const id = b.closest('.lib-row').dataset.id, act = b.dataset.act;
      try {
        if (act === 'load') await editInBuilder(id);
        else if (act === 'ehr') await openInEhrFrom(id);
        else if (act === 'rename') { const row = await NSLib.get(id); const n = window.prompt('New name:', row.name); if (n) { await NSLib.rename(id, n); if (id === libraryId) libraryName = n; await refreshLibrary(); } }
        else if (act === 'copy') { await NSLib.duplicate(id); await refreshLibrary(); }
        else if (act === 'export') NSLib.download(await NSLib.get(id));
        else if (act === 'delete') { if (window.confirm('Delete this saved patient? This cannot be undone.')) { await NSLib.remove(id); if (id === libraryId) libraryId = null; await refreshLibrary(); } }
      } catch (e) { lmsg(e.message, 'error'); }
    });

    // AI controls
    try { const ai = JSON.parse(safeGet(STORE_AI) || 'null'); if (ai) { $('aiModel').value = ai.model || 'claude-opus-5-5'; aiScope = Object.assign(aiScope, ai.scope || {}); $('rememberKey').checked = !!ai.remember; } } catch (e) { /* ignore */ }
    const k = safeGet(STORE_KEY); if (k) { $('apiKey').value = k; $('rememberKey').checked = true; }
    renderScope();
    $('aiModel').addEventListener('change', updateCost);
    $('aiRunBtn').addEventListener('click', runAi);
    $('aiStopBtn').addEventListener('click', () => { if (aiAbort) aiAbort.abort(); });
    $('aiRestoreBtn').addEventListener('click', restoreOriginal);

    updatePreview();
    build();
    showPane('setup');
  }
  window.addEventListener('DOMContentLoaded', init);
})();

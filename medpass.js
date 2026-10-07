/* NursingSim - barcode medication administration (BCMA) practice and med-pass preparation.
   Loaded after app.js. It wraps the MAR "give / hold / refused" dialog with:
   scan wristband -> scan medication -> five rights + safety checks -> give (or hold / refuse),
   and gives faculty a Med-pass setup tool to seed realistic traps. */
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s ?? ''));
  const hash = text => { let h = 2166136261; for (const ch of String(text)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0); };
  const hex = n => n.toString(16).toUpperCase().padStart(8, '0');

  // ------------------------------------------------------------------ settings and log (saved with the patient)
  function cfg() {
    if (!currentCanonicalCase) return null;
    if (!currentCanonicalCase.medPass) currentCanonicalCase.medPass = { scanRequired: true, decoys: true, traps: [], log: [] };
    return currentCanonicalCase.medPass;
  }
  function log(type, detail, orderId) {
    const c = cfg(); if (!c) return;
    c.log.push({ at: simulationTime, type, detail, orderId: orderId || (state && state.orderId) || '' });
    if (c.log.length > 400) c.log.shift();
  }

  // ------------------------------------------------------------------ barcodes and decoys
  const patientCode = () => NSWristband.patientCode(currentCanonicalCase.patient);
  const decoyPatient = () => {
    const names = ['Sam Rivera', 'Jordan Blake', 'Morgan Reyes', 'Casey Nguyen'];
    const h = hash(currentCanonicalCase.patient.mrn || 'x');
    const mrn = `SIM-9${String(h % 100000).padStart(5, '0')}`;
    const dob = `19${60 + (h % 35)}-0${1 + (h % 9)}-1${h % 9}`, name = names[h % names.length];
    return { name, mrn, code: NSWristband.patientCode({ mrn, name, dob }), dob, room: `${safe(currentCanonicalCase.encounter.room, '')}` };
  };
  const LASA = {
    hydralazine: 'hydrOXYzine', hydroxyzine: 'hydrALAZINE', lorazepam: 'ALPRAZolam', alprazolam: 'LORazepam', morphine: 'HYDROmorphone', hydromorphone: 'MORphine',
    carvedilol: 'captopril', metoprolol: 'metoprolol succinate ER (extended-release)', ceftriaxone: 'cefazolin', cefepime: 'cefoxitin', celecoxib: 'CeleXA (citalopram)',
    lisinopril: 'lisinopril/hydrochlorothiazide combination', sertraline: 'sertraline 100 mg (double strength)', heparin: 'heparin 10,000 units/mL (high concentration)',
    insulin: 'insulin glargine (long-acting; wrong insulin)'
  };
  const unitOf = dose => { const m = String(dose).match(/^([\d,.]+)\s*(mg|mcg|g|units|unit|mEq|mL)\b/i); return m ? { v: parseFloat(m[1].replace(/,/g, '')), u: m[2] } : null; };
  const fmtNum = n => (Number.isInteger(n) ? n.toLocaleString('en-US') : String(n));

  function packagesFor(order) {
    const med = order.medication || {}, dose = safe(med.dose, ''), route = safe(med.route, '');
    const correct = { code: `MED-${hex(hash(order.id))}`, label: safe(order.name), strength: dose, route, correct: true, kind: 'correct' };
    const pkgs = [correct];
    if (cfg().decoys) {
      const u = unitOf(dose);
      if (u) pkgs.push({ code: `MED-${hex(hash(order.id + ':strength'))}`, label: safe(order.name), strength: `${fmtNum(u.v * 2)} ${u.u}`, route, correct: false, kind: 'strength' });
      const first = safe(order.name).toLowerCase().split(/[\s(]/)[0];
      if (LASA[first]) pkgs.push({ code: `MED-${hex(hash(order.id + ':lasa'))}`, label: LASA[first], strength: dose, route, correct: false, kind: 'lasa' });
    }
    return pkgs.sort((a, b) => hash(order.id + a.code) - hash(order.id + b.code));
  }

  // ------------------------------------------------------------------ safety checks
  const ALLERGY_RULES = [
    { allergy: /penicillin/i, hard: /penicillin|amoxicillin|ampicillin|piperacillin|nafcillin|oxacillin|augmentin|zosyn|unasyn/i, soft: /cef|ceph/i, softText: 'Penicillin allergy with a cephalosporin: cross-reactivity is low, but confirm the reaction history with the provider or pharmacist before giving.' },
    { allergy: /sulfa/i, hard: /sulfamethoxazole|bactrim|sulfa/i },
    { allergy: /codeine|opioid/i, hard: /codeine/i, soft: /morphine|oxycodone|hydrocodone|tramadol|hydromorphone/i, softText: 'Codeine allergy: confirm the type of reaction before giving another opioid.' },
    { allergy: /nsaid|ibuprofen|aspirin/i, hard: /ketorolac|toradol|ibuprofen|naproxen|aspirin|nsaid/i },
    { allergy: /contrast|iod/i, hard: /iohexol|iodixanol|contrast/i }
  ];
  function allergyChecks(order) {
    const out = [], name = safe(order.name, '');
    (currentCanonicalCase.patient.allergies || []).forEach(a => {
      const sub = safe(a.substance, '');
      if (!sub || /^(nkda|none)/i.test(sub)) return;
      let matched = false;
      ALLERGY_RULES.forEach(rule => {
        if (!rule.allergy.test(sub)) return;
        matched = true;
        if (rule.hard.test(name)) out.push({ level: 'hard', code: 'allergy', text: `ALLERGY: patient is allergic to ${sub} (${safe(a.reaction, 'reaction not documented')}); ${name} is in that group. Do not give; hold and notify the provider.` });
        else if (rule.soft && rule.soft.test(name)) out.push({ level: 'soft', code: 'allergy', text: rule.softText });
      });
      const token = sub.toLowerCase().replace(/\(.*\)/, '').trim().split(/[\s,/]+/)[0];
      if (!matched && token.length > 3 && name.toLowerCase().includes(token)) out.push({ level: 'hard', code: 'allergy', text: `ALLERGY: patient is allergic to ${sub}; ${name} matches. Do not give; hold and notify the provider.` });
    });
    return out;
  }

  const HOLD_RE = /(SBP|systolic(?: blood pressure)?|HR|heart rate|RR|resp(?:iratory)? rate|SpO2|glucose|blood glucose|potassium)[^.;]{0,25}?(?:is |are )?(below|under|<|less than|above|over|>|greater than)\s*(\d+(?:\.\d+)?)/gi;
  function holdParams(order) {
    const text = [order.instructions, ...(order.nursingConsiderations || []), (order.medication || {}).importantInfo].filter(Boolean).join(' . ');
    const params = []; let m; HOLD_RE.lastIndex = 0;
    while ((m = HOLD_RE.exec(text))) {
      const k = m[1].toLowerCase();
      const key = /sbp|systolic/.test(k) ? 'sbp' : /^hr|heart/.test(k) ? 'hr' : /^rr|resp/.test(k) ? 'rr' : /spo2/.test(k) ? 'spo2' : /potassium/.test(k) ? 'potassium' : 'glucose';
      params.push({ key, dir: /below|under|<|less/.test(m[2].toLowerCase()) ? 'lt' : 'gt', n: parseFloat(m[3]) });
    }
    return params;
  }
  function latestValues() {
    const vis = getVisibleCanonicalCase(currentCanonicalCase), obs = vis.observations || [];
    const vital = code => latestBy(obs, o => o.type === 'vital' && safe(o.code).toUpperCase() === code);
    const lab = name => latestBy(obs, o => o.type === 'lab' && (safe(o.code).toLowerCase() === name || safe(o.label).toLowerCase() === name));
    const bp = vital('BP'), hr = vital('HR'), rr = vital('RR'), sp = vital('SPO2'), glu = lab('glucose'), k = lab('potassium');
    return {
      sbp: bp ? parseFloat(String(bp.value).split('/')[0]) : null, hr: hr ? parseFloat(hr.value) : null, rr: rr ? parseFloat(rr.value) : null, spo2: sp ? parseFloat(sp.value) : null,
      glucose: glu ? parseFloat(glu.value) : null, potassium: k ? parseFloat(k.value) : null, bpText: bp ? bp.value : '', time: { sbp: bp && bp.collected }
    };
  }
  const LABEL = { sbp: 'SBP', hr: 'HR', rr: 'RR', spo2: 'SpO2', glucose: 'glucose', potassium: 'potassium' };
  function holdChecks(order) {
    const v = latestValues(), out = [];
    holdParams(order).forEach(p => {
      const val = v[p.key]; if (val === null || val === undefined || isNaN(val)) return;
      const bad = p.dir === 'lt' ? val < p.n : val > p.n;
      if (bad) out.push({ level: 'soft', code: 'hold', text: `HOLD PARAMETER: ${LABEL[p.key]} is ${val} (order says to hold if ${p.dir === 'lt' ? 'below' : 'above'} ${p.n}). Hold and notify the provider, or document why you are giving.` });
    });
    return out;
  }

  const INTERVAL_H = { daily: 24, bid: 12, tid: 8, qid: 6, nightly: 24, achs: 4 };
  function intervalHours(order) {
    const f = safe(order.frequency, '').toLowerCase();
    let m = f.match(/every (\d+) hours?/); if (m) return parseInt(m[1], 10);
    for (const k of Object.keys(INTERVAL_H)) if (f.includes(k)) return INTERVAL_H[k];
    return null;
  }
  function recentDoseCheck(order) {
    const h = intervalHours(order); if (!h) return [];
    const now = parseSimDate(simulationTime); if (!now) return [];
    const given = (currentCanonicalCase.administrations || []).filter(a => a.orderId === order.id && safe(a.state).toLowerCase() === 'given' && a.administeredAt);
    const last = given.map(a => ({ a, t: parseSimDate(a.administeredAt) })).filter(x => x.t && x.t <= now).sort((x, y) => y.t - x.t)[0];
    if (!last) return [];
    const hrs = (now - last.t) / 3600000;
    if (hrs < h * 0.5) return [{ level: 'soft', code: 'recent', text: `RECENT DOSE: the last dose was given ${epicDate(last.a.administeredAt)} (${hrs.toFixed(1)} hours ago); this order is ${safe(order.frequency)}. Check the MAR before giving again.` }];
    return [];
  }
  function timeCheck(sched) {
    const due = combineSimDateAndClock(sched), a = parseSimDate(due), b = parseSimDate(simulationTime);
    if (!a || !b) return [];
    const diff = Math.round((b - a) / 60000);
    if (diff > 60) return [{ level: 'soft', code: 'time', text: `LATE DOSE: scheduled ${sched}, now ${epicDate(simulationTime)} (${diff} minutes late). Give only if policy allows and notify the provider if required.` }];
    if (diff < -60) return [{ level: 'soft', code: 'time', text: `EARLY DOSE: scheduled ${sched}, now ${epicDate(simulationTime)} (${-diff} minutes early). Outside the 60-minute window.` }];
    return [];
  }

  // ------------------------------------------------------------------ patient scan status (stays for every medication)
  let pstat = null;   // { caseRef, mode: 'scanned' | 'override', code, at, reason, detail }
  const patientStatus = () => (pstat && currentCanonicalCase && pstat.caseRef === currentCanonicalCase) ? pstat : null;

  const OVERRIDE_REASONS = {
    patient: ['Wristband missing, damaged, or unreadable', 'Wristband scanner not working or not available', 'Wristband cannot be scanned (limb restriction, isolation, skin integrity)', 'Emergency: patient unstable, immediate treatment needed', 'System or network downtime', 'Other (explain below)'],
    med: ['Barcode damaged, missing, or unreadable on the package', 'Medication has no barcode (compounded, pharmacy-prepared, or bulk stock)', 'Scanner not working or not available', 'Barcode not recognized by the system; drug verified with pharmacy', 'Emergency: patient unstable, immediate treatment needed', 'System or network downtime', 'Other (explain below)'],
    warning: ['Provider notified and gave an order to proceed', 'Pharmacist consulted and verified the dose is safe', 'Hold parameter reviewed; provider approved giving the dose', 'Dose timing change approved by provider or pharmacy', 'Allergy reviewed: documented reaction is an intolerance or was tolerated before (verified with provider)', 'Clinical judgment (explain below)', 'Other (explain below)'],
    allergy: ['Provider notified and gave an order to proceed', 'Pharmacist consulted and verified the drug is safe for this patient', 'Allergy reviewed: documented reaction is an intolerance or was tolerated before (verified with provider)', 'Other (explain below)']
  };

  function toast(text, cls) {
    let t = $('mpToast');
    if (!t) { t = document.createElement('div'); t.id = 'mpToast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    const open = [...document.querySelectorAll('dialog[open]')].pop();   // a modal sits above the page, so show the message inside it
    (open || document.body).appendChild(t);
    t.textContent = text; t.className = `mp-toast ${cls || ''} show`;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  function updatePill() {
    const banner = document.querySelector('.patient-banner'); if (!banner) return;
    let pill = $('mpPatientPill');
    if (!pill) {
      pill = document.createElement('button'); pill.id = 'mpPatientPill'; pill.type = 'button'; banner.appendChild(pill);
      pill.addEventListener('click', () => {
        if (!currentCanonicalCase) return;
        const s = patientStatus();
        if (s) { if (confirm(`Clear the wristband scan for ${currentCanonicalCase.patient.name}? (Do this when you leave the room; you will need to scan again.)`)) clearPatientScan(); }
        else openScanner('patient');
      });
    }
    if (!currentCanonicalCase) { pill.className = 'mp-pt-pill hidden'; return; }
    const s = patientStatus(), on = cfg().scanRequired;
    let cls, text;
    if (!on) { cls = 'off'; text = 'Wristband scanning: OFF'; }
    else if (!s) { cls = 'not'; text = 'PATIENT NOT SCANNED'; }
    else if (s.mode === 'override') { cls = 'ovr'; text = 'NOT SCANNED (override)'; }
    else { cls = 'ok'; text = 'PATIENT SCANNED'; }
    if (pill.dataset.k !== cls + text) { pill.dataset.k = cls + text; pill.className = `mp-pt-pill ${cls}`; pill.innerHTML = `<span class="mp-dot"></span>${esc(text)}`; }
  }
  function setPatientScanned(code) {
    pstat = { caseRef: currentCanonicalCase, mode: 'scanned', code, at: simulationTime };
    log('scan_patient', 'Correct patient'); updatePill(); if (state) refresh();
  }
  function clearPatientScan() { pstat = null; log('scan_cleared', 'Patient scan cleared'); updatePill(); if (state) refresh(); }

  // ------------------------------------------------------------------ dialog state and UI
  let state = null;        // { orderId, order, packages, medScan, ids, warnOverride, double, warnings }

  function startState(med, event) {
    const order = getVisibleMedicationOrder(med.orderId);
    if (!order) { state = null; return; }
    state = { orderId: med.orderId, order, packages: packagesFor(order), medScan: null, ids: false, warnOverride: null, double: '', sched: safe(event.time) };
    state.warnings = [...allergyChecks(order), ...holdChecks(order), ...recentDoseCheck(order), ...timeCheck(safe(event.time))];
    log('open', `Opened ${order.name} (scheduled ${state.sched})`, med.orderId);
  }

  function ensureBlock() {
    let block = $('mpBlock');
    if (!block) {
      block = document.createElement('div'); block.id = 'mpBlock'; block.className = 'mp-block';
      $('marActionMonitoring').parentNode.insertBefore(block, $('marActionMonitoring'));
      block.addEventListener('click', e => {
        const b = e.target.closest('button[data-mp]'); if (!b) return;
        const k = b.dataset.mp;
        if (k === 'patient') openScanner('patient');
        else if (k === 'med') openScanner('med');
        else if (k === 'clear') clearPatientScan();
        else if (k === 'ovr-patient') openOverride('patient');
        else if (k === 'ovr-med') openOverride('med');
        else if (k === 'ovr-warn') openOverride(state.warnings.some(w => w.level === 'hard') ? 'allergy' : 'warning');
        else if (k === 'ovr-undo-warn') { state.warnOverride = null; refresh(); }
        else if (k === 'ovr-undo-med') { state.medScan = null; refresh(); }
        else if (k === 'ovr-undo-patient') { pstat = null; updatePill(); refresh(); }
      });
      block.addEventListener('input', e => {
        if (e.target.id === 'mpIds') state.ids = e.target.checked;
        if (e.target.id === 'mpDouble') state.double = e.target.value;
        refresh(false);
      });
    }
    return block;
  }

  const medOk = s => !!(s.medScan && s.medScan.ok);
  const rightsList = () => {
    const s = state, pt = patientStatus(), timeBad = s.warnings.some(w => w.code === 'time');
    return [['Right patient', !!pt && s.ids], ['Right drug', medOk(s)], ['Right dose', medOk(s)], ['Right route', medOk(s)], ['Right time', !timeBad || !!s.warnOverride]];
  };

  function gate() {
    const s = state, c = cfg();
    if (!c.scanRequired) return { ok: true, why: '' };
    const hard = s.warnings.filter(w => w.level === 'hard'), soft = s.warnings.filter(w => w.level === 'soft');
    if (!patientStatus()) return { ok: false, why: 'Scan the patient wristband first (or use Override and give a reason).' };
    if (!s.ids) return { ok: false, why: 'Confirm two patient identifiers (name and date of birth).' };
    if (!medOk(s)) return { ok: false, why: 'Scan the medication package; it must match the order (or use Override and give a reason).' };
    if (hard.length && !s.warnOverride) return { ok: false, why: 'A safety stop applies (see above). Hold the medication and notify the provider, or override with a documented reason.' };
    if (soft.length && !s.warnOverride) return { ok: false, why: 'There are warnings. Hold the medication, or override and document why you are giving it.' };
    if (s.order.medication && s.order.medication.highAlert && s.double.trim().length < 2) return { ok: false, why: 'High-alert medication: an independent double check by a second nurse is required (enter their initials).' };
    return { ok: true, why: '' };
  }

  function refresh(rebuild = true) {
    const c = cfg(); const block = ensureBlock();
    updatePill();
    if (!state) { block.classList.add('hidden'); return; }
    block.classList.remove('hidden');
    const s = state, give = document.querySelector('.mar-action-give');
    if (!c.scanRequired) {
      block.innerHTML = `<div class="mp-head">Barcode scanning is OFF for this patient <button class="small-tool-button" data-mp-toggle>Turn on</button></div>${s.warnings.length ? `<div class="mp-warn-list">${s.warnings.map(w => `<div class="mp-warn ${w.level}">${esc(w.text)}</div>`).join('')}</div>` : ''}`;
      block.querySelector('[data-mp-toggle]').addEventListener('click', () => { c.scanRequired = true; refresh(); updateToolbar(); });
      if (give) give.disabled = false;
      return;
    }
    if (rebuild) {
      const pt = patientStatus(), md = s.medScan, needsDouble = !!(s.order.medication && s.order.medication.highAlert);
      const ptBar = !pt
        ? `<div class="mp-ptbar not"><div class="mp-ptbar-text"><b>PATIENT NOT SCANNED</b><span>Scan the wristband once. It stays scanned for all of this patient's medications.</span></div><div class="mp-ptbar-btns"><button class="primary-button" data-mp="patient">Scan wristband</button><button class="secondary-button" data-mp="ovr-patient">Override</button></div></div>`
        : pt.mode === 'override'
          ? `<div class="mp-ptbar ovr"><div class="mp-ptbar-text"><b>NOT SCANNED - OVERRIDE</b><span>${esc(pt.reason)}${pt.detail ? ': ' + esc(pt.detail) : ''}</span></div><div class="mp-ptbar-btns"><button class="secondary-button" data-mp="patient">Scan wristband</button><button class="secondary-button" data-mp="ovr-undo-patient">Remove override</button></div></div>`
          : `<div class="mp-ptbar ok"><div class="mp-ptbar-text"><b>PATIENT SCANNED</b><span>${esc(currentCanonicalCase.patient.name)}, MRN ${esc(currentCanonicalCase.patient.mrn)}, scanned ${esc(epicDate(pt.at))}. Applies to all medications.</span></div><div class="mp-ptbar-btns"><button class="secondary-button" data-mp="clear">Clear scan</button></div></div>`;
      const medStep = md && md.override
        ? `<div class="mp-step ovr"><b>Medication NOT scanned - override</b><span>${esc(md.reason)}${md.detail ? ': ' + esc(md.detail) : ''}</span><button class="secondary-button" data-mp="ovr-undo-med">Remove override</button></div>`
        : `<div class="mp-step ${md ? (md.ok ? 'ok' : 'bad') : ''}"><b>Scan medication</b><span>${md ? esc(md.msg) : 'Not scanned'}</span><div class="mp-step-btns"><button class="primary-button" data-mp="med">${md && md.ok ? 'Scan again' : 'Scan medication'}</button>${md && md.ok ? '' : '<button class="secondary-button" data-mp="ovr-med">Override</button>'}</div></div>`;
      const wo = s.warnOverride;
      block.innerHTML = `
        <div class="mp-head">Barcode medication administration ${needsDouble ? '<span class="mp-pill alert">HIGH-ALERT</span>' : ''}</div>
        ${ptBar}
        <div class="mp-steps">${medStep}</div>
        <label class="mp-check"><input type="checkbox" id="mpIds" ${s.ids ? 'checked' : ''}/> I asked the patient to state their name and date of birth and they match the wristband and MAR.</label>
        ${s.warnings.length ? `<div class="mp-warn-list">${s.warnings.map(w => `<div class="mp-warn ${w.level}">${esc(w.text)}</div>`).join('')}${wo ? `<div class="mp-warn ovr"><b>Override recorded:</b> ${esc(wo.reason)}${wo.detail ? ' - ' + esc(wo.detail) : ''} <button class="secondary-button" data-mp="ovr-undo-warn">Remove</button></div>` : '<button class="secondary-button" data-mp="ovr-warn">Override warnings and give anyway...</button>'}</div>` : ''}
        ${needsDouble ? `<label class="input-label" for="mpDouble">Independent double check: second nurse initials</label><input id="mpDouble" class="mp-initials" value="${esc(s.double)}" maxlength="6" />` : ''}
        <div class="mp-rights" id="mpRights"></div>
        <div class="mp-why" id="mpWhy"></div>`;
    }
    const rights = $('mpRights');
    if (rights) rights.innerHTML = rightsList().map(([l, ok]) => `<span class="mp-right ${ok ? 'ok' : ''}">${ok ? '✓' : '○'} ${l}</span>`).join('');
    const g = gate(); if ($('mpWhy')) { $('mpWhy').textContent = g.ok ? 'All checks complete. You may give the medication.' : g.why; $('mpWhy').className = `mp-why ${g.ok ? 'ok' : ''}`; }
    if (give) give.disabled = !g.ok;
  }

  // ------------------------------------------------------------------ override dialog (a reason from the list is required)
  let ovKind = null;
  function ensureOverride() {
    let dlg = $('mpOverrideDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'mpOverrideDialog'; dlg.className = 'action-dialog mp-override';
    dlg.innerHTML = `<div class="dialog-header"><div><h2 id="ovTitle">Override</h2><p id="ovSub"></p></div><button id="ovClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><label class="input-label" for="ovReason">Reason for override (required)</label><select id="ovReason" class="mp-select"></select>
      <label class="input-label" for="ovDetail" id="ovDetailLabel">Comment</label><textarea id="ovDetail" class="small-textarea"></textarea>
      <div id="ovMsg" class="lib-message error"></div>
      <div class="dialog-actions"><button id="ovCancel" class="secondary-button">Cancel</button><button id="ovConfirm" class="primary-button">Record override</button></div></div>`;
    document.body.appendChild(dlg);
    $('ovClose').addEventListener('click', () => dlg.close()); $('ovCancel').addEventListener('click', () => dlg.close());
    $('ovConfirm').addEventListener('click', confirmOverride);
    return dlg;
  }
  function openOverride(kind) {
    ovKind = kind; const dlg = ensureOverride();
    const t = { patient: ['Override wristband scan', 'Use only when the wristband cannot be scanned. This is recorded for your instructor.'], med: ['Override medication scan', 'Use only when the medication barcode cannot be scanned. This is recorded for your instructor.'], warning: ['Override safety warnings', 'You are choosing to give a dose despite the warnings. This is recorded for your instructor.'], allergy: ['Override ALLERGY alert', 'The patient has a documented allergy that matches this drug. This is recorded for your instructor.'] }[kind];
    $('ovTitle').textContent = t[0]; $('ovSub').textContent = t[1];
    $('ovReason').innerHTML = '<option value="">Select a reason...</option>' + OVERRIDE_REASONS[kind].map(r => `<option>${esc(r)}</option>`).join('');
    $('ovDetail').value = ''; $('ovMsg').textContent = '';
    $('ovDetailLabel').textContent = 'Comment (required for "Other" and for allergy overrides)';
    if ($('scannerDialog') && $('scannerDialog').open) $('scannerDialog').close();
    dlg.showModal();
  }
  function confirmOverride() {
    const reason = $('ovReason').value, detail = $('ovDetail').value.trim();
    if (!reason) { $('ovMsg').textContent = 'Choose a reason from the list.'; return; }
    if ((/^Other|^Clinical judgment/.test(reason) || ovKind === 'allergy') && detail.length < 3) { $('ovMsg').textContent = 'Add a short comment explaining the override.'; return; }
    if (ovKind === 'patient') { pstat = { caseRef: currentCanonicalCase, mode: 'override', code: '', at: simulationTime, reason, detail }; log('override_patient', `${reason}${detail ? ': ' + detail : ''}`); }
    else if (ovKind === 'med') { if (state) { state.medScan = { ok: true, override: true, reason, detail, msg: '' }; log('override_med', `${reason}${detail ? ': ' + detail : ''}`, state.orderId); } }
    else { if (state) { state.warnOverride = { reason, detail, kind: ovKind }; log(ovKind === 'allergy' ? 'override_allergy' : 'override_warning', `${reason}${detail ? ': ' + detail : ''}`, state.orderId); } }
    $('mpOverrideDialog').close(); updatePill(); if (state) refresh();
  }

  // ------------------------------------------------------------------ scanning: one entry point for tiles, typing, handheld scanners
  function ensureScanner() {
    let dlg = $('scannerDialog');
    if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'scannerDialog'; dlg.className = 'action-dialog scanner-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2 id="scanTitle">Scan</h2><p id="scanSub"></p></div><button id="scanClose" class="icon-button" aria-label="Close scanner">×</button></div>
      <div class="dialog-body"><div id="scanMsg" class="scan-msg"></div><div id="scanTiles" class="scan-tiles"></div>
      <div class="scan-manual"><input id="scanInput" placeholder="Or scan with a handheld scanner / type a code, then press Enter" autocomplete="off" autocapitalize="off" /><button id="scanGo" class="primary-button">Enter</button></div>
      <div class="scan-foot"><button id="scanOvr" class="secondary-button">Can't scan? Override...</button></div></div>`;
    document.body.appendChild(dlg);
    $('scanClose').addEventListener('click', () => dlg.close());
    $('scanGo').addEventListener('click', () => { handleScan($('scanInput').value); $('scanInput').value = ''; });
    $('scanInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); handleScan($('scanInput').value); $('scanInput').value = ''; } });
    $('scanTiles').addEventListener('click', e => { const t = e.target.closest('[data-code]'); if (t) handleScan(t.dataset.code); });
    $('scanOvr').addEventListener('click', () => openOverride(scanMode === 'patient' ? 'patient' : 'med'));
    return dlg;
  }
  let scanMode = null;
  function openScanner(mode) {
    if (!currentCanonicalCase) return;
    if (mode === 'med' && !state) { toast('Open a due dose on the MAR first, then scan the medication.', 'bad'); return; }
    scanMode = mode;
    const dlg = ensureScanner(), p = currentCanonicalCase.patient;
    $('scanMsg').textContent = ''; $('scanMsg').className = 'scan-msg'; $('scanInput').value = '';
    if (mode === 'patient') {
      $('scanTitle').textContent = 'Scan patient wristband'; $('scanSub').textContent = 'Check the name and date of birth on the wristband, then scan it. Tap a wristband below, or use a handheld scanner.';
      const bands = [{ name: p.name, mrn: p.mrn, dob: p.dob, code: patientCode(), allergies: (p.allergies || []).filter(a => a.substance && !/^nkda/i.test(a.substance)).map(a => a.substance) }];
      if (cfg().decoys) { const d = decoyPatient(); bands.push({ name: d.name, mrn: d.mrn, dob: d.dob, code: d.code, allergies: [] }); }
      bands.sort((a, b) => hash(a.code + 'order') - hash(b.code + 'order'));
      $('scanTiles').innerHTML = bands.map(b => `<button class="band-tile" data-code="${esc(b.code)}"><div class="band-top">${esc(b.name)}</div><div>MRN ${esc(b.mrn)}</div><div>DOB ${esc(epicDate(b.dob))}</div>${b.allergies.length ? `<div class="band-allergy">ALLERGY: ${esc(b.allergies.join(', '))}</div>` : ''}<div class="band-code">${NSWristband.qrSvg(b.code, 'band-qr')} ${esc(b.code)}</div></button>`).join('');
    } else {
      $('scanTitle').textContent = 'Scan medication'; $('scanSub').textContent = 'Read the label, then scan the package you are about to give.';
      $('scanTiles').innerHTML = state.packages.map(k => `<button class="med-tile" data-code="${esc(k.code)}"><div class="med-name">${esc(k.label)}</div><div>${esc(k.strength)} · ${esc(k.route)}</div><div class="band-code">${NSWristband.qrSvg(k.code, 'band-qr')} ${esc(k.code)}</div></button>`).join('');
    }
    if (!dlg.open) dlg.showModal();
    setTimeout(() => $('scanInput').focus(), 50);
  }

  function scanFeedback(text, ok) {
    const dlg = $('scannerDialog');
    if (dlg && dlg.open) { $('scanMsg').textContent = text; $('scanMsg').className = `scan-msg ${ok ? 'ok' : 'bad'}`; }
    else toast(text, ok ? 'ok' : 'bad');
  }
  function closeScannerSoon() { setTimeout(() => { const d = $('scannerDialog'); if (d && d.open) d.close(); }, 650); }

  // Any scan, from anywhere: handleScan('PT-...') or handleScan('MED-...'). A handheld scanner, the on-screen tiles
  // and MedPass.scan(code) all end up here.
  function handleScan(raw) {
    const code = String(raw || '').trim(); if (!code || !currentCanonicalCase) return false;
    const up = code.toUpperCase();
    if (up.startsWith('PT-')) {
      if (up === patientCode().toUpperCase()) {
        setPatientScanned(code); scanFeedback(`Scanned: ${currentCanonicalCase.patient.name}, MRN ${currentCanonicalCase.patient.mrn}`, true); closeScannerSoon(); return true;
      }
      const d = decoyPatient(), known = up === d.code.toUpperCase();
      log('scan_patient_wrong', known ? `Scanned another patient (${d.name})` : `Unrecognized wristband ${code}`);
      scanFeedback(known ? `WRONG PATIENT: wristband reads ${d.name}, MRN ${d.mrn}. This is not ${currentCanonicalCase.patient.name}.` : `WRONG PATIENT: this wristband does not belong to ${currentCanonicalCase.patient.name}.`, false); return false;
    }
    if (!state) { scanFeedback('Open a due dose on the MAR before scanning a medication.', false); return false; }
    const pkg = state.packages.find(k => k.code.toUpperCase() === up);
    if (!pkg) { state.medScan = { ok: false, msg: 'Unrecognized medication barcode' }; log('scan_med_unknown', code, state.orderId); }
    else if (pkg.correct) { state.medScan = { ok: true, msg: `Matches order: ${pkg.label} ${pkg.strength} ${pkg.route}` }; log('scan_med', 'Correct medication', state.orderId); }
    else {
      const why = pkg.kind === 'strength' ? `WRONG STRENGTH: package is ${pkg.strength}, order is ${safe(state.order.medication.dose)}` : `WRONG DRUG: package reads ${pkg.label}, order is ${safe(state.order.name)}`;
      state.medScan = { ok: false, msg: why }; log('scan_med_wrong', `${pkg.kind}: ${pkg.label} ${pkg.strength}`, state.orderId);
    }
    scanFeedback(state.medScan.msg, state.medScan.ok); if (state.medScan.ok) closeScannerSoon();
    refresh(); return state.medScan.ok;
  }

  // Handheld scanners act like a very fast keyboard that ends with Enter. Catch that anywhere in the EHR (outside text boxes).
  (function wedge() {
    let buf = '', last = 0;
    document.addEventListener('keydown', e => {
      const t = e.target, typing = t && (t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t.tagName === 'INPUT' && t.id !== 'scanInput' && !/^(checkbox|radio|button)$/.test(t.type)));
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      const now = Date.now();
      if (e.key === 'Enter') { if (buf.length >= 6 && /^(PT|MED)-/i.test(buf) && t.id !== 'scanInput') { e.preventDefault(); handleScan(buf); } buf = ''; return; }
      if (e.key.length !== 1) return;
      if (now - last > 80) buf = '';
      buf += e.key; last = now;
    }, true);
  })();
  // For a bridge or browser extension: window.dispatchEvent(new CustomEvent('nursingsim:scan', { detail: 'PT-...' }))
  window.addEventListener('nursingsim:scan', e => handleScan(typeof e.detail === 'string' ? e.detail : e.detail && e.detail.code));

  // ------------------------------------------------------------------ wrap the existing MAR dialog functions
  const originalOpen = openMARActionDialog, originalApply = applyMARAction, originalRefresh = refreshSimulationView;
  openMARActionDialog = function (med, event) { originalOpen(med, event); startState(med, event); refresh(); };
  refreshSimulationView = function () { const r = originalRefresh.apply(null, arguments); updatePill(); return r; };
  applyMARAction = function (action) {
    if (state && action === 'given') {
      const g = gate(); if (!g.ok) { refresh(); return; }
    }
    const act = typeof activeMARAction !== 'undefined' ? activeMARAction : null, snap = state, pt = patientStatus();
    originalApply(action);
    if (!act || !snap) return;
    const admin = (currentCanonicalCase.administrations || []).find(a => a.orderId === act.orderId && Number(a.slotIndex) === Number(act.slotIndex) && safe(a.time) === safe(act.time));
    if (admin) {
      const md = snap.medScan;
      admin.scan = cfg().scanRequired ? {
        patient: !!pt, patientMode: pt ? pt.mode : 'none', patientOverride: pt && pt.mode === 'override' ? { reason: pt.reason, detail: pt.detail } : null,
        medication: !!(md && md.ok), medicationMode: md ? (md.override ? 'override' : md.ok ? 'scanned' : 'failed') : 'none', medicationOverride: md && md.override ? { reason: md.reason, detail: md.detail } : null,
        identifiers: !!snap.ids, warnings: snap.warnings.map(w => w.code), warningOverride: snap.warnOverride || null, doubleCheck: snap.double.trim()
      } : { skipped: true };
    }
    const ov = [pt && pt.mode === 'override' ? 'patient scan overridden' : '', snap.medScan && snap.medScan.override ? 'medication scan overridden' : '', snap.warnOverride ? 'warnings overridden' : ''].filter(Boolean);
    log(`action_${action}`, `${safe(snap.order.name)}: ${action}${ov.length ? ' (' + ov.join(', ') + ')' : ''}`, act.orderId);
    state = null;
  };

  // ------------------------------------------------------------------ MAR toolbar buttons + faculty setup
  function updateToolbar() {
    const b = $('mpToggleBtn'); if (!b || !cfg()) return;
    const t = `Scanning: ${cfg().scanRequired ? 'On' : 'Off'}`; if (b.textContent !== t) b.textContent = t;
  }
  function addToolbar() {
    const bar = document.querySelector('.mar-subtoolbar'); if (!bar || $('mpToggleBtn')) return;
    const sp = bar.querySelector('.mar-subtoolbar-spacer');
    const mk = (id, text, fn) => { const b = document.createElement('button'); b.className = 'small-tool-button'; b.id = id; b.textContent = text; b.addEventListener('click', fn); bar.insertBefore(b, sp); };
    mk('mpToggleBtn', 'Scanning: On', () => { const c = cfg(); if (!c) return; c.scanRequired = !c.scanRequired; updateToolbar(); });
    mk('mpSetupBtn', 'Med-pass setup', openSetup);
    updateToolbar();
  }

  const dueMeds = () => {
    const vis = getVisibleCanonicalCase(currentCanonicalCase), orders = new Map((vis.orders || []).map(o => [o.id, o]));
    const seen = new Set(), out = [];
    (vis.administrations || []).filter(a => safe(a.state).toLowerCase() === 'due' && orders.has(a.orderId)).forEach(a => { if (!seen.has(a.orderId)) { seen.add(a.orderId); out.push({ order: orders.get(a.orderId), time: a.time }); } });
    return out;
  };

  function ensureSetup() {
    let dlg = $('mpSetupDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'mpSetupDialog'; dlg.className = 'import-dialog mp-setup';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Med-pass setup</h2><p>Prepare this patient for a medication pass. Settings and traps are saved with the patient (use Saved Patients to keep it).</p></div><button id="mpSetupClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body">
        <div class="mp-set"><label class="mp-opt"><input type="checkbox" id="mpOptScan" /> Require barcode scanning before a dose can be given</label>
        <label class="mp-opt"><input type="checkbox" id="mpOptDecoys" /> Include look-alike packages, wrong-strength packages and another patient's wristband</label></div>
        <h3>Seed a safety trap</h3>
        <div class="mp-trap-row"><select id="mpTrapMed"></select><select id="mpTrapType"><option value="hold">Hold parameter is met (abnormal vital sign)</option><option value="allergy">New allergy that matches this drug</option><option value="recent">Dose was already given 20 minutes ago</option></select><button id="mpTrapAdd" class="primary-button">Add trap</button></div>
        <div id="mpTrapMsg" class="lib-message"></div>
        <div id="mpTrapList"></div>
        <h3>Props</h3>
        <button id="mpPrintBtn" class="secondary-button">Print wristband and medication labels</button>
      </div>`;
    document.body.appendChild(dlg);
    $('mpSetupClose').addEventListener('click', () => dlg.close());
    $('mpOptScan').addEventListener('change', e => { cfg().scanRequired = e.target.checked; updateToolbar(); });
    $('mpOptDecoys').addEventListener('change', e => { cfg().decoys = e.target.checked; });
    $('mpTrapAdd').addEventListener('click', addTrap);
    $('mpPrintBtn').addEventListener('click', openPrint);
    $('mpTrapList').addEventListener('click', e => { const b = e.target.closest('[data-undo]'); if (b) { undoTrap(parseInt(b.dataset.undo, 10)); } });
    return dlg;
  }
  function renderSetup() {
    const c = cfg(); $('mpOptScan').checked = c.scanRequired; $('mpOptDecoys').checked = c.decoys;
    const meds = dueMeds();
    $('mpTrapMed').innerHTML = meds.length ? meds.map(m => `<option value="${esc(m.order.id)}">${esc(m.order.name)} ${esc(safe(m.order.medication && m.order.medication.dose, ''))} (due ${esc(m.time)})</option>`).join('') : '<option value="">No medications are due right now</option>';
    $('mpTrapList').innerHTML = c.traps.length ? `<table class="data-table"><thead><tr><th>Trap</th><th>Medication</th><th></th></tr></thead><tbody>${c.traps.map((t, i) => `<tr><td>${esc(t.label)}</td><td>${esc(t.medName)}</td><td><button class="secondary-button" data-undo="${i}">Remove</button></td></tr>`).join('')}</tbody></table>` : '<div class="empty-state">No traps seeded.</div>';
  }
  function openSetup() { if (!cfg()) return; const d = ensureSetup(); $('mpTrapMsg').textContent = ''; renderSetup(); d.showModal(); }

  function addTrap() {
    const c = cfg(), id = $('mpTrapMed').value, type = $('mpTrapType').value, msg = $('mpTrapMsg');
    const order = (currentCanonicalCase.orders || []).find(o => o.id === id);
    if (!order) { msg.textContent = 'Choose a due medication first.'; msg.className = 'lib-message error'; return; }
    const trap = { type, orderId: id, medName: order.name, at: simulationTime };
    if (type === 'hold') {
      const params = holdParams(order);
      if (!params.length) { msg.textContent = 'This medication has no hold parameter (like "hold if SBP below 100"), so this trap cannot be set. Try another medication or trap.'; msg.className = 'lib-message error'; return; }
      const p = params[0], stamp = simulationTime, ids = [];
      const mk = (code, label, value, units) => { const oid = `mp_trap_${code.toLowerCase()}_${stamp.replace(/\D/g, '')}`; currentCanonicalCase.observations.push({ id: oid, type: 'vital', code, label, value, units, flag: 'Abnormal', collected: stamp, trap: true }); ids.push(oid); };
      if (p.key === 'sbp') mk('BP', 'Blood Pressure', p.dir === 'lt' ? `${Math.round(p.n - 12)}/${Math.round(p.n - 30)}` : `${Math.round(p.n + 14)}/96`, '');
      else if (p.key === 'hr') mk('HR', 'Heart Rate', String(p.dir === 'lt' ? Math.round(p.n - 8) : Math.round(p.n + 14)), 'bpm');
      else if (p.key === 'rr') mk('RR', 'Respiratory Rate', String(p.dir === 'lt' ? Math.round(p.n - 3) : Math.round(p.n + 6)), '/min');
      else if (p.key === 'spo2') mk('SPO2', 'SpO2', String(Math.round(p.n - 4)), '%');
      else { msg.textContent = 'That hold parameter is a lab value, which cannot be seeded as a vital sign. Try a different medication.'; msg.className = 'lib-message error'; return; }
      trap.label = `Hold parameter met (${LABEL[p.key]} ${p.dir === 'lt' ? 'below' : 'above'} ${p.n})`; trap.obsIds = ids;
    } else if (type === 'allergy') {
      const substance = safe(order.name).replace(/\(.*?\)/g, '').replace(/\b(tablet|capsule|injection|IVPB|IV|infusion|solution)\b/gi, '').trim().split(/\s+/)[0];
      const al = currentCanonicalCase.patient.allergies = (currentCanonicalCase.patient.allergies || []).filter(a => !/^nkda$/i.test(safe(a.substance)));
      al.push({ substance, reaction: 'Hives and facial swelling', severity: 'High', trap: true });
      trap.label = `New allergy: ${substance}`; trap.substance = substance;
    } else {
      const t = addSimMinutes(simulationTime, -20), aid = `mp_trap_recent_${id}_${t.replace(/\D/g, '')}`;
      currentCanonicalCase.administrations.push({ id: aid, orderId: id, slotIndex: -1, time: t.slice(11, 13) + t.slice(14, 16), state: 'given', label: 'Given (trap)', dose: safe(order.medication && order.medication.dose, ''), route: safe(order.medication && order.medication.route, ''), administeredAt: t, administeredTime: epicDate(t), trap: true });
      trap.label = 'Dose already given 20 minutes ago'; trap.adminId = aid;
    }
    c.traps.push(trap); log('trap_added', `${trap.label} for ${order.name}`, id);
    refreshSimulationView(); renderSetup(); msg.textContent = `Trap added: ${trap.label}.`; msg.className = 'lib-message success';
  }
  function undoTrap(i) {
    const c = cfg(), t = c.traps[i]; if (!t) return;
    if (t.obsIds) currentCanonicalCase.observations = currentCanonicalCase.observations.filter(o => !t.obsIds.includes(o.id));
    if (t.adminId) currentCanonicalCase.administrations = currentCanonicalCase.administrations.filter(a => a.id !== t.adminId);
    if (t.substance) { const al = currentCanonicalCase.patient.allergies; const k = al.findIndex(a => a.trap && a.substance === t.substance); if (k >= 0) al.splice(k, 1); if (!al.length) al.push({ substance: 'NKDA', reaction: '', severity: '' }); }
    c.traps.splice(i, 1); refreshSimulationView(); renderSetup();
  }

  // ------------------------------------------------------------------ printable wristband and labels (QR)
  function openPrint() {
    const labels = dueMeds().map(m => packagesFor(m.order).filter(k => k.correct).map(k => ({ title: k.label, line: `${k.strength} · ${k.route} · due ${m.time}`, code: k.code }))).flat();
    NSWristband.open(currentCanonicalCase, { labels });
  }

  // ------------------------------------------------------------------ boot
  window.MedPass = { cfg, packagesFor, allergyChecks, holdChecks, holdParams, patientCode, decoyPatient, scan: handleScan, patientStatus, clearPatientScan };
  updatePill();
  addToolbar();
  // the MAR re-renders its toolbar rarely, but make sure our buttons exist after any render
  const marSection = $('marSection');
  if (marSection) new MutationObserver(() => { if (!$('mpToggleBtn')) addToolbar(); }).observe(marSection, { childList: true, subtree: true });
})();

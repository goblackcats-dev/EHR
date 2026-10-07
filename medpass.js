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
  const patientCode = () => `PT-${safe(currentCanonicalCase.patient.mrn, 'UNKNOWN')}`;
  const decoyPatient = () => {
    const names = ['Sam Rivera', 'Jordan Blake', 'Morgan Reyes', 'Casey Nguyen'];
    const h = hash(currentCanonicalCase.patient.mrn || 'x');
    const mrn = `SIM-9${String(h % 100000).padStart(5, '0')}`;
    return { name: names[h % names.length], mrn, code: `PT-${mrn}`, dob: `19${60 + (h % 35)}-0${1 + (h % 9)}-1${h % 9}`, room: `${safe(currentCanonicalCase.encounter.room, '')}` };
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

  // ------------------------------------------------------------------ dialog state and UI
  let state = null;        // { orderId, order, packages, patientScan, medScan, ids, override, double, warnings }

  function startState(med, event) {
    const order = getVisibleMedicationOrder(med.orderId);
    if (!order) { state = null; return; }
    state = { orderId: med.orderId, order, packages: packagesFor(order), patientScan: null, medScan: null, ids: false, override: '', double: '', sched: safe(event.time), scanNotes: [] };
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
        if (b.dataset.mp === 'patient') openScanner('patient'); else if (b.dataset.mp === 'med') openScanner('med');
      });
      block.addEventListener('input', e => {
        if (e.target.id === 'mpIds') state.ids = e.target.checked;
        if (e.target.id === 'mpOverride') state.override = e.target.value;
        if (e.target.id === 'mpDouble') state.double = e.target.value;
        refresh(false);
      });
    }
    return block;
  }

  const rightsList = () => {
    const s = state, med = s.medScan, pt = s.patientScan;
    const timeBad = s.warnings.some(w => w.code === 'time');
    return [
      ['Right patient', pt && pt.ok && s.ids], ['Right drug', med && med.ok], ['Right dose', med && med.ok], ['Right route', med && med.ok], ['Right time', !timeBad || (s.override.trim().length > 2)]
    ];
  };

  function gate() {
    const s = state, c = cfg();
    if (!c.scanRequired) return { ok: true, why: '' };
    const hard = s.warnings.filter(w => w.level === 'hard'), soft = s.warnings.filter(w => w.level === 'soft');
    if (hard.length) return { ok: false, why: 'A safety stop applies (see above). Hold the medication and notify the provider.' };
    if (!(s.patientScan && s.patientScan.ok)) return { ok: false, why: 'Scan the patient wristband first.' };
    if (!s.ids) return { ok: false, why: 'Confirm two patient identifiers (name and date of birth).' };
    if (!(s.medScan && s.medScan.ok)) return { ok: false, why: 'Scan the medication package; it must match the order.' };
    if (soft.length && s.override.trim().length < 3) return { ok: false, why: 'There are warnings. Hold the medication, or type your reason for giving it anyway.' };
    if (s.order.medication && s.order.medication.highAlert && s.double.trim().length < 2) return { ok: false, why: 'High-alert medication: an independent double check by a second nurse is required (enter their initials).' };
    return { ok: true, why: '' };
  }

  function refresh(rebuild = true) {
    const c = cfg(); const block = ensureBlock();
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
      const pt = s.patientScan, md = s.medScan, showOverride = s.warnings.some(w => w.level === 'soft');
      const needsDouble = !!(s.order.medication && s.order.medication.highAlert);
      block.innerHTML = `
        <div class="mp-head">Barcode medication administration ${needsDouble ? '<span class="mp-pill alert">HIGH-ALERT</span>' : ''}</div>
        <div class="mp-steps">
          <button class="mp-step ${pt ? (pt.ok ? 'ok' : 'bad') : ''}" data-mp="patient"><b>1. Scan patient wristband</b><span>${pt ? esc(pt.msg) : 'Not scanned'}</span></button>
          <button class="mp-step ${md ? (md.ok ? 'ok' : 'bad') : ''}" data-mp="med"><b>2. Scan medication</b><span>${md ? esc(md.msg) : 'Not scanned'}</span></button>
        </div>
        <label class="mp-check"><input type="checkbox" id="mpIds" ${s.ids ? 'checked' : ''}/> I asked the patient to state their name and date of birth and they match the wristband and MAR.</label>
        ${s.warnings.length ? `<div class="mp-warn-list">${s.warnings.map(w => `<div class="mp-warn ${w.level}">${esc(w.text)}</div>`).join('')}</div>` : ''}
        ${showOverride ? `<label class="input-label" for="mpOverride">Reason for giving despite warnings (otherwise choose Hold)</label><textarea id="mpOverride" class="small-textarea">${esc(s.override)}</textarea>` : ''}
        ${needsDouble ? `<label class="input-label" for="mpDouble">Independent double check: second nurse initials</label><input id="mpDouble" class="mp-initials" value="${esc(s.double)}" maxlength="6" />` : ''}
        <div class="mp-rights" id="mpRights"></div>
        <div class="mp-why" id="mpWhy"></div>`;
    }
    const rights = $('mpRights');
    if (rights) rights.innerHTML = rightsList().map(([l, ok]) => `<span class="mp-right ${ok ? 'ok' : ''}">${ok ? '✓' : '○'} ${l}</span>`).join('');
    const g = gate(); if ($('mpWhy')) $('mpWhy').textContent = g.ok ? 'All checks complete. You may give the medication.' : g.why;
    if ($('mpWhy')) $('mpWhy').className = `mp-why ${g.ok ? 'ok' : ''}`;
    if (give) give.disabled = !g.ok;
  }

  // ------------------------------------------------------------------ scanner dialog
  function ensureScanner() {
    let dlg = $('scannerDialog');
    if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'scannerDialog'; dlg.className = 'action-dialog scanner-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2 id="scanTitle">Scan</h2><p id="scanSub"></p></div><button id="scanClose" class="icon-button" aria-label="Close scanner">×</button></div>
      <div class="dialog-body"><div id="scanMsg" class="scan-msg"></div><div id="scanTiles" class="scan-tiles"></div>
      <div class="scan-manual"><input id="scanInput" placeholder="Or type / scan a barcode with a handheld scanner, then press Enter" autocomplete="off" autocapitalize="off" /><button id="scanGo" class="primary-button">Enter</button></div></div>`;
    document.body.appendChild(dlg);
    $('scanClose').addEventListener('click', () => dlg.close());
    $('scanGo').addEventListener('click', () => submitCode($('scanInput').value));
    $('scanInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submitCode($('scanInput').value); } });
    $('scanTiles').addEventListener('click', e => { const t = e.target.closest('[data-code]'); if (t) submitCode(t.dataset.code); });
    return dlg;
  }
  let scanMode = null;
  function openScanner(mode) {
    if (!state) return; scanMode = mode;
    const dlg = ensureScanner(), p = currentCanonicalCase.patient;
    $('scanMsg').textContent = ''; $('scanMsg').className = 'scan-msg'; $('scanInput').value = '';
    if (mode === 'patient') {
      $('scanTitle').textContent = 'Scan patient wristband'; $('scanSub').textContent = 'Tap the wristband on the patient to scan it. Check the name and date of birth first.';
      const bands = [{ name: p.name, mrn: p.mrn, dob: p.dob, code: patientCode(), allergies: (p.allergies || []).filter(a => a.substance && !/^nkda/i.test(a.substance)).map(a => a.substance), me: true }];
      if (cfg().decoys) { const d = decoyPatient(); bands.push({ name: d.name, mrn: d.mrn, dob: d.dob, code: d.code, allergies: [], me: false }); }
      bands.sort((a, b) => hash(a.code + 'order') - hash(b.code + 'order'));
      $('scanTiles').innerHTML = bands.map(b => `<button class="band-tile" data-code="${esc(b.code)}"><div class="band-top">${esc(b.name)}</div><div>MRN ${esc(b.mrn)}</div><div>DOB ${esc(epicDate(b.dob))}</div>${b.allergies.length ? `<div class="band-allergy">ALLERGY: ${esc(b.allergies.join(', '))}</div>` : ''}<div class="band-code">▌▌▐▌▐▌▌▐ ${esc(b.code)}</div></button>`).join('');
    } else {
      $('scanTitle').textContent = 'Scan medication'; $('scanSub').textContent = 'Read the label, then scan the package you are about to give.';
      $('scanTiles').innerHTML = state.packages.map(k => `<button class="med-tile" data-code="${esc(k.code)}"><div class="med-name">${esc(k.label)}</div><div>${esc(k.strength)} · ${esc(k.route)}</div><div class="band-code">▌▐▌▌▐▐▌ ${esc(k.code)}</div></button>`).join('');
    }
    if (!dlg.open) dlg.showModal();
    setTimeout(() => $('scanInput').focus(), 50);
  }

  function submitCode(raw) {
    const code = String(raw || '').trim(); if (!code || !state) return;
    const msg = $('scanMsg');
    if (scanMode === 'patient') {
      const ok = code.toUpperCase() === patientCode().toUpperCase();
      if (ok) { state.patientScan = { ok: true, code, msg: `Scanned: ${currentCanonicalCase.patient.name}, MRN ${currentCanonicalCase.patient.mrn}` }; log('scan_patient', 'Correct patient', state.orderId); }
      else {
        const d = decoyPatient(); const known = code.toUpperCase() === d.code.toUpperCase();
        state.patientScan = { ok: false, code, msg: known ? `WRONG PATIENT: wristband reads ${d.name}, MRN ${d.mrn}` : 'Unrecognized wristband code' };
        log('scan_patient_wrong', known ? `Scanned another patient (${d.name})` : `Unrecognized code ${code}`, state.orderId);
      }
      msg.textContent = state.patientScan.msg; msg.className = `scan-msg ${state.patientScan.ok ? 'ok' : 'bad'}`;
    } else {
      const pkg = state.packages.find(k => k.code.toUpperCase() === code.toUpperCase());
      if (!pkg) { state.medScan = { ok: false, code, msg: 'Unrecognized medication barcode' }; log('scan_med_unknown', code, state.orderId); }
      else if (pkg.correct) { state.medScan = { ok: true, code, msg: `Matches order: ${pkg.label} ${pkg.strength} ${pkg.route}` }; log('scan_med', 'Correct medication', state.orderId); }
      else {
        const why = pkg.kind === 'strength' ? `WRONG STRENGTH: package is ${pkg.strength}, order is ${safe(state.order.medication.dose)}` : `WRONG DRUG: package reads ${pkg.label}, order is ${safe(state.order.name)}`;
        state.medScan = { ok: false, code, msg: why }; log('scan_med_wrong', `${pkg.kind}: ${pkg.label} ${pkg.strength}`, state.orderId);
      }
      msg.textContent = state.medScan.msg; msg.className = `scan-msg ${state.medScan.ok ? 'ok' : 'bad'}`;
    }
    $('scanInput').value = '';
    if ((scanMode === 'patient' && state.patientScan.ok) || (scanMode === 'med' && state.medScan.ok)) setTimeout(() => { $('scannerDialog').close(); refresh(); }, 650);
    else refresh();
  }

  // ------------------------------------------------------------------ wrap the existing MAR dialog functions
  const originalOpen = openMARActionDialog, originalApply = applyMARAction;
  openMARActionDialog = function (med, event) { originalOpen(med, event); startState(med, event); refresh(); };
  applyMARAction = function (action) {
    if (state && action === 'given') {
      const g = gate(); if (!g.ok) { refresh(); return; }
    }
    const act = typeof activeMARAction !== 'undefined' ? activeMARAction : null, snap = state;
    originalApply(action);
    if (!act || !snap) return;
    const admin = (currentCanonicalCase.administrations || []).find(a => a.orderId === act.orderId && Number(a.slotIndex) === Number(act.slotIndex) && safe(a.time) === safe(act.time));
    if (admin) {
      admin.scan = cfg().scanRequired ? { patient: !!(snap.patientScan && snap.patientScan.ok), medication: !!(snap.medScan && snap.medScan.ok), identifiers: !!snap.ids, warnings: snap.warnings.map(w => w.code), overrideReason: snap.override.trim(), doubleCheck: snap.double.trim() } : { skipped: true };
    }
    log(`action_${action}`, `${safe(snap.order.name)}: ${action}${snap.override.trim() ? ' (override: ' + snap.override.trim() + ')' : ''}`, act.orderId);
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

  // ------------------------------------------------------------------ printable wristband and labels
  function loadBarcodeLib() {
    if (window.JsBarcode) return Promise.resolve(true);
    return new Promise(resolve => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js'; s.onload = () => resolve(true); s.onerror = () => resolve(false); document.head.appendChild(s); });
  }
  async function openPrint() {
    let dlg = $('mpPrintDialog');
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.id = 'mpPrintDialog'; dlg.className = 'import-dialog mp-print';
      dlg.innerHTML = `<div class="dialog-header no-print"><div><h2>Wristband and medication labels</h2><p>Print these as props. A handheld barcode scanner will read them into the scanner box.</p></div><div><button id="mpPrintNow" class="primary-button">Print</button> <button id="mpPrintClose" class="icon-button" aria-label="Close">×</button></div></div><div class="dialog-body" id="mpPrintBody"></div>`;
      document.body.appendChild(dlg);
      $('mpPrintClose').addEventListener('click', () => { dlg.close(); document.body.classList.remove('printing'); });
      $('mpPrintNow').addEventListener('click', () => { document.body.classList.add('printing'); window.print(); });
      window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
    }
    const p = currentCanonicalCase.patient, e = currentCanonicalCase.encounter;
    const allergies = (p.allergies || []).filter(a => a.substance && !/^nkda/i.test(a.substance));
    const meds = dueMeds();
    const code = (v, label) => `<div class="bc-wrap"><svg class="bc" data-bc="${esc(v)}"></svg><div class="bc-text">${esc(label || v)}</div></div>`;
    $('mpPrintBody').innerHTML = `
      <div class="print-band"><div class="pb-name">${esc(p.name)}</div><div>MRN ${esc(p.mrn)} &nbsp; DOB ${esc(epicDate(p.dob))} &nbsp; ${esc(safe(p.age))} y.o. ${esc(safe(p.sex))}</div><div>${esc(safe(e.location))} ${esc(safe(e.room))} &nbsp; Attending: ${esc(safe(e.attending))}</div>${code(patientCode(), patientCode())}</div>
      ${allergies.length ? `<div class="print-band allergy"><b>ALLERGY</b> ${esc(allergies.map(a => a.substance + ' (' + safe(a.reaction, '') + ')').join('; '))}</div>` : ''}
      <h3>Medication labels (currently due)</h3>
      <div class="print-labels">${meds.map(m => packagesFor(m.order).filter(k => k.correct).map(k => `<div class="print-label"><b>${esc(k.label)}</b><div>${esc(k.strength)} · ${esc(k.route)} · due ${esc(m.time)}</div>${code(k.code, k.code)}</div>`).join('')).join('') || '<div class="empty-state">No medications are due at the current simulation time.</div>'}</div>`;
    dlg.showModal();
    const ok = await loadBarcodeLib();
    document.querySelectorAll('#mpPrintBody svg.bc').forEach(svg => { if (ok && window.JsBarcode) { try { JsBarcode(svg, svg.dataset.bc, { format: 'CODE128', height: 46, displayValue: false, margin: 2 }); } catch (err) { /* leave blank */ } } });
    if (!ok) $('mpPrintBody').insertAdjacentHTML('afterbegin', '<div class="lib-message error">The barcode picture could not load (offline?). The code text under each label can still be typed into the scanner box.</div>');
  }

  // ------------------------------------------------------------------ boot
  window.MedPass = { cfg, packagesFor, allergyChecks, holdChecks, holdParams, patientCode, decoyPatient };
  addToolbar();
  // the MAR re-renders its toolbar rarely, but make sure our buttons exist after any render
  const marSection = $('marSection');
  if (marSection) new MutationObserver(() => { if (!$('mpToggleBtn')) addToolbar(); }).observe(marSection, { childList: true, subtree: true });
})();

/* Flowsheet charting (v60).
   - The Flowsheets page shows ONE flowsheet at a time: Vital Signs, Adult Assessment (all body systems), Pain / Safety,
     Lines / Drains / Airways, Intake / Output. The choice is remembered.
   - Students chart everything themselves, at a chosen time (default: the patient's current time):
       vitals (form), assessments and pain/safety (existing chart dialog + quick-pick chips), intake/output (form),
       devices (add a line/drain/tube at an Avatar site, assess it, or remove it).
     Every entry is studentEntered:true, so "Reset simulation" removes it and it never mixes with case data.
   - Bedside monitor panel (top of Vital Signs): what the monitor reads NOW and the SUGGESTED NEXT SET of case vitals.
     Instructors always see it; students only when canonical.practice.showMonitor is on.
   Depends on app.js globals (currentCanonicalCase, simulationTime, buildFlowsheetRecords, flowsheetSheets, ...) and flowsheet-practice.js. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const stampDigits = t => String(t).replace(/[^0-9]/g, '');
  const toLocal = t => String(t || '').replace(' ', 'T').slice(0, 16);
  const fromLocal = v => String(v || '').trim().replace('T', ' ').slice(0, 16);
  const ms = t => { const d = parseSimDate(t); return d ? d.getTime() : NaN; };
  const hhmm = t => String(t || '').slice(11, 16);

  const SHEETS = flowsheetSheets;
  const SYSTEMS = ['Neurologic', 'Respiratory', 'Cardiac', 'GI', 'GU', 'Skin', 'Musculoskeletal / Mobility'];
  const PAIN_SAFETY = ['Pain', 'Safety'];
  const SHEET_KEY = 'nursingsim.flowsheet.sheet';
  const CHART_LABEL = { 'Vital Signs': 'Chart vitals', 'Adult Assessment': 'Chart assessment', 'Pain / Safety': 'Chart pain / safety', 'Lines / Drains / Airways': 'Add device', 'Intake / Output': 'Chart intake / output' };
  const VITAL_ROWS = ['Temperature', 'Temp Source', 'Heart Rate', 'HR Source', 'Pulse Rate from SpO2', 'Blood Pressure', 'MAP', 'BP Location', 'BP Method', 'Respiratory Rate', 'RR Source', 'SpO2', 'O2 Device'];
  const SUB_ROWS = ['Temp Source', 'HR Source', 'MAP', 'BP Location', 'BP Method', 'RR Source'];
  const TEMP_SOURCES = ['Oral', 'Temporal', 'Axillary', 'Tympanic', 'Rectal', 'Bladder/core'];
  const HR_SOURCES = ['Telemetry/ECG monitor', 'Pulse oximeter', 'Palpated radial', 'Apical stethoscope'];
  const BP_LOCS = ['Left arm', 'Right arm', 'Left leg', 'Right leg', 'Left wrist', 'Right wrist'];
  const BP_METHODS = ['Automatic cuff', 'Manual'];
  const RR_SOURCES = ['Monitor/capnography', 'Counted manually'];
  const INTAKE_TYPES = ['Oral', 'IV fluid', 'IV med', 'Tube feeding', 'Blood', 'Other'];
  const OUTPUT_TYPES = ['Urine', 'Stool', 'Emesis', 'Drain', 'Blood loss', 'Other'];
  const O2_DEVICES = ['Room air', 'Nasal cannula', 'Simple face mask', 'Venturi mask', 'Non-rebreather mask', 'High-flow nasal cannula', 'CPAP / BiPAP', 'Ventilator'];

  // Avatar site markers (same keys as markerCoordinates in app.js)
  const SITES = [
    ['leftForearm', 'Left forearm'], ['rightForearm', 'Right forearm'], ['leftAC', 'Left antecubital (AC)'], ['rightAC', 'Right antecubital (AC)'],
    ['leftUpperArm', 'Left upper arm'], ['rightUpperArm', 'Right upper arm'], ['chestLeft', 'Left chest'], ['chestRight', 'Right chest'],
    ['abdomenLUQ', 'Abdomen, left upper quadrant'], ['abdomenRUQ', 'Abdomen, right upper quadrant'], ['abdomenLLQ', 'Abdomen, left lower quadrant'], ['abdomenRLQ', 'Abdomen, right lower quadrant'],
    ['nares', 'Nose / nares'], ['mouth', 'Mouth'], ['ngTube', 'Nose to stomach (NG route)'], ['trach', 'Neck / trachea'], ['pelvis', 'Pelvis / urinary']
  ];
  // [type, Avatar category, default site, size choices, default status]
  const DEVICE_TYPES = [
    ['Peripheral IV', 'IV', 'leftForearm', ['24 gauge', '22 gauge', '20 gauge', '18 gauge', '16 gauge'], 'Patent'],
    ['Midline catheter', 'IV', 'rightUpperArm', ['3 Fr', '4 Fr', '5 Fr'], 'Patent'],
    ['PICC line', 'IV', 'rightUpperArm', ['4 Fr single lumen', '5 Fr double lumen', '6 Fr triple lumen'], 'Patent'],
    ['Central venous catheter', 'IV', 'chestRight', ['7 Fr triple lumen', '8.5 Fr', '12 Fr dialysis'], 'Patent'],
    ['Arterial line', 'IV', 'rightForearm', ['20 gauge'], 'Waveform present'],
    ['Foley catheter', 'Tube', 'pelvis', ['14 Fr', '16 Fr', '18 Fr'], 'Draining'],
    ['NG tube', 'Tube', 'ngTube', ['10 Fr', '12 Fr', '14 Fr'], 'Placement verified'],
    ['OG tube', 'Tube', 'mouth', ['12 Fr', '14 Fr'], 'Placement verified'],
    ['Gastrostomy (PEG) tube', 'Tube', 'abdomenLUQ', ['20 Fr', '24 Fr'], 'Secured'],
    ['Chest tube', 'Drain', 'chestLeft', ['20 Fr', '24 Fr', '28 Fr'], 'To suction -20 cm'],
    ['Surgical drain (JP / Hemovac)', 'Drain', 'abdomenRLQ', ['10 Fr', '15 Fr', '19 Fr'], 'Active'],
    ['Wound vac (NPWT)', 'Drain', 'abdomenLLQ', [], 'Continuous -125 mmHg'],
    ['Oxygen device (cannula / mask)', 'Tube', 'nares', ['2 L/min', '4 L/min', '6 L/min'], 'In place'],
    ['Tracheostomy', 'Tube', 'trach', ['6.0 cuffed', '8.0 cuffed'], 'Secured'],
    ['Endotracheal tube', 'Tube', 'mouth', ['7.0', '7.5', '8.0'], 'Secured'],
    ['Suprapubic catheter', 'Tube', 'pelvis', ['16 Fr', '18 Fr'], 'Draining'],
    ['Other device', 'Tube', 'pelvis', [], 'In place']
  ];

  let sheet = (() => { try { const v = localStorage.getItem(SHEET_KEY); return SHEETS.includes(v) ? v : SHEETS[0]; } catch (e) { return SHEETS[0]; } })();
  let stickRight = true;
  let lastCell = null;

  const practice = () => { if (!currentCanonicalCase) return {}; if (!currentCanonicalCase.practice) currentCanonicalCase.practice = { enabled: false }; return currentCanonicalCase.practice; };
  const isInstructor = () => !window.NS_STUDENT;
  const monitorVisible = () => isInstructor() || !!practice().showMonitor;
  const canon = () => currentCanonicalCase;

  function setSheet(name) {
    if (!SHEETS.includes(name)) return;
    sheet = name; stickRight = true; lastCell = null;
    try { localStorage.setItem(SHEET_KEY, name); } catch (e) { /* remembered only when storage works */ }
    renderFlowsheetsPage(currentPatientData);
  }

  // ------------------------------------------------------------ vital flags (same limits the case builder uses)
  function vitalFlag(code, value) {
    const copd = canon() && (canon().problems || []).some(p => /copd|chronic obstructive/i.test(safe(p.name, '')));
    if (code === 'TEMP') return value >= 100.4 || value <= 96.8;
    if (code === 'HR') return value > 100 || value < 55;
    if (code === 'RR') return value > 22 || value < 10;
    if (code === 'SPO2') return value < (copd ? 88 : 92);
    if (code === 'SBP') return value > 180 || value < 90;
    return false;
  }

  // ------------------------------------------------------------ case vital sets (for the monitor)
  function vitalSets() {
    const c = canon(); if (!c) return [];
    const by = new Map();
    (c.observations || []).filter(o => o.type === 'vital' && !o.studentEntered).forEach(o => {
      const k = safe(o.collected, ''); if (!parseSimDate(k)) return;
      if (!by.has(k)) by.set(k, { time: k, obs: {} });
      by.get(k).obs[safe(o.code).toUpperCase()] = o;
    });
    return [...by.values()].sort((a, b) => a.time.localeCompare(b.time));
  }
  function o2At(time) {
    const c = canon(); if (!c) return '';
    const hits = (c.observations || []).filter(o => !o.studentEntered && String(o.collected) <= time &&
      ((o.type === 'assessment' && /^oxygen device$/i.test(safe(o.label || o.code, ''))) || (o.type === 'vital' && safe(o.code).toUpperCase() === 'O2DEV')));
    hits.sort((a, b) => String(a.collected).localeCompare(String(b.collected)));
    return hits.length ? safe(hits[hits.length - 1].value, '') : '';
  }
  const valText = o => o ? `${safe(o.value)}${o.units ? ' ' + o.units : ''}`.trim() : '';
  function setValues(set) {
    const g = code => set.obs[code], d = flowsheetVitalDefaults(canon());
    const src = code => g(code) ? valText(g(code)) : d[code];
    return { TEMP: g('TEMP'), HR: g('HR'), BP: g('BP'), RR: g('RR'), SPO2: g('SPO2'), PAIN: g('PAIN'), O2: o2At(set.time) || (g('O2DEV') ? valText(g('O2DEV')) : ''),
      MAP: g('BP') ? flowsheetMapOf(g('BP').value) : null, PR: g('SPO2HR') ? valText(g('SPO2HR')) : (g('HR') ? valText(g('HR')) : ''),
      TEMPSRC: g('TEMP') ? src('TEMPSRC') : '', HRSRC: g('HR') ? src('HRSRC') : '', BPLOC: g('BP') ? src('BPLOC') : '', BPMETH: g('BP') ? src('BPMETH') : '', RRSRC: g('RR') ? src('RRSRC') : '' };
  }
  function monitorState() {
    const sets = vitalSets(), now = simulationTime;
    let cur = null, next = null;
    // a code missing from the latest set keeps its last reading
    sets.forEach(s => { if (s.time <= now) cur = { time: s.time, obs: Object.assign({}, cur ? cur.obs : {}, s.obs) }; else if (!next) next = s; });
    return { cur, next };
  }

  // ------------------------------------------------------------ page shell
  function ensureShell() {
    const main = document.querySelector('#flowsheetsSection .flowsheet-main'); if (!main || $('fsSheetBar')) return;
    const bar = document.createElement('div'); bar.id = 'fsSheetBar'; bar.className = 'fs-sheetbar';
    const mon = document.createElement('div'); mon.id = 'fsMonitorPanel'; mon.className = 'fs-monitor hidden';
    const io = document.createElement('div'); io.id = 'fsIoTotals'; io.className = 'fs-io-totals hidden';
    const scroll = main.querySelector('.flowsheet-grid-scroll');
    main.insertBefore(bar, scroll); main.insertBefore(mon, scroll); scroll.insertAdjacentElement('afterend', io);
  }

  function renderNav(bySheet) {
    const nav = $('flowsheetSectionNav'); clearChildren(nav);
    SHEETS.forEach(name => {
      const n = bySheet[name].filter(r => !r.practiceHidden).length;
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'flowsheet-section-button' + (name === sheet ? ' active' : '');
      b.setAttribute('aria-pressed', String(name === sheet));
      b.innerHTML = `<span class="fs-nav-name">${esc(name)}</span><span class="flowsheet-section-count">${n}</span>`;
      b.addEventListener('click', () => setSheet(name));
      nav.appendChild(b);
    });
  }

  function renderSheetBar() {
    const bar = $('fsSheetBar'); if (!bar) return;
    const hints = {
      'Vital Signs': 'Tap an empty cell to chart that vital at that time, or use Chart vitals.',
      'Adult Assessment': 'All body systems. Tap an empty cell to chart that finding at that time.',
      'Pain / Safety': 'Tap an empty cell to chart that item at that time.',
      'Lines / Drains / Airways': 'Add a device at an Avatar site, assess it, or remove it. Tap an empty cell to assess or remove that device.',
      'Intake / Output': 'Tap an empty cell to chart that intake or output at that time. Totals update the Summary page too.'
    };
    bar.innerHTML = `<div class="fs-sheetbar-title"><h3>${esc(sheet)}</h3><span>${esc(hints[sheet])}</span></div><div class="fs-sheetbar-actions"></div>`;
    const acts = bar.querySelector('.fs-sheetbar-actions');
    const add = (text, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls || 'small-tool-button'; b.textContent = text; b.addEventListener('click', fn); acts.appendChild(b); };
    if (sheet === 'Lines / Drains / Airways') add('Assess / remove device', () => openDeviceAction(null, 'remove'));
    const btn = $('flowsheetChartBtn'); if (btn) btn.textContent = CHART_LABEL[sheet] || 'Chart';
  }

  // ------------------------------------------------------------ monitor panel
  function renderMonitor() {
    const box = $('fsMonitorPanel'); if (!box) return;
    if (sheet !== 'Vital Signs' || !monitorVisible() || !canon()) { box.className = 'fs-monitor hidden'; box.innerHTML = ''; return; }
    box.className = 'fs-monitor';
    const { cur, next } = monitorState();
    const v = cur ? setValues(cur) : null;
    const tile = (label, unit, code, text, flagged, sub) => `<div class="fs-mon-tile fs-mon-${code}${flagged ? ' abn' : ''}"><span class="fs-mon-label">${label}</span><b>${esc(text || '--')}</b><span class="fs-mon-unit">${unit}</span><span class="fs-mon-sub">${esc(sub || '')}</span></div>`;
    const flag = o => !!(o && safe(o.flag, ''));
    const ago = cur ? Math.max(0, simMinutesBetween(cur.time, simulationTime)) : 0;
    const agoText = ago < 1 ? 'now' : ago < 60 ? `${ago} min ago` : `${Math.floor(ago / 60)} h ${ago % 60} min ago`;
    let nextHtml;
    if (next) {
      const nv = setValues(next), mins = simMinutesBetween(simulationTime, next.time);
      const bits = [['HR', valText(nv.HR)], ['BP', valText(nv.BP)], ['MAP', nv.MAP != null ? `${nv.MAP} mmHg` : ''], ['RR', valText(nv.RR)], ['SpO2', valText(nv.SPO2)], ['Temp', valText(nv.TEMP)], ['Pain', valText(nv.PAIN)], ['O2', nv.O2]].filter(x => x[1]);
      nextHtml = `<div class="fs-mon-next-head"><b>Suggested next set</b><span class="fs-mon-count">${esc(hhmm(next.time))} (${esc(epicDate(next.time).split(' ')[0])}) &nbsp; in ${mins} min</span></div><div class="fs-mon-next-vals">${bits.map(([k, t]) => `<span><em>${k}</em> ${esc(t)}</span>`).join('')}</div>`;
    } else nextHtml = `<div class="fs-mon-next-head"><b>Suggested next set</b><span class="fs-mon-count">No further sets planned</span></div>`;
    box.innerHTML = `<div class="fs-mon-head"><b>Bedside monitor</b><span>${cur ? `Reading from ${esc(hhmm(cur.time))} (${agoText})` : 'No monitor reading yet'}</span>${isInstructor() ? `<label class="fs-mon-share"><input type="checkbox" id="fsMonShow"${practice().showMonitor ? ' checked' : ''}> Show monitor to students</label>` : ''}</div>
      <div class="fs-mon-grid">${tile('HR', 'bpm', 'HR', v && valText(v.HR).replace(/\s*bpm$/i, ''), v && flag(v.HR), v && v.HRSRC)}${tile('BP', v && v.MAP != null ? `MAP ${v.MAP} mmHg` : 'mmHg', 'BP', v && valText(v.BP), v && flag(v.BP), v && v.BP ? `${v.BPLOC}, ${v.BPMETH}` : '')}${tile('RR', '/min', 'RR', v && valText(v.RR).replace(/\s*\/min$/i, ''), v && flag(v.RR), v && v.RRSRC)}${tile('SpO2', '%', 'SPO2', v && valText(v.SPO2).replace(/\s*%$/, ''), v && flag(v.SPO2), v && v.PR ? `Pulse rate ${v.PR.replace(/\s*bpm$/i, '')} bpm` : '')}${tile('Temp', v && /°\s*[CF]/.test(valText(v.TEMP)) ? valText(v.TEMP).replace(/^.*?(°\s*[CF]).*$/, '$1') : '', 'TEMP', v && valText(v.TEMP).replace(/\s*°\s*[CF]\s*$/, ''), v && flag(v.TEMP), v && v.TEMPSRC)}${tile('Pain', '0 to 10', 'PAIN', v && valText(v.PAIN).replace(/\/10$/, ''), false)}${tile('O2 device', '', 'O2', v && v.O2, false)}</div>
      <div class="fs-mon-next">${nextHtml}</div>`;
    const cb = $('fsMonShow');
    if (cb) cb.addEventListener('change', () => { practice().showMonitor = cb.checked; try { persistCase(); } catch (e) { /* best effort */ } });
  }

  // ------------------------------------------------------------ grid
  function nowCol() { return simulationTime ? simulationTime.slice(0, 13) + ':00' : ''; }
  function rowsFor(records) {
    // returns [{header:'text'} | {field, section, label}]
    const out = [];
    const fieldsIn = (section) => { const seen = []; records.filter(r => r.section === section).forEach(r => { if (!seen.some(f => norm(f) === norm(r.field))) seen.push(r.field); }); return seen; };
    const bank = (window.FlowsheetPractice && window.FlowsheetPractice.BANK) || {};
    const withBank = (section) => {
      const have = fieldsIn(section), list = [];
      Object.keys(bank[section] || {}).forEach(k => { const hit = have.find(f => norm(f) === norm(k)); list.push(hit || k); });
      have.forEach(f => { if (!list.some(x => norm(x) === norm(f))) list.push(f); });
      return list;
    };
    if (sheet === 'Vital Signs') {
      const extra = fieldsIn('Vital Signs').filter(f => !VITAL_ROWS.includes(f));
      [...VITAL_ROWS, ...extra].forEach(f => out.push({ field: f, section: 'Vital Signs', sub: SUB_ROWS.includes(f) }));
    } else if (sheet === 'Adult Assessment' || sheet === 'Pain / Safety') {
      const base = sheet === 'Adult Assessment' ? SYSTEMS : PAIN_SAFETY;
      const others = [...new Set(records.map(r => r.section))].filter(s => !base.includes(s));
      [...base, ...others].forEach(sec => { out.push({ header: sec }); withBank(sec).forEach(f => out.push({ field: f, section: sec })); });
    } else if (sheet === 'Lines / Drains / Airways') {
      const seen = [];
      records.forEach(r => { if (!seen.includes(r.field)) seen.push(r.field); });
      seen.forEach(f => out.push({ field: f, section: 'Lines / Drains / Airways' }));
    } else {
      [['Intake', INTAKE_TYPES], ['Output', OUTPUT_TYPES]].forEach(([kind, std]) => {
        out.push({ header: `${kind} (mL)` });
        const extra = [...new Set(records.filter(r => r.field.startsWith(kind + ':')).map(r => r.field.slice(kind.length + 2)))].filter(l => !std.includes(l)).sort();
        [...std, ...extra].forEach(l => out.push({ field: `${kind}: ${l}`, label: l, section: 'Intake / Output', io: kind.toLowerCase() }));
      });
      out.push({ header: 'Totals (mL)' });
      ['Total intake', 'Total output', 'Net balance'].forEach(l => out.push({ total: l }));
    }
    return out;
  }

  function renderGrid(records, times, nowKey) {
    const head = $('flowsheetGridHead'), body = $('flowsheetGridBody'), scroller = document.querySelector('#flowsheetsSection .flowsheet-grid-scroll');
    const prevLeft = scroller ? scroller.scrollLeft : 0;
    clearChildren(head); clearChildren(body);
    const hr = document.createElement('tr');
    const lab = document.createElement('th'); lab.className = 'flowsheet-label-col'; lab.textContent = sheet === 'Intake / Output' ? 'Intake / output' : sheet === 'Lines / Drains / Airways' ? 'Device' : 'Assessment'; hr.appendChild(lab);
    times.forEach(t => {
      const th = document.createElement('th'); th.className = 'flowsheet-time-col' + (t === nowKey ? ' fs-now-col' : '');
      const st = epicDate(t).split(' '); th.innerHTML = st.length > 1 ? `${esc(st[0])}<br><span class="flowsheet-muted">${esc(st[1])}</span>${t === nowKey ? '<br><span class="fs-now-tag">now</span>' : ''}` : esc(t);
      if (sheet === 'Vital Signs' || sheet === 'Intake / Output') { th.classList.add('fs-time-click'); th.title = 'Chart at this time'; th.addEventListener('click', () => sheet === 'Vital Signs' ? openVitals(colTime(t)) : openIO(colTime(t))); }
      hr.appendChild(th);
    });
    head.appendChild(hr);
    const rows = rowsFor(records);
    const live = records.filter(r => !r.practiceHidden);
    rows.forEach(rw => {
      const tr = document.createElement('tr');
      if (rw.header) {
        tr.className = 'flowsheet-section-row';
        const td = document.createElement('td'); td.className = 'flowsheet-label-col'; td.textContent = rw.header; tr.appendChild(td);
        const sp = document.createElement('td'); sp.colSpan = times.length; tr.appendChild(sp); body.appendChild(tr); return;
      }
      if (rw.sub) tr.classList.add('fs-subrow');
      const fc = document.createElement('td'); fc.className = 'flowsheet-label-col flowsheet-field-name'; fc.textContent = rw.total || rw.label || rw.field; tr.appendChild(fc);
      if (rw.total) tr.classList.add('fs-total-row');
      times.forEach(t => {
        const td = document.createElement('td'); td.className = 'flowsheet-cell' + (t === nowKey ? ' fs-now-col' : '');
        if (rw.total) {
          const inCol = live.filter(r => r.col === t);
          const inn = inCol.filter(r => r.ioKind === 'intake').reduce((s, r) => s + r.ml, 0), outt = inCol.filter(r => r.ioKind === 'output').reduce((s, r) => s + r.ml, 0);
          if (!inCol.length) { td.classList.add('empty-cell-value'); } else td.textContent = rw.total === 'Total intake' ? `${inn}` : rw.total === 'Total output' ? `${outt}` : `${inn - outt >= 0 ? '+' : ''}${inn - outt}`;
          tr.appendChild(td); return;
        }
        const inCell = live.filter(r => norm(r.field) === norm(rw.field) && r.section === rw.section && r.col === t);
        const stubs = records.filter(r => r.practiceHidden && norm(r.field) === norm(rw.field) && r.section === rw.section && r.col === t);
        if (!inCell.length) {
          td.classList.add('empty-cell-value'); td.title = stubs.length ? 'Practice mode: chart what you find' : 'Tap to chart this at this time'; td.textContent = '';
          td.addEventListener('click', () => chartCell(rw, t));
        } else if (rw.io) {
          const total = inCell.reduce((s, r) => s + r.ml, 0); td.textContent = String(total);
          if (inCell.some(r => r.studentEntered)) td.classList.add('fs-student');
          if (inCell.length > 1) td.title = inCell.map(r => `${epicDate(r.collected)}  ${r.value}`).join('\n');
          const last = inCell[inCell.length - 1]; if (currentFlowsheetSelection === last.id) td.classList.add('selected');
          td.addEventListener('click', () => { currentFlowsheetSelection = last.id; lastCell = inCell; renderFlowsheetsPage(currentPatientData); });
        } else {
          const rec = inCell[inCell.length - 1];
          if (rec.abnormal) td.classList.add('flowsheet-abnormal');
          if (rec.studentEntered) td.classList.add('fs-student');
          if (currentFlowsheetSelection === rec.id) td.classList.add('selected');
          td.textContent = safe(rec.value);
          if (inCell.length > 1) td.title = inCell.map(r => `${epicDate(r.collected)}  ${r.value}`).join('\n');
          td.addEventListener('click', () => { currentFlowsheetSelection = rec.id; lastCell = inCell; renderFlowsheetsPage(currentPatientData); });
        }
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    if (sheet === 'Lines / Drains / Airways' && !records.length) {
      const tr = document.createElement('tr'); tr.innerHTML = `<td class="empty-cell" colspan="${times.length + 1}">No lines, drains or airways yet. Use Add device to place one.</td>`; body.appendChild(tr);
    }
    if (scroller) {
      if (scroller.clientWidth > 0) { scroller.scrollLeft = stickRight ? scroller.scrollWidth : prevLeft; stickRight = false; }   // while the page is hidden there is nothing to scroll yet
    }
  }

  // ------------------------------------------------------------ I&O totals by shift / 24 h
  function ioEnd(io, simDate) {
    if (io.collected) return { t: io.collected, point: true };
    const m = safe(io.time, '').match(/^(\d{2})(\d{2})\s*-\s*(\d{2})(\d{2})$/);
    const date = io.date || simDate;
    if (m && date) return { t: `${date} ${m[3]}:${m[4]}`, point: false };
    return { t: '', point: false };
  }
  function shiftOf(end) {
    const d = parseSimDate(end.t); if (!d) return null;
    const x = new Date(d.getTime() - (end.point ? 0 : 60000));
    const h = x.getHours(); const day = new Date(x); day.setHours(0, 0, 0, 0);
    let start;
    if (h >= 7 && h < 19) { start = new Date(day); start.setHours(7); }
    else { start = new Date(day); if (h < 7) start.setDate(start.getDate() - 1); start.setHours(19); }
    const stop = new Date(start.getTime() + 12 * 3600000);
    const f = formatSimDate;
    const day12 = start.getHours() === 7;
    return { key: f(start), label: `${day12 ? 'Day' : 'Night'} shift ${epicDate(f(start)).slice(0, 5)} ${pad2(start.getHours())}00 to ${epicDate(f(stop)).slice(0, 5)} ${pad2(stop.getHours())}00` };
  }
  const pad2 = n => String(n).padStart(2, '0');
  function renderIoTotals(canonical) {
    const box = $('fsIoTotals'); if (!box) return;
    if (sheet !== 'Intake / Output') { box.className = 'fs-io-totals hidden'; box.innerHTML = ''; return; }
    box.className = 'fs-io-totals';
    const simDate = safe(canonical.timeline?.simulationStart || canonical.encounter?.admitDate, '').slice(0, 10);
    const events = (canonical.ioEvents || []).map(io => ({ io, end: ioEnd(io, simDate) }));
    const n = v => Number(v) || 0;
    const shifts = new Map();
    events.forEach(({ io, end }) => { const s = shiftOf(end); if (!s) return; const r = shifts.get(s.key) || { label: s.label, i: 0, o: 0 }; r.i += n(io.intake); r.o += n(io.output); shifts.set(s.key, r); });
    const now = ms(simulationTime), lo = now - 24 * 3600000;
    let i24 = 0, o24 = 0, iAll = 0, oAll = 0;
    events.forEach(({ io, end }) => { iAll += n(io.intake); oAll += n(io.output); const t = ms(end.t); if (t > lo && t <= now) { i24 += n(io.intake); o24 += n(io.output); } });
    const net = (i, o) => `${i - o >= 0 ? '+' : ''}${i - o}`;
    const row = (label, i, o, cls) => `<tr class="${cls || ''}"><th>${esc(label)}</th><td>${i}</td><td>${o}</td><td>${net(i, o)}</td></tr>`;
    const shiftRows = [...shifts.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([, r]) => row(r.label, r.i, r.o)).join('');
    box.innerHTML = `<table class="fs-io-table"><thead><tr><th>Totals</th><th>Intake mL</th><th>Output mL</th><th>Net mL</th></tr></thead><tbody>${shiftRows}${row('Last 24 hours (to now)', i24, o24, 'fs-io-strong')}${row('Whole stay (matches the Summary page)', iAll, oAll, 'fs-io-strong')}</tbody></table>`;
  }

  // ------------------------------------------------------------ main render
  function render(data) {
    ensureShell();
    const canonical = data?.__canonical || currentCanonicalCase || normalizeCaseData(data).canonical;
    const all = buildFlowsheetRecords(canonical);
    const bySheet = {}; SHEETS.forEach(s => { bySheet[s] = []; });
    all.forEach(r => bySheet[flowsheetSheetOf(r.section)].push(r));
    const records = bySheet[sheet];
    const doc = Array.from(new Set(records.filter(r => !r.practiceHidden).map(r => safe(r.col || r.collected)).filter(Boolean))).sort();
    const nk = nowCol();
    let times = flowsheetLatestOnlyMode && doc.length ? [doc[doc.length - 1]] : (nk && !doc.includes(nk) ? [...doc, nk].sort() : doc.slice());
    if (!times.length && nk) times = [nk];
    $('flowsheetStatus').textContent = `${all.filter(r => !r.practiceHidden).length} documented values | ${SHEETS.length} flowsheets`;
    $('flowsheetSectionCount').textContent = `${SHEETS.length} flowsheets`;
    $('flowsheetDateLabel').textContent = canonical.encounter?.admitDate ? epicDate(canonical.encounter.admitDate) : 'Current encounter';
    $('flowsheetFooterMeta').textContent = doc.length ? `${doc.length} documentation time(s)` : 'No documentation times';
    $('flowsheetLatestOnly').classList.toggle('active', flowsheetLatestOnlyMode);
    renderNav(bySheet); renderSheetBar(); renderMonitor();
    renderGrid(records, times, nk);
    renderIoTotals(canonical);
    const live = records.filter(r => !r.practiceHidden);
    let selected = live.find(r => r.id === currentFlowsheetSelection) || live.slice().sort((a, b) => String(a.col || a.collected).localeCompare(String(b.col || b.collected))).pop() || null;
    if (selected) currentFlowsheetSelection = selected.id;
    renderFlowsheetCellDetail(selected);
    addDetailExtras(selected);
  }

  function addDetailExtras(rec) {
    const body = $('flowsheetDetailBody'); if (!body || !rec) return;
    const cell = (lastCell && lastCell.some(r => r.id === rec.id)) ? lastCell : null;
    if (cell && cell.length > 1) {
      const d = document.createElement('div'); d.className = 'flowsheet-detail-section';
      d.innerHTML = `<h3>Entries in this column</h3>` + cell.map(r => `<div class="fs-entry-line">${esc(epicDate(r.collected))} &nbsp; ${esc(r.field)}: <b>${esc(r.value)}</b></div>`).join('');
      body.appendChild(d);
    }
    if (rec.studentEntered) {
      const d = document.createElement('div'); d.className = 'flowsheet-detail-section';
      d.innerHTML = `<span class="fs-student-tag">Charted by student</span> <button type="button" class="secondary-button fs-del">${rec.src === 'deviceRemoval' ? 'Undo removal' : 'Delete this entry'}</button>`;
      d.querySelector('.fs-del').addEventListener('click', () => deleteEntry(rec));
      body.appendChild(d);
    }
  }
  function deleteEntry(rec) {
    const c = canon(); if (!c || !window.confirm(rec.src === 'deviceRemoval' ? 'Put this device back in service?' : 'Delete this student entry?')) return;
    if (rec.src === 'obs') c.observations = (c.observations || []).filter(o => o.id !== (rec.cloneOf || rec.id));
    else if (rec.src === 'io') c.ioEvents = (c.ioEvents || []).filter(e => e.id !== rec.ioId);
    else if (rec.src === 'device') c.devices = (c.devices || []).filter(d => d.id !== rec.deviceId);
    else if (rec.src === 'deviceRemoval') {
      const d = (c.devices || []).find(x => x.id === rec.deviceId);
      if (d) { delete d.removedAt; delete d.removedNote; delete d.removedByStudent; if (d.originalStatus !== undefined) { d.status = d.originalStatus; delete d.originalStatus; } }
    }
    currentFlowsheetSelection = null; lastCell = null;
    refreshSimulationView();
  }

  // ------------------------------------------------------------ dialogs
  function makeDialog(id, title, sub, body) {
    let dlg = $(id); if (dlg) dlg.remove();
    dlg = document.createElement('dialog'); dlg.id = id; dlg.className = 'action-dialog fs-form';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>${esc(title)}</h2><p>${esc(sub)}</p></div><button type="button" class="icon-button" data-close aria-label="Close">×</button></div><div class="dialog-body">${body}</div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-close]')) dlg.close(); const n = e.target.closest && e.target.closest('[data-now]'); if (n) { const inp = $(n.dataset.now); if (inp) inp.value = toLocal(simulationTime); } });
    return dlg;
  }
  const timeField = (id, label) => `<label class="fs-wide"><span class="input-label">${label || 'Time charted'}</span><span class="fs-time-row"><input id="${id}" type="datetime-local" step="60"><button type="button" class="secondary-button" data-now="${id}">Now</button></span></label>`;
  const setTime = (id, t) => { const el = $(id); el.value = toLocal(t && parseSimDate(t) ? t : simulationTime); el.max = toLocal(simulationTime); };
  function readTime(id, msgId) {
    const t = fromLocal($(id).value), msg = $(msgId);
    const fail = text => { msg.textContent = text; msg.className = 'import-message error'; return null; };
    if (!parseSimDate(t)) return fail('Choose the time you are charting.');
    if (ms(t) > ms(simulationTime)) return fail(`That time is later than the patient's current time (${epicDate(simulationTime)}). Move the clock forward first, or choose an earlier time.`);
    return t;
  }
  const opts = (list, sel) => list.map(x => `<option${x === sel ? ' selected' : ''}>${esc(x)}</option>`).join('');
  const done = () => { currentFlowsheetSelection = null; lastCell = null; refreshSimulationView(); };

  // ---- vitals
  const srcSel = (id, label, list) => `<label><span class="input-label">${label}</span><select id="${id}"><option value="">(not charted)</option>${opts(list)}</select></label>`;
  function openVitals(time) {
    if (!canon()) { alert('Load a patient first.'); return; }
    const dlg = makeDialog('fsVitalsDialog', 'Chart vital signs', 'Creates time-stamped vital sign entries. Leave a box empty to skip it.', `
      <div class="fs-grid fs-grid3">
        ${timeField('fsv_time')}
        <label><span class="input-label">Temperature</span><span class="fs-time-row"><input id="fsv_temp" type="number" inputmode="decimal" step="0.1" placeholder="98.6"><select id="fsv_tunit" style="max-width:76px"><option>F</option><option>C</option></select></span></label>
        ${srcSel('fsv_tsrc', 'Temp source', TEMP_SOURCES)}
        <label><span class="input-label">Heart rate (bpm)</span><input id="fsv_hr" type="number" inputmode="numeric" placeholder="80"></label>
        ${srcSel('fsv_hrsrc', 'HR source', HR_SOURCES)}
        <label><span class="input-label">Pulse rate from SpO2 (bpm)</span><input id="fsv_pr" type="number" inputmode="numeric" placeholder="80"></label>
        <label><span class="input-label">Blood pressure (mmHg)</span><span class="fs-time-row"><input id="fsv_sbp" type="number" inputmode="numeric" placeholder="120"><b>/</b><input id="fsv_dbp" type="number" inputmode="numeric" placeholder="80"></span></label>
        ${srcSel('fsv_bploc', 'BP location', BP_LOCS)}
        ${srcSel('fsv_bpmeth', 'BP method', BP_METHODS)}
        <label><span class="input-label">MAP (calculated)</span><output id="fsv_map" class="fs-map">--</output></label>
        <label><span class="input-label">Respiratory rate (/min)</span><input id="fsv_rr" type="number" inputmode="numeric" placeholder="16"></label>
        ${srcSel('fsv_rrsrc', 'RR source', RR_SOURCES)}
        <label><span class="input-label">SpO2 (%)</span><input id="fsv_spo2" type="number" inputmode="numeric" placeholder="97"></label>
        <label><span class="input-label">O2 device</span><select id="fsv_o2"><option value="">(not charted)</option>${opts(O2_DEVICES)}</select></label>
        <label><span class="input-label">O2 flow (L/min)</span><input id="fsv_flow" type="number" inputmode="decimal" step="0.5" placeholder="2"></label>
        <label><span class="input-label">Pain (0 to 10)</span><input id="fsv_pain" type="number" inputmode="numeric" min="0" max="10" placeholder="0"></label>
      </div>
      <div class="dialog-actions"><div id="fsv_msg" class="import-message"></div><span class="fs-btn-row">${monitorVisible() ? '<button type="button" id="fsv_fill" class="secondary-button">Fill from monitor</button>' : ''}<button type="button" id="fsv_save" class="primary-button">Save vitals</button></span></div>`);
    dlg.classList.add('fs-form-wide');
    setTime('fsv_time', time);
    const updMap = () => { const s = parseFloat($('fsv_sbp').value), d = parseFloat($('fsv_dbp').value); $('fsv_map').textContent = s > 0 && d > 0 ? `${Math.round((s + 2 * d) / 3)} mmHg` : '--'; };
    $('fsv_sbp').addEventListener('input', updMap); $('fsv_dbp').addEventListener('input', updMap);
    const fill = $('fsv_fill'); if (fill) fill.addEventListener('click', () => { fillFromMonitor(); updMap(); });
    $('fsv_save').addEventListener('click', saveVitals);
    dlg.showModal();
  }
  function fillFromMonitor() {
    const { cur } = monitorState(), msg = $('fsv_msg');
    if (!cur) { msg.textContent = 'The monitor has no reading yet.'; msg.className = 'import-message error'; return; }
    const v = setValues(cur), num = s => { const m = String(s || '').match(/-?\d+(\.\d+)?/); return m ? m[0] : ''; };
    $('fsv_temp').value = num(valText(v.TEMP)); $('fsv_tunit').value = /°?\s*C\b/.test(valText(v.TEMP)) ? 'C' : 'F';
    $('fsv_hr').value = num(valText(v.HR)); $('fsv_pr').value = num(v.PR); $('fsv_rr').value = num(valText(v.RR)); $('fsv_spo2').value = num(valText(v.SPO2)); $('fsv_pain').value = num(valText(v.PAIN));
    const bp = valText(v.BP).match(/(\d+)\s*\/\s*(\d+)/); $('fsv_sbp').value = bp ? bp[1] : ''; $('fsv_dbp').value = bp ? bp[2] : '';
    const pick = (id, list, val) => { $(id).value = list.includes(val) ? val : ''; };
    pick('fsv_tsrc', TEMP_SOURCES, v.TEMPSRC); pick('fsv_hrsrc', HR_SOURCES, v.HRSRC); pick('fsv_bploc', BP_LOCS, v.BPLOC); pick('fsv_bpmeth', BP_METHODS, v.BPMETH); pick('fsv_rrsrc', RR_SOURCES, v.RRSRC);
    const o2 = String(v.O2 || ''), hit = O2_DEVICES.find(d => o2.toLowerCase().includes(d.toLowerCase().split(' ')[0]) && (d !== 'Room air' || /room|\bra\b/i.test(o2)));
    $('fsv_o2').value = /room air|\bra\b/i.test(o2) ? 'Room air' : (hit || ''); const fl = o2.match(/(\d+(?:\.\d+)?)\s*l/i); $('fsv_flow').value = fl && $('fsv_o2').value !== 'Room air' ? fl[1] : '';
    setTime('fsv_time', simulationTime);
    msg.textContent = `Filled from the monitor reading at ${hhmm(cur.time)}. Check, then save.`; msg.className = 'import-message success';
  }
  function saveVitals() {
    const msg = $('fsv_msg'), t = readTime('fsv_time', 'fsv_msg'); if (!t) return;
    const err = text => { msg.textContent = text; msg.className = 'import-message error'; };
    const g = id => $(id).value.trim(), out = [];
    const num = (id, lo, hi, name) => { const s = g(id); if (s === '') return null; const v = parseFloat(s); if (!(v >= lo && v <= hi)) { err(`${name} should be between ${lo} and ${hi}.`); return NaN; } return v; };
    const src = (code, label, id) => { const v = g(id); if (v) out.push([code, label, v, '', false]); };
    const temp = num('fsv_temp', 25, 110, 'Temperature'); if (Number.isNaN(temp)) return;
    if (temp != null) { const unit = $('fsv_tunit').value, f = unit === 'C' ? temp * 9 / 5 + 32 : temp; if (f < 85 || f > 110) return err('Temperature looks out of range for the unit chosen.'); out.push(['TEMP', 'Temperature', `${temp.toFixed(1)} °${unit}`, '', vitalFlag('TEMP', f)]); src('TEMPSRC', 'Temp Source', 'fsv_tsrc'); }
    else if (g('fsv_tsrc')) return err('Enter the temperature that goes with the source, or clear the source.');
    const hr = num('fsv_hr', 20, 300, 'Heart rate'); if (Number.isNaN(hr)) return; if (hr != null) { out.push(['HR', 'Heart Rate', String(Math.round(hr)), 'bpm', vitalFlag('HR', hr)]); src('HRSRC', 'HR Source', 'fsv_hrsrc'); }
    else if (g('fsv_hrsrc')) return err('Enter the heart rate that goes with the source, or clear the source.');
    const pr = num('fsv_pr', 20, 300, 'Pulse rate from SpO2'); if (Number.isNaN(pr)) return; if (pr != null) out.push(['SPO2HR', 'Pulse Rate from SpO2', String(Math.round(pr)), 'bpm', vitalFlag('HR', pr)]);
    const sbp = num('fsv_sbp', 40, 300, 'Systolic pressure'); if (Number.isNaN(sbp)) return;
    const dbp = num('fsv_dbp', 20, 200, 'Diastolic pressure'); if (Number.isNaN(dbp)) return;
    if ((sbp == null) !== (dbp == null)) return err('Enter both numbers of the blood pressure.');
    if (sbp != null) { if (sbp <= dbp) return err('Systolic pressure should be higher than diastolic.'); out.push(['BP', 'Blood Pressure', `${Math.round(sbp)}/${Math.round(dbp)}`, '', vitalFlag('SBP', sbp)]); src('BPLOC', 'BP Location', 'fsv_bploc'); src('BPMETH', 'BP Method', 'fsv_bpmeth'); }
    else if (g('fsv_bploc') || g('fsv_bpmeth')) return err('Enter the blood pressure that goes with the location / method, or clear them.');
    const rr = num('fsv_rr', 4, 70, 'Respiratory rate'); if (Number.isNaN(rr)) return; if (rr != null) { out.push(['RR', 'Respiratory Rate', String(Math.round(rr)), '/min', vitalFlag('RR', rr)]); src('RRSRC', 'RR Source', 'fsv_rrsrc'); }
    else if (g('fsv_rrsrc')) return err('Enter the respiratory rate that goes with the source, or clear the source.');
    const sp = num('fsv_spo2', 50, 100, 'SpO2'); if (Number.isNaN(sp)) return; if (sp != null) out.push(['SPO2', 'SpO2', String(Math.round(sp)), '%', vitalFlag('SPO2', sp)]);
    const pn = num('fsv_pain', 0, 10, 'Pain'); if (Number.isNaN(pn)) return; if (pn != null) out.push(['PAIN', 'Pain', `${Math.round(pn)}/10`, '', false]);
    const dev = $('fsv_o2').value, flow = g('fsv_flow');
    if (dev) out.push(['O2DEV', 'O2 Device', dev + (flow && dev !== 'Room air' ? ` ${flow} L/min` : ''), '', false]);
    if (!out.length) return err('Enter at least one vital sign.');
    const c = canon(), tag = stampDigits(t) + '_' + uid();
    out.forEach(([code, label, value, units, abn]) => c.observations.push({ id: `student_vital_${code.toLowerCase()}_${tag}`, type: 'vital', code, label, value, units, flag: abn ? 'Abnormal' : '', collected: t, source: 'Student charting', studentEntered: true }));
    $('fsVitalsDialog').close(); done();
  }

  // ---- intake / output
  function openIO(time, kind, label) {
    if (!canon()) { alert('Load a patient first.'); return; }
    const dlg = makeDialog('fsIoDialog', 'Chart intake and output', 'Adds to the patient\'s totals on the Flowsheet and the Summary page.', `
      <div class="fs-grid">
        ${timeField('fsio_time')}
        <label><span class="input-label">Intake type</span><select id="fsio_itype">${opts(INTAKE_TYPES)}</select></label>
        <label><span class="input-label">Intake amount (mL)</span><input id="fsio_iml" type="number" inputmode="numeric" min="0" placeholder="0"></label>
        <label><span class="input-label">Output type</span><select id="fsio_otype">${opts(OUTPUT_TYPES)}</select></label>
        <label><span class="input-label">Output amount (mL)</span><input id="fsio_oml" type="number" inputmode="numeric" min="0" placeholder="0"></label>
        <label class="fs-wide"><span class="input-label">Note (optional)</span><input id="fsio_note" type="text" placeholder="e.g., clear yellow urine, 8 oz cup"></label>
      </div>
      <div class="dialog-actions"><div id="fsio_msg" class="import-message"></div><span class="fs-btn-row"><button type="button" id="fsio_more" class="secondary-button">Save and add another</button><button type="button" id="fsio_save" class="primary-button">Save</button></span></div>`);
    setTime('fsio_time', time);
    if (kind === 'output') { if (label) $('fsio_otype').value = label; $('fsio_oml').focus(); } else if (label) $('fsio_itype').value = label;
    $('fsio_save').addEventListener('click', () => saveIO(false));
    $('fsio_more').addEventListener('click', () => saveIO(true));
    dlg.showModal();
  }
  function saveIO(again) {
    const msg = $('fsio_msg'), t = readTime('fsio_time', 'fsio_msg'); if (!t) return;
    const err = text => { msg.textContent = text; msg.className = 'import-message error'; };
    const iml = $('fsio_iml').value === '' ? 0 : Math.round(parseFloat($('fsio_iml').value)), oml = $('fsio_oml').value === '' ? 0 : Math.round(parseFloat($('fsio_oml').value));
    if (!(iml >= 0 && oml >= 0) || iml > 10000 || oml > 10000) return err('Amounts must be between 0 and 10,000 mL.');
    if (!iml && !oml) return err('Enter an intake or an output amount in mL.');
    const c = canon(), note = $('fsio_note').value.trim();
    if (!Array.isArray(c.ioEvents)) c.ioEvents = [];
    const make = (kind, type, ml) => {
      const detail = { po: 0, iv: 0, urine: 0, other: 0, otherLabel: '' };
      if (kind === 'intake') { if (type === 'Oral') detail.po = ml; else if (/^IV/.test(type)) detail.iv = ml; else { detail.otherIntake = ml; detail.otherIntakeLabel = type; } }
      else if (type === 'Urine') detail.urine = ml; else { detail.other = ml; detail.otherLabel = type; }
      c.ioEvents.push({ id: `io_student_${stampDigits(t)}_${kind}_${uid()}`, date: t.slice(0, 10), time: t.slice(11, 13) + t.slice(14, 16), collected: t, intake: kind === 'intake' ? ml : 0, output: kind === 'output' ? ml : 0, detail, ioKind: kind, ioType: type, note, studentEntered: true });
    };
    if (iml) make('intake', $('fsio_itype').value, iml);
    if (oml) make('output', $('fsio_otype').value, oml);
    if (again) { $('fsio_iml').value = ''; $('fsio_oml').value = ''; $('fsio_note').value = ''; msg.textContent = 'Saved. Add another.'; msg.className = 'import-message success'; refreshSimulationView(); }
    else { $('fsIoDialog').close(); done(); }
  }

  // ---- devices
  function openDeviceAdd() {
    if (!canon()) { alert('Load a patient first.'); return; }
    const first = DEVICE_TYPES[0];
    const dlg = makeDialog('fsDeviceDialog', 'Add a line, drain, tube or airway', 'The device appears on the Avatar at the site you choose.', `
      <div class="fs-grid">
        <label><span class="input-label">Device type</span><select id="fsd_type">${DEVICE_TYPES.map(d => `<option>${esc(d[0])}</option>`).join('')}</select></label>
        <label id="fsd_otherwrap" class="hidden"><span class="input-label">Device name</span><input id="fsd_other" type="text" placeholder="e.g., Rectal tube"></label>
        <label><span class="input-label">Location (Avatar site)</span><select id="fsd_site">${SITES.map(s => `<option value="${s[0]}"${s[0] === first[2] ? ' selected' : ''}>${esc(s[1])}</option>`).join('')}</select></label>
        <label><span class="input-label">Gauge / size</span><input id="fsd_size" type="text" list="fsd_sizes" placeholder="e.g., 20 gauge"><datalist id="fsd_sizes"></datalist></label>
        ${timeField('fsd_time', 'Date / time placed')}
        <label><span class="input-label">Status</span><input id="fsd_status" type="text" value="${esc(first[4])}"></label>
        <label class="fs-wide"><span class="input-label" id="fsd_infl">Infusing (optional)</span><input id="fsd_inf" type="text" placeholder="e.g., 0.9% NS at 75 mL/hr"></label>
        <label class="fs-wide"><span class="input-label">Assessment</span><input id="fsd_assess" type="text" placeholder="e.g., Site clean, dry, intact; flushes without resistance"></label>
      </div>
      <div class="dialog-actions"><div id="fsd_msg" class="import-message"></div><button type="button" id="fsd_save" class="primary-button">Add device</button></div>`);
    setTime('fsd_time', simulationTime);
    const sync = () => {
      const d = DEVICE_TYPES.find(x => x[0] === $('fsd_type').value) || DEVICE_TYPES[0];
      $('fsd_site').value = d[2]; $('fsd_status').value = d[4];
      $('fsd_sizes').innerHTML = d[3].map(x => `<option value="${esc(x)}"></option>`).join(''); $('fsd_size').placeholder = d[3][0] ? `e.g., ${d[3][0]}` : 'size (optional)';
      $('fsd_otherwrap').classList.toggle('hidden', d[0] !== 'Other device');
      $('fsd_infl').textContent = d[1] === 'IV' ? 'Infusing (optional)' : 'Drainage / output (optional)';
    };
    $('fsd_type').addEventListener('change', sync); sync();
    $('fsd_save').addEventListener('click', saveDeviceAdd);
    dlg.showModal();
  }
  function saveDeviceAdd() {
    const msg = $('fsd_msg'), t = readTime('fsd_time', 'fsd_msg'); if (!t) return;
    const err = text => { msg.textContent = text; msg.className = 'import-message error'; };
    const d = DEVICE_TYPES.find(x => x[0] === $('fsd_type').value) || DEVICE_TYPES[0];
    const type = d[0] === 'Other device' ? $('fsd_other').value.trim() : d[0];
    if (!type) return err('Name the device.');
    const site = SITES.find(s => s[0] === $('fsd_site').value); if (!site) return err('Choose a location.');
    const status = $('fsd_status').value.trim() || 'In place', assess = $('fsd_assess').value.trim() || 'Placed; site assessed', size = $('fsd_size').value.trim(), extra = $('fsd_inf').value.trim();
    const dev = { id: `device_student_${makeStableId('d', type, site[1]).slice(2)}_${uid()}`, deviceType: d[1], type, location: site[1], siteMarker: site[0], placementDate: t, lastAssessment: `${t} - ${assess}`, status, studentEntered: true };
    if (size) dev.gauge = size;
    if (extra) { if (d[1] === 'IV') dev.infusing = extra; else dev.drainage = extra; }
    canon().devices.push(dev);
    $('fsDeviceDialog').close(); done();
  }

  function activeDevices() { return canon() ? getVisibleCanonicalCase(canon()).devices : []; }
  function openDeviceAction(deviceId, action, time) {
    if (!canon()) { alert('Load a patient first.'); return; }
    const devs = activeDevices();
    if (!devs.length) { alert('There are no active devices to assess or remove. Use Add device first.'); return; }
    const dlg = makeDialog('fsDevActDialog', 'Assess or remove a device', 'Charts a device assessment, or discontinues the device at the time you choose.', `
      <div class="fs-grid">
        <label class="fs-wide"><span class="input-label">Device</span><select id="fsa_dev">${devs.map(x => `<option value="${esc(x.id)}">${esc(x.type)} - ${esc(x.location)}</option>`).join('')}</select></label>
        <label class="checkbox-row fs-radio"><input type="radio" name="fsa_act" id="fsa_assess" value="assess"><span>Assess device</span></label>
        <label class="checkbox-row fs-radio"><input type="radio" name="fsa_act" id="fsa_remove" value="remove"><span>Remove / discontinue device</span></label>
        ${timeField('fsa_time')}
        <label class="fs-wide"><span class="input-label" id="fsa_txtl">Assessment</span><input id="fsa_text" type="text" placeholder="e.g., Site clean, dry, intact; no redness or swelling"></label>
      </div>
      <div class="dialog-actions"><div id="fsa_msg" class="import-message"></div><button type="button" id="fsa_save" class="primary-button">Save</button></div>`);
    setTime('fsa_time', time);
    if (deviceId && devs.some(x => x.id === deviceId)) $('fsa_dev').value = deviceId;
    $(action === 'remove' ? 'fsa_remove' : 'fsa_assess').checked = true;
    const sync = () => { const rem = $('fsa_remove').checked; $('fsa_txtl').textContent = rem ? 'Removal note (reason, catheter tip intact, site care)' : 'Assessment'; $('fsa_text').placeholder = rem ? 'e.g., Removed per order, tip intact, pressure held, dressing applied' : 'e.g., Site clean, dry, intact; no redness or swelling'; };
    $('fsa_assess').addEventListener('change', sync); $('fsa_remove').addEventListener('change', sync); sync();
    $('fsa_save').addEventListener('click', saveDeviceAction);
    dlg.showModal();
  }
  function saveDeviceAction() {
    const msg = $('fsa_msg'), t = readTime('fsa_time', 'fsa_msg'); if (!t) return;
    const err = text => { msg.textContent = text; msg.className = 'import-message error'; };
    const c = canon(), dev = (c.devices || []).find(x => x.id === $('fsa_dev').value); if (!dev) return err('Choose a device.');
    const text = $('fsa_text').value.trim();
    if ($('fsa_remove').checked) {
      if (parseSimDate(dev.placementDate) && ms(t) < ms(dev.placementDate)) return err(`The device was placed at ${epicDate(dev.placementDate)}; it cannot be removed before that.`);
      if (dev.originalStatus === undefined) dev.originalStatus = dev.status;
      dev.removedAt = t; dev.removedNote = text; dev.removedByStudent = true;
    } else {
      if (!text) return err('Enter your assessment.');
      c.observations.push({ id: `student_assessment_dev_${stampDigits(t)}_${uid()}`, type: 'assessment', section: 'Lines / Drains / Airways', code: flowsheetDeviceField(dev).toUpperCase().replace(/[^A-Z0-9]+/g, '_'), label: flowsheetDeviceField(dev), value: text, collected: t, source: 'Student charting', abnormal: false, studentEntered: true });
    }
    $('fsDevActDialog').close(); done();
  }

  // ---- assessment dialog: show the right systems for the flowsheet
  const prevOpen = openFlowsheetChartDialog;
  openFlowsheetChartDialog = function (section, field, time) {
    const sel = $('chartAssessmentSection');
    const forSheet = section ? flowsheetSheetOf(section) : sheet;
    const list = forSheet === 'Pain / Safety' ? PAIN_SAFETY : forSheet === 'Adult Assessment' ? SYSTEMS : SYSTEMS.concat(PAIN_SAFETY);
    const all = section && !list.includes(section) ? list.concat([section]) : list;
    if (sel) sel.innerHTML = all.map(s => `<option>${esc(s)}</option>`).join('');
    const h = document.querySelector('#flowsheetChartDialog h2'); if (h) h.textContent = forSheet === 'Pain / Safety' ? 'Chart pain / safety' : 'Chart adult assessment';
    return prevOpen.call(null, section || all[0], field, time);
  };

  // ---- clicking an empty cell
  const colTime = t => (t === nowCol() ? simulationTime : t);
  function chartCell(rw, time) {
    time = colTime(time);
    if (sheet === 'Vital Signs') return openVitals(time);
    if (sheet === 'Intake / Output') return openIO(time, rw.io, rw.label);
    if (sheet === 'Lines / Drains / Airways') {
      const dev = activeDevices().find(d => flowsheetDeviceField(d) === rw.field || `${flowsheetDeviceField(d)} - drainage` === rw.field);
      if (dev) return openDeviceAction(dev.id, 'assess', time);
      return openDeviceAdd();
    }
    return openFlowsheetChartDialog(rw.section, rw.field, time);
  }
  function chart() {
    if (sheet === 'Vital Signs') return openVitals();
    if (sheet === 'Intake / Output') return openIO();
    if (sheet === 'Lines / Drains / Airways') return openDeviceAdd();
    return openFlowsheetChartDialog('', '', '');
  }

  window.FlowsheetCharting = { render, chart, setSheet, getSheet: () => sheet, openVitals, openIO, openDeviceAdd, openDeviceAction, monitorState, vitalFlag, SITES, DEVICE_TYPES };
})();

/* Flowsheet charting (v61, Epic-style).
   - Template TABS across the top (Vital Signs | Adult Assessment | Pain / Safety | Lines / Drains / Airways | Intake / Output).
   - A "Table of Contents" on the left: search, Hide All / Show All, and one checkbox per row group (remembered per template).
   - Charting happens IN the grid: click a cell and type (numbers) or pick (fixed choices). Enter or leaving the cell files it, Esc cancels.
   - Selecting a cell also opens a RIGHT SIDEBAR with the row, the time, the entry control (dropdown + free text, or number + units,
     BP with live MAP), a Comment, File / Cancel, Value Information, Min/Max and Last Filed Values (24 hours).
     Case-built values are read-only (a comment can still be added).
   - Every student entry is studentEntered:true, so "Reset simulation" removes it and it never mixes with case data.
   - Instructors only: a slim 'Suggested vitals' bar above the Vital Signs grid (the case's vitals for the current time) with a fill button.
   - The current-time column is always present and the grid scrolls to it.
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
  const pad2 = n => String(n).padStart(2, '0');

  const SHEETS = flowsheetSheets;
  const SYSTEMS = ['Neurologic', 'Respiratory', 'Cardiac', 'GI', 'GU', 'Skin', 'Musculoskeletal / Mobility'];
  const PAIN_SAFETY = ['Pain', 'Safety'];
  const SHEET_KEY = 'nursingsim.flowsheet.sheet';
  const HIDDEN_KEY = 'nursingsim.flowsheet.hidden.';
  const INTAKE_TYPES = ['Oral', 'IV fluid', 'IV med', 'Tube feeding', 'Blood', 'Other'];
  const OUTPUT_TYPES = ['Urine', 'Stool', 'Emesis', 'Drain', 'Blood loss', 'Other'];
  const O2_DEVICES = ['Room air', 'Nasal cannula', 'Simple face mask', 'Venturi mask', 'Non-rebreather mask', 'High-flow nasal cannula', 'CPAP / BiPAP', 'Ventilator'];
  const SHORT = { 'Telemetry/ECG monitor': 'Telemetry', 'Pulse oximeter': 'Pulse ox', 'Palpated radial': 'Radial', 'Apical stethoscope': 'Apical', 'Monitor/capnography': 'Monitor', 'Counted manually': 'Manual count', 'Automatic cuff': 'Auto cuff' };
  const TEMP_SOURCES = ['Oral', 'Temporal', 'Axillary', 'Tympanic', 'Rectal', 'Bladder/core'];
  const HR_SOURCES = ['Telemetry/ECG monitor', 'Pulse oximeter', 'Palpated radial', 'Apical stethoscope'];
  const BP_LOCS = ['Left arm', 'Right arm', 'Left leg', 'Right leg', 'Left wrist', 'Right wrist'];
  const BP_METHODS = ['Automatic cuff', 'Manual'];
  const RR_SOURCES = ['Monitor/capnography', 'Counted manually'];
  const DEVICE_STATUS = ['Patent', 'Infusing', 'Saline lock', 'Draining', 'Active', 'In place', 'Secured', 'To suction', 'Clamped'];
  const DEVICE_ASSESS = ['Site clean, dry, intact', 'Dressing clean, dry, intact', 'Flushes without resistance', 'Redness or swelling noted', 'Drainage present', 'Dressing changed'];

  // Vital sign rows: [row label, observation code, entry kind, extra]
  const VSPEC = {
    'Temperature': { code: 'TEMP', kind: 'temp', units: '°F' },
    'Temp Source': { code: 'TEMPSRC', kind: 'choice', opts: TEMP_SOURCES, sub: true },
    'Heart Rate': { code: 'HR', kind: 'num', units: 'bpm', lo: 20, hi: 300 },
    'HR Source': { code: 'HRSRC', kind: 'choice', opts: HR_SOURCES, sub: true },
    'Pulse Rate from SpO2': { code: 'SPO2HR', kind: 'num', units: 'bpm', lo: 20, hi: 300 },
    'Blood Pressure': { code: 'BP', kind: 'bp', units: 'mmHg' },
    'MAP': { kind: 'map', readonly: true, sub: true, units: 'mmHg' },
    'BP Location': { code: 'BPLOC', kind: 'choice', opts: BP_LOCS, sub: true },
    'BP Method': { code: 'BPMETH', kind: 'choice', opts: BP_METHODS, sub: true },
    'Respiratory Rate': { code: 'RR', kind: 'num', units: '/min', lo: 4, hi: 70 },
    'RR Source': { code: 'RRSRC', kind: 'choice', opts: RR_SOURCES, sub: true },
    'SpO2': { code: 'SPO2', kind: 'num', units: '%', lo: 50, hi: 100 },
    'O2 Device': { code: 'O2DEV', kind: 'o2' }
  };
  const VGROUPS = [['Temperature', ['Temperature', 'Temp Source']], ['Heart Rate', ['Heart Rate', 'HR Source', 'Pulse Rate from SpO2']],
    ['Blood Pressure', ['Blood Pressure', 'MAP', 'BP Location', 'BP Method']], ['Respiratory Rate', ['Respiratory Rate', 'RR Source']], ['Oxygen / SpO2', ['SpO2', 'O2 Device']]];

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

  // ------------------------------------------------------------ state
  let sheet = (() => { try { const v = localStorage.getItem(SHEET_KEY); return SHEETS.includes(v) ? v : SHEETS[0]; } catch (e) { return SHEETS[0]; } })();
  const hiddenBySheet = {};
  let query = '';
  let stickRight = true;
  let lastNow = '';
  let sel = null;            // { rowKey, col }
  let draft = null;          // { text, aux, comment, time }
  let initialText = '';
  let editing = false;       // an inline editor is open in the selected cell
  let editToken = 0;
  let addDevMode = false;
  let pendingComment = '';
  let msgText = '';
  const extraCols = new Set();      // columns added with "Add Col" (exact "YYYY-MM-DD HH:mm")
  let view = { rows: new Map(), cells: new Map(), records: [], canonical: null };

  const practice = () => { if (!currentCanonicalCase) return {}; if (!currentCanonicalCase.practice) currentCanonicalCase.practice = { enabled: false }; return currentCanonicalCase.practice; };
  const isInstructor = () => !window.NS_STUDENT;
  const monitorVisible = () => isInstructor();
  const who = () => (window.NSUser ? window.NSUser.label() : (window.NS_STUDENT ? 'Student' : 'Instructor'));
  const canon = () => currentCanonicalCase;
  const bank = () => (window.FlowsheetPractice && window.FlowsheetPractice.BANK) || {};

  function hiddenSet(name) {
    if (!hiddenBySheet[name]) { let arr = []; try { arr = JSON.parse(localStorage.getItem(HIDDEN_KEY + name) || '[]'); } catch (e) { arr = []; } hiddenBySheet[name] = new Set(Array.isArray(arr) ? arr : []); }
    return hiddenBySheet[name];
  }
  function saveHidden(name) { try { localStorage.setItem(HIDDEN_KEY + name, JSON.stringify([...hiddenSet(name)])); } catch (e) { /* remembered only when storage works */ } }
  function rerender() { renderFlowsheetsPage(currentPatientData); }
  function setSheet(name) {
    if (!SHEETS.includes(name)) return;
    sheet = name; stickRight = true; sel = null; draft = null; editing = false; addDevMode = false; query = '';
    try { localStorage.setItem(SHEET_KEY, name); } catch (e) { /* ok */ }
    rerender();
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
  // the monitor's value for one vital row, as { text, aux } ready for an entry control
  function monitorValueFor(spec) {
    const { cur } = monitorState(); if (!cur) return null;
    const v = setValues(cur), num = s => { const m = String(s || '').match(/-?\d+(\.\d+)?/); return m ? m[0] : ''; };
    switch (spec.code) {
      case 'TEMP': return { text: num(valText(v.TEMP)), aux: /°?\s*C\b/.test(valText(v.TEMP)) ? 'C' : 'F' };
      case 'HR': return { text: num(valText(v.HR)) };
      case 'SPO2HR': return { text: num(v.PR) };
      case 'BP': { const m = valText(v.BP).match(/(\d+)\s*\/\s*(\d+)/); return m ? { text: `${m[1]}/${m[2]}` } : null; }
      case 'RR': return { text: num(valText(v.RR)) };
      case 'SPO2': return { text: num(valText(v.SPO2)) };
      case 'TEMPSRC': return v.TEMPSRC ? { text: v.TEMPSRC } : null;
      case 'HRSRC': return v.HRSRC ? { text: v.HRSRC } : null;
      case 'BPLOC': return v.BPLOC ? { text: v.BPLOC } : null;
      case 'BPMETH': return v.BPMETH ? { text: v.BPMETH } : null;
      case 'RRSRC': return v.RRSRC ? { text: v.RRSRC } : null;
      case 'O2DEV': { const o2 = String(v.O2 || ''); if (!o2) return null; const hit = O2_DEVICES.find(d => o2.toLowerCase().includes(d.toLowerCase().split(' ')[0]) && (d !== 'Room air' || /room|\bra\b/i.test(o2))); const fl = o2.match(/(\d+(?:\.\d+)?)\s*l/i); const dev = /room air|\bra\b/i.test(o2) ? 'Room air' : (hit || ''); return dev ? { text: dev, aux: fl && dev !== 'Room air' ? fl[1] : '' } : null; }
    }
    return null;
  }

  // ------------------------------------------------------------ page shell
  function ensureShell() {
    const card = document.querySelector('#flowsheetsSection .flowsheet-card'), main = card && card.querySelector('.flowsheet-main'); if (!main || $('fsSheetBar')) return;
    const layout = card.querySelector('.flowsheet-layout');
    const tabs = document.createElement('div'); tabs.id = 'fsTabs'; tabs.className = 'fs-tabs'; tabs.setAttribute('role', 'tablist');
    const addcol = document.createElement('div'); addcol.id = 'fsAddCol'; addcol.className = 'fs-addcol hidden';
    layout.parentNode.insertBefore(tabs, layout); layout.parentNode.insertBefore(addcol, layout);
    // left: Table of Contents
    const toc = card.querySelector('.flowsheet-sidebar');
    toc.innerHTML = `<div class="flowsheet-sidebar-header"><h2>Table of Contents</h2></div>
      <div class="fs-toc-tools"><input id="fsSearch" type="search" placeholder="Search rows" aria-label="Search rows" autocomplete="off"><div class="fs-toc-links"><a href="#" id="fsHideAll">Hide All</a><a href="#" id="fsShowAll">Show All</a></div></div>
      <div id="flowsheetSectionNav" class="flowsheet-section-nav fs-toc"></div>`;
    $('fsSearch').addEventListener('input', e => { query = e.target.value.trim(); rerenderKeepSearch(); });
    $('fsHideAll').addEventListener('click', e => { e.preventDefault(); const h = hiddenSet(sheet); (view.groups || []).forEach(g => h.add(g.name)); saveHidden(sheet); rerender(); });
    $('fsShowAll').addEventListener('click', e => { e.preventDefault(); hiddenSet(sheet).clear(); saveHidden(sheet); rerender(); });
    // right: sidebar
    const side = card.querySelector('.flowsheet-detail-panel'); side.innerHTML = '<div id="fsSide" class="fs-side"></div>'; side.id = 'fsSidePanel';
    const bar = document.createElement('div'); bar.id = 'fsSheetBar'; bar.className = 'fs-sheetbar';
    const mon = document.createElement('div'); mon.id = 'fsMonitorPanel'; mon.className = 'fs-suggest hidden';
    const io = document.createElement('div'); io.id = 'fsIoTotals'; io.className = 'fs-io-totals hidden';
    const scroll = main.querySelector('.flowsheet-grid-scroll');
    main.insertBefore(bar, scroll); main.insertBefore(mon, scroll); scroll.insertAdjacentElement('afterend', io);
    const btn = $('flowsheetChartBtn'); if (btn) btn.textContent = 'Add Col';
  }
  function rerenderKeepSearch() { rerender(); const s = $('fsSearch'); if (s) { s.focus(); const n = s.value.length; try { s.setSelectionRange(n, n); } catch (e) { /* search inputs */ } } }

  function renderTabs(bySheet) {
    const tabs = $('fsTabs'); clearChildren(tabs);
    SHEETS.forEach(name => {
      const n = bySheet[name].filter(r => !r.practiceHidden).length;
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
      b.className = 'fs-tab' + (name === sheet ? ' active' : ''); b.setAttribute('aria-selected', String(name === sheet));
      b.innerHTML = `${esc(name)} <span class="fs-tab-count">${n}</span>`;
      b.addEventListener('click', () => { if (name !== sheet) { fileIfDirty(); setSheet(name); } });
      tabs.appendChild(b);
    });
  }

  function renderSheetBar() {
    const bar = $('fsSheetBar'); if (!bar) return;
    const hints = {
      'Vital Signs': 'Click a cell and type, or pick from the list. Press Enter to file.',
      'Adult Assessment': 'All body systems. Click a cell to chart it; the sidebar offers common findings.',
      'Pain / Safety': 'Click a cell to chart pain and safety items.',
      'Lines / Drains / Airways': 'One group per device. Click a cell to chart site, status or assessment; use Add line / drain to place a device.',
      'Intake / Output': 'Click a cell and type mL (adds to that hour). Totals update the Summary page too.'
    };
    bar.innerHTML = `<span class="fs-hint">${esc(hints[sheet])}</span><span class="fs-sheetbar-actions"></span>`;
    const acts = bar.querySelector('.fs-sheetbar-actions');
    const add = (text, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls || 'small-tool-button'; b.textContent = text; b.addEventListener('click', fn); acts.appendChild(b); };
    if (sheet === 'Lines / Drains / Airways') add('Add line / drain', () => { fileIfDirty(); sel = null; draft = null; editing = false; addDevMode = true; rerender(); }, 'primary-button compact-primary');
  }

  // ------------------------------------------------------------ monitor panel
  function renderMonitor() {
    const box = $('fsMonitorPanel'); if (!box) return;
    if (sheet !== 'Vital Signs' || !monitorVisible() || !canon()) { box.className = 'fs-suggest hidden'; box.innerHTML = ''; return; }
    box.className = 'fs-suggest';
    const { cur, next } = monitorState();
    const v = cur ? setValues(cur) : null;
    const bits = v ? [['HR', valText(v.HR).replace(/\s*bpm$/i, '')], ['BP', valText(v.BP) + (v.MAP != null ? ` (MAP ${v.MAP})` : '')], ['RR', valText(v.RR).replace(/\s*\/min$/i, '')], ['SpO2', valText(v.SPO2).replace(/\s*%$/, '') + '%'], ['Temp', valText(v.TEMP).replace('°F', 'F')], ['Pain', valText(v.PAIN).replace(/\/10$/, '')]].filter(x => x[1] && x[1] !== '%') : [];
    const nextTxt = next ? `next set ${hhmm(next.time)} (in ${simMinutesBetween(simulationTime, next.time)} min)` : 'no further sets planned';
    box.innerHTML = `<span class="fs-suggest-text"><b>Suggested vitals for ${esc(hhmm(simulationTime))}:</b> ${bits.length ? bits.map(([k, t]) => `${k} ${esc(t)}`).join(' | ') : 'none yet'} <small>(${nextTxt})</small></span><button type="button" class="secondary-button" id="fsFillSug">Fill column with suggested vitals</button>`;
    $('fsFillSug').addEventListener('click', () => { sel = null; fillColumn(); });
  }

  // ------------------------------------------------------------ rows
  const nowCol = () => simulationTime ? simulationTime.slice(0, 13) + ':00' : '';
  const entryTime = col => col === nowCol() ? simulationTime : col;
  function deviceList() {
    const c = view.canonical || canon() || {};
    return [...(c.devices || []).map(d => ({ d, removed: false })), ...(c.removedDevices || []).map(d => ({ d, removed: true }))];
  }
  function buildGroups(records) {
    const groups = [];
    const fieldsIn = section => { const seen = []; records.filter(r => r.section === section).forEach(r => { if (!seen.some(f => norm(f) === norm(r.field))) seen.push(r.field); }); return seen; };
    if (sheet === 'Vital Signs') {
      VGROUPS.forEach(([name, rows]) => groups.push({ name, rows: rows.map(f => ({ section: 'Vital Signs', field: f, label: f, vital: VSPEC[f], kind: VSPEC[f].kind, sub: !!VSPEC[f].sub, readonly: !!VSPEC[f].readonly })) }));
    } else if (sheet === 'Adult Assessment' || sheet === 'Pain / Safety') {
      const base = sheet === 'Adult Assessment' ? SYSTEMS : PAIN_SAFETY;
      const others = [...new Set(records.map(r => r.section))].filter(s => !base.includes(s));
      [...base, ...others].forEach(sec => {
        const have = fieldsIn(sec), list = [];
        Object.keys(bank()[sec] || {}).forEach(k => { const hit = have.find(f => norm(f) === norm(k)); list.push(hit || k); });
        have.forEach(f => { if (!list.some(x => norm(x) === norm(f))) list.push(f); });
        const chipsFor = f => { const b = bank()[sec] || {}, key = Object.keys(b).find(k => norm(k) === norm(f)); return key ? b[key] : []; };
        groups.push({ name: sec, rows: list.map(f => ({ section: sec, field: f, label: f, kind: norm(f) === 'pain score' ? 'painscore' : 'assess', opts: chipsFor(f) })) });
      });
    } else if (sheet === 'Lines / Drains / Airways') {
      deviceList().forEach(({ d, removed }) => {
        const f = flowsheetDeviceField(d), out = records.some(r => r.field === `${f} | Drainage / output`);
        const rows = [['Site', []], ['Status', DEVICE_STATUS], ['Assessment', DEVICE_ASSESS]].concat(out ? [['Drainage / output', []]] : []);
        groups.push({ name: f + (removed ? ' (removed)' : ''), deviceId: d.id, removed, rows: rows.map(([l, opts]) => ({ section: 'Lines / Drains / Airways', field: `${f} | ${l}`, label: l, kind: 'assess', opts, deviceId: d.id, removed })) });
      });
    } else {
      [['Intake', INTAKE_TYPES], ['Output', OUTPUT_TYPES]].forEach(([kind, std]) => {
        const extra = [...new Set(records.filter(r => r.field.startsWith(kind + ':')).map(r => r.field.slice(kind.length + 2)))].filter(l => !std.includes(l)).sort();
        groups.push({ name: kind, rows: [...std, ...extra].map(l => ({ section: 'Intake / Output', field: `${kind}: ${l}`, label: l, kind: 'io', io: kind.toLowerCase(), units: 'mL' })) });
      });
      groups.push({ name: 'Totals', rows: ['Total intake', 'Total output', 'Net balance'].map(l => ({ section: 'Intake / Output', field: l, label: l, kind: 'total', total: l, readonly: true })) });
    }
    groups.forEach(g => g.rows.forEach(r => { r.key = `${r.section}|${r.field}`; r.group = g.name; }));
    return groups;
  }

  const cellRecs = (row, col) => view.records.filter(r => !r.practiceHidden && r.section === row.section && norm(r.field) === norm(row.field) && r.col === col);
  const rowRecs = row => view.records.filter(r => !r.practiceHidden && r.section === row.section && norm(r.field) === norm(row.field));

  // ------------------------------------------------------------ TOC
  function matches(g, row) { if (!query) return true; const q = query.toLowerCase(); return g.name.toLowerCase().includes(q) || (row && row.label.toLowerCase().includes(q)); }
  function renderToc(groups) {
    const nav = $('flowsheetSectionNav'); clearChildren(nav);
    const h = hiddenSet(sheet);
    const shown = groups.filter(g => g.rows.some(r => matches(g, r)));
    if (!shown.length) nav.innerHTML = '<div class="fs-toc-empty">' + (groups.length ? 'No rows match.' : 'Nothing to show yet.') + '</div>';
    shown.forEach(g => {
      const item = document.createElement('div'); item.className = 'fs-toc-item';
      const lab = document.createElement('label'); lab.className = 'fs-toc-check';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !h.has(g.name); cb.setAttribute('aria-label', `Show ${g.name}`);
      cb.addEventListener('change', () => { cb.checked ? h.delete(g.name) : h.add(g.name); saveHidden(sheet); rerender(); });
      lab.appendChild(cb); item.appendChild(lab);
      const a = document.createElement('button'); a.type = 'button'; a.className = 'fs-toc-name'; a.textContent = g.name;
      a.addEventListener('click', () => scrollToGroup(g.name));
      item.appendChild(a); nav.appendChild(item);
    });
    $('flowsheetSectionCount') && ($('flowsheetSectionCount').textContent = '');
  }
  function scrollToGroup(name) {
    const h = hiddenSet(sheet); if (h.has(name)) { h.delete(name); saveHidden(sheet); rerender(); }
    const scroller = document.querySelector('#flowsheetsSection .flowsheet-grid-scroll'), head = $('flowsheetGridHead');
    const tr = [...document.querySelectorAll('#flowsheetGridBody tr.flowsheet-section-row')].find(x => x.dataset.group === name);
    if (scroller && tr) scroller.scrollTo({ top: Math.max(0, tr.offsetTop - (head ? head.offsetHeight : 0)), behavior: 'smooth' });
  }

  // ------------------------------------------------------------ grid
  function renderGrid(records, times, nowKey, groups) {
    const head = $('flowsheetGridHead'), body = $('flowsheetGridBody'), scroller = document.querySelector('#flowsheetsSection .flowsheet-grid-scroll');
    const prevLeft = scroller ? scroller.scrollLeft : 0, prevTop = scroller ? scroller.scrollTop : 0;
    clearChildren(head); clearChildren(body);
    view.rows = new Map(); view.cells = new Map();
    const hr = document.createElement('tr');
    const lab = document.createElement('th'); lab.className = 'flowsheet-label-col'; lab.textContent = sheet === 'Intake / Output' ? 'Intake / output' : sheet === 'Lines / Drains / Airways' ? 'Device' : 'Row'; hr.appendChild(lab);
    times.forEach(t => {
      const th = document.createElement('th'); th.className = 'flowsheet-time-col' + (t === nowKey ? ' fs-now-col' : '') + (sel && sel.col === t ? ' fs-col-sel' : '');
      const st = epicDate(t).split(' '); th.innerHTML = st.length > 1 ? `${esc(st[0])}<br><span class="flowsheet-muted">${esc(st[1])}</span>` : esc(t);
      hr.appendChild(th);
    });
    head.appendChild(hr);
    const live = records.filter(r => !r.practiceHidden), h = hiddenSet(sheet);
    let any = false;
    groups.forEach(g => {
      if (h.has(g.name)) return;
      const rows = g.rows.filter(r => matches(g, r)); if (!rows.length) return;
      any = true;
      const gr = document.createElement('tr'); gr.className = 'flowsheet-section-row'; gr.dataset.group = g.name;
      const gl = document.createElement('td'); gl.className = 'flowsheet-label-col'; gl.textContent = g.name; gr.appendChild(gl);
      const sp = document.createElement('td'); sp.colSpan = times.length; gr.appendChild(sp); body.appendChild(gr);
      rows.forEach(rw => {
        view.rows.set(rw.key, rw);
        const tr = document.createElement('tr'); if (rw.sub) tr.classList.add('fs-subrow'); if (rw.kind === 'total') tr.classList.add('fs-total-row');
        const fc = document.createElement('td'); fc.className = 'flowsheet-label-col flowsheet-field-name' + (sel && sel.rowKey === rw.key ? ' fs-row-sel' : ''); fc.textContent = rw.label; tr.appendChild(fc);
        times.forEach(t => {
          const td = document.createElement('td'); td.className = 'flowsheet-cell' + (t === nowKey ? ' fs-now-col' : '');
          const recs = rw.kind === 'total' ? [] : cellRecs(rw, t);
          fillCell(td, rw, t, recs, live);
          if (sel && sel.rowKey === rw.key && sel.col === t) td.classList.add('selected');
          td.addEventListener('click', () => selectCell(rw.key, t));
          view.cells.set(`${rw.key}@@${t}`, td); tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    });
    if (!any) { const tr = document.createElement('tr'); tr.innerHTML = `<td class="empty-cell" colspan="${times.length + 1}">${groups.length ? 'No rows shown. Use the Table of Contents to show a group.' : (sheet === 'Lines / Drains / Airways' ? 'No lines, drains or airways yet. Use Add line / drain to place one.' : 'Nothing to show.')}</td>`; body.appendChild(tr); }
    if (scroller) {
      if (scroller.clientWidth > 0) { scroller.scrollLeft = stickRight ? scroller.scrollWidth : prevLeft; stickRight = false; }   // while the page is hidden there is nothing to scroll yet
      scroller.scrollTop = prevTop;
    }
  }
  function fillCell(td, rw, t, recs, live) {
    if (rw.kind === 'total') {
      const inCol = live.filter(r => r.col === t && r.ioKind);
      if (!inCol.length) { td.classList.add('empty-cell-value'); return; }
      const inn = inCol.filter(r => r.ioKind === 'intake').reduce((s, r) => s + r.ml, 0), outt = inCol.filter(r => r.ioKind === 'output').reduce((s, r) => s + r.ml, 0);
      td.textContent = rw.total === 'Total intake' ? `${inn}` : rw.total === 'Total output' ? `${outt}` : `${inn - outt >= 0 ? '+' : ''}${inn - outt}`; return;
    }
    if (!recs.length) { td.classList.add('empty-cell-value'); return; }
    const last = recs[recs.length - 1];
    if (rw.kind === 'io') { td.textContent = String(recs.reduce((s, r) => s + r.ml, 0)); }
    else td.textContent = rw.sub ? (SHORT[last.value] || last.value) : safe(last.value);
    if (last.abnormal) td.classList.add('flowsheet-abnormal');
    if (recs.some(r => r.studentEntered)) td.classList.add('fs-student');
    const cm = recs.map(r => r.comment).filter(Boolean);
    if (cm.length) { td.classList.add('fs-has-comment'); td.title = 'Comment: ' + cm.join(' | '); }
    else if (recs.length > 1) td.title = recs.map(r => `${epicDate(r.collected)}  ${r.value}`).join('\n');
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
    const stop = new Date(start.getTime() + 12 * 3600000), f = formatSimDate, day12 = start.getHours() === 7;
    return { key: f(start), label: `${day12 ? 'Day' : 'Night'} shift ${epicDate(f(start)).slice(0, 5)} ${pad2(start.getHours())}00 to ${epicDate(f(stop)).slice(0, 5)} ${pad2(stop.getHours())}00` };
  }
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
    view.canonical = canonical;
    const all = buildFlowsheetRecords(canonical);
    // columns added with "Add Col" take the values filed at exactly that minute
    all.forEach(r => { const k = String(r.collected).slice(0, 16); if (extraCols.has(k)) r.col = k; });
    const bySheet = {}; SHEETS.forEach(s => { bySheet[s] = []; });
    all.forEach(r => bySheet[flowsheetSheetOf(r.section)].push(r));
    const records = bySheet[sheet]; view.records = records;
    const doc = Array.from(new Set(records.filter(r => !r.practiceHidden).map(r => safe(r.col || r.collected)).filter(Boolean))).sort();
    const nk = nowCol(); if (nk !== lastNow) { lastNow = nk; stickRight = true; }
    const set = new Set(flowsheetLatestOnlyMode && doc.length ? [doc[doc.length - 1]] : doc);
    if (nk) set.add(nk);
    extraCols.forEach(k => { if (!flowsheetLatestOnlyMode) set.add(k); });
    if (sel && sel.col) set.add(sel.col);
    const times = [...set].sort();
    $('flowsheetStatus').textContent = `${all.filter(r => !r.practiceHidden).length} documented values | ${SHEETS.length} flowsheets`;
    $('flowsheetDateLabel').textContent = canonical.encounter?.admitDate ? epicDate(canonical.encounter.admitDate) : 'Current encounter';
    $('flowsheetFooterMeta').textContent = doc.length ? `${doc.length} documentation time(s)` : 'No documentation times';
    $('flowsheetLatestOnly').classList.toggle('active', flowsheetLatestOnlyMode);
    const groups = buildGroups(records); view.groups = groups;
    renderTabs(bySheet); renderToc(groups); renderSheetBar(); renderMonitor();
    renderGrid(records, times, nk, groups);
    renderIoTotals(canonical);
    if (sel && !view.rows.has(sel.rowKey)) { sel = null; draft = null; editing = false; }
    if (sel && !draft) resetDraft();
    renderSide();
    if (sel && editing) startInline(false);
  }

  // ------------------------------------------------------------ selecting and inline entry
  const canEdit = (row, recs) => !row.readonly && row.kind !== 'total' && !row.removed && (row.kind === 'io' || recs.every(r => r.studentEntered));
  function initialDraft(row, recs) {
    const last = recs[recs.length - 1], d = { text: '', aux: '', comment: last && last.studentEntered ? safe(last.comment, '') : '', time: '' };
    if (last && last.studentEntered && row.kind !== 'io') {
      const v = String(last.value);
      if (row.kind === 'temp') { const m = v.match(/(-?\d+(\.\d+)?)\s*°?\s*([CF])?/); d.text = m ? m[1] : ''; d.aux = m && m[3] ? m[3] : ''; }
      else if (row.kind === 'num' || row.kind === 'painscore') d.text = (v.match(/-?\d+(\.\d+)?/) || [''])[0];
      else if (row.kind === 'o2') { const dev = O2_DEVICES.find(x => v.startsWith(x)); d.text = dev || v; const fl = v.match(/(\d+(?:\.\d+)?)\s*L\/min/); d.aux = fl ? fl[1] : ''; }
      else d.text = v;
    }
    return d;
  }
  function resetDraft() {
    const row = selRow(); if (!row) return;
    draft = initialDraft(row, cellRecs(row, sel.col)); draft.origComment = draft.comment; initialText = draft.text;
  }
  function draftDirty() { return !!draft && (draft.text !== initialText || (draft.comment && draft.comment !== (draft.origComment || ''))); }
  function fileIfDirty() { if (sel && editing && draft && draft.text !== initialText && draft.text !== '') return fileSel(); return null; }
  function selectCell(rowKey, col) {
    if (sel && sel.rowKey === rowKey && sel.col === col && !addDevMode) { if (!editing) { const row = view.rows.get(rowKey); if (row && canEdit(row, cellRecs(row, col))) { if (!draft) resetDraft(); editing = true; startInline(true); } } return; }
    if (sel && editing && draft && draft.text !== initialText && draft.text !== '') { const err = fileSel(true); if (err) return; }
    const row = view.rows.get(rowKey); if (!row) return;
    const recs = cellRecs(row, col);
    sel = { rowKey, col }; addDevMode = false; msgText = '';
    draft = initialDraft(row, recs); draft.origComment = draft.comment; initialText = draft.text;
    editing = canEdit(row, recs);
    rerender();
  }
  function closeSide() { sel = null; draft = null; editing = false; addDevMode = false; rerender(); }

  function startInline(focus) {
    if (!sel) return;
    const row = view.rows.get(sel.rowKey), td = view.cells.get(`${sel.rowKey}@@${sel.col}`); if (!row || !td || !editing) return;
    let el;
    if (row.kind === 'choice' || row.kind === 'o2') {
      el = document.createElement('select'); el.innerHTML = '<option value=""></option>' + (row.vital.opts || O2_DEVICES).map(o => `<option>${esc(o)}</option>`).join('');
      el.value = draft.text;
    } else {
      el = document.createElement('input');
      const numeric = ['temp', 'num', 'painscore', 'io'].includes(row.kind);
      el.type = numeric ? 'number' : 'text'; if (numeric) { el.step = 'any'; el.inputMode = row.kind === 'temp' ? 'decimal' : 'numeric'; }
      el.value = draft.text; el.placeholder = row.kind === 'io' ? '+ mL' : row.kind === 'bp' ? '120/80' : '';
      if (row.kind === 'assess' && row.opts.length) { let dl = $('fsInlineList'); if (!dl) { dl = document.createElement('datalist'); dl.id = 'fsInlineList'; document.body.appendChild(dl); } dl.innerHTML = row.opts.map(o => `<option value="${esc(o)}"></option>`).join(''); el.setAttribute('list', 'fsInlineList'); }
    }
    el.className = 'fs-inline'; el.setAttribute('aria-label', row.label);
    td.textContent = ''; td.classList.add('fs-editing'); td.appendChild(el);
    const tok = ++editToken;
    el.addEventListener('input', () => { if (!draft) return; draft.text = el.value; writeSide(); });
    el.addEventListener('change', () => { if (!draft) return; draft.text = el.value; writeSide(); if (el.tagName === 'SELECT') setTimeout(() => { if (tok === editToken && el.value) fileSel(); }, 0); });
    el.addEventListener('keydown', e => {
      if (!draft) return;
      if (e.key === 'Enter') { e.preventDefault(); draft.text = el.value; fileSel(); }
      else if (e.key === 'Escape') { e.preventDefault(); draft.text = initialText; editing = false; editToken++; rerender(); }
    });
    el.addEventListener('blur', e => {
      const rt = e.relatedTarget; if (rt && rt.closest && rt.closest('#fsSidePanel')) return;
      setTimeout(() => {
        if (tok !== editToken || !editing || !draft) return;
        const ae = document.activeElement; if (ae && ae.closest && ae.closest('#fsSidePanel')) return;
        draft.text = el.value;
        if (draft.text !== initialText && draft.text !== '') fileSel(); else { editing = false; editToken++; rerender(); }
      }, 300);
    });
    if (focus !== false) { el.focus(); if (el.select && el.type !== 'number') { try { el.select(); } catch (e2) { /* ok */ } } }
    else el.focus();
  }

  // ------------------------------------------------------------ filing
  function selRow() { return sel ? view.rows.get(sel.rowKey) : null; }
  function selTime() { return fromLocal(draft && draft.time) || entryTime(sel.col); }
  function checkTime(t) {
    if (!parseSimDate(t)) return 'Choose a valid time.';
    if (ms(t) > ms(simulationTime)) return `That time is later than the patient's current time (${epicDate(simulationTime)}). Chart a time at or before now.`;
    return '';
  }
  // returns an error text, or '' when filed
  function fileSel(silent) {
    const row = selRow(); if (!row || !draft) return '';
    const recs = cellRecs(row, sel.col), t = selTime();
    const d = draft, text = String(d.text || '').trim(), comment = String(d.comment || '').trim();
    const fail = m => { msgText = m; renderSide(); if (editing) startInline(false); return m; };
    const textChanged = text !== initialText && text !== '';
    if (!textChanged || !canEdit(row, recs)) {
      // comment only (also the way to comment on case-built values)
      if (comment && comment !== (d.origComment || '') && recs.length && row.kind !== 'io') { fileComment(recs[recs.length - 1], comment); editing = false; editToken++; msgText = ''; refreshSimulationView(); return ''; }
      if (!textChanged) { editing = false; editToken++; rerender(); return ''; }
      return fail('This value is read-only.');
    }
    const te = checkTime(t); if (te) return fail(te);
    let err = '';
    const wasEditing = editing; editing = false; editToken++;   // so a refresh during filing does not reopen the editor
    if (row.vital) err = fileVital(row, recs, t, d);
    else if (row.kind === 'io') err = fileIo(row, t, d);
    else if (row.kind === 'painscore') { const v = parseFloat(text); err = v >= 0 && v <= 10 ? fileAssessment(row, t, String(Math.round(v)), comment) : 'Pain should be between 0 and 10.'; }
    else err = fileAssessment(row, t, text, comment);
    if (err) { editing = wasEditing; return fail(err); }
    msgText = ''; draft = null;
    if (row.kind !== 'assess' && row.kind !== 'painscore') refreshSimulationView();
    return '';
  }
  function buildVital(row, d) {
    const spec = row.vital, text = String(d.text || '').trim(), num = parseFloat(text);
    switch (spec.kind) {
      case 'temp': { if (!(num > 0)) return { error: 'Enter the temperature.' }; const unit = d.aux || (num <= 45 ? 'C' : 'F'), f = unit === 'C' ? num * 9 / 5 + 32 : num; if (f < 85 || f > 110) return { error: 'Temperature looks out of range for the unit chosen.' }; return { v: ['TEMP', 'Temperature', `${num.toFixed(1)} °${unit}`, '', vitalFlag('TEMP', f)] }; }
      case 'num': { if (!(num >= spec.lo && num <= spec.hi)) return { error: `${row.label} should be between ${spec.lo} and ${spec.hi}.` }; const fc = spec.code === 'SPO2HR' ? 'HR' : spec.code; return { v: [spec.code, row.label, String(Math.round(num)), spec.code === 'SPO2' ? '%' : spec.code === 'RR' ? '/min' : 'bpm', vitalFlag(fc, num)] }; }
      case 'bp': { const m = text.match(/^(\d{2,3})\s*\/\s*(\d{2,3})$/); if (!m) return { error: 'Enter the blood pressure as systolic/diastolic, for example 120/80.' }; const s = +m[1], dd = +m[2]; if (s < 40 || s > 300 || dd < 20 || dd > 200) return { error: 'Blood pressure looks out of range.' }; if (s <= dd) return { error: 'Systolic pressure should be higher than diastolic.' }; return { v: ['BP', 'Blood Pressure', `${s}/${dd}`, '', vitalFlag('SBP', s)] }; }
      case 'choice': return text ? { v: [spec.code, row.label, text, '', false] } : { error: 'Choose a value.' };
      case 'o2': { if (!text) return { error: 'Choose an O2 device.' }; const fl = String(d.aux || '').trim(); return { v: ['O2DEV', 'O2 Device', text + (fl && text !== 'Room air' ? ` ${fl} L/min` : ''), '', false] }; }
    }
    return { error: 'This row cannot be charted.' };
  }
  function pushVital(v, t, comment, tag) {
    const [code, label, value, units, abn] = v;
    canon().observations.push({ id: `student_vital_${code.toLowerCase()}_${tag}`, type: 'vital', code, label, value, units, flag: abn ? 'Abnormal' : '', collected: t, source: 'Student charting', comment: comment || undefined, enteredBy: who(), studentEntered: true });
  }
  function dropStudent(recs) {
    const ids = new Set(recs.filter(r => r.studentEntered && r.src === 'obs').map(r => r.cloneOf || r.id));
    if (ids.size) canon().observations = canon().observations.filter(o => !ids.has(o.id));
  }
  function fileVital(row, recs, t, d) {
    const b = buildVital(row, d); if (b.error) return b.error;
    dropStudent(recs);
    pushVital(b.v, t, String(d.comment || '').trim(), stampDigits(t) + '_' + uid());
    return '';
  }
  function fileIo(row, t, d) {
    const ml = Math.round(parseFloat(d.text));
    if (!(ml > 0) || ml > 10000) return 'Enter an amount between 1 and 10,000 mL.';
    const c = canon(), kind = row.io, type = row.label;
    if (!Array.isArray(c.ioEvents)) c.ioEvents = [];
    const detail = { po: 0, iv: 0, urine: 0, other: 0, otherLabel: '' };
    if (kind === 'intake') { if (type === 'Oral') detail.po = ml; else if (/^IV/.test(type)) detail.iv = ml; else { detail.otherIntake = ml; detail.otherIntakeLabel = type; } }
    else if (type === 'Urine') detail.urine = ml; else { detail.other = ml; detail.otherLabel = type; }
    c.ioEvents.push({ id: `io_student_${stampDigits(t)}_${kind}_${uid()}`, date: t.slice(0, 10), time: t.slice(11, 13) + t.slice(14, 16), collected: t, intake: kind === 'intake' ? ml : 0, output: kind === 'output' ? ml : 0, detail, ioKind: kind, ioType: type, comment: String(d.comment || '').trim() || undefined, enteredBy: who(), studentEntered: true });
    return '';
  }
  // assessments go through the existing save routine so practice-mode feedback still works
  function fileAssessment(row, t, value, comment) {
    const c = canon(), sec = $('chartAssessmentSection');
    sec.innerHTML = `<option>${esc(row.section)}</option>`; sec.value = row.section;
    $('chartAssessmentField').value = row.field; $('chartAssessmentValue').value = value; $('chartAssessmentTime').value = toLocal(t);
    $('chartAssessmentAbnormal').checked = !!(window.FlowsheetPractice && row.section !== 'Lines / Drains / Airways' && window.FlowsheetPractice.isAbn(window.FlowsheetPractice.tagsOf(value)));
    $('chartAssessmentMessage').textContent = '';
    const before = c.observations.length; pendingComment = comment || '';
    currentFlowsheetSelection = null;
    saveFlowsheetAssessment();
    pendingComment = '';
    return c.observations.length > before ? '' : ($('chartAssessmentMessage').textContent || 'Could not file this entry.');
  }
  function findSource(rec) {
    const c = canon();
    if (rec.src === 'obs') return (c.observations || []).find(o => o.id === (rec.cloneOf || rec.id));
    if (rec.src === 'io') return (c.ioEvents || []).find(e => e.id === rec.ioId);
    if (rec.src === 'device' || rec.src === 'deviceRemoval') return (c.devices || []).find(d => d.id === rec.deviceId);
    return null;
  }
  function fileComment(rec, text) {
    const c = canon(), src = rec.studentEntered ? findSource(rec) : null;
    if (src) { src.comment = text; src.commentBy = who(); return; }
    if (!Array.isArray(c.flowsheetComments)) c.flowsheetComments = [];
    const key = rec.cloneOf || rec.id;
    c.flowsheetComments = c.flowsheetComments.filter(x => x.recordId !== key);
    c.flowsheetComments.push({ id: `fscomment_${uid()}`, recordId: key, comment: text, collected: simulationTime, enteredBy: who(), studentEntered: true });
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
    editing = false; editToken++; draft = null;
    refreshSimulationView();
  }
  function fillColumn() {
    const col = sel ? sel.col : nowCol(), t = col === nowCol() ? simulationTime : col, te = checkTime(t);
    if (te) { alert(te); return; }
    if (!monitorState().cur) { alert('The monitor has no reading yet.'); return; }
    const tag = stampDigits(t) + '_' + uid(); let n = 0;
    Object.keys(VSPEC).forEach(label => {
      const spec = VSPEC[label]; if (!spec.code) return;
      const mv = monitorValueFor(spec); if (!mv || !mv.text) return;
      const row = { vital: spec, label, kind: spec.kind };
      const b = buildVital(row, { text: mv.text, aux: mv.aux || '' }); if (b.error) return;
      dropStudent(cellRecs({ section: 'Vital Signs', field: label }, col));
      pushVital(b.v, t, '', tag); n++;
    });
    if (n) refreshSimulationView();
  }

  // ------------------------------------------------------------ sidebar
  const unitsOf = row => row.vital ? (row.vital.kind === 'temp' ? '' : (row.vital.units || '')) : (row.units || (row.kind === 'painscore' ? '/10' : ''));
  function controlsHtml(row, dis) {
    const d = dis ? ' disabled' : '';
    const sel2 = (id, list, withBlank) => `<select id="${id}"${d}>${withBlank ? '<option value=""></option>' : ''}${list.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
    switch (row.kind) {
      case 'temp': return `<div class="fs-ctl"><input id="fsS_text" type="number" step="0.1" inputmode="decimal"${d}><select id="fsS_aux"${d}><option value="">auto</option><option>F</option><option>C</option></select></div>`;
      case 'num': case 'painscore': case 'io': return `<div class="fs-ctl"><input id="fsS_text" type="number" step="any" inputmode="numeric"${d} placeholder="${row.kind === 'io' ? 'mL to add' : ''}"><span class="fs-units">${esc(unitsOf(row))}</span></div>`;
      case 'bp': return `<div class="fs-ctl"><input id="fsS_sbp" type="number" inputmode="numeric" placeholder="SBP"${d}><b>/</b><input id="fsS_dbp" type="number" inputmode="numeric" placeholder="DBP"${d}><span class="fs-units">mmHg</span></div><div class="fs-map-line">MAP <output id="fsS_map">--</output></div>`;
      case 'choice': return `<div class="fs-ctl">${sel2('fsS_sel', row.vital.opts, true)}</div>`;
      case 'o2': return `<div class="fs-ctl">${sel2('fsS_sel', O2_DEVICES, true)}</div><div class="fs-ctl"><input id="fsS_aux" type="number" step="0.5" inputmode="decimal" placeholder="Flow (L/min)"${d}><span class="fs-units">L/min</span></div>`;
      case 'assess': return `${row.opts.length ? `<div class="fs-ctl">${sel2('fsS_sel', row.opts.concat(['Other (type below)']), true)}</div>` : ''}<div class="fs-ctl"><input id="fsS_text" type="text" placeholder="Type a finding"${d}></div>`;
    }
    return '';
  }
  function writeSide() {
    if (!draft) return;
    const set = (id, v) => { const el = $(id); if (el && document.activeElement !== el) el.value = v; };
    set('fsS_text', draft.text); set('fsS_aux', draft.aux || '');
    const sel3 = $('fsS_sel'); if (sel3 && document.activeElement !== sel3) { const has = [...sel3.options].some(o => o.value === draft.text || o.text === draft.text); sel3.value = has ? draft.text : (draft.text ? 'Other (type below)' : ''); }
    const row = selRow();
    if (row && row.kind === 'bp') { const m = String(draft.text).match(/^(\d*)\s*\/?\s*(\d*)$/); if (m) { set('fsS_sbp', m[1]); set('fsS_dbp', m[2]); } const mp = flowsheetMapOf(draft.text); const o = $('fsS_map'); if (o) o.textContent = mp != null ? `${mp} mmHg` : '--'; }
    const fi = document.querySelector('#flowsheetGridBody .fs-inline'); if (fi && document.activeElement !== fi) fi.value = draft.text;
  }
  function bindSide(row) {
    const upd = () => { const f = document.querySelector('#flowsheetGridBody .fs-inline'); if (f && document.activeElement !== f) f.value = draft.text; };
    const t = $('fsS_text'); if (t) t.addEventListener('input', () => { if (!draft) return; draft.text = t.value; if (row.kind === 'assess') { const s = $('fsS_sel'); if (s) { const has = [...s.options].some(o => o.value === t.value); s.value = has ? t.value : (t.value ? 'Other (type below)' : ''); } } upd(); });
    const a = $('fsS_aux'); if (a) { const setAux = () => { if (draft) draft.aux = a.value; }; a.addEventListener('input', setAux); a.addEventListener('change', setAux); }
    const s = $('fsS_sel'); if (s) s.addEventListener('change', () => { if (!draft) return; if (s.value === 'Other (type below)') { draft.text = ''; const tx = $('fsS_text'); if (tx) { tx.value = ''; tx.focus(); } } else { draft.text = s.value; const tx = $('fsS_text'); if (tx) tx.value = s.value; } upd(); });
    if (row.kind === 'bp') {
      const sb = $('fsS_sbp'), db = $('fsS_dbp'), map = $('fsS_map');
      const f = () => { if (!draft) return; draft.text = sb.value || db.value ? `${sb.value}/${db.value}` : ''; const mp = flowsheetMapOf(draft.text); map.textContent = mp != null ? `${mp} mmHg` : '--'; upd(); };
      sb.addEventListener('input', f); db.addEventListener('input', f);
    }
    const cm = $('fsS_comment'); if (cm) cm.addEventListener('input', () => { if (draft) draft.comment = cm.value; });
  }
  const sourceOf = r => r.studentEntered ? 'Student charting' : 'Case data';
  function renderSide() {
    const side = $('fsSide'), layout = document.querySelector('#flowsheetsSection .flowsheet-layout'); if (!side || !layout) return;
    if (addDevMode) { layout.classList.add('fs-side-open'); renderAddDevice(side); return; }
    if (!sel) { layout.classList.remove('fs-side-open'); side.innerHTML = ''; return; }
    const row = selRow(); if (!row) { layout.classList.remove('fs-side-open'); side.innerHTML = ''; return; }
    layout.classList.add('fs-side-open');
    const recs = cellRecs(row, sel.col), last = recs[recs.length - 1], edit = canEdit(row, recs), t = draft && draft.time ? draft.time : toLocal(entryTime(sel.col));
    const dev = row.deviceId ? activeDeviceById(row.deviceId) : null;
    const hist = rowRecs(row).filter(r => { const tm = ms(r.collected); return isFinite(tm) ? (tm <= ms(entryTime(sel.col)) + 59000 && tm >= ms(entryTime(sel.col)) - 24 * 3600000) : false; }).sort((a, b) => String(b.collected).localeCompare(String(a.collected))).slice(0, 12);
    const nums = hist.map(r => parseFloat(String(r.value))).filter(x => isFinite(x));
    const monBtn = row.vital && row.vital.code && monitorVisible() && edit ? '<button type="button" class="secondary-button" id="fsS_fill">Use suggested value</button>' : '';
    const readOnlyNote = row.kind === 'total' || row.readonly ? 'Calculated automatically.' : (!edit ? (row.removed ? 'This device has been removed.' : 'Case data is read-only. You can add a comment.') : '');
    const canComment = row.kind !== 'total' && !row.readonly;
    side.innerHTML = `<div class="fs-side-head"><div><b>${esc(row.label)}</b><span>${esc(row.group)} &middot; ${esc(epicDate(entryTime(sel.col)))}</span></div><button type="button" class="icon-button" id="fsS_close" aria-label="Close sidebar">×</button></div>
      <div class="fs-side-body">
        ${readOnlyNote ? `<div class="fs-side-note">${esc(readOnlyNote)}</div>` : ''}
        ${edit ? `<label class="fs-side-label">Value${unitsOf(row) && row.kind !== 'bp' ? ` (${esc(unitsOf(row))})` : ''}</label>${controlsHtml(row, false)}<label class="fs-side-label">Time</label><div class="fs-ctl"><input id="fsS_time" type="datetime-local" step="60" value="${esc(t)}" max="${esc(toLocal(simulationTime))}"><button type="button" class="secondary-button" id="fsS_now">Now</button></div>`  : ''}
        ${canComment ? `<label class="fs-side-label" for="fsS_comment">Comment</label><textarea id="fsS_comment" rows="2" placeholder="Add a comment">${esc(draft ? draft.comment : '')}</textarea>` : ''}
        ${canComment ? `<div class="fs-side-actions"><button type="button" class="primary-button" id="fsS_file">${edit ? 'File' : 'File comment'}</button>${monBtn}<button type="button" class="secondary-button" id="fsS_cancel">Cancel</button></div>` : ''}
        <div id="fsS_msg" class="import-message ${msgText ? 'error' : ''}">${esc(msgText)}</div>
        <h4 class="fs-side-h">Value Information</h4>
        ${last ? `<dl class="fs-info"><dt>Value</dt><dd class="${last.abnormal ? 'flowsheet-abnormal' : ''}">${esc(last.value)}</dd><dt>Collected</dt><dd>${esc(safe(last.collected))}</dd><dt>Source</dt><dd>${esc(sourceOf(last))}${last.derived ? ' (default)' : ''}</dd><dt>Recorded by</dt><dd>${last.studentEntered ? esc(last.enteredBy || 'Student') : 'Case record'}</dd>${last.comment ? `<dt>Comment</dt><dd>${esc(last.comment)}</dd>` : ''}${last.details && row.section !== 'Intake / Output' ? `<dt>Detail</dt><dd>${esc(last.details)}</dd>` : ''}</dl>` : '<div class="fs-side-empty">No value filed for this time.</div>'}
        ${recs.filter(r => r.studentEntered).map((r, i) => `<div class="fs-entry-line">${esc(epicDate(r.collected))} <b>${esc(r.value)}</b> <button type="button" class="secondary-button fs-del" data-i="${i}">${r.src === 'deviceRemoval' ? 'Undo removal' : 'Delete'}</button></div>`).join('')}
        ${nums.length >= 1 && row.kind !== 'io' ? `<h4 class="fs-side-h">Min / Max (24 hours)</h4><dl class="fs-info"><dt>Min</dt><dd>${Math.min(...nums)}</dd><dt>Max</dt><dd>${Math.max(...nums)}</dd></dl>` : ''}
        <h4 class="fs-side-h">Last Filed Values (24 hours)</h4>
        ${hist.length ? `<ul class="fs-hist">${hist.map(r => `<li><b class="${r.abnormal ? 'flowsheet-abnormal' : ''}">${esc(r.value)}</b><span>${esc(epicDate(r.collected))} &middot; ${esc(sourceOf(r))}</span></li>`).join('')}</ul>` : '<div class="fs-side-empty">None in the last 24 hours.</div>'}
        ${dev ? `<h4 class="fs-side-h">Remove / discontinue device</h4><div class="fs-ctl"><input id="fsR_time" type="datetime-local" step="60" value="${esc(toLocal(simulationTime))}" max="${esc(toLocal(simulationTime))}"></div><div class="fs-ctl"><input id="fsR_note" type="text" placeholder="Removal note (tip intact, site care)"></div><div class="fs-side-actions"><button type="button" class="secondary-button" id="fsR_go">Remove device</button></div>` : ''}
      </div>`;
    if (edit) { writeSide(); bindSide(row); const tm = $('fsS_time'); if (tm) tm.addEventListener('change', () => { if (draft) draft.time = tm.value; }); const nw = $('fsS_now'); if (nw) nw.addEventListener('click', () => { tm.value = toLocal(simulationTime); if (draft) draft.time = tm.value; }); }
    else { const cm = $('fsS_comment'); if (cm) cm.addEventListener('input', () => { if (draft) draft.comment = cm.value; }); }
    $('fsS_close').addEventListener('click', closeSide);
    const fb = $('fsS_file'); if (fb) fb.addEventListener('click', () => { if (editing || edit) { const ae = document.querySelector('#flowsheetGridBody .fs-inline'); if (ae && draft) draft.text = draft.text || ae.value; } fileSel(); });
    const cb = $('fsS_cancel'); if (cb) cb.addEventListener('click', () => { editing = false; editToken++; draft = null; sel = null; rerender(); });
    const fl = $('fsS_fill'); if (fl) fl.addEventListener('click', () => { const mv = monitorValueFor(row.vital); if (!mv) { msgText = 'The monitor has no reading for this row.'; renderSide(); return; } draft.text = mv.text; if (mv.aux !== undefined) draft.aux = mv.aux; writeSide(); const f = document.querySelector('#flowsheetGridBody .fs-inline'); if (f) f.value = draft.text; msgText = ''; });
    side.querySelectorAll('.fs-del').forEach(b => b.addEventListener('click', () => deleteEntry(recs.filter(r => r.studentEntered)[+b.dataset.i])));
    const rg = $('fsR_go'); if (rg) rg.addEventListener('click', () => removeDevice(dev));
  }
  const activeDeviceById = id => (view.canonical && (view.canonical.devices || []).find(d => d.id === id)) || null;
  function removeDevice(dev) {
    const t = fromLocal($('fsR_time').value), msg = $('fsR_msg') || $('fsS_msg');
    const err = m => { msgText = m; renderSide(); };
    const te = checkTime(t); if (te) return err(te);
    const c = canon(), real = (c.devices || []).find(x => x.id === dev.id); if (!real) return err('Device not found.');
    if (parseSimDate(real.placementDate) && ms(t) < ms(real.placementDate)) return err(`The device was placed at ${epicDate(real.placementDate)}; it cannot be removed before that.`);
    if (real.originalStatus === undefined) real.originalStatus = real.status;
    real.removedAt = t; real.removedNote = $('fsR_note').value.trim(); real.removedByStudent = true; real.removedBy = who();
    sel = null; draft = null; editing = false; msgText = '';
    refreshSimulationView();
  }

  // ---- Add line / drain (sidebar form)
  const optsHtml = (list, sel2) => list.map(x => `<option${x === sel2 ? ' selected' : ''}>${esc(x)}</option>`).join('');
  function renderAddDevice(side) {
    const first = DEVICE_TYPES[0];
    side.innerHTML = `<div class="fs-side-head"><div><b>Add line / drain</b><span>Appears on the Avatar at the site you choose</span></div><button type="button" class="icon-button" id="fsD_close" aria-label="Close sidebar">×</button></div>
      <div class="fs-side-body">
        <label class="fs-side-label">Device type</label><div class="fs-ctl"><select id="fsd_type">${DEVICE_TYPES.map(d => `<option>${esc(d[0])}</option>`).join('')}</select></div>
        <div id="fsd_otherwrap" class="fs-ctl hidden"><input id="fsd_other" type="text" placeholder="Device name"></div>
        <label class="fs-side-label">Location (Avatar site)</label><div class="fs-ctl"><select id="fsd_site">${SITES.map(s => `<option value="${s[0]}"${s[0] === first[2] ? ' selected' : ''}>${esc(s[1])}</option>`).join('')}</select></div>
        <label class="fs-side-label">Gauge / size</label><div class="fs-ctl"><input id="fsd_size" type="text" list="fsd_sizes" placeholder="e.g., 20 gauge"><datalist id="fsd_sizes"></datalist></div>
        <label class="fs-side-label">Date / time placed</label><div class="fs-ctl"><input id="fsd_time" type="datetime-local" step="60" value="${esc(toLocal(simulationTime))}" max="${esc(toLocal(simulationTime))}"><button type="button" class="secondary-button" id="fsd_now">Now</button></div>
        <label class="fs-side-label">Status</label><div class="fs-ctl"><input id="fsd_status" type="text" value="${esc(first[4])}"></div>
        <label class="fs-side-label" id="fsd_infl">Infusing (optional)</label><div class="fs-ctl"><input id="fsd_inf" type="text" placeholder="e.g., 0.9% NS at 75 mL/hr"></div>
        <label class="fs-side-label">Assessment</label><div class="fs-ctl"><input id="fsd_assess" type="text" placeholder="e.g., Site clean, dry, intact"></div>
        <div class="fs-side-actions"><button type="button" class="primary-button" id="fsd_save">Add device</button><button type="button" class="secondary-button" id="fsd_cancel">Cancel</button></div>
        <div id="fsd_msg" class="import-message"></div>
      </div>`;
    const sync = () => {
      const d = DEVICE_TYPES.find(x => x[0] === $('fsd_type').value) || DEVICE_TYPES[0];
      $('fsd_site').value = d[2]; $('fsd_status').value = d[4];
      $('fsd_sizes').innerHTML = d[3].map(x => `<option value="${esc(x)}"></option>`).join(''); $('fsd_size').placeholder = d[3][0] ? `e.g., ${d[3][0]}` : 'size (optional)';
      $('fsd_otherwrap').classList.toggle('hidden', d[0] !== 'Other device');
      $('fsd_infl').textContent = d[1] === 'IV' ? 'Infusing (optional)' : 'Drainage / output (optional)';
    };
    $('fsd_type').addEventListener('change', sync); sync();
    $('fsd_now').addEventListener('click', () => { $('fsd_time').value = toLocal(simulationTime); });
    $('fsD_close').addEventListener('click', closeSide); $('fsd_cancel').addEventListener('click', closeSide);
    $('fsd_save').addEventListener('click', saveDeviceAdd);
  }
  function saveDeviceAdd() {
    const msg = $('fsd_msg'), t = fromLocal($('fsd_time').value), err = text => { msg.textContent = text; msg.className = 'import-message error'; };
    const te = checkTime(t); if (te) return err(te);
    const d = DEVICE_TYPES.find(x => x[0] === $('fsd_type').value) || DEVICE_TYPES[0];
    const type = d[0] === 'Other device' ? $('fsd_other').value.trim() : d[0];
    if (!type) return err('Name the device.');
    const site = SITES.find(s => s[0] === $('fsd_site').value); if (!site) return err('Choose a location.');
    const status = $('fsd_status').value.trim() || 'In place', assess = $('fsd_assess').value.trim() || 'Placed; site assessed', size = $('fsd_size').value.trim(), extra = $('fsd_inf').value.trim();
    const dev = { id: `device_student_${makeStableId('d', type, site[1]).slice(2)}_${uid()}`, deviceType: d[1], type, location: site[1], siteMarker: site[0], placementDate: t, lastAssessment: `${t} - ${assess}`, status, enteredBy: who(), studentEntered: true };
    if (size) dev.gauge = size;
    if (extra) { if (d[1] === 'IV') dev.infusing = extra; else dev.drainage = extra; }
    canon().devices.push(dev);
    addDevMode = false; sel = null; draft = null; editing = false; msgText = '';
    refreshSimulationView();
  }

  // ---- Add Col
  function chart() { openAddCol(); }
  function openAddCol() {
    const box = $('fsAddCol'); if (!box) return;
    if (!box.classList.contains('hidden')) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    box.innerHTML = `<label>New column at <input id="fsAC_time" type="datetime-local" step="60" value="${esc(toLocal(simulationTime))}"></label><button type="button" class="secondary-button" id="fsAC_now">Now</button><button type="button" class="primary-button" id="fsAC_add">Add column</button><button type="button" class="secondary-button" id="fsAC_close">Close</button><span id="fsAC_msg" class="fs-hint"></span>`;
    $('fsAC_now').addEventListener('click', () => { $('fsAC_time').value = toLocal(simulationTime); });
    $('fsAC_close').addEventListener('click', () => box.classList.add('hidden'));
    $('fsAC_add').addEventListener('click', () => {
      const t = fromLocal($('fsAC_time').value); if (!parseSimDate(t)) { $('fsAC_msg').textContent = 'Choose a valid time.'; return; }
      extraCols.add(t); box.classList.add('hidden'); stickRight = true; rerender();
    });
  }

  // ---- assessment dialog (kept for compatibility): show the right systems
  const prevOpen = openFlowsheetChartDialog;
  openFlowsheetChartDialog = function (section, field, time) {
    const sel2 = $('chartAssessmentSection');
    const forSheet = section ? flowsheetSheetOf(section) : sheet;
    const list = forSheet === 'Pain / Safety' ? PAIN_SAFETY : forSheet === 'Adult Assessment' ? SYSTEMS : SYSTEMS.concat(PAIN_SAFETY);
    const all = section && !list.includes(section) ? list.concat([section]) : list;
    if (sel2) sel2.innerHTML = all.map(s => `<option>${esc(s)}</option>`).join('');
    return prevOpen.call(null, section || all[0], field, time);
  };

  window.FlowsheetCharting = { render, chart, setSheet, getSheet: () => sheet, monitorState, vitalFlag, SITES, DEVICE_TYPES, takeComment: () => { const c = pendingComment; pendingComment = ''; return c; } };
})();

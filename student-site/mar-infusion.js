/* NursingSim - charting continuous IV fluids on the MAR (v129).
   A continuous infusion row shows a Due box at the CURRENT hour. Clicking that box (or any box at the current hour on the row) opens a short window to chart what happened:
   running check, bag change, rate change, paused/held, stopped, restarted, or discontinued (which also discontinues the order, with a reason).
   What is charted is a student-entered administration, so it reaches the whole class in a Class session (shared-chart.js).
   Depends on app.js globals: renderMARRow, currentCanonicalCase, simulationTime, simulationStartTime, parseSimDate, marNowIndex, refreshSimulationView, persistCase,
   safe, escapeHtml, epicDate, makeStableId. */
(() => {
  'use strict';
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const p2 = n => String(n).padStart(2, '0');
  const hhmm = d => p2(d.getHours()) + p2(d.getMinutes());
  const stamp = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  const ACTIONS = [
    ['running', 'Running: rate and site checked', 'given', false], ['bag', 'New bag hung (bag change)', 'given', false], ['rate', 'Rate changed', 'given', false],
    ['restart', 'Restarted', 'given', false], ['held', 'Paused / held', 'held', true], ['stopped', 'Stopped', 'discontinued', true], ['dc', 'Discontinue the order', 'discontinued', true]
  ];
  let dlg = null, cur = null;

  function build() {
    dlg = document.createElement('dialog'); dlg.id = 'marInfDialog'; dlg.className = 'action-dialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2 id="miTitle">Continuous infusion</h2><p id="miSub"></p></div><button type="button" class="icon-button" id="miClose" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="mar-admin-details"><h3 class="mar-admin-h">What happened to the fluid?</h3>
      <div class="mar-admin-grid"><label>Date<input type="date" id="miDate"></label><label>Time<input type="time" id="miTime"></label>
      <label>What are you charting?<select id="miAct">${ACTIONS.map(a => `<option value="${a[0]}">${esc(a[1])}</option>`).join('')}</select></label>
      <label id="miRateL">Rate (mL/h)<input type="text" id="miRate" inputmode="decimal"></label>
      <label id="miBagL" class="hidden">Bag volume and lot / label check<input type="text" id="miBag" placeholder="e.g. 1,000 mL, label matches the order"></label></div>
      <div id="miMsg" class="mr-msg"></div></div>
      <label class="input-label" for="miWhy" id="miWhyL">Comment</label><textarea id="miWhy" class="small-textarea" placeholder="Comment"></textarea>
      <div class="mar-footer"><div></div><div class="mar-action-buttons"><button type="button" class="mar-action-choice mar-action-give" id="miSave">Chart it</button><button type="button" class="mar-action-choice mar-action-notgiven" id="miCancel">Cancel</button></div></div></div>`;
    document.body.appendChild(dlg);
    const $ = id => dlg.querySelector('#' + id);
    $('miClose').onclick = $('miCancel').onclick = () => dlg.close();
    $('miAct').onchange = sync; $('miSave').onclick = save;
  }
  const q = id => dlg.querySelector('#' + id);
  function sync() {
    const a = ACTIONS.find(x => x[0] === q('miAct').value) || ACTIONS[0];
    q('miBagL').classList.toggle('hidden', a[0] !== 'bag');
    q('miRateL').classList.toggle('hidden', !['running', 'bag', 'rate', 'restart'].includes(a[0]));
    q('miWhyL').textContent = a[3] ? 'Reason (required)' : 'Comment';
    q('miWhy').placeholder = a[3] ? 'Why? (for example: IV infiltrated, provider order, bag empty, patient going to a test)' : 'Comment (optional)';
    q('miMsg').textContent = '';
  }
  function open(med) {
    if (!dlg) build();
    cur = med; const rate = safe(med.dose);
    q('miTitle').textContent = safe(med.name); q('miSub').textContent = `${doseDisplay(med)} | ${safe(med.route)} | Continuous`;
    q('miDate').value = String(simulationTime).slice(0, 10); q('miTime').value = String(simulationTime).slice(11, 16);
    q('miAct').value = 'running'; q('miRate').value = (rate.match(/[\d.,]+/) || [''])[0].replace(/,/g, ''); q('miBag').value = ''; q('miWhy').value = '';
    sync(); dlg.showModal();
  }
  function save() {
    const a = ACTIONS.find(x => x[0] === q('miAct').value), why = q('miWhy').value.trim(), rate = q('miRate').value.trim();
    const t = parseSimDate(`${q('miDate').value} ${q('miTime').value}`), now = parseSimDate(simulationTime), start = parseSimDate(simulationStartTime);
    const err = m => { q('miMsg').textContent = m; };
    if (!t) return err('Enter the date and time.');
    if (now && t > now) return err('The time cannot be later than the current patient time.');
    if (start && t < start) return err('That time is before this patient\'s simulation started.');
    if (a[3] && !why) return err('Type the reason.');
    if (['running', 'bag', 'rate', 'restart'].includes(a[0]) && (!rate || isNaN(Number(rate)) || Number(rate) <= 0)) return err('Enter the rate in mL/h.');
    if (a[0] === 'bag' && !q('miBag').value.trim()) return err('Enter the bag volume and confirm the label.');
    const base = parseSimDate(safe(currentCanonicalCase.timeline && currentCanonicalCase.timeline.simulationStart, '')); base.setMinutes(0, 0, 0);
    const slotIndex = Math.floor((t - base) / 3600000), tm = hhmm(t), by = window.NSUser && NSUser.label ? NSUser.label() : 'Nurse';
    const label = {
      running: `${tm} Running ${rate} mL/h`, bag: `${tm} New bag ${q('miBag').value.trim().slice(0, 30)} at ${rate} mL/h`, rate: `${tm} Rate changed to ${rate} mL/h`, restart: `${tm} Restarted at ${rate} mL/h`,
      held: `${tm} Paused/Held`, stopped: `${tm} Stopped - ${why.slice(0, 40)}`, dc: `${tm} Discontinued - ${why.slice(0, 40)}`
    }[a[0]];
    const adm = { id: makeStableId('student_admin', cur.orderId, tm, Date.now()), orderId: cur.orderId, slotIndex, time: tm, state: a[2], label, dose: rate ? `${rate} mL/h` : safe(cur.dose), route: safe(cur.route),
      administeredAt: stamp(t), administeredTime: epicDate(stamp(t)), administeredBy: by, comment: [a[0] === 'bag' ? 'Bag: ' + q('miBag').value.trim() : '', why].filter(Boolean).join('. '), studentEntered: true };
    currentCanonicalCase.administrations.push(adm);
    if (a[0] === 'dc') {
      if (!currentCanonicalCase.orderStop) currentCanonicalCase.orderStop = {};
      currentCanonicalCase.orderStop[cur.orderId] = { at: stamp(t), by, reason: why.slice(0, 300) };
    }
    dlg.close(); try { persistCase(); } catch (e) { /* best effort */ } refreshSimulationView();
  }

  // a Due box at the current hour on every running continuous row
  const orig = renderMARRow;
  renderMARRow = function (med, timeSlots, offset = 0) {
    const row = orig(med, timeSlots, offset);
    try {
      if (safe(med.category).toLowerCase() !== 'continuous' || !med.orderId) return row;
      const idx = marNowIndex(); if (idx == null) return row;
      const cell = row.querySelectorAll('.mar-cell')[idx - offset]; if (!cell || cell.classList.contains('mar-before') || cell.classList.contains('mar-discontinued')) return row;
      const hasPill = !!cell.querySelector('.mar-event-pill');
      if (!hasPill) {
        const pill = document.createElement('div'); pill.className = 'mar-event-pill mar-event-due actionable'; pill.dataset.marState = 'due'; pill.title = 'Chart what is happening with this fluid';
        pill.textContent = 'Due'; cell.insertBefore(pill, cell.firstChild);
      }
      cell.style.cursor = 'pointer'; cell.classList.add('mar-inf-cell');
      cell.addEventListener('click', e => { e.stopPropagation(); open(med); });
    } catch (e) { /* the MAR still shows */ }
    return row;
  };
})();

/* NursingSim - Epic-style MAR colors and the rights-of-administration checklist (v33).
   Colors on the MAR: Overdue = red (more than 60 minutes past the scheduled time), Due = blue (within 60 minutes), Scheduled = light blue (later),
   Given = green, Held / Refused / Not given keep their own colors. A small legend sits above the grid.
   Rights checklist: when a nurse opens a dose, a checklist of the rights (patient, medication, dose, route, time, reason, documentation, response)
   shows the chart's own facts next to each box. All boxes must be checked before Give works (Hold, Refused and Not Given do not need it).
   Faculty can turn it off with the "Rights check" button on the MAR toolbar (saved with the patient).
   Depends on app.js globals: currentCanonicalCase, simulationTime, parseSimDate, combineSimDateAndClock, safe, escapeHtml, getVisibleMedicationOrder, activeMARAction. Loaded after medpass.js. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const WINDOW_MIN = 60;

  // ------------------------------------------------------------------ colors
  function minutesLate(time) {
    const sched = parseSimDate(combineSimDateAndClock(time)), now = parseSimDate(simulationTime);
    if (!sched || !now) return 0;
    return Math.round((now - sched) / 60000);
  }
  const origPill = createMAREventPill;
  createMAREventPill = function (event) { // eslint-disable-line no-func-assign
    const html = origPill.apply(this, arguments);
    if (!event || String(event.state).toLowerCase() !== 'due') return html;
    const late = minutesLate(event.time);
    if (late > WINDOW_MIN) return html.replace('mar-event-due', 'mar-event-overdue').replace(/>([^<]*)<\/div>$/, (m, t) => `>${t} Overdue</div>`).replace('data-mar-state="due"', 'data-mar-state="due" data-late="' + late + '"');
    if (late < -WINDOW_MIN) return html.replace('mar-event-due', 'mar-event-scheduled');
    return html;
  };

  function addLegend() {
    const card = document.querySelector('#marSection .mar-card'); if (!card || $('marLegend')) return;
    const l = document.createElement('div'); l.id = 'marLegend'; l.className = 'mar-legend';
    l.innerHTML = '<span><i class="lg overdue"></i>Overdue</span><span><i class="lg due"></i>Due now</span><span><i class="lg scheduled"></i>Scheduled</span><span><i class="lg given"></i>Given</span><span><i class="lg held"></i>Held / refused / not given</span>';
    const top = card.querySelector('.mar-toolbar-top'); card.insertBefore(l, top ? top.nextSibling : card.firstChild);
  }

  // ------------------------------------------------------------------ rights checklist
  const cfg = () => (currentCanonicalCase ? (currentCanonicalCase.marRights = currentCanonicalCase.marRights || { required: true }) : { required: false });
  const required = () => cfg().required !== false;

  function rightsList(med, event, order) {
    const p = (currentCanonicalCase.patient || {}), m = order.medication || {};
    const late = minutesLate(event.time), prn = /prn/i.test(safe(med.category));
    const timeNote = prn ? `PRN: given when needed. Last dose, frequency and maximum dose were checked.` : late > WINDOW_MIN ? `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}. This dose is ${late} minutes late, outside the ${WINDOW_MIN}-minute window. Follow policy and notify the provider or pharmacy.` : late < -WINDOW_MIN ? `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}. It is early (more than ${WINDOW_MIN} minutes before the scheduled time).` : `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}: within the ${WINDOW_MIN}-minute window.`;
    const bad = !prn && Math.abs(late) > WINDOW_MIN;
    return [
      { k: 'patient', t: 'Right patient', d: `${safe(p.name)}, DOB ${NSWristband && NSWristband.dobText ? NSWristband.dobText(p.dob) : safe(p.dob)}. Checked two identifiers (name and date of birth) against the wristband.` },
      { k: 'drug', t: 'Right medication', d: `${safe(med.name)}. Compared with the order and the label.` },
      { k: 'dose', t: 'Right dose', d: `${safe(med.dose)}${m.highAlert ? ' (HIGH-ALERT: independent double check)' : ''}. Calculated or verified.` },
      { k: 'route', t: 'Right route', d: `${safe(med.route)}.` },
      { k: 'time', t: 'Right time', d: timeNote, warn: bad },
      { k: 'reason', t: 'Right reason', d: order.rationale ? `Ordered for: ${order.rationale}. Fits the patient's condition.` : 'The reason for this medication makes sense for this patient.' },
      { k: 'response', t: 'Right assessment and response', d: prn ? 'Pre-dose assessment done. I will reassess 60 minutes after giving.' : 'Pre-dose assessment (vital signs, labs, allergies) done. I will watch for the expected effect and side effects.' },
      { k: 'doc', t: 'Right documentation', d: 'I will document right after giving, not before.' }
    ];
  }

  let current = null; // the checklist for the dose that is open
  function renderRights(med, event) {
    const dlg = $('marActionDialog'); if (!dlg) return;
    let box = $('mrRights'); if (box) box.remove();
    if (!required()) { current = null; return; }
    const order = getVisibleMedicationOrder(med.orderId); if (!order) return;
    const list = rightsList(med, event, order); current = list.map(r => r.k);
    box = document.createElement('div'); box.id = 'mrRights'; box.className = 'mr-rights';
    box.innerHTML = `<strong>Rights of medication administration</strong><div class="mr-sub">Check each right before you tap Give.</div>` + list.map(r => `<label class="mr-row${r.warn ? ' warn' : ''}"><input type="checkbox" data-mr="${r.k}"><span><b>${esc(r.t)}</b><br><small>${esc(r.d)}</small></span></label>`).join('') + '<div id="mrMsg" class="mr-msg"></div>';
    const btns = dlg.querySelector('.mar-action-buttons'); btns.parentNode.insertBefore(box, btns);
    box.addEventListener('change', () => { const m = $('mrMsg'); if (m) m.textContent = ''; });
  }
  const allChecked = () => { const boxes = Array.from(document.querySelectorAll('#mrRights input[data-mr]')); return boxes.length === 0 || boxes.every(b => b.checked); };

  const origOpen = openMARActionDialog;
  openMARActionDialog = function (med, event) { const r = origOpen.apply(this, arguments); try { renderRights(med, event); } catch (e) { current = null; } return r; }; // eslint-disable-line no-func-assign
  const origApply = applyMARAction;
  applyMARAction = function (action) { // eslint-disable-line no-func-assign
    if (action === 'given' && required() && current && !allChecked()) {
      const m = $('mrMsg'); if (m) { m.textContent = 'Check every right before giving this medication.'; m.scrollIntoView({ block: 'nearest' }); }
      document.querySelectorAll('#mrRights input[data-mr]:not(:checked)').forEach(b => b.closest('.mr-row').classList.add('missing'));
      return;
    }
    const act = typeof activeMARAction !== 'undefined' ? activeMARAction : null;
    const r = origApply.apply(this, arguments);
    if (act && action === 'given' && current) { const a = (currentCanonicalCase.administrations || []).find(x => x.orderId === act.orderId && Number(x.slotIndex) === Number(act.slotIndex) && safe(x.time) === safe(act.time)); if (a) a.rightsChecked = true; }
    return r;
  };

  // ------------------------------------------------------------------ toolbar toggle (faculty)
  function addToolbar() {
    const bar = document.querySelector('.mar-subtoolbar'); if (!bar || $('mrToggleBtn')) return;
    const sp = bar.querySelector('.mar-subtoolbar-spacer'), b = document.createElement('button');
    b.className = 'small-tool-button'; b.id = 'mrToggleBtn'; b.textContent = `Rights check: ${required() ? 'On' : 'Off'}`;
    b.addEventListener('click', () => { if (!currentCanonicalCase) return; cfg().required = !required(); b.textContent = `Rights check: ${required() ? 'On' : 'Off'}`; try { persistCase(); } catch (e) { /* best effort */ } });
    bar.insertBefore(b, sp);
  }
  const sync = () => { const b = $('mrToggleBtn'); if (b && currentCanonicalCase) { const t = `Rights check: ${required() ? 'On' : 'Off'}`; if (b.textContent !== t) b.textContent = t; } };
  addToolbar(); addLegend();
  const marSection = $('marSection');
  if (marSection) new MutationObserver(() => { if (!$('mrToggleBtn')) addToolbar(); if (!$('marLegend')) addLegend(); sync(); }).observe(marSection, { childList: true, subtree: true });
  window.MarRights = { minutesLate, rightsList };
})();

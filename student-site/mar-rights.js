/* NursingSim - Epic-style MAR colors and the rights-of-administration checklist (v33).
   Colors on the MAR: Overdue = red (more than 60 minutes past the scheduled time), Due = blue (within 60 minutes), Scheduled = light blue (later),
   Given = green, Held / Refused / Not given keep their own colors. A small legend sits above the grid.
   Rights summary: when a nurse opens a dose, a short read-only summary of the rights (patient, medication, dose, route, time, reason, assessment, documentation)
   shows the chart's own facts. Nothing has to be ticked; the scanning steps above it are what gate Give.
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

  // a short read-only summary of the rights (nothing to tick)
  function rightsList(med, event, order) {
    const p = (currentCanonicalCase.patient || {}), m = order.medication || {};
    const late = minutesLate(event.time), prn = /prn/i.test(safe(med.category));
    const bad = !prn && Math.abs(late) > WINDOW_MIN;
    const time = prn ? 'PRN: when needed; check the last dose and the maximum dose' : late > WINDOW_MIN ? `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}: ${late} minutes late, outside the ${WINDOW_MIN}-minute window` : late < -WINDOW_MIN ? `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}: more than ${WINDOW_MIN} minutes early` : `Scheduled ${safe(event.time)}; now ${String(simulationTime).slice(11)}: within the ${WINDOW_MIN}-minute window`;
    return [
      { t: 'Patient', d: `${safe(p.name)}, DOB ${NSWristband && NSWristband.dobText ? NSWristband.dobText(p.dob) : safe(p.dob)}` },
      { t: 'Medication', d: safe(med.name) }, { t: 'Dose', d: `${safe(med.dose)}${m.highAlert ? ' (HIGH-ALERT: independent double check)' : ''}` },
      { t: 'Route', d: safe(med.route) }, { t: 'Time', d: time, warn: bad },
      { t: 'Reason', d: order.rationale ? order.rationale : 'Ordered for this patient\'s condition' },
      { t: 'Assessment and response', d: prn ? 'Assess before giving; reassess in 60 minutes' : 'Assess before giving; watch for effect and side effects' },
      { t: 'Documentation', d: 'Document right after giving' }
    ];
  }

  function renderRights(med, event) {
    const dlg = $('marActionDialog'); if (!dlg) return;
    const old = $('mrRights'); if (old) old.remove();
    const order = getVisibleMedicationOrder(med.orderId); if (!order) return;
    const list = rightsList(med, event, order);
    const box = document.createElement('div'); box.id = 'mrRights'; box.className = 'mr-rights';
    box.innerHTML = '<strong>Rights of medication administration</strong><div class="mr-grid">' + list.map(r => `<div class="mr-item${r.warn ? ' warn' : ''}"><b>${esc(r.t)}</b><span>${esc(r.d)}</span></div>`).join('') + '</div>';
    const btns = dlg.querySelector('.mar-action-buttons'); btns.parentNode.insertBefore(box, btns);
  }

  const origOpen = openMARActionDialog;
  openMARActionDialog = function (med, event) { const r = origOpen.apply(this, arguments); try { renderRights(med, event); } catch (e) { /* summary is optional */ } return r; }; // eslint-disable-line no-func-assign

  const marSection = $('marSection');
  addLegend();
  if (marSection) new MutationObserver(() => { if (!$('marLegend')) addLegend(); }).observe(marSection, { childList: true, subtree: true });
  window.MarRights = { minutesLate, rightsList };
})();

/* NursingSim - Brain / Worklist overdue timers (v36).
   Every open task shows how late or how soon it is ("Overdue 45 min", "Due in 12 min", "In 2 h 10 min") and the card is colored like Epic:
   red for overdue (darker after an hour), amber for due within 30 minutes, blue for later. A summary bar at the top of the Brain page counts them and names the oldest overdue task.
   The timers move when the simulation clock moves.
   Depends on app.js globals: simulationTime, parseSimDate, getBrainTasks, renderBrainTask, renderBrainPage, safe, escapeHtml. Loaded after brain-timeline.js. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  function mins(task) { const due = parseSimDate(task.dueAt), now = parseSimDate(simulationTime); return due && now ? Math.round((now - due) / 60000) : null; }
  const span = m => { m = Math.abs(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}`; };
  function timer(task) {
    if (task.completed) return null;
    const m = mins(task); if (m === null) return null;
    if (m > 0) return { cls: m > 60 ? 'tm-late2' : 'tm-late', text: `Overdue ${span(m)}` };
    if (m >= -30) return { cls: 'tm-soon', text: m === 0 ? 'Due now' : `Due in ${span(m)}` };
    return { cls: 'tm-later', text: `In ${span(m)}` };
  }
  const origTask = renderBrainTask;
  renderBrainTask = function (task) { // eslint-disable-line no-func-assign
    const el = origTask.apply(this, arguments), t = timer(task);
    if (el && t) { el.classList.add(t.cls); const meta = el.querySelector('.brain-task-meta'); if (meta) meta.insertAdjacentHTML('beforeend', ` <span class="tm-chip ${t.cls}">${esc(t.text)}</span>`); }
    return el;
  };

  function bar() {
    const card = document.querySelector('#brainSection .brain-card'); if (!card || typeof currentCanonicalCase === 'undefined' || !currentCanonicalCase) return;
    let box = $('brainSummaryBar'); if (!box) { box = document.createElement('div'); box.id = 'brainSummaryBar'; box.className = 'brain-summary-bar'; card.insertBefore(box, card.firstChild); }
    const open = getBrainTasks(false).filter(t => !t.completed && t.dueAt);
    const late = open.filter(t => mins(t) > 0).sort((a, b) => mins(b) - mins(a)), soon = open.filter(t => { const m = mins(t); return m <= 0 && m >= -30; });
    const html = `<span class="tm-chip tm-late${late.some(t => mins(t) > 60) ? '2' : ''}">${late.length} overdue</span><span class="tm-chip tm-soon">${soon.length} due in the next 30 min</span>${late.length ? `<span class="tm-oldest">Longest overdue: <b>${esc(late[0].title)}</b> (${span(mins(late[0]))})</span>` : '<span class="tm-oldest">Nothing is overdue.</span>'}`;
    if (box.innerHTML !== html) box.innerHTML = html;
  }
  const origPage = renderBrainPage;
  renderBrainPage = function () { const r = origPage.apply(this, arguments); try { bar(); } catch (e) { /* optional */ } return r; }; // eslint-disable-line no-func-assign
  window.BrainTimers = { mins, timer };
})();

/* Brain / Worklist as a calendar-style timeline (v24): one large row per hour, tasks placed in the hour they are due.
   Wraps renderBrainPage from app.js. A "List" button brings back the original columns. */
(() => {
  'use strict';
  let view = 'timeline';
  const pad = n => String(n).padStart(2, '0');
  const hourKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}`;

  function ensureShell() {
    const card = document.querySelector('#brainSection .brain-card'); if (!card) return null;
    let box = document.getElementById('brainTimeline');
    if (!box) {
      box = document.createElement('div'); box.id = 'brainTimeline'; box.className = 'brain-timeline';
      const cols = card.querySelector('.brain-columns'); card.insertBefore(box, cols);
      const bar = card.querySelector('.brain-toolbar-actions');
      ['timeline:Timeline', 'list:List'].forEach(s => {
        const [k, t] = s.split(':'), b = document.createElement('button');
        b.className = 'small-tool-button brain-view-btn'; b.dataset.view = k; b.textContent = t;
        b.addEventListener('click', () => { view = k; renderBrainPage(); });
        bar.insertBefore(b, bar.firstChild);
      });
    }
    return box;
  }

  function draw() {
    const box = ensureShell(); if (!box || !currentCanonicalCase) return;
    document.querySelectorAll('.brain-view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const cols = document.querySelector('#brainSection .brain-columns');
    box.classList.toggle('hidden', view !== 'timeline'); if (cols) cols.classList.toggle('hidden', view === 'timeline');
    if (view !== 'timeline') return;

    const tasks = getBrainTasks(true).filter(t => brainFilter === 'all' || !t.completed);
    const now = parseSimDate(simulationTime), tl = currentCanonicalCase.timeline || {};
    const start = parseSimDate(tl.simulationStart) || now, end = parseSimDate(tl.simulationEnd) || new Date(start.getTime() + 8 * 3600000);
    if (!now || !start) { box.innerHTML = ''; return; }
    const first = new Date(start); first.setMinutes(0, 0, 0);
    const lastT = new Date(Math.max(end.getTime(), now.getTime())); lastT.setMinutes(0, 0, 0);
    const rows = [];
    for (let d = new Date(first); d <= lastT; d = new Date(d.getTime() + 3600000)) rows.push(new Date(d));
    const byHour = new Map(rows.map(r => [hourKey(r), []])), overdue = [], later = [];
    tasks.forEach(t => {
      const due = parseSimDate(t.dueAt);
      if (!due) { later.push(t); return; }
      const k = hourKey(due);
      if (byHour.has(k)) byHour.get(k).push(t);
      else if (due < first) overdue.push(t); else later.push(t);
    });
    const nowKey = hourKey(now);
    box.innerHTML = '';
    const section = (label, list, cls) => {
      if (!list.length) return;
      const row = document.createElement('div'); row.className = `bt-row bt-extra ${cls}`;
      row.innerHTML = `<div class="bt-time">${label}</div><div class="bt-slot"></div>`;
      list.forEach(t => row.querySelector('.bt-slot').appendChild(renderBrainTask(t)));
      box.appendChild(row);
    };
    section('Overdue<br><span>before this shift</span>', overdue, 'bt-overdue');
    rows.forEach(r => {
      const k = hourKey(r), list = byHour.get(k), isNow = k === nowKey, past = r.getTime() + 3600000 <= now.getTime();
      const row = document.createElement('div'); row.className = `bt-row${isNow ? ' bt-now' : ''}${past ? ' bt-past' : ''}`;
      row.innerHTML = `<div class="bt-time">${pad(r.getHours())}00${isNow ? `<span>now ${pad(now.getHours())}${pad(now.getMinutes())}</span>` : ''}</div><div class="bt-slot"></div>`;
      const slot = row.querySelector('.bt-slot');
      list.sort((a, b) => safe(a.dueAt).localeCompare(safe(b.dueAt))).forEach(t => slot.appendChild(renderBrainTask(t)));
      if (isNow) { const m = document.createElement('div'); m.className = 'bt-nowline'; m.style.top = `${Math.round(now.getMinutes() / 60 * 100)}%`; row.appendChild(m); }
      box.appendChild(row);
    });
    section('Later<br><span>after this shift</span>', later, 'bt-later');
  }

  // Tasks that come from what has just happened in the chart (abnormal vital signs, critical results), not only from the order schedule.
  const originalTasks = getBrainTasks;
  getBrainTasks = function (includeCompleted) {
    const tasks = originalTasks.apply(null, arguments);
    if (!currentCanonicalCase) return tasks;
    const tl = currentCanonicalCase.timeline || {}, since = String(tl.simulationStart || ''), vis = getVisibleCanonicalCase(currentCanonicalCase);
    const add = t => { t.completed = completedBrainTaskIds.has(t.id); if (includeCompleted || !t.completed) tasks.push(t); };
    const abn = {};
    (vis.observations || []).filter(o => o.type === 'vital' && o.collected > since && safe(o.flag)).forEach(o => { (abn[o.collected] = abn[o.collected] || []).push(`${safe(o.label)} ${safe(o.value)}${o.units ? ' ' + o.units : ''}`); });
    Object.keys(abn).forEach(stamp => add({ id: `vitals_abnormal_${stamp}`, type: 'care', title: 'Abnormal vital signs: reassess and notify if needed', detail: abn[stamp].join(', '), dueAt: stamp, target: 'flowsheets', priority: 'overdue' }));
    (vis.observations || []).filter(o => o.type === 'lab' && o.collected > since && /critical/i.test(safe(o.flag))).forEach(o => add({ id: `lab_critical_${o.id}`, type: 'care', title: `Critical result: ${safe(o.label)} ${safe(o.value)}`, detail: 'Read back, notify the provider, document the time and who was told.', dueAt: o.collected, target: 'labResults', priority: 'overdue' }));
    return Array.from(new Map(tasks.map(t => [t.id, t])).values());
  };

  const orig = renderBrainPage;
  renderBrainPage = function () { orig.apply(null, arguments); draw(); };
})();

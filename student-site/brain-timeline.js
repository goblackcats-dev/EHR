/* Brain / Worklist as a calendar-style timeline (v24): one large row per hour, tasks placed in the hour they are due.
   Wraps renderBrainPage from app.js. A "List" button brings back the original columns. */
(() => {
  'use strict';
  let view = 'timeline', shiftOff = 0, shiftCase = '';   // shiftOff: 0 = the current 12-hour shift, -1 = the 12 hours before it, +1 = the next 12 hours
  const pad = n => String(n).padStart(2, '0');
  const hourKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}`;

  function ensureShell() {
    const card = document.querySelector('#brainSection .brain-card'); if (!card) return null;
    let box = document.getElementById('brainTimeline');
    if (!box) {
      box = document.createElement('div'); box.id = 'brainTimeline'; box.className = 'brain-timeline';
      const cols = card.querySelector('.brain-columns'); card.insertBefore(box, cols);
      const pg = document.createElement('div'); pg.id = 'brainPager'; pg.className = 'mar-pager brain-pager'; card.insertBefore(pg, box);
      pg.addEventListener('click', e => { const b = e.target.closest('[data-pg]'); if (!b || b.disabled) return; shiftOff = b.dataset.pg === 'prior' ? shiftOff - 1 : b.dataset.pg === 'next' ? shiftOff + 1 : 0; draw(); });
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
    { const pg0 = document.getElementById('brainPager'); if (pg0) pg0.style.display = view === 'timeline' ? '' : 'none'; }
    if (view !== 'timeline') return;

    const tasks = getBrainTasks(true);   // completed tasks stay in their box, shown with a green check
    const now = parseSimDate(simulationTime), tl = currentCanonicalCase.timeline || {};
    const start = parseSimDate(tl.simulationStart) || now, end = parseSimDate(tl.simulationEnd) || new Date(start.getTime() + 8 * 3600000);
    if (!now || !start) { box.innerHTML = ''; return; }
    // one 12-hour shift (0700-1859 or 1900-0659) at a time, with buttons to move to the prior 12 hours and back to the current shift
    const alignShift = d => { let x = new Date(d); x.setMinutes(0, 0, 0); while (x.getHours() !== 7 && x.getHours() !== 19) x = new Date(x.getTime() - 3600000); return x; };
    const caseKey = safe(currentCanonicalCase.caseMeta && currentCanonicalCase.caseMeta.caseId || currentCanonicalCase.patient && currentCanonicalCase.patient.id); if (caseKey !== shiftCase) { shiftCase = caseKey; shiftOff = 0; }
    const H12 = 12 * 3600000, curStart = alignShift(now), firstShift = alignShift(start), lastShift = alignShift(new Date(Math.max(end.getTime(), now.getTime())));
    const minOff = Math.round((firstShift - curStart) / H12), maxOff = Math.round((lastShift - curStart) / H12);
    shiftOff = Math.max(minOff, Math.min(maxOff, shiftOff));
    const first = new Date(curStart.getTime() + shiftOff * H12), lastT = new Date(first.getTime() + 11 * 3600000);
    const dayName = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const pg = document.getElementById('brainPager');
    if (pg) pg.innerHTML = `<button type="button" class="small-tool-button" data-pg="prior" ${shiftOff <= minOff ? 'disabled' : ''}>\u25C0 Prior 12 h</button><span class="mar-pager-label">${dayName(first)} ${pad(first.getHours())}00\u2013${pad(lastT.getHours())}59${shiftOff === 0 ? ' (current shift)' : ''}</span><button type="button" class="small-tool-button" data-pg="next" ${shiftOff >= maxOff ? 'disabled' : ''}>Next 12 h \u25B6</button><button type="button" class="small-tool-button${shiftOff === 0 ? ' active' : ''}" data-pg="now">Current shift</button>`;
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
    if (shiftOff === 0) section('Overdue<br><span>before this shift</span>', overdue, 'bt-overdue');
    rows.forEach(r => {
      const k = hourKey(r), list = byHour.get(k), isNow = k === nowKey, past = r.getTime() + 3600000 <= now.getTime();
      const row = document.createElement('div'); row.className = `bt-row${isNow ? ' bt-now' : ''}${past ? ' bt-past' : ''}`;
      row.innerHTML = `<div class="bt-time">${pad(r.getHours())}00${isNow ? `<span>now ${pad(now.getHours())}${pad(now.getMinutes())}</span>` : ''}</div><div class="bt-slot"></div>`;
      const slot = row.querySelector('.bt-slot');
      list.sort((a, b) => safe(a.dueAt).localeCompare(safe(b.dueAt))).forEach(t => slot.appendChild(renderBrainTask(t)));
      if (isNow) { const m = document.createElement('div'); m.className = 'bt-nowline'; m.style.left = `${Math.round(now.getMinutes() / 60 * 100)}%`; row.appendChild(m); }
      box.appendChild(row);
    });
    if (shiftOff === 0) section('Later<br><span>after this shift</span>', later, 'bt-later');
    const nowCol = box.querySelector('.bt-now'); if (nowCol && box.scrollWidth > box.clientWidth) box.scrollLeft = Math.max(0, nowCol.offsetLeft - box.offsetLeft - 8);
    if (pg) pg.style.display = view === 'timeline' ? '' : 'none';
  }

  // Tasks that come from what has just happened in the chart (abnormal vital signs, critical results), not only from the order schedule.
  const originalTasks = getBrainTasks;
  getBrainTasks = function (includeCompleted) {
    const tasks = originalTasks.apply(null, arguments);
    if (!currentCanonicalCase) return tasks;
    const tl = currentCanonicalCase.timeline || {}, since = String(tl.simulationStart || ''), vis = getVisibleCanonicalCase(currentCanonicalCase);
    const add = t => { t.completed = completedBrainTaskIds.has(t.id); if (includeCompleted || !t.completed) tasks.push(t); };
    // orders the nurse has acknowledged stay on the worklist as completed
    Object.keys(currentCanonicalCase.orderAck || {}).forEach(id => { const o = (vis.orders || []).find(x => x.id === id); if (o) add({ id: `neworder_${id}`, type: 'order', title: `Review new order: ${safe(o.name)}`, detail: `${safe(o.category)} | ${safe(o.frequency)}`, dueAt: safe(currentCanonicalCase.orderAck[id].at, simulationTime), target: 'orders', priority: 'upcoming', completed: true }); });
    const abn = {};
    (vis.observations || []).filter(o => o.type === 'vital' && o.collected > since && safe(o.flag)).forEach(o => { (abn[o.collected] = abn[o.collected] || []).push(`${safe(o.label)} ${safe(o.value)}${o.units ? ' ' + o.units : ''}`); });
    Object.keys(abn).forEach(stamp => add({ id: `vitals_abnormal_${stamp}`, type: 'care', title: 'Abnormal vital signs: reassess and notify if needed', detail: abn[stamp].join(', '), dueAt: stamp, target: 'flowsheets', priority: 'overdue' }));
    (vis.observations || []).filter(o => o.type === 'lab' && o.collected > since && /critical/i.test(safe(o.flag))).forEach(o => add({ id: `lab_critical_${o.id}`, type: 'care', title: `Critical result: ${safe(o.label)} ${safe(o.value)}`, detail: 'Read back, notify the provider, document the time and who was told.', dueAt: o.collected, target: 'labResults', priority: 'overdue' }));
    return Array.from(new Map(tasks.map(t => [t.id, t])).values());
  };

  const orig = renderBrainPage;
  renderBrainPage = function () { orig.apply(null, arguments); draw(); };
})();

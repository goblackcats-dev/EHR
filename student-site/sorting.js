/* NursingSim - click-to-sort (v43).
   Orders page: click a column heading (Order, Category, Status, Frequency, Start, Provider) to sort ascending; click again for descending.
   Chart Review: a sort bar above the list (Date, Title, Author, Type) does the same for notes, imaging, H&P and the other tabs.
   An arrow shows the current column and direction. Depends on app.js globals: getFilteredOrders, renderOrdersPage, currentPatientData, getChartReviewArray, renderChartReviewTab, currentChartTab. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const cmp = (a, b) => String(a == null ? '' : a).localeCompare(String(b == null ? '' : b), undefined, { numeric: true, sensitivity: 'base' });

  // ---------------------------------------------------------------- orders
  const ORDER_KEYS = ['name', 'category', 'status', 'frequency', 'start', 'provider'];
  let oSort = { key: null, dir: 1 };
  const origFiltered = getFilteredOrders;
  getFilteredOrders = function () { // eslint-disable-line no-func-assign
    const list = origFiltered.apply(this, arguments).slice();
    if (!oSort.key) return list;
    return list.map((o, i) => [o, i]).sort((x, y) => (cmp(x[0][oSort.key], y[0][oSort.key]) * oSort.dir) || (x[1] - y[1])).map(p => p[0]);
  };
  function markOrders() {
    const ths = document.querySelectorAll('.orders-table thead th');
    ths.forEach((th, i) => {
      th.style.cursor = 'pointer'; th.setAttribute('role', 'button'); th.title = 'Click to sort';
      const base = th.dataset.label || (th.dataset.label = th.textContent.replace(/[▲▼]/g, '').trim());
      const on = oSort.key === ORDER_KEYS[i];
      th.textContent = base + (on ? (oSort.dir === 1 ? ' ▲' : ' ▼') : '');
      th.setAttribute('aria-sort', on ? (oSort.dir === 1 ? 'ascending' : 'descending') : 'none');
    });
  }
  function wireOrders() {
    document.querySelectorAll('.orders-table thead th').forEach((th, i) => {
      th.addEventListener('click', () => {
        const k = ORDER_KEYS[i]; oSort = oSort.key === k ? { key: k, dir: -oSort.dir } : { key: k, dir: 1 };
        currentOrderIndex = 0; renderOrdersPage(currentPatientData);
      });
    });
    markOrders();
  }
  const origPage = renderOrdersPage;
  renderOrdersPage = function () { const r = origPage.apply(this, arguments); try { markOrders(); } catch (e) { /* optional */ } return r; }; // eslint-disable-line no-func-assign
  wireOrders();

  // ---------------------------------------------------------------- chart review lists
  const CR = [['datetime', 'Date'], ['title', 'Title'], ['author', 'Author'], ['category', 'Type']];
  let cSort = { key: 'datetime', dir: -1 };   // the newest note first, until the student chooses another sort
  // chips above the notes list: show only one kind of note (Provider, Nursing Note, Physical Therapy ...)
  let cFilter = 'All';
  const PROVIDER = /^(progress note|h&p|ed note|consult|procedure note|anesthesia|transfer summary|ems handoff|operative|discharge)/i;
  const kind = r => { const c = String(r.category || '').trim(); return PROVIDER.test(c) ? 'Provider' : (/^(case management|social work)$/i.test(c) ? 'Case Management / Social Work' : (c || 'Other')); };
  const origArr = getChartReviewArray;
  getChartReviewArray = function () { // eslint-disable-line no-func-assign
    let list = origArr.apply(this, arguments);
    if (arguments[1] === 'notes' && Array.isArray(list) && cFilter !== 'All') list = list.filter(r => kind(r) === cFilter);
    if (!cSort.key || !Array.isArray(list)) return list;
    return list.map((o, i) => [o, i]).sort((x, y) => (cmp(x[0][cSort.key], y[0][cSort.key]) * cSort.dir) || (x[1] - y[1])).map(p => p[0]);
  };
  function bar() {
    const list = $('recordList'); if (!list) return;
    let box = $('crSortBar');
    if (!box) { box = document.createElement('div'); box.id = 'crSortBar'; box.className = 'cr-sortbar'; list.parentNode.insertBefore(box, list);
      box.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k; cSort = cSort.key === k ? { key: k, dir: -cSort.dir } : { key: k, dir: 1 }; draw(); renderChartReviewTab(currentChartTab, 0); }); }
    draw();
  }
  function draw() {
    const box = $('crSortBar'); if (!box) return;
    box.innerHTML = '<span>Sort:</span>' + CR.map(([k, l]) => `<button type="button" class="small-tool-button${cSort.key === k ? ' active' : ''}" data-k="${k}">${l}${cSort.key === k ? (cSort.dir === 1 ? ' ▲' : ' ▼') : ''}</button>`).join('');
  }
  bar();
  // one flat list (so the date order is real); each card says what kind of note it is
  renderNotesList = function (flat, selectedIndex) { // eslint-disable-line no-func-assign
    clearChildren(elements.recordList);
    if (!flat.length) { elements.recordList.innerHTML = '<div class="empty-state">No notes of this kind.</div>'; return; }
    flat.forEach((record, index) => {
      const card = document.createElement('div'); card.className = `record-card ${index === selectedIndex ? 'active' : ''}`;
      card.innerHTML = `<div class="record-card-title">${escapeHtml(safe(record.title))}</div><div class="record-card-meta">${escapeHtml(safe(record.author))} | ${escapeHtml(safe(record.datetime))} | ${escapeHtml(safe(record.category))}</div><div class="record-card-summary">${escapeHtml(safe(record.summary, ''))}</div>`;
      card.addEventListener('click', () => renderChartReviewTab('notes', index)); elements.recordList.appendChild(card);
    });
  };
  function drawFilter() {
    const list = $('recordList'); if (!list) return; let box = $('crFilterBar');
    if (!box) { box = document.createElement('div'); box.id = 'crFilterBar'; box.className = 'cr-filterbar'; list.parentNode.insertBefore(box, $('crSortBar') || list);
      box.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; cFilter = b.dataset.f; renderChartReviewTab('notes', 0); }); }
    if (currentChartTab !== 'notes') { box.style.display = 'none'; return; }
    const all = origArr(currentPatientData, 'notes'), counts = {}; all.forEach(r => { const k = kind(r); counts[k] = (counts[k] || 0) + 1; });
    const order = Object.keys(counts).sort((a, b) => (a === 'Provider' ? -2 : a === 'Nursing Note' ? -1 : 0) - (b === 'Provider' ? -2 : b === 'Nursing Note' ? -1 : 0) || a.localeCompare(b));
    if (cFilter !== 'All' && !counts[cFilter]) cFilter = 'All';
    box.style.display = ''; box.innerHTML = [['All', all.length]].concat(order.map(k => [k, counts[k]])).map(([k, n]) => `<button type="button" class="small-tool-button cr-chip${cFilter === k ? ' active' : ''}" data-f="${escapeHtml(k)}">${escapeHtml(k)} (${n})</button>`).join('');
  }
  const origTab = renderChartReviewTab;
  renderChartReviewTab = function () { const r = origTab.apply(this, arguments); try { drawFilter(); draw(); } catch (e) { /* optional */ } return r; }; // eslint-disable-line no-func-assign
  window.NSSort = { orders: () => oSort, review: () => cSort };
})();

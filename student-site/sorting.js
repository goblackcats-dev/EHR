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
  let cSort = { key: null, dir: 1 };
  const origArr = getChartReviewArray;
  getChartReviewArray = function () { // eslint-disable-line no-func-assign
    const list = origArr.apply(this, arguments);
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
  window.NSSort = { orders: () => oSort, review: () => cSort };
})();

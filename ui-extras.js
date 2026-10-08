/* v24 interface extras:
   - Lab Results: button that switches the newest results between the right and the left of the table.
   - Chart Review: draggable divider between the record list and the record, remembered on this device.
   - MAR: clicking a medication opens its detail card as a pop-up where you clicked, instead of at the top of the page. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };

  // ---- lab column order
  const labBtn = $('labOrderBtn');
  if (labBtn) {
    if (store.get('ns_lab_newest_left') === '1') { labNewestLeft = true; }
    const label = () => { labBtn.textContent = `Newest: ${labNewestLeft ? 'left' : 'right'}`; labBtn.classList.toggle('active', labNewestLeft); };
    label();
    labBtn.addEventListener('click', () => { labNewestLeft = !labNewestLeft; store.set('ns_lab_newest_left', labNewestLeft ? '1' : '0'); label(); selectedLabTime = null; renderLabResultsPage(currentPatientData); });
  }

  // ---- resizable record list / record divider
  const layout = document.querySelector('#chartReviewSection .chart-review-layout');
  if (layout) {
    const list = layout.querySelector('.record-list-panel'), detail = layout.querySelector('.record-detail-panel');
    const grip = document.createElement('div'); grip.className = 'layout-grip'; grip.title = 'Drag to resize'; grip.setAttribute('role', 'separator');
    layout.insertBefore(grip, detail);
    const apply = px => { layout.style.setProperty('--rl-left', px + 'px'); };
    const saved = parseInt(store.get('ns_notes_list_width') || '', 10); if (saved >= 200) apply(saved);
    let dragging = false;
    grip.addEventListener('pointerdown', e => { dragging = true; grip.setPointerCapture(e.pointerId); document.body.classList.add('resizing'); e.preventDefault(); });
    grip.addEventListener('pointermove', e => {
      if (!dragging) return;
      const r = layout.getBoundingClientRect(), px = Math.max(200, Math.min(r.width - 320, e.clientX - r.left));
      apply(Math.round(px));
    });
    const stop = () => { if (!dragging) return; dragging = false; document.body.classList.remove('resizing'); store.set('ns_notes_list_width', String(parseInt(getComputedStyle(layout).getPropertyValue('--rl-left'), 10) || '')); };
    grip.addEventListener('pointerup', stop); grip.addEventListener('pointercancel', stop);
    grip.addEventListener('dblclick', () => { layout.style.removeProperty('--rl-left'); store.set('ns_notes_list_width', ''); });
  }

  // ---- medication detail as a pop-up
  const card = $('marDetailCard');
  if (card) {
    const dlg = document.createElement('dialog'); dlg.id = 'marDetailDialog'; dlg.className = 'mar-detail-dialog';
    const close = document.createElement('button'); close.type = 'button'; close.className = 'icon-button mar-detail-close'; close.setAttribute('aria-label', 'Close'); close.textContent = '×';
    dlg.appendChild(close); dlg.appendChild(card); document.body.appendChild(dlg);
    close.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    let want = false;
    const rows = $('marRows');
    if (rows) rows.addEventListener('click', e => { want = !e.target.closest('.mar-event-pill'); }, true);
    const original = renderMARDetail;
    renderMARDetail = function (med) { const r = original.apply(null, arguments); if (want && med) { want = false; if (!dlg.open) dlg.showModal(); } return r; };
  }
})();

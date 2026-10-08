/* NursingSim - new orders must be acknowledged one by one (v39).
   Orders that arrive during the shift (after the simulation clock passes their start time) show a NEW tag and an Acknowledge button on the Orders page.
   Looking at the Orders page no longer clears them. Acknowledging opens a short review (the order, the nursing considerations, a checkbox that the order was
   read and understood) and records who/when; "Needs clarification" records that the nurse must call the provider and adds a worklist task.
   Orders written together by the same provider show an "Order set" tag. The left-menu badge counts orders still to acknowledge.
   Depends on app.js globals: currentCanonicalCase, simulationTime, simulationUnacknowledged, completedBrainTaskIds, renderOrdersTable, acknowledgeSection,
   updateNavigationBadges, renderOrdersPage, currentPatientData, safe, escapeHtml, persistCase. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const acks = () => { const cc = currentCanonicalCase; if (!cc) return {}; if (!cc.orderAck) cc.orderAck = {}; return cc.orderAck; };
  const pending = id => simulationUnacknowledged && simulationUnacknowledged.orders && simulationUnacknowledged.orders.has(id);

  // viewing the Orders page does not acknowledge anything any more
  const origAck = acknowledgeSection;
  acknowledgeSection = function (section) { // eslint-disable-line no-func-assign
    if (section === 'orders') { updateNavigationBadges(); return; }
    return origAck.apply(this, arguments);
  };

  const origTable = renderOrdersTable;
  renderOrdersTable = function (list) { // eslint-disable-line no-func-assign
    const r = origTable.apply(this, arguments);
    try {
      const all = (currentCanonicalCase && currentCanonicalCase.orders) || [];
      const rows = $('ordersTableBody') ? $('ordersTableBody').querySelectorAll('tr.order-row') : [];
      rows.forEach((tr, i) => {
        const o = list[i]; if (!o) return; const cell = tr.querySelector('.order-name'); if (!cell) return;
        const sameSet = all.filter(x => x.orderedAt && x.orderedAt === o.orderedAt && x.provider === o.provider).length;
        if (sameSet >= 3 && !cell.querySelector('.oa-set')) cell.insertAdjacentHTML('beforeend', ` <span class="oa-chip oa-set" title="Written together by ${esc(safe(o.provider))}">Order set (${sameSet})</span>`);
        const a = acks()[o.id];
        if (pending(o.id)) {
          cell.insertAdjacentHTML('beforeend', ' <span class="oa-chip oa-new">NEW</span> <button class="small-tool-button oa-btn" type="button">Acknowledge</button>');
          cell.querySelector('.oa-btn').addEventListener('click', ev => { ev.stopPropagation(); review(o); });
        } else if (a) cell.insertAdjacentHTML('beforeend', ` <span class="oa-chip ${a.clarify ? 'oa-clar' : 'oa-done'}">${a.clarify ? 'Clarification needed' : 'Acknowledged ' + esc(String(a.at).slice(11))}</span>`);
      });
    } catch (e) { /* optional */ }
    return r;
  };

  function review(o) {
    let dlg = $('oaDialog'); if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'oaDialog'; dlg.className = 'quiz-dialog'; document.body.appendChild(dlg); }
    const m = o.medication || {};
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Review new order</h2><p>${esc(safe(o.provider))} · ordered ${esc(safe(o.orderedAt || o.start))}</p></div><button id="oaClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div class="tc-card"><b>${esc(safe(o.name))}</b>${m.highAlert ? ' <span class="oa-chip oa-clar">HIGH-ALERT</span>' : ''}<br>${esc(safe(o.category))} · ${esc(safe(o.frequency))} · starts ${esc(safe(o.start))}${m.dose ? `<br>Dose: ${esc(safe(m.dose))} ${esc(safe(m.route, ''))}` : ''}</div>
        ${o.instructions ? `<p><b>Instructions:</b> ${esc(o.instructions)}</p>` : ''}${o.rationale ? `<p><b>Reason:</b> ${esc(o.rationale)}</p>` : ''}
        ${(o.nursingConsiderations || []).length ? `<p><b>Nursing considerations</b></p><ul>${o.nursingConsiderations.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
        <label class="qz-choice"><input type="checkbox" id="oaOk"> <span>I read the whole order, it is complete and makes sense for this patient, and I will carry it out${m.highAlert ? ' (with an independent double check)' : ''}.</span></label>
        <div id="oaMsg" class="mr-msg"></div>
        <div class="ho-actions"><button id="oaDo" class="primary-button">Acknowledge order</button> <button id="oaClar" class="secondary-button">Needs clarification (call provider)</button></div></div>`;
    $('oaClose').addEventListener('click', () => dlg.close());
    const finish = clar => {
      acks()[o.id] = { at: String(simulationTime), clarify: !!clar };
      simulationUnacknowledged.orders.delete(o.id); completedBrainTaskIds.add(`neworder_${o.id}`);
      if (clar) { if (!Array.isArray(currentCanonicalCase.simulationTasks)) currentCanonicalCase.simulationTasks = []; currentCanonicalCase.simulationTasks.push({ id: `clarify_${o.id}`, type: 'care', title: `Call provider to clarify: ${safe(o.name)}`, detail: `${safe(o.provider)}`, dueAt: String(simulationTime), target: 'orders', priority: 'due' }); }
      try { persistCase(); } catch (e) { /* best effort */ }
      dlg.close(); updateNavigationBadges(); renderOrdersPage(currentPatientData);
    };
    $('oaDo').addEventListener('click', () => { if (!$('oaOk').checked) { $('oaMsg').textContent = 'Check the box to confirm you reviewed the order.'; return; } finish(false); });
    $('oaClar').addEventListener('click', () => finish(true));
    dlg.showModal();
  }
  window.OrdersAck = { review, pending };
})();

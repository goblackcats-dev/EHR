/* NursingSim - students can write nursing notes (v68). A "New nursing note" button sits in the Chart Review > Notes detail header.
   The note is saved on the patient as a student-entered note under the signed-in name, timed at the current simulation time (never in the future),
   and is removed by Reset. Depends on app.js globals: currentCanonicalCase, simulationTime, refreshSimulationView, renderChartReviewTab, currentChartTab. */
(() => {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TYPES = ['Nursing progress note', 'Nursing shift assessment note', 'Event / change in condition note', 'Medication administration note', 'Patient education note', 'Focused note (SBAR)'];
  const TEMPLATES = { 'Focused note (SBAR)': 'S: \nB: \nA: \nR: ' };
  let dlg;
  const pad = n => String(n).padStart(2, '0');
  function open() {
    if (!currentCanonicalCase) return;
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'import-dialog'; dlg.id = 'nnDialog';
      dlg.innerHTML = `<div class="dialog-header"><div><h2>New nursing note</h2><p id="nnWho"></p></div><button id="nnClose" class="icon-button" aria-label="Close">×</button></div>
        <div class="dialog-body"><div style="display:grid;grid-template-columns:2fr 1fr;gap:10px"><label>Note type<select id="nnType" style="width:100%;padding:8px">${TYPES.map(t => `<option>${esc(t)}</option>`).join('')}</select></label>
        <label>Time<input id="nnTime" style="width:100%;padding:8px" readonly></label></div>
        <label style="display:block;margin-top:10px">Title<input id="nnTitle" style="width:100%;padding:8px" maxlength="90"></label>
        <label style="display:block;margin-top:10px">Note<textarea id="nnBody" style="width:100%;min-height:220px;padding:8px;font:16px/1.4 system-ui"></textarea></label>
        <div id="nnErr" style="color:#b00020;min-height:18px;font-size:13px"></div>
        <div class="dialog-actions"><button id="nnCancel" class="secondary-button">Cancel</button><button id="nnSave" class="primary-button">Sign note</button></div></div>`;
      document.body.appendChild(dlg);
      dlg.querySelector('#nnClose').addEventListener('click', () => dlg.close()); dlg.querySelector('#nnCancel').addEventListener('click', () => dlg.close());
      dlg.querySelector('#nnType').addEventListener('change', e => { const b = dlg.querySelector('#nnBody'); if (!b.value.trim() && TEMPLATES[e.target.value]) b.value = TEMPLATES[e.target.value]; });
      dlg.querySelector('#nnSave').addEventListener('click', save);
    }
    dlg.querySelector('#nnWho').textContent = `Written by ${window.NSUser ? NSUser.label() : 'you'}`;
    dlg.querySelector('#nnTime').value = String(simulationTime).slice(0, 16); dlg.querySelector('#nnTitle').value = ''; dlg.querySelector('#nnBody').value = ''; dlg.querySelector('#nnErr').textContent = '';
    dlg.showModal();
  }
  function save() {
    const body = dlg.querySelector('#nnBody').value.trim(), type = dlg.querySelector('#nnType').value;
    if (body.length < 5) { dlg.querySelector('#nnErr').textContent = 'Write the note before signing it.'; return; }
    const title = dlg.querySelector('#nnTitle').value.trim() || type, who = window.NSUser ? NSUser.label() : 'Student';
    const stamp = String(simulationTime).slice(0, 16), id = `note_student_${stamp.replace(/[^0-9]/g, '')}_${Date.now()}`;
    currentCanonicalCase.notes.push({ id, type: 'progressNotes', title, author: who, datetime: stamp, category: 'Nursing Note', summary: body.split('\n')[0].slice(0, 120), body, studentEntered: true, enteredBy: who });
    dlg.close(); refreshSimulationView();
    try { const recs = getChartReviewArray(currentPatientData, 'notes'); const idx = Math.max(0, recs.findIndex(r => r.id === id)); renderChartReviewTab('notes', idx); } catch (e) { renderChartReviewTab('notes', 0); }
  }
  function ensureButton() {
    const head = document.querySelector('.record-detail-header'); if (!head) return;
    let b = document.getElementById('newNursingNoteBtn');
    if (!b) { b = document.createElement('button'); b.id = 'newNursingNoteBtn'; b.className = 'primary-button'; b.textContent = '+ New nursing note'; b.style.cssText = 'margin-left:auto;min-height:36px'; b.addEventListener('click', open); head.appendChild(b); }
    b.style.display = (typeof currentChartTab !== 'undefined' && currentChartTab === 'notes') ? '' : 'none';
  }
  const orig = renderChartReviewTab;
  renderChartReviewTab = function () { const r = orig.apply(this, arguments); ensureButton(); return r; }; // eslint-disable-line no-func-assign
  ensureButton();
})();

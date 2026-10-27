/* NursingSim - Pre-Built Patients library (v53). Instructor pages only (EHR and Case Builder).
   A separate list of ready-made patients (LPN Med Pass, Case Study patients) chosen from anywhere. Selecting one lets you change only a few
   things (name, MRN, room, code status, allergies) before opening it. The list comes from prebuilt/index.json (node tools/make-prebuilt.js). */
(() => {
  'use strict';
  if (window.NS_STUDENT) return;
  const inBuilder = location.pathname.includes('/case-builder/'), pre = inBuilder ? '../' : '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ALLERGENS = [['Penicillin', 'Hives', 'High'], ['Sulfa drugs', 'Rash', 'Moderate'], ['Cephalosporins', 'Rash', 'Moderate'], ['Codeine', 'Nausea and vomiting', 'Moderate'], ['NSAIDs (ibuprofen)', 'Bronchospasm', 'High'],
    ['Aspirin', 'Hives', 'Moderate'], ['Latex', 'Contact dermatitis', 'Moderate'], ['Iodine / contrast dye', 'Hives', 'Moderate'], ['Lidocaine', 'Rash', 'Moderate'], ['Eggs', 'Hives', 'Moderate'], ['Shellfish', 'Anaphylaxis', 'High']];
  let dlg, lib = null, groupId = null, chosen = null, canon = null, allergies = [];
  const box = () => dlg.querySelector('#pbBody');

  async function loadLib() { if (lib) return lib; const r = await fetch(pre + 'prebuilt/index.json', { cache: 'no-store' }); if (!r.ok) throw new Error('missing'); lib = (await r.json()).groups || []; return lib; }

  function renderList() {
    const g = lib.find(x => x.id === groupId) || lib[0]; groupId = g.id;
    box().innerHTML = `<div class="pb-tabs" style="display:flex;gap:6px;margin:0 0 10px">${lib.map(x => `<button class="${x.id === g.id ? 'primary-button' : 'secondary-button'}" data-g="${esc(x.id)}">${esc(x.title)} (${x.patients.length})</button>`).join('')}</div>
      <p style="color:#5d6b7a;margin:0 0 10px">${esc(g.note || '')}</p>` +
      g.patients.map((p, i) => `<button class="pb-row" data-p="${i}" style="display:block;width:100%;text-align:left;border:1px solid #c9d4e2;background:#fff;border-radius:3px;padding:10px 12px;margin:0 0 8px;cursor:pointer;min-height:44px">
        <b>${esc(p.name)}</b>, ${esc(p.age)} ${esc(p.sex === 'Female' ? 'F' : 'M')} &middot; ${esc(p.title)}<div style="color:#5d6b7a;font-size:12px">${esc(p.desc)}</div></button>`).join('');
    box().querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => { groupId = b.dataset.g; renderList(); }));
    box().querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => pick(g.patients[+b.dataset.p])));
  }

  async function pick(p) {
    box().innerHTML = '<p>Loading…</p>';
    try {
      const r = await fetch(pre + p.file, { cache: 'no-store' }); if (!r.ok) throw new Error('missing');
      const j = await r.json(); canon = j.canonical || j; chosen = p;
      allergies = (canon.patient.allergies || []).filter(a => a.substance && !/^NKDA$/i.test(a.substance)).map(a => ({ substance: a.substance, reaction: a.reaction || '', severity: a.severity || 'Moderate' }));
      renderEdit();
    } catch (e) { box().innerHTML = '<p style="color:#b00020">That patient could not be loaded.</p><button class="secondary-button" id="pbBack">Back</button>'; box().querySelector('#pbBack').addEventListener('click', renderList); }
  }

  function renderEdit() {
    const pt = canon.patient, en = canon.encounter || {};
    const chip = (a, on) => `<button type="button" class="${on ? 'primary-button' : 'secondary-button'}" data-al="${esc(a[0])}" style="min-height:40px;margin:0 6px 6px 0">${esc(a[0])}</button>`;
    const custom = allergies.filter(a => !ALLERGENS.some(x => x[0] === a.substance));
    box().innerHTML = `<button class="secondary-button" id="pbBack" style="margin-bottom:10px">&larr; Back to list</button>
      <h3 style="margin:0 0 4px">${esc(chosen.title)}</h3><p style="color:#5d6b7a;margin:0 0 12px">${esc(chosen.desc)}. Only the items below can be changed here.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:12px">
        <label>Name<input id="pbName" value="${esc(pt.name)}" style="width:100%;padding:8px"></label>
        <label>MRN<input id="pbMrn" value="${esc(pt.mrn)}" style="width:100%;padding:8px"></label>
        <label>Room<input id="pbRoom" value="${esc(en.room || '')}" style="width:100%;padding:8px"></label>
        <label>Code status<select id="pbCode" style="width:100%;padding:8px">${['Full Code', 'DNR', 'DNR/DNI', 'Comfort measures'].map(c => `<option${c === (en.codeStatus || 'Full Code') ? ' selected' : ''}>${c}</option>`).join('')}</select></label>
      </div>
      <div><b>Allergies</b> <span style="color:#5d6b7a">(tap to add or remove; none selected = no known allergies)</span></div>
      <div id="pbAl" style="margin:8px 0">${ALLERGENS.map(a => chip(a, allergies.some(x => x.substance === a[0]))).join('')}${custom.map(a => chip([a.substance], true)).join('')}</div>
      <div style="display:flex;gap:6px;margin-bottom:14px"><input id="pbOther" placeholder="Other allergy (e.g. Kiwi)" style="flex:1;padding:8px"><input id="pbOtherRx" placeholder="Reaction" style="flex:1;padding:8px"><button class="secondary-button" id="pbAddOther">Add</button></div>
      <button class="primary-button" id="pbOpen" style="min-height:44px">Open this patient</button>`;
    box().querySelector('#pbBack').addEventListener('click', renderList);
    box().querySelectorAll('[data-al]').forEach(b => b.addEventListener('click', () => {
      const name = b.dataset.al, i = allergies.findIndex(x => x.substance === name);
      if (i >= 0) allergies.splice(i, 1); else { const a = ALLERGENS.find(x => x[0] === name); allergies.push({ substance: name, reaction: a ? a[1] : 'Reaction not documented', severity: a ? a[2] : 'Moderate' }); }
      keepFields(); renderEdit();
    }));
    box().querySelector('#pbAddOther').addEventListener('click', () => { const n = box().querySelector('#pbOther').value.trim(); if (!n) return; allergies.push({ substance: n, reaction: box().querySelector('#pbOtherRx').value.trim() || 'Reaction not documented', severity: 'Moderate' }); keepFields(); renderEdit(); });
    box().querySelector('#pbOpen').addEventListener('click', openPatient);
  }
  const edits = {};
  function keepFields() { ['Name', 'Mrn', 'Room', 'Code'].forEach(k => { const el = box().querySelector('#pb' + k); if (el) edits[k] = el.value; }); const pt = canon.patient, en = canon.encounter || (canon.encounter = {}); if (edits.Name) pt.name = edits.Name; if (edits.Mrn) pt.mrn = edits.Mrn; if (edits.Room !== undefined) en.room = edits.Room; if (edits.Code) en.codeStatus = edits.Code; }

  function openPatient() {
    keepFields(); const pt = canon.patient;
    pt.preferredName = String(pt.name || '').split(' ')[0];
    pt.allergies = allergies.length ? allergies : [{ substance: 'NKDA', reaction: '', severity: '' }];
    if (inBuilder) {
      try { localStorage.setItem('nursingsim.case.v1', JSON.stringify({ canonical: canon, simulationTime: canon.timeline && canon.timeline.simulationStart })); window.location.href = '../index.html'; }
      catch (e) { alert('This browser would not let the builder pass the patient to the EHR.'); }
      return;
    }
    try { const r = validateCaseInput(canon); if (r.errors > 0) throw new Error('This patient file has problems.'); renderPatient(r.canonical); dlg.close(); } catch (e) { alert(e.message || 'Could not open the patient.'); }
  }

  async function open() {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'import-dialog'; dlg.id = 'pbDialog';
      dlg.innerHTML = '<div class="dialog-header"><div><h2>Pre-Built Patients</h2><p>Ready-made patients for med passes and case studies. Choose one to open it.</p></div><button id="pbClose" class="icon-button" aria-label="Close">×</button></div><div class="dialog-body" id="pbBody"></div>';
      document.body.appendChild(dlg); dlg.querySelector('#pbClose').addEventListener('click', () => dlg.close());
    }
    dlg.showModal(); box().innerHTML = '<p>Loading…</p>';
    try { await loadLib(); renderList(); } catch (e) { box().innerHTML = '<p style="color:#b00020">The pre-built patient list could not be loaded.</p>'; }
  }

  const actions = document.querySelector('.top-actions'); if (!actions) return;
  const b = document.createElement('button'); b.id = 'openPrebuiltBtn'; b.textContent = 'Pre-Built Patients';
  b.className = inBuilder ? 'ghost-button' : 'top-link top-button'; b.addEventListener('click', open);
  actions.insertBefore(b, actions.firstChild);
})();

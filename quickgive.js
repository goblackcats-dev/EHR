/* NursingSim - Quick give (v96). An option for simulations where the instructor wants the students to SAY they give the medication, not scan it:
   with Quick give ON, tapping a due dose on the MAR gives it at once (ordered dose, current patient time), with no scanning and no give window.
   If the dose needs something typed (insulin units, an injection site, a time problem) the normal give window opens instead.
   Instructor: Tools > "Quick give" button, or the Class session window (it then applies to every student in the session). */
(() => {
  'use strict';
  const KEY = 'nursingsim.quickGive';
  let session = null;                    // set by the class session: true/false for students; null = this device's own setting
  const local = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const on = () => (session === null ? (!window.NS_STUDENT && local()) : !!session);
  function toast(text) { const t = document.createElement('div'); t.className = 'cs-say'; t.style.background = '#1b6e3a'; t.style.top = 'auto'; t.style.bottom = '70px'; t.textContent = text; document.body.appendChild(t); setTimeout(() => t.remove(), 3500); }
  const prev = openMARActionDialog;
  openMARActionDialog = function (med, event) { // eslint-disable-line no-func-assign
    const d = document.getElementById('marActionDialog');
    if (!on() || !d || !event || String(event.state || '').toLowerCase() !== 'due') return prev.apply(this, arguments);
    let ok = false; d.showModal = function () { /* stay hidden while we decide */ };
    try {
      prev.call(this, med, event);
      const bad = (typeof marActionTimeProblem === 'function' && marActionTimeProblem()) || (typeof marActionFormProblem === 'function' && marActionFormProblem('given'));
      if (!bad) { window.NS_QUICK_GIVE = true; try { applyMARAction('given'); ok = true; } finally { window.NS_QUICK_GIVE = false; } }
    } finally { delete d.showModal; }
    if (ok) { if (d.open) d.close(); toast(`Given: ${String(med.name || '').slice(0, 60)} (${String(event.time || '')})`); }
    else if (!d.open) d.showModal();
  };
  function setLocal(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* ignore */ } draw(); }
  function draw() { const b = document.getElementById('qgBtn'); if (b) { b.textContent = 'Quick give: ' + (local() ? 'ON' : 'off'); b.classList.toggle('active', local()); } }
  function addBtn() {
    if (window.NS_STUDENT) return; const bar = document.querySelector('.top-actions'); if (!bar || document.getElementById('qgBtn')) return;
    const b = document.createElement('button'); b.type = 'button'; b.id = 'qgBtn'; b.className = 'small-tool-button'; b.title = 'Students tap a due dose to give it (no scanning)';
    b.addEventListener('click', () => setLocal(!local())); bar.appendChild(b); draw();
  }
  addBtn();
  window.NSQuick = { on, local, setLocal, setSession: v => { session = v === null || v === undefined ? null : !!v; }, isSession: () => session !== null };
})();

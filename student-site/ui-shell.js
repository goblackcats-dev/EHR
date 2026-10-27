/* NursingSim - Epic-style shell (v46). Moves the instructor/utility buttons into one "Tools" menu so the header looks like a real chart.
   Students keep "Open Patient" and "My Results" in the bar. Nothing is removed; the buttons only move. */
(() => {
  'use strict';
  const bar = document.querySelector('.top-actions'); if (!bar) return;
  const KEEP = new Set(['stuOpenBtn', 'stuResultsBtn', 'openPrebuiltBtn']);
  const wrap = document.createElement('div'); wrap.className = 'tools-menu';
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'tools-btn'; btn.id = 'toolsMenuBtn'; btn.textContent = window.NS_STUDENT ? 'Practice tools ▾' : 'Instructor tools ▾'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
  const pop = document.createElement('div'); pop.className = 'tools-pop hidden'; pop.id = 'toolsPop';
  wrap.appendChild(btn); wrap.appendChild(pop); bar.insertBefore(wrap, bar.firstChild);
  const close = () => { pop.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', e => { e.stopPropagation(); const open = pop.classList.toggle('hidden') === false; btn.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  pop.addEventListener('click', e => { if (e.target.closest('button, a')) close(); });
  function sweep() {
    [...bar.children].forEach(el => { if (el === wrap || KEEP.has(el.id)) return; pop.appendChild(el); });
    wrap.classList.toggle('hidden', !pop.children.length);
  }
  sweep(); new MutationObserver(sweep).observe(bar, { childList: true });
})();

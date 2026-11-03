/* NursingSim - Back arrow (v103). A big "Back" arrow at the top takes the student to the screen they were on before
   (the previous page of the chart, with the same Chart Review tab). Keeps the last 40 screens. Wraps setMainSection from app.js. */
(() => {
  'use strict';
  const hist = []; let cur = null, going = false;
  const orig = setMainSection;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.id = 'navBackBtn'; btn.className = 'nav-back-btn'; btn.title = 'Back to the previous screen'; btn.setAttribute('aria-label', 'Back to the previous screen'); btn.innerHTML = '<span aria-hidden="true">←</span> Back';
  const brand = document.querySelector('.logo'); const host = brand ? brand.parentNode : document.querySelector('header, .top-bar');
  if (host) host.insertBefore(btn, host.firstChild); else document.body.insertBefore(btn, document.body.firstChild);
  const draw = () => { btn.disabled = !hist.length; };
  setMainSection = function (section, tabKey) { // eslint-disable-line no-func-assign
    const r = orig.apply(this, arguments);
    if (!going) {
      const next = { section: currentMainSection, tab: typeof currentChartTab !== 'undefined' ? currentChartTab : null };
      if (cur && (cur.section !== next.section || (next.section === 'chartReview' && cur.tab !== next.tab))) { hist.push(cur); if (hist.length > 40) hist.shift(); }
      cur = next;
    }
    draw(); return r;
  };
  btn.addEventListener('click', () => {
    const prev = hist.pop(); if (!prev) return;
    going = true; try { orig(prev.section, prev.section === 'chartReview' ? prev.tab : null); } finally { going = false; }
    cur = prev; draw();
  });
  cur = { section: typeof currentMainSection !== 'undefined' ? currentMainSection : 'patientSummary', tab: null }; draw();
  window.NSBack = { depth: () => hist.length };
})();

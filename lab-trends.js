/* NursingSim - Results Review upgrades (v35): trend graph for the selected test, "new, not reviewed" markers, and a list of labs still to be drawn.
   - Selecting a result shows a graph of that test over time with the reference range shaded (abnormal points red).
   - Results collected during this shift show a blue dot until the nurse taps them (or presses "Mark all reviewed"). The status line counts unreviewed results.
   - "Coming up" lists lab draws that are ordered but not yet collected.
   Reviewed results are saved with the patient (labsSeen).
   Depends on app.js globals: currentCanonicalCase, simulationTime, currentPatientData, elements, getAllLabResults, parseSimDate, safe, escapeHtml, persistCase, NSChart (charts.js). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const keyOf = lab => `${safe(lab.test)}|${safe(lab.collected)}`;
  const seenSet = () => { const cc = currentCanonicalCase; if (!cc) return new Set(); if (!Array.isArray(cc.labsSeen)) cc.labsSeen = []; return new Set(cc.labsSeen); };
  const shiftStart = () => String(((currentCanonicalCase || {}).timeline || {}).simulationStart || '');
  const isNew = lab => !!currentCanonicalCase && String(lab.collected) >= shiftStart() && !seenSet().has(keyOf(lab));
  const markSeen = lab => { const s = seenSet(); if (!s.has(keyOf(lab))) { s.add(keyOf(lab)); currentCanonicalCase.labsSeen = Array.from(s); try { persistCase(); } catch (e) { /* best effort */ } } };

  // reference text such as "4-10.5", "<100", ">3.5", "7.35-7.45" to a [lo, hi] band
  function band(ref) {
    const t = String(ref || '').replace(/,/g, ''); let m;
    if ((m = t.match(/(-?\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d+(?:\.\d+)?)/))) return [parseFloat(m[1]), parseFloat(m[2])];
    if ((m = t.match(/[<≤]\s*(-?\d+(?:\.\d+)?)/))) return [0, parseFloat(m[1])];
    if ((m = t.match(/[>≥]\s*(-?\d+(?:\.\d+)?)/))) return [parseFloat(m[1]), parseFloat(m[1]) * 1.6];
    return null;
  }

  // ---- new-result dot in the grid
  const origFormat = formatLabResultValue;
  formatLabResultValue = function (lab) { // eslint-disable-line no-func-assign
    const html = origFormat.apply(this, arguments);
    return lab && isNew(lab) ? `${html}<span class="lab-newdot" title="New result, not reviewed">●</span>` : html;
  };

  // ---- graph in the detail panel; clicking a cell marks it reviewed
  let clicked = false;
  const gridBody = $('resultsGridBody');
  if (gridBody) gridBody.addEventListener('click', e => { if (e.target.closest('.result-cell')) clicked = true; }, true);
  const origDetail = renderLabDetail;
  renderLabDetail = function (lab) { // eslint-disable-line no-func-assign
    const r = origDetail.apply(this, arguments);
    try {
      if (clicked) { markSeen(lab); clicked = false; const d = document.querySelector('#resultsGridBody .selected-cell .lab-newdot'); if (d) d.remove(); try { enhance(); } catch (e2) { /* optional */ } }
      const all = getAllLabResults(currentPatientData).filter(l => safe(l.test) === safe(lab.test) && isFinite(parseFloat(l.result)));
      const pts = all.map(l => ({ t: NSChart.ms(l.collected), v: parseFloat(l.result), abn: !!safe(l.flag, ''), text: `${safe(l.result)} ${l.units || ''}`.trim() })).filter(p => isFinite(p.t));
      if (pts.length >= 2) {
        const ref = lab.reference || (all[0] && all[0].reference), b = band(ref);
        const html = `<div class="nc-card" style="margin-top:10px"><div class="nc-title">${esc(safe(lab.test))} trend${lab.units ? ' (' + esc(lab.units) + ')' : ''} <span class="fs-muted">${b ? 'green band = reference ' + esc(safe(ref, '')) : ''}</span></div><div id="labReadout" class="fs-muted">Tap a dot to read it.</div>${NSChart.svg([{ name: safe(lab.test), color: '#1f5fa8', points: pts }], { band: b, width: 520, height: 150, now: NSChart.ms(simulationTime), label: safe(lab.test) + ' trend' })}</div>`;
        elements.labDetailBody.insertAdjacentHTML('beforeend', html);
        elements.labDetailBody.querySelectorAll('.nc-pt').forEach(c => c.addEventListener('click', () => { const r2 = $('labReadout'); if (r2) r2.textContent = c.getAttribute('data-read'); }));
      }
    } catch (e) { /* the graph is optional */ }
    return r;
  };

  // ---- status line, "mark all reviewed", and the coming-up list
  function enhance() {
    const card = document.querySelector('#labResultsSection .results-toolbar-actions'); if (!card) return;
    if (!$('labReviewAllBtn')) {
      const b = document.createElement('button'); b.className = 'small-tool-button'; b.id = 'labReviewAllBtn'; b.textContent = 'Mark all reviewed';
      b.addEventListener('click', () => { const s = seenSet(); getAllLabResults(currentPatientData).forEach(l => s.add(keyOf(l))); currentCanonicalCase.labsSeen = Array.from(s); try { persistCase(); } catch (e) { /* best effort */ } renderLabResultsPage(currentPatientData); });
      card.appendChild(b);
    }
    const n = getAllLabResults(currentPatientData).filter(isNew).length;
    const t = `${elements.labStatus.textContent.replace(/ \| \d+ new$/, '')}${n ? ` | ${n} new` : ''}`; if (elements.labStatus.textContent !== t) elements.labStatus.textContent = t;
    const rb = $('labReviewAllBtn'); if (rb) rb.classList.toggle('hidden', !n);
    // coming up
    let box = $('labComing'); const panel = document.querySelector('#labResultsSection .results-grid-panel');
    if (!box && panel) { box = document.createElement('div'); box.id = 'labComing'; box.className = 'lab-coming'; panel.parentNode.insertBefore(box, panel); }
    if (box) {
      const now = parseSimDate(simulationTime), vis = getVisibleCanonicalCase(currentCanonicalCase);
      void vis;
      const up = (currentCanonicalCase.orders || []).filter(o => /laborator/i.test(safe(o.category)) && /pending|active/i.test(safe(o.status)) && String(o.start) > String(simulationTime) && (parseSimDate(o.start) - now) <= 4 * 3600000).sort((a, b) => String(a.start).localeCompare(String(b.start))).slice(0, 6);
      const html = up.length ? `<b>Coming up:</b> ${up.map(o => `${esc(safe(o.name))} at ${esc(String(o.start).slice(11))} (ordered, not yet collected)`).join('; ')}` : '';
      if (box.innerHTML !== html) box.innerHTML = html; box.classList.toggle('hidden', !html);
    }
  }
  const origPage = renderLabResultsPage;
  renderLabResultsPage = function () { const r = origPage.apply(this, arguments); try { enhance(); } catch (e) { /* optional */ } return r; }; // eslint-disable-line no-func-assign
  window.LabTrends = { band, isNew, enhance };
})();

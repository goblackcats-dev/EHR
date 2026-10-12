/* NursingSim - trend graphs (v34). A small chart helper (NSChart) plus the Flowsheet "Vitals graph" window.
   Graphs show only what has been charted up to the current simulation time. Points outside the normal range are red; the normal range is shaded.
   Tap or hover a point to read the exact value and time. Used by Flowsheets here and by Results Review (lab trends).
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, parseSimDate, safe, escapeHtml, epicDate. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const ms = t => { const d = parseSimDate(t); return d ? d.getTime() : NaN; };
  const p2 = n => String(n).padStart(2, '0');
  const fmtTime = (t, span) => { const d = new Date(t); return span > 36 * 3600000 ? `${p2(d.getMonth() + 1)}/${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}` : `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  const nice = (lo, hi) => { if (hi - lo < 1e-9) { lo -= 1; hi += 1; } const pad = (hi - lo) * 0.12; return [lo - pad, hi + pad]; };

  // series: [{ name, color, points: [{ t (ms), v (number), abn (bool), text }] }]; opts: { width, height, band: [lo, hi], unit, tMin, tMax, now (ms), yMin, yMax }
  function svg(series, opts) {
    opts = opts || {};
    const W = opts.width || 640, H = opts.height || 150, L = 44, R = 12, T = 10, B = 24;
    const pts = series.flatMap(s => s.points).filter(p => isFinite(p.t) && isFinite(p.v));
    if (!pts.length) return `<div class="nc-empty">No values charted yet.</div>`;
    let tMin = opts.tMin != null ? opts.tMin : Math.min(...pts.map(p => p.t)), tMax = opts.tMax != null ? opts.tMax : Math.max(...pts.map(p => p.t));
    if (tMax - tMin < 3600000) tMax = tMin + 3600000;
    let lo = Math.min(...pts.map(p => p.v)), hi = Math.max(...pts.map(p => p.v));
    if (opts.band) { lo = Math.min(lo, opts.band[0]); hi = Math.max(hi, opts.band[1]); }
    let [yMin, yMax] = nice(lo, hi); if (opts.yMin != null) yMin = opts.yMin; if (opts.yMax != null) yMax = opts.yMax;
    const X = t => L + (t - tMin) / (tMax - tMin) * (W - L - R), Y = v => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);
    let g = '';
    if (opts.band) g += `<rect x="${L}" y="${Y(Math.min(opts.band[1], yMax))}" width="${W - L - R}" height="${Math.max(0, Y(Math.max(opts.band[0], yMin)) - Y(Math.min(opts.band[1], yMax)))}" fill="#e6f4ea" opacity=".9"/>`;
    for (let i = 0; i <= 3; i++) { const v = yMin + (yMax - yMin) * i / 3, y = Y(v); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="#e3e9f1"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" class="nc-ax">${Math.abs(v) >= 20 ? Math.round(v) : Math.round(v * 10) / 10}</text>`; }
    for (let i = 0; i <= 4; i++) { const t = tMin + (tMax - tMin) * i / 4, x = X(t); g += `<line x1="${x}" x2="${x}" y1="${T}" y2="${H - B}" stroke="#f0f3f8"/><text x="${x}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}" class="nc-ax">${fmtTime(t, tMax - tMin)}</text>`; }
    if (opts.now && opts.now >= tMin && opts.now <= tMax) g += `<line x1="${X(opts.now)}" x2="${X(opts.now)}" y1="${T}" y2="${H - B}" stroke="#7a8aa0" stroke-dasharray="4 3"/>`;
    series.forEach(s => {
      const sp = s.points.filter(p => isFinite(p.t) && isFinite(p.v)).sort((a, b) => a.t - b.t); if (!sp.length) return;
      g += `<polyline fill="none" stroke="${s.color || '#1f5fa8'}" stroke-width="2" points="${sp.map(p => `${X(p.t).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ')}"/>`;
      sp.forEach(p => { g += `<circle class="nc-pt${p.abn ? ' abn' : ''}" cx="${X(p.t).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${p.abn ? 5 : 4}" fill="${p.abn ? '#c62828' : (s.color || '#1f5fa8')}" stroke="#fff" stroke-width="1.5" data-read="${esc(`${s.name}: ${p.text || p.v} at ${fmtTime(p.t, 0)}${p.abn ? ' (abnormal)' : ''}`)}"><title>${esc(`${s.name}: ${p.text || p.v} at ${fmtTime(p.t, 0)}`)}</title></circle>`; });
    });
    return `<svg class="nc-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Trend graph')}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  }

  // ------------------------------------------------------------------ vitals graph window
  const num = s => { const m = String(s).match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
  const toF = (o) => { const v = num(o.value); return /°?\s*C\b/i.test(String(o.value) + ' ' + String(o.units || '')) && v < 60 ? v * 9 / 5 + 32 : v; };
  function vitalSeries() {
    const cc = currentCanonicalCase; if (!cc) return [];
    const vis = getVisibleCanonicalCase(cc), v = (vis.observations || []).filter(o => o.type === 'vital');
    const of = code => v.filter(o => o.code === code).sort((a, b) => String(a.collected).localeCompare(String(b.collected)));
    const mk = (o, val, text) => ({ t: ms(o.collected), v: val, abn: !!o.flag, text: text || String(o.value) });
    return [
      { key: 'HR', title: 'Heart rate (bpm)', band: [60, 100], series: [{ name: 'HR', color: '#1f5fa8', points: of('HR').map(o => mk(o, num(o.value))) }] },
      { key: 'BP', title: 'Blood pressure (mmHg)', band: [90, 140], series: [{ name: 'Systolic', color: '#1f5fa8', points: of('BP').map(o => mk(o, parseFloat(String(o.value).split('/')[0]), String(o.value))) }, { name: 'Diastolic', color: '#7a9ccb', points: of('BP').map(o => mk(Object.assign({}, o, { flag: '' }), parseFloat(String(o.value).split('/')[1]), String(o.value))) }] },
      { key: 'RR', title: 'Respiratory rate (breaths/min)', band: [12, 20], series: [{ name: 'RR', color: '#1f5fa8', points: of('RR').map(o => mk(o, num(o.value))) }] },
      { key: 'SPO2', title: 'Oxygen saturation (%)', band: [92, 100], series: [{ name: 'SpO2', color: '#1f5fa8', points: of('SPO2').map(o => mk(o, num(o.value))) }] },
      { key: 'TEMP', title: 'Temperature (°F)', band: [97, 100.4], series: [{ name: 'Temp', color: '#1f5fa8', points: of('TEMP').map(o => mk(o, toF(o), String(o.value))) }] },
      { key: 'PAIN', title: 'Pain (0 to 10)', band: null, series: [{ name: 'Pain', color: '#1f5fa8', points: of('PAIN').map(o => mk(o, num(o.value))) }] }
    ].filter(g => g.series.some(s => s.points.length));
  }
  function openVitals() {
    if (!currentCanonicalCase) { alert('Load a patient first.'); return; }
    let dlg = $('vgDialog'); if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'vgDialog'; dlg.className = 'quiz-dialog'; document.body.appendChild(dlg); }
    const groups = vitalSeries(), all = groups.flatMap(g => g.series.flatMap(s => s.points)).map(p => p.t).filter(isFinite);
    const tMin = Math.min(...all), now = ms(simulationTime), tMax = Math.max(Math.max(...all), now);
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Vitals graph</h2><p>Everything charted up to ${esc(epicDate(simulationTime))}. Red dots are outside the normal range (green band). Tap a dot to read it. The dashed line is now.</p></div><button id="vgClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><div id="vgRead" class="nc-read">Tap a dot to see its value.</div>${groups.length ? groups.map(g => `<div class="nc-card"><div class="nc-title">${esc(g.title)}${g.series.length > 1 ? ' <span class="fs-muted">' + g.series.map(s => s.name).join(' / ') + '</span>' : ''}</div>${svg(g.series, { band: g.band, tMin, tMax, now, label: g.title })}</div>`).join('') : '<div class="empty-state">No vital signs charted yet.</div>'}</div>`;
    $('vgClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { const c = e.target.closest && e.target.closest('.nc-pt'); if (c) $('vgRead').textContent = c.getAttribute('data-read'); });
    if (!dlg.open) dlg.showModal();
  }

  function addButton() {
    const bar = document.querySelector('#flowsheetsSection .flowsheet-toolbar-actions'); if (!bar || $('vgBtn')) return;
    const b = document.createElement('button'); b.className = 'small-tool-button'; b.id = 'vgBtn'; b.textContent = 'Vitals graph'; b.addEventListener('click', openVitals);
    bar.insertBefore(b, bar.firstChild);
  }
  addButton();
  const sec = $('flowsheetsSection'); if (sec) new MutationObserver(() => { if (!$('vgBtn')) addButton(); }).observe(sec, { childList: true, subtree: true });
  window.NSChart = { svg, vitalSeries, openVitals, ms, fmtTime };
})();

/* NursingSim - Storyboard and Epic-style Chart Review tabs (v32).
   Storyboard: a patient card kept at the bottom of the left menu on every screen (name, age, MRN, room, code status, isolation, allergies,
   fall risk, weight, attending, hospital day, diet, active lines). It updates when the patient or the simulation clock changes.
   Chart Review: adds Epic's Encounters and Procedures tabs, and Labs and Meds shortcut tabs that jump to Lab Results and the MAR.
   Depends on app.js globals: currentCanonicalCase, simulationTime, getVisibleCanonicalCase, safe, escapeHtml, epicDate, setMainSection, renderChartReviewTab, chartTabLabels. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const uniq = a => Array.from(new Set(a));
  const KEY = 'nursingsim_storyboard_collapsed';
  const getC = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const setC = v => { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* ignore */ } };

  // ------------------------------------------------------------------ storyboard
  function ensure() {
    let box = $('storyboard'); if (box) return box;
    const side = document.querySelector('.sidebar'); if (!side) return null;
    box = document.createElement('div'); box.id = 'storyboard'; box.className = 'storyboard'; side.appendChild(box);
    return box;
  }
  function draw() {
    const box = ensure(); if (!box) return;
    const cc = window.currentCanonicalCase || (typeof currentCanonicalCase !== 'undefined' ? currentCanonicalCase : null);
    if (!cc || !cc.patient) { box.innerHTML = ''; box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    const p = cc.patient, e = cc.encounter || {}, vis = getVisibleCanonicalCase(cc);
    const al = (p.allergies || []).filter(a => a.substance && !/^(nkda|none)/i.test(a.substance));
    const code = safe(e.codeStatus, 'Full Code'), full = /full/i.test(code);
    const dev = (vis.devices || cc.devices || []).filter(d => !/removed/i.test(safe(d.status)));
    const collapsed = getC();
    const row = (k, v) => v && v !== '—' ? `<div class="sb-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>` : '';
    const dob = String(p.dob || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    box.innerHTML = `<button class="sb-head" id="sbToggle" aria-expanded="${!collapsed}"><span>Storyboard</span><span class="sb-caret">${collapsed ? '▸' : '▾'}</span></button>` + (collapsed ? '' : `
      <div class="sb-name">${esc(safe(p.name))}</div>
      <div class="sb-sub">${esc(safe(p.age))} y.o. ${esc(safe(p.sex))}${dob ? ' · ' + dob[2] + '/' + dob[3] + '/' + dob[1] : ''}</div>
      <div class="sb-chips"><span class="sb-chip ${full ? 'ok' : 'warn'}">${esc(code)}</span>${e.isolation && !/^none$/i.test(e.isolation) ? `<span class="sb-chip iso">${esc(e.isolation)}</span>` : ''}${/high/i.test(safe(e.fallRisk)) ? '<span class="sb-chip warn">Fall risk</span>' : ''}</div>
      <div class="sb-allergy ${al.length ? 'has' : ''}"><span>Allergies</span><b>${al.length ? esc(al.map(a => a.substance + (a.reaction ? ' (' + a.reaction + ')' : '')).join('; ')) : 'No known allergies'}</b></div>
      ${row('MRN', p.mrn)}${row('Room', [e.location, e.room].filter(Boolean).join(' '))}${row('Hospital day', e.hospitalDay ? String(e.hospitalDay) : '')}${row('Admitted', e.admitDate ? epicDate(e.admitDate).slice(0, 8) : '')}
      ${row('Weight', p.weightKg ? p.weightKg + ' kg' : '')}${row('Height', p.heightCm ? p.heightCm + ' cm' : '')}${row('Attending', e.attending)}${row('Diet', e.dietOrder ? String(e.dietOrder).slice(0, 40) : '')}
      ${dev.length ? `<div class="sb-lda"><span>Lines and devices</span>${dev.slice(0, 5).map(d => `<div>${esc(safe(d.type))}${d.location ? ' · ' + esc(safe(d.location)) : ''}</div>`).join('')}${dev.length > 5 ? `<div class="fs-muted">+${dev.length - 5} more</div>` : ''}</div>` : ''}`);
    $('sbToggle').addEventListener('click', () => { setC(!getC()); draw(); });
  }
  // wrap so the card refreshes when a patient opens or the clock moves
  if (typeof renderPatient === 'function') { const orig = renderPatient; renderPatient = function () { const r = orig.apply(this, arguments); draw(); return r; }; }
  if (typeof refreshSimulationView === 'function') { const orig2 = refreshSimulationView; refreshSimulationView = function () { const r = orig2.apply(this, arguments); draw(); return r; }; }

  // ------------------------------------------------------------------ chart review tabs
  const rec = (title, author, datetime, category, summary, body) => ({ title, author, datetime, category, summary, body: Array.isArray(body) ? body.join('\n') : body });
  function encounters() {
    const cc = currentCanonicalCase; if (!cc) return [];
    const vis = getVisibleCanonicalCase(cc), e = cc.encounter || {}, out = [];
    out.push(rec(`Inpatient admission: ${safe(e.diagnosis)}`, safe(e.attending), safe(e.admitDate), 'Inpatient encounter', `Hospital day ${safe(e.hospitalDay)} on ${safe(e.location)} ${safe(e.room)}`,
      [`**Location:** ${safe(e.location)} ${safe(e.room)}`, `**Attending:** ${safe(e.attending)}`, `**Admitted:** ${epicDate(e.admitDate)}`, `**Chief complaint:** ${safe(e.chiefComplaint)}`, `**Code status:** ${safe(e.codeStatus)}`, `**Isolation:** ${safe(e.isolation, 'None')}`, `**Diet:** ${safe(e.dietOrder)}`, `**Activity:** ${safe(e.ambulationOrder)}`, `**Fall risk:** ${safe(e.fallRisk)}`]));
    const pr = (vis.problems || cc.problems || []);
    if (pr.length) out.push(rec('Hospital problem list', safe(e.attending), safe(e.admitDate), 'Problems', `${pr.length} problems`, pr.map(p => `- **${safe(p.name)}** (${safe(p.status)}): ${safe(p.details, '')}`)));
    const team = uniq([e.attending].concat((vis.orders || []).map(o => o.provider)).concat((vis.notes || []).map(n => n.author)).filter(Boolean)).slice(0, 14);
    if (team.length) out.push(rec('Care team', safe(e.attending), safe(e.admitDate), 'Care team', `${team.length} people`, team.map(t => `- ${t}`)));
    return out;
  }
  function procedures() {
    const cc = currentCanonicalCase; if (!cc) return [];
    const vis = getVisibleCanonicalCase(cc), out = [];
    (vis.orders || []).filter(o => /surgery|procedure/i.test(safe(o.category))).forEach(o => out.push(rec(safe(o.name), safe(o.provider), safe(o.start), safe(o.status), safe(o.instructions, ''), [`**Status:** ${safe(o.status)}`, `**Ordered:** ${safe(o.orderedAt || o.start)}`, `**Provider:** ${safe(o.provider)}`, o.instructions ? `**Details:** ${o.instructions}` : '', o.rationale ? `**Reason:** ${o.rationale}` : ''].filter(Boolean))));
    (vis.devices || cc.devices || []).forEach(d => out.push(rec(`${safe(d.type)} placed${d.location ? ': ' + safe(d.location) : ''}`, 'Nursing', safe(d.placementDate), 'Line / device', `${safe(d.status)}${d.gauge ? ', ' + d.gauge : ''}`, [`**Device:** ${safe(d.type)}`, d.location ? `**Location:** ${d.location}` : '', d.gauge ? `**Size:** ${d.gauge}` : '', `**Placed:** ${safe(d.placementDate)}`, `**Status:** ${safe(d.status)}`, d.lastAssessment ? `**Last assessment:** ${d.lastAssessment}` : ''].filter(Boolean))));
    return out.sort((a, b) => String(b.datetime).localeCompare(String(a.datetime)));
  }
  if (typeof chartTabLabels === 'object') { chartTabLabels.encounters = 'Encounters'; chartTabLabels.procedures = 'Procedures'; }
  const origArr = getChartReviewArray;
  getChartReviewArray = function (data, tabKey) { // eslint-disable-line no-func-assign
    if (tabKey === 'encounters') return encounters();
    if (tabKey === 'procedures') return procedures();
    return origArr.apply(this, arguments);
  };

  function addTabs() {
    const strip = $('chartTabs'), drop = $('chartReviewDropdown'); if (!strip || $('tabEncounters')) return;
    const mkTab = (id, label, attr, val, before) => { const b = document.createElement('button'); b.className = 'chart-tab'; b.id = id; b.textContent = label; b.setAttribute(attr, val); strip.insertBefore(b, before || null); return b; };
    const notes = strip.querySelector('[data-chart-tab="notes"]'), imaging = strip.querySelector('[data-chart-tab="imaging"]');
    const enc = mkTab('tabEncounters', 'Encounters', 'data-chart-tab', 'encounters', notes);
    mkTab('tabLabsGo', 'Labs', 'data-go', 'labResults', imaging);
    mkTab('tabProcedures', 'Procedures', 'data-chart-tab', 'procedures');
    mkTab('tabMedsGo', 'Meds', 'data-go', 'mar');
    strip.querySelectorAll('[data-chart-tab="encounters"],[data-chart-tab="procedures"]').forEach(b => b.addEventListener('click', () => renderChartReviewTab(b.dataset.chartTab, 0)));
    strip.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => setMainSection(b.dataset.go)));
    void enc;
    if (drop) {
      const mkSub = (label, key, before) => { const b = document.createElement('button'); b.className = 'nav-subitem'; b.textContent = label; b.dataset.chartTab = key; b.addEventListener('click', () => setMainSection('chartReview', key)); drop.insertBefore(b, before || null); };
      mkSub('Encounters', 'encounters', drop.querySelector('[data-chart-tab="notes"]')); mkSub('Procedures', 'procedures', null);
    }
  }
  addTabs(); draw();
  window.Storyboard = { draw, encounters, procedures };
})();

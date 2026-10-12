/* Flowsheet charting practice (v19).
   - Practice mode hides the patient's current nursing findings so the student has to assess and chart them.
   - Each student entry gets instant feedback against the patient's real findings.
   - "Review my charting" scores coverage and accuracy by body system.
   Depends on globals from app.js: currentCanonicalCase, getVisibleCanonicalCase, safe, escapeHtml,
   buildFlowsheetRecords, saveFlowsheetAssessment, openFlowsheetChartDialog, renderFlowsheetsPage, persistCase. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  function practice() {
    if (!currentCanonicalCase) return { enabled: false };
    if (!currentCanonicalCase.practice) currentCanonicalCase.practice = { enabled: false };
    return currentCanonicalCase.practice;
  }

  // ------------------------------------------------------------ common findings (quick-pick chips)
  const BANK = {
    'Neurologic': {
      'Level of Consciousness': ['Alert', 'Drowsy, arouses easily to voice', 'Lethargic', 'Confused', 'Unresponsive to voice'],
      'Orientation': ['Oriented x4', 'Oriented to person only', 'Disoriented to time and place']
    },
    'Respiratory': {
      'Breath Sounds': ['Clear bilaterally', 'Expiratory wheezes', 'Crackles bilateral bases', 'Diminished at bases', 'Absent on the left'],
      'Respiratory Effort': ['Unlabored, even', 'Tachypneic with accessory muscle use', 'Labored with pursed-lip breathing'],
      'Cough': ['None', 'Productive, white sputum', 'Dry, non-productive'],
      'Oxygen Device': ['Room air', 'Nasal cannula', 'Venturi mask', 'Non-rebreather mask']
    },
    'Cardiac': {
      'Rhythm': ['Normal sinus rhythm', 'Sinus tachycardia', 'Atrial fibrillation'],
      'Heart Sounds': ['S1 S2 regular, no murmur', 'S3 present', 'Murmur present'],
      'Edema': ['No edema', '1+ pitting edema lower extremities', '2+ pitting edema lower extremities', '3+ pitting edema'],
      'Capillary Refill': ['Less than 3 seconds', 'Greater than 3 seconds']
    },
    'GI': {
      'Abdomen': ['Soft, non-tender, non-distended', 'Distended and tender', 'Rigid with guarding'],
      'Bowel Sounds': ['Active x4 quadrants', 'Hypoactive', 'Hyperactive', 'Absent'],
      'Nausea / Vomiting': ['None', 'Nausea without vomiting', 'Vomiting']
    },
    'GU': {
      'Urinary Elimination': ['Voiding spontaneously', 'Foley catheter in place', 'No urine output'],
      'Urine Appearance': ['Clear, yellow', 'Amber, concentrated', 'Cloudy', 'Hematuria']
    },
    'Skin': {
      'Skin': ['Warm, dry, intact', 'Pale, cool, clammy', 'Erythema present', 'Pressure injury present'],
      'Braden Score': ['12', '15', '18', '21']
    },
    'Musculoskeletal / Mobility': {
      'Mobility': ['Independent', 'Assist of one', 'Assist of two', 'Bedrest'],
      'Ambulation': ['Ambulates independently', 'Ambulates with walker and assist', 'Not ambulating']
    },
    'Pain': {
      'Pain Score': ['0', '2', '4', '6', '8'],
      'Pain Location': ['No pain', 'Abdomen', 'Chest', 'Head', 'Incision']
    },
    'Safety': {
      'Fall Precautions': ['Bed low, call light in reach, bed alarm on', 'Fall precautions not in place'],
      'Precautions': ['Standard', 'Contact', 'Droplet', 'Aspiration']
    }
  };

  // ------------------------------------------------------------ reading a finding
  // [tag, regex, abnormal?, plain-language label]
  const TAGS = [
    ['wheeze', /wheez/, 1, 'wheezes'],
    ['crackles', /crackle|rales|rhonchi/, 1, 'crackles'],
    ['diminished', /diminish|decreased breath|decreased at/, 1, 'diminished breath sounds'],
    ['absent', /\babsent\b|no bowel sounds/, 1, 'absent sounds'],
    ['clear', /\bclear\b/, 0, 'clear'],
    ['labored', /tachypne|accessory|labored|retraction|tripod|pursed|dyspnea|short of breath/, 1, 'increased work of breathing'],
    ['unlabored', /unlabored|non[- ]?labored|even and/, 0, 'unlabored breathing'],
    ['drowsy', /drows|letharg|somnolen|obtund|stupor|unrespons/, 1, 'decreased level of consciousness'],
    ['confused', /confus|disorient|person only|oriented x ?[12]\b|x ?[12] only/, 1, 'confusion / disorientation'],
    ['alert', /\balert\b/, 0, 'alert'],
    ['oriented', /oriented x ?[34]|a&o|aox|alert and oriented|fully oriented/, 0, 'oriented'],
    ['hypoactive', /hypoactive|hypo-active|diminished bowel/, 1, 'hypoactive bowel sounds'],
    ['hyperactive', /hyperactive|high[- ]pitched|tinkling/, 1, 'hyperactive bowel sounds'],
    ['active', /\bactive\b|normoactive|present x ?4|x ?4 quadrants/, 0, 'active bowel sounds'],
    ['soft', /\bsoft\b|__nontender__/, 0, 'soft / non-tender abdomen'],
    ['distended', /distend|rigid|guarding|firm abdomen|rebound/, 1, 'distension / guarding'],
    ['tender', /\btender|pain on palpation/, 1, 'tenderness'],
    ['noedema', /no edema|edema: ?none|no peripheral edema|without edema|none.*edema/, 0, 'no edema'],
    ['pitting', /[1-4]\+|pitting|\bedema\b/, 1, 'edema'],
    ['nausea', /nause|vomit|emesis/, 1, 'nausea / vomiting'],
    ['sinus', /\bnsr\b|normal sinus|sinus rhythm|regular rate and rhythm/, 0, 'normal sinus rhythm'],
    ['tachy', /tachycard|\bsvt\b/, 1, 'tachycardia'],
    ['brady', /bradycard/, 1, 'bradycardia'],
    ['afib', /a-?fib|atrial fib|flutter/, 1, 'atrial fibrillation / flutter'],
    ['s3', /\bs3\b|gallop|murmur/, 1, 'extra heart sound / murmur'],
    ['intactskin', /intact|warm and dry|warm, dry/, 0, 'warm, dry, intact skin'],
    ['poorperf', /pale|cool|clammy|diaphor|mottled|cyanot|dusky/, 1, 'pale / cool / clammy skin'],
    ['skinbreak', /erythema|redness|breakdown|pressure injur|stage [1-4]|wound|rash|bruis|ecchym/, 1, 'skin changes'],
    ['jaundice', /jaund|icter/, 1, 'jaundice'],
    ['roomair', /room air|\bra\b/, 0, 'room air'],
    ['o2', /nasal cannula|\bnc\b|venturi|non-?rebreather|face ?mask|bipap|cpap|\bhfnc\b|high flow|\d+ ?l\/?min/, 1, 'supplemental oxygen'],
    ['foley', /foley|catheter/, 0, 'urinary catheter'],
    ['voiding', /void/, 0, 'voiding'],
    ['darkurine', /amber|dark|concentrated|cloudy|hematuria|bloody|turbid/, 1, 'abnormal urine'],
    ['clearurine', /straw|pale yellow|clear.*yellow|yellow.*clear/, 0, 'clear yellow urine'],
    ['bedrest', /bedrest|bed rest|immobile|non-?ambulat|not ambulat/, 1, 'limited mobility'],
    ['assist', /assist|walker|cane|stand-?by|gait belt|one[- ]person|two[- ]person/, 1, 'needs assistance'],
    ['independent', /independent/, 0, 'independent']
  ];
  const ABN = new Set(TAGS.filter(x => x[2]).map(x => x[0]));
  const LABEL = Object.fromEntries(TAGS.map(x => [x[0], x[3]]));
  const isAbn = tags => tags.some(t => ABN.has(t));

  function tagsOf(text) {
    const t = String(text || '').toLowerCase().replace(/non[- ]?tender/g, ' __nontender__ ');
    const out = [];
    TAGS.forEach(([tag, re]) => {
      if (!re.test(t)) return;
      if (tag === 'pitting' && /no edema|edema: ?none|no peripheral edema|without edema|none.*edema/.test(t)) return;
      if (tag === 'distended' && /(non|not|without|no)[- ]?distend/.test(t)) return;
      if (tag === 'nausea' && /(no|denies|without) (nause|vomit)|^\s*none\s*$/.test(t)) return;
      if (tag === 'absent' && /not absent/.test(t)) return;
      out.push(tag);
    });
    return out;
  }

  const numFrom = s => { const m = String(s || '').match(/(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : null; };
  const looksNumeric = (label, v) => /score|braden|scale|weight/i.test(label) || /^\s*\d+(\.\d+)?\s*(\/\s*10)?\s*$/.test(String(v));
  const tol = label => /weight/i.test(label) ? 1 : /pain/i.test(label) ? 1 : /braden/i.test(label) ? 2 : 0;
  const tokens = s => new Set(norm(s).split(' ').filter(w => w.length > 2 && !/^(the|and|with|without|noted|per)$/.test(w)));

  // Compare a student's finding with the patient's real finding.
  function compare(label, student, expected) {
    if (looksNumeric(label, expected) && looksNumeric(label, student)) {
      const a = numFrom(student), e = numFrom(expected);
      if (a != null && e != null) {
        if (Math.abs(a - e) <= tol(label)) return { verdict: 'match', text: `Matches the patient's chart (${expected}).` };
        return { verdict: 'different', text: `The patient's chart shows ${expected}; you charted ${student}. Re-check how you scored this.` };
      }
    }
    const A = tagsOf(student), E = tagsOf(expected);
    if (A.length && E.length) {
      const shared = A.filter(t => E.includes(t));
      const missedAbn = E.filter(t => ABN.has(t) && !A.includes(t));
      const extraAbn = A.filter(t => ABN.has(t) && !E.includes(t));
      if (shared.length && !missedAbn.length && !extraAbn.length) return { verdict: 'match', text: `Matches the patient's chart.` };
      if (shared.length && missedAbn.length) return { verdict: 'partial', text: `Partly right. Also document: ${missedAbn.map(t => LABEL[t]).join(', ')}.` };
      if (shared.length && extraAbn.length) return { verdict: 'partial', text: `Mostly right, but the chart does not support: ${extraAbn.map(t => LABEL[t]).join(', ')}. Re-check.` };
      if (isAbn(E) && !isAbn(A)) return { verdict: 'missed', text: `The patient has an abnormal finding here (${E.filter(t => ABN.has(t)).map(t => LABEL[t]).join(', ')}). Re-assess before charting normal.` };
      if (!isAbn(E) && isAbn(A)) return { verdict: 'different', text: `This patient's finding is normal for this field. You charted ${A.filter(t => ABN.has(t)).map(t => LABEL[t]).join(', ')}.` };
      return { verdict: 'different', text: `This does not match what the patient's chart shows. Re-assess.` };
    }
    const ta = tokens(student), te = tokens(expected);
    const inter = [...ta].filter(w => te.has(w)).length, uni = new Set([...ta, ...te]).size || 1;
    if (inter / uni >= 0.35) return { verdict: 'match', text: `Matches the patient's chart.` };
    if (inter > 0) return { verdict: 'partial', text: `Some overlap with the patient's chart, but not the same. Re-check.` };
    return { verdict: 'different', text: `This does not match what the patient's chart shows. Re-assess.` };
  }

  // ------------------------------------------------------------ the patient's current findings
  const nonStudentAssessments = c => (c.observations || []).filter(o => o.type === 'assessment' && !o.studentEntered);
  function currentFindings(canonical) {
    const latest = new Map();
    nonStudentAssessments(canonical).forEach(o => {
      const key = norm(o.section) + '|' + norm(o.label || o.code);
      const prev = latest.get(key);
      if (!prev || String(o.collected) >= String(prev.collected)) latest.set(key, o);
    });
    return latest;
  }
  const visibleCanonical = () => getVisibleCanonicalCase(currentCanonicalCase);
  function findExpected(section, field) {
    const cur = currentFindings(visibleCanonical()), want = norm(field);
    for (const o of cur.values()) if (norm(o.label || o.code) === want) return o;
    for (const o of cur.values()) {
      const l = norm(o.label || o.code);
      if (l && want && (l.includes(want) || want.includes(l)) && (!section || norm(o.section) === norm(section))) return o;
    }
    return null;
  }

  // ------------------------------------------------------------ hide current findings while practising
  const origBuild = buildFlowsheetRecords;
  buildFlowsheetRecords = function (canonical) {
    const records = origBuild(canonical);
    if (!practice().enabled) return records;
    const hide = new Set([...currentFindings(canonical).values()].map(o => o.id));
    // keep a stub so the field's row stays on the grid (the student charts into it) without revealing the value
    return records.map(r => hide.has(r.id) ? { id: r.id, section: r.section, field: r.field, value: '', collected: r.collected, col: r.col, source: '', abnormal: false, practiceHidden: true } : r);
  };

  // ------------------------------------------------------------ feedback after each entry
  function feedbackFor(section, field, value, abnormalMarked) {
    const exp = findExpected(section, field);
    if (!exp) return { verdict: 'info', text: `Saved. This patient's chart has no reference finding for "${field}", so it cannot be scored.`, expected: '' };
    const res = compare(exp.label || field, value, safe(exp.value));
    const A = tagsOf(value), E = tagsOf(safe(exp.value)), tips = [];
    if (isAbn(E) && !abnormalMarked && res.verdict !== 'missed' && res.verdict !== 'different') tips.push('This is an abnormal finding. Mark it abnormal / clinically significant and think about who needs to know (provider, charge nurse).');
    if (!isAbn(E) && abnormalMarked && !isAbn(A)) tips.push('You marked this abnormal, but the finding is within normal limits.');
    return { verdict: res.verdict, text: res.text + (tips.length ? ' ' + tips.join(' ') : ''), expected: safe(exp.value), expectedId: exp.id };
  }
  const VERDICT = { match: ['✔ Correct', 'ok'], partial: ['◐ Partly right', 'warn'], missed: ['✖ Missed a finding', 'bad'], different: ['✖ Does not match', 'bad'], info: ['ℹ Saved', 'info'] };

  function showFeedback(obs) {
    let box = $('fsFeedback');
    if (!box) {
      box = document.createElement('div'); box.id = 'fsFeedback';
      const layout = document.querySelector('#flowsheetsSection .flowsheet-layout');
      layout.parentNode.insertBefore(box, layout);
    }
    if (!obs) { box.className = 'fs-feedback hidden'; box.innerHTML = ''; return; }
    const f = obs.feedback, [head, cls] = VERDICT[f.verdict] || VERDICT.info;
    box.className = `fs-feedback ${cls}`;
    box.innerHTML = `<div class="fs-fb-head"><b>${head}</b> <span>${esc(obs.section)}: ${esc(obs.label)} — “${esc(obs.value)}”</span><button class="icon-button" id="fsFbClose" aria-label="Dismiss">×</button></div><div>${esc(f.text)}</div>`;
    $('fsFbClose').addEventListener('click', () => showFeedback(null));
  }

  const origSave = saveFlowsheetAssessment;
  saveFlowsheetAssessment = function () {
    const before = currentCanonicalCase ? currentCanonicalCase.observations.length : 0;
    // judge against the findings that were current when the student charted, so score before the grid refreshes
    origSave();
    if (!currentCanonicalCase || currentCanonicalCase.observations.length === before) return;   // validation failed
    const obs = currentCanonicalCase.observations[currentCanonicalCase.observations.length - 1];
    if (!obs.studentEntered) return;
    if (practice().enabled) { obs.feedback = feedbackFor(obs.section, obs.label, safe(obs.value), !!obs.abnormal); showFeedback(obs); }
    else showFeedback(null);
    try { persistCase(); } catch (e) { /* autosave is best effort */ }
  };

  // ------------------------------------------------------------ chart dialog: field suggestions and value chips
  function fieldsFor(section) {
    const out = new Set(Object.keys(BANK[section] || {}));
    if (currentCanonicalCase) nonStudentAssessments(currentCanonicalCase).filter(o => o.section === section).forEach(o => out.add(o.label));
    return [...out];
  }
  function chipsFor(section, field) {
    const bank = BANK[section] || {}, key = Object.keys(bank).find(k => norm(k) === norm(field));
    return key ? bank[key] : [];
  }
  function refreshChips() {
    const sec = $('chartAssessmentSection'), fld = $('chartAssessmentField'); if (!sec || !fld) return;
    let dl = $('fsFieldList');
    if (!dl) { dl = document.createElement('datalist'); dl.id = 'fsFieldList'; document.body.appendChild(dl); fld.setAttribute('list', 'fsFieldList'); }
    dl.innerHTML = fieldsFor(sec.value).map(f => `<option value="${esc(f)}"></option>`).join('');
    let box = $('fsChips');
    if (!box) { box = document.createElement('div'); box.id = 'fsChips'; box.className = 'fs-chips'; $('chartAssessmentValue').insertAdjacentElement('afterend', box); }
    const chips = chipsFor(sec.value, fld.value);
    box.innerHTML = chips.length ? `<span class="fs-chips-label">Common findings (tap to fill, or type your own):</span>` + chips.map(c => `<button type="button" class="fs-chip">${esc(c)}</button>`).join('') : '';
  }
  function wireDialog() {
    const sec = $('chartAssessmentSection'), fld = $('chartAssessmentField'), dlg = $('flowsheetChartDialog'); if (!sec || !fld || !dlg) return;
    sec.addEventListener('change', refreshChips);
    fld.addEventListener('input', refreshChips);
    dlg.addEventListener('click', e => {
      const chip = e.target.closest && e.target.closest('.fs-chip'); if (!chip) return;
      $('chartAssessmentValue').value = chip.textContent;
      $('chartAssessmentAbnormal').checked = isAbn(tagsOf(chip.textContent));
    });
  }
  const origOpen = openFlowsheetChartDialog;
  openFlowsheetChartDialog = function () { origOpen.apply(null, arguments); refreshChips(); };

  // ------------------------------------------------------------ review my charting
  function buildReview() {
    const vis = visibleCanonical(), cur = currentFindings(vis);
    const student = (vis.observations || []).filter(o => o.type === 'assessment' && o.studentEntered);
    const rows = [], used = new Set();
    cur.forEach(exp => {
      const key = norm(exp.label || exp.code);
      const mine = student.filter(s => norm(s.label) === key || (norm(s.label) && (norm(s.label).includes(key) || key.includes(norm(s.label))))).slice(-1)[0];
      if (mine) used.add(mine.id);
      rows.push({ section: safe(exp.section), field: safe(exp.label), expected: safe(exp.value), mine, res: mine ? compare(exp.label, safe(mine.value), safe(exp.value)) : null });
    });
    const scored = rows.reduce((n, r) => n + (r.res ? (r.res.verdict === 'match' ? 1 : r.res.verdict === 'partial' ? 0.5 : 0) : 0), 0);
    return { rows, charted: rows.filter(r => r.mine).length, extra: student.filter(s => !used.has(s.id)), pct: rows.length ? Math.round(100 * scored / rows.length) : 0 };
  }
  function ensureReview() {
    let dlg = $('fsReviewDialog'); if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.id = 'fsReviewDialog'; dlg.className = 'import-dialog fs-review';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Review my charting</h2><p>Your documentation compared with this patient's real findings.</p></div><button id="fsReviewClose" class="icon-button" aria-label="Close">×</button></div><div class="dialog-body" id="fsReviewBody"></div>`;
    document.body.appendChild(dlg);
    $('fsReviewClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target.id === 'fsReveal') { dlg.dataset.reveal = '1'; renderReview(); } });
    return dlg;
  }
  function renderReview() {
    const dlg = ensureReview(), r = buildReview(), reveal = dlg.dataset.reveal === '1';
    if (!r.rows.length) { $('fsReviewBody').innerHTML = '<div class="empty-state">This patient has no nursing findings to compare against yet.</div>'; return; }
    const bySection = {};
    r.rows.forEach(x => (bySection[x.section] = bySection[x.section] || []).push(x));
    let html = `<div class="fs-score"><div class="fs-score-num">${r.pct}%</div><div><b>${r.charted} of ${r.rows.length}</b> findings charted<br><span class="fs-muted">${practice().enabled ? 'Practice mode is on.' : 'Turn Practice mode on to hide the real findings while you assess.'}</span></div>${r.charted < r.rows.length && !reveal ? '<button id="fsReveal" class="secondary-button">Show what I missed</button>' : ''}</div>`;
    Object.keys(bySection).forEach(sec => {
      html += `<h3 class="fs-sec">${esc(sec)}</h3><table class="fs-table"><thead><tr><th>Field</th><th>You charted</th><th>Patient's finding</th><th>Result</th></tr></thead><tbody>`;
      bySection[sec].forEach(x => {
        const [txt, cls] = x.mine ? (VERDICT[x.res.verdict] || VERDICT.info) : ['Not charted', 'bad'];
        html += `<tr><td>${esc(x.field)}</td><td>${x.mine ? esc(safe(x.mine.value)) : '<span class="fs-muted">—</span>'}</td><td>${x.mine || reveal ? esc(x.expected) : '<span class="fs-muted">hidden</span>'}</td><td><span class="fs-tag ${cls}">${txt}</span>${x.res && x.res.verdict !== 'match' ? `<div class="fs-why">${esc(x.res.text)}</div>` : ''}</td></tr>`;
      });
      html += '</tbody></table>';
    });
    if (r.extra.length) html += `<h3 class="fs-sec">Other things you charted</h3><ul class="fs-extra">${r.extra.map(s => `<li>${esc(s.section)}: ${esc(s.label)} — ${esc(safe(s.value))}</li>`).join('')}</ul>`;
    $('fsReviewBody').innerHTML = html;
  }
  function openReview() { const d = ensureReview(); d.dataset.reveal = ''; renderReview(); d.showModal(); }

  // ------------------------------------------------------------ toolbar
  function updateButtons() {
    const b = $('fsPracticeBtn'); if (!b || !currentCanonicalCase) return;
    const on = !!practice().enabled, t = `Practice mode: ${on ? 'On' : 'Off'}`;
    if (b.textContent !== t) b.textContent = t;
    b.classList.toggle('active', on);
  }
  function addToolbar() {
    const bar = document.querySelector('#flowsheetsSection .flowsheet-toolbar-actions'); if (!bar || $('fsPracticeBtn')) return;
    const chart = $('flowsheetChartBtn');
    const mk = (id, text, fn) => { const b = document.createElement('button'); b.className = 'small-tool-button'; b.id = id; b.textContent = text; b.addEventListener('click', fn); bar.insertBefore(b, chart); };
    mk('fsPracticeBtn', 'Practice mode: Off', () => {
      if (!currentCanonicalCase) return;
      practice().enabled = !practice().enabled; showFeedback(null); updateButtons();
      try { persistCase(); } catch (e) { /* best effort */ }
      renderFlowsheetsPage(currentPatientData);
    });
    mk('fsReviewBtn', 'Review my charting', openReview);
    updateButtons();
  }

  const origRender = renderFlowsheetsPage;
  renderFlowsheetsPage = function () { const r = origRender.apply(null, arguments); updateButtons(); return r; };

  window.FlowsheetPractice = { compare, tagsOf, isAbn, findExpected, buildReview, feedbackFor };
  addToolbar();
  wireDialog();
})();

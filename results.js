/* NursingSim - student results (v30).
   Student page: "My Results" shows every practice score on the open patient, asks for the student's name, and downloads a small results file (or prints it).
   Instructor page: "Student results" (in Saved Patients) reads many results files at once into one table, with a CSV download for a gradebook.
   Depends on app.js globals: currentCanonicalCase, safe, escapeHtml, epicDate. Print uses NSWristband.showDialog. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const FORMAT = 'nursingsim-results';
  const NAME_KEY = 'nursingsim_student_name';
  const getName = () => { try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; } };
  const setName = n => { try { localStorage.setItem(NAME_KEY, n); } catch (e) { /* ignore */ } };
  const best = list => list.reduce((m, a) => Math.max(m, a.pct || 0), 0);

  function collect(cc, student) {
    const p = cc.patient || {}, e = cc.encounter || {};
    const att = k => ((cc[k] || {}).attempts || []).map(a => { const o = Object.assign({}, a); delete o.texts; return o; });
    const log = (cc.medPass && cc.medPass.log) || [];
    const count = re => log.filter(l => re.test(String(l.type))).length;
    return { format: FORMAT, version: 1, student: student || '', patient: p.name || '', diagnosis: e.diagnosis || '', exportedAt: new Date().toISOString(),
      education: (cc.educationLog || []).map(x => ({ at: x.at, topic: x.topic, who: x.who, methods: x.methods, response: x.response })), carePlan: att('carePlan'), calls: Object.values(((cc.messageState || {}).calls) || {}).map(c => ({ pct: c.pct, at: c.at })), handoff: att('handoff'), sbar: att('sbar'), priority: att('priority'), teaching: att('teaching'), quiz: att('quiz'),
      medPass: { events: log.length, overrides: count(/override/i), wrongPatient: count(/wrong.?patient|mismatch/i), scans: count(/scan/i), log: log.map(l => ({ at: l.at, type: l.type, detail: l.detail })) } };
  }

  const row = (label, list) => list.length ? `<tr><td>${esc(label)}</td><td>${list.length}</td><td><b>${best(list)}%</b></td><td>${list[list.length - 1].pct}%</td></tr>` : `<tr><td>${esc(label)}</td><td>0</td><td colspan="2" class="fs-muted">not done</td></tr>`;

  function studentHtml(r) {
    return `<p><b>Patient:</b> ${esc(r.patient)} (${esc(r.diagnosis)})</p>
      <table class="data-table"><thead><tr><th>Practice</th><th>Attempts</th><th>Best</th><th>Latest</th></tr></thead><tbody>
      ${row('Handoff report', r.handoff)}${row('SBAR call to provider', r.sbar)}${row('Prioritizing tasks', r.priority)}${row('Teaching the patient', r.teaching)}${row('Care plan', r.carePlan || [])}${row('Critical-value calls', r.calls || [])}</tbody></table>
      <p>Patient teaching documented: <b>${(r.education || []).length}</b> entries.</p><p>Medication pass: <b>${r.medPass.events}</b> logged actions, <b>${r.medPass.overrides}</b> scan overrides.</p>`;
  }

  function openStudentDialog() {
    if (!currentCanonicalCase) { alert('Open a patient first.'); return; }
    const dlg = (() => { let d = $('resDialog'); if (!d) { d = document.createElement('dialog'); d.id = 'resDialog'; d.className = 'quiz-dialog'; document.body.appendChild(d); } return d; })();
    const draw = () => {
      const r = collect(currentCanonicalCase, $('resName') ? $('resName').value : getName());
      dlg.innerHTML = `<div class="dialog-header"><div><h2>My results</h2><p>Your scores on this patient. Type your name, then save the file and send it to your instructor (or print this page).</p></div><button id="resClose" class="icon-button" aria-label="Close">×</button></div>
        <div class="dialog-body"><label>Your name <input id="resName" type="text" value="${esc(r.student)}" placeholder="First and last name" autocomplete="name" style="max-width:320px"></label>
        <div id="resBody">${studentHtml(r)}</div>
        <div class="ho-actions"><button id="resSave" class="primary-button">Save results file</button> <button id="resPrint" class="secondary-button">Print / save as PDF</button></div></div>`;
      $('resClose').addEventListener('click', () => dlg.close());
      $('resName').addEventListener('input', () => { setName($('resName').value); $('resBody').innerHTML = studentHtml(collect(currentCanonicalCase, $('resName').value)); });
      $('resSave').addEventListener('click', () => {
        const name = $('resName').value.trim(); if (!name) { alert('Type your name first.'); $('resName').focus(); return; }
        setName(name); const res = collect(currentCanonicalCase, name);
        const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = `results_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${(res.patient || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      });
      $('resPrint').addEventListener('click', () => { const r2 = collect(currentCanonicalCase, $('resName').value.trim()); NSWristband.showDialog('Practice results', `${esc(r2.student || 'Student')} · ${esc(new Date().toLocaleString())}`, studentHtml(r2)); });
    };
    draw(); if (!dlg.open) dlg.showModal();
  }

  // ---------------- instructor side: read many results files
  function csv(rows) {
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    return rows.map(r => r.map(q).join(',')).join('\n');
  }
  function openInstructorDialog() {
    let d = $('resInstDialog'); if (!d) { d = document.createElement('dialog'); d.id = 'resInstDialog'; d.className = 'quiz-dialog'; document.body.appendChild(d); }
    let rows = [];
    const header = ['Student', 'Patient', 'Handoff best %', 'SBAR best %', 'Prioritizing best %', 'Teaching best %', 'Care plan best %', 'Med pass actions', 'Scan overrides', 'Saved'];
    const draw = msg => {
      d.innerHTML = `<div class="dialog-header"><div><h2>Student results</h2><p>Choose the results files your students sent you (you can select many at once).</p></div><button id="riClose" class="icon-button" aria-label="Close">×</button></div>
        <div class="dialog-body"><label class="file-button">Choose results files<input type="file" id="riFiles" accept="application/json,.json" multiple></label> <span class="fs-muted">${esc(msg || '')}</span>
        ${rows.length ? `<table class="data-table" style="margin-top:10px"><thead><tr>${header.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="ho-actions"><button id="riCsv" class="primary-button">Download CSV for the gradebook</button></div>` : ''}</div>`;
      $('riClose').addEventListener('click', () => d.close());
      $('riFiles').addEventListener('change', async ev => {
        let bad = 0;
        for (const f of Array.from(ev.target.files)) {
          try { const r = JSON.parse(await f.text()); if (r.format !== FORMAT) throw new Error('x');
            rows.push([r.student, r.patient, r.handoff.length ? best(r.handoff) : '', r.sbar.length ? best(r.sbar) : '', r.priority.length ? best(r.priority) : '', r.teaching.length ? best(r.teaching) : '', (r.carePlan || []).length ? best(r.carePlan) : '', r.medPass.events, r.medPass.overrides, (r.exportedAt || '').slice(0, 16).replace('T', ' ')]); } catch (e) { bad++; }
        }
        rows.sort((a, b) => String(a[0]).localeCompare(String(b[0]))); draw(bad ? `${bad} file(s) were not results files and were skipped.` : '');
      });
      const c = $('riCsv'); if (c) c.addEventListener('click', () => { const blob = new Blob([csv([header].concat(rows))], { type: 'text/csv' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'student_results.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); });
    };
    draw(); if (!d.open) d.showModal();
  }

  if (!window.NS_STUDENT) {
    const foot = document.querySelector('#libraryDialog .lib-foot');
    if (foot) { const b = document.createElement('button'); b.className = 'secondary-button'; b.id = 'libResultsBtn'; b.textContent = 'Student results'; b.addEventListener('click', openInstructorDialog); foot.insertBefore(b, foot.firstChild); }
  }
  window.NSResults = { collect, openStudentDialog, openInstructorDialog, FORMAT };
})();

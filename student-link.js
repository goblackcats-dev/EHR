/* NursingSim - instructor "Student Link" (v45). Instructor page only.
   Makes a locked copy of the open patient (no answer key), downloads the lock file, and builds an emailable link.
   Steps for the instructor: 1) press Student Link  2) upload the downloaded file into the student site's "cases" folder  3) email the link. */
(() => {
  'use strict';
  const BASE_KEY = 'nursingsim.studentSiteUrl';
  const get = () => { try { return localStorage.getItem(BASE_KEY) || ''; } catch (e) { return ''; } };
  const put = v => { try { localStorage.setItem(BASE_KEY, v); } catch (e) { /* ignore */ } };
  const esc = s => escapeHtml(String(s == null ? '' : s));
  let dlg;
  function ensure() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.className = 'import-dialog'; dlg.id = 'slDialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Student link</h2><p>Makes a private link for the patient you have open. The patient is locked; only people with the whole link can open it. The answer key is never included.</p></div><button id="slClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><label for="slBase" class="input-label">Your student site address (the https:// address where students go)</label>
      <input id="slBase" style="width:100%;padding:8px;font-size:15px" placeholder="https://yourname.github.io/EHR-student/" />
      <div class="dialog-actions"><button id="slMake" class="primary-button">Make link</button></div>
      <div id="slOut"></div></div>`;
    document.body.appendChild(dlg);
    dlg.querySelector('#slClose').addEventListener('click', () => dlg.close());
    dlg.querySelector('#slMake').addEventListener('click', make);
    return dlg;
  }
  function download(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  async function make() {
    const out = dlg.querySelector('#slOut');
    try {
      if (!currentCanonicalCase) throw new Error('Open a patient first.');
      let base = dlg.querySelector('#slBase').value.trim();
      if (!/^https:\/\/[^\s]+$/i.test(base) && !/^http:\/\/localhost[:/]/i.test(base)) throw new Error('Type the student site address starting with https://');
      base = base.split('#')[0].split('?')[0].replace(/index\.html$/, ''); if (!base.endsWith('/')) base += '/';
      put(base);
      const name = (currentCanonicalCase.patient && currentCanonicalCase.patient.name) || 'patient';
      const student = NSLib.toStudentFile({ name, canonical: currentCanonicalCase, simulationTime });
      const id = NSSecure.newId(name), enc = await NSSecure.encrypt(student);
      download(id + '.enc.json', JSON.stringify(enc.file));
      const link = `${base}?case=${id}#k=${enc.key}`;
      const subject = `Clinical simulation: ${name}`;
      const body = `Open this link on your iPad (Safari) to start the simulated patient:\n\n${link}\n\nThis link is only for you. Please do not share it.`;
      out.innerHTML = `<h3>Done. Two steps left</h3>
        <ol><li>Upload <b>${esc(id)}.enc.json</b> (just downloaded) into the <b>cases</b> folder of your student site, then wait about a minute.</li>
        <li>Email this link to your students:</li></ol>
        <textarea id="slLink" rows="3" readonly style="width:100%;min-height:80px">${esc(link)}</textarea>
        <div class="dialog-actions"><button id="slCopy" class="primary-button">Copy link</button> <a class="secondary-button" id="slMail" href="mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Start an email</a></div>`;
      out.querySelector('#slCopy').addEventListener('click', async () => { const t = out.querySelector('#slLink'); t.select(); try { await navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand('copy'); } out.querySelector('#slCopy').textContent = 'Copied'; });
    } catch (e) { out.innerHTML = `<p style="color:#b00020">${esc(e.message)}</p>`; }
  }
  const actions = document.querySelector('.top-actions');
  if (actions && !window.NS_STUDENT) {
    const b = document.createElement('button'); b.className = 'top-link top-button'; b.id = 'openStudentLinkBtn'; b.textContent = 'Student Link';
    b.title = 'Make a private emailable link to this patient';
    b.addEventListener('click', () => { if (!currentCanonicalCase) { alert('Open a patient first.'); return; } const d = ensure(); d.querySelector('#slBase').value = get(); d.querySelector('#slOut').innerHTML = ''; d.showModal(); });
    const sv = document.getElementById('openStudentViewBtn'); actions.insertBefore(b, sv ? sv.nextSibling : null);
  }
})();

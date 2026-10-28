/* NursingSim - instructor "Student Link" (v45). Instructor page only.
   Makes a locked copy of the open patient (no answer key), downloads the lock file, and builds an emailable link.
   Steps for the instructor: 1) press Student Link  2) upload the downloaded file into the student site's "cases" folder  3) email the link. */
(() => {
  'use strict';
  const BASE_KEY = 'nursingsim.studentSiteUrl', TOKEN_KEY = 'nursingsim.ghToken', REPO_KEY = 'nursingsim.ghRepo';
  const DEFAULT_BASE = 'https://goblackcats-dev.github.io/EHR/student-site/', DEFAULT_REPO = 'goblackcats-dev/EHR@EHR:student-site/cases';   // owner/repo@branch:folder
  const lsGet = k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }, lsPut = (k, v) => { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { /* ignore */ } };
  const get = () => lsGet(BASE_KEY) || DEFAULT_BASE;
  const put = v => { try { localStorage.setItem(BASE_KEY, v); } catch (e) { /* ignore */ } };
  const esc = s => escapeHtml(String(s == null ? '' : s));
  let dlg;
  function ensure() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog'); dlg.className = 'import-dialog'; dlg.id = 'slDialog';
    dlg.innerHTML = `<div class="dialog-header"><div><h2>Student link</h2><p>Makes a private link for the patient you have open. The patient is locked; only people with the whole link can open it. The answer key is never included.</p></div><button id="slClose" class="icon-button" aria-label="Close">×</button></div>
      <div class="dialog-body"><label for="slBase" class="input-label">Your student site address (the https:// address where students go)</label>
      <input id="slBase" style="width:100%;padding:8px;font-size:15px" placeholder="https://yourname.github.io/EHR-student/" />
      <details id="slAuto" style="margin-top:10px"><summary><b>Automatic upload to GitHub (optional, saves step 2)</b></summary>
        <p style="margin:6px 0">Paste a GitHub token once and the locked patient file is uploaded for you each time. Make the token at GitHub &rarr; Settings &rarr; Developer settings &rarr; Fine-grained tokens: only this repository, permission <b>Contents: Read and write</b>. It is stored only in this browser and is sent only to github.com.</p>
        <label class="input-label" for="slToken">GitHub token</label><input id="slToken" type="password" autocomplete="off" style="width:100%;padding:8px" placeholder="github_pat_..." />
        <label class="input-label" for="slRepo">Where to upload (owner/repo@branch:folder)</label><input id="slRepo" style="width:100%;padding:8px" />
        <div class="dialog-actions"><button id="slForget" class="secondary-button" type="button">Forget token</button></div>
      </details>
      <div class="dialog-actions"><button id="slMake" class="primary-button">Make link</button></div>
      <div id="slOut"></div></div>`;
    document.body.appendChild(dlg);
    dlg.querySelector('#slClose').addEventListener('click', () => dlg.close());
    dlg.querySelector('#slMake').addEventListener('click', make);
    dlg.querySelector('#slForget').addEventListener('click', () => { lsPut(TOKEN_KEY, ''); dlg.querySelector('#slToken').value = ''; });
    return dlg;
  }
  function download(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  // uploads the locked patient file with the GitHub contents API (token stays in this browser)
  async function uploadToGitHub(name, text, token, spec) {
    const m = /^([^/\s]+)\/([^@\s]+)@([^:\s]+):(.+)$/.exec(spec.trim()); if (!m) throw new Error('The upload place must look like owner/repo@branch:folder');
    const [, owner, repo, branch, folder] = m, path = folder.replace(/^\/+|\/+$/g, '') + '/' + name;
    const content = btoa(unescape(encodeURIComponent(text)));
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'PUT', headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Add locked student patient ' + name, content, branch })
    });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(r.status === 401 || r.status === 403 ? 'GitHub did not accept the token (check it has Contents: Read and write for this repository).' : 'GitHub upload failed: ' + (j.message || r.status)); }
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
      const fileText = JSON.stringify(enc.file), token = dlg.querySelector('#slToken').value.trim() || lsGet(TOKEN_KEY), repoSpec = dlg.querySelector('#slRepo').value.trim() || DEFAULT_REPO;
      lsPut(REPO_KEY, repoSpec === DEFAULT_REPO ? '' : repoSpec); if (dlg.querySelector('#slToken').value.trim()) lsPut(TOKEN_KEY, token);
      let uploaded = false, upErr = '';
      if (token) { out.innerHTML = '<p>Uploading the locked patient to GitHub…</p>'; try { await uploadToGitHub(id + '.enc.json', fileText, token, repoSpec); uploaded = true; } catch (e) { upErr = e.message; } }
      if (!uploaded) download(id + '.enc.json', fileText);
      const link = `${base}?case=${id}#k=${enc.key}`;
      const subject = `Clinical simulation: ${name}`;
      const body = `Open this link on your iPad (Safari) to start the simulated patient:\n\n${link}\n\nThis link is only for you. Please do not share it.`;
      out.innerHTML = (uploaded ? `<h3>Done. The patient was uploaded to GitHub</h3><p>Wait about 1 to 2 minutes for the site to update, then email this link to your students:</p>`
        : `<h3>Done. ${token ? 'The automatic upload did not work' : 'Two steps left'}</h3>${upErr ? `<p style="color:#b00020">${esc(upErr)}</p>` : ''}
        <ol><li>Upload <b>${esc(id)}.enc.json</b> (just downloaded) into the <b>cases</b> folder of your student site, then wait about a minute.</li>
        <li>Email this link to your students:</li></ol>`) + `
        <textarea id="slLink" rows="3" readonly style="width:100%;min-height:80px">${esc(link)}</textarea>
        <div class="dialog-actions"><button id="slCopy" class="primary-button">Copy link</button> <a class="secondary-button" id="slMail" href="mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Start an email</a></div>`;
      out.querySelector('#slCopy').addEventListener('click', async () => { const t = out.querySelector('#slLink'); t.select(); try { await navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand('copy'); } out.querySelector('#slCopy').textContent = 'Copied'; });
    } catch (e) { out.innerHTML = `<p style="color:#b00020">${esc(e.message)}</p>`; }
  }
  const actions = document.querySelector('.top-actions');
  if (actions && !window.NS_STUDENT) {
    const b = document.createElement('button'); b.className = 'top-link top-button'; b.id = 'openStudentLinkBtn'; b.textContent = 'Student Link';
    b.title = 'Make a private emailable link to this patient';
    b.addEventListener('click', () => { if (!currentCanonicalCase) { alert('Open a patient first.'); return; } const d = ensure(); d.querySelector('#slBase').value = get(); d.querySelector('#slRepo').value = lsGet(REPO_KEY) || DEFAULT_REPO; d.querySelector('#slToken').placeholder = lsGet(TOKEN_KEY) ? 'A token is saved on this device (leave blank to keep using it)' : 'github_pat_...'; d.querySelector('#slOut').innerHTML = ''; d.showModal(); });
    const sv = document.getElementById('openStudentViewBtn'); actions.insertBefore(b, sv ? sv.nextSibling : null);
  }
})();

/* NursingSim - instructor "Case Studies" menu item (v51). Instructor page only.
   Lists every patient that has a built case study (casestudy/index.json): student packet, answer key and score sheet, a copyable
   student link, and how to get a scanned packet graded. The answer key is NOT part of the student site. */
(() => {
  'use strict';
  if (window.NS_STUDENT) return;
  const actions = document.querySelector('.top-actions'); if (!actions) return;
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const BASE_KEY = 'nursingsim.studentSiteUrl';
  const base = () => { try { return localStorage.getItem(BASE_KEY) || ''; } catch (e) { return ''; } };
  let dlg;
  const studentLink = c => { const b = base(); return b && c.files.studentPdf ? `${b}casestudies/${c.caseCode}-${c.token}.pdf` : ''; };
  async function render() {
    const box = dlg.querySelector('#csBody');
    try {
      const res = await fetch('casestudy/index.json', { cache: 'no-store' }); if (!res.ok) throw new Error('missing');
      const cases = (await res.json()).cases || [];
      const hasBase = !!base();
      box.innerHTML = `<p>${cases.length} patients have a case study. Each is 100 points; passing is 78 or higher.</p>` +
        (hasBase ? '' : '<p style="color:#92400e">To get student links, press <b>Student Link</b> once on any patient and enter your student site address.</p>') +
        cases.map((c, i) => `<div class="cs-row" style="border:1px solid #c9d4e2;border-radius:3px;padding:10px 12px;margin:0 0 10px">
          <div><b>${esc(c.patient)}</b>, ${esc(c.age)} ${esc(c.sex === 'Female' ? 'F' : 'M')} &middot; ${esc(c.title)}</div>
          <div style="color:#5d6b7a;font-size:12px;margin:2px 0 8px">${esc(c.caseCode)} &middot; ${esc(c.diagnosis)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${c.files.studentPdf ? `<a class="secondary-button" href="casestudy/${esc(c.files.studentPdf)}" target="_blank" rel="noopener">Student packet (PDF)</a>` : ''}
            ${c.files.studentDocx ? `<a class="secondary-button" href="casestudy/${esc(c.files.studentDocx)}" download>Student (Word)</a>` : ''}
            ${c.files.keyPdf ? `<a class="secondary-button" href="casestudy/${esc(c.files.keyPdf)}" target="_blank" rel="noopener">Answer key + score sheet (PDF)</a>` : ''}
            ${c.files.keyDocx ? `<a class="secondary-button" href="casestudy/${esc(c.files.keyDocx)}" download>Key (Word)</a>` : ''}
            <button class="primary-button" data-cs="${i}" ${hasBase ? '' : 'disabled'}>Copy student link</button>
          </div></div>`).join('') +
        `<details><summary><b>How to get a scanned case study graded</b></summary><ol>
          <li>Photograph every page of the student's packet (one page per photo, flat, good light, all four corners and the page number visible).</li>
          <li>Open this Claude session and upload the photos. Say: <i>"Grade this student's case study with CS-xxx-xxx"</i> (use the code above).</li>
          <li>You get back a completed score sheet: points per item and part, the total, PASS / NOT PASS at 78, what was missed, and a list of anything unreadable for you to review. The final grade is yours.</li></ol></details>`;
      box.querySelectorAll('[data-cs]').forEach(b => b.addEventListener('click', async () => {
        const link = studentLink(cases[+b.dataset.cs]); try { await navigator.clipboard.writeText(link); b.textContent = 'Copied'; } catch (e) { prompt('Copy this link:', link); }
      }));
    } catch (e) { box.innerHTML = '<p style="color:#b00020">The case study list could not be loaded.</p>'; }
  }
  function open() {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'import-dialog'; dlg.id = 'csDialog';
      dlg.innerHTML = '<div class="dialog-header"><div><h2>Case studies</h2><p>Care-plan case studies for patients that have one built.</p></div><button id="csClose" class="icon-button" aria-label="Close">×</button></div><div class="dialog-body" id="csBody"></div>';
      document.body.appendChild(dlg); dlg.querySelector('#csClose').addEventListener('click', () => dlg.close());
    }
    render(); dlg.showModal();
  }
  const b = document.createElement('button'); b.className = 'top-link top-button'; b.id = 'openCaseStudiesBtn'; b.textContent = 'Case Studies'; b.addEventListener('click', open);
  const sl = document.getElementById('openStudentLinkBtn'); actions.insertBefore(b, sl ? sl.nextSibling : null);
})();

/* Drug guide links (v27): medication names on the MAR, in the dose window and in the medication detail pop-up become blue links
   that open a one-page quick reference. Data: druginfo.js and druginfo_1..3.js. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(String(s == null ? '' : s));
  const list = (items, cls) => (items && items.length ? `<ul class="dg-list ${cls || ''}">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '');

  function fromOrder(name) {
    const o = ((currentCanonicalCase && currentCanonicalCase.orders) || []).find(x => safe(x.name) === name) || {}, m = o.medication || {};
    return { key: name, basic: true, brand: '', cls: safe(m.drugClass, ''), use: safe(o.rationale, ''), dose: `${safe(m.dose, '')} ${safe(m.route, '')} ${safe(o.frequency, '')}`.trim(), give: [], watch: (o.nursingConsiderations || []).slice(0, 4), hold: o.instructions && /hold|notify/i.test(o.instructions) ? [o.instructions] : [], effects: [], teach: safe(m.importantInfo, ''), alert: !!m.highAlert, lasa: '' };
  }

  function ensureDialog() {
    let d = $('drugGuideDialog'); if (d) return d;
    d = document.createElement('dialog'); d.id = 'drugGuideDialog'; d.className = 'drug-guide';
    d.innerHTML = '<button type="button" class="icon-button dg-close" aria-label="Close">×</button><div id="dgBody"></div>';
    document.body.appendChild(d);
    d.querySelector('.dg-close').addEventListener('click', () => d.close());
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    return d;
  }

  function open(name) {
    const found = DrugGuide.lookup(name), g = found || fromOrder(name), d = ensureDialog();
    const sec = (title, html) => html ? `<div class="dg-sec"><h4>${title}</h4>${html}</div>` : '';
    $('dgBody').innerHTML = `<div class="dg-head"><h2>${esc(found ? (g.key.charAt(0).toUpperCase() + g.key.slice(1)) : name)}${g.brand ? ` <span class="dg-brand">(${esc(g.brand)})</span>` : ''}</h2>
      <div class="dg-meta">${g.cls ? `<span class="dg-chip">${esc(g.cls)}</span>` : ''}${g.alert ? '<span class="dg-chip alert">HIGH-ALERT</span>' : ''}</div></div>
      ${found ? '' : '<div class="dg-note">There is no full guide for this drug yet. This is the basic information from the order.</div>'}
      ${g.lasa ? `<div class="dg-lasa"><b>Look-alike / sound-alike:</b> ${esc(g.lasa)}</div>` : ''}
      ${sec('What it is for', g.use ? `<p>${esc(g.use)}</p>` : '')}
      ${sec('Usual dose', g.dose ? `<p>${esc(g.dose)}</p>` : '')}
      <div class="dg-grid">${sec('Giving it', list(g.give))}${sec('Assess and monitor', list(g.watch))}${sec('Hold and call the provider if', list(g.hold, 'hold'))}${sec('Adverse effects', list((g.effects || []).map(x => x), 'fx'))}</div>
      ${sec('Teach the patient', g.teach ? `<p>${esc(g.teach)}</p>` : '')}
      <div class="dg-foot">Quick reference for learning only. Follow the order, your facility policy and the pharmacy.</div>`;
    d.querySelectorAll('.dg-list.fx li').forEach(li => { if (/^SERIOUS/i.test(li.textContent)) li.classList.add('serious'); });
    if (!d.open) d.showModal();
  }

  const link = (el, name) => {
    if (!el || !name || el.querySelector(':scope > a.drug-link')) return;
    const a = document.createElement('a'); a.href = '#'; a.className = 'drug-link'; a.textContent = name; a.dataset.drug = name; a.title = 'Open the quick drug guide';
    el.textContent = ''; el.appendChild(a);
  };

  // MAR rows: wrap the drug name; the dose after it stays plain text
  function linkRows() {
    document.querySelectorAll('#marRows .mar-med-name').forEach(div => {
      if (div.querySelector('a.drug-link')) return;
      const first = div.firstChild; if (!first || first.nodeType !== 3) return;
      const name = first.textContent.trim(); if (!name) return;
      const a = document.createElement('a'); a.href = '#'; a.className = 'drug-link'; a.dataset.drug = name; a.textContent = name; a.title = 'Open the quick drug guide';
      div.replaceChild(a, first); div.insertBefore(document.createTextNode(' '), a.nextSibling);
    });
  }
  const rows = $('marRows'); if (rows) new MutationObserver(linkRows).observe(rows, { childList: true, subtree: true });
  [['marActionTitle'], ['marDetailTitle']].forEach(([id]) => {
    const el = $(id); if (!el) return;
    new MutationObserver(() => { if (el.querySelector('a.drug-link')) return; const t = el.textContent.trim(); if (t && !/^(medication administration|medication detail)$/i.test(t)) link(el, t); }).observe(el, { childList: true, characterData: true, subtree: true });
  });
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a.drug-link'); if (!a) return; e.preventDefault(); e.stopPropagation(); open(a.dataset.drug); }, true);
  linkRows();
  window.DrugGuideUI = { open };
})();

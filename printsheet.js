/* NursingSim - shared print dialog for wristbands and medication labels (instructor tools only).
   NSPrint.open({ title, items:[{ id, group, title, sub, html(size), sizes:[{key,label}], size, checked }], preselect:[idPrefix,...] })
   The dialog lists every item with a checkbox, a size menu (when the item has sizes) and a copies box, shows a live
   preview of the page, and prints the ticked items together, wrapped onto letter pages with a 0.4 in margin.
   Printing uses a print-only container in this page (works on iPad Safari); everything else is hidden while printing. */
(() => {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CSS = `
  .nsp-dialog { width: min(1000px, 96vw); max-height: 94vh; border: 0; border-radius: 12px; padding: 0; box-shadow: 0 12px 40px rgba(0,0,0,.35); color: #1b2a3d; font-family: inherit; }
  .nsp-dialog::backdrop { background: rgba(10,20,40,.5); }
  .nsp-dialog[open] { display: flex; flex-direction: column; }
  .nsp-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 20px 8px; }
  .nsp-head h2 { margin: 0; font-size: 20px; } .nsp-head p { margin: 2px 0 0; color: #55657a; font-size: 13px; }
  .nsp-x { border: 0; background: transparent; font-size: 28px; cursor: pointer; line-height: 1; padding: 4px 10px; }
  .nsp-main { display: flex; gap: 16px; padding: 0 20px 12px; overflow: auto; flex: 1; min-height: 0; }
  .nsp-list { flex: 0 0 min(430px, 46%); display: flex; flex-direction: column; gap: 6px; }
  .nsp-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 14px; }
  .nsp-btn { border: 1px solid #1f5fa8; background: #1f5fa8; color: #fff; border-radius: 8px; padding: 10px 18px; font-size: 15px; cursor: pointer; }
  .nsp-btn.sec { background: #fff; color: #1f5fa8; padding: 6px 12px; font-size: 13px; }
  .nsp-btn:disabled { opacity: .45; cursor: default; }
  .nsp-group { font-weight: 700; font-size: 13px; color: #55657a; margin-top: 6px; }
  .nsp-row { display: grid; grid-template-columns: 24px 1fr; gap: 4px 8px; align-items: start; border: 1px solid #d5deea; border-radius: 8px; padding: 8px; }
  .nsp-row.off { opacity: .55; }
  .nsp-row input[type=checkbox] { width: 20px; height: 20px; margin: 2px 0 0; min-height: 0; }
  .nsp-t { font-size: 14px; font-weight: 600; word-break: break-word; } .nsp-s { font-size: 12px; color: #55657a; }
  .nsp-opts { grid-column: 2; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 13px; }
  .nsp-opts select, .nsp-opts input[type=number] { min-height: 0; margin: 0; width: auto; padding: 4px 6px; font-size: 13px; }
  .nsp-opts input[type=number] { width: 56px; }
  .nsp-prev { flex: 1; min-width: 0; background: #e8edf3; border-radius: 8px; padding: 10px; overflow: hidden; align-self: flex-start; }
  .nsp-prevcap { font-size: 12px; color: #55657a; margin-bottom: 6px; }
  .nsp-scale { position: relative; overflow: hidden; }
  .nsp-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 20px 14px; border-top: 1px solid #e3e9f1; font-size: 13px; color: #55657a; }
  .nsp-sheet { box-sizing: border-box; width: 7.7in; display: flex; flex-wrap: wrap; gap: .12in; align-items: flex-start; align-content: flex-start; background: #fff; transform-origin: 0 0; }
  .nsp-prev .nsp-sheet { position: absolute; left: 0; top: 0; box-shadow: 0 0 0 1px #c5d0de; padding: .02in; min-height: 10.2in; }
  .nsp-item { break-inside: avoid; page-break-inside: avoid; display: block; }
  .nsp-item .wb-sheet { margin: 0; } .nsp-item .wb-band { margin: 0; }
  .nsp-item .ml-label { page-break-inside: avoid; }
  #nsPrintArea { display: none; }
  @media (max-width: 760px) { .nsp-main { flex-direction: column; } .nsp-list { flex: none; } .nsp-prev { align-self: stretch; } }
  @media print {
    @page { size: letter portrait; margin: .4in; }
    html, body { height: auto !important; min-height: 0 !important; overflow: visible !important; display: block !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
    body.nsp-printing > *:not(#nsPrintArea) { display: none !important; }
    body.nsp-printing #nsPrintArea { display: block !important; position: static !important; width: auto !important; }
    body.nsp-printing .nsp-sheet { width: 100% !important; padding: 0; transform: none !important; }
    body.nsp-printing .nsp-item .ml-label, body.nsp-printing .nsp-item .wb-band { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }`;
  function ensureStyle() {
    if (!document.getElementById('nspStyle')) { const s = document.createElement('style'); s.id = 'nspStyle'; s.textContent = CSS; document.head.appendChild(s); }
    if (window.NSWristband && NSWristband.ensureStyle) NSWristband.ensureStyle();
    if (window.NSMedLabel && NSMedLabel.ensureStyle) NSMedLabel.ensureStyle();
  }
  const clearPrinting = () => { document.body.classList.remove('nsp-printing'); const a = document.getElementById('nsPrintArea'); if (a) a.innerHTML = ''; };
  window.addEventListener('afterprint', clearPrinting);

  function open(cfg) {
    ensureStyle(); cfg = cfg || {};
    const items = (cfg.items || []).map(it => Object.assign({ copies: 1 }, it));
    const pre = cfg.preselect;
    items.forEach(it => { if (pre && pre.length) it.checked = pre.some(p => it.id.startsWith(p)); else if (it.checked == null) it.checked = true; if (it.sizes && !it.size) it.size = it.sizes[0].key; });
    const old = document.getElementById('nspDialog'); if (old) { old.close(); old.remove(); }
    const dlg = document.createElement('dialog'); dlg.id = 'nspDialog'; dlg.className = 'nsp-dialog'; document.body.appendChild(dlg);
    const groups = []; items.forEach(it => { if (!groups.includes(it.group)) groups.push(it.group); });
    const rowHtml = (it, i) => `<div class="nsp-row${it.checked ? '' : ' off'}" data-i="${i}"><input type="checkbox" data-f="on" ${it.checked ? 'checked' : ''} aria-label="Print ${esc(it.title)}"><div><div class="nsp-t">${esc(it.title)}</div><div class="nsp-s">${esc(it.sub || '')}</div></div>
      <div class="nsp-opts">${it.sizes ? `<label>Size <select data-f="size">${it.sizes.map(s => `<option value="${esc(s.key)}" ${s.key === it.size ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select></label>` : ''}<label>Copies <input type="number" data-f="copies" min="1" max="12" value="${it.copies}"></label></div></div>`;
    dlg.innerHTML = `<div class="nsp-head"><div><h2>${esc(cfg.title || 'Print')}</h2><p>Tick what to print. Everything ticked is placed together on as few pages as possible. Use plain letter paper at 100% scale, then cut along the borders.</p></div><button class="nsp-x" data-a="close" aria-label="Close">×</button></div>
      <div class="nsp-main"><div class="nsp-list"><div class="nsp-bar"><button class="nsp-btn sec" data-a="all">Select all</button><button class="nsp-btn sec" data-a="none">Select none</button></div>
        ${groups.map(g => `<div class="nsp-group">${esc(g || 'Items')}</div>${items.map((it, i) => it.group === g ? rowHtml(it, i) : '').join('')}`).join('') || '<div>Nothing to print.</div>'}</div>
        <div class="nsp-prev"><div class="nsp-prevcap" id="nspCap"></div><div class="nsp-scale" id="nspScale"><div class="nsp-sheet" id="nspSheet"></div></div></div></div>
      <div class="nsp-foot"><span id="nspCount"></span><span><button class="nsp-btn sec" data-a="close">Cancel</button> <button class="nsp-btn" data-a="print" id="nspPrint">Print</button></span></div>`;

    const sheetInner = () => items.filter(it => it.checked).map(it => { let h = ''; for (let c = 0; c < it.copies; c++) h += `<div class="nsp-item">${it.html(it.size)}</div>`; return h; }).join('');
    const count = () => items.filter(it => it.checked).reduce((n, it) => n + it.copies, 0);
    function preview() {
      const sheet = dlg.querySelector('#nspSheet'), box = dlg.querySelector('#nspScale'), n = count();
      sheet.innerHTML = sheetInner();
      dlg.querySelector('#nspPrint').disabled = !n;
      dlg.querySelector('#nspCount').textContent = n ? `${n} item${n === 1 ? '' : 's'} selected` : 'Nothing selected';
      const avail = box.parentNode.clientWidth - 20, full = sheet.offsetWidth || 740, k = Math.min(1, Math.max(.2, avail / full));
      sheet.style.transform = `scale(${k})`; box.style.height = Math.ceil(sheet.offsetHeight * k) + 'px';
      const pages = Math.max(1, Math.ceil(sheet.offsetHeight / (10.2 * 96)));
      dlg.querySelector('#nspCap').textContent = n ? `Preview (about ${pages} page${pages === 1 ? '' : 's'}; page 1 shown first, content flows down)` : 'Preview';
    }
    dlg.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'close') dlg.close();
      else if (a.dataset.a === 'all' || a.dataset.a === 'none') { items.forEach((it, i) => { it.checked = a.dataset.a === 'all'; }); dlg.querySelectorAll('.nsp-row').forEach((r, i) => { r.querySelector('[data-f=on]').checked = items[i].checked; r.classList.toggle('off', !items[i].checked); }); preview(); }
      else if (a.dataset.a === 'print') print();
    });
    dlg.addEventListener('change', e => {
      const row = e.target.closest('.nsp-row'); if (!row) return; const it = items[+row.dataset.i], f = e.target.dataset.f;
      if (f === 'on') { it.checked = e.target.checked; row.classList.toggle('off', !it.checked); }
      else if (f === 'size') it.size = e.target.value;
      else if (f === 'copies') { it.copies = Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1)); e.target.value = it.copies; }
      preview();
    });
    const onResize = () => preview();
    window.addEventListener('resize', onResize);
    dlg.addEventListener('close', () => { window.removeEventListener('resize', onResize); clearPrinting(); dlg.remove(); });
    function print() {
      if (!count()) return;
      let area = document.getElementById('nsPrintArea');
      if (!area) { area = document.createElement('div'); area.id = 'nsPrintArea'; document.body.appendChild(area); }
      area.innerHTML = `<div class="nsp-sheet">${sheetInner()}</div>`;
      document.body.classList.add('nsp-printing');
      setTimeout(() => window.print(), 50);
    }
    dlg.showModal(); preview();
    return dlg;
  }
  window.NSPrint = { open, ensureStyle };
})();

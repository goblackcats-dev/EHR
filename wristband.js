/* NursingSim - printable patient wristband (QR code) shared by the EHR and the Case Builder.
   Needs qrcode.js (vendored, MIT) loaded first.
   The QR code holds the patient code, e.g. PT-SIM-001001-3F2A. When it is scanned in the EHR
   (handheld scanner, typed, or the on-screen scanner) the EHR checks it against the patient it has open. */
(() => {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hash = text => { let h = 2166136261; for (const ch of String(text)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

  // MRN + a short fingerprint of name and birth date, so two patients that share an MRN still get different wristbands.
  function patientCode(p) {
    p = p || {};
    const fp = hash(`${p.name || ''}|${p.dob || ''}`).toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
    return `PT-${p.mrn || 'UNKNOWN'}-${fp}`;
  }
  function dobText(dob) {
    const m = String(dob || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[2]}/${m[3]}/${m[1]}` : String(dob || '');
  }
  function qrSvg(text, cls) {
    if (typeof qrcode !== 'function') return '<div class="wb-noqr">QR library missing</div>';
    const q = qrcode(0, 'M'); q.addData(String(text)); q.make();
    const n = q.getModuleCount(); let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return `<svg class="${cls || 'wb-qr'}" viewBox="-3 -3 ${n + 6} ${n + 6}" shape-rendering="crispEdges" role="img" aria-label="QR code ${esc(text)}"><rect x="-3" y="-3" width="${n + 6}" height="${n + 6}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  }
  const allergiesOf = p => (p.allergies || []).filter(a => a && a.substance && !/^(nkda|none)/i.test(a.substance));

  // The wristband: about 7.5 x 1.15 inches. Fits across letter paper with 0.5 inch margins.
  function bandHtml(canon) {
    const p = canon.patient || {}, e = canon.encounter || {}, code = patientCode(p), al = allergiesOf(p);
    return `<div class="wb-sheet">
      <div class="wb-band">
        <div class="wb-info">
          <div class="wb-name">${esc(p.name)}</div>
          <div class="wb-line"><b>DOB</b> ${esc(dobText(p.dob))} &nbsp; ${esc(p.age != null ? p.age + ' y.o.' : '')} ${esc(p.sex || '')}</div>
          <div class="wb-line"><b>MRN</b> ${esc(p.mrn)} &nbsp; ${esc([e.location, e.room].filter(Boolean).join(' '))}</div>
          <div class="wb-sim">SIMULATION PATIENT - NOT A REAL PERSON</div>
        </div>
        <div class="wb-qrbox">${qrSvg(code)}<div class="wb-code">${esc(code)}</div></div>
        <div class="wb-tail"><span>Cut out. Wrap around wrist and tape here.</span></div>
      </div>
      ${al.length ? `<div class="wb-band wb-allergy"><div class="wb-info"><div class="wb-name">ALLERGY</div><div class="wb-line">${esc(al.map(a => a.substance + (a.reaction ? ' (' + a.reaction + ')' : '')).join('; '))}</div></div><div class="wb-tail"><span>Cut out. Wrap around wrist and tape here.</span></div></div>` : ''}
    </div>`;
  }

  const CSS = `
  .wb-dialog { width: min(860px, 96vw); border: 0; border-radius: 12px; padding: 0; box-shadow: 0 12px 40px rgba(0,0,0,.35); }
  .wb-dialog::backdrop { background: rgba(10,20,40,.5); }
  .wb-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 16px 20px 8px; }
  .wb-head h2 { margin: 0 0 4px; font-size: 20px; } .wb-head p { margin: 0; color: #55657a; font-size: 14px; }
  .wb-body { padding: 8px 20px 20px; overflow-x: auto; }
  .wb-btn { border: 1px solid #1f5fa8; background: #1f5fa8; color: #fff; border-radius: 8px; padding: 10px 16px; font-size: 15px; cursor: pointer; }
  .wb-x { border: 0; background: transparent; font-size: 28px; cursor: pointer; line-height: 1; padding: 4px 10px; }
  .wb-sheet { margin: 8px 0 16px; }
  .wb-band { box-sizing: border-box; width: 7.5in; height: 1.15in; border: 2px solid #000; border-radius: .2in; display: flex; align-items: stretch; margin: 0 0 .25in; background: #fff; color: #000; font-family: Arial, Helvetica, sans-serif; overflow: hidden; }
  .wb-info { flex: 0 0 4.3in; padding: .08in .15in; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
  .wb-name { font-size: 20pt; font-weight: 700; line-height: 1.05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wb-line { font-size: 11pt; margin-top: 2px; } .wb-sim { font-size: 6.5pt; letter-spacing: .04em; margin-top: 3px; color: #333; }
  .wb-qrbox { flex: 0 0 1.05in; display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px dashed #666; }
  .wb-qr { width: .86in; height: .86in; } .wb-code { font-size: 5.5pt; font-family: monospace; margin-top: 1px; }
  .wb-tail { flex: 1; border-left: 1px dashed #666; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 .12in; font-size: 7.5pt; color: #444; background: repeating-linear-gradient(135deg, #fff, #fff 6px, #f3f3f3 6px, #f3f3f3 12px); }
  .wb-allergy { height: .7in; border-color: #b00000; border-width: 3px; } .wb-allergy .wb-info { flex: 0 0 6in; } .wb-allergy .wb-name { color: #b00000; font-size: 13pt; } .wb-allergy .wb-line { font-size: 12pt; font-weight: 700; }
  .wb-allergy .wb-tail { border-left-color: #b00000; }
  .wb-labels { display: grid; grid-template-columns: repeat(auto-fill, minmax(2.4in, 1fr)); gap: .12in; }
  .wb-label { border: 1px dashed #555; border-radius: 6px; padding: 6px 8px; font-size: 11pt; display: flex; gap: 8px; align-items: center; page-break-inside: avoid; }
  .wb-label .wb-qr { width: .8in; height: .8in; flex: none; } .wb-label b { display: block; } .wb-label small { color: #444; font-size: 8pt; word-break: break-all; }
  .wb-controls { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; padding: 6px 20px 10px; font-size: 14px; border-bottom: 1px solid #e3e9f1; }
  .wb-controls label { display: flex; gap: 6px; align-items: center; font-size: 14px; } .wb-controls input[type=checkbox] { width: 18px; height: 18px; min-height: 0; margin: 0; } .wb-controls input[type=number], .wb-controls select { min-height: 0; margin: 0; width: auto; } .wb-controls select, .wb-controls input[type=number] { padding: 6px; font-size: 14px; }
  .wb-h3 { margin: 18px 0 6px; font-size: 15px; }
  @media print {
    @page { size: letter portrait; margin: .5in; }
    body.wb-printing > *:not(#wbDialog) { display: none !important; }
    body.wb-printing #wbDialog { position: static !important; display: block !important; width: auto !important; box-shadow: none !important; border: 0 !important; margin: 0 !important; max-width: none !important; }
    body.wb-printing #wbDialog::backdrop { display: none; }
    body.wb-printing .wb-noprint { display: none !important; }
    body.wb-printing .wb-body { padding: 0; overflow: visible; }
  }`;

  function ensureStyle() {
    if (document.getElementById('wbStyle')) return;
    const s = document.createElement('style'); s.id = 'wbStyle'; s.textContent = CSS; document.head.appendChild(s);
  }

  // Shared print dialog. bodyHtml goes in the printable area; controlsHtml (optional) is shown above it but not printed.
  function showDialog(title, intro, bodyHtml, controlsHtml) {
    ensureStyle();
    let dlg = document.getElementById('wbDialog');
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.id = 'wbDialog'; dlg.className = 'wb-dialog';
      document.body.appendChild(dlg);
      dlg.addEventListener('close', () => document.body.classList.remove('wb-printing'));
      window.addEventListener('afterprint', () => document.body.classList.remove('wb-printing'));
    }
    dlg.innerHTML = `<div class="wb-head wb-noprint"><div><h2>${esc(title)}</h2><p>${intro}</p></div><div><button class="wb-btn" id="wbPrintNow">Print</button> <button class="wb-x" id="wbClose" aria-label="Close">×</button></div></div>${controlsHtml ? `<div class="wb-controls wb-noprint">${controlsHtml}</div>` : ''}<div class="wb-body">${bodyHtml}</div>`;
    dlg.querySelector('#wbClose').addEventListener('click', () => { dlg.close(); document.body.classList.remove('wb-printing'); });
    dlg.querySelector('#wbPrintNow').addEventListener('click', () => { document.body.classList.add('wb-printing'); window.print(); });
    if (!dlg.open) dlg.showModal();
    return dlg;
  }

  // opts.labels: [{ title, line, code }] extra QR labels (medication packages) to print under the wristband.
  function open(canon, opts) {
    if (!canon || !canon.patient) return;
    opts = opts || {};
    const labels = (opts.labels || []).map(l => `<div class="wb-label">${qrSvg(l.code)}<div><b>${esc(l.title)}</b>${esc(l.line || '')}<br><small>${esc(l.code)}</small></div></div>`).join('');
    showDialog(`Print wristband${opts.labels ? ' and medication labels' : ''}`, 'Print on plain letter paper (portrait, 100% scale). Cut out each band, wrap it around the wrist and tape it. Scanning the QR code in the EHR confirms the patient.',
      `${bandHtml(canon)}${opts.labels ? `<div class="wb-h3">Medication labels</div><div class="wb-labels">${labels || '<div>No medications are due at the current simulation time.</div>'}</div>` : ''}`);
  }

  window.NSWristband = { patientCode, qrSvg, bandHtml, open, dobText, showDialog, hash };
})();

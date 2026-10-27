/* NursingSim - medication package codes, decoys, expiration dates and printable vial labels.
   Shared by the EHR (scanning) and the Case Builder (printing), so both always agree on the code for a medication.
   Needs wristband.js (QR + print dialog) loaded first. */
(() => {
  'use strict';
  const W = window.NSWristband;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hex = n => n.toString(16).toUpperCase().padStart(8, '0');
  const hash = W.hash;

  // look-alike / sound-alike and wrong-concentration packages used as decoys
  const LASA = {
    hydralazine: 'hydrOXYzine', hydroxyzine: 'hydrALAZINE', lorazepam: 'ALPRAZolam', alprazolam: 'LORazepam', morphine: 'HYDROmorphone', hydromorphone: 'MORphine',
    carvedilol: 'captopril', metoprolol: 'metoprolol succinate ER (extended-release)', ceftriaxone: 'cefazolin', cefepime: 'cefoxitin', celecoxib: 'CeleXA (citalopram)',
    lisinopril: 'lisinopril/hydrochlorothiazide combination', sertraline: 'sertraline 100 mg (double strength)', heparin: 'heparin 10,000 units/mL (high concentration)',
    insulin: 'insulin glargine (long-acting; wrong insulin)'
  };
  const unitOf = dose => { const m = String(dose).match(/^([\d,.]+)\s*(mg|mcg|g|units|unit|mEq|mL)\b/i); return m ? { v: parseFloat(m[1].replace(/,/g, '')), u: m[2] } : null; };
  const fmtNum = n => (Number.isInteger(n) ? n.toLocaleString('en-US') : String(n));

  // ---- dates (all as YYYY-MM-DD text)
  const pad = n => String(n).padStart(2, '0');
  const dateOnly = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  const parseDay = t => { const m = String(t || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null; };
  const addDays = (t, n) => { const d = parseDay(t) || new Date(); d.setUTCDate(d.getUTCDate() + n); return dateOnly(d); };
  const us = t => { const m = String(t || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[2]}/${m[3]}/${m[1]}` : String(t || ''); };
  // the pharmacy default: end of the month, one year out
  function defaultExpiry(simDate) {
    const d = parseDay(simDate) || new Date();
    return dateOnly(new Date(Date.UTC(d.getUTCFullYear() + 1, d.getUTCMonth() + 1, 0)));
  }
  const expiryOf = (order, simDate) => (order.medication && order.medication.expires) || defaultExpiry(simDate);
  const isExpired = (expires, simDate) => { const e = parseDay(expires), n = parseDay(simDate); return !!(e && n && n.getTime() > e.getTime()); };

  // ---- codes
  const genCode = order => `MED-${hex(hash(order.id))}`;
  // The code a scanner should read for this medication: a barcode the instructor linked, otherwise the generated one.
  const medCode = order => (order.medication && String(order.medication.barcode || '').trim()) || genCode(order);
  const lotOf = order => `L${hex(hash(order.id + ':lot')).slice(0, 5)}`;

  // opts: { decoys: bool, simDate: 'YYYY-MM-DD...' }
  function packages(order, opts) {
    opts = opts || {};
    const med = order.medication || {}, dose = String(med.dose == null ? '' : med.dose), route = String(med.route || ''), name = String(order.name || '');
    const exp = expiryOf(order, opts.simDate);
    const pkgs = [{ code: medCode(order), alt: med.barcode ? [genCode(order)] : [], label: name, strength: dose, route, correct: true, kind: 'correct', expires: exp, lot: lotOf(order) }];
    if (opts.decoys) {
      const u = unitOf(dose);
      if (u) pkgs.push({ code: `MED-${hex(hash(order.id + ':strength'))}`, alt: [], label: name, strength: `${fmtNum(u.v * 2)} ${u.u}`, route, correct: false, kind: 'strength', expires: exp, lot: lotOf(order) + 'S' });
      const first = name.toLowerCase().split(/[\s(]/)[0];
      if (LASA[first]) pkgs.push({ code: `MED-${hex(hash(order.id + ':lasa'))}`, alt: [], label: LASA[first], strength: dose, route, correct: false, kind: 'lasa', expires: exp, lot: lotOf(order) + 'L' });
    }
    if (med.expiredDecoy) pkgs.push({ code: `MED-${hex(hash(order.id + ':expired'))}`, alt: [], label: name, strength: dose, route, correct: false, kind: 'expired', expires: addDays(opts.simDate, -45), lot: lotOf(order) + 'X' });
    return pkgs.sort((a, b) => hash(order.id + a.code) - hash(order.id + b.code));
  }
  const matches = (pkg, code) => { const c = String(code).trim().toUpperCase(); return pkg.code.toUpperCase() === c || (pkg.alt || []).some(a => a.toUpperCase() === c); };

  // ---- label text
  const FORMS = /\b(extended-release tablet|sublingual tablet|nebulizer solution|oral solution|ophthalmic solution|tablet|capsule|injection|IVPB|solution|inhaler|suppository|patch|cream|ointment|suspension|infusion|syringe)\b/i;
  function splitName(name) {
    const m = String(name).match(FORMS);
    return m ? { base: String(name).replace(FORMS, '').replace(/\s{2,}/g, ' ').trim(), form: m[1] } : { base: String(name), form: '' };
  }

  const SIZES = {
    vial: { w: '2in', h: '0.9in', qr: '0.66in', name: '8pt', rest: '7pt', small: '5.5pt', label: 'Vial or syringe (2 x 0.9 in)' },
    mini: { w: '1.5in', h: '0.7in', qr: '0.5in', name: '6.5pt', rest: '5.5pt', small: '4.5pt', label: 'Small (1.5 x 0.7 in)' },
    bag: { w: '3.2in', h: '1.5in', qr: '1in', name: '12pt', rest: '9pt', small: '7pt', label: 'Bottle or IV bag (3.2 x 1.5 in)' },
    std: { w: '3in', h: '2in', qr: '1.3in', name: '15pt', rest: '10.5pt', small: '8pt', label: 'Standard (3 x 2 in)' },
    iv: { w: '4in', h: '3in', qr: '1.9in', name: '20pt', rest: '14pt', small: '10pt', label: 'Large IV bag (4 x 3 in)' }
  };

  // item: { pkg, order }, o: { size, showQr, patient (canonical.patient or null) }
  function labelHtml(item, o) {
    const sz = SIZES[o.size] || SIZES.vial, { pkg, order } = item, { base, form } = splitName(pkg.label);
    const high = order.medication && order.medication.highAlert;
    const pt = o.patient ? `<div class="ml-pt">${esc(o.patient.name)} · ${esc(o.patient.mrn)}</div>` : '';
    return `<div class="ml-label" style="width:${sz.w};height:${sz.h};--qr:${sz.qr};--fn:${sz.name};--fr:${sz.rest};--fs:${sz.small}">
      <div class="ml-text">
        <div class="ml-name">${esc(base)}</div>
        <div class="ml-dose">${esc(pkg.strength)} · ${esc(pkg.route)}${form ? ' · ' + esc(form) : ''}</div>
        ${pt}
        <div class="ml-exp"><b>EXP ${esc(us(pkg.expires))}</b> · ${esc(pkg.lot)}</div>
        <div class="ml-sim">${high ? 'HIGH-ALERT · ' : ''}SIMULATION ONLY</div>
      </div>
      ${o.showQr === false ? '' : `<div class="ml-qr">${W.qrSvg(pkg.code, 'ml-qrsvg')}</div>`}
    </div>`;
  }

  const CSS = `
  .ml-grid { display: flex; flex-wrap: wrap; gap: .1in; align-items: flex-start; }
  .ml-label { box-sizing: border-box; border: 1px dashed #666; border-radius: 3px; padding: .04in .06in; display: flex; gap: .05in; align-items: center; background: #fff; color: #000; font-family: Arial, Helvetica, sans-serif; overflow: hidden; page-break-inside: avoid; }
  .ml-text { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: .01in; line-height: 1.1; }
  .ml-name { font-size: var(--fn); font-weight: 700; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .ml-dose { font-size: var(--fr); } .ml-exp { font-size: var(--fr); } .ml-pt { font-size: var(--fs); font-weight: 700; }
  .ml-sim { font-size: var(--fs); color: #444; letter-spacing: .03em; }
  .ml-qr { flex: none; } .ml-qrsvg { width: var(--qr); height: var(--qr); display: block; }
  .ml-kind { font-size: 11px; color: #55657a; margin: 10px 0 4px; font-family: Arial, sans-serif; }
  `;
  function ensureStyle() { if (!document.getElementById('mlStyle')) { const s = document.createElement('style'); s.id = 'mlStyle'; s.textContent = CSS; document.head.appendChild(s); } }

  const KIND = { correct: 'Correct package', strength: 'Decoy: wrong strength', lasa: 'Decoy: look-alike / sound-alike drug', expired: 'Decoy: expired package' };

  const defaultSize = (order, pkg) => {
    const r = String((order.medication && order.medication.route) || '').toLowerCase();
    return /\b(iv|intravenous)\b/.test(r) && /IVPB|infusion|bag|mL\/h/i.test(order.name + ' ' + ((order.medication && order.medication.dose) || '')) ? 'bag' : 'vial';
  };
  // Items for NSPrint: one per package (decoys optional). o: { simDate, decoys, size, patient (canonical.patient or null) }
  function printItems(canon, orders, o) {
    o = o || {}; const simDate = o.simDate || (canon.timeline && canon.timeline.simulationStart) || '', items = [];
    orders.forEach(order => packages(order, { decoys: !!o.decoys, simDate }).filter(p => o.decoys || p.correct).forEach(pkg => {
      items.push({
        id: 'ml-' + order.id + '-' + pkg.code, group: 'Medication labels', title: pkg.label + (pkg.strength ? ' ' + pkg.strength : ''),
        sub: (o.decoys ? KIND[pkg.kind] + ' · ' : '') + 'EXP ' + us(pkg.expires),
        sizes: Object.entries(SIZES).map(([k, v]) => ({ key: k, label: v.label })), size: o.size || defaultSize(order, pkg), checked: true,
        html: size => labelHtml({ pkg, order }, { size, showQr: true, patient: o.patient ? canon.patient : null })
      });
    }));
    return items;
  }
  // Opens the shared print dialog with the wristband plus these medication labels.
  function openSheet(canon, orders, opts) {
    opts = opts || {}; ensureStyle();
    const items = (opts.wristband === false ? [] : W.printItems(canon)).concat(printItems(canon, orders, opts));
    window.NSPrint.open({ title: 'Print wristband and labels', items, preselect: opts.preselect });
  }

  window.NSMedLabel = { packages, matches, medCode, genCode, expiryOf, defaultExpiry, isExpired, parseDay, addDays, us, lotOf, openSheet, printItems, ensureStyle, SIZES, labelHtml, LASA, splitName };
})();

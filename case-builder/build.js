/* NursingSim Case Builder v2 - turns a spec into canonical v2 JSON (orders, MAR, devices, I&O, flowsheet...). */
NS.build = (() => {
  const U = NS.util, E = NS.engine;


  // ---------- Injectable strength and volume (IM, IV push, IV piggyback, SubQ) ----------
  // Every IM and IV medication states how many mL are drawn up / hung and the strength per mL, e.g. clindamycin 600 mg = 4 mL (150 mg/mL).
  // perMl = strength of the vial / syringe; bag = fixed piggyback volume in mL; text = shown instead of a strength when the dose is already a volume.
  const INJ = [
    [/ceftriaxone.*injection/i, { perMl: [500, 'mg'] }], [/clindamycin.*injection/i, { perMl: [150, 'mg'] }], [/cyanocobalamin/i, { perMl: [1000, 'mcg'] }], [/glucagon/i, { perMl: [1, 'mg'] }],
    [/enoxaparin/i, { perMl: [100, 'mg'] }], [/heparin injection \((ACS|STEMI|VTE) bolus\)/i, { perMl: [1000, 'units'] }], [/heparin injection/i, { perMl: [5000, 'units'] }],
    [/insulin (glargine|lispro|regular).*(injection|correction)/i, { perMl: [100, 'units'], noVol: true }],
    [/furosemide/i, { perMl: [10, 'mg'] }], [/hydromorphone.*injection/i, { perMl: [1, 'mg'] }], [/morphine injection/i, { perMl: [2, 'mg'] }], [/ondansetron/i, { perMl: [2, 'mg'] }],
    [/ketorolac/i, { perMl: [15, 'mg'] }], [/labetalol/i, { perMl: [5, 'mg'] }], [/metoprolol injection/i, { perMl: [1, 'mg'] }], [/lorazepam/i, { perMl: [2, 'mg'] }],
    [/methylprednisolone/i, { perMl: [40, 'mg'], big: [62.5] }], [/hydrocortisone/i, { perMl: [50, 'mg'] }], [/pantoprazole.*(IV|injection)$/i, { perMl: [4, 'mg'] }], [/phenobarbital/i, { perMl: [65, 'mg'] }],
    [/thiamine/i, { perMl: [100, 'mg'] }], [/desmopressin/i, { perMl: [4, 'mcg'] }], [/diltiazem.*injection/i, { perMl: [5, 'mg'] }], [/levothyroxine.*injection/i, { perMl: [100, 'mcg'] }],
    [/dextrose 50%/i, { text: '500 mg/mL (50%)' }], [/calcium gluconate 10%/i, { text: '100 mg/mL (10%)' }],
    [/vaccine|ADACEL/i, { text: 'single-dose prefilled syringe' }], [/hydromorphone.*PCA/i, { text: '0.2 mg/mL (PCA syringe)' }], [/potassium chloride IV replacement/i, { text: '10 mEq per 100 mL bag' }],
    [/aztreonam/i, { perMl: [20, 'mg'] }], [/meropenem/i, { perMl: [20, 'mg'] }], [/ertapenem/i, { perMl: [20, 'mg'] }], [/potassium chloride IVPB/i, { perMl: [0.1, 'mEq'] }],
    [/acetaminophen.*IVPB/i, { perMl: [10, 'mg'] }], [/azithromycin.*IVPB/i, { perMl: [2, 'mg'] }], [/calcium gluconate IVPB/i, { perMl: [20, 'mg'] }], [/cefazolin.*IVPB/i, { perMl: [20, 'mg'] }],
    [/cefepime.*IVPB/i, { perMl: [20, 'mg'] }], [/ceftriaxone.*IVPB/i, { perMl: [20, 'mg'] }], [/clindamycin.*IVPB/i, { perMl: [18, 'mg'] }], [/doxycycline.*IVPB/i, { perMl: [1, 'mg'] }],
    [/levetiracetam/i, { perMl: [10, 'mg'] }], [/magnesium sulfate IVPB/i, { perMl: [20, 'mg'] }], [/metronidazole/i, { perMl: [5, 'mg'] }], [/piperacillin/i, { bag: 100 }],
    [/pantoprazole.*IVPB/i, { bag: 100 }], [/tranexamic/i, { perMl: [10, 'mg'] }], [/infliximab/i, { bag: 250 }], [/vancomycin/i, { perMl: [5, 'mg'] }], [/immune globulin/i, { perMl: [100, 'mg'] }], [/sodium phosphate/i, { bag: 250 }]
  ];
  const nice = n => { const r = Math.round(n * 100) / 100; return Number.isInteger(r) ? r.toLocaleString('en-US') : String(r); };
  function injectableDisplay(med) {
    if (!/^(IV|IM|Intramuscular|Subcutaneous|SubQ)/i.test(med.route || '') || med.freq === 'continuous' || med.concentration) return null;
    const hit = INJ.find(([re]) => re.test(med.name || '')); if (!hit) return null;
    const sp = hit[1], dose = String(med.dose || '');
    if (/demand|lockout|\/hr|\/min|\bPCA\b|correction/i.test(dose) && !sp.noVol && !sp.text) return null;
    if (sp.text) return { concentration: sp.text, adminDose: /mL/i.test(dose) ? dose : '' };
    if (sp.noVol) return { concentration: `${sp.perMl[0]} ${sp.perMl[1]}/mL`, adminDose: '' };
    const m = dose.match(/^([\d,.]+)\s*(mg|mcg|g|units|mEq|mmol)\b/i); if (!m) return null;
    let amt = parseFloat(m[1].replace(/,/g, '')), unit = m[2].toLowerCase();
    if (sp.noVol) return { concentration: `${sp.perMl[0]} ${sp.perMl[1]}/mL`, adminDose: '' };
    if (sp.perMl) {
      let [c, cu] = sp.perMl; if (sp.big && amt > 100) c = sp.big[0];
      if (unit === 'g' && cu === 'mg') { amt *= 1000; unit = 'mg'; }
      if (unit === 'g' && cu === 'units') return null;
      if (unit.toLowerCase() !== cu.toLowerCase()) return null;
      const bag = med.volume || (/in\s+([\d,.]+)\s*mL/i.exec(dose) || [])[1];
      if (/IVPB|infusion/i.test(med.name) || bag) {
        const v = bag ? parseFloat(String(bag).replace(/,/g, '')) : amt / c;
        return { concentration: `${nice(amt / v)} ${cu}/mL`, adminDose: `${m[1]} ${m[2]} in ${nice(v)} mL` };
      }
      return { concentration: `${nice(c)} ${cu}/mL`, adminDose: `${dose.replace(/\s*\(.*$/, '')} = ${nice(amt / c)} mL` };
    }
    if (sp.bag) { const v = med.volume || sp.bag; if (unit === 'g') { amt *= 1000; unit = 'mg'; } return { concentration: `${nice(amt / v)} ${unit}/mL`, adminDose: `${m[1]} ${m[2]} in ${nice(v)} mL` }; }
    return null;
  }

  // ---------- Medication preparation (allergy swaps, renal dosing, holds) ----------
  function prepareMeds(ctx, spec) {
    const prepared = [];
    spec.meds.forEach(src => {
      if (src.when === false) return;
      let med = U.clone(src);
      med.startH = med.startH ?? 3;

      // Allergy substitution
      (med.avoid || []).forEach(word => {
        if (!med) return;
        if (ctx.allergic(word)) {
          if (med.alt) {
            spec.applied.push(`${med.name} replaced with ${med.alt.name} because of ${word} allergy.`);
            med = Object.assign(med, U.clone(med.alt), { alt: undefined });
          } else {
            spec.applied.push(`${med.name} omitted because of ${word} allergy.`);
            med = null;
          }
        }
      });
      if (!med) return;

      // Renal dosing
      if (ctx.renal !== 'none' && med.renal) {
        const r = med.renal[ctx.renal] || (ctx.renal === 'esrd' ? med.renal.ckd3 : null);
        if (r && r.avoid) {
          if (r.sub) {
            spec.applied.push(`${med.name} replaced with ${r.sub.name} for ${ctx.renal === 'esrd' ? 'ESRD' : 'CKD'}.`);
            med = Object.assign(med, U.clone(r.sub));
          } else {
            spec.applied.push(`${med.name} omitted because of ${ctx.renal === 'esrd' ? 'ESRD' : 'CKD'}.`);
            return;
          }
        } else if (r) {
          if (r.dose) med.dose = r.dose;
          if (r.freq) med.freq = r.freq;
          med.nursing = [...(med.nursing || []), r.note || 'Dose adjusted for reduced kidney function.'];
          spec.applied.push(`${med.name} dose adjusted for ${ctx.renal === 'esrd' ? 'ESRD' : 'CKD'}.`);
        }
      }

      // State-dependent variants (e.g. correction insulin every 6 h while NPO)
      const evalH = (med.stopH !== undefined && med.stopH <= ctx.nowH) ? med.startH : Math.max(med.startH, ctx.nowH);
      Object.entries(med.variants || {}).forEach(([flag, patch]) => {
        if (E.flagAt(spec, flag, evalH)) Object.assign(med, patch);
      });

      // Strict NPO (nothing by mouth, including medications, e.g. before a stroke swallow evaluation)
      if (med.route === 'Oral' && E.flagAt(spec, 'npoStrict', med.startH)) {
        let hs = med.startH;
        while (hs < 400 && E.flagAt(spec, 'npoStrict', hs)) hs += 0.5;
        spec.applied.push(`${med.name} not started until ${U.epic(ctx.ts(hs))} (strict NPO: nothing by mouth, including medications).`);
        med.startH = hs;
      }

      // Home medications held while NPO / pre-op etc.
      if (med.holdIf && med.holdIf.length) {
        const held = h => med.holdIf.some(flag => E.flagAt(spec, flag, h));
        if (held(med.startH)) {
          let h = med.startH;
          while (h < 400 && held(h)) h += 0.5;
          spec.applied.push(`Home medication ${med.name} held until ${U.epic(ctx.ts(h))} (${med.holdIf.join('/')}).`);
          spec.heldMeds = spec.heldMeds || [];
          spec.heldMeds.push({ name: med.name, untilH: h, reason: med.holdReason || med.holdIf.join(', ') });
          med.startH = h;
        }
      }
      prepared.push(med);
    });

    // De-duplicate the same drug starting at the same time
    const seen = new Set();
    const unique = prepared.filter(m => {
      const key = `${U.slug(m.key || m.name)}|${m.prn ? 'prn' : 'sch'}|${m.freq === 'once' || m.freq === 'stat' ? Math.round(m.startH) : ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // An NPO window that begins mid-stay pauses scheduled oral medications (except those allowed with sips) and resumes them after.
    const result = [];
    unique.forEach(m => {
      result.push(m);
      if (m.route !== 'Oral' || m.prn || m.freq === 'once' || m.freq === 'stat') return;
      const windows = (m.sips ? [] : (spec.flags.npo || [])).concat(spec.flags.npoStrict || []).sort((x, y) => x[0] - y[0]);
      let current = m;
      windows.forEach(([a, z]) => {
        const stop = current.stopH === undefined ? 1e9 : current.stopH;
        if (current.startH < a - 1e-6 && stop > a) {
          const resume = U.clone(current);
          resume.startH = z; resume.home = false; resume.resumed = true;
          current.stopH = a; current.completed = false;
          spec.applied.push(`${m.name} paused while NPO (${U.epic(ctx.ts(a))} to ${U.epic(ctx.ts(z))}).`);
          if (resume.stopH === undefined || resume.startH < resume.stopH) { result.push(resume); current = resume; }
        }
      });
    });
    return result;
  }

  function doseHours(ctx, med) {
    const f = E.FREQ[med.freq] || E.FREQ.daily;
    const startH = med.startH, endH = Math.min(med.stopH ?? 1e9, ctx.windowEnd);
    if (startH > endH) return [];
    if (med.freq === 'once' || med.freq === 'stat') return [startH];
    if (med.freq === 'continuous') return [];
    const admitMs = U.parse(ctx.admit);
    const midnight = new Date(admitMs); midnight.setUTCHours(0, 0, 0, 0);
    let clock = med.at || f.clock;
    if ((med.freq === 'q24h' || med.freq === 'daily') && med.anchorStart) {
      const st = ctx.ts(startH);
      clock = [U.hhmm(st)];
    }
    const out = [];
    if (med.firstDoseAtStart !== false && med.stat) out.push(startH);
    for (let d = -1; d <= Math.ceil(endH / 24) + 1; d++) {
      clock.forEach(c => {
        const ms = midnight.getTime() + d * 86400000 + (+c.slice(0, 2)) * 3600000 + (+c.slice(2)) * 60000;
        if (med.weekday !== undefined && new Date(ms).getUTCDay() !== med.weekday) return;   // once-weekly drugs are due only on their day
        const h = (ms - admitMs) / 3600000;
        if (h < startH - 1e-6 || h > endH + 1e-6) return;
        if (out.length && Math.abs(h - out[out.length - 1]) < (f.gap || 2)) return;
        out.push(h);
      });
    }
    return out.sort((a, b) => a - b);
  }

  function monitoringRules(med) {
    return (med.monitor || []).map(tok => E.MONITOR[tok]).filter(Boolean).map(r => Object.assign({}, r));
  }

  function freqText(med) {
    const f = E.FREQ[med.freq] || { text: med.freq || 'As ordered' };
    let t = med.freqText || f.text;
    if (med.freq === 'continuous' && med.rate) t = `Continuous at ${med.rate}`;
    if (med.prn) t = `${med.prnInterval || 'Every 4 hours'} PRN ${med.prnFor || ''}`.trim();
    return t;
  }

  function buildMedicationOrders(ctx, spec, prepared) {
    const orders = [], admins = [];
    // MAR columns are CLOCK hours starting at the hour of the shift start (0845 start -> first column 0800), so a dose's column is its clock hour minus that first hour
    const slotBase = U.parse(String(ctx.start).slice(0, 13) + ':00'), slotOf = h => Math.floor((U.parse(ctx.ts(h)) - slotBase) / 3600000 + 1e-6);
    const slotHours = Math.max(8, Math.ceil(ctx.windowEnd - ctx.nowH - 1e-6));   // 8 hours, longer when a late scenario trigger extends the shift
    prepared.forEach((med, idx) => {
      const orderId = `order_med_${U.slug(med.key || med.name)}_${med._idx !== undefined ? med._idx : idx}`;
      const oneTime = med.freq === 'once' || med.freq === 'stat';
      const ended = (med.stopH !== undefined && med.stopH <= ctx.nowH) || (oneTime && med.startH <= ctx.nowH);
      const future = med.startH > ctx.nowH;
      const isPrn = !!med.prn;
      const category = med.freq === 'continuous' ? 'continuous' : isPrn ? 'prn' : 'scheduled';
      const by = med.by || (med.startH < 2.5 ? 'ed' : (spec.primaryTeam || 'hospitalist'));
      const provider = E.TEAM[by] || by;

      // Doses
      let hours = isPrn ? (med.prnGiven || []).filter(h => h >= med.startH && h <= ctx.nowH) : doseHours(ctx, med);
      const past = hours.filter(h => h <= ctx.nowH).slice(-3);
      let last = null;
      past.forEach((h, i) => {
        const stamp = ctx.ts(h);
        last = stamp;
        admins.push({
          id: `admin_${U.slug(orderId)}_p${i}`, orderId, slotIndex: -1, time: U.hhmm(stamp), state: 'given',
          label: `${U.hhmm(stamp)} Given ${med.dose}`, dose: med.dose, route: med.route,
          administeredTime: U.epic(stamp), administeredAt: stamp, administeredBy: h < 3 ? E.TEAM.rnDay : (U.hhmm(stamp) >= '1900' || U.hhmm(stamp) < '0700' ? E.TEAM.rnNight : E.TEAM.rnDay)
        });
      });
      if (!isPrn && med.freq !== 'continuous') {
        hours.filter(h => h > ctx.nowH && h <= ctx.nowH + slotHours).forEach((h, i) => {
          const stamp = ctx.ts(h);
          const slot = slotOf(h);
          admins.push({
            id: `admin_${U.slug(orderId)}_d${i}`, orderId, slotIndex: Math.min(slot, slotHours - 1), time: U.hhmm(stamp), state: 'due',
            label: `${U.hhmm(stamp)} Due`, dose: med.dose, route: med.route
          });
        });
      }
      if (med.freq === 'continuous' && med.startH > ctx.nowH && med.startH <= ctx.windowEnd) {
        // an infusion ordered during the shift: the nurse starts it from the MAR
        const stamp = ctx.ts(med.startH);
        admins.push({
          id: `admin_${U.slug(orderId)}_start`, orderId, slotIndex: Math.max(0, Math.min(slotHours - 1, slotOf(med.startH))), time: U.hhmm(stamp), state: 'due',
          label: `${U.hhmm(stamp)} Start ${med.rate || ''}`.trim(), dose: med.rate || med.dose, route: med.route
        });
      }
      if (med.freq === 'continuous' && med.startH <= ctx.nowH && !ended) {
        admins.push({
          id: `admin_${U.slug(orderId)}_run`, orderId, slotIndex: 0, time: U.hhmm(ctx.start), state: 'given',
          label: `${U.hhmm(ctx.start)} Running ${med.rate || ''}`.trim(), dose: med.rate || med.dose, route: med.route,
          administeredTime: U.epic(ctx.start), administeredAt: ctx.start
        });
        last = ctx.start;
      }

      const mar = {
        category, orderStartIndex: future ? Math.max(0, Math.min(slotHours - 1, slotOf(med.startH))) : 0,
        adminDose: med.adminDose || med.dose, dispenseLocation: med.dispense || (med.route === 'IV' ? 'Central Pharmacy (IV room)' : 'Pharmacy to load in ADS'),
        completed: ended, lastAdmin: last ? `${U.epic(last)} (Given)` : ''
      };
      if (med.concentration) mar.concentration = med.concentration;
      else { const inj = injectableDisplay(med); if (inj) { mar.concentration = inj.concentration; if (inj.adminDose && !med.adminDose) mar.adminDose = inj.adminDose; } }
      if (med.stopH !== undefined && med.stopH > ctx.nowH && med.stopH <= ctx.windowEnd) mar.discontinuedIndex = Math.floor(med.stopH - ctx.nowH);

      orders.push({
        id: orderId, name: med.name, category: 'Medication',
        status: ended ? (oneTime || med.completed !== false ? 'Completed' : 'Discontinued') : 'Active',
        frequency: freqText(med),
        start: ctx.ts(med.startH), end: med.stopH !== undefined ? ctx.ts(med.stopH) : '',
        orderedAt: ctx.ts(Math.min(med.startH, Math.max(0, med.startH - 0.1))), provider,
        instructions: med.instructions || `Administer ${med.dose} ${med.route} ${freqText(med)}.${med.hold ? ' ' + med.hold : ''}`,
        rationale: med.indication || '',
        linkedData: med.linked || [], nursingConsiderations: [...(med.nursing || []), ...(med.hold ? [med.hold] : [])],
        medication: {
          medKey: U.slug(med.key || med.name), drugClass: med.cls || '', dose: med.dose, route: med.route,
          importantInfo: med.info || '', monitoringRules: monitoringRules(med), highAlert: !!med.highAlert,
          freqKey: med.freq || '', prn: !!med.prn, at: med.at || [], hold: med.hold || '', expires: med.expires || '', barcode: med.barcode || '', expiredDecoy: !!med.expiredDecoy, edited: !!(med.edited || med.custom), custom: !!med.custom
        },
        mar
      });
    });
    return { orders, admins };
  }

  // ---------- Non-medication orders ----------
  function buildOtherOrders(ctx, spec) {
    const out = [];
    const seenOpen = new Set();
    spec.orders.forEach((o, idx) => {
      if (o.when === false) return;
      if (o.startH > ctx.windowEnd + 2) return;
      // the same standing order coming from the diagnosis and a history module is listed once
      if (o.stopH === undefined && o.completeH === undefined) {
        const k = `${o.category}|${o.name.toLowerCase()}`;
        if (seenOpen.has(k)) return;
        seenOpen.add(k);
      }
      const ended = o.stopH !== undefined && o.stopH <= ctx.nowH;
      const done = o.completeH !== undefined && o.completeH <= ctx.nowH;
      const by = o.by || (o.startH < 2.5 ? 'ed' : (spec.primaryTeam || 'hospitalist'));
      out.push({
        id: `order_${U.slug(o.category)}_${U.slug(o.name).slice(0, 40)}_${idx}`, name: o.name, category: o.category,
        status: done ? 'Completed' : ended ? (o.completed ? 'Completed' : 'Discontinued') : (o.pending ? 'Pending' : 'Active'),
        frequency: o.frequency || 'As ordered', start: ctx.ts(o.startH),
        end: o.stopH !== undefined ? ctx.ts(o.stopH) : (o.completeH !== undefined ? ctx.ts(o.completeH) : ''),
        orderedAt: ctx.ts(Math.max(0, o.startH - 0.05)), provider: E.TEAM[by] || by,
        instructions: o.instructions || '', rationale: o.rationale || '',
        linkedData: o.linked || [], nursingConsiderations: o.nursing || []
      });
    });
    return out;
  }

  // ---------- Devices ----------
  function buildDevices(ctx, spec) {
    const out = [];
    spec.devices.forEach((d, idx) => {
      if (d.when === false) return;
      if (d.removeH !== undefined && d.removeH <= ctx.nowH) return;
      if (d.placeH > ctx.windowEnd) return;
      const assessH = Math.min(ctx.nowH - 0.25, Math.max(d.placeH, ctx.nowH - ((ctx.nowH - 1) % 4) - 0.25));
      const dev = {
        id: `device_${U.slug(d.type)}_${U.slug(d.location)}_${idx}`, deviceType: d.deviceType, type: d.type, location: d.location,
        siteMarker: d.siteMarker, placementDate: ctx.ts(d.placeH), status: d.status || 'Patent',
        lastAssessment: `${ctx.ts(Math.max(d.placeH, assessH))} - ${d.assess || 'site clean, dry, intact'}`
      };
      if (d.gauge) dev.gauge = d.gauge;
      if (d.infusing) dev.infusing = d.infusing;
      if (d.drainage) dev.drainage = d.drainage;
      if (dev.placementDate && d.placeH > ctx.nowH) dev.availableAt = ctx.ts(d.placeH);
      out.push(dev);
    });
    return out;
  }

  // ---------- Intake & output (4-hour blocks ending 0300/0700/1100/1500/1900/2300) ----------
  function buildIO(ctx, spec, medOrders) {
    const out = [];
    const admitMs = U.parse(ctx.admit), nowMs = U.parse(ctx.ts(ctx.nowH));
    const firstEnd = new Date(nowMs); firstEnd.setUTCMinutes(0, 0, 0);
    let end = firstEnd.getTime();
    while (((end / 3600000) % 24) % 4 !== 3) end -= 3600000;      // align to 03,07,11,15,19,23
    while (end > nowMs) end -= 4 * 3600000;
    const blocks = [];
    for (let e = end; e - 4 * 3600000 >= admitMs - 1 && blocks.length < 7; e -= 4 * 3600000) blocks.push(e);
    blocks.reverse().forEach(e => {
      const s = e - 4 * 3600000, mid = ((s + e) / 2 - admitMs) / 3600000;
      const frame = U.stepAt(spec.io, mid) || { po: 300, urine: 350, other: 0 };
      const npo = E.flagAt(spec, 'npo', mid);
      const rnd = () => 1 + ctx.noise(0.12);
      // IV intake from running infusions, boluses and intermittent piggybacks (counted per actual dose in the block)
      let iv = 0;
      medOrders.forEach(o => {
        const m = o._src; if (!m || m.route !== 'IV' || m.prn) return;
        if (m.freq === 'continuous') {
          const a = Math.max(m.startH, (s - admitMs) / 3600000), z = Math.min(m.stopH ?? 1e9, (e - admitMs) / 3600000);
          if (z > a) iv += (m.mlPerHr || 0) * (z - a);
        } else {
          const vol = m.bolusMl || m.volume || 0;
          if (!vol) return;
          iv += doseHours(ctx, m).filter(h => h * 3600000 + admitMs >= s && h * 3600000 + admitMs < e).length * vol;
        }
      });
      const po = npo ? (frame.ice ? 30 : 0) : Math.round((frame.po || 0) * rnd());
      const urine = Math.round((frame.urine || 0) * (spec.ioMult.urine ?? 1) * rnd());
      const other = Math.round((frame.other || 0) * rnd());
      const sd = new Date(s), ed = new Date(e);
      const hh = d => String(d.getUTCHours()).padStart(2, '0') + '00';
      out.push({
        id: `io_${U.slug(U.fmt(s))}`, date: U.dateOnly(U.fmt(e)), time: `${hh(sd)}-${hh(ed)}`, intake: Math.round(iv + po), output: urine + other,
        detail: { po, iv: Math.round(iv), urine, other, otherLabel: frame.otherLabel || '' }
      });
    });
    return out;
  }

  // ---------- Flowsheet assessments ----------
  const BASE_ASSESS = [
    ['Neurologic', 'Level of Consciousness', 'Alert'],
    ['Neurologic', 'Orientation', 'Alert and oriented x4'],
    ['Respiratory', 'Breath Sounds', 'Clear bilaterally'],
    ['Respiratory', 'Respiratory Effort', 'Unlabored, even'],
    ['Cardiac', 'Rhythm', 'Normal sinus rhythm'],
    ['Cardiac', 'Heart Sounds', 'S1 S2 regular, no murmur'],
    ['Cardiac', 'Edema', 'None'],
    ['Cardiac', 'Capillary Refill', 'Less than 3 seconds'],
    ['GI', 'Abdomen', 'Soft, non-tender, non-distended'],
    ['GI', 'Bowel Sounds', 'Active in all four quadrants'],
    ['GI', 'Nausea / Vomiting', 'None'],
    ['GU', 'Urinary Elimination', 'Voiding spontaneously'],
    ['GU', 'Urine Appearance', 'Clear, yellow'],
    ['Skin', 'Skin', 'Warm, dry, intact'],
    ['Skin', 'Braden Score', '21'],
    ['Musculoskeletal / Mobility', 'Mobility', 'Independent'],
    ['Pain', 'Pain Location', 'None'],
    ['Safety', 'Fall Precautions', 'Bed low, call light in reach, non-skid socks']
  ];

  function assessmentAt(ctx, spec, h, dynamic) {
    const map = new Map();
    const put = (s, l, v) => map.set(`${s}|${l}`, [s, l, v]);
    BASE_ASSESS.forEach(a => put(...a));
    spec.assessments.filter(f => f.fromH <= h + 1e-9).forEach(f => f.items.forEach(i => put(...i)));
    Object.entries(dynamic || {}).forEach(([k, v]) => { const [s, l] = k.split('|'); put(s, l, v); });
    return map;
  }

  function buildAssessmentObservations(ctx, spec, S, obs) {
    const times = [3.5];
    const admitMs = U.parse(ctx.admit);
    const d0 = new Date(admitMs); d0.setUTCHours(0, 0, 0, 0);
    for (let d = 0; d <= Math.ceil(ctx.nowH / 24) + 1; d++) {
      [8, 20].forEach(hr => {
        const h = (d0.getTime() + d * 86400000 + hr * 3600000 - admitMs) / 3600000;
        if (h > 4 && h <= ctx.nowH) times.push(h);
      });
    }
    // 96 hours of flowsheet history is plenty for the grid
    times.filter(h => h >= ctx.nowH - 96).forEach(h => {
      const stamp = ctx.ts(h);
      const v = S.vitalSet(h);
      const dynamic = {
        'Respiratory|Oxygen Device': v ? v.o2 : 'Room air',
        'Pain|Pain Score': v ? `${v.pain}/10` : '0/10',
        'GI|Diet': S.diet(h),
        'Musculoskeletal / Mobility|Ambulation': S.activity(h)
      };
      const a = assessmentAt(ctx, spec, h, dynamic);
      a.forEach(([section, label, value]) => {
        obs.push({
          id: `assessment_${U.slug(section)}_${U.slug(label)}_${U.slug(stamp)}`, type: 'assessment', section, code: U.slug(label).toUpperCase(),
          label, value, collected: stamp, source: h < 4 ? 'Admission assessment' : 'Nursing assessment',
          abnormal: false
        });
      });
    });
    // findings written by a scenario trigger for later in the simulation window
    (spec.futureAssessments || []).filter(f => f.h <= ctx.windowEnd).forEach(f => {
      const stamp = ctx.ts(f.h);
      f.items.forEach(([section, label, value, abnormal]) => {
        obs.push({
          id: `assessment_${U.slug(section)}_${U.slug(label)}_${U.slug(stamp)}`, type: 'assessment', section, code: U.slug(label).toUpperCase(),
          label, value, collected: stamp, source: 'Nursing assessment', abnormal: abnormal !== false
        });
      });
    });
  }

  return { prepareMeds, buildMedicationOrders, buildOtherOrders, buildDevices, buildIO, buildAssessmentObservations, assessmentAt, doseHours };
})();

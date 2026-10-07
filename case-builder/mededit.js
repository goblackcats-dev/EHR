/* NursingSim Case Builder - instructor medication edits.
   input.medEdits = { removed: [{id, name}], changed: { orderId: {fields} }, added: [{fields}] }
   Edits are applied to the prepared medication list, so the MAR, orders, notes and fall-risk all follow them,
   and the same inputs still rebuild the same patient. */
NS.medEdit = (() => {
  const U = NS.util, E = NS.engine;

  // A short formulary so instructors pick a drug instead of typing it. cls/info/hold feed the order and the EHR safety checks.
  const FORMULARY = [
    { name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnFor: 'pain or fever', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources.' },
    { name: 'ibuprofen (MOTRIN) tablet', dose: '600 mg', route: 'Oral', freq: 'q6h', prn: true, prnFor: 'pain', cls: 'NSAID', info: 'Give with food. Avoid with kidney disease, GI bleeding or heart failure.' },
    { name: 'ketorolac (TORADOL) injection', dose: '15 mg', route: 'IV', freq: 'q6h', prn: true, prnFor: 'moderate to severe pain', cls: 'NSAID', info: 'Maximum 5 days. Monitor kidney function and bleeding.' },
    { name: 'morphine injection', dose: '2 mg', route: 'IV', freq: 'q4h', prn: true, prnFor: 'severe pain', cls: 'Opioid analgesic', highAlert: true, info: 'Assess pain and sedation before and after. Hold for RR below 10 or sedation.', hold: 'Hold for RR below 10 or if patient is difficult to arouse.' },
    { name: 'hydromorphone (DILAUDID) injection', dose: '0.5 mg', route: 'IV', freq: 'q4h', prn: true, prnFor: 'severe pain', cls: 'Opioid analgesic', highAlert: true, info: 'About 5 times more potent than morphine. Assess pain and sedation.', hold: 'Hold for RR below 10 or if patient is difficult to arouse.' },
    { name: 'oxycodone (ROXICODONE) tablet', dose: '5 mg', route: 'Oral', freq: 'q4h', prn: true, prnFor: 'moderate pain', cls: 'Opioid analgesic', highAlert: true, info: 'Monitor sedation and respiratory rate. Give a bowel regimen.', hold: 'Hold for RR below 10 or sedation.' },
    { name: 'ondansetron (ZOFRAN) injection', dose: '4 mg', route: 'IV', freq: 'q6h', prn: true, prnFor: 'nausea or vomiting', cls: 'Antiemetic', info: 'QT-prolonging. Check QTc and electrolytes.' },
    { name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'Give before breakfast. Swallow whole.' },
    { name: 'famotidine (PEPCID) tablet', dose: '20 mg', route: 'Oral', freq: 'BID', cls: 'H2 blocker', info: 'Adjust dose for kidney function.' },
    { name: 'senna (SENOKOT) tablet', dose: '8.6 mg', route: 'Oral', freq: 'qHS', cls: 'Stimulant laxative', info: 'Hold for loose stools.' },
    { name: 'docusate (COLACE) capsule', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Stool softener', info: 'Hold for loose stools.' },
    { name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', info: 'Check HR and BP before giving.', hold: 'Hold if SBP below 100 or HR below 60.' },
    { name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'ACE inhibitor', info: 'Monitor BP, potassium and creatinine. Watch for cough and angioedema.', hold: 'Hold if SBP below 100 or potassium above 5.0.' },
    { name: 'amlodipine (NORVASC) tablet', dose: '5 mg', route: 'Oral', freq: 'daily', cls: 'Calcium channel blocker', info: 'Monitor BP and ankle edema.', hold: 'Hold if SBP below 100.' },
    { name: 'carvedilol (COREG) tablet', dose: '6.25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', info: 'Give with food. Check HR and BP.', hold: 'Hold if SBP below 100 or HR below 55.' },
    { name: 'hydralazine injection', dose: '10 mg', route: 'IV', freq: 'q6h', prn: true, prnFor: 'SBP above 180', cls: 'Vasodilator', info: 'Recheck BP in 30 minutes.', hold: 'Hold if SBP below 110.' },
    { name: 'labetalol injection', dose: '10 mg', route: 'IV', freq: 'q6h', prn: true, prnFor: 'SBP above 180', cls: 'Beta blocker', info: 'Check HR first.', hold: 'Hold if HR below 60 or SBP below 110.' },
    { name: 'furosemide (LASIX) injection', dose: '40 mg', route: 'IV', freq: 'BID', cls: 'Loop diuretic', info: 'Give slowly. Monitor urine output, potassium and weight.', hold: 'Hold if SBP below 90.' },
    { name: 'digoxin (LANOXIN) tablet', dose: '0.125 mg', route: 'Oral', freq: 'daily', cls: 'Cardiac glycoside', highAlert: true, info: 'Check apical pulse for a full minute. Monitor digoxin level and potassium.', hold: 'Hold if HR below 60.' },
    { name: 'potassium chloride extended-release tablet', dose: '20 mEq', route: 'Oral', freq: 'daily', cls: 'Electrolyte replacement', info: 'Swallow whole with food and water. Monitor potassium and renal function.', hold: 'Hold if potassium above 5.0.' },
    { name: 'heparin injection', dose: '5,000 units', route: 'Subcutaneous', freq: 'q8h', cls: 'Anticoagulant', highAlert: true, info: 'Independent double check. Monitor platelets and for bleeding.' },
    { name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: 'daily', cls: 'Anticoagulant', highAlert: true, info: 'Do not expel the air bubble. Rotate sites. Monitor platelets and renal function.' },
    { name: 'warfarin (COUMADIN) tablet', dose: '5 mg', route: 'Oral', freq: 'qHS', cls: 'Anticoagulant', highAlert: true, info: 'Check the INR before giving. Dose is adjusted daily.', hold: 'Hold and call provider if INR above 3.5.' },
    { name: 'apixaban (ELIQUIS) tablet', dose: '5 mg', route: 'Oral', freq: 'BID', cls: 'Anticoagulant', highAlert: true, info: 'Monitor for bleeding. Do not stop without a plan.' },
    { name: 'insulin lispro (HUMALOG) correction scale', dose: 'Low-dose correction scale', route: 'Subcutaneous', freq: 'ACHS', cls: 'Rapid-acting insulin', highAlert: true, info: 'Check glucose first. Give within 15 minutes of a meal.' },
    { name: 'insulin glargine (LANTUS) injection', dose: '20 units', route: 'Subcutaneous', freq: 'qHS', cls: 'Long-acting insulin', highAlert: true, info: 'Do not mix with other insulins. Check glucose first.', hold: 'Hold and call provider if glucose below 70.' },
    { name: 'metformin (GLUCOPHAGE) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'Biguanide', info: 'Give with meals. Hold for contrast or kidney injury.' },
    { name: 'levothyroxine (SYNTHROID) tablet', dose: '100 mcg', route: 'Oral', freq: 'daily', cls: 'Thyroid hormone', info: 'Give on an empty stomach, 30 to 60 minutes before breakfast.' },
    { name: 'prednisone (DELTASONE) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Corticosteroid', info: 'Give with food. Monitor glucose.' },
    { name: 'albuterol nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'q4h', prn: true, prnFor: 'wheezing or shortness of breath', cls: 'Short-acting bronchodilator', info: 'Check HR before and after.' },
    { name: 'ipratropium-albuterol (DUONEB) nebulizer solution', dose: '3 mL', route: 'Nebulized', freq: 'q6h', cls: 'Bronchodilator', info: 'Listen to breath sounds before and after.' },
    { name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '1 g', route: 'IV', freq: 'q24h', cls: 'Cephalosporin antibiotic', info: 'Verify allergy history. Infuse over 30 minutes.' },
    { name: 'vancomycin IVPB', dose: '1,250 mg', route: 'IV', freq: 'q12h', cls: 'Glycopeptide antibiotic', highAlert: true, info: 'Infuse over at least 60 minutes (red man syndrome). Monitor trough and kidney function.' },
    { name: 'piperacillin-tazobactam (ZOSYN) IVPB', dose: '3.375 g', route: 'IV', freq: 'q8h', cls: 'Penicillin antibiotic', info: 'Check penicillin allergy. Infuse over 30 minutes.' },
    { name: 'azithromycin (ZITHROMAX) tablet', dose: '500 mg', route: 'Oral', freq: 'daily', cls: 'Macrolide antibiotic', info: 'QT-prolonging. Complete the course.' },
    { name: 'gabapentin (NEURONTIN) capsule', dose: '300 mg', route: 'Oral', freq: 'TID', cls: 'Anticonvulsant / neuropathic pain', info: 'Monitor sedation. Adjust for kidney function.' },
    { name: 'lorazepam (ATIVAN) injection', dose: '1 mg', route: 'IV', freq: 'q6h', prn: true, prnFor: 'anxiety or agitation', cls: 'Benzodiazepine', highAlert: true, info: 'Monitor sedation and respiratory rate.', hold: 'Hold for RR below 10 or sedation.' },
    { name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report muscle pain.' },
    { name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Give with food. Monitor for bleeding.' },
    { name: 'clopidogrel (PLAVIX) tablet', dose: '75 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding.' },
    { name: 'sertraline (ZOLOFT) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', cls: 'SSRI', info: 'Monitor mood and sodium.' },
    { name: '0.9% sodium chloride flush', dose: '10 mL', route: 'IV', freq: 'q8h', cls: 'IV flush', info: 'Flush the line before and after IV medications.' }
  ];

  const clockToMin = c => (+c.slice(0, 2)) * 60 + (+c.slice(2));

  function makeCustom(ctx, a, n) {
    const f = E.FREQ[a.freq] ? a.freq : 'daily', once = f === 'once' || f === 'stat';
    const med = {
      key: `custom${n}`, _idx: 900 + n, custom: true, name: a.name || 'Medication', dose: a.dose || '', route: a.route || 'Oral', freq: f,
      cls: a.cls || '', info: a.info || '', hold: a.hold || '', highAlert: !!a.highAlert, indication: a.indication || 'Added by instructor',
      monitor: [], by: 'hospitalist', expires: a.expires || '', barcode: a.barcode || '', expiredDecoy: !!a.expiredDecoy, edited: true
    };
    if (a.prn) { med.prn = true; med.prnInterval = (E.FREQ[f] || {}).text || 'As needed'; med.prnFor = a.prnFor || ''; med.prnGiven = []; }
    if (a.at && a.at.length) med.at = a.at;
    if (once) {
      // due at a clock time within the next 24 hours of the shift (default: 30 minutes from the start of the simulation)
      let delta = 0.5;
      if (a.dueClock && /^\d{4}$/.test(a.dueClock)) { const nowMin = clockToMin(ctx.start.slice(11, 16).replace(':', '')); delta = ((clockToMin(a.dueClock) - nowMin + 1440) % 1440) / 60 || 0.5; }
      med.startH = ctx.nowH + delta;
    } else {
      med.startH = a.newOrder ? ctx.nowH : ctx.nowH - 30;
    }
    return med;
  }

  function applyFields(m, ch) {
    const touched = ['name', 'dose', 'route', 'freq', 'hold', 'prn'].some(k => ch[k] !== undefined && ch[k] !== m[k]);
    ['name', 'dose', 'route', 'hold', 'highAlert', 'expires', 'barcode', 'expiredDecoy'].forEach(k => { if (ch[k] !== undefined) m[k] = ch[k]; });
    if (ch.freq && E.FREQ[ch.freq] && ch.freq !== m.freq) { m.freq = ch.freq; delete m.at; delete m.anchorStart; delete m.freqText; }
    if (ch.at !== undefined) { if (ch.at && ch.at.length) m.at = ch.at; else delete m.at; }
    if (ch.prn !== undefined) {
      if (ch.prn) { m.prn = true; m.prnInterval = m.prnInterval || (E.FREQ[m.freq] || {}).text || 'As needed'; m.prnFor = ch.prnFor !== undefined ? ch.prnFor : (m.prnFor || ''); m.prnGiven = m.prnGiven || []; }
      else { delete m.prn; delete m.prnGiven; }
    }
    if (touched) { delete m.instructions; delete m.adminDose; }
    m.edited = true;
  }

  function apply(ctx, spec, prepared, edits) {
    // stable ids: the position in the list before any edits
    prepared.forEach((m, i) => { m._idx = i; });
    if (!edits) return prepared;
    const idOf = m => `order_med_${U.slug(m.key || m.name)}_${m._idx}`;
    const removed = new Set((edits.removed || []).map(r => r.id));
    const out = prepared.filter(m => {
      if (!removed.has(idOf(m))) return true;
      spec.applied.push(`${m.name} removed by instructor.`);
      return false;
    });
    out.forEach(m => {
      const ch = (edits.changed || {})[idOf(m)];
      if (ch) { applyFields(m, ch); spec.applied.push(`${m.name} edited by instructor.`); }
    });
    (edits.added || []).forEach((a, n) => { if (a.deleted) return; const m = makeCustom(ctx, a, n); out.push(m); spec.applied.push(`${m.name} ${m.dose} ${m.route} added by instructor.`); });
    return out;
  }

  return { apply, FORMULARY };
})();

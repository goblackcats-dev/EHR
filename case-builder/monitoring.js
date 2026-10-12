/* Medication- and condition-driven monitoring (v44).
   Real inpatients get routine daily labs, and their medicines add more: warfarin needs a daily PT/INR, dofetilide (Tikosyn) needs a 12-lead ECG
   before and after each early dose with potassium and magnesium goals, methotrexate needs CBC/liver/kidney checks, vancomycin needs a trough, and so on.
   This module looks at the FINAL medication list (after the instructor's medication edits) and adds the labs, ECGs and monitoring orders that go with it.
   It only runs for diagnoses whose profile sets  medMonitoring: true  (hip fracture for now), so other diagnoses are unchanged.
   Daily AM draw at 0500: CBC (WBC, Hgb, Hct, platelets) + CMP (sodium, potassium, chloride, CO2, BUN, creatinine, glucose, calcium, AST, ALT, ALP,
   total bilirubin, albumin, total protein) + magnesium when it is needed (diuretic, PPI, QT-prolonging or antiarrhythmic drugs, digoxin, heart failure,
   atrial fibrillation, surgery) + phosphorus (kidney disease or low albumin). */
(() => {
  const U = NS.util, C = NS.LABS.C;
  const { order } = NS.HX.helpers;
  if (!C['Total protein']) C['Total protein'] = { cat: 'Hepatic', units: 'g/dL', ref: [6.0, 8.3], dec: 1, base: 7.0 };

  const CBC = ['WBC', 'Hemoglobin', 'Hematocrit', 'Platelets'];
  const CMP = ['Sodium', 'Potassium', 'Chloride', 'CO2', 'BUN', 'Creatinine', 'Glucose', 'Calcium', 'eGFR'];
  const LFT = ['AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin', 'Total protein'];
  const QT = /ondansetron|zofran|sertraline|zoloft|citalopram|escitalopram|haloperidol|quetiapine|azithromycin|levofloxacin|ciprofloxacin|moxifloxacin|methadone|dofetilide|tikosyn|sotalol|amiodarone|fluconazole/i;

  function apply(ctx, spec, meds) {
    if (!spec.medMonitoring) return;
    const names = (meds || []).map(m => String(m.name || '').toLowerCase());
    const has = re => names.some(n => re.test(n));
    const medOf = re => (meds || []).find(m => re.test(String(m.name || '').toLowerCase()));
    const note = t => spec.applied.push(t);
    const once = o => { if (!spec.orders.some(x => x.name === o.name)) order(spec, o); };

    // first routine AM draw: the first 0500 at least 20 hours after arrival (the ED draw counts for day 1)
    let firstH = ctx.hOf(`${U.dateOnly(ctx.admit)} 05:00`); while (firstH < 20) firstH += 24;

    // ---- daily panel
    const needMg = has(/furosemide|lasix|bumetanide|torsemide|hydrochlorothiazide|pantoprazole|omeprazole|esomeprazole|lansoprazole|digoxin|amiodarone|sotalol|dofetilide|tikosyn/) || (names.filter(n => QT.test(n)).length >= 1 && (ctx.has('afib') || ctx.has('hf') || ctx.has('cad'))) || ctx.has('hf') || ctx.has('afib') || spec.events.some(e => e.type === 'surgery');
    const needPhos = ctx.renal !== 'none' || (spec.labBase.Albumin !== undefined && spec.labBase.Albumin < 3.0) || (spec.labs.Albumin && spec.labs.Albumin.add && spec.labs.Albumin.add.some(p => p[1] <= -0.7));
    const codes = [...CBC, ...CMP, ...LFT];
    if (needMg) codes.push('Magnesium');
    if (needPhos) codes.push('Phosphorus');
    spec.labSchedule = spec.labSchedule.filter(i => !i.daily);
    spec.labSchedule.unshift({ daily: true, fromH: firstH - 0.5, codes });
    // the admission set is a complete panel too (liver tests and total protein)
    spec.labSchedule.unshift({ h: 0.5, codes: LFT.filter(c => c !== 'Albumin') });
    // a little natural variation for the added tests so repeated values are not identical
    spec.extraJitter = Object.assign({ AST: 2, ALT: 2, ALP: 3, 'Total bilirubin': 0.05, Albumin: 0.05, 'Total protein': 0.1, Magnesium: 0.05, Phosphorus: 0.1, Calcium: 0.08 }, spec.extraJitter || {});

    // replace the generic BMP order with the real daily orders
    spec.orders = spec.orders.filter(o => o.name !== 'CBC and basic metabolic panel');
    order(spec, { name: 'CBC and comprehensive metabolic panel (CMP)', category: 'Laboratory', frequency: 'Daily AM', instructions: `Draw at 0500 daily. CBC plus CMP (sodium, potassium, chloride, CO2, BUN, creatinine, glucose, calcium, AST, ALT, alkaline phosphatase, bilirubin, albumin, total protein). Admission labs were drawn in the ED; the first routine AM draw is ${ctx.ts(firstH).slice(0, 10)} at 0500.`, startH: 3 });
    if (needMg || needPhos) order(spec, { name: needPhos ? 'Magnesium and phosphorus' : 'Magnesium', category: 'Laboratory', frequency: 'Daily AM', instructions: 'Draw with the 0500 labs. Replace per protocol (magnesium goal 2.0 or higher with arrhythmia risk).', startH: 3 });
    note(`Daily 0500 labs added: CBC and CMP${needMg ? ', magnesium' : ''}${needPhos ? ', phosphorus' : ''} (medication- and condition-based monitoring).`);

    // ---- warfarin and other anticoagulants
    if (has(/warfarin|coumadin/)) {
      spec.labSchedule.unshift({ daily: true, fromH: firstH - 0.5, codes: ['PT', 'INR'] });
      once({ name: 'PT/INR daily', category: 'Laboratory', frequency: 'Daily AM', instructions: 'Draw at 0500 daily while on warfarin. Goal INR per indication (usually 2.0-3.0). Call for INR above 3.5, below 1.5, or any bleeding; hold the dose and call before giving if INR is above the goal.', startH: 3, nursing: ['Check the INR before every warfarin dose.'] });
      note('PT/INR added daily because of warfarin.');
    }
    if (has(/heparin injection|heparin \(|enoxaparin|lovenox|dalteparin|fondaparinux/)) {
      once({ name: 'Platelet and kidney monitoring for heparin / low-molecular-weight heparin', category: 'Laboratory', frequency: 'With daily CBC and CMP', instructions: 'Platelets are checked every 2-3 days for heparin-induced thrombocytopenia (a fall of 50% or to below 100); creatinine is checked because enoxaparin is cleared by the kidneys. Hold and call for active bleeding or platelets below 50.', startH: 3 });
    }
    if (has(/apixaban|eliquis|rivaroxaban|xarelto|dabigatran/)) once({ name: 'Hemoglobin, platelets and creatinine monitoring for direct oral anticoagulant', category: 'Laboratory', frequency: 'With daily CBC and CMP', instructions: 'Watch for a falling hemoglobin or rising creatinine (dose reduction criteria: two of age 80+, weight 60 kg or less, creatinine 1.5+).', startH: 3 });

    // ---- electrolytes and kidney function drugs
    if (has(/furosemide|lasix|bumetanide|torsemide|spironolactone|lisinopril|enalapril|ramipril|losartan|valsartan|sacubitril|entresto/)) once({ name: 'Potassium and creatinine monitoring for diuretic / ACE inhibitor / ARB', category: 'Laboratory', frequency: 'With daily CBC and CMP', instructions: 'Report potassium below 3.5 or above 5.0, or a creatinine rise of 0.3 or more. Hold ACE inhibitor/ARB and call for SBP below 100 or rising creatinine/potassium.', startH: 3 });

    // ---- drug levels
    if (has(/digoxin|lanoxin/)) { const m = medOf(/digoxin|lanoxin/); const h = Math.max(firstH + 24, (m.startH || 3) + 96); spec.labSchedule.push({ h, codes: ['Digoxin level', 'Potassium', 'Magnesium'] }); once({ name: 'Digoxin level', category: 'Laboratory', frequency: 'Once (steady state) and with symptoms', instructions: 'Draw at least 6 hours after a dose. Therapeutic about 0.8-2.0; call for toxicity signs (nausea, vision changes, bradycardia) or potassium below 4.0. Check the apical pulse for a full minute before each dose.', startH: h - 2 }); }
    if (has(/vancomycin/)) { const m = medOf(/vancomycin/); const h = (m.startH || 3) + 33.5; spec.labSchedule.push({ h, codes: ['Vancomycin trough'] }); once({ name: 'Vancomycin trough or AUC', category: 'Laboratory', frequency: 'Before the 4th dose, then per pharmacy', instructions: 'Draw 30 minutes before the dose. Pharmacy adjusts the dose; monitor creatinine daily.', startH: h - 4 }); }
    if (has(/lithium/)) { spec.labSchedule.push({ h: firstH, codes: ['Lithium level'] }); once({ name: 'Lithium level', category: 'Laboratory', frequency: 'Every 3-5 days and with dose changes', instructions: '12 hours after the last dose. Report tremor, confusion or vomiting. Keep sodium and hydration normal; avoid NSAIDs.', startH: 3 }); }
    if (has(/phenytoin|dilantin/)) { spec.labSchedule.push({ h: firstH, codes: ['Phenytoin level'] }); once({ name: 'Phenytoin level', category: 'Laboratory', frequency: 'As ordered', instructions: 'Total level corrected for albumin; watch for nystagmus, ataxia and drowsiness.', startH: 3 }); }
    if (has(/tacrolimus|prograf/)) { spec.labSchedule.push({ h: firstH, codes: ['Tacrolimus level'] }); once({ name: 'Tacrolimus trough level', category: 'Laboratory', frequency: 'Daily AM before the morning dose', instructions: 'Draw before the dose. Monitor creatinine, potassium and magnesium.', startH: 3 }); }

    // ---- immunosuppressants and steroids
    if (has(/methotrexate|trexall/)) once({ name: 'Methotrexate monitoring', category: 'Laboratory', frequency: 'Before each weekly dose', instructions: 'CBC with platelets, creatinine and liver tests (AST/ALT) are reviewed before every weekly dose. HOLD and call for WBC below 3.0, platelets below 100, rising creatinine or liver tests, fever or infection, mouth sores, or new cough/dyspnea.', startH: 3, nursing: ['Confirm it is the weekly day. Never give methotrexate daily.'] });
    if (has(/prednisone|prednisolone|methylprednisolone|dexamethasone|hydrocortisone/) && ctx.has('dm2')) once({ name: 'Glucose monitoring with corticosteroid', category: 'Lab / Bedside Testing', frequency: 'With point-of-care glucose checks', instructions: 'Steroids raise glucose, especially in the afternoon. Report glucose above 250 twice in a row or below 70.', startH: 3 });

    // ---- QT and rhythm drugs: ECG and electrolytes
    const qtDrugs = names.filter(n => QT.test(n));
    const rhythm = ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response' : 'Normal sinus rhythm';
    const ecg = (h, qtc, label, indication) => { if (h <= ctx.windowEnd) spec.events.push({ type: 'cardiology', h, study: '12-lead ECG', label, indication, impression: `${rhythm}. No acute ST-T wave changes. QTc ${qtc} ms.` }); };
    ['dofetilide|tikosyn', 'sotalol|betapace'].forEach(rx => {
      const re = new RegExp(rx); if (!has(re)) return; const m = medOf(re), label = /dofetilide/.test(rx) ? 'dofetilide (Tikosyn)' : 'sotalol';
      const t0 = m.startH || 3, seq = [458, 462, 466, 464, 460];
      ecg(t0 - 0.5, 440, `Baseline ECG before ${label}`, `Baseline QTc before starting ${label}`);
      seq.forEach((q, i) => ecg(t0 + 2.5 + 12 * i, q, `ECG after ${label} dose ${i + 1}`, `QTc check 2-3 hours after dose ${i + 1} (hold the next dose and call if QTc is above 500 ms or rises by more than 15%)`));
      spec.labSchedule.push({ h: t0 - 1, codes: ['Potassium', 'Magnesium', 'Creatinine'] });
      once({ name: `${label} monitoring`, category: 'Cardiac Testing', frequency: 'First 5 doses', instructions: `12-lead ECG with QTc before the first dose and 2-3 hours after each of the first 5 doses. Calculate creatinine clearance before dosing (dose adjusts for kidney function). Keep potassium at 4.0 or higher and magnesium at 2.0 or higher. Continuous telemetry for at least 3 days. Hold and call for QTc above 500 ms or a 15% rise, new ventricular arrhythmia, bradycardia or fainting.`, startH: t0 - 1, nursing: ['Never give dofetilide or sotalol without the ECG and the potassium/magnesium results.', 'Avoid other QT-prolonging drugs.'] });
      note(`ECGs and electrolyte goals added for ${label}.`);
    });
    if (has(/amiodarone|cordarone|pacerone/)) {
      spec.labSchedule.push({ h: 0.5, codes: ['TSH'] });
      once({ name: 'Amiodarone monitoring', category: 'Cardiac Testing', frequency: 'Baseline and with dose changes', instructions: 'Baseline ECG, TSH, liver tests (in the daily CMP) and chest x-ray; watch QTc, heart rate, and for cough or dyspnea. Hold and call for HR below 50 or QTc above 500 ms.', startH: 3 });
    }
    if (qtDrugs.length >= 2 && !has(/dofetilide|tikosyn|sotalol/)) once({ name: 'QTc monitoring (more than one QT-prolonging drug)', category: 'Cardiac Testing', frequency: 'Baseline and when a new drug is added', instructions: `Keep potassium at 4.0 or higher and magnesium at 2.0 or higher. Repeat a 12-lead ECG if QTc is above 470 ms (women) or 450 ms (men), or before repeated doses of ondansetron. Drugs on this list: ${qtDrugs.map(n => n.replace(/ \(.*$/, '')).join(', ')}.`, startH: 3, nursing: ['Ask the pharmacist before adding another QT-prolonging drug.'] });
    if (!spec.labSchedule.some(i => i.codes && i.codes.includes('Hemoglobin A1c')) && has(/insulin/) && ctx.has('dm2')) spec.labSchedule.push({ h: 0.5, codes: ['Hemoglobin A1c'] });
  }

  NS.monitor = { apply, RULES: 'see apply()' };
})();

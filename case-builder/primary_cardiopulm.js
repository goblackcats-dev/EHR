/* Cardiopulmonary primary diagnoses: NSTEMI, STEMI, atrial fibrillation with RVR, pulmonary embolism, asthma exacerbation. */
(() => {
  const U = NS.util, C = NS.C;
  const LAB = NS.LABS.C;
  LAB['Anti-Xa (heparin)'] = LAB['Anti-Xa (heparin)'] || { cat: 'Coagulation', units: 'IU/mL', ref: [0, 0.7], dec: 2, base: 0, refText: '0.30-0.70 on UFH', crit: [null, 1.0] };

  // ---------- shared helpers ----------
  // Weight-based unfractionated heparin (25,000 units in 250 mL = 100 units/mL).
  const hepDose = (ctx, bolusPerKg, bolusMax, ratePerKg, rateMax) => {
    const bolus = Math.min(bolusMax, Math.round(ctx.weightKg * bolusPerKg / 100) * 100);
    const rate = rateMax ? Math.min(rateMax, Math.round(ctx.weightKg * ratePerKg / 10) * 10) : Math.round(ctx.weightKg * ratePerKg / 10) * 10;
    return { bolus, rate, ml: Math.round(rate / 10) / 10 };
  };
  const fmtU = n => n.toLocaleString('en-US');
  // The standing DVT-prophylaxis rule in rules.js adds enoxaparin / SQ heparin to every chart. A patient on therapeutic anticoagulation
  // or a heparin infusion must not also get prophylaxis, so those prophylaxis entries are dropped before they enter the med list.
  const noPpx = spec => {
    const push = spec.meds.push.bind(spec.meds);
    spec.meds.push = (...items) => push(...items.filter(m => !/^(dvt_ppx|heparin_ppx|enoxaparin$)/.test((m && m.key) || '')));
    return spec;
  };
  // Prolonged-stay stage (the generic one in generate.js mentions antibiotics, so each profile writes its own).
  const barrierFor = ctx => {
    const s = ctx.social || {}, fn = s.function || 'Independent', living = s.living || '';
    if (ctx.has('dementia') || /Skilled|Assisted/i.test(living)) return 'return arrangements with the facility and 24-hour supervision';
    if (fn === 'Walker' || fn === 'Wheelchair') return 'a rehab bed / home health authorization for a patient who now needs more help than at baseline';
    if (/alone/i.test(living)) return 'home health services and a caregiver plan for a patient who lives alone';
    return 'a safe discharge plan, medication access (prior authorization for the antiplatelet/anticoagulant) and follow-up appointments';
  };
  const prolonged = (ctx, spec, name, o = {}) => {
    const max = spec.typicalLOS[1];
    if (ctx.L <= max) return;
    const barrier = barrierFor(ctx);
    spec.discharge = Object.assign({}, spec.discharge, { barrier });
    spec.stages.push({
      fromH: max * 24 - 6, id: 'prolonged', label: 'Medically stable; discharge delayed',
      problem: `${name}: clinically stable; discharge delayed by ${barrier}.`,
      subj: o.subj || 'Feels well; no chest pain, palpitations or shortness of breath. Frustrated about the delay and weak from days in bed.',
      assess: `Medically ready for discharge; the remaining stay is driven by ${barrier}, not by the acute illness.`,
      plan: [...(o.plan || []), 'Case management arranging discharge services, medication access and follow-up; family meeting scheduled.', 'Daily PT/OT; out of bed for meals and ambulation in the hall.', 'Watch for hospital-acquired complications: delirium, falls, pressure injury, CAUTI, bleeding on antithrombotics, VTE if mobility is limited.'],
      nursing: [...(o.nursing || []), 'Ambulating with standby assist; eating well; skin intact and turned as needed.', 'Discharge teaching reinforced with teach-back; awaiting disposition.'],
      teach: o.teach || ['Discharge medications, warning signs, and when to call 911.'],
      dispo: `Discharge delayed pending ${barrier}.`
    });
  };
  const premed = (ctx, spec, h, tag) => {
    if (!ctx.allergic('contrast')) return;
    spec.meds.push({ key: 'methylpred_premed_' + tag, name: 'methylprednisolone (SOLU-MEDROL) injection', dose: '40 mg', route: 'IV', freq: 'once', startH: Math.max(0.1, h - 1.3), cls: 'Corticosteroid', info: 'Contrast-allergy premedication (accelerated protocol).', indication: 'Contrast allergy premedication', by: 'cardiology' });
    spec.meds.push({ key: 'diphenhydramine_premed_' + tag, name: 'diphenhydramine (BENADRYL) injection', dose: '50 mg', route: 'IV', freq: 'once', startH: Math.max(0.1, h - 1.0), cls: 'Antihistamine', info: 'Contrast-allergy premedication; causes drowsiness.', indication: 'Contrast allergy premedication', by: 'cardiology' });
    spec.applied.push('Contrast allergy: premedicated before cardiac catheterization.');
  };
  const nitroSL = (o = {}) => ({
    key: 'nitroglycerin_sl', name: 'nitroglycerin (NITROSTAT) sublingual tablet', dose: '0.4 mg', route: 'Sublingual', freq: 'q5min', prn: true, prnInterval: 'Every 5 minutes (max 3 doses)', prnFor: 'chest pain', cls: 'Nitrate vasodilator',
    info: 'Check BP before each dose; sit the patient down (can drop BP and cause headache). If pain is not relieved after the first tablet, notify the provider and obtain a 12-lead ECG. Never give within 24-48 hours of sildenafil/tadalafil or with a right ventricular infarct pattern.',
    monitor: ['BP', 'HR', 'Pain'], hold: 'Hold for SBP below 100 (or more than 30 mmHg below baseline), HR below 50 or above 100, inferior MI with RV involvement, or recent PDE-5 inhibitor.',
    nursing: ['Reassess pain and BP 5 minutes after each tablet; document pain score.', 'Obtain a 12-lead ECG with any new or recurrent chest pain.'], indication: 'Chest pain / angina', startH: o.start ?? 0.3, prnGiven: o.given || [], by: o.by
  });
  const morphine2 = (ctx, o = {}) => Object.assign(C.opioidIV(ctx, o), { dose: '2 mg', prnFor: 'chest pain not relieved by nitroglycerin', hold: 'Hold for RR below 10, SBP below 100, or sedation.', info: 'HIGH-ALERT. Use only for refractory ischemic pain (can blunt P2Y12 absorption and cause hypotension). Assess pain, sedation, BP, RR and SpO2 before and 15-30 minutes after.', indication: 'Refractory ischemic chest pain' });
  const tele = (placeH, removeH, why) => ({ deviceType: 'Tube', type: 'Cardiac telemetry (5-lead)', location: 'Chest', siteMarker: 'chestLeft', placeH, removeH, status: 'In use', assess: `electrodes secure, skin intact; ${why || 'sinus rhythm, no ectopy alarms'}` });
  const ivPair = (hand) => [C.pivSecond(0.5, hand === 'right' ? 'Left antecubital' : 'Left antecubital', '18 gauge'), { deviceType: 'IV', type: 'Peripheral IV', location: 'Left forearm', siteMarker: 'leftForearm', gauge: '20 gauge', placeH: 0.5, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' }];

  // ============================================================================ NSTEMI
  NS.PRIMARY.nstemi = {
    key: 'nstemi', label: 'Acute MI - NSTEMI', group: 'Medical', cat: 'Cardiovascular', typicalLOS: [2, 4],
    desc: 'Substernal chest pressure with ST depression and rising troponin. Day 1: heparin, aspirin, nitroglycerin, early cath with PCI/stent (radial or femoral access checks). Day 2: echo, DAPT, statin, beta blocker. Day 3-4: cardiac rehab teaching, discharge.',
    build(ctx) {
      const radial = ctx.rng() < 0.7, cathH = 10, endH = 11;
      const site = radial ? 'right radial' : 'right femoral';
      const hep = hepDose(ctx, 60, 4000, 12, 1000);
      const clop = ctx.has('afib') || ctx.has('anticoag');            // clopidogrel (not ticagrelor) when combined with an oral anticoagulant
      const spec = noPpx({
        primaryTeam: 'hospitalist', typicalLOS: [2, 4], noAutoProlonged: true, rt: false,
        problem: { name: 'Acute myocardial infarction (NSTEMI)', details: 'Non-ST-elevation myocardial infarction with ST depression and rising troponin; early invasive strategy.' },
        chief: 'Chest pressure with sweating',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with cardiovascular risk factors who woke about 3 hours before arrival with substernal chest pressure (8/10) radiating to the left arm and jaw, with diaphoresis, nausea and mild shortness of breath. Pain was not relieved by rest. No pleuritic component, cough, leg swelling or syncope. In the ED the ECG showed 1-2 mm ST depression in V4-V6 with T-wave inversion; initial troponin I was elevated at 0.12 ng/mL (ref below 0.04). Given aspirin, nitroglycerin and a heparin infusion; cardiology recommends early coronary angiography.`,
        ros: 'Positive for chest pressure, diaphoresis, nausea, and mild dyspnea. Negative for syncope, palpitations, fever, cough, hemoptysis, calf pain, melena and recent bleeding.',
        keyLabs: ['Troponin I', 'Potassium', 'Creatinine', 'Hemoglobin', 'Platelets', 'Glucose', 'LDL cholesterol'],
        hpLabs: ['Troponin I', 'BNP', 'Hemoglobin', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'INR', 'aPTT'],
        isolation: 'None', fluidSensitive: ctx.has('hf') || ctx.renal === 'esrd',
        flags: { npo: [[0.5, endH]], surgeryWindow: [[0, 30]] },
        vitals: [
          { h: 0, temp: 98.4, hr: 96, sbp: 158, dbp: 92, rr: 20, spo2: 96, pain: 8, o2: 'Room air' }, { h: 1.5, temp: 98.4, hr: 90, sbp: 146, dbp: 86, rr: 18, spo2: 97, pain: 4 },
          { h: 4, temp: 98.4, hr: 82, sbp: 134, dbp: 80, rr: 18, spo2: 97, pain: 3 }, { h: 9, temp: 98.4, hr: 76, sbp: 130, dbp: 78, rr: 16, spo2: 97, pain: 2 },
          { h: 12, temp: 98.4, hr: 72, sbp: 126, dbp: 76, rr: 16, spo2: 98, pain: 1 }, { h: 30, temp: 98.4, hr: 68, sbp: 124, dbp: 74, rr: 16, spo2: 98, pain: 0 },
          { h: 56, temp: 98.2, hr: 66, sbp: 122, dbp: 72, rr: 16, spo2: 98, pain: 0 }, { h: 80, temp: 98.2, hr: 64, sbp: 120, dbp: 72, rr: 16, spo2: 98, pain: 0 }
        ],
        labs: {
          'Troponin I': { abs: [[0.5, 0.12], [3.5, 0.46], [6.5, 1.38], [12.5, 3.1], [24.5, 3.8], [36.5, 2.6], [48.5, 1.4], [72.5, 0.5]] }, BNP: { abs: [[0.5, 96]] },
          'Anti-Xa (heparin)': { abs: [[7, 0.46]] },
          WBC: { add: [[0, 1.5], [24, 2.5], [72, 0.6]] }, Glucose: { add: [[0, 18], [24, 8], [48, 4]] },
          Creatinine: { add: [[0, 0], [24, 0.05], [48, 0.15], [72, 0.1], [96, 0]] }, Hemoglobin: { add: [[0, 0], [12, -0.3], [36, -0.6], [96, -0.5]] }, Potassium: { add: [[0, 0], [24, 0.1]] },
          'Hemoglobin A1c': { add: [[0, 0.5]] }, 'LDL cholesterol': { add: [[0, 35]] }, 'Total cholesterol': { add: [[0, 31]] }, 'HDL cholesterol': { add: [[0, -12]] }, Triglycerides: { add: [[0, 70]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Troponin I', 'BNP', 'INR', 'PT', 'aPTT', 'Hemoglobin A1c'] }, { h: 3.5, codes: ['Troponin I'] }, { h: 6.5, codes: ['Troponin I'] }, { h: 7, codes: ['Anti-Xa (heparin)'] },
          { h: 12.5, codes: ['Troponin I'] }, { h: 24.5, codes: ['Troponin I'] }, { h: 36.5, codes: ['Troponin I'] }, { h: 48.5, codes: ['Troponin I'] }, { h: 72.5, codes: ['Troponin I'] },
          { h: 27, codes: ['LDL cholesterol', 'Total cholesterol', 'HDL cholesterol', 'Triglycerides', 'TSH', 'ALT', 'AST'] }
        ],
        events: [
          { type: 'cardiology', h: 0.2, study: '12-lead ECG', label: 'ECG', indication: 'Chest pain', impression: 'Sinus rhythm, rate 96. 1-2 mm horizontal ST depression in V4-V6 with T-wave inversion in V4-V5. No ST elevation. No Q waves. Findings consistent with subendocardial ischemia (NSTEMI pattern).' },
          { type: 'imaging', h: 0.6, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Chest pain', findings: 'Normal heart size. Clear lungs without pulmonary edema, effusion or pneumothorax. Normal mediastinal contour (no widening).', impression: 'No acute cardiopulmonary process.' },
          { type: 'consult', h: 1.6, service: 'Cardiology', author: 'cardiology', reason: 'NSTEMI, rising troponin', label: 'Cardiology consulted',
            recommendation: `NSTEMI, GRACE intermediate-high risk. Aspirin, heparin infusion (anti-Xa guided), high-intensity statin and oral beta blocker; NPO for angiography today. Early invasive strategy: coronary angiography with possible PCI within 24 hours via ${radial ? 'radial' : 'femoral'} access. P2Y12 inhibitor loading in the cath lab once anatomy is known. Telemetry, serial troponin, echocardiogram after cath, lipid panel and A1c.` },
          { type: 'cardiology', h: 3.6, study: '12-lead ECG (repeat)', label: 'Repeat ECG', indication: 'Serial ECG after chest pain relief', impression: 'Sinus rhythm, rate 82. ST depression in V4-V6 persists but improved to 1 mm; T-wave inversion V4-V5. No new ST elevation.' },
          { type: 'transfer', h: 4.5, label: 'Admitted to the cardiac telemetry unit', text: 'Transferred from the ED to the cardiac telemetry unit.' },
          { type: 'procedure', h: cathH, duration: 1, name: `Left heart catheterization with PCI (drug-eluting stent to mid RCA) via ${site} artery`, label: `Cardiac cath with PCI (${site} access)`, service: 'Cardiology', by: 'cardiology', indication: 'NSTEMI: early invasive strategy',
            findings: `Culprit lesion: 95% thrombotic stenosis of the mid right coronary artery treated with one drug-eluting stent (3.0 x 24 mm) with TIMI 3 flow and 0% residual stenosis. LAD 40% mid, circumflex 30% proximal (non-obstructive). LVEDP 18 mmHg. Access: ${site} artery${radial ? ', hemostasis with TR band' : ', hemostasis with closure device'}. 80 mL iodinated contrast. No complications.` },
          { type: 'cardiology', h: 32, study: 'Transthoracic echocardiogram', modality: 'Echo', label: 'Echocardiogram', indication: 'NSTEMI: assess LV function', findings: 'Normal LV size. LVEF 50% with mild hypokinesis of the basal inferior wall. Mild diastolic dysfunction. No significant valvular disease. No LV thrombus. No pericardial effusion.', impression: 'LVEF 50% with basal inferior hypokinesis, consistent with RCA territory infarct.' }
        ],
        meds: [
          { key: 'aspirin_load', name: 'aspirin chewable tablet', dose: '324 mg', route: 'Oral', freq: 'once', startH: 0.3, cls: 'Antiplatelet', info: 'Chewed (not swallowed whole) for rapid absorption. Verify no aspirin allergy or active bleeding.', monitor: ['Hgb', 'Plt'], indication: 'ACS: antiplatelet loading dose', by: 'ed', avoid: ['nsaid', 'aspirin'], nursing: ['Ask about prior aspirin dose today; give as chewed tablets.'] },
          { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'Antiplatelet', info: 'Lifelong therapy. Give with food if GI upset. Monitor for bleeding. Do not exceed 100 mg/day with ticagrelor.', monitor: ['Hgb', 'Plt'], indication: 'NSTEMI / stent: dual antiplatelet therapy', by: 'cardiology', avoid: ['nsaid', 'aspirin'], sips: true },
          { key: 'heparin_bolus', name: 'heparin injection (ACS bolus)', dose: `${fmtU(hep.bolus)} units (60 units/kg, max 4,000)`, route: 'IV', freq: 'once', startH: 1.0, cls: 'Anticoagulant', highAlert: true, info: 'HIGH-ALERT. Independent double check of dose against actual weight. Give IV push before starting the infusion.', monitor: ['Hgb', 'Plt'], indication: 'NSTEMI: anticoagulation', by: 'ed', nursing: ['Verify actual weight (not stated weight); bleeding precautions.'] },
          { key: 'heparin_infusion', name: 'heparin infusion (ACS protocol)', dose: `${fmtU(hep.rate)} units/hr (12 units/kg/hr${hep.rate >= 1000 ? ', max' : ''})`, rate: `${hep.ml} mL/hr`, mlPerHr: hep.ml, concentration: '25,000 units in 250 mL (100 units/mL)', route: 'IV', freq: 'continuous', startH: 1.0, stopH: cathH + 0.8, cls: 'Anticoagulant', highAlert: true,
            info: 'HIGH-ALERT. Titrate by anti-Xa (goal 0.3-0.7 IU/mL) per nomogram; first level 6 hours after the start. Independent double check of rate and bag. Stop at the end of the PCI per cardiology.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding, new neurologic change, or platelets falling more than 50%.',
            nursing: ['Check anti-Xa 6 hours after start and with every rate change; document the rate adjustment.', 'Monitor for bleeding (gums, urine, stool, IV sites), back pain, and platelet count (HIT).'], indication: 'NSTEMI: anticoagulation until PCI', by: 'hospitalist' },
          nitroSL({ given: [0.3, 0.45] }),
          { key: 'ticagrelor_load', name: 'ticagrelor (BRILINTA) tablet', dose: '180 mg', route: 'Oral', freq: 'once', startH: cathH + 0.2, cls: 'P2Y12 inhibitor', info: 'Loading dose given in the cath lab once anatomy is defined. May cause dyspnea; increases bleeding risk.', monitor: ['Hgb', 'Plt'], indication: 'NSTEMI with PCI: P2Y12 loading dose', by: 'cardiology',
            when: !clop, nursing: ['Confirm with cardiology before giving if PCI is not performed.'] },
          { key: 'ticagrelor', name: 'ticagrelor (BRILINTA) tablet', dose: '90 mg', route: 'Oral', freq: 'BID', startH: 14, cls: 'P2Y12 inhibitor', info: 'DAPT for at least 12 months after ACS; NEVER stop without cardiology approval (stent thrombosis). Dyspnea is a common side effect. Pair only with aspirin 100 mg or less. Report black stools or bleeding.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding, planned surgery, or platelets below 50.', indication: 'NSTEMI / stent: dual antiplatelet therapy', by: 'cardiology', sips: true, when: !clop },
          { key: 'clopidogrel_load', name: 'clopidogrel (PLAVIX) tablet', dose: '600 mg', route: 'Oral', freq: 'once', startH: cathH + 0.2, cls: 'P2Y12 inhibitor', info: 'Loading dose in the cath lab. Clopidogrel is preferred over ticagrelor when the patient also takes an oral anticoagulant.', monitor: ['Hgb', 'Plt'], indication: 'NSTEMI with PCI: P2Y12 loading dose', by: 'cardiology', when: clop },
          { key: 'clopidogrel', name: 'clopidogrel (PLAVIX) tablet', dose: '75 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'P2Y12 inhibitor', info: 'DAPT/anticoagulant regimen set by cardiology. NEVER stop without cardiology approval (stent thrombosis). Avoid omeprazole/esomeprazole; pantoprazole is preferred.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding or planned surgery.', indication: 'NSTEMI / stent', by: 'cardiology', sips: true, when: clop },
          { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', startH: 4, cls: 'High-intensity statin', info: 'High-intensity statin started in every ACS patient (LDL goal below 70, ideally below 55 mg/dL). Report unexplained muscle pain or dark urine.', monitor: ['LFT'], indication: 'ACS: secondary prevention', by: 'hospitalist', sips: true },
          { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', startH: 4, cls: 'Beta blocker', sips: true, info: 'Check apical HR and BP before every dose. Do not give within 4 hours of IV nitroglycerin boluses if hypotensive. Avoid in decompensated heart failure, shock, or heart block. Monitor for wheeze in reactive airway disease.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for HR below 55, SBP below 100, new heart block, or active wheezing.', indication: 'ACS: reduce myocardial oxygen demand', by: 'hospitalist' },
          { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '5 mg', route: 'Oral', freq: 'daily', startH: 28, cls: 'ACE inhibitor', info: 'Started after contrast exposure once creatinine is stable. Monitor BP, potassium and creatinine. Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider for SBP below 100, potassium above 5.0, or creatinine rise of 0.3 mg/dL or more.', indication: 'Post-MI remodeling / BP / diabetes or CKD', by: 'cardiology', sips: true, when: ctx.has('htn') || ctx.has('dm2') || ctx.has('hf') || ctx.has('ckd3') },
          { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'Proton pump inhibitor', info: 'GI protection while on dual antiplatelet therapy. Give before breakfast; swallow whole. Preferred PPI with clopidogrel.', indication: 'GI bleeding prophylaxis on DAPT', by: 'hospitalist', sips: true, when: ctx.age >= 65 || clop || ctx.has('gerd') },
          C.nsMaintenance({ start: 8, stop: 20, rate: Math.min(100, Math.max(60, Math.round(ctx.weightKg / 5) * 5)) }),
          morphine2(ctx, { start: 1, given: [] })
        ],
        orders: [
          C.diet('NPO except medications with sips', 0.5, endH, 'NPO for coronary angiography today; medications with sips only. Clarify diabetic medications and insulin with the provider.'),
          C.diet('Heart healthy diet (2 g sodium, low saturated fat)', endH, undefined, 'Advance as tolerated after the procedure; encourage oral fluids to flush contrast.'),
          C.activity('Bed rest with bedside commode; HOB as comfortable', 0.5, endH, 'Strict rest while chest pain is active and until cardiac catheterization; call for any chest pain.'),
          radial
            ? C.activity('Bed rest, HOB 30-45 degrees; keep right wrist straight and elevated (TR band)', endH, endH + 3, 'Do not bend the right wrist; no BP, IV or venipuncture in the right arm. Follow the radial band deflation protocol.')
            : C.activity('Flat bed rest, right leg straight, HOB no higher than 30 degrees', endH, endH + 5, 'Keep right leg straight for 4-6 hours after closure device; log-roll only; call for groin pain, warmth or swelling.'),
          C.activity('Up with assistance; ambulate in hall as tolerated', endH + (radial ? 3 : 5), 30, radial ? 'Avoid lifting more than 5 pounds with the right arm for 48 hours; check wrist before and after walking.' : 'First walk with a nurse: check groin for bleeding or hematoma before and after.'),
          C.activity('Ambulate in hall three times daily (Phase I cardiac rehab)', 30, undefined, 'Progress activity; stop for chest pain, dyspnea or dizziness; HR increase no more than 20-30 bpm above resting.'),
          { name: 'Continuous cardiac monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 0.5, stopH: 72, instructions: 'Notify provider for ST changes, VT/VF, new AFib, heart block, or HR below 50 or above 120.' },
          { name: 'Chest pain protocol', category: 'Nursing', frequency: 'PRN', startH: 0.5, instructions: 'For any chest pain: stop activity, check vitals, 12-lead ECG within 10 minutes, nitroglycerin SL per order and notify provider immediately.' },
          { name: 'Serial troponin I and 12-lead ECG', category: 'Laboratory', frequency: 'Troponin at 0, 3, 6 hours then every 6-12 hours until peak', startH: 0.5, stopH: 74, instructions: 'Repeat ECG with any chest pain and every morning.' },
          { name: 'Anti-Xa (heparin) level', category: 'Laboratory', frequency: '6 hours after heparin start and 6 hours after every rate change', startH: 1, stopH: cathH + 1, instructions: 'Goal 0.3-0.7 IU/mL; titrate heparin per nomogram.' },
          { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 1, instructions: 'On heparin then dual antiplatelet therapy: soft toothbrush, electric razor, no IM injections, hold pressure longer on venipuncture; report black or bloody stool, hematuria, nosebleeds.' },
          { name: 'Coronary angiography with possible PCI (cardiac cath lab)', category: 'Surgery / Procedure', frequency: 'Once', startH: 2, completeH: endH, pending: true, by: 'cardiology', instructions: `Coronary angiography today via ${radial ? 'radial' : 'femoral'} access. Consent signed; NPO; hold metformin; verify creatinine, allergies (iodinated contrast) and baseline pulses.`,
            nursing: ['Confirm signed consent, NPO status, allergy band and creatinine.', radial ? 'Mark and document radial and ulnar pulses and perform the Allen/Barbeau test on the right wrist; no IV or BP on the right arm.' : 'Mark and document femoral and distal pulses (dorsalis pedis and posterior tibial) bilaterally; clip groin per policy.', 'Complete pre-procedure checklist and transport on telemetry.'] },
          { name: radial ? 'Post-cath radial access-site checks: vitals, TR band and right hand perfusion' : 'Post-cath femoral access-site checks: vitals, groin and distal pulses', category: 'Nursing', frequency: 'Every 15 min x 4, every 30 min x 2, every 1 hour x 4, then every 4 hours', startH: endH, stopH: endH + 14,
            instructions: radial ? 'Check TR band, wrist for bleeding or hematoma, radial pulse, hand color, warmth, capillary refill and sensation with each set of vitals. Follow the band deflation protocol.' : 'Check groin for bleeding, hematoma, bruit; check dorsalis pedis and posterior tibial pulses, leg color, warmth and sensation with each set of vitals. Keep leg straight.',
            nursing: radial ? ['For bleeding at the site: apply direct pressure and re-inflate the band; call cardiology.', 'Signs of radial artery occlusion or compartment problem: pale, cool, numb hand or severe pain; notify provider immediately.'] : ['For bleeding or expanding hematoma: hold firm manual pressure above the puncture and call cardiology STAT.', 'New back/flank pain or hypotension suggests retroperitoneal bleed; notify provider immediately.'] },
          { name: 'Basic metabolic panel after contrast', category: 'Laboratory', frequency: 'At 24 and 48 hours after catheterization', startH: endH + 12, stopH: endH + 52, instructions: 'Monitor creatinine for contrast-associated AKI; hold metformin and NSAIDs until creatinine is stable.' },
          { name: 'Lipid panel, TSH and hemoglobin A1c', category: 'Laboratory', frequency: 'Once', startH: 3, completeH: 27, instructions: 'Fasting lipid panel with the morning labs.' },
          { name: 'Cardiac rehabilitation referral and education', category: 'Consult / Therapy', frequency: 'Daily', startH: 28, instructions: 'Phase I inpatient rehab; schedule outpatient phase II within 2 weeks of discharge.' },
          { name: 'Dual antiplatelet therapy and secondary prevention teaching', category: 'Nursing', frequency: 'Daily', startH: 24, instructions: 'Teach-back on DAPT adherence, nitroglycerin use, heart-healthy diet, smoking cessation and when to call 911.' }
        ],
        devices: [
          ...ivPair(radial ? 'left' : 'right'), tele(0.6, 72),
          radial ? { deviceType: 'Tube', type: 'TR band (radial compression device)', location: 'Right wrist, radial artery access', siteMarker: 'rightForearm', placeH: endH, removeH: endH + 3, status: 'Inflated, deflation protocol', assess: 'band in place, no bleeding or hematoma, radial pulse palpable 2+, hand warm and pink, cap refill under 2 seconds, sensation intact' }
          : { deviceType: 'Tube', type: 'Femoral access site (closure device)', location: 'Right groin', siteMarker: 'pelvis', placeH: endH, removeH: 30, status: 'Intact', assess: 'dressing dry and intact, no hematoma, bruit or bleeding; right DP/PT pulses 2+, foot warm and pink, sensation intact' }
        ],
        assessments: [
          { fromH: 0, items: [['Pain', 'Pain Location', 'Substernal chest pressure radiating to the left arm and jaw, 8/10'], ['Cardiac', 'Rhythm', 'Sinus rhythm with ST depression on monitor'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular; S4 present, no murmur or rub'], ['GI', 'Nausea / Vomiting', 'Mild nausea, no vomiting'], ['Skin', 'Skin', 'Pale, cool and diaphoretic'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest for chest pain'], ['Safety', 'Fall Precautions', 'Bleeding precautions on heparin; bed low, call light in reach']] },
          { fromH: 2.5, items: [['Pain', 'Pain Location', 'Substernal pressure, improved to 3/10 after nitroglycerin'], ['Skin', 'Skin', 'Warm, dry'], ['GI', 'Nausea / Vomiting', 'None']] },
          { fromH: 8, items: [['Pain', 'Pain Location', 'Mild intermittent chest tightness, 1-2/10'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm, mild ST depression V4-V6']] },
          { fromH: endH, items: [['Pain', 'Pain Location', 'No chest pain'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm, rare PVCs, ST segments improved'],
            ...(radial ? [['Cardiac', 'Access Site', 'Right radial site: TR band in place, no bleeding or hematoma'], ['Cardiac', 'Distal Pulses', 'Right radial pulse 2+, hand warm, pink; capillary refill under 2 seconds; sensation intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest, right wrist straight and elevated']]
              : [['Cardiac', 'Access Site', 'Right groin: closure device, dressing dry, no hematoma, no bruit'], ['Cardiac', 'Distal Pulses', 'Right DP/PT 2+, leg warm and pink; sensation intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Flat bed rest, right leg straight']])] },
          { fromH: endH + (radial ? 3 : 5), items: [['Cardiac', 'Access Site', radial ? 'Right radial: band removed, small gauze dressing dry, no hematoma' : 'Right groin: dressing dry and intact, no hematoma or bruit'], ['Musculoskeletal / Mobility', 'Mobility', 'Up with assistance; ambulated 50 feet without chest pain']] },
          { fromH: 28, items: [['Cardiac', 'Access Site', radial ? 'Right radial site: 1 cm ecchymosis, no hematoma, radial pulse 2+' : 'Right groin: 3 cm ecchymosis, soft, no hematoma or bruit, pulses 2+'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular, no murmur'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hall independently without chest pain'], ['Safety', 'Fall Precautions', 'Bleeding precautions on aspirin and ticagrelor/clopidogrel']] },
          { fromH: 52, items: [['Cardiac', 'Access Site', radial ? 'Right radial site healing, faint bruise, no tenderness' : 'Right groin healing, faint bruise, no tenderness or hematoma'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent in hall; tolerated Phase I cardiac rehab walk']] }
        ],
        io: [{ fromH: 0, po: 0, urine: 300 }, { fromH: endH, po: 300, urine: 450 }, { fromH: 24, po: 400, urine: 380 }],
        stages: [
          { fromH: 0, id: 'acute', label: 'NSTEMI: heparin, awaiting cath', problem: 'NSTEMI with rising troponin; chest pain improving on nitroglycerin and heparin; early invasive strategy planned today.',
            subj: 'Chest pressure 8/10 on arrival, now 2-3/10 after nitroglycerin; mild nausea. No shortness of breath at rest.',
            assess: 'NSTEMI: ST depression V4-V6, troponin I rising (0.12, 0.46, 1.38 ng/mL); hemodynamically stable; GRACE intermediate-high risk.',
            plan: ['Heparin infusion titrated by anti-Xa (0.3-0.7); aspirin load given, daily 81 mg to follow; P2Y12 inhibitor load in the cath lab.', 'Metoprolol and atorvastatin 80 mg; nitroglycerin SL PRN with BP hold parameters; NPO for angiography.', 'Coronary angiography with possible PCI today (cardiology); check creatinine and allergies; hold metformin.', 'Telemetry, serial troponin and ECG; BNP, lipids, A1c, TSH; echo after cath.'],
            nursing: ['Chest pressure 8/10 on arrival, improved to 2-3/10 after SL nitroglycerin; BP checked before each dose.', 'Continuous telemetry: sinus rhythm with ST depression; no ectopy or arrhythmia.', 'Heparin infusion running with independent double check; anti-Xa at 6 hours; bleeding precautions.', 'NPO for cath; consent, IV access and pre-procedure checklist; pulses marked.'],
            teach: ['Report any chest pain, pressure, shortness of breath or sweating immediately; why heparin and bleeding precautions are needed; plan for the heart catheterization.'],
            dispo: 'Anticipate 2-4 days; discharge after PCI, echo and teaching.', stickies: [{ title: 'NSTEMI: chest pain protocol', body: 'Any chest pain: ECG within 10 min, SBP check, nitroglycerin SL if SBP 100 or higher, call provider. On heparin infusion: anti-Xa 6 h after start/changes. NPO for cath today.' }] },
          { fromH: endH, id: 'postpci', label: 'Post-PCI recovery: access-site checks', problem: `NSTEMI s/p PCI with drug-eluting stent to mid RCA via ${site} artery.`,
            subj: `No chest pain after stent placement. ${radial ? 'Right wrist slightly sore under the band.' : 'Mild right groin soreness; lying flat is uncomfortable.'} Hungry and thirsty.`,
            assess: `Culprit mid-RCA lesion stented (TIMI 3 flow); LVEDP 18; ${radial ? 'radial' : 'femoral'} site without bleeding or hematoma; hemodynamically stable.`,
            plan: [radial ? 'TR band deflation per protocol; discharge from bed rest once band off and site dry.' : 'Bed rest 4-6 hours with leg straight, then ambulate if the groin is soft without hematoma.', 'Heparin stopped after PCI; ticagrelor (or clopidogrel) load given; aspirin 81 mg daily and atorvastatin 80 mg nightly.', 'IV hydration and oral fluids to protect the kidneys; BMP at 24 and 48 hours.', 'Telemetry for arrhythmia and reperfusion events; troponin to peak; echocardiogram tomorrow.'],
            nursing: [`${radial ? 'TR band in place; no bleeding or hematoma; radial pulse 2+, hand pink and warm.' : 'Closure device in place; groin soft, no hematoma or bruit; right DP/PT pulses 2+.'}`, 'Post-cath vitals every 15 min x 4, then 30 min x 2, then hourly x 4 with access-site and distal pulse checks.', 'No chest pain; rhythm sinus with rare PVCs; hydration infusing; urine output adequate.', radial ? 'No BP or IV in the right arm; right wrist kept straight.' : 'Right leg kept straight; HOB 30 degrees or less.'],
            teach: [radial ? 'Keep the wrist straight; report numbness, coolness, swelling or bleeding at the wrist.' : 'Keep the leg straight; hold the groin when coughing; report groin pain, warmth, swelling or leg numbness.'],
            dispo: 'Anticipate discharge in 2-3 days after echo, teaching and stable creatinine.', stickies: [{ title: radial ? 'Right radial access site' : 'Right femoral access site', body: radial ? 'TR band checks per protocol. No BP, IV or lab draws in the right arm. Bleeding: re-inflate band and call cardiology. Cool, pale or numb hand = notify provider.' : 'Leg straight, HOB 30 degrees or less until bed rest ends. Check groin and distal pulses with vitals. Bleeding or hematoma: firm pressure above the site and call STAT.' }] },
          { fromH: 28, id: 'day2', label: 'Day 2: stable post-PCI; echo and DAPT', problem: 'NSTEMI s/p PCI to mid RCA; stable; troponin peaked.',
            subj: 'No chest pain or dyspnea. Walking in the hall. Access site mildly bruised and tender.',
            assess: 'Troponin I peaked at 3.8 ng/mL and is falling; LVEF 50% with basal inferior hypokinesis; creatinine stable after contrast; on DAPT, statin and beta blocker.',
            plan: ['Continue aspirin 81 mg plus ticagrelor/clopidogrel (DAPT 12 months), atorvastatin 80 mg, metoprolol; ACE inhibitor if hypertension, diabetes or CKD.', 'Follow BMP after contrast and platelet count; telemetry until 48-72 hours.', 'Phase I cardiac rehab, cardiac diet and smoking cessation counseling; LDL 140 so statin intensity confirmed.', 'Start discharge teaching; cardiology follow-up in 1-2 weeks.'],
            nursing: ['No chest pain; ambulated in hall without symptoms; HR 60s-70s on metoprolol.', `${radial ? 'Right radial' : 'Right femoral'} site healing: small bruise, no hematoma; distal pulses intact.`, 'Heart healthy diet tolerated; creatinine stable; urine output adequate.', 'Taking aspirin and ticagrelor/clopidogrel; bleeding precautions reviewed.'],
            teach: ['What a stent is; why aspirin and the second antiplatelet must not be stopped; nitroglycerin SL use; symptoms of another heart attack.'],
            dispo: 'Discharge anticipated day 3-4.' },
          { fromH: 50, id: 'ready', label: 'Stable: discharge teaching and cardiac rehab', problem: 'NSTEMI s/p PCI; clinically stable and approaching discharge.',
            subj: 'Feels well; no chest pain, dyspnea or palpitations. Walking independently; eager to go home. Questions about activity, work and diet.',
            assess: 'Troponin down-trending; telemetry free of arrhythmia; creatinine back to baseline; ready for discharge on DAPT, statin, beta blocker.',
            plan: ['Discharge on aspirin 81 mg, ticagrelor 90 mg BID (or clopidogrel 75 mg daily), atorvastatin 80 mg, metoprolol, and SL nitroglycerin PRN.', 'Cardiology follow-up in 1-2 weeks; outpatient cardiac rehab referral; PCP follow-up for lipids and A1c in 6-8 weeks.', 'Check medication affordability and prior authorization for the P2Y12 inhibitor before discharge.', 'Return precautions: chest pain unrelieved by rest or 1 NTG, shortness of breath, syncope, bleeding.'],
            nursing: ['Ambulating independently, no chest pain or dyspnea; vitals stable.', 'Teach-back completed on DAPT adherence, SL nitroglycerin, activity restrictions and site care.', 'Medications reconciled; pharmacy confirmed supply of the antiplatelet.'],
            teach: ['Never stop DAPT without cardiology approval; nitroglycerin use (1 tablet; call 911 if pain persists 5 minutes); no lifting >10 lb for 1 week; cardiac rehab; heart healthy diet; smoking cessation.'],
            dispo: 'Discharge home today or tomorrow.', stickies: [{ title: 'Discharge planning', body: 'DAPT teach-back; SL nitroglycerin teaching; outpatient cardiac rehab referral; confirm P2Y12 inhibitor is affordable and in hand.' }] }
        ],
        discharge: { dispo: () => 'Home with outpatient cardiac rehabilitation', estimate: 'day 3-4 after PCI, echo and teaching' },
        therapy: { fromH: 30, gait: h => (h < 54 ? '150 feet independently without chest pain' : '300 feet independently'), assist: () => 'supervision / standby assist', rec: 'Home; outpatient cardiac rehabilitation' },
        objectives: ['Recognize NSTEMI findings (ST depression, rising troponin) and manage chest pain with nitroglycerin using BP and HR hold parameters.', 'Monitor a heparin infusion (anti-Xa, bleeding) and administer dual antiplatelet therapy safely.', `Perform post-cath ${radial ? 'radial' : 'femoral'} access-site and distal pulse checks and teach DAPT adherence and cardiac rehab.`]
      });
      if (ctx.has('dm2')) spec.stickies.push({ title: 'Contrast and metformin', body: 'Hold metformin on the day of cath and for 48 hours after contrast until creatinine is checked.' });
      premed(ctx, spec, cathH, 'cath');
      prolonged(ctx, spec, 'NSTEMI s/p PCI', { plan: ['Continue DAPT, statin and beta blocker; telemetry discontinued.'], teach: ['DAPT adherence, nitroglycerin use, cardiac rehab and warning signs.'] });
      return spec;
    }
  };

  // ============================================================================ STEMI (primary PCI)
  NS.PRIMARY.stemi = {
    key: 'stemi', label: 'Acute MI - STEMI (primary PCI)', group: 'Medical', cat: 'Cardiovascular', typicalLOS: [3, 5],
    desc: 'Anterior STEMI with emergent primary PCI (door-to-balloon under 90 min). Day 1: CCU, access-site checks, arrhythmia watch. Day 2: echo (reduced EF), ACE inhibitor, beta blocker. Day 3-5: cardiac rehab teaching, DAPT adherence, discharge.',
    build(ctx) {
      const radial = ctx.rng() < 0.75, cathH = 0.7, endH = 1.7, ccuH = 3.0, stepH = 40;
      const site = radial ? 'right radial' : 'right femoral';
      const hep = hepDose(ctx, 60, 4000, 12, 1000);
      const clop = ctx.has('afib') || ctx.has('anticoag');
      const spec = noPpx({
        primaryTeam: 'hospitalist', typicalLOS: [3, 5], noAutoProlonged: true,
        problem: { name: 'Acute myocardial infarction (STEMI)', details: 'Anterior ST-elevation myocardial infarction treated with primary PCI to the proximal LAD.' },
        chief: 'Crushing chest pain with sweating',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with cardiovascular risk factors who developed sudden crushing substernal chest pain (10/10) 90 minutes before arrival, radiating to the left arm and jaw, with profuse diaphoresis, nausea and dyspnea. Pain unrelieved by rest. Arrived by EMS with a pre-hospital ECG showing anterior ST elevation and the cath lab was activated before arrival. ED ECG: 3-5 mm ST elevation V1-V5 with reciprocal ST depression in the inferior leads. Troponin I 0.34 ng/mL (early, still rising). Given aspirin, ticagrelor and heparin, and taken emergently to the cath lab (door-to-balloon time 62 minutes).`,
        ros: 'Positive for crushing chest pain, diaphoresis, nausea, dyspnea and anxiety. Negative for syncope, tearing back pain, fever, cough, hemoptysis, leg swelling and recent bleeding or surgery.',
        keyLabs: ['Troponin I', 'Potassium', 'Magnesium', 'Creatinine', 'Hemoglobin', 'Platelets', 'Glucose', 'LDL cholesterol'],
        hpLabs: ['Troponin I', 'CK-MB', 'BNP', 'Hemoglobin', 'Platelets', 'Sodium', 'Potassium', 'Magnesium', 'Creatinine', 'Glucose', 'INR', 'aPTT'],
        isolation: 'None', fluidSensitive: ctx.has('hf') || ctx.renal === 'esrd',
        flags: { npo: [[0.3, 3.5]], surgeryWindow: [[0, 30]] },
        vitals: [
          { h: 0, temp: 98.2, hr: 98, sbp: 148, dbp: 90, rr: 22, spo2: 95, pain: 10, o2: 'Room air' }, { h: 0.6, temp: 98.2, hr: 94, sbp: 140, dbp: 86, rr: 20, spo2: 96, pain: 8 },
          { h: 1.7, temp: 98.2, hr: 84, sbp: 128, dbp: 78, rr: 18, spo2: 97, pain: 2 }, { h: 6, temp: 98.4, hr: 80, sbp: 122, dbp: 74, rr: 18, spo2: 96, pain: 1 },
          { h: 14, temp: 99.0, hr: 78, sbp: 118, dbp: 72, rr: 18, spo2: 96, pain: 1 }, { h: 30, temp: 99.2, hr: 74, sbp: 116, dbp: 70, rr: 16, spo2: 97, pain: 0 },
          { h: 54, temp: 98.6, hr: 70, sbp: 114, dbp: 70, rr: 16, spo2: 97, pain: 0 }, { h: 90, temp: 98.4, hr: 68, sbp: 116, dbp: 72, rr: 16, spo2: 98, pain: 0 }
        ],
        labs: {
          'Troponin I': { abs: [[0.5, 0.34], [3.5, 4.8], [9.5, 18.2], [15.5, 31.4], [27.5, 38.6], [51.5, 14.5], [75.5, 4.2]] },
          'CK-MB': { abs: [[0.5, 3.2], [9.5, 62], [15.5, 88], [27.5, 45], [51.5, 8]] }, BNP: { abs: [[0.5, 140], [27.5, 520]] },
          WBC: { add: [[0, 2.5], [24, 5], [72, 1.5]] }, Glucose: { add: [[0, 30], [24, 14], [72, 4]] },
          Creatinine: { add: [[0, 0], [24, 0.05], [48, 0.2], [72, 0.1], [100, 0]] }, Hemoglobin: { add: [[0, 0], [12, -0.4], [36, -0.8], [100, -0.6]] },
          Potassium: { add: [[0, -0.2], [24, -0.1], [48, 0.1]] }, Magnesium: { add: [[0, -0.2], [24, -0.1], [48, 0]] },
          'Hemoglobin A1c': { add: [[0, 0.5]] }, 'LDL cholesterol': { add: [[0, 40]] }, 'Total cholesterol': { add: [[0, 36]] }, 'HDL cholesterol': { add: [[0, -12]] }, Triglycerides: { add: [[0, 75]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Troponin I', 'CK-MB', 'BNP', 'INR', 'PT', 'aPTT', 'Hemoglobin A1c', 'Magnesium'] }, { h: 3.5, codes: ['Troponin I', 'Potassium', 'Magnesium'] }, { h: 9.5, codes: ['Troponin I', 'CK-MB', 'Potassium', 'Magnesium'] },
          { h: 15.5, codes: ['Troponin I', 'CK-MB'] }, { h: 27.5, codes: ['Troponin I', 'CK-MB', 'BNP'] }, { h: 51.5, codes: ['Troponin I', 'CK-MB'] }, { h: 75.5, codes: ['Troponin I'] },
          { h: 27, codes: ['LDL cholesterol', 'Total cholesterol', 'HDL cholesterol', 'Triglycerides', 'TSH', 'ALT', 'AST'] }
        ],
        events: [
          { type: 'cardiology', h: 0.1, study: '12-lead ECG (STEMI alert)', label: 'ECG: anterior STEMI', indication: 'Crushing chest pain', impression: 'Sinus tachycardia, rate 98. 3-5 mm ST elevation V1-V5 and I, aVL with reciprocal 1-2 mm ST depression II, III, aVF. Hyperacute T waves anteriorly. Anterior STEMI: cath lab activated.' },
          { type: 'imaging', h: 0.4, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'STEMI, dyspnea', findings: 'Mild cardiomegaly. Clear lungs; no pulmonary edema, effusion or pneumothorax. Normal mediastinal width.', impression: 'No acute cardiopulmonary process; no pulmonary edema.' },
          { type: 'consult', h: 0.2, service: 'Cardiology', author: 'cardiology', reason: 'Anterior STEMI: emergent primary PCI', label: 'Cardiology (interventional) consulted; cath lab activated',
            recommendation: `Activate cath lab; aspirin 324 mg, P2Y12 load, IV heparin bolus. Emergent angiography with primary PCI via ${radial ? 'radial' : 'femoral'} access. Post-PCI: CCU, telemetry for arrhythmias, serial troponin, echocardiogram in 24 hours (EF, LV thrombus), high-intensity statin, low-dose beta blocker and ACE inhibitor if stable, DAPT for 12 months, cardiac rehab.` },
          { type: 'procedure', h: cathH, duration: 1, name: `Emergent coronary angiography with primary PCI (drug-eluting stent to proximal LAD) via ${site} artery`, label: `Primary PCI to proximal LAD (${site} access)`, service: 'Cardiology', by: 'cardiology', indication: 'Anterior STEMI',
            findings: `Culprit: 100% thrombotic occlusion of the proximal left anterior descending artery (TIMI 0 flow). Aspiration thrombectomy and one drug-eluting stent (3.5 x 28 mm) restored TIMI 3 flow with 0% residual stenosis; chest pain improved and ST elevation resolved by more than 50%. Right coronary 30%, circumflex 40% (non-obstructive). LVEDP 24 mmHg; LV gram with anterior-apical hypokinesis, estimated EF 40%. Door-to-balloon 62 minutes. Access: ${site} artery${radial ? ', TR band' : ', closure device'}. 110 mL iodinated contrast. No complications.` },
          { type: 'cardiology', h: 3.2, study: '12-lead ECG (post-PCI)', label: 'Post-PCI ECG', indication: 'Reperfusion assessment', impression: 'Sinus rhythm, rate 84. ST elevation V1-V4 reduced to 1-2 mm (more than 50% resolution). New Q waves V1-V3. Early T-wave inversion. Reperfusion criteria met.' },
          { type: 'transfer', h: ccuH, label: 'Admitted to the Coronary Care Unit (CCU)', text: 'Transferred from the cath lab/ED to the CCU for post-PCI monitoring.' },
          { type: 'cardiology', h: 30, study: 'Transthoracic echocardiogram (with contrast)', modality: 'Echo', label: 'Echocardiogram', indication: 'Post-MI: LV function and LV thrombus', findings: 'Mildly dilated LV. Anterior, anteroseptal and apical hypokinesis with apical akinesis. LVEF 40%. No LV thrombus with contrast opacification. Grade 1 diastolic dysfunction. Mild mitral regurgitation. No pericardial effusion or mechanical complication.', impression: 'LVEF 40% with anterior/apical wall motion abnormality; no LV thrombus.' },
          { type: 'transfer', h: stepH, label: 'Transferred to cardiac step-down unit', text: 'Hemodynamically stable without significant arrhythmia; transferred to the cardiac step-down unit.' }
        ],
        meds: [
          { key: 'aspirin_load', name: 'aspirin chewable tablet', dose: '324 mg', route: 'Oral', freq: 'once', startH: 0.1, cls: 'Antiplatelet', info: 'Chewed for rapid absorption. Verify no aspirin allergy or active bleeding.', monitor: ['Hgb', 'Plt'], indication: 'STEMI: antiplatelet loading dose', by: 'ed', avoid: ['nsaid', 'aspirin'] },
          { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'Antiplatelet', info: 'Lifelong therapy. Do not exceed 100 mg/day with ticagrelor. Monitor for bleeding.', monitor: ['Hgb', 'Plt'], indication: 'STEMI / stent: dual antiplatelet therapy', by: 'cardiology', avoid: ['nsaid', 'aspirin'], sips: true },
          { key: 'ticagrelor_load', name: 'ticagrelor (BRILINTA) tablet', dose: '180 mg', route: 'Oral', freq: 'once', startH: 0.3, cls: 'P2Y12 inhibitor', info: 'Loading dose before PCI. May cause dyspnea; increases bleeding risk.', monitor: ['Hgb', 'Plt'], indication: 'STEMI: P2Y12 loading dose', by: 'ed', when: !clop },
          { key: 'ticagrelor', name: 'ticagrelor (BRILINTA) tablet', dose: '90 mg', route: 'Oral', freq: 'BID', startH: 12, cls: 'P2Y12 inhibitor', info: 'DAPT for at least 12 months; NEVER stop without cardiology approval (stent thrombosis). Dyspnea is a common side effect. Report black stools or bleeding.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding or planned surgery.', indication: 'STEMI / stent: dual antiplatelet therapy', by: 'cardiology', sips: true, when: !clop },
          { key: 'clopidogrel_load', name: 'clopidogrel (PLAVIX) tablet', dose: '600 mg', route: 'Oral', freq: 'once', startH: 0.3, cls: 'P2Y12 inhibitor', info: 'Loading dose before PCI. Preferred with an oral anticoagulant.', monitor: ['Hgb', 'Plt'], indication: 'STEMI: P2Y12 loading dose', by: 'ed', when: clop },
          { key: 'clopidogrel', name: 'clopidogrel (PLAVIX) tablet', dose: '75 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'P2Y12 inhibitor', info: 'NEVER stop without cardiology approval (stent thrombosis). Avoid omeprazole; pantoprazole preferred.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding or planned surgery.', indication: 'STEMI / stent', by: 'cardiology', sips: true, when: clop },
          { key: 'heparin_bolus', name: 'heparin injection (STEMI bolus)', dose: `${fmtU(hep.bolus)} units (60 units/kg, max 4,000)`, route: 'IV', freq: 'once', startH: 0.3, cls: 'Anticoagulant', highAlert: true, info: 'HIGH-ALERT. Independent double check. Additional procedural heparin is given by the cath lab team; no infusion after PCI.', monitor: ['Hgb', 'Plt'], indication: 'STEMI: anticoagulation during primary PCI', by: 'ed' },
          nitroSL({ start: 0.15, given: [0.2] }),
          { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', startH: 3, cls: 'High-intensity statin', info: 'Started in every STEMI patient before discharge (LDL goal below 70, ideally below 55 mg/dL). Report muscle pain or dark urine.', monitor: ['LFT'], indication: 'STEMI: secondary prevention', by: 'hospitalist', sips: true },
          { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '12.5 mg', route: 'Oral', freq: 'BID', startH: 14, cls: 'Beta blocker', sips: true, info: 'Low dose started once hemodynamically stable and no signs of heart failure or shock; titrate toward 25-50 mg BID. Check apical HR and BP before every dose. No IV beta blocker in the first 24 hours.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for HR below 55, SBP below 100, new heart block, wheezing or signs of heart failure.', indication: 'Post-MI: reduce remodeling and arrhythmia risk', by: 'hospitalist' },
          { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '2.5 mg', route: 'Oral', freq: 'daily', startH: 26, cls: 'ACE inhibitor', info: 'Started within 24-48 hours for anterior MI with EF 40%. Monitor BP, potassium and creatinine (contrast exposure). Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider for SBP below 100, potassium above 5.0, or creatinine rise of 0.3 mg/dL or more.', indication: 'Anterior MI / reduced EF', by: 'cardiology', sips: true, renal: { esrd: { avoid: true } } },
          { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', startH: 24, cls: 'Proton pump inhibitor', info: 'GI protection while on dual antiplatelet therapy. Give before breakfast.', indication: 'GI bleeding prophylaxis on DAPT', by: 'hospitalist', sips: true, when: ctx.age >= 65 || clop || ctx.has('gerd') },
          { key: 'kcl_prn', name: 'potassium chloride extended-release tablet', dose: '40 mEq', route: 'Oral', freq: 'daily', prn: true, prnInterval: 'Per replacement protocol', prnFor: 'potassium below 4.0 mEq/L (goal 4.0 or higher)', cls: 'Electrolyte replacement', info: 'Goal K 4.0 or higher after MI to prevent ventricular arrhythmias. Recheck potassium after replacement. Swallow whole with food.', monitor: ['K', 'Cr'], hold: 'Hold for potassium 4.5 or higher or acute kidney injury.', indication: 'Post-MI arrhythmia prevention', startH: 3, prnGiven: [], by: 'hospitalist', renal: { ckd3: { dose: '20 mEq', note: 'Reduced replacement dose for reduced GFR.' }, esrd: { avoid: true } } },
          { key: 'mag_prn', name: 'magnesium sulfate IVPB', dose: '2 g', route: 'IV', freq: 'q6h', prn: true, prnInterval: 'Per replacement protocol', prnFor: 'magnesium below 2.0 mg/dL (goal 2.0 or higher)', cls: 'Electrolyte replacement', info: 'Infuse over 2 hours (not IV push). Monitor BP, deep tendon reflexes and RR; recheck level.', monitor: ['Mg', 'Cr'], hold: 'Hold for magnesium 2.0 or higher, hypotension, or absent reflexes.', indication: 'Post-MI arrhythmia prevention', startH: 3, prnGiven: [], by: 'hospitalist', volume: 100, renal: { ckd3: { dose: '1 g', note: 'Reduced dose for reduced GFR.' }, esrd: { avoid: true } } },
          morphine2(ctx, { start: 0.2, given: [0.3] })
        ],
        orders: [
          C.diet('NPO except medications with sips', 0.3, 3.5, 'NPO for emergent cath; medications with sips.'),
          C.diet('Heart healthy diet (2 g sodium, low saturated fat)', 3.5, undefined, 'Small frequent meals; avoid very hot or very cold liquids early (vagal/arrhythmia); encourage oral fluids after contrast.'),
          C.activity('Bed rest with bedside commode, HOB 30 degrees', 0.3, endH, 'Emergent cath; call for any chest pain.'),
          radial
            ? C.activity('Bed rest, HOB 30-45 degrees; keep right wrist straight (TR band)', endH, 12, 'TR band deflation per protocol; no BP, IV or venipuncture in the right arm; bedrest then bedside commode in the CCU for 12 hours.')
            : C.activity('Flat bed rest, right leg straight, HOB no higher than 30 degrees', endH, 8, 'Closure device; log-roll only; keep leg straight 6 hours; check groin and pulses with vitals.'),
          ...(radial ? [] : [C.activity('Bed rest with bedside commode', 8, 12, 'Right leg straight when in bed; first stand with nurse and check groin before and after.')]),
          C.activity('Out of bed to chair with assistance', 12, 30, 'Progressive mobility after 12 hours of bed rest if no chest pain, arrhythmia or hypotension; check vitals with each change in position.'),
          C.activity('Ambulate in hall with assistance, three times daily (Phase I cardiac rehab)', 30, undefined, 'Advance distance daily; stop for chest pain, dyspnea, dizziness or HR above resting by 20-30 bpm.'),
          { name: 'Continuous cardiac monitoring with ST-segment monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 0.1, stopH: 96, instructions: 'Notify provider immediately for VT, VF, sustained or symptomatic arrhythmia, new AFib, heart block, ST re-elevation, or HR below 50 or above 120. Defibrillator pads and crash cart available in the CCU.' },
          { name: 'Post-MI arrhythmia watch (first 48 hours)', category: 'Nursing', frequency: 'Continuous', startH: endH, stopH: 50, instructions: 'Accelerated idioventricular rhythm and PVCs are common after reperfusion; report runs of 3 or more beats, symptomatic ectopy, bradycardia with hypotension, or new bundle branch block. Keep potassium 4.0 or higher and magnesium 2.0 or higher.',
            nursing: ['Treat symptoms: check BP and mental status with any run of VT; call rapid response for sustained VT or VF.', 'Check K and Mg with the morning labs and replace per protocol.'] },
          { name: 'Chest pain protocol', category: 'Nursing', frequency: 'PRN', startH: 0.1, instructions: 'For any chest pain: 12-lead ECG within 10 minutes, vitals, nitroglycerin SL per order if SBP 100 or higher, notify provider immediately (possible stent thrombosis).' },
          { name: 'Serial troponin I, CK-MB and 12-lead ECG', category: 'Laboratory', frequency: 'Every 6 hours until peak, then daily', startH: 0.5, stopH: 78, instructions: 'Daily ECG and with any chest pain.' },
          { name: 'Emergent coronary angiography with primary PCI (STEMI protocol)', category: 'Surgery / Procedure', frequency: 'Once', startH: 0.1, completeH: endH, pending: true, by: 'cardiology', instructions: `STEMI alert: emergent angiography with primary PCI via ${radial ? 'radial' : 'femoral'} access. Verbal consent in the emergency setting; do not delay PCI for labs.`, nursing: ['Door-to-balloon goal 90 minutes or less.', 'Allergy check (iodinated contrast, latex), weight, IV access x2 and ECG leads to the cath lab team.'] },
          { name: radial ? 'Post-PCI radial access-site checks: vitals, TR band and right hand perfusion' : 'Post-PCI femoral access-site checks: vitals, groin and distal pulses', category: 'Nursing', frequency: 'Every 15 min x 4, every 30 min x 2, every 1 hour x 4, then every 4 hours', startH: endH, stopH: endH + 16,
            instructions: radial ? 'Check TR band, wrist for bleeding or hematoma, radial pulse, hand color, warmth, capillary refill and sensation with each set of vitals; follow band deflation protocol.' : 'Check groin for bleeding, hematoma or bruit; check dorsalis pedis and posterior tibial pulses, color, warmth and sensation with each set of vitals; keep leg straight.',
            nursing: radial ? ['Bleeding: re-inflate the band and call cardiology. Pale, cool or numb hand: notify provider immediately.'] : ['Bleeding or expanding hematoma: firm manual pressure above the puncture and call STAT. Back/flank pain with hypotension: suspect retroperitoneal bleed.'] },
          { name: 'Basic metabolic panel after contrast', category: 'Laboratory', frequency: 'At 24 and 48 hours after PCI', startH: endH + 12, stopH: endH + 52, instructions: 'Monitor creatinine and potassium; avoid NSAIDs and nephrotoxins; hold metformin 48 hours.' },
          { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', startH: ccuH, stopH: 48, instructions: 'SCDs while on bed rest; pharmacologic prophylaxis is held on DAPT after PCI unless ordered.' },
          { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 0.3, instructions: 'On aspirin and a P2Y12 inhibitor: soft toothbrush, electric razor, avoid IM injections; report black stool, hematuria or nosebleed.' },
          { name: 'Lipid panel, TSH and hemoglobin A1c', category: 'Laboratory', frequency: 'Once', startH: 3, completeH: 27, instructions: 'Fasting lipid panel with morning labs.' },
          { name: 'Cardiac rehabilitation referral and education', category: 'Consult / Therapy', frequency: 'Daily', startH: 30, instructions: 'Phase I inpatient rehab; schedule outpatient phase II within 2 weeks of discharge.' },
          { name: 'Dual antiplatelet therapy and heart failure/MI teaching', category: 'Nursing', frequency: 'Daily', startH: 26, instructions: 'Teach-back on DAPT adherence, nitroglycerin, daily weights and symptoms of heart failure, diet, smoking cessation and when to call 911.' }
        ],
        devices: [
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Left antecubital', siteMarker: 'leftAC', gauge: '18 gauge', placeH: 0.1, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' },
          { deviceType: 'IV', type: 'Peripheral IV', location: 'Left forearm', siteMarker: 'leftForearm', gauge: '20 gauge', placeH: 0.1, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' },
          tele(0.1, 96, 'sinus rhythm; rare PVCs'),
          radial ? { deviceType: 'Tube', type: 'TR band (radial compression device)', location: 'Right wrist, radial artery access', siteMarker: 'rightForearm', placeH: endH, removeH: endH + 5, status: 'Deflation protocol', assess: 'band in place, no bleeding or hematoma, radial pulse 2+, hand warm and pink, cap refill under 2 seconds, sensation intact' }
          : { deviceType: 'Tube', type: 'Femoral access site (closure device)', location: 'Right groin', siteMarker: 'pelvis', placeH: endH, removeH: 36, status: 'Intact', assess: 'dressing dry and intact, no hematoma, bruit or bleeding; right DP/PT pulses 2+, foot warm and pink, sensation intact' }
        ],
        assessments: [
          { fromH: 0, items: [['Pain', 'Pain Location', 'Crushing substernal chest pain radiating to left arm and jaw, 10/10'], ['Cardiac', 'Rhythm', 'Sinus tachycardia with ST elevation V1-V5'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular; S4 present, no murmur'], ['Skin', 'Skin', 'Pale, cool, diaphoretic'], ['GI', 'Nausea / Vomiting', 'Nausea'], ['Neurologic', 'Orientation', 'Alert and oriented x4, anxious'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea, unlabored'], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest'], ['Safety', 'Fall Precautions', 'Bleeding precautions (antiplatelets, heparin); bed low, call light in reach']] },
          { fromH: endH, items: [['Pain', 'Pain Location', 'Chest pain 2/10, dull pressure, improving after stent'], ['Cardiac', 'Rhythm', 'Sinus rhythm with transient accelerated idioventricular rhythm and occasional PVCs; ST segments resolving'], ['Skin', 'Skin', 'Warm, dry'], ['GI', 'Nausea / Vomiting', 'None'],
            ...(radial ? [['Cardiac', 'Access Site', 'Right radial: TR band in place, no bleeding or hematoma'], ['Cardiac', 'Distal Pulses', 'Right radial pulse 2+, hand warm, pink; capillary refill under 2 seconds; sensation intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Bed rest, right wrist straight']]
              : [['Cardiac', 'Access Site', 'Right groin: closure device, dressing dry, no hematoma or bruit'], ['Cardiac', 'Distal Pulses', 'Right DP/PT 2+, leg warm and pink; sensation intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Flat bed rest, right leg straight']])] },
          { fromH: 8, items: [['Pain', 'Pain Location', 'Occasional mild chest tightness 1/10'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm, rare PVCs; no sustained arrhythmia'], ['Cardiac', 'Access Site', radial ? 'Right radial: band off, gauze dressing dry, no hematoma' : 'Right groin: dressing dry and intact, no hematoma or bruit'], ['Musculoskeletal / Mobility', 'Mobility', radial ? 'Bed rest with bedside commode (CCU)' : 'Bed rest with bedside commode; right leg kept straight']] },
          { fromH: 14, items: [['Respiratory', 'Respiratory Effort', 'Unlabored, even'], ['Neurologic', 'Orientation', 'Alert and oriented x4, calm'], ['Pain', 'Pain Location', 'None'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm; brief run of NSVT (5 beats) earlier, asymptomatic; potassium and magnesium replaced'], ['Cardiac', 'Capillary Refill', 'Less than 3 seconds']] },
          { fromH: 30, items: [['Cardiac', 'Rhythm', 'Normal sinus rhythm; no ectopy in last 12 hours'], ['Cardiac', 'Access Site', radial ? 'Right radial: 1 cm ecchymosis, no hematoma, pulse 2+' : 'Right groin: 4 cm ecchymosis, soft, no hematoma or bruit, pulses 2+'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular, no S3 or murmur'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally; no crackles'], ['Musculoskeletal / Mobility', 'Mobility', 'Up to chair; walked 50 feet with standby assist']] },
          { fromH: 54, items: [['Cardiac', 'Access Site', radial ? 'Right radial site healing, faint bruise' : 'Right groin healing, faint bruise, no hematoma'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating 300 feet in hall independently; no chest pain or dyspnea'], ['Cardiac', 'Edema', 'None; daily weight stable']] }
        ],
        io: [{ fromH: 0, po: 0, urine: 300 }, { fromH: 3.5, po: 300, urine: 380 }, { fromH: 24, po: 450, urine: 380 }],
        stages: [
          { fromH: 0, id: 'pci', label: 'Anterior STEMI: emergent primary PCI', problem: 'Anterior STEMI with emergent primary PCI to the proximal LAD (door-to-balloon 62 minutes).',
            subj: 'Crushing chest pain 10/10 before PCI; after the stent, pain 2/10 and nausea resolved. Anxious about the heart attack.',
            assess: 'Anterior STEMI (ST elevation V1-V5), culprit proximal LAD, successful PCI with TIMI 3 flow; hemodynamically stable; early troponin 0.34 and rising.',
            plan: ['Aspirin, P2Y12 inhibitor, heparin bolus given; emergent primary PCI with drug-eluting stent.', 'CCU admission with continuous telemetry and ST monitoring; serial troponin and CK-MB to peak.', 'High-intensity statin tonight; low-dose beta blocker and ACE inhibitor once stable; echo tomorrow for EF and LV thrombus.', 'Access-site and distal pulse checks per protocol; keep K 4.0+ and Mg 2.0+.'],
            nursing: ['Crushing chest pain 10/10 on arrival; aspirin and ticagrelor given before the cath lab; door-to-balloon 62 minutes.', 'Post-PCI: pain 2/10, ST elevation resolved by more than 50%; transient accelerated idioventricular rhythm without symptoms.', `${radial ? 'TR band on right wrist, no bleeding or hematoma, radial pulse 2+' : 'Right groin closure device, no bleeding or hematoma, DP/PT pulses 2+'}; vitals and site checks per protocol.`, 'Telemetry alarms set; defibrillator and crash cart checked.'],
            teach: ['Explained the heart attack, the stent and why medicines are given now; report any chest pain, palpitations, dizziness or bleeding.'],
            dispo: 'Anticipate 3-5 days: CCU 24-48 hours then step-down.', stickies: [{ title: 'STEMI: post-PCI CCU', body: 'Chest pain = 12-lead ECG, call provider (stent thrombosis). Telemetry: report VT/VF, sustained runs, heart block. Keep K 4.0+ and Mg 2.0+. Check access site and distal pulses with vitals.' }] },
          { fromH: ccuH, id: 'ccu', label: 'CCU: post-MI arrhythmia watch and access-site care', problem: 'Anterior STEMI s/p primary PCI; CCU monitoring for arrhythmias, bleeding and heart failure.',
            subj: `Little chest discomfort. ${radial ? 'Right wrist band feels snug.' : 'Right groin sore; tired of lying flat.'} Sleepy after a long night; worried about future activity.`,
            assess: 'Reperfused anterior MI; troponin I rising toward peak (4.8, 18.2 ng/mL); no heart failure on exam; rare PVCs and one brief NSVT run treated with electrolytes.',
            plan: [radial ? 'TR band deflation per protocol and removal by 6 hours; avoid BP and IV in right arm.' : 'Flat bed rest 6 hours then bedside commode; log-roll; monitor groin and pulses.', 'Start metoprolol 12.5 mg BID at 12 hours if stable; lisinopril 2.5 mg tomorrow; atorvastatin 80 mg nightly.', 'Replace K to 4.0+ and Mg to 2.0+; continue telemetry; repeat ECG in the morning.', 'Echocardiogram tomorrow; hold NSAIDs; watch creatinine after contrast.'],
            nursing: ['Chest pain 0-1/10; no recurrence; ECG with resolving ST elevation and new Q waves.', 'Telemetry: NSVT 5 beats once, asymptomatic; K and Mg replaced per protocol and recheck ordered.', `${radial ? 'TR band deflated per protocol and removed about 5 hours after PCI; gauze dry, no hematoma' : 'Right groin soft without hematoma or bruit; legs warm with 2+ pulses'}; vitals stable, SpO2 96-97% on room air.`, 'Bleeding precautions; urine output adequate; heart healthy diet tolerated.'],
            teach: ['Rest in the CCU, why electrolytes matter for heart rhythm, bleeding precautions and calling for any chest pain or palpitations.'],
            dispo: 'Step-down tomorrow if no arrhythmia or heart failure.', stickies: [{ title: 'Post-MI arrhythmia watch', body: 'Chest pain = 12-lead ECG and call provider (stent thrombosis). Report VT/VF, runs of 3+ beats, heart block. Keep K 4.0+ and Mg 2.0+. Access-site and distal pulse checks with vitals; bleeding precautions on DAPT.' }] },
          { fromH: 28, id: 'day2', label: 'Day 2: echo shows reduced EF; GDMT started', problem: 'Anterior STEMI s/p PCI with LVEF 40% (anterior/apical hypokinesis); no LV thrombus.',
            subj: 'No chest pain or dyspnea; getting out of bed to the chair. Anxious about what the low heart function means.',
            assess: 'Troponin I peaked near 38 ng/mL and is falling; echo LVEF 40% without LV thrombus; sinus rhythm; creatinine stable after contrast.',
            plan: ['DAPT (aspirin plus ticagrelor/clopidogrel), atorvastatin 80 mg, metoprolol, lisinopril; consider eplerenone if EF stays 40% or lower with diabetes or heart failure.', 'Daily weights, strict I&O, 2 g sodium diet; watch for crackles, edema, orthopnea (Killip class).', 'Repeat echo in about 3 months for ICD decision if EF remains 35% or lower.', 'Transfer to step-down; begin Phase I cardiac rehab and DAPT teaching.'],
            nursing: ['No chest pain; ambulated to chair then 50 feet; HR 70s, BP 110s/70s on metoprolol and lisinopril.', `${radial ? 'Right radial' : 'Right femoral'} site: small bruise, no hematoma, distal pulses intact.`, 'Lungs clear, no edema; weight recorded; urine output adequate.', 'Teaching on heart failure signs and daily weights started.'],
            teach: ['Daily weights (call for gain of 3 lb in a day or 5 lb in a week), 2 g sodium diet, DAPT importance, and nitroglycerin use.'],
            dispo: 'Discharge anticipated day 4-5 after rehab teaching.', stickies: [{ title: 'Post-MI: GDMT and HF watch', body: 'Check BP and HR before metoprolol and lisinopril (hold SBP below 100 / HR below 55). Daily weight, I&O, lung sounds. DAPT: do not interrupt without cardiology.' }] },
          { fromH: 70, id: 'ready', label: 'Stable: discharge teaching and cardiac rehab', problem: 'Anterior STEMI s/p PCI, LVEF 40%; clinically stable and approaching discharge.',
            subj: 'Walking the hall without chest pain or shortness of breath. Feels ready to go home; wants to know when driving, work and return to activity.',
            assess: 'Telemetry free of significant arrhythmia for more than 48 hours; hemodynamically stable on GDMT; creatinine at baseline; ready for discharge.',
            plan: ['Discharge on aspirin 81 mg, P2Y12 inhibitor, atorvastatin 80 mg, metoprolol, lisinopril, and SL nitroglycerin PRN.', 'Cardiology in 1-2 weeks; outpatient cardiac rehab; echo in about 3 months; PCP for lipids and A1c.', 'Confirm affordability and supply of the P2Y12 inhibitor; no driving for 1 week; no lifting more than 10 pounds for 1 week.', 'Return precautions: chest pain, dyspnea, syncope, palpitations, weight gain, bleeding.'],
            nursing: ['Ambulating independently without symptoms; vitals stable; weights stable.', 'Teach-back completed on DAPT, nitroglycerin, daily weights, site care and heart healthy diet.', 'Medications reconciled; follow-up appointments and rehab referral made.'],
            teach: ['Never stop DAPT without cardiology approval; nitroglycerin (1 tablet, call 911 if pain persists 5 minutes); daily weights; sodium limit; cardiac rehab; smoking cessation.'],
            dispo: 'Discharge home today or tomorrow.', stickies: [{ title: 'Discharge planning', body: 'DAPT teach-back; nitroglycerin and heart failure teaching; cardiac rehab referral; P2Y12 inhibitor in hand before leaving.' }] }
        ],
        discharge: { dispo: () => 'Home with outpatient cardiac rehabilitation', estimate: 'day 4-5 after echo, GDMT and teaching' },
        therapy: { fromH: 32, gait: h => (h < 56 ? '150 feet with standby assist' : '300 feet independently'), assist: () => 'supervision / standby assist', rec: 'Home; outpatient cardiac rehabilitation' },
        objectives: ['Support emergent primary PCI (door-to-balloon) and recognize STEMI ECG changes and reperfusion.', 'Monitor a post-MI patient on telemetry for arrhythmias and maintain K 4.0+ and Mg 2.0+.', `Perform post-PCI ${radial ? 'radial' : 'femoral'} access-site and distal pulse checks; teach DAPT adherence, heart failure self-care and cardiac rehab.`]
      });
      if (ctx.has('dm2')) spec.stickies.push({ title: 'Contrast and metformin', body: 'Hold metformin for 48 hours after contrast until creatinine is checked.' });
      premed(ctx, spec, cathH, 'stemi');
      prolonged(ctx, spec, 'STEMI s/p PCI', { plan: ['Continue DAPT, GDMT and cardiac rehab teaching; telemetry discontinued.'], teach: ['DAPT adherence, heart failure self-care, nitroglycerin use.'] });
      return spec;
    }
  };
})();

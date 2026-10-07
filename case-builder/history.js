/* Medical-history modules. Each one adds the typical chronic medications, orders, baseline labs, flowsheet findings
   and devices for that diagnosis. They are educational defaults, not rules about every real patient. */
NS.HX = (() => {
  const U = NS.util;

  // helpers --------------------------------------------------------------------
  const home = (spec, m) => spec.meds.push(Object.assign({ home: true, startH: 3, by: 'hospitalist' }, m));
  const order = (spec, o) => spec.orders.push(Object.assign({ startH: 3, by: 'hospitalist' }, o));
  const comorb = (spec, c) => spec.comorb.push(c);
  const assess = (spec, items) => spec.assessments.unshift({ fromH: 0, items });
  const addLabs = (spec, h, codes) => spec.labSchedule.push({ h, codes });
  const sticky = (spec, title, body) => spec.stickies.push({ title, body });
  const heldNote = (spec, text) => { spec.heldHome = spec.heldHome || []; spec.heldHome.push(text); };

  const M = {};

  M.htn = {
    label: 'Hypertension', desc: 'Raises baseline BP; adds an ACE inhibitor (amlodipine if ESRD).',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ sbp: 12, dbp: 6 });
      home(spec, {
        key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'ACE inhibitor',
        info: 'Check BP before giving. Monitor potassium and creatinine. Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'],
        hold: 'Hold and notify provider if SBP is below 100.', holdIf: ['npo', 'hypotension', 'permHTN'], holdReason: 'NPO, low blood pressure or permissive hypertension',
        renal: { esrd: { avoid: true, sub: { key: 'amlodipine', name: 'amlodipine (NORVASC) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Calcium channel blocker', info: 'Check BP before giving. Monitor for peripheral edema.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if SBP is below 100.' } } },
        indication: 'Hypertension (home medication)'
      });
      comorb(spec, {
        key: 'htn', problem: 'Hypertension', details: 'Chronic hypertension on home antihypertensive therapy.', pmh: 'Hypertension',
        plan: (c, S, h) => S.flag('hypotension', h) ? ['Home antihypertensive held for low blood pressure; resume when SBP consistently above 110.'] : S.flag('npo', h) ? ['Hold lisinopril while NPO; BP parameters ordered; resume with diet.'] : ['Continue home antihypertensive; BP goal below 140/90.']
      });
    }
  };

  M.dm2 = {
    label: 'Type 2 Diabetes Mellitus', desc: 'Adds hyperglycemia, ACHS glucose checks, basal + correction insulin, consistent-carbohydrate diet.',
    apply(ctx, spec) {
      spec.labBase.Glucose = 172;
      spec.labBase['Hemoglobin A1c'] = 8.0;
      addLabs(spec, 0.5, ['Hemoglobin A1c']);
      home(spec, {
        key: 'insulin_glargine', name: 'insulin glargine (LANTUS) injection', dose: '20 units', route: 'Subcutaneous', freq: 'qHS', cls: 'Long-acting insulin',
        info: 'Basal insulin. Give even when NPO (dose reduced). Check glucose first; hold and call provider if glucose is below 100 mg/dL.', monitor: ['Glucose'],
        hold: 'Notify provider before giving if glucose is below 100 mg/dL.', variants: { npo: { dose: '16 units' } }, indication: 'Type 2 diabetes (home basal insulin, reduced 20% while NPO)'
      });
      home(spec, {
        key: 'insulin_lispro', name: 'insulin lispro (HUMALOG) correction scale', dose: 'Low-dose correction scale', route: 'Subcutaneous', freq: 'ACHS', cls: 'Rapid-acting insulin',
        info: 'Give per correction scale only with a meal (or q6h if NPO). Check glucose first and document it. Watch for hypoglycemia.', monitor: ['Glucose'],
        variants: { npo: { freq: 'q6h' } }, indication: 'Hyperglycemia correction'
      });
      order(spec, { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'ACHS (every 6 hours if NPO)', instructions: 'Check before meals and at bedtime; every 6 hours while NPO. Treat per hypoglycemia protocol.', startH: 3 });
      order(spec, { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', instructions: 'Follow facility hypoglycemia protocol: 15 g fast carbohydrate if awake, recheck in 15 minutes; dextrose 50% IV if NPO or unable to swallow.', startH: 3 });
      heldNote(spec, 'Metformin held while hospitalized (contrast, acute illness, renal risk).');
      comorb(spec, {
        key: 'dm2', problem: 'Type 2 diabetes mellitus', details: 'Chronic diabetes on basal insulin and oral therapy at home.', pmh: 'Type 2 diabetes mellitus (A1c 8.0%)',
        plan: (c, S, h) => [`Basal glargine${S.flag('npo', h) ? ' (reduced 20% while NPO)' : ''} with ${S.flag('npo', h) ? 'q6h' : 'ACHS'} correction lispro; goal glucose 140-180 mg/dL.`, 'Metformin held while inpatient.', 'Hypoglycemia protocol in place.']
      });
      assess(spec, [['Safety', 'Diabetes Care', 'Glucose checks per order; feet intact, no wounds']]);
    }
  };

  M.ckd3 = {
    label: 'CKD Stage 3', desc: 'Adds baseline creatinine ~1.8, renal diet, renal dosing, nephrotoxin avoidance.',
    apply(ctx, spec) {
      spec.labBase.Creatinine = ctx.female ? 1.5 : 1.8;
      spec.labBase.BUN = 28; spec.labBase.Potassium = 4.6; spec.labBase.Phosphorus = 4.0; spec.labBase.Hemoglobin = ctx.female ? 11.6 : 12.4; spec.labBase.CO2 = 22;
      spec.vitalAdjust.push({ sbp: 6, dbp: 2 });
      order(spec, { name: 'Renal dosing review / avoid nephrotoxins', category: 'Nursing', frequency: 'Continuous', instructions: 'Pharmacy to renally dose medications. Avoid NSAIDs, IV contrast when possible, and other nephrotoxic agents.', startH: 3, nursing: ['Question any NSAID or contrast order and notify the provider.'] });
      comorb(spec, {
        key: 'ckd3', problem: 'Chronic kidney disease stage 3', details: 'Baseline creatinine about 1.8 mg/dL, eGFR about 40.', pmh: 'Chronic kidney disease stage 3',
        plan: () => ['Baseline Cr about 1.8; renally dose all medications and avoid nephrotoxins.', 'Monitor BMP daily; strict I&O.']
      });
    }
  };

  M.esrd = {
    label: 'ESRD on Hemodialysis', desc: 'Adds hemodialysis (Mon/Wed/Fri), AV fistula, fluid/renal diet, phosphate binder, renal dosing.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Creatinine: 5.8, BUN: 46, Potassium: 5.0, Phosphorus: 5.4, Calcium: 8.4, CO2: 21, Hemoglobin: ctx.female ? 10.0 : 10.6, Sodium: 137 });
      spec.vitalAdjust.push({ sbp: 14, dbp: 6 });
      spec.ioMult.urine = 0.12;
      spec.fluidRestrict = '1,000 mL/day';
      addLabs(spec, 0.5, ['Phosphorus', 'Magnesium']);
      home(spec, { key: 'sevelamer', name: 'sevelamer carbonate (RENVELA) tablet', dose: '800 mg', route: 'Oral', freq: 'TID', at: ['0800', '1200', '1700'], cls: 'Phosphate binder', info: 'Give WITH meals. Hold if patient is NPO or not eating.', holdIf: ['npo'], holdReason: 'NPO (give only with meals)', indication: 'ESRD hyperphosphatemia' });
      home(spec, { key: 'renal_vitamin', name: 'B-complex with vitamin C and folic acid (NEPHRO-VITE) tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Renal multivitamin', info: 'Give after dialysis on dialysis days.', holdIf: ['npo'], indication: 'ESRD vitamin replacement' });
      order(spec, { name: 'Fluid restriction 1,000 mL/day', category: 'Diet', frequency: 'Daily', instructions: 'Limit total oral fluids to 1,000 mL per 24 hours (including IV fluids and medications).', startH: 3, nursing: ['Track all oral and IV intake carefully.'] });
      order(spec, { name: 'No BP, blood draws or IV access in left arm (AV fistula)', category: 'Precautions', frequency: 'Continuous', instructions: 'Protect the fistula arm. Check thrill and bruit every shift.', startH: 3 });
      order(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning, before breakfast.', startH: 3 });
      order(spec, { name: 'Renal dosing review / avoid nephrotoxins', category: 'Nursing', frequency: 'Continuous', instructions: 'Pharmacy to dose all medications for ESRD. Avoid NSAIDs, morphine, and enoxaparin.', startH: 3 });
      spec.devices.push({ deviceType: 'Tube', type: 'AV fistula', location: 'Left upper arm', siteMarker: 'leftUpperArm', placeH: -24 * 400, preexisting: true, status: 'Patent', assess: 'thrill palpable, bruit audible, no redness or swelling' });
      assess(spec, [['Cardiac', 'Edema', 'Trace pedal edema (dry weight managed with dialysis)'], ['GU', 'Urinary Elimination', 'Minimal urine output (oliguric ESRD)'], ['Skin', 'Skin', 'Warm, dry; left upper arm AV fistula with thrill and bruit'], ['Safety', 'Precautions', 'No BP / venipuncture / IV in left arm']]);
      // Hemodialysis Mon / Wed / Fri at 0800 for 3.5 hours
      const admitMs = U.parse(ctx.admit);
      for (let d = 0; d <= Math.ceil(ctx.windowEnd / 24) + 1; d++) {
        const date = new Date(U.parse(U.dateOnly(ctx.admit) + ' 00:00') + d * 86400000);
        const dow = date.getUTCDay();
        const h = (date.getTime() + 8 * 3600000 - admitMs) / 3600000;
        if ([1, 3, 5].includes(dow) && h > 5 && h <= ctx.windowEnd + 1) {
          spec.events.push({ type: 'procedure', h, duration: 3.5, name: 'Hemodialysis (3.5 h)', label: 'Hemodialysis', dialysis: true, ufRemoved: 2000 + Math.round(ctx.noise(300)), by: 'nephrology', service: 'Nephrology' });
        }
      }
      comorb(spec, {
        key: 'esrd', problem: 'End-stage renal disease on hemodialysis', details: 'Dialysis Mon/Wed/Fri via left upper arm AV fistula; oliguric.', pmh: 'End-stage renal disease on hemodialysis (Mon/Wed/Fri, left arm AV fistula)',
        plan: () => ['Hemodialysis per nephrology (Mon/Wed/Fri); no further volume removal today unless symptomatic.', 'Renal diet, 1 L fluid restriction, sevelamer with meals when eating.', 'Renally dose all medications; avoid NSAIDs, morphine, enoxaparin.', 'Protect left arm fistula.']
      });
    }
  };

  M.cad = {
    label: 'Coronary Artery Disease', desc: 'Adds aspirin, statin and beta blocker; cardiac monitoring precautions.',
    apply(ctx, spec) {
      home(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Coronary artery disease' });
      home(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Coronary artery disease / hyperlipidemia' });
      home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Coronary artery disease' });
      comorb(spec, { key: 'cad', problem: 'Coronary artery disease', details: 'Known atherosclerotic coronary disease on aspirin, statin and beta blocker.', pmh: 'Coronary artery disease', plan: () => ['Continue aspirin, statin and beta blocker; telemetry not required unless chest pain; call for chest pain or ECG changes.'] });
    }
  };

  M.hf = {
    label: 'Heart Failure (chronic)', desc: 'Adds home diuretic, beta blocker, 2 g sodium diet, daily weights, volume caution with IV fluids.',
    apply(ctx, spec) {
      spec.fluidSensitive = true;
      spec.labBase.BNP = 320;
      spec.vitalAdjust.push({ hr: 3 });
      home(spec, { key: 'carvedilol', name: 'carvedilol (COREG) tablet', dose: '6.25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Give with food. Check BP and HR before giving.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension', 'permHTN'], holdReason: 'low blood pressure or permissive hypertension', indication: 'Heart failure with reduced EF' });
      if (spec.primaryKey !== 'chf') home(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / receiving IV fluids', renal: { esrd: { avoid: true } }, indication: 'Heart failure (home diuretic)' });
      order(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain of more than 2 lb in a day or 5 lb in a week.', startH: 3 });
      comorb(spec, { key: 'hf', problem: 'Heart failure with reduced ejection fraction', details: 'Chronic HFrEF (EF about 35%) on beta blocker and loop diuretic.', pmh: 'Heart failure with reduced ejection fraction (EF about 35%)', plan: (c, S, h) => ['Euvolemic to mildly dry on exam; continue beta blocker; judicious IV fluids with daily weights.', S.flag('npo', h) ? 'Home furosemide held while NPO/receiving IV fluids.' : 'Continue home diuretic.'] });
      assess(spec, [['Cardiac', 'Edema', 'Trace bilateral lower extremity edema']]);
    }
  };

  M.afib = {
    label: 'Atrial Fibrillation', desc: 'Adds irregular rhythm, rate control, and an anticoagulant that is held around surgery.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ hr: 10 });
      const reduce = [ctx.age >= 80, ctx.weightKg <= 60, (spec.labBase.Creatinine || 1) >= 1.5].filter(Boolean).length >= 2;
      if (!['cad'].some(k => ctx.has(k)) && !ctx.has('hf')) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Atrial fibrillation rate control' });
      home(spec, { key: 'apixaban', name: 'apixaban (ELIQUIS) tablet', dose: reduce ? '2.5 mg' : '5 mg', route: 'Oral', freq: 'BID', cls: 'Anticoagulant (factor Xa inhibitor)', info: 'Monitor for bleeding. HIGH-ALERT: do not give if the patient is scheduled for or just had surgery until the surgeon clears it.', monitor: ['Hgb', 'Plt', 'Cr'], holdIf: ['surgeryWindow'], holdReason: 'bleeding-risk window (surgery, acute stroke or possible procedure)', indication: 'Atrial fibrillation stroke prevention', highAlert: true });
      comorb(spec, { key: 'afib', problem: 'Atrial fibrillation', details: 'Chronic atrial fibrillation on rate control and anticoagulation.', pmh: 'Atrial fibrillation (CHA2DS2-VASc elevated, on apixaban)', plan: (c, S, h) => ['Rate controlled on metoprolol/carvedilol.', S.flag('surgeryWindow', h) ? 'Apixaban held peri-operatively; resume per surgery (typically 24-48 h post-op) with DVT prophylaxis meanwhile.' : 'Continue apixaban; monitor for bleeding.'] });
      assess(spec, [['Cardiac', 'Rhythm', 'Atrial fibrillation, rate controlled, irregularly irregular'], ['Cardiac', 'Heart Sounds', 'S1 S2 irregularly irregular, no murmur']]);
    }
  };

  M.copd = {
    label: 'COPD', desc: 'Adds scheduled DuoNebs, maintenance inhaler, PRN albuterol, oxygen target 88–92%, lower baseline SpO2.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ spo2: -4, rr: 2 });
      spec.baseO2 = '2 L nasal cannula';
      spec.rt = true;
      home(spec, { key: 'duoneb', name: 'ipratropium-albuterol (DUONEB) nebulizer solution', dose: '3 mL', route: 'Nebulized', freq: 'q6h', cls: 'Anticholinergic / beta-agonist bronchodilator', info: 'Given by RT. Assess breath sounds, HR and work of breathing before and after.', monitor: ['HR', 'RR', 'SPO2'], indication: 'COPD (replaces home tiotropium while inpatient)', by: 'hospitalist' });
      home(spec, { key: 'albuterol_prn', name: 'albuterol (PROVENTIL) nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'q4h', prn: true, prnInterval: 'Every 2 hours', prnFor: 'wheezing or shortness of breath', cls: 'Short-acting bronchodilator', info: 'Check HR before and after; may cause tremor and tachycardia.', monitor: ['HR', 'SPO2'], indication: 'COPD rescue' });
      home(spec, { key: 'advair', name: 'fluticasone-salmeterol (ADVAIR DISKUS) inhaler', dose: '250/50 mcg, 1 inhalation', route: 'Inhaled', freq: 'BID', cls: 'Inhaled corticosteroid / LABA', info: 'Rinse mouth after use. Check inhaler technique.', indication: 'COPD maintenance (home)' });
      order(spec, { name: 'Supplemental oxygen via nasal cannula', category: 'Respiratory', frequency: 'Continuous, titrate', instructions: 'Start 1-2 L/min; titrate to SpO2 88-92%. Do not exceed target (CO2 retention risk).', startH: 0.3, by: 'ed', nursing: ['Goal SpO2 is 88-92%, NOT higher; notify provider for drowsiness or SpO2 below 88%.'] });
      order(spec, { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', instructions: 'RT to assess, administer nebulizers, and review inhaler technique.', startH: 3 });
      heldNote(spec, 'Home tiotropium replaced by scheduled DuoNebs (avoid duplicate anticholinergic).');
      assess(spec, [['Respiratory', 'Breath Sounds', 'Diminished bilaterally with scattered end-expiratory wheeze'], ['Respiratory', 'Respiratory Effort', 'Mildly prolonged expiratory phase']]);
      comorb(spec, { key: 'copd', problem: 'Chronic obstructive pulmonary disease', details: 'Chronic obstructive lung disease; baseline SpO2 about 90-92%.', pmh: 'COPD', plan: (c, S, h) => ['Scheduled DuoNebs q6h with PRN albuterol; maintenance inhaler continued.', 'Oxygen goal SpO2 88-92%; avoid over-oxygenation.', c.social.tobacco && /Current/i.test(c.social.tobacco) ? 'Tobacco cessation counseling and nicotine replacement.' : 'Incentive spirometry / deep breathing; RT following.'] });
    }
  };

  M.asthma = {
    label: 'Asthma', desc: 'Adds PRN albuterol nebulizer and maintenance inhaled steroid.',
    apply(ctx, spec) {
      spec.rt = true;
      home(spec, { key: 'albuterol_prn', name: 'albuterol (PROVENTIL) nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'wheezing or shortness of breath', cls: 'Short-acting bronchodilator', info: 'Check HR before and after.', monitor: ['HR', 'SPO2'], indication: 'Asthma rescue' });
      home(spec, { key: 'fluticasone', name: 'fluticasone (FLOVENT HFA) inhaler', dose: '110 mcg, 2 puffs', route: 'Inhaled', freq: 'BID', cls: 'Inhaled corticosteroid', info: 'Rinse mouth after use.', indication: 'Asthma maintenance (home)' });
      comorb(spec, { key: 'asthma', problem: 'Asthma', details: 'Chronic asthma, well controlled on inhaled steroid.', pmh: 'Asthma', plan: () => ['Continue inhaled steroid; albuterol PRN.'] });
    }
  };

  M.hld = {
    label: 'Hyperlipidemia', desc: 'Adds a statin.',
    apply(ctx, spec) {
      home(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Hyperlipidemia' });
      comorb(spec, { key: 'hld', problem: 'Hyperlipidemia', details: 'Chronic dyslipidemia on statin.', pmh: 'Hyperlipidemia', plan: () => ['Continue statin.'] });
    }
  };

  M.obesity = {
    label: 'Obesity', desc: 'Raises weight/BMI, adds skin, mobility and equipment considerations, higher-dose DVT prophylaxis.',
    apply(ctx, spec) {
      if (ctx.bmi < 32 && !ctx.input.weightKg) { ctx.weightKg = U.round(34 * Math.pow(ctx.heightCm / 100, 2), 0); ctx.bmi = 34; }
      else if (ctx.bmi < 30) spec.warnings.push({ level: 'warning', text: `Obesity is selected but BMI is ${ctx.bmi}. Adjust the weight or remove obesity.` });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 0;
      order(spec, { name: 'Skin assessment with attention to skin folds', category: 'Nursing', frequency: 'Every shift', instructions: 'Inspect skin folds, sacrum, and heels for moisture and pressure injury.', startH: 3 });
      order(spec, { name: 'Bariatric / appropriate-size equipment and lift assist', category: 'Activity', frequency: 'As needed', instructions: 'Use appropriately rated bed, chair and lift equipment; at least 2 staff for mobilization.', startH: 3 });
      comorb(spec, { key: 'obesity', problem: 'Obesity', details: `BMI ${ctx.bmi}; affects mobility, skin integrity, and dosing.`, pmh: `Obesity (BMI ${ctx.bmi})`, plan: () => ['Weight-appropriate DVT prophylaxis dosing; early mobilization; skin checks every shift.'] });
      assess(spec, [['Skin', 'Skin', 'Warm, dry; skin folds intact, no breakdown']]);
    }
  };

  M.dementia = {
    label: 'Dementia', desc: 'Adds baseline disorientation, delirium/fall precautions, donepezil, discharge-planning complexity.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.dementia = true;
      home(spec, { key: 'donepezil', name: 'donepezil (ARICEPT) tablet', dose: '10 mg', route: 'Oral', freq: 'qHS', cls: 'Cholinesterase inhibitor', info: 'May cause bradycardia, nausea, vivid dreams. Check HR before giving.', monitor: ['HR'], holdIf: ['npo'], indication: 'Dementia' });
      order(spec, { name: 'Delirium precautions and frequent reorientation', category: 'Precautions', frequency: 'Continuous', instructions: 'Lights on by day, off at night; glasses/hearing aids; reorient often; avoid restraints; limit sedatives and anticholinergics.', startH: 3 });
      order(spec, { name: 'Fall precautions (bed alarm on)', category: 'Precautions', frequency: 'Continuous', instructions: 'Bed alarm on, low bed, frequent rounding, toileting schedule.', startH: 3 });
      assess(spec, [['Neurologic', 'Orientation', 'Oriented to person only (baseline per family)'], ['Neurologic', 'Level of Consciousness', 'Alert, pleasantly confused'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, bed low, hourly rounding']]);
      sticky(spec, 'Baseline cognition', 'Baseline dementia: oriented to person only. Any NEW agitation, drowsiness or acute change should be reported (possible delirium).');
      comorb(spec, { key: 'dementia', problem: 'Dementia', details: 'Chronic cognitive impairment; oriented to person at baseline.', pmh: 'Dementia', plan: () => ['Delirium precautions; avoid benzodiazepines/anticholinergics; family at bedside if possible.', 'Capacity limited; involve surrogate decision maker.'] });
    }
  };

  M.anemia = {
    label: 'Chronic Anemia', desc: 'Lowers baseline hemoglobin, adds iron, fatigue/activity-tolerance considerations.',
    apply(ctx, spec) {
      spec.labBase.Hemoglobin = ctx.female ? 10.0 : 10.6; spec.labBase.Hematocrit = ctx.female ? 31 : 32;
      spec.vitalAdjust.push({ hr: 3 });
      home(spec, { key: 'ferrous_sulfate', name: 'ferrous sulfate tablet', dose: '325 mg', route: 'Oral', freq: 'daily', cls: 'Iron supplement', info: 'May cause dark stools and constipation.', holdIf: ['npo'], indication: 'Chronic anemia' });
      assess(spec, [['Skin', 'Skin', 'Pale, warm, dry']]);
      comorb(spec, { key: 'anemia', problem: 'Chronic anemia', details: 'Baseline hemoglobin about 10 g/dL.', pmh: 'Chronic anemia', plan: () => ['Baseline Hgb about 10; transfuse only for Hgb below 7 (or symptomatic); trend CBC.'] });
    }
  };

  M.gerd = {
    label: 'GERD', desc: 'Adds a proton pump inhibitor (IV while NPO).',
    apply(ctx, spec) {
      home(spec, { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before breakfast.', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: 'GERD' });
      comorb(spec, { key: 'gerd', problem: 'Gastroesophageal reflux disease', details: 'Chronic GERD on a proton pump inhibitor.', pmh: 'GERD', plan: () => ['Continue pantoprazole (IV while NPO).'] });
    }
  };

  M.hypothyroid = {
    label: 'Hypothyroidism', desc: 'Adds levothyroxine and a TSH.',
    apply(ctx, spec) {
      addLabs(spec, 0.5, ['TSH']);
      home(spec, { key: 'levothyroxine', name: 'levothyroxine (SYNTHROID) tablet', dose: '75 mcg', route: 'Oral', freq: 'daily', at: ['0600'], cls: 'Thyroid hormone', info: 'Give on an empty stomach, 30-60 minutes before breakfast, separate from calcium/iron.', holdIf: ['npo'], holdReason: 'NPO (long half-life; may hold a few days)', indication: 'Hypothyroidism' });
      comorb(spec, { key: 'hypothyroid', problem: 'Hypothyroidism', details: 'Chronic hypothyroidism on levothyroxine.', pmh: 'Hypothyroidism', plan: () => ['Continue levothyroxine when taking PO (may hold a few days if NPO); TSH on admission.'] });
    }
  };

  M.depression = {
    label: 'Depression / Anxiety', desc: 'Adds an SSRI and mood/safety screening.',
    apply(ctx, spec) {
      home(spec, { key: 'sertraline', name: 'sertraline (ZOLOFT) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', cls: 'SSRI antidepressant', sips: true, info: 'Do not stop abruptly. Monitor mood and bleeding risk with other anticoagulants.', indication: 'Depression / anxiety' });
      comorb(spec, { key: 'depression', problem: 'Depression / anxiety', details: 'Chronic depression and anxiety on an SSRI.', pmh: 'Depression and anxiety', plan: () => ['Continue sertraline; screen for suicidal ideation per policy.'] });
    }
  };

  M.osa = {
    label: 'Obstructive Sleep Apnea', desc: 'Adds CPAP at night and continuous pulse oximetry while on opioids.',
    apply(ctx, spec) {
      spec.osa = true;
      order(spec, { name: 'CPAP at night and with naps (home settings)', category: 'Respiratory', frequency: 'Nightly and PRN', instructions: 'Apply home CPAP when sleeping. RT to assist with settings.', startH: 3 });
      comorb(spec, { key: 'osa', problem: 'Obstructive sleep apnea', details: 'Uses CPAP at night; increased opioid sensitivity.', pmh: 'Obstructive sleep apnea on CPAP', plan: () => ['CPAP while sleeping; minimize opioids and sedatives; continuous pulse oximetry while on opioids.'] });
    }
  };

  M.bph = {
    label: 'BPH', desc: 'Adds tamsulosin and urinary-retention watch (important with opioids / after anesthesia).',
    apply(ctx, spec) {
      home(spec, { key: 'tamsulosin', name: 'tamsulosin (FLOMAX) capsule', dose: '0.4 mg', route: 'Oral', freq: 'qHS', cls: 'Alpha blocker', info: 'May cause orthostatic hypotension; check BP and fall risk.', monitor: ['BP'], holdIf: ['npo'], indication: 'BPH' });
      comorb(spec, { key: 'bph', problem: 'Benign prostatic hyperplasia', details: 'Chronic urinary outflow symptoms on tamsulosin.', pmh: 'Benign prostatic hyperplasia', plan: () => ['Monitor for urinary retention (bladder scan if no void in 6 hours).'] });
      order(spec, { name: 'Bladder scan if no void in 6 hours', category: 'Nursing', frequency: 'PRN', instructions: 'Notify provider if post-void residual above 300 mL.', startH: 3 });
    }
  };

  // ---------- Options shown in the UI ----------
  const SURGERIES = [
    ['appendectomy', 'Appendectomy'], ['cholecystectomy', 'Cholecystectomy'], ['hysterectomy', 'Hysterectomy'], ['csection', 'Cesarean section'],
    ['hernia', 'Hernia repair'], ['colectomy', 'Bowel resection / colectomy'], ['abd_other', 'Other abdominal surgery (adhesions)'],
    ['cabg', 'CABG'], ['pci', 'Coronary stent / PCI'], ['tka', 'Total knee replacement'], ['tha', 'Total hip replacement'],
    ['spine', 'Spinal fusion'], ['tonsil', 'Tonsillectomy'], ['pacemaker', 'Pacemaker / ICD'], ['tubal', 'Tubal ligation']
  ];
  const ALLERGIES = [
    { id: 'penicillin', substance: 'Penicillin', reaction: 'Hives', severity: 'High' },
    { id: 'sulfa', substance: 'Sulfa drugs', reaction: 'Rash', severity: 'Moderate' },
    { id: 'codeine', substance: 'Codeine', reaction: 'Nausea and vomiting', severity: 'Moderate' },
    { id: 'nsaid', substance: 'NSAIDs (ibuprofen)', reaction: 'Bronchospasm', severity: 'High' },
    { id: 'latex', substance: 'Latex', reaction: 'Contact dermatitis', severity: 'Moderate' },
    { id: 'contrast', substance: 'Iodinated contrast', reaction: 'Hives', severity: 'Moderate' }
  ];

  return { M, SURGERIES, ALLERGIES, helpers: { home, order, comorb, assess, addLabs, sticky, heldNote } };
})();

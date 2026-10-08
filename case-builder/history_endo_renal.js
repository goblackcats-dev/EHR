/* Medical-history modules: Endocrine / Metabolic and Renal / Genitourinary.
   Registered with NS.HX.add; kidney stages 1-5 replace one another (rules.js keeps the most advanced). */
(() => {
  const HX = NS.HX, U = NS.util;
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = HX.helpers;
  const ENDO = 'Endocrine / Metabolic', RENAL = 'Renal / Genitourinary';

  // ---- shared helpers ----------------------------------------------------------
  const pick = (ctx, key, arr) => arr[Math.abs(U.hashString(String(ctx.input.mrn || '') + String(ctx.input.name || '') + key)) % arr.length];
  const lab = (code, def) => { NS.LABS.C[code] = NS.LABS.C[code] || def; };
  lab('Testosterone', { cat: 'Endocrine', units: 'ng/dL', ref: { M: [264, 916], F: [8, 60] }, dec: 0, base: { M: 520, F: 28 } });
  lab('Urine sodium', { cat: 'Urine', units: 'mmol/L', ref: [20, 110], dec: 0, base: 60 });
  lab('Urine osmolality', { cat: 'Urine', units: 'mOsm/kg', ref: [300, 900], dec: 0, base: 520 });
  lab('Prealbumin', { cat: 'Hepatic', units: 'mg/dL', ref: [18, 38], dec: 0, base: 26 });
  const once = (spec, o) => { if (!spec.orders.some(x => x.name.toLowerCase() === o.name.toLowerCase())) order(spec, o); };
  const has = (spec, re) => spec.meds.some(m => re.test(m.name) || re.test(m.key || ''));
  const onSteroid = spec => spec.meds.some(m => /corticosteroid/i.test(m.cls || '') && !m.home);
  const surgeryOf = spec => spec.events.filter(e => e.type === 'surgery').sort((a, b) => a.h - b.h)[0] || null;
  const PRN_GLUC = { key: 'glucagon_prn', name: 'glucagon injection', dose: '1 mg', route: 'IM', freq: 'q15min', prn: true, prnInterval: 'May repeat once in 15 minutes', prnFor: 'glucose below 70 mg/dL when unable to take oral carbohydrate and no IV access', cls: 'Hypoglycemic rescue agent', info: 'Turn patient on side after giving (vomiting risk). Recheck glucose in 15 minutes; give carbohydrate when awake.', monitor: ['Glucose'], prnGiven: [] };
  // Estimated creatinine for a target eGFR (CKD-EPI 2021) so the chart's eGFR matches the stage.
  const crFor = (ctx, egfr) => { let cr = 0.4; while (cr < 14 && NS.LABS.egfr(cr, ctx.age, ctx.sex) > egfr) cr += 0.01; return U.round(cr, 2); };
  // Rebuild the diet name from every condition that changes it (renal, sodium, carbohydrate, calories); idempotent across modules.
  const dietBase = new WeakMap();
  function dietAdd(ctx, spec, part) {
    spec._dietParts = spec._dietParts || new Set(); if (part) spec._dietParts.add(part);
    const parts = [];
    if (ctx.renal !== 'none') parts.push('renal'); else if (ctx.has('ckd2') || ctx.has('ckd1')) parts.push('2 g sodium');
    else if (ctx.has('hf')) parts.push('2 g sodium');
    if (ctx.has('dm1') || ctx.has('dm2') || spec._dietParts.has('carb')) parts.push('consistent carbohydrate');
    if (spec._dietParts.has('kcal')) parts.push('high calorie, high protein');
    if (spec._dietParts.has('lowna')) parts.push('2 g sodium');
    if (spec._dietParts.has('stone')) parts.push('low sodium, high fluid');
    const uniq = U.uniq(parts);
    spec.orders.forEach(o => {
      if (o.category !== 'Diet' || /fluid restriction|npo|clear|nothing/i.test(o.name)) return;
      if (!dietBase.has(o) && /^(regular|general|low residue|soft|heart)/i.test(o.name)) dietBase.set(o, { low: /low residue/i.test(o.name), ins: o.instructions || '' });
      const b = dietBase.get(o); if (!b || !uniq.length) return;
      o.name = `${U.cap(uniq.join(', '))} diet${b.low ? ' (low residue)' : ''}`;
      o.instructions = (b.ins ? b.ins + ' ' : '') + `Modified for ${uniq.join(', ')}.`;
    });
  }
  // steroid-induced hyperglycemia monitoring for patients without diabetes
  function steroidGlucose(ctx, spec) {
    if (!onSteroid(spec) || ctx.has('dm1') || ctx.has('dm2')) return false;
    spec.labAdd.Glucose = (spec.labAdd.Glucose || 0) + 35;
    once(spec, { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'ACHS (every 6 hours if NPO)', instructions: 'Steroid-induced hyperglycemia risk: check before meals and at bedtime. Notify provider for glucose above 180 mg/dL twice.', startH: 3 });
    home(spec, { key: 'insulin_lispro', name: 'insulin lispro (HUMALOG) correction scale', dose: 'Low-dose correction scale', route: 'Subcutaneous', freq: 'ACHS', cls: 'Rapid-acting insulin', info: 'Give per correction scale only with a meal (or q6h if NPO) while on corticosteroids. Check glucose first.', monitor: ['Glucose'], variants: { npo: { freq: 'q6h' } }, home: false, indication: 'Steroid-induced hyperglycemia' });
    return true;
  }

  // =============================== ENDOCRINE / METABOLIC ===============================
  HX.add('dm1', {
    label: 'Type 1 Diabetes Mellitus', group: ENDO, order: 4, aliases: ['type 1 diabetes', 'iddm', 'juvenile diabetes', 'insulin pump', 'diabetes'],
    desc: 'Basal-bolus insulin that is NEVER held (even NPO), correction scale, ketone checks, hypoglycemia protocol with glucagon, consistent-carbohydrate diet.',
    apply(ctx, spec) {
      const basal = Math.max(10, Math.round(ctx.weightKg * 0.25 / 2) * 2), meal = Math.max(3, Math.round(ctx.weightKg * 0.07));
      const pump = ctx.age < 55 && Math.abs(U.hashString(String(ctx.input.mrn) + 'pump')) % 3 === 0;
      spec.labBase.Glucose = 188; spec.labBase['Hemoglobin A1c'] = 7.9;
      addLabs(spec, 0.5, ['Hemoglobin A1c']);
      home(spec, { key: 'insulin_glargine', name: 'insulin glargine (LANTUS) injection', dose: `${basal} units`, route: 'Subcutaneous', freq: 'qHS', cls: 'Long-acting insulin', info: 'BASAL insulin for type 1 diabetes: NEVER hold or omit, even when NPO (risk of DKA). Check glucose first; if below 100 mg/dL call the provider about a dose reduction rather than skipping.', monitor: ['Glucose'], hold: 'Do not hold. Call provider before giving if glucose is below 100 mg/dL.', variants: { npo: { dose: `${Math.round(basal * 0.8)} units` } }, indication: 'Type 1 diabetes (home basal insulin; reduced 20% while NPO, never omitted)' });
      home(spec, { key: 'insulin_lispro', name: 'insulin lispro (HUMALOG) injection', dose: `${meal} units with meals + correction scale`, route: 'Subcutaneous', freq: 'AC', cls: 'Rapid-acting insulin', info: 'Give 0-15 minutes before a meal; hold the MEALTIME dose if the patient is not eating or eats less than half the meal (correction only). Check glucose first and document it.', monitor: ['Glucose'], hold: 'Hold mealtime dose if not eating; give correction only.', variants: { npo: { freq: 'q6h', dose: 'Correction scale only (no mealtime dose while NPO)' } }, indication: 'Type 1 diabetes (mealtime and correction insulin)' });
      home(spec, PRN_GLUC);
      once(spec, { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'ACHS and 0300 (every 4-6 hours if NPO)', instructions: 'Check before meals, at bedtime and 0300; every 4-6 hours while NPO.', startH: 3 });
      once(spec, { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', instructions: 'Rule of 15: 15 g fast carbohydrate if awake and able to swallow, recheck in 15 minutes; dextrose 50% IV or glucagon 1 mg IM if unresponsive or NPO.', startH: 3 });
      once(spec, { name: 'Check ketones (beta-hydroxybutyrate) if glucose above 250 mg/dL', category: 'Lab / Bedside Testing', frequency: 'PRN glucose above 250 x2, nausea or vomiting', instructions: 'Type 1 diabetes: check serum beta-hydroxybutyrate and call provider if above 1.5 mmol/L or anion gap widens.', startH: 3 });
      once(spec, { name: 'Basal insulin must not be held', category: 'Nursing', frequency: 'Continuous', instructions: 'Type 1 diabetes: never hold basal insulin, including when NPO or before procedures. Ask the provider for a dose adjustment instead.', startH: 3 });
      dietAdd(ctx, spec, 'carb');
      if (pump) { heldNote(spec, 'Home insulin pump removed on admission per policy (patient unable to self-manage); converted to basal glargine + mealtime lispro. Give glargine at least 2 hours before the pump is disconnected.'); }
      heldNote(spec, 'Home oral/non-insulin agents (if any) held; insulin regimen continued.');
      sticky(spec, 'Type 1 diabetes: never omit basal insulin', 'Basal insulin continues even when NPO (reduced dose per provider). Hold only mealtime insulin if not eating. Glucose above 250 with nausea/vomiting: check ketones.');
      comorb(spec, { key: 'dm1', problem: 'Type 1 diabetes mellitus', details: `Insulin-dependent since adolescence; ${pump ? 'home insulin pump converted to basal-bolus while inpatient; ' : 'multiple daily injections; '}A1c about 7.9%.`, pmh: 'Type 1 diabetes mellitus (A1c 7.9%)',
        plan: (c, S, h) => [`Basal glargine continues${S.flag('npo', h) ? ' (reduced 20% while NPO, never omitted)' : ''}; ${S.flag('npo', h) ? 'correction lispro q6h with dextrose-containing IV fluid per provider' : 'mealtime lispro with correction scale'}. Goal glucose 140-180 mg/dL.`, 'Check ketones for glucose above 250 with nausea/vomiting; hypoglycemia protocol and glucagon available.'] });
      assess(spec, [['Safety', 'Diabetes Care', `Glucose checks per order; injection sites rotated without lipohypertrophy${pump ? '; home insulin pump removed' : ''}; feet intact`]]);
    }
  });

  HX.add('prediabetes', {
    label: 'Prediabetes', group: ENDO, order: 30, aliases: ['impaired fasting glucose', 'borderline diabetes', 'insulin resistance'],
    desc: 'A1c about 6.1%, mildly raised glucose; metformin held inpatient; glucose checks and correction insulin only if corticosteroids are given.',
    apply(ctx, spec) {
      spec.labBase.Glucose = 112; spec.labBase['Hemoglobin A1c'] = 6.1;
      addLabs(spec, 0.5, ['Hemoglobin A1c']);
      if (!steroidGlucose(ctx, spec)) once(spec, { name: 'Fasting point-of-care glucose', category: 'Lab / Bedside Testing', frequency: 'Daily before breakfast', instructions: 'Notify provider if fasting glucose is above 180 mg/dL; escalate to ACHS checks if two values exceed 180.', startH: 3 });
      heldNote(spec, 'Home metformin (prediabetes) held while hospitalized; resume at discharge if eGFR is 45 or higher.');
      order(spec, { name: 'Diabetes prevention education', category: 'Nursing', frequency: 'Once before discharge', instructions: 'Review weight loss goal (5-7%), 150 minutes/week activity, carbohydrate choices, and annual A1c.', startH: 30 });
      comorb(spec, { key: 'prediabetes', problem: 'Prediabetes', details: 'A1c about 6.1%; lifestyle management with metformin at home.', pmh: 'Prediabetes (A1c 6.1%)',
        plan: () => ['Metformin held inpatient; fasting glucose daily (ACHS if on steroids).', 'Prevention counseling before discharge.'] });
    }
  });

  HX.add('graves', {
    label: 'Hyperthyroidism / Graves Disease', group: ENDO, order: 31, aliases: ['graves disease', 'overactive thyroid', 'thyrotoxicosis', 'methimazole'],
    desc: 'Low TSH, high free T4, tachycardia and warm skin; methimazole + beta blocker; thyroid storm watch; avoid iodinated contrast when possible.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { TSH: 0.01, 'Free T4': 2.1, 'Free T3': 5.2 });
      addLabs(spec, 0.5, ['TSH', 'Free T4']);
      spec.vitalAdjust.push({ hr: 14, sbp: 8, dbp: -3, temp: 0.4 });
      const dose = pick(ctx, 'mmi', ['10 mg', '15 mg', '20 mg']);
      home(spec, { key: 'methimazole', name: 'methimazole (TAPAZOLE) tablet', dose, route: 'Oral', freq: 'daily', cls: 'Antithyroid drug', sips: true, info: 'Do not stop abruptly. Report sore throat, fever or mouth sores immediately (agranulocytosis) and check CBC. Monitor for rash and jaundice.', monitor: ['WBC'], holdIf: ['npoStrict'], holdReason: 'strict NPO', indication: 'Graves disease / hyperthyroidism' });
      if (!ctx.has('asthma') && !ctx.has('copd')) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Controls tachycardia and tremor of hyperthyroidism. Check BP and apical HR before giving. May give with a sip of water while NPO.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Hyperthyroidism symptom control (tachycardia, tremor)' });
      once(spec, { name: 'Thyroid storm watch', category: 'Nursing', frequency: 'Every 4 hours with vital signs', instructions: 'Report temperature above 101 F, HR above 120, agitation, confusion, vomiting or diarrhea immediately (thyroid storm risk with infection, surgery or contrast).', startH: 3, nursing: ['Infection or surgery can precipitate storm: treat fever and tachycardia as urgent.'] });
      once(spec, { name: 'Avoid iodinated contrast when possible', category: 'Nursing', frequency: 'Continuous', instructions: 'Iodine load can worsen or precipitate thyrotoxicosis; question non-essential contrast with the provider.', startH: 3 });
      sticky(spec, 'Hyperthyroidism: thyroid storm risk', 'TSH suppressed, free T4 high. Acute illness, surgery or iodinated contrast can trigger storm: fever above 101 F, HR above 130, agitation or vomiting need immediate escalation.');
      comorb(spec, { key: 'graves', problem: 'Hyperthyroidism (Graves disease)', details: 'Graves disease on methimazole; mildly thyrotoxic with tachycardia and tremor.', pmh: 'Graves disease (hyperthyroidism)',
        plan: (c, S, h) => ['Continue methimazole and beta blocker (give with sips even if NPO).', 'TSH and free T4 on admission; monitor for thyroid storm and for agranulocytosis symptoms.', S.flag('surgeryWindow', h) ? 'Endocrine to advise on peri-operative beta blockade.' : 'Trend HR and temperature each shift.'] });
      assess(spec, [['Skin', 'Skin', 'Warm, moist, smooth skin; fine tremor of outstretched hands'], ['Cardiac', 'Heart Sounds', 'Regular tachycardia, no murmur'], ['Neurologic', 'Mood / Behavior', 'Anxious, restless; brisk reflexes']]);
    }
  });

  HX.add('adrenal_insuff', {
    label: 'Adrenal Insufficiency', group: ENDO, order: 32, aliases: ['addison', 'addison disease', 'hydrocortisone', 'fludrocortisone', 'steroid dependent'],
    desc: 'Hydrocortisone + fludrocortisone that must never be missed; stress-dose rule (double dose when ill, IV hydrocortisone for surgery or sepsis).',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Sodium: 134, Potassium: 4.9, Glucose: 88 });
      spec.vitalAdjust.push({ sbp: -8, dbp: -4 });
      const crisis = spec.primaryKey === 'adrenal_crisis';
      const sx = surgeryOf(spec), mode = crisis ? 'crisis' : sx ? 'surgery' : spec.primaryKey === 'sepsis' ? 'sepsis' : 'sick';
      const am = pick(ctx, 'hc', [15, 20]), pm = 5;
      const common = { cls: 'Corticosteroid (glucocorticoid)', sips: true, monitor: ['BP', 'Glucose'], by: 'hospitalist' };
      const hc = (key, dose, at, startH, stopH, extra) => home(spec, Object.assign({ key, name: 'hydrocortisone (CORTEF) tablet', dose, route: 'Oral', freq: 'daily', at: [at], startH, stopH, info: 'NEVER skip or delay. Give with food. Missed doses can cause adrenal crisis (hypotension, vomiting, low sodium, low glucose). If vomiting or NPO the dose is given IV.', hold: 'Do not hold. Call provider if unable to take or keep down the dose.', variants: { npo: { name: 'hydrocortisone sodium succinate (SOLU-CORTEF) injection', route: 'IV' } }, indication: 'Adrenal insufficiency (replacement)' }, common, extra));
      const fl = (key, startH, stopH) => home(spec, { key, name: 'fludrocortisone tablet', dose: '0.1 mg', route: 'Oral', freq: 'daily', at: ['0800'], startH, stopH, cls: 'Mineralocorticoid', sips: true, info: 'Replaces aldosterone. Monitor BP, sodium, potassium and edema. May be held while receiving 50 mg/day or more of IV hydrocortisone or large saline volumes (mineralocorticoid effect).', monitor: ['BP', 'K', 'Na'], renal: { esrd: { avoid: true } }, indication: 'Primary adrenal insufficiency (mineralocorticoid replacement)' });
      if (!crisis) {
        let t1 = 3, t2 = 3;   // times maintenance dosing is suspended by stress dosing
        if (mode === 'surgery') {
          const end = sx.h + (sx.duration || 1.5);
          if (sx.h > 5) { hc('hydrocortisone_po_am', `${am} mg`, '0700', 3, sx.h - 0.8); hc('hydrocortisone_po_pm', `${pm} mg`, '1400', 3, sx.h - 0.8); fl('fludrocortisone', 3, sx.h - 0.8); }
          home(spec, { key: 'hydrocortisone_stress_induct', name: 'hydrocortisone sodium succinate (SOLU-CORTEF) injection', dose: '100 mg', route: 'IV', freq: 'once', startH: Math.max(0.5, sx.h - 0.5), home: false, cls: 'Corticosteroid (glucocorticoid)', info: 'Stress-dose steroid for surgery in adrenal insufficiency. Give at induction. Monitor BP and glucose.', monitor: ['BP', 'Glucose'], indication: 'Peri-operative stress dosing' });
          home(spec, { key: 'hydrocortisone_stress_iv50', name: 'hydrocortisone sodium succinate (SOLU-CORTEF) injection', dose: '50 mg', route: 'IV', freq: 'q8h', startH: end, stopH: end + 24, home: false, cls: 'Corticosteroid (glucocorticoid)', info: 'Stress dose for 24 hours after major surgery, then double the oral home dose until recovered. Never miss a dose.', monitor: ['BP', 'Glucose'], highAlert: true, indication: 'Peri-operative stress dosing' });
          t1 = end + 24; t2 = end + 72;
          hc('hydrocortisone_po_am_sick', `${am * 2} mg`, '0700', t1, t2, { home: false, indication: 'Adrenal insufficiency: double dose after surgery' }); hc('hydrocortisone_po_pm_sick', `${pm * 2} mg`, '1400', t1, t2, { home: false, indication: 'Adrenal insufficiency: double dose after surgery' });
          hc('hydrocortisone_po_am_resume', `${am} mg`, '0700', t2, undefined, { home: false }); hc('hydrocortisone_po_pm_resume', `${pm} mg`, '1400', t2, undefined, { home: false }); fl('fludrocortisone_resume', end + 24, undefined);
        } else if (mode === 'sepsis') {
          home(spec, { key: 'hydrocortisone_stress_iv50', name: 'hydrocortisone sodium succinate (SOLU-CORTEF) injection', dose: '50 mg', route: 'IV', freq: 'q6h', startH: 0.8, stopH: 60, home: false, cls: 'Corticosteroid (glucocorticoid)', info: 'Stress dose for septic shock / severe illness in adrenal insufficiency. Replaces oral hydrocortisone. Never miss a dose.', monitor: ['BP', 'Glucose'], highAlert: true, indication: 'Stress dosing for sepsis' });
          hc('hydrocortisone_po_am_sick', `${am * 2} mg`, '0700', 60, 108, { home: false, indication: 'Adrenal insufficiency: double dose while recovering' }); hc('hydrocortisone_po_pm_sick', `${pm * 2} mg`, '1400', 60, 108, { home: false, indication: 'Adrenal insufficiency: double dose while recovering' });
          hc('hydrocortisone_po_am', `${am} mg`, '0700', 108); hc('hydrocortisone_po_pm', `${pm} mg`, '1400', 108); fl('fludrocortisone', 60);
        } else {
          hc('hydrocortisone_po_am_sick', `${am * 2} mg`, '0700', 3, 78, { indication: 'Adrenal insufficiency: sick-day rule (double dose for acute illness)' }); hc('hydrocortisone_po_pm_sick', `${pm * 2} mg`, '1400', 3, 78, { indication: 'Adrenal insufficiency: sick-day rule (double dose for acute illness)' });
          hc('hydrocortisone_po_am', `${am} mg`, '0700', 78, undefined, { home: false }); hc('hydrocortisone_po_pm', `${pm} mg`, '1400', 78, undefined, { home: false }); fl('fludrocortisone', 3);
        }
        once(spec, { name: 'Steroid replacement must never be missed or delayed', category: 'Nursing', frequency: 'Continuous', instructions: 'Adrenal insufficiency: give hydrocortisone and fludrocortisone on time every day, including when NPO (IV). Stress dosing for surgery, sepsis or acute illness per provider.', startH: 3, nursing: ['Report SBP below 90, vomiting, Na below 130, K above 5.5 or glucose below 70 immediately (adrenal crisis).'] });
        once(spec, { name: 'Medical alert ID and emergency hydrocortisone injection teaching', category: 'Nursing', frequency: 'Before discharge', instructions: 'Teach sick-day rules (double or triple the dose), IM hydrocortisone 100 mg emergency kit, medical alert bracelet.', startH: 40 });
      }
      sticky(spec, 'Adrenal insufficiency: never miss steroid doses', `Dependent on hydrocortisone${crisis ? '' : ' + fludrocortisone'}. ${mode === 'surgery' ? 'Stress-dose IV hydrocortisone around surgery.' : mode === 'sepsis' ? 'Receiving IV stress-dose hydrocortisone for sepsis.' : 'Double the oral dose while acutely ill; use IV if NPO.'} Hypotension, vomiting or low sodium: call immediately.`);
      comorb(spec, { key: 'adrenal_insuff', problem: 'Adrenal insufficiency', details: 'Primary adrenal insufficiency (Addison disease) on hydrocortisone and fludrocortisone.', pmh: 'Adrenal insufficiency (on hydrocortisone and fludrocortisone)',
        plan: (c, S, h) => [crisis ? 'Managed as adrenal crisis; see primary plan.' : mode === 'surgery' ? 'Peri-operative stress-dose hydrocortisone, then double dose x 48 h, then home dose.' : mode === 'sepsis' ? 'IV stress-dose hydrocortisone 50 mg q6h, then double oral dose, then home dose.' : 'Sick-day rule: double oral hydrocortisone for 3 days, then home dose.', 'Never hold steroid doses; IV hydrocortisone if NPO.'] });
      assess(spec, [['Skin', 'Skin', 'Mild hyperpigmentation of palmar creases and gums; skin warm and dry'], ['Cardiac', 'Orthostatic BP', 'Mild orthostatic drop at baseline; reassess when standing']]);
    }
  });

  HX.add('cushing', {
    label: 'Cushing Syndrome', group: ENDO, order: 33, aliases: ['hypercortisolism', 'cushing disease', 'cushingoid'],
    desc: 'Hypertension, hyperglycemia, low potassium, fragile skin and infection risk; spironolactone, glucose checks with correction insulin, skin protection.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Glucose: 148, Potassium: 3.7, Sodium: 142, WBC: 11.2, Hemoglobin: ctx.female ? 13.8 : 15.2, Cortisol: 24 });
      spec.vitalAdjust.push({ sbp: 18, dbp: 9, hr: 4 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'spironolactone', name: 'spironolactone (ALDACTONE) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', cls: 'Aldosterone antagonist', info: 'Treats hypertension and hypokalemia of cortisol excess. Monitor potassium, creatinine and BP; hold if K above 5.0.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider if potassium above 5.0 or SBP below 100.', holdIf: ['npo', 'hypotension'], renal: { ckd3: { dose: '25 mg', note: 'Reduced dose and close potassium monitoring for reduced GFR.' }, esrd: { avoid: true } }, indication: 'Cushing syndrome (hypertension, hypokalemia)' });
      if (!steroidGlucose(ctx, spec) && !ctx.has('dm1') && !ctx.has('dm2')) {
        once(spec, { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'ACHS (every 6 hours if NPO)', instructions: 'Cortisol excess causes hyperglycemia; notify provider for glucose above 180 mg/dL twice.', startH: 3 });
      }
      once(spec, { name: 'Skin protection and infection precautions', category: 'Nursing', frequency: 'Every shift', instructions: 'Thin fragile skin: avoid adhesive tape, use gentle transfers and pressure-redistributing surface; hand hygiene; monitor wounds and IV sites for infection (fever may be blunted).', startH: 3 });
      comorb(spec, { key: 'cushing', problem: 'Cushing syndrome', details: 'Cortisol excess with hypertension, hyperglycemia, hypokalemia and fragile skin.', pmh: 'Cushing syndrome',
        plan: () => ['Monitor potassium, glucose and BP; spironolactone continued.', 'Skin and fall precautions (osteoporosis, myopathy); watch for infection with blunted fever.'] });
      assess(spec, [['Skin', 'Skin', 'Thin fragile skin with ecchymoses and purple abdominal striae; facial plethora'], ['Musculoskeletal / Mobility', 'Strength', 'Proximal muscle weakness (difficulty rising from chair)']]);
    }
  });
  HX.add('hyperparathyroid', {
    label: 'Hyperparathyroidism', group: ENDO, order: 34, aliases: ['primary hyperparathyroidism', 'high calcium', 'hypercalcemia', 'parathyroid adenoma'],
    desc: 'Mild hypercalcemia (Ca ~10.9), high PTH, low phosphorus; cinacalcet, hydration, avoid calcium/thiazides/vitamin D, fall precautions (osteoporosis).',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Calcium: 10.9, 'Ionized calcium': 5.5, PTH: 118, Phosphorus: 2.6, ALP: 128, '25-OH Vitamin D': 24 });
      addLabs(spec, 0.5, ['Phosphorus', 'PTH', 'Ionized calcium']);
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'cinacalcet', name: 'cinacalcet (SENSIPAR) tablet', dose: pick(ctx, 'cina', ['30 mg', '60 mg']), route: 'Oral', freq: 'BID', at: ['0900', '2100'], cls: 'Calcimimetic', info: 'Give WITH food. Swallow whole. Monitor calcium (hypocalcemia: tingling, cramps, QT prolongation), nausea.', monitor: ['K'], hold: 'Hold and notify provider if calcium is below 8.4 mg/dL or symptomatic (tingling, muscle cramps).', holdIf: ['npo'], holdReason: 'NPO (give with food)', indication: 'Hyperparathyroidism / hypercalcemia' });
      if (ctx.renal !== 'esrd' && !ctx.has('hf')) once(spec, { name: 'Encourage oral hydration 2-3 L/day', category: 'Diet', frequency: 'Daily', instructions: 'Maintain hydration to promote calcium excretion unless fluid restricted; report nausea, constipation, confusion or polyuria.', startH: 3 });
      once(spec, { name: 'Avoid calcium and vitamin D supplements and thiazide diuretics', category: 'Nursing', frequency: 'Continuous', instructions: 'Hypercalcemia: question orders for thiazides, lithium, calcium carbonate antacids, or vitamin D; pharmacy review.', startH: 3 });
      comorb(spec, { key: 'hyperparathyroid', problem: 'Hyperparathyroidism', details: 'Primary hyperparathyroidism with mild hypercalcemia and osteopenia.', pmh: 'Hyperparathyroidism (mild hypercalcemia)',
        plan: () => ['Trend calcium and phosphorus daily; keep hydrated; continue cinacalcet with meals.', 'Avoid thiazides, calcium and vitamin D; report constipation, confusion, polyuria.'] });
      assess(spec, [['GI', 'Bowel Function', 'Mild chronic constipation'], ['Musculoskeletal / Mobility', 'Strength', 'Mild generalized weakness; osteopenia, fall precautions']]);
    }
  });

  HX.add('hypoparathyroid', {
    label: 'Hypoparathyroidism', group: ENDO, order: 35, aliases: ['low calcium', 'hypocalcemia', 'post-thyroidectomy hypocalcemia', 'parathyroid'],
    desc: 'Low calcium (~8.0), high phosphorus, low PTH; calcium carbonate + calcitriol, IV calcium gluconate PRN, Chvostek/Trousseau, seizure and QT precautions.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Calcium: 8.0, 'Ionized calcium': 4.3, PTH: 9, Phosphorus: 5.0, Magnesium: 1.8 });
      addLabs(spec, 0.5, ['Phosphorus', 'PTH', 'Ionized calcium', 'Magnesium']);
      home(spec, { key: 'calcium_carbonate', name: 'calcium carbonate (TUMS EX / OS-CAL) tablet', dose: '1,000 mg (400 mg elemental)', route: 'Oral', freq: 'TID', at: ['0800', '1200', '1700'], cls: 'Calcium supplement', info: 'Give WITH meals. Separate from levothyroxine and quinolones by 4 hours. Constipation is common.', monitor: ['Cr'], hold: 'Hold and notify provider if calcium is above 10.2 mg/dL.', holdIf: ['npo'], holdReason: 'NPO (give with meals)', indication: 'Hypoparathyroidism (calcium replacement)' });
      home(spec, { key: 'calcitriol', name: 'calcitriol (ROCALTROL) capsule', dose: '0.5 mcg', route: 'Oral', freq: 'BID', at: ['0900', '2100'], cls: 'Active vitamin D', info: 'Monitor calcium and phosphorus. Report nausea, constipation, confusion (hypercalcemia).', monitor: ['Cr'], holdIf: ['npo'], indication: 'Hypoparathyroidism' });
      home(spec, { key: 'calcium_gluconate_prn', name: 'calcium gluconate IVPB', dose: '2 g in 100 mL', route: 'IV', freq: 'q6h', prn: true, prnInterval: 'Per provider', prnFor: 'perioral tingling, carpopedal spasm, positive Chvostek/Trousseau, or calcium below 7.5 mg/dL', cls: 'Electrolyte replacement', info: 'Infuse over 20-30 minutes on a monitor. Never push rapidly. Peripheral IV must be patent (tissue necrosis if infiltrates). Do not mix with ceftriaxone or bicarbonate. Recheck calcium.', monitor: ['K'], highAlert: true, prnGiven: [], home: false, by: 'hospitalist', hold: 'Hold and notify provider if calcium is above 9.0 mg/dL or HR is below 50.', indication: 'Symptomatic hypocalcemia' });
      once(spec, { name: 'Hypocalcemia monitoring (Chvostek and Trousseau signs)', category: 'Nursing', frequency: 'Every 8 hours', instructions: 'Assess perioral numbness, tingling, muscle cramps, laryngospasm/stridor, and tap facial nerve. Notify provider for new symptoms or QTc above 500 ms.', startH: 3, nursing: ['Keep calcium gluconate and suction at hand; seizure precautions.'] });
      once(spec, { name: 'Seizure precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Padded rails per policy, suction and oxygen at bedside while calcium is below 7.5 mg/dL.', startH: 3 });
      comorb(spec, { key: 'hypoparathyroid', problem: 'Hypoparathyroidism', details: 'Chronic low PTH (post-surgical) with calcium about 8.0 mg/dL on calcium and calcitriol.', pmh: 'Hypoparathyroidism (post-surgical)',
        plan: (c, S, h) => ['Continue calcium carbonate and calcitriol; calcium and phosphorus daily.', S.flag('npo', h) ? 'Oral calcium held while NPO: ask provider about IV calcium gluconate.' : 'Calcium gluconate IV PRN symptoms.', 'Seizure precautions; monitor QTc.'] });
      assess(spec, [['Neurologic', 'Neuromuscular', 'No perioral tingling; Chvostek and Trousseau negative'], ['Cardiac', 'Rhythm', 'Sinus rhythm; QTc borderline prolonged on last ECG']]);
    }
  });

  HX.add('vitd_def', {
    label: 'Vitamin D Deficiency', group: ENDO, order: 36, aliases: ['low vitamin d', 'osteomalacia', 'vitamin d'],
    desc: '25-OH vitamin D ~14, borderline low calcium, mildly raised PTH and ALP; vitamin D3 replacement, fall precautions.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { '25-OH Vitamin D': 14, Calcium: 8.7, PTH: 74, ALP: 124, Phosphorus: 2.9 });
      addLabs(spec, 0.5, ['25-OH Vitamin D', 'Phosphorus', 'PTH']);
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'cholecalciferol', name: 'cholecalciferol (vitamin D3) tablet', dose: pick(ctx, 'd3', ['2,000 units', '5,000 units']), route: 'Oral', freq: 'daily', cls: 'Vitamin D', info: 'Replacement for vitamin D deficiency. Give with a meal containing fat.', holdIf: ['npo'], indication: 'Vitamin D deficiency' });
      comorb(spec, { key: 'vitd_def', problem: 'Vitamin D deficiency', details: '25-OH vitamin D about 14 ng/mL with mildly raised PTH; muscle and bone aches.', pmh: 'Vitamin D deficiency',
        plan: () => ['Continue vitamin D3 replacement; recheck 25-OH vitamin D in 8-12 weeks.', 'Fall precautions; calcium intake via diet.'] });
      assess(spec, [['Musculoskeletal / Mobility', 'Strength', 'Mild proximal muscle weakness; diffuse bone tenderness']]);
    }
  });

  HX.add('malnutrition', {
    label: 'Malnutrition / Underweight', group: ENDO, order: 37, aliases: ['underweight', 'cachexia', 'low albumin', 'protein calorie malnutrition', 'refeeding'],
    desc: 'Low BMI, albumin ~2.8 and prealbumin, low Hgb; high-calorie diet and supplements, thiamine, REFEEDING risk (phos/Mg/K monitoring), pressure injury risk.',
    apply(ctx, spec) {
      if (ctx.bmi > 18.5 && !ctx.input.weightKg) { ctx.weightKg = U.round(17.4 * Math.pow(ctx.heightCm / 100, 2), 0); ctx.bmi = 17.4; }
      else if (ctx.bmi > 20) spec.warnings.push({ level: 'warning', text: `Malnutrition is selected but BMI is ${ctx.bmi}. Adjust the weight or remove malnutrition.` });
      Object.assign(spec.labBase, { Albumin: 2.8, Prealbumin: 11, Phosphorus: 3.0, Magnesium: 1.7, Potassium: 3.8, Hemoglobin: ctx.female ? 10.8 : 11.6, Hematocrit: ctx.female ? 33 : 35 });
      addLabs(spec, 0.5, ['Albumin', 'Prealbumin', 'Phosphorus', 'Magnesium']);
      [24, 48, 72].forEach(h => addLabs(spec, h, ['Phosphorus', 'Magnesium', 'Potassium']));
      spec.vitalAdjust.push({ sbp: -8, dbp: -3, hr: -2, temp: -0.3 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'thiamine', name: 'thiamine tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B1', info: 'Give BEFORE starting nutrition or dextrose-containing fluids (refeeding / Wernicke prevention).', variants: { npo: { name: 'thiamine injection', route: 'IV' } }, indication: 'Malnutrition (refeeding prevention)' });
      home(spec, { key: 'multivitamin', name: 'multivitamin with minerals tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', holdIf: ['npo'], indication: 'Malnutrition' });
      home(spec, { key: 'oral_supplement', name: 'oral nutrition supplement (ENSURE PLUS)', dose: '8 oz (350 kcal)', route: 'Oral', freq: 'BID', at: ['1000', '1500'], cls: 'Nutritional supplement', info: 'Give between meals, not with meals. Record percent consumed.', holdIf: ['npo'], home: false, indication: 'Malnutrition' });
      dietAdd(ctx, spec, 'kcal');
      once(spec, { name: 'Dietitian consult: nutrition assessment', category: 'Nursing', frequency: 'Within 24 hours', instructions: 'Calorie counts x3 days; weekly weights; assess swallowing and dentition; start slowly (10-20 kcal/kg/day) and advance over 3-5 days.', startH: 4 });
      once(spec, { name: 'Refeeding syndrome precautions', category: 'Nursing', frequency: 'Daily x 3 days', instructions: 'Check phosphorus, magnesium and potassium daily for 3 days after feeding starts; replace before they fall. Report HR irregularity, weakness, confusion, edema, respiratory difficulty.', startH: 4, nursing: ['Phosphorus below 2.5 or K below 3.5: notify provider for replacement before advancing calories.'] });
      once(spec, { name: 'Pressure injury prevention', category: 'Nursing', frequency: 'Every 2 hours', instructions: 'Braden score every shift; reposition every 2 hours, offload heels and sacrum, pressure-redistributing mattress.', startH: 3 });
      comorb(spec, { key: 'malnutrition', problem: 'Malnutrition / underweight', details: `BMI ${ctx.bmi}, albumin about 2.8 g/dL; at risk for refeeding syndrome and pressure injury.`, pmh: `Protein-calorie malnutrition (BMI ${ctx.bmi})`,
        plan: () => ['Dietitian-guided high-calorie, high-protein diet with supplements; advance calories slowly.', 'Refeeding labs (Phos, Mg, K) daily x3 days; thiamine before feeding.', 'Pressure injury prevention; weekly weights.'] });
      assess(spec, [['Skin', 'Skin', 'Dry, thin, loose skin; temporal wasting, prominent bony prominences'], ['Skin', 'Braden Score', '14'], ['GI', 'Nutrition', 'Poor appetite; eats 25-50% of meals at baseline']]);
    }
  });

  HX.add('hypogonadism', {
    label: 'Hypogonadism / Hormone Replacement', group: ENDO, order: 38, aliases: ['low testosterone', 'testosterone replacement', 'premature ovarian insufficiency', 'estrogen deficiency'],
    desc: 'Men: testosterone gel (raised Hct, hold if Hct above 54%). Women: estrogen replacement (held for VTE, stroke or MI diagnoses).',
    apply(ctx, spec) {
      if (ctx.male) {
        Object.assign(spec.labBase, { Testosterone: 410, Hematocrit: 49, Hemoglobin: 16.2 });
        addLabs(spec, 0.5, ['Testosterone']);
        home(spec, { key: 'testosterone_gel', name: 'testosterone (ANDROGEL 1.62%) gel', dose: '40.5 mg (2 pumps)', route: 'Topical', freq: 'daily', at: ['0800'], cls: 'Androgen', info: 'Apply to clean, dry shoulders/upper arms. Wash hands; keep skin covered; avoid contact with women and children. Controlled substance. Monitor hematocrit and BP.', monitor: ['Hgb'], hold: 'Hold and notify provider if hematocrit is above 54% or active VTE.', holdIf: ['surgeryWindow'], holdReason: 'peri-operative / bleeding-risk window', indication: 'Male hypogonadism (testosterone replacement)' });
        once(spec, { name: 'Monitor hematocrit (testosterone therapy)', category: 'Nursing', frequency: 'Daily with CBC', instructions: 'Erythrocytosis and VTE risk on testosterone: report Hct above 54%, leg swelling or chest pain.', startH: 3 });
        comorb(spec, { key: 'hypogonadism', problem: 'Male hypogonadism on testosterone replacement', details: 'Testosterone replacement with Hct at upper limit of normal.', pmh: 'Hypogonadism on testosterone replacement', plan: () => ['Continue testosterone gel; trend Hct; hold if Hct above 54% or VTE.', 'Higher VTE risk: mobilize early; SCDs.'] });
        assess(spec, [['Musculoskeletal / Mobility', 'Strength', 'Normal muscle bulk on replacement; steady gait']]);
      } else {
        const thrombotic = ['pe', 'stroke', 'nstemi', 'stemi'].includes(spec.primaryKey);
        if (thrombotic) heldNote(spec, 'Home estradiol (hormone replacement) held: acute thrombotic/cardiovascular diagnosis. Provider to decide on resumption.');
        else home(spec, { key: 'estradiol', name: 'estradiol (ESTRACE) tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Estrogen', info: 'Increases VTE and stroke risk. Hold with immobility, surgery or acute thrombosis per provider. Report leg swelling, chest pain, severe headache.', holdIf: ['npo', 'surgeryWindow'], holdReason: 'NPO / peri-operative VTE risk', indication: 'Estrogen deficiency (hormone replacement)' });
        comorb(spec, { key: 'hypogonadism', problem: 'Estrogen deficiency on hormone replacement', details: 'Premature ovarian insufficiency / hypoestrogenism on estradiol replacement.', pmh: 'Hypoestrogenism on hormone replacement', plan: () => [thrombotic ? 'Estradiol held this admission (thrombotic diagnosis).' : 'Continue estradiol; hold if immobile or peri-operative per provider.', 'VTE prophylaxis and early mobilization.'] });
        assess(spec, [['Musculoskeletal / Mobility', 'Strength', 'Normal strength; osteopenia (fall precautions)']]);
      }
    }
  });
  // @@END
})();

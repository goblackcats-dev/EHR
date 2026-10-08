/* Cardiovascular and respiratory medical-history modules beyond the basics in history.js.
   Each one adds typical home medications (real adult doses), baseline vitals/labs, nursing orders, a baseline assessment and a problem-list
   entry whose plan() says what happens to the condition during THIS admission. Educational defaults, not rules about every patient. */
(() => {
  const HX = NS.HX, U = NS.util;
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = HX.helpers;
  const CV = 'Cardiovascular', RS = 'Respiratory';

  // ---------- local helpers ----------
  const hasMed = (spec, k) => spec.meds.some(m => m.key === k);
  const homeOnce = (spec, m) => { if (!hasMed(spec, m.key)) home(spec, m); };
  const orderOnce = (spec, o) => { if (!spec.orders.some(x => x.name === o.name)) order(spec, o); };
  const comorbOnce = (spec, c) => { if (!spec.comorb.some(x => x.key === c.key)) comorb(spec, c); };
  const device = (spec, d) => { if (!spec.devices.some(x => x.type === d.type)) spec.devices.push(Object.assign({ placeH: -24 * 365, preexisting: true, status: 'In use' }, d)); };
  // set a baseline lab: how 'max' keeps the higher, 'min' the lower, 'set' overwrites, default only fills an empty value
  const baseLab = (spec, code, v, how) => {
    const cur = spec.labBase[code];
    if (cur === undefined || how === 'set') spec.labBase[code] = v;
    else if (how === 'min') spec.labBase[code] = Math.min(cur, v);
    else if (how === 'max') spec.labBase[code] = Math.max(cur, v);
  };
  const betaBlockerOn = spec => ['metoprolol', 'carvedilol', 'bisoprolol', 'atenolol', 'propranolol'].some(k => hasMed(spec, k));
  const anyAnticoag = spec => hasMed(spec, 'apixaban') || hasMed(spec, 'warfarin') || hasMed(spec, 'rivaroxaban');
  const ageDose = (ctx, lo, hi) => (ctx.age >= 75 ? lo : hi);

  const dropNSAIDs = (spec, why) => {
    const out = spec.meds.filter(m => /NSAID/i.test(m.cls || '') || /ketorolac|ibuprofen|naproxen|meloxicam|celecoxib/i.test(m.name));
    if (!out.length) return;
    spec.meds = spec.meds.filter(m => !out.includes(m));
    spec.applied.push(`NSAID (${out.map(m => m.name.split(' ')[0]).join(', ')}) omitted because of ${why}.`);
  };
  // SGLT2 inhibitors are held in acute illness, NPO states and before surgery (euglycemic DKA, volume depletion)
  const sglt2 = (ctx, spec, indication) => {
    if (hasMed(spec, 'empagliflozin') || hasMed(spec, 'dapagliflozin')) return;
    if (['dka', 'hhs', 'aki', 'sepsis', 'pancreatitis', 'hyponatremia'].includes(spec.primaryKey) || ctx.has('dm1') || ctx.renal === 'esrd') { heldNote(spec, 'Home SGLT2 inhibitor held this admission (acute illness, ketoacidosis or volume-depletion risk).'); return; }
    home(spec, { key: 'empagliflozin', name: 'empagliflozin (JARDIANCE) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'SGLT2 inhibitor', info: 'Hold when NPO, volume depleted, acutely ill or before surgery (euglycemic DKA risk). Monitor for genital yeast infection, UTI and low BP.', monitor: ['BP', 'Cr', 'Glucose'], holdIf: ['npo', 'preop', 'surgeryWindow', 'hypotension'], holdReason: 'NPO / peri-operative / acute illness (euglycemic DKA and volume depletion risk)', indication });
  };
  // Reduce the sodium in a regular-type diet order (same idea as adaptDiet in rules.js, which only handles 'hf' and kidney disease).
  const sodiumDiet = (ctx, spec, label) => {
    if (ctx.renal !== 'none' || ctx.has('hf')) return;
    const parts = [label || '2 g sodium'];
    if (ctx.has('dm2')) parts.push('consistent carbohydrate');
    const text = parts.join(', ');
    spec.orders.forEach(o => {
      if (o.category === 'Diet' && /^(regular|general|low residue|soft|heart)/i.test(o.name) && !/fluid restriction/i.test(o.name)) {
        o.name = `${U.cap(text)} diet${/low residue/i.test(o.name) ? ' (low residue)' : ''}`;
        o.instructions = (o.instructions ? o.instructions + ' ' : '') + `Modified for ${text}.`;
      }
    });
  };

  // Therapeutic anticoagulation: home DOAC or warfarin, held in bleeding-risk windows, with SQ heparin prophylaxis meanwhile (rules.js skips
  // standard prophylaxis when spec.therapeuticAnticoagulation is set, so the gap is covered here).
  const anticoagulate = (ctx, spec, o) => {
    spec.therapeuticAnticoagulation = true;
    const sw = spec.flags.surgeryWindow;
    const swEnd = sw && sw.length ? Math.max(...sw.map(w => w[1])) : undefined;
    if (spec.primaryKey === 'pe') {
      heldNote(spec, 'Home anticoagulant replaced by the inpatient heparin / anticoagulation plan for this admission (possible treatment failure: review adherence and dose).');
    } else if (!anyAnticoag(spec)) {
      if (o.warfarin) {
        spec.labBase.INR = 2.4; spec.labBase.PT = 26;
        addLabs(spec, 0.5, ['PT', 'INR']);
        spec.labSchedule.push({ daily: true, codes: ['PT', 'INR'] });
        home(spec, { key: 'warfarin', name: 'warfarin (COUMADIN) tablet', dose: ctx.age >= 75 ? '3 mg' : ctx.weightKg > 90 ? '7.5 mg' : '5 mg', route: 'Oral', freq: 'qHS', cls: 'Anticoagulant (vitamin K antagonist)', highAlert: true,
          info: `INR goal ${o.goal || '2.0-3.0'}. Check the INR BEFORE every dose. Antibiotics, steroids and amiodarone raise the INR; dietary vitamin K lowers it. Dose is set by daily INR per pharmacy.`, monitor: ['INR', 'Hgb'],
          hold: 'Hold and call provider for INR above 3.5, any bleeding, or a procedure planned within 5 days.', holdIf: ['npoStrict', 'surgeryWindow'], holdReason: 'procedure / bleeding-risk window', indication: o.indication });
      } else {
        const reduce = [ctx.age >= 80, ctx.weightKg <= 60, (spec.labBase.Creatinine || 1) >= 1.5].filter(Boolean).length >= 2;
        const full = o.fullDose !== false;
        home(spec, { key: 'apixaban', name: 'apixaban (ELIQUIS) tablet', dose: o.dose || (full ? '5 mg' : reduce ? '2.5 mg' : '5 mg'), route: 'Oral', freq: 'BID', cls: 'Anticoagulant (factor Xa inhibitor)', highAlert: true,
          info: 'Monitor for bleeding. HIGH-ALERT: do not give if the patient is scheduled for or just had surgery, a procedure or an acute bleed until the provider clears it. Missed doses raise clot risk.', monitor: ['Hgb', 'Plt', 'Cr'],
          holdIf: ['surgeryWindow'], holdReason: 'bleeding-risk window (surgery, acute stroke or possible procedure)', renal: { esrd: { note: 'ESRD: limited data on DOAC dosing; pharmacy and nephrology to confirm the dose.' } }, indication: o.indication });
      }
    }
    dropNSAIDs(spec, 'full-dose anticoagulation (bleeding risk)');
    orderOnce(spec, { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'On an anticoagulant: soft toothbrush, electric razor, hold pressure 5 minutes after sticks, no IM injections. Report melena, hematuria, epistaxis, new headache or large bruises.', startH: 3 });
    if (swEnd && swEnd > 4) {
      if (spec.flags.bleeding) {
        orderOnce(spec, { name: 'Sequential compression devices (anticoagulant held for bleeding)', category: 'Nursing', frequency: 'Continuous when in bed', instructions: 'Active bleeding: mechanical prophylaxis only until the provider restarts anticoagulation. Do not give SQ heparin or enoxaparin.', startH: 3 });
      } else {
        homeOnce(spec, { key: 'heparin_ppx', name: 'heparin injection', dose: '5,000 units', route: 'Subcutaneous', freq: 'q8h', cls: 'Anticoagulant (prophylaxis)', highAlert: true, home: false, startH: spec.primaryKey === 'stroke' ? 26 : 4, stopH: swEnd,
          info: `Prophylaxis dose only while the home ${hasMed(spec, 'warfarin') ? 'warfarin' : 'anticoagulant'} is held. Monitor for bleeding, bruising and platelets (HIT). Stops when the home anticoagulant resumes.`, monitor: ['Hgb', 'Plt'],
          hold: 'Hold and notify provider for active bleeding or platelets below 50.', indication: 'VTE prophylaxis while home anticoagulant is held' });
      }
    }
  };
  const anticoagPlan = (what) => (c, S, h) => [S.flag('surgeryWindow', h) ? `${what} held for the procedure / bleeding-risk window; SQ heparin prophylaxis meanwhile. Provider to restart when safe.` : `Continue ${what}; bleeding precautions and CBC monitoring.`];

  // ---------- Atrial flutter ----------
  HX.add('flutter', {
    label: 'Atrial Flutter', group: CV, aliases: ['a flutter', 'aflutter', 'flutter'], order: 50,
    desc: 'Adds a regular-irregular flutter rhythm, rate control and an anticoagulant held around surgery or bleeding.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ hr: 8 });
      if (!betaBlockerOn(spec)) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: ageDose(ctx, '25 mg', '50 mg'), route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Atrial flutter rate control' });
      anticoagulate(ctx, spec, { indication: 'Atrial flutter stroke prevention (same risk as atrial fibrillation)', fullDose: false });
      assess(spec, [['Cardiac', 'Rhythm', 'Atrial flutter with variable AV block, rate controlled'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular-irregular, no murmur']]);
      comorb(spec, { key: 'flutter', problem: 'Atrial flutter', details: 'Typical atrial flutter on rate control and anticoagulation; CHA2DS2-VASc guides stroke prevention.', pmh: 'Atrial flutter (on anticoagulation)', plan: (c, S, h) => ['Rate controlled; continue beta blocker with BP and HR hold parameters.', ...anticoagPlan('apixaban')(c, S, h)] });
    }
  });

  // ---------- HFpEF ----------
  HX.add('hfpef', {
    label: 'Heart Failure with Preserved EF (HFpEF)', group: CV, aliases: ['diastolic heart failure', 'diastolic hf', 'hfpef', 'chf'], order: 50,
    desc: 'Adds a loop diuretic, spironolactone and SGLT2 inhibitor, 2 g sodium diet, daily weights and fluid caution.',
    apply(ctx, spec) {
      spec.fluidSensitive = true;
      baseLab(spec, 'BNP', 190, 'max');
      spec.vitalAdjust.push({ sbp: 8, dbp: 2, hr: 2 });
      homeOnce(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: ageDose(ctx, '20 mg', '40 mg'), route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / receiving IV fluids', renal: { esrd: { avoid: true } }, indication: 'HFpEF (home diuretic)' });
      if (!ctx.has('esrd') && !ctx.has('ckd4') && !ctx.has('ckd5')) homeOnce(spec, { key: 'spironolactone', name: 'spironolactone (ALDACTONE) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Mineralocorticoid antagonist / potassium-sparing diuretic', info: 'Monitor potassium and creatinine. Avoid potassium supplements and salt substitutes. Watch for hyperkalemia and gynecomastia.', monitor: ['K', 'Cr', 'BP'], hold: 'Hold and notify provider for potassium above 5.0 or creatinine rise above 30%.', holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / AKI risk', renal: { ckd3: { dose: '12.5 mg', note: 'Reduced dose for reduced GFR; check potassium daily.' }, esrd: { avoid: true } }, indication: 'HFpEF (reduces hospitalization)' });
      dropNSAIDs(spec, 'heart failure (fluid retention, kidney injury)');
      sglt2(ctx, spec, 'HFpEF');
      orderOnce(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain of more than 2 lb in a day or 5 lb in a week.', startH: 3 });
      sodiumDiet(ctx, spec, '2 g sodium');
      assess(spec, [['Cardiac', 'Edema', 'Trace bilateral ankle edema'], ['Cardiac', 'Heart Sounds', 'S1 S2 regular, soft S4, no murmur']]);
      comorb(spec, { key: 'hfpef', problem: 'Heart failure with preserved ejection fraction', details: 'Chronic HFpEF (EF about 60%, grade II diastolic dysfunction) on diuretic, spironolactone and SGLT2 inhibitor.', pmh: 'Heart failure with preserved ejection fraction (EF about 60%)',
        plan: (c, S, h) => ['Euvolemic to mildly overloaded; judicious IV fluids with daily weights, strict I&O and lung checks.', S.flag('npo', h) ? 'Home furosemide, spironolactone and empagliflozin held while NPO.' : 'Continue home diuretic and spironolactone; SGLT2 inhibitor resumes when eating and stable.', 'Avoid NSAIDs and excess sodium; keep SBP at goal (below 130).'] });
    }
  });

  // ---------- Prior MI ----------
  HX.add('hx_mi', {
    label: 'Prior Myocardial Infarction', group: CV, aliases: ['heart attack', 'old mi', 'previous mi', 'mi history'], order: 50,
    desc: 'Adds secondary prevention: aspirin, high-intensity statin, beta blocker, ACE inhibitor and PRN sublingual nitroglycerin.',
    apply(ctx, spec) {
      baseLab(spec, 'LDL cholesterol', 68, 'min');
      homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Prior myocardial infarction' });
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin. Report unexplained muscle pain or weakness, dark urine.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Secondary prevention after MI' });
      if (!betaBlockerOn(spec)) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: ageDose(ctx, '25 mg', '50 mg'), route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Prior MI' });
      if (!hasMed(spec, 'lisinopril') && ctx.renal !== 'esrd') home(spec, { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'ACE inhibitor', info: 'Check BP before giving. Monitor potassium and creatinine. Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider if SBP is below 100.', holdIf: ['npo', 'hypotension', 'permHTN'], holdReason: 'NPO, low blood pressure or permissive hypertension', indication: 'Prior MI / reduced EF prevention' });
      if (hasMed(spec, 'sildenafil')) heldNote(spec, 'Sublingual nitroglycerin not ordered: contraindicated with sildenafil (pulmonary hypertension therapy).');
      else homeOnce(spec, { key: 'nitroglycerin_sl', name: 'nitroglycerin (NITROSTAT) sublingual tablet', dose: '0.4 mg', route: 'Sublingual', freq: 'q5min', prn: true, prnInterval: 'Every 5 minutes (max 3 doses)', prnFor: 'chest pain', cls: 'Nitrate vasodilator',
        info: 'Check BP before each dose and have the patient sit. Notify the provider and obtain a 12-lead ECG for chest pain; if not relieved after the first tablet call a rapid response. Never give within 24-48 hours of sildenafil or tadalafil.', monitor: ['BP', 'HR', 'Pain'], hold: 'Hold for SBP below 100, HR below 50 or above 100, or recent PDE-5 inhibitor.', indication: 'Chest pain (prior MI)' });
      orderOnce(spec, { name: 'Notify provider and obtain 12-lead ECG for chest pain', category: 'Nursing', frequency: 'PRN', instructions: 'Any chest pain, pressure, jaw or arm discomfort, diaphoresis or dyspnea: stop activity, vitals, 12-lead ECG within 10 minutes, notify provider.', startH: 3 });
      comorb(spec, { key: 'hx_mi', problem: 'History of myocardial infarction', details: 'Remote MI (more than 1 year ago) with preserved to mildly reduced EF (about 45-50%); on secondary prevention.', pmh: 'Prior myocardial infarction (EF about 45-50%)',
        plan: (c, S, h) => ['Continue aspirin, high-intensity statin and beta blocker; ACE inhibitor when BP allows.', S.flag('hypotension', h) ? 'ACE inhibitor and beta blocker held for low BP; resume when SBP consistently above 110.' : 'Chest pain protocol: ECG and troponin if symptoms.'] });
    }
  });

  // ---------- Peripheral arterial disease ----------
  HX.add('pad', {
    label: 'Peripheral Arterial Disease', group: CV, aliases: ['peripheral vascular disease', 'pvd', 'claudication', 'pad'], order: 50,
    desc: 'Adds antiplatelet and high-intensity statin, pulse/limb checks, foot protection and avoids compression devices on the legs.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ sbp: 8, dbp: 1 });
      const clop = ctx.age % 2 === 0;
      if (clop && !hasMed(spec, 'aspirin')) home(spec, { key: 'clopidogrel', name: 'clopidogrel (PLAVIX) tablet', dose: '75 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet (P2Y12 inhibitor)', info: 'Monitor for bleeding. HIGH-ALERT before procedures: usually stopped 5-7 days before elective surgery.', monitor: ['Hgb', 'Plt'], holdIf: ['surgeryWindow'], holdReason: 'bleeding-risk window (surgery or acute bleed)', indication: 'Peripheral arterial disease' });
      else homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Peripheral arterial disease' });
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin. Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Peripheral arterial disease / hyperlipidemia' });
      if (!ctx.has('hf') && !ctx.has('hfpef') && !ctx.has('icd_cm')) home(spec, { key: 'cilostazol', name: 'cilostazol (PLETAL) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', at: ['0800', '2000'], cls: 'Phosphodiesterase-3 inhibitor', info: 'Give 30 minutes before or 2 hours after meals. For claudication. CONTRAINDICATED in heart failure; may cause headache, diarrhea and palpitations.', monitor: ['HR', 'BP'], hold: 'Hold and notify provider for HR above 110, palpitations or new dyspnea/edema.', holdIf: ['npo', 'surgeryWindow'], holdReason: 'NPO / bleeding-risk window', indication: 'Intermittent claudication' });
      orderOnce(spec, { name: 'Lower extremity circulation checks (pulses, color, temperature, capillary refill)', category: 'Nursing', frequency: 'Every shift', instructions: 'Compare both legs: dorsalis pedis and posterior tibial pulses (Doppler if not palpable), color, temperature, cap refill, sensation. Report a new cool, pale or painful limb immediately (acute limb ischemia).', startH: 3 });
      orderOnce(spec, { name: 'Foot and heel protection', category: 'Nursing', frequency: 'Every shift', instructions: 'Inspect feet and heels for wounds or color change; float heels, loose heel-offloading boots; no heating pads or tight stockings.', startH: 3 });
      orderOnce(spec, { name: 'Avoid sequential compression devices and compression stockings (ABI 0.45)', category: 'Nursing', frequency: 'Continuous', instructions: 'Moderate-severe PAD: compression can cause limb ischemia. Use pharmacologic VTE prophylaxis; SCDs only if vascular surgery clears them.', startH: 3 });
      assess(spec, [['Cardiac', 'Peripheral Pulses', 'Femoral pulses 2+; dorsalis pedis and posterior tibial faint (1+) bilaterally, Doppler signals present'], ['Skin', 'Skin', 'Feet cool, shiny skin with hair loss; capillary refill 3-4 seconds, no ulcers']]);
      comorb(spec, { key: 'pad', problem: 'Peripheral arterial disease', details: 'Atherosclerotic PAD with claudication at about one block; ABI 0.45 bilaterally; no tissue loss.', pmh: 'Peripheral arterial disease (claudication, ABI 0.45)',
        plan: (c, S, h) => ['Continue antiplatelet and statin; limb checks every shift.', 'No SCDs or compression stockings; pharmacologic VTE prophylaxis; protect heels.', S.flag('surgeryWindow', h) && hasMed(spec, 'clopidogrel') ? 'Clopidogrel held for the procedure window.' : 'Smoking cessation and supervised walking program.'] });
    }
  });

  // ---------- Prior DVT / PE on anticoagulant ----------
  HX.add('hx_vte', {
    label: 'Prior DVT / Pulmonary Embolism (on anticoagulant)', group: CV, aliases: ['dvt', 'pe history', 'blood clot', 'clot', 'vte', 'deep vein thrombosis', 'anticoagulated'], order: 40,
    desc: 'Adds full-dose home anticoagulation (apixaban or warfarin), bleeding precautions, held around surgery with SQ heparin prophylaxis meanwhile.',
    apply(ctx, spec) {
      const warf = ctx.age % 2 === 0 && !ctx.has('afib') && !ctx.has('flutter');
      anticoagulate(ctx, spec, { warfarin: warf, goal: '2.0-3.0', indication: 'Prior unprovoked DVT/PE (extended anticoagulation)', dose: '5 mg' });
      assess(spec, [['Cardiac', 'Edema', ctx.age % 3 === 0 ? 'Trace chronic right lower-leg edema (post-thrombotic); calves soft and non-tender' : 'Trace chronic left lower-leg edema (post-thrombotic); calves soft and non-tender']]);
      comorb(spec, { key: 'hx_vte', problem: 'History of DVT / pulmonary embolism on anticoagulation', details: `Unprovoked VTE; on ${warf ? 'warfarin (INR goal 2.0-3.0)' : 'apixaban 5 mg twice daily'} for extended therapy.`, pmh: `Prior DVT / pulmonary embolism on ${warf ? 'warfarin' : 'apixaban'}`,
        plan: (c, S, h) => [S.flag('surgeryWindow', h) ? `${warf ? 'Warfarin' : 'Apixaban'} held for the procedure / bleeding-risk window; SQ heparin prophylaxis meanwhile; mechanical prophylaxis; restart when the surgeon or provider clears it.` : `Continue ${warf ? 'warfarin with daily INR' : 'apixaban'}; no additional DVT prophylaxis needed.`, 'Report calf pain or swelling, sudden dyspnea or chest pain immediately.'] });
    }
  });

  // ---------- Aortic stenosis ----------
  HX.add('aortic_stenosis', {
    label: 'Aortic Stenosis (severe)', group: CV, aliases: ['aortic valve stenosis', 'as', 'valve disease', 'murmur'], order: 55,
    desc: 'Adds a systolic murmur and narrow pulse pressure; preload-dependent: avoid hypotension, hypovolemia and vasodilators.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ sbp: -4, dbp: 1 });
      baseLab(spec, 'BNP', 150, 'max');
      // fixed outflow obstruction: tighten hold parameters on blood pressure-lowering medications
      spec.meds.filter(m => m.home && (/ACE inhibitor|Angiotensin|Beta blocker|Alpha blocker|Calcium channel|diuretic|Nitrate|vasodilator/i.test(m.cls || '') || m.key === 'nitroglycerin_sl')).forEach(m => {
        m.nursing = [...(m.nursing || []), 'Severe aortic stenosis: cardiac output depends on preload and cannot rise through the fixed valve. Hold and notify provider for SBP below 110 or dizziness.'];
        if (m.holdIf && !m.holdIf.includes('hypotension')) m.holdIf = [...m.holdIf, 'hypotension'];
      });
      orderOnce(spec, { name: 'Aortic stenosis: avoid hypotension and volume depletion', category: 'Nursing', frequency: 'Continuous', instructions: 'Notify provider for SBP below 100, HR above 110, or new chest pain, syncope/near-syncope or dyspnea (angina, syncope and heart failure are the classic AS symptoms). Avoid vasodilators (nitrates), large diuretic doses, and prolonged NPO without IV fluids. Give IV fluids in small boluses with reassessment. Rise slowly.', startH: 3 });
      orderOnce(spec, { name: 'Fall and syncope precautions (aortic stenosis)', category: 'Precautions', frequency: 'Continuous', instructions: 'Assist with first stand; check orthostatic BP before the first ambulation; avoid straining.', startH: 3 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      sticky(spec, 'Aortic stenosis', 'Severe AS (valve area 0.9 cm2, mean gradient 42 mmHg). Preload-dependent: low BP, dehydration, vasodilators and tachyarrhythmias can drop cardiac output. Call for SBP below 100, chest pain or syncope.');
      assess(spec, [['Cardiac', 'Heart Sounds', 'Harsh crescendo-decrescendo systolic murmur 3/6 at right upper sternal border radiating to carotids; soft S2'], ['Cardiac', 'Peripheral Pulses', 'Carotid pulse slow-rising and weak (pulsus parvus et tardus); radial 2+'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm']]);
      comorb(spec, { key: 'aortic_stenosis', problem: 'Severe aortic stenosis', details: 'Calcific aortic stenosis (valve area 0.9 cm2, mean gradient 42 mmHg, EF 55%); followed by cardiology, valve replacement being considered.', pmh: 'Severe aortic stenosis (valve area 0.9 cm2)',
        plan: (c, S, h) => ['Preload-dependent: maintain euvolemia and BP; avoid hypotension, vasodilators and aggressive diuresis.', S.flag('hypotension', h) ? 'Hypotension this admission: antihypertensives held; treat promptly with cautious IV fluids; notify cardiology.' : S.flag('npo', h) ? 'NPO: maintenance IV fluids; hold blood-pressure-lowering medications.' : 'Monitor for angina, syncope and dyspnea; outpatient valve evaluation (TAVR vs surgical).'] });
    }
  });

  // ---------- Mitral regurgitation ----------
  HX.add('mitral_regurg', {
    label: 'Mitral Regurgitation (chronic)', group: CV, aliases: ['mitral valve regurgitation', 'mr', 'mitral insufficiency', 'valve disease'], order: 50,
    desc: 'Adds an apical holosystolic murmur, low-dose diuretic and afterload reduction; mild fluid caution.',
    apply(ctx, spec) {
      spec.fluidSensitive = true;
      baseLab(spec, 'BNP', 140, 'max');
      spec.vitalAdjust.push({ hr: 2 });
      homeOnce(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / receiving IV fluids', renal: { esrd: { avoid: true } }, indication: 'Mitral regurgitation with mild volume overload' });
      if (!hasMed(spec, 'lisinopril') && !hasMed(spec, 'losartan') && ctx.renal !== 'esrd') home(spec, { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '5 mg', route: 'Oral', freq: 'daily', cls: 'ACE inhibitor', info: 'Afterload reduction. Check BP before giving. Monitor potassium and creatinine. Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider if SBP is below 100.', holdIf: ['npo', 'hypotension', 'permHTN'], holdReason: 'NPO, low blood pressure or permissive hypertension', indication: 'Mitral regurgitation (afterload reduction)' });
      orderOnce(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain of more than 2 lb in a day or 5 lb in a week.', startH: 3 });
      assess(spec, [['Cardiac', 'Heart Sounds', 'Blowing holosystolic murmur 3/6 at the apex radiating to the axilla; S1 soft'], ['Cardiac', 'Edema', 'Trace bilateral ankle edema']]);
      comorb(spec, { key: 'mitral_regurg', problem: 'Chronic mitral regurgitation', details: 'Moderate-severe degenerative mitral regurgitation, EF 55%, mild left atrial enlargement; surveillance echo yearly.', pmh: 'Mitral regurgitation, moderate to severe (EF 55%)',
        plan: (c, S, h) => ['Euvolemic; avoid fluid overload and uncontrolled tachycardia/hypertension (worsen regurgitation).', S.flag('npo', h) ? 'Home diuretic and ACE inhibitor held while NPO.' : 'Continue home diuretic and afterload reduction; daily weights.', 'Report new dyspnea, orthopnea, palpitations (new atrial fibrillation) or edema.'] });
    }
  });

  // ---------- Pulmonary hypertension ----------
  HX.add('pulm_htn', {
    label: 'Pulmonary Arterial Hypertension', group: CV, aliases: ['pulmonary hypertension', 'pah', 'pulmonary htn', 'right heart failure'], order: 45,
    desc: 'Adds sildenafil (never interrupted) and an endothelin antagonist, loud P2/RV strain findings, diuretic, supplemental O2 and fluid caution.',
    apply(ctx, spec) {
      spec.fluidSensitive = true;
      spec.vitalAdjust.push({ spo2: -2, hr: 4 });
      if (!spec.baseO2) spec.baseO2 = '2 L nasal cannula';
      baseLab(spec, 'BNP', 260, 'max');
      // nitrates are contraindicated with sildenafil
      if (hasMed(spec, 'nitroglycerin_sl')) { spec.meds = spec.meds.filter(m => m.key !== 'nitroglycerin_sl'); spec.applied.push('Sublingual nitroglycerin omitted: contraindicated with sildenafil (pulmonary hypertension therapy).'); }
      home(spec, { key: 'sildenafil', name: 'sildenafil (REVATIO) tablet', dose: '20 mg', route: 'Oral', freq: 'TID', at: ['0800', '1400', '2000'], cls: 'Phosphodiesterase-5 inhibitor (pulmonary vasodilator)', highAlert: true, sips: true,
        info: 'Do NOT interrupt: abrupt stopping can cause rebound pulmonary hypertension and right heart failure. Give on time even when NPO (with a sip of water, or IV 10 mg TID if strictly NPO). CONTRAINDICATED with nitrates. Check BP first; may cause hypotension, flushing and headache.', monitor: ['BP', 'SPO2'],
        hold: 'Hold and call provider for SBP below 90. Never give with nitroglycerin or isosorbide.', variants: { npo: { name: 'sildenafil (REVATIO) injection', dose: '10 mg', route: 'IV' } }, indication: 'Pulmonary arterial hypertension' });
      if (ctx.male || ctx.age >= 55) home(spec, { key: 'macitentan', name: 'macitentan (OPSUMIT) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Endothelin receptor antagonist', highAlert: true, sips: true, info: 'Specialty drug (REMS). Do not interrupt. Monitor hemoglobin (anemia), liver enzymes and edema. Teratogenic: do not handle if pregnant.', monitor: ['Hgb', 'LFT', 'BP'], hold: 'Notify provider for Hgb below 8 or ALT more than 3 times normal.', indication: 'Pulmonary arterial hypertension' });
      homeOnce(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight. RV is preload-sensitive: avoid both overload and dehydration.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / receiving IV fluids', renal: { esrd: { avoid: true } }, indication: 'Right heart failure from pulmonary hypertension' });
      dropNSAIDs(spec, 'pulmonary hypertension / right heart failure (fluid retention)');
      orderOnce(spec, { name: 'Pulmonary hypertension: keep SpO2 92% or higher, avoid hypoxia and dehydration', category: 'Respiratory', frequency: 'Continuous', instructions: 'Hypoxia, acidosis, hypovolemia and sedation can trigger a pulmonary hypertensive crisis. Titrate oxygen to SpO2 92% or higher; notify provider for SBP below 90, syncope, new chest pain or SpO2 below 90%. Give PAH medications on time.', startH: 3 });
      orderOnce(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain of more than 2 lb in a day or 5 lb in a week.', startH: 3 });
      sodiumDiet(ctx, spec, '2 g sodium');
      sticky(spec, 'Do not miss PAH doses', 'Sildenafil (and macitentan) must be given on time every time, including while NPO. No nitrates. Avoid sudden hypoxia, hypotension and dehydration.');
      assess(spec, [['Cardiac', 'Heart Sounds', 'Loud P2, RV heave, soft tricuspid regurgitation murmur; JVP elevated to 10 cm'], ['Cardiac', 'Edema', 'Trace bilateral ankle edema']]);
      comorb(spec, { key: 'pulm_htn', problem: 'Pulmonary arterial hypertension', details: 'WHO group 1 PAH (RVSP 62 mmHg, mild RV dilation) on sildenafil; baseline SpO2 about 93-95% on 2 L at rest.', pmh: 'Pulmonary arterial hypertension (RVSP 62 mmHg)',
        plan: (c, S, h) => ['Continue sildenafil on time (IV if strictly NPO); do not interrupt PAH therapy.', 'Maintain SpO2 92% or higher; avoid hypotension, hypovolemia, acidosis and sedatives; no nitrates.', 'Judicious IV fluids with daily weights; notify pulmonology for decompensation.'] });
    }
  });

  // ---------- Cardiomyopathy with ICD ----------
  HX.add('icd_cm', {
    label: 'Cardiomyopathy with ICD (EF 25%)', group: CV, aliases: ['icd', 'defibrillator', 'cardiomyopathy', 'hfref', 'nonischemic cardiomyopathy', 'low ef'], order: 50,
    desc: 'Adds guideline therapy for EF 25% (beta blocker, sacubitril-valsartan, spironolactone, SGLT2 inhibitor, diuretic), ICD precautions, fluid caution.',
    apply(ctx, spec) {
      spec.fluidSensitive = true;
      baseLab(spec, 'BNP', 480, 'max');
      spec.vitalAdjust.push({ hr: 4, sbp: -4 });
      if (!betaBlockerOn(spec)) home(spec, { key: 'carvedilol', name: 'carvedilol (COREG) tablet', dose: '12.5 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Give with food. Check BP and HR before giving.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension', 'permHTN'], holdReason: 'low blood pressure or permissive hypertension', indication: 'Cardiomyopathy with reduced EF' });
      if (!hasMed(spec, 'lisinopril') && !hasMed(spec, 'losartan') && ctx.renal !== 'esrd') home(spec, { key: 'sacubitril_valsartan', name: 'sacubitril-valsartan (ENTRESTO) tablet', dose: ctx.age >= 75 || ctx.renal === 'ckd3' ? '24/26 mg' : '49/51 mg', route: 'Oral', freq: 'BID', cls: 'Angiotensin receptor-neprilysin inhibitor', highAlert: true,
        info: 'Check BP, potassium and creatinine. NEVER give with an ACE inhibitor (36-hour washout); risk of angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider for SBP below 100, potassium above 5.0, or lip/tongue swelling.', holdIf: ['npo', 'hypotension', 'permHTN'], holdReason: 'NPO / low BP / permissive hypertension', indication: 'Heart failure with reduced EF' });
      if (ctx.renal === 'none') homeOnce(spec, { key: 'spironolactone', name: 'spironolactone (ALDACTONE) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Mineralocorticoid antagonist / potassium-sparing diuretic', info: 'Monitor potassium and creatinine. Avoid potassium supplements and salt substitutes.', monitor: ['K', 'Cr', 'BP'], hold: 'Hold and notify provider for potassium above 5.0.', holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / AKI risk', indication: 'Heart failure with reduced EF' });
      homeOnce(spec, { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight.', monitor: ['BP', 'K', 'Cr'], holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / receiving IV fluids', renal: { esrd: { avoid: true } }, indication: 'Heart failure (home diuretic)' });
      sglt2(ctx, spec, 'Heart failure with reduced EF');
      dropNSAIDs(spec, 'cardiomyopathy (fluid retention, kidney injury)');
      orderOnce(spec, { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', instructions: 'Same scale each morning before breakfast; report gain of more than 2 lb in a day or 5 lb in a week.', startH: 3 });
      orderOnce(spec, { name: 'Continuous cardiac monitoring (EF 25%, ICD)', category: 'Nursing', frequency: 'Continuous', instructions: 'Telemetry while acutely ill. Report runs of ventricular tachycardia, symptomatic ectopy or ICD shock. Keep potassium 4.0 or higher and magnesium 2.0 or higher.', startH: 3 });
      if (!ctx.surg.has('icd')) {
        device(spec, { deviceType: 'Tube', type: 'ICD (defibrillator)', location: 'Left upper chest', siteMarker: 'chestLeft', status: 'Active', assess: 'pocket healed, no erythema, swelling or tenderness; device mobile under skin' });
        orderOnce(spec, { name: 'ICD precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'If the patient receives a shock: check consciousness, pulse, BP and rhythm; obtain 12-lead ECG; notify provider. One shock and feels well: notify provider same day. Two or more shocks, or a shock with chest pain, syncope or dyspnea: rapid response. No MRI or magnet use without device clearance; electrocautery needs an EP plan.', startH: 3 });
        assess(spec, [['Cardiac', 'Device', 'ICD left chest; pocket healed, no shocks reported']]);
      }
      sodiumDiet(ctx, spec, '2 g sodium');
      assess(spec, [['Cardiac', 'Rhythm', 'Sinus rhythm with occasional PVCs'], ['Cardiac', 'Edema', 'Trace bilateral lower extremity edema']]);
      comorb(spec, { key: 'icd_cm', problem: 'Cardiomyopathy (EF 25%) with ICD', details: 'Non-ischemic dilated cardiomyopathy, EF 25%, primary-prevention ICD in place; on guideline-directed therapy.', pmh: 'Non-ischemic cardiomyopathy (EF 25%) with ICD',
        plan: (c, S, h) => ['Telemetry while acutely ill; ICD shock plan in place (call provider; 2 or more shocks = rapid response).', S.flag('hypotension', h) ? 'Sacubitril-valsartan, beta blocker, spironolactone and diuretic held for low BP; restart one at a time as SBP recovers.' : S.flag('npo', h) ? 'Oral HF medications (except beta blocker with sips) held while NPO.' : 'Continue guideline-directed HF therapy; judicious IV fluids with daily weights.'] });
    }
  });

  // ---------- SVT ----------
  HX.add('svt', {
    label: 'Supraventricular Tachycardia (AVNRT)', group: CV, aliases: ['paroxysmal svt', 'psvt', 'avnrt', 'supraventricular tachycardia'], order: 50,
    desc: 'Adds a rate-control beta blocker, an SVT response order and PRN adenosine; baseline sinus rhythm with history of episodes.',
    apply(ctx, spec) {
      if (!betaBlockerOn(spec)) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Supraventricular tachycardia prevention' });
      home(spec, { key: 'adenosine_prn', name: 'adenosine (ADENOCARD) injection', dose: '6 mg rapid IV push (12 mg if no response in 1-2 minutes)', route: 'IV', freq: 'once', prn: true, prnInterval: 'May repeat once at 12 mg', prnFor: 'sustained narrow-complex tachycardia (HR above 150) after vagal maneuvers', cls: 'Antiarrhythmic', highAlert: true, home: false,
        info: 'HIGH-ALERT. Provider at the bedside with defibrillator and 12-lead ECG running. Give through the most proximal IV (antecubital) as a rapid push followed by a 20 mL saline flush. Warn the patient of brief chest pressure and flushing. Avoid in asthma/severe bronchospasm.', monitor: ['HR', 'BP'], hold: 'Do not give for unstable or irregular wide-complex tachycardia, second/third-degree block or active bronchospasm.', indication: 'Acute SVT (inpatient PRN)' });
      orderOnce(spec, { name: 'SVT response: vagal maneuver, 12-lead ECG and call provider', category: 'Nursing', frequency: 'PRN', instructions: 'Sudden regular HR above 150: obtain vitals and 12-lead ECG, ask the patient to bear down (modified Valsalva) while supine, call provider. Unstable (hypotension, chest pain, altered mentation): rapid response, synchronized cardioversion per ACLS.', startH: 3 });
      orderOnce(spec, { name: 'Telemetry monitoring', category: 'Nursing', frequency: 'Continuous', instructions: 'Continuous cardiac monitoring while acutely ill. Document rhythm each shift.', startH: 3 });
      assess(spec, [['Cardiac', 'Rhythm', 'Normal sinus rhythm; history of paroxysmal SVT, none this admission']]);
      comorb(spec, { key: 'svt', problem: 'Paroxysmal supraventricular tachycardia (AVNRT)', details: 'Episodic AV-nodal reentrant tachycardia; controlled on a beta blocker; avoids caffeine and stimulants.', pmh: 'Paroxysmal supraventricular tachycardia (AVNRT)',
        plan: () => ['Continue beta blocker; telemetry; vagal maneuvers then adenosine PRN for sustained SVT.', 'Avoid caffeine, decongestants and albuterol overuse (can trigger episodes).'] });
    }
  });

  // ---------- Sick sinus syndrome / pacemaker ----------
  HX.add('pacemaker_hx', {
    label: 'Sick Sinus Syndrome with Pacemaker', group: CV, aliases: ['sick sinus', 'sss', 'tachy-brady', 'bradycardia', 'pacemaker', 'heart block'], order: 50,
    desc: 'Adds a dual-chamber pacemaker (lower rate 60), paced rhythm, pacemaker precautions; some patients have tachy-brady with paroxysmal AF on apixaban.',
    apply(ctx, spec) {
      const tachy = ctx.age % 2 === 1;
      if (!ctx.surg.has('pacemaker')) {
        device(spec, { deviceType: 'Tube', type: 'Permanent pacemaker (dual chamber)', location: 'Left upper chest', siteMarker: 'chestLeft', status: 'Active', assess: 'pocket healed, no erythema or swelling; programmed lower rate 60 bpm' });
        orderOnce(spec, { name: 'Pacemaker precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Programmed lower rate 60 bpm: notify provider for pulse below 60 or symptoms of failure to capture/sense (dizziness, syncope, fatigue). No MRI unless the system is MRI-conditional and cleared; electrocautery needs a device plan.', startH: 3 });
        assess(spec, [['Cardiac', 'Rhythm', 'Sinus rhythm with intermittent atrial-paced beats'], ['Cardiac', 'Device', 'Pacemaker left chest; pocket healed']]);
      }
      if (tachy) {
        if (!betaBlockerOn(spec)) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: '25 mg', route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Safe with bradycardia because the pacemaker backs up the rate. Check BP and apical HR before giving.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 60 (paced rate), SBP below 100 or symptoms of pacemaker failure.', holdIf: ['hypotension'], indication: 'Tachy-brady syndrome: rate control of paroxysmal atrial fibrillation' });
        anticoagulate(ctx, spec, { indication: 'Paroxysmal atrial fibrillation (tachy-brady syndrome)', fullDose: false });
      }
      comorb(spec, { key: 'pacemaker_hx', problem: tachy ? 'Sick sinus (tachy-brady) syndrome with pacemaker' : 'Sick sinus syndrome with pacemaker', details: tachy ? 'Tachy-brady syndrome with dual-chamber pacemaker (lower rate 60); paroxysmal atrial fibrillation on rate control and apixaban.' : 'Symptomatic sinus node dysfunction treated with a dual-chamber pacemaker (lower rate 60).', pmh: tachy ? 'Sick sinus syndrome with pacemaker; paroxysmal atrial fibrillation' : 'Sick sinus syndrome with permanent pacemaker',
        plan: (c, S, h) => ['Paced at lower rate 60; notify provider for pulse below 60, syncope or dizziness (possible loss of capture).', tachy ? (S.flag('surgeryWindow', h) ? 'Apixaban held for the procedure window; SQ heparin prophylaxis meanwhile.' : 'Continue rate control and apixaban.') : 'AV-nodal blockers are acceptable because of pacemaker backup.', 'Interrogation check before MRI or surgery with electrocautery.'] });
    }
  });
})();

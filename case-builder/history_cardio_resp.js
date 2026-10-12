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
    // a diagnosis profile may add its own prophylaxis; full-dose anticoagulation makes that redundant (bridging prophylaxis is added below)
    const ppxOut = spec.meds.filter(m => /^(dvt_ppx|heparin_ppx|heparin_ppx_preop|enoxaparin)$/.test(m.key || '') && /prophylaxis/i.test(m.cls || ''));
    if (ppxOut.length && spec.primaryKey !== 'pe') { spec.meds = spec.meds.filter(m => !ppxOut.includes(m)); spec.applied.push('Standard VTE prophylaxis omitted: patient is on full-dose home anticoagulation (prophylaxis only while it is held).'); }
    const sw = spec.flags.surgeryWindow;
    const swEnd = sw && sw.length ? Math.max(...sw.map(w => w[1])) : undefined;
    if (spec.primaryKey === 'pe') {
      heldNote(spec, 'Home anticoagulant replaced by the inpatient heparin / anticoagulation plan for this admission (possible treatment failure: review adherence and dose).');
    } else if (!anyAnticoag(spec)) {
      if (o.warfarin) {
        spec.labBase.INR = 2.4; spec.labBase.PT = 26;
        addLabs(spec, 0.5, ['PT', 'INR']);
        spec.labSchedule.push({ daily: true, codes: ['PT', 'INR'] });
        home(spec, { key: 'warfarin', name: 'warfarin (COUMADIN) tablet', dose: ctx.age >= 75 ? '3 mg' : ctx.weightKg > 90 ? '7.5 mg' : '5 mg', route: 'Oral', freq: 'qHS', cls: 'Anticoagulant (vitamin K antagonist)', highAlert: true, sips: true,
          info: `INR goal ${o.goal || '2.0-3.0'}. Check the INR BEFORE every dose. Antibiotics, steroids and amiodarone raise the INR; dietary vitamin K lowers it. Dose is set by daily INR per pharmacy.`, monitor: ['INR', 'Hgb'],
          hold: 'Hold and call provider for INR above 3.5, any bleeding, or a procedure planned within 5 days.', holdIf: ['npoStrict', 'surgeryWindow'], holdReason: 'procedure / bleeding-risk window', indication: o.indication });
      } else {
        const reduce = [ctx.age >= 80, ctx.weightKg <= 60, (spec.labBase.Creatinine || 1) >= 1.5].filter(Boolean).length >= 2;
        const full = o.fullDose !== false;
        home(spec, { key: 'apixaban', name: 'apixaban (ELIQUIS) tablet', dose: o.dose || (full ? '5 mg' : reduce ? '2.5 mg' : '5 mg'), route: 'Oral', freq: 'BID', cls: 'Anticoagulant (factor Xa inhibitor)', highAlert: true, sips: true,
          info: 'Monitor for bleeding. HIGH-ALERT: do not give if the patient is scheduled for or just had surgery, a procedure or an acute bleed until the provider clears it. Missed doses raise clot risk.', monitor: ['Hgb', 'Plt', 'Cr'],
          holdIf: ['surgeryWindow'], holdReason: 'bleeding-risk window (surgery, acute stroke or possible procedure)', renal: { esrd: { note: 'ESRD: limited data on DOAC dosing; pharmacy and nephrology to confirm the dose.' } }, indication: o.indication });
      }
    }
    dropNSAIDs(spec, 'full-dose anticoagulation (bleeding risk)');
    orderOnce(spec, { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'On an anticoagulant: soft toothbrush, electric razor, hold pressure 5 minutes after sticks, no IM injections. Report melena, hematuria, epistaxis, new headache or large bruises.', startH: 3 });
    if (swEnd && swEnd > 4) {
      if (spec.flags.bleeding) {
        if (!spec.orders.some(o => /sequential compression/i.test(o.name))) order(spec, { name: 'Sequential compression devices (anticoagulant held for bleeding)', category: 'Nursing', frequency: 'Continuous when in bed', instructions: 'Active bleeding: mechanical prophylaxis only until the provider restarts anticoagulation. Do not give SQ heparin or enoxaparin.', startH: 3 });
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
      homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Prior myocardial infarction' });
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
      else homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Peripheral arterial disease' });
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin. Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Peripheral arterial disease / hyperlipidemia' });
      if (!ctx.has('hf') && !ctx.has('hfpef') && !ctx.has('icd_cm')) home(spec, { key: 'cilostazol', name: 'cilostazol (PLETAL) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', at: ['0800', '2000'], cls: 'Phosphodiesterase-3 inhibitor', info: 'Give 30 minutes before or 2 hours after meals. For claudication. CONTRAINDICATED in heart failure; may cause headache, diarrhea and palpitations.', monitor: ['HR', 'BP'], hold: 'Hold and notify provider for HR above 110, palpitations or new dyspnea/edema.', holdIf: ['npo', 'surgeryWindow'], holdReason: 'NPO / bleeding-risk window', indication: 'Intermittent claudication' });
      orderOnce(spec, { name: 'Lower extremity circulation checks (pulses, color, temperature, capillary refill)', category: 'Nursing', frequency: 'Every shift', instructions: 'Compare both legs: dorsalis pedis and posterior tibial pulses (Doppler if not palpable), color, temperature, cap refill, sensation. Report a new cool, pale or painful limb immediately (acute limb ischemia).', startH: 3 });
      orderOnce(spec, { name: 'Foot and heel protection', category: 'Nursing', frequency: 'Every shift', instructions: 'Inspect feet and heels for wounds or color change; float heels, loose heel-offloading boots; no heating pads or tight stockings.', startH: 3 });
      spec.orders = spec.orders.filter(o => !/^sequential compression devices/i.test(o.name));
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
      home(spec, { key: 'adenosine_prn', name: 'adenosine (ADENOCARD) injection', dose: '6 mg rapid IV push (12 mg if no response in 1-2 minutes)', route: 'IV', freq: 'q5min', prn: true, prnInterval: 'May repeat once at 12 mg after 1-2 minutes', prnFor: 'sustained narrow-complex tachycardia (HR above 150) after vagal maneuvers', cls: 'Antiarrhythmic', highAlert: true, home: false,
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

  // ---------- Carotid stenosis ----------
  HX.add('carotid_stenosis', {
    label: 'Carotid Artery Stenosis', group: CV, aliases: ['carotid disease', 'carotid artery disease', 'carotid stenosis'], order: 50,
    desc: 'Adds antiplatelet and high-intensity statin, a carotid bruit and neuro-check/BP-avoid-hypotension cautions.',
    apply(ctx, spec) {
      baseLab(spec, 'LDL cholesterol', 72, 'min');
      homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'Monitor for bleeding. Continue through surgery unless surgeon directs otherwise.', monitor: ['Hgb'], indication: 'Carotid artery stenosis' });
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin. Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Carotid artery stenosis' });
      orderOnce(spec, { name: 'Neurologic checks and avoid hypotension (carotid stenosis)', category: 'Nursing', frequency: 'Every 4 hours', instructions: 'Hypotension can cause cerebral hypoperfusion distal to a tight carotid stenosis. Notify provider for SBP below 100, and immediately for new facial droop, arm weakness, speech change or monocular vision loss (stroke/TIA: note time last known well).', startH: 3 });
      assess(spec, [['Neurologic', 'Neuro Check', 'Strength and sensation equal bilaterally, speech clear, no facial droop'], ['Cardiac', 'Peripheral Pulses', 'Right carotid bruit audible; radial and femoral pulses 2+']]);
      comorb(spec, { key: 'carotid_stenosis', problem: 'Carotid artery stenosis', details: 'Right internal carotid stenosis 60-69% on duplex, asymptomatic; medical management and surveillance.', pmh: 'Carotid artery stenosis (right ICA 60-69%)',
        plan: (c, S, h) => ['Continue antiplatelet and statin; avoid hypotension.', 'Report any focal neuro change as a possible TIA/stroke; do not massage the carotid sinus.'] });
    }
  });

  // ---------- Abdominal aortic aneurysm ----------
  HX.add('aaa', {
    label: 'Abdominal Aortic Aneurysm (surveillance)', group: CV, aliases: ['aneurysm', 'aortic aneurysm', 'abdominal aortic aneurysm'], order: 50,
    desc: 'Adds a 4.6 cm infrarenal AAA under surveillance: BP control (beta blocker), statin, rupture warning signs and avoidance of straining/hypertension.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ sbp: 4 });
      if (!betaBlockerOn(spec)) home(spec, { key: 'metoprolol', name: 'metoprolol tartrate (LOPRESSOR) tablet', dose: ageDose(ctx, '25 mg', '50 mg'), route: 'Oral', freq: 'BID', cls: 'Beta blocker', sips: true, info: 'Reduces aortic wall stress. Check BP and apical HR before giving. May give with a sip of water while NPO unless told otherwise.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if HR below 55 or SBP below 100.', holdIf: ['hypotension'], indication: 'Abdominal aortic aneurysm: blood pressure and heart-rate control' });
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Abdominal aortic aneurysm / atherosclerosis' });
      homeOnce(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'Monitor for bleeding.', monitor: ['Hgb'], indication: 'Atherosclerotic disease' });
      orderOnce(spec, { name: 'AAA precautions: report severe back/abdominal pain, pulsatile mass or hypotension', category: 'Nursing', frequency: 'Continuous', instructions: 'Known 4.6 cm AAA. Sudden severe abdominal, back or flank pain, syncope, a new pulsatile mass or SBP below 90 may be rupture: keep NPO, large-bore IV access, call rapid response and the surgeon immediately. Keep SBP below 140; avoid straining (stool softener, bowel regimen).', startH: 3 });
      assess(spec, [['GI', 'Abdomen', 'Soft; mild pulsatile fullness above the umbilicus, non-tender']]);
      comorb(spec, { key: 'aaa', problem: 'Abdominal aortic aneurysm (4.6 cm)', details: 'Infrarenal AAA 4.6 cm on ultrasound, asymptomatic; surveillance imaging every 6-12 months; repair threshold 5.5 cm.', pmh: 'Abdominal aortic aneurysm, 4.6 cm (surveillance)',
        plan: () => ['Keep SBP below 140 and HR 60-80; continue beta blocker and statin.', 'Any sudden severe back/abdominal pain or hypotension: treat as possible rupture (rapid response, surgery).', 'Tell radiology/surgery about the AAA before abdominal imaging or procedures.'] });
    }
  });

  // ---------- Resistant hypertension ----------
  HX.add('resistant_htn', {
    label: 'Resistant Hypertension', group: CV, aliases: ['uncontrolled hypertension', 'difficult hypertension', 'resistant hypertension', 'refractory hypertension'], order: 52,
    desc: 'Raises baseline BP substantially and adds a four-drug regimen (ACE/ARB, amlodipine, chlorthalidone, spironolactone) with hold parameters.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ sbp: 22, dbp: 10 });
      const esrd = ctx.renal === 'esrd';
      if (!hasMed(spec, 'lisinopril') && !hasMed(spec, 'losartan') && !hasMed(spec, 'sacubitril_valsartan')) home(spec, { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'ACE inhibitor', info: 'Check BP before giving. Monitor potassium and creatinine. Watch for cough and angioedema.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and notify provider if SBP is below 100.', holdIf: ['npo', 'hypotension', 'permHTN'], holdReason: 'NPO, low blood pressure or permissive hypertension', renal: { esrd: { avoid: true } }, indication: 'Resistant hypertension' });
      homeOnce(spec, { key: 'amlodipine', name: 'amlodipine (NORVASC) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Calcium channel blocker', sips: true, info: 'Check BP before giving. Monitor for peripheral edema.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider if SBP is below 100.', holdIf: ['hypotension', 'permHTN'], holdReason: 'low blood pressure or permissive hypertension', indication: 'Resistant hypertension' });
      if (!esrd && ctx.renal === 'none') homeOnce(spec, { key: 'chlorthalidone', name: 'chlorthalidone (HYGROTON) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Thiazide-type diuretic', info: 'Monitor sodium, potassium and glucose. Can cause hyponatremia and hypokalemia; hold if volume depleted.', monitor: ['BP', 'Na', 'K'], hold: 'Hold and notify provider for SBP below 100, sodium below 133 or potassium below 3.5.', holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / volume depletion', indication: 'Resistant hypertension' });
      if (ctx.renal === 'none') homeOnce(spec, { key: 'spironolactone', name: 'spironolactone (ALDACTONE) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Mineralocorticoid antagonist / potassium-sparing diuretic', info: 'Monitor potassium and creatinine. Avoid potassium supplements and salt substitutes.', monitor: ['K', 'Cr', 'BP'], hold: 'Hold and notify provider for potassium above 5.0.', holdIf: ['npo', 'hypotension'], holdReason: 'NPO / low BP / AKI risk', indication: 'Resistant hypertension (fourth agent)' });
      order(spec, { name: 'Blood pressure check with correct cuff size and both arms on admission', category: 'Nursing', frequency: 'Every 4 hours', instructions: 'Resistant hypertension: use a correctly sized cuff, patient seated 5 minutes. Notify provider for SBP above 180 or DBP above 110, or headache, chest pain or visual change (hypertensive emergency).', startH: 3 });
      assess(spec, [['Cardiac', 'Heart Sounds', 'S1 S2 regular, prominent S4, no murmur']]);
      comorb(spec, { key: 'resistant_htn', problem: 'Resistant hypertension', details: 'BP above goal on 3-4 agents (home BP 150-160/90s); secondary causes (sleep apnea, aldosteronism) under evaluation.', pmh: 'Resistant hypertension (on 4 agents)',
        plan: (c, S, h) => [S.flag('hypotension', h) ? 'All antihypertensives held for low BP; restart one at a time as SBP recovers.' : S.flag('permHTN', h) ? 'Permissive hypertension: antihypertensives held per the stroke/neurology plan.' : S.flag('npo', h) ? 'Oral antihypertensives (except with sips) held while NPO; PRN IV agent for SBP above 180.' : 'Continue four-drug regimen; BP goal below 130/80; watch for rebound hypertension if doses are missed.'] });
    }
  });

  // ---------- Orthostatic hypotension ----------
  HX.add('orthostatic_hypotension', {
    label: 'Orthostatic Hypotension', group: CV, aliases: ['postural hypotension', 'orthostasis', 'dizziness on standing', 'syncope'], order: 50,
    desc: 'Adds midodrine and fludrocortisone, orthostatic vital signs, compression, slow position changes and a higher fall risk.',
    apply(ctx, spec) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.vitalAdjust.push({ sbp: -6, dbp: -2 });
      home(spec, { key: 'midodrine', name: 'midodrine (PROAMATINE) tablet', dose: ageDose(ctx, '5 mg', '10 mg'), route: 'Oral', freq: 'TID', at: ['0800', '1200', '1600'], cls: 'Alpha-1 agonist (vasopressor)', info: 'Give during the day only, last dose at least 4 hours before bedtime (causes supine hypertension). Check supine BP first. May cause scalp tingling, goosebumps and urinary retention.', monitor: ['BP', 'HR'],
        hold: 'Hold and notify provider for supine SBP above 160 or HR below 50.', holdIf: ['npo', 'permHTN'], holdReason: 'NPO / permissive hypertension', indication: 'Orthostatic hypotension' });
      if (!ctx.has('hf') && !ctx.has('hfpef') && !ctx.has('icd_cm')) home(spec, { key: 'fludrocortisone', name: 'fludrocortisone (FLORINEF) tablet', dose: '0.1 mg', route: 'Oral', freq: 'daily', cls: 'Mineralocorticoid', info: 'Expands volume. Monitor potassium, edema and supine BP. Can cause hypokalemia and fluid retention.', monitor: ['BP', 'K'], hold: 'Hold and notify provider for potassium below 3.5 or supine SBP above 160.', holdIf: ['npo'], holdReason: 'NPO', indication: 'Orthostatic hypotension' });
      // vasodilating/BP-lowering medications are poorly tolerated
      spec.meds.filter(m => m.home && /Alpha blocker|Nitrate/i.test(m.cls || '')).forEach(m => { m.nursing = [...(m.nursing || []), 'Orthostatic hypotension: discuss with provider before giving; check lying and standing BP.']; });
      orderOnce(spec, { name: 'Orthostatic vital signs', category: 'Nursing', frequency: 'Daily and before first ambulation', instructions: 'Lying 5 minutes, then standing at 1 and 3 minutes. Positive: SBP drop 20 or more, DBP drop 10 or more, or symptoms. Report positive result before ambulating.', startH: 3 });
      orderOnce(spec, { name: 'Slow position changes, abdominal binder / compression stockings, head of bed 30 degrees', category: 'Nursing', frequency: 'Continuous', instructions: 'Dangle at the bedside 1-2 minutes before standing; assist with the first stand; encourage fluids as permitted; elevate head of bed 30 degrees (reduces supine hypertension).', startH: 3 });
      assess(spec, [['Cardiac', 'Orthostatic BP', 'Lying 128/76, standing 98/62 with lightheadedness; recovers in 2 minutes'], ['Safety', 'Fall Precautions', 'High risk: orthostatic hypotension; assist with every transfer, bed alarm on']]);
      comorb(spec, { key: 'orthostatic_hypotension', problem: 'Orthostatic hypotension', details: 'Neurogenic orthostatic hypotension with falls; on midodrine; baseline standing SBP in the 90s.', pmh: 'Orthostatic hypotension (on midodrine)',
        plan: (c, S, h) => ['Continue midodrine daytime only; orthostatic vitals daily; assist with all standing.', S.flag('hypotension', h) ? 'Additional blood pressure support per provider; hold all antihypertensives.' : 'Maintain hydration; avoid sedatives and alpha blockers.'] });
    }
  });

  // ---------- Familial hypercholesterolemia ----------
  HX.add('fh_hld', {
    label: 'Familial Hypercholesterolemia', group: CV, aliases: ['familial hypercholesterolemia', 'fh', 'high cholesterol', 'severe hypercholesterolemia'], order: 50,
    desc: 'Adds a high-intensity statin, ezetimibe and an injectable PCSK9 inhibitor with a high LDL baseline.',
    apply(ctx, spec) {
      baseLab(spec, 'LDL cholesterol', 128, 'set'); baseLab(spec, 'Total cholesterol', 215, 'set');
      home(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'High-intensity statin. Report unexplained muscle pain or weakness, dark urine.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Familial hypercholesterolemia' });
      homeOnce(spec, { key: 'ezetimibe', name: 'ezetimibe (ZETIA) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Cholesterol absorption inhibitor', info: 'Report muscle pain or yellowing of the skin.', holdIf: ['npo'], indication: 'Familial hypercholesterolemia' });
      heldNote(spec, 'Home evolocumab (REPATHA) 140 mg SC every 14 days is not scheduled on the MAR; confirm the last dose date and give only if due, per provider.');
      assess(spec, [['Skin', 'Skin', 'Warm, dry; bilateral Achilles tendon thickening (xanthomas), mild corneal arcus']]);
      comorb(spec, { key: 'fh_hld', problem: 'Familial hypercholesterolemia', details: 'Heterozygous familial hypercholesterolemia (untreated LDL above 190 mg/dL); on high-intensity statin, ezetimibe and a PCSK9 inhibitor; strong family history of early CAD.', pmh: 'Familial hypercholesterolemia (heterozygous)',
        plan: () => ['Continue lipid-lowering therapy when taking PO; PCSK9 injection only if due (every 14 days).', 'Report muscle pain or weakness; family screening is recommended.'] });
    }
  });

  // ---------- Hypertriglyceridemia ----------
  HX.add('hypertg', {
    label: 'Hypertriglyceridemia', group: CV, aliases: ['high triglycerides', 'hypertriglyceridemia', 'triglycerides'], order: 50,
    desc: 'Adds a high triglyceride baseline, fenofibrate and icosapent ethyl, low-fat diet, and pancreatitis risk.',
    apply(ctx, spec) {
      baseLab(spec, 'Triglycerides', 480, 'set');
      homeOnce(spec, { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '40 mg', route: 'Oral', freq: 'qHS', cls: 'Statin', info: 'Report unexplained muscle pain or weakness.', monitor: ['LFT'], holdIf: ['npo'], indication: 'Hyperlipidemia' });
      home(spec, { key: 'fenofibrate', name: 'fenofibrate (TRICOR) tablet', dose: '145 mg', route: 'Oral', freq: 'daily', cls: 'Fibrate', info: 'Report muscle pain, abdominal pain or dark urine. Can raise creatinine; avoid in severe kidney disease. Increases the effect of warfarin.', monitor: ['LFT', 'Cr'], holdIf: ['npo'], renal: { ckd3: { dose: '48 mg', note: 'Reduced dose for reduced GFR.' }, esrd: { avoid: true } }, indication: 'Hypertriglyceridemia' });
      home(spec, { key: 'icosapent_ethyl', name: 'icosapent ethyl (VASCEPA) capsule', dose: '2 g', route: 'Oral', freq: 'BID', cls: 'Omega-3 fatty acid', info: 'Give with food. May increase bleeding risk with anticoagulants; report palpitations (atrial fibrillation).', holdIf: ['npo'], indication: 'Hypertriglyceridemia' });
      sticky(spec, 'Triglyceride level', 'Baseline triglycerides about 480 mg/dL. A level above 1,000 raises the risk of acute pancreatitis: report severe epigastric pain radiating to the back. Propofol and IV lipid emulsions raise triglycerides further.');
      comorb(spec, { key: 'hypertg', problem: 'Hypertriglyceridemia', details: 'Triglycerides about 480 mg/dL on fibrate, omega-3 and statin; risk of pancreatitis if above 1,000.', pmh: 'Hypertriglyceridemia (about 480 mg/dL)',
        plan: () => ['Continue lipid-lowering therapy when taking PO; low-fat, low-simple-sugar diet.', 'Avoid IV lipid emulsions and propofol when possible; check lipase for abdominal pain.'] });
    }
  });

  // ---------- Respiratory helpers ----------
  const albuterolPRN = (spec, why) => homeOnce(spec, { key: 'albuterol_prn', name: 'albuterol (PROVENTIL) nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'wheezing or shortness of breath', cls: 'Short-acting bronchodilator', info: 'Check HR before and after; may cause tremor and tachycardia.', monitor: ['HR', 'SPO2'], indication: why });
  // Patients on home oxygen never go back to room air: replace "Room air" in the diagnosis profile's oxygen course with the home flow rate.
  const applyHomeO2 = (spec, flow) => {
    spec.baseO2 = flow;
    const lpm = s => { const m = /(\d+(?:\.\d+)?)\s*L/i.exec(s || ''); return m ? parseFloat(m[1]) : null; };
    const base = lpm(flow);
    spec.vitals.forEach(v => {
      if (!v.o2) return;
      if (/^room air/i.test(v.o2)) v.o2 = flow;
      else if (/nasal cannula/i.test(v.o2) && lpm(v.o2) !== null && base !== null && lpm(v.o2) < base) v.o2 = flow;
    });
    if (!spec.vitals.some(v => v.o2 && v.h <= 0)) { spec.vitals.push({ h: -1, o2: flow }); spec.vitals.sort((a, b) => a.h - b.h); }
    spec.devices.filter(d => /nasal cannula/i.test(d.type || '')).forEach(d => {
      delete d.removeH;
      if (d.infusing && lpm(d.infusing) !== null && base !== null && lpm(d.infusing) < base) d.infusing = `Oxygen ${flow}`;
    });
  };

  // ---------- Interstitial lung disease ----------
  HX.add('ild', {
    label: 'Interstitial Lung Disease / Pulmonary Fibrosis', group: RS, aliases: ['ipf', 'idiopathic pulmonary fibrosis', 'pulmonary fibrosis', 'interstitial lung disease', 'fibrosis'], order: 50,
    desc: 'Adds an antifibrotic (pirfenidone or nintedanib), Velcro crackles, lower baseline SpO2 and RR, oxygen titration and a low reserve for hypoxia.',
    apply(ctx, spec) {
      spec.rt = true;
      spec.vitalAdjust.push({ spo2: -4, rr: 3 });
      const pirf = ctx.age % 2 === 0;
      if (pirf) home(spec, { key: 'pirfenidone', name: 'pirfenidone (ESBRIET) tablet', dose: '801 mg', route: 'Oral', freq: 'TID', at: ['0800', '1300', '1800'], cls: 'Antifibrotic', info: 'Give WITH food to reduce nausea. Causes photosensitivity (cover skin), nausea, and elevated liver enzymes. Hold if the patient is not eating.', monitor: ['LFT'], hold: 'Hold and notify provider for ALT more than 3 times normal or if NPO.', holdIf: ['npo'], holdReason: 'NPO (give with meals)', indication: 'Idiopathic pulmonary fibrosis' });
      else home(spec, { key: 'nintedanib', name: 'nintedanib (OFEV) capsule', dose: '150 mg', route: 'Oral', freq: 'BID', at: ['0900', '2100'], cls: 'Antifibrotic (tyrosine kinase inhibitor)', info: 'Give WITH food; swallow whole. Causes diarrhea, nausea and elevated liver enzymes; small increase in bleeding risk with anticoagulants. Handle with gloves if the capsule is open.', monitor: ['LFT', 'Hgb'], hold: 'Hold and notify provider for ALT more than 3 times normal, severe diarrhea or bleeding, or if NPO.', holdIf: ['npo'], holdReason: 'NPO (give with meals)', indication: 'Idiopathic pulmonary fibrosis' });
      homeOnce(spec, { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) tablet', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'Proton pump inhibitor', info: 'Give 30-60 minutes before breakfast. Treats reflux (micro-aspiration worsens fibrosis).', variants: { npo: { name: 'pantoprazole (PROTONIX) injection', route: 'IV' } }, indication: 'GERD with pulmonary fibrosis' });
      albuterolPRN(spec, 'Dyspnea');
      orderOnce(spec, { name: 'Oxygen titration for pulmonary fibrosis (SpO2 goal 90% or higher)', category: 'Respiratory', frequency: 'Continuous, titrate', instructions: 'Little respiratory reserve: desaturates quickly with activity or lying flat. Titrate nasal cannula to SpO2 90-94%; check SpO2 during ambulation and with repositioning. Notify provider for SpO2 below 88% on 6 L, RR above 28 or acute worsening (possible acute exacerbation, infection or PE).', startH: 3 });
      orderOnce(spec, { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', instructions: 'RT to assess, titrate oxygen, review pulmonary rehabilitation breathing techniques.', startH: 3 });
      assess(spec, [['Respiratory', 'Breath Sounds', 'Bibasilar fine end-inspiratory "Velcro" crackles, no wheeze'], ['Respiratory', 'Respiratory Effort', 'Mild dyspnea with exertion, speaks in full sentences at rest'], ['Respiratory', 'Cough', 'Dry, non-productive'], ['Skin', 'Skin', 'Warm, dry; mild digital clubbing']]);
      comorb(spec, { key: 'ild', problem: 'Interstitial lung disease (idiopathic pulmonary fibrosis)', details: 'Usual interstitial pneumonia pattern on CT; FVC about 65% predicted, DLCO 45%; on an antifibrotic; resting SpO2 about 92-94%, desaturates to 86-88% with exertion.', pmh: 'Idiopathic pulmonary fibrosis (FVC 65% predicted)',
        plan: (c, S, h) => [S.flag('npo', h) ? 'Antifibrotic held while NPO (give with food); resume with meals.' : 'Continue antifibrotic with meals; reflux precautions (HOB 30 degrees).', 'Titrate oxygen to SpO2 90% or higher; check saturation with activity.', 'Avoid fluid overload and excess sedatives; escalate early for worsening hypoxia.'] });
    }
  });

  // ---------- Chronic respiratory failure on home oxygen ----------
  HX.add('home_o2', {
    label: 'Chronic Respiratory Failure on Home Oxygen', group: RS, aliases: ['home oxygen', 'home o2', 'oxygen dependent', 'chronic hypoxemia', 'oxygen therapy', 'chronic respiratory failure'], order: 49,
    desc: 'Adds baseline home oxygen (2-3 L nasal cannula, never room air), an SpO2 goal (88-92% with COPD, otherwise 90-94%), oxygen safety orders and a lower baseline SpO2.',
    apply(ctx, spec) {
      const flow = spec.baseO2 || (ctx.age % 3 === 0 ? '3 L nasal cannula' : '2 L nasal cannula');
      const copdLike = ctx.has('copd') || spec.primaryKey === 'copd_exac';
      const goal = copdLike ? '88-92%' : '90-94%';
      spec.rt = true;
      spec.vitalAdjust.push({ spo2: copdLike ? -2 : -6, rr: 1, hr: 2 });
      baseLab(spec, 'Hemoglobin', ctx.female ? 13.8 : 15.0, 'max');
      applyHomeO2(spec, flow);
      device(spec, { deviceType: 'Tube', type: 'Nasal cannula (oxygen)', location: 'Nares', siteMarker: 'nares', status: 'In place', infusing: `Oxygen ${flow.replace(' nasal cannula', '')} (home flow)`, assess: 'nares intact, humidified, skin behind ears intact' });
      orderOnce(spec, { name: `Home oxygen: continue ${flow.replace(' nasal cannula', ' by nasal cannula')} continuously, SpO2 goal ${goal}`, category: 'Respiratory', frequency: 'Continuous, titrate', instructions: `Never leave the patient on room air: baseline resting SpO2 is ${copdLike ? '88-92' : '90-94'}% on ${flow.replace(' nasal cannula', '')}. Titrate to the goal; do not exceed it${copdLike ? ' (CO2 retention risk: drowsiness, headache, confusion)' : ''}. Notify provider for SpO2 below ${copdLike ? '88' : '90'}% on 6 L, new need for more than 2 L above baseline, or increased work of breathing.`, startH: 0.3, nursing: [`Goal SpO2 ${goal}; ${copdLike ? 'avoid over-oxygenation' : 'check with ambulation and sleep'}.`] });
      orderOnce(spec, { name: 'Oxygen safety: no smoking, open flames or petroleum products', category: 'Precautions', frequency: 'Continuous', instructions: 'Oxygen supports combustion. No smoking or open flame in the room, no petroleum-based lotions on lips or nares (use water-based), check tubing for kinks and the portable tank for pressure before transport.', startH: 3 });
      orderOnce(spec, { name: 'Continuous pulse oximetry', category: 'Nursing', frequency: 'Continuous', instructions: `Alarm limits SpO2 below ${copdLike ? '88' : '90'}%. Check nares and ears for pressure injury from the cannula every shift.`, startH: 3 });
      orderOnce(spec, { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', instructions: 'RT to assess, titrate oxygen and check home oxygen equipment and portable concentrator needs before discharge.', startH: 3 });
      assess(spec, [['Respiratory', 'Respiratory Effort', 'Mild increased work of breathing with exertion; speaks in full sentences'], ['Skin', 'Skin', 'Warm, dry; skin behind ears and nares intact under cannula']]);
      comorb(spec, { key: 'home_o2', problem: 'Chronic respiratory failure on home oxygen', details: `Chronic hypoxemic respiratory failure on ${flow.replace(' nasal cannula', '')} continuous home oxygen; resting SpO2 ${copdLike ? '88-92' : '90-94'}%; mild secondary erythrocytosis.`, pmh: `Chronic respiratory failure on home oxygen (${flow.replace(' nasal cannula', '')})`,
        plan: () => [`Continue oxygen at baseline flow; SpO2 goal ${goal}; never room air.`, 'Oxygen safety counseling; confirm portable oxygen for discharge/transport.', copdLike ? 'Watch for CO2 retention if oxygen is increased.' : 'Reassess qualifying saturation (walk test) before discharge.'] });
    }
  });

  // ---------- Bronchiectasis ----------
  HX.add('bronchiectasis', {
    label: 'Bronchiectasis', group: RS, aliases: ['bronchiectasis', 'chronic productive cough', 'airway clearance'], order: 50,
    desc: 'Adds hypertonic saline nebulizer with airway clearance, PRN albuterol, daily sputum, Pseudomonas history and a lower SpO2.',
    apply(ctx, spec) {
      spec.rt = true;
      spec.vitalAdjust.push({ spo2: -2, rr: 1 });
      albuterolPRN(spec, 'Bronchiectasis (also given before hypertonic saline)');
      home(spec, { key: 'hypertonic_saline', name: 'sodium chloride 7% nebulizer solution', dose: '4 mL', route: 'Nebulized', freq: 'BID', cls: 'Mucolytic / osmotic airway clearance', info: 'Give after albuterol (can trigger bronchospasm), then do airway clearance (oscillating PEP device or chest physiotherapy). Watch for cough, chest tightness and wheeze.', monitor: ['SPO2', 'RR'], hold: 'Hold and notify provider for new wheeze, SpO2 below 90% or severe bronchospasm.', indication: 'Bronchiectasis airway clearance' });
      orderOnce(spec, { name: 'Airway clearance (oscillating PEP device / chest physiotherapy) twice daily', category: 'Respiratory', frequency: 'BID and PRN', instructions: 'After the nebulizer: 10-15 minutes of PEP device breathing, huff coughing, and postural drainage as tolerated. Record sputum amount, color and consistency.', startH: 3 });
      orderOnce(spec, { name: 'Sputum culture (history of Pseudomonas)', category: 'Laboratory', frequency: 'Once', instructions: 'Collect an expectorated sputum sample before the first antibiotic dose if possible. Prior cultures grew Pseudomonas aeruginosa: antibiotic coverage per provider.', startH: 3 });
      heldNote(spec, 'Home azithromycin 500 mg three times a week (macrolide prophylaxis) is not ordered separately while inpatient antibiotics are active; pharmacy to review QT and duplication.');
      assess(spec, [['Respiratory', 'Breath Sounds', 'Coarse crackles and scattered rhonchi in both lower lobes'], ['Respiratory', 'Cough', 'Productive, about 30 mL/day thick yellow-green sputum']]);
      sticky(spec, 'Bronchiectasis', 'Chronic productive cough. Prior sputum grew Pseudomonas aeruginosa: if antibiotics are needed, discuss antipseudomonal coverage. Airway clearance twice daily is part of treatment, not optional.');
      comorb(spec, { key: 'bronchiectasis', problem: 'Bronchiectasis', details: 'Non-CF bronchiectasis (lower lobes), chronic Pseudomonas colonization, 1-2 exacerbations per year.', pmh: 'Bronchiectasis (chronic Pseudomonas colonization)',
        plan: () => ['Continue hypertonic saline with airway clearance twice daily; albuterol PRN and before saline.', 'Sputum culture; antibiotics per provider (cover Pseudomonas if exacerbation).', 'Hydration and early mobilization help mobilize secretions.'] });
    }
  });

  // ---------- Sarcoidosis ----------
  HX.add('sarcoid', {
    label: 'Pulmonary Sarcoidosis', group: RS, aliases: ['sarcoidosis', 'sarcoid'], order: 50,
    desc: 'Adds maintenance prednisone (no abrupt stop; IV conversion if NPO), upper-normal calcium, mild hyperglycemia and a mild dry cough.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ spo2: -1 });
      baseLab(spec, 'Calcium', 10.1, 'max');
      baseLab(spec, 'Glucose', 112, 'max');
      home(spec, { key: 'prednisone', name: 'prednisone tablet', dose: '10 mg', route: 'Oral', freq: 'daily', cls: 'Corticosteroid', sips: true, info: 'Give with food in the morning. Do NOT stop abruptly (adrenal suppression): if strictly NPO convert to IV methylprednisolone 8 mg. Monitor glucose, BP and mood; infection risk.', monitor: ['Glucose', 'BP'], hold: 'Never skip without a provider order. Notify provider for glucose above 250 or signs of infection.', variants: { npo: { name: 'methylprednisolone (SOLU-MEDROL) injection', dose: '8 mg', route: 'IV' } }, indication: 'Pulmonary sarcoidosis (maintenance)' });
      heldNote(spec, 'Home methotrexate (weekly) not ordered this admission unless the provider confirms the dose day; calcium and vitamin D supplements held (hypercalcemia risk in sarcoidosis).');
      sticky(spec, 'Steroid-dependent', 'Long-term prednisone: suppressed adrenal response. Hypotension or sepsis may need stress-dose steroids; never stop prednisone abruptly. Sarcoid can raise calcium: do not give calcium or vitamin D without checking the level.');
      assess(spec, [['Respiratory', 'Breath Sounds', 'Clear to scattered fine crackles at the bases'], ['Respiratory', 'Cough', 'Mild dry cough']]);
      comorb(spec, { key: 'sarcoid', problem: 'Pulmonary sarcoidosis', details: 'Stage II pulmonary sarcoidosis (hilar adenopathy with parenchymal opacities) on maintenance prednisone 10 mg.', pmh: 'Pulmonary sarcoidosis (stage II) on prednisone',
        plan: (c, S, h) => ['Continue prednisone daily (IV methylprednisolone equivalent if strictly NPO); do not stop abruptly.', 'Check calcium; monitor glucose on steroids; consider stress-dose steroids for hypotension or sepsis.'] });
    }
  });

  // ---------- Cystic fibrosis (adult) ----------
  HX.add('cf_adult', {
    label: 'Cystic Fibrosis (adult)', group: RS, aliases: ['cystic fibrosis', 'cf'], order: 50,
    desc: 'Adds CFTR modulator, pancrelipase with meals, dornase alfa and hypertonic saline nebulizers, ADEK vitamins, contact precautions, and a lower SpO2.',
    apply(ctx, spec) {
      spec.rt = true;
      spec.vitalAdjust.push({ spo2: -3, rr: 1 });
      if (!spec.isolation || spec.isolation === 'None') spec.isolation = 'Contact precautions';
      home(spec, { key: 'trikafta', name: 'elexacaftor-tezacaftor-ivacaftor (TRIKAFTA) tablets', dose: '2 tablets (100/50/75 mg) in the morning; 1 ivacaftor 150 mg tablet in the evening', route: 'Oral', freq: 'BID', at: ['0900', '2100'], cls: 'CFTR modulator', highAlert: true, sips: true,
        info: 'Give with fat-containing food. Avoid grapefruit and CYP3A inducers/inhibitors (check new antibiotics and antifungals with pharmacy). Monitor liver enzymes; cataract and mood changes reported.', monitor: ['LFT'], hold: 'Hold and notify provider for ALT more than 5 times normal.', indication: 'Cystic fibrosis (F508del)' });
      home(spec, { key: 'pancrelipase', name: 'pancrelipase (CREON) 36,000 unit capsule', dose: '3 capsules with meals (1-2 with snacks)', route: 'Oral', freq: 'AC', cls: 'Pancreatic enzyme', info: 'Give at the START of each meal or snack; swallow whole or open onto applesauce, never crush or chew. Missed enzymes cause steatorrhea and weight loss. Do not give if not eating.', holdIf: ['npo'], holdReason: 'NPO (give only with meals)', indication: 'Pancreatic insufficiency (CF)' });
      home(spec, { key: 'dornase', name: 'dornase alfa (PULMOZYME) nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'daily', cls: 'Mucolytic (DNase)', info: 'Use the jet nebulizer ordered by RT; do not mix with other solutions. May cause voice change or sore throat.', monitor: ['SPO2'], indication: 'Cystic fibrosis airway clearance' });
      home(spec, { key: 'hypertonic_saline', name: 'sodium chloride 7% nebulizer solution', dose: '4 mL', route: 'Nebulized', freq: 'BID', cls: 'Mucolytic / osmotic airway clearance', info: 'Give after albuterol (can trigger bronchospasm), then airway clearance. Watch for cough and wheeze.', monitor: ['SPO2', 'RR'], indication: 'Cystic fibrosis airway clearance' });
      albuterolPRN(spec, 'Cystic fibrosis (also given before hypertonic saline)');
      home(spec, { key: 'adek_vitamin', name: 'multivitamin with vitamins A, D, E and K (ADEK) softgel', dose: '1 capsule', route: 'Oral', freq: 'daily', cls: 'Fat-soluble vitamins', info: 'Give with a fat-containing meal and pancreatic enzymes.', holdIf: ['npo'], indication: 'Cystic fibrosis (fat-soluble vitamin deficiency)' });
      orderOnce(spec, { name: 'Airway clearance (vest / oscillating PEP device) twice daily', category: 'Respiratory', frequency: 'BID and PRN', instructions: 'After the nebulizers: 20-30 minutes of airway clearance and huff coughing. Record sputum.', startH: 3 });
      orderOnce(spec, { name: 'High-calorie, high-salt nutrition with enzymes; dietitian consult', category: 'Nursing', frequency: 'Every meal', instructions: 'Needs 120-150% of usual calories and extra salt in heat or with fever. Give pancrelipase with every meal and snack. Weigh twice weekly.', startH: 3 });
      orderOnce(spec, { name: 'Sputum culture (CF)', category: 'Laboratory', frequency: 'Once', instructions: 'Send an expectorated sputum for culture and sensitivity. Chronic organisms may include Pseudomonas or MRSA; antibiotic choice per provider and prior cultures.', startH: 3 });
      heldNote(spec, 'Avoid contact with other patients who have cystic fibrosis (cross-infection); private room, contact precautions per policy.');
      assess(spec, [['Respiratory', 'Breath Sounds', 'Coarse crackles and rhonchi bilaterally, upper lobes greater than bases'], ['Respiratory', 'Cough', 'Productive, thick yellow-green sputum'], ['GI', 'Abdomen', 'Soft, non-tender; mild bloating, bulky stools at baseline']]);
      comorb(spec, { key: 'cf_adult', problem: 'Cystic fibrosis (adult)', details: 'F508del cystic fibrosis with pancreatic insufficiency on a CFTR modulator; FEV1 about 55% predicted; chronic airway colonization.', pmh: 'Cystic fibrosis (pancreatic insufficient, FEV1 about 55%)',
        plan: (c, S, h) => ['Continue CFTR modulator with fat-containing food; enzymes with every meal or snack.', 'Airway clearance twice daily; separate from other CF patients; sputum culture to guide antibiotics.', S.flag('npo', h) ? 'NPO: enzymes held while not eating; dietitian for nutrition support if NPO is prolonged.' : 'High-calorie diet; monitor glucose (CF-related diabetes risk).'] });
    }
  });

  // ---------- Prior tuberculosis ----------
  HX.add('prior_tb', {
    label: 'Prior Tuberculosis (treated)', group: RS, aliases: ['tuberculosis', 'tb', 'old tb', 'treated tb'], order: 50,
    desc: 'History only: completed treatment years ago with upper-lobe scarring; adds a note to consider TB again for new fever, night sweats or hemoptysis.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ spo2: -1 });
      sticky(spec, 'Prior treated TB', 'Pulmonary TB treated to completion years ago. If this admission includes cough over 3 weeks, night sweats, weight loss or hemoptysis, ask the provider about airborne isolation and TB testing. Baseline chest film shows right upper lobe scarring.');
      assess(spec, [['Respiratory', 'Breath Sounds', 'Diminished at the right apex, otherwise clear']]);
      comorb(spec, { key: 'prior_tb', problem: 'History of pulmonary tuberculosis (treated)', details: 'Completed 6 months of four-drug therapy; residual right upper lobe fibrosis; no active disease; QuantiFERON positive at baseline.', pmh: 'Pulmonary tuberculosis, treated to completion (right upper lobe scarring)',
        plan: () => ['No current treatment; baseline apical scarring on chest imaging.', 'Consider airborne isolation and TB work-up only if new cough over 3 weeks, night sweats, weight loss or hemoptysis.', 'Interferon-gamma release assay will remain positive; do not use a skin test to screen.'] });
    }
  });

  // ---------- Lung nodule ----------
  HX.add('lung_nodule', {
    label: 'Pulmonary Nodule (under surveillance)', group: RS, aliases: ['lung nodule', 'pulmonary nodule', 'lung spot', 'nodule'], order: 50,
    desc: 'History only: 8 mm right upper lobe nodule followed with CT; adds a surveillance problem and discharge follow-up reminder.',
    apply(ctx, spec) {
      sticky(spec, 'Lung nodule follow-up', 'Incidental 8 mm right upper lobe nodule, stable at last CT. Needs scheduled follow-up CT chest; make sure the discharge summary lists it.');
      comorb(spec, { key: 'lung_nodule', problem: 'Pulmonary nodule under surveillance', details: '8 mm solid right upper lobe nodule found incidentally; follow-up low-dose CT due in 6-12 months; no biopsy yet.', pmh: 'Pulmonary nodule, 8 mm right upper lobe (surveillance)',
        plan: () => ['No inpatient treatment; include the nodule in the discharge follow-up plan (CT chest in 6-12 months).', 'Smoking cessation counseling if applicable.'] });
    }
  });
})();

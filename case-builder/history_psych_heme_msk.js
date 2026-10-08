/* Medical-history modules: psychiatric / substance use, hematology / oncology, infectious disease / immunologic.
   Registered with NS.HX.add (see history.js). Each module adds typical home medications, baseline lab shifts, orders, a baseline assessment
   and a problem-list entry whose plan says what happens to the condition during THIS admission. Educational defaults, not rules about every patient. */
NS.HX.phm = (() => {
  const H = NS.HX.helpers;
  const addLab = (name, def) => { NS.LABS.C[name] = NS.LABS.C[name] || def; };
  addLab('Absolute neutrophil count', { cat: 'CBC', units: 'K/uL', ref: [1.5, 8], dec: 1, base: 4.2, crit: [0.5, null] });
  addLab('Valproic acid level', { cat: 'Drug level', units: 'mcg/mL', ref: [50, 100], dec: 0, base: 72, crit: [null, 150] });
  addLab('CD4 count', { cat: 'Other', units: 'cells/uL', ref: [500, 1500], dec: 0, base: 650 });
  addLab('HIV-1 RNA viral load', { cat: 'Other', units: 'copies/mL', ref: [0, 20], dec: 0, base: 0 });
  addLab('Hemoglobin S', { cat: 'CBC', units: '%', ref: [0, 0], dec: 0, base: 0 });
  addLab('PSA', { cat: 'Other', units: 'ng/mL', ref: [0, 4], dec: 1, base: 1.2 });
  addLab('Immunoglobulin G', { cat: 'Other', units: 'mg/dL', ref: [700, 1600], dec: 0, base: 1050, crit: [null, null] });
  addLab('Total protein', { cat: 'Hepatic', units: 'g/dL', ref: [6.0, 8.3], dec: 1, base: 7.0 });

  // Baseline 12-lead ECG with QTc, skipped when the diagnosis already has an early ECG.
  const ecg = (spec, qtc, indication, rhythm) => {
    if (spec.events.some(e => e.type === 'cardiology' && /ECG/i.test(e.study || '') && e.h < 8)) return;
    spec.events.push({ type: 'cardiology', h: 3.4, study: '12-lead ECG', label: 'ECG: baseline QTc', indication, impression: `${rhythm || 'Normal sinus rhythm'}. QTc ${qtc} ms. No acute ST-T wave changes.` });
  };
  // Implanted venous port (not duplicated if surgical history already added one).
  const port = (spec, assess, status) => {
    if (spec.devices.some(d => /venous port/i.test(d.type))) return;
    spec.devices.push({ deviceType: 'Tube', type: 'Implanted venous port (single lumen)', location: 'Right upper chest', siteMarker: 'chestRight', placeH: -24 * 90, preexisting: true, status: status || 'De-accessed', assess: assess || 'pocket intact and non-tender, no erythema or swelling; not accessed' });
    H.order(spec, { name: 'Implanted port: access and flush', category: 'Nursing', frequency: 'With each use', instructions: 'Access only with a non-coring (Huber) needle, sterile technique and mask; confirm blood return. Flush 10 mL normal saline before and after use, heparin lock per policy; change needle every 7 days if left accessed. Fever, chills or site redness: blood cultures from the port and a peripheral site, notify provider.', startH: 3 });
  };
  return { addLab, ecg, port };
})();

(() => {
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = NS.HX.helpers;
  const P = NS.HX.phm;
  const add = NS.HX.add;
  const G = 'Psychiatric / Substance Use';
  const SI = ['Safety', 'Suicide Risk Screen', 'Screen negative; patient denies suicidal or homicidal thoughts'];

  // ---------- Bipolar disorder ----------
  add('bipolar', {
    label: 'Bipolar Disorder', group: G, aliases: ['bipolar', 'manic depression', 'lithium', 'mania'], order: 40,
    desc: 'Adds a mood stabilizer (lithium with level monitoring, or lamotrigine/valproate) plus quetiapine; lithium NSAID/ACE-I/dehydration cautions; mood and safety screening.',
    apply(ctx, spec) {
      const pk = spec.primaryKey;
      const useLamotrigine = ctx.female && ctx.age < 45;
      const useValproate = !useLamotrigine && (ctx.renal !== 'none' || ctx.age >= 70 || ctx.age % 2 === 1);
      if (useLamotrigine) {
        home(spec, { key: 'lamotrigine', name: 'lamotrigine (LAMICTAL) tablet', dose: ctx.age % 2 ? '100 mg' : '150 mg', route: 'Oral', freq: 'BID', cls: 'Mood stabilizer / anticonvulsant', sips: true, info: 'Do not stop abruptly. If 5 or more days of doses are missed, the drug must be re-titrated from the starting dose (rash risk). Report any new rash immediately (Stevens-Johnson syndrome).', monitor: ['BP'], hold: 'Do not hold without calling the provider; report new rash, fever or mucosal sores.', indication: 'Bipolar I disorder maintenance' });
        home(spec, { key: 'quetiapine', name: 'quetiapine (SEROQUEL) tablet', dose: '100 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', sips: true, info: 'Sedating; orthostatic hypotension and QT prolongation. Check BP before giving. Metabolic monitoring.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for SBP below 95, excessive sedation or QTc above 500 ms.', indication: 'Bipolar disorder' });
      } else if (useValproate) {
        home(spec, { key: 'divalproex', name: 'divalproex ER (DEPAKOTE ER) tablet', dose: ctx.age % 3 ? '1,000 mg' : '1,500 mg', route: 'Oral', freq: 'qHS', cls: 'Mood stabilizer / anticonvulsant', sips: true, info: 'Swallow whole; do not crush. Monitor valproate level, platelets, liver tests and ammonia (confusion, vomiting). Increases bleeding risk. Do not stop abruptly.', monitor: ['Plt', 'LFT'], hold: 'Notify provider for platelets below 100, new confusion, vomiting or jaundice.', renal: { esrd: { dose: '500 mg', note: 'Dose reduced for ESRD; follow free valproate level.' } }, indication: 'Bipolar disorder maintenance' });
        home(spec, { key: 'quetiapine', name: 'quetiapine (SEROQUEL) tablet', dose: '200 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', sips: true, info: 'Sedating; orthostatic hypotension and QT prolongation. Check BP before giving. Metabolic monitoring.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for SBP below 95, excessive sedation or QTc above 500 ms.', indication: 'Bipolar disorder' });
        spec.labBase['Valproic acid level'] = 78;
        spec.labBase.Platelets = (ctx.female ? 205 : 190);
        addLabs(spec, 0.5, ['Valproic acid level', 'ALT', 'Ammonia']);
      } else {
        const heldForAki = pk === 'aki';
        home(spec, { key: 'lithium', name: 'lithium carbonate ER (LITHOBID) tablet', dose: ctx.age >= 60 ? '450 mg' : '600 mg', route: 'Oral', freq: 'BID', cls: 'Mood stabilizer', sips: true, when: !heldForAki, info: 'NARROW therapeutic index (0.6-1.2 mmol/L; 12-hour trough). Keep hydrated and on a steady sodium intake. Avoid NSAIDs, ACE inhibitors/ARBs and thiazide diuretics (raise lithium level). Toxicity: coarse tremor, vomiting, diarrhea, confusion, ataxia.', monitor: ['Cr', 'Na'], hold: 'Hold and notify provider for vomiting, diarrhea, poor oral intake, new coarse tremor, confusion or creatinine rise.', renal: { ckd3: { dose: '300 mg', note: 'Dose reduced for CKD; level every 3 days.' }, esrd: { avoid: true, sub: { key: 'quetiapine_mood', name: 'quetiapine (SEROQUEL) tablet', dose: '200 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', info: 'Lithium avoided in ESRD; mood stabilization with quetiapine.', monitor: ['BP', 'HR'] } } }, indication: 'Bipolar I disorder maintenance' });
        home(spec, { key: 'quetiapine', name: 'quetiapine (SEROQUEL) tablet', dose: '50 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', sips: true, info: 'Sedating; orthostatic hypotension and QT prolongation. Check BP before giving.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for SBP below 95 or excessive sedation.', indication: 'Bipolar disorder adjunct / sleep' });
        spec.labBase['Lithium level'] = heldForAki ? 1.5 : 0.8;
        spec.labBase.TSH = 3.8;
        addLabs(spec, 0.5, ['Lithium level', 'TSH']);
        addLabs(spec, 30.5, ['Lithium level']);
        addLabs(spec, 78.5, ['Lithium level']);
        order(spec, { name: 'Lithium safety: level monitoring and nephrotoxin/NSAID avoidance', category: 'Nursing', frequency: 'Continuous', instructions: 'Lithium level 12 hours after the last dose (before the morning dose), with creatinine and sodium. Question any NSAID (ketorolac, ibuprofen), ACE inhibitor/ARB or thiazide order and notify the provider. Encourage 2-3 L of fluid daily unless restricted.', startH: 3, nursing: ['Hold the lithium dose and call the provider for vomiting, diarrhea, NPO with poor intake, tremor, ataxia or confusion; dehydration raises lithium levels.'] });
        if (heldForAki) heldNote(spec, 'Lithium held for acute kidney injury; level pending (risk of lithium toxicity).');
      }
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + (useLamotrigine ? 0 : 1);
      order(spec, { name: 'Mood and suicide risk screening', category: 'Nursing', frequency: 'Every shift', instructions: 'Screen mood, sleep and suicidal ideation per policy (C-SSRS or facility tool). Keep stimulation low; watch for emerging mania (decreased need for sleep, pressured speech) or depression.', startH: 3 });
      assess(spec, [['Neurologic', 'Mood / Affect', 'Calm, euthymic mood, congruent affect; speech normal rate'], SI]);
      comorb(spec, {
        key: 'bipolar', problem: 'Bipolar disorder', details: useLamotrigine ? 'Bipolar disorder on lamotrigine and quetiapine.' : useValproate ? 'Bipolar disorder on divalproex ER and quetiapine.' : 'Bipolar I disorder on lithium and low-dose quetiapine; stable.', pmh: 'Bipolar disorder',
        plan: (c, S, h) => [useLamotrigine ? 'Continue lamotrigine (re-titrate if 5+ days missed) and quetiapine; give with sips if NPO.' : useValproate ? 'Continue divalproex ER and quetiapine; follow valproate level, platelets, LFTs and ammonia.' : (pk === 'aki' ? 'Lithium HELD for acute kidney injury; trend level and creatinine; psychiatry consult for alternative stabilizer.' : 'Continue lithium (give with sips if NPO) unless vomiting, dehydrated or creatinine rising; 12-hour level and creatinine, avoid NSAIDs/ACE inhibitors.'), 'Maintain sleep routine; screen mood and suicide risk each shift.']
      });
      if (ctx.has('htn')) sticky(spec, 'Lithium interaction', 'Lithium plus ACE inhibitor/ARB or thiazide raises lithium levels. Review the antihypertensive and lithium level with pharmacy.');
    }
  });

  // ---------- Schizophrenia ----------
  add('schizophrenia', {
    label: 'Schizophrenia', group: G, aliases: ['psychosis', 'schizoaffective', 'antipsychotic', 'clozapine'], order: 40,
    desc: 'Adds an antipsychotic (olanzapine, risperidone, aripiprazole or clozapine), baseline QTc ECG, mild hyperglycemia/lipid effects and psychosis-safe care.',
    apply(ctx, spec) {
      const v = ctx.age % 4;
      if (v === 0) {
        home(spec, { key: 'olanzapine', name: 'olanzapine (ZYPREXA) tablet', dose: '15 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', sips: true, info: 'Sedating; weight gain, hyperglycemia and hyperlipidemia. Orthostatic hypotension. Do not stop abruptly. Do not combine IM olanzapine with IM/IV benzodiazepines.', monitor: ['BP', 'Glucose'], hold: 'Hold and notify provider for SBP below 95, oversedation or RR below 12.', indication: 'Schizophrenia' });
        spec.labBase.Glucose = 118;
      } else if (v === 1) {
        home(spec, { key: 'risperidone', name: 'risperidone (RISPERDAL) tablet', dose: '2 mg', route: 'Oral', freq: 'BID', cls: 'Atypical antipsychotic', sips: true, info: 'Orthostatic hypotension, QT prolongation, elevated prolactin and extrapyramidal symptoms. Do not stop abruptly.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for SBP below 95 or QTc above 500 ms.', renal: { ckd3: { dose: '1 mg', note: 'Dose reduced for CKD.' }, esrd: { dose: '1 mg', note: 'Dose reduced for ESRD.' } }, indication: 'Schizophrenia' });
        spec.labBase.Glucose = 108;
      } else if (v === 2) {
        home(spec, { key: 'aripiprazole', name: 'aripiprazole (ABILIFY) tablet', dose: '15 mg', route: 'Oral', freq: 'daily', cls: 'Atypical antipsychotic', sips: true, info: 'Akathisia (restlessness) and QT effects are possible; metabolically favorable. Do not stop abruptly.', monitor: ['BP', 'HR'], indication: 'Schizophrenia' });
      } else {
        home(spec, { key: 'clozapine', name: 'clozapine (CLOZARIL) tablet', dose: '200 mg', route: 'Oral', freq: 'qHS', cls: 'Atypical antipsychotic', sips: true, highAlert: true, info: 'REMS drug: needs absolute neutrophil count (ANC) monitoring. If 48 hours or more of doses are missed the dose must be re-titrated, so do not hold without calling the provider. Causes sialorrhea, constipation/ileus, orthostasis, tachycardia and rare myocarditis (fever, chest pain).', monitor: ['WBC', 'BP', 'HR'], hold: 'Call the provider before holding; hold for ANC below 1.0 K/uL, fever with tachycardia/chest pain, or severe constipation.', indication: 'Treatment-resistant schizophrenia' });
        spec.labBase.WBC = 6.2; spec.labBase['Absolute neutrophil count'] = 3.1; spec.vitalAdjust.push({ hr: 8 });
        addLabs(spec, 0.5, ['Absolute neutrophil count']); addLabs(spec, 54.5, ['Absolute neutrophil count']);
        home(spec, { key: 'docusate_senna_cloz', name: 'senna (SENOKOT) tablet', dose: '17.2 mg', route: 'Oral', freq: 'qHS', cls: 'Stimulant laxative', info: 'Clozapine causes severe constipation; assess bowel movements daily and report absent bowel sounds or abdominal distension.', holdIf: ['npo'], indication: 'Clozapine-related constipation prevention' });
        order(spec, { name: 'Clozapine monitoring: ANC and bowel function', category: 'Nursing', frequency: 'Per protocol', instructions: 'Verify ANC with pharmacy before each dose; assess bowel function every shift (clozapine ileus risk); orthostatic BP; report fever or chest pain (myocarditis, neutropenia).', startH: 3 });
      }
      P.ecg(spec, 438 + (ctx.age % 5) * 4, 'Baseline QTc on antipsychotic');
      order(spec, { name: 'QTc awareness: antipsychotic', category: 'Nursing', frequency: 'Continuous', instructions: 'Repeat 12-lead ECG if a QT-prolonging drug is added (ondansetron, haloperidol, azithromycin, fluoroquinolones) or K below 4.0 / Mg below 2.0. Keep K above 4.0 and Mg above 2.0. Notify provider for QTc above 500 ms.', startH: 3, nursing: ['Hold the antipsychotic only after discussion with the provider; abrupt stopping risks relapse.'] });
      order(spec, { name: 'Psychosis and safety observation', category: 'Precautions', frequency: 'Every shift', instructions: 'Assess orientation, hallucinations and delusions; use a calm, simple, non-confrontational approach; do not argue with delusions. Notify provider for command hallucinations, agitation or refusal of medications.', startH: 3 });
      spec.labBase.Triglycerides = 175;
      assess(spec, [['Neurologic', 'Thought Process', 'Linear and organized when approached calmly; denies hallucinations at present; flat affect'], ['Neurologic', 'Orientation', 'Alert and oriented x4'], SI]);
      comorb(spec, {
        key: 'schizophrenia', problem: 'Schizophrenia', details: 'Chronic schizophrenia on maintenance antipsychotic; stable outpatient.', pmh: 'Schizophrenia',
        plan: () => ['Continue home antipsychotic every day (give with sips if NPO; relapse risk if missed).', 'Baseline QTc documented; avoid adding QT-prolonging drugs without ECG and K/Mg correction.', 'Monitor glucose and lipids (metabolic effects); calm, consistent communication.']
      });
    }
  });

  // ---------- PTSD ----------
  add('ptsd', {
    label: 'PTSD', group: G, aliases: ['post traumatic stress', 'posttraumatic', 'trauma'], order: 45,
    desc: 'Adds an SSRI and prazosin, trauma-informed care orders, startle/hyperarousal findings and a night-time sleep plan.',
    apply(ctx, spec) {
      home(spec, { key: 'sertraline', name: 'sertraline (ZOLOFT) tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'SSRI antidepressant', sips: true, info: 'Do not stop abruptly (discontinuation syndrome). Bleeding risk with anticoagulants and antiplatelets; hyponatremia in older adults.', monitor: ['Na'], indication: 'PTSD' });
      home(spec, { key: 'prazosin', name: 'prazosin (MINIPRESS) capsule', dose: ctx.male ? '3 mg' : '2 mg', route: 'Oral', freq: 'qHS', cls: 'Alpha blocker', info: 'For trauma-related nightmares. First-dose and orthostatic hypotension: check BP, assist with night-time toileting.', monitor: ['BP'], hold: 'Hold and notify provider for SBP below 100.', holdIf: ['npo', 'hypotension'], holdReason: 'NPO or low blood pressure', indication: 'PTSD-related nightmares' });
      spec.vitalAdjust.push({ hr: 3 });
      order(spec, { name: 'Trauma-informed care', category: 'Precautions', frequency: 'Continuous', instructions: 'Explain procedures before touching, ask permission, keep door open when feasible, avoid unnecessary restraints, limit night-time awakenings, avoid being behind the patient. Offer a support person. Avoid abrupt physical contact and loud alarms where possible.', startH: 3, nursing: ['Watch for flashbacks, panic or dissociation (e.g. during MRI, restraints, anesthesia emergence); ground the patient with a calm voice and orientation.'] });
      assess(spec, [['Neurologic', 'Mood / Affect', 'Guarded, hypervigilant, startles easily; cooperative'], ['Neurologic', 'Sleep', 'Reports nightmares and frequent waking; slept 4 hours'], SI]);
      comorb(spec, { key: 'ptsd', problem: 'Post-traumatic stress disorder', details: 'PTSD on sertraline and nighttime prazosin.', pmh: 'Post-traumatic stress disorder', plan: (c, S, h) => ['Continue sertraline; prazosin at bedtime (held for low BP or NPO).', 'Trauma-informed approach; avoid benzodiazepines unless needed for another indication.'] });
    }
  });

  // ---------- Panic / generalized anxiety ----------
  add('anxiety', {
    label: 'Panic Disorder / Generalized Anxiety', group: G, aliases: ['panic attacks', 'gad', 'generalized anxiety disorder', 'anxiety disorder'], order: 45,
    desc: 'Adds an SSRI/SNRI and low-dose PRN benzodiazepine (fall and sedation cautions), anxiety assessment and non-drug coping measures.',
    apply(ctx, spec) {
      const snri = ctx.age % 2 === 0;
      if (snri) home(spec, { key: 'venlafaxine', name: 'venlafaxine ER (EFFEXOR XR) capsule', dose: '75 mg', route: 'Oral', freq: 'daily', cls: 'SNRI antidepressant', sips: true, info: 'Do not stop abruptly (withdrawal). Can raise BP; hyponatremia in older adults. Swallow whole.', monitor: ['BP', 'Na'], renal: { ckd3: { dose: '37.5 mg', note: 'Dose reduced for CKD.' }, esrd: { dose: '37.5 mg', note: 'Dose reduced for ESRD.' } }, indication: 'Generalized anxiety disorder' });
      else home(spec, { key: 'escitalopram', name: 'escitalopram (LEXAPRO) tablet', dose: ctx.age >= 60 ? '10 mg' : '20 mg', route: 'Oral', freq: 'daily', cls: 'SSRI antidepressant', sips: true, info: 'Do not stop abruptly. QT prolongation (dose-related), hyponatremia, bleeding risk with anticoagulants.', monitor: ['Na'], indication: 'Panic disorder / generalized anxiety' });
      home(spec, { key: 'buspirone', name: 'buspirone (BUSPAR) tablet', dose: '10 mg', route: 'Oral', freq: 'BID', cls: 'Anxiolytic', info: 'Takes weeks to work; no sedation or dependence. Give consistently with or without food.', holdIf: ['npo'], indication: 'Generalized anxiety disorder', when: !snri });
      home(spec, { key: 'lorazepam_prn', name: 'lorazepam (ATIVAN) tablet', dose: '0.5 mg', route: 'Oral', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'severe anxiety or panic attack', cls: 'Benzodiazepine', info: 'Try non-drug measures first (coaching slow breathing, reassurance). Hold for sedation (RASS -2 or lower) or RR below 12. Fall risk; additive respiratory depression with opioids.', monitor: ['RR', 'SPO2'], hold: 'Hold for sedation or RR below 12; avoid with opioids if possible.', indication: 'Panic disorder (home PRN)', highAlert: true, prnGiven: [] });
      spec.vitalAdjust.push({ hr: 4 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      order(spec, { name: 'Anxiety management and panic response', category: 'Nursing', frequency: 'PRN', instructions: 'For a panic attack: stay with the patient, calm voice, slow paced breathing (4 in, 6 out), grounding; rule out medical causes (hypoxia, pain, arrhythmia, hypoglycemia, PE) before attributing symptoms to anxiety. Check vital signs.', startH: 3 });
      assess(spec, [['Neurologic', 'Mood / Affect', 'Anxious but cooperative; fidgeting, appropriate eye contact'], SI]);
      comorb(spec, { key: 'anxiety', problem: 'Panic disorder / generalized anxiety', details: 'Chronic anxiety on daily antidepressant with rare PRN lorazepam.', pmh: 'Panic disorder / generalized anxiety disorder', plan: () => ['Continue antidepressant daily; PRN lorazepam only after non-drug measures and with sedation/respiratory checks.', 'Rule out medical causes before treating new anxiety.'] });
    }
  });

  // ---------- ADHD ----------
  add('adhd', {
    label: 'ADHD', group: G, aliases: ['attention deficit', 'add', 'attention-deficit hyperactivity disorder'], order: 50,
    desc: 'Adds a stimulant (or atomoxetine) with BP/HR caution and controlled-substance handling; mild tachycardia/hypertension baseline.',
    apply(ctx, spec) {
      const stim = ctx.age < 60 && !(ctx.has('cad') || ctx.has('afib') || ctx.has('hf'));
      if (stim) {
        home(spec, { key: 'methylphenidate_er', name: 'methylphenidate ER (CONCERTA) tablet', dose: '36 mg', route: 'Oral', freq: 'daily', at: ['0800'], cls: 'CNS stimulant (Schedule II)', holdIf: ['npo'], holdReason: 'NPO (swallow whole; give with morning meal)', info: 'Schedule II controlled substance (count/waste per policy). Swallow whole. Increases HR and BP, suppresses appetite and sleep. Hold if HR above 110 or SBP above 160.', monitor: ['BP', 'HR'], hold: 'Hold and notify provider for HR above 110, SBP above 160, chest pain or palpitations.', indication: 'ADHD' });
        spec.vitalAdjust.push({ hr: 5, sbp: 4, dbp: 2 });
      } else {
        home(spec, { key: 'atomoxetine', name: 'atomoxetine (STRATTERA) capsule', dose: '60 mg', route: 'Oral', freq: 'daily', cls: 'Non-stimulant ADHD agent', holdIf: ['npo'], info: 'Non-controlled. May raise HR/BP slightly; report mood changes, jaundice or urinary retention.', monitor: ['BP', 'HR'], indication: 'ADHD' });
      }
      assess(spec, [['Neurologic', 'Attention', 'Easily distracted at times; follows simple instructions with repetition']]);
      comorb(spec, { key: 'adhd', problem: 'Attention-deficit/hyperactivity disorder', details: stim ? 'ADHD on extended-release methylphenidate.' : 'ADHD on atomoxetine.', pmh: 'ADHD', plan: (c, S, h) => [stim ? 'Home stimulant held while NPO or tachycardic/hypertensive; resume with diet if vitals acceptable.' : 'Continue atomoxetine; check BP and HR.', 'Provide written instructions and short, repeated teaching.'] });
    }
  });

  // ---------- Alcohol use disorder ----------
  add('aud', {
    label: 'Alcohol Use Disorder', group: G, aliases: ['alcoholism', 'alcohol abuse', 'etoh', 'drinking', 'alcohol dependence'], order: 45,
    desc: 'Adds thiamine/folate/multivitamin, naltrexone or acamprosate, macrocytosis/liver/platelet lab shifts and (unless social history is already heavy drinking) CIWA-Ar withdrawal monitoring.',
    apply(ctx, spec) {
      const heavy = /Heavy/i.test((ctx.social || {}).alcohol || '') || spec.primaryKey === 'etoh_withdrawal';
      Object.assign(spec.labBase, { AST: 64, ALT: 38, GGT: 142, MCV: 99, Platelets: ctx.female ? 165 : 150, Magnesium: 1.7, Folate: 4.2 });
      home(spec, { key: 'thiamine', name: 'thiamine tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B1', info: 'Give before any dextrose-containing fluids.', variants: { npo: { name: 'thiamine injection', route: 'IV' } }, indication: 'Alcohol use disorder', home: false });
      home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], indication: 'Alcohol use disorder', home: false });
      home(spec, { key: 'multivitamin', name: 'multivitamin tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', holdIf: ['npo'], indication: 'Alcohol use disorder', home: false });
      const opioidOn = spec.meds.some(m => /^opioid/i.test(m.cls || '') && !m.home);
      if (ctx.age % 2 === 0) {
        home(spec, { key: 'naltrexone', name: 'naltrexone (REVIA) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', cls: 'Opioid antagonist (alcohol craving)', when: !opioidOn, holdIf: ['npo'], info: 'BLOCKS opioid analgesics (including buprenorphine) for 24-72 hours, so it must be held if opioids are needed. Check liver tests. Patient should carry a wallet card.', monitor: ['LFT'], hold: 'Hold and notify provider if opioid analgesia is ordered or for AST/ALT above 5 times normal.', indication: 'Alcohol use disorder (relapse prevention)' });
        if (opioidOn) heldNote(spec, 'Naltrexone held because opioid analgesia is ordered (naltrexone blocks opioids).');
      } else {
        home(spec, { key: 'acamprosate', name: 'acamprosate DR (CAMPRAL) tablet', dose: '666 mg', route: 'Oral', freq: 'TID', cls: 'Anti-craving agent', holdIf: ['npo'], info: 'Swallow whole. Renally cleared: reduce to 333 mg TID for CrCl 30-50 and avoid below 30. Give with meals.', monitor: ['Cr'], renal: { ckd3: { dose: '333 mg', note: 'Dose reduced for CKD.' }, esrd: { avoid: true } }, indication: 'Alcohol use disorder (relapse prevention)' });
      }
      if (!heavy) {
        order(spec, { name: 'CIWA-Ar alcohol withdrawal assessment', category: 'Nursing', frequency: 'Every 4 hours (every 1 hour after PRN dose)', instructions: 'Score CIWA-Ar; give lorazepam per protocol for score of 10 or greater. Notify provider for score above 20, seizure, or hallucinations.', startH: 3, stopH: 96, nursing: ['Seizure and fall precautions; keep room quiet and well lit.'] });
        home(spec, { key: 'lorazepam_ciwa', name: 'lorazepam (ATIVAN) tablet', dose: '1-2 mg per CIWA score', route: 'Oral', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'CIWA-Ar 10 or greater', cls: 'Benzodiazepine', info: 'Hold for sedation (RASS -2 or lower) or RR below 12. Reassess CIWA 1 hour after dose.', monitor: ['RR', 'SPO2', 'BP'], home: false, stopH: 96, indication: 'Alcohol withdrawal prevention', highAlert: true });
        spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
        for (let h = 3; h <= 99; h += 12) spec.assessments.unshift({ fromH: h, items: [['Safety', 'CIWA-Ar Score', `${Math.max(1, 4 - Math.floor(h / 36))} (mild)`]] });
      }
      comorb(spec, {
        key: 'aud', problem: 'Alcohol use disorder', details: 'Chronic alcohol use disorder; macrocytosis, mildly elevated AST/GGT and borderline platelets.', pmh: 'Alcohol use disorder',
        plan: () => ['Thiamine before any dextrose; folate and multivitamin daily; CIWA-Ar monitoring for withdrawal (typically 6-96 hours after last drink).', 'Replete Mg/K/Phos; seizure and fall precautions; offer addiction medicine consult and relapse-prevention therapy before discharge.']
      });
    }
  });

  // ---------- Opioid use disorder on maintenance ----------
  add('oud', {
    label: 'Opioid Use Disorder on Maintenance', group: G, aliases: ['suboxone', 'buprenorphine', 'methadone', 'opioid dependence', 'mat', 'medication assisted treatment'], order: 45,
    desc: 'Adds buprenorphine-naloxone (sublingual) or methadone maintenance that is continued (verify with clinic), naloxone PRN, QTc monitoring for methadone, opioid-tolerant pain plan.',
    apply(ctx, spec) {
      const meth = ctx.age % 2 === 0;
      if (meth) {
        home(spec, { key: 'methadone', name: 'methadone (DOLOPHINE) tablet', dose: ctx.age % 4 === 0 ? '80 mg' : '60 mg', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'Opioid agonist (maintenance)', sips: true, highAlert: true, info: 'Maintenance dose for opioid use disorder: do NOT stop or hold without calling the provider (withdrawal). VERIFY dose and last-dose date with the opioid treatment program before the first inpatient dose. Prolongs QTc; interacts with CYP3A4 drugs (azithromycin, fluconazole, ciprofloxacin, ondansetron). Hold for sedation or RR below 12.', monitor: ['RR', 'SPO2', 'HR'], hold: 'Hold and notify provider for sedation (RASS -2 or lower), RR below 12 or QTc above 500 ms; do not simply skip for NPO.', indication: 'Opioid use disorder (methadone maintenance)' });
        P.ecg(spec, 462, 'Baseline QTc on methadone');
        order(spec, { name: 'Methadone: verify dose with opioid treatment program', category: 'Nursing', frequency: 'Once', instructions: 'Call the clinic (opioid treatment program) for dose and date of last dose; check PDMP. Continue the verified dose daily (liquid or tablet). If unable to take PO, notify provider for IV conversion (approximately 50% of oral dose, divided). Repeat ECG if a QT-prolonging drug is added.', startH: 3 });
      } else {
        home(spec, { key: 'buprenorphine_naloxone', name: 'buprenorphine-naloxone (SUBOXONE) sublingual film', dose: ctx.age % 3 === 0 ? '12 mg-3 mg' : '8 mg-2 mg', route: 'Sublingual', freq: 'daily', at: ['0900'], cls: 'Opioid partial agonist (maintenance)', highAlert: true, info: 'Maintenance for opioid use disorder: CONTINUE (do not stop). Verify dose with prescriber/clinic and PDMP. Dissolve under the tongue; nothing by mouth until dissolved. Acute pain: provider may split the dose every 6-8 hours and add a full-agonist opioid; avoid nalbuphine/butorphanol (precipitated withdrawal).', monitor: ['RR', 'SPO2'], hold: 'Hold and notify provider for sedation or RR below 12; do not stop for NPO (sublingual).', indication: 'Opioid use disorder (buprenorphine maintenance)' });
      }
      home(spec, { key: 'naloxone', name: 'naloxone injection', dose: '0.4 mg', route: 'IV', freq: 'q2min', prn: true, prnInterval: 'Every 2-3 minutes', prnFor: 'respiratory depression (RR below 8) or unresponsiveness after opioid', cls: 'Antidote (opioid reversal)', home: false, info: 'May precipitate withdrawal; titrate 0.04-0.4 mg to restore breathing, not full wakefulness. Call rapid response. Effect can wear off before methadone/buprenorphine.', monitor: ['RR', 'SPO2'], indication: 'Opioid overdose reversal', prnGiven: [] });
      order(spec, { name: 'Pain plan: opioid-tolerant patient on maintenance therapy', category: 'Nursing', frequency: 'Continuous', instructions: 'Maintenance dose does not provide acute analgesia. Use multimodal analgesia (acetaminophen, NSAID if renal function allows, regional/local blocks, ice, heat) and expect to need higher-than-usual doses of full-agonist opioids with shorter intervals. Assess pain, sedation (POSS/RASS) and respiratory rate with each opioid dose. Do not under-treat pain; do not label as drug-seeking.', startH: 3 });
      order(spec, { name: 'Respiratory and sedation monitoring', category: 'Nursing', frequency: 'Every 4 hours', instructions: 'Check sedation level (POSS/RASS), RR and SpO2 every 4 hours and 30-60 minutes after each opioid dose. Keep naloxone available. Notify provider for RR below 10 or SpO2 below 90%.', startH: 3 });
      assess(spec, [['Neurologic', 'Level of Consciousness', 'Alert, no signs of intoxication or withdrawal (COWS 2)'], ['Skin', 'Skin', 'Old track marks not present; warm and dry']]);
      comorb(spec, {
        key: 'oud', problem: 'Opioid use disorder on maintenance therapy', details: meth ? 'Opioid use disorder in sustained remission on methadone maintenance (daily clinic dosing).' : 'Opioid use disorder in sustained remission on buprenorphine-naloxone.', pmh: 'Opioid use disorder on ' + (meth ? 'methadone' : 'buprenorphine-naloxone') + ' maintenance',
        plan: () => [meth ? 'Continue methadone (verified dose); QTc monitoring; avoid additive QT-prolonging drugs.' : 'Continue buprenorphine-naloxone daily (may be divided for pain).', 'Multimodal analgesia; naloxone available; COWS if missed doses; arrange clinic follow-up and continued dosing at discharge.']
      });
    }
  });

  // ---------- Cannabis use ----------
  add('cannabis', {
    label: 'Cannabis Use (daily)', group: G, aliases: ['marijuana', 'weed', 'thc', 'cannabis use disorder'], order: 55,
    desc: 'Daily cannabis use: possible irritability, insomnia, anxiety and nausea from withdrawal in 1-3 days; tachycardia baseline; no home medications.',
    apply(ctx, spec) {
      spec.vitalAdjust.push({ hr: 4 });
      order(spec, { name: 'Cannabis withdrawal observation', category: 'Nursing', frequency: 'Every shift', instructions: 'Daily cannabis use: watch 24-72 hours after admission for irritability, anxiety, insomnia, decreased appetite, nausea and sweating. Treat symptoms (sleep hygiene, antiemetic, fluids) and offer nicotine replacement if also smoking. No cannabis products in the hospital; follow facility policy.', startH: 3 });
      order(spec, { name: 'Substance use screening and brief intervention', category: 'Nursing', frequency: 'Once', instructions: 'Nonjudgmental SBIRT screen before discharge; counsel on cannabis hyperemesis (cyclic vomiting relieved by hot showers), driving and mental-health risks.', startH: 24 });
      assess(spec, [['Neurologic', 'Mood / Affect', 'Cooperative; mildly anxious; no signs of acute intoxication']]);
      comorb(spec, { key: 'cannabis', problem: 'Cannabis use disorder', details: 'Daily cannabis use (smoked/vaped or edible).', pmh: 'Cannabis use', plan: () => ['Monitor for withdrawal (irritability, insomnia, nausea) on days 1-3; opioid and anesthetic requirements may be higher; brief intervention before discharge.'] });
    }
  });

  // ---------- Insomnia ----------
  add('insomnia', {
    label: 'Chronic Insomnia', group: G, aliases: ['sleep disorder', 'trouble sleeping', 'zolpidem', 'ambien'], order: 55,
    desc: 'Adds a bedtime sleep aid (zolpidem or trazodone/melatonin in older adults), fall precautions and a sleep-protection plan (cluster care, no 0200 vitals unless needed).',
    apply(ctx, spec) {
      if (ctx.age >= 65) {
        home(spec, { key: 'trazodone', name: 'trazodone (DESYREL) tablet', dose: '50 mg', route: 'Oral', freq: 'qHS', prn: true, prnInterval: 'Once nightly', prnFor: 'insomnia', cls: 'Sedating antidepressant', info: 'Orthostatic hypotension and fall risk; avoid zolpidem/benzodiazepines in older adults (Beers criteria). Check BP before giving.', monitor: ['BP'], hold: 'Hold for SBP below 100 or sedation.', indication: 'Chronic insomnia', prnGiven: [] });
        home(spec, { key: 'melatonin', name: 'melatonin tablet', dose: '3 mg', route: 'Oral', freq: 'qHS', cls: 'Sleep-wake regulator', holdIf: ['npo'], info: 'Give 1-2 hours before bedtime; dim lights.', indication: 'Chronic insomnia' });
      } else {
        home(spec, { key: 'zolpidem', name: 'zolpidem (AMBIEN) tablet', dose: ctx.female ? '5 mg' : '10 mg', route: 'Oral', freq: 'qHS', prn: true, prnInterval: 'Once nightly', prnFor: 'insomnia', cls: 'Sedative-hypnotic (Schedule IV)', info: 'Give only when ready for bed with 7-8 hours available; complex sleep behaviors, next-day impairment and fall risk. Avoid with opioids/benzodiazepines.', monitor: ['RR'], hold: 'Hold for sedation, RR below 12 or if less than 7 hours in bed remain.', indication: 'Chronic insomnia', prnGiven: [] });
      }
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      order(spec, { name: 'Sleep promotion: cluster care and quiet hours', category: 'Nursing', frequency: 'Nightly', instructions: 'Cluster care 2200-0500; lights low, door closed, ear plugs/eye mask offered, no non-essential vital signs or labs between 0000 and 0400 when stable. Reassess sedative need nightly; avoid caffeine after noon.', startH: 3 });
      assess(spec, [['Neurologic', 'Sleep', 'Reports sleeping 3-4 hours per night at baseline; daytime fatigue']]);
      comorb(spec, { key: 'insomnia', problem: 'Chronic insomnia', details: 'Chronic difficulty falling and staying asleep on a nightly sleep aid.', pmh: 'Chronic insomnia', plan: () => ['Offer home sleep aid at bedtime if no sedation; non-drug sleep measures first; delirium and fall precautions.'] });
    }
  });

  // ---------- Eating disorder ----------
  add('eating_disorder', {
    label: 'Eating Disorder (anorexia / bulimia)', group: G, aliases: ['anorexia nervosa', 'bulimia', 'anorexia', 'binge purge'], order: 30,
    desc: 'Low K/Mg/Phos and sodium, low-normal glucose, bradycardia and hypotension; refeeding syndrome precautions, QTc monitoring, supervised meals, thiamine/multivitamin and an SSRI.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Potassium: 3.4, Magnesium: 1.6, Phosphorus: 2.7, Sodium: 134, Glucose: 76, Hemoglobin: ctx.female ? 11.4 : 12.6, WBC: 4.1, Creatinine: 0.6, CO2: 29, Chloride: 96 });
      spec.vitalAdjust.push({ hr: -12, sbp: -10, dbp: -6 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'thiamine', name: 'thiamine tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B1', info: 'Give before starting nutrition support and before dextrose (refeeding risk).', variants: { npo: { name: 'thiamine injection', route: 'IV' } }, indication: 'Eating disorder: refeeding prophylaxis' });
      home(spec, { key: 'multivitamin', name: 'multivitamin tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', holdIf: ['npo'], indication: 'Eating disorder' });
      home(spec, { key: 'fluoxetine', name: 'fluoxetine (PROZAC) capsule', dose: '40 mg', route: 'Oral', freq: 'daily', cls: 'SSRI antidepressant', sips: true, info: 'Monitor mood and suicidal thoughts. QT effects add to low K/Mg risk. Do not stop abruptly.', monitor: ['K', 'Mg'], indication: 'Eating disorder / depression' });
      P.ecg(spec, 452, 'Baseline QTc: electrolyte abnormalities / eating disorder', 'Sinus bradycardia');
      addLabs(spec, 0.5, ['Phosphorus', 'Magnesium']);
      spec.labSchedule.push({ daily: true, codes: ['Phosphorus', 'Magnesium', 'Potassium'], fromH: 20, toH: 24 * 5 });
      order(spec, { name: 'Refeeding syndrome precautions', category: 'Nursing', frequency: 'Daily x 3-5 days', instructions: 'Thiamine before nutrition; advance calories slowly per dietitian; check phosphorus, magnesium, potassium and glucose daily (twice daily for the first 3 days if severe). Replace electrolytes per protocol. Monitor for edema, tachycardia, dyspnea and confusion.', startH: 3, nursing: ['Report phosphorus below 2.5, K below 3.5, new peripheral edema or arrhythmia.'] });
      order(spec, { name: 'Supervised meals and eating disorder behavior plan', category: 'Nursing', frequency: 'Every meal', instructions: 'Staff present during meals and 1 hour after (no bathroom use, to prevent purging); document percent consumed; no negotiating food; avoid discussing weight or body shape; weigh in a gown, blind to the number if per plan.', startH: 3 });
      order(spec, { name: 'Orthostatic vital signs and cardiac monitoring', category: 'Nursing', frequency: 'Daily and PRN', instructions: 'Orthostatic BP/HR daily; bradycardia (HR below 45) and QTc above 500 ms should be reported. Fall precautions.', startH: 3 });
      assess(spec, [['Cardiac', 'Rhythm', 'Sinus bradycardia'], ['Skin', 'Skin', 'Dry, cool skin; lanugo-type fine body hair; brittle hair'], ['Neurologic', 'Mood / Affect', 'Flat, guarded about food and weight; cooperative'], SI]);
      comorb(spec, {
        key: 'eating_disorder', problem: 'Eating disorder (anorexia / bulimia spectrum)', details: 'Restrictive eating with chronically low BMI, low K/Mg/Phos and baseline bradycardia and low BP.', pmh: 'Eating disorder (anorexia nervosa)',
        plan: () => ['Refeeding precautions with daily K, Mg and Phos; thiamine first; dietitian-guided nutrition.', 'Supervised meals; ECG for QTc; avoid QT-prolonging drugs (ondansetron) when possible; psychiatry consult; screen suicide risk.']
      });
    }
  });
})();

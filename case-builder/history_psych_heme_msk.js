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

(() => {
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = NS.HX.helpers;
  const P = NS.HX.phm;
  const add = NS.HX.add;
  const G = 'Hematology / Oncology';
  P.addLab('Factor VIII activity', { cat: 'Coagulation', units: '%', ref: [50, 150], dec: 0, base: 100, crit: [1, null] });
  const opioidOrdered = spec => spec.meds.some(m => /^opioid/i.test(m.cls || '') && !m.home);
  const bleedPrec = (spec, txt) => order(spec, { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', instructions: txt || 'Soft toothbrush, electric razor, no IM injections or rectal temperatures, firm pressure 5-10 minutes after venipuncture, avoid aspirin/NSAIDs; report bleeding, black stools, hematuria or new bruising.', startH: 3 });
  const scd = spec => order(spec, { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', instructions: 'Mechanical VTE prophylaxis in place of pharmacologic prophylaxis.', startH: 3 });

  // ---------- Sickle cell disease ----------
  add('sickle_cell', {
    label: 'Sickle Cell Disease', group: G, aliases: ['sickle cell anemia', 'hbss', 'scd', 'sickle'], order: 20,
    desc: 'Baseline Hgb about 8 with high reticulocytes, bilirubin and LDH; hydroxyurea and folic acid; hydration, warmth, incentive spirometry (acute chest prevention), opioid-tolerant pain plan, no meperidine.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Hemoglobin: ctx.female ? 7.8 : 8.3, Hematocrit: ctx.female ? 23.5 : 25, WBC: 11.8, Platelets: 410, 'Reticulocyte count': 8.5, LDH: 360, 'Total bilirubin': 2.6, 'Direct bilirubin': 0.5, 'Hemoglobin S': 82 });
      spec.vitalAdjust.push({ hr: 6, sbp: -6, dbp: -4 });
      addLabs(spec, 0.5, ['Reticulocyte count', 'LDH', 'Total bilirubin']);
      home(spec, { key: 'hydroxyurea', name: 'hydroxyurea (HYDREA) capsule', dose: ctx.age % 2 ? '1,000 mg' : '1,500 mg', route: 'Oral', freq: 'daily', cls: 'Antimetabolite (HbF inducer)', holdIf: ['npo'], info: 'Cytotoxic: wear gloves, do not open capsules. Raises fetal hemoglobin and reduces crises. Monitor CBC: hold for ANC below 2.0 K/uL, platelets below 80 or Hgb below 4.5 and call the provider.', monitor: ['WBC', 'Plt', 'Hgb'], hold: 'Hold and notify provider for ANC below 2.0 K/uL, platelets below 80 K/uL or acute illness with fever.', renal: { ckd3: { dose: '500 mg', note: 'Dose reduced 50% for CKD.' }, esrd: { dose: '500 mg', note: 'Dose reduced for ESRD; give after dialysis.' } }, indication: 'Sickle cell disease (crisis prevention)' });
      home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], info: 'Supports increased red cell production.', indication: 'Sickle cell disease (chronic hemolysis)' });
      if (!opioidOrdered(spec)) home(spec, { key: 'oxycodone', name: 'oxycodone (ROXICODONE) tablet', dose: '10 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'moderate to severe pain', cls: 'Opioid analgesic', info: 'Opioid-tolerant (chronic sickle cell pain). Assess sedation and RR. Patient-specific pain plan from hematology.', monitor: ['Pain', 'RR'], hold: 'Hold for sedation (RASS -2 or lower) or RR below 12.', indication: 'Sickle cell pain (home PRN)', highAlert: true, prnGiven: [] });
      order(spec, { name: 'Sickle cell precautions: hydration, warmth and oxygenation', category: 'Nursing', frequency: 'Continuous', instructions: 'Maintain hydration (oral 2-3 L/day or IV at maintenance rate; avoid fluid overload), keep patient warm (no cold packs, warm blankets), keep SpO2 at or above 94%, avoid sedation-related hypoventilation, treat pain within 30-60 minutes of arrival. Do not give meperidine. Transfuse only with hematology approval (antigen-matched, sickle-negative blood; avoid Hgb above 10 / hyperviscosity).', startH: 3, nursing: ['New chest pain, cough, fever, SpO2 drop = possible acute chest syndrome; notify provider immediately.', 'Priapism, severe headache, weakness or speech change = emergency (stroke).'] });
      order(spec, { name: 'Incentive spirometry (acute chest syndrome prevention)', category: 'Respiratory', frequency: '10 times every hour while awake', instructions: 'Teach deep breathing with sustained inspiration; record volume. Report fever, cough, chest pain or new oxygen need.', startH: 3 });
      order(spec, { name: 'Individualized pain plan', category: 'Nursing', frequency: 'Continuous', instructions: 'Use the patient-specific plan from hematology. Reassess pain every 30-60 minutes after IV opioid until controlled, then every 4 hours. Pain is what the patient says it is; baseline chronic pain is usually 3-5/10.', startH: 3 });
      sticky(spec, 'Sickle cell disease', 'Baseline Hgb about 8 with jaundice and reticulocytosis. Hydrate, keep warm, incentive spirometry, individualized pain plan. Fever of 101 F or higher needs urgent evaluation (functional asplenia).');
      assess(spec, [['Skin', 'Skin', 'Mild scleral icterus; pale conjunctivae; warm, dry'], ['Pain', 'Pain Location', 'Chronic low-grade bilateral hip and low back pain at baseline'], ['Cardiac', 'Heart Sounds', 'S1 S2 with soft systolic flow murmur']]);
      comorb(spec, { key: 'sickle_cell', problem: 'Sickle cell disease', details: 'HbSS with chronic hemolytic anemia (baseline Hgb about 8) on hydroxyurea; functional asplenia.', pmh: 'Sickle cell disease (HbSS), on hydroxyurea', plan: () => ['Baseline Hgb 7.5-8.5; transfuse only for symptomatic drop or hematology-directed indication.', 'Hydroxyurea held for NPO/fever with low counts per provider; folate daily.', 'Hydration, warmth, incentive spirometry; opioid-tolerant pain plan; fever 101 F or higher: blood cultures and antibiotics promptly.'] });
    }
  });

  // ---------- Hemophilia / inherited bleeding disorder ----------
  add('hemophilia', {
    label: 'Hemophilia / Bleeding Disorder', group: G, aliases: ['hemophilia a', 'factor viii deficiency', 'von willebrand', 'bleeding disorder'], order: 20,
    desc: 'Moderate hemophilia A: prolonged aPTT, low factor VIII, bleeding precautions, no IM injections/NSAIDs/pharmacologic VTE prophylaxis, hematology consult and factor replacement plan before procedures.',
    apply(ctx, spec) {
      spec.labBase.aPTT = 62; spec.labBase['Factor VIII activity'] = 3; spec.labBase.INR = 1.0; spec.labBase.Platelets = 235;
      spec.noPpx = true;
      addLabs(spec, 0.5, ['aPTT', 'INR', 'Factor VIII activity']);
      home(spec, { key: 'factor_viii', name: 'antihemophilic factor, recombinant (ADVATE) IV', dose: '40 units/kg', route: 'IV', freq: 'q24h', prn: true, prnInterval: 'Per hematology', prnFor: 'bleeding, joint pain/swelling, or before procedures (provider order)', cls: 'Clotting factor replacement', home: false, highAlert: true, info: 'Give only per hematology dose and target level (for example 80-100% before surgery). Infuse slowly over 5-10 minutes by IV push; do not mix with other drugs. Patient may self-infuse at home.', monitor: ['Hgb'], hold: 'Call the provider immediately for bleeding, a swollen painful joint, head injury or severe headache.', indication: 'Hemophilia A: bleeding/procedure coverage', prnGiven: [] });
      bleedPrec(spec, 'No IM injections, no rectal temperatures, firm pressure 10 minutes after venipuncture, avoid aspirin/NSAIDs, smallest-gauge needles, soft toothbrush. Report joint pain/swelling (hemarthrosis), headache, black stools or hematuria at once.');
      scd(spec);
      order(spec, { name: 'Hematology consult: factor replacement plan', category: 'Consult / Therapy', frequency: 'Once', instructions: 'Factor VIII level and replacement before any surgery, line placement or invasive procedure. Pharmacologic VTE prophylaxis and heparin products are not ordered unless hematology approves.', startH: 3 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      assess(spec, [['Musculoskeletal / Mobility', 'Joint Exam', 'Chronic mild left knee enlargement and reduced extension (old hemarthrosis); no acute swelling or warmth'], ['Safety', 'Bleeding Assessment', 'No active bleeding; old ecchymoses on shins']]);
      comorb(spec, { key: 'hemophilia', problem: 'Hemophilia A (moderate)', details: 'Factor VIII about 3%; chronic left knee arthropathy; prolonged aPTT baseline.', pmh: 'Hemophilia A (moderate)', plan: () => ['No pharmacologic VTE prophylaxis, IM injections or NSAIDs; SCDs.', 'Hematology guides factor VIII dosing before procedures; monitor Hgb and joints; acetaminophen for pain.'] });
    }
  });

  // ---------- Immune thrombocytopenia ----------
  add('itp', {
    label: 'Immune Thrombocytopenia (ITP)', group: G, aliases: ['itp', 'low platelets', 'thrombocytopenia'], order: 20,
    desc: 'Chronic ITP: baseline platelets about 55-60 with petechiae risk, eltrombopag, bleeding precautions, no NSAIDs/aspirin and SCDs instead of pharmacologic VTE prophylaxis.',
    apply(ctx, spec) {
      spec.labBase.Platelets = ctx.female ? 62 : 55;
      spec.noPpx = true;
      home(spec, { key: 'eltrombopag', name: 'eltrombopag (PROMACTA) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'Thrombopoietin receptor agonist', holdIf: ['npo'], info: 'Give on an EMPTY stomach (1 hour before or 2 hours after meals) and 4 hours apart from calcium, antacids, iron or dairy. Monitor platelets and liver tests; hepatotoxicity and thrombosis risk.', monitor: ['Plt', 'LFT'], hold: 'Hold and notify provider for platelets above 200 K/uL, ALT elevation or jaundice.', indication: 'Chronic ITP' });
      bleedPrec(spec);
      scd(spec);
      order(spec, { name: 'Platelet count threshold notification', category: 'Nursing', frequency: 'Daily with CBC', instructions: 'Notify provider for platelets below 30 K/uL, any active bleeding, headache with neuro change, or before procedures. Platelet transfusion only for bleeding or counts below 10 K/uL per hematology (ITP platelets are cleared quickly). No pharmacologic VTE prophylaxis unless hematology approves.', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Scattered petechiae on lower legs and a few forearm ecchymoses; no active bleeding'], ['Safety', 'Bleeding Assessment', 'No epistaxis, gum bleeding, hematuria or melena']]);
      comorb(spec, { key: 'itp', problem: 'Immune thrombocytopenia', details: 'Chronic ITP, baseline platelets 50-60 K/uL on eltrombopag.', pmh: 'Chronic immune thrombocytopenia (ITP)', plan: () => ['Platelets baseline about 55; trend daily; bleeding precautions and SCDs.', 'Avoid aspirin/NSAIDs/IM injections; hematology consult if platelets fall below 30 or bleeding.'] });
    }
  });

  // ---------- Polycythemia vera ----------
  add('polycythemia_vera', {
    label: 'Polycythemia Vera', group: G, aliases: ['pv', 'myeloproliferative', 'jak2', 'polycythemia'], order: 20,
    desc: 'High Hgb/Hct, WBC and platelets; hydroxyurea and aspirin; thrombosis risk (hydration, early ambulation), phlebotomy goal Hct below 45%, pruritus.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Hemoglobin: ctx.female ? 16.4 : 17.6, Hematocrit: ctx.female ? 49 : 53, WBC: 12.8, Platelets: 520, 'Uric acid': 7.8 });
      spec.vitalAdjust.push({ sbp: 6, dbp: 3 });
      home(spec, { key: 'hydroxyurea', name: 'hydroxyurea (HYDREA) capsule', dose: '500 mg', route: 'Oral', freq: 'BID', cls: 'Antimetabolite', holdIf: ['npo'], info: 'Cytotoxic: wear gloves, do not open capsules. Monitor CBC; hold for ANC below 1.5 or platelets below 100 and call the provider.', monitor: ['WBC', 'Plt', 'Hgb'], hold: 'Hold and notify provider for ANC below 1.5 K/uL, platelets below 100 K/uL or fever.', renal: { ckd3: { dose: '250 mg', note: 'Dose reduced for CKD.' }, esrd: { dose: '250 mg', note: 'Dose reduced for ESRD.' } }, indication: 'Polycythemia vera (cytoreduction)' });
      home(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'Reduces thrombosis risk in polycythemia vera. Monitor for bleeding.', monitor: ['Hgb', 'Plt'], indication: 'Polycythemia vera (thrombosis prevention)' });
      order(spec, { name: 'Hydration and thrombosis prevention', category: 'Nursing', frequency: 'Continuous', instructions: 'Maintain hydration (dehydration raises blood viscosity), early ambulation, SCDs while in bed; report headache, vision change, chest pain, calf swelling or abdominal pain (splenic/mesenteric thrombosis). Therapeutic phlebotomy per hematology if Hct above 45-48%; avoid iron supplements.', startH: 3, nursing: ['Hematocrit above 55% or new neurologic symptoms: notify provider urgently.', 'Pruritus after warm water is common; use lukewarm showers.'] });
      scd(spec);
      assess(spec, [['Skin', 'Skin', 'Ruddy face and plethoric appearance; warm; excoriations from itching'], ['GI', 'Abdomen', 'Soft; mild left upper quadrant fullness (splenomegaly)']]);
      comorb(spec, { key: 'polycythemia_vera', problem: 'Polycythemia vera', details: 'JAK2-positive polycythemia vera on hydroxyurea and aspirin; Hct goal below 45%.', pmh: 'Polycythemia vera (JAK2 positive)', plan: () => ['Keep well hydrated; Hct and platelets daily; continue hydroxyurea/aspirin unless counts drop or active bleeding.', 'High clot risk: SCDs and early ambulation; hematology for phlebotomy.'] });
    }
  });

  // ---------- MGUS ----------
  add('mgus', {
    label: 'MGUS (monoclonal gammopathy)', group: G, aliases: ['monoclonal gammopathy', 'm spike', 'paraprotein'], order: 50,
    desc: 'Premalignant plasma cell condition: high total protein, normal calcium/creatinine, no medications; annual monitoring and avoidance of dehydration/nephrotoxins.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { 'Total protein': 8.4, Hemoglobin: ctx.female ? 12.0 : 13.2 });
      comorb(spec, { key: 'mgus', problem: 'Monoclonal gammopathy of undetermined significance', details: 'Small IgG kappa M-spike (0.8 g/dL); stable, no end-organ damage; annual surveillance.', pmh: 'MGUS (monitored)', plan: () => ['No treatment; calcium, creatinine and Hgb are baseline normal.', 'Report new bone pain, anemia or rising creatinine to the provider.'] });
    }
  });

  // ---------- Multiple myeloma ----------
  add('multiple_myeloma', {
    label: 'Multiple Myeloma (on treatment)', group: G, aliases: ['myeloma', 'plasma cell', 'revlimid', 'lenalidomide'], order: 20,
    desc: 'Anemia, high total protein, mild renal impairment and hypercalcemia tendency; lenalidomide with aspirin, acyclovir; bone-pain and fracture precautions, infection and AKI risk (no NSAIDs, hydrate).',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { Hemoglobin: ctx.female ? 9.6 : 10.2, 'Total protein': 9.2, Albumin: 3.2, Creatinine: ctx.female ? 1.3 : 1.5, Calcium: 10.4, WBC: 4.4, Platelets: 160 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'lenalidomide', name: 'lenalidomide (REVLIMID) capsule', dose: ctx.renal === 'none' ? '25 mg' : '10 mg', route: 'Oral', freq: 'daily', cls: 'Immunomodulatory antineoplastic', holdIf: ['npo'], highAlert: true, info: 'REMS drug: cytotoxic and teratogenic (gloves; pregnant staff avoid handling; use patient supply per pharmacy). Days 1-21 of 28-day cycle. Renally dosed. Causes neutropenia, thrombocytopenia and VTE.', monitor: ['WBC', 'Plt', 'Cr'], hold: 'Hold and notify provider for ANC below 1.0 K/uL, platelets below 50 K/uL, fever or new leg swelling.', renal: { ckd3: { dose: '10 mg', note: 'Renally dosed.' }, esrd: { dose: '5 mg', note: 'Dosed after dialysis on dialysis days.' } }, indication: 'Multiple myeloma' });
      home(spec, { key: 'acyclovir', name: 'acyclovir (ZOVIRAX) tablet', dose: '400 mg', route: 'Oral', freq: 'BID', cls: 'Antiviral prophylaxis', holdIf: ['npo'], info: 'Shingles prophylaxis while on myeloma therapy. Keep hydrated.', monitor: ['Cr'], renal: { ckd3: { dose: '400 mg', note: 'Continue; monitor renal function.' }, esrd: { dose: '200 mg', note: 'Dose reduced for ESRD.' } }, indication: 'Herpes zoster prophylaxis' });
      home(spec, { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', cls: 'Antiplatelet', sips: true, info: 'VTE prophylaxis with lenalidomide. Hold if platelets below 50.', monitor: ['Plt'], hold: 'Hold if platelets below 50 K/uL or bleeding.', indication: 'Myeloma therapy thromboprophylaxis' });
      order(spec, { name: 'Myeloma precautions: hydration, fracture and infection', category: 'Precautions', frequency: 'Continuous', instructions: 'Maintain hydration (2-3 L/day unless restricted); NO NSAIDs or IV contrast without provider review; move patient gently and avoid twisting/pulling (lytic bone lesions, pathologic fracture); report new back pain or leg weakness (cord compression), confusion, constipation, polyuria or thirst (hypercalcemia). Hypogammaglobulinemia: monitor closely for infection.', startH: 3 });
      order(spec, { name: 'Neutropenic fever instructions', category: 'Nursing', frequency: 'Continuous', instructions: 'Temperature 100.4 F (38.0 C) or higher with ANC below 1.0 K/uL is an emergency: blood cultures x2 and broad-spectrum IV antibiotics within 60 minutes; notify provider.', startH: 3 });
      addLabs(spec, 0.5, ['Total protein', 'Albumin']);
      assess(spec, [['Pain', 'Pain Location', 'Chronic mid-back and rib pain, 3/10, worse with movement'], ['Skin', 'Skin', 'Pale, dry; no rash']]);
      comorb(spec, { key: 'multiple_myeloma', problem: 'Multiple myeloma', details: 'IgG myeloma with anemia and mild renal impairment on lenalidomide-based therapy; weekly dexamethasone per oncology.', pmh: 'Multiple myeloma on lenalidomide', plan: () => ['Continue lenalidomide only if ANC and platelets acceptable; weekly dexamethasone per oncology (check glucose).', 'Hydration, no NSAIDs, fracture and infection precautions; trend Cr and calcium.'] });
    }
  });
})();

(() => {
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = NS.HX.helpers;
  const P = NS.HX.phm;
  const add = NS.HX.add;
  const G = 'Hematology / Oncology';
  P.addLab('CEA', { cat: 'Other', units: 'ng/mL', ref: [0, 3], dec: 1, base: 1.8 });
  const scd = spec => order(spec, { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', instructions: 'Mechanical VTE prophylaxis; add to pharmacologic prophylaxis for high VTE risk.', startH: 3 });
  const neutroOrders = (spec, level) => {
    order(spec, { name: 'Neutropenic precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Hand hygiene before every contact, no fresh flowers or raw foods when ANC is below 1.0 K/uL, mask for visitors with symptoms, private room if ANC below 0.5, no rectal temperatures, suppositories or enemas, no IM injections, oral care with a soft brush.', startH: 3 });
    order(spec, { name: 'Fever in a patient on chemotherapy: neutropenic fever pathway', category: 'Nursing', frequency: 'PRN fever', instructions: 'Temperature 100.4 F (38.0 C) or higher is an EMERGENCY in a patient on chemotherapy: notify provider immediately, blood cultures x2 (one from the port if present), CBC with differential, lactate, and start broad-spectrum IV antibiotics within 60 minutes. Do not give acetaminophen before the provider is notified.', startH: 3, nursing: [level || 'Take temperature orally or temporally only.'] });
  };

  // ---------- Breast cancer in remission ----------
  add('breast_cancer', {
    label: 'Breast Cancer (in remission, on hormonal therapy)', group: G, aliases: ['breast ca', 'tamoxifen', 'anastrozole', 'breast carcinoma'], order: 50,
    desc: 'Adds anastrozole (or tamoxifen if premenopausal) with VTE/bone-health considerations; hot flashes; no active chemotherapy.',
    apply(ctx, spec) {
      const tam = ctx.age < 50 || ctx.male;
      if (tam) {
        home(spec, { key: 'tamoxifen', name: 'tamoxifen (NOLVADEX) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', cls: 'Selective estrogen receptor modulator', holdIf: ['npo'], info: 'Raises risk of DVT/PE and endometrial cancer. Report calf pain or swelling, dyspnea, vaginal bleeding. Interacts with paroxetine/fluoxetine (CYP2D6). Continue unless bedbound with a clot; call provider.', monitor: ['Hgb'], hold: 'Notify provider before continuing if immobilized, DVT/PE suspected or after major surgery.', indication: 'Breast cancer: adjuvant endocrine therapy' });
        order(spec, { name: 'High VTE risk: tamoxifen', category: 'Nursing', frequency: 'Continuous', instructions: 'Early ambulation, SCDs in bed, confirm pharmacologic prophylaxis is not omitted. Report unilateral leg swelling/pain or dyspnea.', startH: 3 });
        scd(spec);
      } else {
        home(spec, { key: 'anastrozole', name: 'anastrozole (ARIMIDEX) tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Aromatase inhibitor', holdIf: ['npo'], info: 'Causes joint pain, hot flashes and bone loss (osteoporosis, fracture risk). No special lab monitoring. Not time-critical; may be held for a few days if NPO.', indication: 'Breast cancer: adjuvant endocrine therapy' });
        spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      }
      assess(spec, [['Skin', 'Skin', 'Healed lumpectomy scar left breast; no lymphedema, redness or mass'], ['Musculoskeletal / Mobility', 'Joint Exam', 'Mild generalized joint stiffness (hormonal therapy)']].slice(0, tam ? 1 : 2));
      comorb(spec, { key: 'breast_cancer', problem: 'Breast cancer in remission', details: `Stage I hormone-receptor-positive breast cancer treated ${ctx.surgYear && ctx.surgYear('mastectomy') ? 'in ' + ctx.surgYear('mastectomy') : '4 years ago'}; on ${tam ? 'tamoxifen' : 'anastrozole'}; no evidence of disease.`, pmh: 'Breast cancer, in remission on ' + (tam ? 'tamoxifen' : 'anastrozole'), plan: () => [tam ? 'Continue tamoxifen unless immobilized or clotting; mechanical VTE prophylaxis; call provider about holding.' : 'Continue anastrozole (may hold briefly while NPO); fall precautions for bone loss.', 'No active cancer treatment this admission.'] });
    }
  });

  // ---------- Prostate cancer on ADT ----------
  add('prostate_cancer', {
    label: 'Prostate Cancer (on androgen deprivation)', group: G, aliases: ['prostate ca', 'adt', 'lupron', 'leuprolide', 'abiraterone'], order: 50,
    desc: 'Adds androgen deprivation (bicalutamide, or abiraterone plus prednisone with BP/K monitoring), low PSA, mild anemia, bone-loss fall risk and hot flashes.',
    apply(ctx, spec) {
      const abi = ctx.age % 2 === 0;
      spec.labBase.PSA = abi ? 0.4 : 0.1; spec.labBase.Hemoglobin = ctx.female ? 11.4 : 12.4;
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      if (abi) {
        spec.vitalAdjust.push({ sbp: 8, dbp: 4 });
        spec.labBase.Potassium = 3.8;
        home(spec, { key: 'abiraterone', name: 'abiraterone (ZYTIGA) tablet', dose: '1,000 mg', route: 'Oral', freq: 'daily', at: ['0800'], cls: 'CYP17 inhibitor (antiandrogen)', holdIf: ['npo'], info: 'Give on an EMPTY stomach (1 hour before or 2 hours after food). Hazardous drug: gloves. Causes hypertension, hypokalemia and fluid retention; monitor BP, K and LFTs.', monitor: ['BP', 'K', 'LFT'], hold: 'Hold and notify provider for SBP above 180, K below 3.5 or ALT above 5 times normal.', indication: 'Metastatic prostate cancer' });
        home(spec, { key: 'prednisone', name: 'prednisone tablet', dose: '5 mg', route: 'Oral', freq: 'BID', cls: 'Corticosteroid', sips: true, info: 'Replaces cortisol suppressed by abiraterone. DO NOT stop abruptly (adrenal insufficiency); needs stress-dose steroids during severe illness or surgery. Give with food.', monitor: ['Glucose', 'K'], hold: 'Do not hold; call provider if unable to take (give IV equivalent).', indication: 'With abiraterone (adrenal replacement)' });
      } else {
        home(spec, { key: 'bicalutamide', name: 'bicalutamide (CASODEX) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', cls: 'Antiandrogen', holdIf: ['npo'], info: 'Taken with leuprolide depot injection every 3-6 months at the clinic. Monitor liver tests; hot flashes, gynecomastia, fatigue.', monitor: ['LFT'], indication: 'Prostate cancer (androgen deprivation)' });
      }
      assess(spec, [['Skin', 'Skin', 'Mild bilateral breast tenderness/gynecomastia; warm, intermittent hot flashes reported'], ['GU', 'Urinary Elimination', 'Voiding with mild urgency; no hematuria']]);
      comorb(spec, { key: 'prostate_cancer', problem: 'Prostate cancer', details: abi ? 'Metastatic prostate cancer on leuprolide, abiraterone and prednisone; PSA 0.4 ng/mL.' : 'Prostate cancer on androgen deprivation therapy (leuprolide depot plus bicalutamide); PSA undetectable.', pmh: 'Prostate cancer on androgen deprivation therapy', plan: () => [abi ? 'Continue abiraterone (empty stomach) AND prednisone daily; stress-dose steroids if critically ill; BP and K daily.' : 'Continue bicalutamide; leuprolide injection is due at the clinic, not inpatient.', 'Bone loss: fall precautions; avoid urinary catheter trauma if retention occurs.'] });
    }
  });

  // ---------- Colon cancer in remission ----------
  add('colon_cancer', {
    label: 'Colon Cancer (in remission)', group: G, aliases: ['colorectal cancer', 'colon ca', 'rectal cancer'], order: 50,
    desc: 'Cancer-free after resection and chemotherapy 3-5 years ago: no medications; mild chronic anemia, CEA surveillance, adhesion/stool-pattern considerations.',
    apply(ctx, spec) {
      spec.labBase.Hemoglobin = ctx.female ? 11.8 : 12.8; spec.labBase.CEA = 1.6;
      assess(spec, [['GI', 'Stool', 'Soft stool 1-2 times daily at baseline; no blood or melena']]);
      comorb(spec, { key: 'colon_cancer', problem: 'Colon cancer in remission', details: 'Stage II colon adenocarcinoma resected and treated; no evidence of recurrence on surveillance colonoscopy and CEA.', pmh: 'Colon cancer, in remission (resection with adjuvant therapy)', plan: () => ['No active cancer treatment; baseline mild anemia.', 'New melena, weight loss or obstructive symptoms should be reported (recurrence or adhesions).'] });
    }
  });

  // ---------- Active lung cancer on chemotherapy ----------
  add('lung_cancer', {
    label: 'Lung Cancer on Chemotherapy', group: G, aliases: ['lung ca', 'nsclc', 'small cell', 'chemo', 'chemotherapy', 'port'], order: 20,
    desc: 'Active lung cancer on carboplatin/pemetrexed: low WBC/Hgb/platelets, implanted port, neutropenic precautions and neutropenic-fever pathway, antiemetics, pemetrexed folate/B12, mild baseline dyspnea.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { WBC: 3.2, Hemoglobin: ctx.female ? 9.8 : 10.4, Hematocrit: ctx.female ? 30 : 32, Platelets: 118, Albumin: 3.3, Sodium: 135 });
      spec.vitalAdjust.push({ hr: 6 });
      home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], info: 'Required daily with pemetrexed to reduce toxicity (start 7 days before and continue 3 weeks after the last dose).', indication: 'Pemetrexed premedication' });
      home(spec, { key: 'ondansetron', name: 'ondansetron (ZOFRAN) tablet', dose: '8 mg', route: 'Oral', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'nausea or vomiting', cls: 'Antiemetic (5-HT3 antagonist)', info: 'Prolongs QTc; check K and Mg. Constipation common.', monitor: ['K', 'Mg'], hold: 'Hold and notify provider if QTc above 500 ms.', indication: 'Chemotherapy-induced nausea (home PRN)', prnGiven: [], variants: { npo: { name: 'ondansetron (ZOFRAN) injection', dose: '4 mg', route: 'IV' } } });
      home(spec, { key: 'prochlorperazine', name: 'prochlorperazine (COMPAZINE) tablet', dose: '10 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'breakthrough nausea', cls: 'Antiemetic (phenothiazine)', info: 'Sedating; QTc and orthostasis; avoid with other QT drugs when possible.', indication: 'Chemotherapy-induced nausea (home PRN)', prnGiven: [] });
      P.port(spec);
      neutroOrders(spec);
      order(spec, { name: 'Chemotherapy precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Last chemotherapy cycle about 10-12 days ago (expected WBC/platelet nadir). Handle body fluids for 48 hours after chemotherapy with gloves; hazardous drug precautions. Hold all chemotherapy and notify oncology of admission; do not give any chemotherapy without a specific order. Bleeding precautions if platelets below 50.', startH: 3 });
      order(spec, { name: 'Oncology consult', category: 'Consult / Therapy', frequency: 'Once', instructions: 'Notify the outpatient oncologist of admission; treatment plan and G-CSF decisions per oncology.', startH: 3 });
      assess(spec, [['Respiratory', 'Respiratory Effort', 'Mild exertional dyspnea at baseline; speaks in full sentences'], ['Respiratory', 'Breath Sounds', 'Diminished at right base (known effusion)'], ['Skin', 'Port Site', 'Right chest port pocket clean, dry, intact; not accessed']].filter(a => a[1] !== 'Breath Sounds' || ctx.age % 2 === 0));
      sticky(spec, 'Immunocompromised', 'Active chemotherapy. Fever of 100.4 F or higher = neutropenic fever emergency: cultures and antibiotics within 60 minutes. No rectal temperatures.');
      comorb(spec, { key: 'lung_cancer', problem: 'Lung cancer on chemotherapy', details: 'Stage IV non-small-cell lung cancer on carboplatin/pemetrexed every 21 days; implanted right chest port; chronic cytopenias.', pmh: 'Lung cancer on chemotherapy (implanted port)', plan: () => ['Chemotherapy on hold this admission; oncology aware.', 'Neutropenic precautions; port care; fever = cultures and antibiotics within 60 minutes.', 'Daily CBC; antiemetics PRN; goals-of-care conversation if clinically declining.'] });
    }
  });

  // ---------- Lymphoma / leukemia ----------
  add('lymphoma_leukemia', {
    label: 'Lymphoma / Leukemia (on treatment)', group: G, aliases: ['cll', 'chronic lymphocytic leukemia', 'non-hodgkin', 'nhl', 'hodgkin', 'aml', 'all', 'ibrutinib', 'rituximab'], order: 20,
    desc: 'CLL on ibrutinib (high lymphocyte WBC, bleeding/AF risk) or lymphoma on treatment (low WBC, port); antiviral/PJP prophylaxis and neutropenic-fever precautions.',
    apply(ctx, spec) {
      const cll = ctx.age % 2 === 0;
      home(spec, { key: 'acyclovir', name: 'acyclovir (ZOVIRAX) tablet', dose: '400 mg', route: 'Oral', freq: 'BID', cls: 'Antiviral prophylaxis', holdIf: ['npo'], info: 'Herpes prophylaxis during immunosuppressive therapy.', renal: { esrd: { dose: '200 mg', note: 'Dose reduced for ESRD.' } }, monitor: ['Cr'], indication: 'Herpes prophylaxis' });
      if (cll) {
        Object.assign(spec.labBase, { WBC: 36, Hemoglobin: ctx.female ? 11.0 : 11.8, Platelets: 118, LDH: 270 });
        home(spec, { key: 'ibrutinib', name: 'ibrutinib (IMBRUVICA) capsule', dose: '420 mg', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'BTK inhibitor (antineoplastic)', sips: true, highAlert: true, info: 'Swallow whole. Increases bleeding risk (hold 3-7 days around surgery per oncology), atrial fibrillation and hypertension; many CYP3A4 interactions (azoles, macrolides, diltiazem, grapefruit). Monitor CBC, rhythm and BP.', monitor: ['Hgb', 'Plt', 'HR', 'BP'], hold: 'Hold and call oncology before surgery/procedures, for active bleeding, platelets below 50 or new irregular rhythm.', indication: 'Chronic lymphocytic leukemia' });
        order(spec, { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'On ibrutinib: soft toothbrush, electric razor, firm pressure after venipuncture, avoid IM injections; report bleeding or black stools.', startH: 3 });
        order(spec, { name: 'Infection precautions (hypogammaglobulinemia)', category: 'Precautions', frequency: 'Continuous', instructions: 'Immunocompromised despite high WBC (lymphocytes are not functional). Hand hygiene, assess for infection every shift; fever 100.4 F or higher: cultures and prompt antibiotics.', startH: 3 });
        assess(spec, [['Skin', 'Skin', 'Scattered ecchymoses forearms; no petechiae'], ['GI', 'Abdomen', 'Soft; palpable spleen tip; non-tender'], ['Cardiac', 'Rhythm', 'Sinus rhythm']]);
      } else {
        Object.assign(spec.labBase, { WBC: 3.6, Hemoglobin: ctx.female ? 10.2 : 10.8, Platelets: 128, LDH: 330 });
        home(spec, { key: 'atovaquone', name: 'atovaquone (MEPRON) suspension', dose: '1,500 mg', route: 'Oral', freq: 'daily', cls: 'PJP prophylaxis', holdIf: ['npo'], info: 'Give with fatty food for absorption. Pneumocystis prophylaxis while receiving rituximab/chemotherapy.', indication: 'Pneumocystis prophylaxis' });
        P.port(spec);
        neutroOrders(spec);
        assess(spec, [['Skin', 'Port Site', 'Right chest port pocket clean, dry, intact; not accessed'], ['Skin', 'Skin', 'Pale; alopecia (post-chemotherapy)']]);
        sticky(spec, 'Immunocompromised', 'Lymphoma on chemotherapy. Fever 100.4 F or higher = neutropenic fever emergency (cultures and antibiotics within 60 minutes).');
      }
      comorb(spec, { key: 'lymphoma_leukemia', problem: cll ? 'Chronic lymphocytic leukemia' : 'Lymphoma on treatment', details: cll ? 'CLL on ibrutinib with lymphocytosis, mild anemia and thrombocytopenia.' : 'Diffuse large B-cell lymphoma completing chemoimmunotherapy; implanted port; mild pancytopenia.', pmh: cll ? 'Chronic lymphocytic leukemia on ibrutinib' : 'Diffuse large B-cell lymphoma on chemoimmunotherapy', plan: () => [cll ? 'Continue ibrutinib unless bleeding, procedure planned or new AF; avoid CYP3A4 interacting drugs (clarithromycin, azoles).' : 'Chemotherapy held; oncology aware; prophylaxis continues.', 'Immunocompromised: fever = urgent cultures and antibiotics.'] });
    }
  });

  // ---------- Thrombophilia (factor V Leiden) ----------
  add('thrombophilia', {
    label: 'Thrombophilia (Factor V Leiden)', group: G, aliases: ['factor v leiden', 'hypercoagulable', 'clotting disorder', 'protein c deficiency'], order: 50,
    desc: 'Inherited clotting risk: VTE prophylaxis must not be omitted (pharmacologic plus SCDs), early mobility, estrogen caution; no home medications.',
    apply(ctx, spec) {
      scd(spec);
      order(spec, { name: 'High VTE risk: inherited thrombophilia', category: 'Nursing', frequency: 'Every shift', instructions: 'Heterozygous factor V Leiden: confirm VTE prophylaxis is given daily, SCDs on in bed, ambulate at least 3 times daily, avoid dehydration and prolonged sitting. Report unilateral leg pain/swelling, chest pain or dyspnea. Avoid estrogen-containing products.', startH: 3, nursing: ['Calf pain, edema or unexplained tachycardia/SpO2 drop: notify provider and consider duplex/CT angiogram.'] });
      assess(spec, [['Cardiac', 'Distal Pulses', 'Pulses 2+ bilaterally; calves soft, symmetric, non-tender, no edema']]);
      comorb(spec, { key: 'thrombophilia', problem: 'Factor V Leiden thrombophilia', details: 'Heterozygous factor V Leiden; no prior thrombosis, not on anticoagulation.', pmh: 'Factor V Leiden (heterozygous)', plan: () => ['Pharmacologic VTE prophylaxis plus SCDs; early mobility.', 'Calf assessment every shift.'] });
    }
  });
})();

(() => {
  const { home, order, comorb, assess, addLabs, sticky, heldNote } = NS.HX.helpers;
  const P = NS.HX.phm;
  const add = NS.HX.add;
  const G = 'Infectious Disease / Immunologic';

  // ---------- HIV ----------
  add('hiv', {
    label: 'HIV (on antiretroviral therapy)', group: G, aliases: ['aids', 'human immunodeficiency virus', 'art', 'antiretroviral', 'biktarvy'], order: 30,
    desc: 'Virally suppressed on single-tablet or two-pill ART (never miss or hold doses), CD4 baseline about 500, antacid/cation spacing, interaction review, standard precautions with confidentiality.',
    apply(ctx, spec) {
      spec.labBase['CD4 count'] = 380 + (ctx.age % 5) * 60; spec.labBase['HIV-1 RNA viral load'] = 0;
      addLabs(spec, 0.5, ['CD4 count', 'HIV-1 RNA viral load']);
      if (ctx.age % 2 === 0) {
        home(spec, { key: 'bictegravir', name: 'bictegravir-emtricitabine-tenofovir alafenamide (BIKTARVY) tablet', dose: '1 tablet (50/200/25 mg)', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'Antiretroviral (integrase inhibitor combination)', sips: true, highAlert: true, info: 'TIME-CRITICAL: never miss or hold doses (resistance). Give 2 hours BEFORE or with food at the same time as calcium/iron; separate from antacids, magnesium/aluminum products and sucralfate by 2 hours. Interacts with rifampin and metformin. Check renal function.', monitor: ['Cr'], hold: 'Do not hold without calling the provider; if NPO give with sips, or ask pharmacy for alternatives.', renal: { esrd: { dose: '1 tablet (post-dialysis)', note: 'Give after dialysis on dialysis days.' } }, indication: 'HIV infection' });
      } else {
        home(spec, { key: 'dolutegravir', name: 'dolutegravir (TIVICAY) tablet', dose: '50 mg', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'Antiretroviral (integrase inhibitor)', sips: true, highAlert: true, info: 'TIME-CRITICAL: never miss or hold doses. Separate from antacids, calcium and iron by 2 hours before or 6 hours after. Raises metformin levels; may slightly raise creatinine (blocks secretion).', monitor: ['Cr'], hold: 'Do not hold without calling the provider.', indication: 'HIV infection' });
        home(spec, { key: 'emtricitabine_taf', name: 'emtricitabine-tenofovir alafenamide (DESCOVY) tablet', dose: '200/25 mg', route: 'Oral', freq: 'daily', at: ['0900'], cls: 'Antiretroviral (NRTI combination)', sips: true, highAlert: true, info: 'TIME-CRITICAL: never miss or hold doses. Renal function monitoring; hepatitis B flare if stopped abruptly.', monitor: ['Cr'], hold: 'Do not hold without calling the provider.', renal: { esrd: { dose: '200/25 mg (post-dialysis)', note: 'Give after dialysis on dialysis days.' } }, indication: 'HIV infection' });
      }
      order(spec, { name: 'Antiretroviral continuity and interaction review', category: 'Nursing', frequency: 'Continuous', instructions: 'ART must be given at the same time every day, including while NPO (sips) or in the ICU. Pharmacy to review every new drug for interactions (rifampin, antacids, PPIs, metformin, carbamazepine, St John wort). If doses were missed before admission, notify the provider. Standard precautions for all patients; protect confidentiality of HIV status.', startH: 3, nursing: ['If the patient cannot swallow, call pharmacy for crushing guidance or an alternative; never just skip doses.'] });
      assess(spec, [['Skin', 'Skin', 'Warm, dry, no rash or lesions; oral mucosa pink without thrush'], ['Safety', 'Infection Screen', 'Afebrile at baseline; no lymphadenopathy or night sweats']]);
      comorb(spec, { key: 'hiv', problem: 'HIV infection, virally suppressed', details: `HIV on antiretrovirals; CD4 about ${spec.labBase['CD4 count']}, viral load undetectable.`, pmh: 'HIV infection (on antiretroviral therapy, undetectable viral load)', plan: () => ['Continue ART daily at the same time (sips if NPO); never skip doses.', 'Separate cations from integrase inhibitors; pharmacy interaction review; opportunistic infection prophylaxis not needed at CD4 above 200.'] });
    }
  });

  // ---------- MRSA colonization ----------
  add('mrsa', {
    label: 'Prior MRSA Infection / Colonization', group: G, aliases: ['mrsa', 'methicillin resistant staph aureus', 'staph colonization'], order: 50,
    desc: 'Contact precautions, MRSA decolonization (mupirocin nasal, chlorhexidine bathing), and a prompt to cover MRSA in empiric therapy for new infections.',
    apply(ctx, spec) {
      if ((spec.isolation || 'None') === 'None') spec.isolation = 'Contact precautions';
      order(spec, { name: 'Contact precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Gown and gloves for all contact; dedicated stethoscope/equipment; private room; hand hygiene with soap and water or alcohol rub.', startH: 3 });
      home(spec, { key: 'mupirocin_nasal', name: 'mupirocin (BACTROBAN) 2% nasal ointment', dose: 'Apply to each nostril', route: 'Nasal', freq: 'BID', cls: 'Topical antibiotic (decolonization)', stopH: 123, home: false, info: 'Use for 5 days; press nostrils together after application.', indication: 'MRSA decolonization' });
      order(spec, { name: 'Chlorhexidine bathing', category: 'Nursing', frequency: 'Daily', instructions: 'Daily bath with 2% chlorhexidine cloths from neck down (avoid face, eyes, mucous membranes) to reduce MRSA burden.', startH: 4 });
      assess(spec, [['Skin', 'Skin', 'Warm, dry; healed scar right thigh (prior MRSA abscess); no new pustules or boils']]);
      sticky(spec, 'MRSA history', 'Prior MRSA. Contact precautions. For new skin, bone, line, pneumonia or sepsis concerns the empiric regimen should include MRSA coverage (vancomycin or linezolid) until cultures result.');
      comorb(spec, { key: 'mrsa', problem: 'History of MRSA infection / colonization', details: 'Prior MRSA skin abscess; nares colonized on screening.', pmh: 'MRSA infection (prior abscess), colonized', plan: () => ['Contact precautions; decolonization protocol (mupirocin x5 days, chlorhexidine baths).', 'Include MRSA coverage in empiric antibiotics for new infection; trough/AUC monitoring if vancomycin is used.'] });
    }
  });

  // ---------- Recurrent cellulitis ----------
  add('recurrent_cellulitis', {
    label: 'Recurrent Cellulitis', group: G, aliases: ['cellulitis', 'chronic leg swelling', 'lymphedema', 'venous stasis'], order: 50,
    desc: 'Chronic lower-leg edema and stasis skin changes with antibiotic prophylaxis (penicillin VK or erythromycin), skin protection and leg elevation.',
    apply(ctx, spec) {
      home(spec, { key: 'penicillin_vk', name: 'penicillin V potassium tablet', dose: '250 mg', route: 'Oral', freq: 'BID', cls: 'Penicillin (prophylaxis)', holdIf: ['npo'], avoid: ['penicillin'], alt: { key: 'erythromycin_ppx', name: 'erythromycin tablet', dose: '250 mg', cls: 'Macrolide (prophylaxis)', info: 'Penicillin allergy alternative; QT prolongation and CYP3A4 interactions.' }, info: 'Long-term prophylaxis to prevent recurrent cellulitis. Give with a full glass of water.', indication: 'Recurrent cellulitis prophylaxis' });
      order(spec, { name: 'Leg elevation and skin protection', category: 'Nursing', frequency: 'Every shift', instructions: 'Elevate legs above heart level when resting; moisturize dry skin; inspect both legs each shift for warmth, redness, weeping or cracks between toes (tinea). Compression stockings per provider once infection resolves. Mark cellulitis borders if present.', startH: 3 });
      assess(spec, [['Skin', 'Skin', 'Chronic bilateral lower leg brawny discoloration (stasis); scaling, dry skin; no warmth or erythema'], ['Cardiac', 'Edema', '1+ nonpitting bilateral lower leg edema']]);
      comorb(spec, { key: 'recurrent_cellulitis', problem: 'Recurrent cellulitis', details: 'Three episodes of right lower leg cellulitis in 2 years; chronic venous stasis; on penicillin prophylaxis.', pmh: 'Recurrent cellulitis (right leg)', plan: () => ['Continue penicillin prophylaxis (erythromycin if allergic).', 'Skin inspection each shift; leg elevation; treat tinea pedis.'] });
    }
  });

  // ---------- Chronic osteomyelitis ----------
  add('osteomyelitis', {
    label: 'Chronic Osteomyelitis', group: G, aliases: ['bone infection', 'chronic bone infection'], order: 50,
    desc: 'Chronic left tibia/foot osteomyelitis on suppressive oral doxycycline, elevated ESR/CRP, draining sinus tract dressing care and offloading.',
    apply(ctx, spec) {
      Object.assign(spec.labBase, { ESR: 54, CRP: 24, WBC: 9.6 });
      addLabs(spec, 0.5, ['ESR', 'CRP']);
      home(spec, { key: 'doxycycline', name: 'doxycycline hyclate tablet', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Tetracycline antibiotic (suppression)', holdIf: ['npo'], info: 'Give with a full glass of water and stay upright 30 minutes (esophagitis). Separate from calcium, iron, antacids and dairy by 2 hours. Photosensitivity.', indication: 'Chronic osteomyelitis suppression' });
      order(spec, { name: 'Chronic wound care: draining sinus tract', category: 'Nursing', frequency: 'Daily and PRN', instructions: 'Cleanse with normal saline, apply dressing per wound care for the left lower leg sinus tract; document drainage color/amount/odor. Contact precautions only if MRSA is isolated.', startH: 3 });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      assess(spec, [['Skin', 'Wound', 'Left lower leg 1 cm draining sinus tract, scant serous drainage, mild surrounding induration, no spreading erythema'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates with cane; avoids weight bearing through left leg']]);
      comorb(spec, { key: 'osteomyelitis', problem: 'Chronic osteomyelitis (left tibia)', details: 'Chronic left tibial osteomyelitis after open fracture; suppressive doxycycline; ESR and CRP elevated at baseline.', pmh: 'Chronic osteomyelitis (left tibia)', plan: () => ['Continue suppressive antibiotic; baseline ESR 54 and CRP 24 (do not mistake for new infection).', 'Daily sinus tract dressing; orthopedic or ID follow-up.'] });
    }
  });

  // ---------- Latent TB ----------
  add('latent_tb', {
    label: 'Latent Tuberculosis (on treatment)', group: G, aliases: ['ltbi', 'tb', 'positive ppd', 'isoniazid', 'rifampin', 'positive quantiferon'], order: 50,
    desc: 'Positive TB test with normal chest x-ray, on isoniazid plus pyridoxine or rifampin; not contagious (standard precautions); hepatotoxicity monitoring; rifampin drug interactions.',
    apply(ctx, spec) {
      if (ctx.age % 2 === 0) {
        home(spec, { key: 'isoniazid', name: 'isoniazid tablet', dose: '300 mg', route: 'Oral', freq: 'daily', cls: 'Antitubercular', holdIf: ['npo'], info: 'Hepatotoxic (risk higher with alcohol and age): monitor ALT/AST, report nausea, dark urine, jaundice. Causes peripheral neuropathy: give with pyridoxine.', monitor: ['LFT'], hold: 'Hold and notify provider for ALT above 3 times normal with symptoms, jaundice, or vomiting.', indication: 'Latent tuberculosis infection' });
        home(spec, { key: 'pyridoxine', name: 'pyridoxine (vitamin B6) tablet', dose: '25 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B6', holdIf: ['npo'], info: 'Prevents isoniazid neuropathy.', indication: 'Isoniazid neuropathy prevention' });
        addLabs(spec, 0.5, ['ALT', 'AST']);
      } else {
        home(spec, { key: 'rifampin', name: 'rifampin (RIFADIN) capsule', dose: '600 mg', route: 'Oral', freq: 'daily', at: ['0600'], cls: 'Antitubercular', holdIf: ['npo'], info: 'Give on an empty stomach. Turns urine, sweat and tears orange (harmless; stains contacts). Strong enzyme inducer: lowers levels of warfarin, apixaban, methadone, opioids, steroids, many antiretrovirals and oral contraceptives. Hepatotoxic.', monitor: ['LFT'], hold: 'Hold and notify provider for jaundice, dark urine or ALT above 3 times normal with symptoms.', indication: 'Latent tuberculosis infection (4-month regimen)' });
        addLabs(spec, 0.5, ['ALT', 'AST']);
        sticky(spec, 'Rifampin interactions', 'Rifampin reduces effect of many drugs (anticoagulants, opioids, steroids, ART). Review every new order with pharmacy.');
      }
      order(spec, { name: 'Latent TB: standard precautions only', category: 'Precautions', frequency: 'Continuous', instructions: 'Latent TB is NOT contagious: no airborne isolation. Escalate (airborne isolation, N95) only for cough >2 weeks, hemoptysis, night sweats, weight loss or an abnormal chest x-ray.', startH: 3 });
      assess(spec, [['Respiratory', 'Cough', 'No cough, hemoptysis or night sweats']]);
      comorb(spec, { key: 'latent_tb', problem: 'Latent tuberculosis infection', details: 'Positive IGRA with normal chest x-ray; on preventive therapy (month 3).', pmh: 'Latent tuberculosis infection on treatment', plan: () => ['Continue TB preventive therapy daily; monitor LFTs and symptoms of hepatitis.', 'Not contagious; reassess for active TB symptoms.'] });
    }
  });

  // ---------- Long-term corticosteroids / immunosuppression ----------
  add('chronic_steroids', {
    label: 'Long-term Corticosteroids / Immunosuppression', group: G, aliases: ['prednisone', 'steroids', 'immunosuppressed', 'immunosuppression', 'adrenal suppression'], order: 50,
    desc: 'Chronic prednisone with adrenal suppression: never stop or delay (IV if NPO), stress-dose steroid awareness, hyperglycemia, leukocytosis, blunted fever, bone and skin fragility, infection precautions.',
    apply(ctx, spec) {
      const mg = [5, 7.5, 10, 20][ctx.age % 4];
      spec.labAdd.Glucose = (spec.labAdd.Glucose || 0) + (mg >= 10 ? 14 : 8);
      spec.labAdd.WBC = (spec.labAdd.WBC || 0) + (mg >= 10 ? 2.4 : 1.2);
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      home(spec, { key: 'prednisone', name: 'prednisone tablet', dose: `${mg} mg`, route: 'Oral', freq: 'daily', at: ['0800'], cls: 'Corticosteroid', sips: true, info: 'Long-term use suppresses the adrenal glands: DO NOT stop abruptly, skip or delay doses. If NPO or vomiting give IV equivalent (methylprednisolone). Needs stress-dose steroids (hydrocortisone) for hypotension, sepsis, surgery or trauma. Give with food; monitor glucose, BP, mood.', monitor: ['Glucose', 'BP'], hold: 'Never hold: notify provider if the dose cannot be given.', variants: { npoStrict: { name: 'methylprednisolone (SOLU-MEDROL) injection', dose: `${Math.round(mg * 0.8 * 10) / 10} mg`, route: 'IV' } }, indication: 'Chronic corticosteroid therapy (adrenal suppression)' });
      home(spec, { key: 'calcium_vitd', name: 'calcium carbonate-vitamin D tablet', dose: '600 mg-800 units', route: 'Oral', freq: 'BID', cls: 'Mineral / vitamin supplement', holdIf: ['npo'], info: 'Bone protection during steroid therapy; give with meals. Separate from levothyroxine/quinolones by 4 hours.', indication: 'Steroid-induced osteoporosis prevention' });
      if (mg >= 20) home(spec, { key: 'tmp_smx_ppx', name: 'sulfamethoxazole-trimethoprim (BACTRIM SS) tablet', dose: '1 tablet (400/80 mg)', route: 'Oral', freq: 'daily', cls: 'PJP prophylaxis', avoid: ['sulfa'], holdIf: ['npo'], info: 'Pneumocystis prophylaxis for prednisone 20 mg or more for over 4 weeks. Monitor potassium and creatinine.', monitor: ['K', 'Cr'], renal: { ckd3: { dose: '1 tablet (400/80 mg) three times weekly', note: 'Reduced for CKD.' }, esrd: { avoid: true } }, indication: 'Pneumocystis prophylaxis' });
      order(spec, { name: 'Steroid-dependent patient: adrenal crisis awareness', category: 'Nursing', frequency: 'Continuous', instructions: 'Give daily steroid on time (IV if NPO). For unexplained hypotension, vomiting, hypoglycemia or sepsis, notify provider: stress-dose hydrocortisone (e.g. 50-100 mg IV) may be needed. Fever and signs of infection may be blunted; infection precautions and meticulous skin care (fragile skin, delayed wound healing).', startH: 3, nursing: ['Check glucose with morning labs; steroid hyperglycemia peaks in the afternoon/evening.'] });
      assess(spec, [['Skin', 'Skin', 'Thin, fragile skin with scattered forearm ecchymoses; mild facial fullness'], ['Safety', 'Infection Screen', 'Immunosuppressed: fever response may be blunted']]);
      sticky(spec, 'Adrenal suppression', `Chronic prednisone ${mg} mg daily. Never miss doses; stress-dose steroids for shock or surgery. Blunted fever and wound healing.`);
      comorb(spec, { key: 'chronic_steroids', problem: 'Long-term corticosteroid therapy (adrenal suppression)', details: `Chronic prednisone ${mg} mg daily; immunosuppressed with expected mild hyperglycemia and leukocytosis.`, pmh: `Long-term prednisone ${mg} mg daily (immunosuppression)`, plan: () => ['Continue daily steroid (IV equivalent if NPO); stress-dose steroids if hemodynamically unstable.', 'Glucose checks; infection vigilance with blunted signs; bone protection.'] });
    }
  });

  // ---------- Common variable immunodeficiency ----------
  add('cvid', {
    label: 'Common Variable Immunodeficiency', group: G, aliases: ['cvid', 'hypogammaglobulinemia', 'ivig', 'immunodeficiency', 'low immunoglobulins'], order: 50,
    desc: 'Low IgG on monthly immunoglobulin replacement, recurrent sinopulmonary infections, strict infection precautions, no live vaccines, IVIG infusion reaction precautions if due.',
    apply(ctx, spec) {
      spec.labBase['Immunoglobulin G'] = 520; spec.labBase.WBC = 6.0;
      addLabs(spec, 0.5, ['Immunoglobulin G']);
      order(spec, { name: 'Immunodeficiency precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Strict hand hygiene, mask for symptomatic staff/visitors, no live vaccines, early cultures for any fever or new cough/sinus symptoms (may present with subtle signs), culture before antibiotics when possible. Notify provider when IVIG is due (monthly): infuse slowly, premedicate per order, monitor vitals every 15 minutes initially for headache, chills, back pain, hypotension or anaphylaxis.', startH: 3 });
      assess(spec, [['Respiratory', 'Cough', 'Chronic mild productive cough, clear to white sputum'], ['Safety', 'Infection Screen', 'Immunodeficient: fever may be mild or absent']]);
      sticky(spec, 'Immunodeficiency', 'CVID with IgG about 520 on IVIG every 4 weeks. Infections may present subtly; culture early. Coordinate IVIG dosing if due during this admission.');
      comorb(spec, { key: 'cvid', problem: 'Common variable immunodeficiency', details: 'CVID with low IgG on monthly IVIG; history of recurrent pneumonia and sinusitis.', pmh: 'Common variable immunodeficiency (monthly IVIG)', plan: () => ['Immunoglobulin replacement per immunology (IVIG every 4 weeks); coordinate dosing if due.', 'Low threshold for cultures and treatment of infection; avoid live vaccines.'] });
    }
  });
})();

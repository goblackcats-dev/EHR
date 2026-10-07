/* Rules that sit between the diagnosis profile and the finished chart:
   history modules, social history, inpatient baseline, allergy/contrast handling, faculty keywords, safety checks. */
NS.rules = (() => {
  const U = NS.util, HX = NS.HX;

  // Modules apply in their `order` (lower first), then in the order they were registered.
  const moduleOrder = () => Object.keys(HX.M).map((k, i) => [k, HX.M[k].order === undefined ? 50 : HX.M[k].order, i]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(x => x[0]);
  // Kidney disease stages replace one another: only the most advanced one selected is used.
  const CKD_CHAIN = ['ckd1', 'ckd2', 'ckd3', 'ckd4', 'ckd5', 'esrd'];
  const slug = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  function applyAll(ctx, spec) {
    spec.primaryKey = ctx.input.primary;
    spec.applied = spec.applied || [];

    // Surgical history can imply medical history
    if ((ctx.surg.has('cabg') || ctx.surg.has('pci')) && !ctx.hx.has('cad')) { ctx.hx.add('cad'); spec.applied.push('Added coronary artery disease because of prior CABG/stent.'); }
    const topCkd = CKD_CHAIN.filter(k => ctx.hx.has(k)).pop();
    CKD_CHAIN.forEach(k => { if (k !== topCkd) ctx.hx.delete(k); });
    if (spec.primaryKey === 'chf' && !ctx.hx.has('hf')) { ctx.hx.add('hf'); spec.applied.push('Heart failure added to medical history (primary diagnosis).'); }
    if (spec.primaryKey === 'copd_exac' && !ctx.hx.has('copd')) { ctx.hx.add('copd'); spec.applied.push('COPD added to medical history (primary diagnosis).'); }
    // dosing category used by medication renal rules: stage 5 and dialysis dose like ESRD, stages 3-4 like CKD 3, stages 1-2 need no adjustment
    ctx.renal = (ctx.hx.has('esrd') || ctx.hx.has('ckd5')) ? 'esrd' : (ctx.hx.has('ckd4') || ctx.hx.has('ckd3')) ? 'ckd3' : 'none';

    moduleOrder().forEach(key => { if (ctx.hx.has(key) && HX.M[key] && HX.M[key].apply) HX.M[key].apply(ctx, spec); });
    // surgical history that changes the chart (anticoagulation after a mechanical valve, thyroid replacement after thyroidectomy, ...)
    [...ctx.surg].forEach(key => { const sx = HX.SX[key]; if (sx && sx.apply) sx.apply(ctx, spec); });
    // anything the instructor typed that matches no module is listed as history only
    (ctx.input.hxCustom || []).forEach(c => {
      const text = String((c && c.text) || c || '').trim(); if (!text) return;
      spec.comorb.push({ key: `custom_${slug(text)}`, problem: text.charAt(0).toUpperCase() + text.slice(1), details: 'Reported by the patient; no inpatient treatment effects were added by the builder.', pmh: text.charAt(0).toUpperCase() + text.slice(1), plan: () => ['History noted; no active treatment this admission unless symptomatic. Continue home regimen if applicable.'], custom: true });
    });
    applySocial(ctx, spec);
    applyBaseline(ctx, spec);
    applyContrast(ctx, spec);
    adaptDiet(ctx, spec);
    adaptFluids(ctx, spec);
    applyDirectives(ctx, spec);
    // keep diagnosis stages sorted and the problem list free of duplicates
    spec.comorb = spec.comorb.filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i);
  }

  // ---------- Social history ----------
  function applySocial(ctx, spec) {
    const s = ctx.social || {};
    const helper = HX.helpers;
    if (/Current/i.test(s.tobacco || '')) {
      const heavy = /≥|1\+|1 ppd|heavy/i.test(s.tobacco);
      helper.home(spec, { key: 'nicotine_patch', name: 'nicotine (NICODERM CQ) 24 hour patch', dose: heavy ? '21 mg' : '14 mg', route: 'Transdermal', freq: 'daily', at: ['0900'], cls: 'Nicotine replacement', info: 'Rotate sites; remove old patch. Do not smoke while wearing patch.', indication: 'Tobacco use disorder', home: false, startH: 3 });
      helper.order(spec, { name: 'Tobacco cessation counseling', category: 'Nursing', frequency: 'Once', instructions: 'Offer cessation counseling and quitline information before discharge.', startH: 6 });
    }
    if (/Heavy/i.test(s.alcohol || '')) {
      helper.order(spec, { name: 'CIWA-Ar alcohol withdrawal assessment', category: 'Nursing', frequency: 'Every 4 hours (every 1 hour after PRN dose)', instructions: 'Score CIWA-Ar; give lorazepam per protocol for score of 10 or greater. Notify provider for score above 20, seizure, or hallucinations.', startH: 3, stopH: 96, nursing: ['Seizure and fall precautions; keep room quiet and well lit.'] });
      helper.home(spec, { key: 'thiamine', name: 'thiamine tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B1', info: 'Give before any dextrose-containing fluids.', variants: { npo: { name: 'thiamine injection', route: 'IV' } }, indication: 'Alcohol use disorder', home: false });
      helper.home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], indication: 'Alcohol use disorder', home: false });
      helper.home(spec, { key: 'multivitamin', name: 'multivitamin tablet', dose: '1 tablet', route: 'Oral', freq: 'daily', cls: 'Vitamin', holdIf: ['npo'], indication: 'Alcohol use disorder', home: false });
      helper.home(spec, { key: 'lorazepam_ciwa', name: 'lorazepam (ATIVAN) tablet', dose: '1-2 mg per CIWA score', route: 'Oral', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'CIWA-Ar 10 or greater', cls: 'Benzodiazepine', info: 'Hold for sedation (RASS -2 or lower) or RR below 12. Reassess CIWA 1 hour after dose.', monitor: ['RR', 'SPO2', 'BP'], home: false, stopH: 96, indication: 'Alcohol withdrawal prevention', highAlert: true });
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 1;
      for (let h = 3; h <= 120; h += 8) {
        const t = h; // assume last drink about 16 h before arrival -> withdrawal peaks at 36-72 h after last drink
        const hoursSinceDrink = t + 16;
        const score = Math.round(U.clamp(3 + 9 * Math.exp(-Math.pow((hoursSinceDrink - 48) / 26, 2)) + (hoursSinceDrink > 96 ? -2 : 0), 1, 18));
        spec.assessments.unshift({ fromH: h, items: [['Safety', 'CIWA-Ar Score', `${score} (${score < 8 ? 'mild' : score < 15 ? 'moderate' : 'severe'})`]] });
      }
      sticky(spec, 'Alcohol withdrawal risk', 'Heavy daily alcohol use. CIWA-Ar q4h; seizure and fall precautions. Last drink about 16 h before arrival.');
    } else if (/Moderate/i.test(s.alcohol || '')) {
      helper.home(spec, { key: 'thiamine', name: 'thiamine tablet', dose: '100 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B1', info: 'Give before any dextrose-containing fluids.', variants: { npo: { name: 'thiamine injection', route: 'IV' } }, indication: 'Daily alcohol use', home: false });
      helper.home(spec, { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', cls: 'Vitamin B9', holdIf: ['npo'], indication: 'Daily alcohol use', home: false });
    }
    if (/Past|Cannabis/i.test(s.drugs || '') && /Past/i.test(s.drugs)) spec.pastSubstance = true;
  }
  const sticky = (spec, title, body) => spec.stickies.push({ title, body });

  // ---------- Baseline inpatient care ----------
  function firstSurgery(spec) { return spec.events.filter(e => e.type === 'surgery').sort((a, b) => a.h - b.h)[0] || null; }

  function applyBaseline(ctx, spec) {
    const H = HX.helpers;
    const surgery = firstSurgery(spec);
    const q = (name, extra) => !spec.orders.some(o => o.name.toLowerCase().startsWith(name.toLowerCase())) && H.order(spec, extra);

    q('Vital signs', { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', instructions: 'Notify provider for SBP below 90 or above 180, HR above 120 or below 50, RR above 28, SpO2 below 90%, or temperature above 101.5 F.', startH: 2.5 });
    const ioStrict = ['chf', 'sbo', 'sepsis', 'cholecystitis'].includes(spec.primaryKey) || ctx.renal !== 'none' || ctx.has('hf');
    q(ioStrict ? 'Strict intake and output' : 'Intake and output', { name: ioStrict ? 'Strict intake and output' : 'Intake and output', category: 'Nursing', frequency: 'Every shift', instructions: 'Record all oral and IV intake and all output (urine, drains, emesis).', startH: 2.5 });
    q('Fall precautions', { name: 'Fall precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Call light in reach, bed low, non-skid footwear, assist with ambulation.', startH: 2.5 });
    H.order(spec, { name: 'CBC and basic metabolic panel', category: 'Laboratory', frequency: 'Daily AM', instructions: 'Draw at 0500.', startH: 3 });
    if ((spec.isolation || 'None') !== 'None') H.order(spec, { name: spec.isolation, category: 'Precautions', frequency: 'Continuous', instructions: `Maintain ${spec.isolation.toLowerCase()} per policy; sign on the door.`, startH: 3 });

    // Pre-operative ECG for older / cardiac patients
    if (surgery && !spec.events.some(e => e.type === 'cardiology') && (ctx.age >= 50 || ['cad', 'hf', 'afib', 'htn', 'dm2'].some(k => ctx.has(k)))) {
      spec.events.push({ type: 'cardiology', h: 3.2, study: '12-lead ECG', label: 'Pre-operative ECG', indication: 'Pre-operative evaluation', impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response. No acute ST-T wave changes.' : 'Normal sinus rhythm. No acute ST-T wave changes.' });
    }

    // Labs: ED draw and daily AM draw
    const edCodes = ['WBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'Sodium', 'Potassium', 'Chloride', 'CO2', 'BUN', 'Creatinine', 'Glucose', 'Calcium', 'eGFR'];
    spec.labSchedule.unshift({ h: 0.5, codes: edCodes });
    spec.labSchedule.unshift({ daily: true, codes: [...edCodes, 'Magnesium'] });

    // Peripheral IV(s)
    if (!spec.devices.some(d => d.deviceType === 'IV')) {
      const side = ctx.has('esrd') ? 'Right' : 'Right';
      spec.devices.unshift({ deviceType: 'IV', type: 'Peripheral IV', location: `${side} forearm`, siteMarker: 'rightForearm', gauge: '20 gauge', placeH: 0.4, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact; flushes easily' });
    }

    // DVT prophylaxis
    const afib = ctx.has('afib');
    const base = { key: 'dvt_ppx', cls: 'Anticoagulant (prophylaxis)', info: 'Monitor for bleeding, bruising, platelets and renal function. Never give if platelets below 50 or active bleeding.', monitor: ['Hgb', 'Plt', 'Cr'], indication: 'VTE prophylaxis' };
    const lateSurgery = surgery && surgery.h > 16;            // surgery not on the day of arrival: prophylaxis starts pre-operatively
    const ppxStart = spec.ppxStartH !== undefined ? spec.ppxStartH : (surgery && !lateSurgery ? surgery.h + (surgery.duration || 1) + 12 : 4);
    const sw = spec.flags.surgeryWindow;
    const swEnd = sw && sw.length ? Math.max(...sw.map(w => w[1])) : undefined;
    const ppxStop = afib ? swEnd : undefined; // apixaban resumes when the surgery window closes
    const team = spec.primaryTeam || 'hospitalist';
    // patients already on full-dose anticoagulation for a mechanical valve do not also get prophylaxis-dose enoxaparin/heparin
    const onTherapeutic = !!spec.therapeuticAnticoagulation || spec.meds.some(m => /warfarin/i.test(m.name));
    if (!onTherapeutic && !(afib && swEnd === undefined)) {
      const heparin = ctx.renal !== 'none' && (ctx.renal === 'esrd' || (spec.labBase.Creatinine || 1) > 2.2);
      const mk = (start, stop) => heparin
        ? Object.assign({}, base, { key: 'heparin_ppx', name: 'heparin injection', dose: '5,000 units', route: 'Subcutaneous', freq: 'q8h', startH: start, stopH: stop, by: team, highAlert: true })
        : Object.assign({}, base, { key: 'enoxaparin', name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: ctx.bmi >= 40 ? 'q12h' : 'daily', anchorStart: true, startH: start, stopH: stop, by: team, highAlert: true, hold: 'Hold and notify provider for active bleeding or platelets below 50.' });
      if (lateSurgery) {
        // pre-op heparin SQ, held 1 hour before surgery, enoxaparin/heparin again about 12 hours after
        spec.meds.push(Object.assign({}, base, { key: 'heparin_ppx_preop', name: 'heparin injection', dose: '5,000 units', route: 'Subcutaneous', freq: 'q8h', startH: ppxStart, stopH: surgery.h - 1, by: team, highAlert: true }));
        spec.meds.push(mk(surgery.h + (surgery.duration || 1) + 12, ppxStop));
      } else spec.meds.push(mk(ppxStart, ppxStop));
    }
    if (surgery && !spec.orders.some(o => /sequential compression/i.test(o.name))) H.order(spec, { name: 'Sequential compression devices', category: 'Nursing', frequency: 'Continuous when in bed', instructions: 'Apply SCDs to both legs until fully ambulatory.', startH: 3 });

    // Acetaminophen PRN if the diagnosis profile did not supply analgesia
    if (!spec.meds.some(m => /acetaminophen/i.test(m.name))) {
      spec.meds.push({ key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'mild pain or fever', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources.', monitor: ['Temp', 'Pain'], indication: 'Mild pain / fever', startH: 3, by: 'hospitalist', prnGiven: [], variants: { npo: { name: 'acetaminophen (OFIRMEV) IVPB', dose: '1 g', route: 'IV' } } });
    }
    // Bowel regimen with opioids (not while NPO / ileus)
    if (!spec.noBowelRegimen && spec.meds.some(m => /^opioid/i.test(m.cls || ''))) {
      const first = Math.min(...spec.meds.filter(m => /^opioid/i.test(m.cls || '')).map(m => m.startH));
      spec.meds.push({ key: 'senna_docusate', name: 'senna-docusate (SENOKOT-S) tablet', dose: '2 tablets', route: 'Oral', freq: 'BID', cls: 'Stimulant laxative / stool softener', info: 'Hold for loose stools. Goal: a bowel movement at least every other day.', holdIf: ['npo'], holdReason: 'NPO', startH: Math.max(first, 3), by: spec.primaryTeam || 'hospitalist', indication: 'Opioid-induced constipation prevention' });
    }
    // Continuous pulse oximetry for OSA or opioid + obesity
    if (spec.osa || (ctx.has('obesity') && spec.meds.some(m => /^opioid/i.test(m.cls || '')))) H.order(spec, { name: 'Continuous pulse oximetry while on opioids', category: 'Nursing', frequency: 'Continuous', instructions: 'Notify provider for SpO2 below 90% or RR below 10.', startH: 3 });
  }

  // ---------- Contrast allergy pre-medication ----------
  function applyContrast(ctx, spec) {
    if (!ctx.allergic('contrast')) return;
    spec.events.filter(e => e.type === 'imaging' && e.contrast).forEach(e => {
      spec.meds.push({ key: 'methylpred_premed', name: 'methylprednisolone (SOLU-MEDROL) injection', dose: '40 mg', route: 'IV', freq: 'once', startH: Math.max(0.1, e.h - 1.3), cls: 'Corticosteroid', info: 'Contrast-allergy premedication.', by: 'ed', indication: 'Contrast allergy premedication' });
      spec.meds.push({ key: 'diphenhydramine_premed', name: 'diphenhydramine (BENADRYL) injection', dose: '50 mg', route: 'IV', freq: 'once', startH: Math.max(0.1, e.h - 1.0), cls: 'Antihistamine', info: 'Contrast-allergy premedication; causes drowsiness.', by: 'ed', indication: 'Contrast allergy premedication' });
      e.premed = true;
      spec.applied.push(`Contrast allergy: premedicated before ${e.study}.`);
    });
  }

  // ---------- Diet and fluid adaptation ----------
  function adaptDiet(ctx, spec) {
    const parts = [];
    if (ctx.renal === 'esrd') parts.push('renal');
    else if (ctx.renal === 'ckd3') parts.push('renal');
    if (ctx.has('hf') && !parts.includes('renal')) parts.push('2 g sodium');
    if (ctx.has('dm2')) parts.push('consistent carbohydrate');
    if (!parts.length) return;
    const label = parts.join(', ');
    spec.orders.forEach(o => {
      if (o.category === 'Diet' && /^(regular|general|low residue|soft|heart)/i.test(o.name) && !/fluid restriction/i.test(o.name)) {
        o.name = `${U.cap(label)} diet${/low residue/i.test(o.name) ? ' (low residue)' : ''}`;
        o.instructions = (o.instructions ? o.instructions + ' ' : '') + `Modified for ${label}.`;
      }
    });
  }

  function adaptFluids(ctx, spec) {
    if (!(spec.fluidSensitive || ctx.renal === 'esrd')) return;
    spec.meds.forEach(m => {
      if (m.fluid && m.freq === 'continuous' && m.mlPerHr) {
        const reduced = Math.max(40, Math.round(m.mlPerHr * 0.5 / 5) * 5);
        spec.applied.push(`${m.name} reduced from ${m.mlPerHr} to ${reduced} mL/hr (heart failure / ESRD fluid caution).`);
        m.mlPerHr = reduced; m.rate = `${reduced} mL/hr`;
        m.dose = m.rate; m.nursing = [...(m.nursing || []), 'Reduced rate for heart failure/ESRD; assess lungs, edema and weight daily.'];
      }
      if (m.bolus && m.bolusMl) { const r = Math.max(250, Math.round(m.bolusMl * 0.5 / 250) * 250); m.dose = `${r} mL`; m.bolusMl = r; m.nursing = [...(m.nursing || []), 'Reduced bolus volume for heart failure/ESRD; reassess after each 250-500 mL.']; spec.applied.push(`${m.name} bolus reduced to ${r} mL (fluid caution).`); }
    });
  }

  // ---------- Faculty direction keywords ----------
  function applyDirectives(ctx, spec) {
    const text = (ctx.input.facultyNotes || '').trim();
    spec.directives = { matched: [], text };
    if (!text) return;
    const H = HX.helpers, hit = m => spec.directives.matched.push(m);
    if (/foley|urinary catheter/i.test(text)) {
      spec.devices.push({ deviceType: 'Tube', type: 'Foley catheter', location: 'Urethral', siteMarker: 'pelvis', placeH: 3, status: 'Draining', assess: 'draining clear yellow urine, secured to thigh, no leaking', drainage: '' });
      H.order(spec, { name: 'Indwelling urinary catheter care', category: 'Nursing', frequency: 'Every shift', instructions: 'Perineal care; keep bag below bladder; assess daily need for removal.', startH: 3 });
      hit('Foley catheter added');
    }
    if (/confus|delirium|agitat/i.test(text)) {
      spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2;
      spec.assessments.push({ fromH: 24, items: [['Neurologic', 'Orientation', 'Oriented to person only; intermittently confused'], ['Neurologic', 'Level of Consciousness', 'Alert, restless, easily distracted'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, hourly rounding']] });
      H.order(spec, { name: 'Delirium precautions and frequent reorientation', category: 'Precautions', frequency: 'Continuous', instructions: 'Reorient often; sleep hygiene; glasses/hearing aids; avoid restraints.', startH: 24 });
      sticky(spec, 'New confusion', 'Faculty scenario: intermittent confusion since hospital day 2. Assess for pain, urinary retention, constipation, infection, and medication causes.');
      hit('Delirium assessment and precautions added');
    }
    if (/dnr|do not resuscitate/i.test(text) && ctx.input.codeStatus === 'Full Code') { ctx.input.codeStatus = 'DNR / DNI'; hit('Code status set to DNR / DNI'); }
    if (/(no|avoid|without) insulin/i.test(text)) { spec.meds = spec.meds.filter(m => !/insulin/i.test(m.name)); hit('Insulin removed'); }
    if (/c\.? ?diff|mrsa|vre|contact (isolation|precautions)/i.test(text)) { spec.isolation = 'Contact precautions'; H.order(spec, { name: 'Contact precautions', category: 'Precautions', frequency: 'Continuous', instructions: 'Gown and gloves for all contact; dedicated equipment; soap and water hand hygiene for C. difficile.', startH: 3 }); hit('Contact precautions added'); }
    if (/pressure (injury|ulcer)|bedsore/i.test(text)) { spec.assessments.push({ fromH: 3, items: [['Skin', 'Skin', 'Stage 2 pressure injury to sacrum, 3 x 2 cm, pink wound bed, no drainage'], ['Skin', 'Braden Score', '13']] }); H.order(spec, { name: 'Wound care and turning schedule', category: 'Nursing', frequency: 'Every 2 hours', instructions: 'Turn every 2 hours, offload sacrum, barrier dressing per wound care.', startH: 3 }); hit('Sacral pressure injury added'); }
    if (/high fall|fall risk|fall precautions/i.test(text)) { spec.fallRiskBoost = (spec.fallRiskBoost || 0) + 2; hit('Fall risk raised'); }
    if (/hypoglyc/i.test(text) && ctx.has('dm2')) { spec.labAdd.Glucose = (spec.labAdd.Glucose || 0) - 70; hit('Lower glucose trend'); }
    spec.directives.unmatched = text;
  }

  // ---------- Sanity checks shown in the validation tab ----------
  function sanityChecks(ctx, spec, S, canonical) {
    const w = [];
    const add = (level, text) => w.push({ level, text });
    const key = ctx.input.primary;
    if (key === 'appendicitis' && ctx.surg.has('appendectomy')) add('error', 'Patient has a prior appendectomy but the primary diagnosis is appendicitis. Remove one.');
    if (key === 'cholecystitis' && ctx.surg.has('cholecystectomy')) add('error', 'Patient has a prior cholecystectomy but the primary diagnosis is cholecystitis. Remove one.');
    if (key === 'sbo' && !['appendectomy', 'colectomy', 'hernia', 'abd_other', 'hysterectomy', 'csection', 'cholecystectomy'].some(k => ctx.surg.has(k))) add('warning', 'Small bowel obstruction without prior abdominal surgery or hernia is unusual. Consider adding abdominal surgical history (adhesions).');
    if (ctx.surg.has('hysterectomy') && ctx.male) add('error', 'Hysterectomy selected for a male patient.');
    if (ctx.surg.has('csection') && ctx.male) add('error', 'Cesarean section selected for a male patient.');
    if (ctx.hx.has('bph') && ctx.female) add('warning', 'BPH selected for a female patient.');
    const ckdPicked = CKD_CHAIN.filter(k => (ctx.input.hx || []).includes(k));
    if (ckdPicked.length > 1) add('info', `Several kidney disease stages were selected (${ckdPicked.map(k => HX.M[k] ? HX.M[k].label : k).join(', ')}); only the most advanced was used.`);
    if ((ctx.input.hx || []).includes('dm1') && (ctx.input.hx || []).includes('dm2')) add('warning', 'Both type 1 and type 2 diabetes are selected.');
    if ((ctx.input.hx || []).includes('afib') && (ctx.input.hx || []).includes('flutter')) add('info', 'Atrial fibrillation and atrial flutter are both selected; the chart treats them together.');
    if (ctx.L > (spec.typicalLOS ? spec.typicalLOS[1] : 99)) add('info', `Hospital day ${ctx.L} is longer than typical (${spec.typicalLOS[0]}-${spec.typicalLOS[1]} days). The case is written as a prolonged stay with a complication or discharge barrier.`);
    if (ctx.L < 1) add('error', 'Hospital day must be at least 1.');
    if (ctx.renal !== 'none' && S.prepared.some(m => /morphine|ketorolac|ibuprofen|enoxaparin/i.test(m.name) && m.startH <= ctx.nowH && (m.stopH === undefined || m.stopH > ctx.nowH))) add('warning', 'A renally-avoided drug (morphine, NSAID, enoxaparin) is active in a kidney-disease patient.');
    // PO medications while NPO
    const npoNow = S.flag('npo');
    const poWhileNpo = S.activeMeds().filter(m => (npoNow || S.flag('npoStrict')) && m.route === 'Oral' && !m.prn && !m.sips && m.freq !== 'once' && !/metoprolol|carvedilol/i.test(m.name));
    if (poWhileNpo.length) add('warning', `Patient is NPO now but has scheduled oral medication(s): ${poWhileNpo.map(m => m.name.split(' ')[0]).join(', ')}.`);
    // anticoagulants
    if (S.hasMed('apixaban|warfarin') && S.hasMed('enoxaparin|heparin')) add('warning', 'Therapeutic anticoagulant and DVT prophylaxis are both active.');
    const opioid = S.activeMeds().some(m => /^opioid/i.test(m.cls || ''));
    const benzo = S.activeMeds().some(m => /^benzodiazepine/i.test(m.cls || ''));
    if (opioid && benzo) add('info', 'Opioid and benzodiazepine are both active (sedation / respiratory depression risk); good teaching point.');
    // Penicillin allergy vs active penicillin
    if (ctx.allergic('penicillin') && S.hasMed('piperacillin|ampicillin|amoxicillin|penicillin')) add('error', 'Active penicillin-class drug despite a penicillin allergy.');
    // monitoring rules that cannot resolve
    const labCodes = new Set(canonical.observations.filter(o => o.type === 'lab').map(o => o.code));
    let unresolved = 0;
    canonical.orders.filter(o => o.category === 'Medication').forEach(o => {
      o.medication.monitoringRules = o.medication.monitoringRules.filter(r => { const ok = r.sourceType === 'vital' || labCodes.has(r.code); if (!ok) unresolved++; return ok; });
    });
    if (unresolved) add('info', `${unresolved} medication monitoring link(s) were dropped because that lab is not part of this case.`);
    // duplicate medication keys
    const names = canonical.orders.filter(o => o.category === 'Medication' && o.status === 'Active').map(o => o.medication.medKey);
    const dupes = names.filter((k, i) => names.indexOf(k) !== i);
    if (dupes.length) add('warning', `Possible duplicate active medication(s): ${U.uniq(dupes).join(', ')}.`);
    if (!w.length) add('pass', 'No safety or consistency issues found.');
    return w;
  }

  return { applyAll, sanityChecks, firstSurgery, CKD_CHAIN };
})();

/* NursingSim Case Builder - patient status triggers.
   A trigger is a change in the patient's condition that happens DURING the simulated shift (the 8 hours after the
   shift start). Vital signs, nursing findings, labs, provider orders and results are written into the chart with
   timestamps in the future, so the EHR releases them as the simulation clock advances.

   input.trigger = { mode: 'off' | 'auto' | 'manual', key, atMin (minutes after shift start), severity: 'mild'|'moderate'|'severe' }

   To add a trigger, register it:
     NS.triggers.register('key', { label, group, dx: ['hip_fracture'], desc, defaults: { atMin, severity },
                                    eligible(ctx, spec) -> { ok, why }, weight(ctx, spec) -> number, apply(ctx, spec, t) })
   apply() receives t = { O (onset, hours since admission), at(min), sev, sevN, atMin, base(h) } and may add to
   spec.futureVitals, spec.futureAssessments, spec.labSchedule (with `values`), spec.events, spec.meds and spec.orders,
   and must return the faculty key (see peKey below) which is stored on the case as canonical.triggers[0]. */
NS.triggers = (() => {
  const U = NS.util, E = NS.engine;
  const REG = {};
  const register = (key, def) => { REG[key] = Object.assign({ key, dx: [], defaults: { atMin: 90, severity: 'moderate' }, weight: () => 1, eligible: () => ({ ok: true }) }, def); return REG[key]; };

  const forDx = dx => Object.values(REG).filter(d => d.dx.includes(dx) || d.dx.includes('*')).map(d => ({ key: d.key, label: d.label, group: d.group, desc: d.desc, defaults: d.defaults }));

  const SEV = ['mild', 'moderate', 'severe'];

  // ------------------------------------------------------------------------------------------------ choosing and applying
  function resolve(ctx, spec) {
    const t = ctx.input.trigger;
    if (!t || !t.mode || t.mode === 'off') return null;
    const pool = Object.values(REG).filter(d => d.dx.includes(ctx.input.primary) || d.dx.includes('*'));
    const rng = U.mulberry32(U.hashString([ctx.input.mrn, ctx.input.name, ctx.input.primary, ctx.L, 'trigger'].join('|')));
    let def, atMin, severity, auto = false;
    if (t.mode === 'manual') {
      def = REG[t.key];
      if (!def || !(def.dx.includes(ctx.input.primary) || def.dx.includes('*'))) { spec.warnings.push({ level: 'warning', text: 'The selected patient status trigger does not apply to this diagnosis, so none was added.' }); return null; }
      atMin = parseInt(t.atMin, 10); severity = SEV.includes(t.severity) ? t.severity : def.defaults.severity;
    } else {
      auto = true;
      const ok = pool.filter(d => d.eligible(ctx, spec).ok);
      if (!ok.length) { spec.warnings.push({ level: 'info', text: pool.length ? 'Automatic trigger: none of the available triggers fits this patient.' : 'Automatic trigger: no triggers have been written for this diagnosis yet.' }); return null; }
      const total = ok.reduce((s, d) => s + d.weight(ctx, spec), 0);
      let r = rng() * total; def = ok[0];
      for (const d of ok) { r -= d.weight(ctx, spec); if (r <= 0) { def = d; break; } }
      atMin = 45 + Math.round(rng() * 27) * 5;                                   // 45 to 180 minutes into the shift
      const roll = rng(); severity = roll < 0.25 ? 'mild' : roll < 0.8 ? 'moderate' : 'severe';
    }
    if (!(atMin >= 10)) atMin = def.defaults.atMin;
    atMin = U.clamp(atMin, 10, 720);                                              // up to 12 hours into the shift
    return { def, atMin, severity, auto };
  }

  function apply(ctx, spec) {
    const pick = resolve(ctx, spec);
    if (!pick) return;
    const O = ctx.nowH + pick.atMin / 60;
    // a trigger that starts late in the shift gets about 4 more hours to play out, so the shift is lengthened (up to 16 hours)
    if (O + 4 > ctx.windowEnd) ctx.windowEnd = Math.min(ctx.nowH + 16, O + 4);
    const t = {
      O, atMin: pick.atMin, sev: pick.severity, sevN: SEV.indexOf(pick.severity), at: min => O + min / 60,
      base: h => E.vitalsAt(ctx, spec, h, false)
    };
    spec.futureVitals = spec.futureVitals || []; spec.futureAssessments = spec.futureAssessments || [];
    // routine vital signs on the 4-hour clock that fall before the change, so the patient looks stable until it happens
    const first = U.parse(ctx.ts(ctx.nowH));
    for (let ms = Math.ceil((first + 1) / (4 * 3600000)) * 4 * 3600000; ms < U.parse(ctx.ts(O)) - 10 * 60000; ms += 4 * 3600000) {
      const h = (ms - U.parse(ctx.admit)) / 3600000;
      if (h > ctx.nowH && h <= ctx.windowEnd) spec.futureVitals.push(Object.assign({ h }, E.vitalsAt(ctx, spec, h, true)));
    }
    const key = pick.def.apply(ctx, spec, t) || {};
    spec.events.push({ type: 'trigger', h: O, label: `SCENARIO TRIGGER: ${pick.def.label} (${pick.severity})` });
    spec.triggerMeta = Object.assign({
      id: `trigger_${pick.def.key}`, key: pick.def.key, label: pick.def.label, severity: pick.severity, chosen: pick.auto ? 'automatic' : 'manual',
      onset: ctx.ts(O), minutesAfterShiftStart: pick.atMin, facultyOnly: true
    }, key);
    spec.applied.push(`Scenario trigger: ${pick.def.label}, ${pick.severity}, starting ${U.hhmm(ctx.ts(O))} (${pick.auto ? 'chosen automatically' : 'chosen by you'}).`);
  }

  // ------------------------------------------------------------------------------------------------ small helpers
  const clampV = v => ({
    temp: U.round(U.clamp(v.temp, 95.5, 106), 1), hr: Math.round(U.clamp(v.hr, 38, 190)), sbp: Math.round(U.clamp(v.sbp, 60, 230)), dbp: Math.round(U.clamp(v.dbp, 30, 130)),
    rr: Math.round(U.clamp(v.rr, 8, 44)), spo2: Math.round(U.clamp(v.spo2, 60, 100)), pain: Math.round(U.clamp(v.pain, 0, 10))
  });
  const surgeryOf = spec => spec.events.filter(e => e.type === 'surgery').sort((a, b) => a.h - b.h)[0] || null;
  const fmtU = n => Math.round(n).toLocaleString('en-US');

  // ================================================================================================ HIP FRACTURE: POST-OPERATIVE PULMONARY EMBOLISM
  register('hip_fracture_pe', {
    label: 'Pulmonary embolism (sudden shortness of breath)', group: 'Complication', dx: ['hip_fracture'],
    desc: 'A blood clot travels to the lungs: sudden shortness of breath, chest pain, fast heart rate and falling oxygen level, with a swollen calf. Tests the nurse\'s recognition, rapid assessment, oxygen, escalation (SBAR/rapid response) and anticoagulation safety.',
    defaults: { atMin: 90, severity: 'moderate' },
    eligible: ctx => ctx.has('hx_vte') ? { ok: false, why: 'The patient is already fully anticoagulated for a prior clot.' } : { ok: true },
    weight: ctx => ctx.has('hx_vte') || ctx.has('afib') || ctx.has('flutter') ? 0.5 : 1,
    apply(ctx, spec, t) {
      const O = t.O, at = t.at, sevN = t.sevN, kg = ctx.weightKg || 80, fx = surgeryOf(spec);
      const post = fx && fx.h + (fx.duration || 1) <= O;
      const dayOf = h => ctx.ts(h).slice(0, 10), dayDiff = (a, b) => Math.round((U.parse(`${dayOf(b)} 00:00`) - U.parse(`${dayOf(a)} 00:00`)) / 86400000);
      const pod = post ? dayDiff(fx.h + (fx.duration || 1), O) : null;   // calendar days since the operation, like the rest of the chart
      const esrd = ctx.renal === 'esrd';

      // ---- vital signs: sudden change, then (for mild/moderate) partial improvement once oxygen and heparin are running
      const d = { hr: [22, 36, 52][sevN], rr: [6, 10, 14][sevN], spo2: [4, 8, 14][sevN], sbp: [6, 16, 44][sevN], dbp: [3, 8, 22][sevN], temp: [0.3, 0.5, 0.7][sevN], pain: [5, 7, 8][sevN] };
      const minutes = [0, 15, 30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 420, 480];
      minutes.forEach(m => {
        const h = at(m); if (h > ctx.windowEnd) return;
        const b = t.base(h);
        const o2on = m >= 30;                                                       // oxygen is ordered about 25 minutes after the change
        const improve = sevN === 2 ? (m >= 150 ? 0.9 : 1) : (m >= 150 ? 0.62 : m >= 90 ? 0.8 : 1);
        const f = Math.min(1, (m + 4) / 8) * improve;
        const v = clampV({
          temp: b.temp + d.temp * Math.min(1, f + 0.3), hr: b.hr + d.hr * f, rr: b.rr + d.rr * f, spo2: b.spo2 - d.spo2 * f + (o2on ? [3, 4, 3][sevN] : 0),
          sbp: b.sbp - d.sbp * f, dbp: b.dbp - d.dbp * f, pain: Math.max(b.pain, d.pain * (m >= 150 ? 0.7 : 1))
        });
        v.o2 = o2on ? (sevN === 2 ? '15 L non-rebreather mask' : '4 L nasal cannula') : (b.o2 || 'Room air');
        spec.futureVitals.push(Object.assign({ h }, v));
      });

      // ---- nursing findings at three points
      const items0 = [
        ['Neurologic', 'Level of Consciousness', sevN === 2 ? 'Lethargic, anxious, intermittently confused' : 'Alert, anxious and restless; states "something is wrong"'],
        ['Respiratory', 'Respiratory Effort', sevN === 2 ? 'Severe dyspnea, accessory muscle use, unable to speak more than 2-3 words' : 'Tachypneic and shallow, accessory muscle use, speaks in short phrases'],
        ['Respiratory', 'Breath Sounds', 'Clear bilaterally with diminished sounds at the right base; no wheeze or crackles'],
        ['Respiratory', 'Cough', sevN === 2 ? 'Dry cough with one episode of blood-tinged sputum' : 'Dry, non-productive'],
        ['Respiratory', 'Oxygen Device', 'Room air (not yet applied)'],
        ['Cardiac', 'Rhythm', 'Sinus tachycardia on the monitor'],
        ['Cardiac', 'Heart Sounds', 'S1 S2 regular, tachycardic, no murmur'],
        ['Cardiac', 'Edema', 'Right calf swollen (about 3 cm larger than the left), warm and tender; left leg no edema'],
        ['Cardiac', 'Capillary Refill', sevN === 2 ? 'Greater than 4 seconds, cool extremities' : '3 seconds'],
        ['Skin', 'Skin', sevN === 0 ? 'Pale, slightly diaphoretic' : 'Pale and diaphoretic'],
        ['Pain', 'Pain Location', 'Right-sided chest, sharp, worse on deep inspiration'],
        ['Pain', 'Pain Score', `${d.pain}/10`]
      ];
      spec.futureAssessments.push({ h: at(0), items: items0 });
      const o2Text = sevN === 2 ? '15 L/min via non-rebreather mask' : '4 L/min via nasal cannula';
      spec.futureAssessments.push({ h: at(40), items: [
        ['Respiratory', 'Oxygen Device', o2Text],
        ['Respiratory', 'Respiratory Effort', sevN === 2 ? 'Labored, accessory muscle use, speaking in single words' : 'Tachypneic, less distressed with oxygen; speaking in short sentences'],
        ['Neurologic', 'Level of Consciousness', sevN === 2 ? 'Drowsy but arousable to voice, anxious' : 'Alert, anxious but calmer']
      ] });
      spec.futureAssessments.push({ h: at(150), items: [
        ['Respiratory', 'Respiratory Effort', sevN === 2 ? 'Labored, remains unstable; ICU team at bedside' : 'Mildly tachypneic, speaks in full sentences'],
        ['Pain', 'Pain Score', sevN === 2 ? '8/10' : '4/10'],
        ['Cardiac', 'Rhythm', sevN === 2 ? 'Sinus tachycardia, occasional PVCs' : 'Sinus tachycardia, improving']
      ] });

      // ---- labs drawn when the provider orders them
      const val = (a, b, c) => [a, b, c][sevN];
      spec.labSchedule.push({ h: at(35), codes: ['pH', 'PaCO2', 'PaO2', 'HCO3', 'Troponin I', 'BNP', 'D-dimer', 'Lactate', 'Creatinine', 'eGFR', 'BUN', 'Potassium', 'Hemoglobin', 'Platelets', 'aPTT', 'INR'],
        values: { pH: val(7.45, 7.48, 7.41), PaCO2: val(33, 30, 27), PaO2: val(74, 62, 51), HCO3: val(23, 22, 17), 'Troponin I': val(0.06, 0.12, 0.34), BNP: val(240, 410, 760), 'D-dimer': val(2900, 4850, 8200), Lactate: val(1.6, 2.4, 4.2), aPTT: 29, INR: 1.1 } });
      if (at(210) <= ctx.windowEnd) spec.labSchedule.push({ h: at(210), codes: ['Troponin I'], values: { 'Troponin I': val(0.05, 0.16, 0.41) } });

      // ---- provider response (timed as if the nurse notifies the provider within about 10 minutes)
      const risk = [];
      risk.push(post ? `recent hip surgery (post-operative day ${pod})` : 'hip fracture with immobility awaiting surgery');
      if (ctx.age >= 65) risk.push(`age ${ctx.age}`);
      if (ctx.bmi >= 30) risk.push(`obesity (BMI ${ctx.bmi})`);
      risk.push('bed rest / limited mobility');
      if (ctx.has('hx_vte')) risk.push('prior clot'); if (ctx.has('pad')) risk.push('peripheral arterial disease');
      if (['breast_cancer', 'lung_cancer', 'prostate_cancer', 'colon_cancer', 'lymphoma_leukemia', 'multiple_myeloma'].some(k => ctx.has(k))) risk.push('cancer history');

      spec.events.push({ type: 'consult', h: at(12), service: 'Hospitalist (urgent bedside evaluation)', author: 'hospitalist', orderLead: 0.03, reason: 'Acute dyspnea, chest pain, tachycardia and hypoxia', label: 'Hospitalist evaluates at bedside (rapid response)',
        recommendation: `Concern for pulmonary embolism (Wells high risk${post ? ', recent surgery' : ''}). Oxygen to keep SpO2 92% or higher, 12-lead ECG, CXR, ABG, troponin, BNP, D-dimer, BMP/CBC/aPTT/INR. ${esrd ? 'ESRD: V/Q scan instead of CT contrast.' : 'CT pulmonary angiogram (check renal function and contrast allergy).'} Start therapeutic unfractionated heparin now (UFH rather than enoxaparin because it is short-acting and reversible after surgery); stop prophylactic enoxaparin. Telemetry and continuous pulse oximetry; bed rest.` });
      spec.events.push({ type: 'cardiology', h: at(30), orderLead: 0.1, study: '12-lead ECG', label: 'ECG', indication: 'Chest pain, dyspnea, tachycardia',
        impression: `Sinus tachycardia, rate ${Math.round(t.base(at(30)).hr + d.hr)}. T-wave inversions V1-V3 and an S1Q3T3 pattern consistent with right heart strain. No ST elevation. Compared with the previous ECG: new.` });
      spec.events.push({ type: 'imaging', h: at(40), orderLead: 0.2, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Acute dyspnea and hypoxia', findings: 'Low lung volumes with mild right basilar atelectasis. No pneumothorax, consolidation or pulmonary edema. Normal heart size.', impression: 'No acute cardiopulmonary process explaining the hypoxia; pulmonary embolism not excluded.' });
      if (esrd) {
        spec.events.push({ type: 'imaging', h: at(110), orderLead: 0.5, study: 'Ventilation-perfusion (V/Q) scan', modality: 'Nuclear medicine', indication: 'Suspected pulmonary embolism; ESRD (avoid iodinated contrast)', findings: 'Multiple wedge-shaped perfusion defects in the right lower lobe and left lower lobe with preserved ventilation (mismatched).', impression: 'High probability for pulmonary embolism.' });
      } else {
        spec.events.push({ type: 'imaging', h: at(70), orderLead: 0.6, study: 'CT pulmonary angiogram (chest with IV contrast)', modality: 'CT', contrast: true, indication: 'Suspected pulmonary embolism',
          findings: `Filling defects in the right lower lobe lobar and segmental pulmonary arteries and in the left lower lobe segmental arteries. RV/LV ratio ${val('0.9', '1.2', '1.5')}${sevN > 0 ? ', with flattening of the interventricular septum' : ''}. No pulmonary infarct. ${sevN === 2 ? 'Small right pleural effusion.' : 'No pleural effusion.'}`,
          impression: `Acute bilateral pulmonary emboli${sevN > 0 ? ' with CT evidence of right heart strain' : ', no right heart strain'}.` });
      }
      if (sevN === 2) spec.events.push({ type: 'consult', h: at(75), service: 'Critical Care / PERT', author: 'pulm', orderLead: 0.1, reason: 'High-risk pulmonary embolism with hypotension', label: 'Critical care / PE response team consulted',
        recommendation: 'Hemodynamically unstable PE. Continue heparin infusion. Systemic thrombolysis is relatively contraindicated (major surgery within the past days): catheter-directed therapy or surgical embolectomy to be discussed. Transfer to ICU, arterial line, avoid large fluid boluses (RV overload), norepinephrine if SBP stays below 90.' });
      if (sevN > 0) spec.events.push({ type: 'transfer', h: at(120), label: sevN === 2 ? 'Transferred to the ICU' : 'Transferred to the progressive care unit (telemetry, continuous SpO2)', text: `Transferred from the surgical unit to the ${sevN === 2 ? 'ICU' : 'progressive care unit'} for monitoring on a heparin infusion.` });

      // stop prophylaxis; start heparin
      spec.meds.forEach(m => { if (/^(enoxaparin|heparin_ppx|heparin_ppx_preop|dvt_ppx)$/.test(m.key || '')) { if (m.startH >= at(45)) m.when = false; else if (m.stopH === undefined || m.stopH > at(45)) m.stopH = at(45); } });
      const bolus = Math.min(10000, Math.round(80 * kg / 100) * 100), rate = Math.min(2000, Math.round(18 * kg / 50) * 50), ml = U.round(rate / 100, 1);
      spec.meds.push({ key: 'heparin_bolus', name: 'heparin injection (VTE bolus)', dose: `${fmtU(bolus)} units (80 units/kg${bolus >= 10000 ? ', max' : ''})`, route: 'IV', freq: 'once', startH: at(45), cls: 'Anticoagulant', highAlert: true,
        info: 'HIGH-ALERT. Weight-based bolus using actual body weight. Independent double check of dose and weight. Check for active bleeding and the surgical site first.', monitor: ['Hgb', 'Plt'], hold: 'Hold and call provider for active bleeding, platelets below 50, or a surgical site that is bleeding.',
        indication: 'Acute pulmonary embolism', by: 'hospitalist', nursing: ['Confirm baseline aPTT, platelets and hemoglobin are drawn.', 'Independent double check with a second nurse.'] });
      spec.meds.push({ key: 'heparin_infusion', name: 'heparin infusion (VTE nomogram)', dose: `${fmtU(rate)} units/hr (18 units/kg/hr)`, rate: `${ml} mL/hr`, mlPerHr: ml, concentration: '25,000 units in 250 mL (100 units/mL)', route: 'IV', freq: 'continuous', startH: at(46), cls: 'Anticoagulant', highAlert: true,
        info: 'HIGH-ALERT. Smart-pump with the heparin library. aPTT 6 hours after the start (goal 60-85 seconds), then per nomogram. Independent double check of rate and bag with every change. Monitor the surgical site, drains and incision for bleeding, and watch for falling hemoglobin.', monitor: ['Hgb', 'Plt'],
        hold: 'Hold 1 hour and call provider for aPTT above 100 seconds, any bleeding, new neurologic change, or platelets falling more than 50%.', indication: 'Acute pulmonary embolism', by: 'hospitalist',
        nursing: ['Bleeding precautions: no IM injections, soft toothbrush, electric razor.', 'Do not give prophylactic enoxaparin or heparin while the infusion runs.'] });
      [
        { name: 'Supplemental oxygen: titrate to SpO2 92% or higher', category: 'Respiratory', frequency: 'Continuous, titrate', startH: at(25), instructions: `Start ${sevN === 2 ? '15 L/min non-rebreather mask' : '2-4 L/min nasal cannula'}; titrate to SpO2 92% or higher. Notify provider if oxygen need is rising.`, by: 'hospitalist' },
        { name: 'Continuous cardiac monitoring and pulse oximetry', category: 'Nursing', frequency: 'Continuous', startH: at(25), instructions: 'Telemetry and continuous SpO2 with alarms on.', by: 'hospitalist' },
        { name: 'Frequent vital signs and respiratory assessment', category: 'Nursing', frequency: 'Every 15 minutes x 4, every 30 minutes x 4, then every hour', startH: at(25), instructions: 'Report SBP below 90, HR above 130, SpO2 below 90%, or RR above 30 immediately.', by: 'hospitalist' },
        { name: 'Bed rest; head of bed elevated', category: 'Activity', frequency: 'Continuous', startH: at(25), instructions: 'Strict bed rest until cleared by the provider. Do not massage the affected leg.', by: 'hospitalist' },
        { name: 'Bleeding precautions while on heparin', category: 'Precautions', frequency: 'Continuous', startH: at(45), instructions: 'No IM injections; hold pressure on puncture sites; monitor the incision/dressing, drains, urine and stool for bleeding.', by: 'hospitalist' },
        { name: 'aPTT 6 hours after heparin start, then per nomogram', category: 'Laboratory', frequency: 'Every 6 hours until therapeutic', startH: at(45), instructions: 'Draw from the arm opposite the heparin infusion.', by: 'hospitalist' }
      ].forEach(o => spec.orders.push(o));

      // ---- the faculty key
      return {
        scenario: `${post ? `Post-operative day ${pod}` : 'Pre-operative'} hip fracture patient. About ${t.atMin} minutes into the shift (${U.hhmm(ctx.ts(O))}) a clot reaches the lungs. Severity: ${t.sev}. ${risk.length ? 'Risk factors present: ' + risk.join('; ') + '.' : ''}`,
        cues: [
          { at: U.hhmm(ctx.ts(O)), text: `Sudden shortness of breath and ${d.pain}/10 right-sided chest pain; patient says "something is wrong".` },
          { at: U.hhmm(ctx.ts(O)), text: `HR rises about ${d.hr} beats, RR ${d.rr} higher, SpO2 about ${d.spo2} points lower on room air${sevN === 2 ? ', BP falls below 90' : ''}.` },
          { at: U.hhmm(ctx.ts(O)), text: 'Right calf is swollen, warm and tender; lungs clear with diminished right base.' },
          { at: U.hhmm(ctx.ts(at(35))), text: 'Labs: troponin and BNP up, D-dimer very high, ABG shows low PaO2 with respiratory alkalosis.' }
        ],
        expectedActions: [
          { within: '0-2 min', action: 'Stay with the patient, assess airway/breathing/circulation, check SpO2 and full vital signs.', why: 'Sudden dyspnea with hypoxia is an emergency; ABCs first.' },
          { within: '0-5 min', action: 'Raise the head of the bed (high Fowler), apply oxygen (4 L nasal cannula or higher) to keep SpO2 92% or higher.', why: 'Treat hypoxia immediately; position for lung expansion.' },
          { within: '2-5 min', action: 'Call the rapid response team / provider; give an SBAR (hip surgery, sudden dyspnea and chest pain, vitals, calf findings, suspect PE).', why: 'Early escalation; a PE can become unstable within minutes.' },
          { within: '5-15 min', action: 'Perform a focused assessment: lung sounds, heart rhythm, chest pain (PQRST), calf (swelling, warmth, tenderness), neurologic status, surgical site/dressing for bleeding.', why: 'Supports the diagnosis and baselines bleeding risk before anticoagulation.' },
          { within: '10-25 min', action: 'Anticipate and prepare: 12-lead ECG, stat labs, IV access, CT angiogram (verify creatinine and contrast allergy; V/Q if ESRD), hold the next enoxaparin dose.', why: 'Anticipating orders speeds care; renal function and allergy checks prevent harm.' },
          { within: '25-50 min', action: 'Heparin bolus and infusion: verify weight-based dose, independent double check, smart pump, check aPTT/platelets/hemoglobin baseline, bleeding precautions.', why: 'High-alert medication; dosing and monitoring errors are common.' },
          { within: 'ongoing', action: 'Frequent vital signs, continuous SpO2/telemetry, strict bed rest (do not massage the leg), reassure the patient, document and update the family.', why: 'Detect deterioration (hypotension, rising oxygen need) and reduce anxiety and oxygen demand.' },
          { within: 'handoff', action: 'Give a structured handoff to the receiving unit/nurse: what happened, what was done, current status, pending orders, what to watch.', why: 'Safe transitions of care.' }
        ],
        escalationIf: sevN === 2 ? 'Patient is already unstable (SBP below 90): ICU transfer, critical care consult, avoid fluid boluses.' : 'Escalate to rapid response/ICU if SBP falls below 90, HR above 130, SpO2 stays below 90% on oxygen, or the patient becomes lethargic.',
        providerOrdersTimed: 'Provider evaluation about 12 minutes after onset; oxygen/monitoring orders at 25 minutes; ECG at 30; labs at 35; heparin at 45; CT at 70 (V/Q at 110 if ESRD). These assume the nurse called promptly.',
        pitfalls: ['Giving the scheduled enoxaparin prophylaxis dose while a heparin infusion is ordered.', 'Massaging or manipulating the swollen calf.', 'Delay in calling because "the vitals will settle".', 'Not checking creatinine/contrast allergy before CT.', 'Heparin dose not verified against weight / no independent double check.'],
        debrief: ['What findings made you suspect a pulmonary embolism rather than pneumonia or a heart attack?', 'Why was unfractionated heparin chosen over enoxaparin here?', 'What would make you call the rapid response team immediately?', 'How did you keep the patient calm and safe while waiting for orders?', 'Walk through your SBAR.'],
        learningObjectives: ['Recognize the signs of an acute pulmonary embolism after surgery.', 'Prioritize airway, breathing, circulation and escalate with SBAR.', 'Safely administer and monitor a heparin infusion (high-alert medication).']
      };
    }
  });

  return { register, forDx, apply, REG, SEV };
})();

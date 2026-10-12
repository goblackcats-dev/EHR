/* Reusable medication / order building blocks used by the diagnosis profiles. */
NS.C = (() => {
  const U = NS.util;

  const hydromorphone = (o = {}) => ({ key: 'opioid_iv', name: 'hydromorphone (DILAUDID) injection', dose: '0.5 mg', route: 'IV', freq: 'q3h', prn: true, prnInterval: 'Every 3 hours', prnFor: 'severe pain (7-10)', cls: 'Opioid analgesic', info: 'HIGH-ALERT. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation.', monitor: ['Pain', 'RR', 'SPO2'], hold: 'Hold for RR below 10, SpO2 below 90%, or sedation.', highAlert: true, indication: 'Severe pain' });

  // Morphine IV (hydromorphone for kidney disease or codeine allergy)
  const opioidIV = (ctx, o = {}) => Object.assign({}, {
    key: 'opioid_iv', name: 'morphine injection', dose: '4 mg', route: 'IV', freq: 'q3h', prn: true, prnInterval: 'Every 3 hours', prnFor: 'severe pain (7-10)', cls: 'Opioid analgesic',
    info: 'HIGH-ALERT. Assess pain, sedation (RASS), RR and SpO2 before and 15-30 minutes after. Hold for RR below 10 or oversedation.', monitor: ['Pain', 'RR', 'SPO2'], hold: 'Hold for RR below 10, SpO2 below 90%, or sedation.',
    highAlert: true, indication: 'Severe pain', avoid: ['codeine'], alt: hydromorphone(), renal: { ckd3: { avoid: true, sub: hydromorphone() }, esrd: { avoid: true, sub: hydromorphone() } }
  }, { startH: o.start, stopH: o.stop, prnGiven: o.given || [], by: o.by });

  const tramadol = () => ({ key: 'opioid_po', name: 'tramadol (ULTRAM) tablet', dose: '50 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'moderate pain (4-6)', cls: 'Opioid analgesic', info: 'Lowers seizure threshold; may cause dizziness and nausea.', monitor: ['Pain', 'RR'], indication: 'Moderate pain' });
  const opioidPO = (ctx, o = {}) => Object.assign({}, {
    key: 'opioid_po', name: 'oxycodone (ROXICODONE) tablet', dose: '5 mg', route: 'Oral', freq: 'q4h', prn: true, prnInterval: 'Every 4 hours', prnFor: 'moderate pain (4-6)', cls: 'Opioid analgesic',
    info: 'HIGH-ALERT. Assess pain and sedation before and 30-60 minutes after. Hold for oversedation or RR below 10. Give with a bowel regimen.', monitor: ['Pain', 'RR', 'SPO2'], hold: 'Hold for RR below 10 or sedation.',
    highAlert: true, indication: 'Moderate pain', avoid: ['codeine'], alt: tramadol()
  }, { startH: o.start, stopH: o.stop, prnGiven: o.given || [], by: o.by });

  const ondansetron = (o = {}) => ({ key: 'ondansetron', name: 'ondansetron (ZOFRAN) injection', dose: '4 mg', route: 'IV', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'nausea or vomiting', cls: 'Antiemetic (5-HT3 antagonist)', info: 'May prolong QT; check ECG/electrolytes if other QT-prolonging drugs. Reassess nausea in 30 minutes.', monitor: ['K', 'Mg'], indication: 'Nausea / vomiting', startH: o.start ?? 0.8, stopH: o.stop, prnGiven: o.given || [], by: o.by });

  const acetaminophenIV = (o = {}) => ({ key: 'acetaminophen_iv', name: 'acetaminophen (OFIRMEV) IVPB', dose: '1,000 mg', route: 'IV', freq: 'q6h', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources. Give over 15 minutes.', monitor: ['Temp', 'Pain'], indication: 'Multimodal analgesia', startH: o.start, stopH: o.stop, by: o.by });
  const acetaminophenPO = (o = {}) => ({ key: 'acetaminophen', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', cls: 'Non-opioid analgesic', info: 'Maximum 3 g per 24 hours from all sources.', monitor: ['Temp', 'Pain'], indication: 'Multimodal analgesia', startH: o.start, stopH: o.stop, by: o.by });
  const ketorolac = (ctx, o = {}) => ({ key: 'ketorolac', name: 'ketorolac (TORADOL) injection', dose: '15 mg', route: 'IV', freq: 'q6h', cls: 'NSAID', info: 'Maximum 5 days. Monitor creatinine, bleeding and GI upset. Avoid in kidney disease or with anticoagulants.', monitor: ['Cr', 'Hgb'], indication: 'Multimodal analgesia', avoid: ['nsaid'], renal: { ckd3: { avoid: true }, esrd: { avoid: true } }, startH: o.start, stopH: o.stop, by: o.by, when: !ctx.has('afib') });

  const lrMaintenance = (o = {}) => ({ key: 'lr_maintenance', name: "lactated Ringer's infusion", dose: `${o.rate || 125} mL/hr`, rate: `${o.rate || 125} mL/hr`, mlPerHr: o.rate || 125, route: 'IV', freq: 'continuous', fluid: true, cls: 'Crystalloid IV fluid', info: 'Assess lungs, edema, I&O and daily weight. Check IV site each shift.', monitor: ['Na', 'K'], indication: 'Maintenance hydration while NPO', startH: o.start, stopH: o.stop, by: o.by });
  const nsMaintenance = (o = {}) => ({ key: 'ns_maintenance', name: '0.9% sodium chloride infusion', dose: `${o.rate || 100} mL/hr`, rate: `${o.rate || 100} mL/hr`, mlPerHr: o.rate || 100, route: 'IV', freq: 'continuous', fluid: true, cls: 'Crystalloid IV fluid', info: 'Assess lungs, edema, I&O and daily weight. Check IV site each shift.', monitor: ['Na', 'K'], indication: 'Hydration', startH: o.start, stopH: o.stop, by: o.by });
  const bolus = (name, ml, o = {}) => ({ key: 'bolus_' + U.slug(name), name, dose: `${ml.toLocaleString()} mL`, bolus: true, bolusMl: ml, route: 'IV', freq: 'once', fluid: true, cls: 'Crystalloid IV fluid', info: 'Reassess vital signs, lung sounds and urine output after the bolus.', monitor: ['BP', 'HR'], indication: o.indication || 'Volume resuscitation', startH: o.start, by: o.by, nursing: ['Stop the bolus and notify provider for new crackles, dyspnea or SpO2 drop.'] });

  const diet = (name, startH, stopH, instructions) => ({ name, category: 'Diet', frequency: 'Meals', startH, stopH, instructions: instructions || '' });
  const activity = (name, startH, stopH, instructions) => ({ name, category: 'Activity', frequency: 'As ordered', startH, stopH, instructions: instructions || '' });
  const incentive = (startH, stopH) => ({ name: 'Incentive spirometry', category: 'Respiratory', frequency: '10 times every hour while awake', startH, stopH, instructions: 'Teach and encourage deep breaths with sustained inspiration; record achieved volume.', nursing: ['Goal volume documented by RT/nursing; report below 50% of goal.'] });

  const pivSecond = (placeH, loc = 'Left antecubital', gauge = '18 gauge') => ({ deviceType: 'IV', type: 'Peripheral IV', location: loc, siteMarker: loc.includes('Left') ? 'leftAC' : 'rightAC', gauge, placeH, infusing: 'Saline lock', status: 'Patent', assess: 'site clean, dry, intact' });

  return { opioidIV, opioidPO, ondansetron, acetaminophenIV, acetaminophenPO, ketorolac, lrMaintenance, nsMaintenance, bolus, diet, activity, incentive, pivSecond, hydromorphone, tramadol };
})();

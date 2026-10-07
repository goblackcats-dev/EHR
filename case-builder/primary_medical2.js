/* Medical primary diagnoses, part 2: COPD exacerbation, sepsis (urinary source), ischemic stroke. */
(() => {
  const U = NS.util, C = NS.C;
  const clock = (ctx, h) => U.hhmm(ctx.ts(h));
  const o2At = (spec, h) => { const f = U.stepAt(spec.vitals.filter(v => v.o2), h, 'h'); return f ? f.o2 : 'Room air'; };

  // ============================================================================ COPD EXACERBATION
  NS.PRIMARY.copd_exac = {
    key: 'copd_exac', label: 'COPD Exacerbation', group: 'Medical', cat: 'Pulmonary', typicalLOS: [3, 5],
    desc: 'Dyspnea, wheeze, hypercapnia. Day 1: BiPAP trial, steroids, nebs. Day 2-3: weaning O2. Day 4-5: oral prednisone, discharge. Day 7+: home oxygen evaluation.',
    build(ctx) {
      const comp = ctx.L >= 7;
      const biH = 1.5, biEnd = 9, raH = 80;
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 5], noAutoProlonged: comp,
        problem: { name: 'Acute exacerbation of COPD', details: 'Increased dyspnea, wheeze and sputum with acute hypercapnic respiratory failure.' },
        chief: 'Worsening shortness of breath and wheezing',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with COPD and a long smoking history presenting with 3 days of worsening dyspnea, increased wheezing, increased cough and green-yellow sputum after a viral-type illness. Using albuterol every 2 hours at home without relief. No chest pain, leg swelling or hemoptysis. Mildly drowsy in the ED with hypoxia and an elevated PaCO2.`,
        ros: 'Positive for dyspnea, wheezing, cough with purulent sputum and fatigue. Negative for chest pain, hemoptysis, fever above 101 F, leg swelling and orthopnea.',
        keyLabs: ['WBC', 'Sodium', 'Potassium', 'CO2', 'Creatinine', 'Glucose', 'pH', 'PaCO2'], hpLabs: ['WBC', 'Sodium', 'Potassium', 'CO2', 'Creatinine', 'Glucose', 'pH', 'PaCO2', 'PaO2', 'BNP'],
        isolation: 'None', rt: true, fluidSensitive: false,
        flags: { npo: [] },
        vitals: [
          { h: 0, temp: 99.4, hr: 106, sbp: 146, dbp: 84, rr: 28, spo2: 86, pain: 0, o2: 'Room air' }, { h: 0.4, temp: 99.4, hr: 106, sbp: 146, dbp: 84, rr: 26, spo2: 89, pain: 0, o2: '4 L nasal cannula' },
          { h: biH, temp: 99.2, hr: 102, sbp: 142, dbp: 82, rr: 24, spo2: 92, pain: 0, o2: 'BiPAP (IPAP 12 / EPAP 5, FiO2 40%)' }, { h: 6, temp: 99.0, hr: 96, sbp: 138, dbp: 80, rr: 22, spo2: 92, pain: 0 },
          { h: biEnd, temp: 98.8, hr: 94, sbp: 136, dbp: 78, rr: 22, spo2: 91, pain: 0, o2: '3 L nasal cannula' }, { h: 30, temp: 98.6, hr: 90, sbp: 134, dbp: 78, rr: 20, spo2: 91, pain: 0, o2: '2 L nasal cannula' },
          { h: 54, temp: 98.4, hr: 84, sbp: 132, dbp: 76, rr: 18, spo2: 92, pain: 0 }, { h: raH, temp: 98.4, hr: 80, sbp: 130, dbp: 76, rr: 18, spo2: 91, pain: 0, o2: comp ? '2 L nasal cannula' : 'Room air' }
        ],
        labs: {
          WBC: { abs: [[0, 12.6], [24, 15.4], [48, 14.2], [72, 11.4], [100, 9.6]] }, CO2: { abs: [[0, 33], [48, 31], [96, 30]] }, Glucose: { add: [[0, 14], [24, 46], [72, 36], [110, 10]] },
          Potassium: { add: [[0, 0], [24, -0.4], [48, -0.2], [96, 0]] }, Sodium: { add: [[0, -2], [48, 0]] }, Procalcitonin: { abs: [[0.5, 0.08]] }, BNP: { abs: [[0.5, 150]] }, 'Troponin I': { abs: [[0.5, 0.02]] },
          pH: { abs: [[1.0, 7.30], [4.5, 7.35], [10, 7.38], [30, 7.39]] }, PaCO2: { abs: [[1.0, 64], [4.5, 56], [10, 52], [30, 49]] }, PaO2: { abs: [[1.0, 58], [4.5, 68], [10, 66], [30, 64]] }, HCO3: { abs: [[1.0, 31], [4.5, 31], [30, 30]] }
        },
        labSchedule: [{ h: 0.5, codes: ['Procalcitonin', 'BNP', 'Troponin I'] }, { h: 1.0, codes: ['pH', 'PaCO2', 'PaO2', 'HCO3'] }, { h: 4.5, codes: ['pH', 'PaCO2', 'PaO2', 'HCO3'] }, { h: 10, codes: ['pH', 'PaCO2', 'PaO2', 'HCO3'] }, { h: 30, codes: ['pH', 'PaCO2', 'PaO2', 'HCO3'] }],
        quals: [{ h: 5, category: 'Microbiology', code: 'Influenza A/B, RSV, SARS-CoV-2 PCR', value: 'Not detected', reference: 'Not detected', specimen: 'Nasopharyngeal swab' }, { h: 50, category: 'Microbiology', code: 'Sputum culture', value: 'Normal upper respiratory flora', specimen: 'Sputum', status: 'Final' }],
        events: [
          { type: 'imaging', h: 1.0, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Dyspnea, wheezing, hypoxia', findings: 'Hyperinflated lungs with flattened diaphragms and increased retrosternal air space. No focal consolidation, pleural effusion or pneumothorax. Heart size normal.', impression: 'Hyperinflation consistent with COPD. No acute infiltrate.' },
          { type: 'cardiology', h: 1.2, study: '12-lead ECG', label: 'ECG', indication: 'Dyspnea', impression: 'Sinus tachycardia, rate 106, with occasional premature atrial complexes. Low voltage. No acute ST-T wave changes.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to the progressive care unit (BiPAP)', text: 'Transferred from the ED to the progressive care unit for BiPAP.' },
          { type: 'transfer', h: 10, label: 'Transferred to the medical unit', text: 'Off BiPAP; transferred to the medical unit.' }
        ],
        meds: [
          { key: 'methylpred_ed', name: 'methylprednisolone (SOLU-MEDROL) injection', dose: '125 mg', route: 'IV', freq: 'once', startH: 1.0, cls: 'Corticosteroid', info: 'Monitor glucose, BP, mood and sleep. Give early in the day when possible.', monitor: ['Glucose', 'BP'], indication: 'COPD exacerbation', by: 'ed' },
          { key: 'methylpred_iv', name: 'methylprednisolone (SOLU-MEDROL) injection', dose: '40 mg', route: 'IV', freq: 'q12h', startH: 12, stopH: 48, cls: 'Corticosteroid', info: 'Monitor glucose, BP, mood and sleep.', monitor: ['Glucose', 'BP'], indication: 'COPD exacerbation', by: 'hospitalist' },
          { key: 'prednisone', name: 'prednisone tablet', dose: '40 mg', route: 'Oral', freq: 'daily', startH: 48, stopH: 122, cls: 'Corticosteroid', info: 'Give with food in the morning. Total 5-day steroid course. Monitor glucose, BP and mood.', monitor: ['Glucose', 'BP'], indication: 'COPD exacerbation (5-day course)', by: 'hospitalist' },
          { key: 'duoneb', name: 'ipratropium-albuterol (DUONEB) nebulizer solution', dose: '3 mL', route: 'Nebulized', freq: 'q4h', startH: 1.0, stopH: 48, cls: 'Anticholinergic / beta-agonist bronchodilator', info: 'Given by RT. Assess breath sounds, HR and work of breathing before and after.', monitor: ['HR', 'RR', 'SPO2'], indication: 'COPD exacerbation', by: 'ed' },
          { key: 'duoneb_q6', name: 'ipratropium-albuterol (DUONEB) nebulizer solution', dose: '3 mL', route: 'Nebulized', freq: 'q6h', startH: 48, cls: 'Anticholinergic / beta-agonist bronchodilator', info: 'Given by RT. Assess breath sounds, HR and work of breathing before and after.', monitor: ['HR', 'RR', 'SPO2'], indication: 'COPD', by: 'hospitalist' },
          { key: 'albuterol_prn', name: 'albuterol (PROVENTIL) nebulizer solution', dose: '2.5 mg', route: 'Nebulized', freq: 'q2h', prn: true, prnInterval: 'Every 2 hours', prnFor: 'wheezing or shortness of breath between scheduled treatments', cls: 'Short-acting bronchodilator', info: 'Check HR before and after; may cause tremor, tachycardia and low potassium.', monitor: ['HR', 'SPO2', 'K'], indication: 'COPD rescue', startH: 1.0, prnGiven: [5.5, 13, 26], by: 'hospitalist' },
          { key: 'azithromycin_copd', name: 'azithromycin (ZITHROMAX) tablet', dose: '500 mg', route: 'Oral', freq: 'daily', startH: 2.5, stopH: 74, stat: true, cls: 'Macrolide antibiotic', info: 'Three-day course for purulent exacerbation. QT-prolonging: monitor ECG/electrolytes.', monitor: ['K', 'Mg'], indication: 'COPD exacerbation with purulent sputum', by: 'ed' },
          { key: 'guaifenesin', name: 'guaifenesin extended-release tablet', dose: '600 mg', route: 'Oral', freq: 'q12h', prn: true, prnInterval: 'Every 12 hours', prnFor: 'thick sputum', cls: 'Expectorant', info: 'Encourage fluids.', indication: 'Productive cough', startH: 12, prnGiven: [20, 34], by: 'hospitalist' }
        ],
        orders: [
          C.diet('Regular diet', 10, undefined, 'Small frequent meals reduce dyspnea.'),
          C.diet('NPO while on BiPAP', 0.5, 10, 'NPO except meds with sips while on continuous BiPAP; reassess after BiPAP.'),
          C.activity('Bed rest with bathroom privileges', 0.5, 24, 'Conserve energy; HOB elevated; pursed-lip breathing.'),
          C.activity('Up with assistance; ambulate in hall three times daily', 24, undefined, 'Pace activity; monitor SpO2 with ambulation (goal 88-92%).'),
          { name: 'BiPAP (non-invasive ventilation)', category: 'Respiratory', frequency: 'Continuous, then PRN', startH: biH, stopH: biEnd, instructions: 'IPAP 12 / EPAP 5, FiO2 40%. Repeat ABG in 3 hours. Assess mental status and mask fit every hour; HOB above 30 degrees.', nursing: ['Watch for increasing drowsiness, vomiting, or mask intolerance; notify provider and RT immediately.', 'Check skin at nasal bridge; have suction available.'] },
          { name: 'Supplemental oxygen via nasal cannula', category: 'Respiratory', frequency: 'Continuous, titrate', startH: 0.4, stopH: comp ? 9999 : raH, instructions: 'Titrate to SpO2 88-92%. Do NOT exceed target (CO2 retention).', nursing: ['Goal SpO2 is 88-92%, NOT higher; notify provider for drowsiness or SpO2 below 88%.'] },
          { name: 'Continuous pulse oximetry', category: 'Nursing', frequency: 'Continuous', startH: 0.5, stopH: 30, instructions: 'Notify provider for SpO2 below 88% or above 94% on oxygen.' },
          { name: 'ABG: repeat arterial blood gas', category: 'Laboratory', frequency: '3 hours after BiPAP start, then PRN', startH: biH, completeH: 4.6, instructions: 'Assess pH and PaCO2 response to BiPAP.' },
          { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', startH: 3, instructions: 'Nebulizers, inhaler technique, peak flow, pursed-lip breathing, airway clearance.' },
          { name: 'Incentive spirometry / deep breathing', category: 'Respiratory', frequency: '10 times every hour while awake', startH: 10, instructions: 'Deep breathing and huff cough to clear secretions.' },
          { name: 'Home oxygen qualification: ambulatory saturation test', category: 'Respiratory', frequency: 'Once before discharge', startH: comp ? 120 : 70, instructions: 'Walk the patient on room air with continuous pulse oximetry; qualifies if SpO2 at or below 88%.' }
        ],
        devices: [
          { deviceType: 'Tube', type: 'BiPAP mask (full face)', location: 'Face', siteMarker: 'nares', placeH: biH, removeH: biEnd, status: 'In use', assess: 'mask fit good, skin at nasal bridge intact' },
          { deviceType: 'Tube', type: 'Nasal cannula (oxygen)', location: 'Nares', siteMarker: 'nares', placeH: 0.4, removeH: biH, status: 'In place', assess: 'nares intact' },
          { deviceType: 'Tube', type: 'Nasal cannula (oxygen)', location: 'Nares', siteMarker: 'nares', placeH: biEnd, removeH: comp ? undefined : raH, status: 'In place', infusing: `Oxygen ${o2At({ vitals: [{ h: biEnd, o2: '3 L nasal cannula' }, { h: 30, o2: '2 L nasal cannula' }, { h: raH, o2: comp ? '2 L nasal cannula' : 'Room air' }] }, ctx.nowH)}`, assess: 'nares intact, O2 humidified' }
        ],
        assessments: [
          { fromH: 0, items: [['Respiratory', 'Breath Sounds', 'Diffuse expiratory wheezes with prolonged expiration; diminished at bases'], ['Respiratory', 'Respiratory Effort', 'Tachypneic with accessory muscle use, tripod position, pursed-lip breathing'], ['Respiratory', 'Cough', 'Productive, green-yellow sputum'], ['Neurologic', 'Level of Consciousness', 'Alert but drowsy; arouses easily'], ['Cardiac', 'Rhythm', 'Sinus tachycardia'], ['Musculoskeletal / Mobility', 'Mobility', 'Dyspnea at rest; cannot walk more than a few steps']] },
          { fromH: 10, items: [['Respiratory', 'Breath Sounds', 'Scattered expiratory wheezes; diminished bases'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea; speaking in short sentences'], ['Neurologic', 'Level of Consciousness', 'Alert'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm'], ['Respiratory', 'Peak Flow', 'Not done (too dyspneic)']] },
          { fromH: 34, items: [['Respiratory', 'Breath Sounds', 'Occasional expiratory wheeze; improved air movement'], ['Respiratory', 'Respiratory Effort', 'Unlabored at rest; dyspnea with exertion'], ['Respiratory', 'Cough', 'Less frequent, white sputum'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hall with rest breaks']] },
          { fromH: 60, items: [['Respiratory', 'Breath Sounds', 'Clear with mild end-expiratory wheeze'], ['Respiratory', 'Respiratory Effort', 'Unlabored'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent in hall']] }
        ],
        io: [{ fromH: 0, po: 40, urine: 260 }, { fromH: 10, po: 260, urine: 300 }, { fromH: 30, po: 340, urine: 300 }],
        stages: [
          { fromH: 0, id: 'acute', label: 'Hypercapnic respiratory failure: BiPAP', problem: 'Acute exacerbation of COPD with acute hypercapnic respiratory failure on BiPAP.',
            subj: 'Breathing is easier on BiPAP; still wheezing and coughing green sputum. Mildly drowsy initially, now alert. No chest pain.',
            assess: 'COPD exacerbation (likely viral/bacterial) with respiratory acidosis (pH 7.30, PaCO2 64); improving on BiPAP.',
            plan: ['BiPAP with repeat ABG in 3 hours; wean to nasal cannula as pH normalizes.', 'DuoNebs every 4 hours plus albuterol PRN; steroids IV then prednisone 40 mg to complete 5 days; azithromycin for 3 days.', 'Oxygen target SpO2 88-92%.', 'Check respiratory viral PCR; nicotine replacement and cessation counseling if smoker.'],
            nursing: ['Dyspneic with wheeze and accessory muscle use; SpO2 86% on room air, 92% on BiPAP.', 'BiPAP mask fit checked hourly; skin at nasal bridge protected; HOB elevated; NPO while on BiPAP.', 'Nebulizers given by RT with improved air movement; mental status monitored every hour.', 'Oxygen goal 88-92% reinforced.'],
            teach: ['Pursed-lip breathing, leaning forward position, and reporting increased drowsiness or breathing difficulty.'],
            dispo: 'Anticipate 3-5 days; discharge when stable on oral steroids and room air or home oxygen.',
            stickies: [{ title: 'Oxygen target 88-92%', body: 'COPD with CO2 retention: do NOT over-oxygenate. Report drowsiness or confusion immediately. BiPAP until ABG improves.' }] },
          { fromH: biEnd, id: 'improving', label: 'Off BiPAP; improving', problem: 'COPD exacerbation, improving; off BiPAP.',
            subj: 'Much less short of breath; wheeze improved; cough productive of white-yellow sputum. Appetite returning.',
            assess: 'Respiratory acidosis resolved (pH 7.38, PaCO2 52); continuing steroid and bronchodilator therapy.',
            plan: ['Oxygen by nasal cannula 2-3 L to SpO2 88-92%; wean as tolerated.', 'Continue steroids and nebulizers; glucose checks while on steroids.', 'Out of bed to chair; incentive spirometry and huff coughing.'],
            nursing: ['Alert, off BiPAP at 0900; SpO2 91% on 3 L nasal cannula.', 'Scattered wheezes; productive cough; taking sips and meals.', 'Glucose elevated on steroids; per protocol.'],
            teach: ['Inhaler technique, pursed-lip breathing, and recognizing early signs of exacerbation.'],
            dispo: 'Discharge in 2-3 days.' },
          { fromH: 54, id: 'weaning', label: 'Transition to oral steroids; weaning oxygen', problem: 'COPD exacerbation, near resolution.',
            subj: 'Breathing near baseline; walking in hall with rest breaks. Cough minimal.',
            assess: 'Near baseline; oral prednisone day 2 of 5; oxygen requirement falling.',
            plan: ['Wean oxygen; ambulatory saturation test before discharge for home oxygen qualification.', 'Complete prednisone (5 days total); DuoNebs every 6 hours.', 'Discharge on maintenance inhalers, rescue albuterol, and pulmonary rehab referral; vaccines reviewed.'],
            nursing: ['SpO2 91-92% on 1-2 L; ambulating with rest breaks; inhaler teaching with return demonstration.'],
            teach: ['COPD action plan: green/yellow/red zones; rinse mouth after inhaled steroid; smoking cessation resources.'],
            dispo: 'Discharge in 1-2 days if stable.' },
          { fromH: raH - 4, id: 'ready', label: 'Stable: discharge planning', problem: 'COPD exacerbation resolved.',
            subj: 'Breathing at baseline; no wheeze. Ready to go home.',
            assess: comp ? 'Exertional hypoxemia on room air; qualifies for home oxygen.' : 'Stable on room air with a normal ambulatory saturation.',
            plan: [comp ? 'Home oxygen 2 L/min arranged with DME; oxygen safety teaching (no smoking).' : 'Discharge home on room air.', 'Complete prednisone; follow-up with PCP/pulmonology in 7-14 days; pulmonary rehab referral.'],
            nursing: [comp ? 'Ambulatory SpO2 86% on room air; improved to 91% on 2 L; home oxygen ordered.' : 'Ambulatory SpO2 91% on room air; ambulating independently.', 'Teach-back on inhaler technique and COPD action plan.'],
            teach: ['Oxygen safety (no smoking, no open flames), inhaler technique, action plan, vaccines.'],
            dispo: comp ? 'Discharge home with oxygen once equipment delivered.' : 'Discharge home.', stickies: [{ title: 'Discharge planning', body: comp ? 'Home oxygen set-up; oxygen safety teaching.' : 'Inhaler teach-back; follow-up in 7-14 days.' }] }
        ],
        therapy: { fromH: 34 },
        objectives: ['Titrate oxygen safely in a CO2-retaining patient (goal 88-92%).', 'Monitor a patient on BiPAP and recognize failure (drowsiness, rising CO2, vomiting).', 'Administer bronchodilators and steroids and monitor for tachycardia, hypokalemia and hyperglycemia.']
      };
      return spec;
    }
  };

  // ============================================================================ SEPSIS (urinary source)
  NS.PRIMARY.sepsis = {
    key: 'sepsis', label: 'Sepsis (urinary source)', group: 'Medical', cat: 'Infectious Disease', typicalLOS: [3, 5],
    desc: 'Fever, hypotension, high lactate from pyelonephritis/E. coli bacteremia. Day 1: bundle (cultures, fluids, antibiotics). Day 2-3: improving, de-escalate. Day 4-5: oral antibiotics, discharge.',
    build(ctx) {
      const bolusMl = Math.min(3000, Math.max(1000, Math.round(ctx.weightKg * 30 / 250) * 250));
      const nar = 44, poH = 96;
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 5],
        problem: { name: 'Sepsis due to urinary tract infection', details: 'Sepsis with acute kidney injury from E. coli pyelonephritis and bacteremia.' },
        chief: 'Fever, chills, flank pain and confusion',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} brought in with 2 days of dysuria, urinary frequency, right flank pain, shaking chills and fever to 102.8 F, progressing to weakness and new confusion today. Poor oral intake for 2 days. On arrival: febrile, tachycardic and hypotensive (BP 92/54, MAP 63) with lactate 3.6 mmol/L, meeting sepsis criteria.`,
        ros: 'Positive for fever, chills, dysuria, frequency, right flank pain, nausea, weakness and confusion. Negative for cough, chest pain, diarrhea, rash and recent catheter use.',
        keyLabs: ['WBC', 'Platelets', 'Lactate', 'Sodium', 'Potassium', 'BUN', 'Creatinine', 'Procalcitonin', 'Glucose'], hpLabs: ['WBC', 'Platelets', 'Lactate', 'Sodium', 'Potassium', 'BUN', 'Creatinine', 'Procalcitonin', 'Glucose'],
        isolation: 'None', fluidSensitive: false,
        flags: { npo: [], hypotension: [[0, 30]] },
        vitals: [
          { h: 0, temp: 102.8, hr: 122, sbp: 92, dbp: 54, rr: 26, spo2: 94, pain: 5, o2: 'Room air' }, { h: 2, temp: 102.4, hr: 114, sbp: 100, dbp: 58, rr: 24, spo2: 95, pain: 4 },
          { h: 6, temp: 101.0, hr: 104, sbp: 106, dbp: 62, rr: 22, spo2: 96, pain: 3 }, { h: 12, temp: 100.4, hr: 98, sbp: 112, dbp: 66, rr: 20, spo2: 96, pain: 3 },
          { h: 24, temp: 99.4, hr: 92, sbp: 118, dbp: 70, rr: 18, spo2: 96, pain: 2 }, { h: 48, temp: 98.8, hr: 86, sbp: 122, dbp: 74, rr: 18, spo2: 97, pain: 1 }, { h: 80, temp: 98.4, hr: 80, sbp: 124, dbp: 76, rr: 16, spo2: 97, pain: 0 }
        ],
        labs: {
          WBC: { abs: [[0, 19.2], [24, 16.4], [48, 12.8], [72, 9.9]] }, Platelets: { add: [[0, -70], [24, -95], [48, -50], [96, 20]] }, Lactate: { abs: [[0.4, 3.6], [4, 2.2], [10, 1.3]] },
          Creatinine: { add: [[0, 1.0], [24, 0.6], [48, 0.25], [96, 0]] }, BUN: { add: [[0, 18], [24, 14], [48, 6], [96, 0]] }, Sodium: { add: [[0, -4], [48, 0]] }, Potassium: { add: [[0, 0.2], [24, -0.2]] },
          Glucose: { add: [[0, 32], [48, 8], [80, 0]] }, CO2: { add: [[0, -4], [24, -1], [60, 0]] }, Procalcitonin: { abs: [[0.5, 8.5], [48, 5.1]] }, CRP: { abs: [[0, 160], [48, 190], [96, 70]] }, Albumin: { add: [[0, -0.7], [96, -0.4]] },
          'Total bilirubin': { add: [[0, 0.5], [48, 0.2]] }
        },
        labSchedule: [{ h: 0.5, codes: ['Lactate', 'Procalcitonin', 'CRP', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin', 'INR', 'PT'] }, { h: 4, codes: ['Lactate'] }, { h: 10, codes: ['Lactate'] }, { h: 48, codes: ['Procalcitonin'] }],
        quals: [
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Large', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Positive', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - WBC', value: '>50', units: '/HPF', reference: '0-5', flag: 'High', specimen: 'Urine' },
          { h: 0.8, category: 'Urinalysis', code: 'Urinalysis - bacteria', value: 'Many', reference: 'None', flag: 'Abnormal', specimen: 'Urine' },
          { h: 14, category: 'Microbiology', code: 'Blood cultures x2', value: 'Gram-negative rods in 2 of 2 bottles (critical)', specimen: 'Blood', flag: 'Critical High', status: 'Preliminary' },
          { h: 40, category: 'Microbiology', code: 'Blood cultures x2', value: 'Escherichia coli; susceptible to ceftriaxone, cefepime, ciprofloxacin; resistant to ampicillin', specimen: 'Blood', flag: 'Abnormal', status: 'Final' },
          { h: 40, category: 'Microbiology', code: 'Urine culture', value: 'Escherichia coli >100,000 CFU/mL (same susceptibilities as blood)', specimen: 'Urine', flag: 'Abnormal', status: 'Final' },
          { h: 96, category: 'Microbiology', code: 'Repeat blood cultures x2', value: 'No growth at 48 hours', specimen: 'Blood', status: 'Preliminary' }
        ],
        events: [
          { type: 'imaging', h: 1.0, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Fever, tachypnea', findings: 'Low lung volumes. No consolidation, effusion or edema.', impression: 'No acute cardiopulmonary process.' },
          { type: 'imaging', h: 3.0, study: 'CT abdomen and pelvis without IV contrast', modality: 'CT', indication: 'Sepsis, flank pain, AKI: exclude obstruction or abscess', findings: 'Mild right renal enlargement with perinephric fat stranding. No hydronephrosis, obstructing calculus or renal/perinephric abscess. Bladder wall mildly thickened. No free fluid or other acute abdominopelvic abnormality.', impression: 'Findings consistent with right pyelonephritis. No obstruction or abscess.' },
          { type: 'cardiology', h: 1.2, study: '12-lead ECG', label: 'ECG', indication: 'Tachycardia', impression: ctx.has('afib') ? 'Atrial fibrillation with rapid ventricular response (rate 128). No ST elevation.' : 'Sinus tachycardia, rate 122. No ischemic changes.' },
          { type: 'transfer', h: 4.5, label: 'Admitted to the medical unit (q1-2h vitals)', text: 'Transferred to the medical unit with frequent vital signs.' }
        ],
        meds: [
          C.bolus("lactated Ringer's bolus (30 mL/kg)", bolusMl, { start: 0.6, by: 'ed', indication: 'Sepsis-induced hypotension / hypoperfusion (30 mL/kg)' }),
          C.lrMaintenance({ start: 3.5, stop: 36, rate: 100 }),
          { key: 'cefepime', name: 'cefepime (MAXIPIME) IVPB', dose: '2 g', route: 'IV', freq: 'q8h', startH: 0.9, stopH: nar, stat: true, volume: 100, cls: 'Cephalosporin antibiotic', info: 'First dose within 1 hour of sepsis recognition. Monitor renal function; neurotoxicity (confusion, myoclonus) with accumulation. Infuse over 30 minutes.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Sepsis, urinary source (empiric)', by: 'ed', renal: { ckd3: { dose: '2 g', freq: 'q12h', note: 'Dose interval extended for reduced GFR.' }, esrd: { dose: '1 g', freq: 'q24h', note: 'Dosed for ESRD; give after dialysis on dialysis days.' } } },
          { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '2 g', route: 'IV', freq: 'q24h', anchorStart: true, startH: nar, stopH: poH, volume: 50, cls: 'Cephalosporin antibiotic', info: 'De-escalated based on susceptibilities (E. coli). Infuse over 30 minutes.', monitor: ['Temp', 'WBC'], indication: 'E. coli bacteremia / pyelonephritis (targeted therapy)', by: 'hospitalist' },
          { key: 'ciprofloxacin', name: 'ciprofloxacin (CIPRO) tablet', dose: '500 mg', route: 'Oral', freq: 'BID', startH: poH, stopH: 192, cls: 'Fluoroquinolone antibiotic', info: 'Separate from calcium, iron, antacids, and dairy by 2 hours. Report tendon pain, confusion or palpitations (QT).', monitor: ['Temp', 'Cr'], indication: 'Oral step-down to complete 7-10 days', by: 'hospitalist', renal: { ckd3: { dose: '250 mg', freq: 'BID' }, esrd: { dose: '250 mg', freq: 'q24h', note: 'Dosed for ESRD.' } } },
          { key: 'acetaminophen_prn', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'fever above 100.4 F or flank pain (avoid NSAIDs: AKI)', cls: 'Non-opioid analgesic / antipyretic', info: 'Maximum 3 g/day. Avoid NSAIDs with acute kidney injury. Recheck temperature in 1 hour.', monitor: ['Temp', 'Pain'], indication: 'Fever / pain', startH: 1.0, prnGiven: [1.0, 6.5, 13, 24, 37], by: 'ed' },
          { key: 'ondansetron', name: 'ondansetron (ZOFRAN) injection', dose: '4 mg', route: 'IV', freq: 'q8h', prn: true, prnInterval: 'Every 8 hours', prnFor: 'nausea', cls: 'Antiemetic (5-HT3 antagonist)', info: 'QT-prolonging; check electrolytes.', monitor: ['K', 'Mg'], indication: 'Nausea', startH: 1.0, prnGiven: [2.0], by: 'ed' }
        ],
        orders: [
          C.diet('Regular diet', 8, undefined, 'Encourage oral fluids unless restricted.'),
          C.diet('NPO except meds with sips', 0.5, 8, 'NPO until mental status and nausea improve.'),
          C.activity('Bed rest with assistance', 0.5, 30, 'Fall precautions; up with assistance only.'),
          C.activity('Up with assistance; ambulate in hall three times daily', 30, undefined, 'Early mobility to prevent deconditioning.'),
          { name: 'Sepsis bundle: blood cultures x2, lactate, broad-spectrum antibiotics, 30 mL/kg fluids', category: 'Nursing', frequency: 'Once', startH: 0.3, completeH: 1.0, instructions: 'Cultures before antibiotics; antibiotics within 1 hour; repeat lactate in 2-4 hours if above 2.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 1 hour for 6 hours', startH: 0.5, stopH: 6, instructions: 'Notify provider for MAP below 65, SBP below 90, HR above 120, RR above 28, temperature above 102 F, or new confusion.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 2 hours', startH: 6, stopH: 26, instructions: 'Notify provider for MAP below 65 or SBP below 90.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', startH: 26, instructions: 'Notify provider for SBP below 90, HR above 120, temperature above 101.5 F.' },
          { name: 'Strict intake and output (urine output goal 0.5 mL/kg/hr)', category: 'Nursing', frequency: 'Every hour while Foley in place', startH: 1, stopH: 48, instructions: 'Notify provider for urine output below 30 mL/hr for 2 hours.' },
          { name: 'Mental status and neurologic checks', category: 'Nursing', frequency: 'Every 4 hours', startH: 1, stopH: 72, instructions: 'Assess orientation, attention, and arousal; notify provider for worsening confusion.' },
          { name: 'Continuous pulse oximetry', category: 'Nursing', frequency: 'Continuous', startH: 0.5, stopH: 24, instructions: 'Notify provider for SpO2 below 92%.' },
          { name: 'Indwelling urinary catheter care and daily necessity review', category: 'Nursing', frequency: 'Every shift', startH: 1, stopH: 48, instructions: 'Remove catheter as soon as strict hourly urine output is no longer needed.' },
          { name: 'Repeat blood cultures x2', category: 'Laboratory', frequency: 'Once', startH: 44, completeH: 48, instructions: 'Document clearance of E. coli bacteremia.' },
          { name: 'Urine culture', category: 'Laboratory', frequency: 'Once', startH: 0.5, completeH: 0.9, instructions: 'Clean-catch or catheter specimen before antibiotics.' }
        ],
        devices: [
          C.pivSecond(0.6, 'Left antecubital', '18 gauge'),
          { deviceType: 'Tube', type: 'Foley catheter', location: 'Urethral', siteMarker: 'pelvis', placeH: 1.0, removeH: 48, status: 'Draining', drainage: '', assess: 'draining amber, concentrated urine, secured to thigh, no leakage' }
        ],
        assessments: [
          { fromH: 0, items: [['Neurologic', 'Orientation', 'Oriented to person and place; intermittently confused to time'], ['Neurologic', 'Level of Consciousness', 'Lethargic, arouses to voice'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rapid ventricular response' : 'Sinus tachycardia'], ['Cardiac', 'Capillary Refill', '3-4 seconds'], ['Respiratory', 'Respiratory Effort', 'Tachypneic, no accessory muscle use'], ['GU', 'Urinary Elimination', 'Dysuria; foul-smelling cloudy urine'], ['GU', 'Urine Appearance', 'Cloudy, dark amber, foul-smelling'], ['GI', 'Abdomen', 'Soft, right CVA tenderness, suprapubic tenderness'], ['Pain', 'Pain Location', 'Right flank, aching, 5/10'], ['Skin', 'Skin', 'Flushed, hot, diaphoretic with rigors']] },
          { fromH: 12, items: [['Neurologic', 'Orientation', 'Oriented to person and place; improved attention'], ['Neurologic', 'Level of Consciousness', 'Alert, fatigued'], ['Cardiac', 'Capillary Refill', 'Less than 3 seconds'], ['Skin', 'Skin', 'Warm, dry'], ['GU', 'Urine Appearance', 'Amber, clearing'], ['Pain', 'Pain Location', 'Right flank, 3/10']] },
          { fromH: 30, items: [['Neurologic', 'Orientation', 'Alert and oriented x4'], ['Neurologic', 'Level of Consciousness', 'Alert'], ['GU', 'Urine Appearance', 'Clear, yellow'], ['Pain', 'Pain Location', 'Mild right flank tenderness'], ['Musculoskeletal / Mobility', 'Mobility', 'Weak; up with one assist']] },
          { fromH: 52, items: [['GU', 'Urinary Elimination', 'Voiding spontaneously after Foley removal; dysuria resolved'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hall with standby assist']] },
          { fromH: 80, items: [['Musculoskeletal / Mobility', 'Mobility', 'Independent'], ['Pain', 'Pain Location', 'None']] }
        ],
        io: [{ fromH: 0, po: 20, urine: 130 }, { fromH: 4, po: 0, urine: 220 }, { fromH: 12, po: 100, urine: 300 }, { fromH: 30, po: 260, urine: 340 }, { fromH: 52, po: 360, urine: 340 }],
        stages: [
          { fromH: 0, id: 'resus', label: 'Sepsis resuscitation', problem: 'Sepsis with hypotension, lactic acidosis and AKI from E. coli pyelonephritis (blood cultures pending).',
            subj: 'Chills and flank pain improving after fluids and antibiotics; still weak and intermittently confused. Nausea. Little urine output so far.',
            assess: 'Sepsis from urinary source with hypoperfusion (lactate 3.6) responsive to fluids; AKI from hypoperfusion; no obstruction on CT.',
            plan: ['30 mL/kg crystalloid bolus given; maintenance fluids; MAP goal 65 or greater (add vasopressor if refractory).', 'Cefepime IV (empiric); follow blood and urine cultures; repeat lactate until normalized.', 'Strict hourly urine output with Foley; avoid nephrotoxins and NSAIDs; hold antihypertensives.', 'Frequent vital signs and mental status checks; acetaminophen for fever.'],
            nursing: ['Febrile with rigors; HR 122, BP 92/54 on arrival; improved to MAP above 65 after fluids.', 'Foley placed for hourly urine output; urine concentrated amber.', 'Cefepime given within 1 hour; cultures drawn before antibiotics; lactate rechecked.', 'Intermittently confused; bed alarm and reorientation.'],
            teach: ['Explained sepsis, why frequent vitals and labs are needed, and why a catheter is temporarily needed.'],
            dispo: 'Anticipate 3-5 days; IV antibiotics until improved, then oral step-down.',
            stickies: [{ title: 'Sepsis', body: 'MAP goal 65 or higher. Vitals every 1-2 hours initially. Report new confusion, MAP below 65, urine output below 30 mL/hr, rising lactate, or temp above 102 F.' }] },
          { fromH: 10, id: 'improving', label: 'Improving: lactate normal, vitals stable', problem: 'Sepsis, urinary source; hemodynamically improving. Blood cultures positive for Gram-negative rods.',
            subj: 'Feels better; fever lower, flank pain 3/10, no longer confused. Eating small amounts.',
            assess: 'Lactate normalized (1.3); blood cultures with Gram-negative rods; creatinine improving.',
            plan: ['Continue cefepime pending identification and susceptibilities.', 'Taper IV fluids; encourage oral intake; trend creatinine, WBC, platelets.', 'Remove Foley once urine output is stable (within 24-48 hours).', 'Repeat blood cultures to document clearance.'],
            nursing: ['MAP above 65 for 6 hours; Tmax 101.0 F; lactate 1.3; mental status clear.', 'Urine output over 0.5 mL/kg/hr; Foley in place.', 'Ambulating with assistance; eating soft diet.'],
            teach: ['Hydration, perineal hygiene, and recognizing UTI symptoms early.'],
            dispo: 'Expect de-escalation to targeted therapy and oral step-down within 2-3 days.' },
          { fromH: nar - 4, id: 'target', label: 'E. coli identified: targeted antibiotics', problem: 'E. coli bacteremia from pyelonephritis; improving on targeted therapy.',
            subj: 'Afebrile since overnight; no flank pain; eating regular diet; walking in the hall. Foley out and voiding.',
            assess: 'E. coli (urine and blood) susceptible to ceftriaxone; AKI resolving; hemodynamically stable.',
            plan: ['De-escalate cefepime to ceftriaxone 2 g daily.', 'Foley removed; monitor for retention and urine output.', 'Repeat blood cultures pending; plan oral ciprofloxacin to complete 7-10 days from first negative cultures.', 'PT/OT evaluation for weakness; case management.'],
            nursing: ['Afebrile 24 hours; Foley removed and patient voided; urine clearing.', 'Ambulating with standby assist; eating well.'],
            teach: ['Complete the antibiotic course, increase fluids, and warning signs of recurrent infection.'],
            dispo: 'Discharge in 2-3 days after oral step-down.' },
          { fromH: poH - 8, id: 'ready', label: 'On oral antibiotics; discharge planning', problem: 'E. coli urosepsis resolved; on oral step-down antibiotics.',
            subj: 'Feels back to baseline; no fever for 3 days; eating well; walking independently.',
            assess: 'Sepsis resolved; creatinine at baseline; clearance cultures negative to date.',
            plan: ['Discharge home on ciprofloxacin to complete 7-10 days.', 'Follow-up with PCP in 1 week with BMP; urology referral if recurrent infections.', 'Return precautions: fever, chills, flank pain, confusion, decreased urine output.'],
            nursing: ['Afebrile 72 hours; BP stable; voiding spontaneously; ambulating independently.', 'Discharge teaching with teach-back.'],
            teach: ['Antibiotic schedule and interactions, hydration, hygiene, and early symptoms of recurrence.'],
            dispo: 'Discharge home today.', stickies: [{ title: 'Discharge planning', body: 'Oral antibiotic teach-back; PCP follow-up with labs in 1 week.' }] }
        ],
        therapy: { fromH: 30 },
        objectives: ['Recognize sepsis early and carry out the hour-1 bundle (cultures, lactate, fluids, antibiotics).', 'Interpret MAP, lactate, urine output and mental status trends and escalate appropriately.', 'Prevent complications: CAUTI (remove Foley early), falls and delirium.']
      };
      return spec;
    }
  };

  // ============================================================================ ISCHEMIC STROKE
  NS.PRIMARY.stroke = {
    key: 'stroke', label: 'Acute Ischemic Stroke', group: 'Medical', cat: 'Neurologic', typicalLOS: [3, 5],
    desc: 'Left MCA stroke: right arm weakness, aphasia. Day 1: neuro checks, NPO until swallow screen. Day 2: MRI, echo, SLP/PT/OT. Day 3-5: dysphagia diet, rehab planning.',
    build(ctx) {
      const swallowH = 22;
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 5], ppxStartH: 26,
        problem: { name: 'Acute ischemic stroke', details: 'Acute left MCA territory infarct with right arm weakness and expressive aphasia.' },
        chief: 'Right arm weakness, facial droop and slurred speech',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with ${ctx.hx.size ? 'vascular risk factors' : 'hypertension risk factors'} brought by family after waking with right arm weakness, right facial droop and difficulty finding words. Last known well about 7 hours before arrival (outside the thrombolytic window). No headache, trauma, seizure, chest pain or palpitations. NIHSS 6 on arrival.`,
        ros: 'Positive for right arm weakness, right facial droop and word-finding difficulty. Negative for headache, vision loss, vertigo, chest pain, palpitations, fever and recent trauma.',
        keyLabs: ['Glucose', 'LDL cholesterol', 'Hemoglobin A1c', 'Sodium', 'Potassium', 'Creatinine', 'INR'], hpLabs: ['Glucose', 'INR', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Troponin I'],
        isolation: 'None',
        flags: { npo: [[0.5, swallowH]], npoStrict: [[0.5, swallowH]], permHTN: [[0, 48]], surgeryWindow: [[0, 72]] },
        fallRiskBoost: 2,
        vitals: [
          { h: 0, temp: 98.4, hr: 86, sbp: 186, dbp: 102, rr: 18, spo2: 96, pain: 1, o2: 'Room air' }, { h: 8, temp: 98.4, hr: 82, sbp: 178, dbp: 98, rr: 18, spo2: 96, pain: 1 },
          { h: 24, temp: 98.6, hr: 80, sbp: 168, dbp: 94, rr: 16, spo2: 96, pain: 1 }, { h: 48, temp: 98.4, hr: 76, sbp: 150, dbp: 88, rr: 16, spo2: 97, pain: 0 }, { h: 80, temp: 98.2, hr: 74, sbp: 138, dbp: 80, rr: 16, spo2: 97, pain: 0 }
        ],
        labs: {
          Glucose: { add: [[0, 36], [48, 14], [80, 0]] }, 'LDL cholesterol': { abs: [[27, 142]] }, 'Hemoglobin A1c': { abs: [[0.5, 6.4]] }, INR: { abs: [[0.5, 1.0]] }, PT: { abs: [[0.5, 12.4]] }, aPTT: { abs: [[0.5, 29]] },
          'Troponin I': { abs: [[0.5, 0.02]] }, Potassium: { add: [[0, -0.1]] }
        },
        labSchedule: [{ h: 0.5, codes: ['INR', 'PT', 'aPTT', 'Troponin I', 'Hemoglobin A1c'] }, { h: 27, codes: ['LDL cholesterol'] }],
        events: [
          { type: 'imaging', h: 0.7, study: 'CT head without contrast (stroke code)', modality: 'CT', indication: 'Acute focal neurologic deficit', findings: 'No acute intracranial hemorrhage, mass effect or midline shift. Subtle loss of gray-white differentiation in the left insular ribbon. ASPECTS 9. Mild chronic small vessel ischemic change.', impression: 'No hemorrhage. Early ischemic change in the left MCA territory.' },
          { type: 'imaging', h: 1.1, study: 'CT angiogram head and neck', modality: 'CT', contrast: true, indication: 'Evaluate for large vessel occlusion', findings: 'No large vessel occlusion in the anterior or posterior circulation. 60% stenosis of the proximal left internal carotid artery by NASCET criteria. Mild calcific atheroma of the carotid bifurcations and vertebral origins.', impression: 'No large vessel occlusion. 60% proximal left ICA stenosis.' },
          { type: 'cardiology', h: 1.0, study: '12-lead ECG', label: 'ECG', indication: 'Acute stroke work-up', impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response (rate 84). No acute ischemic changes.' : 'Sinus rhythm, rate 86. Left ventricular hypertrophy by voltage. No atrial fibrillation.' },
          { type: 'consult', h: 1.6, service: 'Neurology', author: 'neurology', reason: 'Acute ischemic stroke, NIHSS 6', label: 'Neurology (stroke) consulted',
            recommendation: 'Not a thrombolytic candidate (outside the window); no large vessel occlusion for thrombectomy. Admit to stroke unit with neuro checks, permissive hypertension up to 220/120 for 24-48 hours, NPO until swallow evaluation, aspirin, high-intensity statin, MRI brain, TTE, telemetry for 48-72 hours, lipid panel and A1c; PT/OT/SLP.' },
          { type: 'transfer', h: 4.5, label: 'Admitted to the stroke unit', text: 'Transferred from the ED to the stroke unit.' },
          { type: 'imaging', h: 22, study: 'MRI brain without contrast', modality: 'MRI', indication: 'Acute stroke: confirm infarct and extent', findings: 'Acute infarct in the left MCA territory (posterior frontal and insular cortex), 3.1 cm, with restricted diffusion. No hemorrhagic transformation or mass effect. Chronic small vessel ischemic changes.', impression: 'Acute left MCA territory infarct without hemorrhage.' },
          { type: 'cardiology', h: 28, study: 'Transthoracic echocardiogram with bubble study', modality: 'Echo', label: 'Echocardiogram', indication: 'Embolic source evaluation', findings: 'Normal LV size with LVEF 55-60%. No regional wall motion abnormality. Mild left atrial enlargement. No intracardiac thrombus or mass. Agitated saline study negative for shunt.', impression: 'LVEF 55-60%; no cardiac source of embolus identified.' }
        ],
        meds: [
          C.nsMaintenance({ start: 2, stop: swallowH + 2, rate: 75 }),
          { key: 'aspirin_pr', name: 'aspirin rectal suppository', dose: '300 mg', route: 'Rectal', freq: 'once', startH: 5, cls: 'Antiplatelet', info: 'Given rectally while NPO after head CT excluded hemorrhage.', monitor: ['Hgb', 'Plt'], indication: 'Acute ischemic stroke (NPO until swallow evaluation)', by: 'hospitalist', avoid: ['nsaid'] },
          { key: 'aspirin', name: 'aspirin chewable tablet', dose: '81 mg', route: 'Oral', freq: 'daily', startH: 27, cls: 'Antiplatelet', info: 'Give after swallow evaluation clears the patient; may crush in puree. Monitor for bleeding.', monitor: ['Hgb', 'Plt'], indication: 'Secondary stroke prevention', by: 'hospitalist', avoid: ['nsaid'], alt: { name: 'clopidogrel (PLAVIX) tablet', key: 'clopidogrel', dose: '75 mg', cls: 'Antiplatelet', info: 'Used because of aspirin/NSAID allergy.' } },
          { key: 'atorvastatin', name: 'atorvastatin (LIPITOR) tablet', dose: '80 mg', route: 'Oral', freq: 'qHS', startH: 24, cls: 'High-intensity statin', info: 'Give after swallow evaluation clears the patient. Report unexplained muscle pain.', monitor: ['LFT'], indication: 'Secondary stroke prevention (LDL goal below 70 mg/dL)', by: 'hospitalist' },
          { key: 'labetalol_prn', name: 'labetalol injection', dose: '10 mg', route: 'IV', freq: 'q15min', prn: true, prnInterval: 'Every 15 minutes (max 3 doses)', prnFor: 'SBP above 220 or DBP above 120 (permissive hypertension)', cls: 'Beta blocker / alpha blocker', info: 'Do NOT treat BP below 220/120 in the first 24-48 hours (permissive hypertension). Check HR and BP before each dose; hold for HR below 60.', monitor: ['BP', 'HR'], hold: 'Hold for HR below 60 or SBP below 110.', indication: 'Permissive hypertension limit', startH: 1, prnGiven: [], by: 'hospitalist', highAlert: true },
          { key: 'acetaminophen_prn', name: 'acetaminophen (TYLENOL) suppository', dose: '650 mg', route: 'Rectal', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'temperature above 99.5 F or pain', cls: 'Non-opioid analgesic / antipyretic', info: 'Treat fever promptly after stroke; route per swallow status (PO after passing evaluation).', monitor: ['Temp', 'Pain'], indication: 'Fever / pain', startH: 3, prnGiven: [], by: 'hospitalist' }
        ],
        orders: [
          C.diet('NPO until swallow evaluation', 0.5, swallowH, 'Nothing by mouth, including medications, until bedside swallow screen and SLP evaluation.'),
          C.diet('Dysphagia diet: pureed, nectar-thick liquids', swallowH, 46, 'Per SLP: pureed solids and nectar-thick liquids; meds crushed in puree; upright 90 degrees, supervise all meals, chin tuck.'),
          C.diet('Dysphagia diet: mechanical soft, thin liquids', 46, undefined, 'Per SLP: mechanical soft with thin liquids; supervise meals; small bites and sips.'),
          C.activity('Bed rest with HOB at 30 degrees; assist with turning', 0.5, 24, 'Neuro checks; aspiration precautions.'),
          C.activity('Up with assistance (stroke unit mobility protocol)', 24, undefined, 'Out of bed to chair with 1-2 assist; fall precautions; PT/OT to progress.'),
          { name: 'Neuro checks (NIHSS) every 1 hour for 12 hours', category: 'Nursing', frequency: 'Every 1 hour', startH: 0.5, stopH: 12, instructions: 'Level of consciousness, orientation, speech, facial symmetry, motor strength, sensation. Notify provider immediately for any decline of 2 or more NIHSS points, new headache, vomiting, or decreased alertness.' },
          { name: 'Neuro checks (NIHSS) every 2 hours', category: 'Nursing', frequency: 'Every 2 hours', startH: 12, stopH: 36, instructions: 'Notify provider immediately for neurologic decline.' },
          { name: 'Neuro checks (NIHSS) every 4 hours', category: 'Nursing', frequency: 'Every 4 hours', startH: 36, instructions: 'Notify provider for neurologic change.' },
          { name: 'Blood pressure goal: permissive hypertension (treat only if above 220/120)', category: 'Nursing', frequency: 'Every 1 hour for 24 hours', startH: 0.5, stopH: 48, instructions: 'Hold home antihypertensives for 24-48 hours; treat only SBP above 220 or DBP above 120; avoid hypotension.' },
          { name: 'Bedside swallow screen before any oral intake', category: 'Nursing', frequency: 'Once', startH: 0.5, completeH: 4, instructions: 'RN dysphagia screen on arrival to the unit; NPO if failed.' },
          { name: 'Aspiration precautions', category: 'Precautions', frequency: 'Continuous', startH: 0.5, instructions: 'HOB at least 30 degrees at all times; upright 90 degrees for meals; oral care every 4 hours; suction at bedside.' },
          { name: 'Continuous cardiac monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 2, stopH: 76, instructions: 'Monitor for atrial fibrillation; notify provider of any irregular rhythm.' },
          { name: 'SLP evaluate and treat (swallow and speech-language)', category: 'Consult / Therapy', frequency: 'Daily', startH: 3, instructions: 'Formal swallow evaluation; aphasia assessment.' },
          { name: 'PT/OT evaluate and treat', category: 'Consult / Therapy', frequency: 'Daily', startH: 3, instructions: 'Early mobility; assess need for acute rehab.' },
          { name: 'Fall precautions (high risk)', category: 'Precautions', frequency: 'Continuous', startH: 0.5, instructions: 'Bed alarm on, low bed, assist with all mobility; right-sided weakness.' },
          { name: 'Glucose goal 140-180 mg/dL; avoid hypoglycemia', category: 'Nursing', frequency: 'Every 6 hours while NPO, then ACHS', startH: 0.5, instructions: 'POC glucose checks; treat per protocol.' },
          { name: 'Lipid panel and hemoglobin A1c', category: 'Laboratory', frequency: 'Once', startH: 3, completeH: 28, instructions: 'Fasting lipid panel with the morning labs.' },
          { name: 'Stroke education', category: 'Nursing', frequency: 'Daily', startH: 24, instructions: 'BE-FAST, risk factors, medications, and when to call 911; teach-back with patient and family.' }
        ],
        devices: [C.pivSecond(0.5, 'Left antecubital', '20 gauge')],
        assessments: [
          { fromH: 0, items: [['Neurologic', 'Level of Consciousness', 'Alert'], ['Neurologic', 'Orientation', 'Oriented to person, place and time; word-finding difficulty'], ['Neurologic', 'Speech', 'Expressive aphasia with mild dysarthria; follows commands'], ['Neurologic', 'Facial Symmetry', 'Right facial droop (lower face)'], ['Neurologic', 'Motor Strength', 'Right arm 3/5 with drift; right leg 4/5; left side 5/5'], ['Neurologic', 'Sensation', 'Decreased light touch right arm'], ['Neurologic', 'NIHSS Score', '6'], ['Neurologic', 'Swallow Screen', 'Not yet performed (NPO)'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rate controlled' : 'Normal sinus rhythm'], ['Safety', 'Fall Precautions', 'High risk: right-sided weakness; bed alarm on, bed low, assist x1']] },
          { fromH: 4, items: [['Neurologic', 'Swallow Screen', 'Failed bedside screen (coughing with water); NPO until SLP evaluation'], ['Safety', 'Aspiration Precautions', 'HOB 30 degrees; suction at bedside']] },
          { fromH: 24, items: [['Neurologic', 'Speech', 'Expressive aphasia improving; names objects with cues'], ['Neurologic', 'Motor Strength', 'Right arm 3/5 to 4-/5; right leg 4/5; left side 5/5'], ['Neurologic', 'NIHSS Score', '5'], ['Neurologic', 'Swallow Screen', 'SLP evaluation: mild oropharyngeal dysphagia; pureed diet with nectar-thick liquids'], ['Musculoskeletal / Mobility', 'Mobility', 'Up to chair with 2 assist; right foot drag with transfers']] },
          { fromH: 48, items: [['Neurologic', 'Speech', 'Mild expressive aphasia; speaks in short phrases'], ['Neurologic', 'Facial Symmetry', 'Mild right lower facial droop'], ['Neurologic', 'Motor Strength', 'Right arm 4/5; right leg 4+/5; left side 5/5'], ['Neurologic', 'NIHSS Score', '3'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks 50 feet with rolling walker and minimal assist']] },
          { fromH: 80, items: [['Neurologic', 'NIHSS Score', '2'], ['Neurologic', 'Speech', 'Mild word-finding difficulty only'], ['Neurologic', 'Motor Strength', 'Right arm 4+/5; right leg 5-/5'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks 150 feet with rolling walker and supervision']] }
        ],
        io: [{ fromH: 0, po: 0, urine: 280, ice: false }, { fromH: swallowH, po: 180, urine: 300 }, { fromH: 46, po: 360, urine: 320 }],
        slp: {
          h: swallowH - 1,
          summary: 'Mild oropharyngeal dysphagia; pureed diet with nectar-thick liquids; mild expressive aphasia.',
          body: (c, S) => ['**Reason for evaluation**', '- Acute left MCA stroke; failed RN swallow screen.', '', '**Oral motor / speech-language**', '- Mild right lower facial weakness; tongue deviates slightly right.', '- Expressive aphasia: names common objects with cueing; follows 2-step commands; mild dysarthria.', '', '**Bedside swallow findings**', '- Thin liquids: delayed swallow initiation with intermittent wet cough. Nectar-thick: no overt signs of aspiration. Pureed: efficient oral transit.', '', '**Recommendations**', '- Pureed diet with nectar-thick liquids; meds crushed in puree.', '- Upright 90 degrees for all PO; chin tuck; small sips; supervise all meals; oral care before and after meals.', '- Re-evaluate in 48 hours for diet advancement; instrumental study (MBS) if cough persists.', '- Speech-language therapy daily for aphasia and dysarthria.'].map(x => x)
        },
        therapy: { fromH: 26, assist: h => (h < 50 ? 'moderate assist (right-sided weakness)' : 'minimal assist'), gait: h => (h < 50 ? 'ambulates 30 feet with rolling walker and moderate assist; right foot drag' : '50-150 feet with rolling walker, minimal assist to supervision'), rec: 'Acute inpatient rehabilitation (IRF) with PT/OT/SLP; patient is a good rehab candidate', },
        discharge: { dispo: () => 'Acute inpatient rehabilitation (IRF)', estimate: 'day 4-6 pending rehab bed availability and insurance authorization', barrier: 'awaiting inpatient rehabilitation bed and insurance authorization' },
        stages: [
          { fromH: 0, id: 'acute', label: 'Acute stroke: neuro checks, permissive hypertension', problem: 'Acute left MCA ischemic stroke, NIHSS 6, within the first 24 hours.',
            subj: 'Right arm weaker than the left and word-finding is difficult. No headache or vomiting. Frustrated by speech. NPO.',
            assess: 'Acute left MCA stroke, not a thrombolysis candidate; no large vessel occlusion; hemodynamically stable on permissive hypertension.',
            plan: ['Neuro checks every 1-2 hours; any decline needs a repeat CT head and provider notification.', 'Permissive hypertension: treat only above 220/120; hold home antihypertensives for 24-48 hours.', 'NPO until swallow evaluation; aspirin PR now then PO after swallow clearance; high-intensity statin.', 'MRI brain, echocardiogram, telemetry for atrial fibrillation, lipid panel and A1c.', 'Glucose goal 140-180; treat fever; HOB 30 degrees; SCDs, pharmacologic DVT prophylaxis after 24 hours.'],
            nursing: ['NIHSS 6: right arm drift and weakness, right facial droop, expressive aphasia; alert.', 'NPO; failed bedside swallow screen; aspiration precautions with HOB 30 degrees and suction at bedside.', 'Neuro checks hourly; BP 180s/90s within the permissive range; no antihypertensives given.', 'Bed alarm on; patient reminded to call before moving; communication aids used for aphasia.'],
            teach: ['BE-FAST stroke signs, why BP is allowed to run high, why nothing by mouth yet, and call light use.'],
            dispo: 'Anticipate acute inpatient rehab after 3-5 days of acute care.',
            stickies: [{ title: 'Stroke: NPO / neuro checks', body: 'NPO until SLP clears. Neuro checks per order. Do NOT treat BP unless above 220/120 (permissive HTN). Report any change in speech, strength, alertness, or new headache.' }] },
          { fromH: swallowH + 2, id: 'post24', label: 'Day 2: MRI confirms infarct; diet started', problem: 'Acute left MCA ischemic stroke, hospital day 2; dysphagia.',
            subj: 'Speech and right arm slightly better. Eating pureed foods with thickened liquids under supervision; no coughing with meals today.',
            assess: 'MRI-confirmed left MCA infarct; stable neurologic exam (NIHSS 5); mild dysphagia managed with diet modification; ASA and statin started.',
            plan: ['Neuro checks every 2-4 hours; resume home antihypertensives gradually after 48 hours if neuro stable.', 'Aspirin 81 mg daily and atorvastatin 80 mg; consider carotid intervention discussion (60% left ICA stenosis, symptomatic): vascular surgery to see.', 'Pureed diet with nectar-thick liquids; SLP, PT and OT treating.', 'Telemetry; await echo and lipid results.'],
            nursing: ['NIHSS 5; speech improving with cueing; right arm 3/5 to 4-/5.', 'Pureed diet, nectar-thick liquids, upright 90 degrees; supervised; no coughing.', 'Up to chair with 2 assist; right foot drag with transfers.', 'BP 170s/90s, permissive range until 48 hours.'],
            teach: ['Swallow safety (chin tuck, small sips, upright), stroke risk factors, and why antiplatelet and statin are needed.'],
            dispo: 'IRF evaluation started; case management involved.' },
          { fromH: 48, id: 'recovery', label: 'Day 3: improving; antihypertensives resume', problem: 'Acute left MCA ischemic stroke, improving; rehab planning.',
            subj: 'Walking a few steps with a walker; speaking in short phrases. Mood low about the stroke. Eating well.',
            assess: 'Neurologic improvement (NIHSS 3); no atrial fibrillation on telemetry; echo without embolic source; LDL 142.',
            plan: ['Resume antihypertensives gradually (goal below 130/80 long term).', 'Advance diet to mechanical soft with thin liquids per SLP.', 'Vascular surgery follow-up for left carotid stenosis; add ezetimibe if LDL remains above 70.', 'Acute inpatient rehab referral; stroke education with teach-back.'],
            nursing: ['NIHSS 3; ambulating 50 feet with walker and minimal assist.', 'Tolerating advanced diet; mood low, support offered.', 'Stroke education started; family involved.'],
            teach: ['Medication list, BE-FAST, blood pressure and cholesterol goals, and fall prevention with right-sided weakness.'],
            dispo: 'Discharge to acute inpatient rehab when bed available.' },
          { fromH: 76, id: 'dispo', label: 'Medically stable; awaiting rehab bed', problem: 'Acute left MCA ischemic stroke, stable; awaiting acute inpatient rehabilitation.',
            subj: 'Continuing to improve; ready for rehab. Speech clearer; walking with a walker.',
            assess: 'Stable for transfer to acute inpatient rehabilitation (NIHSS 2).',
            plan: ['Transfer to IRF when authorization and bed are available.', 'Continue aspirin, statin, BP control; telemetry discontinued (no AF).', 'Outpatient follow-up with neurology and vascular surgery.'],
            nursing: ['NIHSS 2; ambulating with walker and supervision; eating mechanical soft diet.', 'Teach-back completed on stroke warning signs and medications.'],
            teach: ['Stroke prevention: medications, diet, blood pressure, and when to call 911.'],
            dispo: 'Discharge to acute inpatient rehabilitation when bed confirmed.', stickies: [{ title: 'Dispo', body: 'IRF authorization and bed pending. Continue PT/OT/SLP and swallow precautions.' }] }
        ],
        objectives: ['Perform and document a focused neurologic assessment (NIHSS) and recognize deterioration.', 'Apply aspiration precautions and a swallow screen before any oral intake.', 'Manage blood pressure appropriately after stroke (permissive hypertension) and teach stroke secondary prevention.']
      };
      return spec;
    }
  };
})();

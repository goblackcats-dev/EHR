/* Medical primary diagnoses: pneumonia, heart failure (this file), COPD exacerbation, sepsis, stroke (primary_medical2.js). */
NS.PRIMARY = NS.PRIMARY || {};

(() => {
  const U = NS.util, C = NS.C;
  const clock = (ctx, h) => U.hhmm(ctx.ts(h));
  const o2Text = (spec, ctx, h) => { const f = U.stepAt(spec.vitals.filter(v => v.o2), h, 'h'); return f ? f.o2 : 'Room air'; };

  // ============================================================================ PNEUMONIA
  NS.PRIMARY.pneumonia = {
    key: 'pneumonia', label: 'Community-Acquired Pneumonia', group: 'Medical', typicalLOS: [3, 5],
    desc: 'Fever, productive cough, hypoxia, lobar infiltrate. Day 1: O2 + IV antibiotics. Day 2-3: improving, weaning O2. Day 4: oral antibiotics, discharge. Day 7+: parapneumonic effusion.',
    build(ctx) {
      const comp = ctx.L >= 7;
      const raH = 60, poH = 72, effH = 122;
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 5], noAutoProlonged: comp,
        problem: { name: 'Community-acquired pneumonia', details: comp ? 'Left lower lobe pneumonia complicated by a parapneumonic effusion.' : 'Left lower lobe pneumonia with hypoxia.' },
        chief: 'Fever, productive cough and shortness of breath',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 4 days of fever, chills, productive cough with rust-colored sputum, left-sided pleuritic chest pain and progressive shortness of breath. Had an upper respiratory illness the week before. No sick contacts known, no recent travel or hospitalization. In the ED was hypoxic on room air.`,
        ros: 'Positive for fever, chills, productive cough, pleuritic chest pain, dyspnea and fatigue. Negative for hemoptysis, leg swelling, abdominal pain, diarrhea and dysuria.',
        keyLabs: ['WBC', 'Sodium', 'Creatinine', 'Glucose', 'Procalcitonin', 'CRP', 'Lactate'], hpLabs: ['WBC', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'Procalcitonin', 'Lactate'],
        isolation: 'None', rt: true,
        flags: { npo: [] },
        vitals: [
          { h: 0, temp: 101.8, hr: 108, sbp: 126, dbp: 74, rr: 24, spo2: 90, pain: 5, o2: 'Room air' }, { h: 0.5, temp: 101.6, hr: 106, sbp: 126, dbp: 74, rr: 24, spo2: 94, pain: 5, o2: '2 L nasal cannula' },
          { h: 6, temp: 101.2, hr: 102, sbp: 124, dbp: 72, rr: 22, spo2: 94, pain: 4 }, { h: 24, temp: 100.2, hr: 92, sbp: 122, dbp: 72, rr: 20, spo2: 94, pain: 3 },
          { h: 36, temp: 99.4, hr: 86, sbp: 120, dbp: 70, rr: 18, spo2: 95, pain: 2, o2: '2 L nasal cannula' }, { h: 48, temp: 98.8, hr: 82, sbp: 120, dbp: 70, rr: 18, spo2: 95, pain: 1, o2: '1 L nasal cannula' },
          { h: raH, temp: 98.6, hr: 78, sbp: 118, dbp: 70, rr: 16, spo2: 94, pain: 1, o2: 'Room air' }, { h: 78, temp: 98.4, hr: 76, sbp: 118, dbp: 68, rr: 16, spo2: 95, pain: 0 },
          ...(comp ? [{ h: 96, temp: 100.4, hr: 92, sbp: 120, dbp: 72, rr: 20, spo2: 92, pain: 3, o2: '2 L nasal cannula' }, { h: effH, temp: 100.6, hr: 96, sbp: 122, dbp: 72, rr: 22, spo2: 91, pain: 4, o2: '3 L nasal cannula' }, { h: effH + 8, temp: 99.0, hr: 84, sbp: 120, dbp: 70, rr: 18, spo2: 95, pain: 2, o2: '2 L nasal cannula' }, { h: 160, temp: 98.4, hr: 76, sbp: 118, dbp: 68, rr: 16, spo2: 96, pain: 1, o2: 'Room air' }] : [])
        ],
        labs: {
          WBC: { abs: comp ? [[0, 16.8], [24, 15.2], [48, 12.1], [72, 10.2], [96, 13.6], [effH, 14.8], [150, 10.8], [190, 8.7]] : [[0, 16.8], [24, 15.2], [48, 12.1], [72, 9.6], [100, 8.2]] },
          Sodium: { add: [[0, -5], [24, -3], [60, 0]] }, BUN: { add: [[0, 7], [24, 3], [60, 0]] }, Glucose: { add: [[0, 20], [48, 8], [80, 0]] }, Potassium: { add: [[0, -0.2]] },
          Procalcitonin: { abs: comp ? [[0.5, 1.8], [48, 0.9], [effH, 0.7], [150, 0.3]] : [[0.5, 1.8], [48, 0.9]] }, CRP: { abs: [[0, 148], [24, 210], [48, 160], [72, 92], [100, 50]] }, Lactate: { abs: [[0.4, 1.8], [5, 1.2]] },
          Albumin: { add: [[0, -0.5]] }
        },
        labSchedule: [{ h: 0.5, codes: ['Procalcitonin', 'Lactate', 'CRP', 'Albumin'] }, { h: 48, codes: ['Procalcitonin'] }, { daily: true, fromH: 20, codes: ['CRP'] }, ...(comp ? [{ h: effH, codes: ['Procalcitonin'] }, { h: 150, codes: ['Procalcitonin'] }] : [])],
        quals: [
          { h: 0.8, category: 'Microbiology', code: 'Blood cultures x2', value: 'Collected; pending', specimen: 'Blood', status: 'Preliminary' },
          { h: 48, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 2 days', specimen: 'Blood', status: 'Preliminary' },
          { h: 124, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 5 days (final)', specimen: 'Blood', status: 'Final' },
          { h: 3.5, category: 'Microbiology', code: 'Streptococcus pneumoniae urinary antigen', value: 'Positive', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' },
          { h: 3.5, category: 'Microbiology', code: 'Legionella urinary antigen', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 5, category: 'Microbiology', code: 'Influenza A/B, RSV, SARS-CoV-2 PCR', value: 'Not detected', reference: 'Not detected', specimen: 'Nasopharyngeal swab' },
          { h: 6, category: 'Microbiology', code: 'Sputum Gram stain', value: 'Many WBCs; Gram-positive diplococci', specimen: 'Sputum', flag: 'Abnormal' },
          { h: 50, category: 'Microbiology', code: 'Sputum culture', value: 'Moderate Streptococcus pneumoniae, penicillin-susceptible', specimen: 'Sputum', flag: 'Abnormal', status: 'Final' },
          ...(comp ? [{ h: effH + 3, category: 'Microbiology', code: 'Pleural fluid analysis', value: 'Exudate; WBC 4,200/uL (82% neutrophils), pH 7.31, glucose 78 mg/dL, LDH 640 U/L; Gram stain negative', specimen: 'Pleural fluid', flag: 'Abnormal' }] : [])
        ],
        events: [
          { type: 'imaging', h: 1.0, study: 'Chest x-ray, PA and lateral', modality: 'X-ray', indication: 'Fever, cough, hypoxia', findings: 'Dense airspace opacity in the left lower lobe with air bronchograms. No pleural effusion, pneumothorax or pulmonary edema. Heart size normal.', impression: 'Left lower lobe pneumonia.' },
          { type: 'cardiology', h: 1.4, study: '12-lead ECG', label: 'ECG (QTc check before azithromycin)', indication: 'Baseline QTc before macrolide', impression: ctx.has('afib') ? 'Atrial fibrillation with rapid ventricular response (rate 112). QTc 436 ms. No ischemic changes.' : 'Sinus tachycardia, rate 108. QTc 428 ms. No acute ischemic changes.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to the medical unit', text: 'Transferred from the ED to the medical unit.' },
          ...(comp ? [
            { type: 'imaging', h: 98, study: 'Chest x-ray, PA and lateral', modality: 'X-ray', indication: 'Recurrent fever and increased oxygen need', findings: 'Interval development of a moderate left pleural effusion with persistent left lower lobe consolidation.', impression: 'Moderate left parapneumonic effusion.' },
            { type: 'imaging', h: effH - 1.5, study: 'Ultrasound chest (pleural)', modality: 'Ultrasound', indication: 'Evaluate pleural effusion for drainage', findings: 'Moderate-sized complex left pleural effusion with a few thin septations; adequate window for thoracentesis.', impression: 'Moderate left pleural effusion with thin septations.' },
            { type: 'procedure', h: effH, duration: 0.7, name: 'Ultrasound-guided left thoracentesis', label: 'Thoracentesis (left)', by: 'pulm', service: 'Pulmonology', indication: 'Parapneumonic effusion', findings: '1,100 mL of cloudy yellow fluid removed; patient tolerated well without cough or chest pain. Post-procedure chest x-ray shows no pneumothorax.' },
            { type: 'consult', h: effH - 3, service: 'Pulmonology', author: 'pulm', reason: 'Parapneumonic effusion', label: 'Pulmonology consulted', recommendation: 'Ultrasound-guided thoracentesis today; send fluid for cell count, pH, glucose, LDH, culture. Extend antibiotics. Chest tube if pH below 7.2 or loculated.' }
          ] : [])
        ],
        meds: [
          C.bolus('0.9% sodium chloride bolus', 500, { start: 0.6, by: 'ed', indication: 'Dehydration from fever' }),
          C.nsMaintenance({ start: 2, stop: 30, rate: 75 }),
          { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '1 g', route: 'IV', freq: 'q24h', anchorStart: true, startH: 2.0, stopH: comp ? 168 : poH, volume: 50, cls: 'Cephalosporin antibiotic', info: 'Verify allergy history. Infuse over 30 minutes. Monitor temperature, WBC and for diarrhea.', monitor: ['Temp', 'WBC'], indication: 'Community-acquired pneumonia', by: 'ed' },
          { key: 'azithromycin_iv', name: 'azithromycin (ZITHROMAX) IVPB', dose: '500 mg', route: 'IV', freq: 'q24h', anchorStart: true, startH: 2.4, stopH: 48, volume: 250, cls: 'Macrolide antibiotic', info: 'Infuse over 60 minutes. QT-prolonging: check QTc/electrolytes with other QT drugs. Monitor GI tolerance.', monitor: ['Temp', 'K', 'Mg'], indication: 'Atypical coverage', by: 'ed' },
          { key: 'azithromycin_po', name: 'azithromycin (ZITHROMAX) tablet', dose: '500 mg', route: 'Oral', freq: 'daily', startH: 50, stopH: 100, cls: 'Macrolide antibiotic', info: 'Complete the course (5 days total). Monitor GI tolerance.', monitor: ['Temp'], indication: 'Atypical coverage', by: 'hospitalist' },
          { key: 'cefpodoxime', name: 'cefpodoxime (VANTIN) tablet', dose: '200 mg', route: 'Oral', freq: 'BID', startH: comp ? 168 : poH, stopH: comp ? 215 : 120, cls: 'Cephalosporin antibiotic', info: 'Take with food. Complete the full course.', monitor: ['Temp'], indication: 'Step-down oral antibiotic', by: 'hospitalist' },
          { key: 'acetaminophen_fever', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'fever above 100.4 F or pain', cls: 'Non-opioid analgesic / antipyretic', info: 'Maximum 3 g per 24 hours from all sources. Recheck temperature in 1 hour.', monitor: ['Temp', 'Pain'], indication: 'Fever / pleuritic pain', startH: 1.0, prnGiven: comp ? [1.0, 9, 16, 31, 40, 99, 126] : [1.0, 9, 16, 31, 40], by: 'ed' },
          { key: 'guaifenesin', name: 'guaifenesin extended-release tablet', dose: '600 mg', route: 'Oral', freq: 'q12h', prn: true, prnInterval: 'Every 12 hours', prnFor: 'cough with thick sputum', cls: 'Expectorant', info: 'Encourage fluids to thin secretions.', indication: 'Productive cough', startH: 24, prnGiven: [26, 38], by: 'hospitalist' },
          { key: 'benzonatate', name: 'benzonatate capsule', dose: '100 mg', route: 'Oral', freq: 'TID', prn: true, prnInterval: 'Every 8 hours', prnFor: 'dry cough interfering with sleep', cls: 'Antitussive', info: 'Swallow whole; do not chew (numbs the mouth and throat).', indication: 'Cough', startH: 24, prnGiven: [], by: 'hospitalist' }
        ],
        orders: [
          C.diet('Regular diet', 0.5, undefined, 'Encourage oral fluids unless restricted.'),
          C.activity('Up with assistance', 0.5, 28, 'Bathroom privileges with assistance; rest between activities.'),
          C.activity('Ambulate in hall three times daily', 28, undefined, 'Monitor SpO2 with ambulation; stop for SpO2 below 90% or dyspnea.'),
          { name: 'Oxygen via nasal cannula', category: 'Respiratory', frequency: 'Continuous, titrate', startH: 0.4, stopH: raH, instructions: 'Titrate 1-4 L/min to keep SpO2 92% or higher; wean as tolerated.', nursing: ['Check skin behind ears and nares for pressure; humidify if dry.'] },
          ...(comp ? [{ name: 'Oxygen via nasal cannula', category: 'Respiratory', frequency: 'Continuous, titrate', startH: 95, stopH: 150, instructions: 'Titrate to SpO2 92% or higher.' }] : []),
          C.incentive(3, undefined),
          { name: 'Droplet precautions', category: 'Precautions', frequency: 'Continuous', startH: 0.5, stopH: 8, instructions: 'Mask for staff and patient out of room until viral PCR negative.' },
          { name: 'Continuous pulse oximetry', category: 'Nursing', frequency: 'Continuous', startH: 0.5, stopH: 30, instructions: 'Notify provider for SpO2 below 90%.' },
          { name: 'Sputum culture and Gram stain', category: 'Laboratory', frequency: 'Once', startH: 1.0, completeH: 6, instructions: 'Collect deep-cough specimen before the first antibiotic if possible.' },
          { name: 'Blood cultures x2', category: 'Laboratory', frequency: 'Once', startH: 0.6, completeH: 0.9, instructions: 'Collected from two sites before antibiotics.' },
          { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', startH: 3, instructions: 'Assess breath sounds, cough, incentive spirometry technique; chest physiotherapy PRN.' }
        ],
        devices: [{ deviceType: 'Tube', type: 'Nasal cannula (oxygen)', location: 'Nares', siteMarker: 'nares', placeH: 0.4, removeH: comp ? 160 : raH, status: 'In place', infusing: o2Text({ vitals: [] }, ctx, 0) && undefined, assess: 'nares and ears without skin breakdown; O2 humidified' }],
        assessments: [
          { fromH: 0, items: [['Respiratory', 'Breath Sounds', 'Crackles and bronchial breath sounds left lower lobe; diminished at left base'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea; speaking in full sentences'], ['Respiratory', 'Cough', 'Productive, rust-colored sputum'], ['Pain', 'Pain Location', 'Left lateral chest, pleuritic'], ['Cardiac', 'Rhythm', 'Sinus tachycardia'], ['Skin', 'Skin', 'Warm, flushed, diaphoretic']] },
          { fromH: 24, items: [['Respiratory', 'Breath Sounds', 'Crackles left lower lobe; air movement improved'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea with exertion only'], ['Respiratory', 'Cough', 'Productive, yellow sputum'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Cardiac', 'Rhythm', 'Normal sinus rhythm'], ['Skin', 'Skin', 'Warm, dry']] },
          { fromH: 48, items: [['Respiratory', 'Breath Sounds', 'Faint crackles left base'], ['Respiratory', 'Respiratory Effort', 'Unlabored'], ['Respiratory', 'Cough', 'Less frequent; small amount of white sputum'], ['Respiratory', 'Incentive Spirometer', '1,750 mL'], ['Pain', 'Pain Location', 'None at rest; mild soreness with deep breath']] },
          { fromH: 72, items: [['Respiratory', 'Breath Sounds', 'Clear except faint crackles left base'], ['Respiratory', 'Cough', 'Intermittent, mostly non-productive'], ['Respiratory', 'Incentive Spirometer', '2,000 mL'], ['Pain', 'Pain Location', 'None']] },
          ...(comp ? [{ fromH: 96, items: [['Respiratory', 'Breath Sounds', 'Diminished with dullness left base'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea'], ['Respiratory', 'Cough', 'Dry, painful'], ['Pain', 'Pain Location', 'Left chest, pleuritic']] }, { fromH: effH + 2, items: [['Respiratory', 'Breath Sounds', 'Improved air entry left base; faint crackles'], ['Respiratory', 'Respiratory Effort', 'Unlabored'], ['Pain', 'Pain Location', 'Mild left chest soreness at thoracentesis site'], ['Skin', 'Procedure Site', 'Left posterior thoracentesis site with dry dressing, no leakage']] }, { fromH: 150, items: [['Respiratory', 'Breath Sounds', 'Clear'], ['Pain', 'Pain Location', 'None']] }] : [])
        ],
        io: [{ fromH: 0, po: 160, urine: 240 }, { fromH: 24, po: 280, urine: 280 }, { fromH: 48, po: 360, urine: 300 }],
        stages: [
          { fromH: 0, id: 'acute', label: 'Acute pneumonia: hypoxia, IV antibiotics', isolation: 'Droplet precautions', problem: 'Left lower lobe pneumonia with hypoxia on supplemental oxygen.',
            subj: 'Fever and chills continue; productive cough with rust-colored sputum; left chest pain with deep breaths (4/10). Short of breath with talking but comfortable on 2 L oxygen.',
            assess: 'Community-acquired pneumonia with hypoxia, CURB-65 low-moderate; Strep pneumoniae suspected (urinary antigen positive, Gram-positive diplococci).',
            plan: ['Ceftriaxone and azithromycin IV.', 'Oxygen titrated to SpO2 92% or higher; incentive spirometry; chest physiotherapy PRN.', 'Droplet precautions until viral PCR returns; follow blood and sputum cultures.', 'Acetaminophen for fever and pleuritic pain; IV fluids until drinking well.'],
            nursing: ['Febrile 101.8 F on arrival with SpO2 90% on room air, improved to 94% on 2 L nasal cannula.', 'Productive cough; deep breathing and incentive spirometry coached.', 'IV antibiotics infused without reaction; acetaminophen given for fever.', 'Droplet precautions in place pending viral PCR.'],
            teach: ['Deep breathing, cough and incentive spirometer technique; hand hygiene and covering coughs; importance of completing antibiotics.'],
            dispo: 'Anticipate 3-4 days; discharge when afebrile, SpO2 above 92% on room air, and on oral antibiotics.',
            stickies: [{ title: 'Oxygen / isolation', body: 'On 2 L NC for SpO2 92% or higher. Droplet precautions until viral PCR returns.' }] },
          { fromH: 10, id: 'improving', label: 'Improving: fever curve down, weaning oxygen', isolation: 'None', problem: 'Left lower lobe pneumonia, improving; weaning oxygen.',
            subj: 'Feels somewhat better; fever down overnight (Tmax 101.2 F), cough less painful. Using incentive spirometer. Appetite returning.',
            assess: 'Responding to antibiotics; viral PCR negative so isolation discontinued; sputum culture growing S. pneumoniae.',
            plan: ['Continue ceftriaxone and azithromycin IV.', 'Wean oxygen to keep SpO2 92% or higher; ambulate with pulse oximetry.', 'Narrow antibiotics per culture; plan oral switch when afebrile 24 hours and eating.', 'Stop IV fluids once drinking well.'],
            nursing: ['Fever trending down; SpO2 94-95% on 2 L; ambulated to the bathroom with SpO2 92%.', 'Productive cough, yellow sputum; incentive spirometer 1,250 mL.', 'Isolation discontinued after negative viral PCR.'],
            teach: ['Continue incentive spirometry hourly while awake; pace activities and report increased shortness of breath.'],
            dispo: 'Expect oral antibiotics and discharge in 1-2 days if afebrile.' },
          { fromH: 46, id: 'weaning', label: 'Afebrile; on room air', problem: 'Left lower lobe pneumonia, afebrile and weaning to room air.',
            subj: 'No fever for 24 hours; cough improving; breathing easier. Walking in hall without dyspnea. Eating well.',
            assess: 'Clinical resolution underway; oxygen weaned off; ready to transition to oral antibiotics.',
            plan: ['Room air with ambulatory saturation check; discontinue oxygen.', 'Convert azithromycin to oral; complete total 5 days.', 'Switch ceftriaxone to cefpodoxime tomorrow when afebrile and stable.'],
            nursing: ['Afebrile; SpO2 94-95% on room air at rest and 92% walking in the hall.', 'Eating regular diet; ambulating three times daily; cough less frequent.'],
            teach: ['Pneumonia recovery: fatigue can last weeks; vaccines (pneumococcal, influenza); return precautions.'],
            dispo: 'Discharge anticipated within 24 hours.' },
          { fromH: poH - 6, id: 'ready', label: 'On oral antibiotics: discharge today', problem: 'Left lower lobe pneumonia, resolving; ready for discharge.',
            subj: 'Feels much better, minimal cough, no shortness of breath or chest pain. Ready to go home.',
            assess: 'Resolving pneumonia on oral therapy; stable on room air with a normal ambulatory saturation.',
            plan: ['Discharge home on cefpodoxime to complete 5 days; azithromycin complete.', 'Follow up with PCP in 1 week; repeat chest x-ray in 6-8 weeks to document resolution.', 'Vaccines reviewed.'],
            nursing: ['Afebrile 48 hours; SpO2 95% on room air; ambulating independently.', 'Discharge teaching with teach-back; prescriptions confirmed.'],
            teach: ['Complete antibiotics, hydration and rest, and return for fever, worsening dyspnea, chest pain, or confusion.'],
            dispo: 'Discharge home today.', stickies: [{ title: 'Discharge today', body: 'Teach-back on antibiotics and return precautions; remove IV; confirm ride.' }] },
          ...(comp ? [
            { fromH: 92, id: 'effusion', label: 'Recurrent fever: parapneumonic effusion', problem: 'Left lower lobe pneumonia complicated by a moderate parapneumonic effusion.',
              subj: 'Fever returned with increased cough and left chest pain; shortness of breath with exertion. Oxygen restarted.',
              assess: 'Complicated pneumonia with a developing left parapneumonic effusion after initial improvement.',
              plan: ['Repeat chest x-ray and chest ultrasound; pulmonology for thoracentesis.', 'Continue IV ceftriaxone; extend duration; check procalcitonin.', 'Supplemental oxygen to SpO2 92% or higher.'],
              nursing: ['Febrile to 100.6 F; SpO2 91% on room air, 2-3 L oxygen restarted.', 'Left chest pain with deep breaths; incentive spirometry continued.'], teach: ['Explained the effusion and the thoracentesis procedure.'], dispo: 'Prolonged stay anticipated.' },
            { fromH: effH + 4, id: 'post_thora', label: 'After thoracentesis', problem: 'Left parapneumonic effusion, status post thoracentesis; improving.',
              subj: 'Breathing is much easier after fluid removal. Pain minimal. Fever resolved.',
              assess: 'Uncomplicated exudative effusion drained; clinical improvement.',
              plan: ['Complete antibiotic course: ceftriaxone to day 7-10 then oral cefpodoxime.', 'Follow-up chest x-ray in 6 weeks; incentive spirometry.', 'Wean oxygen to room air.'],
              nursing: ['Thoracentesis site dry, no leakage; SpO2 95% on 2 L; breath sounds improved.'], teach: ['Watch the puncture site; report shortness of breath, increasing chest pain or fever.'], dispo: 'Discharge in 2-3 days.' },
            { fromH: 160, id: 'ready_c', label: 'Ready for discharge after effusion', problem: 'Pneumonia with parapneumonic effusion, resolved after drainage; ready for discharge.',
              subj: 'No fever for 48 hours, minimal cough, no dyspnea on room air.', assess: 'Clinically resolved; stable on room air.', plan: ['Discharge on oral cefpodoxime to complete the course; PCP and pulmonology follow-up with repeat chest imaging.'],
              nursing: ['Room air saturation 95%; ambulating independently.'], teach: ['Return precautions; medication schedule.'], dispo: 'Discharge home.' }
          ] : [])
        ],
        therapy: { fromH: 34 },
        objectives: ['Recognize and respond to hypoxia and titrate oxygen safely.', 'Prioritize care for a febrile patient on IV antibiotics; use incentive spirometry and coughing techniques.', 'Interpret CBC and culture trends and know when oral step-down is appropriate.']
      };
      spec.devices[0].infusing = `Oxygen ${o2Text(spec, ctx, ctx.nowH)}`;
      return spec;
    }
  };

  // ============================================================================ ACUTE DECOMPENSATED HEART FAILURE
  NS.PRIMARY.chf = {
    key: 'chf', label: 'Acute Decompensated Heart Failure', group: 'Medical', typicalLOS: [3, 5],
    desc: 'Volume overload: dyspnea, edema, elevated BNP. Day 1-2: IV diuresis + O2. Day 3: oral diuretic transition. Day 4-5: discharge teaching. Day 7+: diuretic resistance, kidney injury.',
    build(ctx) {
      const poH = 78, raH = 54;
      const esrd = ctx.hx.has('esrd');
      const wt = h => U.round(ctx.weightKg - U.interp([[0, 0], [24, 1.7], [48, 3.4], [72, 4.9], [96, 6.0], [120, 6.6]], h), 1);
      const spec = {
        primaryTeam: 'hospitalist', typicalLOS: [3, 5],
        problem: { name: 'Acute decompensated heart failure', details: 'Volume overload with pulmonary and peripheral congestion; known HFrEF.' },
        chief: 'Shortness of breath, orthopnea and leg swelling',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with chronic heart failure with reduced ejection fraction (EF about 35%) presenting with 4 days of progressive shortness of breath, orthopnea (now needs 3 pillows), paroxysmal nocturnal dyspnea, bilateral leg swelling and an 8-pound weight gain. Admits to eating salty foods at a recent family gathering and missing several doses of furosemide. No chest pain, palpitations, fever or syncope.`,
        ros: 'Positive for dyspnea on exertion, orthopnea, PND, leg swelling and weight gain. Negative for chest pain, palpitations, syncope, fever, cough with sputum and abdominal pain.',
        keyLabs: ['BNP', 'Sodium', 'Potassium', 'Magnesium', 'BUN', 'Creatinine', 'Glucose'], hpLabs: ['BNP', 'Troponin I', 'Sodium', 'Potassium', 'BUN', 'Creatinine', 'Glucose', 'Magnesium'],
        isolation: 'None', rt: true, fluidSensitive: true,
        flags: { npo: [] },
        vitals: [
          { h: 0, temp: 98.4, hr: 98, sbp: 158, dbp: 92, rr: 24, spo2: 90, pain: 1, o2: 'Room air' }, { h: 0.6, temp: 98.4, hr: 96, sbp: 156, dbp: 90, rr: 22, spo2: 94, pain: 1, o2: '3 L nasal cannula' },
          { h: 12, temp: 98.2, hr: 92, sbp: 148, dbp: 86, rr: 20, spo2: 94, pain: 0 }, { h: 24, temp: 98.4, hr: 88, sbp: 142, dbp: 84, rr: 20, spo2: 94, pain: 0, o2: '2 L nasal cannula' },
          { h: 48, temp: 98.2, hr: 82, sbp: 136, dbp: 80, rr: 18, spo2: 95, pain: 0 }, { h: raH, temp: 98.2, hr: 80, sbp: 134, dbp: 78, rr: 16, spo2: 95, pain: 0, o2: 'Room air' },
          { h: 96, temp: 98.2, hr: 76, sbp: 130, dbp: 76, rr: 16, spo2: 96, pain: 0 }
        ],
        labs: {
          BNP: { abs: [[0, 1240], [48, 880], [96, 540]] }, 'Troponin I': { abs: [[0.5, 0.03], [3.5, 0.03], [6.5, 0.02]] },
          Creatinine: { add: [[0, 0.3], [24, 0.45], [48, 0.3], [96, 0.1], [150, 0]] }, BUN: { add: [[0, 12], [24, 15], [48, 10], [96, 4], [150, 0]] },
          Sodium: { add: [[0, -6], [24, -4], [72, -1], [120, 0]] }, Potassium: { add: [[0, -0.5], [24, -0.7], [30, -0.2], [72, 0]] }, Magnesium: { abs: [[0, 1.7], [24, 1.6], [30, 2.0]] },
          Hemoglobin: { add: [[0, -1.2], [72, -0.8]] }, CO2: { add: [[0, 0], [48, 3], [96, 3]] }, Glucose: { add: [[0, 12], [48, 0]] }
        },
        labSchedule: [{ h: 0.5, codes: ['BNP', 'Troponin I', 'Magnesium', 'TSH', 'AST', 'ALT'] }, { h: 3.5, codes: ['Troponin I'] }, { h: 6.5, codes: ['Troponin I'] }, { daily: true, fromH: 20, codes: ['Magnesium'] }, { h: 78, codes: ['BNP'] }],
        events: [
          { type: 'imaging', h: 1.0, study: 'Chest x-ray, portable', modality: 'X-ray', indication: 'Dyspnea, hypoxia', findings: 'Cardiomegaly with pulmonary vascular congestion and interstitial edema. Small bilateral pleural effusions. No focal consolidation.', impression: 'Cardiomegaly with pulmonary edema and small bilateral pleural effusions.' },
          { type: 'cardiology', h: 0.8, study: '12-lead ECG', label: 'ECG', indication: 'Dyspnea', impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response, rate 92. Left ventricular hypertrophy. Old left bundle branch block, unchanged.' : 'Sinus tachycardia, rate 98. Left ventricular hypertrophy with repolarization changes. Old left bundle branch block, unchanged. No acute ST elevation.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to telemetry unit', text: 'Transferred from the ED to the telemetry unit.' },
          { type: 'cardiology', h: 30, study: 'Transthoracic echocardiogram', label: 'Echocardiogram', indication: 'Evaluate LV function and valves', findings: 'Dilated left ventricle with global hypokinesis. LVEF 30-35%. Moderate left atrial enlargement. Mild-to-moderate functional mitral regurgitation. RVSP 45 mmHg. Small pericardial effusion without tamponade. IVC dilated with reduced collapse.', impression: 'LVEF 30-35% with global hypokinesis, mild-to-moderate mitral regurgitation, elevated filling pressures.' },
          { type: 'consult', h: 22, service: 'Cardiology', author: 'cardiology', reason: 'Acute decompensated HFrEF', label: 'Cardiology consulted', recommendation: 'Continue IV diuresis to net negative 1.5-2 L/day; continue beta blocker; echocardiogram today; titrate guideline-directed therapy before discharge; 2 g sodium diet and 1.5 L fluid restriction; follow-up in the heart failure clinic within 7 days.' },
          ...(esrd ? [{ type: 'consult', h: 3, service: 'Nephrology', author: 'nephrology', reason: 'Volume overload in ESRD patient', label: 'Nephrology consulted for urgent ultrafiltration', recommendation: 'Urgent hemodialysis with ultrafiltration of 3 L tonight; then resume Mon/Wed/Fri schedule.' }, { type: 'procedure', h: 7, duration: 4, name: 'Hemodialysis with ultrafiltration (urgent)', label: 'Urgent hemodialysis with UF', dialysis: true, ufRemoved: 3000, by: 'nephrology', service: 'Nephrology' }] : [])
        ],
        meds: [
          { key: 'furosemide_iv', name: 'furosemide (LASIX) injection', dose: '40 mg', route: 'IV', freq: 'BID', at: ['0900', '1700'], startH: 1.5, stopH: poH, cls: 'Loop diuretic', info: 'Give slowly (not faster than 4 mg/min). Monitor BP, urine output, potassium, magnesium, creatinine and weight. Tinnitus with rapid push.', monitor: ['BP', 'K', 'Cr', 'Mg'], hold: 'Hold and call provider if SBP below 90 or if no urine response after 2 hours.', indication: 'Acute decompensated heart failure', stat: true, by: 'ed', renal: { esrd: { avoid: true } } },
          { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '40 mg', route: 'Oral', freq: 'BID', at: ['0900', '1700'], startH: poH, cls: 'Loop diuretic', info: 'Monitor BP, urine output, potassium, creatinine and weight.', monitor: ['BP', 'K', 'Cr'], hold: 'Hold and call provider if SBP below 90.', indication: 'Transition to oral diuretic', renal: { esrd: { avoid: true } } },
          { key: 'kcl_po', name: 'potassium chloride extended-release tablet', dose: '40 mEq', route: 'Oral', freq: 'daily', startH: 3, stopH: 72, cls: 'Electrolyte replacement', info: 'Take with food and a full glass of water; swallow whole. Monitor K and renal function.', monitor: ['K', 'Cr'], hold: 'Hold if potassium above 4.5 mEq/L or creatinine rising.', indication: 'Hypokalemia with diuresis', renal: { ckd3: { dose: '20 mEq' }, esrd: { avoid: true } } },
          { key: 'mag_sulfate', name: 'magnesium sulfate IVPB', dose: '2 g', route: 'IV', freq: 'once', startH: 25, volume: 50, cls: 'Electrolyte replacement', info: 'Infuse over 2 hours. Monitor for hypotension and loss of deep tendon reflexes.', monitor: ['Mg', 'Cr'], indication: 'Hypomagnesemia with diuresis', renal: { esrd: { avoid: true } } },
          { key: 'acetaminophen_prn', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'q6h', prn: true, prnInterval: 'Every 6 hours', prnFor: 'mild pain (avoid NSAIDs)', cls: 'Non-opioid analgesic', info: 'Avoid NSAIDs in heart failure (fluid retention).', monitor: ['Pain'], indication: 'Pain', startH: 3, prnGiven: [], by: 'hospitalist' },
          { key: 'nitroglycerin_sl', name: 'nitroglycerin (NITROSTAT) sublingual tablet', dose: '0.4 mg', route: 'Sublingual', freq: 'q5min', prn: true, prnInterval: 'Every 5 minutes up to 3 doses', prnFor: 'chest pain', cls: 'Nitrate vasodilator', info: 'Check BP before each dose; hold for SBP below 100. Call provider for chest pain.', monitor: ['BP', 'HR'], hold: 'Hold for SBP below 100.', indication: 'Chest pain', startH: 3, prnGiven: [], by: 'hospitalist' }
        ],
        orders: [
          C.diet('Cardiac (2 g sodium) diet; fluid restriction 1,500 mL/day', 0.5, undefined, 'Restrict sodium to 2 g/day and fluids to 1,500 mL/day.'),
          C.activity('Bed rest with bathroom privileges', 0.5, 24, 'Conserve energy; HOB elevated.'),
          C.activity('Up with assistance; ambulate in hall three times daily', 24, undefined, 'Monitor SpO2 and symptoms with activity.'),
          { name: 'Oxygen via nasal cannula', category: 'Respiratory', frequency: 'Continuous, titrate', startH: 0.5, stopH: raH, instructions: 'Titrate to SpO2 92% or higher; wean as diuresis improves.' },
          { name: 'Strict intake and output', category: 'Nursing', frequency: 'Every shift', startH: 1, instructions: 'Record all intake and output; document urine after each diuretic dose.' },
          { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', startH: 3, instructions: 'Same scale each morning, after voiding, before breakfast; record in kg.' },
          { name: 'Continuous cardiac monitoring (telemetry)', category: 'Nursing', frequency: 'Continuous', startH: 3, stopH: 80, instructions: 'Notify provider for new arrhythmia, HR above 130 or below 50.' },
          { name: 'Head of bed elevated 30-45 degrees', category: 'Nursing', frequency: 'Continuous', startH: 1, instructions: 'Elevate for orthopnea; monitor for dyspnea.' },
          { name: 'BMP and magnesium daily (potassium and magnesium goals 4.0 and 2.0)', category: 'Laboratory', frequency: 'Daily AM', startH: 3, instructions: 'Replace per protocol with diuresis.' },
          { name: 'Respiratory therapy evaluate and treat', category: 'Respiratory', frequency: 'Daily and PRN', startH: 3, instructions: 'Assess work of breathing and oxygen need; wean as able.' },
          { name: 'Heart failure education', category: 'Nursing', frequency: 'Daily', startH: 24, instructions: 'Daily weights, 2 g sodium, fluid limit, medication adherence, symptoms to report; teach-back before discharge.' }
        ],
        devices: [{ deviceType: 'Tube', type: 'Nasal cannula (oxygen)', location: 'Nares', siteMarker: 'nares', placeH: 0.5, removeH: raH, status: 'In place', assess: 'nares intact, O2 humidified' }],
        assessments: [
          { fromH: 0, items: [['Respiratory', 'Breath Sounds', 'Bibasilar crackles to mid-lung fields'], ['Respiratory', 'Respiratory Effort', 'Tachypneic, speaks in short sentences, prefers upright position'], ['Respiratory', 'Cough', 'Dry, worse lying flat'], ['Cardiac', 'Rhythm', ctx.has('afib') ? 'Atrial fibrillation, rate controlled' : 'Sinus tachycardia'], ['Cardiac', 'Heart Sounds', 'S1 S2 with S3 gallop; 2/6 systolic murmur at apex'], ['Cardiac', 'Edema', '2+ pitting bilateral lower extremity edema to the knees'], ['Cardiac', 'Neck Veins', 'JVD to 10 cm at 45 degrees'], ['GI', 'Abdomen', 'Soft, mildly distended, mild hepatic tenderness'], ['Musculoskeletal / Mobility', 'Mobility', 'Dyspnea with minimal exertion'], ['Skin', 'Skin', 'Cool extremities, mild peripheral cyanosis, dry']] },
          { fromH: 24, items: [['Respiratory', 'Breath Sounds', 'Crackles to the lower third bilaterally'], ['Respiratory', 'Respiratory Effort', 'Mild tachypnea, no accessory muscle use'], ['Cardiac', 'Edema', '2+ lower extremity edema, improving'], ['Cardiac', 'Neck Veins', 'JVD to 8 cm'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates to bathroom with dyspnea on exertion']] },
          { fromH: 48, items: [['Respiratory', 'Breath Sounds', 'Faint bibasilar crackles'], ['Respiratory', 'Respiratory Effort', 'Unlabored'], ['Cardiac', 'Edema', '1+ pedal edema'], ['Cardiac', 'Neck Veins', 'JVD flat at 45 degrees'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hall with standby assist']] },
          { fromH: 72, items: [['Respiratory', 'Breath Sounds', 'Clear'], ['Cardiac', 'Edema', 'Trace pedal edema'], ['Cardiac', 'Neck Veins', 'No JVD'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent, no dyspnea walking in hall']] }
        ],
        io: [{ fromH: 0, po: 120, urine: 240 }, { fromH: 2, po: 170, urine: 440 }, { fromH: 24, po: 210, urine: 460 }, { fromH: 48, po: 240, urine: 380 }, { fromH: 72, po: 280, urine: 330 }],
        stages: [
          { fromH: 0, id: 'acute', label: 'Acute decompensation: IV diuresis', problem: 'Acute decompensated HFrEF with pulmonary edema and hypoxia.',
            subj: 'Short of breath at rest improved after the first diuretic dose; still needs oxygen and sleeps sitting up. Voiding large volumes of urine. No chest pain.',
            assess: 'Volume overload from dietary sodium excess and missed diuretic; troponin negative; BNP 1,240.',
            plan: [esrd ? 'Urgent hemodialysis with ultrafiltration (ESRD); no loop diuretic.' : 'Furosemide 40 mg IV BID; goal net negative 1.5-2 L per day; strict I&O and daily weights.', 'Oxygen to keep SpO2 92% or higher; telemetry.', 'Replace potassium (goal 4.0) and magnesium (goal 2.0).', '2 g sodium diet and 1.5 L fluid restriction.', 'Echocardiogram and cardiology consult; hold ACE inhibitor if creatinine rises.'],
            nursing: ['Dyspneic with talking, sitting upright; bibasilar crackles; 2+ leg edema; JVD present.', 'Furosemide IV given; urine output measured after each dose; weight and strict I&O started.', 'Oxygen 3 L nasal cannula with SpO2 94%; telemetry monitoring in place.', 'Diet and fluid limits explained to patient and family.'],
            teach: ['Why daily weights, fluid limits and a low-sodium diet matter; reporting breathlessness, chest pain or dizziness.'],
            dispo: 'Anticipate 3-5 days; discharge when near dry weight on oral diuretic.',
            stickies: [{ title: 'Heart failure', body: 'Strict I&O and daily weight (kg). 1,500 mL fluid limit, 2 g sodium. Call for SBP below 90, new chest pain, or SpO2 below 90%.' }] },
          { fromH: 30, id: 'diuresing', label: 'Responding to diuresis', problem: 'Acute decompensated HFrEF improving with diuresis.',
            subj: 'Breathing better, able to lie flat with 2 pillows. Leg swelling decreasing. Weight down 1.7 kg. Mild lightheadedness when standing.',
            assess: 'Good diuretic response; creatinine mildly up but stable; echo shows EF 30-35%.',
            plan: [esrd ? 'Resume Mon/Wed/Fri dialysis; target dry weight.' : 'Continue IV furosemide; goal net negative 1.5-2 L/day; transition to oral in 24-48 hours.', 'Wean oxygen; ambulate with pulse oximetry.', 'Continue carvedilol; consider titrating GDMT with cardiology before discharge.', 'Daily BMP and magnesium; replace K and Mg.'],
            nursing: ['Weight down 1.7 kg from admission; net negative about 1.8 L over 24 hours.', 'Orthostatic precautions: dizziness on standing; rise slowly.', 'Edema decreasing to 2+; lung crackles to lower third.'],
            teach: ['Daily weights, sodium label reading, and fluid limits; teach-back started.'],
            dispo: 'Discharge in 2-3 days if transitioning well to oral diuretic.' },
          { fromH: raH - 6, id: 'oral', label: 'Near dry weight; transitioning to oral diuretic', problem: 'Acute decompensated HFrEF, near euvolemia.',
            subj: 'Feels much better. Walking in hall without dyspnea; sleeping flat. Appetite good.',
            assess: 'Near euvolemia; transitioning to an oral regimen; renal function stable.',
            plan: ['Switch to oral furosemide 40 mg BID; observe 24 hours for weight stability.', 'Room air; continue carvedilol; optimize GDMT per cardiology.', 'Heart failure teaching with teach-back; scale and BP cuff at home.'],
            nursing: ['Room air saturation 95%; trace pedal edema; ambulating independently.', 'Teach-back on daily weights and 2 g sodium diet.'],
            teach: ['When to call the doctor: weight gain over 2-3 lb in a day or 5 lb in a week, worsening swelling or shortness of breath.'],
            dispo: 'Discharge home in 1-2 days on oral diuretic.' },
          { fromH: poH, id: 'ready', label: 'Stable on oral diuretic: discharge planning', problem: 'Acute decompensated HFrEF, compensated on oral diuretic.',
            subj: 'No dyspnea, weight stable on oral diuretic. Ready for discharge.',
            assess: 'Compensated; discharge weight recorded as new dry weight.',
            plan: ['Discharge home on furosemide 40 mg BID with potassium per BMP; follow-up in HF clinic within 7 days and PCP in 1-2 weeks.', 'Written HF action plan; home health consult if lives alone or functional decline.'],
            nursing: ['Weight stable, no edema, room air saturation 96%.', 'Discharge teaching with teach-back completed.'],
            teach: ['Daily weight log, 2 g sodium, 1.5 L fluid, medications, and symptoms that require a call or ED visit.'],
            dispo: 'Discharge home within 24 hours.', stickies: [{ title: 'Discharge planning', body: 'Dry weight recorded; HF clinic in 7 days; teach-back complete.' }] }
        ],
        therapy: { fromH: 34 },
        objectives: ['Recognize signs of fluid overload and respond to diuresis (I&O, weights, K/Mg, orthostatic BP).', 'Teach heart failure self-care: daily weights, sodium and fluid limits, and symptom zones.', 'Interpret BNP, creatinine, potassium and magnesium trends with diuresis.']
      };
      // daily weight observations (shown as a cardiac flowsheet row)
      for (let d = 0; d <= 8; d++) spec.assessments.push({ fromH: 5 + 24 * d - 0.01 + 0.02, items: [['Cardiac', 'Daily Weight', `${wt(5 + 24 * d)} kg`]] });
      return spec;
    }
  };
})();

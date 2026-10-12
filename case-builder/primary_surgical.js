/* Surgical primary diagnoses: appendicitis (this file also holds SBO and cholecystitis). */
NS.PRIMARY = NS.PRIMARY || {};

(() => {
  const U = NS.util, C = NS.C;
  const clock = (ctx, h) => U.hhmm(ctx.ts(h));
  const ecgEvent = (ctx, h) => ({
    type: 'cardiology', h, study: '12-lead ECG', label: 'Pre-operative ECG', indication: 'Pre-operative evaluation',
    impression: ctx.has('afib') ? 'Atrial fibrillation with controlled ventricular response (rate 78). No acute ST-T wave changes.' : 'Normal sinus rhythm, rate 74. Normal axis and intervals. No acute ST-T wave changes.'
  });

  // ============================================================================ APPENDICITIS
  NS.PRIMARY.appendicitis = {
    key: 'appendicitis', label: 'Acute Appendicitis', group: 'Surgical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [1, 3],
    desc: 'RLQ pain, CT-confirmed appendicitis. Day 1: pre-op/OR. Day 2: post-op day 1 (diet, discharge teaching). Day 4+: perforated with abscess and drain.',
    build(ctx) {
      const comp = ctx.L >= 4;                       // complicated (perforated) pathway for prolonged stays
      const orH = 7.5, dur = comp ? 1.75 : 1.25, orEnd = orH + dur;
      const orTime = clock(ctx, orH);
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [1, 3],
        problem: { name: 'Acute appendicitis', details: comp ? 'Perforated appendicitis with pelvic abscess, status post laparoscopic appendectomy.' : 'CT-confirmed acute appendicitis.' },
        chief: 'Right lower quadrant abdominal pain with nausea',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 24 hours of periumbilical pain that migrated to the right lower quadrant, associated with anorexia, nausea and one episode of non-bilious emesis. Low-grade fever at home. No diarrhea, dysuria or hematuria. Pain is sharp, worse with movement and coughing.`,
        isolation: 'None',
        ros: 'Positive for abdominal pain, nausea, anorexia and subjective fever. Negative for diarrhea, constipation, dysuria, hematuria, chest pain and shortness of breath.',
        keyLabs: ['WBC', 'Hemoglobin', 'Platelets', 'Sodium', 'Potassium', 'Creatinine', 'Glucose', 'CRP'],
        flags: { npo: comp ? [[0.5, 14], [50, 92]] : [[0.5, 12]], preop: [[0, orH]], surgeryWindow: [[0, orH + 24]], postop: [[orEnd, 9999]] },
        vitals: comp ? [
          { h: 0, temp: 100.8, hr: 106, sbp: 134, dbp: 82, rr: 20, spo2: 98, pain: 8, o2: 'Room air' },
          { h: 2, temp: 100.6, hr: 100, sbp: 130, dbp: 80, rr: 18, spo2: 98, pain: 5 },
          { h: 7, temp: 100.2, hr: 98, sbp: 128, dbp: 78, rr: 18, spo2: 98, pain: 5 },
          { h: orEnd, temp: 99.0, hr: 88, sbp: 118, dbp: 70, rr: 14, spo2: 97, pain: 5, o2: '2 L nasal cannula' },
          { h: 14, temp: 99.4, hr: 90, sbp: 120, dbp: 72, rr: 16, spo2: 96, pain: 4, o2: 'Room air' },
          { h: 30, temp: 100.2, hr: 94, sbp: 122, dbp: 74, rr: 16, spo2: 96, pain: 4 },
          { h: 50, temp: 100.8, hr: 104, sbp: 124, dbp: 74, rr: 18, spo2: 95, pain: 5 },
          { h: 62, temp: 101.6, hr: 110, sbp: 118, dbp: 68, rr: 20, spo2: 95, pain: 6 },
          { h: 78, temp: 101.2, hr: 106, sbp: 120, dbp: 70, rr: 18, spo2: 96, pain: 6 },
          { h: 84, temp: 99.4, hr: 90, sbp: 122, dbp: 72, rr: 16, spo2: 97, pain: 4 },
          { h: 106, temp: 98.8, hr: 82, sbp: 120, dbp: 72, rr: 16, spo2: 97, pain: 3 },
          { h: 132, temp: 98.4, hr: 76, sbp: 118, dbp: 70, rr: 16, spo2: 98, pain: 2 }
        ] : [
          { h: 0, temp: 100.4, hr: 98, sbp: 132, dbp: 80, rr: 18, spo2: 98, pain: 7, o2: 'Room air' },
          { h: 2, temp: 100.2, hr: 94, sbp: 128, dbp: 78, rr: 18, spo2: 98, pain: 5 },
          { h: 7, temp: 99.8, hr: 90, sbp: 126, dbp: 76, rr: 16, spo2: 98, pain: 5 },
          { h: orEnd, temp: 98.6, hr: 78, sbp: 118, dbp: 70, rr: 14, spo2: 97, pain: 5, o2: '2 L nasal cannula' },
          { h: 13, temp: 99.0, hr: 84, sbp: 122, dbp: 74, rr: 16, spo2: 96, pain: 4, o2: 'Room air' },
          { h: 26, temp: 98.8, hr: 78, sbp: 120, dbp: 72, rr: 16, spo2: 97, pain: 3 },
          { h: 50, temp: 98.4, hr: 72, sbp: 118, dbp: 68, rr: 16, spo2: 98, pain: 2 },
          { h: 80, temp: 98.2, hr: 70, sbp: 118, dbp: 68, rr: 16, spo2: 98, pain: 2 }
        ],
        labs: {
          WBC: { abs: comp ? [[0, 17.5], [24, 15.4], [48, 16.8], [62, 18.2], [80, 15.0], [104, 11.2], [128, 8.9]] : [[0, 15.8], [24, 12.9], [48, 9.6], [80, 8.0]] },
          Hemoglobin: { add: [[0, 0], [orEnd, -0.5], [50, -0.9]] },
          Hematocrit: { add: [[0, 0], [orEnd, -1.5], [50, -2.6]] },
          Platelets: { add: [[0, 20], [48, 40], [100, 60]] },
          Sodium: { add: [[0, -2], [24, -1], [60, 0]] },
          Potassium: { add: [[0, -0.2], [30, -0.3], [60, -0.1]] },
          CO2: { add: [[0, -1], [48, 0]] },
          Glucose: { add: [[0, 22], [30, 12], [70, 0]] },
          BUN: { add: [[0, 3], [24, 0]] },
          CRP: { abs: comp ? [[0, 96], [24, 148], [48, 160], [62, 210], [100, 90], [128, 38]] : [[0, 64], [24, 96], [48, 52]] },
          Lactate: { abs: [[0, 1.6], [4, 1.1]] }
        },
        labSchedule: [
          { h: 0.5, codes: ['Lactate', 'CRP', 'Lipase', 'AST', 'ALT', 'ALP', 'Total bilirubin'] },
          { daily: true, fromH: 20, codes: ['CRP'] }
        ],
        quals: [
          { h: 0.7, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 0.7, category: 'Urinalysis', code: 'Urinalysis - nitrite', value: 'Negative', reference: 'Negative', specimen: 'Urine' },
          { h: 0.7, category: 'Urinalysis', code: 'Urinalysis - WBC', value: '0-2', units: '/HPF', reference: '0-5', specimen: 'Urine' },
          ...(ctx.female && ctx.age >= 12 && ctx.age <= 55 ? [{ h: 0.7, category: 'Other', code: 'Urine hCG (pregnancy test)', value: 'Negative', reference: 'Negative', specimen: 'Urine' }] : []),
          { h: orEnd + 62, category: 'Pathology', code: 'Surgical pathology - appendix', value: comp ? 'Acute suppurative appendicitis with perforation; no dysplasia or malignancy' : 'Acute appendicitis; no dysplasia or malignancy', specimen: 'Appendix', status: 'Final' },
          ...(comp ? [{ h: 66, category: 'Microbiology', code: 'Abscess culture (CT-guided/IR drain)', value: 'Pending', specimen: 'Abscess fluid', status: 'Preliminary' }, { h: 100, category: 'Microbiology', code: 'Abscess culture (IR drain)', value: 'Escherichia coli and Bacteroides fragilis; susceptible to ceftriaxone and metronidazole', specimen: 'Abscess fluid', status: 'Final' }] : [])
        ],
        events: [
          { type: 'imaging', h: 1.6, study: 'CT abdomen and pelvis with IV contrast', modality: 'CT', contrast: true, indication: 'RLQ pain, leukocytosis; evaluate for appendicitis',
            findings: comp ? 'The appendix is dilated to 13 mm with periappendiceal fat stranding and an appendicolith. Focal wall defect with a small amount of extraluminal gas and free fluid in the right paracolic gutter and pelvis, concerning for perforation. No drainable abscess at this time.' : 'The appendix is dilated to 12 mm with wall thickening, hyperenhancement and periappendiceal fat stranding. An appendicolith is present at the base. No extraluminal gas, abscess or free fluid. Remainder of the abdomen and pelvis is unremarkable.',
            impression: comp ? 'Acute appendicitis with findings suspicious for perforation.' : 'Acute uncomplicated appendicitis with appendicolith.' },
          { type: 'consult', h: 2.4, service: 'General Surgery', author: 'surgeon', reason: 'Acute appendicitis on CT', label: 'Surgery consulted; decision for appendectomy',
            recommendation: 'Admit to General Surgery. NPO, IV fluids, IV antibiotics, laparoscopic appendectomy this morning. Risks, benefits and alternatives (including antibiotics alone) discussed; patient elects surgery and consent was obtained.' },
          { type: 'transfer', h: 3.0, label: 'Admitted to the surgical unit', text: 'Transferred from the ED to the surgical unit.' },
          { type: 'surgery', h: orH, duration: dur, name: 'Laparoscopic appendectomy', label: 'Laparoscopic appendectomy', anesthesia: 'General endotracheal', orderH: 2.6,
            indication: comp ? 'Perforated appendicitis' : 'Acute appendicitis',
            findings: comp ? 'Perforated retrocecal appendix with purulent fluid in the right lower quadrant and pelvis. Localized peritonitis.' : 'Acutely inflamed, non-perforated appendix with a small amount of reactive free fluid.',
            procedure: comp ? 'Three-port laparoscopic technique. Appendix mobilized and divided at the base with a stapler; mesoappendix controlled with energy device. Peritoneal cavity irrigated with 3 L warm saline until clear. No drain placed. Port sites closed.' : 'Three-port laparoscopic technique (12 mm umbilical, 5 mm LLQ, 5 mm suprapubic). Appendix and mesoappendix divided with a stapler and energy device. Specimen retrieved in a bag. Port sites closed with absorbable suture and skin glue.',
            ebl: comp ? '20 mL' : '<10 mL', fluids: comp ? '2,000 mL lactated Ringer\'s' : '1,000 mL lactated Ringer\'s', specimens: 'Appendix to pathology', complications: 'None', disposition: 'PACU, then surgical unit' },
          ...(comp ? [
            { type: 'imaging', h: 62, study: 'CT abdomen and pelvis with IV contrast', modality: 'CT', contrast: true, indication: 'Postoperative fever and rising WBC; evaluate for abscess',
              findings: 'There is a 4.1 x 3.2 cm rim-enhancing fluid collection in the pelvis adjacent to the cecal tip with small gas bubbles, consistent with an abscess. Mild small bowel dilatation consistent with ileus. No free air.', impression: '4.1 cm pelvic abscess. Postoperative ileus.' },
            { type: 'consult', h: 64, service: 'Interventional Radiology', author: 'radiology', reason: 'Percutaneous drainage of pelvic abscess', label: 'IR consulted for abscess drainage', recommendation: 'Proceed with CT-guided percutaneous drain placement tomorrow morning. Hold diet and anticoagulation prophylaxis as directed. Consent obtained.' },
            { type: 'procedure', h: 79, duration: 1, name: 'CT-guided percutaneous drainage of pelvic abscess', label: 'IR pelvic abscess drain placed', service: 'Interventional Radiology', by: 'radiology', findings: '10 Fr pigtail catheter placed into the pelvic collection via a transgluteal/anterior approach; 60 mL of thick tan-brown purulent fluid aspirated and sent for culture. Catheter secured and connected to a bulb.', indication: 'Pelvic abscess after perforated appendicitis' }
          ] : [])
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.5, indication: 'Dehydration / pre-operative resuscitation', by: 'ed' }),
          C.lrMaintenance({ start: 2, stop: comp ? 28 : 26, rate: 125 }),
          ...(comp ? [C.lrMaintenance({ start: 50, stop: 92, rate: 125 })] : []),
          C.opioidIV(ctx, { start: 0.8, stop: comp ? 30 : 28, given: comp ? [0.8, 3.6, 8.2, 11.5, 16, 21, 26] : [0.8, 3.6, 9.4, 13, 19, 24] }),
          ...(comp ? [Object.assign(C.opioidIV(ctx, { start: 50, stop: 92, given: [52, 56, 61, 66, 71, 75, 79.5, 84, 89] }), { key: 'opioid_iv_2' })] : []),
          C.ondansetron({ start: 0.8, given: comp ? [0.8, 12, 53, 70] : [0.8, 11] }),
          // pre-operative antibiotics
          ...(comp ? [
            { key: 'piptazo', name: 'piperacillin-tazobactam (ZOSYN) IVPB', dose: '3.375 g', route: 'IV', freq: 'q6h', startH: 2.6, stopH: 120, stat: true, volume: 50, cls: 'Penicillin / beta-lactamase inhibitor', info: 'Verify penicillin allergy. Infuse over 30 minutes. Monitor for diarrhea (C. difficile) and rash.', monitor: ['Temp', 'WBC', 'Cr'], indication: 'Perforated appendicitis / intra-abdominal infection', avoid: ['penicillin'], alt: { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '2 g', freq: 'q24h', anchorStart: true, cls: 'Cephalosporin antibiotic', info: 'Cephalosporin used because of penicillin allergy (low cross-reactivity). Infuse over 30 minutes.' }, by: 'surgeon' },
            { key: 'metronidazole_iv', name: 'metronidazole (FLAGYL) IVPB', dose: '500 mg', route: 'IV', freq: 'q8h', startH: 2.7, stopH: 120, volume: 100, cls: 'Antibiotic (anaerobic coverage)', info: 'Avoid alcohol. Metallic taste and nausea are common.', monitor: ['Temp', 'WBC'], indication: 'Anaerobic coverage (penicillin-allergic patient)', when: ctx.allergic('penicillin'), by: 'surgeon' },
            { key: 'amox_clav', name: 'amoxicillin-clavulanate (AUGMENTIN) tablet', dose: '875/125 mg', route: 'Oral', freq: 'BID', startH: 120, cls: 'Penicillin / beta-lactamase inhibitor', info: 'Give with food. Complete the course (total about 7 days after source control).', monitor: ['Temp', 'WBC'], indication: 'Step-down oral antibiotic', avoid: ['penicillin'], alt: { key: 'cipro', name: 'ciprofloxacin (CIPRO) tablet', dose: '500 mg', freq: 'BID', cls: 'Fluoroquinolone antibiotic', info: 'Separate from calcium/iron/antacids by 2 hours. Report tendon pain.' }, by: 'surgeon' },
            { key: 'metronidazole_po', name: 'metronidazole (FLAGYL) tablet', dose: '500 mg', route: 'Oral', freq: 'TID', startH: 120, cls: 'Antibiotic (anaerobic coverage)', info: 'Avoid alcohol. Metallic taste and nausea are common.', monitor: ['Temp'], indication: 'Anaerobic coverage (penicillin-allergic patient)', when: ctx.allergic('penicillin'), by: 'surgeon' }
          ] : [
            { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '2 g', route: 'IV', freq: 'once', startH: 2.6, volume: 50, cls: 'Cephalosporin antibiotic', info: 'Pre-operative dose. Verify allergy history. Infuse over 30 minutes.', monitor: ['Temp', 'WBC'], indication: 'Acute appendicitis (single pre-operative dose)', by: 'surgeon' },
            { key: 'metronidazole_iv', name: 'metronidazole (FLAGYL) IVPB', dose: '500 mg', route: 'IV', freq: 'once', startH: 2.7, volume: 100, cls: 'Antibiotic (anaerobic coverage)', info: 'Pre-operative dose. Metallic taste and nausea are common.', monitor: ['Temp'], indication: 'Anaerobic coverage (single pre-operative dose)', by: 'surgeon' }
          ]),
          // multimodal analgesia after surgery
          Object.assign(C.acetaminophenIV({ start: orEnd + 0.5, stop: 28 }), { by: 'surgeon' }),
          Object.assign(C.acetaminophenPO({ start: 28 }), { by: 'surgeon' }),
          Object.assign(C.ketorolac(ctx, { start: orEnd + 1, stop: comp ? 48 : 33 }), { by: 'surgeon' }),
          Object.assign(C.opioidPO(ctx, { start: comp ? 30 : 26, stop: comp ? 50 : undefined, given: comp ? [] : [28.5, 34.5, 41] }), { by: 'surgeon' }),
          ...(comp ? [Object.assign(C.opioidPO(ctx, { start: 92, given: [96, 101, 107] }), { key: 'opioid_po_2', by: 'surgeon' })] : [])
        ],
        orders: [
          C.diet('NPO', 0.5, comp ? 14 : 12, 'Nothing by mouth except sips with meds as approved; preparing for surgery.'),
          C.diet('Clear liquid diet', comp ? 14 : 12, comp ? 28 : 26, 'Advance as tolerated if no nausea.'),
          C.diet('Regular diet', comp ? 28 : 26, comp ? 50 : undefined, 'Advance as tolerated.'),
          ...(comp ? [C.diet('NPO', 50, 92, 'NPO for ileus and planned IR drainage.'), C.diet('Clear liquid diet', 92, 100, 'Advance as tolerated.'), C.diet('Regular diet', 100, undefined, 'Advance as tolerated.')] : []),
          C.activity('Up with assistance', 0.5, orEnd, 'Bathroom privileges with assistance while NPO.'),
          C.activity('Bed rest until awake, then up with assistance', orEnd, orEnd + 3),
          C.activity('Ambulate with assistance three times daily', orEnd + 3, undefined, 'Early mobilization reduces ileus, atelectasis and DVT risk.'),
          C.incentive(orEnd, undefined),
          { name: 'Surgical site assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Assess laparoscopic port sites for drainage, redness, swelling, and skin glue integrity.' },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: 3, completeH: orH - 0.3, instructions: 'Verify consent, ID and allergy bands, NPO status, jewelry/dentures removed, last void, antibiotic given within 60 minutes before incision.' },
          ...(comp ? [{ name: 'Drain care and output measurement', category: 'Nursing', frequency: 'Every shift', startH: 79.5, instructions: 'Flush with 10 mL saline daily if ordered; empty bulb and record color, consistency and volume; assess site for leakage.' }] : []),
          { name: 'Pathology: appendix specimen', category: 'Laboratory', frequency: 'Once', startH: orEnd, instructions: 'Specimen sent to surgical pathology.' }
        ],
        devices: [
          C.pivSecond(7.0),
          ...(comp ? [{ deviceType: 'Drain', type: 'Pelvic abscess drain (10 Fr pigtail)', location: 'Left lower quadrant', siteMarker: 'abdomenLLQ', placeH: 79.8, status: 'Active', drainage: ctx.nowH < 100 ? '45 mL tan purulent over last 12 hours' : '20 mL serosanguineous over last 12 hours', assess: 'dressing clean, dry, intact; bulb compressed; no leakage' }] : [])
        ],
        assessments: [
          { fromH: 0, items: [['GI', 'Abdomen', 'RLQ tenderness with voluntary guarding; rebound and McBurney point tenderness; no rigidity'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nauseated; one episode of emesis at home'], ['Pain', 'Pain Location', 'Right lower quadrant, sharp'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates slowly, guarding right side']] },
          { fromH: orEnd, items: [['GI', 'Abdomen', 'Soft, mildly distended, appropriately tender at three laparoscopic port sites'], ['GI', 'Nausea / Vomiting', 'Mild nausea, relieved with ondansetron'], ['Skin', 'Surgical Incisions', 'Laparoscopic port sites x3 (umbilicus, LLQ, suprapubic) with skin glue; dressings clean, dry, intact'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Pain', 'Pain Location', 'Abdominal port sites, aching'], ['Musculoskeletal / Mobility', 'Mobility', 'Up with one assist'], ['GU', 'Urinary Elimination', 'Voiding spontaneously after surgery']] },
          { fromH: 25, items: [['GI', 'Abdomen', comp ? 'Soft, mildly distended, tender at port sites' : 'Soft, non-distended, mildly tender at port sites'], ['GI', 'Bowel Sounds', 'Hypoactive to normoactive'], ['GI', 'Last BM / Flatus', comp ? 'No flatus since surgery' : 'Passing flatus; no BM since surgery'], ['GI', 'Nausea / Vomiting', comp ? 'Intermittent mild nausea' : 'None'], ['Respiratory', 'Incentive Spirometer', '1,750 mL'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hallway with standby assist']] },
          ...(comp ? [
            { fromH: 50, items: [['GI', 'Abdomen', 'Distended, firm, tender in RLQ and suprapubic region; no rigidity'], ['GI', 'Bowel Sounds', 'Hypoactive'], ['GI', 'Nausea / Vomiting', 'Nausea with two episodes of emesis'], ['GI', 'Last BM / Flatus', 'No flatus for 24 hours'], ['Pain', 'Pain Location', 'Lower abdomen, 6/10, constant'], ['Skin', 'Skin', 'Warm, diaphoretic during fever']] },
            { fromH: 84, items: [['GI', 'Abdomen', 'Soft, less distended, mild suprapubic tenderness'], ['GI', 'Bowel Sounds', 'Active'], ['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'Passing flatus'], ['Skin', 'Drain Site', 'LLQ drain site dressing clean, dry, intact; tan purulent drainage in bulb'], ['Pain', 'Pain Location', 'Lower abdomen and drain site, 3-4/10']] },
            { fromH: 108, items: [['GI', 'Last BM / Flatus', 'Bowel movement today'], ['Skin', 'Drain Site', 'Drain site clean; serosanguineous drainage'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent with ambulation']] }
          ] : [
            { fromH: 49, items: [['GI', 'Last BM / Flatus', 'Bowel movement yesterday evening'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent'], ['Pain', 'Pain Location', 'Port sites, mild soreness']] }
          ])
        ],
        io: [
          { fromH: 0, po: 0, urine: 280, ice: false },
          { fromH: 12, po: 120, urine: 300 },
          { fromH: 26, po: 360, urine: 320 },
          ...(comp ? [{ fromH: 50, po: 0, urine: 260, other: 150, otherLabel: 'Emesis' }, { fromH: 80, po: 0, urine: 300, other: 55, otherLabel: 'Drain output' }, { fromH: 92, po: 150, urine: 310, other: 35, otherLabel: 'Drain output' }, { fromH: 108, po: 380, urine: 330, other: 20, otherLabel: 'Drain output' }] : [])
        ],
        stages: appendStages(ctx, comp, orH, orEnd, orTime),
        stickies: [],
        objectives: ['Prioritize pre-operative and post-operative nursing care for a patient with appendicitis.', 'Recognize early signs of post-operative complications (ileus, abscess, infection, bleeding).', 'Teach incisional care, activity, pain control, and when to call the surgeon.'],
        noBowelRegimen: false
      };
      return spec;
    }
  };

  function appendStages(ctx, comp, orH, orEnd, orTime) {
    const stages = [];
    stages.push({
      fromH: 0, id: 'preop', label: 'Pre-operative: awaiting appendectomy',
      problem: 'CT-confirmed acute appendicitis; awaiting laparoscopic appendectomy.',
      subj: 'Reports sharp right lower quadrant pain, improved to about 5/10 after IV analgesia. Mild nausea, no further vomiting. Has not eaten since the evening before arrival.',
      assess: 'Acute appendicitis on CT with low-grade fever and leukocytosis; going to the OR for laparoscopic appendectomy.',
      plan: ['NPO; maintenance IV fluids after the bolus.', 'Ceftriaxone and metronidazole given pre-operatively (single dose).', `Laparoscopic appendectomy scheduled for about ${orTime}; consent obtained.`, 'IV opioid for severe pain; ondansetron for nausea.'],
      nursing: ['Patient NPO. Pre-operative checklist in progress.', 'Pain managed with IV analgesia; patient guarding the right side.', 'IV antibiotics infused without reaction.'],
      teach: ['Reviewed NPO status, what to expect in the OR/PACU, pain scale, and use of the incentive spirometer after surgery.'],
      dispo: 'Anticipate discharge home 1-2 days after surgery if tolerating diet and pain controlled on oral medication.',
      stickies: [{ title: 'Pre-op', body: `NPO. OR transport about ${orTime}. Verify consent, ID and allergy bands, last intake, and that pre-op antibiotics were given.` }],
      objectives: ['Complete a pre-operative nursing checklist safely.']
    });
    stages.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0',
      problem: comp ? 'Status post laparoscopic appendectomy for perforated appendicitis (POD 0).' : 'Status post laparoscopic appendectomy (POD 0).',
      subj: 'Awake and comfortable in recovery. Incisional soreness 4-5/10 controlled with IV analgesia. Mild nausea relieved by ondansetron. Voided after surgery.',
      assess: comp ? 'POD 0 laparoscopic appendectomy for perforated appendicitis; hemodynamically stable on IV piperacillin-tazobactam.' : 'POD 0 laparoscopic appendectomy for uncomplicated appendicitis; stable.',
      plan: comp ? ['Continue IV antibiotics (planned 4-7 days after source control).', 'Multimodal analgesia; advance to clear liquids tonight if tolerated.', 'Incentive spirometry, early ambulation; DVT prophylaxis started.'] : ['No post-operative antibiotics needed for uncomplicated appendicitis.', 'Multimodal analgesia with scheduled acetaminophen, ketorolac, PRN opioid.', 'Clear liquids when awake and nausea controlled; advance diet tomorrow.', 'Incentive spirometry, ambulate tonight with assistance; DVT prophylaxis started.'],
      nursing: ['Returned from PACU alert; port-site dressings clean, dry, intact.', 'Pain 4-5/10, improved after IV analgesia; ondansetron given for nausea.', 'Incentive spirometer teaching done; patient reached 1,250 mL.', 'Voided without difficulty. Up to bedside with one assist.'],
      teach: ['Splinting with a pillow when coughing, incentive spirometer, call before getting up, and recognizing worsening pain or fever.'],
      dispo: comp ? 'Expected stay 5-7 days given perforation; case management to follow.' : 'Anticipate discharge tomorrow if tolerating diet and ambulating.'
    });
    stages.push({
      fromH: 25, id: 'pod1', label: 'Post-operative day 1',
      problem: comp ? 'POD 1 laparoscopic appendectomy for perforated appendicitis.' : 'POD 1 laparoscopic appendectomy.',
      subj: comp ? 'Mild abdominal soreness; intermittent nausea and early satiety. Has not passed flatus. Low-grade temperature overnight.' : 'Feels much better. Mild soreness at port sites (3/10) controlled with oral medication. Tolerated clear liquids overnight, no nausea, passing flatus. Walked in the hall.',
      assess: comp ? 'POD 1 after appendectomy for perforation; low-grade fever and no flatus yet; watching for ileus or abscess.' : 'POD 1 and recovering as expected; tolerating diet.',
      plan: comp ? ['Continue piperacillin-tazobactam; trend temperature and WBC.', 'Clear liquids; advance only if no nausea or distension.', 'Ambulate, incentive spirometry; monitor bowel function.'] : ['Advance to regular diet as tolerated; stop IV fluids.', 'Transition to oral analgesics; no antibiotics needed.', 'Ambulate three times daily; no drains or lines other than the IV.', 'Discharge home today if tolerating diet, pain controlled and ambulating independently.'],
      nursing: comp ? ['Low-grade temperature 100.2 F; encouraged ambulation and incentive spirometry.', 'Intermittent nausea; clear liquids tolerated in small amounts.', 'Port sites clean, dry, intact.'] : ['Slept well; ambulated in hall with standby assist; independent with toileting.', 'Tolerating diet without nausea; passing flatus.', 'Port sites clean, dry, intact with skin glue.', 'Pain 2-3/10 controlled with oral medication.'],
      teach: comp ? ['Ambulation, incentive spirometry, signs of abscess or ileus to report (fever, distension, vomiting).'] : ['Discharge teaching: port-site care, shower allowed, no lifting over 10 lb for 2 weeks, pain regimen, bowel regimen with opioids, return precautions (fever, worsening pain, vomiting, redness, drainage).'],
      dispo: comp ? 'Anticipate several more days; reassess daily.' : 'Anticipated discharge home today with outpatient surgical follow-up in 2 weeks.'
    });
    if (!comp) {
      stages.push({
        fromH: 49, id: 'pod2', label: 'Post-operative day 2 - discharge',
        problem: 'POD 2 laparoscopic appendectomy; medically ready for discharge.',
        subj: 'Pain minimal and controlled with acetaminophen. Eating regular diet, bowel movement today. Eager to go home.',
        assess: 'Recovered well after uncomplicated appendectomy; meets discharge criteria.',
        plan: ['Discharge home today with prescriptions (acetaminophen, short course of oxycodone only if needed, stool softener).', 'Pathology pending; surgical clinic follow-up in 2 weeks.', 'Return precautions reviewed.'],
        nursing: ['Ambulating independently, tolerating regular diet, voiding, pain 1-2/10.', 'Discharge instructions reviewed; patient and family verbalize understanding using teach-back.'],
        teach: ['Teach-back on incision care, activity restrictions, medications, and warning signs (fever above 101 F, worsening pain, vomiting, wound drainage).'],
        dispo: 'Discharge home today.',
        stickies: [{ title: 'Discharge today', body: 'Discharge teaching with teach-back; remove IV; confirm ride home and prescriptions.' }]
      });
    } else {
      stages.push({
        fromH: 49, id: 'pod2c', label: 'Post-operative day 2: fever, ileus',
        problem: 'POD 2 after appendectomy for perforation with fever, leukocytosis and ileus; evaluating for abscess.',
        subj: 'Worsening abdominal pain and bloating, nausea with two episodes of emesis, no flatus, fever to 101.6 F.',
        assess: 'Persistent fever with rising WBC and ileus after perforated appendicitis; concern for intra-abdominal abscess.',
        plan: ['Made NPO; IV fluids; antiemetic as needed.', 'CT abdomen/pelvis with IV contrast today.', 'Continue piperacillin-tazobactam; blood cultures x2.', 'Hold ketorolac; monitor renal function.'],
        nursing: ['Febrile with chills; abdomen distended and tender; vomited twice.', 'NPO with IV fluids; antiemetic given with relief.', 'Notified surgery of fever and distension; CT scheduled.'],
        teach: ['Explained why diet was stopped and the reason for repeat imaging.'],
        dispo: 'Prolonged stay anticipated.'
      });
      stages.push({
        fromH: 62, id: 'abscess', label: 'Pelvic abscess identified',
        problem: '4.1 cm pelvic abscess after perforated appendicitis; IR drainage planned.',
        subj: 'Pain is steady, nausea improved with NPO. Aware of abscess and agrees to drain.',
        assess: 'Post-appendectomy pelvic abscess; needs percutaneous drainage and continued antibiotics.',
        plan: ['IR CT-guided drain placement tomorrow morning; consent obtained.', 'Continue NPO and IV fluids; continue piperacillin-tazobactam.', 'Hold DVT prophylaxis dose morning of procedure per IR.'],
        nursing: ['Informed consent for drain reviewed with patient; NPO maintained.', 'Fever persists; acetaminophen scheduled; cooling measures used.'],
        teach: ['Explained percutaneous drain, expected output, and care.'],
        dispo: 'Drain care teaching needed before discharge.'
      });
      stages.push({
        fromH: 79.5, id: 'drained', label: 'After abscess drainage',
        problem: 'Pelvic abscess status post IR drain; clinically improving.',
        subj: 'Pain markedly improved after drainage. Fever resolved. Passing flatus, nausea gone; hungry.',
        assess: 'Improving after source control; ileus resolving; WBC and fever trending down.',
        plan: ['Continue IV antibiotics; plan oral step-down in 24-48 hours (total course about 7 days).', 'Advance diet to clears then regular as tolerated.', 'Drain output monitoring; culture sensitivities pending.', 'Ambulate; DVT prophylaxis resumed.'],
        nursing: ['Drain site dressing clean, dry, intact; bulb emptied and output recorded.', 'Afebrile 12 hours; ambulating with standby assist; tolerating clears.'],
        teach: ['Drain care: emptying the bulb, recording output, site care, and signs of infection.'],
        dispo: 'Home with home health for drain care is likely; case management consulted.'
      });
      stages.push({
        fromH: 120, id: 'dc_prep', label: 'Preparing for discharge with drain',
        problem: 'Pelvic abscess with IR drain; on oral antibiotics; preparing for discharge.',
        subj: 'Eating regular diet, bowel movements normal, pain minimal. Wants to go home.',
        assess: 'Clinically recovered; drain output declining; oral antibiotics tolerated.',
        plan: ['Discharge home with drain and home health nursing once teaching complete.', 'Complete oral antibiotics; IR/surgery follow-up in 1 week for drain study.'],
        nursing: ['Patient and family performed drain emptying with return demonstration.', 'Tolerating oral antibiotics; afebrile.'],
        teach: ['Drain care teach-back; antibiotic schedule; when to call (fever, increased pain, cloudy or bloody output, drain falls out).'],
        dispo: 'Home with home health for drain care.',
        stickies: [{ title: 'Discharge planning', body: 'Home health set up for drain care; teach-back completed; follow-up in 1 week.' }]
      });
    }
    return stages;
  }
})();

// ================================================================================================
// SMALL BOWEL OBSTRUCTION  and  ACUTE CHOLECYSTITIS
// ================================================================================================
(() => {
  const U = NS.util, C = NS.C;
  const clock = (ctx, h) => U.hhmm(ctx.ts(h));

  // ============================================================================ SBO
  NS.PRIMARY.sbo = {
    key: 'sbo', label: 'Small Bowel Obstruction', group: 'Surgical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [3, 5],
    desc: 'Adhesive SBO. Day 1-2: NPO, NG tube to suction, IV fluids. Day 2-3: Gastrografin challenge. Day 3+: diet advances. Day 6+: failed non-operative care -> surgery.',
    build(ctx) {
      const failed = ctx.L >= 6;
      const ggH = 25, kubH = 31, orH = 76, orDur = 2.5, orEnd = orH + orDur;
      const ngOutH = failed ? orEnd + 30 : 32;
      const dietClear = failed ? 106 : 33, dietLow = failed ? 118 : 45, dietReg = failed ? 130 : 57;
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [3, 5], noAutoProlonged: failed, noBowelRegimen: true, fluidSensitive: false,
        problem: { name: 'Small bowel obstruction', details: failed ? 'Adhesive small bowel obstruction that failed non-operative management; status post exploratory laparotomy with lysis of adhesions.' : 'Adhesive small bowel obstruction managed non-operatively.' },
        chief: 'Abdominal pain, distension and vomiting',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 2 days of crampy, colicky abdominal pain, progressive abdominal distension, nausea with repeated bilious emesis, and no bowel movement or flatus for 36 hours. Reports similar but milder episodes in the past that resolved on their own. No fever, hematochezia or chest pain.`,
        ros: 'Positive for abdominal pain, distension, nausea, vomiting and obstipation. Negative for fever, hematochezia, chest pain, dyspnea and urinary symptoms.',
        keyLabs: ['WBC', 'Sodium', 'Potassium', 'Magnesium', 'Creatinine', 'BUN', 'Lactate', 'Glucose'],
        isolation: 'None',
        flags: { npo: [[0.5, dietClear]], surgeryWindow: failed ? [[0, orH + 24]] : [[0, 60]], postop: failed ? [[orEnd, 9999]] : [] },
        vitals: failed ? [
          { h: 0, temp: 98.9, hr: 108, sbp: 118, dbp: 72, rr: 18, spo2: 97, pain: 7, o2: 'Room air' }, { h: 6, temp: 98.8, hr: 98, sbp: 124, dbp: 76, rr: 16, spo2: 97, pain: 4 },
          { h: 30, temp: 99.2, hr: 94, sbp: 126, dbp: 76, rr: 16, spo2: 97, pain: 4 }, { h: 55, temp: 99.6, hr: 98, sbp: 128, dbp: 78, rr: 18, spo2: 96, pain: 5 }, { h: orH, temp: 99.4, hr: 100, sbp: 126, dbp: 76, rr: 18, spo2: 96, pain: 6 },
          { h: orEnd + 1, temp: 98.6, hr: 86, sbp: 118, dbp: 70, rr: 14, spo2: 97, pain: 6, o2: '2 L nasal cannula' }, { h: orEnd + 12, temp: 99.4, hr: 92, sbp: 122, dbp: 72, rr: 16, spo2: 96, pain: 5, o2: 'Room air' },
          { h: orEnd + 48, temp: 98.6, hr: 80, sbp: 120, dbp: 72, rr: 16, spo2: 97, pain: 3 }, { h: orEnd + 100, temp: 98.2, hr: 74, sbp: 118, dbp: 70, rr: 16, spo2: 98, pain: 2 }
        ] : [
          { h: 0, temp: 98.9, hr: 108, sbp: 118, dbp: 72, rr: 18, spo2: 97, pain: 7, o2: 'Room air' }, { h: 6, temp: 98.8, hr: 98, sbp: 124, dbp: 76, rr: 16, spo2: 97, pain: 4 },
          { h: 24, temp: 98.6, hr: 90, sbp: 126, dbp: 78, rr: 16, spo2: 97, pain: 3 }, { h: 36, temp: 98.4, hr: 84, sbp: 122, dbp: 74, rr: 16, spo2: 98, pain: 2 }, { h: 60, temp: 98.2, hr: 76, sbp: 120, dbp: 72, rr: 16, spo2: 98, pain: 1 }
        ],
        labs: {
          WBC: { abs: failed ? [[0, 11.8], [30, 10.4], [55, 12.1], [orEnd + 24, 13.5], [orEnd + 72, 9.2]] : [[0, 11.8], [24, 9.6], [48, 8.1]] },
          Sodium: { add: [[0, -5], [24, -2], [48, 0]] }, Potassium: { add: [[0, -0.9], [6, -0.4], [24, -0.1], [48, 0]] }, Chloride: { add: [[0, -6], [24, -2], [48, 0]] }, CO2: { add: [[0, 3], [24, 1], [48, 0]] },
          Creatinine: { add: [[0, 0.45], [24, 0.1], [48, 0]] }, BUN: { add: [[0, 16], [24, 6], [48, 0]] }, Glucose: { add: [[0, 18], [30, 6], [60, 0]] },
          Magnesium: { abs: [[0, 1.5], [24, 1.9]] }, Lactate: { abs: [[0.4, 1.9], [6, 1.2]] }, Hemoglobin: { add: [[0, 1.2], [24, 0.2], [orEnd + 8, -0.8]] }, Albumin: { add: [[0, -0.3]] }
        },
        labSchedule: [{ h: 0.5, codes: ['Lactate', 'Magnesium', 'Lipase', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin'] }, { h: 6, codes: ['Lactate', 'Potassium', 'Magnesium'] }, { daily: true, fromH: 20, codes: ['Phosphorus'] }],
        quals: [{ h: 0.7, category: 'Urinalysis', code: 'Urinalysis - specific gravity', value: '1.032', reference: '1.005-1.030', flag: 'High', specimen: 'Urine' }, { h: 0.7, category: 'Urinalysis', code: 'Urinalysis - ketones', value: 'Trace', reference: 'Negative', flag: 'Abnormal', specimen: 'Urine' }],
        events: [
          { type: 'imaging', h: 1.6, study: 'CT abdomen and pelvis with IV contrast', modality: 'CT', contrast: true, indication: 'Abdominal distension, vomiting, obstipation',
            findings: 'Multiple dilated, fluid-filled small bowel loops measuring up to 3.8 cm with air-fluid levels. An abrupt transition point is seen in the right lower quadrant adjacent to surgical adhesive change, with collapsed distal ileum and decompressed colon. No pneumatosis, free air, mesenteric swirl, or bowel wall thickening to suggest ischemia. Small amount of free fluid.',
            impression: 'High-grade small bowel obstruction with transition point in the right lower quadrant, most consistent with adhesions. No evidence of ischemia or perforation.' },
          { type: 'procedure', h: 2.4, duration: 0.3, name: 'Nasogastric tube placement', label: 'NG tube placed to low intermittent suction', by: 'ed', service: 'Emergency Medicine', indication: 'Decompression of small bowel obstruction', findings: '18 Fr nasogastric tube placed via the right naris without difficulty; position confirmed by auscultation and abdominal x-ray; connected to low intermittent wall suction. 850 mL of bilious fluid returned immediately with symptom relief.' },
          { type: 'consult', h: 2.8, service: 'General Surgery', author: 'surgeon', reason: 'Small bowel obstruction', label: 'Surgery consulted; non-operative management', recommendation: 'Admit to General Surgery. NPO, NG to LIWS, IV fluids with electrolyte repletion, serial abdominal exams, Gastrografin challenge in the morning. Surgery if peritonitis, ischemia, or failure to improve.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to the surgical unit', text: 'Transferred from the ED to the surgical unit.' },
          { type: 'imaging', h: kubH, study: 'Abdominal x-ray (KUB), 6-hour Gastrografin follow-up', modality: 'X-ray', indication: 'Water-soluble contrast challenge',
            findings: failed ? 'Contrast remains within dilated small bowel loops. No contrast has reached the colon at 6 hours. Persistent air-fluid levels.' : 'Oral contrast has passed through the small bowel and is present in the colon and rectum. Interval decrease in small bowel dilatation.',
            impression: failed ? 'Failed Gastrografin challenge: no contrast in the colon at 6 hours.' : 'Gastrografin challenge passed: contrast in the colon at 6 hours; obstruction resolving.' },
          ...(failed ? [
            { type: 'imaging', h: 55, study: 'Abdominal x-ray, upright and supine', modality: 'X-ray', indication: 'Persistent NG output and distension', findings: 'Persistent dilated small bowel loops with air-fluid levels; no free air.', impression: 'Persistent small bowel obstruction without perforation.' },
            { type: 'surgery', h: orH, duration: orDur, name: 'Exploratory laparotomy with lysis of adhesions', label: 'Exploratory laparotomy, lysis of adhesions', anesthesia: 'General endotracheal', orderH: 66, indication: 'Adhesive small bowel obstruction, failed non-operative management',
              findings: 'A single dense fibrous band in the right lower quadrant causing a transition point with markedly dilated proximal small bowel and collapsed distal bowel. Bowel viable after release; no resection required.',
              procedure: 'Midline laparotomy. Adhesions lysed sharply and the obstructing band divided. Entire small bowel run and inspected; peristalsis returned. Fascia closed with running suture and skin with staples. NG tube left to suction.', ebl: '50 mL', fluids: "2,500 mL lactated Ringer's", specimens: 'None', complications: 'None', disposition: 'PACU, then surgical unit' }
          ] : [])
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.5, by: 'ed', indication: 'Dehydration from vomiting and third spacing' }),
          { key: 'kcl_iv', name: 'potassium chloride IV replacement (4 runs of 10 mEq/100 mL)', dose: '40 mEq', route: 'IV', freq: 'once', startH: 2.0, volume: 400, cls: 'Electrolyte replacement', info: 'Central line preferred above 10 mEq/hr; via peripheral IV give no faster than 10 mEq/hr. Burns at the IV site; monitor site and ECG.', monitor: ['K', 'Cr'], indication: 'Hypokalemia from vomiting / NG losses', highAlert: true, by: 'surgeon', renal: { ckd3: { dose: '20 mEq', note: 'Reduced replacement for CKD' }, esrd: { avoid: true } } },
          { key: 'lr_kcl', name: "lactated Ringer's with potassium chloride 20 mEq/L infusion", dose: '125 mL/hr', rate: '125 mL/hr', mlPerHr: 125, route: 'IV', freq: 'continuous', fluid: true, startH: 3, stopH: failed ? 118 : 46, cls: 'Crystalloid IV fluid with electrolyte', info: 'Replaces NG and third-space losses. Assess lungs, edema, I&O and daily weight.', monitor: ['K', 'Na'], indication: 'Hydration and electrolyte replacement while NPO', by: 'surgeon', renal: { esrd: { avoid: true, sub: { key: 'ns_maint_esrd', name: '0.9% sodium chloride infusion', dose: '40 mL/hr', rate: '40 mL/hr', mlPerHr: 40 } } } },
          C.opioidIV(ctx, { start: 0.8, stop: failed ? 118 : 36, given: failed ? [0.8, 3.5, 7, 11, 16, 22, 28, 34, 40, 48, 56, 63, 70, 75, orEnd + 1, orEnd + 4, orEnd + 8, orEnd + 12, orEnd + 18, orEnd + 24, orEnd + 30] : [0.8, 3.5, 7, 12, 18, 25, 30] }),
          C.ondansetron({ start: 0.8, given: failed ? [0.8, 2.2, 10, 20, 33, 60, orEnd + 3, orEnd + 20] : [0.8, 2.2, 10, 20, 33] }),
          Object.assign(C.acetaminophenIV({ start: 3, stop: dietClear }), { by: 'surgeon' }),
          Object.assign(C.acetaminophenPO({ start: dietClear }), { by: 'surgeon' }),
          { key: 'pantoprazole', name: 'pantoprazole (PROTONIX) injection', dose: '40 mg', route: 'IV', freq: 'daily', startH: 3, stopH: dietClear, cls: 'Proton pump inhibitor', info: 'Stress ulcer prophylaxis while NPO with NG to suction.', indication: 'Stress ulcer prophylaxis while NPO', by: 'surgeon' },
          { key: 'gastrografin', name: 'diatrizoate meglumine-sodium (GASTROGRAFIN) oral contrast', dose: '100 mL', route: 'Per NG tube', freq: 'once', startH: ggH, cls: 'Water-soluble contrast', info: 'Clamp NG tube for 4 hours after instillation, then return to suction. Radiograph at 6 hours. Observe for aspiration and diarrhea.', monitor: ['Na'], indication: 'Gastrografin challenge (diagnostic and therapeutic)', by: 'surgeon', nursing: ['Clamp the NG tube after instillation; unclamp and return to suction if nausea or vomiting.'] },
          ...(failed ? [Object.assign(C.opioidPO(ctx, { start: 118, given: [orEnd + 40] }), { by: 'surgeon' })] : [])
        ],
        orders: [
          C.diet('NPO', 0.5, dietClear, 'Nothing by mouth; NG to low intermittent suction.'),
          C.diet('Clear liquid diet', dietClear, dietLow, 'Advance as tolerated; stop if nausea, distension or vomiting.'),
          C.diet('Low residue diet', dietLow, dietReg, 'Small frequent meals.'),
          C.diet('Regular diet', dietReg, undefined, 'Advance as tolerated.'),
          C.activity('Up with assistance', 0.5, failed ? orH - 1 : undefined, 'Walking promotes return of bowel function; keep NG tube secured and suction attached.'),
          ...(failed ? [C.activity('Bed rest until awake, then up with assistance', orH - 1, orEnd + 4), C.activity('Ambulate with assistance three times daily', orEnd + 4, undefined, 'Early mobilization; splint incision when coughing.'), C.incentive(orEnd, undefined)] : []),
          { name: 'Nasogastric tube to low intermittent suction', category: 'Nursing', frequency: 'Continuous', startH: 2.4, stopH: ngOutH, instructions: 'Maintain LIWS; irrigate with 30 mL saline PRN occlusion; record output every shift; check placement and nare skin.', nursing: ['Keep HOB at 30 degrees; mouth care every 4 hours; notify provider for bright red output or sudden drop in output with distension.'] },
          { name: 'Strict intake and output', category: 'Nursing', frequency: 'Every shift', startH: 2.5, instructions: 'Include NG output, emesis, urine and stool.' },
          { name: 'Serial abdominal exams', category: 'Nursing', frequency: 'Every 4 hours', startH: 3, stopH: ngOutH + 12, instructions: 'Assess distension, tenderness, guarding, bowel sounds and flatus. Notify provider for peritoneal signs, fever or worsening pain.' },
          { name: 'Daily weight', category: 'Nursing', frequency: 'Daily', startH: 3, instructions: 'Same scale each morning.' },
          { name: 'Gastrografin challenge: KUB at 6 hours', category: 'Imaging', frequency: 'Once', startH: ggH - 1, completeH: kubH, instructions: 'Instill contrast via NG, clamp 4 hours, x-ray at 6 hours.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', startH: 2.5, instructions: 'Notify provider for HR above 120, SBP below 90, temperature above 100.4 F, or increasing abdominal pain.' }
        ],
        devices: [
          { deviceType: 'Tube', type: 'Nasogastric tube (18 Fr)', location: 'Right naris to stomach', siteMarker: 'ngTube', placeH: 2.4, removeH: ngOutH, status: 'To low intermittent suction', drainage: ctx.nowH < ggH ? '620 mL bilious over the last 12 hours' : ctx.nowH < kubH ? 'Clamped for Gastrografin challenge' : '150 mL green-bilious over the last 12 hours', assess: 'secured with tape, nare skin intact, to LIWS with bilious drainage' },
          C.pivSecond(5.0, 'Left antecubital', '18 gauge'),
          ...(failed ? [{ deviceType: 'Tube', type: 'Foley catheter', location: 'Urethral', siteMarker: 'pelvis', placeH: orH + 0.2, removeH: orEnd + 24, status: 'Draining', assess: 'draining clear yellow urine, secured to thigh' }] : [])
        ],
        assessments: [
          { fromH: 0, items: [['GI', 'Abdomen', 'Distended, tympanic, diffusely tender without guarding or rebound; no rigidity'], ['GI', 'Bowel Sounds', 'Hyperactive, high-pitched, with rushes'], ['GI', 'Nausea / Vomiting', 'Nausea with repeated bilious emesis x4 at home'], ['GI', 'Last BM / Flatus', 'No BM or flatus for 36 hours'], ['Pain', 'Pain Location', 'Diffuse crampy abdominal pain, colicky'], ['Skin', 'Skin', 'Dry mucous membranes, decreased skin turgor']] },
          { fromH: 3, items: [['GI', 'Abdomen', 'Distended, tympanic, mildly tender; no guarding or rebound'], ['GI', 'Nausea / Vomiting', 'Nausea relieved after NG placement; no emesis'], ['GI', 'NG Tube', 'NG to low intermittent suction; bilious drainage; secured'], ['Skin', 'Skin', 'Dry mucous membranes; skin turgor improving'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulates with NG tube and IV pole, steady']] },
          { fromH: 20, items: [['GI', 'Abdomen', 'Less distended, soft, mild tenderness; no rebound'], ['GI', 'Bowel Sounds', 'Active, intermittent'], ['GI', 'NG Tube', 'NG to LIWS; decreasing bilious output'], ['Skin', 'Skin', 'Mucous membranes moist']] },
          { fromH: ggH, items: [['GI', 'NG Tube', 'NG tube clamped after Gastrografin instillation']] },
          ...(failed ? [
            { fromH: 31, items: [['GI', 'NG Tube', 'NG unclamped to LIWS; persistent bilious output'], ['GI', 'Abdomen', 'Distended, firm, tender; no peritoneal signs'], ['GI', 'Last BM / Flatus', 'No flatus'], ['Pain', 'Pain Location', 'Abdominal cramping, 5/10']] },
            { fromH: orEnd, items: [['GI', 'Abdomen', 'Soft, distended; midline laparotomy incision with staples'], ['GI', 'NG Tube', 'NG to LIWS; green-bilious output'], ['GI', 'Bowel Sounds', 'Absent'], ['Skin', 'Surgical Incisions', 'Midline incision approximated with staples; dressing clean, dry, intact'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,000 mL'], ['GU', 'Urinary Elimination', 'Foley catheter to gravity, clear yellow urine'], ['Musculoskeletal / Mobility', 'Mobility', 'Up with one assist']] },
            { fromH: orEnd + 30, items: [['GI', 'Bowel Sounds', 'Hypoactive, present'], ['GI', 'Last BM / Flatus', 'Passing flatus'], ['GI', 'NG Tube', 'NG discontinued'], ['GI', 'Nausea / Vomiting', 'None'], ['GU', 'Urinary Elimination', 'Voiding spontaneously after Foley removal']] },
            { fromH: orEnd + 56, items: [['GI', 'Last BM / Flatus', 'Bowel movement today'], ['GI', 'Abdomen', 'Soft, non-distended, appropriately tender at incision'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating independently']] }
          ] : [
            { fromH: 32, items: [['GI', 'NG Tube', 'NG tube discontinued'], ['GI', 'Abdomen', 'Soft, non-distended, minimal tenderness'], ['GI', 'Bowel Sounds', 'Active'], ['GI', 'Last BM / Flatus', 'Passing flatus; large loose BM after Gastrografin'], ['GI', 'Nausea / Vomiting', 'None'], ['Pain', 'Pain Location', 'Mild abdominal soreness'], ['Skin', 'Skin', 'Warm and dry, mucous membranes moist']] },
            { fromH: 48, items: [['GI', 'Last BM / Flatus', 'Bowel movements x2'], ['GI', 'Abdomen', 'Soft, non-tender, non-distended']] }
          ])
        ],
        io: failed ? [
          { fromH: 0, po: 0, urine: 240, other: 380, otherLabel: 'NG output' }, { fromH: 12, po: 0, urine: 300, other: 280, otherLabel: 'NG output' }, { fromH: ggH, po: 0, urine: 300, other: 20, otherLabel: 'NG output' }, { fromH: 31, po: 0, urine: 300, other: 260, otherLabel: 'NG output' },
          { fromH: orH, po: 0, urine: 260, other: 350, otherLabel: 'NG output' }, { fromH: orEnd + 30, po: 100, urine: 340, other: 0 }, { fromH: dietLow, po: 280, urine: 340, other: 0 }, { fromH: dietReg, po: 380, urine: 330, other: 0 }
        ] : [
          { fromH: 0, po: 0, urine: 240, other: 420, otherLabel: 'NG output' }, { fromH: 12, po: 0, urine: 300, other: 300, otherLabel: 'NG output' }, { fromH: 20, po: 0, urine: 300, other: 150, otherLabel: 'NG output' }, { fromH: ggH, po: 0, urine: 300, other: 20, otherLabel: 'NG output' },
          { fromH: 32, po: 40, urine: 320, other: 0 }, { fromH: dietClear, po: 120, urine: 330, other: 0 }, { fromH: dietLow, po: 280, urine: 330 }, { fromH: dietReg, po: 380, urine: 330 }
        ],
        stages: sboStages(ctx, failed, ggH, kubH, orH, orEnd, ngOutH, dietClear, dietLow, dietReg),
        therapy: { fromH: failed ? orEnd + 28 : 52 },
        objectives: ['Manage a patient with an NG tube to suction, strict I&O and serial abdominal assessments.', 'Recognize signs of strangulation or perforation (fever, rigidity, rebound, rising lactate, tachycardia).', 'Monitor and replace electrolytes (hypokalemia, hypomagnesemia, dehydration).']
      };
      return spec;
    }
  };

  function sboStages(ctx, failed, ggH, kubH, orH, orEnd, ngOutH, dietClear, dietLow, dietReg) {
    const st = [];
    st.push({
      fromH: 0, id: 'acute', label: 'Acute SBO: NPO, NG decompression',
      problem: 'High-grade adhesive small bowel obstruction; NG decompression and bowel rest.',
      subj: 'Cramping abdominal pain improved after NG tube placement (now 3-4/10). Nausea much better. Still no flatus or bowel movement. Thirsty.',
      assess: 'Adhesive SBO without signs of ischemia; hypokalemic and dehydrated; trial of non-operative management.',
      plan: ['NPO; NG tube to low intermittent suction; strict I&O.', 'IV fluids with potassium; replace K and Mg to goals of 4.0 and 2.0.', 'Serial abdominal exams every 4 hours and labs including lactate; surgery to re-examine.', `Gastrografin challenge tomorrow morning (about ${clock(ctx, ggH)}).`, 'IV analgesia and antiemetic as needed; avoid prokinetics.'],
      nursing: ['NG tube to LIWS with bilious output; nares skin intact; HOB elevated.', 'Abdomen distended and tympanic; no guarding; pain improved after NG placement.', 'IV potassium infused slowly through a large IV site without infiltration.', 'Strict I&O maintained; urine concentrated.'],
      teach: ['Purpose of NG tube and bowel rest, why no ice chips or sips, mouth care, and reporting worsening pain, vomiting or fever.'],
      dispo: 'Anticipate 3-5 days if the obstruction resolves without surgery.',
      stickies: [{ title: 'NPO / NG to suction', body: 'No PO. Strict I&O with NG output. Report fever, rigid abdomen, rebound, increasing pain, or a sudden drop in NG output with distension.' }]
    });
    st.push({
      fromH: ggH, id: 'gg', label: 'Gastrografin challenge',
      problem: 'Adhesive SBO: Gastrografin challenge in progress.',
      subj: failed ? 'Persistent cramping; nausea returns when NG is unclamped. No flatus.' : 'Feels less distended; mild cramping. Had some gurgling and passed flatus after the contrast.',
      assess: failed ? 'Obstruction persists after Gastrografin challenge; failing non-operative management.' : 'Gastrografin challenge in progress; clinically improving.',
      plan: failed ? ['NG back to suction after clamp trial; remain NPO.', 'Surgery to reassess in 24-48 hours; consider OR if no improvement.'] : ['Gastrografin given via NG at the planned time; clamp for 4 hours; KUB at 6 hours.', 'If contrast reaches the colon, remove NG and start clear liquids.'],
      nursing: ['Gastrografin 100 mL instilled via NG; tube clamped for 4 hours; tolerated without nausea.', 'Monitored for aspiration, abdominal pain and diarrhea; repeat x-ray at 6 hours.'],
      teach: ['Explained the Gastrografin challenge and why the tube is clamped.'],
      dispo: failed ? 'Possible surgery.' : 'Anticipate discharge in 2-3 days if the challenge passes.'
    });
    if (!failed) {
      st.push({
        fromH: 32, id: 'resolving', label: 'Obstruction resolving: NG out, diet advancing',
        problem: 'Adhesive SBO resolving after successful Gastrografin challenge.',
        subj: 'Feels much better; abdomen soft, passing flatus and had a large loose bowel movement. No nausea. Hungry.',
        assess: 'Small bowel obstruction resolved with non-operative management; contrast reached the colon.',
        plan: ['NG tube removed; clear liquids then advance to low-residue then regular diet as tolerated.', 'Stop IV fluids once drinking; continue to replete electrolytes.', 'Ambulate; monitor for recurrent nausea, distension or vomiting with each diet advance.', 'No laxatives or opioids unless needed.'],
        nursing: ['NG tube removed without difficulty; clear liquids tolerated without nausea.', 'Passing flatus; loose stool after contrast.', 'Walking in hall; abdomen soft and non-distended.'],
        teach: ['Diet progression, small frequent meals, walking, and warning signs of recurrence (vomiting, distension, no flatus).'],
        dispo: 'Discharge when tolerating a regular diet and having bowel movements.'
      });
      st.push({
        fromH: dietReg - 4, id: 'ready', label: 'Tolerating diet; discharge planning',
        problem: 'Adhesive SBO resolved; tolerating regular diet.',
        subj: 'Eating regular meals without nausea or distension. Regular bowel movements. Pain-free. Ready to go home.',
        assess: 'Resolved adhesive SBO; meets discharge criteria.',
        plan: ['Discharge home today with surgical clinic follow-up in 2 weeks.', 'Return precautions: vomiting, abdominal distension, inability to pass stool or gas, fever, severe pain.', 'Counsel that adhesions can cause recurrence.'],
        nursing: ['Tolerating regular diet; ambulating independently; voiding and having bowel movements.', 'Discharge teaching with teach-back; no IV needed.'],
        teach: ['Teach-back on warning signs of recurrent obstruction, hydration, diet, and when to return to the ED.'],
        dispo: 'Discharge home.',
        stickies: [{ title: 'Discharge today', body: 'Tolerating regular diet. Discharge teaching and teach-back; remove IV; confirm ride.' }]
      });
    } else {
      st.push({
        fromH: 31, id: 'failed', label: 'Failing non-operative management',
        problem: 'Persistent high-grade SBO; failed non-operative management; considering surgery.',
        subj: 'Ongoing cramping and bloating; NG output persists; no flatus. Low-grade temperatures. Understands that surgery may be needed.',
        assess: 'No resolution after Gastrografin challenge and 48-72 hours of decompression; rising WBC and temperature raise concern for evolving ischemia.',
        plan: ['Continue NPO, NG to suction, IV fluids; repeat labs including lactate.', 'Plan exploratory laparotomy with lysis of adhesions if no improvement; consent discussion done.', 'Type and screen; hold DVT prophylaxis timing per surgery.'],
        nursing: ['Persistent NG output; abdomen firm and distended; low-grade temperature.', 'Pre-operative teaching started; consent in chart.'],
        teach: ['Explained why surgery is being considered and what to expect after laparotomy.'],
        dispo: 'Prolonged stay anticipated.'
      });
      st.push({
        fromH: orEnd, id: 'postop0', label: 'Post-operative day 0 (laparotomy)',
        problem: 'Status post exploratory laparotomy with lysis of adhesions for SBO (POD 0).',
        subj: 'Incisional pain 5-6/10 with movement, controlled with IV opioid. Nausea mild. NG to suction.',
        assess: 'POD 0 laparotomy with lysis of adhesions; bowel viable, no resection; expected ileus.',
        plan: ['NG to suction until bowel function returns; NPO; IV fluids.', 'Multimodal analgesia; incentive spirometry, ambulate with assistance.', 'DVT prophylaxis; Foley to be removed in 24 hours.'],
        nursing: ['Midline incision dressing clean, dry, intact; NG to LIWS; Foley draining clear urine.', 'Pain managed with IV opioid; incentive spirometer 1,000 mL; up to chair with assistance.'],
        teach: ['Splinting the incision with a pillow, incentive spirometer, and why diet is on hold.'],
        dispo: 'Expect 4-7 more days.'
      });
      st.push({
        fromH: orEnd + 24, id: 'pod1', label: 'Post-operative day 1-2: ileus resolving',
        problem: 'Post-laparotomy ileus resolving; NG removed when flatus returned.',
        subj: 'Pain 3/10 on oral medication. Passing flatus, nausea gone, NG removed. Foley removed and voiding.',
        assess: 'Recovering from laparotomy; bowel function returning.',
        plan: ['Advance diet clears then low-residue then regular as tolerated.', 'Stop IV fluids; transition to oral pain medication.', 'Ambulate three times daily; staples out at follow-up.'],
        nursing: ['Passing flatus; tolerating clears; ambulating in hall with standby assist.', 'Incision clean, dry, intact with staples.'],
        teach: ['Incision care, no lifting over 10 lb for 6 weeks, and signs of infection or recurrent obstruction.'],
        dispo: 'Home in 1-3 days if tolerating diet.'
      });
      st.push({
        fromH: dietReg, id: 'ready', label: 'Discharge planning after laparotomy',
        problem: 'POD 3+ after laparotomy for SBO; tolerating regular diet; discharge planning.',
        subj: 'Eating regular meals, bowel movement today, pain controlled with acetaminophen.',
        assess: 'Recovered; meets discharge criteria.',
        plan: ['Discharge home with surgical follow-up in 2 weeks for staple removal.', 'Return precautions reviewed.'],
        nursing: ['Ambulating independently; regular diet; bowel movement; incision clean, dry, intact.', 'Discharge teaching with teach-back.'],
        teach: ['Incision care, activity restrictions, return precautions.'],
        dispo: 'Discharge home.'
      });
    }
    return st;
  }

  // ============================================================================ CHOLECYSTITIS
  NS.PRIMARY.cholecystitis = {
    key: 'cholecystitis', label: 'Acute Cholecystitis', group: 'Surgical', cat: 'Gastrointestinal / Abdominal Surgery', typicalLOS: [2, 4],
    desc: 'RUQ pain, gallstones on ultrasound. Day 1: NPO, antibiotics, pre-op. Day 2: lap chole. Day 3-4: post-op/discharge. Day 6+: gangrenous, JP drain.',
    build(ctx) {
      const comp = ctx.L >= 6;
      const orH = 30.5, dur = comp ? 2.5 : 1.25, orEnd = orH + dur;
      const orTime = clock(ctx, orH);
      const dietClear = orEnd + (comp ? 20 : 6), dietReg = orEnd + (comp ? 44 : 20);
      const abxStop = comp ? orEnd + 72 : orEnd + 6;
      const spec = {
        primaryTeam: 'surgeon', typicalLOS: [2, 4], noAutoProlonged: comp,
        problem: { name: 'Acute cholecystitis', details: comp ? 'Gangrenous cholecystitis, status post laparoscopic converted to subtotal cholecystectomy with drain.' : 'Acute calculous cholecystitis.' },
        chief: 'Right upper quadrant abdominal pain with nausea and fever',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 18 hours of severe, constant right upper quadrant pain radiating to the right shoulder blade that began after a fatty meal, with nausea, two episodes of vomiting, anorexia and subjective fever. Had similar but brief episodes of RUQ pain after meals over the past months. No jaundice, dark urine or clay-colored stools.`,
        ros: 'Positive for RUQ pain, nausea, vomiting, anorexia and fever. Negative for jaundice, dark urine, pale stools, chest pain, dyspnea and dysuria.',
        keyLabs: ['WBC', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Lipase', 'Creatinine', 'Glucose'], isolation: 'None',
        flags: { npo: [[0.5, dietClear]], preop: [[0, orH]], surgeryWindow: [[0, orH + 24]], postop: [[orEnd, 9999]] },
        vitals: [
          { h: 0, temp: 100.8, hr: 102, sbp: 138, dbp: 84, rr: 18, spo2: 98, pain: 8, o2: 'Room air' }, { h: 3, temp: 100.4, hr: 96, sbp: 134, dbp: 80, rr: 18, spo2: 98, pain: 5 },
          { h: 24, temp: 99.6, hr: 88, sbp: 130, dbp: 78, rr: 16, spo2: 98, pain: 4 }, { h: orH, temp: 99.2, hr: 86, sbp: 128, dbp: 76, rr: 16, spo2: 98, pain: 4 },
          { h: orEnd, temp: 98.8, hr: 80, sbp: 118, dbp: 70, rr: 14, spo2: 97, pain: 5, o2: '2 L nasal cannula' }, { h: orEnd + 4, temp: 99.2, hr: 84, sbp: 122, dbp: 74, rr: 16, spo2: 96, pain: 4, o2: 'Room air' },
          { h: orEnd + 24, temp: comp ? 100.0 : 98.8, hr: comp ? 92 : 78, sbp: 120, dbp: 72, rr: 16, spo2: 97, pain: 3 }, { h: orEnd + 70, temp: 98.4, hr: 74, sbp: 118, dbp: 70, rr: 16, spo2: 98, pain: 2 }
        ],
        labs: {
          WBC: { abs: comp ? [[0, 17.8], [24, 16.9], [orEnd + 12, 18.6], [orEnd + 48, 13.0], [orEnd + 96, 9.1]] : [[0, 14.6], [24, 12.8], [orEnd + 12, 13.6], [orEnd + 40, 9.9], [orEnd + 80, 8.4]] },
          AST: { abs: [[0, 68], [24, 52], [orEnd + 24, 38], [orEnd + 72, 28]] }, ALT: { abs: [[0, 74], [24, 60], [orEnd + 24, 44], [orEnd + 72, 32]] }, ALP: { abs: [[0, 158], [24, 150], [orEnd + 48, 124]] },
          'Total bilirubin': { abs: [[0, 1.8], [24, 1.4], [orEnd + 24, 0.9], [orEnd + 72, 0.7]] }, Lipase: { abs: [[0, 42]] }, Lactate: { abs: [[0.4, 1.7], [6, 1.2]] },
          CRP: { abs: [[0, 78], [24, 112], [orEnd + 24, 96], [orEnd + 72, 40]] }, Glucose: { add: [[0, 20], [30, 14], [70, 0]] }, Hemoglobin: { add: [[0, 0.3], [orEnd + 8, -0.7], [orEnd + 48, -1.0]] }, Albumin: { add: [[0, -0.3]] }
        },
        labSchedule: [{ h: 0.5, codes: ['Lactate', 'CRP', 'Lipase', 'AST', 'ALT', 'ALP', 'Total bilirubin', 'Albumin'] }, { daily: true, fromH: 20, codes: ['AST', 'ALT', 'ALP', 'Total bilirubin', 'CRP'] }],
        quals: [{ h: 0.7, category: 'Urinalysis', code: 'Urinalysis - leukocyte esterase', value: 'Negative', reference: 'Negative', specimen: 'Urine' }, { h: orEnd + 75, category: 'Pathology', code: 'Surgical pathology - gallbladder', value: comp ? 'Acute and chronic cholecystitis with gangrenous necrosis and cholelithiasis; no dysplasia or malignancy' : 'Acute and chronic cholecystitis with cholelithiasis; no dysplasia or malignancy', specimen: 'Gallbladder', status: 'Final' },
          { h: 1, category: 'Microbiology', code: 'Blood cultures x2', value: 'No growth at 5 days (final)', specimen: 'Blood', status: 'Final' }],
        events: [
          { type: 'imaging', h: 1.5, study: 'Ultrasound abdomen, right upper quadrant', modality: 'Ultrasound', indication: 'RUQ pain, fever, leukocytosis',
            findings: 'The gallbladder is distended and contains multiple stones, the largest 1.4 cm, with a stone impacted in the gallbladder neck. The gallbladder wall is thickened to 5.5 mm with trace pericholecystic fluid. Sonographic Murphy sign is positive. The common bile duct measures 4 mm. The liver is normal in echotexture.',
            impression: 'Acute calculous cholecystitis. No biliary ductal dilatation.' },
          { type: 'consult', h: 2.5, service: 'General Surgery', author: 'surgeon', reason: 'Acute calculous cholecystitis', label: 'Surgery consulted; laparoscopic cholecystectomy planned', recommendation: 'Admit to General Surgery. NPO, IV fluids, IV antibiotics, pain control. Laparoscopic cholecystectomy within 24-48 hours of presentation. Consent obtained.' },
          { type: 'transfer', h: 4.0, label: 'Admitted to the surgical unit', text: 'Transferred from the ED to the surgical unit.' },
          { type: 'surgery', h: orH, duration: dur, name: comp ? 'Laparoscopic converted to open subtotal cholecystectomy with drain' : 'Laparoscopic cholecystectomy', label: comp ? 'Subtotal cholecystectomy with JP drain' : 'Laparoscopic cholecystectomy', anesthesia: 'General endotracheal', orderH: 8, indication: comp ? 'Gangrenous acute cholecystitis' : 'Acute calculous cholecystitis',
            findings: comp ? 'Gangrenous, distended gallbladder with dense adhesions and inability to obtain the critical view of safety. Bailout subtotal cholecystectomy performed with closed-suction (JP) drain left in the gallbladder fossa; cystic duct stump stapled.' : 'Acutely inflamed, distended gallbladder with edematous wall and stones. Critical view of safety achieved. Cystic duct and artery clipped and divided. No bile spillage.',
            procedure: comp ? 'Four-port laparoscopic approach converted to a small right subcostal incision. Gallbladder opened and stones removed; gallbladder wall resected leaving the posterior wall; cystic duct stapled; 19 Fr JP drain placed in the gallbladder fossa.' : 'Four-port laparoscopic technique. Gallbladder dissected from the liver bed with electrocautery, placed in a retrieval bag and removed through the umbilical port. Hemostasis confirmed. Port sites closed.',
            ebl: comp ? '150 mL' : '25 mL', fluids: "1,500 mL lactated Ringer's", specimens: 'Gallbladder to pathology', complications: 'None', disposition: 'PACU, then surgical unit' }
        ],
        meds: [
          C.bolus("lactated Ringer's bolus", 1000, { start: 0.5, by: 'ed', indication: 'Dehydration' }),
          C.lrMaintenance({ start: 2, stop: dietClear + 4, rate: 125 }),
          C.opioidIV(ctx, { start: 0.8, stop: dietClear + 6, given: [0.8, 3.5, 8, 14, 20, 27, 33, 38, 42] }),
          C.ondansetron({ start: 0.8, given: [0.8, 12, 34] }),
          { key: 'ceftriaxone', name: 'ceftriaxone (ROCEPHIN) IVPB', dose: '2 g', route: 'IV', freq: 'q24h', anchorStart: true, startH: 2.8, stopH: abxStop, volume: 50, cls: 'Cephalosporin antibiotic', info: 'Verify allergy history. Infuse over 30 minutes. Monitor temperature and WBC.', monitor: ['Temp', 'WBC'], indication: 'Acute cholecystitis', by: 'surgeon' },
          { key: 'metronidazole_iv', name: 'metronidazole (FLAGYL) IVPB', dose: '500 mg', route: 'IV', freq: 'q8h', startH: 3.2, stopH: abxStop, volume: 100, cls: 'Antibiotic (anaerobic coverage)', info: 'Metallic taste and nausea are common. Avoid alcohol.', monitor: ['Temp'], indication: 'Anaerobic biliary coverage', by: 'surgeon' },
          Object.assign(C.acetaminophenIV({ start: orEnd + 0.5, stop: dietClear }), { by: 'surgeon' }),
          Object.assign(C.acetaminophenPO({ start: dietClear }), { by: 'surgeon' }),
          Object.assign(C.ketorolac(ctx, { start: orEnd + 1, stop: orEnd + 25 }), { by: 'surgeon' }),
          Object.assign(C.opioidPO(ctx, { start: dietClear, given: [dietClear + 3, dietClear + 10] }), { by: 'surgeon' })
        ],
        orders: [
          C.diet('NPO', 0.5, dietClear, 'Nothing by mouth (pre-operative and post-operative).'),
          C.diet('Clear liquid diet', dietClear, dietReg, 'Advance as tolerated.'),
          C.diet('Regular diet', dietReg, undefined, 'Low-fat diet recommended; advance as tolerated.'),
          C.activity('Up with assistance', 0.5, orEnd, 'Bathroom privileges with assistance.'),
          C.activity('Bed rest until awake, then up with assistance', orEnd, orEnd + 3),
          C.activity('Ambulate with assistance three times daily', orEnd + 3, undefined, 'Early mobilization.'),
          C.incentive(orEnd, undefined),
          { name: 'Surgical site assessment', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Assess laparoscopic port sites for bleeding, bile staining, redness and drainage.' },
          { name: 'Pre-operative checklist, consent and site verification', category: 'Nursing', frequency: 'Once', startH: 8, completeH: orH - 0.3, instructions: 'Verify consent, ID and allergy bands, NPO status, jewelry/dentures removed, last void, antibiotic within 60 minutes before incision.' },
          { name: 'Vital signs', category: 'Nursing', frequency: 'Every 4 hours', startH: 2.5, instructions: 'Notify provider for temperature above 101.5 F, HR above 110, SBP below 90, or jaundice / worsening RUQ pain.' },
          ...(comp ? [{ name: 'JP drain care and output measurement', category: 'Nursing', frequency: 'Every shift', startH: orEnd, instructions: 'Empty bulb and record volume and color (serosanguineous vs bilious). Notify provider for bilious output above 50 mL or purulent drainage.' }] : []),
          { name: 'Pathology: gallbladder specimen', category: 'Laboratory', frequency: 'Once', startH: orEnd, instructions: 'Specimen sent to surgical pathology.' }
        ],
        devices: [C.pivSecond(orH - 1.0), ...(comp ? [{ deviceType: 'Drain', type: 'JP drain (19 Fr)', location: 'Gallbladder fossa / right upper quadrant', siteMarker: 'abdomenRUQ', placeH: orEnd, removeH: orEnd + 96, status: 'Active', drainage: '60 mL serosanguineous over last 12 hours', assess: 'bulb compressed, dressing clean, dry, intact; output serosanguineous' }] : [])],
        assessments: [
          { fromH: 0, items: [['GI', 'Abdomen', 'RUQ tenderness with guarding; positive Murphy sign; no rebound or rigidity'], ['GI', 'Bowel Sounds', 'Normoactive'], ['GI', 'Nausea / Vomiting', 'Nauseated with 2 emeses at home'], ['Pain', 'Pain Location', 'Right upper quadrant radiating to right scapula, sharp and constant'], ['Skin', 'Skin', 'Warm; no jaundice, mild scleral normal']] },
          { fromH: 24, items: [['GI', 'Abdomen', 'Mildly tender RUQ; no guarding'], ['GI', 'Nausea / Vomiting', 'Mild nausea; no emesis'], ['Pain', 'Pain Location', 'RUQ, dull, 4/10']] },
          { fromH: orEnd, items: [['GI', 'Abdomen', comp ? 'Soft, mildly distended; right subcostal incision with dressing; JP drain in place' : 'Soft, mildly distended, appropriately tender at four laparoscopic port sites'], ['GI', 'Nausea / Vomiting', 'Mild nausea, relieved with ondansetron'], ['Skin', 'Surgical Incisions', comp ? 'Right subcostal incision with staples and 3 port sites; dressings clean, dry, intact' : 'Laparoscopic port sites x4 (umbilicus, epigastric, RUQ x2) with skin glue; dressings clean, dry, intact'], ['Respiratory', 'Breath Sounds', 'Clear, diminished at bases'], ['Respiratory', 'Incentive Spirometer', '1,250 mL'], ['Pain', 'Pain Location', 'Incisions and right shoulder (referred pain from CO2)'], ['Musculoskeletal / Mobility', 'Mobility', 'Up with one assist']] },
          { fromH: orEnd + 20, items: [['GI', 'Abdomen', 'Soft, mildly tender at port sites'], ['GI', 'Nausea / Vomiting', 'None'], ['GI', 'Last BM / Flatus', 'Passing flatus'], ['Respiratory', 'Incentive Spirometer', '1,750 mL'], ['Musculoskeletal / Mobility', 'Mobility', 'Ambulating in hall with standby assist']] },
          { fromH: orEnd + 44, items: [['GI', 'Last BM / Flatus', 'Bowel movement yesterday'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent'], ['Pain', 'Pain Location', 'Port sites, mild soreness']] }
        ],
        io: [{ fromH: 0, po: 0, urine: 270 }, { fromH: dietClear, po: 110, urine: 300 }, { fromH: dietReg, po: 350, urine: 320 }, ...(comp ? [{ fromH: orEnd, po: 0, urine: 280, other: 60, otherLabel: 'JP drain output' }, { fromH: dietClear, po: 110, urine: 300, other: 45, otherLabel: 'JP drain output' }, { fromH: dietReg, po: 350, urine: 320, other: 25, otherLabel: 'JP drain output' }] : [])],
        stages: chole(ctx, comp, orH, orEnd, orTime),
        therapy: { fromH: orEnd + 22 },
        objectives: ['Prepare a patient with acute cholecystitis for surgery and recognize complications (jaundice, bile leak, infection).', 'Monitor port sites and pain, including referred shoulder pain after laparoscopy.', 'Teach low-fat diet and discharge instructions after cholecystectomy.']
      };
      return spec;
    }
  };

  function chole(ctx, comp, orH, orEnd, orTime) {
    const st = [];
    st.push({
      fromH: 0, id: 'preop', label: 'Pre-operative: NPO, IV antibiotics',
      problem: 'Acute calculous cholecystitis; awaiting laparoscopic cholecystectomy.',
      subj: 'RUQ pain improved to 4-5/10 after IV analgesia; mild nausea. Febrile in the ED. Has not eaten since yesterday.',
      assess: 'Acute calculous cholecystitis with fever and leukocytosis; surgery planned within 24-48 hours.',
      plan: ['NPO; maintenance IV fluids.', 'Ceftriaxone and metronidazole.', `Laparoscopic cholecystectomy scheduled for about ${orTime} tomorrow morning; consent obtained.`, 'IV analgesia; antiemetic; monitor LFTs and bilirubin for choledocholithiasis; MRCP if rising.'],
      nursing: ['Patient NPO; RUQ pain 4-5/10 with IV analgesia; guarding right side.', 'IV antibiotics infused without reaction; temperature trending down.', 'Pre-operative teaching started.'],
      teach: ['NPO status, pre-operative routine, and what to expect after laparoscopy including shoulder pain and incentive spirometry.'],
      dispo: 'Anticipate discharge 1-2 days after surgery.',
      stickies: [{ title: 'Pre-op', body: `NPO. OR about ${orTime}. Verify consent, ID and allergy bands, and last intake. Report jaundice or fever above 101.5 F.` }]
    });
    st.push({
      fromH: orEnd, id: 'postop0', label: 'Post-operative day 0',
      problem: comp ? 'Status post subtotal cholecystectomy with JP drain for gangrenous cholecystitis (POD 0).' : 'Status post laparoscopic cholecystectomy (POD 0).',
      subj: 'Awake and comfortable; incisional and right shoulder pain 4-5/10 on IV analgesia. Mild nausea relieved by ondansetron.',
      assess: comp ? 'POD 0 after bailout subtotal cholecystectomy for gangrenous gallbladder; stable on IV antibiotics.' : 'POD 0 laparoscopic cholecystectomy, uncomplicated.',
      plan: comp ? ['Continue IV antibiotics for gangrenous cholecystitis; JP drain to bulb; monitor for bile leak.', 'Advance diet slowly; multimodal analgesia; incentive spirometry; DVT prophylaxis.'] : ['Stop antibiotics after the post-operative dose (no ongoing infection after source control).', 'Clear liquids when awake; advance diet tomorrow.', 'Multimodal analgesia; incentive spirometry; ambulate tonight; DVT prophylaxis.'],
      nursing: ['Returned from PACU alert; port-site dressings clean, dry, intact.', 'Right shoulder pain from CO2 insufflation explained; relieved with ambulation and heat.', 'Incentive spirometer 1,250 mL; voided.'],
      teach: ['Shoulder pain after laparoscopy is expected; splinting, incentive spirometer, and early walking.'],
      dispo: comp ? 'Expect 5-7 more days.' : 'Anticipate discharge tomorrow if tolerating diet.'
    });
    st.push({
      fromH: orEnd + 16, id: 'pod1', label: 'Post-operative day 1',
      problem: comp ? 'POD 1 subtotal cholecystectomy with JP drain.' : 'POD 1 laparoscopic cholecystectomy.',
      subj: comp ? 'Pain 4/10; low-grade fever overnight; drain output serosanguineous, no bile. Tolerating clears.' : 'Pain controlled (3/10) on oral medication. Tolerated clear liquids and advanced to a low-fat diet, no nausea. Passing flatus. Walked in the hall.',
      assess: comp ? 'Recovering; low-grade fever and leukocytosis expected after gangrenous cholecystitis; drain without bile.' : 'Recovering as expected; meets criteria for discharge today.',
      plan: comp ? ['Continue antibiotics; trend WBC, LFTs and bilirubin.', 'JP drain output monitoring; remove when output low and non-bilious.', 'Advance diet; ambulate.'] : ['Advance to low-fat regular diet; saline lock IV.', 'Oral analgesics; no antibiotics.', 'Discharge home today with surgical follow-up in 2 weeks.'],
      nursing: comp ? ['Low-grade fever; JP bulb emptied, 60 mL serosanguineous.', 'Ambulating with assistance; clears tolerated.'] : ['Slept well; ambulating in hall; tolerating low-fat diet without nausea.', 'Port sites clean, dry, intact with skin glue.', 'Pain 2-3/10 controlled with oral medication.'],
      teach: comp ? ['JP drain care and recording output; signs of bile leak or infection.'] : ['Discharge teaching: port-site care, showering, no lifting over 10 lb for 2 weeks, low-fat diet, pain regimen, return precautions (fever, jaundice, vomiting, wound redness or drainage).'],
      dispo: comp ? 'Prolonged stay anticipated.' : 'Anticipated discharge home today.'
    });
    if (!comp) {
      st.push({
        fromH: orEnd + 40, id: 'pod2', label: 'Post-operative day 2: discharge',
        problem: 'POD 2 laparoscopic cholecystectomy; ready for discharge.',
        subj: 'Pain minimal on acetaminophen. Eating a low-fat diet, bowel movement today. Ready to go home.',
        assess: 'Recovered well after uncomplicated cholecystectomy; meets discharge criteria.',
        plan: ['Discharge home with prescriptions (acetaminophen, short course of oxycodone only if needed, stool softener).', 'Pathology pending; surgical clinic follow-up in 2 weeks.'],
        nursing: ['Ambulating independently; tolerating diet; pain 1-2/10.', 'Discharge instructions reviewed with teach-back.'],
        teach: ['Teach-back on wound care, activity restrictions, low-fat diet progression, and warning signs.'],
        dispo: 'Discharge home today.',
        stickies: [{ title: 'Discharge today', body: 'Discharge teaching with teach-back; remove IV; confirm ride and prescriptions.' }]
      });
    } else {
      st.push({
        fromH: orEnd + 48, id: 'comp', label: 'Recovering after gangrenous cholecystitis',
        problem: 'Gangrenous cholecystitis s/p subtotal cholecystectomy; drain output declining; completing antibiotics.',
        subj: 'Feels better; eating low-fat diet; drain output small and serosanguineous. No fever for 24 hours.',
        assess: 'Improving; drain without bile; WBC trending down.',
        plan: ['Remove JP drain once output below 30 mL/day and non-bilious.', 'Complete IV antibiotics, then stop (no oral step-down needed if source controlled and afebrile).', 'Discharge home with surgical follow-up and drain care if still in place.'],
        nursing: ['JP bulb emptied; output 20-40 mL serosanguineous; site clean, dry, intact.', 'Ambulating independently; tolerating diet.'],
        teach: ['Drain care if discharged with drain; signs of bile leak (bilious drainage, jaundice, fever) and infection.'],
        dispo: 'Discharge when afebrile, tolerating diet and drain removed or teaching complete.'
      });
    }
    return st;
  }
})();

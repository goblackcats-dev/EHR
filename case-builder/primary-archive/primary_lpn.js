/* LPN Med Pass cases (category "LPN Med Pass", every key starts with lpn_ and every label starts with "LPN Med Pass:").
   Very simple acute-admission problems for first-semester LPN medication-pass practice with patient and medication scanning.
   Each chart has exactly THREE ordered medications: one by mouth (PO), one subcutaneous (SubQ) and one intramuscular (IM). Nothing else is ordered:
   no IV, no routine labs, no DVT prophylaxis, no PRN extras (spec.simpleMedPass tells rules.js to skip them).
   Add medical history in the builder only if you want a bigger chart. Everything is hours since admission. */
NS.PRIMARY = NS.PRIMARY || {};
(() => {
  const C = NS.C;
  const quiet = (ctx, d) => ({
    primaryTeam: 'hospitalist', typicalLOS: [1, 3], noAutoProlonged: true, simpleMedPass: true, noPpx: true,
    problem: { name: d.problem, details: d.details },
    chief: d.chief, hpi: d.hpi, ros: d.ros, keyLabs: d.keyLabs || [], hpLabs: d.keyLabs || [],
    isolation: 'None', flags: { npo: [] }, fallRiskBoost: d.fall || 0,
    vitals: d.vitals, labs: d.labs || {}, labSchedule: d.labSchedule || [], quals: d.quals || [],
    events: [{ type: 'transfer', h: 3.5, label: 'Admitted to the medical unit', text: 'Transferred from the ED to the medical unit.' }],
    meds: d.meds,
    orders: [
      C.diet(d.diet || 'Regular diet', 3, undefined, d.dietNote || 'Eat meals as tolerated.'),
      C.activity(d.activity || 'Up with assistance as needed', 3, undefined, d.activityNote || 'Call light within reach.'),
      ...(d.orders || [])
    ],
    devices: [], assessments: d.assessments, io: [{ fromH: 0, po: 500, urine: 500 }, { fromH: 24, po: 1200, urine: 1100 }],
    stickies: [{ title: 'Medication pass', body: d.sticky || 'Scan the patient wristband first, then scan each medication. Check the five rights and the hold parameters before giving.' }],
    objectives: d.objectives,
    discharge: { dispo: () => 'Home', estimate: 'within 24-48 hours' }
  });
  const prof = (key, label, desc, d) => { NS.PRIMARY[key] = { key, label: `LPN Med Pass: ${label}`, group: 'Medical', cat: 'LPN Med Pass', typicalLOS: [1, 3], desc, build: ctx => quiet(ctx, d(ctx)) }; };
  const norm = (extra) => Object.assign({ temp: 98.4, hr: 76, sbp: 124, dbp: 76, rr: 16, spo2: 98, pain: 0, o2: 'Room air' }, extra);

  // ---------------------------------------------------------------- shared medication definitions (all due at 0900 unless noted)
  const enox = (why) => ({ key: 'enoxaparin', name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: 'daily', startH: 1.0, cls: 'Anticoagulant (prophylaxis)', by: 'hospitalist', highAlert: true,
    hold: 'Hold and notify the provider for active bleeding or platelets below 50.', indication: why,
    info: 'HIGH-ALERT. Give in the abdomen at least 2 inches from the belly button; rotate sides each day. Do not expel the air bubble from the prefilled syringe. Do not rub the site. Check for bleeding, bruising and black stools before giving.' });
  const heparin = (why) => ({ key: 'heparin_ppx', name: 'heparin injection', dose: '5,000 units', route: 'Subcutaneous', freq: 'BID', startH: 1.0, cls: 'Anticoagulant (prophylaxis)', by: 'hospitalist', highAlert: true,
    hold: 'Hold and notify the provider for active bleeding or platelets below 100 or a falling platelet count.', indication: why,
    info: 'HIGH-ALERT. Check the concentration on the vial or syringe (5,000 units per mL) with a second nurse per policy. Abdomen, 2 inches from the belly button; do not rub. Watch for bleeding and a falling platelet count.' });
  const acetaminophen = (why) => ({ key: 'acetaminophen_sched', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Non-opioid analgesic / antipyretic', by: 'hospitalist', indication: why,
    info: 'Maximum 3 g per 24 hours from all sources. Check the temperature and pain score before giving. Space doses evenly.', monitor: ['Temp'] });

  // ---------------------------------------------------------------- 1. HYPERTENSION FOLLOW-UP (PO lisinopril + SubQ enoxaparin + IM flu vaccine)
  prof('lpn_htn', 'Hypertension follow-up (PO + SubQ + IM)',
    'Observation admission for elevated blood pressure. Three medications: lisinopril 10 mg PO (hold if SBP below 100), enoxaparin 40 mg SubQ, influenza vaccine 0.5 mL IM. All due at 0900.',
    ctx => ({
      problem: 'Hypertension, follow-up for elevated blood pressure', details: 'Blood pressure 168/98 at a clinic visit with a mild headache; sent in for observation and medication adjustment. No chest pain or neurologic symptoms.',
      chief: 'Elevated blood pressure and mild headache',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with known hypertension who missed several doses of the home antihypertensive over the past week. Blood pressure was 168/98 at a clinic visit with a mild headache, now resolved. Denies chest pain, vision changes, weakness, shortness of breath or confusion. Admitted for observation, restarting medication, blood clot prevention while in the hospital, and the seasonal influenza vaccine.`,
      ros: 'Positive for a mild headache (resolved). Negative for chest pain, shortness of breath, vision change, numbness, weakness, nausea or palpitations.',
      vitals: [norm({ h: 0, sbp: 168, dbp: 98, hr: 82 }), norm({ h: 4, sbp: 158, dbp: 94, hr: 80 }), norm({ h: 8, sbp: 148, dbp: 88, hr: 78 }), norm({ h: 24, sbp: 138, dbp: 84 }), norm({ h: 48, sbp: 132, dbp: 80 })],
      diet: '2 g sodium diet', dietNote: 'Low-sodium diet teaching with meals.', activity: 'Up ad lib', activityNote: 'Ambulate in the hall; rise slowly from lying or sitting.',
      meds: [
        { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'ACE inhibitor', monitor: ['BP', 'HR'], by: 'hospitalist',
          hold: 'Hold and notify the provider if SBP is below 100 or the patient is dizzy.', indication: 'Hypertension',
          info: 'Check blood pressure and heart rate BEFORE giving. Hold and notify the provider for SBP below 100. Watch for dizziness, dry cough, and swelling of the lips or face (angioedema: call for help). Teach to rise slowly.' },
        enox('Blood clot prevention while in the hospital'),
        { key: 'influenza_vaccine', name: 'influenza vaccine (FLUZONE) injection', dose: '0.5 mL', route: 'Intramuscular', freq: 'daily', startH: 1.0, stopH: 20, cls: 'Vaccine', by: 'hospitalist', indication: 'Seasonal influenza vaccination',
          hold: 'Hold and notify the provider for a fever or moderate to severe acute illness, or a prior severe reaction to a flu vaccine.',
          info: 'Give into the deltoid (1 inch needle, 22-25 gauge). Check the allergy list and give the Vaccine Information Statement first. Document the lot number and expiration date. Observe for 15 minutes for a reaction. One dose only.' }
      ],
      orders: [{ name: 'Blood pressure before the morning medication', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Check BP and HR before giving the antihypertensive. Hold and notify the provider for SBP below 100 or symptoms of low blood pressure.' },
        { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' }],
      assessments: [{ fromH: 0, items: [['Cardiac', 'Edema', 'None'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Pain', 'Pain Location', 'No pain now; mild headache earlier, resolved'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: ['Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Check blood pressure and heart rate before giving an antihypertensive and apply the hold parameter.', 'Select the correct site and technique for a SubQ and an IM injection and document each administration.']
    }));

  // ---------------------------------------------------------------- 2. CELLULITIS (IM ceftriaxone + PO acetaminophen + SubQ enoxaparin)
  prof('lpn_cellulitis', 'Cellulitis, antibiotic (PO + SubQ + IM)',
    'Mild leg cellulitis. Three medications: ceftriaxone 1 g IM (the antibiotic; clindamycin IM if penicillin-allergic), acetaminophen 650 mg PO three times a day, enoxaparin 40 mg SubQ. Practice: allergy check before an antibiotic, three routes.',
    ctx => {
      const alt = { key: 'clindamycin_im', name: 'clindamycin injection', dose: '600 mg', route: 'Intramuscular', freq: 'q8h', cls: 'Lincosamide antibiotic', info: 'Used because of the penicillin/cephalosporin allergy. Deep IM, no more than 600 mg in one site. Watch for diarrhea (C. difficile).', monitor: ['Temp'] };
      return {
        problem: 'Cellulitis of the right lower leg', details: 'Warm, red, tender area on the right lower leg without an abscess; low-grade fever; intramuscular antibiotic once a day.',
        chief: 'Red, warm, painful right lower leg',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 2 days of a red, warm, tender area on the right lower leg after a scratch. Low-grade fever at home. No pus, no spreading streaks; walks only short distances because of the pain. Admitted for an intramuscular antibiotic, pain and fever control, and clot prevention while less mobile.`,
        ros: 'Positive for leg pain, redness and warmth and a low-grade fever. Negative for chest pain, shortness of breath, vomiting, diarrhea and numbness.',
        vitals: [norm({ h: 0, temp: 100.4, hr: 94, pain: 5 }), norm({ h: 8, temp: 99.6, hr: 86, pain: 4 }), norm({ h: 24, temp: 98.8, hr: 80, pain: 3 }), norm({ h: 48, temp: 98.5, hr: 76, pain: 2 })], fall: 1,
        activity: 'Up with assistance; right leg elevated when sitting', activityNote: 'Elevate the right leg on pillows when resting.',
        meds: [
          acetaminophen('Pain and fever from cellulitis'),
          enox('Blood clot prevention while mobility is limited'),
          { key: 'ceftriaxone_im', name: 'ceftriaxone (ROCEPHIN) injection', dose: '1 g', route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Cephalosporin antibiotic', monitor: ['Temp'], by: 'hospitalist', indication: 'Cellulitis',
            info: 'Mixed with 1% lidocaine to reduce pain: ask about lidocaine allergy. Deep IM in the ventrogluteal site; rotate sites. Verify the allergy list before every dose. Watch for rash and diarrhea.', avoid: ['cephalosporin', 'ceftriaxone', 'penicillin'], alt }
        ],
        orders: [
          { name: 'Mark the edge of the redness with a skin marker', category: 'Nursing', frequency: 'On arrival and every shift', startH: 3, instructions: 'Outline the red area, date and time it. Report redness spreading past the line, fever above 101, or increasing pain.' },
          { name: 'Elevate right leg when in bed or chair', category: 'Nursing', frequency: 'Continuous', startH: 3, instructions: 'Pillows under the calf and foot to reduce swelling.' },
          { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' }
        ],
        assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lower leg: red, warm, mildly swollen, tender area about 8 x 6 cm, border outlined with marker; no drainage or fluctuance'], ['Pain', 'Pain Location', 'Right lower leg, aching, 5/10'], ['Cardiac', 'Edema', 'Trace right ankle edema'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks with a limp and assistance of one']] }, { fromH: 30, items: [['Skin', 'Skin', 'Redness smaller than marked border, less warm; no drainage'], ['Pain', 'Pain Location', 'Right lower leg, mild 2/10']] }],
        objectives: ['Verify allergies before giving an antibiotic and identify when a drug must be questioned.', 'Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Observe the skin and report signs that cellulitis is spreading.']
      };
    });

  // ---------------------------------------------------------------- 3. FALL WITH LIMITED MOBILITY (PO acetaminophen + SubQ enoxaparin + IM Tdap)
  prof('lpn_fall', 'Fall with limited mobility (PO + SubQ + IM)',
    'Observation after a fall with a hip contusion and an elbow abrasion. Three medications: acetaminophen 650 mg PO three times a day, enoxaparin 40 mg SubQ, tetanus-diphtheria-pertussis (Tdap) vaccine 0.5 mL IM.',
    ctx => ({
      problem: 'Fall with right hip contusion and limited mobility', details: 'Fall at home with a bruised right hip and a scraped left elbow; hip x-rays show no fracture; admitted for pain control, therapy evaluation, tetanus update and clot prevention while mobility is limited.',
      chief: 'Fall at home with right hip pain',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who slipped on a wet garage floor and landed on the right hip, scraping the left elbow. X-ray of the hip and pelvis shows no fracture. Bruising and tenderness over the right hip; walks only a few steps with a walker. Last tetanus shot more than 10 years ago. Admitted for observation, pain control, a tetanus booster, therapy and prevention of blood clots while mobility is limited.`,
      ros: 'Positive for right hip pain, bruising and an elbow abrasion. Negative for head strike, loss of consciousness, chest pain, shortness of breath, bleeding or numbness.',
      vitals: [norm({ h: 0, pain: 5, hr: 84 }), norm({ h: 12, pain: 4 }), norm({ h: 36, pain: 3 }), norm({ h: 60, pain: 2 })], fall: 2,
      activity: 'Up with walker and assistance of one', activityNote: 'Gait belt and non-skid socks. Call, do not fall.',
      meds: [
        acetaminophen('Pain from hip contusion'),
        enox('Blood clot prevention while mobility is limited'),
        { key: 'tdap_vaccine', name: 'tetanus, diphtheria, pertussis vaccine (BOOSTRIX Tdap) injection', dose: '0.5 mL', route: 'Intramuscular', freq: 'daily', startH: 1.0, stopH: 20, cls: 'Vaccine', by: 'hospitalist', indication: 'Tetanus booster after a wound (last dose more than 10 years ago)',
          hold: 'Hold and notify the provider for a prior severe reaction to a tetanus-containing vaccine or moderate to severe acute illness.',
          info: 'Give into the deltoid (1 inch needle, 22-25 gauge); alternate arms from any recent injection. Check allergies and give the Vaccine Information Statement. Document the lot number. Observe for 15 minutes. One dose only.' }
      ],
      orders: [{ name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Soft toothbrush, electric razor, report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' },
        { name: 'Elbow abrasion care', category: 'Nursing', frequency: 'Daily', startH: 3, instructions: 'Clean with saline, cover with a non-stick dressing; watch for redness, drainage or warmth.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lateral hip: 10 x 8 cm bruise, tender, no open wounds; left elbow: 3 cm superficial abrasion, clean, no drainage'], ['Pain', 'Pain Location', 'Right hip, aching, 5/10 with movement'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks 10 feet with walker and assist of one'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks']] }],
      objectives: ['Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Select and rotate an appropriate abdominal injection site and use correct technique for a prefilled syringe.', 'Check for bleeding before giving an anticoagulant and apply the hold parameter.']
    }));

  // ---------------------------------------------------------------- 4. TYPE 2 DIABETES (PO metformin + SubQ lispro + IM pneumococcal vaccine)
  prof('lpn_diabetes', 'Type 2 diabetes, high blood sugar (PO + SubQ + IM)',
    'Hyperglycemia in type 2 diabetes. Three medications, one dose each: metformin 500 mg PO, insulin lispro 6 units SubQ (check glucose first; hold if below 70 or not eating), pneumococcal vaccine 0.5 mL IM.',
    ctx => ({
      problem: 'Type 2 diabetes mellitus with hyperglycemia', details: 'Blood glucose 312 mg/dL on arrival without ketones; observation, restarting oral medication, mealtime insulin, vaccines and diabetes teaching.',
      chief: 'High blood sugar, thirst and frequent urination',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes who ran out of medication 4 days ago. Increased thirst and urination, blood glucose 312 mg/dL on arrival. No vomiting, abdominal pain or confusion. Ketones negative. Admitted for glucose control, restarting metformin, mealtime insulin, a pneumococcal vaccine and teaching.`,
      ros: 'Positive for thirst, frequent urination and fatigue. Negative for nausea, vomiting, abdominal pain, chest pain, fever and confusion.',
      keyLabs: ['Glucose'], labs: { Glucose: { abs: [[0, 312], [10, 248], [24, 196], [48, 168]] } }, labSchedule: [{ h: 0.5, codes: ['Glucose'] }],
      vitals: [norm({ h: 0, hr: 92, sbp: 132, dbp: 80 }), norm({ h: 24, hr: 82 }), norm({ h: 48, hr: 78 })],
      diet: 'Consistent carbohydrate diet', dietNote: 'Three meals with a bedtime snack; carbohydrate counting teaching.',
      meds: [
        { key: 'metformin', name: 'metformin (GLUCOPHAGE) tablet', dose: '500 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Biguanide antidiabetic', monitor: ['Glucose'], by: 'hospitalist',
          hold: 'Hold and notify the provider if the patient is NPO, vomiting, or before contrast dye, or if creatinine is high.', indication: 'Type 2 diabetes',
          info: 'Give with a meal to reduce stomach upset. Do not crush extended-release tablets. Hold if NPO or before contrast dye; report vomiting or diarrhea.' },
        { key: 'insulin_lispro_fixed', name: 'insulin lispro (HUMALOG) injection', dose: '6 units', route: 'Subcutaneous', freq: 'daily', startH: 1.0, cls: 'Rapid-acting insulin', monitor: ['Glucose'], by: 'hospitalist', highAlert: true,
          hold: 'Hold and notify the provider if glucose is below 70 mg/dL or the patient is not eating.', indication: 'Mealtime insulin for type 2 diabetes',
          info: 'HIGH-ALERT. Check the blood glucose BEFORE giving, and give within 15 minutes of the meal. Confirm the patient will eat. Rotate sites (abdomen, thigh, upper arm). Watch for hypoglycemia: sweating, shakiness, confusion.' },
        { key: 'pneumococcal_vaccine', name: 'pneumococcal 20-valent conjugate vaccine (PREVNAR 20) injection', dose: '0.5 mL', route: 'Intramuscular', freq: 'daily', startH: 1.0, stopH: 20, cls: 'Vaccine', by: 'hospitalist', indication: 'Pneumonia prevention in diabetes',
          hold: 'Hold and notify the provider for a prior severe reaction to a pneumococcal vaccine or moderate to severe acute illness.',
          info: 'Give into the deltoid (1 inch needle, 22-25 gauge). Check allergies and give the Vaccine Information Statement. Document the lot number. Observe for 15 minutes. One dose only.' }
      ],
      orders: [
        { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'Before meals and at bedtime', startH: 3, instructions: 'Check before each meal and at bedtime; document the value before giving insulin.' },
        { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', startH: 3, instructions: 'If awake and able to swallow: 15 g fast carbohydrate (4 oz juice), recheck in 15 minutes, repeat if still below 70, then notify the provider.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Warm, dry, intact; dry mucous membranes'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: ['Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Check a blood glucose before giving insulin and apply the hold parameter.', 'Recognize signs of hypoglycemia and respond with the protocol.']
    }));

  // ---------------------------------------------------------------- 5. VITAMIN B12 DEFICIENCY (PO folic acid + SubQ heparin + IM cyanocobalamin)
  prof('lpn_b12', 'Vitamin B12 deficiency anemia (PO + SubQ + IM)',
    'Anemia and tingling from low vitamin B12. Three medications: folic acid 1 mg PO daily, enoxaparin 40 mg SubQ daily, cyanocobalamin 1,000 mcg IM daily.',
    ctx => ({
      problem: 'Vitamin B12 deficiency anemia', details: 'Fatigue, tingling in the hands and feet and a low vitamin B12 level; daily intramuscular B12 for one week, then monthly; folic acid by mouth; clot prevention while less mobile.',
      chief: 'Fatigue and tingling in the hands and feet',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 3 months of worsening tiredness, a sore smooth tongue and tingling in the fingers and toes, now dizzy and unsteady when walking. Hemoglobin low with large red cells, vitamin B12 level 148 pg/mL (low). Admitted for intramuscular B12 replacement, folic acid and prevention of blood clots while less mobile.`,
      ros: 'Positive for fatigue, tingling in the hands and feet, pale skin, unsteady walking and a sore tongue. Negative for chest pain, shortness of breath at rest, bleeding, black stools and weight loss.',
      keyLabs: ['Hemoglobin'], labs: { Hemoglobin: { abs: [[0, 9.4], [48, 9.6]] } }, labSchedule: [{ h: 0.5, codes: ['Hemoglobin'] }],
      quals: [{ h: 1.0, category: 'Other', code: 'Vitamin B12 level', value: '148 pg/mL (low)', reference: '200-900 pg/mL', flag: 'Abnormal', specimen: 'Blood' }, { h: 1.0, category: 'Other', code: 'MCV', value: '109 fL (high)', reference: '80-100 fL', flag: 'Abnormal', specimen: 'Blood' }],
      vitals: [norm({ h: 0, hr: 94 }), norm({ h: 24, hr: 86 }), norm({ h: 48, hr: 82 })], fall: 1,
      meds: [
        { key: 'folic_acid', name: 'folic acid tablet', dose: '1 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Vitamin B9', by: 'hospitalist', indication: 'Anemia with large red blood cells',
          info: 'Give with or without food. Teach that it works together with B12: folic acid alone can hide B12 deficiency, so the B12 shots must continue.' },
        enox('Blood clot prevention while less mobile'),
        { key: 'cyanocobalamin', name: 'cyanocobalamin (VITAMIN B12) injection', dose: '1,000 mcg', route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Vitamin B12', monitor: ['Hgb'], by: 'hospitalist',
          indication: 'Vitamin B12 deficiency', info: 'Give deep IM in the ventrogluteal or deltoid site; use a 1-1.5 inch needle (22-25 gauge), rotate sites and aspirate per policy. Check for allergy to cobalt/B12. Dizziness and tingling improve over weeks. Teach about monthly injections after the first week.' }
      ],
      orders: [{ name: 'Neurovascular and sensation check, hands and feet', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Document tingling or numbness; fall precautions for unsteady walking.' },
        { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Pale, warm and dry; mildly jaundiced sclera'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Neurologic', 'Sensation', 'Decreased light touch in both fingertips and toes'], ['Musculoskeletal / Mobility', 'Mobility', 'Steady but slow gait']] }],
      objectives: ['Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Select an appropriate IM site, needle size and technique, and rotate sites between doses.', 'Check for bleeding before giving an anticoagulant and apply the hold parameter.']
    }));
})();

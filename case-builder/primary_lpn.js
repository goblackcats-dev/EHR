/* LPN Med Pass cases (category "LPN Med Pass", every key starts with lpn_ and every label starts with "LPN Med Pass:").
   Very simple acute-admission problems for first-semester LPN medication-pass practice with patient and medication scanning.
   Each chart has ONE ordered medication (the capstone has three: one by mouth, one SubQ, one IM). Nothing else is ordered:
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

  // ---------------------------------------------------------------- 1. HYPERTENSION (PO)
  prof('lpn_htn', 'Hypertension follow-up (1 PO medication)',
    'Observation admission for elevated blood pressure at a clinic visit. One scheduled oral medication (lisinopril 10 mg daily, hold if SBP below 100). Practice: scan patient and medication, check BP first.',
    ctx => ({
      problem: 'Hypertension, follow-up for elevated blood pressure', details: 'Blood pressure 168/98 at a clinic visit with a mild headache; sent in for observation and medication adjustment. No chest pain or neurologic symptoms.',
      chief: 'Elevated blood pressure and mild headache',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with known hypertension who missed several doses of the home antihypertensive over the past week. Blood pressure was 168/98 at a clinic visit with a mild headache, now resolved. Denies chest pain, vision changes, weakness, shortness of breath or confusion. Admitted for observation and restarting medication.`,
      ros: 'Positive for a mild headache (resolved). Negative for chest pain, shortness of breath, vision change, numbness, weakness, nausea or palpitations.',
      vitals: [norm({ h: 0, sbp: 168, dbp: 98, hr: 82 }), norm({ h: 4, sbp: 158, dbp: 94, hr: 80 }), norm({ h: 8, sbp: 148, dbp: 88, hr: 78 }), norm({ h: 24, sbp: 138, dbp: 84 }), norm({ h: 48, sbp: 132, dbp: 80 })],
      diet: '2 g sodium diet', dietNote: 'Low-sodium diet teaching with meals.', activity: 'Up ad lib', activityNote: 'Ambulate in the hall; rise slowly from lying or sitting.',
      meds: [{ key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'ACE inhibitor', monitor: ['BP', 'HR'], by: 'hospitalist',
        hold: 'Hold and notify the provider if SBP is below 100 or the patient is dizzy.', indication: 'Hypertension',
        info: 'Check blood pressure and heart rate BEFORE giving. Hold and notify the provider for SBP below 100. Watch for dizziness, dry cough, and swelling of the lips or face (angioedema: call for help). Teach to rise slowly.' }],
      orders: [{ name: 'Blood pressure before the morning medication', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Check BP and HR before giving the antihypertensive. Hold and notify the provider for SBP below 100 or symptoms of low blood pressure.' }],
      assessments: [{ fromH: 0, items: [['Cardiac', 'Edema', 'None'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Pain', 'Pain Location', 'No pain now; mild headache earlier, resolved'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: ['Scan the patient wristband and the medication before giving an oral medication.', 'Check blood pressure and heart rate before giving an antihypertensive and apply the hold parameter.', 'Identify the five rights for an oral medication and document the administration.']
    }));

  // ---------------------------------------------------------------- 2. CELLULITIS (PO antibiotic only)
  prof('lpn_cellulitis', 'Cellulitis, antibiotic only (1 PO medication)',
    'Mild leg cellulitis receiving one oral antibiotic (cephalexin 500 mg four times daily; doxycycline instead if penicillin-allergic). Practice: antibiotic timing, allergy check, scanning.',
    ctx => {
      const alt = { key: 'doxycycline', name: 'doxycycline (VIBRA-TABS) tablet', dose: '100 mg', route: 'Oral', freq: 'BID', cls: 'Tetracycline antibiotic', info: 'Used because of the penicillin allergy. Give with a full glass of water and stay upright for 30 minutes. Avoid taking with dairy or antacids. Sun sensitivity.', monitor: ['Temp'] };
      return {
        problem: 'Cellulitis of the right lower leg', details: 'Warm, red, tender area on the right lower leg without an abscess; no fever above 100.4 F; oral antibiotic only.',
        chief: 'Red, warm, painful right lower leg',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 2 days of a red, warm, tender area on the right lower leg after a scratch. Low-grade fever at home. No pus, no spreading streaks, able to bear weight. Admitted for observation and oral antibiotic.`,
        ros: 'Positive for leg pain, redness and warmth and a low-grade fever. Negative for chest pain, shortness of breath, vomiting, diarrhea and numbness.',
        vitals: [norm({ h: 0, temp: 100.2, hr: 92, pain: 4 }), norm({ h: 8, temp: 99.6, hr: 86, pain: 3 }), norm({ h: 24, temp: 98.8, hr: 80, pain: 2 }), norm({ h: 48, temp: 98.5, hr: 76, pain: 1 })],
        activity: 'Up as tolerated with the right leg elevated when sitting', activityNote: 'Elevate the right leg on pillows when resting.',
        meds: [{ key: 'cephalexin', name: 'cephalexin (KEFLEX) capsule', dose: '500 mg', route: 'Oral', freq: 'QID', startH: 1.0, cls: 'Cephalosporin antibiotic', monitor: ['Temp'], by: 'hospitalist',
          indication: 'Cellulitis', info: 'Give at evenly spaced times; do not skip doses. Verify the allergy list before every dose. Watch for rash, hives, diarrhea. Teach the patient to finish the course.',
          avoid: ['cephalosporin', 'cephalexin', 'penicillin'], alt }],
        orders: [
          { name: 'Mark the edge of the redness with a skin marker', category: 'Nursing', frequency: 'On arrival and every shift', startH: 3, instructions: 'Outline the red area, date and time it. Report redness spreading past the line, fever above 101, or increasing pain.' },
          { name: 'Elevate right leg when in bed or chair', category: 'Nursing', frequency: 'Continuous', startH: 3, instructions: 'Pillows under the calf and foot to reduce swelling.' }
        ],
        assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lower leg: red, warm, mildly swollen, tender area about 8 x 6 cm, border outlined with marker; no drainage or fluctuance'], ['Pain', 'Pain Location', 'Right lower leg, aching, 4/10'], ['Cardiac', 'Edema', 'Trace right ankle edema'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks with a mild limp']] }, { fromH: 30, items: [['Skin', 'Skin', 'Redness smaller than marked border, less warm; no drainage'], ['Pain', 'Pain Location', 'Right lower leg, mild 2/10']] }],
        objectives: ['Verify allergies before giving an antibiotic and identify when a drug must be questioned.', 'Scan the patient wristband and the medication and give an oral antibiotic at the ordered time.', 'Observe the skin and report signs that cellulitis is spreading.']
      };
    });

  // ---------------------------------------------------------------- 3. DVT PROPHYLAXIS (SubQ)
  prof('lpn_subq_enoxaparin', 'Fall with limited mobility, DVT prevention (1 SubQ medication)',
    'Observation after a fall with a hip contusion and limited mobility. One SubQ injection: enoxaparin 40 mg daily. Practice: abdominal SubQ injection technique, site rotation, bleeding checks.',
    ctx => ({
      problem: 'Fall with right hip contusion and limited mobility', details: 'Fall at home with a bruised right hip; x-rays show no fracture; admitted for pain control, therapy evaluation and clot prevention while mobility is limited.',
      chief: 'Fall at home with right hip pain',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} who slipped on a wet floor at home and landed on the right hip. X-ray of the hip and pelvis shows no fracture. Bruising and tenderness over the right hip; walks only a few steps with a walker. Admitted for observation, therapy and prevention of blood clots while mobility is limited.`,
      ros: 'Positive for right hip pain and bruising. Negative for head strike, loss of consciousness, chest pain, shortness of breath, bleeding or numbness.',
      vitals: [norm({ h: 0, pain: 5, hr: 84 }), norm({ h: 12, pain: 4 }), norm({ h: 36, pain: 3 }), norm({ h: 60, pain: 2 })], fall: 2,
      activity: 'Up with walker and assistance of one', activityNote: 'Gait belt and non-skid socks. Call, do not fall.',
      meds: [{ key: 'enoxaparin', name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: 'daily', startH: 1.0, cls: 'Anticoagulant (prophylaxis)', by: 'hospitalist', highAlert: true,
        hold: 'Hold and notify the provider for active bleeding or platelets below 50.', indication: 'DVT prevention while mobility is limited',
        info: 'Give in the abdomen at least 2 inches from the belly button; rotate sides each day. Do not expel the air bubble from the prefilled syringe. Do not rub the site. Check for bleeding, bruising and black stools before giving.' }],
      orders: [{ name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Soft toothbrush, electric razor, report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lateral hip: 10 x 8 cm bruise, tender, no open wounds'], ['Pain', 'Pain Location', 'Right hip, aching, 5/10 with movement'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks 10 feet with walker and assist of one'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks']] }],
      objectives: ['Scan the patient wristband and the medication before giving a subcutaneous injection.', 'Select and rotate an appropriate abdominal injection site and use correct technique for a prefilled syringe.', 'Check for bleeding before giving an anticoagulant and apply the hold parameter.']
    }));

  // ---------------------------------------------------------------- 4. INSULIN (SubQ)
  prof('lpn_subq_insulin', 'Type 2 diabetes, high blood sugar (1 SubQ medication)',
    'Hyperglycemia in a patient with type 2 diabetes. One SubQ medication: insulin lispro 6 units before meals (hold if glucose below 70 or not eating). Practice: glucose check, scan, SubQ site.',
    ctx => ({
      problem: 'Type 2 diabetes mellitus with hyperglycemia', details: 'Blood glucose 312 mg/dL on arrival without ketones; observation, mealtime insulin and diabetes teaching.',
      chief: 'High blood sugar, thirst and frequent urination',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes who ran out of medication 4 days ago. Increased thirst and urination, blood glucose 312 mg/dL on arrival. No vomiting, abdominal pain or confusion. Ketones negative. Admitted for glucose control and teaching.`,
      ros: 'Positive for thirst, frequent urination and fatigue. Negative for nausea, vomiting, abdominal pain, chest pain, fever and confusion.',
      keyLabs: ['Glucose'], labs: { Glucose: { abs: [[0, 312], [10, 248], [24, 196], [48, 168]] } }, labSchedule: [{ h: 0.5, codes: ['Glucose'] }],
      vitals: [norm({ h: 0, hr: 92, sbp: 132, dbp: 80 }), norm({ h: 24, hr: 82 }), norm({ h: 48, hr: 78 })],
      diet: 'Consistent carbohydrate diet', dietNote: 'Three meals with a bedtime snack; carbohydrate counting teaching.',
      meds: [{ key: 'insulin_lispro_fixed', name: 'insulin lispro (HUMALOG) injection', dose: '6 units', route: 'Subcutaneous', freq: 'AC', startH: 1.0, cls: 'Rapid-acting insulin', monitor: ['Glucose'], by: 'hospitalist', highAlert: true,
        hold: 'Hold and notify the provider if glucose is below 70 mg/dL or the patient is not eating.', indication: 'Mealtime insulin for type 2 diabetes',
        info: 'HIGH-ALERT. Check the blood glucose BEFORE giving, and give within 15 minutes of the meal. Confirm the patient will eat. Rotate sites (abdomen, thigh, upper arm). Watch for hypoglycemia: sweating, shakiness, confusion.' }],
      orders: [
        { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'Before meals and at bedtime', startH: 3, instructions: 'Check before each meal and at bedtime; document the value before giving insulin.' },
        { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', startH: 3, instructions: 'If awake and able to swallow: 15 g fast carbohydrate (4 oz juice), recheck in 15 minutes, repeat if still below 70, then notify the provider.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Warm, dry, intact; dry mucous membranes'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: ['Check a blood glucose before giving insulin and apply the hold parameter.', 'Scan the patient wristband and the insulin, and verify the dose and timing with the meal.', 'Recognize signs of hypoglycemia and respond with the protocol.']
    }));

  // ---------------------------------------------------------------- 5. VITAMIN B12 (IM)
  prof('lpn_im_b12', 'Vitamin B12 deficiency (1 IM injection)',
    'Anemia and tingling from low vitamin B12. One intramuscular injection: cyanocobalamin 1,000 mcg daily. Practice: IM site selection (ventrogluteal or deltoid), technique, scanning.',
    ctx => ({
      problem: 'Vitamin B12 deficiency anemia', details: 'Fatigue, tingling in the hands and feet and a low vitamin B12 level; daily intramuscular B12 for one week, then monthly.',
      chief: 'Fatigue and tingling in the hands and feet',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with 3 months of worsening tiredness, a sore smooth tongue and tingling in the fingers and toes. Hemoglobin low with large red cells, vitamin B12 level 148 pg/mL (low). Admitted for the start of intramuscular B12 replacement and evaluation.`,
      ros: 'Positive for fatigue, tingling in the hands and feet, pale skin and a sore tongue. Negative for chest pain, shortness of breath at rest, bleeding, black stools and weight loss.',
      keyLabs: ['Hemoglobin'], labs: { Hemoglobin: { abs: [[0, 9.4], [48, 9.6]] } }, labSchedule: [{ h: 0.5, codes: ['Hemoglobin'] }],
      quals: [{ h: 1.0, category: 'Other', code: 'Vitamin B12 level', value: '148 pg/mL (low)', reference: '200-900 pg/mL', flag: 'Abnormal', specimen: 'Blood' }, { h: 1.0, category: 'Other', code: 'MCV', value: '109 fL (high)', reference: '80-100 fL', flag: 'Abnormal', specimen: 'Blood' }],
      vitals: [norm({ h: 0, hr: 94 }), norm({ h: 24, hr: 86 }), norm({ h: 48, hr: 82 })], fall: 1,
      meds: [{ key: 'cyanocobalamin', name: 'cyanocobalamin (VITAMIN B12) injection', dose: '1,000 mcg', route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Vitamin B12', monitor: ['Hgb'], by: 'hospitalist',
        indication: 'Vitamin B12 deficiency', info: 'Give deep IM in the ventrogluteal or deltoid site; use a 1-1.5 inch needle (22-25 gauge), rotate sites and aspirate per policy. Check for allergy to cobalt/B12. Dizziness and tingling should improve over weeks. Teach about lifelong or monthly injections.' }],
      orders: [{ name: 'Neurovascular and sensation check, hands and feet', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Document tingling or numbness; fall precautions for unsteady walking.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Pale, warm and dry; mildly jaundiced sclera'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Neurologic', 'Sensation', 'Decreased light touch in both fingertips and toes'], ['Musculoskeletal / Mobility', 'Mobility', 'Steady but slow gait']] }],
      objectives: ['Scan the patient wristband and the medication before giving an intramuscular injection.', 'Select an appropriate IM site, needle size and technique, and rotate sites between doses.', 'Document the administration and the patient response.']
    }));

  // ---------------------------------------------------------------- 6. CAPSTONE: PO + SubQ + IM
  prof('lpn_three_routes', 'Leg cellulitis, three routes (1 PO + 1 SubQ + 1 IM)',
    'Capstone med pass: lisinopril 10 mg PO, enoxaparin 40 mg SubQ and ceftriaxone 1 g IM (with lidocaine), all due at 0900. Practice: three routes, three scans, three sets of hold checks in one pass.',
    ctx => {
      const alt = { key: 'clindamycin_im', name: 'clindamycin injection', dose: '600 mg', route: 'Intramuscular', freq: 'q8h', cls: 'Lincosamide antibiotic', info: 'Used because of the cephalosporin/penicillin allergy. Deep IM, no more than 600 mg in one site. Watch for diarrhea (C. difficile).', monitor: ['Temp'] };
      return {
        problem: 'Cellulitis of the left lower leg in a patient with hypertension and reduced mobility', details: 'Spreading redness of the left lower leg without an abscess; treated with a once-daily intramuscular antibiotic; home blood pressure medicine continued; clot prevention while less mobile.',
        chief: 'Red, painful, swollen left lower leg',
        hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with hypertension and 3 days of spreading redness, warmth and pain of the left lower leg, now walking only a short distance because of the pain. Low-grade fever. Admitted for an intramuscular antibiotic, continued blood pressure medicine and prevention of blood clots.`,
        ros: 'Positive for leg pain, redness, swelling, low-grade fever. Negative for chest pain, shortness of breath, vomiting, diarrhea and numbness.',
        vitals: [norm({ h: 0, temp: 100.4, hr: 94, sbp: 146, dbp: 88, pain: 5 }), norm({ h: 8, temp: 99.6, hr: 86, sbp: 142, dbp: 86, pain: 4 }), norm({ h: 24, temp: 98.8, hr: 80, sbp: 136, dbp: 82, pain: 3 }), norm({ h: 48, temp: 98.5, hr: 76, sbp: 132, dbp: 80, pain: 2 })], fall: 1,
        diet: '2 g sodium diet', activity: 'Up with assistance; elevate the left leg when resting', activityNote: 'Elevate on pillows when in bed or chair.',
        meds: [
          { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'ACE inhibitor', monitor: ['BP', 'HR'], by: 'hospitalist', hold: 'Hold and notify the provider if SBP is below 100 or the patient is dizzy.', indication: 'Hypertension (home medication)', info: 'Check BP and HR before giving. Hold for SBP below 100. Watch for dizziness, dry cough and facial swelling.' },
          { key: 'enoxaparin', name: 'enoxaparin (LOVENOX) injection', dose: '40 mg', route: 'Subcutaneous', freq: 'daily', startH: 1.0, cls: 'Anticoagulant (prophylaxis)', by: 'hospitalist', highAlert: true, hold: 'Hold and notify the provider for active bleeding or platelets below 50.', indication: 'DVT prevention while mobility is limited', info: 'Abdomen, at least 2 inches from the belly button; rotate sides; do not expel the air bubble; do not rub.' },
          { key: 'ceftriaxone_im', name: 'ceftriaxone (ROCEPHIN) injection', dose: '1 g', route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Cephalosporin antibiotic', monitor: ['Temp'], by: 'hospitalist', indication: 'Cellulitis', info: 'Reconstituted with 1% lidocaine to reduce pain: ask about lidocaine allergy. Deep IM in the ventrogluteal site; rotate sites. Verify the allergy list first. Watch for rash and diarrhea.', avoid: ['cephalosporin', 'ceftriaxone', 'penicillin'], alt }
        ],
        orders: [
          { name: 'Mark the edge of the redness with a skin marker', category: 'Nursing', frequency: 'On arrival and every shift', startH: 3, instructions: 'Outline, date and time the red area; report spreading past the line.' },
          { name: 'Blood pressure before the morning medication', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Check BP and HR before giving lisinopril; hold and notify for SBP below 100.' },
          { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' }
        ],
        assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Left lower leg: red, warm, swollen area about 10 x 7 cm, border outlined with marker; no drainage'], ['Pain', 'Pain Location', 'Left lower leg, throbbing, 5/10'], ['Cardiac', 'Edema', '1+ left ankle edema'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks with a limp and assistance of one']] }],
        objectives: ['Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.', 'Check and document the hold parameters for each drug before giving it.', 'Choose the correct injection site and technique for each route.']
      };
    });
})();

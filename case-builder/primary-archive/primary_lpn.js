/* LPN Med Pass cases (category "LPN Med Pass", every key starts with lpn_ and every label starts with "LPN Med Pass:").
   Very simple acute-admission problems for first-semester LPN medication-pass practice with patient and medication scanning.
   Each chart has exactly THREE ordered medications: one by mouth (PO: lisinopril or acetaminophen), one subcutaneous (SubQ: insulin lispro on a sliding scale) and one intramuscular (IM: ceftriaxone or vitamin B12; 3 mL or less). Nothing else is ordered:
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

  // ---------------------------------------------------------------- shared medication definitions (all due once, at 0900)
  // Only these medications are used by the LPN Med Pass patients, so a lab only has to stock: lisinopril, acetaminophen, insulin lispro, ceftriaxone, vitamin B12.
  const LISINOPRIL = { key: 'lisinopril', name: 'lisinopril (PRINIVIL,ZESTRIL) tablet', dose: '10 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'ACE inhibitor', monitor: ['BP', 'HR'], by: 'hospitalist',
    hold: 'Hold and notify the provider if SBP is below 100 or the patient is dizzy.', indication: 'Hypertension',
    info: 'Check blood pressure and heart rate BEFORE giving. Hold and notify the provider for SBP below 100. Watch for dizziness, dry cough, and swelling of the lips or face (angioedema: call for help). Teach to rise slowly.' };
  const ACETAMINOPHEN = why => ({ key: 'acetaminophen_sched', name: 'acetaminophen (TYLENOL) tablet', dose: '650 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Non-opioid analgesic / antipyretic', by: 'hospitalist', indication: why,
    info: 'Maximum 3 g per 24 hours from all sources. Check the temperature and pain score before giving.', monitor: ['Temp'] });
  const SCALES = {
    low: { label: 'low-dose', text: 'LOW-DOSE sliding scale (glucose mg/dL: 150-199 = 2 units; 200-249 = 4 units; 250-299 = 6 units; 300-349 = 8 units; 350 or higher = 10 units and call the provider; below 150 = no insulin).' },
    sens: { label: 'sensitive (very low-dose)', text: 'SENSITIVE sliding scale (glucose mg/dL: 150-199 = 1 unit; 200-249 = 2 units; 250-299 = 3 units; 300-349 = 4 units; 350 or higher = 5 units and call the provider; below 150 = no insulin).' },
    mid: { label: 'moderate-dose', text: 'MODERATE-DOSE sliding scale (glucose mg/dL: 150-199 = 3 units; 200-249 = 6 units; 250-299 = 9 units; 300-349 = 12 units; 350 or higher = 15 units and call the provider; below 150 = no insulin).' },
    high: { label: 'high-dose', text: 'HIGH-DOSE sliding scale (glucose mg/dL: 150-199 = 4 units; 200-249 = 8 units; 250-299 = 12 units; 300-349 = 16 units; 350 or higher = 20 units and call the provider; below 150 = no insulin).' }
  };
  const SSI = scale => ({ key: 'insulin_lispro_ssi', name: 'insulin lispro (HUMALOG) injection', dose: `Per ${SCALES[scale].label} sliding scale`, route: 'Subcutaneous', freq: 'daily', startH: 1.0, cls: 'Rapid-acting insulin', monitor: ['Glucose'], by: 'hospitalist', highAlert: true,
    instructions: `Check the blood glucose, then give insulin lispro SubQ by the ${SCALES[scale].text}`,
    hold: 'Hold and notify the provider if glucose is below 70 mg/dL or the patient is not eating.', indication: 'Hyperglycemia (sliding-scale insulin)',
    info: `HIGH-ALERT. ${SCALES[scale].text} Check the glucose BEFORE giving, find the dose on the scale, and have a second nurse verify the dose per policy. Give within 15 minutes of a meal. Rotate sites (abdomen, thigh, upper arm). Watch for hypoglycemia: sweating, shakiness, confusion.` });
  const CEFTRIAXONE = (dose, alt) => ({ key: 'ceftriaxone_im', name: 'ceftriaxone (ROCEPHIN) injection', dose, route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Cephalosporin antibiotic', monitor: ['Temp'], by: 'hospitalist', indication: 'Bacterial infection',
    info: 'Mixed with 1% lidocaine to reduce pain (500 mg per mL for this exercise): ask about lidocaine allergy. 1.5 g is 3 mL: give it in the VENTROGLUTEAL or the VASTUS LATERALIS (the deltoid holds only 1 mL, so it is not appropriate); rotate sites; never more than 3 mL in one site. Verify the allergy list before every dose. Watch for rash and diarrhea.', avoid: ['cephalosporin', 'ceftriaxone', 'penicillin'], alt });
  const B12 = dose => ({ key: 'cyanocobalamin', name: 'cyanocobalamin (VITAMIN B12) injection', dose, route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Vitamin B12', by: 'hospitalist',
    indication: 'Vitamin B12 deficiency', info: 'Give deep IM in the ventrogluteal or deltoid site (1,000 mcg/mL); use a 1-1.5 inch needle (22-25 gauge), rotate sites and aspirate per policy. Check for allergy to cobalt/B12. Teach about monthly injections after the first week.' });
  const CLINDA = { key: 'clindamycin_im', name: 'clindamycin injection', dose: '600 mg', route: 'Intramuscular', freq: 'q8h', cls: 'Lincosamide antibiotic', info: 'Used because of the penicillin/cephalosporin allergy. Deep IM, no more than 600 mg in one site. Watch for diarrhea (C. difficile).', monitor: ['Temp'] };
  // the glucose the student checks before the insulin: one lab drawn about 20 minutes before the 0900 dose
  const glucoseLab = (ctx, v) => ({ labs: { Glucose: { abs: [[0, v], [30, v]] } }, labSchedule: [{ h: Math.max(0.6, ctx.nowH - 0.35), codes: ['Glucose'] }], keyLabs: ['Glucose'] });
  const GLU_ORDER = { name: 'Point-of-care blood glucose', category: 'Lab / Bedside Testing', frequency: 'Before the 0900 insulin', startH: 3, instructions: 'Check the glucose and document it BEFORE giving insulin; find the dose on the sliding scale.' };
  const BLEED = { name: 'Bleeding precautions', category: 'Precautions', frequency: 'Continuous', startH: 3, instructions: 'Report black or bloody stools, blood in urine, nosebleeds or unusual bruising.' };
  const OBJ = 'Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.';

  // ---------------------------------------------------------------- 1. HYPERTENSION FOLLOW-UP (PO lisinopril + SubQ lispro low scale + IM vitamin B12)
  prof('lpn_htn', 'Hypertension follow-up (PO + SubQ + IM)',
    'Observation for elevated blood pressure in a patient with type 2 diabetes. Lisinopril 10 mg PO (hold if SBP below 100), insulin lispro SubQ on the LOW-dose sliding scale (glucose 177 = 2 units), vitamin B12 1,000 mcg IM (1 mL).',
    ctx => Object.assign({
      problem: 'Hypertension, follow-up for elevated blood pressure', details: 'Blood pressure 168/98 at a clinic visit with a mild headache; sent in for observation. Type 2 diabetes with sliding-scale insulin while in the hospital; low vitamin B12 from long-term metformin.',
      chief: 'Elevated blood pressure and mild headache',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with hypertension and type 2 diabetes who missed several doses of the home blood pressure medicine. Blood pressure was 168/98 at a clinic visit with a mild headache, now resolved. Denies chest pain, vision changes or weakness. Admitted for observation, restarting the medicine, sliding-scale insulin for the glucose, and vitamin B12 for a low level from long-term metformin.`,
      ros: 'Positive for a mild headache (resolved). Negative for chest pain, shortness of breath, vision change, numbness, weakness, nausea or palpitations.',
      vitals: [norm({ h: 0, sbp: 168, dbp: 98, hr: 82 }), norm({ h: 4, sbp: 158, dbp: 94, hr: 80 }), norm({ h: 8, sbp: 148, dbp: 88, hr: 78 }), norm({ h: 24, sbp: 138, dbp: 84 }), norm({ h: 48, sbp: 132, dbp: 80 })],
      diet: 'Consistent carbohydrate, 2 g sodium diet', dietNote: 'Low-sodium diet teaching with meals.', activity: 'Up ad lib', activityNote: 'Rise slowly from lying or sitting.',
      meds: [LISINOPRIL, SSI('low'), B12('1,000 mcg')],
      orders: [{ name: 'Blood pressure before the morning medication', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Check BP and HR before giving the antihypertensive. Hold and notify the provider for SBP below 100 or symptoms of low blood pressure.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Cardiac', 'Edema', 'None'], ['Respiratory', 'Breath Sounds', 'Clear bilaterally'], ['Pain', 'Pain Location', 'No pain now; mild headache earlier, resolved'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: [OBJ, 'Check blood pressure before an antihypertensive and a glucose before insulin, and apply the hold parameters.', 'Read the sliding scale to find the correct insulin dose for the glucose result.']
    }, glucoseLab(ctx, 178)));

  // ---------------------------------------------------------------- 2. CELLULITIS (PO acetaminophen + SubQ lispro high scale + IM ceftriaxone 1 g)
  prof('lpn_cellulitis', 'Cellulitis (PO + SubQ + IM)',
    'Leg cellulitis in a patient with diabetes. Acetaminophen 650 mg PO, insulin lispro SubQ on the HIGH-dose sliding scale (glucose 261 = 12 units), ceftriaxone 1.5 g IM (3 mL; clindamycin IM if penicillin-allergic).',
    ctx => Object.assign({
      problem: 'Cellulitis of the right lower leg', details: 'Warm, red, tender area on the right lower leg without an abscess; low-grade fever; intramuscular antibiotic once a day; type 2 diabetes with high glucose on a high-dose sliding scale.',
      chief: 'Red, warm, painful right lower leg',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and 2 days of a red, warm, tender area on the right lower leg after a scratch. Low-grade fever at home, glucose running high. No pus or spreading streaks. Admitted for an intramuscular antibiotic, pain and fever control, and sliding-scale insulin.`,
      ros: 'Positive for leg pain, redness and warmth and a low-grade fever. Negative for chest pain, shortness of breath, vomiting, diarrhea and numbness.',
      vitals: [norm({ h: 0, temp: 100.4, hr: 94, pain: 5 }), norm({ h: 8, temp: 99.6, hr: 86, pain: 4 }), norm({ h: 24, temp: 98.8, hr: 80, pain: 3 }), norm({ h: 48, temp: 98.5, hr: 76, pain: 2 })], fall: 1,
      diet: 'Consistent carbohydrate diet', activity: 'Up with assistance; right leg elevated when sitting', activityNote: 'Elevate the right leg on pillows when resting.',
      meds: [ACETAMINOPHEN('Pain and fever from cellulitis'), SSI('high'), CEFTRIAXONE('1.5 g', CLINDA)],
      orders: [
        { name: 'Mark the edge of the redness with a skin marker', category: 'Nursing', frequency: 'On arrival and every shift', startH: 3, instructions: 'Outline the red area, date and time it. Report redness spreading past the line, fever above 101, or increasing pain.' },
        { name: 'Elevate right leg when in bed or chair', category: 'Nursing', frequency: 'Continuous', startH: 3, instructions: 'Pillows under the calf and foot to reduce swelling.' }, GLU_ORDER
      ],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lower leg: red, warm, mildly swollen, tender area about 8 x 6 cm, border outlined with marker; no drainage or fluctuance'], ['Pain', 'Pain Location', 'Right lower leg, aching, 5/10'], ['Cardiac', 'Edema', 'Trace right ankle edema'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks with a limp']] }],
      objectives: [OBJ, 'Verify allergies before giving an antibiotic and identify when a drug must be questioned.', 'Read the high-dose sliding scale to find the correct insulin dose for the glucose result.']
    }, glucoseLab(ctx, 262)));

  // ---------------------------------------------------------------- 3. FALL WITH URINARY TRACT INFECTION (PO acetaminophen + SubQ lispro low scale + IM ceftriaxone 500 mg)
  prof('lpn_fall', 'Fall with urinary tract infection (PO + SubQ + IM)',
    'Older adult admitted after a fall with a urinary tract infection. Acetaminophen 650 mg PO, insulin lispro SubQ on the LOW-dose sliding scale (glucose 216 = 4 units), ceftriaxone 1.5 g IM (3 mL; clindamycin IM if penicillin-allergic).',
    ctx => Object.assign({
      problem: 'Fall with urinary tract infection', details: 'Fall at home with a bruised right hip (x-ray without fracture) and a urinary tract infection; intramuscular antibiotic; diabetes on sliding-scale insulin.',
      chief: 'Fall at home and burning with urination',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes who fell at home after 2 days of burning with urination and urgency. X-ray of the hip and pelvis shows no fracture; bruised right hip. Urinalysis positive for infection. Admitted for an intramuscular antibiotic, pain control and sliding-scale insulin.`,
      ros: 'Positive for burning with urination, urgency, right hip pain and bruising. Negative for head strike, loss of consciousness, chest pain, shortness of breath, vomiting and flank pain.',
      vitals: [norm({ h: 0, temp: 99.8, pain: 5, hr: 88 }), norm({ h: 12, pain: 4 }), norm({ h: 36, pain: 3 }), norm({ h: 60, pain: 2 })], fall: 2,
      diet: 'Consistent carbohydrate diet', activity: 'Up with walker and assistance of one', activityNote: 'Gait belt and non-skid socks. Call, do not fall.',
      meds: [ACETAMINOPHEN('Pain from hip contusion'), SSI('low'), CEFTRIAXONE('1.5 g', CLINDA)],
      orders: [{ name: 'Urine output and appearance', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Document color, odor and burning with urination; push oral fluids.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Right lateral hip: 10 x 8 cm bruise, tender, no open wounds'], ['GU', 'Urinary Elimination', 'Voiding small amounts, burning and urgency; urine cloudy'], ['Pain', 'Pain Location', 'Right hip, aching, 5/10 with movement'], ['Musculoskeletal / Mobility', 'Mobility', 'Walks 10 feet with walker and assist of one'], ['Safety', 'Fall Precautions', 'High risk: bed alarm on, call light in reach, non-skid socks']] }],
      objectives: [OBJ, 'Verify allergies before giving an antibiotic and identify when a drug must be questioned.', 'Read the low-dose sliding scale to find the correct insulin dose for the glucose result.']
    }, glucoseLab(ctx, 214)));

  // ---------------------------------------------------------------- 4. TYPE 2 DIABETES (PO lisinopril + SubQ lispro high scale + IM vitamin B12 500 mcg)
  prof('lpn_diabetes', 'Type 2 diabetes, high blood sugar (PO + SubQ + IM)',
    'Hyperglycemia in type 2 diabetes. Lisinopril 10 mg PO (hold if SBP below 100), insulin lispro SubQ on the HIGH-dose sliding scale (glucose 341 = 16 units), vitamin B12 500 mcg IM (0.5 mL).',
    ctx => Object.assign({
      problem: 'Type 2 diabetes mellitus with hyperglycemia', details: 'Blood glucose above 300 mg/dL without ketones; observation, sliding-scale insulin, blood pressure medicine continued and vitamin B12 for a low level from long-term metformin.',
      chief: 'High blood sugar, thirst and frequent urination',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and hypertension who ran out of diabetes medicine 4 days ago. Increased thirst and urination, blood glucose over 300 mg/dL on arrival. No vomiting, abdominal pain or confusion; ketones negative. Admitted for glucose control on a high-dose sliding scale, the home blood pressure medicine and vitamin B12 for a low level.`,
      ros: 'Positive for thirst, frequent urination and fatigue. Negative for nausea, vomiting, abdominal pain, chest pain, fever and confusion.',
      vitals: [norm({ h: 0, hr: 92, sbp: 146, dbp: 88 }), norm({ h: 24, hr: 82, sbp: 138, dbp: 84 }), norm({ h: 48, hr: 78, sbp: 132, dbp: 80 })],
      diet: 'Consistent carbohydrate diet', dietNote: 'Three meals with a bedtime snack; carbohydrate counting teaching.',
      meds: [LISINOPRIL, SSI('high'), B12('500 mcg')],
      orders: [GLU_ORDER, { name: 'Hypoglycemia protocol', category: 'Nursing', frequency: 'PRN glucose below 70 mg/dL', startH: 3, instructions: 'If awake and able to swallow: 15 g fast carbohydrate (4 oz juice), recheck in 15 minutes, repeat if still below 70, then notify the provider.' },
        { name: 'Blood pressure before the morning medication', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Check BP and HR before giving lisinopril; hold and notify for SBP below 100.' }],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Warm, dry, intact; dry mucous membranes'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: [OBJ, 'Read the high-dose sliding scale to find the correct insulin dose and recognize signs of hypoglycemia.', 'Check blood pressure before an antihypertensive and apply the hold parameter.']
    }, glucoseLab(ctx, 338)));

  // ---------------------------------------------------------------- 5. VITAMIN B12 DEFICIENCY (PO acetaminophen + SubQ lispro low scale + IM vitamin B12 1,000 mcg)
  prof('lpn_b12', 'Vitamin B12 deficiency anemia (PO + SubQ + IM)',
    'Anemia and tingling from low vitamin B12 in a patient with diabetes. Acetaminophen 650 mg PO, insulin lispro SubQ on the LOW-dose sliding scale (glucose 166 = 2 units), vitamin B12 1,000 mcg IM (1 mL).',
    ctx => Object.assign({
      problem: 'Vitamin B12 deficiency anemia', details: 'Fatigue, tingling in the hands and feet and a low vitamin B12 level; daily intramuscular B12 for one week, then monthly; headache treated with acetaminophen; diabetes on sliding-scale insulin.',
      chief: 'Fatigue and tingling in the hands and feet',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and 3 months of worsening tiredness, a sore smooth tongue, tingling in the fingers and toes and a daily headache. Hemoglobin low with large red cells, vitamin B12 level 148 pg/mL (low). Admitted for intramuscular B12 replacement, headache relief and sliding-scale insulin.`,
      ros: 'Positive for fatigue, tingling in the hands and feet, pale skin, headache and a sore tongue. Negative for chest pain, shortness of breath at rest, bleeding, black stools and weight loss.',
      keyLabs: ['Hemoglobin', 'Glucose'], quals: [{ h: 1.0, category: 'Other', code: 'Vitamin B12 level', value: '148 pg/mL (low)', reference: '200-900 pg/mL', flag: 'Abnormal', specimen: 'Blood' }, { h: 1.0, category: 'Other', code: 'MCV', value: '109 fL (high)', reference: '80-100 fL', flag: 'Abnormal', specimen: 'Blood' }],
      vitals: [norm({ h: 0, hr: 94, pain: 3 }), norm({ h: 24, hr: 86, pain: 2 }), norm({ h: 48, hr: 82, pain: 1 })], fall: 1,
      diet: 'Consistent carbohydrate diet',
      meds: [ACETAMINOPHEN('Headache'), SSI('low'), B12('1,000 mcg')],
      orders: [{ name: 'Neurovascular and sensation check, hands and feet', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Document tingling or numbness; fall precautions for unsteady walking.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Pale, warm and dry; mildly jaundiced sclera'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Neurologic', 'Sensation', 'Decreased light touch in both fingertips and toes'], ['Musculoskeletal / Mobility', 'Mobility', 'Steady but slow gait']] }],
      objectives: [OBJ, 'Select an appropriate IM site, needle size and technique, and rotate sites between doses.', 'Read the low-dose sliding scale to find the correct insulin dose for the glucose result.']
    }, (() => { const g = glucoseLab(ctx, 163); g.labs.Hemoglobin = { abs: [[0, 9.4], [48, 9.6]] }; g.labSchedule.push({ h: 0.5, codes: ['Hemoglobin'] }); return g; })()));

  // ---------------------------------------------------------------- the four "lab cart" patients: one PO from the cart drawers, SubQ insulin lispro (a different scale each), IM vitamin B12 or promethazine
  const FUROSEMIDE = { key: 'furosemide_po', name: 'furosemide (LASIX) tablet', dose: '20 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Loop diuretic', monitor: ['BP', 'HR', 'K'], by: 'hospitalist',
    hold: 'Hold and notify the provider if SBP is below 90, the patient is dizzy, or potassium is below 3.5.', indication: 'Heart failure with fluid overload',
    info: 'Check blood pressure and heart rate BEFORE giving, and the morning weight. Give in the morning. Watch urine output, dizziness and muscle cramps (low potassium). Teach to rise slowly and to weigh daily.' };
  const FERROUS = { key: 'ferrous_sulfate', name: 'ferrous sulfate (iron) tablet', dose: '325 mg (65 mg elemental iron)', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Iron supplement', monitor: ['Hgb'], by: 'hospitalist',
    indication: 'Iron deficiency anemia', info: 'Give with a vitamin C source or juice if tolerated and NOT with milk, antacids or calcium. Stools turn dark green or black (expected). Can cause constipation and stomach upset. Keep out of reach of children (iron overdose is dangerous).' };
  const CEPHALEXIN = { key: 'cephalexin', name: 'cephalexin (KEFLEX) capsule', dose: '250 mg', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Cephalosporin antibiotic', monitor: ['Temp'], by: 'hospitalist', avoid: ['cephalosporin', 'penicillin'],
    indication: 'Skin infection (cellulitis)', info: 'Check the allergy list BEFORE giving (penicillin and cephalosporin allergy). Give with food if upset stomach. Watch for rash, diarrhea and nausea. Finish the whole course.' };
  const POTASSIUM = { key: 'potassium_chloride_er', name: 'potassium chloride (K-DUR) extended-release tablet', dose: '20 mEq', route: 'Oral', freq: 'daily', startH: 1.0, cls: 'Electrolyte supplement', monitor: ['K'], by: 'hospitalist', highAlert: true,
    hold: 'Hold and notify the provider if the potassium is above 5.0 or the patient cannot swallow the tablet whole.', indication: 'Low potassium (hypokalemia)',
    info: 'Very large tablet: swallow WHOLE with a full glass of water and food, upright for 30 minutes; do NOT crush or chew (extended-release). Check the latest potassium first. Report nausea, stomach pain or black stools.' };
  const PROMETHAZINE = { key: 'promethazine_im', name: 'promethazine (PHENERGAN) injection', dose: '12.5 mg', route: 'Intramuscular', freq: 'daily', startH: 1.0, cls: 'Antiemetic / phenothiazine antihistamine', monitor: ['RR', 'BP'], by: 'hospitalist',
    hold: 'Hold and notify the provider if the patient is very drowsy or the respiratory rate is below 12.', indication: 'Nausea',
    info: 'Concentration 25 mg/mL, so 12.5 mg = 0.5 mL. Give DEEP IM ONLY into a large muscle (never subcutaneous and never into an artery: severe tissue injury). Causes drowsiness and dizziness: keep the bed low and call light in reach; fall precautions. Ask about sedation and breathing before giving.' };
  const onePass = 'Complete a medication pass with one oral, one subcutaneous and one intramuscular medication, scanning the patient and every medication.';

  prof('lpn_lasix', 'Heart failure with pneumonia (Lasix + SubQ + IM ceftriaxone 3 mL)',
    'Mild fluid overload from a chest infection in a patient with heart failure and diabetes. Furosemide (Lasix) 20 mg PO (hold if SBP below 90), insulin lispro SubQ on the SENSITIVE scale (glucose 229 = 2 units), ceftriaxone 1.5 g IM = 3 mL (give in the ventrogluteal or vastus lateralis).',
    ctx => Object.assign({
      problem: 'Heart failure with mild fluid overload and pneumonia', details: 'Weight up 4 pounds in 3 days with ankle swelling after a chest infection; oral diuretic; intramuscular antibiotic once a day (3 mL); type 2 diabetes on a sensitive sliding scale.',
      chief: 'Cough, leg swelling and shortness of breath with walking',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with heart failure and type 2 diabetes who has had a productive cough and low-grade fever for 4 days, then gained 4 pounds over 3 days with swollen ankles and mild shortness of breath on exertion. Chest x-ray shows a small right lower lobe pneumonia. Admitted for an oral diuretic, an intramuscular antibiotic, a low-sodium diet and sliding-scale insulin.`,
      ros: 'Positive for cough, low-grade fever, ankle swelling and shortness of breath with exertion. Negative for chest pain at rest, nausea and palpitations.',
      vitals: [norm({ h: 0, temp: 100.0, sbp: 138, dbp: 82, hr: 88 }), norm({ h: 24, temp: 99.0, sbp: 130, dbp: 78, hr: 80 }), norm({ h: 48, sbp: 126, dbp: 76, hr: 76 })], fall: 1,
      diet: 'Consistent carbohydrate, 2 g sodium diet', dietNote: 'Fluid limit 1,500 mL per day.', activity: 'Up with assistance as needed', activityNote: 'Rise slowly; call for help.',
      meds: [FUROSEMIDE, SSI('sens'), CEFTRIAXONE('1.5 g', CLINDA)],
      orders: [{ name: 'Daily weight and blood pressure before the diuretic', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Weigh at the same time each morning. Check BP and HR before furosemide; hold and notify for SBP below 90 or dizziness.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Cardiac', 'Edema', '2+ pitting edema of both ankles'], ['Respiratory', 'Breath Sounds', 'Crackles at the right base and mild bibasilar crackles'], ['Skin', 'Skin', 'Both hips and thighs intact, no bruising or redness; both buttocks intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Independent']] }],
      objectives: [onePass, 'Check blood pressure and weight before a diuretic and apply the hold parameter.', 'Choose a safe site (ventrogluteal or vastus lateralis) for a 3 mL intramuscular injection, and verify allergies before an antibiotic.']
    }, glucoseLab(ctx, 227)));

  prof('lpn_iron', 'Iron deficiency anemia (iron + SubQ + IM B12)',
    'Anemia from low iron and low vitamin B12 in a patient with diabetes. Ferrous sulfate (iron) 325 mg PO, insulin lispro SubQ on the LOW-dose scale (glucose 194 = 2 units), vitamin B12 1,000 mcg IM (1 mL).',
    ctx => Object.assign({
      problem: 'Iron deficiency anemia', details: 'Fatigue and a hemoglobin of 8.8 from slow blood loss and low iron; oral iron; vitamin B12 also low; type 2 diabetes on a low-dose sliding scale.',
      chief: 'Tiredness and pale skin',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and 3 months of tiredness, pale skin and lightheadedness on standing. Hemoglobin 8.8 g/dL with low iron stores and a low vitamin B12. No black stools or vomiting blood. Admitted to start oral iron, vitamin B12 injections and sliding-scale insulin.`,
      ros: 'Positive for fatigue, pale skin and lightheadedness. Negative for chest pain, shortness of breath at rest, vomiting blood and fever.',
      keyLabs: ['Hemoglobin', 'Glucose'], vitals: [norm({ h: 0, hr: 96 }), norm({ h: 24, hr: 88 }), norm({ h: 48, hr: 82 })], fall: 1,
      diet: 'Consistent carbohydrate diet', dietNote: 'Iron-rich foods; vitamin C with iron doses.', activity: 'Up with assistance as needed', activityNote: 'Rise slowly: lightheadedness.',
      meds: [FERROUS, SSI('low'), B12('1,000 mcg')],
      orders: [{ name: 'Stool color and bowel pattern', category: 'Nursing', frequency: 'Every shift', startH: 3, instructions: 'Document stool color. Dark green or black stools are expected with iron; report red blood or tarry sticky stools.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Pale, warm and dry'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4'], ['Musculoskeletal / Mobility', 'Mobility', 'Steady but tires easily']] }],
      objectives: [onePass, 'Give oral iron correctly (with vitamin C, not with milk or antacids) and teach about dark stools.', 'Read the low-dose sliding scale and select an appropriate IM site for vitamin B12.']
    }, (() => { const g = glucoseLab(ctx, 188); g.labs.Hemoglobin = { abs: [[0, 8.9], [48, 9.1]] }; g.labSchedule.push({ h: 0.5, codes: ['Hemoglobin'] }); return g; })()));

  prof('lpn_cephalexin', 'Cellulitis with nausea (cephalexin + SubQ + IM Phenergan)',
    'Mild cellulitis with nausea in a patient with diabetes. Cephalexin 250 mg PO (check allergies), insulin lispro SubQ on the MODERATE scale (glucose 280 = 9 units), promethazine (Phenergan) 12.5 mg IM (0.5 mL).',
    ctx => Object.assign({
      problem: 'Cellulitis of the left forearm with nausea', details: 'Red, warm, tender left forearm after an insect bite; low-grade fever; oral antibiotic; nausea treated with an intramuscular antiemetic; type 2 diabetes on a moderate sliding scale.',
      chief: 'Red, painful left forearm and nausea',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and a red, warm, tender left forearm for 2 days after an insect bite. Low-grade fever and nausea at home. No pus. Admitted for an oral antibiotic, an antinausea injection and sliding-scale insulin.`,
      ros: 'Positive for arm redness, warmth, pain, nausea and a low-grade fever. Negative for vomiting, chest pain, shortness of breath and diarrhea.',
      vitals: [norm({ h: 0, temp: 100.2, hr: 92, pain: 4 }), norm({ h: 24, temp: 99.0, hr: 82, pain: 2 }), norm({ h: 48, temp: 98.5, hr: 78, pain: 1 })], fall: 1,
      diet: 'Consistent carbohydrate diet', activity: 'Up with assistance as needed', activityNote: 'Antinausea medicine causes drowsiness: call, do not fall.',
      meds: [CEPHALEXIN, SSI('mid'), PROMETHAZINE],
      orders: [{ name: 'Mark the edge of the redness with a skin marker', category: 'Nursing', frequency: 'On arrival and every shift', startH: 3, instructions: 'Outline the red area, date and time it. Report spreading redness, fever above 101, or pus.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['Skin', 'Skin', 'Left forearm: red, warm, tender area about 7 x 5 cm, border outlined; no drainage'], ['GI', 'Nausea / Vomiting', 'Nauseated, no vomiting'], ['Pain', 'Pain Location', 'Left forearm, aching, 4/10']] }],
      objectives: [onePass, 'Verify allergies before giving an antibiotic, and check sedation before an IM antiemetic.', 'Read the moderate sliding scale to find the correct insulin dose.']
    }, glucoseLab(ctx, 284)));

  prof('lpn_potassium', 'Low potassium after infectious diarrhea (potassium + SubQ + IM ceftriaxone 3 mL)',
    'Low potassium after bacterial diarrhea in a patient with diabetes. Potassium chloride ER 20 mEq PO (very large tablet, swallow whole), insulin lispro SubQ on the HIGH-dose scale (glucose 316 = 16 units), ceftriaxone 1.5 g IM = 3 mL (right hip is bruised: choose the left side).',
    ctx => Object.assign({
      problem: 'Hypokalemia after infectious diarrhea', details: 'Three days of watery diarrhea, fever and vomiting from a bacterial stomach infection with leg cramps and a potassium of 3.3; oral potassium; intramuscular antibiotic (3 mL); type 2 diabetes with high glucose on a high-dose sliding scale.',
      chief: 'Diarrhea, fever and muscle cramps',
      hpi: `${ctx.age}-year-old ${ctx.sex.toLowerCase()} with type 2 diabetes and 3 days of watery diarrhea, fever and vomiting after a restaurant meal, with weak, crampy legs. Potassium 3.3 mmol/L (low), glucose high, stool culture pending. Admitted for oral potassium, an intramuscular antibiotic and sliding-scale insulin. She bruised her right hip in a fall in the bathroom last night.`,
      ros: 'Positive for diarrhea, nausea, vomiting, fever, leg cramps and a bruised right hip. Negative for chest pain, blood in stool and shortness of breath.',
      keyLabs: ['Potassium', 'Glucose'], vitals: [norm({ h: 0, temp: 100.6, hr: 96, sbp: 112, dbp: 68 }), norm({ h: 24, temp: 99.2, hr: 86, sbp: 120, dbp: 72 }), norm({ h: 48, hr: 80, sbp: 124, dbp: 74 })], fall: 2,
      diet: 'Consistent carbohydrate diet, advance as tolerated', activity: 'Up with assistance', activityNote: 'Weak legs and a bruised right hip: assist with walking.',
      meds: [POTASSIUM, SSI('high'), CEFTRIAXONE('1.5 g', CLINDA)],
      orders: [{ name: 'Check the potassium result before each potassium dose', category: 'Nursing', frequency: 'Daily before the 0900 dose', startH: 3, instructions: 'Review the latest potassium. Hold and notify the provider if above 5.0 or the patient cannot swallow the tablet whole.' }, GLU_ORDER],
      assessments: [{ fromH: 0, items: [['GI', 'Nausea / Vomiting', 'Nauseated, vomited twice yesterday; watery stools x6 today'], ['Skin', 'Skin', 'Right lateral hip: 8 x 6 cm purple bruise, tender; left hip and both thighs intact'], ['Musculoskeletal / Mobility', 'Mobility', 'Weak legs, walks with assistance'], ['Neurologic', 'Level of Consciousness', 'Alert and oriented x4']] }],
      objectives: [onePass, 'Review the potassium level before an oral potassium dose and give a very large extended-release tablet safely (whole, with water, upright).', 'Choose a safe site for a 3 mL intramuscular injection (avoid the bruised right hip), and read the high-dose sliding scale.']
    }, (() => { const g = glucoseLab(ctx, 322); g.labs.Potassium = { abs: [[0, 3.2], [48, 3.9]] }; g.labSchedule.push({ h: 0.5, codes: ['Potassium'] }); return g; })()));
})();

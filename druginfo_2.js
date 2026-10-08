/* drug guide entries, part 2 (dextrose to midodrine) */
DrugGuide.add('dextrose 50%', { aliases: ['dextrose 50', 'd50', 'dextrose'], brand: 'D50W', cls: 'concentrated carbohydrate / hypertonic IV fluid',
  use: 'Rapidly raises blood glucose in severe hypoglycemia.',
  dose: 'Usually 25 g (50 mL of 50%) IV push for glucose < 70 with symptoms or unable to take PO; may repeat per protocol. Always follow the order.',
  give: ['Give by slow IV push (about 3 mL/min), through a large, patent vein.', 'Check IV site first; it is very hypertonic and can cause phlebitis and tissue injury if it infiltrates.', 'Recheck glucose in 15 minutes and follow with food or a dextrose infusion if ordered.'],
  watch: ['Glucose before and 15 minutes after.', 'IV site for pain, swelling or redness.', 'Mental status and signs of hypoglycemia resolving.'],
  hold: ['Hold and call if the IV is not patent or the site is infiltrated.', 'Call if glucose is not rising after the dose.', 'Do not give if glucose is already high.'],
  effects: ['Hyperglycemia', 'Phlebitis at IV site', 'SERIOUS: tissue necrosis from extravasation', 'SERIOUS: hypokalemia or hypophosphatemia with repeated doses'],
  teach: 'Explain why sugar was needed and how to recognize low blood sugar. Review meals and diabetes medicines with the provider.', alert: true, lasa: 'D50 vs D5; check the concentration on the label.' });

DrugGuide.add('diatrizoate meglumine-sodium contrast', { aliases: ['diatrizoate', 'gastrografin', 'oral contrast'], brand: 'Gastrografin', cls: 'iodinated radiographic contrast (oral)',
  use: 'Oral contrast for CT and GI imaging; also used to help with small-bowel obstruction.',
  dose: 'Dose and volume vary by exam, per radiology/provider. Always follow the order.',
  give: ['Give by mouth or tube as ordered, often diluted; timing depends on the scan.', 'Hyperosmolar: keep the patient upright and watch for aspiration.', 'Ask about iodine or contrast allergy first.'],
  watch: ['Allergy history and prior contrast reactions.', 'Hydration, kidney function and electrolytes.', 'Stool output and abdominal distention.'],
  hold: ['Hold and call for prior contrast allergy or active vomiting.', 'Hold and call if aspiration risk is high.', 'Call if the patient is dehydrated or has poor kidney function.'],
  effects: ['Diarrhea', 'Nausea and vomiting', 'SERIOUS: aspiration (pulmonary edema if aspirated)', 'SERIOUS: allergic reaction or dehydration'],
  teach: 'It tastes unpleasant and may cause loose stools. Drink plenty of fluids afterward unless restricted.', alert: false, lasa: '' });

DrugGuide.add('diclofenac 1%', { aliases: ['diclofenac', 'voltaren gel'], brand: 'Voltaren gel', cls: 'NSAID (topical)',
  use: 'Relieves joint pain from osteoarthritis, especially in the hands, knees and feet.',
  dose: 'Apply 2 to 4 g to the affected joint up to 4 times daily using the dosing card; max 32 g per day total. Always follow the order.',
  give: ['Measure with the dosing card and rub gently into clean, intact skin.', 'Wear gloves and wash hands after, unless treating the hands.', 'Do not apply to broken skin; avoid heat pads or tight wraps over it.'],
  watch: ['Pain relief and skin condition at the site.', 'History of GI bleed, kidney disease, heart disease or NSAID allergy.', 'Use of other NSAIDs or anticoagulants.'],
  hold: ['Hold and call for NSAID or aspirin allergy.', 'Hold and call if skin is broken or rash develops.', 'Call for GI bleeding or declining kidney function.'],
  effects: ['Skin redness, itching, dryness', 'Application-site rash', 'SERIOUS: GI bleeding (less than oral)', 'SERIOUS: cardiovascular events and kidney injury'],
  teach: 'Use the lowest effective amount and do not combine with oral NSAIDs unless told. Avoid sun on the treated area.', alert: false, lasa: '' });

DrugGuide.add('dicyclomine', { aliases: ['bentyl'], brand: 'Bentyl', cls: 'anticholinergic antispasmodic',
  use: 'Relieves cramping and spasm in irritable bowel syndrome.',
  dose: '10 to 20 mg PO 3 to 4 times daily; IM dose is 10 to 20 mg every 6 hours (never IV). Always follow the order.',
  give: ['Give 30 minutes before meals if ordered that way.', 'IM only; do not give IV.', 'Offer sips of water for dry mouth.'],
  watch: ['Abdominal pain and bowel sounds.', 'Heart rate, urinary retention, constipation.', 'Confusion in older adults.'],
  hold: ['Hold and call for urinary retention or ileus.', 'Hold and call for HR > 120 or new confusion.', 'Avoid in glaucoma, obstruction or severe colitis; ask the provider.'],
  effects: ['Dry mouth', 'Blurred vision, drowsiness', 'Constipation, urinary retention', 'SERIOUS: tachycardia, delirium, heat intolerance'],
  teach: 'May cause dizziness and dry mouth; avoid heat and drive carefully. Report trouble urinating.', alert: false, lasa: 'Bentyl vs Aventyl (nortriptyline); dicyclomine vs dicloxacillin.' });

DrugGuide.add('digoxin', { aliases: ['lanoxin', 'digoxin tablets'], brand: 'Lanoxin', cls: 'cardiac glycoside',
  use: 'Slows ventricular rate in atrial fibrillation and strengthens contraction in heart failure.',
  dose: 'Maintenance usually 0.125 to 0.25 mg PO daily; IV loading doses are given in divided amounts per provider. Always follow the order.',
  give: ['Take an apical pulse for a full minute before every dose.', 'Check potassium and recent digoxin level first.', 'IV push slowly over at least 5 minutes.'],
  watch: ['Apical HR and rhythm; ECG changes.', 'K+ (keep 4.0 to 5.0), Mg, creatinine.', 'Level goal about 0.5 to 2 ng/mL (lower end for HF).'],
  hold: ['Hold for apical HR < 60 (adult) and call.', 'Hold and call for K+ < 3.5 or new nausea/vision changes.', 'Hold and call for new heart block or arrhythmia.'],
  effects: ['Nausea, vomiting, anorexia', 'Yellow-green halos or blurred vision', 'SERIOUS: bradycardia and heart block', 'SERIOUS: ventricular arrhythmias (toxicity)'],
  teach: 'Check your pulse daily and report a pulse under 60, vision changes or nausea. Do not skip doses.', alert: false, lasa: 'Digoxin vs Desoxyn; dosing in mg vs mcg errors.' });

DrugGuide.add('diltiazem', { aliases: ['cardizem', 'diltiazem er', 'diltiazem cd', 'diltiazem drip'], brand: 'Cardizem', cls: 'calcium channel blocker (non-dihydropyridine)',
  use: 'Controls heart rate in atrial fibrillation/flutter and treats hypertension and angina.',
  dose: 'IV bolus 0.25 mg/kg over 2 minutes then 5 to 15 mg/h infusion; PO 30 to 120 mg 3 to 4 times daily or ER 120 to 360 mg daily. Always follow the order.',
  give: ['Do not crush or chew ER or CD capsules.', 'IV: monitor on a cardiac monitor with frequent BP; give bolus over 2 minutes.', 'Infusion needs a pump and may be titrated per order.'],
  watch: ['HR and BP before and after each dose.', 'ECG for PR prolongation or heart block.', 'Edema and signs of heart failure.'],
  hold: ['Hold for SBP < 100 or HR < 60 and call.', 'Hold and call for second- or third-degree heart block.', 'Hold and call for decompensated heart failure.'],
  effects: ['Hypotension, dizziness', 'Peripheral edema, headache', 'Constipation', 'SERIOUS: bradycardia, heart block, heart failure'],
  teach: 'Swallow ER capsules whole and rise slowly. Avoid grapefruit juice.', alert: false, lasa: 'Diltiazem vs Dilantin; Cardizem vs Cardene.' });

DrugGuide.add('docusate', { aliases: ['colace', 'docusate sodium'], brand: 'Colace', cls: 'stool softener',
  use: 'Softens stool to prevent straining and constipation.',
  dose: '100 mg PO once to twice daily (50 to 300 mg/day). Always follow the order.',
  give: ['Give with a full glass of water.', 'Liquid may be mixed in juice or milk to mask taste.', 'Takes 1 to 3 days to work.'],
  watch: ['Bowel movements: frequency and consistency.', 'Fluid and fiber intake.', 'Abdominal pain or distention.'],
  hold: ['Hold and call for diarrhea or loose stools.', 'Hold and call for abdominal pain, vomiting or suspected obstruction.', 'Hold if a bowel movement is not needed per order.'],
  effects: ['Mild cramping', 'Loose stool', 'Throat irritation with liquid', 'SERIOUS: rare; dependence if overused with laxatives'],
  teach: 'Drink fluids and eat fiber. It is gentle and may take a day or two to work.', alert: false, lasa: 'Docusate vs Doxepin; Colace vs Cozaar.' });

DrugGuide.add('donepezil', { aliases: ['aricept'], brand: 'Aricept', cls: 'cholinesterase inhibitor',
  use: 'Slows symptoms of mild to severe Alzheimer dementia.',
  dose: '5 mg PO at bedtime, may increase to 10 mg after 4 to 6 weeks (23 mg for some). Always follow the order.',
  give: ['Give in the evening, with or without food.', 'ODT dissolves on the tongue; do not push through foil.', 'Give with food if GI upset occurs.'],
  watch: ['Heart rate and rhythm.', 'Weight, appetite, nausea, GI bleed signs.', 'Cognition and function over weeks.'],
  hold: ['Hold for HR < 50 and call.', 'Hold and call for fainting or heart block.', 'Hold and call for persistent vomiting.'],
  effects: ['Nausea, diarrhea, anorexia', 'Vivid dreams, insomnia', 'Muscle cramps', 'SERIOUS: bradycardia, syncope, GI bleeding'],
  teach: 'Benefit builds slowly and it does not cure the disease. Report fainting, slow pulse or black stools.', alert: false, lasa: 'Aricept vs Aciphex.' });

DrugGuide.add('dornase alfa', { aliases: ['pulmozyme'], brand: 'Pulmozyme', cls: 'mucolytic enzyme (inhaled)',
  use: 'Thins thick airway secretions in cystic fibrosis.',
  dose: '2.5 mg (1 ampule) inhaled by nebulizer once daily. Always follow the order.',
  give: ['Use only a compatible jet nebulizer with compressor; do not mix with other drugs in the cup.', 'Keep ampules refrigerated and protected from light.', 'Pair with airway clearance as ordered.'],
  watch: ['Lung sounds, cough and sputum.', 'Voice changes and throat irritation.', 'Oxygen saturation and work of breathing.'],
  hold: ['Hold and call for acute bronchospasm or severe wheezing.', 'Hold and call if ampule is cloudy or discolored.', 'Call for hemoptysis.'],
  effects: ['Voice change, hoarseness', 'Sore throat, cough', 'Chest pain', 'SERIOUS: bronchospasm, rash'],
  teach: 'Use it every day even when feeling well. Rinse mouth and clean nebulizer parts after use.', alert: false, lasa: 'Pulmozyme vs Pulmicort.' });

DrugGuide.add('doxycycline', { aliases: ['doxycycline hyclate', 'vibramycin', 'doxycycline monohydrate'], brand: 'Vibramycin', cls: 'tetracycline antibiotic',
  use: 'Treats respiratory, skin, tick-borne and sexually transmitted infections, and acne.',
  dose: '100 mg PO or IV every 12 hours (most infections). Always follow the order.',
  give: ['Give with a full glass of water and stay upright for 30 minutes to avoid esophageal irritation.', 'Separate from antacids, calcium, iron and dairy by 2 hours.', 'May be given with food if GI upset occurs.'],
  watch: ['Signs of infection improving: fever, WBC.', 'GI symptoms and esophageal pain.', 'Skin for sun reaction.'],
  hold: ['Hold and call for rash, hives or tetracycline allergy.', 'Hold and call for severe diarrhea.', 'Verify pregnancy status per provider.'],
  effects: ['Nausea, diarrhea', 'Photosensitivity', 'Esophagitis', 'SERIOUS: C. difficile diarrhea, intracranial hypertension'],
  teach: 'Use sunscreen and avoid tanning. Finish the full course and separate from dairy, antacids and iron.', alert: false, lasa: 'Doxycycline vs doxepin; doxycycline vs doxylamine.' });

DrugGuide.add('duloxetine', { aliases: ['cymbalta'], brand: 'Cymbalta', cls: 'SNRI antidepressant',
  use: 'Treats depression, anxiety, diabetic nerve pain, fibromyalgia and chronic musculoskeletal pain.',
  dose: '30 to 60 mg PO once daily (max 120 mg/day). Always follow the order.',
  give: ['Swallow capsule whole; do not crush or open.', 'Give with food if nausea occurs.', 'Do not stop suddenly.'],
  watch: ['Mood, suicidal thoughts (esp. under 25 and at start).', 'BP, sodium (hyponatremia in older adults).', 'Liver function, alcohol use.'],
  hold: ['Hold and call for suicidal thoughts or agitation.', 'Hold and call for signs of serotonin syndrome.', 'Hold and call for jaundice or elevated liver tests.'],
  effects: ['Nausea, dry mouth', 'Insomnia or drowsiness', 'Sweating, constipation', 'SERIOUS: serotonin syndrome, hepatotoxicity, suicidality'],
  teach: 'Takes 2 to 4 weeks to work. Do not stop suddenly; avoid alcohol and report mood changes.', alert: false, lasa: 'Cymbalta vs Symbyax; duloxetine vs fluoxetine.' });

DrugGuide.add('elexacaftor-tezacaftor-ivacaftor', { aliases: ['elexacaftor-tezacaftor-ivacaftor tablets', 'trikafta', 'elexacaftor'], brand: 'Trikafta', cls: 'CFTR modulator combination',
  use: 'Improves CFTR protein function in cystic fibrosis with at least one F508del mutation.',
  dose: 'Two orange tablets (elexa/teza/iva) in the morning and one blue ivacaftor tablet in the evening, about 12 hours apart. Always follow the order.',
  give: ['Give with fat-containing food (eggs, butter, nuts, cheese).', 'Avoid grapefruit and Seville oranges.', 'Dose is reduced with strong CYP3A inhibitors and liver impairment; check with pharmacy.'],
  watch: ['Liver tests (ALT/AST, bilirubin) baseline and periodically.', 'Lung function, weight and sweat chloride over time.', 'Mood changes and rash.'],
  hold: ['Hold and call for ALT/AST > 5x normal or jaundice.', 'Hold and call for severe rash.', 'Call before giving with interacting drugs.'],
  effects: ['Headache, diarrhea, upper respiratory symptoms', 'Rash', 'Elevated liver enzymes', 'SERIOUS: liver injury, cataracts in children'],
  teach: 'Take with fatty food every day, morning and evening doses 12 hours apart. Avoid grapefruit.', alert: false, lasa: '' });

DrugGuide.add('eltrombopag', { aliases: ['promacta', 'alvaiz'], brand: 'Promacta', cls: 'thrombopoietin receptor agonist',
  use: 'Raises platelet count in immune thrombocytopenia, hepatitis C and aplastic anemia.',
  dose: 'Starting 25 to 50 mg PO once daily, adjusted by platelet count (max 75 mg/day). Always follow the order.',
  give: ['Give on an empty stomach: 1 hour before or 2 hours after food.', 'Separate by 4 hours from calcium, iron, antacids and dairy.', 'Hazardous drug; follow safe handling.'],
  watch: ['Platelet count (CBC) as ordered.', 'Liver tests (ALT, AST, bilirubin).', 'Bleeding or clotting signs.'],
  hold: ['Hold and call for platelets above target range.', 'Hold and call for ALT > 3x normal or jaundice.', 'Hold and call for signs of clot (leg swelling, chest pain).'],
  effects: ['Nausea, diarrhea, fatigue', 'Headache', 'SERIOUS: hepatotoxicity', 'SERIOUS: thromboembolism, cataracts'],
  teach: 'Take on an empty stomach, apart from dairy and mineral supplements. Report yellow skin, dark urine, or bleeding.', alert: false, lasa: '' });

DrugGuide.add('empagliflozin', { aliases: ['jardiance'], brand: 'Jardiance', cls: 'SGLT2 inhibitor',
  use: 'Lowers glucose in type 2 diabetes and protects the heart and kidneys in heart failure and CKD.',
  dose: '10 mg PO once daily in the morning, may increase to 25 mg. Always follow the order.',
  give: ['Give in the morning with or without food.', 'Check volume status and kidney function first.', 'Hold before surgery or prolonged fasting per provider.'],
  watch: ['Glucose, BP, weight and volume status.', 'eGFR, creatinine.', 'Genital and urinary infection signs; ketones if ill.'],
  hold: ['Hold and call if NPO, vomiting, or poor intake (ketoacidosis risk).', 'Hold and call for dehydration or SBP < 100.', 'Hold and call for genital pain or necrotizing infection signs.'],
  effects: ['Genital yeast infection, UTI', 'Increased urination, thirst', 'Dizziness', 'SERIOUS: euglycemic ketoacidosis, Fournier gangrene, AKI'],
  teach: 'Keep the genital area clean and dry and stay hydrated. Stop and call if sick with vomiting or diarrhea.', alert: false, lasa: 'Jardiance vs Januvia.' });

DrugGuide.add('enoxaparin', { aliases: ['lovenox'], brand: 'Lovenox', cls: 'low molecular weight heparin (anticoagulant)',
  use: 'Prevents and treats deep vein thrombosis, pulmonary embolism and acute coronary syndromes.',
  dose: 'Prophylaxis 30 mg SQ q12h or 40 mg SQ daily; treatment 1 mg/kg SQ q12h or 1.5 mg/kg daily; reduce if CrCl < 30. Always follow the order.',
  give: ['Give deep subcutaneous in the abdomen at least 2 inches from the navel; rotate sites.', 'Do not expel the air bubble; do not rub the site.', 'Do not mix with other drugs; no aspiration needed.'],
  watch: ['Platelets, hemoglobin, creatinine/CrCl.', 'Signs of bleeding and bruising, neuro checks.', 'Spinal or epidural timing (spinal hematoma risk).'],
  hold: ['Hold and call for platelets < 100,000 or falling > 50%.', 'Hold and call for active bleeding or before procedures.', 'Hold and call if CrCl < 30 for dose review.'],
  effects: ['Bruising at injection site', 'Bleeding', 'Anemia', 'SERIOUS: major hemorrhage, HIT, spinal/epidural hematoma'],
  teach: 'Use a soft toothbrush and electric razor and report black stools, blood in urine or unusual bruising.', alert: true, lasa: 'Enoxaparin vs heparin; check mg vs units.' });

DrugGuide.add('epinephrine auto-injector', { aliases: ['epinephrine', 'epipen', 'adrenalin', 'auvi-q'], brand: 'EpiPen', cls: 'catecholamine (alpha/beta agonist)',
  use: 'First-line treatment of anaphylaxis.',
  dose: 'Adult anaphylaxis: 0.3 mg IM (1 mg/mL) into the outer mid-thigh; repeat in 5 to 15 minutes if needed. Always follow the order.',
  give: ['Inject into the outer thigh (can go through clothing); hold in place about 3 seconds (follow device directions).', 'Call for help or rapid response and monitor after use.', 'Note IM (1 mg/mL) versus IV (0.1 mg/mL) strengths; never confuse them.'],
  watch: ['Airway, breathing, BP, HR, skin and swelling.', 'Cardiac rhythm and chest pain.', 'Response in 5 to 15 minutes; need for repeat dose.'],
  hold: ['Do not delay in true anaphylaxis; there is no absolute contraindication.', 'Call provider for chest pain or severe hypertension after dose.', 'Check expiration and clear solution before use.'],
  effects: ['Tachycardia, palpitations', 'Tremor, anxiety, pallor', 'Headache', 'SERIOUS: arrhythmia, severe hypertension, MI'],
  teach: 'Carry two auto-injectors, learn the steps, and call 911 after every use. Check expiration dates.', alert: true, lasa: 'Epinephrine vs ephedrine; 1 mg/mL vs 0.1 mg/mL strengths.' });

DrugGuide.add('estradiol', { aliases: ['estrace', 'estradiol patch', 'estradiol tablets'], brand: 'Estrace', cls: 'estrogen hormone',
  use: 'Relieves menopausal symptoms and replaces estrogen in hypoestrogenism.',
  dose: 'PO 0.5 to 2 mg daily; transdermal patch 0.025 to 0.1 mg/day changed once or twice weekly. Always follow the order.',
  give: ['Patch: apply to clean dry skin below the waist, rotate sites, not on breast.', 'PO may be given with food to lessen nausea.', 'Use with a progestin if the uterus is intact, per provider.'],
  watch: ['BP, weight, edema.', 'Calf pain, chest pain or sudden vision changes.', 'Breast changes and abnormal bleeding.'],
  hold: ['Hold and call for suspected DVT, stroke or PE.', 'Hold and call for undiagnosed vaginal bleeding.', 'Hold and call for pregnancy or known estrogen-sensitive cancer.'],
  effects: ['Breast tenderness, nausea', 'Headache, bloating', 'Spotting', 'SERIOUS: blood clots, stroke, breast/endometrial cancer'],
  teach: 'Report leg pain, chest pain, sudden vision change or lumps. Do not smoke; keep regular screenings.', alert: false, lasa: 'Estradiol vs Estratest; Estrace vs Ativan.' });

DrugGuide.add('ezetimibe', { aliases: ['zetia'], brand: 'Zetia', cls: 'cholesterol absorption inhibitor',
  use: 'Lowers LDL cholesterol, alone or with a statin.',
  dose: '10 mg PO once daily. Always follow the order.',
  give: ['Give with or without food, same time daily.', 'Separate from bile acid binders (cholestyramine) by 2 hours before or 4 hours after.', 'Take with the statin if ordered together.'],
  watch: ['Lipid panel over weeks.', 'Liver tests if combined with a statin.', 'Muscle pain or weakness.'],
  hold: ['Hold and call for unexplained muscle pain.', 'Hold and call for active liver disease or jaundice.', 'Hold if the diet or other lipid drug plan changes per provider.'],
  effects: ['Diarrhea, joint pain', 'Fatigue', 'Upper respiratory symptoms', 'SERIOUS: rare myopathy or liver injury'],
  teach: 'Continue low-fat diet and exercise. Report muscle pain or yellow skin.', alert: false, lasa: 'Zetia vs Zebeta.' });

DrugGuide.add('famotidine', { aliases: ['pepcid'], brand: 'Pepcid', cls: 'H2 receptor blocker',
  use: 'Reduces stomach acid for GERD, ulcers and stress ulcer prevention.',
  dose: '20 mg PO or IV twice daily or 40 mg at bedtime; reduce in renal impairment. Always follow the order.',
  give: ['PO with or without food.', 'IV push slowly over at least 2 minutes (dilute per pharmacy).', 'Space from antacids by 1 to 2 hours if ordered.'],
  watch: ['Epigastric pain and GI bleeding signs.', 'Renal function (dose adjust if CrCl < 50).', 'Confusion in older adults or kidney disease.'],
  hold: ['Hold and call for new confusion.', 'Hold and call for black stools or hematemesis.', 'Hold and call for severe renal impairment for dose review.'],
  effects: ['Headache, dizziness', 'Constipation or diarrhea', 'SERIOUS: confusion, QT prolongation in renal failure', 'SERIOUS: low platelets (rare)'],
  teach: 'Report black stools or persistent pain. Avoid smoking, alcohol and NSAIDs.', alert: false, lasa: 'Famotidine vs furosemide; Pepcid vs Pepto.' });

DrugGuide.add('fenofibrate', { aliases: ['tricor', 'fenoglide'], brand: 'Tricor', cls: 'fibrate (lipid-lowering)',
  use: 'Lowers triglycerides and sometimes raises HDL.',
  dose: '48 to 145 mg PO once daily (tablets); dose varies by product. Always follow the order.',
  give: ['Tricor can be taken with or without food; some products need food.', 'Swallow whole.', 'Separate from bile acid binders by 1 hour before or 4 to 6 hours after.'],
  watch: ['Triglycerides and lipid panel.', 'Liver tests and renal function.', 'Muscle pain, especially with a statin.'],
  hold: ['Hold and call for unexplained muscle pain or weakness.', 'Hold and call for elevated liver enzymes or gallbladder pain.', 'Hold and call for severe kidney disease per provider.'],
  effects: ['Abdominal pain, nausea', 'Headache', 'Elevated liver enzymes', 'SERIOUS: myopathy/rhabdomyolysis, gallstones, pancreatitis'],
  teach: 'Follow a low-fat diet. Report muscle pain, dark urine or right upper belly pain.', alert: false, lasa: 'Tricor vs Tracleer.' });

DrugGuide.add('ferrous sulfate', { aliases: ['iron', 'feosol', 'fer-in-sol'], brand: 'Feosol', cls: 'iron supplement',
  use: 'Treats and prevents iron deficiency anemia.',
  dose: '325 mg (65 mg elemental iron) PO once daily or every other day; up to 3 times daily. Always follow the order.',
  give: ['Best on an empty stomach; give with a little food if GI upset.', 'Separate from antacids, calcium, levothyroxine and tetracyclines by 2 hours.', 'Vitamin C or juice improves absorption; liquid can stain teeth, use a straw.'],
  watch: ['Hemoglobin, ferritin, reticulocytes.', 'Bowel pattern: constipation.', 'Stool color.'],
  hold: ['Hold and call for severe abdominal pain or vomiting.', 'Hold and call for GI bleeding signs (not dark stool alone).', 'Hold and call if hemochromatosis or iron overload.'],
  effects: ['Constipation or diarrhea', 'Dark green-black stools', 'Nausea, epigastric pain', 'SERIOUS: iron poisoning if overdose (keep away from children)'],
  teach: 'Stools will turn dark. Increase fluids and fiber; keep out of reach of children.', alert: false, lasa: 'Ferrous sulfate vs ferrous gluconate vs fumarate: different elemental iron.' });

DrugGuide.add('fludrocortisone', { aliases: ['florinef'], brand: 'Florinef', cls: 'mineralocorticoid',
  use: 'Replaces aldosterone in adrenal insufficiency and helps with orthostatic hypotension and salt wasting.',
  dose: '0.05 to 0.2 mg PO once daily. Always follow the order.',
  give: ['Give in the morning with food.', 'Do not stop suddenly.', 'Often given with a glucocorticoid in Addison disease.'],
  watch: ['Standing and sitting BP, weight, edema.', 'Potassium and sodium.', 'Signs of heart failure.'],
  hold: ['Hold and call for K+ < 3.5.', 'Hold and call for SBP > 160 or marked edema.', 'Hold and call for weight gain > 2 lb in a day or dyspnea.'],
  effects: ['Fluid retention, edema', 'Hypokalemia', 'Hypertension, headache', 'SERIOUS: heart failure, hypokalemic arrhythmias'],
  teach: 'Weigh daily and report swelling or weakness. Do not stop suddenly.', alert: false, lasa: 'Fludrocortisone vs hydrocortisone.' });

DrugGuide.add('fluoxetine', { aliases: ['prozac', 'sarafem'], brand: 'Prozac', cls: 'SSRI antidepressant',
  use: 'Treats depression, OCD, bulimia, panic disorder and PMDD.',
  dose: '20 mg PO every morning, up to 60 to 80 mg/day. Always follow the order.',
  give: ['Give in the morning with or without food.', 'Swallow capsules whole.', 'Long half-life; do not stop suddenly unless directed.'],
  watch: ['Mood and suicidal thoughts, especially early.', 'Sodium (hyponatremia), bleeding.', 'Signs of serotonin syndrome and activation or insomnia.'],
  hold: ['Hold and call for suicidal thoughts or severe agitation.', 'Hold and call for signs of serotonin syndrome.', 'Hold and call for Na < 130 or new confusion.'],
  effects: ['Nausea, headache', 'Insomnia, anxiety', 'Sexual dysfunction', 'SERIOUS: serotonin syndrome, suicidality, bleeding'],
  teach: 'Full effect takes 4 to 6 weeks. Do not stop suddenly and report worsening mood.', alert: false, lasa: 'Fluoxetine vs duloxetine; Prozac vs Proscar.' });

DrugGuide.add('fluticasone-salmeterol', { aliases: ['advair', 'advair diskus', 'wixela'], brand: 'Advair Diskus', cls: 'inhaled corticosteroid + long-acting beta agonist',
  use: 'Long-term control of asthma and COPD (not for rescue).',
  dose: 'One inhalation (100/50, 250/50 or 500/50 mcg) twice daily, about 12 hours apart. Always follow the order.',
  give: ['Hold the Diskus level, activate, and inhale quickly and deeply; do not use a spacer.', 'Rinse mouth and spit after each dose.', 'Never exhale into the device; do not use for acute symptoms.'],
  watch: ['Breathing, peak flow, lung sounds.', 'Heart rate and tremor.', 'Mouth for thrush; hoarseness.'],
  hold: ['Hold and call for acute bronchospasm; use rescue inhaler per order.', 'Hold and call for HR > 120 or chest pain.', 'Hold and call for worsening asthma control.'],
  effects: ['Hoarseness, oral thrush', 'Headache, throat irritation', 'Tremor, palpitations', 'SERIOUS: paradoxical bronchospasm, pneumonia in COPD'],
  teach: 'Use twice daily even when well and rinse your mouth. It is not a rescue inhaler.', alert: false, lasa: 'Advair vs Advil; salmeterol vs albuterol.' });

DrugGuide.add('fluticasone', { aliases: ['fluticasone nasal spray', 'fluticasone with spacer', 'flonase', 'flovent', 'flovent hfa', 'fluticasone propionate'], brand: 'Flonase / Flovent', cls: 'corticosteroid (nasal or inhaled)',
  use: 'Reduces airway or nasal inflammation in allergic rhinitis and asthma.',
  dose: 'Nasal 1 to 2 sprays per nostril daily; inhaler 88 to 880 mcg/day divided twice daily with spacer as ordered. Always follow the order.',
  give: ['Inhaler: shake, use a spacer, and rinse mouth and spit afterward.', 'Nasal: blow nose first, aim away from the septum.', 'Preventive; effect builds over days and it is not for acute symptoms.'],
  watch: ['Lung sounds, symptom control or nasal symptoms.', 'Mouth for thrush or nosebleeds.', 'Growth in children and eye pressure with long use.'],
  hold: ['Hold and call for acute attack; give rescue medicine per order.', 'Hold and call for nosebleeds or nasal sores.', 'Call for signs of oral infection.'],
  effects: ['Hoarseness, oral thrush', 'Nasal irritation, nosebleed', 'Headache', 'SERIOUS: adrenal suppression with high doses, bronchospasm'],
  teach: 'Use daily as prescribed, rinse mouth after the inhaler, and do not use it for sudden symptoms.', alert: false, lasa: 'Flonase vs Flomax; Flovent vs Foradil.' });

DrugGuide.add('folic acid', { aliases: ['folate', 'folvite'], brand: 'Folvite', cls: 'B vitamin (B9)',
  use: 'Treats and prevents folate deficiency, megaloblastic anemia, and neural tube defects; reduces methotrexate side effects.',
  dose: '1 mg PO daily (0.4 to 4 mg for pregnancy or deficiency). Always follow the order.',
  give: ['Give with or without food.', 'Check B12 status first; folate can mask B12 deficiency.', 'IV or IM available if needed.'],
  watch: ['CBC, MCV and folate level.', 'B12 level and neurologic symptoms.', 'Diet and alcohol use.'],
  hold: ['Hold and call if B12 deficiency is untreated.', 'Hold and call for rash or allergy.', 'Call if anemia does not improve.'],
  effects: ['Usually well tolerated', 'Nausea, bloating', 'Rash (rare)', 'SERIOUS: allergic reaction (rare)'],
  teach: 'Eat leafy greens, beans and fortified grains. Take daily as prescribed.', alert: false, lasa: 'Folic acid vs folinic acid (leucovorin).' });

DrugGuide.add('fragrance-free emollient lotion', { aliases: ['emollient lotion', 'emollient', 'moisturizer', 'eucerin', 'cetaphil'], brand: 'Eucerin / Cetaphil', cls: 'topical skin protectant (not a drug)',
  use: 'Moisturizes dry skin and supports the skin barrier.',
  dose: 'Apply a thin layer to the skin 1 to 3 times daily or after bathing. Always follow the order.',
  give: ['Apply to clean, slightly damp skin.', 'Use gloves if the skin is broken or infected.', 'Avoid scented products on sensitive or inflamed skin.'],
  watch: ['Skin dryness, cracking, redness and itching.', 'Signs of infection or pressure injury.', 'Allergic reaction to ingredients.'],
  hold: ['Hold and call for rash, hives or burning.', 'Hold and call for open, weeping or infected skin.', 'Do not apply near eyes or mucous membranes.'],
  effects: ['Rarely mild irritation', 'Contact allergy', 'Folliculitis if occluded', 'SERIOUS: rare allergic reaction'],
  teach: 'Moisturize right after a lukewarm bath and avoid fragranced soaps.', alert: false, lasa: '' });

DrugGuide.add('furosemide', { aliases: ['lasix'], brand: 'Lasix', cls: 'loop diuretic',
  use: 'Removes extra fluid in heart failure, edema, kidney disease and hypertension.',
  dose: '20 to 80 mg PO daily; 20 to 80 mg IV push, repeat per response (higher in renal disease). Always follow the order.',
  give: ['IV push no faster than 20 mg/min (4 mg/min if high dose or renal impairment).', 'Give in the morning; offer toileting.', 'Protect from light; do not use discolored solution.'],
  watch: ['Weight, I&O, BP and edema before and after.', 'K+, Na+, Mg, creatinine/BUN.', 'Hearing changes with fast IV push.'],
  hold: ['Hold for SBP < 90-100 and call.', 'Hold and call for K+ < 3.5 or marked dehydration.', 'Hold and call for no urine output or rising creatinine.'],
  effects: ['Hypokalemia, hyponatremia', 'Dizziness, orthostatic hypotension', 'Frequent urination', 'SERIOUS: ototoxicity, dehydration, kidney injury'],
  teach: 'Weigh daily, rise slowly, and eat potassium foods unless restricted. Report dizziness or muscle cramps.', alert: false, lasa: 'Furosemide vs torsemide; Lasix vs Luvox.' });

DrugGuide.add('gabapentin', { aliases: ['neurontin', 'gralise'], brand: 'Neurontin', cls: 'anticonvulsant / neuropathic pain agent',
  use: 'Treats nerve pain, postherpetic neuralgia and partial seizures.',
  dose: '100 to 600 mg PO three times daily (up to 3600 mg/day); reduce in renal impairment. Always follow the order.',
  give: ['May be given with or without food.', 'Antacids reduce absorption; separate by 2 hours.', 'Do not stop suddenly.'],
  watch: ['Sedation, dizziness and fall risk.', 'Respiratory depression with opioids.', 'Renal function, mood, edema.'],
  hold: ['Hold and call for excessive sedation or RR < 12.', 'Hold and call for suicidal thoughts.', 'Hold and call if CrCl is low for dose review.'],
  effects: ['Drowsiness, dizziness', 'Peripheral edema, weight gain', 'Ataxia, blurred vision', 'SERIOUS: respiratory depression with opioids, suicidality'],
  teach: 'Avoid driving until you know how it affects you; do not stop suddenly or combine with alcohol.', alert: false, lasa: 'Gabapentin vs gabapentin enacarbil; Neurontin vs Noroxin.' });

DrugGuide.add('glucagon', { aliases: ['glucagen', 'gvoke'], brand: 'GlucaGen / Gvoke', cls: 'pancreatic hormone (glucose raising)',
  use: 'Treats severe hypoglycemia when the patient cannot take sugar or has no IV.',
  dose: '1 mg IM, SQ or IV (0.5 mg for some products or children); may repeat in 15 minutes. Always follow the order.',
  give: ['Reconstitute with supplied diluent; use immediately.', 'Turn the patient on the side after giving; nausea and vomiting are common.', 'Give oral carbohydrate once awake, to restore glycogen.'],
  watch: ['Glucose at 15 minutes and then every hour as ordered.', 'Level of consciousness and aspiration risk.', 'Potassium after dosing.'],
  hold: ['Call if glucose does not rise in 15 minutes.', 'Call if glycogen stores are depleted (starvation, adrenal failure).', 'Call for pheochromocytoma or insulinoma history.'],
  effects: ['Nausea, vomiting', 'Headache', 'Transient tachycardia', 'SERIOUS: rebound hypoglycemia if not fed'],
  teach: 'Family should learn how to give it. Eat a snack when awake and report low sugar episodes.', alert: false, lasa: 'Glucagon vs Glucotrol.' });

DrugGuide.add('glycopyrrolate', { aliases: ['robinul', 'cuvposa'], brand: 'Robinul', cls: 'anticholinergic',
  use: 'Reduces drooling and secretions and treats peptic ulcer; used before anesthesia.',
  dose: 'PO 1 to 2 mg two to three times daily; IV/IM 0.1 to 0.2 mg for secretions. Always follow the order.',
  give: ['Give PO 30 minutes before meals if used for ulcer.', 'IV push slowly with cardiac monitoring.', 'Offer mouth care.'],
  watch: ['Heart rate, BP.', 'Urine output and bowel sounds.', 'Mental status and temperature.'],
  hold: ['Hold and call for HR > 120 or urinary retention.', 'Hold and call for ileus, glaucoma or obstruction.', 'Hold and call for new confusion.'],
  effects: ['Dry mouth, blurred vision', 'Constipation, urinary retention', 'Flushing, reduced sweating', 'SERIOUS: tachycardia, heat stroke, delirium'],
  teach: 'It dries the mouth and may blur vision; avoid overheating and use sugarless gum.', alert: false, lasa: 'Glycopyrrolate vs glyburide.' });

DrugGuide.add('guaifenesin', { aliases: ['mucinex', 'robitussin'], brand: 'Mucinex', cls: 'expectorant',
  use: 'Thins mucus to make a cough more productive.',
  dose: '200 to 400 mg PO every 4 hours, or ER 600 to 1200 mg every 12 hours (max 2400 mg/day). Always follow the order.',
  give: ['Give with a full glass of water.', 'Swallow ER tablets whole.', 'Check combination products for added drugs.'],
  watch: ['Cough and sputum thickness.', 'Lung sounds and oxygenation.', 'Hydration.'],
  hold: ['Hold and call if cough lasts > 7 days with fever or rash.', 'Hold and call for productive cough with blood.', 'Hold and call for poor fluid intake.'],
  effects: ['Nausea, vomiting', 'Dizziness, headache', 'Rash', 'SERIOUS: rare allergic reaction'],
  teach: 'Drink plenty of fluids to help thin mucus. See a provider if symptoms persist.', alert: false, lasa: 'Mucinex vs Mucomyst.' });

DrugGuide.add('heparin', { aliases: ['heparin sodium', 'heparin drip', 'heparin infusion', 'heparin flush'], brand: 'Heparin', cls: 'anticoagulant',
  use: 'Prevents and treats blood clots (DVT, PE, ACS, atrial fibrillation) and keeps lines patent.',
  dose: 'Prophylaxis 5,000 units SQ q8-12h; treatment bolus about 80 units/kg then 18 units/kg/h IV, adjusted by protocol (aPTT or anti-Xa). Always follow the order.',
  give: ['Independent double-check of dose, concentration and pump (high-alert).', 'SQ: abdomen, no aspiration or rubbing.', 'Use the protocol and verify the correct vial strength.'],
  watch: ['aPTT or anti-Xa per protocol (aPTT goal about 1.5 to 2.5x control); platelets and Hgb.', 'Bleeding: gums, urine, stool, neuro checks.', 'Protamine sulfate is the antidote.'],
  hold: ['Hold and call for platelets < 100,000 or drop > 50%.', 'Hold and call for active bleeding or supratherapeutic aPTT.', 'Hold and call before procedures.'],
  effects: ['Bruising, bleeding', 'Injection site hematoma', 'SERIOUS: major hemorrhage', 'SERIOUS: heparin-induced thrombocytopenia (HIT)'],
  teach: 'Report any bleeding, black stools or severe headache. Use soft toothbrush and electric razor.', alert: true, lasa: 'Heparin vs Hespan; 10 units/mL flush vs 10,000 units/mL vial.' });

DrugGuide.add('hydralazine', { aliases: ['apresoline'], brand: 'Apresoline', cls: 'direct vasodilator',
  use: 'Lowers blood pressure in hypertension, hypertensive urgency and heart failure.',
  dose: 'PO 10 to 50 mg 3 to 4 times daily; IV/IM 10 to 20 mg every 4 to 6 hours. Always follow the order.',
  give: ['IV push slowly over 1 to 2 minutes; check BP before.', 'PO with food for consistent absorption.', 'Often given with a beta blocker to avoid reflex tachycardia.'],
  watch: ['BP and HR before and 15 to 30 minutes after IV.', 'Headache, chest pain, fluid retention.', 'Lupus-like signs (joint pain, rash) with long use.'],
  hold: ['Hold for SBP < 100 or per order parameters.', 'Hold and call for HR > 110 or chest pain.', 'Hold and call for severe hypotension.'],
  effects: ['Headache, flushing', 'Tachycardia, palpitations', 'Dizziness, edema', 'SERIOUS: hypotension, angina, drug-induced lupus'],
  teach: 'Rise slowly and report chest pain, swelling or joint pain.', alert: false, lasa: 'Hydralazine vs hydroxyzine.' });

DrugGuide.add('hydrocortisone', { aliases: ['cortef', 'solu-cortef', 'hydrocortisone sodium succinate', 'hydrocortisone cream'], brand: 'Cortef / Solu-Cortef', cls: 'corticosteroid',
  use: 'Replaces cortisol in adrenal insufficiency and treats shock, allergic reactions and inflammation.',
  dose: 'PO 15 to 30 mg/day divided; IV 50 to 100 mg every 6 to 8 hours (stress dose 100 mg bolus). Always follow the order.',
  give: ['PO with food or milk.', 'IV push over 30 seconds to several minutes, or infuse as ordered.', 'Do not stop suddenly after long use.'],
  watch: ['Glucose, BP and fluid status.', 'Sodium, potassium.', 'Mood and infection signs.'],
  hold: ['Hold and call for uncontrolled glucose > 300.', 'Hold and call for active untreated infection (except in shock or adrenal crisis).', 'Do not hold in adrenal crisis; call provider with questions.'],
  effects: ['Hyperglycemia, insomnia', 'Fluid retention, mood changes', 'Increased appetite', 'SERIOUS: adrenal suppression, infection, GI bleeding'],
  teach: 'Do not stop suddenly and tell all providers you take steroids. Carry a steroid card.', alert: false, lasa: 'Hydrocortisone vs hydroxyzine; hydrocortisone vs fludrocortisone.' });

DrugGuide.add('hydromorphone', { aliases: ['dilaudid'], brand: 'Dilaudid', cls: 'opioid analgesic',
  use: 'Treats moderate to severe pain.',
  dose: 'PO 2 to 4 mg every 4 to 6 hours; IV 0.2 to 1 mg every 2 to 3 hours as needed. Always follow the order.',
  give: ['Verify concentration; hydromorphone is about 5-7x stronger than morphine per mg.', 'IV push slowly over 2 to 5 minutes.', 'Assess pain and sedation before and 15 to 30 minutes after IV.'],
  watch: ['RR, sedation scale (POSS) and oxygen saturation.', 'Pain score, BP and bowel function.', 'Naloxone should be available.'],
  hold: ['Hold for RR < 10-12 or excessive sedation.', 'Hold and call for SBP < 90 or SpO2 low.', 'Hold and call for new confusion or unarousable.'],
  effects: ['Sedation, nausea', 'Constipation, itching', 'Dizziness, hypotension', 'SERIOUS: respiratory depression'],
  teach: 'Report poor pain control, do not mix with alcohol or sedatives, and ask for help to get up. Constipation prevention is key.', alert: true, lasa: 'Hydromorphone vs morphine; Dilaudid vs Demerol. Check concentration.' });

DrugGuide.add('hydroxychloroquine', { aliases: ['plaquenil'], brand: 'Plaquenil', cls: 'antimalarial / DMARD',
  use: 'Treats lupus and rheumatoid arthritis, and prevents or treats malaria.',
  dose: '200 to 400 mg PO daily (max 5 mg/kg/day). Always follow the order.',
  give: ['Give with food or milk.', 'Do not crush if possible; very bitter.', 'Keep away from children (overdose is dangerous).'],
  watch: ['Baseline and yearly eye exam.', 'ECG/QTc if on other QT drugs.', 'CBC, glucose and rash.'],
  hold: ['Hold and call for vision changes.', 'Hold and call for QTc prolongation or syncope.', 'Hold and call for severe rash or hypoglycemia.'],
  effects: ['Nausea, diarrhea, abdominal cramps', 'Rash, itching', 'Headache', 'SERIOUS: retinal toxicity, QT prolongation'],
  teach: 'Get regular eye exams and report vision changes. Takes weeks to months to work.', alert: false, lasa: 'Hydroxychloroquine vs hydroxyzine.' });

DrugGuide.add('hydroxyurea', { aliases: ['hydrea', 'droxia', 'siklos'], brand: 'Hydrea / Droxia', cls: 'antimetabolite (chemotherapy)',
  use: 'Reduces pain crises in sickle cell disease and treats some leukemias and myeloproliferative disorders.',
  dose: 'Sickle cell starting 15 mg/kg PO daily, titrated by blood counts; cancer doses vary. Always follow the order.',
  give: ['Hazardous drug: wear gloves and do not open capsules.', 'Swallow capsules whole with water.', 'Pregnancy precautions for staff and patient.'],
  watch: ['CBC with differential, platelets and reticulocytes.', 'Renal and liver function.', 'Infection, bleeding and skin changes.'],
  hold: ['Hold and call for ANC < 2,000 or platelets < 80,000 (per protocol).', 'Hold and call for fever or infection.', 'Hold and call for severe rash or skin ulcers.'],
  effects: ['Nausea, mouth sores', 'Skin darkening, hair thinning', 'Drowsiness', 'SERIOUS: bone marrow suppression, secondary cancers, teratogenicity'],
  teach: 'Use birth control and avoid sun. Get regular blood tests and report fever or bleeding.', alert: true, lasa: 'Hydroxyurea vs hydroxyzine.' });

DrugGuide.add('ibrutinib', { aliases: ['imbruvica'], brand: 'Imbruvica', cls: 'BTK inhibitor (targeted oral chemotherapy)',
  use: 'Treats chronic lymphocytic leukemia, mantle cell lymphoma and Waldenstrom macroglobulinemia.',
  dose: '420 mg PO once daily (CLL) or 560 mg for some lymphomas. Always follow the order.',
  give: ['Swallow whole with water at the same time daily; do not crush or open.', 'Avoid grapefruit and Seville oranges.', 'Hazardous drug; use gloves.'],
  watch: ['Bleeding, bruising; hold around surgery per provider.', 'HR/rhythm for atrial fibrillation; BP.', 'CBC and infection signs.'],
  hold: ['Hold and call for major bleeding or new atrial fibrillation.', 'Hold and call for grade 3 or higher toxicity per provider.', 'Hold and call before procedures.'],
  effects: ['Diarrhea, fatigue', 'Bruising, rash', 'Muscle and joint pain', 'SERIOUS: bleeding, atrial fibrillation, infection, cytopenias'],
  teach: 'Take daily at the same time, avoid grapefruit and report bleeding, palpitations or fever.', alert: true, lasa: '' });

DrugGuide.add('ibuprofen', { aliases: ['motrin', 'advil'], brand: 'Motrin / Advil', cls: 'NSAID',
  use: 'Relieves pain, fever and inflammation.',
  dose: '200 to 800 mg PO every 6 to 8 hours (max 3200 mg/day Rx; 1200 mg OTC). Always follow the order.',
  give: ['Give with food or milk.', 'Use the lowest dose for the shortest time.', 'Avoid with other NSAIDs; check aspirin use.'],
  watch: ['Pain and temperature response.', 'Creatinine, BP and edema; GI bleed signs.', 'Platelets/bleeding if on anticoagulants.'],
  hold: ['Hold and call for GI bleeding, ulcer or kidney injury.', 'Hold and call for SBP > 160 or heart failure signs.', 'Hold and call for NSAID or aspirin allergy.'],
  effects: ['Dyspepsia, nausea', 'Fluid retention, higher BP', 'Dizziness', 'SERIOUS: GI bleeding, kidney injury, MI or stroke'],
  teach: 'Take with food and do not combine with other NSAIDs. Report black stools or less urine.', alert: false, lasa: 'Ibuprofen vs Indocin.' });

DrugGuide.add('icosapent ethyl', { aliases: ['vascepa', 'fish oil'], brand: 'Vascepa', cls: 'omega-3 fatty acid (triglyceride lowering)',
  use: 'Lowers triglycerides and reduces cardiovascular events in high-risk patients.',
  dose: '2 g (2 capsules) PO twice daily with food. Always follow the order.',
  give: ['Give with food, swallow capsules whole.', 'Do not crush or chew.', 'Check fish or shellfish allergy.'],
  watch: ['Triglyceride/lipid panel.', 'Heart rhythm: atrial fibrillation.', 'Bleeding if on anticoagulants.'],
  hold: ['Hold and call for new palpitations or atrial fibrillation.', 'Hold and call for bleeding.', 'Hold and call for allergic reaction.'],
  effects: ['Joint pain, muscle pain', 'Constipation, nausea', 'Taste change', 'SERIOUS: atrial fibrillation, bleeding'],
  teach: 'Take with meals and keep up diet and exercise changes. Report palpitations or bleeding.', alert: false, lasa: '' });

DrugGuide.add('insulin glargine', { aliases: ['lantus', 'basaglar', 'semglee', 'toujeo'], brand: 'Lantus / Basaglar', cls: 'long-acting basal insulin',
  use: 'Provides background (basal) insulin for diabetes control over 24 hours.',
  dose: 'Individualized once daily SQ, often 0.2 to 0.5 units/kg/day, per order. Always follow the order.',
  give: ['Give SQ at the same time each day; do not mix with other insulins.', 'Do not give IV; clear solution only.', 'Independent double-check; check glucose first.'],
  watch: ['Blood glucose before and as ordered; hypoglycemia can occur overnight.', 'Potassium, intake and renal function.', 'Signs of hypoglycemia: sweating, shakiness, confusion.'],
  hold: ['Hold and call for glucose < 70 or NPO without a dose plan.', 'Do not skip basal insulin without calling the provider.', 'Hold and call if intake is poor.'],
  effects: ['Hypoglycemia', 'Weight gain', 'Injection site reaction, lipodystrophy', 'SERIOUS: severe hypoglycemia, hypokalemia'],
  teach: 'Take at the same time daily even if not eating and rotate sites. Know low-sugar signs and treatment.', alert: true, lasa: 'Lantus vs Lente; glargine vs glulisine; Toujeo is U-300.' });

DrugGuide.add('insulin lispro', { aliases: ['humalog', 'admelog', 'lyumjev'], brand: 'Humalog', cls: 'rapid-acting insulin',
  use: 'Controls mealtime and high glucose in diabetes.',
  dose: 'Mealtime or correction SQ dose per sliding scale or ratio, given 0 to 15 minutes before eating. Always follow the order.',
  give: ['Give right before the meal and verify the patient will eat.', 'Check glucose first; independent double-check per policy.', 'Do not mix unless ordered; use insulin syringe for U-100.'],
  watch: ['Glucose before and 1 to 2 hours after meals.', 'Meal intake and symptoms of hypoglycemia.', 'Potassium.'],
  hold: ['Hold meal dose and call if the patient is NPO or not eating.', 'Hold and call for glucose < 70.', 'Hold and call for repeated lows or vomiting.'],
  effects: ['Hypoglycemia', 'Injection-site reaction', 'Weight gain', 'SERIOUS: severe hypoglycemia, hypokalemia'],
  teach: 'Eat soon after injecting and carry fast sugar. Recognize and treat low sugar.', alert: true, lasa: 'Humalog vs Humulin; Humalog U-100 vs U-200.' });

DrugGuide.add('insulin regular', { aliases: ['humulin r', 'novolin r', 'regular insulin', 'insulin regular 100 units/100 ml 0 9% nacl', 'insulin drip', 'insulin infusion'], brand: 'Humulin R / Novolin R', cls: 'short-acting insulin',
  use: 'Controls high glucose; the only insulin given IV (infusion for DKA and critical illness).',
  dose: 'SQ per sliding scale or 0.1 units/kg/h IV infusion (typically 1 unit/mL in NS), titrated by protocol. Always follow the order.',
  give: ['Use an insulin syringe and verify units; infusion on a pump with independent double-check.', 'Standard 100 units/100 mL NS; flush tubing first per policy.', 'SQ: give 30 minutes before meals.'],
  watch: ['Glucose every 1 hour on infusion, per protocol; potassium (replace if < 3.3-5.3 per protocol).', 'Signs of hypoglycemia and fluid status.', 'Transition to SQ insulin before stopping the drip.'],
  hold: ['Hold and call for glucose < 70 (stop/adjust infusion per protocol).', 'Hold and call for K+ < 3.3 before IV insulin.', 'Hold SQ dose if NPO per order.'],
  effects: ['Hypoglycemia', 'Hypokalemia', 'Weight gain', 'SERIOUS: severe hypoglycemia, hypokalemia'],
  teach: 'Explain why insulin is needed and how to recognize low blood sugar.', alert: true, lasa: 'Regular insulin vs Humalog; never use a non-insulin syringe; U-100 vs U-500.' });

DrugGuide.add('ipratropium-albuterol', { aliases: ['duoneb', 'combivent', 'ipratropium albuterol', 'ipratropium bromide-albuterol'], brand: 'DuoNeb / Combivent', cls: 'anticholinergic + short-acting beta agonist',
  use: 'Relieves bronchospasm in COPD and asthma exacerbations.',
  dose: 'Nebulizer 3 mL (0.5 mg ipratropium / 3 mg albuterol) every 4 to 6 hours, more often in acute exacerbations. Always follow the order.',
  give: ['Nebulize over 10 to 15 minutes with mouthpiece or mask; sit upright.', 'Keep drug out of the eyes.', 'Assess lung sounds before and after.'],
  watch: ['Lung sounds, RR, SpO2 and work of breathing.', 'HR, tremor and potassium.', 'Blurred vision or eye pain.'],
  hold: ['Hold and call for HR > 120 or chest pain.', 'Hold and call for paradoxical wheeze.', 'Hold and call for glaucoma symptoms.'],
  effects: ['Tremor, nervousness, palpitations', 'Dry mouth, cough', 'Headache', 'SERIOUS: paradoxical bronchospasm, hypokalemia, arrhythmia'],
  teach: 'Rinse mouth after and report chest pain, fast heartbeat or worsening breathing.', alert: false, lasa: 'DuoNeb vs Duoneb-like names; ipratropium vs Atrovent.' });

DrugGuide.add('ipratropium', { aliases: ['atrovent', 'ipratropium bromide'], brand: 'Atrovent', cls: 'inhaled anticholinergic bronchodilator',
  use: 'Opens airways in COPD and asthma exacerbations.',
  dose: 'Nebulizer 0.5 mg every 6 to 8 hours (more often in acute illness); MDI 2 puffs 4 times daily. Always follow the order.',
  give: ['Avoid contact with the eyes (mask fit).', 'Sit upright and take slow deep breaths.', 'Not for rescue use alone; onset slower than albuterol.'],
  watch: ['Lung sounds, RR and SpO2.', 'Dry mouth, cough, urinary retention.', 'Vision changes or eye pain.'],
  hold: ['Hold and call for acute eye pain or halos.', 'Hold and call for paradoxical bronchospasm.', 'Hold and call for severe allergic reaction (soy/peanut caution with some MDIs).'],
  effects: ['Dry mouth, cough', 'Headache, dizziness', 'Urinary retention', 'SERIOUS: paradoxical bronchospasm, narrow-angle glaucoma'],
  teach: 'Protect the eyes and rinse the mouth. It is a maintenance bronchodilator.', alert: false, lasa: 'Atrovent vs Alupent.' });

DrugGuide.add('isoniazid', { aliases: ['inh', 'nydrazid'], brand: 'Nydrazid', cls: 'antituberculosis antibiotic',
  use: 'Treats and prevents tuberculosis.',
  dose: '300 mg PO once daily (5 mg/kg); 15 mg/kg twice weekly in some regimens. Always follow the order.',
  give: ['Give on an empty stomach (1 hour before or 2 hours after food); with food if GI upset.', 'Give pyridoxine (B6) with it as ordered.', 'Separate from aluminum antacids by 1 hour.'],
  watch: ['Liver tests (AST/ALT) baseline and monthly.', 'Numbness or tingling in hands and feet.', 'Jaundice, dark urine, nausea; alcohol use.'],
  hold: ['Hold and call for AST/ALT > 3x normal with symptoms (or 5x without).', 'Hold and call for jaundice or numbness.', 'Hold and call for vision changes.'],
  effects: ['Nausea, abdominal pain', 'Peripheral neuropathy', 'Elevated liver enzymes', 'SERIOUS: hepatitis, optic neuritis, seizures in overdose'],
  teach: 'Avoid alcohol, take every dose for months, and report yellow skin, dark urine or tingling.', alert: false, lasa: 'Isoniazid vs INH-related names; INH vs Imuran.' });

DrugGuide.add('ketorolac', { aliases: ['toradol'], brand: 'Toradol', cls: 'NSAID (injectable)',
  use: 'Short-term treatment (up to 5 days total) of moderate to severe pain.',
  dose: '15 to 30 mg IV/IM every 6 hours (max 120 mg/day; 15 mg and 60 mg/day if age 65+ or < 50 kg); PO 10 mg. Always follow the order.',
  give: ['IV push over at least 15 seconds; IM deep.', 'Check kidney function, bleeding risk and hydration first.', 'Total duration of IV/IM plus PO: no more than 5 days.'],
  watch: ['Pain relief, creatinine and urine output.', 'Signs of GI bleeding or other bleeding.', 'BP, edema.'],
  hold: ['Hold and call for creatinine rise, bleeding, or active ulcer.', 'Hold and call for NSAID allergy or asthma triggered by aspirin.', 'Hold and call if on anticoagulants or pre-op.'],
  effects: ['Dyspepsia, nausea', 'Dizziness, headache', 'Fluid retention', 'SERIOUS: GI bleeding, acute kidney injury, bleeding'],
  teach: 'Short course only. Report black stools, less urine or severe stomach pain.', alert: false, lasa: 'Ketorolac vs ketamine (note Toradol vs Tegretol).' });

DrugGuide.add('labetalol', { aliases: ['trandate', 'normodyne'], brand: 'Trandate', cls: 'alpha/beta blocker',
  use: 'Lowers blood pressure in hypertension, hypertensive emergency and pregnancy hypertension.',
  dose: 'PO 100 to 400 mg twice daily; IV 10 to 20 mg slow push, then 20 to 80 mg q10 min or infusion 0.5 to 2 mg/min (max 300 mg). Always follow the order.',
  give: ['IV push slowly over 2 minutes with the patient lying down.', 'Monitor BP and HR every 5 to 10 minutes for IV.', 'PO with food.'],
  watch: ['BP and HR before and after.', 'Glucose in diabetics (masks lows).', 'Respiratory status and heart failure signs.'],
  hold: ['Hold for HR < 60 or SBP < 100 and call.', 'Hold and call for second- or third-degree heart block.', 'Hold and call for wheezing or acute decompensated heart failure.'],
  effects: ['Dizziness, fatigue', 'Bradycardia, orthostatic hypotension', 'Nausea, scalp tingling', 'SERIOUS: heart block, bronchospasm, severe hypotension'],
  teach: 'Rise slowly and do not stop suddenly. Check pulse before doses.', alert: false, lasa: 'Labetalol vs lamotrigine; Trandate vs Tridil.' });

DrugGuide.add('lactated ringer s', { aliases: ["lactated ringer's", 'lactated ringers', 'ringers lactate', 'lr'], brand: 'LR', cls: 'balanced isotonic crystalloid',
  use: 'Replaces fluid and electrolytes in dehydration, surgery, burns and trauma.',
  dose: 'Rate per order, often 75 to 125 mL/h maintenance or bolus 500 to 1000 mL. Always follow the order.',
  give: ['Check the label and expiration; use a pump for infusions.', 'Contains K+ (4 mEq/L), Ca2+ and lactate; do not mix with blood or ceftriaxone in the same line.', 'Use cautiously in liver failure and severe lactic acidosis.'],
  watch: ['I&O, weight, lung sounds and edema (overload).', 'BP, HR and IV site.', 'Electrolytes and kidney function.'],
  hold: ['Slow/stop and call for crackles, dyspnea or edema.', 'Hold and call for IV infiltration.', 'Call for K+ > 5.0 or significant lactic acidosis.'],
  effects: ['Fluid overload', 'Edema', 'Electrolyte imbalance', 'SERIOUS: pulmonary edema, hyperkalemia in renal failure'],
  teach: 'Report shortness of breath, swelling or pain at the IV site.', alert: false, lasa: '' });

DrugGuide.add('lactated ringer s with potassium chloride 20 meq/l', { aliases: ["lactated ringer's with potassium chloride", 'lr with kcl', 'lr with potassium', 'lactated ringer s with potassium'], brand: 'LR + KCl 20', cls: 'isotonic crystalloid with potassium',
  use: 'Replaces fluid and provides maintenance potassium.',
  dose: 'Rate per order, usually 75 to 125 mL/h; do not exceed 10 mEq/h of potassium on a peripheral line without an order. Always follow the order.',
  give: ['Confirm potassium concentration on the bag label and use a pump.', 'Verify urine output before starting and continuing.', 'Never give as IV push or a bolus.'],
  watch: ['Serum K+ (goal 3.5-5.0), creatinine and urine output.', 'ECG changes: peaked T waves, arrhythmia.', 'IV site for pain (potassium irritates veins) and fluid overload.'],
  hold: ['Hold and call for K+ > 5.0 or urine output < 30 mL/h.', 'Hold and call for IV infiltration.', 'Hold and call for crackles, dyspnea or edema.'],
  effects: ['Vein irritation, burning', 'Fluid overload', 'Hyperkalemia', 'SERIOUS: cardiac arrhythmia from hyperkalemia'],
  teach: 'Report burning at the IV site, weakness, palpitations or shortness of breath.', alert: true, lasa: 'Potassium-containing vs plain fluids; double-check bag label.' });

DrugGuide.add('lactulose', { aliases: ['enulose', 'kristalose'], brand: 'Enulose', cls: 'osmotic laxative / ammonia reducer',
  use: 'Treats constipation and lowers ammonia in hepatic encephalopathy.',
  dose: 'Constipation 15 to 30 mL PO daily; hepatic encephalopathy 20 to 30 g (30-45 mL) 3 to 4 times daily titrated to 2 to 3 soft stools. Always follow the order.',
  give: ['May mix with juice, water or milk.', 'Titrate to 2 to 3 soft stools per day for encephalopathy.', 'Encourage fluids; can also be given rectally.'],
  watch: ['Number and consistency of stools.', 'Mental status, asterixis, ammonia level.', 'Fluid and electrolyte status (Na, K).'],
  hold: ['Hold and call for more than 4 loose stools per day or dehydration.', 'Hold and call for abdominal pain or suspected obstruction.', 'Call if mental status worsens.'],
  effects: ['Gas, bloating, cramps', 'Diarrhea', 'Nausea', 'SERIOUS: dehydration, hypernatremia, electrolyte loss'],
  teach: 'Goal is 2 to 3 soft stools daily. Keep drinking fluids and report diarrhea or confusion.', alert: false, lasa: 'Lactulose vs lactose.' });

DrugGuide.add('lamotrigine', { aliases: ['lamictal'], brand: 'Lamictal', cls: 'anticonvulsant / mood stabilizer',
  use: 'Treats seizures and bipolar disorder.',
  dose: 'Titrated slowly: 25 mg daily start, usual 100 to 400 mg/day (lower with valproate). Always follow the order.',
  give: ['Never restart at full dose after missing > 5 half-lives; call the provider.', 'Titrate on the schedule exactly.', 'Give with or without food.'],
  watch: ['Skin: any new rash, especially in the first 2 months.', 'Seizure control and mood.', 'Interactions with valproate or estrogen-containing contraceptives.'],
  hold: ['Hold and call for ANY rash, fever or mouth sores (Stevens-Johnson risk).', 'Hold and call after missed doses for restart guidance.', 'Hold and call for suicidal thoughts.'],
  effects: ['Dizziness, headache', 'Double vision, nausea', 'Rash', 'SERIOUS: Stevens-Johnson syndrome/TEN, suicidality, hemophagocytic syndrome'],
  teach: 'Report any rash immediately. Do not stop suddenly and keep to the titration schedule.', alert: false, lasa: 'Lamotrigine vs labetalol, lamivudine, levothyroxine; Lamictal vs Lamisil.' });

DrugGuide.add('latanoprost 0 005% ophthalmic', { aliases: ['latanoprost', 'xalatan'], brand: 'Xalatan', cls: 'prostaglandin analog (eye drop)',
  use: 'Lowers eye pressure in glaucoma and ocular hypertension.',
  dose: 'One drop in the affected eye(s) once daily in the evening. Always follow the order.',
  give: ['Wash hands; do not touch the dropper tip to the eye.', 'Remove contact lenses, reinsert after 15 minutes.', 'Press the inner corner of the eye for 1 minute; wait 5 minutes between drops.'],
  watch: ['Eye redness, itching and vision.', 'Iris or lash changes.', 'Intraocular pressure with eye visits.'],
  hold: ['Hold and call for eye pain, discharge or vision loss.', 'Hold and call for active eye infection.', 'Hold and call for allergic reaction.'],
  effects: ['Eye redness, stinging', 'Longer, darker eyelashes', 'Darkening of the iris', 'SERIOUS: macular edema, eye infection'],
  teach: 'Use every evening. Store unopened bottle in the refrigerator. Eye color may permanently darken.', alert: false, lasa: 'Latanoprost vs travoprost; Xalatan vs Xalkori.' });

DrugGuide.add('lenalidomide', { aliases: ['revlimid'], brand: 'Revlimid', cls: 'immunomodulator (oral chemotherapy)',
  use: 'Treats multiple myeloma, myelodysplastic syndrome and some lymphomas.',
  dose: '10 to 25 mg PO daily for 21 of 28 days (cycle); adjust per counts and kidney function. Always follow the order.',
  give: ['Hazardous: wear gloves, do not open capsules; REMS program.', 'Swallow whole with water, at the same time daily.', 'Anticoagulant or aspirin prophylaxis against clots per provider.'],
  watch: ['CBC weekly (neutropenia, thrombocytopenia).', 'Signs of DVT/PE and stroke.', 'Rash, thyroid and renal function.'],
  hold: ['Hold and call for ANC < 1,000 or platelets < 50,000 (per protocol).', 'Hold and call for suspected clot, fever or severe rash.', 'Hold and call for positive pregnancy test.'],
  effects: ['Fatigue, diarrhea, rash', 'Neutropenia, low platelets', 'Muscle cramps', 'SERIOUS: blood clots, birth defects (teratogenic), bone marrow suppression'],
  teach: 'Must use two forms of birth control and never share capsules. Report leg swelling, chest pain, fever.', alert: true, lasa: 'Lenalidomide vs thalidomide / pomalidomide.' });

DrugGuide.add('levetiracetam', { aliases: ['keppra'], brand: 'Keppra', cls: 'anticonvulsant',
  use: 'Prevents and treats seizures.',
  dose: '500 to 1500 mg PO or IV every 12 hours (max 3000 mg/day); reduce in renal impairment. Always follow the order.',
  give: ['IV: dilute and infuse over 15 minutes.', 'PO with or without food; swallow ER tablets whole.', 'Do not stop suddenly.'],
  watch: ['Seizure activity and safety.', 'Mood, irritability, depression or suicidal thoughts.', 'Renal function and sedation.'],
  hold: ['Hold and call for severe mood change or suicidal ideation.', 'Hold and call for rash or fever.', 'Never skip doses without calling the provider.'],
  effects: ['Drowsiness, dizziness', 'Irritability, mood changes', 'Weakness', 'SERIOUS: suicidality, psychosis, severe rash'],
  teach: 'Do not stop suddenly. Report mood changes and use seizure precautions.', alert: false, lasa: 'Keppra vs Kaletra; levetiracetam vs levofloxacin.' });

DrugGuide.add('levothyroxine', { aliases: ['synthroid', 'levoxyl', 'unithroid', 'euthyrox'], brand: 'Synthroid', cls: 'thyroid hormone',
  use: 'Replaces thyroid hormone in hypothyroidism.',
  dose: '25 to 200 mcg PO once daily, about 1.6 mcg/kg/day; IV is about 75% of oral dose. Always follow the order.',
  give: ['Give on an empty stomach 30 to 60 minutes before breakfast with water.', 'Separate from calcium, iron and antacids by 4 hours.', 'Same brand every time.'],
  watch: ['TSH every 6 to 8 weeks after changes.', 'HR, BP, weight and temperature.', 'Chest pain and palpitations, especially in cardiac patients.'],
  hold: ['Hold for HR > 100-110 or chest pain and call.', 'Hold and call for signs of hyperthyroidism (tremor, sweating).', 'Hold and call if unable to take PO long-term (IV conversion).'],
  effects: ['Palpitations, anxiety', 'Heat intolerance, sweating', 'Weight loss, insomnia', 'SERIOUS: arrhythmia, angina, bone loss with over-replacement'],
  teach: 'Take every morning on an empty stomach and do not stop. Lifelong in most patients.', alert: false, lasa: 'Levothyroxine vs liothyronine; Synthroid vs Symmetrel.' });

DrugGuide.add('lidocaine 4%', { aliases: ['lidocaine', 'lidocaine patch', 'lidocaine cream', 'lmx', 'xylocaine'], brand: 'LMX4 / Xylocaine', cls: 'local anesthetic (topical)',
  use: 'Numbs skin before needle sticks or procedures and relieves minor pain.',
  dose: 'Apply a thin layer to intact skin as ordered (wait 20 to 30 minutes before a procedure; do not exceed labeled area or duration). Always follow the order.',
  give: ['Apply to intact skin only; cover with an occlusive dressing if ordered.', 'Wash hands; avoid eyes and mucous membranes.', 'Remove before MRI if a patch.'],
  watch: ['Skin for redness or irritation.', 'Pain relief and numbness at the site.', 'Signs of systemic toxicity with large areas: dizziness, ringing in ears.'],
  hold: ['Hold and call for local anesthetic allergy.', 'Hold and call for broken or infected skin.', 'Hold and call if total dose exceeds recommended area.'],
  effects: ['Skin redness, mild burning', 'Numbness', 'Itching', 'SERIOUS: methemoglobinemia, allergic reaction, toxicity if overused'],
  teach: 'Use only on intact skin and do not heat the area. Report dizziness, ringing in ears or rash.', alert: false, lasa: 'Lidocaine with vs without epinephrine; topical 4% vs IV lidocaine 2%.' });

DrugGuide.add('lisinopril', { aliases: ['zestril', 'prinivil'], brand: 'Zestril / Prinivil', cls: 'ACE inhibitor',
  use: 'Treats hypertension, heart failure and protects kidneys after MI or in diabetes.',
  dose: '5 to 40 mg PO once daily (start 2.5 to 10 mg). Always follow the order.',
  give: ['Give with or without food, same time daily.', 'Check BP before each dose.', 'Avoid potassium supplements and salt substitutes unless ordered.'],
  watch: ['BP and orthostatic changes.', 'K+, creatinine/BUN.', 'Cough, lip or tongue swelling.'],
  hold: ['Hold for SBP < 100 and call.', 'Hold and call for K+ > 5.0-5.5 or rising creatinine.', 'Hold and call for angioedema (face, lips, tongue swelling) and pregnancy.'],
  effects: ['Dry cough', 'Dizziness, hypotension', 'Hyperkalemia', 'SERIOUS: angioedema, kidney injury, fetal harm'],
  teach: 'Rise slowly. Report cough, facial swelling or fainting; avoid pregnancy.', alert: false, lasa: 'Lisinopril vs fosinopril/lorazepam; Zestril vs Zetia, Zestoretic.' });

DrugGuide.add('lithium carbonate er', { aliases: ['lithium', 'lithium carbonate', 'lithobid', 'eskalith'], brand: 'Lithobid', cls: 'mood stabilizer',
  use: 'Treats and prevents mania in bipolar disorder.',
  dose: '300 to 600 mg PO two to three times daily; ER 450 to 900 mg twice daily; titrate to level. Always follow the order.',
  give: ['Swallow ER tablets whole; give with food.', 'Keep fluid and sodium intake steady (2 to 3 L/day).', 'Draw trough level 12 hours after the last dose.'],
  watch: ['Lithium level: goal 0.6 to 1.2 mEq/L (toxic > 1.5).', 'Kidney, thyroid function, Na+.', 'Tremor, GI upset, confusion, and hydration.'],
  hold: ['Hold and call for level > 1.2-1.5 or signs of toxicity.', 'Hold and call for vomiting, diarrhea, dehydration, or low sodium.', 'Hold and call if on NSAIDs or ACE inhibitors (interaction).'],
  effects: ['Fine tremor, thirst, polyuria', 'Nausea, weight gain', 'Hypothyroidism', 'SERIOUS: lithium toxicity (coarse tremor, ataxia, confusion, seizures)'],
  teach: 'Keep salt and fluid intake steady, avoid NSAIDs, and keep blood level checks. Stop and call for vomiting, diarrhea or unsteadiness.', alert: false, lasa: 'Lithium vs Lithostat; Lithobid vs Levbid.' });

DrugGuide.add('loperamide', { aliases: ['imodium'], brand: 'Imodium', cls: 'antidiarrheal (opioid receptor agonist)',
  use: 'Slows diarrhea.',
  dose: '4 mg PO first dose then 2 mg after each loose stool (max 16 mg/day Rx; 8 mg OTC). Always follow the order.',
  give: ['Give after loose stools; encourage fluids.', 'Do not use if bloody stool, high fever, or suspected infection (C. diff).', 'Do not exceed daily maximum.'],
  watch: ['Stool frequency and consistency.', 'Hydration, abdominal distention.', 'ECG/QT if high doses.'],
  hold: ['Hold and call for bloody diarrhea, fever or suspected C. difficile.', 'Hold and call for abdominal distention or no stools (ileus).', 'Hold and call for syncope or palpitations.'],
  effects: ['Constipation, cramps', 'Dizziness, drowsiness', 'Nausea', 'SERIOUS: toxic megacolon, QT prolongation and cardiac arrest at very high doses'],
  teach: 'Stay hydrated and do not exceed the dose. See a provider if diarrhea persists > 2 days.', alert: false, lasa: 'Loperamide vs furosemide (Lasix); Imodium vs Imuran.' });

DrugGuide.add('loratadine', { aliases: ['claritin'], brand: 'Claritin', cls: 'second-generation antihistamine',
  use: 'Relieves allergy symptoms: sneezing, runny nose, itchy eyes and hives.',
  dose: '10 mg PO once daily. Always follow the order.',
  give: ['Give with or without food.', 'Reduce frequency in liver or kidney impairment.', 'Check combination products with decongestants.'],
  watch: ['Allergy symptom relief.', 'Drowsiness (uncommon).', 'Liver or renal impairment.'],
  hold: ['Hold and call for rash, wheezing or swelling (could be anaphylaxis).', 'Hold and call for excessive sedation.', 'Hold and call if symptoms are not controlled.'],
  effects: ['Headache', 'Dry mouth', 'Mild fatigue', 'SERIOUS: rare allergic reaction'],
  teach: 'Usually non-drowsy. Take once daily and avoid duplicate antihistamines.', alert: false, lasa: 'Loratadine vs lorazepam; Claritin vs Clarinex.' });

DrugGuide.add('lorazepam', { aliases: ['ativan', 'lorazepam push'], brand: 'Ativan', cls: 'benzodiazepine',
  use: 'Treats anxiety, seizures and status epilepticus, agitation, and as a sedative.',
  dose: 'PO 0.5 to 2 mg every 6 to 8 hours; IV 0.5 to 2 mg for anxiety, 4 mg IV over 2 minutes for status epilepticus (may repeat). Always follow the order.',
  give: ['IV push slowly (not faster than 2 mg/min); dilute per policy.', 'Monitor airway, RR and oxygen saturation; keep flumazenil and suction available.', 'Protect from light; refrigerate vials.'],
  watch: ['Sedation level, RR and SpO2.', 'BP and HR; fall risk.', 'Seizure control or anxiety response.'],
  hold: ['Hold for RR < 12 or excessive sedation and call.', 'Hold and call for SBP < 90.', 'Hold and call if given with opioids or alcohol on board.'],
  effects: ['Drowsiness, dizziness', 'Confusion, amnesia', 'Weakness', 'SERIOUS: respiratory depression, paradoxical agitation, dependence'],
  teach: 'Call for help to get up; avoid alcohol. Do not stop suddenly after long use.', alert: true, lasa: 'Lorazepam vs alprazolam, loratadine; Ativan vs Atarax.' });

DrugGuide.add('macitentan', { aliases: ['opsumit'], brand: 'Opsumit', cls: 'endothelin receptor antagonist',
  use: 'Treats pulmonary arterial hypertension.',
  dose: '10 mg PO once daily. Always follow the order.',
  give: ['Give with or without food; swallow whole.', 'REMS: pregnancy test before and monthly.', 'Hazardous drug; do not crush or split.'],
  watch: ['Hemoglobin/hematocrit (anemia).', 'Liver tests, edema and weight.', 'Exercise tolerance, SpO2, BP.'],
  hold: ['Hold and call for positive pregnancy test.', 'Hold and call for AST/ALT elevation or jaundice.', 'Hold and call for pulmonary edema or hypotension.'],
  effects: ['Headache, nasal congestion', 'Anemia', 'Peripheral edema', 'SERIOUS: embryo-fetal toxicity, liver injury, pulmonary edema'],
  teach: 'Must avoid pregnancy and have monthly tests. Report swelling, shortness of breath or jaundice.', alert: false, lasa: 'Macitentan vs bosentan/ambrisentan.' });

DrugGuide.add('magnesium sulfate', { aliases: ['mag sulfate', 'magnesium', 'mgso4'], brand: 'Magnesium sulfate', cls: 'electrolyte / anticonvulsant (concentrated)',
  use: 'Replaces magnesium, prevents seizures in preeclampsia and treats torsades.',
  dose: 'Replacement 1 to 4 g IV over 1 to 4 hours; preeclampsia 4 to 6 g load then 1 to 2 g/h. Always follow the order.',
  give: ['Use a pump; never IV push except emergency torsades per protocol.', 'Independent double-check of concentration and rate.', 'Keep calcium gluconate (antidote) available.'],
  watch: ['Deep tendon reflexes (loss = toxicity), RR >= 12 and urine output >= 30 mL/h.', 'Mg level (preeclampsia goal 4-7 mEq/L), BP.', 'Cardiac monitoring and fetal status if pregnant.'],
  hold: ['Stop and call for loss of reflexes or RR < 12.', 'Stop and call for urine output < 30 mL/h or hypotension.', 'Hold and call for heart block.'],
  effects: ['Flushing, warmth, sweating', 'Hypotension', 'Drowsiness, weakness', 'SERIOUS: respiratory depression, cardiac arrest, toxicity'],
  teach: 'Warmth and flushing are common. Report trouble breathing, extreme weakness or double vision.', alert: true, lasa: 'Magnesium sulfate vs morphine sulfate (MS); never abbreviate MS or MSO4.' });

DrugGuide.add('meclizine', { aliases: ['antivert'], brand: 'Antivert', cls: 'antihistamine antiemetic',
  use: 'Treats vertigo and motion sickness nausea.',
  dose: '12.5 to 25 mg PO every 6 to 8 hours as needed (vertigo up to 25-100 mg/day divided). Always follow the order.',
  give: ['Motion sickness: give 1 hour before travel.', 'Offer sips of water for dry mouth.', 'Use fall precautions after dose.'],
  watch: ['Dizziness, drowsiness and fall risk.', 'Urinary retention, constipation.', 'Confusion in older adults (Beers list).'],
  hold: ['Hold and call for excessive sedation or confusion.', 'Hold and call for urinary retention or glaucoma.', 'Hold and call for new neurologic symptoms with vertigo.'],
  effects: ['Drowsiness', 'Dry mouth, blurred vision', 'Constipation, urinary retention', 'SERIOUS: confusion, delirium in older adults'],
  teach: 'Avoid driving and alcohol. Rise slowly and call if dizziness comes with weakness, speech trouble or vision loss.', alert: false, lasa: 'Meclizine vs meclofenamate; Antivert vs Axert.' });

DrugGuide.add('melatonin', { aliases: [], brand: 'Melatonin (OTC supplement)', cls: 'sleep-wake cycle hormone supplement',
  use: 'Helps with sleep onset and circadian rhythm problems.',
  dose: '1 to 5 mg PO 30 to 60 minutes before bedtime (up to 10 mg). Always follow the order.',
  give: ['Give at bedtime in a dim environment.', 'Use lowest effective dose.', 'Not strictly regulated; use a consistent product.'],
  watch: ['Sleep onset and quality.', 'Morning drowsiness.', 'Other sedatives and anticoagulants.'],
  hold: ['Hold and call for excessive daytime sedation.', 'Hold and call for confusion.', 'Hold and call if on immunosuppressants or seizure disorder (per provider).'],
  effects: ['Daytime drowsiness', 'Headache, dizziness', 'Vivid dreams', 'SERIOUS: rare; additive sedation with other sedatives'],
  teach: 'Take 30 to 60 minutes before bed and pair with good sleep habits. Avoid driving if drowsy.', alert: false, lasa: 'Melatonin vs melatonin-containing combos.' });

DrugGuide.add('mesalamine', { aliases: ['mesalamine dr', 'asacol', 'lialda', 'pentasa', 'apriso', 'mesalamine er'], brand: 'Lialda / Asacol', cls: 'aminosalicylate (anti-inflammatory)',
  use: 'Treats and maintains remission of ulcerative colitis.',
  dose: 'DR tablets 1.6 to 4.8 g PO daily in divided doses (product-specific). Always follow the order.',
  give: ['Swallow DR or ER tablets whole; do not crush or chew.', 'Lialda: give once daily with a meal.', 'Encourage fluids.'],
  watch: ['Stool frequency, blood and abdominal pain.', 'Renal function (creatinine) periodically.', 'Rash or worsening diarrhea (hypersensitivity).'],
  hold: ['Hold and call for salicylate allergy.', 'Hold and call for worsening bloody diarrhea, fever, or chest pain.', 'Hold and call for rising creatinine.'],
  effects: ['Headache, nausea', 'Abdominal pain, gas', 'Rash', 'SERIOUS: kidney injury, pancreatitis, hypersensitivity colitis'],
  teach: 'Take even when feeling well to prevent flares. Report new rash, fever or less urine.', alert: false, lasa: 'Mesalamine vs methenamine, memantine.' });

DrugGuide.add('metformin', { aliases: ['glucophage', 'metformin er', 'glumetza'], brand: 'Glucophage', cls: 'biguanide antidiabetic',
  use: 'Lowers blood glucose in type 2 diabetes.',
  dose: '500 to 1000 mg PO twice daily with meals (max 2550 mg/day); ER up to 2000 mg daily. Always follow the order.',
  give: ['Give with meals to reduce GI upset.', 'Swallow ER tablets whole.', 'Hold around iodinated contrast and surgery per policy.'],
  watch: ['Glucose and HbA1c.', 'eGFR/creatinine (avoid if eGFR < 30).', 'Vitamin B12 over time; signs of lactic acidosis.'],
  hold: ['Hold and call for eGFR < 30 or AKI.', 'Hold and call before/after contrast or if NPO/surgery.', 'Hold and call for vomiting, dehydration or sepsis.'],
  effects: ['Diarrhea, nausea, metallic taste', 'Abdominal discomfort', 'B12 deficiency', 'SERIOUS: lactic acidosis'],
  teach: 'Take with food. Report severe muscle pain, trouble breathing or vomiting; limit alcohol.', alert: false, lasa: 'Metformin vs metronidazole; Glucophage vs Glucotrol.' });

DrugGuide.add('methadone', { aliases: ['dolophine', 'methadose'], brand: 'Dolophine', cls: 'opioid analgesic / opioid use disorder treatment',
  use: 'Treats severe chronic pain and opioid withdrawal or opioid use disorder.',
  dose: 'Pain 2.5 to 10 mg PO every 8 to 12 hours; OUD dose individualized (often 20-120 mg daily). Always follow the order.',
  give: ['Long and variable half-life: accumulation can cause late respiratory depression.', 'Check ECG/QTc baseline; check interacting drugs.', 'Verify dose with the program or prescriber; do not crush ER forms.'],
  watch: ['RR, sedation level, pain and withdrawal signs.', 'QTc on ECG, syncope, palpitations.', 'Electrolytes (K, Mg).'],
  hold: ['Hold for RR < 12 or excessive sedation and call.', 'Hold and call for QTc > 500 ms or syncope.', 'Hold and call for K+ or Mg low.'],
  effects: ['Sedation, constipation', 'Nausea, sweating', 'Dizziness', 'SERIOUS: respiratory depression, QT prolongation/torsades'],
  teach: 'Take only as directed and avoid alcohol and sedatives. Report fainting or palpitations.', alert: true, lasa: 'Methadone vs methylphenidate; methadone vs morphine.' });

DrugGuide.add('methimazole', { aliases: ['tapazole'], brand: 'Tapazole', cls: 'antithyroid',
  use: 'Treats hyperthyroidism (Graves disease).',
  dose: '5 to 30 mg PO daily in one or divided doses. Always follow the order.',
  give: ['Give at consistent times with or without food.', 'Take consistently with respect to meals and iodine intake.', 'Do not crush if possible.'],
  watch: ['TSH, free T4 every 4-6 weeks.', 'CBC for agranulocytosis; liver tests.', 'HR, weight and symptoms of hyperthyroidism.'],
  hold: ['Hold and call for fever, sore throat or mouth sores (agranulocytosis).', 'Hold and call for jaundice or dark urine.', 'Hold and call for severe rash.'],
  effects: ['Rash, itching', 'Nausea, taste change', 'Joint pain', 'SERIOUS: agranulocytosis, liver injury, vasculitis'],
  teach: 'Report fever, sore throat or yellow skin right away. Pregnancy plans should be discussed.', alert: false, lasa: 'Methimazole vs metformin; Tapazole vs Tegretol.' });

DrugGuide.add('methocarbamol', { aliases: ['robaxin'], brand: 'Robaxin', cls: 'skeletal muscle relaxant',
  use: 'Relieves muscle spasm and pain from acute musculoskeletal conditions.',
  dose: '1500 mg PO 4 times daily for 2 to 3 days then 750 mg 4 times daily; IV 1 g. Always follow the order.',
  give: ['May be crushed.', 'IV: give slowly (max 3 mL/min) to avoid hypotension and keep patient recumbent.', 'Use fall precautions.'],
  watch: ['Muscle spasm and pain relief.', 'Sedation, BP, HR.', 'Urine color (may darken); renal function if IV.'],
  hold: ['Hold and call for excessive sedation.', 'Hold and call for hypotension, slow HR or syncope.', 'Hold and call for kidney impairment with IV form.'],
  effects: ['Drowsiness, dizziness', 'Blurred vision', 'Headache, dark urine', 'SERIOUS: hypotension, bradycardia, seizures with IV'],
  teach: 'Avoid driving and alcohol. Use alongside rest and physical therapy.', alert: false, lasa: 'Methocarbamol vs metoclopramide; Robaxin vs Robinul.' });

DrugGuide.add('methotrexate', { aliases: ['trexall', 'otrexup', 'rasuvo'], brand: 'Trexall', cls: 'antimetabolite / DMARD (chemotherapy)',
  use: 'Treats rheumatoid arthritis, psoriasis and certain cancers.',
  dose: 'RA/psoriasis 7.5 to 25 mg ONCE WEEKLY PO/SQ/IM; cancer doses vary widely. Always follow the order.',
  give: ['Confirm WEEKLY vs daily dosing; daily dosing errors can be fatal.', 'Hazardous drug: wear gloves and follow safe handling.', 'Give folic acid as ordered; avoid NSAIDs/TMP-SMX interactions.'],
  watch: ['CBC, liver tests, creatinine.', 'Mouth sores, cough or dyspnea.', 'Infection signs; pregnancy status.'],
  hold: ['Hold and call for WBC < 3,500 or platelets < 100,000 (per protocol).', 'Hold and call for fever, mouth ulcers or new cough.', 'Hold and call for rising creatinine or elevated LFTs.'],
  effects: ['Nausea, mouth sores', 'Fatigue, hair thinning', 'Elevated liver enzymes', 'SERIOUS: bone marrow suppression, lung toxicity, liver fibrosis, birth defects'],
  teach: 'Take only ONCE A WEEK on the same day. Avoid alcohol and pregnancy, and report fever or sores.', alert: true, lasa: 'Methotrexate vs metolazone; weekly vs daily error.' });

DrugGuide.add('methylprednisolone', { aliases: ['solu-medrol', 'medrol', 'depo-medrol', 'methylprednisolone sodium succinate'], brand: 'Solu-Medrol / Medrol', cls: 'corticosteroid',
  use: 'Reduces inflammation and immune activity in asthma/COPD flares, MS relapse, allergic reactions and autoimmune disease.',
  dose: 'PO 4 to 48 mg daily; IV 40 to 125 mg every 6 to 12 hours, up to 1 g daily for pulses. Always follow the order.',
  give: ['PO with food or milk, in the morning.', 'IV push 125 mg or less over 3 to 15 minutes; high doses infuse over at least 30 to 60 minutes.', 'Taper per order; do not stop suddenly.'],
  watch: ['Glucose, BP and fluid retention.', 'K+, mood and sleep, infection signs.', 'Weight, GI bleed signs.'],
  hold: ['Hold and call for glucose > 300 or new infection.', 'Hold and call for GI bleeding.', 'Hold and call for severe mood changes or psychosis.'],
  effects: ['Hyperglycemia, insomnia', 'Fluid retention, mood swings', 'Increased appetite', 'SERIOUS: infection, GI bleed, adrenal suppression'],
  teach: 'Take with food, do not stop suddenly, and report fever, black stools or mood changes.', alert: false, lasa: 'Methylprednisolone vs medroxyprogesterone; Medrol vs Medrol-like names.' });

DrugGuide.add('metoclopramide', { aliases: ['reglan'], brand: 'Reglan', cls: 'prokinetic antiemetic',
  use: 'Treats nausea, vomiting and delayed stomach emptying.',
  dose: '5 to 10 mg PO or IV before meals and at bedtime (up to 4 times daily); reduce in renal impairment. Always follow the order.',
  give: ['Give 30 minutes before meals.', 'IV push slowly over at least 1 to 2 minutes (faster causes restlessness).', 'Limit therapy to 12 weeks.'],
  watch: ['Nausea relief and gastric emptying.', 'Restlessness, tremor, involuntary movements.', 'Sedation, BP and mood.'],
  hold: ['Hold and call for any abnormal movements (EPS, tardive dyskinesia).', 'Hold and call for bowel obstruction or GI bleeding.', 'Hold and call for severe depression or suicidal thoughts.'],
  effects: ['Drowsiness, restlessness', 'Diarrhea, fatigue', 'Anxiety', 'SERIOUS: tardive dyskinesia, neuroleptic malignant syndrome, depression'],
  teach: 'Avoid alcohol and report muscle spasms, tremors or lip smacking right away.', alert: false, lasa: 'Metoclopramide vs metolazone, methocarbamol; Reglan vs Renagel.' });

DrugGuide.add('metoprolol tartrate', { aliases: ['metoprolol', 'lopressor', 'metoprolol succinate', 'toprol-xl'], brand: 'Lopressor', cls: 'beta-1 selective blocker',
  use: 'Treats hypertension, angina, heart failure, MI and rate control in atrial fibrillation.',
  dose: 'Tartrate PO 25 to 100 mg twice daily; IV 2.5 to 5 mg q5 min up to 15 mg; succinate ER 25 to 400 mg daily. Always follow the order.',
  give: ['Check apical HR and BP before each dose.', 'Give with food; swallow ER tablets whole (tartrate may be crushed).', 'IV push over 1 to 2 minutes with monitoring.'],
  watch: ['HR, BP and ECG with IV doses.', 'Signs of heart failure: edema, dyspnea, weight.', 'Glucose in diabetics (masks lows).'],
  hold: ['Hold for HR < 60 or SBP < 100 and call.', 'Hold and call for second/third-degree heart block.', 'Hold and call for acute heart failure or wheezing.'],
  effects: ['Fatigue, dizziness', 'Bradycardia, cold hands', 'Depression, sexual dysfunction', 'SERIOUS: heart block, heart failure, bronchospasm; abrupt stop can cause rebound MI'],
  teach: 'Do not stop suddenly. Check your pulse and rise slowly.', alert: false, lasa: 'Metoprolol vs metolazone; tartrate (twice daily) vs succinate (daily).' });

DrugGuide.add('metronidazole', { aliases: ['flagyl'], brand: 'Flagyl', cls: 'nitroimidazole antibiotic',
  use: 'Treats anaerobic and protozoal infections: C. difficile, bacterial vaginosis, trichomonas, abdominal infections.',
  dose: '250 to 500 mg PO or IV every 6 to 8 hours (500 mg q8h typical). Always follow the order.',
  give: ['Give PO with food to lessen nausea.', 'IV over 30 to 60 minutes; do not refrigerate.', 'Absolutely no alcohol during and 72 hours after (disulfiram-like reaction).'],
  watch: ['Infection response, GI symptoms.', 'Neurologic signs: numbness, confusion, seizure.', 'LFTs; QT with interacting drugs; urine may darken.'],
  hold: ['Hold and call for numbness, seizure or confusion.', 'Hold and call for alcohol use in last 72 hours.', 'Hold and call for severe liver disease for dose review.'],
  effects: ['Metallic taste, nausea', 'Headache, dark urine', 'Diarrhea', 'SERIOUS: peripheral neuropathy, seizures, C. difficile'],
  teach: 'No alcohol for 3 days after the last dose. Report tingling, numbness or severe diarrhea.', alert: false, lasa: 'Metronidazole vs metformin.' });

DrugGuide.add('midodrine', { aliases: ['proamatine', 'orvaten'], brand: 'ProAmatine', cls: 'alpha-1 agonist vasopressor (oral)',
  use: 'Raises blood pressure in orthostatic hypotension and supports BP in liver disease and dialysis.',
  dose: '2.5 to 10 mg PO three times daily during daytime hours. Always follow the order.',
  give: ['Give while upright, during the day: last dose at least 4 hours before bedtime.', 'Check supine and standing BP before each dose.', 'Avoid if supine hypertension is present.'],
  watch: ['Supine BP (goal avoid > 180-200 systolic), standing BP.', 'HR and urinary retention.', 'Piloerection, tingling scalp, headache.'],
  hold: ['Hold for supine SBP > 180 (or per order) and call.', 'Hold and call for HR < 50 or bradycardia.', 'Hold and call for urinary retention or severe headache.'],
  effects: ['Goosebumps, scalp tingling', 'Urinary urgency/retention', 'Supine hypertension', 'SERIOUS: severe supine hypertension, bradycardia'],
  teach: 'Take during the day while upright, not before bed, and report pounding headache or trouble urinating.', alert: false, lasa: 'Midodrine vs metoprolol; ProAmatine vs protamine.' });

/* drug guide entries, part 3 (mirabegron to zolpidem) */
DrugGuide.add('mirabegron', { aliases: ['myrbetriq'], brand: 'Myrbetriq', cls: 'Beta-3 agonist (overactive bladder)',
  use: 'Treats overactive bladder with urgency, frequency and urge incontinence.',
  dose: '25 mg PO daily, may increase to 50 mg daily. Always follow the order.',
  give: ['Swallow whole with water; do not crush or chew (extended release).', 'May be taken with or without food.'],
  watch: ['Check BP before giving; it can raise blood pressure.', 'Assess voiding pattern and for urinary retention.'],
  hold: ['Hold and call for severe uncontrolled hypertension (e.g., SBP > 180).', 'Call if the patient cannot void.'],
  effects: ['Hypertension', 'Headache', 'UTI', 'SERIOUS: urinary retention', 'SERIOUS: angioedema'],
  teach: 'Take once daily and swallow whole. Report trouble passing urine or facial swelling.', alert: false, lasa: '' });

DrugGuide.add('morphine', { aliases: ['morphine sulfate', 'ms contin', 'duramorph'], brand: 'MS Contin, Duramorph', cls: 'Opioid analgesic',
  use: 'Relieves moderate to severe pain.',
  dose: 'IV 2-4 mg every 2-4 h PRN; PO IR 15-30 mg every 4 h PRN; opioid-naive patients start low. Always follow the order.',
  give: ['Check pain score, sedation level and respiratory rate before each dose.', 'Give IV push slowly over 4-5 min; have naloxone available.', 'ER tablets must be swallowed whole; never crush.', 'Verify the concentration and double-check per policy.'],
  watch: ['Respiratory rate, SpO2 and sedation (POSS/RASS) after dosing.', 'Pain relief 15-30 min after IV, 60 min after PO.', 'Bowel function and urine output.'],
  hold: ['Hold for RR < 10-12, oversedation or SBP < 90, and call the provider.', 'Hold if the patient is hard to arouse.'],
  effects: ['Sedation', 'Constipation', 'Nausea and itching', 'Hypotension', 'SERIOUS: respiratory depression'],
  teach: 'Ask for pain relief early, do not drink alcohol, and expect constipation, so use a bowel regimen.', alert: true, lasa: 'Morphine vs hydromorphone (Dilaudid); mg vs mL on oral concentrate' });

DrugGuide.add('multivitamin', { aliases: ['multivitamin with minerals', 'multivitamin with vitamins', 'multi-vitamin', 'prenatal vitamin', 'theragran', 'centrum'], brand: 'Centrum, various', cls: 'Vitamin and mineral supplement',
  use: 'Supplies daily vitamins and minerals to prevent or treat deficiency.',
  dose: '1 tablet, capsule or softgel PO daily. Always follow the order.',
  give: ['Give with food to reduce stomach upset.', 'Check that softgels are swallowed whole.', 'Separate from levothyroxine or some antibiotics by about 4 h if the product contains iron or calcium.'],
  watch: ['Nutritional intake and any lab-confirmed deficiency.', 'GI tolerance.'],
  hold: ['Hold if the patient is NPO without a tube and call for clarification.', 'Hold if the patient has nausea or vomiting and ask the provider.'],
  effects: ['Nausea', 'Constipation (iron)', 'Dark stools', 'SERIOUS: allergic reaction (rare)'],
  teach: 'Take with food. Dark stools can be normal with iron. Keep out of reach of children.', alert: false, lasa: '' });

DrugGuide.add('mupirocin', { aliases: ['bactroban', 'mupirocin nasal'], brand: 'Bactroban', cls: 'Topical antibiotic',
  use: 'Eliminates Staph aureus (including MRSA) from the nose or treats impetigo and skin infections.',
  dose: 'Nasal: apply 2% ointment to each nostril twice daily for 5 days. Skin: thin layer 3 times daily. Always follow the order.',
  give: ['Use a clean cotton swab for each nostril.', 'Press nostrils together and massage to spread.', 'Wash hands before and after; wear gloves.'],
  watch: ['Look for burning, stinging or rash at the site.', 'Check that the full course is completed.'],
  hold: ['Stop and call for severe irritation or allergic reaction.', 'Do not use longer than ordered.'],
  effects: ['Burning or stinging', 'Itching', 'Nasal dryness', 'SERIOUS: allergic reaction'],
  teach: 'Use for the full course, wash hands, and do not share the tube.', alert: false, lasa: 'Bactroban vs Bactrim' });

DrugGuide.add('mycophenolate mofetil', { aliases: ['mycophenolate', 'cellcept', 'myfortic'], brand: 'CellCept', cls: 'Immunosuppressant',
  use: 'Prevents organ transplant rejection and treats some autoimmune disease.',
  dose: '1000 mg PO or IV twice daily for kidney transplant (dose varies by organ). Always follow the order.',
  give: ['Give on an empty stomach if possible; consistency matters.', 'Do not crush or open capsules; hazardous drug, use gloves.', 'IV: dilute in D5W and infuse over at least 2 h; never push.'],
  watch: ['CBC (neutropenia), renal and liver tests.', 'Signs of infection and temperature.', 'Pregnancy status before starting.'],
  hold: ['Hold and call for ANC < 1.3 or WBC low per provider.', 'Hold for fever, new infection signs, or severe diarrhea.'],
  effects: ['Diarrhea', 'Nausea', 'Leukopenia', 'SERIOUS: serious infection', 'SERIOUS: birth defects and lymphoma'],
  teach: 'Avoid crowds and sick contacts, use sun protection, and use birth control. Never stop it without the transplant team.', alert: false, lasa: 'Mycophenolate vs mycophenolic acid (Myfortic) are not interchangeable mg to mg' });

DrugGuide.add('nadolol', { aliases: ['corgard'], brand: 'Corgard', cls: 'Beta blocker (non-selective)',
  use: 'Treats hypertension, angina and arrhythmias.',
  dose: '40-80 mg PO once daily (max 320 mg/day). Always follow the order.',
  give: ['Check apical pulse and BP before every dose.', 'May be given with or without food.', 'Do not stop suddenly.'],
  watch: ['HR and BP before and after.', 'Blood glucose in diabetics (masks hypoglycemia).', 'Lung sounds and edema.'],
  hold: ['Hold for HR < 60 or SBP < 100 and call the provider.', 'Hold for wheezing or signs of heart block.'],
  effects: ['Bradycardia', 'Fatigue', 'Dizziness', 'Cold hands', 'SERIOUS: heart failure or bronchospasm'],
  teach: 'Do not stop suddenly. Rise slowly and check your pulse. It can hide signs of low blood sugar.', alert: false, lasa: 'Corgard vs Coreg' });

DrugGuide.add('naloxone', { aliases: ['narcan'], brand: 'Narcan', cls: 'Opioid antagonist',
  use: 'Reverses opioid-induced respiratory depression and overdose.',
  dose: 'IV 0.04-0.4 mg, repeat every 2-3 min as needed; IM/SQ 0.4-2 mg; intranasal 4 mg. Always follow the order.',
  give: ['Call for help; support airway and breathing first.', 'Titrate small IV doses to restore breathing without full reversal.', 'Dilute 0.4 mg in 9 mL saline for small increments.'],
  watch: ['RR, SpO2 and level of consciousness continuously.', 'Pain return and withdrawal signs.', 'Re-sedation: effect lasts 30-90 min, shorter than many opioids.'],
  hold: ['Do not hold in a true overdose.', 'Use caution in opioid-dependent patients; give small doses and call the provider.'],
  effects: ['Withdrawal symptoms', 'Tachycardia', 'Hypertension', 'SERIOUS: pulmonary edema', 'SERIOUS: return of severe pain'],
  teach: 'Tell the patient and family it is a rescue drug and they still need medical care afterward.', alert: false, lasa: 'Naloxone vs naltrexone' });

DrugGuide.add('naltrexone', { aliases: ['revia', 'vivitrol'], brand: 'Revia, Vivitrol', cls: 'Opioid antagonist',
  use: 'Treats alcohol use disorder and prevents relapse to opioids.',
  dose: '50 mg PO daily; Vivitrol 380 mg IM every 4 weeks (gluteal). Always follow the order.',
  give: ['Confirm the patient is opioid-free for 7-10 days before starting.', 'Take with food if nauseated.', 'Vivitrol: deep gluteal IM only, by trained staff.'],
  watch: ['Liver tests (AST/ALT).', 'Mood and suicidal thoughts.', 'Injection site reactions.'],
  hold: ['Hold and call if the patient has received opioids recently or needs opioid pain relief.', 'Hold for jaundice or elevated liver tests.'],
  effects: ['Nausea', 'Headache', 'Fatigue', 'SERIOUS: hepatotoxicity', 'SERIOUS: precipitated opioid withdrawal'],
  teach: 'Carry a wallet card. Opioids will not work, and trying to overcome the block can cause overdose.', alert: false, lasa: 'Naltrexone vs naloxone' });

DrugGuide.add('naproxen', { aliases: ['naprosyn', 'aleve', 'anaprox'], brand: 'Naprosyn, Aleve', cls: 'NSAID',
  use: 'Relieves pain, inflammation and fever.',
  dose: '250-500 mg PO twice daily (max 1250 mg/day). Always follow the order.',
  give: ['Give with food or milk.', 'Delayed-release tablets are not crushed.', 'Avoid other NSAIDs at the same time.'],
  watch: ['BP, edema and urine output.', 'Signs of GI bleeding (black stools).', 'BUN/creatinine, CBC.'],
  hold: ['Hold for GI bleeding, creatinine rise or active ulcer, and call.', 'Hold if patient is on anticoagulant or has severe kidney disease; check with provider.'],
  effects: ['Dyspepsia', 'Heartburn', 'Edema', 'SERIOUS: GI bleeding', 'SERIOUS: heart attack, stroke or kidney injury'],
  teach: 'Take with food and report black stools. Do not combine with aspirin or ibuprofen.', alert: false, lasa: 'Naproxen vs Naprosyn vs Anaprox; Aleve vs Aldactone' });

DrugGuide.add('nifedipine', { aliases: ['procardia', 'adalat', 'nifedipine er'], brand: 'Procardia XL, Adalat CC', cls: 'Calcium channel blocker (dihydropyridine)',
  use: 'Treats hypertension and angina; IR form used in preterm labor.',
  dose: 'ER 30-90 mg PO once daily (max 120 mg). Always follow the order.',
  give: ['ER tablets must be swallowed whole; never crush, split or chew.', 'Avoid grapefruit juice.', 'Check BP and HR before giving.'],
  watch: ['BP and HR before and after.', 'Peripheral edema.', 'Chest pain, headache and flushing.'],
  hold: ['Hold for SBP < 100 or HR < 55 and call the provider.', 'Never use short-acting capsules for blood pressure emergencies.'],
  effects: ['Peripheral edema', 'Headache', 'Flushing', 'Dizziness', 'SERIOUS: hypotension or reflex tachycardia'],
  teach: 'Swallow whole and avoid grapefruit. Rise slowly. Report swelling or chest pain.', alert: false, lasa: 'Nifedipine vs nicardipine vs nimodipine' });

DrugGuide.add('nitrofurantoin', { aliases: ['macrobid', 'macrodantin', 'nitrofurantoin monohydrate'], brand: 'Macrobid', cls: 'Urinary antibiotic',
  use: 'Treats uncomplicated lower urinary tract infection (cystitis).',
  dose: 'Macrobid 100 mg PO twice daily for 5 days. Always follow the order.',
  give: ['Give with food or milk to improve absorption and lessen nausea.', 'Do not open or crush capsules unless the order allows.', 'Obtain culture before the first dose.'],
  watch: ['Creatinine clearance; avoid if CrCl < 30.', 'Cough, dyspnea or fever (pulmonary reaction).', 'Numbness or tingling.'],
  hold: ['Hold and call for CrCl < 30 or new respiratory symptoms.', 'Hold for numbness or tingling in hands and feet.'],
  effects: ['Nausea', 'Headache', 'Brown or dark urine (harmless)', 'SERIOUS: lung reaction', 'SERIOUS: peripheral neuropathy and hepatitis'],
  teach: 'Take with food and finish the course. Urine may turn brown. Report breathing problems.', alert: false, lasa: 'Macrobid vs Macrodantin vs Micro-K' });

DrugGuide.add('nitroglycerin', { aliases: ['nitrostat', 'nitro-bid', 'nitro'], brand: 'Nitrostat, Nitro-Bid', cls: 'Nitrate vasodilator',
  use: 'Relieves and prevents angina and treats acute heart failure or hypertensive emergencies (IV).',
  dose: 'SL 0.4 mg every 5 min up to 3 doses; IV starts 5-10 mcg/min and is titrated; patch 0.2-0.8 mg/h. Always follow the order.',
  give: ['SL: patient sits, tablet dissolves under tongue; do not swallow.', 'Check BP first; call 911 if pain persists 5 min after the first dose.', 'IV: use non-PVC tubing and glass or special bottle per pharmacy.', 'Patches: rotate sites and remove at night if ordered.'],
  watch: ['BP and HR before and 5 min after.', 'Chest pain relief and headache.', 'Avoid with PDE-5 inhibitors (sildenafil).'],
  hold: ['Hold for SBP < 90-100 and call the provider.', 'Hold if sildenafil or tadalafil taken within 24-48 h.'],
  effects: ['Headache', 'Dizziness', 'Flushing', 'Hypotension', 'SERIOUS: severe hypotension and syncope'],
  teach: 'Sit down before use. Keep tablets in the original glass bottle. Seek emergency help if pain is not relieved.', alert: false, lasa: 'Nitroglycerin vs nitroprusside' });

DrugGuide.add('nutrition supplement', { aliases: ['oral nutrition supplement', 'ensure', 'boost', 'glucerna', 'nutritional supplement', 'tube feeding'], brand: 'Ensure, Boost, Glucerna', cls: 'Dietary supplement',
  use: 'Adds calories and protein for patients with poor intake or higher needs.',
  dose: '1 bottle or carton (about 240 mL) PO one to three times daily, or as ordered. Always follow the order.',
  give: ['Serve chilled; offer between meals so it does not replace meals.', 'Check allergies, diabetes (use diabetic formula) and diet texture.', 'Document the percent consumed.'],
  watch: ['Weight, intake and glucose if diabetic.', 'Nausea, bloating and diarrhea.', 'Swallowing safety.'],
  hold: ['Hold if the patient is NPO or has aspiration risk, and call.', 'Hold for vomiting or severe diarrhea and notify the provider or dietitian.'],
  effects: ['Bloating', 'Nausea', 'Diarrhea', 'Elevated blood glucose', 'SERIOUS: aspiration'],
  teach: 'Sip slowly and drink between meals to boost nutrition.', alert: false, lasa: '' });

DrugGuide.add('ondansetron', { aliases: ['zofran'], brand: 'Zofran', cls: 'Antiemetic (5-HT3 blocker)',
  use: 'Prevents and treats nausea and vomiting.',
  dose: '4 mg IV/IM/PO or ODT every 8 h PRN (up to 8 mg per dose). Always follow the order.',
  give: ['IV push over at least 2-5 min, or dilute in 50 mL and infuse over 15 min.', 'ODT: place on tongue to dissolve; dry hands.', 'Give 30 min before chemotherapy if ordered.'],
  watch: ['Nausea relief and hydration.', 'QT interval and K+/Mg2+ in at-risk patients.', 'Bowel function (constipation).'],
  hold: ['Hold and call for QTc > 500 ms or severe electrolyte abnormality.', 'Hold if patient is on apomorphine or has long QT syndrome.'],
  effects: ['Headache', 'Constipation', 'Dizziness', 'SERIOUS: QT prolongation', 'SERIOUS: serotonin syndrome'],
  teach: 'Report palpitations or fainting. Constipation may occur, so keep up fluids.', alert: false, lasa: 'Ondansetron vs dolasetron/granisetron; Zofran vs Zantac' });

DrugGuide.add('oxycodone', { aliases: ['oxycontin', 'roxicodone', 'oxycodone er', 'oxycodone ir'], brand: 'Roxicodone, OxyContin', cls: 'Opioid analgesic',
  use: 'Relieves moderate to severe pain.',
  dose: 'IR 5-15 mg PO every 4-6 h PRN; ER 10-40 mg PO every 12 h scheduled. Always follow the order.',
  give: ['Assess pain, sedation and RR before each dose.', 'ER tablets (OxyContin) must be swallowed whole; never crush, chew or split.', 'Give a bowel regimen with it.'],
  watch: ['RR, SpO2 and sedation scale after dosing.', 'Pain score 30-60 min after IR dose.', 'Constipation and urinary retention.'],
  hold: ['Hold for RR < 10-12 or oversedation and call the provider.', 'Hold for SBP < 90.'],
  effects: ['Sedation', 'Constipation', 'Nausea', 'Dizziness', 'SERIOUS: respiratory depression'],
  teach: 'Do not drink alcohol, never crush ER tablets, and store the drug locked away.', alert: true, lasa: 'Oxycodone vs OxyContin vs hydrocodone; Roxicodone vs Roxanol' });

DrugGuide.add('packed red blood cells', { aliases: ['prbc', 'prbcs', 'red blood cells', 'blood transfusion', 'rbc'], brand: 'PRBC', cls: 'Blood product',
  use: 'Raises oxygen-carrying capacity in anemia or blood loss.',
  dose: 'One unit (about 300 mL) IV, usually over 2-4 h; must finish within 4 h of leaving blood bank. Always follow the order.',
  give: ['Two-nurse bedside verification of patient ID, unit and ABO/Rh.', 'Use blood tubing with filter and only 0.9% saline; no other drugs or fluids in the line.', 'Start slowly (about 2 mL/min) for the first 15 min and stay with the patient.', 'Obtain consent and baseline vitals before starting.'],
  watch: ['Vitals before, at 15 min, then per policy and at end.', 'Signs of reaction: fever, chills, rash, back pain, dyspnea.', 'Fluid overload and Hgb/Hct after transfusion.'],
  hold: ['STOP the transfusion for any reaction, keep the IV open with saline, and call the provider and blood bank.', 'Do not start if the unit has been out more than 30 min.'],
  effects: ['Fever or chills', 'Hives', 'SERIOUS: hemolytic reaction', 'SERIOUS: TRALI or circulatory overload (TACO)', 'SERIOUS: anaphylaxis'],
  teach: 'Report chills, itching, back pain or trouble breathing right away.', alert: false, lasa: '' });

DrugGuide.add('pancrelipase', { aliases: ['creon', 'zenpep', 'pancreaze', 'pertzye', 'viokace'], brand: 'Creon', cls: 'Pancreatic enzyme',
  use: 'Replaces digestive enzymes in pancreatic insufficiency (pancreatitis, cystic fibrosis).',
  dose: 'Typically 500-2500 lipase units/kg per meal, half with snacks. Always follow the order.',
  give: ['Give at the start of meals or snacks.', 'Swallow capsules whole; if needed open and sprinkle beads on applesauce, do not crush or chew.', 'Follow with water; do not mix with alkaline foods.'],
  watch: ['Stool pattern, steatorrhea, weight.', 'Abdominal pain and bloating.', 'Blood glucose in diabetics.'],
  hold: ['Hold if no meal or snack is being eaten, and clarify.', 'Call for severe abdominal pain or constipation.'],
  effects: ['Abdominal pain', 'Gas', 'Constipation', 'SERIOUS: fibrosing colonopathy (high doses)', 'SERIOUS: allergic reaction (pork)'],
  teach: 'Take with the first bite of meals and snacks. Do not crush or chew the beads.', alert: false, lasa: 'Brands are not interchangeable' });

DrugGuide.add('pantoprazole', { aliases: ['protonix'], brand: 'Protonix', cls: 'Proton pump inhibitor',
  use: 'Reduces stomach acid for GERD, ulcers and GI bleed prophylaxis.',
  dose: '40 mg PO daily, or 40 mg IV daily to twice daily. Always follow the order.',
  give: ['Give PO 30-60 min before breakfast; swallow tablet whole, do not crush.', 'IV: infuse over 15 min using the in-line filter if required.', 'Do not mix granules into incompatible foods.'],
  watch: ['Epigastric pain and GI bleeding signs.', 'Magnesium and B12 with long-term use.', 'Diarrhea (C. difficile).'],
  hold: ['Hold and call for severe persistent diarrhea.', 'Call for black or bloody stool.'],
  effects: ['Headache', 'Diarrhea', 'Nausea', 'SERIOUS: C. difficile infection', 'SERIOUS: low magnesium, fractures (long-term)'],
  teach: 'Take before a meal. Report severe diarrhea or black stool.', alert: false, lasa: 'Protonix vs Lotronex; pantoprazole vs pentazocine' });

DrugGuide.add('penicillin v potassium', { aliases: ['penicillin vk', 'penicillin v', 'pen vk'], brand: 'Pen-Vee K', cls: 'Penicillin antibiotic',
  use: 'Treats strep throat, mild skin and dental infections.',
  dose: '250-500 mg PO every 6-8 h. Always follow the order.',
  give: ['Ask about penicillin allergy before the first dose.', 'Give on an empty stomach, 1 h before or 2 h after meals.', 'Space evenly around the clock.'],
  watch: ['Rash, hives or breathing problems.', 'Diarrhea and temperature.', 'Renal function if impaired.'],
  hold: ['Hold and call for any rash, wheeze or allergy history.', 'Hold for severe diarrhea.'],
  effects: ['Nausea', 'Diarrhea', 'Rash', 'SERIOUS: anaphylaxis', 'SERIOUS: C. difficile colitis'],
  teach: 'Finish the full course. Report rash or trouble breathing immediately.', alert: false, lasa: 'Penicillin V vs penicillin G (not interchangeable)' });

DrugGuide.add('petrolatum', { aliases: ['petroleum jelly', 'vaseline', 'aquaphor', 'emollient', 'petrolatum emollient'], brand: 'Vaseline', cls: 'Topical emollient / skin protectant',
  use: 'Moisturizes dry skin and protects it from moisture and friction.',
  dose: 'Apply a thin layer topically to affected skin one to several times daily. Always follow the order.',
  give: ['Clean and dry the skin first; wear gloves.', 'Do not apply to open infected wounds unless ordered.', 'Keep away from oxygen sources.'],
  watch: ['Skin integrity and moisture.', 'Redness or irritation.'],
  hold: ['Hold and call if skin looks infected (pus, spreading redness).', 'Do not use around oxygen tubing; use water-based product.'],
  effects: ['Greasy feel', 'Clogged pores', 'Rare contact dermatitis', 'SERIOUS: fire risk near oxygen'],
  teach: 'Apply after bathing while skin is damp. Avoid smoking and flames when it is on the skin.', alert: false, lasa: '' });

DrugGuide.add('phenobarbital', { aliases: ['luminal'], brand: 'Luminal (generic)', cls: 'Barbiturate anticonvulsant / sedative',
  use: 'Controls seizures and treats alcohol withdrawal and anxiety.',
  dose: 'PO 60-120 mg/day in divided doses; IV loading 10-20 mg/kg for status epilepticus (max 60 mg/min). Always follow the order.',
  give: ['IV push slow, no faster than 60 mg/min; have airway equipment.', 'Check sedation, RR and BP before giving.', 'Do not mix with other drugs in the syringe.'],
  watch: ['RR, SpO2, BP and sedation.', 'Serum level (about 15-40 mcg/mL).', 'Seizure activity and mood.'],
  hold: ['Hold for RR < 10, oversedation or SBP < 90, and call.', 'Hold for rash and call right away.'],
  effects: ['Drowsiness', 'Dizziness', 'Confusion', 'SERIOUS: respiratory depression', 'SERIOUS: severe rash (SJS)'],
  teach: 'Do not drive, avoid alcohol, and do not stop suddenly.', alert: true, lasa: 'Phenobarbital vs pentobarbital' });

DrugGuide.add('piperacillin-tazobactam', { aliases: ['zosyn', 'piperacillin tazobactam', 'pip-tazo', 'pip tazo'], brand: 'Zosyn', cls: 'Extended-spectrum penicillin + beta-lactamase inhibitor',
  use: 'Treats serious bacterial infections (pneumonia, intra-abdominal, skin, sepsis).',
  dose: '3.375-4.5 g IV every 6-8 h (extended infusion common). Always follow the order.',
  give: ['Ask about penicillin allergy; get cultures before the first dose.', 'Infuse over 30 min or extended 4 h per order.', 'Do not mix with aminoglycosides in the same bag or line.', 'Time-critical in sepsis.'],
  watch: ['Rash, anaphylaxis signs.', 'Renal function, CBC and electrolytes (K+).', 'Diarrhea.'],
  hold: ['Hold and call for rash, hives or wheeze.', 'Call for CrCl change needing dose adjustment.'],
  effects: ['Diarrhea', 'Rash', 'Nausea', 'SERIOUS: anaphylaxis', 'SERIOUS: C. difficile; bleeding or low platelets'],
  teach: 'Report rash, trouble breathing or watery diarrhea.', alert: false, lasa: 'Zosyn vs Zyvox; Zosyn vs Zofran' });

DrugGuide.add('pirfenidone', { aliases: ['esbriet'], brand: 'Esbriet', cls: 'Antifibrotic',
  use: 'Slows lung function decline in idiopathic pulmonary fibrosis.',
  dose: 'Titrate to 801 mg (3 capsules or one tablet) PO three times daily with food. Always follow the order.',
  give: ['Give with food to reduce nausea.', 'Swallow whole with water.', 'Avoid sunlight exposure.'],
  watch: ['Liver tests (AST/ALT/bilirubin) before and during therapy.', 'Weight and appetite.', 'Rash and photosensitivity.'],
  hold: ['Hold and call for liver enzymes > 3x normal or jaundice.', 'Call for severe rash.'],
  effects: ['Nausea', 'Rash', 'Fatigue', 'Photosensitivity', 'SERIOUS: liver injury'],
  teach: 'Take with food, use sunscreen and cover skin, and avoid smoking.', alert: false, lasa: '' });

DrugGuide.add('polyethylene glycol', { aliases: ['miralax', 'glycolax', 'peg 3350', 'golytely'], brand: 'MiraLAX', cls: 'Osmotic laxative',
  use: 'Treats constipation.',
  dose: '17 g powder in 4-8 oz of liquid PO once daily. Always follow the order.',
  give: ['Mix powder fully in water, juice or coffee, then drink.', 'Results take 1-3 days.', 'Encourage fluids.'],
  watch: ['Bowel movements and abdominal exam.', 'Hydration and electrolytes with diarrhea.'],
  hold: ['Hold for loose stools or diarrhea.', 'Hold and call for suspected obstruction or severe abdominal pain.'],
  effects: ['Bloating', 'Gas', 'Nausea', 'Diarrhea', 'SERIOUS: dehydration, electrolyte loss'],
  teach: 'Mix in a full glass of fluid. Stop if stools become loose.', alert: false, lasa: '' });

DrugGuide.add('potassium chloride', { aliases: ['klor-con', 'k-dur', 'kcl', 'potassium chloride replacement', 'potassium replacement'], brand: 'Klor-Con, K-Dur', cls: 'Electrolyte replacement',
  use: 'Treats or prevents low potassium (hypokalemia).',
  dose: 'PO 20-40 mEq per dose; IV usually 10 mEq/h peripheral (max 20 mEq/h central with cardiac monitor). Always follow the order.',
  give: ['NEVER give IV push or undiluted; concentrate must be diluted and on a pump.', 'PO: give with food and a full glass of water; swallow ER tablets whole, upright.', 'IV: use a premixed bag; large vein; check site often (burns, phlebitis).', 'Verify the latest K+ level and renal function first.'],
  watch: ['Serum K+ (goal 3.5-5.0) and ECG/telemetry for IV replacement.', 'Urine output; kidney function.', 'IV site pain, redness or infiltration.'],
  hold: ['Hold for K+ > 5.0 and call the provider.', 'Hold for urine output < 30 mL/h or renal failure and call.', 'Stop IV for severe pain at the site.'],
  effects: ['Nausea', 'GI irritation', 'IV site pain', 'SERIOUS: hyperkalemia with arrhythmia or cardiac arrest', 'SERIOUS: GI ulceration'],
  teach: 'Take with food and a full glass of water; report weakness, palpitations or stomach pain.', alert: true, lasa: 'Potassium chloride vs potassium phosphate/acetate; Klor-Con vs Clonidine' });

DrugGuide.add('potassium citrate', { aliases: ['urocit-k', 'urocit k'], brand: 'Urocit-K', cls: 'Urinary alkalinizer / potassium supplement',
  use: 'Prevents kidney stones and raises urine pH.',
  dose: '15-30 mEq PO two to three times daily with meals. Always follow the order.',
  give: ['Give with meals or within 30 min after a meal.', 'Swallow ER tablets whole with water.', 'Encourage high fluid intake.'],
  watch: ['Serum K+ and kidney function.', 'Urine pH and stone symptoms.', 'ECG changes if K+ high.'],
  hold: ['Hold for K+ > 5.0 and call.', 'Hold for renal failure or urine infection with high urine pH.'],
  effects: ['Nausea', 'Abdominal discomfort', 'Diarrhea', 'SERIOUS: hyperkalemia', 'SERIOUS: GI ulcers'],
  teach: 'Take with meals, drink plenty of water, and report weakness or palpitations.', alert: false, lasa: '' });

DrugGuide.add('potassium iodide', { aliases: ['sski', 'saturated solution of potassium iodide', 'iosat', 'thyrosafe'], brand: 'SSKI, ThyroSafe', cls: 'Iodine / antithyroid agent',
  use: 'Blocks thyroid hormone release in thyroid storm or before thyroid surgery.',
  dose: 'SSKI 5 drops (about 250 mg) PO every 6 h, per provider. Always follow the order.',
  give: ['Dilute in water, juice or milk; strong taste.', 'Give at least 1 h after an antithyroid drug (e.g., PTU) in thyroid storm.', 'Use a straw to protect teeth; drops must be counted exactly.'],
  watch: ['HR, temperature and thyroid storm signs.', 'Serum potassium.', 'Rash, swollen salivary glands, metallic taste.'],
  hold: ['Hold for iodine allergy or K+ > 5.0 and call.', 'Hold for rash, swollen glands or breathing problems.'],
  effects: ['Metallic taste', 'GI upset', 'Rash', 'Salivary gland swelling', 'SERIOUS: hyperkalemia or allergic reaction'],
  teach: 'Mix with juice and drink with a straw. Report swelling, rash or irregular heartbeat.', alert: false, lasa: 'SSKI drops vs mL; potassium iodide vs potassium chloride' });

DrugGuide.add('pramipexole', { aliases: ['mirapex'], brand: 'Mirapex', cls: 'Dopamine agonist',
  use: 'Treats Parkinson disease and restless legs syndrome.',
  dose: 'Parkinson: 0.125 mg PO three times daily, titrated to 1.5-4.5 mg/day; RLS 0.125-0.5 mg at bedtime. Always follow the order.',
  give: ['May give with food to reduce nausea.', 'ER tablets whole; do not crush.', 'Do not stop suddenly.'],
  watch: ['BP, especially orthostatic.', 'Sleepiness, hallucinations or compulsive behaviors.', 'Renal function (dose adjust).'],
  hold: ['Hold and call for severe hypotension, fainting or sudden sleep attacks.', 'Call for new hallucinations or gambling urges.'],
  effects: ['Nausea', 'Dizziness', 'Sleepiness', 'Leg swelling', 'SERIOUS: sudden sleep attacks, hallucinations, impulse control problems'],
  teach: 'Rise slowly, avoid driving if drowsy, and report unusual urges or hallucinations.', alert: false, lasa: 'Mirapex vs Mifeprex; pramipexole vs ropinirole' });

DrugGuide.add('prazosin', { aliases: ['minipress'], brand: 'Minipress', cls: 'Alpha-1 blocker',
  use: 'Treats hypertension and (off-label) PTSD nightmares.',
  dose: '1 mg PO at bedtime to start, usual 1-5 mg two to three times daily (max 20 mg/day). Always follow the order.',
  give: ['First dose at bedtime; patient stays in bed or sits.', 'Check BP lying and standing.', 'Give with or without food.'],
  watch: ['Orthostatic BP and HR.', 'Dizziness and falls.', 'Edema and weight.'],
  hold: ['Hold for SBP < 100 or symptomatic orthostasis and call.', 'Hold after missed doses for 2+ days; may need re-titration.'],
  effects: ['Dizziness', 'Headache', 'Drowsiness', 'SERIOUS: first-dose syncope', 'SERIOUS: priapism (rare)'],
  teach: 'Rise slowly, especially after the first dose. Report fainting.', alert: false, lasa: 'Prazosin vs prednisone/pravastatin' });

DrugGuide.add('prednisone', { aliases: ['deltasone', 'rayos'], brand: 'Deltasone, Rayos', cls: 'Corticosteroid',
  use: 'Reduces inflammation and suppresses immune response (asthma, COPD, autoimmune, transplant).',
  dose: '5-60 mg PO daily (higher in flares), taper per plan. Always follow the order.',
  give: ['Give with food in the morning.', 'Never stop suddenly after long use; follow taper.', 'DR tablets whole.'],
  watch: ['Blood glucose, BP, weight and edema.', 'Signs of infection; mood changes.', 'K+ and GI bleeding signs.'],
  hold: ['Hold and call for fever or signs of infection, or glucose > 250-300.', 'Do not skip doses without provider direction.'],
  effects: ['Increased appetite and weight', 'High blood sugar', 'Insomnia, mood changes', 'SERIOUS: infection, GI bleed, adrenal suppression'],
  teach: 'Take in the morning with food. Never stop suddenly. Report fever or black stools.', alert: false, lasa: 'Prednisone vs prednisolone; prednisone vs promethazine' });

DrugGuide.add('pregabalin', { aliases: ['lyrica'], brand: 'Lyrica', cls: 'Anticonvulsant / neuropathic pain agent',
  use: 'Treats nerve pain, fibromyalgia and partial seizures.',
  dose: '75-150 mg PO two times daily (max 600 mg/day); adjust for kidney function. Always follow the order.',
  give: ['May be taken with or without food.', 'ER tablets whole.', 'Taper over at least 1 week to stop.'],
  watch: ['Sedation, dizziness and fall risk.', 'Edema and weight gain.', 'Mood and suicidal thoughts; renal function.'],
  hold: ['Hold and call for severe sedation or breathing problems with other CNS depressants.', 'Call for angioedema or rash.'],
  effects: ['Dizziness', 'Sleepiness', 'Dry mouth', 'Peripheral edema', 'SERIOUS: respiratory depression with opioids, angioedema'],
  teach: 'Do not drive until you know how it affects you. Do not stop suddenly.', alert: false, lasa: 'Lyrica vs Lopressor; pregabalin vs gabapentin (different doses)' });

DrugGuide.add('prochlorperazine', { aliases: ['compazine', 'compro'], brand: 'Compazine', cls: 'Phenothiazine antiemetic / antipsychotic',
  use: 'Treats severe nausea and vomiting.',
  dose: '5-10 mg PO/IV/IM every 6-8 h PRN; PR 25 mg every 12 h. Always follow the order.',
  give: ['IV: slow push no faster than 5 mg/min or dilute; avoid subcutaneous.', 'Check BP before giving.', 'Keep patient lying down briefly after parenteral dose.'],
  watch: ['Nausea relief and BP.', 'Muscle spasms or restlessness (EPS).', 'ECG/QT in at-risk patients.'],
  hold: ['Hold for SBP < 90 or marked sedation and call.', 'Hold and call for dystonia or stiff neck.'],
  effects: ['Drowsiness', 'Dry mouth', 'Hypotension', 'SERIOUS: dystonia, tardive dyskinesia', 'SERIOUS: QT prolongation, neuroleptic malignant syndrome'],
  teach: 'Rise slowly and avoid driving. Report muscle spasms or restlessness.', alert: false, lasa: 'Prochlorperazine vs chlorpromazine; Compazine vs Copaxone' });

DrugGuide.add('progesterone', { aliases: ['prometrium', 'progesterone in oil', 'crinone'], brand: 'Prometrium', cls: 'Hormone (progestin)',
  use: 'Protects the uterus during estrogen therapy, treats absent periods and supports pregnancy in fertility care.',
  dose: 'PO 100-200 mg at bedtime; IM 50-100 mg daily in oil; vaginal gel/insert per order. Always follow the order.',
  give: ['Capsules at bedtime (drowsiness), swallow whole.', 'Avoid in peanut allergy (Prometrium capsules contain peanut oil).', 'IM: deep, warm oil is thick, use a large-gauge needle and rotate sites.'],
  watch: ['BP, mood and weight.', 'Signs of blood clots (leg swelling, chest pain).', 'Abnormal bleeding.'],
  hold: ['Hold and call for peanut allergy, DVT signs or unexplained vaginal bleeding.', 'Hold in known pregnancy loss or breast cancer, per provider.'],
  effects: ['Drowsiness', 'Breast tenderness', 'Bloating', 'Headache', 'SERIOUS: blood clots, stroke'],
  teach: 'Take at bedtime. Report calf pain, chest pain or vision change.', alert: false, lasa: 'Progesterone vs medroxyprogesterone; oil vs aqueous' });

DrugGuide.add('propranolol', { aliases: ['inderal'], brand: 'Inderal', cls: 'Beta blocker (non-selective)',
  use: 'Treats hypertension, tachyarrhythmias, tremor, migraine prevention and thyroid storm symptoms.',
  dose: '10-80 mg PO two to three times daily (up to 160-320 mg/day); IV 1 mg slow push per order. Always follow the order.',
  give: ['Check apical pulse and BP before every dose.', 'IV: slow push at 1 mg/min with ECG monitoring.', 'Give with food; ER capsules whole.'],
  watch: ['HR, BP, ECG and respiratory status.', 'Blood glucose (masks hypoglycemia).', 'Heart failure signs.'],
  hold: ['Hold for HR < 60 or SBP < 100 and call.', 'Hold for wheezing or bronchospasm.'],
  effects: ['Bradycardia', 'Fatigue', 'Cold extremities', 'Dizziness', 'SERIOUS: bronchospasm, heart failure, heart block'],
  teach: 'Do not stop suddenly. Check your pulse. It can hide signs of low blood sugar.', alert: false, lasa: 'Propranolol vs Pravachol/Propulsid; Inderal vs Inderide' });

DrugGuide.add('propylthiouracil', { aliases: ['ptu'], brand: 'PTU (generic)', cls: 'Antithyroid',
  use: 'Treats hyperthyroidism and thyroid storm.',
  dose: '100-150 mg PO every 6-8 h at first (300-900 mg/day), then lower maintenance. Always follow the order.',
  give: ['Give consistently with respect to meals, evenly spaced.', 'In thyroid storm, give PTU at least 1 h before iodine.', 'Check baseline liver tests.'],
  watch: ['Fever or sore throat (agranulocytosis).', 'Liver tests (jaundice, dark urine, abdominal pain).', 'Thyroid labs, HR and temperature.'],
  hold: ['Hold and call for fever, sore throat or jaundice.', 'Hold for rash or elevated liver enzymes.'],
  effects: ['Rash', 'Nausea', 'Taste change', 'SERIOUS: liver failure', 'SERIOUS: agranulocytosis'],
  teach: 'Report fever, sore throat, yellow skin or dark urine immediately.', alert: false, lasa: 'Do not abbreviate as PTU; propylthiouracil vs methimazole (different drugs)' });

DrugGuide.add('psyllium', { aliases: ['metamucil', 'konsyl', 'fiber powder'], brand: 'Metamucil', cls: 'Bulk-forming laxative (fiber)',
  use: 'Treats constipation and adds dietary fiber.',
  dose: '1 rounded teaspoon or packet (about 3.5-7 g) in a full glass of fluid, 1-3 times daily. Always follow the order.',
  give: ['Mix in at least 8 oz water or juice and drink right away.', 'Always follow with extra fluid.', 'Give 2 h apart from other oral drugs when possible.'],
  watch: ['Bowel movements and abdominal comfort.', 'Fluid intake.', 'Swallowing and choking risk.'],
  hold: ['Hold for suspected bowel obstruction, fecal impaction or difficulty swallowing and call.', 'Hold if fluids are restricted without clarifying.'],
  effects: ['Bloating', 'Gas', 'Cramping', 'SERIOUS: esophageal or bowel obstruction if taken without enough fluid', 'SERIOUS: allergic reaction'],
  teach: 'Drink a full glass of water with every dose. Effect takes 1-3 days.', alert: false, lasa: '' });

DrugGuide.add('pyridostigmine', { aliases: ['mestinon', 'regonol'], brand: 'Mestinon', cls: 'Cholinesterase inhibitor',
  use: 'Improves muscle strength in myasthenia gravis.',
  dose: '60 mg PO every 4-6 h while awake (up to 1500 mg/day); timed ER 180 mg at bedtime. Always follow the order.',
  give: ['Time-critical; give on time, usually 30-60 min before meals.', 'ER tablets whole.', 'Have atropine available per policy.'],
  watch: ['Muscle strength, swallowing and breathing.', 'HR and secretions.', 'Signs of cholinergic crisis vs myasthenic crisis.'],
  hold: ['Hold and call for HR < 50, severe cramping or excess secretions.', 'Call immediately for worsening weakness or trouble breathing.'],
  effects: ['Abdominal cramps', 'Diarrhea', 'Salivation', 'Muscle twitching', 'SERIOUS: cholinergic crisis, bradycardia'],
  teach: 'Take at the same times daily, not late. Report new weakness or breathing difficulty.', alert: false, lasa: 'Pyridostigmine vs physostigmine/pyridoxine; Mestinon vs Metanx' });

DrugGuide.add('pyridoxine', { aliases: ['vitamin b6', 'b6'], brand: 'Vitamin B6', cls: 'Vitamin (B6)',
  use: 'Treats or prevents B6 deficiency, isoniazid neuropathy, and nausea of pregnancy.',
  dose: '25-100 mg PO daily; higher doses per provider. Always follow the order.',
  give: ['Give with or without food.', 'Avoid high doses long term.', 'Give with isoniazid if ordered.'],
  watch: ['Numbness, tingling or balance problems.', 'Nutritional status.', 'Effect on levodopa (reduces effect).'],
  hold: ['Hold and call for new numbness or unsteady gait.', 'Check dose if > 100 mg/day.'],
  effects: ['Nausea', 'Headache', 'Drowsiness', 'SERIOUS: nerve damage with excess doses'],
  teach: 'Do not exceed the dose. Report numbness or tingling in hands and feet.', alert: false, lasa: 'Pyridoxine vs pyridostigmine' });

DrugGuide.add('quetiapine', { aliases: ['seroquel'], brand: 'Seroquel', cls: 'Atypical antipsychotic',
  use: 'Treats schizophrenia, bipolar disorder and adjunct depression.',
  dose: '25-800 mg PO daily in divided doses (ER once daily in evening). Always follow the order.',
  give: ['Often given at bedtime; sedation.', 'ER tablets whole.', 'Check BP and fall risk.'],
  watch: ['Orthostatic BP, weight, glucose and lipids.', 'Mood, psychosis, suicidal thoughts.', 'ECG/QTc and abnormal movements.'],
  hold: ['Hold for SBP < 90 or marked sedation and call.', 'Hold and call for fever with rigidity or confusion.'],
  effects: ['Sleepiness', 'Dry mouth', 'Weight gain', 'Dizziness', 'SERIOUS: neuroleptic malignant syndrome, high blood sugar, QT prolongation'],
  teach: 'Rise slowly and avoid alcohol. Do not stop suddenly.', alert: false, lasa: 'Seroquel vs Sinequan/Serzone; quetiapine vs quinapril' });

DrugGuide.add('rifaximin', { aliases: ['xifaxan'], brand: 'Xifaxan', cls: 'Non-absorbed antibiotic',
  use: 'Prevents hepatic encephalopathy recurrence, treats traveler diarrhea and IBS with diarrhea.',
  dose: 'HE: 550 mg PO twice daily; traveler diarrhea 200 mg three times daily for 3 days. Always follow the order.',
  give: ['With or without food.', 'Often given with lactulose in hepatic encephalopathy.', 'Swallow tablets whole.'],
  watch: ['Mental status and asterixis in liver disease.', 'Stool pattern and diarrhea.', 'Ammonia trend if ordered.'],
  hold: ['Hold and call for severe or bloody diarrhea.', 'Call for worsening confusion.'],
  effects: ['Nausea', 'Dizziness', 'Edema', 'Fatigue', 'SERIOUS: C. difficile colitis'],
  teach: 'Take as prescribed with lactulose if ordered. Report watery diarrhea or worsening confusion.', alert: false, lasa: 'Rifaximin vs rifampin' });

DrugGuide.add('riluzole', { aliases: ['rilutek', 'tiglutik'], brand: 'Rilutek', cls: 'Glutamate inhibitor (ALS)',
  use: 'Slows progression of amyotrophic lateral sclerosis (ALS).',
  dose: '50 mg PO every 12 h. Always follow the order.',
  give: ['Give on an empty stomach, 1 h before or 2 h after meals.', 'Hazardous drug handling; wear gloves.', 'Swallow whole (suspension available for tube).'],
  watch: ['Liver tests (ALT) monthly at first.', 'CBC and fever (neutropenia).', 'Cough, dyspnea (lung disease).'],
  hold: ['Hold and call for jaundice or ALT > 5x normal.', 'Hold for fever and signs of infection.'],
  effects: ['Nausea', 'Weakness', 'Dizziness', 'SERIOUS: liver injury', 'SERIOUS: neutropenia'],
  teach: 'Take on an empty stomach and keep lab appointments. Report fever or yellow skin.', alert: false, lasa: 'Riluzole vs Rilutek vs Reglan' });

DrugGuide.add('ropinirole', { aliases: ['requip'], brand: 'Requip', cls: 'Dopamine agonist',
  use: 'Treats Parkinson disease and restless legs syndrome.',
  dose: 'RLS 0.25-4 mg PO 1-3 h before bed; Parkinson 0.25 mg three times daily up to 24 mg/day. Always follow the order.',
  give: ['Give with food to reduce nausea.', 'ER tablets whole.', 'Do not stop suddenly.'],
  watch: ['Orthostatic BP.', 'Daytime sleepiness, hallucinations, compulsive behaviors.', 'Leg swelling.'],
  hold: ['Hold and call for fainting or severe hypotension.', 'Hold and call for new hallucinations or sudden sleep attacks.'],
  effects: ['Nausea', 'Dizziness', 'Sleepiness', 'Leg swelling', 'SERIOUS: sudden sleep onset, hallucinations, impulse control disorders'],
  teach: 'Rise slowly, avoid driving if drowsy, and report unusual urges.', alert: false, lasa: 'Ropinirole vs risperidone; Requip vs Reglan' });

DrugGuide.add('sacubitril-valsartan', { aliases: ['entresto', 'sacubitril valsartan', 'sacubitril/valsartan'], brand: 'Entresto', cls: 'ARNI (neprilysin inhibitor + ARB)',
  use: 'Treats heart failure with reduced ejection fraction.',
  dose: '24/26 mg to 97/103 mg PO twice daily; start low if on low-dose ACEI/ARB or renal impairment. Always follow the order.',
  give: ['Do not give with an ACE inhibitor; need a 36-hour washout.', 'Check BP and K+ before starting and with dose changes.', 'May be taken with or without food.'],
  watch: ['BP and orthostatic symptoms.', 'K+ and creatinine.', 'Angioedema (lips, tongue, face swelling).'],
  hold: ['Hold for SBP < 100 or symptomatic hypotension and call.', 'Hold for K+ > 5.0-5.5, AKI or any angioedema.'],
  effects: ['Hypotension', 'Dizziness', 'Cough', 'Hyperkalemia', 'SERIOUS: angioedema, kidney injury'],
  teach: 'Rise slowly. Report swelling of the face or tongue immediately. Do not take with ACE inhibitors.', alert: false, lasa: 'Entresto vs Enbrel/Entocort' });

DrugGuide.add('senna-docusate', { aliases: ['senna docusate', 'senna s', 'senokot-s', 'senokot s', 'peri-colace', 'senna plus'], brand: 'Senokot-S', cls: 'Stimulant laxative + stool softener',
  use: 'Prevents and treats constipation, especially from opioids.',
  dose: '8.6 mg senna/50 mg docusate: 1-2 tablets PO once or twice daily. Always follow the order.',
  give: ['Usually given at bedtime; effect in 6-12 h.', 'Give with a full glass of water.', 'Do not crush enteric-coated tablets.'],
  watch: ['Bowel movements, abdominal exam.', 'Hydration and electrolytes with diarrhea.', 'Cramping.'],
  hold: ['Hold for loose or watery stools.', 'Hold and call for abdominal pain, vomiting or suspected obstruction.'],
  effects: ['Cramping', 'Diarrhea', 'Nausea', 'Urine discoloration', 'SERIOUS: dehydration and electrolyte loss'],
  teach: 'Drink fluids and report no bowel movement for 3 days or severe cramping.', alert: false, lasa: 'Senna vs Seroquel; docusate vs Doxepin/Dulcolax' });

DrugGuide.add('senna', { aliases: ['senokot', 'sennosides'], brand: 'Senokot', cls: 'Stimulant laxative',
  use: 'Treats and prevents constipation, especially from opioids.',
  dose: '8.6-17.2 mg (1-2 tablets) PO at bedtime, up to 34.4 mg/day. Always follow the order.',
  give: ['Give at bedtime; works in 6-12 h.', 'Give with fluids.', 'Do not crush enteric-coated tablets.'],
  watch: ['Bowel movements and abdominal exam.', 'Fluid balance.', 'Cramping.'],
  hold: ['Hold for loose or watery stools.', 'Hold and call for abdominal pain, vomiting or obstruction signs.'],
  effects: ['Cramping', 'Diarrhea', 'Nausea', 'Urine discoloration', 'SERIOUS: dehydration'],
  teach: 'Take at bedtime with water. Not for long-term daily use without advice.', alert: false, lasa: 'Senna vs Seroquel, sevelamer' });

DrugGuide.add('sertraline', { aliases: ['zoloft'], brand: 'Zoloft', cls: 'SSRI antidepressant',
  use: 'Treats depression, anxiety, OCD, PTSD and panic disorder.',
  dose: '25-200 mg PO once daily. Always follow the order.',
  give: ['Give in the morning or evening consistently, with or without food.', 'Oral concentrate must be diluted.', 'Do not stop suddenly.'],
  watch: ['Mood, suicidal thoughts (especially early or at dose changes).', 'Sodium (hyponatremia), especially older adults.', 'Bleeding and serotonin syndrome signs.'],
  hold: ['Hold and call for suicidal thoughts, agitation or fever with tremor.', 'Hold and call if Na is low (e.g., < 130).'],
  effects: ['Nausea', 'Diarrhea', 'Insomnia', 'Sexual dysfunction', 'SERIOUS: serotonin syndrome, hyponatremia, bleeding'],
  teach: 'It takes 4-6 weeks to work. Do not stop abruptly and report mood changes.', alert: false, lasa: 'Sertraline vs Cetirizine; Zoloft vs Zocor' });

DrugGuide.add('sevelamer carbonate', { aliases: ['sevelamer', 'renvela', 'renagel'], brand: 'Renvela', cls: 'Phosphate binder',
  use: 'Lowers high phosphorus in chronic kidney disease on dialysis.',
  dose: '800-1600 mg PO three times daily with meals. Always follow the order.',
  give: ['Give with meals; skip the dose if the meal is skipped.', 'Swallow tablets whole; do not crush.', 'Separate from ciprofloxacin and levothyroxine.'],
  watch: ['Serum phosphorus (goal about 3.5-5.5) and calcium.', 'Bowel movements and abdominal pain.', 'Swallowing ability.'],
  hold: ['Hold if the patient is not eating, and call.', 'Hold and call for bowel obstruction signs or severe constipation.'],
  effects: ['Nausea', 'Constipation', 'Bloating', 'Diarrhea', 'SERIOUS: bowel obstruction'],
  teach: 'Take with meals, not between. Follow the renal diet.', alert: false, lasa: 'Sevelamer vs sertraline; Renvela vs Renagel (not same mg)' });

DrugGuide.add('sildenafil', { aliases: ['viagra', 'revatio'], brand: 'Viagra, Revatio', cls: 'PDE-5 inhibitor',
  use: 'Treats erectile dysfunction (Viagra) and pulmonary arterial hypertension (Revatio).',
  dose: 'ED 25-100 mg PO about 1 h before activity; PAH 20 mg PO three times daily or 10 mg IV. Always follow the order.',
  give: ['Never give with nitrates (nitroglycerin, isosorbide).', 'Check BP before giving.', 'Avoid high-fat meal if rapid onset is needed.'],
  watch: ['BP and HR.', 'Vision or hearing changes.', 'Chest pain, and erection lasting over 4 h.'],
  hold: ['Hold for SBP < 90 or any nitrate use and call.', 'Hold and call for sudden vision or hearing loss.'],
  effects: ['Headache', 'Flushing', 'Nasal congestion', 'Dyspepsia', 'SERIOUS: severe hypotension with nitrates, priapism, vision loss'],
  teach: 'Never take with nitroglycerin. Seek care if the erection lasts over 4 h or vision changes.', alert: false, lasa: 'Sildenafil vs sufentanil/tadalafil; Viagra vs Revatio doses differ' });

DrugGuide.add('sodium bicarbonate', { aliases: ['bicarb', 'nahco3', 'sodium bicarb'], brand: 'generic', cls: 'Alkalinizing agent / electrolyte',
  use: 'Treats metabolic acidosis, hyperkalemia, certain overdoses and heartburn.',
  dose: 'IV 50 mEq (one 8.4% syringe) slow push in arrest or per ABG; infusion 150 mEq in 1 L D5W at ordered rate; PO 650-1300 mg 2-3 times daily. Always follow the order.',
  give: ['Do not mix with calcium or give in the same line without flushing.', 'Extravasation can cause tissue necrosis; use a good IV and check the site.', 'Use a pump for infusions and verify the concentration.', 'Give PO tablets with water, apart from other drugs.'],
  watch: ['ABG/pH, bicarbonate, Na+ and K+.', 'Fluid overload, edema and lung sounds.', 'IV site integrity.'],
  hold: ['Hold and call for pH > 7.5 or bicarbonate high.', 'Hold for low K+ or fluid overload and call.'],
  effects: ['Gas and bloating (PO)', 'Metabolic alkalosis', 'Hypokalemia', 'SERIOUS: fluid overload, hypernatremia', 'SERIOUS: tissue necrosis if infiltrated'],
  teach: 'Report belching, swelling or muscle cramps. Do not take antacid long term without advice.', alert: true, lasa: 'Bicarbonate 8.4% vs 4.2% syringes; sodium bicarbonate vs sodium chloride' });

DrugGuide.add('sodium chloride', { aliases: ['normal saline', '0.9% sodium chloride', 'nacl', 'saline', 'half normal saline', '0.45% sodium chloride', 'salt tablets'], brand: 'Normal saline', cls: 'IV fluid (isotonic or hypotonic) / electrolyte',
  use: 'Replaces fluid and sodium, maintains IV lines and dilutes medicines.',
  dose: '0.9% or 0.45% IV 75-125 mL/h or bolus 250-1000 mL per order; flush 3-10 mL. Always follow the order.',
  give: ['Verify strength (0.9% isotonic, 0.45% hypotonic) and use a pump.', 'Compatible with blood products (0.9% only).', 'Label the bag and tubing; check the rate each shift.'],
  watch: ['Lung sounds, edema, JVD, I&O and daily weight.', 'Na+ and chloride; BP.', 'IV site for infiltration.'],
  hold: ['Slow and call for crackles, dyspnea, edema or SpO2 drop (overload).', 'Hold and call for Na > 145 or heart failure not yet addressed.'],
  effects: ['Edema', 'Hypernatremia', 'Hyperchloremic acidosis', 'SERIOUS: fluid overload and pulmonary edema', 'SERIOUS: hypo- or hypernatremia'],
  teach: 'Tell the nurse about shortness of breath, swelling or pain at the IV.', alert: false, lasa: '0.9% vs 0.45% vs 3% bags; sodium chloride vs potassium chloride' });

DrugGuide.add('sodium chloride 7%', { aliases: ['hypertonic saline', '7% sodium chloride', 'hypertonic sodium chloride', '3% sodium chloride', '3% saline', 'hyper-sal'], brand: 'Hyper-Sal (inhaled)', cls: 'Hypertonic saline (airway clearance / hypertonic IV)',
  use: 'Inhaled 7% draws water into airways to loosen mucus; 3% IV raises sodium in severe hyponatremia or cerebral edema.',
  dose: 'Inhaled: 4 mL via nebulizer twice daily after a bronchodilator; IV 3% only by order and rate. Always follow the order.',
  give: ['Give a bronchodilator (albuterol) first for inhaled use.', 'IV 3%: central line preferred, infusion pump, never IV push; watch for fluid volume.', 'Verify concentration with a second nurse.'],
  watch: ['Lung sounds, SpO2 and bronchospasm (inhaled).', 'Na+ every 2-4 h on IV 3%; do not raise > 8-10 mEq/L in 24 h.', 'Neuro status and I&O.'],
  hold: ['Stop and call for wheeze, chest tightness or SpO2 drop (inhaled).', 'Stop and call for Na rising too fast, seizure, or pulmonary edema (IV).'],
  effects: ['Cough', 'Salty taste', 'Airway irritation', 'SERIOUS: bronchospasm', 'SERIOUS: osmotic demyelination, fluid overload (IV)'],
  teach: 'Take the bronchodilator first, rinse mouth afterward, and report chest tightness.', alert: true, lasa: '3% vs 0.9% saline bags; 7% inhaled vs IV products' });

DrugGuide.add('sodium phosphate', { aliases: ['sodium phosphates', 'fleet enema', 'phospho-soda', 'k-phos neutral', 'phosphate replacement'], brand: 'Fleet enema', cls: 'Electrolyte / saline laxative',
  use: 'Replaces phosphate (IV) or relieves constipation (enema).',
  dose: 'IV per protocol, commonly 15-30 mmol over 4-6 h; enema 118 mL rectally once. Always follow the order.',
  give: ['IV: dilute and give by pump, never push; infuse slowly.', 'Enema: left side, hold 1-5 min.', 'Check calcium and kidney function first.'],
  watch: ['Phosphorus, calcium, K+, creatinine.', 'ECG with large IV doses.', 'Hydration and stool output.'],
  hold: ['Hold for high phosphorus, low calcium or renal failure and call.', 'Hold enema repeat; do not repeat within 24 h.'],
  effects: ['Diarrhea', 'Cramping', 'Nausea', 'SERIOUS: hypocalcemia, hyperphosphatemia', 'SERIOUS: kidney injury'],
  teach: 'Do not repeat enema doses. Report tingling, cramps or very little urine.', alert: true, lasa: 'Sodium phosphate vs potassium phosphate; units mmol vs mEq vs mg' });

DrugGuide.add('sodium zirconium cyclosilicate', { aliases: ['lokelma'], brand: 'Lokelma', cls: 'Potassium binder',
  use: 'Lowers high potassium (hyperkalemia).',
  dose: 'Start 10 g PO three times daily for up to 48 h, then 5-15 g daily. Always follow the order.',
  give: ['Mix packet in at least 45 mL (3 tbsp) of water, stir, drink right away.', 'Separate other oral drugs by 2 h if absorption depends on pH.', 'Use in addition to treatment of emergency hyperkalemia.'],
  watch: ['Serum K+ (target 3.5-5.0) and ECG for severe levels.', 'Edema and BP; contains sodium.', 'Mg and K+ for low levels.'],
  hold: ['Hold and call for K+ < 3.5 or severe constipation/obstruction.', 'Hold and call for new edema or HF worsening.'],
  effects: ['Edema', 'Hypokalemia', 'Mild nausea', 'SERIOUS: fluid retention in heart failure', 'SERIOUS: low potassium'],
  teach: 'Mix and drink promptly. Report swelling or shortness of breath.', alert: false, lasa: 'Lokelma vs Lopressor; sodium zirconium vs sodium polystyrene (Kayexalate)' });

DrugGuide.add('spironolactone', { aliases: ['aldactone'], brand: 'Aldactone', cls: 'Potassium-sparing diuretic (aldosterone antagonist)',
  use: 'Treats heart failure, hypertension, ascites and low potassium.',
  dose: '25-100 mg PO daily (up to 400 mg for ascites). Always follow the order.',
  give: ['Give with food.', 'Give in the morning.', 'Avoid potassium supplements and salt substitutes unless ordered.'],
  watch: ['K+ and creatinine (check within a few days and regularly).', 'BP, weight, I&O.', 'Breast tenderness in men.'],
  hold: ['Hold for K+ > 5.0 and call.', 'Hold for SBP < 90, AKI or dehydration.'],
  effects: ['Hyperkalemia', 'Dizziness', 'Breast enlargement or menstrual changes', 'SERIOUS: severe hyperkalemia with arrhythmia', 'SERIOUS: kidney injury'],
  teach: 'Avoid salt substitutes. Weigh daily and report weakness or palpitations.', alert: false, lasa: 'Spironolactone vs Spiriva; Aldactone vs Aldactazide' });

DrugGuide.add('sulfamethoxazole-trimethoprim', { aliases: ['bactrim', 'septra', 'smx-tmp', 'sulfamethoxazole trimethoprim', 'tmp-smx', 'co-trimoxazole'], brand: 'Bactrim DS', cls: 'Sulfonamide antibiotic',
  use: 'Treats urinary tract infections, MRSA skin infections, and prevents PJP pneumonia.',
  dose: '1 DS tablet (800/160 mg) PO every 12 h; IV by trimethoprim component 8-20 mg/kg/day. Always follow the order.',
  give: ['Ask about sulfa allergy first.', 'Give with a full glass of water; encourage fluids.', 'IV: dilute and infuse over 60-90 min, never push.'],
  watch: ['Rash (stop at first sign) and fever.', 'K+ and creatinine, CBC.', 'Hydration and urine output.'],
  hold: ['Hold and call for any rash, mouth sores or sulfa allergy.', 'Hold and call for K+ > 5.0 or significant creatinine rise.'],
  effects: ['Nausea', 'Rash', 'Photosensitivity', 'Hyperkalemia', 'SERIOUS: Stevens-Johnson syndrome, bone marrow suppression'],
  teach: 'Drink plenty of fluids, use sunscreen, and stop and call for any rash.', alert: false, lasa: 'Bactrim vs Bactroban; Septra vs Septra DS strength' });

DrugGuide.add('sumatriptan', { aliases: ['imitrex'], brand: 'Imitrex', cls: 'Triptan (5-HT1 agonist)',
  use: 'Stops an acute migraine attack.',
  dose: 'PO 25-100 mg at onset, may repeat in 2 h (max 200 mg/day); SQ 6 mg, may repeat in 1 h (max 12 mg/day). Always follow the order.',
  give: ['Give at the first sign of migraine, not for prevention.', 'Check BP first.', 'SQ: rotate sites, upper arm or thigh.'],
  watch: ['Headache relief at 1-2 h.', 'BP, chest pain or tightness.', 'Serotonin syndrome signs with SSRIs.'],
  hold: ['Hold for uncontrolled hypertension (e.g., SBP > 180), known coronary disease or hemiplegic migraine and call.', 'Hold if an ergot or another triptan was used in the last 24 h.'],
  effects: ['Tingling', 'Flushing', 'Dizziness', 'Chest tightness', 'SERIOUS: coronary vasospasm, stroke, serotonin syndrome'],
  teach: 'Use at migraine onset. Seek care for chest pain. Limit use to avoid medication-overuse headache.', alert: false, lasa: 'Sumatriptan vs zolmitriptan; Imitrex vs Imuran' });

DrugGuide.add('tacrolimus', { aliases: ['prograf', 'envarsus', 'astagraf', 'fk506'], brand: 'Prograf', cls: 'Calcineurin inhibitor immunosuppressant',
  use: 'Prevents rejection after organ transplant.',
  dose: 'PO 0.05-0.2 mg/kg/day in 2 divided doses (IR); dose is adjusted by trough level. Always follow the order.',
  give: ['Time-critical: give every 12 h at the same times, consistently with or without food.', 'Do not crush ER forms; avoid grapefruit.', 'Do not substitute IR and ER forms without the provider.'],
  watch: ['Trough level (often 5-15 ng/mL, per transplant team).', 'Creatinine, K+, glucose, Mg and BP.', 'Tremor, headache and infection signs.'],
  hold: ['Hold and call before giving if the trough is high or toxicity signs appear.', 'Hold for K+ > 5.0 or rising creatinine and notify the team.'],
  effects: ['Tremor', 'Headache', 'High blood pressure', 'High potassium', 'SERIOUS: kidney toxicity, infection, new diabetes'],
  teach: 'Never miss doses, avoid grapefruit, and keep trough lab timing before the morning dose.', alert: false, lasa: 'Tacrolimus vs sirolimus; Prograf vs Envarsus not interchangeable' });

DrugGuide.add('tamoxifen', { aliases: ['nolvadex', 'soltamox'], brand: 'Nolvadex', cls: 'Selective estrogen receptor modulator',
  use: 'Treats and prevents hormone-receptor-positive breast cancer.',
  dose: '20 mg PO daily (or 10 mg twice daily). Always follow the order.',
  give: ['Give with or without food.', 'Hazardous drug; gloves.', 'Check pregnancy status.'],
  watch: ['Signs of blood clots (leg swelling, chest pain, dyspnea).', 'Vaginal bleeding and vision changes.', 'Liver tests, calcium (bone mets).'],
  hold: ['Hold and call for calf pain, chest pain, sudden dyspnea or vision change.', 'Hold and call for unexplained vaginal bleeding.'],
  effects: ['Hot flashes', 'Vaginal discharge', 'Nausea', 'SERIOUS: DVT/PE and stroke', 'SERIOUS: uterine cancer'],
  teach: 'Report leg pain, chest pain or abnormal bleeding. Use nonhormonal birth control.', alert: false, lasa: 'Tamoxifen vs tamsulosin; Nolvadex vs Novolin' });

DrugGuide.add('tamsulosin', { aliases: ['flomax'], brand: 'Flomax', cls: 'Alpha-1 blocker',
  use: 'Relieves urinary symptoms from an enlarged prostate (BPH) and helps stone passage.',
  dose: '0.4 mg PO daily, may increase to 0.8 mg. Always follow the order.',
  give: ['Give about 30 min after the same meal each day.', 'Swallow capsule whole; do not crush, chew or open.', 'Patient should rise slowly.'],
  watch: ['Orthostatic BP and falls.', 'Urine flow and retention.', 'Eye surgery plans (floppy iris).'],
  hold: ['Hold for SBP < 100 or dizziness and call.', 'Hold and call for fainting.'],
  effects: ['Dizziness', 'Nasal congestion', 'Retrograde ejaculation', 'SERIOUS: orthostatic hypotension and syncope', 'SERIOUS: priapism (rare)'],
  teach: 'Rise slowly. Tell eye surgeons you take it before cataract surgery.', alert: false, lasa: 'Flomax vs Fosamax; tamsulosin vs tamoxifen/terazosin' });

DrugGuide.add('tenofovir alafenamide', { aliases: ['vemlidy', 'tenofovir', 'tdf', 'viread'], brand: 'Vemlidy', cls: 'Nucleotide reverse transcriptase inhibitor (antiviral)',
  use: 'Treats chronic hepatitis B (and HIV in combination products).',
  dose: '25 mg PO once daily with food. Always follow the order.',
  give: ['Give with food.', 'Do not stop suddenly in hepatitis B.', 'Same time each day.'],
  watch: ['Liver tests, HBV DNA and creatinine.', 'Signs of hepatitis flare (jaundice, dark urine).', 'Bone health.'],
  hold: ['Hold and call for creatinine rise or CrCl < 15 not on dialysis.', 'Call before any dose is missed or stopped.'],
  effects: ['Headache', 'Nausea', 'Fatigue', 'SERIOUS: severe hepatitis B flare if stopped', 'SERIOUS: lactic acidosis, kidney injury'],
  teach: 'Never stop it without your provider. Report yellow skin or dark urine.', alert: false, lasa: 'TAF vs TDF are not interchangeable; Vemlidy vs Viread' });

DrugGuide.add('testosterone', { aliases: ['androgel', 'depo-testosterone', 'testosterone cypionate', 'testosterone enanthate', 'testim', 'xyosted'], brand: 'AndroGel, Depo-Testosterone', cls: 'Androgen hormone',
  use: 'Replaces testosterone in hypogonadism.',
  dose: 'IM 50-400 mg every 2-4 weeks (cypionate/enanthate); gel 40.5-81 mg daily. Always follow the order.',
  give: ['IM: deep gluteal, oil-based, use a large needle, rotate sites.', 'Gel: apply to clean dry shoulders or upper arms; wash hands and cover with clothing.', 'Controlled substance (C-III); document.'],
  watch: ['Hematocrit/Hgb, PSA and testosterone level.', 'BP, edema and leg swelling.', 'Mood, acne, sleep apnea.'],
  hold: ['Hold and call for Hct > 54% or signs of DVT.', 'Hold and call for severe urinary retention symptoms.'],
  effects: ['Acne', 'Mood changes', 'Fluid retention', 'SERIOUS: polycythemia and blood clots', 'SERIOUS: cardiovascular events'],
  teach: 'Keep gel away from women and children, and report leg swelling or chest pain.', alert: false, lasa: 'Testosterone cypionate vs enanthate (different durations)' });

DrugGuide.add('thiamine', { aliases: ['vitamin b1', 'b1'], brand: 'Vitamin B1', cls: 'Vitamin (B1)',
  use: 'Prevents or treats thiamine deficiency, Wernicke encephalopathy and refeeding problems.',
  dose: 'PO 100 mg daily; IV/IM 100-500 mg for Wernicke, per order. Always follow the order.',
  give: ['Give before glucose in alcohol-use disorder or malnutrition.', 'IV: dilute and infuse over 30 min; slow push risk of anaphylaxis.', 'Test dose for IM if allergy history.'],
  watch: ['Mental status, eye movements and gait.', 'Signs of allergic reaction with IV.', 'Nutritional status.'],
  hold: ['Hold and call for allergy or anaphylaxis signs.', 'Do not delay in suspected Wernicke; call the provider first.'],
  effects: ['Mild injection site pain', 'Warmth', 'Rare rash', 'SERIOUS: anaphylaxis (IV)'],
  teach: 'Eat a balanced diet and avoid alcohol; report itching or swelling.', alert: false, lasa: 'Thiamine vs thiothixene' });

DrugGuide.add('ticagrelor', { aliases: ['brilinta'], brand: 'Brilinta', cls: 'Antiplatelet (P2Y12 inhibitor)',
  use: 'Reduces heart attack and stent clots after ACS or stent placement.',
  dose: 'Load 180 mg PO, then 90 mg PO twice daily (60 mg twice daily after one year). Always follow the order.',
  give: ['Give with low-dose aspirin only (81 mg or less).', 'May crush and give by NG tube if needed.', 'Time-critical; never skip or stop without the cardiologist.'],
  watch: ['Bleeding signs, Hgb and platelets.', 'Dyspnea (common) and bradycardia.', 'Neuro checks and falls.'],
  hold: ['Hold and call for active bleeding, or before surgery (stop 5 days earlier per provider).', 'Hold and call for severe dyspnea or intracranial bleed signs.'],
  effects: ['Bleeding', 'Shortness of breath', 'Bruising', 'SERIOUS: major or intracranial bleeding', 'SERIOUS: bradycardia'],
  teach: 'Do not stop without your cardiologist. Report black stools, bleeding or severe dyspnea.', alert: true, lasa: 'Brilinta vs Brintellix (Trintellix); ticagrelor vs ticlopidine' });

DrugGuide.add('timolol', { aliases: ['timoptic', 'timolol ophthalmic'], brand: 'Timoptic', cls: 'Beta blocker eye drop',
  use: 'Lowers eye pressure in glaucoma.',
  dose: '1 drop in the affected eye(s) once or twice daily (0.25% or 0.5%). Always follow the order.',
  give: ['Wash hands; tilt head back, pull lower lid, avoid touching the tip.', 'Press on the inner corner of the eye for 1-2 min.', 'Wait 5 min before other eye drops.'],
  watch: ['HR and respiratory status (systemic absorption).', 'Eye irritation.', 'Intraocular pressure per provider.'],
  hold: ['Hold for HR < 50-60 or wheezing and call.', 'Hold and call for signs of heart block or severe asthma.'],
  effects: ['Eye stinging', 'Blurred vision', 'Dry eyes', 'SERIOUS: bradycardia', 'SERIOUS: bronchospasm in asthma/COPD'],
  teach: 'Close the eye and press the corner after the drop. Report wheezing or slow pulse.', alert: false, lasa: 'Timolol vs atenolol; Timoptic vs Viroptic; 0.25% vs 0.5%' });

DrugGuide.add('topiramate', { aliases: ['topamax'], brand: 'Topamax', cls: 'Anticonvulsant',
  use: 'Treats seizures and prevents migraine.',
  dose: '25-200 mg PO twice daily; titrate slowly. Always follow the order.',
  give: ['May give with or without food.', 'Swallow tablets whole (bitter taste); sprinkle capsules on soft food.', 'Increase fluids; do not stop suddenly.'],
  watch: ['Bicarbonate (metabolic acidosis) and kidney stones.', 'Cognition, mood and vision/eye pain.', 'Weight and appetite.'],
  hold: ['Hold and call for acute eye pain or vision change.', 'Hold and call for severe confusion or low bicarbonate.'],
  effects: ['Tingling', 'Weight loss', 'Word-finding trouble', 'Drowsiness', 'SERIOUS: acute angle-closure glaucoma, metabolic acidosis'],
  teach: 'Drink plenty of fluids. Report eye pain, mood change or confusion. Do not stop suddenly.', alert: false, lasa: 'Topamax vs Toprol-XL; topiramate vs tapentadol' });

DrugGuide.add('triamcinolone', { aliases: ['kenalog', 'aristocort', 'triamcinolone cream', 'triamcinolone ointment'], brand: 'Kenalog, Aristocort', cls: 'Topical corticosteroid (medium potency)',
  use: 'Reduces inflammation and itching in skin conditions such as eczema.',
  dose: 'Apply a thin layer to affected skin two to three times daily (0.1% cream or ointment). Always follow the order.',
  give: ['Wear gloves; apply a thin film and rub in gently.', 'Do not cover with occlusive dressings unless ordered.', 'Avoid face, groin and axilla unless ordered.'],
  watch: ['Skin improvement and signs of infection.', 'Thinning, striae or irritation.', 'Duration of use.'],
  hold: ['Hold and call for infection signs (pus, spreading redness).', 'Stop and call for worsening rash or burning.'],
  effects: ['Burning or itching', 'Dryness', 'Skin thinning', 'SERIOUS: skin atrophy and adrenal suppression with prolonged use'],
  teach: 'Use only on the affected area for the time prescribed, and wash hands afterward.', alert: false, lasa: 'Triamcinolone 0.1% vs 0.025%; Kenalog-10 vs -40 (injection)' });

DrugGuide.add('urea', { aliases: ['urea powder', 'ure-na', 'carmol'], brand: 'Ure-Na', cls: 'Osmotic agent / oral urea',
  use: 'Raises sodium in SIADH and hyponatremia by increasing free water loss.',
  dose: '15-60 g PO daily mixed in liquid. Always follow the order.',
  give: ['Mix powder in about 60-120 mL of juice, soda or water to mask the taste.', 'Give with food if upset stomach.', 'Do not give if the patient cannot swallow.'],
  watch: ['Serum Na (do not correct > 8-10 mEq/L in 24 h), BUN and creatinine.', 'Urine output.', 'Fluid balance and mental status.'],
  hold: ['Hold and call for Na rising too quickly or BUN rising.', 'Hold for dehydration or kidney injury.'],
  effects: ['Bad taste', 'Nausea', 'Diarrhea', 'Thirst', 'SERIOUS: dehydration, rapid sodium rise, high BUN'],
  teach: 'Mix with juice or soda. Follow the fluid and sodium plan the team gave you.', alert: false, lasa: 'Urea vs urea-containing creams' });

DrugGuide.add('vancomycin', { aliases: ['vancocin', 'vancomycin iv', 'vancomycin oral'], brand: 'Vancocin', cls: 'Glycopeptide antibiotic',
  use: 'Treats serious MRSA and other gram-positive infections; oral form treats C. difficile.',
  dose: 'IV 15-20 mg/kg every 8-12 h, dosed by pharmacy; PO 125 mg four times daily for C. difficile. Always follow the order.',
  give: ['Infuse IV over at least 60 min (max 1 g/h); fast infusion causes red man syndrome.', 'Draw trough or AUC level as ordered before the dose.', 'Use a pump and watch for infiltration.'],
  watch: ['Creatinine, BUN and urine output.', 'Trough (goal about 10-20 mcg/mL) or AUC per pharmacy.', 'Flushing, rash, hearing changes.'],
  hold: ['Hold and call for rising creatinine or high trough before the dose.', 'Stop infusion and call for flushing, rash or hypotension (slow the rate).'],
  effects: ['Red man syndrome (flushing)', 'Phlebitis', 'Rash', 'SERIOUS: kidney injury', 'SERIOUS: hearing loss, low WBC'],
  teach: 'Report itching, flushing, ringing in the ears or less urine.', alert: false, lasa: 'Vancomycin vs vecuronium/Vasotec; IV vs oral not interchangeable' });

DrugGuide.add('venlafaxine', { aliases: ['effexor', 'effexor xr', 'venlafaxine er'], brand: 'Effexor XR', cls: 'SNRI antidepressant',
  use: 'Treats depression, generalized anxiety and panic disorder.',
  dose: 'ER 37.5-225 mg PO once daily. Always follow the order.',
  give: ['Give with food, same time daily.', 'ER capsules whole; may open and sprinkle on applesauce, never crush or chew.', 'Do not stop suddenly.'],
  watch: ['BP (can increase), HR and mood.', 'Suicidal thoughts, serotonin syndrome signs.', 'Sodium and discontinuation symptoms.'],
  hold: ['Hold and call for sustained hypertension (e.g., SBP > 180) or suicidal thoughts.', 'Hold and call for fever, tremor and agitation.'],
  effects: ['Nausea', 'Sweating', 'Dizziness', 'High blood pressure', 'SERIOUS: serotonin syndrome, hyponatremia'],
  teach: 'It takes weeks to work. Do not stop suddenly. Report mood changes.', alert: false, lasa: 'Effexor vs Effexor XR; venlafaxine vs desvenlafaxine' });

DrugGuide.add('warfarin', { aliases: ['coumadin', 'jantoven'], brand: 'Coumadin, Jantoven', cls: 'Anticoagulant (vitamin K antagonist)',
  use: 'Prevents blood clots in atrial fibrillation, DVT/PE and mechanical valves.',
  dose: '2-10 mg PO daily in the evening, adjusted to INR (goal usually 2-3). Always follow the order.',
  give: ['Check the latest INR before each dose.', 'Give at the same time each day, usually evening.', 'Keep vitamin K intake consistent; many drug interactions.'],
  watch: ['INR daily in hospital; bleeding signs, bruising, black stools.', 'Hgb and platelets.', 'Falls and head injury.'],
  hold: ['Hold and call for INR above goal (e.g., > 3.0-4.0, per order) or any bleeding.', 'Hold before procedures per provider.'],
  effects: ['Bruising', 'Nosebleeds', 'Bleeding gums', 'SERIOUS: major or intracranial bleeding', 'SERIOUS: skin necrosis'],
  teach: 'Keep consistent amounts of leafy greens, keep INR visits, and report any bleeding or falls.', alert: true, lasa: 'Warfarin vs Coumadin vs Cardura; vitamin K is the antidote' });

DrugGuide.add('zinc oxide', { aliases: ['zinc oxide barrier', 'desitin', 'calmoseptine', 'barrier cream', 'diaper rash cream', 'zinc oxide 20%'], brand: 'Desitin, Calmoseptine', cls: 'Topical skin protectant / barrier',
  use: 'Protects skin from moisture, urine and stool (incontinence-associated dermatitis, diaper rash).',
  dose: 'Apply a thick layer to clean dry skin with each brief change or at least twice daily. Always follow the order.',
  give: ['Clean and pat dry the skin first; wear gloves.', 'Do not scrub off with each change; remove only soiled top layer.', 'Do not apply on infected or weeping open wounds unless ordered.'],
  watch: ['Skin redness, breakdown or yeast signs (satellite rash).', 'Pressure injury risk.', 'Continence status.'],
  hold: ['Hold and call for infected-looking, weeping or worsening skin.', 'Call if rash is not improving in 7 days.'],
  effects: ['Mild skin irritation', 'Rare allergic reaction', 'Messy', 'SERIOUS: allergic rash (uncommon)'],
  teach: 'Keep skin clean and dry and reapply after cleaning. Report open skin or worsening redness.', alert: false, lasa: '' });

DrugGuide.add('zolpidem', { aliases: ['ambien', 'ambien cr', 'edluar'], brand: 'Ambien', cls: 'Sedative-hypnotic',
  use: 'Short-term treatment of insomnia.',
  dose: '5 mg PO at bedtime for women and older adults, 5-10 mg for men; ER 6.25-12.5 mg. Always follow the order.',
  give: ['Give right at bedtime when ready for 7-8 h of sleep; do not give with or right after a meal.', 'Swallow ER whole.', 'Use bed alarm and fall precautions.'],
  watch: ['Sedation, RR and confusion.', 'Falls and next-day drowsiness.', 'Complex sleep behaviors (sleep-walking or eating).'],
  hold: ['Hold and call for oversedation or RR < 12.', 'Hold if the patient cannot stay in bed for a full night.'],
  effects: ['Drowsiness', 'Dizziness', 'Headache', 'SERIOUS: complex sleep behaviors', 'SERIOUS: respiratory depression with opioids/alcohol'],
  teach: 'Take only when ready to sleep a full night. Do not drive after. Avoid alcohol.', alert: false, lasa: 'Ambien vs Amen/Ativan; zolpidem vs zolmitriptan' });

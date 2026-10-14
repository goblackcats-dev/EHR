/* drug guide entries, part 1 */
(() => {
const A = (k, d) => DrugGuide.add(k, d);

A('sodium chloride 0.9%', { aliases: ['0.9% sodium chloride', 'normal saline', 'nss', 'ns'], brand: 'Normal Saline (NS)', cls: 'isotonic crystalloid IV fluid',
  use: 'Replaces fluid and sodium losses, expands volume, and keeps IV lines open or carries IV medications.',
  dose: 'Rate and volume vary (bolus 250 to 1,000 mL or maintenance 75 to 125 mL/h) IV. Always follow the order.',
  give: ['Use an infusion pump and check the rate against the order.', 'Check the bag label: 0.9% is isotonic, 0.45% is not.', 'Check the IV site for infiltration or phlebitis.'],
  watch: ['Lung sounds, edema, JVD, and intake and output for fluid overload.', 'Sodium and chloride; BP and HR.', 'Daily weight in long infusions.'],
  hold: ['Stop and call for crackles, shortness of breath, or new edema.', 'Call for sodium above 145 or rapidly rising weight.', 'Use caution in heart failure and kidney disease.'],
  effects: ['Fluid overload', 'Hyperchloremic metabolic acidosis with large volumes', 'Hypernatremia', 'SERIOUS: pulmonary edema, heart failure worsening'],
  teach: 'Tell the patient this fluid is replacing body fluid. Report swelling at the IV site, cough, or trouble breathing.', alert: false, lasa: 'Check the strength: 0.9% vs 0.45% vs 3% sodium chloride.' });

A('sodium chloride flush', { aliases: ['0.9% sodium chloride flush', 'saline flush', 'normal saline flush'], brand: 'Saline flush syringe', cls: 'IV line flush',
  use: 'Clears an IV line before and after medications to confirm patency and prevent mixing of incompatible drugs.',
  dose: 'Usually 3 to 10 mL IV before and after each medication or per policy. Always follow the order.',
  give: ['Use the push-pause technique to clean the lumen.', 'Scrub the hub for 15 seconds before access.', 'Use a prefilled single-use syringe; flush slowly with no resistance.'],
  watch: ['Resistance, pain, or swelling at the site.', 'Blood return and line patency.', 'Flush volume in patients on fluid restriction.'],
  hold: ['Stop if you meet resistance; never force a flush.', 'Do not use if the site is swollen or painful; call the provider.', 'Use only preservative-free saline in neonates.'],
  effects: ['Infiltration', 'Phlebitis', 'SERIOUS: clot or air embolus if the line is forced or air is not cleared'],
  teach: 'Tell the patient you are flushing the IV to keep it working. Report pain or burning with the flush.', alert: false, lasa: '' });

A('sodium chloride 0.9% with thiamine, folic acid and multivitamin', { aliases: ['0.9% sodium chloride 1,000 ml with thiamine', 'banana bag', 'rescue bag'], brand: 'Banana bag (mixed IV)', cls: 'IV fluid with B vitamins and multivitamin',
  use: 'Replaces fluid and vitamins in malnourished patients, commonly with alcohol use disorder, and helps prevent Wernicke encephalopathy.',
  dose: '1,000 mL over several hours IV with thiamine 100 mg, folic acid 1 mg, multivitamin. Always follow the order.',
  give: ['Protect the bag from light if the label says so.', 'Give thiamine before or with any dextrose-containing fluid.', 'Infuse by pump at the ordered rate; the bag looks yellow from the vitamins.'],
  watch: ['Allergy or reaction to thiamine, especially with first doses.', 'Mental status, nystagmus, gait.', 'Magnesium, potassium, phosphate, glucose.'],
  hold: ['Stop and call for rash, wheeze, or low BP.', 'Call for crackles or edema (overload).', 'Call if the label or additives do not match the order.'],
  effects: ['Bright yellow urine', 'Flushing or warmth', 'Fluid overload', 'SERIOUS: anaphylaxis (rare, with IV thiamine)'],
  teach: 'Explain that the vitamins replace what the body is missing. Report itching, shortness of breath, or dizziness.', alert: false, lasa: '' });

A('sodium chloride 0.9% with potassium chloride', { aliases: ['0.9% sodium chloride with potassium chloride 20 meq/l', '0.45% sodium chloride with potassium chloride 20 meq/l', 'sodium chloride with potassium chloride', 'potassium chloride in sodium chloride'], brand: 'NS or 1/2 NS with KCl 20 mEq/L', cls: 'IV fluid with potassium',
  use: 'Maintenance hydration that also replaces or prevents low potassium.',
  dose: 'Usually 75 to 125 mL/h IV; potassium 20 mEq/L. Peripheral rate limit is generally 10 mEq/h. Always follow the order.',
  give: ['Use an infusion pump; never push or bolus potassium.', 'Verify urine output before starting (at least 0.5 mL/kg/h).', 'Check the label for 0.9% vs 0.45% and for the KCl concentration.'],
  watch: ['Serum potassium, creatinine, and urine output.', 'ECG changes (peaked T waves with high K, flat T or U waves with low K).', 'IV site for burning or infiltration; lung sounds.'],
  hold: ['Hold and call if K is above 5.0 or urine output is low.', 'Call for IV site pain or burning.', 'Call for muscle weakness or irregular heartbeat.'],
  effects: ['Vein irritation and burning', 'Fluid overload', 'SERIOUS: hyperkalemia, cardiac arrhythmias'],
  teach: 'Tell the patient this fluid may burn slightly in the vein. Report muscle weakness, palpitations, or pain at the IV site.', alert: true, lasa: 'Potassium concentration: confirm mEq/L on the bag.' });

A('sodium chloride 3%', { aliases: ['3% sodium chloride', '3% sodium chloride rescue', 'hypertonic saline', '3% saline'], brand: 'Hypertonic saline 3%', cls: 'hypertonic IV fluid',
  use: 'Raises serum sodium in severe symptomatic hyponatremia and lowers intracranial pressure in selected patients.',
  dose: 'Bolus 100 to 150 mL IV over 10 to 20 minutes, or continuous infusion per protocol. Always follow the order.',
  give: ['Use an infusion pump with a second nurse check of the order.', 'Central line preferred; peripheral only per policy and with close site checks.', 'Do not raise sodium faster than the ordered limit (often 8 mEq/L in 24 h).'],
  watch: ['Serum sodium every 2 to 4 hours or per order.', 'Neuro checks, seizures, level of consciousness.', 'Lung sounds, edema, intake and output.'],
  hold: ['Stop and call if sodium rises faster than ordered or reaches the target.', 'Call for crackles, respiratory distress, or new neuro changes.', 'Call for IV site swelling or pain.'],
  effects: ['Vein irritation', 'Fluid overload', 'Hypernatremia', 'SERIOUS: osmotic demyelination from correcting sodium too fast, pulmonary edema'],
  teach: 'Tell the patient and family that blood tests will be frequent. Report headache, confusion, or trouble breathing.', alert: true, lasa: 'Do not confuse 3% with 0.9% saline.' });

A('dextrose 10% in water', { aliases: ['dextrose 10%', 'd10w', 'd10'], brand: 'D10W', cls: 'hypertonic carbohydrate IV fluid',
  use: 'Supplies calories and treats hypoglycemia when the patient cannot take oral glucose.',
  dose: 'Rate per order (often 50 to 125 mL/h); hypoglycemia rescue per protocol IV. Always follow the order.',
  give: ['Use a pump; central line is preferred for long infusions.', 'Never stop abruptly; taper or check glucose after stopping.', 'Give thiamine first in alcohol use disorder or malnutrition.'],
  watch: ['Blood glucose per order and after hypoglycemia treatment.', 'Sodium, potassium, phosphate, and fluid status.', 'IV site for phlebitis or infiltration.'],
  hold: ['Call if glucose is above 180 or below 70 after treatment.', 'Call for signs of overload or hyponatremia (headache, confusion).', 'Call for site pain or swelling.'],
  effects: ['Hyperglycemia', 'Vein irritation', 'Hypokalemia and hypophosphatemia', 'SERIOUS: rebound hypoglycemia if stopped suddenly, hyponatremia'],
  teach: 'Explain that this fluid gives sugar and fluid. Report shakiness, sweating, or confusion.', alert: false, lasa: 'Check the strength: D5W vs D10W vs D50.' });

A('dextrose 5% in sodium chloride 0.9%', { aliases: ['dextrose 5% in 0.9% sodium chloride', 'd5ns', 'd5 ns'], brand: 'D5NS', cls: 'hypertonic IV fluid with carbohydrate and electrolytes',
  use: 'Maintenance fluid that gives some calories, sodium, and chloride.',
  dose: 'Usually 75 to 125 mL/h IV. Always follow the order.',
  give: ['Use an infusion pump and check the rate.', 'Check glucose in diabetic patients.', 'Check the IV site for infiltration or phlebitis.'],
  watch: ['Blood glucose, sodium, and potassium.', 'Lung sounds, edema, intake and output.', 'Daily weight.'],
  hold: ['Call for glucose above 180 or crackles and dyspnea.', 'Call for sodium above 145.', 'Use caution in heart failure and kidney disease.'],
  effects: ['Hyperglycemia', 'Fluid overload', 'Vein irritation', 'SERIOUS: pulmonary edema, hypernatremia'],
  teach: 'Tell the patient this fluid supplies sugar, salt, and water. Report swelling, cough, or breathing trouble.', alert: false, lasa: '' });

A('dextrose 5% in sodium chloride 0.45% with potassium chloride', { aliases: ['dextrose 5% in 0.45% sodium chloride with potassium chloride 20 meq/l', 'dextrose 5% in 0.45% sodium chloride with potassium chloride', 'd5 1/2 ns with kcl', 'd5 0.45 ns kcl'], brand: 'D5 1/2NS with KCl 20 mEq/L', cls: 'IV fluid with dextrose, sodium, and potassium',
  use: 'Maintenance hydration with calories that also replaces or prevents low potassium.',
  dose: 'Usually 75 to 125 mL/h IV; potassium 20 mEq/L; peripheral limit about 10 mEq/h. Always follow the order.',
  give: ['Use an infusion pump; never bolus.', 'Confirm adequate urine output before starting.', 'Check the bag label for strength and KCl amount.'],
  watch: ['Serum potassium, sodium, creatinine, glucose.', 'ECG changes and urine output.', 'IV site for burning or infiltration.'],
  hold: ['Hold and call if K is above 5.0 or urine output is low.', 'Call for glucose above 180.', 'Call for site pain, muscle weakness, or palpitations.'],
  effects: ['Vein burning', 'Hyperglycemia', 'Fluid overload', 'SERIOUS: hyperkalemia, arrhythmias'],
  teach: 'Tell the patient it may sting in the vein. Report weakness, palpitations, or pain at the IV.', alert: true, lasa: 'Confirm potassium concentration on the label.' });

A('abiraterone', { aliases: ['zytiga', 'yonsa'], brand: 'Zytiga', cls: 'CYP17 inhibitor (antiandrogen)',
  use: 'Treats metastatic prostate cancer together with prednisone.',
  dose: '1,000 mg by mouth once daily on an empty stomach with prednisone 5 mg (Zytiga). Always follow the order.',
  give: ['Give on an empty stomach: 1 hour before or 2 hours after food.', 'Swallow whole with water; do not crush.', 'Pregnant caregivers should not handle crushed or broken tablets.'],
  watch: ['Blood pressure, potassium, and edema.', 'Liver enzymes (AST, ALT, bilirubin).', 'Blood glucose.'],
  hold: ['Call for K below 3.5 or uncontrolled hypertension.', 'Call for ALT above 5 times normal or jaundice.', 'Do not skip the prednisone.'],
  effects: ['Hypertension and fluid retention', 'Hypokalemia', 'Hot flashes, joint pain', 'SERIOUS: liver toxicity, adrenal insufficiency'],
  teach: 'Take on an empty stomach and never double up. Report leg swelling, yellow skin, or dark urine.', alert: true, lasa: 'Do not confuse with anastrozole or aripiprazole.' });

A('acetaminophen', { aliases: ['tylenol', 'apap', 'paracetamol'], brand: 'Tylenol', cls: 'analgesic and antipyretic',
  use: 'Treats mild to moderate pain and fever.',
  dose: '325 to 1,000 mg PO/PR/IV every 4 to 6 h; maximum 3 to 4 g per day from all sources. Always follow the order.',
  give: ['Check for acetaminophen in other combination drugs and count it toward the daily total.', 'IV: infuse over 15 minutes.', 'May give with or without food.'],
  watch: ['Temperature and pain score before and after.', 'Total daily dose; liver enzymes with long use.', 'Alcohol use and liver disease.'],
  hold: ['Hold and call if the daily maximum would be exceeded.', 'Call for AST/ALT elevation or jaundice.', 'Call for allergy or rash.'],
  effects: ['Usually well tolerated', 'Nausea', 'Rash', 'SERIOUS: liver failure with overdose, severe skin reactions'],
  teach: 'Do not take other products with acetaminophen. Report yellow skin or dark urine.', alert: false, lasa: 'Do not confuse IV mg vs mL dosing; check the concentration.' });

A('acyclovir', { aliases: ['zovirax'], brand: 'Zovirax', cls: 'antiviral',
  use: 'Treats herpes simplex, varicella zoster (shingles), and herpes encephalitis.',
  dose: '200 to 800 mg PO 2 to 5 times daily, or 5 to 10 mg/kg IV every 8 h. Always follow the order.',
  give: ['IV: infuse over at least 1 hour; never push.', 'Hydrate well to prevent crystals in the kidney.', 'PO may be taken with or without food.'],
  watch: ['Creatinine, BUN, and urine output.', 'Neuro status (confusion, tremor).', 'IV site (phlebitis).'],
  hold: ['Call for rising creatinine or low urine output.', 'Call for confusion, hallucinations, or seizures.', 'Dose adjustment is needed in kidney disease.'],
  effects: ['Nausea, headache', 'Phlebitis at the IV site', 'SERIOUS: acute kidney injury, neurotoxicity'],
  teach: 'Drink plenty of fluids and finish the course. Report decreased urine or confusion.', alert: false, lasa: 'Do not confuse with famciclovir or valacyclovir.' });

A('adenosine', { aliases: ['adenocard', 'adenoscan'], brand: 'Adenocard', cls: 'antiarrhythmic',
  use: 'Converts supraventricular tachycardia (SVT) to normal sinus rhythm.',
  dose: '6 mg rapid IV push, then 12 mg if needed (may repeat once), each followed by a 20 mL saline flush. Always follow the order.',
  give: ['Use a proximal IV (antecubital) and push over 1 to 2 seconds.', 'Flush immediately with 20 mL of saline.', 'Continuous ECG and crash cart nearby; half-life is under 10 seconds.'],
  watch: ['Rhythm strip during and after the dose.', 'BP, HR, and symptoms.', 'Brief asystole is expected for a few seconds.'],
  hold: ['Do not give in second or third degree heart block or sick sinus without a pacemaker.', 'Use caution in severe asthma or COPD; call first.', 'Caffeine and theophylline reduce the effect; tell the provider.'],
  effects: ['Flushing', 'Chest pressure and shortness of breath', 'Brief pause or asystole', 'SERIOUS: prolonged asystole, bronchospasm'],
  teach: 'Warn the patient before the dose that they may feel flushing and chest tightness for a few seconds.', alert: false, lasa: 'Do not confuse with amiodarone or atropine.' });

A('albuterol', { aliases: ['albuterol continuous', 'albuterol hfa with spacer', 'albuterol rescue', 'proair', 'ventolin', 'proventil', 'salbutamol'], brand: 'ProAir, Ventolin', cls: 'short-acting beta-2 agonist bronchodilator',
  use: 'Relieves wheezing and shortness of breath in asthma and COPD.',
  dose: 'Inhaler 2 puffs every 4 to 6 h; nebulizer 2.5 mg every 4 to 6 h; continuous neb 10 to 15 mg/h in severe attacks. Always follow the order.',
  give: ['Use a spacer with the inhaler; shake it and wait 1 minute between puffs.', 'Continuous neb: continuous monitoring of HR and SpO2.', 'Give before other inhaled steroids.'],
  watch: ['Lung sounds, work of breathing, SpO2 before and after.', 'Heart rate and rhythm; tremor.', 'Potassium with frequent or continuous use.'],
  hold: ['Call for HR above 120 to 140 or chest pain.', 'Call for K below 3.5.', 'Call if there is no relief or worsening breathing.'],
  effects: ['Tremor and nervousness', 'Tachycardia', 'Headache', 'SERIOUS: arrhythmia, hypokalemia, paradoxical bronchospasm'],
  teach: 'Rinse the mouth after use and carry the rescue inhaler. Report chest pain or no relief from the inhaler.', alert: false, lasa: 'Do not confuse with atenolol or albumin.' });

A('alendronate', { aliases: ['fosamax'], brand: 'Fosamax', cls: 'bisphosphonate',
  use: 'Treats and prevents osteoporosis.',
  dose: '70 mg PO once weekly or 10 mg daily. Always follow the order.',
  give: ['Give first thing in the morning with a full glass (8 oz) of plain water.', 'Keep the patient upright for 30 minutes; no food, drink, or other drugs for 30 minutes.', 'Swallow whole.'],
  watch: ['Calcium, vitamin D, and kidney function.', 'Swallowing, chest pain, heartburn.', 'Dental health and thigh pain.'],
  hold: ['Hold and call if the patient cannot sit upright for 30 minutes.', 'Call for hypocalcemia or difficulty swallowing.', 'Do not give with CrCl below 35 without checking.'],
  effects: ['Heartburn, abdominal pain', 'Muscle and bone pain', 'SERIOUS: esophageal ulcer, jaw osteonecrosis, atypical thigh fracture'],
  teach: 'Take weekly on the same day, upright with water only. Report pain on swallowing or new thigh or jaw pain.', alert: false, lasa: 'Do not confuse with risedronate or alendronate vs Aldactone.' });

A('allopurinol', { aliases: ['zyloprim'], brand: 'Zyloprim', cls: 'xanthine oxidase inhibitor',
  use: 'Lowers uric acid to prevent gout attacks and kidney stones.',
  dose: '100 to 300 mg PO daily (up to 800 mg); start low. Always follow the order.',
  give: ['Give after meals with a full glass of water.', 'Encourage 2 to 3 L of fluid daily.', 'Do not start during an acute gout flare unless ordered.'],
  watch: ['Uric acid, creatinine, and liver enzymes.', 'Skin for rash.', 'CBC.'],
  hold: ['Stop and call for any rash.', 'Call for fever or mouth sores.', 'Reduce the dose in kidney disease.'],
  effects: ['Rash', 'Nausea', 'Gout flare early in treatment', 'SERIOUS: Stevens-Johnson syndrome, hypersensitivity, liver injury'],
  teach: 'Drink plenty of fluids and report any rash right away. It prevents attacks and is not for pain relief.', alert: false, lasa: 'Do not confuse with Zyloprim vs Zovirax or allopurinol vs haloperidol.' });

A('amlodipine', { aliases: ['norvasc'], brand: 'Norvasc', cls: 'calcium channel blocker (dihydropyridine)',
  use: 'Treats hypertension and chronic angina.',
  dose: '2.5 to 10 mg PO once daily. Always follow the order.',
  give: ['May give with or without food.', 'Swallow whole.', 'Check BP and HR before giving.'],
  watch: ['BP and HR before and after.', 'Peripheral edema.', 'Symptoms of angina.'],
  hold: ['Hold and call for SBP below 100.', 'Hold and call for HR below 50.', 'Call for severe swelling or dizziness.'],
  effects: ['Ankle edema', 'Dizziness, flushing, headache', 'Gum overgrowth', 'SERIOUS: severe hypotension, worsening angina'],
  teach: 'Rise slowly and report swelling in the feet. Do not stop suddenly.', alert: false, lasa: 'Do not confuse with amiodarone or amlodipine vs amantadine.' });

A('amoxicillin-clavulanate', { aliases: ['augmentin', 'amoxicillin clavulanate', 'amoxicillin/clavulanate'], brand: 'Augmentin', cls: 'penicillin with beta-lactamase inhibitor',
  use: 'Treats sinus, ear, skin, urinary, and respiratory bacterial infections.',
  dose: '500/125 mg PO every 8 h or 875/125 mg PO every 12 h. Always follow the order.',
  give: ['Give at the start of a meal to reduce stomach upset.', 'Check for penicillin allergy first.', 'Shake the suspension and refrigerate; use the exact product ordered.'],
  watch: ['Allergy signs: rash, hives, wheezing.', 'Diarrhea, including C. difficile.', 'Liver enzymes with long use.'],
  hold: ['Hold and call for rash, hives, or breathing trouble.', 'Call for severe or bloody diarrhea.', 'Call if the patient has a penicillin allergy.'],
  effects: ['Diarrhea', 'Nausea', 'Yeast infection', 'SERIOUS: anaphylaxis, C. difficile colitis, liver injury'],
  teach: 'Finish the full course and take with food. Report rash or watery diarrhea.', alert: false, lasa: 'Different strengths (875/125 and 500/125): the clavulanate amount differs.' });

A('anastrozole', { aliases: ['arimidex'], brand: 'Arimidex', cls: 'aromatase inhibitor',
  use: 'Treats hormone-receptor-positive breast cancer in postmenopausal women.',
  dose: '1 mg PO once daily. Always follow the order.',
  give: ['May give with or without food.', 'Give at the same time daily.', 'Hazardous drug; wear gloves when handling per policy.'],
  watch: ['Bone density and fracture risk.', 'Cholesterol.', 'Joint pain and mood.'],
  hold: ['Call for severe bone or joint pain.', 'Call for chest pain or leg swelling.', 'Not for premenopausal women or pregnancy.'],
  effects: ['Hot flashes', 'Joint and muscle pain', 'Fatigue', 'SERIOUS: osteoporosis and fractures, cardiovascular events'],
  teach: 'Take daily and continue even if you feel well. Weight-bearing exercise, calcium, and vitamin D help bones.', alert: false, lasa: 'Do not confuse with letrozole or anastrozole vs abiraterone.' });

A('antihemophilic factor, recombinant', { aliases: ['antihemophilic factor', 'factor viii', 'advate', 'kogenate', 'recombinate', 'xyntha'], brand: 'Advate, Kogenate', cls: 'clotting factor VIII replacement',
  use: 'Treats and prevents bleeding in hemophilia A.',
  dose: 'Dose in units is based on weight, desired factor level, and bleeding site (per pharmacy/provider) IV. Always follow the order.',
  give: ['Reconstitute exactly as the product label says; do not shake.', 'Use the supplied filter needle and infuse slowly (usually under 10 mL/min).', 'Give soon after mixing; check the expiration.'],
  watch: ['Bleeding, joint pain, swelling, and bruising.', 'Factor VIII level and inhibitor testing.', 'Infusion reactions.'],
  hold: ['Stop and call for hives, chest tightness, or wheezing.', 'Call if bleeding does not stop.', 'Call for fever or chills.'],
  effects: ['Headache', 'Dizziness or flushing', 'Infusion reaction', 'SERIOUS: anaphylaxis, inhibitor antibodies, clots'],
  teach: 'Report any bleeding or swelling in joints early. Keep a record of each dose.', alert: false, lasa: 'Do not confuse factor VIII with factor IX products.' });

A('apixaban', { aliases: ['eliquis'], brand: 'Eliquis', cls: 'direct oral anticoagulant (factor Xa inhibitor)',
  use: 'Prevents stroke in atrial fibrillation and treats or prevents DVT and PE.',
  dose: '2.5 to 5 mg PO twice daily (DVT/PE treatment: 10 mg twice daily for 7 days first). Always follow the order.',
  give: ['May give with or without food; tablets may be crushed per label.', 'Give at the same times each day, about 12 hours apart.', 'Never skip doses without a provider order.'],
  watch: ['Bleeding: stool, urine, gums, bruising.', 'Creatinine, hemoglobin, and platelets.', 'Falls and head injury.'],
  hold: ['Hold and call for active bleeding or before surgery or procedures.', 'Call for a fall with head strike.', 'Call for Hgb drop or new black stools.'],
  effects: ['Bruising', 'Nosebleeds', 'Nausea', 'SERIOUS: major bleeding, spinal hematoma with neuraxial procedures'],
  teach: 'Do not stop suddenly because the risk of stroke rises. Report any unusual bleeding and avoid NSAIDs.', alert: true, lasa: 'Do not confuse with Eliquis vs Eloquis or apixaban vs rivaroxaban.' });

A('areds2 multivitamin/mineral softgel', { aliases: ['areds2', 'areds 2', 'preservision', 'preservision areds2'], brand: 'PreserVision AREDS 2', cls: 'vitamin and mineral supplement (eye health)',
  use: 'Slows progression of intermediate age-related macular degeneration.',
  dose: '1 softgel PO twice daily. Always follow the order.',
  give: ['Give with meals to improve absorption.', 'Swallow whole.', 'Check the product matches the AREDS2 formulation.'],
  watch: ['Vision changes.', 'Smoking history (avoid beta-carotene formulas).', 'Stomach upset.'],
  hold: ['Call for rash or swelling.', 'Call for sudden vision loss.', 'Ask pharmacy if the patient takes other zinc or vitamin A.'],
  effects: ['Upset stomach', 'Yellow skin tint (rare)', 'Dark stools', 'Mild diarrhea'],
  teach: 'Take with food daily. It slows but does not cure macular degeneration.', alert: false, lasa: '' });

A('aripiprazole', { aliases: ['abilify'], brand: 'Abilify', cls: 'atypical antipsychotic',
  use: 'Treats schizophrenia, bipolar disorder, and adds on in major depression.',
  dose: '2 to 30 mg PO once daily. Always follow the order.',
  give: ['May give with or without food.', 'Same time every day.', 'Do not crush the extended-release forms.'],
  watch: ['Mental status, mood, and suicidal thoughts.', 'Weight, glucose, lipids.', 'Restlessness (akathisia) and abnormal movements.'],
  hold: ['Call for fever with rigid muscles (NMS).', 'Call for severe restlessness or new involuntary movements.', 'Call for SBP below 90 or fainting.'],
  effects: ['Akathisia, restlessness', 'Headache, nausea', 'Weight gain', 'SERIOUS: neuroleptic malignant syndrome, tardive dyskinesia, increased mortality in dementia'],
  teach: 'Do not stop suddenly. Report muscle stiffness, fever, or uncontrolled movements.', alert: false, lasa: 'Do not confuse with Abilify vs Ability or aripiprazole vs rabeprazole.' });

A('aspirin', { aliases: ['aspirin rectal', 'asa', 'ecotrin', 'bayer'], brand: 'Bayer, Ecotrin', cls: 'antiplatelet / NSAID',
  use: 'Prevents clots in heart disease and stroke; treats pain, fever, and acute coronary syndrome.',
  dose: '81 mg PO daily for prevention; 162 to 325 mg chewed for acute chest pain; 300 to 600 mg PR when oral route is not possible. Always follow the order.',
  give: ['For acute MI chew non-enteric tablets; do not swallow enteric-coated whole.', 'Give with food to reduce stomach upset.', 'Rectal suppository: insert past the sphincter and ask the patient to stay lying down.'],
  watch: ['Bleeding, black stools, bruising.', 'Platelets and hemoglobin.', 'Tinnitus and stomach pain.'],
  hold: ['Hold and call for active bleeding or planned surgery.', 'Hold and call for aspirin allergy or asthma triggered by NSAIDs.', 'Do not give to children with viral illness (Reye syndrome).'],
  effects: ['Stomach upset', 'Bruising', 'Tinnitus', 'SERIOUS: GI bleeding, hemorrhagic stroke, bronchospasm'],
  teach: 'Take with food and report black stools or ringing in the ears. Do not take extra NSAIDs.', alert: false, lasa: '' });

A('atomoxetine', { aliases: ['strattera'], brand: 'Strattera', cls: 'selective norepinephrine reuptake inhibitor',
  use: 'Treats attention-deficit/hyperactivity disorder (ADHD).',
  dose: '40 to 100 mg PO daily or divided; maximum 100 mg/day. Always follow the order.',
  give: ['Swallow capsules whole; do not open (eye irritant).', 'May give with or without food.', 'Morning dosing helps with insomnia.'],
  watch: ['BP, HR, and weight.', 'Suicidal thoughts, especially at start.', 'Liver symptoms.'],
  hold: ['Call for suicidal thoughts or new agitation.', 'Call for dark urine, itching, or jaundice.', 'Call for sustained SBP above 140 or HR above 110.'],
  effects: ['Nausea, dry mouth', 'Decreased appetite, insomnia', 'Increased BP and HR', 'SERIOUS: suicidal ideation, liver injury'],
  teach: 'It takes weeks to work. Report mood changes, thoughts of self-harm, or yellow skin.', alert: false, lasa: 'Do not confuse with atomoxetine vs atorvastatin or Strattera vs Strattice.' });

A('atorvastatin', { aliases: ['lipitor'], brand: 'Lipitor', cls: 'HMG-CoA reductase inhibitor (statin)',
  use: 'Lowers LDL cholesterol and reduces heart attack and stroke risk.',
  dose: '10 to 80 mg PO once daily. Always follow the order.',
  give: ['May give any time of day, with or without food.', 'Avoid large amounts of grapefruit juice.', 'Swallow whole.'],
  watch: ['Lipid panel and liver enzymes.', 'Muscle pain, weakness, dark urine.', 'CK if muscle symptoms.'],
  hold: ['Hold and call for unexplained muscle pain or weakness.', 'Call for ALT/AST more than 3 times normal.', 'Do not give in pregnancy or active liver disease.'],
  effects: ['Muscle aches', 'Headache, nausea', 'Elevated liver enzymes', 'SERIOUS: rhabdomyolysis, liver injury'],
  teach: 'Take daily with a heart-healthy diet. Report muscle pain or dark urine.', alert: false, lasa: 'Do not confuse with atenolol or Lipitor vs Zyrtec.' });

A('azathioprine', { aliases: ['imuran'], brand: 'Imuran', cls: 'immunosuppressant (antimetabolite)',
  use: 'Prevents transplant rejection and treats autoimmune diseases such as rheumatoid arthritis and Crohn disease.',
  dose: '1 to 3 mg/kg PO daily (typically 50 to 150 mg). Always follow the order.',
  give: ['Give with food to reduce nausea.', 'Hazardous drug; do not crush; wear gloves per policy.', 'Split doses if nausea.'],
  watch: ['CBC (WBC, platelets) and liver enzymes.', 'Signs of infection: fever, sore throat.', 'TPMT status when ordered.'],
  hold: ['Hold and call for WBC below 3,000 or platelets low.', 'Call for fever or infection signs.', 'Call for jaundice or severe vomiting.'],
  effects: ['Nausea and vomiting', 'Low white blood cells', 'Infection risk', 'SERIOUS: bone marrow suppression, pancreatitis, lymphoma'],
  teach: 'Avoid people who are sick and live vaccines. Report fever, bleeding, or yellow skin.', alert: false, lasa: 'Do not confuse with azathioprine vs azidothymidine, or Imuran vs Inderal.' });

A('azithromycin', { aliases: ['zithromax', 'z-pak', 'zpak'], brand: 'Zithromax', cls: 'macrolide antibiotic',
  use: 'Treats respiratory, skin, ear, and sexually transmitted bacterial infections.',
  dose: '500 mg PO/IV day 1 then 250 mg daily for 4 days; or 500 mg daily for 3 days. Always follow the order.',
  give: ['IV: dilute and infuse over at least 60 minutes (1 mg/mL over 3 h or 2 mg/mL over 1 h); never push.', 'PO tablets with or without food; suspension 1 hour before or 2 hours after antacids.', 'Complete the full course.'],
  watch: ['ECG QTc in at-risk patients.', 'Liver enzymes, diarrhea, rash.', 'Potassium and magnesium.'],
  hold: ['Call for QTc above 500 ms or palpitations.', 'Call for severe diarrhea or rash.', 'Call for jaundice.'],
  effects: ['Nausea, diarrhea', 'Abdominal pain', 'IV site pain', 'SERIOUS: QT prolongation, C. difficile colitis, liver injury'],
  teach: 'Finish all doses. Report fainting, fast heartbeat, or severe diarrhea.', alert: false, lasa: 'Do not confuse with erythromycin or azithromycin vs azathioprine.' });
})();

(() => {
const A = (k, d) => DrugGuide.add(k, d);

A('b-complex with vitamin c and folic acid', { aliases: ['b-complex', 'b complex', 'nephro-vite', 'renal vitamin', 'rena-vite'], brand: 'Nephro-Vite, Rena-Vite', cls: 'water-soluble vitamin supplement',
  use: 'Replaces water-soluble vitamins lost in dialysis and poor nutrition.',
  dose: '1 tablet PO daily (give after dialysis on dialysis days). Always follow the order.',
  give: ['Give after dialysis on dialysis days.', 'May give with food if upset stomach.', 'Swallow whole.'],
  watch: ['Nutrition status and labs (B12, folate).', 'Potassium and phosphorus if renal patient.', 'Rash or nausea.'],
  hold: ['Call for rash or itching.', 'Ask pharmacy about duplicate vitamin products.', 'Call if the patient cannot swallow the tablet.'],
  effects: ['Bright yellow urine (harmless)', 'Nausea', 'Mild stomach upset', 'Rare allergic reaction'],
  teach: 'Yellow urine is normal. Take daily and tell the team about other supplements.', alert: false, lasa: '' });

A('baclofen', { aliases: ['lioresal'], brand: 'Lioresal', cls: 'skeletal muscle relaxant (GABA-B agonist)',
  use: 'Reduces muscle spasticity from multiple sclerosis and spinal cord injury.',
  dose: '5 mg PO three times daily, titrated to 20 to 80 mg/day in divided doses. Always follow the order.',
  give: ['May give with food or milk.', 'Do not stop suddenly.', 'Fall precautions.'],
  watch: ['Sedation, muscle tone, and spasticity.', 'Respiratory rate and BP.', 'Kidney function (renally cleared).'],
  hold: ['Hold and call for excess sedation or RR below 12.', 'Call for confusion in kidney disease.', 'Never stop abruptly: risk of seizures and hallucinations.'],
  effects: ['Drowsiness, dizziness', 'Weakness', 'Nausea', 'SERIOUS: withdrawal seizures, respiratory depression'],
  teach: 'Avoid alcohol and driving until you know how it affects you. Do not stop suddenly.', alert: false, lasa: 'Do not confuse with Bactrim.' });

A('benzonatate', { aliases: ['tessalon', 'tessalon perles'], brand: 'Tessalon Perles', cls: 'non-narcotic antitussive',
  use: 'Relieves cough.',
  dose: '100 to 200 mg PO three times daily; maximum 600 mg/day. Always follow the order.',
  give: ['Swallow capsules whole; do not chew or crush.', 'May give with or without food.', 'Keep away from children.'],
  watch: ['Cough frequency and character.', 'Numbness in the mouth or throat.', 'Sedation.'],
  hold: ['Hold and call if the patient cannot swallow it whole.', 'Call for choking or numb throat.', 'Call for allergy signs.'],
  effects: ['Drowsiness', 'Headache', 'Constipation', 'SERIOUS: choking from mouth numbness, overdose in children'],
  teach: 'Never chew or suck on the capsule because it numbs the throat. Keep out of reach of children.', alert: false, lasa: '' });

A('bictegravir-emtricitabine-tenofovir alafenamide', { aliases: ['biktarvy', 'bictegravir'], brand: 'Biktarvy', cls: 'HIV integrase inhibitor combination',
  use: 'Treats HIV-1 infection as a complete once-daily regimen.',
  dose: '1 tablet (50/200/25 mg) PO once daily. Always follow the order.',
  give: ['May give with or without food.', 'Separate from antacids with aluminum/magnesium by 2 hours; take with food if with calcium or iron.', 'Do not miss doses; give at the same time daily.'],
  watch: ['HIV viral load and CD4 count.', 'Creatinine, liver enzymes, and hepatitis B status.', 'Adherence.'],
  hold: ['Call for hepatitis B flare symptoms if the drug is stopped.', 'Call for jaundice or severe kidney changes.', 'Do not stop without provider order.'],
  effects: ['Headache, nausea, diarrhea', 'Fatigue', 'Insomnia', 'SERIOUS: hepatitis B flare after stopping, lactic acidosis, kidney injury'],
  teach: 'Take daily; missing doses can cause resistance. Report yellow skin, severe nausea, or kidney symptoms.', alert: false, lasa: '' });

A('bisacodyl', { aliases: ['dulcolax'], brand: 'Dulcolax', cls: 'stimulant laxative',
  use: 'Treats constipation and prepares the bowel for procedures.',
  dose: '5 to 15 mg PO daily at bedtime, or 10 mg PR once daily. Always follow the order.',
  give: ['Do not crush or chew enteric tablets; avoid antacids or milk within 1 hour.', 'PO works in 6 to 12 hours; PR in 15 to 60 minutes.', 'Give with a full glass of water.'],
  watch: ['Bowel movements, bowel sounds, and abdominal pain.', 'Fluid and electrolyte status.', 'Cramping.'],
  hold: ['Hold and call for abdominal pain, nausea, vomiting, or suspected obstruction.', 'Hold for diarrhea.', 'Do not use daily for long periods.'],
  effects: ['Cramping', 'Diarrhea', 'Nausea', 'SERIOUS: dehydration and electrolyte loss with overuse'],
  teach: 'Drink plenty of fluids and eat fiber. Report severe belly pain or blood in the stool.', alert: false, lasa: 'Do not confuse with Bisacodyl vs Biscodyl or Dulcolax vs Dulcolax stool softener.' });

A('calcipotriene-betamethasone foam', { aliases: ['enstilar', 'taclonex', 'calcipotriene'], brand: 'Enstilar', cls: 'topical vitamin D analog with corticosteroid',
  use: 'Treats plaque psoriasis.',
  dose: 'Apply a thin layer to affected skin once daily for up to 4 weeks; maximum 100 g/week. Always follow the order.',
  give: ['Shake the can; dispense onto a clean gloved hand or directly on plaque.', 'Apply to affected areas only; avoid face, groin, and underarms.', 'Wash hands after; flammable, keep away from flame.'],
  watch: ['Skin response and thinning.', 'Calcium level with heavy use.', 'Signs of infection in the skin.'],
  hold: ['Do not use on broken or infected skin.', 'Call for burning or severe irritation.', 'Call for hypercalcemia symptoms.'],
  effects: ['Skin irritation, itching', 'Burning', 'Skin thinning', 'SERIOUS: hypercalcemia, adrenal suppression with overuse'],
  teach: 'Use only on plaques as directed and wash your hands afterward. Avoid fire or smoking while applying.', alert: false, lasa: '' });

A('calcitriol', { aliases: ['rocaltrol', 'calcijex'], brand: 'Rocaltrol', cls: 'active vitamin D',
  use: 'Treats low calcium and secondary hyperparathyroidism in kidney disease.',
  dose: '0.25 to 0.5 mcg PO daily; IV 0.5 to 4 mcg three times weekly with dialysis. Always follow the order.',
  give: ['May give with or without food.', 'IV: give by push after dialysis per policy.', 'Check calcium and phosphorus first.'],
  watch: ['Calcium, phosphorus, and PTH.', 'Symptoms of high calcium: nausea, thirst, confusion.', 'Kidney function.'],
  hold: ['Hold and call for calcium above 10.5 mg/dL.', 'Hold for high phosphorus per order.', 'Call for constipation or confusion.'],
  effects: ['Nausea', 'Constipation', 'Headache', 'SERIOUS: hypercalcemia, kidney stones, calcification'],
  teach: 'Follow your diet and phosphorus binder plan. Report thirst, nausea, or confusion.', alert: false, lasa: 'Do not confuse with calcitonin or calcium.' });

A('calcium carbonate', { aliases: ['tums', 'os-cal', 'oscal', 'calcium carbonate tablet'], brand: 'Tums, Os-Cal', cls: 'calcium supplement / antacid',
  use: 'Supplies calcium, treats low calcium, and relieves heartburn.',
  dose: '500 to 1,500 mg elemental calcium PO daily in divided doses, or antacid 500 to 1,000 mg as needed. Always follow the order.',
  give: ['Give with food for best absorption.', 'Separate from levothyroxine, fluoroquinolones, tetracyclines, and iron by 2 to 4 hours.', 'Chew tablets well or follow the product label.'],
  watch: ['Calcium level.', 'Constipation.', 'Kidney function.'],
  hold: ['Hold and call for calcium above 10.5 mg/dL.', 'Call for nausea, confusion, or kidney stones.', 'Check interactions with other drugs.'],
  effects: ['Constipation', 'Gas', 'Nausea', 'SERIOUS: hypercalcemia, kidney stones'],
  teach: 'Take with meals and drink water. Report constipation or kidney stone pain.', alert: false, lasa: 'Check carbonate vs citrate vs gluconate.' });

A('calcium carbonate-vitamin d', { aliases: ['calcium carbonate-vitamin d3', 'calcium carbonate with vitamin d', 'os-cal d', 'caltrate d'], brand: 'Os-Cal + D', cls: 'calcium and vitamin D supplement',
  use: 'Supports bone health and prevents or treats low calcium and vitamin D.',
  dose: '500 to 600 mg calcium with 200 to 800 IU vitamin D PO once or twice daily. Always follow the order.',
  give: ['Give with meals.', 'Separate from levothyroxine, quinolones, and iron by 2 to 4 hours.', 'Do not exceed 500 to 600 mg calcium per dose.'],
  watch: ['Calcium and vitamin D levels.', 'Constipation.', 'Kidney function.'],
  hold: ['Hold and call for calcium above 10.5 mg/dL.', 'Call for nausea or confusion.', 'Hold during hypercalcemia.'],
  effects: ['Constipation', 'Gas and bloating', 'Nausea', 'SERIOUS: hypercalcemia, kidney stones'],
  teach: 'Take with food and fluids. Report constipation or kidney stone pain.', alert: false, lasa: '' });

A('calcium citrate with vitamin d3', { aliases: ['calcium citrate', 'citracal'], brand: 'Citracal', cls: 'calcium and vitamin D supplement',
  use: 'Supports bone health; citrate is absorbed well without food or with acid blockers.',
  dose: '500 to 600 mg calcium with vitamin D3 200 to 800 IU PO once or twice daily. Always follow the order.',
  give: ['May give with or without food.', 'Separate from levothyroxine, quinolones, and iron by 2 to 4 hours.', 'Divide doses; absorb best at 500 mg or less at once.'],
  watch: ['Calcium and vitamin D levels.', 'Constipation.', 'Kidney function.'],
  hold: ['Hold and call for calcium above 10.5 mg/dL.', 'Call for nausea or confusion.', 'Check for kidney stones.'],
  effects: ['Constipation', 'Gas', 'Nausea', 'SERIOUS: hypercalcemia, kidney stones'],
  teach: 'Citrate form works well even without food. Drink water and report constipation.', alert: false, lasa: '' });

A('calcium gluconate', { aliases: ['calcium gluconate 10%', 'kalcinate'], brand: 'Calcium gluconate 10%', cls: 'electrolyte replacement / cardiac membrane stabilizer',
  use: 'Treats low calcium and protects the heart in severe hyperkalemia.',
  dose: '1 to 2 g (10 to 20 mL of 10%) IV over 10 to 60 minutes (emergency faster per protocol). Always follow the order.',
  give: ['Dilute and infuse by pump; never push rapidly outside emergencies.', 'Do not mix with ceftriaxone or phosphate-containing fluids.', 'Use ECG monitoring; extravasation causes tissue necrosis.'],
  watch: ['ECG and BP; heart rate drop during infusion.', 'Ionized or total calcium and magnesium.', 'IV site for infiltration.'],
  hold: ['Stop and call for bradycardia, arrhythmia, or site pain.', 'Use caution in patients on digoxin.', 'Call if calcium is above 10.5 mg/dL.'],
  effects: ['Warmth, flushing', 'Metallic taste', 'Nausea', 'SERIOUS: bradycardia, arrhythmias, tissue necrosis if infiltrated'],
  teach: 'Tell the patient they may feel warm or flushed. Report pain at the IV, tingling, or palpitations.', alert: true, lasa: 'Do not confuse calcium gluconate with calcium chloride (3 times more elemental calcium).' });

A('carbidopa-levodopa', { aliases: ['sinemet', 'carbidopa levodopa', 'carbidopa/levodopa'], brand: 'Sinemet', cls: 'dopamine precursor / decarboxylase inhibitor',
  use: 'Treats Parkinson disease symptoms: tremor, rigidity, and slow movement.',
  dose: '25/100 mg PO three times daily, titrated (up to 8 tablets/day of 25/100). Always follow the order.',
  give: ['Time-critical: give on schedule and do not delay.', 'High-protein meals reduce absorption; give 30 minutes before meals if tolerated.', 'Do not crush extended-release (CR); immediate-release may be split or crushed.'],
  watch: ['Tremor, rigidity, and gait before and after.', 'Orthostatic BP.', 'Hallucinations or involuntary movements.'],
  hold: ['Do not hold or stop suddenly; call if NPO to arrange alternatives.', 'Call for severe hypotension or hallucinations.', 'Call for new involuntary movements.'],
  effects: ['Nausea', 'Dizziness, orthostatic hypotension', 'Dyskinesia', 'SERIOUS: hallucinations, sudden sleep, withdrawal-like syndrome if stopped'],
  teach: 'Rise slowly and take on schedule. Urine and sweat may darken. Do not stop suddenly.', alert: false, lasa: 'Sinemet vs Sinequan; carbidopa-levodopa dose strengths vary.' });

A('carvedilol', { aliases: ['coreg'], brand: 'Coreg', cls: 'beta-blocker (alpha and beta)',
  use: 'Treats heart failure, hypertension, and left ventricular dysfunction after MI.',
  dose: '3.125 to 25 mg PO twice daily (up to 50 mg twice daily). Always follow the order.',
  give: ['Give with food to slow absorption and reduce dizziness.', 'Check apical pulse and BP before each dose.', 'Do not crush extended-release capsules.'],
  watch: ['HR and BP before and after.', 'Weight, edema, lung sounds in heart failure.', 'Blood glucose in diabetes (may mask hypoglycemia).'],
  hold: ['Hold and call for HR below 60 or SBP below 100.', 'Call for dizziness, fainting, or worsening swelling.', 'Do not stop suddenly.'],
  effects: ['Dizziness, fatigue', 'Bradycardia', 'Hypotension', 'SERIOUS: heart block, worsening heart failure, bronchospasm'],
  teach: 'Take with food and rise slowly. Do not stop suddenly; weigh daily and report gain of more than 2 to 3 lb in a day.', alert: false, lasa: 'Do not confuse with captopril or carvedilol vs Carafate.' });

A('cefazolin', { aliases: ['ancef', 'kefzol'], brand: 'Ancef', cls: 'first-generation cephalosporin',
  use: 'Treats skin, bone, urinary, and bloodstream infections and prevents surgical infection.',
  dose: '1 to 2 g IV every 8 h (surgical prophylaxis 2 g IV within 60 minutes before incision; 3 g if over 120 kg). Always follow the order.',
  give: ['IV push over 3 to 5 minutes or intermittent over 30 minutes.', 'Check for penicillin or cephalosporin allergy.', 'Give on time for surgical prophylaxis.'],
  watch: ['Allergy signs: rash, hives, wheeze.', 'Creatinine and urine output.', 'Diarrhea (C. difficile).'],
  hold: ['Hold and call for rash, hives, or breathing difficulty.', 'Call for severe diarrhea.', 'Dose adjustment for kidney impairment.'],
  effects: ['Diarrhea, nausea', 'Rash', 'IV site irritation', 'SERIOUS: anaphylaxis, C. difficile colitis'],
  teach: 'Tell staff about any antibiotic allergy. Report rash, itching, or watery diarrhea.', alert: false, lasa: 'Do not confuse with cefoxitin, ceftriaxone, or cefazolin vs cefuroxime.' });

A('cefepime', { aliases: ['maxipime'], brand: 'Maxipime', cls: 'fourth-generation cephalosporin',
  use: 'Treats serious infections including pneumonia, febrile neutropenia, urinary, and intra-abdominal infections.',
  dose: '1 to 2 g IV every 8 to 12 h (adjust for kidney function). Always follow the order.',
  give: ['Infuse over 30 minutes.', 'Check allergy history to penicillin and cephalosporins.', 'Renal dosing is important.'],
  watch: ['Neuro status: confusion, myoclonus, seizures, especially in kidney disease.', 'Creatinine.', 'Diarrhea.'],
  hold: ['Call for confusion, twitching, or seizures.', 'Hold and call for rash or breathing trouble.', 'Call for creatinine rise.'],
  effects: ['Diarrhea', 'Rash', 'Phlebitis', 'SERIOUS: encephalopathy and seizures, anaphylaxis, C. difficile colitis'],
  teach: 'Report confusion, muscle twitching, rash, or diarrhea.', alert: false, lasa: 'Do not confuse with cefazolin, cefixime, or cefepime vs cefoxitin.' });

A('cefpodoxime', { aliases: ['vantin'], brand: 'Vantin', cls: 'third-generation oral cephalosporin',
  use: 'Treats respiratory, urinary, skin, and ear infections.',
  dose: '100 to 400 mg PO every 12 h. Always follow the order.',
  give: ['Give tablets with food to improve absorption.', 'Separate from antacids and H2 blockers by 2 hours.', 'Shake and refrigerate suspension.'],
  watch: ['Allergy signs.', 'Diarrhea.', 'Creatinine.'],
  hold: ['Hold and call for rash or wheezing.', 'Call for severe diarrhea.', 'Check penicillin allergy first.'],
  effects: ['Diarrhea', 'Nausea', 'Headache', 'SERIOUS: anaphylaxis, C. difficile colitis'],
  teach: 'Take with food and finish the course. Report rash or watery diarrhea.', alert: false, lasa: 'Do not confuse with cefprozil or cefdinir.' });

A('ceftriaxone', { aliases: ['rocephin'], brand: 'Rocephin', cls: 'third-generation cephalosporin',
  use: 'Treats pneumonia, meningitis, gonorrhea, urinary, and other serious infections.',
  dose: '1 to 2 g IV or IM every 12 to 24 h (meningitis up to 2 g every 12 h). Always follow the order.',
  give: ['IV: infuse over 30 minutes; never mix or give with calcium-containing IV fluids in the same line.', 'IM: reconstitute with lidocaine only as ordered, inject deep.', 'Check penicillin allergy.'],
  watch: ['Allergy signs.', 'Diarrhea and rash.', 'Bilirubin in newborns; CBC and liver enzymes with long courses.'],
  hold: ['Hold and call for anaphylaxis signs.', 'Do not give with calcium IV solutions (precipitate).', 'Call for severe diarrhea.'],
  effects: ['Diarrhea', 'Injection site pain', 'Rash', 'SERIOUS: anaphylaxis, C. difficile colitis, biliary sludge'],
  teach: 'Tell staff about allergies. Report rash, breathing trouble, or watery diarrhea.', alert: false, lasa: 'Do not confuse with cefazolin or ceftazidime; Rocephin vs Roxicet.' });

A('cetirizine', { aliases: ['zyrtec'], brand: 'Zyrtec', cls: 'second-generation antihistamine',
  use: 'Relieves allergy symptoms and itching, such as hives and hay fever.',
  dose: '5 to 10 mg PO once daily. Always follow the order.',
  give: ['May give with or without food.', 'Give at the same time daily.', 'Chewable tablets should be chewed.'],
  watch: ['Allergy symptoms and itching.', 'Drowsiness.', 'Kidney function (reduce dose in renal impairment).'],
  hold: ['Call for severe sedation or confusion.', 'Call for urinary retention.', 'Call if symptoms worsen.'],
  effects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
  teach: 'May cause sleepiness; avoid alcohol and use caution when driving.', alert: false, lasa: 'Do not confuse Zyrtec with Zantac, Xanax, or Zyprexa.' });

A('chlorthalidone', { aliases: ['thalitone', 'hygroton'], brand: 'Thalitone', cls: 'thiazide-like diuretic',
  use: 'Treats hypertension and edema.',
  dose: '12.5 to 50 mg PO once daily in the morning. Always follow the order.',
  give: ['Give in the morning to avoid nighttime urination.', 'May give with food.', 'Check BP, weight, and potassium.'],
  watch: ['BP, daily weight, intake and output.', 'Potassium, sodium, glucose, and uric acid.', 'Signs of dehydration.'],
  hold: ['Hold and call for SBP below 100 or K below 3.5.', 'Call for sodium below 130.', 'Call for dizziness or severe cramps.'],
  effects: ['Frequent urination', 'Low potassium and sodium', 'Dizziness', 'SERIOUS: severe electrolyte imbalance, gout flare, arrhythmia'],
  teach: 'Take in the morning, rise slowly, and weigh daily. Report cramps, weakness, or fainting.', alert: false, lasa: 'Do not confuse with chlorpropamide or chlorthalidone vs chlorpromazine.' });

A('cholecalciferol', { aliases: ['vitamin d3', 'vitamin d', 'd3'], brand: 'Vitamin D3', cls: 'vitamin D supplement',
  use: 'Prevents and treats vitamin D deficiency and supports bone health.',
  dose: '1,000 to 4,000 IU PO daily (higher for deficiency per provider). Always follow the order.',
  give: ['Give with a meal containing some fat.', 'Swallow softgels whole.', 'Check the strength in IU.'],
  watch: ['25-OH vitamin D level.', 'Calcium level.', 'Nausea, constipation, and thirst.'],
  hold: ['Hold and call for calcium above 10.5 mg/dL.', 'Call for confusion or kidney stones.', 'Check duplicates in other supplements.'],
  effects: ['Usually well tolerated', 'Nausea', 'Constipation', 'SERIOUS: hypercalcemia with excess dosing'],
  teach: 'Take with a meal. Do not exceed the prescribed dose.', alert: false, lasa: 'IU vs mcg: confirm the units.' });

A('cilostazol', { aliases: ['pletal'], brand: 'Pletal', cls: 'phosphodiesterase-3 inhibitor (antiplatelet vasodilator)',
  use: 'Relieves leg pain with walking (intermittent claudication).',
  dose: '100 mg PO twice daily, 30 minutes before or 2 hours after meals. Always follow the order.',
  give: ['Give on an empty stomach.', 'Reduce the dose with CYP3A4/2C19 inhibitors.', 'Takes weeks to work.'],
  watch: ['Walking distance and leg pain.', 'Heart rate and signs of heart failure.', 'Bleeding.'],
  hold: ['Do not give in heart failure of any severity.', 'Hold and call for bleeding.', 'Call for chest pain or palpitations.'],
  effects: ['Headache', 'Diarrhea', 'Palpitations and fast heart rate', 'SERIOUS: heart failure worsening, bleeding'],
  teach: 'Take on an empty stomach and keep walking exercise. Report swelling, chest pain, or bleeding.', alert: false, lasa: 'Do not confuse with cilostazol vs cetirizine or Pletal vs Plendil.' });

A('cinacalcet', { aliases: ['sensipar'], brand: 'Sensipar', cls: 'calcimimetic',
  use: 'Lowers parathyroid hormone in dialysis patients and treats hypercalcemia in parathyroid cancer.',
  dose: '30 to 180 mg PO once daily. Always follow the order.',
  give: ['Give with food or shortly after a meal.', 'Swallow tablets whole.', 'Give at the same time daily.'],
  watch: ['Calcium (weekly early), phosphorus, and PTH.', 'Nausea and vomiting.', 'Symptoms of low calcium: tingling, cramps.'],
  hold: ['Hold and call for calcium below 8.4 mg/dL or tingling and cramps.', 'Hold for QT prolongation.', 'Call for severe vomiting.'],
  effects: ['Nausea and vomiting', 'Diarrhea', 'Muscle cramps', 'SERIOUS: hypocalcemia, seizures, QT prolongation'],
  teach: 'Take with food. Report tingling around the mouth, muscle cramps, or fast heartbeat.', alert: false, lasa: 'Sensipar vs Serophene.' });

A('ciprofloxacin', { aliases: ['cipro'], brand: 'Cipro', cls: 'fluoroquinolone antibiotic',
  use: 'Treats urinary, respiratory, GI, skin, and bone infections.',
  dose: '250 to 750 mg PO every 12 h or 400 mg IV every 8 to 12 h. Always follow the order.',
  give: ['Separate from dairy, calcium, iron, magnesium, and antacids by 2 hours before or 6 hours after.', 'IV: infuse over 60 minutes.', 'Hydrate well.'],
  watch: ['Tendon pain, especially Achilles.', 'Blood glucose, QTc, and mental status.', 'Diarrhea.'],
  hold: ['Hold and call for tendon pain or swelling.', 'Call for confusion, palpitations, or rash.', 'Call for severe diarrhea.'],
  effects: ['Nausea, diarrhea', 'Dizziness and insomnia', 'Photosensitivity', 'SERIOUS: tendon rupture, QT prolongation, C. difficile, dysglycemia, neuropathy'],
  teach: 'Stop and call for tendon pain. Avoid sun and take away from dairy or antacids.', alert: false, lasa: 'Do not confuse with Ciprodex or Cipro vs Cypro.' });

A('clindamycin topical', { aliases: ['clindamycin 1% topical', 'clindamycin 1%', 'cleocin t'], brand: 'Cleocin T', cls: 'topical lincosamide antibiotic',
  use: 'Treats acne vulgaris.',
  dose: 'Apply a thin layer to affected skin twice daily. Always follow the order.',
  give: ['Wash and dry the skin first.', 'Apply thin layer; avoid eyes, mouth, and broken skin.', 'Wash hands after; shake lotion or solution.'],
  watch: ['Skin irritation, dryness, and acne response.', 'Diarrhea (rare).', 'Allergic signs.'],
  hold: ['Call for severe or bloody diarrhea.', 'Call for severe skin irritation.', 'Hold for allergy to clindamycin or lincomycin.'],
  effects: ['Dryness, peeling', 'Oily skin', 'Mild burning', 'SERIOUS: C. difficile colitis (rare with topical)'],
  teach: 'Apply a thin layer and avoid eyes and mouth. Report severe diarrhea.', alert: false, lasa: 'Do not confuse topical with oral or IV clindamycin.' });

A('clopidogrel', { aliases: ['plavix'], brand: 'Plavix', cls: 'antiplatelet (P2Y12 inhibitor)',
  use: 'Prevents clots after heart attack, stent placement, and stroke.',
  dose: '75 mg PO daily (loading 300 to 600 mg once). Always follow the order.',
  give: ['May give with or without food.', 'Do not stop without cardiology approval, especially with a stent.', 'Hold before surgery only as ordered (often 5 to 7 days).'],
  watch: ['Bleeding and bruising.', 'Platelets and hemoglobin.', 'Interactions with omeprazole or esomeprazole.'],
  hold: ['Hold and call for active bleeding.', 'Call before surgery or procedures.', 'Call for black or bloody stools.'],
  effects: ['Bruising', 'Nosebleeds', 'Diarrhea', 'SERIOUS: major bleeding, thrombotic thrombocytopenic purpura'],
  teach: 'Never stop on your own, especially with a stent. Tell all providers and dentists that you take it.', alert: false, lasa: 'Plavix vs Paxil.' });

A('colchicine', { aliases: ['colcrys', 'mitigare'], brand: 'Colcrys', cls: 'anti-gout agent',
  use: 'Treats and prevents gout flares and treats familial Mediterranean fever.',
  dose: 'Flare: 1.2 mg then 0.6 mg an hour later; prevention 0.6 mg once or twice daily. Always follow the order.',
  give: ['May give with or without food.', 'Reduce dose in kidney and liver disease and with CYP3A4/P-gp inhibitors.', 'Avoid grapefruit juice.'],
  watch: ['Diarrhea, nausea, vomiting (early toxicity sign).', 'CBC and creatinine.', 'Muscle weakness.'],
  hold: ['Hold and call for severe diarrhea or vomiting.', 'Call for muscle pain or weakness.', 'Call for low blood counts.'],
  effects: ['Diarrhea, nausea', 'Abdominal cramps', 'Muscle pain', 'SERIOUS: bone marrow suppression, myopathy, fatal toxicity in overdose'],
  teach: 'Stop and call if you get severe diarrhea or vomiting. Do not take more than directed.', alert: false, lasa: 'Colchicine vs colestipol; Colcrys vs Cortrosyn.' });

A('cyanocobalamin', { aliases: ['vitamin b12', 'b12'], brand: 'Vitamin B12', cls: 'vitamin B12',
  use: 'Treats and prevents vitamin B12 deficiency and pernicious anemia.',
  dose: '1,000 mcg IM or deep subcutaneous daily to monthly, or 250 to 1,000 mcg PO daily. Always follow the order.',
  give: ['IM: inject deep into muscle.', 'PO may be taken with or without food.', 'Check potassium early in severe anemia.'],
  watch: ['B12 level, CBC, and reticulocyte count.', 'Potassium in the first days of treatment.', 'Neurologic symptoms.'],
  hold: ['Call for allergy signs.', 'Call for chest pain or irregular heartbeat.', 'Call for low potassium.'],
  effects: ['Injection site pain', 'Headache', 'Mild diarrhea', 'SERIOUS: hypokalemia at start, allergic reaction'],
  teach: 'Injections may be needed for life in pernicious anemia. Report numbness or weakness.', alert: false, lasa: '' });

A('cyclobenzaprine', { aliases: ['flexeril'], brand: 'Flexeril', cls: 'skeletal muscle relaxant',
  use: 'Relieves muscle spasm from acute strains and sprains.',
  dose: '5 to 10 mg PO three times daily for up to 2 to 3 weeks. Always follow the order.',
  give: ['May give with or without food.', 'Fall precautions.', 'Avoid in older adults per Beers criteria.'],
  watch: ['Sedation and confusion.', 'Heart rate and rhythm.', 'Urinary retention and constipation.'],
  hold: ['Hold and call for excess sedation.', 'Do not give with MAOIs or after a recent MI.', 'Call for confusion or fast heartbeat.'],
  effects: ['Drowsiness', 'Dry mouth', 'Dizziness', 'SERIOUS: serotonin syndrome with other serotonergic drugs, arrhythmia'],
  teach: 'Avoid alcohol and driving. Report fast heartbeat or confusion.', alert: false, lasa: 'Do not confuse with cyproheptadine.' });

A('desmopressin', { aliases: ['ddavp', 'stimate'], brand: 'DDAVP', cls: 'synthetic antidiuretic hormone (vasopressin analog)',
  use: 'Treats central diabetes insipidus, bedwetting, and mild hemophilia A or von Willebrand disease.',
  dose: 'DI: 0.1 to 0.2 mg PO two to three times daily or 1 to 4 mcg IV/SC daily; hemophilia 0.3 mcg/kg IV. Always follow the order.',
  give: ['IV: infuse over 15 to 30 minutes.', 'Restrict fluids as ordered.', 'Check sodium before giving.'],
  watch: ['Sodium, urine output, and urine specific gravity.', 'Daily weight and fluid intake.', 'Headache or confusion.'],
  hold: ['Hold and call for sodium below 135 or headache and confusion.', 'Call for edema and rapid weight gain.', 'Call for urine output that is too low.'],
  effects: ['Headache', 'Nausea', 'Flushing', 'SERIOUS: hyponatremia with seizures, water intoxication'],
  teach: 'Limit fluids as directed. Report headache, nausea, or confusion right away.', alert: false, lasa: 'DDAVP vs desmopressin vs vasopressin.' });

A('dexmedetomidine', { aliases: ['precedex'], brand: 'Precedex', cls: 'alpha-2 agonist sedative',
  use: 'Provides light to moderate sedation in ICU and procedures without major respiratory depression.',
  dose: 'Loading 1 mcg/kg over 10 minutes (often skipped), then 0.2 to 1.5 mcg/kg/h IV infusion. Always follow the order.',
  give: ['Continuous infusion by pump with a drug library; dilute as per pharmacy.', 'Continuous ECG, BP, and SpO2 monitoring.', 'Titrate by sedation scale; patient can be roused.'],
  watch: ['HR, BP, and sedation score (RASS).', 'Respiratory status.', 'Rebound hypertension on abrupt stop.'],
  hold: ['Call for HR below 50 or SBP below 90.', 'Reduce or stop and call for heart block or severe hypotension.', 'Wean gradually as ordered.'],
  effects: ['Bradycardia', 'Hypotension', 'Dry mouth', 'SERIOUS: heart block, cardiac arrest, hypertension on abrupt withdrawal'],
  teach: 'Tell the patient and family it provides calm sedation and they can be awakened. Report that it will be weaned.', alert: true, lasa: 'Precedex vs Percocet; dexmedetomidine vs dextroamphetamine.' });
})();

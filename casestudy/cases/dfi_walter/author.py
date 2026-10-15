#!/usr/bin/env python3
"""Authors content.json for the Walter Jennings case study (diabetic foot infection with osteomyelitis of the right first ray,
hospital day 3, NPO for first-ray amputation about 0800, then post-op). Contains the answer key.
Usage: python3 author.py content.json   then   python3 ../../build_casestudy.py content.json patient.json out/"""
import json, sys

E = lambda t, pts, src='': {'t': t, 'pts': pts, 'src': src}

meta = {'title': 'Clinical Care-Plan Case Study: Diabetic Foot Infection with Osteomyelitis, Before and After First-Ray Amputation',
        'course': 'ADN Med-Surg II', 'caseCode': 'CS-DFI-436-1', 'passPct': 78,
        'footer': 'Write one answer per numbered box, inside the box, in dark pen, neatly. Open book, individual work.'}

studentIntro = [
    {'h': 'Your patient', 'lines': [
        'You are the primary nurse for the patient in Medical-Surgical 4 East, room 436-1, on the 7:00 to 15:00 shift on Wednesday, October 21, 2026 (hospital day 3). '
        'Open the patient in the student EHR (Student View, or the patient file from your instructor) and set the simulation clock to 0700. '
        'Everything you need is in the chart. He is waiting to go to the operating room for surgery on an infected foot, and he has several other chronic illnesses. '
        'Work the way you would at the start of a real shift: before the surgery, while he is in the OR, and when he comes back.']},
    {'h': 'How this case study works', 'lines': [
        'This packet follows the nursing process: Assessment, Diagnosis, Planning, Implementation and Evaluation. You will also explain the pathophysiology and pharmacology behind your patient\'s care. '
        'Expect to spend about 5 hours. It is a take-home, individual, open-book assignment: use your textbooks, drug guide, notes and the chart.',
        'Questions ask you to explain WHY, not only WHAT. Short, specific answers that use this patient\'s data earn more points than general textbook answers. '
        'Real charts are imperfect: you will be asked to catch conflicts and to question orders and recommendations before you act.']},
]
studentRules = [
    {'h': 'Scoring', 'lines': ['The packet is worth 100 points. A score of 78 or higher is passing.',
                               'Each numbered item shows its point value. Points are given only for what is written in the box.']},
    {'h': 'Writing so your pages can be scored from photos', 'lines': [
        'Write in dark pen or very dark pencil, print clearly, and stay inside the box. Write the answer in the box with the same number as the question.',
        'Write your name and date at the top of every page (the header prints a line for it).',
        'If you need more room, write "continued on the back" and put the item number on the back. Do not squeeze writing between boxes.',
        'Do not use abbreviations that are not on the approved list. Spell out drug names.',
        'When you finish: photograph EVERY page, one page per photo, on a flat surface in good light with all four corners and the page number in view. Check that every photo is readable before you upload.']},
    {'h': 'Part 6 is sealed', 'lines': ['Do not read the sealed page at the start of Part 6 until Parts 1 to 5 are finished. Your plan must be based on what you knew at 0700.']},
]

# ------------------------------------------------------------------ PART 1
p1 = {'id': '1', 'title': 'Assessment: Patient Data and Chart Review', 'step': 'Assessment', 'minutes': 60,
      'intro': 'Collect and organize the data you would have at 0700. Where the chart does not document something, write "not documented." Use R and L for laterality.',
      'keyNote': 'Part 1 is mostly chart look-up, so it should be the easiest part to score. Students who read the chart carefully should earn 20 or more of these 26 points. The chart reconciliation (1.8) is the hardest item in this part.',
      'items': [
          {'id': '1.1', 'type': 'fields', 'points': 3, 'title': 'Basic Patient Information', 'where': 'Patient Summary and Storyboard', 'perRow': 2, 'labelW': 1.25, 'fields': [
              {'label': 'Room Number', 'answer': '436-1 (Medical-Surgical 4 East)', 'pts': 0.25}, {'label': 'Age', 'answer': '61', 'pts': 0.25},
              {'label': 'Gender', 'answer': 'Male', 'pts': 0.25}, {'label': 'Admission Date', 'answer': '10/19/26 (ED arrival about 0200; unit 0500)', 'pts': 0.25},
              {'label': 'Allergies (and reactions)', 'answer': 'Penicillin: hives (severity High). Both the drug and the reaction are required for 0.5.', 'pts': 0.5}, {'label': 'Chief Complaint', 'answer': 'Right foot ulcer with redness, swelling, drainage and fever', 'pts': 0.25},
              {'label': 'Primary Diagnosis', 'answer': 'Diabetic foot infection with osteomyelitis (right first metatarsal head and great toe); awaiting right first-ray amputation', 'pts': 0.5}, {'label': 'Code Status', 'answer': 'Full Code', 'pts': 0.25},
              {'label': 'Isolation', 'answer': 'Contact precautions (MRSA in the nares and wound)', 'pts': 0.25}, {'label': 'Height / Weight', 'answer': '178 cm / 108 kg (BMI 34.1)', 'pts': 0.25}]},
          {'id': '1.2', 'type': 'table', 'points': 3, 'title': 'Medical Diagnoses and How They Affect the Foot Infection and Healing',
           'prompt': 'List FOUR other medical diagnoses from this patient\'s chart. For each, explain how it affects his foot infection, his surgery or his healing.', 'where': 'Chart Review > H&P; Encounters > Hospital problem list',
           'cols': ['Medical diagnosis', 'How it affects the foot infection, the surgery or healing'], 'widths': [2.2, 4.8], 'rows': 4, 'rowH': 0.75,
           'key': {'answer': 'Any 4 of the diagnoses below. Each row 0.75: diagnosis is on the chart (0.25) AND the effect is accurate (0.5).', 'bank': True,
                   'elements': [
                       E('Type 2 diabetes (A1c 10.2%, glucose 336 on arrival): hyperglycemia weakens white-cell function and slows healing; peripheral neuropathy hides injury; raises surgical-site infection risk.', 0.75, 'H&P, labs'),
                       E('Peripheral neuropathy with loss of protective sensation (monofilament 0/4 sites R foot): he felt no pain from the ulcer and kept walking on it; also fall risk and hides post-op problems.', 0.75, 'Flowsheet'),
                       E('Peripheral arterial disease (ABI R 0.72, L 0.88; toe pressure 58 mmHg; pulses 1+, cap refill 3-4 s R foot): less blood, oxygen and antibiotic reaches the foot; slow healing; no SCDs or compression.', 0.75, 'H&P, arterial studies'),
                       E('Chronic kidney disease stage 3 (creatinine 1.98, eGFR 38; baseline about 1.8): drug dosing (vancomycin, carbapenems, enoxaparin, insulin), avoid nephrotoxins/contrast, vein preservation for IV access.', 0.75, 'H&P, labs'),
                       E('Obesity (BMI 34.1, 108 kg): skin folds, harder mobility and transfers (bariatric equipment), dosing, higher wound-complication risk.', 0.75, 'H&P'),
                       E('Hypertension (BP 147-160/80-88 this admission, above goal <140/90): lisinopril held while NPO; ACE inhibitor plus vancomycin raises kidney risk.', 0.75, 'H&P, vitals'),
                       E('Hyperlipidemia (atorvastatin): atherosclerosis that adds to PAD; statin continues for limb protection.', 0.75, 'H&P'),
                       E('Tobacco use (current, 1/2 pack per day): vasoconstriction and reduced oxygen delivery slow healing and raise amputation risk; nicotine patch ordered.', 0.75, 'Social history'),
                       E('MRSA colonization/infection (nares PCR positive): contact precautions; vancomycin needed; recurrence risk.', 0.75, 'Labs, orders'),
                       E('Anemia (Hgb 10.0, mildly low, falling from 10.8) and low albumin (3.1): reduced oxygen delivery and protein for healing.', 0.75, 'Labs')],
                   'rules': 'Maximum 3.0. Do not give credit for the same diagnosis twice. Do not give credit for the foot infection itself.'}},
          {'id': '1.3', 'type': 'boxes', 'points': 3, 'title': 'Patient History', 'where': 'H&P; ED Provider Note; Case Management Initial Assessment; Nursing Admission Note', 'subs': [
              {'label': 'Medical History:', 'lines': 3}, {'label': 'Surgical History:', 'lines': 1}, {'label': 'Family History:', 'lines': 2},
              {'label': 'Social History:', 'lines': 3}, {'label': 'Home Situation and Discharge Needs:', 'lines': 3}, {'label': 'Pre-Hospital Story of Patient:', 'lines': 3}],
           'key': {'elements': [
               E('Medical: at least 5 of: long-standing type 2 diabetes (home glucose in the 300s for a week), peripheral neuropathy, CKD stage 3, PAD with claudication, hypertension, hyperlipidemia, obesity, tobacco use.', 0.5, 'H&P'),
               E('Surgical: no prior surgeries (full credit for "none"; bedside sharp debridement 10/19 and planned amputation this admission are fine to add).', 0.5, 'H&P'),
               E('Family: mother hypertension and type 2 diabetes; father coronary artery disease; a brother with type 2 diabetes who had a toe amputation (need mother, father AND brother).', 0.5, 'H&P'),
               E('Social: at least 5 of: lives alone; works part-time as a delivery driver; current smoker 1/2 pack per day; occasional alcohol; no drug use; has not seen a podiatrist in 3 years; walks barefoot at home; limited home glucose checking.', 0.5, 'H&P, ED note'),
               E('Home/discharge: lives alone, independent at baseline; case management expects home with home health nursing (wound care, PICC/home IV antibiotics) or short-term SNF, estimated discharge hospital day 5-6 once PICC is in, wound granulating and glucose controlled on a home insulin regimen; PT will advise on walker and offloading shoe (need 3 needs).', 0.5, 'Case management'),
               E('Pre-hospital: ulcer under the ball of the R foot for 3 weeks that began after new shoes; he felt no pain and kept walking on it; then foul drainage, redness spreading over the forefoot, swollen great toe, chills and fever (101.4 F); home glucose in the 300s; sent to the ED.', 0.5, 'ED note')]}},
          {'id': '1.4', 'type': 'boxes', 'points': 4, 'title': 'Head-to-Toe Assessment at 0700 (use R and L for laterality)', 'where': 'Flowsheets; Nursing Admission Note; Nursing Progress Note 0645',
           'prompt': 'Document the findings from the chart as of the start of your shift. If the chart does not document a finding, write "not documented."', 'subs': [
              {'label': 'Neurological (include foot sensation):', 'lines': 2},
              {'label': 'Cardiovascular and perfusion:  Radial pulses R___ L___    Pedal pulses R___ L___    Cap refill R foot ____', 'lines': 3},
              {'label': 'Respiratory:  breath sounds, effort, O2', 'lines': 2},
              {'label': 'Integumentary (R foot wound: size, tissue, drainage, erythema; other skin):', 'lines': 4},
              {'label': 'Musculoskeletal, mobility and pain:', 'lines': 3}, {'label': 'Gastrointestinal and Genitourinary (diet/NPO, I&O):', 'lines': 2},
              {'label': 'IV / Lines / Devices Assessment:', 'lines': 2}, {'label': 'Psychosocial / Cultural Assessment and Erikson Stage:', 'lines': 3}],
           'key': {'elements': [
               E('Neuro: alert, oriented x4; loss of protective sensation: 10 g monofilament felt at 0 of 4 sites R foot and 1 of 4 sites L foot; vibration absent at both great toes; baseline numbness in both feet.', 0.5, 'Flowsheet 10/20 2000'),
               E('CV: sinus rhythm (charted as sinus tachycardia; HR 86-89 overnight), S1 S2 regular, no murmur; femoral pulses 2+; DP and PT faint (1+) bilaterally with Doppler signals present; cap refill R foot 3-4 s; R foot 1-2+ pitting edema. Radial pulses NOT documented (full credit for "not documented").', 0.5, 'Flowsheet'),
               E('Resp: clear bilaterally, unlabored and even; room air, SpO2 96%. Lobe-by-lobe findings not documented.', 0.5, 'Flowsheet, vitals'),
               E('Integument: R plantar ulcer under the 1st metatarsal head after debridement 3.6 x 2.8 x 1.4 cm, red-pink base, probe reaches bone, moderate less-purulent drainage with reduced odor, moist saline packing; erythema receded to 2 cm from the ulcer edge (inside the marked border), less warm; great toe still swollen; Braden 19. Need size AND 3 other findings.', 0.5, 'Flowsheet, nursing note'),
               E('MSK: cannot bear weight on the R forefoot (antalgic); strict non-weight-bearing R foot with leg elevated; bariatric/lift-assist equipment; high fall risk; pain R forefoot 3/10 (dull, neuropathy blunts pain).', 0.5, 'Flowsheet, orders'),
               E('GI/GU: abdomen soft, non-tender, bowel sounds active x4, no nausea/vomiting; NPO since midnight with LR 75 mL/hr; voiding spontaneously, clear yellow; I&O 0300-0700 in 300 mL / out 309 mL.', 0.5, 'Flowsheet, I&O'),
               E('Lines: PIV R forearm (20 g) and PIV L antecubital (18 g), both patent, clean, dry, intact; no PICC, no urinary catheter; (devices list shows saline lock though LR is infusing: see 1.8).', 0.5, 'Devices'),
               E('Psychosocial: lives alone, works part-time as a delivery driver, current smoker (1/2 pack/day), occasional alcohol, consent signed and teaching about the block, sedation, open wound with packing, heel-weight-bearing shoe and daily dressing changes done; spiritual/cultural preferences not documented (full credit for "ask the patient"). Erikson: Generativity vs Stagnation (middle adulthood, about 40-65).', 0.5, 'Nursing note 0645')],
                   'rules': 'Give 0.5 for a box that contains at least 3 correct chart findings for that system (0.25 for 1-2). Do not give credit for findings that are not in the chart (invented radial pulses, lobe-by-lobe lung sounds).'}},
          {'id': '1.5', 'type': 'vitals', 'points': 2, 'title': 'Vital Sign Trend', 'where': 'Flowsheets > Vital Signs (or the Vitals graph)',
           'prompt': 'Copy the vital signs at each time. Circle every abnormal value. Then describe the trend in one sentence.',
           'times': ['2026-10-19 02:06', '2026-10-20 12:00', '2026-10-21 04:00'], 'times_label': ['10/19 0206\n(ED arrival)', '10/20 1200', '10/21 0400'],
           'rowsLabels': ['Temperature', 'Heart rate', 'Blood pressure', 'Respiratory rate', 'SpO2 (%)', 'Pain (0-10)'], 'codes': ['TEMP', 'HR', 'BP', 'RR', 'SPO2', 'PAIN'],
           'key': {'rules': 'Score 1.5 x (cells correct / 18), rounded to the nearest 0.5. Circling abnormal values and the trend sentence are worth 0.5 together: fever (101.6 F), tachycardia (113) and tachypnea (22) on arrival have resolved with antibiotics and drainage (T 99.3, HR 88, RR 17); BP stayed 147-160/80-88, above the goal of <140/90, and never normalized; SpO2 95-97% on room air; pain low (2-5/10), and neuropathy blunts pain. Allow +/- 2 for rates and +/- 0.2 F.'}},
          {'id': '1.6', 'type': 'table', 'points': 3, 'title': 'Laboratory Data', 'where': 'Lab Results (look at the trend, not only today)',
           'prompt': 'Choose the 6 laboratory results most important for this patient today. For each give the most recent value, the normal range, the trend since 10/19, and explain why it matters for THIS patient.',
           'cols': ['Lab', 'Latest value, normal range, trend', 'Why is this lab important for this patient?'], 'widths': [1.2, 2.3, 3.5], 'rows': 6, 'rowH': 0.7,
           'key': {'answer': 'Any 6 of the labs below. Each 0.5: correct value with range and trend (0.25) AND an accurate patient-specific reason (0.25).', 'bank': True,
                   'elements': [
                       E('Creatinine 1.98 mg/dL (H; 0.7-1.3), 1.94 on 10/19, 1.91 on 10/20; eGFR 38 (>60): CKD stage 3 baseline about 1.8; vancomycin hold parameter is a rise of 0.3 or more; drug dosing and nephrotoxin avoidance.', 0.5, 'Labs'),
                       E('Glucose 185 mg/dL on 10/21 (336 on 10/19, 214 on 10/20; goal 140-180) and A1c 10.2% (H): poor long-term control, insulin dosing while NPO, healing and infection risk; surgery goal below 180.', 0.5, 'Labs'),
                       E('WBC 13.6 K/uL (H; 4-10.5), down from 17.8 and 14.7: infection responding to antibiotics and drainage; recheck after surgery.', 0.5, 'Labs'),
                       E('Vancomycin level 18.9 mcg/mL (10-20) on 10/20 and 10/21: close to the hold limit of 20; AUC goal 400-600; kidney injury risk.', 0.5, 'Labs, order'),
                       E('CRP 148 mg/L, ESR 98 mm/hr, procalcitonin 0.90 (all H, measured only 10/19): very high ESR supports osteomyelitis; baseline for monitoring response and for OPAT labs.', 0.5, 'Labs'),
                       E('Hemoglobin 10.0 g/dL (L; 13.5-17.5), down from 10.8: anemia of CKD/inflammation; baseline before surgery and enoxaparin.', 0.5, 'Labs'),
                       E('Albumin 3.1 g/dL (L; 3.5-5), 3.3 on 10/19 and prealbumin 11 (L): poor protein stores slow wound healing; dietitian involved.', 0.5, 'Labs'),
                       E('Potassium 4.6 mmol/L (3.5-5.1), BUN 34 (H), sodium 138: CKD, ACE inhibitor (held today) and LR fluid; check before surgery.', 0.5, 'Labs'),
                       E('Platelets 322 K/uL (150-400), INR 1.0 (0.9-1.2): normal clotting before surgery; platelets matter for heparin/enoxaparin (hold if below 50).', 0.5, 'Labs'),
                       E('Blood cultures x2: no growth at 48 hours; MRSA nares PCR positive; deep tissue culture Gram stain: Gram-positive cocci in clusters and Gram-negative rods (many WBC), final pending: guides antibiotic narrowing.', 0.5, 'Labs'),
                       E('Lactate 1.4 mmol/L (0.5-2) on 10/19 0700, down from 2.1: sepsis physiology resolved.', 0.5, 'Labs')],
                   'rules': 'Maximum 3.0. Accept other abnormal labs if value, range, trend and reason are correct. No credit for a lab with a wrong value.'}},
          {'id': '1.7', 'type': 'boxes', 'points': 3, 'title': 'Diagnostics', 'where': 'Chart Review > Imaging, Cardiology, Notes (arterial studies), Labs (microbiology)',
           'subs': [{'label': 'X-ray right foot: results', 'lines': 2}, {'label': 'MRI right foot: results (note whether contrast was used)', 'lines': 2},
                    {'label': 'Arterial studies (ABI, toe pressure): results and what they mean', 'lines': 2}, {'label': 'ECG / echocardiogram / chest x-ray:', 'lines': 1},
                    {'label': 'Cultures and MRSA screen:', 'lines': 2}, {'label': 'Urinalysis:', 'lines': 1}],
           'key': {'elements': [
               E('X-ray: plantar soft tissue defect beneath the 1st metatarsal head with swelling; cortical erosion and periosteal reaction of the R 1st metatarsal head and base of the great toe proximal phalanx (concerning for osteomyelitis); dense calcification of the dorsalis pedis and plantar arteries; no gas, no foreign body, no Charcot.', 0.5, 'Radiology'),
               E('MRI: osteomyelitis of the 1st metatarsal head and proximal phalanx of the great toe with a plantar abscess about 2 cm; no midfoot extension; done WITHOUT gadolinium because of reduced kidney function.', 0.5, 'Radiology'),
               E('Arterial: ABI R 0.72, L 0.88 (calcified vessels may overestimate); R great toe pressure 58 mmHg, toe-brachial index 0.46; biphasic PT and monophasic DP waveforms: mild-moderate PAD; toe pressure above 30 means enough flow to heal a forefoot amputation.', 0.5, 'Arterial studies note'),
               E('ECG: normal sinus rhythm, no acute ST-T changes. Echocardiogram and chest x-ray: not documented (full credit for "not documented").', 0.5, 'Cardiology'),
               E('Blood cultures x2 no growth at 48 hours; MRSA nasal PCR positive; deep tissue (wound) culture Gram stain: Gram-positive cocci in clusters and Gram-negative rods with many WBC, final result pending; bone margin culture/pathology will be sent from the OR.', 0.5, 'Labs'),
               E('UA: ketones negative (no DKA). Other UA values not documented.', 0.5, 'Labs')]}},
          {'id': '1.8', 'type': 'table', 'points': 5, 'title': 'Chart Reconciliation',
           'prompt': 'Real charts contain conflicts, copy-forward errors and gaps. Find FOUR places where this chart is conflicting, unsafe, or needs clarification before you act. Say where you found each and who you would clarify with.',
           'where': 'Orders, MAR, Chart Review > Notes (ID and hospitalist notes), Devices, Sticky notes', 'cols': ['What is wrong or unclear (and where)', 'Who you would clarify with and what you would ask'], 'widths': [3.5, 3.5], 'rows': 4, 'rowH': 0.95,
           'key': {'answer': 'Any 4 valid items. Each 1.25: the issue is real and located (0.75) AND the clarification is appropriate (0.5).', 'bank': True,
                   'elements': [
                       E('ANTIBIOTIC vs ALLERGY (the most important): the ID consult (10/19 1300), the H&P plan (10/19) and the hospitalist note (10/20) all say vancomycin PLUS piperacillin-tazobactam, and the sticky note/vancomycin drug information mention pip-tazo, but the allergy is penicillin (hives, severity High) and the MAR has vancomycin PLUS meropenem; no pip-tazo order exists. Clarify with the hospitalist/ID and pharmacy; do not give or enter pip-tazo; ask for the plan and notes to be corrected.', 0, 'Notes, allergy, MAR'),
                       E('A1c conflict: ED note and H&P past history say A1c 8.0%, but the lab and the H&P assessment say 10.2% (10/19 0230). Clarify with the hospitalist and use the lab value for insulin and teaching decisions.', 0, 'ED note, H&P, labs'),
                       E('ABI conflict: problem list and the SCD order title say ABI 0.45 bilaterally, but the arterial study says R 0.72, L 0.88 (and the H&P says 0.72). Also the ED note (0418) and H&P (0530) quote the ABI 0.72 hours before the study was ordered (0912) and reported (1036). Clarify with the hospitalist/vascular lab; keep avoiding SCDs.', 0, 'Problem list, orders, notes'),
                       E('Vancomycin level timing: the order says draw 30 minutes before the dose (dose due 0900) but the two "trough" results (both 18.9) were collected 10/20 1224 (3.5 hours AFTER the 0900 dose) and 10/21 0300 (18 hours after); the sticky note says level before the 4th dose but only 2 doses have been given (load 10/19 0254; 1,000 mg 10/20 0900). Ask pharmacy for a correctly timed level or AUC interpretation before the 0900 dose.', 0, 'Orders, MAR, labs, sticky note'),
                       E('Insulin plan vs orders: the H&P, diabetes education order and 10/20 assessment say basal-bolus insulin and ACHS, but the lispro order is correction scale only every 6 hours (its rationale still reads mealtime and correction insulin) and the NPO order says mealtime insulin held; nothing says what to give when diet resumes at noon. Clarify with the hospitalist/pharmacy.', 0, 'Orders, notes'),
                       E('Glargine dose: the order is still 22 units (22 units given 10/19 and 10/20 at 2100; home dose 20 units per H&P), while the NPO order, hospitalist note and sticky note say reduced 20% (80% of 22 = 17.6, about 18 units). Ask the hospitalist/pharmacy what exact dose to give tonight if still NPO and what if eating.', 0, 'Orders, MAR, sticky note'),
                       E('Missing glucose data: no point-of-care glucose values appear in the chart (only AM lab glucose 336, 214, 185); notes quote ranges (224-268, 180-240); lispro correction is charted as given at 10/20 1800, 10/21 0000 and 0600 with no glucose value or units. Retrieve meter data, chart the number before every insulin dose, ask the night RN.', 0, 'MAR, flowsheets'),
                       E('MRI order says "without and with contrast" but the report says it was done without gadolinium because of kidney function; relevant to the avoid-contrast orders. Clarify with radiology/hospitalist so the order record is accurate.', 0, 'Orders, radiology'),
                       E('Device record: both PIVs are listed as saline lock, but LR 75 mL/hr is running per the MAR (0700) and I&O. Check which site the LR is infusing in and correct the record; both lines are on day 3.', 0, 'Devices, MAR'),
                       E('Pulse documentation: assessments say DP and PT faint (1+) bilaterally, but the capillary refill line says PT by Doppler (not palpable). Re-examine with Doppler and document clearly; this is the baseline for post-op checks.', 0, 'Flowsheet'),
                       E('Copy-forward: rhythm charted as sinus tachycardia on 10/20 2000 and in the 10/21 0645 note while HR was 86-89 (ECG normal sinus rhythm). Also nursing notes repeat the same ulcer measurements and "glucose 224-268" on 3 shifts.', 0, 'Flowsheet, nursing notes'),
                       E('Ertapenem order (start 10/22 0800, when meropenem ends) is labeled culture-directed for 6 weeks, but cultures are not final and ID says 6 weeks only if the bone margin is positive; its rationale cites penicillin/cephalosporin allergy though only penicillin is documented; 500 mg is the dose for CrCl 30 or below (eGFR 38). Clarify with ID/pharmacy.', 0, 'Orders, ID note'),
                       E('VTE prophylaxis gap: heparin 5,000 units SQ q8h was ordered from 10/19 0600 but the first documented dose is 10/20 1400; SCDs are not allowed (PAD). Ask pharmacy/the charge RN whether doses were given and not charted; do not double up.', 0, 'MAR'),
                       E('Open orders with no documentation: verify tetanus immunization (Tdap if unknown or >5 years); diabetes education ordered 10/19 2200 but no teaching charted (notes show only MRSA and surgery teaching); tobacco counseling ordered.', 0, 'Orders, notes'),
                       E('IV access plan: ID and case management assume a PICC for 6 weeks of IV antibiotics, but there is no PICC order and eGFR is 38 (CKD 3b); ask the hospitalist/nephrology/ID about vein preservation (for example tunneled small-bore catheter) before any PICC.', 0, 'Orders, notes'),
                       E('Mobility: assessments say antalgic gait while orders are bed rest/strict non-weight-bearing with commode and wheelchair; clarify what he is actually doing and reinforce offloading.', 0, 'Flowsheet, orders'),
                       E('Minor accepted items: WBC 17.6 in the H&P assessment vs 17.8 in labs; deep tissue culture result collected 10/20 1600 but debridement was 10/19 (about 1600-1654); cilostazol is a home medicine but not ordered until 10/23 0800; problem list says PAD "no tissue loss" despite the ulcer.', 0, 'Various')],
                   'rules': 'Elements are a bank (0 pts each); score each student row 1.25 as described (maximum 5.0). The same issue written twice earns credit once. Do not credit a "conflict" that is not real (for example, the heparin order ending at 0700 and enoxaparin starting at 2130 is NOT a duplication).'}},
      ]}

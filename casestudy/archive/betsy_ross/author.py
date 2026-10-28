#!/usr/bin/env python3
"""Authors content.json for the Betsy Ross case study (right intertrochanteric hip fracture, pre-operative day, many comorbidities).
Contains the answer key. Usage: python3 author.py content.json   then   python3 ../../build_casestudy.py content.json patient.json out/"""
import json, sys

E = lambda t, pts, src='': {'t': t, 'pts': pts, 'src': src}

meta = {'title': 'Clinical Care-Plan Case Study: Hip Fracture in a Frail Patient with Multiple Chronic Conditions',
        'course': 'ADN Med-Surg II', 'caseCode': 'CS-HIP-378-1', 'passPct': 78,
        'footer': 'Write one answer per numbered box, inside the box, in dark pen, neatly. Open book, individual work.'}

studentIntro = [
    {'h': 'Your patient', 'lines': [
        'You are the primary nurse for the patient in Step-Down ICU room 378-1 on the 7:00 to 15:00 shift on Thursday, October 8, 2026 (hospital day 1). '
        'Open the patient in the student EHR (Student View, or the patient file from your instructor) and set the simulation clock to 0700. '
        'Everything you need is in the chart. She is waiting for surgery to repair a broken hip, and she has many other health problems. Work the way you would at the start of a real shift.']},
    {'h': 'How this case study works', 'lines': [
        'This packet follows the nursing process: Assessment, Diagnosis, Planning, Implementation and Evaluation. You will also explain the pathophysiology and pharmacology behind your patient\'s care. '
        'Expect to spend about 6 hours. It is a take-home, individual, open-book assignment: use your textbooks, drug guide, notes and the chart.',
        'Questions ask you to explain WHY, not only WHAT. Short, specific answers that use this patient\'s data earn more points than general textbook answers. '
        'Real charts are imperfect: you will be asked to catch conflicts and to question orders before you act.']},
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
p1 = {'id': '1', 'title': 'Assessment: Patient Data and Chart Review', 'step': 'Assessment', 'minutes': 80,
      'intro': 'Collect and organize the data you would have at 0700. Where the chart does not document something, write "not documented." Use R and L for laterality.',
      'keyNote': 'Part 1 is mostly chart look-up, so it should be the easiest part to score. Students who read the chart carefully should earn 20 or more of these 26 points.',
      'items': [
          {'id': '1.1', 'type': 'fields', 'points': 4, 'title': 'Basic Patient Information', 'where': 'Patient Summary and Storyboard', 'perRow': 2, 'labelW': 1.25, 'fields': [
              {'label': 'Room Number', 'answer': '378-1 (Step-Down ICU)', 'pts': 0.5}, {'label': 'Age', 'answer': '67', 'pts': 0.5},
              {'label': 'Gender', 'answer': 'Female', 'pts': 0.5}, {'label': 'Admission Date', 'answer': '10/08/26 (ED arrival 0206; unit 0500)', 'pts': 0.5},
              {'label': 'Allergies (and reactions)', 'answer': 'Penicillin: hives (high). Sulfa drugs: rash (moderate). Both required for 0.5.', 'pts': 0.5}, {'label': 'Chief Complaint', 'answer': 'Right hip pain after a fall; unable to bear weight', 'pts': 0.5},
              {'label': 'Primary Diagnosis', 'answer': 'Right intertrochanteric hip fracture (unstable)', 'pts': 0.5}, {'label': 'Code Status', 'answer': 'Full Code', 'pts': 0.25},
              {'label': 'Isolation', 'answer': 'Contact precautions (MRSA history)', 'pts': 0.25}]},
          {'id': '1.2', 'type': 'table', 'points': 4, 'title': 'Medical Diagnoses and How They Affect the Primary Diagnosis',
           'prompt': 'List FIVE other medical diagnoses from this patient\'s chart. For each, explain how it affects her hip fracture and her surgery.', 'where': 'Chart Review > H&P; Encounters > Hospital problem list',
           'cols': ['Medical diagnosis', 'How it affects the primary diagnosis (hip fracture and its surgery)'], 'widths': [2.2, 4.8], 'rows': 5, 'rowH': 0.7,
           'key': {'answer': 'Any 5 of the diagnoses below. Each row 0.8: diagnosis is on the chart (0.3) AND the effect is accurate (0.5).', 'bank': True,
                   'elements': [
                       E('Type 2 diabetes (A1c 8.0%, glucose 201): hyperglycemia slows healing and raises surgical-site infection risk; neuropathy raises fall risk and confuses neurovascular checks.', 0.8, 'H&P'),
                       E('Heart failure with reduced EF (about 35%): poorly tolerates anemia, hypotension and IV fluids; fluid shifts with surgery and bed rest; ties to beta blocker and diuretic decisions.', 0.8, 'H&P'),
                       E('Coronary artery disease (CABG 2022, stent): blood loss and anemia raise myocardial oxygen demand; perioperative MI risk; aspirin and beta blocker continue.', 0.8, 'H&P'),
                       E('Atrial fibrillation on apixaban: anticoagulant must be held before surgery and resumed later (stroke vs bleeding); rate control with beta blocker.', 0.8, 'H&P'),
                       E('COPD (baseline SpO2 about 90-92%): anesthesia and opioid risk, atelectasis/pneumonia after surgery, oxygen target 88-92%.', 0.8, 'H&P'),
                       E('Chronic anemia (baseline Hgb about 10; now 8.9): surgical blood loss makes transfusion likely; lowers oxygen delivery.', 0.8, 'H&P, labs'),
                       E('Rheumatoid arthritis on methotrexate, prednisone, hydroxychloroquine: immunosuppression raises infection risk; steroids cause bone loss, fragile skin, hyperglycemia and adrenal suppression (stress-dose steroids).', 0.8, 'H&P'),
                       E('Frailty: high delirium, fall and complication risk; slower recovery; start low go slow with drugs.', 0.8, 'H&P'),
                       E('MRSA history/colonization: contact precautions; surgical-site infection risk; antibiotic choice.', 0.8, 'H&P'),
                       E('Peripheral neuropathy: fall risk; baseline decreased sensation in both feet must be known to interpret neurovascular checks.', 0.8, 'Flowsheet'),
                       E('Hypertension: raises periop BP swings; ACE inhibitor usually held before surgery.', 0.8, 'H&P'),
                       E('Depression/anxiety (sertraline): delirium and pain-coping effects; SSRI adds to bleeding risk with aspirin/anticoagulants.', 0.8, 'H&P'),
                       E('Chronic constipation: opioids and immobility worsen it.', 0.8, 'H&P'),
                       E('GERD (pantoprazole): long-term PPI is a minor risk factor for fracture.', 0.8, 'H&P'),
                       E('Chronic edema with fragile skin: pressure injury and skin-tear risk during positioning/traction.', 0.8, 'H&P')],
                   'rules': 'Maximum 4.0. HF and HFrEF are the same row. Do not give credit for the same diagnosis twice.'}},
          {'id': '1.3', 'type': 'boxes', 'points': 3, 'title': 'Patient History', 'where': 'H&P; ED Provider Note; Case Management consult order; Nursing Admission Note', 'subs': [
              {'label': 'Medical History:', 'lines': 3}, {'label': 'Surgical History (with years):', 'lines': 2}, {'label': 'Family History:', 'lines': 2},
              {'label': 'Social History:', 'lines': 2}, {'label': 'Home Situation and Discharge Needs:', 'lines': 3}, {'label': 'Pre-Hospital Story of Patient:', 'lines': 3}],
           'key': {'elements': [
               E('Medical: at least 6 of: T2DM, HTN, CAD, HFrEF, AFib, COPD, chronic anemia, GERD, depression/anxiety, constipation, neuropathy, MRSA history, rheumatoid arthritis, chronic edema, frailty.', 0.5, 'H&P'),
               E('Surgical: at least 4 of: cholecystectomy 2018; CABG 2022; coronary stent/PCI 2018; pacemaker 2018; total hip replacement 1989; right mastectomy with axillary node surgery 2018.', 0.5, 'H&P'),
               E('Family: mother hypertension, type 2 diabetes AND hip fracture in her 80s; father coronary artery disease.', 0.5, 'H&P'),
               E('Social: lives with spouse/partner; independent with ADLs and ambulation; tobacco current less than 1 pack/day; alcohol social; past substance use (need tobacco and living situation).', 0.5, 'H&P'),
               E('Home/discharge: lives with spouse, independent baseline; case management consult for post-acute rehab planning; PT/OT after surgery; needs include rehab (SNF/inpatient), walker/equipment, home safety (night-time bathroom trip), osteoporosis follow-up (need 2 needs).', 0.5, 'Orders'),
               E('Pre-hospital: tripped on the way to the bathroom at night, fell onto the right side from standing height; severe right hip/groin pain, could not stand or bear weight; EMS found the leg shortened and turned outward; no loss of consciousness or head strike.', 0.5, 'ED note')]}},
          {'id': '1.4', 'type': 'boxes', 'points': 4, 'title': 'Head-to-Toe Assessment at 0700 (use R and L for laterality)', 'where': 'Flowsheets; Nursing Admission Note 0536; General Surgery H&P',
           'prompt': 'Document the findings from the chart as of the start of your shift. If the chart does not document a finding, write "not documented."', 'subs': [
              {'label': 'Neurological:', 'lines': 2},
              {'label': 'Cardiovascular:  Radial pulses R___ L___    Pedal pulses R___ L___    Cap refill ________', 'lines': 3},
              {'label': 'Respiratory:  RUL ____  LUL ____  RLL ____  LLL ____  (breath sounds, effort, O2)', 'lines': 3},
              {'label': 'Integumentary:', 'lines': 3}, {'label': 'Musculoskeletal:', 'lines': 3}, {'label': 'Gastrointestinal:', 'lines': 2},
              {'label': 'Genitourinary:', 'lines': 2}, {'label': 'IV / Lines / Devices Assessment:', 'lines': 3}, {'label': 'Psychosocial / Cultural Assessment:', 'lines': 2}, {'label': 'Erikson Stage:', 'lines': 1}],
           'key': {'elements': [
               E('Neuro: alert, oriented x4; CAM (delirium screen) negative; decreased light touch/pinprick in both feet (stocking pattern, baseline neuropathy, burning 3/10); R foot sensation and toe movement intact after block.', 0.4, 'Flowsheet'),
               E('CV: AFib rate controlled, irregularly irregular (HR 99 at 0424); no murmur; trace bilateral leg edema; cap refill under 3 s; R pedal pulse palpable; dual-chamber pacemaker L upper chest, pocket healed. Radial pulses R/L NOT documented: full credit for "not documented."', 0.4, 'Flowsheet'),
               E('Resp: diminished bilaterally with scattered end-expiratory wheeze; prolonged expiratory phase; SpO2 91% on room air (goal 88-92%); incentive spirometer 1,000 mL; non-productive cough; lobe-by-lobe findings not documented.', 0.4, 'RT 0612'),
               E('Integument: blanchable redness over sacrum; heels intact; Braden 17; ecchymosis over R lateral hip; healed R mastectomy scar (flat chest wall); healed R lateral hip scar (prior THA); dry intact feet; fragile edematous skin.', 0.4, 'Flowsheet'),
               E('MSK: R leg shortened and externally rotated, tender hip/groin, unable to lift leg; Buck\'s skin traction 5 lb; bed rest, non-weight-bearing RLE; log-roll; RA signs in hands (MCP/PIP/wrist swelling, ulnar deviation, 45 min morning stiffness).', 0.4, 'Flowsheet'),
               E('GI: soft, non-tender, non-distended; bowel sounds active x4; no nausea/vomiting; baseline BM every 2-3 days with straining; on opioids.', 0.4, 'Flowsheet'),
               E('GU: voiding spontaneously, clear yellow; I&O 0300-0700 in 236 mL / out 270 mL.', 0.4, 'I&O'),
               E('Lines: PIV L forearm and PIV L antecubital; NO BP, IV, venipuncture or injections in the RIGHT arm (mastectomy); dual-chamber pacemaker; skin traction.', 0.4, 'Devices, orders'),
               E('Psychosocial/cultural: lives with spouse, independent baseline, depression/anxiety on sertraline, tobacco and past substance use, anxious pre-op (consent/teaching in progress), glasses and hearing aids; spiritual/cultural preferences not documented (full credit if she says "ask the patient").', 0.4, 'Admission note'),
               E('Erikson: Integrity vs Despair (late adulthood, 65+).', 0.4, '')],
                   'rules': 'Give 0.4 for a box that contains at least 3 correct chart findings for that system (0.2 for 1-2). Do not give credit for findings that are not in the chart (invented pulses, lobe-by-lobe lung sounds).'}},
          {'id': '1.5', 'type': 'vitals', 'points': 2, 'title': 'Vital Sign Trend', 'where': 'Flowsheets > Vital Signs (or the Vitals graph)',
           'prompt': 'Copy the vital signs at each time. Circle every abnormal value. Then describe the trend in one sentence.',
           'times': ['2026-10-08 02:06', '2026-10-08 03:00', '2026-10-08 04:24'], 'times_label': ['10/08 0206\n(ED arrival)', '10/08 0300', '10/08 0424'],
           'rowsLabels': ['Temperature', 'Heart rate', 'Blood pressure', 'Respiratory rate', 'SpO2 (%)', 'Pain (0-10)'], 'codes': ['TEMP', 'HR', 'BP', 'RR', 'SPO2', 'PAIN'],
           'key': {'rules': 'Score 1.5 x (cells correct / 18), rounded to the nearest 0.5. Circling abnormal values and the trend sentence are worth 0.5 together: HR, RR and pain improved after analgesia and the fascia iliaca block (0430); BP stayed high-normal to high; SpO2 91-92% on room air is her COPD baseline. Allow +/- 2 for rates.'}},
          {'id': '1.6', 'type': 'table', 'points': 4, 'title': 'Laboratory Data', 'where': 'Lab Results',
           'prompt': 'Choose the 8 laboratory results most important for this patient before surgery. For each give the current value, the normal range (this is her first set, so there is no trend yet), and explain why it matters for THIS patient.',
           'cols': ['Lab', 'Result / normal range', 'Why is this lab important for this patient?'], 'widths': [1.2, 2.2, 3.6], 'rows': 8, 'rowH': 0.62,
           'key': {'answer': 'Any 8 of the labs below. Each 0.5: correct value with range (0.25) AND an accurate patient-specific reason (0.25).', 'bank': True,
                   'elements': [
                       E('Hemoglobin 8.9 g/dL (L; 12-16; baseline about 10): hip fracture and surgery cause blood loss; CAD/HF poorly tolerate anemia; transfusion threshold (order below 8).', 0.5, ''),
                       E('Glucose 201 mg/dL (H; 70-110) and HbA1c 8.0% (H; <5.7): chronic poor control plus stress and prednisone; infection and healing risk; insulin dosing while NPO.', 0.5, ''),
                       E('WBC 11.8 K/uL (H; 4-10.5): stress response and prednisone demargination; infection must be watched because prednisone/methotrexate blunt fever.', 0.5, ''),
                       E('Platelets 225 (150-400), INR 1.0 (0.9-1.2), aPTT 29 (25-35): normal baseline clotting; safe for surgery/neuraxial; compare after heparin/enoxaparin.', 0.5, ''),
                       E('BUN 21 (H; 7-20) with creatinine 0.94 and eGFR 65 (>60): mild dehydration; kidney function for drug dosing (gabapentin, enoxaparin, apixaban).', 0.5, ''),
                       E('Albumin 2.7 g/dL (L; 3.5-5): poor nutrition/frailty; wound healing and pressure injury risk; dietitian consult.', 0.5, ''),
                       E('25-OH vitamin D 19 ng/mL (L; 30-100): contributes to osteoporosis and fracture; vitamin D and calcium are ordered later.', 0.5, ''),
                       E('Potassium 4.2 (3.5-5.1) and magnesium 1.9 (1.7-2.4): arrhythmia risk in AFib/HF; furosemide and surgery can lower them.', 0.5, ''),
                       E('Type and screen: O positive, antibody screen negative: ready for transfusion.', 0.5, ''),
                       E('Urinalysis (leukocyte esterase and nitrite negative): no UTI before surgery.', 0.5, ''),
                       E('MRSA nasal PCR negative (0600): conflicts with the "colonized" history; guides antibiotic prophylaxis.', 0.5, '')],
                   'rules': 'Maximum 4.0. Accept other abnormal labs if value, range and reason are correct. No credit for a lab with a wrong value.'}},
          {'id': '1.7', 'type': 'boxes', 'points': 2, 'title': 'Diagnostics', 'where': 'Chart Review > Imaging, Cardiology',
           'subs': [{'label': 'X-Ray / CT / MRI: location and results (include the chest)', 'lines': 3}, {'label': 'Echocardiogram results:', 'lines': 1}, {'label': 'EKG results:', 'lines': 2}, {'label': 'Urinalysis results:', 'lines': 1}],
           'key': {'elements': [
               E('X-ray right hip and pelvis: comminuted unstable right intertrochanteric femur fracture with varus angulation and lesser trochanter involvement; diffuse osteopenia; no femoral neck or acetabular fracture; pelvic ring intact. CXR: no acute cardiopulmonary process (need hip AND chest).', 0.5, 'Radiology'),
               E('Echo: not done this admission / not documented; EF about 35% by history. Full credit for either.', 0.5, ''),
               E('ECG: atrial fibrillation with controlled ventricular response, rate 84; no acute ST-T changes; QTc 436 ms.', 0.5, 'Cardiology'),
               E('UA: leukocyte esterase negative, nitrite negative.', 0.5, 'Labs')]}},
          {'id': '1.8', 'type': 'table', 'points': 3, 'title': 'Chart Reconciliation',
           'prompt': 'Real charts contain conflicts and gaps. Find FOUR places where this chart is conflicting, duplicated, or needs clarification before you act. Say where you found each and who you would clarify with.',
           'where': 'Orders, MAR, Chart Review > Notes, Sticky notes', 'cols': ['What is wrong or unclear (and where)', 'Who you would clarify with and what you would ask'], 'widths': [3.5, 3.5], 'rows': 4, 'rowH': 0.85,
           'key': {'answer': 'Any 4 valid items. Each 0.75: the issue is real and located (0.45) AND the clarification is appropriate (0.3).', 'bank': True,
                   'elements': [
                       E('Surgery date/time conflict: the surgery order is Pending at 1000 today, but the H&P says "about 0800 tomorrow" and the sticky note says "OR about 0800"; cefazolin, IV fluids and enoxaparin orders all begin 10/09. Clarify with orthopedics/OR desk: affects NPO, which medicines to give today, and antibiotic timing.', 0, 'Orders, H&P'),
                       E('Two beta blockers are both scheduled at 0900: metoprolol tartrate 25 mg AND carvedilol 6.25 mg (consult says "metoprolol/carvedilol"). Duplicate therapy (bradycardia, hypotension). Ask the hospitalist/pharmacist to choose one (evidence-based beta blockers in HFrEF: carvedilol, metoprolol succinate, bisoprolol).', 0, 'MAR'),
                       E('Transfusion threshold conflict: order says Hgb below 8 or symptomatic; hospitalist co-management says below 7; the hospitalist consult says below 8. Clarify the threshold with the hospitalist.', 0, 'Orders, notes'),
                       E('Furosemide and lisinopril are due at 0900, but the hospitalist consult says "hold diuretics" (the co-management note also says "continue home diuretic"); ACE inhibitors are usually held 24 hours before surgery. Clarify before giving.', 0, 'MAR, notes'),
                       E('Methotrexate 15 mg weekly is an active order, but the hospitalist note says it is held; next dose would be Friday 10/09 (the day of surgery). Clarify and ask for the hold to be entered; never give daily.', 0, 'Orders, notes'),
                       E('MRSA status conflict: history says colonized (contact precautions, mupirocin, chlorhexidine) but MRSA nasal PCR is negative; planned prophylaxis is cefazolin (no MRSA coverage) and she has a penicillin allergy (hives). Clarify prophylaxis and allergy plan with surgeon/pharmacy.', 0, 'Orders, labs'),
                       E('Attending service conflict: ED note and H&P say General Surgery (Dr. Alvarez); orthopedic consult says admit to Orthopedic Surgery. Clarify who the primary team is and who to call.', 0, 'Notes'),
                       E('Insulin: glargine 20 units is labeled "reduced 20% while NPO," but she is not NPO until midnight; lispro correction is ordered ACHS. Clarify today\'s glargine dose, and what to do when NPO.', 0, 'MAR'),
                       E('Pacemaker date: device record says placed 10/08/2025; surgical history says 2018. Clarify (important for OR electrocautery precautions).', 0, 'Devices, H&P'),
                       E('Pantoprazole: plan says IV while NPO, but the order is an oral tablet. Oxygen order is active while she is on room air (RT goal 88-92%). Minor; accept if clearly explained.', 0, 'Orders')],
                   'rules': 'Elements are a bank (0 pts each); score each student row 0.75 as described (maximum 3.0). The same issue written twice earns credit once.'}},
      ]}

# ------------------------------------------------------------------ PART 2
p2 = {'id': '2', 'title': 'Pathophysiology: The Disease Process', 'step': 'Assessment / Analysis of cues', 'minutes': 75,
      'intro': 'Explain WHY this is happening. Use your own words (plain language) and tie each idea to this patient.',
      'items': [
          {'id': '2.1', 'type': 'box', 'points': 6, 'lines': 13, 'title': 'Pathophysiology of an Intertrochanteric Hip Fracture',
           'prompt': 'In plain language and your own words, explain the pathophysiology of this patient\'s primary diagnosis: why the bone broke from a fall from standing height, why her leg looks the way it does, what the body does in response, and why the problem is treated with surgery quickly.',
           'key': {'elements': [
               E('Osteoporosis/low bone density (more bone resorption than formation) makes bone fail with a low-energy fall; radiograph shows diffuse osteopenia.', 1, ''),
               E('Her specific risk factors: postmenopausal; anastrozole (aromatase inhibitor lowers estrogen); chronic prednisone; rheumatoid arthritis; vitamin D 19; smoking; frailty/neuropathy/night-time fall (name at least 3 with a reason).', 1, ''),
               E('Intertrochanteric = extracapsular fracture between the greater and lesser trochanters; muscle pull (iliopsoas, external rotators, adductors) shortens and externally rotates the leg; cannot bear weight; groin pain.', 1, ''),
               E('The region has rich blood supply: heals well when stabilized, but bleeds (often 500-1,000 mL into the thigh and at surgery), worsening her anemia (Hgb 8.9) and hemodynamics.', 1, ''),
               E('Stress and inflammatory response: catecholamines and cortisol raise HR, glucose and WBC; severe pain; immobility then causes DVT/PE, pneumonia/atelectasis, pressure injury, constipation, delirium.', 1, ''),
               E('Treatment: surgical fixation with an intramedullary (cephalomedullary) nail within 24-48 hours restores stability, controls pain and allows early mobilization; delay raises complications and mortality.', 1, '')],
                   'rules': 'One point per concept explained correctly in the student\'s own words. Copying textbook phrases without explanation earns 0.5.'}},
          {'id': '2.2', 'type': 'concept', 'points': 3, 'title': 'Cause-and-Effect Chain',
           'prompt': 'Fill in each box (one or two lines) to show how events in this patient lead from the fall to the problems you will have to prevent.',
           'boxes': ['1. Why did she fall? (factors in THIS patient)', '2. Why did the bone break so easily?', '3. What is broken and what does the leg look like?', '4. What is the body\'s immediate response (pain, stress, bleeding)?', '5. What happens because she cannot move?', '6. How does the nail surgery and early mobility interrupt the chain?'],
           'key': {'elements': [
               E('1: tripped at night on the way to the bathroom; frailty, neuropathy (reduced foot sensation), gabapentin/other meds, poor lighting; high fall risk.', 0.5, ''),
               E('2: osteoporosis with anastrozole, prednisone, RA, low vitamin D, smoking.', 0.5, ''),
               E('3: unstable right intertrochanteric femur fracture; shortened, externally rotated leg, unable to lift it.', 0.5, ''),
               E('4: pain, stress response (tachycardia, glucose 201, WBC 11.8) and bleeding into the thigh (anemia).', 0.5, ''),
               E('5: DVT/PE, atelectasis/pneumonia (COPD), pressure injury (Braden 17), constipation, delirium, deconditioning.', 0.5, ''),
               E('6: stabilizes the fracture, controls pain, allows early mobilization and prevents the immobility complications.', 0.5, '')]}},
          {'id': '2.3', 'type': 'table', 'points': 4, 'title': 'How Do You Know? Findings and Mechanisms',
           'prompt': 'List EIGHT findings from this patient\'s assessment, labs or diagnostics that support the hip fracture or show how her body is responding. Beside each, explain the mechanism that causes it.',
           'where': 'Notes, Flowsheets, Lab Results, Imaging', 'cols': ['Finding in THIS patient (with value)', 'Why it happens (mechanism)'], 'widths': [2.7, 4.3], 'rows': 8, 'rowH': 0.55,
           'key': {'answer': 'Each row 0.5 when the finding is real and from this chart AND the mechanism is correct. Any 8 of the following.', 'bank': True,
                   'elements': [E('R leg shortened and externally rotated: displaced fracture with unopposed pull of hip muscles.', 0, ''), E('Severe pain 10/10 and inability to bear weight: periosteal nerve endings and instability; muscle spasm.', 0, ''),
                                E('Ecchymosis over the right lateral hip: bleeding from the fracture into soft tissue.', 0, ''), E('HR 111 and RR 23 at triage: pain and stress (sympathetic activation); possible blood loss.', 0, ''),
                                E('Hgb 8.9 (baseline about 10): chronic anemia plus blood loss into the thigh.', 0, ''), E('Glucose 201: stress hormones and prednisone plus diabetes (A1c 8.0).', 0, ''),
                                E('WBC 11.8: stress response/demargination and prednisone; not necessarily infection.', 0, ''), E('BUN 21: mild dehydration before the fall/poor intake and hemoconcentration.', 0, ''),
                                E('Albumin 2.7 and vitamin D 19: poor nutrition/frailty and low vitamin D weaken bone and healing.', 0, ''), E('Diffuse osteopenia on X-ray: osteoporosis.', 0, ''),
                                E('Blanchable sacral redness, Braden 17: immobility, edema and pressure.', 0, ''), E('Wheeze and SpO2 91% on room air: COPD baseline; risk of atelectasis with immobility and opioids.', 0, '')],
                   'rules': 'Maximum 4.0.'}},
          {'id': '2.4a', 'type': 'box', 'points': 1, 'lines': 6, 'title': 'Why her bones are fragile', 'prompt': 'Name THREE things in her chart (medicines, diagnoses, habits or labs) that weakened her bones and explain how each does it.',
           'key': {'elements': [E('Any 3 of: anastrozole lowers estrogen (bone resorption rises); long-term prednisone reduces bone formation and calcium absorption; rheumatoid arthritis inflammation; vitamin D 19; smoking; long-term PPI; low albumin/frailty.', 1.0, '')], 'rules': '0.33 per correct factor with a correct mechanism.'}},
          {'id': '2.4b', 'type': 'box', 'points': 1, 'lines': 7, 'title': 'Heart and lungs around surgery', 'prompt': 'She has HFrEF (EF about 35%), coronary artery disease, atrial fibrillation and COPD. Explain TWO ways surgery and blood loss threaten her heart and lungs, and what that means for fluids, beta blockers and oxygen.',
           'key': {'elements': [E('Blood loss/anemia lowers oxygen delivery while pain and tachycardia raise demand: ischemia risk with CAD; hypotension and anesthesia stress the failing heart.', 0.4, ''), E('Fluids: too much IV fluid causes pulmonary edema in HFrEF; too little causes hypotension; give judiciously and weigh daily.', 0.3, ''), E('Beta blocker should be continued (stopping abruptly causes rebound tachycardia/AF with RVR), and oxygen kept at 88-92% for COPD to avoid CO2 retention.', 0.3, '')]}},
          {'id': '2.4c', 'type': 'box', 'points': 1, 'lines': 7, 'title': 'Steroids, methotrexate and infection', 'prompt': 'She takes prednisone 7.5 mg daily and methotrexate weekly for rheumatoid arthritis and has a history of MRSA. Explain how these affect her risk for infection and how an infection might look different in her.',
           'key': {'elements': [E('Both suppress the immune system: higher surgical-site and pneumonia/UTI risk.', 0.4, ''), E('Fever and WBC rise may be blunted (afebrile despite infection); look at wound, confusion, tachycardia, glucose swings.', 0.3, ''), E('Chronic prednisone also suppresses the adrenal glands (stress-dose steroids may be needed) and raises glucose; MRSA colonization raises wound infection risk.', 0.3, '')]}},
          {'id': '2.5', 'type': 'box', 'points': 2, 'lines': 7, 'title': 'Treatment', 'prompt': 'What are we doing to treat this diagnosis before and after surgery? Include medical treatments AND nursing monitoring.',
           'key': {'elements': [E('Pain control: fascia iliaca block, scheduled acetaminophen, low-dose IV/PO opioids, avoid NSAIDs; skin traction for comfort.', 0.5, ''), E('Surgery: cephalomedullary nail within 24-48 h; NPO after midnight; consent, type and screen; hold anticoagulants and document the last dose.', 0.5, ''), E('VTE prevention: SCDs plus heparin now, enoxaparin after surgery, apixaban resumes later.', 0.5, ''), E('Nursing monitoring: neurovascular checks q4h, vital signs, glucose, delirium screen, skin/pressure care, I&O, bowel regimen, incentive spirometry, early PT/OT after surgery.', 0.5, '')]}},
          {'id': '2.6', 'type': 'box', 'points': 2, 'lines': 8, 'title': 'Hemoglobin', 'where': 'Lab Results > Hemoglobin; Orders',
           'prompt': 'Her hemoglobin is 8.9 (baseline about 10). Why does this matter more in HER than in a healthy patient having the same surgery? State the transfusion threshold that is ordered, what conflicting threshold you found in the notes, and what you would watch for if she needs blood.',
           'key': {'elements': [E('CAD and HFrEF tolerate anemia and low volume poorly (ischemia, heart failure); frail, COPD; surgery will lose more blood.', 0.5, ''), E('Order: transfuse for Hgb below 8 or symptomatic. Notes also say below 7 (conflict to clarify).', 0.5, ''), E('Symptoms/signs to watch: tachycardia, hypotension, dyspnea, chest pain, dizziness, pallor, confusion.', 0.5, ''), E('If transfusing: transfuse slowly and watch for volume overload (TACO) in HFrEF, check vital signs per protocol, verify blood with two nurses, monitor for reaction.', 0.5, '')]}},
      ]}

# ------------------------------------------------------------------ PART 3
MEDBANK = [
    E('insulin glargine (Lantus) 20 units HS: long-acting basal insulin; T2DM. Hypoglycemia risk; notify if glucose <100 before giving (order); dose already reduced 20% for NPO.', 0, ''),
    E('insulin lispro (Humalog) correction scale ACHS: rapid-acting insulin; corrects hyperglycemia (glucose 201). Give per scale only; check glucose first; hypoglycemia risk if NPO.', 0, ''),
    E('prednisone 7.5 mg daily: corticosteroid, suppresses inflammation; RA. Do not stop abruptly (adrenal suppression), ask about stress-dose; raises glucose; infection risk.', 0, ''),
    E('methotrexate (Trexall) 15 mg ONCE WEEKLY: DMARD/antimetabolite, folate antagonist; RA. High-alert (never daily); hold for infection, WBC <3, platelets <100, rising creatinine, mouth sores, cough/dyspnea; verify the hold today.', 0, ''),
    E('hydroxychloroquine (Plaquenil), folic acid: DMARD for RA / folate supplement to reduce methotrexate side effects.', 0, ''),
    E('lisinopril 20 mg daily: ACE inhibitor; HTN/HF. Hold/notify SBP <100; usually held 24 h before surgery (hypotension); check K and creatinine.', 0, ''),
    E('metoprolol tartrate 25 mg BID AND carvedilol 6.25 mg BID: beta blockers; CAD, rate control, HF. Duplicate therapy (clarify); hold/notify HR <55 or SBP <100; do not stop abruptly.', 0, ''),
    E('furosemide 40 mg daily: loop diuretic; HF. Monitor K, dehydration/hypotension; hospitalist says hold diuretics; sulfonamide non-antibiotic with sulfa allergy: low cross-reactivity, assess.', 0, ''),
    E('aspirin 81 mg daily: antiplatelet; CAD/stent. Bleeding risk with surgery and SSRI; usually continued perioperatively per surgeon.', 0, ''),
    E('atorvastatin 40 mg HS: statin; CAD. Muscle pain, liver; continue.', 0, ''),
    E('heparin 5,000 units SQ q8h: anticoagulant (prophylaxis); VTE prevention before surgery. High-alert; bleeding, platelets (HIT); verify timing around OR.', 0, ''),
    E('enoxaparin 40 mg SQ daily (starts 10/09 2115) and apixaban 5 mg BID (starts 10/11): post-op VTE prophylaxis / AFib stroke prevention; High-alert; hold for bleeding or platelets <50; never overlap agents.', 0, ''),
    E('cefazolin 2 g IV q8h (starts 10/09 0730): cephalosporin; surgical prophylaxis. Penicillin allergy (hives): low cross-reactivity, verify per protocol; no MRSA coverage.', 0, ''),
    E('morphine 2 mg IV q3h PRN 7-10 and oxycodone 5 mg PO q4h PRN 4-6: opioid agonists; pain. High-alert; hold RR <10, SpO2 <90, sedation; COPD, frailty, gabapentin increase respiratory depression; constipation.', 0, ''),
    E('acetaminophen 1,000 mg q8h: non-opioid analgesic; multimodal pain. Max daily dose (3-4 g all sources); liver.', 0, ''),
    E('gabapentin 300 mg TID: anticonvulsant/neuropathic pain agent; neuropathy. Sedation/dizziness/falls and respiratory depression with opioids; renally dosed.', 0, ''),
    E('sertraline 50 mg daily: SSRI; depression/anxiety. Bleeding risk with aspirin/anticoagulants; hyponatremia; serotonin syndrome with some drugs; QT with ondansetron.', 0, ''),
    E('fluticasone-salmeterol (Advair) BID, ipratropium-albuterol (DuoNeb) q6h, albuterol PRN: COPD therapy (corticosteroid+LABA; anticholinergic+SABA; rescue). Rinse mouth; tachycardia; avoid duplicate anticholinergic (tiotropium replaced).', 0, ''),
    E('pantoprazole 40 mg daily: proton pump inhibitor; GERD. Long-term use linked to fracture risk and low B12/Mg; plan says IV when NPO.', 0, ''),
    E('senna-docusate, polyethylene glycol, bisacodyl: laxatives; constipation worsened by opioids and immobility. Hold for loose stools.', 0, ''),
    E('anastrozole 1 mg daily: aromatase inhibitor; adjuvant therapy after mastectomy. Lowers estrogen: bone loss/fracture risk.', 0, ''),
    E('mupirocin nasal BID x5 days: topical antibiotic; MRSA decolonization (with chlorhexidine baths).', 0, ''),
    E('nicotine patch 21 mg daily: nicotine replacement; tobacco use. Rotate sites; remove old patch; tachycardia.', 0, ''),
    E('melatonin 3 mg HS: sleep and delirium prevention. Low risk.', 0, '')]
p3 = {'id': '3', 'title': 'Pharmacology and Medication Safety', 'step': 'Assessment / Analysis (and safe implementation)', 'minutes': 70,
      'intro': 'Use your drug guide and the MAR (and the drug guide link inside the EHR). Many home medications were ordered at admission; part of your job is to question them.',
      'items': [
          {'id': '3.1', 'type': 'table', 'points': 6, 'title': 'Medication List',
           'prompt': 'From the MAR and orders, choose the EIGHT medications that matter most to you before the 0900 medication pass. List brand and generic names.', 'where': 'MAR (click the medication name for the drug guide)',
           'cols': ['Medication (brand and generic)', 'Drug class and mechanism (10 words or fewer)', 'Why is THIS patient taking it?', 'Key nursing check / hold parameter'], 'widths': [1.55, 1.95, 1.7, 1.8], 'rows': 8, 'rowH': 0.62,
           'key': {'answer': 'Each row 0.75: medication is on this patient\'s MAR/orders (0.15), correct class and mechanism (0.2), correct indication for this patient (0.2), valid nursing check/hold parameter (0.2). Use the bank below.', 'elements': MEDBANK,
                   'rules': 'Maximum 6.0. Penalize a row that names a drug not on the chart. Accept brand OR generic.', 'bank': True}},
          {'id': '3.2a', 'type': 'box', 'points': 1.5, 'lines': 9, 'title': 'Blood thinners around surgery', 'where': 'MAR, Orders (note the start dates), Sticky notes',
           'prompt': 'Look at the heparin, enoxaparin, apixaban and aspirin orders and their start dates. Explain the plan the orders are following before and after surgery, what you must verify with the patient and the team before the OR, what you assess, and why her bleeding risk is higher than average.',
           'key': {'elements': [E('Plan: heparin SQ q8h now (with SCDs); enoxaparin starts after surgery (10/09 2115); apixaban resumes about 10/11; the agents should never overlap.', 0.5, ''), E('Verify: the time of the last home apixaban dose (hold typically 48-72 h; affects anesthesia choice and timing), heparin timing before the OR, platelets/INR/aPTT, and document.', 0.5, ''),
                               E('Bleeding risk: aspirin + SSRI + anticoagulant, anemia Hgb 8.9, surgery, frailty, chronic steroid-fragile skin. Assess bleeding/ecchymosis/thigh swelling, Hgb, neurovascular status; report.', 0.5, '')]}},
          {'id': '3.2b', 'type': 'box', 'points': 1.5, 'lines': 9, 'title': 'Beta blockers, ACE inhibitor and diuretic', 'prompt': 'At 0900 she has metoprolol AND carvedilol, lisinopril, and furosemide due. What is wrong or risky here, what do you do before giving any of them, and what do the hold parameters protect against?',
           'key': {'elements': [E('Two beta blockers = duplicate therapy (bradycardia, hypotension); metoprolol tartrate is not an evidence-based HFrEF beta blocker. Clarify and give only the one chosen, with HR and BP checks (hold HR <55 or SBP <100).', 0.5, ''), E('Beta blocker should be continued around surgery (do not stop abruptly: rebound tachycardia, AF with RVR, ischemia), with sips if NPO.', 0.5, ''), E('Lisinopril is usually held 24 h before surgery and furosemide per hospitalist: hypotension under anesthesia, dehydration/AKI; clarify with provider before giving and document.', 0.5, '')]}},
          {'id': '3.2c', 'type': 'box', 'points': 1.5, 'lines': 9, 'title': 'Methotrexate and prednisone', 'prompt': 'Methotrexate 15 mg is a weekly high-alert medicine and prednisone is a long-term steroid. What must you verify about each before surgery, and what could go wrong?',
           'key': {'elements': [E('Methotrexate: weekly only (next dose 10/09, the surgery day); hospitalist says hold: confirm the hold order exists and that it will not be given; daily dosing errors can be fatal (bone marrow, liver, mucositis); monitor WBC, platelets, creatinine, infection.', 0.5, ''), E('Prednisone: do not skip or stop (adrenal suppression, crisis with hypotension); give the 0800 dose and ask the provider/anesthesia about stress-dose steroids for surgery.', 0.5, ''), E('Immunosuppression: infection signs masked, wound healing delayed, steroid raises glucose (201), fragile skin/tears; MRSA vigilance.', 0.5, '')]}},
          {'id': '3.2d', 'type': 'box', 'points': 1.5, 'lines': 9, 'title': 'Insulin and glucose', 'prompt': 'Her glucose is 201 and A1c 8.0. She has glargine 20 units at bedtime and a lispro correction scale, will be NPO after midnight, and takes prednisone. What is the glucose goal, what are the risks, and what will you monitor and do?',
           'key': {'elements': [E('Goal 140-180 mg/dL in hospital (infection and healing); stress, steroid and diabetes raise it.', 0.5, ''), E('NPO plus basal insulin raises hypoglycemia risk; glargine dose is reduced when NPO (check the order: notify provider if glucose <100); lispro correction is only for high values, not for meals she will not eat.', 0.5, ''), E('Monitor glucose ACHS (q4-6h when NPO), follow the hypoglycemia protocol (IV dextrose if NPO), know that beta blockers can hide hypoglycemia symptoms, report persistent values over 180-250.', 0.5, '')]}},
          {'id': '3.3', 'type': 'boxes', 'points': 2, 'title': 'Math From the Chart', 'where': 'MAR, Orders, Nerve block procedure note',
           'prompt': 'Show your work in the box. Include units.', 'subs': [
              {'label': 'a) The fascia iliaca block used 30 mL of ropivacaine 0.2%. How many mg were given? The maximum is 3 mg/kg; is this below the maximum for her 70 kg?', 'lines': 2},
              {'label': 'b) Cefazolin 2 g is mixed in 100 mL and ordered to infuse over 30 minutes. What is the pump rate in mL/hour?', 'lines': 2},
              {'label': 'c) Her glargine dose of 20 units is a 20% reduction from her home dose. What is her home dose?', 'lines': 2},
              {'label': 'd) Maintenance lactated Ringer\'s runs at 40 mL/hour. How many mL will she receive in 3 hours? (She has HFrEF; why does the volume matter?)', 'lines': 2}],
           'key': {'elements': [E('a) 0.2% = 2 mg/mL; 30 mL x 2 = 60 mg; 3 mg/kg x 70 kg = 210 mg; 60 mg is below the maximum', 0.5, ''), E('b) 100 mL / 0.5 h = 200 mL/hour', 0.5, ''), E('c) 20 / 0.8 = 25 units', 0.5, ''), E('d) 40 x 3 = 120 mL; fluid overload risk with EF 35%', 0.5, '')],
                   'rules': 'Half credit if the method is correct but arithmetic or units are wrong. No credit without work shown.'}},
      ]}

# ------------------------------------------------------------------ PART 4
p4 = {'id': '4', 'title': 'Nursing Diagnoses and Priorities', 'step': 'Diagnosis', 'minutes': 30,
      'intro': 'Use NANDA-I diagnoses. Write each as problem, "related to" (cause you can treat), and "as evidenced by" (specific data). Do not use a medical diagnosis as the "related to."',
      'items': [
          {'id': '4.1', 'type': 'table', 'points': 6, 'title': 'Prioritized Nursing Diagnoses', 'prompt': 'Write FOUR nursing diagnoses in priority order (1 = highest).',
           'cols': ['#', 'NANDA-I nursing diagnosis', 'Related to (etiology)', 'As evidenced by (at least 2 specific chart findings)'], 'widths': [0.4, 1.9, 2.0, 2.7], 'rows': 4, 'rowH': 1.0,
           'key': {'answer': 'Each row 1.5: valid, patient-appropriate diagnosis (0.5); "related to" is correct and is not a medical diagnosis (0.5); "as evidenced by" cites at least 2 specific data (0.5). Accept the top diagnosis if the justification in 4.2 uses a physiologic framework.', 'bank': True,
                   'elements': [E('Acute pain r/t tissue and bone injury and muscle spasm AEB pain 10/10 on arrival, 6/10 now (block wearing off), guarding, tachycardia.', 0, ''),
                                E('Risk for bleeding (hemorrhage) r/t fracture and upcoming surgery, anticoagulant/antiplatelet therapy, anemia (Hgb 8.9).', 0, ''),
                                E('Risk for peripheral neurovascular dysfunction r/t fracture, traction and edema (baseline neuropathy; R pulses palpable now).', 0, ''),
                                E('Risk for ineffective breathing pattern / impaired gas exchange r/t COPD, immobility and opioid use AEB wheeze, SpO2 91% RA.', 0, ''),
                                E('Risk for acute confusion (delirium) r/t age, frailty, pain, opioids, gabapentin, hospital environment (CAM negative now).', 0, ''),
                                E('Risk for infection r/t immunosuppression (prednisone, methotrexate), diabetes, MRSA history, surgery.', 0, ''),
                                E('Risk for unstable blood glucose level r/t diabetes, prednisone, NPO and stress AEB glucose 201, A1c 8.0.', 0, ''),
                                E('Impaired physical mobility r/t fracture and non-weight-bearing orders AEB inability to bear weight.', 0, ''),
                                E('Risk for pressure injury r/t immobility, edema and traction AEB Braden 17, sacral redness.', 0, ''),
                                E('Risk for falls r/t frailty, neuropathy, medications.', 0, ''), E('Risk for constipation r/t opioids and immobility AEB baseline hard stools.', 0, ''),
                                E('Risk for decreased cardiac output r/t HFrEF, AFib, blood loss.', 0, '')],
                   'rules': 'Maximum 6.0. A problem-only statement with no etiology or evidence earns 0.5 for that row at most.'}},
          {'id': '4.2', 'type': 'box', 'points': 2, 'lines': 7, 'title': 'Why This Order?', 'prompt': 'Explain why your #1 diagnosis is first (use ABCs, Maslow, or acuity). Name one risk diagnosis you ranked lower that could become the top priority and what finding would move it up.',
           'key': {'elements': [E('Applies a framework: airway/breathing/circulation, Maslow physiologic needs, or acuity (what could harm her soonest).', 0.5, ''), E('Ties ranking to patient data (pain, SpO2 on room air, Hgb, anticoagulants, neurovascular status).', 0.5, ''), E('Names a valid lower-ranked risk (bleeding, neurovascular compromise, respiratory depression, delirium, infection).', 0.5, ''), E('Gives a concrete trigger (HR >110 or SBP <100, Hgb <8, cool/pale foot or capillary refill >3 s, SpO2 <88, RR <10 or sedation, new confusion/CAM positive).', 0.5, '')]}},
      ]}

# ------------------------------------------------------------------ PART 5
SMART = 'SMART goal = Specific, Measurable, Achievable, Relevant, Time-bound, written about the PATIENT (not the nurse).'
p5 = {'id': '5', 'title': 'Planning and Implementation', 'step': 'Planning / Implementation', 'minutes': 60,
      'intro': 'Plan the care for the 0700-1500 shift. She is waiting for surgery. ' + SMART,
      'items': [
          {'id': '5.1a', 'type': 'table', 'points': 2.5, 'title': 'Plan for Priority Diagnosis #1: ________________', 'cols': ['SMART goal for this shift', 'Nursing interventions (at least 4: what, how often)', 'Rationale', 'I / C / D'], 'widths': [1.6, 3.1, 1.7, 0.6], 'rows': 4, 'rowH': 0.8,
           'prompt': 'I = independent, C = collaborative, D = delegated.',
           'key': {'answer': 'Goal 0.75 (measurable number AND time frame AND patient-centered); interventions 1.25 (at least 4 safe, specific, with frequency: about 0.3 each); rationale 0.5 (correct for at least 3 interventions). Accept any diagnosis chosen in 4.1. Model answers:', 'bank': True,
                   'elements': [E('Acute pain: Goal: pain at or below 4/10 at rest and 5/10 with repositioning, RR 12 or higher, and awake (not sedated) through 1500. Interventions: pain score 0-10 and sedation level with every vital set, before/after medicine and about 30-60 min after each dose; give scheduled acetaminophen 1,000 mg on time (max 3-4 g/24 h from all sources); morphine 2 mg IV PRN 7-10 and oxycodone 5 mg PO PRN 4-6 per order and hold for RR <10, SpO2 <90 or sedation; non-drug: log-roll, pillows, check traction weight/skin, ice, calm environment; watch for the block wearing off (8-12 h after 0430) and report pain out of proportion. Rationale: multimodal analgesia limits opioid sedation in COPD/frailty; early pain control prevents delirium.', 0, ''),
                            E('Risk for peripheral neurovascular dysfunction: Goal: R foot warm, pink, cap refill <3 s, pedal pulse palpable, toe movement and sensation unchanged from baseline at every check through 1500. Interventions: 5 Ps (pain, pulse, pallor, paresthesia, paralysis) and temperature, comparing R to L every 4 h and more often as ordered; know baseline stocking-pattern neuropathy; keep traction aligned, no pressure on peroneal nerve/heel; report any change immediately. Rationale: early detection of vascular compromise or compartment syndrome prevents limb loss.', 0, ''),
                            E('Risk for bleeding: Goal: no signs of bleeding (HR <100, SBP >100, thigh soft, Hgb stable at or above 8) through 1500. Interventions: vital signs q4h, assess hip/thigh swelling, ecchymosis, stool/urine; verify last apixaban dose and hold as ordered; do not give duplicate anticoagulants; review Hgb/platelets; keep type and screen current; bleeding precautions. Rationale: fracture hematoma, aspirin/SSRI/heparin and anemia.', 0, '')],
                   'rules': 'A goal without a number or time frame earns 0.25. Interventions that are not specific ("monitor patient") earn no credit.'}},
          {'id': '5.1b', 'type': 'table', 'points': 2.5, 'title': 'Plan for Priority Diagnosis #2: ________________', 'cols': ['SMART goal for this shift', 'Nursing interventions (at least 4: what, how often)', 'Rationale', 'I / C / D'], 'widths': [1.6, 3.1, 1.7, 0.6], 'rows': 4, 'rowH': 0.8,
           'key': {'answer': 'Same scoring as 5.1a. Other strong second diagnoses: Risk for ineffective breathing/gas exchange (SpO2 q4h and with each opioid, goal 88-92%, HOB 30, incentive spirometer 10x/hour while awake, nebulizers on time, hold opioids for RR <10, report SpO2 <88), Risk for delirium (CAM q shift and with change, glasses/hearing aids, reorient, sleep, avoid sedatives, treat pain, review gabapentin/opioid doses), Risk for infection/unstable glucose (glucose ACHS, hand hygiene, contact precautions, chlorhexidine bathing, mupirocin, watch for subtle infection signs).'}},
          {'id': '5.2', 'type': 'table', 'points': 3, 'title': 'Time-Sequenced Plan for the Shift', 'where': 'Brain/Worklist, MAR, Orders, Secure Chat, Notes',
           'prompt': 'For each hour, list your priority actions IN ORDER. Include medications (and which you will question), pre-operative preparation, assessments, teaching, and communication, and say why that time.',
           'cols': ['Time', 'Priority actions in order', 'Why at this time'], 'widths': [0.7, 4.3, 2.0], 'rows': [['0700'], ['0800'], ['0900'], ['1000'], ['1100'], ['1200'], ['1300'], ['1400']], 'rowH': 0.72,
           'key': {'answer': 'Score 0.375 per hour row with an appropriate, sequenced, patient-specific plan.', 'bank': True, 'elements': [
               E('0700: bedside report with safety checks (ID and allergy bands, bed alarm, call light, contact precautions); assess pain, R leg neurovascular, CAM, lungs, skin, traction; vital signs; verify NPO instruction and the OR date/time; review orders and plan the clarifications.', 0, ''),
               E('0730-0800: POC glucose and lispro per scale (given 0730); prednisone 0800 (do not skip); DuoNeb/COPD care; case management consult; call the surgical team/hospitalist/pharmacy about the order conflicts before the 0900 meds (duplicate beta blockers, lisinopril/furosemide, methotrexate hold, transfusion threshold, OR time).', 0, ''),
               E('0900: medication pass with clarifications first: give approved meds only (one beta blocker with HR/BP check, aspirin per surgeon, inhalers, sertraline, hydroxychloroquine, folic acid, gabapentin with sedation check, pantoprazole), hold lisinopril/furosemide until clarified, methotrexate not given; mupirocin; nicotine patch; contact precautions.', 0, ''),
               E('1000: pre-operative preparation: consent and site marking verified, pre-op checklist, last apixaban dose documented, allergy and MRSA/antibiotic plan clarified, pre-op teaching and teach-back (NPO after midnight, what to expect, incentive spirometer, post-op mobility), pacemaker/electrocautery information passed on, belongings/hearing aids.', 0, ''),
               E('1100: dietitian and nutrition (albumin 2.7), skin/pressure care and reposition with log-roll, traction check, I&O, bowel regimen/constipation plan, hourly rounding.', 0, ''),
               E('1130-1200: glucose before lunch and lispro per scale; consistent-carbohydrate meal, 2 g sodium; DuoNeb 1200; neurovascular check (q4h); reassess pain and block wearing off (8-12 h from 0430).', 0, ''),
               E('1300: pain reassessment, CAM, vital signs, neurovascular check; update team on pain trend; PT/OT and case management follow-up; communicate with spouse/family.', 0, ''),
               E('1400: heparin 5,000 units due (verify timing relative to OR and bleeding), acetaminophen and gabapentin due (sedation/respiratory check first), documentation, handoff with open issues (NPO/OR time, clarifications, last apixaban dose).', 0, '')],
                   'rules': 'Give no credit for a row that lists only "meds" or "assessment." Penalize a plan that gives all home meds at 0900 without addressing NPO/OR timing and the conflicts.'}},
          {'id': '5.3', 'type': 'boxes', 'points': 2, 'title': 'Calling the Provider (SBAR)', 'where': 'MAR; Orders; Notes',
           'prompt': 'At 0830 you review the 0900 medications. Metoprolol tartrate AND carvedilol are both scheduled, lisinopril and furosemide are due although the hospitalist said to hold diuretics, her BP is 150/89 and HR 99, and the OR time is unclear. You decide to call the hospitalist (co-management). Write what you would say.',
           'subs': [{'label': 'S: Situation', 'lines': 3}, {'label': 'B: Background', 'lines': 3}, {'label': 'A: Assessment', 'lines': 3}, {'label': 'R: Recommendation / request', 'lines': 3}],
           'key': {'elements': [E('S: identifies self, patient, room, and the specific problem: duplicate beta blockers and lisinopril/furosemide due at 0900 against the hold plan; gives current HR 99, BP 150/89.', 0.5, ''), E('B: right intertrochanteric hip fracture, surgery planned, HFrEF/CAD/AFib/HTN, NPO after midnight, allergies, code status; last doses.', 0.5, ''), E('A: states a concern (risk of bradycardia/hypotension from two beta blockers; ACE inhibitor/diuretic before surgery), vital signs stable now.', 0.5, ''), E('R: asks which ONE beta blocker to give, whether to hold lisinopril and furosemide, confirm OR time and methotrexate hold; read-back of orders.', 0.5, '')]}},
          {'id': '5.4', 'type': 'matrix', 'points': 2, 'title': 'Delegation', 'prompt': 'Mark the LOWEST level of staff who may be assigned each task for this patient.', 'cols': ['RN only', 'LPN/LVN', 'UAP/PCT'],
           'rows': ['Perform the chlorhexidine bath and log-roll her to change her position', 'Compare the pulses, color, warmth, sensation and movement of both feet and decide if the change is concerning', 'Decide whether to give the 0900 beta blocker, lisinopril and furosemide after the plan is clarified', 'Give the scheduled 1400 acetaminophen and gabapentin after the RN reviews her sedation score and respiratory rate'],
           'key': {'answer': ['UAP/PCT', 'RN only', 'RN only', 'LPN/LVN'], 'rules': '0.5 per row. Accept RN-only for row 4 if the student explains the RN retains the assessment responsibility.'}},
          {'id': '5.5', 'type': 'table', 'points': 2, 'title': 'Teaching Plan', 'prompt': 'List FOUR teaching topics this patient needs before and after surgery. Adapt each to her barriers (pain, anxiety, frailty, hearing and vision aids, spouse involvement) and say how you will check understanding.',
           'cols': ['Teaching topic', 'How you will teach it (adapted to barriers)', 'How you will confirm learning'], 'widths': [1.8, 3.2, 2.0], 'rows': 4, 'rowH': 0.8,
           'key': {'answer': 'Each row 0.5: appropriate topic (0.25) AND method adapted to her barriers/teach-back (0.25).', 'bank': True, 'elements': [
               E('What to expect before and after surgery: NPO after midnight, consent, nail fixation, pain control options, call-light use, weight-bearing orders.', 0, ''), E('Breathing exercises: incentive spirometer 10x/hour awake, deep breathing, cough, nebulizers (COPD).', 0, ''),
               E('Clot, bleeding and infection prevention: SCDs, ankle pumps, anticoagulant plan, hand hygiene, report calf pain, chest pain, swelling, wound drainage.', 0, ''), E('Pain management and opioid safety: ask early, rate pain, report sedation, constipation prevention.', 0, ''),
               E('Fall and bone health: call for help, non-skid socks, night lighting, osteoporosis treatment, calcium/vitamin D, smoking cessation, medication review.', 0, ''), E('Blood sugar management and steroid/medication safety (methotrexate once weekly, no NSAIDs).', 0, ''),
               E('Barrier strategies: pain-controlled teaching, glasses and hearing aids on, short sessions, involve spouse, written large-print sheet, teach-back.', 0, '')]}},
      ]}

# ------------------------------------------------------------------ PART 6
p6 = {'id': '6', 'title': 'Evaluation: What Happened and What Next?', 'step': 'Evaluation', 'minutes': 35,
      'intro': 'Open the sealed page. It describes what happened during your shift (written by your instructor; it is not in the EHR). Do not change your Part 1-5 answers.',
      'items': [
          {'id': '6.0', 'type': 'sealed', 'points': 0, 'banner': 'SEALED PAGE. Read only after Parts 1 to 5 are complete.', 'intro': 'Instructor addendum for the 0700-1500 shift. The EHR has no entries after 0700; use these events as if you had charted them.', 'maxNotes': 0,
           'addendum': [
               {'time': '0730-0900', 'title': 'Morning', 'lines': ['Glucose 187 at 0730; lispro correction given. Prednisone given 0800. The surgical team confirms the OR is tomorrow at 0800. They tell you: keep her NPO after midnight, give ONE beta blocker (carvedilol), hold lisinopril and furosemide, and the methotrexate will not be given.', 'She states her last dose of apixaban was last night at 2000 (before the fall).']},
               {'time': '1215', 'title': 'The nerve block wears off', 'lines': ['Pain rises from 4/10 to 8/10 and she is restless. Morphine 2 mg IV given at 1220.']},
               {'time': '1300', 'title': 'Reassessment', 'lines': ['Pain 8/10. Right thigh looks larger and tense with new bruising spreading to the flank. R foot toes cool and pale, capillary refill 4 seconds, "pins and needles" (she has baseline neuropathy), pedal pulse faint. She is newly confused (CAM positive) and says "something is wrong."']}],
           'table': {'cols': ['Time', 'HR', 'BP', 'RR', 'SpO2', 'Temp', 'Pain', 'Other'], 'widths': [0.8, 0.6, 0.9, 0.6, 1.0, 0.8, 0.7, 1.6],
                     'rows': [['0424', '99', '150/89', '19', '91% RA', '98.3 F', '6/10', 'baseline'], ['1300', '112', '112/66', '22', '90% RA', '98.1 F', '8/10', 'glucose 241'], ['1330', '118', '98/58', '24', '89% RA', '98.4 F', '9/10', 'toes cool; tense thigh; CAM positive'], ['1340 labs', '', '', '', '', '', '', 'Hgb 7.6 (was 8.9); platelets 218; K 4.4; glucose 262']]},
           'caption': 'At 1400 her heparin 5,000 units SQ, gabapentin 300 mg and acetaminophen 1,000 mg are due.'},
          {'id': '6.1', 'type': 'table', 'points': 4, 'title': 'Evaluating Your Goals', 'prompt': 'For each goal you wrote in 5.1a and 5.1b, use data from the sealed page to say whether it was met, partly met, or not met, and what you will change.',
           'cols': ['Goal (copy from Part 5)', 'Data from the sealed page that you used', 'Met / Partly / Not', 'Revised plan'], 'widths': [1.6, 2.4, 0.9, 2.1], 'rows': 2, 'rowH': 1.2,
           'key': {'answer': 'Each goal 2.0: cites at least 2 data points from the sealed page (0.75); correct, defensible status (0.5); a specific revision or "continue" with reason (0.75).', 'bank': True, 'elements': [
               E('Pain goal: NOT met after 1215 (8-9/10 despite morphine), and the pain is now out of proportion with a tense thigh: revise to a priority escalation (call the surgeon), not just more opioid.', 0, ''),
               E('Neurovascular goal: NOT met (cool pale toes, capillary refill 4 s, faint pulse, tense thigh): immediate escalation (possible compartment syndrome/bleeding).', 0, ''),
               E('Bleeding goal: NOT met (Hgb 8.9 to 7.6, HR 118, BP 98/58, spreading bruise): escalate, prepare for transfusion.', 0, ''),
               E('Respiratory goal: partly/not met: SpO2 89% RA (goal 88-92 is borderline) with RR 24; start oxygen to the target, reassess, avoid more sedation.', 0, ''),
               E('Delirium goal: NOT met (CAM positive): treat the cause (pain, hypoxia, bleeding), minimize opioids/gabapentin sedation, reorient.', 0, '')],
                   'rules': 'Award the status points if the student\'s conclusion is consistent with the data they cite.'}},
          {'id': '6.2', 'type': 'box', 'points': 2, 'lines': 12, 'title': 'New Problems and Priority Actions', 'prompt': 'From the sealed page, name the TWO most urgent problems and for each the priority nursing actions (include who you notify and what you do about the medicines due at 1400).',
           'key': {'elements': [E('Possible hemorrhage/hypovolemia and compartment-type or vascular compromise of the R leg: stay with her, ABCs, call the surgeon/rapid response STAT with SBAR (do not just give more morphine).', 0.5, ''), E('Actions: oxygen to 88-92%, large-bore IV access in the LEFT arm only, hold the 1400 heparin, hold antihypertensives (SBP <100), keep NPO, anticipate STAT labs, type and cross, imaging/OR; neurovascular checks every 15 minutes.', 0.5, ''), E('Transfusion: Hgb 7.6 is below the ordered threshold of 8 and she is symptomatic (conflicting "below 7" note must not delay it); transfuse per order, slowly, watching for volume overload (HFrEF) and reaction.', 0.5, ''), E('New delirium (CAM positive), hypoxia and pain: treat causes first (pain, hypoxia, bleeding), minimize sedating medicines (gabapentin/opioid dose review with the provider), safety, reorientation, notify provider.', 0.5, '')],
                   'rules': 'Accept other valid urgent problems from the sealed page if the action is appropriate. Giving the 1400 gabapentin, heparin or an antihypertensive without question is a safety error: cap the item at 1.0.'}},
          {'id': '6.3', 'type': 'box', 'points': 2, 'lines': 11, 'title': 'Focused Nursing Note', 'prompt': 'Write a focused nursing note for the 1330 event (DAR, SOAP, or your school\'s format): data, action, and response, with the plan.',
           'key': {'elements': [E('Data: specific objective data (vital signs with times, pain, R leg neurovascular findings, thigh appearance, Hgb, CAM).', 0.5, ''), E('Action: nursing interventions and notifications (who, when, SBAR), medicines held with reasons.', 0.5, ''), E('Response: patient response/orders received, repeat assessments.', 0.5, ''), E('Plan/handoff: continuing monitoring, transfusion/OR plan, concerns for next shift; professional wording and times.', 0.5, '')]}},
      ]}

# ------------------------------------------------------------------ PART 7
p7 = {'id': '7', 'title': 'Clinical Judgment (Next-Generation NCLEX Style)', 'step': 'Evaluation / Clinical judgment', 'minutes': 30,
      'intro': 'Answer by marking the boxes. These items use the same patient. Some scenarios are hypothetical and say so.',
      'items': [
          {'id': '7.1', 'type': 'choice', 'points': 2, 'style': 'multi', 'title': 'Select All That Apply', 'prompt': 'Which nursing actions are correct for this patient today, before surgery?',
           'options': ['Verify and document the time of her last home apixaban dose.', 'Massage the right calf to prevent clots.', 'Compare the color, warmth, pulses, sensation and toe movement of the right foot with the left, remembering her baseline foot neuropathy.', 'Let her use the bedside commode with a walker.',
                       'Give the lisinopril and furosemide at 0900 without checking because they are her home medicines.', 'Question the lisinopril and furosemide with the provider before giving them.', 'Continue her prednisone and ask whether stress-dose steroids are needed.', 'Keep contact precautions and chlorhexidine bathing as ordered.'],
           'key': {'answer': ['Verify and document the time of her last home apixaban dose.', 'Compare the right foot with the left...', 'Question the lisinopril and furosemide with the provider...', 'Continue her prednisone...', 'Keep contact precautions...'], 'rules': '0.4 per correct option selected; subtract 0.4 for each incorrect option selected (not below 0). The wrong options: massage the calf, commode with a walker, give lisinopril/furosemide without checking.'}},
          {'id': '7.2', 'type': 'matrix', 'points': 2, 'title': 'Expected or Report Now?', 'prompt': 'HYPOTHETICAL: she has the nail surgery tomorrow. On post-operative day 0 you find each of these. Mark one box per row.', 'cols': ['Expected after surgery', 'Report now'],
           'rows': ['Incisional pain 4/10 that improves 30 minutes after oxycodone', 'R foot cool and pale, capillary refill 5 seconds, severe pain with passive toe movement', 'A 2 cm spot of pink drainage on the new dressing', 'HR 124, BP 88/50, new dizziness and a dressing saturated with blood'],
           'key': {'answer': ['Expected after surgery', 'Report now', 'Expected after surgery', 'Report now'], 'rules': '0.5 per row.'}},
          {'id': '7.3', 'type': 'bowtie', 'points': 2, 'title': 'Bowtie', 'stem': 'HYPOTHETICAL post-operative day 2: she suddenly has shortness of breath and sharp chest pain when she breathes in. HR 126, RR 30, SpO2 85% on room air, BP 112/70. Her right calf is swollen and tender.',
           'pickActions': 2, 'pickParams': 2,
           'actions': ['Raise the head of the bed, apply oxygen, and call the rapid response team', 'Walk her to the hallway to expand her lungs', 'Massage the right calf', 'Stay with her and apply continuous pulse oximetry and cardiac monitoring', 'Give an extra IV fluid bolus'],
           'conditions': ['Pulmonary embolism', 'Surgical site infection', 'Opioid overdose', 'Hypoglycemia'],
           'params': ['Oxygen saturation and respiratory effort', 'Heart rate and rhythm (atrial fibrillation)', 'Bowel sounds', 'Incision drainage', 'Urine color'],
           'key': {'condition': 'Pulmonary embolism', 'actions': ['Raise the head of the bed, apply oxygen, and call the rapid response team', 'Stay with her and apply continuous pulse oximetry and cardiac monitoring'], 'params': ['Oxygen saturation and respiratory effort', 'Heart rate and rhythm (atrial fibrillation)']}},
          {'id': '7.4', 'type': 'highlight', 'points': 2, 'title': 'Recognize Cues', 'prompt': 'Excerpt from a HYPOTHETICAL post-operative day 1 shift report. Which statements need follow-up NOW?',
           'statements': ['Dressing clean, dry and intact; pain 3/10 with scheduled acetaminophen.', 'She pulled out her IV at 0200 and keeps asking "who are these people?"; she was clear and oriented yesterday.', 'Glucose 148 before breakfast.', 'Last bowel movement was 4 days ago; she has taken oxycodone since surgery and has not had her laxative.',
                          'Right foot warm with a palpable pulse and normal toe movement.', 'She ate 75% of dinner.', 'The red area over her sacrum no longer blanches when pressed.', 'SpO2 93% on 2 L nasal cannula.'],
           'key': {'answer': [2, 4, 7], 'rules': 'Three cues: new confusion (delirium), constipation (4 days on opioids), non-blanchable sacral redness (stage 1 pressure injury). Score 0.67 per correct statement (round to 0.5 increments); subtract 0.5 for each wrong statement chosen (not below 0).'}},
          {'id': '7.5', 'type': 'choice', 'points': 2, 'style': 'ordered', 'title': 'Priority Actions', 'prompt': 'HYPOTHETICAL: on post-operative day 0 you find her pale and sweaty, BP 84/46, HR 128, with a dressing that is saturated with blood. Number the actions in the order you would do them.',
           'options': ['Call the rapid response team or surgeon with SBAR.', 'Apply direct pressure over the dressing, keep her flat, stay with her.', 'Apply oxygen and attach monitors (SpO2 goal 88-92%).', 'Confirm large-bore IV access in the LEFT arm, send type and cross and labs, prepare for blood.', 'Hold the next heparin and blood pressure medicines and document.'],
           'key': {'answer': ['1. Apply direct pressure and keep her flat, stay with her (or 1-2 swapped)', '2. Apply oxygen and monitors', '3. Call rapid response/surgeon', '4. IV access, type and cross, prepare for blood', '5. Hold heparin and antihypertensives; document'], 'rules': '0.4 per action in the correct position. Positions 1 and 2 may be swapped. Calling for help must come before preparing blood and documenting.'}},
      ]}

content = {'meta': meta, 'studentIntro': studentIntro, 'studentRules': studentRules,
           'keyIntro': [
               {'h': 'How to score (applies to every item)', 'lines': [
                   'Score only what is written in the student\'s box. Do not give credit for what you think the student meant. Spelling and grammar are not scored.',
                   'Accept equivalent wording and correct synonyms. Give each required element once; do not double count the same idea.',
                   'Partial points: use the amounts printed beside each element. Round the item total to the nearest 0.5. An item never earns more than its maximum.',
                   'If a box is illegible, blank, or you are unsure, give 0 for that element and list the item on the score sheet under "faculty review."',
                   'Chart-dependent answers (Parts 1-5) are judged against the chart as it was at 0700 on 10/08/26. The sealed Part 6 events are instructor-written and are not in the EHR.',
                   'Identical wording across different students\' packets is a possible academic-integrity concern; flag it.']},
               {'h': 'About this patient', 'lines': [
                   'The chart is deliberately busy (16 chronic conditions, 40 medication orders). The chart reconciliation item (1.8) lists real conflicts that were verified against the patient file: OR date/time, duplicate beta blockers, transfusion thresholds, diuretic/ACE inhibitor timing, methotrexate hold, MRSA status, attending service, insulin dose. Do not give credit for a "conflict" that is not real (for example, the anticoagulant orders are NOT a duplication: heparin now, enoxaparin starts 10/09 2115, apixaban starts 10/11).']},
               {'h': 'Passing', 'lines': ['78 of 100 points passes. A student who completes Parts 1, 3 and 7 accurately and earns about half of Parts 2, 4, 5 and 6 will pass.']}],
           'parts': [p1, p2, p3, p4, p5, p6, p7]}

if __name__ == '__main__':
    json.dump(content, open(sys.argv[1], 'w'), indent=1)
    tot = 0
    for p in content['parts']:
        s = sum(i['points'] for i in p['items'] if i['type'] not in ('text', 'sealed')); tot += s; print('Part', p['id'], s, p['minutes'], 'min')
    print('TOTAL', tot, 'minutes', sum(p['minutes'] for p in content['parts']))

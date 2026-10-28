#!/usr/bin/env python3
"""Authors content.json for the Burn ICU case study (Marcus Delaney), built shift by shift.
Only SHIFT 1 (Mon 11/02 0400-1600) is written so far; Shifts 2-6 are added one at a time after review.
Usage (from this folder):  python3 author.py content.json  &&  python3 ../../build_casestudy.py content.json patient.json out/"""
import json, sys

E = lambda t, pts, src='': {'t': t, 'pts': pts, 'src': src}

meta = {'title': 'Burn ICU Case Study: Marcus Delaney, a Three-Day ICU Stay, Shift by Shift',
        'course': 'Critical Care / Advanced Med-Surg', 'caseCode': 'CS-BURN-ICU-1', 'passPct': 78,
        'footer': 'Write one answer per numbered box, inside the box, in dark pen, neatly. Open book, individual work.'}

studentIntro = [
    {'h': 'Your patient', 'lines': [
        'You are the Burn ICU nurse for Marcus Delaney, a 34-year-old man in room BICU-6 with burns from a house fire. '
        'Open the patient in the student EHR (Student View, or the patient file from your instructor). The chart covers three days, from Monday 11/02/26 at 0400 until his transfer to a medical-surgical unit on Thursday 11/05/26 at 0700.',
        'You will work through his stay one 12-hour shift at a time. At the start of each shift, set the simulation clock to the time written at the top of that shift and read the chart up to that moment. '
        'You may not need to look past the end of the shift you are working on. Each question tells you where to look in the EHR.']},
    {'h': 'The six shifts', 'lines': [
        'Shift 1: Monday 11/02, 0400 to 1600.   Shift 2: Monday 1600 to Tuesday 11/03 0400.   Shift 3: Tuesday 0400 to 1600.',
        'Shift 4: Tuesday 1600 to Wednesday 11/04 0400.   Shift 5: Wednesday 0400 to 1600.   Shift 6: Wednesday 1600 to Thursday 11/05 0700 (transfer).']},
    {'h': 'How this case study works', 'lines': [
        'Each numbered question is a real nursing decision or a piece of reasoning you would do on the unit: reading the flowsheets, labs, orders, MAR and notes, doing the math, and explaining what you would do and why. '
        'Write your answer in the large box under each question. Short, specific answers that use Marcus\'s own numbers earn more points than general textbook answers.',
        'Expect to spend about one hour on each shift, six hours in all. It is a take-home, individual, open-book assignment: use your textbooks, drug guide, notes and the chart.']},
]
studentRules = [
    {'h': 'Scoring', 'lines': ['The whole case study is worth 100 points. A score of 78 or higher is passing.',
                               'Each numbered question shows its point value. Points are given only for what is written in the box.']},
    {'h': 'Writing so your pages can be scored from photos', 'lines': [
        'Write in dark pen or very dark pencil, print clearly, and stay inside the box. Write the answer in the box with the same number as the question.',
        'Write your name and date at the top of every page (the header prints a line for it).',
        'If you need more room, write "continued on the back" and put the question number on the back.',
        'Spell out drug names. Show your math: write the formula, the numbers and the units.',
        'When you finish: photograph EVERY page, one page per photo, on a flat surface in good light with all four corners and the page number in view.']},
]
keyIntro = [
    {'h': 'How to score (applies to every item)', 'lines': [
        'Score only what is written in the student\'s box. Spelling and grammar are not scored. Accept equivalent wording and correct synonyms. Give each element once.',
        'Partial points: use the amounts printed beside each element. Round the item total to the nearest 0.5. An item never earns more than its maximum.',
        'If a box is illegible or blank, give 0 and list the item on the score sheet under "faculty review."',
        'Chart answers are judged against the chart at the time written in the question. Small differences in totals read from the EHR (plus or minus 50 mL) are acceptable.']},
    {'h': 'About this patient', 'lines': [
        'Marcus Delaney, 34, 82 kg, 180 cm. House fire at 0130 Monday. Flame burn 22% TBSA (right arm circumferential, anterior chest, face and neck; about 8% full thickness) with smoke inhalation (COHb 14.2%), intubated at 0250, right forearm/hand escharotomy at 0315, Burn ICU arrival 0400.',
        'Parkland: 4 mL x 82 kg x 22% = 7,216 mL lactated Ringer\'s in 24 hours from the time of injury. Day 2 (Tuesday) he develops burn wound sepsis (MSSA), needs norepinephrine, and improves overnight; he is extubated Wednesday 1045 and transfers Thursday 0700.',
        'Only Shift 1 has been written so far. The point total of the finished packet will be 100: Shift 1 = 18, Shifts 2, 3, 5 and 6 = 16 each, Shift 4 (the infection) = 18.']},
]

# --------------------------------------------------------------------------- SHIFT 1
items = []

items.append({'id': '1.1', 'type': 'box', 'points': 2.5, 'lines': 9, 'title': 'Why Is He Here? Your Picture of Marcus at 0400',
              'prompt': 'Set the clock to 0400. Read the ED Provider Note, the Burn Surgery and Critical Care H&Ps, the Nursing Admission Note and the Patient Summary. In your own words, explain what happened to Marcus, what injuries he has and what has already been done, then name the THREE most urgent problems you must manage over the next 12 hours.',
              'where': 'Patient Summary; Chart Review > Notes (ED Provider Note, Burn Surgery H&P, Critical Care H&P, Nursing Admission Note)',
              'key': {'elements': [
                  E('Mechanism and burn: house fire about 0130 Mon, flame burns 22% TBSA (right arm circumferential, anterior chest, face/neck), about 8% full thickness (right forearm and hand).', 0.5, 'ED note, Burn H&P'),
                  E('Inhalation injury and carbon monoxide: hoarse voice, stridor, soot, singed nasal hairs; COHb 14.2% at 0250; intubated 0250; bronchoscopy shows grade 2 inhalation injury.', 0.5, 'ED note, bronchoscopy note'),
                  E('Right forearm/hand escharotomy at 0315 (tense forearm, no Doppler signal) with pulses returned.', 0.5, 'Escharotomy note'),
                  E('Burn shock resuscitation: Parkland lactated Ringer\'s running at 450 mL/h and titrated to urine output; lactate 5.8 down to 3.4.', 0.5, 'Orders, labs'),
                  E('Ventilated and sedated (propofol, fentanyl); lines/tubes: left IJ central line, left radial arterial line, OG tube, Foley with temperature probe.', 0.25, 'Flowsheets'),
                  E('Three priorities that make sense, for example: (1) airway/ventilation and carbon monoxide; (2) fluid resuscitation titrated to urine output; (3) circulation to the right hand after escharotomy (also acceptable: pain/sedation, infection prevention).', 0.25, '')]}})

items.append({'id': '1.2', 'type': 'box', 'points': 2, 'lines': 11, 'title': 'The Parkland Formula',
              'prompt': 'Find the burn size and his weight in the chart. (a) Calculate his total 24-hour fluid need with the Parkland formula. (b) How much must he receive in the FIRST 8 hours, and by what clock time does that period end? (c) EMS gave 500 mL of lactated Ringer\'s before the ED. Explain how that changes the hourly rate for the first 8 hours, counting from his ED arrival at 0230. (d) What rate is the second half of the fluid given at? Show your work with the units. Why is the clock started at the time of the injury and not at his arrival?',
              'where': 'Patient Summary (weight); Burn Surgery H&P (TBSA); Orders (lactated Ringer\'s); EMS Handoff Summary',
              'key': {'elements': [
                  E('Total: 4 mL x 82 kg x 22 = 7,216 mL lactated Ringer\'s in 24 hours (0.25 formula, 0.25 answer).', 0.5, ''),
                  E('First half = 3,608 mL in the first 8 hours from the INJURY (0130 to 0930).', 0.5, ''),
                  E('Subtract the EMS 500 mL: 3,108 mL over the 7 hours from 0230 to 0930 = about 444 mL/h (accept 450 mL/h, which matches the order).', 0.5, 'Order: LR 450 mL/h'),
                  E('Second half = 3,608 mL over the next 16 hours (0930 to 0130 Tue) = 225 mL/h.', 0.25, ''),
                  E('The clock starts at the injury because the capillary leak and fluid loss begin then; the first hours are the most critical (any equivalent reason).', 0.25, '')]}})

items.append({'id': '1.3', 'type': 'vitals', 'points': 1.5, 'title': 'Vital Sign Trend',
              'where': 'Flowsheets > Vital Signs',
              'prompt': 'Copy the vital signs at each time (he has an arterial line, so use the blood pressure shown). Circle every abnormal value. Then, in one or two sentences, describe the trend over the shift and say which value on the flowsheet you do NOT fully trust and why.',
              'times': ['2026-11-02 04:00', '2026-11-02 08:00', '2026-11-02 12:00', '2026-11-02 16:00'],
              'times_label': ['Mon 0400', 'Mon 0800', 'Mon 1200', 'Mon 1600'],
              'rowsLabels': ['Temperature', 'Heart rate', 'Blood pressure', 'Respiratory rate', 'SpO2 (%)', 'Pain (CPOT)'],
              'codes': ['TEMP', 'HR', 'BP', 'RR', 'SPO2', 'PAIN'],
              'key': {'rules': 'Score 1.0 x (cells correct / 24), rounded to the nearest 0.5. The trend sentence is worth 0.5: heart rate stays above 100 (106 to 112, then 101) and slowly improves with resuscitation; blood pressure is low-normal (100-107/58-63, MAP about 72-77); temperature rises from 97.4 F (cold on arrival) to 99.0 F; CPOT stays 1 because he is sedated. The value NOT to trust fully is the SpO2 of 99-100%: carbon monoxide on the hemoglobin makes the pulse oximeter read falsely normal. Allow +/- 2 for rates and +/- 0.2 F.'}})

items.append({'id': '1.3b', 'type': 'box', 'points': 0, 'lines': 4, 'title': 'Trend (scored with 1.3)', 'prompt': 'Describe the trend over the shift and name the value you do NOT fully trust and why.', 'key': {'answer': 'Scored with item 1.3.'}})

items.append({'id': '1.4', 'type': 'box', 'points': 1.5, 'lines': 9, 'title': 'The Pulse Oximeter Says 100%',
              'prompt': 'Marcus\'s SpO2 reads 99 to 100% all morning. (a) Explain why this number can be falsely reassuring in this patient. (b) Which lab results show how much carbon monoxide is on his hemoglobin, and what were the values at 0250, 0415 and 0800? (c) What treatment lowers it and how did the plan change at 0600? (d) He smokes a pack a day: what does that tell you about the value he is heading toward?',
              'where': 'Lab Results > Blood Gas (Carboxyhemoglobin, PaO2); Orders (ventilator); Flowsheets > Respiratory',
              'key': {'elements': [
                  E('A pulse oximeter cannot tell carboxyhemoglobin from oxyhemoglobin, so it reads normal even though the blood carries much less oxygen.', 0.5, ''),
                  E('Carboxyhemoglobin (co-oximetry on the arterial blood gas): 14.2% at 0250, 6.4% at 0415, 3.1% at 0800.', 0.25, 'Lab Results'),
                  E('100% oxygen (FiO2 1.0 through the ventilator) shortens the half-life of carbon monoxide; FiO2 was lowered to 0.60 at 0600 once the level was below about 5%.', 0.5, 'Flowsheets, MAR/orders'),
                  E('A smoker normally has a baseline COHb of about 3 to 5%, so a level around 3% is his baseline and not further poisoning.', 0.25, '')]}})

items.append({'id': '1.5', 'type': 'box', 'points': 1.5, 'lines': 10, 'title': 'Titrating the Fluids: What Happened at 0600?',
              'prompt': 'Open the lactated Ringer\'s order and the hourly urine output. (a) What is the urine output goal in mL/h and in mL/kg/h? (b) Write the urine outputs for 0400-0500 and 0500-0600 and say what the order tells you to do. (c) What rate was he running at 0700 and what percent change is that? (d) Name two things you check before and after increasing the rate and one danger of giving too much fluid.',
              'where': 'Orders > lactated Ringer\'s (burn resuscitation); Flowsheets > Intake/Output; MAR (rate changes)',
              'key': {'elements': [
                  E('Goal 30 to 50 mL/h, which is 0.5 mL/kg/h (about 41 mL/h for 82 kg).', 0.25, 'Order instructions'),
                  E('Urine output 25 mL and 26 mL: below 30 mL/h for two hours in a row, so increase the rate by 20 to 25% and notify the burn team.', 0.5, 'I&O, order'),
                  E('The rate went from 450 to 540 mL/h at 0600 (an increase of 20%).', 0.25, 'MAR'),
                  E('Two checks: lung sounds / peak airway pressures, abdominal distention or bladder pressure, right hand pulses and tension, edema, blood pressure and heart rate (any two).', 0.25, ''),
                  E('A danger of too much fluid ("fluid creep"): pulmonary edema, abdominal or limb compartment syndrome, more ventilator days, worse swelling or airway edema (any one).', 0.25, '')]}})

items.append({'id': '1.6', 'type': 'box', 'points': 1.5, 'lines': 12, 'title': 'Calling the Burn Surgeon',
              'prompt': 'It is 0600 and you have just seen the second low urine output. Write the SBAR you give Dr. Okafor on the phone. Use real numbers from the chart. End with what you are asking him to do and how you will confirm the order.',
              'where': 'Flowsheets (vital signs, I&O, neurovascular); Lab Results (lactate); Orders',
              'key': {'elements': [
                  E('Situation: identify yourself, patient and room; urine output 25 and 26 mL/h for two hours (less than 0.5 mL/kg/h) on lactated Ringer\'s 450 mL/h.', 0.375, ''),
                  E('Background: 34-year-old, 82 kg, 22% TBSA flame burn with inhalation injury, intubated and sedated, on the Parkland resuscitation since 0230, EMS 500 mL, escharotomy right arm.', 0.375, ''),
                  E('Assessment: current vitals (HR about 109, BP 99/55 with MAP 70), lungs/peak pressures, right hand Doppler pulses, lactate improving (3.4 at 0415), and your concern that he is under-resuscitated.', 0.375, ''),
                  E('Recommendation: ask to increase the rate by 20% per the order (to 540 mL/h) and what urine output you should call about next; read the order back and document the time and name.', 0.375, '')]}})

items.append({'id': '1.7', 'type': 'table', 'points': 1.5, 'title': 'Lines, Tubes and Airway',
              'prompt': 'List SIX lines, tubes or devices Marcus has at 0400 (not counting the ventilator). For each, write the site and what you check every shift, and one complication you are watching for.',
              'where': 'Avatar (IVs, drains and tubes); Flowsheets > Lines / Drains / Airways; Nursing Admission Note',
              'cols': ['Device and site', 'What you check or do every shift', 'A complication you watch for'], 'widths': [1.9, 2.8, 2.3], 'rows': 6, 'rowH': 0.62,
              'key': {'answer': 'Each device row is worth 0.25: the device and site are right AND the check/complication fit that device.', 'bank': True,
                      'elements': [
                          E('Endotracheal tube, 8.0 oral, 24 cm at the teeth: confirm depth and securement, cuff pressure (about 24), HOB 30, oral care, suction as needed. Complications: accidental extubation, VAP, pressure injury to the lips, tube obstruction.', 0.25, ''),
                          E('Left internal jugular central line (triple lumen): chlorhexidine dressing intact, scrub the hub, daily need review, label lumens. Complications: infection (CLABSI), air embolism, clot, bleeding.', 0.25, ''),
                          E('Left radial arterial line (right arm is burned): waveform, level and zero, check the left hand circulation, pressure bag 300 mmHg. Complications: hand ischemia, bleeding or disconnection, infection.', 0.25, ''),
                          E('OG tube 16 Fr: position confirmed by x-ray, mark at the lips, residual and feeds per order, HOB 30. Complications: aspiration, misplacement, intolerance (residual, distention).', 0.25, ''),
                          E('Foley catheter 16 Fr with temperature probe: hourly output, secured, closed system, catheter care. Complications: CAUTI, kinks/low output that is really a blocked catheter, bladder pressure reading for compartment syndrome.', 0.25, ''),
                          E('Left antecubital 18 g peripheral IV: site check, flush, patency. Complications: infiltration, phlebitis, infection. (Also accept the escharotomy sites on the right arm as a device row.)', 0.25, '')]}})

items.append({'id': '1.8', 'type': 'box', 'points': 1.5, 'lines': 11, 'title': 'The Ventilator and Sedation',
              'prompt': 'Open Flowsheets > Respiratory at 0400. (a) Calculate his ideal body weight (male: 50 kg + 2.3 kg for every inch over 5 feet; 1 inch = 2.54 cm) and the tidal volume at 6 mL/kg. Does this match the set tidal volume? (b) List FOUR actions in the ventilator-associated pneumonia (VAP) bundle that you do this shift. (c) What is the RASS goal on Monday, and why is he sedated more deeply on the first day?',
              'where': 'Flowsheets > Respiratory (vent settings, pressures); Orders (mechanical ventilation; sedation); Orders > Nursing',
              'key': {'elements': [
                  E('180 cm = 70.9 inches, so IBW = 50 + 2.3 x 10.9 = about 75 kg; 6 mL/kg = about 450 mL. The set tidal volume is 450 mL, which matches (accept 75-76 kg and 450-455 mL).', 0.75, ''),
                  E('Any four VAP bundle actions: head of bed 30 degrees or higher, oral care with chlorhexidine every 12 h, daily sedation interruption and spontaneous breathing trial, cuff pressure check, suction only when needed, stress ulcer and DVT prophylaxis, hand hygiene (0.125 each).', 0.5, ''),
                  E('RASS goal -2 to -3 on Monday; deeper sedation and analgesia are needed on day 1 for painful burn care, resuscitation, the airway swelling and the risk of pulling the tube.', 0.25, '')]}})

items.append({'id': '1.9', 'type': 'table', 'points': 1.5, 'title': 'Reading the Labs',
              'prompt': 'Open Lab Results and compare the first draws (about 0240-0250) with the 0800 or 1200 draws. Choose FOUR labs or lab groups that changed or matter. For each, write the values, why this happens in a burn patient, and what you do about it.',
              'where': 'Lab Results (Chemistry, CBC, Blood Gas)',
              'cols': ['Lab and values (first draw to latest)', 'Why this happens in Marcus', 'What you do'], 'widths': [2.0, 2.6, 2.4], 'rows': 4, 'rowH': 0.85,
              'key': {'answer': 'Any 4 of the labs below; each row 0.375: values correct (0.125), reason correct (0.125), nursing action reasonable (0.125).', 'bank': True,
                      'elements': [
                          E('Lactate 5.8 -> 3.4 -> 2.2 -> 1.8 (critical to normal): poor tissue perfusion early; falling means the fluid resuscitation is working. Keep trending; a rise means shock or sepsis, notify.', 0.375, ''),
                          E('Hemoglobin 17.2 -> 13.6 (and hematocrit 51 -> 41): hemoconcentration from plasma leak on arrival, then dilution as fluid is given. Watch for bleeding and new drops.', 0.375, ''),
                          E('CK 480 -> 1,120: muscle and tissue injury; protect the kidneys with adequate urine output and watch for dark urine (myoglobin); report the trend.', 0.375, ''),
                          E('Potassium 4.3 -> 4.9: cells release potassium after burn injury; monitor the ECG and recheck; replace nothing now.', 0.375, ''),
                          E('WBC 12.8 -> 16.1: stress response to a major burn, NOT an infection yet; use it as a baseline for comparison later.', 0.375, ''),
                          E('Glucose 143 -> 156 -> 172: stress hyperglycemia; check glucose per order and know the call parameters for insulin.', 0.375, ''),
                          E('pH 7.29 -> 7.39 and bicarbonate 18 -> 24 (arterial gas): metabolic acidosis from poor perfusion corrected with resuscitation.', 0.375, ''),
                          E('Carboxyhemoglobin 14.2 -> 3.0 (also accept if not used in 1.4).', 0.375, '')]}})

items.append({'id': '1.10', 'type': 'box', 'points': 1.5, 'lines': 10, 'title': 'Adding Up the First 12 Hours',
              'prompt': 'Open Flowsheets > Intake/Output and add the hourly rows from 0400 to 1600 (12 rows). (a) What are his total intake, total output and net balance? (b) What was his average urine output in mL/h and in mL/kg/h? (c) Using the Parkland rates, how much lactated Ringer\'s should he have received BY 1600 counting from injury (EMS 500 mL and the ED 675 mL before 0400 count), and how much did he actually receive? (d) What does that tell you?',
              'where': 'Flowsheets > Intake/Output; Orders (lactated Ringer\'s); EMS Handoff and ED notes',
              'key': {'elements': [
                  E('Intake about 5,116 mL, output about 413 mL, net about +4,700 mL (accept totals within 50 mL; a large positive balance is expected in burn resuscitation).', 0.5, 'I&O'),
                  E('Average urine output about 34 mL/h = about 0.42 mL/kg/h (a little below the 0.5 goal, within the 30-50 range most of the time).', 0.25, ''),
                  E('Expected by 1600: first 8 h = 3,608 mL plus 6.5 h x 225 = about 1,460 mL, about 5,070 mL. Actual crystalloid: EMS 500 + ED 675 + ICU LR 4,343 = about 5,520 mL.', 0.5, ''),
                  E('He is about 450 mL (9%) over the Parkland estimate: acceptable because the order is to titrate to urine output, but a reminder to watch for fluid creep (edema, pressures) and avoid chasing a single low urine output.', 0.25, '')]}})

items.append({'id': '1.11', 'type': 'box', 'points': 1.5, 'lines': 11, 'title': 'The 1400 Dressing Change',
              'prompt': 'Read the Burn Wound Assessment note and the 1520 nursing note. (a) Why was hydromorphone given at 1345 and what tool measures pain in an intubated, sedated patient (name its four parts)? (b) Which topical drugs were applied and where? (c) What do you assess at every dressing change? (d) Name two ways you protect him and yourself from infection.',
              'where': 'Chart Review > Notes (Burn Wound Assessment; Nursing Note 1520); MAR (hydromorphone, silver sulfadiazine, bacitracin)',
              'key': {'elements': [
                  E('Dressing changes are the most painful part of burn care; the opioid is given about 15 minutes BEFORE the procedure so it is working. CPOT has four parts: facial expression, body movements, muscle tension, compliance with the ventilator.', 0.5, ''),
                  E('Silver sulfadiazine 1% cream to the chest and right arm; bacitracin ointment to the face.', 0.25, 'MAR'),
                  E('Wound color, depth, drainage amount and odor, eschar, blisters, edges and any redness beyond the burn margin (mark and time it), skin around the wound, right hand pulses and capillary refill, and pain response.', 0.5, ''),
                  E('Any two: sterile technique, gown/gloves/mask and contact precautions, hand hygiene, dedicated equipment, cleansing the old cream, covering the wound promptly.', 0.25, '')]}})

parts = [{'id': '1', 'title': 'Shift 1: Monday 11/02, 0400 to 1600 (admission to the Burn ICU)', 'step': 'Day 1 of the stay', 'minutes': 60,
          'intro': 'Set the simulation clock to 0400 on Monday 11/02/26 and move it forward as you work. You are the nurse receiving Marcus from the ED.',
          'keyNote': 'Shift 1 is mostly chart reading and the safety reasoning behind burn resuscitation. A careful student should earn about 14 of the 18 points. The hardest items are 1.2 (the Parkland math with the EMS bolus) and 1.10 (the fluid totals).',
          'items': items}]

content = {'meta': meta, 'studentIntro': studentIntro, 'studentRules': studentRules, 'keyIntro': keyIntro, 'parts': parts}
if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'content.json'
    json.dump(content, open(out, 'w'), indent=1)
    for p in parts:
        tot = sum(i['points'] for i in p['items'])
        print('part', p['id'], 'points', tot)
        for i in p['items']:
            k = i.get('key', {})
            s = sum(e['pts'] for e in k.get('elements', [])) if k.get('elements') else None
            if s is not None and not k.get('bank') and abs(s - i['points']) > 0.01: print('  WARNING item', i['id'], 'elements sum', s, 'vs', i['points'])

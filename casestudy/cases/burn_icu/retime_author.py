#!/usr/bin/env python3
"""One-time patch: moves the Shift 1 text of author.py from 0400-1600 to the 0700-1900 shift. (Kept for the record.)"""
s = open('author.py').read()
def rep(a, b, cnt=1):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, cnt)

rep("Only SHIFT 1 (Mon 11/02 0400-1600)", "Only SHIFT 1 (Mon 11/02 0700-1900)")
rep("The chart covers three days, from Monday 11/02/26 at 0400 until his transfer to a medical-surgical unit on Thursday 11/05/26 at 0700.",
    "He arrived in the ICU at 0400 on Monday 11/02/26 and the night nurse has cared for him since. You take over at the 0700 shift change, and the chart runs until his transfer to a medical-surgical unit on Thursday 11/05/26 at 0700.")
rep("'Shift 1: Monday 11/02, 0400 to 1600.   Shift 2: Monday 1600 to Tuesday 11/03 0400.   Shift 3: Tuesday 0400 to 1600.',\n        'Shift 4: Tuesday 1600 to Wednesday 11/04 0400.   Shift 5: Wednesday 0400 to 1600.   Shift 6: Wednesday 1600 to Thursday 11/05 0700 (transfer).'",
    "'Shift 1: Monday 11/02, 0700 to 1900 (day).   Shift 2: Monday 1900 to Tuesday 11/03 0700 (night).   Shift 3: Tuesday 0700 to 1900 (day).',\n        'Shift 4: Tuesday 1900 to Wednesday 11/04 0700 (night).   Shift 5: Wednesday 0700 to 1900 (day).   Shift 6: Wednesday 1900 to Thursday 11/05 0700 (night, ends with transfer to Med-Surg).'")
rep("Shift 1 = 18, Shifts 2, 3, 5 and 6 = 16 each, Shift 4 (the infection) = 18.", "Shift 1 = 20 (it includes the admission picture and the handoff), Shifts 2 to 6 = 16 each.")
rep("'prompt': 'Set the clock to 0400. Read the ED Provider Note, the Burn Surgery and Critical Care H&Ps, the Nursing Admission Note and the Patient Summary.",
    "'prompt': 'Set the clock to 0700. You are taking report from the night nurse. Read the ED Provider Note, the Burn Surgery and Critical Care H&Ps, the nursing notes from 0425 to 0650 and the Patient Summary.")
rep("Your Picture of Marcus at 0400", "Your Picture of Marcus at 0700")
rep("lactate 5.8 down to 3.4.", "lactate 5.8 down to 2.2 by 0800 (3.4 at 0415).")
rep("'times': ['2026-11-02 04:00', '2026-11-02 08:00', '2026-11-02 12:00', '2026-11-02 16:00'],\n              'times_label': ['Mon 0400', 'Mon 0800', 'Mon 1200', 'Mon 1600'],",
    "'times': ['2026-11-02 07:00', '2026-11-02 11:00', '2026-11-02 15:00', '2026-11-02 19:00'],\n              'times_label': ['Mon 0700', 'Mon 1100', 'Mon 1500', 'Mon 1900'],")
rep("heart rate stays above 100 (106 to 112, then 101) and slowly improves with resuscitation; blood pressure is low-normal (100-107/58-63, MAP about 72-77); temperature rises from 97.4 F (cold on arrival) to 99.0 F; CPOT stays 1",
    "heart rate starts high (111) and falls to 97 as the resuscitation works; blood pressure is low-normal (99/57 to 109/63, MAP about 71 to 78); temperature rises from 98.2 F to 99.2 F (he arrived cold at 96.8 F); CPOT stays 1")
rep("(c) What treatment lowers it and how did the plan change at 0600?", "(c) What treatment lowers it, and what did the night team change at 0600 (read their notes)?")

a = s.index("items.append({'id': '1.5'"); b = s.index("items.append({'id': '1.6'")
s = s[:a] + '''items.append({'id': '1.5', 'type': 'box', 'points': 1.5, 'lines': 11, 'title': 'Titrating the Fluids',
              'prompt': 'Open the lactated Ringer\\'s order, the MAR and the hourly urine output. (a) What is the urine output goal in mL/h and in mL/kg/h? (b) At 0930 the rate was changed: from what to what, and why? (c) Write the urine outputs for 1200-1300 and 1300-1400, say what the order tells you to do, and what the new rate becomes at 1400. (d) Name two things you check when you change the rate and one danger of giving too much fluid.',
              'where': 'Orders > lactated Ringer\\'s (burn resuscitation); MAR (rate changes); Flowsheets > Intake/Output',
              'key': {'elements': [
                  E('Goal 30 to 50 mL/h, which is 0.5 mL/kg/h (about 41 mL/h for 82 kg).', 0.25, 'Order instructions'),
                  E('At 0930 (8 hours after the injury) the first half of the Parkland fluid is done, so the rate dropped from 540 to 225 mL/h for the second 16 hours.', 0.25, 'MAR'),
                  E('Urine output 28 mL and 28 mL: below 30 mL/h for two hours in a row, so increase the rate by 20 to 25% and notify the burn team.', 0.5, 'I&O, order'),
                  E('225 mL/h x 1.2 = 270 mL/h at 1400.', 0.25, 'MAR'),
                  E('Two checks (lung sounds / peak airway pressures, abdomen or bladder pressure, right hand pulses and tension, edema, blood pressure, heart rate) AND a danger of too much fluid ("fluid creep": pulmonary edema, compartment syndrome, more ventilator days, worse swelling).', 0.25, '')]}})

''' + s[b:]

a = s.index("items.append({'id': '1.6'"); b = s.index("items.append({'id': '1.7'")
s = s[:a] + '''items.append({'id': '1.6', 'type': 'box', 'points': 1.5, 'lines': 12, 'title': 'Calling the Burn Surgeon',
              'prompt': 'It is 1400 and you have just seen the second low urine output. Write the SBAR you give Dr. Okafor on the phone. Use real numbers from the chart. End with what you are asking him to do and how you will confirm the order.',
              'where': 'Flowsheets (vital signs, I&O, neurovascular); Lab Results (lactate, potassium, CK); Orders',
              'key': {'elements': [
                  E('Situation: identify yourself, the patient and room; urine output 28 mL/h and 28 mL/h for two hours (about 0.34 mL/kg/h, less than the goal of 0.5) on lactated Ringer\\'s 225 mL/h.', 0.375, ''),
                  E('Background: 34-year-old, 82 kg, 22% TBSA flame burn with inhalation injury, intubated and sedated, on the Parkland resuscitation since 0230, EMS 500 mL, escharotomy right arm.', 0.375, ''),
                  E('Assessment: current vitals (T 99.0, HR 103, BP 105/61, SpO2 99%), lungs/peak pressures, right hand Doppler pulses, lactate normal at 1.8 (1200), CK 1,120, and your concern that he is behind on fluid.', 0.375, ''),
                  E('Recommendation: ask to increase the rate by 20% per the order (to 270 mL/h) and what urine output you should call about next; read the order back and document the time and name.', 0.375, '')]}})

''' + s[b:]

rep("List SIX lines, tubes or devices Marcus has at 0400", "List SIX lines, tubes or devices Marcus has at 0700")
rep("Open Flowsheets > Respiratory at 0400.", "Open Flowsheets > Respiratory at 0700.")
rep("compare the first draws (about 0240-0250) with the 0800 or 1200 draws", "compare the first draws (about 0240-0250) with the 1200 and 1800 draws")
rep("Lactate 5.8 -> 3.4 -> 2.2 -> 1.8 (critical to normal)", "Lactate 5.8 -> 3.4 -> 2.2 -> 1.8 -> 1.6 (critical to normal)")
rep("Potassium 4.3 -> 4.9: cells release potassium after burn injury; monitor the ECG and recheck; replace nothing now.",
    "Potassium 4.3 -> 4.5 -> 4.9 -> 5.0: cells release potassium after burn injury; monitor the ECG and recheck; do not replace it, and report a value of 5.1 or higher.")
rep("Glucose 143 -> 156 -> 172: stress hyperglycemia; check glucose per order and know the call parameters for insulin.",
    "Glucose 143 -> 156 -> 172 -> 188 (serum): stress hyperglycemia that keeps rising; check glucose per order and know the call parameters, because an insulin infusion is likely if it stays above 180.")
rep("WBC 12.8 -> 16.1: stress response", "WBC 12.8 -> 16.1 (1200): stress response")

a = s.index("items.append({'id': '1.10'"); b = s.index("items.append({'id': '1.11'")
s = s[:a] + '''items.append({'id': '1.10', 'type': 'box', 'points': 1.5, 'lines': 10, 'title': 'Adding Up Your 12 Hours',
              'prompt': 'Open Flowsheets > Intake/Output and add the hourly rows from 0700 to 1900 (12 rows). (a) What are his total intake, total output and net balance for your shift? (b) What was his average urine output in mL/h and in mL/kg/h? (c) Using the Parkland rates, how much lactated Ringer\\'s should he have received BY 1900 counting from the injury (the EMS 500 mL and the ED 675 mL before the ICU count), and how much did he actually receive in all? (d) What does that tell you?',
              'where': 'Flowsheets > Intake/Output; Orders (lactated Ringer\\'s); EMS Handoff and ED notes',
              'key': {'elements': [
                  E('Intake about 4,490 mL, output about 460 mL, net about +4,030 mL (accept totals within 50 mL; a large positive balance is expected in burn resuscitation).', 0.5, 'I&O'),
                  E('Average urine output about 38 mL/h = about 0.47 mL/kg/h (just under the 0.5 goal, inside 30-50 mL/h most of the shift).', 0.25, ''),
                  E('Expected by 1900: first 8 h = 3,608 mL plus 9.5 h x 225 = about 2,140 mL, about 5,750 mL. Actual crystalloid: EMS 500 + ED 675 + ICU LR 5,153 = about 6,330 mL.', 0.5, ''),
                  E('He is about 580 mL (10%) over the Parkland estimate: acceptable because the order is to titrate to urine output, but a reminder to watch for fluid creep (edema, airway pressures, bladder pressure) and not to chase a single low urine output.', 0.25, '')]}})

''' + s[b:]

rep("parts = [{'id': '1', 'title': 'Shift 1: Monday 11/02, 0400 to 1600 (admission to the Burn ICU)', 'step': 'Day 1 of the stay', 'minutes': 60,\n          'intro': 'Set the simulation clock to 0400 on Monday 11/02/26 and move it forward as you work. You are the nurse receiving Marcus from the ED.',",
"""items.append({'id': '1.12', 'type': 'box', 'points': 2, 'lines': 14, 'title': 'Handoff at 1900',
              'prompt': 'It is 1850. Write your SBAR handoff for E. Haddad, RN, the night nurse. Use real numbers and name what the night nurse must watch for and do in the first part of the night, including anything coming up in the next few hours.',
              'where': 'Everything you have charted and read this shift; Orders; Lab Results; MAR; Flowsheets',
              'key': {'elements': [
                  E('Situation: patient, room, full code, 22% TBSA burn with inhalation injury, intubated and sedated (propofol and fentanyl), current vitals (HR about 97, BP 109/63, T 99.2, SpO2 98%), resuscitation going as planned.', 0.5, ''),
                  E('Background: house fire 0130, escharotomy right arm 0315, Parkland (LR 7,216 mL goal in 24 h), lines (central line, arterial line, OG with feeds started at 1000, Foley), COHb now at his smoker baseline.', 0.5, ''),
                  E('Assessment: urine output was 28 mL/h around 1200-1400 and corrected after the rate went to 270 mL/h (now 42-46 mL/h); net about +4 L; lactate 1.6; potassium 5.0 and glucose 188 are climbing; right hand Doppler pulses steady; pain controlled; wound care done at 1400.', 0.5, ''),
                  E('Recommendation / to do: hourly urine output with titration per order; hourly right hand checks; the Parkland 24 hours ends at 0130 Tuesday and the order changes then; 0000 labs (glucose may need an insulin infusion; recheck potassium); sedation goal and restraint checks; turning and skin care; family visiting; call the burn team for UOP under 20 mL/h.', 0.5, '')]}})

parts = [{'id': '1', 'title': 'Shift 1: Monday 11/02, 0700 to 1900 (day shift)', 'step': 'Day 1 of the stay', 'minutes': 60,
          'intro': 'Set the simulation clock to 0700 on Monday 11/02/26 and move it forward as you work. Marcus arrived in the ICU at 0400; you take report from the night nurse and care for him until you hand off at 1900. You can read everything charted before 0700, and the chart fills in as the clock moves forward.',""")
rep("A careful student should earn about 14 of the 18 points.", "A careful student should earn about 16 of the 20 points.")
open('author.py', 'w').write(s)
print('patched')

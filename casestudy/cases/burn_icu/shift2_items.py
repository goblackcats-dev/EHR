# SHIFT 2 items (Monday 1900 to Tuesday 0700, night shift). Exec'd by author.py so it can use E and parts.
items2 = []

items2.append({'id': '2.1', 'type': 'vitals', 'points': 1.5, 'title': 'Vital Sign Trend Through the Night',
               'where': 'Flowsheets > Vital Signs',
               'prompt': 'Set the clock to 1900 on Monday. You take report from the day nurse. Copy the vital signs at each time, circle every abnormal value, then write two sentences below: what the night looked like overall, and what the flowsheet does NOT show about the agitation event that happened around 0245.',
               'times': ['2026-11-02 19:00', '2026-11-02 23:00', '2026-11-03 03:00', '2026-11-03 07:00'],
               'times_label': ['Mon 1900', 'Mon 2300', 'Tue 0300', 'Tue 0700'],
               'rowsLabels': ['Temperature', 'Heart rate', 'Blood pressure', 'Respiratory rate', 'SpO2 (%)', 'Pain (CPOT)'],
               'codes': ['TEMP', 'HR', 'BP', 'RR', 'SPO2', 'PAIN'],
               'key': {'rules': 'Score 1.0 x (cells correct / 24), rounded to the nearest 0.5. The two sentences are worth 0.5: (1) a quiet night: heart rate 93-97 (upper normal, never over 100), BP about 109-111/62-64 (MAP 78-80), temperature 99.2-99.4 F, SpO2 98-99%, CPOT 1; (2) the hourly flowsheet does not show the 0245 agitation: the vital signs at 0300 (HR 93, BP 109/64, SpO2 98%, CPOT 1) look normal and RASS is charted only every 4 hours (-3 at 0000, -2 at 0400), so an event between hourly sets (RASS +1 at 0245, back to -3 by 0315, lorazepam 1 mg at 0300) is recorded only in the nursing note and the MAR. Allow +/- 2 for rates and +/- 0.2 F.'}})
items2.append({'id': '2.1b', 'type': 'box', 'points': 0, 'lines': 5, 'title': 'Overall night, and what the vitals do not show (scored with 2.1)', 'key': {'answer': 'Scored with item 2.1.'}})

items2.append({'id': '2.2', 'type': 'box', 'points': 2, 'lines': 13, 'title': 'Glucose and the Insulin Infusion',
               'prompt': 'Open Lab Results (Glucose, point of care and serum), Orders, the MAR and the 0150-0320 nursing notes. (a) List his glucose values from 1800 through 0300 and explain why the insulin infusion was started at 0030 and at what rate. (b) Why does a burn patient have a high glucose even though he has no diabetes? (c) What is the glucose goal and how often do you check it on the infusion? (d) Give TWO safety actions for an insulin infusion, including what you must do if the tube feeding is stopped, and name one lab that you watch closely with insulin.',
               'where': 'Lab Results (Chemistry, Bedside Testing); Orders; MAR (insulin infusion); Chart Review > Notes',
               'key': {'elements': [
                   E('Glucose: 188 (1800), 198 (2200), 196 (0000), then 191, 190, 189 on the infusion. Started at 1 unit/h at 0030 because the glucose was above 180 on consecutive checks (ICU protocol), ordered by Dr. Brandt.', 0.5, 'Labs, notes'),
                   E('Stress response of a major burn: stress hormones (cortisol, catecholamines, glucagon) and inflammation make the body insulin resistant and the liver release glucose; the hypermetabolic state and the tube feeding add to it.', 0.5, ''),
                   E('Goal 140 to 180 mg/dL; glucose every hour while on the infusion, and adjust the rate per the protocol table.', 0.5, 'Order'),
                   E('Any two safety actions: independent double check of the insulin bag and rate (high-alert drug); do not change the rate without the protocol; if feeds are stopped or interrupted, call the provider and recheck the glucose because hypoglycemia is likely (treat glucose under 70 per protocol); dedicated line/label; check glucose after any rate change. AND one lab watched: potassium (insulin moves potassium into cells; K 5.0 at 1800, 4.5 at 0000, 3.9 at 0600).', 0.5, '')]}})

items2.append({'id': '2.3', 'type': 'box', 'points': 1.5, 'lines': 12, 'title': 'The End of the First 24 Hours',
               'prompt': 'The Parkland period ends at 0130 (24 hours after the injury). Using the lactated Ringer\'s rates and times on the MAR (EMS 500 mL, ED 450 mL/h from 0230 to 0400, then the ICU rates), (a) add up the total crystalloid he received from the injury to 0130 and compare it with the Parkland goal. (b) What did the order change to at 0130 and what new fluid starts at 0600? (c) Why do the fluids not simply stop at 24 hours? (d) His weight was 82 kg on arrival and is now 89.6 kg: what does that tell you and what else do you watch for?',
               'where': 'MAR (lactated Ringer\'s rate changes); Orders; Flowsheets > Cardiac (daily weight) and Intake/Output; Nursing Note 0150',
               'key': {'elements': [
                   E('Total: 500 (EMS) + 675 (ED 0230-0400) + 900 (0400-0600 at 450) + 1,890 (0600-0930 at 540) + 1,012 (0930-1400 at 225) + 3,105 (1400-0130 at 270) = about 8,080 mL, about 864 mL (12%) over the 7,216 mL goal (accept 8,000-8,150).', 0.5, 'MAR'),
                   E('At 0130 lactated Ringer\'s was lowered to a maintenance rate of 125 mL/h; albumin 5% 500 mL over 4 hours starts at 0600 per the burn protocol.', 0.375, 'Orders'),
                   E('The capillary leak and losses continue for 24 to 48 hours, so he still needs fluid; colloid (albumin) holds fluid in the vessels and lets you use less crystalloid.', 0.25, ''),
                   E('Weight is up 7.6 kg, so the extra fluid is in the tissues (edema); also watch lung sounds and ventilator pressures, bladder pressure, the right arm compartments and urine output.', 0.375, '')]}})

items2.append({'id': '2.4', 'type': 'box', 'points': 2, 'lines': 15, 'title': 'The Agitation Event at 0245',
               'prompt': 'Read the 0320 nursing note. Marcus (RASS -3 earlier) becomes restless, thrashes his head, bites the endotracheal tube and the ventilator pressure alarms sound. (a) In order, what do you check and do FIRST, before any medication, and why? (b) The provider orders lorazepam 1 mg IV. Name one concern about giving a benzodiazepine to this patient and one question you could ask the provider. (c) What are the rules for the soft wrist restraint you are using? (d) Besides rechecking RASS, CPOT and vital signs after the dose, what do you document and who do you notify?',
               'where': 'Chart Review > Notes (Nursing Note 0320); Orders (soft wrist restraint, lorazepam); Flowsheets (RASS, CPOT, ventilator); MAR',
               'key': {'elements': [
                   E('Stay with him and check for causes before sedating: airway/tube (depth 24 cm, cuff pressure, secretions, kinks, bite block), ventilator alarms and synchrony (call RT), oxygenation, pain (CPOT 1-2), full bladder or Foley problem, positioning, and withdrawal/delirium; keep him safe (no unplanned extubation). Give analgesia first if pain is possible.', 0.75, 'Nursing note'),
                   E('Concern: benzodiazepines increase delirium, prolong ventilation and can mask withdrawal; the unit prefers analgesia-first and propofol/dexmedetomidine. A good question: can we increase the propofol or fentanyl instead, or is a one-time lorazepam dose acceptable while he is ventilated (reason: alcohol-withdrawal risk)? Lorazepam is high-alert: double check the dose.', 0.5, ''),
                   E('Restraint rules (per the order and hospital policy): provider order that is renewed every calendar day, least restrictive method, check circulation and skin at least every 2 hours (the order says q2h; many policies also require release and range of motion), assess the continuing need, document, remove at extubation, family informed.', 0.5, 'Order'),
                   E('Document the event (time, behavior, cause search, response, RASS/CPOT before and after, lorazepam 1 mg IV at 0300 with the reason), notify Dr. Brandt (on-call intensivist, SBAR; done at 0255) and the charge nurse (B. Sutton), and update Jenna at the morning call.', 0.25, '')]}})

items2.append({'id': '2.5', 'type': 'box', 'points': 1, 'lines': 9, 'title': 'Alcohol and the Next Three Days',
               'prompt': 'His ethanol level was 42 mg/dL at 0240 and he usually drinks 4 to 6 beers on weekends, more than that the night of the fire. (a) When could alcohol withdrawal begin, and when are seizures and delirium tremens most likely? (b) Why may you not see the signs yet? (c) Which two vitamins are ordered and why? (d) Name three signs you would watch for.',
               'where': 'Lab Results (Toxicology); H&P (social history); MAR (thiamine and folic acid)',
               'key': {'elements': [
                   E('Withdrawal can begin 6 to 24 hours after the last drink; seizures 12 to 48 hours; delirium tremens 48 to 96 hours, so counting from the last drink (about the time of the fire, Monday 0130) the highest risk for him is Wednesday to Friday.', 0.25, ''),
                   E('Propofol, fentanyl and lorazepam are sedating and mask the signs; and he cannot talk.', 0.25, ''),
                   E('Thiamine (prevents Wernicke encephalopathy, needed before or with glucose) and folic acid (deficiency in alcohol use).', 0.25, 'MAR'),
                   E('Any three: tachycardia, hypertension, fever, tremor, sweating, agitation, hallucinations, seizure, difficulty sedating (needing more drug); use RASS and CAM-ICU because CIWA needs a patient who can talk.', 0.25, '')]}})

items2.append({'id': '2.6', 'type': 'table', 'points': 1.5, 'title': 'Checking the Right Hand and the Abdomen',
               'prompt': 'Compartment syndrome is a risk after a circumferential burn and a large fluid resuscitation. For each of the six Ps, write what you can or cannot check in Marcus (he is sedated and intubated) and what the chart showed at 2300-0300. Then name the abdominal check ordered every six hours.',
               'where': 'Flowsheets > Musculoskeletal / Mobility (Right Hand Neurovascular check); Nursing Notes; Orders (bladder pressure)',
               'cols': ['The 6 Ps', 'Can you check it in Marcus? How?', 'What the chart showed'], 'widths': [1.4, 3.0, 2.6], 'rows': 7, 'rowH': 0.62,
               'key': {'answer': 'Rows 1-6 worth 0.2 each (the P is named, a sensible way to check, and the chart finding); row 7 (bladder / intra-abdominal pressure) 0.3.', 'bank': True,
                       'elements': [
                           E('Pain: out of proportion, with passive stretch; cannot be reported while sedated, so look for grimace/CPOT rise and a tense forearm. Chart: CPOT 1 (forearm soft).', 0.2, ''),
                           E('Pallor (and cool temperature): fingers pink and warm. Chart: warm, cap refill 3 seconds.', 0.2, ''),
                           E('Pulselessness: Doppler signals over the radial and ulnar arteries (cannot rely on palpation through edema). Chart: biphasic Doppler signals present.', 0.2, ''),
                           E('Paresthesia: cannot be asked; sensation is not assessable while sedated. Chart: left hand not testable (sedated); right hand decreased in the burned area.', 0.2, ''),
                           E('Paralysis: motion of the fingers, only when sedation is lightened (SAT at 0800). Chart: not testable yet.', 0.2, ''),
                           E('Poikilothermia / tension: skin temperature compared with the left hand, and firmness of the forearm compartments. Chart: fingers warm; forearm compartments soft and compressible, swelling stable.', 0.2, ''),
                           E('Bladder (intra-abdominal) pressure every 6 hours through the Foley: 12 mmHg at 2330; call the provider above 15 (abdominal compartment syndrome is above 20 with organ dysfunction).', 0.3, 'Order, note')]}})

items2.append({'id': '2.7', 'type': 'table', 'points': 1.5, 'title': 'The Midnight and 0600 Labs',
               'prompt': 'Open Lab Results and compare the 0000 and 0600 draws (and the 0500 albumin and coagulation labs) with the day shift values. Choose FOUR results. Write the values, why they happen in a burn patient on propofol and tube feeding, and what you do or ask for.',
               'where': 'Lab Results (Chemistry, CBC, Coagulation, Blood Gas)',
               'cols': ['Lab and values', 'Why this happens in Marcus', 'What you do or ask for'], 'widths': [1.9, 2.7, 2.4], 'rows': 4, 'rowH': 0.9,
               'key': {'answer': 'Any 4 rows of the bank; each row 0.375: values correct (0.125), reason (0.125), action (0.125).', 'bank': True,
                       'elements': [
                           E('Phosphorus 3.0 (1200) -> 2.8 (1800) -> 2.4 (0000) -> 2.1 (0600) (low): burn losses, insulin and feeding drive phosphate into cells (refeeding), dilution. Report to the provider; replacement is usually ordered; low phosphorus weakens breathing muscles and the heart.', 0.375, ''),
                           E('Magnesium 1.8 (1800) -> 1.7 -> 1.6 (low): dilution and losses; report for replacement (low magnesium makes low potassium hard to correct, so replace magnesium along with potassium).', 0.375, ''),
                           E('Potassium 4.5 -> 3.9: the insulin infusion and feeds move potassium into cells; many protocols aim for 4.0 or higher; notify the provider and recheck with the next draw (K 5.0 at 1800).', 0.375, ''),
                           E('Albumin 2.6 (low) and prealbumin 7.1 (low): plasma leak, dilution and the acute-phase response; they do not measure nutrition well in the first days of a burn, but explain the albumin 5% order and the dietitian follow-up.', 0.375, ''),
                           E('Triglycerides 168 (high; baseline at about 48 h of propofol): propofol is a lipid emulsion (1.1 kcal/mL); report it, count the calories, and a level over about 400 means ask whether to change the sedative.', 0.375, ''),
                           E('CK 1,120 -> 840 (falling): muscle injury is improving; keep adequate urine output.', 0.375, ''),
                           E('Hemoglobin 12.4 and platelets 214: dilution; platelets still normal; watch for bleeding with heparin prophylaxis. WBC 15.2 is stress response, a baseline for later comparison.', 0.375, ''),
                           E('Sodium 134 (low): lactated Ringer\'s has less sodium than the plasma and he is retaining fluid; watch; no correction needed now.', 0.375, '')]}})

items2.append({'id': '2.8', 'type': 'box', 'points': 1.5, 'lines': 11, 'title': 'Propofol: Math and Safety',
               'prompt': 'At 1900 on Monday the propofol is running at 35 mcg/kg/min. The bag is propofol 10 mg/mL and his weight is 82 kg. (a) Calculate the rate in mL/h. (b) Propofol gives 1.1 kcal per mL: how many calories does the sedation add in 24 hours? (c) Name two reasons you check the triglyceride level and two signs of propofol infusion syndrome. (d) Name two nursing actions for the bag and tubing.',
               'where': 'MAR (propofol); Orders (propofol); Lab Results (Triglycerides); Flowsheets (RASS)',
               'key': {'elements': [
                   E('35 mcg/kg/min x 82 kg = 2,870 mcg/min x 60 = 172,200 mcg/h = 172.2 mg/h; at 10 mg/mL = 17.2 mL/h.', 0.5, ''),
                   E('17.2 mL/h x 24 h = about 413 mL/day x 1.1 kcal = about 455 kcal/day (accept 450-460); count it as part of his calories.', 0.25, ''),
                   E('Triglycerides: lipid load can raise them (his 168 is mildly high) and very high levels cause pancreatitis; check about every 2 to 3 days. Infusion syndrome: unexplained metabolic acidosis, rhabdomyolysis/rising CK, hyperkalemia, arrhythmia or heart failure, high triglycerides, kidney injury (any two).', 0.5, ''),
                   E('Any two: aseptic technique and change the tubing and vial/bag every 12 hours (lipid grows bacteria), label, watch blood pressure with every rate increase, do not mix other drugs in the line, daily sedation interruption.', 0.25, '')]}})

items2.append({'id': '2.9', 'type': 'box', 'points': 1.5, 'lines': 11, 'title': 'Tube Feeding and Calories',
               'prompt': 'Open the tube feeding order and the flowsheet. (a) Write the advancing schedule from 1000 Monday and the rate at 0600 on Tuesday. (b) The formula is Osmolite 1.5, which has 1.5 kcal per mL and 62.7 g of protein per liter: how many calories and grams of protein will he receive in 24 hours at 70 mL/h? (c) Give two reasons burn patients are fed early through the gut. (d) What do you check before advancing, and what do you do for a residual over 500 mL?',
               'where': 'Orders (Osmolite 1.5); Flowsheets > GI (Diet / Feeding); Intake/Output; Chart Review (Nutrition Assessment)',
               'key': {'elements': [
                   E('Start 20 mL/h at 1000, then increase 10 mL/h every 4 hours (30 at 1400, 40 at 1800, 50 at 2200, 60 at 0200) to the goal of 70 mL/h at 0600.', 0.25, 'Order'),
                   E('70 mL/h x 24 h = 1,680 mL; x 1.5 kcal/mL = 2,520 kcal; x 62.7 g/L = about 105 g protein (accept 100-110).', 0.5, ''),
                   E('Any two: burns make the body hypermetabolic (needs about 2,400-2,500 kcal and extra protein); early feeding protects the gut lining and lowers bacterial translocation and infection; supports wound healing; reduces muscle loss and stress ulcers.', 0.5, ''),
                   E('Check the position of the tube (OG at the mark), the residual, abdominal distention, bowel sounds, stool, glucose, and keep the head of the bed at 30 degrees; for a residual over 500 mL hold the feeding and call the provider (and do not hold feeds for dressing changes).', 0.25, '')]}})

items2.append({'id': '2.10', 'type': 'box', 'points': 2, 'lines': 14, 'title': 'Handoff at 0650',
               'prompt': 'It is 0650 on Tuesday. Write your SBAR handoff for J. Morales, RN, the day nurse. Use real numbers, include the events of the night, what is happening in the next few hours (look at the orders and MAR), and anything you would like the day team to follow up.',
               'where': 'Everything you read and charted this night; Orders; MAR; Lab Results; Flowsheets',
               'key': {'elements': [
                   E('Situation: patient/room, full code, burn 22% with inhalation injury, intubated; stable night: HR 96, BP 111/64, T 99.4, SpO2 98%, RASS -2 (goal -1 to -2 today), CPOT 1; urine output 37-47 mL/h (0.45-0.57 mL/kg/h).', 0.5, ''),
                   E('Background: the first 24 hours of Parkland finished at 0130 (about 8,080 mL), LR 125 mL/h from 0130, then 75 mL/h since 0600 while albumin 5% runs; insulin infusion since 0030; feeds at goal 70 mL/h; weight 89.6 kg; the flowsheet shows the night shift (1900-0700) intake 3,748 mL, output 496 mL, net +3,252 mL.', 0.5, 'Flowsheets > Intake/Output > Totals'),
                   E('Assessment: agitation at 0245 treated with lorazepam 1 mg (calm since); glucose 179-191 on the infusion (1.5 units/h since 0600); phosphorus 2.1 and magnesium 1.6 low and potassium down from 5.0 to 3.9, reported to Dr. Brandt, replacement planned after the noon labs and not given overnight; right hand signals steady; bladder pressure 12; triglycerides 168; skin and turns done.', 0.5, ''),
                   E('Recommendation / to do: sedation interruption at 0800; noon labs and replace phosphorus, magnesium and potassium as ordered; hourly glucose; albumin 5% 500 mL running 0600-1000; dressing change and silver sulfadiazine at 1400 with hydromorphone beforehand; restraint order renewal; update Jenna and Linda; chest x-ray (0515: small new right lower lobe atelectasis, lines in place) so chest PT and turning; watch for alcohol withdrawal.', 0.5, '')]}})

# order and size the items so each page is well used (pairs of short items, one big box for the long ones)
_by = {i['id']: i for i in items2}
_order = ['2.1', '2.1b', '2.2', '2.3', '2.5', '2.4', '2.6', '2.9', '2.7', '2.8', '2.10']
_new = ['2.1', '2.1b', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10']
_lines = {'2.1b': 8, '2.2': 24, '2.3': 11, '2.5': 8, '2.4': 23, '2.9': 9, '2.8': 7, '2.10': 9}
items2 = [dict(_by[o], id=n, **({'lines': _lines[o]} if o in _lines else {})) for o, n in zip(_order, _new)]
for _i in items2:
    if _i['title'].startswith('Checking the Right Hand'): _i['rowH'] = 1.05
    if _i['title'].startswith('The Midnight'): _i['rowH'] = 1.05      # the lab table fills its page
    if False: pass

parts.append({'id': '2', 'title': 'Shift 2: Monday 11/02 1900 to Tuesday 11/03 0700 (night shift)', 'step': 'Night of day 1 to day 2', 'minutes': 60,
              'intro': 'Set the simulation clock to 1900 on Monday 11/02/26. You take report from the day nurse and care for Marcus until you hand off at 0700. Keep reading forward in the chart as the clock moves; do not look past 0700 for this shift.',
              'keyNote': 'Shift 2 tests the "quiet" overnight judgment: the end of the Parkland period (1.2 math repeated with the final total), the insulin infusion, an agitation event in a ventilated patient with an alcohol history, and compartment checks. A careful student should earn about 12 of the 16 points.',
              'items': items2})

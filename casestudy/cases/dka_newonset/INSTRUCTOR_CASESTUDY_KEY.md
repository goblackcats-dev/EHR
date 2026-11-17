# Instructor Key: Nora Whitcombe Team Case Study (new-onset type 1 diabetes in DKA)

## What this is

A 2-hour team case study. The whole class (designed for 7 students) works as ONE team and cares for Nora Whitcombe (22, college student, new-onset type 1 diabetes presenting in moderate-to-severe DKA) across 24 hours of patient time, Mon 0700 to Tue 0700. The class advances 4 hours together (0700, 1100, 1500, 1900, 2300, 0300, then a final check at 0700), about 15 minutes per stop. The packet is 12 pages: cover (with the quick pathophysiology), patient card with a DKA map and two EHR screenshots, the rubric with a response tracker, one page per checkpoint, two final pages (evaluation, then teaching and discharge) and an individual reflection.

Focus (Ignatavicius 11e, NCSBN clinical judgment model): recognize the cues of DKA (Kussmaul breathing, fruity breath, dehydration), the textbook priorities in order (fluids, insulin with a known potassium, potassium and electrolytes, monitoring), "dextrose up, never insulin off", the potassium shift on insulin, the resolution criteria and the overlap transition, the emotional side of a new diagnosis, the first low glucose, and survival-skills teaching by teach-back. Two planted order errors (bicarbonate at 0700; KCl 20 mEq/h through a peripheral IV at 1500) and one order to discontinue (NPO at 1100).

NEW: Quick Checks (teach, not grade). Every checkpoint page has 2-3 NCLEX-style questions on that stop's big idea, each labelled with its clinical judgment step. Students answer on their own during the stop. You reveal the answers at the END of each stop with the one-line "why" and the tempting wrong answer (below, per stop). Students correct in a different color and tick "Corrected". Scoring is for completion and correction, never for being right.

## Roles and pairs (7 students, one team)

- Charge nurse (rotates; each student has exactly one stop): runs the section, keeps time, gets the findings from each pair when the pair is finished, decides the top 3 priorities (writes their name in that box), then develops and gives the SBAR. The "questions a strong charge nurse asks" below are NOT printed for students; use them only if a team is stuck.
- Meds and Orders pair: MAR, drips and riders, orders and notes: what is running, due, held or should change, and why.
- Vitals & Assessment pair: the bedside monitor and the vitals row, breathing, mouth and skin, mental status, intake and output, IV sites. Fills the response tracker column at every stop.
- Results & Labs pair: new labs (gap, BHB, gas, potassium, glucose), ECG, trends and what they mean.
- The Vitals & Assessment and Meds and Orders pairs work together on "Actions to suggest" at every stop. Pairs switch jobs at every checkpoint: 1 charge nurse + 3 pairs; the old charge nurse takes the new charge nurse's place in that pair. Every student has their own packet.

## Before class

- Print one packet per student (7), single-sided. Each student writes their name in the header; the last page is their individual reflection and peer check. Bring a second pen color (or tell students to).
- Load the EHR: Pre-Built Patients > Case Study Patients > Nora Whitcombe (or Import casestudy/cases/dka_newonset/patient.json). Check that the clock reads Mon 07:00 (SD-6, SIM-40602).
- Open the bedside monitor on a second computer (Class session > Monitor code); it loads Nora's built-in scenario by MRN (header SD-6 WHITCOMBE, NORA 22 F) and follows the 4h button. It has a mid row at Tue 0335 for after the low is treated.
- There are no vital signs or bedside glucoses in the chart after 0700. You give the bedside glucoses aloud (listed in each stop below). A new nursing assessment is charted at every checkpoint and a new lab set is resulted before every stop. The 0600 Tuesday weight (56.2 kg) is on the I&O record; say it aloud too.
- Students can discontinue an order: Orders > select the order > Discontinue this order (with a reason). They need it for NPO at 1100 and for the two planted orders once the provider agrees.
- Optional props: two IV poles and pumps, a pharmacy "sodium bicarbonate 100 mEq" bag and a "potassium chloride 20 mEq/100 mL" bag (never hung), KCl 10 mEq riders, glargine and lispro pens with different label colors, glucose tablets, 4 oz juice, crackers and peanut butter, a glucagon trainer, ketone strips.

## Rules that protect the pacing

- Students finish a page at the end of its time block. Nothing on a later page is printed on an earlier one (checked by check_facts.py). Quick Check answers are never printed in the student packet (also checked).
- Every number in this key matches the chart (patient.json), the instructor guide and the monitor. If the team and the key disagree, check the chart.
- Answers can differ from the model. Look for chart numbers and a reason, not exact wording.

## Run of show (about 2 hours; about 15 minutes per stop)

Each checkpoint follows the same rhythm: read, pairs work (Quick Check answered on their own), SBAR, then the Quick Check reveal at the end of the stop.

| Clock | Minutes | What the instructor does |
|---|---|---|
| Start | 0:00-0:05 | Welcome. One team; pick the 0700 charge nurse and assign the three pair jobs (they switch every stop). Read the quick pathophysiology together. Walk through the patient card and DKA map (page 2), the rubric and the response tracker (page 3). Explain the Quick Check: learning, not points. |
| 0700 | 0:05-0:19 | Do NOT press 4h (the 0700 set is in the chart). Read the situation. Watch for the bicarbonate (hold and call), the newest K (rider 0715) and the 0.45% change. The team also fills the DKA map. SBAR warm-up (not scored). Reveal Quick Check 1. |
| 1100 | 0:19-0:33 | Press 4h. Give glucoses 0800 222, 0900 204, 1000 192, 1100 186. Watch for "dextrose up, never insulin off" and the NPO discontinuation by protocol. Reveal Quick Check 2. |
| 1500 | 0:33-0:47 | Press 4h. Watch for the KCl 20 mEq/h order (hold and call), insulin kept at K 3.6, MgSO4. Reveal Quick Check 3. |
| 1900 | 0:47-1:01 | Press 4h. DKA resolved; glargine 1900 with the drip on until 2100 (the overlap). Grief and denial. Reveal Quick Check 4. |
| 2300 | 1:01-1:15 | Press 4h. Therapeutic communication, readiness to learn, the snack and the 0300 check. Reveal Quick Check 5. |
| 0300 | 1:15-1:29 | Press 4h. Glucose 58: 15 g by mouth, 66 at 0317, repeat, 94 at 0333, snack. Show the 0335 monitor row. Reveal Quick Check 6. |
| Final 0700 | 1:29-1:44 | Press 4h. Page 1: pairs, Quick Check, tracker, evaluation table and verdict. Page 2: handoff, insulin plan, survival skills, sick-day rules, rule of 15 and glucagon, medical ID, teach-back, readiness. Reveal Quick Check 7. |
| Reflection | 1:44-1:50 | Each student completes their own reflection and peer check (page 12). Collect the 7 packets. |
| Debrief | 1:50-2:00 | Return to the 7 big ideas (debrief page). Put the trends on the board. |

### The same 14 minutes, one checkpoint

| Minute | What happens |
|---|---|
| +0 to +2 | Press 4h (not at the first 0700). Check the monitor moved. Read the situation aloud. Remind them the charge nurse changed. |
| +2 to +9 | Everyone fills the situation blanks. Pairs work the chart, the monitor and "Nora", write in their box with their names, and report to the charge nurse when finished. Each student answers the Quick Check on their own. Say the glucoses aloud when asked. Vitals & Assessment fills the tracker column. |
| +9 to +11 | The charge nurse decides the top 3 priorities, then gives you the SBAR. Answer as the provider (suggested reply below). |
| +11 to +14 | Quick Check reveal: read each answer and its one-line why; name the tempting wrong answer and why it tempts. Students correct in a different color and tick the box. Say the big idea once, then advance. |

### Monitor and bedside values at a glance

| Stop | T | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | Glucose (say aloud) |
|---|---|---|---|---|---|---|---|---|
| Mon 0700 | 98.6 | 106 | 110/66 (81) | 24, deep | 99% RA | 4/10 | Sinus tachycardia, T waves slightly tall | 274 (0700, also charted) |
| Mon 1100 | 98.4 | 96 | 112/68 (83) | 20, still a little deep | 99% RA | 2/10 | Sinus rhythm | 186 (0800 222, 0900 204, 1000 192) |
| Mon 1500 | 98.6 | 90 | 114/70 (85) | 18 | 99% RA | 1/10 | Sinus rhythm, T waves a little lower, no U waves | 166 (1200 180, 1300 174, 1400 170) |
| Mon 1900 | 98.4 | 94 | 118/74 (89) | 18 (crying) | 99% RA | 0/10 | Sinus rhythm, T waves near normal | 168 (1600 162, 1700 168, 1800 170) |
| Mon 2300 | 98.2 | 92 | 114/72 (86) | 18 | 98% RA | 0/10 | Sinus rhythm, normal T waves | 148 at 2200 (2000 178, 2100 166) |
| Tue 0300 | 97.9 | 108 | 126/76 (93) | 18 | 98% RA | 2/10 | Sinus tachycardia | 58 (then 66 at 0317, 94 at 0333) |
| Tue 0700 | 98.2 | 78 | 114/70 (85) | 14 | 99% RA | 0/10 | Sinus rhythm | 122 fasting (0400 118) |
| Tue 0335 (mid) | 97.9 | 90 | 118/72 | 16 | 98% RA | - | Sinus rhythm | 94 at 0333 |

### The seven big ideas (one per stop)

| Stop | Big idea | Clinical judgment step |
|---|---|---|
| Mon 0700 | DKA cues: Kussmaul is compensation, fruity breath is acetone; fluids first; act on the NEWEST labs (bicarbonate only under pH 7.0). | Recognize cues (and analyze them: the newest gas and K, not the oldest) |
| Mon 1100 | Fixed-rate insulin clears ketones; dextrose protects the glucose: "dextrose up, never insulin off". The gap, not the glucose. | Generate solutions / take action |
| Mon 1500 | Insulin drives potassium into the cells: know K before insulin, keep insulin at 3.5 or more, peripheral potassium never over 10 mEq/h. | Analyze cues / prioritize hypotheses, then take action |
| Mon 1900 | Resolution = BHB under 0.6 plus pH 7.3 or CO2 18; basal insulin at least 2 hours before the drip stops. | Evaluate outcomes, then take action |
| Mon 2300 | A new diagnosis is a loss: assess coping and readiness to learn before teaching; include the support person. | Recognize and analyze cues (psychosocial, plus one physical cue) |
| Tue 0300 | Rule of 15 by mouth, repeated until 70 or more, then a snack; exercise after new basal insulin predicts a night low. | Take action, then evaluate outcomes (at each 15-minute recheck) |
| Tue 0700 | Teach-back, not "do you understand?": never skip basal insulin when sick; check ketones; medical ID; supplies and follow-up. | Evaluate outcomes (which discharge criteria are met and which are still missing) |

## 0700 Monday: Checkpoint 1 of 6

Big idea: Recognize the cues of DKA and act on the NEWEST results: Kussmaul breathing is compensation, fruity breath is acetone, the dry mouth and fast heart are dehydration (fluids first); the 0530 pH 7.24 and K 4.7 drive the actions (no bicarbonate, one rider).  Clinical judgment step: Recognize cues (and analyze them: the newest gas and K, not the oldest).

Monitor (the NOW row): HR 106, BP 110/66 (MAP 81), RR 24, deep, SpO2 99% room air, temp 98.6, pain 4/10 crampy belly; rhythm: Sinus tachycardia, T waves slightly tall. Bedside glucose (aloud): 0700 274 (charted). Next check 0800. Last void at 0610: 400 mL.

Urine and I&O for the Vitals pair: ED 0300-0700: in 1,522 (0.9% NaCl 1,500 + insulin 22) / out 900: voids 0420 500, 0610 400. Whole ED stay 0140-0700: in 2,522 / out 1,500 (emesis 150 at 0215).

Portray: Head of the bed up 30 degrees, curled on her side, arm over her belly; eyes half closed; slow to answer but oriented. Breathe deep, fast and regular and do not slow down. "I'm so thirsty... can I please just have water?" / "I've been peeing all the time for weeks." / "Is this diabetes? Like, the needle kind?" / weight: "I lost like 13 pounds. I thought it was the gym." Kendall (leaves 0730): "She was on the bathroom floor... her breath smelled like nail polish remover." / "She's been drinking those big sports drinks all day for weeks."

Situation (blanks with answers in brackets): It is Monday 0700, Step-Down room SD-6. Nora Whitcombe, age [22], has [no known diabetes]. After 6 weeks of thirst, urinating and weight loss and a day of vomiting, her roommate brought her to the ED at [0140]. ED serum glucose [562], pH [7.14], anion gap [30]; first potassium [5.8]. Running now: regular insulin [5.5 units/h] (started [0305]) and [0.9% NaCl 250] mL/h. Her newest labs were drawn at [0530]. Bedside glucose at 0700: [274]. Her roommate Kendall leaves for class at 0730; her mother is driving in.

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "What is running, at what rate, and is the insulin dose right for her weight? What is due at 0700 and 0715, and does each one fit the newest labs?" Vitals & Assessment: "How is she breathing (rate, depth, smell)? Mouth, skin turgor, mental status, belly, urine. Is she safe to stand?" Results & Labs: "ED labs against the 0530 labs: gap, BHB, pH, CO2, potassium. Which set do we act on? What does the ECG show? What is still pending?"

### New results (chart values)

| Test | Normal | Mon 0150 | Mon 0530 |
|---|---|---|---|
| Sodium | 136-145 | 130 | 133 |
| Potassium | 3.5-5.1 | 5.8 | 4.7 |
| Chloride | 98-107 | 93 | 100 |
| CO2 (bicarbonate) | 22-29 | 7 | 10 |
| Anion gap | 8-12 (Na - Cl - CO2) | 30 | 23 |
| BHB (serum ketone) | Under 0.6 | 6.8 | 5.4 |
| pH, venous | 7.31-7.41 | 7.14 | 7.24 |
| pCO2, venous | 41-51 | 19 | 22 |
| Glucose (serum) | 70-99 (fasting) | 562 | 352 |
| BUN | 7-20 | 24 | 21 |
| Creatinine | 0.6-1.1 | 1.3 | 1.1 |
| Phosphorus | 2.5-4.5 | 5.9 | 3.9 |
| Lactate | 0.5-2.0 | 2.1 | 1.2 |

| Test | Normal | Mon 0150 |
|---|---|---|
| WBC | 4.5-11.0 | 16.4 |
| Hemoglobin | 12.0-15.5 | 15.8 |
| Lipase | 13-60 | 48 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | Regular insulin 5.5 units/h (0.1 x 55.0 kg; 100 units/100 mL = 1 unit/mL = 5.5 mL/h; fixed rate, no bolus; HIGH ALERT, independent double check, Y-site at the lowest port, left forearm 18 g). 0.45% NaCl 250 mL/h due 0700 replaces the 0.9%: corrected Na 133 + 1.6 x 2.52 = 137.0 (normal), so the rest of the deficit is free water. Sodium bicarbonate 100 mEq due 0700 = planted error 1: do not hang; call (pH 7.24, not under 7.0). KCl rider 10 mEq/100 mL over 1 h due 0715 (K 4.7: table 4.5-5.0 = 10 mEq; urine 400 mL at 0610, well over 28 mL/h), alone on pump 2 into the right forearm 20 g. D5W/0.45% NaCl 150 mL/h ready for glucose under 250. NPO except ice chips (RN may advance per protocol). Ondansetron and acetaminophen PRN; ibuprofen held. |
| VITALS & ASSESSMENT pair | HR 106 sinus tachycardia, T waves slightly tall; BP 110/66 (MAP 81); RR 24, deep and regular (Kussmaul); SpO2 99% RA; T 98.6; pain 4/10 crampy belly; glucose 274. Drowsy but wakes to voice, oriented x4, slow to answer. Fruity (acetone) breath, lungs clear. Lips dry and cracked, tongue dry and furrowed, tenting 3 seconds, eyes slightly sunken, cap refill 3 s. Nauseated, belly diffusely tender, bowel sounds hypoactive. Voiding large amounts of pale urine. Morse 45 (bed alarm on, stand-by assist). |
| RESULTS & LABS pair: new results and significance | DKA, moderate-to-severe: ED glucose 562, pH 7.14, CO2 7, gap 30, BHB 6.8. Improving on insulin by 0530: pH 7.24, CO2 10, gap 23, BHB 5.4, glucose 352. K 5.8 to 4.7: acid and no insulin pushed K out of the cells (peaked T waves V2-V4 on the 0205 ECG: PR 138, QRS 84, QTc 426); insulin is moving it back in, and the body total is low. Na 130 is diluted by glucose (corrected 137.4, then 137.0). BUN 24 / creatinine 1.3 = prerenal (dehydration), 1.1 at 0530. WBC 16.4 with no bands = stress; lipase 48 normal; hCG negative; UA glucose 4+, ketones large, no infection. Pending: HbA1c, TSH, C-peptide, islet antibodies, celiac screen. |
| Response tracker column (Vitals & Assessment pair) | 106, sinus tach, T slightly tall;  24, deep, fruity breath;  274;  23 (0530);  5.4;  7.24 / 10;  4.7;  drowsy, oriented x4;  about 225 mL/h; dry, tenting;  (start) |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | 0.45% NaCl at 0700; rider 0715; glucose 0800 (have D5W/0.45% ready); neuro check; strict I&O with the hat; ice chips; labs 0930. |
| TEAM (charge): top 3 priorities | 1) Hold the bicarbonate and call (pH 7.24); keep the insulin at 5.5 units/h with a double check.  2) Fluids and potassium by the newest labs: change to 0.45% NaCl 250; KCl rider 0715 (K 4.7, urine flowing); telemetry.  3) Hourly glucose (D5W/0.45% ready for under 250), neuro checks every 2 h, fall precautions, mouth care. |
| TEAM (charge): SBAR (warm-up, not scored) | S: RN for Nora Whitcombe, SD-6, new-onset DKA just up from the ED. I am holding a sodium bicarbonate order due at 0700.  B: 22, no known diabetes; ED pH 7.14, gap 30, BHB 6.8, K 5.8; insulin 5.5 units/h since 0305 per the fixed-rate protocol.  A: Her 0530 pH is 7.24 and K 4.7 and falling; our protocol gives bicarbonate only under pH 7.0, and it would lower her potassium.  R: May I discontinue the bicarbonate and continue the protocol? I am changing to 0.45% NaCl and hanging the 0715 rider. |
| Prediction (no wrong answers) | Any reasoned guess earns credit. What happens: glucose falls under 250 at 0800, so dextrose is added while the insulin keeps running; she stops vomiting and asks to drink. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

### DKA map (page 2): model answers for "What Nora shows"

| Row | What Nora shows |
|---|---|
| INSULIN (missing) | No insulin of her own (new type 1 likely): ED glucose 562 (548 bedside), 274 at 0700; hunger with a 6.0 kg loss (61.0 to 55.0 kg): fat and muscle burned for fuel; tired, blurry vision. |
| GLUCOSE IN THE URINE (osmotic diuresis) | Weeks of thirst and urinating; UA glucose 4+, SG 1.032; ED urine 1,350 mL; dry cracked lips, dry furrowed tongue, tenting 3 s, eyes sunken, HR 106 (126 in the ED), cap refill 3 s; BUN 24 / creatinine 1.3 (prerenal). |
| KETONES (acid) | BHB 6.8 then 5.4; gap 30 then 23; pH 7.14 then 7.24; CO2 7 then 10; UA ketones large; Kussmaul RR 24 deep (30 in the ED) with pCO2 22 (compensation); fruity breath; nausea, vomiting, belly pain. |
| POTASSIUM (shifts) | K 5.8 in the ED with peaked T waves V2-V4 (ECG 0205) while the body total is low; 4.7 at 0530 after insulin started (shift back in); T waves still slightly tall; protocol rider due 0715. |

Instructor as the provider (suggested reply): (Dr. A. Petrakis, day hospitalist, 0715) "Agreed. Her pH is 7.24; we only give bicarbonate under 7.0. Discontinue it. Continue the protocol." (Students discontinue the order with the reason; the addendum appears at 0730.)

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Recognize cues | Q: Nora breathes deep, fast and regular. Her SpO2 is 99% and her lungs are clear. What best explains this breathing?  Answer: B (Her lungs are blowing off CO2 to make up for an acid in the blood). Kussmaul respirations: respiratory compensation for the metabolic (keto)acidosis.  Why: The 0530 gas shows pH 7.24 with pCO2 22, right where the lungs should pull it (Winter's: 1.5 x 9.2 + 8 = 21.8, plus or minus 2). As the acid clears, the RR falls.  Tempting wrong answer: A (anxiety): she is scared and breathing fast, and "hyperventilation" is the familiar word. Slowing her breathing would take away her compensation.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); acid-base balance: metabolic acidosis |
| 2. Analyze cues | Q: Which results should guide the 0700 actions?  Answer: B (The 0530 set: K 4.7, pH 7.24). Act on the newest set: K 4.7 calls for one protocol rider (table 4.5-5.0 = 10 mEq, hung at 0715) and pH 7.24 means no bicarbonate.  Why: On insulin the numbers move fast: K fell from 5.8 to 4.7 in under 4 hours.  Tempting wrong answer: A: the ED numbers are the dramatic ones, they are quoted in the H&P, and the bicarbonate order was written from them.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (monitoring K before and during insulin) |
| 3. Take action | Q: A sodium bicarbonate infusion is due at 0700. The newest pH is 7.24. What should the nurse do?  Answer: C (Hold it and call the provider with the newest pH). Hold and call (SBAR). Bicarbonate is given only for pH under 7.0 (2024 consensus and this order set); the provider discontinues it at 0715.  Why: Above pH 7.0 it adds no benefit, pushes potassium into the cells (K 4.7 and falling on insulin) and can slow ketone clearance.  Tempting wrong answer: A: a bicarbonate of 7 looks frightening and the H&P says "for bicarbonate 7". The pH, not the bicarbonate number, decides.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); acid-base: bicarbonate therapy |

## 1100 Monday: Checkpoint 2 of 6

Big idea: Glucose fell under 250, so dextrose is added and the insulin keeps running ("dextrose up, never insulin off"). The goal is to clear ketones (close the gap, BHB under 0.6), not to lower glucose; glucose normalizes hours before the acidosis does.  Clinical judgment step: Generate solutions / take action.

Monitor (the NOW row): HR 96, BP 112/68 (MAP 83), RR 20, still a little deep, SpO2 99% room air, temp 98.4, pain 2/10 belly; rhythm: Sinus rhythm. Bedside glucose (aloud): 0800 222, 0900 204, 1000 192, 1100 186.

Urine and I&O for the Vitals pair: 0700-1100: in 941 (IV fluid 709, IV med 172, ice chips 60) / out 900: voids 0800 350, 0945 300, 1050 250 (about 225 mL/h).

Portray: Sitting up, more color, breathing slower but still a bit deep, licking dry lips, texting her mom. "Please, can I drink something? Anything." / "Why are you giving me sugar? I thought sugar was the problem." / "My arm aches a little where that bag goes in." Julia (speakerphone, from the car): "Her sugar is almost normal, so can they take her off the insulin?"

Situation (blanks with answers in brackets): It is 1100. The 0800 bedside glucose was [222], so at 0805 the main fluid changed to [D5W/0.45% NaCl 150] mL/h; the insulin is still [5.5 units/h]. Potassium riders: 0715, [1030] (running now) and [1130] (next). The 0930 labs: potassium [4.1] and pH [7.29]. Her HbA1c is [11.6]%. Last vomiting at [0215]; no nausea since about 0900. Bedside glucose now [186] (ask the instructor). Nora begs to drink, and her mother calls from the road: "Her sugar is almost normal, so can they take her off the insulin?"

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "Which fluid and insulin rate does the protocol want at this glucose? Which order no longer fits Nora, and what does its own text say about stopping it?" Vitals & Assessment: "Breathing depth and smell, mouth, bowel sounds, nausea, mental status, the rider site. Is she ready to drink?" Results & Labs: "0930 against 0530: gap, BHB, pH, CO2, K. Is she still in DKA, and how do you know with a glucose of 198? What does the A1c tell us?"

### New results (chart values)

| Test | Normal | Mon 0530 | Mon 0930 |
|---|---|---|---|
| Sodium | 136-145 | 133 | 136 |
| Potassium | 3.5-5.1 | 4.7 | 4.1 |
| Chloride | 98-107 | 100 | 104 |
| CO2 (bicarbonate) | 22-29 | 10 | 13 |
| Anion gap | 8-12 (Na - Cl - CO2) | 23 | 19 |
| BHB (serum ketone) | Under 0.6 | 5.4 | 3.3 |
| pH, venous | 7.31-7.41 | 7.24 | 7.29 |
| Glucose (serum) | 70-99 (fasting) | 352 | 198 |
| Creatinine | 0.6-1.1 | 1.1 | 0.9 |
| Magnesium | 1.8-2.4 | 2.1 | 1.9 |
| Phosphorus | 2.5-4.5 | 3.9 | 2.6 |

| Test | Normal | Mon 0150 |
|---|---|---|
| HbA1c (%) | Under 5.7 (5.7-6.4 prediabetes; 6.5 or more diabetes) | 11.6 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | D5W/0.45% NaCl 150 mL/h since 0805 (7.5 g dextrose an hour) and insulin unchanged at 5.5 units/h (dextrose table 150-249). Riders: 0715 done; K 4.1 = 20 mEq (table 4.0-4.4): 1030 running, 1130 next, one at a time, right forearm (site check every hour; mild ache, no redness). The order to discontinue: NPO except ice chips (criteria met): Orders > NPO > Discontinue, reason "criteria met per DKA diet advancement protocol"; Dr. Petrakis enters sugar-free clear liquids at 1105. Bicarbonate was discontinued at 0715 (Petrakis addendum 0730). |
| VITALS & ASSESSMENT pair | HR 96 sinus; BP 112/68 (MAP 83); RR 20, slower but still a little deep; fruity breath fainter; SpO2 99%; T 98.4; pain 2/10. Glucose 0800 222, 0900 204, 1000 192, 1100 186. Awake, alert, oriented x4, headache gone. No nausea, bowel sounds active, asking to drink. Lips dry, tongue moist, turgor 2 seconds. Urine 0800 350, 0945 300, 1050 250 (about 225 mL/h). Rider site: mild ache, no redness or swelling. |
| RESULTS & LABS pair: new results and significance | Still in DKA: gap 23 to 19, BHB 5.4 to 3.3, pH 7.24 to 7.29, CO2 10 to 13 (improving at about 0.5 BHB an hour: the insulin rate is right). Glucose 352 to 198. K 4.1 (shifting in on insulin): 2 riders per table. Creatinine 0.9 (prerenal injury clearing). Mg 1.9, phos 2.6. HbA1c 11.6% (eAG = 28.7 x 11.6 - 46.7 = 286): high glucose for weeks to months, before the symptoms she noticed. |
| Response tracker column (Vitals & Assessment pair) | 96, sinus;  20, a little deep, fainter odor;  186 (222 at 0800: D5 added);  19;  3.3;  7.29 / 13;  4.1;  alert x4;  about 225 mL/h; tongue moist;  better, still in DKA |
| What changed since the last stop | Better: alert x4, breathing slower, nausea gone, gap 23 to 19, BHB 5.4 to 3.3, pH 7.29. Glucose under 250 since 0800 (dextrose added). K down 4.7 to 4.1. Still in DKA. |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Clear liquids when ordered; 1130 rider; hourly glucose; I&O; neuro check; teach the "why" of the dextrose; labs 1330. |
| TEAM (charge): top 3 priorities | 1) Keep the insulin at 5.5 units/h with D5W/0.45% at 150 (protect the glucose, clear the ketones); explain why to Nora and her mother.  2) Discontinue NPO by protocol and report it; sugar-free clear liquids.  3) Potassium: 1130 rider after the 1030 rider, one at a time; site and urine checks; hourly glucose; neuro check. |
| TEAM (charge): SBAR | S: Nora Whitcombe, SD-6: I discontinued her NPO order per the DKA diet-advancement criteria.  B: New-onset DKA on fixed-rate insulin 5.5 units/h; glucose 222 at 0800, so D5W/0.45% at 150 since 0805. Last vomiting 0215.  A: No nausea since about 0900, bowel sounds active, asking to drink. Still in DKA: gap 19, BHB 3.3, pH 7.29. K 4.1 with riders at 1030 and 1130.  R: Please enter the sugar-free clear liquid diet. I am keeping the insulin at 5.5; next labs 1330. |
| Prediction (no wrong answers) | Any reasoned guess. What happens: the potassium keeps falling on insulin (3.6 at 1330), magnesium and phosphorus drop, and a new potassium order appears. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. Petrakis, about 1105) "Good, she meets the criteria. I'm putting in sugar-free clear liquids now. Keep the insulin at 5.5 and the D5 at 150; next labs at 1330. Tell her mom the drip stays on until the acid is cleared, not until the sugar is normal."

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Take action | Q: At 0800 her glucose was 222 and the anion gap was still open. What does the DKA protocol call for?  Answer: C (Add dextrose to the fluid and keep the insulin at the same rate). D5W/0.45% NaCl 150 mL/h with the insulin unchanged at 5.5 units/h ("dextrose up, never insulin off").  Why: Insulin is there to clear the ketones; the dextrose lets it keep running without a low. Stopping it restarts ketone production.  Tempting wrong answer: A: "the sugar is almost normal" (her mother's question) sounds like the goal is met, but glucose was never the goal.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (IV insulin and dextrose) |
| 2. Analyze cues | Q: Her 0930 glucose is 198. Which result shows she is still in DKA?  Answer: B (Anion gap 19 and BHB 3.3). The gap (136 - 104 - 13 = 19; normal 8-12) and BHB 3.3 (goal under 0.6) show ketoacids are still present.  Why: Ketones, not glucose, define DKA and its end.  Tempting wrong answer: A: glucose is the number we watch most in diabetes, and it is nearly normal.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); acid-base: anion gap |
| 3. Take action | Q: The NPO order says the RN may discontinue it when criteria are met. Which findings are criteria? Select all.  Answer: A, C, D, E (No vomiting for at least 4 hours; Nausea controlled; Bowel sounds present; She asks to drink). A, C, D and E: last vomiting 0215, no nausea since about 0900, bowel sounds active, asking to drink. Discontinue NPO with a reason and report it; the provider enters sugar-free clear liquids (1105).  Why: These are the order's own criteria; an order must keep matching the patient.  Tempting wrong answer: B: glucose under 250 is the dextrose rule, not a diet rule.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (nutrition); NPO and diet advancement |

## 1500 Monday: Checkpoint 3 of 6

Big idea: Insulin drives potassium into the cells, so the blood K falls even though the body total is low. K 3.6 is still 3.5 or more, so the insulin continues, and potassium goes in no faster than 10 mEq an hour through a peripheral IV.  Clinical judgment step: Analyze cues / prioritize hypotheses, then take action.

Monitor (the NOW row): HR 90, BP 114/70 (MAP 85), RR 18, SpO2 99% room air, temp 98.6, pain 1/10 calf cramps; rhythm: Sinus rhythm, T waves a little lower, no U waves. Bedside glucose (aloud): 1200 180, 1300 174, 1400 170, 1500 166.

Urine and I&O for the Vitals pair: 1100-1500: in 1,312 (oral 540, IV fluid 600, IV med 172) / out 850: voids 1150 300, 1330 300, 1450 250 (about 213 mL/h).

Portray: Sitting up, rubbing her calves; breathing nearly normal; teary with relief since her mother came. "My legs feel heavy, and my calves keep cramping." / "Why do I need more potassium? You just gave me some." / "Is my heart okay? What are those lines on the screen?" Julia (winter coat, travel bag; a teacher who writes things down): "Can't you give it all at once so she's done faster?"

Situation (blanks with answers in brackets): It is 1500. Nora has had sugar-free clear liquids since [1105], and her mother Julia arrived at 1300. The 1330 labs: potassium [3.6], magnesium [1.7], phosphorus [1.8], pH [7.32], but BHB still [1.3]. Bedside glucose [166] (ask the instructor). At 1420 the day hospitalist ordered new potassium and magnesium doses, due at [1500]. She has [peripheral IVs only] (left forearm 18 g, right forearm 20 g). Nora says: "My legs feel heavy, and my calves keep cramping."

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "Read each new 1500 order: dose, volume, time, line. Is it safe through a peripheral IV? What does the protocol allow? Should the insulin change at K 3.6?" Vitals & Assessment: "Monitor: T waves, U waves, ectopy? Leg strength and cramps, urine per hour, the right forearm site. Is she safe to walk with two IV poles?" Results & Labs: "K 5.8, 4.7, 4.1, now 3.6: why falling? What does Mg 1.7 do to potassium? pH 7.32: is she resolved?"

### New results (chart values)

| Test | Normal | Mon 0930 | Mon 1330 |
|---|---|---|---|
| Sodium | 136-145 | 136 | 137 |
| Potassium | 3.5-5.1 | 4.1 | 3.6 |
| Chloride | 98-107 | 104 | 106 |
| CO2 (bicarbonate) | 22-29 | 13 | 14 |
| Anion gap | 8-12 (Na - Cl - CO2) | 19 | 17 |
| BHB (serum ketone) | Under 0.6 | 3.3 | 1.3 |
| pH, venous | 7.31-7.41 | 7.29 | 7.32 |
| Glucose (serum) | 70-99 (fasting) | 198 | 172 |
| Creatinine | 0.6-1.1 | 0.9 | 0.8 |
| Magnesium | 1.8-2.4 | 1.9 | 1.7 |
| Phosphorus | 2.5-4.5 | 2.6 | 1.8 |

| Test | Normal | Mon 0530 |
|---|---|---|
| TSH | 0.4-4.0 | 1.8 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | KCl 20 mEq in 100 mL IV over 1 h x 2, due 1500 = planted error 2: do not hang; call. 20 mEq/h is twice the peripheral limit. Provider reply 1510: discontinue; protocol riders 10 mEq/100 mL x 4, back to back from 1505 (K 3.5-3.9 = 40 mEq), one at a time on pump 2, right forearm; urine 1450 250 mL (about 190 mL/h since 1330), well over 28 mL/h. Keep insulin 5.5 units/h (K 3.6 is 3.5 or more) and D5W/0.45% 150. MgSO4 2 g IV over 2 h at 1505 (Mg 1.7; low Mg makes K hard to correct), left line Y-site. Phosphate 1.8: monitored, not replaced (only under 1.0). |
| VITALS & ASSESSMENT pair | HR 90 sinus, T waves a little lower than this morning, no U waves, no ectopy; BP 114/70 (MAP 85); RR 18, normal depth, faint fruity breath; SpO2 99%; T 98.6; pain 1/10 (calf cramps). Glucose 1200 180, 1300 174, 1400 170, 1500 166. Alert x4, "legs feel heavy", mild calf cramps, grip strong, steady gait (Morse 35). Tolerating clear liquids (540 mL), mucous membranes moist. Urine 1150 300, 1330 300, 1450 250. Right forearm IV patent, no redness. Mother at the bedside. |
| RESULTS & LABS pair: new results and significance | K 3.6 (5.8, 4.7, 4.1, 3.6 in 12 h on insulin): shift into cells plus urine losses; still 3.5 or more, so insulin continues. Mg 1.7 (replace), phos 1.8 (watch). pH 7.32 but BHB 1.3 = not resolved (2024 needs BHB under 0.6; older rule needs 2 of HCO3 15 or more, pH over 7.3, gap 12 or less: only the pH). Gap 17 with CO2 14 and Cl 106: a small non-gap (saline chloride) part. Glucose 172, creatinine 0.8 (normal). TSH 1.8 (normal thyroid; screened at a type 1 diagnosis). |
| Response tracker column (Vitals & Assessment pair) | 90, sinus, T a little lower;  18, normal depth, faint odor;  166;  17;  1.3;  7.32 / 14;  3.6;  alert x4, legs heavy;  about 213 mL/h; moist;  better (ketones), but K falling |
| What changed since the last stop | Better: BHB 3.3 to 1.3, gap 19 to 17, pH 7.32, drinking, normal breathing depth, alert. Worse: K 4.1 to 3.6, Mg 1.7, phos 1.8, lower T waves, heavy legs and cramps. A new potassium order does not fit her lines. |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Riders 1505, 1605, 1705, 1805; MgSO4 1505-1705; hourly glucose and site checks; neuro check; 1730 draw from the right hand with the rider paused 2 minutes per policy. |
| TEAM (charge): top 3 priorities | 1) Do not hang the 20 mEq/h potassium; SBAR call; protocol riders 10 mEq/h, 4 in a row from 1505, with telemetry watch.  2) Keep the insulin at 5.5 (K 3.6) and the D5W/0.45% at 150; MgSO4 2 g over 2 h.  3) Safety: rider site every hour, urine before each rider, walking with assist (two IV poles), plan the 1730 draw away from the riders. |
| TEAM (charge): SBAR | S: Nora Whitcombe, SD-6: I am holding the KCl 20 mEq over 1 hour order due at 1500.  B: New-onset DKA on the insulin protocol with peripheral IVs only; K 4.1 to 3.6 at 1330; Mg 1.7.  A: 20 mEq an hour is twice our peripheral limit of 10 mEq an hour. Urine about 190 mL/h. T waves a little lower, no ectopy, legs heavy.  R: Can we discontinue it and give four protocol riders of 10 mEq back to back from 1505, keep the insulin running since K is over 3.5, start the magnesium, and recheck with the 1730 labs? |
| Prediction (no wrong answers) | Any reasoned guess. What happens: the 1730 labs show the ketones cleared, and endocrinology starts the switch to insulin shots. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. Petrakis, 1510) "You're right, she only has peripheral lines. Discontinue my order. Run the protocol riders, ten an hour, four in a row, and keep the insulin going." (Order stops 1510; addendum at 1520.)

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Analyze cues | Q: Her potassium went 5.8, 4.7, 4.1, now 3.6, even though she got potassium. Why?  Answer: B (Insulin moves it into the cells; urine loses it). A shift into the cells (insulin, and the acid clearing) plus urine losses from the osmotic diuresis. The first high K was a shift out of the cells that hid a total-body deficit.  Why: The trend on insulin, not one value, is the cue. Her creatinine is 0.8, so the kidneys are fine.  Tempting wrong answer: A: draws near a rider can give odd values, so a falling number is easy to doubt, but this trend fits the physiology.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); fluid and electrolyte balance: hypokalemia |
| 2. Take action | Q: Order: potassium chloride 20 mEq in 100 mL IV over 1 hour, 2 doses. She has peripheral IVs only. What should the nurse do?  Answer: C (Hold it and call: give 10 mEq/100 mL riders, one at a time). Hold and call (SBAR); the provider discontinues it (1510) and the protocol riders run 4 in a row from 1505. Peripheral potassium: no more than 10 mEq an hour from all sources, one rider at a time, at most 4 in a row, urine 28 mL/h or more.  Why: 20 mEq an hour is a central-line rate; fast or concentrated potassium causes dysrhythmias and burns veins. Potassium is never pushed.  Tempting wrong answer: A: a pump and 100 mL sound safe, but the rate in mEq per hour is what matters.  Textbook topic: Fluid and electrolyte balance: IV potassium safety; Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) |
| 3. Prioritize hypotheses | Q: K is 3.6 on the insulin drip and BHB is 1.3. The insulin should be:  Answer: B (Continued, with potassium replaced). Continue the insulin and replace potassium: hold it only if K is under 3.5 (2024; under 3.3 in older sources). 3.6 is above both.  Why: Stopping the insulin restarts ketone production while BHB is still 1.3.  Tempting wrong answer: A: holding feels safer when K is falling, but it would undo the treatment.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (potassium and insulin) |

## 1900 Monday: Checkpoint 4 of 6

Big idea: DKA is resolved by the 2024 criteria (BHB under 0.6 AND pH 7.3 or more OR CO2 18 or more), so she moves to subcutaneous basal-bolus insulin. Glargine goes in at least 2 hours before the drip stops (1900 to 2100): IV insulin is gone in minutes and glargine takes hours to start.  Clinical judgment step: Evaluate outcomes, then take action.

Monitor (the NOW row): HR 94, BP 118/74 (MAP 89), RR 18 (crying), SpO2 99% room air, temp 98.4, pain 0/10; rhythm: Sinus rhythm, T waves near normal. Bedside glucose (aloud): 1600 162 (her own check), 1700 168, 1800 170, 1900 168 (before dinner).

Urine and I&O for the Vitals pair: 1500-1900: in 1,544 (oral 480, IV fluid 600, IV med 464 = insulin 22 + riders 392 + MgSO4 50) / out 700: voids 1600 250, 1730 250, 1850 200.

Portray: Puffy red eyes, tissues, holding the glargine pen and staring at it. "So this is forever? Every single day?" / "Did I do this to myself with all those sports drinks?" / "Can't I just fix it with diet like my aunt?" / "Okay... show me again. I don't want to do it wrong." / "Why can't you just take the IV out now?" Julia: "We'll learn it together, honey." / "Is the drip coming out now that she has the shot?"

Situation (blanks with answers in brackets): It is 1900, shift change. Four potassium riders ran from [1505]; the fourth is finishing. The 1730 labs: BHB [0.5], pH [7.34], CO2 [18], anion gap [14], potassium [3.9]. At 1700 Dr. Navarro told Nora and her mother the diagnosis: [type 1 diabetes]. She has been crying on and off since. Endocrinology wrote new orders at [1840]: insulin glargine [14 units] SubQ at 1900, and insulin lispro [4 units] with the dinner tray at 1915. Bedside glucose [168] (ask the instructor). Nora: "Why can't you just take the IV out now?"

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "What is due at 1900, 1915, 2000 and 2100, and what must keep running until when? Which two pens look alike? Who double checks the glargine? Correction dose at 168?" Vitals & Assessment: "Breathing and breath odor, mood and coping, readiness to give her own shot, the IV sites. What is she telling us about the diagnosis?" Results & Labs: "1730 against 1330: which criteria are met? Resolved, yes or no, and by which rule? Potassium after the riders?"

### New results (chart values)

| Test | Normal | Mon 1330 | Mon 1730 |
|---|---|---|---|
| Sodium | 136-145 | 137 | 138 |
| Potassium | 3.5-5.1 | 3.6 | 3.9 |
| Chloride | 98-107 | 106 | 106 |
| CO2 (bicarbonate) | 22-29 | 14 | 18 |
| Anion gap | 8-12 (Na - Cl - CO2) | 17 | 14 |
| BHB (serum ketone) | Under 0.6 | 1.3 | 0.5 |
| pH, venous | 7.31-7.41 | 7.32 | 7.34 |
| Glucose (serum) | 70-99 (fasting) | 172 | 170 |
| Magnesium | 1.8-2.4 | 1.7 | 2.1 |
| Phosphorus | 2.5-4.5 | 1.8 | 2.0 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | Glargine 14 units SubQ at 1900 (gray-label pen; independent double check; Nora gives it herself with coaching: abdomen 2 inches from the navel, prime 2 units, 90 degrees, hold 10 seconds). Keep insulin 5.5 units/h and D5W/0.45% 150 until 2100 (2-hour overlap), then stop both and saline-lock both IVs. Lispro 4 units (burgundy-label pen) with the 1915 tray: correction (168 - 150)/50 = 0.36, so 0 units. KCl ER 20 mEq PO at 2000 (K 3.9; replaces further riders after the 4th, 1805, finishes at 1905). Consistent-carbohydrate diet 45-60 g per meal. POC glucose before meals, 2200 and 0300 from 2100. Survival-skills education ordered (include her mother). |
| VITALS & ASSESSMENT pair | HR 94 sinus, T waves near normal; BP 118/74 (MAP 89); RR 18 (crying), normal depth, no fruity breath; SpO2 99%; T 98.4; pain 0. Glucose 1600 162 (her own check), 1700 168, 1800 170, 1900 168. Alert x4, legs no longer heavy, cramps gone. Tearful; denial and bargaining ("Can't I just fix it with diet like my aunt?"); asks if she caused it. Agrees to try the injection; mother watching. Urine 1600 250, 1730 250, 1850 200. Rider site normal. |
| RESULTS & LABS pair: new results and significance | Resolved at 1730 (result 1825): BHB 0.5 (under 0.6), pH 7.34, CO2 18, gap 14 (about 14.5 h of insulin). Under the older rule too: glucose 170, HCO3 18, pH 7.34. K 3.9 after the riders (KCl ER 20 mEq PO at 2000). Mg 2.1 after MgSO4. Phos 2.0. Glucose 170. |
| Response tracker column (Vitals & Assessment pair) | 94, sinus, T near normal;  18 (crying), normal depth, no odor;  168;  14;  0.5;  7.34 / 18;  3.9;  alert x4, tearful;  about 175 mL/h; moist;  better: DKA resolved |
| What changed since the last stop | Better: DKA resolved (BHB 1.3 to 0.5, CO2 14 to 18, gap 17 to 14), K 3.6 to 3.9, Mg 1.7 to 2.1, breathing normal, no odor, cramps gone. New: the diagnosis (type 1), grief and denial; the switch to SubQ insulin. |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Glargine 1900; lispro 1915; KCl ER 2000; drip and D5W/0.45% off 2100 and saline-lock both IVs; BMP and BHB 2200; emotional support; handoff to nights. |
| TEAM (charge): top 3 priorities | 1) A safe transition: glargine 14 units at 1900 with a double check; drip and D5W/0.45% stay on until 2100.  2) Lispro 4 units with the tray (correction 0); KCl ER at 2000; glucose 2200 and 0300.  3) Support her grief and include her mother; coach the first self-injection; hand off the 2100 drip stop. |
| TEAM (charge): SBAR | S: Nora Whitcombe, SD-6: DKA resolved on the 1730 labs; I am giving glargine 14 units now.  B: New-onset type 1 diabetes, insulin drip 5.5 units/h since 0305 Monday; told the diagnosis at 1700.  A: BHB 0.5, pH 7.34, CO2 18, gap 14; K 3.9. Tearful and asking if she caused it.  R: Please confirm: glargine at 1900, drip and D5W/0.45% off at 2100, lispro 4 with the tray and no correction at 168, KCl ER at 2000, glucose 2200 and 0300. |
| Prediction (no wrong answers) | Any reasoned guess. What happens: no rebound (BHB 0.3 at 2200); she cannot sleep, searches the internet, cries, and walks fast hallway laps. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. C. Navarro, endocrinology) "Yes: glargine 14 now, keep the drip and the D5 running until 2100, then saline-lock both IVs. Lispro 4 with the tray, no correction at 168. Labs at 2200 and 0200 to make sure there's no rebound."

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Evaluate outcomes | Q: Which lab set shows DKA resolved?  Answer: B (1730: pH 7.34, CO2 18, gap 14, BHB 0.5). 1730: BHB 0.5 is under 0.6, plus pH 7.34 (7.3 or more) and CO2 18 (18 or more) = resolved by the 2024 criteria.  Why: Ketones decide. At 1330 only the pH passed (BHB 1.3). Under the older textbook rule (glucose under 200 plus 2 of: HCO3 15 or more, pH over 7.3, gap 12 or less) 1330 also fails and 1730 passes.  Tempting wrong answer: A: a pH over 7.3 and a glucose under 200 look "done".  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (evaluating resolution) |
| 2. Take action | Q: Glargine is due at 1900. Why does the insulin drip keep running until 2100?  Answer: B (IV insulin wears off within minutes, and glargine takes hours to start working). The overlap: basal insulin at least 2 hours before the drip stops (2024: 2-4 h; older texts 1-2 h). A gap with no insulin means rebound ketosis (checked by BHB at 2200 and 0200).  Why: IV regular insulin has a half-life of minutes; glargine has a slow onset.  Tempting wrong answer: D: "two insulins at once" sounds like stacking doses, so stopping the drip at 1900 feels safer.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (transition to subcutaneous insulin); insulin types |
| 3. Generate solutions | Q: Starting dose: 0.5 unit/kg/day x 55.0 kg = ____ units/day. About half as basal = ____ units of glargine.  Answer: 27.5 units a day; half is 13.75, rounded to 14 units of glargine at 1900. The rest is mealtime lispro 4 units with each meal plus correction (1 unit per 50 over 150).  Why: An insulin-naive adult with new type 1 starts near 0.5 unit/kg/day, about half basal and half mealtime.  Tempting wrong answer: Giving the whole daily dose as glargine, or multiplying the drip rate by 24 hours (5.5 x 24 = 132 units).  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); insulin therapy (basal-bolus) |

## 2300 Monday night: Checkpoint 5 of 6

Big idea: A new chronic diagnosis is a loss: grief, fear and denial. The nurse assesses coping and readiness to learn before teaching, uses therapeutic communication and includes the support person. Teaching tonight is short and about safety; the survival skills wait for morning.  Clinical judgment step: Recognize and analyze cues (psychosocial, plus one physical cue).

Monitor (the NOW row): HR 92, BP 114/72 (MAP 86), RR 18, SpO2 98% room air, temp 98.2, pain 0/10; rhythm: Sinus rhythm, normal T waves. Bedside glucose (aloud): 2000 178, 2100 166 (drip off), 2200 148 (bedtime). Ate about 70% of dinner; fast hallway laps 2215-2255; snack declined at 2255.

Urine and I&O for the Vitals pair: 1900-2300: in 679 (oral 360, IV fluid 300, IV med 19) / out 550: voids 2030 300, 2240 250.

Portray: Lying on her side in the dim room, hair damp at the temples, sneakers by the bed, phone lit, red eyes. Speak quietly; open up only if the nurse sits down and asks open questions; shut down at false reassurance. "I looked it up... it says people with type 1 die younger." / "Will I even be able to have kids?" / "I'll never be normal again." / "Running is the only thing that clears my head." / "Can we do the lessons tomorrow?" / snack: "I'm not hungry, I just want to sleep." Julia (recliner): "I'm scared to sleep. What if she goes low?"

Situation (blanks with answers in brackets): It is 2300. Nora gave her own glargine at 1900 and ate about [70]% of dinner with lispro at 1915. The drip and the D5W/0.45% stopped at [2100], and both IVs are [saline-locked]. Bedtime glucose at 2200: [148] (ask the instructor). The 2200 labs: BHB [0.3], potassium [4.0]. She could not sleep and has been reading "type 1 diabetes life expectancy" on her phone and crying. From 2215 to 2255 she walked fast laps of the hallway "to clear my head," then declined a snack. Her mother is in the recliner. Next scheduled glucose check: [0300].

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "What insulin is working in her body tonight, and what does exercise do to it? Which glucose checks are ordered overnight? Any sleep medicine, and is it a good idea?" Vitals & Assessment: "What is she saying and doing? Is she ready to learn tonight? What does her mother need? IV sites, fall risk at night." Results & Labs: "2200 labs: any rebound ketosis after the drip stopped? Potassium after the oral dose? Kidneys?"

### New results (chart values)

| Test | Normal | Mon 1730 | Mon 2200 |
|---|---|---|---|
| Sodium | 136-145 | 138 | 139 |
| Potassium | 3.5-5.1 | 3.9 | 4.0 |
| CO2 (bicarbonate) | 22-29 | 18 | 20 |
| Anion gap | 8-12 (Na - Cl - CO2) | 14 | 13 |
| BHB (serum ketone) | Under 0.6 | 0.5 | 0.3 |
| Glucose (serum) | 70-99 (fasting) | 170 | 152 |
| Creatinine | 0.6-1.1 | 0.8 | 0.7 |
| Phosphorus | 2.5-4.5 | 2.0 | 2.2 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | Glargine 14 units given at 1900 (her own injection); lispro 4 units at 1915; KCl ER 20 mEq at 2000. Drip and D5W/0.45% off at 2100 (2-hour overlap); both IVs saline-locked and flushed; up ad lib. No correction at bedtime (only if over 250). Sleep: non-drug measures first (dim lights, quiet, cluster care, talk); no sleep medicine ordered. Offer the snack again (graham crackers and peanut butter). POC glucose at 0300 per order. |
| VITALS & ASSESSMENT pair | HR 92 sinus (back from walking at 2255); BP 114/72 (MAP 86); RR 18; SpO2 98%; T 98.2; pain 0. Glucose 2000 178, 2100 166, 2200 148. Crying, cannot sleep; "I'll never be normal again"; "Will I be able to have kids?"; "I don't want people at school to know." Not ready to learn tonight ("tomorrow with my mom"). Walked fast hallway laps 2215-2255 (copes by running); ate about 70% of dinner; declined a snack. Urine 2030 300, 2240 250. Saline locks clean. Morse 35; bed alarm on at night. |
| RESULTS & LABS pair: new results and significance | No rebound ketosis: BHB 0.3, gap 13, CO2 20 two hours after the drip stopped. K 4.0 (after the oral KCl). Creatinine 0.7 (back to normal). Glucose 152 (lab, 2200). Phos 2.2. |
| Response tracker column (Vitals & Assessment pair) | 92, sinus;  18, normal, no odor;  148 (2200);  13;  0.3;  CO2 20;  4.0;  x4, crying, cannot sleep;  about 138 mL/h; moist;  same physically; coping and night-low concern |
| What changed since the last stop | Physically steady: off the drip with no rebound (BHB 0.3), K 4.0, creatinine normal. New: grief, insomnia and online searching; 40 minutes of fast walking after her first glargine dose with no snack (night-low risk). |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Snack offered again; 0300 glucose; call light within reach; bed alarm; support her mother's rest; survival skills planned for the morning. |
| TEAM (charge): top 3 priorities | 1) Therapeutic communication: sit down, acknowledge, open questions, correct misinformation; include her mother.  2) Night-low safety: offer the snack, make sure the 0300 check happens, teach the signs of a low and the call light.  3) Readiness to learn: safety only tonight; survival skills in the morning with her mother; sleep with non-drug measures. |
| TEAM (charge): SBAR | S: Nora Whitcombe, SD-6: off the insulin drip since 2100 with no rebound; she is crying and cannot sleep.  B: New type 1 diabetes told today; glargine 14 units at 1900, lispro 4 at dinner (ate about 70%). Bedtime glucose 148.  A: Grieving the diagnosis, not ready to learn tonight. She walked fast for 40 minutes after her first glargine and declined a snack: risk of a low overnight. BHB 0.3, K 4.0.  R: I will offer the snack again and keep the 0300 check. No sleep medicine for now, non-drug measures. Please call back for any glucose under 70. |
| Prediction (no wrong answers) | Any reasoned guess. What happens: at the 0300 check she is hard to rouse and her glucose is low (58). |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. D. Rasmussen, night hospitalist) "No rebound, good. No sleep medicine for now; try the non-drug measures. Offer the snack again and keep the 0300 check. Call me for anything under 70."

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Recognize cues | Q: Nora says, "I'll never be normal again." Which response is best?  Answer: B ("This is a lot. What worries you most right now?"). Acknowledge the feeling, then ask an open question (therapeutic communication).  Why: It names her feeling and opens the talk, so the nurse can assess coping and correct what she read online with accurate hope.  Tempting wrong answer: A: it is kind and true in the long run, but it is false reassurance that closes the conversation.  Textbook topic: Care of patients with diabetes: psychosocial response to a new diagnosis; therapeutic communication |
| 2. Generate solutions | Q: What is the best teaching plan tonight?  Answer: B (Safety only now; the rest in the morning with her mom). Readiness first: teach the safety essentials tonight and the survival skills in the morning, rested, with the support person she chose.  Why: Anxiety, grief and fatigue block learning; short sessions and the right time work better.  Tempting wrong answer: A: discharge is close and teaching feels urgent.  Textbook topic: Patient education: readiness to learn; Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (teaching a new diagnosis) |
| 3. Analyze cues | Q: Bedtime glucose 148. She then walked fast for 40 minutes and declined a snack. Best action?  Answer: C (Offer a snack (carb + protein); keep the 0300 check). Offer the snack again (about 15 g carbohydrate plus protein) and keep the 0300 check.  Why: Exercise lowers glucose during the activity and for hours after, and her first glargine dose is starting to work.  Tempting wrong answer: A: 148 is in range now; the risk is what comes in the next hours.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); exercise and insulin |

## 0300 Tuesday: Checkpoint 6 of 6

Big idea: Hypoglycemia on SubQ insulin in a patient who can swallow is treated by mouth: 15 g fast carbohydrate, recheck in 15 minutes, repeat until 70 or more, then a snack. IV dextrose is for a patient who cannot swallow. Her first signs were confusion, not shakiness.  Clinical judgment step: Take action, then evaluate outcomes (at each 15-minute recheck).

Monitor (the NOW row): HR 108, BP 126/76 (MAP 93), RR 18, SpO2 98% room air, temp 97.9, pain 2/10 headache; rhythm: Sinus tachycardia. Bedside glucose (aloud): 0300 58. After 4 glucose tablets (0302): 0317 66. After 4 oz juice (0318): 0333 94. Mid monitor row 0335: HR 90, BP 118/72, RR 16.

Urine and I&O for the Vitals pair: 2300-0300: in 120 (water at 0100) / out 300: void 0130 300 (75 mL/h).

Portray: In the dark: slow to open her eyes, confused for a moment, then irritable, sweaty, pale. "What... leave me alone, I'm sleeping... where am I?" then "Oh. The hospital. I feel really weird... foggy." After the tablets: "I need to pee. I can walk, I'm fine" (she is shaky). After the juice: "That was scary. I didn't even feel it coming." / "Was it because I walked so much?" / "What do I do if this happens at my apartment?" Julia: "Is she okay? Should I get someone?" Give 58, then 66 at 0317, then 94 at 0333; show the 0335 mid row (HR 90, BP 118/72, RR 16).

Situation (blanks with answers in brackets): It is 0300 Tuesday, time for the scheduled glucose check. The 0200 labs resulted at 0245: glucose [84], BHB [0.3], potassium [4.1]. Nora is hard to rouse for a moment, then groggy, irritable and sweaty. Her bedside glucose is [58] (ask the instructor). Within a minute she is oriented and [can swallow]. The hypoglycemia protocol for patients on [subcutaneous insulin] was ordered at 1840. Her mother wakes up frightened: "Is she okay? Should I get someone?"

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "What does the hypoglycemia protocol say for a patient who can swallow? How much, what, and when do we recheck? Who do we call, and does she need any insulin?" Vitals & Assessment: "Mental status, skin, monitor, symptoms. After treatment: recheck values. Can she safely walk to the bathroom?" Results & Labs: "The 0200 labs: what was the early warning? Any ketones? What else made a low likely tonight?"

### New results (chart values)

| Test | Normal | Mon 2200 | Tue 0200 |
|---|---|---|---|
| Sodium | 136-145 | 139 | 139 |
| Potassium | 3.5-5.1 | 4.0 | 4.1 |
| CO2 (bicarbonate) | 22-29 | 20 | 22 |
| Anion gap | 8-12 (Na - Cl - CO2) | 13 | 12 |
| BHB (serum ketone) | Under 0.6 | 0.3 | 0.3 |
| Glucose (serum) | 70-99 (fasting) | 152 | 84 |
| Phosphorus | 2.5-4.5 | 2.2 | 2.6 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | Hypoglycemia protocol (SubQ insulin), alert and able to swallow: 0302 4 glucose tablets (16 g), chewed; 0317 66: 4 oz apple juice (15 g) at 0318; 0333 94 (70 or more): snack at 0335 (crackers, peanut butter, milk 120 mL) because breakfast is more than 1 h away. No correction insulin. D50 or glucagon only if she cannot swallow. Call the provider (protocol); new order at 0320: POC glucose once at 0400. Next glargine is not due until 1900. |
| VITALS & ASSESSMENT pair | 0300: HR 108 sinus tachycardia; BP 126/76 (MAP 93); RR 18; SpO2 98%; T 97.9; pain 2/10 (headache). Hard to rouse for a moment, then groggy, irritable, briefly unsure where she is; oriented x4 within a minute; can swallow. Cool, pale, sweaty, gown damp. Glucose 0300 58, 0317 66, 0333 94. Mid row 0335: HR 90, BP 118/72, RR 16; alert, skin dry, eating. Wants to walk to the bathroom alone while shaky (Morse 45): assist or commode. Mother frightened. Void 0130 300. |
| RESULTS & LABS pair: new results and significance | 0200 lab glucose 84 (resulted 0245): the early warning, about an hour before the low. BHB 0.3, gap 12, CO2 22: no rebound ketosis. K 4.1. Phos 2.6. |
| Response tracker column (Vitals & Assessment pair) | 108, sinus tach (90 at 0335);  18, normal, no odor;  58, 66, then 94;  12;  0.3;  CO2 22;  4.1;  groggy, then x4;  about 75 mL/h; moist;  worse (low), then better |
| What changed since the last stop | Worse: glucose 148 at 2200 to 58 at 0300 with confusion and sweating (level 1 low under 70; 58 is not under 54). Treated: 66, then 94; HR 108 to 90. Ketones still clear. |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Juice 0318; recheck 0333; snack 0335; recheck 0400; dry gown; bed alarm; teach her and her mother the rule of 15. |
| TEAM (charge): top 3 priorities | 1) Treat the low now by mouth: 15 g, recheck in 15 minutes, repeat until 70 or more, then a snack.  2) Safety: keep her in bed or assist to the bathroom while shaky; bed alarm; change the damp gown; comfort her mother.  3) Call the provider (protocol), recheck at 0400, teach her the signs and the rule of 15 while she lives it. |
| TEAM (charge): SBAR | S: Nora Whitcombe, SD-6: glucose 58 at the 0300 check; hard to rouse for a moment, now oriented and swallowing. I gave 16 g of glucose tablets at 0302.  B: New type 1 diabetes; DKA resolved Monday 1730; glargine 14 units at 1900, lispro 4 at dinner. Walked fast for 40 minutes at 2215 and declined a snack. 0200 lab glucose 84.  A: Hypoglycemia from exercise after her first basal dose with no snack. 0317 recheck 66: still low.  R: I am giving another 15 g of juice now, a snack once she is 70 or more, and no correction insulin. Do you want a recheck at 0400? Please ask endocrinology to review her doses in the morning. |
| Prediction (no wrong answers) | Any reasoned guess. What happens: she sleeps until 0630 with glucose 118 at 0400, and at 0700 she is ready to learn but makes a pen error and has a sick-day misconception. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. Rasmussen, called 0305, reply 0320) "Repeat the 15 grams, snack once she is 70 or more, recheck at 0400, no correction insulin. Endocrinology will adjust the doses in the morning." (Order "POC glucose once at 0400" appears at 0320.)

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Take action | Q: Glucose 58. She is now oriented and can swallow. What is the nurse's first action?  Answer: B (15 g of fast carbohydrate by mouth, then recheck in 15 minutes). The rule of 15 by mouth: 4 glucose tablets (16 g) at 0302, then recheck at 0317.  Why: She can swallow, so oral fast carbohydrate is the quickest safe treatment; IV dextrose or glucagon is for a patient who cannot swallow or is NPO. The protocol lets the RN treat first, then call.  Tempting wrong answer: A: she was groggy at first and D50 works fast; C: calling feels safe but delays treatment.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (hypoglycemia: rule of 15) |
| 2. Evaluate outcomes | Q: At 0317 her glucose is 66. What next?  Answer: B (Repeat 15 g fast carbohydrate and recheck in 15 minutes). 66 is still under 70: repeat 15 g (4 oz juice at 0318), recheck (94 at 0333), then a snack with protein (0335) because breakfast is more than 1 hour away. No correction insulin.  Why: The recheck decides; fat and protein act too slowly to treat a low.  Tempting wrong answer: A: she is rising and feels better, so the snack seems enough.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (hypoglycemia: evaluating treatment) |
| 3. Analyze cues | Q: Which cues raised her risk of a low tonight? Select all.  Answer: A, B, D (Fast walking for 40 minutes after her first glargine dose; She declined a bedtime snack; The 0200 lab glucose). A, B and D: exercise lowers glucose for hours, no snack, the new basal insulin working, and the 0200 lab glucose 84 (resulted 0245) showed the fall.  Why: Early cues allow an early check and a snack; a falling glucose at night after exercise on new basal insulin needs action before the scheduled check.  Tempting wrong answer: C: a ketone number feels important in DKA, but 0.3 only shows there is no rebound.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e); hypoglycemia risk factors |

## 0700 Tuesday: Final check (page 1 of 2)

Big idea: She is safe to go home when she (and her mother) can SHOW the survival skills by teach-back and return demonstration, not "do you understand?": pen technique, glucose checks, treating a low (and glucagon by her mother), sick-day rules (never stop basal; check ketones) and a medical ID; plus supplies in hand and follow-up.  Clinical judgment step: Evaluate outcomes (which discharge criteria are met and which are still missing).

Monitor (the NOW row): HR 78, BP 114/70 (MAP 85), RR 14, SpO2 99% room air, temp 98.2, pain 0/10; rhythm: Sinus rhythm. Bedside glucose (aloud): 0400 118, 0700 122 (fasting). Weight 0600: 56.2 kg.

Urine and I&O for the Vitals pair: 0300-0700: in 480 (juice 120, milk 120, water 240) / out 600: voids 0420 300, 0640 300. Daily weight 0600: 56.2 kg (55.0 on arrival).

Portray: In the chair in her own sweatshirt, good color, holding the lispro pen; Julia leaning in. "Okay, four units, then I just pull it out, right?" / "If I'm sick, I'll just skip it so I don't go low, right?" / "Do I really have to wear a bracelet? Can it be on my phone?" / "When can I go home?" / "Mom, you have to learn the emergency shot thing." Julia: "Teach me everything too. I'm staying with her for a week." Weight 56.2 kg; glucose 118 (0400), 122 (0700).

Situation (blanks with answers in brackets): It is Tuesday 0700. Glucose 0400 [118], fasting 0700 [122] (ask the instructor). Weight [56.2] kg (55.0 on arrival). The 0530 labs: CO2 [24], BHB [0.2], potassium [4.2]. C-peptide is [0.3] (low); the celiac screen is [negative]; the islet antibodies are [pending]. At 0650 she practiced her breakfast lispro with the nurse: she dialed 4 units without the priming shot and planned to "pull it right out." She asks: "If I'm sick and can't eat, I'll just skip my insulin, right?" The plan is home this evening if she is ready.

Questions a strong charge nurse asks (not printed for students; prompt only if stuck): Meds and Orders: "What insulin is due today and when? What are the pen steps? What supplies must be in her hands before she leaves?" Vitals & Assessment: "Vital signs, mental status, eating, IV sites, weight against arrival. What can she and her mother show us, and what can't they yet?" Results & Labs: "0530 labs: still resolved? What do the C-peptide and the pending antibodies mean? What changed in the CBC since Monday, and why?"

### New results (chart values)

| Test | Normal | Tue 0200 | Tue 0530 |
|---|---|---|---|
| Sodium | 136-145 | 139 | 140 |
| Potassium | 3.5-5.1 | 4.1 | 4.2 |
| CO2 (bicarbonate) | 22-29 | 22 | 24 |
| Anion gap | 8-12 (Na - Cl - CO2) | 12 | 12 |
| BHB (serum ketone) | Under 0.6 | 0.3 | 0.2 |
| Glucose (serum) | 70-99 (fasting) | 84 | 124 |
| Phosphorus | 2.5-4.5 | 2.6 | 3.0 |

| Test | Normal | Mon 0150 | Tue 0530 |
|---|---|---|---|
| WBC | 4.5-11.0 | 16.4 | 8.2 |
| Hemoglobin | 12.0-15.5 | 15.8 | 12.6 |

| Test | Normal | Mon 0530 |
|---|---|---|
| C-peptide | 0.8-3.1 | 0.3 |

| Box | Model answer and rationale |
|---|---|
| MEDS AND ORDERS pair | Breakfast lispro 4 units at 0730 with the tray (glucose 122: no correction). Glargine at 1900 tonight (instructor only, after the course: endocrinology lowers it to 12 units after the low). Stop the pen error and re-teach: new needle, prime 2 units, dial, 90 degrees, hold 10 seconds, rotate sites, sharps box; return demonstration. Supplies before discharge: glargine and lispro pens, pen needles, meter, strips, lancets, ketone strips, glucagon, glucose tablets, sharps container. Remove both saline locks before discharge. |
| VITALS & ASSESSMENT pair | HR 78 sinus; BP 114/70 (MAP 85); RR 14, normal, no odor; SpO2 99%; T 98.2; pain 0. Glucose 0400 118, 0700 122. Weight 56.2 kg (55.0 on arrival: about 1 kg of water back). Alert, rested, "ready to learn," wants her mother to learn everything; does not want a bracelet. Pen practice: missed the priming shot and the 10-second hold. Believes she should skip insulin on sick days. Hungry, eating; saline locks patent. Urine 0420 300, 0640 300. |
| RESULTS & LABS pair: new results and significance | Still resolved: BHB 0.2, gap 12, CO2 24. K 4.2, glucose 124 (lab). C-peptide 0.3 (normal 0.8-3.1): little insulin of her own, supports type 1. Celiac screen negative (tTG-IgA under 1.0 with total IgA 165: valid). Islet antibodies pending. WBC 16.4 to 8.2 (stress, not infection); Hgb 15.8 to 12.6 (dilution after rehydration). |
| Response tracker column (Vitals & Assessment pair) | 78, sinus;  14, normal, no odor;  122 fasting;  12;  0.2;  CO2 24;  4.2;  alert x4, rested;  about 150 mL/h; moist;  better: DKA criteria met; teaching left |
| What changed since the last stop | Since 0300: glucose 58 treated to 94, then 118 and 122; slept 0345-0630. Since arrival: HR 106 to 78, RR 24 deep to 14, gap 23 to 12, BHB 5.4 to 0.2, pH 7.24 to 7.34 (last gas), K 4.7 to 4.2, creatinine 1.1 to 0.7, weight 55.0 to 56.2, eating. New gaps: pen technique, sick-day rules. |
| Actions to suggest (Vitals & Assessment + Meds and Orders) | Lispro with breakfast; pen re-teach with return demonstration; sick-day rules with ketone strips; glucagon for her mother; medical ID; supplies; follow-up; remove saline locks before discharge. |
| TEAM (charge): top 3 priorities | 1) Teach-back and return demonstration with Nora AND her mother: pen (prime, hold 10 s), meter, rule of 15 and glucagon, sick-day rules with ketones, medical ID.  2) Glucose safety today: breakfast lispro 4 units with the tray, checks before meals, no further low before discharge; endocrinology dose review.  3) Discharge readiness: supplies in hand, follow-up booked (endocrinology within 1 week, phone check Wednesday), mother checks at 0300 the first night. |
| TEAM (charge): SBAR | S: Handoff, Nora Whitcombe, SD-6, 22, new type 1 diabetes, day 2: DKA resolved Monday 1730; low glucose 58 at 0300, treated by mouth.  B: Admitted in moderate-to-severe DKA (pH 7.14, gap 30, BHB 6.8); on glargine 14 units at 1900 and lispro 4 units with meals. C-peptide 0.3; antibodies pending.  A: Stable: HR 78, BP 114/70, glucose 122 fasting, BHB 0.2, K 4.2, weight 56.2. Not ready yet: pen technique (no priming, no hold) and the sick-day belief; glucagon teaching for her mother; supplies.  R: Breakfast lispro 4 units at 0730; full survival-skills teaching with teach-back for both; endocrinology to review the glargine dose after the low; home this evening only if the criteria are met. |
| Charge nurse notes | Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes. |

Instructor as the provider (suggested reply): (Dr. Navarro, morning rounds) "Thanks for catching the pen and the sick-day mix-up. After last night's low I'm lowering her glargine to 12 units tonight at 1900 and writing an exercise plan: check before and after a run, carry 15 grams, snack if under 150, check at 0300 after an evening workout. She goes home this evening only if the teach-back, the glucagon teaching for her mom and the supplies are done."

### Quick Check: answers to reveal at the END of the stop (students correct in a different color)

| Question | Answer, why, the tempting wrong answer, textbook topic |
|---|---|
| 1. Take action | Q: After attaching a new pen needle, what must she do before dialing her dose?  Answer: B (Prime 2 units until a drop shows). Prime 2 units ("air shot") until a drop shows, dial the dose, inject at 90 degrees, hold about 10 seconds, then remove.  Why: Priming clears air and proves the needle works; holding keeps the dose from leaking out.  Tempting wrong answer: A: a new, full pen looks ready to use.  Textbook topic: Insulin therapy: pen technique; patient education (return demonstration) |
| 2. Evaluate outcomes | Q: "If I'm sick and can't eat, I'll skip my insulin, right?" Best reply?  Answer: C ("Never skip your long-acting insulin; check ketones too."). Sick-day rules: never stop basal insulin; check glucose and ketones every 2-4 h; sugar-free fluids every hour (carbohydrate fluids if not eating); call for vomiting, moderate ketones or glucose over 300 twice; ED for vomiting with ketones, fast breathing or belly pain.  Why: Illness raises the insulin need; no insulin means ketones, and ketones mean DKA again.  Tempting wrong answer: A: she just had a low, and "no food, no insulin" sounds logical.  Textbook topic: Care of patients with diabetes mellitus: DKA (Ignatavicius 11e) (sick-day rules) |
| 3. Analyze cues | Q: Which result best confirms autoimmune type 1 diabetes?  Answer: B (Positive islet autoantibodies, with a low C-peptide). Islet autoantibodies show the immune attack (pending; instructor only: Friday GAD65 210 and IA-2 positive); C-peptide 0.3 shows she makes little insulin of her own.  Why: Antibodies tell the type; A1c tells how high and for how long.  Tempting wrong answer: A: an A1c of 11.6% is striking, so it feels like the proof.  Textbook topic: Diabetes mellitus: classification and diagnosis (type 1 vs type 2) |

### Evaluation table (final page 1): model

| Criterion | Goal | At arrival (Mon 0700) | Now (Tue 0700) | Met? |
|---|---|---|---|---|
| Heart rate and rhythm | Under 100; T waves normal | 106, sinus tach, T slightly tall | 78, sinus | Yes |
| Breathing | RR 12-20, normal depth; no fruity breath | 24, deep (Kussmaul), fruity | 14, normal, no odor | Yes |
| Ketones and acid | Gap 12 or less; BHB under 0.6; pH 7.3+ or CO2 18+ | gap 23, BHB 5.4, pH 7.24, CO2 10 (0530) | gap 12, BHB 0.2, CO2 24 (last pH 7.34) | Yes |
| Potassium | 3.5-5.1 | 4.7 (5.8 in the ED) | 4.2 | Yes |
| Glucose | 70-180 with no lows | 274 | 122 fasting; but 58 at 0300 | Not yet (low at 0300) |
| Hydration and kidneys | Moist mouth; urine 28 mL/h or more; creatinine normal | dry, tenting; creatinine 1.1 | moist; creatinine 0.7; weight 56.2 | Yes |
| Mental status | Alert, oriented x4 | drowsy, oriented x4 | alert, rested, oriented x4 | Yes |
| Survival skills | Teach-back and return demonstration | (not ready to learn) | pen error; sick-day belief | Not yet |

Verdict (model): The DKA treatment worked: ketoacidosis resolved Monday 1730 (BHB 0.5, pH 7.34, CO2 18) with no rebound after the drip (BHB 0.2, gap 12, CO2 24 now), potassium kept in range without ever holding insulin, kidneys back to normal (creatinine 0.7), breathing and mental status normal, eating. Not finished: a low of 58 at 0300 (dose review), and the survival skills are not yet shown by teach-back (pen technique, sick-day rules).

## Final page 2: teaching and discharge (model answers)

| Box | Model answer |
|---|---|
| What changed, actions, priorities, handoff SBAR | Use the final-check rows on the previous page. |
| Meds pair: her insulin plan at home | Glargine once daily at 1900 (14 units now; endocrinology lowers it to 12 units after the low); lispro 4 units 0-15 minutes before each meal plus correction 1 unit per 50 over 150 (before meals); new needle and prime 2 units every time; pens in use at room temperature, spares in the fridge; never share pens; sharps container. Supplies: pens, pen needles, meter, strips, lancets, ketone strips, glucagon, glucose tablets. |
| Survival skills, sick-day rules, rule of 15 and glucagon, medical ID | (1) Pen and meter: new needle, prime 2 units, dial, 90 degrees, hold 10 seconds, rotate sites; glargine every evening at the same time, lispro 0-15 minutes before meals; check before meals, at bedtime, before driving and exercise; ADA targets 80-130 before meals. (2) Sick-day rules: never stop basal; check glucose and ketones every 2-4 h; sugar-free fluids hourly (carbohydrate fluids if not eating); call for vomiting, moderate ketones or glucose over 300 twice; ED for vomiting with ketones, fast deep breathing or belly pain. (3) Low glucose: signs (shaky, sweaty, confused, irritable, headache; at night she may not feel it); rule of 15 (15 g: 4 oz juice or 4 glucose tablets; recheck in 15 min; repeat until 70 or more; then a snack); never drive under 90; exercise and alcohol cause delayed lows; glucagon given by her mother or roommate if she cannot swallow, turn on her side, call 911. (4) Medical ID: bracelet or band reading "type 1 diabetes, insulin," plus a phone lock-screen ID; tell her roommate, professors as she chooses, the campus clinic. |
| Teach-back question | For example: "You wake up with a stomach bug and can't keep breakfast down. Tell me what you do with your insulin and what you check." (Model: take the glargine as usual; check glucose and ketones every 2-4 h; sugar-free fluids every hour, carbohydrate fluids if not eating; call for moderate ketones, vomiting or glucose over 300 twice; ED for vomiting with ketones, fast breathing or belly pain.) Ask Julia: "Show me how you would give the glucagon." |
| Is she ready to go home? | Plan: home Tuesday about 1930 with her mother after she gives her own 1900 glargine, IF: no further glucose under 70 today; eats at least half of breakfast and lunch with correct lispro; BHB under 0.6 and K normal (met); teach-back by 1700 (pen, meter, rule of 15, glucagon by her mother, sick-day rules with ketones, medical ID); supplies in hand; endocrinology within 1 week, phone check Wednesday morning, her mother checks at 0300 the first night. Met at 0700: DKA resolved over 12 h, eating, labs normal, mother engaged. Not yet: teach-back, supplies, glucagon teaching, a day without a low. |
| The story of the stay (for the debrief) | Arrived in moderate-to-severe DKA (Kussmaul, fruity breath, dehydration); bicarbonate caught at 0700; dextrose added at 0800 with the insulin kept running; NPO stopped by protocol at 1100; potassium fell to 3.6 and an unsafe 20 mEq/h order was caught at 1500; resolved at 1730 with glargine and a 2-hour overlap at 1900; grief and fast walking at night; a low of 58 at 0300 treated by mouth twice; survival skills and readiness at 0700. |

### Response tracker: the whole model (page 3)

| Measure | Mon 0700 | Mon 1100 | Mon 1500 | Mon 1900 | Mon 2300 | Tue 0300 | Tue 0700 |
|---|---|---|---|---|---|---|---|
| Heart rate / rhythm | 106, sinus tach, T slightly tall | 96, sinus | 90, sinus, T a little lower | 94, sinus, T near normal | 92, sinus | 108, sinus tach (90 at 0335) | 78, sinus |
| Breathing | 24, deep, fruity breath | 20, a little deep, fainter odor | 18, normal depth, faint odor | 18 (crying), normal depth, no odor | 18, normal, no odor | 18, normal, no odor | 14, normal, no odor |
| Glucose (bedside) | 274 | 186 (222 at 0800: D5 added) | 166 | 168 | 148 (2200) | 58, 66, then 94 | 122 fasting |
| Anion gap (latest) | 23 (0530) | 19 | 17 | 14 | 13 | 12 | 12 |
| BHB (latest) | 5.4 | 3.3 | 1.3 | 0.5 | 0.3 | 0.3 | 0.2 |
| pH / CO2 (latest) | 7.24 / 10 | 7.29 / 13 | 7.32 / 14 | 7.34 / 18 | CO2 20 | CO2 22 | CO2 24 |
| Potassium (latest) | 4.7 | 4.1 | 3.6 | 3.9 | 4.0 | 4.1 | 4.2 |
| Mental status | drowsy, oriented x4 | alert x4 | alert x4, legs heavy | alert x4, tearful | x4, crying, cannot sleep | groggy, then x4 | alert x4, rested |
| Urine and mouth | about 225 mL/h; dry, tenting | about 225 mL/h; tongue moist | about 213 mL/h; moist | about 175 mL/h; moist | about 138 mL/h; moist | about 75 mL/h; moist | about 150 mL/h; moist |
| OVERALL | (start) | better, still in DKA | better (ketones), but K falling | better: DKA resolved | same physically; coping and night-low concern | worse (low), then better | better: DKA criteria met; teaching left |

## Textbook (Ignatavicius 11e) vs the 2024 consensus: for the instructor

The chart follows the 2024 ADA/EASD/JBDS/AACE/DTS hyperglycemic crises consensus. Where students may have read an older number (the textbook often reflects the 2009 ADA algorithm), Nora's values pass under both, so no Quick Check answer changes. Decide before class which number you will say aloud, and verify the textbook values against your copy.

| Topic | 2024 consensus (the chart) | What textbooks commonly teach | Nora's values | Does the class answer change? |
|---|---|---|---|---|
| K threshold to hold insulin | Under 3.5 | Under 3.3 (2009 ADA) | Lowest K 3.6 | No: 3.6 is above both |
| Priming insulin bolus | Optional; 0.1 unit/kg/h, no bolus | Often 0.1 unit/kg IV bolus | No bolus | No |
| Bicarbonate | Only if pH under 7.0 | pH under 7.0 (100 mmol only under 6.9) | Lowest pH 7.14 | No: none under any source |
| When to add dextrose | Glucose under 250 | Often 200 (and lower insulin) | 222 at 0800, 192 at 1000 | No: crosses both by 0800-0900 |
| Resolution criteria | BHB under 0.6 AND pH 7.3+ OR HCO3 18+ | Glucose under 200 + 2 of: HCO3 15+, pH over 7.3, gap 12 or less | 1330 fails both; 1730 meets both | No |
| First fluid | 0.9% NaCl or balanced crystalloid | 0.9% NaCl, then 0.45% | 0.9% to 0700, then 0.45% (corrected Na 137.0) | No |
| Glucose fall rate | 50-75 mg/dL per hour | Avoid a fall over 100 per hour | About 50-58 per hour | No |
| Overlap at transition | Basal at least 2 h before stopping (2-4 h) | Often 1-2 h | Exactly 2 h (1900 to 2100) | No |
| Hypoglycemia treatment | 15 g fast carbohydrate | 15-20 g, "rule of 15" | 16 g tablets, then 15 g juice | No |

Quick Checks that touch a textbook difference: stop 3 Q3 (K threshold: "continue insulin" is right under both 3.5 and 3.3); stop 4 Q1 (resolution: 1730 passes and 1330 fails under both rules); stop 4 Q2 (overlap: 2 h meets both); stop 6 (15 g vs 15-20 g).

## Scoring guide (20 points, three levels)

Give ONE group score from the packets (group score sheet, next page) plus an individual check (/4) for each of the 7 students. Be generous: complete and thoughtful earns full credit. Quick Checks are scored for completion and correction, never for correctness: a wrong answer that was corrected in a different color earns full credit.

| Category | Full credit | Good | Getting there |
|---|---|---|---|
| Teamwork and charge-nurse rotation  (5) | 5. A charge nurse is named at every stop, everyone was charge nurse once, and each pair reported its findings to the charge nurse. | 3 to 4. The rotation was followed most of the time. Most teammates took part. | 1 to 2. The rotation was skipped, or one person did most of the work. |
| Clinical thinking at each checkpoint  (6) | 6. Pair boxes have chart numbers and a reason at every stop, and every Quick Check is answered and corrected in a different color. Quick Checks count for completion and correction, never for being right. | 4 to 5. Most stops are filled in with numbers; one or two Quick Checks are not corrected. | 1 to 3. Many boxes are blank, or Quick Checks are skipped or not corrected. |
| Safety, priorities and SBAR  (5) | 5. At 1100, 1500, 1900, 2300 and 0300: three priorities in order, a complete SBAR (all four parts) and a next step that keeps Nora safe. | 3 to 4. Most stops have priorities and an SBAR. A part is sometimes missing. | 1 to 2. Priorities or SBAR are missing at many stops. |
| Completeness and reflection  (4) | 4. All boxes tried, the response tracker is filled at every stop, the final evaluation is done, and each person handed in a reflection. | 2 to 3. Most boxes tried. The tracker, the evaluation or a reflection is missing. | 1. Many blanks. Little reflection. |

### How the points add up

| Category | Where the points come from |
|---|---|
| Teamwork and charge-nurse rotation (5) | Charge nurse named for all 7 stops = 2.  Everyone had a turn as charge = 1.  Every pair reported at the checkpoints and the peer checks were handed in = 2. |
| Clinical thinking at each checkpoint (6) | 1 point for each checkpoint 0700 to 0300: half for pair boxes with numbers and a reason, half for the Quick Check answered AND corrected in a different color (a wrong answer that was corrected earns the full half point). |
| Safety, priorities and SBAR (5) | 1 point for each of 1100, 1500, 1900, 2300 and 0300 with 3 priorities and a 4-part SBAR. The 0700 SBAR is a warm-up (not scored). |
| Completeness and reflection (4) | Boxes tried, including the final Quick Check and the final 0700 pages = 2.  Response tracker filled at all 7 stops = 1.  Individual reflections handed in = 1. |

### Examples

| Category | Example of full credit | Example of partial credit |
|---|---|---|
| Clinical thinking (1500) | Results box: "K 5.8, 4.7, 4.1, 3.6 on insulin = shift into cells + urine loss; 3.6 is over 3.5, keep insulin; Mg 1.7 replace; pH 7.32 but BHB 1.3 = not resolved." Quick Check: picked "hang it on a pump", then corrected to "hold and call" in green with the reason. | "K low. Give potassium." (no numbers, no reason): half. Quick Check blank or not corrected: no Quick Check half point. |
| Safety and SBAR (1500) | Priorities: hold the 20 mEq/h order and call; riders 10 mEq/h x 4 with insulin continued; site and urine checks. SBAR with all 4 parts and a clear request. | Hangs the 20 mEq bag, or holds the insulin at K 3.6: 0 for that stop (discuss in the debrief). |
| Safety and SBAR (0300) | "15 g by mouth, recheck in 15 minutes, repeat at 66, snack at 94; no correction insulin; assist to the bathroom; call per protocol." | D50 IV for a patient who can swallow, or the snack at 66. |
| Completeness | Tracker filled at all 7 stops, every Quick Check ticked "corrected", the evaluation table done with arrival and now values and a verdict. | Tracker missing 3 stops: lose the tracker point. |

### Reflection and peer check

- Reflection (4 boxes, including "a Quick Check I got wrong"): 2 points on the individual sheet for honest answers with a reason (1 if thin). It also feeds the group "reflections handed in" point.
- Peer check: 1 point for handing it in. Use it to spot a team where one person did most of the work; read comments privately.
- If the team did not rotate the charge nurse, cap Teamwork at 3 and ask why in the debrief.

## GROUP SCORE SHEET

Team name: ____________  Date: ________

### Checkpoint check (tick what you see)

| Page | Charge nurse named | Pair boxes with numbers | Quick Check done + corrected | 3 priorities | SBAR complete | Tracker column |
|---|---|---|---|---|---|---|
| 0700 (SBAR warm-up) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1100 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1500 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 1900 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2300 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 0300 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Final 0700 | ☐ | ☐ | ☐ | ☐ | ☐ | Evaluation ☐ |

### Rubric

| Category | Full | Good | Getting there | Points | Notes |
|---|---|---|---|---|---|
| Teamwork and charge-nurse rotation (5) | ☐ 5 | ☐ 3-4 | ☐ 1-2 | / 5 |  |
| Clinical thinking at each checkpoint, incl. Quick Checks done and corrected (6) | ☐ 6 | ☐ 4-5 | ☐ 1-3 | / 6 |  |
| Safety, priorities and SBAR (5) | ☐ 5 | ☐ 3-4 | ☐ 1-2 | / 5 |  |
| Completeness and reflection (4) | ☐ 4 | ☐ 2-3 | ☐ 1 | / 4 |  |
| GROUP TOTAL |  |  |  | / 20 |  |

### Individual check (7 students)

| Student | Charge turn (1) | Reflection (2) | Peer check (1) | Individual /4 |
|---|---|---|---|---|
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |
| ________________________ | ☐ | ☐ 2  ☐ 1 | ☐ |  |

## Debrief: back to the seven big ideas (about 10 minutes; pick 5 to 7 questions)

Put the trends on the board first: K 5.8, 4.7, 4.1, 3.6, 3.9, 4.0, 4.1, 4.2; gap 30, 23, 19, 17, 14, 13, 12, 12; BHB 6.8, 5.4, 3.3, 1.3, 0.5, 0.3, 0.3, 0.2; pH 7.14, 7.24, 7.29, 7.32, 7.34; RR 24, 20, 18, 18, 18, 18, 14; bedside glucose 274, 186, 166, 168, 148, 58 (66, 94), 122.

### The seven big ideas (say each one again)

| Stop | Big idea |
|---|---|
| Mon 0700 | DKA cues: Kussmaul is compensation, fruity breath is acetone; fluids first; act on the NEWEST labs (bicarbonate only under pH 7.0). |
| Mon 1100 | Fixed-rate insulin clears ketones; dextrose protects the glucose: "dextrose up, never insulin off". The gap, not the glucose. |
| Mon 1500 | Insulin drives potassium into the cells: know K before insulin, keep insulin at 3.5 or more, peripheral potassium never over 10 mEq/h. |
| Mon 1900 | Resolution = BHB under 0.6 plus pH 7.3 or CO2 18; basal insulin at least 2 hours before the drip stops. |
| Mon 2300 | A new diagnosis is a loss: assess coping and readiness to learn before teaching; include the support person. |
| Tue 0300 | Rule of 15 by mouth, repeated until 70 or more, then a snack; exercise after new basal insulin predicts a night low. |
| Tue 0700 | Teach-back, not "do you understand?": never skip basal insulin when sick; check ketones; medical ID; supplies and follow-up. |

### Questions

| # | Big idea | Question |
|---|---|---|
| 1 | Charge nurse | What did the charge nurse do that helped the team most? What was hard about collecting from each pair and then deciding? |
| 2 | 1. Cues | Which cues in Nora's 6-week history should have sent her to a clinic earlier? Why was her breathing deep and fast with clear lungs and an SpO2 of 99%? |
| 3 | 1. Newest labs | Why was the bicarbonate order wrong, and why did the ED wait for the potassium before starting insulin? |
| 4 | 2. Dextrose | At 1100 her glucose was 186. Why was the insulin still running at 5.5 units/h? What would have happened if it had been stopped? |
| 5 | 3. Potassium | Her K fell from 5.8 to 3.6 while she got potassium. Explain. What are the peripheral potassium rules, and how did the 1420 order break them? |
| 6 | 4. Resolution | At 1330 the pH was 7.32. Why was she not resolved? Why did glargine go in at 1900 and the drip stay on until 2100? |
| 7 | 5. Coping | How did you respond to "I'll never be normal again," and why not teach everything that night? |
| 8 | 6. The low | What caused the 0300 low, which cue predicted it, and why two rounds of 15 g? |
| 9 | 7. Going home | What must be true before she goes home, and how will you know she can do it at 2 a.m. when she is sick? |
| 10 | Quick Checks | Which Quick Check answer surprised you most, and what tempted you toward the wrong one? |

### Ideas for good answers

- Charge nurse: collected from each pair by name, kept time, made sure the tracker column was filled, kept the SBAR short and specific.
- Cues: thirst, urinating, hunger with weight loss (6 kg), fatigue, blurred vision, yeast infections; explained away (gym, stress). A1c 11.6% (eAG 286). Kussmaul breathing = compensation: 0530 pH 7.24, pCO2 22, Winter's 21.8 plus or minus 2. RR fell 24, 20, 18, 14 as the acid cleared.
- Bicarbonate only under pH 7.0; at 7.24 it adds no benefit and lowers K. Insulin pushes K into cells; started with an unknown low K it can cause dysrhythmias (her ED K was 5.8, so insulin could start).
- Insulin clears the ketones (gap 19, BHB 3.3 at 0930); stopping it restarts ketone production. Dextrose protects the glucose. NPO stopped by the order's own criteria; glucose under 250 is not one of them.
- Shift into cells with insulin and the acid clearing, plus urine losses; total-body deficit from the start. Riders 10 mEq/100 mL over 1 h, one at a time, at most 4 in a row, never over 10 mEq/h, urine 28 mL/h or more. Mg 1.7 makes K hard to correct.
- 2024: BHB under 0.6 AND pH 7.3 or more OR CO2 18 or more; at 1330 BHB was 1.3. IV insulin lasts minutes; glargine takes hours: 2-hour overlap (2024: 2-4 h). BHB 0.3 at 2200 and 0200 = no rebound. Look-alike pens: read the label, double check.
- Sit down, acknowledge, open questions, correct misinformation with accurate hope, no false reassurance. Grief and fatigue block learning: safety tonight, survival skills in the morning with her mother. Screen for diabetes distress at follow-up.
- 40 minutes of fast walking after the first glargine, a declined snack, early insulin sensitivity; the 0200 lab glucose 84 was the warning. 66 is still under 70: repeat 15 g; snack only at 70 or more. Endocrinology lowers glargine to 12 units.
- Teach-back and return demonstration (pen with priming and a 10-second hold, meter, rule of 15, glucagon by her mother, sick-day rules with ketones, medical ID), supplies in hand, follow-up booked, a full day without a low. Antibodies on Friday (GAD65 210, IA-2 positive) confirm type 1.
- Quick Checks: the tempting answers are the "obvious" ones (anxiety, the dramatic ED numbers, glucose as the goal, a pump makes it safe, pH alone, "148 is normal", the snack first, skip insulin when not eating, A1c proves the type).

### Instructor only

- On Friday 02/12 the antibodies return GAD65 positive (210 IU/mL, reference under 5) and IA-2 positive; ZnT8 negative: autoimmune type 1 diabetes (stage 3). Use it with Quick Check 7.3.
- Of the 6 kg she lost, about 3.5 kg was water and about 2.5 kg fat and muscle (no insulin = the body burns fat and protein). Weight 55.0 to 56.2 kg by Tue 0600.
- Answer keys live in the public repository (a known risk): do not share this file with students.


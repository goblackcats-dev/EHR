# Instructor Guide: Hypermagnesemia Case Study (CS-HYPERMAG-1)
**Patient: Raymond "Ray" Kessler, 74-year-old man, room 5E-14, Telemetry Step-Down. Tuesday 11/17/2026 0700 to Wednesday 11/18/2026 0700 (24 hours in seven 4-hour checkpoints).**

*Plain-language, printable. Everything here matches the EHR chart in `patient.json` (built from `DESIGN.md`). Page breaks fall before each checkpoint if you print.*

---

## 1. At a glance (one page)

**The story in four sentences.** Ray has kidney disease (CKD stage 4) and got dehydrated after 4 days of vomiting while taking lisinopril, a water pill and ibuprofen. For weeks he also took milk of magnesia, a magnesium antacid and magnesium oxide pills, and his kidneys could not get rid of the magnesium. He arrives sleepy and slow (heart rate 52, blood pressure 96/56, weak reflexes). The magnesium keeps rising, he stops breathing well at 1100, and he needs emergent dialysis at 1500; then he gets low blood sugar after dialysis, the magnesium "rebounds" overnight with confusion and constipation, and he recovers by morning.

**What students do:** they are the day RN (0700-1900) and then the night RN (1900-0700). At each checkpoint you set the bedside monitor, portray the patient, release the chart changes with the clock, and watch their priorities.

| Checkpoint | One-line theme | Mg released at that time |
|---|---|---|
| **0700** | Arrival: recognize magnesium toxicity, find the OTC products | 7.8 (ED) |
| **1100** | Deterioration: RR 10, no reflexes, HR 44. Call for help, calcium gluconate | 8.7 |
| **1500** | Crisis: Mg 10.9, emergent hemodialysis | 9.5, **10.9** |
| **1900** | After dialysis: Mg 4.6, but low glucose 54 and low calcium | 7.2, **4.6** |
| **2300** | Rebound begins, delirium at night, safe sleep (no sedatives) | 5.6 |
| **0300** | Rebound 6.4, constipation, do NOT give milk of magnesia | **6.4** |
| **0700** | Recovery, teaching and discharge planning | 5.3 |

**Normal magnesium: 1.7-2.2 mg/dL** (= 0.7-0.9 mmol/L = 1.4-1.8 mEq/L). Critical: over 5.0 mg/dL in this lab. Ray's 7.8 mg/dL = 6.4 mEq/L.

---

## 2. Purpose and learning objectives

**Purpose.** A realistic, complicated patient with several problems at once (kidney injury, heart failure, diabetes, slow heart rate, sleepiness, constipation) so students practice **prioritizing**, **recognizing a deteriorating patient early**, **safe high-alert medication care**, **SBAR calls**, and **teaching** in one 24-hour story. It ends in a structured debrief.

**By the end, the student will be able to:**
1. Recognize hypermagnesemia and the signs by level: nausea, flushing, drowsiness, weak then **absent deep tendon reflexes**, low blood pressure, slow heart rate and ECG changes (long PR, wide QRS), and finally **slow breathing and heart block**.
2. Name the people at highest risk: kidney failure plus magnesium laxatives, antacids or supplements (also older adults, constipation, bowel obstruction/ileus, IV magnesium in obstetrics).
3. Take a complete medication history **including over-the-counter** products and ask the family to bring bottles.
4. Prioritize with the ABCs: airway/breathing (RR, EtCO2), heart (monitor, ECG, pacing pads), then antidote, then removal of the cause.
5. Give **IV calcium gluconate** safely (monitor, large vein, slow, check the site) and explain that it **protects** but does **not lower** magnesium.
6. Explain why **hemodialysis** is needed when kidneys cannot clear magnesium, and give safe nursing care before, during and after dialysis (consent, BP, glucose, calcium, rebound).
7. Use SBAR and the rapid response team early.
8. Prevent harm: no magnesium or phosphate laxatives/antacids/enemas, no sedatives, safe fluids in heart failure, safe insulin in kidney failure, fall and delirium precautions, CAUTI bundle.
9. Teach safe alternatives for heartburn, constipation, leg cramps and pain, with teach-back.

**NCLEX-style items this case supports:** safety and infection control; management of care (delegation, prioritization); pharmacological therapies (high-alert medications, antidotes); reduction of risk potential (lab values, diagnostic tests, potential for complications); physiological adaptation (fluid and electrolyte imbalances, medical emergencies). See the three sample NCLEX-style questions in Section 8.

---

## 3. Setup

**Time needed.** About 25 minutes per checkpoint x 7 = 3 hours with breaks, or run Checkpoints 1100, 1500, 1900 only in a short class (about 90 minutes) and read the summaries for the rest. Plan **40-45 minutes for the debrief**.

**People.** Instructor (portrays the patient's voice and any provider on the phone, sets the monitor). Optional second faculty or a strong student as the "provider" and the "wife". Groups of 3-4 students: primary RN, second RN/recorder, "charge nurse/phone caller", observer (uses the debrief checklist in Section 7).

**Patient identification.**
- Wristband: **KESSLER, RAYMOND**, DOB **04/22/1952**, MRN **SIM-40318**, **Allergy: PENICILLIN (rash)**, Full Code, Fall risk band.
- Room sign: 5E-14. "NO MAGNESIUM" sticker is **not** placed at the start (students add it when they discover the problem).

**Equipment.** Manikin or standardized patient in a bed (head of bed at 30 degrees), bedside monitor (set per checkpoint), telemetry/ECG leads, blood pressure cuff, pulse oximeter, thermometer, reflex hammer, stethoscope, glucometer and strips, IV pump with tubing and saline bags, saline flushes, calcium gluconate vials/labels (training stock), IV pole, Foley bag with a labeled urine bottle ("amber" water for urine output), suction, bag-valve-mask, oxygen with nasal cannula, **pacing pads in a package** (do not apply unless indicated), 4 oz apple juice cups, glucose tablets, a paper bag with **four empty or relabeled bottles** (milk of magnesia, Maalox-type antacid, magnesium oxide 400 mg, ibuprofen 200 mg) and a Foley bag. Optional: a small whiteboard for the I&O.

**Manikin / monitor notes.**
- Set the rhythm: "sinus bradycardia" (add "first-degree AV block, PR 0.26" if your simulator lets you; otherwise tell students "the monitor strip shows a long PR"). At 1500 the QRS is wide.
- If the manikin cannot show reflexes, use a **reflex card**: patellar 1+ (0700), **0 (1100, 1500)**, 1+ (1900, 2300, 0300), 2+ (0700 next day). The same for biceps and grip strength (card: "weak, 4-/5" at 0700; "cannot lift hand" at 1100-1500).
- If you cannot show urine output, read it aloud ("Foley bag: 40 mL since the last hour").
- The patient is NPO. No real oral medications; use pretend or placebos.

**Preload the EHR (before students arrive).**
1. Open the EHR: **Pre-Built Patients > Case Study Patients > Raymond Kessler**. (Or Tools > Import JSON with `casestudy/cases/hypermag/patient.json`.)
2. Confirm the clock reads **Tue 07:00** and that students see only the ED vitals and the 0700 set (no later vitals), the ED labs (Mg 7.8) and notes up to the 0655 handoff.
3. Time control: **4h ▶** moves to the next checkpoint. For smaller steps (events inside a 4-hour block) use **1h ▶** or **Next event** (see the release schedule in Section 5). Labs appear automatically at their result time.
4. Give students the **Student Packet** (vitals grid and prompts, no answers).

**Vitals rule.** *There are no vitals in the chart after 0700.* At each checkpoint you set the monitor to the values below, students take their own set, and chart it. The 0700 set is already in the chart (arrival set); have them confirm it.

---

## 4. Checkpoint script

Each checkpoint has: (A) what happened since the last one (read aloud), (B) **exact monitor settings**, (C) what the patient says and what the exam shows, (D) what appears in the chart, (E) expected student actions, (F) prompts if missed.

> **Hourly urine output (Foley)** is given by hour in the I&O blocks of the chart and below. Read it when students check the bag.

### CHECKPOINT 1: Tuesday 0700 (arrival and handoff)

**(A) Read aloud.** "It is 0700. Ray Kessler, 74, arrived on your unit from the ED at 0650. He has kidney disease, diabetes and a weak heart. He had 4 days of vomiting and was hard to wake this morning. His magnesium is 7.8 and his creatinine is 4.9. In the ED he got calcium gluconate, a bag of saline, and a Foley. His wife is at the bedside with a bag of bottles from home."

**(B) Monitor (this set is also in the chart).**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 97.6 F oral | **52** | **96/56** (69) | 14 | 94% room air | 2/10 low back | Sinus bradycardia + first-degree AV block (PR 0.26 s) | 132 (if rechecked) |

**(C) Bedside.**
- LOC: drowsy, wakes to voice, falls asleep when you stop talking (RASS -1). Slow, slightly slurred speech; oriented to person and place, not the date.
- Patient says: *"I'm just so tired. My stomach feels sick. Can I have something for my heartburn? I take the pink stuff."*
- Exam: face and chest flushed and warm, dry mouth, skin tents 3 seconds. Lungs clear. Abdomen soft, mildly distended, bowel sounds hypoactive. **Patellar and biceps reflexes 1+** (diminished). Weak grip. Foley: dark amber urine, 40 mL last hour (hourly plan: 35 mL 0700-0800).
- Wife (Eleanor, health care proxy) answers only when asked well: *"He takes his regular pills. He's been taking Milk of Magnesia, I think 3 or 4 times a day, because of the constipation from his back pills. And the Maalox, a lot of it this week. And magnesium pills for his leg cramps, a friend told him. And ibuprofen for his back. I brought the bottles."* **She does NOT volunteer this unless the student asks about over-the-counter products, laxatives, antacids or supplements, or asks to see the bag.**

**(D) Chart already shows.** ED provider note, H&P, ED nursing notes, ED handoff (the handoff says the bag has NOT been reviewed), ED labs (Mg 7.8 critical, K 5.4, creatinine 4.9, eGFR 12, BUN 84, CO2 17, Ca 8.1), ECG (PR 248 ms, QRS 124 ms), CXR, baseline PCP labs from 10/20 (Mg 2.4, creatinine 2.6), vitals through 0700, baseline assessment, orders (admission order set) and MAR (second NS bolus 0715, NS 100 mL/h 0815, furosemide 80 mg IV 0915, calcium gluconate PRN, correction insulin, held home meds).
**Appears by the next checkpoint (0750-1030):** pharmacy note and OTC discontinuation orders (0750), hospitalist note (0845), 0900 labs (Mg 8.7), FENa, renal ultrasound.

**(E) Expected student actions (priorities).**
1. **Safety/ABC first:** RR, breathing effort, LOC, airway (HOB 30, suction at bedside, keep NPO). Check the **swallow screen order before anything by mouth**.
2. **Cardiac monitor** on, interpret the rhythm (brady with long PR), know the pacing pad location, compare with the ECG.
3. **Neuro/neuromuscular check:** reflexes, grip, LOC. Chart baseline (the chart baseline says 1+).
4. **Ask about the OTC products** and **review the bag**: milk of magnesia, Maalox-type antacid, magnesium oxide, ibuprofen. Tell the provider and pharmacy. **Stop all magnesium sources**. Put "no magnesium" on the chart/precaution.
5. **Verify held home meds** (lisinopril, metoprolol, furosemide PO, gabapentin, oxycodone, glargine) and that none is given.
6. Fluids safely: lung sounds, SpO2, JVD before and after the 0715 bolus (HFpEF). Hourly urine output; weight 88.0 kg.
7. Check the **IV site on the 18 g right antecubital** (for calcium) and have calcium gluconate and pacing pads located.
8. Glucose check (4-hour order) and know that insulin is held except for the correction scale.
9. Notify the provider of the OTC findings (SBAR). Update the wife.

**(F) If students miss it, prompt with:**
- No OTC question: wife says, *"Should I show you what's in the bag?"* or the pharmacist walks in with the bag at 0750.
- Reflexes not checked: "The physician note says 'diminished reflexes.' What would a nurse check at the bedside to follow this?"
- Lung check skipped before the bolus: "He has heart failure. How will you know if the fluid is too much?"
- Home meds given at 0900: "Read the hold parameters. What is his potassium, creatinine, heart rate and blood pressure?"
- Oral meds/ice chips without a swallow screen: "What does the order say?"

---

### CHECKPOINT 2: Tuesday 1100 (deterioration; rapid response)

**(A) Read aloud.** "It's 1100. Since 0700 he got another bolus of saline, a loop diuretic at 0915 (urine only went to 55 mL/h for one hour), and the pharmacist found the bottles. The 0900 labs came back: magnesium 8.7, up from 7.8. The wife has stepped out to call the daughter. You walk in to check him."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 97.4 F | **44** | **84/48** (60) | **10, shallow** | **91% room air** (94% on 3 L NC after oxygen) | 0/10 ("no") | Sinus bradycardia, long PR (PR 0.30 s) | 104 |

**(C) Bedside.**
- LOC: very sleepy, rouses only to a loud voice, falls back asleep mid-sentence (RASS -2). Oriented to name only.
- Patient (mumbling, slow): *"I... can't... keep my eyes open. Legs feel like lead."*
- **Deep tendon reflexes ABSENT** (patellar and biceps 0). Can barely lift legs off the bed, grip very weak. Skin flushed, warm.
- Breathing: shallow, slow, no distress. Lungs clear. Pupils 3 mm, reactive (not an opioid picture; none since Monday).
- Foley: dark amber, 20 mL in the last hour (hourly 0700-1100: 35, 30, 55, 40 mL; total 160 mL).
- Intake since 0700: 800 mL IV.

**(D) Chart appears by now (before 1100):** pharmacy note 0750 (the OTC products), hospitalist notes 0845 and 1030, **0900 labs: Mg 8.7**, K 5.3, creatinine 4.8, BUN 82, Ca 8.7, glucose 122, FENa 0.6% (prerenal), renal ultrasound (no obstruction), 0700-1100 I&O block (in 800 / out 160).
**Appears after the students act (1115-1200):** RRT note 1140, hospitalist event note 1155, calcium gluconate 1 g order (1115), NS 250 mL, oxygen 2-4 L, atropine PRN, pacing pads, q15-minute vitals, STAT labs (Mg 9.5 at 1200; ABG 7.24/46 at 1145; ECG 1140 PR 300, QRS 136), nephrology called 1130.

**(E) Expected student actions.**
1. **Recognize deterioration: RR 10, HR 44, BP 84/48, SpO2 91%, reflexes lost, less alert. Call the rapid response team** (and stay with the patient). Do not wait to finish the other tasks.
2. **Airway and breathing:** HOB up, stimulate, **oxygen** (but understand that oxygen does not fix slow breathing), suction, bag-valve-mask ready, continuous SpO2 and capnography (EtCO2). Strict NPO.
3. **Heart:** keep on telemetry, 12-lead ECG, **pacing pads on**, atropine order is the back-up (**calcium is first line**).
4. **Calcium gluconate 1 g IV over 10 minutes** per the PRN order / RRT order: right antecubital 18 g, check the IV site and blood return **before** and during, on the monitor, check BP/HR/rhythm every few minutes, do not mix with other drugs in the line.
5. **Stop** everything that worsens the problem: **no sedatives or opioids**; keep all magnesium out; hold the maintenance saline until the team decides (small 250 mL bolus only, lungs clear).
6. **SBAR** to the hospitalist/RRT (example in Section 6), stat labs (Mg, BMP, ABG), nephrology urgent call, ICU outreach.
7. **Vitals q15 minutes**, hourly urine output (20 mL/h is low: call).
8. Update the wife and document.

**(F) Prompts if missed.**
- No call after 1 minute: instructor (as the charge nurse): "What is his respiratory rate? What would the rapid response criteria say?"
- Only oxygen applied: "SpO2 is 94% on 3 L. His RR is still 10 and EtCO2 is rising. What is the problem?"
- Calcium given fast or without a monitor: "Which rate? Where is your cardiac monitor? What would you look at on the IV site?"
- Sedative or opioid considered for "comfort": "He is already 'sedated' by what?" and "Which ordered drugs would worsen breathing?"
- Wants to run the NS 100 mL/h faster: "He has heart failure and urine of 20 mL/h. Which numbers worry you?"
- If students give calcium and HR/BP improve slightly (HR 48, BP 90/52), tell them it lasts only 30-60 minutes: "What is the plan after that?"

---

### CHECKPOINT 3: Tuesday 1500 (emergent hemodialysis)

**(A) Read aloud.** "It's 1500. Since 1100: the rapid response team came; he got calcium gluconate 1 g at 1120; nephrology came at 1215 and gave 2 g more at 1235 plus 160 mg furosemide; urine only 70 mL in 4 hours. At 1400 the lab called: **magnesium 10.9**, potassium 5.8, creatinine 5.3. Heart rate dropped to 38 and the QRS got wider on the 1330 ECG. Dr. Raman decided on **emergent dialysis**; the wife consented by phone at 1350 with two nurses; the dialysis catheter went into the right neck at 1440 and the x-ray is clear. Dialysis starts now. ICU outreach says he can stay here with 1:1 nursing."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | EtCO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|---|
| 97.2 F | **46** | **88/50** (63) | **9** | **92% on 4 L NC** | 52 mmHg | CPOT 0 (cannot report) | Sinus bradycardia 46, long PR (0.32 s), **wide QRS (0.14 s)**, tall T waves | 88 |

**(C) Bedside.**
- LOC: responds to loud voice only, opens eyes briefly (RASS -3). Cannot follow commands reliably. Airway intact, gag present, protecting the airway at the moment.
- **Reflexes absent**, flaccid weakness (cannot lift a hand off the bed). Breathing shallow, 9 per minute.
- New **fine crackles at both bases**, trace ankle edema, JVD flat to mildly up (net positive about 1.4 L since 0700; chest x-ray 1445: mild interstitial prominence).
- Foley: 10 mL in the last hour (1100-1500 hourly: 20, 25, 15, 10 mL; total 70).
- Dialysis RN (Whitaker) is at the bedside; right IJ catheter dressing dry, no bleeding. The dialysis nurse says: *"Please keep your calcium on the cart and tell me the blood pressure every 15 minutes."*

**(D) Chart appears by now (up to 1500):** 1115 STAT labs (**Mg 9.5**, K 5.6, Cr 5.0), ABG 1130 (7.24/46/72), ECG 1130, **1315 labs (Mg 10.9, K 5.8, Cr 5.3, BUN 88, CO2 16, Ca 8.3)**, ABG 1415 (**7.20/52/68**), ECG 1330 (HR 38, PR 320, QRS 148, peaked T), nephrology consult (1240) and HD decision note (1355), ICU outreach note (1435), procedure note (1450), chest x-ray (1455), orders (HD, calcium gluconate 2 g at 1400, stop NS at 1415, furosemide 160 mg 1230), dialysis catheter device, O2 device, I&O 1100-1500 (in 845 / out 70).

**(E) Expected student actions.**
1. **Keep airway and breathing first:** RR, EtCO2, SpO2, HOB 30-45 degrees, suction, bag-valve-mask and airway cart in the room. Know the ICU outreach criteria: **RR under 8, PaCO2 over 60, decline in alertness, SpO2 under 90% on 6 L.** Call if reached.
2. **Calcium gluconate** per order (2 g over 20 minutes at 1400; check the site) and the PRN for HR under 40 / QRS wider; continuous monitor.
3. **Verify consent** (wife is health care proxy, phone consent 1350, two witnesses), **time-out** and ID bands; check the chest x-ray was read before the catheter is used.
4. **Dialysis catheter care:** for dialysis staff only; no flushing, no blood draws, no infusions; dressing dry; watch for bleeding, redness. Hold all BP medicines.
5. **During HD:** BP and HR every 15 minutes (nurse and dialysis RN), report **hypotension**, keep Trendelenburg/fluids ready per protocol, watch rhythm. Check lung sounds (fluid overload) and keep NPO.
6. **Stop NS maintenance** (done at 1415) and keep strict I&O (urine 10 mL/h: report).
7. **Call and update the family:** the wife is at the bedside or on the phone; the daughter is coming.
8. Glucose: POC 88 (trending down: 132, 104, 88). Do not give any basal or correction insulin; **call about the trend**.

**(F) Prompts if missed.**
- Students treat the crackles with more fluid or ignore them: "Which lab and the 1445 x-ray comment explain the crackles?"
- Not checking consent: "Who consented? Who can consent for a patient who cannot answer?"
- Forgetting the glucose: "His morning glucose was 132, now 88; what is his food intake? What insulin is still on his MAR?"
- Using the dialysis line for an IV push: "Who may use the line?"
- Not recognizing the "I'm about to need airway support" threshold: "What numbers would make you call ICU now?"

---

### CHECKPOINT 4: Tuesday 1900 (after dialysis; hypoglycemia and low calcium)

**(A) Read aloud.** "It's 1900. Dialysis ran 1500-1800 and he took out 500 mL of fluid. At 1630 his BP dropped to 82/46; the dialysis nurse gave 250 mL saline and slowed the machine. By 1700 his magnesium was down to **7.2**, and after dialysis at 1800, **4.6**. He is awake and breathing 16 times a minute. You have just been given the 1850 lab result. It's time for the 1900 check; the night nurse is arriving."

**(B) Monitor (set at 1900), then change for the glucose event.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm |
|---|---|---|---|---|---|---|
| 97.6 F | **66** | **104/60** (75) | 16 | **96% room air** (oxygen removed 1830) | 3/10 (back and neck catheter site) | Normal sinus rhythm 66, PR 0.20 s |

**POC glucose at 1905 (when they check): 54 mg/dL.** While he is low, tell students: HR 78, BP 100/58, RR 16 and SpO2 96%.
After first 15 g carbohydrate: **15 minutes: 68**. After the second 15 g: **15 minutes: 84**. Then a snack. (D10W 40 mL/h starts at 1930: then hourly checks 1 hour later 98, 2 hours 106.)

**(C) Bedside.**
- LOC: awake, oriented to person, place and time, a little tired. Speech clear.
- Reflexes **returning (patellar 1+, biceps 1+)**, grip stronger.
- **Hypoglycemia picture (1905):** *"I feel shaky... I'm sweating... I feel funny around my mouth and my hands tingle."* Skin cool and damp, tremor. (Tingling around the mouth and hands also fits the low calcium.)
- Swallow: he sips water without coughing if the student does the bedside screen (passes). He is **not** nauseated any more.
- Foley: 20 mL in the last hour (1500-1900 hourly 15, 20, 20, 20). Dialysis catheter site dry.
- Wife has gone to get dinner; she will return at 2000.

**(D) Chart appears by now:** mid-dialysis labs **1700 (Mg 7.2, K 4.4, glucose 71)**, **post-dialysis 1800 (Mg 4.6, K 3.9, Cr 3.0, Ca 7.7, ionized Ca 1.02, phos 3.3)**, ECG 1830 (sinus 66, PR 204, QRS 108, **QTc 486**), HD nursing note (1855), nephrology note (1850), I&O 1500-1900 (in 450 / out 575 with 500 mL ultrafiltration), O2 removed 1830, post-dialysis orders (vitals/glucose q15 minutes x4, Mg q4h).
**Appears after students act (1915-1940):** hospitalist hypoglycemia note (1940), D10W 40 mL/h until 0130, hourly glucose, renal diet with 1,200 mL fluid restriction.

**(E) Expected student actions.**
1. **Trend the data:** glucose has fallen 148, 122, 108, 96, **71 (1700)** with **no insulin given**. Insulin lasts longer in kidney failure (and he took glargine 22 units on Monday). Lab glucose of 71 at 1700 was the warning.
2. **Treat low glucose per the nurse-driven protocol:** confirm with the glucometer, **swallow screen**, then **15 g carbohydrate by mouth** (glucose tablets or **apple juice 4 oz; NOT orange juice because of his potassium**), recheck in 15 minutes, repeat if under 70, then a snack. If he cannot swallow or is not alert: **D50 25 g IV** via the 18 g right antecubital.
3. **Call the provider** with SBAR (example below), request D10W and a plan for insulin (hold correction insulin if under 100).
4. **Dialysis recovery checks:** BP, HR, rhythm, RR, reflexes, LOC every 15 minutes x4. Dialysis catheter dressing and bleeding.
5. **Watch calcium:** tingling around the mouth, cramps, QTc 486: report; no calcium needed unless symptomatic or QTc over 500 (per nephrology).
6. **Expect rebound:** magnesium is 4.6 but will rise over 4-8 hours; keep the 2100 level, keep reflex and RR checks.
7. **Handoff to the night nurse** (SBAR with: hypoglycemia, dialysis catheter, calcium, rebound, bowel plan).

**(F) Prompts if missed.**
- Orange juice: "What is his potassium? Which juice is lower in potassium?" (apple, cranberry, grape).
- Glucose rechecked too late: "How soon do you recheck after 15 g?" (15 minutes).
- No swallow screen: "Is he safe to swallow? What would you do if he were not?" (IV dextrose).
- Calling only after the second treatment: "Who needs to know about a low glucose in a kidney patient who took long-acting insulin?"
- Didn't notice the 1700 lab: "Look at the glucose trend."

---

### CHECKPOINT 5: Tuesday 2300 (rebound begins; delirium; safe sleep)

**(A) Read aloud.** "It's 2300. D10W has been running since 1930 at 40 mL/h; glucose has been 98, 106, then 118. At 2100 his magnesium was **5.6** (up from 4.6 after dialysis) and calcium 7.9 (ionized 1.06). The wife went home at 2100. Since 2230 he has been restless."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.2 F | **62** | **112/64** (80) | 16 | 96% room air | 3/10 (back) | Sinus rhythm 62, PR 0.22 s | 118 |

**(C) Bedside.**
- **Delirium:** awake, restless, confused, picking at the Foley and the neck dressing, tries to get out of bed, thinks it is a work day at the machine shop (CAM positive: acute change, inattention, disorganized thinking, altered level). He can be briefly redirected.
- Patient: *"I've got to get to the shop. Get these things off me! Where is Eleanor?"*
- Reflexes 1+ (still diminished). Not in respiratory distress. No pain except "my back."
- Foley: 55 mL/h (hourly 1900-2300: 45, 50, 55, 60; total 210). Lungs: fine crackles at the bases are clearing.
- Glucose is NOT low (118). Check pain, bladder (Foley kinked? Draining), bowel, oxygen, medications.
- **The order set has "diphenhydramine 25 mg at bedtime PRN for sleep."** The covering provider (if called) says: *"Is the diphenhydramine order active? Don't give it. Try non-drug measures; I can add melatonin."*

**(D) Chart appears by now:** 2100 labs (Mg 5.6, K 4.3, Cr 3.4, BUN 40, Ca 7.9, iCa 1.06, glucose 118), hospitalist hypoglycemia note (1940), D10W order, renal diet, PEG and senna orders (2130, due 2200), I&O 1900-2300 (in 500 / out 210).
**Appears after students act (2310-2330):** delirium-precaution order, melatonin PRN, night hospitalist note (2330).

**(E) Expected student actions.**
1. **Look for reversible causes of delirium:** glucose (now 118), pain, full bladder or kinked Foley, constipation, oxygen, new medications, sleep, and the **magnesium and calcium trend** (Mg rising again).
2. **Safety first:** bed low, bed alarm, call light, mittens only if absolutely needed (avoid restraints), protect the Foley and the dialysis catheter (cover/secure; do not let him pull it), **1:1 sitter or frequent rounding**, lights low, family (call the wife, ask her to come back or stay on the phone), glasses/hearing aids if used.
3. **Do not give diphenhydramine, benzodiazepines, zolpidem or opioids** (anticholinergic and CNS-depressant; also can mask the breathing and reflex checks). **Ask the provider to discontinue the sleep-aid order-set item.**
4. **Non-drug sleep plan:** reorientation, toileting, quiet, warm blanket, pain control with acetaminophen if pain, cluster care; **melatonin** if ordered.
5. **Keep monitoring RR, reflexes and rhythm** (delirium can hide early respiratory depression). Check the 0100 Mg is drawn.
6. **Start the bowel regimen** (PEG 17 g at 2200 and senna): **no magnesium or phosphate products.**
7. Hourly glucose and I&O, daily weight due 0600.
8. SBAR to the night hospitalist about the new confusion (example below).

**(F) Prompts if missed.**
- Reaches for the sleep aid: "Read the drug class. What does it do to a patient with a magnesium level of 5.6 and an age of 74?"
- Wants restraints: "What is the least restrictive option? Who could sit with him?"
- Doesn't think magnesium: "Which lab is rising again?"
- Forgot the bowel regimen: "When was his last stool? What is the order?"

---

### CHECKPOINT 6: Wednesday 0300 (rebound peak; constipation)

**(A) Read aloud.** "It's 0300. He slept a little. The 0100 magnesium came back **6.4** (4.6 after dialysis, 5.6 at 2100): this is a **rebound**. Calcium 8.1, ionized 1.08. He has had no stool for 4 days. The D10W stopped at 0130 and glucose is 126. His abdomen looks full."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.0 F | **56** | **104/60** (75) | **12** | 95% room air (drops to 93% only if asleep and not stimulated) | 4/10 abdomen ("full, gassy") | Sinus rhythm 56, PR 0.24 s (long again) | 126 |

**(C) Bedside.**
- LOC: drowsy but wakes to voice, oriented to person and place, no longer agitated, **CAM negative**. Speech slow.
- Patient: *"My belly is so full. I haven't gone in days. Can I take something? At home I take the pink milk."* (Cue to catch the milk of magnesia.)
- **Reflexes 1+ (diminished again).** Weak but lifts arms.
- Abdomen: **distended, firm but not rigid, bowel sounds hypoactive**, mild diffuse tenderness, no guarding.
- Foley: 40 mL/h (2300-0300 hourly 55, 50, 45, 40; total 190); intake 300.
- Weight and lung exam: fine crackles bases (mild).
- **The nurse-driven bowel protocol on the order list ends with "milk of magnesia 30 mL if no BM in 72 hours."** The patient asks for it. If the student calls, the provider says: *"Good catch: do NOT give it. Discontinue the bowel protocol. Give bisacodyl 10 mg suppository. Get a KUB. No Fleet or magnesium enemas."*

**(D) Chart appears by now:** 0100 labs (**Mg 6.4**, K 4.5, Ca 8.1, iCa 1.08, Cr 3.5), ECG 0230 (HR 54, PR 236, QRS 114), night hospitalist note (2330), I&O 2300-0300 (in 300 / out 190).
**Appears after students act (0245-0345):** bisacodyl 10 mg PR (0300), KUB order, ECG order, hospitalist note 0320 (rebound plan; nephrology called 0310: no dialysis unless Mg over 7 or reflex/RR drop), KUB result 0345 (moderate-large stool, no obstruction), bowel protocol and diphenhydramine discontinued 0330.

**(E) Expected student actions.**
1. **Recognize rebound:** Mg 4.6 > 5.6 > 6.4. Rising again; reflexes and RR drifting (12, reflexes 1+). **Call the provider/nephrology with SBAR** before it reaches symptoms (example below).
2. **Do not give milk of magnesia.** Recognize the nurse-driven protocol as the hidden hazard; ask for it to be removed. **No Fleet (sodium phosphate) enema** in kidney failure; no magnesium citrate, no Epsom salt.
3. **Bowel plan:** bisacodyl suppository (after the order), polyethylene glycol (MiraLAX) already ordered, mobilize as safe, abdominal assessment (distention, bowel sounds, pain), KUB. Why constipation matters: **unabsorbed magnesium in the bowel keeps getting absorbed.**
4. **Reassess breathing, reflexes, rhythm hourly** until the 0500 Mg. Rapid response if RR under 10, HR under 45, SBP under 90, reflexes lost, or sleepier.
5. **Calcium gluconate** only if symptomatic or QTc over 500 (per nephrology note), ready on the unit.
6. Keep the delirium and fall precautions; hourly urine; start thinking about the **Foley indication** (is hourly output still needed?).
7. **Document the stool** (character, amount) and I&O.

**(F) Prompts if missed.**
- Gives the protocol: "Read every ingredient of the protocol. Which step has magnesium?"
- Doesn't trend Mg: "Line up the last three levels."
- Skips KUB or abdominal exam: "He asked for a laxative. What is his abdomen like? What could be going on?"
- Doesn't call: "Who needs to know the magnesium is rising again?"

---

### CHECKPOINT 7: Wednesday 0700 (recovery, teaching, discharge planning)

**(A) Read aloud.** "It's 0700. After the bisacodyl he had a large stool at 0345 and slept. The 0500 magnesium is **5.3** (down from 6.4); creatinine is 3.3 (was 5.3). Urine has recovered to 85 mL/h. Weight is 90.0 kg (88.0 on arrival). Dr. Raman says no more dialysis; the dialysis catheter stays for 24 hours in case of rebound; the Foley can come out; he will get furosemide at 0800 for the extra fluid. The case manager, dietitian and pharmacist are coming."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.0 F | **68** | **124/70** (88) | 16 | 96% room air | 2/10 back | Sinus rhythm 68, PR 0.20 s (ECG 0600 normal) | 112 (fasting) |

Weight (bed scale) **90.0 kg**.

**(C) Bedside.**
- LOC: awake, alert, oriented x4, CAM negative, speaks in full sentences, eager to talk. *"I feel so much better. I want a cup of coffee. I didn't know all those pills were a problem."*
- Reflexes **2+ (normal)**, grip strong, can sit at the edge of the bed with assist.
- Lungs: fine crackles at both bases, trace ankle edema, JVD mildly up (fluid positive about 2 L).
- Abdomen soft, bowel sounds active, passing gas. Foley: 85 mL last hour (0300-0700 hourly 55, 65, 75, 85; total 280). Dialysis catheter site clean and dry.
- Wife has returned: *"What do I do with all those bottles at home? He gets so constipated from his back medicine."*

**(D) Chart appears by now:** 0500 labs (Mg 5.3, K 4.3, Cr 3.3, BUN 42, Ca 8.4, albumin 3.1, Hgb 9.6), ECG 0600, KUB (0345), nephrology note (0645), pharmacy teaching plan (0640), dietitian (0655), case management (0658), orders: furosemide 80 mg IV at 0800, remove Foley (0650), case management/dietitian/PT consults, I&O 0300-0700.

**(E) Expected student actions.**
1. **Reassess and trend:** Mg 4.6, 5.6, 6.4, 5.3 and creatinine; correlate with reflexes, RR, rhythm.
2. **Foley removal (CAUTI bundle):** order is present; remove, record time, bladder scan if no void in 6 hours, toileting plan, fall precautions when standing.
3. **Fluid status:** crackles, weight +2 kg, fluid restriction 1,200 mL, furosemide 0800.
4. **Safe discharge teaching (teach-back with patient and wife):**
   - **Never take** magnesium products: milk of magnesia, magnesium hydroxide, Maalox/Mylanta/Gelusil-type antacids, magnesium oxide/citrate/sulfate (Epsom salt), some "cramp" and "digestive" products. **Read the active ingredient.**
   - No NSAIDs (ibuprofen, naproxen); acetaminophen for pain.
   - Constipation: polyethylene glycol (MiraLAX), senna, docusate; fluids per the renal diet; fiber and walking. **No Fleet (phosphate) enemas.**
   - Heartburn: pantoprazole as prescribed; ask before any antacid.
   - **Sick-day rule:** with vomiting or poor intake, call before taking lisinopril, water pills, or insulin.
   - Insulin: lower dose after discharge, glucose checks, low glucose treatment (not orange juice).
   - Bring every bottle, including OTC, to every visit; tell every clinician "I have kidney disease."
   - Warning signs to call or return: extreme sleepiness, slow breathing, weakness, fainting, vomiting, very little urine.
5. **Medication reconciliation** with the pharmacist: what stays on hold (lisinopril, metoprolol, gabapentin dose, furosemide dose, oxycodone, glargine dose), what stops (all Mg products, NSAIDs).
6. **Handoff** to the day nurse with SBAR (example below).
7. Referrals: nephrology (first visit in 1 week), PCP, home health, case management.

**(F) Prompts if missed.**
- No teach-back: "How will you know she understood? What will you ask the wife to do with the bottles at home?"
- Gives generic "avoid antacids": "Which active ingredient is the one to avoid? What can he use?"
- Doesn't recheck the Foley need: "Is there still a reason for the catheter? What does the order say?"

---

## 5. Release schedule for smaller time steps (use 1h ▶ or Next event)

| Time | What appears in the chart |
|---|---|
| 0715 | NS 500 mL bolus due (MAR) |
| 0750 | Pharmacy note; OTC products discontinued (orders); sticky note "Home products found" |
| 0815 | NS 100 mL/h due |
| 0830-0845 | Nephrology (routine) consult, renal US, urine Na/Cr ordered; hospitalist note 0845 |
| 0915 | Furosemide 80 mg IV due |
| 0950 | 0900 labs: Mg 8.7, K 5.3, Cr 4.8 |
| 1000 | FENa 0.6% |
| 1015 | Renal US result; 1030 hospitalist note |
| 1115-1120 | RRT orders (calcium gluconate 1 g, NS 250, oxygen, atropine PRN, vitals q15, STAT labs) |
| 1140-1155 | ECG (PR 300, QRS 136); ABG 7.24/46 (1145); RRT note 1140; hospitalist note 1155 |
| 1200 | STAT labs: Mg 9.5, K 5.6, Cr 5.0 |
| 1215-1240 | Nephrology orders (furosemide 160 mg 1230, calcium 2 g 1235); consult note 1240 |
| 1335-1400 | ECG 1330 (HR 38, QRS 148); 1315 labs: **Mg 10.9** (1400); calcium 2 g due 1400 |
| 1350-1355 | HD orders, consent; nephrology decision note |
| 1415 | NS maintenance stopped; ABG 7.20/52 (1430) |
| 1435-1455 | ICU outreach note; catheter placed 1440 (device appears 1440); procedure note 1450; CXR 1455 |
| 1500-1800 | Hemodialysis (HD nurse gives 250 mL saline at 1630) |
| 1745 | 1700 labs: Mg 7.2, glucose 71 |
| 1830-1855 | O2 removed 1830; ECG 1830 (QTc 486); post-HD labs: Mg 4.6, Ca 7.7, iCa 1.02 (1850); nephrology and HD notes |
| 1905-1940 | Hypoglycemia 54 (portray at 1905); D10W order 1930; hospitalist note 1940 |
| 2130-2200 | PEG and senna orders; due 2200 |
| 2145 | 2100 labs: Mg 5.6, Ca 7.9 |
| 2310-2330 | Delirium precautions, melatonin; night hospitalist note |
| 0145 | 0100 labs: Mg 6.4 |
| 0245-0345 | Bisacodyl PR; KUB; ECG 0230; hospitalist note 0320; bowel protocol and diphenhydramine discontinued 0330; KUB result 0345 |
| 0545 | 0500 labs: Mg 5.3, Cr 3.3 |
| 0640-0700 | Pharmacy, dietitian, case management, nephrology notes; furosemide 80 mg order; Foley removal order 0650 |

---

## 6. SBAR examples (model answers for the phone calls)

**1) 1100, RN to the hospitalist / rapid response**
- **S:** "This is the RN for Raymond Kessler in 5E-14. I am calling a rapid response. His respiratory rate dropped to 10 and is shallow, his heart rate is 44, BP 84/48, SpO2 91% on room air, and he is only waking to loud voice. His reflexes are gone."
- **B:** "He's a 74-year-old with CKD 4 admitted this morning with a magnesium of 7.8, calcium gluconate 1 g in the ED, and the 0900 magnesium was 8.7. We found milk of magnesia, a magnesium antacid and magnesium oxide at home. Urine output is 20 mL/h, he has heart failure, and he's NPO."
- **A:** "I think his magnesium is still rising and he's getting respiratory depression and heart block. His airway is intact but he's not protecting his breathing."
- **R:** "I need you at the bedside now. I'd like calcium gluconate 1 g IV now, oxygen, STAT magnesium and an ECG, nephrology and ICU on the phone, and pacing pads at the bedside. Do you want the saline stopped or a small bolus?"

**2) 1130, RN or hospitalist to nephrology (urgent)**
- **S:** "Urgent: severe hypermagnesemia and oliguric AKI in a 74-year-old; respiratory rate 10, HR 44, absent reflexes."
- **B:** "CKD 4 baseline creatinine 2.6, now 4.8-5.0; Mg 7.8 then 8.7; urine 20-35 mL/h despite 1 L saline and furosemide 80 mg IV; calcium gluconate 1 g given at 1120."
- **A:** "I don't think saline and furosemide will clear this. He needs dialysis."
- **R:** "Can you see him now and decide on emergent hemodialysis? What labs do you want, and what is the plan for the airway if his respiratory rate falls?"

**3) 1500, RN to ICU outreach / nephrology (worsening breathing during preparation)**
- **S:** "RR 9, SpO2 92% on 4 L, EtCO2 52, HR 46, BP 88/50, only waking to loud voice, before dialysis starts."
- **B:** "Mg 10.9, K 5.8, QRS 148 ms, ABG 7.20/52 at 1415, calcium gluconate 2 g given at 1400, dialysis catheter placed at 1440."
- **A:** "He is hypoventilating and may need airway support before the dialysis finishes."
- **R:** "Please come now or tell me your thresholds. I'd like the airway cart in the room, a repeat ABG, and a decision about transfer."

**4) 1905, RN to the hospitalist (hypoglycemia after dialysis)**
- **S:** "Mr. Kessler's glucose is 54, he is shaky and sweating, awake and oriented."
- **B:** "74-year-old with CKD 4 and dialysis just finished at 1800. No insulin since Monday night (glargine 22 units). Lab glucose was 71 at 1700. He has had almost nothing to eat for 4 days. I gave 15 g apple juice at 1905 after a swallow screen; recheck at 1920 was 68 so I gave 15 g more; at 1935 it was 84."
- **A:** "I think insulin is lasting longer from the kidney failure, plus dialysis and no intake. He needs ongoing glucose support."
- **R:** "Can I have a D10W order, hourly glucose, a plan to hold the correction insulin, and a diet order? Please review all his insulin."

**5) 2310, RN to the night hospitalist (delirium)**
- **S:** "Mr. Kessler is newly confused and restless, pulling at his lines, CAM positive. Vitals are stable and glucose is 118."
- **B:** "After dialysis today for Mg 10.9; Mg 5.6 at 2100 and rising; calcium 7.9. No stool for 4 days. The order set has diphenhydramine for sleep, which I am not giving."
- **A:** "I think the delirium is from hospital, uremia and possibly the rebound magnesium. I'm worried about masking his breathing and reflexes if he is sedated."
- **R:** "Can we discontinue diphenhydramine and avoid benzodiazepines, order melatonin, add delirium precautions, a sitter, and recheck the magnesium sooner?"

**6) 0245, RN to the night hospitalist (rebound and constipation)**
- **S:** "The 0100 magnesium is 6.4, up from 4.6 after dialysis and 5.6 at 2100. HR 56, BP 104/60, RR 12, reflexes 1+, drowsy."
- **B:** "74-year-old, dialysis yesterday for Mg 10.9, no stool in 4 days, abdomen distended, hypoactive bowel sounds. The bowel protocol ends in milk of magnesia and he is asking for it. I have not given it."
- **A:** "Rebound magnesium with retained gut magnesium."
- **R:** "Please discontinue the bowel protocol, order bisacodyl and a KUB, call nephrology about repeat dialysis if it goes over 7, and tell me when you want me to call you again."

**7) 0700, night RN to day RN (handoff).** Situation: hypermagnesemia resolving. Background: OTC magnesium, CKD 4/AKI, dialysis 1500-1800, hypoglycemia, rebound 6.4, constipation, delirium overnight. Assessment: Mg 5.3, creatinine 3.3, alert, reflexes 2+, UO 85 mL/h, fluid positive 2 L, weight 90.0 kg, Foley to remove, dialysis catheter stays. Recommendation: Foley removal and bladder scan, furosemide 0800, glucose checks, bowel regimen, no magnesium or NSAIDs, teach-back, pharmacy/dietitian/case management visits.

---

## 7. Answer key: expected priority interventions with rationales

**Magnesium levels (approximate; sources differ slightly).**
| Mg (mg/dL) | What you may see |
|---|---|
| 1.7-2.2 | Normal |
| 2.3-5 | Often no symptoms; nausea, flushing, headache, mild drowsiness |
| 5-7 | Nausea, flushing, drowsiness, hypotension, weak reflexes (Ray at 0700: 7.8, reflexes 1+) |
| 7-12 | Absent reflexes, marked lethargy, **bradycardia, long PR, wide QRS, low BP** (Ray at 1100, 8.7-9.5) |
| 10-12 and up | **Respiratory depression and muscle paralysis, heart block** (Ray at 1500, 10.9) |
| over 15 | Coma, cardiac arrest |
Mg 7.8 mg/dL = 6.4 mEq/L = 3.2 mmol/L (1 mEq/L = 1.22 mg/dL).

**Priority order (the answer key).**
1. **Airway, breathing, circulation:** RR for a full minute, depth, SpO2, EtCO2, LOC, HOB up, suction, bag-valve-mask. **Rationale:** magnesium blocks acetylcholine at the nerve-muscle junction, so the breathing muscles weaken; low SpO2 is a late sign and oxygen can hide worsening hypoventilation.
2. **Cardiac monitor, ECG, pacing pads.** **Rationale:** magnesium slows conduction (long PR, wide QRS, heart block); atropine/pacing are back-ups; calcium is first line.
3. **Reflexes (DTR) with each assessment.** **Rationale:** loss of reflexes appears before respiratory depression; it is the bedside early warning.
4. **STOP all magnesium and find the source.** **Rationale:** the cause must be removed; ask directly about OTC laxatives, antacids, supplements, leg cramp remedies, enemas; ask family to bring bottles. **No Mg/Al antacids, milk of magnesia, magnesium citrate, Epsom salt, or Fleet (phosphate) in kidney failure.**
5. **Calcium gluconate IV (antidote).** **Rationale:** calcium directly counters magnesium's effect on heart and muscle for about 30-60 minutes; it does **not** lower magnesium, so it buys time while the removal treatment works. **How:** 1 g over 10 minutes (per order), on a cardiac monitor, through a large patent vein (right antecubital), check the site before and during (calcium injures tissue if it leaks), watch HR/BP/rhythm; separate from ceftriaxone, bicarbonate and phosphate; caution with digoxin (not on).
6. **Support kidney clearance:** isotonic saline (in small boluses because of HFpEF; reassess lungs and SpO2 each time) and a loop diuretic if the kidneys respond. **Rationale:** more urine flow means more magnesium excreted. **Limits:** with GFR about 12 and oliguria they often fail, and the heart failure patient can go into fluid overload (crackles at 1500, +2 L by morning).
7. **Hemodialysis** for severe/symptomatic hypermagnesemia (Mg about 10 or higher or respiratory depression, heart block, hypotension) especially in kidney failure. **Rationale:** dialysis removes magnesium directly and quickly (10.9 to 4.6 in 3 hours); nothing else removes it when the kidneys are not working. **Nursing:** consent (wife as proxy), time-out, line use only by dialysis staff, BP/HR every 15 minutes, watch for hypotension, keep calcium available, post-dialysis labs.
8. **Escalate early:** rapid response at the first drop in RR/alertness; SBAR; nephrology and ICU outreach.
9. **Medications:** **hold** lisinopril (kidney/potassium), metoprolol (slow HR), furosemide PO, gabapentin (accumulates in CKD, sedating), oxycodone (breathing, constipation), NSAIDs (kidney); basal insulin held in kidney failure; **no sedatives**.
10. **Glucose and insulin safety:** insulin lasts longer in kidney failure; treat low glucose with the rule of 15 (glucose tablets or apple juice, not orange juice because of potassium), IV dextrose if he cannot swallow; trend before it drops.
11. **After dialysis expect:** BP drops, glucose falls, calcium can fall (low Mg suppresses parathyroid hormone; tingling, cramps, QTc), and **magnesium rebound** over 4-8 hours from tissue and bowel stores. Keep q4h Mg and reassess; call early.
12. **Constipation:** unabsorbed magnesium in the bowel keeps feeding the blood; give **non-magnesium** laxatives (PEG 3350, senna, bisacodyl), no phosphate enemas. Stool burden: KUB.
13. **Delirium and sleep:** treat reversible causes, non-drug measures, melatonin only; avoid diphenhydramine, benzodiazepines, zolpidem; sitter; protect lines; reflexes and RR still checked.
14. **CAUTI bundle:** the Foley was for hourly output in oliguric AKI; once output is recovering and hourly measurement is no longer needed, remove it (review every day).
15. **Teach-back** on prevention (see 0700 above).

---

## 8. DEBRIEFING

### 8.1 Debrief structure (PEARLS: Gather, Analyze, Summarize) - 40-45 minutes

**Before you start:** ground rules: "This is a safe space. We talk about what we did, not about who we are. Everything stays in this room." Seat students in a circle; take 1 minute to breathe.

| Phase | Time | What you do |
|---|---|---|
| **1. Reactions (Description)** | 5 min | "How are you feeling? What stands out?" Let every student say one word or sentence. |
| **2. Facts (Description)** | 5 min | One student gives a 2-minute summary of the case (use the story at the top). Fix any wrong facts. Put the Mg trend on the board: 7.8, 8.7, 9.5, 10.9, 7.2, 4.6, 5.6, 6.4, 5.3. |
| **3. Analysis** | 20-25 min | Use the discussion questions in 8.2 (pick 6-8). Ask "What were you thinking when...?" before giving the answer. Use the "advocacy with inquiry" method: *"I noticed X. I was concerned because Y. Help me understand what you were thinking."* |
| **4. Application and Summary** | 8-10 min | Each student writes down **one thing they will do differently on clinical** and one thing they did well. Instructor reviews the key take-aways (below). |

**Key take-aways to close with.**
1. **Ask about over-the-counter products** (laxatives, antacids, supplements) in every patient, especially kidney patients and older adults.
2. **Check reflexes and respiratory rate, not just SpO2.** Reflexes go first, breathing later.
3. **Calcium protects; dialysis removes.**
4. **Question any order or protocol that contains magnesium** (or phosphate or sedatives) in a kidney patient.
5. **Call early (SBAR, rapid response).** 
6. **After dialysis: watch for hypotension, hypoglycemia, low calcium and rebound.**
7. **Teach safe alternatives with teach-back.**

### 8.2 Discussion questions with model answers (14)

1. **Why was Ray at such high risk for magnesium toxicity?**
   *Model:* His kidneys (eGFR about 12 with the AKI; 25 at baseline) are the only way to remove magnesium. He took 3 magnesium products for weeks (milk of magnesia, antacid, magnesium oxide), became dehydrated (less kidney blood flow), and took lisinopril, a diuretic and ibuprofen that made the kidneys worse. Opioid constipation kept magnesium in the bowel to be absorbed.

2. **What clues at 0700 should have made you suspect magnesium?**
   *Model:* Lab Mg 7.8; flushing, drowsiness, nausea, low BP, slow heart rate with long PR and wide QRS, weak reflexes, kidney failure, constipation, and a wife who "brought the bottles."

3. **How would you ask about medicines so you do not miss over-the-counter products?**
   *Model:* "What do you take for heartburn, constipation, pain, sleep, leg cramps, vitamins, or herbs? Do you have the bottles? How often, how long?" Ask family to bring everything; use the pharmacist; do not accept "just my regular pills."

4. **Which bedside finding tells you the magnesium is getting worse before the breathing fails?**
   *Model:* Loss of deep tendon reflexes (1+ to 0), more sleepiness, hypotension, slower heart rate, longer PR. Respiratory depression is later and more dangerous.

5. **Why does calcium gluconate work, and why isn't it enough?**
   *Model:* Calcium opposes magnesium at the nerve-muscle junction and in the heart; effects last 30-60 minutes; it does not lower the magnesium level. It buys time for removal (dialysis).

6. **How do you give calcium gluconate safely?**
   *Model:* Check the order and the dose (1 g in 50 mL, over 10 minutes), large patent vein, check the site before and during, cardiac monitor (watch for slow rate/arrhythmia), do not give with ceftriaxone in the same line, stop for infiltration; document the response.

7. **Why can't we just give lots of fluid and furosemide, and what were the risks in this patient?**
   *Model:* Saline and loop diuretics only help when the kidneys still make urine; he had oliguria (10-25 mL/h). Risks: fluid overload (HFpEF; crackles at 1500, +2 L net by morning). That is why boluses were small and lungs were checked each time.

8. **Oxygen was applied at 1100. Why isn't that the answer?**
   *Model:* Oxygen raises SpO2 but does not fix slow, shallow breathing (CO2 rises: ABG 7.24/46 then 7.20/52). Monitor RR, EtCO2 and consciousness; be ready for airway support.

9. **When did you call for help and why was that the right (or wrong) time?**
   *Model:* RR under 10, HR 44, BP 84/48, new unresponsiveness and lost reflexes = rapid response. Waiting to "finish my tasks" delays care.

10. **Why was emergent hemodialysis needed, and what do you do before, during and after?**
    *Model:* Mg 10.9 with respiratory depression, heart block and oliguria did not respond to saline, diuretic or calcium; dialysis removes magnesium directly. Before: consent (wife as proxy), time-out, labs, NPO, hold BP meds. During: BP/HR every 15 minutes, rhythm, keep calcium available, dialysis RN handles the line. After: BP, glucose, calcium, Mg rebound labs, site care.

11. **Why did Ray's glucose fall after dialysis, and how do you treat it?**
    *Model:* Kidney failure makes insulin last longer (he took glargine 22 units Monday), almost no food for 4 days, dialysis. Treat with the rule of 15: swallow screen; glucose tablets or apple juice (not orange juice: potassium); recheck in 15 minutes; IV dextrose if not able to swallow; then a snack; call the provider.

12. **What is rebound, and what did you do about it?**
    *Model:* After dialysis, magnesium moves back into the blood from tissue stores and the bowel (4.6 to 5.6 to 6.4). Repeat levels q4h, watch RR, reflexes, rhythm, ask for repeat dialysis if over 7 or symptoms; clear the bowel without magnesium.

13. **How did you handle the nighttime confusion without sedatives?**
    *Model:* Look for causes (glucose, pain, bladder, bowel, oxygen, medicines, Mg); reorient, lights, family, sitter, low stimulation, protect lines; avoid restraints; ask to discontinue diphenhydramine; melatonin if ordered; do not mask respiratory checks.

14. **What was the hidden hazard in the 0300 constipation?**
    *Model:* The bowel protocol ended with milk of magnesia and the patient asked for it. Question any order or protocol that contains magnesium in a kidney patient. Use bisacodyl, PEG, senna; no Fleet (phosphate) enema.

15. **What will you teach Ray and Eleanor, and how will you know they understood?**
    *Model:* No magnesium or NSAIDs, label reading, safe alternatives, sick-day rule, bring all bottles, warning signs, insulin changes, follow-up. Use teach-back: "Show me which product on this shelf you would not buy." Include the wife and daughter.

16. **(Optional) The Foley: was it appropriate, and when should it come out?**
    *Model:* It was appropriate for hourly output in oliguric AKI; remove it when no longer needed (urine 85 mL/h at 0700 Wed). CAUTI bundle.

### 8.3 What went well / what to improve (capture table; print and fill in on the board)

| Topic | What went well | What to improve | One action for next time |
|---|---|---|---|
| Medication history (OTC) | | | |
| ABC and early recognition (RR, reflexes, ECG) | | | |
| Calcium gluconate safety | | | |
| Fluids in heart failure (lung checks) | | | |
| Rapid response / SBAR | | | |
| Dialysis consent and care | | | |
| Hypoglycemia treatment | | | |
| Delirium and no sedatives | | | |
| Bowel plan (no Mg/phosphate) | | | |
| Teaching and teach-back | | | |
| Teamwork and communication | | | |
| Documentation | | | |

### 8.4 Common pitfalls (watch for these and bring them up)

1. **Missing the OTC magnesium** on the medication history; accepting "regular pills."
2. **Giving a magnesium-containing laxative/antacid** (milk of magnesia from the bowel protocol, Maalox for heartburn, magnesium citrate, Epsom salt) or a **Fleet (phosphate) enema** in kidney failure.
3. **Ignoring reflexes and respiratory rate**; relying on SpO2 alone; applying oxygen and feeling reassured.
4. **Giving sedatives/opioids/diphenhydramine/benzodiazepines** (gabapentin, oxycodone, diphenhydramine in the order set).
5. **Not calling the rapid response team** or waiting too long; calling without an SBAR; not saying "I need you to come now."
6. **Giving the home meds** (lisinopril, metoprolol, furosemide PO) without checking hold parameters, potassium, creatinine, HR and BP.
7. **Giving calcium too fast**, without a monitor, through a poor IV, or not checking the site; thinking calcium "fixes" the magnesium.
8. **Pushing fluids** without lung checks in a heart-failure patient; not noticing crackles and weight gain.
9. **Not trending labs** (Mg, glucose, calcium) or not acting on a falling glucose of 71.
10. **Orange juice for the low glucose** in a patient with potassium over 5; not doing a swallow screen first.
11. **Using the dialysis catheter** for infusions or draws.
12. **Restraining the confused patient** instead of using non-drug measures.
13. **Forgetting the Foley review** (CAUTI) once hourly output is no longer needed.
14. **Poor teaching:** telling "avoid antacids" with no alternatives; no teach-back; not including the wife.

### 8.5 Prevention and teaching points (for students to take away)

- **Kidney disease + magnesium = danger.** Anyone with CKD or an eGFR under 30 should not use magnesium-containing laxatives, antacids or supplements, unless the kidney doctor says so.
- **Read labels.** "Magnesium hydroxide, oxide, citrate, sulfate, trisilicate" = magnesium. Brand names (Milk of Magnesia, Maalox, Mylanta, Gelusil, Phillips', Epsom salt) all contain it.
- **Safer choices (check with the provider):** constipation: polyethylene glycol, senna, docusate, bisacodyl, fiber, fluids, walking. Heartburn: pantoprazole as prescribed, small meals. Pain: acetaminophen, not NSAIDs. Leg cramps: stretching, tell the doctor (a magnesium supplement is not safe).
- **Sick-day rule:** when vomiting or not drinking, stop (or call about) ACE inhibitors, diuretics, NSAIDs and metformin/insulin changes.
- **Bring all bottles and tell every clinician about kidney disease.**
- **System fixes:** remove magnesium steps from default bowel protocols for patients with an eGFR under 30; flag "no magnesium" in the allergy/precaution banner; pharmacist OTC review at admission; use the 4-hour check of Mg when a critical value is found.

### 8.6 Sample NCLEX-style questions

1. *The nurse finds a client with CKD stage 4 who is drowsy with HR 44, BP 84/48, RR 10, and absent patellar reflexes. Serum Mg is 8.7 mg/dL. Which action is the nurse's FIRST priority?*
   A. Obtain a 12-lead ECG. B. Call the rapid response team and prepare calcium gluconate. C. Administer milk of magnesia. D. Encourage oral fluids.
   **Answer: B** (airway/breathing/circulation threat; antidote is calcium; the others are less urgent or harmful). 
2. *Which finding is the EARLIEST sign of worsening hypermagnesemia?* A. Respiratory rate under 8. B. Cardiac arrest. C. Loss of deep tendon reflexes. D. Ventricular tachycardia. **Answer: C.**
3. *A client who has had dialysis for severe hypermagnesemia has glucose 54, is shaky and alert, and passed a swallow screen. K is 5.0. Which treatment is best?* A. Orange juice 4 oz. B. Apple juice 4 oz (15 g) then recheck in 15 minutes. C. Withhold food. D. Give regular insulin. **Answer: B.**
4. *Select all that apply: which products should the nurse teach a client with CKD to avoid?* Milk of magnesia; Maalox; magnesium oxide; polyethylene glycol; ibuprofen; acetaminophen. **Answer: milk of magnesia, Maalox, magnesium oxide, ibuprofen.**

---

## 9. Troubleshooting for the instructor

- **Students are far ahead or behind the clock:** use the 1h button and the release schedule. Students may move a checkpoint when the story's key event happens (e.g., call for help); you may move the monitor changes earlier to match.
- **A student gives calcium early, or holds the saline:** accept it; keep the numbers as written (the pathology is driven by the kidneys and the gut Mg), but if the calcium was given you can let HR rise to 48 and BP to 90/52 for 30 minutes at 1100.
- **Students call for dialysis early (good):** you may advance the dialysis start to the time of the call; then post-HD numbers come at the next checkpoint.
- **A student gives a magnesium product or a sedative (error):** that is a debrief teaching moment. Let the monitor worsen (RR 8, SpO2 90%, HR 40) and pause the scene to debrief the error ("stop, and what just happened?"), then reset the monitor to the scripted values.
- **Monitor limits:** if the simulator cannot show PR 0.26 or QRS 0.14, announce the ECG strip results aloud.
- **Print the Student Packet; do not print this guide for students.**

*Source of truth for the chart: casestudy/cases/hypermag/DESIGN.md. If the chart and this guide ever disagree, the chart numbers in DESIGN.md win.*

# Instructor Guide: Adrenal Crisis Case Study (CS-ADDISON-1)
**Patient: Lauren Mitchell, 46-year-old woman, room 4W-22, Medical-Surgical Telemetry 4 West. Monday 12/07/2026 0700 to Tuesday 12/08/2026 0700 (24 hours in seven 4-hour checkpoints).**

*Plain-language, printable. Everything here matches the EHR chart in `patient.json` (built from `DESIGN.md`) and the built-in bedside-monitor scenario for MRN SIM-40422. Page breaks fall before each checkpoint if you print.*

---

## 1. At a glance (one page)

**The story in four sentences.** Lauren has had Addison disease (her adrenal glands make almost no cortisol or aldosterone) since 2021 and takes hydrocortisone and fludrocortisone every day. Her son brought home a stomach bug; for 2 days she vomited her pills and had watery diarrhea, and nobody had ever taught her to double her dose or given her an emergency injection. She arrives from the ED in adrenal crisis: shock, low glucose, low sodium, high potassium with peaked T waves, confusion, belly pain and tanned skin, already improving after hydrocortisone 100 mg IV at 0420 and 2.5 L of fluid. Over the next 24 hours the students give the stress-dose hydrocortisone on time, treat a second low glucose, catch a sodium that is rising too fast, keep her safe from falls, watch the potassium fall, and finish with the oral taper, the fludrocortisone restart and the life-saving sick-day teaching.

**This is a teaching case about recognition, the standard plan and EVALUATION of the response.** The patient gets better if the students do the basics well. Each checkpoint has one new development to notice and act on.

**What students do:** they are the day RN (0700-1900) and then the night RN (1900-0700). At each checkpoint you set the bedside monitor, portray the patient, release the chart changes with the clock, give the bedside glucose values, and watch their priorities.

| Checkpoint | One-line theme | Labs released by that time |
|---|---|---|
| **0700** | Arrival: recognize adrenal crisis; next hydrocortisone due 1000 (on time!) | ED: Na 126, K 6.0, glucose 49, Cr 1.6; ECG peaked T |
| **1100** | Second low glucose (58): treat, find the cause, check the steroid was on time | 0900: Na 128, K 5.5, glucose 74 |
| **1500** | Better (alert, BP 108/66) but **orthostatic** and **sodium up 6 in 9 hours** with a water diuresis: call | Cortisol 1.8; 1300: **Na 132**, K 4.9; ECG normal; ACTH 1,240 |
| **1900** | Response to treatment: orthostatics negative, eating, norovirus result | 1700: Na 133, K 4.4; norovirus |
| **2300** | Steroid insomnia, mild steroid hyperglycemia (152): no sedatives, no insulin | 2100: Na 133, K 4.0 |
| **0300** | Night near-fall in the bathroom; IV infiltration; potassium falling | 0100: Na 133, **K 3.7** |
| **0700** | Recovery: evaluate, switch to oral, restart fludrocortisone, teach sick-day rules and the injection | 0500: **Na 134** (+8 in 25 h), **K 3.5** |

**Normal values used in this case:** Na 136-145, K 3.5-5.1, glucose 70-110, cortisol (morning) 5-23 mcg/dL (in severe illness it should be over 18), ACTH 7.2-63 pg/mL.

---

## 2. Purpose and learning objectives

**Purpose.** A clear, realistic endocrine emergency that students may never see on clinical but must recognize in minutes. The case builds **clinical judgment**: recognize cues (BP, glucose, sodium, potassium, mental status, skin), know the standard treatment (hydrocortisone, fluids, dextrose), give a time-critical drug on time, **evaluate whether the treatment is working**, avoid the classic harm (sodium corrected too fast, steroid dose late or held, falls), and **teach** the patient so it never happens again.

**By the end, the student will be able to:**
1. Recognize adrenal crisis and its trigger (illness, vomiting, missed or not-increased steroid) in a person with known adrenal insufficiency.
2. Explain the signs by hormone: **cortisol** missing = low BP, low glucose, weakness, nausea, confusion, eosinophilia; **aldosterone** missing = salt loss, low sodium, high potassium, dehydration; **high ACTH** = hyperpigmentation (primary disease).
3. Give **stress-dose IV hydrocortisone** safely and **on time**, and explain why it also covers the missing aldosterone (so **fludrocortisone is held** at high doses and restarted when the dose drops to 50 mg/day).
4. Monitor and **evaluate** the response: BP and orthostatic vitals, heart rate and rhythm, glucose, mental status, intake and output, sodium and potassium trends.
5. Keep the **sodium rise within 8 mmol/L in 24 hours**, recognize a water diuresis, and call the provider with SBAR.
6. Prevent harm: hypoglycemia protocol, falls with orthostatic hypotension and night diuresis, contact (enteric) precautions with soap and water, IV site care.
7. Teach **sick-day rules**, the **100 mg IM hydrocortisone emergency injection** (with return demonstration by the patient and the husband), a medical alert ID and when to call 911, using teach-back.

**NCLEX-style areas this case supports:** physiological adaptation (fluid and electrolyte imbalances, medical emergencies, hemodynamics), pharmacological therapies (time-critical and high-alert medications, expected effects and side effects), reduction of risk potential (lab values, ECG changes, potential complications), safety and infection control (falls, contact precautions), and health promotion (self-management teaching). See Section 8.6.

---

## 3. Setup

**Time needed.** About 20-25 minutes per checkpoint x 7 = about 2.5-3 hours with breaks; or run 0700, 1100, 1500 and the Tuesday 0700 checkpoint in a short class (about 90 minutes) and read the summaries for the others. Plan **40-45 minutes for the debrief**.

**People.** Instructor (patient's voice, providers on the phone, sets the monitor). Optional second faculty or a strong student as the husband (Daniel) and the hospitalist. Groups of 3-4 students: primary RN, second RN/medication nurse, "charge nurse/phone caller", observer (uses the capture table in Section 8.3).

**Patient identification.**
- Wristband: **MITCHELL, LAUREN**, DOB **05/14/1980**, MRN **SIM-40422**, **Allergy: SULFAMETHOXAZOLE-TRIMETHOPRIM (hives)**, Full Code, fall risk band.
- Room sign: 4W-22; **Contact (enteric) precautions** sign on the door ("soap and water").
- She does NOT have a medical alert bracelet (a teaching point).

**Equipment.** Manikin or standardized patient (head of bed 30 degrees), bedside monitor (set per checkpoint), telemetry leads, BP cuff, pulse oximeter, thermometer, stethoscope, glucometer and strips (or glucose value cards), IV pump with D5NS and a D5 0.45% NaCl bag, saline flushes, **hydrocortisone sodium succinate 100 mg/2 mL Act-O-Vial training vials** (and a 3 mL syringe with a 1-1.5 inch needle for the teaching), dextrose 50% syringe (training), gowns and gloves for contact precautions, soap-and-water sink sign, bedside commode, urine hat and graduated cylinder, emesis basin, bed alarm, non-skid socks, glucose tablets and apple juice cups, a pill organizer and the home bottles (hydrocortisone 10 mg, fludrocortisone 0.1 mg, levothyroxine 88 mcg), a sample steroid emergency card and a medical alert brochure. Optional: a whiteboard for I&O and the sodium trend.

**Moulage.** Bronze/tan skin (light bronzer on the face, neck and backs of hands), darker palm creases and knuckles (brown eyeliner pencil), dark patches on the gums/inside the cheeks (describe them if you cannot show them), bruises on both knees, dry lips. Sweat spray for 1100.

**Manikin / monitor notes.**
- Rhythm: **sinus tachycardia with tall T waves** at 0700 and 1100, then **normal sinus rhythm** with normal T waves from 1500. If your simulator has no T-wave control, say "the T waves look tall and pointed" at 0700.
- BP on the monitor is **lying**. Give the **standing** values aloud when students do orthostatic vitals (in the tables below, and in the monitor's row note).
- Urine: she voids into a hat. Give the volumes aloud from the I&O lines below.
- **Bedside glucose values (students do the checks; give these numbers):** 0900 **72**, 1100 **58** (1120 after treatment **142**), 1300 **104**, 1500 **118**, 1900 **142**, 2300 **152**, 0300 **128**, 0700 **112**.
- Temperature in °F; she is not febrile after 0700.

**Preload the EHR (before students arrive).**
1. Open the EHR: **Pre-Built Patients > Case Study Patients > Lauren Mitchell**. (Or Tools > Import JSON with `casestudy/cases/addison/patient.json`.)
2. Confirm the clock reads **Mon 07:00** and that students see only the EMS/ED vitals and the 0700 set (no later vitals), the ED labs (Na 126, K 6.0) and ED notes up to the 0655 handoff, the ED ECG (peaked T waves), orders and MAR (hydrocortisone 50 mg IV due 1000).
3. Time control: **4h ▶** moves to the next checkpoint. For smaller steps use **1h ▶** or **Next event** (release schedule in Section 5). Labs appear automatically at their result time.
4. Open the **bedside monitor** (`monitor.html`, or the **Monitor** button in the EHR top bar) in the same browser. It reads the patient's MRN from the EHR and loads **Lauren Mitchell's built-in scenario** automatically (the patient name at the top of the monitor should read MITCHELL, LAUREN). If it shows Ray Kessler, press 4h once in the EHR or reload the monitor.

**Vitals rule.** *There are no vitals in the chart after 0700.* At each checkpoint the monitor shows the values below, students take their own set (including orthostatic vitals when ordered) and chart it. The 0700 set is already in the chart (arrival set); have them confirm it. (Instructors also see a "Suggested vitals" bar above the Flowsheets vital-sign grid: for this patient it can only repeat the 0700 chart set, so ignore it and use the monitor values below.)

---

## 4. Checkpoint script

Each checkpoint has: (A) what happened since the last one (read aloud), (B) **exact monitor settings**, (C) what the patient says and what the exam shows, (D) what appears in the chart, (E) expected student actions, (F) prompts if missed.

### CHECKPOINT 1: Monday 0700 (arrival and handoff)

**(A) Read aloud.** "It is 0700. Lauren Mitchell, 46, just arrived from the ED. She has Addison disease and has been vomiting and having diarrhea for 2 days. EMS found her confused with a blood pressure of 74/40 and a glucose of 58. In the ED she got dextrose, hydrocortisone 100 mg IV at 0420, and two and a half liters of fluid. Her sodium was 126 and potassium 6.0. Her husband Daniel is at the bedside."

**(B) Monitor (this set is also in the chart).**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 99.4 F oral | **104** | **98/60** (73) | 18 | 98% room air | 4/10 crampy belly | **Sinus tachycardia, tall peaked T waves** | 88 (0645, in the chart) |

Orthostatic vitals: **not safe yet** (dizzy sitting up, lying systolic under 100). If a student tries: she says "the room is spinning" as soon as she sits up; lay her back down.

**(C) Bedside.**
- LOC: drowsy, wakes to voice and stays awake while talked to; oriented to person and place, not the date or why she is here. Repeats questions. GCS 14.
- Patient says: *"I'm so tired... my stomach hurts... I just want some pickles. Did I miss my pills?"*
- Exam: tanned skin in December, darker palm creases and knuckles, dark patches inside the cheeks; dry lips and tongue; skin tents slowly. Hands cool, cap refill 3 seconds, radial pulses 2+. Lungs clear. Abdomen soft, mildly tender everywhere, hyperactive bowel sounds. Bruises on both knees. Moves all limbs, weak (4/5).
- Nausea, no vomiting since 0440. Last stool 0515 (ED). Voided 150 mL dark yellow at 0450. **First void on the unit 0800: 120 mL.**
- Husband (Daniel): *"She had her pills until Saturday, then she kept throwing them up. Nobody ever told us what to do. We don't have that shot."* He answers well when asked about home medications and the illness.

**(D) Chart already shows.** EMS/ED vitals, ED triage note (with EMS report), ED provider note, H&P, ED RN note, handoff (next hydrocortisone due 1000; cortisol/ACTH pending; stool sample needed), ED labs (**Na 126, K 6.0, glucose 49, BUN 38, creatinine 1.6, Ca 10.6, eosinophils 7%, urine Na 48**), **ECG 0425 with picture (sinus tach 118, peaked T waves V2-V4)**, chest x-ray (clear), baseline clinic labs (9/22: Na 137, K 4.6, Cr 0.8), 0700 assessment, orders and MAR (hydrocortisone 50 mg IV every 6 hours due 1000/1600/2200/0400; D5NS 150 mL/h; home hydrocortisone, fludrocortisone, levothyroxine and vitamin D held; hypoglycemia protocol; ondansetron PRN; enoxaparin 2100; BMP every 4 hours; glucose every 2 hours; telemetry; orthostatics when safe; contact precautions), devices (EMS IV removed 0640; 20 g right forearm with D5NS; 18 g left forearm saline lock; telemetry), stickies.
**Appears by the next checkpoint (0730-1050):** endocrinology, pharmacy and stool orders (0730), pharmacy note (0830), hospitalist note (0915), 0900 labs at 0950 (Na 128, K 5.5, glucose 74, lactate 1.4), 0700-1100 I&O block at 1100.

**(E) Expected student actions (priorities).**
1. **Recognize adrenal crisis and the trigger:** known Addison disease + vomiting/diarrhea + no steroid absorbed + no stress dosing = crisis. Link the findings: low BP/fast HR (cortisol and volume), glucose 49-52 (cortisol), Na 126 and K 6.0 (aldosterone), creatinine 1.6 (dehydration), tanned skin (high ACTH).
2. **ABCs and perfusion:** BP, MAP over 65, HR, mental status, cap refill, urine output. Telemetry on; **interpret the rhythm** (sinus tach) and **compare with the ED ECG (peaked T waves)**; know the potassium is 6.0.
3. **Hydrocortisone 50 mg IV due at 1000: plan to give it ON TIME** (find the Act-O-Vial, know how to mix it). Know why it must never be held or late.
4. **Glucose:** check at 0900 (ordered every 2 hours); know the hypoglycemia protocol (she is nauseated: D50 IV, not juice).
5. **Fluids:** D5NS 150 mL/h running in the right forearm 20 g; check the site; lung sounds (clear); strict I&O with the hat; daily weight plan (58.2 kg).
6. **Safety:** high fall risk (confused, dizzy, IV, diarrhea): bed alarm, commode, call light, do NOT let her walk. Contact (enteric) precautions with **soap and water**.
7. **Verify the holds:** home oral hydrocortisone (replaced by IV), **fludrocortisone held** (and why), levothyroxine held today.
8. **Stool sample** ready for the next liquid stool (C. difficile PCR, GI panel).
9. Update the husband; start learning what they know about sick-day rules (assess learning needs, not teach yet: she is confused).

**(F) If students miss it, prompt with:**
- No link to Addison disease: "Why would a stomach bug make *her* so much sicker than her son?"
- Not checking the ECG/potassium: "The handoff says K 6.0. What do you look at on the monitor? Where is the ED ECG?"
- Plans to give the home hydrocortisone tablets: "She is nauseated and on IV hydrocortisone. What does the MAR say about the home tablets?"
- Asks why fludrocortisone is held: "What does 200 mg a day of hydrocortisone do at the aldosterone receptor?"
- Lets her stand: she says "I'm going to faint" and you lower her to the bed. "What made that unsafe?"
- Uses alcohol gel only: "What is she on precautions for? Does gel work?"

---

### CHECKPOINT 2: Monday 1100 (second low glucose)

**(A) Read aloud.** "It's 1100. The 0900 labs are back: sodium 128, potassium 5.5. The glucose at 0900 was 72. She had a large liquid stool at 0945 and the sample went to the lab. The hydrocortisone was due at 1000. You walk in for the 1100 glucose check and she is sweating."

**(B) Monitor.**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 99.0 F | **112** | **94/58** (70) | 20 | 98% room air | 3/10 belly | Sinus tachycardia (T waves a little less tall) | **58** (if rechecked 15 minutes after D50: **142**) |

After treatment (about 1120) you may lower HR to 100 with **Apply** on the monitor.

**(C) Bedside.**
- Shaky, sweaty, anxious, "foggy": *"Something's wrong... I feel like I'm going to pass out... I'm so hungry but I'm scared to eat."* Still mildly nauseated.
- Oriented to person and place (worse than at 0900, when she knew the date).
- Skin moist and cool. Lungs clear. Abdomen soft.
- Voids (hat): **0800 120 mL, 0930 140 mL, 1050 120 mL** (dark yellow, getting lighter). Liquid stool 0945 about 250 mL.
- Intake since 0700: D5NS 600 mL + sips 60 mL.

**(D) Chart appears by now (before 1100):** pharmacy note (0830: no emergency kit ever dispensed, sick-day rules never taught, fludrocortisone hold appropriate), hospitalist note (0915), **0900 labs (0950): Na 128, K 5.5, Cl 98, CO2 19, BUN 34, creatinine 1.4, glucose 74, Ca 9.9, lactate 1.4**, endocrinology/pharmacy/stool orders (0730), 0700-1100 I&O (in 660 / out 630).
**Appears after the students act (1130):** hospitalist hypoglycemia event note; order for glucose every hour x2, then every 2 hours until three values over 70 (1130). Then **C. difficile PCR negative (1240)**.

**(E) Expected student actions.**
1. **Recognize hypoglycemia** (58 with adrenergic symptoms) and **treat per protocol: dextrose 50% 25 g IV** (nauseated, foggy: not safe for juice), through the 18 g left forearm IV with good blood return, slowly. Recheck in 15 minutes (142). Then a plan to prevent the next one (D5NS keeps running; food when nausea allows).
2. **Find the cause:** cortisol deficiency (the liver cannot make glucose; no glycogen) + nothing by mouth. **Check the MAR: was the 1000 hydrocortisone given on time?** (If your students gave it late or missed it, this is the moment to connect the two.)
3. Notify the provider (SBAR, Section 6).
4. **Do not stop or slow the dextrose-containing fluid** without a provider order; check the IV site.
5. Ondansetron 4 mg IV is now available (last dose 0430) if nauseated: preventing vomiting protects the steroid and glucose plan.
6. Trend the labs: Na 126 to 128 (+2 in 5 hours), K 6.0 to 5.5, creatinine 1.6 to 1.4: **improving**. Urine output is picking up.
7. Keep fall precautions (shaky, sweaty, confused).

**(F) Prompts if missed.**
- Treats with juice while she is nauseated: "What happens if she vomits it? What is the safer route?"
- Gives D50 without checking the IV: "D50 is a vesicant. What do you check first?"
- No cause identified: "She is on D5NS at 150 mL/h. Why is her glucose still falling? Which drug fixes the cause?"
- Forgets the recheck: "What does the rule of 15 say for D50?"
- Hydrocortisone 1000 dose late: "What happens to a patient with no adrenal function when a stress dose is 2 hours late?"

---

### CHECKPOINT 3: Monday 1500 (better, but orthostatic, and the sodium is rising too fast)

**(A) Read aloud.** "It's 1500. She has been on clear liquids since 1345 and is keeping them down. Endocrinology saw her. Her cortisol from the ED, drawn before the steroid, came back 1.8. The ACTH came back 1,240. The 1300 sodium is back. She has been up to the commode many times; the hat keeps filling with pale urine. Orthostatic vital signs are due now that her lying blood pressure is over 100 and she is alert."

**(B) Monitor.**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.8 F | **92** | **108/66** (80) | 16 | 99% room air | 2/10 | **Normal sinus rhythm, normal T waves** | 118 |

**Orthostatic vitals (give aloud when students do them):** lying **108/66, HR 92**; standing at 1 minute **94/60, HR 114**, *"I'm dizzy, I need to sit down."* = **positive** (systolic -14, HR +22, with symptoms). Lay her back down.

**(C) Bedside.**
- Alert and **oriented x3**; speech normal; no headache; follows complex instructions. (Mental status is clearing: say so if asked.)
- *"I feel so much better. Can I go to the bathroom by myself? I have to go all the time."*
- Mucous membranes moist. Lungs clear. No edema. Abdomen soft, minimal tenderness. Nausea gone.
- Voids (hat): **1150 250 mL, 1300 300 mL, 1400 280 mL, 1450 220 mL**: pale yellow (**about 260 mL/h**).
- Intake 1100-1500: D5NS 600 + D50 50 + oral 120 = 770 mL. Out: 1,050 mL.

**(D) Chart appears by now:** C. difficile negative (1240), **cortisol 1.8 (1310)**, **ECG 1330 (1340): normal sinus 94, T waves normal** (picture), **1300 labs (1350): Na 132, K 4.9, Cl 102, CO2 20, BUN 28, creatinine 1.2, glucose 96, Ca 9.4**, clear liquids order and renin/aldosterone add-on (1345, "pending send-out"), dietitian consult (1400), **endocrinology consult note (1400)**, **ACTH 1,240 (1440)**, endocrinology addendum (1450), 1100-1500 I&O.
**Appears after the students act (1530-1545):** **fluid change: stop D5NS, start D5 0.45% NaCl 100 mL/h (1530, due on the MAR)**, sodium-limit order (keep Na at 134 or lower until 0400 Tuesday; call for Na over 134, urine over 250 mL/h for 2 hours, or neuro change), sticky "Sodium limit", hospitalist note (1535), activity "up with 1 assist only, repeat orthostatics at 1900" (1545).

**(E) Expected student actions.**
1. **Hydrocortisone 50 mg IV due 1600: on time.** (Even though she "looks better": the steroid is why.)
2. **Calculate the sodium change:** 126 (0406) to 132 (1300) = **+6 in 9 hours**. The 24-hour limit is **8** (goal 4-6). At this pace she would pass the limit tonight. **Connect it to the urine:** about 260 mL/h of pale urine = water diuresis (cortisol and volume are back, ADH has switched off).
3. **Call the provider with SBAR** (Section 6): sodium trend, urine output, orthostatic result, neuro status. Expect the fluid change (lower-sodium fluid) and the limit order; read back.
4. **Orthostatic vitals done safely** (two people, lying, then sitting, then standing, stop if dizzy) and **interpreted as positive**: still volume-depleted when upright. Safety: **up with assist only**, dangle first, commode/hat close by, bed alarm.
5. Evaluate the response to treatment so far: BP up, HR down, alert, nausea gone, potassium down, creatinine down, ECG normal, glucose stable = **working**.
6. Interpret cortisol 1.8 + ACTH 1,240 = **primary** adrenal insufficiency (the gland, not the pituitary), which explains the tanning and the need for fludrocortisone.
7. Hang the new bag on time (1530) and relabel the line.

**(F) Prompts if missed.**
- Does not calculate the sodium change: "What was the sodium in the ED? What is it now? How many hours apart? What is the safe limit?"
- Thinks a rising sodium is only good news: "What happens to the brain if a low sodium is corrected too fast?" (osmotic demyelination: trouble speaking, swallowing, weakness, days later).
- Ignores the urine: "She made over a liter in 4 hours. Why now?"
- Lets her walk alone: she gets dizzy at the bathroom door; you catch her. "What did the orthostatic vitals tell you?"
- Wants to hold the 1600 hydrocortisone because "her BP is fine now": "What happens if you remove the cause of the improvement?"

---

### CHECKPOINT 4: Monday 1900 (evaluating the response; norovirus)

**(A) Read aloud.** "It's 1900, shift change. The new fluid is running at 100 mL/h. She has had broth, ginger ale and juice, and a regular diet was ordered at 1830. One loose stool at 1640. The GI panel came back."

**(B) Monitor.**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.6 F | **86** | **112/70** (84) | 16 | 99% room air | 1/10 | Normal sinus rhythm | 142 |

**Orthostatic vitals:** lying 112/70, HR 86; standing **104/66, HR 96**, no dizziness = **negative**.

**(C) Bedside.**
- Alert, **oriented x4**, joking with her husband. *"When can I go home? Ethan has a game on Thursday."*
- Hungry. Tolerating fluids; no nausea. Abdomen soft, non-tender, active bowel sounds.
- Voids: **1600 300 mL, 1730 320 mL, 1850 280 mL**. Loose stool 1640 about 200 mL. Intake 1500-1900: IV 425 + oral 480 = 905 mL; out 1,100 mL.
- Mucous membranes moist; skin turgor normal.

**(D) Chart appears by now:** 1700 labs (1750): **Na 133**, K 4.4, Cl 104, CO2 20, BUN 22, creatinine 1.0, glucose 112, Ca 9.2; dietitian note (1815); **GI panel: norovirus GI/GII detected (1820)**; sticky "Norovirus detected"; regular diet, no sodium restriction (1830); 1500-1900 I&O.
**Appears after (1930):** "ambulate with assist as tolerated" order.

**(E) Expected student actions.**
1. **Hand-off report (day RN to night RN)** with SBAR, including the sodium limit, the 2200 and 0400 hydrocortisone, the glucose plan and the orthostatic results.
2. **Evaluate the treatment with criteria** (Section 7.4): BP normal, HR under 100, orthostatics negative, alert and oriented x4, glucose stable without D50 since 1105, nausea gone and eating, urine output good, Na 133 (+7 in 13 hours; slowing), K 4.4, creatinine 1.0, normal ECG. **Response: effective.**
3. Sodium: 133 at 1700 = +1 in 4 hours after the fluid change: **the plan is working**. Still on the limit (134 until 0400).
4. **Norovirus:** continue contact (enteric) precautions until 48 hours after the diarrhea stops; **soap and water**; teach the husband about cleaning at home (bleach-based cleaner for the bathroom).
5. Diet: regular, **no salt restriction** (salt is good for her long term), but **no extra salt or salty broth tonight** while the sodium limit is on (until 0400); encourage fluids to thirst. Ambulation with assist after negative orthostatics.
6. Begin the **education plan** now that she is alert (assess what she knows; she believed "if I throw up my pill, I wait for the next dose").

**(F) Prompts if missed.**
- Says "she's fine" without data: "Which numbers prove that the hydrocortisone is working?"
- Puts her on a low-salt diet (the default heart diet habit): "What does Addison disease do to sodium? What did the dietitian say?"
- Removes the contact precautions because C. diff is negative: "What did the GI panel show? How long do the precautions stay?"

---

### CHECKPOINT 5: Monday 2300 (steroid insomnia, steroid hyperglycemia)

**(A) Read aloud.** "It's 2300. She ate 75% of her dinner at 2000. The 2100 labs are back. The hydrocortisone was due at 2200. She has the call light on: she can't sleep."

**(B) Monitor.**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.4 F | **80** | **116/72** (87) | 16 | 98% room air | 0/10 | Normal sinus rhythm | **152** |

Orthostatic vitals (every 8 hours): lying 116/72, HR 80; standing **112/70, HR 88**, no symptoms = negative.

**(C) Bedside.**
- Awake, restless, talkative: *"I'm wired. My mind won't stop. Who's going to take Ethan to school? Can I have something to knock me out?"*
- Oriented x4. No headache. Mild thirst.
- Voids: **2000 250 mL, 2130 250 mL, 2250 200 mL**. Intake 1900-2300: IV 400 + oral 720 = 1,120 mL.

**(D) Chart appears by now:** 2100 labs (2150): **Na 133, K 4.0**, Cl 104, CO2 21, BUN 18, creatinine 0.9, glucose 128, Ca 9.0; 1900-2300 I&O.
**Appears after (2315-2320):** melatonin 3 mg PRN order (2315); night hospitalist note (2320): no diphenhydramine or benzodiazepines; glucose 152 is a steroid effect, no insulin, call if over 180 twice.

**(E) Expected student actions.**
1. **Hydrocortisone 50 mg IV at 2200 given on time** (check the MAR).
2. **Insomnia:** recognize the steroid effect plus worry; **non-drug measures first** (lights down, cluster care, quiet, talk about her son, phone call to the husband), then melatonin per order. **No diphenhydramine or benzodiazepines** (falls at night with a water diuresis and an IV).
3. **Glucose 152:** expected after high-dose steroid and dinner in a person without diabetes; no insulin order; recheck per order; call if over 180 twice.
4. Sodium stable at 133 (limit 134 until 0400): keep the fluid as ordered.
5. Potassium 4.0 (from 6.0): falling as expected with fluid and steroid. **Anticipate it may go low**; know the next check (0100).
6. Night safety: bed alarm on, call light, **"call, don't fall"** teaching, urinal hat/commode close.

**(F) Prompts if missed.**
- Asks for a "sleeping pill" from the old order sets: "Which sleep aids are risky in a patient who is up to the bathroom every hour?"
- Wants sliding-scale insulin: "Is she diabetic? What is causing the 152?"
- Forgets the 2200 steroid: "When was the last dose? When does it wear off?"

---

### CHECKPOINT 6: Tuesday 0300 (near-fall at night; IV infiltration; falling potassium)

**(A) Read aloud.** "It's 0300. At 0240 the bed alarm went off. She had walked to the bathroom alone, had a soft loose stool, felt lightheaded, sat down on the toilet and pulled the cord. You found her sitting on the toilet. She did not fall. The 0100 labs are back."

**(B) Monitor.**
| Temp | HR | BP (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.2 F | **76** | **118/74** (89) | 14 | 98% room air | 0/10 | Normal sinus rhythm (T waves a little smaller) | 128 |

(If students check her on the toilet at 0242 you may first show HR 92, BP 106/68 with **Apply**, then return to the scenario values with "Back to scenario values" after she lies down.)

**(C) Bedside.**
- Embarrassed: *"I didn't want to bother anyone. I just got dizzy for a second."* No head strike, no pain, no injury on the skin check. Oriented x4. Glucose 128.
- **Right forearm 20 g IV:** puffy, pale, cool, about 3 cm of swelling above the site; the pump has not alarmed; she says it feels "tight". **The D5 0.45% NaCl is infiltrating.**
- Voids: **0030 250 mL, 0245 200 mL**. Soft loose stool 0240 about 150 mL. Intake 2300-0300: IV 400 + oral 240 = 640 mL.

**(D) Chart appears by now:** 0100 labs (0150): **Na 133, K 3.7**, Cl 103, CO2 22, BUN 15, creatinine 0.9, glucose 136, Ca 8.9, **Mg 1.9, phos 2.9**; 2300-0300 I&O.
**Appears after (0310):** night hospitalist event note (near-fall, infiltration plan, K 3.7 recheck at 0500, replace if 3.5 or lower).

**(E) Expected student actions.**
1. **Post-near-fall check:** ABCs, neuro check, glucose, BP/HR (lying and sitting), skin check, back to bed with help. Notify the provider; complete an event (safety) report per policy. Re-teach "call, don't fall"; bedside commode, light on, bed alarm, non-skid socks.
2. **Was this an adrenal relapse?** No: BP normal, alert, glucose normal, steroid on schedule. Likely lightheadedness from straining, getting up fast, and night-time diuresis.
3. **IV infiltration:** stop the infusion, **remove the right forearm IV**, elevate the arm, apply a compress per policy (non-vesicant), mark and measure, document (chart the device removal in the EHR). **Move the D5 0.45% NaCl to the 18 g left forearm IV.** Keep at least one working IV (the 0400 hydrocortisone is IV).
4. **Hydrocortisone 50 mg IV due 0400** through the left forearm IV.
5. **Potassium 3.7** (6.0 to 3.7 in 21 hours): recognize the trend (fluids, dextrose, hydrocortisone acting like aldosterone). Watch the telemetry; know the 0500 recheck.

**(F) Prompts if missed.**
- Leaves the swollen IV running: "Touch it. Compare the two arms. What do you do first?"
- Removes the only IV without a plan for 0400: "How is the 0400 hydrocortisone going in?"
- No event report or provider call: "Who needs to know about a near-fall, even without injury?"
- Ignores the potassium trend: "Where was it yesterday at 0400? Where is it going?"

---

### CHECKPOINT 7: Tuesday 0700 (recovery; oral switch; fludrocortisone restart; teaching)

**(A) Read aloud.** "It's 0700, Tuesday. She slept from about 0330. The 0500 labs are back. Endocrinology has written the plan to switch to pills. She wants to go home today."

**(B) Monitor.**
| Temp | HR | BP lying (MAP) | RR | SpO2 | Pain | Rhythm | POC glucose |
|---|---|---|---|---|---|---|---|
| 98.2 F | **74** | **120/76** (91) | 14 | 99% room air | 0/10 | Normal sinus rhythm | 112 |

Orthostatic vitals: lying 120/76, HR 74; standing **116/74, HR 80** = negative. **Weight (0600): 59.8 kg** (58.2 on arrival).

**(C) Bedside.**
- Alert, oriented x4, eating toast. *"I feel like myself. I never want to go through that again. What do I do next time Ethan gets sick?"*
- Husband back at 0700: *"Show me the shot. I'll be the one giving it if she can't."*
- No vomiting since 0440 yesterday; last stool 0240 (soft). Voids **0430 250 mL, 0640 250 mL**. Intake 0300-0700: IV 400 + oral 360 = 760 mL.
- Skin still tanned (this fades slowly over months on treatment).

**(D) Chart appears by now:** blood cultures no growth at 24 hours (0530), CBC (0545): **WBC 12.6, Hgb 11.9, Hct 35.6, Plt 231, eosinophils 0.4%**; **0500 labs (0550): Na 134, K 3.5**, Cl 103, CO2 23, BUN 13, **creatinine 0.8**, glucose 118, Ca 8.9, Mg 1.8, phos 3.1, albumin 3.6; **KCl 20 mEq PO once (order 0610, due 0630)**, BMP Tuesday 1300; hospitalist note (0615); case management consult (0630); **endocrinology note (0630)**; **oral hydrocortisone taper order** (20 mg 1000 / 20 mg 1500 / 10 mg 2000; then 30 + 10 until the diarrhea has stopped for 24 hours; then 15 + 5) (0635); **fludrocortisone 0.1 mg daily restart Tue 0800** (0635); saline lock at 1000 (0635); **teaching order** (0635); discharge prescriptions with two emergency kits (0640); pharmacy teaching plan (0640); case management note (0650); levothyroxine due 0600; 0300-0700 I&O.

**(E) Expected student actions.**
1. **Evaluate the whole treatment against the criteria** (Section 7.4) and say it out loud: all met.
2. **Sodium 126 to 134 in 25 hours = +8: at the limit, not over.** No neuro signs. Safe.
3. **Potassium 3.5:** give KCl 20 mEq PO (0630) with a snack and water, whole tablet; know that **fludrocortisone restarting at 0800** will lower potassium further; BMP at 1300.
4. **Levothyroxine 88 mcg at 0600** on an empty stomach (resumed today). Explain "steroids first, thyroid hormone second".
5. **Understand the transition:** last IV hydrocortisone 0400; first oral dose 1000 (6 hours later). Total today 50 mg; **fludrocortisone restarts at 0800 because hydrocortisone is now 50 mg/day**, no longer enough mineralocorticoid effect.
6. **Teaching with teach-back (patient AND husband):** sick-day rules, the emergency injection with **return demonstration** (training Act-O-Vial: press, swirl, draw 2 mL, outer thigh, 90 degrees, then call 911), medical alert ID, steroid emergency card, extra tablets everywhere, school-nurse letter, when to go to the ED. Use the pharmacy teaching plan.
7. Hemoglobin 14.6 to 11.9: recognize **dilution** (rehydration), not bleeding. WBC 12.6 with no fever: steroid effect. Eosinophils gone: cortisol is back.
8. Discharge readiness per endocrinology: keeps the 1000 and 1500 oral doses down, eats lunch, orthostatics negative, 1300 potassium normal. Contact precautions continue until 48 hours after the diarrhea stops.

**(F) Prompts if missed.**
- Teaches by talking only: "How will you know they can do it at 2 a.m. when she is vomiting?" (return demonstration).
- Says "double the dose if you feel sick": "When do you double? When do you triple? When do you inject instead of taking pills?"
- Forgets the husband: "Who gives the shot if she is confused on the bathroom floor again?"
- Confused about fludrocortisone: "Why was it held yesterday and why does it start today?"

---

## 5. Release schedule for smaller time steps (use 1h ▶ or Next event)

| Time | What appears in the chart |
|---|---|
| 0730 | Endocrinology and pharmacy consults; stool C. difficile PCR and GI panel order |
| 0830 | Pharmacy medication history (no kit, no sick-day teaching) |
| 0900 | (glucose check due: give **72**) |
| 0915 | Hospitalist progress note |
| 0950 | 0900 labs: Na 128, K 5.5, Cr 1.4, glucose 74, lactate 1.4 |
| 1000 | **Hydrocortisone 50 mg IV due** |
| 1100 | 0700-1100 I&O block; (glucose check: give **58**, then 142 at 1120) |
| 1130 | Hospitalist hypoglycemia note; glucose every hour x2 then every 2 hours order |
| 1240 | C. difficile PCR negative |
| 1300 | (glucose check: give **104**) |
| 1310 | **Cortisol 1.8** (drawn 0406, before steroid) |
| 1340 | ECG 1330: normal sinus 94, T waves normal (with picture) |
| 1345 | Clear liquid diet; renin/aldosterone add-on |
| 1350 | 1300 labs: **Na 132**, K 4.9, Cr 1.2; renin/aldosterone "pending send-out" |
| 1400 | Dietitian consult; **endocrinology consult note** |
| 1440 | **ACTH 1,240** |
| 1450 | Endocrinology addendum (primary adrenal insufficiency) |
| 1500 | 1100-1500 I&O block (urine 1,050 mL) |
| 1530 | **Stop D5NS; start D5 0.45% NaCl 100 mL/h (due)**; sodium-limit order; sticky "Sodium limit"; problem "sodium correcting too fast" |
| 1535 | Hospitalist note (sodium, orthostatics) |
| 1545 | Up with 1 assist; repeat orthostatics at 1900 |
| 1600 | **Hydrocortisone 50 mg IV due** |
| 1750 | 1700 labs: Na 133, K 4.4, Cr 1.0 |
| 1815 | Dietitian note |
| 1820 | **Norovirus detected**; sticky; problem |
| 1830 | Regular diet, no sodium restriction |
| 1900 | 1500-1900 I&O block |
| 1930 | Ambulate with assist |
| 2100 | Enoxaparin 40 mg SubQ due |
| 2150 | 2100 labs: Na 133, K 4.0 |
| 2200 | **Hydrocortisone 50 mg IV due** |
| 2300 | 1900-2300 I&O block |
| 2315-2320 | Melatonin PRN order; night hospitalist note |
| 0150 | 0100 labs: Na 133, **K 3.7**, Mg 1.9, phos 2.9 |
| 0240 | (portray the near-fall and the infiltrated IV) |
| 0300 | 2300-0300 I&O block |
| 0310 | Night event note |
| 0400 | **Hydrocortisone 50 mg IV due (last IV dose)** |
| 0530-0550 | Blood cultures no growth 24 h; CBC (Hgb 11.9, eos 0.4%); 0500 labs: **Na 134, K 3.5**, Cr 0.8 |
| 0600 | Levothyroxine 88 mcg due |
| 0610-0615 | **KCl 20 mEq PO (due 0630)**; BMP 1300 order; hospitalist note |
| 0630-0650 | Case management consult; endocrinology note; oral taper; **fludrocortisone restart 0800**; saline lock; teaching order; discharge prescriptions; pharmacy and case management notes |
| 0700 | 0300-0700 I&O block |

---

## 6. SBAR examples (model answers for the phone calls)

**1) 1102, RN to the hospitalist (hypoglycemia)**
- **S:** "This is the RN for Lauren Mitchell in 4W-22. Her glucose is 58. She is shaky, sweaty and more confused, HR 112, BP 94/58. I am giving dextrose 50% 25 g IV now per the protocol."
- **B:** "She's 46 with Addison disease, admitted in adrenal crisis. Glucose was 52 in the ED, 72 at 0900. She's on D5NS at 150 and is nauseated. Hydrocortisone 50 mg IV was given at 1000."
- **A:** "I think this is from the cortisol deficiency and no food; the hydrocortisone has not had time to work."
- **R:** "I will recheck in 15 minutes. Do you want more frequent glucose checks, and may I give ondansetron so she can start clear liquids? Can you come see her?"

**2) 1505, RN to the hospitalist (sodium rising too fast)**
- **S:** "Lauren Mitchell in 4W-22. Her sodium went from 126 at 0406 to 132 at 1300: up 6 in 9 hours. She made 1,050 mL of pale urine in the last 4 hours, about 260 an hour."
- **B:** "Adrenal crisis on hydrocortisone 50 mg every 6 hours and D5NS at 150. The order says no more than 8 in 24 hours."
- **A:** "She is alert and oriented x3 with no neuro changes, but at this rate she will go past the limit tonight. Her orthostatics are positive: 108/66 lying to 94/60 standing, HR 92 to 114, dizzy. She is drinking clear liquids."
- **R:** "Would you like to change the IV fluid or the rate, and when should I recheck the sodium? What sodium or urine output do you want me to call for? I'm keeping her up with assist only."

**3) 0250, RN to the night hospitalist (near-fall, IV)**
- **S:** "Lauren Mitchell, 4W-22. At 0240 she walked to the bathroom alone, felt lightheaded and sat down on the toilet. No fall, no injury."
- **B:** "Adrenal crisis day 1, improving; orthostatics negative at 1900 and 2300. On D5 0.45% NaCl at 100 through the right forearm IV."
- **A:** "Now BP 118/74, HR 76, alert, glucose 128. The right forearm IV is infiltrated: 3 cm of cool swelling. I stopped the fluid. The 0100 potassium is 3.7, down from 6.0."
- **R:** "I'm removing that IV and moving the fluid to the left forearm 18 g so the 0400 hydrocortisone can go in. Do you want anything for the potassium before the 0500 labs? I've put her on the commode and bed alarm and will file a safety report."

**4) 0700 Tuesday, night RN to day RN (handoff, short)**
- **S:** "Lauren Mitchell, 46, day 2 of adrenal crisis; switching to oral steroid today, possible discharge this afternoon."
- **B:** "Addison disease; crisis from norovirus gastroenteritis with vomited steroid doses. No emergency kit at home. Last IV hydrocortisone 0400."
- **A:** "Vitals normal, orthostatics negative, alert x4, eating. Sodium 134 (limit reached, not passed). K 3.5: KCl given at 0630. Near-fall at 0240 without injury, right forearm IV removed for infiltration; left forearm 18 g with D5 0.45% at 100."
- **R:** "Oral hydrocortisone 20 mg at 1000, fludrocortisone 0.1 mg at 0800, saline lock at 1000 if drinking, BMP 1300. Teaching with return demonstration for her and her husband before discharge. Contact precautions continue."

---

## 7. Answer key: pathophysiology, priority interventions, rationales

### 7.1 Pathophysiology (what to explain)

**The adrenal cortex makes cortisol and aldosterone.** In autoimmune Addison disease the cortex is destroyed, so both are missing for life (primary adrenal insufficiency). The pituitary keeps making more ACTH to "push" the gland.

| Missing hormone / high hormone | What it normally does | What Lauren shows |
|---|---|---|
| **Cortisol** | Keeps blood vessels responsive to adrenaline/noradrenaline (vascular tone); makes glucose in the liver between meals; needed for the stress response; switches off ADH (helps excrete water) | **Shock** (74/40) that responds poorly to fluid alone; **hypoglycemia** (49-58); weakness, fatigue, nausea, vomiting, **belly pain**, confusion; low-grade temperature; **eosinophilia** (7%) and relative lymphocytosis; **ADH release** (adds to low sodium) |
| **Aldosterone** | Kidney keeps sodium and water, excretes potassium and acid | **Salt wasting**: urine Na 48 despite dehydration; **hyponatremia** 126; **hyperkalemia** 6.0 with **peaked T waves**; mild acidosis (CO2 18); **hypovolemia** and prerenal AKI (creatinine 1.6, BUN 38); salt craving; orthostatic hypotension |
| **High ACTH** (primary disease only) | ACTH and melanocyte-stimulating hormone come from the same precursor (POMC) | **Hyperpigmentation**: tan skin, palm creases, knuckles, gums/cheeks, scars |

**Why a "stomach bug" causes a crisis.** Illness raises the body's cortisol need 2-10 times. A healthy adrenal gland responds; hers cannot. Vomiting means no absorbed hydrocortisone at all, and diarrhea/vomiting add salt and water loss on top of the aldosterone deficiency. Without sick-day rules (double dose, injection), she went from a normal day to shock in about 48 hours.

**Other labs.** Calcium 10.6 (mild, from volume contraction; falls with fluid). Hemoconcentration on arrival (Hgb 14.6) falls to 11.9 after about 7.5 L of fluid in (net about +2.5 L) and an albumin drop from 4.6 to 3.6: dilution, not bleeding. TSH 4.6 mildly high is common in untreated adrenal insufficiency; do not raise levothyroxine now.

**Primary vs secondary adrenal insufficiency.** Primary (adrenal gland): cortisol low, **ACTH high**, aldosterone low (high K, salt wasting), **hyperpigmentation**; needs hydrocortisone AND fludrocortisone. Secondary (pituitary) or tertiary (long-term steroid use stopped suddenly): cortisol low, ACTH low/normal, aldosterone normal (potassium normal), no tanning; needs glucocorticoid only.

### 7.2 Why stress-dose hydrocortisone covers the mineralocorticoid need; why fludrocortisone is held and then restarted

- Hydrocortisone is the same molecule as cortisol. At normal levels the kidney enzyme 11-beta-HSD2 inactivates cortisol before it reaches the aldosterone (mineralocorticoid) receptor. **At high doses (more than about 50 mg a day) the enzyme is saturated** and hydrocortisone binds the receptor, acting like aldosterone (about 40 mg of hydrocortisone is roughly equal to 0.1 mg of fludrocortisone).
- So **200 mg/day IV hydrocortisone treats both deficiencies at once**. Adding fludrocortisone would add fluid retention and potassium loss with no benefit, and she could not absorb pills while vomiting. **Fludrocortisone is held from 0640 Monday.**
- When the dose drops to **50 mg/day oral (Tuesday)**, the aldosterone-like effect fades, so **fludrocortisone 0.1 mg restarts Tuesday 0800**. Without it she would lose salt again (low sodium, high potassium, dizziness).
- **Why not dexamethasone?** It has no mineralocorticoid effect and is not the choice in known primary adrenal insufficiency in crisis. Hydrocortisone is the drug of choice. (If adrenal insufficiency is only suspected and a stimulation test is planned, some protocols use dexamethasone; not this case.)
- **Do not delay the steroid for tests.** Draw cortisol and ACTH (and renin/aldosterone) with the first labs if it takes seconds; never wait for results.

### 7.3 Safe sodium correction

- Her hyponatremia developed over 2-3 days (chronic: more than 48 hours), so the brain has adapted. A fast rise shrinks brain cells and can cause **osmotic demyelination syndrome** (trouble speaking and swallowing, weakness, confusion, quadriparesis, "locked-in"), appearing 2-6 days later.
- **Goal 4-6 mmol/L in 24 hours. Upper limit 10 mmol/L in 24 hours for most patients with chronic hyponatremia, and 8 mmol/L when the risk of osmotic demyelination is high** (sodium 105 or lower at the start, low potassium, alcohol use disorder, malnutrition, liver disease). **This case uses the conservative limit of 8** (the order and the hospital's policy), because correction after cortisol replacement is fast and hard to predict.
- **Why adrenal crisis is a set-up for over-correction:** treatment removes BOTH causes of water retention at once. Volume is restored and cortisol returns, so ADH switches off and the kidneys pour out dilute urine (water diuresis). Saline also adds sodium.
- **Lauren's numbers:** 126 (0406) -> 128 (0900) -> **132 (1300, +6 in 9 h)** -> fluid changed 1530 -> 133 (1700) -> 133 (2100) -> 133 (0100) -> **134 (0500, +8 in 25 h)**.
- **Nursing:** trend every result against the first value and the clock; watch urine output and color (over 250 mL/h pale urine is the warning sign); call early. Provider options: lower-sodium fluid (used here: D5 0.45% NaCl), D5W to replace urine water, desmopressin ("DDAVP clamp") to stop the water loss; in over-correction, re-lowering the sodium.

### 7.4 Evaluation criteria: is the therapy working?

| Criterion | Target | Lauren |
|---|---|---|
| Blood pressure / MAP | SBP 100 or more, MAP 65 or more without pressors | 98/60 (0700) -> 108/66 (1500) -> 120/76 (Tue 0700) |
| Orthostatic vitals | Negative | Positive 1500 -> negative 1900, 2300, Tue 0700 |
| Heart rate / rhythm | Under 100; T waves normal | 104 tach, peaked T -> 92 sinus, normal T (ECG 1330) -> 74 |
| Mental status | Back to baseline | Oriented x2 -> x3 at 1500 -> x4 at 1900 |
| Glucose | 70-180 without dextrose boluses | 58 at 1100 (D50) -> 104-152 after 1300 |
| Sodium | Rising, no more than 8 in 24 h | 126 -> 134 in 25 h |
| Potassium | Normal; T waves normal | 6.0 -> 4.9 (1300) -> 3.5 (replace) |
| Kidney function / urine | Creatinine to baseline; urine over 0.5 mL/kg/h | 1.6 -> 0.8; urine 95-260 mL/h |
| GI | Nausea gone, eating, no vomiting | Clear liquids 1345, regular 1830, no vomiting after 0440 |
| Temperature / eosinophils | Normal | 99.8 -> 98.2; eosinophils 7% -> 0.4% |

### 7.5 Expected priority interventions with rationales

| Priority | Intervention | Rationale |
|---|---|---|
| 1 | Hydrocortisone 50 mg IV every 6 hours **on time**; never held for a "good" BP | Replaces cortisol (and aldosterone at this dose); a late dose lets the crisis come back |
| 2 | Perfusion: BP/MAP, HR, mental status, urine, telemetry | Shock is the main threat; potassium 6.0 can cause arrhythmia |
| 3 | Glucose every 2 hours; hypoglycemia protocol (D50 when not safe to swallow); keep the dextrose fluid | No glycogen without cortisol |
| 4 | Sodium and potassium trends against the limit; call early | Safe correction; potassium will fall |
| 5 | Fall prevention: orthostatics before walking, assist, bed alarm, commode | Hypovolemia, diuresis, confusion, IV, steroid insomnia |
| 6 | Contact (enteric) precautions, soap and water | C. difficile and norovirus spread by hands; gel does not work well |
| 7 | IV site checks; keep a working IV | D50 is a vesicant; IV hydrocortisone needs access |
| 8 | Hold fludrocortisone until the dose is 50 mg/day; resume Tuesday 0800 | See 7.2 |
| 9 | Teaching with return demonstration (patient and husband) | The crisis was preventable |

### 7.6 Sick-day rules and the emergency injection (teaching key)

1. **Fever 100.4 F (38 C) or more, or illness needing bed rest or antibiotics: double the daily hydrocortisone dose. Fever 102.2 F (39 C) or more: triple it.** Until 24-48 hours after recovery. Call the clinic. (Fludrocortisone dose does not change.)
2. **Vomiting or diarrhea:** if a dose is vomited within 30 minutes, repeat it. If she vomits again, has severe diarrhea, cannot keep pills down, or feels faint/confused: **inject hydrocortisone 100 mg IM** in the outer thigh and **call 911 / go to the ED**.
3. Never skip or stop hydrocortisone; carry extra tablets; keep a kit at home and one in her bag; check expiry every 6 months.
4. Wear a **medical alert ID**; carry a **steroid emergency card**; tell every provider, dentist and the school nurse. Surgery, procedures, labor and major injuries need extra steroid.
5. Signs to act on: dizziness when standing, vomiting, belly pain, extreme weakness, confusion, salt craving.
6. Injection steps: press the Act-O-Vial plunger, swirl, draw 2 mL, 1-1.5 inch needle, outer thigh at 90 degrees (through clothing if needed), then 911.

---

## 8. DEBRIEFING

### 8.1 Debrief structure (PEARLS: Gather, Analyze, Summarize) - 40-45 minutes

**Before you start:** ground rules: "This is a safe space. We talk about what we did, not about who we are. Everything stays in this room." Seat students in a circle; take 1 minute to breathe.

| Phase | Time | What you do |
|---|---|---|
| **1. Reactions** | 5 min | "How are you feeling? What stands out?" Every student says one word or sentence. |
| **2. Description** | 5 min | One student gives a 2-minute summary. Put the trends on the board: **Na 126, 128, 132, 133, 133, 133, 134; K 6.0, 5.5, 4.9, 4.4, 4.0, 3.7, 3.5; SBP 98, 94, 108, 112, 116, 118, 120; glucose 88, 72, 58, 104, 118, 142, 152, 128, 112.** |
| **3. Analysis** | 20-25 min | Use the questions in 8.2 (pick 6-8). Ask "What were you thinking when...?" before giving the answer. Advocacy with inquiry: *"I noticed X. I was concerned because Y. Help me understand what you were thinking."* |
| **4. Application and Summary** | 8-10 min | Each student writes **one thing they will do differently on clinical** and one thing they did well. Close with the take-aways. |

**Key take-aways to close with.**
1. **Known adrenal insufficiency + vomiting = emergency.** Steroid first; tests never delay it.
2. **Hydrocortisone is time-critical.** On time, never held for "good" numbers.
3. **High-dose hydrocortisone covers aldosterone too**; fludrocortisone comes back when the dose is 50 mg/day or less.
4. **Evaluate with data:** BP and orthostatics, HR and T waves, glucose, mental status, urine, sodium and potassium.
5. **A rising sodium can be a danger:** count the change from the first value and the hours; watch the urine.
6. **Falls happen when patients feel better** (diuresis, steroid insomnia, night).
7. **Teach to prevent the next crisis:** sick-day rules, the injection with return demonstration, the ID.

### 8.2 Discussion questions with model answers (15)

1. **Why did a stomach bug make Lauren critically ill when her son only felt sick?**
   *Model:* Her adrenal glands cannot raise cortisol for stress, and vomiting stopped her only source (pills). Diarrhea and vomiting also lost salt and water on top of her aldosterone deficiency. Without extra steroid she developed shock, hypoglycemia, low sodium and high potassium.

2. **Which findings at 0700 come from missing cortisol, which from missing aldosterone, and which from high ACTH?**
   *Model:* Cortisol: low BP/tachycardia, glucose 49-52, nausea, belly pain, confusion, eosinophilia. Aldosterone: Na 126, K 6.0 with peaked T waves, urine Na 48, dehydration, prerenal AKI, salt craving. High ACTH: tanned skin, palm creases, gums, scar.

3. **Why were cortisol and ACTH drawn at 0406 if the hydrocortisone was given anyway?**
   *Model:* A sample before treatment documents the diagnosis (after hydrocortisone the cortisol level is meaningless). It takes seconds with the first IV labs. But treatment is never delayed for the draw or the result.

4. **What does cortisol 1.8 with ACTH 1,240 mean?**
   *Model:* Primary adrenal insufficiency: the gland cannot respond, so the pituitary sends more ACTH. It explains the hyperpigmentation and the need for fludrocortisone (aldosterone is also missing).

5. **Why is fludrocortisone held on Monday and restarted Tuesday at 0800?**
   *Model:* At more than 50 mg/day, hydrocortisone also stimulates the mineralocorticoid receptor, so 200 mg/day covers aldosterone. On Tuesday the dose falls to 50 mg/day oral, the effect fades, and fludrocortisone 0.1 mg is needed again.

6. **What would you do if the 1000 hydrocortisone were not available from pharmacy on time?**
   *Model:* Treat as an emergency: call pharmacy and the provider right away, use the unit cabinet stock, give it as soon as possible; if the IV is lost it can be given IM. Document the time and the reason. Never "wait for the next dose".

7. **Why did she become hypoglycemic at 1100 while on D5NS?**
   *Model:* Without cortisol the liver cannot make glucose and glycogen is used up; she had nothing by mouth; hydrocortisone takes hours to correct this. Treat (D50 because she is nauseated and foggy), recheck in 15 minutes, check that the steroid was given on time, and plan food.

8. **How did you know the sodium was rising too fast, and why did it happen?**
   *Model:* 126 to 132 = +6 in 9 hours; at that pace she would pass +8 in 24 hours. Fluids and cortisol switched off ADH and she had a water diuresis (about 260 mL/h of pale urine). Saline also adds sodium.

9. **What harm can a too-fast sodium correction cause and when would you see it?**
   *Model:* Osmotic demyelination syndrome, usually 2-6 days later: trouble speaking (dysarthria), trouble swallowing (dysphagia), weakness, confusion, seizures, locked-in syndrome. It is preventable and often permanent.

10. **Interpret the 1500 orthostatic vitals. What do you do with the result?**
    *Model:* Lying 108/66 HR 92, standing 94/60 HR 114 with dizziness: positive (systolic -14, HR +22 with symptoms). She is still volume-depleted upright. Up with assist only, dangle first, encourage oral fluids (but no extra salt or salty broth while the sodium is rising too fast), recheck later, tell the provider.

11. **Which data at 1900 prove the treatment is working?**
    *Model:* BP 112/70 lying, orthostatics negative, HR 86 sinus with normal T waves, oriented x4, glucose stable without D50, eating without nausea, good urine, Na 133 (safe), K 4.4, creatinine 1.0.

12. **Why is she "wired" at 2300 with a glucose of 152, and what do you do?**
    *Model:* High-dose steroid causes insomnia, mood changes and raised glucose. Non-drug sleep measures, melatonin if ordered, no sedating antihistamines or benzodiazepines (falls). No insulin: she is not diabetic; recheck, call if over 180 twice.

13. **Why did the potassium fall from 6.0 to 3.5, and why does it matter on Tuesday morning?**
    *Model:* Fluids (dilution and kidney flow), dextrose (moves potassium into cells with insulin), and hydrocortisone acting like aldosterone (kidney excretion). Fludrocortisone restarts at 0800 and will lower it further: replace (KCl 20 mEq), recheck at 1300, watch the rhythm.

14. **Lauren nearly fell at 0240. What made her high risk at night, even though she was "better"?**
    *Model:* Night-time diuresis and loose stools (urgency), recent orthostatic hypotension, steroid insomnia, IV pole, new environment, not wanting to "bother" the nurse. Prevention: scheduled toileting, commode at the bedside at night, bed alarm, call-don't-fall teaching, light on.

15. **What exactly will you teach Lauren and Daniel before discharge, and how will you check it?**
    *Model:* Sick-day rules (double for fever 100.4 F or illness, triple for 102.2 F; inject and go to the ED for vomiting/diarrhea or confusion), the IM injection with **return demonstration by both**, medical alert ID, steroid card, extra tablets, school-nurse letter, follow-up in 1-2 weeks. Teach-back: "Tell me what you will do if Ethan's stomach bug comes back and you vomit your morning dose twice."

### 8.3 What went well / what to improve (capture table; print and fill in on the board)

| Topic | What went well | What to improve | One action for next time |
|---|---|---|---|
| Recognizing adrenal crisis and its trigger | | | |
| Hydrocortisone on time (1000, 1600, 2200, 0400) | | | |
| Hypoglycemia treatment and cause | | | |
| Sodium trend and the 1505 SBAR | | | |
| Orthostatic vitals and fall prevention | | | |
| Potassium trend and telemetry | | | |
| Contact (enteric) precautions | | | |
| IV site care (infiltration) | | | |
| Evaluating the response with data | | | |
| Teaching and teach-back (injection return demonstration) | | | |
| Teamwork and communication | | | |
| Documentation | | | |

### 8.4 Common pitfalls (watch for these and bring them up)

1. **Late, held or missed hydrocortisone** ("BP is fine now", "she is NPO", "waiting for pharmacy").
2. **Giving the home oral hydrocortisone or fludrocortisone** on top of the IV stress dose, or not knowing why fludrocortisone is held.
3. **Treating a low glucose with juice while she is vomiting or drowsy**; no 15-minute recheck; stopping the dextrose fluid.
4. **Not trending the sodium against time**; celebrating a fast rise; ignoring a liter of pale urine in 4 hours.
5. **Treating the hyponatremia as "too much water"** (fluid restriction): her low sodium is from salt and volume loss and needs saline, then a careful pace.
6. **Expecting the potassium to stay high**; giving a potassium binder or holding potassium replacement on Tuesday.
7. **Skipping orthostatic vitals** or doing them alone without a safety plan; letting her walk when she "feels better".
8. **Sedatives for steroid insomnia** (diphenhydramine, benzodiazepines).
9. **Alcohol gel only** for C. difficile/norovirus; removing precautions after a negative C. difficile test.
10. **Insulin for a steroid glucose of 152** in a patient without diabetes.
11. **Leaving an infiltrated IV running**, or removing the only IV before a due IV dose.
12. **A low-salt diet** for a patient with Addison disease.
13. **Teaching by telling only**; no return demonstration; leaving out the husband; vague sick-day rules.

### 8.5 Prevention and teaching points (for students to take away)

- **Every patient on long-term steroid replacement needs:** written sick-day rules, an emergency injection kit (and a person trained to give it), a medical alert ID and a steroid card. Ask about these at every admission and discharge.
- **Patients on long-term steroids for other reasons** (asthma, arthritis, transplant) can also get adrenal crisis when the steroid is stopped suddenly or during illness/surgery (secondary/tertiary adrenal insufficiency). Never stop steroids abruptly; taper.
- **Stress dosing for procedures and surgery** is needed: flag it on the chart.
- **Thyroid and adrenal together:** in a patient with both problems, treat the adrenal first; thyroid hormone alone can trigger a crisis.
- **System fixes:** mark IV hydrocortisone as time-critical on the MAR; stock it in unit cabinets; an endocrine "steroid dependent" banner in the EHR; pharmacist kit check at discharge.

### 8.6 Sample NCLEX-style questions

1. *A client with Addison disease has vomited three times since yesterday. BP 80/46, HR 122, glucose 54, confused. Which action is the nurse's FIRST priority after establishing IV access?*
   A. Give the client's oral hydrocortisone with a sip of water. B. Prepare hydrocortisone 100 mg IV as ordered. C. Restrict fluids to 1 L/day. D. Obtain a urine specimen.
   **Answer: B.** Stress-dose IV hydrocortisone treats the cause; oral will not be absorbed; fluid restriction is harmful.
2. *Which set of laboratory results is expected in adrenal crisis from primary adrenal insufficiency?*
   A. Na 148, K 3.0, glucose 260. B. Na 126, K 6.0, glucose 52. C. Na 138, K 4.0, glucose 90. D. Na 130, K 3.1, glucose 300.
   **Answer: B.**
3. *A client's sodium was 126 mmol/L at 0400 and is 132 mmol/L at 1300. Urine output is 260 mL/h. What is the nurse's best action?*
   A. Increase the IV rate to keep up with the urine. B. Document the improvement. C. Notify the provider that the sodium is rising faster than the safe limit. D. Encourage free water.
   **Answer: C.** +6 in 9 hours with a water diuresis will exceed 8 in 24 hours.
4. *The client receiving hydrocortisone 50 mg IV every 6 hours asks why her fludrocortisone is on hold. The best response is:*
   A. "It is not needed for Addison disease." B. "This high dose of hydrocortisone also does the job of fludrocortisone; it will be restarted when the dose is lowered." C. "It interacts with IV fluids." D. "Your potassium is too low."
   **Answer: B.**
5. *Select all that apply. Which statements by a client with adrenal insufficiency show understanding of sick-day rules?*
   1. "If I have a fever of 101, I will double my hydrocortisone." 2. "If I vomit my pill twice, I will use my injection and go to the ER." 3. "If I feel sick I will skip my dose until I can eat." 4. "I will wear a medical alert bracelet." 5. "My husband will learn to give the shot."
   **Answer: 1, 2, 4, 5.**
6. *Which finding best shows that treatment of adrenal crisis is effective?*
   A. Skin pigmentation has faded. B. Orthostatic vital signs are negative and glucose is stable without dextrose. C. Potassium is 3.4 mmol/L. D. Weight is down 2 kg.
   **Answer: B.** (Pigmentation fades over months; low potassium needs action; weight should rise with rehydration.)

---

## 9. Troubleshooting for the instructor

- **Students are far ahead or behind the clock:** use **1h ▶** and the release schedule. You may move a monitor change earlier to match a student action.
- **Students give the 1000 hydrocortisone late or miss it:** keep the 1100 hypoglycemia and use it to debrief; you may also lower BP to 88/54 and raise HR to 118 with **Apply** for 15 minutes ("she looks worse") until the dose is given, then go back to the scenario values.
- **Students catch the sodium before 1500** (for example right after the 1350 result): excellent. Call back as the hospitalist with the 1530 orders early.
- **Students give fludrocortisone or oral hydrocortisone in addition (error):** debrief it (fluid, low potassium, duplicate steroid); no change to the monitor needed.
- **Students restrict fluids for the low sodium (error):** stop the scene: "What type of hyponatremia is this?" Then return to the script.
- **Students remove the infiltrated IV and forget the 0400 dose route:** prompt with the MAR.
- **Monitor limits:** if your simulator cannot show tall T waves, announce "tall, pointed T waves" at 0700 and "normal T waves now" at 1500.
- **Print the student materials only; do not give students this guide.**

*Source of truth for the chart: casestudy/cases/addison/DESIGN.md. If the chart and this guide ever disagree, the numbers in DESIGN.md win.*

---

## Bedside Monitor page (optional, for the projector)

Open `monitor.html` (same web address as the EHR, for example `.../monitor.html`) in a second tab of the **same browser**, or press the **Monitor** button in the EHR top bar, and drag it to the projector. The monitor reads which patient is open in the EHR (by MRN) and loads **Lauren Mitchell's built-in scenario** (MRN SIM-40422) with her vitals and rhythm for every checkpoint; for any patient without a built-in scenario it falls back to Ray Kessler's. When you press 4h in the EHR, the monitor moves to that checkpoint (the BP cuff cycles shortly after, like a real monitor). Press **C** for instructor controls (change any number, rhythm or time), **N** to measure BP, **F** for full screen, **S** for sound. If you edit and **Save** the scenario, it is kept in this browser for this patient only; **Reset to built-in scenario** restores the rows below.

The monitor BP is the **lying** value. Each row's note (shown in the control panel) lists the standing values for orthostatic checks.

| Time | HR | SpO2 | BP (lying) | RR | Temp F | Rhythm | PR / QRS (s) | T wave | Note |
|---|---|---|---|---|---|---|---|---|---|
| Mon 0700 | 104 | 98 | 98/60 | 18 | 99.4 | Sinus tachycardia | 0.15 / 0.09 | tall (0.6) | Not safe to stand |
| Mon 1100 | 112 | 98 | 94/58 | 20 | 99.0 | Sinus tachycardia | 0.15 / 0.09 | 0.5 | Glucose 58 |
| Mon 1500 | 92 | 99 | 108/66 | 16 | 98.8 | Normal sinus | 0.15 / 0.09 | 0.3 | Standing 94/60, HR 114, dizzy |
| Mon 1900 | 86 | 99 | 112/70 | 16 | 98.6 | Normal sinus | 0.16 / 0.09 | 0.3 | Standing 104/66, HR 96 |
| Mon 2300 | 80 | 98 | 116/72 | 16 | 98.4 | Normal sinus | 0.16 / 0.09 | 0.3 | Standing 112/70, HR 88 |
| Tue 0300 | 76 | 98 | 118/74 | 14 | 98.2 | Normal sinus | 0.16 / 0.09 | 0.25 | Near-fall 0240; IV infiltrated |
| Tue 0700 | 74 | 99 | 120/76 | 14 | 98.2 | Normal sinus | 0.16 / 0.09 | 0.25 | Standing 116/74, HR 80 |

All on room air.

# Instructor Guide: Diabetic Ketoacidosis, In-Class Patient (Caleb Mercer)
**Patient: Caleb Mercer, 28-year-old man, room SD-3, Medical-Surgical Step-Down with telemetry. Monday 01/11/2027 0700 to Tuesday 01/12/2027 1900 (36 hours, ten 4-hour checkpoints).**

*Plain-language, printable. Everything here matches the EHR chart (`patient.json`, built from `DESIGN.md`) and Caleb's built-in bedside-monitor scenario (MRN SIM-40601). If the chart and this guide ever disagree, the numbers in DESIGN.md win. Do not give this guide to students.*

---

## 1. At a glance

**Overview.** Caleb has had type 1 diabetes for 12 years and takes insulin glargine 24 units at bedtime plus insulin lispro with meals. A flu-like illness took his appetite, so he stopped his long-acting insulin for two nights ("I wasn't eating, so I thought I'd go low"), vomited all Sunday, and his sister Tessa found him drowsy and breathing fast and deep at 0100 Monday. He arrives on the unit at 0700 in moderate-to-severe DKA (pH 7.18, bicarbonate 8, anion gap 28, beta-hydroxybutyrate 6.4), already on a fixed-rate insulin infusion of 7.6 units/h and 0.9% saline, with droplet precautions while a viral panel is pending. Over 36 hours the students are his unit RNs, day and night: they start the dextrose line, give potassium safely through peripheral IVs, stop droplet precautions when the panel is negative, hold insulin for a potassium of 3.2, manage a potassium IV infiltration, catch three unsafe provider orders, find a disconnected dextrose line behind a glucose of 62, confirm that the DKA is resolved, make the switch to SubQ insulin with a 2-hour overlap, and teach the sick-day rules so it does not happen again. He goes home the morning of Day 3 after one night on SubQ insulin.

**This is a teaching case about safe protocol care and evaluation.** Caleb gets better if the students follow the protocol and question what does not fit. Each checkpoint has one main thing to notice and act on.

**Learning objectives.** By the end, the student will be able to:
1. Recognize DKA and its trigger (basal insulin stopped during illness), and explain the signs: high glucose, ketones, an anion-gap acidosis, Kussmaul breathing, fruity breath, dehydration.
2. Run the fixed-rate DKA protocol safely: insulin 0.1 unit/kg/h (7.6 units/h) not titrated to glucose, a separate D10 line when glucose is under 250, hourly glucose checks, and hypoglycemia treated with dextrose (never by stopping insulin).
3. Give potassium safely through peripheral IVs (riders 10 mEq/h, one at a time, at most 4 in a row, no bag over 20 mEq/L, never over 10 mEq/h from all sources), and hold insulin for a potassium under 3.5.
4. Use the 2024 resolution criteria (BHB under 0.6 AND venous pH 7.3 or more OR bicarbonate 18 or more) and the anion gap, not the glucose, to judge progress.
5. Make the transition to SubQ insulin safely: basal insulin at least 2 hours before the infusion stops (2024: 2-4 hours).
6. Prevent and catch harm: unsafe orders, IV infiltration, a disconnected line, night falls, wrong-pen errors, and orders that no longer fit the evidence (droplet precautions).
7. Teach the sick-day rules with teach-back (never stop basal insulin; glucose and ketones every 2-4 h; extra lispro by ketone level; fluids; when to call and when to come in).

**The 10 checkpoints** (every 4 hours). The **case study packet covers the first 24 hours: the first 7 stops (D1 0700 to D2 0700).** Stops 8-10 (D2 1100, 1500, 1900) are in-class only.

| # | Checkpoint | One-line theme | Main safety catch |
|---|---|---|---|
| 1 | **D1 0700** | Arrival from the ED | Handoff quotes the old K 5.6; newest K is 4.6: rider due. Start D10 (glucose 248). |
| 2 | **D1 1100** | Better; viral panel negative | **Discontinue droplet precautions** |
| 3 | **D1 1500** | K 3.2 | **Hold insulin**; one rider at a time |
| 4 | **D1 1900** | Insulin back on; potassium IV infiltrates | Stop, remove, elevate, new IV |
| 5 | **D1 2300** | KCl 40 mEq/L bag ordered | **Planted wrong order 1** |
| 6 | **D2 0300** | Glucose 62: D10 tubing came apart | Trace the line; D50; do not stop insulin; fall risk |
| 7 | **D2 0700** | DKA resolved; transition order with no overlap | **Planted wrong order 2** |
| 8 | **D2 1100** | Off the drip; "glargine at nine tonight" | Patient plans a second basal dose |
| 9 | **D2 1500** | Teaching; long-acting pen picked for a meal dose | Wrong pen; "half my long-acting if not eating" |
| 10 | **D2 1900** | Discharge order for tomorrow | **Planted wrong order 3**: no ketone strips, no glucagon |

**Normal values used:** Na 136-145, K 3.5-5.1, Cl 98-107, CO2 22-29, BUN 7-20, Cr 0.7-1.3, Mg 1.8-2.4, phos 2.5-4.5, BHB under 0.6, venous pH 7.31-7.41, venous pCO2 41-51, anion gap 8-12.

**Key numbers to know.** Dosing weight 76.0 kg. Insulin 0.1 x 76.0 = **7.6 units/h** (bag 100 units/100 mL = 1 unit/mL, so 7.6 mL/h); lower rate 0.05 x 76.0 = **3.8 units/h**. Urine needed for potassium: 0.5 x 76 = **38 mL/h**. Anion gap = Na - Cl - CO2.

---

## 2. Setup

**Time.** About 15-20 minutes per checkpoint x 10 = about 3-3.5 hours with breaks. For a shorter class, run D1 0700, 1500, 2300, D2 0300 and 0700 in full and read the summaries of the others. Plan **40 minutes for the debrief**.

**People.** Instructor: Caleb's voice, the off-going nurse (narrates what happened between stops), and every provider on the phone. Optional second faculty or a student as Tessa. Student groups: primary RN, medication/second RN (insulin double check), charge nurse/phone caller, observer.

**Patient identification.** Wristband: **MERCER, CALEB**, DOB **07/22/1998**, MRN **SIM-40601**, **Allergy: CODEINE (hives)**, Full Code, fall-risk band. Door sign: **Droplet Precautions** with an isolation cart (masks, gowns) outside.

**Equipment (if you have a manikin or bedside table).** Two IV poles, IV pumps (one for 0.9% NaCl with D10 on a secondary line into a Y-site, a separate pump labelled "Regular insulin 100 units/100 mL, 1 unit/mL, HIGH ALERT", a third pump for KCl riders), KCl 10 mEq/100 mL rider bags, D10W 1,000 mL bag, MgSO4 2 g/50 mL bag, D50 training syringe, glucometer (or value cards), urinal, emesis basin, ice chips, telemetry leads, bed alarm, cold pack, skin marker, IV start kit, insulin pens (long-acting and rapid-acting, similar size, different labels), pen needles, sharps box, a ketone meter with expired strips, a "Sick-Day Plan" handout.

### 2.1 Load the patient
1. Open the EHR: **Pre-Built Patients > Case Study Patients > Caleb Mercer**.
2. Confirm the clock reads **Mon 07:00**. Students should see the ED vitals and the 0700 unit set only, the ED labs (sets at 0145 and 0500), ED and admission notes up to the 0645 handoff, ECG 1 (peaked T waves), the chest x-ray, orders and the MAR (insulin and NaCl "0700 Running"; everything after 0700 is due).
3. Time control: **4h ▶** moves to the next checkpoint. Labs, notes and orders appear by themselves at their times.

### 2.2 Class session (everyone on the same patient and clock)
1. On the instructor computer: **Tools > Class session**. The window shows a 6-character **Class code**.
2. Students open the student site, choose **Join class** and type the code (or open the link you share). They see Caleb at your patient time. Your clock buttons drive every student screen; their clock buttons are hidden.
3. What one student charts (doses given, I&O, notes, devices, discontinued orders) reaches everyone within a few seconds.
4. The codes survive a page refresh (kept 12 hours on your computer). **End session** forgets them.

### 2.3 Bedside Monitor on a second computer
1. The Class session window also shows a **separate 6-character Monitor code** (students cannot use it).
2. On the computer for the projector or the bedside, open `monitor.html` and type the **Monitor code** (or use the **Copy monitor link** link).
3. The monitor loads **Caleb's built-in scenario by his MRN (SIM-40601)**; the header should read **SD-3 MERCER, CALEB 28 M**. It **follows your 4h ▶ button**: each press moves it to the next checkpoint row (the BP cuff cycles shortly after, like a real monitor).
4. **Turn the sound on** on the monitor computer (press **S**, and make sure the computer volume is up): the alarms and beeps are part of the 0300 scene. Press **C** for instructor controls (change any value, rhythm or time), **N** to measure BP, **F** for full screen.
5. The scenario also has a **mid row at D2 0320** (after the D50). Show it when the students have treated the low glucose (move the clock forward, or set the values with **C**).

### 2.4 The in-class chart rules (tell the students)
- **Vital signs are NOT charted after 0700.** The monitor shows them. Students take and chart their own set at each stop.
- **Bedside glucoses after 0700 are NOT in the chart.** You say each value aloud with its time (listed at every checkpoint below). Students chart what they check.
- Urine volumes and oral intake are said aloud too; the chart has 4-hour I&O blocks.
- **The D2 0600 weight (79.3 kg)** is on the I&O daily-weight record (D2 0700 block), not in the vital signs. Say it aloud at D2 0700.
- A **new full nursing assessment** is in the chart at every stop, and a **new lab set** is resulted before every stop.
- **Every dose after 0700 is due**: the students give it.
- **Students can discontinue an order:** Orders > select the order > **Discontinue this order**, and type a reason (needed for droplet precautions at 1100 and the unsafe orders when the provider agrees).
- **Continuous IV fluids** (NaCl, D10, insulin): chart from the **Due box** on the MAR row at the current hour: running check, new bag, rate change, paused/held, stopped, restarted, or discontinue.
- Chart text never says "student". Unit RN notes are not pre-written: the students write them.

---

## 3. Checkpoint script

Each checkpoint has: **(A)** what changed since the last stop (read aloud as the off-going nurse), **(B)** monitor, **(C)** what to say aloud, **(D)** how to portray Caleb, **(E)** what the chart shows new, **(F)** expected nursing actions, **(G)** the safety catch and a good response, **(H)** the provider's suggested reply to the students' SBAR call.

### CHECKPOINT 1: D1 Monday 0700 (arrival from the ED)

**(A) Read aloud.** "It's 0700. Caleb Mercer, 28, type 1 diabetes, just came up from the ED. He had a flu-like illness for 5 days and stopped his long-acting insulin Saturday and Sunday because he wasn't eating. He came in at 0130 with a glucose of 524, pH 7.18, gap 28. He got a liter bolus and saline; his insulin drip has been running at 7.6 units an hour since 0305. Saline is at 250 an hour. Report says his potassium was 5.6, too high for potassium, so none was given. His glucose at 0700 is 248. His sister Tessa is with him. He's on droplet precautions; the viral panel is pending."

**(B) Monitor (this 0700 set is also in the chart).**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **112** | **108/64** | **24, deep** | 98% room air | 99.4 F | **Sinus tachycardia, T waves slightly tall** | 4/10 |

**(C) Say aloud.** POC glucose **0700: 248** (this one is charted). Last void 0630: 400 mL. Last emesis 0350.

**(D) Portray Caleb.** Lying with the head of the bed up, curled a little on his side, eyes half closed. Breathe deep, fast and regular. Slow to answer but makes sense; oriented. Mask hanging under his chin. Embarrassed.
- *"I'm so thirsty... can I have water?"*
- *"I didn't take my long-acting because I wasn't eating. I didn't want to go low."*
- *"My stomach hurts and I feel sick."*
- *"Is my sister still here?"*
- **Tessa (in the chair):** *"I texted him all evening and he didn't answer. When I got there at one he was breathing so fast, and the room smelled like nail polish remover."* She can answer questions about the illness and his home supplies ("his ketone strips are ancient").

**(E) Chart shows.** ED triage (0140), ECG 1 (0215: sinus tachycardia 122, peaked T waves V2-V4, QTc 428), CXR (0310: clear), ED provider note (0420), admitting H&P (Varga, 0600), ED RN note (0630), ED-to-unit handoff (0645: "K 5.6, too high for potassium, none given").
- **ED set 1 (0145):** Na 131, **K 5.6**, Cl 95, CO2 8, BUN 26, Cr 1.5, glucose 538, Ca 9.5, Mg 2.2, phos 5.6, **gap 28, BHB 6.4, pH 7.18**, pCO2 19, HCO3 6.8.
- **ED set 2 (0500, resulted 0545-0555):** Na 134, **K 4.6**, Cl 101, CO2 10, BUN 23, Cr 1.3, glucose 348, Ca 9.0, Mg 2.0, phos 3.8, gap 23, BHB 5.5, pH 7.23, pCO2 22, HCO3 9.0.
- CBC: WBC 17.8 (no bands), Hgb 16.4, Hct 49.0, Plt 302. Lactate 2.4 then 1.5. Lipase 92. Hepatic panel normal, albumin 4.7. Serum osmolality 304. UA: glucose 4+, ketones large (80), SG 1.030. HbA1c and viral panel pending.
- Orders: DKA protocol (fixed rate, dextrose table, hypoglycemia rule, peripheral potassium table), D10W when glucose under 250, KCl riders PRN per table, D50 PRN, glucagon PRN, hourly glucose, mental status every 2 h, strict I&O, labs at 0930/1400/2130/D2 0130/D2 0530, no VTE drug (young, walking), consults. Stickies: peripheral potassium rules; DKA protocol summary.
- MAR due: **D10 100 mL/h start (and NaCl to 150)**, **KCl rider 0715**.

**(F) Expected nursing actions.**
1. **Independent double check** of the insulin infusion (drug, concentration 1 unit/mL, rate 7.6 mL/h = 7.6 units/h, line, patient).
2. **Read the newest K, not the handoff:** 4.6 at 0500 (falling on insulin). Table 4.5-5.0 = **10 mEq this cycle**. Confirm urine (400 mL at 0630 = well over 38 mL/h). **Hang KCl 10 mEq rider at 0715** in the right antecubital IV, on its own pump, over 1 hour.
3. **Glucose 248 = start D10 100 mL/h** on the secondary line and **lower NaCl to 150 mL/h**. Keep the insulin at 7.6.
4. Hourly glucose; mental status every 2 h; strict I&O; telemetry (slightly tall T waves).
5. Droplet precautions in place. Fall precautions (Morse 45): bed low, alarm on, stand-by assist.
6. Explain the labs: gap 28 -> 23; corrected Na 138.0 (normal); BHB 6.4 -> 5.5.

**(G) Safety catch.** **The handoff quotes the 0145 potassium (5.6), not the 0545 one (4.6).** Insulin is pushing potassium into the cells, and his total-body potassium is low. A good response: "The newest K is 4.6. Per the protocol he gets a 10 mEq rider now; urine is adequate. And his glucose is under 250, so the D10 starts now." Ask: "Why is the potassium falling when you have not given any?"

**(H) Provider reply** (if they call Dr. Ashworth, day hospitalist): "Thanks for catching that. Follow the protocol table: 10 mEq rider for 4.6, start the D10 at 100 and drop the saline to 150. Next labs at 0930."

---

### CHECKPOINT 2: D1 1100 (better, and the viral panel is negative)

**(A) Read aloud.** "It's 1100. The D10 has been running at 100 since 0705, saline at 150. He vomited 120 mL at 0830. The 0930 labs are back: potassium 3.9, so he's getting 30 mEq: riders at 1030, 1130 and 1230. The respiratory viral panel came back at 0950. Clear liquids start now."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **102** | **114/68** | 20, deep | 98% | 99.0 F | Sinus tachycardia (T waves normal) | 3/10 |

**(C) Say aloud.** Glucose **0800 228, 0900 210, 1000 196, 1100 186.** Urine **0750 350 mL, 0920 300 mL, 1045 250 mL.** Emesis 0830 120 mL. Oral 60 mL.

**(D) Portray Caleb.** Sitting up, more awake, full sentences. Breathing still deep but slower. Lips dry. Rubs his right arm.
- *"I feel a little more human."*
- *"My arm aches where that potassium is going in."*
- *"Do I still have to wear this mask? Did my flu test come back?"*
- *"Can I drink something real?"*
- Tessa: not scripted at this stop (she can be gone home to sleep).

**(E) Chart shows new.** Pharmacy note (0830: home doses, codeine allergy, peripheral potassium limits, ondansetron fine at QTc 428, expired glucagon and ketone strips). Hospitalist progress note (0930). Hospitalist addendum (1100: K 3.9, Mg 1.8 at the low limit, recheck at 1400; gap 20, BHB 4.1 improving; no comment on isolation).
- **Set 3 (0930):** Na 136, **K 3.9**, Cl 104, CO2 12, BUN 19, Cr 1.1, glucose 200, Ca 8.8, **Mg 1.8**, phos 2.4, **gap 20, BHB 4.1, pH 7.27**, pCO2 25, HCO3 11.0.
- **Respiratory viral panel (0950): influenza A, influenza B, SARS-CoV-2, RSV all NOT DETECTED.**
- HbA1c 8.3% (1000).
- Order: sugar-free clear liquids (1045, start 1100). I&O block to 1100 (in 1,240 / out 1,020).
- MAR due: riders 1030 (running), **1130**, 1230.

**(F) Expected nursing actions.**
1. **Discontinue droplet precautions** (Orders > Droplet precautions > Discontinue this order). Reason: "Respiratory viral panel negative for influenza A/B, SARS-CoV-2 and RSV (0950); afebrile; standard precautions and cough etiquette." Take the sign down.
2. Second rider at 1130 when the first is done (never two at once). Check the rider site (ache is common; look for swelling).
3. Start sugar-free clear liquids.
4. Explain progress with the gap (28 -> 20, still open) and BHB (4.1), not the glucose.
5. Note Mg 1.8 (low limit) with K falling: recheck planned at 1400.

**(G) Safety catch: the order to discontinue.** Droplet precautions no longer match the evidence. The order itself lets the RN stop them. A good response stops them with a written reason and tells Caleb he can walk out of the room with standard precautions. If they leave them on: "He asked about the mask. What did the 0950 result say? Read the order comment."

**(H) Provider reply** (if they call): "Yes, the order lets you stop them: panel negative and no fever. Standard precautions and cough etiquette. Clear liquids are ordered."

---

### CHECKPOINT 3: D1 1500 (low potassium: hold the insulin)

**(A) Read aloud.** "It's 1500. The three riders were given at 1030, 1130 and 1230. He's keeping clear liquids down. The 1400 labs came back at 1445. Look at the monitor."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **98** | **116/70** | 18 | 98% | 98.8 F | **Sinus with PVCs about 2 per minute; flat T waves and U waves** | 2/10 (calf cramps) |

**(C) Say aloud.** Glucose **1200 182, 1300 190, 1400 196, 1500 202.** Urine **1150 250 mL, 1320 250 mL, 1440 250 mL.** Oral 480 mL clear liquids.

**(D) Portray Caleb.** Sitting up rubbing his calves; breathing nearly normal depth; tired. Squeeze weakly when they test grip.
- *"My legs feel heavy and my calves keep cramping."*
- *"My heart feels like it skips."*
- *"Why are you stopping my insulin? Isn't that what I need?"*
- *"Am I going backwards?"*

**(E) Chart shows new.** Endocrinology consult (1130, Beaumont: home glargine 24 units at the transition in the morning, drip stopped at least 2 h later, keep morning dosing, sick-day plan and teaching).
- **Set 4 (1400):** Na 137, **K 3.2**, Cl 106, CO2 13, BUN 16, Cr 1.0, glucose 198, Ca 8.6, **Mg 1.6**, phos 1.9, gap 18, BHB 2.6, pH 7.29, pCO2 27, HCO3 12.6.
- I&O block to 1500 (in 1,760 / out 750).
- **Appears after they act (1510-1530):** order "insulin infusion and D10 on hold for K 3.2; restart when K 3.5 or more"; MgSO4 2 g IV over 2 h (due 1515); STAT VBG, BMP, Mg, BHB at 1720 (after the second rider and the Mg finish; venipuncture from the opposite arm); ECG 2 note (1515: sinus 98, flat T, U waves V2-V3, 2 PVCs, QTc 460); hospitalist event note (1530).
- MAR due: **insulin hold 1500, D10 off 1500**; riders **1505, 1605, 1705, 1805**; MgSO4 1515.

**(F) Expected nursing actions.**
1. **Hold the insulin and the D10 at 1500** (keep NaCl 150). The protocol says hold only for K under 3.5. Chart it from the MAR Due box (paused/held).
2. Call the hospitalist (SBAR).
3. **12-lead ECG** (1505).
4. **Four KCl riders back to back from 1505**, one at a time, 10 mEq/h, right-arm IV. Do not hang two to "catch up".
5. **MgSO4 2 g at 1515** through the left line (Y-site with NaCl), not with the rider. Low Mg makes K hard to correct.
6. STAT labs at 1720 after the second rider and the Mg finish, drawn from the left hand (never from an arm with a running infusion).
7. Avoid ondansetron (QTc 460, low K). Explain to Caleb why the insulin is paused.

**(G) Safety catch.** **K 3.2 is under 3.5 = hold insulin** (insulin would push potassium lower and cause arrhythmias). A good response holds both insulin and D10 within minutes, calls, and gives one rider at a time. Debrief point: ketones will rise during the hold, so the hold is as short as possible.

**(H) Provider reply (Dr. Ashworth):** "Hold insulin and D10, four riders, magnesium 2 grams, STAT labs after the second rider, restart insulin when K is 3.5 or more."

---

### CHECKPOINT 4: D1 1900 (insulin back on, and the potassium IV infiltrates)

**(A) Read aloud.** "It's 1900, shift change. The STAT potassium at 1720 was 3.6, so the insulin was restarted at 1750 at 7.6. The D10 stayed off because his glucose went over 250 while the insulin was held. The fourth rider started at 1805 in his right elbow IV. Saline goes to 100 an hour now."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **96** | **120/72** | 18 | 98% | 99.1 F | Sinus; T waves still low, small U waves; no PVCs | **5/10 right elbow** |

**(C) Say aloud.** Glucose **1600 238, 1700 266, 1800 274, 1900 244.** Urine **1600 300 mL, 1810 300 mL.** Oral 480 mL. **The rider pump shows 92 mL of 100 infused.**

**(D) Portray Caleb.** Holding his right arm against his chest, wincing. The inner right elbow is puffy, pale and shiny around the dressing (about 4 cm), cool and tight. Frustrated, hungry.
- *"My elbow is burning, like really burning."*
- *"It's been sore since about six."*
- *"I'm starving. When can I eat real food?"*
- *"So the insulin is back on now?"*
- *"I was getting better and then they stopped my insulin."*

**(E) Chart shows new.** ECG 2 (1515) in Cardiology; hospitalist event note (1530); hospitalist note (1800: K 3.6, insulin restarted 1750; BHB rose 2.6 -> 3.1 and pH 7.27 during the hold, expected; D10 back when glucose under 250).
- **Set 5 STAT (1720):** Na 137, **K 3.6**, Cl 106, CO2 13, BUN 15, Cr 0.9, glucose 270, Ca 8.6, Mg 2.0, phos 2.0, gap 18, **BHB 3.1, pH 7.27**, pCO2 28, HCO3 12.4.
- Orders: resume insulin 7.6 units/h (1750; D10 per table; after the 4 riders, potassium per protocol from the 2130 labs); NaCl to 100 mL/h (1840, start 1900).
- I&O block to 1900 (in 1,531 / out 600).
- **Appears after (2030):** night hospitalist note (infiltration reported, new right forearm IV 1915, site checks every 2 h).
- MAR due: **D10 restart 100 mL/h at 1900**, **NaCl 100 mL/h at 1900**.

**(F) Expected nursing actions.**
1. **Stop the rider first.** Disconnect, try to aspirate from the catheter, **remove the IV**, **elevate the arm**, **mark the edges**, cold pack 20 minutes per policy, document (**INS infiltration grade 2**), remove the device in the EHR, notify the provider.
2. Start a **new IV in the right forearm** (1915) for the next riders. About 9 mEq went into the tissue (92 mL of a 10 mEq/100 mL bag).
3. **Glucose 244 is under 250 again: restart D10 100 mL/h.** NaCl 100 mL/h.
4. SBAR handoff to the night RN: insulin restarted 1750, potassium plan from the 2130 labs, the infiltration, the new IV.

**(G) Safety catch.** **IV infiltration with potassium** (an irritant). Burning is common with KCl, but swelling, coolness and pallor are not. A rider in an elbow site (the joint bends) is a setup. A good response stops the infusion before anything else and checks the rider site every hour from now on. If they treat the arm while the pump still runs: "What is still going into that tissue right now?"

**(H) Provider reply** (Dr. Ashworth at 1900, or Dr. Varga after sign-out): "Good. Remove it, elevate, cold pack per policy, mark it, site check every 2 hours. Put the new IV in a forearm, not the elbow. Restart the D10 at 100 per the table. The next potassium goes by the 2130 labs."

---

### CHECKPOINT 5: D1 2300 (a wrong potassium order; hungry and restless)

**(A) Read aloud.** "It's 2300. D10 at 100, saline at 100, insulin 7.6. The 2130 potassium was 3.7, so he's getting 30 mEq: riders at 2230 (running now), 2330 and 0030 in the new right forearm IV. At 2245 the night hospitalist put in a new fluid order 'to simplify'. It's on your screen."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **88** | **118/70** | 16 | 97% | 98.6 F | Sinus, normal T waves | 1/10 |

**(C) Say aloud.** Glucose **2000 222, 2100 204, 2200 190, 2300 176.** Urine **2000 250 mL, 2210 300 mL.** Oral 360 mL.

**(D) Portray Caleb.** Sitting up, phone in hand, restless and bored; texting his roommate. Breathing normal. Right elbow on a pillow with marker lines (swelling about 2 cm, softer).
- *"Can I just walk to the bathroom by myself? I'm fine."*
- *"I'm so hungry. Broth is not food."*
- *"Why do I keep getting these potassium bags?"*
- *"When can I go home?"*

**(E) Chart shows new.** Night hospitalist note (2030).
- **Set 6 (2130):** Na 139, **K 3.7**, Cl 108, CO2 15, BUN 12, Cr 0.9, glucose 196, Ca 8.7, Mg 1.9, phos 2.1, gap 16, **BHB 2.0, pH 7.31**, pCO2 30, HCO3 14.6.
- **WRONG ORDER (Varga, 2245, start 2300): "change maintenance fluid to 0.9% NaCl 1,000 mL with KCl 40 mEq/L at 100 mL/h".**
- I&O block to 2300 (in 1,240 / out 550).
- **Appears after the call:** the order stopped at 2320; night hospitalist addendum (2330).
- MAR due: riders 2230 (running), **2330**, 0030.

**(F) Expected nursing actions.**
1. **Do not hang the 40 mEq/L bag. Call.** (See Section 4, error 1, for the math.)
2. Continue plain NaCl 100 mL/h and the riders per protocol.
3. Check the new IV (rider infusing, mild burning only) and the old site (2 cm, softer, marked).
4. Explain to Caleb (and to each other) why he is "not resolved yet": pH 7.31 is over 7.3, but BHB 2.0 is not under 0.6.
5. Night fall safety: bed alarm, urinal in reach, call light, "call, don't fall".

**(G) Safety catch.** **Planted wrong order 1** (Section 4). A good response refuses to hang it, gives the reason with numbers, and offers the safe plan (plain saline + riders).

**(H) Provider reply (Dr. Varga):** "You're right, he has no central line. Discontinue that order. Keep plain saline at 100 and the riders per protocol."

---

### CHECKPOINT 6: D2 Tuesday 0300 (low glucose from a disconnected dextrose line)

**(A) Read aloud.** "It's 0300. At about 0100 he got up to void, 300 mL. At 0200 his glucose was 112, down from 158. I raised the D10 to 150 per the table at 0210 and called Dr. Varga at 0215; he said keep the insulin at 7.6 and recheck in an hour. ... Now his bed alarm is going off." (Turn the monitor sound up. Do not say anything about the tubing.)

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **116** | **134/80** | 20 | 98% | 98.2 F | Sinus tachycardia | 1/10 (headache) |

**After treatment (mid row D2 0320):** HR **92**, BP **122/74**, RR **16**, SpO2 98%, sinus.

**(C) Say aloud.** Glucose **0000 166, 0100 158, 0200 112, 0300 62.** After D50: **0315 124.** Urine **0005 250 mL, 0100 300 mL.** Oral 120 mL. If they look at the pump: "Channel B: D10W 150 mL/h, infusing, no alarm; the volume infused keeps climbing."

**(D) Portray Caleb.** Sitting on the edge of the bed, feet dangling, gripping the rail, hands shaking, sweaty forehead, slow and "foggy". Wants to walk to the bathroom with two IV poles. If they look at his left side: **the D10 line end is lying open on a wet sheet**; the gown and sheet are wet.
- *"I feel shaky and weird... I need to pee."*
- *"Is this a low? It feels like a low."*
- *"I'm sweating like crazy... and why is my bed wet?"*
- After the D50: *"Okay... that's better. Sorry."*

**(E) Chart shows new.** Night hospitalist addendum (2330, the KCl bag).
- **Set 7 (0130):** Na 139, **K 4.0**, Cl **109**, CO2 16, BUN 11, Cr 0.9, glucose 140, Ca 8.7, Mg 1.9, phos 2.3, gap 14, **BHB 1.1, pH 7.32**, pCO2 31, HCO3 15.6.
- I&O block to 0300 (in 1,018 / out 550; the D10 that ran into the bed is not counted).
- **Appears after (0310-0330):** order insulin to 3.8 units/h (0310); night event note (0330).
- MAR due: **D50 12.5 g IV 0305**, **insulin to 3.8 units/h 0305**, **D10 150 mL/h 0310 (new tubing)**, riders **0330, 0430**.

**(F) Expected nursing actions.**
1. **Safety first:** sit him back in bed, reset the bed alarm, do not walk him.
2. **D50 12.5 g (25 mL) IV push** (glucose 50-69 and alert). **Recheck in 15 minutes** (124).
3. **Trace the D10 line from the bag to the patient**: find the open end, clamp it, and **hang new sterile tubing at 150 mL/h** (never reconnect a contaminated end).
4. **Lower insulin to 3.8 units/h. Do not stop it:** BHB 1.1 and gap 14 mean ketones are still clearing.
5. Call (SBAR). Change the wet linen. Fall risk now Morse 60.
6. Riders 0330 and 0430 (K 4.0 = 20 mEq).

**(G) Safety catch.** **A running pump does not prove the patient is getting the drug.** On fixed-rate insulin the dextrose line is a life-support line. A good response treats the low first, then traces every line bag to patient, and keeps the insulin running at the lower rate. Also a **night fall risk** (sweaty, shaky, up alone with lines). Debrief: what should the 0200 nurse have done besides raising the D10 and calling? (Recheck at 0230 for a fast fall of 46 in 1 hour, and trace the line.)

**(H) Provider reply (Dr. Varga):** "Good catch. Keep insulin at 3.8, D10 at 150, glucose every hour, call if under 100."

---

### CHECKPOINT 7: D2 0700 (DKA resolved; an unsafe transition order)

**(A) Read aloud.** "It's 0700. Quiet rest of the night. The 0530 labs are back. The night NP put in transition orders at 0635. Breakfast comes at 0800. His weight this morning at 0600 was 79.3 kg; it's on the I&O record."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **80** | **122/74** | 16 | 98% | 98.4 F | Sinus, normal T waves | 0/10 |

**(C) Say aloud.** Glucose **0400 140, 0500 152, 0600 156, 0700 152**; pre-breakfast **0745: 154.** **Weight 0600: 79.3 kg.** Urine **0315 200 mL, 0530 300 mL.** Oral 240 mL.

**(D) Portray Caleb.** Sitting up in the chair, smiling, hair messy, normal breathing. Bright and hungry.
- *"I feel almost normal."*
- *"So do I take my long-acting now? I usually take it at night."*
- *"When can I eat? Is breakfast coming?"*
- *"Can I do my own shot?"*

**(E) Chart shows new.** Night event note (0330); night hospitalist note (0630: **DKA resolved**; transition this morning, orders by the night NP).
- **Set 8 (0530):** Na 139, **K 4.2**, Cl 108, **CO2 18**, BUN 10, Cr 0.8, glucose 160, Ca 8.8, Mg 1.9, phos 2.6, **gap 13, BHB 0.4, pH 7.34**, pCO2 34, HCO3 17.6.
- **UNSAFE ORDER (Ostrowski NP, 0635, start 0700): "insulin glargine 24 units SubQ at 0700; discontinue insulin infusion, D10 and NaCl at 0700"; lispro with meals.**
- I&O block to 0700 (in 1,456 / out 500) with the daily weight 79.3 kg.
- **Appears after the call (0715-0720):** endocrinology transition note (0715); corrected transition orders (0720: glargine 24 units at 0730 then daily at 0730; continue insulin 3.8 and D10 150 until 0930, then stop them and NaCl; lispro 1 unit/10 g with meals + correction 1 unit/50 above 150; bedtime correction only over 250); POC glucose before meals, bedtime and 0300; consistent-carbohydrate diet 60-75 g per meal; labs 0945/1330/1730; glucose 15 g PO PRN; diabetes education order. The NP's order shows stopped at 0720. Sticky "Transition: glargine 0730, lispro 0800, drip off 0930 (2-hour overlap)."
- MAR due: **glargine 24 units 0730**, riders **0730, 0830**, **lispro 6 units 0800**, **insulin, D10 and NaCl off 0930**.

**(F) Expected nursing actions.**
1. **Confirm resolution with the criteria, out loud:** BHB 0.4 (under 0.6) AND pH 7.34 (7.3 or more) AND HCO3 18 (18 or more). Gap 13. Glucose is not a criterion.
2. **Question the transition order** (Section 4, error 2).
3. After the corrected order: **glargine 24 units SubQ at 0730** (let him give it himself with teaching), **lispro 6 units at 0800** with breakfast (60 g: 60/10 = 6; correction (154-150)/50 = 0.08 -> 0), **stop the drip, D10 and NaCl at 0930**. The D10 keeps running through breakfast because IV insulin is still running.
4. Riders 0730 and 0830 (K 4.2 = 20 mEq).
5. Weight 79.3 kg (usual 79.0): he is no longer dry.

**(G) Safety catch.** **Planted wrong order 2** (Section 4). IV insulin is gone in minutes; glargine takes hours to start. A good response holds the 0700 stop, calls before 0700 passes, and states the rule: basal at least 2 hours before the drip stops.

**(H) Provider reply (Dr. Beaumont, 0715):** "Correct, give the glargine first and keep the drip at least 2 hours. Glargine 0730, breakfast lispro 0800, drip off 0930. Glargine every morning from now on."

*(End of the case study packet: stops 1-7.)*

---

### CHECKPOINT 8: D2 1100 (eating, off the drip, basal timing)

**(A) Read aloud.** "It's 1100. Glargine at 0730 and lispro at 0800 were given. He ate all of his breakfast. The drip, D10 and saline came off at 0930; both IVs are saline locks. He showered and walked the hall. The 0945 labs are back."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **78** | **124/76** | 14 | 99% | 98.6 F | Sinus | 0/10 |

**(C) Say aloud.** Glucose **0830 172, 0930 180** (last hourly check; drip off). Pre-lunch **1130: 196** (give it when they check). Urine **0740 300 mL, 1010 350 mL.** Oral 600 mL.

**(D) Portray Caleb.** In his own T-shirt, damp hair, walking around the room. Cheerful.
- *"That breakfast was the best thing I've ever eaten."*
- *"Tonight I'll do my long-acting at nine like always, right?"*
- *"How many units for lunch?"*
- *"Do I really need potassium pills? They're huge."*

**(E) Chart shows new.** Endocrinology transition note (0715); corrected orders (0720); up ad lib (0930); hospitalist progress (1000: one night on SubQ insulin, discharge tomorrow morning if stable); resume loratadine PRN (1000); dietitian note (1030); KCl ER 20 mEq PO at 1100 and 1500 (order 1040).
- **Set 9 (0945):** Na 138, **K 3.6**, Cl 106, CO2 20, BUN 10, Cr 0.8, glucose 182, Ca 8.9, Mg 1.8, phos 2.4, gap 12, **BHB 0.3** (no rebound).
- CBC (0945): WBC 9.6, Hgb 13.8, Hct 41.2, Plt 241.
- I&O block to 1100 (in 1,435 / out 650).
- **Appears after (1130):** hospitalist addendum (BHB 0.3, K 3.6 -> KCl ER 20 mEq x2).
- MAR due: **KCl ER 20 mEq PO 1100**, **lispro 8 units 1200**.

**(F) Expected nursing actions.**
1. **Teach basal timing:** he had today's glargine at 0730. A 2100 dose would be 48 units in 13.5 hours (a night low). Next dose 0730 tomorrow, 24 hours later, and every morning after.
2. Check for rebound after the drip: BHB 0.3, gap 12 = none.
3. KCl ER 20 mEq whole, upright, with a full glass of water.
4. **Lunch dose:** 70 g -> 7 units + correction (196-150)/50 = 0.92 -> 1 = **8 units** at 1200.

**(G) Safety catch.** **He plans a second basal dose tonight** (would double his basal insulin). A good response uses teach-back: "Tell me when your next long-acting dose is and why."

**(H) Provider reply** (if they call Dr. Ashworth or Dr. Beaumont): "Right, no glargine tonight. The next dose is 0730 tomorrow and every morning after. Please make sure he can say that back. The KCl ER is ordered for 1100 and 1500."

---

### CHECKPOINT 9: D2 1500 (teaching and teach-back)

**(A) Read aloud.** "It's 1500. He ate 80% of lunch with 8 units. The diabetes educator saw him at 1330 and went over the written sick-day plan. Tessa brought his home pens at 1400. He wants to practice with you now."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **76** | **122/76** | 14 | 99% | 98.4 F | Sinus | 0/10 |

**(C) Say aloud.** No glucose check since 1130 (196). The 1330 lab glucose was 214 (after lunch). The pre-dinner check at 1700 will be **142** (give it when they check). Urine **1130 300 mL, 1400 350 mL.** Oral 840 mL.

**(D) Portray Caleb.** Sitting on the bed with two insulin pens and a ketone meter; Tessa next to him. Relaxed. **Pick up the long-acting pen** and dial 2 units.
- (holding the long-acting pen) *"Two units for these crackers."*
- *"If I'm not eating, I'll just take half my long-acting, right?"*
- *"How many extra units do I take if my ketones are up?"*
- *"When do I call you guys versus just come in?"*
- **Tessa:** *"Which one is the night one? They look the same to me."* / *"What am I supposed to do if he's throwing up again?"*

**(E) Chart shows new.** Hospitalist addendum (1130); diabetes educator session 1 (1330: he still believed "no food, less long-acting"); pharmacy discharge review (1400: **recommends blood ketone strips and a new glucagon**, both expired; pen needles; glucose tablets); case management (1430: follow-up Dr. Harlow 01/15 1000; sister picks him up tomorrow morning and stays the first night).
- **Set 10 (1330):** Na 138, K 3.9, Cl 105, CO2 22, BUN 9, Cr 0.8, glucose 214, Ca 9.0, Mg 1.9, phos 2.9, gap 11, BHB 0.2.
- I&O block to 1500 (in 840 / out 650).
- MAR due: **KCl ER 20 mEq PO 1500**; lispro 6 units 1730 (next).

**(F) Expected nursing actions.**
1. **Stop the pen mix-up.** 2 units is the right dose for about 20 g of carbohydrate (1 unit per 10 g), but it is the **long-acting pen**. In the hospital lispro is ordered with meals only, so no snack dose here; at home he uses the rapid-acting pen for 1 unit per 10 g. Label the pen caps.
2. **Re-teach basal:** the full glargine dose every morning even when not eating (changed only with the team, for lows).
3. **Teach-back of the written sick-day plan** (Section 5.3), with Tessa.
4. KCl ER at 1500. Dinner plan: 60 g, glucose 142 -> **6 units** at 1730.

**(G) Safety catch.** **Wrong insulin pen** and an **unsafe sick-day belief**. A good response stops him before the dose, uses teach-back ("show me", "tell me"), not "do you understand?".

**(H) Provider reply** (if they call Dr. Beaumont or the educator): "Thank you. Label the pens, keep practicing, and W. Tamura will repeat the teach-back this afternoon. Basal stays at 24 units every morning, sick or not."

---

### CHECKPOINT 10: D2 1900 (discharge plan for tomorrow)

**(A) Read aloud.** "It's 1900. He ate 90% of dinner at 1730 with 6 units. The educator's teach-back at 1645 was correct. The discharge order was written at 1745: home tomorrow after breakfast. The prescriptions are in."

**(B) Monitor.**

| HR | BP | RR | SpO2 | Temp | Rhythm | Pain |
|---|---|---|---|---|---|---|
| **74** | **120/74** | 14 | 99% | 98.4 F | Sinus | 0/10 |

**(C) Say aloud.** Glucose **1700 142.** Next checks bedtime 2100 and 0300 (after the course ends). Urine **1600 300 mL, 1830 300 mL.** Oral 720 mL.

**(D) Portray Caleb.** In his own clothes in the chair, phone charging, relaxed; Tessa in the other chair. A bit disappointed not to go tonight but agrees.
- *"Basal every morning, no matter what. Ketones every few hours if I'm sick."*
- *"My ketone strips at home are from 2024... do I need new ones?"*
- *"Tessa, you know where the glucagon goes, right?"*
- *"So I really have to stay one more night?"*
- **Tessa:** *"I'll stay with him tomorrow night. Devin works nights."* / *"Show me the glucagon. I've never used one."*

**(E) Chart shows new.** Educator session 2 (1645: teach-back correct, pens labelled, ketone meter practice with a demo strip); endocrinology (1715: stable on SubQ, one night on SubQ then discharge if overnight and fasting glucoses 100-250; sensor referral); **discharge order (Ashworth, 1745)**; hospitalist discharge plan (1800: "no ketone strips, no glucagon").
- **Set 11 (1730):** Na 139, K 4.1, Cl 104, CO2 23, BUN 9, Cr 0.8, glucose 138, Ca 9.1, Mg 1.9, phos 3.2, gap 12, BHB 0.2.
- **Discharge order: discharge D3 after breakfast if overnight and fasting glucoses are 100-250 with no low, BHB under 0.6, and supplies in hand.** Prescriptions copied from his home list: glargine 24 units every morning (0730), lispro pens, pen needles, glucose meter strips, lancets, glucose tablets. Follow-up J. Harlow, MD 01/15 1000. **No blood ketone strips, no glucagon.**
- I&O block to 1900 (in 720 / out 600).

**(F) Expected nursing actions.**
1. Review discharge readiness against the order.
2. **Call to add blood ketone strips and glucagon** (Section 4, error 3); plan to teach Tessa to give glucagon.
3. Confirm glargine every morning at 0730 (next dose D3 0730; none tonight). Bedtime glucose 2100 (correction only if over 250) and the 0300 check.
4. **Remove the right forearm IV**; keep the left forearm saline lock overnight.
5. Confirm follow-up 01/15; final teach-back with Tessa.

**(G) Safety catch.** **Planted wrong order 3** (Section 4). A good response notices that the list was copied from home and that the pharmacist recommended both at 1400.

**(H) Provider reply (Dr. Ashworth):** "Yes, add them. The outpatient pharmacy will bring them up in the morning before he leaves."

**Why he stays one more night (D3 about 1000):** the drip has been off only about 10 hours; he has had one glargine dose at a new time of day; there is no overnight or fasting glucose on SubQ insulin yet; his roommate works nights. Criteria for tomorrow: overnight and fasting glucoses 100-250 with no low, BHB under 0.6, eating, K normal, supplies (including ketone strips and glucagon) in hand, sister present, follow-up 01/15.

---

## 4. The three planted order errors, and the order to discontinue

There are **exactly three planted provider-order errors.** Other catches (the old K at handoff, the infiltration, the disconnected line, the wrong pen, the basal-tonight plan) are events or patient/nurse issues, not order errors.

### Error 1: D1 2300, KCl 40 mEq/L in the maintenance bag (Dr. Varga, ordered 2245)
**Order:** change maintenance fluid to 0.9% NaCl 1,000 mL with KCl 40 mEq/L at 100 mL/h.
**What is wrong:**
- Caleb has **peripheral IVs only**. The peripheral limit in a bag is **20 mEq/L**; 40 mEq/L is a central-line concentration.
- **Stacking:** 40 mEq/L x 0.1 L/h = **4 mEq/h** from the bag, plus the running **10 mEq/h** rider = **14 mEq/h**, over the 10 mEq/h peripheral limit (all sources added together).
- The riders are already giving the 30 mEq the protocol calls for.
**How students should catch it:** read the new order against the sticky and the protocol; do not hang it; call before 2300 passes.
**Good SBAR:** "Caleb has peripheral IVs only. 40 mEq/L is over our peripheral bag limit of 20, and with the rider running that is 14 mEq an hour. Can we discontinue it and keep plain saline at 100 with riders per protocol?"
**As the provider:** "You're right, he has no central line. Discontinue that order. Keep plain saline at 100 and the riders per protocol." (Students discontinue it with the reason; it shows stopped at 2320.) If they hang it, stop the scene: "Add up every source of potassium going in this hour."

### Error 2: D2 0700, transition with no overlap (night NP R. Ostrowski, ordered 0635)
**Order:** glargine 24 units SubQ at 0700; discontinue insulin infusion, D10 and NaCl at 0700; lispro with meals.
**What is wrong:** IV regular insulin is gone within minutes; glargine takes hours to start working. Stopping both at the same time leaves him with almost no insulin = rebound ketosis. **Basal insulin must be given at least 2 hours before the drip stops (2024: 2-4 hours).** Endocrinology's consult (D1 1130) already said so.
**How students should catch it:** recognize that the order makes the drip stop and the glargine start at the same minute; check the endocrinology note; call before 0700 (or hold the stop and call at once).
**Good SBAR:** "DKA is resolved: BHB 0.4, pH 7.34, bicarb 18. The order stops the drip at the same time as the first glargine. Endocrinology wanted at least 2 hours of overlap. Can we give the glargine now and stop the drip 2 hours later?"
**As the provider (Dr. Beaumont, endocrinology, 0715):** "Correct, give the glargine first and keep the drip at least 2 hours. Glargine 0730, breakfast lispro 0800, drip off 0930. Glargine every morning from now on." (The NP order stops at 0720; the corrected order appears.) If you prefer, the NP can answer first: "Oh, you're right. Let me get endocrinology to put the plan in."

### Error 3: D2 1900, discharge prescriptions with no ketone strips and no glucagon (Dr. Ashworth, ordered 1745)
**Order:** discharge D3 after breakfast; prescriptions copied from his home list (glargine, lispro pens, pen needles, meter strips, lancets, glucose tablets).
**What is wrong:** **no blood ketone strips and no glucagon.** His are expired (strips 2024, glucagon 06/2025). The sick-day plan he just learned depends on ketone checks every 2-4 hours, and he needs in-date glucagon with someone (Tessa) trained to give it. The pharmacist recommended both at 1400.
**How students should catch it:** check the discharge list against the sick-day plan and the pharmacy note; listen to Caleb ("my strips are from 2024").
**Good SBAR:** "His discharge prescriptions don't include blood ketone strips or glucagon. His at home are expired, his meter reads ketones, and pharmacy recommended both. Could you add ketone strips and glucagon, nasal 3 mg or 1 mg injection? I'll teach his sister."
**As the provider:** "Yes, add them. The outpatient pharmacy will bring them up in the morning before he leaves."

### The order to discontinue: droplet precautions (D1 1100)
**Order (Lindahl, D1 0140):** droplet precautions, influenza-like illness, respiratory viral panel pending. **Order comment:** "RN may discontinue per the respiratory isolation protocol when the respiratory viral panel is negative for influenza A/B, SARS-CoV-2 and RSV and the patient is afebrile."
**Evidence:** panel **all NOT DETECTED at 0950**; temperature 99.0 F at 1100 (afebrile). A common cold virus is likely (not on this panel).
**How students should do it:** Orders > Droplet precautions > **Discontinue this order**; reason: "Respiratory viral panel negative for influenza A/B, SARS-CoV-2 and RSV (0950); afebrile; standard precautions and cough etiquette." Take the door sign down; tell Caleb (he asked about the mask).
**Why it matters:** isolation should match the current evidence. Keeping it longer limits care, walking and visits, and uses supplies. No note mentions isolation on purpose: the students must connect the result to the order.
**As the provider (if called):** "Yes, the order lets you stop them: panel negative and no fever. Standard precautions and cough etiquette." (Optional: some units add eye protection, or N95 plus eye protection while COVID-19 is possible; mention your local policy.)

---

## 5. Debrief

### 5.1 Structure (about 40 minutes)
| Phase | Time | What you do |
|---|---|---|
| Reactions | 5 min | "How are you feeling? What stands out?" |
| Description | 5 min | One student summarizes. Put the trends on the board: **gap 28, 23, 20, 18, 18, 16, 14, 13; BHB 6.4, 5.5, 4.1, 2.6, 3.1, 2.0, 1.1, 0.4; K 5.6, 4.6, 3.9, 3.2, 3.6, 3.7, 4.0, 4.2; pH 7.18, 7.23, 7.27, 7.29, 7.27, 7.31, 7.32, 7.34.** |
| Analysis | 20 min | Pick 6-8 questions below. Ask "What were you thinking when...?" first. |
| Summary | 10 min | Each student names one thing they will do differently on clinical. Close with the take-aways. |

### 5.2 Discussion questions with ideas for good answers
1. **Why did Caleb go into DKA when he was eating almost nothing?**
   Without basal insulin the body breaks down fat into ketones whatever he eats; illness hormones (cortisol, adrenaline, glucagon) raise glucose and ketones further. "No food, no insulin" is the classic misconception: basal insulin is never stopped.
2. **The handoff said K 5.6. Why was potassium due at 0715?**
   The 0545 K was 4.6. Insulin and fluids move potassium into the cells; his total-body potassium is low (about 230-380 mEq short) even when the blood level is high. Always read the newest result.
3. **Why add dextrose at 248 instead of lowering the insulin?**
   The insulin is there to clear ketones, not to lower glucose. The gap was still 23 and BHB 5.5. Fixed-rate insulin keeps clearing ketones; D10 keeps the glucose in range.
4. **At 1500, why stop the insulin he "needs"?**
   K 3.2 is under 3.5: insulin would push K lower and risk arrhythmias (he already had U waves and PVCs). Give potassium first (one rider at a time), magnesium, recheck. Cost: BHB rose 2.6 -> 3.1 during the hold, so keep the hold short.
5. **What are the peripheral potassium rules, and how did the 2245 order break them?**
   Riders 10 mEq/100 mL over 1 h, one at a time, at most 4 in a row; no bag over 20 mEq/L; never over 10 mEq/h from all sources. The order was 40 mEq/L and added 4 mEq/h to a 10 mEq/h rider = 14.
6. **What told you the IV had infiltrated, and why was this site a risk?**
   Swelling, coolness, pallor, tightness and burning, with the pump still running. An elbow site bends; KCl irritates veins. Check rider sites every hour; use forearm sites.
7. **At 2300 the pH was 7.31. Why was he not resolved?**
   Resolution needs BHB under 0.6 AND pH 7.3 or more OR bicarbonate 18 or more. BHB was 2.0. At D2 0130 the CO2 was 16 with a gap of 14: part of the low bicarbonate is now a non-gap acidosis from the saline (Cl 109). That is why BHB, not CO2 alone, guides resolution.
8. **Glucose fell 158 -> 112 in an hour at 0200. What should the 0200 nurse have done besides raising the D10 and calling?**
   Recheck at 0230 (fast fall) and trace the dextrose line from the bag to the patient. A running pump with no alarm does not prove the drug reaches the patient.
9. **Why treat a glucose of 62 with D50 and keep the insulin running?**
   Ketones were still clearing (BHB 1.1, gap 14). Stopping insulin restarts ketone production. Treat the low with dextrose, lower the insulin to 3.8 per protocol, fix the cause.
10. **Why must glargine go in at least 2 hours before the drip stops?**
    IV insulin lasts minutes; glargine takes hours to start. Without overlap there is a gap with almost no insulin = rebound DKA. Here 0730 -> 0930.
11. **He said he would take his glargine "at nine tonight like always". What is the risk and the teaching?**
    48 units in 13.5 hours = a night low. Basal is once every 24 hours; when the time changes, the next dose is 24 hours later (0730 tomorrow).
12. **What must be in Caleb's hands before he goes home, and how do you know he can use the sick-day plan?**
    In-date blood ketone strips and glucagon (plus pens, needles, meter strips, glucose tablets), a person trained (Tessa), a tested insulin schedule (one night on SubQ), and follow-up 01/15. Teach-back with numbers: "Your ketones are 1.8 and you're throwing up. Tell me what you do."

**Optional extra:** By D2 0600 he weighs 79.3 kg (above his usual 79.0) and is drinking. Was NaCl 100 mL/h still needed overnight? (It could have been lowered or stopped once he drank well.)

### 5.3 Sick-day plan (teaching key; Dr. Beaumont's written plan, TDD 46 units)
- **Never stop glargine.** Check glucose and blood ketones every 2-4 hours when ill.
- Ketones **0.6-1.4**: extra lispro **5 units** (10% of TDD), recheck in 2 hours.
- Ketones **1.5-2.9**: extra lispro **9 units** (20% of TDD), **call the diabetes team**, recheck in 2 hours.
- Ketones **3.0 or more**: **go to the ED**.
- Repeat the extra dose every 2-4 hours while ketones stay positive; take it only if glucose is over 250 (or 150-250 with carbohydrate taken with it).
- Fluids 250 mL every hour (with 15 g carbohydrate per hour if not eating).
- Call for vomiting more than twice or cannot keep fluids down, glucose over 300 twice, or ketones not falling after extra insulin. ED for ketones 3.0 or more, fast breathing, belly pain or confusion.

### 5.4 Take-aways
1. **Never stop basal insulin when sick.** Check ketones.
2. **Fixed-rate insulin clears ketones; dextrose protects the glucose.** Never stop insulin for a low; give dextrose.
3. **Potassium: read the newest value, respect peripheral limits, hold insulin under 3.5.**
4. **Resolution = BHB under 0.6 plus pH 7.3 or bicarbonate 18,** not a normal glucose.
5. **Trace every line from bag to patient.** A running pump is not proof.
6. **Overlap basal insulin at least 2 hours before stopping the drip.**
7. **Question orders that do not fit:** concentration and rate limits, overlap, missing discharge supplies, isolation that no longer matches the evidence.
8. **Teach with teach-back,** and include the support person.

---

## 6. One-table summary of all 10 stops

| Stop | Monitor (HR, BP, RR, SpO2, T, rhythm, pain) | Say aloud | Key event |
|---|---|---|---|
| **D1 0700** | 112, 108/64, 24 deep, 98% RA, 99.4, sinus tach slightly tall T, pain 4 | Glucose 0700 248 (charted); urine 400 at 0630 | Arrival; handoff quotes old K 5.6, newest 4.6 -> rider 0715; start D10 |
| **D1 1100** | 102, 114/68, 20, 98%, 99.0, sinus tach, pain 3 | 0800 228, 0900 210, 1000 196, 1100 186; urine 350/300/250 | Viral panel negative: **discontinue droplet precautions** |
| **D1 1500** | 98, 116/70, 18, 98%, 98.8, sinus + PVCs 2/min, flat T + U waves, pain 2 | 1200 182, 1300 190, 1400 196, 1500 202; urine 250/250/250 | **K 3.2: hold insulin and D10**, 4 riders, MgSO4, ECG, STAT labs 1720 |
| **D1 1900** | 96, 120/72, 18, 98%, 99.1, sinus low T small U, pain 5 (right elbow) | 1600 238, 1700 266, 1800 274, 1900 244; urine 300/300; rider 92 of 100 mL in | Insulin restarted 1750; restart D10; **KCl IV infiltration** (grade 2) |
| **D1 2300** | 88, 118/70, 16, 97%, 98.6, sinus normal T, pain 1 | 2000 222, 2100 204, 2200 190, 2300 176; urine 250/300 | **Wrong order 1:** KCl 40 mEq/L peripheral bag (14 mEq/h with rider) |
| **D2 0300** | 116, 134/80, 20, 98%, 98.2, sinus tach, pain 1; 0320: 92, 122/74, 16 | 0000 166, 0100 158, 0200 112, **0300 62**, 0315 124; urine 250/300 | D10 tubing disconnected; D50, new tubing D10 150, insulin 3.8; fall risk |
| **D2 0700** | 80, 122/74, 16, 98%, 98.4, sinus, pain 0 | 0400 140, 0500 152, 0600 156, 0700 152, 0745 154; weight 79.3 kg; urine 200/300 | **DKA resolved; wrong order 2:** no-overlap transition -> glargine 0730, drip off 0930 |
| **D2 1100** | 78, 124/76, 14, 99%, 98.6, sinus, pain 0 | 0830 172, 0930 180, pre-lunch 1130 196; urine 300/350 | Off the drip; plans glargine "at nine tonight"; lunch 8 units |
| **D2 1500** | 76, 122/76, 14, 99%, 98.4, sinus, pain 0 | No check since 1130 (196); lab 214 at 1330; 1700 will be 142; urine 300/350 | Long-acting pen for a 2-unit snack dose; sick-day teach-back |
| **D2 1900** | 74, 120/74, 14, 99%, 98.4, sinus, pain 0 | 1700 142; urine 300/300 | **Wrong order 3:** no ketone strips or glucagon; discharge D3 about 1000 |

All stops on room air; no oxygen.

---

## 7. Troubleshooting

- **Students far ahead or behind:** use **1h ▶** or **Next event**; labs and notes appear at their own times.
- **Students hang two riders at once or a rider on top of the 40 mEq/L bag:** stop the scene and add up mEq per hour.
- **Students stop the insulin at 0300:** "What were the BHB and the gap at 0130? What happens to ketones without insulin?"
- **Students catch an error early** (for example the transition order at 0635): excellent; give the provider reply early.
- **Monitor shows the wrong patient:** check the header reads MERCER, CALEB; press 4h once, or re-enter the Monitor code.
- **No sound at 0300:** press **S** on the monitor computer and check its volume.

# In-class SCI patient: Wesley Harcourt, chronic T4 spinal cord injury, UTI, autonomic dysreflexia (SHELL design, single source of truth)

**Status: SHELL (draft).** About half the depth of `../dka_newonset/DESIGN.md`. The instructor will refine it. Follow `BRIEF.md`, `AGENTS.md` and the "Rules every patient follows" in `.claude/skills/patient-course/SKILL.md`.

Simulation: **Mon 2027-03-08 0700 to Tue 2027-03-09 0700 (24 h)**. "D1" = Monday 03/08, "D2" = Tuesday 03/09, "D0" = Sunday 03/07 (ED). Seven checkpoints: **D1 0700, 1100, 1500, 1900, 2300, D2 0300, 0700**. Everything is time-gated to the minute.

In-class chart rules for this patient:
- **Vital signs are charted only up to the 0700 arrival.** After 0700 the Bedside Monitor shows them (`monitor.html`, MRN SIM-40603). The instructor says aloud the values that are not on the monitor (orthostatic set, AD-event BP checks between rows, bladder volumes).
- **A NEW full nursing assessment at every stop** (all body-system rows, values carried forward, changed rows tell the story, an IV site row). No vital-sign numbers in assessment text.
- **A NEW lab set, or at least one new result, before every stop.**
- MAR: ED doses `given`; NS running at 0700 shows "0700 Running"; **every dose after D1 0700 is `due`**.
- The students are the unit RNs at every stop. Unit RN notes are not pre-written, **except** the charge nurse's AD event note (the event happens between stops; the chart must show it).
- **Chart text never says "student", "scenario", "simulation" or "planted".**

---

## 1. Patient

- **Wesley Harcourt** ("Wes"), 34-year-old man, he/him. DOB **1992-10-19**. MRN **SIM-40603**. caseCode **CS-SCI-AD-HARCOURT**.
- Height **180 cm**; weight **72.0 kg** (bed scale, ED). BMI = 72.0 / 1.80^2 = 72.0 / 3.24 = **22.2**. Usual weight 74 kg (SCI clinic, 11/2026). Low muscle mass below T4.
- **Allergy:** penicillin (rash as a child, no hives, no swelling). Full Code.
- Unit: **4 West Medical-Surgical, room 4W-14** (not used by any other patient; checked). Pre-Built group **"Case Study Patients"**. Title: **"Wesley Harcourt, Med-Surg: UTI and autonomic dysreflexia in chronic T4 spinal cord injury (in class) (draft)"**.
- **Home medications** (med rec by pharmacy D1 0745):
  - **Baclofen 10 mg PO three times a day** (0800, 1400, 2000), for spasticity. Do not stop suddenly (withdrawal: seizures, high fever, rebound spasticity).
  - **Oxybutynin 5 mg PO three times a day** (0800, 1400, 2000), for bladder spasms and leaking between caths.
  - **Senna 17.2 mg (2 tablets) PO daily at 1200** (8 h before the bowel program).
  - **Docusate 100 mg PO twice a day** (0800, 2000).
  - **Bisacodyl 10 mg suppository PR daily at 2000** with digital stimulation (bowel program).
  - **Lidocaine 2% jelly** topical before bowel care and catheterization.
  - **Cholecalciferol (vitamin D3) 2,000 units PO daily** (bone loss after SCI).
  - **Sildenafil 50 mg PO PRN** (sexual activity). **Last dose about 10 days ago** (he states 02/26). Matters because nitrates must not be given within 24 h of sildenafil.
  - Acetaminophen 650 mg PO PRN shoulder pain.
  - Supplies: 14 Fr hydrophilic intermittent catheters; abdominal binder; thigh-high compression stockings; air-cell wheelchair cushion; AD wallet card.

## 2. People (unique; each surname grepped across `casestudy/`, `prebuilt/`, `*.html`, `*.js`: no matches)

| Role | Name |
|---|---|
| ED physician | **P. Tolliver, MD** |
| ED RN | **G. Sotelo, RN** |
| Night hospitalist (admitting H&P; D1 night) | **N. Haverty, MD** |
| Day hospitalist (D1) | **M. Kincaid, MD** |
| Physiatry (physical medicine and rehabilitation) | **J. Okerlund, DO** |
| Wound/ostomy nurse | **L. Dunleavy, RN, CWOCN** |
| Physical therapist | **B. Marchand, PT, DPT** |
| Occupational therapist | **C. Pruneda, OTR/L** |
| Pharmacist | **F. Ashby, PharmD** |
| Dietitian | **E. Wexford, RD** |
| Case manager | **R. Varnado, RN CM** |
| Day charge nurse, 4 West (AD event note) | **K. Thibodeaux, RN** |
| ECG over-read | **T. Langston, MD (Cardiology)** |
| Outpatient SCI clinic physiatrist | H. Bergeron, MD |
| Sister / support person / emergency contact | **Claire Harcourt** (31) |
| Personal care attendant (home) | Andre Lusk |

## 3. History

- **Injury:** motor vehicle crash **2025-02-14** (driver, hit on an icy road). **T4 fracture-dislocation, complete injury, ASIA Impairment Scale A, neurological level T4.** Posterior spinal fusion T2-T6 on 2025-02-15. Spinal shock resolved over about 6 weeks. 8 weeks of inpatient rehab. Now **about 2 years after injury**: well past spinal shock, so **autonomic dysreflexia (AD) can happen** (injury at T6 or above).
- **Function:** full arm and hand strength (5/5). No movement or feeling below the nipple line. Manual wheelchair; independent slide-board transfers; drives an adapted van with hand controls.
- **Sensory level:** light touch and pinprick normal through T4 on both sides, absent from T5 down. No anal sensation, no voluntary anal contraction (complete).
- **Autonomic:** low resting BP (SBP **90-100**, HR **60s-70s**) because sympathetic tone below T4 is lost. **Orthostatic hypotension** when sitting up quickly; uses a binder and compression stockings. Poor sweating and poor temperature control below the injury.
- **Prior AD episodes: 3 at home**, all mild to moderate:
  - 2025-09: full bladder from a late cath (SBP about 160). Resolved after cathing.
  - 2026-01: ingrown toenail.
  - 2026-06: tight shoes and a folded leg strap.
  - He carries an AD wallet card that lists his baseline BP (95/60). He knows his symptoms: "stuffy nose first, then the headache."
- **Bladder program:** neurogenic bladder (spastic/reflex). **Self intermittent catheterization every 4-6 h** (5 times a day), 14 Fr hydrophilic catheter, volumes 350-450 mL (goal under 500 mL). Oxybutynin for spasms. **2 UTIs in the last year**, both treated with **trimethoprim-sulfamethoxazole** (last one 10/2026). Drinks about 2-2.5 L/day.
- **Bowel program:** every evening at **2000**: senna at noon, bisacodyl suppository with lidocaine jelly, digital stimulation every 10 min, on a padded commode chair; done in 30-45 min. Usually a soft-formed stool every evening. **Last BM Sat 03/06 2100**; he skipped Sunday evening because of the fever.
- **Skin history:** stage 2 pressure injury on the right ischium during rehab (2025-04), healed in 5 weeks. Uses an air-cell cushion, does pressure reliefs (forward lean or side lean) every 15-30 min, checks his skin with a long-handled mirror every morning and evening.
- **Other:** mild depression in the first year after injury, treated with counseling (finished 2026); no current medicine. No diabetes, no heart disease. Never smoked. Alcohol 2-4 beers a week. No drugs. Vaccines up to date.

## 4. Social history and support

- Lives **alone** in an accessible ground-floor apartment. Works full time from home as a software quality tester.
- Personal care attendant **Andre Lusk** 3 mornings a week (shower, laundry, groceries). Wes does his own caths and bowel program.
- **Sister Claire Harcourt** (31, dental hygienist) lives 15 minutes away. Emergency contact. Drove him to the ED. Brings his own cushion and supplies on D1 about 1600.
- Plays wheelchair basketball on Thursdays. Parents live in another state.
- Goals: "Get the infection treated, protect my skin, and get home. I can't miss a week of work."

## 5. Reason for admission (one main problem) and why

**Main problem: complicated urinary tract infection (febrile, likely upper tract) in a man with neurogenic bladder from chronic T4 SCI.** Secondary finding: a **new stage 2 sacral pressure injury** found in the ED.

Why UTI as the one main problem:
- UTI is the most common reason people with chronic SCI are readmitted. It is short, simple and treatable in 24 h (afebrile, culture-guided oral step-down).
- It ties straight to the bladder, which is also the most common AD trigger. The indwelling catheter placed for the UTI work-up is what kinks.
- It teaches that **UTI looks different in SCI** (no burning or flank pain he can feel; instead fever, more spasms, leaking between caths, cloudy foul urine, "just feeling off").
- A stage 3 wound would need a longer course and a wound culture to be meaningful. A **small stage 2** keeps skin care, turning, the mattress, the wound nurse and the nutrition labs in the course without adding a second infection. No wound culture: a clean stage 2 with no signs of infection should not be swabbed (teaching point).

Diagnosis line (H&P): "Complicated UTI (febrile) in neurogenic bladder, chronic T4 AIS A spinal cord injury; stage 2 sacral pressure injury (present on admission)."

## 6. Story before 0700 (ED, all charted, given)

- **Sat 03/06:** urine cloudier and smelled strong; two leaks between caths; more leg spasms.
- **Sun 03/07:** chills by noon. Felt "off" and tired; sat in his wheelchair most of the day in damp clothes and skipped pressure reliefs. Mild stuffy nose and headache when his bladder got full at 1600 (a small AD episode that resolved after he cathed). Temperature at home 101.6 F at 2000. Claire drove him in.

| Time (D0 Sun) | Event |
|---|---|
| **2130** | ED arrival with Claire. |
| **2140** | **Triage** (Sotelo): **T 101.8 F (38.8 C), HR 98, BP 92/56, RR 18, SpO2 96% RA**, pain 2 (shoulders). Alert, oriented x4. "My normal BP is 95 over 60." Weight 72.0 kg. |
| 2150 | Tolliver orders: CBC, BMP, Mg, lactate, procalcitonin, CRP, ESR, blood cultures x2, UA and urine culture from a **new** catheter, 0.9% NaCl 1,000 mL bolus, acetaminophen, ceftriaxone after cultures, indwelling catheter. |
| **2200** | **PIV 20 g left forearm.** Labs drawn. **Indwelling catheter 16 Fr** placed (lidocaine jelly; 450 mL cloudy, foul urine); UA and culture from the new catheter. Blood cultures 2205 (left arm) and 2210 (right arm). |
| 2200 | **0.9% NaCl 1,000 mL over 1 h** (2200-2300). |
| 2210 | **Skin check: stage 2 sacral pressure injury**, 2.0 x 1.5 x 0.1 cm (new). Foam dressing. Pressure-redistribution overlay ordered for the ED stretcher (not available; he stayed on a standard stretcher for 9 h: a teaching point). |
| **2230** | **Acetaminophen 1,000 mg PO.** |
| 2240 | UA result (nitrite positive, LE 3+). CBC, BMP, lactate results 2235-2245. |
| **2300** | **Ceftriaxone 1 g IV** (after cultures). **0.9% NaCl 100 mL/h** starts. Vitals T 101.2, HR 92, BP 98/60, RR 18, SpO2 96%. |
| 2350 | ED provider note. Haverty accepts the admission; no 4 West bed until morning (boarding in ED). |
| **D1 0100** | Vitals T 100.4, HR 84, BP 96/58, RR 16, SpO2 97%. |
| **0115** | **Admission orders (Haverty)**, including the planted call-parameter order (section 11). |
| 0120 | Admitting H&P. |
| 0200, 0400, 0600 | Turned every 2 h by ED staff (0200 left, 0400 right, 0600 left). |
| **0400** | Vitals T 99.8, HR 74, BP 94/58, RR 16, SpO2 97%. |
| **0430** | **Acetaminophen 650 mg PO** (T 100.0). |
| 0500 | AM labs drawn. |
| 0630 | ED nursing note. 0640 ED-to-unit handoff note. 0645 urine bag emptied. |
| **0650** | Arrives in **4W-14** on a low-air-loss mattress. |
| **0700** | Unit vitals (charted): **T 99.4 F (37.4 C), HR 70, BP 96/58, RR 16, SpO2 97% RA, pain 2 (shoulders).** |

## 7. Baseline and how to read his vital signs (state it the same everywhere)

- **His normal: SBP 90-100, DBP 56-62, HR 60s-70s.** A "normal" adult BP of 120/80 is **20-30 above his baseline**.
- **AD threshold (2020 consortium guideline):** SBP **20-40 mmHg above baseline** in a person with SCI at T6 or above = suspect AD. For Wes: **SBP 120-140 or higher, or any AD symptom** (pounding headache, flushing and sweating above T4, stuffy nose, blurred vision, slow pulse, goose bumps).
- **Orthostatic hypotension:** SBP drop of 20 or more, or DBP drop of 10 or more, within 3 min of sitting up, with or without symptoms.
- **qSOFA warning:** in the ED his SBP 92 scored 1 qSOFA point, but that is his baseline. Low BP in SCI has to be read against his own normal (teaching point).
- **Temperature:** poor sweating below T4. Fever 101.8 is real. At night he runs cool (97.8-98.0); keep the room warm and use blankets; no cooling blankets.

## 8. The autonomic dysreflexia event (D1 0905-1150)

**Cause:** the catheter tubing was **kinked under his left thigh** when he was boosted up in bed for his breakfast tray at **0730**. The bag was emptied at 0730 (150 mL) and nothing drained after that. His bladder filled to about **600 mL** in 110 min.

Volume math: 600 mL / 110 min = about 330 mL/h. This is higher than his usual output (about 150-200 mL/h) because of the overnight 1 L bolus, IV 100 mL/h, and about 1,000 mL he drank 0600-0900 ("I always drink a lot when I have a UTI"). Any volume over about 300-400 mL can trigger AD in a reflex bladder; 600 mL is enough. (The brief's example was 800 mL; 600 fits his intake and timing. The instructor may change it.)

**Minute-by-minute (between stops; the monitor shows the rows marked M):**

| Time | BP | HR | What happens |
|---|---|---|---|
| 0905 | (not taken) | | Goose bumps on his arms, stuffy nose. He thinks it is the room. |
| 0912 | | | Sudden **pounding headache** (8/10, back of head). Blurred vision. He calls. |
| **0915 (M)** | **164/94** | **62** | Day RN in. Face, neck and upper chest **flushed and sweaty**; skin below the nipple line **pale, cool, goose bumps**. Anxious. He says: "This is dysreflexia. Check my bladder." Bag has 0 mL since 0730. |
| 0916 | | | RN **raises the head of the bed to 90 degrees and lowers his legs** (bed to chair position). Calls for help; charge nurse Thibodeaux comes; a second RN calls Dr. Kincaid at 0918. |
| **0917 (M)** | **182/102** | **54** | **Loosens the abdominal binder and both compression stockings** and the gown ties. |
| **0919 (M)** | **196/108** | **48** | Traces the catheter from the meatus to the bag. |
| **0920 (M)** | **204/112** (peak) | **46** | **Kink found under the left thigh.** Straightened. Cloudy amber urine flows fast. |
| 0921 | | | Kincaid on the phone: continue the protocol, 12-lead ECG, nitroglycerin ointment only if SBP stays 150 or more after the bladder is empty; call back in 15 min. |
| **0923 (M)** | **172/98** | **50** | **12-lead ECG** (second RN): sinus bradycardia 50. About 400 mL drained. |
| **0925 (M)** | **156/90** | **56** | Headache 6/10. Drainage finished at 0926: **600 mL** total. No clamping. |
| 0927 | 144/86 | 58 | **SBP under 150 and falling with the cause removed: nitroglycerin NOT needed.** |
| **0930 (M)** | **132/80** | **62** | Headache 4/10; flushing fading. Bladder scan **30 mL** (catheter draining). Catheter secured to the thigh with a securement device; bag below bladder, off the floor, tubing straight. |
| 0935 | 120/74 | 64 | Every 5 min until 0950. |
| 0940 | 114/70 | 66 | |
| **0945 (M)** | **110/68** | **66** | Headache 2/10. Neuro check normal (no weakness of arms, speech clear, pupils equal). |
| 0950 | 108/66 | 66 | **Resolved** (symptoms gone, BP near baseline). Now **every 15 min for 2 h** (to 1150). Charge RN event note 0950. |
| **1000 (M)** | **104/62** | **68** | Headache 1/10. Tired, embarrassed: "I should have felt it coming sooner." |
| 1005 | 104/62 | 68 | Kincaid at bedside; event note; corrects the call parameters (section 11). |
| 1020 | 102/62 | 68 | |
| 1035 | 100/60 | 70 | |
| 1050 | 100/60 | 70 | |
| **1100 stop** | **100/60** | **70** | Monitoring continues: students do the **1105, 1120, 1135, 1150** checks (instructor says 98/60, 100/60, 98/58, 100/60; all HR 68-72; no symptoms). Then back to every 4 h. |

**Nursing actions (Ignatavicius 11e, with the 2020 consortium guideline):**
1. Stay with him; call for help. **Sit him up** and **lower the legs** (pools blood in the legs, lowers BP).
2. **Loosen anything tight** (binder, stockings, clothing, leg bag straps).
3. **BP and HR every 2-5 min** until resolved.
4. **Find and remove the cause, bladder first:** check the whole catheter for kinks, clamps, a full bag or a bag above the bladder; if no flow, irrigate gently with 10-15 mL NS at body temperature; if still no flow, replace the catheter (with lidocaine jelly). Here: straightening the tubing was enough.
5. If the bladder is not the cause: **bowel** (lidocaine 2% jelly, wait, then check for stool; if SBP is 150 or more, give the antihypertensive first), then **skin** (pressure, wrinkles, wounds, ingrown nail, tight shoes).
6. **Notify the provider** (a second person, at the same time as the first steps).
7. **Antihypertensive only if SBP stays 150 or more after the cause is removed** or no cause is found: **nitroglycerin 2% ointment 1 inch** on the chest above T4 (wipe off if SBP falls under 100 or he gets lightheaded). **Check sildenafil first** (none in 24 h: last dose about 10 days ago). Not given here.
8. **Monitor for 2 h after resolution** (rebound low BP after a drug; recurrence). Watch urine flow.
9. Document. Teach prevention (tubing checks with every turn, bag below the bladder, securement device, cath on time, bowel program with lidocaine, skin checks) and keep the **AD card** with him.

**Textbook vs guideline (for the instructor):** Ignatavicius 11e says check BP every 10-15 min and lists nifedipine or nitrates. The 2020 consortium guideline (Paralyzed Veterans of America Consortium for Spinal Cord Medicine, Autonomic Dysreflexia, 2nd ed.) says **every 2-5 min** during the acute event and an antihypertensive only for **SBP 150 or more** after the cause search; immediate-release nifedipine is used with caution. This design follows the guideline for the acute checks (2-5 min) and uses nitroglycerin ointment (it can be wiped off).

## 9. Orthostatic hypotension (D1 1345, PT/OT; instructor says these aloud at 1500)

| Time | Position | BP | HR | Symptoms |
|---|---|---|---|---|
| 1345 | Supine | 98/60 | 70 | none |
| 1346 | Sitting edge of bed, 1 min (binder NOT back on since the AD event) | 82/50 | 84 | lightheaded |
| 1348 | Sitting 3 min | **76/46** | 88 | "my vision is going dim", yawning |
| 1349 | Reclined, legs up | 96/58 (1351) | 74 | resolved |
| 1400 | **Binder snug, stockings on, head of bed raised over 10 min**, then sitting 3 min | **90/56** | 80 | none; tolerated 20 min in a tilt-in-space chair |

Math: 98 - 76 = **22** SBP drop and 60 - 46 = **14** DBP drop = orthostatic hypotension. With the binder and stockings: 98 - 90 = 8 (not orthostatic). Teaching: the binder and stockings that are **loosened for AD** must be **put back on** before he sits up again.

## 10. Labs (collected / result times)

Normal ranges: WBC 4.5-11.0, Hgb 13.5-17.5 (male), Plt 150-400, Na 136-145, K 3.5-5.1, Cl 98-107, CO2 22-29, BUN 7-20, Cr 0.7-1.3 (male), glucose 70-99, Ca 8.6-10.3, Mg 1.8-2.4, CRP under 8 mg/L, ESR 0-15 mm/h, procalcitonin under 0.1 ng/mL (0.25-0.5 = bacterial infection possible), lactate 0.5-2.0, albumin 3.5-5.0 g/dL, prealbumin 18-38 mg/dL, 25-OH vitamin D 30-100 ng/mL.

**Chemistry and CBC**

| Set | Collected | Result | WBC (neut %) | Hgb / Hct | Plt | Na | K | Cl | CO2 | BUN | Cr | Glu | Ca | Mg | **AG** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ED | D0 2200 | CBC 2235, BMP 2245 | **14.6** (84%, bands 4%) | 13.4 / 40.1 | 262 | 136 | 4.2 | 102 | 23 | **22** | 0.7 | 118 | 9.0 | 2.0 | 11 |
| AM | D1 0500 | 0600 | **13.1** (81%) | 12.6 / 37.9 | 248 | 137 | 3.9 | 105 | 22 | 16 | 0.6 | 104 | 8.7 | 1.9 | 10 |
| PM | D1 1700 | CBC 1745 | **11.0** (76%) | 12.7 / 38.1 | 251 | | | | | | | | | | |
| AM | D2 0500 | 0600 | **8.9** (68%) | 12.8 / 38.4 | 255 | 138 | 4.1 | 104 | 25 | 12 | 0.6 | 96 | 8.9 | 2.0 | 9 |

**Inflammation and nutrition**

| Test | Collected | Result time | Value |
|---|---|---|---|
| Lactate | D0 2200 | D0 2245 | 1.6 |
| Procalcitonin | D0 2200 | D0 2330 | **0.42** |
| CRP | D0 2200 | D0 2300 | **98 mg/L** |
| ESR | D0 2200 | D0 2300 | **48** |
| CRP | D1 0500 | 0600 | **112** (peak) |
| ESR | D1 0500 | 0630 | **52** |
| Albumin | D1 0500 | 0600 | **3.2** |
| Prealbumin | D1 0500 | **1030** | **14** |
| 25-OH vitamin D | D1 0500 | **1400** | **22** (insufficient) |
| CRP | D1 1700 | **1800** | **86** |
| CRP / ESR | D2 0500 | 0600 / 0630 | **54** / 46 |

**Urine**
- **UA** (new catheter, D0 2200; result 2240): cloudy amber, SG 1.024, pH 6.5, protein 1+, blood small, **leukocyte esterase 3+, nitrite positive**, WBC over 50/hpf with WBC clumps, RBC 5-10, bacteria many, squamous cells 0-2 (a clean sample).
- **Urine culture** (new catheter, D0 2200):
  - D1 **1400** preliminary: **greater than 100,000 CFU/mL gram-negative rods; identification to follow.**
  - D1 **2200**: **Escherichia coli, greater than 100,000 CFU/mL; susceptibilities to follow.**
  - D2 **0230** final susceptibilities: ampicillin **R**; ampicillin-sulbactam I; cefazolin S (urine breakpoint; predicts oral cephalosporins); **ceftriaxone S**; **ciprofloxacin S**; **trimethoprim-sulfamethoxazole R**; nitrofurantoin S; gentamicin S.
- **Blood cultures x2** (D0 2205, 2210): D1 **1000** "no growth at 12 hours"; D1 **2200** "no growth at 24 hours"; final at 5 days (after the course).

**Math**
- Anion gap = Na - Cl - CO2 (normal 8-12): ED 136 - 102 - 23 = **11**; D1 0500 137 - 105 - 22 = **10**; D2 0500 138 - 104 - 25 = **9**. No gap acidosis; lactate normal.
- BUN/Cr ED 22 / 0.7 = **31**: mild volume depletion from fever and poor intake; BUN 22 -> 16 -> 12 with fluids.
- **eGFR (CKD-EPI 2021, male, age 34):** 142 x (Cr/0.9)^-0.302 x 0.9938^34.
  - 0.9938^34 = 0.809.
  - Cr 0.7: (0.778)^-0.302 = 1.079 -> 142 x 1.079 x 0.809 = **124**.
  - Cr 0.6: (0.667)^-0.302 = 1.130 -> 142 x 1.130 x 0.809 = **130**.
  - **Teaching point:** creatinine is low because muscle mass is low after SCI, so creatinine-based eGFR **overestimates** kidney function. Cystatin C is more accurate if it matters (not needed here).
- **Hgb 13.4 -> 12.6:** dilution from 2.2 L of IV fluid, not bleeding.
- **Prealbumin 14 and albumin 3.2:** low, but both fall in inflammation (CRP 112). They are not a pure nutrition marker. The dietitian uses intake and the wound, not the number alone.
- **Protein goal (dietitian):** 1.25-1.5 g/kg for a pressure injury = 1.25 x 72 = **90** to 1.5 x 72 = **108 g/day**. Fluid 30 mL/kg = **2,160 mL/day**.
- **Braden score (0700):** sensory 1 + moisture 3 + activity 2 + mobility 2 + nutrition 3 + friction/shear 2 = **13 (moderate risk)**.

**ECG (Cardiology record with image)**
- **D1 0923, 12-lead, during AD:** **sinus bradycardia, rate 50**, PR 0.18 s, QRS 0.08 s, QTc 0.41 s, normal axis, no ST or T-wave changes. Over-read by T. Langston, MD at 1015 (image available 0930; over-read text at 1015). Interpretation: "Sinus bradycardia, 50. Otherwise normal ECG."
- Image: `python3 casestudy/tools/ecg_image.py --rate 50 --pr 0.18 --qrs 0.08 --qtc 0.41 --rhythm sinus_brady --name "HARCOURT, WESLEY" --mrn SIM-40603 --dob 1992-10-19 --age 34 --sex Male --when "2027-03-08 09:23" --location 4W-14 --out ...`
- Teaching: the slow heart rate is the body's vagal response to the very high BP (the brain senses it above the injury and slows the heart, but cannot send signals down past T4 to relax the vessels).

## 11. Orders (who, orderedAt, start, end, stoppedEarly)

Times D1 unless marked. "SE" = `stoppedEarly` (stop time hidden until it happens).

| Order | By | orderedAt | Start | End | Notes |
|---|---|---|---|---|---|
| ED labs (CBC, BMP, Mg, lactate, procalcitonin, CRP, ESR, blood cultures x2, UA, urine culture from new catheter) | Tolliver | D0 2150 | D0 2200 | once | |
| Insert indwelling urinary catheter 16 Fr (lidocaine jelly); urine specimens from the new catheter | Tolliver | D0 2150 | D0 2200 | once | |
| 0.9% NaCl 1,000 mL IV over 1 h | Tolliver | D0 2150 | D0 2200 | D0 2300 | given |
| Acetaminophen 1,000 mg PO once | Tolliver | D0 2150 | D0 2230 | once | given |
| Ceftriaxone 1 g IV once (after cultures) | Tolliver | D0 2150 | D0 2300 | once | given; continued by the admission order |
| 0.9% NaCl 100 mL/h IV continuous | Tolliver | D0 2250 | D0 2300 | **SE 1100** | 0700 Running; stopped by Kincaid |
| Admit inpatient, 4 West Med-Surg, Full Code | Haverty | 0115 | 0115 | | |
| **PLANTED ERROR: Vital signs every 4 h. Call provider for SBP greater than 160 or less than 90, HR greater than 120 or less than 50, T over 101.5 F, SpO2 under 92%.** | **Haverty** | **0115** | 0115 | **SE 1005** | Default order-set values, not fitted to him. **SBP over 160 is 60-70 above his baseline**; his AD starts at SBP 120-140. And **SBP under 90** fires at his normal BP. Catch at the 0700 stop (call to clarify) or at the 1100 debrief. Replaced 1005. |
| **Autonomic dysreflexia protocol (nurse-driven).** Baseline SBP 90-100. Suspect AD with SBP 20-40 above baseline or any symptom. Sit up, legs down; loosen; BP/HR every 2-5 min; bladder first (check tubing, irrigate 10-15 mL NS at body temperature, replace if no flow); bowel with lidocaine 2% jelly (antihypertensive first if SBP 150 or more); skin; call provider; after resolution BP every 15 min for 2 h | Haverty | 0115 | 0115 | | |
| **Nitroglycerin 2% ointment 1 inch topical to chest above T4, PRN per AD protocol: SBP 150 or more after the cause search. Do not give if sildenafil within 24 h (tadalafil 48 h). Wipe off if SBP under 100 or symptoms. May repeat once in 30 min; call.** | Haverty | 0115 | 0115 | | not given |
| **Hold sildenafil while hospitalized** (nitrate PRN ordered) | Haverty | 0115 | 0115 | | |
| Ceftriaxone 1 g IV every 24 h (next due D1 2300) | Haverty | 0115 | D1 2300 | **SE D2 0545** | culture-guided change (below) |
| Acetaminophen 650 mg PO every 6 h PRN T over 100.4 F or pain (max 3 g/day) | Haverty | 0115 | 0115 | | given D1 0430 (ED) |
| **Indwelling urinary catheter: maintain** (secure to thigh, bag below bladder and off the floor, **check the tubing for kinks every 2 h and with every turn**, empty when half full, catheter care daily). **RN may remove when: afebrile 8 h or more, IV fluids off, no hourly output needed; then start intermittent catheterization.** | Haverty | 0115 | 0115 | none | **THE ORDER TO DISCONTINUE** (stop 4, D1 1900). Criteria met: afebrile without acetaminophen since 1030 (last dose 0430; 8.5 h by 1900), NS off 1100, physiatry recommends at 1600. Reason: "criteria met; resumed home intermittent catheterization." |
| Intermittent catheterization every 4 h after the indwelling catheter is removed (14 Fr hydrophilic, his own supplies OK); keep volumes under 500 mL; bladder scan if over 500 or any AD sign | Haverty | 0115 | after removal | | first 2200 |
| Strict I&O | Haverty | 0115 | 0115 | | |
| **Turn every 2 h** (30-degree side-lying, no lying on the sacrum), heels floated off the bed, **low-air-loss mattress** | Haverty | 0115 | 0115 | | |
| Wound care sacrum (stage 2): cleanse with NS, silicone foam border dressing, change every 3 days and PRN soiled; assess every shift | Haverty | 0115 | 0115 | | refined by wound nurse 1215 |
| **Enoxaparin 40 mg SubQ daily at 0900** (clot risk: SCI with immobility plus acute infection) | Haverty | 0115 | 0900 | | first dose due 0900 (the AD event delays it) |
| Baclofen 10 mg PO TID (0800, 1400, 2000); **do not hold** (withdrawal) | Haverty | 0115 | 0800 | | |
| Oxybutynin 5 mg PO TID (0800, 1400, 2000) | Haverty | 0115 | 0800 | | |
| Senna 17.2 mg PO daily 1200; docusate 100 mg PO BID (0800, 2000) | Haverty | 0115 | 0800 | | |
| **Bowel program daily 2000:** bisacodyl 10 mg PR with digital stimulation; **lidocaine 2% jelly** first; stop and follow the AD protocol if symptoms | Haverty | 0115 | 2000 | | |
| Lidocaine 2% jelly topical PRN (bowel care, catheter care, rectal check) | Haverty | 0115 | 0115 | | |
| Cholecalciferol 2,000 units PO daily 0800 | Haverty | 0115 | 0800 | | |
| Diet: regular, high protein; fluids about 2-2.5 L/day spread over the day (less after 2000) | Haverty | 0115 | 0115 | | |
| Activity: slide-board transfers with assist; **binder and thigh-high stockings on before sitting up**; raise head of bed slowly; orthostatic VS with first sit | Haverty | 0115 | 0115 | | |
| Incentive spirometer 10 times every hour while awake; assisted cough PRN | Haverty | 0115 | 0115 | | |
| AM labs D1 0500: CBC, BMP, Mg, CRP, ESR, albumin, prealbumin, 25-OH vitamin D | Haverty | 0115 | 0500 | once | |
| Consults: wound/ostomy nurse, PT, OT, physiatry, dietitian, pharmacy, case management | Haverty | 0115 | 0115 | | |
| 12-lead ECG once (phone order) | Kincaid | 0922 | 0922 | once | done 0923 |
| **Corrected call parameters** (replaces the planted order): call for **SBP 130 or more, or any AD symptom at any BP**; SBP under 80 or symptomatic orthostatic drop; HR under 50 or over 110; T over 100.4 F; SpO2 under 92% | Kincaid | 1005 | 1005 | | |
| Discontinue 0.9% NaCl; saline lock, flush every 8 h | Kincaid | 1050 | 1100 | | |
| CBC, CRP at 1700 | Kincaid | 1005 | 1700 | once | |
| Nutrition: high-protein supplement 1 bottle twice a day (1000, 1600); multivitamin daily | Wexford (entered by Kincaid) | 1310 | 1400 | | |
| Wound care update: same dressing; reposition in chair: pressure relief every 15 min; use his own air-cell cushion; limit sitting to 1 h at a time until the sacrum is healing | Dunleavy | 1215 | 1215 | | |
| AM labs D2 0500: CBC, BMP, Mg, CRP, ESR | Kincaid | 1730 | D2 0500 | once | |
| **Culture-guided change:** stop ceftriaxone; **ciprofloxacin 500 mg PO every 12 h** (first dose D2 0900) to finish **7 days total** (through Sun 03/14 0900); give 2 h before or 6 h after calcium, magnesium, iron or zinc products | Haverty | D2 0545 | D2 0900 | | E. coli: ceftriaxone S, cipro S, **TMP-SMX R** (his usual home antibiotic would have failed) |

**Not ordered on purpose:** wound culture (clean stage 2, no signs of infection); imaging (no flank pain he can feel, rapid response to antibiotics; a renal ultrasound would be added if still febrile at 48-72 h); scheduled antihypertensive; midodrine (binder and stockings first).

**Planted order errors: 1** (the call-parameter order). Everything else is correct.

## 12. MAR (every dose after D1 0700 is `due`)

ED `given`: NaCl 1,000 mL bolus D0 2200; acetaminophen 1,000 mg D0 2230; ceftriaxone 1 g D0 2300; acetaminophen 650 mg D1 0430; **0.9% NaCl 100 mL/h (0700 Running)**.

| Time | Due doses |
|---|---|
| D1 0700 | NS 100 mL/h (Due box at the current hour) |
| 0800 | baclofen 10 mg, oxybutynin 5 mg, docusate 100 mg, cholecalciferol 2,000 units |
| 0900 | **enoxaparin 40 mg SubQ** (delayed by the AD event; given about 1010 in the story) |
| 1200 | senna 17.2 mg |
| 1400 | baclofen, oxybutynin; protein supplement (from 1600) |
| 1600 | protein supplement |
| 2000 | baclofen, oxybutynin, docusate; **bisacodyl 10 mg PR** (bowel program) with lidocaine jelly |
| 2300 | **ceftriaxone 1 g IV** (due at the stop) |
| D2 0800-0900 | baclofen, oxybutynin, docusate, cholecalciferol, multivitamin, enoxaparin, **ciprofloxacin 500 mg (0900)**: after the course, shown as due |
| PRN | acetaminophen, nitroglycerin ointment (AD), lidocaine jelly |

## 13. Devices

| Device | Placed | Site / details | Removed |
|---|---|---|---|
| PIV 20 g | D0 2200 | left forearm; NS 100 mL/h until 1100, then saline lock | |
| **Indwelling urinary catheter 16 Fr** | D0 2200 (ED) | 10 mL balloon; securement device added 0930 after the kink | **D1 1915** (RN, per order) |
| Low-air-loss mattress | D1 0650 | 4W-14 | |
| Abdominal binder, thigh-high compression stockings | home | loosened 0917, put back 1400 | |
| Incentive spirometer | D1 0700 | | |
| Own air-cell cushion and wheelchair | D1 1600 (Claire brings) | | |

## 14. Intake and output (4-hour blocks, `periodEnd: true`)

| Block ending | IV | PO | Intake | Urine | Stool | Notes |
|---|---|---|---|---|---|---|
| D0 2300 (from 2130) | 1,000 | 240 | 1,240 | 600 | | 450 at catheter insertion + 150 |
| D1 0300 | 400 | 480 | 880 | 900 | | |
| D1 0700 | 400 | 600 | 1,000 | 760 | | bag emptied 0645 |
| **D1 1100** | 400 | 1,000 | **1,400** | **1,010** | | 150 (0730) + **600 drained at 0920-0926 (AD)** + 260 (0930-1100) |
| D1 1500 | 20 (flushes) | 960 | 980 | 700 | | |
| D1 1900 | | 720 | 720 | 600 | | |
| D1 2300 | | 600 | 600 | 440 | 1 large soft-formed (2050) | 60 at catheter removal 1915 + **IC 2200 380** |
| D2 0300 | | 120 | 120 | 420 | | **IC 0200 420** |
| D2 0700 | | 240 | 240 | 460 | | **IC 0600 460** (close to 500: cath on time, fewer night fluids) |

24 h D1 0700-D2 0700: intake 1,400 + 980 + 720 + 600 + 120 + 240 = **4,060 mL**; urine 1,010 + 700 + 600 + 440 + 420 + 460 = **3,630 mL**; net **+430 mL** (plus insensible losses).

## 15. Nursing assessment by stop (changed rows only; carry everything else forward)

Rows: neuro/sensory, cardiovascular, respiratory, GI/bowel, GU, skin, musculoskeletal/spasticity, pain, temperature regulation, psychosocial, safety, IV site.

| Stop | Changes |
|---|---|
| **D1 0700** | **Neuro:** alert, oriented x4; sensory level T4 both sides (light touch and pinprick absent T5 down); arms 5/5; legs 0/5. **CV:** pulses palpable; legs cool, no edema. **Resp:** clear, diminished at the bases; weak cough; IS 1,500 mL. **GI:** soft, bowel sounds active, last BM Sat 2100 (missed Sunday). **GU:** 16 Fr catheter, cloudy amber foul urine with sediment; bag below bladder; tubing not yet secured to the thigh. **Skin:** sacral stage 2, 2.0 x 1.5 x 0.1 cm, pink wound bed, scant serous drainage, foam dressing intact; heels and ischia intact; Braden 13. **MSK:** mild leg spasms. **Pain:** shoulders 2/10. **Temp:** warm and dry above T4, cool below. **Psychosocial:** frustrated: "I lay on an ED stretcher for 9 hours without my cushion." **Safety:** transfers with assist. **IV:** left forearm 20 g, no redness, NS infusing. |
| **D1 1100** | **Neuro:** headache gone; tired; neuro check normal. **CV:** flushing and goose bumps resolved; legs warm. **GU:** catheter secured to the left thigh with a securement device; tubing straight; urine cloudy amber, less sediment. **Temp:** afebrile; dry. **Psychosocial:** shaken: "That was the worst one yet"; asks staff to check the tubing every time they turn him. **IV:** saline locked at 1100. **Skin:** binder and stockings off (since 0917; to go back on before sitting). |
| **D1 1500** | **CV:** orthostatic drop at PT (section 9), fine with binder and stockings. **Skin:** **right ischium blanchable redness** after 45 min in a hospital wheelchair without his cushion; fades in 20 min; sacrum unchanged. **Resp:** IS 1,600 mL. **GU:** urine clearer yellow. **Psychosocial:** calmer; worried about work. |
| **D1 1900** | **GU:** catheter removal criteria met; **removed 1915** (order to discontinue); next IC due 2200 (he does it himself with set-up). **Skin:** ischium normal; using his own cushion; pressure reliefs every 15 min. **GI:** abdomen slightly full, bowel sounds active; bowel program due 2000 (2 days without a BM = AD risk: lidocaine jelly first). **Psychosocial:** relieved; sister present. |
| **D1 2300** | **GI:** bowel program 2000-2050, large soft-formed stool. **During digital stimulation at 2020: mild headache and goose bumps (BP 128/78, said aloud);** stopped, more lidocaine jelly, waited 5 min; 104/64 at 2026; finished slowly with no more symptoms. **GU:** IC 2200, 380 mL, clear yellow. **MSK:** fewer spasms. **Psychosocial:** tired, proud he "caught it early." |
| **D2 0300** | **Resp:** a few crackles at the right base that clear after assisted cough and IS. **Temp:** cool to touch, 97.8 F range (instructor), extra blanket, room warmed. **GU:** IC 0200, 420 mL. **Skin:** turned every 2 h (0100 right, 0300 left); sacrum unchanged; heels intact. **Psychosocial:** awake at 0300, worried about missing work and his apartment; slept after 0330. |
| **D2 0700** | **Resp:** clear; IS 1,750 mL. **GU:** IC 0600, 460 mL (near 500 limit). **Skin:** foam dressing intact (next change Wed, day 3); edges sealed, no drainage through it (last measured 1215 by the wound nurse: 2.0 x 1.5 x 0.1 cm). **Psychosocial:** ready to learn; teach-back on AD signs, his AD card, catheter timing, skin checks; wants to go home today. **IV:** left forearm saline lock, keep until the first oral antibiotic dose is tolerated. |

## 16. Notes (time-gated; each quotes only results already back)

| Time | Type / author | One line |
|---|---|---|
| D0 2350 | ED provider, Tolliver | Febrile complicated UTI in T4 SCI with neurogenic bladder; UA nitrite +/LE 3+, WBC 14.6, lactate 1.6, procalcitonin 0.42; cultures sent; ceftriaxone, 1 L NS; new stage 2 sacral; admit. |
| D1 0120 | H&P, Haverty | Full history (sections 3-6); BP 92-98 is his baseline; AD history and protocol ordered; enoxaparin for SCI clot risk; continue baclofen; hold sildenafil. |
| 0630 | ED nursing, Sotelo | Overnight in ED: fever down to 99.8 after acetaminophen; turned every 2 h; no overlay was available. |
| 0640 | ED-to-unit handoff, Sotelo | SBAR; catheter draining at 0645; "his BP runs in the 90s, that is normal for him." |
| 0745 | Pharmacy med rec, Ashby | Penicillin childhood rash: ceftriaxone safe (low cross-reactivity); baclofen do not stop; sildenafil last about 10 days ago, no nitrate conflict now, keep held; enoxaparin 40 mg daily fits weight and kidney function (eGFR overestimates in SCI). |
| **0950** | **Event note, charge RN Thibodeaux** | AD 0912-0950: BP peak 204/112, HR 46; kinked tubing under left thigh, 600 mL drained; no antihypertensive needed; provider notified 0918; BP every 15 min to 1150. |
| 1005 | Hospitalist event/progress, Kincaid | AD from catheter kink, resolved without medicine; ECG sinus bradycardia 50, no ischemia; call parameters corrected (SBP 130 or more or any symptom); stop NS at 1100; blood cultures no growth at 12 h (1000). |
| 1015 | Cardiology ECG record, Langston (image) | Sinus bradycardia 50, otherwise normal. |
| 1215 | Wound/ostomy nurse, Dunleavy | Stage 2 sacral (present on admission), 2.0 x 1.5 x 0.1 cm; no culture (no infection signs); foam every 3 days; low-air-loss mattress, 30-degree turns, own cushion, limit sitting to 1 h; prealbumin 14 is low but read with CRP 112. |
| 1310 | Dietitian, Wexford | Protein 90-108 g/day (1.25-1.5 g/kg), fluids about 2.2 L; supplement twice a day; multivitamin; vitamin D level pending. |
| 1415 | PT evaluation, Marchand | Orthostatic drop 98/60 to 76/46 without binder; 90/56 and tolerated with binder, stockings and slow raise; independent slide-board transfers. |
| 1430 | OT evaluation, Pruneda | Independent self-cath and bowel care with set-up; pressure reliefs every 15 min; needs his own cushion; long-handled mirror. |
| 1600 | Physiatry consult, Okerlund | Chronic T4 AIS A with AD from a catheter kink; remove indwelling catheter tonight and resume IC every 4 h (under 500 mL); lidocaine before bowel care; vitamin D 22: continue 2,000 units, recheck in 3 months; AD card reviewed; SCI clinic in 2 weeks. |
| 1630 | Case management, Varnado | Lives alone, PCA 3 mornings/week, sister nearby; home health nursing for wound checks twice weekly; plan home D2 if afebrile on oral antibiotic. |
| 1730 | Hospitalist progress, Kincaid | Afebrile, no acetaminophen since 0430; urine culture prelim gram-negative rods (1400); continue ceftriaxone; CBC/CRP at 1700 pending. |
| D1 2240 | Night hospitalist, Haverty | Urine culture E. coli (2200), susceptibilities pending; blood cultures no growth at 24 h; WBC 11.0, CRP 86 (improving); continue ceftriaxone. |
| D2 0545 | Night hospitalist, Haverty | E. coli R to TMP-SMX and ampicillin, S to ceftriaxone and ciprofloxacin; switch to ciprofloxacin 500 mg PO every 12 h from 0900 for 7 days total; home TMP-SMX would not have worked. |

(Builder: the dietitian note at 1310 must say "vitamin D level pending" because the result is at 1400.)

## 17. Bedside monitor rows (`monitor.html`, key SIM-40603, label "4W-14   HARCOURT, WESLEY   34 M")

pr 0.16 and qrs 0.08 unless noted; tAmp 0.3; uAmp 0; pvc 0; o2 RA; no events.

| Row | hr | spo2 | sys/dia | rr | temp F | rhythm | pr | note |
|---|---|---|---|---|---|---|---|---|
| D1 0700 | 70 | 97 | 96/58 | 16 | 99.4 | sinus | 0.16 | baseline BP; shoulder pain 2 |
| 0915 | 62 | 97 | 164/94 | 18 | 99.0 | sinus | 0.16 | pounding headache 8, flushed, stuffy nose |
| 0917 | 54 | 98 | 182/102 | 18 | 99.0 | sinus brady | 0.18 | sat up, legs down, binder loosened |
| 0919 | 48 | 98 | 196/108 | 20 | 99.0 | sinus brady | 0.18 | tracing catheter |
| 0920 | 46 | 98 | 204/112 | 20 | 99.0 | sinus brady | 0.18 | kink found; draining |
| 0923 | 50 | 98 | 172/98 | 18 | 99.0 | sinus brady | 0.18 | ECG |
| 0925 | 56 | 98 | 156/90 | 18 | 99.0 | sinus brady | 0.18 | 600 mL drained; headache 6 |
| 0930 | 62 | 97 | 132/80 | 16 | 98.9 | sinus | 0.16 | headache 4 |
| 0945 | 66 | 97 | 110/68 | 16 | 98.9 | sinus | 0.16 | headache 2 |
| 1000 | 68 | 97 | 104/62 | 16 | 98.8 | sinus | 0.16 | headache 1 |
| D1 1100 | 70 | 97 | 100/60 | 16 | 98.8 | sinus | 0.16 | q15 checks to 1150; pain 0 |
| D1 1500 | 72 | 97 | 98/60 | 16 | 98.6 | sinus | 0.16 | back in bed after PT; pain 0 |
| D1 1900 | 68 | 98 | 100/62 | 16 | 98.4 | sinus | 0.16 | in own wheelchair; pain 0 |
| D1 2020 (mid) | 60 | 98 | 128/78 | 16 | 98.4 | sinus | 0.16 | bowel care; mild headache; paused |
| D1 2300 | 62 | 97 | 96/58 | 14 | 98.2 | sinus | 0.16 | pain 0 |
| D2 0300 | 58 | 96 | 92/56 | 14 | 97.8 | sinus brady | 0.16 | sleeping, cool; pain 0 |
| D2 0700 | 66 | 98 | 98/60 | 16 | 98.4 | sinus | 0.16 | pain 0 |

HR 58 at 0300 asleep is labeled sinus bradycardia but is normal sleep for him (contrast with the AD bradycardia, which comes with a high BP).

## 18. Problems list

1. Complicated UTI (E. coli), neurogenic bladder.
2. Autonomic dysreflexia (D1 0912, catheter kink), resolved.
3. Stage 2 sacral pressure injury, present on admission.
4. Orthostatic hypotension.
5. Chronic T4 AIS A spinal cord injury; spasticity; neurogenic bowel.
6. VTE risk (SCI, immobility, infection): enoxaparin.
7. Ineffective cough (T4): IS, assisted cough.
8. Vitamin D insufficiency.

## 19. Judgment calls (for the instructor)

1. **UTI is the one main problem**; the sacral injury is a small stage 2 found on admission (no wound culture). A stage 3 would need a longer course.
2. **AD bladder volume 600 mL** (not 800): it fits 110 min of kinked drainage and his high morning intake. Change in section 8 if wanted.
3. **AD happens between stops (0905-1000)** and the 1100 stop is the aftermath plus the 2-h every-15-min checks. If the instructor wants the team to handle it live, run the monitor from the 0915 row at the start of stop 2 and hold the 0950 note and the 1005 order until the team acts.
4. **No antihypertensive given** (SBP fell under 150 within 7 min of draining). The nitroglycerin PRN order and the sildenafil check are there to be discussed.
5. **One planted order error:** the order-set call parameters (SBP over 160 / under 90) not fitted to an SCI patient. A team that catches it at 0700 and calls gets the corrected order early (instructor can say "Dr. Kincaid agrees and will enter it").
6. **Order to discontinue: the indwelling catheter at 1900** (nurse-driven removal; CAUTI prevention; his home method is intermittent cath). Cued by the 1600 physiatry note.
7. **Second small AD episode at 2020** during bowel care, handled by the nurse (paused, more lidocaine). Shows prevention and early action. Optional; can be removed.
8. **Culture-guided change at D2 0545:** ceftriaxone to oral ciprofloxacin for 7 days total; TMP-SMX resistance shows why his usual home antibiotic is not a sure thing. Susceptibilities at 29 h are a little fast for real life.
9. **Lab sets at 1000/1030 (blood culture, prealbumin), 1400 (culture prelim, vitamin D), 1700 (CBC, CRP)** exist so every stop has new results.
10. Guideline vs textbook for AD BP checks (2-5 min vs 10-15 min): section 8.
11. Enoxaparin 40 mg daily (chronic SCI, hospitalized with infection). Acute SCI dosing (30 mg every 12 h) does not apply 2 years after injury.

---

## 20. Per-stop summary table

| Time | What changed | New labs | Assessment highlights | Monitor row | Aloud values | Teaching point |
|---|---|---|---|---|---|---|
| **D1 0700** | Arrives from ED after 9 h on a stretcher; on ceftriaxone, NS 100 mL/h; catheter draining | ED 2200: WBC 14.6, UA nitrite +/LE 3+, CRP 98, ESR 48, PCT 0.42, lactate 1.6, AG 11; D1 0500: WBC 13.1, Cr 0.6 (eGFR 130, overestimate), Mg 1.9, CRP 112, albumin 3.2 | T4 sensory level; weak cough; stage 2 sacral; Braden 13; tubing not secured | 70, 96/58, 16, 97%, 99.4, sinus | none (vitals charted) | **His baseline BP is low**; **planted error:** call parameters SBP over 160/under 90; secure the catheter |
| **D1 1100** | **AD 0912-0950** from kinked tubing; 600 mL drained; no medicine needed; NS stopped; parameters corrected | Blood cx no growth 12 h (1000); prealbumin 14 (1030); **ECG 0923 sinus brady 50** | Headache gone, tired, catheter secured, binder/stockings off | 70, 100/60, 16, 97%, 98.8 (event rows 0915-1000 replayable) | q15 checks 1105 98/60, 1120 100/60, 1135 98/58, 1150 100/60 | AD steps in order (sit up, loosen, bladder first, call); **why no nitroglycerin**; monitor 2 h |
| **D1 1500** | PT/OT: orthostatic drop; ischial redness in hospital chair | Urine cx prelim **GNR over 100,000** (1400); **vitamin D 22** (1400) | Orthostatic symptoms; blanchable ischial redness; urine clearer | 72, 98/60, 16, 97%, 98.6 | **Orthostatics: 98/60 -> 76/46 (no binder); 90/56 with binder** | Orthostatic hypotension vs AD; **put the binder back on**; pressure reliefs, own cushion |
| **D1 1900** | Afebrile 8.5 h without acetaminophen; physiatry says remove catheter; sister brings cushion | CBC 1700 **WBC 11.0** (1745); **CRP 86** (1800) | **Catheter removal criteria met**; bowel program due, 2 days without BM | 68, 100/62, 16, 98%, 98.4 | Urine 600 mL this block | **Discontinue the indwelling catheter** (CAUTI); IC every 4 h under 500 mL; lidocaine before bowel care |
| **D1 2300** | Bowel program done; mild AD at 2020 handled; IC 2200 380 mL; ceftriaxone due | **Urine cx: E. coli** (2200); blood cx no growth 24 h | Large stool; fewer spasms | 62, 96/58, 14, 97%, 98.2 (mid row 2020: 60, 128/78) | **2020 BP 128/78 with headache, 2026 104/64**; IC 380 | Bowel is the second cause of AD; early action; ceftriaxone dose at the stop |
| **D2 0300** | Night: turns, IC 0200 420 mL; awake and worried | **Susceptibilities (0230): TMP-SMX R, cipro S, ceftriaxone S** | Right base crackles clear with cough; cool skin | 58, 92/56, 14, 96%, 97.8 | Temp 97.8; IC 420 | Weak cough at T4 (assisted cough, IS); temperature regulation; HR 58 asleep is not AD |
| **D2 0700** | Ciprofloxacin ordered 0545 (first dose 0900); discharge planning | D2 0500: **WBC 8.9, CRP 54**, ESR 46, Cr 0.6, Mg 2.0, AG 9 | IS 1,750; IC 0600 460 mL; dressing dry and intact; ready to learn | 66, 98/60, 16, 98%, 98.4 | IC 460 | Culture-guided step-down; cipro spacing from minerals; teach-back on AD card, cath timing, skin checks |

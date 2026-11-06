# DKA patient 5 of 7: Ruth Nakamura, SGLT2-inhibitor-associated near-euglycemic DKA with E. coli urosepsis and delirium (single source of truth)

Simulation: **Thu 2026-11-05 07:00 to Sun 2026-11-08 07:00 (72 h)** (Day 1 = Thu 11/05 ... Day 4 = Sun 11/08). ED arrival Thu 0100. Checkpoints at every shift change: **Thu 0700, Thu 1900, Fri 0700, Fri 1900, Sat 0700, Sat 1900, Sun 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md` (including the series potassium rule and the clot-prophylaxis rule). Provenance: the clinical design was written by another AI and kept unchanged in `SOURCE_chatgpt_design.md`; this file records every number as built and the changes made to it (list at the end). Instructor-only material (guideline notes, facilitation, the changes) stays in this file, `INSTRUCTOR_NOTES.md` and `REVIEW.md`, never in the chart.

- **Vital signs are in the chart ONLY up to the 0700 arrival set** (ED 0100, 0200, 0400, 0655 and the 0700 ICU set; temperatures converted from the design's Celsius). Later vitals come from the bedside monitor (monitor.html `DKA5` rows, MRN SIM-40505) and the students chart them. Notes contain no numeric vital signs after 0700 (ECG rates excepted).
- Baseline nursing assessment: ED 0100 and ICU 0700 only.
- **Point-of-care glucose IS in the chart, time-gated** (hourly 0200 to Fri 0200 on and around the infusion including the hold, then the design's AC/HS and extra checks, ending with 145 at Day 4 0700).
- MAR: ED doses and infusions started in the ED are `given`; lactated Ringer's 100 mL/h, insulin 6 units/h and D10W 100 mL/h show "0700 Running". **Every dose after Thu 0700 is `due`.** The hold, restart, rate changes and the D10W titration are student actions driven by time-gated protocol orders (0700 hold, 0915 restart, 1300 D10W 150, 2300 transition).
- Labs, cultures, notes, orders, devices, I&O, problems and stickies are time-gated. **Result times are the design's own** (0130, 0330, 0700, 0910 K-only, 1110, 1500, 1900, 2300; Fri 0700, 1900; Sat 0700, 1900; Sun 0700; cultures as listed below). Orders placed before their start show "Pending" until the start.

## Patient
- **Ruth Nakamura**, 67-year-old woman, DOB **1959-04-18**, MRN **SIM-40505** (the source's SIM-RN-067 is not used), she/her. Height 165 cm, **weight 60.0 kg** (admission; dosing weight for the whole stay; usual weight 62.0 kg), BMI 22.0. **Allergy: sulfonamide antibiotics, generalized urticaria, no anaphylaxis** (charted as "Sulfa drugs", the menu's standard allergy chip, with the reaction text); no penicillin or cephalosporin allergy. **Full Code**; daughter **Emi Tanaka**, 39, is the health-care agent if capacity is lost and may receive updates. Unit: **ICU, room ICU-9** (invented; the design names none) -> medical ward Day 3 1000 (no new room is charted; the order says "medical ward").
- **Type 1 diabetes since age 15 (52 years)**; hypoglycemia unawareness (sometimes no symptoms until glucose is under 50), mild distal sensory neuropathy, nonproliferative retinopathy. HbA1c **8.1%**. Home: glargine U-100 18 units at 2100; lispro 1 unit per 12 g carbohydrate + 1 unit per 50 mg/dL over 150 (no bedtime correction); pens, no pump; **personal CGM whose receiver connection was lost 2 days before admission**; meter available; no blood-ketone meter. Last home doses (Emi, Day 1 0130): glargine 18 units D0 2100 (basal NOT omitted), empagliflozin 10 mg D0 0800, lisinopril 5 mg D0 0900, atorvastatin 20 mg D0 2100, lispro 3 units D0 1200 with lunch; dinner lispro skipped (did not eat).
- **Empagliflozin 10 mg daily** started Sep 24 by an outside prescriber for glucose and weight (off-label in type 1 diabetes): permanently discontinued (serious adverse drug reaction documented). **Lisinopril held** (dehydration, AKI). Atorvastatin 20 mg held Day 1, resumed Day 2 2100 (no catch-up). Nasal glucagon 3 mg as needed (home).
- Other: hypertension, hyperlipidemia, prior uncomplicated UTIs, baseline creatinine **0.7**; independent cognition and mobility; no dementia, lung disease, alcohol use disorder or CKD. Widowed retired librarian, lives alone in a one-story home with two entrance steps and a railing, with her cat **Miso**; no tobacco, alcohol or drugs; drives. Sister has autoimmune thyroid disease.
- **AKI staging (stated in the notes)**: creatinine 1.2 / 0.7 = 1.71 times baseline = stage 1 by the creatinine criterion (1.5-1.9). Creatinine 1.1, 1.0, 0.9 ... 0.8 (resolved by Day 2).
- People (fictional; unit RN notes are NOT pre-written, students are the RNs): ED physician **T. Quillen, MD**; ED RN **K. Dunmore, RN**; ICU days **H. Calloway, MD**, ICU nights **S. Abrams, MD**; endocrinology **L. Ostrander, MD**; infectious disease **O. Fenwick, MD**; pharmacist **R. Medina, PharmD**; diabetes educator **M. Brightwell, RN, CDCES**; dietitian **N. Vandermeer, RDN**; case manager **C. Easterly, RN CCM**; physical therapist **E. Whitlock, PT, DPT**; ward physicians **V. Halloran, MD** (days) and **D. Sandoval, MD** (nights); ECG reader (unit) **I. Bergstrom, MD**; radiology **J. Whelan, MD**. None repeats a surname used by any other case's staff (grepped across all cases), none equals a series patient's first or last name, and no staff name uses Emi or Miso.

## Story before the unit (ED Thu 0100-0700)
D-2 dysuria and frequency. D-1 urgency, feverishness, reduced drinking, right flank discomfort. D0 1800 nausea and one vomit; **meter glucose 198**, so she assumed she could not have DKA. D1 0030 Emi found her confused on the telephone; EMS. Exam: dry mucosa, capillary refill about 4 s, deep breathing, right costovertebral-angle tenderness, inattention; no focal deficit, no crackles; GCS 14, oriented to person and place, not to date.
| Time | ED event |
|---|---|
| 0100-0130 | First peripheral IV, strict output collection; **lactated Ringer's (LR) 500 mL over 30 min** |
| 0110 | BMP, Mg, phos, BHB, lactate, **arterial gas**, albumin, CBC, HbA1c collected (released 0130) |
| 0112 / 0115 | Two blood-culture sets from separate sites, before antibiotics |
| 0115 / 0130 | ED ECG acquired / read (sinus tachycardia 118, normal T, K 4.8) |
| 0118 | Assisted clean-catch urine for UA and culture before antibiotics (no catheter) |
| 0120 | Ondansetron 4 mg IV (2 mL) once; emesis 150 mL at about 0112 |
| 0130-0200 | LR 500 mL over 30 min after reassessment |
| 0135 | DKA confirmed from the 0130 results; ICU admission; AKI and delirium recognized; empagliflozin stopped |
| 0140-0210 | **Ceftriaxone 2 g in 100 mL NS over 30 min** (40 minutes after recognition at 0100) |
| 0150 | Acetaminophen 650 mg rectal once |
| 0200-0300 | LR 800 mL over 1 h (**total 1,800 mL = 30 mL/kg within 3 h**; three IVs in place: A insulin only, B LR/D10W through separate pumps, C potassium/magnesium/antibiotic) |
| 0200 | **Regular insulin 100 units/100 mL (1 unit/mL) at 6 units/h (0.1 x 60 kg), no bolus; D10W 100 mL/h started at the same time** |
| 0300-0700 | LR 100 mL/h 0300-0330, **potassium-free NS 100 mL/h 0330-0530 during the KCl riders**, LR 100 mL/h 0530-0700 (LR 200 mL + NS 200 mL) |
| 0320 / 0330 | Repeat labs collected / released (K 4.0, arterial pH 7.25) |
| 0330-0430, 0430-0530 | KCl 10 mEq/100 mL over 1 h x2 (20 mEq) |
| 0500 / 0530 | Renal and bladder ultrasound / report: no hydronephrosis, no obstructing stone, bladder not distended |
| 0650 / 0700 | Transfer panel collected / released at arrival: **K 3.3** -> insulin hold, KCl riders |
ED totals 0100-0700 (pre-shift, not added again to shift 1): IV fluid 2,700 (LR 2,000 + NS 200 + D10W 500), IV med 362 (insulin 30 + KCl 200 + ceftriaxone 100 + ondansetron 2 + flushes 30), PO 0 -> **intake 3,062**; urine 700 + emesis 150 -> **output 850**; net **+2,212**. Weight 60.0 kg.

## Vital signs (ED and arrival only; Celsius from the design converted to F)
| Time | Temp | HR | BP | RR | SpO2 | Rhythm / note |
|---|---|---|---|---|---|---|
| Thu 0100 ED | 39.1 C = 102.4 F | 118 | 92/54 | 28 deep | 97% RA | Sinus tachycardia (MAP 67) |
| 0200 | 38.8 C = 101.8 F | 112 | 102/58 | 26 | 98% | during the third bolus |
| 0400 | 38.3 C = 100.9 F | 106 | 112/62 | 24 | 98% | after the resuscitation |
| 0655 | 38.0 C = 100.4 F | 104 | 116/64 | 24 | 98% | before transfer |
| 0700 ICU arrival | 38.0 C = 100.4 F | 104 | 116/64 | 24 | 98% | sinus tachycardia, flat T and small U waves on the monitor |
Fever curve after 0700 (monitor): 38.0 -> 37.9 (0915) -> 37.7 (1300) -> 37.6 (1900) -> 37.4 (2300) -> 37.1 (Day 2 0700) -> 36.9 -> 36.8 -> 36.7 -> 36.8 C. Pain 3-4/10 right flank (verbal rating).

## Labs (collected -> released as in the design; Na, K, Cl, HCO3 mmol/L; BUN, Cr, glucose, phos, Mg mg/dL)
First two gases **arterial** (single radial punctures); all later gases **venous**. HCO3 is the serum total CO2 used for every anion gap. Albumin 3.8: no gap correction.
| Collected -> released | Na | K | Cl | HCO3 | BUN | Cr | Glu | AG | pH | pCO2 | BHB | Lactate | WBC | Phos | Mg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Thu 0110 -> 0130 (arterial) | 134 | 4.8 | 101 | 9 | 36 | 1.2 | 210 | 24 | 7.12 | 29 | 6.8 | 3.2 | 18.6 | 3.8 | 1.8 |
| 0320 -> 0330 (arterial) | 136 | 4.0 | 105 | 10 | 33 | 1.1 | 192 | 21 | 7.25 | 24 | 5.7 | 2.2 | | 2.8 | 1.7 |
| 0650 -> 0700 (venous) | 137 | **3.3** | 108 | 12 | 29 | 1.0 | 168 | 17 | 7.28 | 26 | 4.1 | 1.6 | 17.0 | 2.0 | 1.6 |
| 0900 -> 0910 (K only) | | 3.7 | | | | | | | | | | | | | |
| 1100 -> 1110 | 138 | 4.0 | 109 | 14 | 26 | 0.9 | 172 | 15 | 7.30 | 29 | 2.8 | | | 1.8 | 1.6 |
| 1450 -> 1500 | 138 | 3.8 | 110 | 17 | 23 | 0.9 | 186 | 11 | 7.33 | 33 | **1.2** | | | 1.7 | 1.9 |
| 1850 -> 1900 | 139 | 4.1 | 110 | 18 | 22 | 0.9 | 176 | 11 | 7.35 | 34 | **0.7** | | | 1.9 | 1.9 |
| 2250 -> 2300 | 139 | 4.0 | 110 | 19 | 21 | 0.9 | 170 | 10 | 7.36 | 35 | **0.4** | | | 2.1 | 1.9 |
| Fri 0650 -> 0700 | 139 | 4.0 | 108 | 21 | 19 | 0.8 | 164 | 10 | 7.38 | 36 | 0.3 | | 12.8 | 2.4 | 2.0 |
| Fri 1850 -> 1900 | 139 | 4.0 | 106 | 23 | 18 | 0.8 | 192 | 10 | | | | | | | |
| Sat 0650 -> 0700 | 140 | 4.1 | 107 | 24 | 15 | 0.8 | 154 | 9 | | | | | 9.8 | 2.9 | 1.9 |
| Sat 1850 -> 1900 | 139 | 4.0 | 106 | 24 | 14 | 0.8 | 118 | 9 | | | | | | | |
| Sun 0650 -> 0700 | 140 | 4.1 | 107 | 24 | 14 | 0.8 | 145 | 9 | | | | | 8.2 | 3.2 | 2.0 |
Also: ED 0130 albumin 3.8, Hb 13.0, platelets 240, HbA1c 8.1%. **Urinalysis (collected 0118, released 0130)**: nitrite positive, leukocyte esterase large, over 100 WBC/hpf, many bacteria, glucose 1,000 mg/dL or more, ketones 3+. CBC series (WBC from the design; Hb and platelets at 0650, Day 2 and Day 3 were NOT in the design and are filled in so each CBC is complete, falling smoothly to the design's Day 4 value): Hb 13.0, 12.4, 12.2, 12.0, 11.8; platelets 240, 232, 230, 229, 228 (needed for the enoxaparin checks). Reference intervals: Na 135-145, K 3.5-5.0, Cl 98-107, HCO3 22-29, BUN 7-20, creatinine 0.6-1.1, phos 2.5-4.5, Mg 1.7-2.4, anion gap 8-12, arterial pH 7.35-7.45 / venous 7.31-7.41, arterial pCO2 35-45 / venous 41-51, BHB under 0.6, lactate 0.5-2.0, WBC 4-11, Hb 12-16, platelets 150-400.

**Culture releases (each its own timed result; specimen text keeps the collection time)**
| Specimen | Released | Result |
|---|---|---|
| Blood cultures x2 (0112 / 0115) | Thu 0115 | Collected, in process |
| Urine culture (0118) | Thu 0130 | Collected, in process |
| Urine | **Thu 1800** | More than 100,000 CFU/mL gram-negative rods; identification and susceptibilities pending |
| Urine | **Fri 0800** | E. coli identified; susceptibilities pending |
| Urine | **Fri 1045** | FINAL E. coli over 100,000 CFU/mL, no ESBL phenotype. Ampicillin S (MIC 2), amoxicillin-clavulanate S, ceftriaxone S, cefazolin S, cefepime S, **trimethoprim-sulfamethoxazole S (trap: she is allergic)**, ciprofloxacin R |
| Blood | Fri 0120 / Sat 0120 / Sun 0120 | No growth at about 24 / 48 / 72 hours (preliminary); the 5-day final is NOT yet available at the end |
Timing note: a preliminary gram-negative read at 16.7 h, identification at 30.7 h and final susceptibilities at 33.5 h are at the fast end of real practice (usual 24-48 h); kept as in the design.

**Arithmetic (`node gen/physiology.js` reprints all of it and `assemble.js` fails the build on any anion-gap mismatch)**
- Anion gap = Na - Cl - HCO3 (no K): 24, 21, 17, 15, 11, 11, 10, 10, 10, 9, 9, 9 (identical to the design). Delta-delta at 0110: delta gap 12 vs delta bicarbonate 15 = 0.8 (under 1: a concurrent non-gap component; chloride rises 101 -> 110). Gap closed at 1500 (11) while BHB was still 1.2 and bicarbonate 17: hyperchloremic acidosis after LR/NS, not ketones.
- Corrected Na = Na + 1.6 x (glucose - 100)/100: **135.8** (0110), 137.5, **138.1** (0650), 139.2, 139.4, 140.2, **140.1** (2250), 140.0, 140.5, 140.9, 139.3, 140.7. Stable and normal: no HHS, no indication for hypotonic resuscitation; the D10W free water is watched through the measured Na (137-140). Effective osmolality (2 x Na + glucose/18) 279.7 at 0110 rising to 288; calculated osmolality with BUN/2.8 292.5-295.6.
- Henderson-Hasselbalch (pH = 6.1 + log10(HCO3 / (0.03 x pCO2))): 7.11, 7.24, 7.29, 7.31, 7.33, 7.35, 7.36, 7.39 against charted 7.12, 7.25, 7.28, 7.30, 7.33, 7.35, 7.36, 7.38: each within 0.01.
- **Winter's formula (arterial pCO2 = 1.5 x HCO3 + 8, +/- 2)**: 0110 expected **21.5 (19.5-23.5)**, measured **29 = inadequate compensation (additional respiratory acidosis)**: the teaching point (airway protection, fatigue, aspiration risk; do not call it simple Kussmaul breathing); 0320 expected 23 (21-25), measured 24 = appropriate. Venous values (0650 on) are NOT interpreted with Winter's (venous pCO2 runs a few mmHg above arterial).
- Insulin: 0.1 x 60 = **6 units/h = 6 mL/h**; total regular insulin 30 (ED) + 58.5 + 36 = **124.5 units in 124.5 mL** (a second 100-unit bag is hung about 2055 on Day 1). Dextrose: D10W 100 mL/h = 10 g/h, 150 mL/h = 15 g/h; total D10W 500 + 1,387.5 + 900 = 2,787.5 mL = **278.8 g**. D10W rescue 150 mL = 15 g; juice 120 mL = 15 g.
- Fluids vs 60 kg: LR 1,800 mL = **30 mL/kg** in 2 h (bolus rate 17-17-13 mL/kg/h); ED IV fluid 2,700 mL = 45 mL/kg; 100 mL/h = 1.7 mL/kg/h; D10W 150 mL/h = 2.5 mL/kg/h. Measured balance +2,212 (ED), +1,336, +26 ... whole stay **+3,344 mL**; +3,574 mL (6% of body weight) by Day 2 0700 with fever and no insensible loss counted and no weights supplied: lungs clear and urine 1.1-2.1 mL/kg/h (glycosuric).
- Cockcroft-Gault creatinine clearance (female, 60 kg): 43 mL/min at creatinine 1.2, 52 at 1.0, 57 at 0.9, 65 at 0.8 (used in the enoxaparin and amoxicillin decisions).

## POC glucose (mg/dL)
Hourly from insulin start through discontinuation (including the hold): 0200 203, 0300 194, 0400 186, 0500 174, 0600 168, 0700 168, 0800 156, 0900 154, 1000 164, 1100 172, 1200 164, **1300 148**, 1400 166, 1500 186, 1600 190, 1700 182, 1800 178, 1900 176, 2000 172, 2100 168, 2200 166, 2300 170, Fri 0000 174, 0100 178 (infusion stops), **0200 182**. Then: **Fri** 0730 164, 1130 188, 1730 204, **2015 186** (near-fall), 2100 182; **Sat** 0730 154, 1130 176, 1730 142, **2100 63**, 2115 88, 2130 107, 2200 126; **Sun** 0300 132 (after the revised basal), 0700 145. The pre-infusion serum glucose of 210 is not used as a bedside value. Largest hourly change on the infusion: -16 (1200-1300) and +18/+20 after the D10W increase (1400, 1500): no hourly fall over 20 mg/dL; goal about 150-200. The serum values (170-192, then 118 and 145) trend like the POC series.
Teaching trend (not flagged in the chart): Sat POC 154 -> 176 -> 142 -> serum 118 -> 63 at 2100 with no symptoms.

## IV timeline and potassium (`node gen/infusions.js`)
| Time | Fluid | Insulin | Potassium |
|---|---|---|---|
| 0100-0300 | LR 500 + 500 + 800 mL (30 mL/kg) | 0200: 6 units/h | LR intrinsic 4 / 4 / 3.2 mEq/h |
| 0300-0330 | LR 100 mL/h | 6 | 0.4 (LR) |
| 0330-0530 | **NS 100 mL/h (potassium-free)** | 6 | **KCl 10 mEq/h x2** (0330, 0430) |
| 0530-0700 | LR 100 mL/h | 6 | 0.4 (LR) |
| 0700-1100 | NS 100 mL/h (potassium-free) | **HELD 0700-0915**, then 6 | **KCl 10 mEq/h x4** (0700, 0800, 0900, 1000) |
| 1100-1500 | none (D10W only) | 6 | none; Mg 2 g/50 mL 1130-1230 |
| 1500-1700 | none | 6 | KCl 10 mEq/h x2 (1500, 1600) |
| 1700-Fri 0100 | none | 6 | none |
| D10W | 0200 100 mL/h; **0700 50** (hold); **0915 100**; **1300 150**; stops Fri 0100 | | |
- **Peripheral potassium rule**: maximum **10.0 mEq/h in every minute** from 0100 Thu to 0700 Fri (checked minute by minute in `gen/infusions.js` and `assemble.js`, LR's 4 mEq/L included); **no minute with a KCl rider and a potassium-containing carrier** (LR is replaced by potassium-free NS during every rider); no 40 mEq/L bag, no potassium in any maintenance fluid, no IV push, no parallel riders. Total potassium 0100 Thu to 0700 Fri **88 mEq** (KCl 80 + LR 8). Riders on IV C (left antecubital 18 g); LR/NS/D10W on IV B with separate pumps; insulin alone on IV A.
- **Insulin vs potassium thresholds**: K 4.8 (start insulin 0200, K over 3.5), 4.0 (replace: urine good), **3.3 at 0700 (under 3.5: HOLD insulin, riders)**, **3.7 at 0910 (3.5 or higher AND prescriber review: restart 0915; riders 3 and 4 continue)**, 4.0, 3.8 (two more riders), 4.1, 4.0, then stable 4.0-4.1 with no potassium given after Day 1.
- Flushes (IV med, 10 mL each): ED 0125, 0210, 0530; Thu 1105, 1230, 1700, 1830, 2100; Fri 0110, 0210, 0630, 0800, 1200, 1600, 1830, 2100; Sat 0630, 0800, 1200, 1600, 1830, 2100; Sun 0630 (40 mL in shifts 1, 2, 3 and 5 and 20 mL in shifts 4 and 6; matches the design's shift totals). IVs A and B are removed Fri 0300 (insulin and D10W finished; fewer lines for a delirious patient; flush volumes unchanged because they are per flush event); IV C stays as the lock (also the route for IV hypoglycemia rescue).

## Orders (source section 4, cleaned)
| Written | Order |
|---|---|
| Thu 0100-0135 | Code status; IV access (three PIVs); monitoring and strict I&O; ECG 0115; initial labs and cultures before antibiotics; **LR 500 / 500 / 800 mL**; ondansetron; **ceftriaxone 2 g q24h**; acetaminophen PR; **insulin infusion 6 units/h**, **D10W**, POC glucose hourly; **potassium safety protocol**; empagliflozin discontinued and lisinopril held; NPO with aspiration screen |
| Thu 0255-0535 | LR 100 mL/h; NS during the riders (0330); KCl riders x2; LR resumed 0530; renal/bladder ultrasound |
| Thu 0700 (ICU) | Admit to the ICU; **K 3.3: HOLD insulin, D10W 50, NS, four KCl riders, K at 0900**; telemetry, neuro every 2 h, hourly urine, notify thresholds; delirium and fall precautions; hypoglycemia orders (juice, D10W 150 mL, glucagon 1 mg IM); ECG 0705; lab schedule |
| Thu 0715 | Endocrinology consult; **enoxaparin 40 mg daily from 0900 with its clot-risk rationale** |
| Thu 0915 / 1000-1110 | **Restart 6 units/h, D10W 100**; clear liquids from 1100; phosphorus monitored; ECG 1115; Mg 2 g 1130; acetaminophen PO as needed |
| Thu 1300 / 1500 | **POC 148: D10W 150 mL/h**; KCl riders 1500 and 1600; dietitian |
| Thu 2300 | **Glargine 12 units, infusion and D10W continue to Fri 0100, 0200 POC**; diet; lispro after meals by carbohydrate eaten (no bedtime correction); lab schedule |
| Fri 0830-1100 | Consults (ID, pharmacy, case management, PT, educator); assisted ambulation with walker; **ceftriaxone stops, amoxicillin 1,000 mg q8h from 1400** |
| Fri 0700 / 2030 | Atorvastatin from 2100; near-fall order |
| Sat 0715 | Transfer to the ward at 1000 |
| Sat 2105-2145 | **POC 63: juice, recheck 2115**; snack; endocrinology reassessment; **glargine 10 units at 2300, lispro 1 unit per 18 g** |
| Sun 0650 | Conditional discharge for about 1000 (not yet carried out) |
Order text never states a later event (checked with a script: every clock time later than an order's own time is a plan, a scheduled dose or a lab time; no result is quoted before it is released). The antibiotic and insulin orders carry the allergy and no-bedtime-correction rules. Order wording was cleaned of all out-of-universe phrases (list at the end).

## MAR summary
ED (`given`): LR boluses x3, ondansetron, ceftriaxone dose 1, acetaminophen PR, KCl x2, LR/NS maintenance, flushes, and the infusions (LR 100 mL/h, insulin 6 units/h, D10W 100 mL/h: "0700 Running"). **Due**: NS 0700; D10W changes 0700, 0915, 1300; KCl 0700, 0800, 0900, 1000, 1500, 1600; Mg 1130; enoxaparin Thu/Fri/Sat 0900; ceftriaxone Fri 0140; glargine 12 units Thu 2300 and Fri 2300, glargine 10 units Sat 2300; lispro after meals (0800, 1200, 1800 Fri and Sat); amoxicillin 1400, 2200, 0600, 1400, 2200, 0600; atorvastatin Fri/Sat 2100; flushes. PRN: acetaminophen, juice, D10W, glucagon (none pre-charted as given: the Day 1 1200 headache and the Day 3 2100 juice are student actions). Home lisinopril and empagliflozin: not on the MAR.

## I&O (4-hour blocks, `periodEnd`, standard labels; shift totals checked by the build and in the app)
| Shift | IV fluid | IV med | PO | Intake | Urine | Emesis | Output | Net |
|---|---|---|---|---|---|---|---|---|
| ED 0100-0700 | 2,700 | 362 | 0 | 3,062 | 700 | 150 | 850 | +2,212 |
| 1 Thu 0700-1900 | 1,788 | 748 | 300 | **2,836** | 1,500 | 0 | **1,500** | +1,336 |
| 2 Thu 1900-Fri 0700 | 900 | 176 | 450 | **1,526** | 1,500 | 0 | **1,500** | +26 |
| 3 Fri 0700-1900 | 0 | 40 | 1,400 | **1,440** | 1,400 | 0 | **1,400** | +40 |
| 4 Fri 1900-Sat 0700 | 0 | 20 | 600 | **620** | 800 | 0 | **800** | -180 |
| 5 Sat 0700-1900 | 0 | 40 | 1,600 | **1,640** | 1,500 | 0 | **1,500** | +140 |
| 6 Sat 1900-Sun 0700 | 0 | 20 | 650 | **670** | 900 | 0 | **900** | -230 |
| Simulation | 2,688 | 1,044 | 5,000 | 8,732 | 7,600 | 0 | 7,600 | +1,132 (ED + simulation +3,344) |
Shift-1 IV med 748.5 = insulin 58.5 + KCl 600 + Mg 50 + flushes 40; IV fluid 1,787.5 = NS 400 + D10W 1,387.5 (112.5 + 375 + 900). The half-mL values are rounded in the 4-hour blocks (D10W up, insulin down) so every block and shift is a whole number (blocks: 1,098 / 744 / 994). Lowest urine shift: 800 mL / 12 h = 1.11 mL/kg/h.

## ECGs (acquired -> read; QTc Fridericia; images from `casestudy/tools/ecg_image.py` via `gen/ecg/make_ecgs.py`)
| Time | Rate / rhythm | PR | QRS | QTc | T waves | Latest K then |
|---|---|---|---|---|---|---|
| Thu 0115 -> 0130 | 118 sinus tachycardia | 156 | 86 | 445 | Normal contour, no peaking | 4.8 (resulted 0130) |
| Thu 0705 -> 0715 | 104 sinus tachycardia | 164 | 88 | 462 | **Mild diffuse flattening, small U waves** (monitor tAmp 0.2, uAmp 0.10); U wave not included in the QT | **3.3** |
| Thu 1115 -> 1125 | 96 sinus | 160 | 86 | 446 | Recovered, no U waves (added: the post-replacement ECG) | 4.0 (after 40 mEq) |
| Fri 1900 -> 1910 | 80 sinus | 166 | 86 | 438 | Normal, U waves gone | 4.0 |
Source ECG table: the three rows are the design's (0115, "0700 file", "D2 1900 file"); the design's facilitator files were charted as real ECG studies at 0705 and 1900 with their rates, and the 1115 ECG is the added post-replacement study. Monitor rows use the same rate and T/U settings.

## Monitor rows (`monitor.html` `DKA5`, MRN SIM-40505, banner "ICU-9 NAKAMURA, RUTH 67 F"; temperatures in F)
| Time | HR | BP | RR | SpO2 | Temp F | Rhythm / T | Note |
|---|---|---|---|---|---|---|---|
| Thu 0700 | 104 | 116/64 | 24 | 98 | 100.4 | tachy, T 0.2, U 0.10 | K 3.3: hold insulin (design checkpoint) |
| Thu 0915 | 98 | 118/66 | 22 | 98 | 100.2 | sinus, T 0.25, U 0.07 | K 3.7, restart (added) |
| Thu 1300 | 94 | 120/68 | 22 | 98 | 99.9 | sinus, T 0.3 | glucose 148, D10W 150, headache since 1200 (added) |
| Thu 1900 | 92 | 118/66 | 20 | 98 | 99.7 | sinus, normal T | design checkpoint |
| Thu 2100 | 96 | 120/68 | 20 | 98 | 99.7 | sinus | nocturnal disorientation (added) |
| Thu 2300 | 86 | 120/68 | 18 | 98 | 99.3 | sinus | resolution, glargine due (added) |
| Fri 0700 | 84 | 124/68 | 18 | 98 | 98.8 | sinus | design checkpoint |
| Fri 1400 | 82 | 126/70 | 16 | 98 | 98.6 | sinus | afternoon, amoxicillin starts (added) |
| Fri 1900 | 80 | 126/70 | 16 | 98 | 98.4 | sinus | design checkpoint |
| Fri 2015 | 94 | 124/68 | 18 | 98 | 98.4 | sinus | near-fall (added) |
| Sat 0700 | 76 | 128/72 | 16 | 98 | 98.2 | sinus | design checkpoint |
| Sat 1900 | 74 | 124/70 | 16 | 98 | 98.1 | sinus | design checkpoint |
| Sat 2100 | 76 | 124/72 | 16 | 98 | 98.1 | sinus | glucose 63, no symptoms, vitals unchanged (added) |
| Sun 0700 | 76 | 126/70 | 16 | 98 | 98.2 | sinus | design checkpoint (HR 76, BP 126/70, T 36.8 C) |
The design lists checkpoint rows only; the 0915, 1300, 2100, 2300, Fri 1400, Fri 2015 and Sat 2100 rows (and their values) are mid-shift rows added for this build (instructor choices, consistent with the fever curve and the story). The Fri 2015 values (HR 94, no orthostatic drop portrayed) are an instructor choice; the near-fall is attributed to deconditioning, neuropathy and impulsivity, with a glucose of 186.

## Notes (35; ED nursing notes only; no unit RN notes; each quotes only what already existed)
ED: provider 0115, 0135, 0345; RN 0300 and 0655 (SBAR with the ED totals); ECG 0130; radiology 0530. Day 1: ICU admission H&P 0715 (with the enoxaparin rationale), ECG 0715, ICU 0925 (restart), endocrinology 1130, ECG 1125, ICU 1315 (D10W up), ICU 1515 (gap closed, ketones persist), dietitian 1830, ICU night 1930, 2145 (delirium), 2315 (resolution). Day 2: ICU night 0130, ICU 0715, infectious disease 1100, pharmacy 1200, case management 1500, ICU night 1930, ECG 1910, ICU night 2045 (near-fall). Day 3: ICU 0715, PT 0930, educator 1100, dietitian 1300, case management 1530, ward evening 1930, ward night 2135 (low glucose), endocrinology 2150. Day 4: ward attending 0700. `node gen/check_notes.js` plus the build's clock-time check flag only plans and thresholds. The source's unit RN notes (#05, 07, 09, 12, 13, 15, 20, 21, 27, 28) are provider notes here (see below).

## Discharge plan (Sun 0700 and the notes)
Still hospitalized at the end; **conditional** home discharge about 1000 after breakfast tolerance, supplies, daughter escort, revised insulin teach-back and no recurrent low. **Glargine 10 units at 2300**; **lispro after meals, 1 unit per 18 g carbohydrate eaten plus the premeal correction** (under 200 none, 200-249 +1, 250-299 +2, 300-349 +3, 350 or higher +4 and call), no bedtime correction; **amoxicillin 1,000 mg every 8 hours through Nov 11 at 2200 (11 doses after Day 4 0700)**; atorvastatin 20 mg at 2100; nasal glucagon 3 mg as needed (repeat after 15 min with a new device while calling emergency help); **empagliflozin stopped permanently**; **lisinopril held** until the outpatient clinician restarts it; enoxaparin for the inpatient stay only. Rolling walker, Emi with her continuously for 72 h, home nursing the next day, endocrinology contact in 48 h, endocrinology and primary-care visits within a week (basic metabolic panel, lisinopril decision), five-day blood cultures owned by the inpatient team. Teaching: ketone testing and the escalation levels (BHB 0.6-1.4 call the diabetes team now and repeat in 2 h; 1.5 or higher with vomiting, no fluids, confusion or trouble breathing, or any 3 or higher: emergency department); never omit basal insulin; CGM low alert 90 with sharing to Emi; no driving until reviewed; hypoglycemia unawareness (avoiding lows can partly restore warning symptoms).

## Changes from the source (every one made on purpose)
| # | Source | Built |
|---|---|---|
| 1 | Three web links (a consensus article, a sepsis campaign page, an infectious-disease society guideline), a campaign name and society names | Removed everywhere; generic wording ("2024 consensus", "culture-directed narrowing") only in DESIGN/INSTRUCTOR_NOTES/REVIEW and a few order rationales |
| 2 | Ten unit RN notes (#05, 07, 09, 12, 13, 15, 20, 21, 27, 28) | ICU admission H&P 0715 (with 05), ICU 0925, ICU 1315, ICU night 1930, 2145, 2315 transition, Day 2 0130, ICU 1930, near-fall 2045, ward 1930, ward 2135; ED RN notes #03 and #04 kept (0300 and 0655 SBAR) |
| 3 | "Faculty master document", "scenario specification", "requested rules", "requested two-of-four checklist", "explicitly requested KCl piggyback", "simulation-specific departure", "simulator follow-up ECG files ... specified in section 9", "intensive monitoring bed requested", "Endocrinology has been requested", "Request endocrinology reassessment", "consult requests placed", "simulation endpoint" in note 30, "Faculty assessment priorities" | Removed from every chart text (notes, orders, MAR, results, stickies); the guideline distinctions are only in DESIGN/INSTRUCTOR_NOTES/REVIEW. The build fails on any of these words in chart text |
| 4 | Staff names | New initials-and-surname set (list above); Maya Patel collides with patient 1, Marcus Lee with patient 4, and several surnames repeat dka1-4 staff (Brooks, Shah, Morgan, Alvarez, Park, Kim, Reed, Lee) |
| 5 | Enoxaparin 40 mg daily | Kept; the order and the ICU H&P now state the rationale (age 67, sepsis, ICU stay, reduced mobility, risk-model score 4, no bleeding, platelets 240, CrCl 43 or higher); the build fails if the order or its rationale is missing |
| 6 | ECG table (0115 chart; 0700 and D2 1900 "facilitator files") | Charted as ED 0115, ICU 0705, Fri 1900 ECGs with images and **a post-replacement ECG added at 1115** (K 4.0, normal T, no U waves) |
| 7 | Monitor table at checkpoints only | Mid-shift rows added (0915, 1300, 2100, 2300, Fri 1400, Fri 2015, Sat 2100) with the fever curve |
| 8 | "Insulin restart ... repeat K >3.5" | **3.5 or higher AND prescriber review** (series rule); K 3.7 qualifies |
| 9 | Several flush orders and total I&O in 12-hour shifts | 4-hour blocks that add to the design's shift totals exactly (checked by the build and in the app) |
| 10 | Allergy line | Charted with the menu's "Sulfa drugs" chip and the reaction text; sulfa trap documented in notes, pharmacy alert, sticky and order rationale |
| 11 | CBC series gave Hb and platelets only at 0110 and Day 4 | Smooth intermediate Hb and platelets added (listed above) |
| 12 | "ED 0150 Acetaminophen PR", "PRN PO only dose D1 1200 for headache" | PR dose charted `given`; the 1200 headache is portrayed by the instructor (monitor row, ICU 1315 note) and the dose is a student action |
| 13 | Three PIVs through D4 0700 | A and B removed Fri 0300 (insulin and D10W done); C kept as the lock |

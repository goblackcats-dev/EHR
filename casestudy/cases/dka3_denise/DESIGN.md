# DKA patient 3 of 7: Denise Carter, cost-related insulin rationing and DKA (single source of truth)

Simulation: **Mon 2026-11-09 07:00 to Thu 2026-11-12 07:00 (72 h)** (Day 1 = Mon 11/09 ... Day 4 = Thu 11/12). Checkpoints at every shift change: **Mon 0700, Mon 1900, Tue 0700, Tue 1900, Wed 0700, Wed 1900, Thu 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md` (including the series potassium rule). Provenance: the clinical design was written by another AI and kept unchanged in `SOURCE_chatgpt_design.md`; this file records every number as built and the changes made to it (see "Changes from the source design" at the end).

- **Vital signs are in the chart ONLY up to the 0700 arrival set** (ED 0200, 0330, 0600 and the 0700 step-down set). Later vitals come from the bedside monitor (monitor.html `DKA3` rows, MRN SIM-40503) and the students chart them. Notes contain no numeric vital signs.
- Baseline nursing assessment: ED 0200 and step-down 0700 only.
- **Point-of-care glucose IS in the chart, time-gated**: hourly on the insulin infusion (0200 to 1800 plus 1830), then before meals (0700, 1130, 1855), bedtime (2100) and the extra 0200 checks on Days 2 and 3, and the hypoglycemia rechecks.
- MAR: ED doses and infusions started in the ED are `given`; the saline with potassium and the insulin infusion show "0700 Running". **Every dose after Mon 0700 is `due`.** Hold, restart and rate changes of the insulin infusion are student actions driven by time-gated protocol orders (0800 hold, 1000 restart, 1200 dextrose and 3 units/h, 1615 transition).
- Labs, notes, orders, devices, I&O, problems and stickies are time-gated. Orders placed before their start show "Pending" until the start. **All chemistry, BHB and gas results release 15 minutes after collection** (the design lists them as expedited; it is the series' only patient on that rule).

## Patient
- **Denise Carter**, 38-year-old woman, DOB **1988-06-14**, MRN **SIM-40503** (the source file's SIM-DC-038 is not used), she/her. Height 165 cm, **weight 60.0 kg** (ED measured; dosing weight for the whole stay), BMI 22.0. Usual weight about 64 kg a month ago. **Allergies: none known (NKDA). Full Code.** Unit: **step-down / telemetry, room SD-8** (room number chosen for the build; the design names no room); the ED is the first 5 hours.
- **Type 1 diabetes since 18**; one remote DKA at 24 (influenza). Baseline creatinine 0.7. No CKD, heart failure, coronary disease, neuropathy, gastroparesis; no SGLT2 inhibitor; one uncomplicated childbirth. HbA1c **11.8%** (resulted Day 1 0800).
- **Prescribed**: insulin glargine U-100 (LANTUS) 22 units at 2100; insulin lispro U-100 (HUMALOG) 6 units with each full meal; correction 1 unit per 50 mg/dL above 200 before meals; no pump. **Actually taking** (3 months): glargine about 10-12 units every other night, lispro 0-3 units with some meals. Last glargine 10 units two nights before arrival (Sat 11/07 2100); last lispro 2 units Sat 1800; **no insulin the day before arrival** (could not keep food down).
- Social: lost a full-time job and employer insurance 3 months ago; variable shifts at two part-time jobs without benefits; household gross income about $2,600 a month; lives in rented housing with her **12-year-old daughter**; skips meals so her daughter can eat; refrigerator and working phone with intermittent data; no reliable car; meter works but strips ran out 2 weeks ago; no tobacco, drugs or heavy alcohol. **Sister Angela** has the daughter and may take part in teaching with Denise's consent. Mother: autoimmune hypothyroidism; father: type 2 diabetes and hypertension. Denise wants to stay independent and worries about missing work.
- Language: **"cost-related insulin rationing"**, never "noncompliant"; no inference of self-harm, neglect or an eating disorder from lack of money for insulin or food.
- People (fictional; first names changed from the source so they do not repeat other series patients): ED physician **A. Shah, MD**; ED RN **G. Alvarez, RN**; hospital medicine days **D. Reed, MD**, nights **T. Rivera, MD**; endocrinology **V. Lee, MD**; ECG reader (unit) **R. Okonkwo, MD**; pharmacist **H. Price, PharmD**; diabetes educator **O. Hart, RN, CDCES**; social worker **L. Brooks, LCSW**; dietitian **S. Lindholm, RD**; case manager **A. Patel, RN CM**. Unit RN notes are NOT pre-written (students are the RNs).

## Story before the unit (ED Mon 0200-0700)
Over 3 months Denise cut her insulin because refills competed with rent and groceries. For 48 hours: thirst, polyuria, diffuse abdominal discomfort, repeated nonbloody vomiting; the last day she could not keep fluids down and took no insulin. Her sister brought her to the ED at **Mon 0200** after noticing deep breathing and exhaustion. No fever history, urinary or respiratory complaint, chest pain or toxic ingestion; no infection source found.
| Time | ED event |
|---|---|
| 0200 | Two peripheral IVs (left forearm 18 g, right forearm 20 g); cardiac monitor; strict measured I&O; POC glucose 690; labs collected (ABG, chemistry, BHB, Mg, phosphate, CBC, lactate, lipase, hCG screen; clean-catch UA); **NS 1,000 mL over 1 h** (16.7 mL/kg). Void 100 mL (urine sample) |
| 0205 / 0215 | ED ECG acquired 0205, available 0215 with the labs |
| 0215 | Emesis 250 mL; results release (UA at 0230) |
| 0220 | Provider confirms DKA with severe biochemical features (BHB 7.2, bicarbonate 9) even though the arterial pH is 7.23; resuscitation bay |
| 0225 | Ondansetron 4 mg IV once (2 mL, over 2 minutes); no repeat, no PRN antiemetic order |
| 0300 | After the first liter and K 5.3 (over 3.5): **regular insulin 6 units/h (1 unit/mL), no bolus**; NS 500 mL/h 0300-0500 (1,000 mL); no potassium in the first two bags |
| 0445 / 0500 | 0445 specimen released 0500: K 4.0 -> **NS + KCl 20 mEq/L at 250 mL/h from 0500 (5 mEq K/h)**; insulin stays 6 units/h |
| 0615 | ED reassessment: improving moderate DKA; step-down accepted contingent on the 0645 labs and 0700 reassessment |
| 0650 / 0700 | ED RN handoff note; arrival on step-down with a two-nurse pump check |
No bicarbonate, antibiotics, central access, phosphate or insulin bolus. ED totals: IV fluid 2,500 mL (NS 1,000 + 1,000 + 500 = 41.7 mL/kg), IV med 46 mL (insulin 24 + ondansetron 2 + flushes 20), urine 500 mL (voids 0200 100, 0415 250, 0610 150), emesis 250 mL; net +1,796 mL.
ED vitals (the only history, Celsius from the design converted to F): 0200 HR 124, BP 96/58, RR 30, SpO2 98% RA, 98.2 F, pain 4; 0330 114, 106/64, 26, 99%, 98.4 F, pain 3; 0600 102, 112/68, 24, 99%, 98.4 F, pain 2; **0700 step-down 100, 114/70, 22, 99%, 98.2 F, pain 2**. (Pain scores are the build's addition to the design's "abdominal discomfort / soreness".)

## Fluid, insulin and potassium math (`gen/infusions.js` computes the volumes and checks the potassium rate for every minute)
- **Fluids (adult, 2024 consensus)**: 1 L in hour 1 (16.7 mL/kg), 500 mL/h x 2 h (8.3 mL/kg/h), then 250 mL/h (4.2 mL/kg/h) 0500-1200, D5NS 200 mL/h (3.3 mL/kg/h) 1200-1830, plain NS 100 mL/h 1830 to Tue 0700 (off when eating and rehydrated; weights 62.8, 63.3, 63.4 kg do not change the 60 kg dosing weight).
- **Insulin** (regular, 100 units/100 mL = 1 unit/mL, dedicated pump and tubing): 60 kg x 0.1 = **6 units/h** from 0300; **held 0800-1000** for K 3.2; restarted **6 units/h at 1000** (K 3.6 on the 0945 specimen, provider confirmed); at the first glucose under 250 (**220 at 1200**) dextrose added and insulin lowered to **60 x 0.05 = 3 units/h**; stopped **1830** (two hours after glargine 1630). Insulin units: ED 24 (6 x 4 h), unit 0700-0800 6, 1000-1200 12, 1200-1830 19.5 (day-shift carrier 6 + 12 + 19.5 = 37.5 mL).
- **Potassium (series rule, peripheral IVs only: 10 mEq/h total from all sources across both lines, no 40 mEq/L bags)**: 0500-0800 NS + KCl 20 mEq/L at 250 mL/h = **5 mEq/h**; 0800-1200 potassium-free NS 250 mL/h plus **four KCl 10 mEq/100 mL piggybacks back to back (0800, 0900, 1000, 1100)** = **10 mEq/h**, never overlapping a potassium-containing bag; 1200-1830 D5NS + KCl 20 mEq/L at 200 mL/h = **4 mEq/h**; none after 1830. Totals: ED 10 + unit 0700-0800 5 = 15, piggybacks 40, D5NS 26 = **81 mEq IV, maximum 10 mEq/h** (verified minute by minute in `gen/infusions.js` and in `gen/assemble.js`). Protocol: confirm urine output of at least 30 mL/h and review the creatinine first; K 5.0 or higher none; K 3.5-4.9 up to 20 mEq/L in the maintenance bag (target 4-5); **K under 3.5: hold insulin, call, stop the potassium bag, KCl 10 mEq/100 mL over 1 h one bag at a time up to four, early K check after the second, reassess before more**; restart insulin when K is 3.5 or higher with provider confirmation (the source says "above 3.5"; the series writes 3.5 or higher; the case value is 3.6).
- **Magnesium sulfate 2 g in 100 mL NS over 2 hours, 0800-1000**, on the other IV (potassium and insulin lines stay separate).
- **Dextrose** 5% in the D5NS: 200 mL/h x 5 g/100 mL = 10 g/h; 1,300 mL = **65 g**.
- **Phosphate** 4.8 -> 2.7 -> 2.0 -> 1.8 -> 1.6 -> **1.5** (1145) -> 1.8 -> 2.0 -> 2.3 -> 2.6 -> 2.9 -> 3.1 -> 3.2: **not replaced** (guideline: replace only if under 1.0 or with cardiac or respiratory compromise or hemolysis); no weakness or compromise; monitored on every panel (provider notes at 0700, 0810, 1010 and 1210 say so); recovers with eating.
- Corrected sodium = Na + 1.6 x (glucose - 100)/100 (ADA; ISPAD uses 2). Effective osmolality = 2 x Na + glucose/18; calculated osmolality adds BUN/2.8.
- **Resolution (2024 consensus)**: BHB under 0.6 **and** (venous pH 7.3 or higher **or** bicarbonate 18 or higher). **Met at the 1545 specimen** (released 1600): glucose 184, BHB 0.4, pH 7.37, bicarbonate 20, gap 10. Not met earlier: 0745 pH 7.30 with BHB 3.5; 1145 pH 7.33, bicarbonate 16, gap 13 with **BHB 1.6** (a nearly closed gap or pH 7.3 alone is not resolution). The 1845 confirmation: BHB 0.3. No further gases or ketones.
- **Transition (endocrinology 1615)**: glargine **18 units SC at 1630** (first basal; 0.30 unit/kg; below her prescribed 22), infusion and D5NS off **1830** (2-hour overlap); no 2100 basal dose; glargine daily at 1630 on Days 1, 2, 3. Meals: breakfast 0730, lunch 1200, dinner 1900. Lispro **4 units with a full 45 g meal** + premeal correction (200 or lower 0; 201-250 1 unit; 251-300 2; 301-350 3; over 350 call; no bedtime correction; never repeat within 4 h; none needed). **Revised Day 2 1435 after the low**: lispro **1 unit per 15 g carbohydrate actually eaten**, whole units rounded down, immediately after eating.
- **Enoxaparin 40 mg SC every 24 h at 2100 on Days 1, 2, 3** (kept from the source with an order rationale; debatable, see REVIEW.md).
- Hypoglycemia protocol (PRN orders): 15 g juice 120 mL PO if alert and able to swallow, recheck 15 min; dextrose 10% 125 mL (12.5 g) IV over 10 min if unable to swallow with an IV; glucagon 1 mg IM if no IV. **Only the oral branch is used, Day 2 1400.**

## Chemistry and gases (collected / released 15 min later)
HCO3 is the serum total CO2 (the number used for every gap). ED gas is **arterial**, all later gases **venous** (Winter's formula applies to the arterial gas only). Reference: Na 135-145, K 3.5-5.0, Cl 98-107, CO2 22-29, gap 8-12, BUN 7-20, Cr 0.6-1.1, phosphate 2.5-4.5, Mg 1.7-2.4, BHB under 0.6, arterial pH 7.35-7.45 / pCO2 35-45, venous pH 7.31-7.41 / pCO2 41-51.
| Collected | Result | Na | K | Cl | HCO3 (serum CO2) | BUN | Cr | Glucose | Anion gap (Na - Cl - HCO3) | Corrected Na (+1.6 per 100 over 100) | pH (A/V) | pCO2 | Henderson-Hasselbalch pH | Winter 1.5 x HCO3 + 8 | BHB | Phos | Mg | eGFR |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 11/09 02:00 | 02:15 | 130 | 5.3 | 94 | 9 | 32 | 1.5 | 684 | 130-94-9 = **27** | 139.3 | 7.23 A | 22 | 7.23 | 21.5 +/- 2 (arterial: measured 22) | 7.2 | 4.8 | 1.9 | 45 |
| 11/09 04:45 | 05:00 | 133 | 4 | 100 | 12 | 29 | 1.2 | 544 | 133-100-12 = **21** | 140.1 | 7.27 V | 27 | 7.27 | 26.0 (venous: not applied) | 5 | 2.7 | 1.7 | 59 |
| 11/09 06:45 | 07:00 | 135 | 3.6 | 103 | 13 | 25 | 1 | 424 | 135-103-13 = **19** | 140.2 | 7.29 V | 28 | 7.29 | 27.5 (venous: not applied) | 4.1 | 2 | 1.6 | 74 |
| 11/09 07:45 | 08:00 | 136 | 3.2 | 105 | 14 | 23 | 0.9 | 360 | 136-105-14 = **17** | 140.2 | 7.30 V | 29 | 7.31 | 29.0 (venous: not applied) | 3.5 | 1.8 | 1.6 | 84 |
| 11/09 09:45 | 10:00 | 137 | 3.6 | 107 | 14 | 21 | 0.9 | 332 | 137-107-14 = **16** | 140.7 | 7.31 V | 29 | 7.31 | 29.0 (venous: not applied) | 3 | 1.6 | 1.6 | 84 |
| 11/09 11:45 | 12:00 | 137 | 4 | 108 | 16 | 18 | 0.8 | 230 | 137-108-16 = **13** | 139.1 | 7.33 V | 31 | 7.34 | 32.0 (venous: not applied) | 1.6 | 1.5 | 1.9 | 97 |
| 11/09 15:45 | 16:00 | 138 | 4 | 108 | 20 | 15 | 0.8 | 184 | 138-108-20 = **10** | 139.3 | 7.37 V | 36 | 7.37 | 38.0 (venous: not applied) | 0.4 | 1.8 | 1.9 | 97 |
| 11/09 18:45 | 19:00 | 138 | 3.9 | 107 | 22 | 13 | 0.8 | 188 | 138-107-22 = **9** | 139.4 | 7.38 V | 38 | 7.39 | 41.0 (venous: not applied) | 0.3 | 2 | 1.9 | 97 |
| 11/10 06:45 | 07:00 | 138 | 3.7 | 105 | 24 | 10 | 0.7 | 142 | 138-105-24 = **9** | 138.7 | - | - | - | - | - | 2.3 | 1.8 | 113 |
| 11/10 18:45 | 19:00 | 139 | 4 | 105 | 25 | 9 | 0.7 | 171 | 139-105-25 = **9** | 140.1 | - | - | - | - | - | 2.6 | 1.9 | 113 |
| 11/11 06:45 | 07:00 | 139 | 4.1 | 105 | 25 | 9 | 0.7 | 126 | 139-105-25 = **9** | 139.4 | - | - | - | - | - | 2.9 | 1.9 | 113 |
| 11/11 18:45 | 19:00 | 139 | 4.1 | 104 | 26 | 10 | 0.7 | 151 | 139-104-26 = **9** | 139.8 | - | - | - | - | - | 3.1 | 1.9 | 113 |
| 11/12 06:45 | 07:00 | 139 | 4.2 | 104 | 26 | 10 | 0.7 | 132 | 139-104-26 = **9** | 139.5 | - | - | - | - | - | 3.2 | 2 | 113 |
- Anion gap 27 -> 21 -> 19 -> 17 -> 16 -> 13 -> 10 -> 9 and 9 afterwards (matches the source for all 13 rows). Delta-delta at 0200: gap rose 15 (27 - 12), bicarbonate fell 15 (24 - 9): pure gap acidosis.
- Corrected sodium 139.3, 140.1, 140.2, 140.2, 140.7, 139.1, 139.3, 139.4: the measured Na 130 at presentation is mostly the glucose (pseudohyponatremia). Effective osmolality 298 at 0200 (under 320: no hyperosmolar overlap); calculated 309.
- Winter's at 0200 (arterial): 1.5 x 9 + 8 = 21.5 +/- 2 = 19.5-23.5; measured pCO2 22 = appropriate respiratory compensation.
- Every pH is within 0.01 of Henderson-Hasselbalch from serum CO2 and pCO2 (integer rounding; the analyzer's own gas bicarbonate would differ slightly).
- eGFR (CKD-EPI 2021, woman) is shown for trend only: it is not valid while the creatinine is changing (1.5 -> 0.7).
- Other (0200 specimen, released 0215): **WBC 15.2, Hgb 15.7, platelets 326**, lactate 1.7 (arterial), lipase 30, **hCG screen negative**; **UA (released 0230): glucose 4+, ketones 3+, nitrite and leukocyte esterase negative, WBC 0-2/hpf**. **HbA1c 11.8%** (added to the 0645 specimen, released 0800; estimated average glucose about 290). Day 2 0645 CBC (released 0700): WBC 9.0, Hgb 12.8 (dilutional), platelets 260. Stress leukocytosis reassessed, not treated as sepsis.
- **ECGs** (Chart Review > Cardiology with images, `gen/ecg/make_ecgs.py`; QTc Fridericia): **0205 (available 0215)** sinus tach 122, PR 150, QRS 86, QTc 432, mildly prominent symmetric T (K 5.3); **0805 (available 0815)** sinus 96, PR 158, QRS 86, QTc 460, flat T with small U waves (K 3.2, Mg 1.6); **1855 (available 1900)** NSR 88, PR 160, QRS 84, QTc 438, normal T, no U waves (K 3.9, Mg 1.9). No later 12-lead.

## Point-of-care glucose (all in the chart at their times)
**Mon**: 0200 690, 0300 650, 0400 590, 0500 530, 0600 470, **0700 410**, 0800 350 (insulin held, K 3.2), 0900 340, 1000 330 (K 3.6, restart), 1100 270, **1200 220 (D5NS, insulin 3 units/h)**, 1300 190, 1400 175, 1500 180, **1600 185 (resolution labs)**, 1700 190, 1800 185, **1830 188 (stop insulin and D5NS)**, 1855 190 (AC dinner), 2100 178 (HS). **Tue**: 0200 156, **0700 148**, 1130 136, **1400 62 (symptomatic)**, 1415 78, 1430 104, 1500 121, 1855 174, 2100 162. **Wed**: 0200 140, **0700 134**, 1130 158, 1855 156, 2100 144. **Thu**: **0700 134** (final).
Fall on insulin: 0300-0700 60 mg/dL/h each hour (goal 50-75; 650 -> 410); 0700-0800 60; held 0800-1000 10/h; after restart 1000-1100 60 and 1100-1200 50; near 200 on dextrose the goal is safe maintenance 150-200 while the ketones clear (1200-1300 30, then 15, flat).

## Insulin doses the students should calculate
Infusion 6 units/h (6 mL/h) and 3 units/h (3 mL/h). Tue 0725 breakfast lispro: fixed **4 units** (148: no correction). Tue 1145 lunch: fixed 4 units (136: none) but **only 15 g eaten -> 62 at 1400**. Tue 1920 dinner: 45 g / 15 = **3 units** (174: no correction). Wed 0750: 45 g -> **3**; Wed 1220: 60 g -> **4**; Wed 1920: 45 g -> **3**. Glargine 18 units at 1630 each day (0.30 unit/kg; discharge total daily dose about 18 + 9-10 = 28 units, 0.47 unit/kg). Hypoglycemia treatment 15 g (120 mL juice); snack 15 g carbohydrate with protein (150 mL milk + crackers).

## Intake and output (4-hour blocks, `periodEnd: true`; labels Oral, IV fluid, IV med, Urine, Emesis; each block's note lists every void)
| Block ends | Label | Oral | IV fluid | IV med | Intake | Urine | Emesis | Output |
|---|---|---|---|---|---|---|---|---|
| 11-09 07:00 | ED 0200-0700 | 0 | 2500 | 46 | 2546 | 500 | 250 | 750 |
| 11-09 11:00 | 0700-1100 | 150 | 1000 | 422 | 1572 | 600 | 150 | 750 |
| 11-09 15:00 | 1100-1500 | 200 | 850 | 125 | 1175 | 650 | 0 | 650 |
| 11-09 19:00 | 1500-1900 | 250 | 750 | 30.5 | 1030.5 | 550 | 0 | 550 |
| 11-09 23:00 | 1900-2300 | 500 | 400 | 20 | 920 | 600 | 0 | 600 |
| 11-10 03:00 | 2300-0300 | 200 | 400 | 0 | 600 | 500 | 0 | 500 |
| 11-10 07:00 | 0300-0700 | 300 | 400 | 0 | 700 | 500 | 0 | 500 |
| 11-10 11:00 | 0700-1100 | 600 | 0 | 10 | 610 | 600 | 0 | 600 |
| 11-10 15:00 | 1100-1500 | 750 | 0 | 0 | 750 | 600 | 0 | 600 |
| 11-10 19:00 | 1500-1900 | 550 | 0 | 0 | 550 | 500 | 0 | 500 |
| 11-10 23:00 | 1900-2300 | 500 | 0 | 10 | 510 | 400 | 0 | 400 |
| 11-11 03:00 | 2300-0300 | 200 | 0 | 0 | 200 | 300 | 0 | 300 |
| 11-11 07:00 | 0300-0700 | 200 | 0 | 0 | 200 | 300 | 0 | 300 |
| 11-11 11:00 | 0700-1100 | 650 | 0 | 10 | 660 | 600 | 0 | 600 |
| 11-11 15:00 | 1100-1500 | 800 | 0 | 0 | 800 | 650 | 0 | 650 |
| 11-11 19:00 | 1500-1900 | 550 | 0 | 0 | 550 | 600 | 0 | 600 |
| 11-11 23:00 | 1900-2300 | 500 | 0 | 10 | 510 | 450 | 0 | 450 |
| 11-12 03:00 | 2300-0300 | 200 | 0 | 0 | 200 | 300 | 0 | 300 |
| 11-12 07:00 | 0300-0700 | 200 | 0 | 0 | 200 | 300 | 0 | 300 |
**Shift totals (match the source; the app's Flowsheets > Intake/Output shows the same)**: D1 day (0700-1900) in 3,777.5 / out 1,950 / net +1,827.5; D1 night 2,220 / 1,600 / +620; D2 day 1,910 / 1,700 / +210; D2 night 910 / 1,000 / -90; D3 day 2,010 / 1,850 / +160; D3 night 910 / 1,050 / -140. **Simulation 11,737.5 / 9,150 / +2,587.5; ED 2,546 / 750 / +1,796; ED plus simulation net +4,383.5 mL** (insensible losses not counted). Day-1 day-shift IV med 577.5 = KCl 400 + magnesium 100 + insulin carrier 37.5 + flushes 40. Flushes (10 mL per IV): Day 1 1000, 1200, 1830 (x2 IVs), 1900 (x2), Day 2 0700 (left IV removed, right only), Day 2 1900, Day 3 0700, Day 3 1900; none at discharge; infusion tubing priming is excluded. Boundary rule: an event at 1900 belongs to the new night shift, at 0700 to the new day shift.

## Checkpoint story (monitor values = `DKA3` rows in monitor.html, lying; Celsius in the source converted to F)
| Time | Monitor | Patient / events | Released by then |
|---|---|---|---|
| **Mon 0700** | HR 100 sinus tach, BP 114/70, RR 22, SpO2 99% RA, 98.2 F, mild peaked T (tAmp 0.5) | Alert, fatigued, dry mouth, mild diffuse abdominal soreness, deep breathing, wants water, two IVs. Glucose 410; insulin 6 units/h; NS + KCl 20 at 250 | ED labs, 0645 panel (K 3.6, Mg 1.6, gap 19, BHB 4.1), ED notes, H&P; HbA1c not yet |
| (mid) 0730 | 104, 112/68 | Vomits 150 mL after sips (the last time) | |
| (mid) **0800** | 98, 114/70, RR 20, flat T + tiny U | **Critical K 3.2 (0745)**: HOLD insulin, plain NS 250, KCl piggyback 1 (0800), Mg 2 g, ECG; HbA1c 11.8 released | 0745 panel, HbA1c, critical-K note 0810 |
| (mid) **0815** | 96, 114/70 | ECG: flat T, small U waves (also 0900: 94, K bag 2; K check drawn 0945) | ECG 0815 |
| (mid) **1000** | 92, 114/70, T and U recovering | **K 3.6: restart insulin 6 units/h**; bags 3, 4; BHB 3.0 not resolved | 0945 panel, note 1010 |
| (mid) **1200** | 90, 116/72 | K 4.0, bags done; **glucose 220: D5NS + KCl 20 at 200 mL/h, insulin 3 units/h**; BHB 1.6, bicarbonate 16 | 1145 panel, note 1210; educator 1430 |
| (mid) **1600** | 88, 118/72 | **DKA resolved** (1545: BHB 0.4, pH 7.37, HCO3 20). Glargine 1630; drip + D5NS off 1830; NS 100 | 1545 panel, endocrine 1615 |
| **Mon 1900** | HR 88, 118/72, RR 18, 98.4 F, normal T | First meal; lispro 4 units (45 g eaten); worried about paying; sister has the daughter | 1845 panel (K 3.9, BHB 0.3), ECG 1900, notes 1840, 2000 |
| **Tue 0700** | 82, 116/74, RR 16, 98.2 F | IV fluids off, left IV out, walking; glucose 148; says she often skips lunch; SW 0900, RD 1030 | 0645 panel (K 3.7, HCO3 24, Cr 0.7, phos 2.3, WBC 9.0) |
| (mid) **Tue 1400** | **108**, 126/78 | **Glucose 62**, shaky, sweaty: 15 g juice -> 78 (1415) -> snack -> 104 (1430) (1430 row HR 86); fixed meal dose stopped 1435, carbohydrate-matched dosing | hypoglycemia note 1440, endocrine 1445 |
| **Tue 1900** | 80, 120/74 | Dinner 45 g, lispro 3 units (1920); **2030 pen teach-back: names the lispro pen as the afternoon pen**; labeled pens, repeat | 1845 panel (K 4.0, phos 2.6), pharmacy 1730 |
| **Wed 0700** | 78, 118/76 | Rested; names pens with written prompts; 0200 glucose 140; dispensing ordered 0900 | 0645 panel (K 4.1, phos 2.9), notes 0630, 0720 |
| **Wed 1900** | 76, 122/76 | Medicine bag and food plan at the bedside; supplies arrived 1000; case management 1100; educator 1645 (independent); ready to dose dinner | 1845 panel (K 4.1, phos 3.1) |
| **Thu 0700** | 76, 120/76 | Discharge: final chemistry normal; leaves with her sister | 0645 panel (K 4.2, phos 3.2, Mg 2.0), discharge note |

## Orders (gated by `orderedAt`; `stoppedEarly` hides unplanned stops until they happen)
ED (Shah): two IVs + monitor + measured I&O; resuscitation-level care; ECG; initial labs; NS 1 L bolus (0200); ondansetron once (0225); NS 500 mL/h (0300); **insulin infusion (written 0220, start 0300, end 1830 hidden)**; **peripheral potassium safety protocol (never more than 10 mEq/h)**; NS + KCl 20 mEq/L at 250 (0500, ends 0800 hidden); labs 0445/0645; NPO (to 1615); POC glucose hourly (to 1830); HbA1c add-on; hypoglycemia rescue (juice, D10, glucagon). 0700 (Reed): admit, Full Code, telemetry and hourly assessments, strict I&O (no Foley, daily weight from Day 2), assisted activity (to Tue 0700; independent from Tue 0700), consults (endocrinology, social work, case management, pharmacy, dietitian, diabetes educator), 0745 panel, **enoxaparin 40 mg SC 2100 x3**. **0800**: hold insulin and potassium-free saline (nursing order, ends at the 1000 restart), **KCl 10 mEq x4 sequential**, plain NS 250 mL/h, **magnesium 2 g over 2 h**, 0945/1145 panels, ECG now, flushes (written with the electrolyte orders). **1000**: restart insulin 6 units/h. **1200**: **D5NS + KCl 20 at 200 mL/h and insulin 3 units/h**, 1545 panel, follow-up ECG 1855 (written 1210). **1615 (Lee)**: glargine 18 units 1630 daily; stop insulin and D5NS at 1830; NS 100 mL/h to Tue 0700; consistent-carbohydrate diet; AC/HS glucose; lispro 4 units with meal; correction scale; 1845 panel; Day 2-4 chemistry. Tue 0900: benefits, assistance, childcare, transport, food screening. **Tue 1435**: lispro by carbohydrate eaten. **Wed 0900**: bedside supplies via the charity fund (dispensed 1000). Thu 0650: conditional discharge.

## Devices
PIV left forearm 18 g (Mon 0200; **removed Tue 0700**); PIV right forearm 20 g (Mon 0200; **removed at discharge Thu 0700**); telemetry (Mon 0200; removed at discharge). No central line, no Foley.

## Notes (30 notes + 3 ECG records, time-gated)
ED RN admission 0210; ED provider 0220; ED RN reassessment 0340; ED provider transfer 0615; ED RN handoff 0650; **H&P 0700**; **critical potassium 0810**; electrolyte reassessment 1010; infusion change 1210; diabetes educator 1430; **endocrinology 1615**; transition completed 1840; night evaluation 2000; Day 2: hospitalist 0715, social work 0900, dietitian 1030, **hypoglycemia event 1440**, endocrine dose review 1445, pharmacy access 1730, night teach-back 2045; Day 3: night summary 0630, hospitalist 0720, pharmacy delivery 1015, case management 1100, dietitian 1330, educator final 1645, night discharge readiness 1915; Day 4: conditional discharge 0650, case management 0655, **discharge note 0700**; ECG records 0215, 0815, 1900. `gen/check_notes.js` checks that no note quotes a lab before it resulted.

## Stickies
Potassium (peripheral rule); insulin infusion rules; cost-related insulin rationing language; insulin held for K 3.2 (0800); transition (1615); meal insulin only for food eaten (Tue 1440).

## Discharge (Thu 0700) and affordability plan (all programs, prices and appointments simulated)
Home with her sister. **Glargine 18 units every day at 1630** (next dose Thu 1630; no 2100 dose, including illness and days without meals unless the clinic changes it). **Lispro 1 unit per 15 g carbohydrate eaten**, rounded down, immediately after eating (15 g 1 unit, 30 g 2, 45 g 3, 60 g 4), plus the printed premeal correction (200 or lower 0; 201-250 1; 251-300 2; 301-350 3; over 350 call urgently and check ketones); no dose when no carbohydrate is eaten; no correction within 4 hours or at bedtime; the old fixed 6-unit instruction is discontinued; one lispro product only. Glucagon 1 mg IM kit (sister trained); glucose tablets and a portable snack; meter before meals and bedtime plus symptoms and illness (200 strips and lancets); urine ketone strips; CGM assessment at follow-up. **Sick day**: continue basal, glucose every 2-4 h, ketones when ill or glucose 250 or higher, fluids, call for positive ketones; emergency care for persistent vomiting, deep fast breathing, confusion, severe abdominal pain, moderate or large ketones.
- **Bridge in hand (Wed 1000)**: five 3 mL glargine pens, five 3 mL lispro pens, 200 pen needles, meter, 200 strips, 200 lancets, urine ketone strips, glucose tablets, one glucagon kit, paid by the **simulated hospital charity fund** ($0 at discharge).
- **Next fill**: a manufacturer savings program for people without insurance (simulated, about $35 per month for the two insulins together; it does not cover strips, needles or other supplies, and it is not a universal price for everyone). **Longer term**: a patient-assistance application (simulated), submitted Wed, **not approved** at discharge; the clinic's access coordinator checks it **Mon Nov 16** and arranges a replacement bridge if it is delayed. Medicaid or marketplace screening in progress, no approval assumed. Changing products later needs a prescription reconciliation and teaching: no overlapping regimens.
- **Simulated budget**: $35 per month insulin + $0 clinic supply fund for strips, lancets and needles while coverage is pending + $10 sliding-fee visit when due; a ride for the first visit.
- **Follow-up (Riverbend Community Health Center, simulated)**: nurse call **Fri Nov 13 0830**; visit **Fri Nov 13 1000** (post-DKA assessment, doses, supplies, benefits, $10 sliding fee, round-trip ride arranged); assistance check **Mon Nov 16** (access coordinator); diabetes education and nutrition **Wed Nov 18 1500**; endocrinology within 2-4 weeks, referral accepted, not yet booked. Food: pantry box collected Day 3 by her sister, school meal support reviewed, SNAP referral under way (not assumed approved).

## Changes from the source design (`SOURCE_chatgpt_design.md` is kept unchanged)
1. Real manufacturer programs, brand-switch teaching (Humalog to Admelog), prices attributed to real programs and all links removed; generic simulated wording; one lispro product.
2. MRN SIM-40503 (source SIM-DC-038); room SD-8 added; staff first names changed to avoid repeating other series patients.
3. Unit RN notes (source #6, 7, 9, 12, 13, 17, 20, 21, 27, 30) are not pre-written (series rule: students are the RNs): their content is carried by provider notes (critical potassium, infusion change, transition completed, evening assessment, hypoglycemia event, teach-back, overnight summary, discharge readiness, discharge note); the source's 0710 arrival note became the ED RN handoff at 0650. ED RN notes stay. The out-of-chart phrase "as well as the requested teaching checklist" was removed; "simulation"/"scenario" wording removed from notes.
4. Phosphate monitoring stated in the 0700, 0810, 1010 and 1210 provider notes; no phosphate order (rationale above).
5. Enoxaparin kept with a rationale (REVIEW.md).
6. The 1900 ECG was acquired 1855 and read 1900; the 0215/0815 ECGs acquired 0205/0805 and read at the listed result times; ECG orders added. Flush order written 0800 with the electrolyte orders (source 0700) so it does not reveal the 1000/1200 flushes after the magnesium and potassium at 0700.
7. Monitor rows added between checkpoints (0730 vomit, 0800 K, 0815 ECG, 0900, 1000, 1200, 1600 resolution, Day 2 1400 and 1430 hypoglycemia).
8. Hold/restart wording unified with the series ("K 3.5 or higher").

## Rebuild
`python3 casestudy/cases/dka3_denise/gen/ecg/make_ecgs.py` (ECGs only), `node casestudy/cases/dka3_denise/gen/assemble.js`, then `node tools/make-prebuilt.js`. `node gen/physiology.js` prints the anion gaps, corrected sodium, osmolality, Winter's and Henderson-Hasselbalch checks, glucose fall rates and I&O totals; `node gen/infusions.js` prints the fluid, insulin, piggyback and potassium volumes per block and the maximum potassium rate; `node gen/check_notes.js` checks note time-gating.

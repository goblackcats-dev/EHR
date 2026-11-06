# DKA patient 2 of 7: Jordan Ellis, insulin pump failure after a weekend of drinking (single source of truth)

Simulation: **Mon 2026-12-14 07:00 to Thu 2026-12-17 07:00 (72 h)**. Checkpoints at every shift change: **Mon 0700, Mon 1900, Tue 0700, Tue 1900, Wed 0700, Wed 1900, Thu 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md` (including the series potassium rule).

- **Vital signs are in the chart ONLY up to the 0700 arrival set.** Later vitals come from the bedside monitor (monitor.html `DKA2` rows, MRN SIM-40502) and the students chart them.
- Baseline nursing assessment: ED 0035 and IMCU 0700 only.
- **Point-of-care glucose IS in the chart, time-gated**: hourly on the insulin infusion, then before meals, bedtime and 0300 (plus event checks). Bedside ketone meter values Thu 0010 and 0300.
- MAR: ED doses and infusions started in the ED are `given`; infusions running at 0700 show "0700 Running". **Every dose after Mon 0700 is `due`.** Rate changes after 0700 (D10 line, saline while a rider runs, insulin hold/restart) are student actions driven by protocol orders; provider orders that change rates are time-gated.
- Labs, notes, orders, devices, I&O, problems and stickies are time-gated. Orders placed before their start show "Pending" until the start.

## Patient
- **Jordan Ellis**, 24-year-old man, DOB **2002-03-22**, MRN **SIM-40502**, he/him. Height 180 cm, **weight 72.0 kg** (ED bed scale; dosing weight for the whole stay), BMI 22.2. Usual weight 74.5 kg (endocrinology clinic 10/06/2026). **Allergy: penicillin (hives as a child). Full Code.**
- Type 1 diabetes since age 11 (DKA at diagnosis, none since). Tubed insulin pump since 14, CGM (Dexcom G7) since 16. Adult endocrinology since 19. HbA1c 7.4% (October), **7.6%** this admission. No complications known.
- Pump settings (unchanged all stay): basal 0000 0.80, 0400 1.00, 0900 0.90, 2200 0.85 units/h = **21.6 units/day**; carbohydrate ratio **1 unit/10 g**; correction **1 unit/45 mg/dL**, target 120; active insulin 3 h. Average total daily dose about 46 units (0.64 unit/kg). **At home: no long-acting insulin, one lispro pen expired 2025, no ketone strips, glucagon expired.**
- Line cook at a downtown restaurant (1400-2300 shifts, staff meal; food access fine). Lives with roommate **Theo Grant**. Insured on his parents' plan (under 26). Parents **Karen and Mark Ellis** live 3 hours away (mother updated by phone with his permission). Binge drinking 2-3 nights a month (6-12 drinks); no daily or morning drinking, no past withdrawal. Occasional vaping, no drugs.
- Units: **Medical Intermediate Care Unit, room IMC-6** (Mon 0700 - Tue 1400), then **Medicine 4 East, room 4E-21** from **Tue 1400**.
- People: ED physician **R. Castillo, MD**; ED RN **J. Whitaker, RN** (second checker S. Patel, RN); hospital medicine days **A. Lindqvist, MD**, nights **P. Raman, MD**; endocrinology **M. Feld, MD**; pharmacist **E. Novak, PharmD**; diabetes educator **L. Abernathy, RN, CDCES**; dietitian **K. Osei, RD**; social worker **R. Halvorsen, LCSW**; case manager **D. Kim, RN CM**. Unit RN notes are NOT pre-written.

## Story before the unit
Pump infusion set placed Thu 12/10 (left lower abdomen, his usual lumpy area). **Sat 12/12** friend's birthday: about 10-12 drinks 2100-0200, little food; slept on a friend's couch in jeans; the tubing caught on his belt and the soft cannula pulled half out and bent; **phone died, so no CGM alarms**. **Sun 12/13**: woke about 1000, vomiting from about 1100 ("8-10 times"), belly ache, blamed a hangover; CGM high; pump corrections 1302 (5.0 units) and 1712 (6.0 units) through the failed set (no occlusion alarm: the set leaked, it did not block); no ketone check, no backup insulin. Roommate home from work 2345 found him breathing fast and confused-sounding and drove him in.
**ED (arrival Mon 0030)**: triage 0035 T 99.0, HR 122, BP 104/62, RR 28 Kussmaul, SpO2 98% RA, pain 5, GCS 15 (sleepy), weight 72.0 kg. POC glucose 556 (0040). 0045 IV left forearm 18 g + labs; 0050 IV right antecubital 20 g + swab. **0055-0155 0.9% NaCl 1,000 mL** (13.9 mL/kg). 0100 ondansetron 4 mg; **0105 thiamine 100 mg IV** (before any dextrose). **0110 pump suspended and removed** (belongings bag). 0115 ECG (tall T), void 450 (UA, drug screen). 0130 emesis 200. **0200 0.9% NaCl 500 mL/h** (no K: K 5.4). **0215 regular insulin 0.1 unit/kg/h = 7.2 units/h, no bolus.** 0330 void 500. **0400 NaCl 250 mL/h + first KCl 10 mEq rider 0400-0500** (K 4.6 at 0300, voiding). 0545 void 400. 0615 H&P; 0630 labs; ED RN note 0640; handoff 0650; IMCU 0700.
ED vitals in the chart: 0035 (above); 0155 HR 114, 110/66, RR 26; 0400 HR 108, 114/68, RR 24; 0615 HR 106, 112/68, RR 24, T 98.8; **0700 IMCU HR 108, 112/68, RR 24, SpO2 98%, T 98.8, pain 3.**

## Fluid, insulin and potassium math (state it the same everywhere; `gen/infusions.js` computes the volumes)
- **Fluids (adult, 2024 consensus)**: 1 L isotonic in hour 1 (13.9 mL/kg), then 500 mL/h x2 h, then 250 mL/h (3.5 mL/kg/h); **100 mL/h once the D10 line starts (0805 Mon)**; while a potassium rider runs the saline is lowered by 50 mL/h. **0.9% NaCl throughout**: a balanced fluid (lactated Ringer's) is allowed by the consensus, but it carries 4 mEq/L potassium and Jordan has peripheral IVs only (series potassium rule). All IV fluid off at the transition (Tue 0930; saline lock).
- **Insulin** 0.1 unit/kg/h x 72.0 = **7.2 units/h** (1 unit/mL = 7.2 mL/h), **fixed rate, no bolus**, from Mon 0215. **Held Mon 1920-2200 (K 3.3)**, off Tue 0930.
- **Dextrose line** (separate D10W bag, no potassium): start 100 mL/h when glucose under 250 (started **0805 Mon** at 214); 150-250 = keep 100; over 250 on D10 = 50; under 150 = 150 mL/h and call (**Tue 0300, glucose 148**); off while insulin is held (1920-2200); off at 0930 Tue. 100 mL/h = 10 g dextrose/h.
- **Potassium (series rule, peripheral IVs only)**: no potassium in any bag; **KCl 10 mEq/100 mL riders over 1 h, one at a time, never more than 10 mEq/h**, through the right antecubital IV, only while voiding, by the 4-hour K: over 5.0 = none (recheck 2 h); 4.5-5.0 = 10 mEq per cycle; 4.0-4.4 = 20; 3.5-3.9 = 30; **under 3.5 = hold insulin and D10, call (4 riders back to back, recheck after 20 mEq)**. This averages 5-7.5 mEq/h, close to the adult 20-30 mEq per liter at these fluid rates.
- **Riders given (18 = 180 mEq IV)**: ED 0400 (K 4.6: 10); 0730, 0830 (K 4.1: 20); 1130, 1230, 1330 (K 3.8: 30); 1530, 1630, 1730 (K 3.6: 30); **1930, 2030, 2130, 2230 (K 3.3: insulin held, 4 back to back)**; 2330 (K 3.7: 30 this cycle counting the 2130 and 2230 riders); Tue 0230, 0330 (K 4.0: 20); 0630, 0730 (K 4.1: 20). Plus **KCl ER 20 mEq PO Tue 1300** (K 3.9 at 1130).
- **Magnesium sulfate 2 g IV** Mon 0800 (Mg 1.5) and Mon 1930 (Mg 1.7 with refractory low K), both through the left line (Y-site with saline) because the right IV carries riders.
- Other doses: ondansetron 4 mg; thiamine 100 mg IV then 100 mg PO daily 0900 (Tue, Wed); acetaminophen 650 mg max 3 g/day (alcohol); lorazepam 1-2 mg only for CIWA-Ar 10+ (never needed); dextrose 50% 25 g PRN; glucagon 1 mg IM PRN; glucose 15 g PRN.
- **Transition (endocrinology Tue 0640)**: DKA resolved at 0530. **Glargine 20 units SC Tue 0730** (one bridge dose; 92% of the pump basal 21.6, 0.28 unit/kg). **Lispro pen 1 unit/10 g** with meals + **correction 1 unit/45 mg/dL above 150** (whole units), bedtime correction only over 250. **Insulin drip, D10 and saline off Tue 0930** (2 h after glargine, after the 0800 lispro). **Pump restart Wed 0815** after the 0800 site-change teach-back (about 24 h after glargine; **no glargine Wednesday**). Pump correction uses his home target 120; the hospital pen scale uses 150.
- Corrected sodium uses **1.6 per 100 mg/dL** glucose over 100 (ADA; ISPAD uses 2). Effective osmolality = 2 x Na + glucose/18; calculated osmolality adds BUN/2.8.

## Chemistry and gases (collected / result times)
Gas results 15 min, BMP 45 min, BHB 55 min after collection (STAT 2130: gas 10, BMP 25, BHB 35).
| Collected | Results (gas / BMP / BHB) | Na | K | Cl | CO2 | BUN | Cr | Glu | Ca | Mg | Phos | AG | BHB | pH | pCO2 | HCO3 | Winter's (1.5 x HCO3 + 8 +/- 2) | corr Na |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon 0045 (ED) | 0100 / 0130 / 0140 | 133 | **5.4** | 97 | **10** | 24 | **1.4** | **572** | 9.4 | 1.9 | 5.2 | **26** | **6.2** | **7.22** | 24 | 9.4 | 20.1-24.1 | 140.6 |
| Mon 0300 (ED) | 0315 / 0345 / 0355 | 136 | 4.6 | 102 | 11 | 22 | 1.3 | 470 | 9.0 | 1.8 | 4.4 | 23 | 5.6 | 7.25 | 24 | 10.2 | 21.3-25.3 | 141.9 |
| Mon 0630 (ED) | 0645 / 0715 / 0725 | 137 | 4.1 | 104 | 12 | 20 | 1.2 | 292 | 8.9 | **1.5** | 3.0 | 21 | 4.6 | 7.25 | 26 | 11.0 | 22.5-26.5 | 140.1 |
| Mon 1030 | 1045 / 1115 / 1125 | 138 | 3.8 | 106 | 14 | 17 | 1.1 | 192 | 8.7 | 1.9 | 2.2 | 18 | 3.1 | 7.27 | 29 | 13.0 | 25.5-29.5 | 139.5 |
| Mon 1430 | 1445 / 1515 / 1525 | 138 | 3.6 | 107 | 15 | 15 | 1.0 | 240 | 8.6 | 1.8 | 1.9 | 16 | 2.4 | 7.29 | 30 | 14.0 | 27.0-31.0 | 140.2 |
| **Mon 1830** | 1845 / **1915** / 1925 | 139 | **3.3** | 108 | 16 | 13 | 0.9 | 200 | 8.6 | 1.7 | **1.8** | 15 | 1.8 | 7.31 | 31 | 15.2 | 28.8-32.8 | 140.6 |
| **Mon 2130 STAT** | 2140 / **2155** / 2205 | 139 | 3.7 | 108 | 15 | 12 | 0.9 | 246 | 8.6 | 2.1 | 1.9 | 16 | 2.0 | 7.30 | 30 | 14.4 | 27.6-31.6 | 141.3 |
| Tue 0130 | 0145 / 0215 / 0225 | 140 | 4.0 | 109 | 18 | 11 | 0.9 | 174 | 8.7 | 2.0 | 2.1 | **13** | 0.9 | 7.34 | 33 | 17.2 | 31.8-35.8 | 141.2 |
| **Tue 0530** | 0545 / 0615 / 0625 | 139 | 4.1 | 108 | **20** | 10 | 0.9 | 160 | 8.8 | 1.9 | 2.6 | **11** | **0.4** | **7.36** | 35 | 19.0 | 34.5-38.5 | 140.0 |
| Tue 1130 | BMP 1215, BHB 1225 | 138 | 3.9 | 105 | 22 | 10 | 0.9 | 246 | 9.0 | 1.9 | 2.8 | 11 | 0.3 | | | | | 140.3 |
| Wed 0500 | 0545 | 139 | 4.1 | 104 | 24 | 11 | 0.9 | 132 | 9.2 | 1.9 | 3.4 | 11 | | | | | | |
| Thu 0500 | 0545 | 140 | 4.3 | 104 | 26 | 12 | 0.9 | 118 | 9.3 | 2.0 | 3.6 | 10 | | | | | | |
- **Moderate DKA** (classic ADA classes: pH 7.00-7.24, bicarbonate 10-15, alert/drowsy). Every pH matches Henderson-Hasselbalch (6.1 + log(HCO3 / (0.03 x pCO2))) and every pCO2 is inside Winter's range. Delta-delta at 0045: gap up 14, bicarbonate down 14 (pure gap acidosis); at Tue 0130 gap 13 but CO2 18 (Cl 109: some saline-related non-gap acidosis).
- **Resolved Tue 0530** (2024 consensus: pH 7.3 or higher or bicarbonate 18 or higher, AND BHB under 0.6; gap 11). At Mon 2130 and Tue 0130 pH was already 7.30-7.34 but BHB 2.0 and 0.9: not resolved (the teaching point).
- Effective osmolality 298 at 0045 (no hyperosmolar overlap); measured 309 vs calculated 306 = **osmolal gap 3** (no toxic alcohol). eGFR (CKD-EPI 2021): 72, 79, 87, 96, 108, 122 ... 122.
- Other (ED 0045, results 0130): **ethanol under 10 (none detected)**, acetaminophen and salicylate none, lipase 48, AST 46, ALT 39, alkaline phosphatase 82, bilirubin 0.9, **GGT 68**, albumin 4.6. Lactate 2.6 (0100) and 1.4 (0630/0645). Respiratory PCR (flu A/B, COVID-19, RSV) not detected (0050/0230). **HbA1c 7.6%** (res Mon 0900).
- CBC 0045 (res 0115): WBC 15.8, Hgb 16.2, Hct 48.1, Plt 286, neutrophils 82%, lymphocytes 11%. Tue 0530 (res 0615): 8.4, 13.9, 41.0, 224, 62%, 28%.
- Urine 0115 (res 0200): SG 1.028, glucose 4+, ketones large (80), protein trace, blood/LE/nitrite negative; drug screen (amphetamines, benzodiazepines, cannabinoids, cocaine, opiates) negative.
- **ECGs** (Chart Review > Cardiology with images, `gen/ecg/make_ecgs.py`): **0115 (res 0135)** sinus tach 118, PR 148, QRS 88, QT/QTc 320/448, **tall narrow T V2-V4** (K 5.4). **1935 (res 1945)** sinus 92, PR 152, QRS 88, QT/QTc 378/468, **flat T + U waves V2-V3** (K 3.3).
- **Alcoholic ketoacidosis overlap**: considered (binge, vomiting, fasting, normal-ish glucose expected in AKA); glucose 572 and a failed pump make this DKA. Ethanol none detected (last drink about 22 h earlier). Treatment overlaps (fluids, dextrose, thiamine, insulin).

## Point-of-care glucose (all in the chart at their times)
Mon: 0040 556, 0200 518 (after 1 L saline, before insulin), 0300 476, 0400 422, 0500 368, 0600 316, **0700 266**, **0800 214 (D10 start)**, 0900 198, 1000 186, 1100 190, 1200 182, 1300 176, **1400 248 (regular soda 1310)**, 1500 232, 1600 214, 1700 204, 1800 196, **1900 192**, 2000 206, 2100 236, **2200 248 (insulin restart)**, 2300 226. Tue: 0000 204, 0100 182, 0200 166, **0300 148 (D10 to 150)**, 0400 158, 0500 162, 0600 166, **0700 164**, 0730 162, 0830 174, 0930 182, 1030 188, **1130 246**, 1730 188, **2010 64**, 2025 92, 2100 118. Wed: 0300 132, **0730 138**, 1030 164, 1130 176, 1730 204, 2100 212, **2300 276**. Thu: **0010 298**, 0130 236, 0300 168, 0600 142. Bedside ketones: **Thu 0010 0.6, 0300 0.2**.
Fall on insulin before dextrose: 54, 54, 52, 50, 52 mg/dL per hour (goal 50-75, never over 100).

## Insulin doses the students should calculate (whole units on pens; pump 0.05-unit steps)
Tue 0800: 70 g -> 7 + 0 (162) = **7 units**. Tue 1200: 80 g -> 8 + 2 (246: 96/45 = 2.1) = **10**. Tue 1730: 90 g -> 9 + 1 (188: 38/45 = 0.8) = **10** before eating; he eats about half -> **64 at 2010** (dose after eating when intake is uncertain). Tue 2100: 118 -> no correction. Wed 0830 (pump): 60 g -> 6.0 + (138-120)/45 = 0.4 = **6.4 units**. Wed 1730: tray skipped, pump correction (204-120)/45 = **1.85**. Wed 1930 pizza 75 g: **7.5**. Wed 2305: (276-120)/45 = **3.45** by pump; no fall at 0010 (298) + ketones 0.6 -> **pen 3 units** ((298-150)/45 = 3.3) at 0020 + set change 0030.

## Intake and output (4-hour blocks, `periodEnd: true`; labels Oral, IV fluid, IV med, Urine, Emesis). IV volumes from `gen/infusions.js`.
| Block (ends) | Oral | IV fluid (saline + D10) | IV med (insulin + riders + Mg/thiamine/ondansetron) | In | Urine | Emesis | Out |
|---|---|---|---|---|---|---|---|
| ED 0030-0700 | 0 | 2,700 | 186 (34 + 100 + 52) | 2,886 | 1,350 | 200 | 1,550 |
| Mon 1100 | 60 | 755 (463 + 292) | 279 (29 + 200 + 50) | 1,094 | 900 | 0 | 900 |
| Mon 1500 | 640 (soda 400) | 650 (250 + 400) | 329 (29 + 300) | 1,619 | 950 | 0 | 950 |
| Mon 1900 | 360 | 650 | 329 | 1,339 | 900 | 0 | 900 |
| Mon 2300 | 240 | 358 (225 + 133) | 410 (10 + 350 + 50) | 1,008 | 550 | 0 | 550 |
| Tue 0300 | 120 | 700 | 229 | 1,049 | 550 | 0 | 550 |
| Tue 0700 | 120 | 900 (300 + 600) | 229 | 1,249 | 600 | 0 | 600 |
| Tue 1100 | 480 | 550 (175 + 375) | 168 (18 + 150) | 1,198 | 650 | 0 | 650 |
| Tue 1500 / 1900 / 2300 | 720 / 840 / 480 | 0 | 0 | | 750 / 750 / 600 | 0 | |
| Wed 0300 / 0700 | 120 / 120 | 0 | 0 | | 300 / 400 | 0 | |
| Wed 1100 / 1500 / 1900 / 2300 | 840 / 960 / 840 / 720 | 0 | 0 | | 650 each | 0 | |
| Thu 0300 / 0700 | 240 / 240 | 0 | 0 | | 700 / 600 | 0 | |
Shift totals: ED night in 2,886 / out 1,550; Mon day 4,052 / 2,750; Mon night 3,306 / 1,700; Tue day 2,758 / 2,150; Tue night 720 / 1,300; Wed day 2,640 / 1,950; Wed night 1,200 / 1,950. Whole stay in 17,562 / out 13,350 (net +4,212). Weights: **72.0 (Mon ED bed scale) -> 74.2 (Tue 0600) -> 74.0 (Wed 0600) -> 73.9 (Thu 0600)**; usual 74.5. Net +4.2 L to Tue 0700 minus about 2 L insensible loss (30 h, Kussmaul breathing) fits +2.2 kg; on the floor, water in food is not charted.

## Checkpoint story (monitor values = `DKA2` rows in monitor.html, lying)
| Time | Monitor | Patient / events | Released by then |
|---|---|---|---|
| **Mon 0700** | HR 108 sinus tach (T a little tall), BP 112/68, RR 24 deep, SpO2 98% RA, T 98.8 | Sleepy-awake, fruity breath, nauseated, wants food, soda and his pump. Glucose 266. Insulin 7.2, saline 250 | ED labs 0045/0300, ECG, ED/H&P/handoff notes |
| (mid) 0715-1015 | | 0630 labs: **Mg 1.5** -> MgSO4 2 g 0800; K 4.1 -> riders 0730, 0830; **0800 glucose 214 -> D10 100 + saline 100**; A1c 7.6 (0900); sugar-free clear liquids 1015 | 0630 panel, hospitalist 1015 |
| (mid) **1310** | 96, 118/72, RR 20 | Roommate brings a **regular soda**: glucose 248 at 1400 | 1030 panel (1115), endocrine 1145 |
| **Mon 1900** | 94, 116/70, RR 18, flat T, small U | K 3.6 at 1430 -> riders 1530-1830; 1830 labs pending | hospitalist 1540 |
| (mid) **1920** | 92, 116/72, **flat T + U** | **K 3.3 (1915): HOLD insulin + D10**, 4 KCl riders 1930-2330, Mg 2 g, ECG 1935, STAT labs 2130 | 1830 panel, ECG 1945, night event note 2015 |
| (mid) 2200 | 88, 114/70 | **K 3.7 -> insulin and D10 restarted 2200** (BHB 1.8 -> 2.0 during the hold) | STAT panel 2155, night note 2230 |
| (mid) Tue 0300 | 78, 112/66, RR 16 | **Glucose 148 -> D10 150 mL/h**, call | 0130 panel (gap 13, BHB 0.9) |
| **Tue 0700** | 80, 118/72, RR 16, T 98.4, normal T | **Resolved 0530**. Glargine 0730, lispro 0800 (7), drip/D10/saline off 0930. **Wants his pump back now** | 0530 panel, night note 0630, endocrine 0640 |
| (mid) Tue 1400 | 82, 120/74 | Glucose 246 at 1130 (lunch 10 units); no rebound ketones; KCl 20 PO 1300; **transfer to 4E-21 1400** (monitor and right IV out) | educator 1100, transfer 1340, SW 1500, RD 1530 |
| **Tue 1900** | 80, 122/76 | Ate half of a 90 g dinner after 10 units | endocrine 1630 (pump plan) |
| (mid) **2010** / 2030 | **108, 128/80** / 84, 120/74 | **CGM low alarm, fingerstick 64** -> 15 g juice -> 92 -> snack -> 118 | night event note 2045 |
| **Wed 0700** | 72, 118/72, RR 14 | Pump day: **site-change teach-back 0800, pump basal 0815**, breakfast bolus 6.4 by pump; no glargine | Wed 0500 BMP, endocrine 0730 |
| **Wed 1900** | 76, 120/76 | On the pump all day (164, 176); teaching complete; discharge planned | educator 0930, pharmacy 1400, CM 1430, hospitalist 1600 |
| (mid) **Thu 0010** / 0300 | 86, 124/78 / 70, 116/70 | **298 not down after a pump correction, ketones 0.6** -> pen 3 units, new set (old cannula kinked) -> 236, 168 (ketones 0.2) | night event note 0115 |
| **Thu 0700** | 70, 118/72, RR 14 | Ready for discharge with roommate | Thu 0500 BMP, night note 0620, discharge order 0640, endocrine 0650 |

## Orders (gated by `orderedAt`; `stoppedEarly` hides unplanned stops until they happen)
ED: ondansetron 0050; thiamine 0055; NaCl bolus 0050; **NaCl main fluid 0200** (to Tue 0930); KCl rider 0350; **insulin infusion 0140 (start 0215, to Tue 0930)**. IMCU 0615 (Raman): admit, Full Code, VS q1h + monitor (to Tue 1400), mental status/abdomen q2h, strict I&O/daily weight, standby assist, NPO except ice chips/sips (to 1015), POC q1h (to Tue 0930), labs q4h (to Tue 0530), **peripheral potassium protocol** + KCl rider PRN, **D10 dextrose line** (due 0800), **CIWA-Ar q4h to Wed 0200**, **pump suspended/CGM trends only** (to Wed 0815), endocrine and pharmacy consults, thiamine PO daily (from Tue 0900), lorazepam CIWA PRN, ondansetron PRN, acetaminophen PRN (max 3 g), D50 PRN. 0930 social work. **0740 MgSO4 2 g (0800).** **1015 sugar-free clear liquids** (to Tue 0640). 1145 diabetes education. **1920: hold insulin + D10 (to 2200), KCl riders x4 (1930-2230), MgSO4 2 g (1930), ECG, STAT labs 2130.** **Tue 0640 (Feld)**: glargine 20 (0730), lispro meal (0800/1200/1730) and correction (0800/1200/1730/2100) to Wed 0815, stop drip/D10/saline 0930, POC AC/HS/0300 + 1030, labs 1130, carbohydrate-consistent diet, activity, dietitian, glucose tabs/glucagon PRN. **1230 KCl ER 20 mEq PO (1300).** 1300 transfer (1400), VS q4h, Wed labs. **Tue 1630 (start Wed 0815)**: patient-managed pump (due 0815/1200/1730 Wed), lispro pen backup PRN, bedside ketone checks. Wed 1000 case management; 1300 discharge prescriptions; 1500 Thu BMP. **Thu 0050** recheck glucose + ketones 0300. **Thu 0640** discharge order.

## Devices
PIV 18 g left forearm (Mon 0045; saline, insulin, D10; saline lock from Tue 0930; stays). PIV 20 g right antecubital (Mon 0050; riders and IV push; **removed Tue 1400**). Cardiac monitor (Mon 0700; **removed Tue 1400**). Patient's own **Dexcom G7** back of the right upper arm (placed 12/08, trends only). **Pump infusion set right lower abdomen (Wed 0815; removed Thu 0030, kinked)**; **new set left upper abdomen (Thu 0030)**.

## Notes (time-gated)
ED triage 0050; ECG 0135; ED provider 0430; H&P 0615; ED RN 0640; handoff 0650; pharmacy 0830; hospitalist 1015; endocrine consult 1145; hospitalist 1540 (soda, K 3.6); ECG 1945; **night event 2015 (K 3.3, insulin held)**; night 2230 (restart); night 0630 Tue (resolved); endocrine transition 0640; hospitalist 1000; educator 1 1100; transfer 1340; social work (SBIRT, AUDIT-C 7) 1500; dietitian 1530; endocrine pump plan 1630; **night event 2045 (low 64)**; endocrine 0730 Wed; educator 2 (teach-back) 0930; pharmacy discharge 1400; case management 1430; hospitalist 1600; **night event 0115 Thu (kinked cannula)**; night 0620; endocrine discharge 0650.

## Stickies
Potassium peripheral rule; dextrose line; pump stays off; transition plan (Tue 0640); meal insulin when he might not eat (Tue 2045); pump restart + unexplained-high rule (Wed 0815).

## Rebuild
`python3 casestudy/cases/dka2_jordan/gen/ecg/make_ecgs.py` (ECGs only), `node casestudy/cases/dka2_jordan/gen/assemble.js`, then `node tools/make-prebuilt.js`. `node gen/physiology.js` prints the anion gaps, corrected sodium, osmolality, Winter's check, glucose fall rates and I&O totals; `node gen/infusions.js` prints the saline, D10, rider and insulin volumes per block.

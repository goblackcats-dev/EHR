# DKA patient 1 of 7: Maya Thompson, new-onset type 1 diabetes in severe DKA (single source of truth)

Simulation: **Mon 2026-12-07 07:00 to Thu 2026-12-10 07:00 (72 h)**. Major checkpoints at every shift change: **Mon 0700, Mon 1900, Tue 0700, Tue 1900, Wed 0700, Wed 1900, Thu 0700** (the "End of shift" button jumps to the next one). The instructor may also step in 1-hour or 4-hour jumps; everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md`.

- **Vital signs are in the chart ONLY up to the 0700 arrival set.** Later vitals come from the bedside monitor (monitor.html `DKA1` rows, MRN SIM-40501) and the students chart them.
- Baseline nursing assessment: ED 0210 and PICU 0700 only.
- **Point-of-care glucose IS in the chart, time-gated** (the meter docks to the EHR): hourly on the insulin infusion, then before meals, bedtime and 0300. The instructor reads the same values aloud when students "check" at the bedside.
- MAR: ED doses and infusions started in the ED are charted `given`; infusions running at 0700 show "0700 Running" (checked at the handoff). **Every dose after Mon 0700 is `due`** (students give it). Infusion rate changes after 0700 (two-bag ratio, insulin) are made and charted by the students per the protocol orders; the provider orders that change rates are time-gated.
- Labs, notes, orders, devices, I&O, problems and stickies are time-gated. Orders placed before their start show "Pending" until the start time.

## Patient
- **Maya Thompson**, 16-year-old girl, DOB **2010-08-19**, MRN **SIM-40501**, she/her. Height 163 cm, **weight 48.6 kg** (ED; dosing weight for the whole stay), BMI 18.3. Sports physical 08/10/2026: 54.2 kg (lost 5.6 kg, about 10%). **No known drug allergies. Full Code.** Immunizations up to date (influenza October 2026).
- Junior (11th grade) at Westbrook High School, honor roll, club volleyball, babysits, learner's permit. Finals next week.
- Family: mother **Danielle Thompson** (44, school cafeteria manager; insurance through her school district job), father **Kevin Thompson** (46, long-haul truck driver; driving home from Ohio, **arrives Mon 2200**), brother **Eli** (11, with the maternal grandmother). Maternal aunt Hashimoto; paternal grandfather type 2 diabetes.
- Unit: **PICU, room PICU-4** (Mon 0700 - Tue 1500), then **Pediatrics 5 North (adolescent unit), room 5N-12** from **Tue 1500**.
- People: ED physician **N. Adeyemi, MD**; ED RN **C. Huang, RN** (second checker M. Ortiz, RN); PICU attending days **E. Whitford, MD**; PICU attending nights **J. Kowalski, MD**; pediatric endocrinology **R. Banerjee, MD**; pediatric hospitalist days **B. Osterman, MD**, nights **S. Iverson, MD**; pharmacist **V. Shah, PharmD**; diabetes educator **H. Lindgren, RN, CDCES**; dietitian **A. Fairbanks, RD**; social worker **D. Mensah, LCSW**; child life **K. Rios, CCLS**; case manager **P. Albright, RN CM**; radiology D. Park, MD; school nurse R. Delgado, RN. Unit RN notes are NOT pre-written (the students are the RNs).

## Story before the unit
About 5 weeks of polydipsia (2-3 large regular sports drinks a day), polyuria, nocturia, one bedwetting, fatigue, weight loss. Sat 12/5 belly ache and nausea; Sun 12/6 from 0900 vomited 6 times; Sunday evening deep fast breathing and drowsy.
**ED (arrival Mon 0205)**: triage 0210 T 99.1, HR 134, BP 108/64, RR 32 Kussmaul, SpO2 99% RA, pain 6, GCS 14 (E3 V5 M6), weight 48.6 kg, POC glucose HI (0225). 0220 IV left AC 20 g + labs (antibodies before insulin); 0225 IV right forearm 20 g. 0230 emesis 150 mL. 0235 ondansetron 4 mg. **0240-0310 0.9% saline 500 mL (10 mL/kg)**, one bolus only (poor perfusion, not shock). 0300 ECG (peaked T). **0315 0.9% saline 150 mL/h** (no K: K 5.6, not voided). 0330 void 350 mL (UA). **0400 regular insulin 0.1 unit/kg/h = 4.9 units/h, no bolus** (75 min after fluids began). 0530 two-bag ordered (K 4.7, voiding) -> **0545 Bag A 150 mL/h, Bag B 0**. 0610 void 400 mL. PICU accepted 0520; H&P 0630; handoff 0655; PICU 0700.
ED vitals in the chart: 0210 (above), 0315 HR 126, 112/66, RR 30; 0500 HR 122, 114/68, RR 28; 0615 HR 120, 112/70, RR 28, T 98.8.

## Fluid and insulin math (state it the same everywhere)
- Maintenance (Holliday-Segar, 48.6 kg): 1,000 + 500 + 20 x 28.6 = 2,072 mL/day = **86 mL/h**.
- Deficit 8% (severe DKA): 0.08 x 48.6 = **3,900 mL**. Minus the 500 mL bolus, over 48 h: 3,400 / 48 = **71 mL/h**. Total 157 -> about **150 mL/h overall**: normal saline 150 mL/h until potassium can start (0315-0545), then **two-bag 125 mL/h + potassium riders** (riders add about 25-50 mL/h on average; overall 150-175 mL/h = 3.1-3.6 mL/kg/h, about 2 x maintenance at most). Cut by one-third at **1145 Mon** (cerebral edema): **two-bag 70 mL/h** (overall with riders about 110-140 mL/h), kept until the two-bag stops. Exact volumes: `node gen/infusions.js`.
- Insulin 0.1 unit/kg/h = 4.86 -> **4.9 units/h**; 0.075 = **3.6 units/h** (from Tue 0310); minimum 0.05 = 2.4 units/h.
- **Potassium: peripheral rule (instructor, whole DKA series).** 40 mEq/L is the central-line strength cap. Maya has peripheral IVs only, so **no potassium in the two-bag fluids**; potassium goes in as **riders, no more than 10 mEq per hour, one at a time**: **KCl 10 mEq/100 mL over 1 h** (10 mEq/h = 0.2 mEq/kg/h) and **potassium phosphate 5 mmol (7.3 mEq K) in 100 mL over 2 h** (3.7 mEq K/h; phosphate 0.05 mmol/kg/h). Table by the 4-hour potassium (only while voiding): 5.5+ none; 4.5-5.4 = 10 mEq per cycle; 3.5-4.4 = 20 mEq (one may be the phosphate rider while phos under 3.0); under 3.5 = call (usually 4 KCl riders back to back, then recheck). While a rider runs the two-bag total is lowered (125 -> 75 with KCl, 100 with phosphate; after 1145: 70 -> 40 with KCl, 60 with phosphate). Maintenance after the transition: D5 0.45% NaCl with **KCl 20 mEq/L** (allowed peripherally; no riders with it).
- **Rider schedule** (gen/infusions.js): KCl 0545 (ED, given; K 4.7); KCl 0930 + K phos 1030-1230 (K 3.9, phos 2.6); KCl 1300 and 1500 (K 3.5, spaced to limit volume); **KCl x4 1730, 1830, 1930, 2030 (K 3.3: order 1725)**; K phos 2130-2330 (order 1725; phos 1.8); KCl 2330 (K 3.6); K phos 0130-0330 + KCl 0330 (K 3.8, phos 1.9); K phos 0530-0730 + KCl 0730 (K 3.9, phos 2.4). Total about 139 mEq potassium (12 KCl + 4 phosphate riders) and 20 mmol phosphate; never more than 10 mEq/h. Only the ED rider is charted given; the 1725 riders are due; the others are given by the students per the protocol (PRN orders).
- Mannitol 0.5 g/kg = 24 g = **120 mL of 20%** (1 g/kg = 48 g); 3% saline 2.5-5 mL/kg = 120-240 mL; dextrose 10% 2 mL/kg = 100 mL; ondansetron 4 mg (0.1 mg/kg, max 4); acetaminophen 650 mg (13 mg/kg); glucagon 1 mg IM (over 25 kg); nasal glucagon 3 mg.
- **Two-bag table** (total rate unchanged): glucose 300+ = A 100% / B 0%; 250-299 = 50/50 (D5); 200-249 = A 25% / B 75% (D7.5); 150-199 = B 100% (D10); under 150 on D10 = call. Total 125 mL/h (70 from 1145), lower while a rider runs (same ratio). Changes: **D5 0905**, **D7.5 1105**, **D10 1505**.
- Corrected sodium uses **1.6 per 100 mg/dL** glucose over 100 (ADA; ISPAD uses 2). Effective osmolality = 2 x Na + glucose/18.
- Subcutaneous plan (endocrinology Tue 0640): estimated total daily dose 0.9-1 unit/kg = 44-48 units. **Glargine 20 units** (0.41 unit/kg, 40-45% basal) daily 0800, first dose **Tue 0745**; **lispro 1 unit/12 g** carbohydrate (500 rule: 500/44 = 11, rounded to 12) + **correction 1 unit/40 mg/dL above 150** (1800 rule), half-unit pens. **Insulin infusion and both bags stop Tue 0915** (1.5 h after glargine, about 1 h after the 0800 lispro). Wed 0650: **glargine 18 units**; bedtime/overnight correction only if over 250, half dose (1 unit/80 above 150).

## Chemistry and gases (collected / result times)
Columns: Na, K, Cl, CO2, BUN, Cr, glucose, Ca, Mg, phos | anion gap | BHB | venous pH / pCO2 / HCO3 | corrected Na. Gas results 15 min, BMP 45 min, BHB 55 min after collection (STAT: gas 10, BMP 25, BHB 35).
| Collected | Results | Na | K | Cl | CO2 | BUN | Cr | Glu | Ca | Mg | Phos | AG | BHB | pH | pCO2 | HCO3 | corr Na |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon 0220 (ED) | gas 0235, BMP 0300, BHB 0315 | 131 | **5.6** | 98 | **5** | 28 | **1.3** | **612** | 9.6 | 2.4 | 6.8 | **28** | **7.8** | **7.04** | 16 | 4.2 | 139.2 |
| Mon 0430 (ED) | 0445 / 0515 / 0525 | 132 | 4.7 | 101 | 6 | 26 | 1.2 | 520 | 9.2 | 2.2 | 5.1 | 25 | 7.1 | 7.07 | 17 | 4.8 | 138.7 |
| Mon 0830 | 0845 / 0915 / 0925 | 135 | 3.9 | 105 | 7 | 22 | 1.0 | 318 | 8.9 | 2.0 | 2.6 | 23 | 5.2 | 7.14 | 19 | 6.2 | 138.5 |
| **Mon 1140 STAT** | 1150 / 1205 / 1215 | 134 | **3.5** | 106 | 9 | 20 | 0.9 | 248 | 8.7 | 1.9 | 2.0 | 19 | 4.1 | 7.18 | 21 | 7.6 | **136.4 (falling)** |
| Mon 1630 | 1645 / 1715 / 1725 | 137 | **3.3** | 109 | 11 | 17 | 0.8 | 196 | 8.6 | 1.8 | **1.8** | 17 | 2.6 | 7.23 | 24 | 9.7 | 138.5 |
| Mon 2030 | 2045 / 2115 / 2125 | 139 | 3.6 | 111 | 13 | 14 | 0.7 | 174 | 8.6 | 1.8 | **1.6** | 15 | 1.6 | 7.27 | 27 | 12.0 | 140.2 |
| Tue 0030 | 0045 / 0115 / 0125 | 140 | 3.8 | 112 | 15 | 12 | 0.7 | 160 | 8.7 | 1.8 | 1.9 | 13 | 0.9 | 7.29 | 29 | 13.5 | 141.0 |
| **Tue 0430** | 0445 / 0515 / 0525 | 140 | 3.9 | 112 | **18** | 10 | 0.6 | 148 | 8.8 | 1.8 | 2.4 | **10** | **0.4** | **7.33** | 33 | 16.8 | 140.8 |
| Tue 1300 | BMP 1345, BHB 1355 | 139 | 3.7 | 108 | 21 | 8 | 0.6 | 212 | 9.0 | 1.8 | 2.6 | 10 | 0.3 | | | | |
| Wed 0500 | 0545 | 138 | 4.0 | 105 | 23 | 9 | 0.6 | 118 | 9.2 | 1.9 | 3.2 | 10 | | | | | |
| Thu 0500 | 0545 | 139 | 4.2 | 104 | 25 | 10 | 0.6 | 126 | 9.4 | 2.0 | 3.8 | 10 | | | | | |
- **DKA resolved Tue 0430** (pH 7.30 or more, bicarbonate 18 or more, BHB under 0.6, gap 12 or less). Every pCO2 is within Winter's formula (1.5 x HCO3 + 8, +/- 2). pH values match Henderson-Hasselbalch.
- Hyperchloremia from saline: Cl 112 with gap 13 at 0030 Tue = non-gap acidosis keeps the bicarbonate lower than the gap explains.
- eGFR (bedside Schwartz 0.413 x 163 / Cr): 52, 56, 67, 75, 84, 96, 96, 112, 112, 112, 112.
- Other: lactate 2.4 (0220/0235); ionized Ca 1.16 (1630/1645), 1.18 (Tue 0430/0445); measured osmolality 309 (0220/0300), 292 (1140/1205); lipase 41; albumin 4.9 (Mon), 3.9 (Wed 0500).
- CBC 0220 (res 0300): WBC 18.4, Hgb 15.1, Hct 45.2, Plt 342, neutrophils 84%, lymphocytes 10%. Tue 0430 (res 0515): 9.8, 12.6, 37.4, 248, 58%, 31%.
- Urine 0330 (res 0400): SG 1.030, glucose over 1,000 (4+), ketones large (80), protein trace, blood/LE/nitrite negative, **hCG negative**.
- **HbA1c 12.8%** (res Mon 0900). TSH 2.1, free T4 1.0 (res Mon 0900). **C-peptide 0.2** (res Tue 1000). **GAD65 186, IA-2 42, insulin autoantibody 0.9 (positive), ZnT8 pending; tTG-IgA 1.0 (negative), total IgA 168** (all res **Wed 1400**). All drawn 0220 Mon, before insulin.
- ECGs: **0300 (res 0310)** sinus tach 128, PR 136, QRS 82, QT/QTc 310/452, **peaked T V2-V4**. **1730 (res 1745)** sinus 98, PR 140, QRS 82, QT/QTc 360/460, **flattened T, U waves V2-V3**. Both Chart Review > Cardiology with images (gen/ecg/make_ecgs.py).
- CT head 1255 (res 1325): no acute abnormality, no CT evidence of edema.

## Point-of-care glucose (all in the chart at their times)
Mon: 0225 HI, 0330 574, 0400 552, 0500 497, 0600 441, **0700 386**, 0800 334, 0900 287, 1000 262, 1100 241, 1130 236, 1200 229, 1300 214, 1400 206, 1500 198, 1600 192, 1700 194, 1800 186, 1900 181, 2000 176, 2100 172, 2200 175, 2300 168. Tue: 0000 164, 0100 158, 0200 154, **0300 147**, 0400 152, 0500 156, 0600 161, 0700 158, 0745 154, 0900 172, 1000 196, **1130 268**, 1730 214, 2100 248. Wed: **0230 64**, 0245 92, 0315 118, 0730 142, 1130 176, 1600 104 (after a walk), 1730 188, 2100 206. Thu: 0215 132 (CGM said 54), 0300 126, 0645 124.
On insulin before dextrose the fall is 47-56 mg/dL/h (goal 50-75, never over 100).

## Insulin doses the students should calculate (meal + correction, half-unit rounding)
Tue 0800: 60 g -> 5 + 0 (154) = **5 units**. Tue 1200: 70 g -> 6 + 3 (268) = **9**. Tue 1730: 75 g -> 6 + 1.5 (214) = **7.5** (Maya's first self-injection). Tue 2100: correction only (248) -> **2.5** (old rule) -> low 64 at 0230. Wed 0800: 60 g -> 5 + 0 (142) = **5**; glargine **18**. Wed 1200: 70 g -> 6 + 0.5 (176) = **6.5** (Maya). Wed 1730: 75 g -> 6 + 1 (188) = **7** (mother). Wed 2100: 206 -> **no correction** (new rule).

## Intake and output (4-hour blocks, `periodEnd: true`; labels Oral, IV fluid, IV med, Urine, Emesis)
| Block (ends) | Oral | IV fluid | IV med | In | Urine | Emesis | Out |
|---|---|---|---|---|---|---|---|
| ED 0205-0700 | 0 | 981 (NS 500 + 375 + two-bag 106) | 117 (insulin 15, ondansetron 2, KCl rider 100) | 1,098 | 750 | 150 | 900 |
| Mon 1100 | 0 | 438 | 145 (insulin 20, riders 125) | 583 | 560 | 0 | 560 |
| Mon 1500 | 0 | 265 | 317 (insulin 20, mannitol 120, ondansetron 2, riders 175) | 582 | 570 | 100 | 670 |
| Mon 1900 | 0 | 205 | 270 (insulin 20, riders 250) | 475 | 240 | 0 | 240 |
| Mon 2300 | 120 | 190 | 345 (insulin 20, riders 325) | 655 | 230 | 0 | 230 |
| Tue 0300 | 120 | 230 | 220 (insulin 20, riders 200) | 570 | 220 | 0 | 220 |
| Tue 0700 | 60 | 230 | 215 (insulin 15, riders 200) | 505 | 230 | 0 | 230 |
| Tue 1100 | 360 | 228 (two-bag 123 + maintenance 105) | 133 (insulin 8, riders 125) | 721 | 380 | 0 | 380 |
| Tue 1500 | 600 | 240 | 0 | 840 | 420 | 0 | 420 |
| Tue 1900 | 600 | 120 | 0 | 720 | 450 | 0 | 450 |
| Tue 2300 | 480 | 0 | 0 | 480 | 450 | 0 | 450 |
| Wed 0300 | 240 | 0 | 0 | 240 | 220 | 0 | 220 |
| Wed 0700 | 0 | 0 | 0 | 0 | 300 | 0 | 300 |
| Wed 1100 / 1500 / 1900 / 2300 | 480 / 600 / 600 / 480 | 0 | 0 | | 450 each | 0 | 450 each |
| Thu 0300 / 0700 | 0 / 120 | 0 | 0 | | 200 / 300 | 0 | |
Shift totals: Mon day in 1,640 / out 1,470; Mon night 1,730 / 680; Tue day 2,281 / 1,250; Tue night 720 / 970; Wed day 1,680 / 1,350; Wed night 600 / 950. Whole stay from ED: in 9,749 / out 7,570. Weights: 48.6 (Mon ED) -> **49.1 (Tue 0600) -> 49.4 (Wed 0600) -> 49.6 (Thu 0600)** (insensible losses are large with Kussmaul breathing; regain continues at home).

## Checkpoint story (monitor values = `DKA1` rows in monitor.html, lying)
| Time | Monitor | Patient / events | Released by then |
|---|---|---|---|
| **Mon 0700** | HR 118 sinus tach (T slightly tall), BP 114/70, RR 26 Kussmaul, SpO2 99% RA, T 98.9 | Drowsy GCS 14, fruity breath, belly ache 4/10; mother tearful. Insulin 4.9 u/h, Bag A 125 (no K in bags; ED KCl rider done) | ED labs 0220/0430, ECG peaked T, ED/H&P/handoff notes |
| (mid) 1045 / 1115 / **1130** / 1215 | 110, 116/70 / 100, 124/82 / **72, 134/92, SpO2 97, RR 20** / 96, 118/74 | Mild headache -> **cerebral edema signs 1130** (headache 7/10, vomits 100 mL, GCS 13) -> mannitol 24 g 1140, two-bag cut to 70 mL/h 1145, KCl riders 1300 and 1500, CT 1255 normal; better by 1215 | 0830 labs; A1c 12.8; STAT 1140 labs (corr Na 136) |
| (mid) 1700 | 98, 112/68, RR 22, **flat T + U waves** | K 3.3, phos 1.8 -> **KCl 10 mEq riders x4 1730-2130** (peripheral max 10 mEq/h), then K phos 2130; ECG 1730 | 1630 labs, ECG 1745 |
| **Mon 1900** | 96, 112/68, RR 22, T 98.6, flat T/small U | Headache gone, GCS 15, thirsty; D10 since 1505; glucose 181 | PICU 1750 note, SW 1430, CT 1325 |
| (mid) Tue 0300 | 82, 108/64, RR 18 | Sips of water since 2000; father arrived 2200; **glucose 147 on D10** -> insulin 3.6 u/h 0310 | 2030 and 0030 labs (gap 13, BHB 0.9) |
| **Tue 0700** | 84, 112/68, RR 16, T 98.4, normal T | **DKA resolved (0430)**; hungry; transition orders: glargine 0745, lispro 0800, drip off 0915 | 0430 labs, endocrine 0640 transition note |
| (mid) Tue 1500 | 80, 114/70 | Glucose 268 before lunch (rebound after the drip); transfer to 5N-12 1500; first self-injection at 1730 | C-peptide 0.2 (1000), 1300 labs, educator/child life/transfer notes |
| **Tue 1900** | 82, 114/72, RR 16 | Parents learning; bedtime glucose 248 at 2100 -> 2.5 units correction (old rule) | hospitalist 1600, RD 1700 |
| (mid) Wed 0230 / 0300 | **112, 124/76** / 86, 114/70 | **Night low 64**: sweaty, nightmare -> 15 g juice -> 92 -> snack -> 118 | night event note 0325 |
| **Wed 0700** | 76, 110/68, RR 16 | Glargine 18; new bedtime rule; teaching day (CGM 1100, glucagon, ketones, school) | Wed 0500 labs, endo 0650 |
| **Wed 1900** | 78, 112/70 | Antibodies positive (1400); eating-concern flag (RD 1330); walk -> 104 at 1600; discharge planned | educator, RD, endo addendum, SW, CM, pharmacy notes |
| **Thu 0700** | 72, 110/66, RR 14 | CGM compression low 0210 (CGM 54, fingerstick 132); ready for discharge | Thu 0500 labs, night note 0620, endo 0655, discharge order 0645 |

## Orders (gated by `orderedAt`; `stoppedEarly` hides unplanned stops until they happen)
ED: ondansetron 0235; NS bolus 0240; NS 150 mL/h 0315-0545; insulin infusion 0400 (to Tue 0915); two-bag (no potassium) 0545 (to Tue 0915); KCl 10 mEq rider 0545 (given). PICU 0630 (Kowalski): admit, Full Code, VS q1h + monitor (to Tue 1500), **neuro checks q1h** (to Tue 1000), strict I&O/daily weight, bed rest HOB 30 (to Tue 0640), NPO except ice chips (to Mon 1945), POC q1h (to Tue 0915), labs q4h (0830-0430), **peripheral potassium protocol** with KCl and potassium phosphate rider PRN orders, endocrine and pharmacy consults, **mannitol PRN, 3% saline PRN**, ondansetron PRN, acetaminophen PRN (not for headache), D10 PRN. Mon 0930 social work; 1015 diabetes education, dietitian. **1135 mannitol STAT (due 1135)**, STAT labs; **1145 two-bag 70 mL/h**; 1150 CT head. 1720 ECG; **1725 KCl 10 mEq riders x4 (due 1730, 1830, 1930, 2030) and potassium phosphate 5 mmol (due 2130)**. 1945 sips of water. **Tue 0310 insulin 3.6 units/h.** **Tue 0640 (Banerjee/Whitford)**: glargine 20 (due 0745), lispro meal (due 0800/1200/1730 Tue and Wed), lispro correction (due 0800/1200/1730/2100 Tue), stop drip 0915, D5 0.45% NaCl + KCl 20 at 60 mL/h 0915-1700, POC AC/HS/0300 + 1000, labs 1300, carbohydrate-consistent diet, activity, neuro q4h from 1000, glucose tablets PRN, glucagon IM PRN. 0830 child life. 1400 transfer order (1500). 1500 VS q4h (5 North), Wed 0500 labs. **Wed 0255** no bedtime correction (Iverson). **Wed 0650** glargine 18 (due 0800), revised correction (due 0800/1200/1730/2100), CGM, discharge teaching, Thu BMP. 0900 case management. 1500 discharge prescriptions. 1530 psychology referral. **Thu 0645** discharge order.

## Devices
PIV 20 g left AC (Mon 0220; two-bag + insulin + potassium riders; saline lock after Tue 1700; stays to discharge). PIV 20 g right forearm (Mon 0225; labs/IV push; **removed Tue 1700**). Cardiorespiratory monitor (Mon 0700; **removed Tue 1500**). **Dexcom G7 CGM, back of the left upper arm (Wed 1100)**.

## Notes (time-gated)
ED triage 0230; ECG 0310; ED provider 0545; H&P 0630; ED RN 0645; handoff 0655; pharmacy 0815; PICU 0930; endocrine consult 1015; **PICU cerebral edema event 1225**; CT 1325; social work 1430; ECG 1745; PICU 1750; PICU night 2140; night event 0330 Tue; night 0610; endocrine transition 0640; PICU 1030 (HEADSS); educator 1330; child life 1400; transfer summary 1440; hospitalist accept 1600; dietitian 1700; night hypoglycemia 0325 Wed; endocrine 0650; educator 1230; dietitian 1330 (DEPS-R); endocrine antibody addendum 1500; social work 1530; case management 1600; hospitalist 1640; pharmacy 1700; night 0620 Thu; endocrine discharge 0655.

## Stickies
Cerebral edema watch; two-bag table; potassium; transition plan (Tue 0640); night low and bedtime rule (Wed 0650); CGM vs fingerstick (Wed 1100).

## Rebuild
`python3 casestudy/cases/dka1_maya/gen/ecg/make_ecgs.py` (ECGs only), `node casestudy/cases/dka1_maya/gen/assemble.js`, then `node tools/make-prebuilt.js`. `node gen/physiology.js` prints the anion gaps, corrected sodium, Winter's check, glucose fall rates and I&O totals.

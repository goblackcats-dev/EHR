# DKA patient 6 of 7: Samuel Okafor, DKA precipitated by a silent NSTEMI (single source of truth)

Simulation: **Mon 2026-11-16 07:00 to Thu 2026-11-19 07:00 (72 h)** (Day 1 = Mon 11/16 ... Day 4 = Thu 11/19). ED arrival Mon 0130 (the source gives no calendar date: Mon 11/16/2026 was chosen so he is 45 on the DOB of 1981-08-14 and so the dates do not overlap dka1-5). Checkpoints at every shift change: **Mon 0700, Mon 1900, Tue 0700, Tue 1900, Wed 0700, Wed 1900, Thu 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md` (potassium rule and clot-prophylaxis rule). Provenance: the clinical design was written by another AI and kept unchanged in `SOURCE_chatgpt_design.md`; this file records every number as built and the changes made to it (list at the end). Instructor-only material stays in this file, `INSTRUCTOR_NOTES.md` and `REVIEW.md`, never in the chart.

- **Vital signs are in the chart ONLY up to the 0700 arrival set** (ED 0130, 0230, 0400, 0530 and the 0700 step-down set; Celsius converted to F). Later vitals come from the bedside monitor (monitor.html `DKA6` rows, MRN SIM-40506) and the students chart them. Notes contain no numeric vital signs after 0700 (ECG rates, the arrival set quoted in the H&P, and thresholds such as "systolic BP under 100" excepted).
- Baseline nursing assessment: ED 0130 and step-down 0700 only.
- **Point-of-care glucose IS in the chart, time-gated** (the design's hourly log 0130-2130, then AC/HS; two added values listed below).
- MAR: ED doses and infusions started in the ED are `given`; regular insulin 8 units/h, heparin 960 units/h and 0.45% NaCl + KCl 20 mEq/L 150 mL/h show "0700 Running". **Every dose after Mon 0700 is `due`** (the one exception is the ticagrelor 180 mg load given on the cath-lab table at 1215). The insulin hold (0715), restart (1130), reduction (1915), the carrier swaps and the rider starts are student actions driven by time-gated protocol orders.
- Labs, notes, orders, devices, I&O, problems and stickies are time-gated; due-dose text never quotes a result that has not yet released (checked by script).

## Patient
- **Samuel Okafor**, 45-year-old man, DOB **1981-08-14**, MRN **SIM-40506** (the source's MRN is not used), he/him. Height 178 cm, **weight 80.0 kg** (admission; dosing weight for the whole stay; usual dry weight 83.5 kg, a 3.5 L deficit from osmotic diuresis), BMI 25.2. **Full Code.** Cardiac Step-Down Unit, **room CSD-412** (source: Bed 412).
- **Allergy/intolerance field: "Lisinopril - intolerance (dry cough)"**, reaction "persistent dry cough; not a true allergy (no angioedema or anaphylaxis)", severity mild. No drug, food or iodinated-contrast allergy. (A custom chip, not a standard allergy chip, so the Pre-Built editor shows it as custom.)
- **Type 1 diabetes since age 14 (31 years)**, injections (glargine 24 units at 2100, lispro 6 units with meals + 1 unit per 50 mg/dL over 150), no pump or CGM. HbA1c 8.9% (8.2% six months ago). No DKA in 10 years. Dyslipidemia (atorvastatin 20 mg, misses 3-4 doses a week), mild non-proliferative retinopathy, GERD (calcium carbonate, six tablets in the last day). No prior cardiac history; diabetic autonomic neuropathy blunts ischemic pain.
- Family: father fatal STEMI at 48 (hypertension, smoker); mother 71 (hypertension, osteoarthritis); paternal uncle CABG at 52; sister 41 healthy. Social: city bus driver for 11 years with a commercial driver license (passenger endorsement and the insulin-treated-diabetes medical certification: chart text says "federal commercial driver medical certification"); married to **Grace** (42, teacher, emergency contact); **daughter Naomi (12)** (source name Maya collides with series patient 1) and son David (9); smokes 1 pack/day for 25 years (first cigarette within 30 minutes of waking; last cigarette about 0030 on Mon, so 52 hours by Wed 0530); 1-2 beers on weekends.
- People (fictional; unit RN notes are NOT pre-written; students are the RNs): ED physician **Gideon Marsh, MD**; ED RN **Odessa Linton, RN**; hospitalist days **Fabian Pelletier, MD**; nocturnist **Ezra Bouchard, MD**; endocrinology **Iris Ashcroft, MD**; cardiology **Lorenzo Vitale, MD**; cardiology fellow **Anneliese Vogt, MD**; interventional cardiology **Rafael Quintero, MD**; ECG and echo reader **Wesley Haldane, MD**; pharmacist **Tabitha Ng, PharmD**; dietitian **Corinne Hadley, RDN, CDCES**; cardiac rehabilitation **Magnus Eriksen, DPT**; tobacco treatment **Percival Dunne, RRT, CTTS**; social work **Yolanda Prescott, LCSW**. None repeats any other case's staff first or last name (grepped across all cases and notes; the source's Delacroix/Westbrook-type collisions found while building were renamed), none equals a series patient's first name. (Hypermag has a staff surname Okafor: the patient surname was given by the design.)

## Story before the unit (ED Mon 0130-0700)
36 hours before arrival (finishing his afternoon route) a dull persistent epigastric ache, heavy fatigue and some sweating (a silent NSTEMI, blamed on indigestion). The morning before: nausea and anorexia; he skipped his lispro (believing insulin without food is dangerous) and the 2100 glargine 24 units; by 2330 two bilious vomits, polyuria, thirst; at 0100 his wife saw deep fast breathing and a fruity odor.
| Time | ED event |
|---|---|
| 0130 | Triage: Kussmaul 26, glucose meter "HIGH", two 18 g IVs (left forearm, right antecubital), telemetry; resuscitation bay 3 |
| 0135 | Vomited about 150 mL (bilious) |
| 0140 | VBG, BMP, Mg, phos, BHB, hs-troponin I, hepatic and lipid panels, CBC, HbA1c, urinalysis collected; **ECG** acquired (0150 read: 1.5 mm ST depression V4-V6) |
| 0145 | NS 1,000 mL over 1 h (0145-0245); aspirin 324 mg chewed; ondansetron 4 mg IV |
| 0210 | Labs released: glucose 540, pH 7.21, HCO3 12, gap 24, BHB 5.8, **K 5.2**, hs-TnI 185 |
| 0215 | **Regular insulin 8 units/h (0.1 x 80), no bolus** (K 5.2 is above 3.5; no potassium yet) |
| 0245 | 0.45% NaCl 200 mL/h (corrected Na 138.0); cardiology and endocrinology called |
| 0430 -> 0450 | Repeat labs: K 4.3, gap 22, pH 7.25, hs-TnI 640 (0455) |
| 0500 | Cardiology by telephone: **heparin bolus 4,000 units (60 units/kg = 4,800, capped at the 4,000-unit maximum) and 960 units/h (12 units/kg/h; maximum 1,000)**; atorvastatin 80 mg; beta-blocker deferred; **0.45% NaCl + KCl 20 mEq/L at 150 mL/h** (3 mEq/h) |
| 0630 | Epigastric ache 1/10, nausea gone; ED RN note |
| 0655 | ED RN handoff (SBAR): panel collected, PVCs occasional and increasing |
| 0700 | Arrival on CSD-412: **frequent unifocal PVCs 6-8/min** |
ED totals 0130-0700 (pre-shift; not added again to shift 1): IV fluid 1,750 (NS 1,000 + 0.45% NaCl 450 + 0.45% NaCl with K 300), IV med 83 (insulin 38 + heparin 23.2 incl. the 4 mL bolus + ondansetron 2 + flushes 20), oral 50 -> **intake 1,883**; urine 1,350 + emesis 150 -> **output 1,500**; net **+383**. Weight 80.0 kg.

## Vital signs (ED and arrival only; Celsius from the design converted to F)
| Time | Temp | HR | BP | RR | SpO2 | Rhythm / note |
|---|---|---|---|---|---|---|
| Mon 0130 ED | 36.8 C = 98.2 F | 114 | 148/92 | 26 Kussmaul | 97% RA | sinus tachycardia, ST depression V4-V6, ache 4/10 |
| 0230 | 36.9 C = 98.4 F | 108 | 142/88 | 24 | 98% | insulin running, nausea improving, ache 3/10 |
| 0400 | 36.8 C = 98.2 F | 102 | 136/84 | 22 | 98% | 1.0 mm ST depression, ache 2/10 |
| 0530 | 36.7 C = 98.1 F | 98 | 132/80 | 20 | 99% | heparin and potassium fluid running (design pain not given: 2/10) |
| 0700 arrival | 36.8 C = 98.2 F | 96 | 134/82 | 20 | 98% | **frequent PVCs 6-8/min**, flat T, U waves, 1.0 mm ST depression (the source's ED table says "occasional isolated PVC" at 0700 and its checkpoint says frequent: the ED handoff at 0655 says occasional and increasing; the 0700 set says frequent) |

## Labs (collected -> released; Na, K, Cl, HCO3 mmol/L; BUN, Cr, glucose, phos, Mg mg/dL; hs-TnI ng/L, anti-Xa IU/mL)
All gases are **venous** (design); pCO2 is the design's arterial-equivalent value (chart reference "35-45, reported as arterial-equivalent; venous 41-51"). HCO3 is the serum total CO2 used for every anion gap.
| Collected -> released | Na | K | Cl | HCO3 | BUN | Cr | Glu | AG | pH | pCO2 | BHB | hs-TnI | Xa | Phos | Mg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon 0140 -> 0210 | 131 | 5.2 | 95 | 12 | 28 | 1.35 | 540 | 24 | 7.21 | 27 | 5.8 | 185 | | 4.2 | 2.1 |
| 0430 -> 0450 (TnI 0455) | 134 | 4.3 | 98 | 14 | 25 | 1.25 | 380 | 22 | 7.25 | 30 | 4.2 | 640 | | 3.4 | 1.9 |
| 0655 -> **0710** | 136 | **3.3** | 103 | 16 | 21 | 1.15 | 235 | 17 | 7.29 | 33 | 2.6 | | | 2.6 | 1.8 |
| 1115 -> 1130 (TnI, Xa 1140) | 137 | 4.1 | 104 | 17 | 19 | 1.10 | 242 | 16 | 7.31 | 35 | 1.9 | **1,420** | 0.48 | 2.5 | 2.0 |
| 1530 -> 1545 | 138 | 4.0 | 104 | 19 | 17 | 1.02 | 195 | 15 | 7.34 | 37 | **1.1** | | | 2.7 | 2.0 |
| 1850 -> 1905 (TnI, Xa 1915) | 139 | 4.2 | 105 | 22 | 15 | 0.95 | 165 | 12 | 7.38 | 40 | **0.4** | 1,280 | 0.52 | 3.0 | 2.1 |
| Tue 0100 -> 0120 (anti-Xa only) | | | | | | | | | | | | | 0.55 | | |
| Tue 0645 -> 0700 (TnI, Xa 0715) | 139 | 4.3 | 104 | 24 | 14 | 0.92 | 142 | 11 | | | 0.2 | 890 | 0.54 | 3.3 | 2.1 |
| Tue 1845 -> 1900 (TnI 1915) | 140 | 4.2 | 105 | 25 | 13 | 0.90 | 158 | 10 | | | | 520 | | | 2.0 |
| Wed 0645 -> 0700 (TnI 0715) | 139 | 4.4 | 104 | 25 | 14 | 0.94 | 128 | 10 | | | | 310 | | 3.5 | 2.1 |
| Thu 0645 -> 0700 | 140 | 4.3 | 104 | 26 | 13 | 0.91 | 118 | 10 | | | | 140 | | 3.6 | 2.1 |
Also at 0140 -> 0210: HbA1c **8.9%**; WBC 13.8, Hgb 15.6, platelets 265; total cholesterol 248, LDL 162, HDL 34, triglycerides 260; hepatic panel (**added**: AST 28, ALT 34, alkaline phosphatase 82, bilirubin 0.7, albumin 4.3: the design lists the panel but no values). Urinalysis (voided 0200, released 0220): glucose 4+, ketones 3+ (design); nitrite and leukocyte esterase negative (added). CBC series (**added**, smooth fall after about 3.5 L of fluid; needed for the heparin and radial-site checks): WBC 13.8 / 9.9 / 8.7 / 8.2, Hgb 15.6 / 14.4 / 14.1 / 14.0, platelets 265 / 252 / 246 / 244 (ED, Tue, Wed, Thu 0645). Reference intervals follow the design (HCO3 22-29, Cl 98-106, creatinine 0.7-1.3, Mg 1.7-2.2, hs-TnI under 14, anti-Xa 0.30-0.70); K flagged critical below 3.4 (the design calls 3.3 critical).

**Arithmetic (`node gen/physiology.js` reprints it; `assemble.js` fails the build on any anion-gap mismatch)**
- Anion gap = Na - Cl - HCO3: 24, 22, 17, 16, 15, 12, 11, 10, 10, 10 (identical to the design). Delta-delta at 0140: gap rise 12 vs bicarbonate fall 12 (to 12 from 24) = 1.0: a pure anion-gap acidosis.
- Corrected sodium = Na + 1.6 x (glucose - 100)/100: **138.04**, 138.48, 138.16, 139.27, 139.52, **140.04**, then 139.67, 140.93, 139.45, 140.29 (design 138.0, 138.5, 138.2, 139.3, 139.5, 140.0). Normal corrected sodium: no HHS, 0.45% NaCl after the first liter is appropriate. Effective osmolality (2 x Na + glucose/18): 292.0, 289.1, 285.1, 287.4, 286.8, 287.2 ... 286.6; calculated with BUN/2.8: 302.0 -> 291.2.
- **Winter's formula (expected pCO2 = 1.5 x HCO3 + 8, +/- 2)**: 0140 expected 26 (24-28), measured 27; 0430 29 (27-31), 30; 0655 32 (30-34), 33; 1115 33.5 (31.5-35.5), 35; 1530 36.5 (34.5-38.5), 37; 1850 41 (39-43), 40: appropriate respiratory compensation at every draw (applied to the design's arterial-equivalent pCO2 values).
- Henderson-Hasselbalch (pH = 6.1 + log10(HCO3 / (0.03 x pCO2))) against charted pH: 7.27 vs 7.21, 7.29 vs 7.25, 7.31 vs 7.29, 7.31 vs 7.31, 7.33 vs 7.34, 7.36 vs 7.38: the first two differ by 0.06 and 0.04 (the design's numbers; serum total CO2 vs gas-derived bicarbonate); kept as given.
- Insulin: 80 x 0.1 = **8 units/h = 8 mL/h**; 80 x 0.05 = **4 units/h**; then 2 units/h; total regular insulin 38 + 2 + 31 + 4.5 = **75.5 units** (a second 100-unit bag is not needed). Glargine 22 units = **0.275 unit/kg** (home 24 units); estimated total daily dose about 43 units (glargine 24 + lispro about 6 x 3) = 0.54 unit/kg. Dextrose: D5 212.5 mL 0715-1130 (10.6 g) + 1,500 mL 1130-2130 (75 g) = **85.6 g**.
- **Heparin**: 60 units/kg x 80 = 4,800 -> **4,000 units** (maximum); 12 units/kg/h x 80 = **960 units/h** (maximum 1,000) of 25,000 units/250 mL (100 units/mL) = **9.6 mL/h**; 0500 Mon to 1030 Tue = 29.5 h: 28,320 units (283.2 mL) + the 4,000-unit bolus (4 mL of a 1,000 units/mL vial); the 250 mL bag lasts 26 h (second bag hung about 0700 Tue).
- Fluids vs 80 kg: NS 1,000 mL = 12.5 mL/kg in 1 h; ED IV fluid 1,750 mL = 21.9 mL/kg; 0.45% NaCl 200 mL/h = 2.5 mL/kg/h, then 150 mL/h = 1.9 mL/kg/h; D5 carrier 50 mL/h = 0.6 mL/kg/h with riders (total 150 mL/h including the riders = the cardiology ceiling); cath hydration 100 mL/h = 1.25 mL/kg/h. Whole-stay balance (ED + simulation) **+2,070 mL** (intake 11,070, output 9,000) against an estimated 3.5 L deficit; no weights supplied (see REVIEW questions).
- Potassium: **76.75 mEq IV total** Mon 0130-Wed 0700 (KCl 40 + carrier 36.75); maximum 10.0 mEq/h in any minute.

## POC glucose (mg/dL)
Mon 0130 HIGH (over 500), **0200 505, 0300 450, 0400 395, 0500 340, 0600 285, 0700 235**, 0800 240, 0900 245, 1000 248, 1100 244, 1130 242, 1200 230, 1300 218, **1400 208**, 1500 198, 1600 188, 1700 178, 1800 170, **1900 165**, 2000 172, 2100 162, 2130 156; **Tue** 0300 **146 (added)**, 0730 142, 1030 136, 1300 148, 1730 164, 2100 152; **Wed** 0730 128, 1200 144, **1345 152 (from the rehabilitation note; added)**, 1730 156, 2100 138; **Thu** 0730 118. The design's 0430 value (380) is the serum glucose of the 0430 panel. Fall rate: -55 mg/dL/h x4 and -50 (0200-0700, goal 50-75); +5, +5, +3 during the insulin hold (D5 at 50 mL/h); then -12, -10, -10, -10, -10, -8, -5 mg/dL/h on 4 units/h; no hourly fall over 100. Goal 150-200 once on dextrose (never below 150 while ketones persist).

## IV timeline and potassium (`node gen/infusions.js`)
| Time | Carrier fluid | Insulin | Potassium |
|---|---|---|---|
| 0145-0245 | NS 1,000 mL (bolus) | -- | 0 |
| 0245-0500 | 0.45% NaCl 200 mL/h | **0215: 8 units/h** | 0 |
| 0500-0715 | **0.45% NaCl + KCl 20 mEq/L 150 mL/h** | 8 | 3 mEq/h |
| 0715-1130 | **D5 0.45% NaCl, potassium-free, 50 mL/h** (corrected: source ran the 20 mEq/L bag at 150 mL/h alongside the riders = 13 mEq/h) | **HELD 0715-1130** | **KCl 10 mEq/h x4** (0715, 0815, 0915, 1015), carrier 0 = exactly 10 mEq/h |
| 1130-2130 | **D5 0.45% NaCl + KCl 20 mEq/L 150 mL/h** | **1130: 4 units/h**; 1915: 2 units/h; stops 2130 | 3 mEq/h (K goal 4.0 or higher) |
| Tue 0700-1900 | NS 100 mL/h (cath hydration) | -- | 0 |
- **Peripheral potassium rule**: maximum **10.0 mEq/h in every minute** (checked minute by minute in `gen/infusions.js` and `assemble.js`); **0 minutes with a KCl rider and a potassium-containing carrier**; no 40 mEq/L bag, no IV push, no parallel riders. The 20 mEq/L carrier returns only after the last rider and the recheck potassium (1130). Carrier and insulin on IV A (left forearm 18 g, separate pump channels with the riders); heparin alone on IV B (right antecubital 18 g, removed Tue 1035 before the right radial catheterization).
- **Insulin vs potassium thresholds**: K 5.2 (start insulin 0215), 4.3 (add 20 mEq/L carrier), **3.3 at 0710: HOLD** (0715), recheck at the end of rider 4 (collected 1115 from the opposite arm; released 1130 so the restart can be at 1130), **4.1: restart at 4 units/h with the prescriber's confirmation** (rule: 3.5 or higher AND prescriber review), 4.0, 4.2, then 4.3-4.4 with no further potassium. The hold lasts 4 h 15 min.
- Flushes (IV med, 10 mL each): ED 0150 and 0505; Mon 0830, 1120, 1530, 2135; Tue 1905; Wed 0800, 2000. Cath lab (Tue 1130): IV medicines and flushes 20 mL; iohexol 350 contrast 85 mL (counted as IV med, since the standard rows have no contrast row).

## Orders (source section 4, cleaned and corrected)
| Written | Order |
|---|---|
| Mon 0130-0245 | Code status; two 18 g IVs; telemetry with ST monitoring and strict I&O; ECG 0140; initial labs; NS 1,000 mL; aspirin 324 mg; ondansetron PRN (QT caution); **insulin infusion 8 units/h**; **potassium safety protocol (corrected)**; POC hourly; 0.45% NaCl 200 mL/h; consults |
| Mon 0455-0500 | 0.45% NaCl + KCl 20 mEq/L 150 mL/h; **heparin bolus 4,000 units and 960 units/h** (anti-Xa schedule, platelets, hold at 1030 Tue); atorvastatin 80 mg |
| Mon 0712 (0700 admit) | Admit to step-down; **K 3.3: HOLD insulin, K-free D5 0.45% NaCl 50 mL/h, four KCl riders 0715-1015, recheck at 1115**; telemetry/notify thresholds and the **150 mL/h total IV fluid ceiling**; ECG 0715; bedrest with commode; clear liquids; lab schedule |
| Mon 0935 | Cardiology: cath booked Tue 1100 (right radial); **nitroglycerin 0.4 mg SL PRN with hold parameters (SBP under 100, HR under 50, PDE-5 inhibitor within 48 h; STAT ECG and call with the first episode)**; aspirin 81 mg from Tue; atorvastatin from Tue 2100; home-medicine review |
| Mon 1130 | **Restart insulin 4 units/h with D5 0.45% NaCl + KCl 20 mEq/L 150 mL/h** (needs K 3.5 or higher AND prescriber confirmation) |
| Mon 1405 | STAT ECG for chest pressure |
| Mon 1915-1945 | Resolution confirmed (BHB under 0.6 AND pH 7.30 or higher or HCO3 18 or higher); **glargine 22 units 1930**, lispro 6 units + scale, IV insulin 2 units/h and carrier to 2130; consistent-carbohydrate heart-healthy diet; **metoprolol tartrate 12.5 mg q12h from 2000 (hold HR under 55 or SBP under 100)** |
| Mon 2030 / Tue 0000 | NS 100 mL/h from Tue 0700 for contrast-kidney protection; NPO except medicines from midnight (basal never held) |
| Tue 1215-1300 | Post-cath orders: heparin stays off, **radial band protocol** (2 h, deflate 2-3 mL every 15-30 min from 1430, off 1600), neurovascular checks 15 min x4, 30 min x4, hourly x4, then q4h; **ticagrelor 180 mg load (given 1215) and 90 mg q12h from Wed 0000 (12 h after the load)**; ECG 1300; BMP 1845, Wed 0645, Thu 0645; diet and activity |
| Tue 1400 / 1615 | Dietitian, cardiac rehabilitation, case management/social work, tobacco specialist; **losartan 25 mg (first dose 1630, then 0800)** with hold parameters; echo Wed 1300; metoprolol succinate 50 mg from Wed |
| Tue 1920 | Right radial hematoma orders (pressure 15 min, borders marked, splint to 2300, checks); antiplatelets continue |
| Wed 0900 | **Nicotine patch 21 mg (first 1000)**, lozenge 2 mg PRN, 8-week taper; smoking cessation |
| Thu 0650 | Conditional discharge for about 0900 (not yet carried out) |
Order text never states a later event (checked with a script: every clock time later than an order's own time is a plan, a scheduled dose or a lab time; no result is quoted before it is released).

## MAR summary
ED (`given`): NS bolus, aspirin 324 mg, ondansetron 4 mg, insulin 8 units/h (running at 0700), 0.45% NaCl 200 mL/h (completed), 0.45% NaCl + KCl 20 mEq/L (running at 0700), heparin bolus 4,000 units, heparin 960 units/h (running at 0700), atorvastatin 80 mg, flushes; **ticagrelor 180 mg Tue 1215 (cath lab)**. **Due**: insulin 0715 hold, 1130 restart, 1915 reduce (stop 2130 automatic); KCl riders 0715, 0815, 0915, 1015; D5 0.45% NaCl (K-free) 0715; D5 0.45% NaCl + KCl 1130; glargine Mon 1930, Tue 2100, Wed 2100; lispro Mon 1930, Tue 0730 (**NPO: the student must hold**), 1300, 1730, Wed 0730, 1200, 1730; metoprolol tartrate Mon 2000, Tue 0800, 2000; NS 100 mL/h Tue 0700; aspirin Tue 0800, Wed 0800; ticagrelor 90 mg Wed 0000, 1200, Thu 0000; losartan Tue 1630, Wed 0800; atorvastatin 80 mg Tue 2100, Wed 2100; metoprolol succinate Wed 0800; nicotine patch Wed 1000; flushes. PRN: ondansetron, nitroglycerin, juice, D10W, glucagon, nicotine lozenge (none pre-charted: the 1410 nitroglycerin and the 1400 lozenge are student actions). **No enoxaparin or other prophylactic anticoagulant** (build check): therapeutic heparin to Tue 1030, then dual antiplatelet therapy and walking.

## I&O (4-hour blocks, `periodEnd`, standard labels; shift totals checked by the build and in the app)
| Shift | IV fluid | IV med | PO | Intake | Urine | Emesis | Output | Net |
|---|---|---|---|---|---|---|---|---|
| ED 0130-0700 | 1,750 | 83 | 50 | 1,883 | 1,350 | 150 | 1,500 | +383 |
| 1 Mon 0700-1900 | 1,375 | 577 | 350 | **2,302** | 1,650 | 0 | **1,650** | +652 |
| 2 Mon 1900-Tue 0700 | 375 | 131 | 750 | **1,256** | 1,050 | 0 | **1,050** | +206 |
| 3 Tue 0700-1900 | 1,200 | 139 | 960 | **2,299** | 1,750 | 0 | **1,750** | +549 |
| 4 Tue 1900-Wed 0700 | 0 | 10 | 900 | **910** | 850 | 0 | **850** | +60 |
| 5 Wed 0700-1900 | 0 | 10 | 1,600 | **1,610** | 1,450 | 0 | **1,450** | +160 |
| 6 Wed 1900-Thu 0700 | 0 | 10 | 800 | **810** | 750 | 0 | **750** | +60 |
| Simulation | 2,950 | 877 | 5,360 | 9,187 | 7,500 | 0 | 7,500 | +1,687 (ED + simulation +2,070) |
Output, oral and the shift urine/oral totals are the source's (1,650/1,050/1,750/850/1,450/750); the IV columns were recomputed from the corrected IV timeline (source shift-1 IV fluid 1,800 and IV med 550, shift-3 IV med 55 + contrast 85, whole-stay intake 11,458 and net +2,458). IV med = insulin + heparin (incl. the bolus) + KCl riders + ondansetron + flushes + the cath-lab medicines (20) and contrast (85). Shift-1 IV med 577.2 = insulin 32 + KCl 400 + heparin 115.2 + flushes 30; IV fluid 1,375 = 0.45% NaCl + KCl 37.5 + D5 K-free 212.5 + D5 + KCl 1,125. Half-mL values are rounded within each shift so every block is a whole number (blocks 751 / 787 / 764 in shift 1). Lowest urine: 750 mL/12 h = 0.78 mL/kg/h (the rider condition of 0.5 mL/kg/h = 40 mL/h is met: 550 mL in the first 4 h = 1.7 mL/kg/h).

## ECGs (acquired -> read; QTc Bazett; images from `casestudy/tools/ecg_image.py` via `gen/ecg/make_ecgs.py`; the tool gained optional `st_dep`, `t_inv` and `pvc_beats`, default off and byte-identical for the other patients)
| Time | Rate / rhythm | PR | QRS | QTc | Findings | K then |
|---|---|---|---|---|---|---|
| Mon 0140 -> 0150 | 114 sinus tachycardia | 148 | 88 | 432 | **1.5 mm horizontal ST depression V4-V6** (0.5 mm I, aVL, V3), T inversion V5-V6, aVR reciprocal | 5.2 (pending) |
| Mon 0715 -> 0725 | 96 sinus + **frequent unifocal PVCs (about 7/min, couplets)** | 164 | 92 (136 on PVC) | 492 (T-U fusion) | Flat T, **prominent U waves (over 1.5 mm V2-V3)**, 1.0 mm ST depression V4-V6 | **3.3** |
| Mon 1405 -> 1415 | 94 sinus | 156 | 90 | 438 | **1.5 mm ST depression V4-V6**, T inversion V5-V6, no PVCs, no U waves (added: the source mentions a 1405 ECG but no record) | 4.1 |
| Tue 1300 -> 1310 | 68 sinus | 160 | 86 | 418 | **ST depression resolved**, normal T, no U waves | 4.3 |
Monitor rows use the same rates and T/U settings. An echocardiogram report (Wed 1300, released 1440; LVEF 55%, mild lateral hypokinesis, normal valves) is filed under Cardiology.

## Monitor rows (`monitor.html` `DKA6`, MRN SIM-40506, banner "CSD-412 OKAFOR, SAMUEL 45 M"; temperatures in F)
New optional row field **`pvc`** (premature ventricular beats per minute on the live ECG; default none) and the row `events` list (PVCs and couplets for the review screen) are used for the K 3.3 hours.
| Time | HR | BP | RR | SpO2 | Temp F | Rhythm / T / U / pvc | Note |
|---|---|---|---|---|---|---|---|
| Mon 0700 | 96 | 134/82 | 20 | 98 | 98.2 | sinus, T 0.2, U 0.14, **pvc 7** | design checkpoint; 21 review events 0701-1105 |
| Mon 0715 | 96 | 134/82 | 20 | 98 | 98.2 | same | K 3.3 released 0710: hold, riders (added) |
| Mon 0930 | 92 | 130/80 | 18 | 98 | 98.2 | T 0.25, U 0.08, **pvc 3** | third rider; PVCs decreasing (added) |
| Mon 1115 | 90 | 130/80 | 18 | 98 | 98.2 | T 0.3, U 0.04, pvc 1 | fourth rider ends (added) |
| Mon 1130 | 88 | 128/80 | 18 | 98 | 98.2 | normal, no pvc | K 4.1, insulin restart (added) |
| Mon 1400 | 94 | 144/88 | 20 | 97 | 98.2 | sinus | chest pressure 5/10 (design values) |
| Mon 1414 | 82 | 128/78 | 18 | 98 | 98.2 | sinus | after nitroglycerin (design values) |
| Mon 1900 | 84 | 128/78 | 16 | 98 | 98.1 | sinus, normal T | design checkpoint (DKA resolved) |
| Tue 0700 | 74 | 124/74 | 16 | 98 | 97.9 | sinus | design checkpoint |
| Tue 1100 | 78 | 126/76 | 16 | 98 | 97.9 | sinus | in the cath lab (added) |
| Tue 1300 | 70 | 122/74 | 15 | 99 | 98.1 | sinus | return (design note values) |
| Tue 1900 | 68 | 120/72 | 15 | 99 | 98.1 | sinus | design checkpoint (hematoma) |
| Wed 0530 | 76 | 126/76 | 16 | 99 | 97.9 | sinus | craving, restless (added) |
| Wed 0700 | 66 | 118/70 | 14 | 99 | 97.9 | sinus | design checkpoint |
| Wed 1400 / 1410 | 82 / 66 | 128/74 / 118/70 | 16 / 14 | 99 | 97.9 | sinus | rehabilitation walk peak and rest (design values) |
| Wed 1900 | 66 | 118/70 | 14 | 99 | 97.9 | sinus | added shift-change row |
| Thu 0700 | 64 | 116/68 | 14 | 99 | 98.1 | sinus | design checkpoint |
The design lists the six checkpoints only; the added rows (0715, 0930, 1115, 1130, Tue 1100, Wed 0530, Wed 1900) and their values are instructor choices consistent with the story. The 1400 and 1414 values and the Tue 1300 and Wed 1400 values come from the source's note text.

## Notes (36; ED RN notes only; no unit RN notes; each quotes only what already existed)
ED: provider 0150, 0230, 0505; RN 0630 and 0655 (SBAR); ECG 0150. Day 1: ECG 0725, hospitalist H&P 0735, endocrinology 0830, cardiology 0930, pharmacy 1145, ECG 1415, **cardiology fellow event note 1430 (chest pressure)**, hospital medicine 1555, endocrinology transition 1925, night hospitalist 2035. Day 2: night 0620, endocrinology 0800, **cardiology pre-procedure 1030, cath/PCI report 1230**, ECG 1310, fellow post-procedure 1320, cardiology 1615, pharmacy 1730, **fellow event note 1945 (radial hematoma)**. Day 3: night 0545, hospital medicine 0830, tobacco 1000, dietitian 1130, rehabilitation 1430, echo 1440, case management 1530, endocrinology 1700, hospital medicine 1840. Day 4: night 0620, cardiology and hospital medicine discharge-readiness 0700. `node gen/check_notes.js` (15 hits, all false positives: goals such as "K 4.0 or higher", "corrected sodium 138.0", a bicarbonate next to a gap) plus the build's clock-time check flag only plans and history times. The source's unit RN notes (#03, 07, 08, 10, 12, 14, 16, 17, 24, 25, 27) became provider notes; #26 (discharge summary, 0815) and #27 (nursing discharge, 0900) fall after the 0700 end and are folded into the 0700 discharge-readiness note.

## Discharge plan (Thu 0700 and the notes)
Still hospitalized at the end; conditional discharge about 0900 after the 0700 labs, morning medicines, breakfast insulin, radial check and structured teach-back with Grace. **Glargine 22 units at bedtime; lispro 6 units with meals (1 unit per 10 g) + 1 unit per 50 mg/dL over 150; aspirin EC 81 mg; ticagrelor 90 mg every 12 hours for at least 12 months (12-hour schedule agreed with him); atorvastatin 80 mg at bedtime; metoprolol succinate 50 mg; losartan 25 mg; nitroglycerin 0.4 mg SL as needed; nicotine patch 21 mg + lozenge 2 mg (8-week taper); blood ketone meter and strips; calcium carbonate stopped.** Follow-up: cardiology and endocrinology in 1 week (BMP for losartan and contrast), cardiac rehabilitation Phase II in 2 weeks, telephone quit-line, driver-certification timeline with case management.

## Changes from the source (every one made on purpose)
| # | Source | Built |
|---|---|---|
| 1 | **Potassium rule violation**: KCl riders 0715-1115 while D5 0.45% NaCl + KCl 20 mEq/L ran at 150 mL/h (13 mEq/h) | Carrier is potassium-free (D5 0.45% NaCl at 50 mL/h) during the four riders (total 10 mEq/h, 150 mL/h of fluid including the riders), the 20 mEq/L carrier resumes at 1130 with the restart; orders, MAR, I&O, notes, stickies and the build check updated (no minute above 10 mEq/h, no rider beside a K-containing carrier) |
| 2 | **Heparin**: bolus 4,800 units and 1,000 units/h (10 mL/h) | **4,000-unit bolus (cap) and 960 units/h (12 units/kg/h)**, 9.6 mL/h; anti-Xa 0.30-0.70 about every 6 h and after changes; design anti-Xa values kept (0.48, 0.52, 0.55, 0.54); heparin I&O recomputed (ED 23.2 mL incl. bolus; 115.2 / 115.2 / 33.6 per shift); the build checks the order doses |
| 3 | Brand and program names: Lantus/Humalog/Humulin R/Zofran/Brilinta etc. used freely; TR Band, EBU guide, SoloStar, KwikPen, Meds-to-Beds, Quitline, FMCSA, Form MCSA-5870, FMLA, manufacturer copay card, "Mediterranean/DASH", ACC/AHA/ADA | Drug brands only in parentheses after the generic; devices and programs generic ("radial compression band", "telephone quit-line", "outpatient pharmacy bedside delivery", "federal commercial driver medical certification", "job-protected medical leave"); no links or real organizations in chart text (build check) |
| 4 | Unit RN notes #03, 07, 08, 10, 12, 14, 16, 17, 24, 25, 27 | Provider/consultant/cath-lab notes: hospitalist H&P 0735 (with #03), fellow event note 1430 (#07), endocrinology transition 1925 (#08), night notes (#10, 17, 25), cardiology pre-procedure note (#12), fellow post-procedure note (#14), fellow hematoma event note (#16), hospital medicine afternoon update (#24); ED RN notes #02 (0630) kept and the 0655 SBAR added; the 0815 and 0900 discharge notes fold into the 0700 note |
| 5 | "Simulation", "scenario", "teaching moment", "checkpoint", "requested", "faculty"-style phrases, "ADA 2024 consensus", "Required mathematical proofs" | Removed from every chart text (build check; list includes "student", "instructor", "teaching"); the guideline distinctions are only in DESIGN/INSTRUCTOR_NOTES/REVIEW |
| 6 | Staff names (Marcus Vance, Elena Rostova, Jordan Reyes, Priya Nair, David Sterling, Chloe Lin, Aaron Cho, Maya Lin, Sarah Jenkins, Marcus Thorne, Hannah Abbott, Lucas Vance, Denise Washington, Victor Alvarez, Dr. Patel); daughter Maya | New set (above); first names Marcus, Jordan, Maya, Priya, Denise repeat series patients and are gone; none repeats other cases' staff; daughter renamed **Naomi** |
| 7 | Allergies: "Lisinopril (caused persistent dry cough)" | Intolerance field "Lisinopril - intolerance (dry cough)"; problem, notes, pharmacy note and a sticky keep the losartan rationale |
| 8 | (no VTE drug in the source) | Rule check: no enoxaparin or other prophylactic anticoagulant anywhere (therapeutic heparin, then dual antiplatelet therapy, ambulatory); the build fails if one appears |
| 9 | DKA resolution "glucose under 250 plus at least two of pH over 7.30, HCO3 18 or higher, gap 12 or less, BHB under 0.6" | Series gate **BHB under 0.6 AND (venous pH 7.30 or higher OR bicarbonate 18 or higher)**: by the source's two-of-four rule DKA would have been "resolved" at 1530 (pH 7.34 and HCO3 19 with BHB 1.1 and gap 15). The 1555 note refuses to stop the insulin at 1530 |
| 10 | Atorvastatin 80 mg at 0500 (ED) AND 80 mg at 2100 the same day | No Day 1 2100 dose (two 80 mg doses 16 h apart); nightly 80 mg from Tue 2100 |
| 11 | Ticagrelor 90 mg at 2000 (7.75 h after the 1215 load), then 0800/2000 | First maintenance dose **12 h after the load (Wed 0000)**, then 1200/0000 while here; a 12-hour home schedule is agreed before discharge (see REVIEW question) |
| 12 | IV insulin "2 units/h at 1900"; labs "0700"/"1130"/"1900" | Reduction at 1915 (when the order is written after the 1905 results); panels collected 0655 / 1115 / 1850 and released 0710 / 1130 / 1905 (design result times 0710 and 1130 kept; the 1115 draw is at the end of rider 4 from the opposite arm so the restart can be at 1130) |
| 13 | "VBG" with pCO2 values 27-40 and venous references | All gases charted venous; pCO2 shown as the design's arterial-equivalent (reference 35-45) so Winter's is applied to the design's values |
| 14 | "24 h post-contrast" Cr at Wed 0700 | Labeled honestly: about 19 h after the contrast (first check); Thu 0645 is about 43 h (completes the 48 h window); BMP again at the 1-week visit |
| 15 | Nicotine taper "6-week step-down plan (21 mg x4 weeks, 14 x2, 7 x2)" | 8-week taper (the sum of the stated steps) |
| 16 | Right AC IV (heparin) kept to discharge | Removed Tue 1035 (right arm is the radial access side: no IV, cuff or venipuncture) |
| 17 | Splint "until midnight" (note) vs "4 additional hours" (checkpoint) | Splint until 2300 (4 h) |
| 18 | ED 0700 "occasional isolated PVC" vs checkpoint "frequent PVCs 6-8/min" | ED handoff 0655: occasional and increasing; 0700 set and monitor: frequent |
| 19 | Echo "pre-discharge" / "D3 afternoon"; no ECG record for 1405 | Echo Wed 1300 (reported 1440); ECG record added at 1405 (read 1415) |
| 20 | No post-chest-pain troponin | Repeat hs-TnI with the 1850 panel (existing value 1,280) |
| 21 | Hepatic panel drawn without values; no CBC series; no UA extras | Normal hepatic panel, a smooth CBC series (Hgb 15.6 to 14.0, platelets 265 to 244) and negative nitrite/LE added |
| 22 | Fluids 150 mL/h D5 through the hold (shift-1 IV fluid 1,800) | 50 mL/h during the riders; shift-1 IV fluid 1,375; whole-stay intake 11,070 (source 11,458) |
| 23 | Room "Bed 412"; Day 1 date not given; Celsius vitals | CSD-412; Mon 11/16/2026; Fahrenheit |
| 24 | Metoprolol succinate 50 mg described as a "conversion" | Stated as a step up from 25 mg/day with the same hold parameters and a first-day heart-rate check |
| 25 | Glucose rows for Tue 0300 and Wed 1345 absent | 0300 Tue 146 (smooth) and Wed 1345 152 (the rehabilitation note quotes it) |

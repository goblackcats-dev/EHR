# DKA patient 7 of 7: Priya Desai, DKA in pregnancy at 28 weeks (single source of truth)

Simulation: **Mon 2026-12-28 07:00 to Thu 2026-12-31 07:00 (72 h)** (Day 1 = Mon 12/28 ... Day 4 = Thu 12/31). OB triage / ED arrival Mon 0130. Checkpoints at every shift change: **Mon 0700, Mon 1900, Tue 0700, Tue 1900, Wed 0700, Wed 1900, Thu 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Provenance: `SOURCE_chatgpt_design.md` (kept unchanged); the numbered corrections are listed in "Changes from the source" at the end and in `REVIEW.md`.

- **Vital signs are in the chart ONLY up to the 0700 arrival set** (0130, 0250, 0530 and the 0700 unit set; Celsius converted to F). Later vitals come from the bedside monitor (`monitor.html` `DKA7` rows, MRN SIM-40507, banner "HRA-9 DESAI, PRIYA 29 F"). Notes contain no numeric maternal vitals after 0700 (the 0700 set quoted in the H&P, ECG rates and thresholds excepted).
- **Fetal data.** The app has no fetal monitor. Fetal heart rate and tocodynamometer findings are in (a) time-gated "Fetal Heart Rate Tracing Interpretation" provider notes (17, each written after the tracing time), (b) flowsheet comments on the ED heart-rate values (0130, 0250, 0530, 0700), (c) a "Fetal / Obstetric" assessment section at 0130 and 0700, (d) time-gated sticky notes, (e) the INSTRUCTOR_NOTES checkpoint table and (f) the monitor row notes (maternal values only on the monitor).
- Baseline nursing assessment: OB triage 0130 + unit 0700 only. **POC glucose is in the chart, time-gated.** Unit RN notes are NOT pre-written (the OB triage RN note at 0220 and the 0655 handoff exist).
- MAR: ED doses and infusions started in the ED are `given`; regular insulin 7 units/h and D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h show "0700 Running". **Every dose after Mon 0700 is `due`.** The insulin hold (0710), restart (0930), carrier swaps and rider starts are student actions driven by time-gated protocol orders (0708, 0930, 1915, Tue 0730).
- Dates: the source gives none. Day 1 is Mon 12/28/2026; **EDD 03/20/2027 = Day 1 + 82 days**, so GA is **28w2d on Day 1** (198 days; 280 - 198 = 82). Day 2 = 28w3d, Day 3 = 28w4d, Day 4 = 28w5d. Age 29 on DOB 05/14/1997.

## Patient
- **Priya Desai**, 29-year-old woman, DOB 1997-05-14, MRN **SIM-40507**, she/her. G1P0 at 28w2d. Height 165 cm, **weight 70.0 kg** (current pregnant weight = dosing weight for the whole stay; actual current weight is used for dosing in pregnancy); pre-pregnancy 62.0 kg (BMI 22.8); BMI now 25.7. **Full Code (maternal and fetal).** High-risk antepartum unit, room **HRA-9**.
- **Allergy:** penicillin, maculopapular rash in childhood (low-risk history; cefazolin acceptable for group B strep prophylaxis if ever needed).
- **Type 1 diabetes since age 12**, one DKA at 16 (influenza), multiple daily injections and a continuous glucose monitor (generic name; the source's brand removed). Home: glargine 24 units at 2100, lispro 1 unit per 8 g carbohydrate (about 8, 8, 10 units) plus 1 unit per 30 mg/dL over 120, **aspirin 81 mg daily (continued)**, prenatal vitamin with DHA and folic acid 800 mcg. A1c 6.4% pre-conception, 6.1% (10 w), 6.0% (24 w), **6.2% today**. No retinopathy, nephropathy (baseline creatinine 0.55; 24-hour urine protein 110 mg) or neuropathy.
- **Prenatal:** spontaneous conception, dating by 8-week crown-rump length; normal nuchal translucency; cell-free DNA low risk (46,XX); anatomy scan 20 w normal; fetal echocardiogram 22 w normal; growth scan 3 days before admission (27w6d): EFW 1,180 g (54th percentile), AFI 14.2 cm. Blood type **O positive** (no Rh immune globulin), antibody screen negative, rubella immune, RPR non-reactive, HBsAg negative, HIV negative, **GBS not yet due (36 weeks)**.
- Family: husband **Rohan** (31, software engineer, continuous at the bedside); fourth-grade teacher; mother hypothyroidism and celiac disease, father hypertension and hyperlipidemia, maternal aunt type 1 diabetes. No tobacco, alcohol or drugs.
- **People (fictional; none repeats a series patient's first name or any earlier case's staff name/surname):** OB attending days **Beatriz Montenegro, MD**; OB night **Odalys Ferrante, MD**; MFM **Lucinda Aldrich, MD**; endocrinology **Henrik Dalgaard, MD**; clinical pharmacist **Gwendolyn Aoki, PharmD**; dietitian **Rosalind Trevino, RDN**; diabetes educator **Marguerite Doyle, RN, CDCES**; social work **Leopold Nwosu, LCSW**; neonatology **Rhiannon Stavros, MD**; ECG reader **Tobias Eskridge, MD**; OB triage RN **Fiona Maddox, RN**. (Source names Elena Rostova, Marcus Vance [= series patient 4's first name], Aris Thorne, Kevin Park, Sarah Jenkins, Maya Lin [= patient 1's name], Rachel Green, Clara Soto, Patricia Vance, David Miller: replaced.)

## Story before the unit (OB triage / ED Mon 0130-0700)
Norovirus-like illness spread in her classroom; 36 hours of nausea, 3 watery stools and 8 episodes of vomiting in 18 hours. Her sensor read 175-235 mg/dL (she did not know DKA can occur at that level in pregnancy), she feared a low, cut glargine from 24 to 12 units and skipped lispro. At 0030 epigastric soreness, Kussmaul breathing, fatigue and decreased fetal movement for 4 hours; arrived 0130 with Rohan.
| Time | Event |
|---|---|
| 0130 | Triage: left lateral tilt (wedge); BP 104/62, HR 118, RR 26 Kussmaul, SpO2 99% RA, 37.1 C. No oxygen (SpO2 99%). |
| 0135 | Fetal monitor on: baseline 165, minimal variability, no accelerations, recurrent late decelerations (nadir 140, 40 s) with contractions every 3-4 min: **Category II** |
| 0140 | Emesis 150 mL clear |
| 0145 | Two 18 g IVs (left forearm, right antecubital), Foley (120 mL dark amber; UA ketones 4+, glucose 3+, SG 1.030), labs drawn, ECG |
| 0150 | NS 1,000 mL over 1 h (14.3 mL/kg) |
| 0155 | Ondansetron 4 mg IV |
| 0210 | Labs released: glucose 242, pH 7.24, HCO3 10, gap 26, BHB 5.4, K 4.1 |
| 0215 | **Regular insulin 7 units/h (0.1 x 70), no bolus** |
| 0250 | Tracing: baseline 160, minimal, intermittent lates; NS continues 250 mL/h until 0300 |
| 0300 | POC 192 (under 200): **D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h** (5 mEq/h) |
| 0415 | 0400 panel released: K 3.6 |
| 0420-0520 | **KCl rider 1** with the carrier swapped to **potassium-free D5 0.45% NaCl 150 mL/h** (total 10 mEq/h; the source ran this rider beside the 20 mEq/L bag = 15 mEq/h) |
| 0520 | D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h resumes |
| 0530 | Tracing: baseline 155, minimal-to-moderate, fewer lates |
| 0655 | Handoff note; 0655 panel drawn |
| 0700 | Arrival on HRA-9; tracing Category II; the **0655 panel releases at 0705: K 3.2** |
ED totals 0130-0700 (not added again to shift 1): IV fluid 1,942, IV med 155 (insulin 33.25 + KCl 100 + ondansetron 2 + flushes 20), oral 0 -> **intake 2,097**; urine 720 + emesis 150 -> **output 870**; net **+1,227**.

## Vital signs (OB triage and arrival only)
| Time | Temp | HR | BP | RR | SpO2 | Note | Fetal comment |
|---|---|---|---|---|---|---|---|
| Mon 0130 | 37.1 C = 98.8 F | 118 | 104/62 | 26 Kussmaul | 99% RA | pain 3/10 | Cat II, 165, minimal, recurrent lates |
| 0250 | 37.0 C = 98.6 F | 110 | 108/66 | 24 | 99% | | Cat II, 160, minimal, intermittent lates |
| 0530 | 36.9 C = 98.4 F | 102 | 112/68 | 22 | 99% | nausea better | Cat II, 155, min-to-mod, fewer lates |
| 0700 arrival | 36.8 C = 98.2 F | 98 | 110/68 | 20 | 99% | pain 1/10 | Cat II, 155, 5-6 bpm, intermittent lates to 138 |
(The source gives no pain scores; 3, 3, 2, 1 added. Fetal comments are attached to the HR value as flowsheet comments.)

## Labs (collected -> released; Na, K, Cl, HCO3 mmol/L; BUN, Cr, glucose, Mg, phos mg/dL; BHB mmol/L)
Gases are **venous** draws; pH and pCO2 are reported as arterial-equivalent values (reference: pregnancy pH 7.40-7.45, pCO2 27-32, HCO3 18-22). **The pH is computed by Henderson-Hasselbalch from the panel's bicarbonate (serum total CO2) and pCO2 and must match within 0.02 (the build fails otherwise).** The source's pH values (7.18, 7.22, 7.27, 7.30, 7.33, 7.36, 7.39) were 0.03-0.07 too low for its own HCO3 and pCO2 (for example HCO3 10 + pCO2 24 gives 7.24, not 7.18).
| Collected -> released | Na | K | Cl | HCO3 | BUN | Cr | Glu | AG | pH | pCO2 | BHB | Phos | Mg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon 0145 -> 0210 | 134 | 4.1 | 98 | 10 | 16 | 0.78 | 242 | 26 | 7.24 | 24 | 5.4 | 3.8 | 1.9 |
| 0400 -> 0415 | 135 | 3.6 | 101 | 12 | 14 | 0.70 | 178 | 22 | 7.30 | 25 | 4.1 | 3.1 | 1.8 |
| 0655 -> **0705** | 136 | **3.2** | 104 | 14 | 12 | 0.64 | 152 | 18 | 7.34 | 27 | 2.8 | 2.4 | **1.5** |
| 0915 -> 0930 (new: after rider 2) | 136 | **3.6** | 104 | 14 | 11 | 0.62 | 186 | 18 | 7.34 | 27 | 2.6 | 2.3 | 1.7 |
| 1100 -> 1115 | 136 | 3.8 | 105 | 15 | 10 | 0.58 | 148 | 16 | 7.35 | 28 | 1.9 | 2.4 | 2.0 |
| 1500 -> 1515 | 137 | 3.9 | 106 | 17 | 9 | 0.56 | 138 | 14 | 7.39 | 29 | 1.1 | 2.7 | 2.0 |
| 1850 -> 1905 | 137 | 4.1 | 106 | 19 | 8 | 0.55 | 132 | 12 | 7.42 | 30 | **0.5** | 2.9 | 2.0 |
| Tue 0100 -> 0115 | 137 | 4.0 | 105 | 20 | 8 | 0.54 | 118 | 12 | 7.43 | 31 | 0.3 | 3.1 | 1.9 |
| Tue 0655 -> 0710 | 136 | 4.1 | 105 | 20 | 7 | 0.53 | **62** | 11 | | | 0.2 | 3.2 | 1.9 |
| Tue 1830 -> 1900 | 136 | 4.2 | 104 | 21 | 7 | 0.52 | 124 | 11 | | | 0.2 | 3.4 | 2.0 |
| Wed 0645 -> 0700 | 136 | 4.1 | 104 | 21 | 8 | 0.52 | 92 | 11 | | | 0.1 | 3.5 | 2.0 |
| Thu 0645 -> 0700 | 136 | 4.2 | 104 | 21 | 8 | 0.52 | 88 | 11 | | | 0.1 | 3.6 | 2.0 |
Changes to the source values: the **0915 panel is new** (the recheck after the shortened hold; the source rechecked at 1100); the 0655 draw is released 0705 (source "0700 / 0705 call"); the source's Mg 1.6 became **1.5** (below the 1.6-2.2 pregnancy range) so the magnesium order has a reason; the 1100 K 3.6 became 3.8 (a third rider and the carrier ran after the restart); the 1100 glucose 144 became 148 and the 0700-1000 glucose values drifted differently (below); the Day 2 0100 pCO2 30 became 31 (pH 7.43, not 7.45).
Also at 0145 -> 0210: lactate 1.8 (added), HbA1c 6.2% (added), WBC 14.8 (3rd-trimester range 5.6-16.9; mild leukocytosis is normal), Hgb 12.1 (hemoconcentrated), platelets 245, **AST 24, ALT 19, lipase 42, uric acid 4.2 (added: epigastric pain at 28 weeks needs pancreatitis and HELLP excluded)**. UA (Foley 0150): glucose 3+, ketones 4+, SG 1.030, protein negative (added), nitrite and leukocytes negative. CBC series (added): Hgb 12.1 -> 10.9 -> 10.8 -> 10.8 (dilution plus **mild physiologic anemia of pregnancy**), WBC 14.8 -> 11.2 -> 9.8 -> 9.2, platelets 245 -> 228 -> 224 -> 226. Blood ketone meter 0.1 (Wed 1330); urine ketones negative Wed and Thu 0650. Obstetric: rapid fFN negative and cervical length 3.8 cm (Tue 1845-1850, released 1900).
**Pregnancy reference ranges used in the chart:** Na 130-140, K 3.3-5.0, Cl 97-109, HCO3 18-22, BUN 3-11, creatinine 0.40-0.80, fasting glucose under 95, gap 6-12, Mg 1.6-2.2, phos 2.5-4.5, pH 7.40-7.45 and pCO2 27-32 (arterial-equivalent), WBC 5.6-16.9, Hgb 10.5-14.0.

**Arithmetic (`node gen/physiology.js` prints it; `assemble.js` fails the build on a mismatch)**
- Anion gap = Na - Cl - HCO3: 26, 22, 18, 18, 16, 14, 12, 12, 11, 11, 11, 11 (equal to the source where the source had a value). Delta-delta at 0145: gap rise 14 (26 - 12) vs bicarbonate fall 10 (20 - 10) = 1.4: a pure anion-gap acidosis with a small extra metabolic alkalosis from vomiting.
- Corrected sodium = Na + 1.6 x (glucose - 100)/100: **136.27**, 136.25, 136.83, 137.38, 136.77, 137.61, 137.51, 137.29, then 136.0-136.4 (normal; no HHS; effective osmolality 2 x Na + glucose/18 = 281.4, 279.9, 280.4, 282.3, 280.2, 281.7, 281.3 ...). Corrected sodium is normal so 0.45% NaCl after the first liter is appropriate.
- **Winter's formula** (expected pCO2 = 1.5 x HCO3 + 8, +/- 2; derived in non-pregnant adults) against the measured pCO2: 0145 expected 23 (21-25) measured 24; 0400 26 (24-28) 25; 0655 29 (27-31) 27; 0915 29 (27-31) 27; 1100 30.5 (28.5-32.5) 28; 1500 33.5 (31.5-35.5) 29; 1850 36.5 (34.5-38.5) 30; Day 2 0100 38 (36-40) 31. **Pregnancy shifts the expectation down**: the baseline pCO2 is 27-32 and HCO3 18-22 (Winter's would predict 38 at a bicarbonate of 20), so a pregnancy-adjusted estimate (baseline 30 at HCO3 20, minus 1.2 mmHg per 1 mmol/L fall in bicarbonate) is 18.0, 20.4, 22.8, 22.8, 24.0, 26.4, 28.8, 30.0. The measured values lie between the two estimates (inside Winter's window early; 0.5 to 8 mmHg below it later as the bicarbonate approaches its pregnancy baseline), which is appropriate compensation with no superimposed respiratory acidosis. Students should say "appropriate for pregnancy", not "too low".
- Henderson-Hasselbalch pH = 6.1 + log10(HCO3 / (0.03 x pCO2)): 7.243, 7.304, 7.338, 7.338, 7.352, 7.391, 7.425, 7.433 (charted 7.24, 7.30, 7.34, 7.34, 7.35, 7.39, 7.42, 7.43). DKA severity at 0145: moderate (bicarbonate 10, pH 7.24).
- **Resolution rule (series): BHB under 0.6 AND (venous pH 7.30 or higher OR bicarbonate 18 or higher)**: first met at the 1850 specimen (BHB 0.5, pH 7.42, HCO3 19). The source's "two of four criteria" rule would call DKA resolved at 1100 (pH 7.35, HCO3 15) and certainly 1500 (pH 7.39, HCO3 17) with BHB 1.9 and 1.1: the 1145 note refuses.
- Insulin: 70 x 0.1 = **7 units/h**; 70 x 0.05 = **3.5 units/h**; total regular insulin 0215-2130 = 34.4 + 42.0 = **76.4 units** (one 100-unit bag). Glargine 24 units = **0.34 unit/kg** (home dose); lispro 4 units for 32 g (1:8); home total daily dose 24 + 26 = 50 units (0.71 unit/kg); Day 2 on 20 + 6 + 7 + 8 = 41 units (0.59 unit/kg); ratio 1:10 at 60/70/80 g.
- Fluids vs 70 kg: NS 1,000 mL = 14.3 mL/kg in 1 h; ED IV fluid 1,942 mL = 27.7 mL/kg; total IV volume (carrier + rider + magnesium) never above 250 mL/h (3.6 mL/kg/h) after the bolus, then 200 mL/h (2.9 mL/kg/h); whole-stay balance (ED + stay) **+3,375 mL** (intake 12,145, output 8,770); lungs clear, trace pedal edema only, no preeclampsia signs. Dextrose total 0300-2130 = 173.8 g.
- **Glucose fall rate (mg/dL/h):** -24 (0145-0200 hourly equivalent), -44 (0200-0300), -14, -10, -9, -7 on 7 units/h with D5; **+14, +16 (0700-0900, insulin held; +12/h to 0930)** then **-32/h (0930-1000), -24/h (1000-1100)**, -6, -3, +1, -2, -3, +1, -2, -2 (1500-1900), then -4, +6, -5. Never a fall over 100 mg/dL/h, never under 110 on the infusion (lowest 124 at 2200 after the infusion stopped; 128 at 2000), fall under the 50-75 target because D5 runs from 0300 (as in a pregnancy protocol).

## POC glucose (mg/dL)
Mon **0145 242, 0200 236, 0300 192**, 0400 178, 0500 168, 0600 159, **0700 152, 0800 166, 0900 182, 0930 188 (restart)**, 1000 172, 1100 148, 1200 142, 1300 139, 1400 140, 1500 138, 1600 135, 1700 136, 1800 134, 1900 132, 2000 128, 2100 134, 2130 129 (infusion stops), 2200 124; **Tue** 0200 96, **0700 62**, 0720 84, 0830 128, 1200 94, 1330 132, 1730 98, 1900 124, 2200 112; **Wed** 0300 91, 0700 92, 0830 134, 1200 89, 1330 129, 1730 93, 1900 131, 2200 108; **Thu** 0700 88. The 0800-1000 values are new (the source's insulin hold was dextrose-free: 164, 174, 181 with 144 at 1100; here the dextrose-containing carrier keeps the glucose rising slowly then falling after the restart).

## IV timeline and potassium (`node gen/infusions.js`)
| Time | Carrier fluid (IV A) | Insulin | Potassium |
|---|---|---|---|
| 0150-0250 | NS 1,000 mL bolus | | 0 |
| 0250-0300 | NS 250 mL/h | 0215: 7 units/h | 0 |
| 0300-0420 | D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h | 7 | 5 mEq/h |
| 0420-0520 | **D5 0.45% NaCl, potassium-free, 150 mL/h** | 7 | **rider 1 = 10 mEq/h**, carrier 0 |
| 0520-0710 | D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h | 7 | 5 mEq/h |
| 0710-1030 | **D5 0.45% NaCl, potassium-free, 100 mL/h (dextrose kept for the fetus)** | **HELD 0710-0930 (2 h 20 min)**; **0930 restart 3.5 units/h** | **riders 2, 3, 4 at 0715, 0815, 0930 (one at a time) = 10 mEq/h**, carrier 0 |
| 1030-2130 | D5 0.45% NaCl + KCl 20 mEq/L 200 mL/h | 3.5; stops 2130 | 4 mEq/h |
| 0730-0930 | magnesium sulfate 2 g/100 mL at 50 mL/h on IV A (Y-site) | | none |
- **Potassium rule: maximum 10.0 mEq/h in every minute** (checked minute by minute in `gen/infusions.js` and `assemble.js`); **0 minutes with a KCl rider and a potassium-containing carrier**; riders never in parallel (checked); no 40 mEq/L bag, no push. Total IV potassium 99.8 mEq (KCl 40 + carrier 59.8). Riders on IV B (right antecubital), carrier/insulin/magnesium on IV A.
- **Insulin vs potassium:** K 4.1 (insulin started 0215), 3.6 (rider + carrier swap), **3.2 at 0705: HOLD** (0710), recheck at the end of rider 2 (0915, opposite arm; released 0930) = 3.6 -> **restart 3.5 units/h with the prescriber's confirmation**, rider 4 runs 0930-1030 because 3.6 is only just above the threshold; 3.8 (1100), 3.9, 4.1. **The source held the insulin 0700-1115 (4 h 15 min) on a dextrose-free carrier with BHB still 2.8**: too long and no fetal substrate. Here the hold is 2 h 20 min and the dextrose never stops (the build fails for any dextrose-free minute 0300-2130 and for insulin running 0710-0930).
- Flushes (IV med, 10 mL each): 0150, 0525, 1035, 1530, 2135; Tue 0600, 1800; Wed 0600, 1800.

## Fetal tracing course (NICHD category) and contractions
| Time | Baseline | Variability | Accelerations | Decelerations | Contractions | Category |
|---|---|---|---|---|---|---|
| Mon 0135 | 165 | minimal (under 5) | none | recurrent late (nadir 140, 40 s) | q3-4 min, mild | **II** |
| 0250 | 160 | minimal | none | intermittent late | q4-5 min | II |
| 0530 | 155 | minimal-to-moderate | none | fewer late (stronger contractions only) | q5 min | II |
| 0700 | 155 | min-to-mod (5-6) | none | intermittent late (nadir 138) | q4-5 min, 40 s | II |
| 0830 | 152 | moderate intermittently (7-10) | none | occasional shallow late (nadir 142; last 0950) | q5-6 min | II (improving; during the insulin hold) |
| **1100-1130** | 148 | moderate (10-12) | 15 x 15 at 1040, 1105 | none since 0950 | irregular q8-10 min | **I** (first Category I) |
| 1500 | 145 | moderate (10-12) | several | none | irregular q8-10 | I |
| 1900 | 140 | moderate (10-15) | two in 20 min (reactive) | none | irregular tightenings q10-15 | I |
| 2200 | 138 | moderate | present | none | none-rare | I |
| Tue 0700 (maternal glucose 62) | 135 | moderate | present | none | none | I |
| 0900 | 135-140 | moderate (12) | frequent | none | none | I |
| 1645-1715 | 140 | moderate | present | none | irregular q6-8, 30-40 s | I |
| 1830-1920 | 140 | moderate | present | none | **regular q4 min, 45 s for 1 h** | I |
| 2000-2035 | 138 | moderate | present | none | q10-12 at 2000, none after 2030 | I |
| Wed 0700 | 138 | moderate | 3 in 20 min | none | none | I |
| Wed 0830 BPP | | | | | | 8/8 ultrasound (10/10 with NST) |
| Wed 1900 NST | 140 | moderate | 3 | none | none | I, reactive |
| Thu 0630 NST | 136 | moderate | 2 | none | none | I, reactive |
The source's first Category I was 1500-1900; with the shorter hold and earlier correction it is **about 1100** (about 9 hours after treatment began, 1.5 hours after the insulin restart). No emergent cesarean: documented MFM rationale (0240 consult, orders, 0715 and 1130 interpretations, 1540 note, discharge note).

## Orders (source section 4, cleaned and corrected)
| Written | Order |
|---|---|
| Mon 0130-0245 | Full code; two 18 g IVs; **continuous EFM/toco with the "no emergent cesarean for Category II in maternal ketoacidosis" directive**; **left lateral positioning and sequential compression devices**; telemetry, strict I&O, Foley hourly; ECG 0145; initial labs (incl. lipase, hepatic panel); NS 1,000 mL; ondansetron PRN (QT/K hold rule; the source scheduled q6h through 1955); **insulin infusion 7 units/h**; potassium safety protocol; POC hourly; NS 250 mL/h; consults |
| Mon 0255-0515 | D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h (0300); **rider 1 0420 with a potassium-free D5 carrier 150 mL/h**; K 20 mEq/L resumes 0520 |
| Mon 0708 (0700 admit) | Admit to HRA; **K 3.2: HOLD insulin, KEEP DEXTROSE (potassium-free D5 0.45% NaCl 100 mL/h), riders 0715 and 0815 one at a time, recheck at 0915**; magnesium 2 g 0730; ECG 0710; telemetry/notify thresholds; lab schedule (0915 added) |
| Mon 0735 | VTE prevention order (SCDs, early walking, no pharmacologic prophylaxis, reassess daily); home medicine review; aspirin 81 mg 0800 (continued; the source held it on Day 1) |
| Mon 0930 | **Restart insulin 3.5 units/h** (K 3.6 reviewed) with rider 4; ECG 0935; **D5 0.45% NaCl + KCl 20 mEq/L 200 mL/h from 1030** |
| Mon 1115 | Clear liquids from 1130 (the source's order said NPO until 1900 but the afternoon notes had sips of broth at 1500) |
| Mon 1915-1925 | Resolution confirmed; **glargine 24 units + lispro 4 units 1930**; IV insulin and carrier to 2130; Foley out 2200; diet |
| Tue 0730 | After the 62: **glargine 20 units 2100**, lispro 1:10 (6/7/8 units) + correction scale, 0200-0300 checks, pregnancy diet |
| Tue 1715 | Contractions: EFM resumed, 500 mL water over 1 h, UA with culture, **speculum swab for fFN before any digital exam**, then cervical length |
| Tue 1910 | **Betamethasone decision: do not give** (cervical length 3.8 cm, fFN negative); reconsider triggers; GBS/penicillin allergy plan |
| Wed 0915 | Fetal monitoring to a 20-minute tracing every 4 h; telemetry off after the 0700 assessment; kick counts |
| Thu 0650 | Conditional discharge about 0900 (not yet carried out) |
Order text never states a later event (checked with a script: no result quoted before it releases, no later events in order text).

## MAR summary
ED (`given`): NS bolus, NS 250 mL/h, ondansetron, insulin 7 units/h (running at 0700), D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h (0300-0420; resumed 0520, running at 0700), KCl rider 1, K-free D5 0.45% NaCl 0420-0520, flushes. **Due:** insulin 0710 hold, 0930 restart, 2130 stop; KCl riders 0715, 0815, 0930; K-free D5 0.45% NaCl 0710; magnesium 0730; D5 0.45% NaCl + KCl 1030; aspirin Mon-Wed 0800 (Thu 0800 is after the window); prenatal vitamin Tue/Wed 0800; glargine Mon 1930 (24 units) then Tue/Wed 2100 (20 units, separate order); lispro Mon 1930 (4 units), Tue 0735 (5), 1200 (7), 1730 (8), Wed 0715 (6), 1200 (7), 1730 (8); flushes. PRN: ondansetron, juice, D10, glucagon. Phosphate supplements: none (source gave sodium/potassium phosphate tablets at phos 2.4-2.9; replacement is for under 1.0 in this series).

## I&O (4-hour blocks, `periodEnd`, standard labels; shift totals checked by the build and in the app)
| Shift | IV fluid | IV med | PO | Intake | Urine | Emesis | Output | Net |
|---|---|---|---|---|---|---|---|---|
| ED 0130-0700 | 1,942 | 155 | 0 | 2,097 | 720 | 150 | 870 | +1,227 |
| 1 Mon 0700-1900 | 2,075 | 454 | 240 | **2,769** | 1,650 | 0 | **1,650** | +1,119 |
| 2 Mon 1900-Tue 0700 | 500 | 29 | 960 | **1,489** | 1,220 | 0 | **1,220** | +269 |
| 3 Tue 0700-1900 | 0 | 10 | 1,920 | **1,930** | 1,550 | 0 | **1,550** | +380 |
| 4 Tue 1900-Wed 0700 | 0 | 10 | 1,080 | **1,090** | 980 | 0 | **980** | +110 |
| 5 Wed 0700-1900 | 0 | 10 | 1,800 | **1,810** | 1,600 | 0 | **1,600** | +210 |
| 6 Wed 1900-Thu 0700 | 0 | 0 | 960 | **960** | 900 | 0 | **900** | +60 |
| Simulation | 2,575 | 513 | 6,960 | 10,048 | 7,900 | 0 | 7,900 | +2,148 (ED + simulation +3,375) |
Urine, oral and emesis equal the source's per-shift values (source shift 1 oral 240; shift 3 oral 1,920 including 120 mL juice and 720 mL oral hydration; shift 5 1,800 etc.); the IV columns are recomputed from the corrected timeline (source: ED IV fluid 2,000 and IV med 133; shift 1 IV fluid 2,188 and IV med 427; shift 2 IV fluid 500 and IV med 9). IV med = insulin + KCl riders + magnesium (100 mL) + ondansetron + flushes. Each block's note lists the volumes and every void.

## ECGs (acquired -> read; QTc Bazett; images from `casestudy/tools/ecg_image.py` via `gen/ecg/make_ecgs.py`, embedded in the notes)
| Time | Rate / rhythm | PR | QRS | QTc | Findings | K then |
|---|---|---|---|---|---|---|
| Mon 0145 -> 0155 | 118 sinus tachycardia | 142 | 82 | 432 | normal T, no U | 4.1 (pending) |
| Mon 0710 -> 0720 | 98 sinus | 164 | 88 | **478** | **flat T, prominent U (u_amp 0.12), 0.5 mm ST depression V4-V6**; no ectopy (the source's "occasional PACs" removed: the tool draws no PACs) | **3.2** / Mg 1.5 |
| Mon 0935 -> 0945 | 90 sinus | 156 | 86 | 452 | T recovering, small U, isoelectric ST | 3.6 |
| Mon 1915 -> 1925 | 84 sinus | 148 | 82 | 424 | normal | 4.1 |
(The source's second and third ECG times 0710 and 1110 became 0710 and 0935 because the restart moved to 0930.)

## Monitor rows (`monitor.html` `DKA7`; maternal values, F; fetal findings only in the row notes)
Mon 0700 (98, 110/68, 20, 99, 98.2, T 0.2 U 0.12), 0715 (same, hold), 0930 (90, 112/68, 18, 99, T 0.25 U 0.05, restart), 1130 (88, 114/70, 18, normal T), 1900 (84, 114/70, 16, 98.2); Tue 0700 (92, 112/68, 16, 98.1: low glucose), 1630 (84, 114/70: contractions start), 1900 (82, 114/72, 16, 98.2), 2030 (78, 112/68, 15); Wed 0700 (78, 112/70, 15, 98.1), 1900 (76, 110/68, 14); Thu 0700 (74, 112/70, 14, 97.9). The six source checkpoints plus the added rows 0715, 0930, 1130, Tue 1630, 2030 and Wed 1900. Tue 0700 source temp 36.7 C = 98.1 F; values otherwise as in the source.

## Notes (52 chart notes; 17 fetal tracing interpretations)
Triage: provider 0155, **fetal tracing 0145**, RN 0220 (kept), MFM 0240, tracing 0300, endocrinology 0310, pharmacy 0430, tracing 0540, **RN handoff 0655 (kept)**, ECG 0155. Day 1: tracing 0715, **H&P 0735 (replaces the source's unit RN admission note #6)**, ECG 0720, MFM 0850, tracing 0845, endocrinology 0950 (restart), ECG 0945, neonatology 1215, tracing 1130, endocrinology 1145, tracing 1535, MFM 1540, endocrinology transition 1925, ECG 1925, tracing 1930, night OB 2235 (replaces RN #12), tracing 2235. Day 2: night OB 0730 (replaces RN #13), tracing 0730, endocrinology 0845, OB 0935, tracing 0930, dietitian 1105, CDCES 1445, OB event 1725 (replaces RN #18), tracing 1720, tracing 1925, MFM 2005, tracing 2040, pharmacy 2135. Day 3: night OB 0740 (replaces RN #21), tracing 0735, MFM 0915 (BPP), endocrinology 1030, CDCES 1400, social work 1545, dietitian 1710, tracing 1935, OB 1940 (replaces RN #27). Day 4: tracing 0655, OB/MFM discharge note 0700 (replaces RN #28 and the 0830 note, which fall after the window), endocrinology discharge 0700. The source's 0715, 0800 and 0830 Day 4 notes were after the timeline end.

## Discharge plan (Thu 0700 and the notes)
Conditional discharge about 0900. Glargine 20 units at 2100; lispro 1 unit per 10 g (about 6, 7, 8 units) + correction (+1 for 121-150, +2 for 151-180, +3 for 181-210); aspirin 81 mg; prenatal vitamin; ondansetron 4 mg ODT q8h PRN; nasal glucagon 3 mg; blood ketone meter; continuous glucose monitor. Targets fasting under 95, 1 h under 140, 2 h under 120, bedtime 90-120. Teaching: kick counts (10 in 2 hours, left lateral, after dinner), warning signs (fewer than 10 movements in 2 h, 6 or more contractions in an hour not settling with 2 glasses of water, bleeding or leaking, preeclampsia signs, vomiting more than once in 4 h, deep breathing), sick-day rules (never omit basal; carbohydrate 15 g every 1-2 h; blood ketones every 2-4 h: under 0.6 normal, 0.6-1.4 call, 1.5 or more or vomiting go to OB triage), CGM confirmation with a fingerstick and alarm settings. Follow-up Mon 01/04 0900 MFM (NST, AFI) and 1030 endocrinology; weekly NST then twice weekly from 32 weeks; delivery timing individualized by MFM; GBS at 36 weeks.

## Changes from the source (every one made on purpose)
| # | Source | Built |
|---|---|---|
| 1 | **Potassium rule violation**: rider 0415-0515 and riders 0715-1015 ran beside D5 0.45% NaCl + KCl 20 mEq/L 250 mL/h (15 mEq/h) | Carrier **potassium-free during every rider** (150 mL/h at 0420; 100 mL/h 0710-1030); 20 mEq/L bag only with no rider; maximum 10.0 mEq/h per minute; orders, MAR, I&O, notes and the build check updated |
| 2 | **4-hour insulin hold (0700-1115) on a dextrose-free carrier at BHB 2.8** with an 1100 recheck | **Hold 2 h 20 min**, **dextrose kept** (potassium-free D5 0.45% NaCl 100 mL/h), K recheck at the end of rider 2 (0915 -> 0930), restart 3.5 units/h with a third rider; glucose, labs, tracing (Category I at about 1100), I&O and notes recomputed |
| 3 | pH values inconsistent with HCO3/pCO2 | pH recomputed by Henderson-Hasselbalch (within 0.02, enforced); pCO2 31 on Day 2 0100; Winter's and the pregnancy shift documented |
| 4 | No dates; EDD 01/26/2027 | Day 1 Mon 12/28/2026; **EDD 03/20/2027**; 28w2d / 28w3d / 28w4d / 28w5d |
| 5 | Brands (Dexcom G7, Lantus, Humalog, Humulin, Zofran, Baqsimi, Precision Xtra, K-Phos Neutral), ADA/ACOG, "per simulation design rules", "requested", "checkpoint", "Required mathematical proofs" | Generic names; drug brands only in parentheses in order titles; chart text has no meta words (build check); K-Phos tablets dropped |
| 6 | Unit RN notes (#6, 11, 12, 13, 18, 21, 27, 28) and staff names (Rostova, Marcus Vance, Thorne, Park, Jenkins, Maya Lin, Green, Soto, Patricia Vance, Miller) | Provider/MFM/OB notes (H&P, night OB, OB events); triage RN note and 0655 handoff kept; new names (above) |
| 7 | Fetal data inside RN notes only | 17 tracing interpretation notes, HR comments, Fetal/Obstetric assessment rows, stickies, instructor table, monitor row notes; Category II -> I |
| 8 | No VTE statement; aspirin held Day 1 | VTE risk assessment: SCDs + walking, no enoxaparin (rationale in H&P/order/REVIEW); aspirin 81 mg continued from Day 1 0800 |
| 9 | ECG table (0145, 0710, 1110, 1915; "occasional PACs") | 0145, 0710, 0935, 1915 with images; no PACs; U waves via `u_amp` |
| 10 | Ondansetron scheduled q6h incl. 0755 at K 3.2 | PRN q8h with a K/QTc hold rule; no dose at K 3.2 |
| 11 | Phosphate tablets at phos 2.4-2.9 | Monitored, not replaced (series: replace under 1.0); dairy in the plan |
| 12 | fFN/TVCL order written 1910 after the 1845 procedure; "steroids if TVCL under 2.5 cm" | Evaluation order 1715 (swab before any digital exam, then TVCL); decision order 1910; cervical length 3.0 cm or longer reassuring, 2.0-2.9 with fFN, under 2.0 treat; GBS/cefazolin and magnesium plan; insulin increase 30-40% if betamethasone were ever needed |
| 13 | BPP "8/8 (10/10 with NST)" ambiguous; dinner 80 g vs RD 70-75 g; 225 g carbohydrate vs 270 g in the meal list | BPP 8/8 on the four ultrasound components, 10/10 with the NST; meals 60/70/80 g and snacks 15/15/30 g = about 270 g (49% of 2,200 kcal) |
| 14 | D50 25 mL for lows when NPO | D10 150 mL (series standard) and glucagon IM if no IV |
| 15 | Outpatient testing "weekly NST for 3 weeks, twice weekly from 32 w, delivery 36w0d-38w6d" | Weekly then twice weekly from 32 weeks; delivery timing individualized by MFM (usually 37-39 weeks for type 1 diabetes) |
| 16 | Day 1 diet NPO to 1900 vs sips at 1500 | NPO except ice chips/sips until 1130, then clear liquids |
| 17 | Magnesium 1.6 labelled low (it is the bottom of the pregnancy range) | Mg 1.5 (below 1.6) |
| 18 | CBC: Hgb 12.1 only | CBC series with mild physiologic anemia (Hgb 10.8-10.9) |
| 19 | No lipase / liver tests for epigastric pain at 28 weeks | AST, ALT, lipase, uric acid normal at 0145 |
| 20 | Source Day 4 notes at 0715, 0800, 0830; NST at 0700 | NST 0630-0650; notes folded into 0700 (timeline ends 0700) |

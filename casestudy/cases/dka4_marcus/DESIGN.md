# DKA patient 4 of 7: Marcus Reyes, DKA with AKI on CKD G3b (single source of truth)

Simulation: **Thu 2026-11-05 07:00 to Sun 2026-11-08 07:00 (72 h)** (Day 1 = Thu 11/05 ... Day 4 = Sun 11/08). Checkpoints at every shift change: **Thu 0700, Thu 1900, Fri 0700, Fri 1900, Sat 0700, Sat 1900, Sun 0700** ("End of shift" jumps to the next one; 1 h / 4 h steps also work). Everything below is time-gated to the minute. Series conventions: `../DKA_SERIES.md` (including the series potassium rule and the clot-prophylaxis rule). Provenance: the clinical design was written by another AI and kept unchanged in `SOURCE_chatgpt_design.md`; this file records every number as built and the changes made to it (see "Changes from the source design" at the end).

- **Vital signs are in the chart ONLY up to the 0700 arrival set** (ED 0200, 0300, 0500 and the 0700 step-down set; temperatures converted from the design's Celsius). Later vitals come from the bedside monitor (monitor.html `DKA4` rows, MRN SIM-40504) and the students chart them. Notes contain no numeric vital signs after 0700 (ECG rates excepted).
- Baseline nursing assessment: ED 0200 and step-down 0700 only.
- **Point-of-care glucose IS in the chart, time-gated**: hourly 0200-2100 on and around the infusion (including the potassium hold), then 0200 / 0645 / 0700 / 0730 / premeal / bedtime checks as listed in the design, ending with 128 at Day 4 0700.
- MAR: ED doses and infusions started in the ED are `given`; the saline 100 mL/h and the insulin infusion show "0700 Running". **Every dose after Thu 0700 is `due`.** Hold, restart and rate changes of the insulin infusion and the fluid changes are student actions driven by time-gated protocol orders (0900 dextrose and 4 units/h, 1100 hold and KCl bag 1, 1200 KCl bag 2, 1300 restart and D10W, 1900 transition, Fri 0715 reduced doses).
- Labs, notes, orders, devices, I&O, problems and stickies are time-gated. **Result times are the design's own** (ED 0220, 0420, 0510 K-only, 0700, 0900, 1100, 1200 K-only, 1300, 1500, 1900; Fri 0700, 1900, 2000 K-only; Sat 0700, 1900; Sun 0700). Orders placed before their start show "Pending" until the start.

## Patient
- **Marcus Reyes**, 31-year-old man, DOB **1995-04-18**, MRN **SIM-40504** (the source's SIM-MR-3105 is not used), he/him. Height 178 cm, **weight 80.0 kg** (ED measured; dosing weight for the whole stay), unit arrival standing weight 80.5 kg, usual well weight about 82.0 kg, BMI 25.2. **Allergies: none known. Full Code**; partner Elena Cruz is the designated contact (with his consent). Unit: **step-down / telemetry, room SD-5** (invented; the design names none).
- **Type 1 diabetes since age 9**; one prior DKA at 22. Home: glargine U-100 24 units at 2100; lispro U-100 1 unit per 12 g carbohydrate + 1 unit per 50 mg/dL above 150 before meals (12-18 units/day); pens, CGM (sensor expired during the illness) and backup meter, no pump. HbA1c **8.9%** (resulted Day 1 0700 from the 0200 specimen). Skipped glargine 11/03 and 11/04 and stopped meal insulin when he stopped eating ("no food means no insulin"): a knowledge gap, not a cost or supply problem.
- **Kidney**: congenital posterior urethral valves repaired in infancy, residual dysplasia/scarring -> **CKD G3b**, baseline creatinine 2.0-2.2 (2.1 on 10/22), baseline eGFR about 42, UACR 180 mg/g (A2), followed by nephrology. No dialysis, transplant, catheter or heart failure. **Home medicines**: losartan 25 mg every morning (HELD all stay and at discharge), cholecalciferol 1,000 units daily. No SGLT2 inhibitor, metformin, potassium or phosphate product, NSAID or contrast exposure.
- Social: IT technician, lives with Elena, insured, stable housing and food; never smoked, occasional alcohol (none during illness), no drugs. Father hypertension, mother hypothyroidism.
- **AKI staging (stated in the notes)**: creatinine 3.4 / 2.1 = 1.62 and peak 3.5 / 2.1 = 1.67 times baseline = **stage 1 by the creatinine criterion** (1.5-1.9 times). Urine 25 mL/h for 6 hours (1200-1800) = 0.31 mL/kg/h at 80 kg: under 0.5 mL/kg/h (40 mL/h) for 6-12 h = also stage 1 by urine output (stage 2 needs 12 h). Neither sets a new chronic stage; the shift-1 12-hour average (0.47 mL/kg/h) does not replace the hourly pattern.
- People (fictional; unit RN notes are NOT pre-written, students are the RNs): ED physician **W. Cole, MD**; ED RN **B. Hall, RN**; hospital medicine days **I. Morgan, MD**, nights **R. Voss, MD**; nephrology **D. Lin, MD**; endocrinology **G. Tran, MD**; pharmacist **N. Gallagher, PharmD**; diabetes educator **E. Marchetti, RN, CDCES**; dietitian **J. Yamada, RDN**; case manager **H. Sorensen, MSW**; ECG reader (unit) **C. Lombardi, MD**; radiology **L. Brandt, MD**. None repeats a first name or surname used for dka1-3 staff, and none equals a series patient's name.

## Story before the unit (ED Thu 0200-0700)
Three days of sore throat, myalgias, dry cough, nausea and poor intake began 11/02; he stopped meal insulin when he stopped eating and skipped glargine 11/03 and 11/04. The evening before: thirst, polyuria then less urine, diffuse abdominal discomfort, repeated nonbloody vomiting. His partner brought him in at **Thu 0200**. No dysuria, flank pain, chest pain, toxic ingestion or NSAID use.
| Time | ED event |
|---|---|
| 0200 | Two peripheral IVs (right forearm 18 g, left forearm 20 g), no central line; labs and respiratory PCR collected; continuous ECG; POC glucose 620. **NS 250 mL over 30 min** (0200-0230) |
| 0210 / 0220 | ED ECG acquired / read (sinus tachycardia 116, no peaked T); chemistry, ketones and gas released 0220: **glucose 620, K 5.8, HCO3 10, pH 7.22, BHB 7.2, creatinine 3.4** |
| 0225 | Ondansetron 4 mg IV over 2 minutes once (2 mL); emesis 100 mL about 0220 |
| 0230 | Second NS 250 mL over 30 min after repeat lung/perfusion assessment (clear) |
| 0250 / 0320 | Urine specimen / urinalysis released (glucose 4+, ketones 3+, protein 1+, LE/nitrite negative, WBC 0-2, RBC 0-2) |
| 0300 | **Regular insulin 8 units/h (0.1 x 80 kg), 100 units/100 mL, no bolus**; NS 100 mL/h 0300-0900 (400 mL delivered by 0700) |
| 0400 / 0420 | Respiratory PCR negative; repeat chemistry released: K 5.0, glucose 540, creatinine 3.3 |
| 0500 / 0510 | Potassium-only check (2 h after insulin): **K 4.7** |
| 0640 / 0700 | Transfer specimens collected / released at arrival (K 4.2, BHB 4.8, pH 7.29); HbA1c 8.9% |
| 0700 | Step-down arrival: sinus rhythm 96, lungs clear, weight 80.5 kg |
ED totals 0200-0700 (pre-shift, not added again to shift 1): IV fluid 900 (250 + 250 + 400), insulin carrier 32, ondansetron 2, flushes 20, PO 0 -> **intake 954**; urine 250, emesis 100 -> **output 350**; net **+604**.

## Vital signs (ED and arrival only; Celsius from the design converted to F)
| Time | Temp | HR | BP | RR | SpO2 | Rhythm / note |
|---|---|---|---|---|---|---|
| Thu 0200 ED | 37.8 C = 100.0 F | 118 | 104/62 | 28 | 98% RA | Sinus tachycardia, deep respirations, lungs clear |
| 0300 | 37.7 C = 99.9 F | 110 | 112/68 | 26 | 98% | after two small boluses |
| 0500 | 37.5 C = 99.5 F | 102 | 116/70 | 24 | 98% | nausea improving |
| 0700 arrival | 37.3 C = 99.1 F | 96 | 118/72 | 22 | 97% | sinus rhythm, alert |

## Labs (sample -> result time as in the design; Na, K, Cl, HCO3 mmol/L; BUN, Cr, glucose, phos, Mg, Ca mg/dL)
All gases are venous. HCO3 here is the serum total CO2 used for every anion gap. eGFR is the automatic CKD-EPI 2021 value for a 31-year-old man (the design's numbers equal the equation to the whole number); the chart reference column says it is NOT a measured GFR and is unreliable while creatinine changes, and the notes say not to dose from it alone.
| Sample -> result | Na | K | Cl | HCO3 | BUN | Cr | eGFR | Glu | AG | pH | pCO2 | BHB | Phos | Mg | Ca |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Thu 0200 -> 0220 | 130 | 5.8 | 95 | 10 | 64 | 3.4 | 24 | 620 | 25 | 7.22 | 25 | 7.2 | 5.6 | 2.1 | 9.0 |
| 0400 -> 0420 | 132 | 5.0 | 99 | 12 | 62 | 3.3 | 25 | 540 | 21 | 7.25 | 28 | 6.4 | 4.8 | 2.0 | 8.8 |
| 0500 -> 0510 (K only) | | 4.7 | | | | | | | | | | | | | |
| 0640 -> 0700 | 135 | 4.2 | 103 | 14 | 59 | 3.2 | 26 | 380 | 18 | 7.29 | 30 | 4.8 | 3.8 | 1.9 | 8.6 |
| 0840 -> 0900 | 136 | 3.6 | 105 | 15 | 58 | 3.3 | 25 | 250 | 16 | 7.29 | 32 | 3.6 | 3.0 | 1.8 | 8.5 |
| 1040 -> 1100 | 137 | **3.4** | 106 | 16 | 58 | 3.4 | 24 | 195 | 15 | 7.32 | 32 | 2.4 | 2.2 | 1.8 | 8.4 |
| 1150 -> 1200 (K only) | | 3.5 | | | | | | | | | | | | | |
| 1240 -> 1300 | 138 | 3.8 | 107 | 17 | 59 | 3.5 | 23 | 215 | 14 | 7.33 | 33 | 1.8 | 1.8 | 1.8 | 8.4 |
| 1440 -> 1500 | 138 | 4.3 | 108 | 18 | 58 | 3.5 | 23 | 203 | 12 | 7.35 | 34 | 1.0 | 1.7 | 1.8 | 8.4 |
| 1840 -> 1900 | 138 | 4.6 | 108 | 21 | 56 | 3.3 | 25 | 180 | 9 | 7.38 | 37 | **0.4** | 1.9 | 1.9 | 8.5 |
| Fri 0640 -> 0700 | 139 | 4.8 | 109 | 22 | 50 | 3.0 | 28 | 62 | 8 | | | 0.3 | 2.2 | 1.9 | 8.6 |
| Fri 1840 -> 1900 | 138 | **5.2** | 108 | 23 | 44 | 2.8 | 30 | 168 | 7 | | | | 2.5 | 1.9 | 8.7 |
| 1950 -> 2000 (K only) | | 5.1 | | | | | | | | | | | | | |
| Sat 0640 -> 0700 | 139 | 4.8 | 108 | 23 | 39 | 2.5 | 34 | 134 | 8 | | | | 2.8 | 2.0 | 8.8 |
| Sat 1840 -> 1900 | 139 | 4.6 | 107 | 24 | 34 | 2.3 | 38 | 158 | 8 | | | | 3.1 | 2.0 | 8.9 |
| Sun 0640 -> 0700 | 139 | 4.5 | 107 | 24 | 30 | 2.2 | 40 | 128 | 8 | | | | 3.2 | 2.0 | 9.0 |
Also: ED 0220 albumin 4.0, lactate 1.5, WBC 14.2 / Hgb 14.4 / platelets 268; Fri 0700 CBC 9.8 / 12.4 / 240; Sun 0700 CBC 7.6 / 12.3 / 244 (mild anemia fits CKD and rehydration; no bleeding). Reference intervals: Na 135-145, K 3.5-5.0, Cl 98-107, HCO3 22-29, BUN 7-20, creatinine 0.7-1.3, phos 2.5-4.5, Mg 1.7-2.4, Ca 8.6-10.2, anion gap 8-12, venous pH 7.31-7.41, venous pCO2 41-51, BHB under 0.6.

**Arithmetic (`node gen/physiology.js` reprints all of it and `assemble.js` fails the build on any anion-gap mismatch)**
- Anion gap = Na - Cl - HCO3 (no K): 25, 21, 18, 16, 15, 14, 12, 9, 8, 7, 8, 8, 8 (all identical to the source). Gap 7 on Fri 1900 is a mildly low gap, not recurrent ketoacidosis.
- Corrected Na = Na + 1.6 x (glucose - 100)/100: ED 130 + 8.3 = **138.3**; 0420 139.0; 0700 139.5; 0900 138.4; 1100 138.5; 1300 139.8; 1500 139.7; 1900 139.3 (stable: no indication for hypotonic fluid; the D10W free water is watched through the measured Na, 138-139).
- Effective osmolality = 2 x Na + glucose/18: ED **294.4**, total osmolality with BUN/2.8 = **317.3** (DKA, no HHS overlap).
- Winter's (arterial pCO2 = 1.5 x HCO3 + 8 +/- 2): ED 23 +/- 2, venous 25 (venous reads a few mmHg higher); 0420 26 vs 28; 0700 29 vs 30; 0900 30.5 vs 32; 1100 32 vs 32; 1300 33.5 vs 33; 1500 35 vs 34. At 1900 the formula gives 39.5 +/- 2 against a venous 37: pH 7.38 is no longer acidotic, so Winter's is not used there (a venous value slightly under the predicted arterial range is not read as a respiratory disorder). Every pH matches Henderson-Hasselbalch with the serum CO2 to within 0.01 (7.22, 7.25, 7.29, 7.29, 7.32, 7.33, 7.35, 7.38).
- Insulin: 0.1 x 80 = **8 units/h**; 0.05 x 80 = **4 units/h**. Glucose 600 -> 240 over 0300-0900 = **60 mg/dL/h** every hour (goal 50-75), then 35, 15, rising 20, 10 while held, 175-190 on D10W (goal 150-200). Total regular insulin 32 (ED) + 16 + 8 + 24 + 8 = **88 units in 88 mL**.
- Dextrose: D5NS 100 mL/h = 5 g/h; D10W 50 mL/h = 5 g/h (same dose, half the volume); D10W rescue 125 mL = 12.5 g; apple juice 120 mL = 15 g.
- Fluids vs 80 kg: boluses 250 mL = 3.1 mL/kg each; ED IV fluid 900 mL = 11.3 mL/kg; 100 mL/h = 1.25 mL/kg/h. Shift-1 net +918 mL; weight 80.5 -> 81.0 -> 80.6 -> 80.1 kg (measured, not computed from balance).

## POC glucose (mg/dL)
ED: 0200 620, 0300 600, 0400 540, 0500 480, 0600 420. Unit: 0700 360, 0800 300, 0900 240, 1000 205, 1100 190, 1200 210, 1300 220, 1400 210, 1500 200, 1600 190, 1700 185, 1800 180, 1900 178, 2000 190, 2100 214. Fri 0200 108, **0645 58**, 0700 92, 0730 106, 0800 112, 1200 174, 1800 188, 2100 154. Sat 0200 118, 0800 132, 1200 166, 1800 158, 2100 146. Sun 0200 122, 0700 128. Serum 62 (Fri 0640, released 0700) precedes the juice; POC 92 at 0700 follows it.

## IV timeline and potassium (`node gen/infusions.js`)
| Time | Fluid | Insulin | Potassium |
|---|---|---|---|
| 0200-0300 | NS 250 mL over 30 min x2 | | none |
| 0300-0900 | NS 100 mL/h (no K) | 8 units/h | none |
| 0900-1100 | **D5NS 100 mL/h** (glucose 240) | **4 units/h** | none |
| 1100-1200 | D5NS 100 mL/h | **HELD** (K 3.4) | **KCl 10 mEq/100 mL bag 1** |
| 1200-1300 | D5NS 100 mL/h | HELD (K 3.5 not confirmed) | **KCl 10 mEq/100 mL bag 2** |
| 1300-2100 | **D10W 50 mL/h** (crackles, urine 25 mL/h) | restart **4 units/h** (K 3.8) | none |
| 2100 | all IV off | stopped after the 2-hour overlap with glargine (1900) | none |
- **Peripheral potassium rule, renal version**: maximum **10 mEq/h** in every minute (checked minute by minute in `assemble.js`); the two bags run back to back with no overlap and never alongside potassium in a carrier (none exists); total potassium **20 mEq**. Bags are authorized one at a time, each only if the previous hour's urine was at least 40 mL (0.5 mL/kg/h): 50 mL at 1100 and 1200. No 40 mEq/L bag, no maintenance additive, no potassium phosphate. Riders add 100 mL/h to the D5NS (200 mL/h total for two hours: counted as IV med; contributes to the 1300 crackles and is a teaching point).
- Restart rule written in the orders: K **3.5 or higher AND prescriber confirmation**. At 1200 K is exactly 3.5, only 0.1 above the 3.4 before 10 mEq, so the prescriber does not confirm (note and order say so); the 1300 value 3.8 does.
- Insulin line: dedicated (right forearm 18 g); fluids and potassium share the left forearm 20 g through a compatible connection. Flushes (IV med): Thu 1000, 1600, 2105 (10 mL per IV = 20), Fri 0900, 1530, 2100, Sat 0500, 1000, 2200 = 20 mL per shift in shifts 1-4, 10 in shifts 5-6.

## Orders (source O01-O26; O16 not built)
| Written | Order |
|---|---|
| Thu 0200 | IV access and flush rules (O01); ECG 0210 (O01a); NS 250 mL x2 (O02, O03); NS 100 mL/h (O04); ondansetron (O05); regular insulin infusion (O06); lab schedule (O07); **renal-modified potassium protocol (O09)**; POC glucose hourly |
| Thu 0645 (start 0700) | Admit step-down/telemetry, code status, monitoring/I&O/notify thresholds (O08, **urine under 40 mL/h for 2 h**), consults (O10), losartan hold / NSAIDs / contrast / renal dosing (O11), NPO (O17), hypoglycemia rescue (O22: juice, D10W 125 mL, glucagon 1 mg IM), activity, flushes |
| Thu 0700 / 0900 | Extra 0840 panel (O07a); **0900: D5NS + insulin 4 units/h (O12)** |
| Thu 1100 / 1105 / 1200 | **K 3.4: hold insulin + KCl bag 1 (O13)**; ECG (O13a); 1150/1240 draws (O07b); **K 3.5: bag 2 authorized, insulin stays held (O13b)** |
| Thu 1300 | **Restart 4 units/h, D10W 50 mL/h, no bolus (O14)**; bladder scan + non-contrast ultrasound (O15) |
| Thu 1855 / 1900 | ECG 1855 (O19a); diet (O18); **glargine 18 units + lispro 3 units + correction scale; drip and D10W continue 2 h (O19)**; lab/POC schedule (O20); cholecalciferol from Fri 0900 (O21) |
| Fri 0700 / 0715 | Extra 0730 POC (O20a); **glargine 14 units at 1900, lispro 2 units after meals, correction before meals only (O23)** |
| Fri 1900 | **K 5.2: ECG + repeat K 1950 (O24)** |
| Sat 1500 / Sun 0650 | Discharge preparation (O25); discharge (O26: no heparin to stop) |
Order text never states a later event (checked with a script: no clock time in an order or sticky later than its own time except the planned lab/ECG times and next doses).

## MAR summary
ED (`given`): NS 250 x2, ondansetron, NS 100 mL/h and insulin 8 units/h (both "0700 Running"). Due: D5NS 0900, KCl 1100, KCl 1200, D10W 1300, flushes, glargine 18 Thu 1900, lispro 3 Thu 1900, correction Thu 1900 and 2100 (1 unit for 214), cholecalciferol Fri/Sat 0900, lispro 2 units after meals 0820/1220/1820 Fri and Sat, correction AC only, glargine 14 Fri/Sat 1900. Home losartan: not on the MAR (held by order). **No heparin or enoxaparin anywhere** (build fails if one appears).

## I&O (4-hour blocks, `periodEnd`, standard labels; shift totals checked by the build and in the app)
| Shift | IV fluid | IV med | PO | Intake | Urine | Output | Net |
|---|---|---|---|---|---|---|---|
| ED 0200-0700 | 900 | 54 | 0 | 954 | 250 | 350 (urine + 100 emesis) | +604 |
| 1 Thu 0700-1900 | 900 | 268 | 200 | **1,368** | 450 | **450** | +918 |
| 2 Thu 1900-Fri 0700 | 100 | 28 | 700 | **828** | 1,000 | **1,000** | -172 |
| 3 Fri 0700-1900 | 0 | 20 | 1,600 | **1,620** | 1,450 | **1,450** | +170 |
| 4 Fri 1900-Sat 0700 | 0 | 20 | 600 | **620** | 850 | **850** | -230 |
| 5 Sat 0700-1900 | 0 | 10 | 1,800 | **1,810** | 1,700 | **1,700** | +110 |
| 6 Sat 1900-Sun 0700 | 0 | 10 | 500 | **510** | 850 | **850** | -340 |
| Simulation | 1,000 | 356 | 5,400 | 6,756 | 6,300 | 6,300 | +456 (ED + simulation +1,060) |
Shift-1 IV med 268 = insulin 48 + KCl 200 + flushes 20; IV fluid 900 = NS 200 + D5NS 400 + D10W 300. Shift-1 urine 450 = 50 x 5 (0700-1200) + 25 x 6 (1200-1800) + 50 (1800-1900); the 4-hour blocks are 200 / 125 / 125. Shift-2 PO 700 includes the 120 mL apple juice at 0645.

## ECGs (acquired -> read; QTc Fridericia; images from `casestudy/tools/ecg_image.py` via `gen/ecg/make_ecgs.py`)
| Time | Rate / rhythm | PR | QRS | QTc | T waves | Latest K then |
|---|---|---|---|---|---|---|
| Thu 0210 -> 0220 | 116 sinus tach | 152 | 90 | 426 | No peaked T, no P loss, no widening (a normal tracing does not exclude hyperkalemia) | 5.8 |
| Thu 1105 -> 1110 | 92 sinus | 156 | 88 | 438 | Mild nonspecific T-wave flattening, tiny U waves at most (not prominent) | 3.4 |
| Thu 1855 -> 1900 | 88 sinus | 158 | 88 | 424 | Normal | 4.6 |
| Fri 1910 -> 1920 | 80 sinus | 160 | 90 | 422 | No peaked T or QRS widening despite K 5.2 (repeat 5.1 not yet known) | 5.2 |
Decision: at K 5.8 and 5.2 the T waves are NOT peaked (design table). The monitor shows ordinary T waves at those times too; peaked T is deliberately absent so a normal tracing cannot be used to clear the potassium. At K 3.4 the T waves are low (monitor `tAmp` 0.18, `uAmp` 0.08, the low end of the series range).

## Monitor rows (`monitor.html` `DKA4`, MRN SIM-40504; all other values are the design's section 7, temperatures in F)
| Time | HR | BP | RR | SpO2 | Temp F | Rhythm / T | Note |
|---|---|---|---|---|---|---|---|
| Thu 0700 | 96 | 118/72 | 22 | 97 | 99.1 | sinus, T 0.3 | arrival |
| Thu 0900 | 92 | 116/70 | 20 | 97 | 99.0 | sinus, T 0.25 | glucose 240, K 3.6 (instructor choice) |
| Thu 1100 | 92 | 118/72 | 18 | 98 | 98.8 | sinus, T 0.18, U 0.08 | K 3.4, insulin held (instructor choice) |
| Thu 1300 | 94 | 126/78 | 20 | 95 | 98.8 | sinus, T 0.25, U 0.04 | crackles, urine 25 mL/h (instructor choice) |
| Thu 1900 | 88 | 124/76 | 18 | 96 | 98.8 | sinus, T 0.3 | DKA resolved |
| Fri 0645 | 104 | 130/80 | 18 | 98 | 98.6 | sinus tach | glucose 58 (instructor choice) |
| Fri 0700 | 82 | 122/74 | 16 | 97 | 98.4 | sinus | recovered |
| Fri 1900 | 80 | 126/78 | 16 | 98 | 98.2 | sinus | K 5.2, ordinary T |
| Sat 0700 | 76 | 124/76 | 16 | 98 | 98.2 | sinus | |
| Sat 1900 | 74 | 122/76 | 16 | 98 | 98.1 | sinus | |
| Sun 0700 | 72 | 120/74 | 16 | 98 | 98.1 | sinus | discharge |
The 0900, 1100, 1300 and Fri 0645 rows are mid-shift rows added for this build (the design lists checkpoint rows only); the 0645 recovery and 1900 rows follow the design.

## Notes (35; ED nursing notes only; no unit RN notes; each quotes only what already existed)
ED: provider 0225, RN 0330, provider 0650, RN handoff 0655 (SBAR with the ED totals), ECG 0220. Day 1: H&P 0745, pharmacy 0830, hospital medicine 0910 (dextrose), nephrology 1000, hospital medicine 1115 (K 3.4), 1215 (K 3.5), nephrology 1315 (crackles, low output), ECG 1110, ultrasound report 1500, endocrinology 1520, hospital medicine 1905 (resolution, transition), ECG 1900, night 2130. Day 2: night 0705 (low glucose), endocrinology 0745, nephrology 0930, educator 1030, dietitian 1130, pharmacy 1300, case management 1430, hospital medicine 1740, ECG 1920, night 2010 (K 5.2). Day 3: night 0705, nephrology 0900, educator 1030, case management 1500, night 1930. Day 4: night 0645, discharge note 0700. `node gen/check_notes.js` lists only false positives (thresholds and plans).

## Discharge plan (Sun 0700 and the notes)
Home with Elena after final reconciliation and IV removal. **Glargine 14 units at 1900** (not the old 24); **lispro 2 units after each meal once at least half is eaten**, skip the meal component for a skipped meal and call for smaller meals; correction before meals only (201-250 +1, 251-300 +2, 301-350 +3, over 350 call and check ketones), at least 4 hours apart, no bedtime correction. Cholecalciferol 1,000 units daily. **Losartan HELD** (nephrology decides after the Monday 11/09 0900 BMP). Nasal glucagon 3 mg. No potassium or phosphate supplement, binder, diuretic or heparin. Teach-back: basal continues without food, meal and correction doses, 15 g rule and glucagon (partner), meter and ketones, losartan hold, NSAIDs and salt substitutes to avoid. Fluids: divided, about 2-2.3 L/day while eating and voiding; weight daily, call for about 1 kg gain, swelling or less urine. Follow-up: diabetes-team call Mon 11/09, BMP Mon 0900, endocrine visit within a week, nephrology within a week, primary care 1-2 weeks, reassess kidney recovery at about 3 months.

## Changes from the source design (`SOURCE_chatgpt_design.md` is kept unchanged)
1. **Subcutaneous heparin removed entirely** (source O16, MAR, notes #06 and #30, section 10): he is 31, ambulatory, BMI 25.2, with no documented clot-risk factor (CKD G3b alone is not one), so the series clot-prophylaxis rule gives no prophylaxis. The H&P and pharmacy note state the decision and "reassess if immobile". Source I&O unchanged (SC doses carry no volume).
2. **All links and real organization, program and product-brand specifics removed**: no KDIGO, NIDDK or PMC links or names (the 2024 consensus is cited generically as in the other patients; the AKI criteria are described, not named), no manufacturer prescribing-information link or product name for the nasal glucagon. Insulin and ondansetron use the series style: generic with the brand in parentheses.
3. **Unit RN notes are not pre-written** (source #04, 07, 09, 10, 14, 15, 22, 24, 29): the 0710 arrival note became the ED RN handoff (0655); the others became hospital medicine / night hospital medicine notes (0910 dextrose, 1115 K 3.4, 1215 K 3.5, 2130 infusion stopped, Fri 0705 low glucose, 1740 meals, Sat 0705 overnight, Sun 0645 final night). ED RN notes (#02) stay. Added: ultrasound report (1500) and bladder scan result (1310) as chart results.
4. **Meta and out-of-universe wording removed** from the chart: the "guideline reconciliation for faculty" and the "supplemental student calculation rule" passages (instructor-only: see INSTRUCTOR_NOTES.md), "faculty monitor presets", "simulation boundary", "requested", "simulated vomiting scenario" (now "asked what he would do if he were vomiting"), "Do not document tomorrow's chemistry as known".
5. **Staff names**: initials-plus-surname style of the series; every source name that repeated a series staff name or patient name was replaced (source Priya Shah -> N. Gallagher, Leah Brooks -> G. Tran, Hannah Reed -> H. Sorensen, Owen Price -> R. Voss, Rachel Kim -> J. Yamada, Sofia Martinez -> E. Marchetti, Nina Patel dropped with the unit RN notes, others changed as listed above). MRN SIM-40504; room SD-5 added.
6. **ECGs**: the design's four rows used as written; times acquired 0210/1105/1855/1910 with orders (O01a, O13a, O19a, O24 ECG) and reads at the design's times (0220, 1110, 1900, 1920). The 1855 acquisition is a build choice (the design lists 1900/1900).
7. **Restart wording unified with the series**: "K 3.5 or higher with prescriber confirmation"; at K exactly 3.5 (1200) the prescriber does not confirm (source: "above 3.5"). Source O09 ("adequate urine output") made concrete: at least 40 mL in the previous hour (0.5 mL/kg/h).
8. **Mid-shift monitor rows added** (0900, 1100, 1300, Fri 0645) plus the checkpoints; the monitor plan follows the series (flat T with small U at K 3.4; no peaked T at K 5.8 or 5.2 by design).
9. Results timing follows the design (20-40 min delays) rather than the series standard (gas 15, BMP 45, BHB 55).
10. Added clinical items the design implies: calcium and albumin, lactate, respiratory PCR and UA as lab rows; apple juice (lower in potassium) named for the rescue; the problem list; the stickies; the device list.

## Rebuild
`python3 casestudy/cases/dka4_marcus/gen/ecg/make_ecgs.py` (ECGs only), `node casestudy/cases/dka4_marcus/gen/assemble.js`, then `node tools/make-prebuilt.js`. `node gen/physiology.js` prints the anion gaps, corrected sodium, osmolality, Winter's and Henderson-Hasselbalch checks, glucose fall rates, flush totals and I&O totals; `node gen/infusions.js` prints the fluid, insulin and KCl volumes per block and the maximum potassium rate; `node gen/check_notes.js` checks note time-gating.

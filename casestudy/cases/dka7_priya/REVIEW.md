# Self-review: Priya Desai, DKA in pregnancy at 28 weeks (CS-DKA7-DESAI)

Reviewer stance: antepartum nurse educator, maternal-fetal medicine physician, adult endocrinologist, clinical pharmacist. Scope: DESIGN.md, INSTRUCTOR_NOTES.md, gen/*.js (infusions, physiology, assess, treatments, make_notes, assemble, check_notes), gen/ecg/make_ecgs.py, notes/*.json, patient.json, the monitor.html `DKA7` rows, and the case running in the app (Playwright, Chromium, repo served locally).

Rebuilt with `python3 gen/ecg/make_ecgs.py`, `node gen/make_notes.js`, `node gen/assemble.js`, `node tools/make-prebuilt.js`. Import validation: **0 errors**, 10 warnings (the same "problem not clearly addressed in a hospitalist progress note" string heuristic every case shows). No page or console errors in the EHR or the monitor. **No app code changed** except `monitor.html` (the DKA7 rows and the DKA_SERIES line) and `prebuilt/index.json` (generated). README change log and the version number were not touched (no instruction).

## The ten required corrections from the review
1. **Potassium rule.** Source: rider 0415-0515 and three riders 0715-1015 beside D5 0.45% NaCl + KCl 20 mEq/L at 250 mL/h (15 mEq/h). Built: the carrier is potassium-free during every rider (150 mL/h with rider 1; 100 mL/h 0710-1030), the 20 mEq/L bag runs only when no rider runs; **maximum 10.0 mEq/h in every minute from 0130 Mon to 0700 Wed, 0 minutes with a rider and a potassium-containing carrier, never two riders at once** (checked in `gen/infusions.js` and `assemble.js`). Orders, MAR, I&O (IV fluid and IV med volumes), notes, stickies and DESIGN updated.
2. **Insulin hold in pregnancy.** Source: hold 0700-1115 (4 h 15 min) with dextrose-free saline while BHB 2.8. Built: **hold 0710-0930 (2 h 20 min)**, **dextrose kept** (potassium-free D5 0.45% NaCl 100 mL/h; the build fails for any dextrose-free minute 0300-2130 and for insulin running during the hold), K recheck after rider 2 (collected 0915, released 0930: 3.6), restart 3.5 units/h with the prescriber's confirmation plus rider 4 (the source's total of four riders, 40 mEq, is preserved: ED 1 + hold 2 + restart 1). Glucose 0700-1000 recomputed (152, 166, 182, 188, 172 with D5 versus 152, 164, 174, 181 dextrose-free); labs (new 0915 panel; 1100 K 3.8); fetal course (first Category I at about 1100 instead of 1500-1900); I&O; notes; later events preserved (resolution on the 1850 draw, glargine/lispro with 2-hour overlap and drip off 2130, Day 2 0700 low glucose and reduced doses, Day 2 evening contractions with fFN, cervical length and the betamethasone hold, discharge).
3. **Acid-base.** Every gas now has a pH computed by Henderson-Hasselbalch from its bicarbonate and pCO2 and the build fails if they differ by more than 0.02 (they are equal to 2 decimals): 7.24, 7.30, 7.34, 7.34, 7.35, 7.39, 7.42, 7.43. pCO2 stays in the pregnancy range (24 at HCO3 10 rising to 30-31 at the pregnancy baseline). Winter's formula and the **pregnancy shift** are documented (Winter's predicts 38 at a bicarbonate of 20; the pregnancy baseline is 30).
4. **Dates and gestation.** Day 1 Mon 12/28/2026 (ED 0130) to Thu 12/31 0700; EDD 03/20/2027 = Day 1 + 82 days; 28w2d, 28w3d, 28w4d, 28w5d in every note.
5. **Brands, programs, meta phrasing.** Generic names; brands only in parentheses after the generic in order titles; no web links or organizations; build check bans the source's meta words and brand names in chart text.
6. **Series rule and names.** No unit RN notes (triage RN note 0220 and the 0655 handoff kept; eight source RN notes converted to H&P, night OB, OB event and evening notes). No staff first name equals a series patient first name; none repeats an earlier case's staff first name or surname (grepped over all cases).
7. **Fetal data.** 17 time-gated "Fetal Heart Rate Tracing Interpretation" notes (each after its tracing), HR flowsheet comments at 0130, 0250, 0530 and 0700, a Fetal/Obstetric assessment section (0130 and 0700), stickies, INSTRUCTOR_NOTES table, monitor row notes. NICHD Category II -> I (about 1100) consistent with correcting acidosis, volume and potassium; no emergent cesarean with the MFM rationale in the 0240 consult, the order, the 0715/0850/1130 notes and the discharge note.
8. **Positioning, allergy, aspirin, VTE.** Left lateral position order; penicillin allergy (rash) with the cefazolin plan; aspirin 81 mg continued (Day 1 0800 with a sip); **no enoxaparin** with a documented assessment (age 29, BMI 25.7, no prior clot or thrombophilia, 3-day stay with walking from Day 2, possible early delivery and neuraxial timing) plus sequential compression devices (see open question 1).
9. **ECGs.** Four records with images (0145 K pending, 0710 K 3.2 flat T and U via `u_amp`, 0935 K 3.6 recovering, 1915 normal). The source's "occasional PACs" was removed (the tool draws none).
10. **Monitor.** 12 rows, maternal values only, mid-shift rows at the story changes (0715 hold, 0930 restart, 1130 Category I, Tue 1630 contractions, Tue 2030 resolved) plus the six checkpoints and the closing row; pregnancy-specific ranges are in the lab references and notes.

## Checked and found correct
- **Anion gap** (build fails on mismatch): 26, 22, 18, 18, 16, 14, 12, 12, 11, 11, 11, 11 (source values kept where the source had them). **Corrected sodium** (+1.6/100): 136.27, 136.25, 136.83, 137.38, 136.77, 137.61, 137.51, 137.29 (normal; no HHS; effective osmolality 280-282). **Delta-delta** 1.4.
- **Winter's** at every gas (table in DESIGN): measured 24, 25, 27, 27, 28, 29, 30, 31 versus 23, 26, 29, 29, 30.5, 33.5, 36.5, 38 (+/- 2); pregnancy-adjusted 18-30. Appropriate compensation; the 1100 value (28) is 0.5 below the window and later values are lower as the bicarbonate nears its pregnancy baseline (documented, not an error).
- **Resolution rule.** Not resolved at 1100 (BHB 1.9) or 1500 (BHB 1.1); resolved at 1850 (BHB 0.5, pH 7.42, HCO3 19). The source's two-of-four rule would have said resolved at 1100-1500 (the 1145 note refuses).
- **Potassium vs insulin thresholds.** 4.1 (insulin started), 3.6, **3.2 hold**, 3.6 restart (3.5 or higher AND prescriber), then 3.8, 3.9, 4.1, 4.0, 4.1, 4.2, 4.1, 4.2. Hold 2 h 20 min.
- **Potassium minute by minute.** Max 10.0 mEq/h; total 99.8 mEq (KCl 40 + carrier 59.8).
- **Fall rate.** -44/h after the start (D5 added), then -14 to -7; +14/+16/+12 per hour during the hold; -32 and -24 after the restart; never a fall over 100/h; never under 110 on the infusion (128 at 2000; 124 at 2200 after it stopped).
- **Fluids vs 70 kg.** NS 14.3 mL/kg in 1 h; ED IV fluid 27.7 mL/kg; total IV volume at most 250 mL/h (3.6 mL/kg/h) after the bolus then 200 mL/h; whole-stay balance +3,375 mL; lungs clear; urine 110-150 mL/h in the ED then about 135-140 mL/h.
- **Dose math.** 7 and 3.5 units/h (76.4 units, one bag); glargine 24 units = 0.34 unit/kg; lispro 4 units for 32 g at 1:8; D2+ total 41 units (0.59 unit/kg) versus 50 at home; ratio 1:10 at 60/70/80 g; magnesium 2 g in 100 mL at 50 mL/h (not the preeclampsia load); KCl 10 mEq/100 mL; D5 173.8 g.
- **Pregnancy lab ranges** (lower HCO3 and pCO2, creatinine 0.40-0.80, mild leukocytosis, mild physiologic anemia Hgb 10.8-10.9) used in flags and notes; glucose targets fasting under 95, 1 h under 140, 2 h under 120.
- **Antiemetic safety.** Ondansetron PRN only, QT/potassium/magnesium hold rule; no dose at K 3.2 (the source scheduled 0755).
- **Betamethasone and fFN/cervical length.** fFN valid 24-34 weeks, swab before any digital exam, lubricant, bleeding or intercourse; cervical length 3.0 cm or longer reassuring (3.8 cm), 2.0-2.9 with fFN, under 2.0 high risk; steroids withheld; if ever needed a 30-40% insulin increase or infusion with hourly glucose and ketones; GBS not due, cefazolin for a low-risk penicillin history; magnesium neuroprotection before 32 weeks; Rh positive, no RhIG.
- **BPP/NST wording.** "8/8 on the four ultrasound components, 10/10 with the reactive NST".
- **Time gating in the app (Playwright).** 184 probes (one minute before and at every item time: observations, notes; plus the check that no vital is visible after 0700): **0 mismatches**; K 3.2 appears at 0705 and not at 0704; vitals exist only at 0130, 0250, 0530 and 0700. A script scans orders, MAR labels, stickies and problems for analyte values before they release: only threshold/goal phrases and repeats of existing values were found; four leaks were found and fixed during the build (see below). `node gen/check_notes.js` flags only false positives (a number from a neighbouring analyte, thresholds, a history value).
- **Menu and monitor.** The Pre-Built menu shows "DKA Patients" with 7 patients; the monitor opens Priya's rows by MRN (banner "HRA-9 DESAI, PRIYA 29 F"); DKA1-6 and the older rows are unchanged (the diff of monitor.html is additions plus the new DKA_SERIES line).
- **Regression.** addison, hypermag, burn_icu, hip_orif, dka1-dka6 import with 0 errors and step through "End of shift" with no page errors.

## Issues found and fixed during the build
| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | Source potassium (rider 0415 and 0715-1015) | 15 mEq/h | Potassium-free carrier during every rider |
| 2 | Source insulin hold | 4 h 15 min, no dextrose, BHB 2.8 | 2 h 20 min, dextrose kept, recheck after rider 2 |
| 3 | Source pH | Inconsistent with HCO3/pCO2 | Computed pH, enforced |
| 4 | Source lab release times | Rider 0415 started before the 0400 K 3.6 resulted (about 0425) | Panel 0400 released 0415, rider 0420 |
| 5 | Source fFN order | Written 1910, after the 1845 swab and 1900 results | Evaluation order 1715, decision order 1910 |
| 6 | Source Day 4 notes | 0715, 0800, 0830 after the timeline end; NST 0700 | NST 0630, notes at 0700 |
| 7 | Source K-Phos tablets | Phosphate given at normal phos with a potassium load | Dropped (monitored) |
| 8 | Source ondansetron | Scheduled dose at K 3.2 with QTc 478 | PRN with hold rule |
| 9 | Source steroid rule | "Steroids if cervical length under 2.5 cm" | ACOG-style thresholds (3.0 cm reassuring; fFN for 2.0-2.9; under 2.0 high risk) in MFM wording |
| 10 | First build, orders/MAR/problems | A glargine order and MAR label quoted the Day 2 low glucose and the 20-unit dose on Day 1; the home medicine review order named the later dose reduction; an insulin note listed K 3.6 and 3.2 at 0210; the contractions problem showed cervical length and fFN before they resulted; the hypokalemia problem quoted the 0710 ECG before it was read; MAR hold text said "K under 3.5 on the 0655 panel" before it released | Glargine split into a Day 1 order and a Day 2 order; texts neutralized; problems timed to 1900 and 0720 |
| 11 | First build, notes | Four notes referred to a tracing interpretation written after the note | Tracing notes moved earlier or the references re-pointed |
| 12 | First build, device | Fetal monitor/Foley markers unsupported ("abdomen") | `abdomenLLQ` (0 warnings from devices) |
| 13 | Source meal plan | Dinner 80 g vs dietitian 70-75 g; 225 g total vs a 270 g list | 60/70/80 g and 15/15/30 g snacks = 270 g (49% of 2,200 kcal) |
| 14 | Source BPP | "8/8 (10/10 with NST)" | Stated as 8/8 ultrasound components, 10/10 with NST |

## Judged acceptable but debatable (left as is)
1. **Gases are venous with arterial-equivalent pCO2 and pH** (series approach); real venous pCO2 is 4-6 mmHg higher and pH about 0.03 lower.
2. **Restart at 0.05 unit/kg/h (3.5 units/h) with BHB 2.6** follows the source; 0.1 unit/kg/h would clear ketones faster but K is only 3.6; ketones still fall to 0.5 by 1850.
3. **Third rider (rider 4) with the restart** is a judgement call so the source's 40 mEq total holds; some protocols would repeat the K first.
4. **No 0400 glucose check overnight Day 1-2** (checks at 2200 and 0200 only): the 62 at 0700 is found by her sensor, as in the source; the order now adds a 0200-0300 check nightly from Day 2.
5. **Foley kept until 2200** (hourly urine on insulin); CAUTI risk accepted for a 1-day need.
6. **Continuous EFM to Day 3 0915** (about 38 h after resolution) is longer than the 24-hour order because of the Day 2 contractions; telemetry stops at Day 3 0700.
7. **Fetal tracing values** for 0830, 0900, 1645-1715 and 2000-2035 and the 0100 pH/pCO2 and several glucose values are build choices consistent with the story.
8. **Delivery timing** is left to MFM ("usually 37-39 weeks"); the source's 36w0d-38w6d window is for poorly controlled disease.
9. **Neonatology counseling note (1215)** and the lipase/AST/ALT/uric acid labs were added (not in the source).
10. **CGM readings** are not charted; the sensor appears only in the history and notes.

## Questions for the instructor
1. **VTE:** keep SCDs + walking with no enoxaparin (my judgement: low risk, short stay, possible early delivery), or add enoxaparin 40 mg daily (and say so in the H&P)? The series rule lists pregnancy as a risk factor.
2. Keep the hold at 2 h 20 min (K drawn at the end of rider 2), or shorten further by drawing K at the end of rider 1?
3. Want the 0400 overnight glucose check added so the Day 2 low is caught earlier (the source finds it at 0700)?
4. README change log and version number are not updated (no instruction); the DKA_SERIES.md row is.

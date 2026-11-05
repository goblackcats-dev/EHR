# Self-review: Maya Thompson, new-onset type 1 diabetes in severe DKA (CS-DKA1-THOMPSON)

Reviewer stance: PICU nurse educator, pediatric endocrinologist, clinical pharmacist. Scope: DESIGN.md, INSTRUCTOR_NOTES.md, gen/*.js, notes/*.json, gen/ecg/make_ecgs.py, patient.json, the monitor.html `DKA1` rows, and the case running in the app (Playwright, Chromium, every shift change plus 1 h / 4 h steps).

Rebuilt with `python3 gen/ecg/make_ecgs.py`, `node gen/assemble.js`, `node tools/make-prebuilt.js`. Import validation: **0 errors**, 12 warnings (the "problem not addressed in a hospitalist progress note" string heuristic; the other cases have the same). No page or console errors in the EHR or the monitor.

## Checked and found correct
- **Diagnosis and severity.** Glucose 612, pH 7.04, bicarbonate 5, BHB 7.8 = severe DKA (ISPAD 2022: pH under 7.1 or bicarbonate under 5). HbA1c 12.8%, C-peptide 0.2, GAD65/IA-2/insulin antibodies positive, hCG negative, thyroid and celiac screens normal.
- **Anion gap** (Na - Cl - CO2), recomputed by `node gen/physiology.js`: 28, 25, 23, 19, 17, 15, 13, 10, 10, 10, 10.
- **Corrected sodium** (+1.6 per 100 mg/dL over 100): 139.2, 138.7, 138.5, **136.4 at 1140 (falling, the cerebral edema warning)**, 138.5, 140.2, 141.0, 140.8. Measured osmolality 309 vs calculated 306 (gap 3); 292 vs 289.
- **Blood gases**: every pH matches Henderson-Hasselbalch from its pCO2 and HCO3, and every pCO2 is inside Winter's formula (1.5 x HCO3 + 8 +/- 2). Resolution at Tue 0430: pH 7.33, bicarbonate 18, BHB 0.4, gap 10 (ISPAD and ADA 2024 criteria both met). The bicarbonate lag at 0030 (gap 13, CO2 15, Cl 112) is explained as hyperchloremic acidosis from saline.
- **Glucose fall** on insulin before dextrose: 55, 56, 55, 52, 47 mg/dL per hour (target 50-75, never over 100). Dextrose started at 287 (D5), 241 (D7.5), 198 (D10), exactly per the two-bag table; glucose then stays 147-198 (goal 150-250 during treatment); the one value under 150 on D10 (0300 Tue) triggers the call and the order to lower insulin to 0.075 unit/kg/h (not below 0.05).
- **Fluids**: one 10 mL/kg bolus (no shock), then maintenance 86 mL/h + (8% deficit 3,900 - 500) / 48 h = 157, ordered 150 mL/h (1.7 x maintenance, under 2 x); cut by one-third to 100 mL/h for cerebral edema. No bicarbonate. Insulin 0.1 unit/kg/h with no bolus, started 75 min after fluids.
- **Potassium**: no K while K 5.6 and not voiding; 40 mEq/L once K 4.7 and voiding; 60 mEq/L when K 3.3. 6 mEq/h = 0.12 mEq/kg/h (maximum 0.5). Half as potassium phosphate; ionized calcium checked (1.16, 1.18). Phosphorus nadir 1.6 without symptoms: no separate phosphate (treat under 1.0 or with symptoms).
- **Cerebral edema event**: timing (7.5 h after insulin), risk factors (new onset, pH 7.04, pCO2 16, BUN 28, falling corrected sodium), bedside criteria (2 major + 3 minor), treatment (mannitol 0.5 g/kg = 24 g = 120 mL of 20% over 15 min with a filter; fluids cut by one-third; HOB 30; 3% saline ready; CT after treatment, not before) all match ISPAD 2022. CT normal with the "CT does not exclude early edema" caveat.
- **ECGs**: QTc by Bazett: 310 ms at 128 bpm = 452; 360 ms at 98 bpm = 460. Peaked T with K 5.6 (0220) at 0300; flattened T with U waves with K 3.3 (1630) at 1730. Images match the text; the monitor rows match (tAmp 0.45 early, flat T with uAmp 0.12 at 1700-1900).
- **Transition**: glargine 20 units (0.41 unit/kg; estimated total daily dose 0.9-1 unit/kg) at 0745, lispro with breakfast at 0800, drip and bags off 0915 (1.5 h overlap). Carbohydrate ratio 1:12 (500 rule) and correction 1:40 over 150 (1800 rule). Rebound BHB at 1300 0.3. Night low after a full bedtime correction leads to glargine 18 units and a half-dose bedtime correction only over 250. All expected doses (DESIGN.md) recomputed with half-unit rounding.
- **Weight-based doses**: ondansetron 4 mg (max), acetaminophen 650 mg (13 mg/kg, max 3,250 mg/day), D10 2 mL/kg = 100 mL, glucagon 1 mg IM (over 25 kg), nasal glucagon 3 mg, 3% saline 120-240 mL.
- **I&O**: every block adds up; the app's Flowsheets I&O view shows the same numbers and shift totals (night ED 1,080/900; Mon day 1,620/1,470; Mon night 1,555/680). Labels are the standard rows (Oral, IV fluid, IV med, Urine, Emesis).
- **Time gating in the app**: no vitals after Mon 0700 at any checkpoint; ED labs at 0235-0525; 0830 panel at 0845-0925; STAT at 1150-1215; HbA1c 0900; C-peptide Tue 1000; antibodies Wed 1400; ECGs at 0310 and 1745; every note at its time; stickies, problems and devices (right IV and monitor removed Tue 1500/1700, CGM Wed 1100) at their times. MAR: infusions show "0700 Running" at the start, the insulin infusion and both K60 bags show "0915 Discontinued - transition" only from 0915 Tue, glargine/lispro are "Pending" until their start and "Due" after.
- **Notes**: a script checked every note for clock times after its own time and for lab values quoted before their result time; the remaining later times are plans ("next labs 1230", "CT once stable about 1255").
- **Pre-Built menu**: tabs "LPN Med Pass (6)", "Case Study Patients (4)", "DKA Patients (1)"; Maya opens from the menu. **Monitor**: opens Maya's rows by MRN (banner "PICU-4 THOMPSON, MAYA 16 F"); 1130 shows HR 72 and the cerebral edema note; 1730 shows flat T with U waves.

## Issues found and fixed
| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | notes, ED triage note (was 0215) | Quoted the 0225 POC glucose and the 0218 provider arrival. | Moved to 0230. |
| 2 | notes, PICU 1750 note | "Urine about 60 mL/h since 1500" used the 1800 void (after the note) and was wrong (about 87 mL/h). | "Voided 130 mL at 1600." |
| 3 | gen/physiology.js gases 0830-0430 | pCO2 values were above Winter's range during recovery (for example 22 at HCO3 7.1; expected 15-19). In DKA recovery the pCO2 stays low. | pCO2/HCO3/pH recalculated together (Henderson-Hasselbalch); 0830 CO2 7 and gap 23. |
| 4 | Weights | 49.3 / 49.6 / 49.9 kg was more than the net I&O allows once insensible losses (Kussmaul breathing) are counted. | 49.1 (Tue), 49.4 (Wed), 49.6 (Thu) everywhere. |
| 5 | Problem list | Three problems appeared before the facts in them: cerebral edema (at 1135, but said "improved, CT normal"), low K/phos (at 1715, but quoted the 1730 bags and ECG), night low (at 0255, but quoted the 0650 dose change). | availableAt 1325 Mon, 1750 Mon, 0650 Wed. |
| 6 | Orders (ED insulin and two-bag) | Instructions written at 0345/0530 said "continued by the PICU admission orders 0630". | "Continue unchanged on transfer to the PICU." |
| 7 | Event note vs monitor | Note said HR 110 at 1100; the monitor interpolated 97 at 1100. | Monitor rows 1045 (110), 1115 (100, 124/82), 1130 (72, 134/92); note says "110 at 1045". |
| 8 | Encounter banner | Location text announced the transfer ("transfer to 5 North planned") from 0700 Mon; the static diet/activity said NPO and bed rest for all 3 days. | Location "PICU"; diet/activity "on arrival (see Orders)". |
| 9 | Mannitol packaging | "Vials" and a 0.22-micron filter. Mannitol 20% comes in bags. | "20% 250 mL bags kept warm; in-line filter". |
| 10 | Notes | Brand names of a charity house and a foundation kit. | Generic wording. |
| 11 | **app.js** `getVisibleCanonicalCase` (all cases) | An order placed before its start (for example lispro ordered 0640 to start 0800) was set to "Pending" on the case object itself, so it stayed "Pending" forever after its start. Earlier cases avoided this by forcing start = orderedAt. | The status is now changed on a copy. Re-tested addison, hypermag, burn_icu, hip_orif (0 errors, no stuck orders). |
| 12 | **app.js** `simEndOfShift` (all cases) | "End of shift" jumped to the end of the whole case (72 h here). | Jumps to the next 0700 or 1900, or the case end if sooner. Button tooltip and README updated. |
| 13 | gen/treatments.js | Infusions running at 0700 (insulin, Bag A, Bag B) showed an empty first MAR column. | "0700 Running ..." entries (checked at the ED handoff). |
| 14 | monitor.html, ecg_image.py | No way to show U waves for low potassium. | `uAmp` row field on the monitor (rows without it show none) and `u_amp` / `--u-amp` in the ECG tool. Existing ECGs regenerate identically. |

## Judged acceptable but debatable (left as is)
1. **Potassium 60 mEq/L through a peripheral IV.** ISPAD suggests 40 mmol/L, with more only if hypokalemia persists (or lower the insulin rate). Many PICUs allow 60 mEq/L peripherally on a monitor. The rate (0.12 mEq/kg/h) is well under the maximum. Change to 40 mEq/L plus an oral or separate IV dose if your institution limits it.
2. **Fluid rate 150 mL/h (1.7 x maintenance).** Within ISPAD (1.5-2 x maintenance) and the PECARN FLUID trial (faster vs slower rates did not change brain injury). Some protocols use 1.5 x (about 130 mL/h).
3. **Insulin 0.1 vs 0.05 unit/kg/h.** Either is allowed; 0.1 is common for a teen with severe DKA.
4. **Corrected sodium factor 1.6** (ADA) is used everywhere; ISPAD uses 2 (139 would read 141). Stated in DESIGN.md.
5. **Cerebral edema with recovery in 45 minutes.** Real cases may need repeat doses, intubation or neurosurgery; a fast response keeps the 3-day story on track. The near-miss is the teaching point.
6. **K 3.3 at 1630 without lowering insulin.** ISPAD suggests lowering insulin only if hypokalemia persists despite maximum replacement; K was replaced harder first.
7. **Glargine 20 units (0.41 unit/kg).** Many centers start basal lower (0.3 unit/kg). The higher dose plus a full bedtime correction makes the Wednesday night low plausible and teachable.
8. **Phosphate 1.6 not treated separately.** Phosphate was already running in both bags; no symptoms.
9. **Doses after 0700 Monday are "due"**, so a skipped shift leaves overdue doses on the MAR (the notes say the doses were given). Same convention as the addison case; noted in INSTRUCTOR_NOTES.md.
10. **POC glucose is in the chart** (time-gated), unlike addison where students produced it. Hourly values over 26 hours are the backbone of the two-bag decisions; the instructor reads the same values aloud.
11. **CGM in hospital.** Dexcom G7 is placed for teaching/home use only; inpatient doses come from fingersticks (orders, sticky, notes agree).
12. **Static device text.** The left AC IV still reads "two-bag + insulin" after the transition; device records are static (same as other cases).
13. **Peaked T waves at K 5.6** are mild; the ECG text says "consistent with potassium 5.6" and notes P waves and QRS are normal.

## Questions for the instructor
- Do you want the previous shift's doses charted as given when you start at a later checkpoint (for example a student group that only runs Wednesday)? It is easy to add a version that pre-charts doses before a chosen checkpoint.
- Is a cerebral edema event right for patient 1, or would you rather keep it as warning signs only (headache with normal vitals)?
- `student-site/app.js` (separate older build) was not regenerated; run `node make-student-site.js` if the student site should get the app.js fixes (#11, #12).

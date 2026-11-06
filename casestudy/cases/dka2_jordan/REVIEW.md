# Self-review: Jordan Ellis, insulin pump failure and moderate DKA (CS-DKA2-ELLIS)

Reviewer stance: medical nurse educator, adult endocrinologist, clinical pharmacist. Scope: DESIGN.md, INSTRUCTOR_NOTES.md, gen/*.js (including gen/infusions.js), notes/*.json, gen/ecg/make_ecgs.py, patient.json, the monitor.html `DKA2` rows, and the case running in the app (Playwright, Chromium, served repo, every "End of shift" step plus 1 h / 4 h steps).

Rebuilt with `python3 gen/ecg/make_ecgs.py`, `node gen/assemble.js`, `node tools/make-prebuilt.js`. Import validation: **0 errors**, 8 warnings (all the "problem not clearly addressed in a hospitalist progress note" string heuristic that every case shows). No page or console errors in the EHR or the monitor. No app code was changed for this patient.

## Checked and found correct
- **Diagnosis and severity.** Known type 1 diabetes, glucose 572, BHB 6.2, pH 7.22, bicarbonate 10 = DKA by the 2024 consensus; moderate by the classic ADA classes (pH 7.00-7.24, bicarbonate 10-15, alert). Precipitant: interrupted pump delivery (dislodged/bent cannula); infection screen negative (no fever, UA clean, respiratory PCR negative, WBC 15.8 typical of DKA).
- **Anion gap** (Na - Cl - CO2), recomputed by `node gen/physiology.js`: 26, 23, 21, 18, 16, 15, 16 (insulin held), 13, 11, 11, 11, 10. Delta-delta at 0045: gap +14, bicarbonate -14 (pure gap acidosis). Tue 0130: gap 13, CO2 18, Cl 109 = small saline-related non-gap component (explained in the 0630 note).
- **Corrected sodium** (+1.6 per 100 mg/dL over 100): 140.6, 141.9, 140.1, 139.5, 140.2, 140.6, 141.3, 141.2, 140.0. Effective osmolality 298 (no hyperosmolar overlap). Measured 309 vs calculated 306 = osmolal gap 3 (no toxic alcohol).
- **Blood gases**: every pH equals Henderson-Hasselbalch from its pCO2 and HCO3 to 0.01; every pCO2 is inside Winter's formula (1.5 x HCO3 + 8 +/- 2): 24 (20.1-24.1), 24 (21.3-25.3), 26 (22.5-26.5), 29 (25.5-29.5), 30 (27-31), 31 (28.8-32.8), 30 (27.6-31.6), 33 (31.8-35.8), 35 (34.5-38.5).
- **Resolution** at Tue 0530: pH 7.36, bicarbonate 20, BHB 0.4, gap 11 (2024 consensus). At 2130 Mon and 0130 Tue pH was 7.30 / 7.34 with BHB 2.0 / 0.9: correctly not called resolved.
- **Glucose fall** on insulin before dextrose: 54, 54, 52, 50, 52 mg/dL per hour (target 50-75, never over 100). D10 starts at the first value under 250 (214 at 0800), glucose then 176-248 (goal 150-250) except the soda spike (248) and the planned rise while insulin was held; 148 at 0300 Tue triggers D10 150 mL/h and a call.
- **Potassium vs insulin**: K 5.4 (over 3.5) so insulin starts at 0215 (after the K result at 0130); no potassium while over 5.0; first rider when K 4.6 and voiding; **K 3.3 -> insulin AND dextrose held 1920-2200**, riders, magnesium; restart at K 3.7. Series peripheral rule: no potassium in any bag, riders one at a time, maximum 10 mEq/h (checked minute by minute in `gen/infusions.js`); 18 riders = 180 mEq IV + 20 mEq PO; about 5-7.5 mEq/h on average, comparable to the consensus 20-30 mEq per liter at these fluid rates.
- **Fluids vs weight**: 1 L in hour 1 = 13.9 mL/kg (consensus 1-1.5 L); 500 mL/h x2 h; 250 mL/h = 3.5 mL/kg/h; 100 mL/h saline + 100 mL/h D10 once dextrose starts. Net +4.2 L to Tue 0700 with about 2 L insensible loss (30 h, Kussmaul) fits 72.0 -> 74.2 kg; usual weight 74.5.
- **I&O**: every block adds up; the app's Flowsheets I&O shows the same numbers and shift totals (ED night 2,886/1,550; Mon day 4,052/2,750; Mon night 3,306/1,700; whole stay to Tue 0700 10,244/6,000). Labels are the standard rows (Oral, IV fluid, IV med, Urine, Emesis); riders, insulin, magnesium, thiamine and ondansetron are IV med.
- **Dose math**: insulin 0.1 x 72.0 = 7.2 units/h; glargine 20 = 92% of pump basal 21.6 (0.28 unit/kg; usual conversion 80-100%); meals 1 unit/10 g, correction 1 unit/45 above 150 in whole units: Tue 7, 10, 10; 2100 no correction (118). Pump: 6.0 + 0.4 = 6.4; 1.85; 7.5; 3.45 (0.05-unit steps). Pen 0020: (298-150)/45 = 3.3 -> 3. MgSO4 2 g; thiamine 100 mg; acetaminophen max 3 g/day (alcohol); ondansetron 4 mg (QTc 448 then 468, under the 500 hold); D50 25 g; glucagon 1 mg.
- **ECGs**: QTc by Bazett: QT 320 ms at 118 bpm = 448; 378 ms at 92 bpm = 468. 0115 tall T with K 5.4; 1935 flat T + U waves with K 3.3. Images match the text; monitor rows match (tAmp 0.5 at 0700; tAmp 0.15 + uAmp 0.13 at 1920; partial recovery at 2200).
- **Alcohol pieces**: ethanol none detected 22 h after the last drink; CIWA-Ar every 4 h to 72 h (Wed 0200), scores 0-2 (the 2010 Tue sweats explained by the low); lorazepam only for CIWA 10+ after a glucose check; thiamine before any dextrose; AKA overlap discussed in the ED and endocrine notes; AUDIT-C 7 with a brief intervention.
- **Time gating in the app**: no vitals after Mon 0700 at any checkpoint; lab results appear at their result times; HbA1c 0900; ECGs 0135 and 1945; every note, sticky, problem and device change at its time (right IV and monitor removed Tue 1400; pump sets Wed 0815 and Thu 0030). MAR: saline and insulin show "0700 Running"; D10 "0800 Due"; thiamine, glargine, lispro and the pump order are Pending until their start; the insulin/D10/saline stop at 0930 Tue shows only from 0930.
- **Notes**: a script checked every note for lab values quoted before their result time (only thresholds such as "bicarbonate 18" and "ketones 0.6" match) and for clock times later than the note (all are previous-day events, pump basal times, years or stated plans).
- **Pre-Built menu**: tabs "LPN Med Pass (6)", "Case Study Patients (4)", "DKA Patients (2)"; Jordan opens from the menu at Mon 0700. **Monitor**: opens Jordan's rows by MRN (banner "IMC-6 ELLIS, JORDAN 24 M"); 1930 shows the K 3.3 row (flat T, U waves); Tue 2010 shows HR about 108 sinus tach and the low-glucose note.
- **Regression**: addison, hypermag, burn_icu, hip_orif, dka1_maya and dka2_jordan all import with 0 errors, step through End of shift with no page errors and no stuck "Pending" orders.

## Issues found and fixed during the build
| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | Fluids/potassium (whole case) | First design had lactated Ringer's with KCl 20 mEq/L plus 10 mEq/h riders = 12 mEq/h through peripheral IVs, against the series rule sent during the build (no more than 10 mEq/h peripherally). | Main fluid is 0.9% saline with NO potassium (lactated Ringer's carries 4 mEq/L); all potassium by riders using a 4-hour table; `gen/infusions.js` computes the volumes; orders, notes, stickies, I&O, DESIGN updated. |
| 2 | ED ECG record | Read at 0125 but quoted K 5.4 (resulted 0130). | ECG read/available at 0135. |
| 3 | Mon 0800 | Magnesium and a KCl rider were both set to run in the right antecubital IV. | Magnesium through the left line (Y-site with saline), both doses. |
| 4 | ED provider note 0430 | Quoted the HbA1c that resulted at 0900. | Uses the patient-reported October HbA1c (7.4%). |
| 5 | Night note Thu 0620 | Said "discharge order written (0640)". | "Discharge order this morning if endocrinology agrees." |
| 6 | Devices | `flankLeft` site marker is not supported (import warning). | New set at the left upper abdomen (`abdomenLUQ`); notes match. |
| 7 | I&O vs weights | Day 1 fluid volume was too high for the weights. | Saline 100 mL/h once D10 starts (50 while a rider runs); weights 74.2 / 74.0 / 73.9. |
| 8 | Pharmacy discharge note | Claimed a $35/month insulin cap on a commercial plan (not universal). | Removed. |
| 9 | Night event note 2015 | Garbled chemistry line ("CO2 15... see lab"). | Rewritten. |
| 10 | Orders | Allergy written as an order. | Removed (allergy is on the patient record and banner). |

## Judged acceptable but debatable (left as is)
1. **0.9% saline instead of a balanced crystalloid.** The 2024 consensus allows either and notes balanced fluids may resolve DKA faster with less hyperchloremia. Lactated Ringer's contains potassium 4 mEq/L, which would exceed the series 10 mEq/h peripheral limit when a rider runs. The mild high chloride (108-109) is used as a teaching point.
2. **Holding insulin for K 3.3 during treatment.** The consensus states the K under 3.5 rule at insulin start; many protocols apply it throughout. The hold is short (2 h 40 min); BHB rose 1.8 -> 2.0, shown in the notes.
3. **Fixed-rate 0.1 unit/kg/h all the way** with a separate D10 line (JBDS-style). The consensus also allows lowering to 0.05 unit/kg/h once glucose is under 250.
4. **Potassium table** (30 mEq per 4 hours at K 3.5-3.9) and **no phosphate** (lowest 1.8; replace only under 1.0).
5. **Glargine 20 units with pump restart about 24.75 h later** (0815 Wednesday): a small gap or overlap either way is expected; glucose 164 two hours after restart.
6. **Two correction targets**: pump 120 (home), pen 150 (hospital scale). Stated in the orders and notes; a good discussion point.
7. **Thiamine and a 72-hour CIWA watch for a binge (not daily) drinker**: low-cost safety measures; withdrawal not expected and not seen.
8. **Unexplained high at 0010 Thursday after pizza** (fat can delay the rise): the ketones (0.6) and the kinked cannula make set failure the answer, and the pen correction is conservative (3 units).
9. **Doses after 0700 Monday are "due"**: a skipped shift leaves overdue doses (notes say what was given), same as patient 1. Riders under the protocol are PRN (students decide), so they do not appear as due.
10. **Weight on Wednesday and Thursday** stays near 74 kg while charted intake is close to output: water in food is not charted.

## Questions for the instructor
- Would you rather see lactated Ringer's for the teaching point about balanced fluids (it would need the rider rate lowered to keep the total under 10 mEq/h)?
- Should the protocol riders appear as "due" doses on the MAR (scheduled from the K results) instead of PRN?
- `student-site/app.js` was not touched by this build; nothing to regenerate for patient 2.

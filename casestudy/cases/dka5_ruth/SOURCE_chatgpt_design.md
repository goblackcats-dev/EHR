# Ruth Nakamura simulated patient chart and nursing simulation design

**FICTIONAL EDUCATIONAL CASE — all people, encounters, results, and administrations are invented.** Faculty master document; release information to learners only at its stated availability time. This is a scenario specification, not a standing clinical order set.

**Clock:** Day 1 = November 5, 2026; Day 2 = November 6; Day 3 = November 7; Day 4 = November 8. All times are local, 24-hour. ED care occurs during the overnight hours of Day 1, before the 0700 unit arrival. The six simulation shifts are D1 0700–1900, D1 1900–D2 0700, D2 0700–1900, D2 1900–D3 0700, D3 0700–1900, and D3 1900–D4 0700. D4 0700 is the closing checkpoint, not a seventh shift.

**Clinical reconciliation required for accuracy:** The requested rules contain three departures from the 2024 consensus. First, its strict definition of euglycemic DKA uses glucose <200 mg/dL; the initial value of 210 is therefore **SGLT2-associated DKA with near-euglycemia**, becoming euglycemic at the next draw. Second, current resolution requires beta-hydroxybutyrate <0.6 mmol/L **and** either pH ≥7.3 or bicarbonate ≥18 mmol/L; an arbitrary “two of four” rule can stop treatment prematurely. Here, all four requested measures are satisfied before transition, including bicarbonate ≥18 and gap ≤12. Third, the consensus ordinarily reduces insulin to 0.05 unit/kg/h below glucose 250; the requested fixed 0.1 unit/kg/h with additional dextrose is retained as an explicitly specified simulation protocol, with prescriber escalation for inadequate glucose support. It must not be described to students as the exact ADA dosing algorithm. Dextrose begins with insulin, and potassium safety takes precedence. [2024 multisociety hyperglycemic crises consensus](https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/)

Sepsis care uses early cultures, prompt effective antibiotics, reassessed crystalloid resuscitation, serial lactate, and susceptibility-directed narrowing. The current SSC adult guidance is the 2026 update; these core actions also agree with the 2021 guidance. [Surviving Sepsis Campaign adult guidance](https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines)

## 1. Patient facts: name, age, sex, DOB, height, weight (and usual weight), allergies, code status, home meds with doses, PMH, social history, family.

| Item | Fictional chart content |
|---|---|
| Identity | Ruth Nakamura; 67-year-old woman; DOB April 18, 1959; simulation identifier SIM-RN-067 |
| Measurements | Height 165 cm; actual admission weight 60.0 kg; usual weight 62.0 kg; current BMI 22.0 kg/m² |
| Allergies | Sulfonamide antibiotics: generalized urticaria; no anaphylaxis. No penicillin or cephalosporin allergy. |
| Code status | Full code; daughter is designated health-care agent if capacity is lost; patient reassessed for capacity as delirium improves |
| Home insulin | Glargine U-100, 18 units subcutaneously at 2100 daily; lispro U-100 with meals, 1 unit per 12 g carbohydrate plus 1 unit per 50 mg/dL above 150; no bedtime correction. Uses pens, not an insulin pump. |
| Other home medications | Empagliflozin 10 mg orally at 0800 daily, started September 24, 2026 by an outside provider for glucose/weight, off-label in type 1 diabetes; lisinopril 5 mg orally at 0900; atorvastatin 20 mg orally at 2100; glucagon nasal powder 3 mg once as needed for severe hypoglycemia, may repeat after 15 minutes with a new device while emergency help is summoned |
| Devices and supplies | Personal CGM; receiver connection lost two days before admission. Fingerstick meter available. No blood-ketone meter at home initially. CGM does not replace hospital POC testing. |
| Diabetes history | Type 1 diabetes diagnosed at age 15, duration 52 years; hypoglycemia unawareness, sometimes no symptoms until glucose <50; mild distal sensory neuropathy and nonproliferative retinopathy; no known coronary disease or heart failure |
| Other PMH | Hypertension; hyperlipidemia; prior uncomplicated UTIs; baseline creatinine 0.7 mg/dL; independent cognition and mobility before illness; no dementia, chronic lung disease, alcohol use disorder, or chronic kidney disease |
| Social history | Widowed retired librarian; lives alone in a one-story home with cat Miso; two entrance steps with railing; no tobacco, alcohol, or recreational drugs; usually independent with meals, driving, and injections |
| Family | Daughter Emi Tanaka, 39, lives 10 minutes away and visits frequently; has permission to receive updates. Emi agrees to care for Miso and provide temporary supervision. Ruth's sister has autoimmune thyroid disease; no relevant inherited renal disease. |

Last home doses, established by daughter at D1 0130: glargine 18 units D0 2100, empagliflozin 10 mg D0 0800, lisinopril 5 mg D0 0900, atorvastatin 20 mg D0 2100, and lispro 3 units D0 1200 with lunch. She omitted dinner lispro because she did not eat; she did **not** omit basal insulin. Illness, reduced intake, glycosuria, and SGLT2 exposure precipitate DKA despite that basal dose. Empagliflozin is permanently discontinued for this patient; no SGLT2 rechallenge is planned.

## 2. Story before the ED and ED course: times, ED vitals at least 3 sets (with times), ED treatments (drug, dose, route, time).

D−2: dysuria and urinary frequency begin. D−1: progressive urgency, feverishness, reduced drinking, and right flank discomfort. D0 1800: nausea and one episode of vomiting; meter glucose 198, so Ruth assumes she cannot have DKA. D1 0030: Emi finds her confused during a telephone call and comes to the house; EMS transports her. D1 0100: ED arrival and sepsis recognition. Examination shows dry mucosa, capillary refill approximately four seconds, deep breathing, right costovertebral-angle tenderness, and inattention; no focal neurological deficit or pulmonary crackles. Initial GCS 14, oriented to person and place but not date.

**Only recorded vital signs in the chart, including the unit-arrival set:**

| Time | HR / rhythm | BP mmHg | RR/min | SpO2 / support | Temperature |
|---|---|---|---|---|---|
| D1 0100 | 118, sinus tachycardia | 92/54 | 28, deep | 97%, room air | 39.1°C oral |
| D1 0200 | 112, sinus tachycardia | 102/58 | 26 | 98%, room air | 38.8°C oral |
| D1 0400 | 106, sinus tachycardia | 112/62 | 24 | 98%, room air | 38.3°C oral |
| D1 0655 | 104, sinus tachycardia | 116/64 | 24 | 98%, room air | 38.0°C oral |
| D1 0700 unit arrival | 104, sinus tachycardia | 116/64 | 24 | 98%, room air | 38.0°C oral |

After 0700, numerical vital signs appear **only as facilitator monitor settings in section 7**, never as subsequent chart observations. Post-arrival ECG rates in section 9 are teaching-file metadata.

| Time | ED action and administration |
|---|---|
| 0100–0130 | Lactated Ringer's (LR) 500 mL IV over 30 minutes; first peripheral IV; start strict output collection |
| 0110 | Chemistry, CBC, magnesium, phosphorus, beta-hydroxybutyrate (BHB), lactate, initial arterial blood gas, albumin, HbA1c collected; results released 0130 |
| 0112 and 0115 | Two peripheral blood-culture sets from separate sites, each aerobic and anaerobic bottles, before antibiotics |
| 0118 | Assisted clean-catch urine for urinalysis and culture before antibiotics; no indwelling catheter |
| 0120 | Ondansetron 4 mg IV, 2 mL, once for nausea |
| 0130–0200 | LR 500 mL IV over 30 minutes, after bedside perfusion/lung reassessment |
| 0135 | DKA confirmed from released labs; intensive monitoring bed requested; acute kidney injury and infection-associated delirium recognized |
| 0140–0210 | Ceftriaxone 2 g in 100 mL normal saline IV over 30 minutes, first empiric dose; 40 minutes after sepsis recognition |
| 0150 | Acetaminophen 650 mg rectal suppository once for fever while nauseated |
| 0200–0300 | LR 800 mL IV over one hour after reassessment; total resuscitation crystalloid 1,800 mL = 30 mL/kg within three hours |
| 0200 | Regular insulin U-100 prepared as 100 units/100 mL normal saline (1 unit/mL), IV infusion 6 units/h, no bolus; D10W IV 100 mL/h starts simultaneously |
| 0300–0700 | Isotonic maintenance IV 100 mL/h: LR 0300–0330 and 0530–0700 (200 mL); potassium-free normal saline 0330–0530 during KCl riders (200 mL). ED isotonic total 2,200 mL, comprising LR 2,000 plus NS 200. |
| 0330–0430 and 0430–0530 | KCl 10 mEq in 100 mL IV piggyback over one hour each; 20 mEq total after 0320 potassium of 4.0 is released at 0330 |
| 0500 | Renal/bladder ultrasound completed; report released 0530: no hydronephrosis, no obstructing stone seen, bladder not distended; no drainage procedure indicated |
| 0650 → 0700 | Transfer panel collected in ED and released at unit arrival; potassium 3.3 prompts immediate insulin hold and new potassium replacement orders |

Three peripheral IVs are placed by 0200: A for insulin alone; B for compatible LR/D10 through separately controlled pumps and a pharmacy-verified manifold; C for sequential potassium, magnesium, and antibiotic administration. No central line or arterial catheter is inserted. Arterial samples are single radial punctures. Airway remains protected; repeat arterial gas shows improved compensation. Sepsis includes encephalopathy and acute kidney injury, without vasopressor-dependent septic shock. Fluids improve perfusion; vasopressors and supplemental oxygen are not administered.

## 3. Lab table: every lab draw as rows (time | Na | K | Cl | HCO3 | BUN | Cr | glucose | anion gap | pH | pCO2 | beta-hydroxybutyrate | lactate | WBC | phos | Mg | other), with normal ranges, from ED through Day 4 0700; culture results with times. Also POC glucose hourly while on the insulin drip, then AC/HS.

Times below are **collection → result availability**. “—” means not drawn, not a normal or pending result. HCO3 is serum total CO2 used for gap calculations; gases are rounded consistently with it. Gas pH/pCO2 are arterial for 0110 and 0320, venous thereafter. Do not use venous pCO2 to diagnose respiratory compensation with Winter's arterial formula. All panels are fictional local laboratory values.

| time | Na | K | Cl | HCO3 | BUN | Cr | glucose | anion gap | pH | pCO2 | beta-hydroxybutyrate | lactate | WBC | phos | Mg | other |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Reference range / unit | 135–145 mmol/L | 3.5–5.0 mmol/L | 98–107 mmol/L | 22–29 mmol/L | 7–20 mg/dL | 0.6–1.1 mg/dL | fasting 70–99 mg/dL | 8–12 mmol/L, no K | arterial 7.35–7.45; venous 7.31–7.41 | arterial 35–45; venous 41–51 mmHg | <0.6 mmol/L | 0.5–2.0 mmol/L | 4.0–11.0 ×10³/µL | 2.5–4.5 mg/dL | 1.7–2.4 mg/dL | Local intervals; therapeutic glucose target differs from fasting normal |
| D1 0110 → 0130 | 134 | 4.8 | 101 | 9 | 36 | 1.2 | 210 | 24 | 7.12 | 29 | 6.8 | 3.2 | 18.6 | 3.8 | 1.8 | Hb 13.0 g/dL (12–16); platelets 240 ×10³/µL (150–400); albumin 3.8 g/dL (3.5–5.0); HbA1c 8.1% (normal <5.7%) |
| D1 0118 → 0130, urine | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Nitrite positive, leukocyte esterase large, >100 WBC/hpf (0–5), bacteria many, glucose ≥1,000 mg/dL and ketones 3+ (both normally negative); culture pending |
| D1 0320 → 0330 | 136 | 4.0 | 105 | 10 | 33 | 1.1 | 192 | 21 | 7.25 | 24 | 5.7 | 2.2 | — | 2.8 | 1.7 | Second arterial gas |
| D1 0650 → 0700 | 137 | 3.3 | 108 | 12 | 29 | 1.0 | 168 | 17 | 7.28 | 26 | 4.1 | 1.6 | 17.0 | 2.0 | 1.6 | Venous gases from here onward |
| D1 0900 → 0910 | — | 3.7 | — | — | — | — | — | — | — | — | — | — | — | — | — | After first 20 mEq of unit potassium replacement |
| D1 1100 → 1110 | 138 | 4.0 | 109 | 14 | 26 | 0.9 | 172 | 15 | 7.30 | 29 | 2.8 | — | — | 1.8 | 1.6 | After 40 mEq unit KCl; Mg infusion not yet given |
| D1 1450 → 1500 | 138 | 3.8 | 110 | 17 | 23 | 0.9 | 186 | 11 | 7.33 | 33 | 1.2 | — | — | 1.7 | 1.9 | Gap has closed; ketonemia persists |
| D1 1850 → 1900 | 139 | 4.1 | 110 | 18 | 22 | 0.9 | 176 | 11 | 7.35 | 34 | 0.7 | — | — | 1.9 | 1.9 | Not yet resolved by current BHB criterion |
| D1 2250 → 2300 | 139 | 4.0 | 110 | 19 | 21 | 0.9 | 170 | 10 | 7.36 | 35 | 0.4 | — | — | 2.1 | 1.9 | First documented biochemical resolution |
| D2 0650 → 0700 | 139 | 4.0 | 108 | 21 | 19 | 0.8 | 164 | 10 | 7.38 | 36 | 0.3 | — | 12.8 | 2.4 | 2.0 | No recurrent ketosis after transition |
| D2 1850 → 1900 | 139 | 4.0 | 106 | 23 | 18 | 0.8 | 192 | 10 | — | — | — | — | — | — | — | Chemistry only |
| D3 0650 → 0700 | 140 | 4.1 | 107 | 24 | 15 | 0.8 | 154 | 9 | — | — | — | — | 9.8 | 2.9 | 1.9 | Chemistry, CBC, phosphorus, magnesium |
| D3 1850 → 1900 | 139 | 4.0 | 106 | 24 | 14 | 0.8 | 118 | 9 | — | — | — | — | — | — | — | Chemistry only |
| D4 0650 → 0700 | 140 | 4.1 | 107 | 24 | 14 | 0.8 | 145 | 9 | — | — | — | — | 8.2 | 3.2 | 2.0 | Hb 11.8, platelets 228; mild dilutional Hb fall without bleeding |

**Culture collection and timed releases**

| Specimen / collection | Released time | Result available at that time |
|---|---|---|
| Urine, D1 0118 | D1 1800 | Preliminary >100,000 CFU/mL gram-negative rod; identification and susceptibility pending |
| Same urine | D2 0800 | E. coli identified; susceptibility pending |
| Same urine | D2 1045 | Final: E. coli >100,000 CFU/mL; ampicillin MIC 2 µg/mL susceptible, amoxicillin-clavulanate susceptible, ceftriaxone susceptible, cefazolin susceptible, cefepime susceptible, TMP-SMX susceptible, ciprofloxacin resistant; no ESBL phenotype. Laboratory interpretation supports oral amoxicillin. |
| Two blood-culture sets, D1 0112/0115 | D2 0120 | No growth at approximately 24 hours, preliminary |
| Same blood sets | D3 0120 | No growth at approximately 48 hours, preliminary |
| Same blood sets | D4 0120 | No growth at approximately 72 hours, preliminary; final five-day result not yet available at simulation end |

**POC glucose, mg/dL, immediate availability.** Check every hour from insulin start through discontinuation, including while held. The pre-infusion serum glucose of 210 is not substituted for a bedside value.

| Day | Hourly time:value |
|---|---|
| D1 0200–0700 | 0200:203; 0300:194; 0400:186; 0500:174; 0600:168; 0700:168 |
| D1 0800–1300 | 0800:156; 0900:154; 1000:164; 1100:172; 1200:164; 1300:148 |
| D1 1400–1900 | 1400:166; 1500:186; 1600:190; 1700:182; 1800:178; 1900:176 |
| D1 2000–2300 | 2000:172; 2100:168; 2200:166; 2300:170 |
| D2 0000–0100 | 0000:174; 0100:178, infusion then stopped |
| D2 transition check | 0200:182 |

| Day | Before breakfast | Before lunch | Before dinner | HS | Additional checks |
|---|---|---|---|---|---|
| D2 | 0730:164 | 1130:188 | 1730:204 | 2100:182 | Above 0200 transition check; 2015:186 during near-fall assessment |
| D3 | 0730:154 | 1130:176 | 1730:142 | 2100:63 | 2115:88 after treatment; 2130:107; 2200:126 |
| D4 | 0700:145, early fasting check at closing handoff | Beyond simulation | Beyond simulation | Beyond simulation | 0300:132, targeted overnight check after revised basal dose |

**Required calculations**

* Anion gap excludes potassium: Na − (Cl + HCO3). In table order for chemistry draws: 134−(101+9)=24; 136−(105+10)=21; 137−(108+12)=17; 138−(109+14)=15; 138−(110+17)=11; 139−(110+18)=11; 139−(110+19)=10; 139−(108+21)=10; 139−(106+23)=10; 140−(107+24)=9; 139−(106+24)=9; 140−(107+24)=9 mmol/L. Albumin is near normal; no albumin correction is used.
* Corrected sodium = measured Na + 1.6 × ((glucose−100)/100). Initial: 134 + 1.6×1.10 = **135.76 ≈135.8 mmol/L**. At unit arrival: 137 + 1.6×0.68 = **138.09 ≈138.1**. At resolution: 139 + 1.6×0.70 = **140.12 ≈140.1**. Rising measured sodium during glucose reduction alone does not justify hypotonic fluid.
* Winter's expected arterial pCO2 = 1.5×HCO3 +8 ±2. Initial: 1.5×9+8=**21.5, range 19.5–23.5 mmHg**; actual 29 indicates additional respiratory acidosis/inadequate compensation. At 0320: 1.5×10+8=**23, range 21–25**; actual 24 is appropriate compensation. The initial discrepancy triggers airway, fatigue, and aspiration assessment; it is not dismissed as normal Kussmaul breathing.
* Infusion: 0.1 unit/kg/h×60 kg=**6 units/h**; at 1 unit/mL, **6 mL/h**. D10W 100 mL/h supplies 10 g glucose/h; 150 mL/h supplies 15 g/h.
* At D1 1500, gap 11 and pH 7.33 would satisfy the requested two-of-four checklist while BHB remains 1.2; **do not stop insulin**. At D1 2300, BHB 0.4 plus pH 7.36 and HCO3 19 confirms current-consensus resolution; gap 10 also satisfies the scenario's extra measure. Long-acting insulin is administered at 2300, then the infusion stops at D2 0100 after a full two-hour overlap.

## 4. Orders: every order with time written, start, end, and full details (fluids with rates and changes, insulin infusion and dextrose protocol, potassium protocol, antibiotics with doses and times, labs schedule, diet, activity, delirium and fall precautions, consults, subcutaneous insulin doses at transition).

**Order conventions:** “Through cutoff” means active at D4 0700, not automatically discontinued then. Discharge orders below are proposed for a later departure; discharge has not occurred at cutoff. IV rates are actual delivered rates after initial line priming; priming solution is discarded and excluded from patient intake. No maintenance fluid contains added potassium in this case. The maintenance-bag potassium ceiling is 20 mEq/L; the explicitly requested premixed KCl 10 mEq/100 mL piggyback is a separate intermittent medication preparation. No IV potassium push, parallel potassium riders, or hidden potassium infusion is permitted. LR contains its standard intrinsic potassium, 4 mEq/L; there is no added KCl, and the combined potassium delivery remains at or below 10 mEq/h at every potassium administration.

| Written | Start | End | Order and full details |
|---|---|---|---|
| D1 0100 | 0100 | Through cutoff | Full code; ED sepsis evaluation, then ICU admission. Telemetry continuously. Two additional PIVs after first access, total three; no central line. PIV assessments hourly during infusions; remove on discharge if no further need. |
| D1 0100 | D1 0125 | Through cutoff | Normal saline 10 mL IV flush per administration, after intermittent IV medications and for unused PIV patency according to site policy; expected actual times and total volumes are in section 5. Include all delivered flushes in intake; obtain revised orders and update intake if extra flushes become necessary. |
| D1 0100 | 0100 | D1 0130 | LR 500 mL IV over 30 minutes; assess lungs, capillary refill, mentation, and fluid responsiveness before next bolus. |
| D1 0130 | 0130 | D1 0200 | LR 500 mL IV over 30 minutes after reassessment. |
| D1 0135 | 0200 | D1 0300 | LR 800 mL IV over one hour; initial 30 mL/kg total =1,800 mL. No automatic repeat 30 mL/kg bolus. |
| D1 0255 | 0300 | D1 0330 superseded | LR IV 100 mL/h; reassess perfusion, urine, lungs, and cumulative fluid balance frequently; account for dextrose and medication volumes. |
| D1 0330 | 0330 | D1 0530 | Substitute normal saline IV 100 mL/h, 200 mL total, for LR during potassium riders so combined IV potassium remains ≤10 mEq/h. |
| D1 0330 | 0530 | D1 0700 | Resume LR IV 100 mL/h after ED potassium riders finish, 150 mL; no simultaneous KCl. |
| D1 0700 | 0700 | D1 1100 | Stop LR; substitute normal saline IV 100 mL/h, 400 mL total, during four unit potassium riders. |
| D1 1100 | 1100 | 1100 | Discontinue normal saline maintenance because perfusion and urine output have improved and D10 provides substantial ongoing volume. |
| D1 0135 | 0200 | D2 0100, with hold below | Regular insulin 100 units in 100 mL normal saline IV, 1 unit/mL; 6 units/h =0.1 unit/kg/h; no bolus. Independent double check at initiation and changes. Dedicated PIV A. Continue to suppress ketogenesis until resolution and basal overlap complete. This fixed rate is the requested simulation-specific departure described in the introduction. |
| D1 0135 | 0200 | D2 0100, rate amendments below | D10W IV via pump, initially 100 mL/h, simultaneous with insulin. Glucose target about 150–200. If POC 100–149, increase D10 by 50 mL/h and notify provider; check POC in one hour, sooner if symptomatic. For 70–99, notify immediately, increase glucose support and recheck in 15 minutes. If <70, hold infusion temporarily, treat hypoglycemia, check every 15 minutes, and obtain immediate insulin/dextrose restart orders once safe. If >200 on two checks or if D10 >200 mL/h would be needed, contact provider for individualized insulin/dextrose/volume review rather than escalating indefinitely. Do not stop insulin solely because glucose is normal. |
| D1 0700 | 0700 | D1 0915 | Hold insulin for K 3.3. D10W reduced to 50 mL/h during hold; hourly POC continues. No insulin restart until repeat K >3.5 and provider review. |
| D1 0910 | 0915 | D2 0100 | K 3.7 now released: restart regular insulin 6 units/h; return D10W to 100 mL/h. Continue last two ordered potassium riders. |
| D1 1300 | 1300 | D2 0100 | POC 148: increase D10W to 150 mL/h under protocol; keep insulin 6 units/h; monitor for volume intolerance. No true hypoglycemia at this point. |
| D1 0135 | 0135 | D2 0700 | Potassium safety protocol: continuous telemetry; verify urine output ≥0.5 mL/kg/h and renal function before replacement; K <3.5: hold insulin and notify provider, order KCl 10 mEq/100 mL IV over one hour, sequentially up to four doses, reassess K after two and at completion; restart insulin only with K >3.5. For K 3.5–4.9, provider selects zero to two sequential 10-mEq doses according to trend, renal function, and remaining insulin exposure; aim approximately 4–5. K ≥5: no replacement. For an unexpected result, oliguria, arrhythmia, or extravasation, stop replacement and obtain urgent assessment. All potassium sources combined must remain ≤10 mEq/h, with no concurrent potassium-containing maintenance infusion during riders if it would exceed that ceiling. |
| D1 0330 | 0330 | D1 0530 | KCl 10 mEq/100 mL IV piggyback over one hour, two sequential doses at 0330 and 0430, total 20 mEq. Use the potassium-free normal saline maintenance order concurrently. |
| D1 0700 | 0700 | D1 1100 | KCl 10 mEq/100 mL IV piggyback over one hour at 0700, 0800, 0900, 1000; four sequential doses, total 40 mEq. Use potassium-free normal saline maintenance concurrently. Inspect peripheral site and pain hourly; do not accelerate rate. |
| D1 1110 | 1130 | D1 1230 | Magnesium sulfate 2 g in 50 mL IV over one hour, PIV C after potassium finishes; repeat Mg with 1450 panel. |
| D1 1500 | 1500 | D1 1700 | KCl 10 mEq/100 mL IV piggyback over one hour at 1500 and 1600, total 20 mEq; D10 and insulin are potassium-free; recheck on 1850 panel. |
| D1 0130 | D1 0140 | D2 1100 discontinued | Ceftriaxone 2 g in 100 mL normal saline IV over 30 minutes every 24 hours, administered D1 0140 and D2 0140. Appropriate empiric urinary-source coverage given no known ESBL/MDR history; do not wait for culture results. Review allergy history and cultures daily. Next D3 0140 dose canceled when oral narrowing is ordered. |
| D2 1100 | D2 1400 | D7 2200 final dose | Stop ceftriaxone; start amoxicillin 1,000 mg PO every eight hours at 0600, 1400, 2200, first dose D2 1400. Susceptible E. coli, improving clinical course, normalizing renal function, no obstruction, and oral tolerance support narrowing. Seven calendar treatment days including initial IV therapy, D1–D7; last dose November 11 at 2200. Reassess duration if relapse, obstruction, or delayed improvement occurs. |
| D1 0120 | 0120 | 0120 | Ondansetron 4 mg IV once, 2 mL; no standing repeat order. |
| D1 0145 | 0150 | 0150 | Acetaminophen 650 mg rectally once for fever. |
| D1 1100 | 1100 | Through cutoff | Acetaminophen 650 mg PO every six hours as needed for pain or fever, maximum total 3,000 mg/24 hours from all routes; only actual post-arrival dose is D1 1200 for headache. |
| D1 0100 | 0110 onward | D4 0700 scheduled endpoint | Initial labs and cultures as listed in section 3. Repeat chemistry, gas, BHB, Mg, phosphorus at 0320 and 0650; lactate at 0320 and 0650, then stop serial lactate once 1.6 is released with improving perfusion. CBC with initial and 0650 samples. |
| D1 0700 | 0900 onward | D2 0700 | K alone 0900; full chemistry/gas/BHB/Mg/phosphorus at 1100, 1450, 1850, 2250 and D2 0650. CBC with D2 0650 panel. More frequent immediate K/gas checks if deterioration; none additionally required in the expected branch. |
| D1 0135 | 0200 | D2 0100 | POC glucose hourly while insulin running or temporarily held; notify for decline, symptoms, or mismatch with CGM. No CGM-only dosing. |
| D1 2300 | D2 0200 | D4 0700 | One extra POC one hour after stopping drip, then AC/HS at 0730, 1130, 1730, 2100; D4 fasting moved to 0700 for endpoint. Additional 15-minute checks for hypoglycemia and targeted post-treatment check as charted. |
| D2 0700 | D2 1850 | D4 0650 collection / 0700 result | Chemistry at D2 1850, D3 0650/1850, D4 0650; CBC/Mg/phosphorus at D3 and D4 0650. Repeat BHB/gas only for recurrent symptoms, falling bicarbonate, or unexplained glucose change; no extra values fabricated. |
| D1 0100 | 0112 | Final cultures after cutoff | Blood cultures ×2 sets and urine culture before antibiotics; track preliminary and final results. No routine repeat blood cultures for negative sets and prompt response; escalate if new fever or clinical deterioration. |
| D1 0335 | 0500 | D1 0530 report | Renal/bladder ultrasound for urinary source with flank tenderness and AKI; no obstruction on report. |
| D1 0110 | 0115 | D1 0115 | Initial 12-lead ECG; simulator follow-up ECG files at D1 0700 and D2 1900 for potassium teaching, as specified in section 9. |
| D1 0100 | 0100 | D1 1100 | NPO except essential medications and supervised mouth care while nauseated/confused. Aspiration assessment before oral intake. |
| D1 1100 | 1100 | D2 0100 | Small supervised clear liquids, initially water and sugar-free fluids; stop if vomiting or unsafe swallow. Carbohydrate comes principally from D10 during DKA therapy. |
| D1 2300 | D2 0100 | Through cutoff | Consistent-carbohydrate diet, approximately 45 g per meal; allow smaller portions counted by nurse/dietitian. Oral fluids as tolerated; no routine maintenance IV fluid after D10 stops. Avoid uncounted large carbohydrate drinks except hypoglycemia treatment. |
| D1 2300 | D1 2300 | D3 2145 superseded | Glargine U-100 12 units SC at 2300 every 24 hours; give first dose now, two hours before infusion stops. Conservative basal dose for older adult, recent AKI, reduced intake, and impaired hypoglycemia awareness. Total daily initial estimate roughly 0.35 unit/kg=21 units: basal 12 plus meals approximately 9. Do not derive home total requirement from the high DKA infusion rate. |
| D1 2300 | D2 0100 | D2 0100 | Stop regular insulin infusion and D10 at 0100 only after confirmed resolution, basal administration verified, ability to drink/eat established, and no recurrent vomiting. Document glucose and overlap. |
| D1 2300 | D2 breakfast | D3 2145 superseded | Lispro U-100 SC **after meals**, within 15 minutes of completion: 1 unit/15 g carbohydrate actually eaten, round to nearest whole unit; add correction from premeal POC: <200 none, 200–249 add 1 unit, 250–299 add 2, 300–349 add 3, ≥350 add 4 and call provider. Hold nutritional dose if meal not eaten; never automatically hold basal. No bedtime correction. Notify provider for premeal <100 or repeated >250. |
| D3 2145 | Lispro revision 2145; basal first dose 2300 | Through cutoff and planned home regimen | Reduce glargine to 10 units SC at 2300 daily after asymptomatic hypoglycemia. Change future lispro carbohydrate ratio to 1 unit/18 g actually eaten, same cautious premeal correction; no bedtime correction. Add targeted POC at D4 0300 after the revised basal dose. First meal under new ratio is beyond cutoff. |
| D1 0700 | D1 0900 | Through cutoff | Enoxaparin 40 mg SC at 0900 daily for VTE prophylaxis while hospitalized; assess bleeding/platelets/renal function. No home continuation planned. |
| D1 0135 | Immediately | Permanent | Discontinue empagliflozin; document serious adverse drug reaction: SGLT2-associated DKA in type 1 diabetes. Medication reconciliation must not reactivate it. Hold lisinopril throughout admission because of dehydration/AKI; outpatient clinician to reassess before restarting. |
| D2 0700 | D2 2100 | Through cutoff; continue at home | Resume atorvastatin 20 mg PO at 2100 daily. No D1 dose while acute illness/limited intake; no catch-up dose. |
| D1 0700 | Immediately | Through cutoff | Nurse-assisted mobility and toileting; bed low, alarm on, call light within reach, nonslip footwear, clear tubing, frequent rounding, no unassisted bathroom trips. Reorient each contact; clock/calendar, glasses/hearing aids, daytime light, nighttime sleep protection, family presence. CAM-ICU each shift while in ICU and for change; floor uses CAM. Avoid benzodiazepines, routine sedatives, and restraints. Escalate new focal signs, inability to protect airway, or abrupt mental change. |
| D1 0700 | Immediately | D2 0700, then through cutoff at reduced frequency | Neuro/attention assessment every two hours initially; urine output hourly by collection hat/commode and measured assisted voids. No Foley for convenience. From D2 0700, assess mentation each shift and with changes; total urine each shift. Report urine <30 mL/h sustained over two hours, new fluid intolerance, or infusion-site injury. Continue strict intake/output and daily weight; no additional weight result is supplied. |
| D2 0900 | D2 0900 | Through cutoff | Assisted ambulation with walker pending PT; chair for meals; one-person hands-on assistance and scheduled toileting. Do not replace assessment with alarms alone. |
| D3 1000 | D3 1000 | Through cutoff | Transfer from ICU to medical ward after sustained resolution and improved attention; continue fall precautions and AC/HS glucose. No further invasive monitoring. |
| D1 0700 | Immediately | Through cutoff | Hospital hypoglycemia order: POC <70 and able to swallow, give 15 g rapid carbohydrate, recheck in 15 minutes and repeat until ≥70; then snack if meal >1 hour away, with repeat checks individualized. If unsafe swallow, D10W 150 mL IV over 15 minutes (15 g); recheck every 15 minutes; notify provider. If no IV access, glucagon 1 mg IM once and summon urgent assistance. For any episode review insulin/nutrition; no actual IV rescue or IM glucagon occurs here. |
| D1 0715 | D1 1130 | Through cutoff | Endocrinology consultation for SGLT2-associated DKA, transition, and hypoglycemia unawareness; ongoing availability for insulin reassessment. |
| D3 2130 | Immediately, formal note planned 2150 | Through cutoff | Request endocrinology reassessment after treated hypoglycemia; obtain telephone insulin-dose advice now and formal follow-up documentation. |
| D2 0830 | D2 1100 | D2 1100 assessment; recommendations ongoing | Infectious-disease consultation after E. coli identification; review final susceptibility when released and plan narrow oral treatment. |
| D2 1050 | D2 1200 | Through cutoff | Pharmacy medication reconciliation, antibiotic dose/route verification, insulin teaching support, and permanent SGLT2 discontinuation flag. |
| D1 1500 | D1 1830 | D3 1300 follow-up | Dietitian for carbohydrate intake and illness nutrition; first abbreviated visit while supervised clear liquids, full teaching when attention improves. |
| D2 0900 | D2 1500 | Through cutoff | Case management for daughter supervision, cat care, supplies, affordability, home nursing, and follow-up appointments. |
| D2 0900 | D3 0930 | D3 0930 assessment; plan ongoing | Physical therapy for gait, assistive device, and entrance steps before home discharge. |
| D2 0900 | D3 1100 | Through cutoff | Diabetes educator for ketone testing, CGM reconnection/alerts, insulin pen demonstration, hypoglycemia rescue, and daughter teach-back. |
| D2 2015 | Immediately | Through cutoff | After assisted near-fall, assess for injury, check cognition and immediate POC glucose, notify provider, reassess toileting plan; no injury imaging indicated absent fall or injury signs. |
| D3 2100 | Immediately | D3 2115 reassessment | Activate standing oral hypoglycemia protocol for POC 63: 120 mL juice containing 15 g glucose at 2100; recheck 2115 and notify provider now. No bedtime correction insulin. |
| D3 2115 | Immediately | D3 2200 targeted monitoring completed | POC now 88: give 15-g carbohydrate cracker snack because next meal is not soon; recheck at 2130 and 2200 and communicate recovery to provider. |
| D4 0700 | Planned departure D4 1000 | Planned discharge, not yet executed | Conditional home discharge after nurse confirms breakfast tolerance, supplies, daughter escort, revised insulin teach-back, and no recurrent low. Continue home glargine 10 at 2300, lispro ratio 1:18 with above premeal correction, amoxicillin through D7 2200, atorvastatin 20 at 2100, and home nasal glucagon 3 mg PRN. Stop empagliflozin permanently; lisinopril remains held pending outpatient reassessment. Inpatient enoxaparin and PRN hospital rescue orders end on actual discharge. |

**Potassium and carrier-fluid check:** LR contains 4 mEq/L intrinsic potassium, so potassium-free normal saline is used during the ED and early unit riders. At 1500–1700 only potassium-free D10W and insulin carrier accompany KCl. Thus the maximum combined IV potassium rate is exactly 10 mEq/h, all through a peripheral piggyback, with no added potassium in maintenance bags.

## 5. Medication administration schedule: drug, dose, route, scheduled time, for all 3 days.

This is the expected **actual MAR** through D4 0700. PRN orders that are not administered remain orders only. Antibiotic times are start times; each ceftriaxone dose runs 30 minutes. Oral tablets/capsules and SC injection volumes are not counted as fluid intake; actual swallowed liquids are included in PO totals.

| Drug / fluid | Dose and route | Administration times / intervals |
|---|---|---|
| LR boluses, ED | 500 mL IV over 30 min; 500 mL over 30 min; 800 mL over 60 min | D1 0100, 0130, 0200 respectively; ends 0300 |
| Isotonic ED maintenance | LR IV 100 mL/h, then NS 100 mL/h during potassium riders, then LR again | LR D1 0300–0330 and 0530–0700, 200 mL total; NS 0330–0530, 200 mL |
| NS unit maintenance | IV 100 mL/h | D1 0700–1100, 400 mL; discontinued 1100 |
| D10W | IV 100, 50, 100, then 150 mL/h | D1 0200–0700 at 100; 0700–0915 at 50; 0915–1300 at 100; 1300–D2 0100 at 150; then stopped |
| Regular insulin | IV 6 units/h, 1 unit/mL; no bolus | D1 0200–0700; held 0700–0915; 0915–D2 0100; no infusion on D2 after 0100 or D3 |
| KCl | Each 10 mEq/100 mL IV over one hour, never concurrent riders | D1 0330, 0430; 0700, 0800, 0900, 1000; 1500, 1600. Total 80 mEq in 800 mL across ED and unit; none D2/D3. |
| Magnesium sulfate | 2 g/50 mL IV over one hour | D1 1130–1230 only |
| Ceftriaxone | 2 g/100 mL NS IV over 30 min | D1 0140 and D2 0140 only; next dose canceled |
| Amoxicillin | 1,000 mg PO | D2 1400, 2200; D3 0600, 1400, 2200; D4 0600. Future doses at 0600/1400/2200 until D7 2200. |
| Ondansetron | 4 mg IV, 2 mL | D1 0120 once |
| Acetaminophen | 650 mg rectally; then 650 mg PO PRN | D1 0150 rectally; D1 1200 PO for headache; no other administrations |
| Glargine U-100 | SC | D1 2300:12 units; D2 2300:12 units; D3 2300:10 units after dose reduction |
| Lispro U-100 | SC after observed meal intake | D2 0800:3 units for 45 g; 1200:3 for 45 g; 1800:4 for 45 g plus premeal glucose 204 (3 nutritional +1 correction). D3 0800:3 for 45 g; 1200:3 for 45 g; 1800:2 for 30 g. No HS lispro, no additional correction or snack dose. |
| Enoxaparin | 40 mg SC | D1, D2, D3 at 0900 |
| Atorvastatin | 20 mg PO | D2 and D3 at 2100; D1 home continuation withheld |
| Oral glucose rescue | 120 mL juice containing 15 g rapid carbohydrate PO | D3 2100; followed by 15-g carbohydrate cracker snack at 2115 after POC 88; no second rapid-carbohydrate dose needed |
| NS line flushes | 10 mL IV each; include in IV medication volumes | ED D1 0125, 0210, 0530. D1 unit 1100, 1230, 1700, 1830; D1 night 2100, D2 0110, 0210, 0630. D2 day 0800, 1200, 1600, 1830; D2 night 2100, D3 0630. D3 day 0800, 1200, 1600, 1830; D3 night 2100, D4 0630. Flushes are distributed across the three PIVs according to use and site policy; no extra delivered flush volume is assumed. |
| Empagliflozin and lisinopril | No inpatient administrations | Empagliflozin permanently stopped; lisinopril held |

## 6. Intake and output per 12-hour shift (IV fluid, IV meds, PO, urine, emesis).

All volumes are mL, measured at the patient, without rounding individual fractional infusion amounts. IV medication column includes insulin carrier, electrolyte diluent, antibiotic diluent, and saline flushes. PO includes water taken with pills and juice used for rescue; solids are not counted as mL. No drain output, stool-volume loss, blood products, or unlisted IV carriers. Emesis is zero after ED. Insensible loss is not included in measured I/O.

**Pre-simulation ED ledger, D1 0100–0700, kept separate to prevent double counting:** LR boluses 1,800 + LR maintenance 200 + NS maintenance 200 =2,200 isotonic fluid; D10 5 h×100=500; insulin carrier 5 h×6=30; KCl 2×100=200; ceftriaxone 100; ondansetron 2; flushes 30; PO 0. **Intake 3,062.** Urine 700 + emesis 150 = **output 850**. **Net +2,212.** The D1 0700 medication and rate changes belong to the first simulation shift.

| Shift | IV fluid math | IV medication math | PO | Total intake | Urine | Emesis | Total output | Net |
|---|---|---|---:|---:|---:|---:|---:|---:|
| D1 0700–1900 | NS 4×100=400; D10 (2.25×50)+(3.75×100)+(6×150)=1,387.5; fluid subtotal 1,787.5 | Insulin 9.75×6=58.5; KCl 6×100=600; Mg 50; flushes 40; subtotal 748.5 | 300 | 2,836 | 1,500 | 0 | 1,500 | +1,336 |
| D1 1900–D2 0700 | D10 6×150=900 | Insulin 6×6=36; ceftriaxone 100; flushes 40; subtotal 176 | 450 | 1,526 | 1,500 | 0 | 1,500 | +26 |
| D2 0700–1900 | 0 | Flushes 40; no IV antibiotic after switch | 1,400 | 1,440 | 1,400 | 0 | 1,400 | +40 |
| D2 1900–D3 0700 | 0 | Flushes 20 | 600 | 620 | 800 | 0 | 800 | −180 |
| D3 0700–1900 | 0 | Flushes 40 | 1,600 | 1,640 | 1,500 | 0 | 1,500 | +140 |
| D3 1900–D4 0700 | 0 | Flushes 20 | 650, including 120 rescue juice | 670 | 900 | 0 | 900 | −230 |
| Six-shift totals | 2,687.5 | 1,044.5 | 5,000 | **8,732** | **7,600** | **0** | **7,600** | **+1,132** |

Arithmetic checks: 2,687.5+1,044.5+5,000=8,732; 8,732−7,600=1,132. Including ED separately: intake 3,062+8,732=11,794; output 850+7,600=8,450; cumulative measured net +3,344. Average urine rate in the lowest-output 12-hour shift is 800/(60×12)=1.11 mL/kg/h; output never requires holding replacement for oliguria in the expected scenario. Fluid balance is assessed clinically rather than assuming the entire positive balance is retained intravascularly.

## 7. Checkpoint table: for each 0700 and 1900 (Day 1 0700 through Day 4 0700): monitor values to set, bedside findings to portray (including confusion level), new labs/results available, new orders, the development or problem of that shift, expected nursing actions.

**FACILITATOR ONLY:** These are programmed monitor settings, not later charted vital signs. BP is mmHg; HR/RR per minute; temperatures °C; SpO2 on room air. “Shift development” gives the faculty release script for the *following* shift; do not reveal a future event at the opening handoff. Only the “available now” column is available at that checkpoint.

| Checkpoint | Monitor values to set, rhythm, T waves | Bedside portrayal / confusion | New labs/results available now | Orders available at checkpoint | Shift development and release time | Expected nursing actions |
|---|---|---|---|---|---|---|
| D1 0700, shift 1 opens | HR104; BP116/64; RR24, deep; SpO2 98%; T38.0; sinus tachycardia; mildly flattened T waves, small U waves | Dry mouth, weak, oriented to person/place only; distractible and CAM-ICU positive; protects airway, follows one-step commands; no focal deficit | 0650 panel released now: K3.3, HCO3 12, gap17, BHB4.1, glucose168, lactate1.6, Mg1.6 | Stop insulin; D10 50; NS 100; four KCl riders; K recheck 0900; Mg after riders; continue antibiotic plan | 0910: K3.7 allows restart at 0915. 1300: POC 148 requires more dextrose. 1500: gap11 with BHB1.2 tests premature stopping. | Check handoff/pumps; immediately hold insulin; replace K ≤10 mEq/h; inspect PIVs; resume only after repeat K; support glucose; recognize persistent DKA despite low glucose/closed gap; strict I/O and delirium precautions |
| D1 1900, shift 2 opens | HR92; BP118/66; RR20; SpO2 98%; T37.6; sinus rhythm; normal T waves, no U waves | Knows person/place, inconsistently date; attention fluctuates; nausea resolved; asks about cat | 1850 panel: K4.1, HCO3 18, gap11, BHB0.7, glucose176; urine preliminary GNR released 1800 | Continue insulin6 and D10150; next panel 2250; no transition order yet | 2100: nocturnal disorientation. 2300: BHB0.4, pH7.36, HCO3 19 allows glargine; D2 0100 stop after overlap. | Reorient and investigate worsening attention without assuming dementia; check glucose and oxygenation; protect sleep and assist toileting; do not stop at BHB0.7; independently verify basal dose and two-hour overlap |
| D2 0700, shift 3 opens | HR84; BP124/68; RR18; SpO2 98%; T37.1; sinus rhythm; normal T waves | Oriented to person/place/date, occasional slowed attention; CAM-ICU negative this morning; eats with supervision; strength reduced | 0650: K4.0, HCO3 21, gap10, BHB0.3, Cr0.8, WBC12.8; blood cultures preliminary no growth at24h | Basal-bolus regimen and diet active; AC/HS POC; atorvastatin restart scheduled2100; consult requests placed0900 | 0800 E. coli identified; 1045 susceptibilities finalized; 1100 oral narrowing ordered, first amoxicillin 1400 | Verify actual basal/drip overlap in MAR; match meal insulin to intake; assess oral tolerance, allergies, cultures and renal recovery; explain narrowed antibiotic; begin family/supply planning |
| D2 1900, shift 4 opens | HR80; BP126/70; RR16; SpO2 98%; T36.9; sinus rhythm; normal T waves | Oriented ×4 in conversation but impulsive about toileting; neuropathy and tubing increase risk; CAM negative | 1850: K4.0, HCO3 23, gap10, glucose192; final urine susceptibility already available; no new positive blood culture | Oral amoxicillin active; one-person assist with walker; evening basal 12; no HS correction | 2015: attempts to walk to bathroom alone, knees buckle; nurse supports her before a fall; no impact/injury; immediate POC 186. D3 0120: blood cultures no growth48h. | Remain with patient, help to chair/bed, assess injury and mental status, obtain immediate glucose, notify provider, document near-fall, reinforce scheduled toileting and hands-on assistance |
| D3 0700, shift 5 opens | HR76; BP128/72; RR16; SpO2 98%; T36.8; sinus rhythm; normal T waves | Oriented ×4, sustained attention improved; remembers near-fall; mild deconditioning; asks to go home | 0650: K4.1, HCO3 24, gap9, glucose154, WBC9.8, Cr0.8; blood cultures remain preliminary negative48h | PT 0930; transfer to ward 1000; educator 1100; dietitian 1300; case-management follow-up 1530; continue insulin and oral antibiotic | Daughter arrives for supervised teaching; PT recommends walker and temporary supervision; supplies and cat care confirmed during day | Observe gait rather than accepting self-report; supervise insulin and ketone demonstrations; include daughter with consent; confirm prescriptions/affordability and a specific support plan |
| D3 1900, shift 6 opens | HR74; BP124/70; RR16; SpO2 98%; T36.7; sinus rhythm; normal T waves | Oriented ×4, pleasant, no adrenergic symptoms; dinner smaller than lunch; ambulates with assistance | 1850: K4.0, HCO3 24, gap9, serum glucose118; no new culture finalization | Existing basal 12 due 2300, AC/HS glucose, hypoglycemia protocol; no preventive dose change yet | 2100: routine HS POC 63 without warning symptoms; juice then snack; 2145 revised basal 10 and lispro1:18 orders; no HS correction | Treat the measured low despite absence of symptoms; remain at bedside and recheck; notify provider, review intake/activity/insulin and reduce future dosing only with order; ensure recovery before basal administration |
| D4 0700, closing checkpoint | HR76; BP126/70; RR16; SpO2 98%; T36.8; sinus rhythm; normal T waves | Oriented ×4, CAM negative, able to teach back; daughter expected for planned later discharge; still needs walker/supervision | 0650: K4.1, HCO3 24, gap9, serum glucose145, Cr0.8, WBC8.2; POC 145 now; blood cultures preliminary negative72h released 0120 | Revised insulin regimen active; conditional discharge order written0700 for anticipated1000 after final checks | Endpoint: reassess safe disposition after prior asymptomatic low; no events after0700 are charted | Confirm overnight recovery and morning glucose, breakfast/insulin plan, daughter supervision, ketone and glucose supplies, rescue plan, antibiotic end date, permanent SGLT2 stop, pending-culture ownership and follow-up |

## 8. Notes: list each note with time, author and role, type (provider progress, nursing, endocrinology, infectious disease or pharmacy, physical therapy, case management, dietitian), and the full note text (6-15 sentences each). About 25-35 notes total across ED and 3 days.

All authors below are fictional. There are **30 notes**, each with six complete sentences. Numerical post-arrival vital observations are deliberately absent. Orders and plans for future actions are identified as plans; no note asserts an unreleased result or unperformed event.

### Note 01 — D1 0115 — Maya Patel MD, ED physician — Provider progress, initial evaluation

Ruth Nakamura presents with acute confusion, dysuria, flank discomfort, and vomiting after reduced oral intake. Her daughter describes independent cognition at baseline and reports recent use of empagliflozin for longstanding type 1 diabetes. Examination shows dehydration, deep breathing, right costovertebral-angle tenderness, and inattention without a focal neurological deficit. A urinary infection with sepsis is strongly suspected, and DKA remains possible despite the modest home glucose readings. Initial blood samples and the first blood-culture set have been collected, and the second culture set is being obtained before antibiotics. Crystalloid resuscitation and close airway, perfusion, and urine-output assessments are underway while results are pending.

### Note 02 — D1 0135 — Maya Patel MD, ED physician — Provider progress, diagnostic update

The initial panel released at 0130 shows glucose 210, bicarbonate 9, anion gap 24, beta-hydroxybutyrate 6.8, and arterial pH 7.12. This establishes DKA with near-euglycemia in the setting of SGLT2 exposure and probable urinary-source sepsis. The arterial pCO2 of 29 exceeds Winter's expected range, so airway protection, fatigue, and a superimposed respiratory disturbance require reassessment. Lactate is 3.2 and creatinine is 1.2 compared with the known baseline of 0.7. Blood and urine cultures were collected before antibiotics, and ceftriaxone is scheduled to begin at 0140. Empagliflozin is discontinued, and orders now specify insulin without a bolus together with dextrose from initiation and frequent potassium surveillance.

### Note 03 — D1 0300 — Daniel Brooks RN, ED nurse — Nursing, stabilization

The prescribed three crystalloid boluses have finished, delivering a total of 1,800 mL. Ceftriaxone was administered beginning at 0140 after blood and urine specimens were collected. Regular insulin and D10W both began at 0200 through separately controlled pumps, with the insulin dose independently checked. The most recent bedside glucose is 194 at 0300. Ruth remains inattentive but follows simple instructions, and she has had no additional vomiting since antiemetic administration. Urine is being measured with assisted collection, and she is not permitted to walk to the bathroom alone.

### Note 04 — D1 0600 — Daniel Brooks RN, ED nurse — Nursing, transfer preparation

The 0320 chemistry showed potassium 4.0, and the two ordered 10-mEq potassium riders were administered sequentially at 0330 and 0430. Potassium-free normal saline replaced LR during those riders, and LR resumed afterward at the ordered maintenance rate. The repeat arterial gas released at 0330 showed pH 7.25 and pCO2 24, with beta-hydroxybutyrate still elevated at 5.7. Bedside glucose at 0600 is 168 while insulin and D10 continue. The ultrasound report released at 0530 shows no hydronephrosis or urinary obstruction. The receiving nurse has been told that a pre-transfer laboratory sample is planned for 0650 and that its results are not yet available.

### Note 05 — D1 0700 — Elena Ruiz RN, ICU nurse — Nursing, arrival and critical laboratory response

Ruth arrived from the ED with insulin and dextrose infusing and with three peripheral IVs in place. The transfer panel became available at arrival and shows potassium 3.3, bicarbonate 12, gap 17, and beta-hydroxybutyrate 4.1. I stopped the insulin infusion immediately, notified the admitting provider, and independently verified the new replacement orders. D10 was reduced to 50 mL per hour, and potassium-free normal saline replaced LR while the first unit potassium rider began. She is oriented to person and place but cannot sustain attention to questions about the date. The bed alarm is active, the call light is within reach, and all toileting will be assisted.

### Note 06 — D1 0715 — Adrian Chen MD, intensivist — Provider progress, admission

The patient has SGLT2-associated DKA, urinary-source sepsis, acute metabolic encephalopathy, and improving prerenal acute kidney injury. Her latest glucose is not a reliable marker of ketoacidosis severity because beta-hydroxybutyrate remains 4.1. Insulin is held for potassium 3.3, and four sequential peripheral potassium riders have been ordered with an interim potassium check after two doses. No potassium-containing maintenance fluid will run concurrently with the riders. Lactate has decreased to 1.6 following resuscitation, and the lung examination does not suggest fluid overload. Endocrinology has been requested to assist with the infusion course, transition planning, and medication safety after this episode.

### Note 07 — D1 0930 — Elena Ruiz RN, ICU nurse — Nursing, insulin restart

The interim potassium sample collected at 0900 was released at 0910 with a value of 3.7. The provider reviewed the result and authorized resumption of insulin at 0915. Insulin is now running at 6 units per hour, and D10 has returned to 100 mL per hour. The final two potassium riders remain sequential, with the fourth scheduled to finish at 1100. The peripheral sites are without pain, leakage, or visible inflammation. Ruth follows one-step directions and accepts assisted toileting but still needs repeated reminders about why she is hospitalized.

### Note 08 — D1 1130 — Leah Morgan MD, endocrinologist — Endocrinology, consultation

The 1100 panel released at 1110 shows potassium 4.0, bicarbonate 14, gap 15, and beta-hydroxybutyrate 2.8. Continued ketonemia requires insulin even though serum glucose is 172. The prescribed infusion remains at 6 units per hour, and dextrose support must be titrated to prevent hypoglycemia. Magnesium replacement is starting now for the persistent value of 1.6. Phosphorus is reduced at 1.8, but there is no respiratory muscle weakness or other indication for routine phosphate replacement. I recommend permanent empagliflozin discontinuation and a conservative basal-bolus regimen after measured ketoacidosis resolution with an appropriate overlap.

### Note 09 — D1 1310 — Elena Ruiz RN, ICU nurse — Nursing, glucose support adjustment

The 1300 bedside glucose was 148, down from 164 at 1200. Ruth denied symptoms, which does not exclude a clinically important decline given her history of impaired awareness. D10 was increased from 100 to 150 mL per hour under the active protocol, and the provider was notified. Insulin remains at 6 units per hour because the latest available ketone result still indicates active DKA. The next bedside glucose check remains due at 1400, with earlier testing for any change in condition. The magnesium infusion finished at 1230, and the fluid record includes its full 50-mL volume.

### Note 10 — D1 1515 — Adrian Chen MD, intensivist — Provider progress, persistent ketonemia

The 1450 panel was released at 1500 with bicarbonate 17, pH 7.33, gap 11, and beta-hydroxybutyrate 1.2. Although the anion gap has closed, the ketoacidosis has not met the current resolution criterion because ketones remain elevated. Insulin and D10 will therefore continue rather than transitioning solely on the gap. Potassium has decreased to 3.8, and two additional sequential peripheral potassium riders were ordered at 1500 and 1600. Magnesium has improved to 1.9 after replacement. The patient is tolerating supervised clear fluids and has not vomited again.

### Note 11 — D1 1830 — Nina Shah RD, registered dietitian — Dietitian, initial assessment

Ruth remains on insulin with intravenous dextrose and is currently limited to supervised clear fluids. She reports eating very little during the illness because nausea and urinary symptoms disrupted her usual routine. I explained that insulin is still needed during illness even when appetite is poor, with carbohydrate support adjusted to the clinical situation. Her attention is variable, so detailed carbohydrate-counting education will be repeated after recovery. The usual home meal pattern is approximately three meals daily, and her daughter can help provide food during convalescence. A full meal plan and teach-back session are planned once the diet advances and concentration improves.

### Note 12 — D1 1915 — Marcus Lee RN, ICU night nurse — Nursing, evening handoff

The 1850 results released at 1900 show bicarbonate 18, gap 11, potassium 4.1, and beta-hydroxybutyrate 0.7. Insulin and D10 remain necessary because the ketone concentration has not fallen below 0.6. The urine culture preliminary report released at 1800 describes a heavy growth of gram-negative rods without final identification. Ruth recognizes the hospital and asks about her cat, but she gives an inconsistent date. Her daughter has confirmed that the cat is fed and safe at home. I reviewed the infusion orders, planned laboratory timing, fall precautions, and need for continued potassium surveillance at handoff.

### Note 13 — D1 2130 — Marcus Lee RN, ICU night nurse — Nursing, nocturnal delirium

At 2100 Ruth became more disoriented and said she needed to leave to feed the cat. Bedside glucose at that time was 168, so hypoglycemia did not account for the behavior. She remained inattentive but followed a calm request to sit, with no focal neurological change or visible breathing distress. I reoriented her, reduced unnecessary room stimulation, assisted her to the commode, and facilitated a brief reassuring conversation with her daughter. CAM-ICU remains positive, and the provider was informed of the fluctuation. No sedative, restraint, or unassisted ambulation was used.

### Note 14 — D1 2315 — Adrian Chen MD, intensivist — Provider progress, resolution and transition orders

The 2250 panel released at 2300 shows beta-hydroxybutyrate 0.4, pH 7.36, bicarbonate 19, gap 10, and potassium 4.0. DKA is now biochemically resolved by the current ketone and acid-base criteria. Glargine 12 units was administered at 2300, and both the insulin infusion and D10 are to continue until 0100 for a full two-hour overlap. She is taking supervised fluids without recurrent vomiting, and a consistent-carbohydrate diet is ordered for the transition. Meal lispro will be based on the carbohydrate actually consumed, with no bedtime correction. Ongoing delirium and hypoglycemia unawareness justify continued supervision and a conservative initial subcutaneous dose.

### Note 15 — D2 0115 — Marcus Lee RN, ICU night nurse — Nursing, completed transition

I verified the 2300 glargine administration and the two-hour overlap before stopping insulin and D10 at 0100. Bedside glucose at discontinuation was 178. Ruth tolerated oral fluids and a small snack without nausea or vomiting. A one-hour post-transition bedside glucose is ordered for 0200 before routine AC and HS checks begin. She remains intermittently unsure of the date but accepts reorientation and assisted toileting. The next ceftriaxone dose is scheduled for 0140, and blood-culture status has not yet been released at the time of this note.

### Note 16 — D2 0715 — Adrian Chen MD, intensivist — Provider progress, morning recovery

The morning results released at 0700 show bicarbonate 21, gap 10, beta-hydroxybutyrate 0.3, creatinine 0.8, and WBC 12.8. There is no biochemical evidence of recurrent DKA after the transition. Ruth is oriented to person, place, and date and has improved attention, with a negative CAM-ICU assessment this morning. Blood cultures were reported as no growth at approximately 24 hours when the preliminary update was released at 0120. The urine culture remains a preliminary gram-negative rod result, and ceftriaxone continues pending identification and susceptibility. Assisted mobilization, meal-based insulin observation, and multidisciplinary discharge preparation will proceed today.

### Note 17 — D2 1100 — Omar Bennett MD, infectious-disease physician — Infectious disease, consultation

Urine identification released at 0800 confirmed E. coli, and the final susceptibility report became available at 1045. The isolate is susceptible to ampicillin with an MIC of 2 and is also susceptible to ceftriaxone, while ciprofloxacin is resistant. The clinical syndrome is a febrile complicated urinary infection with flank tenderness and sepsis, without demonstrated bacteremia or obstructed drainage. She is clinically improving and tolerating oral intake, so I ordered ceftriaxone discontinued and amoxicillin 1,000 mg orally every eight hours starting at 1400. The planned course is seven calendar treatment days including the initial IV therapy, with the last dose on November 11 at 2200 if recovery continues. Final blood-culture results still require follow-up after discharge, and recurrent symptoms would prompt reassessment of source control and treatment duration.

### Note 18 — D2 1200 — Sofia Alvarez PharmD, clinical pharmacist — Pharmacy, reconciliation and safety

I verified the final E. coli susceptibility result, the amoxicillin dose, and the absence of a penicillin allergy. The first oral antibiotic dose remains scheduled for 1400, and the next ceftriaxone dose has been removed from the MAR. Empagliflozin is flagged as a serious adverse drug reaction associated with this DKA episode and must not reappear on discharge reconciliation. Lisinopril remains held while the team evaluates recovery from dehydration and AKI. The glargine schedule is 2300, and meal lispro is given after observed intake with no bedtime correction. The patient and daughter will receive a printed medication list that clearly distinguishes the permanent discontinuation from the temporary antihypertensive hold.

### Note 19 — D2 1500 — Claire Davis RN CCM, case manager — Case management, initial discharge assessment

Ruth lives alone and normally manages her own medications, meals, and household tasks. Emi lives nearby and has agreed to help with the cat and provide supervision after discharge. The family reports that insulin pens and glucose test strips are affordable through the current coverage. A blood-ketone meter, strips, replacement CGM supplies, and rescue glucagon availability still need verification before departure. Ruth's recent delirium and reduced mobility make an immediate return to completely unsupervised living inappropriate. I am coordinating therapy evaluation and a family teaching visit before recommending a final disposition.

### Note 20 — D2 1915 — Hannah Park RN, ICU nurse — Nursing, evening recovery assessment

The evening chemistry released at 1900 shows bicarbonate 23, gap 10, potassium 4.0, and serum glucose 192. Ruth ate the documented meals today and received lispro after intake, including one correction unit with dinner for the premeal glucose of 204. The first amoxicillin dose was given at 1400 without an allergic reaction or gastrointestinal intolerance. She is oriented during conversation but tends to stand before asking for assistance. I reinforced the call-light plan and arranged a walker and commode within the assisted-care routine. The scheduled evening plan includes bedside glucose at 2100 and basal insulin at 2300 without a bedtime correction dose.

### Note 21 — D2 2030 — Hannah Park RN, ICU nurse — Nursing, assisted near-fall

At 2015 Ruth attempted to walk to the bathroom before staff could assist her. Her knees began to buckle, and I supported her into a nearby chair without a floor descent, head strike, or other impact. She denied pain, and assessment found no injury or focal neurological change. An immediate bedside glucose check was 186, excluding hypoglycemia at the time of the event. I notified the provider, reviewed the event with Ruth, and reinforced hands-on assistance with scheduled toileting. The 2100 bedside glucose remains due, with immediate additional testing if any symptoms or attention change develops.

### Note 22 — D3 0715 — Adrian Chen MD, intensivist — Provider progress, readiness for lower-acuity care

The morning panel released at 0700 shows bicarbonate 24, gap 9, creatinine 0.8, and WBC 9.8. Blood cultures were again reported as no growth at approximately 48 hours when the update was released at 0120. Ruth is fully oriented today, recalls the assisted near-fall, and agrees to ask for help with walking. She is tolerating oral antibiotics and meals without recurrent urinary pain or vomiting. DKA and the acute kidney injury have resolved, while deconditioning and impaired hypoglycemia awareness remain discharge concerns. Transfer to the medical ward is ordered for 1000 with continued glucose testing, fall precautions, and planned therapy and family education.

### Note 23 — D3 0930 — Ethan Miller PT, physical therapist — Physical therapy, mobility evaluation

Ruth demonstrates mild bilateral lower-extremity weakness and reduced distal sensation in both feet. She transfers with a walker and one-person standby assistance after reminders to pause before standing. During a supervised short hallway walk she initially advances the walker too far but corrects the technique with cueing. She practiced two entrance steps using a railing with hands-on assistance and no loss of balance. I recommend a rolling walker, temporary family supervision, and home therapy rather than unsupervised mobility immediately after discharge. Nursing should continue assisted toileting and reinforce the same transfer sequence consistently.

### Note 24 — D3 1100 — Grace Kim RN CDCES, diabetes educator — Nursing, diabetes education

Ruth and Emi participated in teaching with Ruth's consent after transfer to the ward. They correctly explained that nausea, vomiting, deep breathing, and confusion require assessment for ketones even when glucose is near the usual range. Ruth demonstrated blood-ketone testing and explained why basal insulin must continue during illness unless a clinician gives a specific alternative plan. Emi practiced the insulin pen safety check and reviewed how meal doses depend on the carbohydrate actually eaten. We reconnected the CGM receiver and set a low alert of 90, while reinforcing that hospital dosing still uses bedside testing. Both participants understand that empagliflozin has been permanently discontinued and that recurrent symptoms require urgent clinical advice rather than waiting for marked hyperglycemia.

### Note 25 — D3 1300 — Nina Shah RD, registered dietitian — Dietitian, meal planning follow-up

Ruth is now able to sustain attention throughout the discussion and accurately counts the carbohydrate in the sample meal. The usual plan is approximately 45 g carbohydrate at each meal, with the option to eat a smaller amount and receive the corresponding prescribed insulin dose. She and Emi described several easy meals and agreed that Emi will prepare food during the first days home. We reviewed maintaining fluids and a source of carbohydrate during illness and contacting the diabetes team early when intake declines. I reinforced that treating a low glucose requires rapid carbohydrate first, with a follow-up snack when the next meal is not soon. Emi will keep a written food and insulin record temporarily so the outpatient team can adjust doses to recovery and appetite.

### Note 26 — D3 1530 — Claire Davis RN CCM, case manager — Case management, family support and supplies

Emi confirms that she will stay with Ruth continuously for the first 72 hours after discharge and continue daily visits afterward. The cat is being cared for, and this concern is no longer prompting Ruth to try to leave unexpectedly. A rolling walker, functioning glucose meter, CGM supplies, blood-ketone meter and strips, and unexpired nasal glucagon are available for home use. Home nursing has accepted a visit request for the day after the anticipated discharge. Follow-up arrangements include an endocrinology contact within 48 hours and an office visit within one week, with primary-care review of the temporary lisinopril hold. Discharge remains dependent on the medical team's reassessment, final teaching verification, and safe glucose control overnight.

### Note 27 — D3 1915 — Olivia Reed RN, medical-ward nurse — Nursing, evening handoff

Ruth is oriented and converses appropriately, with no recurrence of delirium during this shift. The evening chemistry released at 1900 shows bicarbonate 24, gap 9, potassium 4.0, and serum glucose 118. She ate 30 g carbohydrate at dinner and received 2 units of lispro afterward according to the current order. She spent more time walking with assistance today and continues to deny warning symptoms when discussing past low glucose episodes. The bedtime glucose check remains scheduled for 2100, and glargine 12 units is currently ordered for 2300. I reviewed the rescue protocol, the need to observe actual intake, and the family's planned supervision with the oncoming nurse.

### Note 28 — D3 2120 — Olivia Reed RN, medical-ward nurse — Nursing, asymptomatic hypoglycemia

The routine 2100 bedside glucose was 63 even though Ruth denied sweating, tremor, palpitations, or hunger. She remained alert and swallowed safely, so I administered 120 mL juice containing 15 g rapid carbohydrate under the hypoglycemia order. The provider was notified at 2105. At 2115 the repeat bedside glucose was 88, and I gave the ordered follow-up cracker snack because the next meal was not soon. No bedtime correction insulin has been administered, and I am remaining with her during the immediate recovery period. Repeat bedside glucose is planned at 2130, and the basal dose requires provider review before the scheduled 2300 administration.

### Note 29 — D3 2150 — Leah Morgan MD, endocrinologist — Endocrinology, insulin reassessment after low glucose

I reviewed the asymptomatic glucose of 63 and the treatment response of 88 at 2115 and 107 at 2130. The episode occurred without a bedtime correction and in the setting of improving insulin sensitivity, increased activity, and variable appetite. At 2145 I reduced the scheduled glargine from 12 to 10 units and changed future meal dosing to 1 unit per 18 g carbohydrate, retaining the cautious premeal correction scale. Basal insulin will still be administered because she has type 1 diabetes, with additional monitoring rather than omission. A further bedside check is planned at 2200 before the revised 2300 basal administration. The patient and daughter will need repeat teach-back of the revised doses and the impaired-awareness rescue plan before discharge.

### Note 30 — D4 0700 — Adrian Chen MD, attending physician — Provider progress, simulation endpoint and discharge readiness

The closing laboratory panel released at 0700 shows bicarbonate 24, gap 9, creatinine 0.8, potassium 4.1, and WBC 8.2, with bedside glucose 145. After the evening low, bedside glucose reached 126 at 2200, glargine 10 units was administered at 2300, and the targeted 0300 bedside glucose was 132. Ruth is fully oriented and can describe the purpose of ketone testing and the permanent empagliflozin discontinuation. Blood cultures remain preliminary with no growth at approximately 72 hours, and our inpatient team retains responsibility for reviewing the final result. I have written a conditional discharge order for an anticipated 1000 departure after breakfast tolerance, daughter arrival, supply verification, and repeat teaching of the revised insulin regimen. No discharge, subsequent glucose value, or final culture result is documented as having occurred after this 0700 endpoint.

## 9. ECG: times, rate, PR, QRS, QTc, T-wave description, consistent with potassium.

The first ECG is a charted ED diagnostic study. The two later entries are **facilitator ECG files to load at the indicated checkpoint**, with their rates treated as simulator metadata rather than additional charted vital signs. Automated QTc uses the same teaching convention in all three files; inspect the T-wave end carefully when a U wave is present.

| Time / file | Rate/min | PR ms | QRS ms | QTc ms | T waves / interpretation / potassium context |
|---|---:|---:|---:|---:|---|
| D1 0115 ED ECG; interpretation available0130 | 118 | 156 | 86 | 445 | Sinus tachycardia, normal T-wave contour without pathological peaking, no ischemic ST pattern; K4.8 on initial draw. A normal serum K does not exclude substantial whole-body deficit. |
| D1 0700 facilitator file | 104 | 164 | 88 | 462 | Sinus tachycardia, mild diffuse T-wave flattening and small U waves, no QRS widening or ventricular ectopy; K3.3 released now. Do not confuse a U wave with the end of the T wave when measuring QT. |
| D2 1900 facilitator file | 80 | 166 | 86 | 438 | Sinus rhythm, normal T-wave amplitude, U waves no longer apparent, narrow QRS; K4.0 on latest panel. |

## 10. Discharge plan and teaching points.

**Disposition at cutoff:** Still hospitalized at D4 0700. Anticipated home departure is D4 1000 after the conditional requirements are met; this is a plan, not a completed event. Ruth will use a rolling walker, Emi will stay continuously for the first 72 hours, and home nursing is requested for D5. If glucose falls again, intake is inadequate, delirium returns, or supervision cannot be provided, reassess discharge rather than assuming readiness from closed DKA labs alone.

**Medication list to teach back:** Glargine U-100 10 units SC at 2300 daily; lispro U-100 after meals, 1 unit per 18 g carbohydrate actually consumed, rounded to the nearest whole unit, plus the stated cautious premeal correction scale; no bedtime correction. Amoxicillin 1,000 mg PO at 0600, 1400, and 2200 through **November 11 at 2200**, with **11 doses remaining after D4 0700**. Continue atorvastatin 20 mg PO at 2100 and nasal glucagon 3 mg for severe hypoglycemia, repeatable after 15 minutes with a new device while emergency help is summoned. Empagliflozin is permanently stopped; document the DKA adverse reaction and communicate it to the outside prescriber. Lisinopril remains on hold until the outpatient clinician explicitly restarts it after reviewing intake, renal recovery, and blood pressure. Enoxaparin is for inpatient prophylaxis only.

**Illness and ketones:** Do not use a reassuring glucose number to exclude DKA, particularly with nausea, vomiting, abdominal pain, deep breathing, or confusion. Check blood ketones when ill or when these symptoms occur, even if glucose is 150–200; glucose and ketones answer different questions. Never omit basal insulin because food intake is poor; call the diabetes team promptly for a specific dose and carbohydrate/fluid plan. Use the meter according to its instructions, confirm supplies and expiry dates, and record the result and time. For this discharge plan, BHB 0.6–1.4 mmol/L prompts immediate diabetes-team contact and a repeat within two hours; BHB ≥1.5, persistent vomiting, inability to keep fluids down, new confusion, breathing difficulty, or inability to obtain urgent advice warrants ED assessment. BHB ≥3 is an emergency; do not wait for a high glucose reading or try to manage recurrent DKA at home. These conservative escalation thresholds are the individualized teaching plan, not substitute home IV-insulin orders.

**Hypoglycemia unawareness:** Use CGM alerts with a low alert of 90 and caregiver sharing with Ruth's consent; carry the fingerstick meter and check it for low alerts, symptoms, or suspected mismatch. Check before meals, at bedtime, and overnight initially as directed by endocrinology after the recent low. When awake and able to swallow with glucose <70, take 15 g rapid carbohydrate, recheck in 15 minutes, and repeat until ≥70; then eat a snack if the next meal is more than an hour away. If unconscious, seizing, or unable to swallow, the daughter should give nasal glucagon and call emergency services without offering food or drink. Carry glucose and medical identification, avoid driving until hypoglycemia risk and cognition have been reviewed, and keep a written insulin/food/glucose record. The daughter should demonstrate the glucagon device and repeat the revised basal and carbohydrate-ratio instructions after the D3 dose changes.

**Infection, recovery, and home safety:** Complete the antibiotic course and seek prompt reassessment for recurrent urinary symptoms, feverishness, flank pain, rigors, reduced urine, worsening confusion, or inability to take antibiotics. Do not characterize the blood cultures as final negative at discharge; the attending's team checks the five-day report, documents review, and contacts Ruth and the treating clinician for any actionable result. Maintain fluids and regular meals as tolerated, schedule toileting assistance, keep the path to the bathroom clear, and secure cat bowls/toys away from walking routes. Continue glasses, daylight activity, sleep routines, and family orientation cues during recovery from delirium. Do not equate improvement of ketoacidosis with immediate recovery of gait or judgment.

**Follow-up and handoff:** Endocrinology contact within 48 hours of discharge, office review within one week, and primary-care review within one week including a basic metabolic panel and the lisinopril decision. Home nursing reviews the glucose log, insulin administration, ketone supplies, oral antibiotic adherence, and mobility plan on the requested D5 visit. Provide the discharge summary to the primary clinician and outside diabetes prescriber, including the adverse reaction, final insulin doses, recent asymptomatic low, antibiotic end date, and pending blood cultures. Ruth and Emi receive one consistent medication list and contact instructions rather than conflicting home and inpatient scales.

**Faculty assessment priorities:** Students should recognize ketotic acidosis despite modest glucose; identify and communicate the initial inadequate respiratory compensation; obtain cultures promptly without delaying antibiotics; account for all infused volumes; hold insulin for potassium below 3.5; administer peripheral potassium safely; add/titrate dextrose while insulin clears ketones; use actual ketone/acid-base resolution before transition; verify basal overlap; manage delirium and assisted mobility; recognize an asymptomatic low; and finish with a feasible family-supported plan. A student who stops insulin at the closed gap while BHB remains elevated, runs potassium faster than ordered, gives a bedtime correction, or restarts empagliflozin should be redirected and debriefed before advancing the scenario.

**Evidence notes:** The diagnostic/resolution distinctions and infusion-dose departure are stated at the beginning of this document rather than silently attributed to ADA. [2024 hyperglycemic crises consensus](https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/). Culture-directed narrowing and reassessment follow [SSC adult recommendations](https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines). The selected oral switch and seven-day course assume prompt response, oral absorption, susceptibility, and unobstructed drainage; duration is individualized because severe-illness populations were underrepresented in some studies. [IDSA complicated UTI guideline](https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/)



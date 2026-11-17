# In-class DKA patient: Caleb Mercer, sick-day basal insulin omission during a viral illness (single source of truth)

Simulation: **Mon 2027-01-11 0700 to Tue 2027-01-12 1900 (36 h)**. "D1" = Monday 01/11, "D2" = Tuesday 01/12, "D3" = Wednesday 01/13 (after the course). Ten checkpoints, every 4 hours: **D1 0700, 1100, 1500, 1900, 2300, D2 0300, 0700, 1100, 1500, 1900**. The case study packet covers the first 7 stops (D1 0700 to D2 0700). Everything below is time-gated to the minute. Follow `BRIEF.md` and the "Rules every patient follows" in `.claude/skills/patient-course/SKILL.md`. Revised after `DESIGN_REVIEW.md` (all MUST FIX and SHOULD FIX items applied; see section 18).

In-class chart rules (how this patient differs from the take-home DKA series):
- **Vital signs and POC glucoses are in the chart only up to the 0700 arrival.** After 0700 the bedside monitor shows the vitals (monitor.html rows for MRN SIM-40601) and the instructor says the glucoses aloud (list in "Point-of-care glucose").
- **Weight after D1 0700** (D2 0600, 79.3 kg) is charted on the **I&O daily-weight record** (an I&O note on the D2 0700 block), **not** as a vital-sign observation. The instructor also says it aloud at D2 0700.
- **A NEW full nursing assessment at every stop** (13 rows; values carried forward; the changed rows tell the story). No vital-sign numbers inside assessment text. The pain row uses words plus the 0-10 score, and that score must match the monitor row note.
- **A NEW lab set before every stop**, resulted before the stop.
- MAR: ED doses `given`; infusions running at 0700 show "0700 Running"; **every dose after D1 0700 is `due`** (the students give it, day and night).
- Students are the unit RNs at every stop. Unit RN notes are not pre-written. Events between stops are narrated by the instructor (the "off-going nurse").
- **Chart text never says "student."** Where this design says "students held/lowered," the chart says "RN held/lowered per protocol."

---

## 1. Patient

- **Caleb Mercer**, 28-year-old man, DOB **1998-07-22**, MRN **SIM-40601**, he/him. Height **180 cm**. **Weight 76.0 kg** (ED bed scale, dosing weight for the whole stay). BMI 76.0 / 1.80^2 = 76.0 / 3.24 = **23.5**. Usual weight **79.0 kg** (endocrinology clinic 10/2026), so about 3 kg lost (about 4%) during the illness.
- **Allergy: codeine (hives).** Full Code.
- Unit: **Medical-Surgical Step-Down with telemetry, room SD-3** for the whole stay.
- **Type 1 diabetes since age 16 (2014)**, diagnosed in DKA. One prior DKA at age 21 (missed insulin while away at college). Multiple daily injections, no pump, no continuous glucose monitor (fingerstick meter; he declined a sensor in 2025 because "the alarms would drive me crazy"). HbA1c **8.1%** (10/2026), **8.3%** this admission. No known complications (eye exam 2026 normal, urine albumin normal). Feels his lows (shaky, sweaty).
- **Home medications**
  - **Insulin glargine 24 units SubQ once daily at 2100** (bedtime). Last dose **Fri 01/08 2100**. He **skipped Sat and Sun** ("I wasn't eating, so I thought I'd go low").
  - **Insulin lispro** pen with meals: **1 unit per 10 g carbohydrate** + correction **1 unit per 50 mg/dL above 150**. None since Fri lunch.
  - Total daily dose (TDD) about 46 units (24 basal + about 22 bolus) = 46 / 76 = **0.6 unit/kg/day**.
  - Acetaminophen 1,000 mg PO every 6 h PRN (took it for fever; last Sun 1000, vomited).
  - Loratadine 10 mg PO daily PRN (seasonal allergies).
  - Glucagon nasal powder 3 mg PRN: **expired 06/2025**. Blood ketone strips: **expired 2024**. His glucose meter can read blood ketones, but he has no in-date strips. His pharmacy profile has never had in-date ketone strips or glucagon refills.
- Social: IT help-desk technician (works from home 3 days a week; employer health insurance). Lives in an apartment with roommate **Devin Szabo** (night-shift paramedic student; away all weekend; works nights). Older sister **Tessa Mercer** (31, lives 15 minutes away) is his support person and emergency contact. Parents live out of state. Plays recreational soccer. Alcohol 2-4 drinks a week, none this week. No tobacco, no drugs.
- Outpatient endocrinologist: **J. Harlow, MD** (last visit 10/2026). No written sick-day plan; he says he "was told once, years ago."
- Family history: maternal uncle type 1 diabetes; mother hypothyroidism.

## 2. People (unique across all patients; checked by grep)

| Role | Name |
|---|---|
| ED physician | **F. Lindahl, MD** |
| ED RN | **B. Kessel, RN** (insulin second checker **T. Rourke, RN**) |
| Hospitalist, nights (admitting H&P, D1 night) | **G. Varga, MD** |
| Night hospitalist nurse practitioner (D1 night) | **R. Ostrowski, NP** |
| Hospitalist, days (D1 and D2) | **H. Ashworth, MD** |
| Endocrinology | **P. Beaumont, MD** |
| Radiology | **E. Drummond, MD** |
| Pharmacist | **N. Bjork, PharmD** |
| Dietitian | **S. Pellegrino, RD** |
| Diabetes educator | **W. Tamura, RN, CDCES** |
| Case manager | **L. Ferraro, RN CM** |
| Outpatient endocrinologist | J. Harlow, MD |
| Sister / support person | **Tessa Mercer** (31) |
| Roommate | Devin Szabo |

## 3. Story before the unit

- **Wed 01/06**: sore throat, dry cough, fever to 101.8 F, body aches. Thought it was "the flu going around at work."
- **Thu 01/07 - Fri 01/08**: poor appetite, ate crackers and soup. Took glargine Fri 2100 as usual. Skipped lispro Fri dinner (ate very little).
- **Sat 01/09**: ate almost nothing. **Skipped glargine Sat 2100** ("no food, no insulin, or I'll go low"). Very thirsty, urinating a lot. Meter 380 at night; he drank water and went to bed.
- **Sun 01/10**: nausea from morning, **vomited 6-8 times** from about 1000, belly ache. Meter read "HI" in the evening. No ketone check (strips expired). **Skipped glargine Sun 2100** again. Last insulin of any kind: glargine Fri 2100 (about 52 h before arrival; glargine lasts about 24 h, so no insulin effect since about Sat evening).
- **Sun evening to Mon 0100**: Tessa texted him from 2100 with no answer. She drove over and used her key at **about 0100 Monday**. She found him breathing fast and deep, drowsy, "smelling like nail polish remover," and drove him in (arrival 0130).

## 4. ED course (all charted, given)

| Time (D1) | Event |
|---|---|
| **0130** | Arrival with Tessa. Surgical mask placed (cough, fever). |
| **0135** | Triage (Kessel): **T 100.6 F, HR 124, BP 102/60, RR 28 deep (Kussmaul), SpO2 97% RA, pain 6** (belly + aches), GCS 15 but drowsy. Weight 76.0 kg (bed scale). |
| 0138 | **POC glucose 524.** |
| **0140** | Lindahl orders: **droplet precautions (influenza-like illness, respiratory viral panel pending)**, labs, ECG, CXR, NPO. |
| **0145** | **PIV 18 g left forearm**; labs drawn (VBG, BMP, Mg, phos, BHB, CBC, lactate, lipase, hepatic panel, serum osmolality, HbA1c). |
| **0150** | **PIV 20 g right antecubital** (second line). **Respiratory viral panel swab** (influenza A/B, SARS-CoV-2, RSV PCR). **Ondansetron 4 mg IV.** |
| **0155-0255** | **0.9% NaCl 1,000 mL bolus** over 1 h. |
| 0200 | ECG: sinus tachycardia 122, **peaked T waves V2-V4** (result 0215). Gas result 0200 (pH 7.18). |
| 0205 | Emesis 200 mL. |
| 0215 | Void 400 mL (UA sent). |
| 0230 | **Acetaminophen 1,000 mg IV** (in 100 mL over 15 min) for fever and aches. CXR done. BMP result 0230 (K 5.6, gap 28). |
| 0240 | BHB result 6.4. DKA confirmed. |
| **0245** | Lindahl orders **regular insulin infusion 0.1 unit/kg/h = 7.6 units/h, fixed rate, no bolus** (K 5.6 is over 3.5, so insulin may start) and NaCl 500 mL/h x2 h then 250 mL/h. |
| **0300** | POC 468 (after 1 L, before insulin). **NaCl 500 mL/h** (no potassium: K over 5.0). Vitals HR 118, 106/62, RR 26, SpO2 97%, T 100.0. |
| **0305** | **Insulin infusion started 7.6 units/h** (independent double check Kessel + Rourke). |
| 0310 | CXR result: no pneumonia. |
| 0350 | Emesis 150 mL. |
| 0400 | POC 412. |
| 0420 | ED provider note. |
| 0430 | Void 450 mL. |
| **0500** | POC 354. Labs drawn (second set). **NaCl to 250 mL/h.** Vitals HR 114, 108/64, RR 24, T 99.6. |
| 0545 | BMP result: **K 4.6** (nobody acts on it in the ED; see the 0700 catch). |
| 0600 | POC 302. **Admitting H&P (Varga)** and admission orders (DKA protocol). |
| 0615 | Vitals HR 112, 108/64, RR 24, SpO2 98%, T 99.4. |
| 0630 | Void 400 mL. ED RN note. |
| 0645 | ED-to-unit handoff note (Kessel). It says: "K 5.6, too high for potassium, none given." It quotes the **0145** value, not the 0545 value. |
| **0700** | Arrives in SD-3. Unit vitals (charted): **HR 112, BP 108/64, RR 24 deep, SpO2 98% RA, T 99.4 F, pain 4.** **POC glucose 0700: 248** (charted). Telemetry on. |

ED vitals in the chart: 0135, 0300, 0500, 0615, and the unit 0700 set. Nothing after 0700.

## 5. Protocol and the math (state it the same everywhere)

**DKA protocol used:** adult, ADA/EASD/JBDS/AACE/DTS 2024 hyperglycemic crises consensus. **Fixed-rate insulin infusion 0.1 unit/kg/h** (the consensus allows a fixed weight-based rate; this hospital's order set uses fixed rate, no bolus), with a separate dextrose line added when glucose falls under 250 (JBDS style: keep the insulin, add dextrose).

- **Diagnosis** (2024): glucose 200 or more (or known diabetes), BHB 3.0 or more, and pH under 7.3 and/or bicarbonate under 18. Caleb: glucose 538, BHB 6.4, pH 7.18, bicarbonate 8. **Severity:** pH 7.18 is in the moderate range (7.00-7.24); bicarbonate 8 is in the severe range (under 10); drowsy. Call it **moderate-to-severe DKA**.
- **Insulin:** 0.1 x 76.0 = **7.6 units/h**. Bag: regular insulin 100 units in 100 mL 0.9% NaCl = 1 unit/mL, so **7.6 mL/h**. Lower rate 0.05 x 76.0 = **3.8 units/h** (3.8 mL/h). No bolus. **Do not titrate to glucose.** Lower to 3.8 only if glucose under 70, or under 150 while D10 runs at 150 mL/h (and call). **Hold only if K under 3.5** (and call). Never stop insulin for a low glucose: give dextrose instead.
- **Glucose fall goal** before dextrose: 50-75 mg/dL per hour. Actual: 0300 468 -> 0400 412 (-56) -> 0500 354 (-58) -> 0600 302 (-52) -> 0700 248 (-54). Fluid alone: 0138 524 -> 0300 468 (-56 in 82 min).
- **Glucose range on the dextrose line:** **this hospital's dextrose table keeps glucose 150-250** (ADA-style protocols aim 150-200; JBDS 108-252). So 230-244 on D10 is on target here.
- **Fluids:** 0.9% NaCl. Bolus 1,000 mL = 1,000 / 76.0 = **13.2 mL/kg** in hour 1. Then 500 mL/h (6.6 mL/kg/h) x2 h, then 250 mL/h (3.3 mL/kg/h). **When D10 starts, NaCl goes to 150 mL/h.** NaCl **100 mL/h from D1 1900** (drinking). Off at D2 0930 (saline lock). Riders are not subtracted (young, normal heart and kidneys).
  - **Why 0.9% saline:** corrected Na is normal the whole stay. This order set keeps 0.9% saline (allowed). After the first hours, 0.45% saline or a balanced fluid would be alternatives and would limit the chloride rise (Cl 95 -> 109 and the non-gap acidosis on D2). **Lactated Ringer's carries 4 mEq/L potassium: at 150 mL/h that is 0.6 mEq/h, and with a 10 mEq/h rider the total is 10.6 mEq/h, over the peripheral limit.** That is one more reason this unit uses plain saline with riders.
  - Debrief question: by D2 0600 he weighs 79.3 kg (above his usual 79.0) and is drinking. Is NaCl 100 mL/h still needed overnight? (Reasonable answer: it could have been lowered or stopped once he drank well.)
- **Dextrose line (separate bag, no potassium): D10W.** Start **100 mL/h when glucose under 250** (100 mL/h x 10 g/100 mL = **10 g dextrose/h**). Table: glucose 150-249 = 100 mL/h; under 150 on 100 mL/h = **150 mL/h (15 g/h) and call**; under 150 on 150 mL/h = lower insulin to 3.8 and call; 250-299 on D10 = 50 mL/h; 300 or more = off and call. **Off whenever insulin is held. Continues as long as IV insulin runs** (so it runs through breakfast on D2 until 0930).
- **Glucose checks:** hourly on the infusion; **every 30 min when the glucose falls fast (more than about 40 mg/dL in an hour) or is near 70**.
- **Hypoglycemia on the infusion (glucose under 70):** glucose 50-69 and alert = **D50 12.5 g (25 mL) IV push**; under 50 or not alert = D50 25 g (50 mL). Recheck in 15 min and repeat until 100 or more. Lower insulin to 3.8 units/h. **Trace the dextrose line from bag to patient.** Call. Do not stop the insulin.
- **Potassium (PERIPHERAL rules, BRIEF.md).** Caleb has peripheral IVs only. **No potassium in any bag.** Potassium goes as **KCl 10 mEq in 100 mL riders over 1 h on a pump (10 mEq/h), one at a time, at most 4 in a row, then recheck.** Riders run in the right-arm IV. A rider never runs on a potassium-containing carrier (there is none). Give only if urine is at least 0.5 mL/kg/h (0.5 x 76 = **38 mL/h**). Table by the **newest** K:
  - over 5.0: none, recheck with the next set;
  - 4.5-5.0: **10 mEq** this 4-h cycle;
  - 4.0-4.4: **20 mEq**;
  - 3.5-3.9: **30 mEq**;
  - **under 3.5: hold insulin and D10, call, 4 riders back to back (40 mEq), 12-lead ECG, STAT K after the second rider has finished; restart insulin when K is 3.5 or more.**
  - Per hour: 1 rider = 10 mEq/h, the maximum. Never two riders at once. Target K 4-5 (the consensus target); the peripheral limit makes the climb slow (teaching point).
  - **Labs are never drawn from an arm with a running infusion** (venipuncture from the opposite hand, or below the IV with the infusion paused per policy).
- **Magnesium:** MgSO4 2 g IV over 2 h when Mg under 1.8 (low Mg makes K hard to correct). Given once (D1 1515, Mg 1.6). Runs in the left line (Y-site with NaCl), not with the rider.
- **Phosphate:** monitored, not replaced (consensus: replace only if under 1.0 or with heart/breathing compromise). Lowest 1.9.
- **Bicarbonate:** not given (only if pH under 7.0).
- **Resolution (2024 consensus):** **BHB under 0.6 AND (venous pH 7.3 or more OR bicarbonate 18 or more).** Glucose under 250 is not a criterion. Met at **D2 0530** (BHB 0.4, pH 7.34, HCO3 18). Note D1 2130 (pH 7.31, BHB 2.0) and D2 0130 (pH 7.32, BHB 1.1): pH is over 7.3 but BHB is not under 0.6, so **not resolved** (teaching point).
- **Transition:** give basal SubQ insulin **at least 2 h before stopping the infusion (2024: 2-4 h); here 2 h, 0730 -> 0930**, with a meal. **Glargine 24 units SubQ D2 0730** (his home dose; new time: every morning). **Lispro 6 units with breakfast 0800.** **Insulin infusion, D10 and NaCl off D2 0930.** Then lispro 1 unit/10 g + 1 unit/50 above 150 (whole units, round to nearest), POC before meals, bedtime and 0300. (The 2024 report also allows early basal insulin while still on the drip; Dr. Beaumont chose to give the home dose at the transition.)
- **Sick-day extra insulin (Dr. Beaumont's written sick-day plan; TDD 46 units):**
  - Blood ketones **0.6-1.4**: extra lispro **10% of TDD = 4.6 -> about 5 units**, recheck glucose and ketones in 2 h.
  - Ketones **1.5-2.9**: extra lispro **20% of TDD = 9.2 -> about 9 units**, **call the diabetes team**, recheck in 2 h.
  - Ketones **3.0 or more**: **go to the ED**.
  - Repeat the extra dose every 2-4 h while ketones stay positive. Take the extra dose only if glucose is over 250 (or 150-250 with carbohydrate taken with it).
  - Always: **never stop glargine**. Check glucose and ketones every 2-4 h when ill. Fluids 250 mL every hour (with 15 g carbohydrate per hour if not eating). Call for vomiting more than twice or cannot keep fluids down, glucose over 300 twice, or ketones not falling after extra insulin. ED for ketones 3.0 or more, fast breathing, belly pain or confusion.
- **Formulas used:** anion gap = Na - Cl - CO2 (normal 8-12). Corrected Na = Na + **1.6 x (glucose - 100)/100** (ADA; ISPAD uses 2). Effective osmolality = 2 x Na + glucose/18. Calculated osmolality = effective + BUN/2.8. Henderson-Hasselbalch: pH = 6.1 + log10(HCO3 / (0.03 x pCO2)). Winter's: expected pCO2 = 1.5 x HCO3 + 8 +/- 2. **Winter's is written for arterial pCO2; it is applied here to the venous pCO2 (series convention). Venous pCO2 runs about 3-8 mmHg above arterial, so a venous value inside the Winter's range means compensation is at least adequate.** eGFR: CKD-EPI 2021, male, 28 (**an estimate only while creatinine is changing during AKI**).

## 6. Chemistry and gases (collected / result times)

Result delays: gas 15 min, BMP (with Mg, phos) 45 min, BHB 55 min. STAT: gas 10, BMP 25, BHB 35. Gas HCO3 is the calculated value from the gas; serum CO2 is from the BMP (1-2 lower on the gas is normal).

| Set | Collected | Results gas / BMP / BHB | Na | K | Cl | CO2 | BUN | Cr | Glu | Ca | Mg | Phos | **AG** | **BHB** | pH | pCO2 | HCO3 (gas) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 (ED) | D1 0145 | 0200 / 0230 / 0240 | 131 | **5.6** | 95 | **8** | 26 | **1.5** | **538** | 9.5 | 2.2 | 5.6 | **28** | **6.4** | **7.18** | 19 | 6.8 |
| 2 (ED) | D1 0500 | 0515 / 0545 / 0555 | 134 | **4.6** | 101 | 10 | 23 | 1.3 | 348 | 9.0 | 2.0 | 3.8 | 23 | 5.5 | 7.23 | 22 | 9.0 |
| 3 | D1 0930 | 0945 / 1015 / 1025 | 136 | 3.9 | 104 | 12 | 19 | 1.1 | 200 | 8.8 | 1.8 | 2.4 | 20 | 4.1 | 7.27 | 25 | 11.0 |
| 4 | D1 **1400** | 1415 / **1445** / 1455 | 137 | **3.2** | 106 | 13 | 16 | 1.0 | 198 | 8.6 | **1.6** | 1.9 | 18 | 2.6 | 7.29 | 27 | 12.6 |
| 5 STAT | D1 **1720** | 1730 / **1745** / 1755 | 137 | 3.6 | 106 | 13 | 15 | 0.9 | 270 | 8.6 | 2.0 | 2.0 | 18 | **3.1** | 7.27 | 28 | 12.4 |
| 6 | D1 2130 | 2145 / 2215 / 2225 | 139 | 3.7 | 108 | 15 | 12 | 0.9 | 196 | 8.7 | 1.9 | 2.1 | 16 | 2.0 | 7.31 | 30 | 14.6 |
| 7 | D2 0130 | 0145 / 0215 / 0225 | 139 | 4.0 | 109 | 16 | 11 | 0.9 | 140 | 8.7 | 1.9 | 2.3 | 14 | 1.1 | 7.32 | 31 | 15.6 |
| 8 | D2 0530 | 0545 / 0615 / 0625 | 139 | 4.2 | 108 | **18** | 10 | 0.8 | 160 | 8.8 | 1.9 | 2.6 | **13** | **0.4** | **7.34** | 34 | 17.6 |
| 9 | D2 0945 | — / 1030 / 1040 | 138 | **3.6** | 106 | 20 | 10 | 0.8 | 182 | 8.9 | 1.8 | 2.4 | 12 | 0.3 | | | |
| 10 | D2 1330 | — / 1415 / 1425 | 138 | 3.9 | 105 | 22 | 9 | 0.8 | 214 | 9.0 | 1.9 | 2.9 | 11 | 0.2 | | | |
| 11 | D2 1730 | — / 1815 / 1825 | 139 | 4.1 | 104 | 23 | 9 | 0.8 | 138 | 9.1 | 1.9 | 3.2 | 12 | 0.2 | | | |

Set 5 is drawn at 1720 by venipuncture from the left hand, after the second rider (1605-1705) and the MgSO4 (1515-1715) have finished. Normal ranges used: Na 136-145, K 3.5-5.1, Cl 98-107, CO2 22-29, BUN 7-20, Cr 0.7-1.3, glucose 70-99 fasting, Ca 8.6-10.3, Mg 1.8-2.4, phos 2.5-4.5, BHB under 0.6, venous pH 7.31-7.41, venous pCO2 41-51.

**Math for every set**

| Set | Anion gap | Corrected Na | Effective osm | Calc osm | H-H: HCO3 / (0.03 x pCO2) -> pH | Winter's range | pCO2 in range? | eGFR |
|---|---|---|---|---|---|---|---|---|
| 1 | 131-95-8 = **28** | 131 + 1.6 x 4.38 = **138.0** | 262 + 29.9 = **292** | 292 + 9.3 = **301** | 6.8 / 0.57 = 11.93; log 1.077 -> **7.18** | 1.5 x 6.8 + 8 = 18.2 -> 16.2-20.2 | 19 yes | 65 (estimate, AKI) |
| 2 | 134-101-10 = **23** | 134 + 1.6 x 2.48 = **138.0** | 268 + 19.3 = **287** | 287 + 8.2 = **296** | 9.0 / 0.66 = 13.64; log 1.135 -> **7.23** | 21.5 -> 19.5-23.5 | 22 yes | 77 (estimate) |
| 3 | 136-104-12 = **20** | 136 + 1.6 x 1.00 = **137.6** | 272 + 11.1 = **283** | 283 + 6.8 = **290** | 11.0 / 0.75 = 14.67; log 1.166 -> **7.27** | 24.5 -> 22.5-26.5 | 25 yes | 94 |
| 4 | 137-106-13 = **18** | 137 + 1.6 x 0.98 = **138.6** | 274 + 11.0 = **285** | 285 + 5.7 = **291** | 12.6 / 0.81 = 15.56; log 1.192 -> **7.29** | 26.9 -> 24.9-28.9 | 27 yes | 105 |
| 5 | 137-106-13 = **18** | 137 + 1.6 x 1.70 = **139.7** | 274 + 15.0 = **289** | 289 + 5.4 = **294** | 12.4 / 0.84 = 14.76; log 1.169 -> **7.27** | 26.6 -> 24.6-28.6 | 28 yes | 119 |
| 6 | 139-108-15 = **16** | 139 + 1.6 x 0.96 = **140.5** | 278 + 10.9 = **289** | 289 + 4.3 = **293** | 14.6 / 0.90 = 16.22; log 1.210 -> **7.31** | 29.9 -> 27.9-31.9 | 30 yes | 119 |
| 7 | 139-109-16 = **14** | 139 + 1.6 x 0.40 = **139.6** | 278 + 7.8 = **286** | 286 + 3.9 = **290** | 15.6 / 0.93 = 16.77; log 1.225 -> **7.32** | 31.4 -> 29.4-33.4 | 31 yes | 119 |
| 8 | 139-108-18 = **13** | 139 + 1.6 x 0.60 = **140.0** | 278 + 8.9 = **287** | 287 + 3.6 = **291** | 17.6 / 1.02 = 17.25; log 1.237 -> **7.34** | 34.4 -> 32.4-36.4 | 34 yes | 124 |
| 9 | 138-106-20 = **12** | 138 + 1.6 x 0.82 = **139.3** | 276 + 10.1 = **286** | 286 + 3.6 = **290** | | | | 124 |
| 10 | 138-105-22 = **11** | 138 + 1.6 x 1.14 = **139.8** | 276 + 11.9 = **288** | 288 + 3.2 = **291** | | | | 124 |
| 11 | 139-104-23 = **12** | 139 + 1.6 x 0.38 = **139.6** | 278 + 7.7 = **286** | 286 + 3.2 = **289** | | | | 124 |

Notes on the numbers:
- **Delta-delta at arrival:** gap up 28 - 12 = 16; bicarbonate down 24 - 8 = 16. Ratio 1.0 = pure anion-gap acidosis.
- **D2 0130:** gap 14 (up only 2) but CO2 16 (down 8) with Cl 109: a **non-gap (hyperchloremic) acidosis from the saline** is now part of the low bicarbonate. Ketones are almost gone. This is why BHB, not CO2 alone, guides resolution.
- **Sodium:** measured 131 is low because glucose pulls water into the blood. Corrected 138.0 = normal. Corrected Na stays normal (137.6-140.5) the whole stay. See section 5 for why the unit still uses 0.9% saline and what the alternatives are.
- **Effective osmolality 292** at arrival: under 300, so no hyperosmolar (HHS) overlap. **Measured serum osmolality 304** (0145, result 0300) vs calculated 301 = **osmolal gap 3** (normal; no toxic alcohol).
- **Potassium:** 5.6 on arrival with a large **total-body deficit** (estimated 3-5 mEq/kg = 230-380 mEq). Acidosis and no insulin shift K out of cells. Insulin and fluids move it back in: **5.6 -> 4.6 -> 3.9 -> 3.2** in 12 h. **3.2 is under 3.5 (2024 consensus, this protocol) and under 3.3 (2009 ADA algorithm): every version says hold insulin.** STAT K 3.6 at 1720 after 20 mEq with insulin off (no shift into cells).
- **Magnesium 1.8 at 0930** is at the low limit with K falling. The hospitalist note at 1100 (see notes) plans a recheck at 1400, where it is 1.6.
- **Creatinine 1.5** (baseline 0.9, clinic 10/2026) = prerenal from volume loss (BUN/Cr 26/1.5 = 17). Back to 0.9 by D1 1720. eGFR (CKD-EPI 2021) 65 -> 124 (the early values are estimates only during AKI).
- **BHB rises during the insulin hold** (2.6 at 1400 -> 3.1 at 1720) and pH falls 7.29 -> 7.27: no insulin = ketone production again. Then falls once insulin restarts.

**Other labs**
- **CBC** D1 0145 (result 0215): WBC **17.8** (stress and ketosis, not infection; no bands), Hgb 16.4, Hct 49.0 (concentrated), Plt 302, neutrophils 84%, lymphocytes 9%, bands 0%. D2 0945 (result 1015): WBC 9.6, Hgb 13.8, Hct 41.2, Plt 241, neutrophils 64%, lymphocytes 26%.
- **Lactate** 0145: 2.4 (result 0200). 0500: 1.5 (result 0515).
- **Lipase** 0145: **92 U/L** (normal 13-60; result 0230). Less than 3 times the upper limit; common in DKA; not pancreatitis (belly pain improves with treatment). Not repeated.
- **Hepatic panel** 0145 (result 0230): AST 32, ALT 28, alkaline phosphatase 88, bilirubin 0.8, **albumin 4.7**.
- **Serum osmolality** 0145: 304 mOsm/kg (result 0300).
- **HbA1c** 0145: **8.3%** (result D1 1000).
- **Urinalysis** 0215 (result 0300): SG 1.030, glucose 4+ (1,000 or more), **ketones large (80)**, protein trace, blood negative, leukocyte esterase negative, nitrite negative, WBC 0-2.
- **Respiratory viral panel PCR** (influenza A, influenza B, SARS-CoV-2, RSV), collected D1 0150, **result D1 0950: all NOT DETECTED.** (A common cold virus is likely; it is not on this panel.) This is the result that lets the RN **discontinue droplet precautions** under the nurse-driven protocol in the order.
- **CXR** D1 0230 (result 0310, Drummond): clear lungs, no pneumonia, normal heart size.
- **ECG 1** D1 0200 (result 0215): sinus tachycardia 122, PR 146, QRS 90, QT 300, QTc 428 (Bazett: RR = 60/122 = 0.492 s; 0.300 / sqrt(0.492) = 0.300 / 0.701 = 0.428), **peaked narrow T waves V2-V4** (K 5.6). Image: `ecg_image.py` with tall T (t amplitude about 0.7 mV).
- **ECG 2** D1 **1505** (result 1515): sinus rhythm 98, PR 150, QRS 88, QT 360, QTc 460 (RR = 0.612 s; 0.360 / 0.782 = 0.460), **flattened T waves, U waves V2-V3, 2 PVCs** on the strip (K 3.2). Image: `u_amp` 0.12, low T (0.15), `pvc_beats` 2.

## 7. Point-of-care glucose (charted up to 0700; said aloud after)

**Charted (ED):** D1 0138 **524**, 0300 468, 0400 412, 0500 354, 0600 302, **0700 248**.

**Aloud by the instructor (NOT charted; the students chart what they check):**

| Stop | Values since the last stop |
|---|---|
| D1 1100 | 0800 228, 0900 210, 1000 196, **1100 186** |
| D1 1500 | 1200 182, 1300 190, 1400 196, **1500 202** (insulin and D10 held at 1500) |
| D1 1900 | 1600 238, 1700 266, 1800 274 (insulin restarted 1750), **1900 244** (D10 restart now) |
| D1 2300 | 2000 222, 2100 204, 2200 190, **2300 176** |
| D2 0300 | 0000 166, 0100 158, 0200 112 (off-going nurse raised D10 to 150 at 0210 per the table and called at 0215; no 0230 recheck), **0300 62** -> after D50 12.5 g: **0315 124** |
| D2 0700 | 0400 140, 0500 152, 0600 156, **0700 152** (pre-breakfast check 0745: **154**). Weight 0600: **79.3 kg** |
| D2 1100 | 0830 172, 0930 180 (last hourly; drip off), pre-lunch 1130: **196** (give when they check) |
| D2 1500 | No check due since 1130. Lab glucose 1330 was 214 (after lunch). Pre-dinner 1700: **142** (give when they check) |
| D2 1900 | 1700 142. Next checks at bedtime 2100 and 0300 (after the course ends) |

Glucose on D10 (local target 150-250): 0700 248 -> 228 -> 210 -> 196 -> 186 -> 182 -> 190 -> 196 -> 202. Rise while insulin and D10 are held (1500-1750): 202 -> 238 (+36) -> 266 (+28) -> 274 (still rising just after the restart). Fall after the restart: 274 -> 244 (-30).

**0200 debrief question:** glucose fell 46 in 1 hour (158 -> 112). What should the 0200 nurse have done besides raising D10 and calling? Answer: recheck at 0230 (fast fall) and **trace the dextrose line from the bag to the patient**.

## 8. Insulin, dextrose, saline and potassium timeline

| Line | Times and rates |
|---|---|
| **Regular insulin** (left forearm, own pump) | 7.6 units/h D1 0305-1500; **HELD 1500-1750** (K 3.2); 7.6 units/h 1750 - D2 0305; **3.8 units/h D2 0305-0930** (glucose 62); **off D2 0930** |
| **D10W** (left forearm, pump 1 channel B, secondary tubing into a Y-site) | 100 mL/h D1 0705-1500; off 1500-1900 (insulin held, then glucose over 250); 100 mL/h 1900 - D2 0111; **D2 0111-0310 the D10 tubing was disconnected at the needleless connector on the Y-site** (pulled apart when he got up to void); the pump kept running with no alarm; rate raised to 150 at 0210; **dextrose dripped into the bed: pumped but not received, not counted as intake**; reconnected with new sterile tubing 0310; 150 mL/h D2 0310-0930; off 0930 |
| **0.9% NaCl** (left forearm, pump 1 channel A) | Bolus 1,000 mL 0155-0255; 500 mL/h 0300-0500; 250 mL/h 0500-0705; 150 mL/h 0705-1900; 100 mL/h 1900 - D2 0930; off (saline lock) |
| **KCl riders 10 mEq/100 mL over 1 h** (right arm, pump 2) | **0715** (K 4.6); **1030, 1130, 1230** (K 3.9); **1505, 1605, 1705, 1805** (K 3.2: 4 back to back; the 1805 rider stopped at 1900 with 92 mL in: infiltration); **2230, 2330, D2 0030** (K 3.7); **0330, 0430** (K 4.0); **0730, 0830** (K 4.2). |
| MgSO4 2 g/50 mL over 2 h | D1 1515-1715 (Mg 1.6), left line |
| KCl ER 20 mEq PO | D2 1100 and 1500 (K 3.6) |

- **Riders: 15** (14 full + 1 partial, about 9 mEq) = about **149 mEq pumped**. About 9 mEq of the last rider went into the tissue at the infiltration, so about **140 mEq reached the blood**. Plus 40 mEq PO. Never more than one rider at a time, never over 10 mEq/h, never more than 4 in a row (the only 4-in-a-row run is 1505-1900). Gaps: 1330-1505, 1900-2230, D2 0130-0330, 0530-0730.
- **Why the 2130 K 3.7 gets 30 mEq starting 2230:** the 4-rider run ended at 1900, the new IV went in at 1915, and the hospitalist's 1750 order said "after the 4 riders, give potassium per protocol from the 2130 labs."
- Insulin used: D1 0305-1500 = 11.92 h x 7.6 = 90.6 units; 1750 - D2 0305 = 9.25 h x 7.6 = 70.3; 0305-0930 = 6.42 h x 3.8 = 24.4. Total about **185 units IV**.

## 9. Intake and output (4-hour blocks, `periodEnd: true`)

Labels: Oral (`po`), IV fluid (`iv` = NaCl + D10 actually received), IV med (insulin + riders + MgSO4 + acetaminophen IV + D50), Urine, Emesis. Each block's note lists every void. The D2 0700 block note also carries the **daily weight 79.3 kg (0600)**.

| Block (ends) | Oral | IV fluid (NaCl + D10) | IV med | **In** | Urine (voids) | Emesis | **Out** |
|---|---|---|---|---|---|---|---|
| ED 0130-0700 | 0 | 2,500 (2,500 + 0) | 130 (insulin 30 + acetaminophen 100) | **2,630** | 1,250 (0215 400, 0430 450, 0630 400) | 350 (0205 200, 0350 150) | **1,600** |
| D1 1100 | 60 | 1,000 (608 + 392) | 180 (30 + riders 150) | **1,240** | 900 (0750 350, 0920 300, 1045 250) | 120 (0830) | **1,020** |
| D1 1500 | 480 | 1,000 (600 + 400) | 280 (30 + 250) | **1,760** | 750 (1150 250, 1320 250, 1440 250) | 0 | **750** |
| D1 1900 | 480 | 600 (600 + 0) | 451 (insulin 9 + riders 392 + Mg 50) | **1,531** | 600 (1600 300, 1810 300) | 0 | **600** |
| D1 2300 | 360 | 800 (400 + 400) | 80 (30 + 50) | **1,240** | 550 (2000 250, 2210 300) | 0 | **550** |
| D2 0300 | 120 | 618 (400 + 218) | 280 (30 + 250) | **1,018** | 550 (0005 250, 0100 300) | 0 | **550** |
| D2 0700 | 240 | 975 (400 + 575) | 241 (16 + 200 + D50 25) | **1,456** | 500 (0315 200, 0530 300) | 0 | **500** |
| D2 1100 | 600 | 625 (250 + 375) | 210 (10 + 200) | **1,435** | 650 (0740 300, 1010 350) | 0 | **650** |
| D2 1500 | 840 | 0 | 0 | **840** | 650 (1130 300, 1400 350) | 0 | **650** |
| D2 1900 | 720 | 0 | 0 | **720** | 600 (1600 300, 1830 300) | 0 | **600** |

How the IV volumes were computed (examples): D1 1100 block NaCl = 5 min at 250 (20.8) + 3 h 55 min at 150 (587.5) = 608; D10 = 3 h 55 min at 100 = 392; riders = 0715 rider (100) + half of the 1030 rider (50) = 150; insulin = 4 h x 7.6 = 30.4. D1 1900 block: insulin 1750-1900 = 1.167 h x 7.6 = 8.9; riders 1505, 1605, 1705 (300) + 1805 stopped at 1900 (92) = 392; IV med 8.9 + 392 + 50 = 450.9 -> 451. D2 0300 block D10 = 2300-0111 = 131 min x 100/60 = 218 (0111-0300 pumped into the bed, about 223 mL, not counted). D2 0700 block D10 = 0310-0700 at 150 = 575; insulin 0300-0305 at 7.6 (0.6) + 0305-0700 at 3.8 (14.9) = 15.5.

Totals:
- ED night: in 2,630 / out 1,600.
- D1 day shift (0700-1900): in 1,240 + 1,760 + 1,531 = **4,531** / out 1,020 + 750 + 600 = **2,370**.
- D1 night (1900-0700): in 1,240 + 1,018 + 1,456 = **3,714** / out 550 + 550 + 500 = **1,600**.
- D2 day (0700-1900): in 1,435 + 840 + 720 = **2,995** / out 650 + 650 + 600 = **1,900**.
- Arrival to D2 0700: in **10,875** / out **5,570** = net **+5,305**. Whole stay: in **13,870** / out **7,470** = net **+6,400**.
- **Weights:** 76.0 kg (D1 0135 ED bed scale) -> **79.3 kg (D2 0600, on the I&O daily-weight record)**. Check: 76.0 + 5.3 L net - about 2.0 L insensible loss (about 29 h with fever and fast deep breathing, about 70 mL/h) = 79.3. Usual weight 79.0 (he was dry on arrival).
- Urine always over 38 mL/h (0.5 mL/kg/h), so riders were allowed. Early urine is an osmotic diuresis (glucose 4+).

## 10. Orders (who, orderedAt, start, end, stoppedEarly)

Times D1 unless marked D2. "SE" = `stoppedEarly` (the stop time is hidden until it happens). The "Notes" column is design commentary; chart text says "RN," never "student."

| Order | By | orderedAt | Start | End | Notes |
|---|---|---|---|---|---|
| **Droplet precautions** (influenza-like illness; respiratory viral panel pending) | Lindahl | 0140 | 0140 | none | **THE ORDER TO DISCONTINUE.** Order comment: "**RN may discontinue per the respiratory isolation protocol when the respiratory viral panel is negative for influenza A/B, SARS-CoV-2 and RSV and the patient is afebrile.**" Panel negative 0950. Students discontinue at the 1100 stop (reason: panel negative, afebrile; standard precautions and cough etiquette). |
| NPO except ice chips and sips | Lindahl | 0140 | 0140 | 1100 | replaced by clear liquids |
| ED labs (VBG, BMP, Mg, phos, BHB, CBC, lactate, lipase, hepatic panel, serum osm, HbA1c, UA), POC glucose, respiratory viral panel, ECG, CXR | Lindahl | 0140 | 0140 | once | |
| Ondansetron 4 mg IV once | Lindahl | 0145 | 0150 | once | given |
| 0.9% NaCl 1,000 mL IV bolus over 1 h | Lindahl | 0150 | 0155 | 0255 | given |
| Acetaminophen 1,000 mg IV once | Lindahl | 0220 | 0230 | once | given |
| 0.9% NaCl continuous: 500 mL/h x2 h, then 250 mL/h; 150 mL/h when D10 starts | Lindahl | 0245 | 0300 | D2 0930 | rate 100 mL/h from 1900 by a later order |
| **Regular insulin infusion 100 units/100 mL, 0.1 unit/kg/h = 7.6 units/h, fixed rate, no bolus** (DKA protocol) | Lindahl | 0245 | 0305 | D2 0930 | running at 0700; double check Kessel + Rourke |
| ED repeat labs 0500 | Lindahl | 0420 | 0500 | once | |
| Admit SD-3 step-down, telemetry, Full Code | Varga | 0600 | 0700 | | |
| VS every 1 h while on insulin infusion, then every 4 h | Varga | 0600 | 0700 | | |
| Mental status every 2 h while on infusion | Varga | 0600 | 0700 | D2 0930 | |
| Strict I&O; daily weight 0600 (I&O record) | Varga | 0600 | 0700 | | |
| POC glucose every 1 h while on insulin infusion (every 30 min if falling fast or near 70) | Varga | 0600 | 0700 | D2 0930 | |
| **DKA protocol (adult, fixed rate)**: insulin rules, dextrose table, hypoglycemia rule, peripheral potassium table (section 5) | Varga | 0600 | 0700 | D2 0930 | includes 12-lead ECG for K under 3.5 |
| **D10W dextrose line: start 100 mL/h when glucose under 250**, per table | Varga | 0600 | 0700 | D2 0930 | due 0700 (glucose 248) |
| **KCl 10 mEq/100 mL IV rider over 1 h, PRN per protocol table** (one at a time, max 4 in a row, right-arm IV, urine 38 mL/h or more) | Varga | 0600 | 0700 | D2 0930 | |
| Dextrose 50% 12.5-25 g IV PRN per hypoglycemia rule | Varga | 0600 | 0700 | D2 0930 | |
| Glucagon 1 mg IM PRN (no IV access, glucose under 70) | Varga | 0600 | 0700 | | |
| VBG, BMP, Mg, phos, BHB at 0930, 1400, 2130, D2 0130, D2 0530 | Varga | 0600 | 0930 | D2 0530 | |
| Ondansetron 4 mg IV every 6 h PRN nausea | Varga | 0600 | 0700 | | (check QTc and K) |
| Acetaminophen 650 mg PO every 6 h PRN fever or pain (max 3 g/day from all sources) | Varga | 0600 | 0700 | | |
| Activity: up with assist (IV poles); fall precautions; bed alarm at night | Varga | 0600 | 0700 | D2 0930 | |
| No pharmacologic VTE prophylaxis: age 28, walking, no clot risk factor; ambulate | Varga | 0600 | 0700 | | documented rationale |
| Hold home insulin glargine and lispro while on the infusion | Varga | 0600 | 0700 | D2 0730 | |
| Consults: endocrinology, pharmacy, diabetes educator (CDCES), dietitian | Varga | 0600 | 0700 | | |
| Sugar-free clear liquids | Ashworth | 1045 | 1100 | D2 0730 | |
| **Insulin infusion and D10 on hold for K 3.2; restart when K 3.5 or more** | Ashworth | 1510 | 1510 | SE 1750 | RN held at 1500 per protocol |
| MgSO4 2 g IV over 2 h | Ashworth | 1510 | 1515 | 1715 | due |
| STAT VBG, BMP, Mg, BHB at 1720 (after the 2nd rider and the Mg finish; venipuncture opposite arm) | Ashworth | 1510 | 1720 | once | |
| **Resume insulin infusion 7.6 units/h** (K 3.6); D10 per table; after the 4 riders, potassium per protocol from the 2130 labs | Ashworth | 1750 | 1750 | | |
| 0.9% NaCl to 100 mL/h | Ashworth | 1840 | 1900 | D2 0930 | |
| **WRONG ORDER: change maintenance fluid to 0.9% NaCl 1,000 mL with KCl 40 mEq/L at 100 mL/h** | Varga | **2245** | 2300 | **SE 2320** | **Safety catch at 2300.** 40 mEq/L is over the peripheral limit (20 mEq/L), and 4 mEq/h from the bag + a 10 mEq/h rider = 14 mEq/h (over 10). Discontinued after the RN call; plain NaCl and riders continue. |
| Insulin to 3.8 units/h (0.05 unit/kg/h) after glucose 62 | Varga | D2 0310 | D2 0310 | D2 0930 | RN lowered it at 0305 per protocol |
| **UNSAFE ORDER: insulin glargine 24 units SubQ at 0700; discontinue insulin infusion, D10 and NaCl at 0700**; lispro with meals | **Ostrowski (NP)** | **D2 0635** | D2 0700 | **SE D2 0720** | **Safety catch at D2 0700:** no overlap. Basal must be given at least 2 h before the drip stops (2024: 2-4 h). |
| **Corrected transition** (endocrinology): glargine 24 units SubQ at 0730, then **daily at 0730**; continue insulin infusion 3.8 units/h and D10 150 until **0930**, then stop them and NaCl (saline lock); lispro 1 unit/10 g carbohydrate with meals (0800, 1200, 1730) + correction 1 unit/50 mg/dL above 150 (round to nearest whole unit); bedtime correction only if over 250 | Beaumont | D2 0720 | D2 0730 | | |
| POC glucose before meals, bedtime and 0300 | Beaumont | D2 0720 | D2 0930 | | |
| Consistent carbohydrate diet, 60-75 g per meal | Beaumont | D2 0720 | D2 0730 | | |
| BMP, Mg, phos, BHB at 0945, 1330, 1730; CBC 0945 | Beaumont | D2 0720 | D2 0945 | D2 1730 | rebound check |
| Glucose 15 g PO PRN glucose under 70 (alert, eating) | Beaumont | D2 0720 | D2 0930 | | |
| Diabetes education: sick-day rules (written plan with extra-lispro doses), ketone testing, pen technique, glucagon | Beaumont | D2 0720 | D2 0730 | | |
| Up ad lib | Ashworth | D2 0930 | D2 0930 | | drip off |
| Resume home loratadine 10 mg PO daily PRN | Ashworth | D2 1000 | D2 1000 | | |
| KCl ER 20 mEq PO at 1100 and 1500 | Ashworth | D2 1040 | D2 1100 | D2 1500 | K 3.6 |
| **Discharge order: discharge tomorrow (D3) after breakfast if overnight and fasting glucoses are 100-250 with no low, BHB under 0.6, and supplies in hand.** Prescriptions (written now, copied from his home list): insulin glargine 24 units every morning (0730), insulin lispro pens (ratio + correction), pen needles, glucose meter strips, lancets, glucose tablets. Follow-up J. Harlow, MD (endocrinology) 01/15 1000 | Ashworth | D2 **1745** | D3 0900 | | **Safety catch at D2 1900:** **no blood ketone strips and no glucagon** on the list (his are expired; pharmacy recommended both at 1400). |

## 11. MAR (doses after D1 0700 are all `due`)

ED `given`: ondansetron 4 mg 0150; NaCl bolus 0155; acetaminophen 1,000 mg IV 0230; NaCl 500/250 mL/h (0700 Running); regular insulin 7.6 units/h (0700 Running).

Due for the students:
- **D1:** D10 100 mL/h start 0700-0705 (and NaCl to 150); KCl rider 0715; ondansetron PRN (0830 emesis: optional); KCl riders 1030, 1130, 1230; acetaminophen PRN; **insulin hold 1500 and D10 off 1500**; KCl riders 1505, 1605, 1705, 1805; MgSO4 2 g 1515; insulin restart 7.6 units/h 1750; NaCl 100 mL/h 1900; D10 restart 100 mL/h 1900; KCl riders 2230, 2330.
- **D2:** KCl rider 0030; **D50 12.5 g IV 0305**; insulin to 3.8 units/h 0305; D10 150 mL/h 0310 (new tubing); KCl riders 0330, 0430; **glargine 24 units SubQ 0730**; KCl riders 0730, 0830; **lispro 6 units 0800** (60 g, glucose 154); **insulin infusion, D10 and NaCl off 0930**; **KCl ER 20 mEq PO 1100**; **lispro 8 units 1200** (70 g = 7 + correction (196-150)/50 = 0.92 -> 1); **KCl ER 20 mEq PO 1500**; **lispro 6 units 1730** (60 g, glucose 142, no correction). Loratadine PRN.

## 12. Devices

- PIV 18 g **left forearm** (D1 0145, ED): NaCl, D10 (secondary tubing on a Y-site needleless connector), insulin, MgSO4. D10 tubing replaced D2 0310 after the disconnection. Saline lock from D2 0930; stays until discharge (D3).
- PIV 20 g **right antecubital** (D1 0150, ED): KCl riders from 0715. **Infiltrated during the 1805 rider; found at 1900; removed D1 1900** (INS infiltration grade 2).
- PIV 20 g **right forearm** (D1 **1915**, placed by the RN): riders from 2230. Saline lock from D2 0930. Removed at the D2 1900 stop (no longer needed; one IV kept overnight).
- Telemetry 5-lead (D1 0700 to the end of the course).
- Bed alarm (on at night). No urinary catheter. No oxygen.

## 13. Notes (time-gated; each quotes only results and orders already in the chart)

| Time | Author | Type | One-line summary |
|---|---|---|---|
| D1 0140 | B. Kessel, RN | ED triage | 28 M type 1 diabetes, 5 days of flu-like illness, vomiting, fast deep breathing, skipped long-acting insulin 2 nights; mask on, droplet precautions; POC 524. |
| D1 0215 | F. Lindahl, MD | Cardiology (ECG 1, image) | Sinus tachycardia 122, peaked T waves V2-V4, QTc 428; consistent with K 5.6. |
| D1 0310 | E. Drummond, MD | Radiology (CXR) | Clear lungs, no pneumonia. |
| D1 0420 | F. Lindahl, MD | ED provider | Moderate-to-severe DKA (pH 7.18, HCO3 8, gap 28, BHB 6.4) from basal insulin omission during a viral illness; 1 L bolus, NaCl 500 mL/h, insulin 7.6 units/h from 0305 (K 5.6 so no potassium yet); viral panel pending, droplet precautions; admit step-down. |
| D1 0600 | G. Varga, MD | Admitting H&P | Full history; corrected Na 138, effective osm 292, WBC 17.8 from stress; plan: fixed-rate protocol, D10 under 250, peripheral potassium riders per protocol, labs every 4 h, no VTE drug (young, walking), consults. |
| D1 0630 | B. Kessel, RN | ED nursing | ED care summary: 2.5 L saline, voids 1,250, emesis 350, insulin running, IVs, mask. |
| D1 0645 | B. Kessel, RN | ED-to-unit handoff (SBAR) | "K 5.6, too high for potassium, none given"; glucose 302 at 0600; insulin 7.6; NaCl 250. (**Quotes the old K; the 0545 K is 4.6.**) |
| D1 0830 | N. Bjork, PharmD | Pharmacy | Med history: glargine 24 at 2100 (last Fri 2100), lispro 1:10 and 1:50 >150; codeine allergy; peripheral potassium limits; ondansetron fine at QTc 428, recheck if K falls; expired glucagon and ketone strips noted. |
| D1 0930 | H. Ashworth, MD | Hospitalist day progress | Improving: glucose under 250 -> D10 line per protocol; 0500 K 4.6 -> potassium per protocol table; viral panel pending; continue protocol. (Written before the 0930 results.) |
| D1 1100 | H. Ashworth, MD | Hospitalist addendum | 0930 labs: K 3.9 with riders running, Mg 1.8 at the low limit: recheck Mg and K at 1400; gap 20, BHB 4.1 improving. (No comment on isolation.) |
| D1 1130 | P. Beaumont, MD | Endocrinology consult | Cause: stopped basal insulin while not eating; early basal while on the drip is an option, but he will get his home glargine 24 units at the transition in the **morning**, with the drip stopped at least 2 h later; keep morning dosing after that; written sick-day plan and teaching before discharge; offer a sensor. |
| D1 1515 | H. Ashworth, MD | Cardiology (ECG 2, image) | Sinus 98, flat T, U waves V2-V3, 2 PVCs, QTc 460; consistent with K 3.2. |
| D1 1530 | H. Ashworth, MD | Hospitalist event | Called by RN at 1500 for K 3.2 (1445): insulin and D10 held per protocol, 4 KCl riders, MgSO4 2 g (Mg 1.6), STAT labs 1720 after the second rider; avoid ondansetron until K and QTc better. |
| D1 1800 | H. Ashworth, MD | Hospitalist | STAT K 3.6 (1745) -> insulin restarted 1750; BHB rose 2.6 -> 3.1 and pH 7.27 during the hold (expected); D10 back when glucose under 250. |
| D1 2030 | G. Varga, MD | Night hospitalist | Sign-out received; RN reported the right antecubital IV infiltrated at 1900 during the 4th KCl rider (grade 2; stopped, removed, elevated, marked; new right forearm IV 1915); site check every 2 h; next potassium per 2130 labs. |
| D1 2330 | G. Varga, MD | Night hospitalist addendum | RN called about the 2245 KCl 40 mEq/L bag: peripheral IV only, limit 20 mEq/L and no stacking with riders; order discontinued; plain NaCl 100 mL/h and riders per protocol. |
| D2 0330 | G. Varga, MD | Night event | Called 0215 for glucose 112 (D10 raised to 150 per table). At 0300 glucose 62: the D10 tubing had come apart at the Y-site connector when he got up at about 0100, and the dextrose ran into the bed. D50 12.5 g, recheck 124; insulin 3.8; new D10 tubing at 150; he was sitting at the edge of the bed sweaty, no fall. |
| D2 0630 | G. Varga, MD | Night hospitalist | 0530 labs: BHB 0.4, pH 7.34, HCO3 18, gap 13: **DKA resolved**; transition to SubQ insulin this morning (orders by the night NP). |
| D2 0715 | P. Beaumont, MD | Endocrinology transition | Corrected plan after the RN's question: glargine 24 units 0730 (now every morning), breakfast lispro 0800, drip and D10 off 0930 (2 h overlap; D10 continues while IV insulin runs); no 2100 glargine tonight or at home. |
| D2 1000 | H. Ashworth, MD | Hospitalist day progress | Eating, walking, off the drip since 0930; resume loratadine; plan: one night on SubQ insulin, discharge tomorrow morning if stable. |
| D2 1030 | S. Pellegrino, RD | Dietitian | Carbohydrate counting review (accurate within 10 g on 3 of 4 items); sick-day fluids and carbohydrate (15 g per hour if not eating). |
| D2 1130 | H. Ashworth, MD | Hospitalist addendum | 0945 labs: BHB 0.3 (no rebound), K 3.6 -> KCl ER 20 mEq x2. |
| D2 1330 | W. Tamura, RN, CDCES | Diabetes educator (session 1) | Taught Dr. Beaumont's written sick-day plan: never stop glargine; glucose and ketones every 2-4 h when sick; extra lispro 5 units for ketones 0.6-1.4, 9 units and call for 1.5-2.9, ED for 3.0 or more; fluids; when to call. He still believed "no food, less long-acting." |
| D2 1400 | N. Bjork, PharmD | Pharmacy discharge review | Recommends blood ketone strips (his meter reads them) and a new glucagon (both expired), pen needles, glucose tablets; insulin costs covered by his plan. |
| D2 1430 | L. Ferraro, RN CM | Case management | Employer insurance; prescriptions to the hospital outpatient pharmacy for bedside delivery; follow-up with Dr. Harlow 01/15 1000; sister will pick him up tomorrow morning and stay with him the first night (roommate works nights). |
| D2 1645 | W. Tamura, RN, CDCES | Diabetes educator (session 2) | Teach-back of the sick-day plan correct, including the extra-lispro doses; practiced picking the right pen (rapid with meals, long-acting each morning) and labeled the pen caps; ketone meter practice with a unit demo strip. |
| D2 1715 | P. Beaumont, MD | Endocrinology | Stable on SubQ (196 before lunch, 142 before dinner, BHB 0.2): one night on SubQ, then discharge tomorrow if overnight and fasting glucoses are 100-250; glargine 24 every morning; sensor referral. |
| D2 1800 | H. Ashworth, MD | Hospitalist discharge plan | Hospital course; discharge planned D3 after breakfast with sister; prescription list as ordered 1745 (no ketone strips, no glucagon). |

## 14. Sticky notes (time-gated)
- D1 0700: "Peripheral potassium: riders 10 mEq/100 mL over 1 h, one at a time, max 4 in a row; no K in bags over 20 mEq/L; never over 10 mEq/h total."
- D1 0700: "DKA protocol: insulin 7.6 units/h fixed; D10 100 mL/h when glucose under 250; hold insulin only for K under 3.5; resolved = BHB under 0.6 and pH 7.3+ or HCO3 18+."
- D2 0720: "Transition: glargine 0730, lispro 0800, drip off 0930 (2-hour overlap)."

## 15. Problems list
DKA (resolved D2 0530); type 1 diabetes, insulin omission during illness (knowledge deficit, sick-day rules); acute viral upper respiratory infection (panel negative); hypokalemia on treatment (K 3.2, D1 1445); hypomagnesemia (D1 1445); hypoglycemia on the infusion (D2 0300); IV infiltration right antecubital, grade 2 (D1 1900); acute kidney injury, prerenal (resolved D1 1720).

---

## 16. Checkpoint stories (each stop: what happened, new labs, monitor, aloud values, assessment, VR, catch)

Monitor rhythm settings: normal T = tAmp 0.3; tall T = 0.45-0.7; low K = tAmp 0.15, uAmp 0.12. PR 146-152, QRS 88-90. No oxygen at any stop.

### Stop 1. D1 0700: arrival from the ED
- **Situation:** On the unit 0700. Insulin 7.6 units/h and NaCl 250 mL/h running. Glucose 0700 248. Handoff says "K 5.6, no potassium." The **0545 K is 4.6**.
- **New labs:** ED sets 1 and 2 (above), CBC, UA, lipase, CXR, ECG 1.
- **Monitor:** HR 112 sinus tachycardia, T waves slightly tall (tAmp 0.45); BP 108/64; RR 24 deep; SpO2 98% RA; T 99.4 F; pain 4.
- **Expected actions:** independent double check of the insulin infusion; **start D10 100 mL/h and drop NaCl to 150** (glucose under 250); read the newest K (4.6), confirm urine (400 mL at 0630), **hang KCl rider 10 mEq at 0715** in the right antecubital IV; hourly glucose; droplet precautions in place.
- **Assessment (full set, unit baseline):**
  - Neuro: drowsy, opens eyes to voice, oriented x4, slow to answer, follows commands, pupils equal and reactive, no headache.
  - Psychosocial: embarrassed ("I didn't want to go low"); sister at bedside.
  - Cardiovascular: sinus tachycardia on monitor; radial pulses 2+ and equal; capillary refill 3 seconds; hands cool; no edema.
  - Respiratory: deep, regular, fast breathing (Kussmaul); fruity (acetone) breath; lungs clear; dry cough; no distress on room air.
  - GI: nauseated; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive; last emesis 0350; NPO except ice chips.
  - GU: voiding pale yellow urine in a urinal, large amounts.
  - Skin and mucous membranes: warm and flushed centrally (face, trunk), hands cool; dry; turgor poor (tenting 3 seconds); lips dry and cracked; tongue dry.
  - Musculoskeletal/mobility: generally weak, body aches; unsteady; stand-by assist.
  - Pain: belly and body aches, dull, 4/10.
  - Safety: Morse 45 (second diagnosis 15, IV 20, weak gait 10) = high fall risk; bed low and locked; bed alarm on.
  - IV sites: left forearm 18 g, no redness or swelling, NaCl and insulin infusing; right antecubital 20 g, saline lock, flushes easily.
  - Infection control: droplet precautions; mask for transport; covers cough.
  - Endocrine: insulin infusion running; no signs of low glucose.
- **VR:**
  - *Looks:* lying with head of bed up 30 degrees, curled slightly on his side, eyes half closed. Flushed face, pale cool hands; lips dry and cracked. **Deep, fast, regular breathing (24/min).** Faint fruity smell near his face. Surgical mask hanging under his chin. Slow to answer but makes sense.
  - *Says:* "I'm so thirsty... can I have water?" / "I didn't take my long-acting because I wasn't eating. I didn't want to go low." / "My stomach hurts and I feel sick." / "Is my sister still here?"
  - *Room:* Door sign "Droplet Precautions"; isolation cart with masks and gowns outside. Left IV pole: **pump 1, channel A "0.9% Sodium Chloride 1,000 mL" at 250 mL/h** (changing to 150), channel B empty (D10 bag "Dextrose 10% in Water 1,000 mL" hanging, not yet running). **Separate pump: "Regular insulin 100 units/100 mL, 1 unit/mL, HIGH ALERT" at 7.6 mL/h (7.6 units/h).** Left forearm IV with a clear dressing dated 01/11 0145. Right antecubital IV saline lock (dated 0150). Right pole with an empty pump for riders. Telemetry box on his chest; bedside monitor. Emesis basin on the bed. Urinal on the rail. Glucometer and strips on the counter. Bed alarm light on. Ice chip cup. Sister Tessa in the chair.
- **Safety catch:** the handoff uses the **old K (5.6)**. The newest K is 4.6 and falling on insulin: potassium is now due. Also glucose 248 = start the dextrose line.
- **Teaching:** potassium shifts into cells with insulin; total-body K is low even when the blood level is high. Dextrose is added so the insulin can keep clearing ketones.

### Stop 2. D1 1100: better, and the viral panel is negative
- **Situation:** D10 running since 0705. Emesis 120 at 0830. 0930 labs: K 3.9 -> 30 mEq: riders 1030 (running), 1130, 1230. Mg 1.8 (recheck at 1400 planned). **Respiratory viral panel negative (0950).** HbA1c 8.3% (1000). Clear liquids from 1100.
- **New labs:** set 3 (0930): Na 136, K 3.9, Cl 104, CO2 12, BUN 19, Cr 1.1, glucose 200, Mg 1.8, phos 2.4, gap 20, BHB 4.1, pH 7.27, pCO2 25, HCO3 11.0. Viral panel all not detected. HbA1c 8.3%.
- **Monitor:** HR 102 sinus tachycardia (tAmp 0.3); BP 114/68; RR 20 deep; SpO2 98%; T 99.0; pain 3.
- **Aloud:** glucose 0800 228, 0900 210, 1000 196, 1100 186. Urine 0750 350, 0920 300, 1045 250.
- **Expected actions:** **discontinue droplet precautions** under the nurse-driven protocol in the order (Orders > select > Discontinue, reason: panel negative for influenza A/B, SARS-CoV-2 and RSV, afebrile; standard precautions and cough etiquette); second rider at 1130; start clear liquids (sugar-free); explain the gap (20, still open).
- **Assessment changes:** Neuro: awake, alert, oriented x4, answers quickly. Respiratory: still deep, slower; fruity breath less strong. GI: nausea better after vomiting at 0830; abdomen soft, mildly tender; bowel sounds active; asking to drink. Skin: lips still dry, tongue moist, turgor 2 seconds. IV right antecubital: KCl rider infusing; mild ache, no redness or swelling. Pain: 3/10 aches. Psychosocial: talking more, asks how long he will stay. Infection control: droplet precautions in place; covers cough.
- **VR:**
  - *Looks:* sitting up, more awake, eyes open, talks in full sentences. Still breathing deep but slower (20/min). Fruity smell fainter. Lips dry.
  - *Says:* "I feel a little more human." / "My arm aches where that potassium is going in." / "Do I still have to wear this mask? Did my flu test come back?" / "Can I drink something real?"
  - *Room:* same as 0700 plus: **channel B D10 at 100 mL/h**, channel A NaCl 150 mL/h; **right pole pump: "Potassium chloride 10 mEq/100 mL" at 100 mL/h**, into the right antecubital IV. Emesis basin used (120 mL emptied). Sugar-free gelatin and broth on the tray at 1100. Droplet sign still on the door.
- **Safety catch / order to discontinue:** **droplet precautions** (panel negative; the protocol lets the RN stop them).
- **Teaching:** isolation should match the current evidence; keeping it longer limits care and walking. Gap closure is the goal, not glucose.

### Stop 3. D1 1500: low potassium, hold the insulin
- **Situation:** Riders 1030, 1130, 1230 given. **1400 labs: K 3.2 (resulted 1445), Mg 1.6.** Monitor shows flat T waves, U waves and PVCs. Glucose 1500 202.
- **New labs:** set 4 (1400): Na 137, **K 3.2**, Cl 106, CO2 13, BUN 16, Cr 1.0, glucose 198, Ca 8.6, **Mg 1.6**, phos 1.9, gap 18, BHB 2.6, pH 7.29, pCO2 27, HCO3 12.6.
- **Monitor:** HR 98 sinus with **2 PVCs/min**; **flat T + U waves** (tAmp 0.15, uAmp 0.12); BP 116/70; RR 18; SpO2 98%; T 98.8; pain 2.
- **Aloud:** glucose 1200 182, 1300 190, 1400 196, 1500 202. Urine 1150 250, 1320 250, 1440 250. Oral 480 mL clear liquids.
- **Expected actions (protocol):** **hold insulin and D10 at 1500** (keep NaCl 150); call the hospitalist (SBAR); 12-lead ECG (1505); **4 KCl riders back to back from 1505** (one at a time, 10 mEq/h); MgSO4 2 g (1515) through the left line; STAT labs at 1720 (after the second rider and the Mg finish, drawn from the opposite arm); avoid ondansetron (QTc 460, low K). Do not hang two riders at once to "catch up."
- **Provider reply (Ashworth):** "Hold insulin and D10, four riders, magnesium 2 grams, STAT labs after the second rider, restart insulin when K is 3.5 or more."
- **Assessment changes:** Neuro: alert; "legs feel heavy." Cardiovascular: flat T waves, U waves and occasional PVCs on the monitor; pulses 2+; capillary refill under 3 seconds. Musculoskeletal: grip slightly weaker both hands; calf cramps. GI: tolerating sugar-free clear liquids; no vomiting since 0830; abdomen soft, nontender. Respiratory: less deep, regular; faint fruity breath. Skin: mucous membranes moist; turgor normal. IV right antecubital: rider finished 1330; patent. Pain: calf cramps, 2/10. Infection control row: "per active orders; covers cough."
- **VR:**
  - *Looks:* sitting up, rubbing his calves. Breathing nearly normal depth (18/min). Faint fruity smell. Moist lips. Tired.
  - *Says:* "My legs feel heavy and my calves keep cramping." / "My heart feels like it skips." / "Why are you stopping my insulin? Isn't that what I need?" / "Am I going backwards?"
  - *Room:* insulin pump showing **"Channel stopped / on hold"** after the RN acts; D10 channel stopped; NaCl 150 mL/h; right pole: **new KCl 10 mEq/100 mL rider at 100 mL/h**, three more bags with labels and times; MgSO4 2 g/50 mL bag on the left pump (2 h). Monitor shows PVCs. ECG cart at the bedside (1505).
- **Safety catch:** **K 3.2 (under 3.5) = hold insulin** (insulin would push K lower and cause arrhythmias). Only one rider at a time.
- **Teaching:** why insulin lowers K; U waves and PVCs; magnesium is needed to correct K; ketones will rise while insulin is held, so the hold is as short as possible.

### Stop 4. D1 1900: insulin back on, and the potassium IV infiltrates
- **Situation:** STAT 1720: K 3.6 -> insulin restarted **1750** at 7.6. BHB rose to 3.1 during the hold. Glucose 1900 **244** (first value under 250 since the restart): **restart D10**. The 4th rider (1805) has been running into the right antecubital IV; the site is **swollen, cool, pale and burning** (infiltration, INS grade 2). NaCl to 100 mL/h (order 1840).
- **New labs:** set 5 STAT (1720): Na 137, K 3.6, Cl 106, CO2 13, BUN 15, Cr 0.9, glucose 270, Mg 2.0, phos 2.0, gap 18, **BHB 3.1**, pH 7.27, pCO2 28, HCO3 12.4. ECG 2 (1515) now in Cardiology.
- **Monitor:** HR 96 sinus; T low, small U (tAmp 0.25, uAmp 0.06); no PVCs; BP 120/72; RR 18; SpO2 98%; T 99.1; **pain 5 (right elbow)**.
- **Aloud:** glucose 1600 238, 1700 266, 1800 274, 1900 244. Urine 1600 300, 1810 300. Oral 480. The rider pump shows 92 mL of 100 infused.
- **Expected actions:** **stop the rider, disconnect, try to aspirate, remove the IV, elevate the arm, mark the edges, cold pack 20 min (per policy), document (grade 2), notify the provider**; start a new IV in the right forearm (1915) for the next riders; **restart D10 100 mL/h**; NaCl 100 mL/h; handoff to night shift.
- **Assessment changes:** IV right antecubital: **swollen about 4 cm around the site, cool, pale, taut, tender; burning; rider infusing slowly** = infiltration (KCl), grade 2. Cardiovascular: no PVCs; T waves still low. Musculoskeletal: cramps better, grip equal. Psychosocial: frustrated ("I was getting better and then they stopped my insulin"). GI: hungry, wants real food; tolerating liquids. Respiratory: normal depth, regular; faint fruity breath. Pain: right elbow burning, 5/10.
- **VR:**
  - *Looks:* holding his right arm against his chest, wincing. Inner right elbow puffy, pale and shiny around the dressing. Breathing easy. Faint fruity smell.
  - *Says:* "My elbow is burning, like really burning." / "It's been sore since about six." / "I'm starving. When can I eat real food?" / "So the insulin is back on now?"
  - *Room:* right pole pump **"KCl 10 mEq/100 mL, 100 mL/h, volume infused 92 mL"**; swollen site under the dressing. Left pole: NaCl (to 100 mL/h), D10 channel to restart, insulin pump running 7.6 units/h. Cold pack, pillow, skin marker, IV start kit on the bedside table. Night shift arriving.
- **Safety catch:** **IV infiltration with potassium** (an irritant). Stop it first, then treat the site.
- **Teaching:** check the rider site every hour; burning is common with KCl but swelling, coolness and pallor are not; a rider in an antecubital site (elbow bending) is a setup for infiltration; about 9 mEq went into the tissue. Restart dextrose when glucose falls under 250 again.

### Stop 5. D1 2300: a wrong potassium order, hungry and restless
- **Situation:** Night. D10 100, NaCl 100, insulin 7.6. 2130 labs: K 3.7 -> 30 mEq: riders 2230 (running), 2330, 0030 in the new right forearm IV. **At 2245 the night hospitalist ordered NaCl with KCl 40 mEq/L at 100 mL/h** "to simplify." BHB 2.0, pH 7.31: not resolved yet.
- **New labs:** set 6 (2130): Na 139, K 3.7, Cl 108, CO2 15, BUN 12, Cr 0.9, glucose 196, Mg 1.9, phos 2.1, gap 16, BHB 2.0, **pH 7.31**, pCO2 30, HCO3 14.6.
- **Monitor:** HR 88 sinus, normal T (tAmp 0.3); BP 118/70; RR 16; SpO2 97%; T 98.6; pain 1.
- **Aloud:** glucose 2000 222, 2100 204, 2200 190, 2300 176. Urine 2000 250, 2210 300. Oral 360.
- **Expected actions:** **do not hang the 40 mEq/L bag; call** (SBAR): peripheral IV only, limit 20 mEq/L in a peripheral bag, and 4 mEq/h from the bag + 10 mEq/h rider = 14 mEq/h (over the 10 mEq/h limit). Continue plain NaCl and riders. Check the old site (swelling smaller) and the new IV. Explain why he still is "not resolved" (BHB 2.0 even though pH is 7.31). Night fall safety: bed alarm, urinal, call light.
- **Provider reply (Varga):** "You're right, he has no central line. Discontinue that order. Keep plain saline at 100 and the riders per protocol." (Order stopped 2320; addendum 2330.)
- **Assessment changes:** IV right forearm 20 g (new, 1915): rider infusing, no redness or swelling, mild burning only. Former right antecubital site: swelling about 2 cm, softer, edges marked, arm on a pillow. Respiratory: normal pattern; faint fruity breath. GI: hungry; no nausea. Musculoskeletal: steady with stand-by assist; wants to walk to the bathroom alone. Pain: mild ache at the old site, 1/10. Psychosocial: tired, bored, texting his roommate.
- **VR:**
  - *Looks:* sitting up, restless, phone in hand. Normal breathing. Barely any fruity smell. Right elbow on a pillow with marker lines.
  - *Says:* "Can I just walk to the bathroom by myself? I'm fine." / "I'm so hungry. Broth is not food." / "Why do I keep getting these potassium bags?" / "When can I go home?"
  - *Room:* lights dim. Left pole: NaCl 100 mL/h, D10 100 mL/h (secondary tubing into the Y-site), insulin 7.6 units/h. Right pole: KCl rider 100 mL/h into the right forearm IV. Bed alarm on (light). Urinal on the rail. (No 40 mEq/L bag is in the room; the order is on the screen only.)
- **Safety catch:** **wrong/unsafe order** (40 mEq/L potassium in a peripheral bag, stacked with riders).
- **Teaching:** concentration limits (20 mEq/L peripheral, 40 mEq/L central) and rate limits (10 mEq/h peripheral, all sources added together). Resolution needs BHB under 0.6.

### Stop 6. D2 0300: low glucose from a disconnected dextrose line
- **Situation:** At about 0100 he got up to void (300 mL). The **D10 secondary tubing pulled apart at the needleless connector on the Y-site**. The pump kept running with no alarm, and the dextrose dripped into the bed. Glucose 0200 112: the off-going nurse raised D10 to 150 per the table at 0210 and called at 0215 (Varga: keep insulin 7.6, recheck in 1 h). No one traced the line, and there was no 0230 recheck. **0300 glucose 62.** He is sitting on the edge of the bed, sweaty and shaky; **bed alarm sounding**. 0130 labs: K 4.0, BHB 1.1 (not resolved).
- **New labs:** set 7 (0130): Na 139, K 4.0, Cl **109**, CO2 16, BUN 11, Cr 0.9, glucose 140, Mg 1.9, phos 2.3, gap 14, BHB 1.1, pH 7.32, pCO2 31, HCO3 15.6.
- **Monitor:** HR **116** sinus tachycardia; BP **134/80**; RR 20; SpO2 98%; T 98.2; pain 1 (headache). Mid row **0320** (after treatment): HR 92, BP 122/74, RR 16.
- **Aloud:** glucose 0000 166, 0100 158, 0200 112, **0300 62**; after D50: **0315 124**. Urine 0005 250, 0100 300. Oral 120.
- **Expected actions:** keep him safe (sit him back, reset the bed alarm, do not walk him); **D50 12.5 g IV push (25 mL)**; recheck 15 min (124); **trace the D10 line from bag to patient, find the open end, clamp it, and hang new sterile tubing at 150 mL/h** (do not reconnect a contaminated end); **lower insulin to 3.8 units/h**; **do not stop the insulin** (BHB 1.1, gap 14: ketones still clearing); call. Change the wet linen. Riders 0330 and 0430 (K 4.0 -> 20 mEq).
- **Provider reply (Varga):** "Good catch. Keep insulin at 3.8, D10 at 150, glucose every hour, call if under 100." (Order 0310; event note 0330.)
- **Assessment changes (at 0300, before treatment):** Neuro: awake, anxious, slow to answer, oriented x4, "foggy"; tremor of hands. Skin: **cool, pale, sweaty (diaphoretic)**. Cardiovascular: sinus tachycardia, regular; pulses strong. Safety: **found sitting on the edge of the bed with the bed alarm sounding**, wanting to walk to the bathroom with two IV poles; forgets his limits; **Morse 60** (second diagnosis 15, IV 20, weak gait 10, forgets limitations 15). IV left forearm: **D10 tubing disconnected at the Y-site connector; sheet and gown wet on the left side**; insulin and NaCl infusing; site normal. Endocrine: **hypoglycemia symptoms (shaky, sweaty, hungry, headache)**. Respiratory: no fruity breath. Pain: headache, 1/10. (Flowsheet comment 0320: alert, skin dry, tremor gone.)
- **VR:**
  - *Looks:* sitting on the edge of the bed, feet dangling, gripping the rail. Sweaty forehead, pale, hands shaking. Breathing a bit fast but not deep. No fruity smell.
  - *Says:* "I feel shaky and weird... I need to pee." / "Is this a low? It feels like a low." / "I'm sweating like crazy... and why is my bed wet?" / After treatment: "Okay... that's better. Sorry."
  - *Room:* dark, bed alarm beeping. **Pump 1 channel B screen: "D10W 150 mL/h, INFUSING," no alarm, volume infused climbing.** The D10 line end is **lying open on a wet sheet** at his left side, not attached to the Y-site; wet spot on the gown and sheet. Insulin pump 7.6 units/h (running). NaCl 100 mL/h. Right pole: no rider running (next due 0330). Glucometer reading 62. D50 syringe. New secondary tubing on the counter. Urinal within reach.
- **Safety catch:** **line problem causing hypoglycemia** (a running pump does not prove the patient is getting the drug) + **fall risk at night** (sweaty, shaky, trying to get up alone with lines).
- **Teaching:** on fixed-rate insulin, the dextrose line is a life-support line; trace every line from bag to patient; recheck in 30 min when glucose falls fast; a low on the infusion is treated with dextrose, not by stopping insulin.

### Stop 7. D2 0700: DKA resolved, an unsafe transition order
- **Situation:** 0530 labs: **BHB 0.4, pH 7.34, HCO3 18, gap 13 = resolved.** Night NP order (0635): **glargine 24 units at 0700 and stop the insulin infusion, D10 and NaCl at 0700.** Endocrinology (in the chart since D1 1130) planned morning glargine with the drip off at least 2 h later. Breakfast tray 0800. K 4.2 -> riders 0730, 0830. Weight 79.3 kg (0600, I&O record; said aloud).
- **New labs:** set 8 (0530): Na 139, K 4.2, Cl 108, CO2 **18**, BUN 10, Cr 0.8, glucose 160, Mg 1.9, phos 2.6, **gap 13**, **BHB 0.4**, **pH 7.34**, pCO2 34, HCO3 17.6.
- **Monitor:** HR 80 sinus, normal T; BP 122/74; RR 16; SpO2 98%; T 98.4; pain 0.
- **Aloud:** glucose 0400 140, 0500 152, 0600 156, 0700 152; pre-breakfast 0745: 154. Weight 79.3 kg. Urine 0315 200, 0530 300. Oral 240.
- **Expected actions:** confirm resolution with the criteria (show the numbers); **question the transition order** (no overlap = rebound ketosis; basal at least 2 h before the drip stops, 2024: 2-4 h): give **glargine 24 units at 0730**, **lispro 6 units at 0800** with breakfast (60 g, glucose 154: 60/10 = 6; (154-150)/50 = 0.08 -> 0), **stop the drip, D10 and NaCl at 0930**. D10 keeps running through breakfast because IV insulin is still running. Riders 0730 and 0830; teach him to give his own glargine.
- **Provider reply (Beaumont, 0715):** "Correct, give the glargine first and keep the drip at least 2 hours. Glargine 0730, breakfast lispro 0800, drip off 0930. Glargine every morning from now on." (Order 0720; the NP's order stopped early 0720.)
- **Assessment changes:** Neuro: alert, oriented, bright. Respiratory: normal, no fruity breath, occasional dry cough. GI: hungry, abdomen soft, nontender, bowel sounds active. Skin: warm, dry, mucous membranes moist, turgor normal. Musculoskeletal: strength 5/5, steady gait with stand-by. Safety: Morse 35 (IV 20, diagnosis 15); bed alarm off for day. Psychosocial: relieved; "I want to go home today." Endocrine: no symptoms of low glucose. IV sites: both patent; old right antecubital site swelling gone, faint bruise. Pain: none, 0/10.
- **VR:**
  - *Looks:* sitting up in the chair, smiling, normal breathing (16/min), pink moist lips, no smell. Hair messy.
  - *Says:* "I feel almost normal." / "So do I take my long-acting now? I usually take it at night." / "When can I eat? Is breakfast coming?" / "Can I do my own shot?"
  - *Room:* insulin pump now **3.8 units/h**; D10 150 mL/h; NaCl 100 mL/h; right pole KCl rider. Glargine pen and lispro pen from pharmacy (patient-labeled, two different labels), pen needles, alcohol swabs, sharps box. Breakfast tray at 0800 with a carbohydrate list.
- **Safety catch:** **unsafe transition order** (stopping IV insulin at the same time as the first glargine dose).
- **Teaching:** the 2024 resolution criteria; why the overlap of at least 2 h (2024: 2-4 h): IV insulin is gone in minutes, glargine takes hours to start.

### Stop 8. D2 1100: eating, off the drip, basal timing
- **Situation:** Glargine 0730, lispro 0800 given; ate 100% of breakfast; **drip, D10 and NaCl off 0930**; both IVs saline-locked; up ad lib from 0930. Showered and walked the hall. 0945 labs: BHB 0.3 (no rebound), **K 3.6** -> KCl ER 20 mEq at 1100 and 1500. He says he will "do my long-acting at nine tonight like always."
- **New labs:** set 9 (0945): Na 138, **K 3.6**, Cl 106, CO2 20, BUN 10, Cr 0.8, glucose 182, Mg 1.8, phos 2.4, gap 12, BHB 0.3. CBC: WBC 9.6, Hgb 13.8, Plt 241.
- **Monitor:** HR 78 sinus; BP 124/76; RR 14; SpO2 99%; T 98.6; pain 0.
- **Aloud:** glucose 0830 172, 0930 180; pre-lunch 1130: 196. Urine 0740 300, 1010 350. Oral 600.
- **Expected actions:** **teach basal timing**: he already had today's glargine at 0730; a 2100 dose would be 48 units in 13.5 h (night low); the next dose is 0730 tomorrow, 24 h later, and every morning after. Check for rebound after the drip (BHB 0.3, gap 12: none). Give KCl ER 20 mEq whole, upright, with a full glass of water. Calculate the lunch dose: 70 g -> 7 + (196-150)/50 = 0.92 -> 1 = **8 units** at 1200.
- **Assessment changes:** GI: ate 100% breakfast; no nausea; bowel sounds active. Musculoskeletal: walked the hall x2 independently, steady. IV sites: left forearm and right forearm saline locks, flushed, no redness. Safety: up ad lib; Morse 35. Psychosocial/knowledge: engaged; plans glargine "at nine tonight like always" (basal timing not yet understood). Cardiovascular: regular rhythm, normal T. Endocrine: off IV insulin since 0930; no rebound symptoms.
- **VR:**
  - *Looks:* dressed in his own T-shirt, damp hair (showered), walking around the room. Normal color, normal breathing.
  - *Says:* "That breakfast was the best thing I've ever eaten." / "Tonight I'll do my long-acting at nine like always, right?" / "How many units for lunch?" / "Do I really need potassium pills? They're huge."
  - *Room:* no infusion pumps running (pumps parked). Two saline locks. Telemetry still on. Lunch menu with carbohydrate grams. KCl ER 20 mEq tablet cup and water.
- **Safety catch:** **patient plans a second basal dose tonight** (would double his basal insulin): teach that the new time is every morning.
- **Teaching:** basal insulin is once every 24 h; when the time changes, the next dose is 24 h later. Watch for rebound ketosis after the drip stops. Oral potassium safety.

### Stop 9. D2 1500: teaching and teach-back
- **Situation:** Ate 80% of lunch with 8 units. Educator session 1 at 1330 (written sick-day plan). His sister brought his home pens at 1400. During a practice with the RN he **picks up the glargine pen to dose "2 units for these crackers"** (about 20 g). On teach-back he says, "If I can't eat, I'll take half my long-acting." 1330 labs normal; K 3.9; second KCl ER due 1500.
- **New labs:** set 10 (1330): Na 138, K 3.9, Cl 105, CO2 22, BUN 9, Cr 0.8, glucose 214 (after lunch), Mg 1.9, phos 2.9, gap 11, BHB 0.2.
- **Monitor:** HR 76 sinus; BP 122/76; RR 14; SpO2 99%; T 98.4; pain 0.
- **Aloud:** no glucose check since 1130 (196); lab glucose 1330 214; pre-dinner 1700 will be 142. Urine 1130 300, 1400 350. Oral 840.
- **Expected actions:**
  - **Stop the pen mix-up.** 2 units is the **right dose** for about 20 g of carbohydrate (1 unit per 10 g), but he picked the **long-acting pen**. In the hospital, lispro is ordered with meals only, so no snack dose here; at home he follows 1 unit per 10 g with the rapid-acting pen.
  - **Re-teach basal:** the full glargine dose is taken every morning even when not eating (changed only with the team, for lows).
  - **Teach-back of the written sick-day plan:** glucose and blood ketones every 2-4 h when ill; extra lispro **5 units for ketones 0.6-1.4**, **9 units and call for 1.5-2.9**, **ED for 3.0 or more**, repeated every 2-4 h while ketones stay positive; fluids 250 mL every hour (with 15 g carbohydrate per hour if not eating); call for vomiting more than twice or cannot keep fluids down, glucose over 300 twice, ketones not falling; ED for fast breathing, belly pain or confusion.
  - KCl ER at 1500. Dinner dose plan: 60 g, glucose 142 -> **6 units** at 1730.
- **Assessment changes:** Psychosocial/knowledge: partial teach-back; misconception about basal on sick days; motivated; sister present. GI: ate 80% lunch. Endocrine: practicing pen use; chose the wrong pen once (dose correct). Musculoskeletal: independent. Others unchanged.
- **VR:**
  - *Looks:* sitting on the bed with two insulin pens and a ketone meter, sister next to him. Relaxed, normal color and breathing.
  - *Says:* "If I'm not eating, I'll just take half my long-acting, right?" / (holding the long-acting pen) "Two units for these crackers." / "How many extra units do I take if my ketones are up?" / "When do I call you guys versus just come in?"
  - *Room:* home pens (long-acting and rapid-acting, similar size, different labels), pen needles, ketone meter with expired strips, educator handout "Sick-Day Plan" with the extra-lispro table, sharps box. No pumps running. Telemetry.
- **Safety catch:** **wrong insulin pen** (long-acting picked for a carbohydrate dose) and an unsafe sick-day belief.
- **Teaching:** teach-back, not "do you understand?"; label pens; why basal never stops; numbers for sick-day extra insulin.

### Stop 10. D2 1900: discharge plan for tomorrow
- **Situation:** Dinner 1730 with 6 units, ate 90%. 1730 labs normal (K 4.1, BHB 0.2). **Discharge order 1745: home tomorrow (D3) after breakfast** if overnight and fasting glucoses are 100-250 with no low, BHB under 0.6, and supplies in hand. Tessa will pick him up and stay the first night (roommate works nights). Prescriptions were written now, copied from his home list: **no blood ketone strips and no glucagon** (his are expired; pharmacy recommended both at 1400). Educator teach-back at 1645 correct.
- **New labs:** set 11 (1730): Na 139, K 4.1, Cl 104, CO2 23, BUN 9, Cr 0.8, glucose 138, Mg 1.9, phos 3.2, gap 12, BHB 0.2.
- **Monitor:** HR 74 sinus; BP 120/74; RR 14; SpO2 99%; T 98.4; pain 0.
- **Aloud:** glucose 1700 142. Urine 1600 300, 1830 300. Oral 720.
- **Expected actions:** review discharge readiness (below); **call to add blood ketone strips and glucagon** (nasal 3 mg or injection 1 mg) and plan to teach Tessa to give glucagon; confirm glargine every morning at 0730 (next dose D3 0730; none tonight); bedtime glucose 2100 (correction only if over 250) and 0300 check tonight; remove the right forearm IV (keep the left saline lock overnight); confirm follow-up 01/15; final teach-back with the sister.
- **Provider reply (Ashworth):** "Yes, add them. The outpatient pharmacy will bring them up in the morning before he leaves."
- **Discharge decision: D3 about 1000, after one night on SubQ insulin.** Reasons to stay one night: the drip has been off only about 10 h; he has had one glargine dose at a new time of day; no overnight or fasting glucose on SubQ insulin yet; his roommate works nights. Criteria for tomorrow: overnight and fasting glucoses 100-250 with no low, BHB under 0.6, eating, K normal, supplies (including ketone strips and glucagon) in hand, sister present, follow-up 01/15.
- **Assessment changes:** Psychosocial/knowledge: correct teach-back of the sick-day plan with his sister; states when to call and when to come to the ED; disappointed not to go tonight but agrees. GI: ate 90% of dinner. IV sites: right forearm to be removed; left forearm saline lock, no redness. Safety: low fall risk; bed alarm per night policy. Endocrine: knows pens apart; next glargine 0730 tomorrow.
- **VR:**
  - *Looks:* in his own clothes, sitting in the chair, phone charging, relaxed. Normal breathing, good color.
  - *Says:* "Basal every morning, no matter what. Ketones every few hours if I'm sick." / "My ketone strips at home are from 2024... do I need new ones?" / "Tessa, you know where the glucagon goes, right?" / "So I really have to stay one more night?"
  - *Room:* discharge instructions draft on the table, prescription list (pens, needles, glucose strips, lancets, glucose tablets; **no ketone strips, no glucagon**), sharps box, sister in the chair. Two saline locks, telemetry on.
- **Safety catch:** **missing discharge supplies** (blood ketone strips and glucagon), from a list copied from his home prescriptions.
- **Teaching:** discharge is about the plan working at home: supplies, a person who can help, a tested insulin schedule, and a follow-up date.

---

## 17. Bedside monitor rows (`monitor.html`, key MRN SIM-40601, room SD-3, "SD-3   MERCER, CALEB   28 M")

| Row | hr | spo2 | sys/dia | rr | temp (F) | rhythm | pr | qrs | tAmp | uAmp | pvc | o2 | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 0700 | 112 | 98 | 108/64 | 24 | 99.4 | sinus tach | 146 | 90 | 0.45 | 0 | | RA | Kussmaul; pain 4 |
| D1 1100 | 102 | 98 | 114/68 | 20 | 99.0 | sinus tach | 148 | 90 | 0.30 | 0 | | RA | pain 3 |
| D1 1500 | 98 | 98 | 116/70 | 18 | 98.8 | sinus + PVCs | 150 | 88 | 0.15 | 0.12 | 2 | RA | K 3.2; pain 2 |
| D1 1900 | 96 | 98 | 120/72 | 18 | 99.1 | sinus | 150 | 88 | 0.25 | 0.06 | | RA | pain 5 right elbow |
| D1 2300 | 88 | 97 | 118/70 | 16 | 98.6 | sinus | 150 | 88 | 0.30 | 0 | | RA | pain 1 |
| D2 0300 | 116 | 98 | 134/80 | 20 | 98.2 | sinus tach | 146 | 88 | 0.30 | 0 | | RA | glucose 62; pain 1 |
| D2 0320 (mid) | 92 | 98 | 122/74 | 16 | 98.2 | sinus | 148 | 88 | 0.30 | 0 | | RA | after D50 |
| D2 0700 | 80 | 98 | 122/74 | 16 | 98.4 | sinus | 150 | 88 | 0.30 | 0 | | RA | pain 0 |
| D2 1100 | 78 | 99 | 124/76 | 14 | 98.6 | sinus | 150 | 88 | 0.30 | 0 | | RA | pain 0 |
| D2 1500 | 76 | 99 | 122/76 | 14 | 98.4 | sinus | 150 | 88 | 0.30 | 0 | | RA | pain 0 |
| D2 1900 | 74 | 99 | 120/74 | 14 | 98.4 | sinus | 150 | 88 | 0.30 | 0 | | RA | pain 0 |

D1 1500 `events`: PVC at about 2 per minute (draw on the live ECG).

## 18. Judgment calls and review changes
1. **Arrival gas:** the brief's examples (HCO3 8-11 with pH 7.10-7.18) cannot both fit Winter's formula. Serum CO2 8 (gas HCO3 6.8) and pH 7.18 keep every gas consistent. Severity: moderate-to-severe.
2. **Fixed-rate insulin** (0.1 unit/kg/h, no bolus, no titration) with a D10 line; lowered to 0.05 only for a low.
3. **0.9% saline** (not lactated Ringer's) to match the series and the peripheral potassium rule; the D2 chloride rise is a teaching point; 0.45% or a balanced fluid are named as alternatives.
4. **K 3.2 at 1400** (changed from 3.4 after review) so that holding insulin is correct under the 2009 ADA algorithm (under 3.3), the 2024 consensus (under 3.5) and this protocol. The hold is a student action at 1500. Hold 1500-1750; BHB rises during the hold on purpose.
5. **Viral panel resulted at 0950** (batched PCR, about 8 h). The droplet order carries a nurse-driven discontinue line. No note mentions isolation. Unit policy for a suspected viral illness is simplified to droplet precautions (some units add eye protection, or N95 plus eye protection while COVID-19 is possible; the instructor can mention this).
6. **Three planted provider-order errors only:** D1 2300 KCl 40 mEq/L bag (Varga), D2 0700 no-overlap transition (night NP Ostrowski), D2 1900 missing ketone strips and glucagon (copied home list). The duplicate-glargine order was removed; basal timing is taught through his own question at D2 1100. Other catches are events or patient/nurse issues (old K at handoff, infiltration, disconnected line, wrong pen).
7. **Discharge D3 about 1000** after one night on SubQ insulin (changed from same evening).
8. **Glargine dose kept at 24 units** (home dose) but moved to **0730 daily**.
9. **Pre-written chart assessments describe the event of each stop** (infiltration at 1900, low glucose at 0300) because the in-class rule requires a new assessment at every stop. Rows after 1100 do not say whether droplet precautions were discontinued.
10. **Potassium table kept at 30 mEq for K 3.5-3.9** (the reviewer offered 40; changing it would cascade the rider schedule).
11. **D2 weight** is charted on the I&O daily-weight record, not as a vital sign.
12. Lipase 92 (mildly high) is shown but not treated as pancreatitis. NaCl 100 mL/h overnight is kept and used as a debrief question.

---

## 19. Per-stop summary table

| Time | What changed | New labs (values) | Assessment highlights | Monitor row (HR, BP, RR, SpO2, T, rhythm, pain) | Instructor says aloud | Teaching point | Safety catch |
|---|---|---|---|---|---|---|---|
| **D1 0700** | Arrives from ED; insulin 7.6 units/h, NaCl 250; glucose 248 | ED 0145: Na 131, **K 5.6**, Cl 95, CO2 8, Cr 1.5, Glu 538, **AG 28, BHB 6.4, pH 7.18**/pCO2 19/HCO3 6.8; ED 0500: Na 134, **K 4.6**, CO2 10, Glu 348, AG 23, BHB 5.5, pH 7.23; WBC 17.8; lipase 92 | Drowsy, Kussmaul, fruity breath, dry mucosa, tenting 3 s, flushed with cool hands, nausea, Morse 45 | 112, 108/64, 24 deep, 98% RA, 99.4, sinus tach with slightly tall T, 4 | Glucose 0700 248 (charted); urine 400 at 0630 | Insulin moves K into cells; add dextrose under 250 and keep insulin | Handoff uses the old K 5.6; newest K 4.6 -> rider due; start D10 |
| **D1 1100** | D10 100 + NaCl 150; riders 1030/1130/1230; emesis 120; clear liquids | 0930: Na 136, **K 3.9**, Cl 104, CO2 12, Glu 200, Mg 1.8, phos 2.4, **AG 20, BHB 4.1, pH 7.27**; **viral panel negative (0950)**; A1c 8.3% | Alert, breathing slower, fruity breath fainter, nausea better, ache at rider site | 102, 114/68, 20, 98%, 99.0, sinus tach, 3 | Glucose 0800 228, 0900 210, 1000 196, 1100 186; urine 350/300/250 | Isolation matches evidence; gap closure is the goal | **Discontinue droplet precautions** (order to discontinue; nurse-driven protocol) |
| **D1 1500** | K 3.2 -> hold insulin and D10, 4 riders, MgSO4, ECG, STAT labs 1720 | 1400: Na 137, **K 3.2**, Cl 106, CO2 13, Glu 198, **Mg 1.6**, phos 1.9, AG 18, BHB 2.6, pH 7.29 | Heavy legs, calf cramps, weaker grip, PVCs, U waves | 98, 116/70, 18, 98%, 98.8, sinus + PVCs 2/min, flat T + U waves, 2 | Glucose 1200 182, 1300 190, 1400 196, 1500 202 | Hypokalemia on insulin; magnesium; ketones rise while held | **K 3.2 (under 3.5): hold insulin**; one rider at a time |
| **D1 1900** | Insulin restarted 1750; D10 restart now (244); rider IV infiltrated (grade 2); NaCl 100 | STAT 1720: Na 137, **K 3.6**, Cl 106, CO2 13, Glu 270, Mg 2.0, AG 18, **BHB 3.1, pH 7.27**; ECG 2 (U waves, QTc 460) | Right antecubital swollen 4 cm, cool, pale, burning; hungry; frustrated | 96, 120/72, 18, 98%, 99.1, sinus, low T small U, 5 (elbow) | Glucose 1600 238, 1700 266, 1800 274, 1900 244; rider 92 of 100 mL in | Rider site checks; antecubital sites; restart dextrose under 250 | **IV infiltration with KCl**: stop, remove, elevate, new IV |
| **D1 2300** | Riders 2230/2330/0030 (new IV); **KCl 40 mEq/L bag ordered 2245** | 2130: Na 139, **K 3.7**, Cl 108, CO2 15, Glu 196, AG 16, **BHB 2.0, pH 7.31** | New IV fine; old site 2 cm, marked; hungry, restless, wants to walk alone | 88, 118/70, 16, 97%, 98.6, sinus normal T, 1 | Glucose 2000 222, 2100 204, 2200 190, 2300 176 | Peripheral K limits; pH 7.31 but BHB 2.0 = not resolved | **Wrong order**: 40 mEq/L peripheral + stacking with riders |
| **D2 0300** | D10 tubing disconnected at the Y-site since about 0100 (pump running, dextrose into the bed); glucose 62; D50, new tubing D10 150, insulin 3.8 | 0130: Na 139, **K 4.0**, Cl 109, CO2 16, Glu 140, AG 14, **BHB 1.1, pH 7.32** (non-gap from saline) | Sweaty, shaky, foggy, wet sheet, on the edge of the bed with alarm sounding, Morse 60 | 116, 134/80, 20, 98%, 98.2, sinus tach, 1; 0320: 92, 122/74, 16 | Glucose 0000 166, 0100 158, 0200 112, **0300 62**, 0315 124 | Trace lines bag to patient; recheck in 30 min when falling fast; do not stop insulin | **Disconnected dextrose line -> hypoglycemia**; **night fall risk** |
| **D2 0700** | **Resolved**; unsafe transition order (no overlap); riders 0730/0830 | 0530: Na 139, **K 4.2**, Cl 108, **CO2 18**, Glu 160, **AG 13, BHB 0.4, pH 7.34**; weight 79.3 (I&O record) | Alert, normal breathing, no odor, moist mucosa, hungry, strength 5/5 | 80, 122/74, 16, 98%, 98.4, sinus, 0 | Glucose 0400 140, 0500 152, 0600 156, 0700 152, 0745 154; weight 79.3 kg | Resolution criteria; basal at least 2 h before stopping the drip (2024: 2-4 h); here 0730 -> 0930 | **Unsafe order**: glargine and drip stop at the same time |
| **D2 1100** | Glargine 0730, lispro 6 at 0800, drip off 0930; showered, walking | 0945: Na 138, **K 3.6**, CO2 20, Glu 182, AG 12, **BHB 0.3** (no rebound); WBC 9.6 | Ate 100%, walking independently, saline locks; plans glargine "at nine tonight" | 78, 124/76, 14, 99%, 98.6, sinus, 0 | Glucose 0830 172, 0930 180, 1130 196 | Basal every 24 h (next 0730 tomorrow); no rebound; oral KCl; lunch 8 units | **Patient plans a second basal dose tonight** |
| **D2 1500** | Educator session; pen practice; KCl ER 1500 | 1330: Na 138, K 3.9, CO2 22, Glu 214, AG 11, BHB 0.2 | Partial teach-back; "half my long-acting if not eating"; long-acting pen picked for a correct 2-unit carbohydrate dose | 76, 122/76, 14, 99%, 98.4, sinus, 0 | No check since 1130 (196); lab 214; 1700 will be 142 | Sick-day plan with numbers (5 / 9 units / ED) and teach-back | **Wrong insulin pen** + unsafe sick-day belief |
| **D2 1900** | Dinner 6 units; discharge order 1745 for D3 after breakfast | 1730: Na 139, K 4.1, CO2 23, Glu 138, AG 12, BHB 0.2 | Correct teach-back with sister; ate 90%; one more night | 74, 120/74, 14, 99%, 98.4, sinus, 0 | Glucose 1700 142 | Discharge readiness: supplies, support, tested schedule, follow-up | **No ketone strips or glucagon** on the discharge prescriptions |

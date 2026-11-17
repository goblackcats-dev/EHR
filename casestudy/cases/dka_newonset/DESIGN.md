# In-class DKA patient: Nora Whitcombe, new-onset type 1 diabetes in DKA (single source of truth)

Simulation: **Mon 2027-02-08 0700 to Tue 2027-02-09 0700 (24 h)**. "D1" = Monday 02/08, "D2" = Tuesday 02/09. Seven checkpoints, every 4 hours: **D1 0700, 1100, 1500, 1900, 2300, D2 0300, 0700**. The case study packet covers all 7 stops. Everything below is time-gated to the minute. Follow `BRIEF.md` and the "Rules every patient follows" in `.claude/skills/patient-course/SKILL.md`.

Design lessons taken from `../dka_inclass/DESIGN_REVIEW.md` (Caleb Mercer):
- Every gas is checked with Henderson-Hasselbalch and Winter's (section 6).
- Every note quotes only results already back at its time (each note row in section 13 lists the result times it uses).
- The insulin-hold threshold is not left in a gray zone. The lowest potassium is **3.6**. That is above 3.5 (2024 consensus) and above 3.3 (2009 ADA algorithm and the textbook), so every source agrees: **keep the insulin running and replace potassium.**
- The overlap is written as "**basal at least 2 h before stopping the infusion (2024: 2-4 h); here 2 h, 1900 -> 2100**."
- Pump events are realistic: there is no pump event. The low glucose happens after the transition, on subcutaneous insulin, from exercise after the first basal dose (not the Maya/Jordan beat).
- Revised after `DESIGN_REVIEW.md`: all MUST FIX and SHOULD FIX items and the quick NICE TO HAVE items applied (section 19 lists them).
- **Exactly 2 planted order errors**, by 2 different authors, each teaching something different.

In-class chart rules for this patient:
- **Vital signs and POC glucoses are charted only up to the 0700 arrival.** After 0700 the bedside monitor shows the vitals (monitor.html rows for MRN SIM-40602). The instructor says the glucoses aloud (section 7).
- **The D2 0600 weight (56.2 kg)** is charted on the I&O daily-weight record (a note on the D2 0700 I&O block), not as a vital sign. The instructor also says it aloud at D2 0700.
- **A NEW full nursing assessment at every stop** (13 rows; values carried forward; the changed rows tell the story). No vital-sign numbers in the assessment text. The pain row uses words plus a 0-10 score, and that score matches the monitor row note.
- **A NEW lab set at every stop**, resulted before the stop.
- MAR: ED doses `given`; infusions running at 0700 show "0700 Running"; **every dose after D1 0700 is `due`**.
- The students are the unit RNs at every stop. Unit RN notes are not pre-written. The instructor narrates events between stops as the "off-going nurse."
- **Chart text never says "student."** Where this design says "students do X," the chart says "RN."

---

## 1. Patient

- **Nora Whitcombe**, 22-year-old woman, she/her. DOB **2004-09-14**. MRN **SIM-40602**. caseCode **CS-DKA-NEWONSET-WHITCOMBE**. Height **165 cm**.
- **Weight 55.0 kg** (ED bed scale; this is the dosing weight for the whole stay). BMI = 55.0 / 1.65^2 = 55.0 / 2.7225 = **20.2**.
- Usual weight **61.0 kg** (student health clinic, 09/2026). She has lost **6.0 kg (9.8%) since September**, most of it in the last 6 weeks by her account.
- **Allergy:** amoxicillin (rash as a child). Full Code.
- Unit: **Medical-Surgical Step-Down with telemetry, room SD-6**, for the whole stay. Pre-Built group **"Case Study Patients"**.
- **No known diabetes.** This is a new diagnosis made in the ED.
- **Home medications:**
  - Levonorgestrel intrauterine device (placed 2025; no daily medicine).
  - Ibuprofen 400 mg PO PRN for headaches. Last dose Sun 02/07 about 1400 for belly pain; she vomited it.
  - No supplements.
- **Social history:**
  - Third-year environmental science student at the state university, 3 hours from home.
  - Lives off campus in an apartment with her roommate **Kendall Rowan** (21, works evening shifts at a campus coffee shop).
  - Works part time at the campus library.
  - Health insurance through her mother's plan.
  - Runs 3 times a week and started a gym routine in January. She blamed the weight loss on the gym.
  - Alcohol: 2-4 drinks on weekend nights; none for 2 weeks ("I've felt too gross"). No tobacco, no vaping, no drugs.
  - Drives her own car.
- **Support person and emergency contact:** her mother **Julia Whitcombe** (49, high school teacher, lives 3 hours away). Kendall calls her at 0600 Monday. She arrives about **1300**, plans to stay with Nora for a week after discharge, and has taken leave from work. Parents divorced; her father lives out of state and is in touch by phone.
- **Family history:**
  - Maternal aunt: type 2 diabetes on pills. This is the source of Nora's belief: "Can't I just fix it with diet?"
  - Maternal grandmother: hypothyroidism (autoimmune).
  - Nobody in the family has type 1 diabetes.
- Primary care: **H. Szymanski, NP**, student health clinic. Last seen 09/2026 for a sports physical, with normal findings.

## 2. People (unique across all patients; each name grepped across `casestudy/cases`, `js`, `*.html`: no matches)

| Role | Name |
|---|---|
| ED physician | **K. Aldana, MD** |
| ED RN | **M. Prewitt, RN** (insulin second checker **J. Galloway, RN**) |
| Night hospitalist (admitting H&P; D1 night) | **D. Rasmussen, MD** |
| Day hospitalist (D1) | **A. Petrakis, MD** |
| Endocrinology | **C. Navarro, MD** |
| Pharmacist | **Y. Kassab, PharmD** |
| Dietitian | **R. Lowell, RD** |
| Diabetes educator | **E. Thornbury, RN, CDCES** |
| Social worker | **T. Quinlan, LCSW** |
| Case manager | **V. Pemberton, RN CM** |
| Student health primary care | H. Szymanski, NP |
| Mother / support person | **Julia Whitcombe** (49) |
| Roommate | **Kendall Rowan** (21) |

Names rejected because they clash with other patients: Castellano, Whitfield, Osei, Sorensen, Haddad, Fairbanks, Halvorsen, Fenwick, Calloway, Abernathy, Isabel.

## 3. Story before the hospital (the classic "3 P's" history)

- **Late December to early February (about 6 weeks):**
  - Always thirsty: "I was drinking like 4 or 5 big sports drinks a day, plus water."
  - Urinating constantly, waking 3-4 times a night to void.
  - Always hungry, but losing weight. Her jeans got loose, and she thought it was the gym.
  - Very tired. She fell asleep in afternoon lectures.
  - Blurry vision when reading slides; she thought she needed glasses.
  - Two yeast infections (treated over the counter).
  - She blamed the start of the semester and stress.
- **Sat 02/06:** queasy, ate very little, drank sports drinks and water.
- **Sun 02/07:**
  - Vomiting from about noon (6-7 times), crampy belly pain.
  - By evening she was "breathing like I'd been running," with a dry mouth and a headache.
  - She took ibuprofen 400 mg at 1400 and vomited it.
- **Mon 02/08 about 0100:** Kendall came home from a late shift and closing. She found Nora on the bathroom floor, drowsy, breathing deep and fast, with breath that "smelled like nail polish remover." Kendall drove her to the ED. **Arrival 0140.**

## 4. ED course (all charted, given)

| Time (D1) | Event |
|---|---|
| **0140** | Arrival with Kendall. |
| **0145** | **Triage** (Prewitt): T 98.9 F, **HR 126, BP 98/58, RR 30 deep and regular (Kussmaul), SpO2 99% RA**, pain 6 (belly). Drowsy but oriented x4, GCS 15. **Fruity breath.** Dry, cracked lips. Weight **55.0 kg** (bed scale). |
| 0146 | **POC glucose 548.** |
| **0148** | Aldana orders: NPO, labs, ECG, UA, serum hCG, HbA1c, 0.9% NaCl bolus, ondansetron. |
| **0150** | **PIV 18 g left forearm.** Labs drawn: VBG, BMP, Mg, phos, BHB, CBC, lactate, lipase, serum hCG, HbA1c. |
| 0155 | **PIV 20 g right forearm** (second line). |
| **0200** | **Ondansetron 4 mg IV.** **0.9% NaCl 1,000 mL bolus over 1 h** (0200-0300). |
| 0205 | **ECG 1:** sinus tachycardia 124, **peaked T waves V2-V4**. Gas results: pH 7.14, pCO2 19, HCO3 6.2; lactate 2.1. |
| 0215 | Emesis 150 mL. CBC results. |
| 0230 | Void 450 mL; UA sent. |
| **0235** | BMP results: **K 5.8**, glucose 562, CO2 7, **gap 30**. Lipase 48. **hCG negative.** |
| **0245** | BHB **6.8**. DKA confirmed. Aldana orders: **regular insulin infusion 0.1 unit/kg/h = 5.5 units/h, fixed rate, no bolus** (K 5.8 is known and is 3.5 or more, so insulin may start). **0.9% NaCl 500 mL/h x 2 h, then 250 mL/h. No potassium (K over 5.0).** Repeat labs at 0530. |
| 0300 | POC **498** (after 1 L, before insulin). **NaCl 500 mL/h.** Vitals: HR 118, BP 104/62, RR 28, SpO2 99%, T 98.8. UA results. |
| **0305** | **Insulin infusion started 5.5 units/h** (independent double check, Prewitt + Galloway). |
| 0400 | POC 442. |
| 0420 | Void 500 mL. |
| 0430 | ED provider note. |
| 0450 | Rasmussen accepts the admission by phone. |
| **0500** | POC 384. **NaCl to 250 mL/h.** Vitals: HR 112, BP 106/64, RR 26, SpO2 99%, T 98.6. Rasmussen adds the new-diagnosis labs to the 0530 draw (C-peptide, GAD65/IA-2/ZnT8 antibodies, TSH, tTG-IgA with total IgA). |
| **0530** | Labs drawn (set 2 + new-diagnosis labs). |
| **0540** | **Admitting H&P and admission orders (Rasmussen).** These include the planted sodium bicarbonate order (section 10). |
| 0545 | Gas result: pH 7.24. Lactate 1.2. |
| 0600 | POC 330. Kendall calls Julia. |
| 0610 | Void 400 mL. |
| 0615 | BMP result: K 4.7. Vitals: HR 108, BP 108/66, RR 24, SpO2 99%, T 98.6. |
| 0625 | BHB result 5.4. |
| 0630 | ED nursing note. |
| 0645 | ED-to-unit handoff note (accurate: it gives the 0530 K 4.7 and says a protocol potassium rider will be due on the unit). |
| **0700** | Arrives in SD-6. Unit vitals (charted): **HR 106, BP 110/66, RR 24 deep, SpO2 99% RA, T 98.6 F, pain 4.** **POC glucose 0700: 274** (charted). Telemetry on. Kendall leaves for class at 0730; Julia is on the way. |

ED vitals in the chart: 0145, 0300, 0500, 0615, and the unit 0700 set. Nothing after 0700.

## 5. Protocol and the math (state it the same everywhere)

**Protocol used:** adult DKA, **2024 ADA/EASD/JBDS/AACE/DTS hyperglycemic crises consensus**. This hospital's DKA order set uses a **fixed-rate insulin infusion at 0.1 unit/kg/h, no bolus, not titrated to glucose**. When glucose falls below 250, dextrose is added to the main fluid (ADA "D5 with 0.45% saline" style) and the insulin stays at 0.1 unit/kg/h. Fixed rate with dextrose is the default in the brief; the consensus allows it; it keeps the insulin clearing ketones; and it gives one simple rule for students: **"dextrose up, never insulin off."**

- **Diagnosis (2024):** glucose 200 or more (or known diabetes); BHB 3.0 or more; pH under 7.3 and/or bicarbonate under 18.
  - Nora: glucose 562, BHB 6.8, pH 7.14, bicarbonate 7.
  - **Severity:** pH 7.14 is in the moderate range (7.00-7.24). Bicarbonate 7 is in the severe range (under 10). BHB over 6 is a severe feature. She is drowsy but oriented.
  - Call it **moderate-to-severe DKA**.
- **Insulin:**
  - 0.1 x 55.0 = **5.5 units/h**. Bag: regular insulin 100 units in 100 mL 0.9% NaCl = 1 unit/mL, so **5.5 mL/h**. No bolus.
  - **Do not titrate to glucose.**
  - Lower rate 0.05 x 55.0 = **2.75 units/h**, used only per the dextrose table (glucose under 100 on D10, or under 70).
  - **Hold insulin only if K is under 3.5, and call** (2024 consensus; the 2009 ADA algorithm and the textbook use under 3.3; see section 14).
  - **Never stop insulin for a lower glucose while BHB is 0.6 or more: give more dextrose instead.**
- **Glucose fall goal before dextrose:** 50-75 mg/dL per hour.
  - Actual: 0300 498 -> 0400 442 (-56) -> 0500 384 (-58) -> 0600 330 (-54) -> 0700 274 (-56) -> 0800 222 (-52). All on target.
  - Fluid alone: 0146 548 -> 0300 498 (-50 in 74 min, from dilution and urine glucose loss).
- **Fluid plan (the textbook "fluid first" priority):**
  - **Hour 1:** 0.9% NaCl 1,000 mL = 1,000 / 55.0 = **18.2 mL/kg** (consensus 1-1.5 L).
  - **Hours 2-3:** 0.9% NaCl 500 mL/h = 9.1 mL/kg/h. **Hours 4-5:** 250 mL/h = 4.5 mL/kg/h (consensus 250-500 mL/h).
  - **From 0700: 0.45% NaCl 250 mL/h.** After the first liters restore volume, **the corrected sodium decides the fluid.** Corrected Na is **137.4** (normal), so 0.45% saline replaces the free-water deficit (2009 ADA rule, kept in practice). Staying on 0.9% would add more chloride. A low corrected Na would mean staying on 0.9%.
  - **Lactated Ringer's is not used:** it carries 4 mEq/L K. At 250 mL/h that is 1 mEq/h, and with a 10 mEq/h rider the total is 11 mEq/h, over the peripheral limit.
  - **When glucose is under 250: change to D5W/0.45% NaCl at 150 mL/h** (5 g/100 mL x 150 = **7.5 g dextrose/h**).
  - **Estimated deficit:** from her exam (HR 126, BP 98/58, tenting, dry mucosa), about **6% of body weight = 3.5 L**. IV crystalloid by 2100: 2,500 + 271 + 1,938 = **4,709 mL**, plus about 1.5 L drunk from 1100, but urine and emesis were 5.4 L (osmotic diuresis). Net +2.2 L minus about 1.2 L insensible = **about 1 kg kept** (weight 55.0 -> 56.2). Circulation and the exam are restored first; the last 1.5-2 L of the deficit is made up by mouth over the next days. No fluid overload: young, normal heart and kidneys, lungs clear throughout.
- **Dextrose table (this hospital; it keeps glucose 150-249; the ADA aims 150-200; JBDS 108-252):**

| POC glucose | Action |
|---|---|
| 250 or more | 0.45% NaCl 250 mL/h, no dextrose |
| **150-249** | **D5W/0.45% NaCl 150 mL/h** |
| 100-149 | change to D10W/0.45% NaCl 150 mL/h; recheck in 30 min; call |
| 70-99 | D10W/0.45% NaCl 150 mL/h **and** insulin to 2.75 units/h; call |
| under 70 | D50 12.5 g IV push (alert) or 25 g (not alert); recheck in 15 min; insulin to 2.75 units/h; call; **do not stop insulin** while BHB is 0.6 or more |

  Glucose checks: hourly on the infusion; **every 30 min if glucose falls more than 75 in 1 h or is under 100.** Nora's glucose on D5/0.45% stays **162-204** (section 7), so the table never moves past the first dextrose step. One clean dextrose step.

- **Potassium (PERIPHERAL rules, BRIEF.md).** Nora has peripheral IVs only.
  - **No potassium in any bag.** Potassium goes as **KCl 10 mEq in 100 mL riders over 1 h on a pump (10 mEq/h), one at a time, at most 4 in a row, then recheck.** Riders run alone on their own pump into the **right forearm IV**.
  - Give only if urine is at least 0.5 mL/kg/h (0.5 x 55 = **27.5, so 28 mL/h**).
  - **Table by the newest K (per 4-hour lab cycle):**
    - over 5.0: none; recheck with the next set;
    - 4.5-5.0: **10 mEq** (1 rider);
    - 4.0-4.4: **20 mEq** (2 riders);
    - 3.5-3.9: **40 mEq** (4 riders);
    - **under 3.5: hold insulin and dextrose, call, 4 riders back to back, 12-lead ECG, STAT K after the riders, restart insulin at K 3.5 or more.** (Never reached in this course.)
  - Target K 4-5. One rider = 10 mEq/h, the maximum. Never two riders at once.
  - **Lab draws:** venipuncture from the right antecubital vein when no rider is running. If a rider is running, draw from the right hand below the rider IV with the rider paused 2 minutes per policy (set 5). Never draw from the left arm, where insulin and dextrose run.
- **Magnesium:** MgSO4 2 g IV over 2 h when Mg is under 1.8 (low Mg makes K hard to correct). Given once: D1 1505-1705 (Mg 1.7), through the left line Y-site.
- **Phosphate:** monitored, not replaced (2024: replace only if under 1.0 or with heart or breathing compromise). Lowest value **1.8**.
- **Bicarbonate:** **only if pH is under 7.0** (2024). Nora's lowest pH is 7.14, so **no bicarbonate.** The order set says this. The planted order breaks it (section 10).
- **Neuro checks every 2 h** while on the infusion: cerebral edema is rare in adults but mostly seen under 20-25 years. Nora never has signs.
- **Resolution (2024 consensus):** **BHB under 0.6 AND (venous pH 7.3 or more OR bicarbonate 18 or more).** Glucose is not a criterion.
  - **Met at D1 1730** (BHB 0.5, pH 7.34, CO2 18; result 1825).
  - Not resolved at 1330 under either definition: 2024: pH 7.32 is over 7.3, but BHB is 1.3. 2009/textbook (glucose under 200 plus 2 of HCO3 15 or more, pH over 7.3, gap 12 or less): only the pH is met (CO2 14, gap 17). This is the "pH alone is not enough" teaching point.
- **Transition (new-onset, insulin-naive; 2024: about 0.5-0.6 unit/kg/day, about half basal):**
  - Total daily dose (TDD) 0.5 x 55.0 = **27.5 units/day**.
  - Basal half = 13.75, rounded to **glargine 14 units SubQ daily at 1900** (0.25 unit/kg).
  - Mealtime: **lispro 4 units with each meal** (3 x 4 = 12 units; total 26 units = 0.47 unit/kg/day).
  - **Correction before meals:** 1 unit per 50 mg/dL over 150 (sensitive scale; whole units; 0.5 rounds up). Bedtime and 0300 correction only if over 250.
  - **Basal is given at least 2 h before stopping the infusion (2024: 2-4 h); here 2 h: glargine 1900 -> insulin infusion and D5/0.45% off 2100.**
  - Dextrose continues as long as IV insulin runs.
  - The 2024 report also allows early basal insulin while still on the drip. Dr. Navarro chose a single transition at resolution (the cleaner textbook teaching).
- **Formulas used:**
  - Anion gap = Na - Cl - CO2 (normal 8-12).
  - Corrected Na = Na + **1.6 x (glucose - 100)/100** (ADA; ISPAD uses 2). No correction when glucose is 100 or less.
  - Effective osmolality = 2 x Na + glucose/18. Calculated osmolality = effective + BUN/2.8.
  - Henderson-Hasselbalch: pH = 6.1 + log10(HCO3 / (0.03 x pCO2)).
  - Winter's: expected pCO2 = 1.5 x HCO3 + 8 +/- 2. **Winter's is written for arterial pCO2 and is applied here to venous pCO2 (series convention). Venous pCO2 runs about 3-8 mmHg above arterial, so a venous value inside the range means compensation is at least adequate.**
  - eGFR: CKD-EPI 2021, female, age 22. **It is an estimate only while creatinine is changing (AKI).**
  - Estimated average glucose (eAG) = 28.7 x A1c - 46.7.

## 6. Chemistry and gases (collected / result times)

Result delays: gas 15 min, BMP (with Mg, phos) 45 min, BHB 55 min. The gas HCO3 is calculated from the gas; serum CO2 comes from the BMP (about 0.6-0.8 lower on the gas here). Venous gases stop after resolution.

| Set | Collected | Results gas / BMP / BHB | Na | K | Cl | CO2 | BUN | Cr | Glu | Ca | Mg | Phos | **AG** | **BHB** | pH | pCO2 | HCO3 (gas) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 (ED) | D1 0150 | 0205 / 0235 / 0245 | 130 | **5.8** | 93 | **7** | 24 | **1.3** | **562** | 9.6 | 2.3 | 5.9 | **30** | **6.8** | **7.14** | 19 | 6.2 |
| 2 (ED) | D1 0530 | 0545 / 0615 / 0625 | 133 | **4.7** | 100 | 10 | 21 | 1.1 | 352 | 9.0 | 2.1 | 3.9 | 23 | 5.4 | 7.24 | 22 | 9.2 |
| 3 | D1 0930 | 0945 / 1015 / 1025 | 136 | 4.1 | 104 | 13 | 17 | 0.9 | 198 | 8.8 | 1.9 | 2.6 | **19** | 3.3 | 7.29 | 26 | 12.2 |
| 4 | D1 1330 | 1345 / **1415** / 1425 | 137 | **3.6** | 106 | **14** | 13 | 0.8 | 172 | 8.7 | **1.7** | **1.8** | **17** | **1.3** | **7.32** | 27 | 13.4 |
| 5 | D1 1730 | 1745 / 1815 / **1825** | 138 | 3.9 | 106 | **18** | 11 | 0.8 | 170 | 8.8 | 2.1 | 2.0 | **14** | **0.5** | **7.34** | 33 | 17.2 |
| 6 | D1 2200 | — / 2245 / 2255 | 139 | 4.0 | 106 | 20 | 10 | 0.7 | 152 | 8.9 | 2.0 | 2.2 | 13 | 0.3 | | | |
| 7 | D2 0200 | — / 0245 / 0255 | 139 | 4.1 | 105 | 22 | 10 | 0.7 | **84** | 9.0 | 2.0 | 2.6 | 12 | 0.3 | | | |
| 8 | D2 0530 | — / 0615 / 0625 | 140 | 4.2 | 104 | 24 | 11 | 0.7 | 124 | 9.1 | 2.0 | 3.0 | 12 | 0.2 | | | |

Normal ranges: Na 136-145, K 3.5-5.1, Cl 98-107, CO2 22-29, BUN 7-20, Cr 0.6-1.1 (female), glucose 70-99 fasting, Ca 8.6-10.3, Mg 1.8-2.4, phos 2.5-4.5, BHB under 0.6, venous pH 7.31-7.41, venous pCO2 41-51.

Set 5 is drawn by venipuncture from the right hand, below the right forearm IV, with the third rider (1705-1805) paused 2 minutes per policy (the 2-minute pause is not counted; rider times and volumes are kept).

**Math for every set**

| Set | Anion gap | Corrected Na | Effective osm | Calc osm | H-H: HCO3 / (0.03 x pCO2) -> pH | Winter's range | pCO2 in range? | eGFR |
|---|---|---|---|---|---|---|---|---|
| 1 | 130-93-7 = **30** | 130 + 1.6 x 4.62 = **137.4** | 260 + 31.2 = **291** | 291.2 + 8.6 = **300** | 6.2 / 0.57 = 10.88; log 1.037 -> **7.14** | 1.5 x 6.2 + 8 = 17.3 -> 15.3-19.3 | 19 yes | 60 (estimate, AKI) |
| 2 | 133-100-10 = **23** | 133 + 1.6 x 2.52 = **137.0** | 266 + 19.6 = **286** | 285.6 + 7.5 = **293** | 9.2 / 0.66 = 13.94; log 1.144 -> **7.24** | 21.8 -> 19.8-23.8 | 22 yes | 73 (estimate) |
| 3 | 136-104-13 = **19** | 136 + 1.6 x 0.98 = **137.6** | 272 + 11.0 = **283** | 283.0 + 6.1 = **289** | 12.2 / 0.78 = 15.64; log 1.194 -> **7.29** | 26.3 -> 24.3-28.3 | 26 yes | 93 |
| 4 | 137-106-14 = **17** | 137 + 1.6 x 0.72 = **138.2** | 274 + 9.6 = **284** | 283.6 + 4.6 = **288** | 13.4 / 0.81 = 16.54; log 1.219 -> **7.32** | 1.5 x 13.4 + 8 = 28.1 -> 26.1-30.1 | 27 yes | 107 |
| 5 | 138-106-18 = **14** | 138 + 1.6 x 0.70 = **139.1** | 276 + 9.4 = **285** | 285.4 + 3.9 = **289** | 17.2 / 0.99 = 17.37; log 1.240 -> **7.34** | 33.8 -> 31.8-35.8 | 33 yes | 107 |
| 6 | 139-106-20 = **13** | 139 + 1.6 x 0.52 = **139.8** | 278 + 8.4 = **286** | 286.4 + 3.6 = **290** | | | | 125 |
| 7 | 139-105-22 = **12** | glucose under 100: **139** (no correction) | 278 + 4.7 = **283** | 282.7 + 3.6 = **286** | | | | 125 |
| 8 | 140-104-24 = **12** | 140 + 1.6 x 0.24 = **140.4** | 280 + 6.9 = **287** | 286.9 + 3.9 = **291** | | | | 125 |

eGFR check, CKD-EPI 2021, female (kappa 0.7, alpha -0.241, x 1.012), age 22 (0.9938^22 = 0.872):
- Cr 1.3: 142 x (1.857)^-1.2 x 0.872 x 1.012 = 142 x 0.476 x 0.872 x 1.012 = **60**.
- Cr 1.1: 142 x 0.581 x 0.872 x 1.012 = **73**.
- Cr 0.9: 142 x 0.740 x 0.872 x 1.012 = **93**.
- Cr 0.8: 142 x 0.852 x 0.872 x 1.012 = **107**.
- Cr 0.7: 142 x 1 x 0.872 x 1.012 = **125**.

Notes on the numbers:
- **Delta-delta at arrival:** gap up 30 - 12 = 18; bicarbonate down 24 - 7 = 17. Ratio 1.06 = pure anion-gap acidosis.
- **Set 4:** gap up only 5 (17) but CO2 down 10 (14), with Cl 106 (from 93). A small **non-gap (hyperchloremic) part from the saline** has appeared. It is smaller than with all-0.9% fluids because she switched to 0.45% at 0700. It is a teaching point only; no action.
- **Sodium:** measured 130 is low because high glucose pulls water into the blood (dilution). Corrected 137.4 is normal. Measured Na rises 130 -> 140 as glucose falls; **corrected Na stays 137.0-140.4 the whole stay** (no free-water problem, no cerebral edema risk signal).
- **Effective osmolality 291** at arrival: under 300, so there is no hyperosmolar (HHS) overlap.
- **Potassium:** 5.8 on arrival with a large **total-body deficit** (3-5 mEq/kg = about 165-275 mEq).
  - Acidosis and no insulin shift K out of the cells (peaked T waves on ECG 1). Insulin, fluids and the correction of acidosis move it back in: **5.8 -> 4.7 -> 4.1 -> 3.6** in 12 h, with urine losses as well.
  - **3.6 is the lowest value: 3.5 or more = keep the insulin running** under the 2024 consensus (hold under 3.5), the 2009 algorithm and textbook (hold under 3.3) and this protocol.
  - After 40 mEq of riders it is 3.9. With eating and 20 mEq PO it reaches 4.0-4.2.
- **Creatinine 1.3:** no baseline is on file; the estimated baseline for her size is about 0.7. Prerenal from volume loss (BUN/Cr = 24 / 1.3 = 18). Normal (0.7) by D1 2200. eGFR 60 -> 125 (early values are estimates only).
- **BHB fall:** 6.8 -> 5.4 (0.58/h over the first 2.4 h of insulin) -> 3.3 (0.53/h) -> 1.3 (0.50/h) -> 0.5. This meets the expected fall of about 0.5 mmol/L per hour, so there is no need to raise the insulin rate.
- **Magnesium 1.7 at 1330** (under 1.8) is replaced with K falling. **Phosphate** 5.9 -> 1.8 (shifts into cells with insulin). Not replaced, because it is not under 1.0.
- **Set 7 (0200) glucose 84** (result 0245) is a cue that the glucose is drifting low before the 0300 low (stop 6).
- **No rebound ketosis after the transition:** BHB 0.3 at 2200 and 0200, 0.2 at 0530. Gap 12-13.

**Other labs (all charted with collected and result times)**
- **CBC**
  - D1 0150 (result 0215): WBC **16.4** (stress and ketosis, not infection; bands 0%), Hgb 15.8, Hct 47.5 (concentrated), Plt 318, neutrophils 86%, lymphocytes 9%.
  - D2 0530 (result 0600): WBC 8.2, Hgb 12.6, Hct 37.8, Plt 246, neutrophils 62%, lymphocytes 29%. Hgb falls with rehydration.
- **Lactate:** 0150 **2.1** (result 0205); 0530 1.2 (result 0545).
- **Lipase** 0150: **48 U/L** (normal 13-60; result 0235). Normal: the belly pain is from DKA itself, and it improves as the acidosis clears.
- **Serum hCG** 0150: **negative, under 2 mIU/mL** (result 0235). Checked for any woman of childbearing age.
- **Urinalysis** 0230 (result 0300): SG 1.032, glucose 4+ (1,000 or more), **ketones large (80 or more)**, protein trace, blood negative, leukocyte esterase negative, nitrite negative, WBC 0-2, no bacteria. No infection as a trigger.
- **HbA1c** 0150: **11.6%** (result D1 **1000**). eAG = 28.7 x 11.6 - 46.7 = 332.9 - 46.7 = **286 mg/dL**: high glucose for weeks to months (A1c reflects about 3 months), likely before her symptoms started.
- **New-diagnosis labs** (drawn D1 0530, ordered 0500 by Rasmussen):
  - **TSH 1.8 mIU/L** (0.4-4.0; result D1 **1130**). Normal thyroid; autoimmune thyroid disease is screened at type 1 diagnosis. Drawn while ill; repeat after recovery if abnormal.
  - **tTG-IgA under 1.0 U/mL (negative, under 4) with total IgA 165 mg/dL (normal 70-400)** (reference lab, next-day; result D2 **0500**). Celiac screen negative; total IgA confirms the test is valid.
  - **C-peptide 0.3 ng/mL** (normal 0.8-3.1; drawn when glucose was 352; send-out; result D2 **0600**). It is low while glucose is very high, so the pancreas is making very little insulin. Insulin given by IV does not contain C-peptide, so the test still measures her own insulin. Acidosis and very high glucose can lower C-peptide at diagnosis, so a borderline value would be repeated; 0.3 with glucose 352 fits type 1. Reference lab, next-day result.
  - **GAD65, IA-2 and ZnT8 autoantibodies:** send-out; **"pending" through the whole course.** Instructor only (not in the chart): the results on Fri 02/12 show **GAD65 positive (210 IU/mL, reference under 5) and IA-2 positive; ZnT8 negative.** This confirms autoimmune type 1 diabetes (stage 3).
- **ECG 1** D1 0205 (result 0215; read by Aldana):
  - Sinus tachycardia 124, PR 138, QRS 84, QT 296.
  - QTc 426 (Bazett: RR = 60/124 = 0.484 s; sqrt 0.696; 0.296 / 0.696 = **0.426**).
  - **Peaked narrow symmetric T waves V2-V4**; no other changes.
  - Image: `ecg_image.py --rate 124 --pr 0.138 --qrs 0.084 --qt 0.296 --peaked --t-amp 1.4` (name WHITCOMBE, NORA; MRN SIM-40602; 22 F).
  - No second ECG is needed (K never under 3.5 or over 5.5 after arrival). Telemetry shows the T-wave changes.

## 7. Point-of-care glucose (charted up to 0700; said aloud after)

**Charted (ED):** D1 0146 **548**, 0300 498, 0400 442, 0500 384, 0600 330, **0700 274**.

**Aloud by the instructor (NOT charted; the students chart what they check):**

| Stop | Values since the last stop |
|---|---|
| D1 1100 | **0800 222** (under 250: D5W/0.45% NaCl 150 mL/h started 0805 per protocol), 0900 204, 1000 192, **1100 186** |
| D1 1500 | 1200 180, 1300 174, 1400 170, **1500 166** |
| D1 1900 | 1600 162 (Nora's own check with the educator), 1700 168, 1800 170, **1900 168** (before dinner) |
| D1 2300 | 2000 178 (after dinner; ate about 70%), 2100 166 (last hourly; drip off), **2200 148** (bedtime). Walked fast hallway laps 2215-2255; snack offered 2255, declined |
| D2 0300 | **0300 58** (scheduled check; hard to rouse for a moment, then groggy) -> 4 glucose tablets 16 g (0302) -> **0317 66** -> 4 oz juice 15 g (0318) -> **0333 94** -> snack (0335) |
| D2 0700 | 0400 118 (recheck after the low), **0700 122** (fasting). **Weight 0600: 56.2 kg** |

Glucose on D5/0.45% (table range 150-249): 222 -> 204 -> 192 -> 186 -> 180 -> 174 -> 170 -> 166 -> 162 -> 168 -> 170 -> 168 -> 178 -> 166. **No table change was ever needed.**

## 8. Infusion, dextrose and potassium timeline

| Line | Times and rates |
|---|---|
| **Regular insulin** (left forearm, Y-site at the lowest port; pump 1 channel B) | **5.5 units/h D1 0305-2100**; never changed; **off 2100** |
| **Main fluid** (left forearm; pump 1 channel A) | 0.9% NaCl 1,000 mL bolus 0200-0300; 0.9% 500 mL/h 0300-0500; 0.9% 250 mL/h 0500-0700; **0.45% NaCl 250 mL/h 0700-0805**; **D5W/0.45% NaCl 150 mL/h 0805-2100**; off 2100 (both IVs saline-locked) |
| **KCl riders 10 mEq/100 mL over 1 h** (right forearm; pump 2, alone) | **0715** (K 4.7); **1030, 1130** (K 4.1); **1505, 1605, 1705, 1805** (K 3.6: 4 back to back, the only run of 4) |
| MgSO4 2 g/50 mL over 2 h | D1 1505-1705 (Mg 1.7), left line Y-site |
| KCl ER 20 mEq PO | D1 2000 (K 3.9; eating; the IV protocol ends with the drip) |

- **Riders:** 7 x 10 mEq = **70 mEq IV**, plus 20 mEq PO = 90 mEq. Never more than one rider at a time, never over 10 mEq/h, never more than 4 in a row. No potassium in any bag.
- **Insulin used:** 0305-2100 = 17.92 h x 5.5 = **98.5 units IV**.
- **Dextrose:** 0805-2100 = 12.92 h x 150 mL/h = 1,938 mL x 5 g/100 mL = **97 g**.

## 9. Intake and output (4-hour blocks, `periodEnd: true`)

Labels: Oral (`po`), IV fluid (`iv` = NaCl/D5 main line), IV med (insulin + riders + MgSO4), Urine, Emesis. Each block's note lists every void. The D2 0700 block note also carries the **daily weight 56.2 kg (0600)**. Ice chips are counted as half their volume.

| Block (ends) | Oral | IV fluid | IV med | **In** | Urine (voids) | Emesis | **Out** |
|---|---|---|---|---|---|---|---|
| ED D1 0300 (from 0140) | 0 | 1,000 (bolus) | 0 | **1,000** | 450 (0230) | 150 (0215) | **600** |
| ED D1 0700 | 0 | 1,500 (0.9%: 500 x 2 h + 250 x 2 h) | 22 (insulin 0305-0700) | **1,522** | 900 (0420 500, 0610 400) | 0 | **900** |
| D1 1100 | 60 (ice chips) | 709 (0.45% 271 + D5/0.45% 438) | 172 (insulin 22 + riders 150) | **941** | 900 (0800 350, 0945 300, 1050 250) | 0 | **900** |
| D1 1500 | 540 | 600 | 172 (22 + 150) | **1,312** | 850 (1150 300, 1330 300, 1450 250) | 0 | **850** |
| D1 1900 | 480 | 600 | 464 (22 + riders 392 + Mg 50) | **1,544** | 700 (1600 250, 1730 250, 1850 200) | 0 | **700** |
| D1 2300 | 360 | 300 (D5/0.45% 1900-2100) | 19 (insulin 11 + rider 8) | **679** | 550 (2030 300, 2240 250) | 0 | **550** |
| D2 0300 | 120 | 0 | 0 | **120** | 300 (0130) | 0 | **300** |
| D2 0700 | 480 | 0 | 0 | **480** | 600 (0420 300, 0640 300) | 0 | **600** |

How the volumes were computed:
- **D1 1100 block:**
  - 0.45% NaCl 0700-0805 = 65 min x 250/60 = 270.8 -> 271.
  - D5/0.45% 0805-1100 = 175 min x 150/60 = 437.5 -> 438.
  - Insulin 4 h x 5.5 = 22.
  - Riders: 0715-0815 (100) + 1030-1100 (50) = 150.
- **D1 1500 block:** riders 1100-1130 (50) + 1130-1230 (100) = 150.
- **D1 1900 block:** riders 1505, 1605, 1705 (300) + 1805-1900 (55 min = 91.7 -> 92) = 392. MgSO4 50. IV med = 22 + 392 + 50 = 464.
- **D1 2300 block:** D5/0.45% 2 h x 150 = 300. Insulin 2 h x 5.5 = 11. Rider remainder 1900-1905 = 8.
- **D2 0700 block:** juice 120 mL (0318), milk 120 mL with crackers and peanut butter (0335), water 240. Glucose tablets carry no volume.

**Urine per hour** in every block is at least 75 mL/h (lowest: D2 0300 block, 300 / 4 = 75), always over 28 mL/h, so riders are allowed. The early urine is an osmotic diuresis (glucose 4+).

**Totals:**
- ED (0140-0700): in **2,522** / out **1,500**.
- D1 day shift (0700-1900): in 941 + 1,312 + 1,544 = **3,797** / out 900 + 850 + 700 = **2,450**.
- D1 night (1900-0700): in 679 + 120 + 480 = **1,279** / out 550 + 300 + 600 = **1,450**.
- Arrival to D2 0700: in **7,598** / out **5,400** = net **+2,198 mL**.

**Weights:** 55.0 kg (D1 0145, ED bed scale) -> **56.2 kg (D2 0600, I&O daily-weight record)**.
- Check: 55.0 + 2.2 L net - about 1.2 L insensible loss (29 h; about 40 mL/h, high early with Kussmaul breathing) + about 0.2 kg of solid food = **56.2**.
- Her usual weight is 61.0. **Of the 6 kg lost, about 3.5 kg was water and about 2.5 kg was fat and muscle** (no insulin = the body burns fat and protein for fuel). About 1 kg of the water is back by D2 0600; the rest returns by mouth, and the tissue returns over weeks on insulin.

## 10. Orders (who, orderedAt, start, end, stoppedEarly)

Times D1 unless marked D2. "SE" = `stoppedEarly` (the stop time is hidden until it happens). The "Notes" column is design commentary only; chart text says "RN," never "student."

| Order | By | orderedAt | Start | End | Notes |
|---|---|---|---|---|---|
| NPO | Aldana | 0148 | 0148 | 0700 | ED; replaced by the admission NPO order |
| ED labs (VBG, BMP, Mg, phos, BHB, CBC, lactate, lipase, serum hCG, HbA1c, UA), POC glucose, ECG | Aldana | 0148 | 0150 | once | |
| Ondansetron 4 mg IV once | Aldana | 0148 | 0200 | once | given |
| 0.9% NaCl 1,000 mL IV bolus over 1 h | Aldana | 0148 | 0200 | 0300 | given |
| **Regular insulin infusion 100 units/100 mL, 0.1 unit/kg/h = 5.5 units/h (5.5 mL/h), fixed rate, no bolus** (DKA order set) | Aldana | 0245 | 0305 | **SE 2100** | running at 0700; double check Prewitt + Galloway; stopped by the transition order |
| 0.9% NaCl 500 mL/h x 2 h, then 250 mL/h; no potassium (K over 5.0) | Aldana | 0245 | 0300 | **SE 0700** | replaced by 0.45% NaCl at 0700 |
| Repeat VBG, BMP, Mg, phos, BHB, lactate at 0530 | Aldana | 0245 | 0530 | once | |
| Add to 0530 draw: C-peptide, GAD65/IA-2/ZnT8 antibodies, TSH, tTG-IgA with total IgA | Rasmussen | 0500 | 0530 | once | new-diagnosis labs |
| Admit SD-6 step-down, telemetry, Full Code | Rasmussen | 0540 | 0700 | | |
| VS every 1 h while on insulin infusion, then every 4 h | Rasmussen | 0540 | 0700 | | |
| Neuro checks every 2 h while on insulin infusion | Rasmussen | 0540 | 0700 | SE 2100 | |
| Strict I&O; daily weight 0600 (I&O record) | Rasmussen | 0540 | 0700 | | |
| POC glucose every 1 h on insulin infusion (every 30 min if falling more than 75 in 1 h or under 100) | Rasmussen | 0540 | 0700 | SE 2100 | |
| **DKA protocol (adult, fixed rate):** insulin rules, dextrose table, hypoglycemia rule, peripheral potassium table, bicarbonate only for pH under 7.0 (section 5) | Rasmussen | 0540 | 0700 | SE 2100 | |
| **0.45% NaCl 250 mL/h** at 0700 (corrected Na normal, 137) | Rasmussen | 0540 | 0700 | SE 0805 | due 0700 (students change the bag) |
| **D5W/0.45% NaCl 150 mL/h when glucose under 250**, per dextrose table (D10W/0.45% NaCl per table) | Rasmussen | 0540 | 0700 | SE 2100 | due 0800 (POC 222); started 0805 |
| **KCl 10 mEq/100 mL IV rider over 1 h, PRN per protocol table** (one at a time, max 4 in a row, right forearm IV, urine 28 mL/h or more) | Rasmussen | 0540 | 0700 | SE 2100 | |
| Dextrose 50% 12.5-25 g IV PRN per protocol (glucose under 70 on the infusion) | Rasmussen | 0540 | 0700 | SE 2100 | not used |
| VBG, BMP, Mg, phos, BHB at 0930, 1330, 1730 | Rasmussen | 0540 | 0930 | 1730 | |
| Ondansetron 4 mg IV every 6 h PRN nausea | Rasmussen | 0540 | 0700 | | not needed on the unit |
| Acetaminophen 650 mg PO every 6 h PRN pain or headache (may take with sips) | Rasmussen | 0540 | 0700 | | optional use |
| **NPO except ice chips. RN may discontinue when there has been no vomiting for at least 4 h, nausea is controlled, bowel sounds are present and the patient asks to drink (DKA order set, diet advancement); then sugar-free clear liquids.** | Rasmussen | 0540 | 0700 | none | **THE ORDER TO DISCONTINUE** (stop 2, D1 1100). Criteria met: last emesis 0215, no nausea since about 0900, bowel sounds active, asking to drink. Reason: "criteria met per DKA diet advancement protocol." |
| Diet: sugar-free clear liquids | Petrakis | 1105 | 1105 | SE 1900 | entered after the RN reports the NPO discontinuation; only one diet order shows at a time |
| Activity: up with assist (IV poles); fall precautions; bed alarm at night | Rasmussen | 0540 | 0700 | SE 2100 | |
| No pharmacologic VTE prophylaxis: age 22, walking, no clot-risk factor (levonorgestrel IUD is progestin-only, not an estrogen risk); ambulate | Rasmussen | 0540 | 0700 | | documented rationale |
| Hold home ibuprofen (kidney injury, vomiting) | Rasmussen | 0540 | 0700 | | |
| Consults: endocrinology, diabetes educator (CDCES), dietitian, pharmacy, social work | Rasmussen | 0540 | 0700 | | |
| **PLANTED ERROR 1: Sodium bicarbonate 100 mEq in 400 mL sterile water IV over 2 h, start 0700, "for severe acidosis, bicarbonate 7; pharmacy to compound; hang on arrival to step-down"** | **Rasmussen** | **0540** | 0700 | **SE 0715** | **Safety catch at D1 0700.** Bicarbonate is given only for pH under 7.0 (2024; this order set). Her pH was 7.14 at 0150 and **7.24 at 0530** (resulted 0545). Bicarbonate would also drive K into the cells (K 4.7 and falling). He judged by the bicarbonate number, not the pH. Discontinued by Petrakis after the RN call. |
| MgSO4 2 g/50 mL IV over 2 h (Mg 1.7) | Petrakis | 1420 | 1500 | 1700 | due 1500; runs 1505-1705 |
| **PLANTED ERROR 2: Potassium chloride 20 mEq in 100 mL IV over 1 h, every 1 h x 2 doses, start 1500 ("faster replacement")** | **Petrakis** | **1420** | 1500 | **SE 1510** | **Safety catch at D1 1500.** 20 mEq/100 mL = 200 mEq/L at **20 mEq/h**. That is a central-line rate and strength, through a peripheral IV only (limit 10 mEq/h; 20 mEq/L in bags). Discontinued after the RN call; protocol riders 10 mEq/h x 4 instead (1505-1905). Insulin continues (K 3.6). |
| **Transition (endocrinology):** **insulin glargine 14 units SubQ at 1900, then daily at 1900**; **stop the insulin infusion and D5W/0.45% NaCl at 2100 (2 h after glargine)**; saline-lock both IVs; **insulin lispro 4 units SubQ with each meal**, given 0-15 min before eating (hold if NPO), **+ correction 1 unit per 50 mg/dL over 150 before meals** (round to the nearest whole unit); bedtime and 0300 correction only if over 250 | Navarro | 1840 | 1900 | | first lispro with the late dinner tray 1915 |
| POC glucose before meals, bedtime (2200) and 0300 | Navarro | 1840 | 2100 | | |
| Hypoglycemia protocol (SubQ insulin): alert and able to swallow -> 15 g fast carbohydrate (4 oz juice or 4 glucose tablets), recheck in 15 min, repeat until 70 or more, then a snack with carbohydrate and protein if the next meal is more than 1 h away; not alert or NPO -> D50 25 g IV or glucagon 1 mg IM; call | Navarro | 1840 | 2100 | | used D2 0300 |
| Consistent-carbohydrate diet, 45-60 g per meal | Navarro | 1840 | 1900 | | late dinner tray 1915; the clear liquids end at 1900 |
| BMP, Mg, phos, BHB at 2200 and D2 0200 (check for rebound ketosis after the drip), D2 0530 with CBC | Navarro | 1840 | 2200 | D2 0530 | |
| KCl ER 20 mEq PO once at 2000 (K 3.9; potassium protocol ends with the drip) | Navarro | 1840 | 2000 | once | |
| Activity: up ad lib once the drip is off; bed alarm at night per fall score | Navarro | 1840 | 2100 | | |
| Diabetes survival-skills education (insulin pens, meter, hypoglycemia and glucagon, sick-day rules with ketone testing, medical ID); include mother | Navarro | 1840 | 1900 | | |
| POC glucose once at 0400 (after the low) | Rasmussen | D2 0320 | D2 0400 | once | |

**Not ordered on purpose:** VTE drug (rationale order above), insulin bolus, bicarbonate (except the error), phosphate, a second ECG, oxygen, a urinary catheter.

**Planted order errors: exactly 2**, by 2 different authors:
1. D1 0700 bicarbonate (Rasmussen): **acid-base and indication.**
2. D1 1500 KCl 20 mEq/h peripheral (Petrakis): **the instructor's peripheral potassium rule.**

Everything else in the chart is correct, including the transition order, so the students learn what a good transition looks like.

## 11. MAR (doses after D1 0700 are all `due`)

ED `given`: ondansetron 4 mg IV 0200; 0.9% NaCl bolus 1,000 mL 0200; 0.9% NaCl 500 mL/h 0300 -> 250 mL/h 0500 (**0700 Running**); regular insulin 5.5 units/h 0305 (**0700 Running**).

Due for the students:
- **D1 0700:** 0.45% NaCl 250 mL/h (replaces the 0.9%); **sodium bicarbonate 100 mEq (planted; do not give; question it; discontinued 0715)**.
- **D1 0715:** KCl rider 10 mEq (K 4.7).
- **D1 0800 (0805):** D5W/0.45% NaCl 150 mL/h (POC 222).
- **D1 1030, 1130:** KCl riders (K 4.1).
- **D1 1500:** **KCl 20 mEq IV over 1 h (planted; do not give; discontinued 1510)**; MgSO4 2 g IV (1505).
- **D1 1505, 1605, 1705, 1805:** KCl riders (K 3.6).
- **D1 1900:** **insulin glargine 14 units SubQ** (Nora self-injects with RN coaching; independent double check).
- **D1 1915:** **insulin lispro 4 units SubQ** with dinner (glucose 168: correction (168 - 150)/50 = 0.36 -> 0 units).
- **D1 2000:** KCl ER 20 mEq PO.
- **D1 2100:** **stop insulin infusion and D5W/0.45% NaCl** (2 h after glargine); saline-lock both IVs.
- **D2 0302:** glucose tablets 4 x 4 g = 16 g PO, chewed, per hypoglycemia protocol (PRN).
- **D2 0318:** apple juice 4 oz (15 g) PO, second round (glucose 66).
- PRN not given: ondansetron, acetaminophen, D50.

**After the course (instructor only, not in the chart):**
- D2 0730: breakfast lispro 4 units (glucose 122, no correction).
- D2 0800: Navarro lowers glargine to **12 units** at 1900 (about a 15% cut after the low; first night of basal, exercise and new-onset "honeymoon" insulin sensitivity). He adds exercise guidance: check glucose before and after a run, carry 15 g, take a 15-30 g snack before exercise if under 150, and check at 0300 after an evening workout.
- D2 1900: Nora gives her own 12 units before she leaves.

## 12. Devices

- **PIV 18 g left forearm** (D1 0150, ED): main fluids and insulin (Y-site at the lowest port), MgSO4. Saline lock from D1 2100. Kept through the course.
- **PIV 20 g right forearm** (D1 0155, ED): KCl riders only, from 0715. Saline lock between riders and from D1 1905. Kept through the course (removed before discharge D2).
- **Telemetry, 5-lead** (D1 0700 to the end of the course).
- Bed alarm: on from 0700 (Morse 45). Off by day once steady. On at night per the fall score.
- No urinary catheter, no oxygen, no SCDs (walking).
- Inpatient insulin pens (single-patient, labeled with her name) from pharmacy at 1850: glargine pen and lispro pen. Different label colors. Pen needles. Sharps box.

## 13. Notes (time-gated; each quotes only results and events already in the chart)

| Time | Author | Type | One-line summary | Results it quotes (result time) |
|---|---|---|---|---|
| D1 0150 | M. Prewitt, RN | ED triage | 22 F, no known diabetes; 6 weeks of thirst, urinating, hunger, 6 kg weight loss, tiredness, blurry vision; vomiting and belly pain since Sunday; deep fast breathing, fruity breath; POC 548. | POC 0146 |
| D1 0215 | K. Aldana, MD | Cardiology (ECG 1, image) | Sinus tachycardia 124, peaked T waves V2-V4, QTc 426; hyperkalemia suspected; BMP pending. | ECG only |
| D1 0430 | K. Aldana, MD | ED provider | New-onset diabetes in moderate-to-severe DKA (pH 7.14, CO2 7, gap 30, BHB 6.8, glucose 562); K 5.8 known before insulin; hCG negative, lipase normal, UA no infection; 1 L bolus, 0.9% NaCl 500 mL/h, insulin 5.5 units/h from 0305, no potassium yet (K over 5.0); admit step-down. | set 1 (0205-0245), UA 0300, POC 0400 |
| D1 0540 | D. Rasmussen, MD | Admitting H&P | Full history (section 3); corrected Na 137.4, effective osmolality 291 (no HHS); WBC 16.4 from stress; new-onset type 1 likely; plan: fixed-rate protocol, 0.45% NaCl at 0700, D5/0.45% under 250, peripheral potassium riders per table, labs every 4 h, NPO with RN diet advancement, new-diagnosis labs added; "sodium bicarbonate for bicarbonate 7"; no VTE drug (age 22, walking); consults. | set 1, POC through 0500 (384) |
| D1 0630 | M. Prewitt, RN | ED nursing | ED summary: about 2.4 L saline in by 0630; urine 1,350, emesis 150; insulin 5.5 units/h; two peripheral IVs; roommate at bedside; mother called. | |
| D1 0645 | M. Prewitt, RN | ED-to-unit handoff (SBAR) | 0530 labs: K 4.7, pH 7.24, CO2 10, gap 23, BHB 5.4; glucose 330 at 0600; insulin 5.5; NaCl 250; 0.45% and a protocol potassium rider due on the unit. | set 2 (0545-0625), POC 0600 |
| D1 0730 | A. Petrakis, MD | Hospitalist addendum | RN called at 0700 about the sodium bicarbonate order: pH 7.24 (and 7.14 at arrival) is above 7.0, so bicarbonate is not indicated; it would also lower K. Order discontinued 0715. Continue protocol. | set 2 |
| D1 0900 | Y. Kassab, PharmD | Pharmacy | Med history: no home medicines except a levonorgestrel IUD and PRN ibuprofen (held); drinks 4-5 large sports drinks a day (about 34 g sugar each); amoxicillin allergy; dosing weight 55.0 kg; insulin infusion and peripheral potassium limits reviewed; insurance through mother's plan, pens on formulary. | |
| D1 1030 | A. Petrakis, MD | Hospitalist progress | Improving. Glucose 222 at 0800, so dextrose was started per protocol and insulin continues at 5.5 (gap 19, BHB 3.3: still in DKA). K 4.1, 2 riders per table. A1c 11.6% (eAG 286). Nausea gone. | set 3 (0945-1025), A1c 1000, POC 0800 |
| D1 1230 | C. Navarro, MD | Endocrinology consult | New-onset diabetes, almost certainly autoimmune type 1 (young, lean, weight loss, ketoacidosis, A1c 11.6%); TSH 1.8 normal; C-peptide, islet antibodies and celiac screen pending; plan transition when resolved: weight-based 0.5 unit/kg/day = glargine 14 + lispro 4 with meals + sensitive correction; glargine at least 2 h before the drip stops (2024: 2-4 h); will meet Nora and her mother this afternoon; plan a glucose sensor at the first clinic visit. | A1c, TSH 1130, set 3 |
| D1 1445 | A. Petrakis, MD | Hospitalist progress | 1330 labs: K 3.6, Mg 1.7, phos 1.8 (not replaced), gap 17, pH 7.32 but BHB 1.3, so not resolved; plan "KCl 20 mEq IV over 1 h x 2 for faster replacement" and MgSO4 2 g; insulin continues. | set 4 (1345-1425) |
| D1 1520 | A. Petrakis, MD | Hospitalist addendum | RN called at 1500: peripheral IV only, maximum 10 mEq/h; KCl 20 mEq/h order discontinued; protocol riders 10 mEq/100 mL, one at a time, 4 in a row from 1505; MgSO4 running; insulin continues (K 3.6 is 3.5 or more); recheck with the 1730 labs. | set 4 |
| D1 1530 | R. Lowell, RD | Dietitian | Clear liquids tolerated. Basics: carbohydrate foods, plate method; sugar-sweetened drinks raise glucose fast (her sports drinks); 15 g fast carbohydrate for lows (4 oz juice, 4 glucose tablets); carbohydrate counting at the clinic later. | |
| D1 1545 | V. Pemberton, RN CM | Case management | Insurance via mother's plan; prescriptions to the hospital outpatient pharmacy for bedside delivery before discharge; endocrinology clinic follow-up within 1 week; mother staying with her for a week. | |
| D1 1615 | T. Quinlan, LCSW | Social work | Coping with a new chronic diagnosis; mother present since 1300; with Nora's consent, the dean of students office will tell professors she is in the hospital; campus disability services for accommodations (glucose checks and snacks during exams); campus counseling; screen for diabetes distress at follow-up. | |
| D1 1640 | E. Thornbury, RN, CDCES | Diabetes educator (session 1) | Met Nora and her mother; Nora checked her own glucose (162 at 1600) with a teaching meter; explained type 1 (her immune system stopped her pancreas making insulin; not caused by sports drinks or anything she did); tearful, overwhelmed; short session; plan: watch the first glargine tonight, survival skills tomorrow morning with her mother. | POC 1600 (aloud value) |
| D1 1745 | C. Navarro, MD | Endocrinology | Diagnosis talk at 1700 with Nora and her mother: type 1 diabetes, lifelong insulin; a "honeymoon" may lower insulin needs for a while; she can run, study, drive and later plan a pregnancy (A1c goal first; IUD in place); antibodies pending. Transition when the 1730 labs show resolution. | set 4 (latest back) |
| D1 1840 | C. Navarro, MD | Endocrinology transition | 1730 labs: BHB 0.5, pH 7.34, CO2 18, gap 14: **DKA resolved** (about 14.5 h of insulin). Glargine 14 units at 1900; insulin infusion and D5/0.45% off at 2100 (2 h overlap); lispro 4 units with the late dinner; K 3.9: KCl ER 20 mEq PO; labs at 2200 and 0200 to check for rebound. | set 5 (1745-1825) |
| D2 0345 | D. Rasmussen, MD | Night event | Called 0305: glucose 58 at the 0300 check, hard to rouse briefly, then oriented and able to swallow; 4 glucose tablets -> 66 at 0317 -> 4 oz juice -> 94 at 0333 -> crackers, peanut butter, milk; 0200 lab glucose 84, BHB 0.3 (no rebound). Cause: 40 min of brisk walking after the first glargine dose, early honeymoon insulin sensitivity, snack declined; not the dinner lispro. Recheck at 0400; endocrinology to review doses and exercise plan in the morning. | set 7 (0245-0255), POC 0300/0317/0333 |
| D2 0645 | D. Rasmussen, MD | Night hospitalist progress | 0530 labs: CO2 24, gap 12, BHB 0.2, K 4.2; C-peptide 0.3 (low) and celiac screen negative; antibodies pending; glucose 118 at 0400; weight 56.2 kg. Possible discharge this evening if: no further low, eating, survival-skills teach-back with her mother, supplies in hand, follow-up booked; mother to check glucose at 0300 the first night at home; diabetes team phone check Wednesday morning. | set 8 (0615-0625), C-peptide 0600, tTG 0500 |

No note mentions the NPO order after 1100, so the chart does not give away the discontinuation.

## 14. Sticky notes (time-gated)
- D1 0700: "Peripheral potassium: KCl 10 mEq/100 mL riders over 1 h, one at a time, max 4 in a row; no potassium in bags; never over 10 mEq/h total."
- D1 0700: "DKA protocol: insulin 5.5 units/h fixed; D5/0.45% NaCl 150 mL/h when glucose under 250."
- D1 1300: "Mother Julia at bedside (emergency contact). Nora wants her mom included in all teaching."
- D1 1840: "Transition: glargine 1900, drip and D5 off 2100 (2-hour overlap). POC before meals, 2200, 0300."

## 15. Problems list
1. Diabetic ketoacidosis, moderate-to-severe (resolved D1 1730).
2. Type 1 diabetes, new onset (autoimmune likely; islet antibodies pending; C-peptide low).
3. Hypovolemia / dehydration from osmotic diuresis and vomiting.
4. Acute kidney injury, prerenal (resolved D1 2200).
5. Hyperkalemia at arrival (shift), then low-normal potassium on insulin (K 3.6 D1 1415).
6. Hypomagnesemia, mild (D1 1415, replaced).
7. Hypophosphatemia, mild (not replaced).
8. Hypoglycemia on subcutaneous insulin (D2 0300).
9. Knowledge deficit: new diagnosis (survival skills).
10. Anxiety and grief with a new chronic illness.
11. Unintended weight loss (6 kg).

## 16. Textbook (Ignatavicius 11th ed.) vs the 2024 consensus: notes for the instructor
- **Potassium and insulin (order text uses the 2024 threshold, under 3.5):** the textbook (from the 2009 ADA algorithm) holds insulin when K is under 3.3. The 2024 consensus raised this to under 3.5 (verify against the full text). This design never reaches either value (lowest 3.6), so there is no conflict in class. The Quick Check at stop 3 accepts "continue insulin" under both.
- **Resolution:**
  - Older criteria: glucose under 200 plus 2 of (HCO3 15 or more, pH over 7.3, gap 12 or less).
  - 2024: BHB under 0.6 plus pH 7.3 or more or HCO3 18 or more; glucose is not a criterion.
  - At 1730 Nora meets both (glucose 170, HCO3 18, pH 7.34, gap 14, BHB 0.5), so either source passes. At 1330 neither definition is met (2009: 1 of 3; 2024: BHB 1.3).
- **Overlap:** older sources say 1-2 h. 2024 says 2-4 h. This design uses exactly 2 h.
- **Dextrose:** 2009 (and probably the textbook) adds D5/0.45% at glucose 200 (and lowers insulin to 0.02-0.05 unit/kg/h). 2024: under 250. Nora's glucose crosses both by 0800-0900 (222 at 0800, 192 at 1000), so the class answer does not change.
- **Bicarbonate:** 2009: pH under 7.0 (50 mmol at 6.9-7.0; 100 mmol in 400 mL sterile water with 20 mEq KCl over 2 h only under 6.9). 2024: under 7.0. Nora's lowest is 7.14: no bicarbonate under any source. The planted order copies the 2009 under-6.9 regimen (without the KCl).
- **Peripheral potassium table:** this hospital's table (10 mEq per 4 h at K 4.5-5.0, 20 at 4.0-4.4) is conservative; the consensus amount per litre of fluid would be about 5 mEq/h. It explains the slow fall to 3.6.
- **0.45% saline after the first liters when the corrected Na is normal:** classic ADA teaching, still used. The 2024 report favors balanced crystalloids as an option. This unit uses saline because of the peripheral potassium rule (lactated Ringer's carries 4 mEq/L K).

---

## 17. Checkpoint stories (each stop: big idea, situation, new labs, monitor, aloud, actions, assessment, Quick Check, VR, catch)

Monitor rhythm settings: normal T = tAmp 0.3; slightly tall = 0.4; low-normal = 0.25, no U wave (U waves are a feature of K under about 3.0). PR 140-142, QRS 84. Room air at every stop.

### Stop 1. D1 0700: arrival from the ED, "fluids first"
- **Big idea:** **Recognize the cues of DKA and act on the newest results.** The deep, fast breathing is the lungs blowing off acid (Kussmaul). The fruity breath is acetone. The dry mouth, tenting skin and fast heart are dehydration from weeks of osmotic diuresis; fluids come first. The newest gas (pH 7.24) and K (4.7) drive the actions: no bicarbonate, a rider due. (The 0.9% -> 0.45% reasoning can move to the debrief if time is short.)
- **Clinical judgment step:** **Recognize cues** (and analyze them: the newest gas and K, not the oldest).
- **Situation:**
  - On the unit at 0700. Insulin 5.5 units/h and 0.9% NaCl 250 mL/h running.
  - Glucose 0700 **274**.
  - Newest labs (0530): K 4.7, pH 7.24, CO2 10, gap 23, BHB 5.4.
  - Orders due now: **0.45% NaCl 250 mL/h**, **KCl rider (K 4.7)**, and the **sodium bicarbonate order (planted error)**.
  - Kendall leaves for class at 0730; Julia is driving in.
- **New labs:** ED sets 1 and 2 (section 6), CBC, lactate, lipase, hCG negative, UA, ECG 1 (peaked T). Pending: A1c, TSH, C-peptide, antibodies, tTG.
- **Monitor:** HR 106 sinus tachycardia, T slightly tall (tAmp 0.40); BP 110/66; RR 24 deep; SpO2 99% RA; T 98.6 F; pain 4.
- **Aloud:** glucose 0700 274 (also charted). "Next glucose at 0800." Urine 400 mL at 0610.
- **Expected actions:**
  - Independent double check of the insulin infusion: 5.5 units/h = 0.1 x 55.0; 1 unit/mL; 5.5 mL/h; HIGH ALERT label; Y-site at the lowest port.
  - **Change to 0.45% NaCl 250 mL/h** and explain why (corrected Na 137).
  - **Do not give the bicarbonate; call** (SBAR): pH 7.24, not under 7.0; bicarbonate also lowers K.
  - Confirm urine (400 at 0610) and **hang the KCl rider 10 mEq at 0715** in the right forearm IV.
  - Hourly glucose: expect under 250 soon, so have the D5W/0.45% bag ready.
  - Neuro check; fall precautions; mouth care; ice chips only.
- **Provider reply (Petrakis, 0715):** "Agreed. Her pH is 7.24; we only give bicarbonate under 7.0. Discontinue it. Continue the protocol."
- **Assessment (full set, unit baseline):**
  - Neuro: drowsy but wakes to voice, oriented x4, slow to answer, follows commands; pupils equal and reactive; headache mild.
  - Psychosocial: scared, quiet; "Is this diabetes? Nobody in my family has the needle kind." Roommate at the bedside until 0730; mother on the way.
  - Cardiovascular: sinus tachycardia on the monitor; radial pulses 2+ and equal; capillary refill 3 seconds; hands cool; no edema.
  - Respiratory: **deep, fast, regular breathing (Kussmaul)**; **fruity (acetone) breath**; lungs clear; no cough; no distress on room air.
  - GI: nauseated, no vomiting since 0215; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive; NPO except ice chips.
  - GU: voiding large amounts of pale yellow urine in a hat; no burning.
  - Skin and mucous membranes: warm, dry, flushed cheeks; **turgor poor (tenting 3 seconds)**; lips dry and cracked; tongue dry and furrowed; eyes slightly sunken.
  - Musculoskeletal/mobility: weak and tired; unsteady standing; stand-by assist.
  - Pain: crampy belly ache, 4/10.
  - Safety: Morse 45 (secondary diagnosis 15, IV 20, weak gait 10) = high fall risk; bed low and locked; bed alarm on; call light in reach.
  - IV sites: left forearm 18 g, no redness or swelling, NaCl and insulin infusing; right forearm 20 g, saline lock, flushes easily.
  - Endocrine: insulin infusion running; no signs of low glucose; thirsty.
  - Learning/readiness: too tired and nauseated to learn now; asks short questions.
- **Quick Check:**
  1. *Her breathing is deep, fast and regular. What best explains it?* **Answer: the lungs blowing off CO2 to make up for metabolic acidosis (Kussmaul respirations).** Why: the newest gas (0530) pH 7.24 with pCO2 22 sits right on the expected compensation (Winter's 1.5 x 9.2 + 8 = 21.8 +/- 2). Tempting wrong: anxiety or hyperventilation needing a paper bag or a calming technique.
  2. *Her 0530 sodium is 133. Why is the fluid changed from 0.9% to 0.45% NaCl at 0700?* **Answer: the first 2.5 L restored circulation (BP up, HR down, urine flowing), and her corrected sodium is normal, so the rest of the deficit, mostly free water, is replaced with 0.45%.** Why: corrected Na = 133 + 1.6 x 2.52 = 137.0 (0530 set). Tempting wrong: "because her sodium is low (133)." The measured Na is falsely low from the high glucose, and a truly low corrected Na would argue for staying on 0.9%.
  3. *A sodium bicarbonate order is due at 0700. What should the nurse do?* **Answer: hold it and call. Bicarbonate is only for pH under 7.0; her pH is 7.24.** Why: it gives no benefit above 7.0, lowers K and can slow ketone clearance. Tempting wrong: give it because "bicarbonate 7 is severe."
- **VR:**
  - *Looks:* lying with the head of the bed up 30 degrees, curled on her side, knees up, arm over her belly. Thin, pale, flushed cheeks, dark circles. **Deep, fast, regular breaths (24/min) she cannot slow down.** Faint fruity (nail-polish-remover) smell near her face. Cracked lips. Eyes half closed; slow to answer but makes sense. A large empty sports-drink bottle in her bag on the chair.
  - *Says:* "I'm so thirsty... can I please just have water?" / "I've been peeing all the time for weeks. I thought it was all the water I was drinking." / "My stomach hurts and I feel sick." / "Is this diabetes? Like, the needle kind?" / If asked about her weight: "I lost like 13 pounds. I thought it was the gym."
  - *Room:* Left IV pole: **pump 1 channel A "0.9% Sodium Chloride 1,000 mL" at 250 mL/h** (a new "0.45% Sodium Chloride 1,000 mL" bag hanging, ready); **channel B "Regular insulin 100 units/100 mL, 1 unit/mL, HIGH ALERT" at 5.5 mL/h (5.5 units/h)**; left forearm IV with a clear dressing dated 02/08 0150. Right pole: pump 2 with **"Potassium chloride 10 mEq/100 mL"** ready to hang; right forearm saline lock dated 0155. A sodium bicarbonate bag from pharmacy on the counter, unhung. Telemetry box on her chest; bedside monitor. Emesis basin, urine hat in the toilet, glucometer and strips on the counter, ice-chip cup, bed alarm light on. Roommate Kendall in the chair with Nora's phone and backpack.
- **Safety catch:** **planted order error 1: sodium bicarbonate at pH 7.24.** Also: read the newest K (4.7), not the arrival K (5.8), and give the protocol rider.
- **Teaching:** the 3 DKA priorities in order (fluids, insulin with K known, potassium); Kussmaul breathing is compensation, not a lung problem; corrected sodium guides the fluid.

### Stop 2. D1 1100: the dextrose step, and she can drink
- **Big idea:** **Glucose fell under 250, so dextrose is added and the insulin keeps running.** The goal is to clear ketones (close the gap, BHB under 0.6), not to lower glucose. Glucose normalizes hours before the ketoacidosis does.
- **Clinical judgment step:** **Generate solutions / take action** (dextrose up, never insulin off; advance the diet when the criteria are met).
- **Situation:**
  - 0800 glucose 222: D5W/0.45% NaCl 150 mL/h started 0805 per protocol; insulin unchanged at 5.5.
  - 0930 labs: K 4.1, so riders at 1030 (running) and 1130. Gap 19, BHB 3.3: still in DKA.
  - A1c 11.6% (1000). No vomiting since 0215. Nausea gone since about 0900. She is begging to drink.
  - Her mother (leaving after arranging leave and packing for a week) calls from the road: "Her sugar is almost normal, so can they take her off the insulin?"
- **New labs:** set 3 (0930): Na 136, K 4.1, Cl 104, CO2 13, BUN 17, Cr 0.9, glucose 198, Mg 1.9, phos 2.6, gap 19, BHB 3.3, pH 7.29, pCO2 26, HCO3 12.2. HbA1c 11.6%. (TSH comes back at 1130, after this stop.)
- **Monitor:** HR 96 sinus (tAmp 0.30); BP 112/68; RR 20, still a little deep; SpO2 99%; T 98.4; pain 2.
- **Aloud:** glucose 0800 222, 0900 204, 1000 192, 1100 186. Urine 0800 350, 0945 300, 1050 250.
- **Expected actions:**
  - Confirm D5W/0.45% at 150 and insulin at 5.5 (dextrose table: 150-249).
  - **Discontinue the NPO order per the diet-advancement protocol** (Orders > select > Discontinue; reason: no vomiting since 0215, no nausea, bowel sounds active, asking to drink) and report it; Dr. Petrakis enters sugar-free clear liquids at 1105.
  - Rider site check every hour (right forearm).
  - Explain to Nora and her mother why the insulin stays on (gap 19).
  - Neuro check.
- **Assessment changes:**
  - Neuro: awake, alert, oriented, answers quickly; headache gone.
  - Respiratory: breathing slower, still a little deep; fruity breath fainter.
  - GI: no nausea; abdomen soft, mildly tender; **bowel sounds active**; asking to drink.
  - Skin: lips dry; tongue moist; turgor 2 seconds.
  - IV right forearm: KCl rider infusing; mild ache, no redness or swelling.
  - Pain: belly ache 2/10.
  - Psychosocial: more talkative; asks "So is it diabetes for sure?"; worried about her lab class Wednesday.
  - Safety: Morse 45; stand-by assist to the bathroom.
- **Quick Check:**
  1. *At 0800 her glucose is 222. Her gap is still open and BHB 5.4 was the last result. What does the nurse do?* **Answer: change the fluid to D5W/0.45% NaCl at 150 mL/h per protocol and keep the insulin at 5.5 units/h.** Why: insulin is what clears the ketones; the dextrose lets it keep running without a low. Tempting wrong: stop the insulin infusion or switch to sliding-scale insulin "because the sugar is almost normal."
  2. *Fill in: her 0930 anion gap = ___.* **Answer: 136 - 104 - 13 = 19 (normal 8-12), so she is still in DKA.** Why: the gap shows unmeasured ketoacids. Tempting wrong: "glucose 198, so DKA is over."
  3. *Which finding lets the RN discontinue NPO under the protocol?* **Answer: no vomiting for over 4 hours, no nausea, bowel sounds present, and she asks to drink.** Why: these are the order's criteria. Tempting wrong: "glucose under 250."
- **VR:**
  - *Looks:* sitting up, eyes open, more color. Breathing still a bit deep but slower (20/min). Fruity smell faint. Licking dry lips. Phone in hand, texting her mom.
  - *Says:* "Please, can I drink something? Anything." / "Why are you giving me sugar? I thought sugar was the problem." / "My mom says my sugar is almost normal, so can the insulin come off?" / "My arm aches a little where that bag goes in."
  - *Room:* Left pump channel A now **"Dextrose 5% and 0.45% Sodium Chloride 1,000 mL" at 150 mL/h**; channel B insulin 5.5 mL/h. Right pump: **KCl 10 mEq/100 mL at 100 mL/h** into the right forearm IV. NPO sign over the bed. Ice-chip cup empty. At 1100 the tray brings sugar-free gelatin, broth and diet ginger ale (after NPO is stopped).
- **Safety catch:** **the "almost normal glucose" trap: do not stop or lower the insulin; add dextrose.** Order to discontinue: **NPO** (criteria met).
- **Teaching:** glucose and ketones clear at different speeds; why sugar-free clear liquids; sugar-sweetened sports drinks fed the hyperglycemia for weeks.

### Stop 3. D1 1500: potassium falls on insulin
- **Big idea:** **Insulin drives potassium into the cells, so the blood K falls even though her total-body K is low.** K 3.6 is still 3.5 or more, so the insulin continues and potassium goes in **no faster than 10 mEq/h through a peripheral IV**.
- **Clinical judgment step:** **Analyze cues / prioritize hypotheses** (K trend 5.8 -> 4.7 -> 4.1 -> 3.6 on insulin), then **take action** (riders one at a time; question an unsafe order).
- **Situation:**
  - 1330 labs: **K 3.6 (resulted 1415)**, Mg 1.7, phos 1.8, pH 7.32 but BHB 1.3 (not resolved).
  - At 1420 Dr. Petrakis ordered **KCl 20 mEq in 100 mL IV over 1 h x 2, start 1500** (planted error 2) and MgSO4 2 g.
  - Riders 1030 and 1130 were given.
  - Mother **Julia arrived at 1300**.
  - Nora: legs feel heavy, mild calf cramps.
  - Glucose 1500 166.
- **New labs:** set 4 (1330): Na 137, **K 3.6**, Cl 106, **CO2 14**, BUN 13, Cr 0.8, glucose 172, Ca 8.7, **Mg 1.7**, **phos 1.8**, **gap 17**, **BHB 1.3**, **pH 7.32**, pCO2 27, HCO3 13.4. TSH 1.8 (1130).
- **Monitor:** HR 90 sinus; T waves a little lower than this morning, no U waves (tAmp 0.25, uAmp 0); BP 114/70; RR 18; SpO2 99%; T 98.6; pain 1.
- **Aloud:** glucose 1200 180, 1300 174, 1400 170, 1500 166. Urine 1150 300, 1330 300, 1450 250. Oral 540 mL clear liquids.
- **Expected actions:**
  - **Do not hang the 20 mEq/h potassium. Call** (SBAR): peripheral IV only; maximum 10 mEq/h; 20 mEq/100 mL is a central-line strength.
  - Give **4 KCl 10 mEq riders back to back from 1505**, one at a time, on a pump, into the right forearm IV. Check urine first: 1450 void 250 mL (about 190 mL/h since 1330), well over 28 mL/h.
  - **Keep the insulin at 5.5** (K 3.6 is 3.5 or more).
  - MgSO4 2 g over 2 h at 1505 through the left line.
  - Watch the monitor; check the IV site every hour; plan the 1730 draw (right hand below the rider IV, rider paused 2 minutes).
  - Explain the pH 7.32 vs BHB 1.3 finding.
- **Provider reply (Petrakis, 1510):** "You're right, she only has peripheral lines. Discontinue my order. Run the protocol riders, ten an hour, four in a row, and keep the insulin going."
- **Assessment changes:**
  - Neuro: alert, oriented; "my legs feel heavy."
  - Cardiovascular: T waves a little lower than this morning; no U waves; no ectopy; regular rhythm; pulses 2+; capillary refill under 3 seconds.
  - Musculoskeletal: mild calf cramps; grip equal and strong; steady, stand-by assist only for the two IV poles; Morse 35 (gait now normal).
  - GI: tolerating sugar-free clear liquids; no nausea; abdomen soft, nontender.
  - Respiratory: normal depth, regular; faint fruity breath.
  - Skin: mucous membranes moist; turgor normal.
  - IV right forearm: patent, no redness or swelling; ready for riders.
  - Pain: calf cramps, 1/10.
  - Psychosocial: mother at the bedside; Nora relieved and teary when her mother arrived.
- **Quick Check:**
  1. *Why has her K fallen from 5.8 to 3.6 even though she received potassium?* **Answer: insulin (and correcting the acidosis) moves K back into the cells, and she lost K in her urine. Her total-body K was low from the start.** Tempting wrong: lab error or kidney failure.
  2. *The order reads KCl 20 mEq in 100 mL IV over 1 hour. She has peripheral IVs only. What should the nurse do?* **Answer: hold it and call. The peripheral limit is 10 mEq/h; give 10 mEq/100 mL riders over 1 h, one at a time.** Why: fast or concentrated K causes dangerous arrhythmias and burns veins. Tempting wrong: give it "because it's on a pump and diluted in 100 mL."
  3. *K is 3.6 on the insulin infusion. Should the insulin be held?* **Answer: no; continue insulin and replace potassium.** Why: hold only under 3.5 (2024; under 3.3 in older sources); stopping insulin restarts ketone production. Tempting wrong: hold the insulin until K is 4.0.
- **VR:**
  - *Looks:* sitting up, rubbing her calves. Breathing nearly normal. Faint fruity smell. Moist lips. Mother (Julia, in a winter coat with a travel bag) holding her hand.
  - *Says:* "My legs feel heavy, and my calves keep cramping." / "Why do I need more potassium? You just gave me some." / "Is my heart okay? What are those lines on the screen?" / Julia: "Can't you give it all at once so she's done faster?"
  - *Room:* insulin 5.5 mL/h; D5/0.45% 150 mL/h. Right pump: **a new KCl 10 mEq/100 mL rider at 100 mL/h**; three more labeled rider bags on the counter with times (1605, 1705, 1805). **Pharmacy bag "Potassium chloride 20 mEq/100 mL" (unhung) with a sticker "infuse over 1 hour."** MgSO4 2 g/50 mL bag on the left pump channel (secondary, 25 mL/h). Monitor showing slightly lower T waves, no U waves.
- **Safety catch:** **planted order error 2: KCl 20 mEq/h through a peripheral IV.** One rider at a time.
- **Teaching:** never insulin without knowing K (the ED waited for K 5.8 before starting); ECG changes usually appear well below 3.5, so at 3.6 the **trend** (5.8 -> 3.6 in 12 h on insulin) is the cue; magnesium helps K correct (instructor: the calf cramps fit the low Mg and phos as much as the K); "pH over 7.3 is not resolution while BHB is 1.3."

### Stop 4. D1 1900: DKA resolved; the transition with overlap
- **Big idea:** **DKA is resolved by the 2024 criteria (BHB under 0.6 and pH 7.3 or more or HCO3 18 or more), so she moves to SubQ basal-bolus insulin. Glargine goes in at least 2 h before the drip stops** (2024: 2-4 h; here 1900 -> 2100), because IV insulin is gone in minutes and glargine takes hours to start.
- **Clinical judgment step:** **Evaluate outcomes** (resolution criteria met), then **take action** (safe transition).
- **Situation:**
  - 1730 labs: **BHB 0.5 (1825), pH 7.34, CO2 18, gap 14 = resolved.**
  - Navarro's transition order at 1840: glargine 14 units at 1900, drip and D5/0.45% off at 2100, lispro 4 units with the late dinner tray (1915), KCl ER 20 mEq at 2000, consistent-carbohydrate diet.
  - The 4th rider (1805) is finishing.
  - At 1700 Dr. Navarro told Nora and her mother the diagnosis: **type 1 diabetes, lifelong insulin.** Nora has been crying on and off since.
  - Glucose 1900 168.
- **New labs:** set 5 (1730): Na 138, K 3.9, Cl 106, **CO2 18**, BUN 11, Cr 0.8, glucose 170, Mg 2.1, phos 2.0, **gap 14**, **BHB 0.5**, **pH 7.34**, pCO2 33, HCO3 17.2.
- **Monitor:** HR 94 sinus (tAmp 0.28); BP 118/74; RR 18 (crying); SpO2 99%; T 98.4; pain 0.
- **Aloud:** glucose 1600 162, 1700 168, 1800 170, 1900 168. Urine 1600 250, 1730 250, 1850 200. Oral 480.
- **Expected actions:**
  - Show the resolution math (BHB 0.5 under 0.6; pH 7.34 at least 7.3; CO2 18 at least 18).
  - **Glargine 14 units SubQ at 1900:** right pen, right dose; independent double check (high-alert). Coach Nora to give it herself (abdomen, 2 inches from the navel; prime 2 units; hold 10 seconds).
  - **Keep the insulin infusion and the D5/0.45% running until 2100.** Do not stop the drip now.
  - Lispro 4 units when the tray is in front of her (1915). Correction 0 (168 - 150 = 18; 18/50 = 0.36).
  - KCl ER 20 mEq at 2000 (whole, upright, with water).
  - Support her emotionally; include her mother.
  - Handoff to night shift: drip off at 2100, POC at 2200 and 0300.
- **Assessment changes:**
  - Respiratory: normal rate and depth; no fruity breath.
  - GI: appetite lower after the diagnosis talk, but agrees to eat dinner; abdomen soft, nontender.
  - Psychosocial: **tearful; denial and bargaining ("Can't I just fix it with diet like my aunt?"); asks if she caused it**; mother supportive at the bedside.
  - Endocrine: DKA resolved; first SubQ basal insulin given; no signs of low glucose.
  - Learning/readiness: anxious, but agrees to try the injection with coaching; mother watching closely.
  - IV sites: right forearm rider finishing, site normal; left forearm infusing.
  - Cardiovascular: regular rhythm, T waves near normal.
  - Pain: none, 0/10.
- **Quick Check:**
  1. *Which lab set shows DKA resolved: 1330 (pH 7.32, CO2 14, gap 17, BHB 1.3) or 1730 (pH 7.34, CO2 18, gap 14, BHB 0.5)?* **Answer: 1730.** Why: resolution needs BHB under 0.6 plus pH 7.3 or more (or HCO3 18 or more). Under the older rule 1330 also fails: it needs 2 of HCO3 15 or more, pH over 7.3, gap 12 or less, and only the pH is met. Tempting wrong: 1330, "because the pH is over 7.3 and the glucose is under 200."
  2. *Glargine is given at 1900. When may the insulin infusion be stopped?* **Answer: 2100, at least 2 hours later (2024: 2-4 h).** Why: IV insulin is gone in minutes; glargine needs hours to start, so a break in insulin coverage means rebound ketosis. Tempting wrong: right after the glargine injection.
  3. *Fill in: her weight-based starting dose is 0.5 unit/kg/day x 55 kg = ___ units/day; about half is basal = ___ units of glargine.* **Answer: 27.5; about 14.** Tempting wrong: giving the whole daily dose as basal.
- **VR:**
  - *Looks:* sitting up in bed, puffy red eyes, tissues in her lap, holding the glargine pen and staring at it. Breathing normal. No fruity smell. Mother on the bed beside her with an arm around her.
  - *Says:* "So this is forever? Every single day?" / "Did I do this to myself with all those sports drinks?" / "My aunt just takes pills. Why can't I?" / "Okay... show me again. I don't want to do it wrong." / "Why can't you just take the IV out now?"
  - *Room:* insulin 5.5 mL/h; D5/0.45% 150 mL/h; right pump finishing the 4th rider (volume infused 92 of 100 mL). **Two insulin pens with her name: glargine (gray label) and lispro (burgundy label)**, pen needles, alcohol swabs, sharps box. Dinner tray arriving at 1915 (chicken, rice, green beans, milk; carbohydrate counts on the menu). Sticky note on the whiteboard: "Drip off 2100."
- **Safety catch:** **the overlap.** Glargine first, and the drip stays on 2 more hours. Also, two pens that look alike: right insulin, right dose, independent double check.
- **Teaching:** the 2024 resolution criteria; how basal and bolus insulin work; the first self-injection.

### Stop 5. D1 2300: a new diagnosis is a loss
- **Big idea:** **A new chronic diagnosis brings grief, fear and denial. The nurse assesses coping and readiness to learn before teaching, uses therapeutic communication, and includes the support person.** Teaching tonight is short and about safety: how a low feels and to call. The survival skills wait until morning.
- **Clinical judgment step:** **Recognize and analyze cues** (psychosocial: crying, insomnia, catastrophic thinking, denial; plus a physical cue: 40 minutes of fast walking after her first basal dose, with no snack).
- **Situation:**
  - The drip and D5/0.45% stopped at **2100**; both IVs are saline-locked; up ad lib.
  - She ate about **70% of dinner** with the 1915 lispro 4 units.
  - Bedtime glucose **148** at 2200.
  - She could not sleep. She has been looking up "type 1 diabetes life expectancy" on her phone and crying.
  - From **2215 to 2255 she walked fast laps of the hallway** "like a run, to clear my head." Running is how she copes.
  - Back in bed at 2255. A snack was offered and declined: "I'm not hungry, I just want to sleep."
  - Julia is in the recliner.
  - 2200 labs: BHB 0.3 (no rebound), K 4.0.
- **New labs:** set 6 (2200): Na 139, K 4.0, Cl 106, CO2 20, BUN 10, Cr 0.7, glucose 152, Mg 2.0, phos 2.2, gap 13, BHB 0.3.
- **Monitor:** HR 92 sinus (back from walking at 2255); BP 114/72; RR 18; SpO2 98%; T 98.2; pain 0.
- **Aloud:**
  - Glucose 2000 178, 2100 166 (drip off), 2200 148.
  - Urine 2030 300, 2240 250. Oral 360 (dinner fluids and water).
  - "She ate about 70% of dinner. She walked fast laps 2215-2255 and declined a snack at 2255."
- **Expected actions:**
  - Sit down, use open-ended questions, and acknowledge the loss. Correct the misinformation she found online.
  - Do not start the full teaching now.
  - Teach the symptoms of a low and to press the call light.
  - **Offer the snack again** (15 g carbohydrate + protein): exercise lowers glucose for hours, and the first glargine dose is starting to work.
  - Make sure the 0300 check happens.
  - Confirm there is no rebound (BHB 0.3, gap 13).
  - Check both saline locks. Bed alarm per the night fall score. Support her mother's sleep.
  - Sleep aid? **Not first:** non-drug measures first (darken the room, cluster care).
- **Assessment changes:**
  - Psychosocial: **crying, can't sleep; "I'll never be normal again"; "Will I be able to have kids?"; "I don't want people at school to know"**; coping by exercise (hallway laps); mother supportive but anxious.
  - Learning/readiness: **not ready for detailed teaching tonight**; asks to "do it tomorrow with my mom."
  - GI: ate 70% of dinner; no nausea; abdomen soft; declines a snack.
  - IV sites: left forearm and right forearm saline locks, flushed, no redness.
  - Musculoskeletal: walking independently, steady; walked hallway laps 2215-2255.
  - Safety: Morse 35 (diagnosis 15, IV/saline lock 20); bed alarm on at night per policy.
  - Endocrine: off IV insulin since 2100; glargine at 1900; no low symptoms now.
  - Cardiovascular: regular rhythm, normal T waves.
- **Quick Check:**
  1. *Nora says, "I'll never be normal again." What is the best response?*
     - **Answer:** "This is a lot to take in. Tell me what worries you most right now."
     - Why: it acknowledges her feelings and opens the conversation (therapeutic communication).
     - Tempting wrong: "Don't worry, lots of people live normal lives with diabetes" (false reassurance that closes the conversation).
  2. *What is the best teaching plan tonight?*
     - **Answer:** only the safety essentials now (how a low feels, call for help); the full survival skills in the morning when she is rested, with her mother.
     - Why: anxiety and fatigue block learning; readiness comes first.
     - Tempting wrong: finish all the teaching tonight "so she can go home tomorrow."
  3. *Bedtime glucose 148 at 2200. She then walked fast laps for 40 minutes and declined a snack. Best action?*
     - **Answer:** offer a snack with 15 g carbohydrate plus protein, and make sure the 0300 check happens.
     - Why: exercise lowers glucose for hours, and her first basal dose is starting to work.
     - Tempting wrong: "148 is normal, no action."
- **VR:**
  - *Looks:* lying on her side in the dim room, back in bed after her walk. A little flushed, hair damp at the temples, sneakers by the bed. Phone lit up in her hand; red eyes; tissues on the bed. Normal breathing. Mother dozing in the recliner under a blanket.
  - *Says:*
    - "I looked it up... it says people with type 1 die younger."
    - "Will I even be able to have kids?"
    - "I don't want to be the girl with diabetes."
    - "Walking helps. Running is the only thing that clears my head."
    - "Can we do the lessons tomorrow? I can't think right now."
    - If offered a snack: "I'm not hungry, I just want to sleep."
  - *Room:*
    - Lights dim. **No pumps running** (pumps parked; both IVs saline-locked). Telemetry on.
    - Dinner tray, about 70% eaten, on the table. Pens in a labeled bin on the counter.
    - Graham crackers and peanut butter on the bedside table (offered). Glucometer on the counter.
    - Bed alarm light on. Call light clipped to her pillow.
- **Safety catch:** **night-low risk.** First night of basal insulin, 40 minutes of fast exercise after it, and the snack declined. Offer the snack, make sure the 0300 check happens, and teach the call light.
- **Teaching:**
  - Grief with a new diagnosis (the textbook's coping assessment); readiness to learn; include the support person; diabetes distress screening at follow-up.
  - Exercise lowers glucose during the activity and for hours after it.

### Stop 6. D2 0300: the first low, and 15-15 twice
- **Big idea:** **Hypoglycemia on SubQ insulin in a patient who can swallow is treated by mouth with 15 g of fast carbohydrate, rechecked in 15 minutes and repeated until 70 or more, then followed by a snack.** IV dextrose is for a patient who cannot swallow. One round is not always enough; the recheck decides. Her first symptoms are neuroglycopenic (groggy, confused), not shakiness.
- **Clinical judgment step:** **Take action**, then **evaluate outcomes** at each 15-minute recheck.
- **Situation:**
  - At the scheduled **0300 check** she is hard to rouse for a moment. Then she is groggy, irritable, briefly unsure where she is, and sweaty.
  - **POC 58.** Within a minute she is oriented x4, follows commands and can swallow.
  - The 0200 lab glucose was **84** (resulted 0245; nobody acted before the scheduled check).
  - BHB 0.3: no rebound.
  - Mother wakes up frightened.
- **New labs:** set 7 (0200): Na 139, K 4.1, Cl 105, CO2 22, BUN 10, Cr 0.7, **glucose 84**, Mg 2.0, phos 2.6, gap 12, BHB 0.3.
- **Monitor:**
  - 0300 row: HR **108** sinus tachycardia; BP **126/76**; RR 18; SpO2 98%; T 97.9; pain 2 (headache).
  - **Mid row 0335** (after treatment): HR 90, BP 118/72, RR 16.
- **Aloud:**
  - Glucose **0300 58**. After 4 glucose tablets (0302): **0317 66**. After 4 oz juice (0318): **0333 94**.
  - Urine 0130 300. Oral 120 (water 0100).
- **Expected actions:**
  - Keep her in bed and safe. She wants to get up to the bathroom right after the tablets while still shaky; assist her or bring the bedpan or commode.
  - **0302: 4 glucose tablets (16 g), chewed.**
  - **0317 recheck: 66, still under 70, so repeat 15 g: 4 oz (120 mL) apple juice at 0318** (K 4.1 is fine).
  - **0333 recheck: 94**, which is 70 or more, so give a **snack with carbohydrate + protein at 0335** (crackers and peanut butter, milk 120 mL), because breakfast is more than 1 h away.
  - **No insulin correction.** Call the provider (protocol).
  - Recheck at 0400 per the new order.
  - Use the moment to teach: name her symptoms (groggy, confused, irritable, sweaty, headache), and teach the 15-15 rule while she lives it, including "repeat if still under 70."
  - Comfort her mother. Change the damp gown.
- **Provider reply (Rasmussen, called 0305, reply 0320):** "Repeat the 15 grams, snack once she is 70 or more, recheck at 0400, no correction insulin. Endocrinology will adjust the doses in the morning." (Order "POC glucose once at 0400," 0320.)
- **Assessment changes (at 0300, before treatment):**
  - Neuro: **hard to rouse for a moment, then groggy, irritable, briefly unsure where she is; oriented x4 within a minute**; follows commands; speech slow.
  - Skin: **cool, pale, sweaty (diaphoretic)**; gown damp.
  - Cardiovascular: sinus tachycardia, regular; pulses strong.
  - Endocrine: **hypoglycemia (confusion and irritability first, then sweating, hunger, headache)**.
  - Safety: **wants to walk to the bathroom alone while still shaky after the first treatment**; Morse 45 (weak/unsteady gait 10 added); bed alarm on.
  - Pain: headache, 2/10.
  - Psychosocial: frightened ("I didn't even feel it coming"); mother awake and anxious.
  - Flowsheet comment 0335: alert, oriented, skin dry, eating crackers.
- **Quick Check:**
  1. *0300 glucose 58. She was groggy at first and is now oriented and can swallow. What is the nurse's first action?*
     - **Answer:** give 15 g of fast-acting carbohydrate by mouth (4 glucose tablets or 4 oz juice) and recheck in 15 minutes.
     - Why: the 15-15 rule is the fastest safe treatment for a patient who can swallow.
     - Tempting wrong: D50 IV push (that is for a patient who cannot swallow), or "call the provider before treating."
  2. *At 0317 her glucose is 66. What next?*
     - **Answer:** repeat 15 g of fast carbohydrate and recheck in 15 minutes; give a snack once she is 70 or more.
     - Why: 66 is still hypoglycemia, and the snack's fat and protein act too slowly to treat it.
     - Tempting wrong: "she is coming up, give the snack now," or D50 IV.
  3. *Which earlier cue pointed to a coming low?*
     - **Answer:** the 0200 lab glucose of 84 (resulted 0245), after 40 minutes of exercise and a declined snack on the first night of basal insulin.
     - Why: a falling glucose at night after exercise on new basal insulin needs an early check and a snack.
     - Tempting wrong: "the BHB of 0.3."
- **VR:**
  - *Looks:* in bed in the dark, slow to open her eyes, squinting, confused for a moment ("Where...?"), then irritable. Sweaty forehead, pale, damp gown. Breathing a bit fast, not deep. No fruity smell. Mother standing beside her.
  - *Says:*
    - First: "What... leave me alone, I'm sleeping... where am I?"
    - Then: "Oh. The hospital. I feel really weird... foggy."
    - After the tablets: "I need to pee. I can walk, I'm fine." (She is shaky.)
    - After the juice: "Okay... that's better. That was scary. I didn't even feel it coming."
    - "Was it because I walked so much?"
    - "What do I do if this happens at my apartment?"
  - *Room:*
    - Dark. Glucometer reading **58**, then 66, then 94.
    - Glucose tablets (bottle; 4 used), a 4 oz apple juice carton, crackers and peanut butter, milk carton on the bedside table.
    - No pumps running; both saline locks. Telemetry showing sinus tachycardia.
    - A dry gown on the chair. Sneakers by the bed.
- **Safety catch:** **hypoglycemia that needs a second 15 g round** (treat to 70 or more before the snack), plus the **fall risk** of a shaky patient getting up alone at night.
- **Teaching:**
  - Symptoms of a low, including confusion at night.
  - 15-15, repeated until 70 or more; snack after.
  - Exercise lowers glucose for hours: check before and after, eat a snack, never exercise or drive while low.
  - Tell a roommate how to help. Glucagon for when she cannot swallow (teach her mother in the morning).

### Stop 7. D2 0700: survival skills and discharge readiness
- **Big idea:** **She is safe to go home when she, with her mother, can show (teach-back, not "do you understand?") the survival skills:** giving insulin with a pen, checking glucose, treating a low (and glucagon by her mother), sick-day rules (never stop basal; check ketones), and wearing a medical ID. She also needs supplies in hand and a follow-up. The confirmatory labs (low C-peptide; antibodies pending) support type 1.
- **Clinical judgment step:** **Evaluate outcomes** (which discharge criteria are met, and which are still missing).
- **Situation:**
  - Glucose 0400 118; **fasting 0700 122**; BHB 0.2; CO2 24; K 4.2.
  - **C-peptide 0.3 (low; 0600)**; celiac screen negative (0500); antibodies pending.
  - Weight 56.2 kg.
  - She slept 0345-0630. More settled; mother present.
  - Breakfast at 0730.
  - At 0650 she practices her breakfast lispro dose with the RN: she dials 4 units **without the 2-unit priming (safety) shot** and plans to "pull it right out."
  - She also says, "If I'm sick and can't eat, I'll just skip my insulin, right?"
- **New labs:** set 8 (0530): Na 140, K 4.2, Cl 104, CO2 24, BUN 11, Cr 0.7, glucose 124, Mg 2.0, phos 3.0, gap 12, BHB 0.2. CBC: WBC 8.2, Hgb 12.6, Hct 37.8, Plt 246. **C-peptide 0.3 ng/mL.** **tTG-IgA under 1.0 (negative), total IgA 165.** GAD65/IA-2/ZnT8 pending.
- **Monitor:** HR 78 sinus; BP 114/70; RR 14; SpO2 99%; T 98.2; pain 0.
- **Aloud:** glucose 0400 118, 0700 122. Weight 0600 56.2 kg. Urine 0420 300, 0640 300. Oral 480 (juice, milk, water).
- **Expected actions:**
  - **Stop the pen error and re-teach:** new needle; **prime 2 units** ("air shot") until a drop shows; dial 4 units; inject at 90 degrees; **hold 10 seconds**; rotate sites.
  - **Correct the sick-day belief:** never stop basal; check glucose every 2-4 h and **ketones** (blood or urine) every 2-4 h when sick; sugar-free fluids every hour (with carbohydrate if not eating); call for vomiting, ketones moderate or more, or glucose over 300 twice; ED for vomiting with ketones, fast breathing, belly pain.
  - Teach-back of the 15-15 rule (she just lived it).
  - **Medical ID** (bracelet or band, plus a phone lock-screen ID).
  - Driving rule: check before driving; do not drive under 90.
  - Exercise (she is a runner): check before and after a run, carry 15 g, have a snack or adjust insulin per the clinic plan, and check at 0300 after an evening workout.
  - Alcohol: can cause delayed lows; never drink without eating; tell friends.
  - Review the discharge criteria (below).
  - Breakfast lispro 4 units at 0730 with the tray (glucose 122: no correction).
- **Discharge readiness (24 h ends at D2 0700):** **plan: home Tuesday evening, about 1930, with her mother, after she gives her own 1900 glargine** (endocrinology lowers it to 12 units in the morning after the low; instructor-only, after the course).
  - **Criteria:** no further glucose under 70 today; eats at least half of breakfast and lunch with correct lispro; BHB under 0.6; K normal.
  - **Teach-back by 1700:** pen technique, meter, 15-15, glucagon given by her mother, sick-day rules with ketone checks, medical ID.
  - **Supplies in hand from the outpatient pharmacy:** glargine and lispro pens, pen needles, meter, strips, lancets, ketone strips, glucagon, glucose tablets, sharps container.
  - **Follow-up:** endocrinology clinic within 1 week (glucose sensor start); **diabetes team (CDCES or endocrinology) phone check Wednesday morning**; **her mother checks her glucose at 0300 the first night at home** (or a sensor placed before discharge if available); student health.
  - **Mother staying 1 week.**
  - **Already met at 0700:** DKA resolved more than 12 h ago, eating, K and BHB normal, mother present and engaged, follow-up being arranged. **Not yet met:** teach-back (pen technique and sick days failed this morning), supplies, glucagon teaching for her mother, a full day without a low.
- **Assessment changes:**
  - Neuro: alert, oriented, rested.
  - Psychosocial: **calmer, "ready to learn"; asks her mother to "learn everything too"; still does not want a bracelet ("I don't want to advertise it")**.
  - Learning/readiness: engaged; **pen technique: missed the priming shot and the 10-second hold**; sick-day misconception.
  - GI: hungry, abdomen soft, nontender; bowel sounds active.
  - Skin: warm, dry; mucous membranes moist; turgor normal.
  - Respiratory: normal, no odor.
  - Musculoskeletal: steady, independent.
  - Safety: Morse 35; bed alarm off for the day.
  - IV sites: both saline locks patent, no redness (to be removed before discharge).
  - Endocrine: fasting glucose in range; no low symptoms since 0335.
  - Pain: none, 0/10.
- **Quick Check:**
  1. *Before each pen injection, what must she do first after attaching a new needle?* **Answer: prime ("air shot") 2 units until a drop appears, then dial the dose; after injecting, hold 10 seconds.** Why: priming removes air and checks flow; holding stops the dose leaking out. Tempting wrong: skip priming because "the pen is new."
  2. *"If I'm sick and can't eat, I'll skip my insulin." Best reply?* **Answer: "Never skip your long-acting insulin. Check your glucose and ketones every 2 to 4 hours and call if ketones are moderate or you keep vomiting."** Why: no insulin = ketone production = DKA again. Tempting wrong: "Skip it if you are not eating" or "take half and wait."
  3. *Which result best confirms that this is autoimmune type 1 diabetes?* **Answer: positive islet autoantibodies (GAD65 and others; pending), supported by a low C-peptide.** Why: antibodies show the immune attack; a low C-peptide shows little insulin made. Tempting wrong: A1c 11.6%, which shows how high and how long, not what type.
- **VR:**
  - *Looks:* sitting in the chair in her own sweatshirt, hair in a ponytail, color good. Normal breathing. Holding the lispro pen and a needle, mother leaning in to watch. Smiling a little.
  - *Says:* "Okay, four units, then I just pull it out, right?" / "If I'm sick, I'll just skip it so I don't go low, right?" / "Do I really have to wear a bracelet? Can it be on my phone?" / "When can I go home? I want to sleep in my own bed." / "Mom, you have to learn the emergency shot thing."
  - *Room:* breakfast tray at 0730 with a carbohydrate list (oatmeal, banana, milk). Lispro and glargine pens, pen needles, meter, ketone strips (teaching kit), a glucagon trainer device, an educator handout "Survival Skills: Insulin, Lows, Sick Days." Sharps box. Two saline locks. Telemetry on. Discharge checklist on the whiteboard with boxes still open.
- **Safety catch:** **pen technique error** (no priming, no 10-second hold), and **the unsafe sick-day belief** ("skip insulin when sick" is how DKA comes back).
- **Teaching:** teach-back; survival skills first, carbohydrate counting later; supplies and a support person make the plan work at home.

---

## 18. Bedside monitor rows (`monitor.html`, key MRN SIM-40602, room SD-6, "SD-6   WHITCOMBE, NORA   22 F")

| Row | hr | spo2 | sys/dia | rr | temp (F) | rhythm | pr | qrs | tAmp | uAmp | pvc | o2 | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 0700 | 106 | 99 | 110/66 | 24 | 98.6 | sinus tach | 140 | 84 | 0.40 | 0 | | RA | Kussmaul; pain 4 |
| D1 1100 | 96 | 99 | 112/68 | 20 | 98.4 | sinus | 140 | 84 | 0.30 | 0 | | RA | pain 2 |
| D1 1500 | 90 | 99 | 114/70 | 18 | 98.6 | sinus | 142 | 84 | 0.25 | 0 | | RA | K 3.6; pain 1 |
| D1 1900 | 94 | 99 | 118/74 | 18 | 98.4 | sinus | 142 | 84 | 0.28 | 0 | | RA | tearful; pain 0 |
| D1 2300 | 92 | 98 | 114/72 | 18 | 98.2 | sinus | 142 | 84 | 0.30 | 0 | | RA | back from walking 2255; pain 0 |
| D2 0300 | 108 | 98 | 126/76 | 18 | 97.9 | sinus tach | 140 | 84 | 0.30 | 0 | | RA | glucose 58; pain 2 (headache) |
| D2 0335 (mid) | 90 | 98 | 118/72 | 16 | 97.9 | sinus | 142 | 84 | 0.30 | 0 | | RA | after 2 rounds of 15 g |
| D2 0700 | 78 | 99 | 114/70 | 14 | 98.2 | sinus | 142 | 84 | 0.30 | 0 | | RA | pain 0 |

No `events` (no ectopy).

## 19. Judgment calls (for the instructor)
1. **Arrival gas pH 7.14 / HCO3 6.2 / pCO2 19** (serum CO2 7) keeps every gas consistent with H-H and Winter's. Severity "moderate-to-severe" (moderate by pH, severe by bicarbonate and BHB 6.8).
2. **Potassium never goes under 3.5 (lowest 3.6), so insulin is never held.** The orchestrator's prompt said "hold only if K under 3.3 per protocol." The 2024 consensus (and `EVIDENCE.md`, the series) uses under 3.5. **The protocol order here says under 3.5.** Because 3.6 is above both, the classroom answer ("continue insulin, give riders") is the same under every source. If the instructor prefers the textbook's 3.3 in the order text, change one line; no numbers change.
3. **Fixed rate 0.1 unit/kg/h for the whole infusion** with D5/0.45% at 150 mL/h. Glucose stays 162-204, so there is one clean dextrose step and no rate changes.
4. **0.45% NaCl from 0700** (corrected Na normal) instead of staying on 0.9%: it teaches the textbook fluid rule and keeps the chloride rise small.
5. **The dextrose step happens at 0800, between stops**, not at a stop. At 0700 the glucose is 274, so students anticipate. At 1100 they explain and document it. This avoids repeating Caleb's "start dextrose at 0700" beat.
6. **The order to discontinue is NPO** (RN diet-advancement protocol in the order text), at stop 2.
7. **Two planted order errors only** (bicarbonate at pH 7.24 by the night admitter; KCl 20 mEq/h peripheral by the day hospitalist). The transition order is written correctly, so students see a model overlap. The pen error and the sick-day belief at D2 0700 are patient errors, not order errors.
8. **The low glucose happens after the transition (D2 0300), treated by mouth with two rounds of 15 g**, not on the drip. Cause: 40 minutes of fast hallway walking (her runner's way of coping) after the first glargine dose, early insulin sensitivity, and a declined snack. Dinner (70% eaten) and its lispro are not the cause; lispro is mostly gone 4-5 h after 1915. Changed after review so that it does not repeat Maya's (sweaty, dreams, 64 -> juice -> snack) or Jordan's/Denise's (small meal after a fixed dose) beats. Her presentation is neuroglycopenic first (groggy, confused).
9. **Labs after the transition (2200, 0200)** are more frequent than strictly needed. They exist so every stop has a new set, and they double as the rebound-ketosis check.
10. **Glargine at 1900 daily** (the evening transition time, kept for home). Endocrinology lowers it to 12 units on D2 morning after the low (after the course; not in the chart).
11. **Discharge Tuesday evening (about 1930) after her own 1900 glargine**, with her mother staying a week, if the D2 criteria are met, with a Wednesday-morning phone check and a 0300 glucose check at home the first night (otherwise discharge Wednesday morning). The 24 h course ends with the criteria partly met; students judge what is missing.
12. **Antibodies stay "pending" in the chart.** The Fri 02/12 positive GAD65/IA-2 result is instructor-only, for the debrief.
13. No VTE drug (age 22, walking; a progestin IUD is not an estrogen clot risk). No CXR (no respiratory symptoms; UA and exam show no infection trigger).
14. **Not applied (review NICE TO HAVE):** an extra K check at 0500 (the first K after insulin is at 0530, 2 h 25 min after the start; accepted), and moving rider 4 after the 2-minute pause (the pause is not counted).

---

## 20. Per-stop summary table

| Time | Big idea (judgment step) | What changed | New labs (values) | Assessment highlights | Monitor row (HR, BP, RR, SpO2, T, rhythm, pain) | Aloud values | Quick Check topics | Safety catch |
|---|---|---|---|---|---|---|---|---|
| **D1 0700** | Recognize DKA cues and act on the newest results; fluids first (recognize cues) | Arrives from ED; insulin 5.5 units/h; 0.9% -> 0.45% NaCl 250; rider 0715 | ED 0150: Na 130, **K 5.8**, Cl 93, CO2 7, Cr 1.3, Glu 562, **AG 30, BHB 6.8, pH 7.14**/pCO2 19/HCO3 6.2; ED 0530: Na 133, **K 4.7**, CO2 10, Glu 352, AG 23, BHB 5.4, pH 7.24; WBC 16.4; hCG neg; lipase 48; ECG peaked T | Drowsy, Kussmaul, fruity breath, tenting 3 s, dry cracked lips, nausea, Morse 45 | 106, 110/66, 24 deep, 99% RA, 98.6, sinus tach slightly tall T, 4 | Glucose 0700 274 (charted); urine 400 at 0610 | Kussmaul = compensation (newest gas); why 0.45% (corrected Na 137.0); bicarbonate only under pH 7.0 | **Planted error 1: bicarbonate at pH 7.24** |
| **D1 1100** | Glucose under 250: add dextrose, keep insulin; gap not glucose (generate solutions / take action) | D5/0.45% 150 from 0805; riders 1030/1130; NPO discontinued; clear liquids | 0930: Na 136, **K 4.1**, Cl 104, CO2 13, Glu 198, Mg 1.9, phos 2.6, **AG 19, BHB 3.3, pH 7.29**; A1c 11.6% | Alert, slower breathing, faint fruity breath, bowel sounds active, asking to drink | 96, 112/68, 20, 99%, 98.4, sinus, 2 | 0800 222, 0900 204, 1000 192, 1100 186 | Dextrose step action; gap 19 math; NPO criteria | "Almost normal glucose" trap (do not stop insulin); **discontinue NPO** |
| **D1 1500** | Insulin drives K into cells; K 3.6 = keep insulin, riders at max 10 mEq/h (analyze cues, take action) | K 3.6; 4 riders 1505-1905; MgSO4; mother arrived 1300 | 1330: Na 137, **K 3.6**, Cl 106, **CO2 14**, Glu 172, **Mg 1.7, phos 1.8**, **AG 17**, **BHB 1.3, pH 7.32**; TSH 1.8 | Heavy legs, calf cramps, lower T waves, mother present | 90, 114/70, 18, 99%, 98.6, sinus, T slightly lower, no U, 1 | 1200 180, 1300 174, 1400 170, 1500 166 | Why K fell; 20 mEq/h peripheral = no; hold insulin at 3.6? no | **Planted error 2: KCl 20 mEq/h peripheral** |
| **D1 1900** | Resolution criteria; basal at least 2 h before the drip stops (evaluate outcomes, take action) | Resolved; glargine 14 at 1900 (self-injected); drip and D5 off 2100; lispro 4 at 1915; diagnosis told at 1700 | 1730: Na 138, K 3.9, Cl 106, **CO2 18**, Glu 170, Mg 2.1, **AG 14, BHB 0.5, pH 7.34** | Normal breathing, no odor, tearful, denial/bargaining, first self-injection | 94, 118/74, 18, 99%, 98.4, sinus, 0 | 1600 162, 1700 168, 1800 170, 1900 168 | Which set is resolved; when the drip may stop; 0.5 unit/kg/day math | The overlap (do not stop the drip at 1900); two look-alike pens |
| **D1 2300** | New diagnosis = loss; assess coping and readiness; include the support person (recognize/analyze cues) | Off drip 2100; ate 70%; fast hallway laps 2215-2255; snack declined; crying, searching online | 2200: Na 139, K 4.0, Cl 106, CO2 20, Glu 152, AG 13, **BHB 0.3** | "I'll never be normal"; not ready to learn; copes by walking; steady | 92, 114/72, 18, 98%, 98.2, sinus, 0 | 2000 178, 2100 166, 2200 148; ate 70%; laps 2215-2255; snack declined | Therapeutic response; teaching timing; snack after exercise on new basal | Night-low risk: offer a snack, make sure of the 0300 check |
| **D2 0300** | Hypoglycemia 15-15 by mouth, repeated until 70+, then a snack (take action, evaluate) | 0300 glucose 58, groggy then oriented; tablets -> 66 -> juice -> 94 -> snack | 0200: Na 139, K 4.1, CO2 22, **Glu 84**, AG 12, BHB 0.3 | Hard to rouse, briefly confused, sweaty, pale; wants to walk alone while shaky, Morse 45 | 108, 126/76, 18, 98%, 97.9, sinus tach, 2; 0335: 90, 118/72, 16 | **0300 58**, 0317 66, 0333 94 | First action for 58 able to swallow; next step at 66; the earlier cue (lab 84 after exercise) | **Hypoglycemia needing a second round** + night fall risk |
| **D2 0700** | Survival skills by teach-back; discharge readiness; type 1 confirmed (evaluate outcomes) | Fasting 122; C-peptide low; pen error; sick-day belief; plan home about 1930 Tue | 0530: Na 140, K 4.2, Cl 104, CO2 24, Glu 124, AG 12, **BHB 0.2**; WBC 8.2, Hgb 12.6; **C-peptide 0.3**; tTG neg; antibodies pending | Rested, ready to learn; missed priming and 10-s hold; no bracelet wanted | 78, 114/70, 14, 99%, 98.2, sinus, 0 | 0400 118, 0700 122; weight 56.2 kg | Pen priming/hold; never skip basal when sick; antibodies vs A1c | **Pen technique error** + unsafe sick-day belief |

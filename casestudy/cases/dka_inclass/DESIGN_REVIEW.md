# DESIGN REVIEW: in-class DKA patient (Caleb Mercer, SIM-40601)

Independent clinical review of `DESIGN.md` against `BRIEF.md`, `EVIDENCE.md`, the patient-course skill rules and `../DKA_SERIES.md`. Review only; nothing in DESIGN.md was changed.

**Overall:** a strong, coherent design. All lab arithmetic checks out (re-computed below). I&O sums, insulin totals, the rider schedule and the per-minute potassium load are correct. The problems are: one potassium threshold question at D1 1500, three notes that quote results or orders before they exist, the overlap wording ("1-2 h"), one snack-dosing contradiction in the teaching, and too many planted provider-order errors.

---

## 1. Clinical correctness (2024 adult DKA consensus)

### 1a. D1 1500: hold insulin for K 3.4? (MUST FIX)
- **What:** set 4 (1400) K 3.4. The protocol (section 5) and the expected actions hold insulin and D10 from 1500 to 1730.
- **Why it matters:** the threshold depends on the source.
  - The **2009 ADA algorithm** holds insulin only for K **under 3.3**. At 3.3-5.0 it continues insulin and replaces potassium.
  - My reading of the **2024 consensus** is that it raised the "hold insulin, give K 10-20 mEq/h first" threshold to **under 3.5**. EVIDENCE.md and DKA_SERIES.md also say 3.5. Neither the designer nor I could read the full text, so this is still (verify).
  - JBDS does not hold insulin at all; it calls for senior review and more potassium.
  - With 3.4, the right answer depends on which document a student or faculty member has open. That will cause arguments in class, and an exam item may expect "do not hold at 3.4."
- **Decision:** make the value one that every version agrees on. **Change set 4 K from 3.4 to 3.2.** Holding is then correct under the 2009 algorithm, the 2024 consensus, the series rule and this protocol. The U waves and 2 PVCs/min on the monitor are also more believable at 3.2.
- **Exact fix (everywhere "3.4" appears for this result):**
  - Section 6, set 4: K **3.2**.
  - Notes on the numbers, the K trend line: 5.6 -> 4.6 -> 3.9 -> **3.2**.
  - Section 8: "HELD 1500-1730 (K **3.2**)" and the riders line "(K **3.2**: 4 back to back)".
  - Section 10, hold order text: "on hold for K **3.2**".
  - Notes: D1 1515 ECG note and D1 1530 event note.
  - Section 15, problems list.
  - Stop 3 text and monitor note "K 3.2".
  - Section 19 table.
  - Judgment call 4.
  - ECG 2 note: "consistent with K 3.2".
  - Keep the STAT K at **3.6**. A rise of 0.4 after 20 mEq while insulin is off (no insulin shift) is plausible. 3.5 also works.
- **Alternative, if the instructor wants to keep 3.4:** do not hold. The teaching becomes "K 3.3-5.0 = keep the insulin running and replace potassium at the peripheral maximum." That means 4 riders back to back at 10 mEq/h, Mg, ECG, and a recheck after the riders. Then:
  - Delete the hold order, the D10 hold and the BHB rebound (set 5 BHB about 2.0, pH about 7.30).
  - Change the protocol line to "hold only if K under 3.3."
  - This also changes the D1 1500-1900 glucose list, the insulin totals and the I&O.
  - **3.2 is the cheaper and less arguable fix.**

### 1b. Dextrose step and glucose targets (OK; one wording fix)
- A D10 line at 100 mL/h at glucose under 250, keeping the fixed 0.1 unit/kg/h, is the JBDS style. EVIDENCE section 3 allows it, and it is clinically sound. The step to 150 mL/h, and then insulin to 0.05 unit/kg/h only when glucose is under 150 on 150 mL/h, follows the "dextrose first" principle. The rule "off whenever insulin is held" is reasonable.
- **NICE TO HAVE:** section 7 says "target 150-250." Write it as "**this hospital's two-bag table keeps glucose 150-250** (ADA-style protocols aim 150-200; JBDS 108-252)." Students who read the ADA figure will then not think 230-244 is off target.

### 1c. D2 0300 low glucose and the insulin rate (clinically right; mechanism unrealistic)
- **Clinically correct:** D50 12.5 g for 62 when alert, a recheck in 15 min, fixing the dextrose line and D10 at 150, insulin lowered to 3.8 units/h (exactly 0.05 x 76.0, the floor), and insulin never stopped while BHB is 1.1. The order of actions (dextrose first, then rate) is right.
- **Problem (SHOULD FIX), D2 0111-0310 "kinked line, alarm silenced, channel on hold for 2 h":**
  - Infusion pumps re-alarm every 2-3 minutes while a channel is on hold or occluded. A 2-hour silent hold is not believable to anyone who has worked nights.
  - Reprogramming the rate at 0205 on a held channel would also show "on hold" on the same screen.
- **Fix:** keep the event and change the mechanism. When he got up to void at about 0100, the **D10 tubing came apart at the needleless connector at the Y-site** (or the secondary tubing was pulled off the Y-port). The pump kept "running" with no alarm, and the dextrose dripped into the bed.
  - At 0205 the off-going nurse raised the rate to 150 on a running pump with no alarm, which is very plausible.
  - The 0300 finding is a **wet sheet and gown at the left side, the D10 line end lying open on the bed, and pump volume infused rising**.
  - The teaching becomes "trace every line from the bag to the patient," which is stronger than "resolve alarms."
  - I&O: D10 delivered to the patient 0111-0310 = 0. Note it as "pumped but not received; not counted as intake." The D2 0300 block D10 then stays as 2300-0111.
  - VR: replace the "ON HOLD, downstream occlusion" screen with "D10W 150 mL/h, infusing, VTBI ... volume infused 180 mL" and a disconnected line end on a wet sheet.
- **NICE TO HAVE:** at 0200 glucose fell 46 mg/dL in 1 h (158 -> 112). Per EVIDENCE section 6, recheck every 30 min when falling fast or near 70. Add it as a debrief question ("what should the 0200 nurse have done besides calling?" Answer: recheck at 0230 and trace the line).
- **NICE TO HAVE:** the 0205 screen rate change comes before Varga's 0210 phone order. The protocol table already authorizes 150 mL/h, so either move the rate change to 0210 or drop the phone order and keep a 0215 "notified" note.

### 1d. Resolution criteria and the transition overlap
- Resolution criteria are correct (2024): BHB under 0.6 AND (pH 7.3 or more OR HCO3 18 or more), and glucose is not a criterion. The "not resolved" teaching at D1 2130 (pH 7.31, BHB 2.0) and D2 0130 (pH 7.32, BHB 1.1) is good.
- **MUST FIX (wording):** the design teaches **"1-2 h"** overlap in several places:
  - section 5, "Transition: basal SubQ insulin 1-2 h before";
  - section 10, the unsafe-order note, "Basal must be given 1-2 h before";
  - stop 7 teaching, "why the 1-2 h overlap";
  - section 19, D2 0700 teaching, "1-2 h basal overlap".
  
  The 2024 consensus (EVIDENCE section 7, verify) says give SC basal insulin **2-4 h** before stopping the infusion, and the design itself uses 2 h. "1-2 h" teaches a number below the 2024 minimum. **Fix:** replace all four with "**at least 2 h before stopping the infusion (2024: 2-4 h); here 2 h, 0730 -> 0930**."
- **NICE TO HAVE:** a 3 h overlap (drip off 1030) sits in the middle of the 2024 range. It cascades into set 9 (drawn 0945 while still on the drip, so it would no longer be a rebound check) and the D2 1100 I&O. I recommend **keeping 0930**.
- **NICE TO HAVE:** the 2024 report also allows **early basal insulin while still on the drip** (e.g., home glargine on D1). Add one line to Beaumont's D1 1130 note ("early basal is an option; we will give the home dose at transition"). This lets the instructor discuss it without changing the course.
- **NICE TO HAVE:** the 0630 order is labeled "UNCLEAR ORDER," but it is clear and unsafe (glargine and drip stop at the same minute). Relabel it **"UNSAFE ORDER."**

### 1e. Fluids over 36 h and the chloride rise (OK; two wording fixes)
- Re-computed totals:
  - NaCl: bolus 1,000, then 500 x 2 h = 1,000, then 250 x 2 h 05 min = 521, then 150 x 11 h 55 min = 1,788, then 100 x 14.5 h = 1,450. Total **about 5.76 L**.
  - D10: 792 + 618 + 950 = **about 2.36 L** (236 g dextrose).
  - Riders: about 1.5 L.
  - First hour 1 L = 13.2 mL/kg, then 6.6 and 3.3 mL/kg/h. These fit 1-1.5 L, then 250-500 mL/h.
  - Chloride rises 95 -> 109, with the non-gap acidosis at D2 0130 correctly explained.
- **SHOULD FIX:** section 6 note says "Corrected Na stays 137.6-140.5 ... (no hypernatremia, so 0.9% saline is right)." That logic is backwards. In the ADA algorithm a **normal or high corrected Na is when 0.45% saline is considered**; 0.9% is kept when corrected Na is low. **Fix:** "Corrected Na is normal the whole stay. This order set keeps 0.9% (allowed); 0.45% saline after the first hours, or a balanced fluid, would be alternatives and would limit the chloride rise. Lactated Ringer's (4 mEq/L K) at 150 mL/h plus a 10 mEq/h rider would be 10.6 mEq/h, over the peripheral limit, which is one more reason this unit uses saline." The last sentence turns the instructor's K rule into a teaching point.
- **NICE TO HAVE:**
  - By D2 0600 he weighs 79.3 kg, above his usual 79.0. He is drinking 360-720 mL per 4 h and is +5.3 L net.
  - NaCl 100 mL/h until D2 0930 is more than he needs. Either lower the NaCl to 50 mL/h at D2 0300, or keep it and add a debrief question ("is he still dry?").

### 1f. Magnesium and phosphate (OK)
- MgSO4 2 g over 2 h for Mg 1.6 is correct practice (not in the consensus algorithm). Running it in the other arm from the rider is correct.
- Phosphate is monitored and not replaced (lowest 1.9, threshold 1.0), which is correct.
- **NICE TO HAVE:** Mg 1.8 at 0930 with K falling (3.9) is at the lower limit. Add a pharmacist or hospitalist line: "Mg 1.8, recheck at 1400," so that the 1.6 at 1400 is anticipated.

### 1g. Sick-day teaching content
- **MUST FIX (contradiction in the expected answer), stop 9 expected actions:** "stop the pen mix-up (... **no insulin for a small snack under his plan**)."
  - His plan is lispro **1 unit per 10 g carbohydrate**. "Two units for these crackers" (about 20 g) is the **right dose with the wrong pen**.
  - Inpatient lispro is ordered with meals only, but at home his plan covers carbohydrate.
  - **Fix:** "The dose is right for about 20 g of carbohydrate but he picked the **long-acting pen**. In the hospital, lispro is ordered with meals only, so no snack dose here; at home he follows 1 unit per 10 g."
- **SHOULD FIX:** "extra lispro per the ketone plan" is not quantified anywhere a student can check. Add exact numbers (EVIDENCE section 9; TDD 46 units):
  - Blood ketones 0.6-1.4: add **10% of TDD = about 5 units** lispro, recheck in 2 h.
  - Ketones 1.5-2.9: add **20% of TDD = about 9 units**, call the diabetes team, recheck in 2 h.
  - Ketones 3.0 or more: **ED**.
  - Repeat the extra dose every 2-4 h while ketones are positive.
  - Put this in the educator note (D2 1330) and the stop 9 key, labeled "Dr. Beaumont's written sick-day plan."
- **OK as written:** never stop basal; glucose and ketones every 2-4 h; fluids 250 mL per hour with 15 g carbohydrate per hour if not eating; when to call and when to come to the ED.
- **NICE TO HAVE:** the D2 1645 educator note says "ketone meter practice." His strips are expired and the new ones are not ordered until after 1900. Write "practiced with a unit demo strip."

### 1h. Discharge readiness and timing at D2 1900 (SHOULD FIX)
- **What:** discharge home at about 1945 on D2. The drip has been off for only 10 h. He has had **one** glargine dose, at a new time of day. No night on SubQ insulin, no fasting glucose and no 0300 check have been seen. He lives with a roommate who works nights.
- **Why:** EVIDENCE section 9 suggests no drip for about 12-24 h (verify local). The new 0730 glargine time has not been tested through a night. The order set already has "POC before meals, bedtime and **0300**," which implies an overnight stay.
- **Fix (recommended):** the D2 1745 order becomes "**Discharge tomorrow (D3) after breakfast** if the overnight and fasting glucoses are 100-250 with no low, BHB under 0.6, and supplies in hand." Write the prescription list now, so the missing-supplies catch at 1900 is unchanged.
  - Change stop 10's "Discharge decision" to D3 about 1000.
  - Change the sister line to "will pick him up tomorrow morning and stay the first night."
  - The 1900 stop is still about discharge readiness: what is missing, and what still has to happen.
- If the instructor prefers same-evening discharge, keep it, but state the criteria in the hospitalist note and the D2 0300 glucose plan for home.

### 1i. Other clinical points
- **SHOULD FIX, D1 1700 STAT labs ("after 2 riders"):**
  - The second rider runs 1605-1705, so at 1700 it is still infusing. MgSO4 runs in the left arm until 1715.
  - A K drawn during an infusion, or above an IV site, is not reliable.
  - **Fix:** collect **1720** (after rider 2 has finished and the Mg is done) by venipuncture from the left hand, or below the left IV with that infusion paused per policy. Results: gas 1730, BMP 1745, BHB 1755.
  - Insulin restart **1750**. Insulin 1750 - D2 0305 = 9.25 h x 7.6 = **70.3 units**; total about **185 units**.
  - D1 1900 I&O: insulin 1750-1900 = 1.167 h x 7.6 = **8.9 mL**. IV med 453 -> **450**, In 1,533 -> **1,530**, D1 day 4,533 -> **4,530**, arrival to D2 0700 10,876 -> **10,873**, whole stay 13,871 -> **13,868**, net +6,398.
  - Move the D1 1745 hospitalist note to **1800**. Make the restart order 1750.
- **SHOULD FIX, droplet precautions:** the students discontinue an isolation order written by a physician. Most hospitals need a provider order or a **nurse-driven protocol**. **Fix:** add to the order comment: "RN may discontinue per the respiratory isolation protocol when the respiratory viral panel is negative for influenza A/B, SARS-CoV-2 and RSV and the patient is afebrile." That makes the student action legitimate.
  - NICE TO HAVE: CDC advises N95 plus eye protection while COVID-19 is suspected. Add one line in INSTRUCTOR notes saying this unit's policy uses droplet precautions plus eye protection pending the panel, or accept it as a simplification.
- **NICE TO HAVE, D1 1900 infiltration:** add the INS grade. About 4 cm, cool, pale, taut = **grade 2**. Note that a KCl rider in an antecubital site (elbow flexion) is a known setup for infiltration (a debrief point). About 9 mEq of the last rider went into tissue, so systemic IV K was about 140 mEq, not 149. Optional to state.
- **NICE TO HAVE:** Winter's formula is applied to **venous** pCO2. Venous pCO2 runs about 3-8 mmHg above arterial, so a venous value inside the Winter's range means compensation is at least adequate. Add this one line to section 5 so a sharp student is not confused. (Series convention; numbers fine.)
- **NICE TO HAVE:** eGFR 65 at arrival is not valid during AKI (not steady state). Add "(estimate only during AKI)."

---

## 2. Numbers and calculations (all re-computed)

- **Anion gap, corrected Na (1.6), effective osmolality, calculated osmolality, Henderson-Hasselbalch, Winter's, eGFR (CKD-EPI 2021, male, 28):** all 11 sets re-computed and **all match the design** (e.g., set 1: AG 28, cNa 138.0, eff 291.9, calc 301.2, H-H 7.177, Winter's 18.2, eGFR 65; set 8: AG 13, cNa 140.0, eff 286.9, calc 290.5, H-H 7.337, Winter's 34.4, eGFR 124). Every venous pCO2 is inside the Winter's range.
- **Other values checked, all correct:**
  - Delta-delta 16/16.
  - BUN/Cr 17.
  - Osmolal gap 3.
  - QTc 428 and 460 (Bazett).
  - BMI 23.5.
  - TDD 0.6 unit/kg/day.
  - 0.1 x 76 = 7.6 and 0.05 x 76 = 3.8 units/h.
  - Insulin totals 90.6 + 72.8 + 24.4 = 187.8.
  - Glucose fall 52-58 mg/dL/h.
  - Lispro 6 / 8 / 6 units.
  - Glargine 48 units in 13.5 h.
  - 4 + 10 = 14 mEq/h for the wrong bag.
  - Dates and weekdays (Mon 2027-01-11, Fri 01/15), age 28, 52 h since the last glargine.
- **Potassium per minute:** every rider is sequential, never more than one at a time, never above 10 mEq/h. The only run of 4 is 1505-1900. No bag contains K, and the 40 mEq/L bag is never hung. Count: 15 riders (14 full + 1 partial of 92 mL = 9.2 mEq) = about 149 mEq. **Correct.**
- **Urine:** at least 38 mL/h in every block while riders run. **Correct.**
- **I&O:** every block, shift total and whole-stay total re-added. **Correct**, with one exception:
  - **NICE TO HAVE:** D2 0300 block D10 2300-0111 = 131 min x 100/60 = **218**, not 217. IV fluid 617 -> **618**, In 1,017 -> **1,018**, D1 night 3,713 -> 3,714, the arrival-to-0700 and whole-stay totals +1. If the disconnect fix (1c) is adopted, this is still 218.
- **Weights:** 76.0 + 5.3 - 2.0 = 79.3. 70 mL/h insensible loss is high-normal but defensible with fever and Kussmaul breathing. OK.
- **SHOULD FIX, potassium table:** at 3.5-3.9 the table gives **30 mEq per 4 h**. The peripheral rule allows 40 (4 riders), and the consensus (20-30 mEq per L at a total of about 350 mL/h) supports about 7-10 mEq/h. Change 3.5-3.9 to **40 mEq (4 riders)**. The fall to 3.2 at 1400 is still plausible: the 1030-1330 riders would become 1030, 1130, 1230, 1330, and the 1400 lab is drawn during the 4th rider, so draw set 4 at **1435**, or keep the table as is. If the instructor wants the cascade avoided, keep 30. Lower priority than the rest.

---

## 3. Time-gating

- **Checks that pass:**
  - Lab sets before every one of the 10 stops: stop 1 ED sets 1-2; set 3 resulted by 1025 for 1100; set 4 by 1455 for 1500; set 5 by 1735 for 1900; set 6 by 2225; set 7 by 0225; set 8 by 0625; set 9 by 1040; set 10 by 1425; set 11 by 1825.
  - A new full assessment at every stop.
  - Every order has orderedAt <= start. stoppedEarly is used for the four stopped orders.
  - Vitals charted only up to D1 0700.
- **MUST FIX, D2 0620 Varga note:** quotes **BHB 0.4**, which results at **0625**. Move the note to **0630**; the 0630 transition order can stay at the same minute or 0635.
- **MUST FIX, D2 1630 Beaumont note:** quotes "**142 before dinner**," which is the **1700** POC. Either move the note to **1715** or change the text to "196 before lunch, lab glucose 214 after lunch, BHB 0.2."
- **MUST FIX, D2 1730 discharge summary:** quotes the prescription list "as ordered **1745**." Move the note to **1800**, or move the discharge order to 1715. If discharge moves to D3 (1h), the summary becomes a "discharge plan" note at 1800.
- **SHOULD FIX, weight 79.3 kg at D2 0600:** weight is a vital-type observation in most flowsheets, and the rule is "vitals charted only up to D1 0700." The builder's "no vitals after first stop" check will either fail or be bypassed. **Fix:** chart it on the I&O / daily weight record (not a vital observation), or have the instructor say it aloud at D2 0700 like the glucoses. State which in DESIGN.md.
- **NICE TO HAVE:** "Up ad lib" ordered D2 1040, but he "showered and walked the hall" before 1100. Move the order to **D2 0930** (when the drip came off).
- **NICE TO HAVE:** pain scores ("Pain 4/10") appear in assessment text, while line 7 says no vital-sign numbers in assessment text and the monitor rows also carry pain. Either say pain stays in the assessment as the app's pain row (numbers must match the monitor note), or drop the number from the assessment text.

---

## 4. Teaching design: too many planted errors

Catches as designed, by stop:

| Stop | Catch | Type |
|---|---|---|
| D1 0700 | Handoff quotes old K | nurse error |
| D1 1100 | Discontinue droplet precautions | required order to discontinue |
| D1 1500 | Hold insulin for low K | protocol action |
| D1 1900 | KCl infiltration | event |
| D1 2300 | KCl 40 mEq/L bag | **provider order error 1** |
| D2 0300 | Dextrose line failure + fall risk | event + nurse error |
| D2 0700 | Transition with no overlap | **provider order error 2** |
| D2 1100 | Duplicate glargine | **provider order error 3** |
| D2 1500 | Wrong pen | patient error |
| D2 1900 | Missing ketone strips and glucagon | **provider order error 4** |

Four wrong provider orders in 21 hours, two from the same night hospitalist, plus two nursing errors by others, is more than a believable hospital. It also trains students to expect every order to be wrong. Four of the first five stops are also about potassium.

**Recommendation (SHOULD FIX), keep 3 order errors, each teaching something different:**
1. **Keep D1 2300 KCl 40 mEq/L bag.** It teaches the instructor's peripheral concentration and stacking rule, which nothing else does.
2. **Keep D2 0700 no-overlap transition.** This is core 2024 DKA content.
3. **Keep D2 1900 missing ketone strips and glucagon,** but make it a natural reconciliation gap: the list was copied from his home prescriptions, which never included in-date strips or glucagon. It teaches discharge readiness.
4. **Remove the D2 1100 duplicate glargine order.** It repeats the 0700 basal-timing lesson and is the hardest to believe (a third physician error in 12 h, after endocrinology wrote "no 2100 glargine" at 0715).
   - The D2 1000 order becomes "resume home loratadine 10 mg daily PRN."
   - Delete the D2 1130 addendum's glargine part and the D2 1130 sticky note.
   - The teaching moves to the **patient**. He already asks, "Tonight I'll do my long-acting at nine like always, right?" Students answer and teach that the next dose is 0730 tomorrow, 24 h later.
   - The D2 1100 stop then teaches: post-transition monitoring (BHB 0.3, no rebound), oral KCl for K 3.6 (with water, upright, whole), the lunch dose calculation (8 units) and basal timing. That is enough content.

Optional: to spread the authorship, the D2 0630 order can come from a different covering clinician (a new name, e.g., a night nurse practitioner), so Varga is not the author of both errors.

**NICE TO HAVE:** the D1 0700 sticky note "Use the NEWEST K" gives away the first catch. Remove that sentence.

---

## 5. Contradictions, realism, wording

- **NICE TO HAVE, story:** Tessa found him **Sun 2330** and lives 15 minutes away, but arrival is **Mon 0130**. Change "found him" to **about 0100 Monday** (or explain a delay).
- **NICE TO HAVE, stop 1 assessment:** Skin "warm, dry, flushed" vs CV "hands cool." Write "warm and flushed centrally; hands cool."
- **NICE TO HAVE, stop 6 Morse:** at 0300 he is foggy and trying to walk alone with two poles. That is "forgets limitations" (+15), so **Morse 60** at 0300, not 45.
- **NICE TO HAVE, stop 7:** D10 at 150 mL/h (15 g/h) keeps running through breakfast with lispro. That is acceptable during the overlap, but a line saying "D10 continues because IV insulin continues until 0930" would answer the obvious student question.
- **Names:** all staff, family and roommate names were grepped across `casestudy/cases/` and none are reused. No brand names were found (glargine, lispro, glucagon, loratadine, ondansetron are generic). **OK.**
- **Meta wording:** "students" appears only in design commentary (section 10 notes column: "students held at 1500 per protocol"; "students lowered it at 0305"). **SHOULD FIX (builder note):** these must not be copied into order comments or chart text. Chart text should read "RN held at 1500 per protocol."

---

## PRIORITIZED LIST

### MUST FIX (safety or wrong clinical teaching)
1. **D1 1500 K threshold:** change set 4 K **3.4 -> 3.2** everywhere (section 1a), so the insulin hold is correct under the 2009 algorithm, the 2024 consensus and the protocol. Keep STAT K 3.6.
2. **Overlap wording "1-2 h"** (sections 5 and 10, stop 7, section 19) -> "at least 2 h before stopping the infusion (2024: 2-4 h); here 0730 -> 0930."
3. **Time-gating, D2 0620 note** quotes BHB resulted 0625 -> move to 0630.
4. **Time-gating, D2 1630 endocrinology note** quotes the 1700 glucose 142 -> move to 1715 or quote 196/214.
5. **Time-gating, D2 1730 discharge summary** quotes the 1745 order -> move to 1800.
6. **Stop 9 key: "no insulin for a small snack under his plan"** contradicts his 1 unit/10 g plan. The error is the pen, not the dose.

### SHOULD FIX
7. D2 0300 dextrose failure: change to a **disconnected D10 line** with the pump running (no 2-h silent hold). D10 received 0111-0310 = 0.
8. D1 1700 STAT labs drawn during rider 2 and Mg -> collect 1720, restart insulin 1750 (numbers in 1i).
9. Remove the **D2 1100 duplicate glargine** order (keep 3 planted order errors: 2300 K bag, 0700 transition, 1900 supplies). Teach basal timing through the patient's question instead.
10. Discharge: move to **D3 morning** after one night on SubQ insulin (or state the criteria if same-evening discharge is kept).
11. Quantify the sick-day extra lispro: 10% TDD = 5 units (ketones 0.6-1.4), 20% = 9 units (1.5-2.9) and call, 3.0 or more = ED.
12. Fix the "0.9% is right because no hypernatremia" reasoning, and add the lactated Ringer's / potassium-rule teaching line.
13. Weight at D2 0600: chart it outside the vital-sign observations, or say it aloud.
14. Droplet precautions order comment: an RN may discontinue per protocol when the panel is negative.
15. Potassium table 3.5-3.9 -> 40 mEq (optional; cascades the riders).
16. Keep "students" wording out of chart text.

### NICE TO HAVE
17. D10 218 (not 217) mL in the D2 0300 block, and the totals +1.
18. Glucose target wording (150-250 local vs 150-200 ADA).
19. Debrief on the 0200 fast fall (recheck at 30 min, trace the line). Align the 0205 rate change with the 0210 order.
20. Early-basal option in the D1 1130 endocrinology note. Relabel the 0630 order "UNSAFE."
21. Note on venous pCO2 vs Winter's. Note that eGFR during AKI is an estimate only.
22. Lower NaCl earlier (weight back above usual).
23. Infiltration INS grade 2; about 9 mEq into tissue.
24. Tessa timing (found about 0100). Skin warm vs hands cool. Morse 60 at 0300. "Up ad lib" at 0930. Ketone demo strip. Remove "Use the NEWEST K" from the sticky note. N95/eye-protection policy line. Mg 1.8 recheck line.

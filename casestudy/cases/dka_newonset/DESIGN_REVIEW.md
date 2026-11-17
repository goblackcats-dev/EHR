# DESIGN REVIEW: in-class DKA patient (Nora Whitcombe, SIM-40602)

Independent clinical review of `DESIGN.md` against `BRIEF.md`, `EVIDENCE.md`, the "Rules every patient follows" in `.claude/skills/patient-course/SKILL.md`, `../DKA_SERIES.md` and the lessons in `../dka_inclass/DESIGN_REVIEW.md`. Review only; nothing in DESIGN.md was changed.

**Overall:** a clean, classic, well-built design. Every lab number re-computes (table in section 2), the I&O adds up to the millilitre, potassium never exceeds 10 mEq/h, every stop has a new lab set and a new assessment, and the lessons from the Caleb review (gas math, overlap wording, note timing, K threshold, 2 errors by 2 authors) were applied. The real problems are:
1. **The 1330 lab set meets the older (2009/textbook) resolution criteria**, so the stop 4 Quick Check and the "not resolved at 1330" teaching are wrong for a student reading the textbook.
2. **The D2 0300 low copies Maya Thompson's beat almost exactly** (and Jordan's "half-eaten dinner" cause), which the brief forbids, and the stated cause (dinner lispro 8 h earlier) does not fit lispro's action time.
3. One wrong urine-rate number at stop 3.
4. Smaller items: the textbook-comparison section misstates the 2009 dextrose and bicarbonate numbers, the fluid-deficit reasoning contradicts the weights, a U wave at K 3.6, two active diet orders at 0700, a note that gives away the NPO discontinuation.

---

## 1. Clinical correctness

### 1a. Resolution at 1330 vs 1730: the older criteria are met at 1330 (MUST FIX)
- **Where:** section 6 set 4; section 5 "Not resolved at 1330"; section 16 "At 1330 neither definition is met"; stop 3 teaching; **stop 4 Quick Check 1**.
- **What is wrong:** the 2009 ADA resolution rule (which section 16 itself quotes, and which the textbook probably still teaches) is **glucose under 200 plus 2 of: HCO3 15 or more, venous pH over 7.3, gap 12 or less.** Set 4 has glucose 172, **CO2 15** and **pH 7.32**. That is 2 of 3, so **1330 counts as resolved under 2009/textbook.** The Quick Check's "tempting wrong answer" (1330, "pH over 7.3 and glucose under 200") is actually the correct answer for any student reading the older criteria. That is exactly the kind of source conflict the Caleb review removed for K 3.4.
- **Exact fix (smallest change; keeps pH 7.32 and every other stop):** set 4 CO2 **15 -> 14**, gas HCO3 **14.4 -> 13.4**, pCO2 **29 -> 27**, gap **16 -> 17**.
  - Gap: 137 - 106 - 14 = **17**.
  - H-H: 13.4 / (0.03 x 27) = 13.4 / 0.81 = 16.54; log 1.219; 6.1 + 1.219 = **7.32** (7.319).
  - Winter's: 1.5 x 13.4 + 8 = 28.1 -> **26.1-30.1**; 27 is in range.
  - Now 2009: only pH over 7.3 is met (HCO3 14 under 15, gap 17 over 12) -> **not resolved**. 2024: pH met but BHB 1.3 -> **not resolved**. Both sources agree; the "pH alone is not enough" teaching is kept.
  - Change everywhere set 4 is quoted: section 6 table and math row; "Notes on the numbers" set 4 line (now "gap up 5 (17) but CO2 down 10 (14)"; the non-gap part is slightly larger, same teaching); D1 1445 Petrakis note ("gap 17"); stop 3 New labs; stop 4 Quick Check 1 stem "(pH 7.32, **CO2 14**, BHB 1.3)"; section 20 row D1 1500 ("CO2 14 ... AG 17").
  - Stop 4 Quick Check 1 "why" should then add: "Under the older rule 1330 also fails: it needs 2 of HCO3 15 or more, pH over 7.3, gap 12 or less, and only the pH is met."
  - Section 16: "At 1330 neither definition is met (2009: 1 of 3; 2024: BHB 1.3)."
- Set 5 still meets both: glucose 170, CO2 18, pH 7.34 (2009) and BHB 0.5 + pH 7.34 (2024). Set 3 meets neither. Good.

### 1b. Time to resolution (OK)
- Insulin 0305 -> resolution sample 1730 = **14.4 h** (16 h after arrival; declared 1840). BHB falls about 0.5 mmol/L/h, as the consensus expects. Bicarbonate rises 7 -> 18 = 0.76 mEq/L/h, slower than the JBDS 3/h target but typical in practice once chloride rises. For pH 7.14 / HCO3 7 / BHB 6.8 in a 22-year-old with normal kidneys, 14-16 h is believable. No change.

### 1c. D2 0300 low: duplicated story beat and a cause that does not fit (MUST FIX)
- **Duplicate beat:** Maya Thompson (`dka1_maya`, new-onset type 1, night after transition): "**woke sweaty, shaky, nightmare: glucose 64 -> 15 g juice -> 92 -> snack**." Nora: "woke sweaty and shaky, weird dreams ... **0300 64 -> 15 g juice -> 0315 88 -> snack**." Same diagnosis, same night, same symptoms, same number. Jordan (`dka2`) is "low after a half-eaten dinner"; Denise (`dka3`) is "low after a fixed meal dose with a small lunch." BRIEF.md: "Do not reuse their ... story beats."
- **Pharmacology:** the design (D2 0330 note, judgment call 8) blames "full dinner lispro with 40% eaten." Lispro given at 1915 peaks at 1-2 h and is mostly gone by 4-5 h (about 0000). The 2200 glucose of 148 already shows the dinner dose. A 0300 low is a basal/overnight problem: first glargine dose (0.25 unit/kg in an insulin-naive patient in the honeymoon), the D5 stopping at 2100, and low intake.
- **Exact fix (recommended; uses her runner identity and adds a second 15 g round, which Maya does not have):**
  - Dinner: she eats **about 70%** (not 40%). Lispro 4 units stays.
  - Stop 5: she cannot sleep and at **2215-2255 walks fast laps of the hallway** "like a run, to clear my head" (coping through her identity as a runner). Bedtime POC 2200 **148** is unchanged; snack offered after the walk and declined.
  - Set 7 (0200) glucose **84** is unchanged (the cue).
  - **0300 scheduled POC 58.** She is hard to rouse for a moment, then groggy, irritable, briefly unsure where she is, sweaty; oriented x4 within a minute, follows commands, can swallow (different presentation from Maya: neuroglycopenic first).
  - 0302: **4 glucose tablets (16 g) chewed** -> **0317 POC 66** (still under 70) -> 0318 **4 oz apple juice (15 g)** -> **0333 POC 94** -> 0335 crackers and peanut butter with milk 120 mL -> **0400 118** (unchanged).
  - I&O D2 0700 block: juice 120 (0318), milk 120 (0335), water 240 = **480** (unchanged; tablets carry no volume).
  - Monitor: D2 0300 row HR **108**, BP **126/76**, RR 18; mid row moves to **0335** (HR 90, 118/72, RR 16).
  - Rasmussen called **0305**, reply **0320** ("repeat the 15 g, snack once 70 or more, recheck 0400, no correction"); order "POC once at 0400" orderedAt **0320**; night note moves to **0345** and quotes 58 / 66 / 94. Cause in the note: "**40 min of brisk walking after the first glargine dose, early honeymoon sensitivity, snack declined; not the dinner lispro.**"
  - Stop 5 Quick Check 3 becomes: *"Bedtime glucose 148 at 2200. She then walked fast laps for 40 minutes and declined a snack. Best action?"* Answer: offer a snack with 15 g carbohydrate plus protein and make sure the 0300 check happens; exercise lowers glucose for hours. Tempting wrong: "148 is normal, no action."
  - Stop 6 Quick Check 2 becomes: *"At 0317 her glucose is 66. What next?"* Answer: **repeat 15 g fast carbohydrate and recheck in 15 min; snack once 70 or more.** Tempting wrong: "she is coming up, give the snack now" or "D50 IV."
  - Stop 6 Quick Check 3 answer: "the 0200 lab glucose of 84 (resulted 0245) after 40 min of exercise and a declined snack."
  - Stop 7 adds one line of exercise teaching (check before a run, carry 15 g, snack or adjust insulin per the clinic plan), which suits a runner.
- **Minimum acceptable alternative** if the instructor wants no new beat: keep the course but change the numbers and the cause (0300 **58** -> 0317 **66** -> second 15 g -> 0333 **94**) and fix the cause text as above.

### 1d. Fluids (OK; two wording fixes)
- Bolus 1 L = 18.2 mL/kg; 500 mL/h (9.1 mL/kg/h) then 250 mL/h (4.5): inside 1-1.5 L then 250-500 mL/h. Switch to 0.45% at 0700 with corrected Na 137 (normal) follows the ADA algorithm; reasoning ("low corrected Na would mean staying on 0.9%") is the right way round. LR excluded because 4 mEq/L x 250 mL/h = 1 mEq/h + 10 = 11 mEq/h: correct and a good use of the instructor's rule.
- **SHOULD FIX, stop 1 Quick Check 2 answer:** "the first 2.5 L **restored volume**" contradicts the 0700 assessment (HR 106, capillary refill 3 s, tenting 3 s, sunken eyes, dry furrowed tongue). Write: "the first 2.5 L **restored circulation** (BP up, HR down, urine flowing); her corrected sodium is normal (133 + 1.6 x 2.52 = **137.0**, 0530 set), so the rest of the deficit, mostly free water, is replaced with 0.45%." Use the **newest** set (133 / 137.0) in the stem and the wrong answer ("because her sodium is low, 133"), to match stop 1's own lesson "the newest result, not the oldest."
- **SHOULD FIX, deficit vs weights (section 5 and 9):** section 5 says the deficit is about 100 mL/kg = **5.5 L** and that 4.7 L IV + 1.5 L oral "replaces the deficit over about 20 h." That ignores 5.4 L of urine and emesis. The measured net balance is +2.2 L and the weight rises only **1.2 kg**. Section 9 then says most of the 6 kg loss was fat and muscle, which contradicts a 5.5 L water deficit. **Fix:** estimate the deficit from her exam at about **6% = 3.5 L** (HR 126, BP 98/58, tenting, dry mucosa); say "net +2.2 L minus about 1.2 L insensible = about 1 kg kept; circulation and exam are restored first, and the last 1.5-2 L of the deficit is made up by mouth over the next days." Section 9: "of the 6 kg lost, about 3.5 kg was water and about 2.5 kg fat and muscle."
- **NICE TO HAVE:** D1 0630 ED note "2.5 L saline in": by 0630 it is 1,000 + 1,000 + 375 = **2,375 mL**. Write "about 2.4 L."

### 1e. Insulin (OK)
- 0.1 x 55.0 = 5.5 units/h = 5.5 mL/h at 1 unit/mL; 0.05 x 55 = 2.75; no bolus; started only after K 5.8 was known (0235) and 3.5 or more. Glucose fall 50-58 mg/dL/h before dextrose. 98.5 units total (17.92 h). All correct.
- **NICE TO HAVE:** the first K after insulin is the 0530 set (2 h 25 min after the 0305 start). EVIDENCE says K 1-2 h after insulin starts, and the consensus rechecks a K over 5.0 in 2 h. Either add a K-only (or VBG with K) draw at **0500**, or accept it; it does not change any later number.

### 1f. Dextrose step (OK)
- Glucose 222 at 0800 -> D5W/0.45% NaCl 150 mL/h (7.5 g/h) from 0805, insulin unchanged: correct for a fixed-rate protocol. Glucose 162-222 on the table; one clean step. "Dextrose up, never insulin off" is a good rule.
- **SHOULD FIX, section 16 "Dextrose ... textbook at about 250 ... The same":** the **2009 ADA algorithm adds D5/0.45% at glucose 200** (and lowers insulin to 0.02-0.05 unit/kg/h). If Ignatavicius 11e follows 2009, the book says 200. Write: "2009 (and probably the textbook): dextrose at 200; 2024: under 250. Nora's glucose crosses both by 0800-0900, so the class answer does not change."

### 1g. Potassium (OK; one wrong number; one monitor fix)
- Riders 0715 (K 4.7), 1030 and 1130 (K 4.1), 1505/1605/1705/1805 (K 3.6). One at a time, 10 mEq/h, the only run of 4 is 1505-1905, no K in any bag, insulin continues at 3.6 (above 3.5 and 3.3). Planted 20 mEq/h never hung. Per-minute load never over 10 mEq/h. Hold threshold in the order text: **under 3.5**, consistent with the 2024 consensus and EVIDENCE. Correct.
- **MUST FIX, stop 3 expected actions:** "Check urine first: 1450 void, **about 70 mL/h**." Real numbers: 250 mL since the 1330 void = 80 min -> **about 190 mL/h**; the 4 h block is 850 / 4 = **212 mL/h**. Write "1450 void 250 mL (about 190 mL/h since 1330), well over 28 mL/h."
- **SHOULD FIX, U wave at K 3.6:** monitor row D1 1500 uses tAmp 0.22 with **uAmp 0.04**, and the assessment says "T waves lower with a tiny U wave." U waves are a feature of K under about 3.0; DKA_SERIES uses uAmp 0.08-0.15 for real hypokalemia. Teaching students that 3.6 shows U waves is wrong. **Fix:** row D1 1500 **tAmp 0.25, uAmp 0**; assessment "T waves a little lower than this morning; no U waves; no ectopy." Teaching line: "ECG changes usually appear well below 3.5; at 3.6 the **trend** (5.8 -> 3.6 in 12 h on insulin) is the cue."
- **NICE TO HAVE:** "legs heavy, calf cramps" are more typical of K under 3.0. With Mg 1.7 and phos 1.8 they are defensible; say in the instructor notes that the cramps fit the low Mg/phos as much as the K.
- **NICE TO HAVE, set 5 draw during rider 3:** pausing rider 3 at 1730 for 2 min makes it end 1807 and rider 4 run **1807-1907**. Either accept (I&O D1 1900 block rider 4 = 53 min = **88 mL**, IV med **460**, In **1,540**; D1 2300 rider remainder 7 min = **12 mL**, IV med **23**, In **683**; totals unchanged) or say "pause not counted."
- **NICE TO HAVE, table strength:** 10 mEq per 4 h at K 4.5-5.0 and 20 mEq at 4.0-4.4 is at the low end of the consensus (10-20 or 20-30 mEq per L of fluid at about 250 mL/h). It is the series table and it explains the fall to 3.6. Add one instructor line: "this hospital's peripheral table is conservative; the consensus amount per litre would be about 5 mEq/h."

### 1h. Bicarbonate, magnesium, phosphate
- Bicarbonate only under pH 7.0 (2024); her lowest pH 7.14. Mg 2 g over 2 h for 1.7 on the other arm. Phosphate 1.8 not replaced (under 1.0 rule). All correct.
- **SHOULD FIX, section 16 bicarbonate line:** "the textbook and 2009 say pH under 6.9" is inaccurate. **2009 gives bicarbonate for pH under 7.0** (50 mmol at pH 6.9-7.0; 100 mmol in 400 mL sterile water with 20 mEq KCl over 2 h at pH under 6.9). Write: "2009: pH under 7.0 (100 mmol only under 6.9); 2024: under 7.0. Nora's lowest is 7.14: no bicarbonate under any source. Note that the planted order copies the 2009 under-6.9 regimen."

### 1i. Transition (OK)
- TDD 0.5 x 55 = 27.5; glargine 14 (0.25 unit/kg); lispro 4 x 3; total 26 = 0.47 unit/kg/day; correction 1 unit per 50 over 150; 168 -> 0.36 -> 0. Glargine 1900, drip off 2100 = 2 h, written "at least 2 h before stopping the infusion (2024: 2-4 h)." Correct.
- **NICE TO HAVE, stop 4 Quick Check 2 "why":** "a **gap** means rebound ketosis" is ambiguous in a DKA lesson about the anion gap. Write "a **break in insulin coverage**."
- **NICE TO HAVE:** the inpatient pens "from pharmacy at 1840" arrive at the same minute the order is written. Say **1850**.

### 1j. New-diagnosis labs (OK; small notes)
- C-peptide, GAD65/IA-2/ZnT8, TSH, tTG-IgA with total IgA: correct set. No insulin autoantibodies (correctly, since IV insulin had started). Antibodies pending, positive result instructor-only: good.
- **NICE TO HAVE:** add to the C-peptide comment "acidosis and very high glucose can lower C-peptide at diagnosis, so a borderline value would be repeated; 0.3 with glucose 352 fits type 1." Add to TSH: "drawn while ill; repeat after recovery if abnormal." Send-out C-peptide and tTG resulting within 24-26 h is fast; call them "reference lab, next-day" or move them to D2 after the course (they are not needed before stop 7 except the C-peptide, which is the stop 7 teaching, so keep it).
- **NICE TO HAVE:** "A1c 11.6% ... fits the 6-week history": A1c reflects about 3 months; write "high glucose for weeks to months, likely before symptoms started." Usual weight 61.0 is from **09/2026**, so "6 kg in about 6 weeks" is not knowable; write "6 kg since September, most of it in the last 6 weeks by her account."

### 1k. Discharge timing and criteria (SHOULD FIX, small)
- Discharge Tue about 1930 is about 22.5 h off the drip (EVIDENCE: 12-24 h): acceptable. But glargine is lowered to 12 units at D2 0800, so she goes home before a single night on the new dose, after a night low.
- **Fix:** keep the plan, and add to the stop 7 criteria and the 0645 note: "**CDCES or endocrinology phone check Wednesday morning** (not 48 h); **glucose check at 0300 the first night at home** (mother) or a sensor before discharge if available." Otherwise discharge Wednesday morning.
- Criteria list (no further low, eats half of meals with correct lispro, teach-back by 1700, supplies in hand, glucagon taught to mother, follow-up within 1 week) is complete and matches EVIDENCE section 9.

---

## 2. Numbers (all re-computed)

| Set | AG | cNa (1.6) | Eff osm | Calc osm | H-H pH | Winter's | eGFR |
|---|---|---|---|---|---|---|---|
| 1 | 30 | 137.4 | 291.2 | 299.8 | 7.137 | 17.3 (19 in) | 59.6 |
| 2 | 23 | 137.0 | 285.6 | 293.1 | 7.244 | 21.8 (22 in) | 73 |
| 3 | 19 | 137.6 | 283.0 | 289.1 | 7.294 | 26.3 (26 in) | 93 |
| 4 | 16 | 138.2 | 283.6 | 288.2 | 7.319 | 29.6 (29 in) | 107 |
| 5 | 14 | 139.1 | 285.4 | 289.4 | 7.340 | 33.8 (33 in) | 107 |
| 6-8 | 13 / 12 / 12 | 139.8 / 139 / 140.4 | 286.4 / 282.7 / 286.9 | 290.0 / 286.2 / 290.8 | | | 125 |

All match the design (set 4 changes per 1a). Also correct: delta-delta 18/17; BUN/Cr 18; BMI 20.2; 9.8% weight loss; QTc 0.426 (Bazett); eAG 286; insulin 98.5 units; dextrose 1,938 mL = 97 g; IV crystalloid 4,709 mL; urine threshold 27.5 -> 28 mL/h; Morse 45 / 35; weekday check (Mon 2027-02-08, Fri 02/12); age 22.

**I&O:** every block re-added (941, 1,312, 1,544, 679, 120, 480; ED 1,000 and 1,522); shift totals 2,522 / 3,797 / 1,279; in 7,598, out 5,400, net +2,198. **Correct.** Rider volumes per block (150, 150, 392, 8) correct. Weight 55.0 + 2.2 - 1.2 + 0.2 = 56.2 correct (see 1d for the reasoning around it).

**Potassium per minute:** never more than one rider; never over 10 mEq/h; 7 x 10 = 70 mEq IV + 20 PO. Correct.

**Lab glucose vs POC:** 0530 352 (between 384 and 330), 0930 198, 1330 172, 1730 170, 2200 152 vs POC 148, 0530 124: all consistent.

---

## 3. Time-gating

- **Pass:** a new lab set resulted before every stop (0625, 1025, 1425, 1825, 2255, 0255, 0625); a new full assessment at every stop; vitals and POC charted only to 0700; D2 weight on the I&O record; every orderedAt <= start; stoppedEarly on every early-stopped order; every note quotes only results already back (I checked each row of section 13, including 0430 UA 0300, 0645 BHB 0625, 1030 BHB 1025 and A1c 1000, 1230 TSH 1130, 1840 BHB 1825, D2 0330 set 7 0255, D2 0645 C-peptide 0600 and tTG 0500).
- **SHOULD FIX, two active diet orders from 0700:** the NPO order and "Diet: sugar-free clear liquids; begin when NPO is discontinued" both show active from 0700. A student sees a contradiction and the answer to the stop 2 action. **Fix:** put the next step inside the NPO order text ("... then sugar-free clear liquids") and have **Petrakis enter the clear-liquid order at D1 1105** (orderedAt 1105, start 1105, SE **1900**) after the RN reports the discontinuation. Also end the clear liquids at **1900**, not 1840, so there is no 20-min gap before the consistent-carbohydrate diet starts at 1900.
- **SHOULD FIX, the 1030 Petrakis note gives away the order to discontinue:** "Nausea gone; **RN may advance diet per protocol**." Section 13 says no note mentions the NPO order, but this one points at it 30 minutes before the stop. Change to "Nausea gone." (The criteria are already in the order.)
- **NICE TO HAVE:** the bicarbonate order is written at 0540 to start at 0700. All the admission orders start 0700, so it is consistent, but a physician who thinks bicarbonate is needed for "severe acidosis" would not wait 80 min. Add to the order text "pharmacy to compound; hang on arrival to step-down" so the timing reads naturally.

---

## 4. Teaching design

- **Quintessential course:** yes. Arrival with Kussmaul and fruity breath, fluids first, K before insulin, dextrose under 250, K falling on insulin, resolution, overlap, emotional reaction, a low, survival skills, discharge readiness: each appears once, in textbook order. The CJMM step per stop is sensible.
- **One big idea per stop:** clear at stops 2-7. **Stop 1** carries five (Kussmaul, fluid choice by corrected Na, K before insulin, the bicarbonate catch, the newest K/rider). NICE TO HAVE: name the big idea "**Recognize DKA cues and act on the newest results**," and leave the fluid-type reasoning to the debrief if time is short.
- **Quick Checks:** correct, single-answer and NCLEX-like with good tempting wrong answers, except:
  - Stop 4 Q1 (MUST FIX via 1a).
  - Stop 1 Q2 (SHOULD FIX via 1d).
  - Stop 5 Q3 and stop 6 Q2/Q3 (rewrite with 1c).
  - Stop 4 Q2 wording "gap" (NICE).
  - Stop 1 Q1 uses the arrival gas (pH 7.14 / pCO2 19). NICE TO HAVE: use the newest (0530: pH 7.24, pCO2 22, Winter's 21.8 +/- 2), in keeping with stop 1's "newest result" lesson.
- **Planted errors:** both realistic and distinct, by two authors. Bicarbonate "for bicarbonate 7" at pH 7.24 is a believable reflex order, and the catch (pH, not HCO3; K drops) is clear. KCl 20 mEq/100 mL over 1 h is a real ICU order written for a patient with only peripheral lines; the catch (10 mEq/h peripheral, one rider at a time) is the instructor's own rule. Good. Neither appears in the series or Caleb.
- **Order to discontinue (NPO):** natural and nurse-driven through the diet-advancement text. Fix the two diet-order and note give-aways in section 3.
- **Patient errors at stop 7** (pen priming, "skip insulin when sick") are classic; pen teach-back problems also appear in Denise (dka3), but the priming specifically is new. Fine.

---

## 5. Contradictions, realism, wording, names

- **Names:** every staff, patient and family name grepped across `casestudy`, `js`, `*.html`: no matches outside this folder. Room SD-6 and MRN SIM-40602 are unused (Caleb SD-3 / SIM-40601).
- **Brand names:** none found (sports drinks, glucose tablets, generic pens). Pen label colors (gray / burgundy) are fine.
- **Meta wording:** none in chart text; "student" and "instructor" appear only in design commentary.
- **NICE TO HAVE, stop 3 Morse:** "gait now normal" (Morse 35) and "steady with stand-by assist" conflict. Write "steady; stand-by assist only for the two IV poles."
- **NICE TO HAVE, mother's arrival:** called at 0600, a 3-hour drive, arrives 1300. Add "after arranging leave and packing for a week" to the stop 2 situation.
- **NICE TO HAVE, D1 0700 sticky note** states the resolution criteria, which answers stop 4 Q1 in advance. Shorten to "DKA protocol: insulin 5.5 units/h fixed; D5/0.45% at 150 when glucose under 250."

---

## MUST FIX
1. **Set 4 meets the 2009/textbook resolution criteria** (glucose 172, CO2 15, pH 7.32). Change set 4 to CO2 **14**, HCO3 **13.4**, pCO2 **27**, gap **17** (pH stays 7.32; Winter's 26.1-30.1) everywhere it is quoted, and fix stop 4 Quick Check 1 and section 16 (1a).
2. **D2 0300 low duplicates Maya's beat** (sweaty, shaky, dreams, 64 -> juice -> snack), and the cause blames lispro given 8 h earlier. Use the exercise-after-first-glargine version: dinner 70%, hallway laps 2215-2255, POC **58** -> tablets -> **66** -> juice -> **94** -> snack -> 118, with the times, monitor, note and Quick Check changes in 1c.
3. **Stop 3 urine rate "about 70 mL/h"** is wrong: write about **190 mL/h** (250 mL since 1330) (1g).

## SHOULD FIX
4. Stop 1 Quick Check 2: "restored circulation," not "restored volume"; use the newest Na 133 / corrected **137.0** (1d).
5. Fluid deficit about **3.5 L (6%)**, not 5.5 L, with the "net +2.2 L minus insensible" reasoning; split of the 6 kg loss (1d).
6. Section 16: 2009 dextrose at **200**; 2009 bicarbonate at **under 7.0** (100 mmol only under 6.9) (1f, 1h).
7. Monitor D1 1500 **tAmp 0.25, uAmp 0**; remove "tiny U wave" (1g).
8. Diet orders: NPO text carries the next step; clear liquids ordered by Petrakis at **1105**, SE **1900** (section 3).
9. Remove "RN may advance diet per protocol" from the D1 1030 note (section 3).
10. Discharge: add a **Wednesday-morning phone check** and a **0300 home check the first night** (or discharge Wednesday) (1k).

## NICE TO HAVE
11. Extra K check about 2 h after insulin started (0500) (1e).
12. Rider 4 timing after the 2-min pause (1807-1907; block volumes 88 / 12 mL) (1g).
13. One instructor line that the peripheral K table is conservative vs the consensus (1g); cramps explained by Mg/phos.
14. "About 2.4 L" in the 0630 ED note; pens arrive 1850; "break in insulin coverage" wording (1d, 1i).
15. C-peptide and TSH caveats; next-day reference-lab wording; A1c and weight-history wording (1j).
16. Stop 1 big idea narrowed; stop 1 Q1 on the newest gas (section 4).
17. Morse/stand-by wording, mother's arrival reason, shorter 0700 sticky note, "hang on arrival" in the bicarbonate order text (sections 3, 5).

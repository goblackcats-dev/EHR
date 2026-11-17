# Independent key review: Nora Whitcombe team case study (new-onset T1DM in DKA)

Reviewer role: nursing faculty (med-surg, NCLEX item writing). Reviewed 2026-11-17.
Sources checked: INSTRUCTOR_CASESTUDY_KEY.md, CASE_STUDY_PACKET.pdf (pdftotext), patient.json (labs by `availableAt`, orders, MAR, I&O, flowsheet rows, notes), monitor.html NORA rows, DESIGN.md, EVIDENCE.md, team-case-study SKILL.md.

## Overall verdict

The key is very accurate. Every lab value, anion gap, corrected sodium, eAG, I&O rate, rider time, order time and monitor value I checked matches patient.json and monitor.html (about 150 data points). The two planted errors (bicarbonate 0700, KCl 20 mEq/h 1500) and the NPO discontinuation are sound and well supported by the chart. Potassium, insulin, hypoglycemia, sick-day and survival-skills teaching are clinically correct. No Quick Check answer or model answer is printed in the student packet.

The problems are in a few Quick Check items: one where the packet's own goals point to a wrong answer, one with a textbook conflict, one that leaks a future result, a few step labels that do not fit, and one factual timing error in the key.

---

## MUST FIX

### M1. Stop 4 (1900) Quick Check 1: the packet's own tracker supports wrong answer D
- **Where:** Packet p.7 QC1; key "1900 Quick Check" row 1; tracker p.3 row "Anion gap (latest) — Goal: 12 or less"; final evaluation row "Ketones and acid — Gap 12 or less; BHB under 0.6; ...".
- **Problem:** Option D, "Neither: the gap must be 12 or less", is what a careful student gets from the printed tracker goal (gap 12 or less), because the 1730 gap is 14. Ignatavicius-style teaching often lists "anion gap normal" as a resolution sign, and many nursing texts drop the 2009 "2 of 3" nuance. So a student following the textbook, or the packet's own goal row, can reasonably pick D. The key claims "1730 passes under both rules" and names A as the tempting answer, but D is the real trap. The key's textbook section says no Quick Check answer changes, which is not safe here.
- **Fix (stem):** `1. [Evaluate outcomes] Use the resolution rule in Nora's lab order (BHB under 0.6 AND pH 7.3 or more OR CO2 18 or more). Which lab set shows DKA resolved?`
- **Fix (option D):** `☐ D Neither: glucose must be under 100 first`
- **Fix (tracker goal, p.3):** change "12 or less" to `Closing toward 12 (not needed for resolution)`
- **Fix (key, tempting wrong answer):** `D (if you used the gap goal): a normal gap is a recovery goal, not part of the 2024 definition. Under the older rule, 2 of 3 is enough (HCO3 18 and pH 7.34 pass; gap 14 does not need to). A: a pH over 7.3 and a glucose under 200 look "done".`
- **Fix (key textbook table, "Quick Checks that touch a textbook difference"):** add `stop 4 Q1 also touches the gap: some texts list a normal gap as a resolution sign; the stem now names the order's rule.`

### M2. Stop 5 (2300) key: the rebound-check timing is wrong
- **Where:** Key, 2300 "RESULTS & LABS pair" model.
- **Problem:** "No rebound ketosis: BHB 0.3, gap 13, CO2 20 **two hours** after the drip stopped." The drip stopped at 2100 and the labs were drawn at 2200, which is **one hour** later (BHB resulted 2255). The instructor may say this aloud, and the overlap teaching depends on the timing.
- **Fix text:** `No rebound ketosis: BHB 0.3, gap 13, CO2 20 one hour after the drip stopped (3 hours after glargine); the 0200 set rechecks it.`

### M3. Final stop (0700) Quick Check 3 leaks a future result and needs data not yet visible
- **Where:** Packet p.10 QC3 option B; key final Quick Check row 3.
- **Problem:** Option B, "Positive islet autoantibodies, with a low C-peptide", states as fact a result that is still **pending** in the chart at Tue 0700. It is positive only in the instructor-only Friday result. A student checking the chart sees "Pending" and may reject B because no positive result exists. The option also gives away the later result.
- **Fix (stem):** `3. [Analyze cues] Her antibody tests are still pending. Which result, when it is back, would best confirm autoimmune type 1 diabetes?`
- **Fix (option B):** `☐ B Islet autoantibodies (GAD65, IA-2), together with her low C-peptide`
- **Fix (key why):** keep it as written, and add `the antibodies are pending at this stop; reveal the Friday result only in the debrief.`

---

## SHOULD FIX

### S1. Stop 2 (1100) Quick Check 1: textbook conflict on the insulin rate
- **Where:** Packet p.5 QC1, option B; key textbook table.
- **Problem:** Ignatavicius and the 2009 ADA algorithm teach "add dextrose AND lower the insulin (0.02-0.05 unit/kg/h)" at glucose about 200. The 2024 consensus also allows lowering the insulin to 0.05. Option B ("Lower the insulin drip to half") is therefore what a textbook student may choose. C is right only because Nora's protocol keeps the fixed rate. The key's list of Quick Checks that touch a textbook difference leaves this item out.
- **Fix (stem):** `1. [Take action] At 0800 her glucose was 222 and the anion gap was still open. What does Nora's DKA protocol (the dextrose table) call for?`
- **Fix (option B):** `☐ B Lower the insulin drip to half and keep the same fluid` (wrong because no dextrose is added)
- **Fix (key why, add):** `Some textbooks lower the insulin when dextrose starts; Nora's order set keeps 5.5 units/h and lowers it only at 70-99. Either way, dextrose goes in and the insulin never stops.` Add stop 2 Q1 to the "Quick Checks that touch a textbook difference" line.

### S2. Clinical judgment step labels that do not fit the item
- **Stop 5 Q1** ("Which response is best?") is labelled Recognize cues. Choosing a response is **Take action**. Change it to `[Take action]`.
- **Stop 5 Q3** ("Best action?") is labelled Analyze cues. Change it to `[Take action]`, or keep the label and change the stem to `What do these cues point to, and what should the nurse do?`
- **Stop 3 Q3** ("The insulin should be:") is labelled Prioritize hypotheses. It is a decision, so change it to `[Take action]`.
- **Stop 2 Q3** ("Which findings are criteria?") is labelled Take action. Matching findings to the criteria is **Recognize cues**. Change it to `[Recognize cues]`, and the stem to `The NPO order lets the RN stop it when its criteria are met. Which of these are the order's criteria? Select all.`
- Update the matching key rows. The big-idea table step for stop 5 already says "Recognize and analyze cues"; add "then take action".

### S3. Stop 6 (0300) Quick Check 3: the stem does not fit option D
- **Where:** Packet p.9 QC3.
- **Problem:** "Which cues **raised her risk** of a low?" The 0200 lab glucose of 84 did not raise her risk. It was a **warning** that she was already falling. Strict readers will leave D unmarked, yet D is keyed correct. DESIGN.md wrote this item as "Which earlier cue pointed to a coming low?"
- **Fix (stem):** `3. [Analyze cues] Which cues pointed to a low tonight? Select all.`

### S4. Stop 6 (0300) key: "level 1 low" understates this event
- **Where:** Key, 0300 "What changed since the last stop".
- **Problem:** "level 1 low under 70; 58 is not under 54". By number that is true. But ADA level 3 is defined by altered mental status that needs help from another person, whatever the number. She was hard to rouse and confused at first. Calling it simply "level 1" may teach students that confusion at 58 is a mild event.
- **Fix text:** `Worse: glucose 148 at 2200 to 58 at 0300, with confusion and sweating. By number it is level 1 (54-69), but she was hard to rouse at first: treat any confusion as serious, and note that she "didn't feel it coming". Treated: 66, then 94; HR 108 to 90. Ketones still clear.`

### S5. Final stop: no Quick Check tests the stop's big idea (teach-back)
- **Where:** Packet p.10; key final big idea ("Teach-back, not 'do you understand?'").
- **Problem:** The skill requires the Quick Checks to target the stop's one big idea. None of the three tests teach-back or return demonstration. QC3 (antibodies) is off-topic for discharge readiness.
- **Fix (replace QC3, or add it as a 4th item if the page fits):**
  `3. [Evaluate outcomes] Which best shows that Julia can give glucagon at home?`
  `☐ A She says, "Yes, I understand."  ☐ B She reads the handout aloud  ☐ C She shows each step on the glucagon trainer and tells you when to call 911  ☐ D She watches the nurse give it`
  Key: `Answer C. Why: return demonstration plus teach-back proves the skill; "do you understand?" proves nothing. Tempting wrong: A, because it is quick and polite. Topic: patient education: teach-back and return demonstration.`
  If you keep the antibody item, use the M3 wording.

### S6. Quick Check stems give away the situation blanks
- **Where:** All stops. The worst case is stop 4: QC1 prints all four of the 1730 values the situation asks for (BHB 0.5, pH 7.34, CO2 18, gap 14). Others:
  - 0700 QC2 prints K 5.8 and pH 7.14 (both are blanks).
  - 1100 QC1 prints 222, and QC2 prints K 4.1.
  - 1500 QC1 prints K 3.6, and QC3 prints BHB 1.3.
  - 0300: the QC1 stem "can swallow" is the blank answer.
- **Problem:** The situation box exists to make students find facts in the chart. Copying from the Quick Check on the same page defeats it.
- **Fix:** At stop 4, make the QC1 options `A The 1330 set  B The 1730 set  C Both, since glucose is under 200 in each  D Neither: glucose must be under 100 first` (students then look up the values). Elsewhere, either accept the overlap or remove the duplicated value from the blank. For example, at 0300 change the blank to plain text ("she is oriented and can swallow") and turn "[subcutaneous insulin]" plus the K value into the blanks.

### S7. Timing: the final stop and the 0700 stop are not realistic in 14 minutes
- **Where:** Key run of show; packet pp.4, 10-11.
- **Problem:** Each stop has about 7 working minutes. In that time students fill 6-10 situation blanks, a vitals row, three pair boxes, the tracker, actions, priorities and an SBAR, and answer three Quick Checks on their own. At 0700 they also fill the 4-row DKA map. The final stop covers two full pages: an 8-row evaluation table, a verdict, a handoff SBAR, the home insulin plan, four teaching boxes, teach-back and readiness. That is at least 20-25 minutes of work.
- **Fix (run of show text):** `Final 0700 | 1:27-1:47 | (20 min) ...` and `2300 | 1:01-1:13 | (12 min; lighter stop, no lab math) ...`. Shorten the debrief to 8 minutes (pick 4-5 questions). Alternatively, assign the DKA map as pre-class work and tell the instructor that final page 2 may be finished by pairs in parallel (Meds pair: home plan; Vitals pair: survival skills; Results pair: sick-day and low-glucose boxes).

### S8. Stop 6 Quick Check 2 prints the 0317 value before the instructor says it
- **Where:** Packet p.9 QC2, "At 0317 her glucose is 66."
- **Problem:** The second-round treatment is the stop's safety catch. Printing 66 on the page lets students see the course of the stop before you reveal it.
- **Fix:** `2. [Evaluate outcomes] 15 minutes after the tablets, her recheck is still under 70. What next?`

---

## NICE

- **N1. Stop 4 situation, CO2 blank.** The chart shows both serum CO2 18 (BMP) and gas HCO3 17.2. Write the prompt as `CO2 (BMP) ________` so that no student argues "17.2 is under 18". The pH of 7.34 meets the rule anyway.
- **N2. Stop 1 QC1 "why".** Winter's uses the gas HCO3 9.2 (21.8). With serum CO2 10 it gives 23. Add `(gas HCO3 9.2)` so the math is reproducible.
- **N3. Chart inconsistency at 0300.** The GU flowsheet says "Voided once at about 0200", while the I&O and the key say "void 0130 300 mL". Align the flowsheet row to `Voided once at 0130`.
- **N4. Final weight.** "About 1 kg of water back" compares an ED bed scale (55.0) with a standing scale (56.2). Add `(different scales; trend only)`.
- **N5. Stop 4 Meds model.** By the rider table, K 3.9 at 1730 would call for 40 mEq. The provider chose KCl ER 20 mEq by mouth because the protocol ends with the drip. Add one line so a sharp team that asks "why only 20?" gets an answer: `Provider's choice: eating, protocol ends at 2100; recheck 2200 (K 4.0).`
- **N6. Stop 5 QC3 option D.** "Check her glucose every hour until morning" is not clearly wrong to a cautious student. Sharpen it to `D Wake her every hour for a glucose check until morning (no snack)`.
- **N7. Stop 4 QC3.** The glargine order's own rationale in the chart prints "0.5 unit/kg/day x 55.0 kg = 27.5 ... 13.75, rounded to 14". That is fine for learning, but the key could mention that students may find the answer there.
- **N8. Brand names.** The chart orders carry real brand names (LANTUS, HUMALOG, HUMULIN R, ZOFRAN, TYLENOL, K-DUR), and the key's "gray-label / burgundy-label" pens copy real products. The packet itself is clean. Consider generic-only names in the order text if the "no real brand names" rule should cover the chart too.
- **N9. Reflection page "Team: ____".** The skill says never to print "Team name" on the student packet. This is inherited from the addison template. Decide whether to remove it in the template.
- **N10. Stop 2 QC3 tempting wrong answer.** B is the realistic error. Also mention E, which some students skip as "not clinical", in the key.

## Checked and correct (no action)

- **Labs and gaps.** All labs, gaps, corrected Na (137.4, 137.0), eAG 286, BHB fall rate and the 14.5 h to resolution match patient.json. All `availableAt` times fit their stop: HbA1c 1000, TSH 1130, BHB 1730 at 1825, 0200 set at 0245-0255, tTG at Tue 0500, C-peptide at Tue 0600.
- **Rates and doses.** The urine rates (225, 225, 213, 175, 138, 75, 150 mL/h), rider times (0715; 1030 and 1130; 1505-1805), MgSO4 and transition times, lispro correction (0 at 168 and at 122) and the hypoglycemia sequence (0302, 0317, 0318, 0333, 0335, 0400 order at 0320) are all right.
- **Monitor.** The monitor table matches monitor.html NORA rows, including the MAPs.
- **Situation blanks.** All blanks can be filled from the chart, or from the instructor aloud, at their own stop.
- **Answer leaks.** No Quick Check answer, "why" or model answer appears in the packet.
- **Format.** Format rules are followed: charge line, a blank vitals row only, pair boxes without hints, the tracker wording ("Compared with the ED" at stop 1), no "What changed" at stop 1, the cover pathophysiology, the rubric's completion-based Quick Check scoring, and the cover statement.
- **Safety teaching.** Safety teaching is correct:
  - K before insulin; hold at under 3.5 (3.3 in older texts).
  - Peripheral K no more than 10 mEq/h, one rider at a time, at most 4 in a row, urine 28 mL/h or more; never push.
  - Bicarbonate only at pH under 7.0.
  - "Dextrose up, never insulin off".
  - Basal insulin at least 2 h before the drip stops.
  - Rule of 15, repeated until 70 or more, then a snack; IV dextrose or glucagon only if she cannot swallow.
  - Sick-day rules: never stop basal; glucose and ketones every 2-4 h; fluids; when to call or go to the ED.
  - Pen technique: prime 2 units, 90 degrees, hold 10 s.
  - Glucagon by a support person; medical ID; follow-up.

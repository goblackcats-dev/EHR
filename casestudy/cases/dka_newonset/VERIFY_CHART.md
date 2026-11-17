# VERIFY_CHART: Nora Whitcombe (dka_newonset)

Two reviews of `patient.json`: (A) a number-by-number consistency check against `DESIGN.md`, `INSTRUCTOR_GUIDE.md`, `vr_states.json` and the `NORA` rows in `monitor.html`, and (B) a fresh-eyes read by a step-down nurse educator at each of the 7 checkpoints, looking only at what the app shows (time <= checkpoint, using the app's own rules from `getVisibleCanonicalCase`). Scripts are in the session scratchpad (`chart_nora/`). No repo files were changed apart from this report.

## Summary

The chart matches the design very closely. All 8 lab sets (values, collected and result times, flags), the gases (H-H and Winter's), the ED vitals, all 46 orders (name, dose, frequency, orderedAt, start, end, stoppedEarly, provider), the MAR states, the insulin, fluid and rider rates, the I&O totals (in 7,598 / out 5,400 / net +2,198), the 20 notes (author, time, and every number quoted) and the monitor rows all agree. No note quotes a result before it was resulted. No vitals or POC glucoses appear after 0700. There are no meta words or brand names (only generic (BRAND) drug names). Potassium riders: 7 riders at 10 mEq/h, never overlapping, at most 4 in a row, none stacked.

Builder choices accepted as listed: NPO SE 1105, 0.9% "0700 Running" with end 0700, no pain score at ED 0300/0500/0615, lispro "Calculate".

---

## MUST FIX

1. **Problem list gives away planted error 2 before the RN call (a time-gating error).**
   - *Where:* `problems[]` `problem_lowk`, availableAt 2027-02-08 14:15.
   - *What:* the details read "Insulin continues (3.5 or more). KCl riders 10 mEq/h, 4 in a row." This is visible from 1415, before Petrakis's 1420 order for KCl 20 mEq/h x 2 and well before the 1510 decision to run 4 protocol riders. At the 1500 stop the chart contradicts itself: the problem list states the correct plan, while the 1445 progress note and the active order call for 20 mEq/h. A student does not have to find the error, because the problem list already gives the answer.
   - *Fix:* change the details to "Insulin continues (3.5 or more). Replace potassium per the peripheral potassium protocol; recheck with the 1730 labs." Another option is to give the "4 riders in a row" wording its own availableAt of 1510.

2. **The neuro row keeps "my legs feel heavy" at 1900 and 2300 (it contradicts the same assessment set).**
   - *Where:* the assessment NEURO rows collected 2027-02-08 19:00 and 23:00 (abnormal: true).
   - *What:* at 1900 the mobility row says "Calf cramps gone; steady," and at 2300 she has just walked fast hallway laps for 40 minutes. Carrying the 1500 complaint forward makes it look as if the low-potassium symptoms are still there. This sends students looking for a K problem that does not exist.
   - *Fix:* NEURO at 1900: "Alert, oriented x4; follows commands; pupils equal and reactive" (abnormal false). At 2300: the same, plus "tired, tearful."

## SHOULD FIX

1. **The device status never changes over 24 h.**
   - *Where:* `devices[]`: left forearm 18 g "Infusing" and right forearm 20 g "Saline lock" (lastAssessment 0630).
   - *What:* the right forearm IV reads "Saline lock" at 1100, 1500 and 1900 while a rider runs. The left forearm IV reads "Infusing main DKA fluid and insulin" at 2300, 0300 and 0700, although both lines have been saline-locked since 2100. The Devices/LDA view contradicts the assessment IV row and the I&O.
   - *Fix:* there is no per-time device status, so use neutral wording. Status "Patent". Left infusing text: "Main DKA fluid and insulin while on the DKA protocol; saline lock after the drip stops." Right: "Potassium riders only (pump 2); saline lock between riders."

2. **The GU row carries "Voiding large amounts" forward through 1900, 2300 and 0300.**
   - *Where:* assessment GU rows at D1 19:00, 23:00 and D2 03:00.
   - *What:* glucose has been 150-170 since noon, and urine is 175 mL/h (1500-1900), 138 mL/h, then 75 mL/h (2300-0300). At 0300, with a glucose of 58, "large amounts of pale yellow urine" is wrong and suggests continuing osmotic diuresis.
   - *Fix:* from 1900: "Voiding clear yellow urine in a hat; no burning" (abnormal false). D2 0700 already says this.

3. **The protocol riders for 1505-1805 are already "Due" on the MAR from 1415.**
   - *Where:* `administrations` kcl_rider_prn_18, slots 1505/1605/1705/1805, availableAt 14:15.
   - *What:* at the 1500 stop the MAR shows KCl 20 mEq at 1500 and 1600, and four 10 mEq riders at 1505-1805 next to them. The 1505 start time came out of the 1510 call (`DESIGN.md` §10 and the 1520 addendum), so showing it at 1415 is early. It also makes planted error 2 look like a duplicate order and not a rate error. A student who gives both would stack the potassium to 30 mEq/h.
   - *Fix:* set availableAt 2027-02-08 15:10 on these four rows. The 1500 MAR then shows only the planted order plus the PRN rider order with its table, and students apply the protocol themselves. Update `INSTRUCTOR_GUIDE.md` line 255 ("KCl riders per protocol") to match.

4. **The rider protocol conflicts with K 3.9 at 1900.**
   - *Where:* the kcl_rider_prn_18 order (Active until 2100) and order_med_kcl_po_42 / the Navarro 1840 note.
   - *What:* the newest K is 3.9 (resulted 1815), and the active protocol table says 3.5-3.9 = 40 mEq (4 riders). The 1730 draw came after only about 2.5 of the 4 riders. A careful student at 1900 may ask whether to start another 4-rider cycle after 1905. Only the PO order's rationale ("the IV potassium protocol ends with the drip") says otherwise.
   - *Fix:* add to the KCl ER instructions (or the transition order): "In place of further IV protocol riders; no more riders after the 4th (1805) finishes."

5. **VR inspectable text gives the answer.**
   - *Where:* `vr_states.json` D1-1500 inspectable "KCl 20 mEq bag on the counter" ("twice the peripheral limit; hold and call"), D2-0300 "chart: 0200 lab glucose ... (the earlier cue)", and the equipment strings "(planted wrong order)".
   - *What:* the file is a developer brief, but if the VR app ever shows `finding` or `condition` text to the learner, these strings give the answer and contain meta wording.
   - *Fix:* keep findings to what is observed ("Label: Potassium chloride 20 mEq/100 mL, infuse over 1 hour"). Move judgments and "planted" notes to a separate `instructorNote` field.

## NICE

1. **The problem list shows old and resolved problems side by side.** "DKA, moderate-to-severe" stays Active next to "DKA resolved Monday 1730". "AKI, prerenal" stays Active next to "AKI resolved". "Hyperkalemia at arrival" stays Active through D2. *Fix:* give the arrival problems time-neutral names (for example "DKA (see newest labs)"), or accept this and point it out in the debrief.

2. **The MAR and the I&O disagree by design.** The I&O blocks after 0700 document the riders, the D5 start and the MgSO4 as infused, while the MAR shows the same doses as "Due". This is the in-class convention, but a student comparing them may be confused. *Fix:* one line in the guide's setup ("I&O shows what the off-going nurse measured; the MAR is yours to chart").

3. **The banner is static.** The encounter fallRisk "High" does not change when Morse is 35 (1500-2300, D2 0700). hospitalDay stays 1 on D2. *Fix:* "See flowsheet" wording, or accept.

4. **The BP cuff is on the IV arm.** BP location is "Right upper arm" (ED and 0700), the same arm as the rider IV, and the monitor cycles the cuff every hour. *Fix:* chart the BP site as a lower leg, or add an instructor prompt.

5. **Two different scales.** The weight is 55.0 kg on the ED bed scale but 56.2 kg on a standing scale. Daily weights should use the same scale. *Fix:* "bed scale" on D2, or keep it as a teaching point.

6. **The glucose tablets show as due before the low is known.** The 0302 "Due" row is visible at exactly 0300 (availableAt 03:00), so the MAR shows glucose tablets due before the student has checked the glucose. *Fix:* availableAt 03:01.

7. **The 0300 GI row is stale.** It still says "declines a snack," carried from 2300. *Fix:* "No nausea; hungry" (hunger is already in the endocrine row).

8. **No breakfast lispro on the MAR.** The guide expects lispro 4 units at 0730 at the D2 0700 stop, but the MAR slots end at 0700. *Fix:* mention in the guide that students may look for it; the 0730 dose is after the course ends.

9. **The VR magnesium pump differs.** `vr_states.json` uses a separate "small single-channel pump" for MgSO4, while `DESIGN.md` §17 puts it on a secondary left-pump channel. Harmless; match one or the other.

10. **Sugar per drink.** The pharmacy and RD notes say "large sports drinks ... about 34 g sugar each." A large (28-32 oz) bottle has nearer 50 g. *Fix:* "about 50 g each (200-250 g a day)", or say "20 oz drinks."

11. **No flush order.** No saline-lock flush order (0.9% NaCl flush PRN) exists for two saline locks. A real chart would have one.

12. **Pharmacy dispensed the bicarbonate.** Pharmacy compounded the bicarbonate bag, and the 0900 pharmacy note says "no bicarbonate unless pH under 7.0" without mentioning the bag it made. This is believable (verification misses happen) but students may ask. Optional one line in the guide.

---

## Part B: fresh-eyes read by stop (what is visible, what a student would do)

- **D1 0700:**
  - *Visible:* ED triage, ECG (peaked T), ED provider, H&P (bicarbonate plan "for bicarbonate 7", written at 0540, before the 0545 pH 7.24), ED nursing and the handoff; lab sets 1-2; ED vitals and the 0700 set. MAR: 0.9% and insulin "0700 Running", 0.45% "0700 Due", bicarbonate "0700 Due", rider "0715 Due". Stickies: potassium rules and the DKA protocol.
  - *Clear and findable:* the newest K 4.7 and pH 7.24, urine 400 at 0610 in the I&O note, corrected Na in the H&P, and the bag change.
  - *Believable:* planted error 1. The H&P shows its own reasoning (bicarbonate 7) beside pH 7.14 in the same note.
  - *Fine:* nothing confusing.
- **D1 1100:**
  - *Visible:* Petrakis 0730 addendum (bicarbonate discontinued), pharmacy note, 1030 progress note, set 3, A1c. NPO is still Active, with its criteria in the instructions.
  - *Findable:* the GI assessment (bowel sounds active, asking to drink) and the I&O (no emesis), so the discontinuation is findable.
  - *Fine:* the riders at 1030 and 1130 match K 4.1.
- **D1 1500:**
  - *Visible:* set 4, the Navarro consult, the 1445 note documenting the plan, the KCl 20 mEq order, MgSO4 and the TSH.
  - *Too easy:* MUST FIX 1 (problem list) and SHOULD FIX 3 (rider Due rows) make the catch too easy. The sticky and the pharmacy note already restate the 10 mEq/h rule, which is acceptable on its own.
  - *Clear:* the T-wave change, calf cramps, Mg 1.7 and the pH 7.32 vs BHB 1.3 point.
- **D1 1900:**
  - *Visible:* the resolution labs, the 1840 transition note, the sticky, glargine "1900 Due", lispro "1915 Due", insulin and D5 "2100 Due", and KCl ER 2000 Pending. The overlap is very clear.
  - *Confusing:* the stale neuro "legs heavy" (MUST FIX 2), the device "Saline lock" while a rider runs, and the K 3.9 vs protocol question (SHOULD FIX 4).
- **D1 2300:**
  - *Visible:* set 6 (BHB 0.3), the I&O, and AKI resolved. There is no provider note, which is fine. The 2200 POC 148 is said aloud only. The lab glucose 152 is visible.
  - *Expected action:* offer the snack and confirm the 0300 check.
  - *Confusing:* the stale "legs heavy", "large amounts" of urine, and the left IV device "Infusing".
- **D2 0300:**
  - *Visible:* the 0200 lab glucose 84 (the cue), the hypoglycemia protocol, and glucose PO "0302 Due".
  - *Clear:* the assessment shows the neuroglycopenic signs. The safe sequence (15 g, recheck, repeat, snack) is supported by the orders.
  - *Stale:* the GU and GI carry-forward text.
- **D2 0700:**
  - *Visible:* the event note, the D2 progress note (discharge criteria), C-peptide, tTG, CBC, weight 56.2 in the I&O note, and antibodies pending.
  - *Clear:* teach-back targets (priming, sick days) are in the education row.
  - *Missing:* there is no breakfast lispro row (NICE 8).

## Checked and consistent (no action)

- **Labs:** sets 1-8, CBC x2, lactate, lipase, hCG, UA, A1c (1000), TSH (1130), tTG/IgA (D2 0500), C-peptide (D2 0600), and antibodies pending. Every gap and corrected Na matches §6.
- **ED vitals:** 0145, 0300, 0500, 0615 and 0700 match §4. There is no vital after 0700, and the POC values 0146-0700 match §7.
- **Orders:** all orders in §10, including the SE ends (bicarbonate 0715, 0.45% 0805, KCl 20 at 1510, drip and protocol 2100, clear liquids 1900) and the MAR discontinuedIndex values.
- **I&O:** all 8 blocks, the per-block arithmetic, the void lists, ice chips at half volume, and the weight note.
- **Notes:** all 20 match §13 for author and time. The numbers quoted were checked against result times: the 0630 ED note (K 0615, BHB 0625), the 1840 note (resulted 1745-1825), the D2 0645 note (C-peptide 0600, tTG 0500) and the others.
- **Monitor:** the 8 `NORA` rows equal DESIGN §18, the guide's stop tables and §7 summary, and the `vr_states.json` monitor and monitorAfter. Pain scores equal the assessment pain rows.
- **Language:** no student, scenario, simulation, planted, unsafe or Quick Check wording in `patient.json`. Brand names appear only as generic (BRAND): ZOFRAN, HUMULIN R, TYLENOL, LANTUS, HUMALOG, K-DUR.

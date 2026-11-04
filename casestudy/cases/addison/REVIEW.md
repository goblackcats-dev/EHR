# Independent review: Lauren Mitchell, adrenal crisis (CS-ADDISON-1)

Reviewer stance: ICU/med-surg nurse educator, clinical pharmacist, endocrinologist. Scope: DESIGN.md, INSTRUCTOR_GUIDE.md, gen/*.js, notes/*.json, gen/ecg/make_ecgs.py, patient.json, the monitor.html `ADDISON` rows, and the case running in the app (Playwright, Chromium, all 7 checkpoints).

Rebuilt after the changes with `python3 gen/ecg/make_ecgs.py` (gave the same PNGs), `node gen/assemble.js` and `node tools/make-prebuilt.js`. In the app: import validation gave 0 errors. No page or console errors at any checkpoint. Notes, orders, MAR, labs and stickies stay hidden until their time.

## Checked and found correct (no change)
- **Treatment.** Hydrocortisone 100 mg IV at 0420, 14 min after the cortisol/ACTH draw at 0406. Then 50 mg IV q6h (1000/1600/2200/0400), which is 200 mg/24 h. Fluids: EMS NS 500 mL, then NS 1 L over 30 min and 1 L over 60 min, then D5NS. D50 25 g IV for glucose 52 with confusion. Blood cultures, no empiric antibiotics while afebrile. All of this matches the Endocrine Society PAI guideline (2016).
- **Fludrocortisone.** Held while hydrocortisone is more than 50 mg/day and restarted when the dose drops to 50 mg/day. The wording is the same everywhere. The "40 mg hydrocortisone is about 0.1 mg fludrocortisone" equivalence is right.
- **Taper.** Tue 20/20/10 mg, then double the home dose (30 + 10 mg) until the diarrhea has stopped for 24 h, then 15 + 5 mg. Plausible.
- **Sick-day rules.** Double the dose for fever 38 C or higher, triple for 39 C or higher. Repeat a dose vomited within 30 min. Vomiting again or unable to keep pills down: 100 mg IM in the vastus lateralis, then 911/ED. Two Act-O-Vial kits, medical ID, steroid card, return demonstration by both the patient and the husband.
- **Other meds.** Levothyroxine: "steroids first", one missed dose is safe. Enoxaparin 40 mg (Cockcroft-Gault CrCl about 40 mL/min at Cr 1.6). Ondansetron: QTc 428/432 with a hold if QTc is over 500. No sulfonamide anywhere (SMX-TMP allergy). Melatonin instead of diphenhydramine or benzodiazepines.
- **Labs: values, units, ranges, flags.**
  - Anion gaps 14 and 11; BUN/Cr ratio 24 (prerenal).
  - CKD-EPI 2021 eGFRs recomputed: 40, 47, 57, 70, 80, 80, 92.
  - Eosinophilia 7%, falling to 0.4% on steroid. Urine Na 48 despite dehydration. ACTH 1,240 with cortisol 1.8 = primary AI.
  - Measured osmolality 264 vs calculated 268: gap -4, within normal.
  - Hgb 14.6 to 11.9 and albumin 4.6 to 3.6: dilution.
- **ECGs.** Bazett QTc is right (305/428 at 118 bpm, 345/432 at 94 bpm). Peaked T waves at K 6.0 with normal PR and QRS; T waves normal at 1330 (K 5.5 at 0900, 4.9 at 1300). The images match the text.
- **Sodium.** 126 (0406), 128 (0900), 132 (1300), 133 (1700), 133 (2100), 133 (0100), 134 (0500).
  - The maximum rise inside the first 24 h (to 0406 Tue) is +7.
  - 134 at 0500 is +8 in 25 h. "At the limit, not over" is correct.
  - The +6 in 9 h (0406 to 1300) and +7 in 13 h (to 1700) statements are correct.
- **Potassium trend.** 6.0, 5.5, 4.9, 4.4, 4.0, 3.7, 3.5. The fall is plausible: volume and GFR come back, dextrose and insulin shift K into cells, 200 mg/day hydrocortisone has a mineralocorticoid effect, and stool losses continue.
- **I&O.** Every block adds up. Unit totals: 4,855 in, 4,580 out, net +275. Since EMS: net +2,475. The weight gain of 1.6 kg fits after insensible losses.
- **Monitor and documents agree.** The monitor.html `ADDISON` rows match DESIGN.md and the guide at all 7 checkpoints: HR, BP, RR, SpO2, temperature, rhythm, standing values. MAPs in the guide are correct. The monitor loads the Mitchell scenario by MRN.
- **Orthostatic vitals.** Technique: supine 5 min, then 1 and 3 min standing, with 2 people. Interpretation: positive at 1500 (-14 systolic, HR +22, symptoms); negative at 1900, 2300 and 0700.
- **Timeline and devices.** ED stay 0400-0700 (3 h). Devices are consistent. Code status, DOB/age and diet orders are consistent. The answers to the guide's NCLEX items and model debrief questions are correct.

## Issues found and corrected

| # | Where | What was wrong | Change | Why / source |
|---|---|---|---|---|
| 1 | notes/provider.json, ED provider note (was 0535) | The note quoted events that had not happened yet at 0535: D5NS "from 0600", BP 96/58 and HR 104 (0620 vitals), urine Na 48 and urine osm 420 (resulted 0540). | Moved to **0625** (id `note_ed_provider_202612070625`). | A note can only quote results available when it is written. |
| 2 | notes/nursing.json, ED RN note (was 0630) | Documented the 0640 IV change and the 0645 glucose of 88. | Moved to **0650** (id `note_ed_rn_202612070650`), before the 0655 handoff. | Same rule. |
| 3 | notes/ecg.json + gen/ecg/make_ecgs.py, ECG 1340 | Said "potassium 6.0 to 4.9", but the 1300 K results at 1350. | Now: "potassium 6.0 at 0406 and 5.5 at 0900; the 1300 potassium is pending". | Time gating. |
| 4 | gen/physiology.js + DESIGN.md, urine Na and urine osm | Result time 0540 (the rest of the UA resulted 0530); the original 0535 ED note already quoted them. | Result time **0530**, the same as the UA. | Consistency with the UA. |
| 5 | notes/provider.json, dietitian note 1815 | Quoted the regular-diet order "placed by Dr. Delacroix 1830" (15 min in the future). Also recommended "include salty fluids (broth)" while Na was 133 with a limit of 134. | Now "discussed with Dr. Delacroix, who will place the order". Fluids to thirst; no extra salty fluids or broth until the limit window ends; salty fluids taught for later and sick days. | Time gating. Do not add a sodium load while correction is near the limit; the long-term no-salt-restriction teaching is kept. |
| 6 | gen/treatments.js, D5 0.45% NaCl order (1530); regular diet order (1830); notes/provider.json endocrinology consult rec 4; INSTRUCTOR_GUIDE Q10 and checkpoint 4 (E5) | "Encourage oral fluids and salty broth" / "salt is fine" in the same order or note that sets a sodium limit for over-rapid correction. | Fluids to thirst (water, juice). **No extra salt or salty broth until the sodium limit ends at Tue 0400.** Normal salt to taste long term. DESIGN.md updated to match. | Internal contradiction. Over-rapid correction is driven by water diuresis; extra sodium works against the limit. |
| 7 | notes/provider.json, night hospitalist 2320 | "Replace if under 3.5". The 0310 note and the 0610 KCl order use "3.5 or lower". | Made it the same: "3.5 or lower (still falling, ongoing stool losses, fludrocortisone restarts Tuesday)". | Internal consistency (see the debatable item on K 3.5). |
| 8 | notes/provider.json, endocrinology 0630 | Said "BP 116-120/72-76, HR 74-80" (120/76 and HR 74 are the 0700 values, not yet measured) and "ate a full dinner" (75% everywhere else). | Now BP 116-118/72-74, HR 76-80; "ate 75% of her dinner". | Time gating and consistency. |
| 9 | notes/provider.json, endocrinology consult 1400 summary | Called it "norovirus-type gastroenteritis"; the GI panel results at 1820. | Now "viral gastroenteritis (GI panel pending)". | Time gating. |
| 10 | notes/provider.json, H&P 0640 | "TSH/free T4 sent", but both had resulted at 0615. | Quotes TSH 4.6 / free T4 1.1 with "no dose change now". | Accuracy. |
| 11 | notes/provider.json, ED provider note, hyperkalemia plan | "No calcium or insulin needed". This is too absolute for K 6.0 with ECG changes. | Explains why each is not given: no insulin-dextrose (she is hypoglycemic); calcium gluconate considered and kept at the bedside but not given (QRS normal, K expected to fall fast, Ca 10.6); give it for QRS widening or arrhythmia. | Many hyperkalemia pathways (for example UK Kidney Association 2020) advise IV calcium for any ECG change. Withholding it here is defensible, but the reasoning must be shown. |
| 12 | notes/nursing.json, ED triage note | "Skin warm, dry" disagreed with the ED flowsheet (hands cool, capillary refill about 4 s). | "Skin dry and tanned-looking, hands cool, capillary refill about 4 seconds". | Consistency. |
| 13 | INSTRUCTOR_GUIDE 7.3 | "Limit 8 in any 24 hours for chronic hyponatremia" stated as the general rule. | Goal 4-6. Usual upper limit 10/24 h. High-risk patients (Na 105 or lower, hypokalemia, alcohol use disorder, malnutrition, liver disease) 8/24 h. This case uses the conservative 8 by order and policy. | Verbalis et al., Am J Med 2013 (expert panel); Spasovski et al., EJE 2014. |
| 14 | INSTRUCTOR_GUIDE 7.1 | "after 7.5 L of fluid in and out". | "after about 7.5 L in (net about +2.5 L) and albumin 4.6 to 3.6: dilution". | Clarity and accuracy. |
| 15 | INSTRUCTOR_GUIDE, Setup "Vitals rule" | Not mentioned: the instructor-only Flowsheets bar "Suggested vitals for HH:MM" shows the 0700 set (HR 104, BP 98/60) at every later time. A student or instructor could fill a column with it. | Added a line: ignore the bar for this patient; use the monitor. | Found in the app. |
| 16 | gen/treatments.js, IV hydrocortisone q6h order | Planned `end` Tue 0635 without `stoppedEarly`. The MAR showed the stop and the order detail showed the end date from Monday 0700. It was really an unplanned stop (the endocrinology transition order). | `stoppedEarly: true`. Shows "Discontinued" from 0635 Tue. | Gating and correct status. |
| 17 | **app.js** `getVisibleCanonicalCase` (affects all cases) | An order with `stoppedEarly` showed its future stop before the stop happened: MAR hatching from the stop column, and the End date in the order detail. At 0700 the D5NS row was already hatched from 1500, and the NPO, bed-rest and clear-liquid stop times were visible. That gave away the 1530 fluid change. | Before the stop time, the app shows a copy of the order with no `end` and no `mar.discontinuedIndex`. The case data itself is not changed. Planned stops (no `stoppedEarly`) are still shown. | Gating ("nothing visible early"). Checked at 0700 (no hatch) and 1900 (hatched, status Discontinued). Hypermag also re-tested with no errors. |
| 18 | **app.js** `combineSimDateAndClock`, plus mar-rights.js, handoff.js, offgoing.js, quiz.js, sbar.js (affects all overnight cases) | Due times were dated with the current day. At Mon 1900 the Tue 0400 hydrocortisone showed red "Overdue", and the worklist and MAR badges counted next-morning doses as overdue. | Optional `slotIndex` argument: the MAR slot (hours after the simulation start) now sets the calendar day; callers that have the administration pass it. | Found in the app. Verified: at 1900 the 0400 dose shows "Due" (blue), not "Overdue". |

`student-site/app.js` is a separate older build and was NOT regenerated. Run `node make-student-site.js` if the student site should get fixes 17-18.

## Judged acceptable but debatable (left as is; worth a word in the debrief)
1. **Second hypoglycemia at 1100** (POC 58) while D5NS 150 mL/h is running and about 6.5 h after hydrocortisone 100 mg. This is uncommon in adults: cortisol's effect on glucose is usually apparent within hours. It is plausible with depleted glycogen (about 2.5 days of no intake). D5NS 150 mL/h gives 7.5 g/h, about her basal glucose use at 58 kg. The 0900 serum glucose of 74 foreshadows it. Kept because it is a strong teaching moment.
2. **KCl 20 mEq PO at K 3.5** (the lower limit of normal, not flagged Low). Defensible: K is falling about 0.3/4 h, stool losses continue, fludrocortisone restarts at 0800, and she is on telemetry. Many protocols start replacement below 3.5. If you want an unambiguous trigger, change the 0500 K to 3.4 (Low flag) everywhere: DESIGN, physiology.js, notes, guide and debrief trend list.
3. **D5 0.45% NaCl at 100 mL/h as the response to +6 in 9 h**, instead of D5W matched to urine output and/or a desmopressin clamp. Reasonable because the limit had not yet been reached; the notes give D5W/DDAVP as the escalation.
4. **Endocrinology at 1400 recommends a lower-sodium fluid**, but the change happens at 1530 after the RN's SBAR. This is realistic (recommendations sit until someone closes the loop) and keeps the student's call central. An instructor could point it out as a communication gap.
5. **Fludrocortisone restarts at exactly 50 mg/day.** Sources differ on whether the cut-off is "more than 50" or "50 or more" mg/day. Restarting on the first 50 mg day and the coming 40 mg days is clinically sensible; the case states "more than 50" consistently.
6. **Orthostatic criterion: HR rise of 30 or more.** Some nursing texts use 20. The 1500 result is positive either way (HR +22 and symptoms); the later checks are negative either way.
7. **Oral switch on Tue** while stools are still soft. Acceptable: no vomiting for 26 h, eating, and the taper is stress-level (50 mg/day, then 40 mg/day).
8. **I&O 2300-0300** charts IV 400 mL even though the IV infiltrated around 0240. The infiltrated volume (about 15-30 mL) is within rounding.
9. **Device panel.** The right-forearm IV still reads "Infusing: D5NS 150 mL/h" after 1530 and through the 0240 infiltration. Device records are static by design; the students are expected to update or remove it.
10. **Import validation warnings (10).** "Active problem ... not clearly addressed in a hospitalist progress note" is a string-match heuristic: it needs the exact problem name in the note body. All 10 problems are addressed in substance (H&P, 0915, 1535, 2320, 0615 notes). The other built-in cases (hypermag, burn_icu, hip_orif) have the same warnings. Not a real defect; left.
11. **Stool C. diff/GI panel order.** The planned `end` (0945, the collection time) is visible in the order detail from 0730. Minor; it is a planned "complete on collection" order.
12. **K 6.0** is flagged High, not Critical; the critical threshold is "over 6.0" (the BMP order says so). The labs differ on this, and the case is internally consistent.

## Case study review

Fresh final review of the 2-hour team case study (CASE_STUDY_PACKET 12 pages, INSTRUCTOR_CASESTUDY_KEY 16 pages). I rendered and read every page and checked it against patient.json, DESIGN.md, INSTRUCTOR_GUIDE.md and the monitor.html `ADDISON` rows. I also checked the I&O display in the app with Playwright.

**Checked and correct (no change):**
- Every vital and MAP on the "prev" rows and in the tracker model.
- Every lab value, range and result time on each page.
- Sodium arithmetic (+6 in 9 h, +7 in 13 h, +8 in 25 h), the potassium trend and the urine mL/h for each block.
- Charge rotation: 7 students, each is charge once.
- Rubric adds to 20 (5+6+5+4). Individual check is /4 (charge 1 + reflection 2 + peer check 1).
- Run of show ends at 2:00.
- Nothing is on a page before it is available in the chart. The screenshots are legible and taken at their checkpoint: MAR 0700 (hatched fludrocortisone, "1000 Due" on the hydrocortisone row), Chart Review > Cardiology "View tracing" 0700, Endocrine tree 1500, sodium history 1900.
- Medical content agrees with the Endocrine Society 2016 PAI guideline: stress-dose hydrocortisone on time, fluids, D50 for symptomatic hypoglycemia, fludrocortisone held above 50 mg/day and restarted at 50 mg/day, the 8/24 h sodium limit, potassium replacement at 3.5 or lower, the taper, sick-day rules (double at 38 C or for illness, triple at 39 C, repeat a dose vomited within 30 min), 100 mg IM Act-O-Vial with return demonstration by both, ID and card, and norovirus contact precautions for 48 h after symptoms end.
- The instructor's goals are all covered: hormone map (pathophysiology), assessment boxes, interventions and the standard plan, the response tracker at every stop, and the final evaluation table with a verdict.

**Fixed:**
| # | Where | Problem | Change |
|---|---|---|---|
| 1 | Flowsheets > Intake / Output (report: the 1100 stool was missing and the day shift showed 3,360 in) | Two causes. (a) **Data:** each stool had a long free-text label ("Liquid stool (0945, sample sent)"). The app makes a new row from each label, so the 250 mL showed in an extra row at the bottom and the standard Stool row was empty. (b) **App:** `renderIoTotals` assigns a block to a shift by its `collected` time as a point, so a block filed at exactly 0700 (the ED block) counted in the day shift. This also affects every block ending at 0700/1900 in all cases. | gen/physiology.js: stool blocks use `otherLabel: 'Stool'` with the details moved to the note. The combined blocks are labelled "Emesis + stool (ED)" and "Emesis + diarrhea (home estimate)". D50 is charted as "IV med" (IV fluid 2,650 / 600). Every block has `periodEnd: true`. flowsheet-charting.js `ioEnd`: a block with `periodEnd` counts in the shift it closes (opt-in, so the shift totals of hypermag, burn_icu and hip_orif are unchanged; burn_icu's key quotes `ehr_io_totals.txt` as currently displayed). app.js `flowsheetIoParts`: the case IV volume goes in the standard "IV fluid" row instead of a separate "IV" row (all cases; totals unchanged). Verified at 1100: Stool 250 in the 1100 column; night 3,500/2,900; day 660/630. At Tue 0700: day 2,335/2,780, night 2,520/1,800, last 24 h 4,855/4,580. Hypermag, burn_icu and hip_orif: shift totals the same as before, no page errors. Version bumped to v113; student.html and student-site rebuilt. |
| 2 | notes/provider.json, dietitian 1815 | "Clear liquids since 1400: broth, ..." was the wrong time (the order is 1345). Broth also clashed with the 1530 "no salty broth until the limit ends" order. | "Clear liquids since 1345: ginger ale, apple juice and gelatin". |
| 3 | content2.py, 0700 situation and model SBAR | "In the ED she got ... about 2.5 L of fluid": EMS gave 500 mL of the 2.5 L of saline. | "EMS and the ED gave her 2.5 L of saline; the ED also gave dextrose, hydrocortisone 100 mg IV at 0420 and started D5NS." |
| 4 | content2.py, 1100 key | "(worse than 0900)" pointed to a finding that is not in the chart. | "(at 0900 she knew the date)", which is the guide's portrayal. |
| 5 | monvals.py, key I&O lines | Did not match the flowsheet rows after fix 1. | ED: "2,700 IV (fluids 2,650 + D50 50)". 1100-1500: "IV fluid 600 + D50 50 charted as IV med". |
| 6 | check_facts.py | No check that the I&O blocks keep the shift rule. | Added a `periodEnd` check. |

Rebuilt: `node gen/assemble.js`, `node tools/make-prebuilt.js`, `bash student/build_all.sh` (12 pages, 0 layout problems, check_facts ALL CHECKS PASSED, 327 values).

**Questions for the instructor:**
- Should the other cases get the shift rule too? hypermag, hip_orif and burn_icu still count their 0700 and 1900 blocks in the next shift. burn_icu's key and `ehr_io_totals.txt` were written to the current display, so changing it means regenerating them.
- The hormone map labels ACTH "very high" at 0700, before the 1440 result. It is a pathophysiology fact for primary AI, so I left it. Change it to "ACTH (?)" if you want students to predict it.

# Clinical care-plan case study: blueprint

For ADN Med-Surg II. One packet per patient, built around the nursing process (ADPIE), individual, open book, take-home,
about 6 hours, 100 points, **passing = 78**. Made only for the saved patients the instructor names. It is a faculty tool: it is not part of the student EHR.

> **Answer keys are stored in this repo** (the instructor chose this). The repo and its website are public, so students could find the files if they search for them. Each case lives in `cases/<name>/` with `patient.json`, `author.py` (writes the key), `content.json`, and `out/` (student packet, key, PDF previews).

## How a case study is made (the workflow)
1. Instructor says which patient and uploads its JSON (Case Builder export or the student file).
2. `python3 extract_facts.py patient.json > facts.txt` prints the chart facts (problems, meds, labs with trends, vitals, assessments, I&O, notes).
3. Claude writes `cases/<name>/author.py` (which writes `content.json`) for that patient (questions, answer key, point values) following this blueprint.
4. `python3 build_casestudy.py content.json patient.json out/` writes `<caseCode>_STUDENT.docx` and `<caseCode>_KEY.docx` (answer key, scoring rules, score sheet).
5. Instructor prints the student packet. Students use the student EHR (`student.html`, Student View) with the same patient.
6. Students photograph every page. Claude scores the photos against the key (see Grading below) and returns a score sheet.

## Structure (points total 100)
| Part | Nursing process step | Pts | Min | Item types |
|---|---|---|---|---|
| 1 Assessment: patient data | Assessment | 26 | 75 | basic info, comorbidity table, history, head-to-toe (R/L), vital sign trend, lab table (choose 8 and say why), diagnostics, chart reconciliation (find 3 conflicts) |
| 2 Pathophysiology | Assessment / analysis of cues | 20 | 75 | plain-language pathophys (6 elements), cause-effect chain, findings-to-mechanism table (8 rows), comorbidity interaction questions, treatment, one lab-trend question |
| 3 Pharmacology | Analysis / safe implementation | 14 | 60 | 8-medication table, 3 critical-thinking drug questions tied to this patient, 4 math problems from chart data |
| 4 Diagnoses | Diagnosis | 8 | 30 | 4 prioritized NANDA-I diagnoses (r/t, AEB), priority justification |
| 5 Planning and implementation | Planning / implementation | 14 | 60 | SMART goals + interventions + rationale for top 2, time-sequenced shift plan, SBAR, delegation, teaching plan |
| 6 Evaluation | Evaluation | 8 | 30 | sealed shift-update page (later chart notes + instructor addendum), goal evaluation, new problems, focused note |
| 7 Clinical judgment | Evaluation / NGN | 10 | 30 | select-all, trend matrix, bowtie, highlight cues, ordered response |

## Rules for writing a good case
* **Everything is tied to this patient.** Ask "why" and "what would you do", not definitions. Use real values from the chart.
* **Part 1 is a floor** (chart look-up) so a careful student reliably earns about 20 of 26 points. Pass = 78 should be reachable by a student who works carefully.
* **Include a chart reconciliation** item: list the real conflicts, duplicates and gaps in this chart (generated charts always have some). Verify each against the JSON before listing it.
* **Include at least one "obvious action is wrong" question** (for example, the standard diuretic does little in oliguric ESRD; give antihypertensives after dialysis).
* **Part 6 sealed page:** the builder pulls real chart notes dated after the shift start. Add an instructor addendum (clearly labeled "not in the EHR") that creates teaching/evaluation material that does not contradict the chart. NGN items may be hypothetical and must say so.
* **Every key element has points that add up to the item's points** (or is marked `"bank": true` when students choose from a bank of acceptable answers). The builder prints a warning if an item does not add up, and warns if the total is not 100.
* Check clinical content: doses, hold parameters, ranges, NANDA-I wording. A faculty read-through of the key is recommended.

## content.json (shape)
```
{ meta:{title,course,caseCode,passPct,footer}, studentIntro:[{h,lines}], studentRules:[{h,lines}], keyIntro:[{h,lines}],
  parts:[{id,title,step,minutes,intro,keyNote,items:[ item, ... ]}] }
item = {id, type, points, title, prompt, where, key:{answer, elements:[{t,pts,src}], rules, errors, bank}, ...type fields}
types: fields (label/answer/pts), table (cols,widths,rows,rowH), boxes (subs:[{label,lines}]), box (lines), concept (boxes),
       vitals (times,times_label,rowsLabels,codes; key is computed from the patient file), choice (style single|multi|ordered, options, key.answer),
       matrix (cols,rows,key.answer), bowtie (stem,actions,conditions,params,pickActions,pickParams,key:{condition,actions,params}),
       highlight (statements,key.answer), sealed (banner,intro,maxNotes,maxLines,addendum), text
```

## Grading from photos (what Claude does when you upload pages)
1. Upload the photos of one student's packet (all pages, in any order) and tell Claude which case and key to use.
2. For each page Claude reads the header (student name, page number) and each numbered box, and transcribes what is written, item by item.
3. Each item is scored only against the key: required elements, the point amounts printed beside them, accept equivalent wording, no double counting, no credit for what is not written, spelling ignored. Chart look-up answers are checked against the chart facts.
4. Anything that is illegible, cut off, or ambiguous is scored 0 for that element and **listed for faculty review** (it is never guessed).
5. Claude returns the completed score sheet: points per item and part, total, PASS/NOT PASS at 78, strengths, the items missed with the missing elements, and the review list. Possible integrity flags (identical wording between students) are noted.
6. The instructor makes the final grade. Handwriting photos work best with dark pen, one page per photo, flat, good light, all four corners visible.

## Turn-in (instructor's choice for the burn case study)
Students do not photograph their work. They put the pages in order, fasten them with a paperclip (no staples, so the pages can be scanned) and leave the packet in the instructor's cubby at office G218i. The instructor scans the pages. An item may set `"pageBreak": true` so a large writing box fills its page.

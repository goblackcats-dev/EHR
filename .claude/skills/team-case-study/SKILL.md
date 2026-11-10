---
name: team-case-study
description: Build a printable team case study packet (student packet + instructor key, Word and PDF) from a NursingSim EHR patient, in the instructor's charge-nurse + 3 pairs format. Use when the instructor asks for a "case study", "case study packet" or "team case study" for a patient in casestudy/cases/<id>/, or asks to change the format of an existing one.
---

# Team case study packet from an EHR patient

The instructor teaches a whole class (currently **7 students**) as ONE nursing team caring for one EHR patient.
The clock moves **4 hours at a time** (for example 0700, 1100, 1500, 1900, 2300, 0300, final 0700) and the session lasts **about 2 hours**.
Students use the EHR on their own devices, synced with the instructor through Class Session. The instructor runs the bedside monitor (monitor.html) and speaks for the patient and the provider.

**Template to copy:** `casestudy/cases/addison/student/` (Lauren Mitchell). It is the newest version and already follows every rule below.
`casestudy/cases/hypermag/student2/` (Ray Kessler) is an older version of the same format. It does NOT yet follow the rules dated 2026-11-10.

## Format rules (the instructor's requests; follow all of them)

### Roles
- **Charge nurse**: one student per stop, rotating so each student is charge exactly once. The rotation grid on the cover has one row only: **Charge nurse name**, with one blank per stop.
  The charge nurse runs the section and keeps time. **They get the findings from each pair when the pair is finished.** Pairs report as a pair, not through one "reporting partner".
  The charge nurse decides the top 3 priorities with the team, then **develops and gives the SBAR**.
- **Three pairs, assigned checkpoint by checkpoint.** At every stop each pair gets a new job, and the pairs switch each time. Pairs write their names in that stop's box. The old charge nurse takes the new charge nurse's place in that pair.
  - **Do NOT print a cover table assigning students or letters to pairs** (no "Pair 1: A ___ B ___" and no letters A to G). There is no float with 7 students (1 charge + 3 pairs).
  - If the class size changes, ask the instructor how to place the extra student, for example a trio. Do not bring back the float on your own.
- The three jobs, each with its own color:
  - **Meds & Treatments** (`FFEFC2`)
  - **Vitals & Assessment** (`DCEBFA`)
  - **Results & Labs** (`DDF0E1`)
- Do NOT print anything like "Partner reports for the pair", either on the cover or in the charge bar at the top of each checkpoint.

### Every checkpoint page, top to bottom
1. **Dark bar**: the time and day on the left, "Checkpoint n of N" on the right.
2. **Charge line**: `Charge nurse for this stop: ____   ☐ every pair reported to the charge nurse   ☐ SBAR given`.
3. **SITUATION box: fill in the blanks.** It prompts and guides the students.
   - Write it in content.py with `[[answer]]` markers. The packet prints a blank line about as long as the answer; the key prints `[answer]` in bold.
   - Blanks are for chart-findable facts: values, drugs and doses, times, fluids, precautions. Story lines the instructor reveals stay as plain text.
   - Blanks must not give away later stops.
4. **Vitals row**: ONE blank row with the stop time, which the students fill in. **Never print earlier vitals** (no filled "prev" row).
5. **Three pair boxes**:
   - The header is the pair name plus `Names: ________  ________`. **No question or hint after the header.**
   - Students learn to ask their own questions. The "questions a strong charge nurse asks" go only in the key, for the instructor to prompt with if a team is stuck.
   - One small EHR screenshot may sit at the right of a pair box.
6. **Response tracker line**: "RESPONSE TRACKER (page 3): **Vitals & Assessment pair**, fill in the ___ column ☐", plus better/same/worse.
   - At the first stop, say "Compared with the ED" instead of "Since the last stop".
   - The tracker table itself (page 3) has the banner subtitle "Vitals & Assessment pair fills this in", plus a one-line reminder.
7. **Team boxes**:
   - **First stop:** only **"Actions to suggest (Vitals + Meds pairs)"**. There is NO "What changed since the last stop?" box.
   - **Every later stop:** "What changed since the last stop?" side by side with "Actions to suggest (Vitals + Meds pairs)".
   - The Vitals & Assessment and Meds & Treatments pairs work out the actions together at every stop.
   - **Top 3 priorities**: numbered 1 to 3, with `Charge RN: ________` in the header and no other subtitle.
   - **SBAR to the provider**: S, B, A and R rows. No subtitle.
8. **Prediction for the next 4 hours** and **Charge nurse notes**: no subtitles.

### No subtitles
Do not put italic hint text or questions after box titles unless the instructor asked for that box. The current exceptions are:
- the pair-name line
- `Charge RN:` on the priorities box
- the Vitals & Assessment reminder on the response tracker

### Packet as a whole
- **Header on every page:** "Student name: ______". Each student fills in and turns in their **own packet**, with a paperclip and no staples. Never print "Team name" on the student packet.
- **Front pages:**
  1. Cover:
     - title banner
     - **QUICK PATHOPHYSIOLOGY box** (see below)
     - how the 2 hours work
     - roles (pairs switch jobs every stop)
     - charge nurse rotation grid (names only)
     - turn-in
  2. Patient card plus a concept map tied to the disease, with 1 or 2 small EHR screenshots.
  3. Rubric (20 points, team grade) plus the response tracker table.
- **Quick pathophysiology (required, at the beginning, on the cover):**
  - One shaded box titled "QUICK PATHOPHYSIOLOGY: <disease>", written at a high level for ADN students.
  - 6 or 7 short labeled lines, in this order:
    1. the organ or system and what normally happens
    2. the key hormones, substances or processes: what each does, and what you see when there is **too little** or **too much**
    3. what tips the patient into the acute problem
    4. the main dangers
    5. the treatment logic: why each main treatment is given, plus key safety limits (for example, a correction rate)
    6. nursing focus: what to monitor and teach
  - Plain words, no numbers from the patient's chart.
  - Nothing that gives away a later stop. Check its words against the BAN list in check_facts.py, for example "low glucose" rather than a banned word.
  - The text lives in content2.py as `PATHO_TITLE` and `PATHO`, and the builder's `pathophys()` draws it. If the cover overflows, shorten the "how it works" bullets rather than the pathophysiology.
- **Checkpoint pages**, then the final stop on 2 pages:
  - Page 1: pair boxes, tracker, an evaluation table (arrival vs now, goal met?), and "Our verdict on the treatment".
  - Page 2: what changed and actions, priorities, handoff SBAR, the Meds pair's home plan, discharge teaching boxes, teach-back, ready to go home?
- **Last page:** individual reflection and peer check.
- **Graphics:** few, and small. Prefer boxes and ruled lines to pictures. EHR screenshots are fine, but each must be captured at, or before, the stop where it is printed.
- **Labels the instructor chose:** "Vitals & Assessment" (not "what I noticed"), and "New results and significance" for results.
- **Language:** simple and plain, with short sentences. No real brand or company names in patient content.

### Instructor key (one per case)
Include:
- title page: roles and before-class steps (print one packet per student)
- run of show, with minutes per stop
- a monitor and bedside values table
- per stop:
  - monitor values, I&O and how to portray the patient
  - the **situation with answers**
  - the **questions a strong charge nurse asks**
  - new labs
  - model answers for each pair box, the tracker column, "what changed" (not at stop 1), "actions to suggest", the 3 priorities and the SBAR
  - the prediction, and the instructor's suggested reply as the provider
- final evaluation model, rubric guide, score sheet and debrief questions

## Adapting to a totally different patient or disease
Keep the format exactly. Change only the clinical content:
- **Quick pathophysiology:** write it for the new disease, using the same 6 or 7 line pattern.
- **Concept map on page 2:** use what fits the disease, for example the hormones (adrenal), a fluid and electrolyte map (DKA), or the oxygenation chain (respiratory). Use 3 or 4 rows with the columns "what it normally does" and "what the patient shows". Students fill in the patient column.
- **Response tracker rows:** 8 to 10 measures that show whether the treatment works, each with a goal taken from the instructor guide's evaluation criteria, plus an OVERALL row.
- **Pair job descriptions on the cover:** name the sources for this patient, for example the MAR and drips, the bedside exam items that matter, and the key labs and tests.
- **Stops:** one teaching event per stop (a new result, a complication, a decision), including at least one safety catch and one "is it working?" evaluation. The final stop covers evaluation plus discharge teaching.
- **Things the instructor says aloud:** list the values that are not in the chart, such as the bedside glucose and standing BP, in the key, and remind students on the cover to ask for them.
- **Rubric:** keep 20 points and the same four categories.

## How to build one

1. **The patient must already exist** in `casestudy/cases/<id>/` with patient.json, the notes and INSTRUCTOR_GUIDE.md, and must be checked.
   - Pick stops every 4 hours where something changes, so each stop has one teaching event.
   - Only values the chart already shows at a stop may appear on that stop's page (time-gating).
   - Make sure monitor.html has the patient's rows (BUILTIN by MRN), and that the monitor values match the stops.
2. **Copy the template:** `cp -r casestudy/cases/addison/student casestudy/cases/<id>/student`, then rewrite these files for the new patient:
   - `content2.py`: TITLE, NORMAL ranges as the chart prints them, RUBRIC, TRACKER rows and goals, the concept map (`HORMONES` in the template), the `CP` dict for each stop and `CLOSE` for the final stop, EVAL, DEBRIEF, TIMELINE.
     - Each stop has: `sit` (with `[[blanks]]`), `ask` (key only), `labs`, an optional `shot`, and `key` with meds, noticed, results, changed, pri, S, B, A, R, nxt, pred and track.
   - `monvals.py`: the monitor and bedside values per stop, plus urine/I&O text (`UO`).
   - `build_packet.py` and `build_key.py`: change the patient-specific text (cover banner, patient card, PROVIDER replies, PORTRAY cues, concept map answers, final-page boxes). Keep the layout functions as they are.
   - `check_facts.py`: point it at the new patient.json, the monitor array name, and the per-stop LEAK, BAN and GLU lists (first stop at which each word or value may appear).
   - `capture_shots.js` and `crop_shots.py`: capture each screenshot at its own stop.
   - `dx.py`, `render_check.py` and `build_all.sh`: these are generic, so only change names.
3. **Build:** start a server at the repo root (`npx http-server -p 8123 -s -c-1 .`), run `node .../capture_shots.js` if there are screenshots, then `bash casestudy/cases/<id>/student/build_all.sh`.
4. **Gates (all must pass):**
   - `render_check.py`: PDF pages = logical pages, problems 0, so no page overflows. If a page overflows, shorten the box labels so headers do not wrap, cut ruled lines from 3 to 2, or shrink a screenshot. Do not shrink fonts below about 8 pt.
   - `check_facts.py`: ALL CHECKS PASSED. Every number matches patient.json and monitor.html, there are no leaks of later stops, and no key text appears in the student packet.
   - Look at 2 or 3 rendered pages yourself (`student/out/pages/p-*.png`): the first stop, a stop with a screenshot, and the final pages.
5. **Publish:**
   - Write the case's `meta.json` with `caseCode` and `title`, then run `python3 casestudy/make_index.py` so it shows in the instructor "Case Studies" menu.
   - Bump the `?v=` tags only if app files changed, and add a README change-log line.
   - Commit, push the work branch, then merge into `EHR` and push (the site publishes from `EHR`).
   - Send the instructor the student PDF and the key PDF (SendUserFile).
6. **Tell the instructor** in plain language what the packet covers, its open questions, and that **the answer keys live in the public repo** (a known risk).

## Refining this skill
When the instructor asks for a format change:
1. Make it in the template (`addison/student`).
2. Add the rule above with the date.
3. Offer to apply it to the older packets (for example `hypermag/student2`).

Change history:
- 2026-11-10 (2): no pair or letter table on the cover; pairs are assigned and switch jobs checkpoint by checkpoint; the rotation grid is charge nurse names only; no float; quick ADN-level pathophysiology box at the start of the cover.
- 2026-11-10: charge nurse collects from each whole pair (no reporting partner); fill-in-the-blank situation; no prior vitals; names in pair boxes and no "Charge asks" subtitles; Vitals & Assessment fills the tracker; Actions to suggest (Vitals + Meds pairs) replaces "What we will do next"; no "What changed" at the first stop; Charge RN name on priorities; no subtitles on SBAR or other boxes; "Student name" header with one packet per student.

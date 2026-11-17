# AGENTS.md: NursingSim EHR (read this first)

Instructions for AI coding agents (Codex, Claude Code and others) working in this repository.

## What this project is
**NursingSim EHR**: a static, client-side (plain HTML + JavaScript, no framework, no build step for the app) Epic-style electronic health record for **nursing simulation**. It runs on GitHub Pages. The owner is **nursing faculty, new to coding**: explain things in **plain language**, short sentences, no jargon. They run it in the sim lab and in class (Class session with synced clocks, a Bedside Monitor on a second computer, and soon a VR app). They teach from **Ignatavicius, Rebar & Heimgartner, Medical-Surgical Nursing: Concepts for Clinical Judgment and Collaborative Care, 11th ed. (Elsevier)**.

## Read before working
- Read `README.md` (including the later version entries), `TODO.md`, and `SECURITY.md` for project history, decisions, and student/instructor separation. A to-do entry is not permission to implement unrelated work.
- Before patient work, read the patient's `BRIEF.md`, `DESIGN.md`, `REVIEW.md`, and instructor guide/notes where present, plus any review documents they reference. Some older cases do not have every file; do not invent prior decisions or approvals.
- Read `casestudy/cases/DKA_SERIES.md` before DKA work. Its take-home assessment, lab, and POC-glucose schedule differs from the in-class rules below.

## Branches and publishing
- The site publishes from branch **`EHR`**; the GitHub default branch is currently `main`. Check the working tree and remote, preserve other work, and start a separate `codex/<task>` branch from an up-to-date `EHR`. Do not share another helper's work branch. Do not force-push. Do not rewrite history.
- **Merge into or push directly to `EHR` only after the owner has reviewed the result and explicitly approved the merge.** This overrides the automatic merge/push steps in both Claude skills. Do not enable automatic merging in place of review.
- Ask before anything outward-facing or hard to undo. Never commit secrets (the Cloudflare TURN key lives only in the Cloudflare account, never in this repo).
- **Do not create pull requests unless the owner asks.**

## Where things are
| What | Where |
|---|---|
| Main app (instructor/student EHR) | `index.html`, `app.js`, `styles.css`, `epic.css`, and the feature files (`mar-infusion.js`, `watch.js`, `shared-chart.js`, `handoff.js`, ...) |
| Student version | `student.html` and `student-site/` are **generated**: run `node make-student.js` then `node make-student-site.js` after any change to the app. Never edit them by hand. |
| Bedside Monitor | `monitor.html` (per-patient arrays keyed by MRN) and `monitor-remote.js` |
| Class session (live students, screen view, relay) | `watch.js`, `shared-chart.js`, `quickgive.js` |
| Pre-built patients menu | `prebuilt/index.json` is **generated**: run `node tools/make-prebuilt.js`. A patient's `meta.json` sets its group; `"draft": true` hides it. |
| Case study patients and packets | `casestudy/cases/<id>/` (each has `BRIEF.md`, `DESIGN.md`, `REVIEW.md`, `gen/`, `notes/`, `patient.json`, `INSTRUCTOR_GUIDE.md`, and `student/` for the packet) |
| Case Studies menu index | `casestudy/index.json`, built by `python3 casestudy/make_index.py` |
| Change log (every version) | `README.md` (newest at the top of the change list) |
| To-do list and decisions | `TODO.md` |
| DKA series rules | `casestudy/cases/DKA_SERIES.md` |

## The two skills: read and follow them
These are the owner's process, written as instructions. They are in `.claude/skills/` (Claude's folder) but **apply to any agent**:
- **`.claude/skills/patient-course/SKILL.md`**: building a whole simulated patient (course, chart, instructor guide, monitor rows, VR brief) with a pipeline of independent helper agents and checks. If your tool has subagents, use them as described; otherwise do each role as a separate pass and have an independent second pass review the first.
- **`.claude/skills/team-case-study/SKILL.md`**: building the printable team case study packet and instructor key (charge nurse + 3 pairs, Quick Checks "teach, not grade").
Read both before building or changing a patient or packet. The owner's current directions take precedence over older project instructions. When the owner gives a new rule, add it to the right skill (with the date) and to `casestudy/cases/DKA_SERIES.md` if it is a DKA rule.

## Using the Claude workflows in Codex
- Translate `AskUserQuestion` to a concise clarification when needed, `Agent` / `run_in_background` to available Codex subagents, and `SendUserFile` to a supported downloadable artifact or file link. Give subagents self-contained prompts and keep one writer responsible for a patient build. Verify their reports yourself.
- Preserve the patient-course design gate: prepare the independently reviewed design and a plain-language course summary, then get the owner's OK before building a new patient course. This gate is for patient-course work, not routine documentation or app fixes.
- If independent review or another required tool is unavailable, report that limitation. Do not call a self-review independent or claim an unrun check passed.
- Old absolute paths such as `/opt/pw-browsers/chromium` and `/opt/node22/lib/node_modules/playwright` describe a previous environment. Discover installed equivalents in Codex.

## Rules that apply to every simulated patient (summary; the skills have the full list)
- **Time-gating:** nothing appears in the chart before its time (results use `availableAt`, notes `datetime`, orders `orderedAt`; orders that will be stopped early use `stoppedEarly` so no future stop time shows).
- **In-class patients:** start at **0700 right after the ED**; **checkpoints every 4 hours**; **24 hours = 7 stops fits a 2-hour class**. **Vital signs and bedside glucoses are charted only up to the first stop**; later values come from the Bedside Monitor and the instructor says them aloud.
- **In-class patients: a new full nursing assessment (including the IV site and unchanged rows carried forward) and a new lab set available by every checkpoint.** At most **2 planted order errors per 24 h**, and at least one order the students should **discontinue** (the app lets students discontinue orders with a reason).
- **Every dose after the first stop is `due`** on the MAR. Continuous IV fluids get a Due box at the current hour.
- **Potassium (owner's rule):** peripheral IV riders **max 10 mEq/h**, at most **4 in a row**, **max 20 mEq/L in a peripheral bag**, **40 mEq/L is the central-line cap**; never stack above 10 mEq/h total.
- **VTE prophylaxis only with a documented clot-risk factor.**
- At least one ECG record with an image (`casestudy/tools/ecg_image.py`).
- Plain language; no real brand/company names in patient content except generic (Brand) drug names; unique staff names across patients; no meta words ("student", "scenario", "simulation", "planted") in chart text; show all math (anion gap, corrected sodium, osmolality, Henderson-Hasselbalch and Winter's for every gas).
- Clinical numbers follow current guidelines (for DKA: the 2024 ADA/EASD/JBDS/AACE/DTS hyperglycemic crises consensus; ISPAD 2022 for children). Where the textbook differs, follow the guideline and note the difference for the instructor.

## How to check your work (do all that apply before saying "done")
Run commands from the repository root unless the case documents otherwise. There is no root `package.json` or universal `npm test`. Generators write tracked files; inspect the diff and avoid unrelated rebuilds.
- Documentation-only changes: check referenced paths and commands and run `git diff --check`. No app version bump, patient/PDF build, or generated-site rebuild is needed.
- Syntax: `node --check app.js` (and any JS file you changed). For `monitor.html`, extract its `<script>` and `node --check` it.
- Patient build: `node casestudy/cases/<id>/gen/assemble.js` (it has built-in checks and exits non-zero on a rule break).
- Packet build: `bash casestudy/cases/<id>/student/build_all.sh` (needs LibreOffice `soffice` and `pdftotext`/`pdftoppm`): must report `problems: 0` and `ALL CHECKS PASSED`.
- Browser test: serve the repo (`python3 -m http.server 8123`, or `npx http-server -p 8123 -s -c-1 .` when available) and drive it with Playwright (Chromium). Import a patient (`#toolsMenuBtn`, `#openImportBtn`, `#jsonInput`, `#validateImportBtn`, `#applyImportBtn`), pause the clock with `simSetPaused(true)`, step with `simJump(minutes)`. Check no page errors. Test **both** the instructor page and the student page for anything that touches the Class session.
- For patient changes, step through every checkpoint and verify Orders, MAR, Results, Flowsheets, Notes, Brain, and the monitor against the design. Check time-gating, Due boxes, and order discontinuation. For packets, inspect two or three rendered pages and verify no later-stop or Quick Check answer leaks. Some scripts print problems without a failing exit status; inspect the output as well.
- Class session connections use PeerJS plus a relay: the relay logins come from a Cloudflare Worker (`ICE_WORKER` in `watch.js`); the student site has a strict Content-Security-Policy generated in `make-student-site.js` (any new web address the student page contacts must be allowed there).
- After app changes: bump the `?v=` version on the script/style tags and the title in `index.html` (and `case-builder/index.html`, `monitor.html`), add a line to the `README.md` change log, run `node make-student.js` and `node make-student-site.js`, and `node tools/make-prebuilt.js` if patients changed.

## Style for code changes
- Keep the app static and dependency-free. Wrap/extend existing functions the way the feature files do (they replace app.js globals) rather than rewriting app.js.
- Small, tested, reversible changes. Say plainly what changed and what you did not test.

## Known issues the owner is aware of
- The **answer keys and instructor guides are in this public repo** (security to-do in `TODO.md`).
- The class-session relay uses a Cloudflare Worker; the old Metered relay login is kept in `watch.js` only as a last resort and its free data is used up.
- The flowsheet's instructor-only "Suggested vitals" bar repeats the first-stop vitals all day; use the Bedside Monitor values.

Do not repeat existing relay login values in documentation, logs, or pull requests. Preserve login and relay behavior unless changing it is part of the owner's request.

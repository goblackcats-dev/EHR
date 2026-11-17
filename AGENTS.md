# NursingSim EHR: instructions for Codex

This is a browser-based nursing simulation EHR for fictional patients, with an instructor site, a generated student site, a bedside monitor, patient-course generators, and printable case study packets. The instructor is nursing faculty and new to coding: use plain language and explain what changed and how it was checked.

## Read before working

- `README.md`: project overview and version history. The opening version heading is historical; read the later change-log entries too.
- `TODO.md`: pending work and recorded decisions. A to-do entry is not permission to implement unrelated work.
- `SECURITY.md`: instructor/student separation and the limits of a public static site.
- `.claude/skills/patient-course/SKILL.md`: required workflow for creating or rebuilding a patient's hospital course, including independent clinical review and checks.
- `.claude/skills/team-case-study/SKILL.md`: required workflow and format for student packets and instructor keys.
- `casestudy/cases/DKA_SERIES.md` before DKA work; its take-home conventions differ from the in-class conventions.
- Before changing a patient, read that patient's `BRIEF.md`, `DESIGN.md`, `REVIEW.md`, and instructor guide/notes where present under `casestudy/cases/<id>/`. Read any additional review documents they reference. Some older cases do not have every file; do not invent prior decisions or approvals.

Treat the two skill files as project instructions when their workflows apply, even though they live under `.claude/`. Keep their clinical and teaching rules in those source files instead of maintaining separate Codex copies. The reminders below do not replace the full skills. Follow the user's current directions when they override older project instructions.

## Branch and review workflow

- `EHR` is the publishing branch. GitHub's default branch is currently `main`; explicitly start work from `EHR`.
- Check the current branch, working tree, and remote before editing. Preserve other work. Create a separate `codex/<task>` branch from an up-to-date `EHR`; do not work directly on `EHR` or share another helper's work branch.
- Commit and push the work branch and open a pull request targeting `EHR` when preparing work for review.
- **Do not merge into or push directly to `EHR` until the instructor has reviewed the result and explicitly approved the merge.** This overrides the automatic merge/push steps in both Claude skills. Do not enable automatic merging in place of review.
- Keep `BRIEF.md`, `DESIGN.md`, and `REVIEW.md` current for patient work and add a README change-log entry for completed changes. Documentation-only changes do not need an app version bump or generated-site rebuild.

## Using the Claude workflows in Codex

- Translate Claude tool names to available Codex tools: `AskUserQuestion` means a concise clarification when needed; `Agent` / `run_in_background` means Codex subagents when available; `SendUserFile` means providing a downloadable artifact or file link supported by the current environment.
- Use the independent designer/researcher/reviewer/builder roles requested by the patient-course skill for patient work. Give each subagent the relevant rules, paths, design, and expected output. Keep one writer responsible for a patient build and verify the reports yourself.
- If independent reviewers or necessary tools are unavailable, report the limitation; do not label a self-review as independent or claim a check ran when it did not.
- Preserve the patient-course skill's design gate: prepare the reviewed clinical design and plain-language course summary, then obtain the instructor's OK before building a new course. This gate is for patient-course work, not routine documentation or app fixes.
- Tool locations in old scripts (for example `/opt/pw-browsers/chromium` and `/opt/node22/lib/node_modules/playwright`) describe a previous environment. Discover installed equivalents; do not assume those paths exist in Codex.

## Patient and teaching rules to preserve

- Use fictional patient data only. `DESIGN.md` holds the patient's clinical numbers; keep the chart, monitor, instructor material, VR material when requested, and answer key consistent with it.
- Time-gate results by `availableAt`, notes by `datetime`, orders by `orderedAt`, and unexpected order stops with `stoppedEarly`. No chart text, screenshots, or packet answers may reveal a later event early.
- In-class default: arrive at 0700 after ED care; 24 hours with seven checkpoints, every four hours. Each checkpoint needs a new full nursing assessment (including the IV site, carrying unchanged rows forward) and a new lab set available by that stop.
- In-class vital signs and bedside glucoses are charted only through the initial 0700 stop; later values come from the bedside monitor and the instructor. Do not put these numbers into later assessment text. The take-home DKA series has its own assessment, lab, and POC-glucose schedule in `DKA_SERIES.md`; do not apply in-class packet rules to it.
- ED doses are `given`; infusions already running at the first stop show `0700 Running`; later doses remain `due` for students.
- Instructor potassium limits: peripheral total at most **10 mEq/hour**, using separate pump riders one at a time, at most four in a row before recheck; peripheral maintenance bags at most **20 mEq/L**; **40 mEq/L** is the central-line maintenance-fluid cap. Count potassium from the carrier and all riders together and include rider volumes in I&O.
- VTE prophylaxis requires a documented clot-risk factor. Include an appropriate ECG image. For in-class courses include an order students should discontinue and at most two planted order errors per 24 hours.
- Use current clinical guidelines, show the calculations in the design, and explain differences from Ignatavicius, Rebar & Heimgartner, *Medical-Surgical Nursing*, 11th edition. Use plain chart language, unique staff names, and the skill's naming rules.
- Team packets use one rotating charge nurse plus three rotating pairs: **Meds and Orders**, **Vitals & Assessment**, **Results & Labs**. Use `casestudy/cases/addison/student/` as the specified format template and apply all current skill requirements, including Quick Checks, even if an older template or packet is missing them.
- Each in-class checkpoint has two or three Quick Check questions. Reveal answers with the reason at the end of that stop; students correct their work. Grade completion and correction. Keep answers out of the student packet and verify this in the fact checks.

## Build and verification

Run commands from the repository root unless a script documents otherwise. Choose the checks that exercise the changed files; there is no root `package.json` or universal `npm test` command. Generators write tracked files, so inspect the diff after running them and avoid unrelated rebuilds.

- Serve the app locally: `python3 -m http.server 8123`, or the skill's `npx http-server -p 8123 -s -c-1 .` when available.
- For patient changes, edit the case's generator/design/notes, then run its generator, for example `node casestudy/cases/dka_newonset/gen/assemble.js`. Run that case's ECG generator first when needed. The assembler's built-in rule checks must pass; inspect the case's `REVIEW.md` for additional commands. Do not treat one patient's checks as coverage for all patients.
- Rebuild the pre-built menu after relevant patient/library changes: `node tools/make-prebuilt.js`.
- For packet changes: `bash casestudy/cases/<id>/student/build_all.sh` (replace `<id>` with the actual case folder). It builds Word/PDF output and runs `render_check.py` and `check_facts.py`. Follow the case's screenshot instructions when images change. The pipeline needs Python packages used by those scripts, LibreOffice (`soffice`), and Poppler PDF tools; check availability first.
- Packet gates: zero layout problems and matching logical/PDF page counts, all fact checks passing, no later-stop or answer-key leaks, and visual inspection of two or three rendered pages. Some scripts print problems without exiting unsuccessfully, so inspect the output as well as the exit status.
- Rebuild the Case Studies menu after packet changes: `python3 casestudy/make_index.py`.
- For app changes, syntax-check affected JavaScript and exercise the affected user flow in a browser. For patient changes, import with zero validation/page errors, step through every checkpoint, check Orders/MAR/Results/Flowsheets/Notes/Brain time-gating and the monitor, and verify the Due boxes and order discontinuation.
- `student.html` is generated from `index.html`: run `node make-student.js` after changing its source. Run `node make-student-site.js` after app changes to refresh `student-site/`. Follow the skills' version/cache-tag rules for app releases and inspect the generated student output for instructor-only material.
- Report exactly which checks ran, their results, and any checks blocked by missing dependencies. For documentation-only work, check referenced paths and commands and run `git diff --check`; a patient or PDF rebuild is unnecessary.

## Public repository and student materials

The answer keys in this repository are public, a known follow-up in `TODO.md`. Keep them and instructor-only tools out of generated student materials. Do not add credentials to source code, documentation, logs, or pull requests, and do not repeat existing relay login values. Preserve the existing login/relay behavior unless changing it is part of the user's request. Cloudflare secrets belong in the service configuration, not the repository.

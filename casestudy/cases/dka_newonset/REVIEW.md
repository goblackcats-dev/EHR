# REVIEW: Nora Whitcombe (in-class DKA, new-onset type 1)

Built 2026-11-17 with `.claude/skills/patient-course/SKILL.md` (subagent pipeline) and `.claude/skills/team-case-study/SKILL.md` (Quick Checks).

## What was checked
1. Design: independent clinical review (`DESIGN_REVIEW.md`): all 8 lab sets recomputed (anion gap, corrected Na, osmolality, Henderson-Hasselbalch, Winter's), potassium per minute, I&O, weights. 3 must-fix + 7 should-fix applied (set 4 not "resolved" under the old textbook rule; a new 0300 low cause unlike Maya's; urine rate).
2. Chart build: `gen/assemble.js` built-in checks (fail the build): no vitals/POC glucoses after 0700; potassium max 10 mEq/h peripheral, max 4 riders in a row, the planted orders never given; orderedAt <= start; notes never quote a result early; a new lab set and assessment at all 7 stops; banned words; monitor rows. The builder broke 9 rules on purpose to prove each check fails.
3. Consistency + nurse read (`VERIFY_CHART.md`): every number against the design; 2 must-fix fixed (problem list gave away a planted error; neuro/GU carry-forward), plus rider Due timing, oral KCl wording, IV status.
4. App test in a real browser (`VERIFY_APP.md`): import 0 errors, nothing early at all 7 stops, labs match, NPO discontinue works, planted orders never charted, MAR Due boxes and riders correct, monitor matches. 1 fail fixed in the app for all patients: the MAR infusion window prefilled the per-kg number instead of the mL/h rate; also no Due box on a fluid that has not started.
5. Case study: `student/build_all.sh` (render_check: 12 pages, no overflow; check_facts: ALL CHECKS PASSED, 600+ values, no Quick Check answers in the student packet). Independent key review (`KEY_REVIEW.md`): 3 must-fix (a 1900 Quick Check distractor that the textbook supports, a timing slip, an antibody result shown before it exists) and the should-fix items applied.

## Judgment calls for the instructor
- Numbers follow the 2024 consensus; the textbook-vs-2024 table is in the key and the instructor guide (insulin hold threshold K < 3.5 in the order; dextrose at 250; bicarbonate only under pH 7.0; resolution by BHB).
- Fixed-rate insulin 0.1 unit/kg/h (5.5 units/h) with the dextrose table.
- Two planted orders: sodium bicarbonate at pH 7.24 (Mon 0700) and KCl 20 mEq/h through a peripheral IV (Mon 1500). Order to discontinue: NPO at 1100 (nurse-driven diet protocol).
- The flowsheet's instructor-only "Suggested vitals" bar repeats the 0700 set; use the monitor.
- VR art choices (hair, skin tone, voice, clothing) are marked "art choice" in VR_BRIEF.md.

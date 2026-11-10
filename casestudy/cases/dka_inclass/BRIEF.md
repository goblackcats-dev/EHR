# BRIEF: in-class DKA patient (the instructor's first VR patient)

Built with `.claude/skills/patient-course/SKILL.md`. Every subagent reads this page first.

## Who and why
- **Adult man, about 28, type 1 diabetes for about 12 years** (multiple daily injections: a basal long-acting insulin once daily + rapid-acting with meals; no pump).
- **Trigger: sick-day insulin omission.** Several days of a bad cold / flu-like viral illness (fever, cough, sore throat, body aches, poor appetite, then nausea and vomiting). He **stopped his long-acting insulin because he "wasn't eating"** (the classic misconception), and skipped mealtime insulin. Lives alone or with a roommate; a friend or family member brought him to the ED in the night.
- **Separate from the seven take-home DKA patients** (`casestudy/cases/DKA_SERIES.md`). Do not reuse their names, MRNs, staff names or story beats.
- Moderate-to-severe adult DKA, ADA/EASD/JBDS/AACE/DTS 2024 consensus protocol (adult). Teaching focus: fluids, insulin infusion, potassium safety (peripheral rules below), anion gap closure and resolution criteria, the dextrose ("two-bag") step, transition to subcutaneous insulin with the overlap, hypoglycemia and hypokalemia on treatment, and **sick-day rules** (never stop basal insulin; check glucose and ketones every 2-4 h; fluids; when to call).
- **Order to discontinue:** **droplet precautions** placed in the ED for the flu-like illness while a respiratory viral panel (influenza A/B, COVID-19, RSV) is pending; the panel comes back **negative** (a common cold virus or panel negative) during Day 1, so the students should discontinue the droplet precautions (with a reason).
- No VTE prophylaxis unless a documented risk factor (he is young and will walk).

## Use and timeline
- **In class**, instructor-paced, Class session with synced clocks and the bedside monitor on a second computer. **Also the first VR patient** (a VR app is being built in another chat; produce `VR_BRIEF.md` and `vr_states.json`).
- **Arrives on the unit at 0700 Day 1 right after the ED** (ED care during the night: labs, fluid boluses, insulin infusion started).
- **Course length: 36 hours = 3 shifts: Day 1 0700 to Day 2 1900.** Checkpoints **every 4 hours**: D1 0700, 1100, 1500, 1900, 2300, D2 0300, 0700, 1100, 1500, 1900 (10 stops).
- **Case study packet: the first 24 hours** (D1 0700 to D2 0700, 7 stops), team-case-study format.
- Dates: **Monday 2027-01-11 0700 to Tuesday 2027-01-12 1900** (does not overlap any DKA series patient).
- MRN **SIM-40601**; unit: Medical-Surgical Step-Down (or IMC) with telemetry; room **SD-3** (free). Folder `casestudy/cases/dka_inclass/` (rename when the name is chosen is NOT needed; keep this folder).
- Group in Pre-Built Patients: **"Case Study Patients"** (in-class).

## Rules (from the skill; all apply)
In-class chart rules: vitals and bedside glucoses charted only up to the 0700 arrival (the instructor says them aloud later and the monitor shows them); a NEW full nursing assessment at every checkpoint; a NEW lab set before every checkpoint (every 4 h); every dose after 0700 is `due`; potassium: peripheral max 10 mEq/h as riders (max 4 in a row), max 20 mEq/L in a peripheral bag, 40 mEq/L central cap, never stack a rider on a K-containing carrier above 10 mEq/h total; at least one ECG with an image (peaked T waves at arrival if K is high, or U waves later if K low); plain language, no real brand names except generic (brand) drug names, unique staff names, no meta wording; show all the math.

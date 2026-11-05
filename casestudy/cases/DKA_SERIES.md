# DKA series: seven pre-built type 1 diabetes patients in diabetic ketoacidosis

Seven 3-day patients for the Pre-Built Patients menu (group **"DKA Patients"**). No case study packet. Each patient folder copies `casestudy/cases/dka1_maya/` (the reference build) and keeps the conventions below so the series stays consistent.

## The seven patients
| # | Folder | MRN | Patient | Twist | Unit | Dates | Status |
|---|---|---|---|---|---|---|---|
| 1 | `dka1_maya` | SIM-40501 | **Maya Thompson, 16 F** | New-onset type 1 diabetes in severe DKA (pH 7.04); possible cerebral edema Day 1 (mannitol); low K/phos; night low after transition; new-diagnosis teaching, family, school | PICU-4 -> Pediatrics 5 North (5N-12) | Mon 12/07 0700 - Thu 12/10 0700 | **Built** (`CS-DKA1-THOMPSON`) |
| 2 | `dka2_jordan` | SIM-40502 | Jordan Ellis, 24 M | Insulin pump failure (kinked/dislodged infusion set overnight) + weekend alcohol; pump troubleshooting, site checks | (choose) | (choose, December 2026) | Planned |
| 3 | `dka3_denise` | SIM-40503 | Denise Carter, 38 F | Socioeconomic: lost insurance, rationing insulin, food insecurity, two jobs; social work, manufacturer assistance, $35 insulin programs, community clinic | | | Planned |
| 4 | `dka4_marcus` | SIM-40504 | Marcus Reyes, 31 M | Congenital kidney disease (posterior urethral valves repaired in infancy -> CKD 3b); DKA with AKI on CKD; cautious fluids, K and phosphate, renal dosing, nephrology | | | Planned |
| 5 | `dka5_ruth` | SIM-40505 | Ruth Nakamura, 67 F | Type 1 for 52 years; urosepsis + off-label SGLT2 inhibitor -> euglycemic DKA (glucose about 210); delirium and fall risk | | | Planned |
| 6 | `dka6_samuel` | SIM-40506 | Samuel Okafor, 45 M | DKA precipitated by a silent NSTEMI; troponin, cardiology, ECG changes, hypokalemia risk with insulin | | | Planned |
| 7 | `dka7_priya` | SIM-40507 | Priya Desai, 29 F | 28 weeks pregnant, DKA at glucose about 240; maternal-fetal medicine, fetal monitoring, left lateral positioning | | | Planned |

## Shared conventions (every patient)
**Files per patient**: `DESIGN.md` (single source of truth: every number), `meta.json` (`id`, `caseCode` CS-DKA<n>-<LASTNAME>, `group: "DKA Patients"`, `title` starting "DKA <n> of 7", `patient`, `age`, `sex`, `diagnosis`, `room`, `desc`), `INSTRUCTOR_NOTES.md` (one-page summary, the six shift checkpoints with monitor values, labs, events and expected nursing actions, teaching points), `REVIEW.md` (self-review), `gen/lib.js`, `gen/physiology.js`, `gen/assess.js`, `gen/treatments.js`, `gen/assemble.js`, `gen/ecg/make_ecgs.py`, `notes/*.json`, `patient.json` (built). No case study packet.

**Timeline**
- Arrives on the unit at **0700 Day 1** (shift change) after a few hours of ED stabilization during the night (labs, first fluids, insulin infusion started or ordered). Simulation **Day 1 0700 -> Day 4 0700 (72 h)**; MAR has 73 hourly columns.
- **Checkpoints at every 0700 and 1900** (6 shifts, plus the final Day 4 0700). Each shift has a new development. Mid-shift events are allowed and time-gated to the minute. The "End of shift" button jumps to the next 0700/1900 (app change made with patient 1); 1 h and 4 h buttons also work.
- Dates in **December 2026**; patient 1 starts Mon 12/07. Pick each start date so the 3 days do not overlap confusingly with another patient if two are run together (any December date works; the app is per patient).

**Chart rules**
- **Vital signs only up to the 0700 arrival** (history + ED + 0700 set). Later vitals come from the instructor's bedside monitor. Add the patient's rows to `monitor.html`: one array (`DKA<n>`) plus one line in `DKA_SERIES` (`[MRN, rows, 'ROOM   LAST, FIRST   AGE S']`). Rows at each 0700/1900 and at mid-shift story changes; rhythm per potassium: `tAmp` 0.5-0.8 for peaked T when K is high, `tAmp` 0.1-0.2 with `uAmp` 0.08-0.15 for flat T with U waves when K is low.
- Baseline nursing assessment rows: ED + unit 0700 only.
- **POC glucose is charted (time-gated)**: hourly on the insulin infusion, then before meals/bedtime/0300. The instructor reads the same values aloud.
- **MAR**: ED doses `given`; infusions running at 0700 show "0700 Running" (handoff check); **every dose after 0700 Day 1 is `due`** for the students. Rate changes after 0700 are student actions driven by protocol orders; provider rate-change orders are time-gated.
- Orders: `orderedAt` never after `start`; an order placed before its start shows "Pending" (fixed in app.js with patient 1 so it becomes Active on time); unplanned stops use `stoppedEarly`.
- I&O: 4-hour blocks ending at 0300/0700/1100/1500/1900/2300, `collected` = block end, `periodEnd: true`; labels Oral (`po`), IV fluid (`iv`), IV med (`intakeOtherLabel`), Urine, Emesis/Stool (`otherLabel`). Each block's note lists every void.
- Notes: provider (ED, admitting H&P, attending day/night), endocrinology, pharmacy, dietitian, diabetes educator (CDCES), social work, case management (+ child life, nephrology, cardiology, MFM, etc. as the twist needs). **Time-gated; a note only quotes results already resulted and events already happened** (check with the scripts in patient 1's REVIEW.md). Unit RN notes are not pre-written (students are the RNs); ED nursing notes are.
- **At least one Cardiology ECG record with an image** (`casestudy/tools/ecg_image.py`, now with `--u-amp` / `u_amp` for U waves) that matches the potassium at that time.

**Lab schedule style**
- ED: VBG, BMP, Mg, phos, beta-hydroxybutyrate (BHB), CBC, lactate, UA (hCG for anyone who could be pregnant), HbA1c, ECG; plus the twist's labs.
- On the infusion: **BMP + Mg + phos + VBG + BHB every 2-4 h** (patient 1: every 4 h plus one STAT), POC glucose hourly. Result delays: gas 15 min, BMP 45 min, BHB 55 min (STAT faster).
- After the transition: BMP + BHB once (rebound check), then daily BMP.
- Show the arithmetic in DESIGN.md: anion gap (Na - Cl - CO2; normal 8-12), corrected sodium (**+1.6 per 100 mg/dL glucose over 100**, say ISPAD uses 2), effective osmolality, Winter's formula for every gas, glucose fall rate, I&O sums, weight-based doses.

**DKA protocol used**
- **Adults (ADA/EASD/JBDS/AACE/DTS 2024 hyperglycemic crises consensus)**: diagnosis glucose 200+ (or known diabetes), BHB 3.0+ (or urine ketones 2+), pH under 7.3 and/or bicarbonate under 18. Isotonic fluid 1-1.5 L first hour (adjust for heart/kidney), then 250-500 mL/h by volume; **K under 3.5: replace before insulin**; K 3.5-5.0: 20-30 mEq per liter of fluid; K over 5.0: no K, recheck in 2 h. Insulin 0.1 unit/kg/h (a bolus is optional) per local protocol; aim glucose fall 50-75 mg/dL/h; **add dextrose (D5 or D10) at glucose under 250** and keep insulin running (may lower to 0.05) until resolution: **venous pH 7.3 or higher (or bicarbonate 18 or higher) and BHB under 0.6** (check the exact wording of the consensus and the local protocol before building). Bicarbonate only if pH under 7.0. Phosphate if under 1.0 or with heart/respiratory compromise. Transition: basal SC insulin given **1-2 h before stopping the infusion** (or early basal while on the drip), with a meal.
- **Children and teens (ISPAD 2022)**: 10-20 mL/kg 0.9% saline over 20-30 min for poor perfusion (20 mL/kg for shock), then deficit (5-10%) + maintenance over 24-48 h with 0.45-0.9% saline; insulin **0.05-0.1 unit/kg/h, no bolus, start at least 1 h after fluids**; K 40 mEq/L once K is under 5.5 and voiding (maximum 0.5 mEq/kg/h); dextrose (two-bag) when glucose falls to 250-300; neuro checks hourly; mannitol 0.5-1 g/kg or 3% saline 2.5-5 mL/kg for cerebral edema.
- Each patient's twist changes the protocol where real care would (CKD: smaller fluid boluses, renal dosing, cautious K/phos; NSTEMI: K kept 4.0-5.0, cardiology; euglycemic DKA: dextrose from the start with the insulin; pregnancy: lower glucose thresholds, fetal monitoring, left lateral tilt; older adult: delirium, falls).

**Build and check (per patient)**
1. `python3 casestudy/cases/dka<n>_<name>/gen/ecg/make_ecgs.py`, `node casestudy/cases/dka<n>_<name>/gen/assemble.js`, `node tools/make-prebuilt.js` (the DKA group comes from `meta.json` `group`).
2. Playwright (see patient 1 REVIEW.md): import with 0 errors; no page errors; no vitals after 0700 Day 1; labs/orders/notes/ECG at their times; MAR infusions and transition; the Pre-Built menu shows the patient under "DKA Patients"; the monitor shows the patient's rows.
3. Self-review and `REVIEW.md` (medical accuracy, math, time gating, contradictions).

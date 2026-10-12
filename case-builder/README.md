# NursingSim Case Builder v2

A faculty tool that builds a complete, internally consistent **simulated patient** for the NursingSim EHR.

You choose a diagnosis, a hospital day, and some history. The builder works out what has already happened, what is happening right now, and what is coming up during the shift.

## How to use it

1. Open the **Case Builder** (on the hosted site this is the `/case-builder/` page, or tap **Case Builder** in the EHR's top bar).
2. **Patient**: name, age, sex (height and weight are optional; it picks sensible values).
3. **Why they are here, and how long**: pick the primary diagnosis and the **hospital day**. A line under the controls tells you what stage the patient is in and what is coming up this shift.
4. **Medical, surgical, social history and allergies**: tap the chips. Each medical-history chip tells you what it adds.
5. **Extra faculty direction**: optional free text (see keywords below).
6. Tap **Build Patient**, review the tabs, then tap **Open in EHR**. The EHR opens with the patient already loaded, so there is nothing to copy or paste.

## What "hospital day" does

The patient arrives at the start of day 1. The simulation starts on the hospital day you choose (default 07:00). Everything before the start is chart **history** (vitals, labs, MAR doses, notes, devices). Everything in the next 8 hours appears in the EHR as the simulation clock advances (new results, a consult note, the OR, a new order).

Examples:

| Diagnosis | Day 1 | Day 2 | Later |
|---|---|---|---|
| Appendicitis | NPO, antibiotics, going to the OR this morning | Post-op day 1: diet advancing, discharge teaching | Day 4+: perforated, abscess, IR drain |
| Small bowel obstruction | NPO, NG to suction, IV fluids | Gastrografin challenge | Day 3+: NG out, diet advancing. Day 6+: surgery |
| Cholecystitis | NPO, antibiotics, pre-op | Lap chole in the morning | Post-op, discharge. Day 6+: gangrenous, drain |
| Pneumonia | Oxygen, IV antibiotics | Improving, weaning oxygen | Oral antibiotics, discharge. Day 7+: effusion |
| Heart failure | IV diuresis, oxygen | Diuresing, echo | Oral diuretic, teaching. ESRD gets urgent dialysis |
| COPD exacerbation | BiPAP, steroids, nebs | Off BiPAP | Weaning oxygen, home oxygen evaluation |
| Sepsis (urinary) | Cultures, fluids, antibiotics | Improving | E. coli identified, oral step-down |
| Ischemic stroke | NPO, neuro checks, permissive hypertension | MRI, swallow evaluation | PT/OT/SLP, rehab placement |

If you pick a day longer than the typical stay, the builder writes a believable "medically ready but still here" patient (or a complication, for surgical diagnoses) and says so in the alerts.

## What the history adds

- **Medical history**: the typical medications, orders, baseline labs and flowsheet findings. COPD adds DuoNebs, a rescue nebulizer, inhaler, an oxygen target of 88-92% and a lower baseline SpO2. ESRD adds Mon/Wed/Fri hemodialysis, an AV fistula (no BP or needle sticks in that arm), a renal diet, fluid restriction, sevelamer, renal dosing and low urine output. Diabetes adds ACHS glucose checks, basal and correction insulin and a hypoglycemia protocol. Atrial fibrillation adds rate control and an anticoagulant that is held around surgery.
- **It adjusts the treatment around the diagnosis.** For example: oral medications are held while NPO, an anticoagulant is held before surgery, morphine is swapped for hydromorphone in kidney disease, IV fluid boluses are reduced in heart failure or ESRD, and a penicillin allergy changes the antibiotic.
- **Surgical history**: shown in the notes, and checked against the diagnosis (for example, a prior appendectomy with appendicitis is flagged; a small bowel obstruction without prior abdominal surgery gets a warning).
- **Social history**: current smoker adds a nicotine patch; heavy alcohol adds CIWA monitoring, thiamine, folate and lorazepam per protocol; living situation and baseline mobility feed the PT, OT and case management notes and the fall-risk level.
- **Faculty direction keywords**: `Foley`, `confusion` / `delirium`, `DNR`, `pressure injury`, `avoid insulin`, `C. diff` / `MRSA` / `contact isolation`, `high fall risk`. Anything else is kept in the case and used when you enhance notes with Claude.

## Notes

The builder writes: ED provider note, H&P (surgery H&P for surgical patients), daily physician progress notes, operative and PACU notes, consults, nursing admission and shift notes, respiratory therapy, PT, OT, SLP (stroke), dietitian, case management, imaging reports and ECG/echo reports. Every note is written from the actual chart data, so the vitals, labs, medications and plan always match the rest of the record. Notes dated after the shift start are hidden in the EHR until the simulation clock reaches them. You can **edit** any note on screen.

### Optional: enhance notes with Claude

On the **Notes** tab, open **Enhance notes with Claude**. It rewrites the notes in a more natural clinical voice while keeping every number, time, drug and dose (it refuses to keep a rewrite that changes numbers). It also lets you **Restore original text**.

- You need your **own Anthropic API key** from console.anthropic.com with a little credit. A claude.ai subscription does not include an API key.
- The key is stored only in this browser (if you tick "Remember") and is sent only to Anthropic.
- It defaults to Claude Opus 5.5; Sonnet 5.5 and Haiku 5.5 are cheaper. The screen shows a rough cost estimate before you run it.
- Server-side refusal fallbacks are turned on for the request.

## Limits

This is an educational tool with fictional patients. The defaults are common, plausible teaching choices, not clinical guidelines for every real patient. Faculty should review each generated case. Never use real patient information.

## For whoever works on the code next

All the files are plain JavaScript (no build step). `primary_*.js` hold one diagnosis each as a list of events and keyframes in **hours since admission**; `history.js` holds the medical-history modules; `rules.js` holds the rules between them; `engine.js`, `build.js` and `generate.js` turn that into the EHR's canonical v2 JSON; `notes.js` writes the notes; `ai.js` is the optional Claude step; `app.js` is the screen.

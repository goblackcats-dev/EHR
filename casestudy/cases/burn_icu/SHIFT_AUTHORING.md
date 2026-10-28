# How to write one shift of the Burn ICU case study (instructions for the shift authors)

You are writing ONE shift (about one hour of student work, **exactly 16 points**) of a take-home nursing case study. The student is a critical-care nursing student who has the patient open in the EHR (student view, `patient.json` in this folder) and must look at the chart, do the reasoning/math, and write answers in boxes. A faculty answer key with point values is built from your file. Nothing here is graded by a computer: a person reads the key.

## Read first
1. `DESIGN.md` (patient story; AMENDMENTS and "Shift timing" at the bottom override earlier text). The simulation runs Mon 11/02 0700 to Thu 11/05 0700; shifts are 0700-1900 and 1900-0700.
2. `shift2_items.py` (the finished Shift 2: copy its structure and style exactly) and, for reference, `author.py` (Shift 1) and `../../build_casestudy.py` (how each item `type` is drawn).
3. `TIMELINE.md` (hourly vitals, vent, drips, I&O, labs by time, MAR events, devices) and `ehr_io_totals.txt` (the I&O shift totals EXACTLY as the EHR displays them).
4. The notes for your shift: load `patient.json` (`json.load(...)['canonical']['notes']`, filter `datetime`). The key may use what the notes say; the notes are part of the chart.

## The rule that matters most: the key must match the EHR
- Every number, time, name or finding in a question or answer key must come from the chart. Verify each with a small script against `patient.json` (observations: type vital/lab/assessment; orders; administrations; ioEvents; devices; notes) and `ehr_io_totals.txt`. The Intake/Output flowsheet shows shift totals as printed in `ehr_io_totals.txt`; do not recompute them a different way.
- Students read the chart with the simulation clock set to the shift start and moving forward, so a question must only depend on information charted by the END of your shift (a lab resulted at 2140 is only available after 2140). Never ask a question whose answer is only visible later.
- If a question needs math from chart numbers, give the formula in the key and compute it carefully (units!). Clinical content must be accurate (doses, ranges, protocols). Say "accept X-Y" for rounding.
- The chart is real-looking but not perfect: if you find a genuine chart inconsistency, write it in a file `SHIFTn_ISSUES.txt` (one line each) and avoid building a question on the wrong value.

## What a good shift contains (10 to 12 items)
- A mix of types: mostly `box` (a prompt and a large writing box: the format the instructor likes), plus a few `table`, `vitals`, `choice` (select all that apply / single / ordered), `matrix`, `highlight`, `bowtie` (hypothetical clinical-judgment items must say HYPOTHETICAL), `concept`. See `../../archive/dfi_walter/content.json` for working examples of every type.
- Questions that make the student LOOK at the chart (labs, flowsheets, MAR, orders, notes, I&O) and answer with this patient's own data. Ask "why", "what would you do", "what would you ask the provider", priorities, delegation, communication (SBAR), safety, teaching, math (infusion rates, mL/h, mcg/kg/min, Parkland, calories), and recognizing a change in condition. Include at least one "the obvious action is wrong or needs a question" item where it fits.
- At least one item that uses the figure or screenshot given to you below (`images`), and an item that ends the shift with an SBAR handoff (written to the next nurse) as the last item, worth 2 points.
- Each item: `{'id': 'N.k', 'type': ..., 'points': x, 'title': ..., 'prompt': ..., 'where': 'where to look in the EHR', 'key': {'elements': [E(text, pts, src), ...]}}`. For `box` items give a `'lines'` value of 8-14 (the editor will resize). Elements must add up to the item points (or mark `'bank': True` when the student chooses from a bank, as in shift2). Points in steps of 0.25 or 0.5.
- Do not ask definitions. Do not copy Shift 1 or 2 questions. Do not repeat the same skill twice in one shift. Keep prompts short enough that a student can answer in a box (about 4 parts at most).
- Images: `'images': [{'path': 'figs/fig_xxx.png', 'caption': 'Figure: ...', 'width': 6.4}]` on the item that uses it. Available files in `figs/` are listed in your task. A student "analyzes the graph": ask what it shows, at what time something changed, what it means, and what they would do. Do not give the answer in the caption.

## Output
Write ONLY your own file `shiftN_items.py` in this folder, in the same shape as `shift2_items.py`:
```
itemsN = [ ... ]
parts.append({'id': 'N', 'title': 'Shift N: ...', 'step': '...', 'minutes': 60, 'intro': '...', 'keyNote': '...', 'items': itemsN})
```
(`E` and `parts` already exist when the file is executed; do not import anything else except `json`.) Item ids are `N.1`, `N.2`, ... in order. Then run `python3 check_shift.py shiftN_items.py` until it says OK (points per shift must be exactly 16.0 and every element list must add up). Reply with one short message: the item list (id, title, points, type) and anything in the chart that looked inconsistent. Do not edit any other file.

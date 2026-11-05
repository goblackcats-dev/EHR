# Care-plan case study tool (faculty only)

Builds a printable ADN Med-Surg II case study (student packet, answer key, score sheet) from a NursingSim patient JSON.
See `BLUEPRINT.md` for the design, the workflow and how photos of student work are scored.

    python3 extract_facts.py patient.json > facts.txt
    python3 build_casestudy.py content.json patient.json out/

Requires `python-docx` (`pip install python-docx`). Cases live in `cases/<name>/`. Answer keys are in the repo by the instructor's choice; the repo is public.

## Adding ECG and other images to a patient

A chart-review record (a note) can carry pictures: `images: [{ src: 'data:image/png;base64,...', caption, alt }]`. Chart Review > detail shows them and a click enlarges. A record of type `cardiology` shows in the Chart Review "Cardiology" tab, `imaging` in the "Imaging" tab. The record's `datetime` is when it appears in the chart (the simulation clock hides later ones).

**Make an ECG.** `casestudy/tools/ecg_image.py` draws a printed-style ECG (pink grid, 25 mm/s, 10 mm/mV, calibration pulse, header with patient and measurements, interpretation, "Unconfirmed/Confirmed", footer "SIMULATION: not a real patient"). Needs `numpy matplotlib pillow` (`pip install numpy matplotlib pillow`).

    python3 casestudy/tools/ecg_image.py --rate 44 --pr 0.30 --qrs 0.13 --qtc 0.48 --peaked --out ecg.png      # 12-lead
    python3 casestudy/tools/ecg_image.py --layout strip --rhythm afib --out strip.png                          # one-lead rhythm strip

Options: `--rhythm` (sinus, sinus_brady, sinus_tach, first_degree, wide, afib, vtach, mobitz1, complete, paced), `--rate --pr --qrs --qt/--qtc`, `--t-amp`, `--peaked`, `--u-amp` (U waves, low potassium; use with a small `--t-amp`), `--no-p`, `--irregular`, `--noise`, `--axis normal|left|right`, `--pacer`, `--st-elev`, patient header (`--name --mrn --dob --age --sex --when --location`), repeated `--interp "line"`, `--status Confirmed`. In Python: `import ecg_image as E; png = E.render_ecg(...); rec = E.ecg_record(png, datetime='2026-11-17 04:40', summary=..., body=..., impression=...)` gives a ready `cardiology` record with the picture embedded.

**Wire it into a case.** Hypermag is the working example: `cases/hypermag/gen/ecg/make_ecgs.py` draws the PNGs into `gen/ecg/` and writes `notes/ecg.json` (records with `imageFiles`); `gen/assemble.js` embeds each file as a data URL. Rebuild with one command:

    python3 casestudy/cases/hypermag/gen/ecg/make_ecgs.py && node casestudy/cases/hypermag/gen/assemble.js && node tools/make-prebuilt.js

For a new case, copy `make_ecgs.py`, edit the list (use the same numbers as the ECG lab lines and the notes; set `datetime` to when the result is available) and keep the `imageFiles` lines in `assemble.js`.

**Size.** Each ECG is about 1600 px wide, a limited-colour PNG of 60 to 70 KB. Keep each picture under about 150 KB and a case under about 2 MB in total.

**Why data URLs.** The picture lives inside patient.json, so it travels with the single file, works in locked student files and after Tools > Import, and needs no server paths.

**Other images.** The tool only makes ECGs. Radiology images (chest x-ray, CT, ultrasound) must be real and properly licensed (for example public-domain or CC images, with the source in the caption) or clearly labelled "illustration" in the caption. Do not draw fake radiology images.

# NursingSim EHR - Prototype v17

This version adds an Epic-style **MAR** page and makes the Chart Review sidebar tabs appear as a dropdown.

## New in v17 - Saved patients

- **EHR:** the **Saved Patients** button (top bar) saves the patient you are looking at, including the simulation time and anything charted, and loads it again later. Use it to prepare a medication pass: advance to the time you want, press Save, and load it for the class.
- **Case Builder:** **Save to library** stores a built patient; **Library** lets you edit it again in the builder, open it in the EHR, rename, duplicate, export or delete it. The builder and EHR share one list on the same device.
- **Export / Import** a patient as a `.json` file to share it with a colleague or move it to another device.
- Patients are stored in the browser's own database (IndexedDB), so they stay until you delete them, but only on that device and browser. Clearing the browser's website data removes them, so export anything important.

## New in v16 - Case Builder v2 (`case-builder/`)

The Case Builder now lives in the `case-builder/` folder, next to the EHR, and can send a patient straight into the EHR with one tap (**Open in EHR**). Give it a primary diagnosis, medical / surgical / social history, allergies and a **hospital day**, and it builds the whole patient: the history of the stay (vitals, labs, MAR doses, devices, I&O), what is happening now, and what appears during the shift. See `case-builder/README.md`.

EHR changes in this version:
- I&O records can carry a date, so a full day of I&O shows correctly and sorts into the flowsheet.
- The Notes tab group now holds PT / OT / SLP / RT / nutrition notes.
- A physician H&P counts toward the "every active problem is addressed" check.
- The duplicate-medication check only looks at orders that are in effect at the start of the simulation.
- **Case Builder** link in the top bar.

## New in v15 - iPad and bug-fix release

**Fixed**
- MAR no longer runs off the right edge of the screen; the timeline now scrolls sideways inside its card while the medication column stays pinned.
- The Import Patient button no longer covers the page-header chips.
- Orders page showed "0 orders" in the category list (a duplicated element id).
- MAR rows could be merged into the wrong medication (for example the saline infusion taking over the azithromycin row). Medications are now matched on the drug name, not on any text that happens to appear inside it.
- Medications that had no dose or route (such as ceftriaxone in the sample) are now filled in from the medication list.
- Flowsheet columns are now hourly instead of one column per exact timestamp, and I&O periods are placed in the column where the period ends.
- Device tooltips on the avatar now work by tapping (tap a device to open it, tap anywhere else to close it).

**New**
- Persistent patient banner showing allergies, code status, isolation and fall risk.
- Epic-style dates and times (`06/17/26 0830`, `DOB 04/18/1972`).
- Dark application bar with a white patient banner.
- All buttons and rows are at least 44 px tall for fingers; fields are 16 px so iPad Safari does not zoom in when you tap one.
- Left navigation rail on iPad in both orientations; tab strip on phones.
- Autosave: the loaded patient and simulation time are kept in the browser, so refreshing the page no longer loses them.
- Home-screen app support (icon, manifest, full-screen mode, safe-area padding).

## Putting it on an iPad

An iPad cannot open `index.html` straight from a download, so the app has to be hosted on a web address. GitHub can do this for free (GitHub Pages):

1. On GitHub, open this repository, then **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Pick the branch that holds this version of the EHR (for example `claude/ehr-epic-parity-review-2dk6ze`, or `EHR` once it has been merged), leave the folder as **/ (root)**, and press **Save**.
4. After about a minute GitHub shows your address, which looks like `https://YOUR-NAME.github.io/EHR/`.
5. Open that address in **Safari** on the iPad, tap the **Share** button, then **Add to Home Screen**. It will now open full screen like an app.

Only fictional patients should ever be loaded. GitHub Pages sites are public.

## New in v8
- Redesigned **Lab Results** as an Epic-style **Results Review** screen
- Collection dates/times now run horizontally across the top
- Lab components/tests run vertically down the left
- Results are grouped by lab category
- Abnormal results display in red with high/low indicators
- The selected collection time is highlighted in blue
- Added a right-side laboratory category tree
- Added a selected-result detail card on the right
- Added a bottom timeline scrubber with back/forward controls
- Added **Show All** and **Flagged Only** controls
- Kept the summary page's **Recent Labs** section, still compatible with full `labResults` data

## Existing features retained
- Patient Summary
- Chart Review
- Combined Notes tab
- H&P
- Imaging
- Cardiology
- Sticky Notes
- Combined device avatar
- Allergies
- Problems
- Vitals
- Nursing Orders
- Current Medications
- Intake and Output
- JSON import

## How to use
1. Unzip the folder.
2. Open `index.html` in a web browser.
3. Click **Import Patient** to paste or upload simulated JSON.
4. Use the left navigation to open **Lab Results**.
5. Click **All Results** or a category filter such as **CBC**, **CMP**, or **Coagulation**.
6. Click an individual result row to see more detail and history on the right.

## Important
Use made-up patient data only. Do not import real patient information or protected health information.

## JSON structure for lab results
The preferred structure is:

```json
"labResults": [
  {
    "category": "CBC",
    "test": "WBC",
    "result": "8.0",
    "units": "K/uL",
    "flag": "",
    "reference": "4.0-10.5",
    "collected": "YYYY-MM-DD HH:mm",
    "specimen": "Blood",
    "status": "Final",
    "history": [
      {
        "collected": "YYYY-MM-DD HH:mm",
        "result": "7.8",
        "units": "K/uL",
        "flag": ""
      }
    ]
  }
]
```

If `labResults` is not supplied, the app will fall back to `recentLabs`.

## Planned next section
- MAR timeline view


## New in v9
- Added a working **MAR** page in the left navigation
- Added an Epic-style medication timeline with hourly columns
- Added color states for MAR cells and pills:
  - Gray striped = before medication was ordered
  - Orange striped = discontinued
  - Green pill = administered / given
  - Blue pill = due
- Added filter buttons for **ALL**, **Scheduled**, **PRN**, and **Continuous** medications
- Added **Completed / Historical Medications** section
- Changed **Chart Review** sidebar sub-tabs into a dropdown that only appears while Chart Review is selected

## MAR JSON structure
```json
"mar": {
  "date": "Friday September 13, 2026",
  "timeSlots": ["0800", "0900", "1000", "1100"],
  "medications": [
    {
      "name": "Medication name",
      "dose": "10 mg",
      "route": "Oral",
      "frequency": "Daily",
      "adminDose": "1 tablet",
      "category": "scheduled",
      "orderStartIndex": 0,
      "discontinuedIndex": 3,
      "events": [
        { "slotIndex": 2, "time": "1030", "state": "given", "label": "1030 Given 10 mg" },
        { "slotIndex": 3, "time": "1100", "state": "due", "label": "1100 Due" }
      ],
      "lastAdmin": "Today ...",
      "dispenseLocation": "Pharmacy",
      "completed": false
    }
  ]
}
```


## New in v10
- MAR medication rows are now clickable
- Clicking a medication opens a linked **Medication Detail** panel
- Detail panel displays:
  - Drug class
  - Last 3 doses
  - Brief important nursing information
  - Key monitoring values linked from JSON
- Added built-in sample medications with JSON-linked monitoring examples:
  - **Metoprolol tartrate** with BP/HR monitoring
  - **Warfarin** with PT/INR monitoring
  - **Digoxin** with apical pulse/potassium monitoring

## MAR detail JSON fields
Inside each `mar.medications[]` item, optionally add:
```json
"detail": {
  "drugClass": "Beta blocker",
  "importantInfo": "Check BP and HR before administration.",
  "keyMonitoring": [
    { "label": "Blood Pressure", "value": "118/72", "note": "Current reading", "flagged": true },
    { "label": "Heart Rate", "value": "68 bpm", "note": "Current reading", "flagged": true }
  ],
  "lastThreeDoses": [
    { "time": "09/13/26 1130", "dose": "25 mg PO", "status": "Given" }
  ]
}
```


## New in v11
- Added a working **Orders** tab in the left navigation
- Orders can be filtered by:
  - All
  - Active
  - Pending
  - Completed
  - Discontinued
- Orders are grouped and filterable by category:
  - Nursing
  - Diet
  - Activity
  - Respiratory
  - Medication
  - Laboratory
  - Lab / Bedside Testing
  - Imaging
  - Consult / Therapy
  - Precautions
- Clicking an order opens an **Order Detail** panel
- Detail panel displays:
  - Status
  - Frequency
  - Start and end times
  - Provider
  - Instructions
  - Clinical rationale
  - Linked chart data
  - Nursing considerations

## Orders JSON structure
Add an `orders` array at the top level of the simulated patient JSON:

```json
"orders": [
  {
    "name": "Vital signs",
    "category": "Nursing",
    "status": "Active",
    "frequency": "Every 4 hours",
    "start": "YYYY-MM-DD HH:mm",
    "end": "optional",
    "provider": "Provider name",
    "instructions": "Order instructions",
    "rationale": "Why this order exists",
    "linkedData": ["Related lab, MAR item, note, problem, or device"],
    "nursingConsiderations": ["What the nurse should assess, monitor, or document"]
  }
]
```

If `orders` is not supplied, the app will generate a basic order list from `nursingOrders`, diet order, and ambulation order.


## New in v12: canonical patient model and import validation

v12 changes the internal architecture while preserving the current EHR screens.

### Canonical source of truth
The preferred import format is now `schemaVersion: "2.0"`.

The canonical model stores:
- patient and encounter
- problems
- observations for vitals and labs
- orders
- medication administrations
- devices
- intake/output events
- notes
- sticky notes
- MAR timeline metadata

Patient Summary, Chart Review, Results Review, MAR, and Orders are generated from this shared model.

### Legacy compatibility
Older NursingSim EHR JSON files are automatically converted into the canonical model before display.

### Import validation
The Import Patient dialog now includes **Validate Case**.

Current checks include:
- required patient information
- unique clinical object IDs
- MAR administrations linked to valid medication orders
- valid avatar site markers
- medication monitoring rules linked to chart vitals/labs
- disagreement between old copied medication-monitoring values and current chart data
- coverage of active problems in hospitalist progress notes
- potential duplicate active medication orders

Blocking errors prevent import. Warnings allow import.

### Linked MAR monitoring
Medication monitoring should reference chart observations rather than duplicate values.

```json
"medication": {
  "medKey": "warfarin",
  "drugClass": "Anticoagulant",
  "dose": "5 mg",
  "route": "Oral",
  "importantInfo": "Review PT/INR and bleeding risk before administration.",
  "monitoringRules": [
    { "label": "PT", "sourceType": "lab", "code": "PT" },
    { "label": "INR", "sourceType": "lab", "code": "INR" }
  ]
}
```

The MAR resolves the most recent matching lab automatically.

### Structured hospitalist progress notes
Canonical notes may use `problemSections`:

```json
"problemSections": [
  {
    "problemId": "problem_pneumonia",
    "problem": "Community-acquired pneumonia",
    "evidence": [
      "WBC 15.2 K/uL",
      "Left lower lobe infiltrate on chest x-ray"
    ],
    "treatments": [
      "Continue ceftriaxone",
      "Wean oxygen as tolerated"
    ]
  }
]
```

The renderer automatically produces bold problem headings and separate bullets.

## Recommended next build
The next major nursing workflow screen should be **Flowsheets**, using the canonical observations and devices rather than creating another independent data source.


## New in v13: Flowsheets

- Added a dedicated **Flowsheets** tab with assessment fields vertically and documentation times horizontally.
- Added collapsible nursing sections including Vital Signs, Respiratory, GI, GU, Mobility, Pain, Safety, Lines/Drains/Airways, and Intake/Output.
- Device records and I&O events are automatically represented in the flowsheet.
- Clicking a documented value opens a detail panel showing its source record and documentation time.
- Added **Expand All**, **Collapse All**, and **Latest Column** controls.
- Legacy patient JSON is automatically given a small set of derived flowsheet observations from current vitals, diet, activity, isolation, oxygen devices, and Foley information.

### Canonical flowsheet observations

Flowsheet documentation is stored in the existing canonical `observations` array rather than a separate duplicate data store:

```json
{
  "id": "assessment_resp_0800",
  "type": "assessment",
  "section": "Respiratory",
  "code": "BREATH_SOUNDS",
  "label": "Breath Sounds",
  "value": "Crackles, left base",
  "collected": "2026-06-17 08:00",
  "source": "Nursing assessment"
}
```

The import validator now checks flowsheet assessment observations for a section, field label/code, and documentation time.


## New in v14: interactive nursing simulation workflow

v14 implements the five workflow features planned after the canonical-data refactor.

### 1. Simulation clock and staged chart release
- Added a persistent **Simulation Time** control in the patient header.
- Faculty/students can:
  - advance 30 minutes
  - advance 1 hour
  - jump to the next staged chart event
  - reset the scenario
- Labs, notes, orders, assessments, and devices can be staged by timestamp.
- Items with future timestamps stay hidden until the simulation clock reaches them.
- The built-in sample has staged future findings so the feature can be tested.

### 2. Brain / Worklist
Added a **Brain / Worklist** tab that derives tasks from:
- medication administration times
- nursing orders
- new orders
- abnormal/critical lab releases
- incentive spirometry
- glucose checks
- ambulation
- vital signs
- intake/output
- PRN medication reassessment tasks

Tasks are categorized as:
- Urgent / Overdue
- Due Soon
- Upcoming
- Completed / Addressed

### 3. New / abnormal indicators
Sidebar badges now show:
- NEW chart review items
- NEW or CRITICAL laboratory results
- DUE medications
- NEW orders
- NEW flowsheet documentation
- open Brain tasks

Opening the relevant section acknowledges its NEW indicator.

### 4. Interactive medication administration
Blue due MAR boxes are now clickable.

Available actions:
- Give
- Hold
- Refused
- Not Given

The action updates the canonical medication administration record.

Medication monitoring is displayed before the action using linked chart data such as:
- BP / HR
- PT / INR
- potassium
- creatinine
- glucose

Giving a PRN medication creates a future reassessment task in the Brain.

### 5. Student flowsheet documentation
Flowsheets now support documentation.

Students can:
- click **Chart Assessment**
- click an empty flowsheet cell
- choose a section
- enter an assessment field
- document a value
- mark it abnormal
- set the documentation time

The new entry is stored as a canonical `observation` with:
- `type: "assessment"`
- a stable ID
- section
- field/code
- value
- timestamp
- source `"Student charting"`

This means student documentation immediately becomes part of the same patient record used by the rest of the simulation.

## New in v18: wristband scanner and med-pass prep

- **Barcode medication administration.** Opening a due dose on the MAR now shows two steps: scan the patient wristband, then scan the medication. Give stays locked until the right wristband, two patient identifiers, and the right package are confirmed. On an iPad, tap the wristband or package tile in the scanner window; a hardware scanner or typing a code into the box also works (Enter submits).
- **Safety checks the student must handle:** wrong patient, wrong drug (look-alike/sound-alike), wrong strength, allergy conflicts (blocks Give), hold parameters such as "hold if SBP below 100", a dose given too recently, and a dose more than 60 minutes early or late. Warnings need a written reason to override. Hold, Refused and Not Given always work.
- **Med-pass setup** (MAR toolbar): turn scanning on or off, turn decoys on or off, and plant "traps" on a medication (hold parameter met, new allergy, dose given 20 minutes ago). Use **Saved Patients** to keep the prepared patient for class.
- **Print** wristband and medication labels as props (barcodes need an internet connection).
- Every scan and override is recorded on the administration for debriefing.

## New in v19: flowsheet charting practice

- **Practice mode** (Flowsheets toolbar): hides the patient's current nursing findings (breath sounds, bowel sounds, edema, and so on) so the student must assess and chart them. Earlier columns stay visible as history, as in real life. Faculty can switch it on, then use **Saved Patients** to keep the patient that way.
- **Easier charting.** Chart Assessment now suggests the fields for each system and offers tap-to-fill common findings (good for iPad). Choosing an abnormal finding ticks "abnormal" automatically.
- **Instant feedback** after each entry: correct, partly right, missed an abnormal finding, or does not match, with a reason. It also reminds the student to mark abnormal findings and think about who to notify.
- **Review my charting** gives a score, a by-system table of what was charted versus the patient's real findings, and a "Show what I missed" button.
- Feedback is saved with the patient, so it survives a refresh and Saved Patients.

## New in v20: scan status, QR wristbands, overrides

- **Patient scan status.** A red **PATIENT NOT SCANNED** / green **PATIENT SCANNED** badge sits under the patient name at the top of the EHR, and a matching bar sits at the top of every medication dialog. Scan the wristband once and it stays scanned for all of that patient's medications. Tap the badge (or **Clear scan**) when leaving the room. Loading a different patient resets it.
- **QR wristband.** In the Case Builder, click **Print wristband** (after building a patient). In the EHR use **Med-pass setup > Print wristband and medication labels**. The band is 7.5 x 1.15 inches with name, DOB, MRN and a QR code, plus a red allergy band when needed. Print on plain letter paper (portrait, 100%), cut it out, wrap and tape. Medication labels with QR codes print under it. The QR code works without internet.
- **Hooking up a scanner.** A handheld USB or Bluetooth scanner that acts like a keyboard works with no setup: just scan while the EHR is open (it types the code and presses Enter). The EHR checks a patient code against the patient it has open and a medication code against the dose that is open. You can also call `MedPass.scan("PT-...")` from code, or send `window.dispatchEvent(new CustomEvent("nursingsim:scan", { detail: "PT-..." }))` from a bridge.
- **Overrides.** Wristband scan, medication scan, and safety warnings can each be overridden, but the student must pick a reason from a list (damaged barcode, scanner down, emergency, provider or pharmacist verified, and so on). "Other" and allergy overrides also need a comment. Everything is saved on the dose record for debriefing.

## New in v21: medication editor, vial labels, med-pass tools

- **Edit the medications (Case Builder > Medications tab).** Add a medication from a built-in list or type your own, change a dose, route, frequency or times, set a hold parameter ("Hold if SBP below 100" is checked against the patient's vital signs), mark a drug high-alert, or remove it. The MAR, orders, notes and fall-risk update to match. Edits are saved with the patient, and **Undo all medication edits** puts it back. Changing the diagnosis starts the medication list fresh.
- **Print vial labels.** Each medication has a **Label** button: a small label (vial/syringe 2 x 0.9 in, mini 1.5 x 0.7 in, or bottle/bag 3.2 x 1.5 in) with name, dose, route, form, expiration date, lot, and a QR code. You can print several copies, add the patient's name (for IV bags), or print everything at once with **Print all labels**.
- **Use a barcode you already have.** In the edit window, scan or type the real vial's barcode into "Link to an existing barcode". The EHR scanner then accepts that barcode (and the printed QR) for that medication.
- **Decoy packages.** **Print labels with decoys** adds wrong-strength, look-alike/sound-alike and (if you tick it) expired packages, each with its own QR code, so students must read the label and pick the right one.
- **Expiration dates.** The default is the end of the month, one year out. Enter an earlier date to build an expired-drug trap; the EHR refuses to accept an expired package and tells the student to return it to pharmacy.
- **Med-pass debrief report** (EHR: Med-pass setup). Lists every dose documented with whether the patient and medication were scanned or overridden and why, plus every wrong patient, wrong drug, expired package and override that occurred. Clear it to run the next student.

## New in v22: a much larger patient library

- **27 primary diagnoses** (was 8), grouped by category in the picker. New: DKA, HHS, adrenal (Addisonian) crisis, myxedema coma, thyroid storm, NSTEMI, STEMI, AFib with RVR, pulmonary embolism, asthma exacerbation, hip fracture, upper GI bleed, pancreatitis, diverticulitis, acute kidney injury with hyperkalemia, cellulitis, alcohol withdrawal, new-onset seizure, and hyponatremia. Each has a day-by-day course, labs, medications with hold parameters, orders, devices, consults and learning objectives.
- **Medical history is now a grouped, searchable menu with check boxes** (158 conditions, grouped by body system: Cardiovascular, Respiratory, Endocrine / Metabolic, Renal / Genitourinary, GI / Hepatic, Neurologic, Psychiatric / Substance Use, Hematology / Oncology, Musculoskeletal / Rheumatologic, Infectious Disease, Skin / Wounds, Eye / Ear / Other). Type in the box to search; if what you typed is not in the list, press Enter (or **Add**) to add it as a custom history entry (listed in the history and problem list; no treatment effects are modeled). Each condition builds its own medications, labs, vitals, orders and nursing findings.
- **Kidney disease stages 1, 2, 3, 4, 5 and ESRD** replace one another (only the most advanced is used) and each sets realistic creatinine/eGFR, diet and renal dosing. Also new: atrial flutter, HFpEF, type 1 diabetes, cirrhosis, Parkinson's, epilepsy, sickle cell disease, lupus, HIV and many more.
- **Surgical history has a year for every item**, including surgeries you type in. 74 surgeries, grouped by body system, many with real effects (a mechanical valve adds warfarin, a transplant adds immunosuppressants, a mastectomy protects that arm, a bariatric bypass removes NSAIDs).
- Smarter safety checks: patients on full-dose anticoagulants no longer also get preventive blood thinners, and split-dose steroids are no longer flagged as duplicates.

## New in v23: patient status triggers (first example: hip fracture)

A trigger is a sudden change in the patient's condition during the 8-hour simulated shift. Vital signs, nursing findings, labs, provider orders, ECG/imaging results, and medication orders are written into the chart with future timestamps, so the EHR releases them as the simulation clock reaches them (use **Next** to jump to the next event).

- In the Case Builder, step 2 now has **Patient status trigger**: **None**, **Automatic** (the builder picks the event, start time and severity for this patient) or **I choose** (pick the event, the minutes after shift start, and mild / moderate / severe).
- **Example built: post-operative pulmonary embolism for a hip fracture patient.** Sudden dyspnea and pleuritic chest pain, HR and RR up, SpO2 down, a swollen right calf; the provider evaluates about 12 minutes later, then oxygen, ECG, chest x-ray, labs (troponin, BNP, D-dimer, ABG, lactate), a CT pulmonary angiogram (V/Q scan if ESRD; contrast-allergy premedication still applies), and a weight-based heparin bolus and infusion (high-alert; the nurse starts it from the MAR with the barcode check). Prophylactic enoxaparin is stopped. Moderate and severe patients transfer to a higher level of care.
- The **Hospital course** tab shows a **faculty key** for the trigger: the scenario, what students will see and when, the expected nursing actions with the reasons, when to escalate, common pitfalls and debrief questions. The key is saved in the case as `triggers` (not shown to students in the EHR). It is the starting point for the rubric (#10).
- Routine notes that would contradict the change (stable progress notes, therapy evaluations) are removed after the trigger starts, so students write their own documentation. Provider orders are timed as if the nurse called promptly.

## New in v24: interface and lab upgrades

- **Brain / Worklist is now a timeline**: one large row per hour of the shift (like a calendar), tasks sit in the hour they are due, a red line marks "now", and overdue tasks collect at the top. **List** brings back the old columns.
- **Patient status trigger** moved to the bottom of the Case Builder (item 8), shows a check mark on the selected choice, and can start up to 12 hours (720 minutes) into the shift; the shift lengthens automatically so the event has time to play out.
- **Wristband scanned / not scanned badge** now shows only on the MAR page and in the dose window.
- **Blood gases are complete.** Every arterial gas now reports pH, PaCO2, PaO2, bicarbonate, base excess and oxygen saturation; every venous gas reports pH, pCO2, pO2, bicarbonate, base excess and saturation (numbers calculated so they agree).
- **Lab Results**: a **Newest: right / left** button flips the order of the columns (remembered on the device).
- **Chart Review**: drag the divider between the list of notes and the open note to resize them (double-tap the divider to reset); remembered on the device.
- **MAR**: clicking a medication opens its detail card as a pop-up instead of at the top of the page.
- Added to the to-do list: a short drug guide link on every medication.

## New in v25: fixes from the review

- Orders that are placed but start later in the shift now show **Pending** (not Active) until their start time.
- **Real once-a-week medications** (methotrexate, alendronate, etanercept): they are due only on their day of the week, and earlier doses show as given.
- Home aspirin is held during an active bleed; gastroenterology and endocrinology providers added to the team list.
- **Brain / Worklist** now also creates tasks from abnormal vital signs and critical lab results as they appear.
- **Camera scanning**: the scanner window has **Scan with camera** (reads the QR code on wristbands and packages; works on an iPad over the https Pages site). Tapping and typing still work.
- The Case Builder **Notes tab** has the same draggable divider as the EHR.

## New in v26: handoff report practice with a rubric built from the patient

- **Handoff button** (top bar of the EHR). The student gives report on the patient as the chart stands at the current simulation time, in five boxes (patient and illness severity; situation and background; assessment; medications, orders and to-do; if-then plans and questions). Each box has a **Speak** button (dictation, on browsers that support it, including iPad Safari) or the student can type.
- **The rubric builds itself from the chart.** Every part of the patient creates rubric items: name, age and sex, room, code status, allergies, isolation, illness severity (stable / watcher / unstable, worked out from the vital signs, critical labs and any scenario trigger), diagnosis, presentation, hospital or post-op day, history, procedures, each vital sign, findings for each body system, abnormal and critical labs, lines and drains, I&O, diet, activity and fall risk, the scenario event and the response to it, medications given, doses due soon (high-alert ones count double), infusions, pending tests and consults, results, an if-then plan with a number, and closed-loop communication. Critical items are worth more.
- **Scoring**: full credit for a fact said in its own section, 60% if said in another section; a wrong number scores zero and is shown ("you said 100, chart shows 124"); safety errors (saying "no allergies" when there are allergies, wrong code status, calling an unstable patient stable) cost 2 points each and are listed at the top. The student sees a checklist with what the chart says for every missed item.
- **Faculty: view rubric** shows and prints the full rubric with points. Advance the clock to the end of the shift to get the end-of-shift rubric. Every attempt (score and what was missed) is saved with the patient.
- Scoring is keyword and number matching, not clinical judgment; an optional Claude review of the spoken or typed report is a possible later addition.

## New in v27: quick drug guide

- **Every medication name is a blue link** on the MAR rows, in the dose window, and in the medication detail pop-up. Tapping it opens a one-page guide: what the drug is for, the usual dose, how to give it, what to assess and monitor, when to hold it and call the provider, adverse effects (serious ones in bold red), a look-alike/sound-alike warning where one exists, high-alert marking, and what to teach the patient.
- 207 guides cover all 245 medication names the builder currently produces, including IV fluids and combination products. If a medication has no guide (for example one you typed in), the window shows the basic information from the order instead.
- The guides are a learning reference, written by Claude. Doses and hold limits should be reviewed by a pharmacist or your faculty before students rely on them; entries are marked "Always follow the order."

## New in v28: chart quiz and patient teaching practice (no AI, no internet, no cost)

- **Quiz button** (top bar). Writes 5 to 20 questions from the chart as it stands at the current simulation time: what a medication is for, its class, when to hold it, high-alert drugs, what to check before giving it, tablet and mL dose math, allergies, isolation, code status, fall risk, diet, diagnosis, history (select all that apply), lines, abnormal vital signs, abnormal and critical labs, what is due next, and what to do first when the patient changes. Every quiz is different (questions and answer order are shuffled). Feedback explains each answer; scores and attempts are saved with the patient; **Print quiz and answer key** makes a paper copy.
- **Teaching button** (top bar). The student teaches the simulated patient one topic taken from the chart (a medication on the MAR, the diagnosis, falls, or pain). The patient has an attitude (anxious, skeptical, overwhelmed, or low health literacy) and talks by script. Steps: show empathy, explain in plain language, pick the right teaching points (wrong or unsafe ones cost points), answer a misunderstanding, use teach-back, then write the education note. Feedback shows the best choice at each step and why. Attempts are saved with the patient.
- Both are rule-based: questions and scoring come from the chart and a built-in library, so there is nothing to pay for. The chat is scripted, not a live conversation; keyword scoring of the written note is approximate.

## New in v29: SBAR provider call and prioritization practice (no AI, no cost)

- **SBAR button** (top bar) has two tabs.
- **SBAR call to the provider**: the program picks the patient's most important problem from the chart (an active scenario event, then a critical lab, abnormal vital sign, abnormal lab or finding, then pain) and the student writes or dictates the call in four boxes (Situation, Background, Assessment, Recommendation). It is scored against the chart: patient name and room, the problem and the actual numbers, diagnosis, code status, allergies, an impression, timing, what you already did, a clear request, urgency and read-back. Wrong code status or "no allergies" when the patient has allergies costs 2 points. **Faculty: view rubric** prints the rubric.
- **Prioritize your tasks**: six tasks are built from the chart (sudden change, abnormal vital signs, critical and abnormal labs, high-alert medications due, plus routine tasks). The student orders them with up and down arrows. Scored by whether urgent items come before less urgent ones (airway, breathing, circulation and critical results first); feedback explains each item.
- Attempts are saved with the patient. Scoring is keyword and rule based.
- **Not built:** a class-wide shared score board or shared patient library. That needs an online database, which usually costs money. Instead use the existing **Export / Import** of patients to share cases by file, and have students export their attempts.

## New in v30: student version

- **Two pages, one app.** You use `index.html` (everything). Students use **`student.html`** (same address as yours, but with `student.html` at the end). The student page has no Quiz, Case Builder, Saved Patients, Import Patient, Med-pass setup, or faculty rubric buttons. Students can add it to the iPad Home Screen like the instructor page.
- **Sending a patient to students.** In the Case Builder's saved list (or the EHR's Saved Patients list) press **Export for students** (**For students** in the EHR). You get a file named `..._STUDENT.json` with no faculty answer key and no earlier attempts. Share it by AirDrop, email, or your course site. Students tap **Open Patient** and choose the file.
- **Getting scores back.** Students tap **My Results**, type their name, and **Save results file** (or print it) and send it to you. In your EHR, open **Saved Patients** then **Student results**, pick many results files at once, and you get one table (handoff, SBAR, prioritizing and teaching best scores, med-pass actions and scan overrides) plus **Download CSV** for your gradebook.
- **Developer note:** `student.html` is generated. After changing `index.html`, run `node make-student.js` and commit the new `student.html`.
- The student page is not a security lock (a determined student could still open the instructor page address); it simply keeps the instructor tools out of their way.

## Suggested next project
The next major item should be built separately: a **Faculty Case Builder** that accepts a much smaller scenario description and produces validated canonical v2 patient JSON for this EHR.

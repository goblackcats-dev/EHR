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

## Suggested next project
The next major item should be built separately: a **Faculty Case Builder** that accepts a much smaller scenario description and produces validated canonical v2 patient JSON for this EHR.

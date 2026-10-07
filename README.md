# NursingSim Case Builder v1

A separate faculty-facing static browser application for generating canonical v2 JSON compatible with NursingSim EHR.

## Purpose

The faculty user supplies only a patient skeleton:

- name / age / sex
- primary acute problem
- several medical history diagnoses
- student level and complexity
- optional faculty direction

The builder uses diagnosis profiles to make the case deeper and internally consistent.

Examples:

- **Hypertension**
  - raises the BP tendency
  - adds a typical antihypertensive such as lisinopril
  - links BP, potassium, and creatinine monitoring

- **Type 2 diabetes**
  - adds hyperglycemia
  - adds ACHS point-of-care glucose checks
  - adds correction insulin
  - changes diet toward consistent carbohydrate

- **CKD stage 3**
  - raises creatinine/BUN and lowers eGFR
  - changes diet to a renal pattern
  - adds renal dosing/nephrotoxin avoidance logic
  - changes medication nursing considerations
  - reduces typical urine output in the generated sample I&O

- **Atrial fibrillation**
  - adds rate-control/anticoagulation logic
  - adds metoprolol and warfarin
  - adds PT/INR data
  - links MAR monitoring to HR/BP and PT/INR

## Included acute primary problems

- Community-acquired pneumonia
- Acute decompensated heart failure
- COPD exacerbation
- Sepsis
- Acute ischemic stroke
- Complicated UTI
- Postoperative abdominal surgery

## Included medical history profiles

- Hypertension
- Type 2 diabetes
- CKD stage 3
- Coronary artery disease
- Atrial fibrillation
- COPD
- Hyperlipidemia
- Obesity
- Dementia
- Chronic anemia

## Output

The generated patient uses NursingSim canonical:

`schemaVersion: "2.0"`

It includes:

- patient/encounter
- problem list
- time-stamped vitals/labs/assessments
- medication and non-medication orders
- MAR administrations
- drug-specific monitoring rules
- devices
- I&O
- sticky notes
- problem-oriented hospitalist progress note
- baseline nursing note
- simulation timeline

## Running

Open `index.html` in a modern browser. No server is required.

## Educational note

Diagnosis profiles intentionally produce common, plausible defaults for simulation. They are not intended to imply that every real patient with a diagnosis should receive the same medication, diet, laboratory testing, or treatment.

# Instructions for note authors (Step-down patient Doris Kowalczyk)

You are writing realistic chart notes for a nursing-student simulation EHR. Students read these notes to learn how a real step-down unit chart reads, so they must be **clinically accurate, internally consistent with the chart data, detailed and written like real Epic notes** (abbreviations used the way clinicians do, SBAR where appropriate, objective findings with numbers, plans, nursing interventions and patient/family response).

## Read first (required)
1. `/home/user/EHR/casestudy/cases/hip_orif/DESIGN.md` (patient story, timeline, scenario).
2. `/home/user/EHR/casestudy/cases/hip_orif/TIMELINE.md` (the exact vitals, ventilator settings, drips, urine output, labs, medication administrations and devices). **Every number you cite must match it** (vitals at the time of the note, lab values and times, drip rates, I&O). Do not invent lab values or events that contradict it. You may add routine details that do not conflict (exam findings, family conversations, small supplies/positioning facts, wound descriptions, teaching).
3. Do NOT edit any file other than your own output file(s).

## Output format
Write ONE JSON file (an array of note objects) to the path given in your task. Each note:
```
{ "id": "note_<short_slug>_<YYYYMMDDHHMM>", "type": "<one of: progressNotes | hp | erVisitSummary | therapyNotes | caseManagement | imaging>",
  "title": "...", "author": "Name, Credentials (use the staff names in DESIGN.md)", "datetime": "YYYY-MM-DD HH:MM", "category": "...", "summary": "one sentence", "body": "..." }
```
- type mapping: nursing notes, physician/APP progress notes, procedure notes, consult notes -> `progressNotes`; EMS/ED notes -> `erVisitSummary`; history and physicals -> `hp`; RT, dietitian, PT/OT, pharmacy, SLP notes -> `therapyNotes`; case management/social work/chaplain -> `caseManagement`; radiology reports -> `imaging` (also add `"study"` and `"impression"` string fields).
- `category` examples: "Nursing Note", "Progress Note", "Procedure Note", "Consult", "H&P", "ED Note", "EMS Handoff", "Respiratory Therapy", "Nutrition", "Physical Therapy", "Occupational Therapy", "Pharmacy", "Case Management", "Social Work", "Radiology".
- `datetime` is when the note was filed; it must fall in the window 2026-11-07 22:15 to 2026-11-11 15:00, and describe only events up to that moment (never mention anything that happens later than the note time, except plans).
- `body` uses simple markdown that the app renders: section headers as `**Header**` on their own line, bullets as lines starting with `- `, blank lines between sections. Use plain ASCII (write "F" not special degree signs is fine to use "°F"; avoid emojis; use normal hyphens).
- Length: nursing notes 150-300 words; provider and ancillary notes 200-500 words; H&Ps 400-700 words. This is a simpler patient: keep notes clear and readable. Be specific and thorough, not padded.
- Nursing notes must read like real RN documentation: assessment by system with findings, vital sign trends with numbers, lines/tubes/drips and rates, pain/sedation scores (CPOT/RASS), I&O totals with urine output in mL/h and mL/kg/h (weight 61 kg), interventions, provider notifications (who, when, response), family communication, safety, and a plan/handoff for the next nurse.
- Mention staff only as named in DESIGN.md; the family member is her daughter Karen Mills.
- Validate your JSON by running: `node -e "JSON.parse(require('fs').readFileSync('<your file>','utf8')).forEach(n=>{if(!n.id||!n.datetime||!n.body) throw new Error('bad '+JSON.stringify(n).slice(0,80))}); console.log('ok')"`.
- When done, reply with ONE short message: the file path, the number of notes, and the list of titles with times. Do not paste the notes.

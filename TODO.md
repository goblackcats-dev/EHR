# To-do list (kept for later)

## Next up
### Instructor notes, 2026-11-10
- **In-class DKA patient (Caleb Mercer), later:** the insulin infusion should be adjusted by his glucose levels and anion gap (a variable-rate protocol), not one fixed rate. Build him first with the fixed rate as approved, then change the design, orders and MAR to the adjustable protocol.
- **Case study: dig through the chart notes.** Make students search the provider, consult and nursing notes more at each checkpoint (for example give the Vitals & Assessment pair, or a new job, note-based questions: what did the provider/educator/pharmacist say, what is the plan).
- **Case study: more communication, separate jobs.** Give every student a separate job to look up at each checkpoint (not 3 pairs only), so they have to report to each other and to the charge nurse. Update the `team-case-study` skill when decided.
- Done in v132: softer heart-rate beep, a more natural blood pressure cuff sound (made in code: tell the instructor to listen and say if a real recording is wanted), monitor keeps the screen awake, the "1 CRIT" badge clears when the critical lab is opened (Mark all reviewed does not clear criticals), Meds and Orders rename (Lauren and Ray packets). Checked: order acknowledgements already sync both ways in a class session.
- **Relay (Metered) data use, next step:** set up Cloudflare's free TURN relay as the second relay (get the account, then change the app to use it; check the free limit first). A home server on Tailscale is NOT suitable (students would need Tailscale). Also add a switch in the Class session to turn student screen viewing off (screen view is the biggest data user when a connection goes through the relay), and show which students are on the relay.
- **Case study patients: new labs and a new assessment at every checkpoint.** Done for Lauren Mitchell (v127) and in the `team-case-study` skill. Still to do: check the other case study patients (Ray Kessler hypermagnesemia, the burn ICU patient, Doris...) for stops with no new labs or assessment.
- **Screen view:** with the Cloudflare relay (1,000 GB a month) the live student screens can update rapidly; keep it compressed and optimized (v126 flushes every 0.25 s).
- **"Apply to our patient at 1600 and add to the patient creation skill":** the instructor wrote this right after the critical-lab note. Ask what "this" means (the critical-lab behavior? a new event at 1600?) and which patient before doing it. There is no patient creation skill yet (only `.claude/skills/team-case-study`), so one may need to be written.

- Saving: save student work somewhere safer than one browser (carry work between devices, backup file / send to instructor). Today each student's work is saved on their own device only.
- Add more to the flowsheets as the need comes up (more rows, templates, groups).
- Rebuild the Case Builder's primary diagnoses one patient at a time, very thoroughly (the old profiles are in `case-builder/primary-archive/`).
- Lab cart: the PO pills have no labels. Make printable PO labels that match the cart's hand-labeled drawers (see `reference/LAB_CART.md` and the photo `reference/lab-cart-po-drawers.jpg`): full generic and brand name plus strength, in drawer order, with a copies box for each. Drawers with plenty of pills (most-used, so default to several copies per sheet): Lasix, iron, cephalexin, potassium. The potassium pill is very large (realistic).
- Printing labels: print several copies of the same medication label on one page (for example many PO labels, since they are used most often), with a number-of-copies box for each medication.
- Case studies: write the printable packet (student questions and answer key) for the burn ICU patient; then build the next patient one at a time.
- Go through each pre-built patient (LPN Med Pass and Case Study patients) one by one.
- Security follow-ups: instructor passcode screen, move the case-study answer keys out of the public repo (or make the instructor repo private).

## Later / maybe
- Order entry (placing orders). Not wanted right now.
- Writing other note types, SmartPhrase-style templates.
- Accessibility check (screen reader, contrast, keyboard).
- Multi-patient list. Not wanted right now (single patient is fine).

## Decided
- Integrity is handled by running check-offs in the sim lab with the instructor watching; the app is a helpful adjunct.
- The bedside monitor display is a separate tool the instructor is building; the EHR only has an instructor-only suggested vitals bar.

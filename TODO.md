# To-do list (kept for later)

## Next up
### Instructor notes, 2026-11-10 (not started; do later, one at a time)
- **Bedside monitor, NBP sound:** the cuff sound is a little fake. Improve it, maybe with a free, properly licensed sound file from online.
- **Shift report:** it is unwieldy. The assessment part holds the most information and should be much less intense.
- **Brain, order acknowledgement:** when an order is acknowledged on the Brain, it must sync to every viewer in a class session.
- **Bedside monitor, keep awake:** stop the monitor computer from going to sleep (today the instructor has to move the mouse every 30 minutes). Use a screen wake lock.
- **Bedside monitor, heart-rate beep:** soften the HR beep slightly.
- **Relay (Metered) data use:** add a switch in the Class session to turn student screen viewing off (screen view is the biggest data user when a connection goes through the relay), and show which students are on the relay.
- **MAR, continuous fluids:** continuous IV fluids should have a **Due** option, and the instructor/student should be able to select the box at the current time to record what happened to the fluid: stopped, held, discontinued, bag change, etc.
- **Critical lab alert:** clicking the critical lab should clear the "1 CRIT" warning on the left side of the screen.
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

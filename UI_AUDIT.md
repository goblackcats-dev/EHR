# UI audit: NursingSim vs Epic (Hyperspace / Haiku) - round 1

Screens reviewed at iPad landscape (1180x820): Summary, Brain/Worklist, Chart Review (Notes, H&P, Imaging, Cardiology), Results Review, MAR, Orders, Flowsheets.

## Differences found (what Epic does, what we do)
1. **Header is ~205px tall and blue-gradient.** Epic: a slim (~40px) title bar, then a thin patient banner (~64px). The chart gets the screen. -> compact two-row header.
2. **Patient banner is a floating white card with stacked tags.** Epic: one strip across the top: name (bold), age/sex, DOB, MRN, then allergies, code status, isolation, fall risk as flat inline badges. -> single full-width strip, allergies in red.
3. **Nine instructor/utility buttons sit in the header** (Case Builder, Student View, Student Link, Handoff, Quiz, Teaching, SBAR, Saved Patients, Import). Real Epic shows none of this. -> one "Tools" menu; student view keeps only Open Patient and My Results.
4. **Large page titles + subtitle + status pill** on every page (28px). Epic has a slim activity title with no explanatory paragraph. -> small title, subtitle hidden, count shown inline.
5. **Heavy rounded cards with drop shadows, 12px radii.** Epic is flat: hairline borders, square corners, dense tables. -> 2px radii, no shadows.
6. **Big pill buttons (44px, bold, outlined).** Epic toolbars use small flat text-buttons (~28px). Touch targets stay >=36px on iPad. -> flat toolbar buttons.
7. **Sidebar is wide with rounded highlight and 10px padding.** Epic's chart navigator is a narrow, dense list with a left accent bar on the active item. -> 190px, tighter rows, accent bar.
8. **Font is Arial at mixed weights; labels are heavy bold.** Epic uses Segoe UI/Calibri-style 13px text with bold only for values that matter. -> system UI font stack, 13-14px base.
9. **MAR rows are very tall** (long descriptions always shown). Epic shows a one-line med name + dose/route/freq under it. -> collapse the extra detail until the row is clicked.
10. **Orders / Results tables** have large padding. Epic tables are dense with alternating banding and sticky headers. -> tighter cells.

## Plan
Round 1 (shell): header, banner, tools menu, page headers, buttons, cards, sidebar, type. Delivered as `epic.css` + `ui-shell.js` loaded last so it is easy to review and adjust.
Round 2 (pages): MAR, Orders, Results, Flowsheets, Brain, Summary, dialogs.
Round 3: re-screenshot everything, critique, refine.

## Round 2 (done, v46)
Chart Review tabs are now flat underlined tabs; note/record lists are flat rows with an accent bar; Brain buttons and Summary values compacted; dialogs flatter; storyboard flattened. Remaining ideas: sticky patient strip on scroll, tighter Flowsheet row labels, dark-text weights in tables.

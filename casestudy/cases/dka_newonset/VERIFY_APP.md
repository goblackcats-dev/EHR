# App verification: Nora Whitcombe (SIM-40602), dka_newonset

Tested in headless Chromium (Playwright) against `http://localhost:8125/index.html`, with the instructor user, the **rebuilt** `patient.json` (re-imported after the coordinator's rebuild note), the clock paused, and `simJump(240)` between stops. Monitor tested in a second page of the same context via BroadcastChannel `nursingsim`.
Scripts, raw JSON and screenshots: `/tmp/claude-0/-home-user-EHR/5a633670-2721-58fb-9d93-08b28a25fb4f/scratchpad/verify_nora/` (`stops.js`, `actions.js`, `monitor.js`, `stops_0_3.json`, `stops_4_6.json`, `actions.json`).

**Import:** Validate gave `0 error(s), 14 warning(s), 5 pass check(s)`. Apply gave "Patient imported with 14 warning(s)." The start time was `2027-02-08 07:00`. The warnings are "problem not clearly addressed in a hospitalist note" items, and none of them blocks anything.

## Results per stop

| Check | Mon 0700 | Mon 1100 | Mon 1500 | Mon 1900 | Mon 2300 | Tue 0300 | Tue 0700 |
|---|---|---|---|---|---|---|---|
| (1) Nothing visible early (obs, notes, orders; no vitals after Mon 0700) | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| (2) Newest labs = DESIGN (K / glu / CO2 / gap / BHB / pH) | PASS 4.7/352/10/23/5.4/7.24 (0530) | PASS 4.1/198/13/19/3.3/7.29 | PASS 3.6/172/14/17/1.3/7.32 | PASS 3.9/170/18/14/0.5/7.34 | PASS 4.0/152/20/13/0.3 (no gas; pH stays 7.34 from 1730) | PASS 4.1/84/22/12/0.3 | PASS 4.2/124/24/12/0.2 |
| (3) New assessment set at the stop (13 sections, Flowsheets column) | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| (4) Orders: new to acknowledge | n/a (app treats orders before the start as already seen: 0 NEW) | 0 NEW (correct: the next order is the diet at 1105) | PASS 3 NEW (clear liquids, MgSO4, KCl 20) | PASS 16 NEW (+13 transition orders) | PASS (no new; 16 pending) | PASS (no new; the 0320 POC order not shown early) | PASS 17 NEW (+0400 POC order) |
| (4) NPO at 1100: Active, "Discontinue this order", discontinue with reason | — | PASS (see below) | — | — | — | — | — |
| (4) Planted orders visible and not charted given/running | PASS bicarbonate Active, MAR "0700 Due" only | PASS (bicarbonate Discontinued 0715, never given) | PASS KCl 20 mEq Active (NEW), MAR "1500 Due" only | PASS (KCl 20 Discontinued 1510, never given) | — | — | — |
| (5) MAR Due at the current hour | PASS 0.45% 0700 Due, bicarbonate 0700 Due, rider 0715 Due | PASS rider 1130 Due (1030 also Due) | PASS MgSO4 1505 Due, KCl 20 1500 Due | PASS glargine 1900 Due, lispro 1915 Due (KCl PO 2000 next slot) | PASS (nothing due at 2300, as designed) | PASS glucose tabs 0302 Due; 0318 juice appears at 0318 (seen at 0320 in the first run) | PASS (nothing due; the window shows a single slot, "Tue 2/9 0700–0700") |
| (5) Continuous infusions: Due box at the current hour | PASS (insulin and 0.9% show 0700 Running pills; D5 shows a Due box) | PASS insulin + D5 Due | PASS insulin + D5 Due | PASS insulin + D5 Due (+2100 stop Due) | PASS (drips off 2100: no box) | PASS | PASS |
| (5) Chart a continuous "Running" | — | **FAIL (rate prefill)**: the pill appears, but it reads "1100 Running 0.1 mL/h" | — | — | — | — | — |
| (5) Riders when expected | PASS 0715 | PASS 1030, 1130 | PASS (new data: at 1500 only KCl 20 and MgSO4 are Due; at 1510 riders 1505/1605/1705/1805 appear as Due) | PASS (no rider at 1900) | — | — | — |
| (6) CRIT badge (Lab Results) | 8 CRIT | 9 CRIT (+BHB 3.3) | 9 CRIT | 9 CRIT | 9 CRIT | 9 CRIT | 9 CRIT |
| (6) Brain badge | 13 | 26 | 40 | 68 | 72 | 73 | 77 |
| Monitor HR / BP / rhythm vs DESIGN §18 | PASS HR 104-106 (106), BP 107/67-111/63 (110/66), Sinus tachycardia, RR 24-25 | — | PASS HR 87-93 (90), BP 111/71 (114/70), Sinus Rhythm, RR 19 | PASS HR 92-96 (94), BP 115/73 (118/74), Sinus Rhythm, RR 18 | — | PASS HR 105-111 (108), BP 130/75 (126/76), Sinus tachycardia, RR 18 | — |

Notes on the table:
- Badges are cumulative because the run does not open labs or acknowledge anything. The CRIT count is 9 critical-flag labs: ED set 1 (CO2 7, glucose 562, BHB 6.8, pH 7.14, HCO3 6.2), set 2 (BHB 5.4, HCO3 9.2), set 3 (BHB 3.3) and POC 548.
- The monitor adds ±2-4 random variation to HR and BP by design (`rewander` / `vr()` in `monitor.html`). The values were sampled for 6-45 s after each broadcast, and all fall within that variation of the DESIGN row. The clock showed the right time ("Mon 07:00", "Tue 03:00"), and the banner read "SD-6 WHITCOMBE, NORA 22 F".

## NPO discontinue test (Mon 1100)
- Before: `NPO except ice chips` was Active, and the detail pane showed the button "Discontinue this order".
- Clicking it raised the prompt `Discontinue "NPO except ice chips"? Why is this order being stopped? (required)`. I answered "Criteria met per DKA diet advancement protocol: no vomiting since 0215, ...".
- After: status Discontinued, end 2027-02-08 11:00, `orderStop` = {at 11:00, by "I T", reason}. The row pill read "Discontinued", the detail pane had a "Discontinued / I T at 2027-02-08 11:00: ..." section, and the button was gone. It was still Discontinued (end 11:00) after jumping to 1500. **PASS**

## Problems found

1. **FAIL: insulin infusion rate prefill is wrong in the continuous-charting window.** At 1100 I clicked the insulin row's current-hour cell. The dialog opened with title, options and "Running" selected, but the Rate (mL/h) box was prefilled with **0.1**. Accepting it charted the pill "1100 Running **0.1 mL/h**". Expected 5.5 (5.5 units/h = 5.5 mL/h). Cause: `mar-infusion.js` takes the first number in `medication.dose`, which is `"0.1 unit/kg/h = 5.5 units/h (5.5 mL/h)"`. A data-side fix is to start the dose text with the rate, e.g. `"5.5 units/h (5.5 mL/h) = 0.1 unit/kg/h"`. The 0.9% NaCl row has the same problem ("500 mL/h x 2 hours, then 250 mL/h" prefills 500 where 250 is expected), but that row already has a 0700 Running pill and is stopped at 0700, so it matters less. dka_inclass has the identical insulin dose pattern.
2. **Problem (Flowsheets): stale "Suggested vitals" at later stops.** At Tue 0300 the Vital Signs tab shows "Suggested vitals for 03:00: HR 106 | BP 110/66 (MAP 81) | RR 24 | SpO2 99% | Temp 98.6 F | Pain 4 (no further sets planned)". Those are the Mon 0700 arrival vitals. The monitor and DESIGN at 0300 are HR 108, 126/76, RR 18, T 97.9, pain 2, during hypoglycemia. A student who uses "Fill column with suggested vitals" charts Kussmaul RR 24 and pain 4 overnight. This comes from the design choice of no charted vitals after 0700 (the app falls back to the last set). Fix options: add monitor-matched vital rows per stop as `availableAt`-gated suggestions, or accept it and tell students to take vitals from the monitor.
3. Minor: the D5W/0.45% NaCl row shows a continuous **Due box at Mon 0700**, though the order applies only when glucose is under 250 (0700 glucose 274; the first real due is 0800). This is generic app behaviour for any continuous row with orderStartIndex 0. It may prompt students to hang dextrose early, or it can be used as a teaching cue.
4. Minor: there is no NEW order to acknowledge at the 1100 stop, because the only order between 0700 and 1100 is the diet, entered at 1105. At 0700 the admission orders (orderedAt 0540) are also not NEW, because the app counts only orders that arrive after the start. This is consistent with DESIGN, but neither stop exercises "acknowledge".
5. Minor/cosmetic: the "Pharmacy: FYI: potassium chloride 20 mEq in 100 mL IV" toast seen at 1500 is still on screen in the Tue 0300 screenshot after the jumps.
6. Minor: on the MAR at Tue 0700 the current-shift window is the single final slot ("Tue, 2/9 0700–0700"), so all columns are empty. Nothing is due, per design.
7. Already-stopped planted orders (bicarbonate 0700, KCl 20 mEq 1500/1600) keep their grey "Due" / "Due Overdue" pills after they are discontinued. They are never shown as given. Expected app behaviour, noted only.

## Page and console errors
- index.html: **no page errors and no console errors** in any run (stops 0-3, stops 4-6, actions).
- monitor.html: one console error, `Failed to load resource: 404`. It is `/favicon.ico` (confirmed 404 with curl), so it is harmless.
- Dialogs: only the expected discontinue prompt.

## Screenshots (deviceScaleFactor 1)
- `orders_D1_1100.png` (NPO selected, "Discontinue this order"), `orders_D1_1100_npo_discontinued.png`
- `mar_D1_1500.png`, `mar_D1_1510.png` (riders appear), `mar_D1_1100_insulin_running.png`
- `flowsheets_D2_0300.png`
- `monitor_202702080700.png`, `monitor_202702081500.png`, `monitor_202702081900.png`, `monitor_202702090300.png`

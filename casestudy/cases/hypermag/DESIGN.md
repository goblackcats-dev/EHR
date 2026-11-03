# Telemetry step-down patient: hypermagnesemia from OTC magnesium with AKI on CKD 4, emergent hemodialysis  (single source of truth)

Simulation: **Tue 2026-11-17 07:00 to Wed 2026-11-18 07:00**, run in **4-hour jumps (checkpoints 0700, 1100, 1500, 1900, 2300, 0300, 0700)**. "h" = hours after Tue 07:00 (negative = history). **Vital signs are in the chart ONLY up to the 0700 arrival set**; for every later checkpoint the instructor sets the vitals on the bedside monitor (see INSTRUCTOR_GUIDE.md) and the students chart them. Labs, orders, notes, devices, I&O and stickies are time-gated with `availableAt`. MAR doses after 0700 are `due` (students give them); only history (ED) doses and the dialysis nurse's 1630 saline are charted `given`.

## Patient
- **Raymond "Ray" Kessler**, 74-year-old man, DOB 1952-04-22, MRN SIM-40318, he/him. Height 175 cm, weight 88.0 kg on arrival (dry weight about 90), BMI 28.7. Allergy: **penicillin (childhood rash)**. **Full Code**. Retired machinist; former smoker (quit 2005); no alcohol.
- Unit: **Telemetry Step-Down 5 East, room 5E-14**. Attending hospitalist **D. Okafor, MD** (0700-1900); night hospitalist **J. Lindgren, MD** (admission 0645, and 1900-0700); nephrology **P. Raman, MD**; ED physician **R. Alvarez, MD**; ICU outreach **H. Moreno, MD**; pharmacist **L. Ferreira, PharmD**; dietitian **C. Bianchi, RD**; case manager **N. Thompson, RN CM**; rapid response RN **S. Nakamura, RN**; dialysis RN **D. Whitaker, RN**; ED RN **K. Ortiz, RN**; day RN (the students) **M. Hollis, RN**; night RN **T. Banerjee, RN**.
- Family: wife **Eleanor Kessler** (72, health care proxy, lives with him), daughter **Diane Ruiz** (lives 15 minutes away). PCP H. Whitmore, MD.
- History: CKD stage 4 (baseline creatinine 2.6, eGFR 25 on 10/20; not yet seen by nephrology), type 2 diabetes 15 years with neuropathy (A1c 7.8%), HFpEF (EF 55%), hypertension, hyperlipidemia, GERD, chronic low back pain, chronic opioid-related constipation.
- Home meds (ED list): lisinopril 20 mg daily, metoprolol succinate 50 mg daily, furosemide 20 mg daily, insulin glargine 22 units HS (last dose Mon 2100) + lispro 6 units with meals, atorvastatin 40 mg HS, aspirin 81 mg, pantoprazole 40 mg, gabapentin 300 mg HS, oxycodone 5 mg q12h PRN. **OTC products NOT on the ED list (in the bag the wife brings, found by the pharmacist at 0750):** milk of magnesia 30 mL 3-4 times a day x 2 weeks; Mg/Al hydroxide antacid (Maalox type) after meals and HS plus extra doses x 4 days; magnesium oxide 400 mg BID x 3 weeks (leg cramps); ibuprofen 600 mg TID x 2 weeks.

## What happened
- Fri 11/13 on: 4 days of vomiting and poor intake ("stomach bug"), more antacid, lisinopril + furosemide + ibuprofen continued, glargine taken Monday night. Last stool Fri 11/13.
- **Tue 11/17 0335** wife could not wake him; **ED arrival 0415**. 0425 T 97.2, HR 46, BP 82/46, RR 14, SpO2 95% RA, glucose 148. ECG 0430: sinus bradycardia 46, PR 248 ms, QRS 124 ms, QTc 468. Labs 0440 (resulted 0535): **Mg 7.8**, K 5.4, Cr 4.9, BUN 84, eGFR 12, CO2 17, Ca 8.1 (alb 3.3), phos 6.2. Ondansetron 0510; **calcium gluconate 1 g IV 0555-0605**; NS 500 mL 0605-0635; Foley 16 Fr 0610. Admitted; handoff 0655.

## Checkpoint story (exact values; the chart and the guide match these)
| Time | Monitor vitals (instructor sets) | Patient / key events | Labs that appear (collected -> result) |
|---|---|---|---|
| **0700** (in chart) | T 97.6, HR 52, BP 96/56, RR 14, SpO2 94% RA, pain 2/10, sinus brady + 1st-degree AVB (PR 0.26 s), POC glucose 132 | Drowsy, wakes to voice, slurred; DTR 1+; flushed, dry; NPO; bag of bottles not yet reviewed | ED labs: Mg 7.8, K 5.4, Cr 4.9 |
| **1100** | T 97.4, HR 44, BP 84/48, RR 10 shallow, SpO2 91% RA (94% on 3 L), pain 0/10, sinus brady 44, POC 104 | DTRs ABSENT, can barely lift legs, rouses to voice only; UO 20 mL/h; rapid response 1115 | 0900 (res 0950): Mg 8.7, K 5.3, Cr 4.8; FENa 0.6% (1000); renal US (1015) |
| **1500** | T 97.2, HR 46, BP 88/50, RR 9, SpO2 92% on 4 L, EtCO2 52, CPOT 0, wide QRS, POC 88 | Responds to loud voice only; DTR absent; urine 10 mL/h; crackles at bases starting; dialysis catheter in; HD starts 1500 | 1115 STAT (res 1200): Mg 9.5, K 5.6; ABG 1130; 1315 (res 1400): **Mg 10.9**, K 5.8, Cr 5.3; ABG 1415 pH 7.20/52; ECG 1330 HR 38, PR 320, QRS 148 |
| **1900** | T 97.6, HR 66, BP 104/60, RR 16, SpO2 96% RA, pain 3/10, sinus 66; **POC glucose 54** (at 1905) | Post-HD: awake, oriented x3, DTR 1+ returning, **shaky, sweaty (hypoglycemia)**; tingling around mouth | 1700 (res 1745): Mg 7.2, K 4.4, glucose 71; 1800 post-HD (res 1850): **Mg 4.6**, K 3.9, Ca 7.7, iCa 1.02; ECG 1830 QTc 486 |
| **2300** | T 98.2, HR 62, BP 112/64, RR 16, SpO2 96% RA, pain 3/10, sinus 62, POC 118 | Restless, confused (CAM +), pulling at lines; wife went home 2100; D10W running | 2100 (res 2145): Mg 5.6, Ca 7.9, iCa 1.06, Cr 3.4 |
| **0300** | T 98.0, HR 56, BP 104/60, RR 12, SpO2 95% RA, pain 4/10 (abdominal), sinus 56 + 1st-degree AVB, POC 126 | Drowsy but wakes, DTR 1+, abdomen distended, hypoactive, no stool x 4 days | 0100 (res 0145): **Mg 6.4 (rebound)**, K 4.5, Ca 8.1; ECG 0230 PR 236; KUB (0345) stool burden |
| **0700** | T 98.0, HR 68, BP 124/70, RR 16, SpO2 96% RA, pain 2/10, sinus 68, POC 112; weight 90.0 kg | Alert, DTR 2+, large stool 0345, UO 85 mL/h, bibasilar fine crackles | 0500 (res 0545): Mg 5.3, K 4.3, Cr 3.3, Ca 8.4; ECG 0600 normal PR |

## Chemistry table (collected / result time -> value)
Columns: Mg, K, Cr, BUN, Na, Cl, CO2, glucose, Ca, phos.
- 10/20 clinic: 2.4, 4.8, 2.6, 58, 138, 104, 21, 156, 9.0, 4.6 (eGFR 25; A1c 7.8)
- Tue 0440 / 0535: 7.8, 5.4, 4.9, 84, 134, 99, 17, 148, 8.1, 6.2 (eGFR 12)
- Tue 0900 / 0950: 8.7, 5.3, 4.8, 82, 135, 100, 18, 122, 8.7, 6.3
- Tue 1115 / 1200 (STAT): 9.5, 5.6, 5.0, 84, 135, 100, 17, 108, 8.5, 6.4; lactate 2.0
- Tue 1315 / 1400: 10.9, 5.8, 5.3, 88, 136, 101, 16, 96, 8.3, 6.5
- Tue 1700 / 1745 (mid-HD, circuit): 7.2, 4.4, 3.9, 52, 137, 101, 21, 71, 8.0, 4.6
- Tue 1800 / 1850 (post-HD): 4.6, 3.9, 3.0, 38, 138, 102, 23, (not run), 7.7, 3.3; ionized Ca 1.02
- Tue 2100 / 2145: 5.6, 4.3, 3.4, 40, 138, 102, 22, 118, 7.9, 4.0; iCa 1.06
- Wed 0100 / 0145: 6.4, 4.5, 3.5, 44, 137, 101, 22, 132, 8.1, 4.2; iCa 1.08
- Wed 0500 / 0545: 5.3, 4.3, 3.3, 42, 138, 102, 23, 128, 8.4, 4.3; albumin 3.1; Hgb 9.6
- Other: ED CBC WBC 11.8, Hgb 10.4, Plt 214; 0900 Hgb 10.0; troponin 0.03; BNP 452; INR 1.1; ABG 1130 (3 L) 7.24 / 46 / 72 / HCO3 19; ABG 1415 (4 L) 7.20 / 52 / 68 / HCO3 20.
- Mg normal 1.7-2.2 mg/dL; critical over 5.0. The Mg level rises from 7.8 to 8.7 to 9.5 to 10.9 (peak 1315) then 7.2, 4.6 (post-HD), rebound 5.6, 6.4, then 5.3.

## Intake and output blocks (strict I&O story)
ED 0430-0700: in 500 (IV) / out 230 (urine 130, emesis 100). 0700-1100: in 800 / out 160 (hourly 35, 30, 55, 40). 1100-1500: in 845 / out 70 (20, 25, 15, 10). 1500-1900: in 450 / out 575 (urine 75: 15, 20, 20, 20; HD ultrafiltration 500). 1900-2300: in 500 (PO 360, D10W 140) / out 210 (45, 50, 55, 60). 2300-0300: in 300 / out 190 (55, 50, 45, 40). 0300-0700: in 360 / out 280 (55, 65, 75, 85; stool x1 0345 not measured). Total in 3,755, out 1,715, net +2,040 mL; weight 88.0 -> 90.0 kg.

## Orders (all gated by `orderedAt`; start is never after orderedAt)
- **0645 admission (Lindgren):** telemetry; NPO until swallow screen; VS/LOC/RR/DTR q1-2h; strict I&O hourly urine (Foley, ED 0610); no Mg/phosphate products; fall and aspiration precautions; Mg/BMP/phos q4h; POC glucose q4h; NS 500 mL over 60 min (due 0715), NS 100 mL/h (due 0815, stopped 1415); furosemide 80 mg IV (due 0915); calcium gluconate 1 g IV PRN; ondansetron PRN; acetaminophen PRN; hypoglycemia protocol (PO 15 g, D50 25 g IV); lispro renal-sensitive correction q4h; pantoprazole IV; heparin 5,000 units SQ q8h; **default order-set items that are traps:** nurse-driven bowel protocol ending in milk of magnesia, diphenhydramine PRN sleep (both discontinued 0330). Home meds held (lisinopril, metoprolol, furosemide PO, gabapentin, oxycodone, glargine, aspirin, atorvastatin).
- **0750:** home OTC products discontinued (milk of magnesia, Mg/Al antacid, magnesium oxide, ibuprofen) with reasons; pharmacy consult. **0830:** nephrology (routine), renal US, urine Na/Cr.
- **1115 rapid response (Okafor):** calcium gluconate 1 g IV; NS 250 mL; oxygen 2-4 L; atropine PRN; pacing pads; vitals q15 min; STAT labs/ABG/ECG; nephrology urgent + ICU outreach.
- **1215 nephrology:** furosemide 160 mg IV (1230), calcium gluconate 2 g IV (1235), repeat labs 1315/1415, ECG 1330.
- **1350 emergent HD:** HD 3 h (low-Mg dialysate, heparin-free), right IJ catheter (placed 1440), CXR (cleared 1455), calcium gluconate 2 g (1400), stop NS 1415; intradialytic NS 250 mL protocol (given by HD RN 1630).
- **1845 post-HD:** vitals/glucose q15 min x4 then hourly x4; Mg q4h. **1920-1930:** D10W 40 mL/h until 0130, glucose hourly x3, renal diet 1,200 mL fluid. **2130:** PEG 17 g BID, senna 17.2 mg HS. **2310:** delirium precautions; melatonin PRN. **0245:** bisacodyl 10 mg PR, KUB, ECG; **0330:** bowel protocol and diphenhydramine discontinued. **0630-0650:** case management / dietitian / PT; furosemide 80 mg IV at 0800; Foley removal order.

## Devices
PIV 20 g left forearm (ED 0435); PIV 18 g right antecubital (ED 0445; use for calcium gluconate); Foley 16 Fr (ED 0610, still in at 0700 Wed; removal ordered 0650); oxygen NC 2-4 L 1120-1830; **right IJ temporary dialysis catheter 12 Fr placed 1440 (stays in at the end of the sim; dialysis staff only)**. Telemetry is an order, not a device.

## Notes (all time-gated by datetime)
ED triage RN 0435, CXR 0505, ED RN 0630, ED provider 0610, H&P 0650, handoff 0655, pharmacy med history 0750, hospitalist 0845 and 1030, renal US 1015, RRT RN note 1140, hospitalist event note 1155, nephrology consult 1240, nephrology HD decision 1355, procedure note 1450, CXR 1455, ICU outreach 1435, HD nursing note 1855, nephrology post-HD 1850, hospitalist hypoglycemia 1940, night hospitalist 2330, event note 0320, KUB 0345, nephrology 0645, pharmacy teaching 0640, dietitian 0655, case management 0658. Notes by the students' unit RN are NOT pre-written: the students write them.

## Chart reminders
- No vital signs after 0700 in the chart. No assessment rows after 0700 (ED 0430 and unit 0700 baselines only). No POC glucose after 0700 (students do them).
- Every number in the instructor guide must match this file and the generators. After any change: `node gen/assemble.js`, then from the repo root `node tools/make-prebuilt.js`.

# Telemetry patient: adrenal (Addisonian) crisis in known Addison disease after viral gastroenteritis  (single source of truth)

Simulation: **Mon 2026-12-07 07:00 to Tue 2026-12-08 07:00**, run in **4-hour jumps (checkpoints 0700, 1100, 1500, 1900, 2300, 0300, 0700)**. "h" = hours after Mon 07:00 (negative = history). **Vital signs are in the chart ONLY up to the 0700 arrival set**; for every later checkpoint the instructor sets the vitals on the bedside monitor (monitor.html, built-in scenario for MRN SIM-40422; see INSTRUCTOR_GUIDE.md) and the students chart them. Labs, orders, notes, devices, I&O and stickies are time-gated. MAR doses after 0700 are `due` (students give them); only EMS and ED doses are charted `given`. This is a teaching case about **recognition, the standard treatment plan and evaluation of the response**, not a chaotic one.

## Patient
- **Lauren Mitchell**, 46-year-old woman, DOB 1980-05-14, MRN **SIM-40422**, she/her. Height 165 cm, weight **58.2 kg** on arrival (usual 61.0 kg), BMI 21.4. Allergy: **sulfamethoxazole-trimethoprim (hives)**. **Full Code**. Middle school science teacher; never smoker; rare alcohol.
- Unit: **Medical-Surgical Telemetry 4 West, room 4W-22**. Admitting night hospitalist **K. Osei, MD** (H&P 0640; nights 1900-0700); day hospitalist **R. Delacroix, MD** (0700-1900); endocrinology **M. Harrington, MD**; ED physician **A. Brennan, MD**; ED RN **J. Castillo, RN**; pharmacist **T. Nakagawa, PharmD**; dietitian **E. Lindqvist, RD**; case manager **G. Fontaine, RN CM**; EMS paramedic B. Shaw (Medic 14); day RN (the students) **A. Rivera, RN**; night RN **P. Okonkwo, RN**. Outpatient: PCP L. Grant, MD; endocrinologist S. Kaur, MD (last seen 18 months ago).
- Family: husband **Daniel Mitchell** (48, health care proxy); son **Ethan** (15, had a "stomach bug" Friday).
- History: **autoimmune primary adrenal insufficiency (Addison disease) since 2021** (fatigue, weight loss, salt craving, tanning; 21-hydroxylase antibodies positive), **Hashimoto hypothyroidism** 2016, appendectomy age 19. No prior crisis. Never prescribed an emergency injection kit; never taught sick-day rules. Family: mother type 1 diabetes and vitiligo, sister Hashimoto.
- Home meds: **hydrocortisone 15 mg at 0700 + 5 mg at 1400 (20 mg/day)**, **fludrocortisone 0.1 mg daily**, levothyroxine 88 mcg at 0600, vitamin D3 2,000 units daily.

## What happened
- Sat 12/5 afternoon: vomiting and 6-8 watery stools a day. Vomited hydrocortisone Sat afternoon and Sun morning; no extra doses, no injection. Last dose absorbed Sat 0700. Sun: dizzy on standing, salt craving, fell to her knees (bruised knees, no head strike).
- **Mon 0318** husband found her confused on the bathroom floor. **EMS 0335-0400**: BP 74/40, HR 126, RR 22, SpO2 96%, T 99.6, glucose 58; 18 g left AC, NS 500 mL.
- **ED (arrival 0400)**: triage 0405 T 99.8, HR 124, BP 78/44, RR 22, SpO2 97% RA, pain 6, POC glucose 52, GCS 13. **0406** 20 g right forearm IV + labs incl. **random cortisol and ACTH (BEFORE steroid)**. **0408 D50 25 g** (glucose 132 at 0425). **0420 hydrocortisone 100 mg IV push.** NS 1 L 0415 (30 min), ECG 0425 (sinus tach 118, peaked T), ondansetron 4 mg 0430, blood cultures x2 0430, emesis 150 mL 0440, NS 1 L 0450 (60 min), void 150 mL 0450 (UA), liquid stool 200 mL 0515, **D5NS 150 mL/h from 0600**, EMS IV removed and 18 g left forearm placed 0640. Vitals 0445 86/50 HR 116; 0530 92/54 HR 108 (glucose 96); 0620 96/58 HR 104 T 99.4; glucose 0645 88. Admitted 0640 (H&P); handoff 0655; telemetry on 0655.

## Checkpoint story (exact values; the chart, the guide and the monitor scenario match these)
| Time | Monitor vitals (instructor sets) | Patient / key events | Labs/ECG/notes that appear (collected -> result) |
|---|---|---|---|
| **0700** (in chart) | T 99.4, HR 104, BP 98/60 lying, RR 18, SpO2 98% RA, pain 4, **sinus tachycardia, tall T waves**, POC glucose 88 (0645) | Drowsy, oriented x2, nauseated, belly cramps, hyperpigmented; not safe to stand; first unit hydrocortisone due **1000** | ED labs: Na 126, K 6.0, Cr 1.6, glucose 49; ECG 0425 peaked T |
| **1100** | T 99.0, HR 112, BP 94/58, RR 20, SpO2 98% RA, pain 3, sinus tach; **POC glucose 58** | Shaky, sweaty, anxious, "foggy" (hypoglycemia) -> D50 25 g IV 1105 -> 142 at 1120; mild nausea; liquid stool 0945 (sample sent) | 0900 (res 0950): Na 128, K 5.5, Cr 1.4, glucose 74, lactate 1.4; pharmacy 0830; hospitalist 0915 |
| **1500** | T 98.8, HR 92, BP 108/66 lying; **standing 94/60, HR 114, dizzy (orthostatic positive)**; RR 16, SpO2 99%, pain 2, sinus; POC 118 | Alert, oriented x3; nausea gone (clear liquids 1345); **urine about 260 mL/h**; **Na +6 in 9 h** -> RN calls; fluid changed 1530 | C. diff negative 1240; **cortisol 1.8** (res 1310); 1300 (res 1350): **Na 132**, K 4.9, Cr 1.2; ECG 1330 normal T (res 1340); endo consult 1400; **ACTH 1,240** (res 1440); endo addendum 1450 |
| **1900** | T 98.6, HR 86, BP 112/70 lying; standing 104/66, HR 96 (negative); RR 16, SpO2 99%, pain 1, sinus; POC 142 | Oriented x4, headache gone; tolerating fluids; loose stool 1640; regular diet 1830; walking with assist | 1700 (res 1750): Na 133, K 4.4, Cr 1.0; **norovirus** (res 1820); hospitalist 1535; dietitian 1815 |
| **2300** | T 98.4, HR 80, BP 116/72 lying; standing 112/70, HR 88 (negative); RR 16, SpO2 98%, pain 0, sinus; POC 152 | Cannot sleep ("wired"), anxious about her son and work; glucose 152 after dinner (steroid effect) | 2100 (res 2150): Na 133, K 4.0, Cr 0.9; melatonin PRN order 2315; night note 2320 |
| **0300** | T 98.2, HR 76, BP 118/74, RR 14, SpO2 98%, pain 0, sinus (T waves smaller); POC 128 | **0240 walked to the bathroom alone, lightheaded, sat on the toilet and called (no fall)**; soft loose stool; **right forearm IV infiltrated** | 0100 (res 0150): Na 133, **K 3.7**, Mg 1.9, phos 2.9; night event note 0310 |
| **0700** | T 98.2, HR 74, BP 120/76 lying; standing 116/74, HR 80; RR 14, SpO2 99%, pain 0, sinus; POC 112; weight 59.8 kg | Alert, eating, wants to go home; ready for the oral switch and teaching | 0500 (res 0550): **Na 134** (+8 in 25 h), **K 3.5**, Cr 0.8; CBC 0500 (Hgb 11.9, WBC 12.6, eos 0.4%); blood cultures no growth 24 h (0530); KCl order 0610; hospitalist 0615; endo 0630; pharmacy 0640; CM 0650 |

Orthostatic rule used: positive if systolic drops 20 or more, diastolic 10 or more, heart rate rises 30 or more, or symptoms. At 1500: systolic -14, HR +22 **with dizziness** = positive. At 1900: -8 / +10, no symptoms = negative.

## Chemistry table (collected / result time -> value)
Columns: Na, K, Cl, CO2, BUN, Cr, glucose, Ca (Mg, phos when drawn).
- 09/22 clinic: 137, 4.6, 102, 26, 14, 0.8, 88, 9.4 (Mg 2.0, phos 3.4; TSH 2.8)
- **Mon 0406 / 0510 (ED, before steroid):** **126, 6.0**, 94, 18, 38, **1.6**, **49**, **10.6** (Mg 2.3, phos 4.8); anion gap 14; albumin 4.6; serum osm 264; lactate 3.1 (res 0440); lipase 34, AST 28, ALT 22, bili 0.6, troponin 0.01; TSH 4.6, free T4 1.1 (res 0615)
- Mon 0900 / 0950: 128, 5.5, 98, 19, 34, 1.4, 74, 9.9; lactate 1.4
- Mon 1300 / 1350: **132**, 4.9, 102, 20, 28, 1.2, 96, 9.4  (Na +6 in 9 h)
- Mon 1700 / 1750: 133, 4.4, 104, 20, 22, 1.0, 112, 9.2
- Mon 2100 / 2150: 133, 4.0, 104, 21, 18, 0.9, 128, 9.0
- Tue 0100 / 0150: 133, 3.7, 103, 22, 15, 0.9, 136, 8.9 (Mg 1.9, phos 2.9)
- Tue 0500 / 0550: **134**, **3.5**, 103, 23, 13, 0.8, 118, 8.9 (Mg 1.8, phos 3.1); albumin 3.6. Sodium 126 -> 134 in 25 h = **+8 (at the limit, not over)**.
- eGFR (CKD-EPI 2021, female 46): 92 (clinic), 40, 47, 57, 70, 80, 80, 92.
- **Cortisol, random (0406, before hydrocortisone): 1.8 mcg/dL, result Mon 1310** (critical low). **ACTH (0406): 1,240 pg/mL, result Mon 1440.** Renin and aldosterone added on at 1345: "Pending (send-out, 3-5 days)" from 1350.
- CBC 0406 (res 0450): WBC 10.8, Hgb 14.6, Hct 43.8, Plt 268, neutrophils 50%, lymphocytes 38%, **eosinophils 7.0% (abs 0.76)**. Tue 0500 (res 0545): WBC 12.6, Hgb 11.9, Hct 35.6, Plt 231, neutrophils 82%, lymphocytes 12%, eosinophils 0.4% (abs 0.05).
- Urine 0450 (res 0530-0540): SG 1.026, ketones 2+, protein trace, otherwise negative, hCG negative; **urine Na 48** (high despite dehydration = aldosterone deficiency), urine osm 420.
- Micro: blood cultures x2 (0430) "no growth at 24 h" Tue 0530; **C. difficile PCR negative** (collected 0945, res 1240); **GI panel norovirus GI/GII DETECTED** (0945, res 1820).
- ECG 0425 (res 0435): sinus tachycardia 118, PR 148, QRS 88, QTc 428, **peaked T waves V2-V4**. ECG 1330 (res 1340): sinus 94, PR 152, QRS 86, QTc 432, **T waves normal**. Both are Chart Review > Cardiology records with images (gen/ecg/make_ecgs.py).
- POC glucose in the chart: EMS 0340 58, ED 0405 52, 0425 132, 0530 96, 0645 88. **Later POC values are given by the instructor**: 0900 72, **1100 58** (1120 after D50: 142), 1300 104, 1500 118, 1900 142, 2300 152, 0300 128, 0700 112.

## Intake and output blocks (strict I&O; voids measured with a hat)
Home 48 h estimate: in 800 PO / out 2,400 (urine 500, emesis about 900 + diarrhea about 1,000).
EMS + ED 0335-0700: in 2,700 IV (EMS NS 500, NS 2,000, D50 50, D5NS 150) / out 500 (urine 150, emesis 150, stool 200).
0700-1100: in 660 (IV 600, PO 60) / out 630 (voids 0800 120, 0930 140, 1050 120; liquid stool 250 at 0945).
1100-1500: in 770 (IV 600 + D50 50, PO 120) / out 1,050 (voids 1150 250, 1300 300, 1400 280, 1450 220: **about 260 mL/h water diuresis**).
1500-1900: in 905 (IV 425 = D5NS 75 to 1530 + D5 0.45% NaCl 350; PO 480) / out 1,100 (voids 1600 300, 1730 320, 1850 280; loose stool 200 at 1640).
1900-2300: in 1,120 (IV 400, PO 720) / out 700 (voids 2000 250, 2130 250, 2250 200).
2300-0300: in 640 (IV 400, PO 240) / out 600 (voids 0030 250, 0245 200; soft loose stool 150 at 0240).
0300-0700: in 760 (IV 400, PO 360) / out 500 (voids 0430 250, 0640 250).
Unit 0700-0700: in 4,855 / out 4,580 (net +275). Since EMS: in 7,555 / out 5,080 (net +2,475). Weight 58.2 -> **59.8 kg** (Tue 0600).

## Orders (all gated by `orderedAt`; start is never after orderedAt)
- **EMS/ED (given):** NS 500 mL (EMS 0345); D50 25 g (0408); **hydrocortisone 100 mg IV (0420)**; NS 1 L (0415) and 1 L (0450); ondansetron 4 mg (0430); D5NS 150 mL/h (0600, ED order 0550, continued by the hospitalist; **stopped 1530**). Cortisol/ACTH draw before steroid (0406), blood cultures (0425), Full Code.
- **0640 admission (Osei):** telemetry; VS q1h x4 then q2h until SBP >= 100 x2 then q4h, mental status q4h; **orthostatic VS when lying SBP >= 100 and alert (about 1500), then q8h**; strict I&O every void, daily weight 0600; bed rest with commode 1 assist (ended 1545); fall precautions; contact (enteric) precautions with soap and water; NPO except ice chips/sips (ended 1345); BMP q4h x6 (0900-0500) with the +8/24 h limit; POC glucose q2h x3 then q4h; lactate 0900, Mg/phos 0100 and 0500, CBC 0500; ECG 1330. **Hydrocortisone 50 mg IV q6h (due 1000, 1600, 2200, 0400; order ends Tue 0635)**; ondansetron 4 mg IV q6h PRN; acetaminophen 650 mg PO PRN; hypoglycemia protocol (15 g PO; D50 25 g IV); enoxaparin 40 mg SubQ daily (due 2100); levothyroxine 88 mcg (due **Tue 0600**). **Home meds held (0640):** hydrocortisone PO, **fludrocortisone (held while hydrocortisone > 50 mg/day)**, levothyroxine (Monday only), vitamin D3.
- **0730 (Delacroix):** endocrinology consult; pharmacy consult; stool C. diff PCR + GI panel (collected 0945).
- **1130:** POC glucose q1h x2, then q2h until three over 70, then q4h (ends 1900).
- **1345:** clear liquids (Delacroix; ends 1830); renin/aldosterone add-on (Harrington). **1400:** dietitian consult.
- **1530 (Delacroix, after the RN's 1505 SBAR):** **D5 0.45% NaCl 100 mL/h replaces D5NS**; sodium limit order (Na <= 134 until 0400 Tue; call for Na > 134, urine > 250 mL/h x2 h, neuro change). **1545:** up with 1 assist, repeat orthostatics 1900 (ends 1930).
- **1830:** regular diet, no sodium restriction. **1930 (Osei):** ambulate with assist. **2315:** melatonin 3 mg PRN.
- **Tue 0610:** KCl 20 mEq PO once (due 0630); BMP Tue 1300. **0630:** case management. **0635 (Harrington):** oral hydrocortisone 20 mg 1000 / 20 mg 1500 / 10 mg 2000 then double home dose (30 + 10) until diarrhea gone 24 h, then 15 + 5; **fludrocortisone 0.1 mg daily restarts Tue 0800**; saline lock at 1000 if drinking well; teaching order (sick-day rules, IM kit return demonstration, ID, card). **0640:** discharge prescriptions (two hydrocortisone 100 mg Act-O-Vial kits, tablets, fludrocortisone, medical alert ID).

## Fludrocortisone rule (state it the same everywhere)
Hydrocortisone at more than 50 mg a day has enough mineralocorticoid (aldosterone-like) effect, so fludrocortisone is **held from admission (0640 Mon) while she receives 200 mg/day IV** and **restarts at 0.1 mg daily on Tue 0800**, the morning the dose drops to 50 mg/day oral.

## Devices
EMS PIV 18 g left antecubital (0335, **removed 0640**: positional, leaking); PIV 20 g right forearm (ED 0406; D5NS; **infiltrates about 0240 Tue: portrayed, students remove it**); PIV 18 g left forearm (ED 0640; saline lock for hydrocortisone/D50); telemetry 5-lead transmitter (0655). No Foley.

## Notes (all time-gated by datetime)
ED triage RN 0410 (with EMS report), ECG 0435, CXR 0505, ED provider 0535, ED RN 0630, H&P 0640, handoff 0655, pharmacy med history 0830, hospitalist 0915, hospitalist hypoglycemia event 1130, ECG 1340, endocrinology consult 1400, endocrinology ACTH addendum 1450, hospitalist sodium note 1535, dietitian 1815, night hospitalist 2320, night event note 0310 (near-fall, IV infiltration, K), night hospitalist 0615 (0500 labs, KCl), endocrinology transition 0630, pharmacy teaching plan 0640, case management 0650. Notes by the students' unit RN are NOT pre-written.

## Sticky notes
Adrenal crisis signs; hydrocortisone on time (1000, 1600, 2200, 0400); fludrocortisone held; contact (enteric) precautions; sodium limit (from 1530); norovirus detected (from 1820).

## Chart reminders
- No vital signs after 0700 in the chart. No assessment rows after 0700 (ED 0410 and unit 0700 baselines only). No POC glucose after 0645 (students do them).
- The bedside monitor's built-in scenario for MRN SIM-40422 (monitor.html `ADDISON`) carries the same checkpoint vitals.
- Every number in the instructor guide must match this file and the generators. After any change: `python3 gen/ecg/make_ecgs.py` (ECGs only), `node gen/assemble.js`, then from the repo root `node tools/make-prebuilt.js`.

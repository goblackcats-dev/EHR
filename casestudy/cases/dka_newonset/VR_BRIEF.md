# VR brief: Nora Whitcombe (in-class DKA patient, new-onset type 1, SIM-40602)

For the VR developers and the instructor. Same patient, same numbers as the EHR chart (`DESIGN.md`, sections 5, 7, 8, 12, 17 and 18). The machine-readable version of everything below is `vr_states.json` in this folder (one object per stop). If anything here disagrees with `DESIGN.md`, `DESIGN.md` wins.

**Course:** Monday 2027-02-08 0700 to Tuesday 2027-02-09 0700 (24 hours). Seven stops, every 4 hours. The instructor moves the class from stop to stop. Discharge is planned for Tuesday evening, about 1930, with her mother, after the course ends.

**Fixed rules for the whole scene**
- Insulin is a **fixed rate**: regular insulin 5.5 units/h (0.1 unit/kg/h x 55.0 kg), 5.5 mL/h, D1 0305-2100. It is **never changed** and never held (lowest K 3.6).
- Main fluid on pump 1 channel A: 0.9% NaCl until 0700, **0.45% NaCl 250 mL/h 0700-0805**, then **D5W/0.45% NaCl 150 mL/h 0805-2100**. There is no separate dextrose line.
- Potassium is given only as **riders**: one 10 mEq/100 mL bag over 1 hour at a time, alone on pump 2 on the right, into the right forearm IV. **No potassium in any large bag.** Seven riders in all.
- **No oxygen at any stop.** Room air the whole stay. **No isolation.** No urinary catheter.
- Two planted wrong orders, each with an **unhung pharmacy bag on the counter** (never hung, removed once the order is discontinued): **D1 0700** sodium bicarbonate 100 mEq/400 mL; **D1 1500** potassium chloride 20 mEq/100 mL over 1 hour.
- The order to discontinue: **NPO** at D1 1100 (NPO sign comes down; clear-liquid tray comes in).
- Transition: **glargine 14 units at 1900 on D1** (Nora self-injects), drip and D5/0.45% off at 2100 (2-hour overlap). From 2100 both IVs are saline locks and no pumps run.

---

## 1. The patient at a glance

- **Nora Whitcombe**, 22-year-old woman (she/her), DOB 09/14/2004, MRN SIM-40602. Room SD-6, Medical-Surgical Step-Down with telemetry. Full Code. **Allergy: Amoxicillin (rash as a child)** (red allergy band).
- **Height 165 cm, weight 55.0 kg** (ED bed scale; dosing weight), BMI 20.2. Usual weight 61.0 kg. Weighs 56.2 kg on D2 at 0600.
- **Build:** Slim runner's build; looks thin and drawn on Day 1 (6.0 kg, 9.8%, lost since September, most in the last 6 weeks). Dark circles under her eyes on Day 1.
- **Hair:** Shoulder-length (art choice). Colour is an art choice (not set by DESIGN.md). Loose and messy on Day 1; damp at the temples after her hallway laps at D1 2300; in a ponytail at D2 0700.
- **Skin tone:** Skin tone is an art choice. Show flushing and pallor where they read on any skin tone: lips, nail beds, inner eyelids, palms. Flushed cheeks at D1 0700; pale and sweaty at D2 0300.
- **Clothing:** Hospital gown with the telemetry box in the gown pocket, non-skid socks, ID band and red allergy band (amoxicillin), fall-risk band. Damp gown changed at D2 0300. Her own sweatshirt (colour and logo are an art choice; no real brand) at D2 0700.
- **Why she is here:** New-onset type 1 diabetes presenting in moderate-to-severe diabetic ketoacidosis (DKA); no known diabetes before this admission. About 6 weeks of thirst (4-5 big sports drinks a day), urinating 3-4 times a night, hunger with weight loss, tiredness, blurry vision and two yeast infections; she blamed the gym and stress. Vomiting and crampy belly pain from Sunday noon; fast deep breathing by Sunday evening. Arrived in the ED at 0140 Monday.
- **Medicines:** None (new diagnosis). Home medicines: levonorgestrel IUD (placed 2025); ibuprofen 400 mg PRN headaches (held). New plan from D1 1900: glargine 14 units SubQ daily at 1900; lispro 4 units with each meal plus correction 1 unit per 50 mg/dL over 150.
- **Voice:** Light, clear young-adult voice (art choice). Day 1 morning: short phrases between deep breaths, slow to answer. Later: quick and articulate, with flashes of humour; quiet and flat when sad at D1 2300.
- **Manner:** Independent, smart, a little stubborn; used to handling things herself. Scared and quiet at first, then tearful and in denial after the diagnosis, then calmer and ready to learn on D2. Runs to cope with stress. Third-year environmental science student; works part time at the campus library.
- **Mother: Julia Whitcombe** (49). High school teacher; lives 3 hours away. Kendall called her at 0600 Monday; she arrives about 1300 D1 after arranging leave and packing, and plans to stay with Nora for a week after discharge. At 1100 she phones from the road. Parents divorced; father out of state, in touch by phone. Manner: Warm, organized, anxious underneath; asks good questions and writes things down. Wants to be included in all teaching.
- **Roommate: Kendall Rowan** (21). Nora's apartment roommate; works evening shifts at a campus coffee shop. Found Nora on the bathroom floor at about 0100 Monday after closing, drowsy, breathing deep and fast, breath 'like nail polish remover', and drove her to the ED (arrival 0140). At the bedside at D1 0700; leaves for class at 0730. Manner: Loyal, a bit shaken, talks fast; holding Nora's phone and backpack.

Items marked "art choice" are not set by the chart; pick one look and keep it for all seven stops.

## 2. Room SD-6

- Single room. Bed in the middle, head against the wall, bed low and locked, side rails up x2 at the head.
- Bedside monitor on a wall arm above and to the patient's right of the head of the bed (screen header 'SD-6   WHITCOMBE, NORA   22 F'). 5-lead telemetry, box in the gown pocket. No oxygen in use at any stop (wall oxygen flowmeter present but not connected).
- LEFT IV pole (patient's left side), for the left forearm 18 g IV: pump 1 with two channels (channel A = main fluid: 0.9% NaCl, then 0.45% NaCl, then D5W/0.45% NaCl; channel B = regular insulin, joining at the lowest Y-site port).
- RIGHT IV pole (patient's right side): pump 2 for potassium chloride riders only (one bag at a time, alone on its own pump, into the right forearm 20 g IV).
- Overbed table, chair for a visitor, recliner by the window (Julia sleeps there on the night of D1).
- Counter by the sink: glucometer, test strips, lancets, alcohol swabs, gloves. Sharps box on the wall.
- Emesis basin on the bed, urine hat in the toilet, ice-chip cup on the table, call light clipped to the pillow, bed alarm control on the footboard (light on when armed).
- Whiteboard opposite the bed (nurse name, plan for the day; 'Drip off 2100' at D1 1900; discharge checklist at D2 0700).
- Hand-hygiene sink and foam dispenser inside the door.

**Bags and their label text** (every bag also carries the patient label: `WHITCOMBE, NORA  MRN SIM-40602  DOB 09/14/2004  SD-6  Allergy: amoxicillin`)

| Bag label | Pump | Into | When |
|---|---|---|---|
| `0.9% Sodium Chloride 1,000 mL` | pump 1 channel A (left pole) | left forearm 18 g | 250 mL/h at D1 0700 (from the ED); replaced by 0.45% NaCl at 0700 |
| `0.45% Sodium Chloride 1,000 mL` | pump 1 channel A (left pole) | left forearm 18 g | 250 mL/h D1 0700-0805 |
| `Dextrose 5% and 0.45% Sodium Chloride 1,000 mL` | pump 1 channel A (left pole) | left forearm 18 g | 150 mL/h D1 0805-2100; off 2100 |
| `Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT` | pump 1 channel B (left pole), Y-site at the lowest port | left forearm 18 g | 5.5 mL/h (5.5 units/h) D1 0305-2100, never changed; off 2100 |
| `Potassium chloride 10 mEq/100 mL, infuse over 1 hour` | pump 2 (right pole), alone | right forearm 20 g | 100 mL/h (10 mEq/h), one at a time: D1 0715; 1030, 1130; 1505, 1605, 1705, 1805 (7 riders = 70 mEq) |
| `Magnesium sulfate 2 g/50 mL, infuse over 2 hours` | left pole, small single-channel pump (art choice; DESIGN.md says only 'left line Y-site'). It must run alongside the D5 and the insulin, not pause them. | left forearm 18 g, Y-site | 25 mL/h D1 1505-1705 only |
| `Sodium bicarbonate 100 mEq in 400 mL Sterile Water, infuse over 2 hours (pharmacy compounded)` | NONE: never hung (planted wrong order) | - | On the counter at D1 0700; removed after the order is discontinued (0715) |
| `Potassium chloride 20 mEq/100 mL, infuse over 1 hour` | NONE: never hung (planted wrong order) | - | On the counter at D1 1500; removed after the order is discontinued (1510) |

**Insulin pens:** From D1 1850: two single-patient inpatient pens labelled with her name: insulin glargine (gray label) and insulin lispro (burgundy label); similar shape (art choice for the exact pen look; no real brand names). Pen needles, alcohol swabs, sharps box.

**Precautions and safety**
- Isolation: None at any stop (standard precautions).
- Falls: Morse 45 at D1 0700 and 1100 (bed alarm armed, stand-by assist); 35 from D1 1500; 45 again at D2 0300 (shaky after the low); 35 at D2 0700. Bed alarm armed at D1 0700, off by day once steady, on at night (D1 2300, D2 0300), off for the day at D2 0700.
- NPO: NPO sign over the bed and ice-chip cup from D1 0700 until the RN discontinues NPO at the D1 1100 stop; then a sugar-free clear-liquid tray.

**IV sites over time**
- Left forearm 18 g (placed D1 0150 in the ED, dressing dated 02/08 0150): main fluids, insulin, magnesium. Saline lock from D1 2100. Kept through the course.
- Right forearm 20 g (placed D1 0155 in the ED, dressing dated 02/08 0155): KCl riders only, from 0715. Saline lock between riders and from D1 1905. Kept through the course (removed before discharge D2).

## 3. Monitor numbers at a glance (same as the bedside monitor, DESIGN.md section 18)

| Stop | HR | BP | RR | SpO2 | Temp F | Rhythm | Pain |
|---|---|---|---|---|---|---|---|
| D1-0700 | 106 | 110/66 | 24 | 99% RA | 98.6 | sinus tachycardia, T waves slightly tall | 4 |
| D1-1100 | 96 | 112/68 | 20 | 99% RA | 98.4 | sinus rhythm | 2 |
| D1-1500 | 90 | 114/70 | 18 | 99% RA | 98.6 | sinus rhythm; T waves a little lower than this morning, no U waves | 1 |
| D1-1900 | 94 | 118/74 | 18 | 99% RA | 98.4 | sinus rhythm, T waves near normal | 0 |
| D1-2300 | 92 | 114/72 | 18 | 98% RA | 98.2 | sinus rhythm, normal T waves | 0 |
| D2-0300 | 108 | 126/76 | 18 | 98% RA | 97.9 | sinus tachycardia | 2 |
| D2-0335 (after 2 rounds of 15 g) | 90 | 118/72 | 16 | 98% RA | 97.9 | sinus rhythm | - |
| D2-0700 | 78 | 114/70 | 14 | 99% RA | 98.2 | sinus rhythm | 0 |

No ectopy and no U waves at any stop (no monitor events). T-wave height (tAmp): 0.40 at D1 0700 (slightly tall), 0.30 at 1100, 0.25 at 1500 (a little lower), 0.28 at 1900, 0.30 from 2300. PR 140-142, QRS 84.

---

## 4. The seven stops

### Stop 1. D1 0700: Arrival from the ED, fluids first

*Sim time 2027-02-08 07:00. Precautions: none.* No isolation. NPO except ice chips (sign over the bed). Fall precautions, Morse 45: bed low, alarm armed.

**Big idea:** Recognize the cues of DKA (Kussmaul breathing, fruity breath, dehydration) and act on the newest results: pH 7.24 means no bicarbonate; K 4.7 means a rider is due.

**What just happened:** ED 0140-0700: 0.9% NaCl 1 L bolus, then 500 mL/h, now 250 mL/h; insulin 5.5 units/h since 0305 (started once K 5.8 was known; no bolus). 0530 labs: K 4.7, pH 7.24, CO2 10, gap 23, BHB 5.4. Due now: 0.45% NaCl 250 mL/h, KCl rider at 0715, and a planted sodium bicarbonate order (bag on the counter).

**How she looks**
- Skin: Cheeks flushed; skin warm and dry; hands cool; eyes slightly sunken, dark circles. Sweat: none (dry).
- Mouth: Lips dry and cracked; tongue dry and furrowed.
- Breathing: Kussmaul: deep, fast, regular, 24/min; she cannot slow it down.
- Mental status: Drowsy, eyes half closed, wakes to voice, oriented x4, slow to answer but makes sense.
- Posture: Head of bed up 30 degrees, curled on her side, knees up, arm over her belly.
- Smell: Faint fruity (acetone, 'nail polish remover') smell near her face.
- Wearing: Hospital gown, non-skid socks; large empty sports-drink bottle in her bag on the chair.

**What she says**
- "I'm so thirsty... can I please just have water?"
- "I've been peeing all the time for weeks. I thought it was all the water I was drinking."
- "My stomach hurts and I feel sick."
- "Is this diabetes? Like, the needle kind?"

**Short answers**
- Pain: "My stomach. Crampy. Maybe a 4."
- Nausea: "I feel sick. I threw up a lot yesterday, starting around noon. Not since the ER."
- Thirst: "So thirsty. My mouth is like sand."
- Last ate: "Hardly anything since Saturday. Just sports drinks and water."
- Allergies: "Amoxicillin. I got a rash when I was a kid."
- Breathing: "I can't slow my breathing down. It's like I just ran."
- Symptoms: "For like six weeks I've been thirsty all the time and peeing constantly. I get up three or four times a night. And I'm starving but losing weight."
- Weight loss: "I lost like 13 pounds. I thought it was the gym."
- Vision: "Slides have been blurry. I thought I needed glasses."
- Medicines: "Just my IUD. Ibuprofen sometimes for headaches; I took one yesterday at two and threw it up."
- Family history: "My aunt has diabetes, but she just takes pills. Nobody in my family has the needle kind."
- Alcohol: "A few drinks on weekend nights, usually. Nothing for two weeks; I've felt too gross."
- Pregnancy: "I have an IUD. (Serum hCG was negative in the ED.)"
- Julia: driving in (3 hours away; arrives about 1300).
- **Kendall** (chair at the bedside with Nora's phone and backpack; leaves for class at 0730): "I came home from closing around one and she was on the bathroom floor. She was breathing so fast, and her breath smelled like nail polish remover." / "She's been drinking those big sports drinks all day for weeks." / "I called her mom at six. She's on her way."

**Equipment**
- Monitor: HR 106 sinus tachycardia, T waves slightly tall; BP 110/66; RR 24; SpO2 99% on room air; T 98.6 F; pain 4.
- Glucometer: 274 (0700, charted).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 250 mL/h; a new '0.45% Sodium Chloride 1,000 mL' bag hangs ready (due 0700) | left forearm PIV 18 g (dressing dated 02/08 0150) | running -> nurse changes to 0.45% NaCl 250 mL/h.
- Pump 1 channel B: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 5.5 mL/h = 5.5 units/h | left forearm PIV 18 g (dressing dated 02/08 0150), Y-site at the lowest port | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour (ready to hang; due 0715) | 100 mL/h when started | right forearm PIV 20 g (dressing dated 02/08 0155) | idle -> rider started 0715.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): No redness or swelling; NaCl and insulin infusing.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Saline lock, flushes easily.
- Telemetry: 5-lead on, box in gown pocket.
- Oxygen: none (room air).
- Other: Pharmacy bag 'Sodium bicarbonate 100 mEq in 400 mL Sterile Water, infuse over 2 hours' on the counter, unhung (planted wrong order). Emesis basin (empty); urine hat in the toilet; glucometer and strips on the counter; ice-chip cup; NPO sign over the bed; bed alarm armed (light on); call light by her pillow.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| left forearm IV | Clear dressing dated 02/08 0150; no redness or swelling; NaCl and insulin infusing |
| right forearm IV | Saline lock dated 02/08 0155; flushes easily; no redness |
| skin turgor | Poor: skin tents for 3 seconds |
| capillary refill | 3 seconds; hands cool |
| radial pulses | 2+ and equal, fast |
| mouth | Lips dry and cracked; tongue dry and furrowed |
| breath odour | Fruity (acetone) smell |
| breathing | Deep, fast, regular (Kussmaul), 24/min; no distress |
| lungs | Clear; no cough |
| abdomen | Soft, diffusely tender, no guarding; bowel sounds hypoactive |
| pupils | Equal and reactive |
| gait | Weak and unsteady standing; needs stand-by assist |
| urine hat | Pale yellow urine, large amounts (400 mL at 0610) |
| insulin pump screen | Regular insulin 1 unit/mL, 5.5 mL/h; label HIGH ALERT; needs an independent double check (0.1 x 55.0 = 5.5) |
| bicarbonate bag on the counter | Sodium bicarbonate 100 mEq in 400 mL sterile water over 2 h, due 0700 (pH 7.24 at 0530; bicarbonate only under 7.0: hold and call) |
| glucometer | 274 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse does an independent double check of the insulin infusion (5.5 units/h = 0.1 x 55.0; 5.5 mL/h)
- Nurse changes channel A to 0.45% NaCl 250 mL/h (corrected Na 137.0)
- Nurse holds the sodium bicarbonate and calls Dr. Petrakis (pH 7.24): 'Agreed. Her pH is 7.24; we only give bicarbonate under 7.0. Discontinue it. Continue the protocol.' Bag removed from the counter (0715)
- Nurse confirms urine (400 mL at 0610) and hangs the KCl 10 mEq rider at 0715 on pump 2 into the right forearm IV
- Hourly glucose checks; neuro check; mouth care; ice chips only
- Kendall leaves for class at 0730

**Instructor says aloud:** Glucose 0700 274 (charted). Next glucose 0800. Urine 400 mL at 0610. Last emesis 0215.

**Safety catch:** Planted wrong order 1: sodium bicarbonate at pH 7.24 (only under 7.0). Also read the newest K (4.7), not the arrival K (5.8), and give the protocol rider.

**Move to the next stop:** Instructor advances to D1 1100 after 0.45% NaCl is running, the bicarbonate is held and called, and the 0715 rider is hung. Between stops (narrated): glucose 0800 222, so D5W/0.45% NaCl 150 mL/h started 0805; 0930 labs K 4.1 (riders 1030 and 1130); A1c 11.6% at 1000; no nausea since about 0900.

### Stop 2. D1 1100: The dextrose step, and she can drink

*Sim time 2027-02-08 11:00. Precautions: none.* NPO sign over the bed at the start of the stop. When the nurse discontinues NPO (criteria met), take the sign down; at 1100-1105 a sugar-free clear-liquid tray arrives.

**Big idea:** Glucose fell under 250, so dextrose is added and the insulin keeps running: the goal is to clear ketones (gap 19, BHB 3.3), not to lower glucose.

**What just happened:** 0800 glucose 222 -> D5W/0.45% NaCl 150 mL/h from 0805; insulin unchanged at 5.5. 0930 labs: K 4.1 (riders 1030 running, 1130 next), gap 19, BHB 3.3, pH 7.29. A1c 11.6% (1000). No vomiting since 0215; nausea gone since about 0900. Julia phoned from the road.

**How she looks**
- Skin: More colour; cheeks less flushed; skin warm. Sweat: none.
- Mouth: Lips dry (she keeps licking them); tongue moist.
- Breathing: Slower, still a little deep, regular, 20/min.
- Mental status: Awake, alert, oriented x4, answers quickly; headache gone.
- Posture: Sitting up in bed, eyes open, phone in hand, texting her mom.
- Smell: Fruity smell faint.
- Wearing: Hospital gown.

**What she says**
- "Please, can I drink something? Anything."
- "Why are you giving me sugar? I thought sugar was the problem."
- "My mom says my sugar is almost normal, so can the insulin come off?"
- "My arm aches a little where that bag goes in."

**Short answers**
- Pain: "Just a little belly ache now. A 2. And my right arm where that bag goes in."
- Nausea: "Gone since about nine."
- Thirst: "I'm dying for a drink. Ice chips aren't doing it."
- Last ate: "Nothing. Ice chips."
- Vomiting: "Not since the ER, really early this morning."
- Diagnosis: "So is it diabetes for sure?"
- School: "I have a lab class Wednesday. Will I be out by then?"
- Sugary drinks: "I was drinking like four or five big sports drinks a day, plus water."
- **Julia** (on speakerphone from the car (on the way; arrives about 1300)): "Her sugar is almost normal, so can they take her off the insulin?" / "I've packed for a week. Tell her I'm coming."
- Kendall: at class.

**Equipment**
- Monitor: HR 96 sinus rhythm; BP 112/68; RR 20; SpO2 99% on room air; T 98.4 F; pain 2.
- Glucometer: 186 (1100).
- Pump 1 channel A: Dextrose 5% and 0.45% Sodium Chloride 1,000 mL | 150 mL/h (since 0805) | left forearm PIV 18 g (dressing dated 02/08 0150) | running.
- Pump 1 channel B: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 5.5 mL/h = 5.5 units/h | left forearm PIV 18 g (dressing dated 02/08 0150), Y-site at the lowest port | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | 100 mL/h (10 mEq/h); 1030 rider running; next at 1130 | right forearm PIV 20 g (dressing dated 02/08 0155) | running.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): No redness or swelling; D5/0.45% and insulin infusing.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): KCl rider infusing; mild ache; no redness or swelling.
- Telemetry: on.
- Oxygen: none (room air).
- Other: NPO sign over the bed (until discontinued); ice-chip cup empty; at 1100-1105 a tray with sugar-free gelatin, broth and diet ginger ale (after NPO is stopped); glucometer on the counter; bed alarm armed.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| right forearm IV | Rider infusing; she says it aches a little; no redness, no swelling, skin normal temperature |
| left forearm IV | No redness or swelling; D5/0.45% and insulin infusing |
| skin turgor | Tents for 2 seconds |
| mouth | Lips dry; tongue moist |
| breath odour | Fruity smell, fainter than at 0700 |
| breathing | Slower, still a little deep, 20/min |
| abdomen | Soft, mildly tender; bowel sounds active |
| emesis basin | Clean and dry (no vomiting since 0215) |
| NPO order (chart) | 'RN may discontinue when no vomiting for at least 4 h, nausea controlled, bowel sounds present and the patient asks to drink' (all met) |
| pump 1 channel A screen | Dextrose 5% / 0.45% NaCl, 150 mL/h |
| insulin pump screen | 5.5 mL/h, unchanged |
| glucometer | 186 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse confirms D5W/0.45% NaCl 150 mL/h and insulin 5.5 units/h (dextrose table 150-249) and explains why the insulin stays on (gap 19)
- Nurse discontinues NPO per the diet-advancement protocol and reports it; Dr. Petrakis enters sugar-free clear liquids at 1105: NPO sign down, clear-liquid tray in
- Second rider at 1130 after the first finishes (one at a time)
- Hourly check of the right forearm rider site; neuro check

**Instructor says aloud:** Glucose 0800 222, 0900 204, 1000 192, 1100 186. Urine 0800 350, 0945 300, 1050 250. Ice chips 60 mL.

**Safety catch:** The 'almost normal glucose' trap: do not stop or lower the insulin; add dextrose. Order to discontinue: NPO (criteria met).

**Move to the next stop:** Instructor advances to D1 1500 once NPO is addressed. Between stops (narrated): riders 1030 and 1130 given; drinking clear liquids (540 mL); TSH 1.8 at 1130; endocrinology consult 1230; Julia arrives 1300; 1330 labs K 3.6, Mg 1.7, phos 1.8, pH 7.32, BHB 1.3; Dr. Petrakis orders KCl 20 mEq/100 mL over 1 h x 2 and MgSO4 2 g at 1420.

### Stop 3. D1 1500: Potassium falls on insulin

*Sim time 2027-02-08 15:00. Precautions: none.* Fall risk now Morse 35 (gait normal); stand-by assist only for the IV poles.

**Big idea:** Insulin drives potassium into the cells: K 5.8 -> 4.7 -> 4.1 -> 3.6. At 3.6 the insulin continues and potassium goes in no faster than 10 mEq/h through a peripheral IV.

**What just happened:** 1330 labs (K resulted 1415): K 3.6, Mg 1.7, phos 1.8, CO2 14, gap 17, pH 7.32 but BHB 1.3 (not resolved). At 1420 Dr. Petrakis ordered KCl 20 mEq in 100 mL IV over 1 h x 2 from 1500 (planted wrong order) and MgSO4 2 g. Riders 1030 and 1130 given. Julia arrived 1300. Clear liquids 540 mL.

**How she looks**
- Skin: Normal colour, warm and dry. Sweat: none.
- Mouth: Moist lips and tongue.
- Breathing: Nearly normal depth, regular, 18/min.
- Mental status: Alert, oriented x4; 'my legs feel heavy'.
- Posture: Sitting up, rubbing her calves.
- Smell: Faint fruity smell.
- Wearing: Hospital gown.
- Also: Relieved and teary since her mother arrived; Julia holds her hand.

**What she says**
- "My legs feel heavy, and my calves keep cramping."
- "Why do I need more potassium? You just gave me some."
- "Is my heart okay? What are those lines on the screen?"

**Short answers**
- Pain: "My calves cramp on and off. A 1."
- Nausea: "None. The broth stayed down fine."
- Thirst: "Better. I've been drinking the clear stuff."
- Last ate: "Broth, gelatin and diet ginger ale."
- Legs: "Heavy. Not weak, just heavy. And crampy."
- Palpitations: "No. I don't feel my heart racing."
- Urine: "I just went at like ten to three. Still a lot."
- **Julia** (chair pulled up to the bed, winter coat still on, travel bag at her feet, holding Nora's hand): "Can't you give it all at once so she's done faster?" / "What does potassium do? Why is it going down if you're giving it?"
- Kendall: at work.

**Equipment**
- Monitor: HR 90 sinus rhythm; T waves a little lower than this morning, no U waves; BP 114/70; RR 18; SpO2 99% on room air; T 98.6 F; pain 1.
- Glucometer: 166 (1500).
- Pump 1 channel A: Dextrose 5% and 0.45% Sodium Chloride 1,000 mL | 150 mL/h | left forearm PIV 18 g (dressing dated 02/08 0150) | running.
- Pump 1 channel B: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 5.5 mL/h = 5.5 units/h (keep running: K 3.6 is 3.5 or more) | left forearm PIV 18 g (dressing dated 02/08 0150), Y-site at the lowest port | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour (protocol rider ready; three more labelled riders on the counter for 1605, 1705, 1805) | 100 mL/h (10 mEq/h) from 1505 | right forearm PIV 20 g (dressing dated 02/08 0155) | idle at 1500 -> first of 4 riders started 1505.
- Small pump, left pole (art choice): Magnesium sulfate 2 g/50 mL, infuse over 2 hours | 25 mL/h from 1505 to 1705 | left forearm PIV 18 g (dressing dated 02/08 0150), Y-site | ready -> started 1505.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): Patent; no redness or swelling.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Patent; no redness or swelling; ready for riders.
- Telemetry: on; T waves a little lower, no U waves, no ectopy.
- Oxygen: none (room air).
- Other: Pharmacy bag 'Potassium chloride 20 mEq/100 mL, infuse over 1 hour' on the counter, unhung (planted wrong order). Clear-liquid cups on the table. Julia's travel bag by the chair.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| KCl 20 mEq bag on the counter | Potassium chloride 20 mEq/100 mL, infuse over 1 hour = 20 mEq/h: twice the peripheral limit (10 mEq/h); hold and call |
| right forearm IV | Saline lock, patent, no redness or swelling; the only line for potassium |
| left forearm IV | No redness or swelling; D5/0.45% and insulin infusing |
| monitor rhythm strip | Sinus rhythm 90; T waves a little lower than this morning; no U waves; no PVCs |
| calves | Soft, not swollen, not tender to squeeze; she rubs them for cramps |
| grip strength | Equal and strong |
| gait | Steady; needs help only with the IV poles |
| mouth | Moist |
| skin turgor | Normal |
| breath odour | Faint fruity smell |
| urine hat | 250 mL at 1450 (about 190 mL/h since 1330; well over 28 mL/h) |
| glucometer | 166 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse holds the KCl 20 mEq/h order and calls Dr. Petrakis: 'You're right, she only has peripheral lines. Discontinue my order. Run the protocol riders, ten an hour, four in a row, and keep the insulin going.' (1510; the 20 mEq bag is removed)
- Four KCl 10 mEq riders back to back from 1505 (1505, 1605, 1705, 1805), one at a time on pump 2, right forearm IV
- MgSO4 2 g over 2 h started 1505 on the left line Y-site
- Insulin stays at 5.5 units/h; D5/0.45% stays at 150 mL/h
- Hourly rider site checks; plan the 1730 draw from the right hand below the rider IV with the rider paused 2 minutes (never the left arm)

**Instructor says aloud:** Glucose 1200 180, 1300 174, 1400 170, 1500 166. Urine 1150 300, 1330 300, 1450 250. Oral 540 mL clear liquids.

**Safety catch:** Planted wrong order 2: KCl 20 mEq/h through a peripheral IV (limit 10 mEq/h, one rider at a time). Insulin continues at K 3.6.

**Move to the next stop:** Instructor advances to D1 1900 once the 20 mEq order is held and called and the first rider is running. Between stops (narrated): dietitian, case manager, social worker and diabetes educator visits (Nora checks her own glucose 162 at 1600); diagnosis talk with Dr. Navarro at 1700 (type 1, lifelong insulin); 1730 labs BHB 0.5, pH 7.34, CO2 18 = resolved; transition orders 1840; pens arrive 1850.

### Stop 4. D1 1900: DKA resolved; the transition with overlap

*Sim time 2027-02-08 19:00. Precautions: none.*

**Big idea:** Resolved by the 2024 criteria (BHB 0.5, pH 7.34, CO2 18). Glargine goes in at 1900 and the drip stays on until 2100 (at least 2 h overlap).

**What just happened:** 1730 labs (BHB resulted 1825): BHB 0.5, pH 7.34, CO2 18, gap 14 = DKA resolved. Navarro transition order 1840: glargine 14 units at 1900; insulin infusion and D5/0.45% off at 2100; lispro 4 units with the late dinner tray 1915; KCl ER 20 mEq PO at 2000. 4th rider (1805) finishing. Diagnosis told at 1700; Nora has been crying on and off since.

**How she looks**
- Skin: Normal colour, warm and dry; blotchy around the eyes from crying. Sweat: none.
- Mouth: Moist.
- Breathing: Normal rate and depth, 18/min (catches when she cries).
- Mental status: Alert, oriented x4; tearful, overwhelmed.
- Posture: Sitting up in bed, tissues in her lap, holding the glargine pen and staring at it.
- Smell: No fruity smell.
- Wearing: Hospital gown.
- Also: Puffy red eyes. Julia sits on the bed beside her with an arm around her.

**What she says**
- "So this is forever? Every single day?"
- "Did I do this to myself with all those sports drinks?"
- "My aunt just takes pills. Why can't I?"
- "Okay... show me again. I don't want to do it wrong."
- "Why can't you just take the IV out now?"

**Short answers**
- Pain: "Nothing hurts. A 0."
- Nausea: "No. I'm just not that hungry after... all that."
- Thirst: "Normal, I guess."
- Last ate: "Clear liquids all afternoon."
- Diet: "Can't I just fix it with diet like my aunt?"
- Needles: "I hate needles. But I'll try if you show me."
- Guilt: "Did I cause this? Was it the drinks? The drinking on weekends?"
- Her own glucose check: "I did my own finger stick at four. It was 162."
- **Julia** (sitting on the bed beside Nora, arm around her): "We'll learn it together, honey." / "Is the drip coming out now that she has the shot?" / "Can I watch how you do it?"
- Kendall: at work (evening shift).

**Equipment**
- Monitor: HR 94 sinus rhythm, T waves near normal; BP 118/74; RR 18; SpO2 99% on room air; T 98.4 F; pain 0.
- Glucometer: 168 (1900, before dinner).
- Pump 1 channel A: Dextrose 5% and 0.45% Sodium Chloride 1,000 mL | 150 mL/h (keep until 2100) | left forearm PIV 18 g (dressing dated 02/08 0150) | running.
- Pump 1 channel B: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 5.5 mL/h = 5.5 units/h (keep until 2100: 2 h after glargine) | left forearm PIV 18 g (dressing dated 02/08 0150), Y-site at the lowest port | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour (4th rider, started 1805) | 100 mL/h; volume infused 92 of 100 mL | right forearm PIV 20 g (dressing dated 02/08 0155) | finishing (done 1905), then saline lock.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): Infusing; no redness or swelling.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Rider finishing; site normal.
- Telemetry: on; regular rhythm, T waves near normal.
- Oxygen: none (room air).
- Pens: Two pens labelled WHITCOMBE, NORA: insulin glargine (gray label) and insulin lispro (burgundy label); pen needles, alcohol swabs, sharps box.
- Other: Dinner tray arriving at 1915 (chicken, rice, green beans, milk; carbohydrate counts on the menu). Whiteboard sticky: 'Drip off 2100.' Tissues on the bed. Bed alarm off (art choice: steady by day; DESIGN.md sets it on again at night).

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| glargine pen | Insulin glargine, gray label, patient name; dial 14 units after a 2-unit prime; needs an independent double check |
| lispro pen | Insulin lispro, burgundy label, patient name; 4 units when the tray is in front of her (1915); correction 0 at 168 |
| insulin pump screen | Regular insulin 5.5 mL/h, running; stop at 2100, not now |
| pump 2 screen | KCl 10 mEq/100 mL, 92 of 100 mL infused |
| left forearm IV | Infusing, no redness or swelling |
| right forearm IV | Rider finishing; no redness or swelling |
| abdomen (injection site) | Soft, nontender; site 2 inches from the navel |
| breath odour | None |
| breathing | Normal rate and depth |
| whiteboard | 'Drip off 2100' |
| glucometer | 168 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse shows the resolution math (BHB 0.5 under 0.6; pH 7.34; CO2 18)
- Independent double check of the glargine pen; Nora self-injects glargine 14 units SubQ at 1900 with coaching (new needle, prime 2 units, 90 degrees, hold 10 seconds)
- Drip and D5/0.45% stay running until 2100
- Lispro 4 units at 1915 when the tray is in front of her (glucose 168: correction 0)
- KCl ER 20 mEq PO at 2000 (whole, upright, with water)
- Emotional support; correct the guilt; include Julia; handoff to nights: drip off 2100, POC 2200 and 0300

**Instructor says aloud:** Glucose 1600 162 (her own check), 1700 168, 1800 170, 1900 168. Urine 1600 250, 1730 250, 1850 200. Oral 480 mL. 4th rider 92 of 100 mL in.

**Safety catch:** The overlap: glargine first, and the drip stays on 2 more hours (stop at 2100, not 1900). Two look-alike pens: right insulin, right dose, independent double check.

**Move to the next stop:** Instructor advances to D1 2300 after the glargine is given and the drip is still running. Between stops (narrated): ate about 70% of dinner; KCl ER 20 mEq at 2000; drip and D5/0.45% off at 2100, both IVs saline-locked; bedtime glucose 2200 148; 2200 labs BHB 0.3 (no rebound); fast hallway laps 2215-2255; snack declined at 2255.

### Stop 5. D1 2300: A new diagnosis is a loss

*Sim time 2027-02-08 23:00. Precautions: none.* Bed alarm armed at night (Morse 35).

**Big idea:** Grief, fear and denial after a new chronic diagnosis: assess coping and readiness to learn before teaching; teach only safety tonight; include her mother. Plus one physical cue: 40 minutes of fast walking after her first basal dose, with no snack.

**What just happened:** Drip and D5/0.45% off at 2100; both IVs saline-locked; up ad lib. Ate about 70% of dinner with lispro 4 units at 1915. Bedtime glucose 2200 148. 2200 labs: BHB 0.3 (no rebound), K 4.0. Could not sleep; searched 'type 1 diabetes life expectancy' and cried. Walked fast hallway laps 2215-2255 'like a run'. Snack offered at 2255, declined. Julia in the recliner.

**How she looks**
- Skin: A little flushed from walking; warm. Sweat: Hair damp at the temples (from the laps, not from a low).
- Mouth: Moist.
- Breathing: Normal, 18/min.
- Mental status: Alert, oriented; sad, flat, catastrophic thinking; avoids eye contact at first.
- Posture: Lying on her side in the dim room, phone lit up in her hand.
- Smell: None.
- Wearing: Hospital gown; sneakers by the bed.
- Also: Red eyes; tissues on the bed.

**What she says**
- "I looked it up... it says people with type 1 die younger."
- "Will I even be able to have kids?"
- "I don't want to be the girl with diabetes."
- "Walking helps. Running is the only thing that clears my head."
- "Can we do the lessons tomorrow? I can't think right now."

**Short answers**
- Pain: "No pain. 0."
- Nausea: "No."
- Snack: "I'm not hungry, I just want to sleep."
- Snack, after an explanation: (only if the nurse explains that exercise and the new insulin can drop her sugar overnight) Fine... a couple of crackers.
- Sleep: "I can't turn my brain off."
- Feeling normal: "I'll never be normal again."
- School: "I don't want people at school to know."
- Walking: "I did laps for like forty minutes. Fast. It's what I do when I'm stressed."
- Low symptoms: "I don't know what a low even feels like."
- **Julia** (dozing in the recliner under a blanket; wakes if spoken to): "She's always handled stress by running." / "I'm scared to sleep. What if she goes low?"
- Kendall: home (texting Nora).

**Equipment**
- Monitor: HR 92 sinus rhythm, normal T waves; BP 114/72; RR 18; SpO2 98% on room air; T 98.2 F; pain 0.
- Glucometer: 148 (2200, bedtime); next check 0300.
- Pump 1 (left pole): none (off since 2100; parked) | - | left forearm PIV 18 g (dressing dated 02/08 0150) | off.
- Pump 2 (right pole): none (parked) | - | right forearm PIV 20 g (dressing dated 02/08 0155) | off.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): Saline lock, flushed, no redness.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Saline lock, flushed, no redness.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Lights dim. Dinner tray about 70% eaten on the table. Pens in a labelled bin on the counter. Graham crackers and peanut butter on the bedside table (offered). Glucometer on the counter. Bed alarm armed (light on). Call light clipped to her pillow.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| phone screen | Search results: 'type 1 diabetes life expectancy' |
| left forearm IV | Saline lock, no redness or swelling |
| right forearm IV | Saline lock, no redness or swelling |
| skin | Warm, slightly flushed; hair damp at the temples |
| gait | Steady, independent |
| abdomen | Soft, nontender; glargine site clean |
| dinner tray | About 70% eaten |
| snack on bedside table | Graham crackers and peanut butter, untouched |
| breath odour | None |
| monitor rhythm strip | Sinus rhythm 92, normal T waves |
| glucometer memory | 148 at 2200 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse sits down, uses open-ended questions, acknowledges the loss, corrects the online misinformation with accurate hope
- Nurse does not start the full teaching; plans survival skills for the morning with Julia
- Nurse teaches the signs of a low and to press the call light
- Nurse offers the snack again (15 g carbohydrate + protein) and explains why; in the chart's course she still declines
- Nurse confirms the 0300 check; checks both saline locks; bed alarm on; non-drug sleep measures (dim lights, clustered care)

**Instructor says aloud:** Glucose 2000 178, 2100 166 (drip off), 2200 148. Urine 2030 300, 2240 250. Oral 360 mL. She ate about 70% of dinner; walked fast laps 2215-2255; declined a snack at 2255.

**Safety catch:** Night-low risk: first night of basal insulin, 40 minutes of fast exercise after it, snack declined. Offer the snack, make sure of the 0300 check, teach the call light.

**Move to the next stop:** Instructor advances to D2 0300 after the coping conversation and the snack offer. Between stops (narrated): void 300 mL at 0130; water at 0100; 0200 labs resulted 0245 with glucose 84 and BHB 0.3.

### Stop 6. D2 0300: The first low, and 15-15 twice

*Sim time 2027-02-09 03:00. Precautions: none.* Fall risk up to Morse 45 (weak, unsteady after the low); bed alarm armed.

**Big idea:** Hypoglycemia on SubQ insulin in a patient who can swallow: 15 g fast carbohydrate by mouth, recheck in 15 minutes, repeat until 70 or more, then a snack. Her first signs are groggy and confused, not shaky.

**What just happened:** Scheduled 0300 check. The 0200 lab glucose was 84 (resulted 0245); nobody acted before the scheduled check. BHB 0.3 (no rebound). Julia asleep in the recliner.

**How she looks**
- Skin: Cool, pale, sweaty (diaphoretic); forehead beaded with sweat. Sweat: Heavy (from the low).
- Mouth: Moist.
- Breathing: A bit fast, not deep, 18/min.
- Mental status: Hard to rouse for a moment, then groggy, irritable, briefly unsure where she is; oriented x4 within a minute; follows commands; slow speech; can swallow.
- Posture: In bed in the dark, squinting at the light; after the tablets she tries to swing her legs out to go to the bathroom.
- Smell: No fruity smell.
- Wearing: Hospital gown, damp with sweat.
- After treatment: By 0335: alert and oriented, skin dry, calmer, sitting up eating crackers; gown changed.

**What she says**
- "What... leave me alone, I'm sleeping... where am I?"
- "Oh. The hospital. I feel really weird... foggy."
- (after the tablets) "I need to pee. I can walk, I'm fine."
- (after the juice) "Okay... that's better. That was scary. I didn't even feel it coming."
- "Was it because I walked so much?"
- "What do I do if this happens at my apartment?"

**Short answers**
- Pain: "My head hurts. A 2."
- Nausea: "No. I'm kind of hungry, actually."
- Thirst: "Not really."
- Symptoms: "Foggy. Sweaty. My head hurts. I didn't feel shaky first, I just felt weird."
- Orientation: (first) Where am I...? (within a minute) The hospital. It's Tuesday. Night.
- Swallowing: "Yes, I can chew them."
- Why she is getting up: "I have to pee. I don't need help."
- Last ate: "Dinner. Most of it. I didn't want the snack."
- **Julia** (wakes up frightened and stands beside the bed): "Is she okay? What's happening? Should I get someone?" / "I'm going to be checking her every night."
- Kendall: home.

**Equipment**
- Monitor: HR 108 sinus tachycardia; BP 126/76; RR 18; SpO2 98% on room air; T 97.9 F; pain 2.
- Monitor at 0335, after treatment: HR 90 sinus rhythm; BP 118/72; RR 16; SpO2 98%; T 97.9 F.
- Glucometer: 58 (0300); 66 at 0317 after 4 glucose tablets (16 g, 0302); 94 at 0333 after 4 oz apple juice (15 g, 0318).
- Pump 1 (left pole): none (parked) | - | left forearm PIV 18 g (dressing dated 02/08 0150) | off.
- Pump 2 (right pole): none (parked) | - | right forearm PIV 20 g (dressing dated 02/08 0155) | off.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): Saline lock, no redness.
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Saline lock, no redness.
- Telemetry: on; sinus tachycardia 108, then sinus 90 at 0335.
- Oxygen: none (room air).
- Other: Room dark. Glucometer reading 58, then 66, then 94. Bottle of glucose tablets (4 used), a 4 oz apple juice carton, crackers and peanut butter, a milk carton (120 mL) on the bedside table. A dry gown on the chair. Sneakers by the bed. Bedpan or commode at hand. Bed alarm armed.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| skin | Cool, pale, sweaty; gown damp |
| level of consciousness | Hard to rouse for a moment, then groggy and irritable; oriented x4 within a minute; follows commands |
| swallow | Swallows sips safely; can chew tablets |
| radial pulse | Fast, regular, strong |
| capillary refill | Under 3 seconds; hands cool and clammy |
| hands | Slight tremor after the first round; grip equal |
| breath odour | None |
| breathing | A bit fast, not deep |
| left forearm IV | Saline lock, no redness |
| right forearm IV | Saline lock, no redness |
| chart: 0200 lab glucose | 84, resulted 0245 (the earlier cue) |
| glucometer | 58; 0317: 66; 0333: 94 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse keeps her in bed: she wants to walk to the bathroom while shaky after the tablets; nurse assists or brings the bedpan or commode; bed alarm on
- 0302: 4 glucose tablets (16 g), chewed
- 0317 recheck 66 (still under 70): 4 oz (120 mL) apple juice at 0318
- 0333 recheck 94: snack with carbohydrate + protein at 0335 (crackers and peanut butter, milk 120 mL)
- No correction insulin. Call Dr. Rasmussen (called 0305, reply 0320): 'Repeat the 15 grams, snack once she is 70 or more, recheck at 0400, no correction insulin. Endocrinology will adjust the doses in the morning.'
- Monitor changes to the 0335 row (HR 90, BP 118/72, RR 16) after treatment
- Nurse names her symptoms and teaches 15-15 in the moment; comforts Julia; changes the damp gown

**Instructor says aloud:** Glucose 0300 58; 0317 66 (after 4 glucose tablets at 0302); 0333 94 (after 4 oz juice at 0318). Urine 0130 300. Oral 120 mL (water 0100).

**Safety catch:** Hypoglycemia that needs a second 15 g round (treat to 70 or more before the snack), plus the fall risk of a shaky patient getting up alone at night.

**Move to the next stop:** Instructor advances to D2 0700 after both rounds, the snack and the call. Between stops (narrated): glucose 0400 118; slept 0345-0630; voids 0420 300, 0640 300; tTG negative 0500; 0530 labs; C-peptide 0.3 at 0600; weight 56.2 kg at 0600; at 0650 she practiced her lispro pen without priming.

### Stop 7. D2 0700: Survival skills and discharge readiness

*Sim time 2027-02-09 07:00. Precautions: none.* Morse 35; bed alarm off for the day.

**Big idea:** She is safe to go home when she and her mother can show (teach-back and return demonstration) the survival skills: pen, meter, lows and glucagon, sick-day rules with ketones, medical ID; plus supplies and follow-up.

**What just happened:** Glucose 0400 118; fasting 0700 122. 0530 labs: BHB 0.2, CO2 24, K 4.2. C-peptide 0.3 (low; 0600); celiac screen negative (0500); islet antibodies pending. Weight 56.2 kg (0600). Slept 0345-0630. At 0650 she dialed 4 units of lispro without the 2-unit priming shot and planned to 'pull it right out'. Breakfast at 0730. Plan: home Tuesday evening about 1930 if criteria are met.

**How she looks**
- Skin: Good colour, warm and dry. Sweat: none.
- Mouth: Moist.
- Breathing: Normal, 14/min.
- Mental status: Alert, oriented, rested; calmer and ready to learn.
- Posture: Sitting in the chair, holding the lispro pen and a needle; smiling a little.
- Smell: None.
- Wearing: Her own sweatshirt (art choice) over the gown bottoms or own pants (art choice); hair in a ponytail.
- Also: Julia leaning in to watch, notebook in hand (art choice).

**What she says**
- "Okay, four units, then I just pull it out, right?"
- "If I'm sick, I'll just skip it so I don't go low, right?"
- "Do I really have to wear a bracelet? Can it be on my phone?"
- "When can I go home? I want to sleep in my own bed."
- "Mom, you have to learn the emergency shot thing."

**Short answers**
- Pain: "Nothing. 0."
- Nausea: "No. I'm starving."
- Last ate: "Crackers and peanut butter at like 3:30."
- Pen: "New needle, dial four, poke, push. Right?"
- Sick days: "If I can't eat, I'd skip the insulin. That makes sense, right?"
- Medical ID: "I don't want to advertise it."
- Running: "When can I run again? That's my thing."
- Driving: "I drive myself everywhere. Can I still drive?"
- Alcohol: "Can I still go out with my friends on weekends?"
- Treating a low: "Fifteen grams, wait fifteen minutes... and do it again if I'm still under 70. Then a snack."
- **Julia** (beside the chair, leaning in to watch the pen): "Teach me everything too. I'm staying with her for a week." / "Do I set an alarm to check her at night?" / "Show me the emergency shot."
- Kendall: home (Nora wants to teach her the signs of a low and glucagon later).

**Equipment**
- Monitor: HR 78 sinus rhythm; BP 114/70; RR 14; SpO2 99% on room air; T 98.2 F; pain 0.
- Glucometer: 122 (0700, fasting); 118 at 0400.
- Pumps: none (parked) | - | - | off.
- IV site, left forearm PIV 18 g (dressing dated 02/08 0150): Saline lock, patent, no redness (to be removed before discharge).
- IV site, right forearm PIV 20 g (dressing dated 02/08 0155): Saline lock, patent, no redness (to be removed before discharge).
- Telemetry: on.
- Oxygen: none (room air).
- Pens: Lispro (burgundy) and glargine (gray) pens, pen needles, sharps box.
- Other: Breakfast tray at 0730 with a carbohydrate list (oatmeal, banana, milk). Teaching kit: meter, ketone strips, a glucagon trainer device, educator handout 'Survival Skills: Insulin, Lows, Sick Days'. Discharge checklist on the whiteboard with boxes still open. Bed alarm off.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| lispro pen in her hand | New needle on; dial set to 4; NOT primed (no 2-unit air shot) |
| glargine pen | Gray label; next dose tonight at 1900 (endocrinology will set the dose) |
| glucagon trainer | Training device for Julia's return demonstration |
| ketone strips | In the teaching kit |
| whiteboard discharge checklist | Open boxes: pen teach-back, meter, 15-15, glucagon (mother), sick-day rules with ketones, medical ID, supplies from the outpatient pharmacy, follow-up booked |
| breakfast tray | Oatmeal, banana, milk; carbohydrate list |
| left forearm IV | Saline lock, no redness |
| right forearm IV | Saline lock, no redness |
| abdomen (injection sites) | Last night's glargine site clean; no bruising |
| gait | Steady, independent |
| glucometer | 122 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse stops the pen error and re-teaches: new needle, prime 2 units until a drop shows, dial 4, 90 degrees, hold 10 seconds, rotate sites; return demonstration
- Nurse corrects the sick-day belief: never stop basal; glucose and ketones every 2-4 h when sick; fluids hourly; when to call and when to go to the ED
- Teach-back of the 15-15 rule; glucagon teaching for Julia with the trainer
- Medical ID discussion (band plus phone lock-screen ID); driving (check first, not under 90); exercise and alcohol
- Breakfast lispro 4 units at 0730 with the tray (glucose 122: no correction)
- Nurse reviews the discharge criteria: met (DKA resolved over 12 h, eating, K and BHB normal, mother present) and not yet met (teach-back, supplies, glucagon teaching, a full day without a low)

**Instructor says aloud:** Glucose 0400 118, 0700 122. Weight 0600 56.2 kg. Urine 0420 300, 0640 300. Oral 480 mL (juice, milk, water).

**Safety catch:** Pen technique error (no priming, no 10-second hold) and the unsafe sick-day belief ('skip insulin when sick' is how DKA comes back).

**Move to the next stop:** End of the course. Instructor only (after the course, not in the chart): glargine lowered to 12 units at 1900 by endocrinology after the low; home Tuesday about 1930 with her mother after her own 1900 glargine, if the criteria are met; Fri 02/12 antibodies GAD65 positive (210 IU/mL) and IA-2 positive, ZnT8 negative.

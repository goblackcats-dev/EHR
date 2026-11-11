# VR brief: Caleb Mercer (in-class DKA patient, SIM-40601)

For the VR developers and the instructor. Same patient, same numbers as the EHR chart (`DESIGN.md`, sections 16, 17 and 19). The machine-readable version of everything below is `vr_states.json` in this folder (one object per stop). If anything here disagrees with `DESIGN.md`, `DESIGN.md` wins.

**Course:** Monday 2027-01-11 0700 to Tuesday 2027-01-12 1900 (36 hours). Ten stops, every 4 hours. The instructor moves the class from stop to stop. Discharge is Wednesday (D3) morning, about 1000 after breakfast, after the course ends.

**Fixed rules for the whole scene**
- Insulin is a **fixed rate**: regular insulin 7.6 units/h (0.1 unit/kg/h x 76.0 kg). It is never adjusted for glucose. It goes to 3.8 units/h only after the low glucose at D2 0300. It is held only for potassium under 3.5 (D1 1500-1750).
- Dextrose (D10W) runs on a separate channel whenever glucose is under 250 and insulin is running.
- Potassium is given only as **riders**: one 10 mEq/100 mL bag over 1 hour at a time, on its own pump on the right side. **No potassium in any large bag. No 40 mEq/L bag ever appears in the room.**
- **No oxygen at any stop.** Room air the whole stay.
- Three planted wrong orders (on the chart screen, not props): **D1 2300** KCl 40 mEq/L bag; **D2 0700** transition with no overlap; **D2 1900** discharge list missing blood ketone strips and glucagon.
- Transition: **glargine 24 units at 0730 on D2**, drip off at 0930 (2-hour overlap). Glargine every morning at 0730 from then on.

---

## 1. The patient at a glance

- **Caleb Mercer**, 28-year-old man (he/him), DOB 07/22/1998, MRN SIM-40601. Room SD-3, Medical-Surgical Step-Down with telemetry. Full Code. **Allergy: Codeine (hives)** (red allergy band).
- **Height 180 cm, weight 76.0 kg** (ED bed scale; dosing weight), BMI 23.5. Usual weight 79.0 kg. Weighs 79.3 kg on D2 at 0600.
- **Build:** Lean, sporty (plays recreational soccer). Looks a little drawn on Day 1: about 3 kg lost during the illness.
- **Hair:** Short. Colour is an art choice (not set by DESIGN.md). Flattened and messy on Day 1 and D2 0700; damp after his shower at D2 1100.
- **Skin tone:** Skin tone is an art choice. Show flushing and pallor where they read on any skin tone: lips, nail beds, inner eyelids, palms.
- **Clothing:** Hospital gown with the telemetry box in the gown pocket, non-skid socks, ID band and red allergy band (codeine). Surgical mask under his chin at D1 0700 (droplet precautions). Gown changed after the wet bed at D2 0300. Own T-shirt from D2 1100; own clothes at D2 1900.
- **Why he is here:** Moderate-to-severe diabetic ketoacidosis (DKA) from stopping his long-acting insulin during a viral illness; type 1 diabetes since age 16. Several days of a cold or flu-like illness; he stopped his long-acting insulin because he "wasn't eating" (last dose Friday 01/08 at 2100; skipped Saturday and Sunday). Vomited many times on Sunday. Arrived in the ED at 0130 Monday.
- **Home insulin:** Glargine 24 units at bedtime 2100 (last dose Fri 01/08 2100; skipped Sat and Sun). Lispro 1 unit per 10 g carbohydrate + 1 unit per 50 mg/dL over 150. New plan from D2: glargine 24 units every morning at 0730.
- **Voice:** Mid-range, relaxed, ordinary young-adult speech (art choice). On Day 1 morning: short phrases between deep breaths, slow to answer. Later: quick, chatty, a little self-deprecating.
- **Manner:** Friendly, a bit embarrassed about skipping insulin ('I didn't want to go low'). Impatient to eat, walk and go home once he feels better. Calls staff 'you guys'. Works IT help desk.
- **Sister: Tessa Mercer** (31). Lives 15 minutes away; has a key to his apartment. Found him at about 0100 Monday breathing fast and deep, drowsy, 'smelling like nail polish remover', and drove him to the ED. Brings his home pens at D2 1400. Will pick him up on discharge (D3 morning) and stay the first night (roommate Devin Szabo works nights). Manner: Calm, practical, protective; a little scolding with her brother.
- Roommate: Devin Szabo (night-shift paramedic student; never in the room).

Items marked "art choice" are not set by the chart; pick one look and keep it for all ten stops.

## 2. Room SD-3

- Single room. Bed in the middle, head against the wall, bed low and locked, side rails up x2 at the head.
- Bedside monitor on a wall arm above and to the patient's right of the head of the bed (screen header 'SD-3   MERCER, CALEB   28 M'). 5-lead telemetry, box in the gown pocket. No oxygen in use at any stop (wall oxygen flowmeter present but not connected).
- LEFT IV pole (patient's left side), for the left forearm 18 g IV: pump 1 with two channels (channel A = 0.9% NaCl primary; channel B = D10W on secondary tubing into a Y-site needleless connector) and a separate single-channel insulin pump.
- RIGHT IV pole (patient's right side): pump 2 for potassium chloride riders (one bag at a time).
- Overbed table, chair for the visitor (Tessa), recliner chair by the window.
- Counter by the sink: glucometer, test strips, lancets, alcohol swabs, gloves. Sharps box on the wall.
- Emesis basin on the bed, urinal hanging on the bed rail, ice-chip cup on the table, call light clipped to the pillow, bed alarm control on the footboard (light on when armed).
- Hand-hygiene sink and foam dispenser inside the door.

**Bags and their label text** (every bag also carries the patient label: `MERCER, CALEB  MRN SIM-40601  DOB 07/22/1998  SD-3  Allergy: codeine`)

| Bag label | Pump | Into | When |
|---|---|---|---|
| `0.9% Sodium Chloride 1,000 mL` | pump 1 channel A (left pole) | left forearm 18 g | Whole stay until D2 0930. 250 mL/h at D1 0700, 150 mL/h from 0705, 100 mL/h from D1 1900. Off D2 0930. |
| `Dextrose 10% in Water 1,000 mL` | pump 1 channel B (left pole), secondary tubing into the Y-site | left forearm 18 g | 100 mL/h D1 0705-1500; off 1500-1900; 100 mL/h D1 1900 onward; 150 mL/h from D2 0210 (disconnected about 0100-0310; new tubing 0310); off D2 0930. |
| `Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT` | insulin pump (left pole) | left forearm 18 g | 7.6 mL/h (7.6 units/h) until 1500; on hold 1500-1750; 7.6 from 1750; 3.8 mL/h from D2 0305; off D2 0930. |
| `Potassium chloride 10 mEq/100 mL, infuse over 1 hour` | pump 2 (right pole) | right antecubital 20 g until D1 1900, then right forearm 20 g | 100 mL/h (10 mEq/h), one at a time: D1 0715; 1030, 1130, 1230; 1505, 1605, 1705, 1805; 2230, 2330; D2 0030, 0330, 0430, 0730, 0830. |
| `Magnesium sulfate 2 g/50 mL, infuse over 2 hours` | left pole (D1 1515-1715 only) | left forearm 18 g, Y-site with NaCl | D1 1515-1715 only (25 mL/h). |

Other props that stay in the room: glucometer and strips on the counter, emesis basin, urinal on the rail, call light by the pillow, bed alarm (light on when armed: armed at D1 0700 and at night; off for the day from D2 0700), sharps box on the wall, ice-chip cup.

**Droplet precautions**
- On: From arrival (D1 0700) until the RN discontinues them at the D1 1100 stop (respiratory viral panel negative 0950, afebrile).
- What it looks like: Yellow 'Droplet Precautions' sign on the door and at the sink; PPE cart outside the door (surgical masks, gowns, gloves, eye protection); patient's mask under his chin.
- After the nurse stops them: Sign taken down, PPE cart rolled away, no mask. Standard precautions and cough etiquette (tissues and a small trash bag on the table).
- If a class does not stop them at 1100, the instructor can leave the sign and cart up for later stops (the chart does not say either way after 1100).

**IV sites over time**
- Left forearm 18 g (placed D1 0145, dressing dated 01/11 0145): saline, D10, insulin, magnesium. Saline lock from D2 0930. Stays to discharge.
- Right antecubital (inner elbow) 20 g (placed D1 0150): potassium riders from 0715. **Infiltrates during the 1805 rider; found at 1900; removed 1900.** Then a marked, swollen area that shrinks (4 cm at 1900, 2 cm at 2300, gone with a faint bruise at D2 0700).
- Right forearm 20 g (placed by the nurse D1 1915): riders from 2230. Saline lock from D2 0930. Removed at the D2 1900 stop.

## 3. Monitor numbers at a glance (same as the bedside monitor, DESIGN.md section 17)

| Stop | HR | BP | RR | SpO2 | Temp F | Rhythm | Pain |
|---|---|---|---|---|---|---|---|
| D1-0700 | 112 | 108/64 | 24 | 98% RA | 99.4 | sinus tachycardia, T waves slightly tall | 4 |
| D1-1100 | 102 | 114/68 | 20 | 98% RA | 99.0 | sinus tachycardia | 3 |
| D1-1500 | 98 | 116/70 | 18 | 98% RA | 98.8 | sinus with PVCs about 2/min, flat T waves and U waves | 2 |
| D1-1900 | 96 | 120/72 | 18 | 98% RA | 99.1 | sinus rhythm, low T waves, small U waves, no PVCs | 5 |
| D1-2300 | 88 | 118/70 | 16 | 97% RA | 98.6 | sinus rhythm, normal T waves | 1 |
| D2-0300 | 116 | 134/80 | 20 | 98% RA | 98.2 | sinus tachycardia | 1 |
| D2-0320 (after D50) | 92 | 122/74 | 16 | 98% RA | 98.2 | sinus rhythm | - |
| D2-0700 | 80 | 122/74 | 16 | 98% RA | 98.4 | sinus rhythm, normal T waves | 0 |
| D2-1100 | 78 | 124/76 | 14 | 99% RA | 98.6 | sinus rhythm | 0 |
| D2-1500 | 76 | 122/76 | 14 | 99% RA | 98.4 | sinus rhythm | 0 |
| D2-1900 | 74 | 120/74 | 14 | 99% RA | 98.4 | sinus rhythm | 0 |

---

## 4. The ten stops

### Stop 1. D1 0700: Arrival from the ED

*Sim time 2027-01-11 07:00. Precautions: droplet.*

**What just happened:** ED overnight: 1 L saline bolus, then saline; insulin infusion 7.6 units/h since 0305. Handoff note says 'K 5.6, no potassium' but that is the 0145 value; the 0545 K is 4.6.

**How he looks**
- Skin: Face and trunk flushed and warm; hands pale and cool; skin dry. Sweat: none (dry).
- Mouth: Lips dry and cracked; tongue dry.
- Breathing: Kussmaul: deep, fast, regular, 24/min.
- Mental status: Drowsy, eyes half closed, opens eyes to voice, oriented x4, slow to answer but makes sense.
- Posture: Lying with head of bed up 30 degrees, curled slightly on his side.
- Smell: Faint fruity (acetone, 'nail polish remover') smell near his face.
- Wearing: Hospital gown, surgical mask hanging under his chin.

**What he says**
- "I'm so thirsty... can I have water?"
- "I didn't take my long-acting because I wasn't eating. I didn't want to go low."
- "My stomach hurts and I feel sick."
- "Is my sister still here?"

**Short answers**
- Pain: "My belly and my whole body ache. Dull. Maybe a 4."
- Nausea: "Yeah, I feel sick. I threw up a lot yesterday, and once more in the ER."
- Thirst: "So thirsty. My mouth is like sandpaper."
- Last insulin: "My long-acting Friday night at nine. Nothing since then. No mealtime insulin since Friday lunch."
- Last ate: "Crackers and soup Thursday and Friday. Basically nothing since."
- Allergies: "Codeine. I get hives."
- Breathing: "I just can't slow my breathing down."
- Why he stopped insulin: "No food, no insulin, or I'll go low. That's what I thought."
- **Tessa** (chair at the bedside): "I found him around one. He was breathing so fast, and he smelled like nail polish remover." / "He wasn't answering my texts all evening."

**Equipment**
- Monitor: HR 112 sinus tachycardia, T waves slightly tall; BP 108/64; RR 24; SpO2 98% on room air; T 99.4 F; pain 4.
- Glucometer: 248 (0700).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 250 mL/h (to be lowered to 150 mL/h when D10 starts) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | not running (bag hanging, secondary tubing primed; start 100 mL/h) | left forearm PIV 18 g (dressing dated 01/11 0145) | ready.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 mL/h = 7.6 units/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): none (empty; first KCl rider due 0715) | - | right antecubital PIV 20 g (dressing dated 01/11 0150) | idle.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): No redness or swelling; NaCl and insulin infusing.
- IV site, right antecubital PIV 20 g (dressing dated 01/11 0150): Saline lock, flushes easily.
- Telemetry: 5-lead on, box in gown pocket.
- Oxygen: none (room air).
- Other: Emesis basin on the bed (empty); urinal on the rail; ice-chip cup; glucometer on the counter; bed alarm armed (light on); call light by his pillow; droplet sign on the door and PPE cart outside.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| left forearm IV | Clear dressing dated 01/11 0145, no redness or swelling, NaCl and insulin infusing |
| right antecubital IV | Saline lock dated 0150, flushes easily, no redness |
| skin turgor | Poor: skin tents for 3 seconds |
| capillary refill | 3 seconds; hands cool |
| radial pulses | 2+ and equal, fast |
| mouth | Lips dry and cracked; tongue dry |
| breath odour | Fruity (acetone) smell |
| breathing | Deep, fast, regular (Kussmaul), 24/min; no distress |
| lungs | Clear; dry cough |
| abdomen | Soft, diffusely tender, no guarding; bowel sounds hypoactive |
| grip strength | Equal both hands but generally weak |
| pupils | Equal and reactive |
| urinal | Pale yellow urine, large amounts (400 mL at 0630) |
| insulin pump screen | Regular insulin 1 unit/mL, 7.6 mL/h; label HIGH ALERT; needs independent double check |
| glucometer | 248 |
| handoff sheet | 'K 5.6, too high for potassium, none given' (old 0145 value; the 0545 K is 4.6) |

**What happens in the scene (expected nurse actions and replies)**
- Nurse does an independent double check of the insulin infusion
- D10 starts 100 mL/h (0705) and NaCl drops to 150 mL/h (glucose under 250)
- Nurse finds the newest K (4.6) and hangs a KCl 10 mEq rider at 0715 on pump 2 into the right antecubital IV (urine 400 mL at 0630)
- Hourly glucose checks

**Instructor says aloud:** Glucose 0700 248 (charted). Urine 400 mL at 0630.

**Safety catch:** Handoff uses the old K 5.6; newest K is 4.6, so a potassium rider is due. Glucose 248 = start the dextrose line.

**Move to the next stop:** Instructor advances to D1 1100 after D10 is running, NaCl is at 150 and the 0715 rider is hung. Between stops (narrated): emesis 120 mL at 0830; viral panel back negative 0950; rider at 1030 started.

### Stop 2. D1 1100: Better, and the viral panel is negative

*Sim time 2027-01-11 11:00. Precautions: droplet.* Droplet at the start of the stop. When the nurse discontinues them (panel negative 0950, afebrile), remove the door sign and PPE cart and take off the mask; set precautions to none.

**What just happened:** D10 running since 0705. Emesis 120 mL at 0830. 0930 labs: K 3.9 so 30 mEq: riders 1030 (running), 1130, 1230. Respiratory viral panel negative (0950). Clear liquids from 1100.

**How he looks**
- Skin: Still a little flushed in the face; hands cool. Sweat: none.
- Mouth: Lips still dry; tongue moist.
- Breathing: Still deep but slower, regular, 20/min.
- Mental status: Awake, alert, oriented x4, answers quickly, talks in full sentences.
- Posture: Sitting up in bed, eyes open, looking around.
- Smell: Fruity smell fainter.
- Wearing: Hospital gown, mask under chin (until precautions are stopped).

**What he says**
- "I feel a little more human."
- "My arm aches where that potassium is going in."
- "Do I still have to wear this mask? Did my flu test come back?"
- "Can I drink something real?"
- "How long do I have to stay?"

**Short answers**
- Pain: "Just aches now. About a 3. And my right arm where the potassium goes in."
- Nausea: "Better since I threw up this morning."
- Thirst: "Still thirsty. Can I have something besides ice?"
- Last insulin: "Just the drip. My last shot was Friday night."
- Last ate: "Nothing. Ice chips."
- Cough: "A little dry cough. I cover it."
- Flu test: "Nobody's told me. Did it come back?"
- Tessa: not in the room (optional).

**Equipment**
- Monitor: HR 102 sinus tachycardia; BP 114/68; RR 20; SpO2 98% on room air; T 99.0 F; pain 3.
- Glucometer: 186 (1100).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 150 mL/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | 100 mL/h | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site | running.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 mL/h = 7.6 units/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | 100 mL/h (10 mEq/h); 1030 rider; next 1130 and 1230 | right antecubital PIV 20 g (dressing dated 01/11 0150) | running.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): No redness or swelling.
- IV site, right antecubital PIV 20 g (dressing dated 01/11 0150): KCl rider infusing; mild ache; no redness or swelling.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Emesis basin used and emptied (120 mL at 0830); sugar-free gelatin and broth on the tray at 1100; droplet sign still on the door and PPE cart outside until discontinued.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| right antecubital IV | Rider infusing; he says it aches; no redness, no swelling, cool-normal skin |
| left forearm IV | No redness or swelling; NaCl, D10 and insulin infusing |
| skin turgor | Tents for 2 seconds |
| capillary refill | 3 seconds; hands cool |
| mouth | Lips dry; tongue moist |
| breath odour | Fruity smell, fainter than at 0700 |
| breathing | Deep but slower, 20/min |
| abdomen | Soft, mildly tender; bowel sounds active |
| grip strength | Equal; still a bit weak |
| door sign / PPE cart | Droplet Precautions sign; cart with masks, gowns, gloves |
| glucometer | 186 |
| pump 2 screen | Potassium chloride 10 mEq/100 mL, 100 mL/h |

**What happens in the scene (expected nurse actions and replies)**
- Nurse discontinues droplet precautions (panel negative for influenza A/B, SARS-CoV-2 and RSV; afebrile): sign down, cart removed, mask off
- Second rider at 1130 after the first finishes (one at a time)
- Sugar-free clear liquids start

**Instructor says aloud:** Glucose 0800 228, 0900 210, 1000 196, 1100 186. Urine 0750 350, 0920 300, 1045 250.

**Safety catch:** Order to discontinue: droplet precautions (panel negative; the protocol lets the RN stop them).

**Move to the next stop:** Instructor advances to D1 1500 once precautions are addressed. Between stops (narrated): riders 1130 and 1230 given; drinking clear liquids (480 mL); 1400 labs show K 3.2 and Mg 1.6.

### Stop 3. D1 1500: Low potassium, hold the insulin

*Sim time 2027-01-11 15:00. Precautions: none.* Assumes droplet precautions were discontinued at 1100. If the class did not stop them, the instructor can keep the sign and cart in place.

**What just happened:** Riders 1030, 1130, 1230 given (last finished 1330). 1400 labs: K 3.2 (resulted 1445), Mg 1.6. Monitor shows flat T waves, U waves and PVCs.

**How he looks**
- Skin: Normal colour, warm, dry. Sweat: none.
- Mouth: Moist lips and tongue.
- Breathing: Nearly normal depth, regular, 18/min.
- Mental status: Alert, oriented, tired.
- Posture: Sitting up, rubbing his calves.
- Smell: Faint fruity smell.
- Wearing: Hospital gown, no mask.

**What he says**
- "My legs feel heavy and my calves keep cramping."
- "My heart feels like it skips."
- "Why are you stopping my insulin? Isn't that what I need?"
- "Am I going backwards?"

**Short answers**
- Pain: "My calves cramp. A 2, but it comes and goes."
- Nausea: "No. I've kept the liquids down. No throwing up since this morning."
- Thirst: "Better. I've been drinking."
- Last insulin: "Just the drip, all day."
- Palpitations: "Every so often it feels like a skip or a thump."
- Weakness: "My legs feel heavy, like after a long game."
- Tessa: not in the room (optional).

**Equipment**
- Monitor: HR 98 sinus with PVCs about 2/min, flat T waves and U waves; BP 116/70; RR 18; SpO2 98% on room air; T 98.8 F; pain 2.
- Glucometer: 202 (1500).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 150 mL/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running (stays on).
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | 100 mL/h at the start; STOPPED at 1500 when the nurse holds insulin | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site | running -> stopped.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 units/h at the start; screen 'Channel stopped / on hold' after the nurse holds it at 1500 | left forearm PIV 18 g (dressing dated 01/11 0145) | running -> on hold.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | idle at the start (last rider finished 1330); new rider 100 mL/h from 1505; three more bags labelled 1605, 1705, 1805 on the pole hook, one at a time | right antecubital PIV 20 g (dressing dated 01/11 0150) | idle -> running.
- Left pole (MgSO4): Magnesium sulfate 2 g/50 mL, infuse over 2 hours | 25 mL/h (2 g over 2 h) from 1515 | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site with NaCl | starts 1515.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Normal.
- IV site, right antecubital PIV 20 g (dressing dated 01/11 0150): Patent; rider finished 1330; no redness or swelling.
- Telemetry: on; PVCs visible.
- Oxygen: none (room air).
- Other: 12-lead ECG cart at the bedside (1505); cup of sugar-free clear liquids on the table.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| monitor | Flat T waves, U waves, about 2 PVCs per minute |
| radial pulse | 2+, mostly regular with an occasional skipped beat |
| grip strength | Slightly weaker in both hands |
| calves | Cramping, soft, no swelling or redness |
| capillary refill | Under 3 seconds |
| skin turgor | Normal |
| mouth | Moist |
| breath odour | Faint fruity |
| abdomen | Soft, nontender |
| right antecubital IV | Patent, flushes, no redness or swelling |
| glucometer | 202 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse holds insulin and D10 at 1500 (K 3.2, under 3.5); NaCl stays at 150
- Nurse calls the hospitalist (Dr. Ashworth): hold insulin and D10, four riders, magnesium 2 g, STAT labs after the second rider, restart insulin when K is 3.5 or more
- 12-lead ECG 1505
- KCl rider 1505 (then 1605, 1705, 1805), one at a time
- MgSO4 2 g starts 1515 on the left line

**Instructor says aloud:** Glucose 1200 182, 1300 190, 1400 196, 1500 202. Urine 1150 250, 1320 250, 1440 250. Oral 480 mL clear liquids.

**Safety catch:** K 3.2 (under 3.5) = hold insulin. Only one rider at a time; never two to catch up.

**Move to the next stop:** Instructor advances to D1 1900 after the hold, the call, the first rider and the Mg. Between stops (narrated): STAT labs 1720 K 3.6; insulin restarted 1750 at 7.6 units/h; glucose rose to 274 then fell to 244; the 1805 rider into the right elbow IV has been burning since about 1800.

### Stop 4. D1 1900: Insulin back on, and the potassium IV infiltrates

*Sim time 2027-01-11 19:00. Precautions: none.*

**What just happened:** STAT 1720: K 3.6, so insulin restarted 1750 at 7.6 units/h. BHB rose to 3.1 during the hold. Glucose 1900 244: restart D10. The 4th rider (1805) has been running into a swollen right antecubital site. NaCl to 100 mL/h (order 1840).

**How he looks**
- Skin: Normal colour; inner right elbow puffy, pale and shiny around the dressing. Sweat: none.
- Mouth: Moist.
- Breathing: Easy, normal depth, regular, 18/min.
- Mental status: Alert, oriented, frustrated.
- Posture: Sitting up, holding his right arm against his chest, wincing.
- Smell: Faint fruity smell.
- Wearing: Hospital gown.

**What he says**
- "My elbow is burning, like really burning."
- "It's been sore since about six."
- "I'm starving. When can I eat real food?"
- "So the insulin is back on now?"
- "I was getting better and then they stopped my insulin."

**Short answers**
- Pain: "My elbow. Burning. A 5. The cramps are better."
- Nausea: "No. I'm just hungry."
- Thirst: "I'm okay, I've been drinking."
- Last insulin: "They turned the drip back on before six, I think."
- When it started: "It started hurting around six, when the new bag went up."
- Hunger: "Starving. Broth and jello all day."
- Tessa: not in the room (optional).

**Equipment**
- Monitor: HR 96 sinus rhythm, low T waves, small U waves, no PVCs; BP 120/72; RR 18; SpO2 98% on room air; T 99.1 F; pain 5.
- Glucometer: 244 (1900).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 150 mL/h, changed to 100 mL/h at 1900 | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | stopped since 1500; restart at 100 mL/h now (glucose 244) | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site | stopped -> restart.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 mL/h = 7.6 units/h (restarted 1750) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | 100 mL/h; screen 'volume infused 92 mL' of 100; slowing | right antecubital PIV 20 g (dressing dated 01/11 0150) | running into an infiltrated site -> nurse stops it.
- IV site, right antecubital PIV 20 g (dressing dated 01/11 0150): INFILTRATED (INS grade 2): swollen about 4 cm around the site, cool, pale, taut, shiny, tender, burning; rider infusing slowly.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Normal; NaCl and insulin infusing.
- IV site, right forearm PIV 20 g: Placed by the nurse at 1915 after the antecubital IV is removed.
- Telemetry: on.
- Oxygen: none (room air).
- Other: MgSO4 finished 1715 (bag gone). Cold pack, pillow, skin marker and IV start kit on the bedside table. Night shift arriving..

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| right antecubital IV | Swollen about 4 cm around the site, cool, pale, taut, shiny, tender; burning; pump shows 92 of 100 mL infused |
| right arm compared with left | Right inner elbow visibly bigger and cooler than the left |
| left forearm IV | Normal; infusing |
| grip strength | Equal both hands; cramps better |
| capillary refill | Under 3 seconds |
| skin turgor | Normal |
| breath odour | Faint fruity |
| monitor | Sinus, low T waves, small U waves, no PVCs |
| glucometer | 244 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse stops the rider, disconnects, tries to aspirate, removes the IV, elevates the arm, marks the edges, cold pack 20 minutes, documents grade 2, notifies the provider
- New 20 g IV in the right forearm at 1915 for the next riders
- D10 restarts at 100 mL/h; NaCl to 100 mL/h
- Handoff to night shift

**Instructor says aloud:** Glucose 1600 238, 1700 266, 1800 274, 1900 244. Urine 1600 300, 1810 300. Oral 480. Rider pump shows 92 of 100 mL infused.

**Safety catch:** IV infiltration with potassium (an irritant): stop the infusion first, then treat the site.

**Move to the next stop:** Instructor advances to D1 2300 after the site is treated, a new IV is in and D10 is back on. Between stops (narrated): 2130 labs K 3.7 so 30 mEq: rider 2230 started in the new right forearm IV; at 2245 the night hospitalist ordered NaCl with KCl 40 mEq/L at 100 mL/h.

### Stop 5. D1 2300: A wrong potassium order, hungry and restless

*Sim time 2027-01-11 23:00. Precautions: none.*

**What just happened:** Night. D10 100, NaCl 100, insulin 7.6. 2130 labs: K 3.7 -> riders 2230 (running), 2330, 0030 in the right forearm IV. At 2245 Dr. Varga ordered NaCl 1,000 mL with KCl 40 mEq/L at 100 mL/h. BHB 2.0, pH 7.31: not resolved.

**How he looks**
- Skin: Normal colour, warm, dry. Sweat: none.
- Mouth: Moist.
- Breathing: Normal pattern, 16/min.
- Mental status: Alert, oriented, restless, bored.
- Posture: Sitting up, phone in hand; right elbow on a pillow with marker lines.
- Smell: Barely any fruity smell.
- Wearing: Hospital gown.

**What he says**
- "Can I just walk to the bathroom by myself? I'm fine."
- "I'm so hungry. Broth is not food."
- "Why do I keep getting these potassium bags?"
- "When can I go home?"

**Short answers**
- Pain: "The old spot on my elbow aches a little. A 1."
- Nausea: "None."
- Thirst: "No, I'm fine."
- Last insulin: "Still on the drip."
- New IV: "This one just burns a tiny bit when the potassium runs. Nothing like before."
- Texting: "Just texting my roommate. He's at work."
- Tessa: not in the room (home for the night).

**Equipment**
- Monitor: HR 88 sinus rhythm, normal T waves; BP 118/70; RR 16; SpO2 97% on room air; T 98.6 F; pain 1.
- Glucometer: 176 (2300).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 100 mL/h (plain saline; no potassium) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | 100 mL/h | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site (secondary tubing) | running.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 mL/h = 7.6 units/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | 100 mL/h (2230 rider; next 2330, 0030) | right forearm PIV 20 g (dressing dated 01/11 1915) | running.
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Rider infusing; no redness or swelling; mild burning only.
- IV site, former right antecubital site: Swelling about 2 cm, softer, edges marked with skin marker, arm on a pillow.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Normal.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Lights dim. Bed alarm on (light). Urinal on the rail. Call light in reach. NO 40 mEq/L potassium bag in the room: the wrong order is on the chart screen only..

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| right forearm IV | Rider infusing; no redness or swelling; mild burning |
| former right antecubital site | About 2 cm swelling, softer, inside the marker lines (smaller than at 1900) |
| left forearm IV | Normal |
| breath odour | Barely detectable |
| grip strength | Equal and strong |
| capillary refill | Under 3 seconds |
| skin turgor | Normal |
| abdomen | Soft, nontender; he is hungry |
| bed alarm | Armed, light on |
| glucometer | 176 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse does not hang a 40 mEq/L bag and calls Dr. Varga: peripheral IV only, limit 20 mEq/L in a peripheral bag, and 4 mEq/h from the bag + 10 mEq/h rider = 14 mEq/h, over the 10 mEq/h limit
- Dr. Varga: 'You're right, he has no central line. Discontinue that order. Keep plain saline at 100 and the riders per protocol.' (order stopped 2320)
- Rider 2330 after 2230 finishes
- Night fall safety: bed alarm, urinal, call light; he wants to walk alone

**Instructor says aloud:** Glucose 2000 222, 2100 204, 2200 190, 2300 176. Urine 2000 250, 2210 300. Oral 360.

**Safety catch:** Wrong/unsafe order: KCl 40 mEq/L in a peripheral bag, stacked with riders.

**Move to the next stop:** Instructor advances to D2 0300. Between stops (narrated): rider 0030 given; at about 0100 he got up to void (300 mL) and the D10 secondary tubing pulled apart at the Y-site connector; the pump kept running with no alarm. 0200 glucose 112: off-going nurse raised D10 to 150 mL/h at 0210 and called at 0215 (keep insulin 7.6, recheck in 1 h). No one traced the line; no 0230 recheck.

### Stop 6. D2 0300: Low glucose from a disconnected dextrose line

*Sim time 2027-01-12 03:00. Precautions: none.*

**What just happened:** D10 tubing disconnected at the Y-site since about 0100 (pump running, dextrose dripping into the bed). Glucose 0200 112 -> D10 raised to 150 at 0210, provider called 0215. 0300 glucose 62. Bed alarm sounding. 0130 labs: K 4.0, BHB 1.1 (not resolved).

**How he looks**
- Skin: Cool, pale and sweaty (diaphoretic); forehead beaded with sweat. Sweat: Heavy (from low glucose).
- Mouth: Moist.
- Breathing: A bit fast, not deep, 20/min.
- Mental status: Awake, anxious, 'foggy', slow to answer, oriented x4, hands trembling; forgets his limits.
- Posture: Sitting on the edge of the bed, feet dangling, gripping the rail, wants to walk to the bathroom with two IV poles.
- Smell: No fruity smell.
- Wearing: Hospital gown, wet on the left side.
- After treatment: By 0320: alert, skin dry, tremor gone, lying back in bed, calmer.

**What he says**
- "I feel shaky and weird... I need to pee."
- "Is this a low? It feels like a low."
- "I'm sweating like crazy... and why is my bed wet?"
- (after treatment) "Okay... that's better. Sorry."

**Short answers**
- Pain: "Just a headache. A 1."
- Nausea: "No. I'm actually hungry."
- Thirst: "Not really."
- Last insulin: "The drip's still on, isn't it?"
- Symptoms: "Shaky, sweaty, hungry, my head hurts. That's how my lows feel."
- Why he got up: "I had to pee. I didn't want to bother anyone."
- Wet bed: "I don't know. I didn't pee the bed, I swear. It's on this side."
- Tessa: home.

**Equipment**
- Monitor: HR 116 sinus tachycardia; BP 134/80; RR 20; SpO2 98% on room air; T 98.2 F; pain 1.
- Monitor at 0320, after treatment: HR 92 sinus rhythm; BP 122/74; RR 16; SpO2 98%; T 98.2 F.
- Glucometer: 62 (0300); 124 at 0315 after D50 12.5 g.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | 150 mL/h; screen 'D10W 150 mL/h, INFUSING', no alarm, volume infused climbing | NOT CONNECTED: tubing end lying open on the wet sheet at his left side (came apart at the Y-site needleless connector about 0100) | running into the bed -> nurse clamps, discards, hangs new sterile secondary tubing at 150 mL/h (0310).
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 100 mL/h | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 7.6 units/h at the start; nurse lowers to 3.8 mL/h = 3.8 units/h at 0305 (do NOT stop) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): none running (next KCl rider due 0330; K 4.0 -> riders 0330 and 0430) | - | right forearm PIV 20 g (dressing dated 01/11 1915) | idle.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Site normal; insulin and NaCl infusing; Y-site connector open (D10 line not attached).
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Saline lock between riders; no redness.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Room dark; bed alarm beeping. Glucometer reading 62. D50 syringe (25 mL = 12.5 g). New sealed secondary tubing on the counter. Urinal within reach. Wet sheet and gown on the left side..

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| D10 line (trace from bag to patient) | Tubing end lying open on the sheet, not attached to the Y-site; drip still falling from it |
| pump 1 channel B screen | D10W 150 mL/h, INFUSING, no alarm (a running pump does not prove the drug reaches him) |
| bed sheet and gown | Wet, sticky on the left side (dextrose, not urine) |
| skin | Cool, pale, sweaty |
| hands | Tremor; grip equal |
| capillary refill | Under 3 seconds; hands cool and clammy |
| radial pulse | Fast, regular, strong |
| breath odour | No fruity smell |
| left forearm IV | Site normal; insulin and NaCl infusing |
| right forearm IV | Saline lock, no redness |
| bed alarm | Sounding; patient on the edge of the bed |
| glucometer | 62; recheck at 0315: 124 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse keeps him safe: sits him back in bed, resets the bed alarm, does not walk him
- D50 12.5 g (25 mL) IV push; recheck in 15 minutes: 124
- Nurse traces the D10 line, finds the open end, clamps it and hangs new sterile tubing at 150 mL/h (0310); does not reconnect the contaminated end
- Insulin lowered to 3.8 units/h at 0305 (not stopped: BHB 1.1, gap 14)
- Call Dr. Varga: 'Good catch. Keep insulin at 3.8, D10 at 150, glucose every hour, call if under 100.'
- Change the wet linen and gown
- Monitor changes to the 0320 row (HR 92, BP 122/74, RR 16) after treatment
- Riders 0330 and 0430

**Instructor says aloud:** Glucose 0000 166, 0100 158, 0200 112, 0300 62; after D50 0315 124. Urine 0005 250, 0100 300. Oral 120.

**Safety catch:** Line problem causing hypoglycemia, plus night fall risk (sweaty, shaky, trying to get up alone with lines). Morse 60.

**Move to the next stop:** Instructor advances to D2 0700 after D50, the new D10 tubing, insulin 3.8 and the call. Between stops (narrated): glucose 0400 140, 0500 152, 0600 156; riders 0330 and 0430; 0530 labs BHB 0.4, pH 7.34, HCO3 18 = resolved; weight 79.3 kg at 0600; night NP wrote the transition order at 0635.

### Stop 7. D2 0700: DKA resolved, an unsafe transition order

*Sim time 2027-01-12 07:00. Precautions: none.*

**What just happened:** 0530 labs: BHB 0.4, pH 7.34, HCO3 18, gap 13 = resolved. Night NP order (0635): glargine 24 units at 0700 and stop the insulin infusion, D10 and NaCl at 0700. Breakfast tray 0800. K 4.2 -> riders 0730, 0830. Weight 79.3 kg (0600).

**How he looks**
- Skin: Warm, dry, normal colour; pink moist lips. Sweat: none.
- Mouth: Moist.
- Breathing: Normal, 16/min.
- Mental status: Alert, oriented, bright, relieved.
- Posture: Sitting up in the chair, smiling.
- Smell: None.
- Wearing: Clean hospital gown; hair messy.

**What he says**
- "I feel almost normal."
- "So do I take my long-acting now? I usually take it at night."
- "When can I eat? Is breakfast coming?"
- "Can I do my own shot?"
- "I want to go home today."

**Short answers**
- Pain: "Nothing. Zero."
- Nausea: "None. I'm hungry."
- Thirst: "No."
- Last insulin: "The drip, still on. My last shot was Friday night."
- Usual long-acting time: "I always do it at nine at night."
- About last night: "Sorry about last night. I should have called."
- Tessa: not in the room (optional).

**Equipment**
- Monitor: HR 80 sinus rhythm, normal T waves; BP 122/74; RR 16; SpO2 98% on room air; T 98.4 F; pain 0.
- Glucometer: 152 (0700); pre-breakfast 0745: 154.
- Insulin pump: Regular insulin 100 units/100 mL 0.9% NaCl, 1 unit/mL, HIGH ALERT | 3.8 mL/h = 3.8 units/h (runs until 0930) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 1 channel B: Dextrose 10% in Water 1,000 mL | 150 mL/h (runs while IV insulin runs, until 0930) | left forearm PIV 18 g (dressing dated 01/11 0145) via Y-site (new tubing since 0310) | running.
- Pump 1 channel A: 0.9% Sodium Chloride 1,000 mL | 100 mL/h (until 0930) | left forearm PIV 18 g (dressing dated 01/11 0145) | running.
- Pump 2 (right pole): Potassium chloride 10 mEq/100 mL, infuse over 1 hour | 100 mL/h; riders due 0730 and 0830 | right forearm PIV 20 g (dressing dated 01/11 1915) | bag ready, starts 0730.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Patent, no redness.
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Patent, no redness.
- IV site, former right antecubital site: Swelling gone; faint bruise.
- Telemetry: on.
- Oxygen: none (room air).
- Other: From pharmacy: glargine pen and lispro pen (patient-labelled, two different labels), pen needles, alcohol swabs; sharps box on the wall. Breakfast tray at 0800 with a carbohydrate list. Bed alarm off for the day..

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| skin turgor | Normal |
| mouth | Moist, pink |
| breath odour | No fruity smell |
| capillary refill | Under 3 seconds; hands warm |
| grip strength | Strong and equal (5/5) |
| abdomen | Soft, nontender; bowel sounds active |
| left forearm IV | Patent |
| right forearm IV | Patent |
| former right antecubital site | Swelling gone, faint bruise |
| insulin pump screen | 3.8 units/h |
| insulin pens | Glargine (long-acting) and lispro (rapid-acting), different labels |
| glucometer | 152 (0745: 154) |

**What happens in the scene (expected nurse actions and replies)**
- Nurse confirms resolution (BHB 0.4 under 0.6 AND pH 7.34 / HCO3 18)
- Nurse questions the 0635 order (no overlap) and calls Dr. Beaumont: 'Correct, give the glargine first and keep the drip at least 2 hours. Glargine 0730, breakfast lispro 0800, drip off 0930. Glargine every morning from now on.' (order 0720)
- Glargine 24 units SubQ at 0730 (he may give it himself with coaching)
- Riders 0730 and 0830
- Lispro 6 units at 0800 with breakfast (60 g, glucose 154)
- Insulin infusion, D10 and NaCl off at 0930 (after this stop)

**Instructor says aloud:** Glucose 0400 140, 0500 152, 0600 156, 0700 152; pre-breakfast 0745 154. Weight 79.3 kg (0600). Urine 0315 200, 0530 300. Oral 240.

**Safety catch:** Unsafe transition order: stopping IV insulin at the same time as the first glargine dose (needs at least 2 h overlap).

**Move to the next stop:** Instructor advances to D2 1100 after the order is questioned and the 0730/0800/0930 plan is set. Between stops (narrated): glargine 0730, lispro 0800, ate 100% of breakfast, drip, D10 and NaCl off 0930, both IVs saline-locked, showered and walked the hall; 0945 labs K 3.6.

### Stop 8. D2 1100: Eating, off the drip, basal timing

*Sim time 2027-01-12 11:00. Precautions: none.*

**What just happened:** Glargine 0730, lispro 0800 given; ate 100% of breakfast; drip, D10 and NaCl off 0930; up ad lib. 0945 labs: BHB 0.3 (no rebound), K 3.6 -> KCl ER 20 mEq at 1100 and 1500. He plans glargine 'at nine tonight like always.'

**How he looks**
- Skin: Normal colour, warm, dry. Sweat: none.
- Mouth: Moist.
- Breathing: Normal, 14/min.
- Mental status: Alert, cheerful, engaged.
- Posture: Walking around the room.
- Smell: None.
- Wearing: His own T-shirt; damp hair (showered).

**What he says**
- "That breakfast was the best thing I've ever eaten."
- "Tonight I'll do my long-acting at nine like always, right?"
- "How many units for lunch?"
- "Do I really need potassium pills? They're huge."

**Short answers**
- Pain: "None."
- Nausea: "None."
- Thirst: "No."
- Last insulin: "Long-acting at seven-thirty, and six units of lispro with breakfast."
- Lunch: "The menu says about 70 grams. And I'll check my sugar first."
- Walking: "I did two laps of the hall. Felt great."
- Tessa: not here yet (brings his pens at 1400).

**Equipment**
- Monitor: HR 78 sinus rhythm; BP 124/76; RR 14; SpO2 99% on room air; T 98.6 F; pain 0.
- Glucometer: Last 0930 180; pre-lunch 1130 196 (give when checked).
- All pumps: none | off since 0930; pumps parked | - | off.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Saline lock, flushed, no redness.
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Saline lock, flushed, no redness.
- Telemetry: still on.
- Oxygen: none (room air).
- Other: Lunch menu with carbohydrate grams; medicine cup with KCl ER 20 mEq tablet and a full glass of water; glucometer on the counter.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| left forearm IV | Saline lock, flushes easily, no redness |
| right forearm IV | Saline lock, flushes easily, no redness |
| breath odour | None |
| skin turgor | Normal |
| grip strength | Strong, equal |
| gait | Steady, independent |
| abdomen | Soft, nontender, bowel sounds active |
| KCl ER tablet | Large tablet; swallow whole, upright, with a full glass of water |
| glucometer | 196 when checked at 1130 |

**What happens in the scene (expected nurse actions and replies)**
- Nurse teaches basal timing: today's glargine was at 0730; a 2100 dose would be 48 units in 13.5 h (night low); next dose 0730 tomorrow, then every morning
- KCl ER 20 mEq PO at 1100
- Pre-lunch glucose 1130: 196; lispro 8 units at 1200 (70 g = 7 + 1 correction)

**Instructor says aloud:** Glucose 0830 172, 0930 180; pre-lunch 1130 196. Urine 0740 300, 1010 350. Oral 600.

**Safety catch:** Patient plans a second basal dose tonight (would double his basal insulin).

**Move to the next stop:** Instructor advances to D2 1500. Between stops (narrated): lunch 1200 with 8 units, ate 80%; educator session 1 at 1330; Tessa brought his home pens at 1400; pharmacy recommends ketone strips and glucagon (1400).

### Stop 9. D2 1500: Teaching and teach-back

*Sim time 2027-01-12 15:00. Precautions: none.*

**What just happened:** Ate 80% of lunch with 8 units. Educator session 1 at 1330. Sister brought his home pens at 1400. 1330 labs normal; K 3.9; second KCl ER due 1500.

**How he looks**
- Skin: Normal colour. Sweat: none.
- Mouth: Moist.
- Breathing: Normal, 14/min.
- Mental status: Alert, relaxed, motivated.
- Posture: Sitting on the bed with two insulin pens and a ketone meter, sister next to him.
- Smell: None.
- Wearing: Own T-shirt.

**What he says**
- "If I'm not eating, I'll just take half my long-acting, right?"
- (holding the long-acting pen) "Two units for these crackers."
- "How many extra units do I take if my ketones are up?"
- "When do I call you guys versus just come in?"

**Short answers**
- Pain: "None."
- Nausea: "None."
- Thirst: "No."
- Last insulin: "Long-acting this morning at seven-thirty, eight units of lispro at lunch."
- Which pen: "They look the same. This one's... the long one? I'd have to read it."
- Ketone strips: "My meter does ketones, but I think the strips are old."
- **Tessa** (sitting on the bed next to him): "I brought his pens from the apartment." / "Can you show me too? I want to know what to watch for."

**Equipment**
- Monitor: HR 76 sinus rhythm; BP 122/76; RR 14; SpO2 99% on room air; T 98.4 F; pain 0.
- Glucometer: No check since 1130 (196); lab glucose 1330 214; pre-dinner 1700 will be 142.
- All pumps: none | off; parked | - | off.
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Saline lock, no redness.
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Saline lock, no redness.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Home pens (long-acting and rapid-acting, similar size, different labels), pen needles, ketone meter with expired strips (2024), educator handout 'Sick-Day Plan' with the extra-lispro table, crackers, sharps box, KCl ER 20 mEq cup for 1500.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| pen in his hand | Glargine (long-acting): wrong pen for a carbohydrate dose (2 units is the right dose for about 20 g, but with lispro) |
| ketone strips | Expired 2024 |
| Sick-Day Plan handout | Ketones 0.6-1.4: extra lispro 5 units; 1.5-2.9: 9 units and call; 3.0 or more: ED |
| IV sites | Both saline locks clean, no redness |
| breath odour | None |

**What happens in the scene (expected nurse actions and replies)**
- Nurse stops the pen mix-up (no snack dose in hospital; lispro with meals only)
- Re-teach: full glargine dose every morning even when not eating
- Teach-back of the written sick-day plan (5 / 9 units / ED; glucose and ketones every 2-4 h; fluids 250 mL every hour; when to call)
- KCl ER 20 mEq PO at 1500
- Dinner plan: 60 g, glucose 142 -> lispro 6 units at 1730

**Instructor says aloud:** No glucose check since 1130 (196); lab glucose 1330 214; pre-dinner 1700 will be 142. Urine 1130 300, 1400 350. Oral 840.

**Safety catch:** Wrong insulin pen (long-acting picked for a carbohydrate dose) and an unsafe sick-day belief ('half my long-acting').

**Move to the next stop:** Instructor advances to D2 1900. Between stops (narrated): educator teach-back at 1645 correct; dinner 1730 with 6 units, ate 90%; discharge order 1745 for tomorrow (D3) after breakfast.

### Stop 10. D2 1900: Discharge plan for tomorrow

*Sim time 2027-01-12 19:00. Precautions: none.*

**What just happened:** Dinner 1730 with 6 units, ate 90%. 1730 labs normal (K 4.1, BHB 0.2). Discharge order 1745: home tomorrow (D3) after breakfast. Prescriptions copied from his home list: no blood ketone strips and no glucagon.

**How he looks**
- Skin: Good colour. Sweat: none.
- Mouth: Moist.
- Breathing: Normal, 14/min.
- Mental status: Alert, relaxed; disappointed not to go tonight but agrees.
- Posture: Sitting in the chair, phone charging.
- Smell: None.
- Wearing: His own clothes.

**What he says**
- "Basal every morning, no matter what. Ketones every few hours if I'm sick."
- "My ketone strips at home are from 2024... do I need new ones?"
- "Tessa, you know where the glucagon goes, right?"
- "So I really have to stay one more night?"

**Short answers**
- Pain: "None."
- Nausea: "None."
- Thirst: "No."
- Last insulin: "Six units of lispro with dinner at five-thirty. Long-acting this morning at seven-thirty. Next one tomorrow at seven-thirty, not tonight."
- Sick-day plan: "Never stop my long-acting. Check sugar and ketones every 2 to 4 hours. Ketones 0.6 to 1.4, 5 extra units. 1.5 to 2.9, 9 units and call. 3 or more, ER."
- When to call: "Throwing up more than twice, can't keep fluids down, sugar over 300 twice, ketones not coming down. ER if I'm breathing fast, belly pain or confused."
- Follow-up: "Dr. Harlow, Friday the 15th at ten."
- **Tessa** (in the chair next to him): "I'll pick him up in the morning and stay the first night. Devin works nights." / "His glucagon at home is expired too. Do we need a new one?"

**Equipment**
- Monitor: HR 74 sinus rhythm; BP 120/74; RR 14; SpO2 99% on room air; T 98.4 F; pain 0.
- Glucometer: 1700 142. Next checks bedtime 2100 and 0300 (after the course ends).
- All pumps: none | off; parked | - | off.
- IV site, right forearm PIV 20 g (dressing dated 01/11 1915): Saline lock; to be removed at this stop (catheter intact).
- IV site, left forearm PIV 18 g (dressing dated 01/11 0145): Saline lock, no redness; kept overnight.
- Telemetry: on.
- Oxygen: none (room air).
- Other: Discharge instructions draft on the table; prescription list: glargine 24 units every morning (0730), lispro pens, pen needles, glucose meter strips, lancets, glucose tablets (NO ketone strips, NO glucagon); sharps box; phone charger.

**What the nurse can check and what they find**

| Check | Finding |
|---|---|
| prescription list | Glargine, lispro pens, pen needles, glucose strips, lancets, glucose tablets; missing blood ketone strips and glucagon |
| right forearm IV | Saline lock, no redness; remove (no longer needed) |
| left forearm IV | Saline lock, no redness; keep overnight |
| discharge instructions draft | Home D3 after breakfast (about 1000) with sister; follow-up Dr. Harlow 01/15 1000 |
| breath odour | None |

**What happens in the scene (expected nurse actions and replies)**
- Nurse reviews discharge readiness and calls Dr. Ashworth to add blood ketone strips and glucagon: 'Yes, add them. The outpatient pharmacy will bring them up in the morning before he leaves.'
- Plan to teach Tessa to give glucagon
- Confirm glargine every morning at 0730 (next D3 0730; none tonight)
- Remove the right forearm IV; keep the left saline lock overnight
- Final teach-back with the sister

**Instructor says aloud:** Glucose 1700 142. Urine 1600 300, 1830 300. Oral 720.

**Safety catch:** Missing discharge supplies (blood ketone strips and glucagon) on a list copied from his home prescriptions.

**Move to the next stop:** End of the course. Discharge happens D3 about 1000 after breakfast if overnight and fasting glucoses are 100-250 with no low, BHB under 0.6, and supplies in hand (not simulated).

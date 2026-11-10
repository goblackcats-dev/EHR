/* Adrenal crisis patient: nursing assessment flowsheet rows. A NEW full assessment is charted at the ED 0410, the unit 0700 and EVERY checkpoint (1100, 1500, 1900, 2300, Tue 0300, Tue 0700), so each stop has something new to read.
   Rows keep the earlier value unless the checkpoint changes them (LATER below). No vital sign numbers appear here (the instructor gives bedside values aloud, see INSTRUCTOR_GUIDE.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0410 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Lethargic; opens eyes to voice, drifts off; GCS 13 (E3 V4 M6)', 'Drowsy but wakes to voice and stays awake while spoken to; GCS 14 (E4 V4 M6)', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Knows her name; thinks it is "Sunday night at home"', 'Oriented to person and place, not to the date or the events; slow to answer, repeats questions', true],
  ['Neurologic', 'MUSCLE_STRENGTH', 'Muscle Strength', 'Too weak to stand (EMS); moves all four limbs', 'Moves all four limbs against gravity; generalized weakness 4/5, tires quickly; grips equal', true],
  ['Neurologic', 'PUPILS', 'Pupils', 'Equal, round, reactive, 3 mm', 'Equal, round, reactive, 3 mm', false],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', 'Clear bilaterally', 'Clear bilaterally', false],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Regular, slightly fast, 22/min, unlabored', 'Regular, unlabored, 18/min', false],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia 120s on the monitor; tall T waves', 'Sinus tachycardia 104; T waves still tall on the monitor lead; no ectopy', true],
  ['Cardiac', 'PULSES', 'Peripheral Pulses', 'Radial pulses weak (1+) and thready', 'Radial 2+ equal; pedal 1+ equal', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 4 seconds; hands cool', '3 seconds; hands cool to touch', true],
  ['Cardiac', 'JVD', 'Neck Veins (JVD)', 'Flat while lying flat', 'Flat at 30 degrees', true],
  ['Cardiac', 'EDEMA', 'Edema', 'None', 'None', false],
  ['GI', 'ABDOMEN', 'Abdomen', 'Soft, diffusely tender, no guarding or rebound', 'Soft, mild diffuse tenderness, no guarding, no distension', true],
  ['GI', 'BOWEL_SOUNDS', 'Bowel Sounds', 'Hyperactive x4', 'Hyperactive x4', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Vomiting at home for 2 days; vomited 150 mL clear/bilious at 0440 in the ED', 'Nauseated; no vomiting since 0440; ondansetron given 0430', true],
  ['GI', 'LAST_BM', 'Bowel Movement / Stool', 'Watery diarrhea 6-8 times a day since Saturday (husband)', 'Liquid brown stool x1 in the ED at 0515 (200 mL), no blood; stool sample not yet collected', true],
  ['GI', 'DIET', 'Diet / Intake', 'Could not keep down food, fluids or her pills since Saturday afternoon; craving salt', 'NPO except ice chips and sips; craving salty food ("I want pickles")', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Voided small amounts at home (husband)', 'Voided 150 mL in the ED at 0450 (bedpan); no catheter; uses bedpan/commode with 1 assist', true],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', 'Not seen', 'Dark yellow, clear', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Skin tents over the sternum; very dry lips and tongue', 'Skin tents slowly (about 3 seconds); dry mucous membranes', true],
  ['Skin', 'SKIN_COLOR', 'Skin Color / Pigmentation', 'Tanned-looking skin in December; dark patches on the gums and inside the cheeks', 'Bronze/tan skin all over (says "I always look tan"); darker skin creases of the palms and knuckles; dark patches on the gums and inside the cheeks; old appendectomy scar darker than the skin', true],
  ['Skin', 'SKIN', 'Skin Integrity / Pressure Areas', 'Intact; bruise on both knees (fell to her knees in the bathroom Sunday)', 'Intact; 3 cm bruises on both knees; sacrum and heels intact', true],
  ['Skin', 'BRADEN', 'Braden Score', 'Not done', '18 (mild risk): weak, drowsy, moist from diarrhea', false],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Could not stand (EMS carried her to the stretcher)', 'Bed rest; turns herself; NOT safe to stand (dizzy sitting up, BP 98/60 lying)', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', '6/10 crampy pain all over the belly, plus aching legs and back', '4/10 crampy belly pain; aching thighs', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'High fall risk (confused, dizzy, diuresis, IV): bed alarm on, bed low, call light in reach, non-skid socks, commode at bedside', false],
  ['Safety', 'ISOLATION', 'Isolation Precautions', 'Gown and gloves for diarrhea', 'Contact (enteric) precautions sign on the door; soap-and-water hand hygiene (diarrhea, stool tests pending)', false],
  ['Safety', 'STEROID_HISTORY', 'Steroid Use / Medication Review', 'Husband: "She has Addison\'s. She takes hydrocortisone but she threw it up." No emergency injection at home', 'Home hydrocortisone 15 mg (0700) + 5 mg (1400) and fludrocortisone 0.1 mg daily: no dose kept down since Saturday morning. No emergency injection kit and no medical alert bracelet. Has not seen an endocrinologist for 18 months', true],
  ['Lines / Drains / Airways', 'IV_SITE', 'IV Site Assessment', 'Right forearm 20 g placed in the ED and left forearm 18 g placed in the ED: both clean, dry, intact, flush easily', 'Right forearm 20 g: patent, no redness or swelling, D5NS running. Left forearm 18 g saline lock: flushes easily, brisk blood return', false],
];
const TIMES = [['Mon', '04:10', 3], ['Mon', '07:00', 4]];
// later checkpoints: [code]: [value, abnormal]. Each stop keeps the earlier value of any row it does not list.
const LATER = [
  ['Mon', '11:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Drowsy and anxious; wakes easily to voice; GCS 14 (E4 V4 M6)', true],
    ORIENTATION: ['Oriented to person and place; knew the date at 0900 but is foggier now; repeats "Something\'s wrong"', true],
    MUSCLE_STRENGTH: ['Moves all four limbs; generalized weakness 4/5; hands shaky and tremulous', true],
    RHYTHM: ['Sinus tachycardia on the monitor; T waves less tall than at 0700; no ectopy', true],
    PULSES: ['Radial 2+ equal; pedal 1+ equal', true], CAPILLARY_REFILL: ['3 seconds; hands cool and moist', true],
    ABDOMEN: ['Soft, mild diffuse tenderness, no guarding, no distension', true],
    NAUSEA: ['Mild nausea; no vomiting; ondansetron available (last dose 0430)', true],
    LAST_BM: ['Large liquid brown stool 250 mL at 0945, no blood; stool sample sent to the lab', true],
    DIET: ['NPO except ice chips and sips; asking for juice', true],
    URINARY_ELIMINATION: ['Voided 120 mL at 0800, 140 mL at 0930 and 120 mL at 1050 in the urine hat (380 mL since 0800)', true],
    URINE_APPEARANCE: ['Light yellow, getting lighter', false],
    SKIN_TURGOR: ['Skin tents less (about 2 seconds); mucous membranes still dry', true],
    SKIN: ['Intact; 3 cm bruises on both knees; skin cool, damp and sweaty at the 1100 check', true],
    MOBILITY: ['Bed rest; not safe to stand; bed alarm on', true], PAIN_SCORE: ['3/10 crampy belly pain', true]}],
  ['Mon', '15:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Alert, awake and talking; GCS 15', false],
    ORIENTATION: ['Oriented to person, place and time (x3); asks what happened', false],
    MUSCLE_STRENGTH: ['Moves all four limbs; weakness improving, 4/5; grips equal', true],
    RHYTHM: ['Normal sinus rhythm on the monitor; T waves normal; no ectopy', false],
    PULSES: ['Radial 2+ equal; pedal 2+ equal', false], CAPILLARY_REFILL: ['2 seconds; hands warm', false],
    ABDOMEN: ['Soft; mild tenderness only when pressed; no guarding', true], BOWEL_SOUNDS: ['Active x4, less loud', false],
    NAUSEA: ['No nausea; clear liquids kept down since 1345', false], LAST_BM: ['No new stool since 0945', false],
    DIET: ['Clear liquids since 1345 (ginger ale and broth); hungry', true],
    URINARY_ELIMINATION: ['Voided 250 mL at 1150, 300 mL at 1300, 280 mL at 1400 and 220 mL at 1450 (about 1,050 mL since 1100); feels the urge to void often', true],
    URINE_APPEARANCE: ['Pale yellow, very dilute', true], SKIN_TURGOR: ['Skin tents briefly (about 1 second); mucous membranes moist', false],
    SKIN: ['Intact; 3 cm bruises on both knees; skin warm and dry', false],
    MOBILITY: ['Bed rest with commode and 1 assist only; gets dizzy if she stands too fast', true], PAIN_SCORE: ['2/10 mild belly ache', true]}],
  ['Mon', '19:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Alert, awake, joking; GCS 15', false],
    ORIENTATION: ['Oriented x4 (person, place, date, situation); asks "When can I go home?"', false],
    MUSCLE_STRENGTH: ['Strength 5/5 in the arms and 4+/5 in the legs; steady when seated; grips equal', false],
    RHYTHM: ['Normal sinus rhythm on the monitor; normal T waves', false], BOWEL_SOUNDS: ['Active x4', false],
    ABDOMEN: ['Soft, non-tender, no distension', false], CAPILLARY_REFILL: ['Under 2 seconds; hands warm', false],
    NAUSEA: ['No nausea; keeping down ginger ale and juice', false],
    LAST_BM: ['One loose stool 200 mL at 1640, no blood; stool GI panel result is back', true],
    DIET: ['Regular diet ordered at 1830; clear liquids and juice taken; hungry', false],
    URINARY_ELIMINATION: ['Voided 300 mL at 1600, 320 mL at 1730 and 280 mL at 1850 (900 mL since 1500)', false],
    URINE_APPEARANCE: ['Pale yellow', false], SKIN_TURGOR: ['Normal turgor; mucous membranes moist', false],
    MOBILITY: ['Up to the commode with 1 assist; walks in the room with help; no dizziness', false], PAIN_SCORE: ['1/10 mild belly ache', true],
    ISOLATION: ['Contact (enteric) precautions continue: stool GI panel is positive for norovirus (C. difficile negative); soap-and-water hand hygiene', false]}],
  ['Mon', '23:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Alert but "wired"; cannot sleep; GCS 15', false],
    ORIENTATION: ['Oriented x4; restless and anxious about her son and work ("My mind won\'t stop")', true],
    MUSCLE_STRENGTH: ['Strength 5/5 in the arms and legs; grips equal', false],
    ABDOMEN: ['Soft, non-tender', false], LAST_BM: ['No stool since 1640', false],
    DIET: ['Ate 75% of her dinner at 2000; drinking well', false],
    URINARY_ELIMINATION: ['Voided 250 mL at 2000, 250 mL at 2130 and 200 mL at 2250 (700 mL since 1900)', false], URINE_APPEARANCE: ['Light yellow', false],
    MOBILITY: ['Walks to the commode with 1 assist; steady', false], PAIN_SCORE: ['0/10', false]}],
  ['Tue', '03:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Alert, awake; embarrassed after the near-fall; GCS 15', false],
    ORIENTATION: ['Oriented x4; says "I didn\'t want to bother anyone. I just got dizzy for a second."', false],
    MUSCLE_STRENGTH: ['Strength 5/5 in the arms and legs; steady when seated; no injury', false],
    LAST_BM: ['Soft loose stool at about 0240 in the bathroom, no blood', true],
    DIET: ['Taking sips and fluids; dozing most of the night', false],
    URINARY_ELIMINATION: ['Voided at about 0240 in the bathroom (walked there alone; amount not measured)', true],
    SKIN: ['Intact; 3 cm bruises on both knees; no new injury after the near-fall', false],
    MOBILITY: ['Back in bed after the 0240 near-fall (she sat down on the toilet and did not fall); bed alarm on, call light in reach', true],
    FALL_PRECAUTIONS: ['High fall risk: near-fall at 0240 (walked to the bathroom alone, lightheaded). Bed alarm on, bed low, call light in reach, non-skid socks, commode at the bedside', true],
    IV_SITE: ['Right forearm 20 g: puffy, pale, cool, about 3 cm of swelling, feels "tight"; the pump has not alarmed. Left forearm 18 g saline lock: patent', true],
    PAIN_SCORE: ['0/10', false]}],
  ['Tue', '07:00', {
    LEVEL_OF_CONSCIOUSNESS: ['Alert; slept from about 0330; GCS 15', false],
    ORIENTATION: ['Oriented x4; "I feel like myself"', false],
    LAST_BM: ['No stool since 0240', false], NAUSEA: ['No nausea; waiting for breakfast', false],
    DIET: ['Regular diet; appetite good', false],
    URINARY_ELIMINATION: ['Voiding well', false], SKIN_TURGOR: ['Normal turgor; mucous membranes moist', false],
    MOBILITY: ['Up with assist; walks in the room', false],
    FALL_PRECAUTIONS: ['High fall risk until discharge teaching is complete: bed alarm on, call light in reach, commode at the bedside', false],
    ISOLATION: ['Contact (enteric) precautions continue until 48 hours after the diarrhea stops (norovirus)', false],
    IV_SITE: ['Right forearm IV removed at 0310: mild swelling going down, no redness. Left forearm 18 g patent and in use', false]}]
];
function build() {
  const out = [];
  const push = (r, t, val, ab, source) => out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: val, collected: t, source, abnormal: !!ab });
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => push(r, t, r[col], r[5], col === 3 ? 'ED nursing assessment' : 'Nursing assessment'));
  });
  const cur = {}; ROWS.forEach(r => { cur[r[1]] = [r[4], r[5]]; });
  LATER.forEach(([d, tm, ov]) => {
    Object.keys(ov).forEach(k => { cur[k] = ov[k]; });
    const t = at(d, tm);
    ROWS.forEach(r => push(r, t, cur[r[1]][0], cur[r[1]][1], 'Nursing assessment'));
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);

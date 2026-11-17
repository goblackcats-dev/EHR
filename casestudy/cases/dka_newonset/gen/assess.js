/* In-class new-onset DKA patient (Nora Whitcombe): nursing assessment flowsheet rows. A NEW full assessment is charted in the ED (0145), at the unit
   arrival (0700) and at EVERY checkpoint (D1 1100, 1500, 1900, 2300, D2 0300, 0700). Rows keep the earlier value unless the checkpoint changes them
   (LATER below). No vital sign numbers appear in the text (the bedside monitor shows them). See ../DESIGN.md section 17. */
const { at, slug } = require('./lib');
// [section, code, label, ED 0145 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'NEURO', 'Neurologic (LOC, Orientation, Pupils)', 'Drowsy; opens eyes to voice; oriented x4 but slow to answer; GCS 15 once awake; pupils equal and reactive; headache', 'Drowsy but wakes to voice; oriented x4; slow to answer; follows commands; pupils equal and reactive; mild headache', true],
  ['Psychosocial', 'PSYCHOSOCIAL', 'Psychosocial / Coping', 'Roommate (Kendall Rowan) brought her in after finding her on the bathroom floor about 0100; frightened and quiet', 'Scared and quiet: "Is this diabetes? Nobody in my family has the needle kind." Roommate at the bedside until 0730; mother driving in', true],
  ['Cardiac', 'CARDIOVASCULAR', 'Cardiovascular', 'Sinus tachycardia on the ED monitor; radial pulses 2+ and fast; capillary refill 3 seconds; hands cool', 'Sinus tachycardia on the monitor; radial pulses 2+ and equal; capillary refill 3 seconds; hands cool; no edema', true],
  ['Respiratory', 'RESPIRATORY', 'Respiratory', 'Deep, fast, regular breathing (Kussmaul); fruity (acetone) breath; lungs clear; no cough; room air', 'Deep, fast, regular breathing (Kussmaul); fruity (acetone) breath; lungs clear; no cough; no distress on room air', true],
  ['GI', 'GI', 'Gastrointestinal', 'Nauseated; vomited 6-7 times since Sunday about noon; crampy belly pain; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive', 'Nauseated; no vomiting since 0215; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive; NPO except ice chips', true],
  ['GU', 'GU', 'Genitourinary', 'Urinating large amounts for weeks, up 3-4 times a night; very thirsty', 'Voiding large amounts of pale yellow urine in a hat; no burning', true],
  ['Skin', 'SKIN', 'Skin and Mucous Membranes', 'Warm, dry, cheeks flushed; turgor poor (tenting 3 seconds); lips dry and cracked; tongue dry', 'Warm, dry, flushed cheeks; turgor poor (tenting 3 seconds); lips dry and cracked; tongue dry and furrowed; eyes slightly sunken', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Musculoskeletal / Mobility', 'Weak and tired; helped in by her roommate', 'Weak and tired; unsteady standing; stand-by assist', true],
  ['Pain', 'PAIN_SCORE', 'Pain', 'Crampy belly pain, 6/10', 'Crampy belly ache, 4/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Safety / Fall Risk', 'Stretcher low, rails up x2; drowsy and weak', 'Morse 45 (secondary diagnosis 15, IV 20, weak gait 10) = high fall risk; bed low and locked; bed alarm on; call light in reach', true],
  ['Lines / Drains / Airways', 'IV_SITE', 'IV Site Assessment', 'No IV on arrival; two peripheral IVs to be placed', 'Left forearm 18 g: no redness or swelling; 0.9% sodium chloride and insulin infusing. Right forearm 20 g: saline lock, flushes easily', false],
  ['Endocrine', 'ENDOCRINE', 'Endocrine / Glucose Management', 'No known diabetes; weeks of thirst, urinating, hunger and weight loss', 'Insulin infusion running; no signs of low glucose; thirsty', true],
  ['Education', 'LEARNING', 'Learning Needs / Readiness', 'Not assessed (acutely ill)', 'Too tired and nauseated to learn now; asks short questions', true]
];
const TIMES = [['Mon', '01:45', 3], ['Mon', '07:00', 4]];
// later checkpoints: [day, time, {code: [value, abnormal]}]; rows not listed keep their earlier value
const LATER = [
  ['Mon', '11:00', {
    NEURO: ['Awake, alert, oriented x4, answers quickly; follows commands; pupils equal and reactive; headache gone', false],
    PSYCHOSOCIAL: ['More talkative; asks "So is it diabetes for sure?"; worried about her lab class Wednesday; texting her mother', true],
    CARDIOVASCULAR: ['Regular rhythm on the monitor; radial pulses 2+ and equal; capillary refill under 3 seconds; hands warm; no edema', false],
    RESPIRATORY: ['Breathing slower, still a little deep; fruity breath fainter; lungs clear', true],
    GI: ['No nausea; abdomen soft, mildly tender; bowel sounds active; asking to drink', true],
    SKIN: ['Lips dry; tongue moist; turgor 2 seconds; color improved', true],
    PAIN_SCORE: ['Belly ache, 2/10', true],
    FALL_PRECAUTIONS: ['Morse 45; bed low and locked; stand-by assist to the bathroom; call light in reach', true],
    IV_SITE: ['Left forearm 18 g: no redness or swelling; D5W/0.45% sodium chloride and insulin infusing. Right forearm 20 g: KCl rider infusing; mild ache at the site, no redness or swelling', false],
    ENDOCRINE: ['Insulin infusion running; dextrose in the main fluid; no signs of low glucose', false],
    LEARNING: ['More alert; asks questions about the diagnosis; not ready for detailed teaching yet', true]
  }],
  ['Mon', '15:00', {
    NEURO: ['Alert, oriented x4; says "my legs feel heavy"', true],
    PSYCHOSOCIAL: ['Mother at the bedside since 1300; relieved and teary when her mother arrived', false],
    CARDIOVASCULAR: ['T waves a little lower than this morning; no U waves; no ectopy; regular rhythm; pulses 2+; capillary refill under 3 seconds', true],
    RESPIRATORY: ['Normal depth, regular; faint fruity breath; lungs clear', false],
    GI: ['Tolerating sugar-free clear liquids; no nausea; abdomen soft, nontender', false],
    SKIN: ['Mucous membranes moist; turgor normal; skin warm and dry', false],
    MOBILITY: ['Mild calf cramps; grip equal and strong; steady gait; stand-by assist only for the two IV poles', true],
    PAIN_SCORE: ['Calf cramps, 1/10', true],
    FALL_PRECAUTIONS: ['Morse 35 (secondary diagnosis 15, IV 20; gait now normal); bed low and locked; call light in reach', false],
    IV_SITE: ['Left forearm 18 g: no redness or swelling; D5W/0.45% sodium chloride and insulin infusing. Right forearm 20 g: saline lock since 1230, patent, no redness or swelling; ready for riders', false]
  }],
  ['Mon', '19:00', {
    PSYCHOSOCIAL: ['Tearful since the diagnosis talk at 1700; denial and bargaining ("Can\'t I just fix it with diet like my aunt?"); asks if she caused it; mother supportive at the bedside', true],
    CARDIOVASCULAR: ['Regular rhythm on the monitor; T waves near normal; pulses 2+; capillary refill under 3 seconds', false],
    RESPIRATORY: ['Normal rate and depth; no fruity breath; lungs clear', false],
    GI: ['Appetite lower after the diagnosis talk but agrees to eat dinner; abdomen soft, nontender', false],
    MOBILITY: ['Calf cramps gone; steady; stand-by assist only for the IV poles', false],
    PAIN_SCORE: ['No pain, 0/10', false],
    IV_SITE: ['Right forearm 20 g: KCl rider finishing; site normal, no redness or swelling. Left forearm 18 g: no redness or swelling; D5W/0.45% sodium chloride and insulin infusing', false],
    ENDOCRINE: ['DKA resolved on the 1730 labs; first subcutaneous basal insulin (glargine) due now; insulin infusion continues to 2100; no signs of low glucose', false],
    LEARNING: ['Anxious, but agrees to try the injection herself with coaching; mother watching closely', true]
  }],
  ['Mon', '23:00', {
    PSYCHOSOCIAL: ['Crying, cannot sleep; "I\'ll never be normal again"; "Will I be able to have kids?"; "I don\'t want people at school to know"; coping by exercise (hallway laps); mother supportive but anxious', true],
    CARDIOVASCULAR: ['Regular rhythm on the monitor; normal T waves; pulses 2+', false],
    GI: ['Ate about 70% of dinner; no nausea; abdomen soft, nontender; declines a snack', false],
    MOBILITY: ['Walking independently, steady; walked fast hallway laps 2215-2255', false],
    FALL_PRECAUTIONS: ['Morse 35 (secondary diagnosis 15, IV/saline lock 20); bed alarm on at night per policy; call light in reach', false],
    IV_SITE: ['Left forearm 18 g and right forearm 20 g: saline locks, flushed, no redness or swelling', false],
    ENDOCRINE: ['Off IV insulin since 2100; glargine at 1900; no signs of low glucose now', false],
    LEARNING: ['Not ready for detailed teaching tonight; asks to "do it tomorrow with my mom"', true]
  }],
  ['Tue', '03:00', {
    NEURO: ['Hard to rouse for a moment, then groggy, irritable and briefly unsure where she is; oriented x4 within a minute; follows commands; speech slow', true],
    PSYCHOSOCIAL: ['Frightened: "I didn\'t even feel it coming"; mother awake and anxious', true],
    CARDIOVASCULAR: ['Sinus tachycardia on the monitor, regular; pulses strong', true],
    SKIN: ['Cool, pale and sweaty (diaphoretic); gown damp', true],
    MOBILITY: ['Shaky; wants to walk to the bathroom alone', true],
    PAIN_SCORE: ['Headache, 2/10', true],
    FALL_PRECAUTIONS: ['Morse 45 (secondary diagnosis 15, IV/saline lock 20, weak/unsteady gait 10) = high fall risk; wants to walk to the bathroom alone while shaky; bed alarm on', true],
    ENDOCRINE: ['Signs of low glucose: confusion and irritability first, then sweating, hunger and headache', true]
  }],
  ['Tue', '07:00', {
    NEURO: ['Alert, oriented x4, rested; follows commands', false],
    PSYCHOSOCIAL: ['Calmer, "ready to learn"; asks her mother to "learn everything too"; does not want a medical ID bracelet ("I don\'t want to advertise it")', true],
    CARDIOVASCULAR: ['Regular rhythm on the monitor; normal T waves; pulses 2+; capillary refill under 2 seconds', false],
    RESPIRATORY: ['Normal breathing; no breath odor; lungs clear', false],
    GI: ['Hungry; abdomen soft, nontender; bowel sounds active', false],
    GU: ['Voiding clear yellow urine; no burning', false],
    SKIN: ['Warm, dry; mucous membranes moist; turgor normal', false],
    MOBILITY: ['Steady and independent', false],
    PAIN_SCORE: ['No pain, 0/10', false],
    FALL_PRECAUTIONS: ['Morse 35; bed alarm off for the day; call light in reach', false],
    IV_SITE: ['Left forearm 18 g and right forearm 20 g: saline locks, patent, no redness or swelling (to be removed before discharge)', false],
    ENDOCRINE: ['Fasting glucose in range; no signs of low glucose since 0335', false],
    LEARNING: ['Engaged; pen practice for breakfast: missed the 2-unit priming shot and the 10-second hold; believes she should skip insulin on sick days', true]
  }]
];
// short flowsheet comment after the 0300 low glucose was treated
const COMMENT_0335 = { NEURO: ['0335 recheck: alert, oriented x4, answers quickly', false], SKIN: ['0335 recheck: skin dry, color returning', false], ENDOCRINE: ['0335 recheck: no signs of low glucose; eating crackers', false] };
function build() {
  const out = [];
  const push = (r, t, val, ab, source) => out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: val, collected: t, source, abnormal: !!ab });
  TIMES.forEach(([d, tm, col]) => { const t = at(d, tm); ROWS.forEach(r => push(r, t, r[col], r[5], col === 3 ? 'ED nursing assessment' : 'Nursing assessment (step-down admission)')); });
  const cur = {}; ROWS.forEach(r => { cur[r[1]] = [r[4], r[5]]; });
  LATER.forEach(([d, tm, ov]) => {
    Object.keys(ov).forEach(k => { if (!cur[k]) throw new Error('unknown assessment code ' + k); cur[k] = ov[k]; });
    const t = at(d, tm);
    ROWS.forEach(r => push(r, t, cur[r[1]][0], cur[r[1]][1], 'Nursing assessment'));
  });
  const t335 = at('Tue', '03:35');
  ROWS.filter(r => COMMENT_0335[r[1]]).forEach(r => push(r, t335, COMMENT_0335[r[1]][0], COMMENT_0335[r[1]][1], 'Nursing assessment (flowsheet comment)'));
  return out;
}
module.exports = { build, ROWS };
if (require.main === module) console.log('assessment rows', build().length);

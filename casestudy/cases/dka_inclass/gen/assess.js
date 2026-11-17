/* In-class DKA patient (Caleb Mercer): nursing assessment flowsheet rows. A NEW full assessment is charted in the ED (0140), at the unit
   arrival (0700) and at EVERY checkpoint (D1 1100, 1500, 1900, 2300, D2 0300, 0700, 1100, 1500, 1900). Rows keep the earlier value unless the
   checkpoint changes them (LATER below). No vital sign numbers appear in the text (the bedside monitor shows them). See ../DESIGN.md section 16. */
const { at, slug } = require('./lib');
// [section, code, label, ED 0140 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'NEURO', 'Neurologic (LOC, Orientation, Pupils)', 'Drowsy; opens eyes to voice; oriented x4 but slow to answer; GCS 15 once awake; pupils equal and reactive', 'Drowsy, opens eyes to voice, oriented x4, slow to answer, follows commands; pupils equal and reactive; no headache', true],
  ['Psychosocial', 'PSYCHOSOCIAL', 'Psychosocial / Coping', 'Sister (Tessa) brought him in; she found him at home about 0100; he is quiet and worried', 'Embarrassed: "I didn\'t want to go low." Sister Tessa at the bedside', true],
  ['Cardiac', 'CARDIOVASCULAR', 'Cardiovascular', 'Sinus tachycardia on the ED monitor; radial pulses 2+ and fast; capillary refill 3 seconds; hands cool', 'Sinus tachycardia on the monitor; radial pulses 2+ and equal; capillary refill 3 seconds; hands cool; no edema', true],
  ['Respiratory', 'RESPIRATORY', 'Respiratory', 'Deep, fast, regular breathing (Kussmaul); fruity (acetone) breath; lungs clear; dry cough; room air', 'Deep, regular, fast breathing (Kussmaul); fruity (acetone) breath; lungs clear; dry cough; no distress on room air', true],
  ['GI', 'GI', 'Gastrointestinal', 'Nauseated; vomited 6-8 times since Sunday about 1000; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive', 'Nauseated; abdomen soft, diffusely tender, no guarding; bowel sounds hypoactive; last emesis 0350; NPO except ice chips', true],
  ['GU', 'GU', 'Genitourinary', 'Urinating large amounts since Saturday; very thirsty', 'Voiding pale yellow urine in a urinal, large amounts', true],
  ['Skin', 'SKIN', 'Skin and Mucous Membranes', 'Face flushed, hands cool; skin dry; turgor poor (tents 3 seconds); lips dry and cracked; tongue dry', 'Warm and flushed centrally (face, trunk), hands cool; dry; turgor poor (tenting 3 seconds); lips dry and cracked; tongue dry', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Musculoskeletal / Mobility', 'Weak, body aches; walked in leaning on his sister', 'Generally weak, body aches; unsteady; stand-by assist', true],
  ['Pain', 'PAIN_SCORE', 'Pain', 'Belly ache and body aches, dull, 6/10', 'Belly and body aches, dull, 4/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Safety / Fall Risk', 'Stretcher low, rails up x2; drowsy and weak', 'Morse 45 (second diagnosis 15, IV 20, weak gait 10) = high fall risk; bed low and locked; bed alarm on; call light in reach', true],
  ['Lines / Drains / Airways', 'IV_SITE', 'IV Site Assessment', 'No IV on arrival; two peripheral IVs to be placed', 'Left forearm 18 g: no redness or swelling; 0.9% sodium chloride and insulin infusing. Right antecubital 20 g: saline lock, flushes easily', false],
  ['Safety', 'ISOLATION', 'Infection Control / Isolation', 'Surgical mask placed on arrival (cough, fever); droplet precautions ordered', 'Droplet precautions; mask for transport; covers cough', false],
  ['Endocrine', 'ENDOCRINE', 'Endocrine / Glucose Management', 'Type 1 diabetes on injections; no long-acting insulin since Friday 2100; meter at home read "HI" Sunday evening', 'Insulin infusion running; no signs of low glucose', true]
];
const TIMES = [['Mon', '01:40', 3], ['Mon', '07:00', 4]];
// later checkpoints: [day, time, {code: [value, abnormal]}]; rows not listed keep their earlier value
const LATER = [
  ['Mon', '11:00', {
    NEURO: ['Awake, alert, oriented x4, answers quickly; follows commands; pupils equal and reactive', false],
    PSYCHOSOCIAL: ['Talking more; asks how long he will stay', false],
    RESPIRATORY: ['Still deep breathing, slower than at 0700; fruity breath less strong; lungs clear; dry cough', true],
    GI: ['Nausea better after vomiting at 0830; abdomen soft, mildly tender; bowel sounds active; asking to drink', true],
    GU: ['Voiding pale yellow urine in the urinal', false],
    SKIN: ['Face less flushed; lips still dry; tongue moist; turgor 2 seconds', true],
    PAIN_SCORE: ['Body aches, 3/10', true],
    IV_SITE: ['Left forearm 18 g: no redness or swelling; 0.9% sodium chloride, D10W and insulin infusing. Right antecubital 20 g: KCl rider infusing; mild ache at the site, no redness or swelling', false],
    ISOLATION: ['Droplet precautions in place; covers cough', false]
  }],
  ['Mon', '15:00', {
    NEURO: ['Alert, oriented x4; says "my legs feel heavy"', true],
    CARDIOVASCULAR: ['Flat T waves, U waves and occasional PVCs on the monitor; pulses 2+; capillary refill under 3 seconds', true],
    RESPIRATORY: ['Breathing less deep, regular; faint fruity breath; lungs clear', true],
    GI: ['Tolerating sugar-free clear liquids; no vomiting since 0830; abdomen soft, nontender', false],
    SKIN: ['Mucous membranes moist; turgor normal; skin warm', false],
    MOBILITY: ['Grip slightly weaker in both hands; calf cramps; stand-by assist', true],
    PAIN_SCORE: ['Calf cramps, 2/10', true],
    IV_SITE: ['Left forearm 18 g: no redness or swelling; 0.9% sodium chloride, D10W and insulin infusing. Right antecubital 20 g: last rider finished 1330; saline lock, patent', false],
    ISOLATION: ['Per active orders; covers cough', false]
  }],
  ['Mon', '19:00', {
    NEURO: ['Awake, alert, oriented x4; answers quickly; follows commands', false],
    PSYCHOSOCIAL: ['Frustrated: "I was getting better and then they stopped my insulin"', true],
    CARDIOVASCULAR: ['No PVCs on the monitor; T waves still low; pulses 2+; capillary refill under 3 seconds', true],
    RESPIRATORY: ['Normal depth, regular; faint fruity breath; lungs clear', false],
    GI: ['Hungry, wants real food; tolerating sugar-free clear liquids; abdomen soft, nontender', false],
    MOBILITY: ['Calf cramps better; grip equal; stand-by assist', false],
    PAIN_SCORE: ['Right elbow burning, 5/10', true],
    IV_SITE: ['Right antecubital 20 g: swollen about 4 cm around the site, cool, pale, taut and tender; burning; KCl rider infusing slowly (infiltration, grade 2). Left forearm 18 g: no redness or swelling; 0.9% sodium chloride and insulin infusing; D10W line off', true],
    ENDOCRINE: ['Insulin infusion running (restarted 1750); dextrose line off since 1500; no signs of low glucose', true]
  }],
  ['Mon', '23:00', {
    PSYCHOSOCIAL: ['Tired and bored; texting his roommate', false],
    RESPIRATORY: ['Normal pattern; faint fruity breath; lungs clear', false],
    GI: ['Hungry; no nausea; abdomen soft, nontender', false],
    MOBILITY: ['Steady with stand-by assist; wants to walk to the bathroom alone', false],
    PAIN_SCORE: ['Mild ache at the old right elbow site, 1/10', true],
    FALL_PRECAUTIONS: ['Morse 45 = high fall risk; bed low and locked; bed alarm on for the night; urinal and call light in reach', true],
    IV_SITE: ['Right forearm 20 g (new, 1915): KCl rider infusing; no redness or swelling; mild burning only. Former right antecubital site: swelling about 2 cm, softer, edges marked, arm on a pillow. Left forearm 18 g: no redness or swelling; 0.9% sodium chloride, D10W and insulin infusing', true],
    ENDOCRINE: ['Insulin infusion and D10W running; no signs of low glucose', false]
  }],
  ['Tue', '03:00', {
    NEURO: ['Awake, anxious, slow to answer, oriented x4; says he feels "foggy"; tremor of both hands', true],
    PSYCHOSOCIAL: ['Anxious; apologizing', true],
    CARDIOVASCULAR: ['Sinus tachycardia on the monitor, regular; pulses strong', true],
    RESPIRATORY: ['Breathing a bit fast, not deep; no fruity breath; lungs clear', false],
    GI: ['Hungry; no nausea', false],
    SKIN: ['Cool, pale and sweaty (diaphoretic)', true],
    MOBILITY: ['Wants to walk to the bathroom with two IV poles; forgets his limits', true],
    PAIN_SCORE: ['Headache, 1/10', true],
    FALL_PRECAUTIONS: ['Found sitting on the edge of the bed with the bed alarm sounding; Morse 60 (second diagnosis 15, IV 20, weak gait 10, forgets limitations 15) = high fall risk', true],
    IV_SITE: ['Left forearm 18 g: D10W tubing disconnected at the Y-site connector; sheet and gown wet on the left side; insulin and 0.9% sodium chloride infusing; site normal. Right forearm 20 g: saline lock, no redness or swelling. Former right antecubital site: swelling smaller, edges marked', true],
    ENDOCRINE: ['Signs of low glucose: shaky, sweaty, hungry, headache', true]
  }],
  ['Tue', '07:00', {
    NEURO: ['Alert, oriented x4, bright; follows commands', false],
    PSYCHOSOCIAL: ['Relieved: "I want to go home today."', false],
    CARDIOVASCULAR: ['Sinus rhythm on the monitor, regular; normal T waves; pulses 2+; capillary refill under 2 seconds', false],
    RESPIRATORY: ['Normal breathing; no fruity breath; occasional dry cough; lungs clear', false],
    GI: ['Hungry; abdomen soft, nontender; bowel sounds active', false],
    GU: ['Voiding clear yellow urine', false],
    SKIN: ['Warm, dry; mucous membranes moist; turgor normal', false],
    MOBILITY: ['Strength 5/5; steady gait with stand-by assist', false],
    PAIN_SCORE: ['No pain, 0/10', false],
    FALL_PRECAUTIONS: ['Morse 35 (IV 20, second diagnosis 15); bed alarm off for the day; call light in reach', false],
    IV_SITE: ['Left forearm 18 g: patent; 0.9% sodium chloride, D10W and insulin infusing. Right forearm 20 g: patent, no redness or swelling. Former right antecubital site: swelling gone, faint bruise', false],
    ENDOCRINE: ['No signs of low glucose', false]
  }],
  ['Tue', '11:00', {
    PSYCHOSOCIAL: ['Engaged and asking questions; plans to take his long-acting insulin "at nine tonight like always"', true],
    CARDIOVASCULAR: ['Regular rhythm on the monitor; normal T waves; pulses 2+', false],
    GI: ['Ate 100% of breakfast; no nausea; bowel sounds active', false],
    MOBILITY: ['Showered; walked the hall twice on his own, steady', false],
    FALL_PRECAUTIONS: ['Up ad lib; Morse 35', false],
    IV_SITE: ['Left forearm 18 g and right forearm 20 g: saline locks, flushed, no redness or swelling', false],
    ENDOCRINE: ['Off IV insulin since 0930; no rebound symptoms (no nausea, normal breathing)', false]
  }],
  ['Tue', '15:00', {
    PSYCHOSOCIAL: ['Partial teach-back of sick-day care; says "If I can\'t eat, I\'ll take half my long-acting"; motivated; sister present', true],
    GI: ['Ate 80% of lunch; no nausea', false],
    MOBILITY: ['Independent', false],
    ENDOCRINE: ['Practicing pen use; chose the wrong pen once (the dose was correct)', true]
  }],
  ['Tue', '19:00', {
    PSYCHOSOCIAL: ['Correct teach-back of the sick-day plan with his sister; states when to call and when to come to the ED; disappointed not to go home tonight but agrees', false],
    GI: ['Ate 90% of dinner; no nausea', false],
    FALL_PRECAUTIONS: ['Low fall risk; bed alarm per night policy', false],
    IV_SITE: ['Right forearm 20 g saline lock: to be removed. Left forearm 18 g saline lock: no redness or swelling', false],
    ENDOCRINE: ['Knows his pens apart; next glargine 0730 tomorrow', false]
  }]
];
// short flowsheet comment after the 0300 low glucose was treated
const COMMENT_0320 = { NEURO: ['0320 recheck: alert, answers quickly; tremor gone', false], SKIN: ['0320 recheck: skin dry, color returning', false], ENDOCRINE: ['0320 recheck: no signs of low glucose', false] };
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
  const t320 = at('Tue', '03:20');
  ROWS.filter(r => COMMENT_0320[r[1]]).forEach(r => push(r, t320, COMMENT_0320[r[1]][0], COMMENT_0320[r[1]][1], 'Nursing assessment (flowsheet comment)'));
  return out;
}
module.exports = { build, ROWS };
if (require.main === module) console.log('assessment rows', build().length);

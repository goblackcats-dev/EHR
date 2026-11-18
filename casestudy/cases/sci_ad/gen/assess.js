/* In-class SCI patient (Wesley Harcourt): nursing assessment flowsheet rows. A NEW full assessment is charted in the ED (D0 2210), at the unit
   arrival (0700) and at EVERY checkpoint (D1 1100, 1500, 1900, 2300, D2 0300, 0700). Rows keep the earlier value unless the checkpoint changes them
   (LATER below). No vital sign numbers appear in the text (the bedside monitor shows them; the instructor says the others aloud). See ../DESIGN.md section 15. */
const { at, slug } = require('./lib');
// [section, code, label, ED 2210 value, unit 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'NEURO', 'Neurologic / Sensory Level', 'Alert, oriented x4. Chronic complete T4 spinal cord injury (2025): no movement or feeling below the nipple line. Says his bladder "has been acting up" since Saturday', 'Alert, oriented x4. Sensory level T4 on both sides: light touch and pinprick normal through T4, absent from T5 down. Arms 5/5 both sides; legs 0/5. Pupils equal and reactive. No headache, no stuffy nose', true],
  ['Cardiac', 'CARDIOVASCULAR', 'Cardiovascular', 'Regular pulse; radial and pedal pulses palpable; legs cool, no edema. States "my normal BP is 95 over 60" (AD wallet card)', 'Regular pulse; radial and pedal pulses palpable; capillary refill under 3 seconds; legs cool, no edema. BP is in his usual low range (baseline on his AD card). Abdominal binder and thigh-high compression stockings on', true],
  ['Respiratory', 'RESPIRATORY', 'Respiratory / Cough', 'Lungs clear; no cough; room air', 'Lungs clear, diminished at the bases; weak cough (T4: abdominal and lower chest muscles do not work); incentive spirometer 1,500 mL; room air', true],
  ['GI', 'GI', 'Gastrointestinal / Bowel Program', 'Abdomen soft, nontender (no feeling below T4); bowel sounds active; last BM Sat 03/06 2100; skipped Sunday evening bowel program (fever)', 'Abdomen soft, not distended; bowel sounds active. Last BM Sat 03/06 2100 (missed Sunday). Home bowel program every evening at 2000 (senna at noon, bisacodyl suppository with lidocaine jelly, digital stimulation). Eating breakfast', true],
  ['GU', 'GU', 'Genitourinary / Urinary Catheter', 'Neurogenic (reflex) bladder; self-catheterizes every 4-6 h at home. Cloudier, foul urine since Saturday; two leaks between caths; more leg spasms. 16 Fr indwelling catheter placed 2200: 450 mL cloudy, foul-smelling urine', '16 Fr indwelling catheter (placed in the ED 2200), 10 mL balloon. Cloudy amber, foul-smelling urine with sediment. Bag below the bladder, off the floor. Tubing NOT yet secured to the thigh', true],
  ['Skin', 'SKIN', 'Skin / Pressure Injury', 'NEW stage 2 pressure injury on the sacrum, 2.0 x 1.5 x 0.1 cm: pink open wound bed, scant clear drainage, no slough, no odor, edges intact. Sat in damp clothes all Sunday without pressure reliefs. Foam dressing applied. Heels and ischia intact', 'Sacrum: stage 2 pressure injury 2.0 x 1.5 x 0.1 cm, pink wound bed, scant serous drainage, no odor; foam dressing intact, dated 03/07. Heels and both ischia intact (old right ischial scar intact). Braden 13 (sensory 1, moisture 3, activity 2, mobility 2, nutrition 3, friction/shear 2) = moderate risk. On a low-air-loss mattress', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Musculoskeletal / Spasticity', 'More leg spasms than usual since Saturday; manual wheelchair user; independent slide-board transfers at home', 'Mild leg spasms (more than usual with the infection). Full arm strength; slide-board transfers with assist in the hospital. Repositioned every 2 h (30-degree side-lying, heels floated)', true],
  ['Pain', 'PAIN_SCORE', 'Pain', 'Shoulders, 2/10 (chronic, from wheelchair use)', 'Shoulders, 2/10 (chronic)', true],
  ['Thermoregulation', 'THERMO', 'Temperature Regulation', 'Chills since Sunday noon; skin warm and dry above T4, cool below; poor sweating below the injury', 'Skin warm and dry above T4, cool and dry below. Poor sweating and poor temperature control below the injury: no cooling blanket; blankets as needed', true],
  ['Psychosocial', 'PSYCHOSOCIAL', 'Psychosocial / Coping', 'Sister Claire Harcourt (emergency contact) at the bedside; tired; "I just feel off"', 'Frustrated: "I lay on an ED stretcher for 9 hours without my cushion." Knows his body well; wants staff to follow his routines. Lives alone; sister Claire nearby', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Safety / Fall Risk', 'Stretcher low, rails up x2; call light in reach', 'Bed low and locked; call light and phone in reach (full hand use). Transfers with assist and a slide board; does not walk. AD wallet card at the bedside', false],
  ['Lines / Drains / Airways', 'IV_SITE', 'IV Site Assessment', 'Left forearm 20 g placed 2200: no redness or swelling; bolus infusing', 'Left forearm 20 g (placed 03/07 2200): no redness, swelling or pain; dressing dry and intact; 0.9% sodium chloride infusing', false],
  ['Education', 'LEARNING', 'Learning Needs / Readiness', 'Not assessed (acutely ill)', 'Experienced with his own care (caths, bowel program, skin checks). Ready to talk about the infection and the new sacral wound', false]
];
const TIMES = [['Sun', '22:10', 3], ['Mon', '07:00', 4]];
// later checkpoints: [day, time, {code: [value, abnormal]}]; rows not listed keep their earlier value
const LATER = [
  ['Mon', '11:00', {
    NEURO: ['Alert, oriented x4; tired after the morning episode. Headache gone. Neuro check normal: arms 5/5, speech clear, pupils equal and reactive. Sensory level T4 unchanged', true],
    CARDIOVASCULAR: ['Flushing above the nipple line and goose bumps below have resolved; legs warm; pulses palpable. Abdominal binder and compression stockings OFF since 0917 (must go back on before he sits up)', true],
    GU: ['Catheter now secured to the left thigh with a securement device (0930); tubing straight, no kinks, no dependent loops; bag below the bladder and off the floor. Urine cloudy amber, less sediment; draining freely', true],
    THERMO: ['Skin warm and dry above T4, no sweating now; cool below. Afebrile to touch', true],
    PSYCHOSOCIAL: ['Shaken: "That was the worst one yet." Embarrassed that he did not feel it sooner. Asks staff to check the tubing every time they turn him', true],
    PAIN_SCORE: ['No pain, 0/10 (headache gone)', false],
    IV_SITE: ['Left forearm 20 g: saline-locked at 1100 per order; flushes easily, no redness or swelling', false]
  }],
  ['Mon', '15:00', {
    CARDIOVASCULAR: ['Lightheaded and "vision going dim" when sat up at physical therapy 1345 without the binder and stockings; resolved when reclined with legs up. Tolerated sitting with the binder snug, stockings on and the head of the bed raised slowly. Pulses palpable', true],
    SKIN: ['NEW: right ischium blanchable redness after 45 minutes in a hospital wheelchair without his own cushion; faded in 20 minutes. Sacral stage 2 unchanged; foam dressing intact (wound nurse 1215). Heels intact. Braden 13', true],
    RESPIRATORY: ['Lungs clear, diminished at the bases; weak cough; incentive spirometer 1,600 mL', true],
    GU: ['Catheter secured to the thigh; tubing straight; urine clearer, yellow; draining freely', false],
    PSYCHOSOCIAL: ['Calmer; worried about missing work ("I can\'t miss a week")', true],
    PAIN_SCORE: ['No pain, 0/10', false],
    IV_SITE: ['Left forearm 20 g: saline lock, flushed at 1300, no redness or swelling', false]
  }],
  ['Mon', '19:00', {
    GU: ['Indwelling catheter in place, secured, draining clear yellow urine. Removal criteria in the catheter order are MET: no fever without acetaminophen since before 1030 (last dose 0430), IV fluids off since 1100, hourly output not needed; physiatry recommends removal tonight and intermittent catheterization every 4 h (keep under 500 mL)', true],
    SKIN: ['Right ischium normal again. Sitting on his own air-cell cushion (sister brought it 1600) in his own wheelchair; pressure reliefs every 15 minutes. Sacrum unchanged', false],
    GI: ['Abdomen slightly full, soft; bowel sounds active. No BM since Sat 2100 (2 days): bowel program due 2000 (lidocaine jelly first)', true],
    PSYCHOSOCIAL: ['Relieved; sister Claire at the bedside', false]
  }],
  ['Mon', '23:00', {
    GI: ['Bowel program 2000-2050: large soft-formed stool. During digital stimulation at 2020: mild headache and goose bumps with a BP rise above his baseline; care paused, more lidocaine jelly, waited 5 minutes; symptoms gone in about 6 minutes; finished slowly with no more symptoms', true],
    GU: ['Indwelling catheter out. Intermittent catheterization at 2200 (self, with set-up): 380 mL clear yellow urine. Next due about 0200', false],
    MOBILITY: ['Fewer leg spasms. Back in bed, turned every 2 h, heels floated', false],
    PSYCHOSOCIAL: ['Tired; proud that he "caught it early" during bowel care', false]
  }],
  ['Tue', '03:00', {
    RESPIRATORY: ['A few crackles at the right base that clear after an assisted (quad) cough and 10 incentive spirometer breaths; room air', true],
    THERMO: ['Cool to touch below and above T4 while asleep; extra blanket added and the room warmed', true],
    GU: ['Intermittent catheterization 0200: 420 mL clear yellow urine. No leaking between caths', false],
    SKIN: ['Turned every 2 h (0100 right, 0300 left), 30-degree tilt; sacral dressing intact; heels and ischia intact', true],
    PSYCHOSOCIAL: ['Awake at 0300, worried about missing work and about his apartment; talked it through; settled', true]
  }],
  ['Tue', '07:00', {
    RESPIRATORY: ['Lungs clear; incentive spirometer 1,750 mL; weak but effective cough with assist', false],
    THERMO: ['Warm and dry above T4, cool below (his usual)', false],
    GU: ['Intermittent catheterization 0600: 460 mL (close to the 500 mL limit). Clear yellow urine', true],
    SKIN: ['Sacral foam dressing intact, edges sealed, no drainage through it (next change Wed 03/10, day 3; last measured 1215 by the wound nurse: 2.0 x 1.5 x 0.1 cm). Heels and ischia intact. Braden 13', true],
    PSYCHOSOCIAL: ['Ready to learn; wants to go home today', false],
    LEARNING: ['Teach-back: names his AD signs (stuffy nose, then headache), keeps his AD card with him, catheterization on time (every 4 h, under 500 mL), tubing and skin checks; asks about spacing the new antibiotic from his vitamin D', false],
    IV_SITE: ['Left forearm 20 g saline lock: no redness or swelling; keep until the first oral antibiotic dose is tolerated', false]
  }]
];
function build() {
  const out = [];
  const push = (r, t, val, ab, source) => out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: val, collected: t, source, abnormal: !!ab });
  TIMES.forEach(([d, tm, col]) => { const t = at(d, tm); ROWS.forEach(r => push(r, t, r[col], r[5], col === 3 ? 'ED nursing assessment' : 'Nursing assessment (4 West admission)')); });
  const cur = {}; ROWS.forEach(r => { cur[r[1]] = [r[4], r[5]]; });
  LATER.forEach(([d, tm, ov]) => {
    Object.keys(ov).forEach(k => { if (!cur[k]) throw new Error('unknown assessment code ' + k); cur[k] = ov[k]; });
    const t = at(d, tm);
    ROWS.forEach(r => push(r, t, cur[r[1]][0], cur[r[1]][1], 'Nursing assessment'));
  });
  return out;
}
module.exports = { build, ROWS };
if (require.main === module) console.log('assessment rows', build().length);

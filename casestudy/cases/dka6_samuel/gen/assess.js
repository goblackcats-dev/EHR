/* DKA patient 6 (Samuel Okafor): baseline nursing assessment flowsheet rows (ED 0130 and step-down arrival 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0130 value, step-down 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Alert and oriented x4; anxious and tired', 'Alert and oriented x4; tired, slow to answer; follows commands', true],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, fast (Kussmaul) respirations 26/min; lungs clear, no crackles; fruity breath odor', 'Respirations 20/min, slightly deep; lungs clear bilaterally, no crackles; no accessory muscle use', true],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia on the monitor; 12-lead ECG at 0140', 'Sinus rhythm with frequent unifocal PVCs (6 to 8 per minute), flattened T waves, prominent U waves and 1.0 mm ST depression V4-V6 on the monitor', true],
  ['Cardiac', 'CHEST_DISCOMFORT', 'Chest / Epigastric Discomfort', 'Dull persistent epigastric ache 4/10 for 36 hours with heavy fatigue and sweating; no radiation; took six calcium carbonate tablets without relief', 'Epigastric ache 1/10; no chest pressure, arm or jaw pain; no shortness of breath', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 3 seconds; dry mucous membranes; skin warm and flushed', 'Under 3 seconds; peripheral pulses 2+; no JVD; no peripheral edema', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Nausea since the morning before and two episodes of bilious vomiting; vomited about 150 mL at 0135', 'Nausea resolved since the ondansetron; no vomiting since 0135', true],
  ['GI', 'DIET', 'Diet / Intake', 'Almost no food or fluid since the day before; not eating solid food', 'Sugar-free clear liquids as tolerated until the diet order changes (see Orders); no solid food yet', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Polyuria and thirst; voiding into a urinal; no dysuria', 'Voiding into a urinal, every void measured (1,350 mL in the ED); urine pale yellow', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mucous membranes; reduced skin turgor', 'Mucous membranes slightly dry; mild calf cramping; no edema', true],
  ['Skin', 'IV_SITES', 'IV Sites', 'Two 18-gauge peripheral IVs placed in the ED: left forearm and right antecubital', 'IV A left forearm 18 g (carrier fluid and insulin; potassium riders later, each on its own pump channel); IV B right antecubital 18 g (heparin infusion alone); both patent, no redness or swelling. No central line', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '80.0 kg measured (dosing weight for every weight-based dose); usual dry weight 83.5 kg; height 178 cm; BMI 25.2', '80.0 kg (bed scale, same as the ED). Daily weight at 0700, same scale', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Walked in with his wife; independent', 'Bedrest with bedside commode on Day 1 (order); continuous telemetry', false],
  ['Pain', 'PAIN_SCORE', 'Pain Score', 'Epigastric ache 4/10', 'Epigastric ache 1/10', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Safety', 'Stretcher low, rails up x2', 'Standard fall precautions; bleeding precautions on heparin (soft toothbrush, electric razor, no intramuscular injections, no NSAIDs, no aspirin beyond the ordered dose); call light within reach', false],
  ['Psychosocial', 'TOBACCO', 'Tobacco', 'Smokes 1 pack per day for 25 years; first cigarette within 30 minutes of waking; last cigarette about 0030 before coming in', 'No nicotine since about 0030; no withdrawal yet', true],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Wife Grace (emergency contact) at the bedside; daughter Maya (12) and son David (9) at home with a neighbor; city bus driver for 11 years', 'Wife Grace at the bedside; worried about missing work and about his commercial driver license', true],
  ['Psychosocial', 'KNOWLEDGE', 'Insulin and Illness Knowledge', 'Thought the ache was heartburn or a stomach bug; skipped his lispro and his bedtime glargine because he was nauseated and not eating, believing insulin without food is dangerous', 'Has not connected the stomach ache with his heart; asks whether this is "just my stomach and my sugar"', true]
];
const TIMES = [['Mon', '01:30', 3], ['Mon', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: r[col], collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment (step-down arrival)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);

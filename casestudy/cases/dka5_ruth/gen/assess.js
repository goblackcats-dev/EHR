/* DKA patient 5 (Ruth Nakamura): baseline nursing assessment flowsheet rows (ED 0100 and ICU arrival 0700 ONLY).
   Assessments after 0700 are done by the students at the bedside (the instructor portrays the findings, see INSTRUCTOR_NOTES.md). */
const { at, slug } = require('./lib');
// [section, code, label, ED 0100 value, ICU 0700 value, abnormal]
const ROWS = [
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', 'Awake but drowsy and inattentive; GCS 14', 'Awake, weak and distractible; follows one-step commands; protects her airway', true],
  ['Neurologic', 'ORIENTATION', 'Orientation', 'Oriented to person and place, not to date', 'Oriented to person and place only; cannot sustain attention to questions about the date', true],
  ['Neurologic', 'DELIRIUM_SCREEN', 'Delirium Screen (CAM-ICU)', 'Acute change in mental status (confused on the telephone with her daughter at 0030); inattention present', 'CAM-ICU positive (acute change, inattention, disorganized thinking); no focal deficit', true],
  ['Respiratory', 'RESPIRATORY_PATTERN', 'Respiratory Pattern', 'Deep, fast respirations 28/min; lungs clear, no crackles', 'Still deep respirations, 24/min; no accessory muscle use; lungs clear', true],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', 'Room air', 'Room air', false],
  ['Cardiac', 'RHYTHM', 'Rhythm', 'Sinus tachycardia on the monitor; 12-lead at 0115', 'Sinus tachycardia; mild T-wave flattening with small U waves on the monitor', true],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', 'About 4 seconds; dry mucous membranes', 'Under 3 seconds after the fluid resuscitation', true],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', 'Nausea and one episode of vomiting at 1800 the evening before; vomited about 150 mL at 0112', 'Nausea much better since ondansetron; no further vomiting', true],
  ['GI', 'DIET', 'Diet / Intake', 'Little food or fluid since the day before', 'NPO except essential medicines and supervised mouth care; aspiration screen before any oral intake', true],
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', 'Dysuria and frequency for 2 days; right costovertebral-angle tenderness; clean-catch specimen at 0118; no catheter', 'Voiding with assistance into the collection hat; no catheter; measured every void (700 mL in the ED); urine cloudy', true],
  ['Skin', 'SKIN_TURGOR', 'Skin Turgor / Mucous Membranes', 'Dry mucous membranes; skin turgor reduced', 'Mucous membranes less dry; no edema', true],
  ['Skin', 'IV_SITES', 'IV Sites', 'Peripheral IV placed in the ED', 'Three peripheral IVs: A right forearm 20 g (insulin only), B left forearm 20 g (lactated Ringer\'s / D10W), C left antecubital 18 g (potassium, magnesium, antibiotic); all patent, no redness or swelling. No central line or arterial catheter', false],
  ['Musculoskeletal / Mobility', 'WEIGHT', 'Weight', '60.0 kg measured (dosing weight for every weight-based dose); usual weight 62.0 kg; height 165 cm; BMI 22.0', '60.0 kg (bed scale, same as the ED). Daily weight at 0700, same scale', true],
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', 'Independent at home before this illness; walked in with her daughter\'s support', 'Nurse-assisted mobility and toileting only; mild distal sensory neuropathy in both feet', true],
  ['Pain', 'PAIN_SCORE', 'Pain Score', 'Right flank discomfort 4/10', 'Right flank ache 3/10 (verbal rating, reliable only in short answers)', true],
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', 'Stretcher low, rails up x2', 'HIGH fall risk (delirium, age 67, neuropathy, three IV lines, insulin infusion): bed low with the bed alarm on, call light within reach, non-slip footwear, tubing cleared, hourly rounding, no unassisted bathroom trips; glasses and hearing aids in place', false],
  ['Psychosocial', 'SUPPORT', 'Family / Support', 'Daughter Emi Tanaka found her confused and brought her in; Emi is the designated health-care agent if Ruth loses capacity and may receive updates', 'Widowed retired librarian who lives alone with her cat, Miso; Emi lives 10 minutes away and visits often. Worried about Miso and tries to get up to feed him', true],
  ['Psychosocial', 'KNOWLEDGE', 'Insulin, Ketone and Medicine Knowledge', 'Checked her glucose (198 at 1800) and assumed she could not have DKA; started empagliflozin 10 mg in September from an outside prescriber for glucose and weight; no blood-ketone meter at home; CGM receiver connection lost two days ago', 'Cannot give a reliable history while confused; the history comes from Emi', true]
];
const TIMES = [['Thu', '01:00', 3], ['Thu', '07:00', 4]];
function build() {
  const out = [];
  TIMES.forEach(([d, tm, col]) => {
    const t = at(d, tm);
    ROWS.forEach(r => { out.push({ id: `assessment_${slug(r[0])}_${slug(r[1])}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: r[0], code: r[1], label: r[2], value: r[col], collected: t, source: col === 3 ? 'ED nursing assessment' : 'Nursing assessment (ICU arrival)', abnormal: !!r[5] }); });
  });
  return out;
}
module.exports = { build };
if (require.main === module) console.log('assessment rows', build().length);

/* Burn ICU patient: nursing assessment flowsheet rows (full assessment every 4 h; right-hand neurovascular check hourly then every 2 h). */
const { H, hOf, slug } = require('./lib');
const P = require('./physiology');

const T = (d, t) => hOf(d, t);
const inf0 = T('Tue', '13:00'), inf1 = T('Tue', '14:00'), recog = T('Tue', '15:30'), shockOn = T('Tue', '17:15'), peak = T('Tue', '19:30'), pressOff = T('Wed', '04:30'), ext = P.T_EXTUBATE;
const feedsAt = h => P.state(h).feeds;

// each row: [section, code, label, fn(h, s) -> [value, abnormal] | null]
const ROWS = [
  // ---------------- Neurologic
  ['Neurologic', 'LEVEL_OF_CONSCIOUSNESS', 'Level of Consciousness', (h, s) => h < T('Wed', '08:00') ? [s.rass <= -3 ? 'Deeply sedated, responds to pain and voice only' : 'Sedated, arouses to voice', true] : h < T('Wed', '12:00') ? ['Awake, calm, follows commands (extubated 10:45)', false] : ['Alert, drowsy at times', false]],
  ['Neurologic', 'RASS', 'RASS (Richmond Agitation-Sedation Scale)', (h, s) => [`${s.rass > 0 ? '+' : ''}${s.rass} ${s.rass <= -4 ? 'Deep sedation' : s.rass === -3 ? 'Moderate sedation' : s.rass === -2 ? 'Light sedation' : s.rass === -1 ? 'Drowsy' : s.rass === 0 ? 'Alert and calm' : 'Restless'}`, s.rass < -2 && h >= T('Tue', '12:00')]],
  ['Neurologic', 'PUPILS', 'Pupils', (h, s) => [h < T('Mon', '09:00') ? '4 mm, equal, brisk; sluggish briskness not noted' : '3 mm, equal, round, reactive to light (brisk)', false]],
  ['Neurologic', 'CAM_ICU', 'CAM-ICU', (h, s) => (s.rass <= -4 ? null : [h < T('Tue', '07:30') ? 'Unable to assess (RASS -3)' : 'Negative', false])],
  ['Neurologic', 'FOLLOWS_COMMANDS', 'Motor / Follows Commands', (h, s) => [h < T('Tue', '08:00') ? 'Moves left side to pain; does not follow commands (sedation)' : h < T('Wed', '08:00') ? 'Follows simple commands with left hand when sedation lightened; right hand splinted' : 'Follows commands, moves all extremities; right hand limited by splint and dressings', false]],
  ['Neurologic', 'PERIPHERAL_SENSATION', 'Peripheral Sensation', (h, s) => [h < T('Wed', '08:00') ? 'Left hand sensation not testable (sedated); right hand decreased in burned area' : 'Left hand intact; right fingertips: light touch present', h < T('Wed', '08:00')]],
  // ---------------- Respiratory
  ['Respiratory', 'RESPIRATORY_EFFORT', 'Respiratory Effort', (h, s) => [s.extub ? (h < T('Wed', '14:00') ? 'Mild increased effort, hoarse voice, no stridor' : 'Unlabored') : (s.rr > s.rrSet + 4 ? 'Triggering ventilator above set rate, using accessory muscles' : 'Synchronous with ventilator'), s.extub ? h < T('Wed', '14:00') : s.rr > s.rrSet + 4]],
  ['Respiratory', 'BREATH_SOUNDS', 'Breath Sounds', (h, s) => [h < T('Mon', '09:00') ? 'Coarse bilaterally with scattered wheeze, sooty secretions' : h >= T('Tue', '17:00') && h < T('Wed', '09:00') ? 'Coarse rhonchi bilaterally, diminished right base' : s.extub ? 'Clear with diminished bases' : 'Coarse bilaterally, clear after suctioning', h < T('Mon', '09:00') || (h >= T('Tue', '17:00') && h < T('Wed', '09:00'))]],
  ['Respiratory', 'COUGH', 'Cough / Secretions', (h, s) => [s.extub ? (h < T('Wed', '16:00') ? 'Weak productive cough; tan secretions' : 'Strong productive cough, small white secretions') : (h < T('Mon', '09:00') ? 'Moderate black-tinged sooty secretions via ETT' : h >= T('Tue', '13:00') && h < T('Wed', '09:00') ? 'Thick tan secretions, moderate, suctioned q1-2h' : 'Small to moderate thin white secretions'), h < T('Mon', '09:00') || (h >= T('Tue', '13:00') && h < T('Wed', '09:00'))]],
  ['Respiratory', 'OXYGEN_DEVICE', 'Oxygen Device', (h, s) => [s.extub ? (h < T('Wed', '16:00') ? 'Nasal cannula 4 L/min' : h < T('Thu', '03:00') ? 'Nasal cannula 2 L/min' : 'Room air') : `Ventilator, AC/VC FiO2 ${Math.round(s.fio2 * 100)}% PEEP ${s.peep}`, false]],
  ['Respiratory', 'VENT_SETTINGS', 'Ventilator Settings', (h, s) => (s.extub ? null : [`AC/VC VT ${s.vt} mL, set RR ${s.rrSet}, PEEP ${s.peep}, FiO2 ${Math.round(s.fio2 * 100)}%`, false])],
  ['Respiratory', 'VENT_PRESSURES', 'Peak / Plateau Pressure', (h, s) => (s.extub ? null : [`PIP ${Math.round(s.pip)} / Pplat ${Math.round(s.plat)} cmH2O`, s.pip > 30])],
  ['Respiratory', 'ETT', 'Airway / ETT Position', (h, s) => (s.extub ? null : ['8.0 oral ETT 24 cm at the teeth, cuff pressure 24 cmH2O, holder secure, HOB 30 degrees', false])],
  ['Respiratory', 'SPUTUM_PROTOCOL', 'Inhalation Injury Protocol / Oral Care', (h, s) => (s.extub ? null : [`Neb treatments given per MAR; chlorhexidine oral care ${(h % 12) < 4 ? 'done this shift' : 'scheduled'}; HOB 30 degrees`, false])],
  ['Respiratory', 'INCENTIVE_SPIROMETRY', 'Incentive Spirometry', (h, s) => (s.extub ? [h < T('Wed', '16:00') ? '500 mL x10, hourly while awake, coaching' : '1,000 mL x10, hourly while awake', false] : null)],
  // ---------------- Cardiac
  ['Cardiac', 'RHYTHM', 'Rhythm', (h, s) => [s.hr > 100 ? (s.hr > 120 ? 'Sinus tachycardia, no ectopy' : 'Sinus tachycardia') : 'Normal sinus rhythm', s.hr > 100]],
  ['Cardiac', 'HEART_SOUNDS', 'Heart Sounds', (h, s) => ['S1 S2 regular, no murmur, rub or gallop', false]],
  ['Cardiac', 'CAPILLARY_REFILL', 'Capillary Refill', (h, s) => [h >= shockOn && h < pressOff ? 'Left hand 3 seconds, feet cool; right hand 3 seconds (splinted)' : 'Left hand under 2 seconds; right hand 3 seconds (swelling, splinted)', h >= shockOn && h < pressOff]],
  ['Cardiac', 'PERIPHERAL_PULSES', 'Peripheral Pulses', (h, s) => ['Left radial: arterial line waveform; left pedal 2+; right radial and ulnar: Doppler signals present, biphasic; right pedal 2+', false]],
  ['Cardiac', 'EDEMA', 'Edema', (h, s) => [h < T('Mon', '10:00') ? 'Mild facial edema' : h < T('Tue', '12:00') ? 'Generalized edema 2+ (face, hands, legs); facial swelling peak' : h < T('Wed', '12:00') ? 'Generalized edema 2-3+' : 'Generalized edema 1-2+, decreasing', true]],
  ['Cardiac', 'HEMODYNAMICS', 'Hemodynamic Support', (h, s) => [s.norepi > 0 ? `Norepinephrine ${s.norepi} mcg/kg/min via central line, MAP goal 65 or higher` : s.dexmed > 0 ? `Dexmedetomidine ${s.dexmed} mcg/kg/h` : 'No vasoactive infusions', s.norepi > 0]],
  ['Cardiac', 'DAILY_WEIGHT', 'Daily Weight', (h, s) => (h === 0 ? ['82.0 kg (bed scale, ED)', false] : h === 24 ? ['89.6 kg (bed scale)', true] : h === 48 ? ['91.2 kg (bed scale)', true] : h === 72 ? ['89.8 kg (bed scale)', true] : null)],
  // ---------------- GI
  ['GI', 'ABDOMEN', 'Abdomen', (h, s) => [h < T('Mon', '18:00') ? 'Soft, non-tender, mildly distended; bladder pressure 10 mmHg' : h < T('Wed', '04:00') ? 'Soft, mildly distended, non-tender; bladder pressure 11-13 mmHg (goal under 15)' : 'Soft, non-distended, non-tender', h < T('Wed', '04:00')]],
  ['GI', 'BOWEL_SOUNDS', 'Bowel Sounds', (h, s) => [h < T('Mon', '16:00') ? 'Hypoactive' : 'Present x4', h < T('Mon', '16:00')]],
  ['GI', 'DIET', 'Diet / Feeding', (h, s) => [h < T('Mon', '10:00') ? 'NPO. OG tube to gravity; trophic feeds ordered to start 10:00' : h < ext ? `Osmolite 1.5 at ${feedsAt(h)} mL/h via OG; HOB 30 degrees; residual under 100 mL` : h < T('Wed', '16:00') ? 'NPO pending swallow screen (passed 16:00)' : h < T('Wed', '18:00') ? 'Swallow screen passed' : 'Soft diet with high-protein supplements, ate 50% of dinner', false]],
  ['GI', 'NAUSEA', 'Nausea / Vomiting', (h, s) => [h >= T('Wed', '12:00') && h < T('Wed', '16:00') ? 'Nausea after extubation, relieved by ondansetron 12:30' : 'None', h >= T('Wed', '12:00') && h < T('Wed', '16:00')]],
  ['GI', 'LAST_BM', 'Bowel Movement', (h, s) => (h % 12 === 0 ? [h < T('Wed', '02:00') ? 'No stool yet' : 'Loose brown stool x1 (220 mL) at 02:00 Wed, tube feeding related; senna held', h >= T('Wed', '02:00')] : null)],
  // ---------------- GU
  ['GU', 'URINARY_ELIMINATION', 'Urinary Elimination', (h, s) => [h < P.T_FOLEY_OUT ? 'Foley catheter (16 Fr with temperature probe) draining to hourly urimeter' : 'Foley removed 05:00; to void within 6 hours', false]],
  ['GU', 'URINE_OUTPUT', 'Urine Output (last hour)', (h, s) => (h < P.T_FOLEY_OUT ? [`${Math.round(s.uop)} mL/h (${(s.uop / 82).toFixed(2)} mL/kg/h)`, s.uop < 30 || s.uop > 100] : null)],
  ['GU', 'URINE_APPEARANCE', 'Urine Appearance', (h, s) => [h < T('Mon', '12:00') ? 'Dark amber, clear' : h < T('Tue', '12:00') ? 'Amber, clear' : h >= T('Tue', '16:00') && h < T('Wed', '02:00') ? 'Dark yellow, concentrated, clear' : 'Pale yellow, clear', h < T('Mon', '12:00') || (h >= T('Tue', '16:00') && h < T('Wed', '02:00'))]],
  // ---------------- Skin
  ['Skin', 'BURN_RIGHT_ARM', 'Burn - Right Arm', (h, s) => [h < inf1 ? 'Circumferential: forearm/hand full thickness (leathery, white-tan, insensate), upper arm deep partial (mottled red, blanching slowly). Escharotomy incisions at mid-medial and mid-lateral forearm/hand clean, minimal oozing. Silver sulfadiazine, elevated, splint on' : h < T('Wed', '12:00') ? 'Escharotomy sites with new purulent drainage; foul odor; erythema extends beyond burn margin (marked); mafenide soaks q8h' : 'Escharotomy sites draining scant serosanguineous; erythema margin receding from the mark; mafenide soaks continue', h >= inf1 && h < T('Wed', '12:00')]],
  ['Skin', 'BURN_CHEST', 'Burn - Anterior Chest', (h, s) => [h < inf1 ? 'Deep partial thickness with scattered full-thickness patches; pink-white, weeping; silver sulfadiazine; chest expansion not restricted' : h < T('Wed', '12:00') ? 'Dark violaceous area at the right chest border, eschar separating, purulent drainage, erythema beyond margin (marked); mafenide soaks' : 'Eschar edges clean, scant drainage, erythema margin receding', h >= inf1 && h < T('Wed', '12:00')]],
  ['Skin', 'BURN_FACE', 'Burn - Face / Neck', (h, s) => ['Superficial to superficial-partial: red, moist, blistering; facial edema; singed nasal hairs; bacitracin; eyes lubricated, corneas clear', false]],
  ['Skin', 'WOUND_DRAINAGE', 'Wound Drainage / Odor', (h, s) => [h < inf0 ? 'Scant serous, no odor' : h < inf1 ? 'Increased serous drainage, no odor' : h < T('Wed', '12:00') ? 'Moderate purulent, green-yellow, foul odor' : 'Scant serosanguineous, no odor', h >= inf0 && h < T('Wed', '12:00')]],
  ['Skin', 'BRADEN', 'Braden Score', (h, s) => (h % 12 === 0 ? [h < T('Wed', '08:00') ? '11 (high risk): sedated, bed rest, moisture' : '14 (moderate risk)', true] : null)],
  ['Skin', 'SKIN', 'Skin (unburned areas)', (h, s) => ['Warm, dry, intact over sacrum, heels, left arm, back and legs; pressure points padded; low air loss mattress', false]],
  // ---------------- Musculoskeletal / Mobility
  ['Musculoskeletal / Mobility', 'MOBILITY', 'Mobility', (h, s) => [h < T('Wed', '15:00') ? 'Bed rest, turned side to side q2h with 3 staff, HOB 30 degrees' : h < T('Thu', '00:00') ? 'Dangled then up to chair with 2 assist and PT/OT (15:20), tolerated 45 minutes' : 'Bed rest with 2-assist turns, up to chair tomorrow', false]],
  ['Musculoskeletal / Mobility', 'RIGHT_HAND_SPLINT', 'Right Hand Splint / Position', (h, s) => ['Splint in position of function (wrist slightly extended, MCP flexed 70-90 degrees), elevated above heart level on pillows, fingertips visible', false]],
  ['Musculoskeletal / Mobility', 'ROM', 'Range of Motion', (h, s) => [h < T('Wed', '08:00') ? 'Passive ROM left arm and both legs by PT/nursing; right shoulder only, hand per OT' : 'Active ROM left side; assisted right shoulder/elbow, finger motion with OT', false]],
  // ---------------- Pain
  ['Pain', 'PAIN_SCORE', 'Pain Score', (h, s) => [s.extub ? `${h < T('Wed', '20:00') ? (Math.abs(h - T('Wed', '14:00')) < 1.1 ? 6 : 4) : 3}/10 (numeric)` : `CPOT ${s.cpot}/8`, (s.extub ? false : s.cpot >= 3) || (s.extub && h < T('Wed', '16:00'))]],
  ['Pain', 'PAIN_LOCATION', 'Pain Location', (h, s) => [h < T('Wed', '08:00') ? 'Burn sites (right arm, chest, face) with grimace and guarding at dressing changes' : 'Right arm and chest burn sites, burning with mafenide soaks', false]],
  ['Pain', 'PAIN_INTERVENTION', 'Pain Intervention', (h, s) => [s.extub ? 'Acetaminophen scheduled, hydromorphone before dressing changes, oxycodone PRN after swallow screen' : `Fentanyl ${s.fentanyl} mcg/h, propofol ${s.propofol} mcg/kg/min; hydromorphone 0.5 mg IV before dressing change; scheduled acetaminophen IV`, false]],
  // ---------------- Safety
  ['Safety', 'FALL_PRECAUTIONS', 'Fall Precautions', (h, s) => [h < ext ? 'Bed low, rails up x2, call light not usable (sedated), 2-person turns' : 'Bed low, call light in reach, assist x2, non-skid socks, bed alarm', false]],
  ['Safety', 'RESTRAINTS', 'Restraint', (h, s) => (h < ext ? ['Soft left wrist restraint for ETT/line protection; skin intact, 2 fingers fit, circulation intact; order renewed daily', false] : null)],
  ['Safety', 'PRECAUTIONS', 'Precautions', (h, s) => ['Contact precautions (burn unit). Aspiration: HOB 30+ degrees' + (s.extub && h < T('Wed', '16:00') ? '; NPO until swallow screen' : ''), false]],
  ['Safety', 'DIABETES_CARE', 'Glucose Management', (h, s) => [s.insulin > 0 ? `Insulin infusion ${s.insulin} units/h, glucose hourly (goal 140-180)` : h >= T('Wed', '12:00') ? 'Lispro correction scale per order, glucose q6h' : 'Glucose q6h, no insulin yet', s.insulin >= 3]],
  ['Safety', 'VAP_BUNDLE', 'Line / Infection Bundle', (h, s) => ['Central line site: chlorhexidine dressing intact, no erythema; hubs scrubbed; daily necessity reviewed. ' + (s.extub ? '' : 'VAP bundle met.'), false]]
];

function build() {
  const out = [];
  const add = (sect, code, label, value, abn, h, source) => {
    const t = H(h);
    out.push({ id: `assessment_${slug(sect)}_${slug(code)}_${t.replace(/[- :]/g, '_')}`, type: 'assessment', section: sect, code, label, value, collected: t, source: source || 'Nursing assessment', abnormal: !!abn });
  };
  for (let h = 0; h <= 72; h += 4) {
    const s = P.state(h + 0.01);
    ROWS.forEach(([sect, code, label, fn]) => { const r = fn(h, s); if (r) add(sect, code, label, r[0], r[1], h + (['Neurologic', 'Pain'].includes(sect) ? 0 : 0.1)); });
  }
  // intermediate checks that matter: neurovascular hourly 24 h, then q2h; weights; infection findings
  for (let h = 0; h <= 48; h += (h < 24 ? 1 : 2)) {
    const fail = false;
    const t = H(h);
    const pulse = h < 1 ? 'Doppler signals present but faint after release; cap refill 3 s; fingers warm and pink; forearm swollen but compartments compressible; patient sedated so pain/sensation unable to assess' : h < 24 ? 'Doppler radial and ulnar signals biphasic; cap refill 3 s; fingers warm; forearm compartments soft/compressible; swelling stable' : 'Doppler signals biphasic; cap refill 2-3 s; fingers warm; forearm soft; edema decreasing';
    add('Musculoskeletal / Mobility', 'RIGHT_HAND_NEUROVASCULAR', 'Right Hand Neurovascular / Doppler Check', pulse, h < 1, h + 0.25, 'Neurovascular check');
  }
  [[T('Tue', '14:30'), 'Wound margin', 'Erythema margin marked with skin marker at the right chest and right upper arm border (4 cm beyond burn edge)', true], [T('Tue', '19:30'), 'Wound margin', 'Erythema has progressed 1-2 cm past the marked line at the right chest', true], [T('Wed', '04:00'), 'Wound margin', 'Erythema now at the marked line, no further spread', false], [T('Wed', '16:00'), 'Wound margin', 'Erythema 1 cm inside the marked line (receding)', false]].forEach(([h, lab, v, a]) => add('Skin', 'WOUND_MARGIN', lab, v, a, h, 'Wound care'));
  return out;
}
module.exports = { build, ROWS };
if (require.main === module) { const a = build(); console.log('assessment rows', a.length); }

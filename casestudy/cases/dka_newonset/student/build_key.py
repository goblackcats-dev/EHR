#!/usr/bin/env python3
"""Builds the INSTRUCTOR KEY (Word + Markdown) for the Nora Whitcombe team case study (new-onset type 1 diabetes in DKA).   python3 build_key.py
Writes ../INSTRUCTOR_CASESTUDY_KEY.docx and ../INSTRUCTOR_CASESTUDY_KEY.md"""
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from dx import *
import content2 as C
from monvals import MON, MID, UO

OUT = os.path.join(HERE, '..')
MD = []
def md(s=''): MD.append(s)
def plain(t): return re.sub(r'\*\*(.+?)\*\*', r'\1', t)
def filled(t): return re.sub(r'\[\[(.+?)\]\]', r'**[\1]**', t)   # situation blanks with the answers shown

# what the instructor says as the provider after the team's SBAR call (INSTRUCTOR_GUIDE part H; the orders and notes that follow each call in the chart)
PROVIDER = {
 1: '(Dr. A. Petrakis, day hospitalist, 0715) "Agreed. Her pH is 7.24; we only give bicarbonate under 7.0. Discontinue it. Continue the protocol." (Students discontinue the order with the reason; the addendum appears at 0730.)',
 2: '(Dr. Petrakis, about 1105) "Good, she meets the criteria. I\'m putting in sugar-free clear liquids now. Keep the insulin at 5.5 and the D5 at 150; next labs at 1330. Tell her mom the drip stays on until the acid is cleared, not until the sugar is normal."',
 3: '(Dr. Petrakis, 1510) "You\'re right, she only has peripheral lines. Discontinue my order. Run the protocol riders, ten an hour, four in a row, and keep the insulin going." (Order stops 1510; addendum at 1520.)',
 4: '(Dr. C. Navarro, endocrinology) "Yes: glargine 14 now, keep the drip and the D5 running until 2100, then saline-lock both IVs. Lispro 4 with the tray, no correction at 168. Labs at 2200 and 0200 to make sure there\'s no rebound."',
 5: '(Dr. D. Rasmussen, night hospitalist) "No rebound, good. No sleep medicine for now; try the non-drug measures. Offer the snack again and keep the 0300 check. Call me for anything under 70."',
 6: '(Dr. Rasmussen, called 0305, reply 0320) "Repeat the 15 grams, snack once she is 70 or more, recheck at 0400, no correction insulin. Endocrinology will adjust the doses in the morning." (Order "POC glucose once at 0400" appears at 0320.)',
 7: '(Dr. Navarro, morning rounds) "Thanks for catching the pen and the sick-day mix-up. After last night\'s low I\'m lowering her glargine to 12 units tonight at 1900 and writing an exercise plan: check before and after a run, carry 15 grams, snack if under 150, check at 0300 after an evening workout. She goes home this evening only if the teach-back, the glucagon teaching for her mom and the supplies are done."'}

# portrayal cues for the instructor (INSTRUCTOR_GUIDE part D)
PORTRAY = {
 1: 'Head of the bed up 30 degrees, curled on her side, arm over her belly; eyes half closed; slow to answer but oriented. **Breathe deep, fast and regular and do not slow down.** "I\'m so thirsty... can I please just have water?" / "I\'ve been peeing all the time for weeks." / "Is this diabetes? Like, the needle kind?" / weight: "I lost like 13 pounds. I thought it was the gym." **Kendall** (leaves 0730): "She was on the bathroom floor... her breath smelled like nail polish remover." / "She\'s been drinking those big sports drinks all day for weeks."',
 2: 'Sitting up, more color, breathing slower but still a bit deep, licking dry lips, texting her mom. "Please, can I drink something? Anything." / "Why are you giving me sugar? I thought sugar was the problem." / "My arm aches a little where that bag goes in." **Julia** (speakerphone, from the car): "Her sugar is almost normal, so can they take her off the insulin?"',
 3: 'Sitting up, rubbing her calves; breathing nearly normal; teary with relief since her mother came. "My legs feel heavy, and my calves keep cramping." / "Why do I need more potassium? You just gave me some." / "Is my heart okay? What are those lines on the screen?" **Julia** (winter coat, travel bag; a teacher who writes things down): "Can\'t you give it all at once so she\'s done faster?"',
 4: 'Puffy red eyes, tissues, holding the glargine pen and staring at it. "So this is forever? Every single day?" / "Did I do this to myself with all those sports drinks?" / "Can\'t I just fix it with diet like my aunt?" / "Okay... show me again. I don\'t want to do it wrong." / "Why can\'t you just take the IV out now?" **Julia:** "We\'ll learn it together, honey." / "Is the drip coming out now that she has the shot?"',
 5: 'Lying on her side in the dim room, hair damp at the temples, sneakers by the bed, phone lit, red eyes. Speak quietly; open up only if the nurse sits down and asks open questions; shut down at false reassurance. "I looked it up... it says people with type 1 die younger." / "Will I even be able to have kids?" / "I\'ll never be normal again." / "Running is the only thing that clears my head." / "Can we do the lessons tomorrow?" / snack: "I\'m not hungry, I just want to sleep." **Julia** (recliner): "I\'m scared to sleep. What if she goes low?"',
 6: 'In the dark: slow to open her eyes, confused for a moment, then irritable, sweaty, pale. "What... leave me alone, I\'m sleeping... where am I?" then "Oh. The hospital. I feel really weird... foggy." After the tablets: "I need to pee. I can walk, I\'m fine" (she is shaky). After the juice: "That was scary. I didn\'t even feel it coming." / "Was it because I walked so much?" / "What do I do if this happens at my apartment?" **Julia:** "Is she okay? Should I get someone?" Give **58**, then **66** at 0317, then **94** at 0333; show the 0335 mid row (HR 90, BP 118/72, RR 16).',
 7: 'In the chair in her own sweatshirt, good color, holding the lispro pen; Julia leaning in. "Okay, four units, then I just pull it out, right?" / "If I\'m sick, I\'ll just skip it so I don\'t go low, right?" / "Do I really have to wear a bracelet? Can it be on my phone?" / "When can I go home?" / "Mom, you have to learn the emergency shot thing." **Julia:** "Teach me everything too. I\'m staying with her for a week." Weight **56.2 kg**; glucose **118** (0400), **122** (0700).'}

MAP_KEY = ['No insulin of her own (new type 1 likely): ED glucose 562 (548 bedside), 274 at 0700; hunger with a 6.0 kg loss (61.0 to 55.0 kg): fat and muscle burned for fuel; tired, blurry vision.',
           'Weeks of thirst and urinating; UA glucose 4+, SG 1.032; ED urine 1,350 mL; dry cracked lips, dry furrowed tongue, tenting 3 s, eyes sunken, HR 106 (126 in the ED), cap refill 3 s; BUN 24 / creatinine 1.3 (prerenal).',
           'BHB 6.8 then 5.4; gap 30 then 23; pH 7.14 then 7.24; CO2 7 then 10; UA ketones large; Kussmaul RR 24 deep (30 in the ED) with pCO2 22 (compensation); fruity breath; nausea, vomiting, belly pain.',
           'K 5.8 in the ED with peaked T waves V2-V4 (ECG 0205) while the body total is low; 4.7 at 0530 after insulin started (shift back in); T waves still slightly tall; protocol rider due 0715.']


def H(d, text, size=12, before=6, color=INK, level=2):
    P(d, text, size=size, bold=True, color=color, before=before, after=2, keep=True)
    md(('#' * level) + ' ' + plain(text)); md()


def para(d, text, size=9.6, after=3):
    P(d, text, size=size, after=after); md(plain(text)); md()


def bl(d, items, size=9.6):
    bullets(d, items, size=size)
    for i in items: md('- ' + plain(i))
    md()


def table(d, header, ws, rows, size=8.8, row_h=0.26, hfill='E4E4E4', center=None, fills=None, bold_first=False):
    grid(d, header, ws, rows, row_h=row_h, size=size, hsize=8.4, hfill=hfill, center=center, fills=fills, bold_first=bold_first, keep=False)
    md('| ' + ' | '.join(header) + ' |'); md('|' + '---|' * len(header))
    for r in rows: md('| ' + ' | '.join(plain(str(x)).replace('\n', ' ').replace('|', '/') for x in r) + ' |')
    md()


def title_page(d):
    banner(d, 'INSTRUCTOR KEY: NORA WHITCOMBE TEAM CASE STUDY', 'about 2 hours', fill=INK, size=14, h=0.45)
    md('# Instructor Key: Nora Whitcombe Team Case Study (new-onset type 1 diabetes in DKA)'); md()
    H(d, 'What this is', level=2)
    para(d, 'A 2-hour team case study. The whole class (designed for 7 students) works as ONE team and cares for Nora Whitcombe (22, college student, new-onset type 1 diabetes presenting in moderate-to-severe DKA) across 24 hours of patient time, **Mon 0700 to Tue 0700**. The class advances **4 hours together** (0700, 1100, 1500, 1900, 2300, 0300, then a final check at 0700), **about 14 minutes per stop (12 at 2300, 20 for the two-page final check)**. The packet is 12 pages: cover (with the quick pathophysiology), patient card with a DKA map and two EHR screenshots, the rubric with a **response tracker**, one page per checkpoint, two final pages (evaluation, then teaching and discharge) and an individual reflection.')
    para(d, '**Focus (Ignatavicius 11e, NCSBN clinical judgment model):** recognize the cues of DKA (Kussmaul breathing, fruity breath, dehydration), the textbook priorities in order (fluids, insulin with a known potassium, potassium and electrolytes, monitoring), "dextrose up, never insulin off", the potassium shift on insulin, the resolution criteria and the overlap transition, the emotional side of a new diagnosis, the first low glucose, and survival-skills teaching by teach-back. **Two planted order errors** (bicarbonate at 0700; KCl 20 mEq/h through a peripheral IV at 1500) and **one order to discontinue** (NPO at 1100).')
    para(d, '**NEW: Quick Checks (teach, not grade).** Every checkpoint page has 2-3 NCLEX-style questions on that stop\'s **big idea**, each labelled with its clinical judgment step. Students answer on their own during the stop. **You reveal the answers at the END of each stop** with the one-line "why" and the tempting wrong answer (below, per stop). Students correct in a different color and tick "Corrected". Scoring is for **completion and correction, never for being right**.')
    H(d, 'Roles and pairs (7 students, one team)', level=2)
    bl(d, ['**Charge nurse** (rotates; each student has exactly one stop): runs the section, keeps time, **gets the findings from each pair when the pair is finished**, decides the top 3 priorities (writes their name in that box), then develops and gives the SBAR. The "questions a strong charge nurse asks" below are NOT printed for students; use them only if a team is stuck.',
           '**Meds and Orders pair:** MAR, drips and riders, orders and notes: what is running, due, held or should change, and why.',
           '**Vitals & Assessment pair:** the bedside monitor and the vitals row, breathing, mouth and skin, mental status, intake and output, IV sites. **Fills the response tracker column at every stop.**',
           '**Results & Labs pair:** new labs (gap, BHB, gas, potassium, glucose), ECG, trends and what they mean.',
           'The **Vitals & Assessment** and **Meds and Orders** pairs work together on "Actions to suggest" at every stop. **Pairs switch jobs at every checkpoint**: 1 charge nurse + 3 pairs; the old charge nurse takes the new charge nurse\'s place in that pair. Every student has their own packet.'])
    H(d, 'Before class', level=2)
    bl(d, ['Print **one packet per student** (7), single-sided. Each student writes their name in the header; the last page is their individual reflection and peer check. Bring a second pen color (or tell students to).',
           'Load the EHR: Pre-Built Patients > Case Study Patients > Nora Whitcombe (or Import casestudy/cases/dka_newonset/patient.json). Check that the clock reads **Mon 07:00** (SD-6, SIM-40602).',
           'Open the bedside monitor on a second computer (Class session > Monitor code); it loads Nora\'s built-in scenario by MRN (header **SD-6 WHITCOMBE, NORA 22 F**) and follows the 4h button. It has a **mid row at Tue 0335** for after the low is treated.',
           '**There are no vital signs or bedside glucoses in the chart after 0700.** You give the bedside glucoses aloud (listed in each stop below). **A new nursing assessment is charted at every checkpoint** and a new lab set is resulted before every stop. The 0600 Tuesday weight (56.2 kg) is on the I&O record; say it aloud too.',
           'Students can discontinue an order: Orders > select the order > **Discontinue this order** (with a reason). They need it for **NPO at 1100** and for the two planted orders once the provider agrees.',
           'Optional props: two IV poles and pumps, a pharmacy "sodium bicarbonate 100 mEq" bag and a "potassium chloride 20 mEq/100 mL" bag (never hung), KCl 10 mEq riders, glargine and lispro pens with different label colors, glucose tablets, 4 oz juice, crackers and peanut butter, a glucagon trainer, ketone strips.'])
    H(d, 'Rules that protect the pacing', level=2)
    bl(d, ['Students finish a page at the **end** of its time block. Nothing on a later page is printed on an earlier one (checked by check_facts.py). Quick Check answers are never printed in the student packet (also checked).',
           'Every number in this key matches the chart (patient.json), the instructor guide and the monitor. If the team and the key disagree, check the chart.',
           'Answers can differ from the model. Look for chart numbers and a reason, not exact wording.'])


def run_of_show(d):
    page_top(d)
    H(d, 'Run of show (about 2 hours: about 14 minutes per stop, 12 at 2300, 20 for the final check)', size=14, before=0, level=2)
    para(d, 'Each checkpoint follows the same rhythm: read, pairs work (Quick Check answered on their own), SBAR, then the **Quick Check reveal at the end of the stop**.', after=1)
    table(d, ['Clock', 'Minutes', 'What the instructor does'], [0.9, 1.0, 5.4], [
        ['Start', '0:00-0:05', 'Welcome. One team; pick the 0700 charge nurse and assign the three pair jobs (they switch every stop). Read the quick pathophysiology together. Walk through the patient card and DKA map (page 2), the rubric and the response tracker (page 3). Explain the Quick Check: learning, not points.'],
        ['0700', '0:05-0:19', 'Do NOT press 4h (the 0700 set is in the chart). Read the situation. Watch for the **bicarbonate** (hold and call), the newest K (rider 0715) and the 0.45% change. The team also fills the DKA map. SBAR warm-up (not scored). Reveal Quick Check 1.'],
        ['1100', '0:19-0:33', 'Press **4h**. Give glucoses 0800 222, 0900 204, 1000 192, 1100 186. Watch for "dextrose up, never insulin off" and the **NPO discontinuation** by protocol. Reveal Quick Check 2.'],
        ['1500', '0:33-0:47', 'Press **4h**. Watch for the **KCl 20 mEq/h** order (hold and call), insulin kept at K 3.6, MgSO4. Reveal Quick Check 3.'],
        ['1900', '0:47-1:01', 'Press **4h**. DKA resolved; glargine 1900 with the drip on until 2100 (the overlap). Grief and denial. Reveal Quick Check 4.'],
        ['2300', '1:01-1:13 (12 min; lighter stop, no lab math)', 'Press **4h**. Therapeutic communication, readiness to learn, the snack and the 0300 check. Reveal Quick Check 5.'],
        ['0300', '1:13-1:27', 'Press **4h**. Glucose **58**: 15 g by mouth, 66 at 0317, repeat, 94 at 0333, snack. Show the 0335 monitor row. Reveal Quick Check 6.'],
        ['Final 0700', '1:27-1:47 (20 min)', 'Press **4h**. Two pages: let the pairs finish final page 2 in parallel (Meds and Orders: home insulin plan; Vitals & Assessment: survival skills and medical ID; Results & Labs: sick-day and low-glucose boxes) while the charge nurse writes the handoff. Page 1: pairs, Quick Check, tracker, evaluation table and verdict. Page 2: handoff, insulin plan, survival skills, sick-day rules, rule of 15 and glucagon, medical ID, teach-back, readiness. Reveal Quick Check 7.'],
        ['Reflection', '1:47-1:52', 'Each student completes their own reflection and peer check (page 12). Collect the 7 packets.'],
        ['Debrief', '1:52-2:00', '8 minutes: return to the **7 big ideas** (debrief page) and pick 4-5 questions. Put the trends on the board. If time is short, assign the DKA map as pre-class work.']], size=8.5, row_h=0.24)
    H(d, 'The same 14 minutes, one checkpoint', size=11, level=3)
    table(d, ['Minute', 'What happens'], [1.0, 6.3], [
        ['+0 to +2', 'Press 4h (not at the first 0700). Check the monitor moved. Read the situation aloud. Remind them the charge nurse changed.'],
        ['+2 to +9', 'Everyone fills the situation blanks. Pairs work the chart, the monitor and "Nora", write in their box with their names, and report to the charge nurse when finished. Each student answers the Quick Check on their own. Say the glucoses aloud when asked. Vitals & Assessment fills the tracker column.'],
        ['+9 to +11', 'The charge nurse decides the top 3 priorities, then gives you the SBAR. Answer as the provider (suggested reply below).'],
        ['+11 to +14', '**Quick Check reveal:** read each answer and its one-line why; name the tempting wrong answer and why it tempts. Students correct in a different color and tick the box. Say the **big idea** once, then advance.']], size=8.5, row_h=0.22)
    H(d, 'Monitor and bedside values at a glance', size=11, level=3)
    rows = []
    for n in range(1, 8):
        m = MON[n]
        rows.append([m['clock'], m['temp'], m['hr'], f"{m['bp']} ({m['map']})", m['rr'], m['spo2'].replace(' room air', ' RA'), m['pain'].split(' ')[0], m['rhythm'], m['glucose']])
    rows.append([MID['clock'] + ' (mid)', '97.9', MID['hr'], MID['bp'], MID['rr'], '98% RA', '-', 'Sinus rhythm', '94 at 0333'])
    table(d, ['Stop', 'T', 'HR', 'BP (MAP)', 'RR', 'SpO2', 'Pain', 'Rhythm', 'Glucose (say aloud)'], [0.7, 0.4, 0.35, 0.75, 0.9, 0.55, 0.4, 1.55, 1.7], rows, size=7.0, row_h=0.2)
    H(d, 'The seven big ideas (one per stop)', size=11, level=3)
    table(d, ['Stop', 'Big idea', 'Clinical judgment step'], [0.8, 4.6, 1.9],
          [[MON[i]['clock'], C.BIG_SHORT[i - 1], (C.CP[i] if i <= 6 else C.CLOSE)['cj']] for i in range(1, 8)], size=8.2, row_h=0.26)


def vit_text(m):
    return f"HR {m['hr']}, BP {m['bp']} (MAP {m['map']}), RR {m['rr']}, SpO2 {m['spo2']}, temp {m['temp']}, pain {m['pain']}; rhythm: {m['rhythm']}. **Bedside glucose (aloud):** {m['aloud']}"


def lab_tables(d, labs):
    for lb in labs:
        cols = ['Test', 'Normal'] + lb['times']
        rows = [[C.SHORT.get(nm, nm), C.NORMAL[nm]] + v for nm, v in lb['rows']]
        nt = len(lb['times'])
        table(d, cols, [2.0, 1.9] + [(7.3 - 3.9) / nt] * nt, rows, size=8.4, row_h=0.21, center=list(range(2, len(cols))))


def qc_key(d, cp):
    H(d, 'Quick Check: answers to reveal at the END of the stop (students correct in a different color)', size=10.5, before=4, level=3)
    rows = []
    for i, q in enumerate(cp['qc'], 1):
        if q['kind'] == 'fill':
            ans = q['ans']
        else:
            ans = f"**{', '.join(q['ok'])}** ({'; '.join(q['opts'][ord(x) - 65] for x in q['ok'])}). " + q['ans']
        rows.append([f"{i}. {q['step']}", f"**Q:** {q['q']}  **Answer:** {ans}  **Why:** {q['why']}  **Tempting wrong answer:** {q['wrong']}  **Textbook topic:** {q['topic']}"])
    table(d, ['Question', 'Answer, why, the tempting wrong answer, textbook topic'], [1.2, 6.1], rows, size=8.2, row_h=0.3, bold_first=True)


def answers(d, n, cp, label):
    page_top(d)
    H(d, f'{cp["time"]} {cp["day"]}: {label}', size=14, before=0, level=2)
    k = cp['key']
    para(d, f'**Big idea:** {cp["big"]}  **Clinical judgment step:** {cp["cj"]}.', size=9)
    para(d, '**Monitor (the NOW row):** ' + vit_text(MON[n]), size=8.8)
    para(d, '**Urine and I&O for the Vitals pair:** ' + UO[n], size=8.6)
    para(d, '**Portray:** ' + PORTRAY[n], size=8.6)
    para(d, '**Situation (blanks with answers in brackets):** ' + ' '.join(filled(x) for x in cp['sit']), size=8.6)
    para(d, '**Questions a strong charge nurse asks (not printed for students; prompt only if stuck):** ' + ' '.join(f'**{a}:** ' + b for a, b in (('Meds and Orders', cp['ask']['M']), ('Vitals & Assessment', cp['ask']['A']), ('Results & Labs', cp['ask']['R']))), size=8.4)
    H(d, 'New results (chart values)', size=10.5, before=2, level=3)
    lab_tables(d, cp['labs'])
    rows = [['MEDS AND ORDERS pair', k['meds']], ['VITALS & ASSESSMENT pair', k['noticed']], ['RESULTS & LABS pair: new results and significance', k['results']],
            ['Response tracker column (Vitals & Assessment pair)', k['track'].replace(' | ', ';  ')]]
    if n != 1: rows.append(['What changed since the last stop', k['changed']])
    rows += [['Actions to suggest (Vitals & Assessment + Meds and Orders)', k['nxt']],
             ['TEAM (charge): top 3 priorities', '1) ' + k['pri'][0] + '  2) ' + k['pri'][1] + '  3) ' + k['pri'][2]],
             ['TEAM (charge): SBAR' + (' (warm-up, not scored)' if n == 1 else ''), f'**S:** {k["S"]}  **B:** {k["B"]}  **A:** {k["A"]}  **R:** {k["R"]}']]
    if 'pred' in k: rows.append(['Prediction (no wrong answers)', k['pred']])
    rows.append(['Charge nurse notes', 'Look for: each pair reported, the charge nurse decided, a time check. Credit any honest notes.'])
    table(d, ['Box', 'Model answer and rationale'], [1.7, 5.6], rows, size=8.5, row_h=0.26, bold_first=True)
    if n == 1:
        H(d, 'DKA map (page 2): model answers for "What Nora shows"', size=10.5, before=2, level=3)
        table(d, ['Row', 'What Nora shows'], [1.7, 5.6], [[h, s] for (h, _), s in zip(C.MAP, MAP_KEY)], size=8.5, row_h=0.26, bold_first=True)
    para(d, '**Instructor as the provider (suggested reply):** ' + PROVIDER[n], size=9)
    qc_key(d, cp)


def final_pages(d):
    cp = dict(C.CLOSE)
    answers(d, 7, cp, 'Final check (page 1 of 2)')
    k = cp['key']
    H(d, 'Evaluation table (final page 1): model', size=10.5, before=4, level=3)
    table(d, ['Criterion', 'Goal', 'At arrival (Mon 0700)', 'Now (Tue 0700)', 'Met?'], [1.3, 1.9, 1.6, 1.6, 0.9], [list(e) for e in C.EVAL], size=8.2, row_h=0.24, bold_first=True)
    para(d, '**Verdict (model):** The DKA treatment worked: ketoacidosis resolved Monday 1730 (BHB 0.5, pH 7.34, CO2 18) with no rebound after the drip (BHB 0.2, gap 12, CO2 24 now), potassium kept in range without ever holding insulin, kidneys back to normal (creatinine 0.7), breathing and mental status normal, eating. **Not finished:** a low of 58 at 0300 (dose review), and the survival skills are not yet shown by teach-back (pen technique, sick-day rules).', size=9)
    page_top(d)
    H(d, 'Final page 2: teaching and discharge (model answers)', size=14, before=0, level=2)
    table(d, ['Box', 'Model answer'], [1.7, 5.6], [
        ['What changed, actions, priorities, handoff SBAR', 'Use the final-check rows on the previous page.'],
        ['Meds pair: her insulin plan at home', 'Glargine once daily at 1900 (14 units now; endocrinology lowers it to 12 units after the low); lispro 4 units 0-15 minutes before each meal plus correction 1 unit per 50 over 150 (before meals); new needle and prime 2 units every time; pens in use at room temperature, spares in the fridge; never share pens; sharps container. Supplies: pens, pen needles, meter, strips, lancets, ketone strips, glucagon, glucose tablets.'],
        ['Survival skills, sick-day rules, rule of 15 and glucagon, medical ID', k['teach']],
        ['Teach-back question', 'For example: "You wake up with a stomach bug and can\'t keep breakfast down. Tell me what you do with your insulin and what you check." (Model: take the glargine as usual; check glucose and ketones every 2-4 h; sugar-free fluids every hour, carbohydrate fluids if not eating; call for moderate ketones, vomiting or glucose over 300 twice; ED for vomiting with ketones, fast breathing or belly pain.) Ask Julia: "Show me how you would give the glucagon."'],
        ['Is she ready to go home?', k['ready']],
        ['The story of the stay (for the debrief)', k['story']]], size=8.5, row_h=0.28, bold_first=True)
    H(d, 'Response tracker: the whole model (page 3)', size=11, level=3)
    heads = ['Measure'] + ['Mon 0700', 'Mon 1100', 'Mon 1500', 'Mon 1900', 'Mon 2300', 'Tue 0300', 'Tue 0700']
    cols = [C.CP[i]['key']['track'].split(' | ') for i in range(1, 7)] + [C.CLOSE['key']['track'].split(' | ')]
    rows = [[C.TRACKER[r][0]] + [c[r] for c in cols] for r in range(len(C.TRACKER))]
    table(d, heads, [1.0] + [6.3 / 7] * 7, rows, size=7.0, row_h=0.24, bold_first=True)


def textbook(d):
    page_top(d)
    H(d, 'Textbook (Ignatavicius 11e) vs the 2024 consensus: for the instructor', size=14, before=0, level=2)
    para(d, 'The chart follows the **2024 ADA/EASD/JBDS/AACE/DTS hyperglycemic crises consensus**. Where students may have read an older number (the textbook often reflects the 2009 ADA algorithm), Nora\'s values pass under **both**, so no Quick Check answer changes. Decide before class which number you will say aloud, and verify the textbook values against your copy.', size=9)
    table(d, ['Topic', '2024 consensus (the chart)', 'What textbooks commonly teach', "Nora's values", 'Does the class answer change?'], [1.35, 1.6, 1.6, 1.45, 1.3],
          [list(r) for r in C.TEXTBOOK], size=8.0, row_h=0.3, bold_first=True)
    para(d, '**Quick Checks that touch a textbook difference:** stop 2 Q1 (some textbooks lower the insulin when dextrose starts; the stem names Nora\'s dextrose table, which keeps 5.5 units/h); stop 3 Q3 (K threshold: "continue insulin" is right under both 3.5 and 3.3); stop 4 Q1 (resolution: 1730 passes and 1330 fails under both rules; it also touches the gap: some texts list a normal gap as a resolution sign, so the stem now names the order\'s rule); stop 4 Q2 (overlap: 2 h meets both); stop 6 (15 g vs 15-20 g).', size=9)


def rubric_guide(d):
    page_top(d)
    H(d, 'Scoring guide (20 points, three levels)', size=14, before=0, level=2)
    para(d, 'Give ONE group score from the packets (group score sheet, next page) plus an individual check (/4) for each of the 7 students. Be generous: complete and thoughtful earns full credit. **Quick Checks are scored for completion and correction, never for correctness:** a wrong answer that was corrected in a different color earns full credit.')
    rows = [[r['cat'] + f'  ({r["pts"]})', plain(r['full']), plain(r['good']), plain(r['start'])] for r in C.RUBRIC]
    table(d, ['Category', 'Full credit', 'Good', 'Getting there'], [1.6, 2.1, 1.8, 1.8], rows, size=8.2, row_h=0.6, bold_first=True)
    H(d, 'How the points add up', size=11, level=3)
    table(d, ['Category', 'Where the points come from'], [2.3, 5.0], [[r['cat'] + f' ({r["pts"]})', r['how']] for r in C.RUBRIC], size=8.4, row_h=0.3)
    H(d, 'Examples', size=11, level=3)
    table(d, ['Category', 'Example of full credit', 'Example of partial credit'], [1.6, 3.0, 2.7], [
        ['Clinical thinking (1500)', 'Results box: "K 5.8, 4.7, 4.1, 3.6 on insulin = shift into cells + urine loss; 3.6 is over 3.5, keep insulin; Mg 1.7 replace; pH 7.32 but BHB 1.3 = not resolved." Quick Check: picked "hang it on a pump", then corrected to "hold and call" in green with the reason.', '"K low. Give potassium." (no numbers, no reason): half. Quick Check blank or not corrected: no Quick Check half point.'],
        ['Safety and SBAR (1500)', 'Priorities: hold the 20 mEq/h order and call; riders 10 mEq/h x 4 with insulin continued; site and urine checks. SBAR with all 4 parts and a clear request.', 'Hangs the 20 mEq bag, or holds the insulin at K 3.6: 0 for that stop (discuss in the debrief).'],
        ['Safety and SBAR (0300)', '"15 g by mouth, recheck in 15 minutes, repeat at 66, snack at 94; no correction insulin; assist to the bathroom; call per protocol."', 'D50 IV for a patient who can swallow, or the snack at 66.'],
        ['Completeness', 'Tracker filled at all 7 stops, every Quick Check ticked "corrected", the evaluation table done with arrival and now values and a verdict.', 'Tracker missing 3 stops: lose the tracker point.']], size=8.2, row_h=0.4, bold_first=True)
    H(d, 'Reflection and peer check', size=11, level=3)
    bl(d, ['Reflection (4 boxes, including "a Quick Check I got wrong"): 2 points on the individual sheet for honest answers with a reason (1 if thin). It also feeds the group "reflections handed in" point.',
           'Peer check: 1 point for handing it in. Use it to spot a team where one person did most of the work; read comments privately.',
           'If the team did not rotate the charge nurse, cap Teamwork at 3 and ask why in the debrief.'])


def score_sheet(d):
    page_top(d)
    H(d, 'GROUP SCORE SHEET', size=14, before=0, level=2)
    P(d, 'Team name: ______________________________   Date: ____________   (one group score, then 7 individual checks)', size=9.4, after=4)
    md('Team name: ____________  Date: ________'); md()
    H(d, 'Checkpoint check (tick what you see)', size=11, level=3)
    cols = ['Page', 'Charge nurse named', 'Pair boxes with numbers', 'Quick Check done + corrected', '3 priorities', 'SBAR complete', 'Tracker column']
    rows = [[x] + ['☐'] * 6 for x in ('0700 (SBAR warm-up)', '1100', '1500', '1900', '2300', '0300')] + [['Final 0700', '☐', '☐', '☐', '☐', '☐', 'Evaluation ☐']]
    table(d, cols, [1.3, 1.0, 1.1, 1.1, 0.9, 0.9, 1.0], rows, size=9.0, row_h=0.26, center=list(range(1, 7)))
    H(d, 'Rubric', size=11, level=3)
    cols = ['Category', 'Full', 'Good', 'Getting there', 'Points', 'Notes']
    rows = [['Teamwork and charge-nurse rotation (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Clinical thinking at each checkpoint, incl. Quick Checks done and corrected (6)', '☐ 6', '☐ 4-5', '☐ 1-3', '/ 6', ''],
            ['Safety, priorities and SBAR (5)', '☐ 5', '☐ 3-4', '☐ 1-2', '/ 5', ''], ['Completeness and reflection (4)', '☐ 4', '☐ 2-3', '☐ 1', '/ 4', ''], ['GROUP TOTAL', '', '', '', '/ 20', '']]
    table(d, cols, [2.3, 0.6, 0.7, 0.9, 0.7, 2.1], rows, size=8.8, row_h=0.4, center=[1, 2, 3, 4])
    H(d, 'Individual check (7 students)', size=11, level=3)
    table(d, ['Student', 'Charge turn (1)', 'Reflection (2)', 'Peer check (1)', 'Individual /4'], [2.1, 1.2, 1.3, 1.2, 1.5],
          [['________________________', '☐', '☐ 2  ☐ 1', '☐', ''] for _ in range(7)], size=9, row_h=0.3, center=[1, 2, 3])
    P(d, 'Comments for the team:', size=9.4, bold=True, after=1, before=3)
    lines(d, 2)


def debrief(d):
    page_top(d)
    H(d, 'Debrief: back to the seven big ideas (about 8 minutes; pick 4 to 5 questions)', size=14, before=0, level=2)
    para(d, 'Put the trends on the board first: K ' + ', '.join(v for _, v in C.TIMELINE_K) + '; gap ' + ', '.join(v for _, v in C.TIMELINE_GAP) + '; BHB ' + ', '.join(v for _, v in C.TIMELINE_BHB) + '; pH 7.14, 7.24, 7.29, 7.32, 7.34; RR 24, 20, 18, 18, 18, 18, 14; bedside glucose 274, 186, 166, 168, 148, 58 (66, 94), 122.', size=9)
    H(d, 'The seven big ideas (say each one again)', size=11, level=3)
    table(d, ['Stop', 'Big idea'], [0.8, 6.5], [[MON[i]['clock'], C.BIG_SHORT[i - 1]] for i in range(1, 8)], size=8.6, row_h=0.26)
    H(d, 'Questions', size=11, level=3)
    rows = [[str(i), topic, q] for i, (topic, q) in enumerate(C.DEBRIEF, 1)]
    table(d, ['#', 'Big idea', 'Question'], [0.35, 1.1, 5.85], rows, size=8.8, row_h=0.36, center=[0])
    H(d, 'Ideas for good answers', size=11, level=3)
    bl(d, C.DEBRIEF_IDEAS, size=8.8)
    H(d, 'Instructor only', size=11, level=3)
    bl(d, ['On Friday 02/12 the antibodies return **GAD65 positive (210 IU/mL, reference under 5) and IA-2 positive; ZnT8 negative**: autoimmune type 1 diabetes (stage 3). Use it with final Quick Check 3 (the antibodies are still pending at 0700).',
           'Of the 6 kg she lost, about 3.5 kg was water and about 2.5 kg fat and muscle (no insulin = the body burns fat and protein). Weight 55.0 to 56.2 kg by Tue 0600.',
           'Answer keys live in the public repository (a known risk): do not share this file with students.'], size=8.8)


def build():
    d = new_doc('INSTRUCTOR KEY (not for students)', 'Nora Whitcombe Team Case Study  |  Page', 'Instructor copy. Every number matches the chart (patient.json), the instructor guide and the monitor.', top=0.62, bottom=0.45)
    title_page(d); run_of_show(d)
    for n in range(1, 7): answers(d, n, C.CP[n], C.CP[n]['title'])
    final_pages(d)
    textbook(d); rubric_guide(d); score_sheet(d); debrief(d)
    d.save(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.docx'))
    open(os.path.join(OUT, 'INSTRUCTOR_CASESTUDY_KEY.md'), 'w').write('\n'.join(MD) + '\n')
    print('key written')


if __name__ == '__main__':
    build()

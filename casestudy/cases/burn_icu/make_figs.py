#!/usr/bin/env python3
"""Draws the graphs used in the case study packet from the patient file (what the student would see on the Vitals graph / I&O page).  python3 make_figs.py"""
import json, datetime as dt
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

c = json.load(open('patient.json'))['canonical']
obs = c['observations']
P = lambda s: dt.datetime.strptime(s, '%Y-%m-%d %H:%M')
def vit(code, t0, t1, conv=float):
    out = []
    for o in obs:
        if o['type'] == 'vital' and o['code'] == code and t0 <= o['collected'] <= t1:
            out.append((P(o['collected']), o['value']))
    return sorted(out)
def num(v): return float(str(v).split()[0])
def mapof(v): s, d = [float(x) for x in v.split('/')]; return round((s + 2 * d) / 3, 1)
plt.rcParams.update({'font.size': 9, 'axes.grid': True, 'grid.alpha': .35, 'font.family': 'DejaVu Sans'})
def hours(ax, t0, t1, step=1):
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=step)); ax.xaxis.set_major_formatter(mdates.DateFormatter('%H%M')); ax.set_xlim(P(t0), P(t1))

# ---- Shift 3: infection trend (Tue 0700-1900)
t0, t1 = '2026-11-03 07:00', '2026-11-03 19:00'
fig, ax = plt.subplots(3, 1, figsize=(7, 5.6), sharex=True)
T = vit('TEMP', t0, t1); H = vit('HR', t0, t1); B = vit('BP', t0, t1)
ax[0].plot([a for a, _ in T], [num(v) for _, v in T], 'o-', color='black', ms=3.5); ax[0].set_ylabel('Temperature (F)\\n(bladder)'.replace('\\n', '\n')); ax[0].axhline(100.4, ls=':', color='gray'); ax[0].text(P(t0), 100.5, '100.4 F', color='gray', fontsize=7)
ax[1].plot([a for a, _ in H], [num(v) for _, v in H], 's-', color='black', ms=3.5); ax[1].set_ylabel('Heart rate\n(beats/min)'); ax[1].axhline(100, ls=':', color='gray')
ax[2].plot([a for a, _ in B], [mapof(v) for _, v in B], '^-', color='black', ms=3.5); ax[2].set_ylabel('MAP (mmHg)\n(arterial line)'); ax[2].axhline(65, ls=':', color='gray'); ax[2].text(P(t0), 65.6, 'goal 65 or higher', color='gray', fontsize=7)
hours(ax[2], t0, t1); ax[2].set_xlabel('Tuesday 11/03/26 (clock time)')
fig.suptitle('Marcus Delaney: temperature, heart rate and MAP, Tuesday 0700 to 1900 (from the flowsheet)', fontsize=10)
fig.tight_layout(); fig.savefig('figs/fig_s3_vitals.png', dpi=170); plt.close(fig)

# ---- Shift 4: MAP, norepinephrine and lactate (Tue 1900 - Wed 0700)
t0, t1 = '2026-11-03 19:00', '2026-11-04 07:00'
B = vit('BP', t0, t1)
rate = [(P('2026-11-03 17:30'), .05), (P('2026-11-03 18:00'), .08), (P('2026-11-03 18:30'), .10), (P('2026-11-03 19:30'), .12), (P('2026-11-03 20:30'), .14), (P('2026-11-04 00:00'), .12), (P('2026-11-04 02:00'), .08), (P('2026-11-04 04:00'), .04), (P('2026-11-04 04:30'), 0), (P('2026-11-04 07:00'), 0)]
lac = [(o['collected'], float(o['value'])) for o in obs if o['type'] == 'lab' and o['label'] == 'Lactate' and t0 <= o['collected'] <= t1]
fig, ax = plt.subplots(3, 1, figsize=(7, 5.6), sharex=True, gridspec_kw={'height_ratios': [1.3, 1, 1]})
ax[0].plot([a for a, _ in B], [mapof(v) for _, v in B], '^-', color='black', ms=3.5); ax[0].axhline(65, ls=':', color='gray'); ax[0].set_ylabel('MAP (mmHg)'); ax[0].text(P(t0), 65.8, 'goal 65 or higher', color='gray', fontsize=7)
ax[1].step([a for a, _ in rate], [v for _, v in rate], where='post', color='black'); ax[1].fill_between([a for a, _ in rate], [v for _, v in rate], step='post', color='lightgray'); ax[1].set_ylabel('Norepinephrine\n(mcg/kg/min)'); ax[1].set_ylim(0, .17)
ax[2].plot([P(a) for a, _ in lac], [v for _, v in lac], 'D-', color='black', ms=5)
for a, v in lac: ax[2].annotate(f'{v}', (P(a), v), textcoords='offset points', xytext=(0, 6), ha='center', fontsize=8)
ax[2].axhline(2.0, ls=':', color='gray'); ax[2].text(P(t0), 2.05, 'upper limit 2.0', color='gray', fontsize=7); ax[2].set_ylabel('Lactate (mmol/L)'); ax[2].set_ylim(0, 5.6)
hours(ax[2], t0, t1, 1); ax[2].set_xlabel('Tuesday 1900 to Wednesday 0700 (clock time)')
fig.suptitle('Marcus Delaney: MAP, norepinephrine dose and lactate, Tuesday night', fontsize=10)
fig.tight_layout(); fig.savefig('figs/fig_s4_pressor.png', dpi=170); plt.close(fig)

# ---- Shift 5: breathing before extubation (Wed 0700-1200)
t0, t1 = '2026-11-04 04:00', '2026-11-04 12:00'
Hr = vit('HR', t0, t1); RR = vit('RR', t0, t1); SP = vit('SPO2', t0, t1)
fio2 = [(P('2026-11-04 04:00'), 40), (P('2026-11-04 09:00'), 35), (P('2026-11-04 10:45'), 35), (P('2026-11-04 12:00'), None)]
fig, ax = plt.subplots(3, 1, figsize=(7, 5.4), sharex=True)
ax[0].plot([a for a, _ in RR], [num(v) for _, v in RR], 's-', color='black', ms=3.5); ax[0].set_ylabel('Respiratory rate\n(breaths/min)'); ax[0].axhline(30, ls=':', color='gray')
ax[1].plot([a for a, _ in SP], [num(v) for _, v in SP], 'o-', color='black', ms=3.5); ax[1].set_ylabel('SpO2 (%)'); ax[1].set_ylim(88, 101)
ax[2].plot([a for a, _ in Hr], [num(v) for _, v in Hr], '^-', color='black', ms=3.5); ax[2].set_ylabel('Heart rate\n(beats/min)')
hours(ax[2], t0, t1, 1); ax[2].set_xlabel('Wednesday 11/04/26 (clock time)')
fig.suptitle('Marcus Delaney: breathing and heart rate, Wednesday 0400 to 1200 (from the flowsheet)', fontsize=10)
fig.tight_layout(); fig.savefig('figs/fig_s5_breathing.png', dpi=170); plt.close(fig)

# ---- Shift 1: urine output against the lactated Ringer's rate (Mon 0400-1900)
t0, t1 = '2026-11-02 04:00', '2026-11-02 19:00'
io = [e for e in c['ioEvents'] if t0 < e['collected'] <= t1 and e['id'] != 'io_2026_11_02_0359']
x = [P(e['collected']) - dt.timedelta(minutes=30) for e in io]
fig, ax = plt.subplots(2, 1, figsize=(7, 4.6), sharex=True)
ax[0].bar(x, [e['output'] for e in io], width=0.03, color='gray', edgecolor='black'); ax[0].axhspan(30, 50, color='lightgray', alpha=.6); ax[0].text(P(t0), 51, 'goal 30-50 mL/h', fontsize=7); ax[0].set_ylabel('Urine output\n(mL per hour)')
lr = [(P('2026-11-02 04:00'), 450), (P('2026-11-02 06:00'), 540), (P('2026-11-02 09:30'), 225), (P('2026-11-02 14:00'), 270), (P('2026-11-02 19:00'), 270)]
ax[1].step([a for a, _ in lr], [v for _, v in lr], where='post', color='black'); ax[1].set_ylabel("Lactated Ringer's\n(mL/h)"); ax[1].set_ylim(0, 620)
hours(ax[1], t0, t1, 1); ax[1].set_xlabel('Monday 11/02/26 (clock time)')
fig.suptitle("Marcus Delaney: hourly urine output and the lactated Ringer's rate, Monday", fontsize=10)
fig.tight_layout(); fig.savefig('figs/fig_s1_uop_lr.png', dpi=170); plt.close(fig)
print('figures written')

# ---- Shift 6: three-day trends (temperature, WBC, procalcitonin, creatinine)
fig, ax = plt.subplots(4, 1, figsize=(7, 6.6), sharex=True)
T = vit('TEMP', '2026-11-02 04:00', '2026-11-05 07:00')
ax[0].plot([a for a, _ in T], [num(v) for _, v in T], '-', color='black', lw=1); ax[0].axhline(100.4, ls=':', color='gray'); ax[0].set_ylabel('Temperature (F)')
def labser(name): return [(P(o['collected']), float(o['value'])) for o in obs if o['type'] == 'lab' and o['label'] == name]
for k, (name, yl, mk) in enumerate([('WBC', 'WBC (K/uL)', 'o'), ('Procalcitonin', 'Procalcitonin\n(ng/mL)', 's'), ('Creatinine', 'Creatinine (mg/dL)', '^')], 1):
    s = labser(name); ax[k].plot([a for a, _ in s], [v for _, v in s], mk + '-', color='black', ms=4); ax[k].set_ylabel(yl)
    for a, v in s: ax[k].annotate(f'{v:g}', (a, v), textcoords='offset points', xytext=(0, 5), ha='center', fontsize=7)
ax[3].set_xlim(P('2026-11-02 04:00'), P('2026-11-05 08:00')); ax[3].xaxis.set_major_locator(mdates.HourLocator(byhour=[7, 19])); ax[3].xaxis.set_major_formatter(mdates.DateFormatter('%a %m/%d\n%H%M')); ax[3].tick_params(axis='x', labelsize=7)
fig.suptitle('Marcus Delaney: temperature and key labs over the whole ICU stay (from the chart)', fontsize=10)
fig.tight_layout(); fig.savefig('figs/fig_s6_trends.png', dpi=170); plt.close(fig)
print('figure 6 written')

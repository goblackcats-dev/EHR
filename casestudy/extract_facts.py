#!/usr/bin/env python3
"""Prints a fact sheet for a NursingSim patient JSON so a case study can be written from it.
Usage: python3 extract_facts.py patient.json > facts.txt
Everything here is read straight from the chart (nothing is invented)."""
import json, sys

def main(path):
    c = json.load(open(path))
    if 'canonical' in c: c = c['canonical']
    p, e, tl = c['patient'], c['encounter'], c.get('timeline', {})
    out = print
    out('PATIENT', p.get('name'), p.get('age'), p.get('sex'), 'MRN', p.get('mrn'), 'DOB', p.get('dob'), 'Ht', p.get('heightCm'), 'Wt', p.get('weightKg'))
    out('ALLERGIES', p.get('allergies'))
    out('ENCOUNTER', {k: e.get(k) for k in ['location', 'room', 'admitDate', 'diagnosis', 'chiefComplaint', 'codeStatus', 'isolation', 'dietOrder', 'ambulationOrder', 'fallRisk', 'hospitalDay']})
    out('TIMELINE', tl)
    out('\nPROBLEMS'); [out(' ', x['name'], '|', x.get('status'), '|', x.get('details', '')) for x in c.get('problems', [])]
    meds = [o for o in c['orders'] if o['category'] == 'Medication']
    out('\nMEDICATIONS', len(meds))
    for o in meds:
        m = o.get('medication', {})
        out(' ', o['name'], '|', m.get('dose'), m.get('route'), o.get('frequency'), '| class:', m.get('drugClass'), '| why:', o.get('rationale'), '| high-alert:', m.get('highAlert'), '| hold:', m.get('hold'))
    out('\nOTHER ORDERS'); [out(' ', o['category'], '|', o['name'], '|', o['status'], '|', o['start']) for o in c['orders'] if o['category'] != 'Medication']
    out('\nVITAL SETS')
    V = {}
    for o in c['observations']:
        if o['type'] == 'vital': V.setdefault(o['collected'], {})[o['code']] = o['value'] + ('*' if o['flag'] else '')
    for k in sorted(V): out(' ', k, V[k])
    out('\nLABS (all collections)')
    L = {}
    for o in c['observations']:
        if o['type'] == 'lab': L.setdefault(o['label'], []).append((o['collected'][5:], o['value'], o.get('units', ''), o['flag'], o.get('reference')))
    for k, v in L.items(): out(' ', k, v)
    out('\nASSESSMENTS (latest before shift start)')
    start = tl.get('simulationStart', '')
    A = {}
    for o in sorted([o for o in c['observations'] if o['type'] == 'assessment'], key=lambda x: x['collected']):
        if not start or o['collected'] <= start: A[(o['section'], o['label'])] = (o['value'], o['collected'][5:])
    for k, v in A.items(): out(' ', k, '=', v)
    out('\nI&O'); [out(' ', x['date'], x['time'], 'in', x['intake'], 'out', x['output']) for x in c.get('ioEvents', [])]
    out('\nDEVICES'); [out(' ', d['type'], d.get('location'), d.get('status'), d.get('placementDate')) for d in c.get('devices', [])]
    out('\nTRIGGERS', c.get('triggers'))
    out('\nNOTES')
    for n in sorted(c['notes'], key=lambda n: n['datetime']):
        out('=====', n['datetime'], n['title'], '|', n.get('summary', '')); out(n['body'])
    if 'facultyBuilder' in c: out('\nBUILDER INPUTS', c['facultyBuilder'].get('inputs'))

if __name__ == '__main__':
    main(sys.argv[1])

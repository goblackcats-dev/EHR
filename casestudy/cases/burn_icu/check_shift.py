#!/usr/bin/env python3
"""Checks one shift file:  python3 check_shift.py shift3_items.py   (item points add up, element points add up, images exist, ids are in order)"""
import sys, os, json
E = lambda t, pts, src='': {'t': t, 'pts': pts, 'src': src}
parts = []
ns = {'E': E, 'parts': parts, '__file__': sys.argv[1]}
exec(open(sys.argv[1]).read(), ns)
ok = True
for p in parts:
    tot = 0
    print('PART', p['id'], p['title'])
    for i in p['items']:
        tot += i['points']
        k = i.get('key', {}); els = k.get('elements')
        if els and not k.get('bank'):
            s = sum(e['pts'] for e in els)
            if abs(s - i['points']) > 0.01: print('  !! item', i['id'], 'elements sum', s, 'but points', i['points']); ok = False
        if els and k.get('bank'):
            print('  (bank)', i['id'], 'points', i['points'], 'bank elements', len(els))
        for im in i.get('images', []):
            if not os.path.exists(im['path']): print('  !! missing image', im['path']); ok = False
        if i['type'] in ('box',) and not i.get('prompt') and i['points']: print('  !! no prompt', i['id']); ok = False
        if not i.get('where') and i['points'] and i['type'] not in ('sealed', 'text'): print('  .. no "where" on', i['id'])
    print('  items', len(p['items']), 'points', tot, '(should be 16)')
    if abs(tot - 16) > 0.01: ok = False
print('OK' if ok else 'PROBLEMS')

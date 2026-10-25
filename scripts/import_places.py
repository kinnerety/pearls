"""Copy the curated place data from the project files into the repo.

Usage: python3 scripts/import_places.py [/mnt/project-files/data/places_site.json]

Drops internal fields (evidence, status), applies the site's category naming and
precomputes `ctags` (unified tags, used by search) with scripts/tags.py.
Fields the repo owns (precision, address, exact coordinates) are kept from the
current data/places.json so a re-import never undoes geocoding.
"""
import json, os, sys
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
from tags import canon

SRC = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/data/places_site.json'
DST = os.path.join(H, '..', 'data', 'places.json')
KEEP = ('lat', 'lng', 'approx', 'precision', 'address', 'geo_source')

old = {}
if os.path.exists(DST):
    old = {p['id']: p for p in json.load(open(DST, encoding='utf-8'))}

out = []
for p in json.load(open(SRC, encoding='utf-8')):
    if p.get('status') == 'closed':
        continue
    p.pop('evidence', None); p.pop('status', None)
    p['cats'] = ['תרבות' if c == 'תרבות ומורשת' else c for c in p['cats']]
    p['ctags'] = canon(p['tags'])
    prev = old.get(p['id'])
    if prev and prev.get('precision'):
        for k in KEEP:
            if k in prev: p[k] = prev[k]
    out.append(p)

json.dump(out, open(DST, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('wrote', len(out), 'places')

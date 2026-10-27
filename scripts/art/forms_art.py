"""Illustrations for the two popup forms (suggest a pearl / report a mistake), in the site's paper-cut palette.
Run: python3 scripts/art/forms_art.py [outdir]  -> prints nothing, writes <outdir>/acorn_<v>.svg and report.svg
The chosen variant is pasted into components/art.ts (ACORN_REST_SVG / REPORT_SVG)."""
import math, sys, os

YEL, YEL_D, YEL_L = '#FAD771', '#E9BE45', '#FDECB4'
TEAL, TEAL_L = '#1C4F66', '#3E7590'
SAGE, SAGE_D, LIME, LIME_D = '#98C4A4', '#7DAE8B', '#D6DE8A', '#BFC86E'
CREAM, SHEET = '#F2E8CC', '#FFFDF7'

def oak_leaf(L=60, W=15, lobes=4, seed=0):
    """An oak leaf along +x from the stalk at (0,0) to the tip at (L,0): rounded lobes on both sides."""
    pts_top, pts_bot = [], []
    n = 90
    for i in range(n + 1):
        t = i / n
        base = math.sin(math.pi * min(1, t * 1.08)) ** 0.8 * (1 - 0.25 * t)
        lob = 0.5 + 0.5 * abs(math.sin(math.pi * (lobes + 0.5) * t + 0.3)) ** 0.45
        w = W * base * lob
        x = 6 + t * (L - 6)
        pts_top.append((x, -w))
        lob2 = 0.5 + 0.5 * abs(math.sin(math.pi * (lobes + 0.5) * t + 1.2)) ** 0.45
        pts_bot.append((x, W * base * lob2))
    pts = [(0, 0), (6, -0.8)] + pts_top[1:] + list(reversed(pts_bot[1:])) + [(6, 0.8)]
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'
    vein = f'M2 0L{L-4} 0' + ''.join(
        f'M{6 + k*(L-10)/(lobes+1):.1f} 0l{5:.1f} {-6*(1-k/(lobes+2)):.1f}M{6 + k*(L-10)/(lobes+1)+3:.1f} 0l{5:.1f} {6*(1-k/(lobes+2)):.1f}'
        for k in range(1, lobes))
    return d, vein

def leaf(x, y, rot, s, fill, vein_col=SHEET, L=60, W=15):
    d, v = oak_leaf(L, W)
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            f'<path d="{d}" fill="{fill}"/>'
            f'<path d="{v}" fill="none" stroke="{vein_col}" stroke-width="1" stroke-linecap="round" opacity=".6"/></g>')

def acorn(x, y, rot, s=1.0):
    """The favicon acorn (nut + cap + stalk), on its side: rot=-90 lays it with the cap on the left... in profile."""
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s}) translate(-32 -36)">'
            '<path d="M19 31C18.5 48 26 58.5 32 59C38 58.5 45.5 48 45 31Z" fill="#FAD771"/>'
            '<path d="M34 31C34.5 45 36 53 32 59C38 58.5 45.5 48 45 31Z" fill="#E9BE45"/>'
            '<path d="M24.5 36C24.5 44 27 50 30 54" fill="none" stroke="#FDECB4" stroke-width="2.6" stroke-linecap="round"/>'
            '<path d="M30.5 58.3L32 61.8L33.5 58.3Z" fill="#1C4F66"/>'
            '<path d="M14 31C14 20 21.5 13.5 32 13.5S50 20 50 31C50 33.5 48 35 45.5 35H18.5C16 35 14 33.5 14 31Z" fill="#1C4F66"/>'
            '<path d="M19 22.5l4 4M25 18l4 4M31 16.5l4 4M37 18l4 4M43 22.5l3 3M18 29l3-3M23 29l4-4M29 29l4-4M35 29l4-4M41 29l4-4M47 28l1.5-1.5" stroke="#3E7590" stroke-width="1.3" stroke-linecap="round"/>'
            '<path d="M31.5 14C31 9.5 32.8 6.5 36.5 5" fill="none" stroke="#1C4F66" stroke-width="3.2" stroke-linecap="round"/></g>')

def ground(cx, cy, rx, ry, fill=CREAM):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}"/>'

def shadow(cx, cy, rx, ry):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#22333B" opacity=".12"/>'

VIEW = '0 28 160 70'
# the acorn lying on the ground, in profile (cap to the right, the nut's tip to the left), oak leaves around it
VARIANTS = {
    # א: two leaves under/behind it, crossing, on a cream patch of ground
    # (Kinneret 27.10: a resting acorn: the cap is wider than the nut, so the cap's rim and the nut's tip both touch the ground
    #  on one line and the acorn leans a little; 58.5 degrees puts both on the same line)
    'a': ground(80, 80, 66, 11) + leaf(28, 78, -14, 1.05, SAGE) + leaf(132, 80, 196, 0.95, LIME_D)
         + shadow(76, 81.2, 28, 2.6) + acorn(78, 66.8, 58.5, 0.98),
    # ב: three leaves fanned out behind it like a bed
    'b': ground(80, 82, 70, 10) + leaf(76, 80, -160, 1.0, SAGE_D) + leaf(80, 80, -100, 0.85, LIME)
         + leaf(86, 80, -20, 1.0, SAGE) + shadow(80, 83, 32, 4) + acorn(80, 62, 90, 0.98),
    # ג: one big leaf it rests on, two small ones in the front corners
    'c': ground(80, 84, 68, 9) + leaf(24, 74, -6, 1.75, SAGE, L=60, W=14) + shadow(84, 77, 32, 4)
         + acorn(84, 56, 90, 0.98) + leaf(34, 88, -170, 0.6, LIME_D) + leaf(126, 90, -14, 0.65, LIME),
}

# report a mistake: a folded paper map with a pin and a magnifying glass
REPORT = (
    ground(80, 86, 66, 8)
    + '<path d="M28 30L58 22L90 30L122 22V78L90 86L58 78L28 86Z" fill="#DDEEF6"/>'
    + '<path d="M58 22V78L90 86V30Z" fill="#CBE3EF"/>'
    + '<path d="M34 70C46 60 52 66 62 56S80 46 92 52S112 44 118 38" fill="none" stroke="#98C4A4" stroke-width="4" stroke-linecap="round"/>'
    + '<path d="M36 44c6-4 10 2 16-2" fill="none" stroke="#FFFDF7" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 3"/>'
    + '<path d="M74 52c-6-7-9-11-9-15a9 9 0 0 1 18 0c0 4-3 8-9 15Z" fill="#1C4F66"/><circle cx="74" cy="37" r="3.4" fill="#FAD771"/>'
    + '<circle cx="104" cy="56" r="15" fill="#FFFDF7" opacity=".55"/><circle cx="104" cy="56" r="15" fill="none" stroke="#FAD771" stroke-width="5"/>'
    + '<path d="M115 67L130 82" stroke="#1C4F66" stroke-width="7" stroke-linecap="round"/>'
)

def wrap(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEW}">{body}</svg>'

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for k, b in VARIANTS.items():
        open(os.path.join(out, f'acorn_{k}.svg'), 'w').write(wrap(b))
    open(os.path.join(out, 'report.svg'), 'w').write(wrap(REPORT))

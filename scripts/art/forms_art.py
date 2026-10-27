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

# report a mistake (Kinneret 27.10): a carafe of orange juice and, beside it, a cute flowered glass tipped on its side with the
# juice spilling out: something went wrong. The juice is the palette's yellow (no orange on the site).
JUICE, JUICE_D, GLASS, GLASS_EDGE = YEL, YEL_D, '#DDEEF6', '#9FCBE3'

def flower(x, y, s=1.0, petals=SHEET, heart=YEL):
    pts = ''.join(f'<circle cx="{x + s*1.7*math.cos(k*2*math.pi/5):.1f}" cy="{y + s*1.7*math.sin(k*2*math.pi/5):.1f}" r="{s*1.1:.1f}" fill="{petals}"/>' for k in range(5))
    return pts + f'<circle cx="{x}" cy="{y}" r="{s*0.9:.1f}" fill="{heart}"/>'

CARAFE = (
    # the glass first, the juice on it at full strength, then the outline (through the glass the juice looked washed out)
    f'<path d="M52 40C44 50 42 66 44 78C45 84 50 86 60 86C70 86 75 84 76 78C78 66 76 50 68 40Z" fill="{GLASS}" opacity=".5"/>'
    f'<path d="M46.5 58C45 66 44 72 44 78C45 84 50 86 60 86C70 86 75 84 76 78C76 72 75 66 73.5 58Z" fill="{JUICE}"/>'
    f'<ellipse cx="60" cy="58" rx="13.5" ry="2.6" fill="{JUICE_D}"/>'
    f'<path d="M52 40C44 50 42 66 44 78C45 84 50 86 60 86C70 86 75 84 76 78C78 66 76 50 68 40Z" fill="none" stroke="{GLASS_EDGE}" stroke-width="1.6"/>'
    # neck, spout and handle
    f'<path d="M52 40V33H68V40" fill="{GLASS}" stroke="{GLASS_EDGE}" stroke-width="1.6" stroke-linejoin="round"/>'
    f'<path d="M52 33L47 30.5L52 36.5" fill="{GLASS}" stroke="{GLASS_EDGE}" stroke-width="1.6" stroke-linejoin="round"/>'
    f'<path d="M76 48C88 50 88 70 76 72" fill="none" stroke="{TEAL}" stroke-width="3" stroke-linecap="round"/>'
    f'<path d="M48 50C46.5 56 46 62 46.5 70" fill="none" stroke="{SHEET}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>'
)

def tipped_glass(x, y, rot):
    """A flowered tumbler on its side, mouth to the right. The juice left inside lies along the lower wall, its surface a
    line that runs down to the right, into the puddle (Kinneret 27.10: the slope must fall to the right)."""
    body = 'M-7 0Q-7.5 1.5 -6 1.5L6 1.5Q7.5 1.5 7 0L11 -26L-11 -26Z'
    tf = f'translate({x} {y}) rotate({rot})'
    return (f'<clipPath id="glass-in"><path d="{body}" transform="{tf}"/></clipPath>'
            f'<g transform="{tf}"><path d="{body}" fill="{GLASS}" opacity=".5"/></g>'
            # the juice, drawn in page coordinates and clipped to the glass
            f'<path d="M{x+6} {y-2}L{x+32} {y+11.5}L{x+34} {y+18}L{x-4} {y+18}Z" fill="{JUICE}" clip-path="url(#glass-in)"/>'
            f'<g transform="{tf}">'
            f'<path d="{body}" fill="none" stroke="{GLASS_EDGE}" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<ellipse cx="0" cy="-26" rx="11" ry="2.4" fill="{GLASS}" stroke="{GLASS_EDGE}" stroke-width="1.4"/>'
            f'<path d="M-5.5 -3C-7 -10 -7.5 -16 -7 -22" fill="none" stroke="{SHEET}" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>'
            + flower(-1.5, -8, 1.0, SAGE) + flower(4.5, -16, 0.9, LIME) + flower(-4.5, -18.5, 0.8, '#BFDDEE')
            + '</g>')

REPORT = (
    ground(80, 86, 66, 8)
    # the spilled juice runs from the mouth of the glass along the table and stops well inside it (Kinneret 27.10)
    + f'<path d="M112 80C119 77 128 78 134 82C137 85 131 89.5 122 89.5C113 89.5 107 86 112 80Z" fill="{JUICE}"/>'
    + f'<ellipse cx="126" cy="85" rx="4" ry="1.2" fill="{JUICE_D}" opacity=".6"/>'
    + CARAFE + tipped_glass(92, 74, 95)
)

def wrap(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEW}">{body}</svg>'

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for k, b in VARIANTS.items():
        open(os.path.join(out, f'acorn_{k}.svg'), 'w').write(wrap(b))
    open(os.path.join(out, 'report.svg'), 'w').write(wrap(REPORT))

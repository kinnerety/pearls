# Header illustrations for the category pages (Kinneret 27.10.2026), deliberately minimal: a few big paper shapes, one motif each.
import math, random
from headers_base import *
from header_zones import ibex, eagle, paper_cloud, olive, shrubs

def big(parts, ax, ay, k):
    """Scale a list of foreground parts by k around the anchor (ax, ay), which stays put."""
    return f'<g transform="translate({ax},{ay}) scale({k}) translate({-ax},{-ay})">' + ''.join(parts) + '</g>'

def hills_min(colors=(MIST, LIME, SAGE), ys=(250, 300, 360)):
    """Three quiet hills, nothing on them."""
    o = []
    pats = ('wv', 'dw', 'cl')
    for (y, c, p, ph) in zip(ys, colors, pats, (0.8, 2.6, 4.2)):
        o.append(layer(wave(y, 22, 1.1, ph), c, p, .9))
    return o

def nature():
    """Hills turning from green on the left to yellow on the right, a stream, an ibex and an eagle."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(244, 20, 1.2, 0.8), MIST, 'wv'))
    far = wave(272, 30, 1.0, 2.2, x0=-30, x1=760, taper=.3, drop=400)
    o.append(layer(far, SAGE, 'dw'))
    mid = wave(318, 24, 1.3, 4.0)
    o.append(f'<g filter="url(#paper)"><path d="{path(mid)}" fill="{INK}"/></g>')
    right = wave(344, 20, 1.1, 1.3, x0=560, x1=W + 30, taper=.3, drop=440)
    o.append(layer(right, SUN, 'sa', 1))
    left = wave(372, 16, 1.0, 3.1, x0=-30, x1=640, taper=.35, drop=460)
    o.append(layer(left, LIME, 'st', .9))
    yellow = wave(404, 12, 1.0, 0.4, x0=700, x1=W + 30, taper=.3)
    o.append(layer(yellow, DYEL, 'di', .25))
    c = bezier((470, ground_at(mid, 470) - 2), (380, 340), (620, 380), (430, 476), 60)
    wd = [3 + 22 * (i / 60) ** 1.5 for i in range(61)]
    o.append(f'<clipPath id="nc"><path d="{path(mid)}"/><path d="{path(left)}"/><path d="{path(right)}"/></clipPath><g clip-path="url(#nc)">{ribbon(c, wd, MIST, "wv")}</g>')
    o.append(ibex(880, ground_at(right, 880) + 2, 1.35, flip=True))
    o.append(eagle(400, 80, 1.0, -6))
    return svg(o)

def table_scene():
    """A table in front of the view with a cheese plate and two glasses of wine."""
    o = [sun(230, 150, 66, SUN2)]
    o += hills_min((MIST, SAGE, LIME), (248, 296, 350))
    far = wave(296, 22, 1.1, 2.6)
    o.append(f'<g filter="url(#paper)"><path d="{path(wave(322, 18, 1.3, 4.4))}" fill="{INK}"/></g>')
    o.append(layer(wave(372, 14, 1.0, 1.0), DSAGE, 'cl', .9))
    # the table: a long paper board on two legs, slightly in perspective
    tx, ty = 540, 392
    fg = []
    fg.append(f'<g transform="translate({tx},{ty})"><path d="M-110 46 L-96 0 M110 46 L96 0 M-70 46 L-62 0 M70 46 L62 0" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
             f'<g filter="url(#paper)"><path d="M-240 -2 L240 -2 L228 14 L-228 14Z" fill="{CREAM}"/></g><path d="M-230 2 H230" stroke="{SUN2}" stroke-width="1.2" opacity=".8"/>')
    # cheese plate (round white paper, three wedges, a bunch of grapes)
    grapes = ''.join(f'<circle cx="{gx}" cy="{gy}" r="4" fill="{TEAL}"/>' for gx, gy in [(44,-8),(52,-4),(38,-2),(46,2),(54,4),(50,-12)])
    fg.append(f'<g transform="translate(-40,-10)"><ellipse cx="0" cy="0" rx="70" ry="16" fill="{WHITE}" filter="url(#paperS)"/>'
             f'<path d="M-44 -4 L-10 -20 L-6 -4Z" fill="{SUN2}"/><path d="M-6 -6 L30 -22 L34 -6Z" fill="{DYEL}"/><path d="M-16 -2 L18 -16 L22 -2Z" fill="{SUN}"/>'
             f'<circle cx="-2" cy="-12" r="1.6" fill="{WHITE}"/><circle cx="12" cy="-9" r="1.4" fill="{WHITE}"/>'
             f'{grapes}</g>')
    # two glasses of wine
    for gx in (100, 150):
        fg.append(f'<g transform="translate({gx},-6)"><path d="M-14 -64 C-14 -40 -8 -30 0 -28 C8 -30 14 -40 14 -64Z" fill="{SKY}" opacity=".75"/>'
                 f'<path d="M-13 -48 C-12 -36 -7 -30 0 -28 C7 -30 12 -36 13 -48Z" fill="{TEAL}"/>'
                 f'<path d="M0 -28 V-6 M-10 -4 H10" stroke="{INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M-10 -58 C-9 -48 -8 -42 -6 -36" stroke="{WHITE}" stroke-width="1.6" opacity=".9"/></g>')
    fg.append('</g>')
    o.append(big(fg, tx, ty + 46, 1.75))
    return svg(o)

def vineyard():
    """Rows of vines over a soft hill, a few grape bunches, one cypress at the edge."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(248, 20, 1.2, 0.8), MIST, 'wv'))
    o.append(layer(wave(284, 26, 1.0, 2.6, x0=-30, x1=800, taper=.3, drop=400), SAGE, 'dw'))
    o.append(f'<g filter="url(#paper)"><path d="{path(wave(322, 18, 1.3, 4.4))}" fill="{INK}"/></g>')
    field = wave(352, 14, 1.0, 1.0)
    o.append(layer(field, LIME, 'st', .9))
    # vine rows: each row = a post line, a leafy band, bunches hanging below
    for k, (y0, sc) in enumerate([(386, 1.25), (436, 1.7)]):
        r = random.Random(k + 3)
        x = -20 + k * 40
        while x < W + 40:
            leaf = f'<path d="M-16 0 C-14 -14 -4 -18 4 -14 C12 -18 20 -10 16 0 C10 6 -10 6 -16 0Z" fill="{DSAGE if k % 2 else SAGE}"/>'
            post = f'<path d="M0 14 V-6" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
            grapes = ''.join(f'<circle cx="{gx}" cy="{gy}" r="2.6" fill="{TEAL}"/>' for gx, gy in [(-3, 4), (3, 4), (0, 9), (-6, 9), (6, 9), (-3, 14), (3, 14), (0, 19)]) if r.random() < .55 else ''
            o.append(f'<g transform="translate({x:.0f},{y0 + r.uniform(-3, 3):.0f}) scale({sc})">{post}<g filter="url(#paperS)">{leaf}</g>{grapes}</g>')
            x += r.uniform(48, 62) * sc
    o.append(cypress(1130, 460, .9, DSAGE, WHITE, 2))
    return svg(o)

def carpentry():
    """A carpenter's bench outdoors: a plank, a saw, a hammer, curls of shavings, a tool board behind."""
    o = [sun(230, 150, 66, SUN2)]
    o += hills_min((MIST, SAGE, LIME), (252, 300, 352))
    o.append(layer(wave(380, 12, 1.0, 1.0), DSAGE, 'cl', .9))
    # tool board hanging in the air like a paper cutout, with a hand saw and a hammer
    teeth = ''.join(f'<path d="M{-66 + k*8} 10 L{-62 + k*8} 15 L{-58 + k*8} 10" fill="{SKY}"/>' for k in range(15))
    board = []
    board.append(f'<g transform="translate(250,330)"><g filter="url(#paper)"><rect x="-120" y="-70" width="240" height="140" rx="6" fill="{CREAM}"/></g>'
             f'<path d="M-110 -54 H110 M-110 -24 H110 M-110 6 H110 M-110 36 H110" stroke="{SUN2}" stroke-width="1.2" opacity=".9"/>'
             # saw
             f'<g transform="translate(-50,-10) rotate(-18)"><path d="M-70 -10 L50 -10 L50 6 L-70 10Z" fill="{SKY}"/>'
             f'{teeth}'
             f'<path d="M50 -14 C72 -14 74 10 50 10 L56 -2Z M56 -2 L62 -2" fill="{INK}"/></g>'
             # hammer
             f'<g transform="translate(60,22) rotate(28)"><path d="M-8 -6 H8 V60 H-8Z" fill="{INK}"/><path d="M-26 -28 H26 V-4 H-26Z" rx="3" fill="{TEAL}"/></g></g>')
    o.append(big(board, 250, 400, 1.15))
    # workbench
    bx, by = 640, 392
    curls = ''.join(f'<path transform="translate({cx},{cy}) rotate({ca})" d="M0 0 C8 -14 20 -10 14 2 C10 10 0 8 0 0Z" fill="{SUN2}"/>' for cx, cy, ca in [(110,-14,10),(130,-6,-20),(150,-16,40),(-200,2,15),(-215,-10,-30)])
    bench = []
    bench.append(f'<g transform="translate({bx},{by})"><path d="M-150 50 L-140 0 M150 50 L140 0 M-100 50 L-96 0 M100 50 L96 0" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
             f'<g filter="url(#paper)"><path d="M-250 -4 L250 -4 L240 12 L-240 12Z" fill="{DYEL}"/></g>'
             # plank being planed
             f'<g filter="url(#paperS)"><path d="M-170 -22 L80 -30 L84 -8 L-166 -2Z" fill="{CREAM}"/></g><path d="M-160 -18 L70 -26" stroke="{SUN2}" stroke-width="1.2"/>'
             # hand plane
             f'<g transform="translate(-30,-40)"><path d="M-40 10 L40 10 L36 -8 L-36 -8Z" fill="{TEAL}"/><path d="M-10 -8 C-10 -22 10 -22 10 -8Z" fill="{INK}"/><path d="M-8 -12 L-2 -30" stroke="{INK}" stroke-width="3" stroke-linecap="round"/></g>'
             # curls of shavings
             f'{curls}'
             f'<ellipse cx="180" cy="4" rx="22" ry="5" fill="{SUN}"/></g>')
    o.append(big(bench, bx, by + 50, 1.55))
    return svg(o)

def finjan(x, y, sc=1.0):
    """Israeli enamel finjan (narrow at the top, wide at the bottom, long handle), light blue like the category icon."""
    return (f'<g transform="translate({x},{y}) scale({sc})"><g filter="url(#paperS)"><path d="M-30 0 L-22 -58 L22 -58 L30 0Z" fill="{SKY}"/></g>'
            f'<path d="M-24 -58 L-26 -64 L26 -64 L24 -58Z" fill="{TEAL}"/><path d="M-6 -64 L-14 -72 L12 -72Z" fill="{SKY}"/>'
            f'<path d="M22 -60 L72 -92" stroke="{TEAL}" stroke-width="6" stroke-linecap="round"/><path d="M-26 -8 H26" stroke="{WHITE}" stroke-width="2" opacity=".8"/></g>')

def sitter(x, y, sc=1.0, flip=False, cup=False):
    """Someone sitting on the ground, knees up, seen from the side."""
    f = ' scale(-1,1)' if flip else ''
    c = f'<path d="M14 -26 L22 -26 L21 -18 L15 -18Z" fill="{SUN2}"/><path d="M19 -30 C21 -34 18 -36 20 -40" stroke="{INK}" stroke-width="1.4" fill="none"/>' if cup else ''
    return (f'<g transform="translate({x},{y}) scale({sc}){f}"><circle cx="0" cy="-46" r="6.5" fill="{INK}"/>'
            f'<path d="M-8 -36 C-8 -40 8 -40 8 -36 L10 -8 L-10 -8Z" fill="{INK}"/>'
            f'<path d="M8 -8 L26 -22 L34 -6 M-10 -8 L26 -6" stroke="{INK}" stroke-width="5" stroke-linecap="round" fill="none"/>'
            f'<path d="M6 -32 L18 -22" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>{c}</g>')

def tours_a():
    """Option A: a circle around a finjan on coals, the guide stands and points at the view."""
    o = [sun(230, 150, 66, SUN2)]
    o += hills_min((MIST, SAGE, SUN), (248, 296, 340))
    o.append(layer(wave(330, 16, 1.3, 4.4), DSAGE, 'dw', .9))
    g = wave(376, 12, 1.0, 1.0)
    o.append(layer(g, LIME, 'st', .9))
    fx, fy = 520, 432
    fg = []
    coals = ''.join(f'<circle cx="{cx}" cy="{cy}" r="3" fill="{SUN2}"/>' for cx, cy in [(-18,-2),(-6,2),(8,-3),(20,1),(0,-6)])
    fg.append(f'<g transform="translate({fx},{fy})"><ellipse cx="0" cy="0" rx="40" ry="9" fill="{INK}"/>'
             f'{coals}'
             f'<path d="M-6 -16 C-14 -30 2 -36 -4 -52 M8 -14 C2 -28 14 -34 8 -48" stroke="{CREAM}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/></g>')
    fg.append(finjan(fx + 36, fy - 10, .55))
    fg.append(sitter(fx - 110, fy + 6, 1.0, cup=True)); fg.append(sitter(fx + 140, fy + 8, 1.0, flip=True, cup=True)); fg.append(sitter(fx - 60, fy + 18, .9, cup=False))
    # the guide, standing, pointing at the view
    gx, gy = fx + 230, fy + 4
    fg.append(f'<g transform="translate({gx},{gy})"><circle cx="0" cy="-66" r="7" fill="{INK}"/><path d="M-8 -56 C-8 -59 8 -59 8 -56 L7 -30 L-7 -30Z" fill="{INK}"/>'
             f'<path d="M-4 -31 L-6 0 M4 -31 L7 0" stroke="{INK}" stroke-width="4.2" stroke-linecap="round"/>'
             f'<path d="M-7 -52 L-10 -30 M7 -52 L36 -70" stroke="{INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M-10 -56 L-2 -62 L12 -62 L14 -56Z" fill="{SUN2}"/></g>')
    o.append(big(fg, 560, fy + 20, 1.6))
    return svg(o)

def tours_b():
    """Option B: a small group walking a marked trail behind a guide with a flag; trail markers on rocks."""
    o = [sun(230, 150, 66, SUN2)]
    o += hills_min((MIST, SAGE, SUN), (248, 296, 340))
    o.append(layer(wave(330, 16, 1.3, 4.4), DSAGE, 'dw', .9))
    g = wave(376, 12, 1.0, 1.0)
    o.append(layer(g, LIME, 'st', .9))
    # the path
    c = bezier((-30, 470), (300, 400), (700, 420), (1230, 384), 60)
    o.append(ribbon(c, [30] * 61, CREAM))
    o.append(f'<path d="{"M" + " L".join(f"{x:.0f},{y:.0f}" for x, y in c[::3])}" stroke="{SUN2}" stroke-width="1.4" fill="none" stroke-dasharray="10 8"/>')
    # a trail-marker rock
    o.append(f'<g transform="translate(300,396) scale(1.5)"><path d="M-22 10 C-24 -8 -8 -18 6 -14 C20 -12 24 2 20 10Z" fill="{SAND}" filter="url(#paperS)"/><path d="M-6 -12 H6 V6 H-6Z" fill="{WHITE}"/><path d="M-6 -6 H6 V0 H-6Z" fill="{TEAL}"/></g>')
    def walker(x, y, sc, step, flag=False, hat=False):
        hat_s = f'<path d="M-9 -70 L-2 -76 L10 -76 L12 -70Z" fill="{SUN2}"/>' if hat else ''
        flag_s = f'<path d="M14 -54 V-96" stroke="{INK}" stroke-width="2.4"/><path d="M14 -96 L44 -88 L14 -80Z" fill="{SUN2}"/>' if flag else ''
        return (f'<g transform="translate({x},{y}) scale({sc})"><circle cx="0" cy="-64" r="6.5" fill="{INK}"/>'
                f'{hat_s}'
                f'<path d="M-7 -54 C-7 -57 7 -57 7 -54 L6 -28 L-6 -28Z" fill="{INK}"/>'
                f'<path d="M-3 -29 L{-9 - step} 0 M3 -29 L{9 + step} 0" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
                f'<path d="M-6 -50 L-12 -34 M6 -50 L14 -{36 + (18 if flag else 0)}" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>'
                f'{flag_s}</g>')
    o.append(big([walker(760, 420, 1.0, 4, flag=True, hat=True), walker(690, 428, .95, 2), walker(630, 436, .9, 5, hat=True), walker(560, 444, .9, 1)], 660, 440, 1.5))
    return svg(o)

if __name__ == '__main__':
    import sys
    open(sys.argv[2], 'w').write(globals()[sys.argv[1]]())

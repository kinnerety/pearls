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
    # the stream runs down the valley between the two front hills (visible only where the dark hill shows through)
    c = bezier((600, ground_at(mid, 600) - 2), (560, 360), (660, 400), (600, 476), 60)
    wd = [3 + 26 * (i / 60) ** 1.3 for i in range(61)]
    o.append(f'<clipPath id="nc"><path d="{path(mid)}"/></clipPath><g clip-path="url(#nc)">{ribbon(c, wd, MIST, "wv")}</g>')
    o.append(ibex(880, ground_at(right, 880) + 2, 1.35, flip=True))
    o.append(eagle(400, 80, 1.0, -6))
    return svg(o)

def table_scene():
    """A table in front of the view with a cheese plate and two glasses of wine."""
    o = [sun(230, 150, 66, SUN2)]
    o += hills_min((MIST, SAGE, LIME), (248, 296, 350))
    o.append(f'<g filter="url(#paper)"><path d="{path(wave(322, 18, 1.3, 4.4))}" fill="{INK}"/></g>')
    o.append(layer(wave(372, 14, 1.0, 1.0), DSAGE, 'cl', .9))
    tx, ty = 540, 380
    fg = []
    fg.append(f'<g transform="translate({tx},{ty})"><path d="M-110 56 L-98 10 M110 56 L98 10 M-66 56 L-60 10 M66 56 L60 10" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
              f'<g filter="url(#paper)"><path d="M-240 -22 L240 -22 L232 14 L-232 14Z" fill="{CREAM}"/></g><path d="M-232 14 L232 14 L228 24 L-228 24Z" fill="{SAND}"/>')
    # cheese plate: a round white paper, a wheel with a wedge cut, four wedges, a soft log, grapes, two crackers
    grapes = ''.join(f'<circle cx="{gx}" cy="{gy}" r="4" fill="{TEAL}"/>' for gx, gy in [(50,-10),(58,-6),(44,-4),(52,0),(60,2),(56,-14),(48,-16)])
    fg.append(f'<g transform="translate(-40,-2)"><ellipse cx="0" cy="0" rx="86" ry="18" fill="{WHITE}" filter="url(#paperS)"/>'
              f'<ellipse cx="-34" cy="-8" rx="20" ry="7" fill="{SUN}"/><path d="M-34 -16 L-34 -8 L-16 -11Z" fill="{WHITE}"/><ellipse cx="-34" cy="-16" rx="20" ry="7" fill="{SUN2}"/><path d="M-34 -16 L-16 -19 L-16 -11 L-34 -8Z" fill="{SUN}"/>'
              f'<path d="M-22 -4 L6 -22 L10 -4Z" fill="{DYEL}"/><path d="M-6 0 L26 -16 L30 0Z" fill="{SUN}"/><path d="M8 -8 L34 -24 L38 -8Z" fill="{SUN2}"/>'
              f'<path d="M12 6 L40 -2 L42 6 L14 12Z" fill="{WHITE}" stroke="{SAND}" stroke-width="1.2"/>'
              f'<circle cx="0" cy="-14" r="1.6" fill="{WHITE}"/><circle cx="24" cy="-14" r="1.4" fill="{WHITE}"/>'
              f'<rect x="-58" y="2" width="22" height="7" rx="2" fill="{DYEL}"/><rect x="-52" y="8" width="22" height="7" rx="2" fill="{SUN2}"/>{grapes}</g>')
    for gx in (96, 140):
        fg.append(f'<g transform="translate({gx},6)"><path d="M-14 -66 C-14 -42 -8 -32 0 -30 C8 -32 14 -42 14 -66Z" fill="{SKY}" opacity=".75"/>'
                  f'<path d="M-13 -50 C-12 -38 -7 -32 0 -30 C7 -32 12 -38 13 -50Z" fill="{TEAL}"/>'
                  f'<path d="M0 -30 V-4 M-11 -2 H11" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M-10 -60 C-9 -50 -8 -44 -6 -38" stroke="{WHITE}" stroke-width="1.6" opacity=".9"/></g>')
    fg.append('</g>')
    o.append(big(fg, tx, ty + 56, 1.7))
    return svg(o)

def bottles():
    """A row of bottles of different heights and colours with blank labels, and one glass of beer; only their upper parts show."""
    o = ['<g transform="translate(-20,30) scale(1.12)">']
    def bottle(x, h, w, glass, label, lab_y, neck=0.34, cap=INK, shape='wine', lab_h=48):
        # body top at y = 470 - h
        top = 470 - h
        if shape == 'wine':
            body = f'<path d="M{-w/2} 470 V{top + h*neck + 26} C{-w/2} {top + h*neck + 6} {-w*.18:.1f} {top + h*neck} {-w*.18:.1f} {top + h*neck - 10} V{top} H{w*.18:.1f} V{top + h*neck - 10} C{w*.18:.1f} {top + h*neck} {w/2} {top + h*neck + 6} {w/2} {top + h*neck + 26} V470Z"'
            capd = f'<rect x="{-w*.2:.1f}" y="{top - 2}" width="{w*.4:.1f}" height="{h*.11:.0f}" fill="{cap}"/>'
        elif shape == 'whisky':
            body = f'<path d="M{-w/2} 470 V{top + 34} C{-w/2} {top + 22} {-w*.5+4} {top + 18} {-w*.22:.1f} {top + 14} V{top} H{w*.22:.1f} V{top + 14} C{w*.5-4} {top + 18} {w/2} {top + 22} {w/2} {top + 34} V470Z"'
            capd = f'<rect x="{-w*.26:.1f}" y="{top - 6}" width="{w*.52:.1f}" height="12" rx="2" fill="{cap}"/>'
        else:  # beer: short neck
            body = f'<path d="M{-w/2} 470 V{top + 44} C{-w/2} {top + 30} {-w*.2:.1f} {top + 26} {-w*.2:.1f} {top + 14} V{top} H{w*.2:.1f} V{top + 14} C{w*.2:.1f} {top + 26} {w/2} {top + 30} {w/2} {top + 44} V470Z"'
            capd = f'<rect x="{-w*.24:.1f}" y="{top - 3}" width="{w*.48:.1f}" height="9" rx="1.5" fill="{cap}"/>'
        return (f'<g transform="translate({x},0)"><g filter="url(#paper)"><path {body} fill="{glass}"/></g>{capd}'
                f'<path d="M{-w/2 + 5} {top + h*neck + 36} V{466}" stroke="{WHITE}" stroke-width="3" opacity=".55"/>'
                f'<rect x="{-w/2 + 7}" y="{lab_y}" width="{w - 14}" height="{lab_h}" rx="3" fill="{label}" filter="url(#paperS)"/>'
                f'<circle cx="0" cy="{lab_y + lab_h*.42:.0f}" r="{lab_h*.17:.0f}" fill="none" stroke="{INK}" stroke-width="1.2" opacity=".55"/>'
                f'<path d="M{-w/2 + 16} {lab_y + lab_h*.76:.0f} H{w/2 - 16} M{-w/2 + 22} {lab_y + lab_h*.9:.0f} H{w/2 - 22}" stroke="{INK}" stroke-width="1.2" opacity=".45"/></g>')
    # from left: red wine (dark bottle), whisky, white wine (pale), beer, tall rosé-ish, a second whisky
    # packed shoulder to shoulder from the left; the glass sits among them; more kinds towards the right
    specs = [dict(h=290, w=76, glass=INK, label=SUN2, lab_y=312, lab_h=64),
             dict(h=230, w=86, glass=DYEL, label=TEAL, lab_y=296, shape='whisky', lab_h=72),
             dict(h=300, w=74, glass=LIME, label=SKY, lab_y=302, cap=TEAL, lab_h=62),
             dict(h=212, w=66, glass=DSAGE, label=SUN, lab_y=308, shape='beer', cap=DYEL, lab_h=54),
             dict(h=260, w=72, glass=SKY, label=DYEL, lab_y=336, cap=INK, lab_h=58),
             dict(h=198, w=94, glass=TEAL, label=CREAM, lab_y=306, shape='whisky', cap=DYEL, lab_h=60),
             dict(h=206, w=64, glass=LIME, label=SUN2, lab_y=318, shape='beer', cap=INK, lab_h=52),
             dict(h=236, w=70, glass=CREAM, label=TEAL, lab_y=330, cap=INK, lab_h=56),
             'glass',
             dict(h=222, w=90, glass=SUN, label=DSAGE, lab_y=322, shape='whisky', cap=INK, lab_h=58),
             dict(h=250, w=72, glass=DSAGE, label=CREAM, lab_y=338, cap=DYEL, lab_h=56),
             dict(h=282, w=58, glass=MIST, label=SKY, lab_y=320, cap=TEAL, lab_h=60),            # tall slim gin
             dict(h=190, w=84, glass=WHITE, label=TEAL, lab_y=334, shape='whisky', cap=SKY, lab_h=52),  # squat arak
             dict(h=244, w=66, glass=SAND, label=DYEL, lab_y=330, cap=INK, lab_h=54),
             dict(h=216, w=76, glass=TEAL, label=SUN, lab_y=326, shape='beer', cap=DYEL, lab_h=52)]
    x = 40; glass_x = 0
    for sp in specs:
        if sp == 'glass':
            glass_x = x + 40; x += 82; continue
        w = sp.pop('w'); h = sp.pop('h'); g = sp.pop('glass'); lab = sp.pop('label'); ly = sp.pop('lab_y')
        o.append(bottle(x + w / 2, h, w, g, lab, ly, **sp)); x += w + 1
    # a pilsner glass: wide at the top, narrowing to a small foot
    o.append(f'<g transform="translate({glass_x},0)"><g filter="url(#paper)"><path d="M-40 236 H40 C40 300 24 350 20 420 L22 456 H-22 L-20 420 C-24 350 -40 300 -40 236Z" fill="{DYEL}"/></g>'
             f'<path d="M-40 236 H40 C40 252 38 262 36 272 H-36 C-38 262 -40 252 -40 236Z" fill="{WHITE}"/><ellipse cx="0" cy="236" rx="40" ry="10" fill="{WHITE}"/><circle cx="-18" cy="228" r="10" fill="{WHITE}"/><circle cx="8" cy="226" r="12" fill="{WHITE}"/><circle cx="28" cy="232" r="8" fill="{WHITE}"/>'
             f'<path d="M-28 284 C-26 330 -18 380 -14 440" stroke="{WHITE}" stroke-width="4" fill="none" opacity=".6"/><circle cx="8" cy="330" r="2.5" fill="{WHITE}" opacity=".8"/><circle cx="-4" cy="380" r="2" fill="{WHITE}" opacity=".8"/><circle cx="16" cy="300" r="2" fill="{WHITE}" opacity=".8"/><circle cx="4" cy="420" r="2.2" fill="{WHITE}" opacity=".8"/></g>')
    o.append('</g>')
    return svg(o)

def carpentry():
    """Inside a carpentry shop: a pegboard wall with tools, a workbench with a vice and a plane, planks leaning in the corner, sawdust."""
    o = []
    # floor: plank boards
    o.append(f'<g filter="url(#paper)"><path d="M-30 384 H1230 V470 H-30Z" fill="{SAND}"/></g>')
    o.append(''.join(f'<path d="M-30 {384 + k*22} H1230" stroke="{CREAM}" stroke-width="2"/>' for k in range(1, 4)))
    # pegboard on the left wall
    o.append(f'<g filter="url(#paper)"><rect x="40" y="60" width="430" height="250" rx="8" fill="{CREAM}"/></g>')
    o.append(''.join(f'<circle cx="{64 + i*24}" cy="{84 + j*24}" r="2" fill="{SAND}"/>' for i in range(17) for j in range(10)))
    # tools hanging: hand saw, hammer, mallet, chisel, try square, clamp, screwdriver
    saw_teeth = ''.join(f'<path d="M{-70 + k*9} 12 L{-66 + k*9} 18 L{-62 + k*9} 12Z" fill="{SKY}"/>' for k in range(14))
    o.append(f'<g transform="translate(150,150) rotate(-24)"><path d="M-72 -14 L56 -14 L56 12 L-72 12Z" fill="{SKY}"/>{saw_teeth}<path d="M56 -20 C84 -20 86 16 56 16 L62 8 L72 8 L72 -10 L62 -10Z" fill="{INK}"/></g>')
    o.append(f'<g transform="translate(290,120)"><path d="M0 0 V110" stroke="{INK}" stroke-width="9" stroke-linecap="round"/><rect x="-26" y="-18" width="52" height="26" rx="4" fill="{TEAL}"/><path d="M-26 -8 L-40 -22 L-30 -26 L-18 -18Z" fill="{TEAL}"/></g>')
    o.append(f'<g transform="translate(372,128)"><path d="M0 0 V98" stroke="{INK}" stroke-width="8" stroke-linecap="round"/><rect x="-24" y="-30" width="48" height="34" rx="6" fill="{DYEL}"/></g>')
    o.append(f'<g transform="translate(436,110)"><path d="M0 0 V70" stroke="{INK}" stroke-width="10" stroke-linecap="round"/><path d="M-5 70 L5 70 L3 120 L-3 120Z" fill="{SKY}"/></g>')
    o.append(f'<g transform="translate(110,250)"><path d="M0 0 H120 V14 H14 V58 H0Z" fill="{DYEL}"/><path d="M14 14 H108 M14 28 H40" stroke="{INK}" stroke-width="1.4" opacity=".5"/></g>')
    o.append(f'<g transform="translate(240,232)"><path d="M0 0 H16 V70 H0Z" fill="{INK}"/><path d="M0 0 H56 V14 H0Z M0 56 H56 V70 H0Z" fill="{INK}"/><path d="M48 14 V56" stroke="{TEAL}" stroke-width="6"/><path d="M30 56 V30" stroke="{TEAL}" stroke-width="4"/><rect x="40" y="18" width="22" height="22" rx="3" fill="{DYEL}"/></g>')
    # planks leaning in the corner, right of the board
    o.append(f'<g transform="translate(560,0)"><g filter="url(#paper)"><path d="M-60 384 L10 150 L34 150 L-36 384Z" fill="{CREAM}"/><path d="M-30 384 L50 140 L74 140 L-6 384Z" fill="{SUN}"/><path d="M4 384 L80 160 L102 160 L26 384Z" fill="{CREAM}"/></g>'
             f'<path d="M-46 370 L18 160 M12 370 L84 170" stroke="{SUN2}" stroke-width="1.4" opacity=".8"/></g>')
    # workbench: thick top, two trestles, a vice at the left end
    bx, by = 800, 330
    nails = ''.join(f'<g transform="translate({cx},{cy}) rotate({ca})"><path d="M-14 0 H14" stroke="{INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M-14 -2.5 V2.5" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/></g>' for cx, cy, ca in [(150,-14,10),(175,-10,-25),(165,-20,60),(200,-12,-5),(190,-22,30),(215,-18,80)])
    o.append(f'<g transform="translate({bx},{by})"><path d="M-220 20 L-240 140 M-180 20 L-160 140 M180 20 L160 140 M220 20 L240 140 M-230 90 H-170 M170 90 H230" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
             f'<g filter="url(#paper)"><rect x="-300" y="-8" width="600" height="30" rx="3" fill="{DYEL}"/></g><path d="M-290 4 H290 M-290 12 H140" stroke="{SUN2}" stroke-width="1.6" opacity=".9"/>'
             # vice
             f'<path d="M-300 -6 H-250 V-40 H-300Z" fill="{INK}"/><path d="M-250 -36 H-214 V-10 H-250Z" fill="{TEAL}"/><path d="M-214 -24 H-180 M-180 -34 V-14" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>'
             # board on the bench being planed, the plane, shavings
             f'<g filter="url(#paperS)"><path d="M-170 -8 L120 -8 L120 -26 L-170 -26Z" fill="{CREAM}"/></g><path d="M-160 -17 H110" stroke="{SUN2}" stroke-width="1.2"/>'
             f'<g transform="translate(-30,-26)"><path d="M-48 0 L48 0 L42 -22 L-42 -22Z" fill="{TEAL}"/><path d="M-12 -22 C-12 -40 12 -40 12 -22Z" fill="{INK}"/><path d="M-34 -22 V-36" stroke="{INK}" stroke-width="6" stroke-linecap="round"/><path d="M22 -22 L28 -34" stroke="{INK}" stroke-width="3" stroke-linecap="round"/></g>'
             f'{nails}'
             f'<path d="M-120 -26 h40 M-90 -32 h26" stroke="{INK}" stroke-width="1.4" opacity=".4"/></g>')
    # sawdust pile and a few curls on the floor
    o.append(''.join(f'<path transform="translate({cx},{cy}) rotate({ca})" d="M0 0 C10 -16 24 -12 16 2 C12 10 0 8 0 0Z" fill="{SUN2}"/>' for cx, cy, ca in [(640,450,15),(700,462,-30)]))
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

def tractor(x, gy, sc=1.0, flip=False):
    f = ' scale(-1,1)' if flip else ''
    return (f'<g transform="translate({x},{gy}) scale({sc}){f}">'
            f'<circle cx="-46" cy="-34" r="34" fill="{INK}"/><circle cx="-46" cy="-34" r="20" fill="{SUN2}"/><circle cx="-46" cy="-34" r="7" fill="{INK}"/>'
            f'<circle cx="46" cy="-20" r="20" fill="{INK}"/><circle cx="46" cy="-20" r="11" fill="{SUN2}"/><circle cx="46" cy="-20" r="4" fill="{INK}"/>'
            f'<path d="M-30 -58 L-30 -106 L-12 -106 L-12 -58Z" fill="{TEAL}"/><path d="M-30 -70 L10 -70 L16 -40 L70 -40 L70 -22 L-10 -22 L-10 -44 L-30 -44Z" fill="{TEAL}"/>'
            f'<path d="M-24 -102 L-18 -102 L-18 -88 L-24 -88Z" fill="{SKY}"/><path d="M8 -52 L56 -52 L60 -40 L8 -40Z" fill="{SKY}"/>'
            f'<path d="M-8 -82 L-8 -70" stroke="{INK}" stroke-width="3"/><path d="M-6 -84 L2 -84" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
            f'<rect x="-30" y="-44" width="8" height="10" fill="{INK}"/><path d="M62 -32 L74 -32" stroke="{INK}" stroke-width="4"/></g>')

def agriculture():
    """Patchwork fields of the valley with a tractor at work and a dust of cream behind it."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(242, 16, 1.2, 0.8), MIST, 'wv'))
    o.append(layer(wave(262, 18, 1.0, 2.4), SAGE, 'dw'))
    # valley patchwork: strips of fields in alternating colours, each with its own hand-drawn pattern
    fields = [(292, LIME, 'st'), (318, SUN, 'sa'), (346, DSAGE, 'cl'), (376, DYEL, 'di'), (410, LIME, 'st')]
    for k, (y, c, p) in enumerate(fields):
        pts = wave(y, 5, 1.0, k * 1.3)
        o.append(layer(pts, c, p, .5 if p == 'di' else .9))
    # furrows on the front field
    o.append(''.join(f'<path d="M{x} 470 L{x + 60} 414" stroke="{WHITE}" stroke-width="2" stroke-linecap="round"/>' for x in range(-20, 1240, 40)))
    # cypress line far away, a water tower
    o.append(''.join(f'<path d="M{x} {ground_at(wave(262, 18, 1.0, 2.4), x) + 2} C{x+5} {ground_at(wave(262, 18, 1.0, 2.4), x) - 14} {x+5} {ground_at(wave(262, 18, 1.0, 2.4), x) - 30} {x} {ground_at(wave(262, 18, 1.0, 2.4), x) - 40} C{x-5} {ground_at(wave(262, 18, 1.0, 2.4), x) - 30} {x-5} {ground_at(wave(262, 18, 1.0, 2.4), x) - 14} {x} {ground_at(wave(262, 18, 1.0, 2.4), x) + 2}Z" fill="{INK}"/>' for x in (560, 580, 596, 640, 660)))
    o.append(f'<g transform="translate(130,254)"><path d="M-8 0 V-30 M8 0 V-30 M-10 -8 H10" stroke="{INK}" stroke-width="3"/><rect x="-16" y="-52" width="32" height="22" rx="3" fill="{INK}"/></g>')
    o.append(f'<ellipse cx="1060" cy="400" rx="150" ry="16" fill="{CREAM}" opacity=".9"/>')
    o.append(tractor(900, 404, 1.7, flip=True))
    return svg(o)

def flamingo(x, gy, sc=1.0, head_down=False, flip=False):
    f = ' scale(-1,1)' if flip else ''
    if head_down:
        neck = 'M16 -50 C40 -56 48 -34 40 -18 C36 -10 32 -6 30 -2'
        head = f'<g transform="translate(30,-2)"><ellipse cx="0" cy="0" rx="8" ry="6" fill="{PINK}"/><circle cx="2" cy="-2" r="1.3" fill="{INK}"/><path d="M6 2 C12 2 14 8 12 14 C8 12 6 8 2 6Z" fill="{INK}"/><path d="M4 2 C6 2 8 4 8 6 L4 5Z" fill="{WHITE}"/></g>'
    else:
        neck = 'M18 -52 C26 -72 40 -92 36 -116'
        head = f'<g transform="translate(36,-116)"><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="{PINK}"/><path d="M6 -2 C14 0 18 6 16 12 L6 6Z" fill="{INK}"/><path d="M6 -2 C9 -1 11 1 11 3 L6 2Z" fill="{WHITE}"/><circle cx="-2" cy="-2" r="1.4" fill="{INK}"/></g>'
    return (f'<g transform="translate({x},{gy}) scale({sc}){f}">'
            f'<path d="M-6 -46 L-10 0 M10 -46 L14 -30 L8 0" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            f'<path d="M-28 -50 C-30 -66 -8 -74 12 -68 C26 -64 28 -52 22 -44 C12 -34 -10 -34 -22 -40 C-28 -43 -29 -47 -28 -50Z" fill="{PINK}" filter="url(#paperS)"/>'
            f'<path d="M-18 -56 C-6 -62 10 -62 18 -56 C10 -50 -6 -50 -18 -56Z" fill="{WHITE}" opacity=".7"/><path d="M-28 -50 L-40 -44 L-26 -44Z" fill="{INK}"/>'
            f'<path d="{neck}" stroke="{PINK}" stroke-width="6" fill="none" stroke-linecap="round"/>{head}</g>')

PINK = '#F2C7C7'   # the one off-palette tint: a pale flamingo pink, kept very soft

def animals():
    """A flock of flamingos standing in the salt ponds."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(236, 14, 1.2, 0.8), MIST, 'wv'))
    # salt-pond dykes and still water in bands
    o.append(layer(wave(254, 6, 1.0, 1.0), SAND, None))
    o.append(layer(wave(264, 6, 1.0, 1.5), SKY, 'ww', .7))
    o.append(layer(wave(318, 6, 1.0, 2.2), WHITE, None))
    o.append(layer(wave(328, 6, 1.0, 2.8), MIST, 'wv'))
    # salt mounds in the far pond
    r = random.Random(9)
    birds_ = []
    poses = [(0, 0), (1, 1), (0, 1), (1, 0), (0, 0), (1, 1), (0, 1), (0, 0), (1, 0), (0, 1), (1, 1), (0, 0), (1, 0), (0, 1)]
    for k, x in enumerate([110, 180, 250, 330, 400, 470, 560, 640, 720, 800, 880, 960, 1050, 1140]):
        y = 420 + r.uniform(-30, 30); sc = .9 + (y - 390) / 120
        hd, fl = poses[k]
        birds_.append((y, flamingo(x, y, sc, head_down=bool(hd), flip=bool(fl))))
    far = [(300 + r.uniform(0, 14), flamingo(x, 300 + r.uniform(0, 14), .45, head_down=(i % 3 != 1), flip=(i % 2 == 0))) for i, x in enumerate((520, 560, 600, 650, 690, 760, 820, 900, 950, 1010, 1080))]
    for _, b in sorted(far + birds_, key=lambda t: t[0]):
        o.append(b)
    # reflections: soft white ripples under the near birds
    o.append(''.join(f'<ellipse cx="{x}" cy="{y + 4:.0f}" rx="22" ry="3" fill="{WHITE}" opacity=".7"/>' for x, y in [(120, 422), (330, 430), (560, 416), (720, 438)]))
    return svg(o)

def shop():
    """A sweet little housewares shop: shelves with mugs, bowls, jugs, a plant, a hanging sign."""
    o = []
    o.append(f'<g filter="url(#paper)"><path d="M-30 400 H1230 V470 H-30Z" fill="{SAND}"/></g>')
    # the shop wall: a cream rectangle on the left with two shelves and a counter
    o.append(f'<g filter="url(#paper)"><rect x="30" y="40" width="620" height="360" rx="10" fill="{CREAM}"/></g>')
    o.append(f'<rect x="30" y="40" width="620" height="360" rx="10" fill="url(#dw)" opacity=".5"/>')
    def shelf(y, x0=70, w=540):
        return f'<g filter="url(#paperS)"><rect x="{x0}" y="{y}" width="{w}" height="12" rx="2" fill="{DYEL}"/></g><path d="M{x0 + 30} {y + 12} L{x0 + 18} {y + 34} M{x0 + w - 30} {y + 12} L{x0 + w - 18} {y + 34}" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
    def mug(x, y, c, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><rect x="-16" y="-30" width="32" height="30" rx="4" fill="{c}"/><path d="M16 -22 C30 -22 30 -8 16 -8" stroke="{c}" stroke-width="5" fill="none"/><ellipse cx="0" cy="-30" rx="16" ry="4" fill="{WHITE}"/><path d="M-8 -20 H6" stroke="{WHITE}" stroke-width="2" opacity=".8"/></g>'
    def bowl(x, y, c, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><path d="M-30 -22 C-30 -4 -16 0 0 0 C16 0 30 -4 30 -22Z" fill="{c}"/><ellipse cx="0" cy="-22" rx="30" ry="6" fill="{WHITE}"/><path d="M-22 -14 Q0 -10 22 -14" stroke="{WHITE}" stroke-width="2" fill="none" opacity=".8"/></g>'
    def jug(x, y, c, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><path d="M-18 0 C-26 -20 -24 -40 -14 -52 L-16 -62 L8 -62 L6 -52 C18 -40 20 -20 14 0Z" fill="{c}"/><path d="M14 -40 C30 -40 30 -16 14 -14" stroke="{c}" stroke-width="5" fill="none"/><path d="M-10 -62 L-4 -70 L6 -62" fill="{c}"/><circle cx="-4" cy="-30" r="5" fill="{WHITE}"/></g>'
    def plant(x, y, sc=1.0):
        leaves = ''.join(f'<path transform="rotate({a})" d="M0 0 C6 -14 10 -28 0 -42 C-10 -28 -6 -14 0 0Z" fill="{DSAGE if a % 2 else SAGE}"/>' for a in (-50, -25, 0, 25, 50))
        return f'<g transform="translate({x},{y}) scale({sc})"><path d="M-16 0 L-12 -26 H12 L16 0Z" fill="{SKY}"/><g transform="translate(0,-26)">{leaves}</g></g>'
    def candle(x, y, c):
        return f'<g transform="translate({x},{y})"><rect x="-8" y="-34" width="16" height="34" rx="2" fill="{c}"/><path d="M0 -34 V-40" stroke="{INK}" stroke-width="1.6"/><path d="M0 -40 C-4 -46 4 -50 0 -54 C2 -48 -2 -46 0 -40Z" fill="{SUN2}"/></g>'
    def plates(x, y, c, n=5, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})">' + ''.join(f'<path d="M-30 {-4 - k*7} H30 L26 {-k*7} H-26Z" fill="{c if k % 2 else WHITE}"/>' for k in range(n)) + '</g>'
    def bowls_stack(x, y, c, n=3, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})">' + ''.join(f'<path d="M-22 {-12 - k*9} C-22 {-2 - k*9} -10 {-k*9} 0 {-k*9} C10 {-k*9} 22 {-2 - k*9} 22 {-12 - k*9}Z" fill="{c}"/><ellipse cx="0" cy="{-12 - k*9}" rx="22" ry="4" fill="{WHITE}"/>' for k in range(n)) + '</g>'
    def towels(x, y, cols, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})">' + ''.join(f'<rect x="-28" y="{-12 - k*12}" width="56" height="11" rx="3" fill="{c}"/><path d="M-20 {-6 - k*12} H20" stroke="{WHITE}" stroke-width="1.6" opacity=".8"/>' for k, c in enumerate(cols)) + '</g>'
    def cloths(x, y, cols, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})">' + ''.join(f'<rect x="-34" y="{-8 - k*8}" width="68" height="7" rx="2" fill="{c}"/><path d="M-30 {-4 - k*8} H30" stroke="{INK}" stroke-width="1" opacity=".25" stroke-dasharray="3 3"/>' for k, c in enumerate(cols)) + '</g>'
    def bag(x, y, c, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><path d="M-10 -40 C-10 -58 10 -58 10 -40" stroke="{INK}" stroke-width="3" fill="none"/><path d="M-22 -42 H22 L26 0 H-26Z" fill="{c}"/><path d="M-14 -24 H14" stroke="{WHITE}" stroke-width="2.5" opacity=".9"/></g>'
    def candlestick(x, y, c, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><path d="M-10 0 H10 L6 -6 H-6Z" fill="{c}"/><path d="M0 -6 V-30" stroke="{c}" stroke-width="5"/><path d="M-7 -30 H7 L5 -38 H-5Z" fill="{c}"/><rect x="-3.5" y="-58" width="7" height="20" fill="{WHITE}"/><path d="M0 -58 C-3 -64 3 -68 0 -72 C2 -66 -2 -64 0 -58Z" fill="{SUN2}"/></g>'
    def stool(x, y, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc})"><rect x="-26" y="-6" width="52" height="8" rx="3" fill="{DYEL}"/><path d="M-20 2 L-24 34 M20 2 L24 34 M-20 18 H20" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/></g>'
    o.append(shelf(130)); o.append(shelf(240))
    # a second unit on the right, below the title: two shelves and a stool
    o.append(f'<g filter="url(#paper)"><rect x="690" y="280" width="500" height="120" rx="10" fill="{CREAM}"/></g>')
    o.append(shelf(300, 720, 440)); o.append(shelf(360, 720, 440))
    o.append(towels(770, 300, (SKY, SUN2, DSAGE, SKY))); o.append(bag(860, 300, TEAL)); o.append(plates(940, 300, SKY)); o.append(candlestick(1010, 300, DYEL)); o.append(candlestick(1040, 300, TEAL, .85)); o.append(mug(1110, 300, SUN2))
    o.append(cloths(790, 360, (SUN, LIME, SKY))); o.append(bowls_stack(880, 360, DSAGE)); o.append(bag(960, 360, SUN2, .9)); o.append(towels(1050, 360, (TEAL, SUN, SKY))); o.append(jug(1130, 360, LIME, .8))

    o.append(mug(120, 130, SKY)); o.append(mug(170, 130, SUN2, .9)); o.append(bowl(250, 130, TEAL)); o.append(jug(330, 130, LIME)); o.append(plant(410, 130, .9)); o.append(mug(480, 130, DSAGE, 1.1)); o.append(candle(540, 130, SUN))
    def picture(x, y, fc, inner, sc=1.0):
        return f'<g transform="translate({x},{y}) scale({sc}) rotate(-3)"><rect x="-26" y="-40" width="52" height="40" rx="2" fill="{fc}"/><rect x="-20" y="-34" width="40" height="28" fill="{PAPER}"/>{inner}</g>'
    o.append(picture(100, 240, DYEL, f'<path d="M-20 -14 Q-6 -28 6 -16 T20 -14 V-6 H-20Z" fill="{SAGE}"/><circle cx="10" cy="-26" r="4" fill="{SUN2}"/>'))
    o.append(picture(158, 240, TEAL, f'<path d="M-20 -6 Q0 -34 20 -6Z" fill="{SKY}"/><path d="M0 -30 V-8" stroke="{INK}" stroke-width="2"/>', .9))
    o.append(candlestick(215, 240, SKY, .9)); o.append(candlestick(240, 240, DYEL, 1.0)); o.append(candlestick(265, 240, TEAL, .8))
    o.append(f'<g transform="translate(300,240)"><rect x="-10" y="-26" width="20" height="26" rx="3" fill="{SKY}"/>' + ''.join(f'<path d="M0 -26 L{dx} -44" stroke="{DSAGE}" stroke-width="2"/><circle cx="{dx}" cy="-46" r="4" fill="{c}"/>' for dx, c in [(-10, SUN2), (0, DYEL), (10, SUN2)]) + '</g>'); o.append(jug(330, 240, TEAL, 1.0)); o.append(plant(400, 240, 1.0)); o.append(towels(470, 240, (SUN2, TEAL, SKY))); o.append(candlestick(530, 240, TEAL)); o.append(bag(590, 240, DSAGE, .9))
    # counter with a little cash box and a vase
    o.append(f'<g filter="url(#paper)"><rect x="60" y="330" width="560" height="70" rx="6" fill="{TEAL}"/></g><rect x="60" y="330" width="560" height="14" fill="{DYEL}"/>')
    o.append(f'<rect x="100" y="302" width="40" height="28" rx="3" fill="{INK}"/><rect x="104" y="306" width="32" height="8" fill="{SKY}"/>')
    o.append(jug(520, 330, SUN2, 1.0)); o.append(plant(560, 330, .8))
    # hanging sign: a yellow board with a little heart cut-out, on two strings
    # the yellow box with the heart sits on the counter; a stack of bowls and three nested mugs beside it
    o.append(f'<g transform="translate(250,282)"><g filter="url(#paper)"><rect x="-70" y="0" width="140" height="48" rx="6" fill="{SUN2}"/></g>'
             f'<path d="M0 32 C-14 20 -18 10 -6 8 C0 6 0 12 0 12 C0 12 0 6 6 8 C18 10 14 20 0 32Z" fill="{INK}"/></g>')
    o.append(bowls_stack(370, 330, SKY, 4, 1.1))
    o.append(f'<g transform="translate(440,330)">{mug(0, 0, TEAL, 1.1)}{mug(6, -8, SUN2, .95)}{mug(11, -15, SKY, .8)}</g>')
    o.append(cloths(585, 130, (SKY, SUN2, DSAGE, LIME), 1.0))
    # outside: a bicycle leaning? keep it minimal: a potted olive by the door on the right of the wall
    return svg(o)

def culture():
    """Paintings hanging on a wall of Armenian tiles."""
    o = []
    # tiled wall: a grid of blue-and-white tiles with a simple flower motif, as paper cutouts
    tile = (f'<rect x="0" y="0" width="60" height="60" fill="{WHITE}"/><rect x="2" y="2" width="56" height="56" rx="4" fill="none" stroke="{SKY}" stroke-width="2"/>'
            f'<circle cx="30" cy="30" r="7" fill="{SUN2}"/>' + ''.join(f'<ellipse transform="translate(30,30) rotate({a})" cx="0" cy="-16" rx="5" ry="9" fill="{TEAL}"/>' for a in (0, 60, 120, 180, 240, 300)) +
            ''.join(f'<path transform="translate(30,30) rotate({a})" d="M0 -27 C4 -24 4 -20 0 -18 C-4 -20 -4 -24 0 -27Z" fill="{SKY}"/>' for a in (30, 90, 150, 210, 270, 330)) +
            ''.join(f'<circle cx="{cx}" cy="{cy}" r="2.6" fill="{SKY}"/>' for cx, cy in [(8,8),(52,8),(8,52),(52,52)]))
    o.append(f'<pattern id="tl" width="60" height="60" patternUnits="userSpaceOnUse">{tile}</pattern>')
    o.append(f'<g filter="url(#paper)"><rect x="-30" y="-10" width="1260" height="480" fill="{WHITE}"/></g><rect x="-30" y="-10" width="1260" height="480" fill="url(#tl)"/>')
    # the title needs calm behind it: a paper panel on the right
    o.append(f'<g filter="url(#paper)"><rect x="680" y="60" width="580" height="230" rx="12" fill="{PAPER}" opacity=".94"/></g>')
    def frame(x, y, w, h, fc, inner):
        return (f'<g transform="translate({x},{y})"><path d="M{w/2} -40 L0 0 L{-w/2 - 4} -40" stroke="{INK}" stroke-width="1.6" fill="none"/>'
                f'<g filter="url(#paper)"><rect x="{-w/2 - 12}" y="-12" width="{w + 24}" height="{h + 24}" rx="4" fill="{fc}"/></g><rect x="{-w/2}" y="0" width="{w}" height="{h}" fill="{PAPER}"/>{inner}</g>')
    # three small landscapes in frames: hills, a cypress, an ibex sign
    p1 = (f'<path d="M-70 60 Q-30 20 0 48 T70 44 V90 H-70Z" fill="{SAGE}"/><path d="M-70 70 Q-20 50 10 70 T70 66 V90 H-70Z" fill="{INK}"/><circle cx="34" cy="26" r="12" fill="{SUN2}"/>')
    p2 = (f'<path d="M-50 150 V124 Q0 96 50 124 V150Z" fill="{LIME}"/><path d="M0 24 C8 46 10 90 0 128 C-10 90 -8 46 0 24Z" fill="{DSAGE}"/><path d="M0 28 V126" stroke="{WHITE}" stroke-width="1.6"/>')
    p3 = (f'<rect x="-80" y="0" width="160" height="60" fill="{SKY}"/><path d="M-80 60 Q0 34 80 60 V70 H-80Z" fill="{SUN}"/>' + ibex(10, 60, .7))
    o.append(frame(160, 150, 140, 90, DYEL, p1))
    o.append(frame(330, 120, 100, 150, INK, p2))
    o.append(frame(560, 170, 160, 70, TEAL, p3))
    # a wooden bench below the paintings
    o.append(f'<g transform="translate(360,372)"><g filter="url(#paper)"><rect x="-170" y="-40" width="340" height="12" rx="3" fill="{DYEL}"/><rect x="-170" y="-22" width="340" height="10" rx="3" fill="{DYEL}"/><rect x="-176" y="0" width="352" height="16" rx="3" fill="{DYEL}"/></g>'
             f'<path d="M-150 -46 V0 M150 -46 V0" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M-150 16 L-158 70 M150 16 L158 70 M-120 16 L-116 70 M120 16 L116 70" stroke="{INK}" stroke-width="6" stroke-linecap="round"/></g>')
    return svg(o)

def coffee_cart():
    """A coffee cart in a quiet landscape: the cart with its awning, a chalk board, two stools."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(246, 18, 1.2, 0.8), MIST, 'wv'))
    o.append(layer(wave(278, 24, 1.0, 2.4, x0=-30, x1=820, taper=.3, drop=400), SAGE, 'dw'))
    o.append(f'<g filter="url(#paper)"><path d="{path(wave(322, 16, 1.3, 4.4))}" fill="{INK}"/></g>')
    g = wave(372, 12, 1.0, 1.0)
    o.append(layer(g, LIME, 'st', .9))
    o.append(oak(1110, 452, .9, SAGE))
    cx, cy = 480, 440
    o.append(f'<g transform="translate({cx},{cy})">'
             # wheels and body
             f'<circle cx="-110" cy="-20" r="28" fill="{INK}"/><circle cx="-110" cy="-20" r="14" fill="{SUN2}"/><circle cx="-110" cy="-20" r="5" fill="{INK}"/>'
             f'<circle cx="90" cy="-20" r="28" fill="{INK}"/><circle cx="90" cy="-20" r="14" fill="{SUN2}"/><circle cx="90" cy="-20" r="5" fill="{INK}"/>'
             f'<g filter="url(#paper)"><rect x="-150" y="-130" width="270" height="92" rx="6" fill="{SKY}"/></g><rect x="-150" y="-130" width="270" height="12" fill="{WHITE}"/>'
             f'<path d="M-130 -100 H-70 M-130 -84 H-90 M-130 -68 H-80" stroke="{WHITE}" stroke-width="3" stroke-linecap="round"/>'
             # counter top with a coffee machine and two cups
             f'<rect x="-160" y="-138" width="290" height="10" rx="2" fill="{DYEL}"/>'
             f'<rect x="-40" y="-182" width="70" height="44" rx="4" fill="{INK}"/><rect x="-32" y="-174" width="20" height="10" rx="2" fill="{SKY}"/><circle cx="12" cy="-168" r="6" fill="{SUN2}"/><rect x="-20" y="-150" width="14" height="12" fill="{WHITE}"/>'
             f'<g transform="translate(60,-138)"><rect x="-10" y="-16" width="20" height="16" rx="3" fill="{WHITE}"/><path d="M10 -12 C18 -12 18 -4 10 -4" stroke="{WHITE}" stroke-width="3" fill="none"/><path d="M-4 -20 C-6 -26 -2 -28 -4 -34 M2 -20 C0 -26 4 -28 2 -34" stroke="{CREAM}" stroke-width="2" fill="none" stroke-linecap="round"/></g>'
             f'<g transform="translate(90,-138)"><rect x="-10" y="-16" width="20" height="16" rx="3" fill="{SUN2}"/><path d="M10 -12 C18 -12 18 -4 10 -4" stroke="{SUN2}" stroke-width="3" fill="none"/></g>'
             # awning on two posts
             f'<path d="M-150 -148 V-220 M120 -148 V-220" stroke="{INK}" stroke-width="4"/>'
             f'<g filter="url(#paper)"><path d="M-170 -220 H140 L148 -196 H-178Z" fill="{SUN2}"/></g>'
             + ''.join(f'<path d="M{-178 + k*40.75:.0f} -196 Q{-168 + k*40.75:.0f} -182 {-158 + k*40.75:.0f} -196Z" fill="{SUN2 if k % 2 else WHITE}"/>' for k in range(8)) +
             ''.join(f'<rect x="{-170 + k*77.5:.0f}" y="-220" width="38" height="24" fill="{WHITE}"/>' for k in range(0, 4)) +
             # chalkboard leaning on the cart
             '</g>')
    # small round tables with two chairs each, on both sides of the cart
    def cafe_set(x, y, sc=1.0):
        chair = lambda dx, flip: (f'<g transform="translate({dx},0) scale({-1 if flip else 1},1)"><path d="M-14 0 V-30 M14 0 V-30 M-14 -30 H14" stroke="{INK}" stroke-width="3" stroke-linecap="round"/><rect x="-14" y="-28" width="28" height="7" fill="{TEAL}"/>'
                                 f'<rect x="-16" y="-4" width="32" height="8" rx="2" fill="{SKY}"/><path d="M-12 4 L-14 30 M12 4 L14 30" stroke="{INK}" stroke-width="3" stroke-linecap="round"/></g>')
        return (f'<g transform="translate({x},{y}) scale({sc})">{chair(-58, False)}{chair(58, True)}'
                f'<path d="M0 -4 V30 M-16 30 H16" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><g filter="url(#paperS)"><ellipse cx="0" cy="-6" rx="42" ry="9" fill="{DYEL}"/></g>'
                f'<g transform="translate(-8,-8)"><rect x="-7" y="-12" width="14" height="12" rx="2" fill="{WHITE}"/><path d="M7 -9 C13 -9 13 -3 7 -3" stroke="{WHITE}" stroke-width="2.4" fill="none"/></g>'
                f'<g transform="translate(14,-8)"><rect x="-7" y="-12" width="14" height="12" rx="2" fill="{SUN2}"/><path d="M7 -9 C13 -9 13 -3 7 -3" stroke="{SUN2}" stroke-width="2.4" fill="none"/></g></g>')
    o.append(cafe_set(180, 418, 1.0)); o.append(cafe_set(800, 426, 1.05)); o.append(cafe_set(1000, 404, .85))
    return svg(o)

def street():
    """The one urban header: a row of shop fronts (a restaurant, a shop, a barber), a pavement, a lamp and a tree. No words on the signs."""
    o = []
    o.append(f'<g filter="url(#paper)"><path d="M-30 404 H1230 V470 H-30Z" fill="{SAND}"/></g><path d="M-30 404 H1230" stroke="{CREAM}" stroke-width="6"/>')
    o.append(''.join(f'<path d="M{x} 404 V470" stroke="{CREAM}" stroke-width="2"/>' for x in range(-20, 1240, 60)))
    def building(x, w, top, fill, roof=None):
        r = f'<rect x="{x - 8}" y="{top - 14}" width="{w + 16}" height="16" rx="3" fill="{roof}"/>' if roof else ''
        return f'<g filter="url(#paper)"><rect x="{x}" y="{top}" width="{w}" height="{404 - top}" fill="{fill}"/></g>{r}'
    def window(x, y, w, h, c=SKY, bars=True):
        b = f'<path d="M{x + w/2} {y} V{y + h} M{x} {y + h/2} H{x + w}" stroke="{WHITE}" stroke-width="2"/>' if bars else ''
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{c}"/>{b}'
    def door(x, y, w, h, c):
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{c}"/><circle cx="{x + w - 8}" cy="{y + h/2}" r="2.6" fill="{SUN2}"/>'
    def awning(x, y, w, c1, c2=WHITE, n=6):
        seg = w / n
        return (f'<path d="M{x - 6} {y} H{x + w + 6} L{x + w} {y + 18} H{x}Z" fill="{c1}"/>' +
                ''.join(f'<path d="M{x + k*seg:.0f} {y + 18} Q{x + (k + .5)*seg:.0f} {y + 32} {x + (k + 1)*seg:.0f} {y + 18}Z" fill="{c1 if k % 2 else c2}"/>' for k in range(n)))
    def blank_sign(x, y, w, h, c, icon=''):
        return f'<g filter="url(#paperS)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{c}"/></g>{icon}'
    # --- restaurant (left): awning, big window with a table set, two tables on the pavement
    o.append(building(40, 320, 120, CREAM, roof=TEAL))
    o.append(''.join(f'<rect x="{x}" y="140" width="34" height="48" rx="2" fill="{SKY}"/>' for x in (70, 170, 270)))
    o.append(blank_sign(120, 206, 160, 34, DYEL, f'<g transform="translate(200,223)"><path d="M-14 -8 V8 M-18 -8 V-2 C-18 2 -10 2 -10 -2 V-8 M-14 -2 V8" stroke="{INK}" stroke-width="2" stroke-linecap="round"/><path d="M12 -8 V8 M12 -8 C6 -6 6 0 12 1" stroke="{INK}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="0" cy="0" r="7" fill="none" stroke="{INK}" stroke-width="2"/></g>'))
    o.append(awning(60, 248, 280, TEAL))
    o.append(window(70, 284, 150, 110, SKY, False) + f'<path d="M70 320 H220" stroke="{WHITE}" stroke-width="2"/>'
             f'<g transform="translate(145,372)"><rect x="-40" y="-8" width="80" height="8" fill="{WHITE}"/><path d="M-30 0 V20 M30 0 V20" stroke="{INK}" stroke-width="3"/><circle cx="-14" cy="-12" r="7" fill="{WHITE}"/><circle cx="14" cy="-12" r="7" fill="{WHITE}"/><path d="M-2 -26 V-10 M2 -26 V-10" stroke="{WHITE}" stroke-width="2"/></g>')
    o.append(door(250, 294, 60, 110, TEAL) + f'<rect x="258" y="304" width="44" height="50" rx="2" fill="{SKY}"/>')
    for tx in (120, 230):
        o.append(f'<g transform="translate({tx},428)"><path d="M-30 0 H30" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><path d="M0 0 V-30 M-24 -30 H24" stroke="{INK}" stroke-width="3"/><ellipse cx="0" cy="-32" rx="30" ry="7" fill="{WHITE}"/>'
                 f'<g transform="translate(-46,0)"><path d="M-10 0 V-34 M10 0 V-34 M-10 -34 H10 M-12 -16 H12" stroke="{INK}" stroke-width="3" stroke-linecap="round"/><rect x="-11" y="-20" width="22" height="6" fill="{SUN2}"/></g>'
                 f'<g transform="translate(46,0)"><path d="M-10 0 V-34 M10 0 V-34 M-10 -34 H10 M-12 -16 H12" stroke="{INK}" stroke-width="3" stroke-linecap="round"/><rect x="-11" y="-20" width="22" height="6" fill="{SUN2}"/></g></g>')
    # --- shop (middle): display window full of things, a sign with a bag
    o.append(building(380, 280, 160, SUN, roof=DYEL))
    o.append(''.join(f'<rect x="{x}" y="180" width="30" height="44" rx="2" fill="{SKY}"/>' for x in (410, 480, 550, 620)))
    o.append(blank_sign(450, 236, 140, 32, TEAL, f'<g transform="translate(520,252)"><path d="M-6 -4 C-6 -12 6 -12 6 -4" stroke="{WHITE}" stroke-width="2" fill="none"/><path d="M-10 -4 H10 L12 10 H-12Z" fill="{WHITE}"/></g>'))
    o.append(window(400, 290, 150, 110, SKY, False) + f'<rect x="400" y="350" width="150" height="6" fill="{WHITE}"/><rect x="400" y="310" width="150" height="5" fill="{WHITE}"/>'
             f'<rect x="412" y="326" width="22" height="24" rx="3" fill="{SUN2}"/><rect x="444" y="330" width="26" height="20" rx="3" fill="{TEAL}"/><path d="M500 350 V320 H520 V350Z" fill="{DSAGE}"/><circle cx="492" cy="338" r="8" fill="{DYEL}"/>'
             f'<rect x="414" y="296" width="18" height="14" rx="2" fill="{DSAGE}"/><rect x="450" y="290" width="40" height="20" rx="2" fill="{SUN2}"/><circle cx="520" cy="300" r="8" fill="{TEAL}"/>'
             f'<rect x="410" y="360" width="30" height="40" rx="2" fill="{DYEL}"/><rect x="450" y="366" width="40" height="34" rx="2" fill="{SKY}"/><path d="M500 400 V376 H540 V400Z" fill="{SAGE}"/>')
    o.append(door(580, 294, 60, 110, DYEL) + f'<rect x="588" y="304" width="44" height="50" rx="2" fill="{SKY}"/>')
    # --- barber (right, low, so the title keeps its sky): pole, scissors sign, window with a chair and mirror
    o.append(building(700, 300, 262, SKY, roof=INK))
    o.append(blank_sign(760, 236, 180, 30, WHITE, f'<g transform="translate(850,251)"><circle cx="-10" cy="6" r="5" fill="none" stroke="{INK}" stroke-width="2"/><circle cx="10" cy="6" r="5" fill="none" stroke="{INK}" stroke-width="2"/><path d="M-6 2 L12 -12 M6 2 L-12 -12" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/></g>'))
    o.append(window(720, 290, 130, 110, WHITE, False) + f'<rect x="720" y="290" width="130" height="110" fill="none" stroke="{INK}" stroke-width="2"/>'
             f'<g transform="translate(770,398)"><path d="M-22 0 H22 M0 0 V-30" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><rect x="-22" y="-44" width="44" height="16" rx="4" fill="{TEAL}"/><rect x="-18" y="-80" width="36" height="36" rx="5" fill="{TEAL}"/></g>'
             f'<rect x="806" y="302" width="34" height="46" rx="4" fill="{MIST}" stroke="{DYEL}" stroke-width="3"/>')
    o.append(door(870, 294, 60, 110, INK) + f'<rect x="878" y="304" width="44" height="50" rx="2" fill="{SKY}"/>')
    # the barber pole
    o.append(f'<g transform="translate(960,300)"><rect x="-10" y="-30" width="20" height="60" rx="8" fill="{WHITE}"/>' + ''.join(f'<path d="M-10 {y} L10 {y - 10}" stroke="{TEAL if k % 2 else DYEL}" stroke-width="6"/>' for k, y in enumerate(range(-16, 30, 10))) + f'<rect x="-12" y="-36" width="24" height="8" rx="3" fill="{INK}"/><rect x="-12" y="28" width="24" height="8" rx="3" fill="{INK}"/><path d="M12 -8 H24" stroke="{INK}" stroke-width="4"/></g>')
    # a tree in a pavement bed and a street lamp
    o.append(f'<rect x="1050" y="396" width="90" height="12" rx="3" fill="{DSAGE}"/>' + oak(1095, 404, .55, SAGE, acorns=False))
    o.append(f'<g transform="translate(660,0)"><path d="M0 404 V250" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M-12 250 H12" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><path d="M-10 250 L-8 226 H8 L10 250Z" fill="{SUN2}"/><rect x="-14" y="404" width="28" height="6" rx="2" fill="{INK}"/></g>')
    return svg(o)

if __name__ == '__main__':
    import sys
    open(sys.argv[2], 'w').write(globals()[sys.argv[1]]())

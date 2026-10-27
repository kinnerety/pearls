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
              f'<ellipse cx="-50" cy="-8" rx="20" ry="7" fill="{SUN}"/><path d="M-50 -16 L-50 -8 L-32 -11Z" fill="{WHITE}"/><ellipse cx="-50" cy="-16" rx="20" ry="7" fill="{SUN2}"/><path d="M-50 -16 L-32 -19 L-32 -11 L-50 -8Z" fill="{SUN}"/>'
              f'<path d="M-22 -4 L6 -22 L10 -4Z" fill="{DYEL}"/><path d="M-6 0 L26 -16 L30 0Z" fill="{SUN}"/><path d="M8 -8 L34 -24 L38 -8Z" fill="{SUN2}"/>'
              f'<path d="M12 6 L40 -2 L42 6 L14 12Z" fill="{WHITE}" stroke="{SAND}" stroke-width="1.2"/>'
              f'<circle cx="0" cy="-14" r="1.6" fill="{WHITE}"/><circle cx="24" cy="-14" r="1.4" fill="{WHITE}"/>'
              f'<rect x="-76" y="2" width="22" height="7" rx="2" fill="{DYEL}"/><rect x="-70" y="8" width="22" height="7" rx="2" fill="{SUN2}"/>{grapes}</g>')
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
    o.append(bottle(120, 290, 76, INK, SUN2, 300, lab_h=64))
    o.append(bottle(230, 230, 86, DYEL, TEAL, 296, shape='whisky', lab_h=72))
    o.append(bottle(340, 300, 74, LIME, SKY, 302, cap=TEAL, lab_h=62))
    o.append(bottle(445, 212, 66, DSAGE, SUN, 308, shape='beer', cap=DYEL, lab_h=54))
    o.append(bottle(548, 260, 72, SKY, DYEL, 300, cap=INK, lab_h=58))
    o.append(bottle(660, 198, 94, TEAL, CREAM, 306, shape='whisky', cap=DYEL, lab_h=60))
    # a glass of beer with foam
    o.append(f'<g transform="translate(770,0)"><g filter="url(#paper)"><path d="M-36 470 L-30 320 H30 L36 470Z" fill="{DYEL}"/></g>'
             f'<path d="M-30 320 H30 V336 H-31Z" fill="{WHITE}"/><ellipse cx="0" cy="320" rx="30" ry="9" fill="{WHITE}"/><circle cx="-14" cy="314" r="8" fill="{WHITE}"/><circle cx="8" cy="312" r="10" fill="{WHITE}"/><circle cx="22" cy="318" r="7" fill="{WHITE}"/>'
             f'<path d="M-24 346 V460" stroke="{WHITE}" stroke-width="3" opacity=".6"/><circle cx="8" cy="400" r="2.5" fill="{WHITE}" opacity=".8"/><circle cx="-6" cy="430" r="2" fill="{WHITE}" opacity=".8"/><circle cx="14" cy="372" r="2" fill="{WHITE}" opacity=".8"/></g>')
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
    o.append(f'<g transform="translate({bx},{by})"><path d="M-220 20 L-240 140 M-180 20 L-160 140 M180 20 L160 140 M220 20 L240 140 M-230 90 H-170 M170 90 H230" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
             f'<g filter="url(#paper)"><rect x="-300" y="-8" width="600" height="30" rx="3" fill="{DYEL}"/></g><path d="M-290 4 H290 M-290 12 H140" stroke="{SUN2}" stroke-width="1.6" opacity=".9"/>'
             # vice
             f'<path d="M-300 -6 H-250 V-40 H-300Z" fill="{INK}"/><path d="M-250 -36 H-214 V-10 H-250Z" fill="{TEAL}"/><path d="M-214 -24 H-180 M-180 -34 V-14" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>'
             # board on the bench being planed, the plane, shavings
             f'<g filter="url(#paperS)"><path d="M-170 -8 L120 -8 L120 -26 L-170 -26Z" fill="{CREAM}"/></g><path d="M-160 -17 H110" stroke="{SUN2}" stroke-width="1.2"/>'
             f'<g transform="translate(-30,-26)"><path d="M-48 0 L48 0 L42 -22 L-42 -22Z" fill="{TEAL}"/><path d="M-12 -22 C-12 -40 12 -40 12 -22Z" fill="{INK}"/><path d="M-34 -22 V-36" stroke="{INK}" stroke-width="6" stroke-linecap="round"/><path d="M22 -22 L28 -34" stroke="{INK}" stroke-width="3" stroke-linecap="round"/></g>'
             f'{"".join(f"<path transform=\"translate({cx},{cy}) rotate({ca})\" d=\"M0 0 C10 -16 24 -12 16 2 C12 10 0 8 0 0Z\" fill=\"{SUN2}\"/>" for cx, cy, ca in [(140,-16,10),(166,-10,-20),(190,-20,40),(210,-6,80)])}'
             f'<path d="M-120 -26 h40 M-90 -32 h26" stroke="{INK}" stroke-width="1.4" opacity=".4"/></g>')
    # sawdust pile and a few curls on the floor
    o.append(f'<ellipse cx="1030" cy="446" rx="60" ry="10" fill="{SUN}" filter="url(#paperS)"/><ellipse cx="1030" cy="440" rx="34" ry="12" fill="{SUN2}"/>')
    o.append(''.join(f'<path transform="translate({cx},{cy}) rotate({ca})" d="M0 0 C10 -16 24 -12 16 2 C12 10 0 8 0 0Z" fill="{SUN2}"/>' for cx, cy, ca in [(640,450,15),(700,462,-30),(1110,456,50)]))
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
    neck = 'M18 -52 C34 -58 40 -40 30 -24' if head_down else 'M18 -52 C26 -72 40 -92 36 -116'
    head = ('<g transform="translate(30,-24)"><ellipse cx="0" cy="0" rx="9" ry="6" fill="{PINK}"/><path d="M6 2 C12 4 16 10 14 16 L4 10Z" fill="{INK}"/></g>' if head_down
            else '<g transform="translate(36,-116)"><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="{PINK}"/><path d="M6 -2 C14 0 18 6 16 12 L6 6Z" fill="{INK}"/><circle cx="-2" cy="-2" r="1.4" fill="{INK}"/></g>')
    return (f'<g transform="translate({x},{gy}) scale({sc}){f}">'
            f'<path d="M-6 -46 L-10 0 M10 -46 L14 -30 L8 0" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            f'<path d="M-28 -50 C-30 -66 -8 -74 12 -68 C26 -64 28 -52 22 -44 C12 -34 -10 -34 -22 -40 C-28 -43 -29 -47 -28 -50Z" fill="{PINK}" filter="url(#paperS)"/>'
            f'<path d="M-18 -56 C-6 -62 10 -62 18 -56 C10 -50 -6 -50 -18 -56Z" fill="{WHITE}" opacity=".7"/><path d="M-28 -50 L-40 -44 L-26 -44Z" fill="{INK}"/>'
            f'<path d="{neck}" stroke="{PINK}" stroke-width="6" fill="none" stroke-linecap="round"/>{head.replace("{PINK}", PINK).replace("{INK}", INK)}</g>')

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
    o.append(''.join(f'<path d="M{x-26} 258 Q{x} 232 {x+26} 258Z" fill="{WHITE}" filter="url(#paperS)"/>' for x in (900, 980, 1050)))
    r = random.Random(9)
    birds_ = []
    for k, x in enumerate([120, 190, 250, 330, 400, 470, 560, 640, 720, 800]):
        y = 420 + r.uniform(-30, 30); sc = .9 + (y - 390) / 120
        birds_.append((y, flamingo(x, y, sc, head_down=(k % 3 == 1), flip=(k % 4 == 2))))
    far = [(300 + r.uniform(0, 14), flamingo(x, 300 + r.uniform(0, 14), .45, head_down=(x % 2 == 0))) for x in (520, 560, 600, 650, 690)]
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
    o.append(shelf(130)); o.append(shelf(240))
    o.append(mug(120, 130, SKY)); o.append(mug(170, 130, SUN2, .9)); o.append(bowl(250, 130, TEAL)); o.append(jug(330, 130, LIME)); o.append(plant(410, 130, .9)); o.append(mug(480, 130, DSAGE, 1.1)); o.append(candle(540, 130, SUN)); o.append(candle(565, 130, SKY)); o.append(bowl(600, 130, SUN2, .8))
    o.append(bowl(120, 240, SUN)); o.append(bowl(120, 232, SKY, .85)); o.append(jug(210, 240, TEAL, 1.1)); o.append(mug(290, 240, SUN2)); o.append(mug(330, 240, LIME)); o.append(plant(410, 240, 1.1)); o.append(bowl(500, 240, DSAGE)); o.append(jug(580, 240, SKY, .9))
    # counter with a little cash box and a vase
    o.append(f'<g filter="url(#paper)"><rect x="60" y="330" width="560" height="70" rx="6" fill="{TEAL}"/></g><rect x="60" y="330" width="560" height="14" fill="{DYEL}"/>')
    o.append(f'<rect x="100" y="302" width="40" height="28" rx="3" fill="{INK}"/><rect x="104" y="306" width="32" height="8" fill="{SKY}"/>')
    o.append(jug(520, 330, SUN2, 1.0)); o.append(plant(560, 330, .8))
    # hanging sign: a yellow board with a little heart cut-out, on two strings
    o.append(f'<g transform="translate(560,40)"><path d="M-40 0 V40 M40 0 V40" stroke="{INK}" stroke-width="2"/><g filter="url(#paper)"><rect x="-70" y="40" width="140" height="48" rx="6" fill="{SUN2}"/></g>'
             f'<path d="M0 72 C-14 60 -18 50 -6 48 C0 46 0 52 0 52 C0 52 0 46 6 48 C18 50 14 60 0 72Z" fill="{INK}"/></g>')
    # outside: a bicycle leaning? keep it minimal: a potted olive by the door on the right of the wall
    o.append(f'<path d="M680 400 L686 352 H734 L740 400Z" fill="{DYEL}"/>{olive(710, 356, .55, SAGE, 2)}')
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
    p2 = (f'<path d="M-50 100 Q0 60 50 100Z" fill="{LIME}"/><path d="M0 -4 C8 20 10 60 0 92 C-10 60 -8 20 0 -4Z" fill="{DSAGE}"/><path d="M0 0 V90" stroke="{WHITE}" stroke-width="1.6"/>')
    p3 = (f'<rect x="-80" y="0" width="160" height="60" fill="{SKY}"/><path d="M-80 60 Q0 34 80 60 V70 H-80Z" fill="{SUN}"/>' + ibex(10, 60, .7))
    o.append(frame(160, 150, 140, 90, DYEL, p1))
    o.append(frame(330, 120, 100, 150, INK, p2))
    o.append(frame(560, 170, 160, 70, TEAL, p3))
    # a wooden bench below the paintings
    o.append(f'<g transform="translate(360,400)"><path d="M-160 0 H160 V12 H-160Z" fill="{DYEL}"/><path d="M-140 12 V48 M140 12 V48 M-140 36 H140" stroke="{INK}" stroke-width="5" stroke-linecap="round"/></g>')
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
             f'<path d="M100 -40 L150 -8" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M118 -8 L118 -2" stroke="{INK}" stroke-width="4"/>'
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
             f'<g transform="translate(170,-10) rotate(-6)"><rect x="-30" y="-70" width="60" height="70" rx="3" fill="{INK}"/><rect x="-24" y="-64" width="48" height="58" fill="{TEAL}"/><path d="M-14 -50 H14 M-16 -40 H10 M-12 -30 H16 M-16 -20 H6" stroke="{WHITE}" stroke-width="2" stroke-linecap="round"/></g>'
             # two stools
             f'<g transform="translate(-230,0)"><rect x="-22" y="-44" width="44" height="8" rx="3" fill="{DYEL}"/><path d="M-16 -36 L-20 0 M16 -36 L20 0 M0 -36 V0" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/></g>'
             f'<g transform="translate(-290,-4)"><rect x="-22" y="-44" width="44" height="8" rx="3" fill="{DYEL}"/><path d="M-16 -36 L-20 0 M16 -36 L20 0 M0 -36 V0" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/></g>'
             '</g>')
    return svg(o)

def garden_meeting():
    """A wooden garden fence with its gate open, a path leading to a yard where low tables wait with fruit and glasses of water."""
    o = [sun(230, 150, 66, SUN2)]
    o.append(layer(wave(246, 18, 1.2, 0.8), MIST, 'wv'))
    o.append(layer(wave(276, 24, 1.0, 2.4, x0=-30, x1=860, taper=.3, drop=400), SAGE, 'dw'))
    lawn = wave(322, 10, 1.0, 1.0)
    o.append(layer(lawn, LIME, 'st', .9))
    o.append(layer(wave(392, 8, 1.0, 2.0), DSAGE, 'cl', .9))
    # trees of the yard behind the fence
    o.append(oak(1080, 420, .8, SAGE)); o.append(olive(300, 372, .7, DSAGE, 4, True))
    # the path: from the gate at the bottom-left up to the yard
    c = bezier((262, 478), (330, 430), (470, 400), (560, 392), 50)
    o.append(ribbon(c, [34 - 14 * (i / 50) for i in range(51)], CREAM))
    o.append(''.join(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="7" ry="3" fill="{SAND}"/>' for x, y in c[4::8]))
    # low tables with fruit and glasses, and chairs around them
    def low_table(x, y, sc=1.0):
        fruit = (f'<g transform="translate(-26,-8)"><ellipse cx="0" cy="0" rx="22" ry="6" fill="{WHITE}"/><circle cx="-8" cy="-6" r="5" fill="{DYEL}"/><circle cx="4" cy="-7" r="5" fill="{SUN2}"/><circle cx="12" cy="-4" r="4" fill="{DSAGE}"/><circle cx="-2" cy="-12" r="4" fill="{DYEL}"/><path d="M-8 -11 L-6 -15" stroke="{INK}" stroke-width="1.2"/></g>'
                 f'<g transform="translate(22,-6)"><circle cx="0" cy="-4" r="6" fill="{DYEL}"/><circle cx="12" cy="-4" r="6" fill="{SUN2}"/><path d="M0 -10 L2 -15 M12 -10 L14 -15" stroke="{INK}" stroke-width="1.2"/></g>')
        glasses = ''.join(f'<path d="M{gx-5} -2 L{gx-4} -16 H{gx+4} L{gx+5} -2Z" fill="{SKY}" opacity=".9"/><path d="M{gx-3} -10 H{gx+3}" stroke="{WHITE}" stroke-width="1.6"/>' for gx in (40, 54, -56))
        return (f'<g transform="translate({x},{y}) scale({sc})"><path d="M-60 0 L-62 30 M60 0 L62 30 M-40 0 L-42 30 M40 0 L42 30" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/>'
                f'<g filter="url(#paperS)"><path d="M-70 -4 H70 L66 6 H-66Z" fill="{DYEL}"/></g>{fruit}{glasses}</g>')
    def chair(x, y, sc=1.0, flip=False, back=True):
        f = ' scale(-1,1)' if flip else ''
        b = f'<path d="M-14 0 V-26 M14 0 V-26 M-14 -26 H14" stroke="{INK}" stroke-width="3" stroke-linecap="round"/><rect x="-14" y="-24" width="28" height="6" fill="{TEAL}"/>' if back else ''
        return f'<g transform="translate({x},{y}) scale({sc}){f}">{b}<rect x="-16" y="-2" width="32" height="8" rx="2" fill="{SKY}"/><path d="M-12 6 L-14 28 M12 6 L14 28" stroke="{INK}" stroke-width="3" stroke-linecap="round"/></g>'
    for tx, ty, sc in [(720, 330, 1.1), (980, 352, 1.3), (560, 366, 1.2)]:
        o.append(chair(tx - 92 * sc, ty + 4, sc)); o.append(chair(tx + 92 * sc, ty + 4, sc, flip=True))
        o.append(chair(tx - 10, ty - 30 * sc, sc * .8, back=False))
        o.append(low_table(tx, ty, sc))
    # the fence runs along the front, with the gate open on the left
    fence = []
    r = random.Random(2)
    def picket(x, h, w=18, base=470):
        return f'<path d="M{x-w/2} {base} V{base-h+8} L{x} {base-h} L{x+w/2} {base-h+8} V{base}Z" fill="{WHITE}" stroke="{SAND}" stroke-width="1.2" filter="url(#paperS)"/>'
    for x in range(20, 170, 28):
        fence.append(picket(x, 104 + r.uniform(-4, 4)))
    fence.append(f'<path d="M4 398 H172 M4 440 H172" stroke="{DYEL}" stroke-width="7" stroke-linecap="round"/>')
    fence.append(f'<rect x="172" y="346" width="14" height="130" rx="2" fill="{INK}"/>')
    # the open gate, swung inward along the path
    gate = ''.join(picket(x, 92 - x * .12, 16, 0) for x in range(10, 140, 24)) + f'<path d="M0 -60 H140 M0 -20 H140" stroke="{DYEL}" stroke-width="6" stroke-linecap="round"/>'
    fence.append(f'<g transform="translate(186,470) skewY(-24) scale(.92,1)">{gate}</g>')
    fence.append(f'<rect x="338" y="346" width="14" height="130" rx="2" fill="{INK}"/>')
    for x in range(380, 1240, 28):
        fence.append(picket(x, 104 + r.uniform(-4, 4)))
    fence.append(f'<path d="M366 398 H1230 M366 440 H1230" stroke="{DYEL}" stroke-width="7" stroke-linecap="round"/>')
    o.append(''.join(fence))
    return svg(o)

if __name__ == '__main__':
    import sys
    open(sys.argv[2], 'w').write(globals()[sys.argv[1]]())

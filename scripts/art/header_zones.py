# Header illustrations for the four region "clouds" (Kinneret 27.10.2026):
# north = oaks, a stream, an eagle in the sky; center = beach, bathers, lifeguard hut, a helicopter along the shore;
# Jerusalem = hills, olive trees, a spring, birds; south = desert, ibexes, acacias.
import math, random
from headers_base import *

def eagle(x, y, sc=1.0, rot=0):
    wing = 'M4,-9 C18,-18 38,-21 56,-19 L71,-20 L62,-14 L75,-12 L63,-7 L74,-4 L62,-1 L70,4 L57,3 L60,9 L47,7 C34,12 18,15 5,13 Z'
    band = 'M9,-6 C22,-12 40,-14 54,-13 C42,-7 25,-3 9,-1 Z'
    w = f'<path d="{wing}" fill="{INK}"/><path d="{band}" fill="{CREAM}"/>'
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({sc})" filter="url(#paperS)">{w}<g transform="scale(-1,1)">{w}</g>'
            f'<path d="M-6,4 L-10,24 C-4,27 4,27 10,24 L6,4Z" fill="{INK}"/><ellipse cx="0" cy="2" rx="8" ry="15" fill="{INK}"/>'
            f'<path d="M-6,-10 C-4,-14 4,-14 6,-10 C4,-7 -4,-7 -6,-10Z" fill="{CREAM}"/><circle cx="0" cy="-17" r="5" fill="{INK}"/><path d="M-1.5,-21 L0,-25 L1.5,-21Z" fill="{SUN2}"/></g>')

def paper_cloud(x, y, sc=1.0):
    return (f'<g transform="translate({x},{y}) scale({sc})" filter="url(#paper)"><path d="M-70 18 C-82 18 -84 -2 -66 -4 C-66 -22 -40 -28 -30 -14 C-22 -32 10 -34 18 -12 C36 -16 46 2 36 12 C44 18 36 24 26 22 L-60 22Z" fill="{WHITE}"/></g>')

def ink_oak(x, y, s):
    return f'<path transform="translate({x},{y}) scale({s})" d="M-2 0 L-2 -8 C-12 -8 -14 -16 -8 -20 C-10 -28 0 -32 4 -26 C10 -30 18 -24 14 -18 C20 -14 16 -6 6 -8 L2 -8 L2 0Z" fill="{INK}"/>'

def north():
    o = []
    o.append(sun(300, 150, 70, SUN2))
    p1 = wave(228, 20, 1.4, 0.9)
    o.append(layer(p1, MIST, 'wv'))
    p2 = wave(262, 30, 1.0, 2.0, x0=-30, x1=820, taper=.35, drop=360)
    o.append(layer(p2, SAGE, 'dw'))
    p3 = wave(300, 22, 1.6, 4.4)
    o.append(f'<g filter="url(#paper)"><path d="{path(p3)}" fill="{INK}"/></g>')
    for x, s in [(860, 1.1), (884, .8), (905, 1.3), (1010, .9)]:
        o.append(ink_oak(x, ground_at(p3, x) + 3, s))
    p4 = wave(338, 20, 1.1, 1.0, x0=430, x1=W + 30, taper=.3, drop=430)
    o.append(layer(p4, LIME, 'st', .9))
    p5 = wave(372, 16, 1.0, 3.0, x0=-30, x1=700, taper=.35, drop=450)
    o.append(layer(p5, DSAGE, 'cl', .9))
    # the stream: born on the dark ridge, winding down and widening to the bottom edge
    # the stream appears from under the dark hill's lower edge, never over it
    # born on the dark ridge (clipped to the dark hill and the two hills in front, so it never shows beyond the ridge line)
    c = bezier((566, ground_at(p3, 566) - 2), (470, 322), (690, 372), (500, 476), 60)
    wd = [3 + 44 * (i / (len(c) - 1)) ** 1.5 for i in range(len(c))]
    o.append(f'<clipPath id="rc"><path d="{path(p3)}"/><path d="{path(p4)}"/><path d="{path(p5)}"/></clipPath><g clip-path="url(#rc)">{ribbon(c, wd, MIST, "wv")}</g>')
    o.append(oak(1110, 458, .95, LIME))
    o.append(oak(735, 420, .5, SAGE))
    o.append(oak(120, 456, 1.08, SAGE))
    o.append(oak(250, 470, .62, LIME, flip=True))
    o.append(f'<g class="hd-cloud">{paper_cloud(640, 62, 1.0)}</g><g class="hd-cloud hd-cloud2">{paper_cloud(800, 40, .7)}</g>')
    o.append(eagle(250, 92, 1.25, -8))
    o.append(eagle(470, 58, .62, 6))
    return svg(o)

def helicopter(x, y, sc=1.0):
    return (f'<g transform="translate({x},{y}) scale({sc})" filter="url(#paperS)">'
            f'<path d="M-40 6 C-40 -10 -26 -16 -10 -16 L14 -16 C24 -16 30 -10 32 -4 L86 -8 L90 -18 L96 -18 L94 2 L32 6 C28 14 16 18 0 18 L-24 18 C-34 18 -40 14 -40 6Z" fill="{INK}"/>'
            f'<path d="M-33 0 C-32 -8 -24 -11 -14 -11 L-10 -11 L-10 4 L-33 4Z" fill="{MIST}"/><rect x="-4" y="-9" width="10" height="9" rx="2" fill="{MIST}"/><rect x="9" y="-9" width="10" height="9" rx="2" fill="{MIST}"/>'
            f'<rect x="-2" y="-24" width="6" height="9" fill="{INK}"/><path d="M-62 -26 L68 -24" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>'
            f'<circle cx="93" cy="-12" r="9" fill="none" stroke="{INK}" stroke-width="1.6" stroke-dasharray="4 3"/>'
            f'<path d="M-24 18 L-22 26 M14 18 L12 26 M-36 27 C-30 26 20 26 28 26" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
            f'<path d="M-28 6 L60 2" stroke="{SUN2}" stroke-width="3"/></g>')

def person(x, gy, sc=1.0, pose='stand', flip=False):
    """Paper-cut silhouette figure, feet on gy. pose: stand / reach (arm up, for matkot)."""
    arms = {'stand': 'M-6 -38 L-11 -22 M6 -38 L11 -22', 'reach': 'M-6 -38 L-14 -26 M6 -38 L15 -52'}[pose]
    f = ' scale(-1,1)' if flip else ''
    return (f'<g transform="translate({x},{gy}) scale({sc}){f}"><circle cx="0" cy="-50" r="6" fill="{INK}"/>'
            f'<path d="M-7 -41 C-7 -44 7 -44 7 -41 L6 -20 L-6 -20Z" fill="{INK}"/>'
            f'<path d="{arms}" stroke="{INK}" stroke-width="3.4" stroke-linecap="round" fill="none"/>'
            f'<path d="M-3.5 -21 L-5 0 M3.5 -21 L5 0" stroke="{INK}" stroke-width="3.8" stroke-linecap="round"/></g>')

def paddle(x, y, rot):
    return f'<g transform="translate({x},{y}) rotate({rot})"><ellipse cx="0" cy="-7" rx="6" ry="7.5" fill="{SUN2}" stroke="{INK}" stroke-width="1.4"/><path d="M0 0 V6" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/></g>'

def swimmer(x, y, ring=False, arm=1):
    s = f'<g transform="translate({x},{y})">'
    if ring: s += f'<ellipse cx="0" cy="4" rx="15" ry="6" fill="{SUN2}" filter="url(#paperS)"/><ellipse cx="0" cy="3" rx="7" ry="2.6" fill="{SKY}"/>'
    s += f'<circle cx="0" cy="-4" r="6.2" fill="{INK}"/>'
    if arm: s += f'<path d="M{6*arm} 1 C{12*arm} -6 {14*arm} -12 {12*arm} -18" stroke="{INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    s += f'<path d="M-12 7 Q-6 3 0 7 T12 7" stroke="{WHITE}" stroke-width="2" fill="none" stroke-linecap="round"/></g>'
    return s

def lifeguard(x, gy, sc=1.0):
    legs = ''.join(f'<path d="M{a} 0 L{b} -64" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>' for a, b in [(-40, -34), (40, 34), (-14, -12), (14, 12)])
    ladder = f'<path d="M-62 0 L-44 -62 M-50 0 L-32 -62" stroke="{INK}" stroke-width="2.4"/>' + ''.join(f'<path d="M{-62+3*k*1.0+0.0:.1f} {-10*k} L{-50+3*k:.1f} {-10*k}" stroke="{INK}" stroke-width="2"/>' for k in range(1, 7))
    hut = (f'<g filter="url(#paper)"><rect x="-46" y="-112" width="92" height="50" fill="{WHITE}"/>'
           f'<path d="M-58 -112 L0 -132 L58 -112 L58 -106 L-58 -106Z" fill="{TEAL}"/></g>'
           f'<rect x="-36" y="-100" width="72" height="18" rx="2" fill="{SKY}"/><path d="M-12 -100 V-82 M12 -100 V-82" stroke="{WHITE}" stroke-width="3"/>'
           f'<rect x="-46" y="-72" width="92" height="10" fill="{TEAL}"/>'
           f'<path d="M-62 -64 H62" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>')
    flag = f'<path d="M-50 -112 V-150" stroke="{INK}" stroke-width="2.4"/><path d="M-50 -150 C-60 -154 -68 -144 -80 -148 L-80 -132 C-68 -128 -60 -138 -50 -134Z" fill="{WHITE}" filter="url(#paperS)"/>'
    return f'<g transform="translate({x},{gy}) scale({sc})">{legs}{ladder}{hut}{flag}</g>'

def umbrella(x, gy, sc=1.0, col=SUN2):
    segs = ''
    for k in range(6):
        a0 = math.pi + k * math.pi / 6; a1 = a0 + math.pi / 6
        segs += f'<path d="M0 -70 L{58*math.cos(a0):.1f} {-70 + 22*math.sin(a0):.1f} Q{58*math.cos((a0+a1)/2):.1f} {-74 + 30*math.sin((a0+a1)/2):.1f} {58*math.cos(a1):.1f} {-70 + 22*math.sin(a1):.1f}Z" fill="{SUN2 if k % 2 else WHITE}"/>'
    dome = f'<path d="M-58 -70 C-50 -104 50 -104 58 -70 Z" fill="{WHITE}"/>' + ''.join(
        f'<path d="M{-58 + k*19.33:.1f} -70 C{-50 + k*17:.1f} -96 {-40 + k*16:.1f} -100 0 -100 C{-40 + (k+1)*16:.1f} -100 {-50 + (k+1)*17:.1f} -96 {-58 + (k+1)*19.33:.1f} -70Z" fill="{col}"/>' for k in (0, 2, 4))
    return f'<g transform="translate({x},{gy}) scale({sc}) rotate(-6)"><path d="M0 4 L0 -96" stroke="{INK}" stroke-width="3"/><g filter="url(#paper)">{dome}</g></g>'

def palm(x, gy, sc=1.0, lean=0):
    fr = ''.join(f'<path transform="rotate({a})" d="M0 0 C14 -6 30 -4 42 6 C30 0 16 0 0 4Z" fill="{INK}"/>' for a in (-200, -160, -120, -60, -20, 20))
    return f'<g transform="translate({x},{gy}) scale({sc})"><path d="M-3 0 C-2 -30 {lean*.6} -60 {lean} -88 L{lean+5} -88 C{lean*.6+5} -60 4 -30 4 0Z" fill="{INK}"/><g transform="translate({lean+2},-88)">{fr}</g></g>'

def surfer(x, y, sc=1.0, woman=False, flip=False):
    """Standing on a board on a small wave; the woman wears a full (yellow) swimsuit and a ponytail."""
    suit = f'<path d="M-6 -40 C-6 -43 6 -43 6 -40 L5 -24 L-5 -24Z" fill="{SUN2}"/>' if woman else f'<path d="M-6 -27 L6 -27 L5 -21 L-5 -21Z" fill="{SUN2}"/>'
    hair = f'<path d="M4 -54 C10 -56 14 -50 12 -44" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>' if woman else ''
    f = ' scale(-1,1)' if flip else ''
    return (f'<g transform="translate({x},{y}) scale({sc}){f}">'
            f'<path d="M-30 10 C-10 18 10 18 30 10 C40 6 36 -2 24 0 C8 4 -8 4 -26 0 C-36 -2 -40 6 -30 10Z" fill="{WHITE}" filter="url(#paperS)"/>'
            f'<path d="M-34 4 C-12 8 12 8 36 2 C40 0 38 -4 30 -4 L-26 -3 C-36 -3 -38 2 -34 4Z" fill="{SUN2}" filter="url(#paperS)"/>'
            f'<path d="M-8 -3 L-6 -22 M10 -3 L7 -22" stroke="{INK}" stroke-width="3.8" stroke-linecap="round"/>'
            f'<circle cx="0" cy="-50" r="6" fill="{INK}"/>{hair}'
            f'<path d="M-7 -41 C-7 -44 7 -44 7 -41 L6 -20 L-6 -20Z" fill="{INK}"/>{suit}'
            f'<path d="M-6 -38 L-22 -30 M6 -38 L20 -46" stroke="{INK}" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>')

def sunbather(x, y, sc=1.0, woman=False, towel=SKY):
    """Seen from above: a striped towel with a person lying on it, head to the left."""
    stripes = ''.join(f'<path d="M{-44 + k*11} -20 V20" stroke="{WHITE}" stroke-width="3.5"/>' for k in range(9))
    body = (f'<circle cx="-30" cy="0" r="7" fill="{INK}"/>'
            f'<path d="M-22 -7 L28 -6 L40 -4 L40 4 L28 6 L-22 7Z" fill="{INK}"/>'
            f'<path d="M-20 -8 C-10 -14 -2 -14 6 -11 L6 -6 M-20 8 C-10 14 -2 14 6 11" stroke="{INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>')
    if woman:
        hair = f'<path d="M-36 -4 C-46 -8 -50 2 -42 6" stroke="{INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
        wear = f'<path d="M-12 -7 L-6 -7 L-6 -1 L-12 -1Z M-12 1 L-6 1 L-6 7 L-12 7Z" fill="{SUN2}"/><path d="M14 -6 L22 -6 L22 6 L14 6Z" fill="{SUN2}"/>'
    else:
        hair = ''
        wear = f'<path d="M12 -6 L26 -6 L26 6 L12 6Z" fill="{SKY if towel != SKY else SUN2}"/>'
    return (f'<g transform="translate({x},{y}) scale({sc}) rotate(-5)"><g filter="url(#paperS)"><rect x="-48" y="-22" width="96" height="44" rx="3" fill="{towel}"/></g>{stripes}{body}{hair}{wear}</g>')

def shrubs(xs, pts, dy=6):
    return ''.join(''.join(f'<path d="M{tx} {ground_at(pts, tx) + dy:.0f} q{d*3} -12 {d*9} -22" stroke="{TEAL}" stroke-width="2" fill="none" stroke-linecap="round"/>' for d in (-1, -.4, .3, 1)) for tx in xs)

def center():
    o = []
    o.append(sun(200, 236, 64, SUN2))
    o.append(f'<g filter="url(#paper)"><path d="M-30 238 Q300 234 600 238 T1230 236 V470 H-30Z" fill="{MIST}"/></g><path d="M-30 238 Q300 234 600 238 T1230 236 V470 H-30Z" fill="url(#wv)"/>')
    near = wave(286, 4, 3, 0.4)
    o.append(layer(near, SKY, 'ww', .8))
    o.append(swimmer(610, 304, arm=0)); o.append(swimmer(700, 316, ring=True, arm=0))
    o.append(surfer(300, 318, .9, woman=True))
    o.append(surfer(430, 300, .8, flip=True))
    o.append(f'<g class="hd-heli">{helicopter(470, 96, .48)}</g>')
    sand = wave(352, 14, 1.0, 2.6)
    shore = [(x, y - 7) for x, y in sand]
    o.append(f'<path d="M{shore[0][0]},{shore[0][1]:.1f} ' + ' '.join('L%.1f,%.1f' % p for p in shore) + f'" stroke="{WHITE}" stroke-width="9" fill="none" stroke-linecap="round" filter="url(#paperS)"/>')
    o.append(layer(sand, SAND, 'di', .28))
    o.append(lifeguard(780, ground_at(sand, 780) + 26, .95))
    o.append(sunbather(400, ground_at(sand, 400) + 64, 1.0, woman=True, towel=SKY))
    o.append(sunbather(508, ground_at(sand, 508) + 64, 1.0, woman=False, towel=SUN))
    o.append(umbrella(560, ground_at(sand, 560) + 86, 1.15))
    fd = wave(398, 14, 1.0, 0.6, x0=-30, x1=300, taper=.4, drop=470)
    o.append(layer(fd, SAGE, 'cl', .9))
    o.append(shrubs((40, 150), fd))
    o.append(umbrella(96, ground_at(fd, 96) + 60, .8, TEAL))
    dune = wave(398, 16, 1.0, 1.4, x0=900, x1=W + 30, taper=.4, drop=470)
    o.append(layer(dune, DLIME, 'st', .9))
    o.append(shrubs((1000, 1150), dune))
    o.append(umbrella(1080, ground_at(dune, 1080) + 56, .8, DSAGE))
    return svg(o)

def olive(x, gy, sc=1.0, fill=SAGE, seed=1, flip=False):
    r = random.Random(seed)
    trunk = (f'<path d="M-16 4 C-12 -14 -22 -30 -10 -46 C-4 -54 -14 -62 -26 -74 L-18 -80 C-6 -68 2 -62 4 -54 C10 -66 22 -72 34 -84 L40 -78 '
             f'C28 -64 18 -52 16 -40 C12 -24 20 -10 22 4Z" fill="{INK}" filter="url(#paper)"/>')
    lobes = [(-48, -96, 40, 22), (-6, -118, 46, 26), (40, -100, 40, 22), (-28, -84, 30, 15), (24, -82, 32, 15), (6, -140, 30, 18)]
    can = ''.join(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}"/>' for cx, cy, rx, ry in lobes)
    leaves = ''
    for _ in range(34):
        cx, cy, rx, ry = r.choice(lobes); a = r.uniform(0, 6.28); d = r.uniform(0, .8)
        lx = cx + math.cos(a) * rx * d; ly = cy + math.sin(a) * ry * d
        leaves += f'<path transform="translate({lx:.0f},{ly:.0f}) rotate({r.uniform(-50, 50) + (180 if r.random() < .5 else 0):.0f})" d="M0 0 C3 -2 8 -2 11 0 C8 2 3 2 0 0Z" fill="{WHITE}"/>'
    fruit = ''.join(f'<circle cx="{r.uniform(-60, 60):.0f}" cy="{r.uniform(-130, -86):.0f}" r="2.6" fill="{INK}"/>' for _ in range(9))
    f = ' scale(-1,1)' if flip else ''
    return f'<g transform="translate({x},{gy}) scale({sc}){f}">{trunk}<g filter="url(#paper)">{can}</g>{leaves}{fruit}</g>'

def terraces(pts, n, color, sw=1.6, step=12, clip='tc'):
    d = path(pts)
    lines = ''.join(f'<path d="{contour(pts, k * .7, 10 + k * step)}"/>' for k in range(n))
    return f'<clipPath id="{clip}"><path d="{d}"/></clipPath><g clip-path="url(#{clip})" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round">{lines}</g>'

def spring(x, gy, sc=1.0):
    """A still spring pool ringed with stones, water lilies of light, no visible source."""
    pool = (f'<g filter="url(#paper)"><path d="M-120 0 C-120 -30 -70 -44 -10 -42 C50 -40 100 -26 102 0 C104 24 60 40 -8 40 C-72 40 -120 26 -120 0Z" fill="{SKY}"/></g>'
            f'<path d="M-120 0 C-120 -30 -70 -44 -10 -42 C50 -40 100 -26 102 0 C104 24 60 40 -8 40 C-72 40 -120 26 -120 0Z" fill="url(#ww)"/>'
            f'<ellipse cx="-14" cy="-2" rx="16" ry="5" fill="none" stroke="{WHITE}" stroke-width="2"/><ellipse cx="-14" cy="-2" rx="32" ry="10" fill="none" stroke="{WHITE}" stroke-width="1.4" opacity=".8"/>'
            f'<ellipse cx="46" cy="14" rx="10" ry="3.4" fill="none" stroke="{WHITE}" stroke-width="1.6"/>')
    stones = ''.join(f'<ellipse cx="{sx}" cy="{sy}" rx="{rx}" ry="{ry}" fill="{CREAM}" filter="url(#paperS)"/>' for sx, sy, rx, ry in
                     [(-124, -6, 15, 9), (-84, -38, 14, 8), (-30, -46, 12, 7), (30, -44, 14, 8), (80, -30, 13, 8), (108, 4, 14, 9), (-110, 30, 12, 7), (-50, 42, 14, 8), (20, 44, 12, 7), (80, 36, 14, 8)])
    reeds = ''.join(f'<path d="M{rx} {ry} q{d*2} -14 {d*5} -30" stroke="{DSAGE}" stroke-width="2" fill="none" stroke-linecap="round"/>' for rx, ry in [(-96, -30), (96, -20)] for d in (-1, -.3, .5, 1.1))
    return f'<g transform="translate({x},{gy}) scale({sc})">{stones}{pool}{reeds}</g>'

def stone_house(x, gy, sc=1.0):
    return (f'<g transform="translate({x - 23*sc:.0f},{gy - 40*sc:.0f}) scale({sc})" filter="url(#paper)"><rect x="0" y="12" width="46" height="28" fill="{CREAM}"/>'
            f'<path d="M14 12c0-14 18-14 18 0z" fill="{CREAM}"/><path d="M19 40V28c0-6 8-6 8 0v12z" fill="{INK}"/><path d="M5 20h6v6H5zM35 20h6v6h-6z" fill="{INK}"/></g>')

def jerusalem():
    o = []
    o.append(sun(210, 150, 60, SUN2))
    p2 = wave(250, 34, 1.1, 0.4, x0=-30, x1=900, taper=.3, drop=380)
    o.append(f'<g filter="url(#paper)"><path d="{path(p2)}" fill="{LIME}"/></g>' + terraces(p2, 12, WHITE, 2, 13, 'tc1'))
    p3 = wave(318, 20, 1.4, 3.6)
    o.append(f'<g filter="url(#paper)"><path d="{path(p3)}" fill="{INK}"/></g>')
    o.append(stone_house(905, ground_at(p3, 905) + 2, 1.0))
    o.append(stone_house(948, ground_at(p3, 948) + 2, .75))
    for x in (1010, 1036, 1100):
        o.append(f'<ellipse cx="{x}" cy="{ground_at(p3, x) - 6:.0f}" rx="13" ry="9" fill="{INK}"/>')
    p4 = wave(334, 20, 1.2, 1.4, x0=560, x1=W + 30, taper=.3, drop=430)
    o.append(f'<g filter="url(#paper)"><path d="{path(p4)}" fill="{SUN}"/></g>' + terraces(p4, 8, SUN2, 1.6, 14, 'tc2'))
    p5 = wave(372, 14, 1.0, 2.8, x0=-30, x1=760, taper=.35, drop=450)
    o.append(layer(p5, SAGE, 'dw', .9))
    o.append(spring(470, 410, 1.0))
    o.append(olive(1080, 452, 1.15, DSAGE, 3))
    o.append(olive(760, 404, .62, SAGE, 5, True))
    o.append(olive(130, 456, 1.2, DSAGE, 7, True))
    spots = []
    r = random.Random(11)
    for k in range(13):
        spots.append((360 + k * 26 + r.uniform(-12, 12), 52 + abs(k - 6) * 9 + r.uniform(-8, 8), r.uniform(.9, 1.5)))
    for k, (bx, by, sz) in enumerate(spots):
        o.append(f'<g class="hd-bird" style="--d:{r.uniform(0, 1.1):.2f}s;--dx:{r.uniform(-90, 90):.0f}px;--dy:{-200 - r.uniform(0, 160):.0f}px">{birds([(bx, by, sz)])}</g>')
    return svg(o)

def acacia(x, gy, sc=1.0, fill=LIME, flip=False):
    trunk = (f'<path d="M-6 4 C-5 -20 -8 -40 -4 -56 C-14 -70 -34 -84 -62 -96 L-58 -102 C-32 -92 -14 -82 -2 -70 C0 -86 -6 -100 -16 -114 L-10 -118 C2 -104 6 -90 6 -74 '
             f'C14 -88 30 -100 56 -108 L60 -102 C36 -94 20 -80 12 -62 C24 -74 44 -84 74 -90 L76 -84 C46 -76 24 -62 10 -46 C8 -30 8 -14 8 4Z" fill="{INK}" filter="url(#paper)"/>')
    slabs = [(-6, -118, 96, 15), (-62, -100, 48, 11), (60, -102, 52, 12), (8, -132, 60, 11)]
    can = ''.join(f'<path d="M{cx-rx} {cy+ry*.4:.1f} C{cx-rx*.9:.0f} {cy-ry:.0f} {cx-rx*.3:.0f} {cy-ry*1.2:.0f} {cx} {cy-ry:.0f} C{cx+rx*.4:.0f} {cy-ry*1.3:.0f} {cx+rx*.95:.0f} {cy-ry*.8:.0f} {cx+rx} {cy+ry*.4:.1f} C{cx+rx*.5:.0f} {cy+ry*.9:.0f} {cx-rx*.5:.0f} {cy+ry*.9:.0f} {cx-rx} {cy+ry*.4:.1f}Z" fill="{fill}"/>' for cx, cy, rx, ry in slabs)
    dots = ''.join(f'<circle cx="{cx + k*14 - rx*.6:.0f}" cy="{cy + (k % 2) * 4 - 2}" r="1.8" fill="{WHITE}"/>' for cx, cy, rx, ry in slabs for k in range(int(rx*1.2/14)))
    f = ' scale(-1,1)' if flip else ''
    return f'<g transform="translate({x},{gy}) scale({sc}){f}">{trunk}<g filter="url(#paper)">{can}</g>{dots}</g>'

def mesa(pts_top, base, fill, pattern=None, op=.9):
    d = f'M{pts_top[0][0]},{base} ' + ' '.join(f'L{x},{y}' for x, y in pts_top) + f' L{pts_top[-1][0]},{base}Z'
    s = f'<g filter="url(#paper)"><path d="{d}" fill="{fill}"/></g>'
    if pattern: s += f'<path d="{d}" fill="url(#{pattern})" opacity="{op}"/>'
    return s

def south():
    o = []
    o.append(sun(250, 140, 70, SUN2))
    r = random.Random(4); jag = [(470, 300)]
    x = 470
    while x < 1240:
        x += r.uniform(30, 60); jag.append((round(x), round(262 + r.uniform(0, 22) + (8 if x < 700 else 0))))
    o.append(mesa(jag, 470, INK))
    top = [(-30, 262), (200, 258), (430, 262), (470, 264), (500, 280), (520, 300), (548, 312), (640, 316), (700, 330), (720, 470)]
    o.append(mesa(top, 470, SUN, 'sa', 1))
    o.append(f'<g class="hd-ibex">{ibex(452, 263, 1.15, walk=True)}</g>')
    dn = wave(338, 18, 1.0, 2.2, x0=380, x1=W + 30, taper=.3, drop=440)
    o.append(layer(dn, SAND, 'di', .3))
    ex = 900
    o.append(ibex(ex, ground_at(dn, ex) + 74, 1.0, flip=True))
    o.append(ibex(ex - 46, ground_at(dn, ex - 46) + 78, .95, flip=True, kid=True))
    fd = wave(380, 16, 1.0, 0.4, x0=-30, x1=640, taper=.35, drop=460)
    o.append(layer(fd, DYEL, 'st', .8))
    wd = wave(404, 10, 1.3, 0.2, x0=700, x1=W + 30, taper=.25)
    o.append(f'<g filter="url(#paper)"><path d="{path(wd)}" fill="{WHITE}"/></g>' + terraces(wd, 7, SUN2, 1.1, 7, 'wc'))
    o.append(acacia(150, 452, 1.15, LIME))
    o.append(acacia(660, 392, .6, DLIME, True))
    o.append(acacia(1090, 456, 1.05, DLIME, True))
    for bx, by in [(300, 430), (360, 446)]:
        o.append(f'<ellipse cx="{bx}" cy="{by}" rx="16" ry="6" fill="{CREAM}" filter="url(#paperS)"/>')
    return svg(o)

if __name__ == '__main__':
    import sys
    open(sys.argv[2], 'w').write(globals()[sys.argv[1]]())

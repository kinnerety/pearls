# Shared pieces for the region/category page headers (same paper-cut collage as the home hero, site-sketch/hero10.py).
# Drawn directly in page coordinates (viewBox 0 0 1200 440): the title sits in the open sky on the RIGHT,
# so the right part above y~235 stays empty and the big motifs live on the left and along the bottom.
import math, random
W, H = 1200, 440
# The palette (Kinneret, 27.10.2026): 8 colours + ink + white. The old darker tints (DSAGE, DLIME, MIST, BLUE) now point at the same
# palette colours; depth comes from the paper shadow and the patterns, not from extra tints.
INK = '#22333B'; PAPER = '#FAF7EF'; CREAM = '#F2E8CC'; SUN = '#FCF0B4'; SUN2 = '#FAD771'
LIME = '#E8F2B2'; SAGE = '#CBEBD5'; MIST = '#DDEEF6'; WHITE = '#FFFFFF'; BLUE = '#FAF7EF'   # BLUE = the wave lines on water (off-white, her pick)
TEAL = '#1C4F66'; SAND = '#F2E8CC'; SKY = '#DDEEF6'; DSAGE = '#CBEBD5'; DLIME = '#E8F2B2'; DYEL = '#FAD771'

def smooth(t):
    t = max(0.0, min(1.0, t)); return t * t * (3 - 2 * t)

def wave(y0, amp, n, phase, x0=-30, x1=W + 30, steps=90, taper=0, bottom=H + 30, drop=None):
    pts = []
    for i in range(steps + 1):
        u = i / steps
        x = x0 + (x1 - x0) * u
        y = y0 + amp * math.sin(u * math.pi * n + phase) + amp * .3 * math.sin(u * math.pi * n * 2.1 + phase * 1.7)
        if taper:
            e = max(smooth((taper - u) / taper) if x0 > -30 else 0, smooth((u - (1 - taper)) / taper) if x1 < W + 30 else 0)
            y = y + ((drop or bottom) - y) * e
        pts.append((x, y))
    return pts

def path(pts, bottom=H + 30):
    return 'M%.1f,%.1f ' % (pts[0][0], bottom) + ' '.join('L%.1f,%.1f' % p for p in pts) + ' L%.1f,%.1f Z' % (pts[-1][0], bottom)

def contour(pts, k, dy):
    return 'M' + ' L'.join('%.1f,%.1f' % (x, y + dy + 6 * math.sin(x / 90 + k)) for x, y in pts)

def ground_at(pts, x):
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        if xa <= x <= xb: return ya + (yb - ya) * (x - xa) / (xb - xa)
    return pts[-1][1]

def slope_at(pts, x):
    i = min(range(len(pts)), key=lambda j: abs(pts[j][0] - x)); a, b = pts[max(i-1, 0)], pts[min(i+1, len(pts)-1)]
    return math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))

def wobble_line(x0, x1, y, amp, seed):
    r = random.Random(seed); d = f'M{x0},{y:.1f}'; x = x0
    while x < x1:
        x += 18; d += f' Q{x-9},{y + r.uniform(-amp, amp):.1f} {x},{y + r.uniform(-amp/2, amp/2):.1f}'
    return d

def defs(extra=''):
    waves = ''.join(f'<path d="{wobble_line(0, 80, 6 + 14*j, 2.2, j)}" fill="none" stroke="{BLUE}" stroke-width="1.5" stroke-linecap="round"/>' for j in range(3))
    wavesW = ''.join(f'<path d="{wobble_line(0, 80, 6 + 14*j, 2.2, j+5)}" fill="none" stroke="{WHITE}" stroke-width="1.6" stroke-linecap="round"/>' for j in range(3))
    stripes = ''.join(f'<path d="{wobble_line(0, 72, 5 + 11*j, 1.4, 10+j)}" fill="none" stroke="{WHITE}" stroke-width="2" stroke-linecap="round"/>' for j in range(3))
    strata = ''.join(f'<path d="{wobble_line(0, 90, 4 + 9*j, 1.0, 20+j)}" fill="none" stroke="{SUN2}" stroke-width="1.6" stroke-linecap="round"/>' for j in range(3))
    cloud = lambda x, y, s: f'<path transform="translate({x},{y}) scale({s})" d="M0 8c0-3 2-5 5-5 1-2 3-3 5-3 3 0 5 2 5 4 2 0 4 2 4 4z" fill="{WHITE}"/>'
    return f'''<defs>
<filter id="paper" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#3a3a2a" flood-opacity=".3"/></filter>
<filter id="paperS" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#3a3a2a" flood-opacity=".6"/></filter>
<pattern id="dw" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><circle cx="2.5" cy="2.5" r="1.5" fill="{WHITE}"/><circle cx="8" cy="8" r="1.5" fill="{WHITE}"/></pattern>
<pattern id="di" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><circle cx="3" cy="3" r="1.7" fill="{INK}"/><circle cx="9" cy="9" r="1.7" fill="{INK}"/></pattern>
<pattern id="wv" width="80" height="42" patternUnits="userSpaceOnUse">{waves}</pattern>
<pattern id="ww" width="80" height="42" patternUnits="userSpaceOnUse">{wavesW}</pattern>
<pattern id="st" width="72" height="33" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">{stripes}</pattern>
<pattern id="sa" width="90" height="27" patternUnits="userSpaceOnUse">{strata}</pattern>
<pattern id="cl" width="70" height="46" patternUnits="userSpaceOnUse">{cloud(6,6,1)}{cloud(40,28,.8)}</pattern>
{extra}</defs>'''

def layer(pts, fill, pattern=None, opacity=.95, bottom=H + 30):
    d = path(pts, bottom)
    s = f'<g filter="url(#paper)"><path d="{d}" fill="{fill}"/></g>'
    if pattern: s += f'<path d="{d}" fill="url(#{pattern})" opacity="{opacity}"/>'
    return s

def sun(cx, cy, r=92, fill=SUN2):
    k = r / 92
    P = lambda a, b: f'{cx + a*k:.1f},{cy + b*k:.1f}'
    return (f'<g filter="url(#paper)"><path d="M{P(-92,6)} C{P(-96,-56)} {P(-44,-96)} {P(8,-92)} C{P(62,-90)} {P(98,-48)} {P(92,8)} '
            f'C{P(88,62)} {P(40,96)} {P(-10,92)} C{P(-62,88)} {P(-90,56)} {P(-92,6)}Z" fill="{fill}"/></g>')

def cypress(x, y, sc, fill, vein, rot=0):
    body = f'<path d="M0 -250 C14 -200 24 -120 22 -50 C21 -20 14 0 0 6 C-14 0 -21 -20 -22 -50 C-24 -120 -14 -200 0 -250Z" fill="{fill}" filter="url(#paper)"/>'
    spine = f'<path d="M0 10 V-236" stroke="{vein}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    ribs = ''.join(f'<path d="M0 {-18-k*20} Q{sg*8} {-26-k*20} {sg*(15 - max(0,k-7)*1.6):.1f} {-40-k*20}" stroke="{vein}" stroke-width="1.6" fill="none" stroke-linecap="round"/>' for k in range(11) for sg in (1, -1))
    return f'<g transform="translate({x},{y}) rotate({rot}) scale({sc})">{body}{spine}{ribs}</g>'

def oak(x, y, sc, fill, acorns=True, flip=False):
    canopy = (f'<path d="M-62 -92 C-80 -100 -78 -138 -52 -144 C-50 -176 -14 -190 8 -172 C30 -194 72 -180 70 -146 C96 -138 94 -100 70 -92 '
              f'C64 -70 30 -64 14 -76 C0 -62 -30 -62 -40 -76 C-56 -70 -70 -78 -62 -92Z" fill="{fill}" filter="url(#paper)"/>')
    trunk = (f'<path d="M-9 6 C-8 -24 -12 -46 -30 -72 L-22 -76 C-10 -60 -3 -50 0 -42 C4 -56 12 -70 26 -82 L32 -76 C16 -60 10 -40 10 6Z" fill="{INK}" filter="url(#paper)"/>')
    ac = ''.join(f'<g transform="translate({ax},{ay}) rotate({r})"><ellipse cx="0" cy="5" rx="4.6" ry="6.2" fill="{SUN2}"/><path d="M-5.6 1.5 C-5.6 -4 5.6 -4 5.6 1.5Z" fill="{INK}"/><path d="M0 -2 V-5" stroke="{INK}" stroke-width="1.6"/></g>'
                 for ax, ay, r in [(-46,-110,-12),(-12,-150,8),(30,-120,-6),(52,-150,14),(-30,-84,4),(8,-92,-10)]) if acorns else ''
    f = ' scale(-1,1)' if flip else ''
    return f'<g transform="translate({x},{y}) scale({sc}){f}">{trunk}{canopy}{ac}</g>'

IBEX_BODY = (f'<path d="M-22 -30 C-24 -38 -18 -42 -10 -42 L10 -42 C16 -42 19 -44 22 -48 L27 -53 L31 -50 L30 -43 C30 -40 28 -38 25 -36 L22 -32 C20 -29 18 -28 16 -28 L-18 -27 C-21 -27 -22 -28 -22 -30Z" fill="{INK}"/>'
             f'<path d="M-22 -36 L-27 -30" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/>'
             f'<path d="M28 -50 C25 -62 14 -66 6 -60" fill="none" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>'
             f'<path d="M27 -48 C25 -56 19 -59 14 -57" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>'
             f'<path d="M30 -43 L32 -38" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>')
IBEX_KID = (f'<path d="M-16 -26 C-17 -32 -13 -34 -7 -34 L8 -34 C12 -34 14 -36 16 -39 L20 -42 L23 -40 L22 -35 C22 -33 20 -31 18 -30 L15 -27 C14 -25 12 -25 11 -25 L-13 -24 C-15 -24 -16 -25 -16 -26Z" fill="{INK}"/>'
            f'<path d="M20 -41 C19 -45 16 -46 14 -45" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>')

def ibex(x, gy, sc=1.0, flip=False, kid=False, walk=False):
    """Standing ibex with its hooves on ground line gy (page coords); faces right unless flip."""
    body = IBEX_KID if kid else IBEX_BODY
    legx = (-13, -9, 8, 12) if kid else (-19, -13, 12, 17)
    belly = -18 if kid else -22
    shift = belly - (-24 if kid else -27)
    # walk=True: each leg swings from the hip (CSS class hd-leg / hd-leg2 on alternate legs)
    cls = lambda i: f' class="hd-leg{"" if i in (0, 3) else "2"}" style="transform-box:fill-box;transform-origin:50% 0"' if walk else ''
    leg = ''.join(f'<path{cls(i)} d="M{lx},{belly} L{lx + (1.2 if lx > 0 else -1.2)},0" stroke="{INK}" stroke-width="{2.6 if kid else 3.2}" stroke-linecap="round"/>' for i, lx in enumerate(legx))
    f = ' scale(-1,1)' if flip else ''
    return f'<g transform="translate({x},{gy}) scale({sc}){f}"><g transform="translate(0,{shift})">{body}</g>{leg}</g>'

def birds(spots, fill=WHITE):
    s = ''
    for bx, by, k in spots:
        s += (f'<g transform="translate({bx:.0f},{by:.0f}) scale({k:.2f})" filter="url(#paperS)"><path d="M0 6C4 0 8 0 11 5C14 0 18 0 22 4C18 3 15 5 11 9C8 5 4 4 0 6Z" fill="{fill}"/>'
              f'<path d="M0 6C1.6 3.6 3.6 2 5.6 1.6L6.6 4.6C4.4 4.7 2.2 5.2 0 6Z M22 4C19.8 2.2 17.6 1.4 15.6 1.4L15.4 4.4C17.6 3.8 19.8 3.6 22 4Z" fill="{INK}"/></g>')
    return s

def floating_leaves(n, box, seed, colors=(SAGE, SUN, MIST, LIME)):
    r = random.Random(seed); x0, y0, x1, y1 = box; s = ''
    for i in range(n):
        x = r.uniform(x0, x1); y = r.uniform(y0, y1); a = r.uniform(0, 360); c = r.choice(colors); k = r.uniform(.6, 1.1)
        s += f'<g transform="translate({x:.0f},{y:.0f}) rotate({a:.0f}) scale({k:.2f})"><path d="M0 0C6-8 18-10 26-6C18 2 8 4 0 0Z" fill="{c}"/><path d="M2 -1L22 -6" stroke="{WHITE}" stroke-width="1"/></g>'
    return s

def ribbon(center, widths, fill, pattern=None):
    """A river/road: a centre polyline with a half-width at each point."""
    L, R = [], []
    for i, ((x, y), w) in enumerate(zip(center, widths)):
        a = center[max(i-1, 0)]; b = center[min(i+1, len(center)-1)]
        dx, dy = b[0]-a[0], b[1]-a[1]; n = math.hypot(dx, dy) or 1
        nx, ny = -dy/n, dx/n
        L.append((x + nx*w, y + ny*w)); R.append((x - nx*w, y - ny*w))
    pts = L + R[::-1]
    d = 'M' + ' L'.join('%.1f,%.1f' % p for p in pts) + 'Z'
    s = f'<g filter="url(#paper)"><path d="{d}" fill="{fill}"/></g>'
    if pattern: s += f'<path d="{d}" fill="url(#{pattern})"/>'
    return s

def bezier(p0, p1, p2, p3, n=60):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0], u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out

def svg(parts, extra_defs=''):
    return defs(extra_defs) + '\n' + '\n'.join(parts)

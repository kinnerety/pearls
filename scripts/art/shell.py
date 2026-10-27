"""The tortoise shell of the empty gallery (Kinneret's reference, 27.10.2026: a paper-cut dome of rounded scutes in the
site's colours, each with pale stripes or a row of dark dots, on a dark base that shows through the gaps, over a rim).
64x64 like the other lib/illo.ts pictures. Run: python3 scripts/art/shell.py > out.svg  (the <svg> wrapper is for previewing;
the inner part goes into lib/illo.ts as `shell`)."""
import math, sys, random

NAVY, INK = '#1C4F66', '#22333B'
FILLS = ['#A6DDB7', '#D8E97A', '#BFDDEE', '#F3E27C', '#F6EFD9', '#98C4A4']   # sage, lime, light blue, yellow, cream, deeper sage
PALE, DOT = '#FFFDF7', '#1C4F66'
MINT = '#A6DDB7'   # the site's sage tint, for every scute (Kinneret's mint reference)

CX, BASE, RX, RY = 32.0, 50.0, 30.0, 33.0   # the dome's top is at y = 17


def dome(n=60):
    pts = [(CX + RX * math.cos(math.pi * i / n), BASE - RY * math.sin(math.pi * i / n)) for i in range(n + 1)]
    return pts  # from the right end over the top to the left end; the base closes it


def clip(poly, a, b):
    """Keep the part of poly closer to seed a than to seed b (Sutherland-Hodgman against the bisector)."""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    nx, ny = b[0] - a[0], b[1] - a[1]
    inside = lambda p: (p[0] - mx) * nx + (p[1] - my) * ny <= 0
    out = []
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        ip, iq = inside(p), inside(q)
        if ip: out.append(p)
        if ip != iq:
            t = ((mx - p[0]) * nx + (my - p[1]) * ny) / ((q[0] - p[0]) * nx + (q[1] - p[1]) * ny)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out


def centroid(poly):
    return (sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly))


def inset(poly, d):
    """the polygon with every edge moved inward by d"""
    out = poly
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        ex, ey = q[0] - p[0], q[1] - p[1]
        L = math.hypot(ex, ey) or 1
        nx, ny = -ey / L, ex / L          # a normal of the edge
        c = centroid(poly)
        if (c[0] - p[0]) * nx + (c[1] - p[1]) * ny < 0: nx, ny = -nx, -ny   # make it point inward
        a = (p[0] + nx * d, p[1] + ny * d)
        b = (a[0] + nx, a[1] + ny)        # a point further inside: clip keeps the half nearer to b than to its mirror
        m = (a[0] - nx, a[1] - ny)
        out = clip(out, b, m)
        if len(out) < 3: return out
    return out


def inset_old(poly, d):
    c = centroid(poly)
    return [(c[0] + (p[0] - c[0]) * (1 - d / max(1e-6, math.hypot(p[0] - c[0], p[1] - c[1]))), c[1] + (p[1] - c[1]) * (1 - d / max(1e-6, math.hypot(p[0] - c[0], p[1] - c[1])))) for p in poly]


def inside(p, poly):
    hit = False
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        if (a[1] > p[1]) != (b[1] > p[1]) and p[0] < a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1]): hit = not hit
    return hit


def toward(p, c, poly):
    """p pulled toward c until it is inside poly"""
    for t in range(0, 20):
        q = (p[0] + (c[0] - p[0]) * t / 20, p[1] + (c[1] - p[1]) * t / 20)
        if inside(q, poly): return q
    return c


def path(poly):
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in poly) + 'Z'


# the scute seeds: a big plain one in the middle, a ring around it, small marginal ones along the rim
SEEDS = [(32, 20), (32, 29.5), (32, 39.5),                                # the vertebral column
         (16, 24), (9, 35), (14, 44.5), (48, 24), (55, 35), (50, 44.5),      # costals
         (5, 47), (11, 49), (18, 49.5), (25, 50), (32, 50), (39, 50), (46, 49.5), (53, 49), (59, 47)]   # marginals


def build(seed=3):
    rnd = random.Random(seed)
    D = dome()
    out = [f'<path d="{path(D)}" fill="{NAVY}"/>']
    deco = ['plain', 'lines', 'dots', 'lines', 'dots', 'lines', 'dots', 'lines', 'dots', 'lines', 'dots', 'lines', 'plain', 'dots', 'lines']
    for i, s in enumerate(SEEDS):
        cell = D
        for j, t in enumerate(SEEDS):
            if j != i: cell = clip(cell, s, t)
        if len(cell) < 3: continue
        cell = inset(cell, 1.15)
        fill = MINT
        out.append(f'<path d="{path(cell)}" fill="{fill}" stroke="{fill}" stroke-width="1.2" stroke-linejoin="round"/>')
        cx, cy = centroid(cell)
        xs, ys = [p[0] for p in cell], [p[1] for p in cell]
        w, h = (max(xs) - min(xs)) * 0.5, (max(ys) - min(ys)) * 0.5
    # the rim under the dome and the dark inside showing at the right end (the tortoise is in there)
    out.append(f'<path d="M3 50h58q1.5 0 1.5 1.5v1.5q0 1.5 -1.5 1.5H3q-1.5 0 -1.5 -1.5v-1.5q0 -1.5 1.5 -1.5z" fill="{MINT}"/>')
    out.append(f'<path d="M47.5 50C52 46 60 46 62 50.5C62.5 52.5 60 54.5 56 54.5H47.5z" fill="{NAVY}"/>')
    return ''.join(out)


if __name__ == '__main__':
    inner = build()
    if '--inner' in sys.argv: print(inner)
    else: print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{inner}</svg>')

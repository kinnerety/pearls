"""The tortoise shell of the empty gallery (Kinneret's reference, 27.10.2026: a paper-cut dome of rounded scutes in the
site's colours, each with pale stripes or a row of dark dots, on a dark base that shows through the gaps, over a rim).
64x64 like the other lib/illo.ts pictures. Run: python3 scripts/art/shell.py > out.svg  (the <svg> wrapper is for previewing;
the inner part goes into lib/illo.ts as `shell`)."""
import math, sys, random

NAVY, INK = '#1C4F66', '#22333B'
FILLS = ['#A6DDB7', '#D8E97A', '#BFDDEE', '#F3E27C', '#F6EFD9', '#98C4A4']   # sage, lime, light blue, yellow, cream, deeper sage
PALE, DOT = '#FFFDF7', '#1C4F66'

CX, BASE, RX, RY = 32.0, 49.0, 29.0, 27.0


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
SEEDS = [(32, 30), (32, 13), (17, 19), (47, 19), (7, 31), (57, 31), (18, 36), (46, 36), (32, 44),
         (6, 44.5), (16, 46), (26, 47), (38, 47), (48, 46), (58, 44.5)]


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
        cell = inset(cell, 1.9)
        fill = FILLS[i % len(FILLS)]
        out.append(f'<path d="{path(cell)}" fill="{fill}" stroke="{fill}" stroke-width="1.8" stroke-linejoin="round"/>')
        cx, cy = centroid(cell)
        xs, ys = [p[0] for p in cell], [p[1] for p in cell]
        w, h = (max(xs) - min(xs)) * 0.5, (max(ys) - min(ys)) * 0.5
        safe = inset(cell, 2.2)   # decorations stay inside this
        if deco[i] == 'lines' and h > 3 and w > 3.5:
            k = 3 if w > 5 else 2
            for m in range(k):
                x = cx + (m - (k - 1) / 2) * w * 0.45
                lean = (x - cx) * 0.08
                a, b = (x - lean, cy - h * 0.6), (x + lean, cy + h * 0.55)
                a, b = toward(a, (cx, cy), safe), toward(b, (cx, cy), safe)
                if math.hypot(a[0] - b[0], a[1] - b[1]) > 2:
                    out.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="{PALE}" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>')
        elif deco[i] == 'dots' and w > 3.5:
            k = max(2, min(5, int(w * 0.9)))
            for m in range(k):
                x = cx + (m - (k - 1) / 2) * w * 0.4
                p = (x, cy - h * 0.3 + (x - cx) * 0.12)
                if inside(p, safe): out.append(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r=".75" fill="{DOT}"/>')
    # the rim under the dome, two paper layers, and the dark inside showing at the right end
    out.append(f'<path d="M3.5 49h57q1.5 0 1.5 1.5v1q0 1.5 -1.5 1.5h-57q-1.5 0 -1.5 -1.5v-1q0 -1.5 1.5 -1.5z" fill="#F6EFD9"/>')
    out.append(f'<path d="M5.5 53h53q1.2 0 1.2 1.2v.8q0 1.2 -1.2 1.2h-53q-1.2 0 -1.2 -1.2v-.8q0 -1.2 1.2 -1.2z" fill="#F3E27C"/>')
    return ''.join(out)


if __name__ == '__main__':
    inner = build()
    if '--inner' in sys.argv: print(inner)
    else: print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{inner}</svg>')

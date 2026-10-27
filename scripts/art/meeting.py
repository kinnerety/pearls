"""Generator for public/about/meeting.svg (variant "face": python3 scripts/art/meeting.py <dir> writes meeting_face.svg). Paper-cut illustration of the meeting photo (four friends around a table with olive-oil bottles
in an earthen farm shop), for the About page. Writes meeting_<variant>.svg (inner markup + full file)."""
import sys, math

INK = '#22333B'; CREAM = '#F2E8CC'; YEL = '#FAD771'; LIME = '#D6DE8A'; SAGE = '#98C4A4'
TEAL = '#1C4F66'; LBLUE = '#BFDDEE'; WAVE = '#AFD3E3'; OFF = '#FAF7EF'; WHITE = '#FFFDF7'
BLUE = '#5E9CC9'; SAND = '#EADBB0'; WOOD = '#E3CF9B'; JEANS = '#9CC3DE'; JEANS2 = '#86B3D4'

W, H = 900, 600

DEFS = f'''<defs>
<filter id="mp" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#3a3a2a" flood-opacity=".28"/></filter>
<filter id="mpS" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#3a3a2a" flood-opacity=".45"/></filter>
<pattern id="mEarth" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><circle cx="3" cy="4" r="1.6" fill="#E4D2A6"/><circle cx="11" cy="12" r="1.2" fill="#E4D2A6"/></pattern>
<pattern id="mRoof" width="60" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-9)"><path d="M0 7 Q15 5.5 30 7 T60 7" fill="none" stroke="{WHITE}" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/></pattern>
<pattern id="mFloor" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><circle cx="3" cy="3" r="1.4" fill="#F7EDC9"/><circle cx="9" cy="9" r="1.4" fill="#F7EDC9"/></pattern>
<pattern id="mStripe" width="10" height="9" patternUnits="userSpaceOnUse"><rect width="10" height="9" fill="{LIME}"/><path d="M0 4.5 Q2.5 3 5 4.5 T10 4.5" fill="none" stroke="{WHITE}" stroke-width="2"/></pattern>
<pattern id="mKnit" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M2 3 l4 4 l4 -4" fill="none" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="1.3"/></pattern>
<pattern id="mGrain" width="90" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-2)"><path d="M0 7 Q22 4 45 7 T90 7" fill="none" stroke="#3B5866" stroke-width="1.4"/></pattern>
</defs>'''


def room():
    s = []
    s.append(f'<rect width="{W}" height="{H}" fill="{OFF}"/>')
    # ceiling (light-blue sloping roof panels) and clerestory light
    s.append(f'<path d="M0 0H{W}V300H0z" fill="{LBLUE}"/><path d="M0 0H{W}V300H0z" fill="url(#mRoof)"/>')
    for i, x in enumerate([330, 470, 610, 750, 890]):
        s.append(f'<path d="M{x} 0 L{x-160} {60+i*0}" stroke="{WAVE}" stroke-width="5" stroke-linecap="round"/>')
    # sunlit clerestory windows on the left wall
    for i in range(4):
        x = 40 + i * 78
        s.append(f'<rect x="{x}" y="{104 - i*4}" width="66" height="{58}" rx="4" fill="{YEL}" filter="url(#mpS)"/>')
        s.append(f'<path d="M{x+10} {114 - i*4} l18 0" stroke="{WHITE}" stroke-width="3" stroke-linecap="round"/>')
    # earthen wall with lumpy top edge
    wall = (f'M0 165 C40 150 70 172 110 160 C150 148 180 170 230 158 C280 146 300 168 350 160 '
            f'C380 170 420 190 470 205 C520 215 560 205 600 212 C660 220 700 208 760 214 C820 220 860 210 {W} 214 '
            f'V{H}H0z')
    s.append(f'<path d="{wall}" fill="{CREAM}" filter="url(#mp)"/><path d="{wall}" fill="url(#mEarth)"/>')
    # bottle-glass flower window
    cx, cy = 628, 236
    s.append(f'<circle cx="{cx}" cy="{cy}" r="36" fill="#F7F0DA" filter="url(#mpS)"/>')
    cols = [SAGE, YEL, BLUE, LIME, '#6FAF86', YEL, LBLUE, SAGE]
    for i in range(8):
        a = i * 45
        s.append(f'<ellipse cx="{cx}" cy="{cy-17}" rx="5.5" ry="14" fill="{cols[i]}" transform="rotate({a} {cx} {cy})"/>')
    s.append(f'<circle cx="{cx}" cy="{cy}" r="6" fill="{TEAL}"/>')
    # second window: bottle ends set diagonally
    s.append(f'<rect x="760" y="232" width="74" height="62" rx="12" fill="#F7F0DA" filter="url(#mpS)"/>')
    for i, c in enumerate([SAGE, '#6FAF86', LIME, BLUE]):
        s.append(f'<rect x="{772+i*14}" y="244" width="8" height="38" rx="4" fill="{c}" transform="rotate(35 {776+i*14} 263)"/>')
    s.append(f'<circle cx="822" cy="246" r="5" fill="{BLUE}"/>')
    # chandelier
    s.append(f'<path d="M470 120V196M454 202 Q470 214 486 202" stroke="{INK}" stroke-width="2" fill="none"/>')
    for x in (454, 470, 486):
        s.append(f'<circle cx="{x}" cy="{196 if x == 470 else 199}" r="4" fill="{YEL}"/>')
    # open wooden door with green outside
    s.append(f'<path d="M228 228 Q262 214 296 228 V470 H228z" fill="{SAGE}"/>')
    s.append(f'<path d="M242 470 C250 420 262 380 290 352 L296 470z" fill="#7FB592"/>')
    s.append(f'<path d="M296 226 L338 236 V468 L296 470z" fill="{WOOD}" filter="url(#mpS)"/>')
    for x in (306, 316, 327):
        s.append(f'<path d="M{x} {230+ (x-296)*0.24} V469" stroke="#CDB57C" stroke-width="1.6"/>')
    s.append(f'<path d="M300 300 Q318 290 334 296" stroke="{INK}" stroke-width="2.4" fill="none"/>')
    # window with panes behind the right figures
    s.append(f'<rect x="742" y="318" width="62" height="96" rx="5" fill="{SAGE}" filter="url(#mpS)"/>')
    s.append(f'<path d="M773 318V414M742 350H804M742 382H804" stroke="{CREAM}" stroke-width="4"/>')
    s.append(f'<circle cx="760" cy="334" r="5" fill="{YEL}"/><circle cx="788" cy="366" r="4" fill="{BLUE}"/>')
    # shelf with small bottles on the left wall
    s.append(f'<rect x="60" y="300" width="80" height="6" rx="3" fill="{WOOD}" filter="url(#mpS)"/>')
    for i, c in enumerate([LIME, YEL, LIME, SAGE]):
        s.append(f'<rect x="{66+i*18}" y="276" width="11" height="24" rx="4" fill="{c}"/>')
    # wheat bundle in a clay jar at the right edge
    s.append(f'<path d="M846 330 C820 380 822 440 840 470 H892 C906 440 906 380 880 330z" fill="{SAND}" filter="url(#mp)"/>')
    for a in (-24, -12, 0, 12, 24):
        x2 = 863 + a * 1.6; y2 = 252 + abs(a) * 0.8
        s.append(f'<path d="M863 336 Q{863+a*0.6} 300 {x2:.0f} {y2:.0f}" stroke="#E6C65A" stroke-width="2.2" fill="none"/>')
        s.append(f'<ellipse cx="{x2:.0f}" cy="{y2-8:.0f}" rx="3.4" ry="9" fill="{YEL}" transform="rotate({a} {x2:.0f} {y2:.0f})"/>')
    # floor
    s.append(f'<path d="M0 500 Q450 486 {W} 500 V{H}H0z" fill="{SAND}"/><path d="M0 500 Q450 486 {W} 500 V{H}H0z" fill="url(#mFloor)"/>')
    return s


def face(cx, cy, dx, mode, mouth='open', r=1.0):
    """Laughing face: closed arc eyes + open mouth. dx shifts the features toward where the head looks."""
    if mode != 'face':
        return ''
    ex = cx + dx
    e = (f'<path d="M{ex-11*r} {cy-2} q4 -5 8 0 M{ex+3*r} {cy-2} q4 -5 8 0" stroke="{INK}" stroke-width="2.2" '
         f'fill="none" stroke-linecap="round"/>')
    if mouth == 'big':
        m = (f'<path d="M{ex-8} {cy+7} Q{ex} {cy+24} {ex+8} {cy+7}z" fill="{INK}"/>'
             f'<path d="M{ex-6} {cy+8} H{ex+6}" stroke="#FFFFFF" stroke-width="2.4"/>')
    elif mouth == 'hand':
        m = ''
    else:
        m = (f'<path d="M{ex-7} {cy+8} Q{ex} {cy+18} {ex+7} {cy+8}z" fill="{INK}"/>'
             f'<path d="M{ex-5} {cy+9} H{ex+5}" stroke="#FFFFFF" stroke-width="2"/>')
    cheeks = (f'<circle cx="{ex-12}" cy="{cy+6}" r="3.6" fill="#E8A598" opacity=".55"/>'
              f'<circle cx="{ex+12}" cy="{cy+6}" r="3.6" fill="#E8A598" opacity=".55"/>')
    return e + m + cheeks


def people(mode):
    """mode: 'ink' = silhouettes, 'face' = coloured with laughing faces, 'blank' = coloured, faceless."""
    sil = mode == 'ink'
    def c(col):
        return TEAL if sil else col
    skins = ['#E7C3A0', '#EBCFB0', '#DDB591', '#C99D79']
    s = []
    stroke_arm = lambda d, col, w=21: f'<path d="{d}" stroke="{col}" stroke-width="{w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'

    # P1 – tall man on the left, navy sweater, looking right
    g = []
    g.append(f'<path d="M136 392 L128 560 H160 L171 440 L182 560 H212 L206 392z" fill="{c(JEANS2)}"/>')
    g.append(f'<ellipse cx="143" cy="562" rx="20" ry="7" fill="{INK}"/><ellipse cx="198" cy="562" rx="20" ry="7" fill="{INK}"/>')
    g.append(f'<rect x="160" y="246" width="22" height="22" rx="6" fill="{c(skins[0])}"/>')
    g.append(f'<path d="M124 274 Q170 254 216 274 L224 402 Q172 414 118 402z" fill="{c(TEAL)}"/>')
    if not sil: g.append('<path d="M124 274 Q170 254 216 274 L224 402 Q172 414 118 402z" fill="url(#mKnit)"/>')
    g.append(stroke_arm('M130 282 Q110 338 116 392', c(TEAL), 23))
    g.append(stroke_arm('M210 282 Q236 322 226 350 L200 356', c(TEAL), 23))
    g.append(f'<circle cx="116" cy="400" r="10" fill="{c(skins[0])}"/><circle cx="196" cy="357" r="10" fill="{c(skins[0])}"/>')
    g.append(f'<circle cx="174" cy="222" r="31" fill="{c(skins[0])}"/>')
    g.append(f'<circle cx="148" cy="226" r="7" fill="{c(skins[0])}"/>')
    g.append(f'<path d="M146 214 Q144 236 158 248 Q150 230 154 212z" fill="{c("#B9A58F")}"/>')
    g.append(face(174, 222, 8, mode))
    s.append(f'<g filter="url(#mp)">{"".join(g)}</g>')

    # P2 – woman with both hands up, glasses pushed onto her head, white vest over a striped sweater
    g = []
    g.append(f'<path d="M306 420 L302 556 H328 L332 450 L338 556 H364 L356 420z" fill="{c(SAGE)}"/>')
    g.append(f'<ellipse cx="314" cy="558" rx="16" ry="6" fill="{INK}"/><ellipse cx="352" cy="558" rx="16" ry="6" fill="{INK}"/>')
    g.append(f'<rect x="321" y="298" width="18" height="18" rx="5" fill="{c(skins[1])}"/>')
    g.append(f'<path d="M298 322 Q330 310 362 322 L368 426 Q330 434 292 426z" fill="{"url(#mStripe)" if not sil else INK}"/>')
    g.append(f'<path d="M298 322 L318 318 L316 430 L292 426z M362 322 L342 318 L344 430 L368 426z" fill="{c("#FFFDF7")}"/>')
    g.append(stroke_arm('M304 328 Q270 300 284 262 L304 254', c('#FFFDF7'), 19))
    g.append(stroke_arm('M356 328 Q390 300 376 262 L356 254', c('#FFFDF7'), 19))
    g.append(f'<circle cx="304" cy="252" r="9" fill="{c(skins[1])}"/><circle cx="356" cy="252" r="9" fill="{c(skins[1])}"/>')
    g.append(f'<path d="M302 282 Q300 248 330 246 Q360 248 358 282 Q350 268 330 266 Q310 268 302 282z" fill="{c("#DCD6C8")}"/>')
    g.append(f'<circle cx="330" cy="284" r="25" fill="{c(skins[1])}"/>')
    g.append(f'<path d="M305 278 Q306 254 330 254 Q354 254 355 278 Q344 262 330 262 Q316 262 305 278z" fill="{c("#DCD6C8")}"/>')
    # glasses on the head
    gl = '#FFFDF7' if sil else INK
    g.append(f'<circle cx="320" cy="254" r="7" fill="none" stroke="{gl}" stroke-width="2"/><circle cx="340" cy="254" r="7" fill="none" stroke="{gl}" stroke-width="2"/><path d="M327 254h6" stroke="{gl}" stroke-width="2"/>')
    g.append(face(330, 284, 0, mode, 'big'))
    s.append(f'<g filter="url(#mp)">{"".join(g)}</g>')

    # P3 – tall slim man in a soft green sweater, laughing, holding the hand of P4
    g = []
    g.append(f'<path d="M532 410 L528 560 H554 L560 446 L566 560 H592 L588 410z" fill="{c(JEANS)}"/>')
    g.append(f'<ellipse cx="539" cy="562" rx="17" ry="7" fill="{INK}"/><ellipse cx="582" cy="562" rx="17" ry="7" fill="{INK}"/>')
    g.append(f'<rect x="550" y="252" width="20" height="26" rx="6" fill="{c(skins[2])}"/>')
    torso = 'M530 280 Q560 268 590 280 L596 422 Q560 432 524 422z'
    g.append(f'<path d="{torso}" fill="{c(SAGE)}"/>')
    if not sil: g.append(f'<path d="{torso}" fill="url(#mKnit)"/>')
    g.append(stroke_arm('M536 288 Q516 344 548 362 L594 360', c(SAGE), 19))
    g.append(stroke_arm('M586 288 Q612 326 610 352', c(SAGE), 19))
    g.append(f'<circle cx="604" cy="360" r="10" fill="{c(skins[2])}"/>')
    g.append(f'<circle cx="534" cy="234" r="6" fill="{c(skins[2])}"/><circle cx="588" cy="234" r="6" fill="{c(skins[2])}"/>')
    g.append(f'<circle cx="561" cy="232" r="27" fill="{c(skins[2])}"/>')
    g.append(f'<path d="M535 228 Q534 214 544 208 Q540 220 541 232z M587 228 Q588 214 578 208 Q582 220 581 232z" fill="{c("#8C7B6B")}"/>')
    if not sil:
        pass
    g.append(face(561, 228, 0, mode))
    if not sil:
        # French beard (moustache + goatee) in the colour of his hair
        g.append('<path d="M549 237 Q554 229 561 232 Q568 229 573 237 Q567 233.5 561 235 Q555 233.5 549 237z" fill="#8C7B6B"/>'
                 '<path d="M550 236 Q549 246 555 250 M572 236 Q573 246 567 250" stroke="#8C7B6B" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
                 '<path d="M553 249 Q561 247 569 249 Q568 259 561 261 Q554 259 553 249z" fill="#8C7B6B"/>')
    s.append(f'<g filter="url(#mp)">{"".join(g)}</g>')

    # P4 – woman with curly hair and a long braid, one hand to her mouth, the other reaching to P3
    g = []
    g.append(f'<path d="M668 420 L656 562 H694 L702 452 L710 562 H748 L736 420z" fill="{c(JEANS2)}"/>')
    g.append(f'<ellipse cx="672" cy="564" rx="17" ry="6" fill="{INK}"/><ellipse cx="734" cy="564" rx="17" ry="6" fill="{INK}"/>')
    # braid down the back
    for i in range(7):
        g.append(f'<circle cx="{728 + i*2}" cy="{296 + i*14}" r="{8 - i*0.6:.1f}" fill="{INK}"/>')
    g.append(f'<rect x="690" y="284" width="18" height="20" rx="5" fill="{c(skins[3])}"/>')
    g.append(f'<path d="M668 306 Q700 294 734 306 L738 430 Q702 440 664 430z" fill="{c(INK)}"/>')
    g.append(stroke_arm('M674 314 Q646 352 622 360', c(INK), 19))
    g.append(f'<circle cx="618" cy="362" r="9" fill="{c(skins[3])}"/>')
    g.append(stroke_arm('M730 314 Q754 348 738 354 L700 290', c(INK), 18))
    g.append(f'<circle cx="696" cy="280" r="8.5" fill="{c(skins[3])}"/>')
    g.append(f'<circle cx="702" cy="260" r="25" fill="{c(skins[3])}"/>')
    # curly hair: cluster of circles around the crown and back
    for (x, y, r) in [(712, 236, 13), (726, 246, 13), (730, 262, 11), (698, 232, 12), (686, 240, 9), (722, 276, 10), (734, 280, 8)]:
        g.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}"/>')
    g.append(face(698, 260, -8, mode, 'hand'))
    # her hand covers her laughing mouth – redraw the hand above the face
    g.append(f'<circle cx="691" cy="276" r="8.5" fill="{c(skins[3])}"/>')
    s.append(f'<g filter="url(#mp)">{"".join(g)}</g>')
    return s


def bottle(x, base, h, w, col, label=None, cap=WHITE):
    neck_w = w * 0.34
    sh = base - h * 0.62
    d = (f'M{x-w/2} {base} V{sh+6} Q{x-w/2} {sh-10} {x-neck_w/2} {sh-18} V{base-h+8} H{x+neck_w/2} '
         f'V{sh-18} Q{x+w/2} {sh-10} {x+w/2} {sh+6} V{base}z')
    s = f'<path d="{d}" fill="{col}"/>'
    s += f'<rect x="{x-neck_w/2-1}" y="{base-h}" width="{neck_w+2}" height="10" rx="2" fill="{cap}"/>'
    s += f'<path d="M{x} {base-h} l0 -7" stroke="{cap}" stroke-width="3" stroke-linecap="round"/>'
    if label:
        s += f'<rect x="{x-w/2+3}" y="{base-h*0.42}" width="{w-6}" height="{h*0.2}" rx="2" fill="{label}"/>'
        s += f'<path d="M{x-w/2+8} {base-h*0.34} h{w-16}" stroke="{INK}" stroke-width="1.2" opacity=".6"/>'
    s += f'<path d="M{x-w/2+4} {sh+8} V{base-8}" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/>'
    return s


def table():
    s = []
    top = 'M276 408 L654 398 L700 466 L234 482z'
    # legs (cabriole-like curves) and front band
    legs = (f'<path d="M248 490 C236 530 262 552 252 596 L266 596 C280 552 258 530 266 492z" fill="{INK}"/>'
            f'<path d="M684 476 C696 516 670 540 680 596 L666 596 C654 540 678 516 668 478z" fill="{INK}"/>'
            f'<path d="M300 486 L304 560 L312 560 L312 486z M630 478 L626 552 L634 552 L640 478z" fill="#33505E"/>')
    s.append(f'<g filter="url(#mp)">{legs}<path d="M234 482 L700 466 L700 484 L234 500z" fill="#2C4250"/>'
             f'<path d="{top}" fill="{INK}"/><path d="{top}" fill="url(#mGrain)"/></g>')
    # runner with fringe
    run = 'M382 414 L566 409 L586 454 L366 461z'
    s.append(f'<path d="{run}" fill="{CREAM}" filter="url(#mpS)"/><path d="M398 424 Q470 414 560 420 M392 440 Q470 430 574 436" stroke="{LIME}" stroke-width="5" fill="none" stroke-linecap="round"/>')
    s.append('<path d="' + ''.join(f'M{366+i*11} {461-i*0.3:.1f} l-1 6 ' for i in range(21)) + f'" stroke="{CREAM}" stroke-width="1.6"/>')
    # bottles and things on the table
    things = []
    things.append(bottle(398, 444, 118, 28, INK, LIME))
    things.append(bottle(436, 452, 104, 30, '#6FAF86', CREAM, cap=SAGE))
    things.append(bottle(470, 440, 110, 26, INK, YEL))
    things.append(bottle(612, 444, 120, 28, INK, CREAM))
    # flowers in a small blue bottle
    stems = ''.join(f'<path d="M512 420 Q{512+dx*0.5} {390} {512+dx} {370+abs(dx)*0.6}" stroke="#6FAF86" stroke-width="2" fill="none"/>' for dx in (-30, -14, 0, 16, 32))
    leaves = ''.join(f'<ellipse cx="{512+dx}" cy="{392}" rx="9" ry="4" fill="{SAGE}" transform="rotate({dx} {512+dx} 392)"/>' for dx in (-22, 22))
    blossoms = ''.join(f'<circle cx="{512+dx}" cy="{370+abs(dx)*0.6}" r="7.5" fill="{WHITE}"/><circle cx="{512+dx}" cy="{370+abs(dx)*0.6}" r="3" fill="{YEL}"/>' for dx in (-30, -14, 0, 16, 32))
    things.append(stems + leaves + blossoms)
    things.append(f'<path d="M502 446 V428 Q502 420 508 418 V408 H516 V418 Q522 420 522 428 V446z" fill="{BLUE}"/>')
    # lemon lantern (a candle in a carved citrus), a saucer of bread and a small glass of oil
    things.append(f'<circle cx="452" cy="460" r="17" fill="{YEL}"/><circle cx="452" cy="460" r="17" fill="none" stroke="#E6C65A" stroke-width="2"/>'
                  f'<circle cx="446" cy="456" r="2.6" fill="{INK}"/><circle cx="456" cy="452" r="2.6" fill="{INK}"/><circle cx="458" cy="463" r="2.6" fill="{INK}"/><circle cx="447" cy="466" r="2.6" fill="{INK}"/>'
                  f'<path d="M452 443 q-3 -6 0 -10 q3 4 0 10z" fill="{YEL}"/>')
    things.append(f'<ellipse cx="560" cy="420" rx="26" ry="7" fill="{WHITE}"/><rect x="546" y="410" width="14" height="8" rx="3" fill="#E9D49A"/><rect x="562" y="411" width="12" height="7" rx="3" fill="#F2E1A8"/>')
    things.append(f'<path d="M640 442 h14 l-2 16 h-10z" fill="#FFFFFF" fill-opacity=".85"/><path d="M642 450 h10 l-1 8 h-8z" fill="{YEL}"/>')
    s.append(f'<g filter="url(#mpS)">{"".join(things)}</g>')
    return s


def chairs():
    s = []
    # foreground chair on the left (back + seat), seen from the side
    s.append(f'<g filter="url(#mp)"><path d="M18 420 Q40 404 64 410 L70 600 H58 L52 430 Q40 426 30 432 L34 600 H22z" fill="{INK}"/>'
             f'<path d="M28 470 H60 M28 500 H62" stroke="{INK}" stroke-width="7"/>'
             f'<path d="M30 520 H170 Q182 522 180 534 H30z" fill="#2C4250"/>'
             f'<path d="M160 534 L168 600 H178 L174 534z" fill="{INK}"/></g>')
    # chair behind the table on the right side
    s.append(f'<g filter="url(#mp)"><path d="M800 452 Q826 440 860 446 L866 600 H854 L850 466 Q830 462 812 468 L816 600 H804z" fill="{INK}"/>'
             f'<path d="M812 500 H852 M812 530 H854" stroke="{INK}" stroke-width="7"/></g>')
    return s


def build(mode):
    parts = room() + people(mode) + table() + chairs()
    return DEFS + '\n' + '\n'.join(parts)


if __name__ == '__main__':
    out = sys.argv[1]
    for mode in ('ink', 'face', 'blank'):
        inner = build(mode)
        with open(f'{out}/meeting_{mode}.svg', 'w') as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{inner}</svg>')

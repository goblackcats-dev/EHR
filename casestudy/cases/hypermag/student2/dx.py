"""Small python-docx helper kit for the Ray Kessler case study packet and key (boxes, banners, ruled writing space, role headers).
Every helper takes `d`, which is either a Document or a table cell, so layouts can be nested."""
import re, os
from docx import Document
from docx.enum.table import WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

FONT = 'Calibri'
SYM = 'Segoe UI Symbol'
W = 7.3                      # usable page width, inches
INK = '1B2A41'
GRAY = '555555'
FIG = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs')

FILL = {'A': 'FFEFC2', 'B': 'DCEBFA', 'C': 'DDF0E1', 'T': 'ECE6F7', 'N': 'F2F2F2', 'W': 'FFFFFF', 'D': INK}
ROLE_NAME = {'A': 'CHART DETECTIVE', 'B': 'LAB INTERPRETER', 'C': 'BEDSIDE NURSE'}
ROLE_ICON = {'A': 'icon_detective.png', 'B': 'icon_lab.png', 'C': 'icon_nurse.png', 'T': 'icon_team.png'}

THICK = {'val': 'single', 'sz': 12, 'color': INK}
MED = {'val': 'single', 'sz': 8, 'color': INK}
THIN = {'val': 'single', 'sz': 4, 'color': '7A7A7A'}
HAIR = {'val': 'single', 'sz': 4, 'color': 'B5B5B5'}
DASH = {'val': 'dashed', 'sz': 8, 'color': INK}
NONE = {'val': 'nil', 'sz': 0, 'color': 'FFFFFF'}


# ------------------------------------------------------------------ low level
def border(cell, **kw):
    tcPr = cell._tc.get_or_add_tcPr()
    b = tcPr.find(qn('w:tcBorders'))
    if b is None:
        b = OxmlElement('w:tcBorders'); tcPr.append(b)
    for edge in ('top', 'left', 'bottom', 'right'):
        v = kw.get(edge)
        if v is None: continue
        el = b.find(qn('w:' + edge))
        if el is None:
            el = OxmlElement('w:' + edge); b.append(el)
        el.set(qn('w:val'), v['val']); el.set(qn('w:sz'), str(v['sz'])); el.set(qn('w:color'), v['color']); el.set(qn('w:space'), '0')


def box_borders(cell, b):
    border(cell, top=b, left=b, bottom=b, right=b)


def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    for old in tcPr.findall(qn('w:shd')): tcPr.remove(old)
    s = OxmlElement('w:shd'); s.set(qn('w:val'), 'clear'); s.set(qn('w:color'), 'auto'); s.set(qn('w:fill'), fill); tcPr.append(s)


def cell_margins(table, top=40, bottom=40, left=90, right=90):
    tblPr = table._tbl.tblPr
    m = OxmlElement('w:tblCellMar')
    for k, v in (('top', top), ('left', left), ('bottom', bottom), ('right', right)):
        e = OxmlElement('w:' + k); e.set(qn('w:w'), str(v)); e.set(qn('w:type'), 'dxa'); m.append(e)
    tblPr.append(m)


def widths(table, ws):
    table.autofit = False
    tblPr = table._tbl.tblPr
    if tblPr.find(qn('w:tblLayout')) is None:
        lay = OxmlElement('w:tblLayout'); lay.set(qn('w:type'), 'fixed'); tblPr.append(lay)
    tw = tblPr.find(qn('w:tblW'))
    if tw is None:
        tw = OxmlElement('w:tblW'); tblPr.append(tw)
    tw.set(qn('w:w'), str(int(sum(ws) * 1440))); tw.set(qn('w:type'), 'dxa')
    for i, w in enumerate(ws):
        if i < len(table.columns): table.columns[i].width = Inches(w)
    for row in table.rows:
        for i, w in enumerate(ws):
            if i < len(row.cells): row.cells[i].width = Inches(w)


def rowh(row, inches, exact=False):
    row.height = Inches(inches)
    row.height_rule = WD_ROW_HEIGHT_RULE.EXACTLY if exact else WD_ROW_HEIGHT_RULE.AT_LEAST


def nosplit(row):
    trPr = row._tr.get_or_add_trPr(); trPr.append(OxmlElement('w:cantSplit'))


def valign(cell, v='center'):
    cell.vertical_alignment = {'center': WD_ALIGN_VERTICAL.CENTER, 'top': WD_ALIGN_VERTICAL.TOP, 'bottom': WD_ALIGN_VERTICAL.BOTTOM}[v]


def run(p, text, bold=False, italic=False, size=10, color=None, font=None, underline=False):
    r = p.add_run(text); r.bold = bold; r.italic = italic; r.underline = underline
    f = font or FONT
    r.font.name = f; r._element.rPr.rFonts.set(qn('w:eastAsia'), f); r._element.rPr.rFonts.set(qn('w:cs'), f)
    r.font.size = Pt(size)
    if color: r.font.color.rgb = RGBColor.from_string(color)
    return r


def rich(p, text, size=10, color=None, italic=False, bold=False):
    """**bold** and _italic_ inline markup; symbols in [[...]] use the symbol font"""
    for tok in re.split(r'(\*\*.+?\*\*|\[\[.+?\]\])', text):
        if not tok: continue
        if tok.startswith('**'): run(p, tok[2:-2], bold=True, size=size, color=color, italic=italic)
        elif tok.startswith('[['): run(p, tok[2:-2], size=size, color=color, font=SYM, bold=bold)
        else: run(p, tok, size=size, color=color, italic=italic, bold=bold)


def P(d, text='', size=10, bold=False, italic=False, color=None, align=None, before=0, after=3, keep=False, indent=None, line=None, first=None):
    p = d.add_paragraph()
    pf = p.paragraph_format; pf.space_before = Pt(before); pf.space_after = Pt(after)
    if line: pf.line_spacing = line
    if keep: pf.keep_with_next = True
    if indent is not None: pf.left_indent = Inches(indent)
    if first is not None: pf.first_line_indent = Inches(first)
    if align == 'center': p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == 'right': p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if text: rich(p, text, size=size, color=color, italic=italic, bold=bold)
    return p


def first_par(cell, **kw):
    """use (and format) the empty first paragraph of a cell"""
    p = cell.paragraphs[0]
    pf = p.paragraph_format; pf.space_before = Pt(kw.get('before', 0)); pf.space_after = Pt(kw.get('after', 0))
    if kw.get('align') == 'center': p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif kw.get('align') == 'right': p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    return p


def ctext(cell, text, size=10, bold=False, italic=False, color=None, align=None, v='center'):
    cell.text = ''
    p = first_par(cell, align=align)
    rich(p, text, size=size, color=color, italic=italic, bold=bold)
    valign(cell, v)
    return p


def new_table(d, nrows, ncols, ws, borders=None, align='center', margins=None):
    t = d.add_table(rows=nrows, cols=ncols)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER if align == 'center' else WD_TABLE_ALIGNMENT.LEFT
    widths(t, ws)
    cell_margins(t, *(margins or (30, 30, 80, 80)))
    for r in t.rows:
        for c in r.cells:
            border(c, top=NONE, left=NONE, bottom=NONE, right=NONE)
    if borders:
        for r in t.rows:
            for c in r.cells: box_borders(c, borders)
    return t


def spacer(d, pts=4):
    p = d.add_paragraph(); p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(0)
    r = p.add_run(' '); r.font.size = Pt(max(1, pts)); p.paragraph_format.line_spacing = Pt(max(1, pts))
    return p


def page_top(d):
    """tiny paragraph that forces the next page; every logical page starts with one"""
    p = d.add_paragraph(); p.paragraph_format.page_break_before = True
    p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(0); p.paragraph_format.line_spacing = Pt(1)
    r = p.add_run(' '); r.font.size = Pt(1)
    return p


def pic(d, name, width, align='center', after=2, keep=False):
    p = d.add_paragraph(); pf = p.paragraph_format; pf.space_before = Pt(0); pf.space_after = Pt(after)
    if keep: pf.keep_with_next = True
    p.alignment = {'center': WD_ALIGN_PARAGRAPH.CENTER, 'left': WD_ALIGN_PARAGRAPH.LEFT, 'right': WD_ALIGN_PARAGRAPH.RIGHT}[align]
    path = name if os.path.isabs(name) else os.path.join(FIG, name)
    p.add_run().add_picture(path, width=Inches(width))
    return p


def pic_in(cell, name, width, align='center'):
    p = first_par(cell, align=align)
    path = name if os.path.isabs(name) else os.path.join(FIG, name)
    p.add_run().add_picture(path, width=Inches(width))
    return p


# ------------------------------------------------------------------ building blocks
def banner(d, left, right='', fill=INK, color='FFFFFF', size=15, sub=None, w=W, h=0.5):
    t = new_table(d, 1, 2 if right else 1, [w - 1.9, 1.9] if right else [w], borders=None)
    for c in t.rows[0].cells: shade(c, fill)
    rowh(t.rows[0], h)
    c = t.rows[0].cells[0]; c.text = ''
    p = first_par(c); rich(p, left, size=size, color=color, bold=True); valign(c)
    if sub:
        p2 = c.add_paragraph(); p2.paragraph_format.space_after = Pt(0); rich(p2, sub, size=9, color=color, italic=True)
    if right:
        r = t.rows[0].cells[1]; r.text = ''; p = first_par(r, align='right'); rich(p, right, size=9.5, color=color, bold=True); valign(r)
    spacer(d, 3)
    return t


def callout(d, title, body, fill='FFF8E1', icon=None, border_style=None, size=9.5, w=W, title_size=10.5, dashed=False):
    cols = [0.62, w - 0.62] if icon else [w]
    t = new_table(d, 1, len(cols), cols, borders=None)
    b = DASH if dashed else MED
    for c in t.rows[0].cells: shade(c, fill); box_borders(c, b)
    nosplit(t.rows[0])
    if icon:
        c = t.rows[0].cells[0]; pic_in(c, icon, 0.46); valign(c)
        border(c, right=NONE)
        border(t.rows[0].cells[1], left=NONE)
    c = t.rows[0].cells[-1]; c.text = ''
    p = first_par(c); rich(p, title, size=title_size, bold=True, color=INK)
    for ln in (body if isinstance(body, list) else [body]):
        pp = c.add_paragraph(); pp.paragraph_format.space_after = Pt(1); rich(pp, ln, size=size, color='222222')
    spacer(d, 3)
    return t


def role_head(d, letter, tagline, initials_label='Who is on this job?'):
    t = new_table(d, 1, 3, [0.62, W - 0.62 - 1.95, 1.95], borders=None)
    for c in t.rows[0].cells: shade(c, FILL[letter]); box_borders(c, MED)
    border(t.rows[0].cells[0], right=NONE); border(t.rows[0].cells[1], left=NONE, right=NONE); border(t.rows[0].cells[2], left=NONE)
    rowh(t.rows[0], 0.42); nosplit(t.rows[0])
    c0 = t.rows[0].cells[0]; pic_in(c0, ROLE_ICON[letter], 0.36); valign(c0)
    c1 = t.rows[0].cells[1]; c1.text = ''
    p = first_par(c1); rich(p, f'**{letter}  {ROLE_NAME[letter]}**', size=12.5, color=INK)
    p2 = c1.add_paragraph(); p2.paragraph_format.space_after = Pt(0); rich(p2, tagline, size=8.8, color='333333', italic=True)
    valign(c1)
    c2 = t.rows[0].cells[2]; c2.text = ''
    p = first_par(c2, align='right'); rich(p, 'Initials: ', size=9, color=INK, bold=True); run(p, '_________', size=11, color=INK)
    valign(c2)
    spacer(d, 1)
    return t


def prompt(d, qid, head, text, where=None, pts_note=None, size=9.6, keep=True):
    p = P(d, '', after=1.5, keep=keep, before=3)
    run(p, f'{qid}  ', bold=True, size=size, color=GRAY)
    if head: run(p, head + ('  ' if head[-1] in '?!."' else '.  '), bold=True, size=size + 0.2, color=INK)
    rich(p, text, size=size, color='111111')
    if where:
        run(p, '   Where to look: ' + where, size=7.6, italic=True, color='666666')


def lines(d, n, line_h=0.27, w=W, label=None, fill=None, bold_edge=True):
    """ruled writing space: n lines inside one box"""
    t = new_table(d, n, 1, [w], borders=None)
    for i, r in enumerate(t.rows):
        rowh(r, line_h, True); nosplit(r)
        c = r.cells[0]
        border(c, left=MED, right=MED, top=MED if i == 0 else NONE, bottom=MED if i == n - 1 else HAIR)
        if fill: shade(c, fill)
        c.paragraphs[0].paragraph_format.space_after = Pt(0)
        if i < n - 1: c.paragraphs[0].paragraph_format.keep_with_next = True
    if label: ctext(t.rows[0].cells[0], label, size=7.5, italic=True, color='8A8A8A', v='top')
    spacer(d, 3)
    return t


def grid(d, header, ws, rows, row_h=0.3, hfill='E4E4E4', size=9, bold_first=False, hsize=8.6, pre_fill=None, center=None, fills=None, keep=True):
    """table with header row. rows: list of lists of strings ('' = blank to write in) or int for that many blank rows"""
    nrows = rows if isinstance(rows, int) else len(rows)
    t = new_table(d, nrows + 1, len(header), ws, borders=THIN)
    for j, h in enumerate(header):
        c = t.rows[0].cells[j]; shade(c, hfill); ctext(c, h, size=hsize, bold=True, align='center' if (center and j in center) else None)
        box_borders(c, MED)
    nosplit(t.rows[0])
    t.rows[0].cells[0].paragraphs[0].paragraph_format.keep_with_next = True
    for i in range(nrows):
        r = t.rows[i + 1]; rowh(r, row_h); nosplit(r)
        for j in range(len(header)):
            c = r.cells[j]; box_borders(c, THIN)
            v = '' if isinstance(rows, int) else (rows[i][j] if j < len(rows[i]) else '')
            if v != '': ctext(c, str(v), size=size, bold=(bold_first and j == 0), align='center' if (center and j in center) else None)
            if pre_fill and j in pre_fill and v != '': shade(c, pre_fill[j])
            if fills and (i, j) in fills: shade(c, fills[(i, j)])
            if i < nrows - 1 or True:
                for pp in c.paragraphs: pp.paragraph_format.keep_with_next = (keep and i < nrows - 1)
    spacer(d, 3)
    return t


def checks(d, items, size=9.5, cols=1, w=W):
    n = (len(items) + cols - 1) // cols
    t = new_table(d, n, cols, [w / cols] * cols, borders=None)
    for k, it in enumerate(items):
        c = t.rows[k % n].cells[k // n]; c.text = ''
        p = first_par(c); run(p, '☐  ', size=size + 2, font=SYM, color=INK); rich(p, it, size=size)
    spacer(d, 2)
    return t


def bullets(d, items, size=9.8, indent=0.2, after=1.5, color=None):
    for it in items:
        p = P(d, '', after=after, indent=indent, first=-0.16)
        run(p, '•  ', size=size, color=color); rich(p, it, size=size, color=color)


def stop_sign(d, text='STOP. Do not turn the page until the instructor advances the clock.'):
    t = new_table(d, 1, 2, [0.62, W - 0.62], borders=None)
    for c in t.rows[0].cells: shade(c, 'FFFFFF'); box_borders(c, DASH)
    border(t.rows[0].cells[0], right=NONE); border(t.rows[0].cells[1], left=NONE)
    pic_in(t.rows[0].cells[0], 'icon_stop.png', 0.34); valign(t.rows[0].cells[0])
    ctext(t.rows[0].cells[1], text, size=10, bold=True, color=INK)
    rowh(t.rows[0], 0.4)
    return t


def set_header_footer(doc, header_left, header_right_label, footer):
    s = doc.sections[0]
    hp = s.header.paragraphs[0]; hp.text = ''
    hp.paragraph_format.space_after = Pt(0)
    run(hp, header_left, bold=True, size=9, color=INK)
    run(hp, '\t\t' + header_right_label + ' ', size=9, color=GRAY); field(hp, 'PAGE', 9); run(hp, ' of ', size=9, color=GRAY); field(hp, 'NUMPAGES', 9)
    # right tab stop
    pPr = hp._p.get_or_add_pPr(); tabs = OxmlElement('w:tabs')
    for pos, val in ((int(W * 1440 / 2), 'center'), (int(W * 1440), 'right')):
        tb = OxmlElement('w:tab'); tb.set(qn('w:val'), val); tb.set(qn('w:pos'), str(pos)); tabs.append(tb)
    pPr.append(tabs)
    fp = s.footer.paragraphs[0]; fp.text = ''; run(fp, footer, size=7.8, italic=True, color='666666')


def field(p, code, size=9):
    r = p.add_run(); r.font.size = Pt(size); r.font.name = FONT
    for t, txt in (('begin', None), ('instr', code), ('sep', None), ('text', '1'), ('end', None)):
        if t == 'instr':
            el = OxmlElement('w:instrText'); el.set(qn('xml:space'), 'preserve'); el.text = f' {code} '; r._r.append(el)
        elif t == 'text':
            el = OxmlElement('w:t'); el.text = txt; r._r.append(el)
        else:
            el = OxmlElement('w:fldChar'); el.set(qn('w:fldCharType'), {'begin': 'begin', 'sep': 'separate', 'end': 'end'}[t]); r._r.append(el)


def new_doc(header_left, header_right, footer, top=0.7, bottom=0.45, side=0.6):
    d = Document()
    s = d.sections[0]
    s.page_width, s.page_height = Inches(8.5), Inches(11)
    s.left_margin = s.right_margin = Inches(side); s.top_margin = Inches(top); s.bottom_margin = Inches(bottom)
    s.header_distance = Inches(0.28); s.footer_distance = Inches(0.22)
    st = d.styles['Normal']; st.font.name = FONT; st.font.size = Pt(10)
    st.element.rPr.rFonts.set(qn('w:eastAsia'), FONT)
    st.paragraph_format.space_after = Pt(0)
    set_header_footer(d, header_left, header_right, footer)
    return d

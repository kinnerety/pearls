'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ACORN_REST_SVG } from './art';
import { sendForm } from '@/app/actions';
import type { Texts } from '@/lib/texts';
import { T, useEdit, useEditing } from './EditText';
import { TextsProvider } from './TextsContext';
import { Paras } from './Rich';

// The two popup forms: "suggest a pearl" (Kinneret's wording, 27.10.2026) and "report a mistake".
// Any link to #suggest or #report on the page opens them; so does opening the page with that hash.
type Kind = 'suggest' | 'report' | 'contact';
type Sent = 'suggest' | 'report' | 'other';

export default function Forms({ texts }: { texts: Texts }) {
  const refs = { suggest: useRef<HTMLDialogElement>(null), report: useRef<HTMLDialogElement>(null), contact: useRef<HTMLDialogElement>(null) };
  const editing = useEditing();

  useEffect(() => {
    if (editing) return;
    const open = (hash: string, place?: string) => {
      const m = /^#(suggest|report|contact)$/.exec(hash);
      if (!m) return false;
      const d = refs[m[1] as Kind].current;
      if (!d) return false;
      // a link with data-place (the "יש כאן טעות" button on a place page) opens the report form with that pearl's name filled in
      if (m[1] === 'report') { const f = d.querySelector<HTMLInputElement>('input[name="place"]'); if (f && place !== undefined) f.value = place; }
      d.showModal();
      d.focus(); // focus the popup itself, not the close button (no ring around the X on open)
      return true;
    };
    open(decodeURIComponent(location.hash));
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (a && open(a.getAttribute('href') || '', (a as HTMLElement).dataset.place)) e.preventDefault();
    };
    // a click before the page finished loading only changes the address
    const onHash = () => { if (open(decodeURIComponent(location.hash))) history.replaceState(null, '', location.pathname + location.search); };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHash);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('hashchange', onHash); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TextsProvider texts={texts}>
      <Popup kind="suggest" ref_={refs.suggest} texts={texts} art={ACORN_REST_SVG} view="0 28 160 70"><SuggestFields texts={texts} /></Popup>
      {/* Kinneret's own picture (27.10.2026): a carafe of juice and a tipped glass, the juice spilling out */}
      <Popup kind="report" ref_={refs.report} texts={texts} img="/art/report-juice.png"><ReportFields /></Popup>
      <Contact ref_={refs.contact} texts={texts} />
    </TextsProvider>
  );
}

function SuggestFields({ texts }: { texts: Texts }) {
  return (
    <>
      {/* the name and "what is it" side by side, to keep the form shorter (Kinneret 27.10) */}
      <div className="two">
        <Field q={<T k="suggest.name" />} hint={<T k="suggest.name.hint" />}><input name="name" required maxLength={120} /></Field>
        <Field q={<T k="suggest.what" />} hint={<T k="suggest.what.hint" />}><input name="what" required maxLength={200} /></Field>
      </div>
      <Field q={<T k="suggest.link" />} hint={<T k="suggest.link.hint" />}><input name="link" inputMode="url" dir="ltr" maxLength={300} /></Field>
      <Field q={<T k="suggest.where" />} hint={<T k="suggest.where.hint" />}><input name="where" required maxLength={200} /></Field>
      <Field q={<T k="suggest.love" />} hint={<T k="suggest.love.hint" />}><textarea name="love" rows={3} maxLength={2000} /></Field>
      <Choices q={<T k="suggest.shabbat" />} name="shabbat" k="suggest.shabbat.choices" options={texts['suggest.shabbat.choices']} />
      <Choices q={<T k="suggest.family" />} name="family" k="suggest.family.choices" options={texts['suggest.family.choices']} />
      <Field q={<T k="suggest.more" />} hint={<T k="suggest.more.hint" />}><textarea name="more" rows={2} maxLength={2000} /></Field>
      <YesNo q={<T k="suggest.credit" />} hint={<T k="suggest.credit.hint" />} name="credit" yes={<T k="suggest.credit.yes" />} no={<T k="suggest.credit.no" />}
        ask={<T k="suggest.credit.ask" />} input={<input name="credit_name" required maxLength={60} autoComplete="name" />} />
      <YesNo q={<T k="suggest.email" />} name="email_ok" yes={<T k="suggest.email.yes" />} no={<T k="suggest.email.no" />}
        ask={<T k="suggest.email.ask" />} input={<input name="email" type="email" required dir="ltr" maxLength={120} autoComplete="email" />} />
      <Row className="agree"><input type="checkbox" name="agree" value="yes" required /> <T k="suggest.agree" /></Row>
    </>
  );
}

function ReportFields() {
  return (
    <>
      {/* a plain field, no list to pick from (Kinneret 27.10) */}
      <Field q={<T k="report.place" />} hint={<T k="report.place.hint" />}><input name="place" maxLength={200} /></Field>
      <Field q={<T k="report.what" />} hint={<T k="report.what.hint" />}><textarea name="what" rows={4} required maxLength={2000} /></Field>
      <YesNo q={<T k="report.email" />} name="email_ok" yes={<T k="report.email.yes" />} no={<T k="report.email.no" />}
        ask={<T k="report.email.ask" />} input={<input name="email" type="email" required dir="ltr" maxLength={120} autoComplete="email" />} />
    </>
  );
}

function OtherFields() {
  return (
    <>
      <Field q={<T k="contact.name" />}><input name="name" required maxLength={120} autoComplete="name" /></Field>
      <Field q={<T k="contact.email" />} hint={<T k="contact.email.hint" />}><input name="email" type="email" required dir="ltr" maxLength={120} autoComplete="email" /></Field>
      <Field q={<T k="contact.message" />}><textarea name="message" rows={5} required maxLength={2000} /></Field>
    </>
  );
}

const TOPICS = ['suggest', 'report', 'question', 'other'] as const;
type Topic = typeof TOPICS[number];

/** The contact form (Kinneret, 30.10.2026): "באיזה עניין?" first, and the matching form appears under it.
 *  The first two are the suggest / report forms themselves; a question about a pearl only gets her sentence. */
export function Contact({ ref_, texts, inline = false }: { ref_?: React.RefObject<HTMLDialogElement | null>; texts: Texts; inline?: boolean }) {
  const editing = useEditing();
  const [topic, setTopic] = useState<Topic | ''>('');
  const [done, setDone] = useState(false);
  const names = texts['contact.topics'].split('\n').map(s => s.trim()).filter(Boolean);
  const sent: Sent | null = topic === 'suggest' || topic === 'report' ? topic : topic === 'other' ? 'other' : null;
  const dkey = (k: string) => `${sent === 'other' ? 'contact' : sent}.done.${k}` as keyof Texts;

  const picker = (
    <Row className="field topic">
      <b><T k="contact.topic" /></b>
      {editing
        ? <div className="topics">{TOPICS.map((_, i) => <span key={i} className="pill"><T k="contact.topics" line={i} /></span>)}</div>
        : <select name="topic" value={topic} onChange={e => setTopic(e.target.value as Topic)} required>
            <option value="" disabled>{texts['contact.topic.pick']}</option>
            {TOPICS.map((t, i) => <option key={t} value={t}>{names[i] || t}</option>)}
          </select>}
    </Row>
  );
  // Kinneret's rotary phone, the same picture as "ליצור קשר" in the menu (30.10.2026)
  const head = <><img className="pic phone" src="/art/menu-phone.png" alt="" /><h2 id="contact-title"><T k="contact.title" /></h2><p className="sub"><T k="contact.subtitle" /></p></>;

  // the admin shows everything one after the other, so every text can be edited
  if (editing) return (
    <div className="form-pop static">
      <p className="adm-hint">טופס יצירת הקשר כשבוחרים "{names[2] || 'שאלה על פנינה'}":</p>
      <div className="sheet">{head}{picker}<p className="note-q pre"><T k="contact.question" /></p></div>
      <p className="adm-hint">טופס יצירת הקשר כשבוחרים "{names[3] || 'משהו אחר'}" (ב"המלצה על פנינה" וב"דיווח על טעות" מופיעים הטפסים שלמעלה, עם אותם טקסטים):</p>
      <div className="sheet">{head}<OtherFields /><button className="send" disabled><T k="contact.send" /></button></div>
      <div className="sheet"><Done prefix="contact" texts={texts} /></div>
    </div>
  );

  const body = (
    <div className="sheet">
      {!inline && !done && <button type="button" className="x" aria-label="סגירה" onClick={() => ref_?.current?.close()}>×</button>}
      {done && sent ? <Done prefix={sent === 'other' ? 'contact' : sent} texts={texts} key={dkey('title')} /> : <>
        {head}
        {picker}
        {topic === 'question' && <div className="note-q" role="status"><Paras text={texts['contact.question']} /></div>}
        {sent && <SendForm kind={sent} key={sent} sendKey={sent === 'other' ? 'contact.send' : `${sent}.send` as keyof Texts} onDone={() => setDone(true)} extra={{ via: 'contact' }}>
          {sent === 'suggest' ? <SuggestFields texts={texts} /> : sent === 'report' ? <ReportFields /> : <OtherFields />}
        </SendForm>}
      </>}
    </div>
  );
  if (inline) return <div className="form-pop static contact-page">{body}</div>;
  return (
    <dialog tabIndex={-1} className="form-pop" id="contact-pop" aria-labelledby="contact-title" ref={ref_}
      onClose={() => { setDone(false); setTopic(''); }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      {body}
    </dialog>
  );
}

/** A form that sends itself, with the anti-bot timer (the time the form appeared) and the error line */
function SendForm({ kind, sendKey, onDone, extra, children }: { kind: Sent; sendKey: keyof Texts; onDone: () => void; extra?: Record<string, string>; children: ReactNode }) {
  const [state, setState] = useState<'form' | 'sending'>('form');
  const [error, setError] = useState('');
  const [opened] = useState(() => Date.now());
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setState('sending');
    const data = Object.fromEntries([...new FormData(e.currentTarget).entries()].map(([k, v]) => [k, String(v)]));
    const r = await sendForm(kind === 'other' ? 'contact' : kind, { ...data, ...extra, _t: String(opened) }).catch(() => ({ ok: false as const, error: 'משהו השתבש בשליחה. אפשר לנסות שוב בעוד רגע' }));
    if (r.ok) onDone();
    else { setError(r.error); setState('form'); }
  }
  return (
    <form onSubmit={submit}>
      {children}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && <p className="err" role="alert">{error}</p>}
      <button className="send" disabled={state === 'sending'}>{state === 'sending' ? '...' : <T k={sendKey} />}</button>
    </form>
  );
}

function Done({ prefix, texts }: { prefix: 'suggest' | 'report' | 'contact'; texts: Texts }) {
  const editing = useEditing();
  const key = (k: string) => `${prefix}.done.${k}` as keyof Texts;
  return (
    <div className="done" role={editing ? undefined : 'status'}>
      <h2><T k={key('title')} /></h2>
      {editing ? <p className="pre"><T k={key('text')} /></p> : texts[key('text')].split('\n').filter(Boolean).map((l, i) => <p key={i}>{l}</p>)}
      <a className="send" href="/" onClick={e => { if (editing) e.preventDefault(); }}><T k={key('button')} /></a>
    </div>
  );
}

function Popup({ kind, ref_, texts, art, view, img, children }: {
  kind: 'suggest' | 'report'; ref_: React.RefObject<HTMLDialogElement | null>; texts: Texts; art?: string; view?: string; img?: string; children: ReactNode;
}) {
  const [state, setState] = useState<'form' | 'sending' | 'done'>('form');
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(0);
  const editing = useEditing();
  const key = (k: string) => `${kind}.${k}` as keyof Texts;

  // the time the form was opened: a form filled in a couple of seconds is a bot
  useEffect(() => {
    const d = ref_.current;
    if (!d) return;
    const mark = () => setOpened(Date.now());
    const obs = new MutationObserver(() => { if (d.open) mark(); });
    obs.observe(d, { attributes: true, attributeFilter: ['open'] });
    return () => obs.disconnect();
  }, [ref_]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setState('sending');
    const data = Object.fromEntries([...new FormData(e.currentTarget).entries()].map(([k, v]) => [k, String(v)]));
    const r = await sendForm(kind, { ...data, _t: String(opened) }).catch(() => ({ ok: false as const, error: 'משהו השתבש בשליחה. אפשר לנסות שוב בעוד רגע' }));
    if (r.ok) { setState('done'); ref_.current?.scrollTo?.(0, 0); }
    else { setError(r.error); setState('form'); }
  }

  const pic = img ? <img className="pic" src={img} alt="" /> : <svg className="pic" viewBox={view} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art || '' }} />;
  const done = (
    <div className="done" role={editing ? undefined : 'status'}>
      <h2 id={editing ? undefined : `${kind}-title`}><T k={key('done.title')} /></h2>
      {editing ? <p className="pre"><T k={key('done.text')} /></p> : texts[key('done.text')].split('\n').filter(Boolean).map((l, i) => <p key={i}>{l}</p>)}
      <a className="send" href="/" onClick={e => { if (editing) e.preventDefault(); }}><T k={key('done.button')} /></a>
    </div>
  );
  const form = (
    <form onSubmit={submit}>
      <h2 id={`${kind}-title`}><T k={key('title')} /></h2>
      {children}
      {/* people never see this field; bots fill it (off while editing: it sits far to the left and would widen the page) */}
      {!editing && <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />}
      {error && <p className="err" role="alert">{error}</p>}
      <button className="send" disabled={state === 'sending' || editing}>{state === 'sending' ? '...' : <T k={key('send')} />}</button>
    </form>
  );
  // the admin shows the popup open on the page, the form and the thank-you message one after the other
  if (editing) return (
    <div className="form-pop static">
      <div className="sheet">{pic}{form}</div>
      <div className="sheet">{pic}{done}</div>
    </div>
  );
  return (
    <dialog tabIndex={-1} className="form-pop" id={`${kind}-pop`} aria-labelledby={`${kind}-title`} ref={ref_}
      onClose={() => { if (state === 'done') setState('form'); setError(''); }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <div className="sheet">
        {state !== 'done' && <button type="button" className="x" aria-label="סגירה" onClick={() => ref_.current?.close()}>×</button>}
        {pic}
        {state === 'done' ? done : form}
      </div>
    </dialog>
  );
}

/** A <label>, except while editing texts in the admin (a click would move the caret to the field instead of the text) */
function Row({ className, children }: { className: string; children: ReactNode }) {
  return useEditing() ? <div className={className}>{children}</div> : <label className={className}>{children}</label>;
}

function Field({ q, hint, children }: { q: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <Row className="field">
      <b>{q}</b>
      {hint && <small>{hint}</small>}
      {children}
    </Row>
  );
}

/** The answers of one question, one per line of its text: yes, no, and an optional third "don't know".
 * While editing in the admin every line shows (an emptied one disappears from the site), and a third can be added. */
function Choices({ q, name, k, options }: { q: ReactNode; name: string; k: 'suggest.shabbat.choices' | 'suggest.family.choices'; options: string }) {
  const vals = ['yes', 'no', 'unknown'];
  const edit = useEdit();
  const live = edit ? edit.texts[k] : options;
  const lines = live.split('\n').map(s => s.trim()).slice(0, 3);
  const shown = edit ? lines : lines.filter(Boolean);
  return (
    <fieldset className="field choices">
      <legend><b>{q}</b></legend>
      <div className="opts">
        {shown.map((_, i) => (
          <Row key={i} className="pill"><input type="radio" name={name} value={vals[i]} /><span><T k={k} line={i} /></span></Row>
        ))}
        {edit && lines.length < 3 && <button type="button" className="pill add" onClick={() => edit.set(k, [...lines, 'לא יודעים'].join('\n'))}>+ תשובה</button>}
      </div>
    </fieldset>
  );
}

/** A yes/no question; "yes" opens a short field to its left (Kinneret: "ייפתח משמאל") */
function YesNo({ q, hint, name, yes, no, ask, input }: { q: ReactNode; hint?: ReactNode; name: string; yes: ReactNode; no: ReactNode; ask: ReactNode; input: ReactNode }) {
  const editing = useEditing();
  const [v, setV] = useState('');
  return (
    <fieldset className="field yesno">
      <legend><b>{q}</b></legend>
      {hint && <small>{hint}</small>}
      <div className="yes-row">
        <Row className="pill"><input type="radio" name={name} value="yes" checked={v === 'yes'} onChange={() => setV('yes')} /><span>{yes}</span></Row>
        {(v === 'yes' || editing) && <Row className="ask">{ask} {input}</Row>}
      </div>
      <Row className="pill"><input type="radio" name={name} value="no" checked={v === 'no'} onChange={() => setV('no')} /><span>{no}</span></Row>
    </fieldset>
  );
}

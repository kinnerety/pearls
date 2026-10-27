'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ACORN_REST_SVG, REPORT_SVG } from './art';
import { sendForm } from '@/app/actions';
import type { Texts } from '@/lib/texts';

// The two popup forms: "suggest a pearl" (Kinneret's wording, 27.10.2026) and "report a mistake".
// Any link to #suggest or #report on the page opens them (#report-<id> picks that pearl); so does opening the page with that hash.
type Kind = 'suggest' | 'report';
type PlaceRef = { id: number; name: string };

export default function Forms({ texts, places }: { texts: Texts; places: PlaceRef[] }) {
  const refs = { suggest: useRef<HTMLDialogElement>(null), report: useRef<HTMLDialogElement>(null) };
  const [place, setPlace] = useState('');

  useEffect(() => {
    const open = (hash: string) => {
      const m = /^#(suggest|report)(?:-(\d+))?$/.exec(hash);
      if (!m) return false;
      if (m[2]) setPlace(places.find(p => p.id === +m[2])?.name || '');
      refs[m[1] as Kind].current?.showModal();
      return true;
    };
    open(decodeURIComponent(location.hash));
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (a && open(a.getAttribute('href') || '')) e.preventDefault();
    };
    // a click before the page finished loading only changes the address
    const onHash = () => { if (open(decodeURIComponent(location.hash))) history.replaceState(null, '', location.pathname + location.search); };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHash);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('hashchange', onHash); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Popup kind="suggest" ref_={refs.suggest} texts={texts} art={ACORN_REST_SVG} view="0 28 160 70">
        <Field q={texts['suggest.name']} hint={texts['suggest.name.hint']}><input name="name" required maxLength={120} /></Field>
        <Field q={texts['suggest.what']} hint={texts['suggest.what.hint']}><input name="what" required maxLength={200} /></Field>
        <Field q={texts['suggest.where']} hint={texts['suggest.where.hint']}><input name="where" required maxLength={200} /></Field>
        <Field q={texts['suggest.love']} hint={texts['suggest.love.hint']}><textarea name="love" rows={3} maxLength={2000} /></Field>
        <Choices q={texts['suggest.shabbat']} name="shabbat" options={texts['suggest.choices']} />
        <Choices q={texts['suggest.family']} name="family" options={texts['suggest.choices']} />
        <Field q={texts['suggest.more']} hint={texts['suggest.more.hint']}><textarea name="more" rows={2} maxLength={2000} /></Field>
        <YesNo q={texts['suggest.credit']} hint={texts['suggest.credit.hint']} name="credit" yes={texts['suggest.credit.yes']} no={texts['suggest.credit.no']}
          ask={texts['suggest.credit.ask']} input={<input name="credit_name" required maxLength={60} autoComplete="name" />} />
        <YesNo q={texts['suggest.email']} name="email_ok" yes={texts['suggest.email.yes']} no={texts['suggest.email.no']}
          ask={texts['suggest.email.ask']} input={<input name="email" type="email" required dir="ltr" maxLength={120} autoComplete="email" />} />
        <label className="agree"><input type="checkbox" name="agree" value="yes" required /> {texts['suggest.agree']}</label>
      </Popup>

      <Popup kind="report" ref_={refs.report} texts={texts} art={REPORT_SVG} view="0 16 160 80">
        <Field q={texts['report.place']} hint={texts['report.place.hint']}>
          <input name="place" list="report-places" maxLength={200} value={place} onChange={e => setPlace(e.target.value)} />
          <datalist id="report-places">{places.map(p => <option key={p.id} value={p.name} />)}</datalist>
          <input type="hidden" name="place_id" value={places.find(p => p.name === place.trim())?.id ?? ''} />
        </Field>
        <Field q={texts['report.what']} hint={texts['report.what.hint']}><textarea name="what" rows={4} required maxLength={2000} /></Field>
        <YesNo q={texts['report.email']} name="email_ok" yes={texts['report.email.yes']} no={texts['report.email.no']}
          ask={texts['report.email.ask']} input={<input name="email" type="email" required dir="ltr" maxLength={120} autoComplete="email" />} />
      </Popup>
    </>
  );
}

function Popup({ kind, ref_, texts, art, view, children }: {
  kind: Kind; ref_: React.RefObject<HTMLDialogElement | null>; texts: Texts; art: string; view: string; children: ReactNode;
}) {
  const [state, setState] = useState<'form' | 'sending' | 'done'>('form');
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(0);
  const t = (k: string) => texts[`${kind}.${k}` as keyof Texts];

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

  return (
    <dialog className="form-pop" id={`${kind}-pop`} aria-labelledby={`${kind}-title`} ref={ref_}
      onClose={() => { if (state === 'done') setState('form'); setError(''); }}
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <div className="sheet">
        {state !== 'done' && <button type="button" className="x" aria-label="סגירה" onClick={() => ref_.current?.close()}>×</button>}
        <svg className="pic" viewBox={view} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
        {state === 'done' ? (
          <div className="done" role="status">
            <h2 id={`${kind}-title`}>{t('done.title')}</h2>
            {t('done.text').split('\n').filter(Boolean).map((l, i) => <p key={i}>{l}</p>)}
            <a className="send" href="/">{t('done.button')}</a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id={`${kind}-title`}>{t('title')}</h2>
            {children}
            {/* people never see this field; bots fill it */}
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error && <p className="err" role="alert">{error}</p>}
            <button className="send" disabled={state === 'sending'}>{state === 'sending' ? '...' : t('send')}</button>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Field({ q, hint, children }: { q: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <b>{q}</b>
      {hint && <small>{hint}</small>}
      {children}
    </label>
  );
}

function Choices({ q, name, options }: { q: string; name: string; options: string }) {
  const vals = ['yes', 'no', 'unknown'];
  return (
    <fieldset className="field choices">
      <legend><b>{q}</b></legend>
      <div className="opts">
        {options.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3).map((label, i) => (
          <label key={i} className="pill"><input type="radio" name={name} value={vals[i]} /><span>{label}</span></label>
        ))}
      </div>
    </fieldset>
  );
}

/** A yes/no question; "yes" opens a short field to its left (Kinneret: "ייפתח משמאל") */
function YesNo({ q, hint, name, yes, no, ask, input }: { q: string; hint?: string; name: string; yes: string; no: string; ask: string; input: ReactNode }) {
  const [v, setV] = useState('');
  return (
    <fieldset className="field yesno">
      <legend><b>{q}</b></legend>
      {hint && <small>{hint}</small>}
      <div className="yes-row">
        <label className="pill"><input type="radio" name={name} value="yes" checked={v === 'yes'} onChange={() => setV('yes')} /><span>{yes}</span></label>
        {v === 'yes' && <label className="ask">{ask} {input}</label>}
      </div>
      <label className="pill"><input type="radio" name={name} value="no" checked={v === 'no'} onChange={() => setV('no')} /><span>{no}</span></label>
    </fieldset>
  );
}

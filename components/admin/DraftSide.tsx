'use client';
import type { Place } from '@/lib/types';
import type { Texts } from '@/lib/texts';
import PlaceCard from '@/components/PlaceCard';
import { TextsProvider } from '@/components/TextsContext';
import { DEFAULT_TEXTS } from '@/lib/texts';

type From = { kind: string; when: string; name?: string; what?: string; where?: string; link?: string; love?: string; more?: string; shabbat?: string; family?: string; credit?: string; email?: string };
export type DraftInfo = { id: number; from: From; sources: { title?: string; url: string }[]; pos: number; total: number; next: number | null };

const ANSWER: Record<string, string> = { yes: 'כן', no: 'לא', unknown: 'לא יודעים' };
const url = (u?: string) => u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : '';
const host = (u: string) => { try { return new URL(url(u)).hostname.replace(/^www\./, ''); } catch { return u; } };

// Beside a new pearl's fields: the card exactly as the site will show it (updates while typing), then where the pearl
// came from: what the visitor wrote, their link, and the sources Claude read, so Kinneret can check them herself.
export default function DraftSide({ p, info, texts }: { p: Place; info: DraftInfo; texts?: Texts }) {
  const f = info.from;
  return (
    <aside className="adm-review-side">
      <div>
        <h2 className="adm-h2">ככה זה ייראה באתר</h2>
        <TextsProvider texts={texts ?? DEFAULT_TEXTS}><div className="list draft-list"><PlaceCard p={p} /></div></TextsProvider>
        {/* she must see this before approving (Kinneret, 30.10.2026) */}
        {!(p.lat != null && p.precision === 'exact') && <p className="adm-warn">לא מצאתי מיקום מדויק{p.lat != null ? ' (כרגע במרכז היישוב)' : ''}</p>}
      </div>
      <section className="adm-card adm-source">
        <h2>המקור</h2>
        <dl>
          <dt>הגיעה</dt><dd>{f.kind}, {new Date(f.when).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })}</dd>
          {f.name && <><dt>השם בהצעה</dt><dd>{f.name}</dd></>}
          {f.what && <><dt>מה זה</dt><dd>{f.what}</dd></>}
          {f.where && <><dt>איפה</dt><dd>{f.where}</dd></>}
          {f.link && <><dt>הקישור שלהם</dt><dd><a href={url(f.link)} target="_blank" rel="noopener" dir="ltr">{host(f.link)}</a></dd></>}
          {f.love && <><dt>מה אהבו</dt><dd>{f.love}</dd></>}
          {f.shabbat && <><dt>פתוח בשבת</dt><dd>{ANSWER[f.shabbat] || f.shabbat}</dd></>}
          {f.family && <><dt>גם למשפחות</dt><dd>{ANSWER[f.family] || f.family}</dd></>}
          {f.more && <><dt>עוד חשוב</dt><dd>{f.more}</dd></>}
          {f.credit && <><dt>לציין ממליץ</dt><dd>כן: "המלצה של {f.credit}"</dd></>}
          {f.email && <><dt>מייל לשאלות</dt><dd><a href={`mailto:${f.email}`} dir="ltr">{f.email}</a></dd></>}
        </dl>
        <h2>המקורות שקראתי</h2>
        {info.sources.length ? (
          <ul className="adm-sources">
            {info.sources.map(s => <li key={s.url}><a href={url(s.url)} target="_blank" rel="noopener">{s.title || host(s.url)}</a></li>)}
          </ul>
        ) : <p className="adm-hint">{p.link ? 'לפנינה הזאת לא נשמרה רשימת מקורות. הקישור שבכרטיס:' : 'לפנינה הזאת לא נשמרה רשימת מקורות.'}{p.link && <> <a href={p.link} target="_blank" rel="noopener">{host(p.link)}</a></>}</p>}
        <p className="adm-hint">כל קישור נפתח בלשונית חדשה.</p>
      </section>
    </aside>
  );
}

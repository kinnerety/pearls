import { Fragment, type ReactNode } from 'react';

// One line of an about text: **bold**, ==marker== and [word](link), as Kinneret types them in /admin/texts
export default function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|==(.+?)==|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = m.index;
    if (m[1] !== undefined) out.push(<strong key={k}><Rich text={m[1]} /></strong>);
    else if (m[2] !== undefined) out.push(<mark key={k}><Rich text={m[2]} /></mark>);
    else {
      const href = m[4], ext = /^https?:/.test(href);
      out.push(<a key={k} href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{m[3]}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}

/** Every line of a text as its own paragraph */
export function Paras({ text }: { text: string }) {
  return <>{text.split('\n').map(l => l.trim()).filter(Boolean).map((l, i) => <p key={i}><Rich text={l} /></p>)}</>;
}

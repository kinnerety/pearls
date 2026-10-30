'use client';
import { useRef } from 'react';
import { ACORN_REST_SVG } from './art';
import type { Texts } from '@/lib/texts';
import { T, useEditing } from './EditText';

// The light-blue "נגישות" chip under "עוד העדפות" (Kinneret, 30.10.2026): not a filter. A click opens a popup, on phones and computers alike
// (until 30.10 afternoon it was a tooltip that pushed the panel around on phones), styled like the suggest-a-pearl popup with the resting acorn.
// The texts are hers to edit in /admin/texts, where the popup shows open on the page.
export default function AccessTip({ texts }: { texts: Texts }) {
  const editing = useEditing();
  const dlg = useRef<HTMLDialogElement>(null);
  const paras = texts['access.text'].split('\n').map(s => s.trim()).filter(Boolean);

  const sheet = (
    <div className="sheet">
      {!editing && <button type="button" className="x" aria-label="סגירה" onClick={() => dlg.current?.close()}>×</button>}
      <svg className="pic" viewBox="0 28 160 70" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_REST_SVG }} />
      <h2 id="access-title"><T k="access.title" /></h2>
      {paras.map((_, i) => <p key={i}><T k="access.text" line={i} /></p>)}
      <button type="button" className="send" onClick={() => { if (!editing) dlg.current?.close(); }}><T k="access.button" /></button>
    </div>
  );

  return (
    <div className="access">
      <button type="button" className="chip access-chip" aria-haspopup="dialog" aria-controls="access-pop"
        onClick={() => { if (editing) return; const d = dlg.current; if (!d) return; d.showModal(); d.focus(); }}><T k="access.chip" /></button>
      {editing
        ? <div className="form-pop access-pop static" id="access-pop">{sheet}</div>
        : <dialog tabIndex={-1} className="form-pop access-pop" id="access-pop" aria-labelledby="access-title" ref={dlg}
            onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>{sheet}</dialog>}
    </div>
  );
}

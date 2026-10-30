'use client';
import { forwardRef } from 'react';
import { CAR_SVG } from './art';
import type { Texts } from '@/lib/texts';
import { T, useEditing } from './EditText';

// "Check it yourself" note, shown when choosing families / open on Shabbat. Can be silenced for this visit (sessionStorage).
let checkHidden = false;
export function checkSeen(): boolean {
  if (checkHidden) return true;
  try { return sessionStorage.getItem('checkHidden') === '1'; } catch { return false; }
}

const CheckPopup = forwardRef<HTMLDialogElement, { texts: Texts }>(function CheckPopup(_, ref) {
  const editing = useEditing();
  const sheet = (
    <div className="sheet">
      <svg className="pic illo" viewBox="0 0 120 78" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CAR_SVG }} />
      <h2 id="check-title"><T k="popup.title" /></h2>
      <p className="pre"><T k="popup.text" /></p>
      <form method="dialog" onSubmit={e => { if (editing) e.preventDefault(); }}>
        {editing ? <div className="once"><input type="checkbox" disabled /> <T k="popup.once" /></div> : <label className="once"><input type="checkbox" id="check-once" /> <T k="popup.once" /></label>}
        <button type={editing ? 'button' : 'submit'}><T k="popup.button" /></button>
      </form>
    </div>
  );
  // the admin shows the popup open on the page, every text editable in place
  if (editing) return <div className="check-pop static">{sheet}</div>;
  return (
    <dialog className="check-pop" id="check-pop" aria-labelledby="check-title" ref={ref}
      onClose={e => {
        const once = (e.currentTarget.querySelector('#check-once') as HTMLInputElement | null)?.checked;
        if (once) { checkHidden = true; try { sessionStorage.setItem('checkHidden', '1'); } catch {} }
      }}>
      {sheet}
    </dialog>
  );
});
export default CheckPopup;

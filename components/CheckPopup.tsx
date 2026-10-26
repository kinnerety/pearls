'use client';
import { forwardRef } from 'react';
import { CAR_SVG } from './art';
import type { Texts } from '@/lib/texts';

// "Check it yourself" note, shown when choosing families / open on Shabbat. Can be silenced for this visit (sessionStorage).
let checkHidden = false;
export function checkSeen(): boolean {
  if (checkHidden) return true;
  try { return sessionStorage.getItem('checkHidden') === '1'; } catch { return false; }
}

const CheckPopup = forwardRef<HTMLDialogElement, { texts: Texts }>(function CheckPopup({ texts }, ref) {
  return (
    <dialog className="check-pop" id="check-pop" aria-labelledby="check-title" ref={ref}
      onClose={e => {
        const once = (e.currentTarget.querySelector('#check-once') as HTMLInputElement | null)?.checked;
        if (once) { checkHidden = true; try { sessionStorage.setItem('checkHidden', '1'); } catch {} }
      }}>
      <div className="sheet">
        <svg className="pic illo" viewBox="0 0 120 78" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CAR_SVG }} />
        <h2 id="check-title">{texts['popup.title']}</h2>
        <p>{texts['popup.text']}</p>
        <form method="dialog">
          <label className="once"><input type="checkbox" id="check-once" /> {texts['popup.once']}</label>
          <button>{texts['popup.button']}</button>
        </form>
      </div>
    </dialog>
  );
});
export default CheckPopup;

'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { shareText } from '@/lib/share';
import { useTexts } from './TextsContext';

// Phones open the share sheet (WhatsApp, sending to yourself, notes...); desktops copy the text.
// The picture comes from the link preview of the place's page (see lib/share.ts), not as a separate attachment.
export default function CardShare({ p }: { p: Place }) {
  const [done, setDone] = useState(false);
  const texts = useTexts();
  const share = async () => {
    const text = shareText(p, location.origin, texts);
    if (navigator.share) { try { await navigator.share({ title: p.name, text }); } catch {} return; }
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { prompt('העתיקו את הטקסט:', text); }
  };
  return (
    <button type="button" className="sh" onClick={share}>
      <span className="blob" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 10.7l6.8-4.4M8.6 13.3l6.8 4.4" /></svg>
      </span>
      <span className="lbl">{done ? <>הועתק,<br />אפשר להדביק ✓</> : <>שיתוף או<br />שליחה לעצמי</>}</span>
    </button>
  );
}

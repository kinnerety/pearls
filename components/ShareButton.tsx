'use client';
import { useState } from 'react';

// The place page's share button sends the same message as the card's (Kinneret, 2026-10-27): text only, the links are inside it.
// Phones get the native share sheet (WhatsApp etc.); desktops copy the text.
export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title, text }); } catch {} return; }
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { prompt('העתיקו את הטקסט:', text); }
  };
  return <button type="button" className="share" onClick={share}>{done ? 'הועתק, אפשר להדביק ✓' : 'שיתוף'}</button>;
}

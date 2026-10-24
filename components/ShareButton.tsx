'use client';
import { useState } from 'react';

// Phones get the native share sheet (WhatsApp etc.); desktops copy the link.
export default function ShareButton({ title, text }: { title: string; text?: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = location.href;
    if (navigator.share) { try { await navigator.share({ title, text, url }); } catch {} return; }
    try { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 2000); } catch { prompt('העתיקו את הקישור:', url); }
  };
  return <button type="button" className="share" onClick={share}>{done ? 'הקישור הועתק ✓' : 'שיתוף'}</button>;
}

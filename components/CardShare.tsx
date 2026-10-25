'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { shareText } from '@/lib/share';

// Phones open the share sheet (WhatsApp, sending to yourself, notes...); desktops copy the text.
export default function CardShare({ p }: { p: Place }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const text = shareText(p, location.origin);
    if (navigator.share) { try { await navigator.share({ title: p.name, text }); } catch {} return; }
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { prompt('העתיקו את הטקסט:', text); }
  };
  return <button type="button" className="sh" onClick={share}>{done ? 'הועתק, אפשר להדביק ✓' : 'שיתוף או שליחה לעצמי'}</button>;
}

'use client';
import { useState } from 'react';
import { shareOrCopy } from '@/lib/share-sheet';

// The place page's share button sends the same message as the card's (Kinneret, 2026-10-27): text only, the links are inside it.
// Phones get the native share sheet (WhatsApp etc.); desktops copy the text (lib/share-sheet.ts explains why).
export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    if (await shareOrCopy(title, text)) { setDone(true); setTimeout(() => setDone(false), 2500); }
  };
  return <button type="button" className="share" onClick={share}>{done ? 'הועתק, אפשר להדביק ✓' : 'שיתוף'}</button>;
}

'use client';
import { useRef, useState } from 'react';
import type { Place } from '@/lib/types';
import { CAT_ILLO } from '@/lib/config';
import { shareText } from '@/lib/share';

// Phones open the share sheet (WhatsApp, sending to yourself, notes...) with the category's picture attached;
// desktops copy the text. The picture is fetched on pointerdown so it is ready by the click.
export default function CardShare({ p }: { p: Place }) {
  const [done, setDone] = useState(false);
  const img = useRef<Promise<File | null> | null>(null);
  const load = () => {
    if (!img.current) {
      const k = CAT_ILLO[p.cats[0]] || 'valley';
      img.current = fetch(`/share/${k}.jpg`).then(r => (r.ok ? r.blob() : null))
        .then(b => (b ? new File([b], `pninim-${k}.jpg`, { type: 'image/jpeg' }) : null)).catch(() => null);
    }
    return img.current;
  };
  const share = async () => {
    const text = shareText(p, location.origin);
    if (navigator.share) {
      const file = await load();
      const files = file && navigator.canShare?.({ files: [file] }) ? [file] : undefined;
      try { await navigator.share({ title: p.name, text, ...(files && { files }) }); return; }
      catch (e) { if ((e as Error).name === 'AbortError') return; }
      try { await navigator.share({ title: p.name, text }); return; } catch {}
      return;
    }
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch { prompt('העתיקו את הטקסט:', text); }
  };
  return (
    <button type="button" className="sh" onPointerDown={load} onClick={share}>
      <span className="blob" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 10.7l6.8-4.4M8.6 13.3l6.8 4.4" /></svg>
      </span>
      <span className="lbl">{done ? <>הועתק,<br />אפשר להדביק ✓</> : <>שיתוף או<br />שליחה לעצמי</>}</span>
    </button>
  );
}

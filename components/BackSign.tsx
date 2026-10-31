'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// the "לכל הפנינים" sign: goes back to the gallery WITH the filters the visitor chose (Kinneret, 31.10.2026:
// "אני רוצה שהסינונים שלי ישמרו"). Explorer remembers its last address (path + filters) in sessionStorage;
// the sign opens that address (or the plain home page when there is none, e.g. a shared link) and the gallery
// scrolls back to where the visitor was when they opened the pearl.
export const BACK_KEY = 'pearls:back';
export const SCROLL_KEY = 'pearls:scroll';
export const RESTORE_KEY = 'pearls:restore';

export default function BackSign({ label = 'לכל הפנינים' }: { label?: string }) {
  const [href, setHref] = useState('/');
  useEffect(() => {
    try { const h = sessionStorage.getItem(BACK_KEY); if (h && h.startsWith('/')) setHref(h); } catch {}
  }, []);
  const onClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    // tell the gallery to return to the spot the visitor left (Explorer reads and clears it)
    try { sessionStorage.setItem(RESTORE_KEY, '1'); } catch {}
  };
  return <Link href={href} className="sign" onClick={onClick}><span>{label}</span></Link>;
}

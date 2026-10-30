'use client';
import { useEffect } from 'react';

// Scrolls the page once on load so the element with this id sits in the middle of the screen
// (Kinneret, 30.10.2026: on the 404 page the card with the real message, not the header, should be what you see)
export default function ScrollCenter({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }), 150);
    return () => clearTimeout(t);
  }, [id]);
  return null;
}

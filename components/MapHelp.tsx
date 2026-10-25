'use client';
import { useEffect, useRef, useState } from 'react';

// "How to use the map?" link above the map: hover opens the tip, a click keeps it open (Kinneret's wording)
export default function MapHelp() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!stuck) return;
    const away = (e: Event) => { if (!box.current?.contains(e.target as Node)) { setStuck(false); setOpen(false); } };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setStuck(false); setOpen(false); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [stuck]);

  const enter = () => { clearTimeout(closeT.current); setOpen(true); };
  const leave = () => { if (!stuck) closeT.current = setTimeout(() => setOpen(false), 200); };

  return (
    <div className="maphelp" ref={box} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="maphelp-link" aria-expanded={open} aria-controls="maphelp-tip"
        onClick={() => { const s = !stuck; setStuck(s); setOpen(s); }}>איך להשתמש במפה?</button>
      {open && (
        <div className="maphelp-tip" id="maphelp-tip" role="tooltip">
          <b className="maphelp-title">איך להשתמש במפה?</b>
          <p><b>חשוב:</b> חלק מהפנינים ממוקמות בתוך היישוב באופן כללי, ולא במיקום מדויק ברמת הניווט לכתובת. כדי לנווט לשם, צריך להכניס ב-Waze את שם הפנינה.</p>
          <ul>
            <li>במחשב, כדי להתקרב ולהתרחק (זום-אין וזום-אאוט) צריך ללחוץ על הפלוס והמינוס, או לעמוד מעל למפה בלי ללחוץ עליה, ואז ללחוץ על קונטרול במקלדת (במק: ⌘) ולגלגל את גלגלת העכבר בו-זמנית. בטלפון פשוט מגדילים בשתי אצבעות.</li>
            <li>כדי להזיז את המפה צריך ללחוץ עליה עם העכבר ולגרור. בטלפון גוררים עם שתי אצבעות (אצבע אחת גוללת את העמוד).</li>
            <li>במחשב, ריחוף על פנינה יפתח את ההסבר עליה.</li>
            <li>לחיצה על פנינה תשאיר את ההסבר פתוח.</li>
            <li>המלצות מערכת מסומנות בכוכב.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

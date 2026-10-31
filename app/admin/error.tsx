'use client';
import { useEffect } from 'react';

// An unexpected error in the admin shows this instead of Next's English "Application error" page (Kinneret, 31.10.2026).
// The form keeps a copy of what was typed in the browser, so "לנסות שוב" brings back the page and offers to restore it.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div style={{ maxWidth: 560, margin: "40px auto" }}>
      <div className="adm-confirm" role="alert">
        <b>משהו השתבש בדף הניהול</b>
        <span className="adm-hint">מה שהוקלד נשמר בדפדפן. אפשר לנסות שוב ואם יש שינויים שלא נשמרו, הטופס יציע לשחזר אותם.</span>
        <div className="adm-row">
          <button type="button" className="adm-btn" onClick={reset}>לנסות שוב</button>
          <a className="adm-btn ghost" href="/admin">לדף הניהול הראשי</a>
        </div>
        {error.digest && <span className="adm-hint" dir="ltr">{error.digest}</span>}
      </div>
    </div>
  );
}

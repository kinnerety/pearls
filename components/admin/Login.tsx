'use client';
import { useActionState } from 'react';
import { login } from '@/app/admin/actions';

export default function Login() {
  const [err, act, pending] = useActionState(login, null);
  return (
    <form action={act} className="adm-card adm-login">
      <h1>ניהול הפנינים</h1>
      <label>סיסמה<input type="password" name="password" autoFocus required /></label>
      {err && <p className="adm-err">{err}</p>}
      <button className="adm-btn" disabled={pending}>כניסה</button>
    </form>
  );
}

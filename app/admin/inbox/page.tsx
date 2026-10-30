import { redirect } from 'next/navigation';

// The old inbox: suggestions now live in "פנינים חדשות", mistake reports in "פנינים באתר" (30.10.2026)
export default function InboxPage() {
  redirect('/admin/drafts');
}

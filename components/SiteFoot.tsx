import Link from 'next/link';

// a small line at the bottom of the public pages leading to the about page (Kinneret, 2026-10-27)
export default function SiteFoot({ label }: { label: string }) {
  return <footer className="site-foot"><Link href="/about">{label}</Link></footer>;
}

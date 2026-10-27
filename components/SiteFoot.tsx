import Link from 'next/link';

// a small "אודות" link at the bottom right of the public pages (Kinneret, 2026-10-27: bottom right, just the one word)
export default function SiteFoot({ label }: { label: string }) {
  return <footer className="site-foot"><Link href="/about">{label}</Link></footer>;
}

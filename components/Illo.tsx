import { ILLO } from '@/lib/illo';

export default function Illo({ k, className = '' }: { k: string; className?: string }) {
  return <svg className={`illo ${className}`.trim()} viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ILLO[k] || '' }} />;
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: '10px', background: '#333', color: '#fff' }}>
      <Link href="/" style={{ marginRight: '15px', color: pathname === '/' ? 'gray' : '#fff' }}>Home</Link>
      <Link href="/test_orgUnit" style={{ marginRight: '15px', color: pathname === '/test_orgUnit' ? 'gray' : '#fff' }}>Organisationseinheiten</Link>
    </nav>
  );
}

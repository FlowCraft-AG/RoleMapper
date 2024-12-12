'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        background: '#333',
        color: '#fff',
      }}
    >
      <div>
        {pathname === '/orgUnit' && (
          <Link href="/orgUnit" style={{ color: pathname === '/orgUnit' ? 'gray' : '#fff' }}>
            Organisationseinheiten
          </Link>
        )}
      </div>
      <div>
        {pathname === '/login' && (
          <Link href="/login" style={{ color: pathname === '/login' ? 'gray' : '#fff' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

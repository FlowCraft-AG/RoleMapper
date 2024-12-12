'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
<<<<<<< HEAD
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
=======
    <nav style={{ padding: '10px', background: '#333', color: '#fff' }}>
      <Link href="/" style={{ marginRight: '15px', color: pathname === '/' ? 'gray' : '#fff' }}>Home</Link>
      <Link href="/test_orgUnit" style={{ marginRight: '15px', color: pathname === '/test_orgUnit' ? 'gray' : '#fff' }}>Organisationseinheiten</Link>
>>>>>>> 93666387ec411201222081ccd1c907b209ebb25d
    </nav>
  );
}

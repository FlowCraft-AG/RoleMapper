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
        <Link
          href="/dummy2"
          style={{
            color: pathname === '/dummy2' ? 'gray' : '#fff',
            marginRight: '15px',
          }}
        >
          dummy 2
        </Link>
        <Link
          href="/organisationseinheiten"
          style={{
            color: pathname === '/organisationseinheiten' ? 'gray' : '#fff',
            marginRight: '15px',
          }}
        >
          Organisationseinheiten
        </Link>
        <Link
          href="/rollen"
          style={{
            color: pathname === '/rollen' ? 'gray' : '#fff',
            marginRight: '15px',
          }}
        >
          Ermittle Rollen
        </Link>
      </div>
      <div>
        <Link
          href="/login"
          style={{ color: pathname === '/login' ? 'gray' : '#fff' }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

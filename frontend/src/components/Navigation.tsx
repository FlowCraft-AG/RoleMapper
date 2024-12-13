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
        <Link
          href="/dummy2"
          style={{ color: pathname === '/dummy2' ? 'gray' : '#fff' }}
        >
          dummy 2
        </Link>
        <Link
          href="/organisationseinheiten"
          style={{
            marginRight: '15px',
            color: pathname === '/organisationseinheiten' ? 'gray' : '#fff',
          }}
        >
          Organisationseinheiten
        </Link>
        <Link
          href="/rollen"
          style={{
            marginRight: '15px',
            color: pathname === '/rollen' ? 'gray' : '#fff',
          }}
        >
          Ermittle Rollen
        </Link>
      </div>
      <Link
        href="/login"
        style={{ color: pathname === '/login' ? 'gray' : '#fff' }}
      >
        Login
      </Link>
    </nav>
  );
}

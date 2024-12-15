'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import theme from '../theme';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        background: `${theme.palette.custom?.selected}`,
        color: '#fff',
      }}
    >
      <div>
        <Link
          href="/dummy"
          style={{
            color:
              pathname === '/dummy'
                ? `${theme.palette.text?.primary}`
                : `${theme.palette.text?.secondary}`,
            marginRight: '15px',
          }}
        >
          dummy
        </Link>
        <Link
          href="/organisationseinheiten"
          style={{
            color:
              pathname === '/organisationseinheiten'
                ? `${theme.palette.text?.primary}`
                : `${theme.palette.text?.secondary}`,
            marginRight: '15px',
          }}
        >
          Organisationseinheiten
        </Link>
        <Link
          href="/rollen"
          style={{
            color:
              pathname === '/rollen'
                ? `${theme.palette.text?.primary}`
                : `${theme.palette.text?.secondary}`,
            marginRight: '15px',
          }}
        >
          Ermittle Rollen
        </Link>
      </div>
      <div>
        <Link
          href="/login"
          style={{
            color:
              pathname === '/login'
                ? `${theme.palette.text?.primary}`
                : `${theme.palette.text?.secondary}`,
          }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

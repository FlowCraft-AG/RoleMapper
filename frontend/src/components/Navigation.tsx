'use client';

import { Box, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useFacultyTheme } from '../theme/ThemeProviderWrapper';

export default function Navigation() {
  const pathname = usePathname();
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme]);

  const navLinks = [
    { href: '/startseite', label: 'Startseite' },
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/rollen', label: 'Ermittle Rollen' },
    { href: '/konfigurationen', label: 'Konfigurationen' },
  ];

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor:
          theme.palette.custom?.selected || theme.palette.primary.main,
        color: theme.palette.custom?.navbar?.secondary || '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color:
                pathname === link.href
                  ? theme.palette.custom?.navbar?.primary || '#000'
                  : theme.palette.custom?.navbar?.secondary || '#fff',
              textDecoration: 'none',
              fontWeight: pathname === link.href ? 'bold' : 'normal',
            }}
          >
            {link.label}
          </Link>
        ))}
      </Box>
      <Link
        href="/login"
        style={{
          color:
            pathname === '/login'
              ? theme.palette.custom?.navbar?.primary || '#000'
              : theme.palette.custom?.navbar?.secondary || '#fff',
          textDecoration: 'none',
          fontWeight: pathname === '/login' ? 'bold' : 'normal',
        }}
      >
        Login
      </Link>
    </Box>
  );
}

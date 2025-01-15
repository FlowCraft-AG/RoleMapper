'use client';

import { Box, Theme, Typography } from '@mui/material';
import Link from 'next/link';

interface NavLinksProps {
  pathname: string;
  useCustomStyles: boolean;
  theme: Theme;
  isAdmin: boolean | undefined;
}

export default function NavLinks({
  pathname,
  useCustomStyles,
  theme,
  isAdmin,
}: NavLinksProps) {
  const links = [
    { href: '/startseite', label: 'Startseite' },
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/prozesse', label: 'Prozesse' },
    { href: '/konfigurationen', label: 'Konfigurationen' },
    { href: '/models', label: 'Modelle' },
    { href: '/myProcess', label: 'Meine Prozesse' },
  ];

  if (isAdmin) {
    links.push({ href: '/process', label: 'Alle Prozesse' });
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            color: useCustomStyles
              ? pathname === link.href
                ? theme.palette.custom?.navbar?.primary || '#000'
                : theme.palette.custom?.navbar?.secondary || '#fff'
              : pathname === link.href
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            textDecoration: 'none',
            fontWeight: pathname === link.href ? 'bold' : 'normal',
            transition: !useCustomStyles ? 'color 0.3s ease-in-out' : undefined,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {link.label}
          </Typography>
        </Link>
      ))}
    </Box>
  );
}

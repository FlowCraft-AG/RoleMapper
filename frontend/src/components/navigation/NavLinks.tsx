'use client';

import { Box, Theme, Typography } from '@mui/material';
import { Session } from 'next-auth';
import Link from 'next/link';

interface NavLinksProps {
  pathname: string;
  useCustomStyles: boolean;
  theme: Theme;
  session: Session | null;
  isAdmin: boolean | undefined;
}

export default function NavLinks({
  pathname,
  useCustomStyles,
  theme,
  session,
  isAdmin,
}: NavLinksProps) {
  const links = [
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/prozesse', label: 'Prozesse' },
  ];

  if (session) {
    links.push({ href: '/camunda/myProcess', label: 'Meine Aktiven Prozesse' });
  }

  if (isAdmin) {
    links.push({ href: '/camunda', label: 'Alle Aktive Prozesse' });
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={true}
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
          onMouseEnter={(e) => {
            if (!useCustomStyles) {
              e.currentTarget.style.color = theme.palette.primary.dark;
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!useCustomStyles) {
              e.currentTarget.style.color =
                pathname === link.href
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary;
              e.currentTarget.style.transform = 'scale(1)';
            }
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

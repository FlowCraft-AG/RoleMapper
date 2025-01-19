'use client';

import { Box, Theme, Typography } from '@mui/material';
import Link from 'next/link';

interface NavLinksProps {
  /** Der aktuelle Pfadname der Seite. */
  pathname: string;
  /** Gibt an, ob benutzerdefinierte Designstile verwendet werden. */
  useCustomStyles: boolean;
  /** Das aktuelle Material-UI-Theme-Objekt. */
  theme: Theme;
  /** Gibt an, ob der Benutzer Administratorrechte besitzt. */
  isAdmin: boolean | undefined;
}

/**
 * Eine Komponente, die die Navigationslinks der Anwendung rendert.
 *
 * @param {NavLinksProps} props - Die Eigenschaften der Komponente.
 * @param {string} props.pathname - Der aktuelle Pfadname der Seite.
 * @param {boolean} props.useCustomStyles - Gibt an, ob benutzerdefinierte Designstile verwendet werden.
 * @param {Theme} props.theme - Das aktuelle Material-UI-Theme-Objekt.
 * @param {boolean | undefined} props.isAdmin - Gibt an, ob der Benutzer Administratorrechte besitzt.
 *
 * @returns Eine React-Komponente, die die Navigationslinks als flexibles Layout darstellt.
 */
export default function NavLinks({
  pathname,
  useCustomStyles,
  theme,
  isAdmin,
}: NavLinksProps) {
  // Definiert die Standard-Navigationslinks
  const links = [
    { href: '/startseite', label: 'Startseite' },
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/prozesse', label: 'Prozesse' },
    { href: '/konfigurationen', label: 'Konfigurationen' },
    { href: '/models', label: 'Modelle' },
    { href: '/myProcesses', label: 'Meine Prozesse' },
  ];

  // Fügt zusätzliche Links hinzu, wenn der Benutzer Admin ist
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

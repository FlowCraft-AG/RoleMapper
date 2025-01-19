'use client';

import { AppBar, Box, Switch, Toolbar, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import NavLinks from './NavLinks';
import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

/**
 * Hauptkomponente für die Navigationsleiste.
 * Diese Komponente zeigt eine AppBar mit Navigationslinks, einem Benachrichtigungsmenü, 
 * einem Schalter zur Anpassung von Designstilen und einem Benutzermenü an.
 *
 * @returns Die Navigationsleiste als React-Komponente.
 */
export default function Navigation() {
  // Aktueller Pfadname der Seite
  const pathname = usePathname();
  // Zugriff auf das aktuelle Material-UI-Theme
  const theme = useTheme();
  // Router-Objekt für Navigation und Routenmanagement
  const router = useRouter();
  // Zugriff auf das benutzerdefinierte Theme und die Methode zum Umschalten
  const { useCustomStyles, toggleCustomStyles } = useFacultyTheme();
  // Zugriff auf die aktuelle Sitzung des Benutzers
  const { data: session, update } = useSession();

  // Überprüft, ob der Benutzer Administratorrechte hat
  const isAdmin = session?.user.roles?.includes('Identity');

  // Dynamische Stile basierend auf der Verwendung des benutzerdefinierten Themes
  const dynamicStyles = useCustomStyles
    ? {
        backgroundColor:
          theme.palette.custom?.selected || theme.palette.primary.main,
        color: theme.palette.custom?.navbar?.secondary || '#fff',
      }
    : {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      };

  return (
    <AppBar
      position="sticky"
      sx={{
        ...dynamicStyles,
        boxShadow: theme.shadows[2],
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
        {/* Navigationslinks für die Hauptnavigation */}
        <NavLinks
          pathname={pathname}
          useCustomStyles={useCustomStyles}
          theme={theme}
          isAdmin={isAdmin}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Menü für Benachrichtigungen */}
          <NotificationMenu theme={theme} router={router} />
          {/* Schalter zur Aktivierung/Deaktivierung des benutzerdefinierten Designs */}
          <Switch
            checked={useCustomStyles}
            onChange={toggleCustomStyles}
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: useCustomStyles
                  ? theme.palette.custom?.navbar.secondary
                  : theme.palette.custom?.primary,
              },
              '& .MuiSwitch-track': {
                backgroundColor: useCustomStyles
                  ? theme.palette.custom?.navbar.secondary
                  : theme.palette.custom?.primary,
              },
            }}
          />
          {/* Menü für Benutzeraktionen wie Login/Logout */}
          <UserMenu
            theme={theme}
            useCustomStyles={useCustomStyles}
            session={session}
            pathname={pathname}
            update={update}
            router={router}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

'use client';

import { AppBar, Box, Switch, Toolbar, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { ENV } from '../../utils/env';
import NavLinks from './NavLinks';
import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const { ADMIN_GROUP } = ENV;
/**
 * Hauptkomponente für die Navigationsleiste.
 */
export default function Navigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const router = useRouter();
  const { useCustomStyles, toggleCustomStyles } = useFacultyTheme();
  const { data: session, update } = useSession();

  const isAdmin = session?.user.roles?.includes(ADMIN_GROUP); // Prüft, ob der Benutzer Admin ist

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
        <NavLinks
          pathname={pathname}
          useCustomStyles={useCustomStyles}
          theme={theme}
          isAdmin={isAdmin}
          session={session}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationMenu theme={theme} router={router} />
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

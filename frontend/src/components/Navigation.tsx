/**
 * @file Navigation.tsx
 * @description Implementiert die Navigationsleiste der Anwendung, einschließlich dynamischer Benachrichtigungen,
 * einer Umschaltfunktion für benutzerdefinierte Stile und Links zu verschiedenen Seiten.
 *
 * @module Navigation
 */
'use client';

import { Login, Logout, Notifications, Refresh } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchAncestors,
  getFunctionsWithoutUsers,
} from '../lib/api/rolemapper/function.api';
import { useFacultyTheme } from '../theme/ThemeProviderWrapper';
import { formatTime } from '../utils/counter-format.util';
import getFacultyTheme from '../theme/fakultäten';

/**
 * Typ für eine einzelne Benachrichtigung.
 *
 * @interface Notification
 * @property {string} message - Die Nachricht der Benachrichtigung.
 * @property {string} nodeId - Die ID des Knotens, auf den sich die Benachrichtigung bezieht.
 * @property {string} orgUnit - Die Organisationseinheit der Benachrichtigung.
 */
interface Notification {
  message: string;
  nodeId: string;
  orgUnit: string;
}

/**
 * Konfigurationskonstante für das Intervall zur Aktualisierung von Benachrichtigungen.
 * HIER ÄNDERN SIE DIE ZEIT
 */
const NOTIFICATION_UPDATE_INTERVAL = 86400000; // 24 Stunde

/**
 * `Navigation`-Komponente
 *
 * Diese Komponente implementiert die Haupt-Navigationsleiste der Anwendung.
 * - Zeigt Links zu verschiedenen Seiten an.
 * - Unterstützt Benachrichtigungen, die regelmäßig aktualisiert werden.
 * - Bietet eine Umschaltfunktion für benutzerdefinierte Stile.
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Navigationsleiste.
 *
 * @example
 * <Navigation />
 */
export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { useCustomStyles, toggleCustomStyles } = useFacultyTheme();
  const { data: session, update } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
//   const [useCustomStyles, setUseCustomStyles] = useState(true); // Toggle state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined,
  );

  const isAdmin = session?.user.roles?.includes('Identity'); // Prüft, ob der Benutzer Admin ist

  // Funktion zur Benachrichtigungsaktualisierung
  const fetchNotifications = async () => {
    try {
      const functionsWithoutUsers = await getFunctionsWithoutUsers();
      const newNotifications = functionsWithoutUsers.map((func) => ({
        message: `Die Funktion "${func.functionName}" hat keinen zugewiesenen Benutzer.`,
        nodeId: func.id,
        orgUnit: func.orgUnit,
      }));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benachrichtigungen:', error);
    }
  };

  /**
   * Aktualisiert das Thema, wenn Änderungen auftreten.
   */
  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [theme.palette]);

  /**
   * Ruft Benachrichtigungen ab, die Funktionen ohne zugewiesene Benutzer anzeigen.
   * Aktualisiert die Benachrichtigungen alle 10 Sekunden.
   */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(
      fetchNotifications,
      NOTIFICATION_UPDATE_INTERVAL,
    );

    if (session?.expires_in) {
      const now = Math.floor(Date.now() / 1000);
      setRemainingTime(session?.expires_in - now);

      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev !== undefined ? prev - 1 : undefined));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  /**
   * Handhabt das Klicken auf eine Benachrichtigung und navigiert zur entsprechenden Organisationseinheit.
   *
   * @param {Notification} notification - Die ausgewählte Benachrichtigung.
   */
  const handleNotificationClick = async (notification: Notification) => {
    handleCloseNotificationMenu();
    try {
      const ancestors = await fetchAncestors(notification.orgUnit);
      const ancestorIds = ancestors.map((ancestor) => ancestor._id);

      // Navigiere zu /organisationseinheiten mit den geöffneten Knoten
      router.push(
        `/organisationseinheiten?openNodes=${encodeURIComponent(
          ancestorIds.join(','),
        )}&selectedNode=${notification.nodeId}&parentOrgUnitId=${notification.orgUnit}`,
      );
    } catch (error) {
      console.error('Fehler beim Laden der Ancestors:', error);
    }
  };

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

  const navLinks = [
    { href: '/startseite', label: 'Startseite' },
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/prozesse', label: 'Prozesse' },
    { href: '/konfigurationen', label: 'Konfigurationen' },
    { href: '/models', label: 'Modele' },
    { href: '/myProcesses', label: 'Meine Prozesse' },
  ];

  if (isAdmin) {
    navLinks.push({ href: '/process', label: 'Alle Prozesse' });
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  /**
   * Wechselt das Theme und setzt es auf das Default-Theme.
   */
//   const handleToggleTheme = () => {
//     setUseCustomStyles(!useCustomStyles);
//     setFacultyTheme(getFacultyTheme('default'));
//   };

  // Manuelle Token-Aktualisierung
  const handleRefreshToken = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      await update();
      setError(undefined);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Tokens:', err);
      setError('Fehler beim Aktualisieren des Tokens');
    } finally {
      setLoading(false);
    }
  }, [update]);

  return (
    <AppBar
      position="sticky"
      sx={{
        ...dynamicStyles,
        boxShadow: theme.shadows[2],
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {navLinks.map((link) => (
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
                transition: !useCustomStyles
                  ? 'color 0.3s ease-in-out'
                  : undefined,
              }}
              onMouseEnter={(e) => {
                if (!useCustomStyles) {
                  e.currentTarget.style.color = theme.palette.primary.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!useCustomStyles) {
                  e.currentTarget.style.color =
                    pathname === link.href
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary;
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAdmin && (
            <>
              <Tooltip title="Benachrichtigungen">
                <IconButton
                  color="inherit"
                  onClick={handleOpenMenu}
                  aria-label="notifications"
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleCloseNotificationMenu}
            sx={{ mt: '45px' }}
          >
            <MenuItem disableRipple>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography variant="subtitle1">Benachrichtigungen</Typography>
                <Tooltip title="Aktualisieren">
                  <IconButton onClick={fetchNotifications}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
            <Divider />
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleCloseNotificationMenu}>
                Keine Meldungen
              </MenuItem>
            )}
          </Menu>

          <Tooltip title="Toggle Styles">
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
          </Tooltip>

          {/* Benutzername */}
          {session?.user.username ? (
            <>
              <Tooltip title="Profil">
                <IconButton onClick={handleOpenUserMenu}>
                  <Typography
                    variant="body1"
                    //   sx={{ fontWeight: 'bold', color: '#fff' }}
                    sx={{
                      color: useCustomStyles
                        ? theme.palette.custom?.navbar?.secondary || '#fff'
                        : theme.palette.text.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    {session.user.name}
                  </Typography>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
                sx={{ mt: '45px' }}
              >
                <MenuItem>
                  {remainingTime !== undefined ? (
                    <Typography variant="subtitle1" align="center">
                      {/* Dein Token läuft in
                      <br /> */}
                      {/* // Umwandlung in HH:MM:SS */}
                      {formatTime(remainingTime)}
                      {/* <br />
                      Sekunden ab. */}
                    </Typography>
                  ) : (
                    <Typography variant="subtitle1" align="center">
                      Dein Token läuft ist abgelaufen.
                    </Typography>
                  )}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleRefreshToken()}>
                  <Refresh fontSize="small" sx={{ marginRight: 1 }} />
                  Refresh Token
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => signOut()}>
                  <Logout fontSize="small" sx={{ marginRight: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Login">
              <Link
                href="/login"
                style={{
                  color: useCustomStyles
                    ? pathname === '/login'
                      ? theme.palette.custom?.navbar?.primary || '#000'
                      : theme.palette.custom?.navbar?.secondary || '#fff'
                    : pathname === '/login'
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: pathname === '/login' ? 'bold' : 'normal',
                  transition: !useCustomStyles
                    ? 'color 0.3s ease-in-out'
                    : undefined,
                }}
              >
                <Login />
                <Typography variant="body2" component="span">
                  Login
                </Typography>
              </Link>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

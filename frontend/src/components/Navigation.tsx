/**
 * @file Navigation.tsx
 * @description Implementiert die Navigationsleiste der Anwendung, einschließlich dynamischer Benachrichtigungen,
 * einer Umschaltfunktion für benutzerdefinierte Stile und Links zu verschiedenen Seiten.
 *
 * @module Navigation
 */
'use client';

import { Login, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  fetchAncestors,
  getFunctionsWithoutUsers,
} from '../lib/api/function.api';
import { useFacultyTheme } from '../theme/ThemeProviderWrapper';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setFacultyTheme } = useFacultyTheme();
  const [useCustomStyles, setUseCustomStyles] = useState(true); // Toggle state

  /**
   * Aktualisiert das Thema, wenn Änderungen auftreten.
   */
  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);

  /**
   * Ruft Benachrichtigungen ab, die Funktionen ohne zugewiesene Benutzer anzeigen.
   * Aktualisiert die Benachrichtigungen alle 10 Sekunden.
   */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const functionsWithoutUsers = await getFunctionsWithoutUsers();

        if (functionsWithoutUsers.length > 0) {
          const newNotifications = functionsWithoutUsers.map((func) => ({
            message: `Die Funktion "${func.functionName}" hat keinen zugewiesenen Benutzer.`,
            nodeId: func.id,
            orgUnit: func.orgUnit,
          }));
          setNotifications(newNotifications);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Benachrichtigungen:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Alle 10 Sekunden aktualisieren HIER ÄNDERN SIE DIE ZEIT
    return () => clearInterval(interval);
  }, []);

  /**
   * Handhabt das Klicken auf eine Benachrichtigung und navigiert zur entsprechenden Organisationseinheit.
   *
   * @param {Notification} notification - Die ausgewählte Benachrichtigung.
   */
  const handleNotificationClick = async (notification: Notification) => {
    handleCloseMenu();
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
    { href: '/rollen', label: 'Ermittle Rollen' },
    { href: '/konfigurationen', label: 'Konfigurationen' },
  ];

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            sx={{ mt: '45px' }}
          >
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
              <MenuItem onClick={handleCloseMenu}>Keine Meldungen</MenuItem>
            )}
          </Menu>

          <Tooltip title="Toggle Styles">
            <Switch
              checked={useCustomStyles}
              onChange={() => setUseCustomStyles(!useCustomStyles)}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

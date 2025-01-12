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
  Button,
  Card,
  CardActionArea,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Tab,
  Tabs,
  TextField,
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
  fetchFunctionsWithNoUsersOrRetiringUsers,
} from '../../lib/api/rolemapper/function.api';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { FunctionString } from '../../types/function.type';
import { formatTime } from '../../utils/counter-format.util';

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
 * Typ für eine Benachrichtigung.
 */
interface Notification {
  function: FunctionString;
  userList: UserRetirementInfo[];
}

interface UserRetirementInfo {
  userId: string;
  timeLeft: number;
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
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined,
  );
  const [notificationsGrouped, setNotificationsGrouped] = useState<
    NotificationGroup[]
  >([]);
  const [notificationsSingleUser, setNotificationsSingleUser] = useState<
    Notification[]
  >([]);
  const [notificationsMultiUser, setNotificationsMultiUser] = useState<
    Notification[]
  >([]);
  const [activeTab, setActiveTab] = useState(0); // Tab-Index
  const [lookaheadPeriod, setLookaheadPeriod] = useState(5); // Standardwert
  const [timeUnit, setTimeUnit] = useState('JAHRE'); // Standardwert

  const isAdmin = session?.user.roles?.includes('Identity'); // Prüft, ob der Benutzer Admin ist

  /**
   * Ruft Benachrichtigungen ab und teilt sie nach `isSingleUser`.
   */
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const functionsInfo = await fetchFunctionsWithNoUsersOrRetiringUsers(
        lookaheadPeriod,
        timeUnit,
      );

      const singleUserNotifications: Notification[] = [];
      const multiUserNotifications: Notification[] = [];

      functionsInfo.forEach((func) => {
        const notification = {
          function: func.function,
          userList: func.userList,
        };

        if (func.function.isSingleUser) {
          singleUserNotifications.push(notification);
        } else {
          multiUserNotifications.push(notification);
        }
      });

      setNotificationsSingleUser(singleUserNotifications);
      setNotificationsMultiUser(multiUserNotifications);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benachrichtigungen:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

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

  /**
   * Effekt zum Laden der Benachrichtigungen.
   */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(
      fetchNotifications,
      NOTIFICATION_UPDATE_INTERVAL,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session?.expires_in) {
      const now = Math.floor(Date.now() / 1000);
      setRemainingTime(session?.expires_in - now);

      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev !== undefined ? prev - 1 : undefined));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Automatische Aktualisierung bei Ablauf
  //   useEffect(() => {
  //     if (remainingTime !== undefined && remainingTime <= 10) {
  //       handleRefreshToken();
  //     }
  //   }, [remainingTime, handleRefreshToken]);

  /**
   * Handhabt das Klicken auf eine Benachrichtigung und navigiert zur entsprechenden Organisationseinheit.
   *
   * @param {Notification} notification - Die ausgewählte Benachrichtigung.
   */
  const handleNotificationClick = async (notification: Notification) => {
    handleCloseNotificationMenu();
    try {
      const ancestors = await fetchAncestors(notification.function.orgUnit);
      const ancestorIds = ancestors.map((ancestor) => ancestor._id);

      // Navigiere zu /organisationseinheiten mit den geöffneten Knoten
      router.push(
        `/organisationseinheiten?openNodes=${encodeURIComponent(
          ancestorIds.join(','),
        )}&selectedNode=${notification.function._id}&parentOrgUnitId=${notification.function.orgUnit}`,
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

  const handleLogout = () => {
    router.push('/startseite');
    signOut();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLookaheadPeriodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLookaheadPeriod(parseInt(event.target.value, 10) || 0);
  };

  const handleTimeUnitChange = (event: SelectChangeEvent) => {
    setTimeUnit(event.target.value);
  };

  const renderNotifications = (notifications: Notification[]) => (
    <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              margin: '1rem',
              marginBottom: '0.75rem',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: 3,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleNotificationClick(notification)}
              sx={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {notification.function.functionName}
              </Typography>
              <Divider sx={{ width: '100%', marginY: 1 }} />
              {notification.userList.length > 0 ? (
                notification.userList.map((user, userIndex) => (
                  <Typography
                    key={userIndex}
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: '0.5rem' }}
                  >
                    Benutzer: <strong>{user.userId}</strong> – verbleibend:{' '}
                    <strong>{user.timeLeft} Tage</strong>
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Kein Benutzer zugewiesen.
                </Typography>
              )}
            </CardActionArea>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          Keine Benachrichtigungen vorhanden.
        </Typography>
      )}
    </Box>
  );

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
                  <Badge
                    badgeContent={
                      notificationsSingleUser.length +
                      notificationsMultiUser.length
                    }
                    color="error"
                    max={99}
                  >
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
            PaperProps={{
              style: {
                maxHeight: '80vh',
                width: '500px',
                padding: '1rem',
                borderRadius: '50px',
              },
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Benachrichtigungen-Tabs"
              >
                <Tab label="Einzelnutzer-Funktionen" />
                <Tab label="Mehrbenutzer-Funktionen" />
              </Tabs>
            </Box>
            <Box sx={{ padding: '1rem' }}>
              <Box sx={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                <TextField
                  label="Lookahead Period"
                  type="number"
                  value={lookaheadPeriod}
                  onChange={handleLookaheadPeriodChange}
                  size="small"
                  fullWidth
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="time-unit-label">Zeiteinheit</InputLabel>
                  <Select
                    labelId="time-unit-label"
                    value={timeUnit}
                    onChange={handleTimeUnitChange}
                  >
                    <MenuItem value="TAGE">Tage</MenuItem>
                    <MenuItem value="MONATE">Monate</MenuItem>
                    <MenuItem value="JAHRE">Jahre</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  onClick={fetchNotifications}
                  disabled={loadingNotifications}
                  fullWidth
                >
                  {loadingNotifications ? 'Lädt...' : 'Anwenden'}
                </Button>
              </Box>
              {activeTab === 0 && renderNotifications(notificationsSingleUser)}
              {activeTab === 1 && renderNotifications(notificationsMultiUser)}
            </Box>
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
                <MenuItem onClick={handleLogout}>
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

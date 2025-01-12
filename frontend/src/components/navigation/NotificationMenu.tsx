'use client';

import { Notifications as NotificationsIcon } from '@mui/icons-material';
import {
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
  Tab,
  Tabs,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchAncestors,
  fetchFunctionsWithNoUsersOrRetiringUsers,
} from '../../lib/api/rolemapper/function.api';
import { FunctionString } from '../../types/function.type';
import { ENV } from '../../utils/env';

/**
 * Konfigurationskonstante für das Intervall zur Aktualisierung von Benachrichtigungen.
 * HIER ÄNDERN SIE DIE ZEIT
 */
const NOTIFICATION_UPDATE_INTERVAL = parseInt(ENV.NOTIFICATION_UPDATE_INTERVAL); //Default 86400000 = 24 Stunden

interface NotificationMenuProps {
  theme: Theme;
  router: AppRouterInstance;
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
 * Komponente für das Benachrichtigungsmenü.
 */
export default function NotificationMenu({
  theme,
  router,
}: NotificationMenuProps) {
  const [notificationAnchor, setNotificationAnchor] = useState<
    undefined | HTMLElement
  >(undefined);
  const [notificationsSingleUser, setNotificationsSingleUser] = useState<
    Notification[]
  >([]);
  const [notificationsMultiUser, setNotificationsMultiUser] = useState<
    Notification[]
  >([]);
  const [lookaheadPeriod, setLookaheadPeriod] = useState(5);
  const [timeUnit, setTimeUnit] = useState('JAHRE');
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationAnchor(undefined);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  /**
   * Ruft Benachrichtigungen ab und teilt sie nach `isSingleUser`.
   */
  const fetchNotifications = useCallback(async () => {
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
    }
  }, [lookaheadPeriod, timeUnit]);

  /**
   * Handhabt das Klicken auf eine Benachrichtigung und navigiert zur entsprechenden Organisationseinheit.
   *
   * @param {Notification} notification - Die ausgewählte Benachrichtigung.
   */
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      handleCloseMenu();
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
    },
    [router],
  );

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
  }, [fetchNotifications]);

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
    <>
      <Tooltip title="Benachrichtigungen">
        <IconButton color="inherit" onClick={handleOpenMenu}>
          <Badge
            badgeContent={
              notificationsSingleUser.length + notificationsMultiUser.length
            }
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            style: {
              width: '500px',
              padding: '1rem',
              maxHeight: '80vh',
            },
          },
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Einzelnutzer" />
          <Tab label="Mehrbenutzer" />
        </Tabs>
        <Box sx={{ padding: '1rem' }}>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
            <TextField
              label="Lookahead Period"
              type="number"
              value={lookaheadPeriod}
              onChange={(e) => setLookaheadPeriod(parseInt(e.target.value, 10))}
              size="small"
              fullWidth
            />
            <FormControl fullWidth size="small">
              <InputLabel>Zeiteinheit</InputLabel>
              <Select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
              >
                <MenuItem value="TAGE">Tage</MenuItem>
                <MenuItem value="MONATE">Monate</MenuItem>
                <MenuItem value="JAHRE">Jahre</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={fetchNotifications} fullWidth>
              Anwenden
            </Button>
          </Box>
          {activeTab === 0 && renderNotifications(notificationsSingleUser)}
          {activeTab === 1 && renderNotifications(notificationsMultiUser)}
        </Box>
      </Menu>
    </>
  );
}

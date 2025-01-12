'use client';

import { Notifications } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchFunctionsWithNoUsersOrRetiringUsers } from '../lib/api/rolemapper/function.api';

/**
 * Benachrichtigungstypen
 */
interface Notification {
  function: {
    functionName: string;
    isSingleUser: boolean;
    orgUnit: string;
  };
  userList: { userId: string; timeLeft: number }[];
}

export default function NotificationsMenu() {
  const [notificationsSingleUser, setNotificationsSingleUser] = useState<
    Notification[]
  >([]);
  const [notificationsMultiUser, setNotificationsMultiUser] = useState<
    Notification[]
  >([]);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [lookaheadPeriod, setLookaheadPeriod] = useState(5);
  const [timeUnit, setTimeUnit] = useState('JAHRE');

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const functionsInfo = await fetchFunctionsWithNoUsersOrRetiringUsers(
        lookaheadPeriod,
        timeUnit,
      );

      const singleUserNotifications = functionsInfo.filter(
        (func) => func.function.isSingleUser,
      );
      const multiUserNotifications = functionsInfo.filter(
        (func) => !func.function.isSingleUser,
      );

      setNotificationsSingleUser(singleUserNotifications);
      setNotificationsMultiUser(multiUserNotifications);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benachrichtigungen:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationAnchor(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderNotifications = (notifications: Notification[]) => (
    <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
      {notifications.map((notification, index) => (
        <Card
          key={index}
          sx={{
            marginBottom: '0.5rem',
            borderRadius: '10px',
            boxShadow: 3,
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {notification.function.functionName}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {notification.userList.length > 0 ? (
                notification.userList.map((user, userIndex) => (
                  <Typography key={userIndex}>
                    Benutzer: {user.userId} – verbleibend: {user.timeLeft} Tage
                  </Typography>
                ))
              ) : (
                <Typography>Kein Benutzer zugewiesen.</Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );

  return (
    <>
      <Tooltip title="Benachrichtigungen">
        <IconButton
          onClick={handleOpenMenu}
          aria-label="notifications"
          color="inherit"
        >
          <Badge
            badgeContent={
              notificationsSingleUser.length + notificationsMultiUser.length
            }
            color="error"
          >
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{ style: { width: '500px', padding: '1rem' } }}
      >
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Einzelnutzer" />
          <Tab label="Mehrbenutzer" />
        </Tabs>
        <Box sx={{ my: 2 }}>
          <TextField
            label="Lookahead Period"
            type="number"
            value={lookaheadPeriod}
            onChange={(e) => setLookaheadPeriod(Number(e.target.value))}
            size="small"
          />
          <FormControl size="small" sx={{ ml: 2 }}>
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
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={fetchNotifications}
            disabled={loadingNotifications}
          >
            Anwenden
          </Button>
        </Box>
        {activeTab === 0
          ? renderNotifications(notificationsSingleUser)
          : renderNotifications(notificationsMultiUser)}
      </Menu>
    </>
  );
}

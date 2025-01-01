'use client';

import { Login, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchAncestors, getFunctionsWithoutUsers } from '../lib/api/function.api';

interface Notification {
  message: string;
    nodeId: string;
    orgUnit: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openNodes, setOpenNodes] = useState<string[]>([]); // Baumstatus


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const functionsWithoutUsers = await getFunctionsWithoutUsers();

        if (functionsWithoutUsers.length > 0) {
          const newNotifications = functionsWithoutUsers.map((func) => ({
            message: `Die Funktion "${func.functionName}" hat keinen zugewiesenen Benutzer.`,
            nodeId: func.id,
            orgUnit: func.orgUnit, // Organisationseinheit
          }));

          // Vermeide doppelte Benachrichtigungen
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((notif) => notif.nodeId));
            const uniqueNotifications = newNotifications.filter(
              (notif) => !existingIds.has(notif.nodeId),
            );
            return [...prev, ...uniqueNotifications];
          });
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Benachrichtigungen:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

    const openNodesInTree = (nodeIds: string[]) => {
      setOpenNodes((prev) => Array.from(new Set([...prev, ...nodeIds])));
    };

     const handleNotificationClick = async (notification: Notification) => {
       handleCloseMenu();
       try {
         console.log('Lade Ancestors für:', notification);
         const ancestors = await fetchAncestors(notification.orgUnit);

         // Öffne die relevanten Knoten im Baum
         openNodesInTree(ancestors.map((ancestor) => ancestor._id));
       } catch (error) {
         console.error('Fehler beim Laden der Ancestors:', error);
       }
     };


  const navLinks = [
    { href: '/startseite', label: 'Startseite' },
    { href: '/organisationseinheiten', label: 'Organisationseinheiten' },
    { href: '/rollen', label: 'Rollen' },
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
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[2],
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
        {/* Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color:
                  pathname === link.href
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                textDecoration: 'none',
                fontWeight: pathname === link.href ? 'bold' : 'normal',
                transition: 'color 0.3s ease-in-out',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = theme.palette.primary.dark)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  pathname === link.href
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary)
              }
            >
              {link.label}
            </Link>
          ))}
        </Box>

        {/* Benachrichtigungen */}
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
                  onClick={async () => {
                    handleCloseMenu();

                    try {
                      console.log('Lade Ancestors für:', notification);
                      const ancestors = await fetchAncestors(
                        notification.orgUnit,
                      );

                      // Beispiel: Ancestors anzeigen
                      console.log('Ancestors:', ancestors);

                      // Hier kannst du den Baum dynamisch öffnen
                      openNodesInTree(ancestors.map((ancestor) => ancestor._id));
                    } catch (error) {
                      console.error('Fehler beim Laden der Ancestors:', error);
                    }
                  }}
                >
                  {notification.message}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleCloseMenu}>Keine Meldungen</MenuItem>
            )}
          </Menu>

          {/* Login */}
          <Tooltip title="Login">
            <Link
              href="/login"
              style={{
                color:
                  pathname === '/login'
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: pathname === '/login' ? 'bold' : 'normal',
                transition: 'color 0.3s ease-in-out',
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

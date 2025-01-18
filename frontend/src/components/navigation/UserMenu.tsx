'use client';

import { Login, Logout, Refresh } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback, useEffect, useState } from 'react';
import { formatTime } from '../../utils/counter-format.util';
import { ENV } from '../../utils/env';

interface UserMenuProps {
  theme: Theme;
  useCustomStyles: boolean;
  session: Session | null;
  pathname: string;
  update: () => Promise<Session | null>;
  router: AppRouterInstance;
}

export default function UserMenu({
  theme,
  useCustomStyles,
  session,
  pathname,
  update,
  router,
}: UserMenuProps) {
  const { DEFAULT_ROUTE } = ENV;
  const [userMenuAnchor, setUserMenuAnchor] = useState<undefined | HTMLElement>(
    undefined,
  );
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined,
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setUserMenuAnchor(undefined);
  };

  const handleLogout = () => {
    signOut({
      redirect: false,
    });
    router.replace(DEFAULT_ROUTE);
  };

  // Manuelle Token-Aktualisierung
  const handleRefreshToken = useCallback(async () => {
    try {
      await update();
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Tokens:', err);
    }
  }, [update]);

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

  return (
    <>
      {session?.user.username ? (
        <>
          <Tooltip title="Profil">
            <IconButton onClick={handleOpenMenu}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{
                  color: useCustomStyles
                    ? theme.palette.custom?.navbar?.secondary || '#fff'
                    : theme.palette.text.primary,
                  fontWeight: 'bold',
                }}
              >
                {session?.user?.name}
              </Typography>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleCloseMenu}
          >
            <MenuItem>
              {remainingTime !== undefined ? (
                <Typography variant="body2">
                  Token läuft ab in: {formatTime(remainingTime)}
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
              Token aktualisieren
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
    </>
  );
}

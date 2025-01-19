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


/**
 * Eigenschaften für die UserMenu-Komponente.
 */
interface UserMenuProps {
  /** Das aktuelle Theme-Objekt zur Anwendung von Stilen. */
  theme: Theme;
  /** Ob benutzerdefinierte Stile verwendet werden sollen. */
  useCustomStyles: boolean;
  /** Die aktuelle Benutzersitzung. */
  session: Session | null;
   /** Der aktuelle Seitenpfad. */
  pathname: string;
  /** Methode zur Aktualisierung der Benutzersitzung (Token-Aktualisierung). */
  update: () => Promise<Session | null>;
  /** Router-Instanz zum Navigieren zwischen Seiten. */
  router: AppRouterInstance;
}

/**
 * Komponente für das Benutzerprofil-Menü.
 *
 * Diese Komponente zeigt entweder das Benutzerprofilmenü an (falls eingeloggt)
 * oder bietet eine Anmeldemöglichkeit (falls nicht eingeloggt). Außerdem
 * ermöglicht sie das Aktualisieren des Tokens und das Ausloggen.
 *
 * @param {UserMenuProps} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die gerenderte Benutzerprofilmenü-Komponente.
 */
export default function UserMenu({
  theme,
  useCustomStyles,
  session,
  pathname,
  update,
  router,
}: UserMenuProps) {
  /** Verankerelement für das Benutzermenü. */
  const [userMenuAnchor, setUserMenuAnchor] = useState<undefined | HTMLElement>(
    undefined,
  );
  /** Verbleibende Zeit bis zum Ablauf des Tokens. */
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined,
  );

  /**
   * Öffnet das Benutzermenü.
   * @param {React.MouseEvent<HTMLElement>} event - Das auslösende Event.
   */
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  /**
   * Schließt das Benutzermenü.
   */
  const handleCloseMenu = () => {
    setUserMenuAnchor(undefined);
  };
  /**
   * Loggt den Benutzer aus und navigiert zur Startseite.
   */
  const handleLogout = () => {
    router.push('/startseite');
    signOut();
  };

  /**
   * Aktualisiert das Token manuell.
   * @async
   */
  const handleRefreshToken = useCallback(async () => {
    try {
      await update();
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Tokens:', err);
    }
  }, [update]);

   /**
   * Effekt zur Berechnung der verbleibenden Tokenzeit und automatischen Aktualisierung.
   */
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

'use client';
/**
 * Startseite: Verwalten und Anzeigen des Sitzungsstatus und der Token-Verfallszeit.
 */

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid2,
  Typography,
} from '@mui/material';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { formatTime } from '../../utils/counter-format.util';

export default function UserProfile() {
  const { data: session, update, status } = useSession();
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined,
  );
  const [refreshRemainingTime, setRefreshRemainingTime] = useState<
    number | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Token aktualisieren
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

  // Weiterleitung zu /login, falls nicht authentifiziert
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Automatischer Countdown
  useEffect(() => {
    if (session?.expires_in) {
      const now = Math.floor(Date.now() / 1000);
      setRemainingTime(session.expires_in - now);

      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev !== undefined ? prev - 1 : undefined));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  // Automatischer Countdown
  useEffect(() => {
    if (session?.refresh_expires_in) {
      const now = Math.floor(Date.now() / 1000);
      setRefreshRemainingTime(session.refresh_expires_in - now);

      const interval = setInterval(() => {
        setRefreshRemainingTime((prev) =>
          prev !== undefined ? prev - 1 : undefined,
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Du bist nicht eingeloggt.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Avatar und Begrüßung */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: '0 auto',
            fontSize: 36,
            bgcolor: '#1976d2',
          }}
        >
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
          Willkommen, {session.user?.name || session.user?.username}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {session.user?.email || 'Keine E-Mail-Adresse vorhanden'}
        </Typography>
      </Box>

      <Grid2 container spacing={4}>
        {/* Benutzerinformationen */}
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Card elevation={3}>
            <CardHeader
              title="Benutzerinformationen"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography sx={{ mb: 1 }}>
                <strong>Benutzername:</strong> {session.user?.username || 'N/A'}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>E-Mail:</strong> {session.user?.email || 'N/A'}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Rollen:</strong>{' '}
                {session.user?.roles?.join(', ') || 'Keine Rollen'}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Token-Informationen */}
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Card elevation={3}>
            <CardHeader
              title="Token-Details"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography sx={{ mb: 1 }}>
                <strong>Token Ablauf in:</strong>{' '}
                {remainingTime !== undefined
                  ? `${formatTime(remainingTime)}`
                  : '...'}
              </Typography>
              <Typography>
                <strong>Refresh Ablauf in:</strong>{' '}
                {refreshRemainingTime !== undefined
                  ? `${formatTime(refreshRemainingTime)}`
                  : '...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Aktionen */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefreshToken}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            'Token aktualisieren'
          )}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Ausloggen
        </Button>
      </Box>
    </Container>
  );
}

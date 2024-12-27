'use client';

import { Button, Container, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function Startseite() {
  const { data: session, update, status } = useSession();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Manuelle Token-Aktualisierung
  const handleRefreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await update();
      setError(null);
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

  // Automatische Aktualisierung bei Ablauf
  useEffect(() => {
    if (remainingTime !== null && remainingTime <= 10) {
      handleRefreshToken();
    }
  }, [remainingTime, handleRefreshToken]);

  // Automatischer Counter
  useEffect(() => {
    if (session?.expires_in) {
      const now = Math.floor(Date.now() / 1000);
      setRemainingTime(session.expires_in - now);

      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

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
      {session ? (
        <>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            Willkommen, {session.user?.name || session.user?.username}!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Dein Token läuft in{' '}
            {remainingTime !== null ? `${remainingTime} Sekunden` : '...'} ab.
          </Typography>
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
            sx={{ mb: 2 }}
          >
            {loading ? 'Aktualisiere...' : 'Token aktualisieren'}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => signOut({ callbackUrl: '/startseite' })}
          >
            Ausloggen
          </Button>
        </>
      ) : (
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Du bist nicht eingeloggt.
        </Typography>
      )}
    </Container>
  );
}
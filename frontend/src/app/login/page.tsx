'use client';

import { Key, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Komponente für die Anmeldeseite.
 * 
 * Diese Seite ermöglicht die Anmeldung mit Benutzerdaten oder Keycloak.
 *
 * @returns {JSX.Element} Die gerenderte Anmeldeseite.
 */
export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingKeycloak, setLoadingKeycloak] = useState(false);
  const router = useRouter();

  /**
   * @async
   * @function handleLogin
   * Handler für die Anmeldung mit Benutzerdaten.
   *
   * @param {React.FormEvent} - Das `React.FormEvent`, welches beim Absenden des Formulars ausgelöst wird.
   * @returns {Promise<void>} 
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/startseite');
    } else {
      setError('Ungültige Anmeldedaten. Bitte versuche es erneut.');
    }
  };

   /**
   * @async
   * @function handleKeycloakLogin
   * Handler für die Anmeldung über Keycloak.
   *
   * @returns {Promise<void>}
   */
  const handleKeycloakLogin = async () => {
    setLoadingKeycloak(true);
    try {
      await signIn('keycloak', { callbackUrl: '/startseite' });
    } catch (error) {
      setError('Keycloak-Anmeldung fehlgeschlagen.');
      console.log(error);
    } finally {
      setLoadingKeycloak(false);
    }
  };

  /**
   * Wechselt die Passwortsichtbarkeit.
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold">
          Anmeldung
        </Typography>
        <form onSubmit={handleLogin} style={{ marginTop: '1rem' }}>
          <TextField
            label="Benutzername"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Passwort"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Anmelden'
            )}
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>Oder melde dich an mit</Divider>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Key />}
            fullWidth
            onClick={handleKeycloakLogin}
            disabled={loadingKeycloak}
          >
            {loadingKeycloak ? (
              <CircularProgress size={24} sx={{ color: 'error' }} />
            ) : (
              'Keycloak'
            )}
          </Button>
        </Box>
      </Box>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mt: 4 }}
      >
        © {new Date().getFullYear()} FlowCraft. Alle Rechte vorbehalten.
      </Typography>
    </Container>
  );
}

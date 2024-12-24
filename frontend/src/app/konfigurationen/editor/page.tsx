'use client';

import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const defaultEnvVars = {
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED || '',
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '',
  NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || '',
  NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || '',
  NEXT_PUBLIC_BACKEND_SERVER_URL:
    process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
  NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || '',
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || '',
  NEXT_PUBLIC_PINO_PRETTY: process.env.NEXT_PUBLIC_PINO_PRETTY || '',
  NEXT_PUBLIC_LOG_DIR: process.env.NEXT_PUBLIC_LOG_DIR || '',
};

export default function EnvEditorPage() {
  const [envVars, setEnvVars] = useState(defaultEnvVars);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/update-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envVars),
      });

      if (response.ok) {
        setMessage('Umgebungsvariablen erfolgreich gespeichert.');
        setError(null);
      } else {
        const result = await response.json();
        setMessage(null);
        setError(result.message || 'Fehler beim Speichern.');
      }
    } catch (err) {
      setMessage(null);
      setError('Netzwerkfehler: ' + err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Umgebungsvariablen bearbeiten
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {Object.entries(envVars).map(([key, value]) => (
        <Box key={key} mb={2}>
          <TextField
            label={key}
            fullWidth
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSave}>
        Speichern
      </Button>
    </Box>
  );
}

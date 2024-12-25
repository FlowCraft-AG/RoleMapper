import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { ENV } from '../../utils/env';
import { getLogger } from '../../utils/logger';

export interface ConfigData {
  key: string;
  value: string | null;
}

const ConfigPage = () => {
  const logger = getLogger('ConfigPage');

  // Hier die verfügbaren .env Variablen filtern
  const configData: ConfigData[] = [
    {
      key: 'NODE_TLS_REJECT_UNAUTHORIZED',
      value: ENV.NODE_TLS_REJECT_UNAUTHORIZED || null,
    },
    {
      key: 'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
      value: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || null,
    },
    {
      key: 'NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET',
      value: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || null,
    },
    {
      key: 'NEXT_PUBLIC_KEYCLOAK_ISSUER',
      value: ENV.NEXT_PUBLIC_KEYCLOAK_ISSUER || null,
    },
    {
      key: 'NEXT_PUBLIC_BACKEND_SERVER_URL',
      value: ENV.NEXT_PUBLIC_BACKEND_SERVER_URL || null,
    },
    {
      key: 'NEXTAUTH_URL',
      value: ENV.NEXTAUTH_URL || null,
    },
    {
      key: 'NEXT_PUBLIC_LOG_LEVEL',
      value: ENV.NEXT_PUBLIC_LOG_LEVEL || null,
    },
    {
      key: 'NEXT_PUBLIC_NODE_ENV',
      value: ENV.NEXT_PUBLIC_NODE_ENV || null,
    },
    {
      key: 'NEXT_PUBLIC_PINO_PRETTY',
      value: ENV.NEXT_PUBLIC_PINO_PRETTY || null,
    },
    {
      key: 'NEXT_PUBLIC_LOG_DIR',
      value: ENV.NEXT_PUBLIC_LOG_DIR || null,
    },
  ];

  configData.map((config) => logger.info('%s=%s', config.key, config.value));

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Konfigurationsübersicht
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Die folgende Tabelle zeigt alle wichtigen Umgebungsvariablen und deren
          Werte an.
        </Typography>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Variable</strong>
                </TableCell>
                <TableCell>
                  <strong>Wert</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configData.map((config) => (
                <TableRow key={config.key}>
                  <TableCell>{config.key}</TableCell>
                  <TableCell>{config.value || 'Nicht gesetzt'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Box textAlign="center">
          <Link color="primary" href="/konfigurationen/editor">
            Konfiguration bearbeiten
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ConfigPage;

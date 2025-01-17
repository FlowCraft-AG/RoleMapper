/**
 * @file ProcessInstances.tsx
 * @description React-Komponente zur Anzeige von Prozessinstanzen aus Camunda.
 */

'use client';

import {
  Cancel as CancelIcon,
  CheckCircle,
  Error as ErrorIcon,
  Info as InfoIcon,
  PlayCircle,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProcessInstancesByUser } from '../../lib/api/camunda.api';
import { ProcessInstance } from '../../types/process.type';
import { useRouter } from 'next/navigation';
import { ENV } from '../../utils/env';

/**
 * `ProcessInstances`-Komponente
 *
 * Diese Komponente zeigt user spezifische Prozessinstanzen aus dem Camunda-System an. Sie bietet Filtermöglichkeiten nach Status und Prozessnamen.
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Prozessinstanzliste.
 *
 * @example
 * ```tsx
 * <ProcessInstances />
 * ```
 */
export default function UserProcessInstancesPage() {
  // Zustand für Prozessinstanzen
  const [instances, setInstances] = useState<ProcessInstance[]>([]);
  // Zustand für den Filter nach Prozessnamen
  const [filter, setFilter] = useState<string>(''); // Prozessname oder leer
  // Zustand für den Statusfilter
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // Status: ACTIVE, COMPLETED, ALL
  // Zustand für alle verfügbaren Prozesse
  const [allProcesses, setAllProcesses] = useState<string[]>([]); // Alle Prozessnamen

  const { data: session } = useSession();
  const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { DEFAULT_ROUTE } = ENV;

  useEffect(() => {
    /**
     * Lädt die Prozessinstanzen eines Users und filtert diese basierend auf den gesetzten Filtern.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      setLoading(true);
      setError(undefined); // Fehler zurücksetzen

      try {
        if (
          session === undefined ||
          session?.access_token === undefined ||
          session?.user === undefined ||
          session?.user.username === undefined
        ) {
            router.push(DEFAULT_ROUTE);
          throw new Error('Keine Session vorhanden.');
        }
        console.log('UserProcessInstancesPage: token=', session.access_token);
        const instanzen = await getProcessInstancesByUser(
          session.user.username,
          session.access_token,
        );

        // Sammle alle Prozessnamen (bpmnProcessId)
        const processNames: string[] = Array.from(
          new Set(
            instanzen.map(
              (instance: ProcessInstance) => instance.bpmnProcessId,
            ),
          ),
        );

        setAllProcesses(processNames);

        const filteredInstances = instanzen.filter(
          (instance: ProcessInstance) => {
            const matchesStatus =
              statusFilter === 'ALL' ||
              (statusFilter === 'ACTIVE' && instance.state === 'ACTIVE') ||
              (statusFilter === 'COMPLETED' &&
                instance.state === 'COMPLETED') ||
              (statusFilter === 'CANCELED' && instance.state === 'CANCELED') ||
              (statusFilter === 'FAILED' && instance.incident === true);
            const matchesProcessName =
              !filter ||
              instance.bpmnProcessId
                .toLowerCase()
                .includes(filter.toLowerCase());
            return matchesStatus && matchesProcessName;
          },
        );

        setInstances(filteredInstances);
      } catch (error) {
        setError(
          (error as Error).message || 'Ein unbekannter Fehler ist aufgetreten.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, filter, statusFilter]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Prozessinstanzen
      </Typography>

      {/* Fehleranzeige */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {/* Ladespinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Restliche Komponenten wie Filter und Grid2 */}
      {!loading && !error && (
        <>
          {/* Filter für Status */}
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">Alle Prozesse</MenuItem>
              <MenuItem value="ACTIVE">Aktive Prozesse</MenuItem>
              <MenuItem value="COMPLETED">Abgeschlossene Prozesse</MenuItem>
              <MenuItem value="CANCELED">Abgebrochene Prozesse</MenuItem>
              <MenuItem value="FAILED">Fehlgeschlagene Prozesse</MenuItem>
            </Select>
          </FormControl>

          {/* Autocomplete mit freier Eingabe */}
          <Autocomplete
            // freeSolo
            options={allProcesses}
            onInputChange={(event, newInputValue) => {
              setFilter(newInputValue); // Filter für Prozessname aktualisieren
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Prozesse filtern"
                variant="outlined"
              />
            )}
            sx={{ marginBottom: 3 }}
          />

          {/* Instanzen anzeigen */}
          <Grid2 container spacing={3}>
            {instances.map((instance: ProcessInstance) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={instance.key}>
                <Card variant="outlined">
                  {instance.state === 'COMPLETED' && (
                    <CheckCircle
                      sx={{
                        position: 'absolute',
                        color: 'green',
                      }}
                    />
                  )}
                  {instance.incident && (
                    <ErrorIcon
                      sx={{
                        position: 'absolute',
                        color: 'red',
                      }}
                    />
                  )}
                  {instance.state === 'ACTIVE' && !instance.incident && (
                    <PlayCircle
                      sx={{
                        position: 'absolute',
                        color: 'blue',
                      }}
                    />
                  )}
                  {instance.state === 'CANCELED' && (
                    <CancelIcon
                      sx={{
                        position: 'absolute',
                        color: 'orange', // Farbe für abgebrochene Prozesse
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      Prozess-ID: {instance.bpmnProcessId}
                    </Typography>
                    <Typography color="textSecondary">
                      Instanz-Key: {instance.key}
                    </Typography>
                    <Typography color="textSecondary">
                      processDefinitionKey: {instance.processDefinitionKey}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="BPMN ansehen">
                      <Link href={`/camunda/${instance.key}`} passHref>
                        <IconButton color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Details ansehen">
                      <Link href={`/myProcess/${instance.key}`} passHref>
                        <IconButton color="info">
                          <InfoIcon />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </>
      )}
    </Box>
  );
}

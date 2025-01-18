/**
 * @file ProcessInstances.tsx
 * @description React-Komponente zur Anzeige von Prozessinstanzen aus Camunda.
 *
 * @module ProcessInstances
 */

'use client';

import {
  Cancel as CancelIcon,
  CheckCircle,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  PlayCircle,
  Stop as StopIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  cancelProcessInstance,
  deleteProcessInstance,
  getAllProcessInstances,
} from '../../lib/api/camunda.api';
import { ProcessInstance } from '../../types/process.type';
import { ENV } from '../../utils/env';

const { ADMIN_GROUP } = ENV;
/**
 * `ProcessInstances`-Komponente
 *
 * Diese Komponente zeigt Prozessinstanzen aus dem Camunda-System an. Sie bietet Filtermöglichkeiten nach Status und Prozessnamen.
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Prozessinstanzliste.
 *
 * @example
 * ```tsx
 * <ProcessInstances />
 * ```
 */
export default function ProcessInstancesPage() {
  // Zustand für Prozessinstanzen
  const [instanceList, setInstanceList] = useState<ProcessInstance[]>([]);
  // Zustand für den Filter nach Prozessnamen
  const [filter, setFilter] = useState<string>(''); // Prozessname oder leer
  // Zustand für den Statusfilter
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // Status: ACTIVE, COMPLETED, ALL
  // Zustand für alle verfügbaren Prozesse
  const [allProcesses, setAllProcesses] = useState<string[]>([]); // Alle Prozessnamen

  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isAdmin = session?.user.roles?.includes(ADMIN_GROUP); // Prüft, ob der Benutzer Admin ist
  const router = useRouter();
    const { DEFAULT_ROUTE } = ENV;
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
     const [selectedInstance, setSelectedInstance] =
       useState<ProcessInstance | null>(null);

  const handleCancelProcess = async (instanceKey: string) => {
    try {
      if (!session?.access_token || !isAdmin)
        throw new Error('Keine Berechtigung.');
      await cancelProcessInstance(instanceKey, session.access_token);
      console.log('Prozess abgebrochen:', instanceKey);

      // Status der Instanz in der Liste aktualisieren
      setInstanceList((prevInstances) =>
        prevInstances.map((instance) =>
          instance.key === instanceKey
            ? { ...instance, state: 'CANCELED' } // Status auf "CANCELED" setzen
            : instance,
        ),
      );
    } catch (error) {
      setError((error as Error).message || 'Abbrechen fehlgeschlagen.');
      setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
    }
  };

    const handleDeleteProcess = async () => {
       if (!selectedInstance) return;
    try {
        if (!session?.access_token || !isAdmin) {
          setError('Keine Berechtigung.');
          setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
        }
         if (selectedInstance.state !== 'CANCELED') {
           setError('Nur abgebrochene Prozesse können gelöscht werden.');
           setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
           return;
         }
      await deleteProcessInstance(selectedInstance.key, session?.access_token);
      setInstanceList((prev) =>
        prev.filter((instance) => instance.key !== selectedInstance.key),
      );
         setDeleteDialogOpen(false);
      console.log('Prozess gelöscht:', selectedInstance.key);
    } catch (error) {
      setError((error as Error).message || 'Löschen fehlgeschlagen.');
      setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
    }
    };

      const openDeleteDialog = (instance: ProcessInstance) => {
        if (instance.state !== 'CANCELED') {
            setError('Nur abgebrochene Prozesse können gelöscht werden.');
            setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
            return;
        }
        setSelectedInstance(instance);
        setDeleteDialogOpen(true);
      };
     const closeDeleteDialog = () => {
       setSelectedInstance(null);
       setDeleteDialogOpen(false);
     };

  useEffect(() => {
    /**
     * Lädt die Prozessinstanzen und filtert diese basierend auf den gesetzten Filtern.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Fehler zurücksetzen

      try {
        if (session === undefined || session?.access_token === undefined) {
          router.push(DEFAULT_ROUTE);
          throw new Error('Keine Session vorhanden.');
        }
        const instanzen = await getAllProcessInstances(session.access_token);

        // Sammle alle Prozessnamen (bpmnProcessId)
        const processNames: string[] = Array.from(
          new Set(
            instanzen.map(
              (instance: ProcessInstance) => instance.name,
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
              (statusFilter === 'CANCELED' && instance.state === 'CANCELED');
            const matchesProcessName =
              !filter ||
              instance.bpmnProcessId
                .toLowerCase()
                .includes(filter.toLowerCase());
            return matchesStatus && matchesProcessName;
          },
        );

        setInstanceList(filteredInstances);
      } catch (error) {
        setError(
          (error as Error).message || 'Ein unbekannter Fehler ist aufgetreten.',
        );
        setTimeout(() => setError(null), 5000); // Fehlernachricht nach 5 Sekunden ausblenden
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, filter, statusFilter, router, DEFAULT_ROUTE]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Aktive Prozessinstanzen
      </Typography>

      {/* Fehleranzeige */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={5000} // Automatisch nach 5 Sekunden schließen
          onClose={() => setError(null)} // Fehler zurücksetzen
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Ladespinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Restliche Komponenten wie Filter und Grid2 */}
      {!loading  && (
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
            {instanceList.map((instance: ProcessInstance) => (
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
                      {instance.name}
                    </Typography>
                    <Typography color="textSecondary">
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
                    <Tooltip title="Details ansehen">
                      <Link href={`/camunda/${instance.key}`} passHref>
                        <IconButton color="info">
                          <InfoIcon />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <>
                      {instance.state === 'ACTIVE' && (
                        <Tooltip title="Prozess abbrechen">
                          <IconButton
                            onClick={() => handleCancelProcess(instance.key)}
                            color="warning"
                          >
                            <StopIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                    <Tooltip title="Prozess Löschen">
                      <IconButton
                        onClick={() => openDeleteDialog(instance)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogTitle>Prozess löschen</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Möchten Sie die Prozessinstanz wirklich löschen? Diese Aktion
                kann nicht rückgängig gemacht werden.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteDialog} color="secondary">
                Abbrechen
              </Button>
              <Button
                onClick={handleDeleteProcess}
                color="error"
                variant="contained"
              >
                Löschen
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

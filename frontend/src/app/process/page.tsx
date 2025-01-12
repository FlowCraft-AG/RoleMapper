/**
 * @file ProcessInstances.tsx
 * React-Komponente zur Anzeige von Prozessinstanzen aus Camunda.
 *
 * @module ProcessInstances
 */

'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProcessInstances } from '../../lib/camunda/camunda.api';
import { ProcessInstance } from '../../types/process.type';

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
export default function ProcessInstances() {
  // Zustand für Prozessinstanzen
  const [instances, setInstances] = useState<ProcessInstance[]>([]);
  // Zustand für den Filter nach Prozessnamen
  const [filter, setFilter] = useState<string>(''); // Prozessname oder leer
  // Zustand für den Statusfilter
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // Status: ACTIVE, COMPLETED, ALL
  // Zustand für alle verfügbaren Prozesse
  const [allProcesses, setAllProcesses] = useState<string[]>([]); // Alle Prozessnamen

  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        console.log('ProcessInstances: token=', session);
        const instanzen = await fetchProcessInstances(session?.access_token);

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
              (statusFilter === 'CANCELED' && instance.state === 'CANCELED');
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

      {/* Restliche Komponenten wie Filter und Grid */}
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
          <Grid container spacing={3}>
            {instances.map((instance: ProcessInstance) => (
              <Grid item xs={12} sm={6} md={4} key={instance.key}>
                <Card variant="outlined">
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
                    <Link href={`/camunda/${instance.key}`} passHref>
                      <Button variant="contained" color="primary" size="small">
                        BPMN ansehen
                      </Button>
                    </Link>
                  </CardActions>
                  <CardActions>
                    <Link href={`/process/${instance.key}`} passHref>
                      <Button variant="contained" color="primary" size="small">
                        Details ansehen
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

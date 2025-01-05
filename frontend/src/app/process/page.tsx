'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAllProcessInstances } from '../../lib/camunda/camunda.api';
import { ProcessDetails } from '../../types/process.type';

export default function ProcessInstances() {
  const [instances, setInstances] = useState<ProcessDetails[]>([]);
  const [filter, setFilter] = useState<string>(''); // Prozessname oder leer
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // Status: ACTIVE, COMPLETED, ALL
  const [allProcesses, setAllProcesses] = useState<string[]>([]); // Alle Prozessnamen

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllProcessInstances();

      // Sammle alle Prozessnamen (bpmnProcessId)
      const processNames: string[] = Array.from(
        new Set(
          data.items.map((instance: ProcessDetails) => instance.bpmnProcessId),
        ),
      );

      setAllProcesses(processNames);

      const filteredInstances = data.items.filter(
        (instance: ProcessDetails) => {
          const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && instance.state === 'ACTIVE') ||
            (statusFilter === 'COMPLETED' && instance.state === 'COMPLETED');
          const matchesProcessName =
            !filter ||
            instance.bpmnProcessId.toLowerCase().includes(filter.toLowerCase());
          return matchesStatus && matchesProcessName;
        },
      );

      setInstances(filteredInstances);
    };

    fetchData();
  }, [filter, statusFilter]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Prozessinstanzen
      </Typography>

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
        </Select>
      </FormControl>

      {/* Autocomplete mit freier Eingabe */}
      <Autocomplete
        freeSolo
        options={allProcesses}
        onInputChange={(event, newInputValue) => {
          setFilter(newInputValue); // Filter für Prozessname aktualisieren
        }}
        renderInput={(params) => (
          <TextField {...params} label="Prozesse filtern" variant="outlined" />
        )}
        sx={{ marginBottom: 3 }}
      />

      {/* Instanzen anzeigen */}
      <Grid container spacing={3}>
        {instances.map((instance: ProcessDetails) => (
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
    </Box>
  );
}

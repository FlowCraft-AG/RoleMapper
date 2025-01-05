'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  fetchAllTasksByProcessInstance,
  fetchProcessInstanceDetails,
  fetchVariablesByProcessInstance,
} from '../../../lib/camunda/camunda.api';
import {
  ProcessDetails,
  ProcessTask,
  ProcessVariable,
} from '../../../types/process.type';
import GeneralInfoCard from './GeneralInfoCard';
import TasksGrid from './TasksGrid';
import VariablesTable from './VariablesTable';

export default function ProcessInstanceDetailsContent({
  processKey,
}: {
  processKey: string;
}) {
  const router = useRouter(); // Initialisiere den Router-Hook
  const [details, setDetails] = useState<ProcessDetails | null>(null);
  const [variables, setVariables] = useState<ProcessVariable[]>([]);
  const [tasks, setTasks] = useState<ProcessTask[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null); // Fehlerzustand zurücksetzen

        const details = await fetchProcessInstanceDetails(processKey);
        const variablesResponse =
          await fetchVariablesByProcessInstance(processKey);
        const tasks = await fetchAllTasksByProcessInstance(processKey);

        setDetails(details);
        setVariables(variablesResponse.items);
        setTasks(tasks);
      } catch (error) {
        setError('Fehler beim Laden der Prozessdaten.');
        console.error('Fehler beim Laden der Daten:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [processKey]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!details) {
    return (
      <Typography variant="h6" color="textSecondary">
        Keine Details verfügbar.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Zurück-Button */}
      <Box mb={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push('/process')} // Navigiert zur `/process`-Seite
        >
          Zurück zur Prozessliste
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Prozessinstanz-Details
      </Typography>

      <GeneralInfoCard details={details} />

      <Tabs
        value={tabIndex}
        onChange={(event, newIndex) => setTabIndex(newIndex)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Variablen" />
        <Tab label="Tasks" />
      </Tabs>

      {tabIndex === 0 && <VariablesTable variables={variables} />}
      {tabIndex === 1 && <TasksGrid tasks={tasks} />}
    </Box>
  );
}

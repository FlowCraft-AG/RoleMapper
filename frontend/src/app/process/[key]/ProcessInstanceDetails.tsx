/**
 * @file ProcessInstanceDetailsContent.tsx
 * @description Komponente zur Anzeige der Details einer Prozessinstanz, einschließlich Variablen und Tasks.
 *
 * Diese Komponente bietet Tabs, um Variablen und Aufgaben (Tasks) einer Prozessinstanz übersichtlich darzustellen.
 *
 * @module ProcessInstanceDetailsContent
 */
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
  ProcessInstance,
  ProcessTask,
  ProcessVariable,
} from '../../../types/process.type';
import GeneralInfoCard from './GeneralInfoCard';
import TasksGrid from './TasksGrid';
import VariablesTable from './VariablesTable';

/**
/**
 * Props für die `ProcessInstanceDetailsContent`-Komponente.
 */
interface ProcessInstanceDetailsContentProps {
  processKey: string;
}

/**
 * `ProcessInstanceDetailsContent`-Komponente
 *
 * Diese Komponente zeigt die Details einer Prozessinstanz an, darunter:
 * - Allgemeine Informationen (GeneralInfoCard)
 * - Prozessvariablen (VariablesTable)
 * - Aufgaben (TasksGrid)
 *
 * @component
 * @param {ProcessInstanceDetailsContentProps} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Prozessinstanzdetails.
 *
 * @example
 * ```tsx
 * <ProcessInstanceDetailsContent processKey="12345" />
 * ```
 */
export default function ProcessInstanceDetailsContent({
  processKey,
}: ProcessInstanceDetailsContentProps) {
  const router = useRouter(); // Initialisiere den Router-Hook
  const [details, setDetails] = useState<ProcessInstance | null>(null);
  const [variables, setVariables] = useState<ProcessVariable[]>([]);
  const [tasks, setTasks] = useState<ProcessTask[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Lädt die Details der Prozessinstanz, die Variablen und die Tasks.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    async function fetchData() {
      try {
        setLoading(true);
        setError(null); // Fehlerzustand zurücksetzen

        const details = await fetchProcessInstanceDetails(processKey);
        const variablesResponse =
          await fetchVariablesByProcessInstance(processKey);
        const tasks = await fetchAllTasksByProcessInstance(processKey);

        setDetails(details);
        setVariables(variablesResponse);
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

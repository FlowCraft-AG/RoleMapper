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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GeneralInfoCard from '../../../components/camunda/GeneralInfoCard';
import ProcessDefinitionToggleViewer from '../../../components/camunda/ProcessDefinitionToggleViewer';
import TasksGrid from '../../../components/camunda/TasksGrid';
import VariablesTable from '../../../components/camunda/VariablesTable';
import {
  getProcessInstanceDetails,
  getProcessInstanceVariables,
  getTasksByProcessInstance,
} from '../../../lib/api/camunda.api';
import {
  ProcessInstance,
  ProcessTask,
  ProcessVariable,
} from '../../../types/process.type';
import { ENV } from '../../../utils/env';

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
  const { data: session } = useSession();
  const { ADMIN_GROUP } = ENV;
  const isAdmin = session?.user.roles?.includes(ADMIN_GROUP); // Prüft, ob der Benutzer Admin ist

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
        if (session === undefined || session?.access_token === undefined) {
          throw new Error('Keine Session vorhanden.');
        }
        setError(null); // Fehlerzustand zurücksetzen

        const token = session.access_token;
        const details = await getProcessInstanceDetails(processKey, token);
        const variablesResponse = await getProcessInstanceVariables(
          processKey,
          token,
        );
        const tasks = await getTasksByProcessInstance(processKey, token);

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
  }, [session, processKey]);

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
        {isAdmin ? (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push('/camunda')} // Navigiert zur `/process`-Seite
          >
            Zurück zur Prozessliste
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push('/camunda/myProcess')} // Navigiert zur `/myProcess`-Seite
          >
            Zurück zur Prozessliste
          </Button>
        )}
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
        <Tab label="BPMN" />
      </Tabs>

      {tabIndex === 0 && <VariablesTable variables={variables} />}
      {tabIndex === 1 && <TasksGrid tasks={tasks} />}
      {tabIndex === 2 && (
        <ProcessDefinitionToggleViewer processInstanceKey={processKey} />
      )}
    </Box>
  );
}

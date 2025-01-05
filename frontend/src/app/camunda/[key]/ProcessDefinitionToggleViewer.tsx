/**
 * @file ProcessDefinitionToggleViewer.tsx
 * @description React-Komponente zur Anzeige einer Prozessdefinition entweder als BPMN-Diagramm oder als XML-Ansicht.
 *
 * @module ProcessDefinitionToggleViewer
 */

'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BpmnViewer from '../../../components/bpmn/BpmnViewer';
import ProcessDefinitionXmlViewer from '../../../components/bpmn/ProcessDefinitionXmlViewer';
import {
  fetchActiveElementId,
  fetchProcessDefinitionXml,
  fetchProcessInstanceDetails,
} from '../../../lib/camunda/camunda.api';
import { ProcessInstance } from '../../../types/process.type';

/**
 * Props für die `ProcessDefinitionToggleViewer`-Komponente.
 *
 * @interface ProcessDefinitionToggleViewerProps
 * @property {string} processInstanceKey - Der Schlüssel der Prozessinstanz, dessen Definition angezeigt werden soll.
 */
interface ProcessDefinitionToggleViewerProps {
  processInstanceKey: string;
}

/**
 * `ProcessDefinitionToggleViewer`-Komponente
 *
 * Diese Komponente bietet die Möglichkeit, zwischen der XML-Ansicht und der BPMN-Diagramm-Ansicht
 * einer Prozessdefinition umzuschalten. Die aktive Prozessinstanz und das zugehörige Diagramm
 * werden anhand des `processInstanceKey` geladen.
 *
 * @component
 * @param {ProcessDefinitionToggleViewerProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Ansicht.
 *
 * @example
 * ```tsx
 * <ProcessDefinitionToggleViewer processInstanceKey="my-instance-key" />
 * ```
 */
const ProcessDefinitionToggleViewer = ({
  processInstanceKey,
}: ProcessDefinitionToggleViewerProps) => {
  const router = useRouter(); // Router-Hook für Navigation
  const [isXmlView, setIsXmlView] = useState(false);
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [instanz, setInstanz] = useState<ProcessInstance | null>(null);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);

  /**
   * Lädt die Prozessinstanz-Details, die XML-Definition und die aktive Element-ID.
   */
  useEffect(() => {
    const loadDiagramUrl = async () => {
      try {
        const instanz = await fetchProcessInstanceDetails(processInstanceKey);
        setInstanz(instanz);
        console.log('Instanz:', instanz);
        const url = await fetchProcessDefinitionXml(
          instanz.processDefinitionKey,
        );
        //const url = `/${processDefinitionKey}.bpmn`;
        setDiagramUrl(url);

        // Aktive Element-ID abrufen
        const activeId = await fetchActiveElementId(processInstanceKey);
        console.log('Active Element ID:', activeId);
        setActiveElementId(activeId);
      } catch (error) {
        console.error('Fehler beim Laden der Diagramm-URL:', error);
      }
    };

    loadDiagramUrl();
  }, [processInstanceKey]);

  if (diagramUrl === null) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Lade Prozessdefinition...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mb={3}>
        {/* Zurück-Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push('/process')}
        >
          Zurück zur Prozessliste
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Prozessdefinition: {isXmlView ? 'XML-Ansicht' : 'Diagramm-Ansicht'}
      </Typography>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsXmlView(!isXmlView)}
        >
          {isXmlView ? 'Diagramm-Ansicht anzeigen' : 'XML-Ansicht anzeigen'}
        </Button>
      </Box>

      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          height: '500px',
        }}
      >
        {isXmlView ? (
          <ProcessDefinitionXmlViewer
            processDefinitionKey={instanz?.processDefinitionKey}
          />
        ) : (
          <div style={{ padding: '20px' }}>
            <h1>BPMN Diagram Sicht</h1>
            <BpmnViewer
              diagramXML={diagramUrl}
              activeElementId={activeElementId ?? ''}
              onLoading={() => console.log('Lädt das BPMN-Diagramm...')}
              onError={(err) => console.error('Fehler beim Rendern:', err)}
              onShown={() => console.log('Diagramm erfolgreich geladen!')}
            />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ProcessDefinitionToggleViewer;

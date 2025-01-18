/**
 * @file ProcessDefinitionXmlViewer.tsx
 * @description React-Komponente zur Anzeige des XML-Inhalts einer Prozessdefinition basierend auf einem gegebenen Prozessschlüssel.
 *
 * @module ProcessDefinitionXmlViewer
 */

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getProcessDefinitionXml } from '../../lib/api/camunda.api';

/**
 * Props für die `ProcessDefinitionXmlViewer`-Komponente.
 *
 * @interface ProcessDefinitionXmlViewerProps
 * @property {string | undefined} processDefinitionKey - Der Schlüssel der Prozessdefinition, für die das XML abgerufen wird.
 */
interface ProcessDefinitionXmlViewerProps {
  processDefinitionKey: string | undefined;
}

/**
 * `ProcessDefinitionXmlViewer`-Komponente
 *
 * Diese Komponente lädt und zeigt den XML-Inhalt einer Prozessdefinition basierend auf dem angegebenen Prozessschlüssel an.
 *
 * @component
 * @param {ProcessDefinitionXmlViewerProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Prozessdefinitionsansicht.
 *
 * @example
 * ```tsx
 * <ProcessDefinitionXmlViewer processDefinitionKey="my-process-key" />
 * ```
 */
const ProcessDefinitionXmlViewer: React.FC<ProcessDefinitionXmlViewerProps> = ({
  processDefinitionKey,
}) => {
  const [xml, setXml] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const { data: session } = useSession();

  /**
   * Effekt, der das XML der Prozessdefinition lädt.
   *
   * @function loadXml
   */
  useEffect(() => {
    async function loadXml() {
      try {
        if (session === undefined || session?.access_token === undefined) {
          throw new Error('Keine Session vorhanden.');
        }
        if (!processDefinitionKey) {
          console.error('Kein Prozessschlüssel angegeben');
          return;
        }
        const token = session.access_token;
        const data = await getProcessDefinitionXml(processDefinitionKey, token);
        // const response = await fetch(processDefinitionKey);
        // const xml = await response.text();
        setXml(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    loadXml();
  }, [session, processDefinitionKey]);

  // Fehleranzeige
  if (error) return <div>Error: {error}</div>;

  // Ladeanzeige
  if (!xml) return <div>Loading...</div>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{xml}</pre>
  );
};

export default ProcessDefinitionXmlViewer;

'use client';

import { useEffect, useState } from 'react';
import { fetchProcessDefinitionXml } from '../../lib/operate';

const ProcessDefinitionXmlViewer = ({
  processDefinitionKey,
}: {
  processDefinitionKey: string | undefined;
}) => {
  const [xml, setXml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadXml() {
      try {
        if (!processDefinitionKey) {
          console.error('Kein Prozessschlüssel angegeben');
          return;
        }
        const data = await fetchProcessDefinitionXml(processDefinitionKey);
        // const response = await fetch(processDefinitionKey);
        // const xml = await response.text();
        setXml(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    loadXml();
  }, [processDefinitionKey]);

  if (error) return <div>Error: {error}</div>;
  if (!xml) return <div>Loading...</div>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{xml}</pre>
  );
};

export default ProcessDefinitionXmlViewer;

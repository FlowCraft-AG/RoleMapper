'use client';

import { useEffect, useState } from 'react';
import ClientPage from './clientPage';

export default function CamundaPageClient() {
  const [files, setFiles] = useState({
    bpmnFiles: [],
    formFiles: [],
    dmnFiles: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch('/api/camunda-files');
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Dateien.');
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      }
    }
    fetchFiles();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Fehler beim Laden der Camunda-Dateien</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ClientPage
      bpmnFiles={files.bpmnFiles}
      formFiles={files.formFiles}
      dmnFiles={files.dmnFiles}
    />
  );
}

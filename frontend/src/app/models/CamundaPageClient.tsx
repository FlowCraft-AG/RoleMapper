/**
 * Diese Komponente lädt BPMN-, Form- und DMN-Dateien von der API und zeigt sie mit der `ClientPage`-Komponente an.
 *
 * @module CamundaPageClient
 */
'use client';

import { useEffect, useState } from 'react';
import ClientPage from './clientPage';

/**
 * Hauptkomponente zur Anzeige von Camunda-Dateien.
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Camunda-Seite.
 */
export default function CamundaPageClient() {
  const [files, setFiles] = useState({
    bpmnFiles: [],
    formFiles: [],
    dmnFiles: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Lädt die Camunda-Dateien von der API.
   */
  useEffect(() => {
    async function fetchFiles() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/camunda-files');
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Dateien.');
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Laden...</h1>
        <p>Die Dateien werden abgerufen, bitte warten.</p>
      </div>
    );
  }

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

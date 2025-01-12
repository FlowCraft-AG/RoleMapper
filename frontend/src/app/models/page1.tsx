/**
 * @file CamundaPage.tsx
 * Seite zum Abrufen und Anzeigen von Camunda-Dateien (BPMN, DMN, Formulare).
 *
 * @module CamundaPage
 */

import { getCamundaFiles } from '../../lib/camunda/camundaFileUtils';
import ClientPage from './clientPage';

/**
 * Hauptkomponente für die Anzeige von Camunda-Dateien.
 *
 * @async
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Camunda-Seite.
 */
export default async function CamundaPage() {
  try {
    // Dateien aus der Hilfsfunktion abrufen
    const { bpmnFiles, formFiles, dmnFiles } = await getCamundaFiles();

    return (
      <ClientPage
        bpmnFiles={bpmnFiles}
        formFiles={formFiles}
        dmnFiles={dmnFiles}
      />
    );
  } catch (error) {
    // Fehlerbehandlung für den Fall, dass `getCamundaFiles` fehlschlägt
    console.error('Fehler beim Abrufen der Camunda-Dateien:', error);

    return (
      <div>
        <h1>Fehler beim Laden der Camunda-Dateien</h1>
        <p>
          Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
        </p>
      </div>
    );
  }
}

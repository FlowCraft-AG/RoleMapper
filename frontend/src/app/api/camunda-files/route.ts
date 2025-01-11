import { NextResponse } from 'next/server';
import { getCamundaFiles } from '../../../lib/camunda/camundaFileUtils';

/**
 * GET-Handler für das Abrufen von Camunda-Dateien.
 *
 * Diese Funktion ruft die verfügbaren Camunda-Dateien (BPMN-, Formular- und DMN-Dateien) ab,
 * indem sie die `getCamundaFiles`-Utility-Funktion verwendet. Die Dateien werden im JSON-Format zurückgegeben.
 *
 * @returns Eine JSON-Antwort mit den gefundenen Camunda-Dateien oder einer Fehlermeldung.
 *
 * @example
 * **Anfrage:**
 * ```http
 * GET /api/camunda/files
 * ```
 *
 * **Antwort (Erfolgreich):**
 * ```json
 * {
 *   "bpmnFiles": ["...", "..."],
 *   "formFiles": ["...", "..."],
 *   "dmnFiles": ["...", "..."]
 * }
 * ```
 *
 * **Antwort (Fehler):**
 * ```json
 * {
 *   "message": "Fehler beim Abrufen der Camunda-Dateien."
 * }
 * ```
 */

export async function GET() {
  try {
    // Ruft die Camunda-Dateien ab
    const { bpmnFiles, formFiles, dmnFiles } = await getCamundaFiles();

    // Gibt die Dateien als JSON-Antwort zurück
    return NextResponse.json({ bpmnFiles, formFiles, dmnFiles });
  } catch (error) {
    console.error('Fehler beim Laden der Camunda-Dateien:', error);
    // Gibt eine Fehlermeldung zurück, wenn ein Fehler auftritt
    return NextResponse.json(
      { message: 'Fehler beim Abrufen der Camunda-Dateien.' },
      { status: 500 },// HTTP 500 Internal Server Error
    );
  }
}

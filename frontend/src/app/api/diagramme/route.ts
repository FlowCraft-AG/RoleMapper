import { readdirSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

/**
 * GET-Handler für das Abrufen der Liste von BPMN-Dateien.
 *
 * Diese Funktion durchsucht ein '.bpmn' Verzeichnis nach Dateien und gibt die Liste 
 * der gefundenen Dateien als JSON-Antwort zurück.
 *
 * @returns Eine JSON-Antwort mit der Liste der BPMN-Dateien oder eine Fehlermeldung.
 *
 * @example
 * **Anfrage:**
 * ```http
 * GET /api/camunda/diagrams
 * ```
 *
 * **Antwort (Erfolg):**
 * - Status: 200
 * - Content-Type: application/json
 * ```json
 * {
 *   "files": ["...", "..."]
 * }
 * ```
 *
 * **Antwort (Fehler):**
 * - Status: 500
 * - Content-Type: application/json
 * ```json
 * {
 *   "error": "Fehler beim Laden der Diagramme"
 * }
 * ```
 */

export async function GET() {
  try {
    // Verzeichnis der BPMN-Dateien 
    const diagramsPath = join(
      process.cwd(),
      '..',
      '.extras',
      'camunda',
      'bpmn',
    );
    // Dateien aus dem Verzeichnis abrufen und nach `.bpmn` filtern
    const files = readdirSync(diagramsPath).filter((file) =>
      file.endsWith('.bpmn'),
    );
    console.log('Gefundene Dateien:', files);
 
    // JSON-Antwort mit der Liste der Dateien zurückgeben
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Fehler beim Laden der Diagramme:', error);
    // Fehlerantwort zurückgeben
    return NextResponse.json(
      { error: 'Fehler beim Laden der Diagramme' },
      { status: 500 },
    );
  }
}

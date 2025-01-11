import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

/**
 * GET-Handler für das Abrufen und Zurückgeben einer spezifischen BPMN-Datei.
 *
 * Diese Funktion ermöglicht das Abrufen einer BPMN-Datei basierend auf einem Dateinamen, der als 
 * Query-Parameter `file` übergeben wird. Die Datei wird im XML-Format zurückgegeben.
 *
 * @param req - Die HTTP-Anfrage, die den Query-Parameter `file` enthält.
 * @returns Eine XML-Antwort mit dem Inhalt der Datei oder eine JSON-Fehlermeldung.
 *
 * @example
 * **Anfrage:**
 * ```http
 * GET /api/camunda/file?file=example.bpmn
 * ```
 *
 * **Antwort (Erfolg):**
 * - Status: 200
 * - Content-Type: application/xml
 * ```xml
 * <?xml version="1.0" encoding="UTF-8"?>
 * <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
 *   <!-- BPMN-Inhalt -->
 * </bpmn:definitions>
 * ```
 *
 * **Antwort (Fehler - kein Dateiname):**
 * - Status: 400
 * - Content-Type: application/json
 * ```json
 * {
 *   "error": "Dateiname nicht angegeben"
 * }
 * ```
 *
 * **Antwort (Fehler - Datei nicht gefunden):**
 * - Status: 500
 * - Content-Type: application/json
 * ```json
 * {
 *   "error": "Fehler beim Laden der Datei"
 * }
 * ```
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');
  console.log('fileName:', fileName);

  // Überprüfen ob ein Dateiname angegeben wurde
  if (!fileName) {
    return NextResponse.json(
      { error: 'Dateiname nicht angegeben' },
      { status: 400 },
    );
  }

  try {
    // Pfad zur Datei erstellen
    const filePath = join(
      process.cwd(),
      '..',
      '.extras',
      'camunda',
      'bpmn',
      fileName,
    );
    // Datei lesen
    const fileContent = readFileSync(filePath, 'utf-8');

    // Dateiinhalt als XML-Antwort zurückgeben
    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Fehler beim Laden der Datei:', error);
    // Fehlerantwort zurückgeben
    return NextResponse.json(
      { error: 'Fehler beim Laden der Datei' },
      { status: 500 },
    );
  }
}

import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

/**
 * POST-Handler zum Aktualisieren der `.env`-Datei mit neuen Umgebungsvariablen.
 *
 * Diese Funktion nimmt eine Anfrage mit neuen Umgebungsvariablen im JSON-Format entgegen, konvertiert sie 
 * in das richtige `.env`-Dateiformat und speichert die Datei im Projektverzeichnis.
 *
 * ** Hinweis:** Das direkte Bearbeiten von `.env`-Dateien zur Laufzeit kann Sicherheits- und Konsistenzrisiken bergen. 
 * Diese Funktion sollte nur in kontrollierten Entwicklungsumgebungen eingesetzt werden.
 *
 * @param req - Die HTTP-Anfrage, die die neuen Umgebungsvariablen im JSON-Body enthält.
 * @returns Eine JSON-Antwort mit einer Erfolgsmeldung oder einer Fehlerbeschreibung.
 *
 * @example
 * **Anfrage:**
 * ```http
 * POST /api/update-env
 * Content-Type: application/json
 *
 * {
 *   "NEXT_PUBLIC_API_URL": "https://example.com/api",
 *   "NEXT_PUBLIC_API_KEY": "your-api-key"
 * }
 * ```
 *
 * **Antwort (Erfolg):**
 * ```json
 * {
 *   "message": "Umgebungsvariablen aktualisiert."
 * }
 * ```
 *
 * **Antwort (Fehler):**
 * ```json
 * {
 *   "message": "Fehler beim Speichern der Datei."
 * }
 * ```
 */

export async function POST(req: Request) {
  try {
    // Den Body der Anfrage auslesen
    const body = await req.json();

    // Der Pfad zur `.env.local` Datei
    const envPath = path.resolve(process.cwd(), '.env');

    /**
     * Konvertiert die Umgebungsvariablen aus dem JSON-Body
     * in das `.env`-Dateiformat (Key=Value)
     */
    const envContent = Object.entries(body)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Die Datei speichern
    fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });

    return NextResponse.json({ message: 'Umgebungsvariablen aktualisiert.' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Umgebungsvariablen:', error);
    return NextResponse.json(
      { message: 'Fehler beim Speichern der Datei.' },
      { status: 500 },
    );
  }
}

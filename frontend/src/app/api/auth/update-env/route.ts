import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Der Pfad zur `.env.local` Datei
    const envPath = path.resolve(process.cwd(), '.env');

    // Die Umgebungsvariablen in das richtige Format umwandeln
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

import { readdirSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function GET() {
  try {
    const diagramsPath = join(
      process.cwd(),
      '..',
      '.extras',
      'camunda',
      'bpmn',
    );
    const files = readdirSync(diagramsPath).filter((file) =>
      file.endsWith('.bpmn'),
    );
    console.log('Gefundene Dateien:', files);

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Fehler beim Laden der Diagramme:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Diagramme' },
      { status: 500 },
    );
  }
}

import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');
  console.log('fileName:', fileName);
  if (!fileName) {
    return NextResponse.json(
      { error: 'Dateiname nicht angegeben' },
      { status: 400 },
    );
  }

  try {
    const filePath = join(
      process.cwd(),
      '..',
      '.extras',
      'camunda',
      'bpmn',
      fileName,
    );
    const fileContent = readFileSync(filePath, 'utf-8');

    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Fehler beim Laden der Datei:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Datei' },
      { status: 500 },
    );
  }
}

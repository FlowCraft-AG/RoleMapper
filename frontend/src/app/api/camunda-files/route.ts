import { NextResponse } from 'next/server';
import { getCamundaFiles } from '../../../lib/camunda/camundaFileUtils';

export async function GET() {
  try {
    const { bpmnFiles, formFiles, dmnFiles } = await getCamundaFiles();
    return NextResponse.json({ bpmnFiles, formFiles, dmnFiles });
  } catch (error) {
    console.error('Fehler beim Laden der Camunda-Dateien:', error);
    return NextResponse.json(
      { message: 'Fehler beim Abrufen der Camunda-Dateien.' },
      { status: 500 },
    );
  }
}

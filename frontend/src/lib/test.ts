import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const diagramPath = path.join(process.cwd(), 'src/components/diagram_1.bpmn');
  const bpmnDiagram = fs.readFileSync(diagramPath, 'utf-8');
  res.status(200).send(bpmnDiagram);
}

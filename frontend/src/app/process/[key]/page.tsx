import ProcessInstanceDetailsContent from './ProcessInstanceDetails';

interface ProcessInstanceDetailsPageProps {
  params: Promise<{ key: string }>; // Typ von params anpassen
}

export default async function ProcessInstanceDetailsPage({
  params,
}: ProcessInstanceDetailsPageProps) {
  const { key } = await params; // Warten, bis params aufgelöst ist
  console.log('ProcessInstanceDetails:', key);
  // Warte auf die Auflösung von `params`
  const processKey = key; // Sicherstellen, dass `params` asynchron verarbeitet wird

  return (
    <div>
      <ProcessInstanceDetailsContent processKey={processKey} />
    </div>
  );
}

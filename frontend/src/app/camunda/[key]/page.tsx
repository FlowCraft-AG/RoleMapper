import ProcessDefinitionToggleViewer from './ProcessDefinitionToggleViewer';

interface ProcessDefinitionPageProps {
  params: Promise<{ key: string }>; // Typ von params anpassen
}

const ProcessDefinitionPage = async ({
  params,
}: ProcessDefinitionPageProps) => {
  const { key } = await params; // Warten, bis params aufgelöst ist

  return (
    <div>
      <h1>Process Definition Viewer</h1>
      {/* Übergabe des Keys an die Clientkomponente */}
      <ProcessDefinitionToggleViewer processInstanceKey={key} />
    </div>
  );
};

export default ProcessDefinitionPage;

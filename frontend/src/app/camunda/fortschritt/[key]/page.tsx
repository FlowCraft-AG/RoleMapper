/**
 * @file ProcessDefinitionPage.tsx
 * @description Server-Komponente zur Anzeige der Prozessdefinition-Seite.
 * Lädt den Prozessinstanz-Schlüssel (`processInstanceKey`) und übergibt ihn an die Client-Komponente `ProcessDefinitionToggleViewer`.
 *
 * @module ProcessDefinitionPage
 */

import ProcessDefinitionToggleViewer from './ProcessDefinitionToggleViewer';

/**
 * Props für die `ProcessDefinitionPage`-Komponente.
 *
 * @interface ProcessDefinitionPageProps
 * @property {Promise<{ key: string }>} params - Ein Promise, das die URL-Parameter mit dem Prozessinstanz-Schlüssel enthält.
 */
interface ProcessDefinitionPageProps {
  params: Promise<{ key: string }>; // Typ von params anpassen
}

/**
 * Server-Komponente zur Anzeige der Prozessdefinition.
 *
 * Diese Komponente:
 * - Lädt die URL-Parameter (`params`) asynchron.
 * - Übergibt den `processInstanceKey` an die Client-Komponente `ProcessDefinitionToggleViewer`.
 *
 * @component
 * @param {ProcessDefinitionPageProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 *
 * @example
 * ```tsx
 * <ProcessDefinitionPage params={Promise.resolve({ key: 'instance-key' })} />
 * ```
 */
const ProcessDefinitionPage = async ({
  params,
}: ProcessDefinitionPageProps) => {
  // Warte, bis die URL-Parameter (params) aufgelöst sind
  const { key } = await params;

  return (
    <div>
      <h1>Process Definition Viewer</h1>
      {/* Übergabe des Keys an die Clientkomponente */}
      <ProcessDefinitionToggleViewer processInstanceKey={key} />
    </div>
  );
};

export default ProcessDefinitionPage;

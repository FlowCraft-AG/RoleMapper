import ProcessInstanceDetailsContent from './ProcessInstanceDetails';

/**
 * Eigenschaften der Seite für die Details einer Prozessinstanz.
 * @property {Promise<{ key: string }>} params - Die Parameter der Seite
 * @property {string} params.key - Der Schlüssel der Prozessinstanz
 */
interface ProcessInstanceDetailsPageProps {
  params: Promise<{ key: string }>; // Typ von params anpassen
}

/**
 * Seite für die Details einer Prozessinstanz.
 *
 * @component
 * @param {ProcessInstanceDetailsPageProps} props - Eigenschaften der Seite
 * @returns {JSX.Element} Die JSX-Struktur der Seite
 *
 * @example
 * ```tsx
 * <ProcessInstanceDetailsPage params={{ key: 'exampleKey' }} />
 * ```
 */
export default async function ProcessInstanceDetailsPage({
  params,
}: ProcessInstanceDetailsPageProps) {
  const { key } = await params; // Warten, bis params aufgelöst ist
  const processKey = key; // Sicherstellen, dass `params` asynchron verarbeitet wird

  return (
    <div>
      <ProcessInstanceDetailsContent processKey={processKey} />
    </div>
  );
}

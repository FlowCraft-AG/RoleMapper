'use client';

import dynamic from 'next/dynamic';


// Dynamischer Import der Client-Komponente
const CamundaPageClient = dynamic(() => import('./CamundaPageClient'), {
  ssr: false, // Stelle sicher, dass diese nur im Browser ausgeführt wird
});

/**
 * Server-Komponente, die die Client-Komponente `CamundaPageClient` rendert.
 *
 * Diese Komponente dient als Einstiegspunkt und importiert `CamundaPageClient` dynamisch,
 * um serverseitiges Rendering zu verhindern.
 *
 * @returns {JSX.Element} Die gerenderte `CamundaPageClient`-Komponente.
 */
export default function Page() {
  return <CamundaPageClient />;
}

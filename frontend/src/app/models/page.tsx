'use client'

import dynamic from 'next/dynamic';

// Dynamischer Import der Client-Komponente
const CamundaPageClient = dynamic(() => import('./CamundaPageClient'), {
  ssr: false, // Stelle sicher, dass diese nur im Browser ausgeführt wird
});

export default function Page() {
  return <CamundaPageClient />;
}

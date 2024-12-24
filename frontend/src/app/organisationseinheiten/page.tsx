import { Metadata } from 'next';
import OrganigrammPage from './orgUnitPage';

export const metadata: Metadata = {
  title: 'Organisationseinheiten',
  description:
    'Organigramm der Hochschule Karlsruhe (HSKA) zur Darstellung der Fakultäten, Institute und Rollen.',
  icons: {
    icon: '/favicon.ico', // Favicon im public-Ordner referenzieren
  },
};

// Server-Komponente zur Datenabfrage
export default async function HKAPage() {
  return <OrganigrammPage />;
}

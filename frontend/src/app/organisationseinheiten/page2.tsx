import { Metadata } from 'next';
import OrgUnitsPage from './OrgUnitPage';

export const metadata: Metadata = {
  title: 'Organisationseinheiten',
  description: 'Verwalte deine Organisationseinheiten in der Anwendung',
};

// Server-Komponente zur Datenabfrage
export default async function RolesPage() {
  return <OrgUnitsPage />;
}

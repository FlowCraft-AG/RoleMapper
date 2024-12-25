import { Metadata } from 'next';
import { ENV } from '../../utils/env';
import { getLogger } from '../../utils/logger';
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
  const logger = getLogger('HKAPage');
  console.info('SERVER OrganigrammPage');
  console.info('SERVER HKAPage');
  logger.debug('HKAPage');
  logger.debug(
    'NEXT_PUBLIC_BACKEND_SERVER_URL=%s',
    ENV.NEXT_PUBLIC_BACKEND_SERVER_URL,
  );
  console.info('TEST: ', ENV.NEXT_PUBLIC_BACKEND_SERVER_URL);
  return <OrganigrammPage />;
}

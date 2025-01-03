import { Metadata } from 'next';
import { ENV } from '../../utils/env';
import { getLogger } from '../../utils/logger';
import ProzessPage from './processPage';

export const metadata: Metadata = {
  title: 'Prozesse',
  description:
    'Darstellung und Anpassung von Prozessen und Rollen an der Hochschule',
  icons: {
    icon: '/favicon.ico', // Favicon im public-Ordner referenzieren
  },
};

// Server-Komponente zur Datenabfrage
export default async function HKAPage() {
  const logger = getLogger('HKAPage');
  console.info('SERVER ProzessPage');
  console.info('SERVER HKAPage');
  logger.debug('HKAPage');
  logger.debug(
    'NEXT_PUBLIC_BACKEND_SERVER_URL=%s',
    ENV.NEXT_PUBLIC_BACKEND_SERVER_URL,
  );
  return <ProzessPage />;
}

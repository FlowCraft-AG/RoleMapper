/**
 * @file Page.tsx
 * @description Hauptseite für die Organisationseinheiten der Hochschule Karlsruhe (HSKA).
 * Diese Seite bietet Navigation zu verschiedenen Ansichten des Organigramms
 * und zeigt eine eingebettete Organigramm-Komponente.
 *
 * @module OrganisationseinheitenPage
 */

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import OrganigrammPage from './orgUnitPage';

/**
 * Metadata für die Organisationseinheiten-Seite.
 * Wird von Next.js genutzt, um Titel und Beschreibung der Seite festzulegen.
 *
 * @constant
 * @type {Metadata}
 * @property {string} title - Der Titel der Seite.
 * @property {string} description - Beschreibung der Seite.
 * @property {object} icons - Icon-Konfiguration für die Seite.
 */

export const metadata: Metadata = {
  title: 'Organisationseinheiten',
  description:
    'Organigramm der Hochschule Karlsruhe (HSKA) zur Darstellung der Fakultäten, Institute und Rollen.',
};

/**
 * Hauptkomponente der Organisationseinheiten-Seite.
 *
 * Diese Komponente enthält:
 * - Einen Header mit dem Titel der Seite
 * - Eine Navigation als Karten mit Links zu verschiedenen Ansichten des Organigramms
 * - Eine eingebettete Organigramm-Komponente, die lazy-loaded ist
 *
 * @async
 * @function
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 *
 * @example
 * Aufruf in Next.js
 * export default function App() {
 *   return <OrganisationseinheitenPage />;
 * }
 */
export default async function HKAPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontWeight: 'bold',
          letterSpacing: 1,
        }}
      >
        Organisationseinheiten
      </Typography>

      {/* Navigation als Karten */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3,
          marginBottom: 4,
        }}
      >
        {/* Link zur interaktiven Slider-Darstellung */}
        <Link href="/organisationseinheiten/slider" passHref>
          <Card
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Slider
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Entdecken Sie das Organigramm in einer interaktiven
                  Slider-Darstellung.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

        {/* Link zur Standard-Darstellung */}
        <Link href="/organisationseinheiten/standard" passHref>
          <Card
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Standard
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Klassische Ansicht des Organigramms mit Fokus auf Einfachheit.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Box>

      {/* Lazy-loaded Organigramm-Komponente */}
      <Suspense
        fallback={
          <Box sx={{ textAlign: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        {/* Organigramm-Ansicht */}
        <OrganigrammPage />
      </Suspense>
    </Box>
  );
}

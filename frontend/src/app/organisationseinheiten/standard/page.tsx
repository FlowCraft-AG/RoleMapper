import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import OrganigrammPage from './orgUnitPage';

// Metadaten der Seite: Titel und Beschreibung für die Kopfzeile.
export const metadata: Metadata = {
  title: 'Organisationseinheiten',
  description:
    'Organigramm der Hochschule Karlsruhe (HKA) zur Darstellung der Fakultäten, Institute und Rollen.',
};

/**
 *
 * Diese Server-Komponente dient als Einstiegspunkt für die Darstellung und Navigation
 * der Organisationseinheiten. Sie bietet eine Übersicht über Darstellungsoptionen
 * und integriert die Organigramm-Komponente.
 *
 * @returns {JSX.Element} Die gerenderte Seite für Organisationseinheiten.
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
        <Link href="/organisationseinheiten" passHref>
          <Card
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Box
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Hervorgehobene Ansicht des Organigramms mit Fokus auf
                  Einfachheit.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Box>

      <OrganigrammPage />
    </Box>
  );
}

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import OrganigrammPage from './orgUnitPage';

export const metadata: Metadata = {
  title: 'Organisationseinheiten',
  description:
    'Organigramm der Hochschule Karlsruhe (HSKA) zur Darstellung der Fakultäten, Institute und Rollen.',
  icons: {
    icon: '/favicon.ico',
  },
};

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

      <Suspense fallback={<div>Laden...</div>}>
        {/* Organigramm-Ansicht */}
        <OrganigrammPage />
      </Suspense>
    </Box>
  );
}

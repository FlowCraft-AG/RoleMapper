import { Box, Button, Typography } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
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
  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold' }}
      >
        Organisationseinheiten
      </Typography>

      {/* Buttons für die Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          marginBottom: 4,
        }}
      >
        <Link href="/organisationseinheiten/slider" passHref>
          <Button variant="contained" color="primary">
            Slider
          </Button>
        </Link>
        <Link href="/organisationseinheiten/standard" passHref>
          <Button variant="contained" color="secondary">
            Standard
          </Button>
        </Link>
        <Link href="/organisationseinheiten/breakpoint" passHref>
          <Button variant="contained" color="success">
            mit breakpoints
          </Button>
        </Link>
      </Box>

      {/* OrganigrammPage */}
      <OrganigrammPage />
    </Box>
  );
}

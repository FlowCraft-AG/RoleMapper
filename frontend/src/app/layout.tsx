'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local';
import React from 'react';
import Navigation from '../components/navigation/Navigation';
import ThemeProviderWrapper from '../theme/ThemeProviderWrapper';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

/**
 * RootLayout-Komponente für die gesamte Anwendung.
 * Diese Komponente ist der Einstiegspunkt für alle Seiten und setzt globale Stile, Themes und den Sitzungskontext.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - Die Childkomponente, die innerhalb des Layouts gerendert werden.
 * @returns {JSX.Element} Das gerenderte Layout der Anwendung.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProviderWrapper>
          <SessionProvider>
            <CssBaseline />
            <Navigation />
            {children}
          </SessionProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

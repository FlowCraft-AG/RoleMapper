/**
 * @file Page.tsx
 * @description Hauptseite für die Prozesse der Hochschule Karlsruhe (HSKA).
 * Diese Seite zeigt direkt die `ProcessPage`-Komponente an.
 *
 * @module ProzessePage
 */

import { Metadata } from 'next';
import ProcessPage from './processPageTest';

/**
 * Metadata für die Prozesse-Seite.
 * Wird von Next.js genutzt, um Titel und Beschreibung der Seite festzulegen.
 *
 * @constant
 * @type {Metadata}
 * @property {string} title - Der Titel der Seite.
 * @property {string} description - Beschreibung der Seite.
 * @property {object} icons - Icon-Konfiguration für die Seite.
 */
export const metadata: Metadata = {
  title: 'Prozesse',
  description:
    'Darstellung und Anpassung von Prozessen und Rollen an der Hochschule Karlsruhe (HSKA).',
  icons: {
    icon: '/favicon.ico',
  },
};

/**
 * Hauptkomponente der Prozesse-Seite.
 *
 * Diese Komponente zeigt ausschließlich die `ProcessPage` an.
 *
 * @async
 * @function
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 */
export default async function ProzessePage() {
  return <ProcessPage />;
}

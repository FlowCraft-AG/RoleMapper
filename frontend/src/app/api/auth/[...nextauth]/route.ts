import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

/**
 * GET-Handler für die NextAuth-Route.
 *
 * Diese Route ermöglicht es, Anfragen zur Authentifizierung mit NextAuth zu behandeln. 
 * Nutzt die `authOptions`-Konfiguration, um die Authentifizierungsmechanismen zu definieren.
 *
 * @example
 * ```http
 * GET /api/auth
 * ```
 *
 * @returns Die von NextAuth generierte Antwort, die für Authentifizierungs-Workflows genutzt wird.
 */

export const GET = NextAuth(authOptions);

/**
 * POST-Handler für die NextAuth-Route.
 *
 * Diese Route behandelt POST-Anfragen an NextAuth. Verwendet ebenfalls die `authOptions`-Konfiguration.
 *
 * @example
 * ```http
 * POST /api/auth
 * ```
 *
 * @returns Die von NextAuth generierte Antwort für POST-Anfragen.
 */
export const POST = NextAuth(authOptions);

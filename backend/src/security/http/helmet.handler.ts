/**
 * @file helmetHandlers.ts
 * @description Konfiguriert und exportiert eine Sammlung von Sicherheits-Middleware mit dem `helmet`-Paket. 
 * Diese Handler bieten erweiterte Sicherheit, indem sie verschiedene Schwachstellen wie Cross-Site-Scripting (XSS), 
 * Clickjacking und MIME-Sniffing adressieren und sichere Inhaltsrichtlinien durchsetzen.
 * @module SicherheitsMiddleware
 */

import { contentSecurityPolicy, frameguard, hidePoweredBy, hsts, noSniff, xssFilter } from 'helmet';

/**
 * Eine Sammlung von Sicherheits-Middleware-Funktionen für eine Express-Anwendung. 
 * Diese Handler implementieren Maßnahmen für:
 * - Content Security Policy (CSP)
 * - Schutz vor Cross-Site-Scripting (XSS)
 * - Verhinderung von Clickjacking
 * - HTTP Strict Transport Security (HSTS)
 * - Deaktivierung von MIME-Typ-Sniffing
 * - Verbergen von Server-Identifikations-Headern
 * 
 * @constant
 * @type {Array<Function>}
 */
export const helmetHandlers = [
    /**
     * Konfiguriert Content Security Policy (CSP), um Quellen für Inhalte wie Skripte und Bilder einzuschränken.
     * - Standardmäßig werden nur sichere Quellen (`https` und `self`) erlaubt.
     * - Ermöglicht Inline-Skripte und Eval für die Nutzung von GraphiQL.
     * 
     * @see {@link https://helmetjs.github.io/docs/csp/ Helmet CSP Dokumentation}
     */
    contentSecurityPolicy({
        useDefaults: true,
        directives: {
            defaultSrc: ["https: 'self'"],
            scriptSrc: ["https: 'unsafe-inline' 'unsafe-eval'"],
            imgSrc: ["data: 'self'"],
        },
        reportOnly: false,
    }),

    /**
     * Fügt Schutz vor Cross-Site-Scripting (XSS)-Angriffen hinzu, indem der `X-XSS-Protection`-Header gesetzt wird.
     * 
     * @see {@link https://helmetjs.github.io/docs/xss-filter/ Helmet XSS-Filter Dokumentation}
     */
    xssFilter(),

    /**
     * Verhindert Clickjacking, indem der `X-Frame-Options`-Header gesetzt wird.
     * 
     * @see {@link https://helmetjs.github.io/docs/frameguard/ Helmet Frameguard Dokumentation}
     */
    frameguard(),

    /**
     * Erzwingt HTTP Strict Transport Security (HSTS), indem der `Strict-Transport-Security`-Header gesetzt wird.
     * 
     * @see {@link https://helmetjs.github.io/docs/hsts/ Helmet HSTS Dokumentation}
     */
    hsts(),

    /**
     * Deaktiviert MIME-Typ-Sniffing, indem der `X-Content-Type-Options`-Header gesetzt wird.
     * 
     * @see {@link https://helmetjs.github.io/docs/dont-sniff-mimetype/ Helmet NoSniff Dokumentation}
     */
    noSniff(),

    /**
     * Entfernt den `X-Powered-By`-Header, um die Technologie-Stack des Servers zu verschleiern.
     * 
     * @see {@link https://helmetjs.github.io/docs/hide-powered-by/ Helmet HidePoweredBy Dokumentation}
     */
    hidePoweredBy(),
];

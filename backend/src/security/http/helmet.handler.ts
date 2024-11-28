import {
    contentSecurityPolicy,
    frameguard,
    hidePoweredBy,
    hsts,
    noSniff,
    xssFilter,
} from 'helmet';

/**
 * Security-Funktionen für z.B. CSP, XSS, Click-Jacking, HSTS und MIME-Sniffing.
 */
export const helmetHandlers = [
    // CSP = Content Security Policy
    contentSecurityPolicy({
        useDefaults: true,
        /* eslint-disable @stylistic/quotes */
        directives: {
            defaultSrc: ["https: 'self'"],
            // für GraphQL IDE => GraphiQL
            scriptSrc: ["https: 'unsafe-inline' 'unsafe-eval'"],
            // für GraphQL IDE => GraphiQL
            imgSrc: ["data: 'self'"],
        },
        /* eslint-enable @stylistic/quotes */
        reportOnly: false,
    }),

    // XSS = Cross-site scripting attacks: Header X-XSS-Protection
    xssFilter(),

    // Clickjacking
    frameguard(),

    // HSTS = HTTP Strict Transport Security:
    //   Header Strict-Transport-Security
    hsts(),

    // MIME-sniffing: im Header X-Content-Type-Options
    noSniff(),

    // Im Header z.B. "X-Powered-By: Express" unterdruecken
    hidePoweredBy(),
];

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/**
 * @file
 * Konfiguration der Keycloak-Integration für die Anwendung.
 *
 * @module KeycloakConfig
 * @description
 * Dieses Modul enthält die Konfigurationsobjekte und Utility-Funktionen für die Integration von NestJS
 * mit Keycloak. Es stellt Optionen für die Authentifizierung und Autorisierung sowie einen HTTPS-Agent
 * für selbstsignierte Zertifikate bereit.
 */

import {
    type KeycloakConnectConfig,
    PolicyEnforcementMode,
    TokenValidation,
} from 'nest-keycloak-connect';
import { Agent } from 'node:https';
import { config } from './app.js';
import { environment } from './environment.js';
import { httpsOptions } from './https.js';

const { keycloak } = config;

// Konfigurationswerte für den Keycloak-Server
const authServerUrl = (keycloak?.authServerUrl as string | undefined) ?? 'http://localhost:8880';
// Keycloak ist in Sicherheits-Bereich (= realms) unterteilt
const realm = (keycloak?.realm as string | undefined) ?? 'myRealm';
const clientId = (keycloak?.clientId as string | undefined) ?? 'myClient';
const tokenValidation =
    (keycloak?.tokenValidation as TokenValidation | undefined) ??
    (TokenValidation.ONLINE as TokenValidation);

const { KEYCLOAK_CLIENT_SECRET } = environment;

/**
 * @constant
 * @type {KeycloakConnectConfig}
 * @description
 * Konfigurationsobjekt für die Integration von NestJS mit Keycloak.
 *
 * @property {string} authServerUrl - Die Basis-URL des Keycloak-Servers.
 * @property {string} realm - Der Name des Sicherheitsbereichs (Realm) in Keycloak.
 * @property {string} clientId - Die Client-ID der Anwendung, wie in Keycloak registriert.
 * @property {string} secret - Das Client-Secret für die Authentifizierung.
 * @property {PolicyEnforcementMode} policyEnforcement - Wie Zugriffsrichtlinien durchgesetzt werden.
 * @property {TokenValidation} tokenValidation - Art der Token-Validierung (z. B. Online oder Offline).
 *
 * @throws {Error} Falls `KEYCLOAK_CLIENT_SECRET` nicht gesetzt ist.
 */
export const keycloakConnectOptions: KeycloakConnectConfig = {
    authServerUrl,
    realm,
    clientId,
    secret:
        KEYCLOAK_CLIENT_SECRET ?? 'ERROR: Umgebungsvariable KEYCLOAK_CLIENT_SECRET nicht gesetzt!',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation,
};

/**
 * @constant
 * @type {object}
 * @description
 * URL-Pfade für den Zugriff auf Keycloak-Dienste.
 *
 * @property {string} accessToken - Pfad zum Abrufen eines Zugriffstokens.
 * @property {string} userInfo - Pfad zum Abrufen von Benutzerinformationen.
 * @property {string} introspect - Pfad zur Überprüfung eines Tokens.
 */
export const paths = {
    accessToken: `realms/${realm}/protocol/openid-connect/token`,
    userInfo: `realms/${realm}/protocol/openid-connect/userinfo`,
    introspect: `realms/${realm}/protocol/openid-connect/token/introspect`,
};

/**
 * @constant
 * @type {Agent}
 * @description
 * HTTPS-Agent für Axios zur Unterstützung von selbstsignierten Zertifikaten.
 *
 * @property {boolean} requestCert - Gibt an, dass ein Client-Zertifikat angefordert wird.
 * @property {boolean} rejectUnauthorized - Deaktiviert die Ablehnung nicht autorisierter Zertifikate.
 * @property {Buffer} ca - Das CA-Zertifikat zur Überprüfung der HTTPS-Verbindung.
 */
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions.cert!,
});


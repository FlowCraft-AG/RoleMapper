import {
    type KeycloakConnectConfig,
    PolicyEnforcementMode,
    TokenValidation,
} from 'nest-keycloak-connect';
import { Agent } from 'node:https';
import { config } from './app.js';
import { env } from './env.js';
import { httpsOptions } from './https.js';

const { keycloak } = config;
const authServerUrl =
    (keycloak?.authServerUrl as string | undefined) ?? 'http://localhost:8880';
// Keycloak ist in Sicherheits-Bereich (= realms) unterteilt
const realm = (keycloak?.realm as string | undefined) ?? 'nest';
const clientId = (keycloak?.clientId as string | undefined) ?? 'nest-client';
const tokenValidation =
    (keycloak?.tokenValidation as TokenValidation | undefined) ??
    (TokenValidation.ONLINE as TokenValidation);

const { CLIENT_SECRET, NODE_ENV } = env;

export const keycloakConnectOptions: KeycloakConnectConfig = {
    authServerUrl,
    realm,
    clientId,
    secret:
        CLIENT_SECRET ??
        'ERROR: Umgebungsvariable CLIENT_SECRET nicht gesetzt!',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation,
};
if (NODE_ENV === 'development') {
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptions);
} else {
    const { secret, ...keycloakConnectOptionsLog } = keycloakConnectOptions;
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptionsLog);
}

export const paths = {
    accessToken: `realms/${realm}/protocol/openid-connect/token`,
    userInfo: `realms/${realm}/protocol/openid-connect/userinfo`,
    introspect: `realms/${realm}/protocol/openid-connect/token/introspect`,
};

/** Agent für Axios für Requests bei selbstsigniertem Zertifikat */
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions.cert as Buffer,
});

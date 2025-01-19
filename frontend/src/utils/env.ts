/**
 * Konstante `ENV`:
 * Enthält alle relevanten Umgebungsvariablen mit Standardwerten,
 * falls die Variablen nicht definiert sind.
 */
export const ENV = {
  NODE_TLS_REJECT_UNAUTHORIZED:
    process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? 'N/A', // Überprüfung von TLS-Zertifikaten
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'N/A', // Keycloak-Client-ID
  NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ?? 'N/A', // Keycloak-Client-Secret
  NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? 'N/A', // Keycloak-Issuer-URL
  NEXT_PUBLIC_BACKEND_SERVER_URL:
    process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ?? 'N/A', // Backend-Server-URL
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'N/A', // NextAuth-Secret für Token-Validierung
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'N/A', // NextAuth-Basis-URL
  NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG ?? 'N/A', // Debug-Modus für NextAuth
  NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info', // Log-Level
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'N/A', // Aktive Umgebung (z. B. production, development)
  NEXT_PUBLIC_PINO_PRETTY: process.env.NEXT_PUBLIC_PINO_PRETTY ?? 'true', // Aktiviert Pretty Print für Logs
  NEXT_PUBLIC_LOG_DIR: process.env.NEXT_PUBLIC_LOG_DIR ?? 'logs', // Log-Verzeichnis
  CAMUNDA_OPERATE_API_URL:
    process.env.CAMUNDA_OPERATE_API_URL ?? 'http://localhost:8081/v1',
  CAMUNDA_TASKLIST_API_URL:
    process.env.CAMUNDA_TASKLIST_API_URL ?? 'http://localhost:8082/v1',
  CAMUNDA_KEYCLOAK_API_URL:
    process.env.CAMUNDA_KEYCLOAK_API_URL ??
    'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token',
  CAMUNDA_KEYCLOAK_CLIENT_SECRET:
    process.env.CAMUNDA_KEYCLOAK_CLIENT_SECRET ?? 'N/A',
  NOTIFICATION_UPDATE_INTERVAL:
    process.env.NOTIFICATION_UPDATE_INTERVAL ?? '86400000',
  ADMIN_GROUP: process.env.NEXT_PUBLIC_ADMIN_GROUP ?? 'Identity',
  DEFAULT_ROUTE: process.env.NEXT_PUBLIC_DEFAULT_ROUTE ?? '/',
};

/**
 * Funktion `logEnvironmentVariables`:
 * Gibt alle Umgebungsvariablen in der Konsole aus.
 * Nützlich für Debugging-Zwecke, um sicherzustellen, dass alle Variablen korrekt geladen wurden.
 */
export const logEnvironmentVariables = () => {
  console.info('Logging all environment variables:');
  Object.entries(ENV).forEach(([key, value]) => {
    console.info('%s=%s', key, value || 'NOT SET'); // Loggt die Variablen und ihre Werte
  });
};

/**
 * Funktion `validateEnvironmentVariables`:
 * Überprüft, ob alle erforderlichen Umgebungsvariablen definiert sind.
 * Falls eine oder mehrere Variablen fehlen, wird eine Fehlermeldung ausgegeben und ein Fehler ausgelöst.
 */
export const validateEnvironmentVariables = () => {
  // Liste der erforderlichen Variablen
  const requiredVariables = [
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET',
    'NEXT_PUBLIC_KEYCLOAK_ISSUER',
    'NEXT_PUBLIC_BACKEND_SERVER_URL',
    'NEXTAUTH_SECRET',
  ];

  // Filtert fehlende Variablen heraus
  const missingVariables = requiredVariables.filter(
    (key) => !ENV[key as keyof typeof ENV],
  );

  // Wenn Variablen fehlen, wird ein Fehler ausgelöst
  if (missingVariables.length > 0) {
    console.error(
      'The following required environment variables are missing: %s',
      missingVariables.join(', '),
    );
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}`,
    );
  }
};

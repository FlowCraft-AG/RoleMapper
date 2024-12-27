export const ENV = {
  NODE_TLS_REJECT_UNAUTHORIZED:
    process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? 'N/A',
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'N/A',
  NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ?? 'N/A',
  NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? 'N/A',
  NEXT_PUBLIC_BACKEND_SERVER_URL:
    process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ?? 'N/A',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'N/A',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'N/A',
  NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG ?? 'N/A',
  NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'N/A',
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'N/A',
  NEXT_PUBLIC_PINO_PRETTY: process.env.NEXT_PUBLIC_PINO_PRETTY ?? 'N/A',
  NEXT_PUBLIC_LOG_DIR: process.env.NEXT_PUBLIC_LOG_DIR ?? 'N/A',
};

export const logEnvironmentVariables = () => {
  console.info('Logging all environment variables:');
  Object.entries(ENV).forEach(([key, value]) => {
    console.info('%s=%s', key, value || 'NOT SET');
  });
};

export const validateEnvironmentVariables = () => {
  const requiredVariables = [
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET',
    'NEXT_PUBLIC_KEYCLOAK_ISSUER',
    'NEXT_PUBLIC_BACKEND_SERVER_URL',
    'NEXT_PUBLIC_BACKEND_SERVER_URL',
    'NEXTAUTH_SECRET',
  ];

  const missingVariables = requiredVariables.filter(
    (key) => !ENV[key as keyof typeof ENV],
  );

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

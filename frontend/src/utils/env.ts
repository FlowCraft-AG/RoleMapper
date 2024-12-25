export const ENV = {
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
  NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
  NEXT_PUBLIC_BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
  NEXT_PUBLIC_BACKEND_CLIENT_URL: process.env.NEXT_PUBLIC_BACKEND_CLIENT_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'debug',
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development',
  NEXT_PUBLIC_PINO_PRETTY: process.env.NEXT_PUBLIC_PINO_PRETTY ?? 'true',
  NEXT_PUBLIC_LOG_DIR: process.env.NEXT_PUBLIC_LOG_DIR ?? 'logs',
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
    'NEXT_PUBLIC_BACKEND_CLIENT_URL',
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

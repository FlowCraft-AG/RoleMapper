export const mongoDbUri = process.env.MONGODB_URI;
if (!mongoDbUri) {
  throw new Error(
    'Die Umgebungsvariable MONGODB_URI ist nicht definiert. Bitte prüfe deine .env-Datei.',
  );
}

// Hier stellt TypeScript sicher, dass mongoUri ein string ist
export const validatedMongoDbUri: string = mongoDbUri;
export const mongoDbName = process.env.MONGODB_DATABASE ?? 'default-database';

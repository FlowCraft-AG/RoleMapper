import * as dotenv from 'dotenv';

// Laden der .env-Datei
dotenv.config();

export const mongoDatabaseUri = process.env.TEST_MONGODB_URI;
if (mongoDatabaseUri === undefined) {
    throw new Error(
        'Die Umgebungsvariable MONGODB_URI ist nicht definiert. Bitte prüfe deine .env-Datei.',
    );
}

// Hier stellt TypeScript sicher, dass mongoUri ein string ist
export const validatedMongoDatabaseUri: string = mongoDatabaseUri;
export const mongoDatabaseName = process.env.TEST_MONGODB_DATABASE ?? 'default-database';

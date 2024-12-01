import { GraphQLRequest } from '@apollo/server';
import { HttpStatus, type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { Agent } from 'node:https';
import { AppModule } from '../src/app.module.js';
import { nodeConfig } from '../src/config/node.js';
import { paths } from '../src/config/paths.js';

export const tokenPath = `${paths.auth}/${paths.token}`;
export const refreshPath = `${paths.auth}/${paths.refresh}`;

export const { host, port } = nodeConfig;
export type GraphQLQuery = Pick<GraphQLRequest, 'query'>;

const { httpsOptions } = nodeConfig;

// MongoDB Cloud-Verbindungs-URI
const mongoUri = process.env.MONGODB_URI as string;

// -----------------------------------------------------------------------------
// MongoDB-Verbindung prüfen
// -----------------------------------------------------------------------------
const connectToMongoDB = async () => {
    try {
        console.info('Stelle Verbindung zu MongoDB in der Cloud her...');
        await mongoose.connect(mongoUri);
        console.info('Erfolgreich mit MongoDB verbunden.');
    } catch (error) {
        console.error('Fehler beim Verbinden mit MongoDB:', error);
        process.exit(1);
    }
};

// -----------------------------------------------------------------------------
// T e s t s e r v e r   m i t   H T T P S
// -----------------------------------------------------------------------------
let server: INestApplication;

export const startServer = async () => {
    console.info('Überprüfe Verbindung zu MongoDB...');
    await connectToMongoDB();

    server = await NestFactory.create(AppModule, {
        httpsOptions,
        logger: ['log'],
    });

    server.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );

    await server.listen(port);
    console.info(`Server läuft unter https://${host}:${port}`);
    return server;
};

export const shutdownServer = async () => {
    try {
        await server.close();
        console.info('Server erfolgreich beendet.');
    } catch {
        console.warn('Der Server wurde fehlerhaft beendet.');
    }

    try {
        await mongoose.disconnect();
        console.info('Verbindung zu MongoDB geschlossen.');
    } catch (error) {
        console.warn('Fehler beim Schließen der MongoDB-Verbindung:', error);
    }
};

// für selbst-signierte Zertifikate
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions.cert as Buffer,
});

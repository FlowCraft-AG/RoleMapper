import { GraphQLRequest } from '@apollo/server';
import { HttpStatus, type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { Agent, createServer } from 'node:https';
import { AppModule } from '../src/app.module.js';
import { nodeConfig } from '../src/config/node.js';
import { paths } from '../src/config/paths.js';

export const tokenPath = `${paths.auth}/${paths.token}`;
export const refreshPath = `${paths.auth}/${paths.refresh}`;

export const { host, port } = nodeConfig;
export type GraphQLQuery = Pick<GraphQLRequest, 'query'>;

const { httpsOptions } = nodeConfig;

// MongoDB Cloud-Verbindungs-URI
const mongoUri = process.env.TEST_MONGODB_URI as string;

// -----------------------------------------------------------------------------
// MongoDB-Verbindung prüfen
// -----------------------------------------------------------------------------
const connectToMongoDB = async () => {
    if (!mongoUri) {
        console.error('MongoDB-URI fehlt. Bitte setzen Sie die Umgebungsvariable MONGODB_URI.');
        process.exit(1);
    }

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
// Hilfsfunktion zur Ermittlung eines freien Ports
// -----------------------------------------------------------------------------
const getFreePort = async (port = 3000): Promise<number> => {
    console.info(`Versuche freien Port zu finden, starte bei ${port}...`);
    return new Promise((resolve) => {
        const server = createServer();
        server.listen(port, () => {
            server.close(() => {
                console.info(`Freier Port gefunden: ${port}`);
                resolve(port);
            });
        });
        server.on('error', () => resolve(port + 1));
    });
};

// -----------------------------------------------------------------------------
// T e s t s e r v e r   m i t   H T T P S
// -----------------------------------------------------------------------------
let server: INestApplication;
export let currentPort: number;

export const startServer = async (): Promise<INestApplication> => {
    try {
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

        currentPort = await getFreePort(port);
        await server.listen(port);
        console.info(`Server läuft unter https://${host}:${port}`);
        return server;
    } catch (error) {
        console.error('Fehler beim Starten des Servers:', error);
        process.exit(1);
    }
};

export const shutdownServer = async (): Promise<void> => {
    try {
        if (server) {
            await server.close();
            console.info('Server erfolgreich beendet.');
        }
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

// -----------------------------------------------------------------------------
// HTTPS-Agent für Tests mit selbst-signierten Zertifikaten
// -----------------------------------------------------------------------------
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions.cert as Buffer,
});
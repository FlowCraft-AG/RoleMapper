import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, type SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module.js';
import { config } from './config/app.js';
import { corsOptions } from './config/cors.js';
import { deployCamundaResources } from './config/deployment.js';
import { nodeConfig } from './config/node.js';
import { paths } from './config/paths.js';
import { helmetHandlers } from './security/http/helmet.handler.js';

/**
 * @file main.ts - Einstiegspunkt der Anwendung.
 * @description Diese Datei initialisiert die NestJS-Anwendung, konfiguriert Middleware, Sicherheitsmaßnahmen und Swagger für API-Dokumentation und startet den Server.
 */

const { zeebe } = config;
const { httpsOptions, port } = nodeConfig;

/**
 * Konfiguriert Swagger für API-Dokumentation.
 * 
 * @param app INestApplication - Die Instanz der NestJS-Anwendung.
 */
const setupSwagger = (app: INestApplication) => {
    const appConfig = new DocumentBuilder()
        .setTitle('RoleMapper')
        .setDescription('"Backend für das dynamische Rollen- und Funktionsmanagement"')
        .setVersion('2024.11.28')
        .addBearerAuth() // Fügt Unterstützung für Bearer-Token hinzu.
        .build();
    const document = SwaggerModule.createDocument(app, appConfig);
    const options: SwaggerCustomOptions = { customSiteTitle: 'SWE 24/25' }; // Titel der Swagger-Benutzeroberfläche.
    SwaggerModule.setup(paths.swagger, app, document, options);
};

/**
 * Hauptstartfunktion der Anwendung.
 * 
 * @async
 * @returns void
 */
const bootstrap = async () => {
    // Erstellt die NestJS-Anwendung mit den definierten Modulen und Konfigurationen.
    const app = await NestFactory.create(AppModule, { httpsOptions });

    // Sicherheitsmaßnahmen wie Helmet und Kompression hinzufügen.
    app.use(helmetHandlers, compression());

    // Aktiviert globale Validierungspipelines für eingehende Anfragen.
    app.useGlobalPipes(new ValidationPipe());

    // Initialisiert Swagger für API-Dokumentation.
    setupSwagger(app);

    // Aktiviert CORS mit benutzerdefinierten Optionen.
    app.enableCors(corsOptions);

    // Prüft, ob Zeebe aktiviert ist, und führt Camunda-Ressourcendeployments durch.
    if (zeebe?.enable) {
        await deployCamundaResources();
    }

    // Startet die Anwendung und hört auf dem konfigurierten Port.
    await app.listen(port);
};

// Ruft die Bootstrap-Funktion auf, um die Anwendung zu starten.
await bootstrap();

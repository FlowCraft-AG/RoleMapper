import { ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { CamundaModule } from './camunda/camunda.module.js';
import { graphQlModuleOptions } from './config/graphql.js';
import { database } from './config/mongo-database.js';
import { LoggerModule } from './logger/logger.module.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { ReadController } from './role-mapper/controller/read.controller.js';
import { WriteController } from './role-mapper/controller/write.controller.js';
import { RoleMapperModule } from './role-mapper/role-mapper.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';

/**
 * @file AppModule - Hauptmodul der Anwendung.
 * @description Diese Datei definiert das zentrale Modul der NestJS-Anwendung und konfiguriert wichtige Funktionalitäten wie Middleware, GraphQL, Datenbankverbindungen und weitere Module.
 * @module AppModule
 */

@Module({
    imports: [
        /**
         * GraphQL-Modulkonfiguration mit ApolloDriver.
         * Weitere Optionen werden in der Datei `graphql.js` definiert.
         */
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),

        /**
         * Logger-Modul, um Anwendungsprotokolle zu verwalten.
         */
        LoggerModule,

        /**
         * Keycloak-Modul für Sicherheits- und Authentifizierungsmechanismen.
         */
        KeycloakModule,

        /**
         * Mongoose-Modul zur Verbindung mit der MongoDB-Datenbank.
         */
        MongooseModule.forRoot(database.databaseUri, {
            dbName: database.databaseName,
        }),

        /**
         * RoleMapper-Modul zur Verwaltung von Rollen- und Berechtigungszuordnungen.
         */
        RoleMapperModule,

        /**
         * Zeebe-Modul für die Camunda-Zeebe-Integration.
         */
        ZeebeModule,
        CamundaModule,
    ],
})
export class AppModule implements NestModule {
    /**
     * Konfiguriert Middleware für die Anwendung.
     * 
     * @param consumer MiddlewareConsumer - Ermöglicht die Anwendung von Middleware für definierte Routen.
     */
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes(ReadController, WriteController, 'auth', 'graphql');
    }
}

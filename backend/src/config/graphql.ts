/**
 * @file
 * Modul zur Konfiguration von GraphQL in der Anwendung.
 *
 * @module GraphQLConfig
 * @description
 * Dieses Modul definiert die GraphQL-Konfiguration für die NestJS-Anwendung.
 * Es verwendet den ApolloDriver und bindet das Schema aus der `.graphql`-Datei ein.
 */

import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import path from 'node:path';
import { BASEDIR } from './app.js';

// const schemaGraphQL = path.join(BASEDIR, 'config', 'resources', 'graphql', 'schema.graphql');
// Pfad zur GraphQL-Schema-Datei
const schemaGraphQL = path.join(BASEDIR, 'config', 'resources', 'graphql', 'schema.graphql');
// console.debug('schemaGraphQL = %s', schemaGraphQL);

/**
 * Pfade zu den GraphQL-Schema-Dateien, modularisiert nach Verantwortlichkeiten.
 */
const graphqlSchemas = [
    // Camunda-Schemas
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'camunda', 'camunda.graphql'),
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'camunda', 'camunda.type.graphql'),
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'camunda', 'camunda.input.graphql'),

    // RoleMapper-Schemas
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'rolemapper', 'rolemapper.graphql'),
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'rolemapper', 'rolemapper.type.graphql'),
    path.join(BASEDIR, 'config', 'resources', 'graphql', 'rolemapper', 'rolemapper.input.graphql'),
];
// Debug-Ausgabe zur Überprüfung der geladenen Pfade
// console.debug('GraphQL-Schemas:', graphqlSchemas);

/**
 * Das Konfigurationsobjekt für GraphQL.
 *
 * @constant
 * @type {ApolloDriverConfig}
 * @property {string[]} typePaths - Ein Array von Pfaden zu den GraphQL-Schema-Dateien. 
 *                                   Hier wird die `.graphql`-Schema-Datei eingebunden.
 * @property {typeof ApolloDriver} driver - Der Treiber für die GraphQL-Integration. 
 *                                           In diesem Fall wird der ApolloDriver verwendet.
 * @property {boolean} playground - Gibt an, ob das GraphQL-Playground-Interface 
 *                                  aktiviert oder deaktiviert ist. Standardmäßig deaktiviert 
 *                                  für Produktionsumgebungen.
 *
 * @example
 * // Beispielkonfiguration für AppModule:
 * import { GraphQLModule } from '@nestjs/graphql';
 * @Module({
 *   imports: [
 *     GraphQLModule.forRoot(graphQlModuleOptions),
 *   ],
 * })
 * export class AppModule {}
 */
export const graphQlModuleOptions: ApolloDriverConfig = {
    /**
     * `typePaths` definiert die Pfade zu den GraphQL-Schema-Dateien.
     * Diese können modularisiert und in separaten Dateien organisiert werden.
     */
    typePaths: graphqlSchemas,
    // typePaths: [schemaGraphQL],

    /**
     * Alternativer GraphQL-Treiber:
     * Für bessere Performance könnte Mercurius verwendet werden, der auf Fastify basiert.
     */
    typePaths: [schemaGraphQL],
    // alternativ: Mercurius (statt Apollo) für Fastify (statt Express)
    driver: ApolloDriver,

    /**
     * Deaktiviert das Playground-Tool in der Produktionsumgebung.
     * Zum Testen kann es durch `playground: true` aktiviert werden.
     */
    playground: false,
    playground: false, // Playground deaktiviert (z. B. für Produktionsumgebungen)
};

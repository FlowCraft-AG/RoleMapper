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

// Pfad zur GraphQL-Schema-Datei
const schemaGraphQL = path.join(BASEDIR, 'config', 'resources', 'graphql', 'schema.graphql');
// console.debug('schemaGraphQL = %s', schemaGraphQL);

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
    typePaths: [schemaGraphQL],
    // alternativ: Mercurius (statt Apollo) für Fastify (statt Express)
    driver: ApolloDriver,
    playground: false, // Playground deaktiviert (z. B. für Produktionsumgebungen)
};

import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import path from 'node:path';
import { RESOURCES_DIR } from './app.js';

// const schemaGraphQL = path.join(BASEDIR, 'config', 'resources', 'graphql', 'schema.graphql');
// console.debug('schemaGraphQL = %s', schemaGraphQL);

/**
 * Pfade zu den GraphQL-Schema-Dateien, modularisiert nach Verantwortlichkeiten.
 */
const graphqlSchemas = [
    // Camunda-Schemas
    path.join(RESOURCES_DIR, 'graphql', 'camunda', 'camunda.input.graphql'),
    path.join(RESOURCES_DIR, 'graphql', 'camunda', 'camunda.type.graphql'),
    path.join(RESOURCES_DIR, 'graphql', 'camunda', 'camunda.graphql'),

    // RoleMapper-Schemas
    path.join(RESOURCES_DIR, 'graphql', 'rolemapper', 'rolemapper.input.graphql'),
    path.join(RESOURCES_DIR, 'graphql', 'rolemapper', 'rolemapper.type.graphql'),
    path.join(RESOURCES_DIR, 'graphql', 'rolemapper', 'rolemapper.graphql'),
];
// Debug-Ausgabe zur Überprüfung der geladenen Pfade
console.debug('GraphQL-Schemas:', graphqlSchemas);

/**
 * Das Konfigurationsobjekt für GraphQL (siehe src\app.module.ts).
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
    driver: ApolloDriver,

    /**
     * Deaktiviert das Playground-Tool in der Produktionsumgebung.
     * Zum Testen kann es durch `playground: true` aktiviert werden.
     */
    playground: false,

    /**
     * Aktiviert den Playground und Debug-Modus basierend auf der Umgebung.
     */
    // playground: process.env.NODE_ENV !== 'production',
    // debug: process.env.NODE_ENV !== 'production',
};

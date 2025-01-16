import type { AxiosInstance } from 'axios';
import { type GraphQLFormattedError } from 'graphql';

export type GraphQLResponseBody = {
    data?: Record<string, any> | null;
    errors?: readonly [GraphQLFormattedError];
};

/**
 * Sendet eine GraphQL-Anfrage und gibt die Antwort zurück.
 * @param client - Axios-Instance
 * @param query - GraphQL-Query
 */
export const sendGraphQLRequest = async (client: AxiosInstance, query: string) => {
    try {
        return await client.post<GraphQLResponseBody>('graphql', { query });
    } catch (error) {
        throw new Error(`GraphQL request failed: ${(error as Error).message}`);
    }
};

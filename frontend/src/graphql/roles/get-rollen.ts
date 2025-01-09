import { gql } from '@apollo/client';
/**
 * GraphQL-Abfrage, um die Rollen und zugehörigen Benutzer eines Prozesses abzurufen.
 *
 * Die Abfrage ruft die Rollen eines Prozesses ab, 
 * einschließlich der Benutzer, die den Rollen zugewiesen sind und deren Funktionen.
 *
 * @param processId -  Eindeutige ID des Prozesses, für den die Rollen abgerufen werden sollen.
 * @param userId -  ID des Benutzers, um Rolleninformationen zu filtern.
 *
 * @example
 * ```ts
 * import { GET_ROLES } from './queries';
 * 
 * // Verwendung in einem Apollo Client
 * const { data } = useQuery(GET_ROLES, {
 *   variables: { processId: "12345", userId: "user123" }
 * });
 * console.log(data.getProcessRoles.roles);
 * ```
 */

export const GET_ROLES = gql`
  query GetProcessRoles($processId: ID! $userId: String!) {
    getProcessRoles(processId: $processId, userId: $userId) {
        roles {
            roleName
            users {
                functionName
                user {
                    userId
                }
            }
        }
    }
}

`;
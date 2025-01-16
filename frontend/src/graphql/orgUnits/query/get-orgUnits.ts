import { gql } from '@apollo/client';

/**
 * GraphQL-Abfrage, um die Rollen und zugehörigen Benutzer eines Prozesses abzurufen.
 *
 * Die Abfrage ruft die Rollen eines Prozesses ab, 
 * einschließlich der Benutzer, die den Rollen zugewiesen sind und deren Funktionen.
 *
 * @param processId -  Eindeutige ID des Prozesses
 * @param userId -  ID des Benutzers. 
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

export const GET_ALL_ORG_UNITS = gql`
  query GetData {
    getData(
      input: {
        entity: ORG_UNITS
        sort: { field: name, direction: ASC }
        pagination: { limit: 0, offset: 0 }
      }
    ) {
      totalCount
      data {
        ... on OrgUnit {
          _id
          name
          parentId
          supervisor
          alias
          kostenstelleNr
          type
        }
      }
    }
  }
`;

export const GET_ORG_UNIT_BY_ID = gql`
  query GetData($id: String!) {
    getData(
      input: {
        entity: ORG_UNITS
        filter: { field: _id, operator: EQ, value: $id }
        pagination: { limit: 0, offset: 0 }
      }
    ) {
      totalCount
      data {
        ... on OrgUnit {
          _id
          name
          supervisor
        }
      }
    }
  }
`;

'use server';

import { GET_ROLES,} from '../../graphql/roles/get-rollen';
import { handleGraphQLError } from '../../utils/graphqlHandler.error';
import { getLogger } from '../../utils/logger';
import client from '../apolloClient';
import { Role } from '../../types/role.type';

// Initialisiert den Logger mit dem spezifischen Kontext 'processes.api.ts'
const logger = getLogger('role.api.ts');

/**
 * Ruft alle Rollen ab.
 * Diese Funktion führt eine Query aus, um eine Liste aller Rollen aus dem Backend zu laden
 * und gibt die Rollen in einer Map zurück, wobei der Schlüssel und der Wert jeweils `name` ist.
 *
 * @returns {Promise<Map<string, string>>} - Eine Map mit Rollen, wobei der Schlüssel und der Wert `name` sind.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchAllRoles(): Promise<Map<string, string>> {
    try {
      logger.debug('Lade alle Rollen');
  
      const { data } = await client.query({
        query: GET_ROLES,
      });
  
      const roles: Role[] = data.getData.data || [];
      const rolesMap = new Map(roles.map(role => [role.name, role.name]));
  
      return rolesMap;
    } catch (error) {
      handleGraphQLError(error, 'Fehler beim Laden der Rollen.');
    }
  }
  
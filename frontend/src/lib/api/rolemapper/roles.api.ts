'use server';

import { CREATE_PROCESS_ROLE } from '../../../graphql/rollen/mutation/create-role.mutation';
import {
  GET_ALL_ROLES,
  GET_ROLES,
} from '../../../graphql/rollen/query/get-roles';
import { ShortRole } from '../../../types/process.type';
import { RoleResult } from '../../../types/role-payload.type';
import { Role } from '../../../types/role.type';
import { handleGraphQLError } from '../../../utils/graphqlHandler.error';
import { getLogger } from '../../../utils/logger';
import getApolloClient from '../../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'user.api.ts'
const logger = getLogger('user.api.ts');
const client = getApolloClient(undefined);

export async function getRoles(
  processId: string,
  userId: string,
): Promise<RoleResult[]> {
  logger.debug('getRoles: processId=%s, userId=%s', processId, userId);

  try {
    const { data } = await client.query({
      query: GET_ROLES,
      variables: { processId, userId },
    });

    return data.getProcessRoles.roles;
  } catch (error) {
    logger.error('Fehler beim Laden der Rollen:', error);
    handleGraphQLError(error, 'Fehler beim Laden der Rollen');
  }
}

/**
 * Lädt Rollen basierend auf einer Liste von Role-IDs.
 *
 * @param {string[]} roleIds - Die IDs der Rollen, die abgefragt werden sollen.
 * @returns {Promise<Role[]>} - Eine Liste von Rollen.
 * @throws {ApolloError} - Wenn ein Fehler während der Abfrage auftritt.
 */
// export async function fetchRoles(roleIds: string[]): Promise<Role[]> {
//   try {
//     logger.debug('fetchRoles: %o', roleIds);

//     // Dynamisch den Filter basierend auf den übergebenen roleIds erstellen
//     const filters = roleIds.map((roleId) => ({
//       field: 'roleId',
//       operator: 'EQ',
//       value: roleId,
//     }));

//       logger.debug('fetchRoles: filters=%o', filters);
//     logger.debug('fetchRoles: filters=%o', filters);

//     const { data } = await client.query({
//       query: GET_ROLES_BY_PROCESS_ID,
//       variables: {
//         filter: filters,
//       },
//     });

//     logger.debug('fetchRoles: data=%o', data);
//     return data.getData.data;
//   } catch (error) {
//     logger.error('Fehler beim Laden der Rollen:', error);
//     throw new ApolloError({
//       errorMessage: 'Fehler beim Laden der Rollen',
//     });
//   }
// }

export async function fetchRoles(): Promise<Role[]> {
  try {
    const { data } = await client.query({
      query: GET_ALL_ROLES,
    });

    logger.debug('fetchRoles: data=%o', data);
    return data.getData.data;
  } catch (error) {
    logger.error('Fehler beim Laden der Rollen:', error);
    handleGraphQLError(error, 'Fehler beim Laden der Rollen');
  }
}

export async function updateProcessRole(
  id: string,
  name: string,
  roles: ShortRole[] | undefined,
  updatedRole: ShortRole,
  oldRoleId: string,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'updateProcessRole: id=%s, name=%s roles=%o updatedRole=%o',
    id,
    name,
    roles,
    updatedRole,
  );

  // Rolle ersetzen
  const updatedRoles = updateRoles(roles, oldRoleId, updatedRole);

  return await executeProcessRoleMutation(
    id,
    name,
    updatedRoles,
    'Rolle erfolgreich aktualisiert.',
  );
}

export async function addProcessRole(
  id: string,
  name: string,
  roles: ShortRole[] | undefined,
  newRole: ShortRole,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'updateProcessRole: id=%s, name=%s roles=%o updatedRole=%o',
    id,
    name,
    roles,
    newRole,
  );

  // Neue Rolle hinzufügen
  const updatedRoles = [...(roles || []), newRole];

  return await executeProcessRoleMutation(
    id,
    name,
    updatedRoles,
    'Rolle erfolgreich aktualisiert.',
  );
}

export async function removeProcessRole(
  id: string,
  name: string,
  roles: ShortRole[],
  roleToRemove: string,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'removeProcessRole: id=%s, roles=%o roleToRemove=%o',
    id,
    name,
    roles,
    roleToRemove,
  );

  // Rolle entfernen
  const updatedRoles = roles.filter((role) => role.roleId !== roleToRemove);

  return await executeProcessRoleMutation(
    id,
    '',
    updatedRoles,
    'Rolle erfolgreich entfernt.',
  );
}

/**
 * Hilfsfunktion zur Aktualisierung der Rollenliste.
 *
 * @param roles - Die aktuelle Rollenliste
 * @param oldRoleId - Die ID der zu ersetzenden Rolle
 * @param updatedRole - Die neue Rolle, die die alte ersetzen soll
 * @returns Aktualisierte Rollenliste
 */
function updateRoles(
  roles: ShortRole[] | undefined,
  oldRoleId: string,
  updatedRole: ShortRole,
): ShortRole[] {
  return (roles || []).map((role) =>
    role.roleId === oldRoleId ? updatedRole : role,
  );
}

/**
 * Hilfsfunktion zur Ausführung der GraphQL-Mutation für Prozessrollen.
 *
 * @param id - Die Prozess-ID
 * @param name - Der Name des Prozesses
 * @param roles - Die aktualisierte Rollenliste
 * @param successMessage - Die Erfolgsmeldung, die zurückgegeben wird
 * @returns Promise mit Erfolg und Nachricht
 */
async function executeProcessRoleMutation(
  id: string,
  name: string,
  roles: ShortRole[],
  successMessage: string,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'executeProcessRoleMutation: id=%s, name=%s roles=%o',
    id,
    name,
    roles,
  );
  try {
    const { data } = await client.mutate({
      mutation: CREATE_PROCESS_ROLE,
      variables: { id, name, roles },
    });

    const response = data?.updateEntity;

    if (response?.success) {
      logger.debug(
        'executeProcessRoleMutation: Erfolgreich - %s',
        response.message,
      );
      return { success: true, message: successMessage || response.message };
    } else {
      logger.warn(
        'executeProcessRoleMutation: Fehlgeschlagen - %s',
        response?.message || 'Unbekannter Fehler.',
      );
      return {
        success: false,
        message: response?.message || 'Fehler beim Aktualisieren der Rolle.',
      };
    }
  } catch (error) {
    logger.error('Fehler bei der GraphQL-Mutation:', error);
    handleGraphQLError(error, 'Fehler bei der GraphQL-Mutation');
    return {
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten.',
    };
  }
}

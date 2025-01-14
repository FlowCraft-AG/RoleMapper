'use server';

import { ApolloError } from '@apollo/client';
import { CREATE_PROCESS_ROLE } from '../../../graphql/rollen/mutation/create-role.mutation';
import { GET_ROLES_BY_PROCESS_ID } from '../../../graphql/rollen/query/get-roles';
import { ShortRole } from '../../../types/process.type';
import { Role } from '../../../types/role.type';
import { getLogger } from '../../../utils/logger';
import getApolloClient from '../../apolloClient';
import { handleGraphQLError } from '../../../utils/graphqlHandler.error';

// Initialisiert den Logger mit dem spezifischen Kontext 'user.api.ts'
const logger = getLogger('user.api.ts');
const client = getApolloClient(undefined);

/**
 * Lädt Rollen basierend auf einer Liste von Role-IDs.
 *
 * @param {string[]} roleIds - Die IDs der Rollen, die abgefragt werden sollen.
 * @returns {Promise<Role[]>} - Eine Liste von Rollen.
 * @throws {ApolloError} - Wenn ein Fehler während der Abfrage auftritt.
 */
export async function fetchRoles(roleIds: string[]): Promise<Role[]> {
  try {
    logger.debug('fetchRoles: %o', roleIds);

    // Dynamisch den Filter basierend auf den übergebenen roleIds erstellen
    const filters = roleIds.map((roleId) => ({
      field: 'roleId',
      operator: 'EQ',
      value: roleId,
    }));
    logger.debug('fetchRoles: filters=%o', filters);

    const { data } = await client.query({
      query: GET_ROLES_BY_PROCESS_ID,
      variables: {
        filter: filters,
      },
    });

    logger.debug('fetchRoles: data=%o', data);
    return data.getData.data;
  } catch (error) {
    logger.error('Fehler beim Laden der Rollen:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Laden der Rollen',
    });
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
  const updatedRoles = (roles || []).map((role) =>
    role.roleId === oldRoleId ? updatedRole : role,
  );

  return await executeProcessRoleMutation(
    id,
    name,
    updatedRoles,
    'Rolle erfolgreich aktualisiert.',
  );
}

export async function addProcessRole(
  id: string,
  roles: ShortRole[],
  newRole: ShortRole,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'addProcessRole: id=%s, roles=%o newRole=%o',
    id,
    roles,
    newRole,
  );

  // Neue Rolle hinzufügen
  const updatedRoles = [...roles, newRole];

  return await executeProcessRoleMutation(
    id,
    '',
    updatedRoles,
    'Rolle erfolgreich hinzugefügt.',
  );
}

export async function removeProcessRole(
  id: string,
  roles: ShortRole[],
  roleToRemove: string,
): Promise<{ success: boolean; message: string }> {
  logger.debug(
    'removeProcessRole: id=%s, roles=%o roleToRemove=%o',
    id,
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
    logger.debug('executeProcessRoleMutation: id=%s, name=%s roles=%o', id, name, roles);
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
  }
}

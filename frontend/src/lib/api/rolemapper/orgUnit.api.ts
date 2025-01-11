'use server';

import { CREATE_ORG_UNIT } from '../../../graphql/orgUnits/mutation/create-org-unit';
import { DELETE_ORG_UNIT } from '../../../graphql/orgUnits/mutation/delete-org-unit';
import { UPDATE_ORG_UNIT } from '../../../graphql/orgUnits/mutation/org-unit.mutation';
import {
  GET_ALL_ORG_UNITS,
  GET_ORG_UNIT_BY_ID,
  GET_ORG_UNITS_SHORT,
} from '../../../graphql/orgUnits/query/get-orgUnits';
import { OrgUnit, ShortOrgUnit } from '../../../types/orgUnit.type';
import { handleGraphQLError } from '../../../utils/graphqlHandler.error';
import { getLogger } from '../../../utils/logger';
import client from '../../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'orgUnit.api.ts'
const logger = getLogger('orgUnit.api.ts');

/**
 * Ruft alle Organisationseinheiten ab.
 * Diese Funktion führt eine Query aus, um eine Liste aller Organisationseinheiten aus dem Backend zu laden.
 *
 * @returns {Promise<OrgUnit[]>} - Eine Liste von Organisationseinheiten.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchAllOrgUnits(): Promise<OrgUnit[]> {
  try {
    logger.debug('Lade alle Organisationseinheiten');

    // Query zum Abrufen aller Organisationseinheiten
    const { data } = await client.query({
      query: GET_ALL_ORG_UNITS,
    });

    const result = data.getData.data || [];
    logger.debug('fetchAllOrgUnits: orgUnits=%o', result);
    return result;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Organisationseinheiten.');
  }
}

/**
 * Ruft eine Organisationseinheit anhand ihrer ID ab.
 *
 * @param {string} orgUnitId - Die ID der Organisationseinheit.
 * @returns {Promise<OrgUnit>} - Die Organisationseinheit.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function getOrgUnitById(orgUnitId: string): Promise<OrgUnit> {
  try {
    logger.debug('Lade Organisationseinheit mit ID: %o', orgUnitId);

    const { data } = await client.query({
      query: GET_ORG_UNIT_BY_ID,
      variables: { id: orgUnitId },
    });

    return data.getData.data[0]; // Rückgabe der Organisationseinheit
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Organisationseinheit.');
  }
}

/**
 * Erstellt eine neue Organisationseinheit.
 *
 * @param {string} name - Der Name der Organisationseinheit.
 * @param {string | undefined} supervisor - Der Supervisor der Organisationseinheit.
 * @param {string} parentId - Die ID der übergeordneten Organisationseinheit.
 * @returns {Promise<OrgUnit[]>} - Die aktualisierte Liste der Organisationseinheiten.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function createOrgUnit(
  name: string,
  supervisor: string | undefined,
  parentId: string,
): Promise<OrgUnit[]> {
  try {
    logger.debug('Erstelle neue Organisationseinheit: %o', {
      name,
      supervisor,
      parentId,
    });

    await client.mutate({
      mutation: CREATE_ORG_UNIT,
      variables: { name, supervisor, parentId },
      refetchQueries: [{ query: GET_ALL_ORG_UNITS }],
      awaitRefetchQueries: true,
    });

    return await fetchAllOrgUnits();
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Erstellen der Organisationseinheit.',
    );
  }
}

/**
 * Aktualisiert eine bestehende Organisationseinheit.
 *
 * @param {string} orgUnitId - Die ID der Organisationseinheit.
 * @param {string} name - Der neue Name der Organisationseinheit.
 * @param {string | undefined} supervisor - Der neue Supervisor der Organisationseinheit.
 * @returns {Promise<OrgUnit[]>} - Die aktualisierte Liste der Organisationseinheiten.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function updateOrgUnit(
  orgUnitId: string,
  name: string,
  supervisor: string | undefined,
): Promise<OrgUnit[]> {
  try {
    logger.debug('Aktualisiere Organisationseinheit: %o', {
      orgUnitId,
      name,
      supervisor,
    });

    await client.mutate({
      mutation: UPDATE_ORG_UNIT,
      variables: { id: orgUnitId, name, supervisor },
      refetchQueries: [{ query: GET_ALL_ORG_UNITS }],
      awaitRefetchQueries: true,
    });

    return await fetchAllOrgUnits();
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Bearbeiten der Organisationseinheit.',
    );
  }
}

/**
 * Löscht eine Organisationseinheit.
 *
 * @param {string} orgUnitId - Die ID der Organisationseinheit, die gelöscht werden soll.
 * @returns {Promise<OrgUnit[]>} - Die aktualisierte Liste der Organisationseinheiten.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function removeOrgUnit(orgUnitId: string): Promise<OrgUnit[]> {
  try {
    logger.debug('Lösche Organisationseinheit mit ID: %o', orgUnitId);

    await client.mutate({
      mutation: DELETE_ORG_UNIT,
      variables: { value: orgUnitId },
      refetchQueries: [{ query: GET_ALL_ORG_UNITS }],
      awaitRefetchQueries: true,
    });

    return await fetchAllOrgUnits();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Löschen der Organisationseinheit.');
  }
}

/**
 * Ruft die IDs aller Organisationseinheiten ab.
 *
 * @returns {Promise<ShortOrgUnit[]>} - Eine Liste von IDs und Namen der Organisationseinheiten.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchOrgUnitsIds(): Promise<ShortOrgUnit[]> {
  try {
    logger.debug('Lade IDs aller Organisationseinheiten');

    const { data } = await client.query({
      query: GET_ORG_UNITS_SHORT,
    });

    return data.getData.data;
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Laden der Organisationseinheiten-IDs.',
    );
  }
}

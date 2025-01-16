'use server';

import { ApolloError } from '@apollo/client';
import {
  GET_ALL_USERS_SHORT,
  GET_MEMBERS_BY_ALIAS_OR_COST_CENTER,
  GET_USER_BY_USER_ID,
  GET_USERS_BY_TYPE_EMPLOYEE,
} from '../../../graphql/users/query/get-users';
import { ShortUser, User } from '../../../types/user.type';
import { getLogger } from '../../../utils/logger';
import getApolloClient from '../../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'user.api.ts'
const logger = getLogger('user.api.ts');
const client = getApolloClient(undefined);
/**
 * Ruft Mitglieder aus dem Backend ab.
 * Diese Funktion führt eine GraphQL-Abfrage aus, um eine Liste von Mitgliedern basierend
 * auf den bereitgestellten Parametern abzurufen.
 *
 * @param {string | undefined} alias - Alias des Mitglieds, optional (kann `undefined` sein).
 * @param {string | undefined} kostenstelleNr - Kostenstellen-Nummer des Mitglieds, optional (kann `undefined` sein).
 * @returns {Promise<User[]>} - Eine Promise, die ein Array von Benutzern (Mitgliedern) zurückgibt.
 * @throws {ApolloError} - Wird geworfen, wenn die Abfrage fehlschlägt und die Ursache GraphQL-bezogen ist.
 * @throws {Error} - Wird geworfen, wenn ein allgemeiner Fehler auftritt.
 */
export async function fetchMitglieder(
  alias: string | undefined,
  kostenstelleNr: string | undefined,
): Promise<User[]> {
  try {
    logger.debug(
      'Lade Mitglieder mit Alias: %o und Kostenstelle: %o',
      alias,
      kostenstelleNr,
    );

    const { data } = await client.query({
      query: GET_MEMBERS_BY_ALIAS_OR_COST_CENTER,
      variables: { alias, kostenstelleNr },
    });

    return data.getData.data;
  } catch (error) {
    logger.error('Fehler beim Laden der Mitglieder:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Laden der Mitglieder',
    });
  }
}

/**
 * Ruft eine Liste aller Mitarbeiter (Employees) aus dem Backend ab.
 * Diese Funktion führt eine GraphQL-Abfrage aus, um alle Mitarbeiterinformationen abzurufen.
 *
 * @returns {Promise<ShortUser[]>} - Eine Promise, die ein Array von Benutzeranmeldedaten zurückgibt.
 * @throws {ApolloError} - Wird geworfen, wenn die Abfrage fehlschlägt.
 */
export async function fetchEmployees(field: string): Promise<ShortUser[]> {
  logger.debug('Lade alle Mitarbeiter es wird nach %o sortiert', field);
  try {
    logger.debug('Lade alle Mitarbeiter');

    const { data } = await client.query({
      query: GET_USERS_BY_TYPE_EMPLOYEE,
      variables: { field },
    });

    return data.getData.data as ShortUser[];
  } catch (error) {
    logger.error('Fehler beim Laden der Mitarbeiter:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Laden der Mitarbeiter',
    });
  }
}

/**
 * Ruft die Benutzer-IDs aus dem Backend ab.
 *
 * @returns {Promise<ShortUser[]>} - Eine Promise, die ein Array von Benutzer-IDs zurückgibt.
 * @throws {ApolloError} - Wird geworfen, wenn die GraphQL-Abfrage fehlschlägt.
 */
export async function fetchUserIds(field: string): Promise<ShortUser[]> {
  try {
    logger.debug('Lade Benutzer-IDs');

    const { data } = await client.query({
      query: GET_ALL_USERS_SHORT,
      variables: { field },
    });

    return data.getData.data as ShortUser[];
  } catch (error) {
    logger.error('Fehler beim Laden der Benutzer-IDs:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Laden der Benutzer-IDs',
    });
  }
}

/**
 * Ruft die Details eines Benutzers anhand der Benutzer-ID ab.
 *
 * @param {string} userId - Die ID des Benutzers, dessen Details abgerufen werden sollen.
 * @returns {Promise<User>} - Die Details des Benutzers.
 * @throws {ApolloError} - Wird geworfen, wenn die GraphQL-Abfrage fehlschlägt.
 */
export async function fetchUserDetails(userId: string): Promise<User> {
  try {
    logger.debug('Lade Benutzerdetails für Benutzer-ID: %o', userId);

    const { data } = await client.query({
      query: GET_USER_BY_USER_ID,
      variables: { userId },
    });

    return data.getData.data[0]; // Annahme: Die Datenstruktur enthält die Details im ersten Eintrag
  } catch (error) {
    logger.error('Fehler beim Abrufen der Benutzerdetails:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Abrufen der Benutzerdetails',
    });
  }
}

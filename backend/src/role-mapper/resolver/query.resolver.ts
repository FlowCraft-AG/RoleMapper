/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import { NotFoundException, UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { EntityType } from '../model/entity/entities.entity.js';
import { Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit } from '../model/entity/org-unit.entity.js';
import { User } from '../model/entity/user.entity.js';
import { DataInput } from '../model/input/data.input.js';
import { GetRolesInput } from '../model/input/get-roles.input';
import { DataPayload } from '../model/payload/data.payload.js';
import { GetUsersByFunctionResult } from '../model/payload/kp.payload.js';
import { MandatePayload } from '../model/payload/mandate.payload.js';
import { RolePayload } from '../model/payload/role-payload.type.js';
import { ReadService } from '../service/read.service.js';
import { HttpExceptionFilter } from '../utils/http-exception.filter.js';

/**
 * Resolver für die `RoleMapper`-Entität, der GraphQL-Abfragen verarbeitet und die entsprechenden Daten
 * vom `ReadService` an den Client zurückgibt.
 *
 * Verwendet Filter und Interceptoren für Fehlerbehandlung und Zeitprotokollierung.
 */
@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter) // Fehlerbehandlung über HttpExceptionFilter
@UseInterceptors(ResponseTimeInterceptor) // Interceptor für Antwortzeitmessung
export class QueryResolver {
    readonly #service: ReadService; // Service, der für die Datenabfragen zuständig ist
    readonly #logger = getLogger(QueryResolver.name); // Logger für den Resolver

    /**
     * Konstruktor für den QueryResolver, der den ReadService injiziert.
     *
     * @param service - Der Service, der für die Datenabfragen zuständig ist.
     */
    constructor(service: ReadService) {
        this.#service = service;
    }

    /**
     * Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
     *
     * Diese Methode ruft die `findProcessRoles`-Methode des `ReadService` auf, um die Rollen
     * eines bestimmten Prozesses sowie die zugehörigen Benutzer abzurufen.
     *
     * @param {GetRolesInput} input - Die Eingabedaten für die Abfrage (enthält `processId` und `userId`).
     * @returns {Promise<RolePayload>} Ein Promise mit den Rollen des Prozesses und den zugeordneten Benutzern.
     * @throws {NotFoundException} Wird ausgelöst, wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     *
     * @example
     * ```typescript
     * const result = await getRole({ processId: '12345', userId: 'user678' });
     * console.log(result.roles); // Gibt die Rollen und Benutzer aus.
     * ```
     */
    @Query('getProcessRoles')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getRole(
        @Args() input: GetRolesInput, // Verwende `Args` mit dem Typ `GetRolesInput`
    ): Promise<RolePayload> {
        const { processId, userId } = input; // Destrukturiere die Eingabe
        this.#logger.debug(`getRole: processId=${processId}, userId=${userId}`);
        return this.#service.findProcessRoles(processId, userId); // Aufruf der Service-Methode
    }

    /**
     * Führt eine dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern aus.
     *
     * Diese Methode verwendet das `ReadService`, um Entitätsdaten basierend auf den angegebenen
     * Filtern, Paginierungs- und Sortierkriterien abzufragen. Sie unterstützt die flexible Abfrage von
     * verschiedenen Entitäten wie Benutzer, Prozesse, Rollen usw.
     *
     * @param {DataInput} input - Die Eingabedaten, die die zugehörige Entität, Filterkriterien,
     *                            Paginierungsparameter und Sortieroptionen enthalten.
     * @returns {Promise<DataPayload>} Ein Promise, das die abgefragten Daten und die Gesamtanzahl der Datensätze zurückgibt.
     * @throws {BadRequestException} Wird ausgelöst, wenn die angeforderte Entität nicht unterstützt wird.
     *
     * @example
     * ```typescript
     * const result = await getEntityData({
     *     entity: 'User',
     *     filter: { active: true },
     *     pagination: { page: 1, pageSize: 10 },
     *     sort: { field: 'name', direction: 'asc' },
     * });
     * console.log(result.data); // Gibt die gefilterten Benutzer zurück
     * console.log(result.totalCount); // Gibt die Gesamtanzahl der Benutzer zurück
     * ```
     */
    @Query('getData')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getEntityData(
        @Args('input') input: DataInput, // Eingabedaten, die die Entität, Filter und Paginierung enthalten
    ): Promise<DataPayload> {
        this.#logger.debug('getEntityData: input=%o', input);

        const { entity, filter, pagination, sort } = input; // Extrahiere Eingabewerte

        // Abruf der Rohdaten mit den angegebenen Filtern und Paginierung
        const data: EntityType[] = await this.#service.findData(entity, filter, pagination, sort);
        if (data === undefined || data.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                data: [],
                totalCount: 0,
            };
        }
        const result: DataPayload = { data, totalCount: data.length };
        this.#logger.debug('getEntityData: result=%o', result);

        // Rückgabe der strukturierten Daten mit Paginierung und Gesamtzahl
        return result;
    }

    /**
     * Führt eine Abfrage aus, um gespeicherte Daten zu einem Mandat abzurufen.
     *
     * Diese Methode ruft die `executeSavedQuery`-Methode des Services auf, um die Mandatsdaten
     * basierend auf der angegebenen ID abzurufen. Die zurückgegebene Nutzlast enthält Details
     * wie Benutzer, Funktion und Organisations-Einheit.
     *
     * @param {string} id - Die eindeutige ID, die die gespeicherten Daten identifiziert.
     * @returns {Promise<MandatePayload>} Ein Promise, das die Nutzlast mit den abgerufenen Mandatsdaten zurückgibt.
     *
     * @throws {NotFoundException} Wird ausgelöst, wenn keine Daten zu der angegebenen ID gefunden werden.
     *
     * @example
     * ```typescript
     * const mandate = await getSavedData('64b1f768d9a8e900001b1b2f');
     * console.log(mandate.users); // Gibt die Benutzer zurück, die mit dem Mandat verknüpft sind.
     * console.log(mandate.functionName); // Gibt den Namen der zugehörigen Funktion zurück.
     * ```
     */
    @Public()
    @Query('getSavedData')
    async getSavedData(@Args('id') id: string): Promise<MandatePayload> {
        this.#logger.debug('getSavedData: id=%s', id);

        // Abrufen der gespeicherten Daten basierend auf der Abfrage-ID
        const { savedQuery, data } = await this.#service.executeSavedQuery(id);

        if (!savedQuery || !data) {
            this.#logger.warn('Keine gespeicherten Daten für ID=%s gefunden', id);
            throw new NotFoundException(`Keine gespeicherten Daten für ID ${id} gefunden`);
        }

        const { functionName, orgUnit, isImpliciteFunction } = savedQuery as Mandates;
        const users = data as User[];

        return {
            functionName,
            users,
            isImpliciteFunction,
            orgUnit,
            _id: new Types.ObjectId(id),
        };
    }

    /**
     * Führt eine Abfrage aus, um Benutzer basierend auf einer Funktion abzurufen.
     *
     * Diese Methode ruft die `findUsersByFunction`-Methode des Services auf, um die Benutzer,
     * die einer bestimmten Funktion zugeordnet sind, sowie weitere relevante Informationen abzurufen.
     *
     * @param {string} id - Die eindeutige ID der Funktion, für die die Benutzer abgerufen werden sollen.
     * @returns {Promise<GetUsersByFunctionResult>} Ein Promise, das die Nutzlast mit den abgerufenen Benutzerdaten zurückgibt.
     *
     * @example
     * ```typescript
     * const result = await getUsersByFunction('64b1f768d9a8e900001b1b2f');
     * console.log(result.functionName); // Gibt den Namen der Funktion zurück.
     * console.log(result.users); // Gibt die Benutzer zurück, die der Funktion zugeordnet sind.
     * ```
     */
    @Public()
    @Query('getUsersByFunction')
    async getUsersByFunction(@Args('id') id: string): Promise<GetUsersByFunctionResult> {
        this.#logger.debug('getUsersByFunction: id=%s', id);

        const result = await this.#service.findUsersByFunction(id);

        if (!result) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                functionName: '',
                users: [],
                isImpliciteFunction: false,
            };
        }

        const { functionName, users, isImpliciteFunction, orgUnit } = result;
        return { functionName, users, isImpliciteFunction, orgUnit };
    }

    /**
     * Führt eine Abfrage aus, um alle übergeordneten Organisationseinheiten basierend auf einer ID abzurufen.
     *
     * Diese Methode ruft die `findAncestors`-Methode des Services auf, um die Hierarchie
     * der übergeordneten Organisationseinheiten zu ermitteln.
     *
     * @param {Types.ObjectId} id - Die eindeutige ID der Organisationseinheit, deren Vorfahren abgerufen werden sollen.
     * @returns {Promise<OrgUnit[]>} Ein Promise, das die Liste der übergeordneten Organisationseinheiten zurückgibt.
     *
     * @example
     * ```typescript
     * const ancestors = await getAncestors(new Types.ObjectId('64b1f768d9a8e900001b1b2f'));
     * console.log(ancestors); // Gibt die Liste der übergeordneten Organisationseinheiten aus.
     * ```
     */
    @Public()
    @Query('getAncestors')
    async getAncestors(@Args('id') id: Types.ObjectId): Promise<OrgUnit[]> {
        this.#logger.debug('getAncestors: id=%s', id);

        const ancestors = await this.#service.findAncestors(id);
        this.#logger.debug('getAncestors: Ancestors:', ancestors);
        return ancestors;
    }
}

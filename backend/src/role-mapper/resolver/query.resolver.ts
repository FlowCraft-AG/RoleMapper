/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { OrgUnit } from '../model/entity/org-unit.entity.js';
import { User } from '../model/entity/user.entity.js';
import { DataInput } from '../model/input/data.input.js';
import { GetRolesInput } from '../model/input/get-roles.input';
import { GetUsersByFunctionResult } from '../model/payload/kp.payload.js';
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
     * Filtern und der Paginierung abzufragen. Sie unterstützt die flexible Abfrage von
     * verschiedenen Entitäten wie Benutzer, Prozesse, Rollen usw.
     *
     * @param {DataInput<T>} input - Die Eingabedaten, die die Entität, Filter und Paginierung enthalten.
     * @returns {Promise<DataPayload>} - Die gefilterten und paginierten Daten.
     * @throws {BadRequestException} - Wenn die angeforderte Entität nicht unterstützt wird.
     */
    @Query('getData')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getEntityData(
        @Args('input') input: DataInput, // Eingabedaten, die die Entität, Filter und Paginierung enthalten
    ): Promise<any> {
        this.#logger.debug('getEntityData: input=%o', input);

        const { entity, filter, pagination, sort } = input; // Extrahiere Eingabewerte

        // Abruf der Rohdaten mit den angegebenen Filtern und Paginierung
        const data = await this.#service.findData(entity, filter, pagination, sort);
        if (data === undefined || data.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                data: [],
                totalCount: 0,
            };
        }

        this.#logger.debug('getEntityData: data=%o', data);

        // Rückgabe der strukturierten Daten mit Paginierung und Gesamtzahl
        return {
            data, // Typumwandlung
            totalCount: data.length,
        };
    }

    @Public()
    @Query('getSavedData')
    async getSavedData(@Args('id') id: string): Promise<any> {
        this.#logger.debug('getSavedData: id=%s', id);

        // Hole die gespeicherten Daten, basierend auf der Abfrage-ID
        const { functionName, data } = await this.#service.executeSavedQuery(id);

        // Stelle sicher, dass die Daten den Typ User haben und extrahiere die userId
        // const users = data.map((user) => {
        //     const userTyped = user as User; // Typisiere das user-Objekt als User
        //     return userTyped.userId; // Extrahiere userId
        // });
        const users = data as User[];
        return { functionName, users };
    }

    @Public()
    @Query('getUsersByFunction')
    async getUsersByFunction(@Args('id') id: string): Promise<GetUsersByFunctionResult> {
        this.#logger.debug('getUsersByFunction: id=%s', id);

        const result = await this.#service.findUsersByFunction(id);

        if (result === undefined) {
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

    @Public()
    @Query('getAncestors')
    async getAncestors(@Args('id') id: Types.ObjectId): Promise<OrgUnit[]> {
        this.#logger.debug('getAncestors: id=%s', id);

        const ancestors = await this.#service.findAncestors(id);
        this.#logger.debug('getAncestors: Ancestors:', ancestors);
        return ancestors;
    }
}

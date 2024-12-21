/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/indent */
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { User } from '../model/entity/user.entity.js';
import { DataInput } from '../model/input/data.input.js';
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
     * Diese Methode ruft die Methode `findProcessRoles` des `ReadService` auf, um die Rollen
     * eines bestimmten Prozesses und die zugehörigen Benutzer zu erhalten.
     *
     * @param {string} processId - Die ID des Prozesses.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt.
     * @returns {Promise<any>} - Die Rollen des Prozesses.
     * @throws {NotFoundException} - Wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     */
    @Query('getProcessRoles')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getRole(
        @Args('processId') processId: string, // Prozess-ID aus den GraphQL-Argumenten
        @Args('userId') userId: string, // Benutzer-ID aus den GraphQL-Argumenten
    ): Promise<any> {
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
        const rawData = await this.#service.findData(entity, filter, pagination, sort);
        if (rawData === undefined || rawData.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                data: [],
                totalCount: 0,
            };
        }

        // Anwendung der Paginierung, wenn angegeben
        const paginatedData = pagination
            ? rawData.slice(
                  (pagination.offset ?? 0) || 0,
                  ((pagination.offset ?? 0) || 0) + (pagination.limit ?? 0),
              )
            : rawData;

        this.#logger.debug('getEntityData: data=%o', paginatedData);

        // Rückgabe der strukturierten Daten mit Paginierung und Gesamtzahl
        return {
            data: paginatedData, // Typumwandlung
            totalCount: rawData.length,
        };
    }

    @Public()
    @Query('getSavedData')
    async getSavedData(@Args('id') id: string): Promise<any> {
        this.#logger.debug('getSavedData: id=%s', id);

        // Hole die gespeicherten Daten, basierend auf der Abfrage-ID
        const { functionName, data } = await this.#service.executeSavedQuery(id);

        // Stelle sicher, dass die Daten den Typ User haben und extrahiere die userId
        const users = data.map((user) => {
            const userTyped = user as User; // Typisiere das user-Objekt als User
            return userTyped.userId; // Extrahiere userId
        });
        this.#logger.debug('Users %o:', users);
        return { functionName, users };
    }
}

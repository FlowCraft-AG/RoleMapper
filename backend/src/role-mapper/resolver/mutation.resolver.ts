/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { CreateEntityInput } from '../model/dto/create.dto.js';
import { DeleteEntityInput } from '../model/dto/delete.dto.js';
import { UpdateEntityInput } from '../model/dto/update.dto.js';
import { Mandates } from '../model/entity/mandates.entity.js';
import { UserFunctionInput } from '../model/input/add-user.input.js';
import { CreateDataInput } from '../model/input/create.input.js';
import { SaveQueryInput } from '../model/input/save-query.input.js';
import { UpdateDataInput } from '../model/input/update.input.js';
import { MutationPayload } from '../model/payload/mutation.payload.js';
import { SavedQueryPayload } from '../model/payload/saved-query.payload.js';
import { WriteService } from '../service/write.service.js';
import { DUPLICATE_KEY_ERROR_CODE } from '../utils/konstanten.js';

/**
 * Resolver für Mutationsoperationen.
 *
 * Dieser Resolver definiert verschiedene Mutationsmethoden zum Erstellen, Aktualisieren,
 * Löschen und Verwalten von Entitäten sowie zur Verwaltung benutzerdefinierter Abfragen.
 */
@Resolver()
@Injectable()
export class MutationResolver {
    readonly #logger = getLogger(MutationResolver.name);
    readonly #service: WriteService;
    constructor(service: WriteService) {
        this.#service = service;
    }

    /**
     * Erstellt eine neue Entität in der Datenbank.
     *
     * Diese Methode akzeptiert Eingabedaten für verschiedene Entitätstypen wie Benutzer, Funktionen,
     * Prozesse, Organisationseinheiten und Rollen. Basierend auf der Entitätsart werden die
     * entsprechenden Daten validiert und zur Erstellung an den Service weitergeleitet.
     *
     * @param {CreateEntityInput} input - Die Eingabedaten für die zu erstellende Entität, einschließlich
     * des Entitätstyps und der spezifischen Daten.
     * @returns {Promise<MutationPayload>} Das Ergebnis der Operation mit einem Erfolgsstatus, einer Nachricht
     * und den erstellten Daten.
     *
     * @throws {ConflictException} Wenn ein Duplikatfehler auftritt, z. B. wenn eine Entität mit denselben Eigenschaften
     * bereits existiert.
     * @throws {BadRequestException} Wenn die Eingabedaten nicht den Validierungsanforderungen entsprechen.
     * @throws {Error} Für allgemeine Fehler oder wenn der Entitätstyp `USERS` noch nicht implementiert ist.
     *
     * @example
     * ```typescript
     * const input: CreateEntityInput = {
     *   entity: 'ORG_UNITS',
     *   orgUnitData: { name: 'IT-Abteilung', parentId: '64b1f768d9a8e900001b1b2f' },
     * };
     * const result = await createEntity(input);
     * console.log(result.success); // true
     * console.log(result.message); // 'Create operation successful.'
     * ```
     */
    @Mutation('createEntity')
    @Public()
    async createEntity(@Args('input') input: CreateEntityInput): Promise<MutationPayload> {
        this.#logger.debug('createEntity: input=%o', input);
        const { entity, userData, functionData, processData, orgUnitData, roleData } = input;

        try {
            // Map zur Zuordnung von Entitäten zu den jeweiligen Daten
            const entityDataMap: Record<string, CreateDataInput | undefined> = {
                USERS: userData,
                MANDATES: functionData,
                PROCESSES: processData,
                ORG_UNITS: orgUnitData,
                ROLES: roleData,
            };

            const data = entityDataMap[entity];

            // Eingabevalidierung
            if (!entity) throw new Error('Entity type must be provided');
            if (!data) throw new Error(`Missing data for entity type: ${entity}`);

            // Aufruf des Services zur Entitätserstellung
            const result = await this.#service.createEntity(entity, data);

            // Rückgabe des Ergebnisses
            return {
                success: true,
                message: `Create operation successful.`,
                result,
            };
        } catch (error) {
            this.#logger.error('createEntity: Error occurred: %o', error);

            // Dynamische Fehlermeldungen basierend auf der Entity
            let errorMessage = 'An error occurred during the operation.';

            // Spezifische Nachrichten für Duplikatfehler
            if (error instanceof Error && (error as any).code === DUPLICATE_KEY_ERROR_CODE) {
                switch (entity) {
                    case 'MANDATES': {
                        errorMessage = `Die Funktion "${functionData?.functionName}" existiert bereits oder konnte nicht erstellt werden.`;
                        break;
                    }
                    case 'PROCESSES': {
                        errorMessage = `Der Prozess "${processData?.name}" existiert bereits.`;
                        break;
                    }
                    case 'ORG_UNITS': {
                        errorMessage = `Die Organisationseinheit "${orgUnitData?.name}" existiert bereits.`;
                        break;
                    }
                    case 'ROLES': {
                        errorMessage = `Die Rolle "${roleData?.roleId}" existiert bereits.`;
                        break;
                    }
                    case 'USERS': {
                        throw new Error('Not implemented yet: "USERS" case');
                    }
                }
                throw new ConflictException(errorMessage);
            }

            // Behandlung anderer spezifischer Fehler
            if ((error as any).name === 'ValidationError') {
                throw new BadRequestException((error as Error).message); // Gibt die Validierungsfehlermeldung zurück
            }

            // Allgemeine Fehlerbehandlung
            if (error instanceof Error) {
                errorMessage = `${errorMessage} Technische Details: ${error.message}`;
            }

            return {
                success: false,
                message: errorMessage,
                result: undefined,
            };
        }
    }

    /**
     * Aktualisiert eine bestehende Entität in der Datenbank.
     *
     * Diese Methode akzeptiert Eingabedaten für verschiedene Entitätstypen wie Benutzer, Funktionen,
     * Prozesse, Organisationseinheiten und Rollen.Basierend auf der Entitätsart und den bereitgestellten
     * Filtern werden die entsprechenden Daten aktualisiert.
     *
     * @param { UpdateEntityInput } input - Die Eingabedaten für die Aktualisierung, einschließlich
     * des Entitätstyps, der Filter und der spezifischen Aktualisierungsdaten.
     * @returns { Promise<MutationPayload> } Das Ergebnis der Operation mit Erfolgsstatus, Nachricht
     * und der Anzahl der betroffenen Dokumente.
     *
     * @throws { Error } Wenn der Entitätstyp oder die Daten fehlen.
     * @throws { BadRequestException } Wenn die Aktualisierung aufgrund von Validierungsfehlern fehlschlägt.
     *
     * @example
     * ```typescript
     * const input: UpdateEntityInput = {
     *   entity: 'ORG_UNITS',
     *   filter: { field: 'name', operator: 'EQ', value: 'IT-Abteilung' },
     *   orgUnitData: { parentId: '64b1f768d9a8e900001b1b2f' },
     * };
     * const result = await updateEntity(input);
     * console.log(result.success); // true
     * console.log(result.message); // 'Update operation successful.'
     * console.log(result.affectedCount); // 1
     * ```
     */
    @Public()
    @Mutation('updateEntity')
    async updateEntity(@Args('input') input: UpdateEntityInput): Promise<MutationPayload> {
        this.#logger.debug('updateEntity: input=%o', input);
        const { entity, filter, userData, functionData, processData, orgUnitData, roleData } =
            input;
        try {
            // Map zur Zuordnung von Entitäten zu den jeweiligen Daten
            const entityDataMap: Record<string, UpdateDataInput | undefined> = {
                USERS: userData,
                MANDATES: functionData,
                PROCESSES: processData,
                ORG_UNITS: orgUnitData,
                ROLES: roleData,
            };

            const data = entityDataMap[entity];

            // Validierung der Eingabe
            if (!entity) throw new Error('Entity type must be provided');
            if (!data) throw new Error(`Missing data for entity type: ${entity}`);

            // Aufruf des Services zur Aktualisierung der Entität
            const result = await this.#service.updateEntity(entity, filter, data);

            return {
                success: result.success,
                message: result.message,
                affectedCount: result.modifiedCount,
            };
        } catch (error) {
            this.#logger.error('updateEntity: Error occurred: %o', error);

            // Rückgabe bei Fehlern
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Löscht eine bestehende Entität aus der Datenbank.
     *
     * Diese Methode löscht Entitäten basierend auf dem bereitgestellten Entitätstyp und den
     * spezifischen Filtern. Der Service übernimmt die Ausführung der Löschoperation.
     *
     * @param {DeleteEntityInput} input - Die Eingabedaten für die Löschoperation, einschließlich
     * des Entitätstyps und der Filterkriterien.
     * @returns {Promise<MutationPayload>} Das Ergebnis der Operation, einschließlich Erfolgsstatus,
     * Nachricht und der Anzahl der gelöschten Dokumente.
     *
     * @throws {Error} Wenn die Löschoperation fehlschlägt.
     *
     * @example
     * ```typescript
     * const input: DeleteEntityInput = {
     *   entity: 'ORG_UNITS',
     *   filter: { field: 'name', operator: 'EQ', value: 'IT-Abteilung' },
     * };
     * const result = await deleteEntity(input);
     * console.log(result.success); // true
     * console.log(result.message); // 'Delete operation successful.'
     * console.log(result.affectedCount); // 1
     * ```
     */
    @Public()
    @Mutation('deleteEntity')
    async deleteEntity(@Args('input') input: DeleteEntityInput): Promise<MutationPayload> {
        this.#logger.debug('deleteEntity: input=%o', input);
        const { entity, filter } = input;

        try {
            // Aufruf des Services zur Löschung der Entität
            const result = await this.#service.deleteEntity(entity, filter);

            return {
                success: result.success,
                message: result.message || 'Delete operation successful.',
                affectedCount: result.deletedCount,
            };
        } catch (error) {
            this.#logger.error('deleteEntity: Error occurred: %o', error);

            // Rückgabe im Fehlerfall
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Fügt einen Benutzer zu einer Funktion hinzu.
     *
     * Diese Mutation aktualisiert eine vorhandene Funktion, indem sie den angegebenen Benutzer
     * hinzufügt. Die Funktion wird dabei eindeutig durch ihre ID identifiziert.
     *
     * @param {UserFunctionInput} input - Die Eingabedaten, bestehend aus der ID der Funktion
     * (`functionId`) und der ID des Benutzers (`userId`).
     * @returns {Promise<Mandates>} Die aktualisierte Funktion nach Hinzufügen des Benutzers.
     *
     * @throws {Error} Wenn die Aktualisierung fehlschlägt oder die Eingabedaten ungültig sind.
     *
     * @example
     * ```typescript
     * const input: UserFunctionInput = {
     *   functionId: '64b1f768d9a8e900001b1b2f',
     *   userId: '12345',
     * };
     * const updatedFunction = await addUserToRole(input);
     * console.log(updatedFunction.users); // ['12345', ...]
     * ```
     */
    @Public()
    @Mutation('addUserToFunction')
    async addUserToMandate(@Args() input: UserFunctionInput): Promise<Mandates> {
        const { functionId, userId } = input; // Destrukturiere die Eingabe
        this.#logger.debug('addUserToRole: functionId=%s, userId=%s', functionId, userId);

        try {
            // Aufruf des Services zur Aktualisierung der Funktion
            const updatedFunction = await this.#service.addUserToFunction(functionId, userId);

            // Protokollierung der aktualisierten Funktion
            this.#logger.debug('Updated Role:', updatedFunction);

            return updatedFunction;
        } catch (error) {
            this.#logger.error('addUserToRole: Error occurred: %o', error);

            // Fehler werfen mit genauer Nachricht
            throw new Error((error as Error).message);
        }
    }

    /**
     * Entfernt einen Benutzer aus einer Funktion.
     *
     * Diese Mutation aktualisiert eine vorhandene Funktion, indem der angegebene Benutzer
     * entfernt wird. Die Funktion wird eindeutig durch ihre ID identifiziert.
     *
     * @param {UserFunctionInput} input - Die Eingabedaten, bestehend aus der ID der Funktion (`functionId`)
     * und der ID des Benutzers (`userId`).
     * @returns {Promise<Mandates>} - Die aktualisierte Funktion nach dem Entfernen des Benutzers.
     *
     * @throws {Error} - Wenn die Aktualisierung fehlschlägt oder die Eingabedaten ungültig sind.
     *
     * @example
     * ```typescript
     * const input: UserFunctionInput = {
     *   functionId: '64b1f768d9a8e900001b1b2f',
     *   userId: '12345',
     * };
     * const updatedFunction = await removeUserFromRole(input);
     * console.log(updatedFunction.users); // ['67890', ...] (ohne '12345')
     * ```
     */
    @Public()
    @Mutation('removeUserFromFunction')
    async removeUserFromRole(input: UserFunctionInput): Promise<Mandates> {
        const { functionId, userId } = input; // Destrukturiere die Eingabe
        this.#logger.debug('removeUserFromRole: functionId=%s, userId=%s', functionId, userId);

        try {
            // Aufruf des Services zur Aktualisierung der Funktion
            const updatedFunction: Mandates = await this.#service.removeUserFromFunction(
                functionId,
                userId,
            );

            // Protokollierung der aktualisierten Funktion
            this.#logger.debug('Updated Role:', updatedFunction);

            return updatedFunction;
        } catch (error) {
            this.#logger.error('removeUserFromRole: Error occurred: %o', error);

            // Fehler werfen mit genauer Nachricht
            throw new Error(`Failed to remove user from function: ${(error as Error).message}`);
        }
    }

    /**
     * Mutation zum Speichern einer Abfrage für eine spezifische Funktion und Organisationseinheit.
     *
     * Diese Mutation speichert eine Abfrage, die auf einer Funktion und einer Organisationseinheit basiert,
     * einschließlich der zugehörigen Filter- und Sortierkriterien.
     *
     * @param {SaveQueryInput} data - Die Eingabedaten für die Abfrage, bestehend aus `functionName`,
     * `orgUnitId` und den Abfrageparametern (`input`).
     * @returns {Promise<SavedQueryPayload>} - Die Nutzlast mit dem Ergebnis der gespeicherten Abfrage.
     *
     * @throws {Error} - Wenn die Speicherung fehlschlägt.
     *
     * @example
     * ```typescript
     * const data: SaveQueryInput = {
     *   functionName: 'Manager',
     *   orgUnitId: new Types.ObjectId('64b1f768d9a8e900001b1b2f'),
     *   input: {
     *     entity: 'USERS',
     *     filter: { field: 'status', operator: 'EQ', value: 'active' },
     *     sort: { field: 'name', direction: 'ASC' },
     *   },
     * };
     *
     * const result = await saveQuery(data);
     * console.log(result.message); // "Save operation successful."
     * ```
     */
    @Public()
    @Mutation('saveQuery')
    async saveQuery(@Args() data: SaveQueryInput): Promise<SavedQueryPayload> {
        const { functionName, orgUnitId, input } = data;
        this.#logger.debug(
            'saveQuery: functionName=%s, orgUnit=%s, input=%o',
            functionName,
            orgUnitId,
            input,
        );

        const { entity, filter, sort } = input;

        try {
            // Aufruf des Services zur Speicherung der Abfrage
            const { result, success } = await this.#service.saveQuery(
                functionName,
                orgUnitId,
                entity,
                filter,
                sort,
            );

            this.#logger.debug('Query result:', result);

            return {
                success,
                message: `Save operation successful.`,
                result,
            };
        } catch (error) {
            this.#logger.error('saveQuery: Error occurred: %o', error);

            // Fehler werfen mit einer klaren Nachricht
            throw new Error(`Failed to save query: ${(error as Error).message}`);
        }
    }
}

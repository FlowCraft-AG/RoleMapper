import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { Function, FunctionDocument } from '../model/entity/function.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
//TODO: eingemeinsames FilterInput
import { RoleResult } from '../controller/read.controller.js';
import { FilterInput } from './filterInput.js';
import { InvalidFilterException, InvalidOperatorException } from './exceptions.js';

@Injectable()
export class ReadService {
    readonly #logger = getLogger(ReadService.name);

    readonly #models: Record<string, Model<any>>;

    constructor(
        @InjectModel(User.name) userModel: Model<UserDocument>,
        @InjectModel(Process.name) processModel: Model<ProcessDocument>,
        @InjectModel(Function.name) functionModel: Model<FunctionDocument>,
        @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
        @InjectModel(Role.name) roleModel: Model<RoleDocument>,
    ) {
        this.#models = {
            USERS: userModel,
            FUNCTIONS: functionModel,
            PROCESSES: processModel,
            ROLES: roleModel,
            ORG_UNITS: orgUnitModel,
        };
    }

    /**
     * Sucht die Rollen und die zugehörigen Benutzer für einen gegebenen Prozess.
     *
     * @param {string} processId - Die ID des Prozesses, für den die Rollen gesucht werden.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt (für Abfragen verwendet).
     * @returns {Promise<{ roles: RoleResult[] }>} Eine Liste der Rollen und der zugehörigen Benutzer.
     * @throws {NotFoundException} Wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     */
    async findProcessRoles(processId: string, userId: string) {
        this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

        // 1. Abrufen des Prozesses und Validierung, ob Rollen existieren
        const process = await this.#models.PROCESSES!.findOne({ processId }).exec();
        if (!process?.roles) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
        }

        // 2. Überprüfen, ob der Benutzer existiert
        if (!(await this.#models.USERS!.exists({ userId }))) {
            throw new NotFoundException(`Keinen Benutzer gefunden mit der userId: ${userId}`);
        }

        // 3. Extrahieren der Rollen-IDs aus dem Prozess
        const roleIds = process.roles.flatMap(Object.values);
        this.#logger.debug('roleIds=%o', roleIds);

        // 4. Abrufen der Rollen aus der Datenbank und Erstellen einer Map für schnellen Zugriff
        const rolesMap = new Map(
            (await this.#models.ROLES!.find({ roleId: { $in: roleIds } }).exec()).map(
                ({ roleId, query }) => [roleId, query],
            ),
        );

        if (!rolesMap.size) {
            this.#logger.warn('findProcessRoles: Keine Rollen gefunden für: %o', roleIds);
        }
        this.#logger.debug('findProcessRoles: rolesMap=%o', [...rolesMap.entries()]);

        // 5. Verarbeiten jeder Rolle: Benutzer suchen und Ergebnisse erstellen
        const results = (
            await Promise.all(
                process.roles.map(async (roleObj: Role) => {
                    const [roleKey, roleId] = Object.entries(roleObj ?? {})[0] || [];
                    this.#logger.debug('Verarbeite Rolle %s (%s)', roleKey, roleId);
                    if (!roleKey || !roleId || !rolesMap.has(roleId)) {
                        this.#logger.warn(
                            'findProcessRoles: Ungültige oder fehlende Rolle: %s (%o)',
                            roleId,
                            roleObj,
                        );
                        return null;
                    }

                    try {
                        // Abfrage der Benutzer, die der Rolle entsprechen
                        const users = await this.#models
                            .FUNCTIONS!.aggregate(rolesMap.get(roleId)!)
                            .option({ let: { userId } })
                            .exec();
                        this.#logger.debug(
                            'findProcessRoles: Ergebnis für Rolle %s: %o',
                            roleKey,
                            users,
                        );

                        return { roleName: roleKey, users };
                    } catch (error) {
                        this.#logger.error(
                            'findProcessRoles: Fehler bei Rolle %s: %o',
                            roleKey,
                            error,
                        );
                        return null;
                    }
                }),
            )
        ).filter(Boolean);

        // 6. Abschließende Log-Ausgabe und Rückgabe der Ergebnisse
        this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
        this.#logger.debug('findProcessRoles: roles=%o', results);
        return { roles: results as RoleResult[] };
    }

    /**
     * Führt eine dynamische Filterung für eine angegebene Entität durch.
     *
     * @param {string} entity - Der Name der Ziel-Entität (z. B. `USERS`, `FUNCTIONS`).
     * @param {FilterInput} [filters] - Die Filterbedingungen, die auf die Entität angewendet werden sollen.
     * @returns {Promise<any[]>} Eine Liste der gefilterten Daten.
     * @throws {Error} Wenn die Entität nicht existiert oder ein ungültiger Filter angegeben wird.
     */
  async findData(entity: string, filters?: FilterInput): Promise<any[]> {
      this.#logger.debug('findData: entity=%s, filters=%o', entity, filters);
        const model = this.#models[entity];
        if (!model) {
            const validEntities = Object.keys(this.#models).join(', ');
            throw new Error(
                `findData: Unbekannte Collection=${entity}. Unterstützte Collections=${validEntities}`,
            );
        }

        const filterQuery = this.buildFilterQuery(filters);
        this.#logger.debug('findData: Collection=%s', entity);
        this.#logger.debug('findData:  data=%o', JSON.stringify(filterQuery, null, 2));

        return model.find(filterQuery).exec();
    }

  /**
  * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
  *
  * @param {FilterInput} [filters] - Die Filterbedingungen in einem rekursiven Schema.
  * @returns {FilterQuery<any>} Die generierte MongoDB-Query.
  * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
  * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
  */
  private buildFilterQuery(filters?: FilterInput): FilterQuery<any> {
    if (!filters) return {};

    const query: FilterQuery<any> = {};

    const OPERATOR_MAP: Record<string, string> = {
      EQ: '$eq',
      In: '$in',
      GTE: '$gte',
    };

    // Rekursive Verarbeitung von logischen Operatoren
    if (filters.and) query.$and = filters.and.map((subFilter) => this.buildFilterQuery(subFilter));
    if (filters.or) query.$or = filters.or.map((subFilter) => this.buildFilterQuery(subFilter));
    if (filters.not) query.$not = this.buildFilterQuery(filters.not);

    // Prüfung auf fehlende Felder, Operatoren und Werte
    const missingFields: string[] = [];
    if (!filters.field) missingFields.push('Feld');
    if (!filters.operator) missingFields.push('Operator');
    if (filters.value === undefined) missingFields.push('Wert');

    if (missingFields.length) {
      throw new InvalidFilterException(missingFields);
    }

    // Nutzung der überprüften Eigenschaften
    const mongoOperator = OPERATOR_MAP[filters.operator!]; // Non-Null-Assertion
    if (!mongoOperator) {
      throw new InvalidOperatorException(filters.operator!);
    }

    query[filters.field!] = { [mongoOperator]: filters.value };

    return query;
  }


}

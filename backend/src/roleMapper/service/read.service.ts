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
     * @throws {NotFoundException} Wenn der Prozess keine definierten Rollen hat.
     */
    async findProcessRoles(processId: string, userId: string) {
        this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

        // 1. Abrufen des Prozesses und Validierung, ob Rollen existieren
        const process = await this.#models.PROCESSES!.findOne({ processId }).exec();
        if (!process?.roles) {
            throw new NotFoundException('Keine Rollen für diesen Prozess gefunden.');
        }

        // 2. Extrahieren der Rollen-IDs aus dem Prozess
        const roleIds = process.roles.flatMap(Object.values);
        this.#logger.debug('roleIds=%o', roleIds);

        // 3. Abrufen der Rollen aus der Datenbank und Erstellen einer Map für schnellen Zugriff
        const rolesMap = new Map(
            (await this.#models.ROLES!.find({ roleId: { $in: roleIds } }).exec()).map(
                ({ roleId, query }) => [roleId, query],
            ),
        );

        if (!rolesMap.size) {
            this.#logger.warn('Keine Rollen gefunden für: %o', roleIds);
        }
        this.#logger.debug('rolesMap=%o', [...rolesMap.entries()]);

        // 4. Verarbeiten jeder Rolle: Benutzer suchen und Ergebnisse erstellen
        const results = (
            await Promise.all(
                process.roles.map(async (roleObj: Role) => {
                    const [roleKey, roleId] = Object.entries(roleObj ?? {})[0] || [];
                    this.#logger.debug('Verarbeite Rolle %s (%s)', roleKey, roleId);
                    if (!roleKey || !roleId || !rolesMap.has(roleId)) {
                        this.#logger.warn(
                            'Ungültige oder fehlende Rolle: %s (%o)',
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
                        this.#logger.debug('Ergebnis für Rolle %s: %o', roleKey, users);

                        return { roleName: roleKey, users };
                    } catch (error) {
                        this.#logger.error('Fehler bei Rolle %s: %o', roleKey, error);
                        return null;
                    }
                }),
            )
        ).filter(Boolean);

        // 5. Abschließende Log-Ausgabe und Rückgabe der Ergebnisse
        this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
        this.#logger.debug('Ergebnisse: %o', results);
        return { roles: results as RoleResult[] };
    }

    /**
     * Dynamische Filterung für eine bestimmte Entität
     * @param entity - Ziel-Entität (z. B. USERS, FUNCTIONS)
     * @param filters - Filterbedingungen
     * @returns - Gefilterte Daten
     */
    async filterData(entity: string, filters?: FilterInput): Promise<any[]> {
        const model = this.#models[entity];
        if (!model) {
            const validEntities = Object.keys(this.#models).join(', ');
            throw new Error(`Unknown entity: ${entity}. Supported entities: ${validEntities}`);
        }

        const filterQuery = this.buildFilterQuery(filters);
        console.debug(`[FilterService] Entity: ${entity}`);
        console.debug(`[FilterService] Filter Query:`, JSON.stringify(filterQuery, null, 2));

        return model.find(filterQuery).exec();
    }

    /**
     * Rekursive Erstellung der MongoDB-Filter-Query
     */
    private buildFilterQuery(filters?: FilterInput): FilterQuery<any> {
        if (!filters) return {};

        const query: FilterQuery<any> = {};

        const OPERATOR_MAP: Record<string, string> = {
            EQ: '$eq',
            In: '$in',
            GTE: '$gte',
        };

        if (filters.and) {
            query.$and = filters.and.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filters.or) {
            query.$or = filters.or.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filters.not) {
            query.$not = this.buildFilterQuery(filters.not);
        }
        if (filters.field && filters.operator && filters.value !== undefined) {
            const mongoOperator = OPERATOR_MAP[filters.operator];
            if (!mongoOperator) {
                throw new Error(`Invalid operator: ${filters.operator}`);
            }
            query[filters.field] = { [mongoOperator]: filters.value };
        } else if (filters.field || filters.operator || filters.value !== undefined) {
            throw new Error(
                `Invalid filter: field, operator, and value must all be defined for a single filter.`,
            );
        }

        return query;
    }
}

// export interface FilterInput {
//   and?: FilterInput[];  // Logischer UND-Operator
//   or?: FilterInput[];   // Logischer ODER-Operator
//   not?: FilterInput;    // Logischer NOT-Operator
//   field?: string;        // Feldname, auf das der Filter angewendet wird
//   operator?: "$eq" | "$in" | "$gte" | "$lte" | "$ne" | "$regex";    // Vergleichsoperator (z.B. "$eq", "$in", "$gt")
//   value?: string | number | boolean | any[];          // Wert, der mit dem Feld verglichen wird
// }

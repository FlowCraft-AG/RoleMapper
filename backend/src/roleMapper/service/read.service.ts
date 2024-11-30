import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { Function, FunctionDocument } from '../model/entity/function.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import {
    RolePayload,
    RoleResult,
} from '../model/interface/rolePayload.interface.js';
//TODO: eingemeinsames FilterInput
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
     * Führt eine dynamische Query aus einem Process-Dokument aus.
     * @param prozessId Die ID des Prozesses.
     * @param abfrage Der Schlüssel der Query im Prozess.
     * @returns Das Ergebnis der Aggregation.
     * @throws Fehler, wenn der Prozess oder die Query nicht gefunden wird oder die Aggregation fehlschlägt.
     */
    async führeAlleAbfragenAus(
        processId: string,
        userId: string,
    ): Promise<RolePayload> {
        this.#logger.debug(
            'führeAlleAbfragenAus: processId=%s, userId=%s',
            processId,
            userId,
        );

        if (!this.#models.PROCESSES) {
            throw new Error('Process model is not defined.');
        }
        // Prozess abrufen
        const process: Process = await this.#models.PROCESSES.findOne({
            processId,
        }).exec();
        this.#logger.debug('Prozess gefunden: %o', process);

        if (!process || !process.roles) {
            throw new Error('Keine Rollen für diesen Prozess gefunden.');
        }
        if (!this.#models.ROLES) {
            throw new Error('Role model is not defined.');
        }
        // Extrahiere die Rollen-IDs
        const roleIds = process.roles.flatMap((role) => Object.values(role));
        const roles = await this.#models.ROLES.find({
            roleId: { $in: roleIds },
        }).exec();
        this.#logger.debug('Rollen-IDs: %o', roleIds);

        // Rollen aus der Datenbank abrufen
        this.#logger.debug('Gefundene Rollen: %o', roles);

        if (!roles.length) {
            this.#logger.warn(
                'Keine Rollen in der Datenbank gefunden für: %o',
                roleIds,
            );
        }

        // Map für schnelles Nachschlagen erstellen
        const rolesMap = new Map(roles.map((role) => [role.roleId, role]));
        this.#logger.debug('Rollen-Map: %o', Array.from(rolesMap.entries()));

        const results: RoleResult[] = [];
        const start = Date.now();

        try {
            for (const roleObj of process.roles) {
                if (!roleObj || typeof roleObj !== 'object') {
                    this.#logger.warn('Ungültiges Rollenobjekt: %o', roleObj);
                    continue;
                }

                const entry = Object.entries(roleObj)[0];
                if (!entry) {
                    this.#logger.warn(
                        'Keine Einträge in Rollenobjekt: %o',
                        roleObj,
                    );
                    continue;
                }

                const [roleKey, roleId] = entry;

                this.#logger.debug(
                    'Verarbeite Rolle: %s mit ID: %s',
                    roleKey,
                    roleId,
                );

                const role = rolesMap.get(roleId);
                if (!role || !role.query) {
                    this.#logger.warn(
                        'Überspringe Rolle %s: Keine gültigen Daten gefunden (%s).',
                        roleKey,
                        roleId,
                    );
                    continue;
                }
                if (!this.#models.FUNCTIONS) {
                    throw new Error('Function model is not defined.');
                }
                if (!Array.isArray(role.query) || !role.query.length) {
                    this.#logger.warn(
                        'Überspringe Rolle %s: Leere oder ungültige Abfrage.',
                        roleKey,
                    );
                    continue;
                }
                const query = role.query;
                if (!Array.isArray(query) || !query.length) {
                    this.#logger.warn(
                        'Überspringe Rolle %s: Leere oder ungültige Abfrage.',
                        roleKey,
                    );
                    continue;
                }

                try {
                    const aggregationStart = Date.now();
                    const users: User[] =
                        await this.#models.FUNCTIONS.aggregate(query)
                            .option({ let: { userId } })
                            .exec();
                    const aggregationTime = Date.now() - aggregationStart;

                    this.#logger.debug(
                        'Ergebnis für Rolle %s: %o (Dauer: %d ms)',
                        roleKey,
                        users,
                        aggregationTime,
                    );

                    results.push({
                        roleName: roleKey,
                        users,
                    });
                } catch (error) {
                    this.#logger.error(
                        'Fehler bei der Verarbeitung der Rolle %s: %o',
                        roleKey,
                        error,
                    );
                }
            }

            this.#logger.info(
                `Verarbeitung abgeschlossen in ${Date.now() - start}ms`,
            );
            return { roles: results };
        } catch (error) {
            this.#logger.error('Fehler bei der Verarbeitung: %o', error);
            throw error;
        }
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
            throw new Error(
                `Unknown entity: ${entity}. Supported entities: ${validEntities}`,
            );
        }

        const filterQuery = this.buildFilterQuery(filters);
        console.debug(`[FilterService] Entity: ${entity}`);
        console.debug(
            `[FilterService] Filter Query:`,
            JSON.stringify(filterQuery, null, 2),
        );

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
            query.$and = filters.and.map((subFilter) =>
                this.buildFilterQuery(subFilter),
            );
        }
        if (filters.or) {
            query.$or = filters.or.map((subFilter) =>
                this.buildFilterQuery(subFilter),
            );
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
        } else if (
            filters.field ||
            filters.operator ||
            filters.value !== undefined
        ) {
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

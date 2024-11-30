import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { getLogger } from '../../logger/logger.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { FunctionDocument } from '../model/entity/function.entity.js';
import { RoleDocument, Role } from '../model/entity/roles.entity.js';
import { RolePayload, RoleResult } from '../model/interface/rolePayload.interface.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';

@Injectable()
export class ReadService {
  readonly #logger = getLogger(ReadService.name);

  readonly #userModel: Model<UserDocument>;
  readonly #processModel: Model<ProcessDocument>;
  readonly #functionModel: Model<FunctionDocument>;
  readonly #orgUnitModel: Model<OrgUnitDocument>;
  readonly #roleModel: Model<RoleDocument>;

  readonly #entityMap: Record<string, Model<any>>;

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Process.name) processModel: Model<ProcessDocument>,
    @InjectModel(Function.name) functionModel: Model<FunctionDocument>,
    @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
    @InjectModel(Role.name) roleModel: Model<RoleDocument>
  ) {
    this.#processModel = processModel;
    this.#userModel = userModel;
    this.#functionModel = functionModel;
    this.#orgUnitModel = orgUnitModel
    this.#roleModel = roleModel;

    this.#entityMap = {
      USERS: this.#userModel,
      FUNCTIONS: this.#functionModel,
      PROCESSES: this.#processModel,
      ROLES: this.#roleModel,
      ORG_UNITS: this.#orgUnitModel,
    };
   }

  /**
   * Findet alle Benutzer mit optionalen Filtern.
   * @param filters Ein Objekt mit Filtern (z. B. { userId: '123', active: true }).
   * @returns Eine Liste von Benutzern.
   */
  async findAll(filters: FilterQuery<UserDocument> = {}): Promise<User[]> {
    this.#logger.debug('ReadService: alle');
    const users = await this.#userModel.find(filters).exec();
    this.#logger.debug('ReadService: users=%o', users.length);
    return users;

  }

  /**
   * Findet einen Benutzer nach ID.
   * @param id Die ID des Benutzers.
   * @returns Der Benutzer oder `null`.
   */
  async findById(id: string): Promise<User | null> {
    return this.#userModel.findById(id).exec();
  }

  /**
   * Findet einen Benutzer nach der userId.
   * @param userId Die userId des Benutzers.
   * @returns Der Benutzer oder `null`.
   */
  async findByUserId(userId: string): Promise<User | null> {
    return this.#userModel.findOne({ userId }).exec();
  }

  async findProcessByPid(processId: string): Promise<Process | null> {
    return this.#processModel.findOne({ processId }).exec();
  }


  /**
 * Führt eine dynamische Query aus einem Process-Dokument aus.
 * @param prozessId Die ID des Prozesses.
 * @param abfrage Der Schlüssel der Query im Prozess.
 * @returns Das Ergebnis der Aggregation.
 * @throws Fehler, wenn der Prozess oder die Query nicht gefunden wird oder die Aggregation fehlschlägt.
 */
  async führeAlleAbfragenAus(processId: string, userId: string): Promise<RolePayload> {
    this.#logger.debug('führeAlleAbfragenAus: processId=%s, userId=%s', processId, userId);

    // Prozess abrufen
    const process = await this.findProcessByPid(processId);
    this.#logger.debug('Prozess gefunden: %o', process);

    if (!process || !process.roles) {
      throw new Error('Keine Rollen für diesen Prozess gefunden.');
    }

    // Extrahiere die Rollen-IDs
    const roleIds = process.roles.flatMap((role) => Object.values(role));
    this.#logger.debug('Rollen-IDs: %o', roleIds);

    // Rollen aus der Datenbank abrufen
    const roles = await this.#roleModel.find({ roleId: { $in: roleIds } }).exec();
    this.#logger.debug('Gefundene Rollen: %o', roles);

    if (!roles.length) {
      this.#logger.warn('Keine Rollen in der Datenbank gefunden für: %o', roleIds);
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
          this.#logger.warn('Keine Einträge in Rollenobjekt: %o', roleObj);
          continue;
        }

        const [roleKey, roleId] = entry;

        this.#logger.debug('Verarbeite Rolle: %s mit ID: %s', roleKey, roleId);

        const role = rolesMap.get(roleId);
        if (!role || !role.query) {
          this.#logger.warn('Überspringe Rolle %s: Keine gültigen Daten gefunden (%s).', roleKey, roleId);
          continue;
        }

        const query = role.query;
        if (!Array.isArray(query) || !query.length) {
          this.#logger.warn('Überspringe Rolle %s: Leere oder ungültige Abfrage.', roleKey);
          continue;
        }

        try {
          const aggregationStart = Date.now();
          const users: User[] = await this.#functionModel
            .aggregate(query)
            .option({ let: { userId } })
            .exec();
          const aggregationTime = Date.now() - aggregationStart;

          this.#logger.debug('Ergebnis für Rolle %s: %o (Dauer: %d ms)', roleKey, users, aggregationTime);

          results.push({
            roleName: roleKey,
            users,
          });
        } catch (error) {
          this.#logger.error('Fehler bei der Verarbeitung der Rolle %s: %o', roleKey, error);
        }
      }

      this.#logger.info(`Verarbeitung abgeschlossen in ${Date.now() - start}ms`);
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
    const model = this.#entityMap[entity];
    if (!model) {
      throw new Error(`Unknown entity: ${entity}`);
    }

    const filterQuery = this.buildFilterQuery(filters);
    return model.find(filterQuery).exec();
  }

  /**
   * Rekursive Erstellung der MongoDB-Filter-Query
   */
  private buildFilterQuery(filters?: FilterInput): FilterQuery<any> {
    if (!filters) return {};

    const query: FilterQuery<any> = {};
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
      query[filters.field] = { [filters.operator]: filters.value };
    }

    return query;
  }

}

export interface AggregationRequest {
  rootEntity: string; // Haupt-Entität
  lookups?: LookupDefinition[]; // Verknüpfungen
  filters?: FilterInput; // Dynamische Filter
}

export interface LookupDefinition {
  from: string; // Ziel-Entität
  localField: string; // Feld in der Haupt-Entität
  foreignField: string; // Feld in der Ziel-Entität
  as: string; // Alias für verknüpfte Daten
}


export interface FilterInput {
  and?: FilterInput[];  // Logischer UND-Operator
  or?: FilterInput[];   // Logischer ODER-Operator
  not?: FilterInput;    // Logischer NOT-Operator
  field?: string;        // Feldname, auf das der Filter angewendet wird
  operator?: string;     // Vergleichsoperator (z.B. "$eq", "$in", "$gt")
  value?: any;           // Wert, der mit dem Feld verglichen wird
}

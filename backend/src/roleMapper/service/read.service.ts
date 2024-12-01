import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { Function, FunctionDocument } from '../model/entity/function.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { RoleResult } from '../controller/read.controller.js';
import { FilterDTO } from '../model/dto/filter.dto.js';
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
  async findProcessRoles(processId: string, userId: string): Promise<{ roles: RoleResult[] }> {
    this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

    const process = await this.#models.PROCESSES!.findOne({ processId }).exec();
    if (!process?.roles) {
      throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
    }

    if (!(await this.#models.USERS!.exists({ userId }))) {
      throw new NotFoundException(`Keinen Benutzer gefunden mit der userId: ${userId}`);
    }

    const roleIds = process.roles.flatMap(Object.values);
    this.#logger.debug('roleIds=%o', roleIds);

    const roles = await this.#models.ROLES!.find({ roleId: { $in: roleIds } }).exec();
    this.#logger.debug('findProcessRoles: roles=%o', roles);
    const rolesMap = new Map(roles.map(({ roleId, query }) => [roleId, query]));
    this.#logger.debug('findProcessRoles: rolesMap=%o', rolesMap);

    if (!rolesMap.size) {
      this.#logger.warn('findProcessRoles: Keine Rollen gefunden für: %o', roleIds);
    }

    const results = (
      await Promise.all(
        process.roles.map(async (roleObj: Role) => {
          const [roleKey, roleId] = Object.entries(roleObj ?? {})[0] || [];
          this.#logger.debug('findProcessRoles: roleKey=%s, roleId=%s', roleKey, roleId);
          if (!roleKey || !roleId || !rolesMap.has(roleId)) {
            this.#logger.warn('Ungültige oder fehlende Rolle: %o', roleObj);
            return null;
          }

          try {
            const queryPipeline = rolesMap.get(roleId)!;
            const users = await this.#models.FUNCTIONS!.aggregate(queryPipeline)
              .option({let: { userId }})
              .exec();
            return { roleName: roleKey, users };
          } catch (error) {
            this.#logger.error('Fehler bei Rolle %s: %o', roleKey, error);
            return null;
          }
        }),
      )
    ).filter(Boolean);

    this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
    return { roles: results as RoleResult[] };
  }

  /**
   * Führt eine dynamische Filterung für eine angegebene Entität durch.
   *
   * @param {string} entity - Der Name der Ziel-Entität (z. B. `USERS`, `FUNCTIONS`).
   * @param {FilterDTO} filters - Die Filterbedingungen.
   * @returns {Promise<any[]>} Eine Liste der gefilterten Daten.
   * @throws {BadRequestException} Wenn die Entität nicht unterstützt wird.
   */
  async findData(entity: string, filters: FilterDTO | undefined): Promise<any[]> {
    this.#logger.debug('findData: entity=%s, filters=%o', entity, filters);

    const model = this.#models[entity];
    if (!model) {
      const validEntities = Object.keys(this.#models).join(', ');
      throw new BadRequestException(
        `Nicht unterstützte Entität: ${entity}. Unterstützte Entitäten sind: ${validEntities}`,
      );
    }

    const filterQuery = this.buildFilterQuery(filters);
    this.#logger.debug('findData: Filter Query=%o', filterQuery);

    return model.find(filterQuery).exec();
  }

  /**
   * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
   *
   * @param {FilterDTO} filters - Die Filterbedingungen in einem rekursiven Schema.
   * @returns {FilterQuery<any>} Die generierte MongoDB-Query.
   * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
   * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
   */
  private buildFilterQuery(filters: FilterDTO | undefined): FilterQuery<any> {
    if (!filters) return {};

    const query: FilterQuery<any> = {};

    const OPERATOR_MAP: Record<string, string> = {
      EQ: '$eq',
      IN: '$in',
      GTE: '$gte',
      LTE: '$lte',
      LIKE: '$regex',
    };

    if (filters.and) query.$and = filters.and.map((subFilter) => this.buildFilterQuery(subFilter));
    if (filters.or) query.$or = filters.or.map((subFilter) => this.buildFilterQuery(subFilter));
    if (filters.not) query.$not = this.buildFilterQuery(filters.not);

    const missingFields: string[] = [];
    if (!filters.field) missingFields.push('Feld');
    if (!filters.operator) missingFields.push('Operator');
    if (filters.value === undefined) missingFields.push('Wert');

    if (missingFields.length) {
      throw new InvalidFilterException(missingFields);
    }

    const mongoOperator = OPERATOR_MAP[filters.operator!];
    if (!mongoOperator) {
      throw new InvalidOperatorException(filters.operator!);
    }

    query[filters.field!] = { [mongoOperator]: filters.value };

    return query;
  }
}

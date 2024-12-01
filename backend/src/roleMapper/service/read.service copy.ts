// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { FilterQuery, Model } from 'mongoose';
// import { getLogger } from '../../logger/logger.js';
// import { Function, FunctionDocument } from '../model/entity/function.entity.js';
// import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';
// import { Process, ProcessDocument } from '../model/entity/process.entity.js';
// import { Role, RoleDocument } from '../model/entity/roles.entity.js';
// import { User, UserDocument } from '../model/entity/user.entity.js';
// //TODO: eingemeinsames FilterInput
// import { FilterInput } from './filterInput.js';
// import { RoleResult } from '../controller/read.controller.js';

// @Injectable()
// export class ReadService {
//   readonly #logger = getLogger(ReadService.name);

//   readonly #models: Record<string, Model<any>>;

//   constructor(
//     @InjectModel(User.name) userModel: Model<UserDocument>,
//     @InjectModel(Process.name) processModel: Model<ProcessDocument>,
//     @InjectModel(Function.name) functionModel: Model<FunctionDocument>,
//     @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
//     @InjectModel(Role.name) roleModel: Model<RoleDocument>,
//   ) {
//     this.#models = {
//       USERS: userModel,
//       FUNCTIONS: functionModel,
//       PROCESSES: processModel,
//       ROLES: roleModel,
//       ORG_UNITS: orgUnitModel,
//     };
//   }

//   /**
//    * Führt eine dynamische Query aus einem Process-Dokument aus.
//    * @param prozessId Die ID des Prozesses.
//    * @param abfrage Der Schlüssel der Query im Prozess.
//    * @returns Das Ergebnis der Aggregation.
//    * @throws Fehler, wenn der Prozess oder die Query nicht gefunden wird oder die Aggregation fehlschlägt.
//    */
//   async findProcessRoles(processId: string, userId: string) {
//     this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

//     // Prozess abrufen
//     const process = await this.#models.PROCESSES!.findOne({ processId }).exec();
//     if (!process?.roles) throw new NotFoundException('Keine Rollen für diesen Prozess gefunden.');

//     const roleIds = process.roles.flatMap((role: Role) => Object.values(role));
//     this.#logger.debug('findProcessRoles: roleIds=%o', roleIds);

//     // Rollen-Details abrufen
//     const roles = await this.#models.ROLES!.find({ roleId: { $in: roleIds } }).exec();
//     if (!roles.length) this.#logger.warn('Keine Rollen in der Datenbank gefunden für: %o', roleIds);

//     const rolesMap = new Map(roles.map((role) => [role.roleId, role]));
//     this.#logger.debug('findProcessRoles: rolesMap=%o', Array.from(rolesMap.entries()));

//     // Ergebnisse verarbeiten
//     const results: RoleResult[] = await Promise.all(
//       process.roles.map(async (roleObj: Role) => {
//         const [roleKey, roleId] = Object.entries(roleObj ?? {})[0] || [];
//         if (!roleKey || !roleId) {
//           this.#logger.warn('Ungültiges Rollenobjekt: %o', roleObj);
//           return null;
//         }

//         const role = rolesMap.get(roleId);
//         if (!role?.query) {
//           this.#logger.warn('Überspringe Rolle %s: Keine gültigen Daten (%s).', roleKey, roleId);
//           return null;
//         }

//         try {
//           const users: User[] = await this.#models.FUNCTIONS!.aggregate(role.query)
//             .option({ let: { userId } })
//             .exec();
//           this.#logger.debug('Ergebnis für Rolle %s: %o', roleKey, users);

//           return { roleName: roleKey, users };
//         } catch (error) {
//           this.#logger.error('Fehler bei der Verarbeitung der Rolle %s: %o', roleKey, error);
//           return null;
//         }
//       })
//     );

//     const filteredResults = results.filter(Boolean) as RoleResult[];
//     this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
//     return { roles: filteredResults };
//   }

//   async findProcessRoles_ORIG(processId: string, userId: string) {
//     this.#logger.debug(
//       'findProcessRoles: processId=%s, userId=%s',
//       processId,
//       userId,
//     );

//     // Prozess abrufen
//     const process = await this.#models.PROCESSES!.findOne({ processId }).exec();
//     this.#logger.debug('findProcessRoles: process=%o', process);

//     if (!process?.roles) {
//       throw new NotFoundException('Keine Rollen für diesen Prozess gefunden.');
//     }

//     // Rollen-IDs extrahieren und abrufen
//     const roleIds = process.roles.flatMap((role: Role) => Object.values(role));
//     this.#logger.debug('findProcessRoles: roleIds=%o', roleIds);
//     const roles = await this.#models.ROLES!.find({ roleId: { $in: roleIds } }).exec();
//     this.#logger.debug('findProcessRoles: roles=%o', roles);

//     if (!roles.length) {
//       this.#logger.warn('Keine Rollen in der Datenbank gefunden für: %o', roleIds);
//     }

//     // Rollen-Map erstellen
//     const rolesMap = new Map(roles.map((role) => [role.roleId, role]));
//     this.#logger.debug('findProcessRoles: rolesMap=%o', Array.from(rolesMap.entries()));

//     const results: RoleResult[] = [];
//     const start = Date.now();

//     try {
//       for (const roleObj of process.roles) {
//         const [roleKey, roleId] = Object.entries(roleObj ?? {})[0] || [];
//         this.#logger.debug('findProcessRoles: Verarbeite Rolle roleKey=%s: roleId=%s', roleKey, roleId);

//         if (!roleKey || !roleId) {
//           this.#logger.warn('findProcessRoles: Ungültiges Rollenobjekt: %o', roleObj);
//           continue;
//         }

//         const role = rolesMap.get(roleId);
//         if (!role?.query) {
//           this.#logger.warn(
//             'findProcessRoles: Überspringe Rolle %s: Keine gültigen Daten gefunden (%s).',
//             roleKey,
//             roleId,
//           );
//           continue;
//         }

//         try {
//           const aggregationStart = Date.now();
//           const users: User[] = await this.#models.FUNCTIONS!.aggregate(role.query)
//             .option({ let: { userId } })
//             .exec();
//           const aggregationTime = Date.now() - aggregationStart;

//           this.#logger.debug(
//             'findProcessRoles: Ergebnis für Rolle %s: %o (Dauer: %d ms)',
//             roleKey,
//             users,
//             aggregationTime,
//           );

//           results.push({ roleName: roleKey, users });
//         } catch (error) {
//           this.#logger.error(
//             'findProcessRoles: Fehler bei der Verarbeitung der Rolle %s: %o',
//             roleKey,
//             error,
//           );
//         }
//       }

//       this.#logger.info(`findProcessRoles: Verarbeitung abgeschlossen in ${Date.now() - start}ms`);
//       return { roles: results };
//     } catch (error) {
//       this.#logger.error('findProcessRoles: Fehler bei der Verarbeitung: %o', error);
//       throw error;
//     }
//   }
// }

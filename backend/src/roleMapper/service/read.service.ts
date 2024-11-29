import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { getLogger } from '../../logger/logger.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { FunctionDocument } from '../model/entity/function.entity.js';
import { RoleDocument, Role } from '../model/entity/roles.entity.js';

@Injectable()
export class ReadService {
  readonly #logger = getLogger(ReadService.name);
  readonly #userModel: Model<UserDocument>;
  readonly #processModel: Model<ProcessDocument>;
  readonly #functionModel: Model<FunctionDocument>;
  readonly #roleModel: Model<RoleDocument>;

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Process.name) processModel: Model<ProcessDocument>,
    @InjectModel(Function.name) functionModel: Model<FunctionDocument>,
    @InjectModel(Role.name) roleModel: Model<RoleDocument>
  ) {
    this.#processModel = processModel;
    this.#userModel = userModel;
    this.#functionModel = functionModel;
    this.#roleModel = roleModel;
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

  async findProcessByPid(pid: string): Promise<Process | null> {
    return this.#processModel.findOne({ pid }).exec();
  }


  //TODO verbessern
  /**
 * Führt eine dynamische Query aus einem Process-Dokument aus.
 * @param prozessId Die ID des Prozesses.
 * @param abfrage Der Schlüssel der Query im Prozess.
 * @returns Das Ergebnis der Aggregation.
 * @throws Fehler, wenn der Prozess oder die Query nicht gefunden wird oder die Aggregation fehlschlägt.
 */



  //   async führeAlleAbfragenAus(prozessId: string, benutzerId: string): Promise < Record < string, any >> {
  //     this.#logger.debug('führeAlleAbfragenAus: prozessId=%s, benutzerId=%s', prozessId, benutzerId);

  //     // Suche den Prozess anhand seiner ID
  //     const prozess = await this.findProcessByPid(prozessId);
  //     this.#logger.debug('führeAlleAbfragenAus: prozess=%o', prozess);
  //     if(!prozess || !prozess.roles) {
  //     throw new Error('Keine Abfragen für diesen Prozess gefunden');
  //   }

  //   const ergebnisse: Record<string, any> = {};

  //   this.#logger.debug('führeAlleAbfragenAus: roles=%o', Object.keys(prozess.roles));

  //   try {
  //     // Iteriere über alle Abfragen und führe sie aus
  //     for (const [abfrageSchlüssel, roleId] of Object.entries(prozess.roles)) {
  //       this.#logger.debug('Verarbeite Abfrage: %s', abfrageSchlüssel);

  //       if (!roleId) {
  //         this.#logger.warn('Abfrage %s hat keine gültige roleId. Überspringe.', abfrageSchlüssel);
  //         continue;
  //       }

  //       const role = await this.#roleModel.findOne({ roleId }).exec();
  //       this.#logger.debug('Verarbeite Abfrage: role=%s', role);
  //       if (!role || !role.query) {
  //         this.#logger.warn('Keine gültige Rolle oder Abfrage für roleId %s gefunden. Überspringe.', roleId);
  //         continue;
  //       }

  //       const abfrage = role.query;
  //       if (!Array.isArray(abfrage) || abfrage.length === 0) {
  //         this.#logger.warn('Abfrage für roleId %s ist leer oder ungültig. Überspringe.', roleId);
  //         continue;
  //       }
  //       this.#logger.debug('führeAlleAbfragenAus: abfrage=%o', abfrage)



  //       try {
  //         const ergebnis = await this.#functionModel.aggregate(abfrage)
  //           .option({ let: { userId: benutzerId } })
  //           .exec();

  //         this.#logger.debug('Ergebnis für Abfrage %s: %o', abfrageSchlüssel, ergebnis);

  //         // Speichere das Ergebnis unter dem jeweiligen Abfrageschlüssel
  //         ergebnisse[abfrageSchlüssel] = ergebnis;
  //       } catch (fehler) {
  //         this.#logger.error('Fehler bei Abfrage %s: %o', abfrageSchlüssel, fehler);
  //       }
  //     }

  //     return ergebnisse;
  //   } catch (fehler) {
  //     if (fehler instanceof Error) {
  //       this.#logger.error(`Fehler bei der Ausführung der Abfragen im Prozess ${prozessId}: ${fehler.message}`);
  //     } else {
  //       this.#logger.error(`Unbekannter Fehler bei der Ausführung der Abfragen im Prozess ${prozessId}: ${JSON.stringify(fehler)}`);
  //     }
  //     throw fehler;
  //   }
  // }

  async führeAlleAbfragenAus(prozessId: string, userId: string): Promise<Record<string, any>> {
    this.#logger.debug('führeAlleAbfragenAus: prozessId=%s, benutzerId=%s', prozessId, userId);

    // Prozess abrufen
    const prozess = await this.findProcessByPid(prozessId);
    this.#logger.debug('führeAlleAbfragenAus: prozess=%o', prozess);
    if (!prozess || !prozess.roles) {
      throw new Error('Keine Abfragen für diesen Prozess gefunden');
    }

    const ergebnisse: Record<string, any> = {};

    // Extrahiere die Rollen-IDs
    const roleIds = prozess.roles.flatMap(role => Object.values(role)); // ["AS", "VG"]
    this.#logger.debug('führeAlleAbfragenAus: roleIds=%o', roleIds);

    // Rollen aus der Datenbank abrufen
    const roles = await this.#roleModel.find({ roleId: { $in: roleIds } }).exec();
    this.#logger.debug('führeAlleAbfragenAus: roles=%o', roles);

    if (roles.length === 0) {
      this.#logger.warn('Keine Rollen in der Datenbank gefunden für roleIds: %o', roleIds);
    }

    // Map erstellen, um Rollen effizient nach roleId zu finden
    const rolesMap = new Map(roles.map(role => [role.roleId, role]));
    this.#logger.debug('führeAlleAbfragenAus: rolesMap=%o', Array.from(rolesMap.entries()));

    const start = Date.now();

    try {
      // Iteriere über die Rollen des Prozesses
      for (const roleObj of prozess.roles) {
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
        this.#logger.debug('Verarbeite Abfrage: %s mit rollenId: %s', roleKey, roleId);

        const role = rolesMap.get(roleId);
        if (!role || !role.query) {
          this.#logger.warn('Überspringe Abfrage %s: Keine gültige Rolle gefunden (%s).', roleKey, roleId);
          continue;
        }

        const abfrage = role.query;
        if (!Array.isArray(abfrage) || abfrage.length === 0) {
          this.#logger.warn('Überspringe Abfrage %s: Ungültige oder leere Abfrage.', roleKey);
          continue;
        }

        this.#logger.debug('führeAlleAbfragenAus: abfrage=%o', abfrage);

        try {
          // Zeitmessung für die Aggregation
          const aggregationStart = Date.now();
          const ergebnis = await this.#functionModel.aggregate(abfrage)
            .option({ let: { userId } })
            .exec();
          const aggregationTime = Date.now() - aggregationStart;

          ergebnisse[roleKey] = ergebnis;
          this.#logger.debug('Ergebnis für Abfrage %s: %o (Dauer: %d ms)', roleKey, ergebnis, aggregationTime);
        } catch (fehler) {
          this.#logger.error('Fehler bei Abfrage %s: %o', roleKey, fehler);
        }
      }

      return ergebnisse;
    } catch (fehler) {
      if (fehler instanceof Error) {
        this.#logger.error(`Fehler bei der Verarbeitung: ${fehler.message}`);
      } else {
        this.#logger.error(`Unbekannter Fehler: ${JSON.stringify(fehler)}`);
      }
      throw fehler;
    } finally {
      this.#logger.info(`Verarbeitung abgeschlossen in ${Date.now() - start}ms`);
    }
  }





}

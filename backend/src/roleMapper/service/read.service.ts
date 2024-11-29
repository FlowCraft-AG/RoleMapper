import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { getLogger } from '../../logger/logger.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { FunctionDocument } from '../model/entity/function.entity.js';

@Injectable()
export class ReadService {
  readonly #logger = getLogger(ReadService.name);
  readonly #userModel: Model<UserDocument>;
  readonly #processModel: Model<ProcessDocument>;
  readonly #functionModel: Model<FunctionDocument>;

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Process.name) processModel: Model<ProcessDocument>,
    @InjectModel(Function.name) functionModel: Model<FunctionDocument>
  ) {
    this.#processModel = processModel;
    this.#userModel = userModel;
    this.#functionModel = functionModel;
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
  async führeAbfrageAus(prozessId: string, abfrage: string, userId: string): Promise<any> {
    this.#logger.debug('führeAbfrageAus: prozessId=%s, abfrage=%s, userId=%s', prozessId, abfrage, userId);

    const process = await this.findProcessByPid(prozessId);
    if (!process || !process.queries?.[abfrage]) {
      throw new Error('Query not found');
    }

    const query = process.queries[abfrage];
    if (!query) {
      this.#logger.error(`Abfrage ${abfrage} im Prozess ${prozessId} nicht gefunden.`);
      throw new Error('Abfrage nicht gefunden');
    }

    this.#logger.debug('führeAbfrageAus: query:%o', query)

    try {
      const result = await this.#functionModel.aggregate(query)
        .option({ let: { userId } })
        .exec();

      this.#logger.debug('führeAbfrageAus: result=%o', result);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(`Fehler bei der Ausführung der Abfrage ${abfrage} im Prozess ${prozessId}: ${error.message}`);
      } else {
        this.#logger.error(`Unbekannter Fehler bei der Ausführung der Abfrage ${abfrage} im Prozess ${prozessId}: ${JSON.stringify(error)}`);
      }
      throw error;
    }
  }


    async führeAlleAbfragenAus(prozessId: string, benutzerId: string): Promise < Record < string, any >> {
      this.#logger.debug('führeAlleAbfragenAus: prozessId=%s, benutzerId=%s', prozessId, benutzerId);

      // Suche den Prozess anhand seiner ID
      const prozess = await this.findProcessByPid(prozessId);
      if(!prozess || !prozess.queries) {
      throw new Error('Keine Abfragen für diesen Prozess gefunden');
    }

    const ergebnisse: Record<string, any> = {};

    this.#logger.debug('führeAlleAbfragenAus: queries=%o', Object.keys(prozess.queries));

    try {
      // Iteriere über alle Abfragen und führe sie aus
      for (const [abfrageSchlüssel, abfrage] of Object.entries(prozess.queries)) {
        this.#logger.debug('Verarbeite Abfrage: %s', abfrageSchlüssel);

        const ergebnis = await this.#functionModel.aggregate(abfrage)
          .option({ let: { userId: benutzerId } })
          .exec();

        this.#logger.debug('Ergebnis für Abfrage %s: %o', abfrageSchlüssel, ergebnis);

        // Speichere das Ergebnis unter dem jeweiligen Abfrageschlüssel
        ergebnisse[abfrageSchlüssel] = ergebnis;
      }

      return ergebnisse;
    } catch (fehler) {
      if (fehler instanceof Error) {
        this.#logger.error(`Fehler bei der Ausführung der Abfragen im Prozess ${prozessId}: ${fehler.message}`);
      } else {
        this.#logger.error(`Unbekannter Fehler bei der Ausführung der Abfragen im Prozess ${prozessId}: ${JSON.stringify(fehler)}`);
      }
      throw fehler;
    }
  }


}

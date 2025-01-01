import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

/**
 * Definiert das Subschema für die Student-Entität.
 */
/**
 * Die Klasse `Student` repräsentiert einen Studenten mit verschiedenen Eigenschaften.
 *
 * @property {string} courseOfStudy - Der Studiengang des Studenten.
 * @property {string} courseOfStudyUnique - Eine eindeutige Kennung für den Studiengang.
 * @property {string} courseOfStudyShort - Eine Kurzbezeichnung für den Studiengang.
 * @property {string} courseOfStudyName - Der Name des Studiengangs.
 * @property {string} level - Das Level oder die Stufe des Studenten.
 * @property {string} examRegulation - Die Prüfungsordnung des Studenten.
 * @property {mongoose.Types.ObjectId} _id - Die eindeutige ID des Studenten.
 */
class Student {
    @Prop({ required: true })
    courseOfStudy!: string;

    @Prop({ required: true })
    courseOfStudyUnique!: string;

    @Prop({ required: true })
    courseOfStudyShort!: string;

    @Prop({ required: true })
    courseOfStudyName!: string;

    @Prop({ required: true })
    level!: string;

    @Prop({ required: true })
    examRegulation!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id?: mongoose.Types.ObjectId;
}

/**
 * Definiert das Subschema für das Profil des Benutzers.
 * Das Profil enthält Informationen wie Vorname und Nachname.
 * Diese Informationen sind für alle Benutzer verfügbar.
 *
 * @property {string} firstName - Der Vorname des Benutzers.
 * @property {string} lastName - Der Nachname des Benutzers.
 */
class Profile {
    @Prop({ required: true })
    firstName!: string;

    @Prop({ required: true })
    lastName!: string;
}

/**
 * Definiert das Subschema für die Employee-Entität.
 */
/**
 * Die Klasse `Employee` repräsentiert einen Mitarbeiter mit verschiedenen Eigenschaften.
 *
 * @property {string} costCenter - Das Kostenstellenzentrum des Mitarbeiters.
 * @property {string} department - Die Abteilung des Mitarbeiters.
 */
class Employee {
    @Prop({ required: true })
    costCenter!: string;

    @Prop({ required: true })
    department!: string;
}

/**
 * Definiert das Schema für die User-Entität.
 */
/**
 * Repräsentiert einen Benutzer in der Datenbank.
 *
 * @schema HKA_Users
 * @timestamps true
 */
@Schema({ collection: 'HKA_Users' })
export class User extends Document {
    /**
     * Eindeutige Benutzer-ID.
     * @type {string}
     * @required
     */
    userId!: string;

    /**
     * Typ des Benutzers (z.B. Student, Mitarbeiter).
     * @type {string}
     * @required
     */
    userType!: string;

    /**
     * Rolle des Benutzers (z.B. Admin, User).
     * @type {string}
     * @required
     */
    userRole!: string;

    /**
     * Organisationseinheit des Benutzers.
     * @type {string}
     * @required
     */
    orgUnit!: string;

    /**
     * Gibt an, ob der Benutzer aktiv ist.
     * @type {boolean}
     * @required
     * @default true
     */
    active!: boolean;

    /**
     * Datum, ab dem der Benutzer gültig ist.
     * @type {Date}
     * @required
     */
    validFrom!: Date;

    /**
     * Datum, bis zu dem der Benutzer gültig ist.
     * @type {Date}
     * @required
     */
    validUntil!: Date;

    /**
     * Profil des Benutzers.
     * @type {Profile}
     * @required
     */
    profile!: Profile;

    /**
     * Optionales Studentenobjekt, falls der Benutzer ein Student ist.
     * @type {Student}
     * @optional
     */
    student?: Student;

    /**
     * Optionales Mitarbeiterobjekt, falls der Benutzer ein Mitarbeiter ist.
     * @type {Employee}
     * @optional
     */
    employee?: Employee;
}

/**
 * @typedef {User & Document} UserDocument
 *
 * @description
 * Diese Typdefinition kombiniert die Eigenschaften des `User`-Modells mit denen des `Document`-Interfaces.
 * Sie wird verwendet, um sicherzustellen, dass ein `User`-Objekt auch alle Eigenschaften und Methoden eines Mongoose-Dokuments besitzt.
 */
export type UserDocument = User & Document;
/**
 * @const USER_SCHEMA
 * @description Diese Konstante erstellt ein Schema für die User-Klasse mithilfe der SchemaFactory.
 */
export const USER_SCHEMA = SchemaFactory.createForClass(User);

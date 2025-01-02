/**
 * Typdefinition für einen Benutzer (User).
 * Dieser Typ beschreibt die Eigenschaften eines Benutzers im System.
 */
export type User = {
  _id: string; // Eindeutige ID des Benutzers
  userId: string; // Benutzer-ID
  userType: string; // Typ des Benutzers (z. B. Mitarbeiter, Student)
  userRole: string; // Rolle des Benutzers im System
  orgUnit: string; // Zugehörige Organisationseinheit
  active: boolean; // Gibt an, ob der Benutzer aktiv ist
  validFrom: string; // Gültigkeitsbeginn des Benutzers
  validUntil: string; // Gültigkeitsende des Benutzers
  profile?: Profile; // Optionale Profildaten des Benutzers
  employee?: Employee; // Optionale Mitarbeiter-spezifische Daten
  student?: Student; // Optionale Studenten-spezifische Daten
};

/**
 * Typdefinition für die Profildaten eines Benutzers.
 */
type Profile = {
  firstName: string; // Vorname des Benutzers
  lastName: string; // Nachname des Benutzers
};

/**
 * Typdefinition für Mitarbeiter-spezifische Daten.
 */
type Employee = {
  costCenter: string; // Kostenstelle des Mitarbeiters
  department: string; // Abteilung des Mitarbeiters
};

/**
 * Typdefinition für Studenten-spezifische Daten.
 */
type Student = {
  _id?: string; // Optionale ID des Studenten
  courseOfStudy: string; // Studiengang des Studenten
  courseOfStudyUnique: string; // Eindeutige Kennung des Studiengangs
  courseOfStudyShort: string; // Abkürzung des Studiengangs
  courseOfStudyName: string; // Vollständiger Name des Studiengangs
  level: string; // Studienlevel (z. B. Bachelor, Master)
  examRegulation: string; // Prüfungsordnung
};

/**
 * Typdefinition für eine Kurzversion eines Benutzers (ShortUser).
 * Wird verwendet, wenn nur grundlegende Benutzerdaten benötigt werden.
 */
export type ShortUser = {
  _id: string; // Eindeutige ID des Benutzers
  userId: string; // Benutzer-ID
  profile: Profile; // Profildaten (Vor- und Nachname)
};

/**
 * Enum zur Beschreibung von Benutzereigenschaften.
 * Diese Werte können für dynamische Auswahloptionen (z. B. Select-Elemente) verwendet werden.
 */
export enum UserEnum {
  UserId = 'userId', // Benutzer-ID
  UserType = 'userType', // Typ des Benutzers
  UserRole = 'userRole', // Rolle des Benutzers
  OrgUnit = 'orgUnit', // Zugehörige Organisationseinheit
  Active = 'active', // Gibt an, ob der Benutzer aktiv ist
  ValidFrom = 'validFrom', // Gültigkeitsbeginn des Benutzers
  ValidUntil = 'validUntil', // Gültigkeitsende des Benutzers
  Employee = 'employee', // Mitarbeiterdaten
  CostCenter = 'costCenter', // Kostenstelle (nur für Mitarbeiter)
  Department = 'department', // Abteilung (nur für Mitarbeiter)
  Student = 'student', // Studentendaten
  CourseOfStudy = 'courseOfStudy', // Studiengang
  CourseOfStudyUnique = 'courseOfStudyUnique', // Eindeutige Kennung des Studiengangs
  CourseOfStudyShort = 'courseOfStudyShort', // Abkürzung des Studiengangs
  CourseOfStudyName = 'courseOfStudyName', // Vollständiger Name des Studiengangs
  Level = 'level', // Studienlevel (Bachelor, Master etc.)
  ExamRegulation = 'examRegulation', // Prüfungsordnung
}

/**
 * Extrahiert die Werte des UserEnum als Array von Strings.
 * Kann verwendet werden, um dynamische Auswahloptionen (z. B. in Formularen) zu erstellen.
 *
 * @returns {string[]} - Eine Liste der Enum-Werte als Strings.
 */
export const getEnumValues = (): string[] => {
  return Object.values(UserEnum).filter(
    (value) => typeof value === 'string',
  ) as string[];
};

import { User } from './user.type';

/**
 * Typdefinition für eine Funktion (Function).
 * Beschreibt die Eigenschaften einer Funktion im System.
 */
export type Function = {
  _id: string; // Eindeutige ID der Funktion
  functionName: string; // Name der Funktion
  users: string[]; // Liste der Benutzer-IDs, die mit der Funktion verknüpft sind
  orgUnit: string; // ID der Organisationseinheit, zu der die Funktion gehört
  isSingleUser: boolean; // Gibt an, ob die Funktion auf einen einzelnen Benutzer beschränkt ist
  isImpliciteFunction: boolean; // Gibt an, ob die Funktion implizit (automatisch generiert) ist
};

/**
 * Typdefinition für eine vereinfachte Funktion (ShortFunction).
 * Wird verwendet, wenn nur grundlegende Informationen einer Funktion benötigt werden.
 */
export type ShortFunction = {
  _id?: string; // Optionale eindeutige ID der Funktion
  functionName: string; // Name der Funktion
  users: User[]; // Liste der Benutzer, die mit der Funktion verknüpft sind
  isImpliciteFunction: boolean; // Gibt an, ob die Funktion implizit (automatisch generiert) ist
};

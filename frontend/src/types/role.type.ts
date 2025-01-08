/**
 * Typdefinition für eine Rolle (Role).
 * Beschreibt die Eigenschaften einer Rolle im System.
 */
export type Role = {
    _id: string; // Eindeutige ID der Rolle
    name: string; // Name der Rolle
    roleId: string; // Kennung der Rolle
    query?: Query[]; // Optionale Liste von Abfragen, die mit der Rolle verknüpft sind
  };
  
  /**
   * Typdefinition für eine Query (Abfrage).
   * Beschreibt die Struktur einer Abfrage, die mit einer Rolle verknüpft ist.
   */
  export type Query = {
    match?: Match; // Optionale Match-Bedingung
    lookup?: Lookup; // Optionale Lookup-Operation
    unwind?: Unwind; // Optionale Unwind-Operation
    project?: Project; // Optionale Projektion
  };
  
  /**
   * Typdefinition für Match-Bedingungen.
   * Beschreibt die Bedingungen, die für eine Abfrage verwendet werden.
   */
  export type Match = {
    expr?: any; // Ausdruck für die Bedingung (beliebige Struktur)
  };
  
  /**
   * Typdefinition für eine Lookup-Operation.
   * Beschreibt eine Verknüpfung mit einer anderen Collection.
   */
  export type Lookup = {
    from: string; // Name der Ziel-Collection
    let?: Record<string, any>; // Lokale Variablen für die Pipeline
    pipeline?: Match[]; // Pipeline für die Verknüpfung
    as: string; // Name des Ergebnisfeldes
  };
  
  /**
   * Typdefinition für eine Unwind-Operation.
   * Beschreibt das Verhalten beim Entpacken eines Arrays.
   */
  export type Unwind = {
    path: string; // Pfad zum Array
    preserveNullAndEmptyArrays?: boolean; // Ob leere oder nicht existierende Arrays beibehalten werden
  };
  
  /**
   * Typdefinition für ein Projekt.
   * Beschreibt die Felder, die in einer Abfrage zurückgegeben werden.
   */
  export type Project = {
    functionName?: string; // Name der Funktion (optional)
    user?: UserDetails; // Details eines Benutzers (optional)
  };
  
  /**
   * Typdefinition für Benutzerdetails.
   * Beschreibt die Eigenschaften eines Benutzers, die in einer Projektion enthalten sein können.
   */
  export type UserDetails = {
    _id: string; // Eindeutige ID des Benutzers
    userId: string; // Benutzerkennung
    userType: string; // Typ des Benutzers
    userRole: string; // Rolle des Benutzers
    orgUnit: string; // Organisationseinheit des Benutzers
    active: boolean; // Status, ob der Benutzer aktiv ist
    validFrom?: string; // Startdatum der Gültigkeit
    validUntil?: string; // Enddatum der Gültigkeit
    employee?: string; // Mitarbeiterkennung (optional)
    profile?: string; // Profilinformationen (optional)
  };  
/**
 * Typdefinition für eine Organisationseinheit (OrgUnit).
 * Beschreibt die Eigenschaften einer Organisationseinheit im System.
 */
export type OrgUnit = {
  _id: string; // Eindeutige ID der Organisationseinheit
  name: string; // Name der Organisationseinheit
  parentId?: string; // Optionale ID der übergeordneten Organisationseinheit
  supervisor?: string; // Optionale ID des Supervisors der Organisationseinheit
  alias?: string; // Optionale Aliasbezeichnung der Organisationseinheit
  kostenstelleNr?: string; // Optionale Kostenstellen-Nummer der Organisationseinheit
  type?: string; // Typ der Organisationseinheit (z. B. Abteilung, Team)
  children?: OrgUnit[]; // Optionale Liste von untergeordneten Organisationseinheiten (rekursiv)
  hasMitglieder?: boolean; // Gibt an, ob die Organisationseinheit Mitglieder hat
};

/**
 * Typdefinition für eine vereinfachte Organisationseinheit (ShortOrgUnit).
 * Wird verwendet, wenn nur grundlegende Informationen einer Organisationseinheit benötigt werden.
 */
export type ShortOrgUnit = {
  _id: string; // Eindeutige ID der Organisationseinheit
  name: string; // Name der Organisationseinheit
  supervisor?: string;
  parentId: string | undefined; // ID der übergeordneten Organisationseinheit oder undefined
};

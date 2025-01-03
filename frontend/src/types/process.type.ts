/**
 * Typdefinition für einen Prozess (Process).
 * Beschreibt die Eigenschaften eines Prozesses im System.
 */
export type Process = {
    _id: string; // Eindeutige ID des Prozesses
    name: string; // Name des Prozesses
    parentId?: string; // Optionale ID des übergeordneten Prozesses
    roles?: Role[]; // Optionale Liste von Rollen, die mit dem Prozess verknüpft sind
    processId?: string; // Optionale Prozesskennung (z. B. für spezielle Prozesse)
    children?: Process[]; // Optionale Liste von untergeordneten Prozessen (rekursiv)
  };
  
  /**
   * Typdefinition für eine Rolle (Role), die mit einem Prozess verknüpft ist.
   */
  export type Role = {
    roleName: string; // Name der Rolle
    roleId: string; // ID der Rolle
  };
  
  /**
   * Typdefinition für einen vereinfachten Prozess (ShortProcess).
   * Wird verwendet, wenn nur grundlegende Informationen eines Prozesses benötigt werden.
   */
  export type ShortProcess = {
    _id: string; // Eindeutige ID des Prozesses
    name: string; // Name des Prozesses
    parentId: string | undefined; // ID des übergeordneten Prozesses oder undefined
  };
  
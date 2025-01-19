import { User } from './user.type';

export type RolePayloadRest = {
  roles: RoleResult[];
};

/**
 * Typ für die Nutzlast der Rollen-Abfrage.
 *
 * @property {RoleResult[]} roles - Eine Liste von Rollen mit zugeordneten Benutzern.
 */
export type RolePayload = {
  roles: RoleResult[];
};

/**
 * Interface für die Rückgabe einzelner Rollen und deren zugeordneter Benutzer.
 *
 * @property {string} roleName - Dynamischer Rollenname (z. B. "Antragssteller").
 * @property {UserWithFunction[]} users - Liste der Benutzer, die dieser Rolle zugeordnet sind.
 */
export type RoleResult = {
  /**
   * Dynamischer Rollenname (z. B. "Antragssteller").
   */
  roleName: string;
  /**
   * Benutzer, die dieser Rolle zugeordnet sind.
   */
  users: UserWithFunction[];
};

/**
 * Typ für einen Benutzer mit zugeordneter Funktion.
 *
 * @property {string} functionName - Dynamischer Funktionsname.
 * @property {User} user - Das verschachtelte Benutzerobjekt.
 */
export type UserWithFunction = {
  functionName: string | undefined; // Dynamischer Funktionsname
  user: User; // Das User-Objekt ist hier verschachtelt
};

import { User } from '../entity/user.entity.js';

/**
 * Interface für die Rückgabe einzelner Rollen und deren Benutzer.
 */
export interface RoleResult {
    /**
     * Dynamischer Rollenname (z.B. "Antragssteller").
     */
    roleName: string;

    /**
     * Benutzer, die dieser Rolle zugeordnet sind.
     */
    users: User[];
}

/**
 * Interface für die gesamte Rückgabe (z.B. für mehrere Rollen in einem Prozess).
 */
export interface RolePayload {
    /**
     * Liste der Rollen mit ihren jeweiligen Benutzern.
     */
    roles: RoleResult[];
}

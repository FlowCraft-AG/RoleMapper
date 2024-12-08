import type { User } from '../entity/user.entity.js';
import type { Links } from '../types/link.type.js';

export type RolePayload = {
    roles: RoleResult[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links?: Links;
};

/**
 * Interface für die Rückgabe einzelner Rollen und deren Benutzer.
 */
export type RoleResult = {
    /**
     * Dynamischer Rollenname (z.B. "Antragssteller").
     */
    roleName: string;
    /**
     * Benutzer, die dieser Rolle zugeordnet sind.
     */
    users: UserWithFunction[];
};

// Benutzer mit einer Funktion
export type UserWithFunction = User & {
    functionName: string; // Dynamischer Funktionsname
};

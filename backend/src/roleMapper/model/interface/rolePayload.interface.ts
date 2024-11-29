import { User } from "../entity/user.entity";


// Interface für die Rückgabe einzelner Rollen und deren Benutzer
export interface RoleResult {
  roleName: string; // Dynamischer Rollenname (z.B. "Antragssteller")
  users: User[]; // Benutzer, die dieser Rolle zugeordnet sind
}

// Interface für die gesamte Rückgabe (z.B. für mehrere Rollen in einem Prozess)
export interface RolePayload {
  roles: RoleResult[]; // Liste der Rollen mit ihren jeweiligen Benutzern
}

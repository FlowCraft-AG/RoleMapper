/**
 * Eingabeparameter für die Abfrage `getProcessRoles`.
 *
 * Diese Eingabeparameter enthalten die Informationen, die benötigt werden, um die Rollen
 * eines bestimmten Prozesses für einen Benutzer abzurufen.
 *
 * @property {string} processId - Die ID des Prozesses.
 * @property {string} userId - Die ID des Benutzers, der die Anfrage stellt.
 *
 * @example
 * ```typescript
 * const input: GetRolesInput = {
 *     processId: '12345',
 *     userId: 'user678',
 * };
 * ```
 */
export type GetRolesInput = {
    processId: string;
    userId: string;
    orgUnit?: string;
};

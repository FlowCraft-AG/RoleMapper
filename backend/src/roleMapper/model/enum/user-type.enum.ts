export enum UserType {
    employee = 'employee',
    student = 'student',
}

export const UserTypeHelper = {
    /**
     * Konvertiert einen String in das entsprechende UserType-Enum.
     * @param value - Der zu konvertierende String.
     */
    of(value: string): UserType {
        if (!value || value.trim() === '') {
            throw new Error('UserType darf nicht null oder leer sein');
        }

        const userType = Object.values(UserType).find(
            (type) => type.toLowerCase() === value.toLowerCase(),
        );

        if (userType == undefined) {
            throw new Error(`Ungültiger UserType: ${value}`);
        }

        return userType as UserType;
    },

    /**
     * Gibt den typ des Enums zurück.
     * @param userType - Das UserType-Enum.
     */
    getTyp(userType: UserType): string {
        return userType;
    },
};

export type MutationResult = {
    success: boolean;
    message?: string;
    result?: any; // Optionales Ergebnis der Mutation
    affectedCount?: number;
    warnings?: string[];
};

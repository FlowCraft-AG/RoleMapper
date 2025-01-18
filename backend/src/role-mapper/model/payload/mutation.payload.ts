import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Definiert die Struktur der Antwort für GraphQL-Mutationen.
 *
 * Diese Klasse repräsentiert die allgemeine Antwortstruktur für Mutationen und enthält
 * Informationen über den Erfolg, eine optionale Nachricht, das Ergebnis und zusätzliche
 * Metadaten wie die Anzahl der betroffenen Einträge oder Warnungen.
 */
@ObjectType()
export class MutationPayload {
    /**
     * Gibt an, ob die Mutation erfolgreich war.
     *
     * @type {boolean}
     * @example true
     */
    @Field()
    success!: boolean;

    /**
     * Eine optionale Nachricht, die zusätzliche Informationen zur Mutation enthält.
     *
     * @type {string | undefined}
     * @example "Mutation completed successfully."
     */
    @Field({ nullable: true })
    message?: string;

    /**
     * Das Ergebnis der Mutation, falls vorhanden.
     *
     * @type {any | undefined}
     * @example { id: "12345", name: "Updated Entity" }
     */
    @Field({ nullable: true })
    result?: any;

    /**
     * Die Anzahl der betroffenen Einträge durch die Mutation.
     *
     * @type {number | undefined}
     * @example 1
     */
    @Field({ nullable: true })
    affectedCount?: number;

    /**
     * Eine Liste von Warnungen, die während der Mutation aufgetreten sind.
     *
     * @type {string[] | undefined}
     * @example ["Field 'description' was truncated.", "User already exists."]
     */
    @Field(() => [String], { nullable: true })
    warnings?: string[];
}

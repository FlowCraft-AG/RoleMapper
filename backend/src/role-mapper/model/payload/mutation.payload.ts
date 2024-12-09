import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Definiert die Antwortstruktur für Mutationen in GraphQL.
 */
@ObjectType()
export class MutationPayload {
    /**
     * Gibt an, ob die Mutation erfolgreich war.
     * @type {boolean}
     */
    @Field()
    success!: boolean;

    /**
     * Eine optionale Nachricht, die zusätzliche Informationen zur Mutation enthält.
     * @type {string}
     */
    @Field({ nullable: true })
    message?: string;

    /**
     * Das Ergebnis der Mutation, falls vorhanden.
     * @type {any}
     */
    @Field({ nullable: true })
    result?: any;

    affectedCount?: number;

    warnings?: string[];
}

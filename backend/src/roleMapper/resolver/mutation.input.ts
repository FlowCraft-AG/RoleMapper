import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from './filterInput.js';

/**
 * Definiert die Eingabeparameter für Mutationen in GraphQL.
 */
@InputType()
export class MutationInput {
    /**
     * Der Name der Entität, auf die die Mutation angewendet wird.
     * @type {string}
     */
    @Field()
    entity!: string;

    /**
     * Die Art der Mutation (CREATE, UPDATE, DELETE).
     * @type {"CREATE" | "UPDATE" | "DELETE"}
     */
    @Field()
    operation!: 'CREATE' | 'UPDATE' | 'DELETE';

    /**
     * Die Daten für die Mutation (optional).
     * @type {any}
     */
    @Field({ nullable: true })
    data?: any;

    /**
     * Die Filterkriterien für die Mutation (optional).
     * @type {FilterInput}
     */
    @Field(() => FilterInput, { nullable: true })
    filter?: FilterInput;
}
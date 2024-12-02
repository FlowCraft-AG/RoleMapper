import { Field, InputType } from '@nestjs/graphql';
import { DataInputDTO } from '../model/dto/data.dto.js';
import { FilterInputDTO } from '../model/dto/filter.dto.js';

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
    data?: DataInputDTO;

    /**
     * Die Filterkriterien für die Mutation (optional).
     * @type {FilterInput}
     */
    @Field(() => FilterInputDTO, { nullable: true })
    filter?: FilterInputDTO;
}

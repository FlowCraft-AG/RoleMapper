import { Field, InputType } from '@nestjs/graphql';

/**
 * Definiert die Eingabeparameter für Filter in GraphQL-Abfragen.
 */
@InputType()
export class FilterInput {
    /**
     * Eine Liste von Filterbedingungen, die alle erfüllt sein müssen (AND).
     * @type {FilterInput[]}
     */
    @Field(() => [FilterInput], { nullable: true })
    and?: FilterInput[];

    /**
     * Eine Liste von Filterbedingungen, von denen mindestens eine erfüllt sein muss (OR).
     * @type {FilterInput[]}
     */
    @Field(() => [FilterInput], { nullable: true })
    or?: FilterInput[];

    /**
     * Eine Filterbedingung, die nicht erfüllt sein darf (NOT).
     * @type {FilterInput}
     */
    @Field(() => FilterInput, { nullable: true })
    not?: FilterInput;

    /**
     * Das Feld, auf das der Filter angewendet wird.
     * @type {string}
     */
    @Field({ nullable: true })
    field?: string;

    /**
     * Der Operator, der für den Vergleich verwendet wird (z.B. '=', '!=', '<', '>').
     * @type {string}
     */
    @Field({ nullable: true })
    operator?: string;

    /**
     * Der Wert, mit dem das Feld verglichen wird.
     * @type {any}
     */
    @Field({ nullable: true })
    value?: any;
}

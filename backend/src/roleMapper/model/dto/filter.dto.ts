import { Field, InputType } from '@nestjs/graphql';

/**
 * Mögliche Operatoren für Filterbedingungen.
 */
export type FilterOperator = 'EQ' | 'IN' | 'GTE' | 'LTE' | 'LIKE';

/**
 * Definiert die Eingabeparameter für Filter in GraphQL-Abfragen.
 */
@InputType()
export class FilterInputDTO {
    /**
     * Eine Liste von Filterbedingungen, die alle erfüllt sein müssen (AND).
     * @type {FilterInputDTO[]}
     */
    @Field(() => [FilterInputDTO], { nullable: true })
    and?: FilterInputDTO[];

    /**
     * Eine Liste von Filterbedingungen, von denen mindestens eine erfüllt sein muss (OR).
     * @type {FilterInputDTO[]}
     */
    @Field(() => [FilterInputDTO], { nullable: true })
    or?: FilterInputDTO[];

    /**
     * Eine Filterbedingung, die nicht erfüllt sein darf (NOT).
     * @type {FilterInputDTO}
     */
    @Field(() => FilterInputDTO, { nullable: true })
    not?: FilterInputDTO;

    /**
     * Das Feld, auf das der Filter angewendet wird.
     * @type {string}
     */
    @Field({ nullable: true })
    field?: string;

    /**
     * Der Operator, der für den Vergleich verwendet wird (z. B. EQ, IN, GTE, LTE, LIKE).
     * @type {FilterOperator}
     */
    @Field({ nullable: true })
    operator?: FilterOperator;

    /**
     * Der Wert, mit dem das Feld verglichen wird. Unterstützte Typen: String, Int, Float, Boolean.
     * @type {string | number | boolean | Array<string | number | boolean>}
     */
    @Field(() => String, {
        nullable: true,
        description:
            'Der Wert, mit dem das Feld verglichen wird. Unterstützte Typen: String, Int, Float, Boolean.',
    })
    value?: string | number | boolean | (string | number | boolean)[];
}

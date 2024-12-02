import { Field, InputType, registerEnumType } from '@nestjs/graphql';

/**
 * Operatoren für Filterbedingungen.
 */
export enum FilterOperator {
    EQ = '$eq',
    IN = '$in',
    GTE = '$gte',
    LTE = '$lte',
    LIKE = '$like',
}

registerEnumType(FilterOperator, {
    name: 'FilterOperator',
    description: 'Operatoren für Filterbedingungen.',
});

/**
 * Definiert die Eingabeparameter für Filter in GraphQL-Abfragen.
 */
@InputType()
export class FilterInput {
    /**
     * Eine Liste von Filterbedingungen, die alle erfüllt sein müssen (AND).
     * @type {FilterInput[]}
     */
    @Field(() => [FilterInput], {
        nullable: true,
        description: 'Eine Liste von Filterbedingungen, die alle erfüllt sein müssen (AND).',
    })
    and?: FilterInput[];

    /**
     * Eine Liste von Filterbedingungen, von denen mindestens eine erfüllt sein muss (OR).
     * @type {FilterInput[]}
     */
    @Field(() => [FilterInput], {
        nullable: true,
        description:
            'Eine Liste von Filterbedingungen, von denen mindestens eine erfüllt sein muss (OR).',
    })
    or?: FilterInput[];

    /**
     * Eine Filterbedingung, die nicht erfüllt sein darf (NOT).
     * @type {FilterInput}
     */
    @Field(() => FilterInput, {
        nullable: true,
        description: 'Eine Filterbedingung, die nicht erfüllt sein darf (NOT).',
    })
    not?: FilterInput;

    /**
     * Das Feld, auf das der Filter angewendet wird.
     * @type {string}
     */
    @Field({
        nullable: true,
        description: 'Das Feld, auf das der Filter angewendet wird.',
    })
    field?: string;

    /**
     * Der Operator, der für den Vergleich verwendet wird (z. B. EQ, IN, GTE, LTE, LIKE).
     * @type {FilterOperator}
     */
    @Field(() => FilterOperator, {
        nullable: true,
        description:
            'Der Operator, der für den Vergleich verwendet wird (z. B. EQ, IN, GTE, LTE, LIKE).',
    })
    operator?: FilterOperator;

    /**
     * Der Wert, mit dem das Feld verglichen wird. Unterstützte Typen: String, Int, Float, Boolean.
     * @type {string | number | boolean}
     */
    @Field(() => [String], {
        nullable: true,
        description:
            'Eine Liste von Werten oder ein einzelner Wert, der mit dem Feld verglichen wird.',
    })
    value?: string[] | number[] | boolean[] | string | number | boolean;
}

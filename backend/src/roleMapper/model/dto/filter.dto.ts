import { Field, InputType, registerEnumType } from '@nestjs/graphql';

/**
 * Mögliche Operatoren für Filterbedingungen.
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
export class FilterDTO {
    /**
     * Eine Liste von Filterbedingungen, die alle erfüllt sein müssen (AND).
     * @type {FilterDTO[]}
     */
    @Field(() => [FilterDTO], { nullable: true })
    and?: FilterDTO[];

    /**
     * Eine Liste von Filterbedingungen, von denen mindestens eine erfüllt sein muss (OR).
     * @type {FilterDTO[]}
     */
    @Field(() => [FilterDTO], { nullable: true })
    or?: FilterDTO[];

    /**
     * Eine Filterbedingung, die nicht erfüllt sein darf (NOT).
     * @type {FilterDTO}
     */
    @Field(() => FilterDTO, { nullable: true })
    not?: FilterDTO;

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
    @Field(() => FilterOperator, { nullable: true })
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
    value?: string | number | boolean | Array<string | number | boolean>;
}

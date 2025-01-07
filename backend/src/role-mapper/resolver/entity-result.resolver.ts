// import { Injectable } from '@nestjs/common';
// import { ResolveField, Resolver } from '@nestjs/graphql';

import { Injectable } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Resolver für die Union `EntityResult`.
 *
 * Dieser Resolver bestimmt zur Laufzeit den konkreten Typ eines Objekts innerhalb
 * der Union `EntityResult`, basierend auf dessen Eigenschaften.
 */

@Resolver('EntityResult')
@Injectable()
export class EntityResultResolver {
    /**
     * Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.
     *
     * Diese Methode überprüft die Eigenschaften des übergebenen Objekts und gibt
     * den entsprechenden Typ zurück, falls dieser erkannt wird.
     *
     * @param {Record<string, unknown>} object - Das Objekt, dessen Typ bestimmt werden soll.
     * @returns {string | undefined} Der Name des konkreten Typs (`User`, `Function`, `Process`, `Role`, `OrgUnit`),
     *                               falls erkannt; andernfalls `undefined`.
     *
     * @example
     * ```typescript
     * const type = resolver.resolveType({ userId: '123' });
     * console.log(type); // 'User'
     * ```
     */
    @ResolveField('__resolveType')
    resolveType(object: Record<string, unknown>): string | undefined {
        if (this.#isUser(object)) return 'User';
        if (this.#isFunction(object)) return 'Function';
        if (this.#isProcess(object)) return 'Process';
        if (this.#isRole(object)) return 'Role';
        if (this.#isOrgUnit(object)) return 'OrgUnit';

        console.warn('EntityResultResolver: Unbekannter Typ:', object);
        return undefined; // Standard: Nicht auflösbar
    }

    /**
     * Überprüft, ob das Objekt vom Typ `User` ist.
     * @param {Record<string, unknown>} object - Das zu überprüfende Objekt.
     * @returns {boolean} `true`, wenn das Objekt ein `User` ist, andernfalls `false`.
     */
    #isUser(object: Record<string, unknown>): object is { userId: string } {
        return typeof object.userId === 'string';
    }

    /**
     * Überprüft, ob das Objekt vom Typ `Function` ist.
     * @param {Record<string, unknown>} object - Das zu überprüfende Objekt.
     * @returns {boolean} `true`, wenn das Objekt eine `Function` ist, andernfalls `false`.
     */
    #isFunction(object: Record<string, unknown>): object is { functionName: string } {
        return typeof object.functionName === 'string';
    }

    /**
     * Überprüft, ob das Objekt vom Typ `Process` ist.
     * @param {Record<string, unknown>} object - Das zu überprüfende Objekt.
     * @returns {boolean} `true`, wenn das Objekt ein `Process` ist, andernfalls `false`.
     */
    #isProcess(object: Record<string, unknown>): object is { roles: unknown[] } {
        return (
            Array.isArray(object.roles) && object.roles.every((role) => typeof role === 'object')
        );
    }

    /**
     * Überprüft, ob das Objekt vom Typ `Role` ist.
     * @param {Record<string, unknown>} object - Das zu überprüfende Objekt.
     * @returns {boolean} `true`, wenn das Objekt eine `Role` ist, andernfalls `false`.
     */
    #isRole(object: Record<string, unknown>): object is { roleId: string } {
        return typeof object.roleId === 'string';
    }

    /**
     * Überprüft, ob das Objekt vom Typ `OrgUnit` ist.
     * @param {Record<string, unknown>} object - Das zu überprüfende Objekt.
     * @returns {boolean} `true`, wenn das Objekt eine `OrgUnit` ist, andernfalls `false`.
     */
    #isOrgUnit(object: Record<string, unknown>): object is { name: string } {
        return typeof object.name === 'string';
    }
}

// import { Injectable } from '@nestjs/common';
// import { ResolveField, Resolver } from '@nestjs/graphql';

// /**
//  * Resolver für die Union `EntityResult`.
//  * Bestimmt zur Laufzeit den konkreten Typ des Objekts basierend auf dessen Eigenschaften.
//  */
// @Resolver('EntityResult')
// @Injectable()
// export class EntityResultResolver {
//     /**
//      * Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.
//      * @param object - Das Objekt, dessen Typ aufgelöst werden soll.
//      * @returns Der Name des konkreten Typs, falls erkannt; andernfalls `undefined`.
//      */
//     @ResolveField('__resolveType')
//     resolveType(object: Record<string, unknown>): string | undefined {
//         if (typeof object.userId === 'string') return 'User';
//         if (typeof object.functionName === 'string') return 'Function';
//         if (typeof object.roles === 'string') return 'Process';
//         if (typeof object.roleId === 'string') return 'Role';
//         if (typeof object.name === 'string') return 'OrgUnit';
//         return undefined;
//     }
// }

import { Injectable } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Resolver für die Union `EntityResult`.
 * Bestimmt zur Laufzeit den konkreten Typ des Objekts basierend auf dessen Eigenschaften.
 */
@Resolver('EntityResult')
@Injectable()
export class EntityResultResolver {
    /**
     * Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.
     * @param object - Das Objekt, dessen Typ aufgelöst werden soll.
     * @returns Der Name des konkreten Typs, falls erkannt; andernfalls `undefined`.
     */
    @ResolveField('__resolveType')
    resolveType(object: Record<string, unknown>): string | undefined {
        if (this.isUser(object)) return 'User';
        if (this.isFunction(object)) return 'Function';
        if (this.isProcess(object)) return 'Process';
        if (this.isRole(object)) return 'Role';
        if (this.isOrgUnit(object)) return 'OrgUnit';

        console.warn('EntityResultResolver: Unbekannter Typ:', object);
        return undefined; // Standard: Nicht auflösbar
    }

    private isUser(object: Record<string, unknown>): object is { userId: string } {
        return typeof object.userId === 'string';
    }

    private isFunction(object: Record<string, unknown>): object is { functionName: string } {
        return typeof object.functionName === 'string';
    }

    private isProcess(object: Record<string, unknown>): object is { roles: unknown[] } {
        return (
            Array.isArray(object.roles) && object.roles.every((role) => typeof role === 'object')
        );
    }

    private isRole(object: Record<string, unknown>): object is { roleId: string } {
        return typeof object.roleId === 'string';
    }

    private isOrgUnit(object: Record<string, unknown>): object is { name: string } {
        return typeof object.name === 'string';
    }
}

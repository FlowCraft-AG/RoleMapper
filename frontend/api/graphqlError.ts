import { GraphQLError } from 'graphql';
import { redirect } from 'next/navigation.js';

export async function handleGraphQLError(
    error: any,
    message?: string,
): Promise<void> {
    if (
        error.response &&
        error.response.errors &&
        error.response.errors.length > 0
    ) {
        const errorMessage = await extractErrorMessage(
            error.response.errors[0],
        );
        if (errorMessage == 'Unauthorized') {
            alert('Dein Token ist abgelaufen');
        }

        if (errorMessage === 'Falscher Token') {
            alert(errorMessage);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            redirect('/login');
        }
        throw new Error(errorMessage);
    }
    console.error(error);
    throw new Error(
        message ? message : 'Ein unbekannter Fehler ist aufgetreten.',
    );
}

export async function extractErrorMessage(
    error: GraphQLError,
): Promise<string> {
    if (
        (error.extensions && error.extensions.code === 'BAD_USER_INPUT') ||
        error.extensions.code === 'BAD_USER_INPUT'
    ) {
        let stacktrace: string[] | undefined;

        if (Array.isArray(error.extensions.stacktrace)) {
            stacktrace = error.extensions.stacktrace as string[];
        }

        if (
            stacktrace &&
            stacktrace.length > 0 &&
            error.message === undefined
        ) {
            const firstEntry = stacktrace[0];
            const errorMessage = firstEntry
                .substring(firstEntry.indexOf(':') + 1)
                .trim();
            console.log('Unexpected BAD_USER_INPUT error:', stacktrace[0]);
            return errorMessage;
        }

        console.log(
            'Unexpected BAD_USER_INPUT error:',
            error.extensions.stacktrace,
        );
        console.error(error.message);
        return (
            error.message ||
            'Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.'
        );
    }

    return 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
}

export interface GraphqlErrorResponse {
    errors: GraphQLErrorItem[];
    data: unknown;
}

export interface GraphQLErrorItem {
    message: string;
    locations: StacktraceLocation[];
    path: string[];
    extensions: StacktraceExtension;
}

interface StacktraceLocation {
    line: number;
    column: number;
}

interface StacktraceExtension {
    code: string;
    stacktrace: string[];
}

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { MutationPayload } from '../../src/role-mapper/model/payload/mutation.payload.js';
import { ENDPOINTS, TEST_MANDATES } from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

/**
 * Prüft, ob die Antwort korrekt ist und der Content-Type JSON ist.
 * @param status - HTTP-Statuscode
 * @param headers - HTTP-Header
 */
const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

describe('WriteController REST Tests', () => {
    let client: AxiosInstance;

    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/roleMapper`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // Erlaubt Statuscodes unter 500
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Neue Entität erstellen: Funktion', async () => {
        const newFunction = TEST_MANDATES.create;

        const { status, headers, data }: AxiosResponse<MutationPayload> = await client.post(
            ENDPOINTS.MANDATES,
            newFunction,
        );

        // Assertions
        validateHeader(headers);

        expect(status).toBe(HttpStatus.CREATED);

        expect(data.success).toBe(true);
        expect(data.message).toBe('Create operation successful.');
        expect(data.result).toHaveProperty('_id');
    });

    test('Entität aktualisieren: Benutzer', async () => {
        const updateData = TEST_MANDATES.update;

        const { status, headers, data }: AxiosResponse<MutationPayload> = await client.put(
            ENDPOINTS.MANDATES,
            updateData,
        );

        // Assertions
        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Update operation successful.');
        expect(data.affectedCount).toBeGreaterThan(0);
    });

    test('Entität löschen: FUNKTION', async () => {
        const filterInput = TEST_MANDATES.delete;
        const { status, headers, data }: AxiosResponse<MutationPayload> = await client.delete(
            ENDPOINTS.MANDATES,
            { data: filterInput },
        );

        // Assertions
        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Delete operation successful.');
        expect(data.affectedCount).toBe(1);
    });

    // test('Fehler bei Erstellung einer Entität mit ungültigen Daten', async () => {
    //     const invalidData = {};

    //     const { status, headers, data }: AxiosResponse<MutationPayload> = await client.post(
    //         '/USERS',
    //         invalidData,
    //     );

    //     // Assertions
    //     validateHeader(headers);

    //     expect(status).toBe(HttpStatus.BAD_REQUEST);
    //     expect(data.success).toBe(false);
    //     expect(data.message).toBe('Entity type and data are required.');
    // });

    // test('Fehler bei Aktualisierung: Ungültiger Filter', async () => {
    //     const invalidUpdate: UpdateEntityInput = {
    //         filter: [],
    //         data: { userRole: 'admin' },
    //     };

    //     const { status, headers, data }: AxiosResponse<MutationPayload> = await client.put(
    //         '/USERS',
    //         invalidUpdate,
    //     );

    //     // Assertions
    //     validateHeader(headers);

    //     expect(status).toBe(HttpStatus.BAD_REQUEST);
    //     expect(data.success).toBe(false);
    //     expect(data.message).toBe('Entity type and update data are required.');
    // });

    // test('Fehler bei Löschen einer nicht existierenden Entität', async () => {
    //     const nonExistentFilters: FilterInput[] = [
    //         { field: 'userId', operator: 'EQ', value: 'nonexistentuser' },
    //     ];

    //     const { status, headers, data }: AxiosResponse<MutationPayload> = await client.delete(
    //         '/USERS',
    //         { data: nonExistentFilters },
    //     );

    //     // Assertions
    //     validateHeader(headers);

    //     expect(status).toBe(HttpStatus.OK);
    //     expect(data.success).toBe(false);
    //     expect(data.message).toBe('No documents matched the filter');
    //     expect(data.affectedCount).toBe(0);
    // });
});

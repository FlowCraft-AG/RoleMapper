import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { RolePayload } from '../../src/roleMapper/controller/read.controller.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const DA0001_MUUD0001 = '/process-roles?processId=DA0001&userId=muud0001';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('GET /rest/:id', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/roleMapper`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Bankkonto zu vorhandener ID', async () => {
        // given
        const url = `${DA0001_MUUD0001}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        console.log(data);
    });
});

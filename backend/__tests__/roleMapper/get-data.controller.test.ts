import { afterAll, beforeAll, describe } from '@jest/globals';
import axios, { type AxiosInstance } from 'axios';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------

const DIENSTREISEANTRAG = 'DA0001';
const REISEKOSTENANTRAG = 'RA0001';
const USER1 = 'muud0001';
const USER2 = 'rost0001';
const UNGÜLTIGER_PROZESS = 'DA0000';
const UNGÜLTIGER_USER = 'muud0000';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
describe('get Data', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/roleMapper/process-roles`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });
});

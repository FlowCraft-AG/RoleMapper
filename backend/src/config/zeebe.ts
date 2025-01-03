import { ZBClient } from 'zeebe-node';
import { config } from './app.js';

const { zeebe } = config;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export const zbClient = new ZBClient((zeebe?.url as string | undefined) ?? 'localhost:26500'); // URL zum Zeebe-Broker

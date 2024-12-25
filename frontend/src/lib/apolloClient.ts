import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENV } from '../utils/env';
const serverUri = ENV.NEXT_PUBLIC_BACKEND_SERVER_URL as string;
const clientUri = ENV.NEXT_PUBLIC_BACKEND_CLIENT_URL as string;

console.log('ApolloClient serverUri:', serverUri);
console.log('ApolloClient clientUri:', clientUri);

const serverHttpLink = createHttpLink({
  uri: serverUri,
  fetchOptions: {
    mode: 'cors', // Hier kannst du CORS oder andere Fetch-Optionen angeben
  },
});

const clientHttpLink = createHttpLink({
  uri: clientUri,
  fetchOptions: {
    mode: 'cors', // Hier kannst du CORS oder andere Fetch-Optionen angeben
  },
});

export const client = new ApolloClient({
  link: clientHttpLink,
  cache: new InMemoryCache(),
});

export const serverClient = new ApolloClient({
  link: serverHttpLink,
  cache: new InMemoryCache(),
});

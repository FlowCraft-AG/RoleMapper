import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENV } from '../utils/env';

const httpLink = createHttpLink({
  uri: ENV.NEXT_PUBLIC_BACKEND_SERVER_URL as string,
  fetchOptions: {
    mode: 'cors', // Hier kannst du CORS oder andere Fetch-Optionen angeben
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;

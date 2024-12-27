import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENV } from '../utils/env';
const uri = ENV.NEXT_PUBLIC_BACKEND_SERVER_URL as string;

const serverHttpLink = createHttpLink({
  uri,
  fetchOptions: {
    mode: 'cors', // Hier kannst du CORS oder andere Fetch-Optionen angeben
  },
});

const client = new ApolloClient({
  link: serverHttpLink,
  cache: new InMemoryCache(),
});

export default client;

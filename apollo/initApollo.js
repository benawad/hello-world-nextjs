import { ApolloClient, createNetworkInterface } from "react-apollo";
import fetch from "isomorphic-fetch";
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";

const uri = "http://localhost:3000/graphql";
const subscriptionUri = "ws://localhost:3000/subscriptions";

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(headers, initialState, ni) {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface: ni || createNetworkInterface({ uri })
  });
}

export default function initApollo(headers, initialState = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(headers, initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    const wsClient = new SubscriptionClient(subscriptionUri, {
      reconnect: true
    });
    const networkInterface = createNetworkInterface({
      uri
    });
    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
      networkInterface,
      wsClient
    );

    apolloClient = create(
      headers,
      initialState,
      networkInterfaceWithSubscriptions
    );
  }

  return apolloClient;
}

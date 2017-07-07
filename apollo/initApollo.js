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
  let networkInterface = ni;
  if (!ni) {
    networkInterface = createNetworkInterface({ uri })
    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        console.log('middleware called! 1');
        // if (apolloClient) {
        //   req.options.headers['x-token'] = localStorage.getItem('token');
        //   req.options.headers['x-refresh-token'] = localStorage.getItem('refreshToken');
        // }

        next();
      }
    }]);
  }

  return new ApolloClient({
    initialState,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface,
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

    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        console.log('middleware called! 2');
        // if (apolloClient) {
        //   req.options.headers['x-token'] = localStorage.getItem('token');
        //   req.options.headers['x-refresh-token'] = localStorage.getItem('refreshToken');
        // }

        next();
      }
    }]);

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

import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { IS_BROWSER, NODE_ENV } from "../lib/environment";
import getConfig from "next/config";
import Cookies from "js-cookie";

import { setContext } from "apollo-link-context";

import { createHttpLink } from 'apollo-link-http';


const { publicRuntimeConfig } = getConfig();
const { BACKEND_HOST, BACKEND_PORT, PUBLIC_API_URL, TYK_HOST, TYK_PORT } = publicRuntimeConfig;
//console.log(publicRuntimeConfig)

let apolloClient = null;

function create(initialState) {
  let URL;
  const JWT = IS_BROWSER && Cookies.get("jwtToken");
  const temp = JWT !== null ? `Bearer ${JWT}` : null;

  console.log(temp);
  if (NODE_ENV === "production") {
    URL = PUBLIC_API_URL;
  } else {
    console.log(`
    NODE_ENV: ${NODE_ENV}
    BACKEND_HOST: ${BACKEND_HOST}
    BACKEND_PORT: ${BACKEND_PORT}
    TYK_HOST: ${TYK_HOST}
    TYK_PORT: ${TYK_PORT}
    PUBLIC_API_URL: ${PUBLIC_API_URL}

  `);

    URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

  }

  const authLink = setContext((_) => {
    // get the authentication token from local storage if it exists
    const token = Cookies.get('jwtToken');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const httpLink = createHttpLink({
    uri: URL,
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient

}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}

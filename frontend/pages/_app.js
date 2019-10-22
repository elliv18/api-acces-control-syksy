import App, { Container } from "next/app";
import React from "react";
import Head from "next/head";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "react-apollo";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext from "../src/getPageContext";

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    //poistaa tokenin kun selain suljetaan
    //window.localStorage.removeItem('jwtToken')
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>Borrowd - Lainausjärjestelmä</title>
        </Head>

        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
          <ApolloProvider client={apolloClient}>
            <Component pageContext={this.pageContext} {...pageProps} />
          </ApolloProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);

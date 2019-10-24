import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";

import App, { Container } from "next/app";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "react-apollo";
import getPageContext from "../src/getPageContext";

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>My page</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ApolloProvider client={this.props.apolloClient}>
            <Component pageContext={this.pageContext} {...pageProps} />
          </ApolloProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withApolloClient(MyApp);

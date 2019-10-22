import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../lib/gql/queries";
import { LOGIN_MUTATION } from "../lib/gql/mutations";
import Cookies from "js-cookie";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      x: undefined
    };
  }
  getInitialProps = ctx => {
    const apolloClient = ctx.apolloClient;
    console.log("TESTI", apolloClient);
  };

  async componentDidMount() {
    const { data } = await this.state.client.mutate({
      variables: {
        email: "1",
        password: "1"
      },
      mutation: LOGIN_MUTATION
    });

    console.log("JWT", data.login.jwt);

    await Cookies.set("jwtToken", data.login.jwt);

    let temp = null;
    temp = await this.state.client
      .query({
        query: USERS_QUERY
      })
      .then(res => {
        console.log(res);
        this.setState({ x: temp });
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      console.log("client", this.state.client),
      (
        <div>
          <h1>TERVETULOA!</h1>
        </div>
      )
    );
  }
}

export default withApollo(Home);

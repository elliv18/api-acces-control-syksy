import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";
import Cookies from "js-cookie";
import chekLogIn from "../../src/components/checkLogIn";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      loggedIn: chekLogIn()
    };
  }
  getInitialProps = ctx => {
    const apolloClient = ctx.apolloClient;
    console.log("TESTI", apolloClient);
  };

  async componentDidMount() {
    console.log(this.state.loggedIn);
    await this.state.client
      .query({
        query: USERS_QUERY
      })
      .then(res => {
        console.log(res);
      })
      .catch(e => console.log(e));
  }

  render() {
    const { loggedIn } = this.state;
    if (loggedIn) {
      return (
        <div>
          <h1>TERVETULOA!</h1>;
        </div>
      );
    } else return null;
  }
}

export default withApollo(Home);

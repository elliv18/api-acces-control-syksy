import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";
import Cookies from "js-cookie";
import chekLogIn from "../../src/components/checkLogIn";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import logOut from '../../src/components/logOut'
import NotAuth from './NotAuth'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 50
  }
});

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

  handleLogOut = () => {
    console.log("CLICK");
    logOut()
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
    const { classes } = this.props;
    if (loggedIn) {
      return (
        <Paper className={classes.paper}>
          <h3>ETUSIVU</h3>
          <Button onClick={() => this.handleLogOut()}>LOG OUT</Button>
        </Paper>
      );
    } else {
      return <NotAuth />;
    }
  }
}

export default withStyles(styles)(withApollo(Home));

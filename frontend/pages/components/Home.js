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
import NoSsr from '../../src/components/disbaleSsr'
import { CURRENTUSER } from "../../lib/gql/mutations";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 50
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      email: undefined

    };
  }
  /*
 
   handleLogOut = () => {
     console.log("CLICK");
     logOut()
   };*/
  /*
    async componentDidMount() {
  
      await this.state.client
        .mutate({
          mutation: CURRENTUSER
        }).then(res => {
          console.log(res)
          this.setState({ email: res.data.currentUser.email })
        })
        .catch(e => console.log(e))
  
    }*/

  render() {
    const { email } = this.state;
    const { classes } = this.props;

    return (
      <div>


        <Paper className={classes.paper}>
          <h3>ETUSIVU</h3>
        </Paper>

      </div>

    );

  }
}

export default withStyles(styles)(withApollo(Home));



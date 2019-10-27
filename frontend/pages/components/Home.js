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
import NoSsr from '../../src/components/disableSsr'
import { CURRENTUSER } from "../../lib/gql/mutations";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AdminHome from './AdminHome'
import UserHome from './UserHome'
import { homeStyle } from './Styles'

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      isAdmin: undefined

    };
  }
  /*
 
   handleLogOut = () => {
     console.log("CLICK");
     logOut()
   };*/

  async componentDidMount() {

    let CU = undefined
    await this.state.client
      .mutate({
        mutation: CURRENTUSER
      }).then(res => {
        console.log(res)
        //this.setState({ email: res.data.currentUser.email })
        CU = res.data.currentUser
      })
      .catch(e => console.log(e))

    await this.setState({ isAdmin: isAdmin(CU) })
  }

  render() {
    const { isAdmin } = this.state;
    const { classes } = this.props;

    return (
      console.log('isadmin', isAdmin),
      isAdmin !== undefined ?
        isAdmin ? <AdminHome /> : <UserHome /> : null

    );

  }
}

export default withStyles(homeStyle)(withApollo(Home));


function isAdmin(CU) {
  let userType = undefined
  if (CU !== undefined) {

    userType = CU.userType
    console.log(userType)
    if (userType === 'ADMIN')
      return true
    else
      return false;
  }

}
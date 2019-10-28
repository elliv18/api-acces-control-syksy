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

const { Consumer } = React.createContext();

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      isAdmin: []
    };
  }
  /*
 
   handleLogOut = () => {
     console.log("CLICK");
     logOut()
   };*/

  /* async componentDidMount() {
 
     let CU = undefined
     await this.state.client
       .mutate({
         mutation: CURRENTUSER
       }).then(res => {
         //console.log(res)
         CU = res.data.currentUser
       })
       .catch(e => null)
 
     console.log('jkjkj', this.props.paska)
 
     this.setState({ isAdmin: isAdmin(CU) })
   }*/

  componentDidMount() {
    this.props.CU.then(res => {
      console.log(res.userType)
      this.setState({ isAdmin: res.userType })
    })
  }
  render() {
    const { isAdmin } = this.state;
    const { classes } = this.props;

    return (
      //console.log('isadmin', isAdmin),
      isAdmin !== undefined ?
        isAdmin === 'ADMIN' ? <AdminHome /> : <UserHome /> : null

    );

  }
}

export default withStyles(homeStyle)(withApollo(Home));


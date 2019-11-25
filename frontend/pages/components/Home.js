import React from "react";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/styles";
import { CURRENTUSER } from "../../lib/gql/mutations";

import AdminHome from './AdminHome'
import UserHome from './UserHome'
import { homeStyle } from './Styles'
import getConfig from 'next/config'
import Router from 'next/router'

const { Consumer } = React.createContext();
const { publicRuntimeConfig } = getConfig();
const { TYK_PORT, TYK_HOST } = publicRuntimeConfig;

const TYK = { TYK_HOST, TYK_PORT }

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      userType: null,
    };
  }



  render() {
    const { userType } = this.state;
    const { classes } = this.props;

    if (this.props.currentUser.userType === 'ADMIN') {
      return <AdminHome
        userType={userType}
        switchState={this.props.switchState}
        TYK={TYK}
      />
    }
    else if (this.props.currentUser.userType === 'USER') {
      return <UserHome
        TYK={TYK}
        currentUser={this.props.currentUser}
      />
    }
    else {
      return null
    }

  }
}

export default withStyles(homeStyle)(withApollo(Home));


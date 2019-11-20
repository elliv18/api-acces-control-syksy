import React from "react";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/styles";
import { CURRENTUSER } from "../../lib/gql/mutations";

import AdminHome from './AdminHome'
import UserHome from './UserHome'
import { homeStyle } from './Styles'

import Router from 'next/router'

const { Consumer } = React.createContext();

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
      return <AdminHome userType={userType} switchState={this.props.switchState} />
    }
    else if (this.props.currentUser.userType === 'USER') {
      <AdminHome currentUser={this.props.currentUser} />
      return <UserHome
        currentUser={this.props.currentUser}
      />
    }
    else {
      return null
    }

  }
}

export default withStyles(homeStyle)(withApollo(Home));


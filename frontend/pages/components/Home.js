import React from "react";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/styles";
import { CURRENTUSER } from "../../lib/gql/mutations";

import AdminHome from './AdminHome'
import UserHome from './UserHome'
import { homeStyle } from './Styles'

const { Consumer } = React.createContext();

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      userType: null
    };
  }


  async componentDidMount() {

    let CU = undefined
    await this.state.client
      .mutate({
        mutation: CURRENTUSER
      }).then(res => {
        //console.log(res)
        CU = res.data.currentUser
      })
      .catch(e => null)
    this.setState({ userType: CU.userType })
  }


  render() {
    const { userType } = this.state;
    const { classes } = this.props;

    if (userType === 'ADMIN') {
      return <AdminHome />
    }
    else if (userType === 'USER') {
      return <UserHome />
    }
    else {
      return null
    }

  }
}

export default withStyles(homeStyle)(withApollo(Home));


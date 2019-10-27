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

import { homeStyle } from './Styles'

class Home extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            email: undefined

        };
    }

    render() {
        const { email } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <Paper className={classes.paper}>
                    <h3>ETUSIVU ADMIN</h3>
                </Paper>

            </div>

        );

    }
}

export default withStyles(homeStyle)(withApollo(Home));



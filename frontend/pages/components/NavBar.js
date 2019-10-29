import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";
import Cookies from "js-cookie";
import chekLogIn from "../../src/components/checkLogIn";
import { Paper, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import logOut from '../../src/components/logOut'
import NotAuth from './NotAuth'
import CheckLogIn from '../../src/components/checkLogIn'
import { CURRENTUSER } from "../../lib/gql/mutations";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Router from 'next/router'
const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        minWidth: 300,
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

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            currentUser: [],
            anchorEl: null
            // loggedIn: chekLogIn()
        };
    }


    handleLogOut = () => {
        console.log("CLICK");
        logOut()
    };

    // menu handlers

    handleClickOpenMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl: null })
    };

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

        // check cu if backend is down
        CU
            ? this.setState({ currentUser: CU })
            : Router.push('/')
    }

    render() {
        const { anchorEl, currentUser } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CheckLogIn>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                Welcome {currentUser ? currentUser.email : null}
                            </Typography>
                            {currentUser.userType === 'ADMIN'
                                ? <IconButton color="inherit" onClick={this.handleClickOpenMenu}>
                                    <MenuIcon />
                                </IconButton>
                                :
                                <Button variant="outlined" onClick={this.handleLogOut}>
                                    Logout
                                </Button>
                            }
                        </Toolbar>
                    </AppBar>

                    {this.props.children}
                </CheckLogIn>


                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseMenu}
                >
                    <MenuItem onClick={this.handleCloseMenu}>
                        <Link href={'/home'} style={{ width: '100%' }}>
                            Home
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleCloseMenu}>
                        <Link href={'/createAdmin'}>
                            Create admin
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                </Menu>
            </div>

        );

    }
}

export default withStyles(styles)(withApollo(NavBar));

import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";
import Cookies from "js-cookie";
import chekLogIn from "../../src/components/CheckLogIn";
import { Paper, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import NotAuth from './NotAuth'
import { CURRENTUSER } from "../../lib/gql/mutations";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Router from 'next/router'

import { navStyles } from './Styles'
import ConfirmDialog from "./ConfirmDialog";
import DialogResetPw from "./DialogResetPw";
import App from "./App";
import NoSsr from '../../src/components/disableSsr'

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            currentUser: [],
            anchorEl: null,
            open: false
            // loggedIn: chekLogIn()
        };
    }


    handleLogOut = () => {
        Cookies.remove("jwtToken");
        Router.push('/')
    };

    // menu handlers

    handleClickOpenMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl: null })
    };

    handleOpenDialog = () => {
        this.setState({ anchorEl: null, open: true })
    };
    handleCloseDialog = () => {
        this.setState({ anchorEl: null, open: false })
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
        const { anchorEl, currentUser, open } = this.state;
        const { classes } = this.props;

        return (
            <App>
                <div className={classes.root}>
                    {currentUser.email
                        ? <AppBar position="sticky" className={classes.appBar}>
                            <Toolbar>
                                <Typography variant="h6" className={classes.title}>
                                    Welcome {currentUser ? currentUser.email : null}
                                </Typography>
                                {currentUser.userType === 'ADMIN'
                                    ? <IconButton color="inherit" onClick={this.handleClickOpenMenu}>
                                        <MenuIcon />
                                    </IconButton>
                                    : currentUser.userType === 'USER'
                                        ? <Button variant="outlined" onClick={this.handleLogOut}>
                                            Logout
                            </Button>
                                        : null
                                }
                            </Toolbar>
                        </AppBar>
                        : <div style={{ height: '64px', backgroundColor: '#B9CCD0' }} />
                    }


                    <div className={classes.content}>
                        {this.props.children}
                    </div>



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



                        <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                    </Menu>

                    <DialogResetPw open={open} handleClose={this.handleCloseDialog} />
                </div>
            </App>

        );

    }
}

export default withStyles(navStyles)(withApollo(NavBar));

import React from "react";
import { withApollo } from "react-apollo";
import Cookies from "js-cookie";
import { Link, Switch, Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
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
import DialogResetPw from "./DialogResetPw";
import App from "./App";
import DoneSnackbar from "./SnackBar";
import LogOutIcon from '@material-ui/icons/ExitToAppSharp';

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.getMessage = this.getMessage.bind(this)
        this.state = {
            client: props.client,
            currentUser: [],
            anchorEl: null,
            open: false,
            openPwReset: false,
            autoHide: null,
            message: '',
            switch: 'USERS'
            // loggedIn: chekLogIn()
        };
    }


    handleLogOut = () => {
        Cookies.remove("jwtToken");
        Router.push('/')
        //adds google account rightaway
        window.location.reload('/')
    };

    // menu handlers

    handleClickOpenMenu = event => {
        this.setState({ anchorEl: event.currentTarget })
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl: null })
    };


    handleCloseDialog = () => {
        this.setState({ anchorEl: null, open: false })
    };

    handleOpenPwReset = () => {
        console.log('OPEN')
        this.setState({ openPwReset: true })
        this.handleCloseMenu()
    };
    handleClosePwReset = () => {
        this.setState({ openPwReset: false })
        this.handleOpenSnack()
    }
    getMessage = (msg) => {
        console.log('msg', msg)
        this.setState({ message: msg })
        console.log(this.state.message)
        this.handleOpenSnack()
    }
    setAutoHide = (autoHide) => {
        this.setState({ autoHide: autoHide })
    }
    handleOpenSnack = () => {
        this.state.message !== ''
            ? this.setState({ openSnack: true })
            : this.setState({ openSnack: false })
    };

    handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnack: false, autoHide: null, message: '' })
        // setAutoHide(null)
        // setButtonDisabled(false)
        // props.handleClose()
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

    handleChangeSwitch = () => {
        const temp = this.state.switch === 'USERS' ? "APIS" : 'USERS'
        this.setState({ switch: temp })
    };


    render() {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { switchState: this.state.switch, currentUser: this.state.currentUser })
        );
        const { anchorEl, currentUser, open, openPwReset, openSnack, message, autoHide } = this.state;
        const { classes } = this.props;

        return (
            <App>
                <div className={classes.root}>
                    {currentUser.email
                        ? <AppBar position="sticky" className={classes.appBar}>
                            <Toolbar>
                                <Typography variant="h6" className={classes.title}>
                                    {currentUser ? currentUser.userType + ": " + currentUser.email : null}
                                </Typography>

                                {//Näytetään vain adminille switch Users/apis
                                    currentUser ? currentUser.userType === 'ADMIN' ?
                                        <div style={{ flexGrow: 1, fontSize: '20px' }}>
                                            {this.state.switch === 'USERS'
                                                ? "USERS" : null}
                                            <Switch
                                                value={this.state.switch}
                                                onChange={this.handleChangeSwitch}
                                            />
                                            {this.state.switch === 'APIS'
                                                ? "APIS" : null}
                                        </div>
                                        : null
                                        : null}
                                {currentUser.userType === 'USER'
                                    ?
                                    <IconButton
                                        color="inherit"
                                        onClick={this.handleClickOpenMenu}
                                        aria-label='menu button'>
                                        <MenuIcon />
                                    </IconButton>
                                    :
                                    <Fab
                                        variant="extended"
                                        size="small"
                                        aria-label="like"
                                        color="secondary"
                                        onClick={this.handleLogOut}
                                    >
                                        <LogOutIcon />
                                        Logout
                                    </Fab>
                                }
                            </Toolbar>
                        </AppBar>
                        : <div style={{ height: '64px', backgroundColor: '#B9CCD0' }} />
                    }



                    <div className={classes.content} >
                        {childrenWithProps}
                    </div>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={this.handleCloseMenu}
                    >

                        <MenuItem onClick={this.handleOpenPwReset}>
                            Change password
                            </MenuItem>
                        <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                    </Menu>

                    <DialogResetPw open={open} handleClose={this.handleCloseDialog} />
                </div>

                <DialogResetPw
                    open={openPwReset}
                    handleClose={this.handleClosePwReset}
                    userIds={currentUser.id}
                    userEmail={currentUser.email}
                    setAutoHide={this.setAutoHide}
                    getMessage={this.getMessage}
                    userType={currentUser.userType}
                    title={"Change password?"}
                />

                <DoneSnackbar
                    open={openSnack}
                    message={message}
                    onClose={this.handleCloseSnack}
                    autoHide={autoHide}
                    handleClose={this.handleCloseSnack}
                    getMessage={this.getMessage}
                />
            </App>

        );

    }
}

export default withStyles(navStyles)(withApollo(NavBar));

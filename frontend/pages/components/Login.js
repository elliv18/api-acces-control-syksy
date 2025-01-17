import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/styles";
import { LOGIN_MUTATION, GOOGLE_LOGIN } from "../../lib/gql/mutations";
import Cookies from "js-cookie";
import Router from "next/router";
import { loginStyles } from '../../src/components/Styles'
import Copyright from './Copyright'

import { GoogleLogin } from 'react-google-login';

import getConfig from "next/config";
import DialogAlertSignUpIn from "./DialogAlertSignUpIn";
import { USERS_QUERY } from "../../lib/gql/queries";
import { Paper, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";

const { publicRuntimeConfig } = getConfig();
const { GOOGLE_CLIENT_ID } = publicRuntimeConfig;



class Login extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      email: "",
      password: "",
      open: false,
      openGoogle: false,
      msg: '',
      client: props.client
    };
    // STATE ENDS
  }

  componentDidMount() {
    Cookies.remove("jwtToken");
  }

  // luetaan textfieldin arvot
  setEmail = e => {
    this.setState({ email: e.target.value });
    this.setState({ open: false })

  };
  setPassword = e => {
    this.setState({ password: e.target.value });
    this.setState({ open: false })

  };

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };


  onFailure = (error) => {
    this.handleOpenGoogle()
  };


  googleResponse = (response) => {

    // console.log(response.tokenId);
    this.state.client
      .mutate({
        variables: {
          token: response.tokenId
        },
        mutation: GOOGLE_LOGIN,

      })
      .then(res => {
        let googleJWT = res.data.loginGoogle.jwt
        //    console.log(googleJWT)
        Cookies.set("jwtToken", googleJWT)

        googleJWT ? Router.push({
          pathname: "/home"
        }) : console.log('Google auth failed')
      })
      .catch(e => console.log(e))
  };
  // Kirjautumis logiikka

  logIn = async () => {
    const { email, password, client } = this.state;

    // Login mutation
    await client
      .mutate({
        variables: {
          email: email,
          password: password
        },

        mutation: LOGIN_MUTATION
      })
      .then(res => {
        let jwt = res.data.login.jwt
        // asetetaan jwt, jos saadaan response (oikeat nimi ja salasana)
        Cookies.set("jwtToken", jwt)
      })
      .catch(e => {
        this.setState({ msg: e.message.replace("GraphQL error:", "").trim() })
        this.handleClickOpen()
      });


    // testataan löytyykö cookie
    await Cookies.get("jwtToken")
      ? // true: Mennään kotisivulle
      Router.push({
        pathname: "/home"
      })
      : //false: ei tehdä mitään
      null;
  };

  handleOpenGoogle = () => {
    this.setState({ openGoogle: true })
  }
  handleCloseGoogle = () => {
    this.setState({ openGoogle: false })
  }


  render() {
    const { classes } = this.props;
    const { msg, open, openGoogle } = this.state;
    return (

      <div className={classes.root}>
        <Paper elevation={7} className={classes.paper} >
          <CssBaseline />
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.setEmail}
              onKeyPress={async ev => {
                if (ev.key === "Enter") {
                  document.getElementById("passwordInput").focus();
                }
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="passwordInput"
              autoComplete="current-password"
              onChange={this.setPassword}
              onKeyPress={async ev => {
                if (ev.key === "Enter") {
                  this.logIn();
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.loginButton}
              onClick={() =>
                this.logIn()
              }
            >
              Sign In
            </Button>
            <div className={classes.googleButton}>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                render={renderProps => (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.googleButton}
                    onClick={renderProps.onClick}
                  >
                    Login with Google
                    </Button>
                )}
                buttonText="Login"
                onSuccess={this.googleResponse}
                onFailure={this.onFailure}
              />
            </div>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          {
            /*
            <Box mt={8}>
            <Copyright />
          </Box>
          */
          }

          <DialogAlertSignUpIn open={open} message={msg} handleClose={this.handleClose} />

        </Paper>

        <Dialog open={openGoogle}>
          <DialogTitle
            className={classes.dialogGoogleTitle}
          >
            Google login failed!
            </DialogTitle>

          <DialogActions className={classes.dialogGoogleActions} >
            <Button
              onClick={this.handleCloseGoogle}
            >
              Close
                </Button>

          </DialogActions>
        </Dialog>


      </div>
    );
  }
}

export default withStyles(loginStyles)(withApollo(Login));


/*
render={renderProps => (
                <Button onClick={renderProps.onClick}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.googleButton}
                >Google login</Button>
              )}*/



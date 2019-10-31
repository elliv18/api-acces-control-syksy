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
import { LOGIN_MUTATION } from "../../lib/gql/mutations";
import Cookies from "js-cookie";
import Router from "next/router";

import DialogAlertLogin from './DialogAlertLogin'
import { loginStyles } from './Styles'
import Copyright from './Copyright'

import disableSsr from '../../src/components/disableSsr'






class Login extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      email: "",
      password: "",
      open: false,
      errorMsg: undefined,
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
        //window.location.href = "/home";
      })
      .catch(e => {
        this.setState({ errorMsg: e.message.replace("GraphQL error:", "").trim() })
        this.setState({ open: true })
      });

    // console.log(Cookies.get("jwtToken"));

    // testataan löytyykö cookie
    Cookies.get("jwtToken")
      ? // true: Mennään kotisivulle
      Router.push({
        pathname: "/home"
      })
      : //false: ei tehdä mitään
      null;
  };

  render() {
    const { classes } = this.props;
    const { errorMsg } = this.state;
    return (


      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() =>
                this.logIn()
              }
            >
              Sign In
            </Button>
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
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>

        {this.state.open ? <DialogAlertLogin errorMsg={errorMsg} /> : null}

      </Container>

    );
  }
}

export default withStyles(loginStyles)(withApollo(Login));






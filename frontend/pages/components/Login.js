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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      email: "",
      password: "",
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
    console.log(this.state.email);
  };
  setPassword = e => {
    this.setState({ password: e.target.value });
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
        jwt !== undefined || jwt !== null ? Cookies.set("jwtToken", jwt) : null;
        window.location.href = "/home";
      })
      .catch(e => e.message.replace("GraphQL error:", "").trim());

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
              onClick={() => this.logIn()}
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
      </Container>
    );
  }
}

export default withStyles(styles)(withApollo(Login));

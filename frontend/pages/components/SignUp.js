import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withApollo } from "react-apollo";
import { SIGNUP_MUTATION } from "../../lib/gql/mutations";
import { signUpStyles } from './Styles'
import Copyright from './Copyright'
import DialogAlertSignUpIn from "./DialogAlertSignUpIn";


class SignUp extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      email: "",
      password: "",
      passwordAgain: "",
      open: false,
      ok: undefined,
      client: props.client
    };
    // STATE ENDS
  }

  setEmail = e => {
    this.setState({ email: e.target.value });
  };
  setPassword = e => {
    this.setState({ password: e.target.value });
  };
  setPasswordAgain = e => {
    this.setState({ passwordAgain: e.target.value });
  };

  signIn = async () => {
    const { email, password, client, passwordAgain } = this.state;

    await client
      .mutate({
        variables: {
          email: email,
          password: password,
          passwordAgain: passwordAgain,
        },
        mutation: SIGNUP_MUTATION
      })
      .then(res => {
        console.log(res)
        this.handleClickOpen(),
          this.setState({ ok: true, msg: " You have now an account! Please go to login page to continue." })
      })
      .catch(e => {
        //console.log(e)
        this.handleClickOpen()
        this.setState({ ok: false })
        this.setState({ msg: e.message.replace('GraphQL error:', '').trim(), })
      })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  render() {
    const { classes } = this.props;
    const { ok, msg, open } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  autoFocus
                  required={true}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={this.setEmail}
                  onKeyPress={async ev => {
                    if (ev.key === "Enter") {
                      this.state.email.length == 0
                        ? (this.setState({ msg: "Email can't be empty!" }), this.handleClickOpen())
                        : document.getElementById("password").focus();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.setPassword}
                  onKeyPress={async ev => {
                    if (ev.key === "Enter") {
                      this.state.password.length == 0
                        ? (this.setState({ msg: "Password can't be empty!" }), this.handleClickOpen())
                        : document.getElementById("passwordAgain").focus();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="passwordAgain"
                  label="Password again"
                  type="password"
                  id="passwordAgain"
                  autoComplete="current-password"
                  onChange={this.setPasswordAgain}
                  onKeyPress={async ev => {
                    if (ev.key === "Enter") {
                      this.state.passwordAgain.length == 0
                        ? (this.setState({ msg: "Password can't be empty!" }), this.handleClickOpen())
                        : this.signIn()
                    }
                  }}
                />
              </Grid>

            </Grid>
            <Button
              //type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => this.signIn()}
            >
              Sign Up
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>

        {
          // välitetään error message ja ok status dialogille
          // ok tarkistaa onnistuiko käyttäjän luonti vai ei
        }

        <DialogAlertSignUpIn open={open} message={msg} handleClose={this.handleClose} ok={ok} />
      </Container>
    );
  }
}

export default withStyles(signUpStyles)(withApollo(SignUp));


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
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withApollo } from "react-apollo";
import { SIGNUP_MUTATION } from "../../lib/gql/mutations";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

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
    console.log(email, password, passwordAgain)

    await client
      .mutate({
        variables: {
          email: email,
          password: password,
          passwordAgain: passwordAgain,
          open: false,
          errorMsg: undefined,
        },
        mutation: SIGNUP_MUTATION
      })
      .then(res => {
        console.log(res)
        this.handleClickOpen(),
          this.setState({ ok: true })
      })
      .catch(e => {
        console.log(e)
        this.handleClickOpen()
        this.setState({ ok: false })
        this.setState({ errorMsg: e.message.replace('GraphQL error:', '').trim(), })
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
    const { open } = this.state;
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
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
             </Grid>*/
              }
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
                        ? (this.setState({ errorMsg: "Email can't be empty!" }), this.handleClickOpen())
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
                        ? (this.setState({ errorMsg: "Password can't be empty!" }), this.handleClickOpen())
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
                        ? (this.setState({ errorMsg: "Password can't be empty!" }), this.handleClickOpen())
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


        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            {this.state.ok
              ? <DialogContentText id="alert-dialog-description">
                You have now an account! Please go to login page to continue.
              </DialogContentText>
              : <DialogContentText id="alert-dialog-description">
                <b>Error: </b>{this.state.errorMsg}
              </DialogContentText>
            }
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            {this.state.ok
              ? <Link href="/" variant="body2">
                {"Move to login page"}
              </Link>

              : <Button onClick={() => this.handleClose()} autoFocus>
                Close
              </Button>
            }

          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default withStyles(styles)(withApollo(SignUp));

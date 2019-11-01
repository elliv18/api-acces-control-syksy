import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RemoveRedEye } from '@material-ui/icons';

import { withStyles, Button, TextField, InputAdornment, IconButton, Grid } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { ADMIN_RESET_PW } from '../../lib/gql/mutations';
import Snackbar from './SnackBar';
import DoneSnackbar from './SnackBar';
import helpers from '../../src/components/helpers';



const styles = theme => ({
    textField: {
        margin: 5,
    },
    eye: {
        cursor: 'pointer',
    },
    dialogContent: {
        textAlign: 'center',

    },
    dialogTitle: {
        textAlign: 'center'
    },
    main: {
        width: 250,
    },
    buttonDialogTextNo: {
        color: 'red'
    },
    buttonDialogTextYes: {
        color: 'green'
    }
});

function DialogResetPw(props) {
    const [isMasked, setMask] = React.useState(true);
    const [pw, setPw] = React.useState(null)
    const [pwAgain, setPwAgain] = React.useState(null)
    const [buttonDisabled, setButtonDisabled] = React.useState(props.openSnack)


    const { classes } = props
    let users = null;

    // RESET PW LOGIC
    const handlePwReset = () => {
        let msg = ''
        // console.log('ID', props.userId, 'PW', pw, 'PW2', pwAgain)
        props.userIds.map(async (row, index) => {
            pw === pwAgain
                ? await props.client
                    .mutate({
                        variables: {
                            id: row,
                            password: pw,
                            passwordAgain: pwAgain
                        },
                        mutation: ADMIN_RESET_PW
                    })
                    .then(res => {
                        msg = ("Passwords reset for users: " + helpers.getEmailFromId(props.userIds, props.allUsers))
                        props.setAutoHide(6000)
                        props.handleClose()
                    })
                    .catch(e => console.log(e))
                : msg = "Passwords not match!"
            props.getMessage(msg)

        })
        //props.handleClose()
    };

    //MASK / UNMASK PASSWORD
    const togglePasswordMask = () => {

        setMask(prevIsMasked => !prevIsMasked)
    };

    //TEXTFIELD CHANGES
    const handlePwChange = e => {
        setPw(e.target.value)
        //  console.log(pw)
    }

    const handlePwAgainChange = e => {
        setPwAgain(e.target.value)
        // console.log(pwAgain)
    }

    //HANDLE SNACKBAR


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>{props.title}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Grid item xs={12} className={classes.main}>
                    <Grid item xs={12}>
                        <DialogContentText>
                            {props.userEmail}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            autoFocus
                            label={"Give new password"}
                            className={classes.textField}
                            type={isMasked ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <RemoveRedEye
                                            className={classes.eye}
                                            onClick={() => {
                                                togglePasswordMask()
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handlePwChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={"password again"}
                            type={isMasked ? 'password' : 'text'}
                            onChange={handlePwAgainChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary" disabled={buttonDisabled}>
                    <a className={classes.buttonDialogTextNo}>Cancel</a>
                </Button>
                <Button onClick={handlePwReset} color="primary" disabled={buttonDisabled}>
                    <a className={classes.buttonDialogTextYes}>Reset pasword</a>
                </Button>
            </DialogActions>

        </Dialog>

    )
}

export default withStyles(styles)(withApollo(DialogResetPw))






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
    const [openSnack, setOpenSnack] = React.useState(props.openSnack)
    const [buttonDisabled, setButtonDisabled] = React.useState(props.openSnack)


    const { classes } = props
    let users = null;

    // RESET PW LOGIC
    const handlePwReset = async () => {
        // console.log('ID', props.userId, 'PW', pw, 'PW2', pwAgain)
        pw === pwAgain
            ? await props.client
                .mutate({
                    variables: {
                        id: props.userId,
                        password: pw,
                        passwordAgain: pwAgain
                    },
                    mutation: ADMIN_RESET_PW
                })
                .then(res => {
                    //  console.log(res)
                    handleOpenSnack()
                    setButtonDisabled(true)
                })
                .catch(e => console.log(e))
            : console.log('PW NOT MATCH')

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
    const handleOpenSnack = () => {
        setOpenSnack(true)
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false)
        setButtonDisabled(false)
        props.handleClose()
    };

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

            <DoneSnackbar
                open={openSnack}
                handleClose={handleCloseSnack}
                title={"Password changed for user: " + props.userEmail}
            />
        </Dialog>

    )
}

export default withStyles(styles)(withApollo(DialogResetPw))






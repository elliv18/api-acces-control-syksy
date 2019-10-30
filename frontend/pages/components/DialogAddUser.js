import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RemoveRedEye, GestureTwoTone } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Select, InputLabel, Typography, Container, FormControl } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { ADMIN_RESET_PW, ADD_USER } from '../../lib/gql/mutations';
import DoneSnackbar from './SnackBar';

import { addUserStyle } from './Styles'


function DialogAddUser(props) {
    const [isMasked, setMask] = React.useState(true);
    const [pw, setPw] = React.useState(null)
    const [openSnack, setOpenSnack] = React.useState(props.openSnack)
    const [buttonDisabled, setButtonDisabled] = React.useState(props.openSnack)
    const [userType, setUserType] = React.useState('')
    const [email, setEmail] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [autoHide, setAutoHide] = React.useState(null)



    const { classes } = props
    let users = null;

    // RESET PW LOGIC
    const handleAddUser = async () => {
        // console.log('ID', props.userId, 'PW', pw, 'PW2', pwAgain)
        await props.client
            .mutate({
                variables: {
                    userType: userType,
                    email: email,
                    password: pw
                },
                mutation: ADD_USER
            })
            .then(res => {
                //  console.log(res)
                setMessage("New user " + email + " created")
                setAutoHide(6000)
                handleOpenSnack()
                setButtonDisabled(true)
                props.handleAddedData(res.data.createNewUser, res.data.createNewUser.user.id)
            })
            .catch(e => {
                console.log(e)
                let temp = e.message.replace("GraphQL error:", "").trim()
                // email exist error too long
                temp.length > 20 ? setMessage('Email alreydy exist!') : setMessage(temp)
                setAutoHide(null)
                handleOpenSnack()
            })
    };

    //MASK / UNMASK PASSWORD
    const togglePasswordMask = () => {
        setMask(prevIsMasked => !prevIsMasked)
    };
    //TEXTFIELD CHANGES
    const handleEmailChange = e => {
        setEmail(e.target.value)
        //   console.log(email)
    }
    const handlePwChange = e => {
        setPw(e.target.value)
        //   console.log(pw)
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
        setAutoHide(null)
        setButtonDisabled(false)
        props.handleClose()
    };

    //HANDLE SELECT
    const handleSelect = event => {
        setUserType(event.target.value)
    };

    // console.log(userType)


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Container className={classes.main}>
                <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Create new user</DialogTitle>
                <DialogContent className={classes.dialogContent}>

                    <FormControl className={classes.select}>
                        <InputLabel>Usertype</InputLabel>
                        <Select
                            value={userType}
                            onChange={handleSelect}
                        >
                            <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                            <MenuItem value={'USER'}>USER</MenuItem>

                        </Select>
                    </FormControl>


                    <FormControl className={classes.textField}>
                        <TextField
                            fullWidth
                            label={"Email"}
                            type="email"
                            onChange={handleEmailChange}
                        />
                    </FormControl>

                    <FormControl className={classes.textField}>
                        <TextField
                            fullWidth
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
                    </FormControl>

                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={props.handleClose} color="primary" disabled={buttonDisabled}>
                        <a className={classes.buttonDialogTextNo}>Cancel</a>
                    </Button>
                    <Button onClick={handleAddUser} color="primary" disabled={buttonDisabled}>
                        <a className={classes.buttonDialogTextYes}>Create</a>
                    </Button>
                </DialogActions>
            </Container>

            <DoneSnackbar
                open={openSnack}
                autoHide={autoHide}
                handleClose={handleCloseSnack}
                title={message}
            />
        </Dialog>

    )
}

export default withStyles(addUserStyle)(withApollo(DialogAddUser))



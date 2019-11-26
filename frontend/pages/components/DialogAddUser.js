import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RemoveRedEye, GestureTwoTone } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Select, InputLabel, Typography, Container, FormControl } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { ADD_USER } from '../../lib/gql/mutations';

import { addUserStyle } from '../../src/components/Styles'
import { USERS_QUERY } from '../../lib/gql/queries';


function DialogAddUser(props) {
    const [isMasked, setMask] = React.useState(true);
    const [pw, setPw] = React.useState(null)
    const [buttonDisabled, setButtonDisabled] = React.useState(props.openSnack)
    const [userType, setUserType] = React.useState('')
    const [email, setEmail] = React.useState(null)

    const { classes } = props

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
                mutation: ADD_USER,
                refetchQueries: [{ query: USERS_QUERY }]
            })
            .then(res => {
                //  console.log(res)
                props.getMessage("New user " + email + " created")
                props.setAutoHide(6000)
                props.handleAddedData(res.data.createNewUser, res.data.createNewUser.user.id)
                props.handleClose()

            })
            .catch(e => {
                console.log(e)
                let temp = e.message.replace("GraphQL error:", "").trim()
                // email exist error too long
                props.getMessage(temp)
                props.setAutoHide(null)
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


    //HANDLE SELECT
    const handleSelect = event => {
        setUserType(event.target.value)
    };



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


        </Dialog>

    )
}

export default withStyles(addUserStyle)(withApollo(DialogAddUser))



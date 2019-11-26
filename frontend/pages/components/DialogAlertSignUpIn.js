import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { dialogStyle } from '../../src/components/Styles'
import { withStyles } from '@material-ui/styles';
import { Link } from '@material-ui/core';


function DialogAlert(props) {
    const { classes } = props


    return (
        <Dialog
            open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-slide-title" className={props.ok ? classes.backgroundYes : classes.backgroundNo}>
                {props.ok ? "" : "Error"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className={classes.textNo}>
                    {props.message}
                </DialogContentText>
            </DialogContent>

            <DialogActions className={classes.contentNo}>

                {props.ok ?
                    <Link href="/" variant="body2" className={classes.textLink}>
                        {"Move to login page"}
                    </Link>
                    :
                    <Button onClick={props.handleClose} autoFocus>
                        <a className={classes.buttonText}>Close</a>
                    </Button>
                }
            </DialogActions>
        </Dialog>

    );
}

export default withStyles(dialogStyle)(DialogAlert)
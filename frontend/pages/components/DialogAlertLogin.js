import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { dialogStyle } from './Styles'
import { withStyles } from '@material-ui/styles';


function DialogAlert(props) {
    const [open, setOpen] = React.useState(true);
    const { classes } = props
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundNo}>{"ERROR"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className={classes.textNo}>
                    {props.errorMsg}
                </DialogContentText>
            </DialogContent>

            <DialogActions className={classes.contentNo}>
                <Button onClick={handleClose} autoFocus>
                    <a className={classes.buttonText}>Close</a>
                </Button>
            </DialogActions>
        </Dialog>

    );
}

export default withStyles(dialogStyle)(DialogAlert)
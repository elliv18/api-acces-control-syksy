import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from "@material-ui/core/Link";

import { dialogStyle } from './Styles'
import { withStyles } from '@material-ui/styles';

function DialogAlert(props) {

    const [open, setOpen] = React.useState(true);
    const { classes } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    if (props.ok) {
        // käyttäjän luonti onnistui
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundYes}>{"INFO"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-description" className={classes.textYes}>
                        You have now an account! Please go to login page to continue.
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Link href="/" variant="body2" className={classes.textLink}>
                        {"Move to login page"}
                    </Link>
                </DialogActions>
            </Dialog>
        );
    }

    else {
        // käyttäjän luonti epäonnistui
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundNo}>{"ERROR"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-description" className={classes.textNo}>
                        {props.errorMsg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleClose} autoFocus >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }
}

export default withStyles(dialogStyle)(DialogAlert)

/*
<DialogContentText id="alert-dialog-description" style={{ color: "red" }}>
                        {props.errorMsg}
                    </DialogContentText>

                    <Button onClick={handleClose} autoFocus>
                        Close
              </Button>
*/
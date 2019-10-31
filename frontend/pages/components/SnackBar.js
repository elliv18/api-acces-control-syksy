import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done'

const useStyles = makeStyles(theme => ({
    success: {
        padding: theme.spacing(0.5),
        backgroundColor: 'green'
    },
    fail: {
        padding: theme.spacing(0.5),
        backgroundColor: 'red'
    },
}));

export default function DoneSnackbar(props) {
    const classes = useStyles();

    //const autoHide = success ? 2000 : 100000
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={props.open}
                autoHideDuration={props.autoHide}
                onClose={props.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.title}</span>}
                action={[
                    props.autoHide !== null
                        ? <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            className={classes.success}
                            onClick={props.handleClose}
                        >
                            <DoneIcon />
                        </IconButton>
                        :
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            className={classes.fail}
                            onClick={props.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                ]}
            />
        </div>
    );
}
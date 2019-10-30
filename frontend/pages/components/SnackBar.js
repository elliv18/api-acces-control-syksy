import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done'

const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(0.5),
        backgroundColor: 'green'
    },
}));

export default function DoneSnackbar(props) {
    const classes = useStyles();
    //const [open, setOpen] = React.useState(false);

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={props.open}
                autoHideDuration={6000}
                onClose={props.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.title}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={props.handleClose}
                    >
                        <DoneIcon />
                    </IconButton>,
                ]}
            />
        </div>
    );
}
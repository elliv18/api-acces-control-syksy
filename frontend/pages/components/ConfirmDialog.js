import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { confirmDialogStyle } from './Styles'
import { withStyles, Button } from '@material-ui/core';



const styles = theme => ({

    backgroundDialogTitle: {
        backgroundColor: "#a8a0a099",
        textAlign: 'center'
    },
    textDialog: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20
    },
    contentDialog: {
        justifyContent: 'center',

    },
    buttonDialogTextYes: {
        color: "green",
    },
    buttonDialogTextNo: {
        color: "red",
    },
});

function ConfirmDialog(props) {
    const [DeleteStatus, setDeleteStatus] = React.useState(true);
    const { classes } = props
    const handleClickOpen = () => {
        setOpen(true);
    };


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundDialogTitle}>
                Do you want remove apikey?
                    </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className={classes.textDialog}>
                    User:
                </DialogContentText>
            </DialogContent>

            <DialogActions className={classes.contentDialog}>
                <Button variant="outlined" onClick={props.handleCloseYes}>
                    <a className={classes.buttonDialogTextYes}>Yes</a>

                </Button>
                <Button variant="outlined" onClick={props.handleCloseNo} autoFocus>
                    <a className={classes.buttonDialogTextNo}>No</a>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(ConfirmDialog)










/*

*/
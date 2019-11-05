import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, Button } from '@material-ui/core';
import helpers from '../../src/components/helpers';
import { Confirmstyle } from './Styles';


function ConfirmDialog(props) {
    const { classes } = props
    const emails = helpers.getEmailFromId(props.selected, props.allUsers)

    let msg = ''

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundDialogTitle}>
                Delete users: {emails.map(row => (
                    <div key={row}>{
                        row}<br />
                    </div>
                ))}
            </DialogTitle>

            <DialogActions className={classes.contentDialog}>
                <Button variant="outlined" onClick={() => {
                    props.handleCloseYes()
                    emails.map(row => (
                        msg += (row + ", ")
                    ))
                    props.getMessage('Users:' + msg + ' deleted!')

                }}>
                    <a className={classes.buttonDialogTextYes}>Yes</a>

                </Button>
                <Button variant="outlined" onClick={props.handleClose} autoFocus>
                    <a className={classes.buttonDialogTextNo}>No</a>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(Confirmstyle)(ConfirmDialog)










/*

*/
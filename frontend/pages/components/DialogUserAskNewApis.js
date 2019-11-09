import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, Button, DialogContent, Typography, Checkbox, IconButton, Grid, FormControlLabel, Divider } from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { DialogUserAskNewApisStyle } from './Styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


function DialogUserAskNewApis(props) {
    const { classes } = props
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [expanded, setExpanded] = React.useState('');

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleClick = () => {
        console.log(checked)
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogTitle
                id="alert-dialog-slide-title"
                className={classes.dialogTitle}
            >
                Select apis you want:
            </DialogTitle>

            <DialogContent
                className={classes.dialogContent}
            >

                {props.apiList.map((row, index) => {
                    const labelId = `checkbox-list-label-${row.id}`;
                    return (
                        <div key={index} >
                            <ExpansionPanel
                                className={classes.expansionPanel}
                                square expanded={expanded === 'panel' + index}
                                onChange={handleChange('panel' + index)}
                            >
                                <ExpansionPanelSummary
                                    className={classes.expansionPanelSummary}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-label="Expand"
                                    aria-controls="additional-actions1-content"
                                    id="additional-actions1-header"
                                >
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        //  onClick={event => event.stopPropagation()}
                                        // onFocus={event => event.stopPropagation()}
                                        control={
                                            <Checkbox
                                                // edge="start"
                                                onChange={() => setExpanded('')}
                                                checked={checked.indexOf(row.id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                onClick={handleToggle(row.id)}
                                            />
                                        }
                                        label={row.name}
                                    />
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={3} className={classes.divider}>
                                            <Typography>
                                                <b>Path: </b>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9} className={classes.divider}>
                                            <Typography>
                                                {row.path}
                                            </Typography>
                                        </Grid>


                                        <Grid item xs={3} className={classes.padding}>
                                            <Typography>
                                                <b>ID: </b>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9} className={classes.padding}>
                                            <Typography>
                                                {row.id}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    );
                })}
            </DialogContent>

            <DialogActions className={classes.dialogActions} >
                <Button
                    className={classes.buttonYes}
                    variant="outlined"
                    onClick={handleClick}
                >
                    Get apis
                </Button>
                <Button
                    className={classes.buttonNo}
                    variant="outlined"
                    onClick={props.handleClose}
                    autoFocus
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default withStyles(DialogUserAskNewApisStyle)(DialogUserAskNewApis)








/*
 <List >
                                            <ListItem>
                                                <ListItemText
                                                    primary={'Path:  ' + row.path} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary="Single-line item" />
                                            </ListItem>
                                        </List>



*/


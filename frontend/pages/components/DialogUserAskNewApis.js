import React, { useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, Button, DialogContent, Typography, Checkbox, Grid, FormControlLabel, TextField } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { DialogUserAskNewApisStyle } from './Styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CREATE_NEW_API_KEY } from '../../lib/gql/mutations';
import { API_LIST_QUERY } from '../../lib/gql/queries';


function DialogUserAskNewApis(props) {
    const { classes } = props
    const [searched, setSearched] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [expanded, setExpanded] = React.useState('');
    const [value, setValue] = React.useState('');
    const [showData, setShowData] = React.useState([]);
    const [apiList, setApiList] = React.useState([]);



    useEffect(() => {
        props.client
            .query({
                query: API_LIST_QUERY
            })
            .then(res => {
                setApiList(res.data.getApiList)
            })
            .catch(e => console.log(e))
    })

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
    const handleFilter = (e) => {
        let value = e.target.value
        let newlist = []

        let currentList = apiList
        value = value.toLowerCase()

        newlist = currentList.filter(filter => {
            if (filter.name) {
                return filter.name.toLowerCase().includes(value)
            }
            //  console.log(filter.name)
        })

        setSearched(true)
        setValue(value)
        setShowData(newlist)
    }

    const handleGetApiKey = async () => {
        let temp = []
        temp = checked.map(row => {
            return ({ id: row })
        })
        console.log(checked)
        // console.log(checked)
        await props.client
            .mutate({
                variables: {
                    api_keys: checked
                },
                mutation: CREATE_NEW_API_KEY

            }).then(res => {
                let apis = res.data.createNewApiKey.user.apis
                props.setApiData(apis)
            })
            .catch(e => console.log(e))


    }

    const noData = [
        { name: 'No results found' },
    ];

    // gets correct data
    const data = showData.length > 0 ? showData :
        showData.length === 0 && searched ? noData : apiList
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
                <Grid container>
                    <Grid item xs={6}>
                        <p style={{ marginTop: '5%', marginBottom: '5%' }}>Select apis you want:</p>
                    </Grid>
                    <Grid item xs={6} >
                        <TextField
                            aria-label="search field"
                            type="text"
                            margin="dense"
                            fullWidth
                            label='Search...'
                            InputProps={{
                                className: classes.textField
                            }}
                            variant={'outlined'}
                            onChange={handleFilter}
                            value={value} />
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent
                className={classes.dialogContent}
            >


                {data.map((row, index) => {
                    const labelId = `checkbox-list-label-${row.api_id}`;
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
                                                checked={checked.indexOf(row.api_id) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                onClick={handleToggle(row.api_id)}
                                            />
                                        }
                                        label={row.api_name}
                                    />
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={6} className={classes.padding}>
                                            <Typography>
                                                <b>Urls: </b>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} className={classes.padding}>
                                            <Typography>
                                                <b>Methods: </b>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} className={classes.infoText} >
                                            {row.urls.map(url => {
                                                return (
                                                    <Typography key={url.url} className={classes.divider}>
                                                        {url.url}
                                                    </Typography>
                                                )
                                            })}
                                        </Grid>

                                        <Grid item xs={6} className={classes.infoText}>
                                            {row.urls.map(url => {
                                                return (
                                                    <Typography key={url.url} className={classes.divider}>
                                                        {url.methods}
                                                    </Typography>
                                                )
                                            })}
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
                    onClick={() => {
                        handleGetApiKey()
                        props.handleClose()
                    }}
                >
                    Get apis
                </Button>
                <Button
                    className={classes.buttonNo}
                    variant="outlined"
                    onClick={props.handleClose}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default withStyles(DialogUserAskNewApisStyle)(DialogUserAskNewApis)

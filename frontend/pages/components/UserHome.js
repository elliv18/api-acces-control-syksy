import React from "react";
import { withApollo } from "react-apollo";
import { Paper, Grid, IconButton, Tooltip, DialogTitle, Dialog, DialogActions, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography';
import { homeStyleUser } from '../../src/components/Styles'
import { API_LIST_QUERY } from "../../lib/gql/queries";
import AddIcon from '@material-ui/icons/Add'
import DialogUserAskNewApis from "./DialogUserAskNewApis";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { DialogUserAskNewApisStyle } from '../../src/components/Styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


class HomeUser extends React.PureComponent {
    constructor(props) {
        super(props);
        this.setApiData = this.setApiData.bind(this)
        this.state = {
            client: props.client,
            apiList: [],
            openNewApis: false,
            expanded: '',
            apiData: [],
            apiKey: '',
            openGoogle: false
        };
    }

    componentDidMount() {
        this.setState({
            apiList: this.props.currentUser.apis,
            apiKey: this.props.currentUser.api_key,

            openGoogle: this.props.currentUser.google_account
        })


    }
    setApiData = (data) => {
        this.setState({ apiList: data.apis, apiKey: data.api_key })
        console.log(data)

    }

    handleChange = panel => (event, newExpanded) => {
        //setExpanded(newExpanded ? panel : false);
        newExpanded ? this.setState({ expanded: panel }) : this.setState({ expanded: false })
    };
    handleOpenNewApis = () => {
        this.setState({ openNewApis: true })
        // console.log('CU', this.props.currentUser)

    }
    handleClose = () => {
        this.setState({ openNewApis: false })
    }

    render() {
        const { apiList, openNewApis, client, expanded, openGoogle } = this.state;
        const { classes } = this.props;

        return (
            <Paper elevation={5} className={classes.paper}>
                <Grid
                    container spacing={0}
                    className={classes.grid}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={3} className={classes.gridHeader} >
                        <Typography className={classes.title1}>
                            Your apis
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className={classes.gridHeader}>
                        {this.state.apiKey
                            ?
                            <Typography>
                                Your api key: {this.state.apiKey}
                            </Typography>

                            : null
                        }
                    </Grid>
                    <Grid item xs={3} className={classes.gridHeader}>
                        <div style={{ textAlign: 'right' }}>
                            <Tooltip title="Get new apis">
                                <IconButton
                                    onClick={this.handleOpenNewApis}
                                >
                                    <AddIcon style={{ color: 'green', height: 50, width: 50 }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Grid>


                </Grid>
                {

                    apiList !== undefined ?
                        apiList.map((row, index) => {
                            //    console.log('row', ...row.urls)
                            return (
                                <Paper elevation={4} className={classes.expansionPanelPaper} key={index}>
                                    <ExpansionPanel
                                        className={classes.expansionPanel}

                                        square expanded={expanded === 'panel' + index}
                                        onChange={this.handleChange('panel' + index)}
                                    >
                                        <ExpansionPanelSummary
                                            className={classes.expansionPanelSummary}
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-label="Expand"
                                            aria-controls="additional-actions1-content"
                                            id="additional-actions1-header"
                                        >
                                            <h3>{row.api_name}</h3>
                                        </ExpansionPanelSummary>

                                        <ExpansionPanelDetails>
                                            <Grid container>
                                                <Grid item xs={12} className={classes.divider}>
                                                    <Typography>
                                                        <b>Root path:  </b>
                                                        http://
                                                        {this.props.TYK.TYK_HOST}
                                                        :
                                                        {this.props.TYK.TYK_PORT}
                                                        {row.api_root_url}
                                                    </Typography>
                                                </Grid>
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
                                                                {JSON.parse(url.methods)}
                                                            </Typography>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Paper>
                            )
                        })
                        : null
                }


                <DialogUserAskNewApis
                    open={openNewApis}
                    handleClose={this.handleClose}
                    client={client}
                    userApis={this.props.currentUser.apis}
                    setApiData={this.setApiData}
                    TYK={this.props.TYK}
                />


            </Paper>
        )

    }
}

export default withStyles(homeStyleUser)(withApollo(HomeUser));

/*
<Grid container spacing={0} style={{ width: '60%' }}>
            <Grid item xs={12}>
                <h1 className={classes.paper}>Your apis: </h1>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>xs=6</Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>xs=6</Paper>
            </Grid>

        </Grid>*/
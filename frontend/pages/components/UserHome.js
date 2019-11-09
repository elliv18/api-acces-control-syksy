import React from "react";
import { withApollo } from "react-apollo";
import { Paper, Grid, IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography';
import { homeStyleUser } from './Styles'
import { API_LIST_QUERY } from "../../lib/gql/queries";
import AddIcon from '@material-ui/icons/Add'
import DialogUserAskNewApis from "./DialogUserAskNewApis";

class HomeUser extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            apiList: [],
            openNewApis: false
        };
    }

    async componentDidMount() {
        await this.state.client
            .query({
                query: API_LIST_QUERY
            })
            .then(res => {
                this.setState({ apiList: res.data.getApiList })
            })
            .catch(e => console.log(e))
    }

    handleOpenNewApis = () => {
        this.setState({ openNewApis: true })
    }
    handleClose = () => {
        this.setState({ openNewApis: false })
    }

    render() {
        const { apiList, openNewApis } = this.state;
        const { classes } = this.props;

        return (
            <Paper className={classes.paper} elevation={7}>
                <Grid container spacing={0} className={classes.grid}>
                    <Grid item xs={6}>
                        <h1 >Your apis: </h1>
                    </Grid>
                    <Grid item xs={6}>
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

                {apiList.map((row, index) => {
                    //    console.log('row', row)
                    return (
                        <Paper elevation={10} className={classes.card} key={index}>
                            <Typography className={classes.title1}>
                                <b>{row.name}</b>
                            </Typography>
                            <Typography className={classes.title2}>
                                <b>Path:</b>  {row.path}
                            </Typography>
                            <Typography className={classes.title2}>
                                <b>Blah:</b>  blah blah
                            </Typography>
                        </Paper>
                    )
                })}

                <DialogUserAskNewApis
                    open={openNewApis}
                    handleClose={this.handleClose}
                    apiList={apiList}
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
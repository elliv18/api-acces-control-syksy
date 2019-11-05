import React from "react";
import { withApollo } from "react-apollo";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography';
import { homeStyleUser } from './Styles'
import { API_LIST_QUERY } from "../../lib/gql/queries";

class HomeUser extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            apiList: []
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

    render() {
        const { apiList } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.paper}>
                <h1>Avaible apis</h1> ,

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
            </div>
        )

    }
}

export default withStyles(homeStyleUser)(withApollo(HomeUser));

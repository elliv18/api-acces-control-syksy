import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { homeStyle } from './Styles'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

var moment = require('moment');


const styles = theme => ({
    root: {
        marginTop: 10,
        alignSelf: 'center',
        overflow: 'auto',
        minWidth: 300,
        marginLeft: '1%',
        marginRight: '1%'

    },
    table: {
        minWidth: 650,
    },
});



class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            email: undefined,
            allUsers: []

        };
    }

    async componentDidMount() {
        await this.state.client
            .query({
                query: USERS_QUERY
            })
            .then(res => {
                this.setState({ allUsers: res.data.allUsers })
            })
            .catch(e => console.log(e))
    }

    render() {
        const { classes } = this.props
        const { allUsers } = this.state
        console.log(allUsers)
        return (
            <Paper className={classes.root} elevation={5}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Usertype</TableCell>
                            <TableCell align="center">Apikey</TableCell>
                            <TableCell align="center">User created</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers.map(row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.email}
                                </TableCell>
                                <TableCell align="center">{row.userType}</TableCell>
                                <TableCell align="center">{row.apiKey}</TableCell>
                                <TableCell align="center">{moment(row.createdAt).format('DD.MM.YYYY - HH:mm')}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

        );


    }
}

export default withStyles(styles)(withApollo(AdminHome));


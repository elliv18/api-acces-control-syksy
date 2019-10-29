import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { homeStyle } from './Styles'



import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDialog from "./ConfirmDialog";
import { USER_DELETE } from "../../lib/gql/mutations";




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



class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            email: undefined,
            open: false,
            deleteStatus: false,
            allUsers: [],
            openDialog: false,
            deleteUserId: null,
            deleteUserEmail: null
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

    // Dialog state handlers
    handleClickOpen = () => {
        this.setState({ open: true })
    };

    handleCloseNo = () => {
        this.setState({ deleteStatus: false, open: false })
        console.log('No')
    };

    handleCloseYes = () => {
        this.setState({ deleteStatus: true, open: false })
        console.log('DELETE', this.state.deleteUserId)

        //DELETE
        // can't delete ROOT_ADMIN
        this.state.deleteUserEmail !== "1"
            ? this.state.client
                .mutate({
                    variables: { id: this.state.deleteUserId },
                    mutation: USER_DELETE,
                })
                .then(response => {
                    let temp = null
                    // console.log(response)
                    temp = this.deleteRow(this.state.deleteUserId)
                    this.setState({ allUsers: temp })

                })

                .catch(error => console.log(error))

            : console.log('Cant delete admin')
    };

    //Delete row on allUsers, no need for new query
    deleteRow = deletedId => {
        const data = this.state.allUsers.slice();
        // console.log('data', data)
        const index = data.findIndex(row => row.id === deletedId);
        if (index > -1) {
            data.splice(index, 1);
        };
        return data;
    };



    render() {
        const { classes } = this.props
        const { allUsers, deleteUserId, deleteUserEmail, open, deleteStatus } = this.state
        return (
            <Paper className={classes.root} elevation={5}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Usertype</TableCell>
                            <TableCell align="center">User id</TableCell>
                            <TableCell align="center">Apikey</TableCell>
                            <TableCell align="center">User created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell component="th" scope="row">
                                    {row.email}
                                </TableCell>
                                <TableCell align="center">{row.userType}</TableCell>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.apiKey}</TableCell>
                                <TableCell align="center">{moment(row.createdAt).format('DD.MM.YYYY - HH:mm')}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => {
                                        //dialog
                                        this.handleClickOpen()
                                        this.setState({ deleteUserEmail: row.email, deleteUserId: row.id })
                                    }}>
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    open={this.state.open}
                    handleCloseNo={this.handleCloseNo}
                    handleCloseYes={this.handleCloseYes}
                />
            </Paper>

        );
    }
}

export default withStyles(styles)(withApollo(AdminHome));



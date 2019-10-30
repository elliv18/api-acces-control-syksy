import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid, IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { homeStyle } from './Styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/Edit'

import ConfirmDialog from "./ConfirmDialog";
import { USER_DELETE } from "../../lib/gql/mutations";

import { AdminHomeStyles } from './Styles'
import DialogResetPw from "./DialogResetPw";

var moment = require('moment');


class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            client: props.client,
            email: undefined,
            openConfirm: false,
            allUsers: [],
            openPwReset: false,
            selectedUserId: null,
            selectedUserEmail: null
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
    handleOpenDelete = () => {
        this.setState({ openConfirm: true })
    };

    handleOpenPwReset = () => {
        console.log('OPEN')
        this.setState({ openPwReset: true })
    };

    handleClose = () => {
        this.setState({ openConfirm: false, openPwReset: false })
        console.log('Close')
    };

    handleCloseDeleteYes = () => {
        this.setState({ openConfirm: false })
        console.log('DELETE', this.state.selectedUserId)

        //DELETE
        // can't delete ROOT_ADMIN
        this.state.selectedUserEmail !== "1"
            ? this.state.client
                .mutate({
                    variables: { id: this.state.selectedUserId },
                    mutation: USER_DELETE,
                })
                .then(response => {
                    let temp = null
                    // console.log(response)
                    temp = this.deleteRow(this.state.selectedUserId)
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
        const { allUsers, openConfirm, openPwReset, selectedUserId, selectedUserEmail } = this.state
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
                                    <Tooltip title={"Delete user & apikey"}>
                                        <IconButton onClick={() => {
                                            //dialog
                                            this.handleOpenDelete()
                                            this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
                                        }}>
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={"Reset password"}>
                                        <IconButton onClick={() => {
                                            //dialog
                                            this.handleOpenPwReset()
                                            this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    open={openConfirm}
                    handleClose={this.handleClose}
                    handleCloseYes={this.handleCloseDeleteYes}
                />
                <DialogResetPw
                    open={openPwReset}
                    handleClose={this.handleClose}
                    userId={selectedUserId}
                    userEmail={selectedUserEmail}
                    title={"Reset user password?"}
                />
            </Paper>

        );
    }
}

export default withStyles(AdminHomeStyles)(withApollo(AdminHome));



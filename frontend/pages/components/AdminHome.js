import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid, IconButton, Tooltip, CssBaseline } from "@material-ui/core";
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
import AddIcon from '@material-ui/icons/Add'

import ConfirmDialog from "./ConfirmDialog";
import { USER_DELETE } from "../../lib/gql/mutations";

import { AdminHomeStyles } from './Styles'
import DialogResetPw from "./DialogResetPw";
import DialogAddUser from "./DialogAddUser";


var moment = require('moment');



//customcell
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
        borderBottomStyle: 'solid',
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.tableCell.default,
    },
}))(TableCell);


////////''''''''''''''CLASS'''''''''''''/////////////
class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleAddedData = this.handleAddedData.bind(this)
        this.state = {
            client: props.client,
            email: undefined,
            openConfirm: false,
            openPwReset: false,
            openAddUser: false,
            allUsers: [],
            addedRow: null,
            selectedUserId: null,
            selectedUserEmail: null,
            rowColor: 'lightGray'
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
    //Basic close
    handleClose = () => {
        this.setState({ openConfirm: false, openPwReset: false, openAddUser: false })
        console.log('Close')
    };
    //Add user close
    handleAddedData(added, id) {
        let temp = null;
        this.setState({ addedRow: added })

        console.log('Added', this.state.addedRow, 'index', this.state.allUsers.length)

        temp = [
            ...this.state.allUsers,
            added.user
        ]
        this.setState({ allUsers: temp })
        //console.log('edit', temp)
    }

    //handle opens
    handleOpenDelete = () => {
        this.setState({ openConfirm: true })
    };

    handleOpenPwReset = () => {
        console.log('OPEN')
        this.setState({ openPwReset: true })
    };
    handleOpenAddUser = () => {
        this.setState({ openAddUser: true })
    };

    //handle delete close

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
        const { allUsers,
            openConfirm,
            openPwReset,
            selectedUserId,
            selectedUserEmail,
            openAddUser,
            rowColor
        } = this.state
        return (
            <Paper className={classes.root} elevation={5}>
                <CssBaseline />
                <Table stickyHeader aria-label="sticky table" className={classes.table} aria-label="simple table">
                    <TableHead >
                        <TableRow >
                            <StyledTableCell align="center">
                                <div>
                                    <Tooltip title={"Add user"} className={classes.addButton}>
                                        <IconButton onClick={this.handleOpenAddUser}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">Email</StyledTableCell>
                            <StyledTableCell align="center">Usertype</StyledTableCell>
                            <StyledTableCell align="center">User id</StyledTableCell>
                            <StyledTableCell align="center">Apikey</StyledTableCell>
                            <StyledTableCell align="center">User created</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers.map((row, i) => (

                            <TableRow key={i} style={{ backgroundColor: row.userType === 'ADMIN' ? rowColor : null }}>
                                <StyledTableCell align="center">

                                    <Tooltip title={"Delete user & apikey"}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                //dialog
                                                this.handleOpenDelete()
                                                this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
                                            }}>
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={"Reset password"}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                //dialog
                                                this.handleOpenPwReset()
                                                this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
                                            }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" align="center">
                                    {row.email}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.userType}</StyledTableCell>
                                <StyledTableCell align="center">{row.id}</StyledTableCell>
                                <StyledTableCell align="center">{row.apiKey}</StyledTableCell>
                                <StyledTableCell align="center">{moment(row.createdAt).format('DD.MM.YYYY - HH:mm')}</StyledTableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    open={openConfirm}
                    email={selectedUserEmail}
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

                <DialogAddUser
                    open={openAddUser}
                    handleClose={this.handleClose}
                    handleAddedData={this.handleAddedData}
                />
            </Paper>

        );
    }
}

export default withStyles(AdminHomeStyles)(withApollo(AdminHome));


/*

               */
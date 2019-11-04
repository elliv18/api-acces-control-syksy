import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid, IconButton, Tooltip, CssBaseline, Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { homeStyle } from './Styles'

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';

import ConfirmDialog from "./ConfirmDialog";
import { USER_DELETE } from "../../lib/gql/mutations";

import { AdminHomeStyles } from './Styles'
import DialogResetPw from "./DialogResetPw";
import DialogAddUser from "./DialogAddUser";

import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import helpers from "../../src/components/helpers";
import AdminTableHeaders from "./table/AdminTableHeaders";
import { StyledTableCell, desc, stableSort, getSorting } from './table/tableFunctions'
import AdminTableBody from "./AdminTableBody";
import DoneSnackbar from "./SnackBar";

var moment = require('moment');




////////''''''''''''''CLASS'''''''''''''/////////////
class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleAddedData = this.handleAddedData.bind(this)
        this.handleOpenAddUser = this.handleOpenAddUser.bind(this)
        this.getSelected = this.getSelected.bind(this)
        this.setAutoHide = this.setAutoHide.bind(this)
        this.getMessage = this.getMessage.bind(this)
        this.state = {
            client: props.client,
            email: undefined,
            openConfirm: false,
            openPwReset: false,
            openAddUser: false,
            openSnack: false,
            allUsers: [],
            addedRow: null,
            selectedEmails: [],
            selected: [],
            message: '',
            autoHide: null,
            failed: false,
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

    getSelected = (selected) => {
        this.setState({ selected: selected })
    }
    getMessage = (msg) => {
        this.setState({ message: msg })
        console.log(this.state.message)
        this.handleOpenSnack()
    }
    setAutoHide = (autoHide) => {
        this.setState({ autoHide: autoHide })
    }

    // SNACK
    //HANDLE SNACKBAR
    handleOpenSnack = () => {
        this.state.message !== ''
            ? this.setState({ openSnack: true })
            : this.setState({ openSnack: false })
    };

    handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnack: false, autoHide: null })
        // setAutoHide(null)
        // setButtonDisabled(false)
        // props.handleClose()
    };

    // Dialog state handlers
    //Basic close
    handleClose = () => {
        this.setState({ openConfirm: false, openPwReset: false, openAddUser: false })
        //this.getMessage()
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
    /////////////////////////////////////////////////////////////////////
    handleCloseDeleteYes = async () => {
        let data = null
        await helpers.deleteUser(this.state.selected, this.state.client);
        data = await helpers.deleteRows(this.state.selected, this.state.allUsers)
        this.setState({ openConfirm: false, allUsers: data, autoHide: 6000 })
        this.handleOpenSnack()
    }




    render() {
        const { classes } = this.props
        const { allUsers,
            openConfirm,
            openPwReset,
            openSnack,
            selectedEmails,
            openAddUser,
            selected,
            message,
            autoHide
        } = this.state
        return (
            //  console.log(helpers.getEmailFromId(selected, allUsers)),
            <Paper className={classes.root} elevation={5}>
                <CssBaseline />

                <AdminTableBody
                    allUsers={allUsers}
                    handleOpenDelete={this.handleOpenDelete}
                    handleOpenAddUser={this.handleOpenAddUser}
                    handleOpenPwReset={this.handleOpenPwReset}
                    classes={classes}
                    getSelected={this.getSelected}
                    client={this.state.client}
                />

                <ConfirmDialog
                    open={openConfirm}
                    selected={selected}
                    allUsers={allUsers}
                    handleClose={this.handleClose}
                    handleCloseYes={this.handleCloseDeleteYes}
                    getMessage={this.getMessage}
                />
                <DialogResetPw
                    open={openPwReset}
                    handleClose={this.handleClose}
                    userIds={selected}
                    userEmail={selectedEmails}
                    allUsers={allUsers}
                    setAutoHide={this.setAutoHide}
                    getMessage={this.getMessage}
                    userType={this.props.userType}
                    title={"Reset user password?"}
                />

                <DialogAddUser
                    open={openAddUser}
                    handleClose={this.handleClose}
                    handleAddedData={this.handleAddedData}
                    getMessage={this.getMessage}
                    setAutoHide={this.setAutoHide}

                />

                <DoneSnackbar
                    open={openSnack}
                    message={message}
                    onClose={this.handleCloseSnack}
                    autoHide={autoHide}
                    handleClose={this.handleCloseSnack}
                />
            </Paper>

        );
    }
}

export default withStyles(AdminHomeStyles)(withApollo(AdminHome));








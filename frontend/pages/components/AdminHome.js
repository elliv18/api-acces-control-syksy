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

var moment = require('moment');

//customcell






//***************************TABLE***************************** */





//**************************************** HEAD *********************************************************** */






////////''''''''''''''CLASS'''''''''''''/////////////
class AdminHome extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleAddedData = this.handleAddedData.bind(this)
        this.handleOpenAddUser = this.handleOpenAddUser.bind(this)
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
            rowColor: 'lightGray',
            order: 'asc',
            orderBy: 'email',
            selected: []
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

    getSelected = () => {
        console.log(this.state.selected)
        this.setState({ selected: [] })
    }

    //********TABLE SORTING & SELECTING */
    handleRequestSort = (event, property) => {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        isDesc ? this.setState({ order: 'asc' }) : this.setState({ order: 'desc' })
        this.setState({ orderBy: property })
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = this.state.allUsers.map(n => n.id);
            this.setState({ selected: newSelecteds })
            return;
        }
        this.setState({ selected: [] })
    };

    handleClickSelect = (event, id) => {
        const selectedIndex = this.state.selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected })
        //console.log('select', this.state.selected)
    };


    isSelected = id => this.state.selected.indexOf(id) !== -1;
    //********TABLE SORTING & SELECTING ENDS */


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
    /////////////////////////////////////////////////////////////////////
    handleCloseDeleteYes = async () => {
        let data = null
        await helpers.deleteUser(this.state.selected, this.state.allUsers, this.state.client);
        data = await helpers.deleteRows(this.state.selected, this.state.allUsers)
        this.setState({ openConfirm: false, allUsers: data })

    }


    render() {
        const { classes } = this.props
        const { allUsers,
            openConfirm,
            openPwReset,
            selectedUserId,
            selectedUserEmail,
            openAddUser,
            selected,
            order,
            orderBy,
            rowColor
        } = this.state
        return (
            <Paper className={classes.root} elevation={5}>
                <CssBaseline />

                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                >
                    <AdminTableHeaders
                        getSelected={this.getSelected}
                        selected={selected}
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={allUsers.length}
                        handleOpenDelete={this.handleOpenDelete}
                        handleOpenAddUser={this.handleOpenAddUser}
                    />
                    <TableBody>
                        {stableSort(allUsers, getSorting(order, orderBy))
                            .map((row, index) => {
                                const isItemSelected = this.isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={index}
                                        hover
                                        onClick={event => this.handleClickSelect(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                    >
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            {row.email}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.userType}</StyledTableCell>
                                        <StyledTableCell align="center">{row.id}</StyledTableCell>
                                        <StyledTableCell align="center">{row.apiKey}</StyledTableCell>
                                        <StyledTableCell align="center">{moment(row.createdAt).format('DD.MM.YYYY - HH:mm')}</StyledTableCell>

                                        <StyledTableCell align="left" style={{ width: '130px' }}>
                                            <Tooltip title={"Delete user & apikey"}
                                                style={{ display: selected.length < 2 ? 'initial' : 'none' }}

                                            >
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

                                            <Tooltip title={"Reset password"}
                                                style={{ display: selected.length < 2 ? 'initial' : 'none' }}

                                            >
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


                                    </TableRow>

                                );
                            })}

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








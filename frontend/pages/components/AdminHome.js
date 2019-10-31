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

import ConfirmDialog from "./ConfirmDialog";
import { USER_DELETE } from "../../lib/gql/mutations";

import { AdminHomeStyles } from './Styles'
import DialogResetPw from "./DialogResetPw";
import DialogAddUser from "./DialogAddUser";
import AdminUsersTable from "../../src/components/tableFunctions";

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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';


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


//**************************** TOOLBARTABLE ********************** */



//***************************TABLE***************************** */
const headCells = [

    { id: 'actions', numeric: false, disablePadding: true },
    { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
    { id: 'userTypes', numeric: false, disablePadding: false, label: 'Usertype' },
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'apikey', numeric: false, disablePadding: false, label: 'Apikey' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created' },
];


function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

//**************************************** HEAD *********************************************************** */

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />


                </StyledTableCell>
                {headCells.map(headCell => (
                    <StyledTableCell
                        key={headCell.id}
                        align={'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.id === 'actions'
                                ? <Tooltip title={"Add user"} className={classes.addButton}>
                                    <IconButton onClick={props.handleOpenAddUser}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                                : headCell.label

                            }
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? '' : ''}
                                </span>
                            ) : null}
                        </TableSortLabel>



                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}




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


    handleRequestSort = (event, property) => {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        isDesc ? this.setState({ order: 'asc' }) : this.setState({ order: 'desc' })
        this.setState({ orderBy: property })
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = this.state.allUsers.map(n => n.name);
            this.setState({ selected: newSelecteds })
            return;
        }
        this.setState({ selected: [] })
    };

    handleClickSelect = (event, name) => {
        const selectedIndex = this.state.selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, name);
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
    };


    isSelected = name => this.state.selected.indexOf(name) !== -1;


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
                    <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={allUsers.length}
                        handleOpenAddUser={this.handleOpenAddUser}
                    />
                    <TableBody>
                        {stableSort(allUsers, getSorting(order, orderBy))
                            .map((row, index) => {
                                const isItemSelected = this.isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        key={index}
                                        hover
                                        onClick={event => this.handleClickSelect(event, row.name)}
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
                                        <StyledTableCell align="center">
                                            {row.email}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.userType}</StyledTableCell>
                                        <StyledTableCell align="center">{row.id}</StyledTableCell>
                                        <StyledTableCell align="center">{row.apiKey}</StyledTableCell>
                                        <StyledTableCell align="center">{moment(row.createdAt).format('DD.MM.YYYY - HH:mm')}</StyledTableCell>


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


/*



function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };


/*
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

<TableRow
                        hover
                        onClick={event => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >                                <StyledTableCell align="center">

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
                </Table>*/





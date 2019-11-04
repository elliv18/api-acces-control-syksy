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



function AdminTableBody(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('email');
    const [selected, setSelected] = React.useState([]);

    const { classes } = props;

    const getRowId = (id) => {
        setSelected(id)
    }

    //********TABLE SORTING & SELECTING */
    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = props.allUsers.map(n => n.id);
            setSelected(newSelecteds);
            props.getSelected(newSelecteds)
            return;
        }
        setSelected([]);
        props.getSelected([])
    };

    const handleClickSelect = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        props.getSelected(newSelected)
    };





    const isSelected = id => selected.indexOf(id) !== -1;
    //********TABLE SORTING & SELECTING ENDS */


    return (
        <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
            stickyHeader
        >
            <AdminTableHeaders
                // getSelected={this.getSelected}
                selected={selected}
                classes={classes}
                numSelected={selected.length}
                setSelected={setSelected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props.allUsers.length}
                handleOpenDelete={props.handleOpenDelete}
                handleOpenAddUser={props.handleOpenAddUser}
                handleOpenPwReset={props.handleOpenPwReset}
            />
            <TableBody>
                {stableSort(props.allUsers, getSorting(order, orderBy))
                    .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow
                                key={index}
                                hover
                                // onClick={event => handleClickSelect(event, row.id)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                            >
                                <StyledTableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        onClick={event => handleClickSelect(event, row.id)}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </StyledTableCell>

                                <StyledTableCell align="left" style={{ width: '160px' }}>
                                    <Tooltip title={"Delete user & apikey"}
                                        style={{ display: selected.length === 0 ? 'initial' : 'none' }}

                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={event => {
                                                //dialog
                                                handleClickSelect(event, row.id)
                                                props.handleOpenDelete()
                                                setSelected([])

                                                // this.setState({selectedUserEmail: row.email, selectedUserId: row.id })
                                            }}>
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title={"Reset password"}
                                        style={{ display: selected.length === 0 ? 'initial' : 'none' }}

                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={event => {
                                                //dialog
                                                handleClickSelect(event, row.id)
                                                props.handleOpenPwReset()
                                                setSelected([])
                                                //this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
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
        </Table >
    )
}
export default withStyles(AdminHomeStyles)(AdminTableBody)
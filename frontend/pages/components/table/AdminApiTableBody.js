import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
//ICONS
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
//TABLE
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
//OMAT
import { AdminHomeStyles } from '../Styles'
import helpers from "../../../src/components/helpers";
import AdminApiTableHeaders from "./AdminApiTableHeaders";
import { StyledTableCell, desc, stableSort, getSorting } from './tableFunctions'

var moment = require('moment');



function AdminApiTableBody(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('email');
    const [selected, setSelected] = React.useState([]);
    const [apikey, setApikey] = React.useState(null);


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
            const newSelecteds = props.apiList.map(n => n.id);
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
            aria-label="users table"
            stickyHeader
        >
            <AdminApiTableHeaders
                // getSelected={this.getSelected}
                selected={selected}
                classes={classes}
                numSelected={selected.length}
                setSelected={setSelected}
                rowCount={props.apiList.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                handleOpenAddApi={props.handleOpenAddApi}
            />
            <TableBody>
                {stableSort(props.apiList, getSorting(order, orderBy))
                    .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                            <TableRow
                                key={index}
                                hover
                                // onClick={event => handleClickSelect(event, row.id)}
                                //aria-checked={isItemSelected}
                                tabIndex={-1}
                                selected={isItemSelected}
                            >
                                <StyledTableCell padding="checkbox">
                                    <Checkbox
                                        type="checkbox"
                                        checked={isItemSelected}
                                        onClick={event => handleClickSelect(event, row.id)}
                                        inputProps={{ 'aria-label': 'select user' }}
                                    />
                                </StyledTableCell>

                                <StyledTableCell align="left" style={{ width: '180px' }}>
                                    <div>
                                        <Tooltip title={"Delete api"}
                                            style={{ display: selected.length === 0 ? 'initial' : 'none' }}

                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={event => {
                                                    //dialog
                                                    handleClickSelect(event, row.id)
                                                    props.handleOpenConfirm()
                                                    setSelected([])

                                                    // this.setState({selectedUserEmail: row.email, selectedUserId: row.id })
                                                }}>
                                                <DeleteOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={"Edit api"}
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

                                        <Tooltip title={"Create new apikey"}
                                            style={{ display: selected.length === 0 ? 'initial' : 'none' }}
                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={event => {
                                                    //dialog
                                                    handleClickSelect(event, row.id)
                                                    helpers.createNewApikey(props.client)
                                                    setSelected([])
                                                    //this.setState({ selectedUserEmail: row.email, selectedUserId: row.id })
                                                }}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </StyledTableCell>

                                <StyledTableCell align="center">{row.name}</StyledTableCell>
                                <StyledTableCell align="center">{row.path}</StyledTableCell>
                                <StyledTableCell align="center">{row.id}</StyledTableCell>
                            </TableRow>

                        );
                    })}

            </TableBody>
        </Table >
    )
}
export default withStyles(AdminHomeStyles)(AdminApiTableBody)


/*

*/


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { AdminHomeStyles } from '../Styles';
import { Paper, Grid, IconButton, Tooltip, CssBaseline, Toolbar, withStyles, Checkbox } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';
import { StyledTableCell } from './tableFunctions'



const headCells = [

    { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
    { id: 'userType', numeric: false, disablePadding: false, label: 'Usertype' },
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'apikey', numeric: false, disablePadding: false, label: 'Apikey' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created' },
    { id: 'actions' },

];

function AdminTableHeaders(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        property !== 'actions' ? onRequestSort(event, property) : null
    };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all ' }}
                    />

                </StyledTableCell>
                {headCells.map(headCell => (
                    <StyledTableCell
                        key={headCell.id}
                        align={'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            hideSortIcon={true}
                            active={headCell.id !== 'actions' && orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id && headCell.id !== 'actions' ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? '' : ''}
                                </span>
                            ) : headCell.id === 'actions' && props.selected.length === 0

                                    ? <Tooltip title={"Add user"} className={classes.addButton}>
                                        <IconButton onClick={props.handleOpenAddUser}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                    : headCell.id === 'actions'

                                        ? <Tooltip title={"Delete selected"} className={classes.deleteUpButton}>
                                            <IconButton onClick={props.handleOpenDelete}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>

                                        : null}
                        </TableSortLabel>

                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default AdminTableHeaders//withStyles(AdminHomeStyles) 
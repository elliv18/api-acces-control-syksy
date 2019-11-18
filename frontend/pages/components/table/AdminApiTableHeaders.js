


import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { IconButton, Tooltip, Checkbox } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';
import { StyledTableCell } from './tableFunctions'
import EditIcon from '@material-ui/icons/Edit'
import { APIS_DELETE } from '../../../lib/gql/mutations';



const headCells = [
    { id: 'actions' },
    { id: 'name', label: 'Name' },
    { id: 'path', label: 'Path' },
    { id: 'urls', label: 'Urls & Methods' },

];

function AdminApiTableHeaders(props) {
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
                            <div >{headCell.label}</div>
                            {orderBy === headCell.id && headCell.id !== 'actions' ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? '' : ''}
                                </span>
                            ) : headCell.id === 'actions' && props.selected.length === 0

                                    ?
                                    <Tooltip title={"Add api"} className={classes.addButton}>
                                        <IconButton onClick={props.handleOpenAddApi}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>

                                    : headCell.id === 'actions'

                                        ?
                                        <div >
                                            <Tooltip title={"Delete selected"} className={classes.deleteUpButton}>
                                                <IconButton
                                                    //disabled={true}

                                                    onClick={() => {
                                                        props.handleOpenConfirm()
                                                        props.setSelected([])
                                                    }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>

                                        : null}
                        </TableSortLabel>

                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default AdminApiTableHeaders
import React from "react";

import { withApollo } from "react-apollo";
import { USERS_QUERY } from "../../lib/gql/queries";

import { Paper, Grid, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { homeStyle } from './Styles'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { confirmDialogStyle } from './Styles'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';




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
        this.setState({ open: false })
        console.log('No')
    };

    handleDeleteUser(id) {
        console.log('DELETE User', id)
        this.setState({ open: false })
    }



    render() {
        const { classes } = this.props
        const { allUsers, deleteUserId, deleteUserEmail, open } = this.state
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
                                        this.handleClickOpen(deleteUserId)
                                        this.setState({ deleteUserEmail: row.email, deleteUserId: row.id })
                                    }}>
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog
                    open={open}
                    onClose={this.handleCloseNo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-slide-title" className={classes.backgroundDialogTitle}>
                        Do you want remove apikey?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className={classes.textDialog}>
                            User: <br />{deleteUserEmail}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions className={classes.contentDialog}>
                        <Button variant="outlined" onClick={() => this.handleDeleteUser(deleteUserId)}>
                            <a className={classes.buttonDialogTextYes}>Yes</a>

                        </Button>
                        <Button variant="outlined" onClick={this.handleCloseNo} autoFocus>
                            <a className={classes.buttonDialogTextNo}>No</a>
                        </Button>
                    </DialogActions>
                </Dialog>


            </Paper>

        );
    }
}

export default withStyles(styles)(withApollo(AdminHome));



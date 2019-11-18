import React from "react";
import { withApollo } from "react-apollo";
import { USERS_QUERY, API_LIST_QUERY } from "../../lib/gql/queries";
import { Paper, Grid, IconButton, Tooltip, CssBaseline, Toolbar, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
// omat componentit
import ConfirmDialog from "./ConfirmDialog";
import { AdminHomeStyles } from './Styles'
import DialogResetPw from "./DialogResetPw";
import DialogAddUser from "./DialogAddUser";
import helpers from "../../src/components/helpers";
import AdminUsersTableBody from "./table/AdminUsersTableBody";
import DoneSnackbar from "./SnackBar";
import AdminApiTableBody from "./table/AdminApiTableBody";
import DialogAddApi from "./DialogAddApi";
import { APIS_DELETE } from "../../lib/gql/mutations";

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
        this.handleOpenAddApi = this.handleOpenAddApi.bind(this)
        // table shows filteredUsers array, need allUsers when remove searchfield
        // all components uses allUsers array
        this.state = {
            client: props.client,
            email: undefined,
            openConfirm: false,
            openPwReset: false,
            openAddUser: false,
            openSnack: false,
            allUsers: [],
            filteredUsers: [],
            addedRow: null,
            selectedEmails: [],
            selected: [],
            message: '',
            autoHide: null,
            failed: false,
            value: '',
            apiList: [],
            openAddApi: false,
            isUsersConfirm: true
        };
    }

    async componentDidMount() {
        // USERS
        let data = null
        await this.state.client
            .query({
                query: USERS_QUERY
            })
            .then(res => {
                data = res.data.allUsers
                console.log(data)
            })
            .catch(e => console.log(e))
        this.setState({ allUsers: data, filteredUsers: data })

        // APILIST
        await this.state.client
            .query({
                query: API_LIST_QUERY
            })
            .then(res => {
                // console.log(res)
                this.setState({ apiList: res.data.getApiList })
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
        this.setState({ openConfirm: false, openPwReset: false, openAddUser: false, openAddApi: false })
        //this.getMessage()
        console.log('Close')
    };
    //Add user close
    handleAddedData(added, id) {
        let temp = null;
        this.setState({ addedRow: added })

        // console.log('Added', this.state.addedRow, 'index', this.state.allUsers.length)

        temp = [
            ...this.state.allUsers,
            added.user
        ]
        this.setState({ allUsers: temp, filteredUsers: temp, value: '' })
        //console.log('edit', temp)
    }

    //handle opens
    handleOpenConfirm = () => {
        this.setState({ openConfirm: true })
    };
    handleOpenConfirmApis = () => {
        this.setState({ isUsersConfirm: false, openConfirm: true })
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
        this.setState({ openConfirm: false, allUsers: data, autoHide: 6000, filteredUsers: data, value: '' })
        this.handleOpenSnack()
    }

    handleDeleteApis = async (ids) => {
        let data = null

        console.log(ids)
        await this.state.client
            .mutate({
                variables: {
                    api_ids: ids
                },
                mutation: APIS_DELETE
            })
        data = await helpers.deleteApiRows(ids, this.state.apiList)
        console.log(data)
        this.setState({ apiList: data })
        this.handleClose()
    }

    handleOpenAddApi = () => {
        this.setState({ openAddApi: true })
    }

    handleFilter = (e) => {
        let value = e.target.value
        let newlist = []
        let newlistEmails = []
        let newlistId = []
        let currentList = this.state.allUsers
        const noData = [
            { email: 'No results found', id: 'No results found', createdAt: 'No results found' },

        ];

        newlistEmails = currentList.filter(filter => {
            return filter.email.includes(value)
        })
        newlistId = currentList.filter(filter => {
            return filter.id.includes(value)
        })

        //console.log(newlistEmails.length)
        newlistEmails.length === 0 && newlistId.length === 0
            ? newlist = [
                ...noData
            ]
            : newlist = [
                ...newlistEmails,
                ...newlistId
            ]
        //      console.log(newlist)

        this.setState({ filteredUsers: newlist, value: value })
        //console.log(this.state.filteredUsers)
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
            autoHide,
            filteredUsers,
            value,
            apiList,
            openAddApi
        } = this.state
        return (
            //  console.log(helpers.getEmailFromId(selected, allUsers)),
            <Paper className={classes.root} elevation={5}>
                <CssBaseline />

                <div style={{ minWidth: 722 }}>
                    <TextField
                        aria-label="search field"
                        type="text"
                        fullWidth
                        label='Search...'
                        style={{ backgroundColor: '#3c7c9e' }}
                        variant={'filled'}
                        onChange={this.handleFilter}
                        value={value} />
                </div>

                {this.props.switchState === 'USERS'
                    ? <AdminUsersTableBody
                        allUsers={filteredUsers}
                        handleOpenConfirm={this.handleOpenConfirm}
                        handleOpenAddUser={this.handleOpenAddUser}
                        handleOpenPwReset={this.handleOpenPwReset}
                        classes={classes}
                        getSelected={this.getSelected}
                        client={this.state.client}
                    />
                    : <AdminApiTableBody
                        handleOpenConfirm={this.handleOpenConfirmApis}
                        handleOpenAddApi={this.handleOpenAddApi}
                        apiList={apiList}
                        getSelected={this.getSelected}
                        client={this.state.client}

                    />

                }

                <ConfirmDialog
                    open={openConfirm}
                    selected={selected}
                    allUsers={allUsers}
                    handleClose={this.handleClose}
                    handleCloseYes={this.handleCloseDeleteYes}
                    getMessage={this.getMessage}
                    handleDeleteApis={this.handleDeleteApis}
                    isUsersConfirm={this.state.isUsersConfirm}
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

                <DialogAddApi
                    open={openAddApi}
                    handleClose={this.handleClose}
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








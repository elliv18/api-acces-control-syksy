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
        this.getAddedApiData = this.getAddedApiData.bind(this)
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
            filteredApis: [],
            addedRow: null,
            selectedEmails: [],
            selected: [],
            message: '',
            autoHide: null,
            failed: false,
            value: '',
            apiList: [],
            openAddApi: false,
            isUsersConfirm: true,
            switchState: this.props.switchState
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        //  console.log(nextProps.switchState, prevState.switchState)
        if (nextProps.switchState !== prevState.switchState) {
            return {
                value: '',
                switchState: nextProps.switchState,
                filteredUsers: prevState.allUsers,
                filteredApis: prevState.apiList
            }
        }
        return null;
    }

    async componentDidMount() {
        // USERS
        let data = null

        await this.props.client
            .query({

                query: USERS_QUERY
            })
            .then(res => {
                this.setState({ allUsers: res.data.allUsers, filteredUsers: res.data.allUsers })
            })
            .catch(e => console.log(e))


        // APILIST
        await this.state.client
            .query({
                query: API_LIST_QUERY,

            })
            .then(res => {
                // console.log(res)
                this.setState({ apiList: res.data.getApiList, filteredApis: res.data.getApiList })
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

    getAddedApiData = (data) => {
        let temp = null;
        // console.log('data', this.state.apiList)

        temp = [
            ...this.state.apiList,
            data
        ]
        //     console.log(temp)
        this.setState({ apiList: temp, filteredApis: temp })
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
        let newlistApis = []
        //  console.log(this.state.allUsers)
        let currentListUsers = this.state.allUsers
        let currentListApis = this.state.apiList

        const noUsersData = [
            { email: 'No results found', createdAt: 'No results found' },
        ];
        const noApisData = [
            { api_name: 'No results found', api_id: 'No results found' },
        ];

        this.props.switchState === 'USERS'
            ? (
                newlist = currentListUsers.filter(filter => {
                    return filter.email.includes(value)
                }),

                newlist.length > 0
                    ? this.setState({ filteredUsers: newlist })
                    : this.setState({ filteredUsers: noUsersData })
            )
            : (
                newlist = currentListApis.filter(filter => {

                    return filter.api_name.includes(value)
                }),

                newlist.length > 0
                    ? this.setState({ filteredApis: newlist })
                    : this.setState({ filteredApis: noApisData })
            )

        newlist = [...newlist]
        this.setState({ value: value })

        //      console.log(newlist)
        // console.log(this.state.filteredApis, this.state.filteredUsers)

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
            openAddApi,
            filteredApis
        } = this.state
        return (
            //  console.log(helpers.getEmailFromId(selected, allUsers)),
            <Paper className={classes.root} elevation={5}>
                <CssBaseline />

                <div className={classes.table}>
                    <TextField
                        aria-label="search field"
                        type="text"
                        fullWidth
                        label={this.props.switchState === 'USERS' ? 'Search by email ...' : 'Search by name ...'}
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
                        apiList={filteredApis}
                        getSelected={this.getSelected}
                        client={this.state.client}
                        getAddedApiData={this.getAddedApiData}

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
                    getAddedApiData={this.getAddedApiData}

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








import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RemoveRedEye, GestureTwoTone } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Select, InputLabel, Typography, Container, FormControl } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import AddIcon from '@material-ui/icons/Add'

import { addUserStyle } from './Styles'
import { CREATE_NEW_API } from '../../lib/gql/mutations';
import { API_LIST_QUERY } from '../../lib/gql/queries';


function DialogAddApi(props) {
    const [name, setName] = React.useState(null);
    const [api_path, setApi_Path] = React.useState(null);
    const [api_target, setApi_target] = React.useState(null);

    const [urls, setUrls] = React.useState([]);
    const [url, setUrl] = React.useState('');
    const [method, setMethod] = React.useState('');
    const [errorStatusRoot, setErrorStatusRoot] = React.useState(false);
    const [errorStatusTarget, setErrorStatusTarget] = React.useState(false);
    const [disabled, setDisabled] = React.useState(true);

    const [helpMsgRoot, setHelpMsgRoot] = React.useState('');
    const [helpMsgTarget, setHelpMsgTarget] = React.useState('');





    const { classes } = props

    const handleAddApi = async () => {
        console.log(name, api_path, api_target, urls)
        await props.client
            .mutate({
                variables: {
                    name: name,
                    url_path: api_path,
                    url_target: api_target,
                    urls: urls
                },
                mutation: CREATE_NEW_API,
                refetchQueries: [{ query: API_LIST_QUERY }],

            })
            .then(res => {
                // console.log(res.data.createNewAPI.api)
                props.getAddedApiData(res.data.createNewAPI.api)
            })
            .catch(e => console.log(e))

        setUrls([])
        props.handleClose()
    }

    const nameChange = (e) => {
        setName(e.target.value)
    }
    const pathChange = (e) => {
        let value = e.target.value;
        console.log(value.slice(0, 1))
        value.slice(0, 1) === '/' && value.slice(-1) === '/'
            ? (
                setApi_Path(e.target.value),
                setErrorStatusRoot(false),
                setHelpMsgRoot('')
            )
            : (
                setErrorStatusRoot(true),
                setHelpMsgRoot('Must start and end /')
            )
    }
    const targetChange = (e) => {
        let value = e.target.value;
        let httpHttps = value.slice(0, 8);
        console.log(httpHttps)
        httpHttps.includes('http://') || httpHttps.includes('https://')
            ? value.slice(-1) === '/' ?
                (
                    setApi_target(e.target.value),
                    setErrorStatusTarget(false),
                    setHelpMsgTarget('')
                )
                : (
                    setErrorStatusTarget(true),
                    setHelpMsgTarget('Must end /')
                )
            : (
                setErrorStatusTarget(true),
                setHelpMsgTarget('Must start with http:// or https://')
            )
    }
    const urlChange = (e) => {
        let value = e.target.value
        setUrl(value)
    }
    const methodChange = (e) => {
        let value = e.target.value.split(',')
        setMethod(value)
    }
    const urlsToArray = (e) => {
        let temp = {
            url: url,
            methods: method,
        }
        console.log(temp)
        setUrls([temp, ...urls])
        setUrl('')
        setMethod('')

    }
    const test = (e) => {
        console.log('name', name, 'path', api_path, 'target', api_target)
        // setUrl('')
        // urlsToArray()
        console.log(urls)
    }


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Container className={classes.main}>
                <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Create new api</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <FormControl className={classes.textField} >
                        <TextField
                            autoFocus
                            fullWidth
                            label={"name"}
                            type="text"
                            onChange={nameChange}
                        />
                        <TextField

                            id="root_url"
                            fullWidth
                            label={"exp: /test/"}
                            helperText={helpMsgRoot}
                            error={errorStatusRoot}
                            required
                            type="text"
                            onChange={pathChange}


                        />
                        <TextField
                            fullWidth
                            label={"api_target"}
                            type="text"
                            onChange={targetChange}
                            required
                            error={errorStatusTarget}
                            helperText={helpMsgTarget}
                        />
                        <div style={{
                            marginTop: '20px',
                            bottom: 0,
                            backgroundColor: '#f0f0f0',
                            padding: 10
                        }}>
                            ADD URLS AND METHODS
                            <IconButton onClick={urlsToArray} style={{ color: 'green' }}>
                                <AddIcon />
                            </IconButton>
                            <TextField
                                style={{ marginBottom: 5 }}
                                fullWidth
                                onChange={urlChange}
                                label={"urls"}

                                value={url}

                                type="text"
                            //  onChange={handleEmailChange}
                            />

                            <TextField
                                fullWidth
                                onChange={methodChange}
                                label={"Methods"}
                                value={method}

                                type="text"
                            //  onChange={handleEmailChange}
                            />
                        </div>

                    </FormControl>


                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={props.handleClose} color="primary" >
                        <a className={classes.buttonDialogTextNo}>Cancel</a>
                    </Button>
                    <Button
                        onClick={handleAddApi}
                        color="primary"
                        disabled={errorStatusTarget || errorStatusRoot ? true : false}
                    >
                        <a className={classes.buttonDialogTextYes}>Create</a>
                    </Button>

                </DialogActions>
            </Container>


        </Dialog>
    )
}

export default withStyles(addUserStyle)(withApollo(DialogAddApi))



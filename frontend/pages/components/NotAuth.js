import React from "react";
import { Paper, Button, Link, withStyles } from "@material-ui/core";
import NoSsr from '../../src/components/disableSsr'

const styles = theme => ({
    margin: {
        margin: theme.spacing() * 2,
    },
    root: {
        padding: theme.spacing(),
        minWidth: '230px',
        position: 'inherit',
        marginTop: '10%',
        width: '50%',
        margin: 'auto',
        backgroundColor: '#F4F7F7',
    },
    content: {
        textAlign: "center",
    },
    button: {
        backgroundColor: 'grey'
    }
})
const NotAuth = (props) => {
    const { classes } = props
    return (
        <NoSsr>
            <Paper className={classes.root}>
                <div className={classes.content}>
                    <h1>Not authenticated</h1>
                    <Button href='/' className={classes.button}>
                        Back to login
                    </Button>
                </div>

            </Paper>
        </NoSsr>
    )
}
export default withStyles(styles)(NotAuth)
import { red } from "@material-ui/core/colors";
import { textAlign } from "@material-ui/system";

export const loginStyles = theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
});

export const signUpStyles = theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
});

export const dialogStyle = theme => ({
    backgroundNo: {
        backgroundColor: "#e00408BF",
        width: 250,
        textAlign: 'center'
    },
    textNo: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20
    },
    backgroundYes: {
        backgroundColor: "#00b324BF",
        textAlign: 'center'
    },
    textYes: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20
    },
    textLink: {
        textAlign: 'center',
        color: 'green',
        fontSize: 20
    }

});
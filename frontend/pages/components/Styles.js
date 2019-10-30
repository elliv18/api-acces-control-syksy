import { red } from "@material-ui/core/colors";
import { textAlign } from "@material-ui/system";

export const navStyles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        // backgroundColor: 'lightBlue'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        //backgroundColor: 'rgba(0,70,85)',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },

});

export const homeStyle = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 50
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },


});

export const homeStyleUser = theme => ({


    paper: {
        marginTop: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 50,
    },
    card: {
        margin: 10,
        width: '60%',
        //background: 'lightGray',
        // borderStyle: 'solid',
        //borderColor: 'black'

    },
    title1: {
        textAlign: 'center',
        backgroundColor: "#a8a0a099",
        fontSize: 20
    },
    title2: {
        padding: 10
    }

});
export const AdminHomeStyles = theme => ({
    root: {
        marginTop: 10,
        alignSelf: 'center',
        overflow: 'auto',
        minWidth: 300,
        marginLeft: '1%',
        marginRight: '1%',
        // height: 500
    },
    table: {
        minWidth: 650,
        // overflow: 'auto',

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
    addButton: {
        color: 'green',
        backgroundColor: '#f5f5f5',
        marginRight: theme.spacing(3)
    }
});

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

        textAlign: 'center'
    },
    textNo: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20
    },
    contentNo: {

        justifyContent: 'center'
    },
    buttonText: {
        color: "#e00408",
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

export const addUserStyle = theme => ({
    textField: {
        margin: 5,
    },
    eye: {
        cursor: 'pointer',
    },
    dialogContent: {
        textAlign: 'center',
        overflow: 'hidden'

    },
    dialogTitle: {
        textAlign: 'center'
    },
    main: {
        width: 350,
    },
    buttonDialogTextNo: {
        color: 'red'
    },
    buttonDialogTextYes: {
        color: 'green'
    },
    textField: {
        width: '100%',
        overflow: 'auto',
        marginTop: 5
    },
    select: {
        width: '100%',
        marginBottom: 5
    },
    dialogActions: {
        justifyContent: 'center'
    }
});

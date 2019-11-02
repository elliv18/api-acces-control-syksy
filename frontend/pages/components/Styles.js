import { red } from "@material-ui/core/colors";
import { textAlign } from "@material-ui/system";
import { Grid } from "@material-ui/core";

export const navStyles = theme => ({
    root: {
        flexGrow: 1,
        //backgroundColor: 'lightBlue',
    },
    appBar: {
        backgroundColor: theme.palette.primary,
    },
    appBarSpaceHolder: {
        backgroundColor: theme.palette.primary,

        height: '64px',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    content: {
        paddingTop: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        paddingBottom: '10px',
        minHeight: 'calc(100vh - 64px)',
        overflow: 'hidden'
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
        width: '95%',
        marginRight: 'auto',
        marginLeft: 'auto',
        maxHeight: '570px',
        overflow: 'auto',
        paddingBottom: '10px'

    },
    table: {
        minWidth: 650,
        // overflow: 'auto',
    },
    tableHeader: {
        backgroundColor: 'red'
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
        //marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        // marginLeft: theme.spacing(3)
        marginRight: theme.spacing(3),

    },
    deleteUpButton: {
        color: 'red',
        display: 'initial',
        //marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        // marginLeft: theme.spacing(3)
        marginRight: theme.spacing(2)
    },
    editUpButton: {
        color: theme.palette.secondary,
        display: 'initial',
        //marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        // marginLeft: theme.spacing(3)
        marginRight: theme.spacing(2)
    },

    sortIcon: {
        icon: {
            display: 'none',
        },
        active: {
            '& $icon': {
                display: 'none',
            },
        },
    }

});

export const loginStyles = theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.secondary.main
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
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    googleButton: {
        margin: theme.spacing(0, 0, 2),
        textAlign: 'center',
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

export const dialogResetPwstyle = theme => ({
    textField: {
        margin: 5,
    },
    eye: {
        cursor: 'pointer',
    },
    dialogContent: {
        textAlign: 'center',

    },
    dialogTitle: {
        textAlign: 'center'
    },
    main: {
        width: 250,
    },
    buttonDialogTextNo: {
        color: 'red'
    },
    buttonDialogTextYes: {
        color: 'green'
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

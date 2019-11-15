import { red } from "@material-ui/core/colors";
import { textAlign } from "@material-ui/system";
import { Grid } from "@material-ui/core";

export const navStyles = theme => ({
    root: {
        flexGrow: 1,
        minWidth: '350px'
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
    grid: {
        width: '90%',
        // backgroundColor: theme.palette.primary.main
    },

    paper: {
        marginTop: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto',
        maxHeight: '620px',
        overflow: 'auto',
        paddingBottom: '10px',
        backgroundColor: theme.palette.secondary.main


    },
    card: {
        margin: 10,
        width: '90%',
        borderRadius: 10
        //background: 'lightGray',
        // borderStyle: 'solid',
        //borderColor: 'black'

    },
    title1: {
        textAlign: 'center',
        backgroundColor: "#a8a0a099",
        fontSize: 20,
        borderRadius: 10

    },
    title2: {
        padding: 10
    },
    expansionPanelSummary: {
        width: '100%',
        marginTop: 10,
        borderRadius: 15
    },
    expansionPanelDiv: {
        width: '90%'
    },
    expansionPanel: {
        borderRadius: 10
    },
    divider: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomStyle: 'solid',
        borderWidth: '0.5px',
        borderColor: theme.palette.secondary.main
    },
    padding: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    infoText: {
        textAlign: 'center'
    }

});
export const AdminHomeStyles = theme => ({
    root: {
        width: '99%',
        marginRight: 'auto',
        marginLeft: 'auto',
        maxHeight: '620px',
        overflow: 'auto',
        paddingBottom: '10px'

    },
    table: {
        minWidth: 650,
        maxHeight: '55%'
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
        //marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        // marginLeft: theme.spacing(3)
        // marginRight: theme.spacing(3),

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
    },

    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.2em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: theme.palette.secondary.main
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            // outline: '1px solid slategrey'
        }
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
        backgroundColor: theme.palette.secondary.main
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

export const Confirmstyle = theme => ({

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

export const DialogUserAskNewApisStyle = theme => ({

    dialogContent: {
        backgroundColor: theme.palette.secondary.main,
        width: 530,
        height: 500,
    },
    expansionPanelSummary: {
        width: 490,
        marginTop: 10,
        borderRadius: 15

        // marginBottom: 10
    },
    expansionPanel: {
        borderRadius: 10
    },
    dialogActions: {
        width: 530,
        justifyContent: 'center',
        backgroundColor: 'lightGray'
    },
    buttonYes: {
        color: 'green'
    },
    buttonNo: {
        color: 'red'
    },
    dialogTitle: {
        width: 530,
        height: 70,

        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },

    divider: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomStyle: 'solid',
        borderWidth: '0.5px',
        borderColor: theme.palette.secondary.main
    },
    textField: {
        color: 'white'
    },
    padding: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.2em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: theme.palette.secondary.main
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            // outline: '1px solid slategrey'
        }
    }
})


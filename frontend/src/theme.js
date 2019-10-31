import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4c7191',
    },
    secondary: {
      main: '#B9CCD0',
    },
    error: {
      main: red.A400,
    },

    tableCell: {
      default: '#faf9d9'
    }
  },
  overrides: {
    MuiTableHead: {
      root: {
        borderCollapse: 'collapse'
      }
    },
    MuiTable: {
      stickyHeader: {
        borderCollapse: 'collapse'
      }
    }
  }
});

export default theme;

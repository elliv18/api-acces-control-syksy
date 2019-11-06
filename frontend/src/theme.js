import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3c7c9e',
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

});

export default theme;

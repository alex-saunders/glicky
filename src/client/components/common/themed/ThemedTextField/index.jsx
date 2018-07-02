import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import { ThemeContext } from '../../../../theme-context';

const StyledTextField = props => {
  const { classes, ...other } = props;
  return (
    <TextField
      {...other}
      classes={{
        root: classes.root
      }}
    />
  );
};

const styles = theme => {
  return {
    root: {
      '& div:hover:before': {
        borderBottomColor: `${theme.palette.primary.light} !important` // TODO: remove !important tag
      }
    }
  };
};

const WrappedTextField = withStyles(styles, { withTheme: true })(
  StyledTextField
);

const ThemedTextField = props => (
  <ThemeContext.Consumer>
    {theme => (
      <MuiThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: {
              main: theme.primary2
            }
          }
        })}
      >
        <WrappedTextField {...props} />
      </MuiThemeProvider>
    )}
  </ThemeContext.Consumer>
);

export default ThemedTextField;

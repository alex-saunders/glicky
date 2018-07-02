import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import { ThemeContext } from '../../../../theme-context';

const StyledIconButton = props => {
  const { classes, children, primary, secondary, ...other } = props;
  return (
    <IconButton
      {...other}
      classes={
        primary
          ? {
              root: classes.primaryRoot
            }
          : secondary
            ? {
                root: classes.secondaryRoot
              }
            : {}
      }
    >
      {children}
    </IconButton>
  );
};

const styles = theme => {
  return {
    primaryRoot: {
      background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${
        theme.palette.primary.dark
      } 90%)`,
      border: 0,
      color: 'white',
      boxShadow: `0 3px 5px 2px ${theme.palette.primary.light
        .replace('rgb', 'rgba')
        .replace(/.$/, ', 0.2)')}`
    },
    secondaryRoot: {
      color: theme.palette.primary.dark
    }
  };
};

const WrappedIconButton = withStyles(styles, { withTheme: true })(
  StyledIconButton
);

const ThemedIconButton = props => {
  const { children, ...other } = props;
  return (
    <ThemeContext.Consumer>
      {theme => (
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              primary: {
                main: theme.primary2,
                dark: theme.primary1
              }
            }
          })}
        >
          <WrappedIconButton {...other}>{children}</WrappedIconButton>
        </MuiThemeProvider>
      )}
    </ThemeContext.Consumer>
  );
};

export default ThemedIconButton;

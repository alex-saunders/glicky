import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import { ThemeContext } from '../../../../theme-context';

const StyledLinearProgress = props => {
  const { classes, active, ...other } = props;
  return (
    <LinearProgress
      {...other}
      disabled
      classes={{
        barColorPrimary: classes.barColorPrimary,
        bar1Indeterminate: `${classes.barTransition} ${
          active ? classes.barActive : classes.barDisabled
        }`,
        bar2Indeterminate: `${classes.barTraisiotn} ${
          active ? classes.barActive : classes.barDisabled
        }`
      }}
    />
  );
};

const styles = theme => {
  return {
    colorPrimary: {
      backgroundColor: theme.primary1
    },
    barColorPrimary: {
      backgroundColor: 'none',
      background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${
        theme.palette.primary.dark
      } 90%)`
    },
    barTransition: {
      transition: 'opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
    },
    barDisabled: {
      animation: 'none',
      opacity: 0
    },
    barActive: {
      opacity: 1
    }
  };
};

const WrappedLinearProgress = withStyles(styles, { withTheme: true })(
  StyledLinearProgress
);

class ThemedLinearProgress extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: {
                  light: theme.primary2,
                  main: theme.primary2,
                  dark: theme.primary1
                }
              }
            })}
          >
            <WrappedLinearProgress {...this.props} />
          </MuiThemeProvider>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ThemedLinearProgress;

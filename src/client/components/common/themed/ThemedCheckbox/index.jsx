import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';

import { ThemeContext } from '../../../../theme-context';

class ThemedCheckbox extends React.Component {
  render() {
    const { children, ...other } = this.props;
    return (
      <ThemeContext.Consumer>
        {theme => (
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: {
                  light: theme.primary2,
                  main: theme.primary2
                }
              }
            })}
          >
            <Checkbox color="primary" {...other}>
              {children}
            </Checkbox>
          </MuiThemeProvider>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ThemedCheckbox;

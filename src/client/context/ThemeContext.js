// @flow
import React, { createContext, type Node, type ComponentType } from 'react';
import { ThemeProvider } from 'styled-components';

import { theme, type ThemeProps } from '../theme';

import { withSettings, type SettingsContextProps } from './SettingsContext';

export type ThemeContextProps = ThemeProps;

export const defaultThemeContext: ThemeContextProps = {
  theme: theme('dark', '#2196f3'),
  setThemeMode: () => {},
  setPrimaryColour: () => {}
};
export const Context = createContext(defaultThemeContext);

type Props = SettingsContextProps & {
  children: Node
};

class ThemeContextProvider extends React.Component<Props> {
  render() {
    const { settings } = this.props;
    if (!settings) {
      return null;
    }

    const initialisedTheme = theme(
      settings.dark ? 'dark' : 'light',
      settings.primaryColour
    );

    return (
      <Context.Provider
        value={{
          theme: initialisedTheme
        }}
      >
        <ThemeProvider theme={initialisedTheme}>
          {this.props.children}
        </ThemeProvider>
      </Context.Provider>
    );
  }
}

export function withTheme<Props: {}>(Component: ComponentType<Props>) {
  return function WrappedComponent(props: Props) {
    return (
      <Context.Consumer>
        {({ theme }) => <Component {...props} theme={theme} />}
      </Context.Consumer>
    );
  };
}

export default {
  Provider: withSettings(ThemeContextProvider),
  Consumer: Context.Consumer
};

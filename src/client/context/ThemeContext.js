// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';
import { ThemeProvider } from 'styled-components';

import { theme, type ThemeProps } from '../theme';

import { withSettings, type SettingsContextProps } from './SettingsContext';

export type ThemeContextProps = ThemeProps;

export const defaultThemeContext: ThemeContextProps = {
  theme: theme('dark', '#ff0000'),
  setThemeMode: () => {},
  setPrimaryColour: () => {}
};
export const Context = createContext<ThemeContextProps>(defaultThemeContext);

type Props = SettingsContextProps & {
  children: Node
};

class ThemeContextProvider extends Component<Props> {
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

export const withTheme = <P>(
  WrappedComponent: ComponentType<*>
): ComponentType<P> => {
  return class WithThemeContext extends Component<P> {
    render() {
      return (
        <Context.Consumer>
          {contextProps => (
            <WrappedComponent {...contextProps} {...this.props} />
          )}
        </Context.Consumer>
      );
    }
  };
};

export default {
  Provider: withSettings(ThemeContextProvider),
  Consumer: Context.Consumer
};

// @flow
import React, {
  createContext,
  Component,
  useState,
  useEffect,
  type Node,
  type ComponentType
} from 'react';
import { ThemeProvider } from 'styled-components';

import {
  theme as themeFunc,
  type ThemeProps,
  type ThemeMode,
  type ThemeName
} from '../theme';

import { withSettings, type SettingsContextProps } from './SettingsContext';

export type ThemeContextProps = ThemeProps & {
  name: ThemeName,
  setThemeMode: ThemeMode => void,
  setPrimaryColour: string => void,
  setThemeName: ThemeName => void
};

export const defaultThemeContext: ThemeContextProps = {
  theme: themeFunc('dark', '#ff0000'),
  name: 'default',
  setThemeMode: () => {},
  setPrimaryColour: () => {},
  setThemeName: () => {}
};
export const Context = createContext<ThemeContextProps>(defaultThemeContext);

type Props = SettingsContextProps & {
  children: Node,
  theme?: {
    name: ThemeName,
    dark: boolean,
    primaryColour: string
  }
};

const ThemeContextProvider = (props: Props) => {
  const { settings, theme: themeProp } = props;
  if (!settings && !themeProp) {
    return null;
  }

  const themeObj = themeProp || settings;

  const [themeName, setThemeName] = useState(themeObj.name || 'default');

  const [theme, setTheme] = useState(
    themeFunc(themeObj.dark ? 'dark' : 'light', themeObj.primaryColour)
  );

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(themeFunc(mode, theme.primaryColour));
  };

  const setPrimaryColour = (colour: string) => {
    // ensure colour is a valid hex value
    if (colour.match(/^#[0-9a-f]{6}$/i)) {
      setTheme(themeFunc(theme.mode, colour));
    }
  };

  const setName = (name: ThemeName) => {
    console.log('HERE');
    setThemeName(name);
  };

  useEffect(() => {
    // Hack for styleguidist so that we can consume the theme
    // within each component example (each component is mounted
    // in a different react root in styleguidist so cannot consume
    // the value from this context provider)
    window.__THEME__ = {
      name: themeName,
      dark: theme.mode === 'dark',
      primaryColour: theme.primaryColour
    };
  }, [theme, themeName]);

  return (
    <Context.Provider
      value={{
        name: themeName,
        theme,
        setThemeMode,
        setPrimaryColour,
        setThemeName: setName
      }}
    >
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </Context.Provider>
  );
};

export const withThemeMode = <P>(modes: { [ThemeName]: ComponentType<P> }) => {
  return class WithThemeMode extends Component<P> {
    renderForThemeMode(Component: ComponentType<P>, props: ThemeContextProps) {
      return <Component {...props} {...this.props} />;
    }

    render() {
      return (
        <Context.Consumer>
          {contextProps =>
            // render default version if no component supplied for given theme name
            this.renderForThemeMode(
              modes[contextProps.name] || modes['default'],
              contextProps
            )
          }
        </Context.Consumer>
      );
    }
  };
};

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

// @flow
import React, {
  createContext,
  Component,
  useState,
  useEffect,
  Fragment,
  type Node,
  type ComponentType
} from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

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
  themeOpts: {
    name: ThemeName,
    dark: boolean,
    primaryColour: string
  }
};

type FontStyleProps = ThemeProps & {
  themeName: ThemeName
};
const FontStyle = createGlobalStyle`
  ${(p: FontStyleProps) => p.theme.baseFont(p.themeName)}
`;

const ThemeContextProvider = (props: Props) => {
  const { themeOpts } = props;

  const [themeName, setThemeName] = useState(themeOpts.name || 'default');

  const [theme, setTheme] = useState(
    themeFunc(themeOpts.dark ? 'dark' : 'light', themeOpts.primaryColour)
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
      <ThemeProvider theme={theme}>
        <Fragment>
          <FontStyle themeName={themeName} />
          {props.children}
        </Fragment>
      </ThemeProvider>
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
  Provider: ThemeContextProvider,
  Consumer: Context.Consumer
};

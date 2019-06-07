// @flow

import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

import { getSettings, setSettings } from '~/utils/requests/settings';

import { type Settings } from '../../types';

export type SettingsContextProps = {
  settings: ?Settings,
  loading: boolean,
  setSettings: ($Shape<Settings>) => void
};

export const defaultSettingsContext: SettingsContextProps = {
  settings: null,
  loading: true,
  setSettings: () => {}
};

const Context = createContext<SettingsContextProps>(defaultSettingsContext);

type Props = {
  children: Node
};

type State = {
  loading: boolean,
  settings: ?Settings
};

class SettingsContextProvider extends Component<Props, State> {
  state = {
    loading: true,
    settings: null
  };

  componentDidMount() {
    getSettings().then(settings => {
      this.setState({
        settings,
        loading: false
      });
    });
  }

  setSettings = (newSettings: Settings) => {
    this.setState({
      loading: true
    });

    setSettings(newSettings).then(updatedSettings => {
      this.setState({
        settings: updatedSettings,
        loading: false
      });
    });
  };

  render() {
    const { children } = this.props;
    return (
      <Context.Provider
        value={{ ...this.state, setSettings: this.setSettings }}
      >
        {children}
      </Context.Provider>
    );
  }
}

export default {
  Provider: SettingsContextProvider,
  Consumer: Context.Consumer
};

export const withSettings = <P>(
  WrappedComponent: ComponentType<*>
): ComponentType<P> => {
  return class WithSettingsContext extends Component<P> {
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

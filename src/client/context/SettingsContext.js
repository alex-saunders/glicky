// @flow

import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

import { type SocketContextProps } from './SocketContext';
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

const Context = createContext(defaultSettingsContext);

type Props = SocketContextProps & {
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
    const { socket } = this.props;

    socket.emit('settings', null, settings => {
      this.setState({
        settings,
        loading: false
      });
    });
  }

  setSettings = (newSettings: Settings) => {
    const { socket } = this.props;

    this.setState({
      loading: true
    });

    socket.emit('settings', newSettings, updatedSettings => {
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

// @flow
import React, { createContext, type Node, type ComponentType } from 'react';
import { navigate } from '@reach/router';

import {
  type Dependency,
  type DependencyType,
  DEPENDENCY_TYPES
} from '../../types';

import { withSettings, type SettingsContextProps } from './SettingsContext';
import { type SocketContextProps } from './SocketContext';

export type DependenciesContextProps = {
  dependencies: Array<Dependency>,
  fetchDependencies: () => void
};
export const defaultContext = {
  dependencies: [],
  fetchDependencies: () => {}
};
export const Context = createContext<DependenciesContextProps>(defaultContext);

type Props = SocketContextProps &
  SettingsContextProps & {
    children: Node
  };

type State = {
  dependencies: Array<Dependency>,
  outdatedDependencies: ?Array<string>
};

class DependenciesContextProvider extends React.Component<Props, State> {
  hasFetchedOutdatedDeps = false;

  state = {
    dependencies: [],
    outdatedDependencies: []
  };

  componentDidMount() {
    window.Notification.requestPermission();

    const { dependenciesCheckOnStartup } = this.props.settings || {};
    if (dependenciesCheckOnStartup) {
      this.getOutdatedDependencies();
    }
  }

  triggerNotification(numOutdatedDependencies: number) {
    const createNotification = () => {
      const notification = new window.Notification(
        `You have ${numOutdatedDependencies} outdated dependencies!`
      );
      notification.onclick = () => {
        navigate('/dependencies');
        window.focus();
        notification.close();
      };
    };

    if (window.Notification.permission === 'granted') {
      // If it's okay let's create a notification
      createNotification();
    }

    // Otherwise, we need to ask the user for permission
    else if (window.Notification.permission !== 'denied') {
      window.Notification.requestPermission(function(permission) {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          createNotification();
        }
      });
    }
  }

  fetchDependencies = () => {
    this.getAllDependencies();
    this.getOutdatedDependencies();
  };

  getOutdatedDependencies = () => {
    if (this.hasFetchedOutdatedDeps || !this.props.socket) {
      return;
    }

    this.hasFetchedOutdatedDeps = true;
    const { socket } = this.props;

    socket.emit('exec', 'npm outdated --json', json => {
      const outdatedDependencies = Object.keys(JSON.parse(json));
      const numOutdatedDependencies = outdatedDependencies.length;
      if (numOutdatedDependencies > 0) {
        this.triggerNotification(numOutdatedDependencies);
      }

      this.setState({
        outdatedDependencies
      });
    });
  };

  async getAllDependencies() {
    const { socket } = this.props;
    if (!socket) {
      return;
    }
    const dependencyTypes = Object.keys(DEPENDENCY_TYPES);
    const dependencies = [];

    for (let dependencyType of dependencyTypes) {
      const fetchedDependencies = await this.getDependencies(dependencyType);
      if (!fetchedDependencies) continue;

      const entries = Object.entries(fetchedDependencies);
      const packages = entries.reduce((arr, [name, version]) => {
        arr.push({
          name,
          version,
          outdated: false,
          type: dependencyType
        });
        return arr;
      }, []);

      dependencies.push(...packages);
    }

    this.setState({
      dependencies
    });
  }

  getDependencies(
    type: DependencyType
  ): ?{
    [string]: string
  } {
    return new Promise((resolve, reject) => {
      const { socket } = this.props;
      if (socket) {
        socket.emit('package', type, async dependencies => {
          resolve(dependencies);
        });
      } else {
        reject();
      }
    });
  }

  render() {
    const { dependencies, outdatedDependencies } = this.state;
    const { filterOutdatedDependencies } = this.props.settings || {};

    // filter out up to date dependencies if required by settings
    let updatedDependencies = [];
    if (filterOutdatedDependencies) {
      updatedDependencies = dependencies
        .filter(dependency => outdatedDependencies.includes(dependency.name))
        .map(dependency => ({ ...dependency, outdated: true }));
    } else {
      // else update dependency objects with correct `outdated` value
      updatedDependencies =
        outdatedDependencies.length > 0
          ? dependencies.map(dependency => ({
              ...dependency,
              outdated: outdatedDependencies.includes(dependency.name)
            }))
          : dependencies;
    }

    return (
      <Context.Provider
        value={{
          dependencies: updatedDependencies,
          fetchDependencies: this.fetchDependencies
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export function withDependencies<Props: {}>(Component: ComponentType<Props>) {
  return function WrappedComponent(props: Props) {
    return (
      <Context.Consumer>
        {({ dependencies, fetchDependencies }) => (
          <Component
            {...props}
            dependencies={dependencies}
            fetchDependencies={fetchDependencies}
          />
        )}
      </Context.Consumer>
    );
  };
}

export default {
  Provider: withSettings(DependenciesContextProvider),
  Consumer: Context.Consumer
};

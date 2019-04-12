// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';
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
  fetchDependencies: () => void,
  addDependency: (
    dependencyName: string,
    dependencyType: DependencyType
  ) => Promise<Dependency>,
  deleteDependency: Dependency => Promise<Dependency>,
  updateDependency: Dependency => void
};

const defaultContext = {
  dependencies: [],
  fetchDependencies: () => {},
  addDependency: () => new Promise(() => {}),
  deleteDependency: () => new Promise(() => {}),
  updateDependency: () => {}
};

export const Context = createContext<DependenciesContextProps>(defaultContext);

type Props = SocketContextProps &
  SettingsContextProps & {
    children: Node
  };

type State = {
  dependencies: Array<Dependency>,
  installedVersions?: {
    [string]: {
      version: string
    }
  },
  outdatedDependencies: ?Array<string>
};

// this probably needs quite a big refactor, it's all quite nasty.
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

  fetchDependencies = async () => {
    this.setState(
      {
        dependencies: await this.getAllDependencies()
      },
      () => {
        Promise.all([
          this.getOutdatedDependencies(),
          this.getInstalledVersions()
        ]).then(([outdatedDependencies, installedVersions]) => {
          this.setState({
            outdatedDependencies,
            installedVersions
          });
        });
      }
    );
  };

  getOutdatedDependencies = () => {
    return new Promise((res, rej) => {
      if (this.hasFetchedOutdatedDeps) {
        rej();
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

        res(outdatedDependencies);

        this.setState({
          outdatedDependencies
        });
      });
    });
  };

  getInstalledVersions() {
    return new Promise(res => {
      const { socket } = this.props;

      socket.emit(
        'request',
        {
          resource: 'installed-versions'
        },
        installedVersions => {
          res(installedVersions);
        }
      );
    });
  }

  async getAllDependencies() {
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
          outdated: this.state.outdatedDependencies.some(
            outdatedDep => outdatedDep.name === name
          ),
          type: dependencyType
        });
        return arr;
      }, []);

      dependencies.push(...packages);
    }

    return dependencies;
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

  _addDependency = async (
    dependencyName: string,
    dependencyType: DependencyType
  ) => {
    return new Promise((resolve, reject) => {
      const { socket } = this.props;

      socket.emit(
        'request',
        {
          resource: 'add-dependency',
          dependencyName: dependencyName,
          dependencyType: dependencyType
        },
        result => {
          if (!result.error) {
            resolve();
          } else {
            reject();
          }
        }
      );
    });
  };

  // uninstalls + deletes dependency from package.json but doesn't update state
  _deleteDependency = async (dependency: Dependency) => {
    return new Promise((resolve, reject) => {
      const { socket } = this.props;

      socket.emit(
        'request',
        {
          resource: 'remove-dependency',
          dependencyName: dependency.name,
          dependencyType: dependency.type
        },
        res => {
          if (!res) {
            reject('did not recieve a response');
          }

          resolve(res);
        }
      );
    });
  };

  addDependency = (dependencyName: string, dependencyType: DependencyType) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this._addDependency(dependencyName, dependencyType);
        this.setState(
          {
            dependencies: await this.getAllDependencies()
          },
          resolve
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  deleteDependency = (dependency: Dependency) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currDependency = this.state.dependencies.find(
          dep => dep.name === dependency.name
        );
        await this._deleteDependency(dependency);
        this.setState(
          prevState => ({
            dependencies: prevState.dependencies.filter(
              dep => dep.name !== dependency.name
            )
          }),
          resolve.bind(null, { ...currDependency })
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  updateDependency = (dependency: Dependency) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this._addDependency(dependency.name, dependency.type);
        const dependencies = await this.getAllDependencies();
        const installedVersions = await this.getInstalledVersions();

        this.setState(prevState => {
          const outdatedDependencies = prevState.outdatedDependencies.filter(
            dep => dep !== dependency.name
          );
          return {
            dependencies,
            outdatedDependencies,
            installedVersions
          };
        }, resolve.bind(null, dependency));
      } catch (err) {
        reject(err);
      }
    });
  };

  render() {
    const { dependencies, outdatedDependencies } = this.state;
    const { filterOutdatedDependencies } = this.props.settings || {};

    let updatedDependencies = [...dependencies];

    if (this.state.installedVersions) {
      updatedDependencies = dependencies.map(dependency => ({
        ...dependency,
        installedVersion: this.state.installedVersions[dependency.name].version
      }));
    }

    // filter out up to date dependencies if required by settings
    if (filterOutdatedDependencies) {
      updatedDependencies = updatedDependencies
        .filter(dependency => outdatedDependencies.includes(dependency.name))
        .map(dependency => ({ ...dependency, outdated: true }));
    } else {
      // else update dependency objects with correct `outdated` value
      updatedDependencies =
        outdatedDependencies.length > 0
          ? updatedDependencies.map(dependency => ({
              ...dependency,
              outdated: outdatedDependencies.includes(dependency.name)
            }))
          : updatedDependencies;
    }

    return (
      <Context.Provider
        value={{
          dependencies: updatedDependencies,
          fetchDependencies: this.fetchDependencies,
          addDependency: this.addDependency,
          deleteDependency: this.deleteDependency,
          updateDependency: this.updateDependency
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const withDependencies = <P>(
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

export default {
  Provider: withSettings(DependenciesContextProvider),
  Consumer: Context.Consumer
};

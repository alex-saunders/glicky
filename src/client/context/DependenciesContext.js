// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';
import { navigate } from '@reach/router';

import {
  getInstalledVersions,
  addDependency,
  removeDependency
} from '~/utils/requests/dependencies';
import { executeCommand } from '~/utils/requests/processes';
import { getFromPackageJSON } from '~/utils/requests/package';

import {
  type Dependency,
  type DependencyType,
  DEPENDENCY_TYPES
} from '../../types';

import { withSettings, type SettingsContextProps } from './SettingsContext';

export type DependenciesContextProps = {
  dependencies: Array<Dependency>,
  fetchDependencies: () => Promise<void>,
  addDependency: (
    dependencyName: string,
    dependencyType: DependencyType
  ) => Promise<void>,
  deleteDependency: Dependency => Promise<Dependency>,
  updateDependency: Dependency => Promise<Dependency>
};

const defaultContext = {
  dependencies: [],
  fetchDependencies: () => new Promise(() => {}),
  addDependency: () => new Promise(() => {}),
  deleteDependency: () => new Promise(() => {}),
  updateDependency: () => new Promise(() => {})
};

export const Context = createContext<DependenciesContextProps>(defaultContext);

type Props = SettingsContextProps & {
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
        this.getOutdatedDependencies().then(outdatedDependencies => {
          this.setState({
            outdatedDependencies
          });
        });
        getInstalledVersions().then(installedVersions => {
          this.setState({
            installedVersions
          });
        });
      }
    );
  };

  getOutdatedDependencies = () => {
    return new Promise((res, rej) => {
      if (this.hasFetchedOutdatedDeps) {
        return rej();
      }

      this.hasFetchedOutdatedDeps = true;

      executeCommand('npm outdated --json').then(json => {
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

  async getAllDependencies() {
    const dependencyTypes = Object.keys(DEPENDENCY_TYPES);
    const dependencies = [];

    for (let dependencyType of dependencyTypes) {
      const fetchedDependencies = await getFromPackageJSON(dependencyType);
      if (!fetchedDependencies) continue;

      const entries = Object.entries(fetchedDependencies);
      const packages = entries.reduce((arr, [name, version]) => {
        arr.push({
          name,
          version,
          outdated: this.state.outdatedDependencies
            ? this.state.outdatedDependencies.some(
                outdatedDep => outdatedDep === name
              )
            : false,
          type: dependencyType
        });
        return arr;
      }, []);

      dependencies.push(...packages);
    }

    return dependencies;
  }

  addDependency = (dependencyName: string, dependencyType: DependencyType) => {
    return new Promise(async (resolve, reject) => {
      try {
        await addDependency({ dependencyName, dependencyType });
        const dependencies = await this.getAllDependencies();
        const installedVersions = await getInstalledVersions();

        this.setState(
          {
            dependencies,
            installedVersions
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
        await removeDependency({
          dependencyName: dependency.name,
          dependencyType: dependency.type
        });
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
        await addDependency({
          dependencyName: dependency.name,
          dependencyType: dependency.type
        });
        const dependencies = await this.getAllDependencies();
        const installedVersions = await getInstalledVersions();

        this.setState(prevState => {
          const outdatedDependencies = prevState.outdatedDependencies
            ? prevState.outdatedDependencies.filter(
                dep => dep !== dependency.name
              )
            : [];
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
      const { installedVersions } = this.state;
      updatedDependencies = dependencies.map(dependency => {
        const installedVersion = installedVersions[dependency.name];
        if (installedVersion) {
          return {
            ...dependency,
            installedVersion: installedVersion.version
          };
        }
        return dependency;
      });
    }

    // filter out up to date dependencies if required by settings
    if (filterOutdatedDependencies && outdatedDependencies) {
      updatedDependencies = updatedDependencies
        .filter(dependency => outdatedDependencies.includes(dependency.name))
        .map(dependency => ({ ...dependency, outdated: true }));
    } else {
      // else update dependency objects with correct `outdated` value
      updatedDependencies =
        outdatedDependencies && outdatedDependencies.length > 0
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

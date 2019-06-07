// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

import { getFromPackageJSON } from '~/utils/requests/package';
import { addScript, removeScript } from '~/utils/requests/scripts';

import { type Script } from '../../types';

export type ScriptsContextProps = {
  scripts: {
    [string]: Script
  },
  fetchScripts: () => void,
  deleteScript: (scriptId: string) => Promise<Script>,
  addScript: (script: Script) => Promise<Script>,
  updateScript: (scriptId: string, newScript: Script) => Promise<void>
};
export const defaultScriptsContext = {
  scripts: {},
  fetchScripts: () => {},
  deleteScript: () => new Promise(() => {}),
  addScript: () => new Promise(() => {}),
  updateScript: () => new Promise(() => {})
};
export const Context = createContext<ScriptsContextProps>(
  defaultScriptsContext
);

type Props = {
  children: Node
};

type State = {
  [string]: Script
};

class ScriptsContextProvider extends Component<Props, State> {
  state = {};

  fetchScripts = () => {
    getFromPackageJSON('scripts').then(scripts => {
      const objScripts = Object.keys(scripts).reduce((acc, script) => {
        acc[script] = {
          name: script,
          command: scripts[script]
        };
        return acc;
      }, {});
      this.setState(objScripts);
    });
  };

  updateScript = async (scriptId: string, newScript: Script) => {
    const oldScript = this.state[scriptId];
    if (newScript.name !== oldScript.name) {
      await removeScript(this.state[scriptId].name);
    }
    await addScript(newScript.name, newScript.command);

    this.setState({
      [scriptId]: newScript
    });
  };

  deleteScript = async (scriptId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currScript = this.state[scriptId];
        await removeScript(currScript.name);
        this.setState(
          prevState =>
            Object.assign({}, prevState, {
              [scriptId]: undefined
            }),
          resolve.bind(null, currScript)
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  addScript = async (script: Script) => {
    return new Promise(async (resolve, reject) => {
      try {
        await addScript(script.name, script.command);
        this.setState(
          () => ({
            [script.name]: {
              ...script
            }
          }),
          resolve.bind(null, script)
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          scripts: this.state,
          fetchScripts: this.fetchScripts,
          addScript: this.addScript,
          deleteScript: this.deleteScript,
          updateScript: this.updateScript
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const withScriptsContext = <P>(
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
  Provider: ScriptsContextProvider,
  Consumer: Context.Consumer
};

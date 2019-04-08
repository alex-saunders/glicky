// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

import { type Script } from '../../types';

import { type SocketContextProps } from '~/context/SocketContext';

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

type Props = SocketContextProps & {
  children: Node
};

type State = {
  [string]: Script
};

class ScriptsContextProvider extends React.Component<Props, State> {
  state = {};

  fetchScripts = () => {
    const { socket } = this.props;

    socket.emit('package', 'scripts', scripts => {
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

  // deletes script from package.json but doesn't update state
  _deleteScript = async (script: Script) => {
    return new Promise((resolve, reject) => {
      const { socket } = this.props;

      socket.emit(
        'request',
        {
          resource: 'delete-script',
          scriptName: script.name
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

  // adds a script to package.json but doesn't update state
  _addScript = async (newScript: Script) => {
    return new Promise((resolve, reject) => {
      const { socket } = this.props;

      socket.emit(
        'request',
        {
          resource: 'add-script',
          scriptName: newScript.name,
          scriptCommand: newScript.command
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

  updateScript = async (scriptId: string, newScript: Script) => {
    const oldScript = this.state[scriptId];
    if (newScript.name !== oldScript.name) {
      await this._deleteScript(this.state[scriptId]);
    }
    await this._addScript(newScript);

    this.setState({
      [scriptId]: newScript
    });
  };

  deleteScript = async (scriptId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currScript = this.state[scriptId];
        await this._deleteScript(currScript);
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
        await this._addScript(script);
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

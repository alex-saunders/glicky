// @flow
import React, { createContext, type Node, type ComponentType } from 'react';

import { type Script } from '../../types';

import { type SocketContextProps } from '~/context/SocketContext';

export type ScriptsContextProps = {
  scripts: {
    [string]: Script
  },
  fetchScripts: () => void,
  executeCommand: (scriptId: string, command: string) => Promise<void>,
  stopProcess: (scriptId: string) => Promise<void>,
  addToScriptOutput: (
    scriptId: string,
    output: string,
    opts?: { editable?: boolean, hasErrored?: boolean }
  ) => void,
  removeFromScriptOutput: (scriptId: string, charsToRemove: number) => void,
  deleteScript: (scriptId: string) => Promise<Script>,
  addScript: (script: $Diff<Script, { output: any }>) => Promise<Script>,
  updateScript: (scriptId: string, newScript: Script) => Promise<void>
};
export const defaultScriptsContext = {
  scripts: {},
  fetchScripts: () => {},
  executeCommand: () => new Promise(() => {}),
  stopProcess: () => new Promise(() => {}),
  addToScriptOutput: () => {},
  removeFromScriptOutput: () => {},
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

  componentDidMount() {
    this.setupEvents();
  }

  getScriptIDForPID = (pid: string) => {
    const scriptId = Object.keys(this.state).find(
      key => this.state[key].pid === pid
    );
    return scriptId;
  };

  setupEvents = () => {
    const { socket } = this.props;

    socket.on('data', ({ output, pid }) => {
      const scriptId = this.getScriptIDForPID(pid);

      if (scriptId) {
        this.addToOutput(scriptId, output);
      }
    });

    socket.on('processError', ({ output, pid }) => {
      const scriptId = this.getScriptIDForPID(pid);

      if (scriptId) {
        this.addToOutput(scriptId, output, { hasErrored: true });
      }
    });

    socket.on('exit', ({ output, pid }) => {
      (async () => {
        const scriptId = this.getScriptIDForPID(pid);

        if (scriptId) {
          await this.generateNewLine(scriptId, false);

          this.addToOutput(scriptId, output);

          await this.generateNewLine(scriptId, true);

          this.setState(prevState => ({
            [scriptId]: {
              ...prevState[scriptId],
              executing: false
            }
          }));
        }
      })();
    });
  };

  fetchScripts = () => {
    const { socket } = this.props;

    socket.emit('package', 'scripts', scripts => {
      const objScripts = Object.keys(scripts).reduce((acc, script) => {
        acc[script] = {
          name: script,
          command: scripts[script],
          output: '',
          currLine: '',
          executing: false,
          hasErrored: false
        };
        return acc;
      }, {});
      this.setState(objScripts);
    });
  };

  executeCommand = async (scriptId: string, command: string) => {
    const { socket } = this.props;
    const script = this.state[scriptId];

    // terminal has never been opened so prompt has not been generated
    if (!script.output) {
      const prompt = await this.generatePrompt();
      this.addToOutput(scriptId, prompt);
    }
    // command was not entered manually (the play button was pressed)
    if (script.currLine !== command) {
      // so add the command to the output
      this.addToOutput(scriptId, command);
    }

    this.generateNewLine(scriptId);

    socket.emit('spawn', command, pid => {
      this.setState(prevState => ({
        [scriptId]: {
          ...prevState[scriptId],
          executing: true,
          pid
        }
      }));

      // eslint-disable-next-line
      console.log('spawned child_process with pid:', pid);
    });
  };

  stopProcess = (scriptId: string) => {
    return new Promise<void>((resolve, reject) => {
      const { socket } = this.props;
      const script = this.state[scriptId];

      if (!script.executing) {
        reject();
      }

      socket.emit('kill', script.pid, resolve);
    });
  };

  generatePrompt = () => {
    const { socket } = this.props;
    return new Promise<string>(res => {
      socket.emit('request', { resource: 'prompt' }, res);
    });
  };

  generateNewLine = async (id: string, withPrompt?: boolean = false) => {
    return new Promise(resolve => {
      if (withPrompt) {
        this.generatePrompt().then(prompt => {
          this.addToOutput(id, '\n' + prompt);
          resolve();
        });
      } else {
        this.addToOutput(id, '\n');
        resolve();
      }
    });
  };

  addToOutput = (
    id: string,
    data: string,
    {
      editable = false,
      hasErrored = false
    }: { editable?: boolean, hasErrored?: boolean } = {}
  ) => {
    // insert proper carriage returns
    const cleanedData = data.split('\n').join('\r\n');

    if (cleanedData) {
      this.setState(prevState => ({
        [id]: {
          ...prevState[id],
          output: prevState[id].output + cleanedData,
          // reset currLine if data is new data is not editable,
          // else just add to currLine
          currLine: editable ? prevState[id].currLine + cleanedData : '',
          hasErrored
        }
      }));
    }
  };

  removeFromOutput = (scriptId: string, charsToRemove: number) => {
    this.setState(prevState => {
      const script = prevState[scriptId];
      if (!script.currLine) {
        return null;
      }

      return {
        [scriptId]: {
          ...prevState[scriptId],
          output: script.output.slice(0, -charsToRemove),
          currLine: script.currLine.slice(0, -charsToRemove)
        }
      };
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

    this.setState(prevState => ({
      [scriptId]: {
        ...newScript,
        output: prevState[scriptId].output
      }
    }));
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

  addScript = async (script: $Diff<Script, { output: any }>) => {
    const scriptObj = {
      ...script,
      output: ''
    };
    return new Promise(async (resolve, reject) => {
      try {
        await this._addScript(scriptObj);
        this.setState(
          () => ({
            [script.name]: {
              ...scriptObj
            }
          }),
          resolve.bind(null, scriptObj)
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
          executeCommand: this.executeCommand,
          stopProcess: this.stopProcess,
          addToScriptOutput: this.addToOutput,
          removeFromScriptOutput: this.removeFromOutput,
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

export function withScriptsContext<Props: {}>(Component: ComponentType<Props>) {
  return function WrappedComponent(props: Props) {
    return (
      <Context.Consumer>
        {contextProps => <Component {...props} {...contextProps} />}
      </Context.Consumer>
    );
  };
}

export default {
  Provider: ScriptsContextProvider,
  Consumer: Context.Consumer
};

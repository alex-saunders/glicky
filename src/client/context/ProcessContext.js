// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

import type { Process, ProcessState } from '../../types';

import { type SocketContextProps } from '~/context/SocketContext';

export type WithProcessContextProps = {
  processes: {
    [string]: Process
  },
  executeProcess: (id: string, command: string) => Promise<void>,
  killProcess: (id: string) => Promise<void>,
  addToOutput: (
    id: string,
    output: string,
    opts?: { editable?: boolean, hasErrored?: boolean }
  ) => void,
  removeFromOutput: (id: string, charsToRemove: number) => void,
  getProcessState: (id: string) => ProcessState
};

export type ProcessContextProps = {
  process: ?Process,
  executeProcess: (command: string) => Promise<void>,
  killProcess: () => Promise<void>,
  addToOutput: (
    output: string,
    opts?: { editable?: boolean, hasErrored?: boolean }
  ) => void,
  removeFromOutput: (charsToRemove: number) => void,
  getProcessState: () => ProcessState
};

export const defaultProcessContext = {
  processes: {},
  executeProcess: () => new Promise(() => {}),
  killProcess: () => new Promise(() => {}),
  addToOutput: () => {},
  removeFromOutput: () => {},
  getProcessState: () => 'inactive'
};
export const Context = createContext<WithProcessContextProps>(
  defaultProcessContext
);

type Props = SocketContextProps & {
  children: Node
};

type State = {
  [string]: Process
};

class ProcessContextProvider extends React.Component<Props, State> {
  state = {};

  componentDidMount() {
    this.setupEvents();
  }

  getIDforPID = (pid: string) => {
    return Object.keys(this.state).find(key => this.state[key].pid === pid);
  };

  setupEvents = () => {
    const { socket } = this.props;

    socket.on('data', ({ output, pid }) => {
      const id = this.getIDforPID(pid);

      if (id) {
        this.addToOutput(id, output);
      }
    });

    socket.on('processError', ({ output, pid }) => {
      const id = this.getIDforPID(pid);

      if (id) {
        this.addToOutput(id, output, { hasErrored: true });
      }
    });

    socket.on('exit', ({ output, pid }) => {
      (async () => {
        const id = this.getIDforPID(pid);

        if (id) {
          await this.generateNewLine(id, false);

          this.addToOutput(id, output);

          await this.generateNewLine(id, true);

          this.setState(prevState => ({
            [id]: {
              ...prevState[id],
              executing: false
            }
          }));
        }
      })();
    });
  };

  getProcessState = (id: string) => {
    const proc = this.state[id];

    return proc && proc.executing
      ? proc.hasErrored
        ? 'erroring'
        : 'executing'
      : 'inactive';
  };

  executeCommand = async (id: string, command: string) => {
    const { socket } = this.props;
    const process = this.state[id] || {};

    // terminal has never been opened so prompt has not been generated
    if (!process.output) {
      const prompt = await this.generatePrompt();
      this.addToOutput(id, prompt);
    }
    // command was not entered manually (the play button was pressed)
    if (process.currLine !== command) {
      // so add the command to the output
      this.addToOutput(id, command);
    }

    this.generateNewLine(id);

    socket.emit('spawn', command, pid => {
      this.setState(prevState => ({
        [id]: {
          ...prevState[id],
          executing: true,
          pid
        }
      }));

      // eslint-disable-next-line
      console.log('spawned child_process with pid:', pid);
    });
  };

  killProcess = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      const { socket } = this.props;
      const process = this.state[id];

      if (!process.executing) {
        reject();
      }

      socket.emit('kill', process.pid, resolve);
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
      this.setState(prevState => {
        const prevProcessObj = prevState[id];

        return {
          [id]: {
            ...prevProcessObj,
            output: (prevProcessObj ? prevProcessObj.output : '') + cleanedData,
            // reset currLine if data is new data is not editable,
            // else just add to currLine
            currLine: editable
              ? (prevProcessObj ? prevProcessObj.currLine : '') + cleanedData
              : '',
            hasErrored
          }
        };
      });
    }
  };

  removeFromOutput = (id: string, charsToRemove: number) => {
    this.setState(prevState => {
      const process = prevState[id];
      if (!process.currLine) {
        return null;
      }

      return {
        [id]: {
          ...prevState[id],
          output: process.output.slice(0, -charsToRemove),
          currLine: process.currLine.slice(0, -charsToRemove)
        }
      };
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          processes: this.state,
          executeProcess: this.executeCommand,
          killProcess: this.killProcess,
          addToOutput: this.addToOutput,
          removeFromOutput: this.removeFromOutput,
          getProcessState: this.getProcessState
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

// ProcessContextConsumer returns the process for the given `id` prop
type ConsumerProps = {
  id: string,
  children: ProcessContextProps => Node
};

const ProcessContextConsumer = ({ id, children }: ConsumerProps) => {
  return (
    <Context.Consumer>
      {({
        processes,
        executeProcess,
        killProcess,
        addToOutput,
        removeFromOutput,
        getProcessState
      }) =>
        children({
          process: processes[id],
          executeProcess: executeProcess.bind(null, id),
          killProcess: killProcess.bind(null, id),
          addToOutput: addToOutput.bind(null, id),
          removeFromOutput: removeFromOutput.bind(null, id),
          getProcessState: getProcessState.bind(null, id)
        })
      }
    </Context.Consumer>
  );
};

// withProcessContext returns all processes
export const withProcessContext = <P>(
  WrappedComponent: ComponentType<*>
): ComponentType<P> => {
  return class WithProcessContext extends Component<P> {
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
  Provider: ProcessContextProvider,
  Consumer: ProcessContextConsumer
};

// @flow
import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import { Terminal } from '~/components';

type Props = ScriptsContextProps &
  SocketContextProps & {
    onInit: () => void,
    onExit: () => void,
    onError?: string => void,
    onData?: string => void,
    scriptId: string,
    active: boolean,
    isExecuting: boolean
  };

type State = {
  data: string,
  currLine: string
};

class TerminalManager extends PureComponent<Props, State> {
  executing: boolean = false;
  currProcessId: ?number = null;

  mounted = false;

  constructor(props) {
    super(props);

    const script = props.scripts[props.scriptId];

    if (!script || !script.output) {
      this.state = {
        data: '',
        currLine: ''
      };
      this.getPrompt();
    } else {
      this.state = {
        data: script.output,
        currLine: ''
      };
    }

    // $FlowFixMe: we debounce this as it is quite an expensive update and it needs to be ran often
    this.updateContextValue = debounce(this.updateContextValue, 300);
  }

  componentDidMount() {
    this.mounted = true;
    const { socket } = this.props;
    if (!socket) {
      return;
    }

    socket.on('data', ({ output, pid }) => {
      if (pid === this.currProcessId && output) {
        this.addToOutput(output, false);
        this.props.onData && this.props.onData(output);
      }
    });

    socket.on('processError', ({ output, pid }) => {
      if (pid === this.currProcessId && output) {
        this.addToOutput(output, false);
        this.props.onError && this.props.onError(output);
      }
    });

    socket.on('exit', ({ output, pid }) => {
      if (pid !== this.currProcessId) {
        return;
      }

      this.executing = false;

      this.generateNewLine(false);

      this.addToOutput(output, false);

      this.generateNewLine(true, this.props.onExit);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.data !== prevState.data) {
      this.updateContextValue();
    }
    if (this.props.isExecuting && !prevProps.isExecuting && !this.executing) {
      // spawn command
      const { scripts, scriptId } = this.props;
      const script = scripts[scriptId];

      this.addToOutput(script.command, false);
      this.generateNewLine(false);

      return this.spawnProcess(script.command);
    }
    if (!this.props.isExecuting && prevProps.isExecuting && this.executing) {
      // kill process
      return this.killProcess();
    }
  }

  getPrompt() {
    const { socket } = this.props;
    if (!socket) {
      return;
    }

    socket.emit('request', { resource: 'prompt' }, prompt => {
      this.setState({
        data: prompt,
        currLine: ''
      });
    });
  }

  spawnProcess(command: string) {
    const { socket } = this.props;
    if (!socket) {
      return;
    }
    socket.emit('spawn', command, id => {
      this.executing = true;
      this.currProcessId = id;

      // eslint-disable-next-line
      console.log('spawned child_process with pid:', id);
    });
  }

  killProcess() {
    const { socket } = this.props;

    if (!this.currProcessId || !socket) {
      return;
    }

    socket.emit('kill', this.currProcessId);
  }

  handleBackspace = () => {
    if (this.state.currLine.length <= 0) return;

    this.setState({
      data: this.state.data.slice(0, -1),
      currLine: this.state.currLine.slice(0, -1)
    });
  };

  handleEnter = () => {
    if (this.executing) return this.generateNewLine(false);

    const command = this.state.currLine;
    if (command) {
      this.generateNewLine(false);

      this.spawnProcess(command);
    } else {
      this.generateNewLine(true);
    }
  };

  handleKeyDown = (key: string) => {
    this.addToOutput(key);
  };

  updateContextValue = () => {
    if (this.mounted) {
      // remove 'currLine' value from data and update context value
      // with the trimmed data
      const regex = `^(.*)${this.state.currLine}$`;
      const matches = this.state.data.match(new RegExp(regex, 's'));

      if (!matches || matches.length < 2) {
        return;
      }
      const dataWithoutCurrLine = matches[1];
      this.props.updateScriptOutput(this.props.scriptId, dataWithoutCurrLine);
    }
  };

  addToOutput(data: string, editable?: boolean = true) {
    // insert proper carriage returns
    const cleanedData = data.split('\n').join('\r\n');

    if (cleanedData) {
      this.setState(prevState => ({
        data: prevState.data + cleanedData,
        currLine: editable ? prevState.currLine + cleanedData : ''
      }));
    }
  }

  generateNewLine(withPrompt?: boolean = false, callback?: () => void) {
    const { socket } = this.props;
    if (!socket) {
      return;
    }

    if (withPrompt) {
      socket.emit('request', { resource: 'prompt' }, async prompt => {
        this.setState(
          prevState => ({
            data: prevState.data + '\r\n' + prompt,
            currLine: ''
          }),
          () => {
            callback && callback();
          }
        );
      });
    } else {
      this.setState(
        prevState => ({
          data: prevState.data + '\r\n',
          currLine: ''
        }),
        () => {
          callback && callback();
        }
      );
    }
  }

  render() {
    const { active, onInit } = this.props;
    const { data } = this.state;

    return (
      <Terminal
        onInit={onInit}
        onBackspace={this.handleBackspace}
        onEnter={this.handleEnter}
        onKeyDown={this.handleKeyDown}
        value={data}
        active={active}
      />
    );
  }
}

export default withScriptsContext(withSocketContext(TerminalManager));

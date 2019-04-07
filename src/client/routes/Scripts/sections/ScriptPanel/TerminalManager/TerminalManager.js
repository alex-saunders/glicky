// @flow
import React, { PureComponent } from 'react';

import { type ProcessContextProps } from '~/context/ProcessContext';
import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import { Terminal } from '~/components';

type Props = ProcessContextProps &
  SocketContextProps & {
    active: boolean
  };

class TerminalManager extends PureComponent<Props> {
  constructor(props) {
    super(props);

    const { process: proc } = props;

    if (!(proc && proc.output)) {
      this.getPrompt({
        withLeadingCarriageReturn: false
      });
    }
  }

  // shouldComponentUpdate(nextProps: Props) {
  //   if (!this.props.process && nextProps.process) {
  //     return true;
  //   }
  //   if (
  //     (this.props.process && this.props.process.output) !==
  //     (nextProps.process && nextProps.process.output)
  //   ) {
  //     return true;
  //   }

  //   return false;
  // }

  // componentDidUpdate(prevProps: Props) {
  //   if (this.props.isExecuting && !prevProps.isExecuting) {
  //     // TODO: spawn command in ScriptsContext
  //     // const { scripts, scriptId, addToScriptOutput } = this.props;
  //     // const { command } = scripts[scriptId];
  //     // addToScriptOutput(scriptId, command);
  //     // return this.spawnProcess(command);
  //   }
  //   if (!this.props.script.executing && prevProps.isExecuting) {
  //     // TODO: kill process in ScriptsContext
  //     // return this.killProcess();
  //   }
  // }

  generateNewLine() {
    this.props.addToOutput('\n');
  }

  getPrompt(
    { withLeadingCarriageReturn } = { withLeadingCarriageReturn: true }
  ) {
    const { socket, addToOutput } = this.props;

    socket.emit('request', { resource: 'prompt' }, prompt => {
      addToOutput(withLeadingCarriageReturn ? '\n' + prompt : prompt);
    });
  }

  handleBackspace = () => {
    this.props.removeFromOutput(1);
  };

  handleEnter = () => {
    const { process: proc, executeProcess } = this.props;

    if (proc && proc.executing) {
      return this.generateNewLine();
    }

    if (!(proc && proc.currLine)) {
      return this.getPrompt();
    }

    executeProcess(proc.currLine);
  };

  handleKeyDown = (key: string) => {
    this.props.addToOutput(key, {
      editable: true
    });
  };

  render() {
    const { active, process: proc } = this.props;

    return (
      <Terminal
        onBackspace={this.handleBackspace}
        onEnter={this.handleEnter}
        onKeyDown={this.handleKeyDown}
        value={proc ? proc.output : ''}
        active={active}
      />
    );
  }
}

export default withSocketContext(TerminalManager);

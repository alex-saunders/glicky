// @flow
import React, { PureComponent } from 'react';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import { Terminal } from '~/components';

import type { Script } from '../../../../../../types';

type Props = ScriptsContextProps &
  SocketContextProps & {
    scriptId: string,
    script: Script,
    active: boolean
  };

class TerminalManager extends PureComponent<Props> {
  constructor(props) {
    super(props);

    const { script } = props;

    if (!script.output) {
      this.getPrompt({
        withLeadingCarriageReturn: false
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isExecuting && !prevProps.isExecuting) {
      // TODO: spawn command in ScriptsContext
      // const { scripts, scriptId, addToScriptOutput } = this.props;
      // const { command } = scripts[scriptId];
      // addToScriptOutput(scriptId, command);
      // return this.spawnProcess(command);
    }
    if (!this.props.script.executing && prevProps.isExecuting) {
      // TODO: kill process in ScriptsContext
      // return this.killProcess();
    }
  }

  generateNewLine() {
    this.props.addToScriptOutput(this.props.scriptId, '\n');
  }

  getPrompt(
    { withLeadingCarriageReturn } = { withLeadingCarriageReturn: true }
  ) {
    const { socket, scriptId, addToScriptOutput } = this.props;

    socket.emit('request', { resource: 'prompt' }, prompt => {
      addToScriptOutput(
        scriptId,
        withLeadingCarriageReturn ? '\n' + prompt : prompt
      );
    });
  }

  handleBackspace = () => {
    this.props.removeFromScriptOutput(this.props.scriptId, 1);
  };

  handleEnter = () => {
    const { script, scriptId, executeCommand } = this.props;

    if (script.executing) {
      return this.generateNewLine();
    }

    if (!script.currLine) {
      return this.getPrompt();
    }

    executeCommand(scriptId, script.currLine);
  };

  handleKeyDown = (key: string) => {
    this.props.addToScriptOutput(this.props.scriptId, key, {
      editable: true
    });
  };

  render() {
    const { active, script } = this.props;

    return (
      <Terminal
        onBackspace={this.handleBackspace}
        onEnter={this.handleEnter}
        onKeyDown={this.handleKeyDown}
        value={script.output}
        active={active}
      />
    );
  }
}

export default withScriptsContext(withSocketContext(TerminalManager));

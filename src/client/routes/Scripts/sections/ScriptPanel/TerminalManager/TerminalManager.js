// @flow
import React, { PureComponent } from 'react';

import { requestPrompt } from '~/utils/processUtils';

import { type ProcessContextProps } from '~/context/ProcessContext';

import { Terminal } from '~/components';

type Props = ProcessContextProps & {
  active: boolean
};

class TerminalManager extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    const { process: proc } = props;

    if (!(proc && proc.output)) {
      this.getPrompt({
        withLeadingCarriageReturn: false
      });
    }
  }
  generateNewLine() {
    this.props.addToOutput('\n');
  }

  getPrompt(
    { withLeadingCarriageReturn }: { withLeadingCarriageReturn?: boolean } = {
      withLeadingCarriageReturn: true
    }
  ) {
    const { addToOutput } = this.props;

    requestPrompt().then(prompt => {
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

export default TerminalManager;

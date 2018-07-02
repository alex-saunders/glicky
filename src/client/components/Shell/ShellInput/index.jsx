import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShellInput extends Component {
  state = {
    activeKeys: new Set()
  };
  static propTypes = {
    commander: PropTypes.object.isRequired,
    setOutput: PropTypes.func.isRequired,
    output: PropTypes.array.isRequired,
    inputRef: PropTypes.object.isRequired
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.commander.submitInput();
  };

  handleCommandInput = e => {
    const { value } = e.target;
    this.props.commander.addStdinChar(value);
    this.setState({
      command: ''
    });
    this.props.setOutput(this.addStdinChar(value));
  };

  handleCommandKeyDown = e => {
    const { key } = e;
    if (key === 'Backspace') {
      this.props.commander.removeStdinChar();
      this.props.setOutput(this.removeStdinChar());
    }
    if (key === 'c' && this.state.activeKeys.has('Control')) {
      this.props.commander.kill();
    }
    const newKeys = new Set(this.state.activeKeys);
    newKeys.add(key);
    this.setState({
      activeKeys: newKeys
    });
  };

  handleCommandKeyUp = e => {
    const { key } = e;
    const newKeys = new Set(this.state.activeKeys);
    newKeys.delete(key);
    this.setState({
      activeKeys: newKeys
    });
  };

  addStdinChar(stdin) {
    const currOutput = this.props.output;
    let newOutput = [...currOutput];
    let currLine = newOutput[newOutput.length - 1];

    if (currLine.length > 0) {
      const lastOutput = currLine[currLine.length - 1];

      if (
        lastOutput.type === 'stdin' ||
        lastOutput.type === 'linebreak' ||
        lastOutput.type === 'prefix'
      ) {
        currLine.push({
          type: 'stdin',
          output: stdin
        });
        newOutput[newOutput.length - 1] = currLine;
        return newOutput;
      }
    }
    return newOutput;
  }

  removeStdinChar() {
    const currOutput = this.props.output;
    let newOutput = [...currOutput];
    let currLine = newOutput[newOutput.length - 1];

    if (currLine.length > 0) {
      const lastOutput = currLine[currLine.length - 1];

      if (lastOutput.type === 'stdin') {
        currLine.pop();
      }
    }
    newOutput[newOutput.length - 1] = currLine;
    return newOutput;
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="shell-form">
        <input
          type="text"
          className="shell-input"
          onChange={this.handleCommandInput}
          onKeyDown={this.handleCommandKeyDown}
          onKeyUp={this.handleCommandKeyUp}
          value={''}
          ref={this.props.inputRef}
        />
      </form>
    );
  }
}

export default ShellInput;

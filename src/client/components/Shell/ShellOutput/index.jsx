import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Ansi from 'ansi-to-react';

class ShellOutput extends Component {
  static propTypes = {
    commander: PropTypes.object.isRequired,
    setOutput: PropTypes.func.isRequired,
    output: PropTypes.array.isRequired,
    focused: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    props.commander.addEventListener('stdout', stdout => {
      props.setOutput(this.addOutput(stdout));
    });
    props.commander.addEventListener('error', err => {
      props.setOutput(this.addOutput(err));
    });
    props.commander.addEventListener('linebreak', _ => {
      props.setOutput(this.addLineBreak());
    });
    props.commander.addEventListener('prefix', prefix => {
      props.setOutput(this.addPrefix(prefix));
    });
    props.commander.addEventListener('end', _ => {
      // console.log(this.props.output);
    });
  }

  addPrefix(prefix) {
    const currOutput = this.props.output;
    let newOutput = [...currOutput];
    newOutput.push([
      {
        type: 'prefix',
        output: prefix
      }
    ]);
    return newOutput;
  }

  addLineBreak() {
    const currOutput = this.props.output;
    let newOutput = [...currOutput];

    newOutput.push([
      {
        type: 'linebreak',
        output: ''
      }
    ]);
    return newOutput;
  }

  addOutput(stdout, error = false) {
    const currOutput = this.props.output;
    let newOutput = [...currOutput];
    let currLine = newOutput[newOutput.length - 1];
    let lastOutput = currLine[currLine.length - 1];

    if (
      lastOutput &&
      (lastOutput.type === 'stdin' || lastOutput.type === 'linebreak')
    ) {
      currLine.push({
        type: 'stdout',
        output: stdout
      });
      newOutput[newOutput.length - 1] = currLine;
    } else {
      newOutput.push([
        {
          type: 'stdout',
          output: stdout
        }
      ]);
    }
    return newOutput;
  }

  render() {
    const cursor = (
      <span className={`shell-cursor ${this.props.focused ? 'focused' : ''}`} />
    );

    return (
      <div className="output-linesContainer">
        {this.props.output.length > 0 ? (
          this.props.output.map((line, index) => (
            <p className="output-line" key={index}>
              {/* <code className="output-lineno">
                <span>[0]</span>
              </code> */}
              {line.length > 0
                ? line.map((output, index) => (
                    <Ansi
                      key={index}
                      className={`${
                        output.type === 'prefix'
                          ? 'output-prefix'
                          : 'output-ansi'
                      }`}
                    >
                      {output.output}
                    </Ansi>
                  ))
                : ''}
              {index + 1 >= this.props.output.length ? cursor : ''}
            </p>
          ))
        ) : (
          <p className="output-line">
            <code className="output-lineno">
              <span>1</span>
            </code>
            {cursor}
          </p>
        )}
      </div>
    );
  }
}

export default ShellOutput;

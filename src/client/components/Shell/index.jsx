import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTerminal from '@fortawesome/fontawesome-free-solid/faTerminal';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import CommandExecutor from '../../util/command-executor';

import Panel from '../common/Panel';
import ToolBar from './ToolBar';
import ShellInput from './ShellInput';
import ShellOutput from './ShellOutput';

const Container = styled(Panel)`
  margin: 0 0 32px;
`;

const PanelTitleWrapper = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;

  > svg {
    opacity: 0.7;
    margin-right: 16px;
  }
`;

class Shell extends Component {
  static propTypes = {
    script: PropTypes.object
  };
  static defaultProps = {
    script: {
      name: '',
      raw: ''
    }
  };

  state = {
    output: [],
    focused: false,
    command: ''
  };

  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
    this.inputRef = React.createRef();

    this.commander = new CommandExecutor(`npm run ${props.script.name}`);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick);
  }

  componentWillReceiveProps(nextProps) {
    this.commander.command = `npm run ${nextProps.script.name}`;
  }

  componentDidUpdate(prevProps, prevState) {
    // scroll to bottom
    const { current } = this.scrollRef;
    current.scrollTop = current.scrollHeight;

    if (this.state.focused) {
      this.focusInput();
    }
  }

  setOutput = output => {
    return new Promise(resolve => {
      this.setState(
        {
          output
        },
        () => {
          resolve();
        }
      );
    });
  };

  handleBodyClick = e => {
    if (!this.scrollRef.current.contains(e.target)) {
      this.setState({
        focused: false
      });
    } else {
      this.setState({
        focused: true
      });
    }
  };

  setFocus = focused => {
    return new Promise(res => {
      this.setState(
        {
          focused
        },
        () => res()
      );
    });
  };

  focusInput = () => {
    if (this.state.focused) {
      this.inputRef.current.focus();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <ToolBar
          commander={this.commander}
          setFocus={this.setFocus}
          focusInput={this.focusInput}
          setOutput={this.setOutput}
          script={this.props.script}
        />
        <ExpansionPanel
          classes={{
            root: classes.root
          }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <PanelTitleWrapper>
              <FontAwesomeIcon icon={faTerminal} />
              Terminal
            </PanelTitleWrapper>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="output-scrollWrapper" ref={this.scrollRef}>
              <ShellOutput
                commander={this.commander}
                setOutput={this.setOutput}
                output={this.state.output}
                focused={this.state.focused}
              />
              <ShellInput
                commander={this.commander}
                setOutput={this.setOutput}
                output={this.state.output}
                inputRef={this.inputRef}
                onSubmit={this.submitCommand}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Container>
    );
  }
}

const styles = {
  root: {
    boxShadow: 'none'
  }
};

export default withStyles(styles)(Shell);

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { PlayArrow, Stop, Replay, ClearAll } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import ThemedIconButton from '../../common/themed/ThemedIconButton';
import ThemedLinearProgress from '../../common/themed/ThemedLinearProgress';

const Wrapper = styled.div`
  /* width: 100%; */
`;

const Row = styled.div`
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 8px 16px;
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
`;

const Header = styled.header`
  font-size: 16px;
`;

const Subheading = styled.p`
  font-size: 12px;
  font-family: 'Roboto Mono', monospace;
  opacity: 0.5;
  margin: 0;
  max-height: 32px;
  overflow: hidden;
`;

const PrimaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SecondaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  > button {
    margin: 0 8px;
  }
`;

class ToolBar extends Component {
  static propTypes = {
    commander: PropTypes.object.isRequired,
    focusInput: PropTypes.func.isRequired,
    setFocus: PropTypes.func.isRequired,
    setOutput: PropTypes.func.isRequired
  };

  state = {
    executing: false
  };

  constructor(props) {
    super(props);

    props.commander.addEventListener('executing', executing => {
      console.log('here');
      this.setState({
        executing
      });
    });
  }

  focusInput() {
    this.props.setFocus(true).then(_ => this.props.focusInput());
  }

  executeCommand = () => {
    this.focusInput();
    this.props.commander.execute();
  };

  killProcess = () => {
    this.focusInput();
    this.props.commander.kill();
  };

  restartProcess = () => {
    this.focusInput();
    this.props.commander.restart();
  };

  clear = () => {
    this.focusInput();
    this.props.setOutput([]).then(_ => this.props.commander.addPrefix());
  };

  render() {
    return (
      <Wrapper>
        <ThemedLinearProgress active={this.state.executing} />
        <Row>
          <PrimaryWrapper>
            <ThemedIconButton primary onClick={this.executeCommand}>
              <PlayArrow />
            </ThemedIconButton>
            <RowText>
              {/* <TextField label="Script Name" value={this.props.script.name} /> */}
              <Header>{this.props.script.name}</Header>
              <Subheading>{this.props.script.raw}</Subheading>
            </RowText>
          </PrimaryWrapper>
          <SecondaryWrapper>
            <Tooltip title="Stop Script" placement="top">
              <div>
                <IconButton
                  onClick={this.killProcess}
                  disabled={!this.state.executing}
                >
                  <Stop />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Restart Script" placement="top">
              <IconButton onClick={this.restartProcess}>
                <Replay />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Shell" placement="top">
              <IconButton onClick={this.clear}>
                <ClearAll />
              </IconButton>
            </Tooltip>
          </SecondaryWrapper>
        </Row>
      </Wrapper>
    );
  }
}

const styles = {
  colorPrimary: {
    backgroundColor: 'rgba(255, 141, 84, 0.16)'
  },
  barColorPrimary: {
    backgroundColor: 'none',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  barTransition: {
    transition: 'opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  barDisabled: {
    animation: 'none',
    opacity: 0
  },
  barActive: {
    opacity: 1
  }
};

export default withStyles(styles)(ToolBar);

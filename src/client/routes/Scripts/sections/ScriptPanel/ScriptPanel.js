// @flow
import React, { Fragment, Component } from 'react';
import Ink from 'react-ink';
import posed, { PoseGroup } from 'react-pose';
import isEqual from 'react-fast-compare';

import { type Script } from '../../../../../types';

import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import {
  ExpansionPanel,
  ProgressBar,
  TextField,
  AnimateHeight
} from '~/components';

import TerminalManager from './TerminalManager/TerminalManager';
import {
  StyledPanel,
  Header,
  HeaderSection,
  PlayButton,
  RestartButton,
  StyledPlayIcon,
  TitleText,
  Title,
  Subtitle,
  Img,
  Body,
  BodyTitleBar,
  BodyTitleBarSection,
  BodyTitleBarText,
  TerminalIcon,
  PanelChevron,
  SecondaryButton
} from './ScriptPanel.styles';

import Replay from '../../assets/replay.svg';
import Stop from '../../assets/stop.svg';
import Chevron from '../../assets/chevron.svg';
import Edit from '../../assets/edit.svg';
import Check from '../../assets/check.svg';
import Delete from '../../assets/Delete.js';

const Container = posed.div({
  scriptsContentIn: {
    opacity: 1,
    y: 0,
    delay: 150,
    transition: { duration: 250 }
  },
  scriptsContentOut: { opacity: 0, y: 10, transition: { duration: 250 } }
});

type Props = ThemeContextProps & {
  script: Script,
  scriptId: string,
  onSave: Script => void,
  onRequestDelete: () => void
};

type State = {
  panelAnimating: boolean,
  panelOpen: boolean,
  isExecuting: boolean,
  initialised: boolean,
  hasErrored: boolean,
  script: Script,
  isEditingScript: boolean
};

class ScriptPanel extends Component<Props, State> {
  static defaultProps = {};

  state = {
    panelAnimating: false,
    panelOpen: false,
    isExecuting: false,
    initialised: false,
    hasErrored: false,
    isEditingScript: false,
    script: this.props.script
  };

  isRestarting: boolean = false;

  scriptNameField = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    // if panel is not open, only bother comparing state
    return this.state.panelOpen || this.state !== nextState;
  }

  handleError = (_error: string) => {
    this.setState({
      hasErrored: true
    });
  };

  handleData = (_data: string) => {
    this.setState({
      hasErrored: false
    });
  };

  handleInit = () => {
    this.setState({
      initialised: true
    });
  };

  handleStartClick = () => {
    this.setState({
      isExecuting: true
    });
  };

  handleStopClick = () => {
    this.setState({
      isExecuting: false
    });
  };

  handleRestartClick = () => {
    this.isRestarting = true;
    this.handleStopClick();
  };

  handleExit = () => {
    this.setState(
      {
        isExecuting: false,
        hasErrored: false
      },
      () => {
        if (this.isRestarting) {
          this.isRestarting = false;
          this.handleStartClick();
        }
      }
    );
  };

  handlePanelToggle = () => {
    this.setState(prevState => ({
      panelOpen: !prevState.panelOpen
    }));
  };

  handleScriptChange = (scriptProperty: 'name' | 'command', value) => {
    this.setState(prevState => ({
      script: {
        ...prevState.script,
        [scriptProperty]: value
      }
    }));
  };

  toggleEditingMode = () => {
    this.setState(
      state => ({
        isEditingScript: !state.isEditingScript
      }),
      () => {
        // editing
        if (this.state.isEditingScript) {
          const input = this.scriptNameField.current;
          if (input) {
            input.focus();
          }
        }
        // saving
        else {
          this.props.onSave(this.state.script);
        }
      }
    );
  };

  render() {
    const { scriptId } = this.props;
    const { isExecuting, isEditingScript, hasErrored, script } = this.state;

    const buttonState = isExecuting
      ? hasErrored
        ? 'error'
        : 'valid'
      : 'normal';

    return (
      <StyledPanel active={this.state.panelOpen} elevation="e0">
        <ProgressBar
          indeterminate={isExecuting}
          bgColour={'primary_light'}
          barColour={'primary_dark'}
        />
        <Header>
          <HeaderSection>
            <PlayButton
              elevation="e3"
              icon={
                isExecuting ? (
                  <Img src={Stop} />
                ) : (
                  <StyledPlayIcon colour="white" size="ms" />
                )
              }
              onClick={
                isExecuting ? this.handleStopClick : this.handleStartClick
              }
              type={buttonState}
            />
            <AnimateHeight style={{ flex: 1 }}>
              <PoseGroup
                enterPose="scriptsContentIn"
                exitPose="scriptsContentOut"
                preEnterPose="scriptsContentOut"
                withParent={false}
              >
                {isEditingScript ? (
                  <Container key="editing">
                    <TitleText>
                      <TextField
                        label="Script name"
                        fullWidth
                        value={script.name}
                        font={"'Roboto Mono',monospace"}
                        ref={this.scriptNameField}
                        onChange={this.handleScriptChange.bind(null, 'name')}
                      />
                      <TextField
                        label="Script command(s)"
                        fullWidth
                        multiline
                        rows={2}
                        value={script.command}
                        font={"'Roboto Mono',monospace"}
                        style={{ paddingBottom: 0 }}
                        onChange={this.handleScriptChange.bind(null, 'command')}
                      />
                    </TitleText>
                  </Container>
                ) : (
                  <Container key="viewing">
                    <TitleText>
                      <Title size="s0" fontWeight="normal">
                        {script.name}
                      </Title>
                      <Subtitle colour="text_secondary" size="sm2">
                        {script.command}
                      </Subtitle>
                    </TitleText>
                  </Container>
                )}
              </PoseGroup>
            </AnimateHeight>
          </HeaderSection>

          <HeaderSection>
            <RestartButton
              elevation="e0"
              icon={<Img src={Replay} />}
              onClick={this.handleRestartClick}
              disabled={!isExecuting}
            />
            <SecondaryButton
              elevation="e0"
              icon={<Img src={isEditingScript ? Check : Edit} />}
              onClick={this.toggleEditingMode}
            />
            <SecondaryButton
              elevation="e0"
              icon={<Delete />}
              onClick={this.props.onRequestDelete}
            />
          </HeaderSection>
        </Header>

        <Body>
          <ExpansionPanel
            active={this.state.panelOpen}
            renderTitle={({ active }) => (
              <BodyTitleBar onClick={this.handlePanelToggle}>
                <Ink />
                <BodyTitleBarSection>
                  <TerminalIcon />
                  <BodyTitleBarText size="sm2" fontWeight="normal">
                    Terminal
                  </BodyTitleBarText>
                </BodyTitleBarSection>
                <BodyTitleBarSection>
                  <PanelChevron src={Chevron} alt="expand" active={active} />
                </BodyTitleBarSection>
              </BodyTitleBar>
            )}
          >
            {({ active }) => (
              <TerminalManager
                onInit={this.handleInit}
                onExit={this.handleExit}
                onError={this.handleError}
                onData={this.handleData}
                active={active}
                scriptId={scriptId}
                isExecuting={isExecuting}
              />
            )}
          </ExpansionPanel>
        </Body>
      </StyledPanel>
    );
  }
}

export default withTheme(ScriptPanel);

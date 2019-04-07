// @flow
import React, { Component, Fragment } from 'react';
import Ink from 'react-ink';
import posed, { PoseGroup } from 'react-pose';

import { type Script } from '../../../../../types';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import ProcessContext from '~/context/ProcessContext';

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

type Props = ThemeContextProps &
  ScriptsContextProps & {
    script: Script,
    scriptId: string,
    onSave: Script => void,
    onRequestDelete: () => void
  };

type State = {
  panelOpen: boolean,
  script: Script,
  isEditingScript: boolean
};

class ScriptPanel extends Component<Props, State> {
  static defaultProps = {};

  state = {
    panelOpen: false,
    isEditingScript: false,
    script: this.props.script
  };

  isRestarting: boolean = false;

  scriptNameField = React.createRef();

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('shouldComponentUpdate');
  //   return true;
  //   // // if panel is not open, only then bother comparing state
  //   // return (
  //   //   this.state.panelOpen ||
  //   //   this.props.script.executing ||
  //   //   this.state !== nextState
  //   // );
  // }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.script.executing && !this.props.script.executing) {
      if (this.isRestarting) {
        this.isRestarting = false;
        this.handleStartClick();
      }
    }
  }

  handleStartClick = () => {
    const { script, scriptId, executeCommand } = this.props;

    if (script.executing) {
      return;
    }

    executeCommand(scriptId, script.command);
  };

  handleStopClick = () => {
    const { script, scriptId, stopProcess } = this.props;

    if (!script.executing) {
      return;
    }

    stopProcess(scriptId);
  };

  handleRestartClick = () => {
    this.isRestarting = true;
    this.handleStopClick();
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
    const { scriptId, script } = this.props;
    const { isEditingScript, script: stateScript } = this.state;

    return (
      <StyledPanel active={this.state.panelOpen} elevation="e0">
        <ProcessContext.Consumer id={scriptId}>
          {({
            process: proc,
            killProcess,
            executeProcess,
            addToOutput,
            removeFromOutput
          }) => (
            <Fragment>
              <ProgressBar
                indeterminate={proc ? proc.executing : false}
                bgColour={'primary_light'}
                barColour={'primary_dark'}
              />
              <Header>
                <HeaderSection>
                  <PlayButton
                    elevation="e3"
                    icon={
                      proc && proc.executing ? (
                        <Img src={Stop} />
                      ) : (
                        <StyledPlayIcon colour="white" size="ms" />
                      )
                    }
                    onClick={
                      proc && proc.executing
                        ? killProcess
                        : () => executeProcess(script.command)
                    }
                    type={
                      proc && proc.executing
                        ? proc.hasErrored
                          ? 'error'
                          : 'valid'
                        : 'normal'
                    }
                  />
                  <AnimateHeight style={{ flex: 1 }}>
                    <PoseGroup
                      enterPose="scriptsContentIn"
                      exitPose="scriptsContentOut"
                      preEnterPose="scriptsContentOut"
                    >
                      {isEditingScript ? (
                        <Container key="editing">
                          <TitleText>
                            <TextField
                              label="Script name"
                              fullWidth
                              value={stateScript.name}
                              font={"'Roboto Mono',monospace"}
                              ref={this.scriptNameField}
                              onChange={this.handleScriptChange.bind(
                                null,
                                'name'
                              )}
                            />
                            <TextField
                              label="Script command(s)"
                              fullWidth
                              multiline
                              rows={2}
                              value={stateScript.command}
                              font={"'Roboto Mono',monospace"}
                              style={{ paddingBottom: 0 }}
                              onChange={this.handleScriptChange.bind(
                                null,
                                'command'
                              )}
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
                    disabled={!(proc && proc.executing)}
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
                        <PanelChevron
                          src={Chevron}
                          alt="expand"
                          active={active}
                        />
                      </BodyTitleBarSection>
                    </BodyTitleBar>
                  )}
                >
                  {({ active }) => (
                    <TerminalManager
                      addToOutput={addToOutput}
                      removeFromOutput={removeFromOutput}
                      executeProcess={executeProcess}
                      process={proc}
                      active={active}
                    />
                  )}
                </ExpansionPanel>
              </Body>
            </Fragment>
          )}
        </ProcessContext.Consumer>
      </StyledPanel>
    );
  }
}

export default withTheme(withScriptsContext(ScriptPanel));

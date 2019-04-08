// @flow
import React, { Component, Fragment } from 'react';
import posed, { PoseGroup } from 'react-pose';

import { ProgressBar, TextField, AnimateHeight, Icon } from '~/components';

import type { Script, ProcessState } from '../../../../../../types';

import {
  Header,
  HeaderSection,
  PlayButton,
  RestartButton,
  StyledPlayIcon,
  TitleText,
  Title,
  Subtitle,
  SecondaryButton
} from '../ScriptPanel.styles';

type Props = {
  processState: ProcessState,
  killProcess: () => Promise<void>,
  executeProcess: string => Promise<void>,
  onSave: Script => void,
  onRequestDelete: () => void,
  scriptName: string,
  scriptCommand: string
};

type State = {
  name: string,
  command: string,
  isEditingScript: boolean
};

const Container = posed.div({
  scriptsContentIn: {
    opacity: 1,
    y: 0,
    delay: 150,
    transition: { duration: 250 }
  },
  scriptsContentOut: { opacity: 0, y: 10, transition: { duration: 250 } }
});

class ScriptPanelToolbar extends Component<Props, State> {
  static defaultProps = {};

  state = {
    isEditingScript: false,
    name: this.props.scriptName,
    command: this.props.scriptCommand
  };

  isRestarting = false;
  scriptNameField = React.createRef<HTMLElement>();

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // kinda hacky but prevents a load of re-renders on uneccesary components
    if (this.props.processState === nextProps.processState) {
      return this.state !== nextState;
    }

    return true;
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.processState === 'executing' ||
      (prevProps.processState === 'erroring' &&
        this.props.processState === 'inactive')
    ) {
      if (this.isRestarting) {
        this.isRestarting = false;
        this.handleStartClick();
      }
    }
  }

  handleRestartClick = () => {
    this.isRestarting = true;
    this.handleStopClick();
  };

  handleStartClick = () => {
    this.props.executeProcess(this.state.command);
  };

  handleStopClick = () => {
    this.props.killProcess();
  };

  handleScriptChange = (scriptProperty: 'name' | 'command', value: string) => {
    this.setState({
      [scriptProperty]: value
    });
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
          this.props.onSave({
            name: this.state.name,
            command: this.state.command
          });
        }
      }
    );
  };

  render() {
    const { processState } = this.props;
    const { isEditingScript, name, command } = this.state;

    const isExecuting =
      processState === 'executing' || processState === 'erroring';

    return (
      <Fragment>
        <ProgressBar
          indeterminate={isExecuting}
          bgColour={'primary_light'}
          barColour={'primary_dark'}
        />
        <Header>
          <HeaderSection>
            <PlayButton
              elevation="e3"
              icon={<StyledPlayIcon type={isExecuting ? 'stop' : 'play'} />}
              onClick={
                isExecuting ? this.handleStopClick : this.handleStartClick
              }
              type={
                processState === 'erroring'
                  ? 'error'
                  : processState === 'executing'
                  ? 'valid'
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
                        value={name}
                        font={"'Roboto Mono',monospace"}
                        ref={this.scriptNameField}
                        onChange={this.handleScriptChange.bind(null, 'name')}
                      />
                      <TextField
                        label="Script command(s)"
                        fullWidth
                        multiline
                        rows={2}
                        value={command}
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
                        {name}
                      </Title>
                      <Subtitle colour="text_secondary" size="sm2">
                        {command}
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
              icon={<Icon type="replay" />}
              onClick={this.handleRestartClick}
              disabled={!isExecuting}
            />
            <SecondaryButton
              elevation="e0"
              icon={<Icon type={isEditingScript ? 'check' : 'edit'} />}
              onClick={this.toggleEditingMode}
            />
            <SecondaryButton
              elevation="e0"
              icon={<Icon type="remove" />}
              onClick={this.props.onRequestDelete}
            />
          </HeaderSection>
        </Header>
      </Fragment>
    );
  }
}

export default ScriptPanelToolbar;

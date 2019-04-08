// @flow
import React, { PureComponent } from 'react';
import Ink from 'react-ink';

import { type Script } from '../../../../../types';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import ProcessContext from '~/context/ProcessContext';

import { ExpansionPanel } from '~/components';

import Toolbar from './Toolbar/Toolbar';
import TerminalManager from './TerminalManager/TerminalManager';

import {
  StyledPanel,
  Body,
  BodyTitleBar,
  BodyTitleBarSection,
  BodyTitleBarText,
  TerminalIcon,
  ChevronIcon
} from './ScriptPanel.styles';

type Props = ThemeContextProps &
  ScriptsContextProps & {
    script: Script,
    scriptId: string,
    onSave: Script => void,
    onRequestDelete: () => void
  };

type State = {
  panelOpen: boolean
};

class ScriptPanel extends PureComponent<Props, State> {
  static defaultProps = {};

  state = {
    panelOpen: false,
    isEditingScript: false,
    script: this.props.script
  };

  handlePanelToggle = () => {
    this.setState(prevState => ({
      panelOpen: !prevState.panelOpen
    }));
  };

  render() {
    const { scriptId, script } = this.props;

    return (
      <StyledPanel active={this.state.panelOpen} elevation="e0">
        <Body>
          <ProcessContext.Consumer id={scriptId}>
            {({ getProcessState, killProcess, executeProcess }) => (
              <Toolbar
                processState={getProcessState()}
                scriptName={script.name}
                scriptCommand={script.command}
                killProcess={killProcess}
                executeProcess={executeProcess}
                onSave={this.props.onSave}
                onRequestDelete={this.props.onRequestDelete}
              />
            )}
          </ProcessContext.Consumer>
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
                  <ChevronIcon active={active} />
                </BodyTitleBarSection>
              </BodyTitleBar>
            )}
          >
            {({ active }) => (
              <ProcessContext.Consumer id={scriptId}>
                {({
                  process: proc,
                  executeProcess,
                  addToOutput,
                  removeFromOutput
                }) => (
                  <TerminalManager
                    addToOutput={addToOutput}
                    removeFromOutput={removeFromOutput}
                    executeProcess={executeProcess}
                    process={proc}
                    active={active}
                  />
                )}
              </ProcessContext.Consumer>
            )}
          </ExpansionPanel>
        </Body>
      </StyledPanel>
    );
  }
}

export default withTheme(withScriptsContext(ScriptPanel));

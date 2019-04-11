// @flow
import React, { PureComponent } from 'react';
import Ink from 'react-ink';
import { PoseGroup } from 'react-pose';

import { type Script } from '../../../../../types';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import ProcessContext from '~/context/ProcessContext';

import { ExpansionPanel, Spinner } from '~/components';

import Toolbar from './Toolbar/Toolbar';
import TerminalManager from './TerminalManager/TerminalManager';

import {
  StyledPanel,
  Body,
  BodyTitleBar,
  BodyTitleBarSection,
  BodyTitleBarText,
  TerminalIcon,
  ChevronIcon,
  SpinnerWrapper
} from './ScriptPanel.styles';

type Props = ThemeContextProps &
  ScriptsContextProps & {
    script: Script,
    scriptId: string,
    onSave: Script => void,
    onRequestDelete: () => void
  };

type State = {
  panelOpen: boolean,
  displayIcon: boolean,
  displayContent: boolean
};

class ScriptPanel extends PureComponent<Props, State> {
  static defaultProps = {};

  state = {
    panelOpen: false,
    displayIcon: false,
    displayContent: false
  };

  timeout: TimeoutID;

  handlePanelToggle = () => {
    this.setState(
      prevState => ({
        displayIcon: !prevState.panelOpen,
        panelOpen: !prevState.panelOpen
      }),
      () => {
        if (this.timeout);
        clearTimeout(this.timeout);

        // yeesh, I know.
        // xterm takes a little while to spin up so rather than immediately
        // rendering the Terminal renderer (which will lock the main thread
        // while xterm starts up), we introduce a fake loading timeout so
        // that we can show a loading spinner before we attempt to render
        // the terminal
        //
        // sometimes a beautiful lie is better than the ugly truth - someone, sometime.
        this.timeout = setTimeout(() => {
          this.setState(prevState => ({
            displayContent: prevState.panelOpen,
            displayIcon: !prevState.panelOpen
          }));
        }, 200);
      }
    );
  };

  render() {
    const { scriptId, script, theme } = this.props;

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
                  <PoseGroup>
                    {this.state.displayIcon && this.state.panelOpen && (
                      <SpinnerWrapper key="loadingTerminal">
                        <Spinner
                          colour={theme.mode === 'dark' ? 'white' : 'primary'}
                          size="sm"
                          lineWidth={2}
                        />
                      </SpinnerWrapper>
                    )}
                  </PoseGroup>
                  <ChevronIcon active={active} />
                </BodyTitleBarSection>
              </BodyTitleBar>
            )}
          >
            {({ active }) =>
              this.state.displayContent && (
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
              )
            }
          </ExpansionPanel>
        </Body>
      </StyledPanel>
    );
  }
}

export default withTheme(withScriptsContext(ScriptPanel));

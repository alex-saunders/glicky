// @flow
import * as React from 'react';
import { type Theme } from 'xterm';
import { darken } from 'polished';

import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import { Terminal as XTerm } from '../../../xterm-renderer';

import GlobalStyles from './Terminal.styles.global';
import { Container, Wrapper } from './Terminal.styles';

type Props = ThemeContextProps & {
  /** Controls whether Terminal can be interacted with */
  active: boolean,
  /** Event fired on initialisation */
  onInit: () => void,
  /** Event fired on enter key being pressed */
  onEnter: () => void,
  /** Event fired on backspace key being pressed */
  onBackspace: () => void,
  /** Event fired on any generic char key being pressed - passes char value as parameter */
  onKeyDown: string => void,
  /** Raw terminal input text (including carriage/line returns, ANSI codes etc.) */
  value: string
};

type State = {
  data: string
};

class Terminal extends React.Component<Props, State> {
  static defaultProps = {
    active: true
  };

  render() {
    const { active } = this.props;

    const terminalTheme: Theme = {
      background: darken(1, this.props.theme.colour('grey')),
      red: this.props.theme.colour('red'),
      brightRed: this.props.theme.colour('red_light')
    };

    const lines = this.props.value.split('\r\n');

    return (
      <Container>
        <GlobalStyles />
        <Wrapper>
          <XTerm
            active={active}
            theme={terminalTheme}
            onInit={this.props.onInit}
            onEnter={this.props.onEnter}
            onBackspace={this.props.onBackspace}
            onKeyDown={this.props.onKeyDown}
            fontFamily="'Roboto Mono',monospace"
          >
            {lines.map((line, index) =>
              index === lines.length - 1 ? (
                <text key={index}>{line}</text>
              ) : (
                <line key={index}>{line}</line>
              )
            )}
          </XTerm>
        </Wrapper>
      </Container>
    );
  }
}

export default withTheme(Terminal);

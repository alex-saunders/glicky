// @flow
import React, { Component, type Node } from 'react';
import { Terminal as XTerm, type Theme } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

import type { Root } from './';
import XTermRenderer from '../reconciler';
import { setupTerminal } from '../utils/setupTerminal';

type Term = XTerm & {
  fit: () => void
};
XTerm.applyAddon(fit);

type Props = {
  active: boolean,
  onInit?: () => void,
  onEnter: () => void,
  onBackspace: () => void,
  onKeyDown: string => void,
  value: string,
  theme?: Theme,
  fontFamily?: string,
  children: Node
};

type State = {
  data: string
};

/**
 * The `<Terminal>` React component is used when mixing
 * the XTermRenderer with a React-DOM project - mounting the `<Terminal>`
 * component initialises an instance of XTermRenderer which then controls
 * its children using this renderer
 */
class Terminal extends Component<Props, State> {
  static defaultProps = {
    active: true,
    value: '',
    fontFamily: 'monospace'
  };

  wrapper: ?HTMLDivElement;
  term: Term;
  root: Root;
  container: any;
  initialised: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      data: props.value
    };
  }

  componentDidMount() {
    if (!this.wrapper) return;

    if (this.props.active) {
      this.setupTerminal();
      this.setupEvents();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitTerm, { passive: true });
  }

  componentDidUpdate() {
    if (!this.props.active) return;

    if (this.props.active && !this.initialised) {
      this.setupTerminal();
      this.setupEvents();
    }

    XTermRenderer.updateContainer(this.props.children, this.container, null);
  }

  setupTerminal() {
    if (!this.wrapper) return;

    const { container, terminal } = setupTerminal(this.wrapper, {
      theme: this.props.theme,
      fontFamily: this.props.fontFamily
    });
    this.container = container;
    this.term = terminal;

    XTermRenderer.updateContainer(this.props.children, this.container, null);
  }

  setupEvents() {
    const { term } = this;
    // we use term.on('key) to detect backspace and enter presses
    // as we can't do this with React's events (they get overriden by xtermjs)
    term.on('key', (key: string) => {
      const keyCode = key.charCodeAt(0);

      if (keyCode === 127) {
        // delete character
        return this.props.onBackspace();
      }
      if (keyCode === 13) {
        // handle enter
        return this.props.onEnter();
      }

      return this.props.onKeyDown(key);
    });

    // ensure terminal always fits container
    window.addEventListener('resize', this.fitTerm, { passive: true });

    setTimeout(this.fitTerm, 0);

    this.initialised = true;
    if (this.props.onInit) {
      this.props.onInit();
    }
  }

  fitTerm = () => {
    if (this.props.active) {
      this.term.fit();
    }
  };

  render() {
    return (
      <div
        className="terminal renderer"
        tabIndex="0"
        style={{ width: '100%', height: '100%' }}
        ref={div => (this.wrapper = div)}
      />
    );
  }
}

export default Terminal;

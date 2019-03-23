// @flow
import { Component, type Node } from 'react';

type Props = {
  children: Node
};

type State = {
  a11yMode: boolean
};

class A11yHandler extends Component<Props, State> {
  state = {
    a11yMode: false
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleMouseDown = () => {
    if (this.state.a11yMode) {
      this.setState(
        {
          a11yMode: false
        },
        () => {
          document.body && document.body.classList.remove('a11y-mode');
        }
      );
    }
  };

  handleKeyDown = () => {
    if (!this.state.a11yMode) {
      this.setState(
        {
          a11yMode: true
        },
        () => {
          document.body && document.body.classList.add('a11y-mode');
        }
      );
    }
  };

  render() {
    return this.props.children;
  }
}

export default A11yHandler;

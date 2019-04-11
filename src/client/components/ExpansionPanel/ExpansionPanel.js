// @flow
import * as React from 'react';
import styled from 'styled-components';

import type { ThemedComponent } from '~/theme';

import AnimateHeight from '../utils/AnimateHeight/AnimateHeight';

type BodyProps = {
  animating: boolean
};
const Body: ThemedComponent<BodyProps> = styled.div`
  position: relative;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

type Props = {
  className?: string,
  active?: boolean,
  /** render-prop taking object as parameter with `onClick` and `active` properties */
  renderTitle: ({
    onClick: () => void,
    active: boolean
  }) => React.Node,
  /** render function taking object as parameter with `active` property - renders panel body */
  children: ({
    active: boolean
  }) => React.Node,
  /** duration of expand/collapse animation */
  duration: number,
  transitionOpacity: boolean,
  onTransitionEnd?: () => void,
  /** event handler that passes in active state and updated height as parameters */
  onToggle?: (boolean, number) => void,
  elevated?: boolean
};

type State = {
  isOpen: boolean,
  display: 'block' | 'none',
  height: 0 | 'auto',
  opacity: 0 | 1
};

class ExpansionPanel extends React.Component<Props, State> {
  static defaultProps = {
    duration: 0.3,
    transitionOpacity: false
  };

  state = {
    isOpen: this.props.active || false,
    animating: false,
    display: this.props.active ? 'block' : 'none',
    height: 'auto',
    opacity: this.props.active ? 1 : 0
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!('active' in props) || props.active === state.isOpen) {
      return null;
    }

    return {
      isOpen: props.active,
      display: 'block',
      height: props.active ? 'auto' : 0,
      opacity: !props.active ? 0 : state.opacity
    };
  }

  componentDidUpdate() {
    if (this.props.active && !this.state.opacity) {
      this.setState({
        opacity: 1
      });
    }
  }

  handleClick = () => {
    console.log(this.props);
    if ('active' in this.props) {
      return;
    }

    this.setState((prevState: State) => ({
      isOpen: !prevState.isOpen,
      height: prevState.isOpen ? 0 : 'auto',
      display: 'block'
    }));
  };

  handleTransitionEnd = () => {
    this.props.onTransitionEnd && this.props.onTransitionEnd();
    this.setState({
      display: this.state.isOpen ? 'block' : 'none',
      height: 'auto'
    });
  };

  handleHeightChange = (height: number) => {
    this.props.onToggle && this.props.onToggle(this.state.isOpen, height);
  };

  render() {
    const { isOpen, display, height, opacity } = this.state;
    const { transitionOpacity, elevated } = this.props;

    return (
      <div className={this.props.className}>
        {this.props.renderTitle({
          onClick: this.handleClick,
          active: isOpen
        })}
        <AnimateHeight
          onTransitionEnd={this.handleTransitionEnd}
          onHeightChange={this.handleHeightChange}
          duration={this.props.duration}
          elevated={elevated}
        >
          {display === 'block' && (
            <Body
              style={{
                display,
                height,
                opacity: transitionOpacity ? opacity : 1
              }}
            >
              {this.props.children({
                active: isOpen
              })}
            </Body>
          )}
        </AnimateHeight>
      </div>
    );
  }
}

export default ExpansionPanel;

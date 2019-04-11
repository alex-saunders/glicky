// @flow
import React, { Component, type Node } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { request } from 'http';

const Box = posed.div({
  auto: {
    applyAtStart: { display: 'block' },
    height: 'auto',
    transition: {
      default: { ease: 'anticipate', duration: 400 }
    }
  },
  value: {
    applyAtStart: { display: 'block' },
    height: props => props.height,
    transition: {
      duration: 0
    }
  }
});

const StyledBox = styled(Box)`
  overflow: hidden;
`;

type Props = {
  duration?: number,
  children: Node,
  onTransitionEnd: () => void,
  onHeightChange?: number => void,
  className?: string
};

type State = {
  pose: 'auto' | 'value',
  height: number | 'auto'
};

class AnimateHeight extends Component<Props, State> {
  static defaultProps = {
    onTransitionEnd: () => {}
  };

  ref = React.createRef<HTMLElement>();

  state = {
    height: 'auto',
    pose: 'auto'
  };

  getSnapshotBeforeUpdate() {
    const { current } = this.ref;
    if (!current) {
      return null;
    }

    return current.offsetHeight;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot?: number) {
    const { current } = this.ref;

    if (
      snapshot === null ||
      snapshot === undefined ||
      !current ||
      this.state.pose === 'value'
    ) {
      return;
    }

    const height = current.offsetHeight;

    if (height === snapshot) {
      return;
    }

    this.props.onHeightChange && this.props.onHeightChange(height);

    this.setState(
      {
        pose: 'value',
        height: snapshot
      },
      () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.setState(
              {
                pose: 'auto'
              },
              () => {
                // nasty setTimeout hack for now as onPoseComplete is bugged - it fires
                // at the start of the animation as well as the end
                setTimeout(this.props.onTransitionEnd, 400);
              }
            );
          });
        });
      }
    );
  }

  render() {
    const { children, className, onHeightChange, ...rest } = this.props;
    const { height, pose } = this.state;

    return (
      <StyledBox
        ref={this.ref}
        pose={pose}
        height={height}
        className={className}
        withParent={false}
        {...rest}
      >
        {children}
      </StyledBox>
    );
  }
}

export default AnimateHeight;

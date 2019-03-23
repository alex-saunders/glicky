// @flow
import React, { Component, Fragment, type Node } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import { Text } from '~/components';

import { Background, Wrapper, Header, Body, Footer } from './Modal.styles';

type Props = {
  isActive: boolean,
  onRequestClose: () => void,
  onOpen?: () => void,
  title: string,
  renderBody: () => Node,
  renderFooter?: () => Node,
  renderWrapper?: Node => Node,
  overflow?: 'visible' | 'auto' | 'hidden'
};

type State = {
  modalState: 'ACTIVE' | 'INACTIVE'
};

class Modal extends Component<Props, State> {
  static defaultProps = {};

  state = {
    modalState: 'INACTIVE'
  };

  modal: ?HTMLDivElement;

  el = document.createElement('div');

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (nextProps.isActive) {
      return {
        modalState:
          state.modalState === 'INACTIVE' ? 'ACTIVE' : state.modalState
      };
    } else {
      return {
        modalState:
          state.modalState === 'ACTIVE' ? 'INACTIVE' : state.modalState
      };
    }
  }

  componentDidMount() {
    const modalRoot = document.getElementById('modal-root');
    modalRoot && modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscapeClicked);
  }

  componentDidUpdate() {
    if (this.state.modalState === 'ACTIVE') {
      window.addEventListener('keydown', this.handleEscapeClicked);
    } else {
      window.removeEventListener('keydown', this.handleEscapeClicked);
    }
  }

  handleTransitionEnd = () => {
    if (this.state.modalState === 'ACTIVE' && this.props.onOpen) {
      this.props.onOpen();
    }
  };

  handleBackgroundClick = (e: SyntheticMouseEvent<*>) => {
    // $FlowFixMe
    if (this.modal && !this.modal.contains(e.target)) {
      if (
        this.state.modalState === 'ENTERING' ||
        this.state.modalState === 'ACTIVE'
      ) {
        this.props.onRequestClose();
      }
    }
  };

  handleEscapeClicked = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.onRequestClose();
    }
  };

  render() {
    const { modalState } = this.state;

    const pose = modalState.toLowerCase();

    const modalContent = (
      <Fragment>
        <Header>
          <Text size="s1" weight="bold" colour="text" spacing="small">
            {this.props.title}
          </Text>
        </Header>
        <Body overflow={this.props.overflow}>{this.props.renderBody()}</Body>
        {this.props.renderFooter && (
          <Footer>{this.props.renderFooter()}</Footer>
        )}
      </Fragment>
    );

    return ReactDOM.createPortal(
      <Background
        onPoseComplete={this.handleTransitionEnd}
        onClick={this.handleBackgroundClick}
        pose={pose}
      >
        <FocusLock disabled={modalState === 'INACTIVE'}>
          <Wrapper ref={div => (this.modal = div)} pose={pose}>
            {this.props.renderWrapper
              ? this.props.renderWrapper(modalContent)
              : modalContent}
          </Wrapper>
        </FocusLock>
      </Background>,
      this.el
    );
  }
}

export default Modal;

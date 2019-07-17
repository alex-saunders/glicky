// @flow
import React, { Component, createContext, type Node } from 'react';
import FocusLock from 'react-focus-lock';

import {
  Background,
  SlidesWrapper,
  ArrowButton,
  DotsContainer,
  Dot,
  StyledSlide
} from './ModalCarousel.styles';

export type ContextProps = {
  activeIndex: number,
  registerSlide: () => number
};

const defaultContext = {
  activeIndex: 0,
  registerSlide: () => 0
};

const Context = createContext<ContextProps>(defaultContext);

type SlideProps = {
  children: Node
};

const Slide = ({ children }: SlideProps) => (
  <Context.Consumer>
    {contextProps => <InnerSlide {...contextProps}>{children}</InnerSlide>}
  </Context.Consumer>
);

type InnerSlideProps = ContextProps & SlideProps;

class InnerSlide extends Component<InnerSlideProps, *> {
  index: number;

  constructor(props) {
    super(props);

    this.index = props.registerSlide();
  }

  render() {
    const { activeIndex, children } = this.props;

    const pose =
      activeIndex === this.index
        ? 'active'
        : activeIndex < this.index
        ? 'right'
        : 'left';

    console.log(activeIndex, this.index, pose);

    return (
      <StyledSlide pose={pose} initialPose={'inactive'}>
        {children}
      </StyledSlide>
    );
  }
}

type Props = {
  children: Node,
  canGoBack: boolean,
  canGoForward: boolean
};

type State = {
  activeIndex: number,
  numSlides: number
};

class ModalCarousel extends Component<Props, State> {
  static Slide = Slide;

  state = {
    activeIndex: 0,
    numSlides: 0
  };

  numSlides: number = -1;

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  registerSlide = () => {
    this.numSlides++;
    this.setState({
      numSlides: this.numSlides
    });
    return this.numSlides;
  };

  handleKeyPress = e => {
    const { keyCode } = e;

    // left arrow key
    if (keyCode === 37) {
      return this.handlePrev();
    }

    // right arrow key
    if (keyCode === 39) {
      return this.handleNext();
    }
  };

  handleNext = () => {
    if (
      this.state.activeIndex >= this.state.numSlides ||
      !this.props.canGoForward
    ) {
      return;
    }

    this.setState(prevState => ({
      activeIndex: prevState.activeIndex + 1
    }));
  };

  handlePrev = () => {
    if (this.state.activeIndex < 1 || !this.props.canGoBack) {
      return;
    }

    this.setState(prevState => ({
      activeIndex: prevState.activeIndex - 1
    }));
  };

  render() {
    const { children } = this.props;
    const { activeIndex, numSlides } = this.state;

    const canGoLeft = this.props.canGoBack && activeIndex >= 1;
    const canGoRight = this.props.canGoForward && activeIndex < numSlides;

    return (
      <Context.Provider
        value={{
          activeIndex: activeIndex,
          registerSlide: this.registerSlide
        }}
      >
        <FocusLock>
          <Background
            key="modalCarouselIn"
            pose={'backgroundActive'}
            initialPose={'backgroundInactive'}
          >
            <ArrowButton
              icon="arrow"
              direction="left"
              onClick={this.handlePrev}
              disabled={!canGoLeft}
            />
            <SlidesWrapper>
              {children}

              <DotsContainer>
                {Array.from({ length: numSlides + 1 }).map(
                  (_, index) =>
                    console.log(activeIndex, index) || (
                      <Dot key={index} isActive={activeIndex === index} />
                    )
                )}
              </DotsContainer>
            </SlidesWrapper>
            <ArrowButton
              icon="arrow"
              direction="right"
              onClick={this.handleNext}
              disabled={!canGoRight}
            />
          </Background>
        </FocusLock>
      </Context.Provider>
    );
  }
}

ModalCarousel.defaultProps = {
  canGoForward: true,
  canGoBack: true
};

export default ModalCarousel;

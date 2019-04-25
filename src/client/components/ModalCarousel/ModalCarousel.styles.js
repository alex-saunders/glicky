// @flow
import styled, { css } from 'styled-components';
import posed from 'react-pose';

import { type ThemeProps, type ThemedComponent } from '../../theme';

import IconButton from '../IconButton/IconButton';

const PosedBackground = posed.div({
  backgroundActive: {
    applyAtStart: { display: 'flex' },
    opacity: 1,
    transition: { ease: 'linear', duration: 100 }
  },
  backgroundInactive: {
    applyAtEnd: { display: 'none' },
    opacity: 0
  }
});

export const Background = styled(PosedBackground)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 4;
`;

type ArrowButtonProps = {
  direction: 'left' | 'right'
};
export const ArrowButton: ThemedComponent<ArrowButtonProps> = styled(
  IconButton
).attrs(() => ({
  icon: 'arrow'
}))`
  ${(p: ArrowButtonProps) =>
    css`
      transform: rotate(${p.direction === 'right' ? 90 : 270}deg);
    `}
`;

export const SlidesWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80vw;
  max-width: 640px;
  height: 75vh;
  max-height: 550px;
  margin: 0 ${(p: ThemeProps) => p.theme.sizing('md')};
`;

export const DotsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  bottom: 0;
`;

type DotProps = {
  isActive: boolean
};

export const Dot: ThemedComponent<DotProps> = styled.button`
  width: ${(p: ThemeProps) => p.theme.sizing('sm')};
  height: ${(p: ThemeProps) => p.theme.sizing('sm')};
  border-radius: 50%;
  margin: 0 ${(p: ThemeProps) => p.theme.sizing('xxs')};
  background: ${(p: ThemeProps & DotProps) =>
    p.theme.colour(p.isActive ? 'accent' : 'white')};
  transform: scale(${(p: DotProps) => (p.isActive ? 1.5 : 1)});
  opacity: scale(${(p: DotProps) => (p.isActive ? 1 : 0.7)});
  transition: all 0.1s ease-in-out;
`;

const inactivePose = {
  opacity: 0,
  scale: 0.8
};

const PosedSlide = posed.div({
  active: {
    opacity: 1,
    scale: 1,
    x: 0,
    delay: 150,
    applyAtStart: { display: 'flex', position: 'relative', zIndex: 1 }
  },
  inactive: {
    display: 'none',
    ...inactivePose
  },
  left: {
    x: -200,
    ...inactivePose,
    applyAtStart: { position: 'absolute', zIndex: -1 },
    applyAtEnd: { display: 'none' }
  },
  right: {
    x: 200,
    ...inactivePose,
    applyAtStart: { position: 'absolute' },
    applyAtEnd: { display: 'none' }
  }
});

export const StyledSlide = styled(PosedSlide)`
  max-height: calc(100% - 65px);
  overflow: auto;
`;

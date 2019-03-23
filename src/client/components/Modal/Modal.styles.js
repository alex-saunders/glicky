// @flow
import styled from 'styled-components';
import posed from 'react-pose';

import type { ThemeProps, ThemedComponent } from '~/theme';

const PosedBackground = posed.div({
  active: {
    applyAtStart: { display: 'flex' },
    opacity: 1,
    transition: { ease: 'linear', duration: 100 }
  },
  inactive: {
    applyAtEnd: { display: 'none' },
    opacity: 0
  }
});

export const Background = styled(PosedBackground)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 4;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
`;

const PosedWrapper = posed.div({
  active: {
    applyAtStart: {
      display: 'flex',
      transform: 'translateY(40px) scaleX(0.95)'
    },
    transform: 'translateY(0px) scaleX(1)',
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, delay: 100, damping: 20 }
  },
  inactive: {
    transform: 'translateY(40px) scaleX(0.95)',
    opacity: 0,
    applyAtEnd: {
      display: 'none'
    }
  }
});

export const Wrapper = styled(PosedWrapper)`
  flex-direction: column;
  width: 80vw;
  max-width: 640px;
  max-height: 50vh;
  background: ${(p: ThemeProps) => p.theme.colour('background_body')};
  border-radius: 4px;

  ${(p: ThemeProps) => p.theme.elevation('e3')};
`;

export const Header = styled.div`
  margin: ${(p: ThemeProps) => p.theme.sizing('md')};
`;

type BodyProps = {
  overflow?: string
};

export const Body: ThemedComponent<BodyProps> = styled.div`
  flex: 1;
  overflow: ${(p: BodyProps) => p.overflow || 'auto'};
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('md')};
  color: ${(p: ThemeProps) => p.theme.colour('text_secondary')};
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: ${(p: ThemeProps) => p.theme.sizing('md')};
`;

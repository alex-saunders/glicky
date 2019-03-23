// @flow
import styled, { keyframes } from 'styled-components';
import { lighten } from 'polished';

import type { ThemeProps } from '~/theme';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

export const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${(p: ThemeProps) => lighten(0.05, p.theme.colour('grey'))};
`;

export const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  animation: ${fadeIn} 0.2s 1;
`;

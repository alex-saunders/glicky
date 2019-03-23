// @flow
import styled, { keyframes } from 'styled-components';
import { lighten, darken } from 'polished';

import type { ThemeProps, ThemedComponent, Space } from '~/theme';

type Props = {
  width: Space | number,
  absoluteWidth: number
};

const shine = (props: Props) => keyframes`
  0% {
    background-position: -100px;
  }
  
  40%, 100% {
    background-position: ${props.absoluteWidth}px;
  }
`;

const SkeletonScreen: ThemedComponent<Props> = styled.div`
  width: ${(p: ThemeProps & Props) => p.theme.sizing(p.width)};
  height: ${(p: ThemeProps) => p.theme.sizing('sm')};
  border-radius: 999px;
  background: ${(p: ThemeProps) => p.theme.colour('grey')};

  background-image: ${(p: ThemeProps & Props) =>
    `linear-gradient(90deg, ${
      p.theme.mode === 'dark'
        ? darken(0.2, p.theme.colour('grey'))
        : p.theme.colour('grey')
    } 0px, ${
      p.theme.mode === 'dark'
        ? darken(0.1, p.theme.colour('grey'))
        : lighten(0.05, p.theme.colour('grey'))
    } 40px, ${
      p.theme.mode === 'dark'
        ? darken(0.2, p.theme.colour('grey'))
        : p.theme.colour('grey')
    } 80px)`};
  background-size: 600px;

  animation: ${(p: Props) => shine(p)} 1.6s infinite linear;
`;

SkeletonScreen.defaultProps = {
  /** Theme sizing value */
  width: 'md',
  /** Pixel value returned by theme sizing function (pixel width of the component) */
  absoluteWidth: 384
};

export default SkeletonScreen;

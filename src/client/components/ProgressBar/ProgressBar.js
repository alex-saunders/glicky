// @flow
import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';

import type { ThemedComponent, ThemeProps, ColourName } from '~/theme';
import { isColourName } from '~/theme/colours';

type Props = {
  indeterminate: boolean,
  /** Percentage number (0 - 100) */
  progress: number,
  bgColour: ColourName | string,
  barColour: ColourName | string
};

const Container = styled.div`
  background: ${(p: ThemeProps & Props) =>
    // $FlowFixMe
    isColourName(p.bgColour) ? p.theme.colour(p.bgColour) : p.bgColour};
    
  height: ${(p: ThemeProps) => p.theme.sizing(-1.5)};
  position: relative;
  overflow: hidden;
}
`;

const indeterminate = keyframes`
  0% {
    opacity: 0;
    left: -200%;
    right: 100%;
  }
  50% {
    opacity: 1;
  }
  90% {
    left: 107%;
    right: -20%;
  }
  100% {
    left: 107%;
    right: -20%;
    opacity: 0
  }
`;

const Bar: ThemedComponent<Props> = styled.div`
  background: ${(p: ThemeProps & Props) =>
    // $FlowFixMe
    isColourName(p.barColour) ? p.theme.colour(p.barColour) : p.barColour};
  opacity: 0.8;

  ${(p: Props) =>
    p.indeterminate
      ? css`
          width: auto;
          animation: ${indeterminate} 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.5)
            infinite;
          will-change: left, right;
          top: 0;
          left: 0;
          width: 100%;
          bottom: 0;
          position: absolute;
        `
      : css`
          position: relative;
          height: 100%;
          width: ${p.progress}%;
          /* transition: width 0.1s ease-in-out; */
        `};
`;

const ProgressBar = ({ bgColour, ...barProps }: Props) => (
  <Container bgColour={bgColour}>
    <Bar {...barProps} />
  </Container>
);

ProgressBar.defaultProps = {
  indeterminate: false,
  progress: 0,
  bgColour: 'primary_light',
  barColour: 'primary'
};

export default ProgressBar;

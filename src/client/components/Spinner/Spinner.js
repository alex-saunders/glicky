// @flow
import React from 'react';
import styled, { keyframes } from 'styled-components';

import type {
  Space,
  ColourName,
  ThemeProps,
  ThemedComponent
} from '../../theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

type Props = {
  size: Space,
  colour: ColourName,
  width: number
};

const SCSpinner: ThemedComponent<Props> = styled.div`
  display: inline-block;
  border: ${(p: Props) => `${p.width}px`} solid rgba(0, 0, 0, 0.1);
  border-left-color: ${(p: ThemeProps & Props) => p.theme.colour(p.colour)};
  border-radius: 50%;
  width: ${(p: ThemeProps & Props) => p.theme.sizing(p.size)};
  height: ${(p: ThemeProps & Props) => p.theme.sizing(p.size)};
  animation: ${spin} 1.2s linear infinite;
`;

const Spinner = ({ colour, size, width }: Props) => (
  <SCSpinner colour={colour} size={size} width={width} />
);

Spinner.defaultProps = {
  colour: 'primary',
  size: 'lg',
  width: 4
};

export default Spinner;

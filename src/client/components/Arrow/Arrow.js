// @flow
import * as React from 'react';
import styled, { css } from 'styled-components';

import type {
  ThemeProps,
  ThemeComponent,
  Space,
  ColourName
} from '../../../../theme';

type Props = {
  /** Width of arrow in REM */
  width: Space | number,
  colour?: ColourName
};

const StyledArrow: ThemeComponent<Props> = styled.span`
  ${({ width, theme }: Props & ThemeProps) =>
    width &&
    css`
      border-left: ${theme.sizing(width)} solid transparent;
    `};
  ${({ width, theme }: Props & ThemeProps) =>
    width &&
    css`
      border-right: ${theme.sizing(width)} solid transparent;
    `};
  ${({ width, colour, theme }: Props & ThemeProps) =>
    width &&
    css`
      border-top: ${theme.sizing(width)} solid ${theme.colour(colour)};
    `};
`;

const Arrow = ({ width = -1, colour = 'grey' }: Props) => {
  return <StyledArrow width={width} colour={colour} />;
};

export default Arrow;

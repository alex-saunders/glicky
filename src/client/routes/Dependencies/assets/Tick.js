// @flow
import React from 'react';
import styled from 'styled-components';

import type { Space, ThemeProps, ThemedComponent } from '../../../theme';

type Props = {
  size: Space
};

const Svg: ThemedComponent<Props> = styled.svg`
  width: ${(p: Props & ThemeProps) => p.theme.sizing(p.size)};
  height: ${(p: Props & ThemeProps) => p.theme.sizing(p.size)};
  color: ${(p: ThemeProps) => p.theme.colour('green')};
`;

const Tick = ({ size }: Props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" size={size}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="currentColor"
    />
  </Svg>
);

export default Tick;

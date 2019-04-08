// @flow
import React from 'react';
import styled from 'styled-components';

import type { ThemeProps } from '../../../theme';

const Svg = styled.svg`
  fill: ${(p: ThemeProps) => p.theme.colour('text')};
`;

const Chevron = (props: {}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </Svg>
);

export default Chevron;

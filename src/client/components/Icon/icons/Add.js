// @flow
import React from 'react';
import styled from 'styled-components';

import type { ThemeProps } from '../../../theme';

const Svg = styled.svg`
  fill: ${(p: ThemeProps) => p.theme.colour('text')};
`;

const Add = (props: {}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </Svg>
);

export default Add;

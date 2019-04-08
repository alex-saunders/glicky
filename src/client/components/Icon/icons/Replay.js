// @flow
import React from 'react';
import styled from 'styled-components';

import type { ThemeProps } from '../../../theme';

const Svg = styled.svg`
  fill: ${(p: ThemeProps) => p.theme.colour('text')};
`;

const Replay = (props: {}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </Svg>
);

export default Replay;

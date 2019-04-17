// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '../../theme';

import Text from './Text';

const StyledText = styled(Text)`
  text-transform: uppercase;
  margin: 0;
  /* we use padding instead of margin to play nice with reach routers 
  absolute positioning on transitions */
  padding: ${(p: ThemeProps) => p.theme.sizing('xxl')} 0
    ${(p: ThemeProps) => p.theme.sizing('xs')} 0;
`;

type Props = {
  children: Node | string
};
export const Title = ({ children, ...rest }: Props) => (
  <StyledText
    {...rest}
    tag="h2"
    colour="text_secondary"
    weight="black"
    size="sm1"
    uppercase
  >
    {children}
  </StyledText>
);

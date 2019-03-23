// @flow
import React, { type Node } from 'react';

import Text from './Text';

type Props = {
  children: Node | string
};
export const Subtitle = ({ children, ...rest }: Props) => (
  <Text
    {...rest}
    tag="h3"
    colour="text_secondary"
    weight="bold"
    size="sm2"
    spacing={'medium'}
  >
    {children}
  </Text>
);

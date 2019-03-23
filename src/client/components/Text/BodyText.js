// @flow
import React, { type Node } from 'react';

import Text from './Text';

type Props = {
  children: Node | string
};
export const BodyText = ({ children, ...rest }: Props) => (
  <Text size="sm2" spacing={'small'} {...rest}>
    {children}
  </Text>
);

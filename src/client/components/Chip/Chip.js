// @flow
import React, { type Node } from 'react';
import styled, { css } from 'styled-components';

import Text from '../Text/Text';

import type { ThemedComponent, ThemeProps, ColourName } from '../../theme';

type BaseProps = {
  bgColour: ColourName,
  borderColour?: ColourName,
  textColour: ColourName,
  uppercase: boolean,
  icon?: Node
};

const Base: ThemedComponent<Props> = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  align-items: center;
  padding: ${(p: ThemeProps & BaseProps) =>
    p.icon
      ? `${p.theme.sizing(-1.1)}
    ${p.theme.sizing(0.2)}
    ${p.theme.sizing(-1.1)}
    ${p.theme.sizing(-1.1)}`
      : p.theme.sizing('xxs')};

  background: ${(p: ThemeProps & Props) => p.theme.colour(p.bgColour)};

  border-radius: ${(p: ThemeProps) => p.theme.sizing('xxl')};
  ${(p: ThemeProps & Props) =>
    p.borderColour &&
    css`
      border: 1px solid ${p.theme.colour(p.borderColour)};
    `};
`;

const IconWrapper = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing(1.75)};
  height: ${(p: ThemeProps) => p.theme.sizing(1.75)};
  margin-right: ${(p: ThemeProps) => p.theme.sizing('xs')};
  border-radius: 50%;
`;

type Props = BaseProps & {
  children: string | Node,
  className?: string
};
const Chip = ({
  className,
  icon,
  bgColour,
  borderColour,
  textColour,
  uppercase,
  children
}: Props) => (
  <Base
    className={className}
    bgColour={bgColour}
    borderColour={borderColour}
    icon={icon}
  >
    {icon && <IconWrapper>{icon}</IconWrapper>}
    <Text colour={textColour} size="sm2" uppercase={uppercase}>
      {children}
    </Text>
  </Base>
);
Chip.defaultProps = {
  bgColour: 'primary',
  textColour: 'white',
  uppercase: true
};

export default Chip;

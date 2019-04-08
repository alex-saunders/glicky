// @flow
import React, { type Node } from 'react';
import styled, { css } from 'styled-components';
import Ink from 'react-ink';

import { type ThemeProps } from '../../theme';

import Text from '../Text/Text';
import Icon, { type IconType } from '../Icon/Icon';

const Button = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(p: ThemeProps) => css`
    padding: ${p.theme.sizing('xs')} ${p.theme.sizing('ms')}
      ${p.theme.sizing('xs')} ${p.theme.sizing('xs')};
  `};
  background: ${(p: ThemeProps) => p.theme.colour('primary')};
  border-radius: ${(p: ThemeProps) => p.theme.sizing('xxl')};
  ${(p: ThemeProps) => p.theme.elevation('e3')};

  transition: transform 0.1s linear;
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const IconWrapper = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  margin-right: ${(p: ThemeProps) => p.theme.sizing(-1)};

  > * {
    width: 100%;
    height: 100%;
  }
`;

type Props = {
  icon: IconType | Node,
  label: string
};

const FAB = ({ icon, label, ...rest }: Props) => {
  return (
    <Button {...rest}>
      <IconWrapper>
        {typeof icon === 'string' ? <Icon type={icon} /> : icon}
      </IconWrapper>
      <Text colour="white" size="sm1" uppercase spacing="medium">
        {label}
      </Text>
      <Ink />
    </Button>
  );
};

export default FAB;

// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import Ink from 'react-ink';

import type {
  ThemeProps,
  ThemedComponent,
  ColourName,
  Elevation
} from '~/theme';

import Text from '../../Text/Text';
import Icon, { type IconType } from '../../Icon/Icon';

type ThemeColourButtonTypes = 'primary' | 'secondary' | 'disabled' | 'error';
type ButtonType = ThemeColourButtonTypes | 'ghost';

type SCProps = {
  buttonType: ButtonType,
  elevation: Elevation,
  icon?: string
};

type Props = {
  type: ButtonType,
  elevation: Elevation,
  icon?: IconType | Node,
  submit?: boolean,
  children: string
};

const getButtonColour = (buttonType: ThemeColourButtonTypes): ColourName => {
  return buttonType === 'secondary'
    ? 'primary_dark'
    : buttonType === 'error'
    ? 'red'
    : buttonType === 'disabled'
    ? 'grey'
    : buttonType;
};

const getTextColour = (buttonType: ButtonType): ColourName => {
  return buttonType === 'primary'
    ? 'white'
    : buttonType === 'secondary'
    ? 'white'
    : buttonType === 'error'
    ? 'white'
    : buttonType === 'disabled'
    ? 'grey'
    : 'text';
};

const Base: ThemedComponent<SCProps> = styled.button`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  -webkit-appearance: none;
  border: none;
  background: ${(p: ThemeProps & SCProps) =>
    p.buttonType === 'ghost'
      ? 'transparent'
      : p.theme.colour(getButtonColour(p.buttonType))};
  padding: ${(p: ThemeProps & SCProps) =>
    p.icon ? p.theme.sizing('xxs') : p.theme.sizing('xs')};
  margin: 0;
  border-radius: 3px;

  ${(p: ThemeProps & SCProps) =>
    p.buttonType !== 'ghost' && p.theme.elevation(p.elevation)};
`;

const IconWrapper = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing(0.9)};
  height: ${(p: ThemeProps) => p.theme.sizing(0.9)};
  margin-right: ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  fill: ${(p: ThemeProps) => p.theme.colour('white')};
`;

const DefaultButton = ({
  children,
  type,
  icon,
  elevation,
  submit = false,
  ...rest
}: Props) => (
  <Base
    buttonType={type}
    type={submit ? 'submit' : 'button'}
    elevation={elevation}
    icon={icon}
    {...rest}
  >
    <Ink />
    {icon && (
      <IconWrapper>
        {typeof icon === 'string' ? <StyledIcon type={icon} /> : icon}
      </IconWrapper>
    )}
    <Text colour={getTextColour(type)} weight="normal" size="sm1">
      {' '}
      {children}
    </Text>
  </Base>
);

DefaultButton.defaultProps = {
  type: 'primary',
  elevation: 'e1'
};

export default DefaultButton;

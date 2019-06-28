// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';

import { withTheme } from '../../../context/ThemeContext';
import type {
  ThemeProps,
  ThemedComponent,
  ThemeMode,
  Elevation
} from '~/theme';

import Text from '../../Text/Text';
import Icon from '../../Icon/Icon';

import type { Props, ButtonType } from '../types';

type SCProps = {
  buttonType: ButtonType,
  elevation: Elevation,
  icon?: string
};

const ElevationDistance = 4;
const TranslateDistance = 6;

const transitonFunc = 'cubic-bezier(0.4, 0, 0.2, 1)';

const transition = css`
  transition: transform 0.2s ${transitonFunc}, opacity 0.3s ${transitonFunc};
`;

const getFillColour = ({ buttonType, theme }: SCProps & ThemeProps) => {
  if (buttonType === 'secondary') {
    return theme.colour('primary_dark');
  }
  if (buttonType === 'disabled') {
    return darken(0.3, theme.colour('grey'));
  }
  if (buttonType === 'error') {
    return theme.colour('red');
  }
  return theme.colour('primary');
};

const getElevationDistance = ({ buttonType }: SCProps) => {
  // half the 'elevation' if not primary
  return buttonType === 'primary' ? ElevationDistance : ElevationDistance / 2;
};

const getTextColour = (buttonType: ButtonType, mode: ThemeMode) => {
  if (mode === 'dark') {
    return buttonType === 'disabled' ? 'white' : 'black';
  }
  return 'black';
};

const triangle = css`
  display: block;
  content: '';
  position: absolute;
  width: 0px;
  height: 0px;
  border: ${getElevationDistance}px solid ${getFillColour};
  transform-origin: bottom right;
`;

const base = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: ${props => getElevationDistance(props) * 2}px;
  left: ${props => getElevationDistance(props) * 2}px;
`;

const Base = styled.div`
  ${base}
  background: ${getFillColour};
  z-index: -1;
  
  ${transition}

  /* bottom left */
  &:before {
    ${triangle}
    right: 100%;
    bottom: 0;
    border-bottom-color: transparent;
    border-left-color: transparent;
    ${transition}
  }

  /* top right */
  &:after {
    ${triangle}
    right: 0;
    bottom: 100%;
    border-top-color: transparent;
    border-right-color: transparent;
    ${transition}
  }
`;

const Face = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${(p: SCProps & ThemeProps) =>
    p.theme.sizing(p.buttonType === 'primary' ? 'sm' : 'xs')};
  border: 2px solid ${getFillColour};
  background: ${(p: ThemeProps & SCProps) =>
    p.buttonType !== 'disabled'
      ? p.theme.colour('white')
      : p.theme.colour('grey')};

  ${transition}
`;

const Shadow = styled.div`
  ${base}
  background: ${(p: ThemeProps) => p.theme.colour('grey')};
  z-index: -2;
  opacity: 0;
  ${transition}
`;

const Container: ThemedComponent<SCProps> = styled.button`
  position: relative;
  cursor: ${(p: SCProps) =>
    p.buttonType === 'disabled' ? 'not-allowed' : 'pointer'};

  ${(p: SCProps) =>
    p.buttonType === 'primary' &&
    css`
      &:hover,
      &:active {
        ${Face}, ${Base} {
          transform: translate(
            -${TranslateDistance}px,
            -${TranslateDistance}px
          );
        }
        ${Shadow} {
          opacity: 0.6;
        }
      }
    `}

  ${(p: SCProps) =>
    p.buttonType !== 'disabled' &&
    css`
      &:active {
        ${Face} {
          transform: translate(
            ${(p: SCProps) =>
              p.buttonType === 'primary'
                ? -TranslateDistance + getElevationDistance(p) * 2
                : getElevationDistance(p) * 2}px,
            ${(p: SCProps) =>
              p.buttonType === 'primary'
                ? -TranslateDistance + getElevationDistance(p) * 2
                : getElevationDistance(p) * 2}px
          );
        }
        ${Shadow} {
          opacity: 0.8;
        }
        ${Base} {
          &:before {
            transform: rotate(45deg);
          }
          &:after {
            transform: rotate(-45deg);
          }
        }
      }
    `}
`;

const IconWrapper = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing(0.9)};
  height: ${(p: ThemeProps) => p.theme.sizing(0.9)};
  margin-right: ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  fill: ${(p: ThemeProps) => p.theme.colour('black')};
`;

const SCText = styled(Text)`
  color: ${getTextColour};
`;

const RetroButton = ({
  children,
  type,
  icon,
  submit = false,
  theme,
  ...rest
}: Props) => {
  const scProps = {
    buttonType: type
  };

  return (
    <Container {...scProps} type={submit ? 'submit' : 'button'} {...rest}>
      <Face {...scProps}>
        {icon && (
          <IconWrapper>
            {typeof icon === 'string' ? <StyledIcon type={icon} /> : icon}
          </IconWrapper>
        )}
        <Text
          colour={getTextColour(type, theme.mode)}
          weight="normal"
          size="sm1"
          {...scProps}
        >
          {children}
        </Text>
      </Face>
      <Base {...scProps} />
      <Shadow {...scProps} />
    </Container>
  );
};

export default withTheme(RetroButton);

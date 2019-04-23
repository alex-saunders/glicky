// @flow
import React, { type Node } from 'react';
import styled, { css } from 'styled-components';
import Ink from 'react-ink';

import { type ThemeProps, type ThemedComponent } from '../../theme';
import { type Elevation } from '../../theme/elevation';

import Icon, { type IconType } from '../Icon/Icon';

type ButtonProps = {
  elevation: Elevation,
  disabled?: boolean
};
const Button: ThemedComponent<ButtonProps> = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  height: ${(p: ThemeProps) => p.theme.sizing('xl')};
  width: ${(p: ThemeProps) => p.theme.sizing('xl')};
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  border-radius: 50%;
  border: 1px solid transparent;
  overflow: hidden;

  ${(p: ThemeProps & ButtonProps) => p.theme.elevation(p.elevation)};
  opacity: ${(p: ButtonProps) => (p.disabled ? 0.5 : 1)};
  pointer-events: ${(p: ButtonProps) => (p.disabled ? 'none' : 'all')};

  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  -webkit-appearance: none;
  outline: 0;
  cursor: pointer;

  ${(p: ThemeProps & ButtonProps) =>
    p.elevation !== 'e0' &&
    css`
      &:hover {
        ${p.theme.elevation('e4')};
      }
      &:active {
        ${p.theme.elevation('e1')};
      }
    `} & > *:not(canvas) {
    pointer-events: none;
  }
`;

const StyledIcon = styled(Icon)`
  height: 50%;
  width: 50%;
`;

type Props = {
  /** Generic onClick event - passes `SyntheticMouseEvent<*>` */
  onClick?: (e: SyntheticMouseEvent<*>) => void,
  /** A link to an svg or a react element */
  icon: IconType | Node,
  /** Elevation property from theme */
  elevation: Elevation,
  disabled?: boolean
};

class IconButton extends React.Component<Props> {
  render() {
    const { onClick, icon, elevation, disabled, ...rest } = this.props;
    return (
      <Button
        onClick={!disabled ? onClick : null}
        disabled={disabled}
        {...rest}
        elevation={elevation}
      >
        <Ink radius={200} />
        {typeof icon === 'string' ? <StyledIcon type={icon} /> : icon}
      </Button>
    );
  }
}

// $FlowFixMe
IconButton.defaultProps = {
  elevation: 'e1'
};

export default IconButton;

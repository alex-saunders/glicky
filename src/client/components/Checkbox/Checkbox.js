// @flow
import React from 'react';
import styled, { css } from 'styled-components';

import { type ThemeProps, type ThemedComponent } from '../../theme';

import Check from './assets/check.svg';

const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

type InputProps = {
  withLabel: boolean
};
const Input: ThemedComponent<InputProps> = styled.input.attrs({
  type: 'checkbox'
})`
  position: relative;
  overflow: hidden;
  -webkit-appearance: none;
  outline: 0;
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  border-radius: 3px;
  background-color: ${(p: ThemeProps) => p.theme.colour('white')};
  border: 2px solid transparent;
  cursor: pointer;

  transition: background 0.1s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p: ThemeProps & InputProps) =>
    p.withLabel &&
    css`
      margin-right: ${(p: ThemeProps) => p.theme.sizing('sm')};
    `};

  &:before {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${Check});
    background-size: ${(p: ThemeProps) =>
      `${p.theme.sizing('sm')} ${p.theme.sizing('sm')}`};
    background-position: 50%;
    background-repeat: no-repeat;
    border: 1px solid ${(p: ThemeProps) => p.theme.colour('grey')};

    transition: border 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  &:after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: ${(p: ThemeProps) => p.theme.colour('primary')};
    width: ${(p: ThemeProps) => p.theme.sizing('sm')};
    height: ${(p: ThemeProps) => p.theme.sizing('sm')};

    background-color: ${(p: ThemeProps) => p.theme.colour('white')};

    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover,
  &:checked {
    border-color: ${(p: ThemeProps) => p.theme.colour('primary')};

    &:before {
      border-color: transparent;
    }
  }

  &:checked {
    background-color: ${(p: ThemeProps) => p.theme.colour('primary')};

    &:after {
      background-color: ${(p: ThemeProps) => p.theme.colour('primary')};
      transform: translateX(100%);
    }
  }
`;

type Props = {
  checked?: boolean,
  label: ?string,
  onChange: boolean => void
};

class Checkbox extends React.Component<Props, *> {
  static defaultProps = {
    onChange: () => {},
    label: null
  };

  handleChange = (e: SyntheticInputEvent<*>) => {
    this.props.onChange(e.target.checked);
  };

  render() {
    const { checked, label } = this.props;
    return (
      <Label>
        <Input
          checked={checked}
          onChange={this.handleChange}
          withLabel={label !== null}
        />
        {label}
      </Label>
    );
  }
}

export default Checkbox;

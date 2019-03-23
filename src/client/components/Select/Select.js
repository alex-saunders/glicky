// @flow
import React, { Component, type Node } from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '../../theme';

import Chevron from './assets/chevron.svg';

const StyledSelect = styled.select`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: none;
  background: none;
  font-size: 0;
`;

const SelectedValue = styled.span`
  text-align: left;
  margin-right: ${({ theme }: ThemeProps) => theme.sizing('xxs')};
`;

const SelectWrapper = styled.div`
  border: 1px solid ${(p: ThemeProps) => p.theme.colour('grey')};
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background: ${({ theme }: ThemeProps) => theme.colour('white')};
  padding: ${({ theme }: ThemeProps) => theme.sizing('xxs')}
    ${({ theme }: ThemeProps) => theme.sizing('xs')};
  color: ${({ theme }: ThemeProps) => theme.colour('text_secondary')};
`;

const ChevronImg = styled.img`
  width: ${(p: ThemeProps) => p.theme.sizing('ms')};
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

type Option = {
  value: string,
  label: string
};

type Props = {
  disabled?: boolean,
  value: string,
  options: Array<Option>,
  onChange: (event: SyntheticInputEvent<EventTarget>) => void,
  className?: string
};

class Select extends Component<Props> {
  static defaultProps = {
    disabled: false,
    hideLabel: false
  };

  renderOptions = () => {
    const { options } = this.props;

    return options.map<Node>(option => {
      const op = (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
      return op;
    });
  };

  renderSelectedValue = () => {
    const { options, value } = this.props;

    const selectedValue = options.find(option => option.value === value);
    return (
      selectedValue && <SelectedValue>{selectedValue.label}</SelectedValue>
    );
  };

  render() {
    const { value, onChange, disabled, className, ...rest } = this.props;
    const options = this.renderOptions();

    return (
      <SelectWrapper className={className}>
        <StyledSelect
          {...rest}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {options}
        </StyledSelect>
        {this.renderSelectedValue()}
        <ChevronImg src={Chevron} />
      </SelectWrapper>
    );
  }
}

export default Select;

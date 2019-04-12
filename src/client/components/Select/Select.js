// @flow
// eslint-disable-next-line
import React, { Component, type Node } from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '../../theme';

import Icon from '../Icon/Icon';

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
  border: 1px solid ${(p: ThemeProps) => p.theme.colour('border')};
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background: ${({ theme }: ThemeProps) => theme.colour('background_panel')};
  padding: ${({ theme }: ThemeProps) => theme.sizing('xxs')}
    ${({ theme }: ThemeProps) => theme.sizing('xs')};
  color: ${({ theme }: ThemeProps) => theme.colour('text')};
`;

const StyledIcon = styled(Icon)`
  width: ${(p: ThemeProps) => p.theme.sizing('ms')};
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

type Option<Key> = {
  value: Key,
  label: string
};

type Props<Key> = {
  disabled?: boolean,
  value: string,
  options: Array<Option<Key>>,
  onChange: (event: Key) => void,
  className?: string
};

class Select<Key> extends Component<Props<Key>> {
  static defaultProps = {
    disabled: false,
    hideLabel: false
  };

  renderOptions = () => {
    const { options } = this.props;

    return options.map<Node>(option => {
      const op = (
        <option key={String(option.value)} value={option.value}>
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
          onChange={e => this.props.onChange(e.target.value)}
          disabled={disabled}
        >
          {options}
        </StyledSelect>
        {this.renderSelectedValue()}
        <StyledIcon type="chevron" />
      </SelectWrapper>
    );
  }
}

export default Select;

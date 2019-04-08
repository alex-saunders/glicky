// @flow
import * as React from 'react';
import styled, { css } from 'styled-components';

import type { ThemeProps, ThemedComponent } from '~/theme';

import Icon from '../Icon/Icon';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 100%;
  background: ${(p: ThemeProps) => p.theme.colour('primary_dark')};
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
`;

type IconWrapperProps = {
  disabled?: boolean
};
const IconWrapper: ThemedComponent<IconWrapperProps> = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('xs')};

  ${(p: IconWrapper) =>
    p.disabled !== null &&
    css`
      opacity: ${p.disabled ? 0 : 1};
      pointer-events: ${p.disabled ? 'none' : 'all'};
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    `};
`;

const iconStyles = css`
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
`;

type SearchIconprops = {
  focused: boolean
};
const Search: ThemedComponent<SearchIconprops> = styled(Icon).attrs({
  type: 'search'
})`
  ${iconStyles};

  opacity: ${(p: SearchIconprops) => (p.focused ? 1 : 0.5)};
  transition: opacity 0.2s linear;
`;
const Clear = styled(Icon).attrs({
  type: 'clear'
})`
  ${iconStyles};

  padding: ${(p: ThemeProps) => p.theme.sizing(-2)};
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
`;
const Input = styled.input`
  height: 100%;
  width: 100%;
  ${(p: ThemeProps) => p.theme.font('sm1')};
  color: ${(p: ThemeProps) => p.theme.colour('primary_text')};
`;

type LabelProps = {
  disabled: boolean
};
const Label: ThemedComponent<LabelProps> = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 2px;
  opacity: 0.7;
  color: ${(p: ThemeProps) => p.theme.colour('primary_text')};
  ${(p: ThemeProps) => p.theme.font('sm1')};

  visibility: ${(p: LabelProps) => (p.disabled ? 'hidden' : 'visible')};
  pointer-events: none;
`;

type Props = {
  label: string,
  value: string,
  /** Recieves input value as only parameter */
  onChange: string => void
};

type State = {
  focused: boolean
};

class SearchBar extends React.Component<Props, State> {
  static defaultProps = {};

  state = {
    focused: false
  };

  input = React.createRef<HTMLElement>();

  handleChange = (e: SyntheticInputEvent<*>) => {
    const { value } = e.target;
    this.props.onChange(value);
  };

  handleClearClick = () => {
    this.props.onChange('');
    this.focusInput();
  };

  handleFocus = () => {
    this.setState({
      focused: true
    });
  };

  handleBlur = () => {
    this.setState({
      focused: false
    });
  };

  focusInput = () => {
    const { current: input } = this.input;
    if (input) {
      input.focus();
    }
  };

  render() {
    const { focused } = this.state;
    const { value } = this.props;

    return (
      <Container>
        <IconWrapper onClick={this.focusInput}>
          <Search focused={focused} />
        </IconWrapper>
        <InputWrapper>
          <Input
            onChange={this.handleChange}
            value={value}
            ref={this.input}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <Label disabled={value.length > 0}>{this.props.label}</Label>
        </InputWrapper>
        <IconWrapper
          disabled={value.length < 1}
          onClick={this.handleClearClick}
        >
          <Clear />
        </IconWrapper>
      </Container>
    );
  }
}

export default SearchBar;

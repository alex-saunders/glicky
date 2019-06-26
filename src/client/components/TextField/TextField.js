// @flow
import React, { Component, type Node } from 'react';
import styled, { css } from 'styled-components';
import posed from 'react-pose';

import type { ThemedComponent, ThemeProps } from '../../theme';

import Icon, { type IconType } from '../Icon/Icon';

type WrapperProps = {
  fullWidth: boolean,
  disabled?: boolean,
  value: string
};

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  padding: ${(p: ThemeProps) => p.theme.sizing('xs')} 0 0 0;
  margin-bottom: ${(p: ThemeProps) => p.theme.sizing('md')};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p: WrapperProps) =>
    p.fullWidth &&
    css`
      width: 100%;
    `};

  ${(p: WrapperProps) =>
    p.disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      ${p.value !== '' &&
        css`
          background: ${(p: ThemeProps) => p.theme.colour('grey')};
        `}
    `}
`;

type InputWrapperProps = {
  focused: boolean,
  error: boolean,
  disabled?: boolean,
  value: string
};

const HoverBorder = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid ${(p: ThemeProps) => p.theme.colour('text')};
  opacity: 0.42;
`;

const ActiveBorder: ThemedComponent<InputWrapperProps> = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 2px solid
    ${(p: ThemeProps & InputWrapperProps) =>
      p.theme.colour(
        p.disabled
          ? 'black'
          : p.error
          ? 'red'
          : p.theme.mode === 'dark'
          ? 'white'
          : 'primary'
      )};

  transform: scaleX(
    ${(p: InputWrapperProps) => (p.focused || p.error ? 1 : 0)}
  );
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const InputWrapper: ThemedComponent<InputWrapperProps> = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    ${(p: InputWrapperProps) =>
      !p.focused &&
      !p.disabled &&
      css`
        ${HoverBorder} {
          border-bottom: 2px solid ${(p: ThemeProps) => p.theme.colour('text')};
        }
      `};
  }

  ${(p: InputWrapperProps) =>
    p.disabled &&
    p.value === '' &&
    css`
      background: ${(p: ThemeProps) => p.theme.colour('grey')};
    `};
`;

type LabelProps = InputWrapperProps & {
  multiline: boolean,
  disabled?: boolean
};
const Label: ThemedComponent<LabelProps> = styled.label`
  position: absolute;
  z-index: 2;
  align-self: ${(p: LabelProps) => (p.multiline ? 'flex-start' : 'center')};
  color: ${(p: ThemeProps & LabelProps) =>
    p.theme.colour(
      p.disabled
        ? 'black'
        : p.error
        ? 'red'
        : p.focused
        ? p.theme.mode === 'dark'
          ? 'text'
          : 'primary'
        : 'text_secondary'
    )};
  opacity: 0.8;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top left;

  ${(p: LabelProps) =>
    (p.focused || p.error) &&
    css`
      transform: translate(0, -18px) scale(0.75);
    `};

  ${(p: LabelProps & ThemeProps) =>
    p.multiline &&
    css`
      margin-top: ${p.theme.sizing('xxs')};
    `};
`;

type InputProps = {
  font?: string
};

const Base = css`
  flex: 1;
  -webkit-appearance: none;
  border: none;
  resize: none;
  position: relative;
  width: 100%;
  z-index: 2;
  margin: ${(p: ThemeProps) => p.theme.sizing('xxs')} 0;
  color: ${(p: ThemeProps) => p.theme.colour('text')};

  ${(p: ThemeProps & InputProps) =>
    p.font &&
    css`
      font-family: ${p.font};
    `};
`;

const Input: ThemedComponent<InputProps> = styled.input.attrs({
  type: 'text'
})`
  ${Base};
`;

type TextAreaProps = {
  rows: number
};
const TextArea: ThemedComponent<TextArea & InputProps> = styled.textarea`
  ${Base};
  outline: 0;
  padding: 0;
  background: none;
  /* num rows * line height value to stop text getting half cut off when more than 3 lines
  (a bit nasty) */
  height: ${(p: TextAreaProps) => `${p.rows * 18.4}px`};
`;

const IconWrapper = styled.div`
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

const StyledIcon = styled(Icon)`
  width: ${(p: ThemeProps) => p.theme.sizing('ms')};
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

const ErrorTextContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  overflow: hidden;
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

const PosedErrorText = posed.span({
  errorTextIn: {
    y: 0,
    opacity: 1
  },
  errorTextOut: {
    y: -20,
    opacity: 0
  }
});

const ErrorText = styled(PosedErrorText)`
  display: block;
  color: ${(p: ThemeProps) => p.theme.colour('red')};
  ${(p: ThemeProps) => p.theme.font('sm2')};
`;

type Props = {
  multiline: boolean,
  rows: number,
  label: string,
  value?: string,
  onChange?: string => void,
  fullWidth: boolean,
  innerRef?: HTMLElement => void,
  font?: string,
  error?: boolean,
  errorText?: string,
  disabled?: boolean,
  icon?: IconType | Node
};

type State = {
  value: string,
  focused: boolean
};

class TextField extends Component<Props, State> {
  static defaultProps = {
    multiline: false,
    rows: 3,
    fullWidth: false
  };

  state = {
    value: this.props.value || '',
    focused: !!this.props.value
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      value: props.value !== undefined ? props.value : state.value
    };
  }

  handleChange = (e: SyntheticKeyboardEvent<*>) => {
    // $FlowFixMe
    const { value } = e.target;
    this.props.onChange && this.props.onChange(value);

    this.setState({
      value
    });
  };

  handleFocus = () => {
    this.setState({
      focused: true
    });
  };

  handleBlur = () => {
    this.setState({
      focused: this.state.value !== '' ? true : false
    });
  };

  render() {
    const inputProps = {
      onChange: this.handleChange,
      value: this.state.value
    };

    const {
      fullWidth,
      multiline,
      error = false,
      errorText,
      onChange,
      disabled,
      innerRef,
      ...rest
    } = this.props;
    const errorTextPose =
      error && errorText && errorText !== '' ? 'errorTextIn' : 'errorTextOut';

    return (
      <Wrapper
        fullWidth={fullWidth}
        {...rest}
        disabled={disabled}
        value={this.state.value}
      >
        <Label
          focused={this.state.focused}
          multiline={multiline}
          error={error}
          disabled={disabled}
        >
          {this.props.label}
        </Label>

        <InputWrapper
          focused={this.state.focused}
          error={error}
          disabled={disabled}
          value={this.state.value}
        >
          <HoverBorder />
          {multiline ? (
            <TextArea
              {...inputProps}
              {...innerRef && { ref: innerRef }}
              rows={this.props.rows}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              font={this.props.font}
              tabIndex={disabled ? -1 : 0}
            />
          ) : (
            <Input
              {...inputProps}
              {...innerRef && { ref: innerRef }}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              font={this.props.font}
              tabIndex={disabled ? -1 : 0}
            />
          )}
          {this.props.icon && (
            <IconWrapper>
              {typeof this.props.icon === 'string' ? (
                <StyledIcon type={this.props.icon} />
              ) : (
                this.props.icon
              )}
            </IconWrapper>
          )}
          <ActiveBorder focused={this.state.focused} error={error} />
        </InputWrapper>

        <ErrorTextContainer>
          <ErrorText pose={errorTextPose}>{errorText}</ErrorText>
        </ErrorTextContainer>
      </Wrapper>
    );
  }
}

// $FlowFixMe
const ForwardedTextField = React.forwardRef((props, ref) => (
  <TextField innerRef={ref} {...props} />
));
ForwardedTextField.displayName = 'TextField';
export default ForwardedTextField;

// @flow
import React, { Component } from 'react';
import Ink from 'react-ink';

import {
  Label,
  Input,
  Bar,
  SwitchWrapper,
  ButtonContainer,
  Button,
  ButtonIcon,
  StyledText
} from './Toggle.styles';

export type Props = {
  selected?: boolean,
  alignText: 'right' | 'left',
  label?: string,
  onChange: boolean => void
};

type State = {
  selected: boolean
};

class Toggle extends Component<Props, State> {
  static defaultProps = {
    alignText: 'right',
    onChange: () => {}
  };

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (
      nextProps.selected !== null &&
      nextProps.selected !== undefined &&
      nextProps.selected !== state.selected
    ) {
      return {
        selected: nextProps.selected
      };
    }
    return {};
  }

  state = {
    selected: this.props.selected || false
  };

  handleChange = (e: SyntheticInputEvent<EventTarget>) => {
    if (this.props.selected !== null && this.props.selected !== undefined) {
      return this.props.onChange(e.target.checked);
    }
    this.setState({
      selected: e.target.checked
    });
  };

  render() {
    const { selected } = this.state;
    const { alignText, label } = this.props;

    const text = <StyledText alignText={alignText}>{label}</StyledText>;

    return (
      <Label>
        <Input
          type="checkbox"
          checked={selected}
          onChange={this.handleChange}
        />

        {alignText === 'left' && text}
        <SwitchWrapper>
          <Bar selected={selected} alignText={alignText} />

          <ButtonContainer selected={selected}>
            <Button selected={selected}>
              <Ink />
              <ButtonIcon selected={selected} />
            </Button>
          </ButtonContainer>
        </SwitchWrapper>
        {alignText === 'right' && text}
      </Label>
    );
  }
}

export default Toggle;

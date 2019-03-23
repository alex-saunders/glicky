// @flow
import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import Ink from 'react-ink';

import { type ThemeProps, type ThemedComponent } from '~/theme';

import { Text } from '~/components';

import type { DependencySuggestion } from '../../../../../types';

const Container = styled.div`
  position: relative;
  top: -${(p: ThemeProps) => p.theme.sizing('md')};
`;

type BoxProps = {
  max: number
};

const Box: ThemedComponent<BoxProps> = styled.div`
  position: absolute;
  width: 100%;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  max-height: calc(
    ${(p: ThemeProps & BoxProps) => `${p.theme.sizing(2.3)} * ${p.max}`}
  );
  overflow: auto;
`;

const Suggestion = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  text-align: left;
  width: 100%;

  background: none;
  height: ${(p: ThemeProps) => p.theme.sizing(2.3)};
  padding: ${(p: ThemeProps) => p.theme.sizing('xxs')}
    ${(p: ThemeProps) => p.theme.sizing('sm')} 0;

  em {
    font-style: normal;
    font-weight: ${(p: ThemeProps) => p.theme.fontWeight('bold')};
  }
`;

const Description = styled.div`
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

type Props = {
  suggestions: Array<DependencySuggestion>,
  max: number,
  onClickOutside?: (e: SyntheticEvent<EventTarget>) => void,
  onSelect: DependencySuggestion => void
};

type State = {};

class SearchSuggestions extends Component<Props, State> {
  static defaultProps = {
    max: 1
  };

  state = {};

  container = createRef();

  componentDidMount() {
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick);
  }

  handleClick = (e: SyntheticEvent<EventTarget>) => {
    const container = this.container.current;

    if (!container) {
      return;
    }

    if (!container.contains(e.target)) {
      this.props.onClickOutside && this.props.onClickOutside(e);
    }
  };

  render() {
    return (
      <Container ref={this.container}>
        <Box max={this.props.max}>
          {this.props.suggestions.map(suggestion => (
            <Suggestion
              key={suggestion.package.name}
              onClick={this.props.onSelect.bind(null, suggestion)}
            >
              <Ink />
              <span>
                <Text
                  colour="text"
                  dangerouslySetInnerHTML={{
                    __html: `${suggestion.highlight}`
                  }}
                >
                  {}
                </Text>{' '}
                <Text colour="text_secondary" size="sm1">{` @${
                  suggestion.package.version
                } - latest`}</Text>
              </span>
              <Description>
                <Text colour="text_secondary" size="sm2">
                  {suggestion.package.description}
                </Text>
              </Description>
            </Suggestion>
          ))}
        </Box>
      </Container>
    );
  }
}

export default SearchSuggestions;

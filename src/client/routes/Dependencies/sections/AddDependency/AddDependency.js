// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import Reward from 'react-rewards';

import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import { FAB, Modal, TextField, Spacing, Select, Spinner } from '~/components';

import type {
  DependencySuggestion,
  DependencyType
} from '../../../../../types';

import Add from '../../assets/add.svg';
import Tick from '../../assets/Tick';

import SearchSuggestions from './SearchSuggestions';

const FABHolder = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 2;
`;

const RewardHolder = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
`;

type Props = SocketContextProps;

type State = {
  modalIsActive: boolean,
  dependencyType: DependencyType,
  searchValue: string,
  searchSuggestions: Array<DependencySuggestion>,
  isFocused: boolean,
  isDisabled: boolean,
  hasAddedDependency: boolean
};

class AddDependency extends Component<Props, State> {
  static defaultProps = {};

  state = {
    modalIsActive: false,
    dependencyType: 'dependency',
    searchValue: '',
    searchSuggestions: [],
    isFocused: false,
    isDisabled: false,
    hasAddedDependency: false
  };

  textField = React.createRef();
  reward: { current: null | Reward } = React.createRef();

  constructor(props: Props) {
    super(props);

    this.getSearchSuggestions = debounce(this.getSearchSuggestions, 100);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.getSearchSuggestions(this.state.searchValue);
    }
  }

  handleFabClick = () => {
    this.setState(
      {
        modalIsActive: true,
        dependencyType: 'dependency',
        searchValue: '',
        isDisabled: false,
        hasAddedDependency: false
      },
      () => {
        const textFieldContainer = this.textField.current;
        if (!textFieldContainer) {
          return;
        }

        const textField = textFieldContainer.querySelector('input');
        if (!textField) {
          return;
        }

        setTimeout(() => {
          textField.focus();
        }, 100);
      }
    );
  };

  handleModalRequestClose = () => {
    this.setState({
      modalIsActive: false,
      searchSuggestions: []
    });
  };

  handleSelectChange = (dependencyType: DependencyType) => {
    this.setState({
      dependencyType
    });
  };

  handleInputChange = (value: string) => {
    this.setState({
      searchValue: value
    });
  };

  handleInputFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  handleClickOutsideSuggestions = (e: SyntheticEvent<EventTarget>) => {
    const textField = this.textField.current;
    if (!textField) {
      return;
    }

    if (!textField.contains(e.target)) {
      this.setState({
        isFocused: false
      });
    }
  };

  handleSuggestionClick = (suggestion: DependencySuggestion) => {
    this.setState(
      {
        isFocused: false,
        isDisabled: true,
        searchValue: suggestion.package.name
      },
      () => {
        const { socket } = this.props;

        socket.emit(
          'request',
          {
            resource: 'add-dependency',
            dependencyName: suggestion.package.name,
            dependencyType: this.state.dependencyType
          },
          result => {
            if (!result.error) {
              this.setState(
                {
                  hasAddedDependency: true
                },
                () => {
                  const reward = this.reward.current;
                  if (!reward) {
                    return;
                  }

                  reward.rewardMe();
                  setTimeout(() => {
                    this.handleModalRequestClose();
                  }, 2000);
                }
              );
            }
          }
        );
      }
    );
  };

  getSearchSuggestions = async (searchValue: string) => {
    if (!searchValue || searchValue === '') {
      return this.setState({
        searchSuggestions: []
      });
    }

    const encodedQuery = encodeURI(searchValue.split(' ').join('+'));
    fetch(`https://api.npms.io/v2/search/suggestions?size=10&q=${encodedQuery}`)
      .then(res => res.json())
      .then(json => {
        if (searchValue === this.state.searchValue) {
          this.setState({
            searchSuggestions: json.map(suggestion => ({
              package: {
                ...suggestion.package
              },
              score: suggestion.searchScore,
              highlight: suggestion.highlight
            }))
          });
        }
      });
  };

  render() {
    return (
      <FABHolder>
        <FAB
          icon={<img src={Add} />}
          label="Add Dependency"
          onClick={this.handleFabClick}
        />

        <Modal
          isActive={this.state.modalIsActive}
          onRequestClose={this.handleModalRequestClose}
          title="Add dependency"
          overflow="visible"
          renderBody={() => (
            <Fragment>
              <RewardHolder />
              <Select
                options={[
                  {
                    value: 'dependency',
                    label: 'Dependency'
                  },
                  {
                    value: 'devDependency',
                    label: 'Dev Dependency'
                  },
                  {
                    value: 'optionalDependency',
                    label: 'Optional Dependency'
                  }
                ]}
                onChange={this.handleSelectChange}
                value={this.state.dependencyType}
                disabled={this.state.isDisabled}
              />
              <Spacing top="xs" />
              <TextField
                label="Dependency Name"
                fullWidth
                value={this.state.searchValue}
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
                ref={this.textField}
                disabled={this.state.isDisabled}
                icon={
                  this.state.isDisabled ? (
                    this.state.hasAddedDependency ? (
                      <Reward
                        ref={this.reward}
                        type="confetti"
                        config={{
                          spread: 185,
                          startVelocity: 25
                        }}
                      >
                        <Tick size="md" />
                      </Reward>
                    ) : (
                      <Spinner size="md" width={3} />
                    )
                  ) : null
                }
              />
              {this.state.searchSuggestions.length > 0 &&
                this.state.isFocused && (
                  <SearchSuggestions
                    suggestions={this.state.searchSuggestions}
                    max={4}
                    onClickOutside={this.handleClickOutsideSuggestions}
                    onSelect={this.handleSuggestionClick}
                  />
                )}
              <Spacing top="lg" />
            </Fragment>
          )}
        />
      </FABHolder>
    );
  }
}

export default withSocketContext(AddDependency);

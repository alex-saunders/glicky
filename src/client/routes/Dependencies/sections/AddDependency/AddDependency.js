// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import Reward from 'react-rewards';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, PoweredBy } from 'react-instantsearch-dom';

import {
  withDependencies,
  type DependenciesContextProps
} from '~/context/DependenciesContext';
import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import { FAB, Modal, Spacing, Select, Spinner, Icon } from '~/components';

import { type ThemeProps } from '~/theme';

import type {
  DependencySuggestion,
  DependencyType
} from '../../../../../types';

import SearchBox from './SearchBox';
import SearchSuggestions from './SearchSuggestions';

import './AddDependency.scss';

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

const StyledCheck = styled(Icon).attrs({
  type: 'check'
})`
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  fill: ${(p: ThemeProps) =>
    p.theme.colour(p.theme.mode === 'dark' ? 'white' : 'green')};
`;

const StyledAdd = styled(Icon).attrs({
  type: 'add'
})`
  fill: ${(p: ThemeProps) => p.theme.colour('white')};
`;

const AlgoliaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const searchClient = algoliasearch(
  'OFCNCOG2CU',
  '86ebd6a34c7fbb7988d5ba5c75d5da34'
);

type Props = DependenciesContextProps & ThemeContextProps;

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
    dependencyType: 'dependencies',
    searchValue: '',
    searchSuggestions: [],
    isFocused: false,
    isDisabled: false,
    hasAddedDependency: false
  };

  searchArea = React.createRef();
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
    this.setState({
      modalIsActive: true,
      dependencyType: 'dependencies',
      searchValue: '',
      isDisabled: false,
      hasAddedDependency: false
    });
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
    const searchArea = this.searchArea.current;
    if (!searchArea) {
      return;
    }

    if (!searchArea.contains(e.target)) {
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
        searchValue: suggestion.name
      },
      () => {
        this.props
          .addDependency(suggestion.name, this.state.dependencyType)
          .then(() => {
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
          })
          .catch(() => {
            // handle error case
          });
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
          icon={<StyledAdd />}
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
                    value: 'dependencies',
                    label: 'Dependency'
                  },
                  {
                    value: 'devDependencies',
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
              <div ref={this.searchArea}>
                <InstantSearch
                  searchClient={searchClient}
                  indexName="npm-search"
                >
                  <SearchBox
                    onFocus={this.handleInputFocus}
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
                            <StyledCheck />
                          </Reward>
                        ) : (
                          <Spinner size="md" lineWidth={3} />
                        )
                      ) : null
                    }
                  />
                  {this.state.isFocused && (
                    <SearchSuggestions
                      onClickOutside={this.handleClickOutsideSuggestions}
                      onSelect={this.handleSuggestionClick}
                      max={4}
                    />
                  )}
                  <AlgoliaWrapper>
                    <PoweredBy
                      className={
                        this.props.theme.mode === 'dark' &&
                        'ais-PoweredBy--dark'
                      }
                    />
                  </AlgoliaWrapper>
                </InstantSearch>
              </div>
              {/* <TextField
                label="Dependency Name"
                fullWidth
                value={this.state.searchValue}
                onChange={this.handleInputChange}
                
              />
              {this.state.searchSuggestions.length > 0 &&
                this.state.isFocused && (
                  <SearchSuggestions
                    suggestions={this.state.searchSuggestions}
                    
                    
                  />
                )} */}
              <Spacing top="lg" />
            </Fragment>
          )}
        />
      </FABHolder>
    );
  }
}

export default withDependencies(withTheme(AddDependency));

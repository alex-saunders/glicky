// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

import { withSearch, type SearchContextProps } from '~/context/SearchContext';
import {
  withDependencies,
  type DependenciesContextProps
} from '~/context/DependenciesContext';

import { type ThemeProps } from '~/theme';

import { Title } from '~/components';

import DependenciesList from './sections/DependenciesList';

const DependenciesListContainer = posed.div({
  dependenciesLoaded: {
    opacity: 1,
    transition: { ease: 'linear', duration: 300 }
  },
  dependenciesLoading: { opacity: 0 }
});

const PanelWrapper = styled.div`
  margin: ${(p: ThemeProps) => p.theme.sizing('md')} 0;
`;

type Props = SearchContextProps & DependenciesContextProps;

class Dependencies extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.updateSearchLabel('Search dependencies');

    if (this.props.dependencies.length < 1) {
      setTimeout(() => {
        this.props.fetchDependencies();
      }, 1500);
    }
  }

  filterDependencies() {
    const { searchTerm } = this.props;

    const filteredDependencies = this.props.dependencies.filter(dependency =>
      dependency.name.match(searchTerm)
    );

    return filteredDependencies;
  }

  render() {
    const { dependencies } = this.props;
    return (
      <Fragment>
        <Title>Dependencies</Title>

        <PanelWrapper>
          <DependenciesListContainer
            withParent={false}
            pose={
              dependencies.length > 0
                ? 'dependenciesLoaded'
                : 'dependenciesLoading'
            }
          >
            {dependencies.length > 0 && (
              <DependenciesList
                filteredDependencies={this.filterDependencies()}
              />
            )}
          </DependenciesListContainer>
        </PanelWrapper>
      </Fragment>
    );
  }
}

export default withDependencies(withSearch(Dependencies));

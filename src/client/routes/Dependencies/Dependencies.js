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

import { Title, Spacing, SkeletonScreen } from '~/components';

import DependenciesList from './sections/DependenciesList';
import AddDependency from './sections/AddDependency';

const Section = posed.div({
  routeEnter: { x: 0, opacity: 1, delay: 300 },
  routeExit: { x: 50, opacity: 0 }
});

const Content = posed.div({
  dependenciesEnter: {
    opacity: 1,
    transition: { ease: 'linear', duration: 300 }
  },
  dependenciesExit: { opacity: 0 }
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
    return (
      <Fragment>
        <AddDependency />
        <Section>
          <Title>Dependencies</Title>

          <PanelWrapper>
            {this.props.dependencies.length > 0 ? (
              <DependenciesList
                filteredDependencies={this.filterDependencies()}
              />
            ) : (
              <Fragment>
                <SkeletonScreen width={5.4} absoluteWidth={510} />
                <Spacing top="xs" />
                <SkeletonScreen width={5} absoluteWidth={390} />
                <Spacing top="xs" />
                <SkeletonScreen width={5.2} absoluteWidth={450} />

                <Spacing top="xxl" />

                <SkeletonScreen width={5} absoluteWidth={384} />
                <Spacing top="xs" />
                <SkeletonScreen width={4.5} absoluteWidth={271} />
              </Fragment>
            )}
          </PanelWrapper>
        </Section>
      </Fragment>
    );
  }
}

export default withDependencies(withSearch(Dependencies));

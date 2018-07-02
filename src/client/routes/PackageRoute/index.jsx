import React, { Component } from 'react';
import styled from 'styled-components';

import DependenciesView from '../../views/DependenciesView';
import ScriptsView from '../../views/ScriptsView';

import media from '../../util/media';

const Grid = styled.div`
  display: grid;

  ${media.desktop`
    grid-template-columns: 50% 50%;
    grid-template-areas: 'dependencies scripts';
  `};

  ${media.tablet`
    grid-template-columns: 1fr;
    grid-template-areas: 
    "dependencies"
      "scripts";
  `};

  ${media.mobile`
    grid-template-columns: 1fr;
    grid-template-areas: 
      "scripts"
      "dependencies";
  `};
`;

const DependenciesViewWrapper = styled.section`
  grid-area: dependencies;
  padding: 32px;
`;

const ScriptsViewWrapper = styled.section`
  grid-area: scripts;
  padding: 32px;
`;

class PackageRoute extends Component {
  state = {
    pkg: {}
  };

  componentDidMount() {
    this.fetchPkg();
  }

  async fetchPkg() {
    let res = await fetch('/package');
    let json = await res.json();
    this.setState({
      pkg: json.pkg
    });
  }

  render() {
    return (
      <Grid>
        <DependenciesViewWrapper>
          <DependenciesView package={this.state.pkg} />
        </DependenciesViewWrapper>
        <ScriptsViewWrapper>
          <ScriptsView package={this.state.pkg} />
        </ScriptsViewWrapper>
      </Grid>
    );
  }
}

export default PackageRoute;

import React, { Component } from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import { Search, Close } from '@material-ui/icons';

import { ThemeContext } from '../../theme-context';

import SectionTitle from '../../components/common/SectionTitle';
import Panel from '../../components/common/Panel';
import DependenciesTable from '../../components/DependenciesTable';

const Container = styled(Panel)`
  &::before {
    display: block;
    content: '';
    background: ${props =>
      `linear-gradient(45deg, ${props.theme.primary1} 30%, ${
        props.theme.primary2
      } 90%)`};
    width: 100%;
    height: 5px;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 4px;
  margin-bottom: 16px;
  /* border-bottom: 1px solid rgba(224, 224, 224, 1); */
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 16px;
  background: none;
  border: none;
  -webkit-appearance: none;
  outline: 0;
`;

class DependenciesView extends Component {
  state = {
    searchQuery: ''
  };

  handleInput = e => {
    this.setState({
      searchQuery: e.target.value
    });
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <React.Fragment>
            <SectionTitle>Dependencies</SectionTitle>
            <Container theme={theme}>
              <SearchWrapper>
                <IconButton>
                  <Search />
                </IconButton>
                <SearchInput
                  placeholder="Search"
                  onChange={this.handleInput}
                  value={this.state.searchQuery}
                />
                <IconButton>
                  <Close />
                </IconButton>
              </SearchWrapper>
              <DependenciesTable
                package={this.props.package}
                searchQuery={this.state.searchQuery}
              />
            </Container>
          </React.Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default DependenciesView;

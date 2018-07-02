import React, { Component } from 'react';
import styled from 'styled-components';

import { ThemeContext, themes } from './theme-context';

import media from './util/media';

import Sidebar from './layouts/Sidebar';
import Main from './layouts/Main';

import './App.css';

const Grid = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: grid;
  background: #f2f4f8;

  ${media.desktop`
    grid-template-columns: 70px 1fr;
    grid-template-rows: 100%;
    grid-template-areas:
      'sidebar main'
  `};

  ${media.tablet`
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'nav route';
  `};

  ${media.mobile`
    grid-template-columns: 100%;
    grid-template-rows: 100px 50px auto;
    grid-template-areas:
      'header'
      'nav'
      'route';
  `};
`;

class App extends Component {
  state = {
    theme: themes.light
  };

  handleChange = e => {
    this.setState({
      theme: e.target.checked ? themes.dark : themes.light
    });
  };

  render() {
    return (
      <Grid className="App">
        <ThemeContext.Provider value={this.state.theme}>
          <Sidebar />
          <Main />
        </ThemeContext.Provider>
      </Grid>
    );
  }
}

export default App;

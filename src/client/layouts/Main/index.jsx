import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../Header';

import PackageRoute from '../../routes/PackageRoute';

const Container = styled.div`
  grid-area: main;
  height: 100vh;
  overflow: auto;
  display: grid;
  grid-template-rows: 60px 35px 1fr;
  grid-template-areas:
    'header'
    'meta'
    'content';
`;

const HeaderWrapper = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MetaWrapper = styled.div`
  grid-area: meta;
  display: flex;
  align-items: center;
  padding: 0 32px;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Breadcrumb = styled.span`
  color: #3e4b5b;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.7px;

  &:not(:last-child) {
    &::after {
      display: inline-block;
      padding: 0 8px;
      color: #636c72;
      content: '/';
    }
  }
  :last-child {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const ContentWrapper = styled.div`
  grid-area: content;
  width: 100%;
`;

class Main extends Component {
  state = {
    user: '',
    cwd: '',
    projectName: ''
  };

  componentDidMount() {
    this.fetchMeta();
    this.fetchName();
  }

  async fetchMeta() {
    const res = await fetch('/meta');
    const { cwd, user } = await res.json();
    const folders = cwd.split('/');
    const folder = folders[folders.length - 1];
    this.setState({
      cwd: folder,
      user
    });
  }

  async fetchName() {
    const res = await fetch('/package');
    const { pkg } = await res.json();
    this.setState({
      projectName: pkg.name
    });
  }

  render() {
    return (
      <Container>
        <HeaderWrapper>
          <Header projectName={this.state.projectName} />
        </HeaderWrapper>
        <MetaWrapper>
          <Breadcrumb>{this.state.user}</Breadcrumb>
          <Breadcrumb> {this.state.cwd}</Breadcrumb>
        </MetaWrapper>
        <ContentWrapper>
          <PackageRoute />
        </ContentWrapper>
      </Container>
    );
  }
}

export default Main;

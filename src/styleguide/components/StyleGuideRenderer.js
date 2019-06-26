// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

import ThemeContext from '../../client/context/ThemeContext';

import Header from './Header';

import '../../client/static/main.scss';

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
`;

const Aside = styled.aside`
  height: 100%;
  width: 25%;
  max-width: 300px;
  overflow: auto;
`;

const Main = styled.main`
  height: 100%;
  flex: 1;
  padding: 100px 16px;
  overflow: auto;
`;

const Content = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
`;

type Props = {
  children: Node,
  toc: Node,
  hasSidebar: boolean
};

const StyleGuideRenderer = (props: Props) => {
  const { children, toc } = props;

  const themeObj = {
    name: 'default',
    dark: false,
    primaryColour: '#2196f3'
  };

  return (
    <ThemeContext.Provider theme={themeObj}>
      <Layout>
        <Header />
        {props.hasSidebar && <Aside>{toc}</Aside>}
        <Main>
          <ThemeContext.Consumer>
            {contextProps => (
              <Content key={JSON.stringify(contextProps)}>{children}</Content>
            )}
          </ThemeContext.Consumer>
        </Main>
      </Layout>
    </ThemeContext.Provider>
  );
};

export default StyleGuideRenderer;

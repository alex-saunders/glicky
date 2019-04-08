// @flow
import * as React from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '../../theme';

import AppBarLayout from '../AppBarLayout';
import Routes from '../../routes';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background: ${(p: ThemeProps) => p.theme.colour('background_body')};
`;

const MainWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ScrollingContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('md')};
`;

type Props = {};

type State = {};

class AppLayout extends React.Component<Props, State> {
  static defaultProps = {};

  state = {};

  render() {
    return (
      <Container>
        <MainWrapper>
          <AppBarLayout />
          <ScrollingContent>
            <Routes />
          </ScrollingContent>
        </MainWrapper>
      </Container>
    );
  }
}

export default AppLayout;

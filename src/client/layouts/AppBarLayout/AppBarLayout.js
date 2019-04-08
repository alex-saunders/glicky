// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Match } from '@reach/router';

import { type ThemeProps } from '~/theme';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import SearchContext from '~/context/SearchContext';

import { SearchBar, TabBar, Tab, Icon } from '~/components';

type Props = ScriptsContextProps;

type State = {};

const AppBar = styled.header`
  position: relative;
  display: flex;
  flex-direction: row;
  z-index: 1;
  height: ${(p: ThemeProps) => p.theme.sizing(2.2)};
  background: ${(p: ThemeProps) => p.theme.colour('primary')};
  ${(p: ThemeProps) => p.theme.elevation('e2')};
`;

const LeftContent = styled.div`
  flex: 1;
`;

const StyledTabBar = styled(TabBar)`
  padding: 0 ${(p: ThemeProps) => p.theme.sizing(-0.5)};
`;

const MiddleContent = styled.div`
  width: 100%;
  max-width: ${(p: ThemeProps) => p.theme.sizing('max')};
  padding: ${(p: ThemeProps) => p.theme.sizing(-0.5)} 0;
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const TabIcon = styled(Icon)`
  width: ${(p: ThemeProps) => p.theme.sizing(1.25)};
  height: ${(p: ThemeProps) => p.theme.sizing(1.25)};
`;

class AppBarLayout extends Component<Props, State> {
  static defaultProps = {};

  state = {};

  render() {
    const scriptIsExecuting = Object.values(this.props.scripts).some(
      script => (script && script.executing) || false
    );

    return (
      <AppBar>
        <LeftContent>
          <StyledTabBar>
            <Match path="/">
              {({ match }) => (
                <Tab active={match}>
                  <StyledLink to="/">
                    {scriptIsExecuting ? 'e' : <TabIcon type="scripts" />}
                  </StyledLink>
                </Tab>
              )}
            </Match>
            <Match path="/dependencies">
              {({ match }) => (
                <Tab active={match}>
                  <StyledLink to="/dependencies">
                    <TabIcon type="dependency" />
                  </StyledLink>
                </Tab>
              )}
            </Match>
          </StyledTabBar>
        </LeftContent>
        <MiddleContent>
          <SearchContext.Consumer>
            {({ searchTerm, searchLabel, updateSearchTerm }) => (
              <SearchBar
                label={searchLabel}
                value={searchTerm}
                onChange={updateSearchTerm}
              />
            )}
          </SearchContext.Consumer>
        </MiddleContent>
        <RightContent>
          <StyledTabBar>
            <Match path="/settings">
              {({ match }) => (
                <Tab active={match}>
                  <StyledLink to="/settings">
                    <TabIcon type="settings" />
                  </StyledLink>
                </Tab>
              )}
            </Match>
          </StyledTabBar>
        </RightContent>
      </AppBar>
    );
  }
}

export default withScriptsContext(AppBarLayout);

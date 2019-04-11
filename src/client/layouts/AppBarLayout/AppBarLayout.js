// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import {
  Link,
  Match,
  Location,
  type LocationProviderRenderFnParams
} from '@reach/router';

import type { ThemeProps, ThemedComponent } from '~/theme';

import {
  withProcessContext,
  type WithProcessContextProps
} from '~/context/ProcessContext';

import SearchContext from '~/context/SearchContext';

import { SearchBar, TabBar, Tab, Icon, Spinner } from '~/components';

type Props = WithProcessContextProps;

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

type TabIconProps = {
  opacity?: number
};
const TabIcon: ThemedComponent<TabIconProps> = styled(Icon)`
  width: ${(p: ThemeProps) => p.theme.sizing(1.25)};
  height: ${(p: ThemeProps) => p.theme.sizing(1.25)};
  fill: ${(p: ThemeProps) => p.theme.colour('white')};

  ${(p: ThemeProps & TabIconProps) =>
    p.opacity &&
    css`
    transition: opacity 0.2s linear;
    opacity: {p.opacity}
  `};
`;

const PosedSpinnerWrapper = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const SpinnerWrapper = styled(PosedSpinnerWrapper)`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

class AppBarLayout extends Component<Props, State> {
  static defaultProps = {};

  state = {};

  render() {
    const { getProcessState, processes } = this.props;

    let processHasErrored = false;
    const executingProcesses = Object.keys(processes).filter(key => {
      const processState = getProcessState(key);
      if (processState === 'erroring') {
        processHasErrored = true;
      }
      return processState !== 'inactive';
    });

    return (
      <AppBar>
        <LeftContent>
          <StyledTabBar>
            <Match path="/">
              {({ match }) => (
                <Tab active={match}>
                  <StyledLink to="/">
                    <PoseGroup>
                      {executingProcesses.length > 0 && (
                        <SpinnerWrapper key="processIsExecuting">
                          <Spinner
                            size={'md'}
                            colour={processHasErrored ? 'red' : 'white'}
                            lineWidth={2}
                          />
                        </SpinnerWrapper>
                      )}
                    </PoseGroup>
                    <TabIcon
                      type="scripts"
                      opacity={executingProcesses.length > 0 ? 0.5 : 1}
                    />
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
          <Location>
            {({ location }: LocationProviderRenderFnParams) => (
              <SearchContext.Consumer>
                {({ searchTerm, searchLabel, updateSearchTerm }) => (
                  <SearchBar
                    label={searchLabel}
                    value={searchTerm}
                    onChange={updateSearchTerm}
                    location={location.key}
                  />
                )}
              </SearchContext.Consumer>
            )}
          </Location>
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

export default withProcessContext(AppBarLayout);

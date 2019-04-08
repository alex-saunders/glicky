// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Router,
  Location,
  type LocationProviderRenderFnParams
} from '@reach/router';
import posed, { PoseGroup } from 'react-pose';

import { type ThemeProps } from '~/theme';

import SocketContext from '~/context/SocketContext';

import Scripts from '~/routes/Scripts/Scripts';
import Dependencies from '~/routes/Dependencies/Dependencies';
import Settings from '~/routes/Settings/Settings';

const Main = styled.main`
  max-width: ${(p: ThemeProps) => p.theme.sizing('max')};
  margin: 0 auto ${(p: ThemeProps) => p.theme.sizing(3.5)};
  min-height: 100%;
`;

const RoutesContainer = posed.div({
  routeEnter: { beforeChildren: false }
});

const Routes = () => (
  <SocketContext.Consumer>
    {({ socket }) => (
      <Main>
        <Location>
          {({ location }: LocationProviderRenderFnParams) => (
            <PoseGroup
              enterPose="routeEnter"
              exitPose="routeExit"
              preEnterPose="routeExit"
              flipMove={true}
            >
              <RoutesContainer key={location.key}>
                <Router location={location}>
                  <Scripts socket={socket} path="/" />
                  <Dependencies
                    socket={socket}
                    path="/dependencies"
                    location={location}
                  />
                  <Settings path="/settings" />
                </Router>
              </RoutesContainer>
            </PoseGroup>
          )}
        </Location>
      </Main>
    )}
  </SocketContext.Consumer>
);

export default Routes;

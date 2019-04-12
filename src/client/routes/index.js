// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import {
  Router,
  Location,
  type LocationProviderRenderFnParams
} from '@reach/router';
import posed, { PoseGroup } from 'react-pose';

import { ManageScroll } from '~/components';

import { type ThemeProps } from '~/theme';

import SocketContext from '~/context/SocketContext';

import Scripts from '~/routes/Scripts/Scripts';
import Dependencies from '~/routes/Dependencies/Dependencies';
import Settings from '~/routes/Settings/Settings';

import AddDependency from '~/routes/Dependencies/sections/AddDependency';
import AddScript from '~/routes/Scripts/sections/AddScript';

const Main = styled.main`
  max-width: ${(p: ThemeProps) => p.theme.sizing('max')};
  margin: 0 auto ${(p: ThemeProps) => p.theme.sizing(3.5)};
  min-height: 100%;
`;

const RoutesContainer = posed.div({
  routeEnter: {
    opacity: 1,
    x: 0,
    y: 0,
    delay: 100,
    transition: { type: 'spring', stiffness: 400, delay: 100, damping: 20 }
  },
  routeExit: {
    opacity: 0,
    x: ({ location }) =>
      location.pathname === '/'
        ? -50
        : location.pathname.startsWith('/dependencies')
        ? 50
        : 0,
    y: ({ location }) => (location.pathname.startsWith('/settings') ? 50 : 0)
  }
});

const FABContainer = posed.div({
  fabEnter: { opacity: 1 },
  fabExit: { opacity: 0 }
});

type Props = {
  scrollToTop: () => {}
};

const Routes = ({ scrollToTop }: Props) => (
  <Main>
    <Location>
      {({ location }: LocationProviderRenderFnParams) => (
        <Fragment>
          <PoseGroup
            enterPose="routeEnter"
            exitPose="routeExit"
            preEnterPose="routeExit"
            flipMove={true}
          >
            <RoutesContainer key={location.key} location={location}>
              <Router location={location}>
                <Scripts path="/" />
                <Dependencies path="/dependencies" location={location} />
                <Settings path="/settings" />
              </Router>
            </RoutesContainer>
          </PoseGroup>
          <PoseGroup
            enterPose="fabEnter"
            exitPose="fabExit"
            preEnterPose="fabExit"
          >
            <FABContainer key={location.key} location={location}>
              <Router location={location}>
                <AddScript path="/" />
                <AddDependency path="/dependencies" />
              </Router>
            </FABContainer>
          </PoseGroup>
          <ManageScroll location={location} scrollToTop={scrollToTop} />
        </Fragment>
      )}
    </Location>
  </Main>
);

export default Routes;

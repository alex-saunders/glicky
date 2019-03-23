// @flow
import styled from 'styled-components';

import type { ThemeProps, ColourName } from '../../theme';

export const TabBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`;

type TabProps = {
  active: boolean,
  colour: ColourName
};
export const Tab = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p: ThemeProps) => p.theme.sizing('xl')};
  height: 100%;

  opacity: ${(p: TabProps) => (p.active ? 1 : 0.6)};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:after {
    display: block;
    content: '';
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: ${(p: ThemeProps & TabProps) => p.theme.colour(p.colour)};

    opacity: ${(p: TabProps) => (p.active ? 1 : 0)};
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
Tab.defaultProps = {
  colour: 'white'
};

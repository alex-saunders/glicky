// @flow
import styled, { css, keyframes } from 'styled-components';
import { darken } from 'polished';

import { ExpansionPanel } from '~/components';

import type { ThemeProps, ThemedComponent } from '~/theme';

// space between expanded panel and rest of list items
const GUTTER = 20;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1
  }
`;

type PanelProps = {
  active: boolean,
  animating: boolean,
  height: number
};
export const StyledExpansionPanel: ThemedComponent<PanelProps> = styled(
  ExpansionPanel
)`
  ${(p: ThemeProps) => p.theme.elevation('e1')};
`;

export const BodyWrapper = styled.div`
  ${(p: ThemeProps) => p.theme.elevation('e1')};
`;

export const PanelBody = styled.div`
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('md')};
  overflow: hidden;
`;

export const InfoSection = styled.div`
  margin: ${(p: ThemeProps) => p.theme.sizing('md')} 0;
`;

export const Fade = styled.div`
  animation: ${fadeIn} 0.8s 1;
`;

export const PanelFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: ${(p: ThemeProps) => p.theme.sizing('md')};
  background: ${(p: ThemeProps) =>
    darken(0.02, p.theme.colour('background_panel'))};
  border-top: 1px solid ${(p: ThemeProps) => p.theme.colour('border')};

  & > * {
    margin-left: ${(p: ThemeProps) => p.theme.sizing('sm')};
  }
`;

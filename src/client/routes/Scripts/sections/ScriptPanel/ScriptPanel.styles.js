// @flow
import styled from 'styled-components';

import { type ThemeProps, type ThemedComponent } from '~/theme';
import { Panel, IconButton, Text } from '~/components';
import { PlayIcon } from '~/components/icons';

import Terminal from '../../assets/Terminal.js';

type PanelProps = {
  active: ?boolean,
  animating: boolean
};
export const StyledPanel: ThemedComponent<PanelProps> = styled(Panel)`
  margin: ${(p: ThemeProps) => p.theme.sizing('md')} 0;
  background: none;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p: ThemeProps) => p.theme.sizing('ms')};
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  overflow: hidden;
  ${(p: ThemeProps) => p.theme.elevation('e1')};
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;

  &:first-of-type {
    flex: 1;
  }
`;

type IconButtonProps = {
  type: 'normal' | 'error' | 'valid'
};
export const PlayButton: ThemedComponent<IconButtonProps> = styled(IconButton)`
  background: linear-gradient(
    45deg,
    ${(p: ThemeProps & IconButtonProps) =>
        p.theme.colour(
          p.type === 'normal'
            ? 'primary_light'
            : p.type === 'error'
            ? 'red_light'
            : 'green_light'
        )}
      30%,
    ${(p: ThemeProps & IconButtonProps) =>
      p.theme.colour(
        p.type === 'normal' ? 'primary' : p.type === 'error' ? 'red' : 'green'
      )}
  );
  border-color: ${(p: ThemeProps & IconButtonProps) =>
    p.theme.colour(
      p.type === 'normal'
        ? 'primary_light'
        : p.type === 'error'
        ? 'red_light'
        : 'green_light'
    )};

  flex-shrink: 0;
`;

export const StyledPlayIcon = styled(PlayIcon)`
  transform: translateX(2px);
`;

export const TitleText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

export const Title = styled(Text)`
  margin: ${(p: ThemeProps) => p.theme.sizing(-2)} 0;
`;
export const Subtitle = styled(Text)`
  margin: 0;
  font-family: 'Roboto Mono', monospace;
`;

export const Img = styled.img`
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
`;

export const Body = styled.div`
  border-top: 1px solid ${(p: ThemeProps) => p.theme.colour('border')};
  background: none;
`;

export const BodyTitleBar = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  padding: ${(p: ThemeProps) => p.theme.sizing('ms')};
  margin: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
  overflow: hidden;
  ${(p: ThemeProps) => p.theme.elevation('e1')};
`;

export const BodyTitleBarSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  color: ${(p: ThemeProps) => p.theme.colour('text')};
`;

export const TerminalIcon = styled(Terminal)`
  width: ${(p: ThemeProps) => p.theme.sizing('xs')};
  height: ${(p: ThemeProps) => p.theme.sizing('xs')};
  margin-right: ${(p: ThemeProps) => p.theme.sizing(-1)};
`;

export const BodyTitleBarText = styled(Text)`
  margin: 0;
  font-family: 'Roboto Mono', monospace;
`;

type ChevronProps = {
  active: boolean
};
export const PanelChevron: ThemedComponent<ChevronProps> = styled.img`
  width: ${(p: ThemeProps) => p.theme.sizing(0.75)};
  height: ${(p: ThemeProps) => p.theme.sizing(0.75)};

  transform: rotate(${(p: ChevronProps) => (p.active ? '180deg' : 0)});
`;

export const SecondaryButton = styled(IconButton)`
  &:not(:last-of-type) {
    margin-right: ${(p: ThemeProps) => p.theme.sizing('ms')};
  }
`;

type RestartButtonProps = {
  disabled: boolean
};
export const RestartButton = styled(SecondaryButton)`
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(p: RestartButtonProps) => (p.disabled ? 0 : 0.6)};
`;

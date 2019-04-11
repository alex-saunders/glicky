// @flow
import styled, { css, keyframes } from 'styled-components';
import posed from 'react-pose';

import { type ThemeProps, type ThemedComponent } from '~/theme';

import { Icon } from '~/components';

import DependencyPanel from './DependencyPanel/DependencyPanel';

const GUTTER = 20;

const PosedPanelWrapper = posed.div({
  active: {
    width: '105%',
    left: '-2.5%',
    top: GUTTER,
    flip: false,
    transition: {
      default: { ease: 'anticipate', duration: 400 }
    }
  },
  inactive: {
    width: '100%',
    left: '0',
    top: 0,
    flip: false,
    transition: {
      default: { ease: 'anticipate', duration: 400 }
    }
  }
});

type PanelProps = {
  active: boolean
};

export const PanelWrapper = styled(PosedPanelWrapper)`
  position: relative;

  width: 100%;
  will-change: transform;

  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p: ThemeProps) => p.theme.elevation('e1')};

  ${(p: PanelProps) =>
    p.active &&
    css`

      ~ ${PanelWrapper} {
        transform: translateY(${GUTTER * 2}px)
    `};
`;

type RowProps = {};
export const Row: ThemedComponent<RowProps> = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  border-bottom: 1px solid ${(p: ThemeProps) => p.theme.colour('border')};
  cursor: pointer;
`;

export const RowSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:nth-of-type(1) {
    max-width: 35%;
  }
`;

type CellProps = {
  numeric?: boolean,
  breakWord?: boolean,
  onClick?: Function
};
export const Cell: ThemedComponent<CellProps> = styled.div`
  flex: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(p: CellProps) => (p.numeric ? 'flex-end' : 'flex-start')};
  cursor: ${(p: CellProps) => (p.onClick ? 'pointer' : 'auto')};

  ${({ theme }: ThemeProps) => css`
    padding: ${theme.sizing('md')} ${theme.sizing('lg')} ${theme.sizing('md')}
      ${theme.sizing('md')};
  `};
  ${({ breakWord }: CellProps) =>
    breakWord &&
    css`
      word-break: break-all;
    `};
`;

export const Header = styled.div`
  ${(p: ThemeProps) => p.theme.elevation('e1')};

  ${Row} {
    cursor: auto;
  }
  ${RowSection} {
    color: ${(p: ThemeProps) => p.theme.colour('text_secondary')};
    font-weight ${(p: ThemeProps) => p.theme.fontWeight('bold')};
    font-size: ${(p: ThemeProps) => p.theme.fontSize('sm2')};
    text-transform: capitalize;
  }
`;

export const SortContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
`;

type SortProps = {
  isActive: boolean,
  direction: 'asc' | 'desc'
};
export const SortIcon: ThemedComponent<SortProps> = styled(Icon).attrs({
  type: 'arrow'
})`
  position: absolute;
  top: 0;
  left: 0;
  height: ${(p: ThemeProps) => p.theme.sizing('ms')};
  width: ${(p: ThemeProps) => p.theme.sizing('ms')};
  transform: scale(0);
  opacity: 0;

  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${(p: ThemeProps & SortProps) =>
    p.isActive &&
    css`
      opacity: 1;
      transform: scale(1) ${p.direction === 'desc' && 'rotate(180deg)'};
    `};
`;

export const SortText: ThemedComponent<SortProps> = styled.span`
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${(p: ThemeProps & SortProps) =>
    p.isActive &&
    css`
      transform: translateX(${p.theme.sizing('md')});
    `};
`;

export const StyledDependencyPanel = styled(DependencyPanel)`
  width: 100%;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const OutdatedIcon = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  border-radius: 50%;
  background: ${(p: ThemeProps) => p.theme.colour('accent')};
  color: ${(p: ThemeProps) => p.theme.colour('white')};
  ${(p: ThemeProps) => p.theme.elevation('e1')};

  animation: ${fadeIn} 0.3s 1;
`;

type NameProps = {
  outdated: boolean
};
export const Name: ThemedComponent<NameProps> = styled.div`
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(p: NameProps & ThemeProps) =>
    p.outdated &&
    css`
      transform: translateX(${p.theme.sizing(1.75)});
    `};
`;

export const DeleteIcon = styled(Icon).attrs({
  type: 'remove'
})`
  fill: ${(p: ThemeProps) => p.theme.colour('white')};
`;

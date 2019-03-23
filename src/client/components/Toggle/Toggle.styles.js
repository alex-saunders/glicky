// @flow
import styled, { css } from 'styled-components';
import { lighten, darken } from 'polished';

import { Text } from '~/components';

import { type ThemeProps, type ThemedComponent } from '~/theme';

import { type Props } from './Toggle';

export const Label = styled.label`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  height: ${(p: ThemeProps) => p.theme.sizing('xl')};
  cursor: pointer;
`;

export const Input = styled.input`
  visibility: hidden;
  height: 0;
  width: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: none;
  -webkit-appearance: none;
`;

export const Bar: ThemedComponent<Props> = styled.div`
  z-index: 1;
  width: ${(p: ThemeProps) => p.theme.sizing('xl')};
  height: ${(p: ThemeProps) => p.theme.sizing('sm')};
  border-radius: ${(p: ThemeProps) => p.theme.sizing('xxl')};
  opacity: 0.5;

  background-color: ${(p: ThemeProps & Props) =>
    p.selected
      ? darken(0.1, p.theme.colour('accent'))
      : p.theme.colour('grey')};
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SwitchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 ${(p: ThemeProps) => p.theme.sizing('sm')};

  height: ${(p: ThemeProps) => p.theme.sizing('md')};
`;

export const ButtonContainer: ThemedComponent<Props> = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p: ThemeProps & Props) =>
    p.selected &&
    css`
      transform: translateX(100%);
    `};
`;

export const Button: ThemedComponent<Props> = styled.div`
  position: relative;
  padding: ${(p: ThemeProps) => p.theme.sizing('sm')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p: ThemeProps & Props) =>
    p.selected &&
    css`
      transform: translateX(-100%);
    `};
`;

export const ButtonIcon: ThemedComponent<Props> = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  border-radius: 50%;
  ${(p: ThemeProps) => p.theme.elevation('e3')};

  background-color: ${(p: ThemeProps & Props) =>
    p.selected
      ? p.theme.colour('accent')
      : lighten(0.2, p.theme.colour('grey'))};

  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const StyledText: ThemedComponent<Props> = styled(Text)`
  ${(p: ThemeProps & Props) =>
    p.alignText === 'left'
      ? css`
          margin-right: ${p.theme.sizing(-1.5)};
        `
      : css`
          margin-left: ${p.theme.sizing(-1.5)};
        `};
`;

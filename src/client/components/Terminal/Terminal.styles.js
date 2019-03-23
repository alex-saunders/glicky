// @flow
import styled from 'styled-components';
import { darken } from 'polished';
import { type ThemeProps } from '../../theme';

/* height: ${(p: ThemeProps) => p.theme.sizing(5.1)}; */
export const Container = styled.div`
  position: relative;

  width: 100%;
  height: 320px;

  padding: ${(p: ThemeProps) => p.theme.sizing(-1)};
  margin: 0;
  resize: both;
  overflow: auto;
  background: ${(p: ThemeProps) => darken(1, p.theme.colour('grey'))};
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

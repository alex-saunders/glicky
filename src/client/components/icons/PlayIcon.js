// @flow
import styled, { css } from 'styled-components';
import type {
  ThemedComponent,
  ThemeProps,
  Space,
  ColourName
} from '../../theme';

type PlayIconProps = {
  size: Space,
  colour: ColourName
};

const PlayIcon: ThemedComponent<PlayIconProps> = styled.div`
  border: 0;
  background: transparent;
  width: 0;
  height: ${(p: ThemeProps & PlayIconProps) => p.theme.sizing(p.size)};

  border-color: transparent transparent transparent
    ${(p: ThemeProps & PlayIconProps) => p.theme.colour(p.colour)};

  border-style: solid;
  ${(p: ThemeProps & PlayIconProps) => css`
    border-width: ${p.theme.sizing(p.size, size => size / 2)} 0
      ${p.theme.sizing(p.size, size => size / 2)}
      ${p.theme.sizing(p.size, size => size * 0.8)};
  `};
  pointer-events: none;
`;

PlayIcon.defaultProps = {
  size: 'md',
  colour: 'black'
};

export default PlayIcon;

// @flow
import styled, { css } from 'styled-components';
import type { ThemedComponent, ThemeProps, Space } from '~/theme';

type SpacingProps = {
  top?: Space,
  left?: Space,
  right?: Space,
  bottom?: Space,
  all?: Space
};

const Spacing: ThemedComponent<SpacingProps> = styled.div`
  ${(p: SpacingProps & ThemeProps) =>
    p.all
      ? css`
          padding: ${p.theme.sizing(p.all)};
        `
      : css`
          ${p.left && `padding-left: ${p.theme.sizing(p.left)}`};
          ${p.right && `padding-right: ${p.theme.sizing(p.right)}`};
          ${p.bottom && `padding-bottom: ${p.theme.sizing(p.bottom)}`};
          ${p.top && `padding-top: ${p.theme.sizing(p.top)}`};
        `};
`;

export default Spacing;

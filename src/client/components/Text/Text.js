// @flow
import * as React from 'react';
import styled, { css } from 'styled-components';

import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import type {
  ThemedComponent,
  ThemeProps,
  ColourName,
  Weight,
  Size,
  LetterSpacing
} from '../../theme';

type Tags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div';

type StyleProps = {
  colour: ColourName,
  size: Size,
  weight: Weight,
  uppercase: boolean,
  spacing: LetterSpacing,
  font?: string
};

type Props = ThemeContextProps & {
  tag?: Tags
} & StyleProps;

type BaseProps = StyleProps & ThemeProps;

const Base: ThemedComponent<BaseProps> = styled.span`
  color: ${({ colour, theme }: BaseProps) =>
    colour ? theme.colour(colour) : 'inherit'};
  font-size: ${({ size, theme }: BaseProps) => theme.fontSize(size)};
  line-height: ${({ size, theme }: BaseProps) => theme.lineHeight(size)};
  font-weight: ${({ weight, theme }: BaseProps) =>
    weight ? theme.fontWeight(weight) : '400'};
  text-transform: ${({ uppercase }: BaseProps) =>
    uppercase ? 'uppercase' : 'inherit'};
  letter-spacing: ${({ spacing, theme }: BaseProps) =>
    theme.letterSpacing(spacing)};

  ${(p: BaseProps) =>
    p.font &&
    css`
      font-family: ${p.font};
    `}
`;

class Text extends React.PureComponent<Props, *> {
  static defaultProps = {
    tag: 'span',
    colour: 'text',
    size: 's0',
    weight: 'normal',
    uppercase: false,
    spacing: 'none'
  };
  render() {
    const { tag, ...rest } = this.props;

    const Tag = Base.withComponent(tag);
    return <Tag {...rest} />;
  }
}

export default withTheme(Text);

// @flow
import type { ThemeName } from '.';

import { css } from 'styled-components';

const fontSizes = {
  sm2: '0.82rem',
  sm1: '0.9rem',
  s0: '1rem',
  s1: '1.2rem',
  s2: '1.44rem',
  s3: '1.725rem',
  s4: '2.075rem',
  s5: '2.4875rem',
  s6: '2.9875rem',
  s7: '3.58125rem'
};

export type Size = $Keys<typeof fontSizes>;

const lineHeights: typeof fontSizes = {
  sm2: '1rem',
  sm1: '0.9rem',
  s0: '1.25rem',
  s1: '1.5rem',
  s2: '1.8rem',
  s3: '2.6rem',
  s4: '3.11rem',
  s5: '3.73rem',
  s6: '4.48rem',
  s7: '5.38rem'
};

const fontWeights = {
  light: '300',
  normal: '400',
  bold: '500',
  black: '700'
};

export type Weight = $Keys<typeof fontWeights>;

const letterSpacings = {
  none: '0px',
  small: '0.25px',
  medium: '0.5px',
  large: '1px'
};

export type LetterSpacing = $Keys<typeof letterSpacings>;

const sizes = Object.keys(fontSizes).reduce((acc, sizeKey) => {
  acc[sizeKey] = css`
    font-size: ${fontSizes[sizeKey]};
    line-height: ${lineHeights[sizeKey]};
  `;
  return acc;
}, {});

export const fontSize = (size: ?Size): string => {
  if (size) {
    return fontSizes[size];
  }
  return '';
};

export const lineHeight = (size: ?Size): string => {
  if (size) {
    return lineHeights[size];
  }
  return '';
};

export const letterSpacing = (size: LetterSpacing): string =>
  letterSpacings[size];

export const font = (size: ?Size): string => {
  if (size) {
    return sizes[size];
  }
  return '';
};

export const fontWeight = (weight: Weight): string => fontWeights[weight];

export const baseFont = (themeName: ThemeName) => {
  switch (themeName) {
    case 'retro':
      return css`
        @import url('https://fonts.googleapis.com/css?family=PT+Mono&display=swap');
        html,
        body {
          font-family: 'PT Mono', monospace;
        }
      `;
    default:
      return css`
        @import url('https://rsms.me/inter/inter.css');
        html,
        body {
          font-family: 'Inter', sans-serif;
        }
        @supports (font-variation-settings: normal) {
          html {
            font-family: 'Inter var', sans-serif;
          }
        }
      `;
  }
};

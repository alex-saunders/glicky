// @flow

import { rem } from 'polished';

const spaces = {
  xxs: -0.5,
  xs: 0,
  sm: 0.25,
  ms: 0.5,
  md: 1,
  lg: 1.5,
  xl: 2,
  xxl: 2.5
};

export type Space = $Keys<$Exact<typeof spaces>>;

const spacingBase = 12;

export const sizing = (
  space: Space | number | 'max',
  modifier?: number => number
): string => {
  if (space === 'max') return '740px';
  const spacingVar = typeof space === 'number' ? space : spaces[space];
  let val = Math.pow(2, spacingVar) * spacingBase;
  if (modifier) {
    val = modifier(val);
  }
  return rem(val);
};

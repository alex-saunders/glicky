// @flow
import type { Node } from 'react';
import type { Elevation } from '~/theme';

import type { IconType } from '../Icon/Icon';

export type ThemeColourButtonTypes =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'error';

export type ButtonType = ThemeColourButtonTypes | 'ghost';

export type Props = {
  type: ButtonType,
  elevation: Elevation,
  icon?: IconType | Node,
  submit?: boolean,
  children: string
};

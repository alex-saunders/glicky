// @flow
import { type StyledComponent } from 'styled-components';

import { sizing, type Space } from './sizes';
import type { Weight, Size, LetterSpacing } from './fontSize';
import {
  fontSize,
  lineHeight,
  fontWeight,
  font,
  letterSpacing
} from './fontSize';
import { colour, type ColourName, type PrimaryColour } from './colours';
import { elevation, type Elevation } from './elevation';

export type { ColourName, Space, Weight, Size, LetterSpacing, Elevation };

export type ThemeMode = 'light' | 'dark';

export const themeNames = {
  default: 'Default',
  playful: 'Playful',
  extra: 'Extra'
};

export type ThemeName = $Keys<typeof themeNames>;

export const theme = (
  mode: ThemeMode = 'light',
  primaryColour: PrimaryColour = '#673AB7'
) => ({
  mode,
  primaryColour,
  sizing,
  colour: colour(mode, primaryColour),
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  font,
  elevation
});

export type ExtractReturn<Fn> = $Call<<T>((...Iterable<any>) => T) => T, Fn>;

export type Theme = ExtractReturn<typeof theme>;

export type ThemeProps = {
  theme: Theme
};

export type ThemedComponent<Props> = StyledComponent<Props, Theme>;

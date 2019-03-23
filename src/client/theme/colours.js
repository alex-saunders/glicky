// @flow
import { type ThemeMode } from './index';
import { lighten, darken } from 'polished';

export const primaryColours = {
  yellow: '#ffc107',
  teal: '#009688',
  blue: '#2196f3',
  purple: '#673AB7',
  red: '#f44336'
};

export type PrimaryColour = $Values<typeof primaryColours>;

const colourNames = (primaryColour: PrimaryColour = '#673AB7') => ({
  light: {
    white: '#FFFFFF',
    black: '#191919',
    primary: primaryColour,
    primary_text: '#FFFFFF',
    primary_light: lighten(0.1, primaryColour),
    primary_dark: darken(0.1, primaryColour),
    grey: '#ddd',
    background_body: '#fafafa',
    background_panel: '#fff',
    border: '#ddd',
    text: '#000',
    text_secondary: '#757575',
    accent: primaryColour,
    green: '#43A047',
    green_light: '#66BB6A',
    red: '#e53935',
    red_light: '#ef5350'
  },
  dark: {
    white: '#fff',
    black: '#191919',
    primary: '#263238',
    primary_text: '#757575',
    primary_light: '#4f5b62',
    primary_dark: '#0b1c23',
    grey: '#888888',
    background_body: '#102027',
    background_panel: '#263238',
    border: '#102027',
    text: '#fafafa',
    text_secondary: '#a0a7ad',
    accent: '#80cdc5',
    green: '#43A047',
    green_light: '#66BB6A',
    red: '#e53935',
    red_light: '#ef5350'
  }
});

const colours = colourNames().light;
const colourNameKeys = Object.keys(colours);

export type ColourName = $Keys<typeof colours>;

// @TODO: Allow manipulation of colors with func parameter
export const colour = (mode: ThemeMode, primaryColour: PrimaryColour) => (
  colourName: ColourName
) => {
  return colourNames(primaryColour)[mode][colourName];
};

export function isColourName(name: string): boolean %checks {
  return !!name && typeof name !== 'undefined' && colourNameKeys.includes(name);
}

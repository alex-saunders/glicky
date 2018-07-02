import React from 'react';

export const themes = {
  light: {
    primary1: '#1565C0', // dark
    primary2: '#2196F3', // light
    secondary1: '#1565C0', // dark
    secondary2: '#2196F3' //light
  },
  dark: {
    primary1: '#263238', // dark
    primary2: '#455A64', // light
    secondary1: '#263238', // dark
    secondary2: '#455A64' //light
  }
};

export const ThemeContext = React.createContext(themes.light);

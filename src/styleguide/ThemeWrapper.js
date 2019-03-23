/* eslint-disable */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../client/theme';

import '../client/static/main.scss';

export default class ThemeWrapper extends Component {
  render() {
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>;
  }
}

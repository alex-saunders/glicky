// @flow
import React, { type Node } from 'react';

import ThemeContext from '../../client/context/ThemeContext';

type Props = {
  children: Node
};

const ComponentWrapper = (props: Props) => (
  // Grab the theme details off window and set up
  // a context provider for this component's root
  <ThemeContext.Provider theme={window.__THEME__}>
    {props.children}
  </ThemeContext.Provider>
);

export default ComponentWrapper;

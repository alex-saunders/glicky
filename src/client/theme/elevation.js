// @flow
import { css } from 'styled-components';

const elevations = {
  e0: 'none',
  e1: '0px 2px 4px rgba(0,0,0,0.2)',
  e2: '0px 4px 8px rgba(0,0,0,0.4)',
  e3: '0 3px 6px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.2)',
  e4: '0 6px 12px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.2)'
};

export type Elevation = $Keys<$Exact<typeof elevations>>;

export const elevation = (e: Elevation): string => {
  return css`
    box-shadow: ${elevations[e]};
  `;
};

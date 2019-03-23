// @flow
import React from 'react';
import styled, { css } from 'styled-components';

import type { ThemeProps, ThemedComponent } from '../../theme';

import Grid from '../Grid/Grid';

const ColourBoard = styled.div`
  display: inline-block;
  padding: ${(p: ThemeProps) => p.theme.sizing('xs')};
`;

type ColourProps = {
  active: boolean,
  colour: string
};
const activeStyles = css`
  outline: ${(p: ThemeProps) => p.theme.colour('white')} solid 2px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
`;

const ColourSquare: ThemedComponent<ColourProps> = styled.button`
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
  width: ${(p: ThemeProps) => p.theme.sizing('md')};
  height: ${(p: ThemeProps) => p.theme.sizing('md')};
  background: ${(p: ColourProps) => p.colour};
  padding: 5px;

  ${(p: ColourProps & ThemeProps) => p.active && activeStyles};

  &:hover {
    ${activeStyles};
  }
`;

type Props = {
  colours: Array<string>,
  value?: string,
  onChange: string => void
};

const ColourPicker = ({ colours, value, onChange }: Props) => (
  <ColourBoard>
    <Grid
      spacing={-1.5}
      items={colours}
      itemKey={colour => colour}
      renderItem={colour => (
        <ColourSquare
          colour={colour}
          active={value === colour}
          onClick={() => onChange(colour)}
        />
      )}
    />
  </ColourBoard>
);

export default ColourPicker;

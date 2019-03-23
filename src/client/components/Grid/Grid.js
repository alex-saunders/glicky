// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

import type { Space, ThemedComponent, ThemeProps } from '~/theme';

type SpacingProps = {
  spacing: Space | number
};

type Props<T> = SpacingProps & {
  items: Array<T>,
  renderItem: T => Node,
  itemKey: T => string
};

const Container: ThemedComponent<SpacingProps> = styled.div`
  margin: -${(p: ThemeProps & SpacingProps) => p.theme.sizing(p.spacing)};
`;

const Cell: ThemedComponent<SpacingProps> = styled.div`
  display: inline-block;
  padding: ${(p: ThemeProps & SpacingProps) => p.theme.sizing(p.spacing)};
`;

function Grid<T>({ spacing, items, renderItem, itemKey }: Props<T>) {
  return (
    <Container spacing={spacing}>
      {items.map(item => {
        const key = itemKey(item);
        return (
          <Cell key={key} spacing={spacing}>
            {renderItem(item)}
          </Cell>
        );
      })}
    </Container>
  );
}

export default Grid;

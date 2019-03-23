// @flow
import React from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '~/theme';

import { Grid } from '~/components';

import AvatarChip from '../../AvatarChip/AvatarChip';
import { type Author } from '../../DependencyPanel';

type Props = {
  maintainers: Array<Author>
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: -${(p: ThemeProps) => p.theme.sizing('xxs')};
  overflow-y: auto;
`;

const Item = styled.div`
  padding: ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

const Maintainers = ({ maintainers }: Props) => (
  <Container>
    {maintainers.map(maintainer => (
      <Item key={maintainer.email}>
        <AvatarChip name={maintainer.name} email={maintainer.email} />
      </Item>
    ))}
  </Container>
);

export default Maintainers;

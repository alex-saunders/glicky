// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';

import { type ThemeProps } from '~/theme';

import { Grid, Chip, BodyText } from '~/components';

const TextWrapper = styled.div`
  margin: ${(p: ThemeProps) => p.theme.sizing('xxs')} 0;
`;

type Props = {
  description: string,
  keywords: Array<string>
};

const Description = ({ description, keywords }: Props) => (
  <Fragment>
    <TextWrapper>
      <BodyText>{description || ''}</BodyText>
    </TextWrapper>
    {keywords.length > 0 && (
      <Grid
        items={keywords}
        itemKey={keyword => keyword}
        spacing={-2}
        renderItem={keyword => (
          <Chip bgColour="primary_dark" uppercase={false}>
            {keyword}
          </Chip>
        )}
      />
    )}
  </Fragment>
);

export default Description;

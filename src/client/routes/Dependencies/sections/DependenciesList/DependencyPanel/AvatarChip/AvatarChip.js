// @flow
import React, { Fragment } from 'react';

import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import { Chip, Avatar, Text } from '~/components';

type Props = ThemeContextProps & {
  name: string,
  email: string
};

const AvatarChip = ({ name, email, theme }: Props) => (
  <Chip
    bgColour={theme.mode === 'dark' ? 'background_body' : 'white'}
    borderColour="border"
    icon={<Avatar type="gravatar" source={email} />}
    uppercase={false}
  >
    <Fragment>
      <Text size="sm1" tag="div">
        {name}
      </Text>
      <Text size="sm2" colour="text_secondary" tag="div">{`<${email}>`}</Text>
    </Fragment>
  </Chip>
);

export default withTheme(AvatarChip);

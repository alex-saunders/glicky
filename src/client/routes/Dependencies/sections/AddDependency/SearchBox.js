// @flow
import React from 'react';
import styled from 'styled-components';
import { connectSearchBox } from 'react-instantsearch-dom';

import type { ThemeProps } from '~/theme';

import { TextField } from '~/components';

const StyledTextField = styled(TextField)`
  margin-bottom: ${(p: ThemeProps) => p.theme.sizing('sm')};
`;

type Props = {
  currentRefinement: String,
  refine: string => void
};

const SearchBox = ({ currentRefinement, refine, ...rest }: Props) => (
  <form noValidate action="" role="search">
    <StyledTextField
      label="Dependency Name"
      fullWidth
      value={currentRefinement}
      onChange={value => refine(value)}
      {...rest}
    />
  </form>
);

const CustomSearchBox = connectSearchBox(SearchBox);

export default CustomSearchBox;

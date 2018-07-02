import React, { Component } from 'react';
import styled from 'styled-components';

import ThemedTextField from '../common/themed/ThemedTextField';

import Panel, { Title } from '../common/Panel';

const Container = styled(Panel)`
  padding: 4px 16px 16px;
  margin: 0 0 32px;
`;

const SecondaryFieldWrapper = styled.div`
  margin-top: 16px;
`;

class NewScript extends Component {
  render() {
    return (
      <Container>
        <Title>new script</Title>
        <ThemedTextField
          fullWidth
          helperText="e.g. dev"
          id="name"
          label="Name"
        />
        <SecondaryFieldWrapper>
          <ThemedTextField
            fullWidth
            helperText="e.g. webpack -w"
            id="name"
            label="Script"
          />
        </SecondaryFieldWrapper>
      </Container>
    );
  }
}

export default NewScript;

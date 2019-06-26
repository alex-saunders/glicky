// @flow
import React, { useState } from 'react';
import styled from 'styled-components';

import { themeNames } from '../../client/theme';
import {
  withTheme,
  type ThemeContextProps
} from '../../client/context/ThemeContext';

import TextField from '../../client/components/TextField/TextField';
import Checkbox from '../../client/components/Checkbox/Checkbox';
import Select from '../../client/components/Select/Select';

const SCHeader = styled.header`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 16px;
`;

const TextFieldWrapper = styled.div`
  width: 250px;
  margin: 0 16px 0 0;
`;

const SCTextField = styled(TextField)`
  width: 100%;
`;

const CheckboxWrapper = styled.div`
  margin: 16px 0 0 0;
`;

const SelectWrapper = styled.div`
  height: 18px;
  width: 150px;

  margin: 8px 16px 0 0;
`;

const Header = (props: ThemeContextProps) => {
  const [primaryColour, setPrimaryColour] = useState(props.theme.primaryColour);
  const [error, setError] = useState(false);
  const [themeName, setThemeName] = useState(props.name);

  const setColour = colour => {
    let formattedColour = colour;
    if (!colour.startsWith('#')) {
      formattedColour = '#' + colour;
    }
    setPrimaryColour(formattedColour);

    if (formattedColour.match(/^#[0-9a-f]{6}$/i)) {
      props.setPrimaryColour(formattedColour);
      setError(false);
    } else {
      setError(true);
    }
  };

  const setName = name => {
    setThemeName(name);
    props.setThemeName(name);
  };

  return (
    <SCHeader>
      <TextFieldWrapper>
        <SCTextField
          label="Primary Colour"
          value={primaryColour}
          onChange={setColour}
          error={error}
          errorText={'Value must be in valid hex format!'}
        />
      </TextFieldWrapper>

      <SelectWrapper>
        <Select
          value={themeName}
          options={Object.keys(themeNames).map(k => ({
            value: k,
            label: themeNames[k]
          }))}
          onChange={setName}
        />
      </SelectWrapper>
      <CheckboxWrapper>
        <Checkbox
          label="Dark Mode"
          checked={props.theme.mode === 'dark'}
          onChange={checked => props.setThemeMode(checked ? 'dark' : 'light')}
        />
      </CheckboxWrapper>
    </SCHeader>
  );
};

export default withTheme(Header);

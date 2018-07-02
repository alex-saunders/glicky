import React from 'react';
import styled from 'styled-components';

import { ThemeContext } from '../../../theme-context';

const StyledH2 = styled.h2`
  position: relative;
  font-size: 16px;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 0.6px;
  padding-bottom: 16px;
  margin-bottom: 32px;
  color: rgb(51, 65, 82);

  &::before {
    display: block;
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    height: 4px;
    width: 25px;
    background: ${props => `linear-gradient(45deg,${props.theme.primary1} 30%,${
      props.theme.primary2
    } 90%)
    `};
  }
  &::after {
    display: block;
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

const SectionTitle = props => {
  const { children, ...other } = props;
  return (
    <ThemeContext.Consumer>
      {theme => (
        <StyledH2 {...other} theme={theme}>
          {children}
        </StyledH2>
      )}
    </ThemeContext.Consumer>
  );
};

export default SectionTitle;

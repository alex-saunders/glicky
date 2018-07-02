import React, { Component } from 'react';
import styled from 'styled-components';

import { ThemeContext } from '../../theme-context';

import logo from './logo.svg';

const Container = styled.aside`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const LogoWrapper = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.secondary1};
`;

const LogoImg = styled.img`
  height: 26px;
`;

const NavWrapper = styled.section`
  flex: 1;
  width: 100%;
  background: #fff;
  box-shadow: 0px 2px 4px rgba(126, 142, 177, 0.12);
`;

class Sidebar extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <Container>
            <LogoWrapper theme={theme}>
              <LogoImg src={logo} />
            </LogoWrapper>
            <NavWrapper theme={theme} />
          </Container>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default Sidebar;

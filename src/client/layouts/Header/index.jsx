import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Settings, LightbulbOutline } from '@material-ui/icons';
import SvgIcon from '@material-ui/core/SvgIcon';

import ThemedIconButton from '../../components/common/themed/ThemedIconButton';

import { ThemeContext } from '../../theme-context';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 32px;
`;
const Name = styled.h1`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${props => props.theme.primary1};
  margin: 0;
`;

class Header extends Component {
  static propTypes = {
    projectName: PropTypes.string
  };
  static defaultProps = {
    projectName: ''
  };

  state = {
    active: false
  };

  toggleActive = () => {
    this.setState({
      active: !this.state.active
    });
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <StyledHeader>
            <Name theme={theme}>{this.props.projectName}</Name>
            <div>
              <ThemedIconButton secondary onClick={this.toggleActive}>
                {this.state.active ? (
                  <SvgIcon>
                    <svg viewBox="0 0 24 24">
                      <path d="m9,21c0,0.55 0.45,1 1,1l4,0c0.55,0 1,-0.45 1,-1l0,-1l-6,0l0,1zm3,-19c-3.86,0 -7,3.14 -7,7c0,2.38 1.19,4.47 3,5.74l0,2.26c0,0.55 0.45,1 1,1l6,0c0.55,0 1,-0.45 1,-1l0,-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7z" />
                    </svg>
                  </SvgIcon>
                ) : (
                  <LightbulbOutline />
                )}
              </ThemedIconButton>
              <ThemedIconButton secondary>
                <Settings />
              </ThemedIconButton>
            </div>
          </StyledHeader>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default Header;

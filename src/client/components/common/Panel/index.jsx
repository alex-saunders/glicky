import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PanelWrapper = styled.article`
  box-shadow: ${props => {
    switch (props.elevation) {
      case 0:
        return 'none';
      case 1:
        return '0px 2px 4px rgba(126,142,177,0.12)';
      default:
        return '0px 5px 12px rgba(126,142,177,0.2)';
    }
  }};
  background: #ffffff;
  border-radius: 5px;
  overflow: hidden;
`;

const PanelTitle = styled.h3`
  color: rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.7px;
  margin: 12px 0;
`;

class Panel extends Component {
  static propTypes = {
    elevation: PropTypes.number
  };
  static defaultProps = {
    elevation: 1
  };

  render() {
    const { elevation, children, className, ...other } = this.props;
    return (
      <PanelWrapper elevation={elevation} className={className} {...other}>
        {children}
      </PanelWrapper>
    );
  }
}

const Title = props => {
  const { className, children, ...other } = props;
  return (
    <PanelTitle className={className} {...other}>
      {children}
    </PanelTitle>
  );
};

export default Panel;
export { Title };

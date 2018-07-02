import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ThemedCheckbox from '../../common/themed/ThemedCheckbox';

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: flex-end; */
  align-items: center;

  > button {
    margin-left: 8px;
  }
`;

class Dependency extends Component {
  anchorEl = null;

  state = {
    menuActive: false
  };

  handleOpen = e => {
    this.anchorEl = e.target;
    this.setState({
      menuActive: true
    });
  };
  handleClose = e => {
    this.setState({
      menuActive: false
    });
  };

  render() {
    const { dependency, classes } = this.props;

    return (
      <TableRow>
        <TableCell
          classes={{
            root: classes.checkboxCell
          }}
        >
          <ThemedCheckbox />
        </TableCell>
        <TableCell
          classes={{
            root: `${classes.cellRoot} ${classes.breakAll}`
          }}
        >
          <a href={`https://www.npmjs.com/package/${dependency.name}`}>
            {dependency.name}
          </a>
        </TableCell>
        <TableCell
          numeric
          classes={{
            root: `${classes.cellRoot} ${classes.mono}`
          }}
        >
          {dependency.version}
        </TableCell>
        <TableCell
          classes={{
            root: `${classes.cellRoot}`
          }}
        >
          <ActionsWrapper>
            {dependency.type}
            {/* <IconButton onClick={this.handleOpen}>
              <MoreVert />
            </IconButton> */}
            <Menu
              anchorEl={this.anchorEl}
              open={this.state.menuActive}
              onClose={this.handleClose}
            >
              <MenuItem
                classes={{ root: classes.listItemRoot }}
                onClick={this.handleClose}
              >
                Update to Latest Version
              </MenuItem>
              <MenuItem
                classes={{ root: classes.listItemRoot }}
                onClick={this.handleClose}
              >
                Set Dependency Version
              </MenuItem>
              <MenuItem
                classes={{ root: classes.listItemRoot }}
                onClick={this.handleClose}
              >
                Remove Dependency
              </MenuItem>
            </Menu>
          </ActionsWrapper>
        </TableCell>
      </TableRow>
    );
  }
}

const styles = {
  cellRoot: {
    padding: '8px 16px'
    // paddingRight: '16px !important'
  },
  checkboxCell: {
    padding: '8px'
  },
  breakAll: {
    wordBreak: 'break-all'
  },
  breakWord: {
    wordBreak: 'break-word'
  },
  mono: {
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '12px'
  },
  listItemRoot: {
    fontSize: '14px',
    height: '16px'
  }
};

export default withStyles(styles)(Dependency);

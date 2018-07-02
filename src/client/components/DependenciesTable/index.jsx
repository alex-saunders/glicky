import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import ThemedCheckbox from '../common/themed/ThemedCheckbox';
import EnhancedTH from './EnhancedTableHeader/EnhancedTH';
import Dependency from './Dependency';

import { TableContext } from './table-context';

const TableWrapper = styled.div`
  padding-bottom: 12px;

  th:nth-child(1) {
    width: 10%;
  }
  th:nth-child(2) {
    width: 40%;
  }
  th:nth-child(3) {
    width: 20%;
  }
  th:nth-child(4) {
    width: 30%;
  }
`;

class DependenciesTable extends Component {
  static propTypes = {
    package: PropTypes.object.isRequired,
    searchQuery: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      dependencies: [],
      sortedDependencies: [],
      setSortingParam: this.setSortingParam,
      activeSortingParam: 'name',
      ascSort: true,
      tableIndex: 0,
      numRows: 5
    };
  }

  componentDidMount() {
    this.parseDependencies(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.parseDependencies(nextProps);
  }

  handleChangeRows = e => {
    this.setState({
      numRows: e.target.value
    });
  };

  handleChangePage = (e, page) => {
    this.setState({
      tableIndex: page
    });
  };

  parseDependencies(props) {
    let dependenciesArr = [];

    if (props.package.dependencies) {
      let { dependencies, devDependencies } = props.package;

      for (let key of Object.keys(dependencies)) {
        dependenciesArr.push({
          name: key,
          version: dependencies[key],
          type: 'Core Dependency'
        });
      }
      for (let key of Object.keys(devDependencies)) {
        dependenciesArr.push({
          name: key,
          version: devDependencies[key],
          type: 'Dev Dependency'
        });
      }
    }

    const sortedDependencies = this.sortDeps(
      dependenciesArr,
      this.state.activeSortingParam,
      this.state.ascSort,
      props.searchQuery
    );
    this.setState({
      dependencies: dependenciesArr,
      sortedDependencies
    });
  }

  sortDeps(deps, param, ascSort, searchQuery) {
    const compare = (a, b, param) => {
      return a[param].toLowerCase().localeCompare(b[param].toLowerCase());
    };

    const sortedDeps = [...deps]
      .filter(dep => dep.name.match(searchQuery))
      .sort((a, b) => {
        const comp = compare(a, b, param);
        if (comp === 0) {
          const nameCompare = compare(a, b, 'name');
          return ascSort
            ? nameCompare
            : nameCompare === -1
              ? 1
              : nameCompare === 1
                ? -1
                : nameCompare;
        }
        return comp;
      });
    return ascSort ? sortedDeps : sortedDeps.reverse();
  }

  setSortingParam = param => {
    let sortedDependencies = [];
    let ascSort = true;

    if (this.state.activeSortingParam === param) {
      ascSort = !this.state.ascSort;
    }
    sortedDependencies = this.sortDeps(
      this.state.dependencies,
      param,
      ascSort,
      this.props.searchQuery
    );

    this.setState({
      sortedDependencies: sortedDependencies,
      activeSortingParam: param,
      ascSort
    });
  };

  render() {
    const { classes } = this.props;
    const { tableIndex, numRows, sortedDependencies } = this.state;

    return (
      <TableContext.Provider value={this.state}>
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  classes={{
                    root: classes.checkboxCell
                  }}
                >
                  <ThemedCheckbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked
                    }}
                  />
                </TableCell>
                <EnhancedTH sortable header="name" />
                <EnhancedTH header="version" numeric />
                <EnhancedTH sortable header="type" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDependencies
                .slice(tableIndex * numRows, tableIndex * numRows + numRows)
                .map(dependency => (
                  <Dependency dependency={dependency} key={dependency.name} />
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  classes={{
                    toolbar: classes.toolbar
                  }}
                  colSpan={4}
                  rowsPerPageOptions={[5, 10, 20]}
                  rowsPerPage={numRows}
                  count={sortedDependencies.length}
                  page={tableIndex}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRows}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableWrapper>
      </TableContext.Provider>
    );
  }
}

const styles = {
  root: {
    padding: '4px 16px'
  },
  checkboxCell: {
    padding: '4px 8px'
  },
  toolbar: {
    paddingRight: '16px'
  }
};

export default withStyles(styles)(DependenciesTable);

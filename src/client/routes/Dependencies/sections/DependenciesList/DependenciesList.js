// @flow
import React, { Fragment, Component } from 'react';
import idx from 'idx';
import Ink from 'react-ink';
import { PoseGroup } from 'react-pose';

import { Text, Modal, Button, Spacing, Spinner } from '~/components';

import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';
import {
  withDependencies,
  type DependenciesContextProps
} from '~/context/DependenciesContext';

import type { Sort, Dependency } from '../../../../../types';

import {
  Header,
  SortContainer,
  SortIcon,
  SortText,
  Row,
  RowSection,
  Cell,
  PanelWrapper,
  StyledDependencyPanel,
  OutdatedIcon,
  IconHolder,
  DeleteIcon,
  Name
} from './DependenciesList.styles';

type SortKey = 'name' | 'type';

type Props = SocketContextProps &
  DependenciesContextProps & {
    filteredDependencies: Array<Dependency>
  };

type State = {
  expandedItem: boolean,
  expandedDependency?: Dependency,
  installedVersions?: {
    [string]: {
      version: string
    }
  },
  sort: Sort<SortKey>,
  deletingDependency: boolean,
  modalOpen: boolean
};

class DependenciesList extends Component<Props, State> {
  static defaultProps = {};

  state = {
    expandedItem: false,
    modalOpen: false,
    deletingDependency: false,
    sort: {
      key: 'name',
      order: 'asc'
    }
  };

  componentDidMount() {
    this.getInstalledVersions();
  }

  getInstalledVersions() {
    const { socket } = this.props;

    socket.emit(
      'request',
      {
        resource: 'installed-versions'
      },
      installedVersions => {
        this.setState({
          installedVersions
        });
      }
    );
  }

  sortDependencies(dependencies: Array<Dependency>) {
    const { key, order } = this.state.sort;

    const sortedDependencies = [...dependencies].sort((a, b) => {
      return a[key] < b[key]
        ? order === 'asc'
          ? -1
          : 1
        : a[key] > b[key]
        ? order === 'asc'
          ? 1
          : -1
        : // fallback to sorting by name if values are the same
        // (e.g sorting by dependency type is likely to be the same)
        a.name < b.name
        ? -1
        : 1;
    });

    return sortedDependencies;
  }

  setSort = (sortKey: SortKey) => {
    this.setState(prevState => ({
      sort: {
        key: sortKey,
        order:
          prevState.sort.key === sortKey
            ? prevState.sort.order === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc'
      }
    }));
  };

  togglePanel = (dependency: Dependency) => {
    if (this.state.expandedItem && this.state.expandedDependency) {
      const { expandedDependency } = this.state;
      if (expandedDependency.name === dependency.name) {
        return this.setState({
          expandedItem: false
        });
      }
      return this.setState({
        expandedDependency: dependency,
        expandedItem: true
      });
    }
    this.setState({
      expandedItem: true,
      expandedDependency: dependency
    });
  };

  handleDependencyRequestDelete = () => {
    this.setState({
      modalOpen: true
    });
  };

  handleModalRequestClose = () => {
    this.setState({
      modalOpen: false
    });
  };

  handleDependencyDelete = () => {
    if (!this.state.expandedDependency || this.state.deletingDependency) {
      return;
    }
    const { expandedDependency } = this.state;

    this.setState(
      {
        deletingDependency: true
      },
      () => {
        this.props
          .deleteDependency(expandedDependency)
          .then(() => {
            this.setState({
              deletingDependency: false,
              modalOpen: false
            });
          })
          .catch(() => {
            // handle error case
          });
      }
    );
  };

  render() {
    const { filteredDependencies } = this.props;

    const sortedDependencies = this.sortDependencies(filteredDependencies);

    return (
      <Fragment>
        <Header>
          <Row>
            <RowSection>
              <Cell onClick={() => this.setSort('name')}>
                <SortContainer>
                  <SortIcon
                    isActive={this.state.sort.key === 'name'}
                    direction={this.state.sort.order}
                  />
                  <SortText isActive={this.state.sort.key === 'name'}>
                    {'Name'}
                  </SortText>
                </SortContainer>
              </Cell>
            </RowSection>
            <RowSection>
              <Cell numeric>{'Package Version'}</Cell>
              <Cell onClick={() => this.setSort('type')}>
                <SortContainer>
                  <SortIcon
                    isActive={this.state.sort.key === 'type'}
                    direction={this.state.sort.order}
                  />
                  <SortText isActive={this.state.sort.key === 'type'}>
                    {'Type'}
                  </SortText>
                </SortContainer>
              </Cell>
            </RowSection>
          </Row>
        </Header>
        {sortedDependencies.map(dependency => {
          const installedVersion =
            this.state.installedVersions &&
            idx(this.state.installedVersions, _ => _[dependency.name].version);

          const expanded =
            this.state.expandedItem &&
            this.state.expandedDependency &&
            this.state.expandedDependency.name === dependency.name;

          return (
            <PanelWrapper
              key={dependency.name}
              pose={expanded ? 'active' : 'inactive'}
              active={expanded}
            >
              <StyledDependencyPanel
                dependency={dependency}
                active={expanded}
                installedVersion={installedVersion}
                onRequestDelete={this.handleDependencyRequestDelete}
                renderTitle={() => (
                  <Row onClick={() => this.togglePanel(dependency)}>
                    <RowSection>
                      <Cell breakWord>
                        {dependency.outdated && <OutdatedIcon>!</OutdatedIcon>}
                        <Name outdated={dependency.outdated}>
                          {' '}
                          <Text size="sm2" spacing="medium">
                            {dependency.name}
                          </Text>
                        </Name>
                      </Cell>
                    </RowSection>
                    <RowSection>
                      <Cell numeric>
                        <Text size="sm2" spacing="medium">
                          {dependency.version}
                        </Text>
                      </Cell>
                      <Cell breakWord>
                        <Text size="sm2" spacing="medium">
                          {dependency.type}
                        </Text>
                      </Cell>
                    </RowSection>
                    <Ink />
                  </Row>
                )}
              />
            </PanelWrapper>
          );
        })}

        <Modal
          isActive={!!this.state.modalOpen}
          onRequestClose={this.handleModalRequestClose}
          title="Are you sure?"
          renderBody={() =>
            this.state.expandedDependency && (
              <Text tag="p" size="s0">
                {'Are you sure you want to delete'}
                <Text font="'Roboto Mono',monospace">{` ${
                  this.state.expandedDependency.name
                }`}</Text>
                {'?'}
              </Text>
            )
          }
          renderFooter={() =>
            this.state.expandedDependency && (
              <Fragment>
                <Button type="ghost" onClick={this.handleModalRequestClose}>
                  Cancel
                </Button>
                <Spacing left="sm" />
                <Button
                  type="error"
                  icon={
                    <PoseGroup>
                      {this.state.deletingDependency ? (
                        <IconHolder key="deletingDependency">
                          <Spinner size="md" colour="white" lineWidth={3} />
                        </IconHolder>
                      ) : (
                        <IconHolder key="notDeletingDependency">
                          <DeleteIcon />
                        </IconHolder>
                      )}
                    </PoseGroup>
                  }
                  onClick={this.handleDependencyDelete}
                >
                  Remove
                </Button>
              </Fragment>
            )
          }
        />
      </Fragment>
    );
  }
}

export default withDependencies(withSocketContext(DependenciesList));

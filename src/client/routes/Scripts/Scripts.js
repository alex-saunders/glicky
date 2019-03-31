// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';

import { type ThemeProps } from '~/theme';
import { Title, Modal, Text, Button, Spacing, Select } from '~/components';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import { withSearch, type SearchContextProps } from '~/context/SearchContext';

import type { Script, Sort } from '../../../types';

import Delete from './assets/Delete.js';

import ScriptPanel from './sections/ScriptPanel';
import AddScript from './sections/AddScript';

const Section = posed.div({
  routeEnter: { x: 0, opacity: 1, delay: 300 },
  routeExit: { x: -50, opacity: 0 }
});

const Content = posed.div({
  scriptEnter: {
    opacity: 1,
    transition: { ease: 'linear', duration: 300 }
  },
  scriptExit: { opacity: 0 }
});

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const SelectWrapper = styled.div`
  width: ${(p: ThemeProps) => p.theme.sizing(4.5)};
`;

const sortOptions = {
  default: 'Package.json order',
  alphabetical: 'A-Z',
  executing: 'Prioritise running scripts'
};

type SortKey = $Keys<typeof sortOptions>;

type Props = SearchContextProps & ScriptsContextProps;

type State = {
  // selected script for deletion
  selectedScript?: ?{
    id: string,
    name: string
  },
  sort: Sort<SortKey>
};

class Scripts extends React.Component<Props, State> {
  state = {
    sort: {
      key: 'default',
      order: 'asc'
    }
  };

  componentDidMount() {
    this.props.updateSearchLabel('Search scripts');

    if (Object.keys(this.props.scripts).length < 1) {
      setTimeout(() => {
        this.props.fetchScripts();
      }, 1500);
    }
  }

  filterScripts(scripts: { [string]: Script }) {
    const { searchTerm } = this.props;
    const scriptIds = Object.keys(scripts);

    return scriptIds.filter(id => {
      const script = scripts[id];
      return (
        script &&
        (script.name.match(searchTerm) || script.command.match(searchTerm))
      );
    });
  }

  sortScripts(scriptIds: Array<string>) {
    const { scripts } = this.props;
    const { key } = this.state.sort;

    const sortedScriptIds = [...scriptIds].sort((a, b) => {
      const scriptA = scripts[a];
      const scriptB = scripts[b];

      return key === 'default'
        ? 0 // default package.json order
        : key === 'alphabetical'
        ? scriptA.name < scriptB.name
          ? -1 // alphabetical order
          : 1
        : scriptA.executing && !scriptB.executing
        ? 1 // prioritising executing scripts
        : scriptB.executing && !scriptA.executing
        ? -1
        : scriptA.name < scriptB.name
        ? -1 // falling back to ordering alphabetically
        : 1;
    });
    return sortedScriptIds;
  }

  handleScriptSave = async (scriptId: string, newScript: Script) => {
    this.props.updateScript(scriptId, newScript);
  };

  handleScriptDelete = (scriptId: string) => {
    this.props.deleteScript(scriptId).then(() => {
      this.setState({
        selectedScript: null
      });
      this.props.fetchScripts();
    });
  };

  handleRequestScriptDelete = (scriptId: string) => {
    this.setState({
      selectedScript: {
        id: scriptId,
        name: this.props.scripts[scriptId].name
      }
    });
  };

  handleModalRequestClose = () => {
    this.setState({
      selectedScript: null
    });
  };

  handleSortChange = (key: SortKey) => {
    this.setState({
      sort: {
        key,
        order: 'asc'
      }
    });
  };

  render() {
    const { scripts } = this.props;

    const filteredScripts = this.filterScripts(scripts);

    return (
      <Fragment>
        <AddScript />
        <Section>
          <TitleRow>
            <Title>Scripts</Title>
            <SelectWrapper>
              <Select
                value={this.state.sort.key}
                options={Object.entries(sortOptions).map(([key, label]) => ({
                  value: key,
                  label: String(label)
                }))}
                onChange={this.handleSortChange}
              />
            </SelectWrapper>
          </TitleRow>

          {filteredScripts.length > 0 &&
            this.sortScripts(filteredScripts).map(scriptId => (
              <ScriptPanel
                key={scriptId}
                script={scripts[scriptId]}
                scriptId={scriptId}
                onSave={this.handleScriptSave.bind(null, scriptId)}
                onRequestDelete={this.handleRequestScriptDelete.bind(
                  null,
                  scriptId
                )}
              />
            ))}
        </Section>

        <Modal
          isActive={!!this.state.selectedScript}
          onRequestClose={this.handleModalRequestClose}
          title="Are you sure?"
          renderBody={() =>
            this.state.selectedScript && (
              <Text tag="p" size="s0">
                {'Are you sure you want to delete'}
                <Text font="'Roboto Mono',monospace">{` ${
                  this.state.selectedScript.name
                }`}</Text>
                {'? This action cannot be reversed.'}
              </Text>
            )
          }
          renderFooter={() =>
            this.state.selectedScript && (
              <Fragment>
                <Button type="ghost" onClick={this.handleModalRequestClose}>
                  Cancel
                </Button>
                <Spacing left="sm" />
                <Button
                  type="error"
                  icon={<Delete fill="white" />}
                  onClick={this.handleScriptDelete.bind(
                    null,
                    this.state.selectedScript.id
                  )}
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

export default withScriptsContext(withSearch(Scripts));

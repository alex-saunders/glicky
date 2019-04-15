// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

import { type ThemeProps } from '~/theme';
import {
  Title,
  Modal,
  Text,
  Button,
  Spacing,
  Select,
  Icon
} from '~/components';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import { withSearch, type SearchContextProps } from '~/context/SearchContext';

import type { Script, Sort } from '../../../types';

import ScriptPanel from './sections/ScriptPanel';

const ScriptsContainer = posed.div({
  scriptsLoaded: {
    staggerChildren: 50
  }
});

const ScriptWrapper = posed.div({
  scriptsLoaded: {
    opacity: 1,
    transition: { ease: 'linear', duration: 300 }
  },
  scriptsLoading: { opacity: 0 }
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

const SORT_OPTIONS = {
  default: 'Package.json order',
  alphabetical: 'A-Z'
};

const DeleteIcon = styled(Icon).attrs({
  type: 'remove'
})`
  fill: ${(p: ThemeProps) => p.theme.colour('white')};
`;

type SortKey = $Keys<typeof SORT_OPTIONS>;

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

      // alphabetical order
      if (key === 'alphabetical') {
        return scriptA.name < scriptB.name ? -1 : 1;
      }

      // default sort order - package.json order
      return 0;
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
        <TitleRow>
          <Title>Scripts</Title>
          <SelectWrapper>
            <Select
              value={this.state.sort.key}
              options={Object.keys(SORT_OPTIONS).map(key => ({
                value: key,
                label: SORT_OPTIONS[key]
              }))}
              onChange={this.handleSortChange}
            />
          </SelectWrapper>
        </TitleRow>

        <ScriptsContainer
          withParent={false}
          pose={filteredScripts.length > 0 ? 'scriptsLoaded' : 'scriptsLoading'}
        >
          {filteredScripts.length > 0 &&
            this.sortScripts(filteredScripts).map(scriptId => (
              <ScriptWrapper
                key={scriptId}
                initialPose="scriptsLoading"
                pose="scriptsLoaded"
              >
                <ScriptPanel
                  script={scripts[scriptId]}
                  scriptId={scriptId}
                  onSave={this.handleScriptSave.bind(null, scriptId)}
                  onRequestDelete={this.handleRequestScriptDelete.bind(
                    null,
                    scriptId
                  )}
                />
              </ScriptWrapper>
            ))}
        </ScriptsContainer>

        <Modal
          isActive={
            this.state.selectedScript ? !!this.state.selectedScript : false
          }
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
                  icon={<DeleteIcon />}
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

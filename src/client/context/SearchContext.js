// @flow
import React, { createContext, type Node, type ComponentType } from 'react';

export type SearchContextProps = {
  searchTerm: string,
  searchLabel: string,
  updateSearchTerm: string => void,
  updateSearchLabel: string => void
};
export const defaultSearchContext: SearchContextProps = {
  searchTerm: '',
  searchLabel: '',
  updateSearchTerm: () => {},
  updateSearchLabel: () => {}
};
export const Context = createContext(defaultSearchContext);

type Props = {
  children: Node
};

type State = {
  searchTerm: string,
  searchLabel: string
};

class SearchContextProvider extends React.Component<Props, State> {
  state = {
    searchTerm: '',
    searchLabel: ''
  };

  updateSearchTerm = (searchTerm: string) => {
    this.setState({
      searchTerm
    });
  };

  updateSearchLabel = (searchLabel: string) => {
    this.setState({
      searchLabel
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          searchTerm: this.state.searchTerm,
          searchLabel: this.state.searchLabel,
          updateSearchTerm: this.updateSearchTerm,
          updateSearchLabel: this.updateSearchLabel
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export function withSearch<Props: {}>(Component: ComponentType<Props>) {
  return function WrappedComponent(props: Props) {
    return (
      <Context.Consumer>
        {({ searchTerm, searchLabel, updateSearchLabel, updateSearchTerm }) => (
          <Component
            {...props}
            searchTerm={searchTerm}
            searchLabel={searchLabel}
            updateSearchLabel={updateSearchLabel}
            updateSearchTerm={updateSearchTerm}
          />
        )}
      </Context.Consumer>
    );
  };
}

export default {
  Provider: SearchContextProvider,
  Consumer: Context.Consumer
};

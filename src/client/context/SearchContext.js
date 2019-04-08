// @flow
import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';

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
export const Context = createContext<SearchContextProps>(defaultSearchContext);

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

export const withSearch = <P>(
  WrappedComponent: ComponentType<*>
): ComponentType<P> => {
  return class WithSettingsContext extends Component<P> {
    render() {
      return (
        <Context.Consumer>
          {contextProps => (
            <WrappedComponent {...contextProps} {...this.props} />
          )}
        </Context.Consumer>
      );
    }
  };
};

export default {
  Provider: SearchContextProvider,
  Consumer: Context.Consumer
};

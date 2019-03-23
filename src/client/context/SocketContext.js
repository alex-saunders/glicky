// @flow

import React, {
  createContext,
  Component,
  type Node,
  type ComponentType
} from 'react';
import io, { type Socket } from 'socket.io-client';

export type SocketContextProps = {
  socket: ?Socket
};

export const defaultSocketContext: SocketContextProps = {
  socket: null
};

export const Context = createContext(defaultSocketContext);

type Props = {
  children: Node
};

export const SocketContextProvider = ({ children }: Props) => (
  <Context.Provider
    value={{
      socket: io()
    }}
  >
    {children}
  </Context.Provider>
);

export default {
  Provider: SocketContextProvider,
  Consumer: Context.Consumer
};

export const withSocketContext = <P>(
  WrappedComponent: ComponentType<*>
): ComponentType<P> => {
  return class WithSocketContext extends Component<P> {
    render() {
      return (
        <Context.Consumer>
          {({ socket }) => <WrappedComponent socket={socket} {...this.props} />}
        </Context.Consumer>
      );
    }
  };
};

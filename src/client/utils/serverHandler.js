// @flow

import io, { type Socket } from 'socket.io-client';

interface Server {
  request(req: string, opts: {} | string | number): Promise<any>;
  on(event: string, callback: (any) => void): void;
  off(event: string, callback: (any) => void): void;
}

/**
 * ServerHandler provides abstractions above whatever technology we are
 * using to communicate with the server, helping to make other util
 * classes/functons that communicate with the server be technology agnostic
 */
class ServerHandler implements Server {
  // Currently, ServerHandler uses socket.io for WebSocket-based communcation
  socket: Socket = io();

  events: {
    [event: string]: (any) => void
  } = {};

  // request directly asks the server for a resource/task and awaits the response.
  // In this case, it is an alias for socket.emit, that resolves a promise instead
  // of using callbacks
  request = (req: string, { resource, ...rest }: Object) => {
    return new Promise<any>(resolve => {
      this.socket.emit(
        req,
        {
          resource,
          options: rest
        },
        resolve
      );
    });
  };

  // on and off are for add/removeEventListener style communications with the
  // server, where a response may not be directly recieved. In this case, they
  // are an alias for socket.on/off, which also deal with unregistering events
  // when appropriate
  on = (event: string, callback: any => void) => {
    this.unregisterEvents();
    this.events[event] = callback;
    this.registerEvents();
  };

  off = (event: string, callback: any => void) => {
    this.socket.off(event, callback);
    const newEvents = { ...this.events };
    delete newEvents[event];
    this.events = newEvents;
  };

  registerEvents = () => {
    const events = Object.keys(this.events);
    for (let event of events) {
      this.socket.on(event, this.events[event]);
    }
  };

  unregisterEvents = () => {
    const events = Object.keys(this.events);
    for (let event of events) {
      this.socket.off(event, this.events[event]);
    }
  };
}

const instance = new ServerHandler();
export default instance;

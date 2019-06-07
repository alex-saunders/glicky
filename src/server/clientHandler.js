// @flow
import { type Server } from 'http';
import socket, { type Socket } from 'socket.io';

import { log } from './utils';

import {
  ProcessEvents,
  DependencyEvents,
  ScriptEvents,
  SettingsEvents,
  PackageEvents
} from './eventHandlers';

type Handlers = {
  [string]: (options: any) => Promise<any>
};

/**
 * ClientHandler provides the methods that we use to communicate with the client
 * but abstracts this away from the various event handlers, so that this is the only
 * class that is concerned with the technical specifics of talking to
 * the client.
 */
class ClientHandler {
  constructor(server: Server) {
    // Currently, ClientHandler uses socket.io for WebSocket-based communcation
    const io = socket(server);
    io.on('connection', socket => {
      log(`new connection ${socket.id}`);

      this.setupEvents(socket);
    });
  }

  // Socket.io provides a callback-based implementation of
  // returning responses to the client.
  // Here, we return a promise from each handler that calls
  // the given callback when it resolves.
  executeHandler = (handlers: Handlers) => (
    { resource, options }: { resource: string, options: Object },
    cb: any => void
  ) => {
    if (handlers[resource]) {
      handlers[resource](options)
        .then(cb)
        .catch(err =>
          log(
            `The following error occured while requesting resource: ${resource}, with options: ${options}`,
            err
          )
        );
    }
  };

  // Setup all events that the client may send
  setupEvents = (socket: Socket) => {
    const handlers = {
      process: {
        asyncProcess: ProcessEvents.asyncProcessHandler.bind(
          null,
          (code, data) => socket.emit(code, data)
        ),
        syncProcess: ProcessEvents.syncProcessHandler,
        killProcess: ProcessEvents.killProcessHandler,
        prompt: ProcessEvents.getPrompt
      },
      dependency: {
        packageInfo: DependencyEvents.getPackageInfo,
        installedVersion: DependencyEvents.getInstalledVersion,
        installedVersions: DependencyEvents.getAllInstalledVersions,
        addDependency: DependencyEvents.addDependency,
        removeDependency: DependencyEvents.removeDependency
      },
      package: {
        packageField: PackageEvents.getResourceFromPackage
      },
      script: {
        addScript: ScriptEvents.addScript,
        removeScript: ScriptEvents.removeScript
      },
      settings: {
        getSettings: SettingsEvents.getSettings,
        setSettings: SettingsEvents.setSettings
      }
    };

    for (let resource of Object.keys(handlers)) {
      socket.on(resource, this.executeHandler(handlers[resource]));
    }
  };
}

export default ClientHandler;

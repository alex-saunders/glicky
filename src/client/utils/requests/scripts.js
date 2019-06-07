// @flow
import Server from '../serverHandler';

export const addScript = (scriptName: string, scriptCommand: string) => {
  return Server.request('script', {
    resource: 'addScript',
    scriptName: scriptName,
    scriptCommand: scriptCommand
  });
};

export const removeScript = (scriptName: string) => {
  return Server.request('script', {
    resource: 'removeScript',
    scriptName: scriptName
  });
};

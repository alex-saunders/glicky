// @flow
import Server from './serverUtils';

export const addScript = (scriptName: string, scriptCommand: string) => {
  return Server.request('request', {
    resource: 'add-script',
    scriptName: scriptName,
    scriptCommand: scriptCommand
  });
};

export const removeScript = (scriptName: string) => {
  return Server.request('request', {
    resource: 'delete-script',
    scriptName: scriptName
  });
};

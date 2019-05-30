// @flow
import Server from './serverUtils';

export const executeCommand = (command: string) => {
  return Server.request('exec', command);
};

export const spawnProcess = (command: string) => {
  return Server.request('spawn', command);
};

export const killProcess = (pid: number) => {
  return Server.request('kill', pid);
};

export const requestPrompt = () => {
  return Server.request('request', { resource: 'prompt' });
};

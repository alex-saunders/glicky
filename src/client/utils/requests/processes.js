// @flow
import Server from '../serverHandler';

export const executeCommand = (command: string) => {
  return Server.request('process', {
    resource: 'syncProcess',
    command
  });
};

export const spawnProcess = (command: string) => {
  return Server.request('process', {
    resource: 'asyncProcess',
    command
  });
};

export const killProcess = (pid: number) => {
  return Server.request('process', {
    resource: 'killProcess',
    pid
  });
};

export const requestPrompt = () => {
  return Server.request('process', { resource: 'prompt' });
};

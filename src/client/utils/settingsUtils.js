import Server from './serverUtils';

export const getSettings = () => {
  return Server.request('settings', null);
};

export const setSettings = settings => {
  return Server.request('settings', settings);
};

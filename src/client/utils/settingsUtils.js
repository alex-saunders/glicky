import Server from './serverUtils';

export const getSettings = () => {
  return Server.request('settings', {
    resource: 'getSettings'
  });
};

export const setSettings = settings => {
  return Server.request('settings', {
    resource: 'setSettings',
    settings
  });
};

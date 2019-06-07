// @flow
import Server from '../serverHandler';

export const getFromPackageJSON = (key: string) => {
  return Server.request('package', {
    resource: 'packageField',
    key
  });
};

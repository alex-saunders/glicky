// @flow
import Server from './serverUtils';

export const getFromPackageJSON = (key: string) => {
  return Server.request('package', key);
};

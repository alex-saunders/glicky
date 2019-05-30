// @flow
import Server from './serverUtils';

import type { DependencyType } from '../../types';

export const getInstalledVersions = () => {
  return Server.request('request', {
    resource: 'installed-versions'
  });
};

export const getDependencyInfo = (dependencyName: string) => {
  return Server.request('request', {
    resource: 'package-info',
    name: dependencyName
  });
};

export const addDependency = ({
  dependencyName,
  dependencyType
}: {
  dependencyName: string,
  dependencyType: DependencyType
}) => {
  return new Promise<void>((resolve, reject) => {
    Server.request('request', {
      resource: 'add-dependency',
      dependencyName: dependencyName,
      dependencyType: dependencyType
    }).then(res => {
      if (!res.error) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const removeDependency = ({
  dependencyName,
  dependencyType
}: {
  dependencyName: string,
  dependencyType: DependencyType
}) => {
  return new Promise<void>((resolve, reject) => {
    Server.request('request', {
      resource: 'remove-dependency',
      dependencyName,
      dependencyType
    }).then(res => {
      if (!res) {
        reject('did not recieve a response');
      }

      resolve(res);
    });
  });
};

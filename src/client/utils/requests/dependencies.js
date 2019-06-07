// @flow
import Server from '../serverHandler';

import type { DependencyType } from '../../../types';

export const getInstalledVersions = () => {
  return Server.request('dependency', {
    resource: 'installedVersions'
  });
};

export const getDependencyInfo = (dependencyName: string) => {
  return Server.request('dependency', {
    resource: 'packageInfo',
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
    Server.request('dependency', {
      resource: 'addDependency',
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
    Server.request('dependency', {
      resource: 'removeDependency',
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

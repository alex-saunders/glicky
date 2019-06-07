// @flow
import execa from 'execa';

import type { DependencyType } from '../../../types';

import { hasYarn } from '../../utils';

const parsePackageInfo = (info: Object) => {
  const {
    description,
    version,
    '_npmUser.name': authorName,
    '_npmUser.email': email,
    'time.modified': time,
    repository: repository,
    keywords
  } = info;

  let url;
  // only support git repos atm.
  if (repository && repository.type === 'git') {
    const matches = /((http|https):\/\/.*)\.git$/.exec(repository.url);
    // only support repos hosted on github atm
    if (matches && matches[1] && matches[1].includes('github')) {
      url = matches[1];
    }
  }

  return {
    description,
    version,
    author: {
      name: authorName,
      email
    },
    time,
    repository: url
      ? {
          host: 'github',
          url: url
        }
      : null,
    keywords: keywords || []
  };
};

type GetPackageInfoOpts = {
  name: string
};

const getPackageInfo = async ({ name }: GetPackageInfoOpts) => {
  const { stdout } = await execa.shell(
    `npm view ${name} --json description version _npmUser.name _npmUser.email time.modified repository keywords`
  );

  const info = JSON.parse(stdout);
  return parsePackageInfo(info);
};

const getAllInstalledVersions = async () => {
  const parseOutput = stdout => {
    const obj = JSON.parse(stdout);
    return obj && obj.dependencies;
  };

  return new Promise(async resolve => {
    try {
      const { stdout } = await execa.shell('npm list --depth=0 --json');

      resolve(parseOutput(stdout));
    } catch (err) {
      // command can return 'extraneous dependencies' error - which causes an
      // 'error' in execa
      // TODO: catch this specific error
      resolve(parseOutput(err.stdout));
    }
  });
};

type InstalledVersionOpts = {
  package: string
};

const getInstalledVersion = async ({ package: pkg }: InstalledVersionOpts) => {
  const installedVersions = await getAllInstalledVersions();
  return installedVersions && installedVersions[pkg];
};

type DependencyOpts = {
  dependencyName: string,
  dependencyType: DependencyType
};

const addDependency = async ({
  dependencyName,
  dependencyType
}: DependencyOpts) => {
  // detect if yarn is installed
  const yarnInstalled = await hasYarn();

  let command;
  if (yarnInstalled) {
    command = `yarn add ${dependencyName} ${
      dependencyType === 'devDependency'
        ? '--dev'
        : dependencyType === 'optionalDependency'
        ? '--optional'
        : ''
    }`;
  } else {
    command = `npm install ${dependencyName} ${
      dependencyType === 'devDependency'
        ? '--save-dev'
        : dependencyType === 'optionalDependency'
        ? '--save-optional'
        : '--save'
    }`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { stdout } = await execa.shell(command);
      resolve(stdout);
    } catch (err) {
      // eslint-disable-next-line
      reject(err);
    }
  });
};

const removeDependency = async ({
  dependencyName,
  dependencyType
}: DependencyOpts) => {
  const yarnInstalled = await hasYarn();

  let command;
  if (yarnInstalled) {
    command = `yarn remove ${dependencyName};`;
  } else {
    command = `npm uninstall ${dependencyName} ${
      dependencyType === 'devDependency'
        ? '--save-dev'
        : dependencyType === 'optionalDependency'
        ? '--save-optional'
        : '--save'
    }`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { stdout } = await execa.shell(command);
      resolve(stdout);
    } catch (err) {
      // eslint-disable-next-line
      reject(err);
    }
  });
};

export default {
  getPackageInfo,
  getAllInstalledVersions,
  getInstalledVersion,
  addDependency,
  removeDependency
};

// @flow
import os from 'os';
import path from 'path';
import http from 'http';
import express from 'express';
import socket from 'socket.io';
import chalk from 'chalk';
import readPkgUp from 'read-pkg-up';
import writePkg from 'write-pkg';
import execa from 'execa';
import minimist from 'minimist';

import type { DependencyType } from '../types';

import ProcessManager from './utils/processManager';
import SettingsManager from './utils/settings';

import { parsePackageInfo, log, hasYarn } from './utils';

const app = express();

const server = http.createServer(app);
const io = socket(server);

type ProcessMap = {
  [number]: ProcessManager
};

const processMap: ProcessMap = {};
const settingsManager = new SettingsManager();

const cwd = process.cwd();
const user = os.userInfo().username;
const prompt = chalk.white(`${user}: ~/${cwd.split('/').slice(-1)[0]} `);

async function getResourceFromPackage(key) {
  const { pkg } = await readPkgUp();
  if (key in pkg) {
    return pkg[key];
  } else return null;
}

async function getPackageInfo({ name }) {
  const { stdout } = await execa.shell(
    `npm view ${name} --json description version _npmUser.name _npmUser.email time.modified maintainers.name maintainers.email keywords`
  );

  const info = JSON.parse(stdout);
  return parsePackageInfo(info);
}

async function getAllInstalledVersions() {
  const parseOutput = stdout => {
    const obj = JSON.parse(stdout);
    return obj && obj.dependencies;
  };
  try {
    const { stdout } = await execa.shell('npm list --depth=0 --json');

    return parseOutput(stdout);
  } catch (err) {
    // command can return 'extraneous dependencies' error - which causes an
    // 'error' in execa
    return parseOutput(err.stdout);
  }
}

async function getInstalledVersion({ package: pkg }) {
  const installedVersions = await getAllInstalledVersions();
  return installedVersions && installedVersions[pkg];
}

async function deleteScript({ scriptName }) {
  const { pkg } = await readPkgUp();
  const { scripts: oldScripts } = pkg;
  if (scriptName in oldScripts) {
    const newScripts = Object.assign({}, oldScripts);
    delete newScripts[scriptName];

    await writePkg({
      ...pkg,
      scripts: newScripts
    });
    return newScripts;
  }
}

async function addScript({ scriptName, scriptCommand }) {
  const { pkg } = await readPkgUp();
  const { scripts: oldScripts } = pkg;

  const newScripts = Object.assign({}, oldScripts, {
    [scriptName]: scriptCommand
  });
  await writePkg({
    ...pkg,
    scripts: newScripts
  });
  return newScripts;
}

async function addDependency({
  dependencyName,
  dependencyType
}: {
  dependencyName: string,
  dependencyType: DependencyType
}) {
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

  try {
    const { stdout } = await execa.shell(command);

    return stdout;
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return {
      error: true
    };
  }
}

async function removeDependency({
  dependencyName,
  dependencyType
}: {
  dependencyName: string,
  dependencyType: DependencyType
}) {
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

  try {
    const { stdout } = await execa.shell(command);

    return stdout;
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return {
      error: true
    };
  }
}

io.on('connection', socket => {
  log(`new connection ${socket.id}`);

  // 'spawn' creates a new ProcessManager - used
  // primarly for async processes
  socket.on('spawn', (command, fn) => {
    const newProc = new ProcessManager(command, socket);
    processMap[newProc.id] = newProc;

    fn(newProc.id);
  });

  // killing a process (controlled by a ProcessManager)
  socket.on('kill', (pid: number, fn) => {
    const procManager = processMap[pid];

    console.log(procManager);
    procManager
      .kill()
      .then(fn)
      .catch(() => console.log('BIG ERROR'));
    // TODO - clear up processMap
  });

  // 'exec' executes a command and returns the output - used
  // for sync processes
  socket.on('exec', async (command, fn) => {
    try {
      const { stdout } = await execa.shell(command);
      fn(stdout);
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      fn(err.stdout);
    }
  });

  // 'request' is for requesting values returned by bespoke
  // functions defined on the server
  socket.on('request', async ({ resource, ...opts }, fn) => {
    switch (resource) {
      case 'prompt':
        fn(prompt);
        break;
      case 'package-info':
        fn(await getPackageInfo(opts));
        break;
      case 'installed-versions':
        fn(await getAllInstalledVersions());
        break;
      case 'installed-version':
        fn(await getInstalledVersion(opts));
        break;
      case 'delete-script':
        fn(await deleteScript(opts));
        break;
      case 'add-script':
        fn(await addScript(opts));
        break;
      case 'add-dependency':
        fn(await addDependency(opts));
        break;
      case 'remove-dependency':
        fn(await removeDependency(opts));
        break;
      default:
        null;
    }
  });

  // 'package' is for requesting information from package.json
  // via the 'key' param
  socket.on('package', async (key, fn) => {
    fn(await getResourceFromPackage(key));
  });

  // 'settings' is for getting/saving settings
  socket.on('settings', async (newSettings, fn) => {
    try {
      if (newSettings) {
        const settings = settingsManager.setSettings(newSettings);
        fn(settings);
      } else {
        fn(settingsManager.getSettings());
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      fn(err.stdout);
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../', 'client')));

  app.get('*', (req, res: express$Response) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
}

const args = minimist(process.argv.slice(2));
const port = args.port || 5000;

if (typeof port === 'string' || typeof port === 'number') {
  server.listen(parseInt(port), undefined, undefined, () => {
    // eslint-disable-next-line
    console.log(`🚀 CLI-GUI running on port ${port}!`);
  });
}

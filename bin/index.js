#!/usr/bin/env node
const clear = require('clear');

const glicky = require('commander');

const {
  logError,
  packagePresent,
  parseBoolean,
  parseInteger,
  startServer,
  getFreePort
} = require('./utils');

const { version } = require('../package');

('use strict');

// Register Glicky commands
glicky
  .version(version, '-v, --version')
  .usage('[options]')
  .option(
    '-o, --open <boolean>',
    'Open Glicky in default browser',
    parseBoolean,
    true
  )
  .option(
    '-p, --port <number>',
    'Open Glicky on the specified port number',
    parseInteger,
    5000
  )
  .parse(process.argv);

const { open, port } = glicky;

(async () => {
  try {
    if (!packagePresent()) {
      logError(
        'At the moment, Glicky does not support projects that have not been initialised with a package.json file. Please run `npm init` before running Glicky in this directory.'
      );
      throw Error();
    }
    clear();
    const freePort = await getFreePort(port);
    startServer(freePort, {
      open: open === true || open === 'true'
    });
  } catch (err) {
    process.exit();
  }
})();

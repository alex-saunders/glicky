#!/usr/bin/env node
/* eslint-disable */
const path = require('path');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const clear = require('clear');
const ora = require('ora');
const getPort = require('get-port');
const inquirer = require('inquirer');
const opn = require('opn');
const fs = require('fs');

const glicky = require('commander');
const { version } = require('../package');

('use strict');

// Log Utility
function logWarning(...params) {
  console.log(chalk.yellow.bold(...params));
}

function logError(...params) {
  console.log(chalk.red.bold(...params));
}

function packagePresent() {
  const packagePath = path.join(process.cwd(), 'package.json');
  return fs.existsSync(packagePath);
}

function parseBoolean(value) {
  return  value === 'true'
}

function parseInteger(value) {
  return parseInt(value);
}

// starts local server with given port and opens the application
// in the users default browser (if open === true)
function startServer(port, { open }) {
  clear();

  const loadingMessage = ora(`Starting CLI-GUI server on port ${port}`);
  loadingMessage.start();

  const serverPath = path.resolve(
    __dirname,
    '../',
    'dist',
    'server',
    'server.bundle.js'
  );

  const productionEnv = Object.create(process.env);
  productionEnv.GLICKY_ENV = 'production';
  productionEnv.FORCE_COLOR = 1;

  const proc = spawn('node', [serverPath, `--port=${port}`], {
    env: productionEnv
  });

  proc.stdout.on('data', data => {
    // TODO: do this better
    if (data.toString().startsWith('🚀')) {
      if (open) {
        opn(`http://localhost:${port}`);
      }
      loadingMessage.stop();
      printSuccessMessage(port);
    }
  });
}
function printSuccessMessage(port) {
  console.log(
    chalk.green(
      '🐭 Success! Glicky is now running and you can view it in your preferred browser at this URL:\n'
    )
  );
  console.log(`\t✨ http://localhost:${port} ✨\n`);
  logWarning('NOTE: This is an early pre-release. There will undoubtedly be bugs but it mostly works and important features are upcoming.');
  logWarning('Please report any bugs you encounter to the issues page on the Github repository:');
  console.log('🐞 https://github.com/alex-saunders/glicky/issues\n');
  console.log(chalk.grey('(press ctrl+C to stop Glicky at any time)'));
}
// is not free, falling back to a random port number if all of these are busy // e.g. check 5000 -> busy -> check 5001 -> busy -> ... -> check 5004 -> busy -> random port number // finds free port, using preferredPort as base and checking 4 above this if it
async function getFreePort(preferredPort = 5000) {
  const preferredPorts = Array.from(Array(5), (_, x) => preferredPort + x);
  const [initialPort, ...rest] = preferredPorts;
  let freePort = await getPort({ port: initialPort });
  if (freePort === initialPort) {
    return initialPort;
  }
  freePort = await getPort({ port: rest });
  return await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'portConfirmation',
        message: chalk.red(
          `Port ${initialPort} not available, would you like to start CLI-GUI on port ${freePort} instead?`
        ),
        default: true
      }
    ])
    .then(answers => {
      if (answers.portConfirmation) {
        return freePort;
      } else {
        console.log('Maybe next time then...');
        throw Error();
      }
    });
}

/**
 * Register Glicky commands
 */
glicky
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-o, --open <boolean>', 'Open Glicky in default browser', parseBoolean, true)
  .option('-p, --port <number>', 'Open Glicky is specified port number', parseInteger, 5000)
  .parse(process.argv);

const { open, port } = glicky;

(async () => {
  try {
    if (!packagePresent()) {
      logError('At the moment, Glicky does not support projects that have not been initialised with a package.json file. Please run `npm init` before running Glicky in this directory.');
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

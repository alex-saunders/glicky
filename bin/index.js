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
const minimist = require('minimist');

'use strict';

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
  productionEnv.NODE_ENV = 'production';
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
    }
    console.log(chalk.green(data));
  });
} 

// finds free port, using preferredPort as base and checking 4 above this if it 
// is not free, falling back to a random port number if all of these are busy 
// e.g. check 5000 -> busy -> check 5001 -> busy -> ... -> check 5004 -> busy -> random port number
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
          `Port 5000 not available, would you like to start CLI-GUI on port ${freePort} instead?`
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
clear();

const { open, port } = minimist(process.argv.slice(2), {
  default: {
    open: true,
    port: 5000
  }
});

(async () => {
  try {
    const freePort = await getFreePort(port);
    startServer(freePort, {
      open
    });
  } catch(err) {
    process.exit();
  }
})();

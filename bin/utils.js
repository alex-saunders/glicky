const getPort = require('get-port');
const inquirer = require('inquirer');
const path = require('path');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const clear = require('clear');
const ora = require('ora');
const opn = require('opn');
const fs = require('fs');
const boxen = require('boxen');
const ip = require('ip');

const log = console.log;

// Utilities
function logWarning(...params) {
  log(chalk.yellow(...params));
}

function logError(...params) {
  log(chalk.red.bold(...params));
}

function packagePresent() {
  const packagePath = path.join(process.cwd(), 'package.json');
  return fs.existsSync(packagePath);
}

function parseBoolean(value) {
  return value === 'true';
}

function parseInteger(value) {
  return parseInt(value);
}

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
        log('Maybe next time then...');
        throw Error();
      }
    });
}

function printSuccessMessage(port) {
  const box = boxen(
    `${chalk.green('Glicky is now running!')}\n
    ${chalk.bold('Local:')}            http://localhost:${port}
    ${chalk.bold('On your network:')}  http://${ip.address()}:${port}
    `,
    {
      padding: 1,
      borderColor: 'white'
    }
  );
  log(box, '\n');

  logWarning(
    'NOTE: This is an early pre-release. There will undoubtedly be bugs but it mostly works and important features are upcoming.'
  );
  logWarning(
    'Please report any bugs you encounter to the issues page on the Github repository: https://github.com/alex-saunders/glicky/issues\n'
  );
  log(chalk.grey('(press ctrl+C to stop Glicky at any time)'));
}
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
module.exports = {
  logError,
  packagePresent,
  parseBoolean,
  parseInteger,
  printSuccessMessage,
  startServer,
  getFreePort
};

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var execa = _interopDefault(require('execa'));
var cp = _interopDefault(require('child_process'));
var psTree = _interopDefault(require('ps-tree'));
var chalk = _interopDefault(require('chalk'));
var supportsColor = _interopDefault(require('supports-color'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var ospath = _interopDefault(require('ospath'));
require('@babel/polyfill');
var os = _interopDefault(require('os'));
var http = _interopDefault(require('http'));
var express = _interopDefault(require('express'));
var socket = _interopDefault(require('socket.io'));
var readPkgUp = _interopDefault(require('read-pkg-up'));
var writePkg = _interopDefault(require('write-pkg'));
var minimist = _interopDefault(require('minimist'));

const log = text => {
  // eslint-disable-next-line
  process.env.NODE_ENV !== 'production' && console.log(text);
};
const parsePackageInfo = info => {
  const {
    description,
    version,
    '_npmUser.name': authorName,
    '_npmUser.email': email,
    'time.modified': time,
    keywords
  } = info;
  const maintainerKeys = Object.keys(info).filter(key => {
    return key.startsWith('maintainers');
  });
  let maintainers; // only one maintainer - return 1 'author' object

  if (maintainerKeys.length === 2) {
    maintainers = [{
      name: info['maintainers.name'],
      email: info['maintainers.email']
    }];
  } // multiple maintainers - match up emails and name and return array of 'author' objects
  else if (maintainerKeys.length > 2) {
      maintainers = maintainerKeys.reduce((acc, key) => {
        // TODO: this is a fairly nasty reduce function - refactor
        const matches = /maintainers\[([0-9]+)\]\.(email|name)/.exec(key);
        const index = parseInt(matches[1], 10);
        const property = matches[2];
        acc[index] = { ...acc[index],
          [property]: info[key]
        };
        return acc;
      }, []);
    } else {
      maintainers = [];
    }

  return {
    description,
    version,
    author: {
      name: authorName,
      email
    },
    time,
    maintainers,
    keywords: keywords || []
  };
};
const hasYarn = async () => {
  const command = 'npm ls --depth 1 --json --global yarn';

  try {
    const {
      stdout
    } = await execa.shell(command);
    console.log('HAS YARN STDOUT:', stdout);
    const json = JSON.parse(stdout);
    return json && json.dependencies && Object.keys(json.dependencies).includes('yarn');
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return false;
  }
};

class ProcessManager {
  get id() {
    return this.pid;
  }

  constructor(command, socket$$1) {
    this.killing = false;
    this.executing = false;
    this.initCommand = command;
    this.socket = socket$$1;
    this.execute();
  }

  emit(code, data) {
    try {
      this.socket.emit(code, data);
    } catch (err) {
      // eslint-disable-next-line
      console.error('error occured');
    }
  }

  setupEvents() {
    this.proc.stdout.on('data', data => {
      if (data) {
        this.emitData(data);
      }
    });
    this.proc.stderr.on('data', err => {
      this.emitError(err);
    });
    this.proc.on('error', err => {
      this.emitError(err);
    });
    this.proc.on('uncaughtException', err => {
      this.emitError(err);
    });
    this.proc.on('close', (code, signal) => {
      log(`ProcessManager: child process ${this.pid} exited with code ${code} and signal ${signal}`);
      this.emitExit(code, signal);
    });
  }

  createErrorObject(err) {
    return {
      pid: this.pid,
      error: true,
      output: err ? chalk.red(err) : null
    };
  }

  createDataObject(data) {
    return {
      pid: this.pid,
      error: false,
      output: data || null
    };
  }

  emitData(data) {
    this.emit('data', this.createDataObject(data));
  }

  emitError(err) {
    this.executing = false;
    this.emit('processError', this.createErrorObject(err));
  }

  emitExit(code, signal) {
    this.executing = false;
    const exitMsg = chalk.grey(`child process exited with code ${code} and signal ${signal}`);
    this.emit('exit', this.createDataObject(exitMsg));
  }

  psTreeKill(signal = 'SIGKILL') {
    return new Promise((resolve, reject) => {
      {
        psTree(this.pid, (err, children) => {
          [this.pid].concat(children.map(p => p.PID)).forEach(tpid => {
            try {
              process.kill(tpid, signal);
            } catch (ex) {
              reject(this.emitError(ex));
            }
          });
          resolve();
        });
      }
    });
  }

  kill(signal = 'SIGKILL') {
    if (this.killing) {
      this.emitError();
    }

    if (!this.executing) {
      // child process has already exited
      this.emitError();
    }

    this.killing = true;
    const isWin = /^win/.test(process.platform);

    if (!isWin) {
      this.psTreeKill(signal).then(() => {
        this.executing = false;
        this.killing = false;
      }).catch(err => {
        this.killing = false;
        this.emitError(err);
      });
    } else {
      execa('taskkill /PID ' + this.pid + ' /T /F').then(() => {
        this.executing = false;
        this.killing = false;
      }).catch(err => {
        this.killing = false;
        this.emitError(err);
      });
    }
  }

  execute() {
    if (!this.initCommand) return;
    this.proc = cp.spawn(this.initCommand, [], {
      env: Object.assign({
        FORCE_COLOR: supportsColor.level
      }, process.env),
      shell: true
    });
    this.proc.stdout.setEncoding('utf8');
    this.proc.stderr.setEncoding('utf8'); // this.proc && this.proc.stdin.setEncoding('utf-8');

    this.executing = true;
    this.setupEvents();
    this.pid = this.proc.pid;
  }

}

const defaultSettings = {
  dark: false,
  primaryColour: '#2196f3',
  dependenciesCheckOnStartup: true,
  filterOutdatedDependencies: false
};
class SettingsManager {
  constructor() {
    this.settings = this._fetchSettings();
  }

  /**
   * 'Private' methods
   */
  _getProjectDataDirectory() {
    const dataPath = ospath.data();
    const projectDataPath = path.join(dataPath, 'Clicky');

    if (!fs.existsSync(projectDataPath)) {
      fs.mkdirSync(projectDataPath);
    }

    return projectDataPath;
  }

  _getSettingsPath() {
    const dataPath = this._getProjectDataDirectory();

    return path.join(dataPath, 'settings.json');
  }

  _fetchSettings() {
    const settingsPath = this._getSettingsPath();

    let settings = defaultSettings;

    if (fs.existsSync(settingsPath)) {
      const file = fs.readFileSync(settingsPath, 'utf8');
      settings = file ? JSON.parse(file) : settings;
    }

    return settings;
  }
  /**
   * 'Public' methods
   */


  getSettings() {
    return this.settings;
  }

  setSettings(newSettings) {
    this.settings = Object.assign({}, this.settings, newSettings);
    fs.writeFileSync(this._getSettingsPath(), JSON.stringify(this.settings), 'utf8');
    return this.settings;
  }

}

const app = express();
const server = http.createServer(app);
const io = socket(server);
const processMap = {};
const settingsManager = new SettingsManager();
const cwd = process.cwd();
const user = os.userInfo().username;
const prompt = chalk.white(`${user}: ~/${cwd.split('/').slice(-1)[0]} `);

async function getResourceFromPackage(key) {
  const {
    pkg
  } = await readPkgUp();

  if (key in pkg) {
    return pkg[key];
  } else return null;
}

async function getPackageInfo({
  name
}) {
  const {
    stdout
  } = await execa.shell(`npm view ${name} --json description version _npmUser.name _npmUser.email time.modified maintainers.name maintainers.email keywords`);
  const info = JSON.parse(stdout);
  return parsePackageInfo(info);
}

async function getAllInstalledVersions() {
  const parseOutput = stdout => {
    const obj = JSON.parse(stdout);
    return obj && obj.dependencies;
  };

  try {
    const {
      stdout
    } = await execa.shell('npm list --depth=0 --json');
    return parseOutput(stdout);
  } catch (err) {
    // command can return 'extraneous dependencies' error - which causes an
    // 'error' in execa
    return parseOutput(err.stdout);
  }
}

async function getInstalledVersion({
  package: pkg
}) {
  const installedVersions = await getAllInstalledVersions();
  return installedVersions && installedVersions[pkg];
}

async function deleteScript({
  scriptName
}) {
  const {
    pkg
  } = await readPkgUp();
  const {
    scripts: oldScripts
  } = pkg;

  if (scriptName in oldScripts) {
    const newScripts = Object.assign({}, oldScripts);
    delete newScripts[scriptName];
    await writePkg({ ...pkg,
      scripts: newScripts
    });
    return newScripts;
  }
}

async function addScript({
  scriptName,
  scriptCommand
}) {
  const {
    pkg
  } = await readPkgUp();
  const {
    scripts: oldScripts
  } = pkg;
  const newScripts = Object.assign({}, oldScripts, {
    [scriptName]: scriptCommand
  });
  await writePkg({ ...pkg,
    scripts: newScripts
  });
  return newScripts;
}

async function addDependency({
  dependencyName,
  dependencyType
}) {
  // detect if yarn is installed
  const yarnInstalled = await hasYarn();
  let command;

  if (yarnInstalled) {
    command = `yarn add ${dependencyName} ${dependencyType === 'devDependency' ? '--dev' : dependencyType === 'optionalDependency' ? '--optional' : ''}`;
  } else {
    command = `npm install ${dependencyName} ${dependencyType === 'devDependency' ? '--save-dev' : dependencyType === 'optionalDependency' ? '--save-optional' : '--save'}`;
  }

  try {
    const {
      stdout
    } = await execa.shell(command);
    return stdout;
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return {
      error: true
    };
  }
}

io.on('connection', socket$$1 => {
  log(`new connection ${socket$$1.id}`); // 'spawn' creates a new ProcessManager - used
  // primarly for async processes

  socket$$1.on('spawn', (command, fn) => {
    const newProc = new ProcessManager(command, socket$$1);
    processMap[newProc.id] = newProc;
    fn(newProc.id);
  }); // killing a process (controlled by a ProcessManager)

  socket$$1.on('kill', pid => {
    const procManager = processMap[pid];
    procManager.kill(); // TODO - clear up processMap
  }); // 'exec' executes a command and returns the output - used
  // for sync processes

  socket$$1.on('exec', async (command, fn) => {
    try {
      const {
        stdout
      } = await execa.shell(command);
      fn(stdout);
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      fn(err.stdout);
    }
  }); // 'request' is for requesting values returned by bespoke
  // functions defined on the server

  socket$$1.on('request', async ({
    resource,
    ...opts
  }, fn) => {
    switch (resource) {
      case 'prompt':
        fn(prompt);
        break;

      case 'package-info':
        fn((await getPackageInfo(opts)));
        break;

      case 'installed-versions':
        fn((await getAllInstalledVersions()));
        break;

      case 'installed-version':
        fn((await getInstalledVersion(opts)));
        break;

      case 'delete-script':
        fn((await deleteScript(opts)));
        break;

      case 'add-script':
        fn((await addScript(opts)));
        break;

      case 'add-dependency':
        fn((await addDependency(opts)));
        break;

      default:

    }
  }); // 'package' is for requesting information from package.json
  // via the 'key' param

  socket$$1.on('package', async (key, fn) => {
    fn((await getResourceFromPackage(key)));
  }); // 'settings' is for getting/saving settings

  socket$$1.on('settings', async (newSettings, fn) => {
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
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
}

const args = minimist(process.argv.slice(2));
const port = args.port || 5000;
server.listen(port, undefined, undefined, () => {
  // eslint-disable-next-line
  console.log(`🚀 CLI-GUI running on port ${port}!`);
});

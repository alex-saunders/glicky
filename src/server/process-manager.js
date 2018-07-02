const { Promisify } = require('util');
const { EventEmitter } = require('eventemitter3');
const cp = require('child_process');
const psTree = require('ps-tree');
const chalk = require('chalk');
const supportsColor = require('supports-color');

class ProcessManager extends EventEmitter {
  get process() {
    return this.proc || null;
  }

  constructor(command) {
    super();

    this.proc = null;
    this.pid = null;
    this.executing = false;
    this.killing = false;
    this.initCommand = command;
  }

  setupEvents() {
    this.proc.stdout.on('data', data => {
      const cleanedData = data.replace(/\r?\n|\r/g, ' ');
      if (data) {
        let obj = {
          pid: this.pid,
          output: data
        };
        this.emit('data', obj);
      }
    });

    this.proc.stderr.on('data', err => {
      this.emit('stdoutError', this.createErrorObject(err));
    });

    this.proc.on('error', err => {
      this.emitError(err);
    });

    this.proc.on('uncaughtException', err => {
      this.emitError(err);
    });

    this.proc.on('close', (code, signal) => {
      let obj = {
        pid: this.pid,
        output:
          code === 127
            ? ''
            : chalk.grey(
                `child process exited with code ${code} and signal ${signal}`
              )
      };
      console.log(
        `ProcessManager: child process ${
          this.pid
        } exited with code ${code} and signal ${signal}`
      );
      this.executing = false;
      this.emit('close', obj);
    });
  }

  createErrorObject(err = null) {
    return {
      pid: this.pid,
      error: true,
      output: chalk.red(err.toString().trim())
    };
  }

  emitError(err) {
    this.executing = false;
    this.emit('processError', this.createErrorObject(err));
  }

  psTreeKill(signal = 'SIGKILL') {
    let killTree = true;
    return new Promise((resolve, reject) => {
      if (killTree) {
        psTree(this.pid, (err, children) => {
          [this.pid].concat(children.map(p => p.PID)).forEach(tpid => {
            try {
              process.kill(tpid, signal);
            } catch (ex) {
              reject(this.createErrorObject(ex));
            }
          });
          resolve();
        });
      } else {
        try {
          process.kill(pid, signal);
        } catch (ex) {
          reject(this.createErrorObject(ex));
        }
        resolve();
      }
    });
  }

  execute() {
    this.proc = cp.spawn(this.initCommand, [], {
      env: Object.assign({ FORCE_COLOR: supportsColor.level }, process.env),
      shell: true
    });
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdin.setEncoding('utf-8');

    this.executing = true;
    this.setupEvents();

    this.pid = this.proc.pid;
  }

  kill(signal = 'SIGKILL') {
    return new Promise((resolve, reject) => {
      if (this.killing) {
        reject(this.createErrorObject());
      }
      if (!this.executing) {
        // child process has already exited
        reject(this.createErrorObject());
      }
      this.killing = true;
      const isWin = /^win/.test(process.platform);
      if (!isWin) {
        this.psTreeKill('SIGKILL')
          .then(_ => {
            this.executing = false;
            this.killing = false;
            resolve();
          })
          .catch(err => {
            this.killing = false;
            reject(this.createErrorObject(err));
          });
      } else {
        promisify(cp.exec)('taskkill /PID ' + this.pid + ' /T /F')
          .then(() => {
            this.executing = false;
            this.killing = false;
            resolve();
          })
          .catch(err => {
            this.killing = false;
            reject(this.createErrorObject(err));
          });
      }
    });
  }
}

module.exports = ProcessManager;

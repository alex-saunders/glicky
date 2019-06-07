// @flow
import cp, { type ChildProcess } from 'child_process';
import psTree from 'ps-tree';
import chalk from 'chalk';
import supportsColor from 'supports-color';

import { log, isWin, getPathVariableName } from '../../utils';

type KillSignal = 'SIGKILL';

export type DataObject = {|
  pid: number,
  output: ?string,
  error: boolean
|};

const emitCodesObj = {
  data: '',
  processError: '',
  exit: ''
};

export type EmitCode = $Keys<typeof emitCodesObj>;
export const emitCodes: Array<EmitCode> = Object.keys(emitCodesObj);

type Listener = (data: DataObject) => void;

export default class ProcessManager {
  proc: ChildProcess;

  pid: number;
  initCommand: string;

  killing: boolean = false;
  executing: boolean = false;

  listeners: { [EmitCode]: Array<Listener> } = {};

  get id() {
    return this.pid;
  }

  constructor(command: string) {
    this.initCommand = command;

    this.execute();
  }

  on(emitCode: EmitCode, callback: (data: DataObject) => void) {
    this.listeners = {
      ...this.listeners,
      [emitCode]: this.listeners[emitCode]
        ? [...this.listeners[emitCode], callback]
        : [callback]
    };
  }

  emit(code: EmitCode, data: DataObject) {
    const listeners = this.listeners[code];
    if (listeners) {
      for (let listener of listeners) {
        listener(data);
      }
    }
  }

  setupEvents() {
    this.proc.stdout.on('data', (data: string) => {
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
      log(
        `ProcessManager: child process ${
          this.pid
        } exited with code ${code} and signal ${signal}`
      );

      this.emitExit(code, signal);
    });
  }

  createErrorObject(err?: string): DataObject {
    return {
      pid: this.pid,
      error: true,
      output: err ? chalk.red(err) : null
    };
  }

  createDataObject(data?: string): DataObject {
    return {
      pid: this.pid,
      error: false,
      output: data || null
    };
  }

  emitData(data?: string) {
    this.emit('data', this.createDataObject(data));
  }

  emitError(err?: string) {
    this.emit('processError', this.createErrorObject(err));
  }

  emitExit(code: number, signal: string) {
    this.executing = false;

    const exitMsg = chalk.grey(
      `child process exited with code ${code} and signal ${signal}`
    );
    this.emit('exit', this.createDataObject(exitMsg));
  }

  psTreeKill(signal: KillSignal = 'SIGKILL') {
    let killTree = true;
    return new Promise<void>((resolve, reject) => {
      if (killTree) {
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
      } else {
        try {
          process.kill(this.pid, signal);
        } catch (ex) {
          reject(ex);
        }
        resolve();
      }
    });
  }

  kill(signal: KillSignal = 'SIGKILL') {
    return new Promise<void>((res, rej) => {
      if (this.killing) {
        this.emitError();
        rej();
      }
      if (!this.executing) {
        // child process has already exited
        this.emitError();
        rej();
      }
      this.killing = true;
      if (!isWin()) {
        this.psTreeKill(signal)
          .then(() => {
            this.executing = false;
            this.killing = false;
            res();
          })
          .catch(err => {
            this.killing = false;
            this.emitError(err);
            rej(err);
          });
      } else {
        try {
          cp.spawnSync('taskkill', ['/PID', this.pid.toString(), '/T', '/F']);
          this.executing = false;
          this.killing = false;
          res();
        } catch (err) {
          this.killing = false;
          this.emitError(err);

          rej(err);
        }
      }
    });
  }

  execute() {
    if (!this.initCommand) return;

    const env = Object.assign({}, process.env);
    const pathVariableName = getPathVariableName();
    // Using process.cwd until a better solution is found for (#5)
    env[pathVariableName] +=
      (isWin() ? ';' : ':') + process.cwd() + '/node_modules/.bin';
    this.proc = cp.spawn(this.initCommand, [], {
      env: Object.assign({ FORCE_COLOR: supportsColor.level }, env),
      shell: true
    });

    this.proc.stdout.setEncoding('utf8');
    this.proc.stderr.setEncoding('utf8');
    // this.proc && this.proc.stdin.setEncoding('utf-8');

    this.executing = true;
    this.setupEvents();

    this.pid = this.proc.pid;
  }
}

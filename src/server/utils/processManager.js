// @flow
import cp, { type ChildProcess } from 'child_process';
import psTree from 'ps-tree';
import chalk from 'chalk';
import supportsColor from 'supports-color';

import { log } from '../utils';

type EmitCode = 'data' | 'processError' | 'exit';
type KillSignal = 'SIGKILL';

type DataObject = {|
  pid: number,
  output: ?string,
  error: boolean
|};

export default class ProcessManager {
  proc: ChildProcess;
  socket: Socket;

  pid: number;
  initCommand: string;

  killing: boolean = false;
  executing: boolean = false;

  get id() {
    return this.pid;
  }

  constructor(command: string, socket: Socket) {
    this.initCommand = command;
    this.socket = socket;

    this.execute();
  }

  emit(code: EmitCode, data: DataObject) {
    try {
      this.socket.emit(code, data);
    } catch (err) {
      // eslint-disable-next-line
      console.error('error occured');
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
      const isWin = /^win/.test(process.platform);
      if (!isWin) {
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
          cp.spawnSync('taskkill', ['/PID', this.pid, '/T', '/F']);
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

    this.proc = cp.spawn(this.initCommand, [], {
      env: Object.assign({ FORCE_COLOR: supportsColor.level }, process.env),
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
